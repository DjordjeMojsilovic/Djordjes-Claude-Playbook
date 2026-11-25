// Checks settings.json against the official JSON schema.
//
//   node .claude/validate-settings.mjs
//
// WHY THIS EXISTS: Claude Code skips a settings file with a schema error **entirely**,
// not just the broken line. A wrong type in a single field silently disables every
// hook, every permission and both status lines. You notice it from a dialog at
// startup, or not at all.
//
// That is exactly what happened here once: `enabledPlugins` was written as an array,
// the schema requires an object. Result: the whole file was ignored.
//
// Run it by hand any time, or from CI if you set one up (e.g. a GitHub Actions
// workflow). Without network access it falls back to a built-in check of the known
// pitfalls instead of waving everything through.

import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';

const SCHEMA_URL = 'https://www.schemastore.org/claude-code-settings.json';
const CACHE = '.claude/.schema-cache.json';
const DATEIEN = ['.claude/settings.json', '.claude/settings.local.json'];

const typ = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);
let fehler = [];

// ── Get the schema: network → cache → emergency check ───────────────────────
async function holSchema() {
  try {
    const res = await fetch(SCHEMA_URL, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const s = await res.json();
      try { mkdirSync('.claude', { recursive: true }); writeFileSync(CACHE, JSON.stringify(s)); } catch { /* ignore */ }
      return { schema: s, quelle: 'network' };
    }
  } catch { /* fall through to the cache */ }
  if (existsSync(CACHE)) {
    try { return { schema: JSON.parse(readFileSync(CACHE, 'utf8')), quelle: 'cache' }; } catch { /* continue */ }
  }
  return { schema: null, quelle: 'none' };
}

// ── Recursive check ─────────────────────────────────────────────────────────
function pruefe(wert, def, pfad, schema) {
  if (!def) return;

  if (def.$ref) {
    let d = schema;
    for (const t of def.$ref.replace(/^#\//, '').split('/')) d = d?.[t];
    return pruefe(wert, d, pfad, schema);
  }

  if (def.anyOf || def.oneOf) {
    const opts = def.anyOf ?? def.oneOf;
    const vorher = fehler.length;
    const ok = opts.some((o) => {
      const n = fehler.length;
      pruefe(wert, o, pfad, schema);
      const gut = fehler.length === n;
      if (!gut) fehler.length = n;
      return gut;
    });
    if (!ok) { fehler.length = vorher; fehler.push(`${pfad}: matches none of the allowed shapes`); }
    return;
  }

  if (def.type) {
    const erlaubt = Array.isArray(def.type) ? def.type : [def.type];
    const ist = typ(wert);
    const passt =
      erlaubt.includes(ist) ||
      (erlaubt.includes('integer') && Number.isInteger(wert)) ||
      (erlaubt.includes('number') && ist === 'number');
    if (!passt) { fehler.push(`${pfad}: schema wants ${erlaubt.join('|')}, got ${ist}`); return; }
  }

  if (def.enum && !def.enum.includes(wert)) {
    fehler.push(`${pfad}: "${wert}" not allowed. Possible: ${def.enum.join(', ')}`);
  }

  if (typ(wert) === 'object') {
    for (const [k, v] of Object.entries(wert)) {
      if (k.startsWith('$')) continue; // $schema and our own $comment keys
      const kind = def.properties?.[k];
      if (kind) { pruefe(v, kind, `${pfad}.${k}`, schema); continue; }
      const pat = Object.entries(def.patternProperties ?? {}).find(([re]) => new RegExp(re).test(k));
      if (pat) { pruefe(v, pat[1], `${pfad}.${k}`, schema); continue; }
      if (def.additionalProperties === false) fehler.push(`${pfad}.${k}: unknown key`);
      else if (typeof def.additionalProperties === 'object') pruefe(v, def.additionalProperties, `${pfad}.${k}`, schema);
    }
    for (const r of def.required ?? []) if (!(r in wert)) fehler.push(`${pfad}.${r}: missing (required)`);
  }

  if (typ(wert) === 'array' && def.items) {
    wert.forEach((el, i) => pruefe(el, def.items, `${pfad}[${i}]`, schema));
  }

  if (def.deprecated || /DEPRECATED/.test(def.description ?? '')) {
    fehler.push(`${pfad}: DEPRECATED: ${(def.description ?? '').replace(/\s+/g, ' ').slice(0, 100)}`);
  }
}

// ── Emergency check without a schema ────────────────────────────────────────
// Covers the pitfalls that have already knocked out the whole file once.
function notfall(cfg, datei) {
  const erwartet = {
    env: 'object', permissions: 'object', hooks: 'object',
    enabledPlugins: 'object', extraKnownMarketplaces: 'object',
    statusLine: 'object', subagentStatusLine: 'object', attribution: 'object',
    teammateMode: 'string', model: 'string', outputStyle: 'string',
    cleanupPeriodDays: 'number', disableAllHooks: 'boolean',
  };
  for (const [k, soll] of Object.entries(erwartet)) {
    if (!(k in cfg)) continue;
    const ist = typ(cfg[k]);
    if (ist !== soll) fehler.push(`${datei}.${k}: expected ${soll}, got ${ist}`);
  }
  if ('includeCoAuthoredBy' in cfg) fehler.push(`${datei}.includeCoAuthoredBy: deprecated, use "attribution" instead`);
  if ('teammateModeEnabled' in cfg) fehler.push(`${datei}.teammateModeEnabled: does not exist, the key is "teammateMode"`);
}

// ── Run ─────────────────────────────────────────────────────────────────────
const { schema, quelle } = await holSchema();
const gepruefte = [];

for (const datei of DATEIEN) {
  if (!existsSync(datei)) continue;
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(datei, 'utf8'));
  } catch (e) {
    fehler.push(`${datei}: not valid JSON: ${e.message}`);
    continue;
  }
  gepruefte.push(datei);
  if (schema) pruefe(cfg, schema, datei.replace('.claude/', ''), schema);
  else notfall(cfg, datei.replace('.claude/', ''));
}

// From here on ONLY set `process.exitCode`, never call `process.exit()`.
// `process.exit()` right after a `fetch()` tears down the still-closing network handle
// on Windows and makes node crash with a libuv assertion and exit code 127. In CI that
// is a confusing failure instead of a clear message. `exitCode` lets the event loop
// drain cleanly.

// Careful: `gepruefte` only contains files that PARSED. A file with broken JSON is in
// `fehler` but not in `gepruefte`, which is why `fehler` is evaluated first.
// Otherwise exactly the worst case (unreadable settings.json) would pass as
// "nothing to check".
if (fehler.length > 0) {
  if (gepruefte.length > 0) console.log(`Checked: ${gepruefte.join(', ')}  (schema from: ${quelle})`);
  console.error('\nERROR: Claude Code skips a broken file ENTIRELY.');
  console.error('All hooks, permissions and status lines would have no effect.\n');
  for (const f of fehler) console.error('  · ' + f);
  process.exitCode = 1;
} else if (gepruefte.length === 0) {
  console.log('No settings file found, nothing to check.');
} else {
  console.log(`Checked: ${gepruefte.join(', ')}  (schema from: ${quelle})`);
  if (quelle === 'none') {
    console.log('WARNING: schema not reachable, only the known pitfalls were checked.');
  }
  console.log('OK: no schema violations.');
}

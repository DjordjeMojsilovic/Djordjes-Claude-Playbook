// Status line: shows the state of the order at all times.
//
// WHY: in a system with five modes and a 2-round limit, the most common source of error
// is forgetting what you are in the middle of. One glance down answers: which mode?
// Which page is stuck in round 2? How full is the context?
//
// Gets JSON on stdin, writes one line to stdout. Never blocks, costs no tokens.
// Node instead of jq, because jq is rarely installed on Windows. Node always is,
// otherwise the other hooks wouldn't run either.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const C = {
  grau: '\x1b[90m', weiss: '\x1b[97m', gruen: '\x1b[32m',
  gelb: '\x1b[33m', rot: '\x1b[31m', cyan: '\x1b[36m', reset: '\x1b[0m'
};

let d = {};
try {
  d = JSON.parse(readFileSync(0, 'utf8'));
} catch { /* an empty state is fine */ }

const teile = [];

// ── Model ───────────────────────────────────────────────────────────────────
const modell = d.model?.display_name;
if (modell) teile.push(`${C.cyan}${modell}${C.reset}`);

// ── Directory (last segment only) ───────────────────────────────────────────
const dir = d.workspace?.current_dir ?? d.cwd ?? '';
if (dir) {
  const kurz = dir.split(/[/\\]/).filter(Boolean).pop();
  if (kurz) teile.push(`${C.grau}${kurz}${C.reset}`);
}

// ── Git branch ──────────────────────────────────────────────────────────────
try {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', {
    stdio: ['ignore', 'pipe', 'ignore'], timeout: 1500, cwd: dir || process.cwd()
  }).toString().trim();
  if (branch) teile.push(`${C.grau}⎇ ${branch}${C.reset}`);
} catch { /* not a repo */ }

// ── Mode: the most important part ───────────────────────────────────────────
// First line of .claude/.mode, e.g. "M2 — Redesign homepage example.com"
let modus = null;
try {
  if (existsSync('.claude/.mode')) {
    modus = readFileSync('.claude/.mode', 'utf8').split('\n')[0].trim();
  }
} catch { /* ignore */ }

if (modus) {
  teile.push(`${C.weiss}${modus.slice(0, 42)}${C.reset}`);
} else {
  teile.push(`${C.gelb}no mode — /auftrag${C.reset}`);
}

// ── Revision loops ──────────────────────────────────────────────────────────
// Shows which route is in round 2. At >= 2 the human decides.
try {
  if (existsSync('.claude')) {
    const loops = readdirSync('.claude')
      .filter((f) => f.startsWith('.loop-'))
      .map((f) => {
        let n = 0;
        try { n = parseInt(readFileSync(`.claude/${f}`, 'utf8').trim(), 10) || 0; } catch { /* ignore */ }
        return { route: f.replace('.loop-', ''), n };
      })
      .filter((x) => x.n > 0);

    const erschoepft = loops.filter((x) => x.n >= 2);
    if (erschoepft.length) {
      teile.push(`${C.rot}⚑ ${erschoepft.map((x) => x.route).join(',')} limit${C.reset}`);
    } else if (loops.length) {
      teile.push(`${C.gelb}↻ ${loops.map((x) => `${x.route}:${x.n}`).join(',')}${C.reset}`);
    }
  }
} catch { /* ignore */ }

// ── FEHLEND: what the system can still solve itself ─────────────────────────
// Shows separately what is still solvable (blocks reporting done) and what is with
// the human (does not block). Otherwise you only notice at stop time that something hangs.
try {
  if (existsSync('FEHLEND.md')) {
    const roh = readFileSync('FEHLEND.md', 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    let loesbar = 0, mensch = 0;
    for (const z of roh.split('\n')) {
      if (!z.trim().startsWith('|')) continue;
      const s = z.split('|').map((x) => x.trim());
      if (s.length < 6) continue;
      const eimer = parseInt(s[3], 10);
      if (![1, 2, 3].includes(eimer)) continue;
      if (!/^OFFEN/i.test(s[4])) continue;
      if (eimer === 3) mensch++; else loesbar++;
    }
    if (loesbar) teile.push(`${C.gelb}⧗ ${loesbar} solvable${C.reset}`);
    if (mensch) teile.push(`${C.grau}${mensch} for you${C.reset}`);
  }
} catch { /* ignore */ }

// ── Context usage ───────────────────────────────────────────────────────────
const pct = d.context_window?.used_percentage;
if (typeof pct === 'number') {
  const farbe = pct >= 85 ? C.rot : pct >= 65 ? C.gelb : C.gruen;
  teile.push(`${farbe}${Math.round(pct)}%${C.reset}`);
} else if (d.exceeds_200k_tokens) {
  teile.push(`${C.rot}>200k${C.reset}`);
}

process.stdout.write(teile.join(`${C.grau} · ${C.reset}`));
process.exit(0);

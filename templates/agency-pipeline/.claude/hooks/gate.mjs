// Stop hook: Gate 1 of the Definition of Done (technical correctness).
// Runs when an agent wants to stop.
//   exit 0 = may stop
//   exit 2 = must continue, stderr is the reason
//   exit 1 = does NOTHING. Never use it.
//
// IMPORTANT: this gate only checks whether the code COMPILES and LINTS. It does NOT
// check whether the page looks good. That is Gate 2 (agent `aesthetic` + the human,
// see CLAUDE.md §6). A wireframe passes this gate easily. That is why it is not the
// only gate.
//
// NEW compared with the old version:
//   1. MODE-AWARE. In M1-B (befund: third-party site without code access) there is
//      no npm project to check; forcing verify there would be pointless.
//   2. LOOP GUARD. Reports when a page has hit the 2-round revision limit and the
//      human has to decide (CLAUDE.md §6).

import { execSync } from 'node:child_process';
import { existsSync, unlinkSync, readFileSync, readdirSync } from 'node:fs';

const FLAG = '.claude/.dirty';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch { /* no stdin: continue with defaults */ }

// Guard 1: endless loop. If this hook is already running because of an exit 2, let it through.
if (payload.stop_hook_active) process.exit(0);

// ── Loop guard ──────────────────────────────────────────────────────────────
// The lead keeps one file `.claude/.loop-<route>` per route and increments the number
// in it on every NACHBESSERN (revise) round. At 2 it stops; then the human decides.
// This is a NOTE, not a block: the gate should not halt the work, but prevent builder
// and aesthetic from going round in circles unnoticed.
let schleifenWarnung = '';
try {
  if (existsSync('.claude')) {
    const erschoepft = readdirSync('.claude')
      .filter((f) => f.startsWith('.loop-'))
      .map((f) => {
        let n = 0;
        try { n = parseInt(readFileSync(`.claude/${f}`, 'utf8').trim(), 10) || 0; } catch { /* ignore */ }
        return { route: f.replace('.loop-', ''), n };
      })
      .filter((x) => x.n >= 2);

    if (erschoepft.length > 0) {
      schleifenWarnung =
        '\n\nNOTE: revision limit reached (CLAUDE.md §6):\n' +
        erschoepft.map((x) => `  · ${x.route}: ${x.n} rounds`).join('\n') +
        '\nFrom here the human decides. Present the page instead of running a third round.';
    }
  }
} catch { /* the guard must never break the gate */ }

// ── Read the mode ───────────────────────────────────────────────────────────
let modus = '';
try {
  if (existsSync('.claude/.mode')) modus = readFileSync('.claude/.mode', 'utf8').trim();
} catch { /* ignore */ }

// M1-B = findings on a third-party site. No repo, no build, no Gate 1.
if (/M1-B/i.test(modus)) {
  if (schleifenWarnung) {
    console.error(
      'No technical gate in findings mode (M1-B): the patch-safety rules from the ' +
      '`befund` skill apply instead.' + schleifenWarnung
    );
    process.exit(2);
  }
  process.exit(0);
}

// Guard 2: no Node project (fresh template, foreign stack) → nothing to check.
if (!existsSync('package.json')) {
  if (schleifenWarnung) { console.error(schleifenWarnung.trim()); process.exit(2); }
  process.exit(0);
}

// Guard 3: was code touched? If not, don't check.
if (!existsSync(FLAG)) {
  if (schleifenWarnung) { console.error(schleifenWarnung.trim()); process.exit(2); }
  process.exit(0);
}

// Guard 4: is there a verify script at all? ensure-verify.mjs adds one when tsc or
// eslint are configured. If it is missing, there is nothing to check.
let hatVerify = false;
try {
  hatVerify = Boolean(JSON.parse(readFileSync('package.json', 'utf8')).scripts?.verify);
} catch { /* broken JSON → treat like "no verify" */ }

if (!hatVerify) {
  if (schleifenWarnung) { console.error(schleifenWarnung.trim()); process.exit(2); }
  process.exit(0);
}

// ── Gate 1 ──────────────────────────────────────────────────────────────────
const checks = [['Verify', 'npm run verify']];
const failures = [];

for (const [name, cmd] of checks) {
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 180000 });
  } catch (err) {
    const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim();
    failures.push(`### ${name} (${cmd})\n${out.slice(0, 3000) || String(err.message)}`);
  }
}

if (failures.length === 0) {
  try { unlinkSync(FLAG); } catch { /* already gone */ }
  if (schleifenWarnung) { console.error(schleifenWarnung.trim()); process.exit(2); }
  process.exit(0);
}

console.error(
  'Definition of Done Gate 1 not met (CLAUDE.md §6). You are not done.\n' +
  'Fix the following and only then report done:\n\n' +
  failures.join('\n\n') +
  schleifenWarnung
);
process.exit(2);

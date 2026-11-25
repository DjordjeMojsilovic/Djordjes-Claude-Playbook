// TeammateIdle hook: keeps a teammate working when it wants to go idle although its
// work has not passed Gate 1 yet.
//   exit 0 = may go idle
//   exit 2 = must continue, stderr is the reason
//
// WHY: a teammate that goes idle reports this to the lead, who ticks off the task and
// moves on. If the teammate left behind code that doesn't compile, nobody notices until
// the end. For the lead, `gate.mjs` prevents exactly that; for teammates this hook is
// the counterpart.
//
// ESCALATION BRAKE: after two blocks the hook lets it through and tells the lead that
// someone is stuck. A teammate that fails the check three times needs a decision, not
// a fourth round. Same logic as the revision limit (CLAUDE.md §6).

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const wer = payload.agent_type ?? payload.agent_id ?? 'teammate';
const zaehlerDatei = `.claude/.idle-${String(wer).replace(/[^a-z0-9_-]/gi, '_')}`;

function zaehlerLesen() {
  try { return parseInt(readFileSync(zaehlerDatei, 'utf8').trim(), 10) || 0; } catch { return 0; }
}
function zaehlerSchreiben(n) {
  try { mkdirSync('.claude', { recursive: true }); writeFileSync(zaehlerDatei, String(n)); } catch { /* ignore */ }
}

// Brake: already blocked twice → let it through, the lead decides.
if (zaehlerLesen() >= 2) {
  zaehlerSchreiben(0);
  console.error(
    `Note to the lead: "${wer}" was sent back twice and still has not passed ` +
    `Gate 1. This needs a decision, not a third round. Look at what it is stuck on ` +
    `instead of delegating again.`
  );
  process.exit(0);
}

// Nothing touched → nothing to check.
if (!existsSync('.claude/.dirty')) { zaehlerSchreiben(0); process.exit(0); }

// No Node project or no verify script → Gate 1 does not apply here.
if (!existsSync('package.json')) { zaehlerSchreiben(0); process.exit(0); }
let hatVerify = false;
try {
  hatVerify = Boolean(JSON.parse(readFileSync('package.json', 'utf8')).scripts?.verify);
} catch { /* treat broken JSON like "no verify" */ }
if (!hatVerify) { zaehlerSchreiben(0); process.exit(0); }

// Findings mode (befund) has no Gate 1.
try {
  if (existsSync('.claude/.mode') && /M1-B/i.test(readFileSync('.claude/.mode', 'utf8'))) {
    zaehlerSchreiben(0);
    process.exit(0);
  }
} catch { /* ignore */ }

// Check Gate 1.
try {
  execSync('npm run verify', { stdio: 'pipe', timeout: 180000 });
  zaehlerSchreiben(0);
  process.exit(0);
} catch (err) {
  const out = `${err.stdout ?? ''}${err.stderr ?? ''}`.trim().slice(0, 2500);
  zaehlerSchreiben(zaehlerLesen() + 1);
  console.error(
    `You wanted to go idle, but your code does not pass Gate 1 (CLAUDE.md §6).\n` +
    `Fix this and only then report done, or the lead inherits a broken state.\n\n` +
    (out || String(err.message))
  );
  process.exit(2);
}

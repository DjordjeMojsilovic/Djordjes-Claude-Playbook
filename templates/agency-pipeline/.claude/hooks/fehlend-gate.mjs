// Stop hook: the convergence loop around FEHLEND.md (the missing-items list).
//   exit 0 = may stop
//   exit 2 = must continue, stderr is the reason
//
// WHY: without this lock the `finisher` is a dead end. It fetches the logo, but nobody
// builds it into the header. It notices a hero visual is missing, but the finding only
// ends up in a table. The order counts as done although FEHLEND.md lists items the
// system could solve itself.
//
// MECHANICS: as long as FEHLEND.md has an item from bucket 1 (obtainable) or 2 (neutral
// fill) with status OFFEN (open), nobody may report done. The lead has to run the
// `finisher` again and send the results through builder/aesthetic.
//
// CONVERGENCE: three things prevent an endless loop:
//   1. Bucket 3 (never replaceable) NEVER blocks. It belongs to the human.
//   2. Hard limit after 3 rounds. Then the human decides, as everywhere else.
//   3. A round that solves nothing counts as dry and ends the loop; otherwise the
//      system gets stuck on an item it cannot solve.
//
// The status words in the table stay German because this parser matches them:
//   GELÖST/GELOEST = solved · PLATZHALTER = placeholder · OFFEN = open ·
//   NICHT MÖGLICH/NICHT MOEGLICH = not possible

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const DATEI = 'FEHLEND.md';
const RUNDE = '.claude/.fehlend-runde';
const REST = '.claude/.fehlend-rest';
const MAX_RUNDEN = 3;

let payload = {};
try { payload = JSON.parse(readFileSync(0, 'utf8')); } catch { /* defaults */ }

// If this hook is already running because of an exit 2, let it through, or it loops forever.
if (payload.stop_hook_active) process.exit(0);
if (!existsSync(DATEI)) process.exit(0);

let text;
try { text = readFileSync(DATEI, 'utf8'); } catch { process.exit(0); }

// ── Read the table ──────────────────────────────────────────────────────────
// Expected: | # | What | Bucket | Status | Source |
// HTML comment blocks are stripped so the example rows inside them don't count.
const ohneKommentare = text.replace(/<!--[\s\S]*?-->/g, '');

const STATUS = ['GELÖST', 'GELOEST', 'PLATZHALTER', 'OFFEN', 'NICHT MÖGLICH', 'NICHT MOEGLICH'];
const punkte = [];

for (const zeile of ohneKommentare.split('\n')) {
  if (!zeile.trim().startsWith('|')) continue;
  const s = zeile.split('|').map((x) => x.trim());
  if (s.length < 6) continue;
  const [, nr, was, eimerRoh, statusRoh] = s;
  if (/^-+$/.test(nr) || nr === '#' || nr === '—' || !nr) continue; // header, separator, template
  const eimer = parseInt(eimerRoh, 10);
  if (![1, 2, 3].includes(eimer)) continue;
  const status = statusRoh.toUpperCase();
  if (!STATUS.some((k) => status.startsWith(k))) continue;
  punkte.push({ nr, was, eimer, status });
}

if (punkte.length === 0) process.exit(0); // empty template or nothing recorded

// Solvable and still open = bucket 1 or 2 with status OFFEN.
const loesbarOffen = punkte.filter((p) => p.eimer !== 3 && p.status.startsWith('OFFEN'));

function lies(datei, standard = 0) {
  try { return parseInt(readFileSync(datei, 'utf8').trim(), 10) || standard; } catch { return standard; }
}
function schreib(datei, wert) {
  try { mkdirSync('.claude', { recursive: true }); writeFileSync(datei, String(wert)); } catch { /* ignore */ }
}

// ── Nothing solvable left → done, reset the counters ────────────────────────
if (loesbarOffen.length === 0) {
  schreib(RUNDE, 0);
  schreib(REST, 0);
  process.exit(0);
}

const runde = lies(RUNDE);
const restVorher = lies(REST, -1);

// ── Convergence check: did the last round solve anything? ───────────────────
// As many or more open items than before = the round was dry.
if (restVorher !== -1 && loesbarOffen.length >= restVorher) {
  schreib(RUNDE, 0);
  schreib(REST, 0);
  console.error(
    `FEHLEND.md: the last round closed no solvable item ` +
    `(${loesbarOffen.length} open, before ${restVorher}). The loop is dry.\n\n` +
    `Move these items to bucket 3 with a reason, or present them to the human:\n` +
    loesbarOffen.map((p) => `  #${p.nr} ${p.was} (bucket ${p.eimer})`).join('\n') +
    `\n\nThen you may report done.`
  );
  process.exit(2);
}

// ── Hard limit ──────────────────────────────────────────────────────────────
if (runde >= MAX_RUNDEN) {
  schreib(RUNDE, 0);
  schreib(REST, 0);
  console.error(
    `FEHLEND.md: ${MAX_RUNDEN} rounds reached, ${loesbarOffen.length} solvable items ` +
    `remain open. From here the human decides (CLAUDE.md §6).\n` +
    `List them in the report under "What stayed open", with the reason it got stuck:\n` +
    loesbarOffen.map((p) => `  #${p.nr} ${p.was} (bucket ${p.eimer})`).join('\n')
  );
  process.exit(2);
}

// ── Back into the workflow ──────────────────────────────────────────────────
schreib(RUNDE, runde + 1);
schreib(REST, loesbarOffen.length);

console.error(
  `You are not done: FEHLEND.md has ${loesbarOffen.length} item(s) the system ` +
  `can solve itself (round ${runde + 1}/${MAX_RUNDEN}).\n\n` +
  loesbarOffen.map((p) => `  #${p.nr} ${p.was} (bucket ${p.eimer})`).join('\n') +
  `\n\nHow to continue:\n` +
  `  1. Spawn \`finisher\`: it obtains (bucket 1) or builds placeholders (bucket 2)\n` +
  `  2. What it produced has to LAND: logo in the header, favicon linked,\n` +
  `     OG image set. That is \`builder\` work, not table maintenance.\n` +
  `  3. Have \`aesthetic\` re-check the affected routes.\n` +
  `  4. New gaps found along the way go into FEHLEND.md as a row.\n\n` +
  `If you can't solve an item, move it to bucket 3 and write down why. ` +
  `Then it no longer blocks.`
);
process.exit(2);

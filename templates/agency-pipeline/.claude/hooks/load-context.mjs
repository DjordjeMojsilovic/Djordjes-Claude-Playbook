// SessionStart hook: loads project memory + design + mode into Claude's context.
//
// WHY .mjs instead of .sh: node behaves the same on Windows, Mac and Linux. Every hook in
// this template is node. A bash script would only run on Windows through workarounds.
//
// Mechanics: on SessionStart, the plain stdout of this script is appended to the context.
// Always exit 0. A missing file must never block the session.
//
// NEW compared with the old version: stack.md is loaded too (the tech no longer lives in
// CLAUDE.md), so is tokens.json (the builder needs the numbers), and the current mode
// from .claude/.mode is shown.

import { existsSync, readFileSync } from 'node:fs';

function emit(file, label) {
  if (!existsSync(file)) return;
  let inhalt;
  try {
    inhalt = readFileSync(file, 'utf8');
  } catch {
    return; // unreadable: skip, don't crash
  }
  if (!inhalt.trim()) return; // an empty file adds nothing to the context
  process.stdout.write(`===== ${label} (${file}) =====\n`);
  process.stdout.write(inhalt);
  process.stdout.write('\n\n');
}

process.stdout.write('# Project memory (loaded automatically)\n');
process.stdout.write(
  '# Source of truth. If the conversation contradicts these files, the files win.\n\n'
);

// Mode first: it decides which chain and which gates apply.
if (existsSync('.claude/.mode')) {
  try {
    const modus = readFileSync('.claude/.mode', 'utf8').trim();
    if (modus) {
      process.stdout.write(`===== CURRENT MODE =====\n${modus}\n\n`);
    }
  } catch { /* ignore */ }
} else {
  process.stdout.write(
    '===== NO MODE SET =====\n' +
    'No order classified yet. Start with `/auftrag <order>` (CLAUDE.md §2).\n\n'
  );
}

emit('stack.md', 'STACK: what we build with and whether we have access');
emit('spec.md', 'SPEC: what the client wants');
emit('state.md', 'STATE: where we are');
emit('decisions.md', 'DECISIONS: why we built what we built');
emit('FEHLEND.md', 'FEHLEND: what is still missing (worked off by `finisher`)');
emit('design/design.md', 'DESIGN: binding design rules');
emit('design/tokens.json', 'TOKENS: design values, machine-readable');
emit('design/motion-plan.md', 'MOTION PLAN: wow level per page');

process.exit(0);

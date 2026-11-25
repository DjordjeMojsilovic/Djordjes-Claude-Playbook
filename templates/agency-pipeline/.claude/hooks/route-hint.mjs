// UserPromptSubmit hook: reminds the lead to classify an order first.
//
// WHY: the whole dosing logic of this template depends on `/auftrag` setting the mode
// (CLAUDE.md §2). Without a classification the lead either spins up too much machinery
// (expensive) or too little (quality drops). This hook detects two cases and only then
// pushes a hint into the context.
//
// NEVER blocks. Always exit 0. The hint is context, not an instruction to the human.
//
// Deliberately quiet: it only fires when no mode is set yet or a URL shows up. A hook
// that says something on every prompt gets ignored.

import { existsSync, readFileSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const prompt = String(payload.user_message ?? payload.prompt ?? '');
if (!prompt.trim()) process.exit(0);

// Don't comment on our own slash commands, or the hook talks over `/auftrag`.
if (/^\s*\//.test(prompt)) process.exit(0);

const hinweise = [];

// ── Case 1: URL in the prompt ───────────────────────────────────────────────
// A third-party URL almost always means work on an existing site: either M1-A (we have
// the code) or M1-B (only the live site). The difference is recorded in stack.md.
const urls = prompt.match(/https?:\/\/[^\s<>"')\]]+/gi) ?? [];
if (urls.length > 0) {
  let zugriff = 'unknown';
  try {
    if (existsSync('stack.md')) {
      const m = readFileSync('stack.md', 'utf8').match(/^\s*zugriff:\s*([a-z-]+)/mi);
      if (m) zugriff = m[1];
    }
  } catch { /* ignore */ }

  hinweise.push(
    `The order contains a URL (${urls.slice(0, 3).join(', ')}). This is work on an ` +
    `existing site: the \`recon\` agent surveys the site before anything gets ` +
    `built. Don't start without having seen it.\n` +
    `  · stack.md says zugriff: ${zugriff}\n` +
    `  · zugriff: repo    → M1-A or M2, changes go into the client repo\n` +
    `  · zugriff: nur-url → M1-B, vanilla patches into befund/<domain>/`
  );
}

// ── Case 2: no mode set ─────────────────────────────────────────────────────
if (!existsSync('.claude/.mode') && prompt.trim().length > 25) {
  hinweise.push(
    'No mode is set for this session yet (`.claude/.mode` is missing). ' +
    'Classify the order with `/auftrag` before you spawn agents: ' +
    'the mode decides which chain runs and which gates apply (CLAUDE.md §2).'
  );
}

if (hinweise.length === 0) process.exit(0);

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: '[route-hint]\n' + hinweise.join('\n\n')
  }
}));

process.exit(0);

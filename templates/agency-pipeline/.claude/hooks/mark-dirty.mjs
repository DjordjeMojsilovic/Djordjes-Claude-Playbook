// PostToolUse hook: sets a flag when a code file was touched.
// Useless on its own: it is the trigger for gate.mjs, which only checks when code
// really changed, instead of after every answer. Never blocks.
//
// NEW compared with the old version: exemptions. Without them the verify gate also
// fired on a vanilla JS patch under befund/. There is no tsc and no eslint there, so
// the gate ran into nothing and blocked the agent for no reason.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const file = String(payload.tool_input?.file_path ?? '').replace(/\\/g, '/');

// These paths do NOT count as code for Gate 1:
//   befund/   → deliverables for third-party sites, vanilla, no build (M1-B)
//   .claude/  → machinery (locked by protect.mjs anyway)
//   design/   → documentation and tokens
//   node_modules/, .next/ → third-party code / build artefacts
const ausgenommen =
  /(^|\/)befund\//i.test(file) ||
  /(^|\/)\.claude\//i.test(file) ||
  /(^|\/)design\//i.test(file) ||
  /(^|\/)node_modules\//i.test(file) ||
  /(^|\/)\.next\//i.test(file);

const istCode = /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(file);

if (istCode && !ausgenommen) {
  try {
    mkdirSync('.claude', { recursive: true });
    writeFileSync('.claude/.dirty', '');
  } catch { /* a write error must never stop the flow */ }
}

process.exit(0);

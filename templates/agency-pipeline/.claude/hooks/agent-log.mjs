// SubagentStop hook: records which agent finished when.
//
// WHY: with nine agents on different models, the most common question after a failed
// run is "who actually built this?". Without a log that can't be reconstructed: every
// subagent has its own context, and the lead's transcript only shows the result.
//
// The file .claude/.agentlog is runtime state and is in .gitignore.
// Never blocks. Always exit 0.

import { readFileSync, appendFileSync, mkdirSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const zeit = new Date().toISOString().replace('T', ' ').slice(0, 19);
const typ = payload.agent_type ?? 'unknown';
const id = String(payload.agent_id ?? '').slice(0, 8);

// Only the first line of the final report: the log should stay readable, not
// duplicate the whole report.
const nachricht = String(payload.last_assistant_message ?? '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 160);

try {
  mkdirSync('.claude', { recursive: true });
  appendFileSync(
    '.claude/.agentlog',
    `${zeit}  ${typ.padEnd(12)} ${id.padEnd(8)} ${nachricht}\n`
  );
} catch { /* the log is a convenience, never a reason to fail */ }

process.exit(0);

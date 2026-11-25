// PreToolUse hook: stops an agent from rewriting the ground-rule files itself.
// Fires before Write/Edit/MultiEdit/NotebookEdit.
//
// WHY: a multi-agent system with creative freedom could decide to write away exactly
// the rules that constrain it. After three days you would no longer know which rules
// apply. That is the opposite of control.
//
// Mechanics: exit code 2 reliably blocks the tool call. The JSON route
// ("permissionDecision: deny") is not honoured by the Edit tool on every version,
// so exit 2 is the primary route and the JSON is only a fallback.
//
// SECOND LAYER: settings.json also has a permissions.deny on the same paths.
// Two independent mechanisms, because one alone does not hold everywhere.
// THIRD LAYER: the rule in CLAUDE.md §9.
//
// PROTECTED:     CLAUDE.md and the machinery under .claude/
//                 (agents/, skills/, hooks/, settings*.json)
// NOT protected: stack.md, spec.md, decisions.md, state.md, design/*, befund/*
//                 (they belong to the skills and may be changed through them).
// EXEMPT:        runtime state under .claude/: .mode, .loop-*, .dirty,
//                 .agentlog, .besitz, .idle-*, .fehlend-*.
//                 These are NOT rules but scratch notes of the running order.
//                 `/auftrag` writes .mode, and before a fan-out the ownership map
//                 .besitz; the lead counts revision rounds in .loop-<route>.
//                 All of them are in .gitignore.
//
// If YOU (the human) want to change CLAUDE.md: do it directly in the editor, not
// through Claude Code. That is the whole point of the protection.

import { readFileSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // no/invalid stdin: don't block
}

// Normalise backslashes so Windows paths hit the same patterns.
const file = String(payload.tool_input?.file_path ?? '').replace(/\\/g, '/');

// Runtime state: explicitly allowed. Must be checked BEFORE the lock.
const istLaufzeit =
  /(^|\/)\.claude\/\.mode$/i.test(file) ||
  /(^|\/)\.claude\/\.loop-[^/]*$/i.test(file) ||
  /(^|\/)\.claude\/\.dirty$/i.test(file) ||
  /(^|\/)\.claude\/\.agentlog$/i.test(file) ||
  /(^|\/)\.claude\/\.besitz$/i.test(file) ||
  /(^|\/)\.claude\/\.idle-[^/]*$/i.test(file) ||
  /(^|\/)\.claude\/\.fehlend-[^/]*$/i.test(file);

const geschuetzt = !istLaufzeit && (
  /(^|\/)CLAUDE\.md$/i.test(file) ||
  /(^|\/)\.claude\//i.test(file)
);

if (geschuetzt) {
  const grund =
    `Blocked: ${file} is a ground-rule file (CLAUDE.md / .claude/). ` +
    `No agent changes these itself (CLAUDE.md §9). Propose the change to the human; ` +
    `they make it in the editor.`;

  // Fallback route (JSON), in case the tool type honours it:
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: grund
    }
  }));

  // Primary route: exit 2 blocks reliably, stderr goes to the agent.
  process.stderr.write(grund + '\n');
  process.exit(2);
}

process.exit(0);

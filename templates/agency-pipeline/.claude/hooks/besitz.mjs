// PreToolUse hook: file ownership. Stops two teammates working in parallel from
// touching the same file and overwriting each other.
//
// WHY: this is THE reason parallel agents fail in practice. Two builders changing
// `globals.css` or `layout.tsx` at the same time don't produce a merge conflict:
// one silently overwrites the other, and nobody notices until something is missing.
// Git doesn't help, because both sit in the same worktree.
//
// MECHANICS: before the fan-out the lead writes an ownership map:
//
//   .claude/.besitz   (JSON, covered by .gitignore)
//   {
//     "gemeinsam": ["src/app/layout.tsx", "src/app/globals.css", "tailwind.config.*"],
//     "zuteilung": {
//       "build-services": ["src/app/services/**", "src/components/services/**"],
//       "build-contact":  ["src/app/contact/**",  "src/components/contact/**"]
//     }
//   }
//   ("gemeinsam" = shared, "zuteilung" = assignment. Keep these key names.)
//
// RULES:
//   · File in "gemeinsam"           → only the lead may touch it. Teammates are blocked.
//   · File in someone else's list   → blocked, naming the owner.
//   · File in your own list         → allowed.
//   · File in nobody's list         → allowed (e.g. a new shared component; that is
//                                     settled by agreement, not by the lock).
//   · No .besitz file               → allowed. Single-agent work is left alone.
//
// The lead is recognised by the payload carrying NO agent_id. The lead may touch
// everything: it coordinates and handles the shared files.

import { readFileSync, existsSync } from 'node:fs';

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // no/invalid stdin: don't block
}

const KARTE = '.claude/.besitz';
if (!existsSync(KARTE)) process.exit(0); // no parallel work

let karte;
try {
  karte = JSON.parse(readFileSync(KARTE, 'utf8'));
} catch {
  process.exit(0); // a broken map must never stop the work
}

const datei = String(payload.tool_input?.file_path ?? '').replace(/\\/g, '/');
if (!datei) process.exit(0);

// Who am I? Without agent_id it is the lead.
const wer = payload.agent_id ? (payload.agent_type ?? payload.agent_id) : null;
const istLead = wer === null;
if (istLead) process.exit(0); // The lead coordinates and may go anywhere.

// Trim absolute paths to the project root so patterns like "src/app/**" match.
// The lookahead boundary is kept on purpose: otherwise the block message would show
// a truncated path, and the agent would look for the wrong file.
const rel = datei
  .replace(/^.*?(?=src\/|app\/|components\/|befund\/|design\/|prisma\/|supabase\/)/, '')
  .replace(/^\.\//, '');

/** Minimal glob: ** = any depth, * = one segment, everything else literal. */
function trifft(muster, pfad) {
  // '\0' is a temporary placeholder for ** so the single-* step doesn't touch it.
  const rx = new RegExp(
    '^' +
      muster
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*/g, '\0')
        .replace(/\*/g, '[^/]*')
        .replace(/\0/g, '.*') +
      '$'
  );
  return rx.test(pfad) || rx.test(datei);
}

// 1. Shared files: lead only.
for (const muster of karte.gemeinsam ?? []) {
  if (trifft(muster, rel)) {
    process.stderr.write(
      `Blocked: ${rel} is a SHARED file (ownership map .claude/.besitz).\n` +
      `Teammates working in parallel must not change it: the second one would ` +
      `silently overwrite the first.\n` +
      `Send the lead what needs to change via SendMessage. The lead applies it.\n`
    );
    process.exit(2);
  }
}

// 2. Someone else's assignment.
const zuteilung = karte.zuteilung ?? {};
for (const [eigentuemer, muster] of Object.entries(zuteilung)) {
  if (eigentuemer === wer) continue;
  for (const m of muster) {
    if (trifft(m, rel)) {
      // Is it ALSO mine? Then the map contradicts itself: let it through and report.
      const auchMeins = (zuteilung[wer] ?? []).some((eigen) => trifft(eigen, rel));
      if (auchMeins) {
        process.stderr.write(
          `Warning: ${rel} is assigned twice in the ownership map (${wer} and ${eigentuemer}). ` +
          `Report this to the lead: the map is wrong.\n`
        );
        process.exit(0);
      }
      process.stderr.write(
        `Blocked: ${rel} belongs to "${eigentuemer}", you are "${wer}" ` +
        `(ownership map .claude/.besitz).\n` +
        `Two agents on the same file overwrite each other. Send "${eigentuemer}" ` +
        `what you need via SendMessage, or ask the lead to reassign it.\n`
      );
      process.exit(2);
    }
  }
}

process.exit(0);

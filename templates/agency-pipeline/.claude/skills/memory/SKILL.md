---
name: memory
description: "Maintains the project memory: decisions.md (why we built what we built) and state.md (where we are). Use when a decision should be recorded, the state updated or the memory corrected. Also at the end of a session to bring state.md up to date."
argument-hint: "[what to remember; empty = update state.md]"
disallowed-tools: Bash
allowed-tools: Read, Write, Edit, Glob, Grep
model: haiku
---

# Memory

`$ARGUMENTS` = what should be remembered, changed or corrected.
Empty → bring `state.md` up to date from the session history.

## Two files, two purposes
| File | Purpose | Write rule |
|---|---|---|
| `decisions.md` | WHY we built what we built | **Append-only.** Never delete, only add. New on top. |
| `state.md` | WHERE we are | **Overwrite.** Always only the current state. |

`spec.md` belongs to `/intake`. `stack.md` belongs to `recon`. `design/*` belongs to the
design flow. Memory doesn't touch them.

## Routing
- Decision · "we take X instead of Y" · "remember why" → **decisions.md**
- Progress · "this is done" · "next" · "this depends on …" → **state.md**
- Correction · "that's not right" → open the affected file, change the line.
  Delete nothing silently.

## decisions.md: add an entry on top
```
## [YYYY-MM-DD] — [short title]
**Decision:** …
**Why:** …
**Rejected:** … — because …
**Affects:** …
```
Required: **What · Why · Rejected.** If "Rejected" is missing, ask for it: without an
alternative it is not a decision but a note. The reason is never "better": name the
trade-off.

## state.md: overwrite
Sections: `Mode` · `In progress` · `Next` · `Blocked` · `Do not touch` ·
`Gate 2 status per page`. Timestamp and who. Empty sections stay "—". Invent nothing.

Don't forget the **Gate 2 status** table: it stops a new session from tearing open a
page that was already approved.

## Self-update (end of session, `$ARGUMENTS` empty)
Rewrite `state.md` from the history. Only **observable facts**: what was built,
checked, merged. No invented next steps. Always show as a diff, never write silently.

## Limits
- **Human beats Claude.** Contradiction → the human wins; the old state is marked as
  superseded, not deleted.
- **No invention.** What wasn't said or built doesn't go in.
- **Never rewrite `decisions.md`.** Wrong decision → new entry on top:
  "replaces [title] from [date]".

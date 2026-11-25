---
name: intake
description: Turns raw client input into spec.md and open-questions.md. Finds gaps, separates blockers from assumptions, sets the track (brochure/experience) and captures design references. Use in M3 (new build) as the first step, and for updates when client answers come in.
argument-hint: "[raw client text or client answers]"
disable-model-invocation: true
disallowed-tools: Bash, Edit
model: opus
effort: high
---

# Intake

`$ARGUMENTS` = raw client text or client answers.

## Mode
`spec.md` is empty/the template → **first mode**, write both files fresh.
`spec.md` is filled → **update mode**: work in the answers, delete settled items from
`open-questions.md`. Never overwrite confirmed lines.

## Sources
Only `$ARGUMENTS`, `CLAUDE.md`, `design/design.md`. **Project code is not read.**
For work on existing sites also `design/recon/<domain>.md`: it shows what is already
there.

## Set the track: it steers everything visual
Decide whether the project runs on **Track A (brochure)** or **Track B (experience)**
(CLAUDE.md §4).

Rule of thumb: does the client sell itself through the site itself (agency, startup,
portfolio, product) → **B**. Is it about clarity and credibility (real estate, trades,
law firm) → **A**.

Derive the track from the project type, **give the reason** and write it into
`spec.md §0`. In genuine doubt: as a question in `open-questions.md`. The track decides
the whole visual effort and is expensive to correct later.

## Cost test
For every gap: **If I guess wrong, what does the correction cost?**

| Cost of the mistake | Category |
|---|---|
| Minutes: one field, one text | ASSUMPTION → guess, label it, move on |
| Can't be guessed, only needed at the end | LATER → build around it |
| Days: built work gets torn down | BLOCKER → stop, ask |

Always a BLOCKER while unresolved: languages · auth/roles · payment · external
providers with contract costs · data ownership · migration. **The track in genuine
doubt** as well.

## No-invention rule
- What the client didn't say is an ASSUMPTION, never a fact. Especially for data fields.
- Every field not named gets `(assumed)`; collected entry in §7.
- WebSearch allowed. Separate **sourced** (opened source, URL) from **unsourced**.
  Prices, terms and claims about third parties never without an opened source.
- No numbers or prices in the message to the client.
- Copy nothing verbatim from the templates.

## Testability
Form: `GIVEN <state>, WHEN <action>, THEN <observable result>`.

Invalid with "or" in the THEN, with non-observable verbs (explains, shows, informs),
with a reference to open items, or with quality claims (high-quality, clean).
Untestable → becomes a question in `open-questions.md`, not deleted.

## Rules
- **No tech stack in `spec.md`.** It belongs in `stack.md`. Exception: the client
  prescribes it → then as a constraint in §5.
- At most 7 questions. More → prioritise by cost, the rest become assumptions.
- The client's questions to you don't belong in the spec.

## Template spec.md
The skeleton in the project root (`spec.md`) has the section numbers the other skills
cite: §0 Track · §1 Core goal · §2 Roles · §3 Data · §4 Acceptance criteria ·
§5 Constraints from the client · §6 Out of scope · §7 Assumptions. Keep the numbering.

## Template open-questions.md
```markdown
# Open items – [project]
Gate: development starts at BLOCKER = 0.

## BLOCKER (0/N resolved)
1. [question] → needs: [what] → blocks: [F1] → costs if wrong: [what gets torn down]

## LATER (before deploy)
## ASSUMPTIONS (run along until contradicted)

---
## For the client — copy as is
Hi [name],
to get started I still need [N] things from you:
1. …
Everything else we'll handle as discussed.
```

> **Example locale:** the original template wrote this client message in Swiss German
> dialect. Write it in whatever language and register you use with your clients.

## References
Runs once per project, **outside the 7-question limit**. Prevents a generic look;
together with real tokens it is the biggest lever on quality.

Ask for 1–3 references (sites that fit and look good):
- **Link** → into `design/references.md`, with a reason (layout/type/colour/motion/mood)
- **Photo** → note the file name; the human puts the image into `design/references/`
- **Counter-example** → optional but valuable: what the client does *not* want, with a
  reason

No reference → entry in `open-questions.md` under LATER. Invent nothing.

## Wrap-up
```
track: [A or B] — [reason in half a sentence]
spec.md: [N] criteria across [M] features · [N] assumed fields
references: [N] links · [M] images · [counter-example MISSING → LATER]
BLOCKER: [N] · LATER: [N] · ASSUMPTIONS: [N]
→ [START CLEARED] or [BLOCKED: F_ until client answers]
```

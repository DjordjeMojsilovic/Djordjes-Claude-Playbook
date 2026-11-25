# CLAUDE.md

<!-- WHY THIS FILE: the house rules. Every agent reads it at session start.
     It contains ONLY invariants: rules that apply to EVERY order.

     Kept short on purpose: long house rules get followed worse. Anything that only
     applies to one area lives in `.claude/rules/` and loads automatically as soon as
     someone touches matching files; otherwise it would only cost context.
     Anything project-specific lives in `stack.md` and `spec.md`.

     These HTML comments are stripped before context injection and cost no tokens. -->

## 1. Context
We're a small studio that builds websites for businesses, often with login, admin and
form-to-email. Clients are non-technical and edit content themselves. Keep admin
screens and error messages simple accordingly.

## 2. Every order starts with `/auftrag`
No matter how small it looks. The router decides the **mode** and with it which agents
run and which gates apply. A two-line fix does not get the same machinery as a new
build. That is the core of this template.

| Mode | Trigger | Chain |
|---|---|---|
| **M0** Micro | Typo, colour value, line of text | lead alone |
| **M1-A** Patch | Code access + concrete instruction | recon → builder → aesthetic |
| **M1-B** Findings (`befund`) | Only a URL, no code access | recon → builder *(vanilla)* → aesthetic |
| **M2** Redesign | Existing site + quality judgment ("looks dated") | recon → **aufwertung** → design-tokens → concept → copy → builder → aesthetic → qa |
| **M3** New build | New website | intake → motion-scale → design-tokens → concept → copy → builder → aesthetic → qa |
| **M4** Infra | Login, DB, form, admin | backend → builder → qa |

Modes may be combined. When in doubt, pick the **bigger** one and say why.

**Autopilot** switches on for an open mandate ("make this 20x better", "just go").
Then the agents decide for themselves, do **not** ask in between, and at the end hand
over **one** `BERICHT.md` (report): what was decided, what is still needed from the
human. Unaffected: the no-invention rule, the 2-round limit, security, legal.

## 3. The stack lives in `stack.md`, not here
`stack.md` says which tech *this* project runs on and whether we have code access
(`zugriff: repo | nur-url | staging`; zugriff = access, nur-url = URL only. Keep these
words as they are, hooks read them).
**Read it before the first line of code.**

For third-party projects, `recon` writes the file from what it finds, not from
assumptions. No added package without asking. Every dependency is maintenance.

## 4. The two tracks: they decide everything visual
A project runs on **one** of two tracks. Which one is in `spec.md §0`.
If unclear: ask, don't guess.

**Track A: Brochure.** The client wants clarity and credibility (real estate, trades,
law firm). Calm, clean, subtle fade-ins. Restraint is quality here; too much effect
looks cheap.

**Track B: Experience.** The client sells itself through the site (agency, startup,
portfolio, product). A strong visual presence is **required, not optional**.
An experience site that looks like a brochure has failed, even if it is technically
flawless.

On Track B, invention in the **visual** layer is welcome. References (Vercel,
Linear …) are a springboard to surpass, not a ceiling.

## 5. Design
Binding: `design/design.md` and `design/tokens.json`. On conflict, `design.md` wins.
If the brand section (`design.md §0`) is missing → **don't design**; ask for colour,
logo and typeface.

**Minimal does not mean empty.** Linear is minimalist *and* stunning, through depth,
subtle gradients, micro-animation. Minimal refers to the *number* of elements, not the
*quality* of each one. Bare is a mistake, not a style.

### The three forbidden default clusters
These combinations show up in AI design regardless of topic and are the reason AI
sites all look alike. **Forbidden** unless the brief asks for them:
1. Warm cream + serif + terracotta
2. Near-black + acid green or vermilion
3. Newspaper layout with hairline dividers

Whoever builds one of these didn't decide; they took the default.

Details on tokens, motion and registries: `.claude/rules/oberflaeche.md`. It loads
automatically for UI work.

## 6. Definition of Done
Two gates. Which ones apply depends on the mode.

**Gate 1: technically correct.** Enforced by hooks (and CI if you set one up), as long
as it is a Node project: `tsc --noEmit` · `lint` · `build` · `playwright`. Locally the
Stop hook runs `npm run verify`; the rest belongs in CI (for example a GitHub Action).

In **M1-B (findings)** there is no Gate 1. The patch-safety rules from
`.claude/rules/befund.md` apply instead.

**Gate 2: aesthetically strong.** Gate 1 checks whether it *works*. It does **not**
check whether it *looks good*; a wireframe passes Gate 1 easily. A page only counts as
done once `aesthetic` has checked it against the track and motion level **and** the
human has approved it.

**The revision loop is capped at 2 rounds.** After that the human decides. From round 3
on, the system goes in circles. Counter: `.claude/.loop-<route>`, visible in the status
line.

## 7. Way of working
- No code without a criterion in `spec.md`. Missing → ask. (Exception M0/M1: there the
  client's instruction is the criterion.)
- No file over 300 lines. If it grows beyond that → ask first.
- **Code structure:** existing patterns in the repo beat new ideas.
  **Visual design:** follow the track; on Track B novelty is welcome.
  (The old blanket rule "existing patterns beat new ideas" used to smother creativity.)
- No sycophantic openers, no closing waffle. Direct.
- Claims about libraries only after checking the docs (`context7`).
  Unsure = say so, don't guess.

## 8. Security
- Secrets never in client code, never in `NEXT_PUBLIC_*`. Server only.
- Protected routes check the session **server-side**. A client redirect is not
  protection.
- Third-party client sites: never ship code that opens external requests, overrides
  global styles or breaks the page without JS.

The `backend` agent owns these questions. Details: `.claude/rules/datenschicht.md`.

## 9. Immutable
No agent changes `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.claude/hooks/`,
`.claude/rules/` or `settings.json`. These are the rules and the machinery. Whoever
thinks a rule has to go **proposes it to the human**.

Two independent locks: the hook `protect.mjs` **and** `permissions.deny` in
`settings.json`. Runtime state is exempt (`.claude/.mode`, `.loop-*`, `.dirty`,
`.agentlog`, `.besitz`, `.idle-*`, `.fehlend-*`): these are scratch notes, not rules.

`stack.md`, `spec.md`, `decisions.md`, `state.md` and `design/*` belong to the skills
and may be changed through them.

If **you** (the human) want to change the rules: directly in the editor, not through
Claude Code.

## 10. Project memory
Loaded automatically at session start, source of truth:
`spec.md` (what the client wants) · `stack.md` (with what) · `decisions.md` (why,
append-only) · `state.md` (where we are) · `FEHLEND.md` (what is still missing).

**Every `[ANGABE FEHLT: …]` (missing info) marker in the code goes into `FEHLEND.md`
as a row.** Otherwise the `finisher` never finds it and it slips silently into the live
site. The finisher sorts every item into **obtainable** (it fetches it from the client's
domain), **neutral fill** (marked placeholder) or **never replaceable** (stays with the
human). When in doubt it is always "never replaceable": an invented "for over 20 years"
is a false statement in the client's name, not a time saver.

**The gaps loop back into the workflow.** `finisher` obtains → `builder` builds it
**in** → `aesthetic` checks the touched routes → new gaps go back into `FEHLEND.md`.
The hook `fehlend-gate.mjs` blocks reporting done as long as an item from bucket 1 or 2
is open. The loop ends when nothing solvable is left, when a round closes nothing (dry),
or after 3 rounds.

`GELÖST` (solved) means **arrived in the code**: a logo under `public/` that no
template includes is not solved. Whoever gets stuck moves the item to bucket 3 with a
reason; that is honest and ends the block.

If the conversation contradicts these files, the files win. New decision made →
`scribe` or `/memory` before the session ends.

## 11. The agents: who owns what
Each owns **one** dimension. Anyone unsure whether they are responsible isn't.

| Agent | Model | owns |
|---|---|---|
| `recon` | Sonnet | survey of third-party sites, writes `stack.md` |
| `concept` | **Opus** | visual metaphor, hero moment |
| `copy` | Sonnet | every word the visitor reads |
| `builder` | Sonnet | the implementation |
| `aesthetic` | **Opus** | the visual judgment (Gate 2), **never builds itself** |
| `backend` | **Opus** | data model, RLS, auth, secrets |
| `qa` | Haiku | breakpoints, contrast, keyboard, dead links |
| `finisher` | **Opus** | work off `FEHLEND.md`: obtain, fill, leave open |
| `scribe` | Haiku | `state.md`, `decisions.md` |

The **lead** (main session) conducts and is the only interface to the human.

## 12. Building in parallel: only under conditions
Agent teams are enabled, but they are **not** the normal case. They pay off in exactly
one place: building several pages at once. The chain before that is sequentially
dependent; parallelism brings nothing there.

**Four conditions, all required:** M2 or M3 · at least 3 pages · the pages share no
files · concept, tokens and copy are already settled.

**Before every fan-out the lead writes the ownership map `.claude/.besitz`.** Two
agents on the same file silently overwrite each other; Git doesn't help, both sit in
the same directory. The hook `besitz.mjs` blocks every violation. Shared files
(`layout.tsx`, `globals.css`, `package.json`) belong **to the lead alone**; teammates
send it what should go in via `SendMessage`.

At most 3–4 teammates. `aesthetic` and `qa` stay subagents; as teammates they would
become the new bottleneck.

In team mode, `skills:` and `mcpServers:` from the agent definition do **not** apply
(`tools:` and `model:` do). The spawn prompt must therefore name the needed skill
explicitly.

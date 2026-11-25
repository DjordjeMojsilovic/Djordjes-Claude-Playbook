# Agency pipeline

I built this for my studio. We make websites for small businesses, often with a login,
an admin area and forms that send email. The setup is a Claude Code project
configuration: nine agents, thirteen skills (one of them is the router), twelve hook
scripts and three path-scoped rule files.

The original is in German. This is an English translation with every client detail
removed. Some German names are still in it on purpose, because the hooks and skills look
each other up by those names. The glossary at the end explains them.

## The idea: not every request gets the full machinery

The first time I used multi-agent setups, every request went through the same long
chain. A typo fix got a concept phase, a design review and a QA pass. That was slow,
expensive, and it made small changes worse.

So every order starts with the router, `/auftrag`. It reads the request, checks whether
we have the code (`stack.md`), and picks a **mode**. The mode decides which agents run
and which gates apply. It writes the mode to `.claude/.mode`, where the hooks and the
status line can see it.

| Mode | When | Agent chain |
|---|---|---|
| **M0** Micro | One named detail: typo, colour value, a line of text, a link | the lead (main session) alone |
| **M1-A** Patch | Concrete instruction, and we have the code | `recon` → `builder` → `aesthetic` |
| **M1-B** Findings | Concrete instruction, but only a URL, no code access | `recon` → `builder` (vanilla CSS/JS patches) → `aesthetic` |
| **M2** Redesign | Existing site plus a vague judgment ("looks dated") | `recon` → `aufwertung` → `design-tokens` → `concept` → `copy` → `builder` → `aesthetic` → `qa` |
| **M3** New build | A new website or a large new section | `intake` → `motion-scale` → `design-tokens` → `concept` → `copy` → `builder` → `aesthetic` → `qa` |
| **M4** Infra | Login, database, form-to-email, admin, roles | `backend` → `builder` → `qa` |

Modes can be combined ("add a login and tidy up the header" is M4 + M1-A). When in doubt
the router picks the bigger mode and says why. At the end of M1–M4 the lead runs `qa` if
it hasn't run yet, then `finisher` (closes gaps from `FEHLEND.md`), then `scribe`
(updates the memory files).

For an open mandate ("make this 20x better") the router switches on **autopilot**: no
questions in between, one `BERICHT.md` report at the end. Autopilot never relaxes the
no-invention rule, the 2-round limit, security or legal.

## The agents and their models

The model follows the cost of a mistake, not the size of the task.

| Agent | Model | Owns |
|---|---|---|
| `concept` | opus | visual concepts before building: metaphor, motion idea, hero moment |
| `aesthetic` | opus | Gate 2, the visual verdict. Has no Write/Edit tools, so it can't quietly fix things and go soft |
| `backend` | opus | data model, row-level security, auth, secrets, server routes |
| `finisher` | opus | works through `FEHLEND.md`: fetch, fill neutrally, or leave for the human |
| `recon` | sonnet | surveys an existing site, extracts real tokens from the DOM, writes `stack.md` |
| `copy` | sonnet | every word a visitor reads |
| `builder` | sonnet | the implementation |
| `qa` | haiku | breakpoints, measured contrast, keyboard, dead links, console errors |
| `scribe` | haiku | `state.md` and `decisions.md` |

- **Judgment runs on Opus.** A weak concept, a mild design verdict, a missing RLS policy
  or an invented "20 years in business" costs far more than the tokens.
- **Building runs on Sonnet.** The decisions are already made and written down
  (spec, tokens, motion plan, concept); the builder executes them.
- **Checks and memory run on Haiku.** Measuring contrast and writing a status file are
  mechanical. They should be cheap, so they run on every page and every session instead
  of only the important ones.

The subagent status line colours each running agent by model tier, so you can see when
the wrong tier is doing a job.

## Definition of Done: two gates

**Gate 1: technically correct.** `npm run verify` (type check and lint, added
automatically by `ensure-verify.mjs` if missing) must pass before an agent may stop.
The Stop hook `gate.mjs` enforces it. Build and Playwright belong in CI if you set one
up. In M1-B there is no build, so Gate 1 is replaced by the patch-safety rules in
`.claude/rules/befund.md`.

**Gate 2: aesthetically strong.** A wireframe passes Gate 1 easily. Gate 2 is the
`aesthetic` agent judging screenshots (desktop and 375px) against the track, the tokens
and the page's motion level, and then the human approving. The verdict is
`BESTANDEN` (passed) or `NACHBESSERN` (revise). The builder↔aesthetic loop is capped at
2 rounds per page; after that the human decides.

## The hooks

| Script | Event | What it does |
|---|---|---|
| `load-context.mjs` | SessionStart | Loads mode, `stack.md`, `spec.md`, `state.md`, `decisions.md`, `FEHLEND.md` and the design files into context. |
| `route-hint.mjs` | UserPromptSubmit | Reminds the lead to run `/auftrag` when no mode is set, and to run `recon` first when the prompt contains a URL. |
| `protect.mjs` | PreToolUse | Blocks edits to `CLAUDE.md` and `.claude/`, except the runtime state files. |
| `besitz.mjs` | PreToolUse | When parallel teammates run, blocks edits to files owned by someone else or shared files (ownership map `.claude/.besitz`). |
| `mark-dirty.mjs` | PostToolUse | Flags that code was touched, so Gate 1 only runs when needed. |
| `ensure-verify.mjs` | PostToolUse | Adds a `verify` script to `package.json` from what is actually configured (tsc, eslint). |
| `teammate-idle.mjs` | TeammateIdle | Sends a teammate back if its code fails Gate 1; lets it through after two tries and tells the lead. |
| `agent-log.mjs` | SubagentStop | Appends one line per finished agent to `.claude/.agentlog`. |
| `gate.mjs` | Stop | Gate 1, plus a warning when a page has hit the 2-round revision limit. |
| `fehlend-gate.mjs` | Stop | Blocks "done" while `FEHLEND.md` has solvable open items; ends after 3 rounds or a round that closes nothing. |
| `statusline.mjs` | statusLine | Shows model, branch, mode, revision loops, open `FEHLEND.md` items and context usage. |
| `subagent-statusline.mjs` | subagentStatusLine | Shows each running agent with its model tier, status, time and context usage. |

`.claude/validate-settings.mjs` is not a hook. Run it by hand after editing settings:
Claude Code skips a settings file with a schema error entirely, which silently turns off
every hook.

## Install

1. Copy `CLAUDE.md`, `.claude/` and `.mcp.json` into the root of your project.
   Merge the lines from `.gitignore` into yours.
2. Copy the skeleton files too: `stack.md`, `spec.md`, `state.md`, `decisions.md`,
   `FEHLEND.md`, `LIBRARIES.md` and `design/`.
3. Fill in `stack.md` (at least the `zugriff:` line and your stack). Fill in `spec.md`,
   or let `/intake` write it from the client's brief.
4. Edit `CLAUDE.md §1` to describe your studio, and `design/design.md §8` for your
   language and locale.
5. Run `node .claude/validate-settings.mjs` from the project root.
6. Start with:

   ```
   /auftrag "<what the client wants>"
   ```

Requirements: Node 18 or newer (`validate-settings.mjs` and `hol-asset.mjs` use the
built-in `fetch`), Claude Code, and the
MCP servers in `.mcp.json` (shadcn, chrome-devtools, playwright, context7). Agent teams
are switched on in `settings.json`; turn them off with `settings.local.json.example`.

The rules files are protected from agents. To change them, edit them yourself in your
editor.

## Glossary of German names kept as-is

| Name | Kind | Meaning |
|---|---|---|
| `auftrag` | skill | order; the router that picks the mode |
| `intake` | skill | turns a raw brief into `spec.md` and `open-questions.md` |
| `aufwertung` | skill | upgrade scoping: turns "make it better" into a prioritised scope |
| `befund` | skill, rule, folder | findings report plus patches for a site we can't access (M1-B) |
| `komponenten` | skill | components: which registry the motion level allows |
| `lueckenschluss` | skill | gap closing: works through `FEHLEND.md` |
| `hol-asset.mjs` | script | "fetch asset": downloads an image from the client's own domain only |
| `besitz.mjs`, `.claude/.besitz` | hook, file | ownership map for parallel teammates |
| `gemeinsam`, `zuteilung` | keys in `.besitz` | shared files, per-teammate assignment |
| `fehlend-gate.mjs` | hook | the Stop gate for `FEHLEND.md` |
| `.fehlend-runde`, `.fehlend-rest` | runtime files | round counter and open count for that gate |
| `datenschicht.md` | rule | data layer (security rules) |
| `oberflaeche.md` | rule | surface (UI rules: tokens, motion, language) |
| `FEHLEND.md` | file | missing items |
| `BERICHT.md` | file | report (autopilot's final report) |
| `EINSPIELEN.md` | file | install guide for M1-B patches |
| `design/aufwertung-<domain>.md` | file | output of `aufwertung` |
| `design/assets-herkunft.tsv` | file | asset provenance log |
| `zugriff:` | key in `stack.md` | access. Values: `repo`, `nur-url` (URL only), `staging` |
| `GELÖST` / `GELOEST` | status in `FEHLEND.md` | solved |
| `PLATZHALTER` | status, code marker | placeholder |
| `OFFEN` | status | open |
| `NICHT MÖGLICH` / `NICHT MOEGLICH` | status | not possible |
| `[ANGABE FEHLT: …]` | marker in code/copy | missing information; `ship` greps for it |
| `BESTANDEN` / `NACHBESSERN` | verdict | passed / revise |

Things I did translate, so you can match them against the German original: Tor → gate,
Spur → track (A brochure, B experience), Eimer → bucket.

The JavaScript variable names inside the hooks are also still German. I left them alone
so the translation couldn't change behaviour.

## Status

Translated from the German original and checked with node --check and reference greps;
not re-run end to end on a real project.

# 06 · Agents

**What you'll learn**

- The difference between a subagent, an agent team and a second session
- How my agency pipeline decides how much machinery a request gets
- Persona swarms as a cheap test audience
- Loops that keep Claude working without you
- When not to fan out

---

## Subagents and agent teams

**Subagents.** The main session hands a task to a helper, which works in its own context window and returns only a summary, so logs and search results stay out of your main session. You define your own as Markdown files in `.claude/agents/` (one project) or `~/.claude/agents/` (all projects), with frontmatter like `name`, `description`, `tools`, `model` and `effort`.

**Agent teams.** Several full Claude Code sessions with one lead. Teammates share a task list and message each other directly. Teams are experimental and off by default. You turn them on with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in the `env` block of your settings.

While building my pipeline I asked:

> «Ich würde doch noch gerne mit Agent Teams arbeiten, also dass sie in der gleichen Zeit arbeiten und sich gegenseitig Nachrichten schicken können. Würde das dafür sorgen, dass sie schneller sind?»
> *I'd still like to work with agent teams, so they work at the same time and can message each other. Would that make them faster?*

The docs answer it: teams use significantly more tokens, because every teammate is its own Claude instance. They pay off when teammates can work independently.

## My pipeline: not everything gets the full machinery

For client websites I built a pipeline: a router skill called `auftrag` (German for "job"), 9 agents, 13 skills and 12 hooks. It's in [`templates/agency-pipeline`](../templates/agency-pipeline/).

The router's job is dosing:

> «Ein Tippfehler bekommt keine achtköpfige Kette, ein Neubau kein Schnellschuss.»
> *A typo doesn't get an eight-agent chain, and a new build doesn't get a quick shot.*

Every request gets a mode first:

| Mode | When | Chain |
|---|---|---|
| M0 Micro | One small detail, like a typo or a link | the lead alone |
| M1-A Patch | A concrete change to code we have | recon → builder → aesthetic |
| M1-B Findings | A concrete change, but only the URL | recon → builder (plain CSS/JS patches) → aesthetic |
| M2 Redesign | An existing site plus a verdict like "looks cheap" | recon → upgrade scope → tokens → concept → copy → builder → aesthetic → qa |
| M3 New build | A new site or a big new section | intake → motion level → tokens → concept → copy → builder → aesthetic → qa |
| M4 Infra | Login, database, forms, admin area | backend → builder → qa |

The lead builds on its own only in M0. Otherwise it hands off to agents, and every handoff runs through it.

Each agent has a model for its role, set in its frontmatter ([02](02-models-effort-advisor.md)). While planning I wrote «der, der denkt, braucht Opus, ein Mikro-Arbeiter nur Sonnet» (*the one who thinks needs Opus, a micro-worker only Sonnet*). In the files that became:

- **Opus:** concept, aesthetic (the critic), backend, finisher
- **Sonnet:** recon, builder, copy
- **Haiku:** qa (measures, doesn't judge) and scribe (keeps the project memory)

The guardrails don't rely on Claude being careful:

- The critic gets no `Write` or `Edit` tools, so it can only judge.
- A `Stop` hook is gate 1: an agent can't finish while the code doesn't build and lint. After two revision rounds on a page, the human decides.
- A `PreToolUse` hook blocks edits to `CLAUDE.md` and the agents, skills, hooks and settings under `.claude/`, and the settings deny them again. A system with creative freedom shouldn't be able to rewrite its own rules.
- The settings sort commands into `allow`, `ask` and `deny` ([11](11-safety.md)).
- A finisher works the list of missing pieces and loops the solvable ones back into the workflow, «bis es keines mehr gibt» (*until there are none left*).

Agent teams are on, for one case only: building 3 or more pages that share no files, in M2 or M3, after concept, tokens and copy are settled. Before the fan-out the lead writes an ownership map, and a hook blocks any teammate that touches another one's files. Shared files like `globals.css` belong to the lead alone. At most 3 to 4 teammates, and the critic and QA stay subagents.

One gotcha from the docs: with teams on, a subagent that Claude gives a name can launch as a teammate, so a team can form when you didn't ask for one. If you don't need teammates, leave the flag off.

## Persona swarms: cheap testers

One use I keep coming back to: a fake test audience. Haiku is cheap and good enough for "click through this and tell me what's annoying". Before our company website went live:

> «Nimm 20 Haiku-Agents mit je eigenem Purpose, was sie machen sollen. Diese gehen durch und geben anschliessend Feedback an dich, und du fasst mir zusammen.»
> *Take 20 Haiku agents, each with its own purpose. They go through the site, give you feedback, and you summarise it for me.*

For my Windows app I added a measure:

> «Danach lässt du die User Experience von 10 Subagents mit dem Modell Haiku hart kritisieren.»
> *Then have 10 Haiku subagents criticise the user experience hard.*

One success criterion: the personas' UX grades have to rise from round 1 to round 2. Vague feedback becomes a number you can check.

Personas aren't real users. They all read the same brief through the same model. They find friction and confusing labels, not whether anyone wants the product.

## Parallel sessions

Sometimes I want separate work streams, and I ask Claude to start them:

> «Starte eine neue Session mit dem Prompt und setze dort den Advisor auf Fable.»
> *Start a new session with the prompt and set the advisor to Fable there.*

Later I sent the same message three times in a row: «Wie weit sind die beiden Sessions?» (*How far along are the two sessions?*). If you can't see the state, you keep asking. Give each parallel session a narrow, independent task and a place to write its status, like a `state.md` or a PR. If two sessions share a repo, give each its own git worktree.

## Loops

These keep Claude going without you typing "continue". I use them rarely:

- **Ralph loop** (`/ralph-loop`, from the official `ralph-loop` plugin): a `Stop` hook feeds the same prompt back every time Claude tries to finish. I used it for a polish pass on an app: "Polish everything, look at everything from a user's perspective." Its README says it suits checkable success criteria, not tasks that need human judgment or design decisions. Polish is half taste: put the checkable half in the prompt and keep the taste half yourself. Always set `--max-iterations`: the default is unlimited.
- **`/loop`** repeats a prompt on an interval, or self-paced, while the session is open.
- **`/goal`** sets a condition Claude keeps working toward until it's met.

## When not to fan out

I've written things like «in 15–30 Minuten komplett fertig, mit vielen parallelen Agents» (*completely done in 15 to 30 minutes, with lots of parallel agents*). Sometimes that's right. Often it isn't.

- **Cost.** Every subagent sends its own requests, against the same limits as your main session, and teams cost much more ([07](07-tokens.md)). 20 Haiku testers are cheap. 20 Opus builders aren't.
- **The same wrong context.** All agents start from the same brief. If it lacks the references, ten agents won't find them. They'll confirm each other's mistake.
- **The same files.** Two agents editing one file overwrite each other.
- **Sequential work.** If step 2 needs the result of step 1, parallel agents wait or guess.

A rule of thumb: fan out for independent chunks you can check, like pages to test. Keep judgment and decisions in one place.

---

## Exercise

1. Write a subagent in `.claude/agents/reviewer.md` with `tools: Read, Glob, Grep`, `model: sonnet` and a description that says when to use it. Ask for a review and check that Claude used it.
2. Run a persona test with 5 Haiku agents, each with a different purpose (a first-time visitor, someone on a phone, a sceptic, and so on). Ask for one combined list, sorted by how many personas hit the same problem.
3. Add a number: a grade from each persona. Fix the top three problems, run it again, compare.
4. Check `/usage` before and after the swarm. Write down what it cost.

## Mistakes I made so you don't have to

- **Parallel agents as a speed button.** Parallel only helps when the pieces are independent.
- **Asking "how far are you?" three times in a row.** If you can't see the status, have the agents write it down.

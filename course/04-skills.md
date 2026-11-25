# 04 · Skills

**What you'll learn**

- What a skill is and where it lives
- Why the description decides whether a skill ever runs
- The frontmatter fields I actually use
- What hoarding about 150 skills cost me
- How to find a skill when you need it, and how to write your own

---

## What a skill is

A skill is a folder with a `SKILL.md` file in it: a short frontmatter block (at least a name and a description), then instructions. It can bring scripts and reference files along.

Claude doesn't read every skill all the time. It sees a list of names and descriptions and loads a full skill when your request matches. You can also start one with `/skill-name`.

Skills follow the open [Agent Skills](https://agentskills.io) standard, so one folder works in the desktop app and in Claude Code, which adds extra fields.

## Where skills live

| Where | How it gets there |
|---|---|
| The desktop app | Zip the skill folder, then Customize > Skills > **+** > Create skill > Upload a skill. Code execution has to be on. |
| Claude Code, all your projects | `~/.claude/skills/<name>/SKILL.md` |
| Claude Code, one project | `.claude/skills/<name>/SKILL.md`, committed with the repo |
| Inside a plugin | Comes with the plugin, called as `/plugin-name:skill-name` (see [05](05-plugins-connectors.md)) |
| From a GitHub repo | `npx skills add owner/repo --skill <name>`, with `-a claude-code` for Claude Code. It installs into the current project, `-g` makes it global. |

If you sign in to Claude Code with your Claude account, the skills you added in the desktop app sync down into `~/.claude/skills/synced/`. That's where most of mine came from. Syncing only goes one way, so a local edit to a synced file can be overwritten. When the same name exists twice, your personal skill wins over the project one.

## The description is the trigger

Claude decides from the name and description alone. A skill with a vague description is a skill that never runs.

Write it as the situations and words people actually type, main use case first. The router skill in my agency pipeline starts like this:

> «Der Router. Klassifiziert jeden Kundenauftrag in einen Modus (M0–M4) … Immer als Erstes bei einem neuen Auftrag, egal ob Zweizeiler oder komplette Website.»
> *The router. Classifies every client request into a mode (M0–M4) … Always first on a new request, whether it's two lines or a whole website.*

It says what it does and when it fires. If a skill fires too often, narrow the description. If it never fires, add the words you'd naturally say.

## The frontmatter I use

My agency pipeline ([`templates/agency-pipeline`](../templates/agency-pipeline/)) has 13 skills. These are the fields they use:

| Field | What it does | Where I use it |
|---|---|---|
| `description` | When Claude should use the skill | every skill |
| `argument-hint` | Shows what to type after `/name` | `[route, e.g. / or /services]` on the design judge |
| `disable-model-invocation: true` | Only you can start it, Claude never does | `intake` and `ship` start only when I type them |
| `allowed-tools` | Tools Claude may use without asking while the skill runs. It pre-approves. It doesn't restrict. | the router may run `git status` and `git log` |
| `disallowed-tools` | Removes tools while the skill is active | the design judge loses `Write` and `Edit`, so it can't "fix" what it judges |
| `model` | Model for that turn | `opus` for judgment, `haiku` for the memory skill |
| `effort` | Effort for the rest of the turn | `high` on the thinking skills |
| `paths` | File patterns that activate the skill | the component skill and the findings skill |

The router also uses lines like `` !`git status --short` ``. They run before Claude reads the skill and their output replaces them, so it knows the repo state without a tool call.

One catch: most of these fields only exist in Claude Code. A skill you upload in the desktop app may only use `name`, `description`, `license`, `compatibility`, `metadata` and `allowed-tools`. Any other field makes the upload fail.

## I hoarded skills

What I found when I looked:

- About 150 skills installed, and plugins added even more to every session's skill list.
- Many of the installed ones never ran once.
- Whole plugin families were never used: sales, legal, finance, operations, Hugging Face, Remotion and the Figma skills.
- Only a small set ran regularly. The ones I reach for are in the [README](../README.md#what-i-use-most-and-where).

This isn't free. Claude Code puts the list of skill names and descriptions into context, with a budget of about 1% of the context window. When it overflows, every name stays, but descriptions get dropped, starting with the skills you use least. My sessions showed exactly that: lots of skills listed by name only. Without a description Claude has nothing to match against, so those skills most likely never fire.

Duplicates made it worse. I had `frontend-design` installed three times (as a plugin, inside a bundle, and synced from the desktop app) and several anti-slop skills that all claimed the same kind of request.

Most of the time I just tell Claude to pick the best skills for the job and how many to use. That only works when Claude can see the descriptions it picks from.

What helps:

- `/skill-doctor` in Claude Code shows what each skill costs in context and how often it runs, and flags the ones that never ran.
- The `skillOverrides` setting can set a skill to `"name-only"` or `"off"`. It doesn't cover plugin skills. Disable those plugins in `/plugin`, which removes all their skills at once.

## Find skills when it hurts, not before

The worst part: the right skill was often already installed. From late July to early September I fought choppy smooth scrolling with Lenis again and again, at one point asking Claude to test it frame by frame. A GSAP and Lenis motion skill sat on disk the whole time, unused. Same with a Supabase best-practices skill while I built several Supabase projects.

So I wasn't missing skills. I didn't look when it mattered. A simple rule: when the same problem comes back a second time, search for a skill before the third attempt.

Where to search:

- [skills.sh](https://skills.sh), the skills directory
- `npx skills find <query>` in the terminal
- the `find-skills` skill from [vercel-labs/skills](https://github.com/vercel-labs/skills), which runs that search for you. I only started using it in November, after I'd already collected about 150 skills. Start with it instead.

Install what you find for the project that needs it. My current list is in [`setup/skills.md`](../setup/skills.md).

I also built a private skill that picks matching skills from my library for a task. It was the skill that ran most often in my main sessions, because letting Claude pick the skills is how I usually work.

## Write your own

Your best skills come from your own repeated prompts. If you paste the same brief for the third time, make it a skill.

- Anthropic's `skill-creator` helps you write and test one. In Claude Code: `/plugin install skill-creator@claude-plugins-official`. It can also test whether your description triggers on the right requests.
- The skills I wrote myself are in [`skills/`](../skills/): `ultraplan`, `interactive-learning` and `decision-toolkit` (adapted from glebis/claude-skills, with credit).
- Put the important instructions at the top. After compaction, Claude Code may keep only the start of a loaded skill.

## Licenses, briefly

I link to other people's skills and never copy them. Read the LICENSE file, not the frontmatter, and watch for same name, different project: there are two unrelated skills called caveman. More in [11](11-safety.md) and [CREDITS.md](../CREDITS.md).

---

## Exercise

1. In Claude Code, run `/skill-doctor`. Or ask Claude "What skills are available?" and count them.
2. Write down the skills you actually used in the last two weeks. Turn off everything else, plugins included.
3. Pick a prompt you've typed at least three times. Turn it into a skill in `.claude/skills/`. Write the description as "Use when …" with the exact words you'd type.
4. Test it in a new session: ask for the task in your own words, without the skill's name. If it doesn't fire, fix the description, not the body.

## Mistakes I made so you don't have to

- **Installing whole plugin families.** Sales, legal, finance: never ran, but they sat in every session's skill list.
- **Not searching my own toolbox.** Weeks of scroll problems while the matching skill was installed.
- **Three copies of the same skill.** Pick one source and remove the rest.
- **Descriptions that say what, but not when.** Claude needs the when.

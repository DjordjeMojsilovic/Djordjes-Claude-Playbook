# 03 · Context

**What you'll learn**

- What belongs in CLAUDE.md, and what doesn't
- Rules that only load when Claude touches matching files
- How memory works per project, and how my corrections became memories and rules
- Where hooks come in
- Why my own global CLAUDE.md was wrong

---

## What Claude reads before your prompt

Every session starts with an empty context window. Two things carry knowledge from one session to the next: **CLAUDE.md files**, which you write, and **auto memory**, which Claude writes itself.

Both are context, not enforced configuration. The docs put it plainly: the more specific and concise your instructions, the more consistently Claude follows them.

## CLAUDE.md: invariants only

CLAUDE.md can live in a few places:

| File | Who it's for |
|---|---|
| `~/.claude/CLAUDE.md` | You, in every project |
| `./CLAUDE.md` or `./.claude/CLAUDE.md` | Everyone on the project, through git |
| `./CLAUDE.local.md` | You, in this project only. Add it to `.gitignore` |

All of them load at the start, and they add up instead of replacing each other.

The CLAUDE.md in my agency template starts with a comment that explains why it's short:

> It contains ONLY invariants: rules that apply to EVERY order. Kept short on purpose: long house rules get followed worse.

The docs agree and recommend staying under 200 lines per CLAUDE.md, because longer files cost more context and reduce adherence. Splitting a long file with `@path` imports doesn't help, because imported files load together with the file that imports them.

The official best practices say what belongs: the commands to check work in this repo, places where the code is misleading, decisions you can't see in the repo, and anything you've had to correct twice already.

My test for every line: *does this apply to every task in this project?* If it only applies to some files, it goes into a rule. If it's a workflow you run sometimes, it goes into a skill ([module 04](04-skills.md)).

**A free trick.** Block-level HTML comments in a CLAUDE.md file, like `<!-- why this file is short -->`, are stripped before the content reaches Claude. Comments inside code blocks stay. My template uses them to explain itself to the humans who maintain it, at no token cost.

## Rules that load when needed

Put Markdown files in `.claude/rules/`. A rule without a `paths` field loads at the start, like CLAUDE.md. A rule with a `paths` field only loads when Claude reads, writes or edits a matching file. Here's the data layer rule from my [agency template](../templates/agency-pipeline/), shortened:

```markdown
---
paths:
  - "supabase/**"
  - "**/*.sql"
  - "src/app/api/**"
---

# Data layer: security

- RLS on every table. A new table without a policy is unfinished.
- The service role key never goes into client code.
```

The template has two more rules like this: one for UI files, and one for patches that go into other people's live sites. The comment at the top of the data layer rule says why it isn't part of CLAUDE.md:

> These rules are too important to get lost in a long CLAUDE.md, and too specific to cost context on every CSS change.

## Memory

Auto memory is on by default in local sessions. Claude saves notes for itself as it works: your role and preferences, corrections you give it, project decisions it can't read from the code. Each project gets its own memory folder under `~/.claude/projects/`, shared by all worktrees of the same repo and only on your machine. At session start Claude loads the first 200 lines (or 25KB) of the index file `MEMORY.md` and reads the topic files when it needs them.

Say *"remember that …"* and Claude saves it to auto memory. Say *"add this to CLAUDE.md"* if it should be a rule for everyone on the project. `/memory` lists the CLAUDE.md and memory files that apply, opens them for editing, and turns auto memory on or off.

Some of my memories, and where they came from:

- **"Tests and builds run on CI, never on my laptop."** For my Windows app I said «nichts bei mir auf dem Laptop lokal testen» (*don't test anything locally on my laptop*) more than once. Now it's a memory, and releases go through GitHub Actions.
- **"Done means a fresh DLL timestamp."** Not a window that happens to have the right title.
- **The design bar.** «merke dir: du bist ein Apple-Design-Team» (*remember: you're an Apple design team*). The memory now says: an Apple design team that looks at every smallest detail.

Per project matters, because my preferences contradict each other across projects. On websites, Claude should test with screenshots itself. On the Windows app, nothing runs locally. Both are right, each in its own project.

## From correction to rule

My most useful rules came from moments when I was annoyed. Here are corrections I gave Claude, and the rule each one turned into:

| What I said | The rule |
|---|---|
| «ich sagte doch nichts anfassen» *I told you not to touch anything* | "Don't touch" means a zero diff. Check the diff before "done". |
| «du hast es komplett auseinandergenommen … die Schriftarten» *you completely took it apart … the fonts* | Typography, navigation and animations are existing work. Check for regressions after every PR. |
| «Ich sehe keine Änderungen» *I don't see any changes* | "Done" only counts with proof: live, compiled, a screenshot or a log. |
| «mit Viewports meine ich nicht …» *by viewport I don't mean …* | Pin ambiguous words to the example I showed. |
| «wieso hast du mich nicht darauf hingewiesen» *why didn't you point that out to me* | Point out requirements from the material yourself, and give a reason for every grade. |
| «Lösche alles, was du gemacht hast» *delete everything you did* | Experiments go into branches or prototype folders, so undoing them is one command. |
| «für was diese 30 Minuten?» and «aber gründlicher» *what are these 30 minutes for?* and *but more thorough* | Act fast when the goal is clear, but don't get sloppy. |

Once I asked for the rule on the spot:

> «Schreib von mir aus noch kurz die CLAUDE.md um, dass du solche Kleinigkeiten nicht draussen lässt.»
> *Go ahead and quickly update CLAUDE.md so you don't leave out small things like that.*

All seven are now in [`setup/CLAUDE.md`](../setup/CLAUDE.md), next to the general rules from my project file.

How to do it yourself:

1. **Notice the second time.** When you correct the same thing twice, stop and write the rule.
2. **Write the rule, not the story.** One line Claude can check, like "zero diff", not "be careful with my files".
3. **Put it where it belongs.** All projects: `~/.claude/CLAUDE.md`. This project: the project CLAUDE.md. Some files: a rule with `paths`. A personal preference: "remember that".
4. **If it must never fail, use a hook.**

## Hooks, in one paragraph

Hooks are shell commands that Claude Code runs at fixed points, like session start, before a tool call, or when Claude finishes. They run every time, whatever Claude decides, and a `PreToolUse` hook can block an action. "Always typecheck before you finish" in CLAUDE.md works most of the time. A `Stop` hook makes it happen every time. My agency template has 12 hooks. One blocks edits to CLAUDE.md, the rules, the agents and the settings, backed by a `permissions.deny` list. Another blocks "done" while items on the missing-content list are still open. More in [module 09](09-engineering.md) and [module 11](11-safety.md).

## The cautionary tale: my own global CLAUDE.md

While building this course, I read my own `~/.claude/CLAUDE.md` line by line. A tool's init command had written a block into it that told Claude to use tools I didn't have installed. Not one of the seven rules above was in it. The one file that loads in every session of mine pointed Claude at tools that didn't exist, and said nothing about how I work.

`/doctor prompt-audit` would have caught it. It checks your instruction files for outdated or conflicting content, including references to files or commands that don't exist, and proposes edits without changing anything until you say so.

---

## Exercise

1. Open your project's CLAUDE.md. No file yet? Run `/init` to get a first version.
2. Mark every line that doesn't apply to every task.
3. Move one marked area into `.claude/rules/` with a `paths` field.
4. Add an HTML comment at the top that explains why the file is short.
5. Write down three corrections you've given Claude more than once. Turn each into a one-line rule and put it in the right place.
6. Run `/doctor prompt-audit` and `/memory`. Delete what's stale.

## Mistakes I made so you don't have to

- **Rules that only existed as annoyed messages.** Most of the seven rules above lived in my chat history, not in a file. So the same mistakes came back in the next project.
- **Contradictions without a scope.** My preferences contradict each other across projects: on websites Claude tests with screenshots itself, on my Windows app nothing runs locally. The docs say that when two instructions contradict each other, Claude may pick one arbitrarily. Scope each to its project.
- **Thinking a rule is a lock.** CLAUDE.md is context. For things that must never happen, like reading a `.env` file, use permissions or a hook ([module 11](11-safety.md)).
- **Not re-reading the global file.** It loads everywhere, and it was the file I checked least. Read yours every few weeks.

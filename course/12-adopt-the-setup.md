# 12 · Adopt the setup

**What you'll learn**

- What's in my setup and why each part is there
- How to install it without wrecking the setup you already have
- Which parts to change for yourself, and which to keep
- How to keep it lean after the first week

---

## Before you start

The short version is in [`setup/README.md`](../setup/README.md): five steps, about 15 minutes. This module is the same path with the reasons, so you know what to keep and what to change.

One rule up front: **don't copy anyone's setup blindly, including mine.** My own settings file had hooks for a desktop tool you probably don't have and a status line pointing at a folder on my laptop. None of that is in the example file. The same will be true for any setup you find online.

## Step 1: House rules

[`setup/CLAUDE.md`](../setup/CLAUDE.md) goes into `~/.claude/CLAUDE.md`, so it applies to every project. It's short on purpose. Long house rules get followed worse ([module 03](03-context.md)).

Every rule in the second half exists because Claude got something wrong for me more than once:

| Rule | Why it's there |
|---|---|
| "Don't touch X" means zero diff | I said «nichts anfassen» and still found +98 −134 lines in the diff |
| Existing typography and animations stay | Claude "improved" a page and replaced my fonts |
| "Done" needs proof | «Ich sehe keine Änderungen» (*I don't see any changes*) after it said it was done |
| Pin ambiguous words to an example | I said "viewport", it squeezed the whole page onto one screen |
| Point out requirements yourself | I found a detail in the material that Claude had read and not mentioned |
| Experiments go in a branch | Sometimes I throw a whole round away, and that has to be one command |

If you already have a `CLAUDE.md`, merge. Keep yours, add the rules you agree with. Then do what I did: every time you correct Claude twice for the same thing, add a line.

## Step 2: Settings

[`setup/settings.example.json`](../setup/settings.example.json) is my real settings file, cleaned up. Merge the values into `~/.claude/settings.json`. Don't replace the whole file.

What's in it, and why:

- **`model: opus`, `effortLevel: high`, `advisorModel: fable`.** That's what I run almost every session. If your plan or budget is smaller, drop to Sonnet or a lower effort. [Module 02](02-models-effort-advisor.md) has the trade-offs.
- **`permissions.defaultMode: auto`, plus allow, ask and deny lists.** Read-only git and build commands run without asking. Commits, pushes, installs and deploys ask first. `.env` files, keys and SSH folders are blocked.

[Module 11](11-safety.md) explains what each permission mode does, with what the docs say about it.

## Step 3: Install skills and plugins

Do a dry run first. Always.

```powershell
powershell -ExecutionPolicy Bypass -File setup\install.ps1 -DryRun
```

```bash
bash setup/install.sh --dry-run
```

It prints every command and installs nothing. Read the list. Then run it for real, and it asks before each group:

- **Core:** caveman, ponytail, frontend-design, verification-before-completion, the Emil Kowalski skills, hallmark and my decision-toolkit
- **When needed:** the design plugin, ralph-loop, the better-* checks, break-ui, Sentry's bug and security review, grill-me, the slop checks, my interactive-learning skill
- **Prototype variants:** the taste skills and other style skills, one per prototype ([module 08](08-design.md))

Everything third-party comes straight from its author's repo. That also means you get **their current version**, which can be newer than the one I used. hallmark, for example, is a rewritten 2.0 now. If something behaves differently from what I describe, that's probably why.

What's deliberately not in the script:

- **impeccable and ui-ux-pro-max.** Never. See [module 08](08-design.md).
- **ultraplan.** Claude Code ships its own `/ultraplan`. If you want mine, copy it by hand under another name ([`skills/README.md`](../skills/README.md)).
- **Anything I didn't actually use.** I had about 150 skills installed. Most of them never ran.

## Step 4: Connectors and the browser

Connectors live in the Claude desktop app (Customize › Connectors), not in the settings file. You switch them on and sign in yourself. Mine are Unsplash, Canva, Figma, Hugging Face, Claude Docs and SuperMe. [`setup/plugins.md`](../setup/plugins.md) says what I use each for, and where the catches are (Figma's Starter plan, for example).

For design references, give Claude your browser through Claude in Chrome. You log in to Mobbin or Land-book, you solve the captchas. Claude does the looking.

## Step 5 (optional): The agency pipeline

If you build websites for clients, [`templates/agency-pipeline`](../templates/agency-pipeline/) is the setup I use for that: a router that sorts every request by size, nine agents with a model per role, skills, hooks and two quality gates. Put it in a **new** project, since it brings its own `CLAUDE.md` and settings. Read its README first. It's translated from my German original, so some file and command names stay German (there's a glossary).

## After the first week

A setup is not a one-time install. After a week or two:

1. **Look at what actually ran.** In Claude Code, `/plugin` shows your installed plugins, and the official marketplace's details show what each one costs in context. If a skill never fired, remove it. Every installed skill sits in the skill list Claude reads, and that list has a limit ([module 04](04-skills.md)).
2. **Add the rules you needed.** Every correction you made twice goes into your `CLAUDE.md`.
3. **Find skills when you need them, not before.** When something keeps going wrong (for me it was smooth scrolling for weeks), search [skills.sh](https://skills.sh) right then.

And when it works for you, share it. Garry Tan published his as [gstack](https://github.com/garrytan/gstack). This repo is mine. Yours is the one I haven't seen yet.

---

## Exercise

1. Do the dry run and read every line. Cross out anything you don't understand yet, and skip that group for now.
2. Install, start a new session, and run `/plugin` and `/status` to check it loaded.
3. Merge my `CLAUDE.md` into yours. Delete at least one of my rules you disagree with, and write down why.
4. One week later: remove three things that never ran, and add one rule from a correction you made twice.

## Mistakes I made so you don't have to

- **Installing everything.** About 150 skills, several anti-slop skills, copies of the same design skill. More skills made the right one harder to trigger, not easier.
- **A global config that didn't match reality.** My global `CLAUDE.md` pointed at tools I didn't even have installed. Read yours once a month.
- **Bundles.** I installed a big bundle that copied other people's plugins. Link the originals instead: you get updates, and the authors get the credit.

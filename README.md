<p align="center"><img src="docs/banner.jpg" alt="How I actually work with Claude. Snow-covered alpine peaks above a sea of clouds." width="100%"></p>

# Djordje's Claude Setup

How I actually work with Claude, as a course you can follow and a setup you can copy. It also reads as a website: [djordjemojsilovic.github.io/Djordjes-Claude-Setup](https://djordjemojsilovic.github.io/Djordjes-Claude-Setup/).

**[Course](course/00-start-here.md)** · **[Setup](setup/README.md)** · **[Skills](setup/skills.md)** · **[Credits](CREDITS.md)**

I'm Djordje. I'm a SWE apprentice at Google, I'm doing the BMS (the Swiss vocational baccalaureate) alongside it, and I co-founded [Avtoris](https://www.avtoris.studio). Most of what I build, I build with Claude: websites for clients, a Windows app, learning modules for school, and this repo.

> This is a personal project. It has nothing to do with Google or Anthropic, and every opinion in here is mine.

---

## Why I'm sharing this

Garry Tan published his own Claude Code setup as [gstack](https://github.com/garrytan/gstack). I think that's the right move, and I think more people should do it.

Most "how to use AI" content shows polished demos. What actually helps is seeing how someone works day to day: the prompts, the setup, the mistakes, and the rules they wrote after Claude got something wrong for the third time.

So this is mine. It's built from my real sessions, over 1,000 of them by now, not from what sounds good. Where my own habits are bad, I say so.

## What I use most, and where

| Area | What I reach for |
|---|---|
| Planning and second opinions | `/advisor` with Fable, [ultraplan](skills/ultraplan/SKILL.md), [decision-toolkit](skills/decision-toolkit/SKILL.md) |
| Design and prototypes | frontend-design, Emil Kowalski's skills (emil-design-eng, animate, apple-design, mobile-native, prototype), hallmark and the taste skills for prototype variants |
| Checking a build | verification-before-completion, better-layout, better-colors, better-typography, break-ui, accessibility-review, audit-ai-design-slop |
| Engineering | security-discipline (backend-design), code review, grill-me |
| Saving tokens | caveman, ponytail |
| Learning | [interactive-learning](skills/interactive-learning/SKILL.md), learn |
| Client websites | my [agency pipeline](templates/agency-pipeline/) |

I've had about 150 skills installed at once. Most of the time I just tell Claude to pick the best skills for the job and how many to use. The install commands are in [`setup/skills.md`](setup/skills.md).

## Three ways to use this repo

| I want to… | Start here | Time |
|---|---|---|
| **Learn** how to work with Claude properly | [`course/00-start-here.md`](course/00-start-here.md) | a few evenings |
| **Copy** my setup and get going | [`setup/README.md`](setup/README.md) | about 15 minutes |
| **Find** a good skill for something specific | [`setup/skills.md`](setup/skills.md) | 2 minutes |

## The course

Every module works the same way: what you'll learn, a short explanation, a real example from my work, an exercise and the mistakes I made so you don't have to.

| # | Module | In one line |
|---|---|---|
| 00 | [Start here](course/00-start-here.md) | Which Claude to use for what |
| 01 | [Prompting](course/01-prompting.md) | One big brief, then short steering |
| 02 | [Models, effort, advisor](course/02-models-effort-advisor.md) | Opus thinks, Sonnet builds, Haiku checks, and a second opinion before you start |
| 03 | [Context](course/03-context.md) | Short CLAUDE.md, rules that load when needed, memory |
| 04 | [Skills](course/04-skills.md) | What they are, where they live, how to write your own |
| 05 | [Plugins and connectors](course/05-plugins-connectors.md) | Marketplaces, MCP, the browser |
| 06 | [Agents](course/06-agents.md) | Subagents, pipelines, parallel sessions, and when not to |
| 07 | [Saving tokens](course/07-tokens.md) | The levers that actually matter |
| 08 | [Design](course/08-design.md) | References first, then prototypes that really differ, then you pick |
| 09 | [Engineering](course/09-engineering.md) | Set the limits, let Claude design the system, ask for proof |
| 10 | [Learning](course/10-learning.md) | Turn Claude from doer into tutor |
| 11 | [Safety and licenses](course/11-safety.md) | Permissions, secrets, prompt injection, whose skill is it |
| 12 | [Adopt the setup](course/12-adopt-the-setup.md) | Walk through `setup/` step by step |

## What's in here

```
course/      13 modules
setup/       my CLAUDE.md, settings, curated skills and plugins, install scripts
templates/   my agency pipeline (router + 9 agents) and a starter for new projects
skills/      the skills I wrote myself
site/        builds the website from these files (GitHub Pages)
docs/        the banner image
CREDITS.md   every skill and plugin I link to, with author and license
```

## How I picked what's in here

- **I link, I don't copy.** Skills by other people stay in their own repos. You get a link and an install command, so you always get the current version and the author keeps the credit. Only skills I wrote are in [`skills/`](skills/).
- **Picked by real usage.** I had about 150 skills installed, and many of them never ran. Those aren't recommended here. What's in here is what I actually reach for.
- **Honest.** Two popular design skills are on my "never" list, and [module 08](course/08-design.md) says why.

## Credits and license

All third-party skills and plugins are listed in [CREDITS.md](CREDITS.md) with their authors and licenses. The mountain photo in the banner and on the website is by [Gabriel Garcia Marengo](https://unsplash.com/@gabrielgm?utm_source=djordjes_claude_setup&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=djordjes_claude_setup&utm_medium=referral). My own texts, skills and templates are under the [MIT license](LICENSE).

If this helps you work better with Claude, a star helps me. If you share your own setup, send me the link.

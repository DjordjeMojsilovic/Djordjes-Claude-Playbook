# 00 · Start here

**What you'll learn**

- Which Claude to use for which kind of work
- Where I actually work, and what I use the other surfaces for
- How this course is built, and three ways through it

---

## There isn't one Claude

Claude isn't one app. The same models run in several places, and each place is built for a different kind of work. Picking the wrong one is an easy first mistake. You end up pasting code into a chat window that can't run it, or you open a coding tool to write an email.

Here's the map:

| Surface | What it is | Good for |
|---|---|---|
| **Desktop app, Chat tab** | The chat in the Claude desktop app | Thinking, writing, research, preparing a brief |
| **Desktop app, Cowork tab** | Claude Code's agentic setup for work that isn't code, no terminal needed | Documents, files and research tasks with many steps |
| **Desktop app, Code tab** | Claude Code inside the desktop app. You don't need to install the CLI | Daily coding, with diffs you can look at and several sessions side by side |
| **Claude Code CLI** | Claude Code in your terminal | The same work, plus scripting and piping output into Claude |
| **Claude in Chrome** | A browser extension that Claude Code can drive | Testing your web app, and sites you're logged into |
| **Remote Control** | Connects the Claude mobile app on your phone to a session running on your machine | Checking on a session when you're away from your desk |

Two things about this table are easy to miss.

**The Code tab and the CLI are the same engine.** Your project's CLAUDE.md, your settings and your MCP servers work in both. Pick the one you like looking at. You don't lose anything by switching.

**Remote Control doesn't move the work.** Claude keeps running on your machine. Your phone is only a window into it. If you quit the desktop app or close the terminal, the session goes offline until you bring it back. If the laptop sleeps, it reconnects when the machine is back online. So the machine has to stay on and awake for the work to continue.

## Where I actually work

**The Code tab is my default.** Client websites, my Windows app, learning modules for school, this repo: most of it happens in the desktop app. For this course I went back through my desktop sessions and my CLI history.

In the desktop app the same connectors are on in every session: Unsplash, Canva, Figma, Hugging Face and Claude Docs. On doesn't mean used. [Module 05](05-plugins-connectors.md) says which ones actually earn their place.

**The CLI, sometimes.** My CLI history is mostly slash commands and short steering messages. That's also where I ran things like `/compact` and `/usage`.

**A separate chat for big briefs.** My longest prompts often don't start in Claude Code. I write them beforehand in a separate chat in the desktop app, sometimes even for a different tool, and paste them in. Once I pasted a brief and had to add:

> «Der Prompt war anfangs für Cursor gedacht. Um dich nicht zu verwirren: Du kannst einfach normal fortfahren.»
> *The prompt was originally meant for Cursor. So you don't get confused: you can just continue normally.*

That works, but afterwards those briefs get lost in old chats. [Module 01](01-prompting.md) is about writing them and keeping them.

**Remote Control, on a few days.** I started it with `/remote-control` and its short form `/rc` on a few days in August. In the desktop app you type the same command in the Code tab, then open the session from your phone with the Claude mobile app.

**The browser, for references.** When I need design references, I let Claude use my browser so it can look at sites I'm logged into. Logins and captchas stay my job. Claude in Chrome pauses on a login page or a captcha and asks you to handle it. [Module 08](08-design.md) shows how I use that. A session that browses with your logins while nobody watches is exactly the setup in which a bad web page can do real damage, so decide what Claude may do first. [Module 11](11-safety.md) shows how.

I don't have data on Cowork from my own work, so I won't pretend I do. If your task is a folder of documents or research to turn into a report, try it there before you reach for Claude Code.

## One rule for choosing

My rule: **if the result is a file in a repo, do it in Claude Code.** A chat can't run your project's build or open a pull request. Claude Code can, so it can also prove that something works.

Everything before that point, the thinking and the brief, can happen in chat. Once you know what you want, move.

## How this course works

You can use this repo in three ways:

| I want to… | Start here | Time |
|---|---|---|
| **Learn** how to work with Claude properly | this file, then the modules in order | a few evenings |
| **Copy** my setup and get going | [`setup/README.md`](../setup/README.md) | about 15 minutes |
| **Find** a good skill for something specific | [`setup/skills.md`](../setup/skills.md) | 2 minutes |

Every module has the same shape: what you'll learn, a short explanation, a real example from my work, an exercise, and the mistakes I made so you don't have to.

The modules build on each other:

- **01 to 03 are the basics.** [Prompting](01-prompting.md), [models, effort and the advisor](02-models-effort-advisor.md), and [context](03-context.md): what Claude reads before it reads your prompt.
- **04 to 07 are the tooling.** [Skills](04-skills.md), [plugins and connectors](05-plugins-connectors.md), [agents](06-agents.md) and [saving tokens](07-tokens.md).
- **08 to 10 are how I work in three areas.** [Design](08-design.md), [engineering](09-engineering.md) and [learning](10-learning.md).
- **11 and 12 are about doing it safely and taking it home.** [Safety and licenses](11-safety.md), then [adopting the setup](12-adopt-the-setup.md) step by step.

If you only have one evening, read 01 and 03. Almost everything else builds on them.

### Where my numbers come from

Everything I say about my own habits comes from my own work: over 1,000 sessions with Claude by now. The examples come from my recent projects. Names of clients, people and my school are removed. My prompts are in German, so I quote the original and put an English translation underneath. I type fast and sloppy, so the quotes have their spelling fixed and are sometimes shortened. The words are mine.

---

## Exercise

1. Write down the last five things you used Claude for, or would like to.
2. For each one, pick a surface from the table above and write one line on why.
3. Install the desktop app or the CLI and open a session in a real project of yours, not a toy one. Ask: *"Explain this repo in 10 lines and tell me the commands to run it and test it."*
4. Check the answer against what you know. Whatever Claude got wrong is exactly what your CLAUDE.md should say. You'll write it in [module 03](03-context.md).
5. If you have a task that runs for a while, start Remote Control with `/remote-control` and open the session in the Claude mobile app on your phone. Then let the laptop go to sleep and watch what happens to the session.

## Mistakes I made so you don't have to

- **Writing my best briefs where I can't find them.** The long, structured prompts that made my best sessions were written in a separate chat and pasted once. Then they were gone. Save a good brief as a file in the repo, or turn it into a skill ([module 04](04-skills.md)).
- **One session for everything.** Many of my big design and website sessions ran out of context and continued from a summary. A new session per task is cheaper and Claude stays more precise. [Module 07](07-tokens.md) covers this.

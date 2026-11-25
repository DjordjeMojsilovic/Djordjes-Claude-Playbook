# 05 · Plugins and connectors

**What you'll learn**

- What a plugin is and how marketplaces work in Claude Code
- What connectors are and where you turn them on
- How I let Claude use my browser and my PC, and when I don't
- Which tools cost money or come with license strings attached
- Why I don't recommend plugin bundles

---

## Plugins: skills plus everything around them

A skill is one folder ([04](04-skills.md)). A plugin is a package. One install can add skills, subagents, hooks and MCP servers. A marketplace is a catalog of plugins, often a GitHub repo.

In Claude Code it's two commands:

```text
/plugin marketplace add owner/repo
/plugin install plugin-name@marketplace-name
```

Anthropic's official marketplace, `claude-plugins-official`, is added for you the first time you start an interactive terminal session, so its plugins only need the second line. For any other marketplace you run the first line once. In the desktop app, the same thing sits behind the **+** button next to the prompt box, under **Add plugins**.

When you install, you pick a scope:

- **User:** you, in every project on this machine
- **Project:** everyone who works in this repo (it goes into `.claude/settings.json`)
- **Local:** you, in this repo only

Read the details pane before you confirm. A plugin can run hooks and MCP servers on your machine. For plugins from the official marketplace, the pane also estimates the context cost: what the plugin adds to every turn, and what it adds when its skills load. Look at that number before you install a family of 20 skills.

I opened `/plugin` often. My skill list shows how that went: lots of installing, very little removing. The **Installed** tab in `/plugin` groups plugins you haven't used in a while under **Not used recently**. Start there.

The plugins I'd install today, with commands, are in [`setup/plugins.md`](../setup/plugins.md).

## The bundle lesson

On 4 November I installed a whole frontend bundle in one go: one marketplace, 12 plugins, and a router skill on top.

What it really was: copies of other people's work, including Anthropic's frontend-design and design plugins and Emil Kowalski's skills, several of them patched. The bundle's own MIT license only covers its router and scripts. Every bundled plugin keeps its author's license.

What it did to my setup:

- `frontend-design` ended up installed three times.
- Skills I never used once landed in every session's list: image-to-code generators, native mobile skills, a video framework.
- For the patched plugins, I didn't get exactly what the authors had published.

So this repo links the originals. [CREDITS.md](../CREDITS.md) lists every author and license. If a bundle looks good to you, read its third-party notices, then install the two or three originals you need from their own repos.

## Connectors

Connectors are the desktop app's side of the same idea. They connect Claude to apps and services like Figma, Canva or Unsplash. In the desktop app you add them under **Customize > Connectors**, click **+**, connect, and sign in to that service with your own account. In a chat you can toggle each one per conversation. Connectors also work in Claude Code. The Claude Code docs describe them as MCP servers with a graphical setup.

I keep these on in the desktop app: Unsplash, Canva, Figma, Hugging Face and Claude Docs, plus SuperMe in some sessions.

Honest accounting: "on" isn't "used". Unsplash I really used, for real photos instead of generated ones ([08](08-design.md)). For Figma and Hugging Face, the skills that came with them never ran, and I have no record of using the connectors either.

Connected tools cost context even when you don't use them. In Claude Code, MCP tool definitions are deferred by default, so only tool names and server instructions load until Claude uses a tool. That's small, but it isn't zero. `/mcp` lets you disable servers you don't need right now.

The help center says it plainly: only connect services you trust and need. A connector can read data, and sometimes change it, with your account's permissions.

## Claude in Chrome: references behind a login

Some of the best design references sit behind a login. With Claude in Chrome, Claude opens tabs in your own browser and shares its login state, so it can use sites you're already signed into. In Claude Code you start it with `claude --chrome` or `/chrome`.

Logins and captchas are your job. The docs say Claude pauses at a login page or a CAPTCHA and asks you to handle it. When Mobbin failed because I wasn't logged in, that was the right outcome ([08](08-design.md) has the prompt). Claude shouldn't work around a login, and you shouldn't ask it to.

Two things to know:

- Turning Chrome on by default loads the browser tools into every session's context. Connect it when you need it.
- A web page can contain text aimed at Claude. Browsing with your logins and loose permissions is exactly where prompt injection hurts. More in [11](11-safety.md).

## Computer use: targeted, not by default

Computer use lets Claude see your screen and click and type in native apps. In the desktop app it works on macOS and Windows with a Pro, Max or Ultra plan. You turn it on in Settings, and the first time Claude needs an app, you allow or deny it for that session. Browsers are view-only and terminals are click-only, so Claude uses Chrome for web work and the shell for commands.

I use it for things that only have a GUI. When I set up my notes app:

> «Übernimm wieder Kontrolle über meinen PC und öffne Obsidian.»
> *Take control of my PC again and open Obsidian.*

When the task was code, I said the opposite, on purpose:

> «Kannst du mir ein Plugin erstellen, ohne meinen PC zu nutzen?»
> *Can you build me a plugin without using my PC?*

For a script that worked on a USB stick, I added «vorsichtig» (*carefully*). That's the right instinct. Computer use runs on your real desktop, not in a sandbox. Claude tries the more precise tools first anyway: a connector or MCP server, then the shell, then the browser, and only then the screen.

## Read the price tag

Some plugins and connectors are free to install but not free to use. Check before client work depends on them:

| What | The catch |
|---|---|
| Figma | On the Starter plan, or with a View or Collab seat, up to 6 tool calls per month. Writing to the canvas is free during the beta and will become a usage-based paid feature. |
| AnimatedWebs | Proprietary. You need an account, and the commercial license for client work comes only with Pro. |
| Remotion | For-profit companies with more than 3 employees need a company license. |
| SuperMe | A hosted service, all rights reserved. Fine for decision questions, not something your code should depend on. |

None of these are bad tools. Just know the terms before a client project relies on one.

---

## Exercise

1. In Claude Code, open `/plugin`, go to **Installed**, and look at **Not used recently**. Disable everything there.
2. For every plugin that's left, write one sentence: what did it do for me last week? If you can't write the sentence, disable it.
3. List the connectors that are on in the desktop app (Customize > Connectors). Turn off the ones you didn't use this week.
4. Install one plugin you actually need from the official marketplace, at project scope. Read the context cost in the details pane first.
5. Pick a task that only has a GUI, like an app's settings screen. Let Claude do it with computer use, allow only that one app, and watch what it does.

## Mistakes I made so you don't have to

- **Installing a bundle instead of the originals.** Three copies of one skill, and patched versions I never chose.
- **Treating "connected" as "useful".** A handful of connectors on all the time, and I can only point to real use for one of them.
- **Installing families I'd never touch.** Sales, legal, finance, operations: never used.
- **Assuming free means free.** Check plan limits and licenses before a client depends on a tool.

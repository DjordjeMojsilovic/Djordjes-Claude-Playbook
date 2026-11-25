# Plugins, connectors and the browser

A skill is a set of instructions. A plugin bundles skills, commands, hooks or MCP servers, and you install it from a marketplace. A connector gives Claude access to an outside service, like Figma or Unsplash. [Module 05](../course/05-plugins-connectors.md) explains the difference properly.

## Marketplaces

A marketplace is a catalog of plugins in a git repo. I use four.

| Name | Repo | What I install from it |
|---|---|---|
| `claude-plugins-official` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | frontend-design, ralph-loop. Claude Code adds this one for you the first time you start it in a terminal. |
| `caveman` | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | caveman |
| `ponytail` | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | ponytail |
| `knowledge-work-plugins` | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | design |

You don't have to add them by hand. `claude plugin install <name> --marketplace <owner/repo>` adds the marketplace if it's missing and then installs the plugin. Inside a session, `/plugin` does the same with a menu.

## Plugins I use

| Plugin | What for | Tier | Author, license | Install |
|---|---|---|---|---|
| caveman | Short answers, every fact kept | Core | Julius Brussee, Apache-2.0 | `claude plugin install caveman --marketplace JuliusBrussee/caveman` |
| ponytail | Smallest change that solves the task. I turn it off for design | Core | Dietrich Gebert, MIT | `claude plugin install ponytail --marketplace DietrichGebert/ponytail` |
| frontend-design | Deliberate visual decisions instead of template defaults | Core | Anthropic, Apache-2.0 | `claude plugin install frontend-design --marketplace anthropics/claude-plugins-official` |
| design | accessibility-review, ux-copy, design-critique | When needed | Anthropic, Apache-2.0 | `claude plugin install design --marketplace anthropics/knowledge-work-plugins` |
| ralph-loop | Keeps Claude on one task until it's really finished | When needed | Anthropic, Apache-2.0 | `claude plugin install ralph-loop --marketplace anthropics/claude-plugins-official` |

The install script installs all five. [`settings.example.json`](settings.example.json) turns them on under `enabledPlugins`. What each one does in detail, and when I skip it, is in [skills.md](skills.md).

Use the caveman by **JuliusBrussee**. There's a different project called caveman by another author, with different content.

## Optional

**Figma.** Reads designs into code and pushes code back into Figma. I use the connector (below), and I've never used the plugin's 17 skills. If you want the plugin anyway: `claude plugin install figma --marketplace anthropics/claude-plugins-official`. Know the limits first: on the Starter plan, and on View or Collab seats, you get up to 6 tool calls per month. Figma says writing to the canvas is free during the beta and will become a paid, usage-based feature. There's no open license; the [Figma Developer Terms](https://www.figma.com/legal/developer-terms/) apply.

**SuperMe.** A hosted service that answers decision questions with the experience of real founders, engineers and operators. I use it for "how do others handle this" questions about hiring, pricing or what to build. Not for code. It's a connector in the desktop app (Customize › Connectors), and the desktop app's plugin browser lists it too. The plugin repo ([superme-ai/superme-plugins](https://github.com/superme-ai/superme-plugins)) is "all rights reserved", so link it, don't copy it. Read their terms before you rely on it.

## Not recommended: the frontend-stack bundle

[JaimeJunr/claude-code-frontend-skills](https://github.com/JaimeJunr/claude-code-frontend-skills) packs 13 plugins from other authors into one marketplace, several of them patched, including the two on my "never" list. I had it installed for a while. Install the originals instead. They're all linked in [skills.md](skills.md), so you get each author's current version and the author keeps the credit.

## Connectors

Connectors live in the Claude desktop app, and you turn each one on by hand under Customize › Connectors. Once they're on, Claude Code picks them up too when you're signed in with the same account.

| Connector | What I use it for |
|---|---|
| Unsplash | Real photos instead of generated ones |
| Canva | Quick graphics and presentations |
| Figma | Reading a design before building it. Starter plan limit: 6 tool calls a month |
| Hugging Face | Looking up models, datasets and Spaces |
| Claude Docs | Documents Claude writes and keeps editing, which I can share |
| SuperMe | Decision questions, see above |

Every connector you turn on adds its tools to Claude's context. Turn on what you use, not everything.

## The browser

There's no connector for Mobbin, Land-book, Awwwards or Siteinspire. I give Claude my browser instead, with [Claude in Chrome](https://claude.com/chrome), so it can use the sites I'm logged into.

- **Logins and captchas are your job.** Log in yourself. If a site blocks Claude, it should tell you, not work around it.
- **Don't allow everything on every site.** A page can contain text that tries to give Claude instructions. [Module 11](../course/11-safety.md) covers this.

---

If you want to change how Claude Code looks: [ishuagrawal/claude-code-themes](https://github.com/ishuagrawal/claude-code-themes).

# 11 · Safety and licenses

**What you'll learn**

- What the permission modes actually do, especially auto and bypass
- How to write allow, ask and deny rules, with my pipeline as the example
- Why Claude should never read your `.env`
- What prompt injection is, and why it matters most when you walk away
- How to check whose skill it is before you copy it

---

## Why this matters

Claude Code can edit files, run commands and use your browser. The settings in this module decide which of those it does without asking you, and they're the ones my [agency pipeline](../templates/agency-pipeline/) and [`setup/settings.example.json`](../setup/settings.example.json) use.

## What the permission modes do

| Mode | What happens |
|---|---|
| Manual (`default`) | Claude asks before most edits, shell commands and network access. |
| Accept edits (`acceptEdits`) | File edits in your working directory go through without asking. Most other commands still ask. |
| Plan (`plan`) | Claude researches and proposes a plan, but doesn't edit your files. |
| Auto (`auto`) | A separate classifier model checks actions and blocks the ones it judges risky, like `curl \| bash`, sending sensitive data out, force pushes or production deploys. |
| Bypass permissions (`bypassPermissions`) | No prompts and no safety checks. |

In the terminal you cycle through modes with Shift+Tab. In the desktop app there's a mode selector under the prompt box.

The docs are blunt about auto and bypass. Auto "reduces permission prompts but does not guarantee safety." Bypass "offers no protection against prompt injection or unintended actions", and belongs in isolated containers or VMs without internet access.

What I recommend: auto when you want Claude to keep going, bypass only in a throwaway container. If you leave a session alone, set `permissions.denyInsteadOfPrompting` to `true` in your user settings. Calls that would wait for a prompt get denied, and the session keeps working.

## Allow, ask, deny

Rules live under `permissions` in a settings file. Claude Code checks deny first, then ask, then allow, and the first match decides. Claude Code enforces these rules, not the model, so nothing in a prompt or a CLAUDE.md can talk its way past them.

This is a shortened version of the settings in my [agency pipeline](../templates/agency-pipeline/):

```json
{
  "permissions": {
    "defaultMode": "acceptEdits",
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run build)",
      "Bash(git status *)",
      "Bash(git diff *)"
    ],
    "ask": [
      "Bash(npm install *)",
      "Bash(git commit *)",
      "Bash(git push *)",
      "Bash(gh pr *)"
    ],
    "deny": [
      "Read(.env)",
      "Read(.env.local)",
      "Edit(CLAUDE.md)",
      "Edit(.claude/agents/**)",
      "Edit(.claude/skills/**)",
      "Edit(.claude/hooks/**)",
      "Edit(.claude/settings.json)",
      "Bash(rm *)",
      "Bash(git push --force *)",
      "Bash(git reset --hard *)",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  }
}
```

- **Allow** what's harmless and frequent: lint, build, looking at git.
- **Ask** before anything that adds a dependency, writes history or leaves my machine.
- **Deny** secrets, destructive commands and Claude's own rules.

The last group matters most. Claude can't edit its own CLAUDE.md, agents, skills, hooks or settings. If it thinks a rule is wrong, it has to suggest the change to me. Deny rules still block in bypass mode. The pipeline adds a `PreToolUse` hook as a second lock.

`auto` and `bypassPermissions` don't work as `defaultMode` in a project's settings file, only in your user settings or as a launch flag. Run `/permissions` now and then to see what's actually allowed.

## Never let Claude read `.env`

`Read(.env)` in the deny list stops Claude's file tools from opening the file, and recognized shell commands like `cat` or `head` too. It doesn't stop a Python or Node script that opens the file itself, or a `grep -r` over the whole folder.

So the deny rule is the second line of defense. The first is not having the file. I don't use `.env` at all: real secrets live in my host's secret store, and Claude gets only public values ([module 09](09-engineering.md)).

## Prompt injection: the risk when you're away

Prompt injection is text written for Claude, hidden in something Claude reads: a web page, a README, an issue, an email. Claude reads it as part of the task and may act on it.

When you're at the keyboard, a permission prompt gives you a chance to say no. When you're at lunch, nobody says no. In auto mode the classifier at least looks for actions that follow hostile content Claude has read. In bypass mode only your deny and ask rules are left.

Before you walk away: auto mode, secrets out of reach, `curl` and `wget` denied, and no "just finish" on a task that browses sites you don't know. Anthropic's security page also recommends a VM when Claude works with external web services.

## Browser and computer use

Claude in Chrome uses your browser's login state, so it can reach any site you're signed into. When it hits a login page or a CAPTCHA, it stops and asks you. Keep it that way: logins are your job ([module 08](08-design.md)). The site prompt can allow all actions on a site for the session. Give that to sites you trust, not to everything. In the terminal, `/chrome` shows the connection and lets you manage site permissions.

Computer use I hand out task by task. Sometimes:

> «Übernimm die Kontrolle über meinen PC und mach es selber.»
> *Take control of my PC and do it yourself.*

And sometimes the opposite: «Probiere, meinen PC nicht zu verwenden.» *Try not to use my PC.*

In the desktop app, Claude asks per app and per session. Browsers are view-only for it, and terminals are click-only. Anthropic's safety guide says to keep it away from banking, healthcare and government apps and to close anything confidential first. The settings have a denied-apps list for that.

## Whose skill is it?

My old version of this repo had 11 `SKILL.md` files under a README that said "MIT", and no LICENSE file. At least two of the skills weren't mine. One had an attribution line pointing to a path that never existed. A line in a README isn't a license file, and it can't license other people's work anyway. Now I link instead of copying, and [CREDITS.md](../CREDITS.md) lists every author and license.

The traps I found while cleaning up:

1. **The LICENSE file beats the frontmatter.** One skill I had says MIT in its frontmatter, but its folder ships an Apache-2.0 LICENSE. The file counts.
2. **No LICENSE file means all rights reserved.** [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) has none, and its README just says "MIT". Link it, don't copy it.
3. **Same name, different project.** There are two unrelated "caveman" projects: [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (Apache-2.0) and [akramsystems/caveman](https://github.com/akramsystems/caveman) (MIT). There are also two different "cold-email" skills, from coreyhaines31 and from alirezarezvani. Check the repo, not the name.
4. **Derived work doesn't always say so.** A popular anti-slop skill is built on Impeccable and doesn't mention it. Copy it and you carry a credit you didn't know you owed.
5. **Apache-2.0 asks more than MIT.** If you copy Apache-2.0 work, include the license, keep the NOTICE file if there is one, and note what you changed. MIT asks for the copyright and license notice. Linking asks for nothing.
6. **Anthropic's built-in browser and computer-use skills are proprietary.** Don't redistribute them. You don't need to, because they're built in.

Before you copy anything, open the LICENSE in the skill's folder and at the repo root, and look for a NOTICE file. If anything is unclear, link.

---

## Exercise

1. Run `/permissions` in a project and write down what's allowed.
2. Write a `.claude/settings.json` for it: four allow rules, three ask rules, and deny rules for `.env` and for Claude's own config.
3. Create a dummy `.env` with a fake value, never a real one, and ask Claude to read it. It should be blocked. If it isn't, fix the rule.
4. Pick one skill you have installed. Find its LICENSE file and compare it with the frontmatter and the README. Decide: link or copy.

## Mistakes I made so you don't have to

- **An "MIT" README over other people's skills.** Link and credit. Copy only what the license file allows.
- **No LICENSE file in my own repo.** A line in a README isn't a license. Now the repo has a real [LICENSE](../LICENSE) file.
- **Trusting an attribution line.** The one in my old repo was wrong. Check the source yourself.

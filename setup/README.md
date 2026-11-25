# Adopt my setup

This gets you my Claude Code setup in about 15 minutes: my house rules, my settings, the skills and plugins I actually use, and the connectors I keep on.

Everything here is a starting point. Take what fits, leave the rest. [Module 12](../course/12-adopt-the-setup.md) walks through the same steps with more of the why.

| File | What it is |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | My global house rules. Short on purpose |
| [`settings.example.json`](settings.example.json) | My settings, cleaned up: no local paths |
| [`skills.md`](skills.md) | Every skill I recommend, by topic, with install commands |
| [`plugins.md`](plugins.md) | Plugins, marketplaces, connectors and the browser |
| [`install.ps1`](install.ps1), [`install.sh`](install.sh) | Install scripts for Windows and macOS |

---

## Step 0: What you need

- **Claude Code**, a current version (I tested with 2.1.329). Check with `claude --version`. Start it once in a terminal and sign in before you go on.
- **Node.js** 22.20 or later, for the skills CLI. Check with `node --version`.
- **git**, and a clone of this repo:

```
git clone https://github.com/DjordjeMojsilovic/Djordjes-Claude-Setup.git
cd Djordjes-Claude-Setup
```

All commands below run from the repo's root folder.

## Step 1: House rules

`~/.claude/CLAUDE.md` applies to every project. Copy mine there. If you already have one, the commands below won't overwrite it. Then open both files and merge by hand: keep your rules, add the ones of mine you agree with, and keep it short. Long house rules get followed worse.

**Windows (PowerShell)**
```powershell
New-Item -ItemType Directory -Force $HOME\.claude | Out-Null
if (Test-Path $HOME\.claude\CLAUDE.md) { "You already have one. Merge by hand." } else { Copy-Item setup\CLAUDE.md $HOME\.claude\CLAUDE.md }
```

**macOS (Terminal)**
```bash
mkdir -p ~/.claude
if [ -e ~/.claude/CLAUDE.md ]; then echo "You already have one. Merge by hand."; else cp setup/CLAUDE.md ~/.claude/; fi
```

## Step 2: Settings

Your user settings live in `~/.claude/settings.json` (on Windows that's `%USERPROFILE%\.claude\settings.json`).

- **No settings file yet:** copy `setup/settings.example.json` there and rename it to `settings.json`.
- **You already have one:** copy the values over by hand. For lists like `allow` and `enabledPlugins`, add my entries to yours. Or let Claude do it. Start `claude` in this repo and say: *"Merge setup/settings.example.json into my ~/.claude/settings.json. Keep my existing values and show me the diff before you save."*

The file has to stay valid JSON, so there are no comments in it. Here's what each part does:

| Key | Value | Why |
|---|---|---|
| `model` | `opus` | The newest Opus. I use it as my default |
| `effortLevel` | `high` | More reasoning by default. Turn it down with `/effort` for small tasks |
| `advisorModel` | `fable` | A stronger model reviews the plan before Claude starts and the result before it says done. It has to be at least as capable as your main model |
| `enableWorkflows` | `true` | Turns on dynamic workflows |
| `theme` | `dark` | Change it with `/config` |
| `permissions.defaultMode` | `auto` | Claude works without routine prompts, and a classifier checks shell commands and network requests first. If auto mode isn't available to you, Claude Code starts in Manual instead |
| `permissions.allow` | read-only git, build, lint, test | These run without asking |
| `permissions.ask` | commit, push, `npm install`, publish, deploy, merging a PR | These always ask, even in auto mode |
| `permissions.deny` | `.env` files, credentials, private keys, `~/.ssh`, `~/.aws` | Claude can't read these files. It can't edit or write them either. `.env.example` stays readable |
| `enabledPlugins`, `extraKnownMarketplaces` | the five plugins from [plugins.md](plugins.md) | Turns them on. The install script in step 3 installs them |

**Why each rule is there twice.** On Windows, Claude Code can run commands through PowerShell instead of Bash, and a `Bash(...)` rule doesn't match a PowerShell command. So every rule has a `PowerShell(...)` twin. On macOS the PowerShell lines are never used.

**What deny rules don't cover.** They apply to Claude's own file tools and to commands Claude Code can analyze, like `cat`. A script that opens files by itself isn't stopped. Don't keep secrets anywhere a script could pick them up.

**What I left out on purpose.** My own file has hooks for a local app and a status line with a path that only exists on my machine. None of that belongs on your machine. I also don't recommend `bypassPermissions`: it skips almost every prompt, and with a browser attached that's how a bad web page gets to run things. [Module 11](../course/11-safety.md) explains why.

To check the file loaded, start `claude` and run `/status`. The `Setting sources` line should list `User settings`. If an entry was rejected, `claude doctor` tells you which.

## Step 3: Install skills and plugins

The script installs three groups: **Core**, **When needed** and **Prototype variants** (see [skills.md](skills.md) for what's in each). It asks before each group. Third-party skills and plugins come from their authors' repos. My own skills are copied from [`skills/`](../skills/), and the script never overwrites a folder that already exists.

Do a dry run first. It only prints the commands.

**Windows (PowerShell)**
```powershell
powershell -ExecutionPolicy Bypass -File setup\install.ps1 -DryRun
powershell -ExecutionPolicy Bypass -File setup\install.ps1
```
`-ExecutionPolicy Bypass` only applies to this one run. Windows blocks scripts by default.

**macOS (Terminal)**
```bash
bash setup/install.sh --dry-run
bash setup/install.sh
```

| Option | PowerShell | macOS | What it does |
|---|---|---|---|
| Dry run | `-DryRun` | `--dry-run` | Prints every command, installs nothing |
| No questions | `-Yes` | `--yes` | Installs every group without asking |
| Skip groups | `-Skip variants` | `--skip variants` | Leaves out groups: `core`, `when-needed`, `variants`. Several at once: `-Skip core,variants` or `--skip core,variants` |

Skills land in `~/.claude/skills`, plugins in `~/.claude/plugins`. If a command fails, the script keeps going and lists the failed ones at the end, so you can run them by hand and read the error. Running the script twice is fine.

When it's done, start a new Claude Code session, or run `/reload-plugins` in the one you have open.

## Step 4: Connectors and the browser

Connectors aren't part of Claude Code's settings. You turn them on yourself in the Claude desktop app, under Customize › Connectors. Each one asks you to sign in to that service, and you do that yourself.

The ones I keep on: **Unsplash, Canva, Figma, Hugging Face, Claude Docs** and, for decision questions, **SuperMe**. What I use each one for, and the Figma limit on the Starter plan, is in [plugins.md](plugins.md#connectors).

For design references on Mobbin, Land-book or Awwwards, give Claude your browser with Claude in Chrome. You log in, you solve the captchas. Details in [plugins.md](plugins.md#the-browser).

## Step 5 (optional): My agency pipeline

[`templates/agency-pipeline`](../templates/agency-pipeline/) is the project setup I use for client websites: a router, agents, skills, hooks and rules. It brings its own `CLAUDE.md` and `.claude/settings.json`, so put it in a **new** project, not an existing one. Read its `CLAUDE.md` first.

**Windows (PowerShell)**
```powershell
Copy-Item -Recurse templates\agency-pipeline\* C:\path\to\new-project\
```

**macOS (Terminal)**
```bash
cp -R templates/agency-pipeline/. ~/path/to/new-project/
```

## Check that it worked

Start `claude` in any project and run:

- `/status`: your user settings are loaded
- `/plugin`: the five plugins show up as installed

Then ask Claude *"Which skills do you have?"* and look for hallmark, emil-design-eng and better-layout.

## Undo

- A plugin: `claude plugin uninstall <name>`
- A skill: `npx skills remove --global <name>`, or delete its folder in `~/.claude/skills`
- The house rules: delete `~/.claude/CLAUDE.md`, or take my lines back out of yours
- The settings: remove the keys you copied over

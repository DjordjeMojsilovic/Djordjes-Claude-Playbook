# My own skills

These are the skills I wrote myself (or rewrote, with credit). Everything else I use lives in its author's repo and is linked from [`setup/skills.md`](../setup/skills.md).

| Skill | What it does | When I use it |
|---|---|---|
| [ultraplan](ultraplan/SKILL.md) | Treats a question like an operation: research, assessment, one clear plan. No fluff. | Decisions and "how should I approach this" questions where I want one recommendation, not ten options |
| [interactive-learning](interactive-learning/SKILL.md) | Turns any topic into a self-contained HTML study page: theory first, then flashcards, quizzes, visual explainers | School. Theory first, then practice |
| [decision-toolkit](decision-toolkit/SKILL.md) | RICE, decision matrix, pre-mortem and other frameworks for hard choices | Build vs. buy, priorities, anything with real trade-offs. Adapted from [glebis/claude-skills](https://github.com/glebis/claude-skills) (MIT), see `LICENSE-UPSTREAM` |

## Install

**Claude desktop app:** zip the skill's folder, then go to Customize › Skills › + › Create skill › Upload a skill. Code execution has to be on.

**Claude Code:** copy the folder into `~/.claude/skills/` (for all projects) or `.claude/skills/` (for one project).

```powershell
Copy-Item -Recurse skills\decision-toolkit $HOME\.claude\skills\
```

```bash
cp -r skills/decision-toolkit ~/.claude/skills/
```

**Heads-up on `ultraplan`:** Claude Code ships its own `/ultraplan`. If you install mine in Claude Code, rename the folder and the `name:` line (for example to `ops-plan`) so the two don't clash. In the desktop app's chat there's no clash.

## Want to write your own?

Read [module 04](../course/04-skills.md). Short version: the `description` decides when the skill fires, so write it like a list of the exact situations and phrases, not like marketing copy.

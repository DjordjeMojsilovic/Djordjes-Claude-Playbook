# 07 · Saving tokens

**What you'll learn**

- Where tokens actually go in a Claude Code session
- The levers, in the order I'd pull them
- What my own data says, which isn't flattering
- How to check instead of guess

---

## My starting point

I thought I was frugal. Two plugins ran in almost every session: caveman, which makes Claude answer in short, clipped sentences, and ponytail, which makes it write the smallest code that solves the task. Ponytail even started through a hook at every session start, and I had a caveman status line. I wrote things like:

> «Achte darauf, token-effizient zu arbeiten.»
> *Make sure you work token-efficiently.*

At the same time:

- Many of my big design and website sessions ended in "This session is being continued from a previous conversation that ran out of context."
- I hit my usage limit in the middle of a task several times and had to continue after the reset.
- I rarely used `/compact` and hardly ever `/clear`.
- Most of my sessions ran on effort `high` or higher, small tasks included.

caveman and ponytail shorten what Claude writes. My costs came from what Claude reads: long contexts, a long skill list, swarms of subagents, rounds of variants. I was saving at the wrong end.

## How a session spends tokens

Claude Code sends the whole conversation with every request, and every tool call adds another request carrying the results. Prompt caching makes re-reading cheaper, but a one-line question in a session that's been open all day still pays for the whole day. On top of that comes what's always loaded: CLAUDE.md, rules without `paths`, the skill list, the tool names of your MCP servers. Then whatever Claude writes, including thinking, which is billed as output.

That's why the list below starts with context and ends with output.

## The levers, in order

This ranking is my reading of my own data and the docs. I haven't measured each lever on its own.

### 1. One session per task

This is the big one. When you switch to unrelated work, start fresh with `/clear`. The docs are blunt: stale context wastes tokens on every message that follows. `/clear` costs nothing. `/compact` is a big request in itself, because it has to read everything it summarizes. Use `/compact` when you need continuity and `/clear` when you don't. If you want to come back later, name the session with `/rename` first and find it again with `/resume`.

My sessions got long because I kept adding the next thing to the same conversation. The fix is boring: one job, one session, then a new one.

### 2. Fewer installed skills

The skill list goes into context in every session, whether you use the skills or not. I had about 150 skills installed, and most of them never ran ([04](04-skills.md)). The list gets about 1% of the context window. Past that, descriptions get dropped, so you pay for the list and still lose the triggers.

Run `/skill-doctor`, turn off what you don't use, and disable plugins you installed for one experiment. For plugins from the official marketplace, the details pane in `/plugin` shows what each one adds per turn.

### 3. Rules that load when needed

CLAUDE.md loads at the start of every session. The docs recommend staying under 200 lines per file, because longer files cost more context and get followed less reliably. Put instructions that only matter for part of the codebase into `.claude/rules/` with a `paths` field. Those load only when Claude reads or edits a matching file. Put multi-step workflows into skills, which load only when used.

My pipeline does this. It has three rules, each scoped with `paths`: one for UI files, one for the data layer, one for the findings folder. The UI rule stays out of context while Claude writes a database migration. More in [03](03-context.md).

### 4. Subagents return summaries

Running tests, reading logs and searching a codebase produce a lot of text. Let a subagent do that in its own context and send back a summary, and your main session stays small.

The honest part: this protects your main context. It doesn't make the work free. Every subagent spends its own tokens, against the same limits. The skills that ran inside my subagents cost tokens too. [06](06-agents.md) covers when not to fan out.

### 5. The right model for the job

Not every step needs the biggest model. In my pipeline the critic and the concept agent run on Opus, the builder on Sonnet, QA and the scribe on Haiku. My persona tests run on Haiku, and for school code I switched to Sonnet. The docs recommend `model: haiku` for simple subagent tasks. More in [02](02-models-effort-advisor.md).

### 6. Effort on purpose

Effort controls how much Claude thinks, and thinking is billed as output. Opus 5.5 always thinks, so you can't switch thinking off, but you can lower the effort with `/effort`. Set it per task, not once for everything. Skills and subagents can set their own effort in the frontmatter. My QA and scribe agents run on `low`.

### 7. Output length, last

Now caveman. Shorter answers save output tokens, and they're quicker to read. It's a fine habit. It's just the smallest lever on this list.

Ponytail is a different case, because it keeps the code small, not only the answer. That's worth something beyond tokens. But I switch it off for design work:

> «Fahre fort ohne die Verwendung von Ponytail.»
> *Continue without using ponytail.*

Minimal code and a high design bar don't always fit together.

## Check, don't guess

- **`/usage`** shows your plan usage. On Pro, Max, Ultra, Team and Enterprise plans it also breaks down what used it (skills, subagents, plugins, MCP servers) and suggests changes. `/cost` is an alias for it. I almost never opened it. That's the real lesson of this module.
- **`/context`** shows what's taking up space in the current context right now.
- **`/skill-doctor`** shows what each skill costs and how often it runs.

When you hit a limit, `/rate-limit-options` shows how to keep going. If you hit limits often, go back to lever 1.

---

## Exercise

1. Open your longest running session and run `/context`. Write down the three biggest items.
2. Run `/usage` and read the breakdown. Which skill, plugin or subagent takes the biggest share?
3. For one week, keep to one task per session and use `/clear` when you switch. Count how often you see "continued from a previous conversation" compared to the week before.
4. Move one section of your CLAUDE.md that only matters for some files into `.claude/rules/`, with `paths`.
5. Lower `/effort` for one small task and compare the result. If it's just as good, keep the lower setting for tasks like that.

## Mistakes I made so you don't have to

- **Optimizing the answer, not the context.** caveman on, a long skill list.
- **One endless session.** The context overflowed, got summarized, and overflowed again.
- **Effort `high` on everything.** Including tasks that didn't need it.
- **Never looking at the numbers.** The tools that show where tokens go were there the whole time.

# 02 · Models, effort, advisor

**What you'll learn**

- Which model I use for what, and why the one who thinks gets the big model
- What effort does, and when to raise or lower it
- The advisor: a second opinion before you start and before you say "done"
- What all of this costs

---

## The models

Claude Code has short aliases, so you don't have to remember version numbers. In November 2026 they point to these models on the Anthropic API:

| Alias | Model | What the docs say it's for |
|---|---|---|
| `opus` | Opus 5.5 | complex reasoning tasks |
| `sonnet` | Sonnet 5.5 | daily coding tasks |
| `haiku` | Haiku 5.5 | simple tasks, fast |
| `fable` | Fable 5.2 | your hardest and longest-running tasks |

Aliases move to newer models when Claude Code updates, so check the [model docs](https://code.claude.com/docs/en/model-config) when you read this. Fable needs access, and on some plans its usage bills to usage credits instead of your plan limits.

You switch with `/model sonnet` inside a session, `claude --model opus` at launch, or the `model` key in your settings.

## What I actually use

Opus 5.5 on high effort is my default. Sometimes I run Fable as the main model, and Sonnet only for small things. My user settings come down to three lines:

```json
{
  "model": "opus",
  "effortLevel": "high",
  "advisorModel": "fable"
}
```

When I have Claude start a new session for me, I give it the same combination: «mit Opus 5.5 high als Model und Fable als Advisor» (*with Opus 5.5 on high as the model and Fable as the advisor*). The full file is in [`setup/settings.example.json`](../setup/settings.example.json).

Then I go down for small things. For a school Java project I added `/model sonnet 5.5` to my messages several times on the same day. A first-year exercise doesn't need the biggest model.

And I go to Haiku for mass work. I've had 10 Haiku agents play customers with their own goals and give feedback, 10 more criticise the UX of my Windows app in two graded rounds, and 20 test our company website before launch:

> «Nimm 20 Haiku-5.5-Agents mit je eigenem Purpose. Sie gehen durch, geben dir anschliessend Feedback, und du fasst es mir zusammen.»
> *Take 20 Haiku 5.5 agents, each with its own purpose. They go through it, give you feedback afterwards, and you summarise it for me.*

Twenty testers are cheap on Haiku. On Opus they wouldn't be. [Module 06](06-agents.md) shows how to set them up.

## The one who thinks gets Opus

When I built my agency pipeline, I wrote:

> «Der, der denkt, braucht Opus, ein Mikro-Arbeiter nur Sonnet.»
> *The one who thinks needs Opus, a micro-worker only needs Sonnet.*

That's how the template is built. Every agent has its own model and effort in its frontmatter:

| Agent | Job | Model | Effort |
|---|---|---|---|
| concept | visual ideas before anything is built | opus | high |
| aesthetic | judges the result, never builds | opus | high |
| backend | data model, auth, secrets | opus | high |
| finisher | closes the gaps that are still open at the end | opus | high |
| copy | every word a visitor reads | sonnet | high |
| recon, builder | takes stock of a site, writes the code | sonnet | medium |
| qa | breakpoints, contrast, keyboard, dead links | haiku | low |
| scribe | keeps the state and decision notes up to date | haiku | low |

In a subagent file it's two lines in the frontmatter, `model: haiku` and `effort: low`. The whole pipeline is in [`templates/agency-pipeline/`](../templates/agency-pipeline/).

My rule for splitting work:

- **Judgment** goes to Opus: design decisions, architecture, security, anything that's expensive to get wrong.
- **Execution against a clear spec** goes to Sonnet.
- **Checking against a list** goes to Haiku.

## Effort

Effort controls how much Claude reasons before it acts. Opus 5.5, Sonnet 5.5, Haiku 5.5 and the Fable models support `low`, `medium`, `high`, `xhigh` and `max`. Opus 5.5 defaults to `medium`.

You change it with `/effort` (a slider), `/effort high` directly, or `effortLevel` in settings. `/effort status` shows the current level. The setting accepts `low` to `xhigh`, but not `max`.

I run `high` almost every time, small tasks included. The docs say Opus 5.5 on `medium` matches or beats Opus 5 on `high` in Anthropic's own coding evaluations. That makes `medium` a better starting point than my habit suggests.

When to change it:

- **Raise it** for planning, architecture, hard bugs and long runs where one wrong turn costs an hour.
- **Lower it** for quick back-and-forth where you review every result yourself. That's what the docs say `low` is for.
- **Be careful with `max`.** The docs warn that it can show diminishing returns and is prone to overthinking.

You pay for all thinking tokens, even the ones you don't see.

## The advisor

The advisor lets Claude consult a second, usually stronger model at key moments during a task. The advisor gets the whole conversation, every tool call included, and sends back guidance. Claude decides when to call it. It tends to do that before committing to an approach, when an error keeps coming back, and before declaring a task done. The feature is still marked experimental.

`/advisor` is the slash command I type most. I start almost every session with `/advisor fable`. On top of that I often write "ask your advisor" into my prompts:

> «Frage deinen Advisor vor dem Beginn nach einem genauen Plan.»
> *Ask your advisor for an exact plan before you start.*

That sentence is worth adding. There's no setting that forces advisor calls, but you can ask for one in your prompt like any other tool. Ask for the two moments that matter most: a plan before the first edit, and a check before "done".

Setting it up:

- `/advisor fable` or `/advisor opus` sets it and saves it as `advisorModel` in your user settings. `/advisor off` turns it off.
- `claude --advisor opus` sets it for one session only.
- The advisor has to rank at or above your main model. With Opus 5.5 as the main model, it can be Fable, or Opus 5 or later. A cheaper pairing from the docs is Sonnet as the main model with Opus as the advisor.

What the advisor can't fix: it reads the same conversation as Claude. If the context is wrong, say the references are missing or the brief is vague, a second opinion confirms the mistake instead of catching it. Fix the brief first ([module 01](01-prompting.md)).

## Cost

**The advisor isn't free.** Each call reads the whole conversation again at the advisor model's rates, and that read isn't cached between calls. My sessions are long, so each call is expensive. On subscription plans it counts toward your limits, and a Fable advisor bills to usage credits on plans where Fable does.

**Opus as the default isn't either.** The docs say Sonnet handles most coding tasks well and costs less, and that Opus is for complex architecture and multi-step reasoning. I default to Opus anyway, and I've hit my usage limit several times and had to continue after the reset. Part of that is the price of my default. If you pick Opus too, pick it knowingly.

**Pick the model at the start.** Each model has its own prompt cache, so the first request after a `/model` switch re-reads the whole conversation without cache. Turning the advisor on or off doesn't break the cache.

`/usage` shows your session totals, with advisor calls included. [Module 07](07-tokens.md) goes through the other levers.

---

## Exercise

1. Take one real task. Run it once with `sonnet` on `medium` and once with `opus` on `high`, in two fresh sessions. Compare the result, the time it took and `/usage`.
2. Set an advisor with `/advisor opus`, or `/advisor fable` if you have access. Put this into your next brief: *"Ask your advisor for a plan before you start, and again before you say you're done."*
3. If you use subagents, give the one that only checks things `model: haiku` and `effort: low`.
4. Write your own rule in one sentence: which model for which kind of work.

## Mistakes I made so you don't have to

- **High effort for everything.** Most of my sessions run on `high`, small fixes included. Start on the default and raise it when a task is hard, not out of habit.
- **"Use the advisor everywhere."** I once wrote «Nutze überall den Advisor und sage mir kurz, was er sagt» (*use the advisor everywhere and briefly tell me what it says*). Every call re-reads the whole session. Before the start and before "done" is enough for most tasks.
- **Typing `/model` into message after message.** On that school day I added `/model sonnet 5.5` to the end of several messages in a row. Run it on its own, once, and know what it does: `/model` saves your pick as the default for new sessions. Drop to Sonnet for homework, and the next session starts on Sonnet too unless you switch back. In the CLI's `/model` picker, `s` switches for this session only.

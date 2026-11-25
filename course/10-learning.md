# 10 · Learning

**What you'll learn**

- Why Claude takes the learning away from you by default
- The three dials I turn for school work: scope, level and role
- How to get a reflection, a cheaper model and a proofread that keep the work yours
- How to turn a topic into theory plus flashcards

---

## The problem

Claude is built to finish tasks. When I'm learning, finishing is the wrong goal. If Claude fixes my school project in one go, the project works and I know exactly as much as before.

So when it's about learning, I say that first:

> «Ich bin gerade am Lernen und möchte die Ursache dahinter verstehen und eine Erklärung erhalten, wie das am besten geht.»
> *I'm learning right now. I want to understand the cause behind this and get an explanation of how to do it best.*

The context was a school Java project. I had to move a method from one class to another, and suddenly there were a hundred errors. The errors going away wasn't the point. I wanted to know why moving one method breaks that much.

## Three dials

Left alone, Claude sets all three dials to "maximum help". For learning I turn them back.

### 1. Scope: only what I asked

> «Nichts anderes anfassen.»
> *Don't touch anything else.*

In a school project, every change outside the task is a change I have to explain. In the same Java project, Claude wanted to "fix" something that was there on purpose:

> «Bitte nicht den Bug bei der Monatskarte fixen, das ist intended, weil die Monatskarte unabhängig von der Anzahl Zonen immer gleich viel kostet.»
> *Please don't fix the "bug" with the monthly ticket. That's intended, because a monthly ticket costs the same no matter how many zones.*

So tell Claude which parts are intended before it starts.

And check the diff, not the summary. Once I saw +98 −134 in a diff after I'd said not to change anything.

### 2. Level: mine, not Claude's

> «Es sieht zwar gut aus, aber es sollte so sein, als wär's auf dem Level von einem First-Year gemacht worden. Diese Funktionen kennt er nicht.»
> *It looks good, but it should look like a first-year made it. A first-year doesn't know these functions.*

Claude's first version used features we hadn't covered yet. It was better code and worse homework. Code you can't explain in class isn't yours. Tell Claude what you've covered so far, and that everything beyond it is off limits.

### 3. Role: tutor, not doer

The biggest switch is who answers. For one school module I set up a whole chat that way:

> «Ab jetzt arbeiten wir nur in diesem Chat. Es ist eigentlich eine Abfrage: Du fragst mich, ich löse, und du trägst es ein.»
> *From now on we only work in this chat. It's basically a quiz: you ask me, I solve it, and you write it down.*

Claude Code has a built-in version of this, the Learning output style. Claude explains its choices as it works and leaves the pieces with a real decision in them for you, marked `TODO(human)` in the file. Then it waits until you've written them. In the terminal you switch with `/output-style learning`. In the desktop app you set `"outputStyle": "Learning"` in a settings file.

## Reflection in first person

For my learning journal, Claude describes the problem I had:

> «Beschreib das Problem, das ich hatte, in 5 Sätzen in der Ich-Form, und wie ich es nächstes Mal behebe.»
> *Describe the problem I had in 5 sentences, in the first person, and how I'll fix it next time.*

Five sentences force it to the point. First person makes it read like a journal, not like a report about me.

It's a draft, not the entry. I didn't take the first version as it was: I had Claude start with what I'd done, and put the part about the problem after it. Read every sentence and ask whether it's true for you. If you can't tell, you haven't understood the problem yet, and finding that out is worth more than the journal entry.

## A cheaper model for school code

School code doesn't need the strongest model. On the day of that Java project I switched to Sonnet several times:

```
/model sonnet
```

Anthropic describes Sonnet as the model for daily coding tasks, and at the time of writing it costs about half of what Opus does per token on the API. For first-year Java that's plenty. Keep Opus for the hard problems. More on choosing models in [module 02](02-models-effort-advisor.md).

## Proofreading without rewriting

School texts are graded as my writing. If Claude "improves" them, they stop being mine. So the proofreading prompt is strict:

> «Kannst du meine Rechtschreibung überprüfen, ohne Wörter zu ändern, nur Kommasetzung und Grammatik, und mir den exakt gleich formatierten Text zurückgeben?»
> *Can you check my spelling without changing any words, only commas and grammar, and give me back the text with exactly the same formatting?*

Then put the result next to your original. If a single word changed, send it back.

## Learning a topic: theory first, then practice

For learning a whole topic, I wrote my own skill: [interactive-learning](../skills/interactive-learning/SKILL.md). It turns a topic into one HTML page, with theory at the top (diagrams, worked examples) and flashcards or a quiz below. The order is the point. The skill never skips the theory, even if you only ask for flashcards, because the theory is what the cards hang on.

My skill list also has a skill called `learn`. It ran often in my sessions, and I never picked it myself. Every run came from subagents inside a workflow that builds learning modules. Having a skill installed isn't the same as using it. More on that in [module 04](04-skills.md).

---

## Exercise

Take a school task you have to do anyway.

1. Write one prompt that sets all three dials: scope ("only touch X"), level ("we've covered A, B and C, nothing else") and role ("ask me questions, don't solve it").
2. Switch to Sonnet with `/model sonnet` before you start.
3. Work through the task with Claude as your tutor. Write every line of the solution yourself.
4. Ask for a 5-sentence reflection in first person. Rewrite every sentence that isn't true for you.
5. Build an interactive-learning page on the topic, and do the flashcards again a day later.

If Claude wrote more than a few lines of the solution, one of the dials was set wrong. Find out which one.

## Mistakes I made so you don't have to

- **Saying "nothing else" and not checking.** Claude still touches things. The diff tells you what happened. The summary tells you what Claude thinks happened.
- **Not saying what's on purpose.** To Claude, an intended special case looks like a bug. Say up front which parts are intended.
- **Code above my level.** It looked good, and it used things we hadn't covered. Give Claude your level before it writes, not after.
- **Not asking what the material requires.** Claude once went through course material with me and didn't mention a requirement I later found myself. «Wieso hast du mich darauf nicht hingewiesen?» *Why didn't you point that out?* After that I wanted a rule for it in my CLAUDE.md: list every requirement from the material, and give a reason for every grade.
- **Exercises that test nothing.** When Claude built practice questions for a learning module, some of them were useless: «Solche Aufgaben wie hier sind auch null sinnvoll», *tasks like these make zero sense*. Check that every exercise asks for a real skill, not for a word from the text.

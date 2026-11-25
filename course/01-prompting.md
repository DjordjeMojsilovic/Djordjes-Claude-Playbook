# 01 · Prompting

**What you'll learn**

- Why I prompt in two modes: one big brief, then short steering
- A brief template built from my own briefs
- How to get options you can tap instead of open questions
- How to correct Claude while it's working
- Read-only requests, roles and time budgets, and where each one breaks

---

## Two modes

My messages come in two kinds, with almost nothing in between.

My first message in a session is long, and some of them are full briefs I paste in. After that I steer with short messages, often only a few words.

The short ones look like this:

> «fahre fort»
> *continue*
>
> «gerne alles»
> *yes, all of it*
>
> «pr und merge»
> *open the PR and merge it*

I type «fahre fort» a lot. That only works because the first message did the real work. After that I'm steering, the way you give short instructions to someone who already has a clear briefing.

A great follow-up can't rescue a bad brief.

## The brief

Most of my long briefs have the same shape. They start with «Kontext:» and «Auftrag:» (context, task), and the good ones add success criteria and limits. Here it is as a template:

```text
Context:      Where we are, what exists, what was already tried.
Task:         What you should do. One sentence first, details after.
Success:      How we both know it worked. Numbers if you can.
Guardrails:   What you decide yourself, and when you ask me.
Don't touch:  Files, folders and features that stay exactly as they are.
Proof:        What you show me before you say "done".
```

Every line comes from one of my own briefs.

**Success criteria with a before and after.** When I wanted my Windows app smaller and faster, I wrote:

> «ERFOLGSKRITERIEN 1. Alle bestehenden Funktionen laufen weiter. 2. Grösse, Startzeit, Ladezeit und Schritte pro Prozess sind messbar besser. Jede Zahl hat ein Vorher und ein Nachher.»
> *SUCCESS CRITERIA 1. All existing features keep working. 2. Size, startup time, load time and steps per process are measurably better. Every number has a before and an after.*

"Faster" is an opinion. A before and an after is something Claude can check on its own.

**Guardrails that say when to ask.** For a client's website rebuild, the brief said:

> «Offene Fragen und Blocker löst du selbst, indem du die Referenzseite fetchst. Erst wenn die Seite die Antwort wirklich nicht hergibt, frag mich.»
> *Solve open questions and blockers yourself by fetching the reference site. Only when the site really doesn't have the answer, ask me.*

A spec for a USB tool had harder limits: «keine eigene Sync-Logik, frag mich stattdessen» (*no sync logic of your own, ask me instead*), no invented download URLs, and a backup before anything gets deleted.

**Say what you don't want, and what's off limits.** For my notes vault:

> «Die Analyse ist schon gemacht. Ich will KEINE weitere Analyse und KEINEN langen Bericht. Ich will einen umgebauten Vault, den ich ab morgen täglich öffne.»
> *The analysis is done. I want NO more analysis and NO long report. I want a rebuilt vault that I'll open every day starting tomorrow.*

When I gave Claude a fresh repo next to an old template, I added: «dort nichts anfassen, einfach nur lesen» (*don't touch anything there, just read*).

**Ask for proof in the brief, not afterwards.** For a client's list of change requests, I wrote into the brief that I needed «Screenshots, die zeigen, dass ich fertig bin und seine Wünsche umgesetzt habe» (*screenshots that show I'm done and that his requests are in*). That works better than asking afterwards, which I've done more than once: «hast du es auch hochgeladen und kompiliert?» (*did you actually upload and compile it?*).

The template is a checklist, not a form. A two-line fix doesn't need six sections.

## Options to tap, not open questions

When Claude stops to ask an open question, I have to stop and write too. So I tell it how to ask:

> «Wenn du eine Frage hast, unterbrichst du nicht, sondern gibst mir eine 3er-Auswahl, wo ich nur antippen muss.»
> *If you have a question, don't interrupt, give me three options I only have to tap.*

Then I answer with numbers. One of my replies to a feature list was almost 100 numbers long.

Claude Code can already ask multiple-choice questions on its own. You pick an option, or type your own answer under "Other". Asking for options in the brief keeps each decision small.

## Correcting while Claude works

I interrupt Claude often, and I write to it while it's still working. Correcting early is cheaper than throwing everything away at the end.

- **In the CLI**, a message you send while Claude is working gets queued. Claude gets it as soon as the current tool calls finish. `Esc` stops Claude mid-action and keeps the work done so far.
- **In the desktop app**, type a correction and press Enter to send it without stopping the running action, or click the stop button to interrupt right away.

The official best practices add a rule worth keeping: after two failed corrections, don't write a third. Run `/clear` and write one better prompt that includes what you learned. Otherwise Claude keeps re-reading the two failed attempts.

## Read-only, roles and time budgets

Each one has a catch.

**READ ONLY.** When I only want analysis, I start the prompt with «READ ONLY:». For a school Python project I asked:

> «READ ONLY: Lies dir die Bot-Logik durch und nenne mir einen 2h-Implementations-Plan.»
> *READ ONLY: Read the bot logic and give me a 2-hour implementation plan.*

Later that day, in the same project, I wrote:

> «Wieso sehe ich im Diff +98 und -134? Ich hab doch gesagt, nichts ändern.»
> *Why do I see +98 and -134 in the diff? I said don't change anything.*

A word in a prompt is a request, not a lock. If you really need Claude to stay read-only, use plan mode: Claude explores and proposes a plan without editing your source code. In the CLI, `Shift+Tab` cycles through the permission modes to it, and the desktop app has a Plan mode too. And check the diff before you accept anything.

**Roles.** A role sets the bar Claude holds itself to. I've written «Du bist ein Senior Dev mit langjähriger Erfahrung in …» (*you're a senior dev with years of experience in …*) for a niche tool, and «merke dir: du bist ein Apple-Design-Team» (*remember: you're an Apple design team*) for a Windows widget. The second one ended up as a saved memory ([module 03](03-context.md)). A role doesn't give Claude knowledge it doesn't have. It changes what it treats as good enough.

**Time budgets.** I write «du hast 30 Minuten Zeit» (*you have 30 minutes*) or ask for a «2h-Implementations-Plan». A budget is a scope signal: it tells Claude how big the answer should be. The catch is in my own messages. Once I wrote «mach schneller» (*go faster*) and right after it «aber gründlicher» (*but more thorough*). That means I hadn't said what mattered. If you set a budget, also say what can be skipped and what can't.

## A brief you write three times becomes a skill

This is a rule for this course: if you've written the same brief three times, stop pasting it. Turn it into a skill, so Claude loads it when the task comes up and you only write the part that changes. [Module 04](04-skills.md) shows how.

For a brief you only need in one project, a file in the repo is enough. What matters is that it stops living in your clipboard.

---

## Exercise

1. Pick a real task you'd normally describe in one line.
2. Write a brief with the six parts from the template. Keep it under a page.
3. Add one line telling Claude how to ask questions: three options you can tap.
4. Start a fresh session, paste the brief, then only steer with short messages. Count how many you need.
5. Before you accept "done", look at the diff and at the proof you asked for.
6. Write down which part of the brief you'd change next time, then save the brief as a file in the repo.

## Mistakes I made so you don't have to

- **"Don't touch" without checking.** «ich sagte doch nichts anfassen» (*I told you not to touch anything*) is a correction I've had to make more than once. The fix: name the off-limits folders in the brief, and check the diff before you accept "done". [Module 03](03-context.md) shows how this became a rule.
- **Asking for "perfect".** I've written «mach's einfach perfekt, make no mistakes». It sounds like a brief and isn't one. Claude can't check "perfect". It can check "every number has a before and an after".
- **"Continue" on a plan I couldn't see.** In long runs I ended up asking «wie weit bist du und wie lange brauchst du cirka noch?» (*how far are you and roughly how long do you still need?*). Ask for the plan or a to-do list up front. Then «fahre fort» means something.
- **Losing my best briefs.** My strongest briefs were written beforehand in a separate chat, pasted once, and almost never became a file or a skill. I teach the three-times rule because I needed it.

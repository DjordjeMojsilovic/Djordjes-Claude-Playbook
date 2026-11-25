# 09 · Engineering

**What you'll learn**

- How I split the work: I set the limits, Claude designs the system
- Why a spec and a spike come before the real code
- Where to test when your own machine is where the product runs
- The ship loop, and why "done" only counts with proof
- How I handle secrets and bug reports

---

## Design is mine, architecture isn't

In [module 08](08-design.md) I pick every design myself. In architecture I do the opposite. I write down what has to be true, and then I say:

> «Entscheide dich selbst.»
> *Decide for yourself.*

Technical trade-offs can be argued and checked, and Claude knows more patterns than I do. Taste is judgment, and I want that judgment to be mine.

## 1. Write the non-negotiables first

The limits are the part you can't hand off. For the networking in my Windows app, I opened like this:

> «Hier die Voraussetzungen: Es muss komplett gratis sein, serverlos, also wir wollen keinen Server, keine Netzwerkeinschränkungen.»
> *Here are the requirements: it has to be completely free and serverless, so no server, and no network restrictions.*

The full list became a saved memory, so every new session starts with it ([module 03](03-context.md)):

- completely free
- no server of our own
- works on company networks
- only normal HTTPS on port 443
- end-to-end encrypted
- messages arrive even when the friend is offline
- works with older versions of the app

Inside those limits, Claude chooses. Cover cost, infrastructure, data, security and compatibility. Whatever you leave out, Claude decides alone.

So ask for a short decision note. The brief for a site Claude built on its own said:

> «Frag mich nichts. Wo etwas offen ist, wähle die einfachere Variante, notiere sie in `DECISIONS.md` und mach weiter.»
> *Don't ask me anything. Where something is open, pick the simpler option, write it down in `DECISIONS.md` and keep going.*

A good note says what Claude picked, what it rejected, and why. Five lines show you the choices you never made.

For plans that are expensive to undo, run [grill-me](https://github.com/mattpocock/skills) first. It interviews you about the plan in rounds until the holes show. I don't run it often enough yet.

## 2. A spec as the source of truth

For a USB tool I built in phases, a `spec.md` was the «Quelle der Wahrheit», the source of truth. The useful part was the guardrails, placed exactly where Claude would be tempted to help too much:

> «Schreib keine eigene Sync-, Merge- oder Konfliktlogik. Wenn du an einer Stelle denkst "das könnte ich hier schnell selbst lösen", ist das genau die Stelle, an der Notizen verloren gehen. Dann frag mich stattdessen.»
> *Don't write your own sync, merge or conflict logic. If you ever think "I could quickly solve this myself", that's exactly the spot where notes get lost. Ask me instead.*

Two more: no invented download URLs (every URL is opened and checked, or marked unverified), and no wiping a drive without a backup. The partition script makes me type the disk number myself.

Put guardrails where an error can't be undone.

## 3. Spike first

On one project I wasn't sure the data I needed even existed. So phase 0 was a spike:

> «Dies ist ein Spike. Schreibe in dieser Phase keinen Produktionscode. Ziel ist ausschliesslich, die Datenversorgung zu validieren. Wenn sie nicht trägt, ist das Projekt tot und wir haben vier Stunden statt vier Wochen verloren.»
> *This is a spike. Don't write any production code in this phase. The only goal is to check the data supply. If it doesn't hold up, the project is dead and we've lost four hours instead of four weeks.*

The same prompt demanded real calls, not answers from prior knowledge. Claude will happily describe an API it has never called.

## 4. Test where the product actually runs

For web projects, Claude tests its own work:

> «Starte einen Dev-Server und teste es selber mit Screenshots.»
> *Start a dev server and test it yourself with screenshots.*

My Windows app is different, because my laptop is where it runs:

> «Nichts bei mir auf dem Laptop lokal testen.»
> *Don't test anything locally on my laptop.*

That became a saved memory: tests and builds run in GitHub Actions, and releases come out of CI.

## 5. The ship loop

My most common closing line is «PR und merge». The whole loop:

1. Commit.
2. Open a pull request.
3. Merge.
4. Check that the deploy is actually live.
5. Take screenshots of the live version.

Screenshots from before the deploy prove nothing about the deploy. And I want my name on the work: «Mach ein Update mit mir als Contributor», *ship an update with me as a contributor*.

## 6. "Done" needs proof

I trust what Claude does. I don't trust what it reports. Two lines from my sessions, the second one more than once:

> «Ich sehe keine Änderungen.»
> *I don't see any changes.*
>
> «Hast du es auch hochgeladen und kompiliert?»
> *Did you actually upload and compile it?*

One of my projects now has a memory that says "done" means a fresh timestamp on the built file, not a window with the right title.

Proof is test output, a compiled build, a live URL, a screenshot or a log. The skill [verification-before-completion](https://github.com/obra/superpowers) from obra/superpowers makes Claude run the check and read the output before it claims anything. I install only this skill, not the superpowers plugin. Most of the time Claude loads it on its own.

## 7. Security as a reflex

For backend work I use `security-discipline` from the [backend-design](https://github.com/sheitabrk/backend-design) plugin. It checks every change for everyday holes like missing auth, injection or leaked secrets. Before a merge, the built-in `/security-review` runs a security pass over the changes on your branch.

## 8. Secrets: public in the chat, secret in the store

- **Public values**, like an OAuth client ID or a publishable key, I paste into the chat. Claude needs them, and they end up in the frontend anyway.
- **Real secrets** I put into the platform's secret store myself. Claude never sees them.

I don't use `.env` files at all, only the environment variables of the platform I deploy to. Before going live I ask Claude for two lists: every environment variable I have to set, and every SQL script I have to run. Then I do those steps myself. [Module 11](11-safety.md) has the settings that back this up.

## 9. Debugging: symptoms plus raw material

I send symptoms, not theories, plus the raw output: build logs, PowerShell errors, compiler warnings. Then I ask for the cause:

> «Es kommt ein Fehler beim Start. Fixe das, teste danach ausgiebig und fixe alle möglichen Fehler.»
> *There's an error on startup. Fix it, then test thoroughly and fix every other error you find.*

Raw logs beat my summary, because my summary already contains my guess.

## 10. Keep the code small

[ponytail](https://github.com/DietrichGebert/ponytail) makes Claude work like a lazy senior developer: the smallest change that fully solves the task. It runs in almost all of my sessions. For design I turn it off, because minimal code and a strong visual idea don't always fit:

> «Fahre fort ohne die Verwendung von Ponytail.»
> *Continue without using ponytail.*

More in [module 07](07-tokens.md). Where to get each skill is in [`setup/skills.md`](../setup/skills.md).

---

## Exercise

Pick a small tool you actually want.

1. Write 5 non-negotiables, one each for cost, infrastructure, data, security and compatibility.
2. Ask Claude to design the system and write a `DECISIONS.md`: what it picked, what it rejected, why.
3. Run `grill-me` on the plan and answer every round.
4. Spike the riskiest assumption. One hour, no production code, real calls only.
5. Build it on a branch and run the ship loop. Don't accept "done" without test output, a live URL or a screenshot.

If the decision note surprises you, your limits had a gap.

## Mistakes I made so you don't have to

- **Believing "fixed".** A start bug survived three versions of one of my apps. Ask for the proof in the same prompt as the fix.
- **Limits with gaps.** Outside my list, Claude chose alone, and nothing made me look at those choices. That's what the decision note is for.
- **Cutting checks when I was in a hurry.** I once wrote «Bitte weniger testen und mehr arbeiten», *please test less and work more*. That saves minutes and costs you the proof. When time is short, cut scope, not checks.
- **One testing rule for every project.** On a desktop pet I first said "don't test it on my desktop", then, after the same bug kept coming back, "launch it and test it live". Both were right at the time. Save the rule as a memory per project.

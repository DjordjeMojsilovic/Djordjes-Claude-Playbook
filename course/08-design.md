# 08 · Design

**What you'll learn**

- Why design made by AI looks like design made by AI, and how to stop it
- How I work: references first, then prototypes that really differ, then I pick
- Which design skills I use, which ones I never touch, and why
- How to check a design after it's built

---

## The problem

Ask Claude for "a modern, premium landing page" and you get the same page everyone else gets: gradient hero, three feature cards, rounded everything. Claude can't read "modern" or "premium". It guesses, and the guess is the average of everything it has seen.

What fixes this is direction, not a better adjective. Claude needs to see what you mean, and you need to see options before you can judge. So I don't describe taste, I pick it.

## My process

### 1. References before anything else

Before a single line of code, Claude collects references. I tell it where to look:

> «Hole dir Inspiration auf Mobbin, Land-book, Siteinspire und Awwwards, hauptsächlich von Immobilienfirmen. Du hast Zugriff darauf.»
> *Get inspiration from Mobbin, Land-book, Siteinspire and Awwwards, mostly from real estate companies. You have access.*

Things that help:

- **Give Claude your browser.** With Claude in Chrome it can use sites you're logged into. Logins and captchas are your job, not Claude's. Once Mobbin failed because I wasn't logged in, and that's fine. Claude should say so, not work around it.
- **Name real sites as the bar.** Apple and Tesla for presence, Linear and Vercel for product UI, Duolingo and Brilliant for onboarding. "Make it like X, crossed with our old design" works better than any adjective.
- **Keep screenshots in the repo.** A `references/` folder with `ref-*.png` files means every agent sees the same thing, in every session.
- **Use real images.** Unsplash for real photos (it's a connector in the desktop app, under Customize › Connectors). When generated images looked like AI slop on our company site, we stopped generating and switched to one calm painted image world, one object per picture.

### 2. Concepts that are actually different

Next: 3 to 5 concepts before anything gets built. A concept is a visual idea, a motion idea and one hero moment. It's not a colour scheme.

In my agency pipeline this is its own step (`concept`): "3–5 bold visual concepts, the human picks one." See [`templates/agency-pipeline`](../templates/agency-pipeline/).

### 3. Clickable prototypes, each one different

This is where most people go wrong, so here's my rule as the person teaching this:

> **Every prototype has to be clearly different from the others. Expect only one or two of them to be good.**

Five prototypes that only differ in colour and spacing are really one prototype. You can't choose between them, because there's nothing to choose.

How I get real variety: **one style skill per prototype.** One with [hallmark](https://github.com/Nutlope/hallmark), one with [taste](https://github.com/Leonxlnx/taste-skill), one minimalist, one brutalist ([taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics)). Each skill pulls in its own direction, so you get real alternatives.

What I typed (spelling fixed):

> «Mache 7 Prototypes, nutze dazu 7 Skills plus den Prototype-Skill.»
> *Make 7 prototypes, use 7 skills plus the prototype skill.*

Then make them easy to compare. I have Claude build one page that shows every variant side by side, like a pitch deck (`pitch.html`), or put each one behind its own link (`?v=1`, `?v=2` …). One redesign round ended with about 40 page prototypes on a board.

### 4. Pick, and say why

I pick by number or link and say what I like about it. The reason matters more than the choice, because Claude carries it into the next round:

> «Baue Vorschlag 5, aber alles auf einem Viewport.»
> *Build proposal 5, but everything on one viewport.*
>
> «B in Kombination mit Variante A.»
> *B combined with variant A.*

If nothing works, say that too. Once I told Claude three prototypes weren't enough and I didn't like what it made. That's a normal round, not a failure.

### 5. Lock the decisions

Once a direction wins, write it down before building, so it doesn't drift:

- **Tokens:** 4 to 6 named colours, three type roles, a spacing scale and one signature element. Then a critique pass against generic defaults.
- **Motion level:** a "wow level" from 1 to 10 per page, with a reason. A calm legal page and a hero page don't get the same animation budget.
- **Components:** the motion level decides which component registry is allowed. A calm page doesn't get flashy effects.

All three are steps in the [pipeline](../templates/agency-pipeline/) (`design-tokens`, `motion-scale`, `komponenten`).

### 6. Build, then judge

After building, a separate step judges the result from screenshots, against the tokens and the motion level: approved, or a concrete list of fixes. In my pipeline that's "gate 2" (`aesthetic-judgment`), and it runs as its own agent that isn't allowed to edit files.

Then the detail pass. I hold this to a high bar. On a Windows widget I once told Claude: *"Remember: you're an Apple design team that looks at every smallest detail."* That ended up as a saved memory. A number that's styled differently from the others, a banner that flashes white for 0.2 seconds while loading, a slider that jumps instead of following the cursor: that's the level.

---

## The skills I use for design

| What for | Skill | Source |
|---|---|---|
| Building UI with care | frontend-design | [anthropics/skills](https://github.com/anthropics/skills) |
| Motion, polish, prototypes | emil-design-eng, animate, apple-design, mobile-native, review-animations, prototype | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| Prototype variants (one per prototype) | hallmark, design-taste-frontend, taste-skill-classics | [Nutlope/hallmark](https://github.com/Nutlope/hallmark), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), [Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics) |
| Checking after the build | better-layout, better-colors, better-typography, interface-review | [jakubkrehel/skills](https://github.com/jakubkrehel/skills) |
| Breaking it on purpose | break-ui, animation-performance | [emilkowalski/skills](https://github.com/emilkowalski/skills) |
| Accessibility, copy, critique | design plugin (accessibility-review, ux-copy, design-critique) | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) |
| Slop check | audit-ai-design-slop | [MengTo/Skills](https://github.com/MengTo/Skills) |

Install commands for all of them are in [`setup/skills.md`](../setup/skills.md).

> ### Never: impeccable and ui-ux-pro-max
>
> I don't use **impeccable** or **ui-ux-pro-max** under any circumstances. Without direction, both lead straight to AI slop. They come with so much built-in taste (ui-ux-pro-max ships 161 palettes and 57 font pairs) that their taste replaces yours. Work with references and moodboards instead.
>
> That's why neither one is in my setup or my install script.

### How I pick skills

Most of the time I tell Claude to pick the best skills for the job, and how many to use. For prototypes there's one extra rule: one style skill per prototype, so the prototypes really differ.

Skills help, but they don't replace direction. The prototypes I ended up liking were built with skills too. What made them work was direction: references and a clear image world.

---

## Exercise

Pick a page you need anyway (a portfolio, a landing page for a side project, a school project page).

1. Find 5 references: two on Awwwards or Land-book, two real products you like, one from Mobbin if you have access. Screenshot them into `references/`.
2. Ask Claude for 4 concepts and tell it they have to be clearly different from each other.
3. Have it build 4 clickable prototypes, each with a **different** style skill, plus one page that shows all four side by side.
4. Pick one. Write two sentences about why, and one about what you'd steal from a second one.
5. Have Claude write the tokens and motion level for the winner, then build it.
6. Run `better-layout` and `break-ui` on the result and fix what they find.

If all four prototypes look alike, the concepts weren't different enough. Go back to step 2.

## Mistakes I made so you don't have to

- **Letting Claude tear down what already works.** Once it "improved" a page and replaced the typography and broke the animations. Now existing typography, navigation and animations count as fixed unless I say otherwise, and after every PR I check for regressions.
- **Words Claude takes too literally, or not literally enough.** I said "viewport" and Claude squeezed everything onto one screen. I meant a flower that was cut off in the hero. Point at the exact thing, with a screenshot if you can.
- **Text that sounds like AI.** Slop isn't only visual. I've had Claude rewrite a slogan because it sounded generated, and I had to say "I mean the text, not the font or the layout".
- **Generating images to fix a design problem.** If the images look like AI, more prompts won't fix it. Change the approach: real photos, or a clear style that doesn't pretend to be a photo.

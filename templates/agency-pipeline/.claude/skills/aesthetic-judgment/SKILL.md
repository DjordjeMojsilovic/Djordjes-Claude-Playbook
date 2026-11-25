---
name: aesthetic-judgment
description: Checks a finished page for aesthetic quality (Gate 2 of the Definition of Done). Takes screenshots, judges against a high premium standard, against the design tokens and against the planned motion level, and returns either approval or concrete revisions. Use as soon as a page is technically done, before it is shown to the human.
argument-hint: "[route, e.g. / or /services]"
disallowed-tools: Write, Edit, NotebookEdit
allowed-tools: Read, Glob, Grep, Bash(npm run dev)
model: opus
effort: high
---

# Aesthetic-Judgment

Gate 2 of the Definition of Done (CLAUDE.md §6). Gate 1 checks whether it *compiles*.
This skill checks whether it *looks strong*. A wireframe passes Gate 1; here it fails.

Be strict. A benevolent "looks OK" is worthless. The standard: **Would this hold its own
on the homepage of Linear, Vercel or Resend, in the good sense?**

## Procedure
1. Use or start the dev server. Render the page with Playwright and take
   **screenshots**: desktop width **and** 375px. Judge on both.
2. Read: `spec.md §0` (track) · `design/motion-plan.md` (level of this page) ·
   `design/tokens.json` (target values) · `design/design.md` (brand) ·
   `design/design.md §10` (chosen concept, if any).
3. Check the screenshots against the checklist.
4. Give the verdict: **BESTANDEN** (passed) or **NACHBESSERN** (revise) with a
   concrete list.

## Checklist

### Failure A: too bare (wireframe danger)
- Hero without a visual element? Only text on an empty surface? → fails on Track B.
- No depth: no gradient, no glow, no texture, everything flat? → weak.
- Typography without hierarchy or character? **Default spacing** (the same `1rem`
  everywhere)? → the clearest wireframe tell there is.
- Does it look like a 2019 Bootstrap starter?

### Failure B: too loaded (premium killer)
- More motion than the motion level allows? Motion that distracts instead of guides?
- Effects without purpose, just because they're possible? Everything moving at once?
- **Scattered** instead of orchestrated animation? That is the clearest sign of
  AI-generated design.
- Too many accent-colour surfaces? Colour over large areas instead of sparingly?
- A component from a registry that is locked for this level (`komponenten`)?
- Does it feel hectic, "startup that has to prove itself", instead of confident?

### Token fidelity
- Do the rendered colours match `tokens.json`, or are there invented in-between values?
- Does all spacing come from the space scale?
- Is the accent used sparingly: buttons, links, focus, nothing else?

### The three forbidden default clusters (CLAUDE.md §5)
If one applies, that **alone** is a NACHBESSERN:
1. Cream + serif + terracotta
2. Near-black + acid green / vermilion
3. Newspaper layout with hairlines

### Structure and language
- Numbering/dividers only where the order really matters (`design.md §7`)?
- Buttons labelled actively ("Save changes", not "Submit")?
- No lorem ipsum, no `[ANGABE FEHLT]` in the visible state?

### Premium features: should be there
- A clear hero moment that works in the first second.
- Generous space, a calm rhythm between sections.
- Motion guides the eye, is dosed, respects `prefers-reduced-motion`.
- Visible focus rings, alt texts, contrast OK.
- Details are right: alignment, consistent spacing, no cut-off text.
- On Track B: the signature element from `tokens.json` is actually visible.

## Verdict format
```
Page: [route] · Track: [A/B] · Motion target: [N]/10 · Round: [1|2]
Level hit? [yes / too much / too little]
Tokens respected? [yes / deviations: …]
Default cluster hit? [no / yes: which]
Signature element visible? [yes / no / n/a on Track A]
Premium impression (1–5, 5 = would hold its own at Linear): [N]

BESTANDEN
— or —
NACHBESSERN:
1. [concrete: what, where, how. Not "make it nicer", but "hero needs a visual
   element, e.g. a generative gradient behind the headline"]
2. …
```

## Limits
- No suggestion without concrete feasibility. "Looks cheap" alone helps nobody; say
  *why* and *what* to do.
- The motion level is binding: a page that is nicer *but* above its level fails
  (failure B). Don't put your own preference above the plan.
- **After two rounds it stops** (CLAUDE.md §6). In round 2 you note at the end
  "limit reached, decision is with the human" and list what stays open.
  There is no third round.
- This skill does **not** give the final verdict alone. After BESTANDEN the lead shows
  the page to the **human**. The final touch of taste stays with the human.
- Honesty over politeness. A verdict that is too mild lets mediocrity through, exactly
  what this skill is meant to prevent.

---
name: concept
description: BEFORE building, proposes 3-5 bold visual concepts for a page (visual metaphor, motion idea, hero moment), from which the human picks one. Use on Track B and for every page with motion level 5 or lower, before code exists. This is the step that turns "text on a background" into an experience.
argument-hint: "[page, e.g. / or /services]"
allowed-tools: Read, Write, Edit, WebSearch, WebFetch, Bash(21st search *)
model: opus
effort: high
---

# Concept

The creative leap that happens *before* the code. Without this step an agent builds the
statistical average: clean, but faceless. This is where the idea comes from that makes a
page memorable.

## When
- Always on **Track B** before the homepage.
- For every page with motion level **≤ 5** in `design/motion-plan.md`.
- **Not** at level ≥ 7 (calm brochure) and not for pure text pages.

## Input
`spec.md` (core goal, track) · `design/design.md` (brand, colour, mode) ·
`design/tokens.json` (the concrete values) · `design/references.md` (reference sites) ·
`design/motion-plan.md` (level of the page). For existing sites: `design/recon/<domain>.md`.

## What a concept is
Not a layout, not a component: a **visual idea** with three parts:

1. **Metaphor / guiding image:** what does the page remind you of visually? What is the
   one image? The metaphor comes from the client's *business*, not from the effects
   catalogue. (Real example: an electrician → hero like a cone of light shining into an
   electronics kit.)
2. **Motion idea:** how does the page live? What happens on load, on scroll?
   Matching the motion level, no more.
3. **Hero moment:** the one impression in the first second. What does the visitor see
   before reading anything?

## Procedure
1. Read the input. Understand what the client *does*; the best metaphor is there.
2. Research: WebSearch for current references and motion patterns. Optionally
   `21st search "…"` for concrete component directions (only the free part).
3. Produce **3–5 clearly different** concepts. Not three variants of the same thing:
   three *different* ideas. One may be bold to risky.
4. Each concept: metaphor + motion + hero moment, 1–2 sentences each. Plus roughly which
   library carries it, and **one honest line on risk/effort**.
5. **The human chooses.** Don't decide and build yourself.
6. After the choice: record the chosen concept in `design/design.md §10`, so the builder
   implements it and a later session doesn't forget it.

## The touchstone before hand-off
For every concept: **Could this just as well be on the site of a client in another
industry?** If yes, it is not a concept but an effect. Back to step 1.

## Output format
```
## Concept [N]: [name]
Metaphor:     […]
Motion idea:  […]
Hero moment:  […]
Carried by:   [motion / Aceternity / shadcn + custom]
Risk:         [honest: effort, technical uncertainty, taste risk]
```

## Limits
- References are a springboard, not a template. "Like Linear, but …" yes; a copy, no.
- The metaphor has to fit the business. Arbitrary effects without a connection are not
  a concept.
- Bound to the motion level: a strong concept at level 8 means **elegantly restrained**,
  not animation-heavy.
- The three forbidden default clusters (CLAUDE.md §5) apply here too.
- Invent nothing about the client (numbers, claims). The concept is visual, not about
  content; the words belong to `copy`.

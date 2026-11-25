---
name: motion-scale
description: Assigns each page a wow/animation level from 1 to 10 with a written reason and writes it to design/motion-plan.md. Use BEFORE building any page. This also decides which component registry is open at all. Prevents both bare wireframes and overloaded pages.
argument-hint: "[page or 'all']"
disallowed-tools: Bash
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Motion-Scale

Sets per page **how much** visual effort and motion is needed. The result is in
`design/motion-plan.md` and is binding for the builder.

## The scale is INVERTED: remember this
Counter-intuitive, but applied the same everywhere:

**1 = maximally loaded. 10 = completely discreet, zero animation.**
Low number = MORE wow. High number = LESS. Don't mix them up.

| Level | Meaning | typical for |
|---|---|---|
| 1–2 | Maximum wow. Moving/generative hero, many scroll reveals, strong hover choreography, a moment of surprise. | Creative studio landing, product launch, portfolio that *has* to impress |
| 3–4 | Strong but curated. **One** clear hero moment + targeted reveals. Depth through gradient/glow. | Agency landing (Track B), SaaS homepage |
| 5–6 | Balanced. Subtle reveals, a single accent moment, clean transitions. | Sub-pages of a Track B site, modern small-business site |
| 7–8 | Calm. Only fade-in / slight slide-up on scroll-in. Otherwise static. | Brochure (Track A), real estate, trades |
| 9–10 | Discreet to static. Little to no motion. | Imprint, privacy policy, pure text pages, sober legal pages |

## The level opens the registry
Not only *how much* gets animated, but also *where* components may come from:

| Level | Open sources |
|---|---|
| 8–10 | shadcn/ui |
| 5–7 | + Motion Primitives, Cult UI |
| 1–4 | + Aceternity, Magic UI |

Details in the `komponenten` skill. This turns the number into an enforceable rule
instead of a statement of intent.

## The most important principle: the right number is NOT the lowest
A page above its necessary wow level looks **cheap and overloaded, not premium**.
Too much animation is as much a mistake as a bare wireframe, just the other one.

Premium = the *right* dose, cleanly executed. An imprint with a generative hero is not
wow but an annoyance. Choose the number by the purpose of the page, not by appetite.

## Calibration to the track (from `spec.md §0`)
The track sets the **band**, the page gets the exact value inside it:
- **Track A (brochure):** mostly 7–9. Hero maybe 6. Never below 5.
- **Track B (experience):** landing 2–4, important sections 3–5, sub-pages 5–7,
  legal texts 9–10.

The *homepage* of a Track B agency that has to impress is typically **3**: not 1
(overstimulation), not 6 (boring).

## Decide per page
1. Purpose of the page in one sentence.
2. Look up the track (`spec.md §0`) → band.
3. Choose the level within the band, by purpose.
4. **Write the reason**: why this number, what it means concretely.
5. Name the concrete motion elements that are allowed (e.g. "hero: one-off text reveal
   + generative gradient; cards: fade-in on scroll; no parallax").
6. Name what is off limits: what is explicitly **not** allowed.
7. Note the open registries.

## On existing sites (M2)
Check in `design/recon/<domain>.md` how much motion the site has **today**. A jump from
static to level 2 is rarely right: it overwhelms the existing audience and often doesn't
fit the brand. One step, not three.

## Output → `design/motion-plan.md`
```markdown
## / (homepage)
- Level: [N]/10 — [short label]
- Purpose: […]
- Why this number: […]
- Allowed motion: […]
- Off limits: […]
- Open registries: […]
```

## Limits
- Every page gets a number **and** a reason. No number without text.
- `prefers-reduced-motion` always applies, regardless of level.
- If the track changes, the whole plan has to be recalibrated.
- `aesthetic` checks whether the page **hit** its level. Too much *or* too little is a
  reason to fail; both count the same.

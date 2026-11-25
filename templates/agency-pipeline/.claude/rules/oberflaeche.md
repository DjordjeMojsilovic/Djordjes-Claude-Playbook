---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.css"
  - "**/*.scss"
  - "src/components/**"
  - "src/app/**"
---

# Surface: tokens, motion, language

<!-- Loads ONLY for work on UI files. For a migration or a hook fix it would be
     wasted context. -->

## The tokens are binding
Colours, typefaces, spacing and radii come from `design/tokens.json`. No invented
in-between values, no "fits better" deviation. If a value is missing, **it is
missing**: report it instead of inventing it.

All spacing from the space scale. The same `1rem` everywhere is the clearest wireframe
tell there is.

Exactly **one** accent: buttons, links, focus rings. Colour used over large areas looks
cheap.

## The motion level is binding, and inverted
The number from `design/motion-plan.md` for **this** page.
**1 = maximally loaded, 10 = discreet.** Low means more wow.

It also decides which component registry is open:

| Level | Open |
|---|---|
| 8–10 | shadcn/ui |
| 5–7 | + Motion Primitives, Cult UI |
| 1–4 | + Aceternity, Magic UI |

At most **one** wow element per page. A component above the allowed level is a reason
to fail Gate 2, even if it looks nicer.

## Motion is orchestrated, not scattered
A few connected moments (page load, scroll reveal, hover) beat many scattered effects.
**Scattered effects are the clearest sign of AI-generated design.**

`prefers-reduced-motion` always. No exceptions.

## Minimal does not mean empty
Depth comes from subtle gradients, fine grain texture, soft glows, micro-animation,
not from more elements. Bare is a mistake, not a style.

A hero without a visual element is unfinished on Track B.

## Structure has to encode information
Numbering (01/02/03), dividers and frames only where they express a real relationship.
A numbered list whose order doesn't matter is decoration dressed up as structure.

## Language belongs to `copy`
Active, not passive ("Save changes", not "Submit"). The same things have the same name
everywhere. Error messages say **what** happened and **what to do now**.

No lorem ipsum, no self-invented marketing copy. If text is missing, report it; don't
write it on the side. Invented numbers about the client are a liability risk.

## Accessibility is part of "looking good"
Visible focus ring on every interactive element. Contrast ≥ 4.5:1 for text.
Alt texts describe what is shown, not "image". Exactly one `<h1>` per page.

## Limit
No file over 300 lines. If it grows beyond that → ask first.

# design.md — [project]

<!-- WHY THIS FILE: the binding design truth. The house language (§1–§9) applies to all
     projects; the brand section (§0) is filled PER PROJECT, and §10 collects the chosen
     concepts. Agents and skills cite these section numbers (§0, §2, §7, §8, §10), so
     keep them. -->

## §0 Brand: FILL PER PROJECT
Empty = UI work is locked (CLAUDE.md §5). If something is missing, ask.
- Accent colour (hex): [__] · text on filled surface (hex): [__]
- Mode: [light / dark]
- Typefaces (display / body / utility): [__]
- Logo: [file / wordmark]
- Contrast checked (accent on background, text on accent): [ratios, target ≥ 4.5:1]
- Signature element: [one sentence, where it sits]

## §1 Track: sets the treatment level
The project runs on Track A (brochure) or B (experience); it is in `spec.md §0`.
This choice steers how much motion and visual concept a page gets.
Calibration: skill `motion-scale`; judgment: skill `aesthetic-judgment`.

## §2 Basic stance
Clean, calm, content before decoration. Plenty of white space (or dark space in dark
mode). Sparing accent colour: only buttons, links, focus rings, one accent. Colour used
over large areas looks cheap.

**Minimal does not mean empty.** Bare is a mistake, not a style. Depth comes from subtle
gradients, fine grain texture, soft glows, micro-animation, not from more elements.

## §3 Typography
Clear hierarchy: one dominant headline per section. Calm, readable body text.
Exactly one `<h1>` per page.

## §4 Motion
- **Track A:** subtle. Fade-in / slight slide-up on scroll-in. Nothing else.
- **Track B:** expected. Scroll reveals, hero animation, hover states with character,
  possibly a moving/generative background element. Never motion for its own sake.
- Always respect `prefers-reduced-motion`.
- The level per page is in `design/motion-plan.md`.

## §5 Asset strategy
- **No** generic stock photos of people.
- **Allowed** on Track B: abstract hero visuals, generative gradients/mesh, 3D elements,
  fine grain/noise textures, real product/project screenshots. Photos via the Unsplash
  API (see `LIBRARIES.md`) only when they really fit the content.
- A hero without a visual element is unfinished on Track B.

## §6 Accessibility
Visible focus ring on all interactive elements. Contrast ≥ 4.5:1 (text). Images with
alt text. Keyboard navigation works. This is part of "looking good".

## §7 Structure has to encode information
Numbering (01/02/03), dividers and frames only where they express a real relationship.
A numbered list whose order doesn't matter is decoration dressed up as structure.

## §8 Language
- Language and locale of the site: [__]
- Form of address: [formal / informal]
- Tone: [__]
<!-- Example locale from the original template: Swiss Standard German, "ss" instead of
     "ß", formal address by default. Replace with yours. -->

## §9 Building blocks: deliberate exceptions
shadcn/ui as the component base, Lucide as the icon set (ISC licence).
Motion/wow components from `LIBRARIES.md`, every licence checked before use.

## §10 Concepts: per page, after the human's choice
<!-- Filled by `concept` after the human picks one. One block per route. -->
### Concept [route]
- Chosen: [name] · date: [__]
- Metaphor / motion idea / hero moment: […]

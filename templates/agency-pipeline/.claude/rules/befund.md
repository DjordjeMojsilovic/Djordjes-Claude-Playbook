---
paths:
  - "befund/**"
---

# Findings patches (befund): third-party live sites

<!-- Loads ONLY when someone touches files under befund/. In a normal new build these
     rules would only cost context and cause confusion: there is no "third-party live
     site" there. -->

You are working on code that gets **pasted into someone else's live site**, a site that
earns money. A mistake here is not ugly, it is expensive.

## The seven hard rules
1. **Everything scoped.** Every selector sits under its own root class
   (`.studio-cb .title`; pick your own prefix). Never bare element selectors (`button`,
   `div`, `h2`), never global resets, never `*`.
2. **Vanilla only.** No React, no Tailwind, no SCSS, no build, no imports.
   The client pastes in one file; that is all they can do.
3. **No external request.** No Google Fonts, no CDN scripts, no `fetch`, no tracking.
   Privacy, load time, and the client hasn't agreed to it.
4. **Progressive enhancement.** JS off → the page keeps working as before.
   A cookie banner that can't be dismissed without JS is a legal risk.
5. **`!important` only with a reason** on the same line.
6. **Install one at a time, revert one at a time.** `01` must work without `02`.
7. **`prefers-reduced-motion`** here too.

## What does NOT apply here
- **Gate 1 does not apply.** There is no build, no `tsc`, no `eslint`.
  `mark-dirty.mjs` deliberately excludes `befund/**`.
- **Our house style does not apply.** You improve the *client's* style, you don't
  replace it. Tokens come from `design/recon/<domain>.md`.
- **The 300-line rule does not apply** to patch files, but if a patch gets that long,
  it is probably the wrong approach.

## The report is for the client
`report.md` is read by a layperson, not a developer. No framework names, no jargon
without explanation. "The text is too light for the background" instead of "contrast
ratio falls below WCAG AA".

## Never
- Try things out on the production site. Inject styles locally to test.
- Submit forms, fill in logins, click cookie consent.
- Invent numbers (reach, conversion, load time) without your own measurement.

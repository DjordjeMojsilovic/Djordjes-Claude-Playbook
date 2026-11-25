---
name: befund
description: "Produces the deliverable for clients without code access (mode M1-B): a findings report plus vanilla CSS/JS patches that can be installed one by one, with instructions. Use when stack.md says 'zugriff: nur-url'. Contains the safety rules that stop a patch from damaging a third-party live site."
argument-hint: "[domain]"
paths:
  - "befund/**"
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Befund (findings)

For the most common client case of all: **"Here is our site, can you make X nicer?"**,
and we never get repo access, because the site sits with another agency, in Webflow, or
in a WordPress nobody has touched in years.

The deliverable is not a commit but a **package the client installs.**

## The iron rule
You are working on a **third-party live site** that earns money. A global reset, an
overridden selector or a JS error can disrupt the client's business.

**When in doubt, scope tighter, not wider.** Better a patch that changes too little than
one that breaks something.

## Structure of the deliverable
```
befund/<domain>/
├─ report.md              What is, what is missing, what we propose, prioritised
├─ patches/
│  ├─ 01-<topic>.css
│  ├─ 01-<topic>.js       (only if really needed)
│  └─ 02-<topic>.css
├─ EINSPIELEN.md          Install guide: where exactly, in which order, how to revert
└─ screenshots/
   ├─ before-desktop.png · before-375.png
   └─ after-desktop.png · after-375.png
```

## Hard rules for every patch

### 1. Everything scoped
Every selector hangs under its own root class. Never bare element selectors.
Pick one prefix for your studio and use it everywhere (`studio-` below).

```css
/* RIGHT */
.studio-cb { … }
.studio-cb .title { … }

/* WRONG: applies to the whole page */
button { … }
.container { … }
* { box-sizing: border-box; }
```

If an existing selector is unavoidable, write it as narrowly as possible and comment
why:
```css
/* Only the cookie dialog, the ID is unique on this site */
#cookie-notice .cn-button { … }
```

### 2. No framework, no build
Vanilla CSS and vanilla JS. No React, no Tailwind, no SCSS, no imports, no bundler.
The client pastes in one file; that is all they can do.

### 3. No external request
No Google Fonts, no CDN scripts, no `fetch`, no tracking. Reasons: privacy, load time,
and the client hasn't agreed to it. If you need a typeface, use the one already loaded
or a system stack.

### 4. Progressive enhancement
JS off → the page keeps working as before. A patch may make things nicer, but must never
be a precondition for function. A cookie banner that can't be dismissed without JS is a
legal risk for the client.

### 5. `!important` only with a reason
Sometimes unavoidable on third-party sites. Then comment why on the same line:
```css
/* Theme sets inline styles, can't be overridden otherwise */
color: #1a1a1a !important;
```

### 6. Install one at a time, revert one at a time
Every patch stands on its own. The client has to be able to install `01` without having
`02`, and remove `01` again without `02` breaking.

### 7. `prefers-reduced-motion` here too
```css
@media (prefers-reduced-motion: reduce) {
  .studio-cb * { animation: none !important; transition: none !important; }
}
```

## report.md: structure
```markdown
# Findings — [domain]
Recorded: [date] · Order: [what the client wanted]

## Summary
[3–5 sentences: what we saw, what we propose, what it brings.
 Written for the client, not for developers.]

## What we measured
| Item | Now | Target | Effect |
|---|---|---|---|
| Body text contrast | 3.1:1 | 4.5:1 | Hard to read for people with low vision |

## Proposals, sorted by impact
### 1. [title]  ·  effort: small  ·  impact: high
[What, why, how it looks. Screenshot reference.]
Patch: `patches/01-….css`

## What we did NOT touch
[And why, e.g. "The contact form runs on a plugin we can't see."]

## Open questions for the client
1. …
```

The report is for the **client**, not for us. No framework names, no jargon without
explanation. "The text is too light for the background" instead of "contrast ratio falls
below WCAG AA".

## EINSPIELEN.md: structure
```markdown
# Install — [domain]

## Order
1. `01-cookiebanner.css`
2. `02-hero.css`

## Where exactly
### WordPress
Appearance → Customize → Additional CSS → paste the contents of the .css file.
JS: via a snippet plugin or in the theme before </body>.

### Webflow
Project Settings → Custom Code → Head Code (CSS) or Footer Code (JS).

[Only describe the route that matches the detected stack, not all of them.]

## Reverting
Remove the pasted block again. The patches change nothing that exists,
they sit on top of it.

## Check after installing
- [ ] Page loads normally
- [ ] Look at it on a phone
- [ ] Cookie banner can still be closed
- [ ] No error message in the browser console
```

## Procedure
1. Read `design/recon/<domain>.md`: tokens and findings are already there.
2. Write patches that fit into the **existing** tokens. You don't bring our house style;
   you improve the client's style.
3. Check locally: test the patch against the live site by injecting the styles via the
   Chrome DevTools MCP and taking a screenshot. **Save nothing on the site.**
4. Produce after screenshots, desktop and 375px.
5. Write `report.md` and `EINSPIELEN.md`.
6. Have `aesthetic` check it; Gate 2 applies here too.

## Limits
- **Never try things out on the production site.** Inject styles locally for testing,
  submit nothing, save nothing.
- Don't submit forms, don't log in, don't click cookie consent.
- Invent nothing about the client, not in the report either. No numbers on reach,
  conversion or load time without your own measurement.
- Gate 1 doesn't apply here (no build). The patch safety above applies instead; every
  point of it is a reason to fail.
- The screenshots stay outside git (`.gitignore`), the report and patches don't.

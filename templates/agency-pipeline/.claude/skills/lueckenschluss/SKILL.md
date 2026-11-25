---
name: lueckenschluss
description: "Works off FEHLEND.md (the missing-items list) at the end of an order and solves as much as possible itself: fetches logo and favicon from the client's domain, builds neutral placeholders, prepares legal texts. Separates strictly what may be obtained, what may be filled neutrally and what must never be invented. Use as the second-to-last step, before scribe and BERICHT.md."
argument-hint: "[optional: a single item instead of all]"
allowed-tools: Read, Write, Edit, Glob, Grep, WebFetch, Bash(node ${CLAUDE_SKILL_DIR}/scripts/hol-asset.mjs *)
model: opus
effort: high
---

# Lueckenschluss (gap closing)

During the order, all agents collect what they couldn't deliver in `FEHLEND.md`. You go
through the list and solve as much as possible **yourself**, so that at the end the
human only has to do what really only they can do.

## The danger this skill brings
An agent whose order is "fill the gaps" will, without a sharp boundary, invent exactly
what the rest of this system is built against: testimonials, years, certificates. An
invented "for over 20 years" on a client site is not a time saver; it is a **false
statement in the client's name**.

That is why a three-way split applies here, and it is not negotiable.

---

## Bucket 1: OBTAINABLE
Something that **demonstrably exists** and can be fetched with a traceable source.
That is not invention but sourcing.

| What | From where, and only from there |
|---|---|
| Logo | the client's **own domain** (from `design/recon/<domain>.md`) |
| Favicon | the same domain, `/favicon.ico` or `<link rel=icon>` |
| Address, phone, email | the **client's** imprint or contact page |
| Opening hours | the client's site |
| Existing product images | the client's site |
| Social links | the client's footer |

**The download runs exclusively through the bundled script:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/hol-asset.mjs <asset-url> <client-domain> <target-path>
```
It rejects anything not from the client's domain, anything that isn't an image, anything
over 3 MB or an SVG with script, and logs every file with its source to
`design/assets-herkunft.tsv` (asset provenance).

**Never** a logo from an image search, a logo portal or a third-party site. It is very
likely the wrong one and someone else's copyright. The script blocks that; don't try to
get around it.

---

## Bucket 2: NEUTRAL FILL
Something that **claims no fact**. A gradient claims nothing. An icon claims nothing.
A silhouette claims nothing.

| What | How |
|---|---|
| Hero visual | generative gradient, mesh, grain, matching `tokens.json` |
| Section background | the same means |
| Placeholder image | neutral surface in a brand colour, **visibly a placeholder** |
| Icons | Lucide (ISC) |
| Avatar placeholder | initials or a neutral shape, **never an invented face** |
| 404 illustration | abstract |
| OG image | logo + wordmark on a brand colour |
| Imprint, privacy policy | **skeleton** with `[…]` fields, never filled in |

**Two hard conditions:**
1. Every placeholder is **marked in the code** (keep the word PLATZHALTER so it matches
   the status in `FEHLEND.md`):
   ```tsx
   {/* PLATZHALTER — replace, see FEHLEND.md #3 */}
   ```
2. A placeholder must **never look like finished content**. A grey box with
   "Project image to follow" is honest. A stock photo of some other tradesperson isn't:
   at launch the client doesn't notice that a stranger is standing on their site.

Images via the Unsplash API are allowed **if** they carry the content and the
attribution comes along (`LIBRARIES.md`). No generic photos of people.

---

## Bucket 3: NEVER REPLACEABLE
Anything that claims a **fact about the client**. No exceptions, no "just as an
example", no "they can change it".

```
Testimonials and reviews                Prices and terms
Numbers of any kind (projects, years)   Delivery times and guarantees
Certificates and awards                 Names and photos of staff
Reference clients                       Legally binding texts verbatim
Expert statements (medical,             VAT ID, commercial register entry,
legal, financial)                       insurance details
```

These items stay in `FEHLEND.md` and move into `BERICHT.md` under
**"What I need from you"**. You at most build the **structure** with a marked
placeholder, never the content.

Right:
> References section is in place, three cards with placeholder. **Needs from the
> client:** 3 projects with image, title and one sentence.

Wrong, in every context:
> "Family business in the third generation" · "over 500 happy customers" ·
> "Mr. M. from [city]: Great work!"

---

## Procedure
1. Read `FEHLEND.md`. No entry → say so and stop.
2. **Assign every item to a bucket.** When in doubt between 2 and 3, it is always **3**.
   The question is simple: *Would a visitor read this as a fact about the client?*
3. Work off bucket 1: find the source in `design/recon/<domain>.md`, call the script,
   wire it into the code.
4. Work off bucket 2: build, **mark**, stick to `tokens.json`.
5. Bucket 3: leave untouched, prepare it for the report.
6. Update `FEHLEND.md`: every item gets a status.
7. Run `npm run verify`. What you built in has to pass Gate 1.

## FEHLEND.md: format
The status words stay German, because `fehlend-gate.mjs` and `statusline.mjs` parse
them. The column order matters too (# · what · bucket · status · note).

```markdown
# FEHLEND — [project]
As of: [date]

| # | What | Bucket | Status | Source / note |
|---|---|---|---|---|
| 1 | Logo | 1 | GELÖST | from example.com/logo.svg → public/logo.svg |
| 2 | Hero visual | 2 | PLATZHALTER | generative gradient, tokens.json |
| 3 | 3 testimonials | 3 | OFFEN | only the client can supply them |
| 4 | VAT ID | 3 | OFFEN | imprint skeleton in place, field empty |
```

Status: **GELÖST** (solved: really obtained) · **PLATZHALTER** (placeholder: neutrally
filled, marked) · **OFFEN** (open: stays with the human) · **NICHT MÖGLICH** (not
possible, with a reason).

## Report to the lead
```
FEHLEND.md: [N] items
  GELÖST:       [N]  (of which [N] assets from the client's domain)
  PLATZHALTER:  [N]  (all marked in the code)
  OFFEN:        [N]  → go into BERICHT.md
  NICHT MÖGLICH:[N]
Gate 1 after my changes: [green / red]
Provenance of all assets: design/assets-herkunft.tsv
```

## Limits
- **When in doubt, bucket 3.** Gap closing that is too cautious costs the human five
  minutes. Gap closing that is too bold costs the client their credibility.
- Every placeholder is marked in the code **and** listed in `FEHLEND.md`. Both.
- No asset without a provenance entry.
- You don't change content that already exists; you only fill gaps.
- Legal texts: skeleton yes, wording no. An invented imprint is a legal violation.

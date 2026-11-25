---
name: aufwertung
description: "Turns a vague order ('make it better', 'more modern', '20x better') into a concrete, prioritised scope. Systematically looks for opportunities, not only defects: what is missing entirely, what helps the business, what would be appropriately strong. Use after recon and before design-tokens on every M2 order."
argument-hint: "[what the client said]"
allowed-tools: Read, Write, Edit, Glob, Grep, WebFetch
model: opus
effort: high
---

# Aufwertung (upgrade scoping)

"Make it better" is not an order but a direction. This skill turns it into a list you
can work through, and one that **contains more than what the client named.**

The difference between an agency and a contractor: the contractor does what is written
down. The agency sees what is missing. That is exactly your job.

## The thinking error you must avoid
**"20x better" does not mean "20 features".** A page with twenty new sections is worse,
not better. Upgrading means: **less, but right**, plus the two or three things that are
really missing.

If your list ends up with thirty items, you haven't thought, you've collected.

---

## The six search lenses
Go through **all six**. Each finds what the others miss; that is why there are six and
not one general "what could be improved" question.

### 1. What is missing entirely?
Not "is weak", but **not there at all**. These are usually the biggest levers:
- No way to get in touch via a form (only a phone number in the footer)
- No mobile navigation, or one that can't be used at 375px
- No references/projects, although the business lives on them
- No price or service overview, although every visitor looks for it
- No 404 page, no favicon, no OG image (the shared link shows nothing)
- No language switch, although the client works in two languages

### 2. What is there, but weak?
- Hero without a message ("Welcome to …" says nothing)
- Body text under 16px, line height under 1.5
- Contrast under 4.5:1
- Images uncompressed, without `width`/`height` → layout jumps while loading
- Everything weighted the same: no hierarchy, no visual path

### 3. What helps the business?
The lens that creates the most value and is forgotten most often.
Ask: **What should the visitor do, and how far away from it are they?**
- Tradesperson → request a quote in one step instead of hunting for a phone number
- Restaurant → book a table, menu as text instead of PDF (PDF is unreadable on mobile)
- Law firm → book an initial consultation, practice areas clearly separated
- Agency → show the work, don't describe it
- Make trust signals visible: real photos instead of stock, years in business,
  certificates, real testimonials, **only what is proven** (see the no-invention rule)

### 4. What is technically broken?
- Load time, uncompressed images, blocking scripts
- No `<title>`/`meta description` per page, the same text everywhere
- No `sitemap.xml`, no `robots.txt`
- Console errors, 404s on assets
- Broken at 375px

### 5. What is missing legally?
> **Example locale: Switzerland/EU (adjust for your jurisdiction).** Not optional there:
> - Imprint (Impressum), privacy policy
> - Cookie notice when tracking, and it has to be **declinable**
> - Contact details reachable

If something is missing here, it is **always high priority**, however unspectacular.

### 6. What would be appropriately strong?
Only now the visual side, deliberately as the last lens so it doesn't become the first.
**Bound to the motion level** (`design/motion-plan.md`):
- A signature element that fits the business (see `design-tokens`)
- A hero moment instead of a stock photo
- Micro-interactions that give feedback
- Depth through gradient, glow, texture instead of more elements

An effect that breaks the motion level does **not** go on the list, even if it would be
impressive.

---

## Prioritise: impact against effort
Every item gets both, estimated in one line:

| | low effort | high effort |
|---|---|---|
| **High impact** | **first**: these are the wins | then: this is the real work |
| **Low impact** | take along if you're there anyway | **leave out** and say why |

The bottom-right cell matters: **write down what you deliberately leave out.**
A list without omissions looks as if you didn't prioritise.

---

## The no-invention rule: especially sharp here
You are upgrading the site of a real business. Anything that looks like a fact will be
read as one by visitors.

**Never invent:** testimonials · numbers ("over 500 projects") · years in business ·
certificates · team size · prices · delivery times · reference clients.

If a proposal needs content that doesn't exist, write it down as a **need**, not as a
solution:
> "Prepare a references section. **Needs from the client**: 3–5 projects with image,
> title and one sentence. Structure and layout are in place, placeholders marked."

That is the difference between a usable result and a liability trap.

---

## Output → `design/aufwertung-<domain>.md`
```markdown
# Aufwertung — [domain]
As of: [date] · Order: "[what the client said]"
Track: [A/B] · Basis: design/recon/<domain>.md

## The core problem in one sentence
[What stops the site today from doing its job. Not "looks old", but
 "visitors find no way to get in touch within 10 seconds".]

## Scope, prioritised
### First (high impact, low effort)
1. **[title]** · lens: [1–6] · impact: high · effort: small
   Now: […] → Target: […]
   Needs from the client: [nothing / what exactly]

### Then (high impact, high effort)
### Take along
### Deliberately left out
- **[title]** — because […]

## Needs input from the human
<!-- This list goes to the client ONCE at the end. Don't ask in the middle. -->
1. […]

## What I can't judge
[Honest: access missing, content unknown, business decision needed]
```

---

## Limits
- **The scope stays within the order.** "Make the homepage better" is not permission to
  build a shop. Big extensions go under "Needs input".
- **No item without now/target.** "Modernise" is not an item.
- **Invent nothing about the client.** See above; that is the hardest rule here.
- **The motion level binds you too.** Lens 6 proposes nothing the `builder` wouldn't be
  allowed to build.
- Legal (lens 5) is never "nice to have".

---
name: design-tokens
description: BEFORE building, creates a compact token system (4-6 named colours, three type roles, a space scale, and a signature element) and then checks it in a critique pass against generic defaults. Writes design/tokens.json and design.md §0. Required in M2 and M3 before a line of code exists.
argument-hint: "[page or project]"
allowed-tools: Read, Write, Edit, Glob, Grep
model: opus
effort: high
---

# Design-Tokens

The step that decides between "premium" and "yet another AI site", and it happens
**before** the code, not after.

The reason is simple: whoever builds first and adjusts colours later is correcting
symptoms. Whoever fixes the system first builds consistently from the start. Together
with real references this is the biggest single lever on output quality.

## Two passes. The second one is the important one.

---

## Pass 1: design the system

### Colours: 4–6, each with a role name
More than six is not a palette but indecision. Every colour gets a name that says its
**role**, not its hue:

```
background · surface · text · text-muted · accent · on-accent
```

Exactly **one** accent. It carries buttons, links and focus rings, nothing more.
Colour used over large areas looks cheap (`design.md §2`).

**Calculate** contrasts, don't estimate them: text ≥ 4.5:1, large text ≥ 3:1. A token
system with beautiful colours at 3.2:1 is unusable.

### Type: three roles
| Role | Use | Selection criterion |
|---|---|---|
| **Display** | headlines, sparingly | carries the personality |
| **Body** | running text, navigation | legibility at 16px |
| **Utility** | labels, numbers, code | often a mono or a narrow grotesque |

The pairing is a decision **for this project**. Not the same combination you would take
for any other one. Typography carries the personality of the site; it is not a neutral
delivery of text.

Check the licence of every typeface, don't assume it.

### Space: one scale, consistently
```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128
```
All spacing comes from this scale. Framework default spacing is the clearest wireframe
tell there is: a page where every gap is `1rem` looks undesigned, even if the colours
are right.

### Layout in one sentence + ASCII sketch
```
Centred container 1200px, hero full width with gradient,
below it three-column cards, single column from 768px down.

┌────────────────────────────┐
│  HERO  (full, gradient)    │
├──────┬──────┬──────────────┤
│ Card │ Card │ Card         │
└──────┴──────┴──────────────┘
```

### The signature element: required on Track B
**The one element that makes this site unmistakable.** Without it you get the
statistical average: technically clean, visually interchangeable.

It comes from the client's business, not from the effects catalogue. Examples:
- Electrician → a cone of light that travels across the sections as you scroll
- Carpenter → wood grain as a fine texture in the section transitions
- Law firm → a precise hairline grid that builds up on load

Describe it in one sentence and say **where** it sits.

---

## Pass 2: the critique pass

Now comes the part people like to skip. Don't skip it.

Go through every item from pass 1 and ask:

> **Is this a decision for this brief, or the default I would have taken for any other
> project too?**

### The three forbidden clusters
If your system hits one of them, it is not a system but a reflex (CLAUDE.md §5):

1. **Warm cream + serif + terracotta**
2. **Near-black + acid green or vermilion**
3. **Newspaper layout with hairline dividers and column setting**

These three show up in AI-generated design regardless of topic. They are the reason AI
sites all look alike. **Forbidden** unless the brief asks for them.

### More test questions
- Could this palette just as well belong to a client in another industry?
- Is the type pairing chosen or habitual?
- Does the signature element say something about *this* client?
- Is the structure informative or decorative? Numbering and dividers only where they
  express a real relationship (`design.md §7`).

**Whatever fails the test gets reworked, before code exists.**

---

## Writing
Both files together; they have to match:
- **`design/tokens.json`**: the values, machine-readable. The builder reads them,
  `aesthetic` judges against them.
- **`design/design.md §0`**: the same values in prose, for humans.

## On existing sites (M2)
The tokens don't come out of nothing but from `design/recon/<domain>.md`. You improve
the existing system, you don't replace it. Whatever brand the client has (logo colour,
established typeface) stays; whatever is weak (contrasts, chaotic spacing) gets put in
order.

Reinventing without an order is overstepping, not a redesign.

## Limits
- No token without a role name.
- No contrast value without a calculation.
- No signature element without a link to the business.
- No typeface without a checked licence.
- Pass 2 is not optional. A system without a critique pass is pass 1, not a result.

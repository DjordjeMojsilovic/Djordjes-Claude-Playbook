---
name: komponenten
description: Decides which registry a component may come from, driven by the page's motion level, and how it gets installed. Use before every reach for a ready-made component. Stops a calm page from getting Aceternity effects and a wow page from staying bare.
argument-hint: "[what kind of component]"
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "src/components/**"
  - "components.json"
allowed-tools: Read, Glob, Grep, Bash(npx shadcn@latest add *), Bash(21st search *)
---

# Komponenten (components)

The rule that stops "use sparingly" from staying a pious wish.

## The motion level opens the registry
From `design/motion-plan.md`. The scale is inverted: **1 = maximally loaded,
10 = discreet.**

| Level | Open | Locked |
|---|---|---|
| **8–10** | shadcn/ui | everything else |
| **5–7** | + Motion Primitives, Cult UI | Aceternity, Magic UI |
| **1–4** | + Aceternity, Magic UI | — |

**At most one wow element per page**, even at level 1. Two animated heroes are not
double the wow but half of it.

A component above the allowed level is a reason to fail Gate 2, even if it looks nicer.
`aesthetic` checks exactly that.

## Installation: one route for everything
Through the shadcn registry, not through library-specific CLIs:

```bash
npx shadcn@latest add button card dialog          # shadcn base
npx shadcn@latest add @aceternity/spotlight       # third-party registry
```

Register third-party sources once in `components.json`:
```json
{
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json",
    "@magicui": "https://magicui.design/r/{name}.json"
  }
}
```

The `shadcn` MCP server gives you search and the real source code before you install.
**Use it**: you can't judge a component you haven't read.

### Registry status (checked 2026-07-31)
| Registry | Status |
|---|---|
| Aceternity, Magic UI | confirmed reachable |
| Motion Primitives, Cult UI | unchecked (rate limit during the test): test the URL before use |
| Tailark | needs auth, **not** freely usable |

If a registry doesn't work: copy the component by hand. All of them allow copy-paste.

## Before every reach for a ready-made component
```
[ ] Looked up the motion level of this page?
[ ] Registry open for this level?
[ ] Already a wow element on this page?
[ ] Read the source code (not just seen the demo)?
[ ] Checked the licence, including third-party parts inside the component?
[ ] Does it fit tokens.json, or would I have to bend the tokens?
[ ] prefers-reduced-motion included or addable?
```

The second-to-last item is the most important: **a component for which you would have
to bend the tokens is the wrong component.** Don't adapt the system to the component.

## Build it yourself instead of installing: when
- The component brings five dependencies for one effect
- It is bigger than what you need and can't be slimmed down
- Its style fights the tokens
- Twenty lines of `motion` would do

Ready-made components save time but cost maintenance. Every dependency is maintenance
(CLAUDE.md §3).

## 21st.dev: only the free part
Browse the catalogue, read real code, publish. **No** `21st generate` (credits),
**no** auto-install (2/day). For finding a direction in the `concept` step, not for
installation.

```bash
21st search "pricing table"
```

## Limits
- No new library without asking the human (CLAUDE.md §3).
- Licence from the source before use, not from memory. When unsure, `context7` or open
  the component page.
- On dependency conflicts (React 19 / Next 15): `npm install --legacy-peer-deps`, but
  first check whether the component is worth the conflict.

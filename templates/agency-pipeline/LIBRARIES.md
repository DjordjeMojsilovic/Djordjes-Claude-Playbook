# LIBRARIES.md

<!-- WHY THIS FILE: the builder needs tools to animate and illustrate at all; without
     libraries it builds wireframes. This lists which library does which job, which ones
     the motion level unlocks, and the licence situation. Check licences again before
     use; they change. -->

## Division of roles
| Library | Job | When |
|---|---|---|
| **shadcn/ui** | structure and primitives: buttons, forms, dialogs, cards, navigation | always, the base of every page |
| **motion** (motion.dev) | the animation engine: custom motion, scroll reveals, transitions | where motion is needed (see motion level) |
| **Motion Primitives, Cult UI** | curated animated components | motion level 5–7 and lower |
| **Aceternity UI, Magic UI** | ready-made wow sections: animated heroes, beams, shader backgrounds | motion level 1–4 only, one wow element per page |

The motion level in `design/motion-plan.md` decides which row is open (skill
`komponenten`). A page full of Aceternity effects is a mistake, not a success.

## shadcn/ui
Licence: MIT. The CLI package is `shadcn` (not the old `shadcn-ui`).
```bash
npx shadcn@latest init
npx shadcn@latest add button card dialog input
```

## motion
Licence: MIT. Formerly "Framer Motion", now `motion`.
```bash
npm i motion
```
Import: `import { motion } from "motion/react"`. Always respect `prefers-reduced-motion`.

## Aceternity UI / Magic UI
The free components are MIT-licensed, but single components can contain third-party
parts under other licences: check the component page before use. Install through the
shadcn registry (see the `komponenten` skill). On dependency conflicts
(React 19 / Next 15): `npm install --legacy-peer-deps`.

## Unsplash: real photos, only where they fit
For photos that carry the content. No decorative stock, no generic photos of people
(`design/design.md §5`).
- Register an app with Unsplash to get an access key, put it in `.env.local` as
  `UNSPLASH_ACCESS_KEY`. **Never** with a `NEXT_PUBLIC_` prefix; fetch server-side.
- Attribution (photographer + Unsplash link) and the download-trigger endpoint are
  required by the API guidelines.

## Rule for every new library
Before adding it: check the licence (an opened source, not memory), check the style
fit, think about bundle size. No package "because it's cool". Ask the human first
(CLAUDE.md §3).

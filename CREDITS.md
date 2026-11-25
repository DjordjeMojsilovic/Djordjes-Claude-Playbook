# Credits

None of these skills or plugins are copied into this repo. I link to the original, and the install commands pull from there. All credit goes to the authors. Licenses are taken from each repo's LICENSE file (checked November 2026). If something here is wrong, open an issue and I'll fix it.

## Skills and plugins I recommend

| What | Author | Repo | License |
|---|---|---|---|
| caveman | Julius Brussee | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Apache-2.0 ("Caveman" and its logo are the author's trademarks) |
| ponytail | Dietrich Gebert | [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | MIT |
| frontend-design | Anthropic | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 |
| emil-design-eng, animate, apple-design, mobile-native, review-animations, prototype, break-ui, animation-performance | Emil Kowalski | [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT |
| hallmark | Nutlope (Together AI) | [Nutlope/hallmark](https://github.com/Nutlope/hallmark) | MIT |
| design-taste-frontend | Leonxlnx | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT |
| minimalist, brutalist, soft, stitch | Leonxlnx | [Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics) | MIT |
| imagegen-frontend-web | Leonxlnx | [Leonxlnx/imagegen-skills](https://github.com/Leonxlnx/imagegen-skills) | MIT |
| oxfords | Arham Hafeez | [arhamhi/oxfords](https://github.com/arhamhi/oxfords) | MIT |
| better-layout, better-colors, better-typography, better-ui, better-interface, interface-review | Jakub Krehel | [jakubkrehel/skills](https://github.com/jakubkrehel/skills) | MIT |
| verification-before-completion (from superpowers) | Jesse Vincent | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| grill-me, diagnosing-bugs, tdd, to-spec, improve-codebase-architecture, codebase-design | Matt Pocock | [mattpocock/skills](https://github.com/mattpocock/skills) | MIT |
| find-bugs, security-review | Sentry | [getsentry/skills](https://github.com/getsentry/skills) | Apache-2.0 (security-review's OWASP-derived references: CC BY-SA 4.0) |
| design, product-management plugins | Anthropic | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) | Apache-2.0 |
| ralph-loop, playwright | Anthropic (playwright wraps Microsoft's `@playwright/mcp`) | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Apache-2.0 |
| backend-design | sheitabrk | [sheitabrk/backend-design](https://github.com/sheitabrk/backend-design) | MIT |
| audit-ai-design-slop, cinematic-gsap-lenis-motion-system, gsap-scrolltrigger-storytelling | Meng To | [MengTo/Skills](https://github.com/MengTo/Skills) | MIT |
| ai-slop-detector | FeedHive | [FeedHive/ai-slop-detector](https://github.com/FeedHive/ai-slop-detector) | MIT |
| supabase-postgres-best-practices | Supabase | [supabase/agent-skills](https://github.com/supabase/agent-skills) | MIT |
| figma | Figma | [figma/mcp-server-guide](https://github.com/figma/mcp-server-guide) | no LICENSE file, Figma Developer Terms apply |
| SuperMe | SuperMe | [superme-ai/superme-plugins](https://github.com/superme-ai/superme-plugins) | all rights reserved (hosted service) |
| claude-code-themes | ishuagrawal | [ishuagrawal/claude-code-themes](https://github.com/ishuagrawal/claude-code-themes) | MIT |

## Mentioned, but on my "never" list

| What | Author | Repo | License |
|---|---|---|---|
| impeccable | Paul Bakaus | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 |
| ui-ux-pro-max | Next Level Builder | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT |

Both are real, popular projects. They're on my never list because of how they work for me without direction (see [module 08](course/08-design.md)), not because of their quality or license.

## Mentioned as examples

| What | Repo | Why it's mentioned |
|---|---|---|
| caveman (a different project with the same name) | [akramsystems/caveman](https://github.com/akramsystems/caveman) (MIT) | Example of "same name, different project" in [module 11](course/11-safety.md) |
| agent-skills | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | Example of a repo without a LICENSE file in [module 11](course/11-safety.md) |
| claude-code-frontend-skills | [JaimeJunr/claude-code-frontend-skills](https://github.com/JaimeJunr/claude-code-frontend-skills) (MIT for its own files) | A bundle I used before. I link the originals instead |

## Adapted in this repo

| What | Original | License |
|---|---|---|
| [skills/decision-toolkit](skills/decision-toolkit/SKILL.md) | [glebis/claude-skills](https://github.com/glebis/claude-skills), Copyright (c) 2025-2026 Gleb Kalinin | MIT, see [LICENSE-UPSTREAM](skills/decision-toolkit/LICENSE-UPSTREAM) |

## Inspiration and references

- [garrytan/gstack](https://github.com/garrytan/gstack): Garry Tan's published Claude Code setup (MIT). It's the reason I'm sharing mine.
- [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks): Anthropic's official recipes for building with the Claude API (MIT).
- [skills.sh](https://skills.sh): where I find most skills. The `npx skills add` command comes from [vercel-labs/skills](https://github.com/vercel-labs/skills).
- The agency pipeline in [`templates/agency-pipeline`](templates/agency-pipeline/) calls [shadcn/ui](https://github.com/shadcn-ui/ui) (MIT) and the [21st.dev](https://21st.dev) CLI when it picks components.

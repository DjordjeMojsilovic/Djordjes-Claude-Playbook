# Skills I use

Sorted by topic. Every entry says what the skill does, when I reach for it, when I don't, who wrote it, the license, and how to install it.

I don't copy anyone's skills into this repo. Every command below pulls from the author's own repo, so you get the current version. That version can differ from the copy I use. Hallmark, for example, is now a v2.0 rewrite, and mine is older.

**The tiers**

| Tier | Meaning | In the install script? |
|---|---|---|
| **Core** | I use it across many projects | yes |
| **When needed** | Clear job, I call it on purpose | yes, you can skip the group |
| **Prototype variants** | Style skills, one per prototype | yes, you can skip the group |
| **Worth trying** | I haven't used it much, but it fits a problem I keep having | no |
| **Built in** | Comes with Claude, nothing to install | no |

**How to read the commands**

- `npx skills add` is the [skills CLI](https://github.com/vercel-labs/skills). `-g` installs for all your projects (leave it out for the current project only), `-a claude-code` targets Claude Code, `-y` skips the prompts. It needs Node.js 22.20 or later.
- `claude plugin install <name> --marketplace <owner/repo>` is the Claude Code CLI (v2.1.292 or later). It adds the marketplace if you don't have it yet, then installs. Inside a session, `/plugin install <name>@<marketplace>` does the same once the marketplace is added.
- Some skills call each other. Where that's the case, I install them together in one command. Don't split those.

---

## Design & prototypes

How I use these is in [module 08](../course/08-design.md). Short version: references first, then prototypes that really differ, then I pick.

### frontend-design · Core
Makes Claude take deliberate visual decisions instead of the template look. I have it on for any UI work. I'd skip it for backend-only work, where it just adds context.
By Anthropic, [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design), Apache-2.0.
```
claude plugin install frontend-design --marketplace anthropics/claude-plugins-official
```

### Emil Kowalski's skills · Core
- **emil-design-eng**: polish, the small details that make an interface feel good
- **animate**: builds an animation in the right order, starting with whether it should animate at all
- **apple-design**: Apple-style calm, spacing and presence
- **mobile-native**: the fixes that make a web app feel native on a phone
- **review-animations**: critiques motion that already exists
- **prototype**: quick clickable prototypes

These are the ones I use most when I build something real. I don't use them for a quick throwaway page.
By Emil Kowalski, [emilkowalski/skills](https://github.com/emilkowalski/skills), MIT.
```
npx skills add emilkowalski/skills --skill emil-design-eng --skill animate --skill apple-design --skill mobile-native --skill review-animations --skill prototype -g -a claude-code -y
```

### hallmark · Core
A design skill for new pages that look designed, not generated. I use it a lot, mostly as one of the prototype variants. Skip it on an existing design unless you name it on purpose.
By Nutlope and the Hallmark contributors, [Nutlope/hallmark](https://github.com/Nutlope/hallmark), MIT.
```
npx skills add Nutlope/hallmark --skill hallmark -g -a claude-code -y
```

### Prototype variants

My rule: **every prototype has to be clearly different from the others, and expect only one or two of them to be good.** One style skill per prototype gets you real variety. So use one of these per prototype, never all of them at once.

| Skill | Pulls towards | Author, license | Install |
|---|---|---|---|
| design-taste-frontend | Opinionated anti-slop company sites, real photos | Leonxlnx, MIT, [taste-skill](https://github.com/Leonxlnx/taste-skill) | `npx skills add Leonxlnx/taste-skill --skill design-taste-frontend -g -a claude-code -y` |
| minimalist-ui, industrial-brutalist-ui, high-end-visual-design, stitch-design-taste | Minimal, brutalist, soft and expensive, strict DESIGN.md | Leonxlnx, MIT, [taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics) | `npx skills add Leonxlnx/taste-skill-classics --skill minimalist-ui --skill industrial-brutalist-ui --skill high-end-visual-design --skill stitch-design-taste -g -a claude-code -y` |
| imagegen-frontend-web | Generates a design image per section first, then you build from it | Leonxlnx, MIT, [imagegen-skills](https://github.com/Leonxlnx/imagegen-skills) | `npx skills add Leonxlnx/imagegen-skills --skill imagegen-frontend-web -g -a claude-code -y` |
| build-awwwards-quality-sites | Big, motion-heavy showcase sites | Meng To, MIT, [MengTo/Skills](https://github.com/MengTo/Skills) | `npx skills add MengTo/Skills --skill build-awwwards-quality-sites -g -a claude-code -y` |
| oxfords | Plain, clean, easy to scan product UI | Arham Hafeez, MIT, [arhamhi/oxfords](https://github.com/arhamhi/oxfords) | `npx skills add arhamhi/oxfords --skill oxfords -g -a claude-code -y` |

The taste-classics skills only run when you call them by name. That's what you want here.

> ### Never: impeccable and ui-ux-pro-max
>
> I don't use **impeccable** or **ui-ux-pro-max** under any circumstances. Without direction, both lead straight to AI slop. Work with references and moodboards instead.
>
> That's why there's no install command for either of them here, and neither is in the install script.

---

## Checking & quality

I run these after something is built, not while I'm still exploring.

### Jakub Krehel's interface skills · When needed
- **better-layout, better-colors, better-typography, better-ui, better-motion, better-accessibility, better-writing**: each one audits and fixes one area
- **better-interface**: runs the whole set
- **interface-review**: reviews a branch or PR for interface problems it introduced

I use better-layout most, right after a build. Skip them during early concept rounds, they pull everything towards safe.
These skills hand work to each other, so I install the whole set together.
By Jakub Krehel, [jakubkrehel/skills](https://github.com/jakubkrehel/skills), MIT.
```
npx skills add jakubkrehel/skills --skill better-interface --skill better-layout --skill better-colors --skill better-typography --skill better-ui --skill better-accessibility --skill better-writing --skill better-motion --skill interface-review -g -a claude-code -y
```

### break-ui and animation-performance · When needed
**break-ui** feeds a screen worst-case data (long names, empty lists, huge numbers) and reports what broke. **animation-performance** finds out why an animation stutters. I use break-ui before every handoff, animation-performance only when something janks.
By Emil Kowalski, [emilkowalski/skills](https://github.com/emilkowalski/skills), MIT.
```
npx skills add emilkowalski/skills --skill break-ui --skill animation-performance -g -a claude-code -y
```

### design plugin · When needed
Gives you **accessibility-review** (WCAG 2.1 AA), **ux-copy** (buttons, errors, empty states) and **design-critique**. I use ux-copy most. The plugin has more skills, I ignore the rest.
By Anthropic, [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/design), Apache-2.0.
```
claude plugin install design --marketplace anthropics/knowledge-work-plugins
```

### audit-ai-design-slop · When needed
Audits a page or screenshot for the typical AI-design clichés, with evidence, and suggests what to remove. It reads a catalog from its sibling skill **no-ai-design-slop**, so install both.
By Meng To, [MengTo/Skills](https://github.com/MengTo/Skills), MIT.
```
npx skills add MengTo/Skills --skill audit-ai-design-slop --skill no-ai-design-slop -g -a claude-code -y
```

### ai-slop-detector · When needed
The same idea for text: checks a draft for 120 patterns that make writing sound generated. I use it on slogans, posts and docs. It's not a design tool.
By FeedHive, [FeedHive/ai-slop-detector](https://github.com/FeedHive/ai-slop-detector), MIT.
```
npx skills add FeedHive/ai-slop-detector --skill ai-slop-detector -g -a claude-code -y
```

### webapp-testing · Built in
Drives a local web app with Playwright, takes screenshots and reads logs. Built into the Claude desktop app.

---

## Engineering

How I use these is in [module 09](../course/09-engineering.md).

### verification-before-completion · Core
Makes Claude run the checks and look at the output before it says "done". This is the one I trust most, because I don't trust "it works" without proof. I install only this one skill, not the whole superpowers plugin: the plugin changes how Claude works in every session, and this skill works on its own.
By Jesse Vincent, [obra/superpowers](https://github.com/obra/superpowers), MIT.
```
npx skills add obra/superpowers --skill verification-before-completion -g -a claude-code
```

### find-bugs and security-review · When needed
**find-bugs** looks for bugs in the current branch. **security-review** looks for security holes. I run them before a merge on anything with logins or user data.
Heads-up: this security-review has the same name as Claude Code's built-in `/security-review`. If you only want one, leave it out of the command.
By Sentry, [getsentry/skills](https://github.com/getsentry/skills), Apache-2.0. The security-review folder also has reference material under CC BY-SA 4.0.
```
npx skills add getsentry/skills --skill find-bugs --skill security-review -g -a claude-code -y
```

### /code-review and /security-review · Built in
Review the current diff before you merge. Nothing to install.

### backend-design · When needed
A security and design reflex for backend code: missing auth, injection, unsafe migrations. I use it on every new endpoint. Its hooks call `python`, so Python has to be on your PATH.
It has no marketplace file, so there's no command. Install it from the plugin browser in the Claude desktop app (search "Backend Design").
By sheitabrk, [sheitabrk/backend-design](https://github.com/sheitabrk/backend-design), MIT.

### ralph-loop · When needed
Runs Claude in a loop on the same task until it's really finished. I use it for long polish passes. Don't use it on anything vague, it will loop on the wrong thing.
By Anthropic, [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/ralph-loop), Apache-2.0.
```
claude plugin install ralph-loop --marketplace anthropics/claude-plugins-official
```

---

## Planning & decisions

### /advisor · Built in
A second, stronger model reviews the plan before Claude starts and the result before it says done. I turn it on at the start of almost every session with `/advisor fable`. The settings file does that for you with `advisorModel`.

### decision-toolkit · Core (mine)
RICE, decision matrix, pre-mortem and other frameworks for choices with real trade-offs, like build vs. buy. Skip it for small decisions, it's heavy.
My own version, adapted from [glebis/claude-skills](https://github.com/glebis/claude-skills) (MIT). It lives in [`skills/`](../skills/); the install script copies it.

### ultraplan · mine, not in the script
Treats a question like an operation: research, assessment, one clear plan. Claude Code ships its own `/ultraplan`, so the script doesn't install mine. To use it anyway, rename it first, see [`skills/README.md`](../skills/README.md).

### grill-me · When needed
Claude asks you hard questions about a plan or an architecture until the gaps show. I use it before a big build. It calls **grilling**, so install both.
By Matt Pocock, [mattpocock/skills](https://github.com/mattpocock/skills), MIT.
```
npx skills add mattpocock/skills --skill grill-me --skill grilling -g -a claude-code -y
```

### product-brainstorming · When needed, not in the script
A sparring partner for product ideas. It comes inside the product-management plugin with seven other PM skills I don't use, so the script leaves it out.
By Anthropic, [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins/tree/main/product-management), Apache-2.0.
```
claude plugin install product-management --marketplace anthropics/knowledge-work-plugins
```

---

## Learning

How I use these is in [module 10](../course/10-learning.md).

### learn · Built in
Switches Claude from doing the work to explaining it. Built into the Claude desktop app.

### interactive-learning · When needed (mine)
Turns a topic into one HTML study page: theory first, then flashcards and a quiz. I use it for school. It lives in [`skills/`](../skills/); the install script copies it.

---

## Saving tokens

How much these actually save is in [module 07](../course/07-tokens.md). Spoiler: less than one session per task does.

### caveman · Core
Short, blunt answers with every technical fact kept. Use the one by **JuliusBrussee**. There's a different project with the same name.
By Julius Brussee, [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman), Apache-2.0. "Caveman" is his trademark.
```
claude plugin install caveman --marketplace JuliusBrussee/caveman
```

### ponytail · Core
The smallest change that fully solves the task, and a short reply. It keeps code small, not just answers. I turn it off for design work, where minimal code and ambition don't always mix.
By Dietrich Gebert, [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail), MIT.
```
claude plugin install ponytail --marketplace DietrichGebert/ponytail
```

### /compact, /clear, /context · Built in
`/context` shows what fills the window, `/compact` summarizes, `/clear` starts fresh. These matter more than any plugin.

---

## Worth trying

I haven't used these much. They're here because they fit problems I kept running into.

| Skill | Why | Author, license | Install |
|---|---|---|---|
| cinematic-gsap-lenis-motion-system, gsap-scrolltrigger-storytelling | Smooth scrolling with Lenis kept breaking on me for weeks | Meng To, MIT, [MengTo/Skills](https://github.com/MengTo/Skills) | `npx skills add MengTo/Skills --skill cinematic-gsap-lenis-motion-system --skill gsap-scrolltrigger-storytelling -g -a claude-code -y` |
| supabase-postgres-best-practices | Lots of my projects run on Supabase: RLS, migrations | Supabase, MIT, [supabase/agent-skills](https://github.com/supabase/agent-skills) | `npx skills add supabase/agent-skills --skill supabase-postgres-best-practices -g -a claude-code -y` |
| diagnosing-bugs, tdd, to-spec | A bug at app launch survived three versions of my Windows app. And I build from specs a lot | Matt Pocock, MIT, [mattpocock/skills](https://github.com/mattpocock/skills) | `npx skills add mattpocock/skills --skill diagnosing-bugs --skill tdd --skill to-spec --skill setup-matt-pocock-skills -g -a claude-code -y` |

to-spec needs **setup-matt-pocock-skills**, that's why it's in the command. You can also install the whole set as a plugin (`claude plugin install mattpocock-skills --marketplace anthropics/claude-plugins-official`), which adds improve-codebase-architecture and about 20 more. It also brings its own `prototype` and `code-review`, which share names with Emil's prototype and the built-in `/code-review`.

# stack.md — [project]

<!-- WHY THIS FILE: it separates "what we build with" from "how we work".
     CLAUDE.md contains only invariants; the tech lives here and may be completely
     different per project.

     NEW BUILD: keep the house stack below, set `zugriff: repo` at the top.
     THIRD-PARTY PROJECT: `recon` fills this file from what it FINDS.
                          Not from assumptions. Unknown = "unknown", not a guess.

     Keep the key `zugriff:` at the start of a line with one of the values
     repo | nur-url | staging. The route-hint hook and /auftrag read it. -->

## Access
```
zugriff: repo
```
| Value | Meaning | Consequence |
|---|---|---|
| `repo` | We have the code and may commit | normal modes M0–M4 |
| `nur-url` | We only see the live site (URL only) | **M1-B findings**: output to `befund/`, vanilla patches, no Gate 1 |
| `staging` | Access to a test environment, not production | like `repo`, but deploy only through the human |

## Tech: what actually runs
<!-- Example house stack. Replace with what this project really uses. -->
| | |
|---|---|
| Framework | Next.js (App Router, TypeScript strict) |
| UI | React · Tailwind · shadcn/ui |
| Data / auth | Supabase |
| Mail | Resend |
| Hosting | Vercel |
| Motion / design libraries | see `LIBRARIES.md` |

## Commands
```
Dev server     npm run dev
Verify (Gate 1) npm run verify
Build          npm run build
E2E            npx playwright test
```
<!-- If `verify` is missing from package.json, the hook `ensure-verify.mjs` adds it
     automatically. If it is not a Node project, Gate 1 doesn't apply at all. -->

## Peculiarities of this project
- —

<!-- Everything an agent would otherwise have to find out the hard way goes here:
     "The client has their own cookie consent, don't touch it" ·
     "Deploy runs through a mirror repo" ·
     "Node 18 enforced, don't upgrade" ·
     "Images live on an external CDN, not in the repo" -->

## Assumptions: confirm or correct per project
- A1: —

---
name: ship
description: "Final checklist before handing over to the client: check both gates, check secrets, legal, update the memory, write the handover text. Use when an order is finished and should go out. Stops placeholders, missing RLS or dead links from going live."
argument-hint: "[optional: what is being delivered]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(npm run verify), Bash(npm run build), Bash(git status *)
---

# Ship

The last step before handover. Not the most exciting one, but the one where the
embarrassing mistakes show up, before the client finds them.

<!-- disable-model-invocation: true. This skill starts a delivery.
     Claude should never trigger it on its own just because the code looks finished. -->

## Instant findings: collected automatically

**Secrets in the client bundle (every hit needs a justification):**
!`grep -rn "NEXT_PUBLIC_" src/ 2>/dev/null | grep -iv "SUPABASE_URL\|SUPABASE_ANON_KEY" | head -10 | grep . || echo "  no hits"`

**Placeholders in the visible state:**
!`grep -rniE "lorem ipsum|ANGABE FEHLT|TODO:|FIXME" src/ 2>/dev/null | head -10 | grep . || echo "  no hits"`

**Uncommitted changes:**
!`git status --short 2>/dev/null | head -10 | grep . || echo "  none"`

If there is any hit above, that is a finding, not a residual risk.

## Before the deploy

### Gate 1: technical
```
[ ] npx tsc --noEmit          clean
[ ] npm run lint              clean
[ ] npm run build             clean
[ ] npx playwright test       green (if tests exist)
[ ] Browser console without errors on every route
```

### Gate 2: aesthetic
```
[ ] Every route has a BESTANDEN from `aesthetic`
[ ] The human has approved, not just the agent
[ ] state.md "Gate 2 status per page" is complete
```

### Content
```
[ ] No lorem ipsum
[ ] No [ANGABE FEHLT: …] in the visible state
[ ] No placeholder image, no example logo
[ ] All links work, including the ones in the footer
[ ] Contact details are correct and were confirmed by the client
[ ] Imprint and privacy policy present (mandatory in CH/EU, check your jurisdiction)
```

### Security: have `backend` double-check
```
[ ] No secret in the client bundle: grep for NEXT_PUBLIC_ and check every hit
[ ] SUPABASE_SERVICE_ROLE_KEY server-side only
[ ] RLS active on every table, each with at least one policy
[ ] Admin routes check the session server-side
[ ] Form endpoints validate server-side
[ ] Rate limiting on everything that sends mail
[ ] .env.local is NOT committed
```

Practical command for the first item:
```bash
grep -rn "NEXT_PUBLIC_" src/ | grep -iv "SUPABASE_URL\|SUPABASE_ANON_KEY"
```
Every remaining hit needs a justification.

### Tech hygiene
```
[ ] Favicon set
[ ] <title> and meta description per page, not the same everywhere
[ ] Open Graph image present (otherwise a shared link looks empty)
[ ] robots.txt and sitemap.xml
[ ] 404 page designed, not the framework default
[ ] Images compressed and with width/height (no layout shift)
[ ] prefers-reduced-motion works
```

## During the deploy
```
[ ] Environment variables set at the host: all from .env.example
[ ] Domain connected, HTTPS active
[ ] First live check: homepage, one form, one login (if there is one)
[ ] Looked at it on a real phone, not just in the simulator
```

## After the deploy
```
[ ] Run `scribe`: update state.md and decisions.md
[ ] Clean up .claude/.mode (the order is finished)
[ ] Write the handover text for the client
```

## Handover text: template
```
Hi [name],

[What] is finished and live at [URL].

What you can change yourself:
- […]

What you need to tell us if something should be different:
- […]

[If open:] We deliberately left a few things open:
- […] — because […]

Any questions: just get in touch.
```

> **Example locale:** the original template wrote this text in Swiss German dialect.
> Write it in your client's language and in the tone you normally use with them.

Keep it short. The client is non-technical (CLAUDE.md §1): no framework names, no jargon
without explanation.

## In M1-B (findings) instead of a deploy
```
[ ] report.md is understandable for the client, not for developers
[ ] Every patch is scoped and can be reverted on its own
[ ] EINSPIELEN.md names the route for THE detected stack
[ ] Before/after screenshots are included
[ ] No external request in any patch
[ ] Patch tested without JS: the page keeps working
```

## Limits
- **You don't deploy yourself.** The human presses the button. You prepare and report
  that it is ready.
- An unticked item is a finding, not a residual risk. Report it instead of leaving it
  out.
- No promises to the client about availability, load time or rankings.

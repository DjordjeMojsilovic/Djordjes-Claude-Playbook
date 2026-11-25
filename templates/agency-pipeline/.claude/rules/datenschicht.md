---
paths:
  - "supabase/**"
  - "**/*.sql"
  - "**/route.ts"
  - "**/middleware.ts"
  - "src/app/api/**"
  - "src/lib/supabase/**"
  - "prisma/**"
---

# Data layer: security

<!-- Loads ONLY for work on the database, API routes or middleware. These rules are too
     important to get lost in a long CLAUDE.md, and too specific to cost context on
     every CSS change. -->

Mistakes here are invisible. You see a crooked headline. Nobody sees a missing RLS
policy, until a client's data is public.

**The `backend` agent owns this layer** (Opus, effort high). If you are not `backend`
and change something fundamental here: tell the lead.

## Non-negotiable
- **RLS on every table.** A new table without a policy is unfinished, not
  "for later". There is no in-between state where that is OK.
- **The anon key is public.** What it can read is public. Plan as if it were in the
  source code, because it is.
- **`SUPABASE_SERVICE_ROLE_KEY` never** in client code, never in `NEXT_PUBLIC_*`.
  It bypasses RLS completely. Server only, no exceptions.
- **Admin routes check the session server-side.** A client redirect is not protection,
  it is a display. Whoever knows the URL is in.
- **Justify every policy individually.** "Logged-in users only" is not a policy, it is
  a hope. Who may see which *rows*, and why?
- **Validate server-side.** Browser validation is a convenience, not a check.
- **Rate limiting** on everything that sends mail.

## Migrations
Reversible, or with a documented reason against it. Policies go in the same step as
the table, not in a later one.

## Before every hand-off
```
[ ] RLS enabled and at least one policy per new table
[ ] No policy accidentally allows `true` for everyone
[ ] No secret in NEXT_PUBLIC_* or in the client bundle
[ ] Every protected route checks server-side
[ ] Migration reversible or justified
[ ] Form endpoints validate server-side
[ ] Rate limiting on mail sending
```
An unticked item is a finding, not a residual risk.

## When in doubt, more restrictive
A policy that is too tight shows up in testing. One that is too loose shows up in a
data leak.

API claims only after checking the docs (`context7`), never from memory.
In security, "I think" is not an answer.

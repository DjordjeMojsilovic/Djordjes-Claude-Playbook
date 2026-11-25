# FEHLEND — [project]
As of: [date]

<!-- WHY THIS FILE: FEHLEND = "missing". The collection point for everything an agent
     could NOT deliver.

     RULE: every time `[ANGABE FEHLT: …]` gets written into the code anywhere, the same
     item goes in here as a row. Otherwise the `finisher` never finds it and it slips
     silently into the live site.

     The `finisher` works through it as the second-to-last agent and sorts every item
     into one of three buckets. Whatever is still OFFEN afterwards is exactly what the
     human has to do.

     PARSED BY HOOKS (fehlend-gate.mjs, statusline.mjs): keep the column order
     (# · what · bucket · status · note), the bucket as a number 1/2/3, and the German
     status words:
       GELÖST = solved · PLATZHALTER = placeholder · OFFEN = open ·
       NICHT MÖGLICH = not possible
     Example rows (inside this comment, so the hooks ignore them):
     | 1 | Logo | 1 | GELÖST | from example.com/logo.svg → public/logo.svg |
     | 2 | Hero visual | 2 | PLATZHALTER | generative gradient, tokens.json |
     | 3 | 3 testimonials | 3 | OFFEN | only the client can supply them | -->

## The three buckets
| Bucket | Question | Who solves it |
|---|---|---|
| **1 obtainable** | Does it demonstrably exist and may I fetch it? | `finisher` fetches it from the **client's domain** |
| **2 neutral fill** | Does it claim *nothing* about the client? | `finisher` builds a marked placeholder |
| **3 never replaceable** | Would a visitor read it as a **fact**? | only the human |

When in doubt between 2 and 3, it is always **3**.

## Open and closed items

| # | What | Bucket | Status | Source / note |
|---|---|---|---|---|

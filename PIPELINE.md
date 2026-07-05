# Georgetown KY Public Records — Data Pipeline & Developer Reference

> **Audience:** Developers deploying or maintaining the live data pipeline.
> This document is intentionally **not linked** from the public-facing app.
>
> This file describes *behavior* and points at the real source files for exact
> implementation. When the code and this doc disagree, the code wins — please
> update this doc alongside any change to `worker/` or `routine/`.

---

## Architecture Overview

```
georgetownky.gov/RSSFeed.aspx?ModID=65&CID=…   ← 8 committee RSS feeds
gmwss.com/board.htm                             ← GMWSS board minutes (scraped, no RSS)
gmwss.com/rates.htm                             ← Water/sewer rate data (scraped)
gscplanning.com/meetingrecords                  ← Planning Commission (scraped, no RSS)
          │
          ▼
┌──────────────────────────────────────────────┐
│  Cloudflare Worker      (worker/src/worker.js)│
│  ┌──────────────────────┐                     │
│  │ RSS Fetch & Dedup    │  KV: seen GUIDs (1-yr TTL)
│  │ GMWSS Board Scraper  │  KV: seen PDF URLs (1-yr TTL)
│  │ Water Rate Checker   │  KV: water-rates snapshot
│  │ Planning Scraper     │  KV: seen planning URLs
│  │ AI Summarizer (opt.) │  Haiku — PDF minutes → JSON summary
│  │ Enrichment Stage     │  worker/src/enricher.js — Haiku
│  └──────────────────────┘                     │
│           │                                   │
│           ▼                                   │
│   KV: records        ← all pipeline items (city + GMWSS + planning)
│   KV: water-rates    ← current rate snapshot
│   KV: poll-status    ← last-run timestamps per poller
└──────────────────────────────────────────────┘
          │                              ▲
          ▼ (page load, GET /records)    │ (manual/scheduled, POST via KV API)
 index.html → js/pipeline.js             │
   loadPipeline() merges + re-indexes    │
                                  routine/poll.js — "Claude Routine"
                                  offline polling script, run manually or
                                  on a schedule outside the Worker's own cron
```

The Worker is the **only** thing that serves data to the browser. The routine
script (`routine/poll.js`) is a separate, independently-runnable tool that
polls the same sources and can push results into the same KV store — it does
not talk to the browser directly.

There is **no R2 usage** in the current code, despite an `r2_buckets` binding
still present in `worker/wrangler.toml`. All pipeline storage is Cloudflare KV
(`records`, `water-rates`, `poll-status`, plus per-item `seen:*` / `gmwss-seen:*`
/ `plan-seen:*` dedup keys and `ctx:*` enrichment cache keys).

---

## Data Sources — Full Reference

### Live RSS (8 feeds, polled every 30 minutes by the Worker's cron)

| Committee | Feed ID | Cadence |
|-----------|---------|---------|
| City Council | `City-Council-1` | 2×/month |
| Finance Committee | `Finance-Committee-2` | Monthly |
| Fire Committee | `Fire-Committee-3` | Monthly |
| Traffic Committee | `Traffic-Committee-4` | Monthly |
| Police Committee | `Police-Committee-5` | Monthly |
| Public Works Committee | `Public-Works-Committee-6` | Monthly |
| Interlocal Committee | `Interlocal-Committee-7` | Quarterly |
| Miscellaneous Committees | `Miscellaneous-Committees-10` | As scheduled |

Base URL: `https://www.georgetownky.gov/RSSFeed.aspx?ModID=65&CID=<Feed ID>`

### Manual / Scraped (polled daily by the Worker, no RSS available)

| Source | URL | Notes |
|--------|-----|-------|
| GMWSS Board of Commissioners | `gmwss.com/board.htm` | HTML scrape for PDF links. Handles both the pre-2026 path (`/board/minutes/YYYY/M-DD-YYYY.pdf`) and the 2026+ path (`/board/Packets/YYYY/GMWSS-Board-Packet-M-DD-YY.pdf`). Meeting: 3rd Tuesday of each month. |
| GMWSS Water Rates | `gmwss.com/rates.htm` | Scrapes the current fixed rate table; compares against the last KV snapshot and logs a rate-change record if it differs. Rates change March 1 each year per the 2023 rate ordinance schedule. |
| GMWSS 2022 Rate Study | `georgetownky.gov/DocumentCenter/View/1794/` | Source of the approved 2023–2028 schedule (Scenario 5.1B). Reference only — not scraped. |
| Georgetown-Scott County Planning Commission | `gscplanning.com/meetingrecords` | HTML scrape for meeting/agenda links. |

The Worker's daily cron (`0 10 * * *` UTC, ~6am ET) runs the GMWSS board
scrape, the water rate check, and the planning scrape together; the RSS poll
runs on its own `*/30 * * * *` schedule.

### Secondary / Journalism (context only, not ingested automatically)

| Source | URL | Used for |
|--------|-----|----------|
| Georgetown News-Graphic | `news-graphic.com` | Corroborating public official statements |
| FOX 56 | `fox56news.com` | Breaking local news, GMWSS billing complaints |
| Lex18 | `lex18.com` | 2022 rate increase coverage |
| WEKU Public Radio | `weku.org` | 2022 rate increase coverage |
| WTVQ | `wtvq.com` | 2023 rate ordinance coverage |
| Citizen Portal | `citizenportal.ai` | AI-summarized council meeting transcripts |

---

## Cloudflare Worker

Source: `worker/src/worker.js` (poller + HTTP API) and `worker/src/enricher.js`
(AI enrichment). Config: `worker/wrangler.toml`.

### HTTP endpoints (`fetch` handler)

| Path | Method | Returns |
|------|--------|---------|
| `/records` | GET | All pipeline records currently in KV (JSON array, capped at 500, newest first) |
| `/water-rates` | GET | Latest scraped water/sewer rate snapshot |
| `/status` | GET | Last-run timestamp + item count for each poller (`lastRssRun`, `lastGmwssRun`, `lastWaterCheck`, `lastPlanningRun`) — used by `routine/poll.js` and the frontend's "Updated" pill |
| `/factcheck` | POST | Fact-check proxy. Accepts `{ statement, context }`, calls Claude (Haiku) with the `ANTHROPIC_KEY` secret held server-side, and returns the parsed verdict JSON. Returns `503` if the secret isn't configured. |

CORS is open (`Access-Control-Allow-Origin: *`) on all endpoints.

### Scheduled handler (`scheduled`)

- Every 30 minutes: `pollCityFeeds()` — all 8 RSS committee feeds.
- Daily at `0 10 * * *` UTC: `pollGMWSS()`, `checkWaterRates()`, `pollPlanning()`.

### wrangler.toml

```toml
name = "gtky-pipeline"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[triggers]
crons = ["*/30 * * * *", "0 10 * * *"]

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_NAMESPACE_ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "gtky-records"
# Currently unused by worker.js — kept for historical/future use.

# Secrets — set via CLI, never committed:
#   wrangler secret put ANTHROPIC_KEY
```

### Deployment

Deployment is automated: `.github/workflows/deploy.yml` runs `wrangler deploy
--config wrangler.toml` from the `worker/` directory whenever a push to `main`
touches `worker/**`, using the `CLOUDFLARE_API_TOKEN` repo secret.

To deploy manually:

```bash
cd worker
npm install -g wrangler
wrangler login
wrangler kv:namespace create KV
wrangler secret put ANTHROPIC_KEY     # optional — enables AI summaries + fact-check
wrangler deploy
```

After deployment, point the frontend at your Worker by updating:
- `R2_URL` in `js/pipeline.js` (name is historical; it's the Worker's `/records` URL)
- `FC_PROXY` in `js/factcheck.js`

The main site itself (everything outside `worker/`) deploys separately —
see [README.md § Deploying your own copy](README.md#deploying-your-own-copy).

---

## AI Processing

Runs only when `ANTHROPIC_KEY` is configured as a Worker secret. Two phases,
both using `claude-haiku-4-5-20251001`, run in `processNewItems()`:

1. **PDF summarization** — for any new item whose URL ends in `.pdf`, fetches
   and extracts the PDF text, then asks Haiku for a structured JSON summary
   (overview, topics, motions/decisions, dollar amounts). GMWSS items get a
   water-specific prompt; everything else gets the city-council prompt.
2. **Enrichment** (`worker/src/enricher.js`) — fetches the source page text,
   pulls any cached prior context for that item from KV (`ctx:*`, 30-day TTL),
   and asks Haiku for a plain-English summary with a `confidence` rating
   (`high`/`medium`/`low`) and `sources_used`. Official sources always
   override secondary ones; missing source text forces `low` confidence.

Cost: roughly $0.001–0.003 per PDF summarized/enriched (see cost table below).

---

## Claude Routine (`routine/poll.js`)

A standalone Node script — not part of the Worker — for running the same
poll logic manually or on a separate schedule (e.g. a weekly Claude Code
routine session). It duplicates the RSS/GMWSS/planning polling logic against
the same sources, but:

- Runs report-only by default (`node poll.js`) — prints new items, makes no writes.
- `--apply` pushes new records into the **same Cloudflare KV namespace** the
  Worker reads from (`node poll.js --apply`), via the Cloudflare KV REST API.
- Uses the Worker's `/records` endpoint to load already-known URLs for
  idempotency before polling.
- Has its own guardrails, independent of the Worker: a domain allowlist
  (`georgetownky.gov`, `gmwss.com`, `gscplanning.com`, `scottky.gov`), a
  per-domain 300ms throttle, and a `MAX_API_CALLS` cost cap (default 15
  Claude calls/run) since it uses Haiku to extract water rates and planning
  links from HTML rather than regex.

Required env vars: `ANTHROPIC_KEY` always; `CLOUDFLARE_ACCOUNT_ID`,
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_KV_NAMESPACE_ID` for `--apply`. Optional:
`WORKER_URL` (defaults to the production Worker), `MAX_API_CALLS`.

See `agent.md` for how this fits into routine Claude Code sessions — those
sessions edit `js/data/*.js` directly rather than running `poll.js` (running
network-fetching scripts is out of scope for routine sessions).

---

## Water Oversight Data — Static Reference

All rate figures below are from official published sources. This section is
the authoritative reference for the Water Oversight panel in `index.html`
(`panel-water`). Update these values — and `APPROVED_SCHEDULE` in
`worker/src/worker.js` — together if GMWSS publishes new rates.

### Current Rates (March 1, 2026 – February 28, 2027)
Source: [gmwss.com/rates.htm](https://gmwss.com/rates.htm)

| Service | Fixed (first 2,000 gal/mo) | Variable (per add'l 1,000 gal) |
|---------|---------------------------|-------------------------------|
| Water   | $22.90                    | $12.3593                      |
| Sewer   | $21.09                    | $13.3780                      |
| **Combined fixed** | **$43.99** |                          |

**Additional charges (city residents only):** Garbage $17.65/mo (Republic Services) · 911 Fee $8.00/mo
**Senior discount (65+):** 10% off water and sewer portions only. [Ordinance PDF](https://gmwss.com/misc/2023-05-08-Senior-Discount.pdf)

### Average Monthly Bills by Household Size
Based on 60 gal/person/day (national average). Source: gmwss.com/rates.htm

| Household | Water + Sewer | With Garbage + 911 |
|-----------|--------------|---------------------|
| 1 person  | $43.99       | $69.64              |
| 2 persons | $85.17       | $110.82             |
| 3 persons | $131.50      | $157.15             |
| 4 persons | $177.82      | $203.47             |

### Approved Rate Schedule 2023–2028
Source: [2022 Rate Study — georgetownky.gov/DocumentCenter/View/1794/2022-Rate-Study-12122022-v3](https://www.georgetownky.gov/DocumentCenter/View/1794/2022-Rate-Study-12122022-v3)
Scenario 5.1B approved by City Council, February 2023. Mirrored in
`APPROVED_SCHEDULE` in `worker/src/worker.js`.

| Effective | Water Fixed | Water Variable | Sewer Fixed | Sewer Variable | Combined Fixed | vs 2022 |
|-----------|------------|----------------|------------|----------------|---------------|---------|
| 2022 (pre-hike) | $13.49 | $7.28 | $12.42 | $7.84 | $25.91 | baseline |
| Mar 2023 | $15.78 | $8.52 | $14.53 | $9.22 | $30.31 | +17% |
| Mar 2024 | $18.47 | $9.97 | $17.00 | $10.79 | $35.47 | +37% |
| Mar 2025 | $21.61 | $11.66 | $19.89 | $12.62 | $41.50 | +60% |
| Mar 2026 | $22.90 | $12.36 | $21.09 | $13.38 | $43.99 | +70% |
| Mar 2027 (proj) | $24.28 | $13.10 | $22.35 | $14.18 | $46.63 | +80% |
| Mar 2028 (proj) | $25.73 | $13.89 | $23.69 | $15.03 | $49.42 | +91% |

### Historical Rate Context
Source: [gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf](https://gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf)

| Period | Combined Fixed (2,000 gal) | Notes |
|--------|---------------------------|-------|
| 1998   | $14.54 | Decreased from $14.94 — county water line investment era |
| 2004   | $14.87 | First increase since 1998 |
| 2007   | $16.36 | Last increase before 2019 |
| 2007–2019 | $16.36 | **12-year freeze** |
| 2019   | Stepped structure begins | 5-year plan, later superseded |

### FY2026 GMWSS Budget
Source: [Georgetown City Council, June 9, 2025](https://citizenportal.ai/articles/6529296/Kentucky/Scott-County/Georgetown-City/Georgetown-council-adopts-2536-million-FY26-water-and-sewer-budget-stresses-plant-upgrades-and-conservative-growth-assumptions)

| Item | Amount |
|------|--------|
| Total Revenue | $25,359,991 (+18.59% vs FY25) |
| Fund 1 Revenue | $22,730,279 |
| Fund 2 Revenue | $2,629,007 |
| Operating Expenses | $24,289,856 |
| Interest Expense | ~$3,100,000 |
| FY26 Departmental Capital | $1,794,697 |
| Toyota-Reimbursed Capital (Fund 2) | $2,650,000 |
| New Connections Budgeted | 150 (conservative estimate) |
| Staff COLA | 2.9% + up to 1% merit |
| ARPA Deadline | December 2026 (DeShaix/Water St interceptor) |

### Key Claims — Source Ledger

Every factual claim in the Water Oversight panel is sourced to one of the
following. This ledger is the single source of truth for fact-checking.

| Claim | Source | URL | Type |
|-------|--------|-----|------|
| 61.5% rate increase proposed | Georgetown News-Graphic, Nov. 25, 2022 | news-graphic.com/news/how-did-we-get-here... | Journalism |
| Two vendor mistakes totaling ~$50M | Mayor Tom Prather, public statement | Corroborated: Lex18 Nov. 2022, WEKU Dec. 2022, Spectrum News Dec. 2022 | On-record official statement |
| WWTP1 engineering flaw — insufficient concrete/rebar | News-Graphic Nov. 2022 + Lex18 Nov. 2022 | news-graphic.com/news/how-did-we-get-here... | Journalism |
| $64.2M WWTP1 total cost | FOX 56, June 7, 2024 + GMWSS General Manager Chase Azevedo statement | fox56news.com/news/local/georgetown/georgetown-water-treatment-plant... | Journalism + official statement |
| WWTP1 capacity: 4.5M → 9M gal/day | FOX 56, June 7, 2024 | fox56news.com/news/local/georgetown/georgetown-water-treatment-plant... | Official statement via journalism |
| 2019 interest calculation error | Mayor Prather, Nov. 2022 | Lex18: lex18.com/news/explaining-georgetowns-water-and-sewer-rate-increase | On-record official statement |
| ~$11M savings from bank draw note vs bonds | News-Graphic, Feb. 7, 2023 | news-graphic.com/news/lower-2023-rate-hike... | Journalism citing GMWSS GM memo |
| Scott County invested ~$25M in water infrastructure | News-Graphic, Nov. 25, 2022 | news-graphic.com/news/how-did-we-get-here... | Journalism |
| 12-year rate freeze 2007–2019 | GMWSS published rate sheets | gmwss.com/docs/Water-Sewer-Rate-Comparisons-2022.pdf | Official utility records |
| State auditor declined special exam | Councilmember Alonzo Allen at council meeting, Feb. 28, 2023 | WTVQ: wtvq.com/georgetown-city-council-approved-increase-in-water-and-sewer-rates/ | On-record official statement |
| 15,404 active water customers | GMWSS written statement to FOX 56, Mar. 2026 | fox56news.com/news/local/georgetown/georgetown-residents-raise-concerns... | Official utility statement |
| 91 leak checks Feb. 2026 / 36 of 91 showed flow | GMWSS written statement to FOX 56, Mar. 2026 | fox56news.com/news/local/georgetown/georgetown-residents-raise-concerns... | Official utility statement |
| 5.7% water / 11% sewer consumption increase since FY22 | City staff presentation, City Council June 9, 2025 | citizenportal.ai/articles/6529296... | AI-summarized meeting transcript |
| $106.4M capital plan 2024–2028 | 2022 Rate Study (Scenario 4A.1) | georgetownky.gov/DocumentCenter/View/1781/2022-GMWSS-Rate-Study- | Official government document |
| GMWSS not regulated by KY PSC | Dan Holman, public statement; gmwss.com/about.htm | fox56news.com/news/local/georgetown/georgetown-residents-raise-concerns... | Public statement + official |
| System pressure >80 PSI concern | Dan Holman, public statement | FOX 56, Mar. 2026 | Public statement (attributed) |
| Oct. 7, 2025 open-meetings incident | News-Graphic, Oct. 14, 2025 | news-graphic.com/news/gmwss-acknowledges-inadvertent-illegal-meeting... | Journalism + GMWSS written acknowledgment |
| Jason Baird reappointed unanimously | Georgetown City Council minutes, Nov. 24, 2025 | georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293 | Official government minutes |
| Jeff Klocke reappointment tabled then approved | Georgetown City Council minutes, Nov. 24, 2025 | georgetownky.gov/AgendaCenter/ViewFile/Minutes/_11242025-293 | Official government minutes |
| GMWSS board: 5 members appointed by Mayor | GMWSS About page | gmwss.com/about.htm | Official utility page |
| Board meets 3rd Tuesday monthly | GMWSS About page | gmwss.com/about.htm | Official utility page |
| $25.36M FY26 budget approved | City Council voice vote, June 9, 2025 | citizenportal.ai/articles/6529296... | AI-summarized meeting transcript |
| Holman urged council to change GMWSS structure | News-Graphic, Dec. 12, 2025 | news-graphic.com/news/council-pledges-funds-to-proposed-recovery-initiative... | Journalism |
| Hambrick responded defending council input | News-Graphic, Dec. 12, 2025 | news-graphic.com/news/council-pledges-funds-to-proposed-recovery-initiative... | Journalism |

---

## Structured Store + RAG (Future — When Needed)

Not implemented. Worth revisiting once records exceed ~500 entries or search
precision needs improvement (KV is a flat JSON blob today, capped at 500
items and matched client-side via lunr.js).

- **Cloudflare D1** (SQLite, free tier) — structured `meetings` / `water_rates`
  tables, free up to 5M row reads/day and 100K writes/day.
- **pgvector on Neon** (free tier) — semantic search over meeting-minute
  chunks via embeddings, ~$0.02/1M tokens to embed.
- **Typesense Cloud** — typo-tolerant full-text search, ~$10/mo, scales to
  100k+ records.

---

## Silent Error Logging

The frontend uses a ring-buffer logger (`js/logger.js`) invisible to users.

```js
// DevTools access:
window.gtky.log()          // full log array
window.__GTKY_LOG          // same, via getter
window.gtky.last(20)       // last 20 entries
window.__GTKY_DEBUG = true // mirror to console (dev only)
window.gtky.clear()        // clear buffer

// Log entry shape:
{ t: 1234, lvl: 'WARN', ctx: 'pipeline', msg: 'Non-OK response', det: { status: 404 } }
```

Wrapped call sites live in `js/ui.js`, `js/search.js`, `js/charts.js`,
`js/elections.js`, and `js/pipeline.js` — grep for `_LOG.` to find the current
set; it changes as the app grows and this doc won't try to enumerate them.

---

## Cost Estimate (Monthly)

| Item | Cost |
|------|------|
| Cloudflare Pages/Workers static hosting | $0.00 |
| CF KV reads/writes (within free tier) | $0.00 |
| CF Worker requests (10M/mo free) | $0.00 |
| RSS polling (48×/day × 8 feeds) | $0.00 |
| GMWSS board scrape + water rate check (1×/day) | $0.00 |
| Planning commission scrape (1×/day) | $0.00 |
| PDF summarizer + enrichment (Haiku, per new record) | ~$0.001–0.003/record |
| Fact-check — 100 checks/day (Haiku) | ~$3.00 |
| Fact-check — 1,000 checks/day (Haiku) | ~$30.00 |
| **Total at launch scale** | **~$0–5/mo** |

---

## Repository Structure (GitHub)

```
/
├── index.html              ← App shell + markup
├── css/style.css           ← Styles
├── js/                     ← ES modules (app.js, ui.js, search.js, charts.js,
│                              elections.js, factcheck.js, pipeline.js,
│                              logger.js, state.js)
│   └── data/                 Data files: directory, votes, meetings,
│                              ordinances, elections, water, schools
├── wrangler.jsonc          ← CF config for the main static site
├── README.md               ← Public-facing project description
├── PIPELINE.md             ← This document (developer only)
├── CONTRIBUTING.md         ← How to contribute data corrections
├── agent.md                ← Reference for routine Claude Code sessions
├── routine/
│   ├── poll.js             ← Claude polling routine (offline report/apply tool)
│   └── package.json
└── worker/
    ├── src/
    │   ├── worker.js       ← RSS/GMWSS/planning poller + KV-backed HTTP API + fact-check proxy
    │   └── enricher.js     ← AI enrichment stage
    └── wrangler.toml       ← CF Worker config (no secrets)
```

---

## All Data Sources Reference

| Source | URL | Auth | Notes |
|--------|-----|------|-------|
| City Agendas/Minutes | georgetownky.gov/RSSFeed.aspx?ModID=65 | No | 8 committee feeds, see table above |
| City Directory | georgetownky.gov/Directory.aspx | No | |
| City Ordinances | georgetownky.gov/DocumentCenter | No | |
| GMWSS Board Minutes | gmwss.com/board.htm | No | Scrape HTML, extract PDF links |
| GMWSS Current Rates | gmwss.com/rates.htm | No | Scrape; alert on change |
| GMWSS 2022 Rate Study | georgetownky.gov/DocumentCenter/View/1794/ | No | Reference only |
| GMWSS Capital Plan | georgetownky.gov/DocumentCenter/View/1781/ | No | Reference only |
| Planning Commission | gscplanning.com/meetingrecords | No | HTML scrape, no RSS |
| Scott County | scottky.gov | No | |
| Property Assessment | scottkypva.com | No | |
| Revenue Commission | gscrevenueky.gov | No | |
| KY School Report Card | reportcard.kyschools.us | No | JS app, no direct API |
| KY Dept. of Education | education.ky.gov/Open-House | No | |

---

*Last updated: July 2026*

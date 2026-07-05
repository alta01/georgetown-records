# Georgetown KY Public Records Index

An independent, searchable index of Georgetown, Kentucky city government records. Search council members, meeting minutes, vote records, ordinances, budgets, boards, economic development, school data, and election information — all in one place, for free.

**Not affiliated with the City of Georgetown, Scott County, or any candidate or political organization.**

---

## What's in the app

18 panels covering every major area of Georgetown and Scott County civic life. All content comes from official government sources.

### 👤 City Directory
68 officials and board members indexed — every elected official, department head, board member, and key staff position. Click any card to open a full profile with biography, contact info, vote history, and expandable activity entries linked to source documents.

Includes: Mayor Burney Jenkins · CAO Devon Golden · City Council (8 members) · Police Chief Darin Allgood · Asst. Chief Josh Nash · Fire Chief Seth Johnson · Finance Director Stacey Clark · City Clerk-Treasurer Tracie Hoffman · City Attorney Emilee Buttrum · plus all department heads, committee chairs, and Scott County officials.

### 📋 Meeting Minutes
40+ City Council meeting records from 2020–2026, with plain-English summaries and direct PDF links. A live pipeline automatically adds new records from the city's official RSS feeds.

### 🗳️ Vote Records
50+ council votes — most verified (exact motion text, mover/seconder, per-member breakdown) plus a rolling set of pending stubs awaiting minute verification for recent and upcoming meetings. Browse as scorecards, a matrix, or a timeline.

### 📊 Budget & Finance
General fund (~$44M FY25), $23.6M fund balance, 12 capital projects, grant awards (JAG $147,588, BVP, VAWA, Airport Infrastructure), and the Agency Funding program for nonprofits.

### 📐 Planning & County
19 entities across planning, regional bodies, arts & culture, county boards, and Scott County government — all searchable and filterable.

### 🏭 Economic Development
Major investments tracked with expandable detail and source links:
- **Nov 2025** — Toyota $204.4M hybrid expansion · 82 new jobs
- **Dec 2024** — Toyota $922M advanced paint facility · opens 2027
- **Feb 2026** — Lanes Run Business Park Phase 3 · active construction
- **Oct 2024** — Georgetown Commons · 56,585 sq. ft. grocery approved
- Triple Crown Regional Business Park · Vuteq expansion

### 📜 Ordinance Registry
40+ ordinances from 2024–2026, filterable by type. Click any row to expand a plain-English summary and link to the official PDF. Covers all corridor annexations, both adopted budgets, the Columbia Gas Franchise, and the 2025A Water & Sewer Bond.

### 🏗️ Zoning & Development
Active construction projects, recent zone change applications, 2025 P&Z Advisory Committee recommendations, and links to the GSCPC zoning map and 2024 Comprehensive Plan.

### 🗳️ Elections 2026
- **Primary: May 19, 2026** (completed) — Mayor top-2 and City Council top-16-of-18 advanced, with full vote totals indexed
- **General: November 3, 2026** · Register by October 5
- Mayor (2 advancing) and City Council (16 advancing, at-large, top 8 elected) races tracked through the general
- Interactive Scott County map — which races appear on your ballot by area
- Address lookup to estimate your ballot type (browser-only, no data stored)
- Incumbent and candidate cards link to their full profile in the Directory

### 🎓 School Board & Academic Performance
Scott County Board of Education, Superintendent Billy Parker, 9,873 students, 17 schools. Four-tab academic panel:

| Tab | Contents |
|-----|----------|
| **District Trend** | KSA reading and math by level, 2021–22 through 2024–25, with charts and KY state average |
| **By Level** | 2024–25 Proficient + Distinguished breakdown |
| **By School** | Individual results for all 9 elementary, 3 middle, and 2 high schools with FRL rates and SchoolDigger rankings |
| **Context** | Equity gap, graduation rate (~93–94%), chronic absenteeism (~25%), district rank (80th of 159 KY districts) |

### 💰 Vendor Register & Open Records
Contractor payments from council minutes, an ORR tracking log, and a plain-English guide to filing your own Open Records Request under KRS 61.870.

### 🤖 Fact-Check Agent
Paste any claim about Georgetown city government. Returns a verdict with evidence and citations from the full records index. Runs through the Cloudflare Worker's `/factcheck` proxy — no API key needed on your end.

### 📡 Live Meeting Feed
Status of the RSS data pipeline — which feeds are live, when last checked, and any new records added since your visit.

### 🔔 Meeting Alerts · 💬 Community · ℹ️ About
Subscribe to alerts by topic, submit corrections or tips, and read the project methodology.

---

## Search

Type any name, topic, date, or record number into the search bar. Results appear immediately — clicking any result navigates directly to that record:

| Result type | What happens |
|-------------|-------------|
| **Person** | Directory panel opens with their full profile drawer |
| **Vote** | Votes panel switches to timeline view, scrolls to that vote |
| **Ordinance** | Ordinances panel opens with that row expanded |
| **Meeting** | Meetings panel scrolls to that record |
| **Election** | Elections panel opens with that race accordion expanded |

**Scope filters** (next to search bar): All · People · Minutes · Votes · Ordinances · Elections · Boards

---

## Data sources

### Official government

| Source | Covers |
|--------|--------|
| georgetownky.gov/AgendaCenter | Minutes, agendas, RSS feeds |
| georgetownky.gov/DocumentCenter | Budgets, ordinances, resolutions |
| gmwss.com | Water/sewer rates, GMWSS board minutes |
| gscplanning.com | Planning Commission records |
| scottky.gov | Scott County Fiscal Court |
| scott.kyschools.us | Scott County Schools |
| scottkypva.com | Property Valuation Administrator |
| scottcountyclerk.ky.gov | County Clerk — elections, deeds |
| govote.ky.gov | Voter registration |
| reportcard.kyschools.us | KDE School Report Card |
| newkentuckyhome.ky.gov | KY Cabinet for Economic Development |

### Secondary (context only)

news-graphic.com (Georgetown News-Graphic) · wtvq.com / fox56news.com (regional TV) · usnews.com/education (school rankings)

---

## Privacy

This app runs entirely in your browser. No user data is collected, stored, or transmitted — not your name, IP address, search queries, or location. The address lookup processes your input locally and discards it immediately.

The only external requests made are: loading libraries from public CDNs (Chart.js, lunr.js), fetching live pipeline records from the Cloudflare Worker, and fact-check queries (only when you click "Check ↗") — which are sent to the Cloudflare Worker, not directly to Anthropic, so the API key never touches the browser.

---

## Accuracy & corrections

All records come from official government sources. Vote records, ordinances, and meeting summaries are verified against official minutes. Election data reflects official filings with the Scott County Clerk. School data is sourced from KDE's School Report Card and scott.kyschools.us.

Found an error? Use the **Community** panel in the app, or open a GitHub Issue with the `data-correction` label. Include the panel, the current value, the correct value, and a link to an official source. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## Deploying your own copy

The app is a static site (`index.html` + `css/` + `js/`) with no build step. Two ways to publish it:

**GitHub Pages**
1. Fork this repository
2. Go to **Settings → Pages → Deploy from branch → main → / (root)**
3. Your site is live at `https://yourusername.github.io/repository-name/`

**Cloudflare Pages/Workers** (used for the production deployment)
1. Fork this repository
2. `wrangler deploy` from the repo root — `wrangler.jsonc` serves the whole directory as static assets
3. Update the Worker URLs in `js/pipeline.js` and `js/factcheck.js` to point at your own deployed Worker (see below)

For the optional live data pipeline (RSS polling, AI summaries, fact-check proxy), see [PIPELINE.md](PIPELINE.md).

---

## Repository structure

```
/
├── index.html          ← App shell + markup (loads css/ and js/ as static assets)
├── css/style.css       ← Styles
├── js/                 ← ES modules: app.js, ui.js, search.js, charts.js,
│                          elections.js, factcheck.js, pipeline.js, logger.js, state.js
│   └── data/           ← Data files: directory, votes, meetings, ordinances,
│                          elections, water, schools
├── worker/             ← Cloudflare Worker: RSS/GMWSS/planning poller + fact-check proxy
├── routine/            ← Claude polling routine (poll.js) — offline report/apply tool
├── wrangler.jsonc      ← Cloudflare config for the main static site
├── README.md           ← This file
├── PIPELINE.md         ← Developer reference: Worker, RSS, AI, deployment
└── CONTRIBUTING.md     ← How to submit corrections and new records
```

---

## 2026 Election calendar

| Date | Event |
|------|-------|
| April 20, 2026 | Last day to register (primary) — passed |
| May 6–16, 2026 | Early voting (primary) — passed |
| ~~May 19, 2026~~ | ~~Primary Election Day~~ — complete, results indexed |
| October 5, 2026 | Last day to register (general) |
| **November 3, 2026** | **General Election Day** |

Register: [GoVote.ky.gov](https://govote.ky.gov) · Scott County Clerk: 502-863-7875

---

*Georgetown KY Records · Independent civic transparency project · Built on public records*  
*Not affiliated with any government body, candidate, or political organization*

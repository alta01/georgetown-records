# Georgetown Records — Agent Reference

## Project
Civic transparency site for Georgetown, KY. Tracks city officials, council votes, ordinances,
water utility (GMWSS), schools, and elections. Single-page app, no build step.

## File Map

| What | Where |
|------|-------|
| App entry | `index.html` |
| Styles | `css/style.css` |
| JS modules | `js/*.js` |
| **Data files** | `js/data/` |
| Officials | `js/data/directory.js` |
| Council votes | `js/data/votes.js` |
| Meetings | `js/data/meetings.js` |
| Ordinances | `js/data/ordinances.js` |
| Elections | `js/data/elections.js` |
| Water/GMWSS | `js/data/water.js` |
| Schools | `js/data/schools.js` |
| Cloudflare Worker | `worker/src/worker.js` |
| Polling script | `routine/poll.js` |

## Git Workflow
- **This is a solo project. Commit and push directly to `main`. Never create branches or PRs.**
- After committing: `git push origin main`
- Commit message format: `Weekly update YYYY-MM-DD: <one-line summary>`
- Stage only files you actually changed. Never `git add -A`.

## In-Scope for Routine Sessions
- Editing data files in `js/data/`
- Updating hardcoded counts/dates in `index.html` to match data
- Adding `// TODO:` comments to flag stale data that needs a live source
- Flagging officials with `needsVerification: true` if role may have changed

## Out of Scope for Routine Sessions
- Running `npm run poll` or any network-fetching scripts
- Editing JS logic, CSS, or HTML structure
- Adding new features, panels, or abstractions
- Modifying the Worker, wrangler config, or infrastructure

## Output Protocol
At end of each routine session, create **two Gmail drafts** using the Gmail MCP tool.
Subject lines and body format are specified in the routine prompt.
Do not send — draft only.

## Key Data Conventions
- Vote objects (`votes.js`): `id`, `date` (e.g. `'Nov 24 2025'`), `yr`, `motion`, `mover`, `seconder`,
  `result`, `topic`, `type`, `sig` (plain-English significance), `votes` (per-member `Y`/`N`/`A`/`—` map),
  `note` (optional), `confidence` (set to `'pending'` for stub records awaiting minute verification;
  most verified votes simply omit the field rather than setting it to `'verified'`, though either is fine)
- Vote `date`/`yr` should correspond to a real council meeting; add a stub to `meetings.js` if one doesn't exist yet
- Ordinance objects (`ordinances.js`): `num`, `year`, `title`, `type`, `url`, `summary`
- Election candidate objects (`elections.js`): `name`, `status`, `incumbent`, `memberName`, `deptName`, `av`, `ini`, `photo`, `notes`
- Officials with unconfirmed current roles: add `needsVerification: true`

## Data Sources (manual lookup — no scraping in routine)
- City votes/minutes: georgetownky.gov/AgendaCenter
- Ordinances: georgetownky.gov/DocumentCenter
- Planning Commission: gscplanning.com/meetingrecords
- GMWSS rates: gmwss.com/rates.htm
- GMWSS board minutes: gmwss.com (3rd Tuesday monthly)
- School data: KDE School Report Card (reportcard.kyschools.us)
- Elections: Scott County Clerk (scottcountyclerk.ky.gov), GoVote.ky.gov

A live pipeline (Cloudflare Worker, see `PIPELINE.md`) already polls RSS feeds,
GMWSS, and the Planning Commission automatically — these manual sources are
for cross-checking and filling gaps the pipeline can't reach (vote details,
ordinance summaries, school/election data).

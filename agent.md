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
- Dates: `'YYYY-MM-DD'` strings
- Confidence: `'verified'` | `'pending'` | `'estimated'`
- All vote objects reference a meeting date that must exist in `meetings.js`
- Ordinance objects require: `id`, `title`, `date`, `status`, and either `url` or `sourceNote`
- Election candidate objects require: `name`, `office`, `party`, `filingStatus`
- Officials with unconfirmed current roles: add `needsVerification: true`

## Data Sources (manual lookup — no scraping in routine)
- City votes/minutes: georgetownky.gov/AgendaCenter
- Ordinances: georgetownky.gov/DocumentCenter
- GMWSS rates: gmwss.com/rates.htm
- GMWSS board minutes: gmwss.com (3rd Tuesday monthly)
- School data: KDE Report Card (kde.ky.gov)
- Elections: Scott County Clerk, Kentucky SOS

# Contributing to Georgetown KY Public Records

Thank you for helping keep Georgetown's public record index accurate and complete.

---

## Types of Contributions

### Data Corrections
If you find an error in a vote record, ordinance summary, official's name or title, or any other factual content, please submit it via the **Community feedback form** in the app (Community panel) or open a GitHub Issue with the label `data-correction`.

Include:
- The panel and record where the error appears
- What the current value says
- What the correct value is
- A link to an official source confirming the correction (georgetownky.gov, scottky.gov, or other official source)

### New Records
For events, votes, or ordinances not yet indexed, open a GitHub Issue labeled `new-record` with:
- The type of record (vote / ordinance / meeting / person)
- The official source URL
- The date

### Open Records Requests
The app maintains an ORR (Open Records Request) log in the Vendors panel. If you file an ORR with Georgetown City or Scott County government and want it tracked, open an Issue labeled `orr` with the request date, subject, and agency.

---

## Data Standards

All data in this index must come from official government sources:

1. **Tier 1 — Official primary:** georgetownky.gov, scottky.gov, gscplanning.com, scottkypva.com, gscrevenueky.gov
2. **Tier 2 — Official secondary:** KDE School Report Card (reportcard.kyschools.us), Scott County Clerk filings
3. **Tier 3 — Verified news:** Georgetown News-Graphic for supplemental context only

**Not accepted:** social media, unverified blogs, secondhand accounts.

---

## Updating the App

The entire app is `index.html` — a single self-contained file. To contribute code:

1. Fork the repository
2. Edit `index.html` directly
3. Test locally by opening in a browser (`file://` is fine for most features)
4. Open a Pull Request with a clear description of what changed and why

For pipeline/Worker changes, see [PIPELINE.md](PIPELINE.md).

---

## Code of Conduct

This project covers public officials and public records. All contributions must:
- Be factual and sourced
- Treat all public officials with baseline respect while fairly representing their public actions
- Not include personal information beyond what is in official public records

---

*Georgetown KY Public Records Index — open source civic transparency project*

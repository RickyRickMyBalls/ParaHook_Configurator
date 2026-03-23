# ParaHook Docs

## Doc Header

### Doc History
3. 2026-03-23 17:39: Updated the live MkDocs landing page for the shipped GitHub Pages hosting pass, recording that the existing repo Pages deployment now keeps the app at the site root while publishing this docs site under `/docs/` through the same combined artifact
2. 2026-03-23 17:11: Updated the live MkDocs landing page for the new dark-by-default site theme, noting that the docs now open in Material's `slate` palette while keeping a header toggle for switching back to light mode
1. 2026-03-23 14:17: Reworked the MkDocs landing page for the Phase 2 live-site state, adding explicit notes about inferred navigation, excluded folders, auto-publishing rules for new docs, and the main repo doc surfaces that matter when maintaining the published docs tree

### Purpose

This is the live MkDocs landing page for ParaHook.

Use it to understand:
- what the published docs site currently includes
- how the docs are hosted alongside the app on GitHub Pages
- how new docs appear in MkDocs
- which folders stay out of the published site
- where to start when navigating the repo docs

### Important Note

- the site now publishes the non-excluded `/docs` tree rather than the earlier tiny Phase 1 starter nav
- the published sidebar is inferred from folder structure because `mkdocs.yml` does not currently define a manual `nav:` block
- on GitHub Pages, the existing repo deployment keeps the app at the site root and serves this docs site under `/docs/`

## Doc Body

### Start Here

- open [MkDocs Plan](Phase-Plans/mkDocs.md) for the docs-site setup and maintenance rules
- open [Doc Index](Doc-Index.md) for the canonical docs map and repo documentation rules
- open [CHANGELOG](CHANGELOG.md) for shipped implementation history
- open [Doc Log](Doc-Log.md) for document-change history

### Current Live Behavior

- the left sidebar publishes the non-excluded `/docs` tree
- the current page heading tree stays in the standard right-side table of contents
- the site now opens in dark mode by default and keeps a header toggle for switching to light mode
- new docs under included folders appear automatically because navigation is inferred from the docs folder structure
- the existing GitHub Pages workflow publishes one combined artifact, keeping the app at the Pages root while serving this MkDocs site from `/docs/`

### GitHub Pages Hosting

- the repo does not use a second standalone Pages site for MkDocs
- the existing Pages workflow builds the app root first, then builds MkDocs separately and copies the docs output into `dist/docs/`
- on the live project site, the app stays at `https://rickyrickmyballs.github.io/ParaHook_Configurator/`
- on the live project site, the docs are served from `https://rickyrickmyballs.github.io/ParaHook_Configurator/docs/`

### Excluded From Publication

The current MkDocs config excludes these docs branches from the published site:

- `Archive/`
- `Human-Plans/roadmap/archive/`
- `Phase-Plans/Tasks/Archive/`

### Updating MkDocs

When you add a new doc under `docs/`:

- it will appear automatically if it is outside the excluded folders
- it does not need a matching `mkdocs.yml` nav entry while navigation stays inferred
- it should still follow the repo docs rules such as local `Doc History` and `docs/Doc-Log.md`

When you want different docs-site behavior:

- update `mkdocs.yml` if a docs branch should be excluded
- update `mkdocs.yml` if the site later needs a manual `nav:` order
- update umbrella docs or the landing page when the published docs surface changes enough that readers need clearer entry points

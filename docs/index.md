# ParaHook Docs

## Doc Header

### Doc History
4. 2026-03-23 17:57: Reworked the MkDocs landing page into a more readable home screen with grouped quick-link cards and browse-by-area links, so the docs site now has clearer entry points into the main repo doc surfaces without changing the underlying inferred navigation rules
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

This landing page is the shortest route into the parts of the published docs tree that matter most day to day.

### Quick Start

<div class="grid cards" markdown>

- __Doc Index__

  ---

  Canonical docs map plus the repo's documentation-structure rules.

  [Open Doc Index](Doc-Index.md)

- __MkDocs Plan__

  ---

  Setup, maintenance, and GitHub Pages hosting notes for this docs site.

  [Open MkDocs Plan](Phase-Plans/mkDocs.md)

- __CHANGELOG__

  ---

  Permanent shipped implementation history for the repo.

  [Open CHANGELOG](CHANGELOG.md)

- __Doc Log__

  ---

  Document-change history and docs-maintenance record.

  [Open Doc Log](Doc-Log.md)

</div>

### Browse By Area

<div class="grid cards" markdown>

- __Roadmap__

  ---

  High-level project direction, active lanes, and longer-term sequencing.

  [Open Roadmap](Human-Plans/roadmap/roadmap.md)

- __System Map__

  ---

  Broad architecture orientation for the major ParaHook systems.

  [Open System Map](Human-Plans/Architecture/System-Map.md)

- __Phase Setup__

  ---

  Source-of-truth rules for phase prefixes, family docs, and task lifecycle.

  [Open Phase Setup](Phase-Plans/00_Phase-Setup.md)

- __Bug Reports__

  ---

  Tracked regressions and focused bug notes that are still worth watching.

  [Open Bug Reports](Bugs/0_Bug_Report.md)

</div>

### Common Routes

- [Decisions](Human-Plans/Decisions.MD)
- [Engine Architecture](Human-Plans/Architecture/Engine-Architecture.md)
- [Architecture Glossary](Human-Plans/Architecture/Glossary.md)
- [DOC Phase Family](Phase-Plans/14_DOC%20-%20Phase-Plans.md)
- [Spaghetti Node Index](Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md)

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

### Publishing Rules

What auto-publishes:

- new docs under included folders appear automatically because navigation is inferred from the docs folder structure
- new docs do not need a matching `mkdocs.yml` nav entry while navigation stays inferred

What stays out of the published site:

- `Archive/`
- `Human-Plans/roadmap/archive/`
- `Phase-Plans/Tasks/Archive/`

When you want different docs-site behavior:

- update `mkdocs.yml` if a docs branch should be excluded
- update `mkdocs.yml` if the site later needs a manual `nav:` order
- update umbrella docs or the landing page when the published docs surface changes enough that readers need clearer entry points

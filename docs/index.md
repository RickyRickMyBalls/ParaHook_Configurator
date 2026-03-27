# ParaHook Docs

## Doc Header

### Doc History
6. 2026-03-27 10:35: Reworked the hosted docs homepage into a denser launch surface with larger grouped link sections, added a curated top-level MkDocs nav for the highest-value public entry points, and aligned the publishing notes with the current hybrid navigation plus excluded-folder rules
5. 2026-03-27 10:00: Updated the live MkDocs landing page after excluding `docs/Human-Plans/CodexNotes/` from the published site, so the hosted `/docs/` tree now matches the intended live docs surface instead of continuing to publish the older scratch-note folder
4. 2026-03-23 17:57: Reworked the MkDocs landing page into a more readable home screen with grouped quick-link cards and browse-by-area links, so the docs site now has clearer entry points into the main repo doc surfaces without changing the underlying inferred navigation rules
3. 2026-03-23 17:39: Updated the live MkDocs landing page for the shipped GitHub Pages hosting pass, recording that the existing repo Pages deployment now keeps the app at the site root while publishing this docs site under `/docs/` through the same combined artifact
2. 2026-03-23 17:11: Updated the live MkDocs landing page for the new dark-by-default site theme, noting that the docs now open in Material's `slate` palette while keeping a header toggle for switching back to light mode
1. 2026-03-23 14:17: Reworked the MkDocs landing page for the Phase 2 live-site state, adding explicit notes about inferred navigation, excluded folders, auto-publishing rules for new docs, and the main repo doc surfaces that matter when maintaining the published docs tree

### Purpose

This is the hosted documentation front door for ParaHook.

Use it to:
- get oriented quickly
- jump into the main architecture and planning hubs
- reach the most useful docs without depending on sidebar browsing alone

### Important Note

- the hosted docs now use a hybrid navigation model:
  - curated top-level nav for the highest-value entry points
  - linked hub pages for deeper exploration
- on GitHub Pages, the app lives at the site root and this docs site lives under `/docs/`

## Doc Body

This page is meant to feel like a launcher, not a raw repo dump.

### Start Here

<div class="grid cards" markdown>

- __Doc Index__

  ---

  Canonical docs map plus the repo's documentation-structure rules.

  [Open Doc Index](Doc-Index.md)

- __Roadmap__

  ---

  Main project direction, active lanes, and longer-term sequencing.

  [Open Roadmap](Human-Plans/roadmap/roadmap.md)

- __System Map__

  ---

  Broad architecture orientation for the major ParaHook systems.

  [Open System Map](Human-Plans/Architecture/System-Map.md)

- __CHANGELOG__

  ---

  Permanent shipped implementation history for the repo.

  [Open CHANGELOG](CHANGELOG.md)

- __Doc Log__

  ---

  Document-change history and docs-maintenance record.

  [Open Doc Log](Doc-Log.md)

</div>

### Architecture Hubs

<div class="grid cards" markdown>

- __Browser__

  ---

  Browser architecture, shipped cleanup ladder, and open follow-ons.

  [Open Browser](Human-Plans/Architecture/Browser/Browser-Index.md)

- __Console__

  ---

  Console command architecture, staged grammar, and workspace command flow.

  [Open Console](Human-Plans/Architecture/Console/Console.md)

- __Spaghetti Editor__

  ---

  Main Spaghetti workspace explanation and umbrella editor direction.

  [Open Spaghetti Editor](Human-Plans/Architecture/Spaghetti-Editor-Arch/Spaghetti-Editor-Explained.md)

- __Nodes__

  ---

  Shared node-family entry point for sketch, extrude, and graph growth.

  [Open Nodes](Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md)

- __Transform__

  ---

  Shared transform-family architecture, history, and follow-ons.

  [Open Transform](Human-Plans/Architecture/Transform/transform-index.md)

- __Worker__

  ---

  Graph-native worker architecture and shipped cutover history.

  [Open Worker](Human-Plans/Architecture/Worker/Worker.md)

- __Layers__

  ---

  Layer architecture direction and the current future execution ladder.

  [Open Layers](Human-Plans/Architecture/Layers/Layers.md)

- __Export__

  ---

  Export family entry point for the toolbar and format surface direction.

  [Open Export](Human-Plans/Architecture/Export/Export-Index.md)

</div>

### Planning Hubs

<div class="grid cards" markdown>

- __Phase Setup__

  ---

  Source-of-truth rules for phase prefixes, family docs, and task lifecycle.

  [Open Phase Setup](Phase-Plans/00_Phase-Setup.md)

- __Architecture Roadmap__

  ---

  Cross-family status tracker for the main architecture ladders.

  [Open Architecture Roadmap](Human-Plans/roadmap/Architecture-roadmap.md)

- __MkDocs Plan__

  ---

  Setup, maintenance, nav strategy, and GitHub Pages hosting notes for this docs site.

  [Open MkDocs Plan](Phase-Plans/mkDocs.md)

- __Bug Report__

  ---

  Tracked regressions and focused bug notes that are still worth watching.

  [Open Bug Report](Bugs/0_Bug_Report.md)

- __Decisions__

  ---

  Consolidated product and structure decisions carried forward from planning.

  [Open Decisions](Human-Plans/Decisions.MD)

- __Wishlist__

  ---

  Long-range product ideas and later feature directions.

  [Open Wishlist](Human-Plans/Wish-Features/WISHLIST.md)

</div>

### Popular Deep Links

<div class="grid cards" markdown>

- __Sketch__

  ---

  Current sketch-family architecture and execution ladder.

  [Open Sketch](Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md)

- __Extrude__

  ---

  Extrude-family index and transform-aware follow-on direction.

  [Open Extrude](Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/extrude-index.md)

- __Camera Controls__

  ---

  Camera/input ownership family and the current open follow-on.

  [Open Camera Controls](Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md)

- __View Toolbar__

  ---

  Shared view-command family for projection and later view-state surfaces.

  [Open View Toolbar](Human-Plans/Architecture/View-Toolbar/View-Toolbar-Index.md)

- __Pasta Path__

  ---

  History and timeline concept umbrella for the wider graph workflow.

  [Open Pasta Path](Human-Plans/Architecture/Pasta-Path/Pasta-Path-Index.md)

- __Engine Architecture__

  ---

  Broader engine/system architecture companion to the system map.

  [Open Engine Architecture](Human-Plans/Architecture/Engine-Architecture.md)

- __Glossary__

  ---

  Shared project terminology for architecture and planning docs.

  [Open Glossary](Human-Plans/Architecture/Glossary.md)

- __Master Spaghetti__

  ---

  Umbrella entry point for the broader Spaghetti editor family.

  [Open Master Spaghetti](Human-Plans/Architecture/Spaghetti-Editor-Arch/master%20spaghetti-index.md)

</div>

### Quick Routes

- [Doc Index](Doc-Index.md)
- [Main Roadmap](Human-Plans/roadmap/roadmap.md)
- [Architecture Roadmap](Human-Plans/roadmap/Architecture-roadmap.md)
- [Vision Roadmap](Human-Plans/roadmap/Vision-roadmap.md)
- [Nodes Index](Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md)
- [System Map](Human-Plans/Architecture/System-Map.md)
- [Bug Report](Bugs/0_Bug_Report.md)
- [DOC Phase Family](Phase-Plans/14_DOC%20-%20Phase-Plans.md)

### Publishing Notes

- the docs site uses one GitHub Pages deployment shared with the app
- the app stays at:
  - `https://rickyrickmyballs.github.io/ParaHook_Configurator/`
- the docs stay at:
  - `https://rickyrickmyballs.github.io/ParaHook_Configurator/docs/`
- the top-level nav is curated for the main entry points
- deeper docs still publish under the included `/docs` tree even when they are not promoted into the top nav

What stays out of the hosted docs site:

- `Archive/`
- `Human-Plans/CodexNotes/`
- `Human-Plans/roadmap/archive/`
- `Phase-Plans/Tasks/Archive/`

When you want different hosted behavior:

- update `mkdocs.yml` if a docs branch should be excluded or promoted into the curated nav
- update this landing page when a new architecture or planning hub deserves homepage visibility

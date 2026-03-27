# mkDocs

## Doc Header

### Doc History
16. 2026-03-27 12:20: Removed the temporary manual top-level `mkdocs.yml` nav and returned the hosted site to inferred navigation so new included folders publish into the sidebar automatically again, keeping the homepage as the curated launch surface while the left nav follows the docs tree
15. 2026-03-27 10:35: Reworked the live MkDocs strategy again by adding a hybrid manual top-level nav in `mkdocs.yml`, rewriting `docs/index.md` into a denser homepage launcher with many curated links, and tightening the MkDocs plan notes so the published-site guidance now matches the current mixed-audience front-door model
14. 2026-03-27 10:10: Clarified the GitHub Pages hosting note so this doc now explicitly states that the repo uses one Pages workflow and one deployed artifact that serves two live paths, with the app at `/` and MkDocs at `/docs/`, instead of sounding like there are two competing Pages deployments
13. 2026-03-23 17:39: Implemented `Phase 3 - GitHub Pages Combined App And Docs Publish` by extending the existing repo Pages workflow to build both the app and MkDocs into one artifact, adding the nested docs `site_url`, and recording the live `/` plus `/docs/` hosting behavior in the MkDocs notes
12. 2026-03-23 17:18: Added `Phase 3 - GitHub Pages Combined App And Docs Publish` so the MkDocs note now covers same-repo GitHub Pages hosting without replacing the existing app site, locking the one-artifact `/` plus `/docs/` publish model against the current `deploy-pages.yml` workflow
11. 2026-03-23 17:11: Added the live dark-mode theme pass to the MkDocs planning note, recording that the published docs site now starts in Material's `slate` palette with a visible light-mode toggle instead of staying light-only
10. 2026-03-23 14:17: Implemented the first live `Phase 2` MkDocs upkeep pass by adding Material navigation usability features in `mkdocs.yml`, rewriting `docs/index.md` to match the real inferred-nav publish model, and marking the Phase 2 completion checklist complete for the shipped published-docs maintenance baseline
9. 2026-03-23 14:11: Added `Phase 2 - MkDocs Update And Published-Docs Maintenance` so the planning note now covers follow-on live-site upkeep after the baseline setup, including when new docs auto-publish, when `exclude_docs` or manual nav changes are needed, and which repo docs should stay in sync during docs-site updates
8. 2026-03-21 13:11: Moved the live current-page heading tree back to the standard right-side table of contents by removing `toc.integrate` from the MkDocs theme config
7. 2026-03-21 13:06: Expanded the live MkDocs nav to publish the full `/docs` tree except `Archive/`, replacing the earlier tiny hand-curated nav with inferred folder navigation
6. 2026-03-21 12:35: Marked `Phase 1 - MkDocs Baseline Setup` complete after adding the live MkDocs config, the docs landing page, the docs dependency file, and successful local build verification
5. 2026-03-21 12:33: Tightened `Phase 1 - MkDocs Baseline Setup` into an implementation-ready execution spec with locked decisions, exact files, commands, and a smaller first-pass config baseline
4. 2026-03-21 12:25: Added a final `Phases` section that keeps the MkDocs adoption task as one bounded setup phase with explicit out-of-scope follow-ons
3. 2026-03-21 12:23: Added the section-tree and navigation decision notes, including the current-page heading tree options and the limits of native collapsibility
2. 2026-03-21 12:18: Added a Material for MkDocs starter config block plus setup notes for assets, plugins, and the current `tags_file` deprecation
1. 2026-03-21 12:15: Created this file as a simple planning note for adding an MkDocs documentation site to the repo

### Purpose

This file is a simple planning note for a possible MkDocs documentation layer in `/20/parahook`.

Use this file for:
- a plain-language explanation of what MkDocs adds
- the minimum files and commands needed to start
- repo-fit notes before introducing a live MkDocs config file
- future setup questions if this repo decides to publish docs as a static site

Do not use this file for:
- shipped runtime behavior
- permanent phase-family history
- replacing `docs/Doc-Index.md` as the repo docs map
- replacing `README.md` as the top-level developer entry point

## Doc Body

### What MkDocs Is

`MkDocs` is a static-site generator for Markdown documentation.

It reads:
- a config file, most commonly `mkdocs.yml`
- a docs-content folder, usually `docs/`

It then produces:
- a local preview server with `mkdocs serve`
- a static site build with `mkdocs build`

### Minimum Setup

Typical first-pass setup:

1. install Python
2. install MkDocs with `pip install mkdocs`
3. add a config file at the repo root
4. point the config at the docs folder you want to publish
5. run `mkdocs serve` during authoring

Minimal config example:

```yaml
site_name: ParaHook Docs
docs_dir: docs
nav:
  - Home: index.md
```

### Config Filename Note

The common default config filename is `mkdocs.yml`.

If this repo chooses to use `mkdocs.yaml` instead, MkDocs can still use it, but the commands should point at that file explicitly:

- `mkdocs serve -f mkdocs.yaml`
- `mkdocs build -f mkdocs.yaml`

### Repo Fit Notes

This repo already has a large `docs/` tree, but much of it is internal planning and process documentation rather than public-facing product docs.

Before adding a live MkDocs site, decide whether the site should:
- publish the existing `docs/` tree directly
- publish only a curated subset of `docs/`
- use a separate docs-site folder so internal planning notes stay private

### Suggested First Cut

If the repo decides to adopt MkDocs later, the smallest sensible first cut is:

1. add `mkdocs.yml` at the repo root
2. add one small public landing page such as `docs/index.md`
3. keep internal planning docs out of the initial nav unless they are intentionally public
4. confirm whether the base MkDocs theme is enough before adding `mkdocs-material`

### Material Starter Config Candidate

Yes. This is a reasonable Material for MkDocs starter block for the planning doc.

Candidate config:

```yaml
theme:
  name: material
  favicon: assets/head-fi-favicon.png
  logo: assets/head-fi-logo.png
  features:
    - toc.follow
    # use this if the current page heading tree should appear in the left sidebar
    - toc.integrate
    # optional: expand the left nav tree by default
    # - navigation.expand
  palette:
    - media: "(prefers-color-scheme)"
      toggle:
        icon: material/brightness-auto
        name: Switch to light mode
    - media: "(prefers-color-scheme: light)"
      scheme: default
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      toggle:
        icon: material/brightness-4
        name: Switch to system preference

markdown_extensions:
  - abbr
  - admonition
  - attr_list
  - def_list
  - footnotes
  - md_in_html
  - smarty
  - toc:
      permalink: true
  - pymdownx.arithmatex:
      generic: true
  - pymdownx.betterem:
      smart_enable: all
  - pymdownx.caret
  - pymdownx.details
  - pymdownx.emoji:
      emoji_index: !!python/name:material.extensions.emoji.twemoji
      emoji_generator: !!python/name:material.extensions.emoji.to_svg
  - pymdownx.highlight
  - pymdownx.inlinehilite
  - pymdownx.keys
  - pymdownx.mark
  - pymdownx.smartsymbols
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.tasklist:
      custom_checkbox: true
  - pymdownx.tilde

plugins:
  - offline
  - privacy
  - search
  - tags
```

### Notes For This Candidate

- This block assumes the repo uses `mkdocs-material`, not base MkDocs only.
- The `favicon` and `logo` paths imply that the published docs content includes `assets/head-fi-favicon.png` and `assets/head-fi-logo.png`.
- The `offline`, `privacy`, `search`, and `tags` plugins are built into Material for MkDocs rather than separate third-party plugin installs.
- The listed `pymdownx.*` extensions are a common Material-friendly Markdown stack and fit a docs site with tabs, callouts, task lists, and richer code presentation.
- `toc.follow` keeps the active heading visible while reading a long page.
- `toc.integrate` moves the current page heading tree into the left sidebar instead of leaving it in the usual page table-of-contents area.
- `navigation.expand` is optional and controls whether left-nav sections start open by default.

### Section Tree Decision

This repo does not need editor-style Markdown folding in the browser.

Current decision:
- keep normal Markdown headings
- do not require per-doc HTML wrappers just to create collapsible sections
- rely on Material's built-in heading tree for section jumping

Practical result:
- each page can expose its own heading tree
- readers can jump to `##`, `###`, and deeper headings with anchor links
- the tree can live on the right in the normal table of contents area, or on the left with `toc.integrate`

### Tree Behavior Limits

What Material supports natively:
- collapsible site navigation sections in the left sidebar
- a current-page heading tree
- automatic scroll-following for the active heading

What Material does not natively provide:
- true VS Code-style folding on every heading
- custom collapse modes such as "open all `##` but collapse all `###`"
- a giant site-wide tree of every heading from every page at once

### Current Recommendation

For the first real site pass:

```yaml
theme:
  name: material
  features:
    - toc.follow
    - toc.integrate
```

This gives the current page a clickable heading tree without adding HTML to every doc.

### Tags Note

The original friend-sent block used:

```yaml
plugins:
  - tags:
      tags_file: tags.md
```

For current Material for MkDocs versions, `tags_file` is deprecated.

Planning rule for this repo:
- start with plain `- tags`
- only add a dedicated tags index page later if the docs set grows enough to justify it

### Open Questions

- When Phase 2 or later expands the site, which additional docs should move into the published nav first?
- Should ParaHook-specific branding assets be added later, or should the site stay asset-light?
- Should later phases add `tags`, `offline`, or `privacy` after the baseline nav settles?
- After real usage, should the heading tree stay integrated on the left with `toc.integrate`, or move back to the standard page TOC position?

### Live Nav Note

The current live site no longer uses either:
- the tiny two-page hand-written nav from the first baseline pass
- or a fully raw inferred top-level nav with no curation

Current live behavior:
- MkDocs infers navigation from the included `/docs` tree again
- the homepage remains a denser launch surface with many grouped links into architecture and planning hubs
- deeper docs publish normally under the included `/docs` tree without needing a manual nav entry
- archive folders are excluded from the published site
- `Human-Plans/CodexNotes/` is excluded from the published site
- the left sidebar exposes the non-archive docs tree directly instead of forcing search or a tiny starter nav
- the site starts in Material's `slate` dark palette by default and exposes a header toggle for switching back to light mode
- the current page heading tree uses the standard right-side table of contents

This is the current compromise:
- hand-curate only the top layer and the biggest hub pages
- do not hand-maintain the entire docs tree
- let the homepage and family index docs do most of the deeper navigation work

## Phases

The initial adoption fit in `1` baseline phase, and the live site now has two follow-on lanes: ongoing `Phase 2` published-docs maintenance plus the now-shipped `Phase 3` same-repo GitHub Pages hosting pass that preserves the current app deploy.

### Phase 1 - `MkDocs Baseline Setup`

Goal:
- create the first working MkDocs site for the repo
- use `mkdocs-material`
- enable the current-page heading tree
- prove local serve/build works

In scope:
- add the root `mkdocs.yml` or `mkdocs.yaml`
- install and document the required MkDocs packages
- choose the first published docs surface
- add the Material theme baseline
- enable `toc.follow` and optionally `toc.integrate`
- make sure local navigation and section jumping work
- add any required starter assets only if they are truly needed for the first pass

Out of scope for this one phase:
- full docs-tree curation across the whole repo
- custom JavaScript/CSS folding behavior
- complicated tagging taxonomy
- deployment hosting setup
- polished ParaHook branding pass
- large-scale rewriting of existing docs for public presentation

Why `1` phase is safe:
- the first meaningful milestone is simply "the docs site runs and the current page has usable navigation"
- everything beyond that is enhancement work, not a prerequisite for first adoption

#### Phase 1 Locked Decisions

To make this phase implementation ready, lock these decisions now:

- use `mkdocs.yml` at the repo root
- use `mkdocs-material` as the package and theme baseline
- keep `docs/` as the source docs directory
- publish a curated first nav, not the whole docs tree
- use a minimal first-pass config rather than the full richer candidate block above
- do not require `favicon` or `logo` assets in Phase 1
- use the current-page heading tree with `toc.follow` and `toc.integrate`
- keep `navigation.expand` off at first unless the first local pass proves the nav feels too collapsed
- keep the tags system out of the required Phase 1 success path

#### Phase 1 Files

Files that should exist by the end of this phase:

- `mkdocs.yml`
- `docs/index.md`
- the already-planned `docs/Phase-Plans/mkDocs.md` page in nav

Phase 1 may also add:

- `requirements-docs.txt`

Use `requirements-docs.txt` only if the repo wants a committed docs dependency surface. Otherwise, a short install note in the planning doc is enough for the first pass.

#### Phase 1 Commands

Recommended first-pass install:

```bash
python -m pip install mkdocs-material
```

Recommended local run:

```bash
mkdocs serve
```

Recommended verification build:

```bash
mkdocs build
```

#### Phase 1 Exact Config Baseline

This is the implementation-ready starting point for Phase 1:

```yaml
site_name: ParaHook Docs
docs_dir: docs

nav:
  - Home: index.md
  - Phase Plans:
      - MkDocs Plan: Phase-Plans/mkDocs.md

theme:
  name: material
  features:
    - toc.follow
    - toc.integrate

markdown_extensions:
  - admonition
  - attr_list
  - md_in_html
  - toc:
      permalink: true
  - pymdownx.details
  - pymdownx.highlight
  - pymdownx.inlinehilite
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.tasklist:
      custom_checkbox: true

plugins:
  - search
```

Why this is the Phase 1 baseline instead of the richer candidate:
- it proves the site pipeline first
- it avoids blocking on branding assets
- it avoids plugin/config surface the repo is not ready to use yet
- it still preserves the heading-tree behavior you wanted

#### Phase 1 Content Rule

The first published docs surface should stay intentionally small:

- `docs/index.md` should act as a short docs landing page
- `docs/Phase-Plans/mkDocs.md` should be the first real long-form test page
- do not publish the entire current `/docs` tree in Phase 1 nav

This keeps the first serve/build/debug loop small and avoids forcing immediate public-facing cleanup of all existing planning docs.

#### Phase 1 Verification Steps

1. install `mkdocs-material`
2. create `mkdocs.yml` with the exact baseline config above
3. create `docs/index.md`
4. run `mkdocs serve`
5. open the local site
6. confirm `Home` and `MkDocs Plan` appear in nav
7. open `MkDocs Plan`
8. confirm the current-page heading tree is visible
9. click several section links and confirm the page jumps correctly
10. run `mkdocs build`
11. confirm the static build completes without errors

#### Phase 1 Completion Check

- [x] root `mkdocs.yml` exists
- [x] `mkdocs-material` install path is documented
- [x] `docs/index.md` exists
- [x] `docs/Phase-Plans/mkDocs.md` is reachable from nav
- [x] the site serves locally
- [x] the site builds successfully
- [x] the current page heading tree is visible in the chosen TOC position
- [x] section links jump correctly inside a page
- [x] no Phase 1 step depends on branding assets, deployment setup, or custom folding code

If this grows during implementation, split later follow-on work into separate post-setup phases instead of bloating Phase 1.

### Phase 2 - `MkDocs Update And Published-Docs Maintenance`

Goal:
- keep the live docs site aligned with the real `/docs` tree as new docs are created, moved, renamed, or retired
- make published-versus-internal visibility decisions explicit instead of relying on accidental folder placement
- keep the MkDocs site readable as the repo docs set grows beyond the first baseline

In scope:
- update `mkdocs.yml` when the published docs surface needs a new `exclude_docs` rule, theme tweak, plugin change, or later manual `nav` curation
- decide whether a newly added doc should auto-publish through inferred nav or stay hidden behind an excluded path
- refresh the landing page or related umbrella docs when the published docs surface materially changes
- keep repo doc-maintenance surfaces aligned when MkDocs-facing docs are added or reorganized
- run local docs-site verification after any meaningful MkDocs config or published-surface update

Out of scope for this phase:
- full public-docs rewrite of the internal planning tree
- deployment hosting or CI publish automation
- custom JavaScript sidebar behavior or non-native folding systems
- a full branding redesign beyond small practical theme/config updates

Why Phase 2 exists:
- the live site now infers nav from the real `/docs` tree instead of a tiny hand-curated starter nav
- that makes new docs easier to publish, but it also means docs placement and exclusion rules now directly shape the published site
- the repo already has separate doc-maintenance rules, so MkDocs upkeep should explicitly name which files stay in sync

#### Phase 2 Locked Decisions

- keep `docs/` as the MkDocs source directory
- keep inferred navigation as the default so new included docs and folders appear automatically
- keep the homepage as the main curated launch surface
- treat new docs under non-excluded folders as auto-published by default
- use `exclude_docs` first when a docs branch should stay out of the published site
- update repo tracking docs and local doc-history sections separately from MkDocs config; publication and repo-history maintenance are related but not the same task

#### Phase 2 Files

Files that may be touched during this phase:

- `mkdocs.yml`
- `docs/index.md`
- `docs/Phase-Plans/mkDocs.md`
- `docs/Doc-Index.md`
- `docs/Doc-Log.md`

Depending on the docs change, the phase may also touch:

- the new or moved doc that is being published
- umbrella/index docs for the affected docs family

#### Phase 2 Update Rule

When a new doc is added under `docs/`:

- it will still publish in the MkDocs site automatically if it lives outside the excluded folders
- it does not need a matching `mkdocs.yml` nav entry while navigation stays inferred
- it does need normal repo doc maintenance such as local `Doc History`, `docs/Doc-Log.md`, and any affected canonical docs-map or umbrella-doc updates

When the docs-site behavior should change:

- update `mkdocs.yml` if the doc should be excluded or surfaced with different theme/plugin behavior

#### Phase 2 Verification Steps

1. add, move, rename, or revise the target doc
2. update any required repo doc-maintenance files such as `docs/Doc-Log.md` and affected umbrella/index docs
3. if publication behavior changes, update `mkdocs.yml`
4. run `mkdocs serve` or `mkdocs build`
5. confirm the doc appears or stays hidden as intended
6. confirm sidebar placement and page links still behave acceptably
7. confirm the build completes without errors

#### Phase 2 Completion Check

- [x] the intended docs change is reflected in the published MkDocs site behavior
- [x] any required `exclude_docs` or later `nav:` updates are applied
- [x] affected docs keep their local `Doc History` state aligned
- [x] `docs/Doc-Log.md` records the doc-side change
- [x] `docs/Doc-Index.md` or other umbrella docs are updated when the docs map or canonical structure changed
- [x] `mkdocs build` completes successfully after the update

### Phase 3 - `GitHub Pages Combined App And Docs Publish`

Goal:
- publish the MkDocs site through GitHub Pages from this same repository without replacing the existing app site
- keep the current web app at the site root and publish the docs site under `/docs/`
- extend the existing Pages automation rather than creating a second competing Pages deploy

Important clarification:
- this repo uses one GitHub Pages deployment workflow, not two separate Pages deployments
- the single deployed artifact serves two live URL paths:
  - app:
    - `/`
  - docs:
    - `/docs/`
- in other words:
  - one Pages site
  - one uploaded artifact
  - two served sections inside that site

In scope:
- update the current `.github/workflows/deploy-pages.yml` workflow so it builds both the app and the MkDocs site in one job set
- keep `npm run build` producing the app `dist/` output at the publish root
- install Python plus `requirements-docs.txt` in the Pages workflow and run `mkdocs build --site-dir site`
- copy the built MkDocs output into `dist/docs/` before the Pages artifact upload
- add the MkDocs `site_url` setting for the nested docs publish path
- refresh the docs landing page and MkDocs planning note if the published docs access path or hosting behavior becomes part of the live guidance
- verify that the app root still works after the docs payload is merged into the same Pages artifact

Out of scope for this phase:
- moving the docs to a separate repository
- converting the repository into the special root `<user>.github.io` repo
- adding a custom domain
- replacing GitHub Pages with another hosting provider
- broad app deployment changes unrelated to fitting MkDocs into the existing Pages artifact

Why Phase 3 exists:
- this repo already has a live GitHub Pages workflow that uploads the app `dist/` folder
- GitHub Pages publishes one deployed artifact per repository, so a second independent Pages deploy would compete with the current app site
- the safe same-repo path is one combined artifact with the app at `/` and MkDocs nested under `/docs/`

#### Phase 3 Locked Decisions

- reuse the existing `.github/workflows/deploy-pages.yml` workflow instead of adding a second Pages deployment workflow
- keep the app published at the site root
- publish MkDocs under `/docs/`
- build MkDocs separately and merge its output into `dist/docs/` before the Pages artifact upload
- keep `requirements-docs.txt` as the committed docs dependency surface for the workflow
- set `mkdocs.yml` `site_url` to the nested GitHub Pages docs path derived from the current `origin` remote: `https://rickyrickmyballs.github.io/ParaHook_Configurator/docs/`
- if the GitHub owner or repository name changes later, update `site_url` in the same change set as the hosting change

#### Phase 3 Files

Files that should be touched during this phase:

- `.github/workflows/deploy-pages.yml`
- `mkdocs.yml`
- `requirements-docs.txt`
- `docs/index.md`
- `docs/Phase-Plans/mkDocs.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Phase 3 may also touch:

- app-side docs or README surfaces that explain the published docs entry point

#### Phase 3 Build Shape

Recommended combined Pages build order:

1. check out the repo
2. set up Node and run `npm ci`
3. run the app build so `dist/` exists
4. set up Python
5. install docs dependencies from `requirements-docs.txt`
6. run `mkdocs build --site-dir site`
7. copy `site/` into `dist/docs/`
8. upload `dist/` as the one GitHub Pages artifact

Practical result:

- the web app stays available at the repository Pages root
- the docs site is served from `/docs/`
- only one `actions/deploy-pages` publish step exists for the repo

#### Phase 3 Live Result

- `.github/workflows/deploy-pages.yml` now builds the app first, then builds MkDocs and merges it into `dist/docs/` before the Pages artifact upload
- `mkdocs.yml` now sets `site_url` to `https://rickyrickmyballs.github.io/ParaHook_Configurator/docs/`
- the current GitHub Pages publish shape keeps the app at the project-site root while serving the MkDocs site from the nested `/docs/` path
- there is not a second standalone Pages workflow for docs in this repo; the docs path is part of the same Pages publish as the app root

#### Phase 3 Verification Steps

1. update `.github/workflows/deploy-pages.yml` to build both the app and MkDocs in one publish flow
2. update `mkdocs.yml` with the nested docs `site_url`
3. update any live docs text that explains where the published docs now live
4. run `npm run build`
5. run `mkdocs build`
6. dry-check that copying the built MkDocs `site/` output into `dist/docs/` does not overwrite app assets at the publish root
7. push the workflow change to GitHub
8. confirm the Pages workflow succeeds
9. open the site root and confirm the app still loads
10. open `/docs/` and confirm the MkDocs site loads with working internal links and assets

#### Phase 3 Completion Check

- [x] the existing Pages workflow builds both the app and MkDocs without introducing a second competing Pages deploy
- [x] the published app still loads at the site root
- [x] the MkDocs site loads successfully under `/docs/`
- [x] `mkdocs.yml` includes the correct nested `site_url`
- [x] the combined Pages artifact upload still uses `dist/`
- [x] `docs/CHANGELOG.md` records the shipped workflow/config change
- [x] `docs/Doc-Log.md` records the documentation-side update

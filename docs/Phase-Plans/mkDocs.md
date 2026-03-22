# mkDocs

## Doc Header

### Doc History
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

The current live site no longer uses the tiny two-page hand-written nav from the first baseline pass.

Current live behavior:
- MkDocs infers navigation from the full `/docs` tree
- archive folders are excluded from the published site
- the left sidebar exposes the non-archive docs tree directly instead of forcing search or a tiny starter nav
- the current page heading tree uses the standard right-side table of contents

This is more useful for real browsing, but it also means the sidebar follows MkDocs's inferred ordering instead of a carefully curated manual order.

## Phases

Yes. This can be done in `1` phase, as long as the phase is kept to baseline setup only.

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

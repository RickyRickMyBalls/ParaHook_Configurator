# Catalog-Gen2-2 - Linked Models And Archive Handoff

## Doc Header

### Doc History
9. 2026-04-20 14:19:27: Implemented `Catalog-Gen2-2 / Phase 4` as a docs-only closeout and deferral decision, marking this family phase complete for honest external source-page, linked archive metadata, and linked archive classification handoff while explicitly deferring runtime supported-file selection, download, extraction, import, and external add-to-project until a later owner exists.
8. 2026-04-20 14:16:54: Prepped `Catalog-Gen2-2 / Phase 4` as a no-runtime closeout and routing decision because Gen2-2 has metadata-only classification but no external download, extraction, import, or ownership path that could support an honest user file chooser; implementation should update this family doc, the Gen2 index, and `docs/Doc-Log.md` while leaving runtime behavior and `docs/CHANGELOG.md` untouched.
7. 2026-04-20 14:13:26: Implemented `Catalog-Gen2-2 / Phase 3` with pure linked archive classification for supported model candidates, archive-container inspect-needed links, unsupported file candidates, unknown/no-extension candidates, no-linked-archive states, item-page staged classification display, focused helper/UI/action tests, unchanged source-page and archive inspect links, and no download, extraction, import, chooser, action-kind, platform/fitment, or Gen3 widening.
6. 2026-04-20 14:10:29: Prepped `Catalog-Gen2-2 / Phase 3` into a decision-complete implementation spec for pure linked archive/file candidate classification from existing metadata, using reference-supported model extensions, archive-container/inspect-needed states, unknown visibility, and no download, extraction, import, chooser, action-plan, source-page, archive-link, platform/fitment, or Gen3 widening.
5. 2026-04-20 14:06: Implemented `Catalog-Gen2-2 / Phase 2` with linked archive handoff-state helper logic, inspect-only item-page archive source links, stable archive link selectors, explicit no-download/no-import copy, unchanged source-page links, unchanged Catalog action kinds, and no archive classification, extraction, import, platform/fitment, or Gen3 widening.
4. 2026-04-20 14:03:15: Prepped `Catalog-Gen2-2 / Phase 2` into a decision-complete implementation spec for linked archive metadata and staged handoff-state display in source/detail helpers and item-page rendering, keeping archive links inspect-first and separate from source-page links, preview images, add-to-project, download, extraction, import, and archive file classification.
3. 2026-04-20 13:59:57: Implemented `Catalog-Gen2-2 / Phase 1` with a source-details external source-page link affordance, `externalItemUrl` before `sourceUrl` URL resolution, stable item-page link selector and external-safe link attributes, linked archive URLs remaining metadata only, unchanged Catalog action kinds, and no archive/import/platform/fitment widening.
2. 2026-04-20 13:56:46: Prepped `Catalog-Gen2-2 / Phase 1` into a decision-complete implementation spec for source-details-based external source-page opening, with URL preference rules, missing-URL fallback, no new local asset/import action kind, no linked archive handoff, and focused source/action/UI verification.
1. 2026-04-20 13:53:53: Created this `Catalog-Gen2-2` Family Phase Doc after `Catalog-Gen2-1` completed the external source intake lane, routing source-page actions, linked archive metadata display, staged archive/file classification, and user-choice follow-up into small implementation phases.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-2`.

Use it to answer:
- how external Catalog entries should expose source pages without pretending linked files are local assets
- how linked model URLs and linked archive URLs should display and act before import is implemented
- how Dropbox/shared archive links should stay inspect-first instead of auto-importing
- which archive/file classification work belongs here before any later import handoff
- which Worker prep target comes next

### Scope

This doc covers:
- external source-page action support
- linked model/source URL handoff states
- linked archive metadata and staged handoff states
- supported-versus-unsupported archive/file classification planning
- user choice over which supported files to import as a follow-up if the staged handoff remains too passive

This doc does not cover:
- direct production browser fetch from PubParts
- broad live PubParts sync
- platform and fitment normalization
- completing `Catalog-7 / Phase 4`
- final archive extraction/import into Browser or Reference ownership
- Gen3 compatibility verdicts

## Doc Body

### Family Phase Goal

`Catalog-Gen2-2` turns the external-linked source lane from `Catalog-Gen2-1` into honest handoff behavior.

External entries may point to source pages, model pages, Dropbox shared folders, or ZIP-like archive URLs. The app should make those links visible and actionable without claiming the linked files are local project assets, without auto-downloading, and without collapsing source inspection, archive inspection, import, and add-to-project into one vague action.

### Boundary Rules

- PubParts source metadata is source truth.
- ParaHook Catalog records are runtime truth.
- Opening a source page is not the same as importing a model.
- Linked archive metadata is not proof that every file in the archive is supported.
- Archive download, extraction, and import must stay explicit user-triggered handoffs.
- `Add To Project` remains for local/repo-backed committed assets, not raw external archive links.
- Platform/fitment normalization remains deferred until `Catalog-Gen2-3`.
- `Catalog-7 / Phase 4` must still be complete or explicitly re-checked before `Catalog-Gen2-3`.

### Current Live Read

Accepted source-intake inputs from `Catalog-Gen2-1`:
- External Catalog records now use `sourceKind: 'external'`.
- PubParts external source metadata includes provider identity, source collection labels, source URLs, external item URLs, preview image URLs, linked archive URLs, source freshness, and archive freshness.
- Live `CatalogSurface` intentionally composes the tiny cached PubParts lane.
- External entries surface as external-linked PubParts records, not repo-backed items and not imports reuse.
- External entries currently stay on `load-preview`; they do not expose `add-to-project`, archive extraction, import, or environment apply behavior.

### Acceptance Read

This family phase is complete when:
- external entries can expose source-page actions without pretending linked files are local project assets
- linked archive metadata displays as handoff metadata, not as an implicit import
- supported-versus-unsupported archive/file classification exists as staged handoff truth
- user choice over supported file import is either implemented or explicitly routed to a follow-up phase
- platform/fitment normalization, Gen1 fitment work, and Gen3 compatibility verdicts remain deferred

## Vision

`Catalog-Gen2-2` should make external source handoff feel honest and inspectable.

A user should be able to see where a PubParts entry came from, open the source page, understand whether there is a linked archive, and see whether ParaHook can reason about the linked/archive contents yet. The UI must not imply that a Dropbox folder or ZIP link is already a local model. The later import path can become powerful, but this lane should first make the state explicit.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-1. keep curated repo assets and later curated external-linked entries distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-4. Keep linked model pages, Dropbox archive URLs, archive download, extraction, import, and add-to-project actions separate instead of collapsing them into one implicit load action.

### `Catalog-Gen2-2 / Phase 1`

- [x] Add external source-page action support.
- [x] Keep source-page opening separate from `load-preview`, archive download, import, and `add-to-project`.
- [x] Keep linked files from pretending to be local project assets.
- [ ] `Catalog-Gen2-HLG-1`
- [ ] `Catalog-Gen2-HLG-2`
- [ ] Catalog-Gen2-CLG-4.

### `Catalog-Gen2-2 / Phase 2`

- [x] Add linked archive metadata and UI handoff states for external entries.
- [x] Distinguish source page URLs, external item URLs, preview image URLs, and linked archive URLs.
- [x] Keep Dropbox/shared archive links inspect-first.
- [ ] `Catalog-Gen2-HLG-1`
- [ ] `Catalog-Gen2-HLG-2`
- [ ] Catalog-Gen2-CLG-4.

### `Catalog-Gen2-2 / Phase 3`

- [x] Add supported-versus-unsupported archive/file classification as staged handoff truth.
- [x] Keep extraction/import separate from `Add To Project`.
- [x] Do not perform broad archive extraction/import yet.
- [ ] `Catalog-Gen2-HLG-2`
- [ ] Catalog-Gen2-CLG-4.

### `Catalog-Gen2-2 / Phase 4`

- [ ] Add user choice over which supported files to import if Phase 3 still lacks that choice. Deferred until a later external download/extraction/import owner exists.
- [x] Keep unsupported files visible as unsupported rather than silently dropping them.
- [x] Keep Browser/Reference ownership handoff explicit.
- [ ] `Catalog-Gen2-HLG-2`
- [ ] Catalog-Gen2-CLG-4.

## [x] `Catalog-Gen2-2 / Phase 1` - `External Source Page Action Support`

### Phase 1 Summary

#### Purpose

Add external source-page action support so external-linked Catalog entries can open source pages without being treated as local assets or imports.

#### Owns

- source-page action planning for `sourceKind: 'external'`
- a distinct source-details handoff affordance for opening source URLs
- source-page handoff labels and availability
- most-specific URL resolution for external entries
- graceful missing-URL state
- tests proving source-page actions do not become local import/add-to-project behavior

#### Does Not Own

- a new local project asset action kind
- changes to repo or imports action behavior
- archive download
- archive extraction
- archive import
- linked archive handoff states
- linked archive file classification
- platform and fitment normalization
- `Catalog-7 / Phase 4`
- Gen3 compatibility verdicts

#### Current Live Read

Current external entries have `sourceUrl`, `externalItemUrl`, preview image URL, linked archive URL, and freshness fields on the external source branch.

Current actions are `load-preview`, `add-to-project`, and `apply-environment`. Phase 1 should decide whether source-page opening is a new action kind, a secondary handoff affordance outside the existing action plan, or a source-details link affordance. The implementation must keep that handoff separate from archive download/import and local `add-to-project`.

Current `CatalogActionPlan` is intentionally centered on runtime preview, downstream project commit, and environment apply behavior:
- repo-backed reference items use `add-to-project` plus secondary `load-preview`
- imports reuse and external PubParts items currently use preview-only `load-preview`
- environment items use `apply-environment`

Current item-page source details already display external provider, source URL, external item URL, preview image URL, linked archive URL, and freshness fields. That makes the item-page source-details area the safest home for source-page opening without pretending the handoff is a local asset action.

#### First Pass Decisions

- Source page opening should be explicit and user-triggered.
- Source page opening should not claim local ownership of linked files.
- Source page opening should prefer the most specific available external page URL while preserving source-set metadata.
- Linked archive URLs should remain visible metadata during Phase 1, not download/import actions.
- Do not add a new `CatalogItemActionKind` for Phase 1.
- Keep `load-preview` as the Catalog action plan's primary external item action.
- Add a source-page handoff helper or source-detail affordance that resolves a URL only for `sourceKind: 'external'` items.
- Prefer `externalItemUrl` first, then `sourceUrl`; do not use `linkedArchiveUrl` as the source-page handoff URL in Phase 1.
- If no usable source page URL exists, render source details without an enabled open-source-page affordance.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Worker should implement only the external source-page support needed to open source pages safely from existing external item source metadata.

Decision: implement this as a source-details link affordance, not as a new Catalog action kind.

The first code cut should:
- keep `CATALOG_ITEM_ACTION_KINDS` unchanged with `load-preview`, `add-to-project`, and `apply-environment`
- keep `resolveCatalogActionPlan(...)` behavior stable for repo, imports, external, and environment items
- add a source-page URL resolver for external items, likely near `catalogShellShared.ts` because it serves source-detail display
- make the resolver return the most specific source page URL:
  - first `item.source.externalItemUrl`
  - then `item.source.sourceUrl`
  - otherwise `null`
- make the resolver ignore `linkedArchiveUrl` during Phase 1 so archive links do not become source-page or import actions
- add a source-details affordance in `CatalogShellItemPage.tsx`, likely a normal external link or button-style link in the existing source details region
- open source pages through a user-triggered browser navigation affordance such as an `<a href target="_blank" rel="noreferrer">` link; if the implementation chooses a button/callback shape, it should still be a source-details handoff, not an action-plan action
- label the affordance with source-page language such as `Open Source Page` or `Open PubParts Source`
- render no enabled source-page handoff when the external item lacks both `externalItemUrl` and `sourceUrl`
- preserve existing linked archive URL display as metadata only
- preserve existing remote preview image behavior through `load-preview`
- keep repo/import item source details and actions unchanged except for any shared helper refactor needed for type safety

The implementation must not:
- add a new `CatalogItemActionKind` unless Manager revises the prep
- treat source-page opening as `load-preview`, `add-to-project`, archive import, archive download, or local project asset behavior
- use `linkedArchiveUrl` as the Phase 1 source-page handoff
- add archive download, extraction, import, staged handoff states, or file classification
- change PubParts cached data
- add direct production browser fetch or live sync
- perform platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment, or Gen3 compatibility work

#### Source Page Handoff Shape

Recommended helper shape:
- `resolveCatalogExternalSourcePageUrl(item: CatalogItemRecord): string | null`
- returns `null` for repo items and imports items
- returns `null` for external items with blank/missing `externalItemUrl` and `sourceUrl`
- returns `externalItemUrl` when both `externalItemUrl` and `sourceUrl` exist
- falls back to `sourceUrl` when `externalItemUrl` is missing
- does not return `previewImageUrl` or `linkedArchiveUrl`

Recommended UI shape:
- keep existing source details rows visible
- add one user-triggered source-page link near the source details rows only when the resolver returns a URL
- use external-safe link attributes such as `target="_blank"` and `rel="noreferrer"`
- disabled/missing URL state should be represented by absence of the link or a non-clickable copy line; do not render a broken empty `href`

This is deliberately a source-details handoff because source-page opening is not a ParaHook runtime action. It does not load a preview into the Catalog session, commit anything to Browser/Reference ownership, apply an environment, or inspect/import an archive.

#### Likely Files

- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/catalogActionPlan.test.ts` only to prove action behavior remains stable if touched
- `src/app/catalog/catalogItemContract.ts` only if helper placement requires type export changes
- `src/app/workspace/CatalogSurface.tsx` only if a callback/bridge becomes necessary; the preferred link-affordance shape should avoid this
- focused UI tests near the changed action/source helpers
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-2` family phase doc

#### No-Widening Rule

Do not add a new local asset action kind, direct production browser fetch, live source sync, archive download, archive extraction, archive import, linked archive handoff states, linked archive file classification, platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility behavior in Phase 1.

#### Implementation Risks

- Treating an external source URL as a local asset path.
- Making `open source` look like `add-to-project`.
- Automatically downloading linked archives from a source-page action.
- Losing the separation between source page URLs and linked archive URLs.
- Adding a new catalog action kind when a source-details link would fit the current action model better.
- Rendering an empty or broken source link when an external item has no source URL.
- Accidentally using Dropbox/archive URLs as the source-page handoff and pulling Phase 2 behavior forward.

#### Checklist

- [x] Phase 1 prep decides the source-page shape as a source-details link affordance, not a new `CatalogItemActionKind`.
- [x] Phase 1 prep confirms file ownership should center on `catalogShellShared.ts` helper logic and `CatalogShellItemPage.tsx` rendering.
- [x] Phase 1 prep confirms source-page opening stays separate from preview, archive, import, and add-to-project behavior.
- [x] Phase 1 prep confirms external source URLs are never treated as local asset paths.
- [x] Phase 1 prep confirms `externalItemUrl` is preferred over `sourceUrl`.
- [x] Phase 1 prep confirms missing URL state must not render a broken handoff.
- [x] Phase 1 prep confirms linked archive URL remains visible metadata, not import/extraction/download behavior.
- [x] Phase 1 prep confirms repo/import behavior stays stable.
- [x] Phase 1 prep defines focused action/source/UI tests and `npm.cmd run build`.
- [x] Phase 1 prep records required tracking docs.
- [x] Phase 1 implementation adds the source-page URL resolver without adding a new `CatalogItemActionKind`.
- [x] Phase 1 implementation renders the item-page source-page handoff as a normal external link with `target="_blank"`, `rel="noreferrer"`, and `data-catalog-source-page-link`.
- [x] Phase 1 implementation keeps missing source URLs from rendering a broken handoff.
- [x] Phase 1 implementation proves linked archive URLs are not used as source-page targets.
- [x] Phase 1 implementation keeps external source entries preview-only in the Catalog action plan.

#### Verification Shape

- Focused action/source tests should cover:
  - external source-page affordance is available when `externalItemUrl` exists
  - external source-page resolver prefers `externalItemUrl` over `sourceUrl`
  - external source-page resolver falls back to `sourceUrl` when `externalItemUrl` is missing
  - external source-page affordance is absent or disabled when no source page URL exists
  - external source-page affordance does not expose `add-to-project`
  - external source-page affordance does not change `resolveCatalogActionPlan(...)` for external items, which should remain preview-only
  - linked archive URL remains metadata, not an implicit download/import action
  - linked archive URL is not used as the source-page URL
  - repo/import source details and action behavior remain stable
  - repo and imports action behavior remains stable
- `npm.cmd run build`.

#### Done Shape

Phase 1 is complete.

Accepted result:
- external entries have a safe source-page link affordance in the item-page source details area
- source-page links prefer `externalItemUrl`, fall back to `sourceUrl`, and never use `linkedArchiveUrl`
- external entries remain preview-only in the Catalog action plan
- linked archive URLs remain visible metadata only
- focused tests and `npm.cmd run build` passed

Dispatch next:
- `Catalog-Gen2-2 / Phase 2 - Linked Archive Metadata And Handoff States`

## [x] `Catalog-Gen2-2 / Phase 2` - `Linked Archive Metadata And Handoff States`

### Phase 2 Summary

#### Purpose

Represent linked archive metadata and handoff states clearly enough that users can inspect archive availability without ParaHook pretending it has imported the files.

#### Owns

- linked archive metadata display
- shared-folder versus ZIP-like link handoff labels
- staged archive handoff states such as available, inspect-needed, unsupported, or planned
- no-import boundary copy
- source/detail helper shape for linked archive state
- item-page rendering of archive handoff truth

#### Does Not Own

- opening source pages; that shipped in Phase 1
- preview image behavior
- `add-to-project` behavior for external entries
- archive download
- archive extraction
- file import
- supported-versus-unsupported file classification inside an archive
- supported-file chooser
- new Catalog action kinds
- platform/fitment normalization
- `Catalog-7 / Phase 4`
- Gen3 compatibility verdicts

### Phase 2 Implementation Spec

#### Exact First Code Cut

Worker should implement only linked archive metadata and staged handoff-state display for external Catalog items.

Decision: keep Phase 2 mostly in source/detail helpers and item-page rendering. Do not add Catalog action-plan behavior.

The first code cut should:
- add a small helper/data shape near `catalogShellShared.ts` for linked archive handoff state, for example `resolveCatalogLinkedArchiveHandoff(item)`
- make the helper only resolve archive handoff state for `sourceKind: 'external'`
- classify the handoff at metadata level, not file-content level
- preserve the existing `Linked Archive URL` row in source details or replace it with a more explicit source-detail group, as long as the URL remains user-visible
- keep linked archive URL separate from the Phase 1 source-page URL resolver
- keep linked archive URL separate from preview image URLs
- render item-page copy that makes the linked archive inspect/download state clear without implying import or extraction
- keep source-page link, source URL, external item URL, preview image URL, and linked archive URL labeled distinctly
- keep external entries on `actionKind: 'load-preview'`
- keep repo/import item behavior stable

The implementation must not:
- download archives
- extract archives
- import archive contents or linked files
- add supported-versus-unsupported file classification inside archives
- add a chooser for supported files
- add `add-to-project` behavior for external items
- add a new `CatalogItemActionKind`
- use linked archive URLs as source-page URLs
- use linked archive URLs as preview image URLs
- perform platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility verdicts

#### Linked Archive Handoff Shape

Recommended type shape:
- `CatalogLinkedArchiveHandoffState`
  - `no-linked-archive`
  - `linked-archive-available`
  - `linked-archive-planned`
- `CatalogLinkedArchiveHandoff`
  - `state`
  - `label`
  - `description`
  - `url`
  - `isUserInspectable`

Recommended resolver behavior:
- repo and imports items return `no-linked-archive`
- external items with a blank or missing `linkedArchiveUrl` return `no-linked-archive`
- external items with a linked archive URL return `linked-archive-available`
- the returned description should say the archive is linked source metadata and is not downloaded, extracted, or imported by this phase
- `linked-archive-planned` may be reserved for future records that have archive freshness/metadata but no URL, or can remain unused until Phase 3/4 if no current record needs it
- the helper should not inspect file extensions or archive contents; that belongs to Phase 3

Recommended UI shape:
- render the linked archive handoff state in the existing item-page source/details area
- use labels such as `Linked Archive Handoff`, `Linked Archive State`, or `Archive Handoff`
- if the URL is rendered as a link, it must read as inspect-only, for example `Inspect Linked Archive Source`
- if the URL is rendered only as metadata, the handoff state still needs explicit copy such as `Linked archive available; download/import is not implemented here`
- add a stable selector if the implementation renders an inspect link, for example `data-catalog-linked-archive-link={item.itemId}`
- render no broken archive link when `linkedArchiveUrl` is missing
- keep the Phase 1 source-page link selector and target unchanged

Phase 2 may choose either:
- linked archive URL as a normal inspect link with explicit no-import copy; or
- linked archive URL as labeled metadata plus a staged handoff state without a clickable archive link

Recommended decision: render an inspect-only archive link when `linkedArchiveUrl` exists, because this phase owns linked archive handoff state truth. The copy and tests must prove it is not add-to-project, extraction, or import.

#### Likely Files

- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/catalogActionPlan.test.ts` only for action-plan stability proof if needed
- `src/app/catalog/catalogActionPlan.ts` only if implementation discovers an unavoidable planned metadata field, but preferred shape should avoid touching action plans
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-2` family phase doc

#### No-Widening Rule

Do not add archive download, archive extraction, archive import, archive file classification, supported-file chooser behavior, new `add-to-project` behavior for external items, new Catalog action kinds, source-page URL changes, preview-image URL changes, platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility verdicts during Phase 2.

#### Implementation Risks

- Making a Dropbox/shared archive link look like a local project asset.
- Turning linked archive display into import or extraction behavior.
- Using linked archive URL as the Phase 1 source-page link target.
- Using linked archive URL as preview media.
- Adding file-extension or archive-content classification too early.
- Making repo/import source details carry external archive state.
- Changing external entries from preview-only action behavior.

#### Checklist

- [x] Phase 2 prep confirms linked archive handoff state should live in source/detail helpers and item-page rendering.
- [x] Phase 2 prep defines a small explicit linked archive handoff state/data shape.
- [x] Phase 2 prep confirms linked archive URL stays separate from source page URL, external item URL, and preview image URL.
- [x] Phase 2 prep recommends an inspect-only archive link only when `linkedArchiveUrl` exists, with no-import copy and stable selector.
- [x] Phase 2 prep confirms missing linked archive URL renders no broken archive handoff.
- [x] Phase 2 prep confirms no archive download, extraction, import, or archive file classification.
- [x] Phase 2 prep confirms no external `add-to-project`, no new Catalog action kind, and no action-plan widening.
- [x] Phase 2 prep confirms repo/import behavior remains stable.
- [x] Phase 2 prep names focused tests and `npm.cmd run build`.
- [x] Phase 2 prep records required tracking docs.
- [x] Phase 2 implementation adds `resolveCatalogLinkedArchiveHandoff(...)` without touching `CATALOG_ITEM_ACTION_KINDS` or `CatalogActionPlan`.
- [x] Phase 2 implementation renders linked archive source inspection as a normal external link with `target="_blank"`, `rel="noreferrer"`, and `data-catalog-linked-archive-link`.
- [x] Phase 2 implementation uses `linkedArchiveUrl` only for the archive inspect link and keeps it separate from source-page URLs and preview images.
- [x] Phase 2 implementation keeps missing linked archive URLs from rendering broken archive handoff links.
- [x] Phase 2 implementation keeps archive handoff copy inspect-only and explicitly says ParaHook has not downloaded, extracted, imported, or classified the archive.
- [x] Phase 2 implementation keeps external entries off `add-to-project`, archive download/extraction/import, archive file classification, platform/fitment normalization, and Gen3 compatibility behavior.

#### Verification Shape

- Focused tests should cover:
  - external item with `linkedArchiveUrl` resolves a staged linked archive handoff state.
  - external item with `linkedArchiveUrl` renders explicit archive handoff copy in item-page source details.
  - if rendered as a link, the archive inspect link uses a stable selector and targets `linkedArchiveUrl`, not source page URL or preview image URL.
  - external item without `linkedArchiveUrl` returns `no-linked-archive` and renders no broken archive link.
  - linked archive handoff remains separate from Phase 1 source-page link.
  - linked archive handoff remains separate from preview images.
  - linked archive handoff does not expose `add-to-project`, archive download/extraction/import, or environment apply behavior.
  - `resolveCatalogActionPlan(...)` remains stable for external items.
  - repo/import item source details and actions remain stable.
- `npm.cmd run build`.

#### Done Shape

Phase 2 is complete.

Accepted result:
- external entries with `linkedArchiveUrl` resolve and render linked archive metadata as an inspect-only source handoff
- the archive inspect link targets `linkedArchiveUrl` with `target="_blank"`, `rel="noreferrer"`, and `data-catalog-linked-archive-link`
- missing linked archive URLs do not render broken archive handoff links
- source-page links, preview images, external item URLs, and linked archive URLs stay distinct
- external entries remain preview-only and do not gain add-to-project, archive download, extraction, import, or classification behavior
- focused tests and `npm.cmd run build` passed

Dispatch next:
- `Catalog-Gen2-2 / Phase 3 - Supported Versus Unsupported Archive Classification`

## [x] `Catalog-Gen2-2 / Phase 3` - `Supported Versus Unsupported Archive Classification`

### Phase 3 Summary

#### Purpose

Add staged supported-versus-unsupported archive/file classification so later import behavior can be honest about what ParaHook can handle.

#### Owns

- staged supported-versus-unsupported file/archive classification truth for linked archive metadata
- a pure helper/data shape that classifies known linked archive/file candidates from existing URL/metadata only
- supported model-extension rules aligned to current reference file conventions
- explicit archive-container / inspect-needed state for ZIP/shared-folder links
- unsupported and unknown/no-extension visibility instead of silently dropping candidates
- optional item-page source/details display of classification state without implying import

#### Does Not Own

- archive download
- archive extraction
- archive import
- user chooser for supported files
- external `add-to-project`
- changing the Phase 1 source-page link behavior
- changing the Phase 2 linked archive inspect link behavior
- platform/fitment normalization
- `Catalog-7 / Phase 4`
- Gen3 compatibility verdicts

#### Current Live Read

Current linked archive metadata arrives on external Catalog items as `item.source.linkedArchiveUrl`.

Phase 2 already resolves the existence/display state with `resolveCatalogLinkedArchiveHandoff(item)` and renders an inspect-only item-page link when a linked archive URL exists. That helper deliberately says ParaHook has not downloaded, extracted, imported, or classified the archive.

Current supported reference file extensions live in `src/app/references/referenceManifest.ts` as `ReferenceFileType = 'obj' | 'glb' | 'stl' | 'step'`. Phase 3 can reference or mirror those exact runtime-supported extensions for metadata classification only. It must not start import behavior.

Current PubParts sampled archive links are Dropbox ZIP-like links. Those should classify as archive containers / inspect-needed, not as supported model files, because metadata only proves a linked archive exists. It does not prove which internal files are present or supported.

### Phase 3 Implementation Spec

#### Exact First Code Cut

Worker should implement only staged classification for the linked archive/file candidate URL already present on external Catalog item metadata.

Decision: add a small pure helper near the existing linked archive helper in `catalogShellShared.ts`. Do not put this in `CatalogActionPlan`, do not add a new action kind, and do not change source-page or archive inspect link behavior.

The first code cut should:
- add a small helper/data shape such as `resolveCatalogLinkedArchiveClassification(item)` or `resolveCatalogLinkedArchiveCandidateClassification(item)`
- make the helper return a no-linked-archive state for repo/import items and for external items without a usable `linkedArchiveUrl`
- classify only from existing metadata such as `linkedArchiveUrl`; do not fetch, download, HEAD-check, unzip, or inspect remote archive contents
- treat `.glb`, `.obj`, `.stl`, and `.step` path candidates as supported model candidates, consistent with `ReferenceFileType`
- treat `.zip` URLs and Dropbox/shared archive URLs as archive-container / inspect-needed candidates, not supported model files
- treat unsupported extensions such as `.pdf`, `.txt`, `.png`, or unrelated file candidates as unsupported file candidates
- treat unknown/no-extension URLs as unknown / unsupported-planned candidates with visible state, not silent success
- preserve the Phase 2 handoff result and inspect-only link; Phase 3 adds classification truth alongside it
- optionally render a source/details classification row in `CatalogShellItemPage.tsx` if doing so makes the staged state inspectable without implying import
- keep classification labels/copy explicit that ParaHook is only reading metadata and has not downloaded, extracted, imported, or chosen files
- keep external entries on `actionKind: 'load-preview'`
- keep repo/import item behavior stable

The implementation must not:
- download archives
- extract archives
- import files or archive contents
- add a user chooser for supported files
- add external `add-to-project`
- add or modify `CATALOG_ITEM_ACTION_KINDS`
- change `resolveCatalogExternalSourcePageUrl(...)` priority/fallback behavior
- change the Phase 2 linked archive inspect link target or selector
- classify archive internals from guessed file names inside a ZIP URL
- perform platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility verdicts

#### Classification Shape

Recommended type shape:
- `CatalogLinkedArchiveClassificationKind`
  - `no-linked-archive`
  - `supported-model-candidate`
  - `archive-container-inspect-needed`
  - `unsupported-file-candidate`
  - `unknown-linked-candidate`
- `CatalogLinkedArchiveClassification`
  - `kind`
  - `label`
  - `description`
  - `url`
  - `fileExtension`
  - `isSupportedModelCandidate`
  - `requiresArchiveInspection`

Recommended resolver behavior:
- repo/import items return `no-linked-archive`
- external items with blank/missing `linkedArchiveUrl` return `no-linked-archive`
- URLs whose pathname clearly ends in `.glb`, `.obj`, `.stl`, or `.step` return `supported-model-candidate`
- URLs whose pathname clearly ends in `.zip`, or whose host/path matches a shared archive container pattern such as Dropbox archive links, return `archive-container-inspect-needed`
- URLs with a clear non-model extension return `unsupported-file-candidate`
- URLs with no reliable extension return `unknown-linked-candidate`
- query strings should not confuse extension detection; parse the URL when possible, and fall back to conservative string parsing only for malformed-but-displayable values
- `supported-model-candidate` still does not become import behavior in Phase 3; it is only staged truth for later handoff planning

Recommended UI shape:
- if rendered, add one item-page source/details row such as `Archive Classification`
- supported model candidate copy should say the URL looks like a supported model candidate, but no import has started
- archive container copy should say the URL points to an archive/shared source that needs inspection before ParaHook can know supported contents
- unsupported/unknown copy should remain visible rather than hiding the handoff state
- do not add a button, chooser, import call, download link, or action-plan action
- keep the Phase 1 source-page link and Phase 2 archive inspect link unchanged

#### Likely Files

- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/catalog/ui/CatalogShellItemPage.tsx` if classification display is added
- `src/app/references/referenceManifest.ts` only as a type/source-reference for supported extensions; avoid changing it unless TypeScript reuse requires an exported constant
- `src/app/workspace/CatalogSurface.test.tsx` if UI display proof is needed for the live external item page
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-2` family phase doc

#### No-Widening Rule

Do not add archive download, archive extraction, archive import, user chooser behavior, external `add-to-project`, new Catalog action kinds, source-page URL changes, archive inspect link changes, supported-file import behavior, platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility verdicts during Phase 3.

#### Implementation Risks

- Treating a `.zip` or Dropbox/shared archive URL as a directly supported model file.
- Guessing internal archive contents from archive file names.
- Turning classification copy into an import promise.
- Hiding unsupported/unknown candidates and making the UI look more capable than it is.
- Changing Phase 1 source-page or Phase 2 archive inspect behavior while adding classification.
- Duplicating supported extension truth in a way that drifts from `ReferenceFileType`.

#### Checklist

- [x] Phase 3 prep confirms classification lives in a pure source/detail helper, not `CatalogActionPlan`.
- [x] Phase 3 prep defines supported model candidates as `.glb`, `.obj`, `.stl`, and `.step` to match current reference file conventions.
- [x] Phase 3 prep defines `.zip` and Dropbox/shared archive URLs as archive-container / inspect-needed, not directly supported model files.
- [x] Phase 3 prep defines unsupported and unknown/no-extension states that stay visible.
- [x] Phase 3 prep confirms classification reads only existing metadata and does not fetch, download, extract, import, or inspect archives.
- [x] Phase 3 prep keeps Phase 1 source-page and Phase 2 archive inspect link behavior unchanged.
- [x] Phase 3 prep confirms no external `add-to-project`, no chooser, no action-kind widening, no platform/fitment, and no Gen3 compatibility verdicts.
- [x] Phase 3 prep confirms Phase 4 remains required if Phase 3 only classifies and does not let the user choose supported files.
- [x] Phase 3 prep names focused tests and `npm.cmd run build`.
- [x] Phase 3 prep records required tracking docs.
- [x] Phase 3 implementation adds a pure linked archive classification helper near the source/detail helpers, not in `CatalogActionPlan`.
- [x] Phase 3 implementation classifies `.glb`, `.obj`, `.stl`, and `.step` direct links as supported model candidates.
- [x] Phase 3 implementation classifies `.zip` and Dropbox/shared archive links as archive-container / inspect-needed candidates.
- [x] Phase 3 implementation keeps unsupported extensions, unknown/no-extension URLs, missing linked archives, repo items, and imports items visible in stable classification states.
- [x] Phase 3 implementation renders staged archive classification in item-page source details without adding import/download/chooser actions.
- [x] Phase 3 implementation keeps Phase 1 source-page links, Phase 2 archive inspect links, external preview-only action behavior, and `CATALOG_ITEM_ACTION_KINDS` unchanged.
- [x] Phase 3 implementation keeps Phase 4 required for any user choice over supported files.

#### Verification Shape

- Focused tests should cover:
  - external item with `.glb`, `.obj`, `.stl`, and `.step` linked URLs classifies as supported model candidates.
  - external item with `.zip` linked URL classifies as archive container / inspect-needed.
  - external item with Dropbox/shared archive URL classifies as archive container / inspect-needed even when query strings are present.
  - external item with unsupported non-model extension classifies as unsupported file candidate.
  - external item with unknown/no-extension linked URL classifies as unknown linked candidate.
  - external item without `linkedArchiveUrl` returns no-linked-archive.
  - repo/import items return no-linked-archive.
  - classification does not change source-page URL resolution or archive inspect link target.
  - external action plan remains preview-only and does not expose `add-to-project`, archive download/extraction/import, or chooser behavior.
  - item-page classification display, if added, uses staged metadata copy and no import/download action language.
- `npm.cmd run build`.

#### Done Shape

Phase 3 is complete.

Accepted result:
- supported direct model URLs classify as staged supported model candidates
- `.zip` and Dropbox/shared archive URLs classify as archive containers requiring inspection, not as direct model files
- unsupported, unknown/no-extension, missing linked archive, repo, and imports cases remain visible and stable
- item-page source details can display the classification as metadata-only staged truth
- source-page links and linked archive inspect links remain unchanged
- no download, extraction, import, chooser, external add-to-project, action-kind change, platform/fitment work, `Catalog-7 / Phase 4`, Gen1 fitment field, or Gen3 compatibility behavior shipped
- focused tests and `npm.cmd run build` passed

Expected follow-up:
- Phase 4 remains required if Phase 3 only classifies candidates and does not let the user choose supported files for a later import handoff.

## [x] `Catalog-Gen2-2 / Phase 4` - `Supported File Import Choice Follow-Up`

### Phase 4 Summary

#### Purpose

Decide whether Gen2-2 has enough real supported-file candidate data and ownership support to implement user choice now, or close the family phase by routing actual file choice to a later download/extraction/import owner.

#### Owns

- the explicit yes/no decision about Phase 4 runtime behavior
- truthfully routing user choice when Gen2-2 cannot support it without fake import behavior
- preserving unsupported-file visibility from Phase 3
- Browser/Reference ownership handoff planning language for the later phase/generation
- Gen2 index expectation updates if Phase 4 closes as a deferral

#### Does Not Own

- archive download
- archive extraction
- archive import
- an actual supported-file chooser that promises import
- external `add-to-project`
- final broad import pipeline replacement
- making direct remote model URLs behave as local assets
- platform/fitment normalization
- `Catalog-7 / Phase 4`
- Gen1 fitment fields
- Gen3 compatibility verdicts

#### Current Reality

Phase 3 only classifies linked URL metadata:
- `.zip` and Dropbox/shared archive URLs classify as archive-container / inspect-needed because ParaHook does not know archive contents.
- Direct `.glb`, `.obj`, `.stl`, and `.step` URLs can classify as supported model candidates, but the current PubParts cached sample lane is archive-container based, not a list of extracted direct model URLs.
- `catalogReferenceCommit.ts` only commits repo-backed Catalog items whose `sourceKind` is `repo` and whose `assetPath` resolves through the local reference manifest path owner.
- `CatalogSurface` routes add-to-project through `resolveCatalogReferenceCommitRequest(...)`; external items remain preview-only and have no external download/import owner.
- There is no current archive download, extraction, external direct-model fetch, imported object URL creation, or chooser state owner for external candidates.

Because of that, a real Phase 4 runtime chooser would either:
- present only staged selection with no executable handoff, which adds UI state but no user capability; or
- imply import/download behavior that the repo does not own yet.

#### Prep Decision

Recommended decision: do not implement runtime Phase 4 behavior in Gen2-2.

Phase 4 should close as a docs/index routing decision. It should state that Gen2-2 has completed honest source-page, archive metadata, and candidate classification truth, but actual user choice over supported files requires a later owner that can:
- download or otherwise receive external file bytes through an explicit user-triggered handoff
- inspect/extract archive contents where needed
- classify real extracted file candidates instead of URL guesses
- create Browser/Reference-owned imported records from actual object URLs or persisted assets
- let users choose supported files without pretending unsupported or unknown files are importable

The deferred runtime lane should be a later generation/phase, not `Catalog-Gen2-2 / Phase 4.1`, unless Manager specifically wants another planning-only repair inside this family phase. Gen2-2 can complete after Phase 4 if the implementation updates the family doc and Gen2 index honestly.

### Phase 4 Implementation Spec

#### Exact First Code Cut

Worker should implement only the docs/index closeout for the supported-file choice decision.

Decision: close Phase 4 as docs-only deferral, not runtime UI.

The implementation should:
- mark Phase 4 complete in this family phase doc as a routing decision
- record that no meaningful chooser can ship inside Gen2-2 because the external download/extraction/import owner is not built
- record that direct supported-model URL candidates are only metadata candidates until a later owner can fetch/import them
- record that archive-container candidates still require real archive inspection before user choice is possible
- keep unsupported/unknown visibility as Phase 3's completed truth
- update `Catalog-Gen2-Index.md` so the `Catalog-Gen2-2` lane tells the completed truth:
  - source-page, archive metadata, and classification are complete
  - user choice/import wishlist items are deferred to a later owner
  - `Catalog-Gen2-CLG-4` remains partially advanced but should not be marked complete if download/extraction/import/user choice remain unimplemented
  - `Catalog-Gen2-2` can be marked complete as the honest handoff/classification family if the index notes the deferred import owner
- update `docs/Doc-Log.md`
- do not update `docs/CHANGELOG.md` because no runtime behavior ships

The implementation must not:
- add UI state for selecting candidates
- add a staged selected-for-later-import runtime flag
- add a new Catalog action kind
- add external add-to-project behavior
- add direct remote model URL fetch/import
- add archive download, extraction, inspection, import, or chooser behavior
- change Phase 1 source-page link, Phase 2 archive inspect link, or Phase 3 classification behavior
- perform platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility verdicts

#### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-2 - Linked Models And Archive Handoff.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`
- `docs/Doc-Log.md`

No source files should change.

#### No-Widening Rule

Do not add archive download, archive extraction, archive import, supported-file chooser behavior, staged runtime selection state, external `add-to-project`, broad import pipeline replacement, local asset masquerading for remote URLs, platform/fitment normalization, `Catalog-7 / Phase 4`, Gen1 fitment fields, or Gen3 compatibility verdicts during Phase 4.

#### Implementation Risks

- Marking `G2-14` or `Catalog-Gen2-CLG-4` complete as if user choice/import shipped.
- Creating a fake chooser that cannot lead to a real owned import path.
- Making direct remote model URLs look like repo `assetPath` values.
- Making Dropbox/shared archive links look supported before archive contents are inspected.
- Closing Gen2-2 without telling the index which wishlist items were deferred.

#### Checklist

- [x] Phase 4 prep answers no: do not implement Phase 4 runtime now.
- [x] Phase 4 prep records that Gen2-2 has no external download/extraction/import owner for a meaningful chooser.
- [x] Phase 4 prep records that direct supported model URLs remain metadata candidates until a later owner can fetch/import them.
- [x] Phase 4 prep records that archive-container candidates require later archive inspection before user choice.
- [x] Phase 4 prep chooses docs/index closeout instead of a `Phase 4.1`.
- [x] Phase 4 prep keeps Phase 1 source-page, Phase 2 archive inspect, and Phase 3 classification behavior unchanged.
- [x] Phase 4 prep confirms no runtime source files, no `docs/CHANGELOG.md`, and no runtime tests/build are required for the docs-only closeout unless implementation unexpectedly touches code.
- [x] Phase 4 prep records required tracking docs.
- [x] Phase 4 implementation closes as a docs-only routing decision, not a runtime chooser.
- [x] Phase 4 implementation records that runtime supported-file selection remains deferred because ParaHook does not yet own external download, extraction, import, or external add-to-project behavior.
- [x] Phase 4 implementation keeps direct supported-model URLs as metadata candidates until a later owner can fetch/import them.
- [x] Phase 4 implementation keeps archive-container candidates blocked on later real archive inspection before user choice.
- [x] Phase 4 implementation updates the Gen2 index to mark `Catalog-Gen2-2` complete only as the honest linked source/archive handoff family.
- [x] Phase 4 implementation does not create `Catalog-Gen2-2 / Phase 4.1`.
- [x] Phase 4 implementation sets the next target to `Catalog-7 / Phase 4 - Wheel-Specific Motor And Tire Fitment Fields` before `Catalog-Gen2-3`.

#### Verification Shape

- Docs-only review is sufficient if implementation touches only docs.
- No focused runtime tests are required unless source files are unexpectedly changed.
- No `npm.cmd run build` is required unless source files are unexpectedly changed.

#### Done Shape

Phase 4 is complete.

Accepted result:
- no runtime supported-file chooser shipped in Gen2-2
- actual supported-file selection, external download, archive extraction, import, and external add-to-project remain deferred to a later owner
- direct supported-model URLs remain metadata candidates until a later owner can fetch/import them
- archive-container candidates remain blocked on real archive inspection before user choice
- unsupported and unknown candidates remain visible through Phase 3 classification
- Phase 1 source-page links, Phase 2 archive inspect links, and Phase 3 classification behavior remain unchanged
- no `Catalog-Gen2-2 / Phase 4.1` was created

Family completion:
- `Catalog-Gen2-2` is complete as the honest external source-page, linked archive metadata, and archive classification handoff family.
- `Catalog-Gen2-2` does not complete runtime download, extraction, import, or supported-file choice behavior.
- The later runtime owner should be a new generation/phase for external download/extraction/import/user-choice handoff.

Dispatch next:
- `Catalog-7 / Phase 4 - Wheel-Specific Motor And Tire Fitment Fields`

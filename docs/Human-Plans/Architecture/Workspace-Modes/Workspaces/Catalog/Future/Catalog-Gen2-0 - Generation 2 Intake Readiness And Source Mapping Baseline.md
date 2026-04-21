# Catalog-Gen2-0 - Generation 2 Intake Readiness And Source Mapping Baseline

## Doc Header

### Doc History
7. 2026-04-20 13:06:35: Closed `Catalog-Gen2-0 / Phase 3` by creating `Catalog-Gen2-1 - External Catalog Source Intake`, preserving the `Catalog-7 / Phase 4` gate before `Catalog-Gen2-3`, and recording `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork` as the next Worker prep target.
6. 2026-04-20 13:04:39: Prepped `Catalog-Gen2-0 / Phase 3` with the docs-only handoff spec for creating `Catalog-Gen2-1 - External Catalog Source Intake`, preserving the `Catalog-7 / Phase 4` gate before `Catalog-Gen2-3`, and naming `Catalog-Gen2-1 / Phase 1` as the next Worker prep target.
5. 2026-04-20 13:02:56: Closed `Catalog-Gen2-0 / Phase 2` as a docs-only live seam audit implementation, marking the approved source contract, source snapshot, action plan, browse/filter/search, item-page source labeling, `CatalogSurface` snapshot-creation, and no-widening checklist complete.
4. 2026-04-20 13:00:54: Prepped `Catalog-Gen2-0 / Phase 2` with the live Catalog source contract, source snapshot, action plan, browse/filter/search, item-page source labeling, and `CatalogSurface` snapshot-creation seam audit for Manager review before `Catalog-Gen2-1`.
3. 2026-04-20 12:59:00: Closed `Catalog-Gen2-0 / Phase 1` as a docs-only source-intake readiness implementation, marking the approved endpoint baseline, CORS constraint, cached normalized source decision, and no-runtime-change checklist complete.
2. 2026-04-20 12:56:16: Tightened `Catalog-Gen2-0 / Phase 1` into a docs-only implementation-readiness spec with the PubParts endpoint field baseline, checked browser-fetch/CORS constraint, cached normalized source-intake decision, and explicit no-runtime-change boundary.
1. 2026-04-20 12:53:31: Created this `Catalog-Gen2-0` Family Phase Doc to block the Generation 2 source-intake readiness lane, record the PubParts endpoint and browser-fetch assumptions, audit the live Catalog seams, and gate `Catalog-Gen2-3` behind the remaining `Catalog-7 / Phase 4` motor and tire fitment work.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-0`.

Use it to answer:
- what must be true before `Catalog Generation 2` external source implementation begins
- why Gen2 starts from repo-owned cached normalized PubParts data instead of direct production browser fetch
- which live Catalog seams the Worker must respect
- how `Catalog-7 / Phase 4` gates later platform and fitment normalization
- which implementation phase the Worker should prep first

### Scope

This doc covers:
- PubParts endpoint field baseline
- browser-fetch constraint read
- cached normalized source-intake decision
- current Catalog source/action/filter audit
- Gen1/Gen2 boundary read
- creation of the `Catalog-Gen2-1` family phase doc after readiness is accepted

This doc does not cover:
- adding the external runtime source contract
- normalizing PubParts records into live Catalog entries
- linked archive extraction or import behavior
- completing `Catalog-7 / Phase 4`
- platform and fitment normalization
- compatibility checker behavior

## Doc Body

### Family Phase Goal

`Catalog-Gen2-0` makes the Gen2 implementation path honest before code starts.

The key decision is that PubParts is an external source of record, while ParaHook owns the runtime catalog contract. PubParts JSON can be inspected and cached into repo-owned normalized source data for Gen2, but direct production browser fetch is not the first implementation route because the checked PubParts JSON responses did not advertise cross-origin browser access.

### Boundary Rules

- `Catalog-Gen2-0` is a readiness and planning phase, not the external-source runtime implementation.
- `Catalog-Gen2-1` owns the first external source contract and normalized PubParts item path.
- `Catalog-7 / Phase 4` does not block `Catalog-Gen2-1`.
- `Catalog-7 / Phase 4` must be complete or explicitly re-checked before `Catalog-Gen2-3`.
- Worker must prep each implementation phase before implementation.
- Manager must approve or revise the prepared spec before Worker implements.

### Current Live Read

The live Catalog code currently has:
- `repo` and `imports` source kinds only
- `repoItems`, `importsItems`, and `allItems` in the Catalog source snapshot
- action families for reference assets and environments
- `load-preview`, `add-to-project`, and `apply-environment` action kinds
- Part and Platform browse reads over one shared metadata contract
- filters for system, platform compatibility, part type, part groups, and brand

The next Gen1 local taxonomy task is still `Catalog-7 / Phase 4 - Wheel-Specific Motor And Tire Fitment Fields`.

### Acceptance Read

This family phase is complete when:
- the PubParts source assumptions are documented
- the live Catalog seams are audited in the doc
- the Gen1 fitment gate is clearly routed before `Catalog-Gen2-3`
- the `Catalog-Gen2-1` family phase doc exists
- the next Worker implementation target is unambiguous

### Next Worker Prep Target

After Manager accepts `Catalog-Gen2-0` complete, dispatch:
- `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork`

## Vision

`Catalog-Gen2-0` should let the team begin Gen2 without blurring source truth.

The user should eventually see external-linked Catalog entries near curated repo assets, but the app must keep those entries distinct. This readiness phase protects that split by making source kind, provider, source URL, archive URL, and normalized ParaHook metadata deliberate before implementation.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-1. keep curated repo assets and later curated external-linked entries distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-0. Establish the Generation 2 source-intake baseline before implementation by recording the PubParts endpoint shape, the browser CORS constraint, the cached normalized source decision, the live Catalog source/action/filter seams, and the `Catalog-7 / Phase 4` fitment gate.
- [ ] Catalog-Gen2-CLG-1. Add a PubParts source-adapter planning lane that uses `.json` page endpoints as structured source intake while preserving PubParts attribution, links, preview images, archive URLs, and freshness metadata.
- [ ] Catalog-Gen2-CLG-2. Define external source metadata on Catalog entries without weakening the existing repo-backed and imports source split.

### `Catalog-Gen2-0 / Phase 1`

- [x] Record PubParts endpoint fields for `parts.json`, filtered parts JSON pages, and `resources.json`.
- [x] Record that initial implementation should use repo-owned cached normalized source data.
- [x] Explain the browser-fetch constraint and why direct production browser fetch is deferred.
- [x] Preserve `Catalog-Gen2-HLG-1`.
- [x] Preserve `Catalog-Gen2-HLG-2`.
- [x] Preserve `Catalog-Gen2-HLG-3`.
- [x] Advance Catalog-Gen2-CLG-0.

### `Catalog-Gen2-0 / Phase 2`

- [x] Audit the current Catalog item source contract.
- [x] Audit the current Catalog source snapshot shape.
- [x] Audit current action-plan semantics.
- [x] Audit current browse and filter seams.
- [x] Identify likely files for `Catalog-Gen2-1`.
- [x] Advance Catalog-Gen2-CLG-0.
- [x] Advance Catalog-Gen2-CLG-2.

### `Catalog-Gen2-0 / Phase 3`

- [x] Create `Catalog-Gen2-1 - External Catalog Source Intake` as the next Family Phase Doc.
- [x] Mark `Catalog-7 / Phase 4` as required before `Catalog-Gen2-3`.
- [x] Record the first Worker prep target for `Catalog-Gen2-1 / Phase 1`.
- [x] Advance Catalog-Gen2-CLG-1.
- [x] Advance Catalog-Gen2-CLG-2.

## [x] `Catalog-Gen2-0 / Phase 1` - `Source Intake Decision And Endpoint Baseline`

### Phase 1 Summary

#### Purpose

Record the source-intake decision for PubParts before any runtime source contract changes.

#### Owns

- PubParts endpoint list
- PubParts source fields currently known from JSON
- browser-fetch constraint read
- cached normalized source-intake decision
- no-widening rule for Phase 1

#### Does Not Own

- adding TypeScript source types
- adding normalized external Catalog records
- changing Catalog UI or action behavior
- fetching PubParts in the browser at runtime
- completing the `Catalog-Gen2-1` family phase doc

#### Current Live Read

Known PubParts source endpoints:
- `https://pubparts.xyz/parts.json`
  - unfiltered source list for PubParts part records
  - known fields: `title`, `fabricationMethod`, `typeOfPart`, `imageSrc`, `platform`, `externalUrl`, `dropboxUrl`, `dropboxZipLastUpdated`
- filtered part JSON pages such as `https://pubparts.xyz/parts/gt.json`
  - page-scoped source lists for the matching PubParts browse route
  - expected to use the same known part-record field shape as `parts.json`
  - the filtered page segment is PubParts source routing, not a ParaHook platform enum
- `https://pubparts.xyz/resources.json`
  - source list for PubParts resource records
  - known fields: `title`, `typeOfResource`, `externalUrl`, `appStoreLink`, `playStoreLink`, `description`

Known part-field interpretation:
- `title` is source display text that can help seed a ParaHook item label but should not define final runtime identity by itself.
- `fabricationMethod` is source manufacturing vocabulary that may later map into ParaHook metadata or notes.
- `typeOfPart` is source part-type vocabulary that later phases must map into ParaHook-owned systems, part groups, and part types.
- `imageSrc` is source preview media and must stay distinct from repo-owned asset files.
- `platform` is source platform vocabulary and must be normalized later instead of becoming a ParaHook platform contract.
- `externalUrl` is the source item page or source handoff URL.
- `dropboxUrl` is linked archive or model handoff metadata, not an implicit local import.
- `dropboxZipLastUpdated` is freshness metadata for the linked archive handoff.

Known resource-field interpretation:
- `title` and `typeOfResource` are source resource labels.
- `externalUrl`, `appStoreLink`, and `playStoreLink` are source handoff links.
- `description` is source text that may later become attribution or source notes after normalization.

Checked browser-fetch/CORS constraint:
- PubParts JSON responses were checked as reachable JSON source pages.
- The checked responses did not advertise cross-origin browser access for production app fetch.
- Phase 1 therefore records direct production browser fetch as deferred until a later Manager-approved phase proves the browser runtime can fetch safely or routes fetch through an approved tooling/server path.
- This constraint does not make PubParts unusable; it only decides that the first implementation route should not depend on direct browser fetch from `pubparts.xyz`.

#### First Pass Decisions

- Treat PubParts records as external source truth.
- Treat ParaHook Catalog records as runtime truth.
- Preserve source fields for attribution, links, preview references, archive handoff, and freshness notes where useful.
- Map PubParts fields into ParaHook-owned Catalog metadata later instead of mirroring PubParts records as the runtime schema.
- Prefer a later `sourceKind: external` lane with `provider: pubparts`, but do not add that TypeScript contract in Phase 1.
- Start with repo-owned cached normalized source intake in the later approved implementation path.
- Keep direct browser refresh/fetch as later tooling, a server-backed sync path, or a later source-sync phase after the CORS constraint has been solved.
- Keep linked model/archive handling as metadata only until a later phase owns download, extraction, import, and add-to-project actions.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Phase 1 implementation is docs-only readiness work.

When Manager approves this phase for implementation, Worker should:
- update this Phase 1 section only as needed to mark the source-intake baseline accepted
- keep the endpoint list, known fields, browser-fetch/CORS read, and cached normalized source-intake decision intact
- update `docs/Doc-Log.md` for the docs-only implementation record
- avoid `docs/CHANGELOG.md` because no runtime behavior ships

There is no TypeScript code cut in Phase 1. If Worker finds that runtime code, source contracts, cached data files, normalizers, or UI behavior are required, Worker must stop and ask Manager to route that work into a later phase.

#### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-0 - Generation 2 Intake Readiness And Source Mapping Baseline.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not add runtime source contracts, cached data files, PubParts normalizers, UI actions, source labels, archive handoff behavior, import behavior, or Gen1 fitment fields in this phase.

Do not define final ParaHook platform, system, part-group, part-type, or fitment fields in Phase 1. Those decisions belong to later approved phases after the source-intake lane and Gen1 fitment gate are reviewed.

#### Implementation Risks

- Accidentally treating PubParts as the runtime schema.
- Accidentally promising direct browser fetch before CORS behavior is proven in the app.
- Letting readiness work expand into the real external source implementation.
- Treating filtered PubParts page names as ParaHook platform truth.
- Collapsing linked archive metadata into import or add-to-project behavior too early.
- Blurring PubParts source truth with ParaHook runtime truth.

#### Checklist

- [x] Phase 1 records `parts.json`, filtered part JSON pages, and `resources.json`.
- [x] Phase 1 records known PubParts part fields and resource fields.
- [x] Phase 1 records known field interpretation without making those fields ParaHook runtime truth.
- [x] Phase 1 records cached normalized source intake as the first implementation route.
- [x] Phase 1 records direct production browser fetch as deferred by the checked CORS constraint.
- [x] Phase 1 preserves the distinction between PubParts source truth and ParaHook runtime truth.
- [x] Phase 1 stays docs-only with no TypeScript contracts, cached data files, normalizer, UI change, or Gen1 fitment fields.
- [x] Phase 1 updates docs tracking.

#### Verification Shape

- Docs-only verification is enough for Phase 1 prep.
- If Worker changes only docs, Worker should not run runtime tests unless Manager asks.
- If Worker changes code by mistake, Worker must split that work into a later approved phase.
- Review the diff and confirm no non-doc files changed for Phase 1.
- Confirm `docs/CHANGELOG.md` is not updated for Phase 1 unless runtime behavior unexpectedly ships under explicit Manager direction.

#### Done Shape

Phase 1 is ready for Manager review when the endpoint baseline and source-intake decision are specific enough that `Catalog-Gen2-1` can build the external source contract without re-deciding whether PubParts is source truth, whether ParaHook owns runtime truth, or whether the first implementation depends on direct production browser fetch.

Phase 1 is complete only as a docs-readiness implementation. It does not complete `Catalog-Gen2-1`, create external Catalog entries, or decide platform and fitment normalization.

## [x] `Catalog-Gen2-0 / Phase 2` - `Live Catalog Seam Audit`

### Phase 2 Summary

#### Purpose

Audit the live Catalog source, action, browse, and filter seams so the external source implementation extends the current architecture instead of cutting across it.

#### Owns

- source contract audit
- source snapshot audit
- action-plan audit
- browse and filter audit
- search metadata audit
- item-page source-labeling audit
- `CatalogSurface` snapshot-creation audit
- likely file list for `Catalog-Gen2-1`

#### Does Not Own

- implementing `sourceKind: external`
- adding PubParts data
- adding UI source labels
- changing filters
- changing source snapshot behavior
- changing action behavior
- changing search behavior

#### Current Live Read

Source contract seam:
- `src/app/catalog/catalogItemContract.ts` defines `CATALOG_ITEM_SOURCE_KINDS` as `repo` and `imports` only.
- `CatalogRepoItemSource` has `sourceKind: 'repo'` and `assetPath`.
- `CatalogImportsItemSource` has `sourceKind: 'imports'`, `importId`, `assetPath`, and optional `catalogItemId`.
- `CatalogItemSourceRef` is the union of repo and imports sources only.
- `CatalogItemRecord` already carries the shared metadata that later external records must normalize into: `itemId`, `label`, `familyKey`, `sectionKey`, `tags`, optional `systemKey`, optional `platformCompatibility`, optional `partType`, optional `position`, optional `productName`, optional `brand`, optional `partGroups`, `description`, `assetKind`, `actionKind`, `source`, `previewMedia`, optional `notes`, optional `metadata`, and optional `projectUsageCount`.
- Source-kind checks currently assume every item is either repo-backed or imports-backed, so `Catalog-Gen2-1` must add an external branch deliberately instead of relying on fallthrough labels.

Source snapshot seam:
- `src/app/catalog/catalogSource.ts` defines `CatalogSourceSnapshot` with `repoItems`, `importsItems`, and `allItems`.
- `getCatalogRepoItems()` maps `CATALOG_REPO_SEED_ITEMS` into repo-backed `CatalogItemRecord` objects.
- `getCatalogImportsItems()` maps imported reference workspace records into imports-backed `CatalogItemRecord` objects.
- Imports that remember a repo `catalogItemId` copy repo metadata and add import-specific reuse metadata.
- Imports without a remembered repo item fall back to the `imports` family and section.
- `createCatalogSourceSnapshot()` counts imported usage by remembered `catalogItemId`, builds `repoItems`, builds `importsItems`, and returns `allItems: [...repoItems, ...importsItems]`.
- `selectCatalogItemsForSection()` reads from `snapshot.allItems`.

Action-plan seam:
- `src/app/catalog/catalogActionPlan.ts` defines action families as `reference` and `environment`.
- Action kinds come from the shared item contract: `load-preview`, `add-to-project`, and `apply-environment`.
- Environment items always resolve to `apply-environment`, no secondary action, no temporary preview, and downstream owner `viewer-environment`.
- Reference items with `load-preview` resolve to temporary Catalog-session preview only.
- Other reference items resolve primary action from the item, secondary `load-preview`, temporary preview allowed, preview owner `catalog-session`, and downstream owner `browser-project`.
- All current action specs are `available`.
- `Catalog-Gen2-1` should not add archive, external link, download, import, or source-page actions inside the Phase 2 prep lane.

Browse and section seam:
- `src/app/catalog/ui/catalogShellShared.ts` defines browse modes as `part` and `platform`.
- Section keys are derived from item data rather than hard-coded source-specific pages.
- Imports always resolve to the `imports` section.
- Environments resolve to the `hdris` section.
- Platform browse derives sections from `platformCompatibility` or falls back to `Other`.
- Part browse derives sections from `partGroups` or falls back to `partType` or `familyKey`.
- Section options count only repo-derived browse sections plus an `imports` section when imports exist.
- `all`, `imports`, and `hdris` have special base-item handling; other sections filter through derived browse section keys.

Filter and search seam:
- Current filter groups are `platformCompatibility`, `partType`, `partGroups`, `systemKey`, and `brand`.
- Filter options are built from the current section's search-filtered items.
- Selected filters are pruned when available filter values disappear.
- Search text matches `label`, `familyKey`, `sectionKey`, `description`, `tags`, `notes`, and metadata `label`/`value` pairs.
- Search placeholders and result summaries change by active section and browse mode, but they do not know about external source labels yet.

Item-page source labeling seam:
- `src/app/catalog/ui/CatalogShellItemPage.tsx` displays item page mode as `Catalog Item` for repo sources and `Imports Reuse` for every non-repo source.
- The detail metadata area displays `Imports` for imports, otherwise `formatCatalogSectionLabel(item.sectionKey)`.
- The source label displays `Repo-backed` for repo sources and `Imports reuse` for every non-repo source.
- The source path line renders `item.source.assetPath`, which exists on repo and imports sources.
- `Catalog-Gen2-1` must add external item-page labeling and source-path/source-link behavior explicitly when it adds an external source contract, because the current non-repo fallthrough would mislabel external items as imports reuse.

`CatalogSurface` snapshot-creation seam:
- `src/app/workspace/CatalogSurface.tsx` reads `referenceWorkspace` from `useAppStore`.
- It derives imports through `createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace)`.
- It creates the current snapshot with `createCatalogSourceSnapshot(importsSnapshot)` inside `useMemo`.
- Valid preview item IDs are derived from `catalogSnapshot.allItems` filtered through `resolveCatalogActionPlan(item).allowsTemporaryPreview`.
- Add-to-project and apply-environment handlers resolve commit/apply requests from the selected item and its resolved action plan.
- `CatalogSurface` passes the snapshot and handlers into `CatalogShell`.
- `Catalog-Gen2-1` will likely need to extend snapshot creation before UI browse/filter/item-page work can safely show external records.

#### First Pass Decisions

- `Catalog-Gen2-1 / Phase 1` should extend the shared Catalog contract and source snapshot path before changing UI behavior.
- External source work should preserve the existing repo/imports split and add a third lane only in the later approved implementation phase.
- The first external contract should normalize PubParts data into `CatalogItemRecord`-compatible runtime records rather than letting PubParts fields become direct UI/filter truth.
- External item-page labels and source links need explicit handling because current non-repo fallthrough reads as imports reuse.
- Existing browse sections, filters, and search can probably consume normalized external items after the source contract exists, but should not be changed during Phase 2 prep.

### Phase 2 Implementation Spec

#### Exact First Code Cut

Phase 2 implementation is docs-only readiness work.

When Manager approves this phase for implementation, Worker should:
- update this Phase 2 section only as needed to mark the live seam audit accepted
- keep the audited source contract, source snapshot, action plan, browse/filter/search, item-page labeling, and `CatalogSurface` snapshot-creation findings intact
- update `docs/Doc-Log.md` for the docs-only implementation record
- avoid `docs/CHANGELOG.md` because no runtime behavior ships

There is no TypeScript code cut in Phase 2. If Worker finds that runtime code, source contracts, external data, normalizers, UI labels, filters, or behavior changes are required, Worker must stop and ask Manager to route that work into `Catalog-Gen2-1` or another approved phase.

#### Likely Files

Phase 2 docs-only files:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-0 - Generation 2 Intake Readiness And Source Mapping Baseline.md`
- `docs/Doc-Log.md`

Likely `Catalog-Gen2-1 / Phase 1` implementation files:
- `src/app/catalog/catalogItemContract.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogActionPlan.ts`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/workspace/CatalogSurface.tsx`

#### No-Widening Rule

Do not add `sourceKind: external`, PubParts data, cached source files, PubParts normalizers, UI source labels, source-page actions, archive handoff actions, filters, search behavior, or snapshot behavior in Phase 2.

Do not mark `Catalog-Gen2-1` as implemented from this audit. Phase 2 only records the seams that the later external source contract must extend.

#### Implementation Risks

- Adding `external` to the source union during the audit instead of waiting for `Catalog-Gen2-1`.
- Letting the current non-repo item-page fallthrough mislabel future external items as imports reuse.
- Adding PubParts data before the cached normalized source intake phase is explicitly approved.
- Changing filters or browse sections before the external records are normalized into ParaHook-owned metadata.
- Treating external source-page or archive handoff as an existing action kind.

#### Checklist

- [x] Phase 2 records current source kinds and item source union.
- [x] Phase 2 records current source snapshot shape.
- [x] Phase 2 records current action families and action kinds.
- [x] Phase 2 records browse section logic.
- [x] Phase 2 records filter groups and search metadata.
- [x] Phase 2 records item-page source labeling and the non-repo fallthrough risk.
- [x] Phase 2 records `CatalogSurface` snapshot creation.
- [x] Phase 2 identifies likely `Catalog-Gen2-1 / Phase 1` implementation files.
- [x] Phase 2 preserves the no-widening boundary.
- [x] Phase 2 updates docs tracking.

#### Verification Shape

- Docs-only verification is enough unless code changes accidentally happen.
- Review the diff and confirm no non-doc files changed for Phase 2.
- Do not run runtime tests for Phase 2 prep unless code is unexpectedly touched.

#### Done Shape

Phase 2 is ready for Manager review when `Catalog-Gen2-1` has a concrete code seam list and no hidden dependency on guessed architecture.

Phase 2 is complete only after Manager accepts the docs-only seam audit. It does not add external source contracts, external data, UI labels, filters, actions, or runtime behavior.

## [x] `Catalog-Gen2-0 / Phase 3` - `Next Family Phase Handoff`

### Phase 3 Summary

#### Purpose

Create the `Catalog-Gen2-1` Family Phase Doc and record the Gen1 fitment gate before `Catalog-Gen2-3`.

#### Owns

- `Catalog-Gen2-1` Family Phase Doc creation
- first implementation phase ladder for source contract and PubParts normalization
- `Catalog-7 / Phase 4` gate routing before `Catalog-Gen2-3`
- first Worker prep target after `Catalog-Gen2-0` closes

#### Does Not Own

- implementing `Catalog-Gen2-1`
- completing `Catalog-7 / Phase 4`
- prepping `Catalog-7 / Phase 4`
- marking Gen2 HLG complete
- adding runtime code, cached data, normalizers, UI labels, or Gen1 fitment fields

#### Current Live Read

Accepted readiness inputs:
- `Catalog-Gen2-0 / Phase 1` accepted that PubParts JSON endpoints are source truth, ParaHook Catalog records remain runtime truth, direct production browser fetch is deferred by the checked CORS constraint, and the first implementation route should use repo-owned cached normalized source intake.
- `Catalog-Gen2-0 / Phase 2` accepted that current live Catalog seams have only `repo` and `imports` source kinds, `repoItems`, `importsItems`, and `allItems` in the source snapshot, `reference` and `environment` action families, `load-preview`, `add-to-project`, and `apply-environment` action kinds, metadata-derived browse/filter/search behavior, and item-page source labeling that would mislabel any future non-repo non-imports source unless external labeling is explicit.
- `Catalog-Gen2-Index.md` routes `Catalog-Gen2-1 - External Catalog Source Intake` as the next family phase after this readiness baseline.
- `Catalog-7 / Phase 4 - Wheel-Specific Motor And Tire Fitment Fields` remains a Gen1 local taxonomy gate before `Catalog-Gen2-3 - Platform And Fitment Normalization`, but it does not block creating or starting `Catalog-Gen2-1`.

#### First Pass Decisions

- Phase 3 implementation should create exactly one new family phase doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-1 - External Catalog Source Intake.md`.
- Phase 3 implementation should not implement `Catalog-Gen2-1`; it should create the plan surface that Manager can review and then dispatch one phase at a time.
- The new `Catalog-Gen2-1` doc should follow the current Architecture Setup family phase shape: `Doc Header`, `Doc Body`, `Vision`, `Wishlist Organization`, then top-level implementation phases.
- The new `Catalog-Gen2-1` doc should preserve Gen2 HLG/CLG coverage from the generation index without marking them complete during doc creation.
- The new `Catalog-Gen2-1` doc should define four small implementation phases:
  1. `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork`
  2. `Catalog-Gen2-1 / Phase 2 - Cached PubParts Source Intake Path`
  3. `Catalog-Gen2-1 / Phase 3 - External Items In Catalog Source Snapshot`
  4. `Catalog-Gen2-1 / Phase 4 - External Attribution And Linked Source Surfacing`
- The first Worker prep target after `Catalog-Gen2-0` closes should be `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork`.
- The `Catalog-7 / Phase 4` gate must remain explicit before `Catalog-Gen2-3`, with no attempt to implement or prep that Gen1 fitment phase inside `Catalog-Gen2-0 / Phase 3`.

### Phase 3 Implementation Spec

#### Exact First Code Cut

Phase 3 implementation is docs-only handoff work.

When Manager approves this Phase 3 prep, Worker should:
- create `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-1 - External Catalog Source Intake.md`
- update this `Catalog-Gen2-0` doc only as needed to mark Phase 3 complete and record the next Worker prep target
- update `docs/Doc-Log.md` for the docs-only implementation record
- avoid `docs/CHANGELOG.md` because no runtime behavior ships

The new `Catalog-Gen2-1` file should include:
- `## Doc Header`
  - `### Doc History`
  - `### Purpose`
  - `### Scope`
- `## Doc Body`
  - family phase goal for external source intake
  - boundary rules preserving PubParts source truth versus ParaHook runtime truth
  - current live read from `Catalog-Gen2-0 / Phase 1` and `Phase 2`
  - acceptance read that stops at planned implementation phases, not shipped external runtime behavior
- `## Vision`
  - Gen2 source intake should make curated external PubParts entries possible without weakening repo/imports ownership
  - source attribution, external page URLs, preview image URLs, linked archive URLs, and freshness notes should be preserved as source metadata while ParaHook owns runtime Catalog metadata
- `## Wishlist Organization`
  - High Level Goals: `Catalog-Gen2-HLG-1`, `Catalog-Gen2-HLG-2`, and `Catalog-Gen2-HLG-3`
  - Codex Level Goals: `Catalog-Gen2-CLG-1`, `Catalog-Gen2-CLG-2`, and `Catalog-Gen2-CLG-3`
  - phase breakdown for the four implementation phases below
- `## [ ] Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork`
  - owns the first external source contract shape and PubParts raw/normalized type groundwork
  - should preserve source fields needed for attribution, links, preview images, archive URLs, and freshness notes
  - does not own cached PubParts records, snapshot merging, UI source labels, archive download/import, or fitment normalization
- `## [ ] Catalog-Gen2-1 / Phase 2 - Cached PubParts Source Intake Path`
  - owns a repo-owned cached PubParts source module or fixture-backed intake path
  - should not rely on direct production browser fetch
  - does not own broad live sync, archive extraction, or UI behavior
- `## [ ] Catalog-Gen2-1 / Phase 3 - External Items In Catalog Source Snapshot`
  - owns merging normalized external items into `CatalogSourceSnapshot` as `externalItems`
  - must keep `repoItems`, `importsItems`, `externalItems`, and `allItems` distinct
  - does not own UI labeling beyond whatever is required to keep source lanes technically distinct
- `## [ ] Catalog-Gen2-1 / Phase 4 - External Attribution And Linked Source Surfacing`
  - owns surfacing external PubParts entries with explicit source attribution and external-linked labeling
  - should preserve repo/imports/external distinction in item cards and item pages
  - does not own archive download, extraction, import, Gen1 fitment fields, or Gen3 compatibility verdicts

The new `Catalog-Gen2-1` doc should name `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork` as the first Worker prep target.

#### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-1 - External Catalog Source Intake.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement external source code in Phase 3.

Do not create TypeScript source contracts, PubParts cached data, fixture data, source modules, normalizers, snapshot behavior, UI source labels, filters, action kinds, archive handoff behavior, Gen1 fitment fields, or compatibility checks.

Do not create `Catalog-Gen2-1` during Phase 3 prep. Creation belongs to the separately approved Phase 3 implementation assignment.

Do not implement or prep `Catalog-7 / Phase 4` here. Only preserve the gate before `Catalog-Gen2-3`.

#### Implementation Risks

- Creating `Catalog-Gen2-1` during prep instead of waiting for Manager implementation approval.
- Making the new `Catalog-Gen2-1` doc too broad by hiding several implementation slices inside one phase.
- Forgetting that `Catalog-7 / Phase 4` gates `Catalog-Gen2-3`, not `Catalog-Gen2-1`.
- Marking Gen2 HLG or CLG complete when Phase 3 only creates the next planning surface.
- Letting the handoff imply direct production browser fetch or live PubParts sync is the first implementation route.
- Letting external-linked surfacing collapse into archive download, extraction, import, or add-to-project behavior too early.

#### Checklist

- [x] Phase 3 defines the exact `Catalog-Gen2-1` file path.
- [x] Phase 3 defines the new `Catalog-Gen2-1` top-level doc shape.
- [x] Phase 3 defines four small `Catalog-Gen2-1` implementation phases.
- [x] Phase 3 records Phase 1 as external source contract and PubParts type groundwork.
- [x] Phase 3 records Phase 2 as cached PubParts source module or fixture-backed intake path.
- [x] Phase 3 records Phase 3 as `externalItems` source snapshot merging while keeping source arrays distinct.
- [x] Phase 3 records Phase 4 as explicit PubParts source attribution and external-linked surfacing.
- [x] Phase 3 preserves the `Catalog-7 / Phase 4` gate before `Catalog-Gen2-3`.
- [x] Phase 3 records `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork` as the next Worker prep target.
- [x] Phase 3 updates docs tracking.

#### Verification Shape

- Docs-only verification is enough unless code changes accidentally happen.
- Review the diff and confirm no non-doc files changed for Phase 3 prep.
- Do not run runtime tests for Phase 3 prep unless code is unexpectedly touched.

#### Done Shape

Phase 3 is ready for Manager review when the `Catalog-Gen2-1` creation shape, four-phase ladder, `Catalog-7 / Phase 4` gate, and next Worker prep target are unambiguous.

`Catalog-Gen2-0` is complete only after Manager approves Phase 3 implementation, Worker creates `Catalog-Gen2-1`, and the next Worker prep target is recorded as `Catalog-Gen2-1 / Phase 1 - External Source Contract And PubParts Type Groundwork`.

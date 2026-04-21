# Catalog-Gen2-1 - External Catalog Source Intake

## Doc Header

### Doc History
14. 2026-04-20 13:51:16: Implemented `Catalog-Gen2-1 / Phase 4` by intentionally composing cached PubParts source items into live `CatalogSurface`, adding source-aware external-linked PubParts labels and item-page source details, preserving remote preview through the existing load-preview path, and avoiding fetch, live sync, archive/import/add-to-project behavior, platform/fitment normalization, Gen2-2 linked archive handoff, `Catalog-7 / Phase 4`, and Gen3 compatibility.
13. 2026-04-20 13:47:32: Prepped `Catalog-Gen2-1 / Phase 4` into a decision-complete implementation spec for intentionally wiring cached PubParts source items into live `CatalogSurface`, adding external-linked PubParts attribution across shared card/item-page labels, replacing imports fallback and `assetPath` assumptions for external entries, and preserving the no-fetch/no-archive/no-fitment/no-Gen2-2 boundary.
12. 2026-04-20 13:44:35: Implemented `Catalog-Gen2-1 / Phase 3` with an explicit external snapshot lane that defaults empty, maps cached PubParts normalized source items into minimal external `CatalogItemRecord`s only when passed into snapshot creation, preserves repo/import behavior, and avoids live CatalogSurface wiring, UI labels, archive behavior, platform/fitment normalization, `Catalog-7 / Phase 4`, and Gen3 compatibility.
11. 2026-04-20 13:41:30: Revised `Catalog-Gen2-1 / Phase 3` prep so the source snapshot gains an explicit external lane and mapping capability without automatically surfacing cached PubParts entries in the live Catalog UI; `createCatalogSourceSnapshot` should default to no external items and only include them when a caller explicitly passes external input.
10. 2026-04-20 13:40:00: Prepped `Catalog-Gen2-1 / Phase 3` into a decision-complete implementation spec for adding a distinct `externalItems` lane to `CatalogSourceSnapshot`, mapping the Phase 2 cached PubParts normalized source items into minimal live `CatalogItemRecord`s while keeping ParaHook runtime fields authoritative and deferring UI labels, filters/search changes, archive behavior, platform/fitment normalization, `Catalog-7 / Phase 4`, and Gen3 compatibility.
9. 2026-04-20 13:38:33: Repaired `Catalog-Gen2-1 / Phase 2` doc truthfulness after exact live sampled cached records replaced the earlier invented examples; Phase 2 now records array-shaped cached metadata while scalar proof remains in the Phase 1 helper tests.
8. 2026-04-20 13:37:13: Repaired `Catalog-Gen2-1 / Phase 2` cached source sample exactness by updating the tiny PubParts cache and focused tests to the manager-verified live `parts.json`, `parts/gt.json`, and `resources.json` values while preserving all Phase 2 no-widening boundaries.
7. 2026-04-20 13:34:37: Repaired `Catalog-Gen2-1 / Phase 2` cached source data truthfulness by replacing invented cached PubParts examples with tiny real sampled records from `parts.json`, `parts/gt.json`, and `resources.json`, while keeping the cache small and avoiding live fetch, live sync, Catalog item creation, snapshot/UI/action/archive/fitment widening, and Phase 3 prep.
6. 2026-04-20 13:31:46: Implemented `Catalog-Gen2-1 / Phase 2` with tiny repo-owned cached PubParts source slices for all-parts, filtered GT parts, and resources, normalized through the Phase 1 helpers with scalar, array-shaped, and missing-optional examples while avoiding browser fetch, live sync, Catalog item creation, snapshot merging, `externalItems`, UI behavior, archive import, fitment normalization, and `Catalog-7 / Phase 4`.
5. 2026-04-20 13:28:09: Prepped `Catalog-Gen2-1 / Phase 2` into a decision-complete implementation spec for tiny repo-owned cached PubParts source intake covering all-parts, filtered-platform, and resources endpoint shapes, including scalar and array metadata examples routed through the Phase 1 helpers without browser fetch, snapshot merging, UI surfacing, archive behavior, or fitment work.
4. 2026-04-20 13:26:29: Repaired the accepted `Catalog-Gen2-1 / Phase 1` PubParts helper groundwork after live source samples showed part `fabricationMethod`, `typeOfPart`, `platform`, and resource `typeOfResource` can be arrays of strings; normalized metadata now preserves scalar strings and string arrays without adding cached data, snapshot merging, UI behavior, or Phase 2 prep.
3. 2026-04-20 13:20:09: Implemented `Catalog-Gen2-1 / Phase 1` with the generic `external` source branch, reusable external provider/source metadata, PubParts raw and normalized source item type groundwork, focused contract/helper tests, and no cached data, source snapshot expansion, UI surfacing, archive behavior, or Gen1 fitment work.
2. 2026-04-20 13:15:26: Prepped `Catalog-Gen2-1 / Phase 1` into a decision-complete implementation spec for a generic `external` source contract, PubParts provider metadata and raw/normalized type groundwork, focused contract tests, and strict no-cached-data/no-snapshot/no-UI boundaries.
1. 2026-04-20 13:06:35: Created this `Catalog-Gen2-1` Family Phase Doc from the accepted `Catalog-Gen2-0` readiness baseline, routing external source contract work, cached PubParts intake, external source snapshot merging, and explicit external attribution into four small implementation phases.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-1`.

Use it to answer:
- how PubParts enters Catalog as an external source without replacing ParaHook runtime truth
- which external source contract and PubParts type groundwork should land first
- how cached PubParts intake should avoid direct production browser fetch
- how external items should enter `CatalogSourceSnapshot` without weakening `repo` and `imports`
- when external attribution and linked-source surfacing belongs in the UI
- which Worker prep target comes next

### Scope

This doc covers:
- external source contract and PubParts raw/normalized type groundwork
- repo-owned cached PubParts source intake planning
- external items in the Catalog source snapshot
- external attribution and source-linked surfacing
- the first Worker prep target after `Catalog-Gen2-0`

This doc does not cover:
- linked archive download, extraction, or import behavior
- direct production browser fetch from PubParts
- broad live source sync
- platform and fitment normalization
- completing `Catalog-7 / Phase 4`
- Gen3 compatibility verdicts

## Doc Body

### Family Phase Goal

`Catalog-Gen2-1` starts the external Catalog source implementation without letting PubParts become ParaHook's runtime schema.

The implementation ladder should first add the external source contract and PubParts type groundwork, then add a repo-owned cached intake path, then merge normalized external items into the source snapshot as a distinct lane, and only then surface those entries with explicit external attribution.

### Boundary Rules

- PubParts records are source truth.
- ParaHook Catalog records are runtime truth.
- `repo`, `imports`, and later `external` lanes must stay distinct.
- Direct production browser fetch remains deferred by the `Catalog-Gen2-0 / Phase 1` CORS read.
- `Catalog-7 / Phase 4` does not block `Catalog-Gen2-1`.
- `Catalog-7 / Phase 4` must be complete or explicitly re-checked before `Catalog-Gen2-3`.
- Archive download, extraction, import, and add-to-project handoff belong to later approved phases.
- Worker must prep each implementation phase before implementation.

### Current Live Read

Accepted readiness inputs from `Catalog-Gen2-0`:
- PubParts source endpoints are `parts.json`, filtered part JSON pages, and `resources.json`.
- Known PubParts part fields include `title`, `fabricationMethod`, `typeOfPart`, `imageSrc`, `platform`, `externalUrl`, `dropboxUrl`, and `dropboxZipLastUpdated`.
- Known PubParts resource fields include `title`, `typeOfResource`, `externalUrl`, `appStoreLink`, `playStoreLink`, and `description`.
- Live PubParts samples show part `fabricationMethod`, `typeOfPart`, and `platform` can be scalar strings or arrays of strings.
- Live PubParts samples show resource `typeOfResource` can be a scalar string or an array of strings.
- Current Catalog source kinds are `repo` and `imports` only.
- Current `CatalogSourceSnapshot` has `repoItems`, `importsItems`, and `allItems`.
- Current actions are `load-preview`, `add-to-project`, and `apply-environment`.
- Current browse, filter, and search behavior derives from ParaHook item metadata.
- Current item-page source labeling treats non-repo items as imports reuse, so external items need explicit source labeling before surfacing.

### Acceptance Read

This family phase is complete when:
- external source contract and PubParts type groundwork have shipped
- cached PubParts intake exists without depending on direct production browser fetch
- `CatalogSourceSnapshot` carries `externalItems` while preserving `repoItems`, `importsItems`, and `allItems`
- external PubParts entries surface with explicit source attribution and external-linked labeling
- linked archive import, Gen1 fitment, and Gen3 compatibility work remain routed to later phases

## Vision

`Catalog-Gen2-1` should make curated external PubParts entries possible without weakening the Catalog ownership split that already separates curated repo assets from user imports.

PubParts should provide source data, source URLs, preview image URLs, linked archive URLs, and freshness notes. ParaHook should own the normalized Catalog metadata, source lane, item identity, browse/filter/search fields, and user-facing source labels.

The first user-visible result should read as a distinct external-linked Catalog entry, not as a repo-backed item and not as an imported project copy.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-1. keep curated repo assets and later curated external-linked entries distinct even when they appear near each other in the Catalog surface`
- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-1. Add a PubParts source-adapter planning lane that uses `.json` page endpoints as structured source intake while preserving PubParts attribution, links, preview images, archive URLs, and freshness metadata.
- [ ] Catalog-Gen2-CLG-2. Define external source metadata on Catalog entries without weakening the existing repo-backed and imports source split.
- [ ] Catalog-Gen2-CLG-3. Map PubParts platform and part-type language into ParaHook-owned platform families, systems, part groups, and item metadata.

### `Catalog-Gen2-1 / Phase 1`

- [x] Define the external source contract shape.
- [x] Define PubParts raw source types.
- [x] Define PubParts normalized source item groundwork.
- [x] Preserve attribution, source links, preview image URLs, archive URLs, and freshness fields as source metadata.
- [x] Do not add cached PubParts records.
- [x] Do not surface external entries in UI.
- [ ] `Catalog-Gen2-HLG-1`
- [ ] `Catalog-Gen2-HLG-2`
- [ ] `Catalog-Gen2-HLG-3`
- [ ] Catalog-Gen2-CLG-1.
- [ ] Catalog-Gen2-CLG-2.
- [ ] Catalog-Gen2-CLG-3.

### `Catalog-Gen2-1 / Phase 2`

- [x] Add a repo-owned cached PubParts source module or fixture-backed intake path.
- [x] Keep direct production browser fetch deferred.
- [x] Normalize cached PubParts source records through the Phase 1 groundwork.
- [x] Do not merge external records into the live Catalog source snapshot.
- [ ] `Catalog-Gen2-HLG-2`
- [ ] `Catalog-Gen2-HLG-3`
- [ ] Catalog-Gen2-CLG-1.
- [ ] Catalog-Gen2-CLG-3.

### `Catalog-Gen2-1 / Phase 3`

- [x] Merge normalized external items into `CatalogSourceSnapshot` as `externalItems`.
- [x] Keep `repoItems`, `importsItems`, `externalItems`, and `allItems` distinct.
- [x] Preserve existing repo-backed and imports behavior.
- [x] Do not add final user-facing external labels beyond what is technically required to keep source lanes distinct.
- [ ] `Catalog-Gen2-HLG-1`
- [ ] `Catalog-Gen2-HLG-2`
- [ ] Catalog-Gen2-CLG-2.

### `Catalog-Gen2-1 / Phase 4`

- [x] Surface external PubParts entries with explicit source attribution.
- [x] Add external-linked labeling that does not read as repo-backed or imports reuse.
- [x] Preserve PubParts source page and linked-source metadata in the item surface.
- [x] Do not add archive download, extraction, import, Gen1 fitment fields, or Gen3 compatibility verdicts.
- [ ] `Catalog-Gen2-HLG-1`
- [ ] `Catalog-Gen2-HLG-2`
- [ ] `Catalog-Gen2-HLG-3`
- [ ] Catalog-Gen2-CLG-1.
- [ ] Catalog-Gen2-CLG-2.

## [x] `Catalog-Gen2-1 / Phase 1` - `External Source Contract And PubParts Type Groundwork`

### Phase 1 Summary

#### Purpose

Add the first external source contract and PubParts type groundwork so later phases can normalize cached PubParts records into ParaHook Catalog items.

#### Owns

- generic `sourceKind: 'external'` contract shape
- provider metadata that can represent PubParts without making the whole external contract PubParts-only
- source collection labels
- source URLs and external item page URLs
- preview image link metadata
- linked archive URL metadata
- freshness and archive-update metadata
- PubParts raw part and resource type groundwork
- PubParts normalized source item type groundwork
- focused contract/type helper tests

#### Does Not Own

- cached PubParts data or fixtures
- direct production browser fetch
- normalizing records into live `CatalogItemRecord` objects
- merging external items into `CatalogSourceSnapshot`
- UI source labels
- item page rendering
- archive download, extraction, or import behavior
- platform and fitment normalization
- `Catalog-7 / Phase 4`

#### Current Live Read

Current Catalog source kinds are `repo` and `imports` only. `CatalogItemRecord` already carries normalized ParaHook metadata such as family, section, tags, systems, platform compatibility, part groups, preview media, notes, and metadata rows.

Current item-page source labeling falls through to imports reuse for non-repo sources, so external surfacing should wait until a later phase explicitly owns labels.

The current imports-only helper is `isCatalogItemImportsEntry(item)`, and it should remain true only for `item.source.sourceKind === 'imports'` after the generic external lane is added.

The current repo preview helpers, `resolveCatalogRepoReferencePreviewSource(item)` and `resolveCatalogRepoEnvironmentSource(item)`, are guarded by `item.source.sourceKind === 'repo'`. They should keep returning `null` for external items after Phase 1.

Current `CatalogSourceSnapshot` has only `repoItems`, `importsItems`, and `allItems`. Phase 1 should not add `externalItems`; that belongs to `Catalog-Gen2-1 / Phase 3`.

#### First Pass Decisions

- Add generic `sourceKind: 'external'` before adding cached source records.
- Keep provider metadata generic enough for future providers, with PubParts represented through provider fields rather than a `sourceKind: 'pubparts'`.
- Keep PubParts raw fields separate from normalized ParaHook Catalog fields.
- Preserve PubParts source metadata even when only a subset maps into runtime browse/filter fields.
- Add type/helper groundwork that tolerates missing optional PubParts fields and unknown provider-ish values without throwing.
- Keep the implementation free of cached PubParts records, fixtures, live source snapshot merging, and UI source labels.
- Treat `Catalog-Gen2-1 / Phase 1` as the next Worker prep target.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Worker should implement only the external source contract and PubParts type groundwork.

The first code cut should:
- add `external` to `CATALOG_ITEM_SOURCE_KINDS`
- add a `CatalogExternalItemSource` or equivalent source-ref branch with `sourceKind: 'external'`
- keep `sourceKind` generic as `external`, not `pubparts`
- include provider metadata that can represent PubParts, such as provider id/name and optional source collection labels
- include source URL metadata for the source page or external item page
- include preview image link metadata as source metadata, not repo-owned preview assets
- include linked archive URL metadata for PubParts `dropboxUrl`-style handoff
- include freshness/archive update metadata for fields such as `dropboxZipLastUpdated`
- add PubParts raw source type groundwork for part and resource records
- add normalized PubParts source item type groundwork that can later map into ParaHook `CatalogItemRecord` metadata
- add small helpers or guards only where useful to keep optional source fields safe
- add focused tests for source kind guards and PubParts type/helper behavior

The implementation must not:
- add cached PubParts records or fixture data
- normalize PubParts records into live Catalog items
- merge external entries into `CatalogSourceSnapshot`
- add `externalItems`
- change Catalog UI source labels, cards, item pages, filters, actions, or snapshot behavior
- add archive download, extraction, import, or add-to-project behavior
- perform platform/fitment normalization or `Catalog-7 / Phase 4` work

#### Likely Files

- `src/app/catalog/catalogItemContract.ts`
- likely new PubParts/source helper module under `src/app/catalog/`
- focused tests near the changed catalog contract or helper
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-1` family phase doc

#### No-Widening Rule

Do not add cached PubParts data, fixture data, direct browser fetch, normalizer output records, live Catalog items, `externalItems`, snapshot merging, UI labels, item-page rendering, filters, action kinds, archive actions, import behavior, Gen1 fitment fields, or Gen3 compatibility behavior in Phase 1.

#### Implementation Risks

- Letting PubParts raw fields become ParaHook runtime fields.
- Adding sample data before the source contract is stable.
- Accidentally making external entries look like imports reuse.
- Implementing platform or fitment normalization too early.
- Naming the source kind `pubparts` instead of the reusable generic `external`.
- Hard-coding all external-source metadata around PubParts when the source contract should support future providers.
- Breaking imports-only helper behavior by treating all non-repo items as imports.
- Letting repo-only preview helpers try to resolve external URLs as repo assets.
- Adding `externalItems` before Phase 3 owns snapshot merging.

#### Checklist

- [x] Phase 1 prep confirms `src/app/catalog/catalogItemContract.ts` owns the generic `sourceKind: 'external'` branch.
- [x] Phase 1 prep confirms provider metadata represents PubParts without naming the source kind `pubparts`.
- [x] Phase 1 prep confirms source collection labels, source URLs, preview image links, linked archive URLs, and freshness/archive update fields are source metadata.
- [x] Phase 1 prep confirms PubParts raw part and resource type groundwork.
- [x] Phase 1 prep confirms normalized PubParts source item type groundwork.
- [x] Phase 1 prep confirms optional PubParts fields and unknown provider-ish values should be tolerated by helpers without crashing.
- [x] Phase 1 prep confirms no cached PubParts data or fixtures.
- [x] Phase 1 prep confirms no live Catalog item normalization, source snapshot merging, `externalItems`, or UI source labels.
- [x] Phase 1 prep confirms no archive download/extraction/import, platform/fitment normalization, or `Catalog-7 / Phase 4` work.
- [x] Phase 1 prep names focused contract/helper tests and `npm.cmd run build`.
- [x] Phase 1 prep records required tracking docs.

#### Verification Shape

- Focused contract/helper tests should cover:
  - `isCatalogItemSourceKind('external')` returns true after the source kind is added.
  - `isCatalogItemImportsEntry(item)` remains true only for imports-backed items.
  - `resolveCatalogRepoReferencePreviewSource(item)` remains repo-only and returns `null` for external items.
  - `resolveCatalogRepoEnvironmentSource(item)` remains repo-only and returns `null` for external items.
  - PubParts raw/normalized type helpers tolerate missing optional fields.
  - PubParts raw/normalized type helpers tolerate unknown provider-ish values without crashing.
  - no external snapshot or UI behavior appears in Phase 1.
- `npm.cmd run build`.

#### Done Shape

Phase 1 is ready for Manager review when the external source contract and PubParts type groundwork are narrow enough to implement without cached data, fixture data, live Catalog item normalization, snapshot merging, UI changes, archive behavior, Gen1 fitment work, or Gen3 compatibility behavior.

## [x] `Catalog-Gen2-1 / Phase 2` - `Cached PubParts Source Intake Path`

### Phase 2 Summary

#### Purpose

Add the repo-owned cached PubParts source module or fixture-backed intake path that later phases can normalize into external Catalog records.

#### Owns

- tiny repo-owned cached PubParts source module and source-data files
- all-parts cached intake matching the `parts.json` source shape
- filtered-platform cached intake matching a filtered endpoint such as `parts/gt.json`
- resources cached intake matching the `resources.json` source shape
- sample source records small enough for focused verification, not a broad PubParts mirror
- array-shaped live-like metadata examples, with scalar-shape proof remaining in the Phase 1 helper tests
- source freshness and attribution preservation
- no-direct-browser-fetch rule
- normalization through the Phase 1 PubParts raw/normalized helpers
- focused cached-intake tests

#### Does Not Own

- broad live PubParts sync
- direct production browser fetch
- complete PubParts catalog mirroring
- live `CatalogItemRecord` creation
- snapshot merging
- `externalItems`
- UI surfacing
- Catalog labels, filters, search metadata, or actions
- archive download, extraction, or import
- platform and fitment normalization
- `Catalog-7 / Phase 4`

### Phase 2 Implementation Spec

#### Exact First Code Cut

Worker should implement only the cached/repo-owned PubParts source intake path.

The first code cut should:
- add a small PubParts cached source module under `src/app/catalog/`
- add tiny repo-owned cached source data files under `src/app/catalog/pubpartsSourceData/`
- represent three endpoint families:
  - all-parts cache for `parts.json`
  - filtered-platform cache for a filtered part page such as `parts/gt.json`
  - resources cache for `resources.json`
- keep cached records intentionally tiny, with enough records to prove shape coverage only
- include exact tiny live sampled source records rather than invented examples
- include filtered-platform part records with array-shaped `fabricationMethod`, `typeOfPart`, and `platform`, including live-like platform arrays such as `Floatwheel`, `GT/GT-S`, `Pint/X/S`, `XR Classic`, and `XR/Funwheel`
- include at least one resource record with array-shaped `typeOfResource`
- include at least one record with missing optional source fields so optional-field tolerance stays proven
- preserve source attribution, source URLs, external item URLs, preview image URLs, linked archive URLs, freshness/archive update fields, and array metadata from cached records
- route cached part records through `normalizePubPartsPartSourceItem`
- route cached resource records through `normalizePubPartsResourceSourceItem`
- return normalized PubParts source items only, not live `CatalogItemRecord` objects
- expose separate read helpers for all-parts, filtered-platform parts, and resources so later phases can compose the intake without guessing which source slice is being read

The implementation must not:
- fetch PubParts from the production browser
- add a live sync job or background refresh path
- add a broad mirror of PubParts data
- normalize cached records into live `CatalogItemRecord` objects
- merge anything into `CatalogSourceSnapshot`
- add `externalItems`
- change Catalog UI source labels, cards, item pages, filters, search metadata, actions, or snapshot behavior
- add archive download, extraction, import, or add-to-project behavior
- perform platform/fitment normalization or `Catalog-7 / Phase 4` work

#### Cached Source Shape

Use the smallest shape that still matches the known endpoint families:
- `parts.json` cache: a readonly array of `PubPartsRawPartRecord` values representing the all-parts source.
- `parts/gt.json` cache: a readonly array of `PubPartsRawPartRecord` values representing one filtered platform source slice.
- `resources.json` cache: a readonly array of `PubPartsRawResourceRecord` values representing resource source records.

The cached source module should carry source-set metadata near the records, such as:
- source set id, for example `parts`, `parts/gt`, or `resources`
- source collection label, for example `All Parts`, `GT Parts`, or `Resources`
- source URL for the corresponding PubParts JSON endpoint
- cached-at or source-read timestamp if the implementation needs a freshness field for the source set

Record-level source metadata should remain on the raw records and normalization output:
- source/external item URLs from `externalUrl`
- preview image links from `imageSrc`
- linked archive URLs from `dropboxUrl`
- archive freshness from `dropboxZipLastUpdated`
- array metadata from `fabricationMethod`, `typeOfPart`, `platform`, and `typeOfResource`

#### Likely Files

- `src/app/catalog/pubPartsCachedSource.ts`
- `src/app/catalog/pubPartsCachedSource.test.ts`
- `src/app/catalog/pubPartsSource.ts`
- `src/app/catalog/pubpartsSourceData/parts.ts`
- `src/app/catalog/pubpartsSourceData/partsGt.ts`
- `src/app/catalog/pubpartsSourceData/resources.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-1` family phase doc

#### No-Widening Rule

Do not fetch PubParts directly in the production browser, add live source sync, broaden into a full PubParts mirror, create live Catalog items, add `externalItems`, merge into `CatalogSourceSnapshot`, surface external entries in Catalog UI, change labels/filters/search/actions, add archive download/extraction/import, perform platform/fitment normalization, or do `Catalog-7 / Phase 4` work during Phase 2.

#### Implementation Risks

- Accidentally turning tiny cached source examples into a broad PubParts mirror.
- Treating cached raw records as ParaHook runtime truth instead of source truth.
- Collapsing live-like array fields back into blank metadata.
- Letting filtered-platform source slices imply ParaHook platform compatibility before the later platform/fitment normalization work.
- Creating `CatalogItemRecord` objects too early.
- Adding `externalItems` before Phase 3 owns snapshot merging.
- Surfacing external entries in UI before Phase 4 owns attribution and labels.

#### Checklist

- [x] Phase 2 prep confirms the cached intake is repo-owned and has no direct production browser fetch.
- [x] Phase 2 prep confirms tiny source-data files cover `parts.json`, filtered part JSON such as `parts/gt.json`, and `resources.json`.
- [x] Phase 2 prep confirms cached examples stay small and intentional, not a broad PubParts mirror.
- [x] Phase 2 prep confirms cached examples use exact tiny live sampled records with array-shaped metadata, while scalar-shape proof remains in Phase 1 helper tests.
- [x] Phase 2 prep confirms cached part records route through `normalizePubPartsPartSourceItem`.
- [x] Phase 2 prep confirms cached resource records route through `normalizePubPartsResourceSourceItem`.
- [x] Phase 2 prep confirms source attribution, source URLs, preview image URLs, archive links, freshness fields, and array metadata are preserved.
- [x] Phase 2 prep confirms no live `CatalogItemRecord` creation, source snapshot merge, `externalItems`, UI/filter/action behavior, archive import behavior, platform/fitment normalization, or `Catalog-7 / Phase 4` work.
- [x] Phase 2 prep names focused cached-intake tests and `npm.cmd run build`.
- [x] Phase 2 prep records required tracking docs.

#### Verification Shape

- Focused cached source intake tests should cover:
  - all-parts cached intake returns normalized PubParts source items from the `parts.json` source slice.
  - filtered-platform cached intake returns normalized PubParts source items from the `parts/gt.json` source slice.
  - resources cached intake returns normalized PubParts source items from the `resources.json` source slice.
  - array-shaped cached part metadata is preserved in stable normalized metadata.
  - array-shaped resource `typeOfResource` metadata is preserved in stable normalized metadata.
  - missing optional fields do not crash and normalize to safe defaults.
  - no `CatalogSourceSnapshot.externalItems` behavior appears in Phase 2.
  - no Catalog UI/filter/action behavior changes appear in Phase 2.
- `npm.cmd run build`.

#### Done Shape

Phase 2 is ready for Manager review when tiny repo-owned PubParts source slices can be read and normalized through the Phase 1 helpers, with exact live sampled array metadata preserved, and without direct browser fetch, live sync, live Catalog item creation, source snapshot merging, `externalItems`, UI/filter/action changes, archive import behavior, platform/fitment normalization, or `Catalog-7 / Phase 4` work.

## [x] `Catalog-Gen2-1 / Phase 3` - `External Items In Catalog Source Snapshot`

### Phase 3 Summary

#### Purpose

Merge normalized external items into the Catalog source snapshot as a third source lane while preserving existing repo and imports behavior.

#### Owns

- `externalItems` in `CatalogSourceSnapshot`
- `repoItems`, `importsItems`, `externalItems`, and `allItems` distinction
- minimal mapping capability from Phase 2 normalized PubParts source items into live `CatalogItemRecord`s for explicitly composed snapshots
- optional external source input or external item input to snapshot creation, defaulting to no external items
- external source identity using `sourceKind: 'external'`
- source metadata preservation on the external `CatalogItemRecord.source` branch and metadata rows
- snapshot creation extension
- focused proof that repo/imports behavior remains stable

#### Does Not Own

- final UI source attribution labels
- Catalog card or item-page source-label design
- Catalog filter/search behavior changes
- live `CatalogSurface` wiring for cached PubParts entries unless a compile-only type update is required
- archive download, extraction, import, add-to-project, or linked archive handoff behavior
- archive download, extraction, or import
- platform and fitment normalization
- `Catalog-7 / Phase 4`
- Gen3 compatibility verdicts

### Phase 3 Implementation Spec

#### Exact First Code Cut

Worker should implement only the external source snapshot lane.

The first code cut should:
- extend `CatalogSourceSnapshot` to include `externalItems: CatalogItemRecord[]`
- keep `repoItems`, `importsItems`, `externalItems`, and `allItems` as distinct arrays
- keep the default live snapshot behavior repo + imports by making `externalItems` default to an empty array
- include external items in `allItems` only when external input is explicitly passed into snapshot creation
- keep `allItems` ordered as repo items, imports items, then external items for snapshots that explicitly include external input unless implementation finds an existing stronger ordering pattern
- add an optional external source input or external item input to `createCatalogSourceSnapshot(...)`
- avoid reading Phase 2 cached PubParts records internally on every live snapshot
- expose mapping capability that can turn Phase 2 cached PubParts normalized source items into minimal live `CatalogItemRecord`s when a caller explicitly composes that lane
- make external item ids stable and obviously external, for example `external:pubparts:<slug-or-index>`
- use `source.sourceKind: 'external'`
- keep external sources free of `assetPath`; the existing `assetPath?: never` contract should remain protective
- preserve provider metadata as PubParts provider fields, not as a new source kind
- preserve source URLs, external item URLs, preview image URLs, linked archive URLs, `sourceLastUpdated`, and `archiveLastUpdated` on the `source` branch
- preserve PubParts source metadata in `metadata` rows using clearly source-owned labels
- set enough ParaHook runtime fields for the item to be a real `CatalogItemRecord`:
  - `label` from the normalized source title
  - `familyKey` and `sectionKey` as external/PubParts-owned buckets that do not pretend to be repo families
  - `tags` with source-lane tags such as `external`, `pubparts`, and source record kind
  - `description` as source-context text, not a compatibility verdict
  - `assetKind: 'reference-asset'`
  - `actionKind: 'load-preview'` so external items do not expose `add-to-project`, archive import, or environment apply behavior
  - `previewMedia` from the external preview image URL when present, using remote URL handling already supported by preview media resolution
  - `projectUsageCount: 0`
- avoid final user-facing source-label/card/item-page work beyond compile/type safety
- keep `CatalogSurface` behavior repo + imports during Phase 3
- move live `CatalogSurface` wiring of cached PubParts external items to Phase 4, when correct source labels and attribution are owned
- limit any `CatalogSurface` edit to compile-only type adaptation if TypeScript requires it

The implementation must not:
- fetch PubParts from the production browser
- add live sync or background refresh
- broaden the cached PubParts source data
- add archive download, extraction, import, or add-to-project behavior
- use `add-to-project` for external PubParts entries
- add final UI source attribution labels, cards, item-page rendering, filter groups, search semantics, or action families
- wire cached PubParts entries into the live Catalog UI
- perform platform/fitment normalization or `Catalog-7 / Phase 4` work
- add Gen3 compatibility verdicts

#### Minimal Mapping Decisions

Phase 3 should create live snapshot records only for explicitly composed snapshots, not for the default live app surface.

ParaHook runtime fields are authoritative:
- PubParts title can become `label`.
- PubParts source record kind can help choose tags and metadata.
- PubParts type/platform/fabrication text can be carried as metadata rows, not normalized platform compatibility.
- PubParts platform values such as `GT/GT-S`, `Floatwheel`, or `XR/Funwheel` must not become `platformCompatibility` yet.
- PubParts part/resource categories must not become final ParaHook `partGroups` yet unless a later approved phase owns mapping.

Suggested minimal external item fields:
- `familyKey: 'external-pubparts'`
- `sectionKey: 'external-pubparts'` or source-record-specific sections such as `external-pubparts-parts` and `external-pubparts-resources`
- `tags: ['external', 'pubparts', sourceRecordKind, sourceCollectionKey/sourceCollectionLabel when present]`
- `description: External PubParts source record cached for Catalog source intake.`
- `metadata` rows for `Source`, `Source Set`, `Source Type`, `Fabrication Method`, `Part Type`, `Platform`, `Resource Type`, `Archive Updated`, and source URLs where present

These mapping choices are intentionally minimal so Phase 4 can own final user-facing labels and later Gen2 phases can own platform/fitment normalization.

#### Snapshot Composition Decision

`createCatalogSourceSnapshot(...)` should not automatically read cached PubParts records.

Preferred shape:
- default call: builds repo and imports lanes, with `externalItems: []`
- explicit external call: accepts external source input or already-mapped external items and includes those records in `externalItems` and `allItems`
- tests can pass mapped external input directly to prove source-lane behavior without changing live UI behavior

This keeps Phase 3 as source-owner capability work. Phase 4 should be the first phase that intentionally wires cached PubParts external records into `CatalogSurface` for visible surfacing, alongside correct attribution labels.

#### Likely Files

- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogItemContract.ts`
- `src/app/workspace/CatalogSurface.tsx` only if compile-only type adaptation is required
- PubParts cached intake files from Phase 2
- focused source snapshot tests
- `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/pubPartsCachedSource.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-1` family phase doc

#### No-Widening Rule

Do not fetch PubParts directly in the production browser, add live sync, broaden the PubParts cache, add archive download/extraction/import/add-to-project behavior, add final external UI labels/cards/item pages/filter/search changes, perform platform/fitment normalization, do `Catalog-7 / Phase 4`, or add Gen3 compatibility verdicts in Phase 3.

#### Implementation Risks

- Letting PubParts platform strings become ParaHook `platformCompatibility` before the Gen2-3 mapping lane.
- Giving external items `assetPath` or repo/import-like source behavior.
- Accidentally exposing `add-to-project` or archive import behavior because external entries are reference assets.
- Letting external entries collapse into repo or imports arrays instead of a distinct `externalItems` lane.
- Automatically reading cached PubParts records inside default snapshot creation, which would surface external entries before Phase 4 labels exist.
- Wiring cached PubParts records into `CatalogSurface` before UI attribution is owned.
- Adding final UI labels in the snapshot phase instead of leaving attribution surfacing to Phase 4.
- Changing filters/search because new external tags or metadata enter `allItems`.

#### Checklist

- [x] Phase 3 prep confirms `CatalogSourceSnapshot` should carry `repoItems`, `importsItems`, `externalItems`, and `allItems`.
- [x] Phase 3 prep confirms `repoItems`, `importsItems`, and `externalItems` remain distinct arrays.
- [x] Phase 3 prep confirms default snapshot creation has `externalItems: []`.
- [x] Phase 3 prep confirms external items enter `externalItems` and `allItems` only when explicit external input is passed.
- [x] Phase 3 prep confirms Phase 2 normalized cached PubParts source items can become minimal live `CatalogItemRecord`s for explicitly composed snapshots.
- [x] Phase 3 prep confirms `createCatalogSourceSnapshot` should not automatically read cached PubParts records.
- [x] Phase 3 prep confirms live `CatalogSurface` cached external-item wiring moves to Phase 4 unless compile-only type adaptation is required.
- [x] Phase 3 prep confirms ParaHook runtime fields remain authoritative and PubParts source strings stay source metadata.
- [x] Phase 3 prep confirms external item sources use `sourceKind: 'external'` and no `assetPath`.
- [x] Phase 3 prep confirms external items do not expose `add-to-project`, archive import, or environment apply behavior.
- [x] Phase 3 prep confirms no final UI labels/cards/item pages/filter/search changes.
- [x] Phase 3 prep confirms no platform/fitment normalization, `Catalog-7 / Phase 4`, or Gen3 compatibility verdicts.
- [x] Phase 3 prep names focused snapshot tests and `npm.cmd run build`.
- [x] Phase 3 prep records required tracking docs.

#### Verification Shape

- Focused source snapshot tests should cover:
  - `createCatalogSourceSnapshot()` returns `externalItems: []` by default.
  - `createCatalogSourceSnapshot()` keeps default `allItems` repo + imports when no explicit external input is passed.
  - `createCatalogSourceSnapshot(...)` can accept explicit external input and return external records in `externalItems`.
  - `repoItems`, `importsItems`, `externalItems`, and `allItems` stay distinct.
  - `allItems` contains repo, imports, and external items only for explicitly composed external snapshots without dropping existing repo/import behavior.
  - existing repo-backed item expectations remain stable.
  - existing imports-only helper behavior remains stable.
  - external snapshot items use `source.sourceKind === 'external'`.
  - external snapshot items do not have `source.assetPath`.
  - external snapshot items preserve PubParts provider/source metadata, source URLs, preview image URLs, archive links, and freshness fields.
  - external snapshot items use `actionKind: 'load-preview'`, not `add-to-project` or archive import behavior.
  - no final UI labeling/filter/action behavior changes are introduced beyond compile/type safety.
  - live `CatalogSurface` default wiring does not start passing cached PubParts external items during Phase 3.
- `npm.cmd run build`.

#### Done Shape

Phase 3 is ready for Manager review when the Catalog source owner can compose normalized cached PubParts source items into distinct `externalItems` only through explicit external input, the default live snapshot remains repo + imports with `externalItems: []`, existing repo/import behavior stays stable, and no final UI labels, live `CatalogSurface` external wiring, archive behavior, platform/fitment normalization, `Catalog-7 / Phase 4`, or Gen3 compatibility work has started.

## [x] `Catalog-Gen2-1 / Phase 4` - `External Attribution And Linked Source Surfacing`

### Phase 4 Summary

#### Purpose

Surface external PubParts entries with explicit source attribution and external-linked labeling so they do not read as repo-backed items or imports reuse.

#### Owns

- external source attribution in Catalog card and item-page surfaces
- external-linked labels
- explicit live `CatalogSurface` composition of cached PubParts source items
- source page URL display
- linked-source metadata display without archive import behavior
- action language that keeps external entries on preview/source inspection instead of local asset import
- focused UI/source-label tests and surface composition tests

#### Does Not Own

- direct production browser fetch
- live source sync or broad PubParts mirroring
- archive download
- archive extraction
- archive import behavior
- add-to-project behavior for external entries
- linked archive handoff implementation from `Catalog-Gen2-2`
- platform or fitment normalization
- `Catalog-7 / Phase 4`
- Gen1 fitment fields
- Gen3 compatibility verdicts

### Phase 4 Implementation Spec

#### Exact First Code Cut

Worker should implement only the first intentional external-source surfacing pass.

The first code cut should:
- wire the Phase 2 cached PubParts normalized source items into live `CatalogSurface` by passing explicit external source input to `createCatalogSourceSnapshot(...)`
- keep `createCatalogSourceSnapshot(...)` as an explicit-composition API; do not make it read cached PubParts source records internally
- compose the tiny cached all-parts, filtered GT parts, and resources source slices through the Phase 2 cached source read helpers
- surface external entries through the existing Catalog shell only after labels and source display distinguish external entries from repo and imports
- add shared source-label helpers in `catalogShellShared.ts` or a nearby Catalog UI helper so card/item-page code can branch on `repo`, `imports`, and `external` without repeating fallback logic
- make external card/source labels read as external-linked PubParts entries, for example `External-linked PubParts` or equivalent deterministic copy
- update item-page mode/detail labels so `sourceKind: 'external'` does not fall through to `Imports Reuse`
- replace the item-page source path display with a source-aware display:
  - repo items may continue to show repo asset paths
  - imports items may continue to show import/reuse source context
  - external items must not expect `assetPath`
  - external items should show source URL, external item URL, linked archive URL, source collection/provider, or existing source metadata rows
- preserve source page URLs, external item URLs, preview image URLs, linked archive URLs, freshness/archive update fields, and PubParts source metadata in visible card/page surfaces
- keep external actions as `load-preview`; do not expose `add-to-project`, archive import, or environment apply behavior for external items
- keep remote preview behavior narrow to the current preview-media rendering path, loading remote preview images only through the same explicit preview session mechanics used by `load-preview`
- adjust action copy so external entries read as preview/source inspection, not local asset import, archive extraction, or project commit
- keep existing repo and imports labels, filters, actions, item pages, and search behavior stable except where shared helpers need source-kind branching

The implementation must not:
- fetch PubParts directly from the production browser
- add a live source sync job or background refresh path
- broaden the tiny PubParts cache
- add archive download, extraction, import, add-to-project, or linked archive handoff behavior
- add platform/fitment normalization
- do `Catalog-7 / Phase 4`
- add Gen3 compatibility verdicts
- implement `Catalog-Gen2-2` linked archive handoff

#### Current Seam Decisions

Current `CatalogSurface` creates the snapshot with imports only:
- it calls `createCatalogSourceSnapshot(createCatalogImportsSourceSnapshotFromReferenceWorkspace(referenceWorkspace))`
- Phase 4 should import the cached PubParts source read helpers and pass their normalized source items as explicit external input
- this keeps Phase 3's default-empty source lane intact while making Phase 4 the first live surfacing phase

Current shared UI helpers need source-aware expansion:
- `resolveCatalogItemSearchableParts(...)` already includes metadata rows, so source metadata can be searchable without adding final platform/fitment mapping
- `resolveCatalogItemCardSummary(...)` currently handles imports first and otherwise falls into repo-style part/platform copy
- `resolveCatalogItemPageFamilyLabel(...)` and `resolveCatalogItemPageFamilySummary(...)` currently handle imports first and otherwise fall through to curated repo copy
- Phase 4 should add explicit external branches before repo/default copy so PubParts entries never read as imports reuse or curated repo assets

Current item-page rendering needs source display repair:
- `CatalogShellItemPage.tsx` currently renders the mode label as `Catalog Item` for repo and `Imports Reuse` for every non-repo source
- detail metadata currently renders `Repo-backed` for repo and `Imports reuse` for every non-repo source
- the page currently prints `item.source.assetPath`, which is not valid for external sources
- Phase 4 should replace those with source-aware labels and a source-info display that handles external URLs and linked archive metadata without requiring `assetPath`

Current action behavior should stay narrow:
- Phase 3 mapped external items with `actionKind: 'load-preview'`
- `resolveCatalogActionPlan(...)` should continue preventing `add-to-project` for those external items
- Phase 4 may update copy around load-preview/source inspection but should not add new action kinds or archive handoff behavior

#### Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- `src/app/catalog/pubPartsCachedSource.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/ui/CatalogShell.tsx`
- card/grid UI files if source labels are rendered there, such as `src/app/catalog/ui/CatalogShellGridMode.tsx`
- focused tests near the changed source/UI helpers
- `src/app/workspace/CatalogSurface.test.tsx` if existing test coverage supports surface composition
- `src/app/catalog/ui/catalogShellShared.test.ts` or existing shared Catalog UI tests
- `src/app/catalog/ui/CatalogShellItemPage.test.tsx` or nearest existing item-page test file
- `src/app/catalog/catalogSource.test.ts`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`
- this `Catalog-Gen2-1` family phase doc

#### No-Widening Rule

Do not fetch PubParts directly in the production browser, add live source sync, broaden the tiny PubParts cache, add archive download/extraction/import/add-to-project behavior, implement `Catalog-Gen2-2` linked archive handoff, perform platform/fitment normalization, do `Catalog-7 / Phase 4`, add Gen1 fitment fields, or add Gen3 compatibility verdicts in Phase 4.

#### Implementation Risks

- Wiring cached PubParts entries before fixing labels would make external records read as imports reuse.
- Printing `item.source.assetPath` for external sources would either show nothing useful or encourage a false local-asset contract.
- Using external source URLs as local asset paths would violate the Phase 1 `assetPath?: never` protection.
- Adding source URLs as action behavior could accidentally become archive download or import behavior.
- Letting PubParts platform/type strings enter filter groups as final compatibility metadata would pull Gen2-3 work into Phase 4.
- Changing search/filter/action semantics too broadly could destabilize repo/import browsing.
- Auto-reading cached records inside `createCatalogSourceSnapshot(...)` would erase the explicit-composition boundary established in Phase 3.

#### Checklist

- [x] Phase 4 prep confirms live `CatalogSurface` should intentionally pass explicit cached PubParts source input to `createCatalogSourceSnapshot(...)`.
- [x] Phase 4 prep confirms `createCatalogSourceSnapshot(...)` should not auto-read cached PubParts records.
- [x] Phase 4 prep confirms cached PubParts entries first become visible only with external attribution ready.
- [x] Phase 4 prep confirms card/source labels should distinguish repo, imports, and external PubParts.
- [x] Phase 4 prep confirms item-page mode/detail labels should distinguish external from imports reuse.
- [x] Phase 4 prep confirms source path display must not require `assetPath` for external items.
- [x] Phase 4 prep confirms external page/source URLs, preview image URLs, linked archive URLs, freshness fields, and metadata rows should remain visible.
- [x] Phase 4 prep confirms external action language should stay preview/source-inspection oriented.
- [x] Phase 4 prep confirms no `add-to-project`, archive download/extraction/import, linked archive handoff, or Gen2-2 behavior.
- [x] Phase 4 prep confirms no direct browser fetch, live sync, broad mirror, platform/fitment normalization, `Catalog-7 / Phase 4`, or Gen3 compatibility verdicts.
- [x] Phase 4 prep names focused UI/source/surface tests and `npm.cmd run build`.
- [x] Phase 4 prep records required tracking docs.

#### Verification Shape

- Focused tests should cover:
  - live `CatalogSurface` snapshot composition now includes external PubParts items through explicit cached input.
  - default snapshot behavior remains explicit and does not auto-read cached PubParts records outside the call site.
  - shared card/source label helpers distinguish `repo`, `imports`, and `external`.
  - item-page family/mode/detail labels distinguish external PubParts entries from imports reuse.
  - external source URL, external item URL, preview image URL, linked archive URL, freshness/archive update fields, and source metadata display without `assetPath` assumptions.
  - external entries keep `actionKind: 'load-preview'`.
  - external entries do not expose `add-to-project`, archive import, extraction, download, or environment apply behavior.
  - existing repo and imports label/action behavior remains stable.
  - existing repo/import browse/search/filter behavior remains stable except for external items being visible through intentional `CatalogSurface` composition.
- `npm.cmd run build`.

#### Done Shape

Phase 4 is ready for Manager review when live `CatalogSurface` intentionally composes the tiny cached PubParts source lane, visible external entries read as external-linked PubParts records instead of repo-backed or imports reuse, source URLs and linked-source metadata display without `assetPath` assumptions, and no direct fetch, live sync, archive behavior, add-to-project behavior, platform/fitment normalization, `Catalog-7 / Phase 4`, Gen2-2 linked archive handoff, or Gen3 compatibility work has started.

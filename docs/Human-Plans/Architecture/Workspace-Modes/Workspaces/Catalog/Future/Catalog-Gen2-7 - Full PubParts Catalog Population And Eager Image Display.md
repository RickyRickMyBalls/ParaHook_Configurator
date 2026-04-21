# Catalog-Gen2-7 - Full PubParts Catalog Population And Eager Image Display

## Doc Header

### Doc History
7. 2026-04-20 17:18:15: Closed `Catalog-Gen2-7 / Phase 3 - Eager PubParts Preview Images` and the `Catalog-Gen2-7` follow-up family after PubParts preview image URLs gained PubParts-origin normalization, external PubParts image previews began rendering eagerly in grid cards and item pages, focused PubParts/cache/source/shared/surface tests and `npm.cmd run build` passed, and archive/model/STEP/builder/add-to-project behavior remained unchanged.
6. 2026-04-20 17:14:48: Prepared `Catalog-Gen2-7 / Phase 3 - Eager PubParts Preview Images` with the PubParts preview-image URL normalization helper decision, external PubParts eager grid/item-page image rendering plan, temporary-preview-session boundary, root-relative image test coverage, archive/model/STEP/action guardrails, and focused verification plan.
5. 2026-04-20 17:11:42: Closed `Catalog-Gen2-7 / Phase 2 - All Cached PubParts Parts In Catalog` after live `CatalogSurface` switched to the full 319-record cached PubParts part helper, external items began contributing to section options, focused source/shared/surface tests and `npm.cmd run build` passed, and eager image display/root-relative image normalization remained assigned to Phase 3.
4. 2026-04-20 17:06:19: Prepared `Catalog-Gen2-7 / Phase 2 - All Cached PubParts Parts In Catalog` with the live `CatalogSurface` full-cache wiring decision, external section-counting requirement, 319-part count and duplicate-prevention assertions, resource separation rule, Phase 3 eager-image handoff for PubParts-root-relative image paths, and focused verification plan.
3. 2026-04-20 17:02:49: Closed `Catalog-Gen2-7 / Phase 1 - Full PubParts Cache Coverage` after the deterministic PubParts cache refresh script, full 319-record `parts.json` source module, deduped full part source helper, image array normalization repair, and focused PubParts/cache/source verification shipped without live browser fetch, eager image UI behavior, resource mixing, archive/import behavior, or Catalog surface widening.
2. 2026-04-20 16:58:10: Prepared `Catalog-Gen2-7 / Phase 1 - Full PubParts Cache Coverage` with the deterministic full `parts.json` cache generation path, source-data module shape, all-versus-filtered dedupe rules, image metadata preservation, resource separation boundary, and focused verification plan.
1. 2026-04-20 16:51:27: Created this `Catalog-Gen2-7` Family Phase Doc to route the new Generation 2 follow-up wishlist for full PubParts part population and eager PubParts preview image display after the original Gen2 baseline closeout.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-7`.

Use it to answer:
- how Catalog should move from the tiny PubParts proof cache to full PubParts part coverage
- how every cached PubParts part should appear as an external-linked Catalog entry
- how PubParts preview images should display eagerly when Catalog loads
- where eager images stop before becoming eager archive download, model import, STEP load, or builder behavior

Do not use it for:
- live browser fetching from PubParts unless a later phase proves CORS and reliability
- archive download or extraction
- importing linked model files
- loading heavy STEP files
- treating external PubParts entries as local repo assets
- compatibility verdicts or builder slot validation

## Doc Body

### Family Phase Goal

`Catalog-Gen2-7` should make the Catalog surface feel fully populated from PubParts, not merely proof-wired.

The user goal is simple:
- all available PubParts part records should show in Catalog
- PubParts preview images should show immediately when the user loads Catalog

The implementation should still preserve the Gen2 boundary:
- PubParts data is source truth, not ParaHook runtime schema
- records enter through the repo-owned cached normalized source lane first
- entries stay visibly external-linked
- images can be eager because they are cheap browse context
- linked archives, models, and STEP sources stay user-driven and later-owner work

### Boundary Rules

- Prefer a deterministic repo-owned cache refresh over direct production browser fetch.
- Populate from full PubParts part coverage, not only the current proof sample.
- Preserve source attribution, source page links, preview image URLs, platform labels, type labels, and linked archive metadata.
- Deduplicate records that appear in both full and filtered source sets without losing useful source-set attribution.
- Render image previews eagerly for external PubParts cards.
- Do not eagerly fetch Dropbox archives, model files, STEP sources, or linked `3D` files.
- Do not convert PubParts entries into local repo assets before a later import/download owner exists.
- Keep resources separate from parts unless a phase explicitly chooses resource display behavior.

### Current Live Read

Current Gen2 has the PubParts source lane and a tiny proof cache:
- `parts.json` proof sample
- `parts/gt.json` proof sample
- `resources.json` proof sample

That proves the contract but does not satisfy the new user expectation that all PubParts parts appear in Catalog.

Current Catalog already has the right source-lane shape:
- `externalItems` can carry PubParts entries
- source metadata and external links are preserved
- preview image URLs are already part of the external source contract
- linked archive metadata is inspect-first
- external entries are not local repo assets

### Acceptance Read

This family phase is complete when:
- every available cached PubParts part record appears in Catalog as an external-linked PubParts item
- the full PubParts cache source is deterministic and reviewable in the repo
- duplicate source records do not produce duplicate Catalog cards
- PubParts image previews render eagerly on Catalog load
- no archive download, model import, heavy STEP load, builder load, or compatibility verdict ships by accident

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-7. populate Catalog with every available PubParts part record through the cached normalized source lane instead of only showing a small proof sample`
- [x] `Catalog-Gen2-HLG-8. show PubParts preview images eagerly when the Catalog loads because external preview images are cheap compared with model/archive loading`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-11. Replace the tiny proof PubParts cache with a deterministic full PubParts parts cache so every available PubParts part can appear as an external-linked Catalog entry.
- [x] Catalog-Gen2-CLG-12. Render PubParts `imageSrc` previews eagerly on Catalog load while still avoiding automatic archive downloads, model imports, heavy STEP loads, or builder configuration loads.

### `Catalog-Gen2-7 / Phase 1`

- [x] Prep the full PubParts cache coverage implementation path.
- [x] Decide whether the phase refreshes only `parts.json` first or also filtered PubParts pages.
- [x] Define dedupe behavior for records that appear in both full and filtered caches.
- [x] Preserve source-set attribution and cache timestamp truth.
- [x] Keep browser live-fetch out of scope unless explicitly approved.
- [x] `Catalog-Gen2-HLG-7`
- [x] Catalog-Gen2-CLG-11.

### `Catalog-Gen2-7 / Phase 2`

- [x] Populate Catalog from the full cached PubParts parts set.
- [x] Keep all PubParts entries in the external-linked source lane.
- [x] Verify filters/search still work across all cached PubParts entries.
- [x] Verify no local asset/add-to-project/archive-import behavior is implied.
- [x] `Catalog-Gen2-HLG-7`
- [x] Catalog-Gen2-CLG-11.

### `Catalog-Gen2-7 / Phase 3`

- [x] Make PubParts preview images display eagerly when Catalog loads.
- [x] Keep eager loading limited to cheap image previews.
- [x] Verify missing/broken image URLs fail gracefully.
- [x] Verify archives, model links, STEP files, and builder actions remain lazy/user-driven.
- [x] `Catalog-Gen2-HLG-8`
- [x] Catalog-Gen2-CLG-12.

## [x] `Catalog-Gen2-7 / Phase 1` - `Full PubParts Cache Coverage`

### Phase 1 Summary

#### Purpose

Prepare the implementation path for replacing the tiny proof PubParts cache with full cached PubParts part coverage.

#### Owns

- full PubParts cache refresh shape
- source record count proof
- dedupe rules for records repeated across full and filtered source sets
- source-set attribution preservation

#### Does Not Own

- live browser fetch
- eager image rendering
- archive download or import
- model loading

### Phase 1 Implementation Spec

Prep decision: implement Phase 1 as the full cached source-data and dedupe-helper slice, not as the live Catalog surfacing or eager image rendering slice.

Current-code read:
- `src/app/catalog/pubpartsSourceData/parts.ts`, `partsGt.ts`, and `resources.ts` currently hold tiny hand-sampled records that prove the PubParts cache contract.
- `src/app/catalog/pubPartsCachedSource.ts` exposes separate reads for all-parts, `parts/gt`, and resources, then adds `sourceSetId`, `sourceSetLabel`, `sourceSetUrl`, and `sourceSetCachedAt` metadata.
- `src/app/workspace/CatalogSurface.tsx` currently composes all-parts, GT-filtered parts, and resources directly. A full all-parts cache would therefore need a deduped part read before it is wired into live Catalog, because records from `parts.json` and filtered endpoints may overlap.
- `src/app/catalog/pubPartsSource.ts` already accepts scalar and array-shaped PubParts fields and preserves `imageSrc` as normalized `previewImageUrl`.
- `src/app/catalog/catalogSource.ts` already maps normalized PubParts items into external Catalog records with `source.previewImageUrl` and `previewMedia` image metadata, but Phase 3 owns eager rendering behavior.

Cache refresh/generation decision:
- Add a deterministic repo script for implementation, preferably `scripts/catalog/refreshPubPartsCache.mjs`, that fetches `https://pubparts.xyz/parts.json` once during the implementation/update workflow and writes a stable TypeScript source-data module.
- Do not add production browser fetch, live sync, background refresh, or runtime network dependency.
- The generator should sort output deterministically by a canonical dedupe key, then by title, so diffs are reviewable.
- The generator should keep only raw PubParts source fields the current `PubPartsRawPartRecord` type owns: `title`, `fabricationMethod`, `typeOfPart`, `imageSrc`, `platform`, `externalUrl`, `dropboxUrl`, and `dropboxZipLastUpdated`.
- It should preserve scalar strings and string arrays exactly as source data gives them; do not pre-join arrays in the generated module.
- It should format records with stable key order and no invented placeholder values.
- Record the endpoint URL and refresh date in exported constants, using the implementation date as `cachedAt`.

Source-data location and shape:
- Store the full parts cache in a new source module such as `src/app/catalog/pubpartsSourceData/fullParts.ts` for Phase 1, leaving the existing tiny proof modules untouched until Phase 2 intentionally switches live Catalog composition.
- Export constants equivalent to the current proof modules, for example:
  - `PUB_PARTS_FULL_PARTS_SOURCE_URL = 'https://pubparts.xyz/parts.json'`
  - `PUB_PARTS_FULL_PARTS_CACHED_AT = '<implementation-date>'`
  - `PUB_PARTS_FULL_PARTS_RECORDS = [...] as const satisfies readonly PubPartsRawPartRecord[]`
- Keep resources in `resources.ts`; do not fold `resources.json` records into the full parts cache.
- Keep filtered endpoint modules, such as `partsGt.ts`, as separate source sets. They are enrichment/proof sources, not additional card sources by default.

Filtered endpoint decision:
- Phase 1 should refresh `parts.json` first because it is the source of all available parts.
- Do not fetch every filtered endpoint by default.
- Only add a filtered endpoint to the full-cache workflow if implementation proves that `parts.json` omits a record or source field needed for full part coverage.
- If filtered endpoints are used later, keep them as separate source-set modules and merge them through the dedupe helper below rather than appending them blindly.

Dedupe and attribution rules:
- Add a pure cached-source helper in `src/app/catalog/pubPartsCachedSource.ts`, likely `readCachedPubPartsDedupedPartSourceItems(...)` or `readCachedPubPartsFullPartSourceItems(...)`, that can merge one or more part source sets without duplicate normalized items.
- The canonical dedupe key should be deterministic:
  1. normalized `externalUrl` when present
  2. normalized `dropboxUrl` when present
  3. normalized lower-case title plus normalized `typeOfPart` plus normalized `platform` as the fallback
- Normalize URL dedupe keys by trimming and lowercasing the URL string. Do not strip query params from Dropbox URLs because some source links encode identity there.
- Prefer the `parts.json` record as the primary record when duplicate records appear in all-parts and filtered source sets.
- Preserve filtered source-set attribution on the merged normalized item without creating a duplicate card. Add joined metadata fields if needed, for example `sourceSetIds`, `sourceSetLabels`, `sourceSetUrls`, and `sourceSetCachedAt`, while keeping the existing primary `sourceSetId`, `sourceSetLabel`, `sourceSetUrl`, and `sourceSetCachedAt` stable for the preferred source set.
- The helper should return parts only. Resources stay on `readCachedPubPartsResourceSourceItems()` until a later phase explicitly routes resource display.

Image metadata preservation:
- Preserve every raw `imageSrc` value from `parts.json` in `PUB_PARTS_FULL_PARTS_RECORDS`.
- Normalization must continue to expose `imageSrc` as `previewImageUrl`.
- Catalog mapping must continue to preserve `source.previewImageUrl` and `previewMedia` image rows.
- Phase 1 should not change card rendering to eager images; it only ensures the full cache carries the image URLs needed by Phase 3.

Likely implementation files:
- `scripts/catalog/refreshPubPartsCache.mjs` or an equivalent deterministic refresh script
- `src/app/catalog/pubpartsSourceData/fullParts.ts`
- `src/app/catalog/pubPartsCachedSource.ts`
- `src/app/catalog/pubPartsCachedSource.test.ts`
- `src/app/catalog/pubPartsSource.test.ts` only if raw-field tolerance needs coverage adjustment
- `src/app/catalog/catalogSource.test.ts` only if the deduped normalized items need source-to-Catalog mapping proof
- `docs/CHANGELOG.md` because implementation changes source/runtime cache behavior
- `docs/Doc-Log.md` and this family phase doc

Acceptance checks for the implementation pass:
- Full cache module exists with deterministic raw `parts.json` data and a current `cachedAt` constant.
- Full cache records satisfy `PubPartsRawPartRecord` and preserve scalar/array metadata and `imageSrc` values.
- Dedupe helper prevents duplicate normalized part items when the same record is present in all-parts and filtered source sets.
- Preferred all-parts records keep stable primary source-set metadata while duplicate filtered source-set attribution is preserved.
- Resources remain separate and are not returned by the full part-cache helper.
- No production browser fetch, live sync, UI eager image rendering, archive download/import, local asset conversion, add-to-project behavior, builder behavior, or compatibility verdict ships in Phase 1.

Focused verification for implementation:

```powershell
npm.cmd test -- src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/pubPartsSource.test.ts src/app/catalog/catalogSource.test.ts
```

Then:

```powershell
npm.cmd run build
```

Tracking requirements:
- update `docs/CHANGELOG.md` for the source/cache behavior change
- update this family phase doc and `docs/Doc-Log.md`

### Phase 1 Closeout

Status: complete.

Implementation read:
- Added a deterministic repo refresh script for `https://pubparts.xyz/parts.json`.
- Added the full cached `parts.json` source-data module with 319 raw part records and `PUB_PARTS_FULL_PARTS_CACHED_AT = '2026-04-20'`.
- Kept filtered `parts/gt.json` data out of the default full parts path because Manager verified every GT record is already present in `parts.json` by title plus external URL.
- Added a deduped full part source helper that preserves all records in the authoritative full source while preventing filtered endpoint overlap from producing extra normalized part items.
- Preserved source-set attribution when filtered records duplicate full-cache records.
- Preserved all full-cache `imageSrc` raw values and repaired normalization so array-shaped `imageSrc` values expose the first usable `previewImageUrl`.
- Kept resources separate from parts.
- Did not wire the full cache into live `CatalogSurface`; Phase 2 owns live Catalog population.
- Did not add eager image rendering; Phase 3 owns eager UI display.

Verification passed on 2026-04-20 17:02:
- `npm.cmd test -- src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/pubPartsSource.test.ts src/app/catalog/catalogSource.test.ts` passed: 3 files, 30 tests.
- `npm.cmd run build` passed with the existing Vite/OCCT browser externalization and chunk-size warnings.

Next Worker prep target: `Catalog-Gen2-7 / Phase 2 - All Cached PubParts Parts In Catalog`.

## [x] `Catalog-Gen2-7 / Phase 2` - `All Cached PubParts Parts In Catalog`

### Phase 2 Summary

#### Purpose

Make every cached PubParts part record appear in Catalog as an external-linked item.

#### Owns

- full cached PubParts parts list in the live Catalog snapshot
- source-lane-safe external Catalog cards
- search/filter coverage for the larger external item set

#### Does Not Own

- converting external entries into local assets
- download/import/add-to-project behavior
- compatibility verdicts

### Phase 2 Implementation Spec

Prep decision: implement Phase 2 as the live Catalog population slice for the full cached PubParts parts set, plus the section/filter/search reads needed to make those external parts browsable. Do not implement eager image display in Phase 2.

Current-code read:
- `src/app/catalog/pubPartsCachedSource.ts` now exposes `readCachedPubPartsFullPartSourceItems()` for the authoritative 319-record `parts.json` cache.
- `src/app/workspace/CatalogSurface.tsx` still composes the old tiny proof slices: all-parts sample, GT sample, and resources sample.
- `src/app/catalog/catalogSource.ts` already accepts explicit external PubParts source items through `createCatalogSourceSnapshot(...)` and maps them into `externalItems` plus `allItems`.
- `src/app/catalog/ui/catalogShellShared.ts` already filters and searches over `snapshot.allItems`, but `buildCatalogSectionOptions(...)` currently counts repo, planned, and imports sections without counting `snapshot.externalItems`.
- Phase 1 preserved all raw `imageSrc` values. Manager found 38 cached values are PubParts-root-relative `/images/...`; Phase 3 owns normalizing those to absolute PubParts image URLs before eager display is considered complete.

Live source composition decision:
- Update `CatalogSurface` to use `readCachedPubPartsFullPartSourceItems()` for live PubParts part records.
- Do not append `readCachedPubPartsGtPartSourceItems()` into the live full-parts path by default. Manager verified the current `parts/gt.json` records are already present in `parts.json` by title plus external URL, so the filtered GT slice should stay a proof/dedupe guardrail unless a later phase proves missing source truth.
- Keep `readCachedPubPartsResourceSourceItems()` separate if resources remain live. Resource records are external resource records, not part-count proof.
- The live external part count proof for Phase 2 is exactly 319 `external-pubparts-parts` items from the full cache. If the separate resource sample remains composed, it should be counted separately under `external-pubparts-resources`.

Duplicate prevention rules:
- The live surface must not create duplicate Catalog cards for records already present in the full cache.
- Tests should assert that known overlap records, such as `Celeste: Stock Controller Box Gasket` with `https://www.printables.com/model/919483`, appear once in the live external parts lane.
- If the implementation still uses any filtered proof data in a test fixture, it must route through the Phase 1 dedupe helper and preserve source-set attribution without increasing the live part card count.
- Resources must not be merged into the full part helper or counted as part duplicates.

Section, filter, and search decision:
- Update `buildCatalogSectionOptions(...)` to count external items with the same `resolveCatalogBrowseSectionKeys(...)` path used for visible item filtering. This makes full PubParts parts meaningfully browsable outside the default `All` view without changing filter semantics.
- Existing repo, planned, imports, and environment section behavior should remain stable.
- External PubParts parts should participate in part and platform browse sections through existing normalized fields:
  - mapped `partGroups`, `partType`, and `systemKey` for part/system reads
  - canonical `platformCompatibility` for platform reads
  - raw PubParts platform/type/fabrication metadata still visible and searchable as source truth
- External resources, if still live, should remain in their resource section and should not satisfy the 319 part-count assertion.
- Search and filter helpers should operate across the full 319 external parts through `snapshot.allItems`, without adding a new filter model or rewrite.

Expected test assertions:
- `CatalogSurface` composes the full cached part helper, not the old tiny proof all-parts and GT part helpers.
- A live surface/snapshot read has 319 external PubParts part items in the `external-pubparts-parts` section.
- Any live resources remain separate external resource records and are not counted as parts.
- `snapshot.externalItems` and `snapshot.allItems` include the full external part lane, while `repoItems`, `plannedItems`, and `importsItems` stay distinct.
- Known full-cache/filtered overlap examples do not duplicate cards.
- Section options include external-item counts for the relevant part/platform browse modes.
- Existing repo/import/planned section tests remain stable.
- Filters and search can find full-cache external records through existing metadata and normalized platform/type fields.

Guardrails:
- External PubParts full-cache items must keep `source.sourceKind: 'external'`.
- External PubParts full-cache items must not gain `assetPath`, local repo preview ownership, `add-to-project`, archive download/import, heavy STEP preview, builder load, or compatibility-verdict behavior.
- External actions should remain preview/source-inspection oriented only; linked archive URLs stay metadata/inspect-first and do not become imports.
- Do not normalize root-relative `/images/...` preview paths for eager display in Phase 2 unless needed to preserve source metadata truth. Phase 3 owns making those image paths browser-display-ready for eager rendering.

Likely implementation files:
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/pubPartsCachedSource.test.ts`
- `docs/CHANGELOG.md` because implementation changes runtime Catalog population/section behavior
- `docs/Doc-Log.md` and this family phase doc

Focused verification for implementation:

```powershell
npm.cmd test -- src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx
```

Then:

```powershell
npm.cmd run build
```

Tracking requirements:
- update `docs/CHANGELOG.md` for the runtime/source behavior change
- update this family phase doc and `docs/Doc-Log.md`

### Phase 2 Closeout

Status: complete.

Implementation read:
- `CatalogSurface` now composes live PubParts part records from `readCachedPubPartsFullPartSourceItems()`.
- The filtered GT proof slice is no longer appended into live Catalog composition, so filtered overlap cannot create duplicate live cards.
- The separate PubParts resource sample remains live as an external resource record, but tests count the user-goal proof through `sectionKey === 'external-pubparts-parts'`.
- `buildCatalogSectionOptions(...)` now counts `snapshot.externalItems` through the same `resolveCatalogBrowseSectionKeys(...)` path used by visible item filtering.
- Focused tests prove 319 external PubParts part records, separate resource records, duplicate prevention for the known Celeste overlap, external section/filter/search reads, and no `assetPath`, add-to-project, archive import, heavy STEP, builder, or compatibility-verdict widening.
- Eager image display and PubParts-root-relative `/images/...` normalization remain Phase 3 work.

Verification passed on 2026-04-20 17:11:
- `npm.cmd test -- src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx` passed: 4 files, 57 tests.
- `npm.cmd run build` passed with the existing Vite/OCCT browser externalization and chunk-size warnings.

Next Worker prep target: `Catalog-Gen2-7 / Phase 3 - Eager PubParts Preview Images`.

## [x] `Catalog-Gen2-7 / Phase 3` - `Eager PubParts Preview Images`

### Phase 3 Summary

#### Purpose

Show PubParts preview images immediately when Catalog loads.

#### Owns

- eager external image display for PubParts cards
- graceful missing-image behavior
- no accidental eager archive/model/STEP loading

#### Does Not Own

- local preview generation
- linked archive download
- linked model import
- heavy `3D` model preview or STEP loading

### Phase 3 Implementation Spec

Prep decision: implement Phase 3 as the eager external PubParts image-display slice, backed by source-normalized preview image URLs. Do not widen external source actions, archive handling, model loading, or builder behavior.

Current-code read:
- `src/app/catalog/pubPartsSource.ts` currently reads `record.imageSrc` with `readFirstPubPartsString(...)`, so scalar image strings and the first usable array entry are preserved as `previewImageUrl`.
- That normalization does not yet turn PubParts-root-relative `/images/...` values into browser-ready absolute URLs.
- `src/app/catalog/catalogSource.ts` already maps `previewImageUrl` into external item `source.previewImageUrl` and `previewMedia`.
- `src/app/catalog/ui/CatalogShellGridMode.tsx` currently renders preview images immediately only for environment items or entries that do not allow temporary preview. External PubParts entries allow `load-preview`, so their image cards stay behind the `previewLoadedItemIds` state.
- `src/app/catalog/ui/CatalogShellItemPage.tsx` similarly shows external PubParts preview media only after temporary preview load, even when the preview media is a cheap external image.
- Existing source-page and linked-archive links remain separate item-page source/details affordances.

Preview image URL normalization decision:
- Add a small exported helper in `src/app/catalog/pubPartsSource.ts`, for example `normalizePubPartsPreviewImageUrl(value: unknown): string | undefined`.
- The helper should reuse the existing first-usable image-string read behavior so array-shaped `imageSrc` values still choose the first usable image source.
- Absolute `http://` and `https://` URLs should pass through unchanged after trimming.
- Protocol-relative `//...` values, if present, should normalize to `https://...`.
- PubParts-root-relative image paths beginning with `/images/` should normalize to `https://pubparts.xyz/images/...`.
- Other root-relative values should normalize conservatively to `https://pubparts.xyz/<path>` only if implementation keeps that helper clearly PubParts-owned. The current required proof is `/images/...`.
- Blank, null, unknown, and array values without a usable string should return `undefined`.
- Preserve raw cache truth in `src/app/catalog/pubpartsSourceData/fullParts.ts`; do not rewrite generated raw `imageSrc` records just to make display work.
- Use the helper from `normalizePubPartsPartSourceItem(...)` when setting `previewImageUrl`, so both `source.previewImageUrl` and `previewMedia[].src` receive browser-ready URLs while source metadata and cache records remain source-truth.

Eager grid rendering decision:
- Add a small UI read helper if useful, likely near preview helpers in `catalogShellShared.ts`, such as `shouldRenderCatalogPreviewMediaEagerly(item)` or `isCatalogExternalImagePreviewEager(item)`.
- The helper should return true only for external PubParts image preview media, not for repo models, imports, planned starting assemblies, environments, videos, linked archive URLs, source-page URLs, Dropbox URLs, STEP/model files, or builder/runtime assets.
- Update `CatalogShellGridMode.tsx` so an external PubParts item with image `previewMedia` renders an `<img>` immediately on initial Catalog load, before `previewLoadedItemIds` includes the item.
- The image should still use `resolveCatalogPreviewMediaSrc(...)` for consistent URL handling, although PubParts normalization should already produce browser-ready absolute URLs.
- Keep the existing card action/read behavior source-inspection oriented. Do not add `add-to-project`, archive import, builder load, or a new action kind.

Temporary preview session decision:
- External PubParts image cards should display their cheap image eagerly without requiring or mutating the temporary preview session.
- They may still keep the existing preview action/preview session path for consistency if a user explicitly clicks the preview surface, but the initial `<img>` must not depend on `previewLoadedItemIds`.
- Do not auto-add external PubParts item ids to `previewLoadedItemIds`.
- Existing repo/import model previews should remain temporary-preview-session-gated.
- Existing planned heavy STEP entries should remain non-previewable and disabled.
- Existing environment preview behavior should remain viewer-owned and unchanged.

Item-page rendering decision:
- Update `CatalogShellItemPage.tsx` so external PubParts image preview media displays eagerly when the item page opens, before any temporary preview action.
- Keep item-page copy honest: images can be visible eagerly as browse/source context, while model/archive/STEP/builder loads remain user-driven or unavailable.
- The source page link remains `externalItemUrl`/`sourceUrl`.
- The linked archive inspect link remains `linkedArchiveUrl`.
- Neither source-page nor linked-archive URLs should become preview image sources.

Expected tests:
- `pubPartsSource.test.ts` should cover:
  - absolute PubParts/Printables image URL pass-through
  - `/images/...` normalization to `https://pubparts.xyz/images/...`
  - first usable array-shaped `imageSrc` still wins after normalization
  - blank/missing image sources remain `undefined`
- `pubPartsCachedSource.test.ts` should prove the full cache still has 319 normalized part source items with `previewImageUrl`, and include at least one assertion for a root-relative cached image becoming absolute.
- `catalogSource.test.ts` should prove external PubParts Catalog items receive browser-ready `source.previewImageUrl` and `previewMedia` image sources, while linked archive URLs remain separate metadata.
- `CatalogSurface.test.tsx` should prove initial live Catalog render includes eager `<img>` output for:
  - an external PubParts part with an absolute image URL
  - an external PubParts part whose raw cached image was `/images/...` and now renders as `https://pubparts.xyz/images/...`
- Item-page proof should confirm external PubParts image media is visible before preview load, with source-page and linked-archive links still targeting their own URLs.
- Guardrail tests should prove no Dropbox/archive URL, Printables/source page URL, model/STEP link, planned heavy STEP source, or builder/load action is rendered as eager preview image or add-to-project behavior.
- Existing repo/import preview tests should continue to prove model previews remain temporary-session-gated.

Likely implementation files:
- `src/app/catalog/pubPartsSource.ts`
- `src/app/catalog/pubPartsSource.test.ts`
- `src/app/catalog/pubPartsCachedSource.test.ts`
- `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/ui/catalogShellShared.ts` if an eager-image helper is added
- `src/app/catalog/ui/catalogShellShared.test.ts` if helper behavior is isolated there
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `docs/CHANGELOG.md` because implementation changes runtime source normalization/UI behavior
- `docs/Doc-Log.md`, this family phase doc, and `Catalog-Gen2-Index.md`

Focused verification for implementation:

```powershell
npm.cmd test -- src/app/catalog/pubPartsSource.test.ts src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx
```

Then:

```powershell
npm.cmd run build
```

Tracking requirements:
- update `docs/CHANGELOG.md` for source normalization and eager image UI behavior
- update this family phase doc
- update `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`
- update `docs/Doc-Log.md`

Acceptance read:
- external PubParts preview images render eagerly in grid cards and item pages on initial Catalog load
- root-relative PubParts image paths render as PubParts-origin absolute URLs
- absolute and array-shaped image source records remain supported
- raw cached source data remains unchanged
- no archive download/import, Dropbox/model/STEP eager fetch, add-to-project, builder load, compatibility verdict, or action-kind widening ships in Phase 3

### Phase 3 Closeout

Status: complete.

Implementation read:
- Added an exported PubParts preview image URL normalizer that keeps absolute `http(s)` URLs stable, converts protocol-relative URLs to `https://`, converts PubParts-root-relative paths such as `/images/...` to `https://pubparts.xyz/images/...`, and keeps first-usable array-shaped `imageSrc` behavior.
- Kept raw cached `imageSrc` data unchanged; normalization happens only while building normalized PubParts source items.
- Added eager external PubParts image display in grid cards and item pages without requiring initial temporary preview-session membership.
- Kept explicit preview actions/source inspection available without changing action kinds or converting external images into local assets.
- Preserved repo/import model preview ownership, planned heavy STEP disabled behavior, linked archive inspect-only behavior, and source-page/link separation.
- Focused tests prove absolute and root-relative eager image rendering, array image normalization, source/preview URL separation, no Dropbox/archive image misuse, and no add-to-project/archive/model/STEP/builder widening.

Verification passed on 2026-04-20 17:18:
- `npm.cmd test -- src/app/catalog/pubPartsSource.test.ts src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx` passed: 5 files, 68 tests.
- `npm.cmd run build` passed with the existing Vite/OCCT browser externalization and chunk-size warnings.

`Catalog-Gen2-7` is complete. The reopened Gen2 follow-up wishlist is complete under the scoped cached PubParts population and eager image display proof; live PubParts sync, archive/model import, heavy STEP loading, builder runtime, and compatibility verdicts remain later-owner work.

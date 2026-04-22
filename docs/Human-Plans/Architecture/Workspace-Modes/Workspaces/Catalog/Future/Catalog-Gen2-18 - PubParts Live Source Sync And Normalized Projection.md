# Catalog-Gen2-18 - PubParts Live Source Sync And Normalized Projection

## Doc Header

### Doc History
4. 2026-04-21 19:58:57: Completed `Catalog-Gen2-18 / Phase 2 - Live Source Projection Taxonomy Audit` and `Catalog-Gen2-18 / Phase 3 - Source-Update Preservation Audit` by switching external PubParts Catalog item identity from index-based IDs to stable source-key IDs, adding duplicate cached-source identity metadata only where needed, proving live additions/reorderings/renames keep the existing source item ID stable, proving unknown upstream type/platform labels remain raw metadata plus canonical `Other` instead of replacing ParaHook-owned taxonomy, and re-verifying focused Catalog source/live-source and CatalogSurface source-options paths.
3. 2026-04-21 19:45:47: Implemented `Catalog-Gen2-18 / Phase 1 - Runtime PubParts Metadata Refresh` with a pure live PubParts metadata source owner, direct-then-same-origin Vite dev proxy metadata request fallback after confirming the live PubParts JSON response currently lacks an `Access-Control-Allow-Origin` header, baked-cache-first CatalogSurface live-swap wiring, source-owner and surface tests proving upstream-only live parts can appear while failed live refresh preserves baked cache, focused CatalogSource/CatalogSurface verification, and production build verification while keeping ZIP bytes, source-options, Import/project, compatibility, builder, resource endpoint widening, stable identity migration, taxonomy audit, and source-update preservation outside Phase 1.
2. 2026-04-21 19:41:06: Prepped `Catalog-Gen2-18 / Phase 1 - Runtime PubParts Metadata Refresh` with an implementation-ready spec for a live PubParts metadata reader, baked-cache fallback, CatalogSurface live-swap wiring, focused source/projection/surface tests, verification commands, tracking-doc requirements, and stop condition.
1. 2026-04-21 19:37:28: Created `Catalog-Gen2-18 - PubParts Live Source Sync And Normalized Projection` after the PubParts `.json` endpoint discussion and the user's wishlist that Zinc-added PubParts entries should automatically appear in ParaHook on app refresh; routed live PubParts metadata refresh, baked-cache fallback, ParaHook-owned normalized filters/projection, and no-auto-byte-import boundaries into a new follow-up after `Catalog-Gen2-17`.

### Purpose

This doc prepares the next Catalog Gen2 lane for making PubParts the upstream source of truth for external part records at runtime.

The goal is simple: when Zinc adds a part to PubParts and the user refreshes or reopens ParaHook, Catalog should ask PubParts for the latest structured part list and map those records into ParaHook's existing Catalog surface. ParaHook should not maintain a separate manually curated copy as the primary truth for PubParts records.

The baked generated PubParts cache remains useful, but its role changes:
- fallback when the live endpoint is unavailable
- development/test fixture data
- offline-ish baseline for first render or blocked network states

### Scope

This doc covers:
- runtime fetch/read of the live PubParts structured metadata endpoint
- `https://pubparts.xyz/parts.json` as the first live source target
- optional future widening to filtered endpoints and `resources.json`
- fallback to the generated baked PubParts cache when live metadata cannot be read
- existing PubParts normalization as the source-to-ParaHook contract
- Catalog snapshot composition from live records when available
- tests proving a new upstream PubParts part can appear without regenerating the baked cache
- preserving ParaHook-owned filters, platform mapping, system mapping, part groups, source options, Internal Library, and Import review boundaries

This doc does not cover:
- eager downloading every PubParts ZIP/archive
- bypassing Dropbox or source-host CORS
- treating live metadata fetch as permission to fetch linked model/archive bytes
- replacing Upload ZIP, trusted provider, OPFS/Internal Library, or Import review flows
- letting PubParts page categories become ParaHook's runtime taxonomy
- automatically deleting local cached/source-library/import records when PubParts removes or renames an upstream item
- stable long-term source identity migration beyond the immediate safe runtime-refresh cut unless Manager explicitly widens the phase
- compatibility verdicts, builder behavior, STEP fidelity, or project acceptance

## Doc Body

### Recommendation

Make live PubParts metadata refresh the normal Catalog startup path, with generated cache as fallback.

```text
Catalog opens or app refreshes
-> read baked PubParts cache immediately as fallback/baseline
-> request https://pubparts.xyz/parts.json
-> if live metadata succeeds: normalize through the existing PubParts source adapter
-> compose Catalog snapshot from live part records plus existing resource/cache lanes
-> if live metadata fails: keep the baked generated cache and preserve the existing Catalog surface
```

This is different from direct source-byte materialization. The live `.json` endpoint is metadata. It can add or update part cards, source links, preview images, archive links, platform labels, and type labels. It must not automatically fetch Dropbox ZIP bytes or create Import/project assets.

### Upstream Versus ParaHook Truth

PubParts owns:
- which part records exist
- upstream title, image, source page, archive link, platform label, type label, fabrication method, and update fields
- future new records added by Zinc

ParaHook owns:
- how upstream records become `CatalogItemRecord`s
- canonical platform compatibility values such as `ADV`, `GT`, `Pint`, `XR`, `XR Classic`, and `Other`
- system and part-group mapping such as Platform, Wheel, Footpads, Boxes, and Rim Saver handling
- search/filter behavior
- source-options behavior
- Internal Library and Local Library state
- Import review and project acceptance

The implementation should use the existing `normalizePubPartsPartSourceItem` and `createCatalogSourceSnapshot` / external PubParts projection path instead of adding a second live-only catalog mapper.

### Runtime Source Read

The first implementation should be intentionally small:
- add a focused PubParts live source owner for fetching and validating `parts.json`
- inject `fetch` in tests rather than hard-coding the global in pure tests
- treat non-array JSON, network failures, and aborts as fallback states
- keep malformed individual records from crashing the entire Catalog if the existing normalizer can safely normalize or skip them
- sort/dedupe live records at the source-owner boundary if needed for deterministic tests and stable display reads
- preserve generated-cache source fields and resource records as fallback/companion data

Do not block the first Catalog render on the network if the current surface can render from baked cache first.

### Manager Guide-Rails For Worker Prep

Worker should prep `Catalog-Gen2-18 / Phase 1` around live metadata sync, not around archive bytes.

The prep should answer:
- where the live source owner lives
- how it validates the PubParts JSON payload
- how CatalogSurface swaps from baked cache to live normalized records after the request completes
- how tests prove a synthetic upstream-only part appears in Catalog after live refresh
- how tests prove failed live refresh preserves the baked cache
- how the implementation keeps existing source-options, ZIP inspection, Internal Library, Upload ZIP, and Import review behavior unchanged

The first implementation should not add new visible process buttons unless tests reveal a user-facing error state is already expected by the current surface. A silent fallback is acceptable for Phase 1 if the live source path is covered by deterministic tests and no existing UI contract promises live-source status.

If worker finds that runtime fetch from `https://pubparts.xyz/parts.json` is CORS-blocked in browser practice, Phase 1 should still land the injected live-source owner and fallback contract, then route a follow-up for trusted metadata proxy/provider deployment. Do not fake live success.

### Phase 1 Prep Assignment

Prep `Catalog-Gen2-18 / Phase 1 - Runtime PubParts Metadata Refresh` inside this plan doc before implementation.

The prepared section should add a real `Phase 1 Implementation Spec` with:
- likely files
- exact first code cut
- focused tests
- `npm.cmd test` and `npm.cmd run build` verification
- docs/tracking updates
- stop condition

Do not widen into archive byte fetching, local mirror scanning, Import accept/project creation, compatibility, builder runtime, or stable identity migration unless Manager explicitly accepts a Phase 1 widening.

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-23. make PubParts structured metadata the live upstream source of truth so new PubParts parts added by Zinc can appear in ParaHook after app refresh without requiring a developer to regenerate ParaHook's baked cache, while ParaHook still owns normalized filters, source options, local library state, and Import/project handoff`

### `Catalog-Gen2-18 Phase 1`

- [x] `Catalog-Gen2-CLG-43. Add a runtime PubParts metadata refresh path that reads the live parts JSON endpoint, normalizes successful records through the existing PubParts adapter, composes Catalog from live records when available, and falls back to the baked generated cache when live refresh fails.`

### `Catalog-Gen2-18 Phase 2`

- [x] `Catalog-Gen2-CLG-44. Audit the live source projection so PubParts-owned labels continue to map into ParaHook-owned platform, system, part type, part group, search, and filter fields instead of replacing ParaHook's catalog taxonomy.`

### `Catalog-Gen2-18 Phase 3`

- [x] `Catalog-Gen2-CLG-45. Add a source-update preservation audit so live PubParts additions, removals, renames, and reorderings do not silently delete user-granted ZIP bytes, Internal Library entries, staged source records, local mirror state, or accepted imported project assets.`

## [x] `Catalog-Gen2-18 / Phase 1` - `Runtime PubParts Metadata Refresh`

### Phase 1 Summary

Make Catalog ask PubParts for the latest part metadata at runtime and use it when available.

### Phase 1 Owns

- live `parts.json` source read
- payload validation and deterministic source set mapping
- fallback to baked generated cache
- CatalogSurface composition from live normalized part records when available
- focused tests for upstream-only part appearance and fallback preservation

### Phase 1 Does Not Own

- live ZIP/archive byte fetching
- Dropbox source-byte CORS fixes
- provider/proxy/native deployment
- resource endpoint widening unless it is trivial and non-risky
- stable item identity migration for all existing PubParts records
- local source-library deletion or migration behavior
- Import/project acceptance
- compatibility or builder behavior

### Phase 1 Manager Guide-Rails

Use the existing PubParts source adapter and Catalog external projection. The live source path should feed the same normalized item lane that the generated cache feeds today.

Do not introduce a second mapper inside `CatalogSurface`. If new mapping is required, it belongs near the source adapter or catalog source projection so tests can cover it without rendering the whole workspace.

The runtime path should prefer an immediate baked-cache snapshot, then replace the PubParts part records with live records after the request resolves. That keeps Catalog usable if the network is slow or blocked.

The live endpoint may add records the baked cache does not know about. Phase 1 should prove that such a record appears as a normal external PubParts Catalog item with a source page, linked archive if provided, preview media if provided, and normalized platform/type/filter reads.

The live endpoint may fail. Phase 1 should prove that failure leaves the baked generated cache visible and does not break existing source-options behavior.

### Phase 1 Implementation Spec

Status: complete.

#### Implementation Status

- Added `src/app/catalog/pubPartsLiveSource.ts` as the pure live PubParts metadata owner for `https://pubparts.xyz/parts.json`.
- Added a same-origin Vite dev proxy at `/pubparts-source/parts.json` and made the live source owner try direct PubParts metadata first, then the proxy route, because the current live PubParts JSON response does not expose an `Access-Control-Allow-Origin` header for browser cross-origin reads.
- Added `src/app/catalog/pubPartsLiveSource.test.ts` with focused proof for live normalization, root-relative preview URL normalization, live source-set metadata, non-array fallback, non-OK/rejected fetch fallback, same-origin proxy fallback, malformed-record tolerance, and deterministic ordering/dedupe.
- Wired `src/app/workspace/CatalogSurface.tsx` to render baked PubParts parts/resources immediately, request live part metadata after mount, replace only the PubParts part-record lane on successful live reads, and preserve baked parts/resources on fallback.
- Added focused `CatalogSurface` tests proving a synthetic upstream-only live PubParts part appears after live refresh, baked resources remain visible, failed live refresh keeps known baked PubParts cards visible, and no source-options/Import project work happens automatically.
- Kept ZIP/archive byte fetching, trusted provider/proxy/native deployment, Upload ZIP replacement, source-options staging behavior, Import/project acceptance, compatibility, builder behavior, resource endpoint widening, stable identity migration, broader taxonomy audit, and source-update preservation outside Phase 1.
- Verified focused live-source, Catalog source, full `CatalogSurface` tests, and production build.

#### Likely Files

- `src/app/catalog/pubPartsLiveSource.ts`
  - New small owner for live `https://pubparts.xyz/parts.json` metadata reads.
  - Exports the live source URL, a fetch-like injection type, a success/failure read result type, and one async reader such as `readLivePubPartsPartSourceItems(...)`.
- `src/app/catalog/pubPartsLiveSource.test.ts`
  - New focused unit tests for live payload validation, normalization, deterministic ordering/dedupe, injected fetch, and failure results.
- `src/app/catalog/pubPartsCachedSource.ts`
  - Only touch if the implementation needs to reuse the existing cached dedupe/sort/source-set metadata helpers instead of duplicating them.
  - Keep generated cache constants and generated data ownership unchanged.
- `src/app/catalog/pubPartsSource.ts`
  - Only touch if a tiny shared raw-record guard or sanitizer belongs beside the existing PubParts normalizer.
  - Do not add a live-only mapper here.
- `src/app/catalog/catalogSource.ts`
  - No required change expected if live records are normalized into the existing `pubPartsSourceItems` input.
  - Touch only if a test exposes a missing external projection contract that should be catalog-owned.
- `src/app/catalog/catalogSource.test.ts`
  - Add one synthetic upstream-only normalized PubParts part assertion if the pure projection needs coverage apart from the surface test.
- `src/app/workspace/CatalogSurface.tsx`
  - Replace the current always-cached PubParts source-items construction with a baked-cache baseline plus live-refresh state/effect.
  - Keep source-options, staged-source, Internal Library, Upload ZIP, Import review, and local-library flows unchanged.
- `src/app/workspace/CatalogSurface.test.tsx`
  - Add focused jsdom tests around live metadata success and fallback while preserving the existing cached PubParts source-options expectations.
- `docs/CHANGELOG.md`
  - Required during implementation because runtime behavior changes.
- `docs/Doc-Log.md`
  - Required during implementation if this phase doc or other docs are updated during closeout.

#### Exact First Code Cut

1. Add `src/app/catalog/pubPartsLiveSource.ts` as the only new live metadata owner.
   - Define `PUB_PARTS_LIVE_PARTS_SOURCE_URL = 'https://pubparts.xyz/parts.json'`.
   - Define an injected `PubPartsLiveSourceFetch` shape matching the browser `fetch(input, init)` behavior needed by this owner.
   - Define a result union such as:

     ```text
     { status: 'ready'; sourceUrl; fetchedAt; sourceItems }
     { status: 'fallback'; sourceUrl; reason; sourceItems: [] }
     ```

   - `status: 'fallback'` is the only failure contract Phase 1 needs; no visible UI status is required in this slice.
   - The reader should use injected fetch when provided and `globalThis.fetch` otherwise.
   - Use `cache: 'no-store'` or equivalent request intent only if the current fetch typing allows it without widening the owner; do not add custom cache storage.
   - Do not throw for normal network, status, abort, non-array JSON, or malformed payload states. Return `fallback` with a deterministic reason instead.
2. Validate the payload before normalization.
   - A top-level payload must be an array.
   - Individual records should only be normalized when they are non-null objects.
   - Keep malformed individual records from crashing the whole live read; skip records that are not object-like.
   - Do not require every optional PubParts field to exist.
3. Normalize every accepted live record through `normalizePubPartsPartSourceItem(record)`.
   - Do not create a separate live mapper.
   - Add live source-set metadata equivalent to the generated cache lane:
     - `sourceSetId`: `parts/live`
     - `sourceSetLabel`: `Live PubParts Parts`
     - `sourceSetUrl`: `https://pubparts.xyz/parts.json`
     - `sourceSetCachedAt` or a live-specific metadata value using the read time if the current metadata rows need a non-empty source freshness value.
   - Set `sourceLastUpdated` from the read time or leave it absent if doing so avoids misrepresenting upstream update truth. The implementation should preserve `archiveLastUpdated` from `dropboxZipLastUpdated`.
4. Make live ordering deterministic.
   - Reuse or extract the existing cached dedupe/sort key logic if practical.
   - If extracting, keep the helper close to PubParts source ownership and cover it with unit tests.
   - Dedupe by external URL first, linked archive URL second, then normalized title/type/platform fallback, matching the baked-cache behavior.
   - Sort by that same stable key, then title.
5. Wire `CatalogSurface` to render from baked cache immediately.
   - Keep the existing baked baseline:

     ```text
     readCachedPubPartsFullPartSourceItems()
     + readCachedPubPartsResourceSourceItems()
     ```

   - Add state for live PubParts part items only, initialized to `null`.
   - Compose `pubPartsSourceItems` as:

     ```text
     (live part items if available, otherwise baked full-part items)
     + baked resource items
     ```

   - This keeps resources on the existing baked path for Phase 1.
   - Keep `createCatalogSourceSnapshot(...)` as the only Catalog snapshot composer.
6. Add one `useEffect` in `CatalogSurface` for the live metadata read.
   - Start the request after mount.
   - Use an abort guard or stale-read flag so unmounted surfaces do not set state.
   - On `ready`, replace only the PubParts part source items with live normalized items.
   - On `fallback`, leave state as `null` so the baked cache remains visible.
   - Do not add visible refresh buttons, banners, retry controls, or error UI in Phase 1.
7. Preserve every byte/source-options boundary.
   - Live metadata may provide `linkedArchiveUrl`, preview image, source URL, title, type, platform, fabrication method, and update metadata.
   - Live metadata must not fetch Dropbox ZIP bytes, inspect ZIPs, write OPFS/Internal Library bytes, stage Import review files, accept projects, or change source-byte provider behavior.
   - Existing Add To Project / source-options behavior should continue to start only from the user's item-page action.

#### Focused Test Plan

- `src/app/catalog/pubPartsLiveSource.test.ts`
  - Success: injected fetch returns a synthetic `parts.json` array with one part that is not present in the baked cache; the reader returns `ready` and a normalized PubParts part with:
    - provider `pubparts`
    - source record kind `part`
    - source title from upstream
    - normalized root-relative preview image if provided
    - linked archive URL from `dropboxUrl`
    - archive updated value from `dropboxZipLastUpdated`
    - source-set metadata identifying `parts/live`
  - Payload failure: non-array JSON returns `fallback`.
  - Network/status failure: rejected fetch or non-OK response returns `fallback`.
  - Malformed record tolerance: null/non-object entries are skipped and valid object entries still normalize.
  - Determinism: duplicate live records collapse by the same external/archive/fallback key behavior expected from cached PubParts records.
- `src/app/catalog/catalogSource.test.ts`
  - If not already covered by the live-source owner, add a synthetic upstream-only normalized PubParts part to `createCatalogSourceSnapshot(..., { pubPartsSourceItems })` and assert it appears as a normal external PubParts part with source page, linked archive, preview media, platform/type/part-group normalization, and no `assetPath`.
- `src/app/workspace/CatalogSurface.test.tsx`
  - Live success: stub the live source owner or stub global `fetch` before rendering `CatalogSurface`; assert the synthetic upstream-only part appears after the live promise resolves without regenerating the baked cache.
  - Fallback: rejected fetch, non-OK response, or non-array payload leaves existing baked PubParts cards visible, including a known baked-only card such as `3d Printed Gripples`.
  - Boundary preservation: opening a live-provided item page still shows external PubParts source details and source-options actions without auto-downloading, inspecting, extracting, importing, or committing source bytes.
  - Resource preservation: baked PubParts resource records remain visible because Phase 1 only replaces the part-record source lane.

#### Verification Commands

- Focused owner/projection tests:

  ```text
  npm.cmd test -- src/app/catalog/pubPartsLiveSource.test.ts src/app/catalog/catalogSource.test.ts
  ```

- Focused surface tests:

  ```text
  npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx
  ```

- Full requested verification:

  ```text
  npm.cmd test
  npm.cmd run build
  ```

#### Tracking-Doc Requirements

- This prep is docs-only, so it updates `docs/Doc-Log.md` and does not update `docs/CHANGELOG.md`.
- The implementation pass must update `docs/CHANGELOG.md` because runtime Catalog behavior changes.
- If the implementation pass changes this phase doc, the Catalog Gen2 index, Catalog Vision, `docs/Doc-Index.md`, or other docs, it must also update `docs/Doc-Log.md`.
- If implementation is accepted by Manager, closeout should record whether `Catalog-Gen2-CLG-43` is complete or whether a follow-up is needed because browser CORS blocked the live endpoint.

#### Stop Condition

Stop Phase 1 implementation after:

- Catalog renders from baked PubParts part/resource records immediately.
- A successful live `https://pubparts.xyz/parts.json` metadata read replaces the PubParts part records with live normalized part records.
- A synthetic upstream-only live part appears in Catalog as a normal external PubParts item after live refresh.
- Live read failure preserves the baked generated cache and existing PubParts source-options behavior.
- Focused tests and `npm.cmd run build` pass, or failures are reported with exact blocking reasons.
- `docs/CHANGELOG.md` is updated for the shipped runtime behavior, and any same-pass doc edits are tracked in `docs/Doc-Log.md`.

Do not continue into Dropbox ZIP bytes, source-byte provider/proxy work, Upload ZIP replacement, Import/project acceptance, compatibility, builder behavior, resource endpoint widening, or stable identity migration inside Phase 1. Recommend those as later phases only if implementation findings prove they are necessary.

## [x] `Catalog-Gen2-18 / Phase 2` - `Live Source Projection Taxonomy Audit`

### Phase 2 Summary

Audit and lock the live PubParts projection so PubParts labels feed ParaHook-owned Catalog fields instead of becoming ParaHook taxonomy by default.

### Phase 2 Implementation Status

Status: complete.

- Confirmed live records enter Catalog only as `PubPartsNormalizedSourceItem` records and still flow through `createCatalogSourceSnapshot(...)` / `buildCatalogExternalPubPartsItem(...)`.
- Confirmed platform labels continue through `normalizeCatalogExternalPlatformCompatibility(...)`, where known PubParts labels map to canonical ParaHook families and unknown upstream labels map to canonical `Other`.
- Confirmed type labels continue through `buildCatalogExternalTypeClassification(...)`, where only safe known labels currently set ParaHook `systemKey`, `partType`, and `partGroups`.
- Added a projection test proving a Zinc-added unknown upstream type/platform remains visible as raw metadata while ParaHook keeps canonical `Other` and does not invent a new system/type/group.
- Re-ran focused Catalog source and live-source tests.

### Phase 2 Acceptance Read

- PubParts can add new labels without those labels automatically becoming ParaHook-owned systems, part groups, or platform families.
- Search/card/item-page reads still preserve raw upstream metadata so the user can see what PubParts said.
- ParaHook remains the owner of canonical filter/projection vocabulary.

## [x] `Catalog-Gen2-18 / Phase 3` - `Source-Update Preservation Audit`

### Phase 3 Summary

Audit and lock the live PubParts update behavior so upstream additions, removals, renames, and reorderings do not silently detach user-granted source state.

### Phase 3 Implementation Status

Status: complete.

- Replaced index-based external PubParts item IDs with stable IDs derived from source identity: external/source URL first, linked archive URL second, then a title/type/platform/resource fallback.
- Added duplicate cached-source identity metadata only for duplicate records within the same cached source set so React keys remain unique without making normal IDs order-dependent.
- Added a projection test proving an existing live PubParts item keeps the same Catalog item ID when a new upstream item is inserted before it and when the upstream title is renamed.
- Confirmed staged source records, local source records, Internal Library cache records, local mirror records, and Import/project records are not auto-pruned during Catalog source composition; user-owned records remain stored until the user clears or replaces them through the existing source/local/import owners.
- Re-ran focused CatalogSurface source-options tests to verify the stable ID still connects source-options, Internal Library cache reopening, and staged metadata reads.

### Phase 3 Acceptance Read

- Live PubParts additions and reorderings do not shift IDs for unchanged PubParts items.
- PubParts title renames update the displayed label while preserving the source-key item ID when the source URL remains stable.
- ParaHook does not silently delete user-granted ZIP bytes, staged source metadata, Local Library mirror metadata, Internal Library cache records, or accepted imported project assets just because the live upstream list changes.

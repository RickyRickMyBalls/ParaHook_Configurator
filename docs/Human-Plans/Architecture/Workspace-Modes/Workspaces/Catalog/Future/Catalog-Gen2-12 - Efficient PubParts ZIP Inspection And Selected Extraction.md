# Catalog-Gen2-12 - Efficient PubParts ZIP Inspection And Selected Extraction

## Doc Header

### Doc History
13. 2026-04-21 01:19:48: Closed `Catalog-Gen2-12 / Phase 5.1 - Local ZIP Fallback For Browser-Blocked PubParts Archives` after source options gained a `Choose Local ZIP` fallback for browser-blocked PubParts Dropbox ZIP fetches, local ZIP blobs list through the existing `pubPartsZipArchive` helper, selected supported entries stage from the picked local ZIP into Import review with PubParts attribution, the focused Catalog surface fallback test passed, and eager downloads, native disk writing, remote-byte proxy, persistent ZIP bytes, local library scans, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts remain deferred.
12. 2026-04-21 01:16:11: Reopened the `Catalog-Gen2-HLG-16` completion read and prepped `Catalog-Gen2-12 / Phase 5.1 - Local ZIP Fallback For Browser-Blocked PubParts Archives` after live PubParts Dropbox ZIP fetches proved browser-blocked from localhost/ParaHook, preserving the on-demand remote fetch attempt for readable ZIP blobs while planning a user-picked local `.zip` fallback that reuses the existing ZIP listing/extraction helper and keeps eager downloads, native disk writing, remote-byte proxies, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts out of scope.
11. 2026-04-21 00:57:42: Closed `Catalog-Gen2-12 / Phase 5 - ZIP Lane Final Audit` as a docs/test audit after inspecting the ZIP helper, archive manifest cache, shared-link resolver, source-options dialog, `CatalogSurface`, and Import staged-draft seams, confirming `Catalog-Gen2-HLG-16` and CLG 23-26 are satisfied, running focused ZIP/cache/resolver/surface/shell tests plus `npm.cmd run build`, and keeping eager ZIP downloads, extract-all behavior, persistent ZIP bytes, local library/native downloads, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts deferred.
10. 2026-04-21 00:54:51: Prepped `Catalog-Gen2-12 / Phase 5 - ZIP Lane Final Audit` for Manager review, defining the final HLG/CLG acceptance read for `Catalog-Gen2-HLG-16` and CLG 23-26, the code/test audit surface, the proof required before marking the ZIP lane complete, the follow-up trigger if ZIP-backed PubParts selected entries still cannot stage into Import review, and the no-widening boundaries around eager ZIP downloads, extract-all behavior, persistent ZIP bytes, local library/native downloads, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts.
9. 2026-04-21 00:50:16: Closed `Catalog-Gen2-12 / Phase 4 - Archive Manifest Cache` after adding a dedicated metadata-only PubParts archive manifest cache, wiring ZIP source-options cache hits before live fetch/listing, preserving Phase 3 extraction revalidation against real ZIP bytes, proving cache hit/miss/invalidation/no-byte-storage behavior with focused cache/resolver/surface/ZIP tests, and passing `npm.cmd run build` with the existing Vite warnings while keeping persistent ZIP byte storage, extracted file caching, local library behavior, native downloads, Import accept/project asset behavior, shared-folder listing, `.stp` support, STEP loader work, builder behavior, and compatibility verdicts deferred.
8. 2026-04-21 00:44:34: Prepped `Catalog-Gen2-12 / Phase 4 - Archive Manifest Cache` for Manager approval, choosing a dedicated PubParts archive manifest metadata cache keyed by provider, Catalog item id, Dropbox ZIP source URL, and source version from `archiveLastUpdated` / PubParts `dropboxZipLastUpdated`, storing only sanitized ZIP entry metadata while preserving Phase 3 extraction revalidation against real ZIP bytes and keeping persistent ZIP byte storage, local library behavior, native downloads, Import accept/project asset behavior, shared-folder listing, `.stp` support, STEP loader work, builder behavior, and compatibility verdicts deferred.
7. 2026-04-21 00:38:11: Closed `Catalog-Gen2-12 / Phase 3 - Selected ZIP Entry Extraction To Import Review` after selected supported ZIP entries gained guarded extraction from the inspected archive blob, PubParts archive candidate materialization into `ImportedReferenceFile` records with object URLs, source-options `Stage Selected` all-or-nothing staging for direct/archive selections, Import review PubParts attribution, focused ZIP/resolver/surface/shell tests, and `npm.cmd run build` while keeping manifest caching, persistent ZIP byte storage, extract-all behavior, shared-folder listing, `.stp` support, STEP loader work, builder behavior, compatibility verdicts, and pre-Import project asset creation deferred.
6. 2026-04-21 00:30:51: Prepped `Catalog-Gen2-12 / Phase 3 - Selected ZIP Entry Extraction To Import Review` for Manager approval, choosing low-level selected-entry extraction in `pubPartsZipArchive`, PubParts candidate/materialization orchestration in `pubPartsSharedLinkResolver`, ephemeral reuse of the user-inspected ZIP blob in `CatalogSurface`, all-or-nothing Import draft staging for direct/archive mixed selections, and strict rejection of unsupported, unsafe, blocked, directory, hidden/system, oversized, unknown-size, or stale archive candidates while keeping manifest caching, persistent ZIP byte storage, shared-folder listing, `.stp` support, STEP loader work, builder behavior, and compatibility verdicts deferred.
5. 2026-04-21 00:25:32: Closed `Catalog-Gen2-12 / Phase 2 - Source Options Real ZIP Listing` after PubParts ZIP source options gained a user-triggered async archive inspection path that fetches one Dropbox `dl=1` ZIP, lists real entries through `pubPartsZipArchive`, maps entries into supported/unsupported archive candidates, retires the hard-coded Gripples production manifest, preserves direct shared-file staging behavior, and keeps archive extraction, Import draft staging, object URLs, manifest caching, eager ZIP fetch, shared-folder listing, `.stp` support, STEP loader work, builder behavior, and compatibility verdicts deferred.
4. 2026-04-21 00:18:14: Prepped `Catalog-Gen2-12 / Phase 2 - Source Options Real ZIP Listing` for Manager approval, choosing a separate user-triggered async archive inspection path that reuses Dropbox direct-download URL resolution, maps `pubPartsZipArchive` metadata into source-options candidates, retires the hard-coded Gripples manifest proof in favor of mocked real ZIP listing tests, and keeps extraction, Import staging, manifest caching, eager archive fetch, shared-folder listing, and direct-file behavior changes out of scope.
3. 2026-04-21 00:15:14: Closed `Catalog-Gen2-12 / Phase 1 - Browser ZIP Reader And Entry Manifest Contract` after installing `@zip.js/zip.js`, adding the pure `pubPartsZipArchive` helper and fixture ZIP tests, proving supported/unsupported/unsafe/directory/blocked entry classification, and running the focused ZIP/resolver tests plus `npm.cmd run build` while leaving Catalog UI wiring, Import staging, object URLs, Dropbox fetch, extraction, and manifest caching deferred.
2. 2026-04-21 00:09:27: Prepped `Catalog-Gen2-12 / Phase 1 - Browser ZIP Reader And Entry Manifest Contract` for Manager approval, choosing `@zip.js/zip.js` as the browser ZIP dependency, defining the package-lock/package manifest update, pure helper ownership, fixture ZIP test strategy, archive entry metadata contract, size/path safety guards, focused verification, and the no-UI/no-Import/no-cache Phase 1 boundary.
1. 2026-04-21 00:06:31: Created this Family Phase Doc for the reopened Gen2 ZIP lane after the current PubParts corpus proved ZIP-first, routing the next Worker loop through on-demand browser ZIP entry listing, selected supported-file extraction, Import review staging, and cheap manifest caching without eager archive downloads or fake project assets.

### Purpose

This file owns `Catalog-Gen2-12`, the Catalog Gen2 follow-up that makes PubParts ZIP links usable efficiently.

Use it to answer:
- how Catalog should inspect one PubParts ZIP after user action
- how supported and unsupported ZIP entries should appear in the source-options dialog
- how selected supported archive entries become staged Import review files
- how PubParts attribution survives extraction
- how manifest caching should avoid repeated ZIP reads without storing bulk ZIP bytes

Do not use it for:
- downloading every PubParts ZIP on Catalog load
- extracting every file in a ZIP by default
- persistent native download management
- user-granted local folder scanning
- STEP loader fidelity or `.stp` import support
- builder runtime or compatibility verdicts
- Dropbox shared-folder listing

## Doc Body

### Family Phase Goal

Most current PubParts source links are Dropbox ZIP archives. Before `Catalog-Gen2-12`, the Gen2 source-options flow could show direct files and manifest-backed archive metadata, but it could not inspect arbitrary ZIPs or stage extracted archive entries into Import review.

`Catalog-Gen2-12` should close that user-visible gap without making Catalog heavy at startup.

The finished flow should be:
1. the user clicks the PubParts primary action for one item
2. Catalog fetches only that item's ZIP source
3. a browser ZIP reader lists archive entries
4. Catalog classifies each entry as supported, unsupported, unsafe, directory, or blocked
5. the source-options dialog lets the user select supported entries
6. `Stage Selected` extracts only selected supported entries
7. extracted files are staged in Import review with PubParts attribution

### Efficiency Rules

- PubParts images may load eagerly; ZIPs may not.
- ZIP inspection is user-triggered and one item at a time.
- Entry listing should be cheaper than extraction.
- Extraction should materialize only selected supported entries.
- Manifest cache should store entry metadata, not full archive bytes.
- Cache keys should include PubParts item identity, source URL, and `dropboxZipLastUpdated`.
- A changed `dropboxZipLastUpdated` should invalidate old entry manifests.

### Safety Rules

- Do not extract entries with path traversal such as `../`.
- Do not extract absolute paths or drive-letter paths.
- Do not stage hidden/system-looking entries unless later explicitly supported.
- Keep unsupported files visible as context but disabled.
- Keep directories visible only if useful for context; never treat a directory as importable.
- Add a maximum entry-size guard before extraction.
- If the ZIP reader cannot inspect an archive, fall back to the existing `Open Source` / local import path.

### Ownership Boundary

Catalog owns:
- source-options UI
- PubParts source identity and attribution
- fetching the selected PubParts source URL for inspection
- classifying and selecting archive entries
- handing extracted supported files to the existing Import staged review seam
- cheap manifest metadata cache

Import owns:
- staged Import review
- accepted project assets
- STEP loading/fidelity
- local folder permission and scan behavior
- future long-lived local file materialization

### Dependency Direction

Use a proven browser ZIP reader instead of hand-rolling ZIP parsing unless Worker prep finds a concrete blocker.

Preferred starting point:
- `@zip.js/zip.js`, because its browser API supports `BlobReader`, `ZipReader`, entry listing, and selected entry data extraction.

Worker prep must still verify:
- package size and Vite compatibility
- TypeScript import shape
- how to close/cleanup readers
- how to extract one entry to a `Blob`
- how tests can create fixture ZIP blobs deterministically

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-16. make PubParts ZIP links usable efficiently by inspecting one user-selected ZIP on demand, listing supported and unsupported entries, extracting only selected supported files, and staging those files into Import review with PubParts attribution instead of eagerly downloading or importing every archive` - complete with the Phase 5.1 browser-honest fallback: readable remote ZIP blobs still inspect directly, and browser-blocked PubParts Dropbox archives can be downloaded/opened by the user, chosen as a local `.zip`, listed, selected, and staged into Import review with PubParts attribution.

### Codex Level Goals

- [x] Catalog-Gen2-CLG-23. Add a browser ZIP reader seam for PubParts archive blobs that lists entries after a user action without downloading or inspecting every PubParts ZIP on Catalog load.
- [x] Catalog-Gen2-CLG-24. Classify ZIP entries into supported import candidates, unsupported source/reference context, hidden/unsafe entries, and oversized/blocked entries before any extraction happens.
- [x] Catalog-Gen2-CLG-25. Extract only selected supported ZIP entries into `File`/`Blob` objects and stage them in Import review with PubParts attribution while leaving project ownership to the normal Import accept path.
- [x] Catalog-Gen2-CLG-26. Cache cheap archive manifest metadata by PubParts item identity, source URL, and `dropboxZipLastUpdated` so repeat ZIP inspection is fast without turning browser storage into a bulk archive cache.
- [x] Catalog-Gen2-CLG-27. Add a browser-honest local `.zip` picker fallback for PubParts Dropbox ZIP archives that are not readable by `fetch`, then list, select, and extract from the user-picked local ZIP blob with PubParts attribution.

### `Catalog-Gen2-12 / Phase 1`

- [x] Prep the browser ZIP reader and entry manifest implementation plan.
- [x] Choose the ZIP library/dependency and fixture-test strategy.
- [x] Add the dependency and pure archive helper only after Manager approves the Worker prep.
- [x] List entries from fixture ZIP blobs and classify supported, unsupported, unsafe, directory, and blocked entries.
- [x] Keep Catalog UI and Import staging unchanged in this phase.
- [x] Catalog-Gen2-CLG-23 boundary slice.
- [x] Catalog-Gen2-CLG-24 boundary slice.

### `Catalog-Gen2-12 / Phase 2`

- [x] Prep the real source-options ZIP listing implementation plan.
- [x] Wire real ZIP inspection into PubParts source-options after user action.
- [x] Replace the hard-coded trusted manifest proof path with real ZIP entry listing where browser fetch succeeds.
- [x] Show supported and unsupported archive entries in the source-options dialog with paths, sizes when available, and disabled states.
- [x] Keep extraction and Import staging out of this phase unless Manager explicitly approves widening.
- [x] Catalog-Gen2-CLG-23.
- [x] Catalog-Gen2-CLG-24.

### `Catalog-Gen2-12 / Phase 3`

- [x] Prep the selected ZIP entry extraction implementation plan.
- [x] Extract only selected supported archive entries.
- [x] Create staged `File`/`Blob` records with correct filename, file type, object URL, and PubParts attribution.
- [x] Stage extracted files into the existing Import review dialog.
- [x] Keep unsupported entries, unsafe entries, and directories unstageable.
- [x] Catalog-Gen2-CLG-25.

### `Catalog-Gen2-12 / Phase 4`

- [x] Prep the archive manifest cache implementation plan.
- [x] Add cheap archive manifest cache keyed by PubParts item identity, source URL, and `dropboxZipLastUpdated`.
- [x] Reuse cached manifests for repeat source-options opens when the source version is unchanged.
- [x] Invalidate manifests when source URL or `dropboxZipLastUpdated` changes.
- [x] Do not store full ZIP bytes in the browser manifest cache.
- [x] Catalog-Gen2-CLG-26.

### `Catalog-Gen2-12 / Phase 5`

- [x] Prep the final ZIP lane audit implementation plan.
- [x] Final readable-blob audit against `Catalog-Gen2-HLG-16` and CLG 23-26.
- [x] Run focused Catalog ZIP/source-options/import-handoff tests and `npm.cmd run build`.
- [x] Record the follow-up correction: the readable-blob lane works, but live browser-blocked PubParts Dropbox ZIPs need Phase 5.1.
- [x] Close `Catalog-Gen2-HLG-16` after the browser-blocked local ZIP fallback lands.

### `Catalog-Gen2-12 / Phase 5.1`

- [x] Prep the local ZIP fallback implementation plan.
- [ ] Keep the on-demand remote browser fetch attempt for readable PubParts ZIPs.
- [ ] Offer a local `.zip` file picker fallback when the remote ZIP fetch fails because of CORS/network/browser-readability.
- [ ] List entries from the user-picked local ZIP using `pubPartsZipArchive`.
- [ ] Let source options select supported entries and stage selected entries into Import review with PubParts attribution.
- [ ] Keep eager downloads, native disk writing, remote-byte proxies, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts out of scope.

## [x] `Catalog-Gen2-12 / Phase 1` - `Browser ZIP Reader And Entry Manifest Contract`

### Phase 1 Summary

Phase 1 added the pure archive helper foundation.

The app can now read ZIP blobs in a browser-compatible helper, list entries, classify safe supported entries, and reject unsafe or unsupported entries through focused tests. Catalog UI behavior, source-options behavior, Import staging, object URLs, Dropbox fetch, archive extraction, project assets, and manifest caching did not change in this phase.

### Phase 1 Implementation Spec

Status: implemented and closed.

Implemented scope:
- Installed `@zip.js/zip.js` as a runtime dependency, updating `package.json` and `package-lock.json`.
- Added `src/app/catalog/pubPartsZipArchive.ts` as a pure Catalog helper that imports only ZIP primitives and the current Import-supported file-type list.
- Added `src/app/catalog/pubPartsZipArchive.test.ts` with deterministic in-memory fixture ZIP blobs created by `ZipWriter`, `BlobWriter`, and `TextReader`.
- Exposed `PUBPARTS_ZIP_MAX_ENTRY_SIZE_BYTES` as `100 * 1024 * 1024` and `PUBPARTS_ZIP_MAX_ENTRY_COUNT` as `2000` for later Manager tuning.
- Exposed `listPubPartsZipArchiveEntries(archiveBlob, options?)` for metadata-only entry listing and `classifyPubPartsZipArchiveEntry(entry, options?)` for focused classification proof.
- Closed ZIP readers in `finally` and wrapped malformed ZIP inspection failures in a stable `PubPartsZipArchiveInspectionError`.

Entry metadata contract now available for later source-options wiring:
- `archivePath`
- `normalizedPath`
- `fileName`
- `fileType`
- `classification`
- `supportState`
- `blockedReason`
- `description`
- `fileSizeBytes`
- `compressedSizeBytes`
- `lastModifiedAt`
- `isDirectory`
- `selectable`

Classification behavior:
- Supported `.step`, `.stl`, `.obj`, and `.glb` entries are selectable metadata when they pass all safety and size guards.
- Recognized-but-unsupported `.stp` entries remain visible as non-selectable `recognized-source-unsupported` metadata.
- Unsupported `.3mf`, `.pdf`, and other unsupported entries remain visible but non-selectable.
- Directories are non-selectable `directory` entries.
- Path traversal, absolute paths, Windows drive paths, empty paths, NUL paths, hidden/system-looking paths, unknown-size entries, oversized entries, and over-count guard records are non-selectable.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts` passed, 5 tests.
- `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 6 tests.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Deferrals:
- No Catalog UI wiring.
- No source-options behavior change.
- No `CatalogSurface` change.
- No Import staging or object URL creation.
- No Dropbox ZIP fetch.
- No archive extraction/materialization.
- No project asset creation.
- No archive manifest cache.

## [x] `Catalog-Gen2-12 / Phase 2` - `Source Options Real ZIP Listing`

### Phase 2 Summary

Phase 2 connected the archive helper to the PubParts source-options flow.

The user can click `Add To Project` on a ZIP-backed PubParts item and see real ZIP entries when browser fetch and ZIP inspection succeed. Supported archive entries remain metadata-only until Phase 3 extraction materializes selected files for Import review.

### Phase 2 Implementation Spec

Status: implemented and closed.

Implemented scope:
- Kept `resolvePubPartsSharedLinkCandidates(stagedRecord)` synchronous. Direct shared files still resolve immediately, and ZIP URLs still produce a disabled `archive-needs-inspection` placeholder before user-triggered inspection.
- Added `inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, env?)` in `src/app/catalog/pubPartsSharedLinkResolver.ts`.
- Reused the existing Dropbox `dl=1` direct-download URL conversion for ZIP fetches.
- Fetched exactly one ZIP archive after the user opens source options for a ZIP-backed PubParts item.
- Called `listPubPartsZipArchiveEntries(blob)` and mapped the returned metadata into `PubPartsSharedLinkCandidate[]`.
- Added archive-entry candidate metadata fields for normalized archive path, compressed size, directory state, classification, and blocked reason.
- Removed the hard-coded Gripples production manifest table and manifest branch. The real Gripples URL now starts as a normal `archive-needs-inspection` placeholder and is tested through the async ZIP fixture path.
- Added a separate `isInspectingArchive` dialog state so archive listing does not pretend to be Import staging.
- Kept `Stage Selected` for archive entries metadata-only.

Runtime behavior:
- ZIP-backed PubParts `Add To Project` opens source options immediately with an inspecting status and disabled ZIP placeholder.
- On successful browser ZIP fetch/listing, the dialog replaces the placeholder with real archive entries.
- Supported archive entries are auto-selected as metadata choices.
- Unsupported, unsafe, directory, hidden/system, unknown-size, oversized, and over-count archive entries remain visible when returned by the helper but disabled.
- Fetch, non-OK response, and malformed ZIP failures show honest `Open Source` / manual local import fallback copy without inventing archive contents.
- Direct supported shared-file staging remains unchanged.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 2 files / 14 tests.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 26 tests.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed, 3 tests.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Deferrals:
- No selected ZIP entry extraction.
- No Import draft staging from archive entries.
- No object URLs for archive entries.
- No archive manifest cache.
- No eager ZIP fetch on Catalog load.
- No shared-folder listing.
- No Dropbox API/helper/native owner work.
- No `.stp` support, STEP loader work, builder behavior, or compatibility verdicts.

## [x] `Catalog-Gen2-12 / Phase 3` - `Selected ZIP Entry Extraction To Import Review`

### Phase 3 Summary

Phase 3 should turn selected supported archive entries into staged Import review files.

This is the first phase where ZIP-backed PubParts items become practically importable through the normal review path.

### Phase 3 Implementation Spec

Status: implemented and closed.

Implemented scope:
- Extended `src/app/catalog/pubPartsZipArchive.ts` with `extractPubPartsZipArchiveEntries(archiveBlob, normalizedArchivePaths, options?)`.
- Added `PubPartsZipArchiveExtractedEntry` and `PubPartsZipArchiveExtractionError`.
- Rebuilt metadata from the actual ZIP entries before extraction and reused the existing path, hidden/system, directory, support, size, and entry-count guards.
- Extracted only requested supported `.step`, `.stl`, `.obj`, and `.glb` entries to `Blob` output.
- Closed ZIP readers in `finally`, matching the Phase 1 listing helper cleanup pattern.
- Extended `src/app/catalog/pubPartsSharedLinkResolver.ts` with `inspectPubPartsSharedLinkArchive(stagedRecord, env?)`, `materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, candidates, env?)`, and `PubPartsSharedLinkArchiveExtractionError`.
- Preserved `resolvePubPartsSharedLinkCandidates(stagedRecord)` and `fetchPubPartsSharedLinkCandidateFile(candidate, env?)` direct-file behavior.
- Kept `inspectPubPartsSharedLinkArchiveCandidates(stagedRecord, env?)` as the candidate-array wrapper used by existing tests/callers.
- Updated `src/app/workspace/CatalogSurface.tsx` to keep the inspected ZIP blob only in ephemeral source-options dialog state.
- Reused the inspected ZIP blob for `Stage Selected` when the staged source id and source URL still match.
- Allowed the resolver to refetch exactly one ZIP through the existing Dropbox `dl=1` conversion when no reusable blob is available.
- Materialized archive entries into `ImportedReferenceFile` records with filename, supported file type, object URL, and PubParts attribution.
- Updated `Stage Selected` so direct-only, archive-only, and mixed direct/archive selections materialize all selected files first, then open and append one Import draft batch.
- Updated source-options copy and status messages so supported archive entries are no longer described as metadata-only after extraction support.

Safety behavior:
- Unsupported `.3mf`/`.pdf`, recognized-but-unsupported `.stp`, unsafe paths, path traversal, absolute paths, Windows drive paths, NUL/empty paths, hidden/system paths, directories, unknown-size entries, oversized entries, entry-count guard archives, missing paths, stale candidate ids, and source URL mismatches cannot be extracted or staged.
- Extraction does not trust UI candidate metadata alone; it re-reads the selected entry from the ZIP and reclassifies it before bytes are returned.
- If any selected direct file or archive entry fails to materialize, the flow appends nothing to Import review and reports that no files were added.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 2 files / 20 tests.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 27 tests.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed, 3 tests.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Deferrals:
- No archive manifest cache.
- No persistent local ZIP byte storage.
- No extract-all behavior.
- No shared-folder listing.
- No Dropbox API/helper/native download owner work.
- No `.stp` support.
- No STEP loader work.
- No builder behavior.
- No compatibility verdicts.
- No project asset creation before the existing Import review accept path.

## [x] `Catalog-Gen2-12 / Phase 4` - `Archive Manifest Cache`

### Phase 4 Summary

Phase 4 should cache cheap archive entry metadata for repeat opens.

The cache should speed up the one-item source-options flow without turning browser storage into a bulk ZIP archive store.

### Phase 4 Implementation Spec

Status: implemented and closed.

Implemented scope:
- Added `src/app/catalog/pubPartsArchiveManifestCache.ts` as the dedicated metadata-only cache helper.
- Added `src/app/catalog/pubPartsArchiveManifestCache.test.ts` with focused read/write, miss, fallback-version, sanitization, no-byte-storage, and clear/reset interaction tests.
- Used the exact storage key `parahook:catalog:pubparts-archive-manifest-cache`.
- Stored only sanitized `PubPartsZipArchiveEntryMetadata[]` plus schema, provider, Catalog item id/label, source URL fields, source version, version kind, and `inspectedAt`.
- Built cache keys from provider id, Catalog item id, Dropbox ZIP `sourceCandidateUrl`, and resolved source version.
- Resolved source version from `stagedRecord.archiveLastUpdated` first, with `stagedRecord.sourceLastUpdated` as the fallback.
- Skipped cache reads/writes when neither source version field is available.
- Added `clearPubPartsArchiveManifestCache(storage?)` for tests and future global reset ownership.
- Exported `mapPubPartsZipArchiveEntriesToSharedLinkCandidates(stagedRecord, entries)` from `src/app/catalog/pubPartsSharedLinkResolver.ts` so cached entry metadata maps through the same resolver-owned candidate shape as live ZIP inspection.
- Extended live archive inspection to return both candidates and raw entry metadata, letting `CatalogSurface` cache entries after successful live listing.
- Updated `src/app/workspace/CatalogSurface.tsx` to check the cache after user action and before live ZIP fetch/listing for ZIP-backed source options.

Runtime behavior:
- Cache hit opens source options with cached ZIP entry metadata immediately and does not fetch/list the ZIP for display.
- Cache-hit status copy is explicit that selected files will still be revalidated from the ZIP before Import review.
- Cache miss keeps the Phase 2/3 behavior: open the dialog, fetch exactly one Dropbox `dl=1` ZIP, list entries, map candidates, keep the ZIP blob ephemerally for Phase 3 staging, then write entry metadata to the cache.
- Changed item id, source URL, or `archiveLastUpdated`/source version misses the cache.
- Malformed cache JSON, schema mismatches, invalid identity fields, missing source version, and malformed entry metadata behave as cache misses.
- Existing staged-source clear controls do not clear the archive manifest cache.

Safety behavior:
- The cache never stores `Blob`, `File`, object URLs, full ZIP bytes, extracted file bytes, candidates, Import draft records, or project asset records.
- Cache hit does not skip Phase 3 extraction safety. `Stage Selected` still uses a matching ephemeral ZIP blob when present or refetches exactly one ZIP as fallback, then `extractPubPartsZipArchiveEntries` rereads and reclassifies the actual selected entries before bytes are returned.
- Direct shared-file behavior remains unchanged.
- Fetch/malformed ZIP failure paths still fall back to the existing `Open Source` / manual local import guidance.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts src/app/catalog/pubPartsZipArchive.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 3 files / 26 tests.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 29 tests.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Deferrals:
- No ZIP byte cache.
- No extracted file byte cache.
- No manifest prefetch or eager ZIP fetch on Catalog load.
- No local library folder behavior changes.
- No native downloads.
- No Import accept or project asset behavior changes.
- No shared-folder listing.
- No `.stp` support.
- No STEP loader work.
- No builder behavior.
- No compatibility verdicts.

## [x] `Catalog-Gen2-12 / Phase 5` - `ZIP Lane Final Audit`

### Phase 5 Summary

Phase 5 verified the full ZIP lane against the reopened Gen2 wishlist.

Post-closeout correction: Phase 5 verified the fixture-backed/readable-blob ZIP lane but overclaimed live PubParts ZIP coverage. Real PubParts Dropbox ZIP fetches can fail in the browser with `PubParts ZIP archive fetch failed` when CORS/network policy blocks localhost/ParaHook from reading the remote bytes. Phase 5.1 is now required before `Catalog-Gen2-HLG-16` can be marked complete end to end.

### Phase 5 Implementation Spec

Status: implemented and closed as a docs/test audit.

Audit conclusion:
- Original closeout read superseded: `Catalog-Gen2-HLG-16` is not complete end to end for live PubParts Dropbox ZIPs until the Phase 5.1 local `.zip` fallback lands. The readable-blob / fixture-backed ZIP lane can inspect, list, select, extract, and stage supported entries with PubParts attribution, but live Dropbox ZIP fetches can be browser-blocked.
- `Catalog-Gen2-CLG-23` is complete. `@zip.js/zip.js` and `src/app/catalog/pubPartsZipArchive.ts` provide the browser ZIP reader seam, and `CatalogSurface` only starts ZIP inspection from the user-triggered source-options flow, not Catalog load.
- `Catalog-Gen2-CLG-24` is complete. Entry classification covers supported `.step`, `.stl`, `.obj`, and `.glb` entries; recognized-but-unsupported `.stp`; unsupported `.3mf` / `.pdf` / unknown entries; unsafe paths; hidden/system paths; directories; oversized entries; unknown-size entries; over-count archives; and malformed archives before extraction.
- `Catalog-Gen2-CLG-25` remains complete. Selected supported ZIP entries materialize into `ImportedReferenceFile` records with filename, file type, object URL, and PubParts attribution, then stage through the existing Import review draft without creating project assets before Import accept.
- `Catalog-Gen2-CLG-26` remains complete. Repeat source-options opens can use metadata-only manifest cache hits keyed by PubParts item identity, source URL, and source version from `dropboxZipLastUpdated` / `archiveLastUpdated`, while cache hits do not bypass real ZIP-byte extraction safety.

Code inspected:
- `src/app/catalog/pubPartsZipArchive.ts`
- `src/app/catalog/pubPartsArchiveManifestCache.ts`
- `src/app/catalog/pubPartsSharedLinkResolver.ts`
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/references/importReferenceFile.ts`
- `src/app/store/useAppStore.ts` staged Import draft actions

Test coverage inspected:
- `src/app/catalog/pubPartsZipArchive.test.ts`
- `src/app/catalog/pubPartsArchiveManifestCache.test.ts`
- `src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShell.test.tsx`

Proof confirmed for browser-readable ZIP blobs:
- ZIP-backed PubParts source-options flow does not fetch ZIP bytes on Catalog load.
- User action opens source options for a ZIP-backed PubParts item and fetches at most the selected item's ZIP for inspection on cache miss.
- Browser-readable ZIP inspection lists real entries and maps supported and unsupported entries into the dialog with archive path/name, support state, disabled unsupported entries, and sizes when available.
- Supported archive entries can be selected and staged.
- `Stage Selected` for archive entries materializes selected supported entries into Import review files with PubParts attribution.
- Direct-file candidates and mixed direct/archive selections still stage all selected files all-or-nothing.
- Unsupported, unsafe, hidden/system, directory, oversized, unknown-size, over-count, stale, source-mismatched, and malformed archive paths cannot be staged.
- Cache hits skip entry-listing fetch/read for display but still refetch or reuse real ZIP bytes for extraction and re-run extraction guards.
- Browser storage does not contain ZIP bytes, extracted bytes, `Blob`, `File`, object URLs, candidates, Import draft records, or project assets.
- Existing `Open Source` / manual local import guidance remains available when fetch/list/extraction fails.

Follow-up decision:
- `Catalog-Gen2-12 / Phase 5.1` is needed. The audited fixture-backed/readable-blob ZIP-backed PubParts flow can stage selected supported entries into Import review through `Stage Selected`, but live PubParts Dropbox ZIP bytes are not guaranteed browser-readable from localhost/ParaHook.
- The follow-up should preserve the readable-remote path and add a local ZIP picker fallback for browser-blocked archives.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts src/app/catalog/pubPartsZipArchive.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 3 files / 26 tests.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 29 tests.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed, 3 tests.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.
- `git diff --check` passed with the existing line-ending warnings across the dirty worktree.

Scope boundaries preserved:
- No eager ZIP downloads.
- No inspecting all PubParts ZIPs on Catalog load.
- No extract-all behavior.
- No persistent ZIP byte storage.
- No extracted file byte cache.
- No local library folder behavior changes.
- No native downloads.
- No Import accept or project asset behavior changes.
- No shared-folder listing.
- No `.stp` support.
- No STEP loader fidelity work.
- No builder behavior.
- No compatibility verdicts.

## [x] `Catalog-Gen2-12 / Phase 5.1` - `Local ZIP Fallback For Browser-Blocked PubParts Archives`

### Phase 5.1 Summary

Phase 5.1 makes the efficient ZIP lane honest for live PubParts archives that Dropbox will not let the browser fetch directly.

The existing readable-blob ZIP lane remains valid: when `fetch` can read one PubParts ZIP after user action, Catalog should keep using the current remote inspection path. When that fetch fails because the ZIP is CORS/network/browser-blocked, the source-options dialog should offer a local `.zip` picker fallback. The user manually opens/downloads the PubParts ZIP from the existing source link, picks the local ZIP file, and ParaHook lists/extracts entries from that local `Blob` using the existing `pubPartsZipArchive` helper.

### Phase 5.1 Implementation Spec

Status: implemented and closed.

Problem correction:
- Phase 1 through Phase 4 are real for browser-readable ZIP blobs and fixture ZIPs.
- Phase 5 overclaimed live PubParts coverage because the actual PubParts Dropbox ZIP bytes can be blocked by browser fetch from localhost/ParaHook.
- `Catalog-Gen2-HLG-16` can close because browser-blocked live archives now have an honest user-driven local ZIP fallback.

Implementation direction:
- Keep the existing on-demand remote ZIP fetch/listing attempt for readable PubParts ZIP URLs.
- When `inspectPubPartsSharedLinkArchive(...)` fails because the remote ZIP cannot be read, keep the source-options dialog open with honest failure/status copy.
- Show the existing `Open Source` / manual download link plus a new local `.zip` picker action.
- The user manually downloads or opens the PubParts ZIP outside ParaHook, then chooses the saved local `.zip` file.
- ParaHook reads only the user-picked local file `Blob`; it does not write to disk, scan folders, or proxy remote bytes.
- The local ZIP listing path calls the existing `listPubPartsZipArchiveEntries(...)` helper.
- The listed local ZIP entries map through the existing shared-link candidate shape so source options still shows archive path/name, support state, optional size, disabled unsupported entries, and selected supported entries.
- `Stage Selected` reuses the selected local ZIP blob as the ephemeral archive blob and calls the existing guarded extraction/materialization path so selected supported entries become `ImportedReferenceFile` records with PubParts attribution.
- If the selected local file is not a valid ZIP, has no selectable supported entries, or fails extraction guards, show honest status and append nothing to Import review.

Ownership boundaries:
- Catalog owns the source-options fallback UI, local ZIP picker action, fallback status copy, ephemeral local ZIP blob state, and candidate mapping from local ZIP entry metadata.
- `pubPartsZipArchive` remains the owner for ZIP listing/classification/extraction safety.
- `pubPartsSharedLinkResolver` remains the owner for Dropbox URL classification, remote fetch attempts, archive candidate mapping, and selected archive materialization.
- Import remains the owner of staged Import review and accepted project assets.

Likely touched implementation files after Manager approval:
- `src/app/catalog/pubPartsSharedLinkResolver.ts` - expose or add a local-blob archive inspection helper that maps `listPubPartsZipArchiveEntries(...)` results into `PubPartsSharedLinkCandidate[]` for the current staged PubParts source without performing a remote fetch.
- `src/app/catalog/pubPartsSharedLinkResolver.test.ts` - prove local ZIP blob inspection maps entries like remote inspection and preserves source URL / PubParts attribution context.
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` - add browser-blocked/fallback status copy and a local ZIP picker action/button while keeping unsupported entries disabled.
- `src/app/workspace/CatalogSurface.tsx` - wire the fetch-failure state to the fallback action, open a `.zip` file input or picker helper, list the chosen ZIP, store the local ZIP blob ephemerally in the dialog state, and reuse it for `Stage Selected`.
- `src/app/workspace/CatalogSurface.test.tsx` - add the end-to-end fallback proof: remote ZIP fetch fails, dialog offers local ZIP picker, fixture local ZIP lists entries, supported entry is selected, `Stage Selected` extracts from the local ZIP blob, and Import review receives the staged file with PubParts attribution.
- `src/app/catalog/ui/CatalogShell.test.tsx` if shared shell/dialog rendering changes enough to require shell-level proof.

Optional helper if implementation needs a cleaner boundary:
- `src/app/catalog/pubPartsLocalZipPicker.ts` plus focused tests can own the `.zip` file input creation if keeping picker DOM details out of `CatalogSurface` is cleaner.

Acceptance criteria:
- ZIP-backed PubParts `Add To Project` still opens source options immediately and attempts one on-demand remote ZIP fetch when no cache hit is available.
- A browser-blocked remote ZIP fetch does not close the dialog and does not pretend archive contents are known.
- The dialog offers clear `Open Source` / manual download guidance and a local `.zip` picker fallback.
- Choosing a local ZIP lists real entries through `pubPartsZipArchive`.
- Supported entries become selectable source-options candidates; unsupported, unsafe, hidden/system, directory, oversized, unknown-size, over-count, and malformed entries remain unstageable.
- `Stage Selected` extracts selected supported entries from the picked local ZIP blob into Import review with PubParts attribution.
- Direct-file behavior and readable-remote ZIP behavior remain unchanged.
- No Import draft files are appended if local ZIP listing or selected extraction fails.

Focused tests after implementation:
- `src/app/catalog/pubPartsSharedLinkResolver.test.ts` covers local ZIP blob candidate mapping and source context.
- `src/app/workspace/CatalogSurface.test.tsx` covers remote fetch failure -> local ZIP picker -> real entry list -> selected entry staging.
- Existing ZIP helper tests keep covering classification/extraction guards.
- Existing shell/dialog tests are updated only if UI rendering changes require it.

Verification required after implementation:
- `npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` if the dialog/shell rendering changes.
- `npm.cmd run build`

Implementation closeout:
- Kept the existing on-demand remote ZIP fetch/listing attempt for browser-readable PubParts ZIP URLs.
- Updated remote ZIP fetch failure copy so it tells users to use `Open Source` to download the ZIP, then choose the local ZIP in the source-options dialog.
- Added a `Choose Local ZIP` source-options action.
- Added a local `.zip` file picker in `CatalogSurface`.
- Listed entries from the user-picked local ZIP with `listPubPartsZipArchiveEntries(...)`.
- Mapped local ZIP entry metadata through the existing `mapPubPartsZipArchiveEntriesToSharedLinkCandidates(...)` source-options shape.
- Stored the selected local ZIP blob only ephemerally in the open dialog state.
- Reused the local ZIP blob for `Stage Selected`, so selected supported entries extract through the existing guarded archive materialization path and stage into Import review with PubParts attribution.
- Extended the Catalog surface test so remote ZIP inspection failure can recover through local ZIP selection and stage a supported `.stl` entry.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts src/app/catalog/pubPartsZipArchive.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 3 files / 26 tests.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 29 tests.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed, 3 tests.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.
- `git diff --check` passed with the existing line-ending warnings across the dirty worktree.

Deferrals:
- No eager ZIP downloads.
- No native disk writing.
- No remote-byte proxy or server/helper download service.
- No persistent ZIP byte cache.
- No local library folder scan/materialization.
- No extract-all behavior.
- No shared-folder listing.
- No `.stp` support.
- No STEP fidelity work.
- No builder behavior.
- No compatibility verdicts.

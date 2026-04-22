# Catalog-Gen2-15 - OPFS Internal Library And Local Folder Mirror

## Doc Header

### Doc History
11. 2026-04-21 15:55:02: Manager closeout tightened `Catalog-Gen2-15 / Phase 3.1` so the Local Library folder chooser requests browser `readwrite` mode up front, with focused owner and Home Page tests proving the write-intent picker option while preserving runtime/session-only handle storage and no silent disk access.
10. 2026-04-21 15:49:20: Implemented `Catalog-Gen2-15 / Phase 3.1 - Local Library Mirror Status And Catalog Wiring` with a runtime/session-only Local Library directory-handle seam, Home Page connect/reconnect/disable controls, Catalog Local Downloads/item-page mirror status, and best-effort Catalog mirror writes from explicit app-owned archive/extracted-entry bytes even when OPFS/Internal Library is unavailable; added focused owner, Home, Catalog, CatalogShell, downloads-storage, and Home storage verification while preserving Internal Library cache ownership, Import review ownership, and no silent Dropbox/project/builder behavior.
9. 2026-04-21 15:36:00: Prepped `Catalog-Gen2-15 / Phase 3.1 - Local Library Mirror Status And Catalog Wiring` after Manager approved the pure Phase 3 owner seam, rereading the Home Page storage/toggle surface, Home storage transparency helpers, Catalog source-options/Internal Library write flow, Catalog browse rail Local Downloads section, Catalog item-page PubParts Add To Project/local fallback rows, and the new mirror owner; scoped Phase 3.1 to runtime-session directory-handle wiring, truthful Home connect/reconnect status, best-effort Catalog mirror writes after app-owned bytes exist, and no persistent IndexedDB handle store, silent downloads, Import/project ownership changes, object URL storage, or builder/compatibility work.
8. 2026-04-21 15:30:38: Implemented `Catalog-Gen2-15 / Phase 3 - Optional Local Library Folder Mirror` as the pure Local Library mirror owner seam plus serializable status contract, adding `pubPartsLocalLibraryMirror.ts` and focused tests for directory-picker capability, explicit choose behavior, deterministic visible paths, unsafe path rejection, manifest/archive/extracted-candidate mirror writes, nonblocking write errors, and no handle/Blob/File/object URL/imported-reference storage; verified the new owner tests, the existing PubParts downloads storage tests, and production build while leaving CatalogSurface/Home UI wiring to `Phase 3.1`.
7. 2026-04-21 15:26:20: Prepped `Catalog-Gen2-15 / Phase 3 - Optional Local Library Folder Mirror` after rereading the live PubParts downloads/local-library metadata owner, OPFS Internal Library byte owner, Catalog source-options cache/write flow, Home Page storage transparency surface, and existing PubParts local-library/downloads tests; scoped the next implementation to a browser-honest optional user-selected visible folder mirror with Internal Library remaining default cache truth, recommended a pure Local Library mirror owner seam first, and routed broader Catalog/Home UI status wiring to `Phase 3.1` unless Manager explicitly widens Phase 3.
6. 2026-04-21 14:48:32: Implemented `Catalog-Gen2-15 / Phase 2.1 - Source Options Async Cache Read Lifecycle Guard` after Manager review found that delayed OPFS cache reads could reopen or update a closed/stale source-options dialog; guarded async OPFS/localStorage fallback updates with the same staged-source dialog ownership check used by remote inspection callbacks, added a delayed Internal Library cache-read regression test, and preserved chooser status updates plus all Phase 2 storage/import boundaries.
5. 2026-04-21 14:42:42: Implemented `Catalog-Gen2-15 / Phase 2 - User-Actioned Source Byte Cache And Reopen` by adding OPFS handle-like archive/extracted-candidate read/write helpers to the PubParts Internal Library owner, wiring Catalog source-options so user-uploaded ZIP bytes and inspected manifests cache into OPFS when available, reopening same-source-version source options from OPFS archive bytes before localStorage metadata fallback or remote inspection, preserving selected-entry Import review ownership, adding a nonblocking extracted-entry cache callback, and verifying the focused Internal Library, shared-link resolver, Catalog source-options, PubParts cache/archive/downloads, and build commands.
4. 2026-04-21 14:31:37: Prepped `Catalog-Gen2-15 / Phase 2 - User-Actioned Source Byte Cache And Reopen` after rereading the live `CatalogSurface` source-options/local ZIP flow, ZIP archive listing/extraction helpers, shared-link archive materialization seam, metadata-only localStorage archive manifest cache, and the new pure OPFS/Internal Library owner; scoped Phase 2 to explicit user-actioned archive/manifest/extracted-candidate OPFS writes, source-options reopen from same-source-version cache hits, localStorage metadata fallback preservation, selected-entry Import review handoff, and no Local Library mirror or ZIP 3D preview behavior.
3. 2026-04-21 14:29:22: Implemented `Catalog-Gen2-15 / Phase 1 - OPFS Capability And Internal Library Boundary` by adding the pure `pubPartsInternalLibrary.ts` OPFS/Internal Library owner seam plus focused tests for capability, path, manifest, unavailable/quota/error states, and no Blob/File/object URL/imported-reference ownership; verified the new owner tests, existing PubParts downloads/manifest/ZIP/Home storage tests, and production build passed while leaving Catalog source-options, Home Page UI, Import review, ViewerHost, Local Library mirror, preview toggle, and OPFS byte writes untouched.
2. 2026-04-21 14:22:59: Prepped `Catalog-Gen2-15 / Phase 1 - OPFS Capability And Internal Library Boundary` after reading the live Catalog source-options, ZIP archive helper, metadata-only archive manifest cache, staged PubParts downloads/local-library metadata, Home Page storage visibility, and Import handoff seams; scoped Phase 1 to a pure OPFS/Internal Library owner module with capability, path, manifest, quota/unavailable/error states, and focused tests while leaving current Add To Project/source-options/local ZIP fallback/Import review/viewer behavior unchanged and routing uploaded ZIP entry 3D preview to a separate `Catalog-Gen2-16` lane after OPFS cache/extraction ownership is firm.
1. 2026-04-21 11:55:57: Created this `Catalog-Gen2-15` Family Phase Doc to plan the OPFS-backed ParaHook Internal Library as the default PubParts source cache and the optional user-selected Local Library folder as a visible filesystem mirror.

### Purpose

This file owns the next PubParts source-library direction after the browser-honest ZIP staged importer and accepted-reference rehydration closeouts.

Use it to answer:
- how OPFS should become ParaHook's default Internal Library for PubParts source files
- how cached source bytes, extracted files, manifests, and inspection results should relate to `Add To Project`
- how a user-selected Local Library folder should mirror files for visibility without becoming required
- what Dropbox/CORS/API/helper behavior remains separate from storage

Do not use it for:
- bypassing browser sandbox rules
- silently writing to arbitrary local disk folders
- eager downloading every PubParts ZIP/archive
- replacing Import review or project asset ownership
- STEP loader fidelity, `.stp` support, builder behavior, or compatibility verdicts

## Doc Body

### Family Phase Goal

Make PubParts `Add To Project` feel like an app-managed source library while staying browser-honest.

The default experience should not require the user to choose a local folder every time. ParaHook should use OPFS as an Internal Library where it can persist source files after explicit user action:

```text
Internal Library/
  PubParts/
    parts/
      <catalog-item-slug>/
        pubparts-source.json
        source/
        archives/
        extracted/
        importable/
        inspections/
```

The optional experience should let the user pick a real filesystem folder once, then mirror PubParts source and extracted files there when permission is available:

```text
<UserSelectedRoot>/PubParts/
  parts/
    <catalog-item-slug>/
      pubparts-source.json
      source/
      downloads/
      extracted/
      importable/
```

### Ownership Boundary

Catalog owns:
- source identity, item identity, source-options status, and user-facing `Add To Project` flow
- deciding whether a PubParts source is cached, inspected, extracted, ready for Import review, mirrored, or permission-blocked
- showing Internal Library and Local Library state without making either one project truth

The OPFS/Internal Library owner seam owns:
- capability detection
- directory and manifest convention
- reading/writing cached source bytes and extracted files
- invalidating cached results when the source URL or freshness metadata changes
- exposing cache state to Catalog and Import handoff code

The Local Library mirror owner seam owns:
- directory picker setup
- permission/reconnect state
- mirroring OPFS-managed files into the user-selected visible folder
- open-folder affordances where browser support allows them

Import owns:
- staged Import review
- accepted file type validation
- project/imported-reference creation
- final accepted asset ownership

Later helper/API/native owners own:
- Dropbox-blocked remote-byte fetching
- shared-folder listing
- direct native downloads into a real folder

### Important Constraint

OPFS does not solve Dropbox access by itself.

It solves this question:

```text
Once ParaHook has source bytes, where can it store, inspect, and reuse them without prompting every time?
```

It does not solve this question:

```text
Can ParaHook fetch or list this PubParts Dropbox source from the browser?
```

If browser fetch is blocked, the source bytes must come from `Open Source` / `Choose Local ZIP`, a helper/API materializer, or a later native downloader before OPFS can cache them.

### Uploaded ZIP Preview Placement Decision

The uploaded/cached ZIP entry 3D preview toggle should be planned as a separate follow-up family phase, tentatively:

`Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview`

Do not fold that behavior into `Catalog-Gen2-15 / Phase 1`.

Reason:
- `Catalog-Gen2-15` owns source-byte/cache/extracted-candidate storage boundaries.
- ZIP entry preview owns viewer/import-preview affordances, object URL lifetime, selected-entry preview toggles, and possibly temporary extracted entry blobs.
- The cleanest preview lane should consume an OPFS/cache/extraction owner instead of making the source-options dialog invent another transient blob owner.

Recommended sequencing:
- Prep `Catalog-Gen2-16` as its own doc after `Catalog-Gen2-15 / Phase 1` is approved, but implement the preview toggle after either:
  - `Catalog-Gen2-15 / Phase 2` provides stable cached uploaded ZIP/extracted candidate bytes, or
  - Manager explicitly accepts a smaller preview proof that uses only the current in-dialog `archiveBlob` and does not persist preview bytes.

This keeps Phase 1 small and keeps preview behavior out of the storage-boundary slice.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-19. make PubParts Add To Project feel like an app-managed parts library by using OPFS as ParaHook's default Internal Library for cached source bytes, extracted files, manifests, and inspection results, with an optional one-time user-selected Local Library folder mirror for visible files`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-35. Add an OPFS-backed Internal Library owner for PubParts source bytes, ZIPs, extracted candidates, source manifests, and inspection results that only caches files after an explicit user action.
- [ ] Catalog-Gen2-CLG-36. Add an optional user-selected Local Library folder mirror that can copy OPFS-managed PubParts source/extracted/importable files into a visible filesystem folder when permission is available.

### `Catalog-Gen2-15 / Phase 1`

- [x] Define the OPFS owner seam and browser capability read.
- [x] Define the PubParts Internal Library directory convention.
- [x] Define the cache manifest shape for provider id, Catalog item id, source URL, source freshness, source file name, byte size, inspection state, extracted candidates, and import handoff state.
- [x] Define unavailable and storage-quota states.
- [x] Keep ZIP extraction, Import accept, folder mirror, and remote-byte helper behavior out of Phase 1 unless needed for a tiny proof.
- [x] `Catalog-Gen2-HLG-19`
- [x] Catalog-Gen2-CLG-35 boundary slice.

### `Catalog-Gen2-15 / Phase 2`

- [x] Persist explicitly user-acted PubParts source bytes into OPFS.
- [x] Persist extracted supported candidates and inspection results.
- [x] Reopen source options from Internal Library cache when the source URL/freshness still matches.
- [x] Invalidate stale cache entries when PubParts source metadata changes.
- [x] Keep eager all-PubParts download out of scope.
- [x] `Catalog-Gen2-HLG-19`
- [x] Catalog-Gen2-CLG-35 cache slice.

### `Catalog-Gen2-15 / Phase 3`

- [x] Add optional Local Library folder owner setup.
- [x] Mirror already app-managed source/extracted/importable files into the selected visible folder when permission is available.
- [x] Represent unsupported, not-configured, permission-needed, enabled, disabled, unavailable, error, mirrored, and mirror-error owner states.
- [x] Keep Internal Library as the default source of app-managed cached state.
- [x] `Catalog-Gen2-HLG-19` owner-seam slice.
- [x] Catalog-Gen2-CLG-36 owner-seam slice.

### `Catalog-Gen2-15 / Phase 3.1`

- [x] Wire Home Page PubParts Library action to the browser-honest Local Library mirror owner.
- [x] Keep the selected directory handle in runtime/session state only; store serializable status/label/path metadata in PubParts downloads storage.
- [x] Show truthful unsupported, permission-needed/reconnect, enabled, disabled, unavailable, and mirror-error status in Home and Catalog.
- [x] Best-effort mirror app-owned archive/manifest/extracted candidate bytes after explicit user actions only.
- [x] Keep Internal Library as canonical source/cache truth and Import as project handoff owner.
- [x] `Catalog-Gen2-HLG-19` user-visible mirror wiring slice.
- [x] Catalog-Gen2-CLG-36 Catalog/Home wiring slice.

## [x] `Catalog-Gen2-15 / Phase 1` - `OPFS Capability And Internal Library Boundary`

### Phase 1 Summary

Plan and introduce the Internal Library boundary before storing PubParts source bytes.

### Phase 1 Implementation Spec

Status: complete.

#### Implementation Status

- Added `src/app/catalog/pubPartsInternalLibrary.ts` as a pure owner seam.
- Added `src/app/catalog/pubPartsInternalLibrary.test.ts` with seven deterministic tests.
- Implemented injectable OPFS capability detection without direct Catalog component ownership.
- Locked the `Internal Library/PubParts/parts/<itemSlug>/...` path convention for source, archives, inspections, extracted entries, and importable files.
- Added manifest build/sanitize helpers for PubParts source identity, source freshness, source file name, byte size, inspection state, extracted candidates, and import handoff state.
- Made `available`, `unsupported`, `unavailable`, `quota-unavailable`, and `error` states representable.
- Did not wire the owner into `CatalogSurface`, source-options, Home Page, Import review, ViewerHost, Local Library mirror, or preview toggles.
- Did not write OPFS bytes, extract files, create object URLs, stage Import review files, or change current Add To Project behavior.

#### Current Live Read

`src/app/workspace/CatalogSurface.tsx` currently owns the live PubParts source-options flow:
- `handleAddPubPartsDropboxFileToProject` opens the source-options dialog.
- remote ZIP inspection calls `inspectPubPartsSharedLinkArchive(stagedRecord)`.
- local ZIP fallback calls `chooseLocalPubPartsZipArchive()` and then `listPubPartsZipArchiveEntries(archiveBlob)`.
- the selected local ZIP `Blob` is held only in `PubPartsSourceOptionsDialogState.archiveBlob`.
- staging selected files calls `openStagedImportDraft({})` and `appendStagedImportDraftFiles(files)`.

`src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` is presentational:
- it shows `Download ZIP`, `Upload ZIP`, selectable ZIP entry rows, support state, and `Preview: In Import review after staging`.
- it does not own storage, ZIP extraction, object URLs, or Import review.

`src/app/catalog/pubPartsZipArchive.ts` owns ZIP listing/extraction safety:
- it classifies supported, unsupported, unsafe, directory, and blocked entries.
- it enforces `PUBPARTS_ZIP_MAX_ENTRY_SIZE_BYTES` and `PUBPARTS_ZIP_MAX_ENTRY_COUNT`.
- it can extract selected supported entries to `Blob`s, but it does not persist them.

`src/app/catalog/pubPartsArchiveManifestCache.ts` owns metadata-only ZIP manifest caching:
- it stores inspected entries in `localStorage` under `parahook:catalog:pubparts-archive-manifest-cache`.
- it keys cache records by provider, catalog item id, source URL, and source freshness.
- it intentionally does not store ZIP bytes, extracted bytes, `File`s, object URLs, or imported references.

`src/app/catalog/pubPartsDownloadsStorage.ts` owns staged PubParts source metadata and local-library metadata:
- it stores staged source records in `localStorage` under `parahook:catalog:pubparts-downloads`.
- `binaryStatus` is currently only `not-downloaded`.
- local library status is metadata-only: `not-configured`, `permission-needed`, `enabled`, `disabled`, or `unavailable`.
- `preparePubPartsLocalSourceRecord` already defines a visible-folder convention under `PubParts/parts/<itemSlug>/...`, but it does not create folders or write bytes.

`src/app/workspace/homePageStorageTransparency.ts` currently lists `PubParts downloads` as a `localStorage` bucket and separately reads the browser origin storage estimate:
- this is useful for OPFS capacity messaging.
- it should not pretend OPFS is a `localStorage` key.
- Phase 1 should keep Home Page UI unchanged unless Manager explicitly wants a read-only OPFS capability row.

`src/app/references/importReferenceFile.ts` and the store Import handoff remain the accepted file/project owner:
- Phase 1 should not alter supported file types, `objectUrl` creation, staged Import review, or accepted imported-reference creation.

#### Smallest Implementation Slice

Add a pure owner module:

- `src/app/catalog/pubPartsInternalLibrary.ts`

Add focused tests:

- `src/app/catalog/pubPartsInternalLibrary.test.ts`

Do not wire the module into `CatalogSurface`, `CatalogShellSourceOptionsDialog`, Home Page, Import review, or `ViewerHost` in Phase 1.

The module should own:
- OPFS capability detection through an injected browser-storage seam.
- a stable PubParts Internal Library path convention.
- a stable manifest shape for later writes.
- representable unavailable, quota, and error states.
- path/key sanitization rules for provider id, Catalog item id, source URL/freshness, source file names, and ZIP entry paths.

#### Exact First Code Cut

Create `src/app/catalog/pubPartsInternalLibrary.ts` with types and pure helpers first.

Suggested public surface:

```ts
export const pubPartsInternalLibraryRootPath = 'Internal Library/PubParts'
export const pubPartsInternalLibrarySchemaVersion = 1 as const

export type PubPartsInternalLibraryCapability =
  | {
      state: 'available'
      rootPath: typeof pubPartsInternalLibraryRootPath
      usageBytes: number | null
      quotaBytes: number | null
      message: string
    }
  | {
      state: 'unsupported' | 'unavailable' | 'quota-unavailable' | 'error'
      rootPath: typeof pubPartsInternalLibraryRootPath
      usageBytes: number | null
      quotaBytes: number | null
      message: string
    }

export type PubPartsInternalLibraryManifest = {
  schemaVersion: typeof pubPartsInternalLibrarySchemaVersion
  providerId: 'pubparts'
  providerName: 'PubParts'
  catalogItemId: string
  catalogItemLabel: string
  itemSlug: string
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  sourceUrl?: string
  sourceVersionKey: string
  sourceVersionKind: 'archiveLastUpdated' | 'sourceLastUpdated' | 'unversioned'
  sourceLastUpdated?: string
  archiveLastUpdated?: string
  sourceFileName?: string
  sourceByteSize?: number
  inspectionStatus: 'not-inspected' | 'metadata-inspected' | 'extracted-candidates'
  importStatus: 'not-imported' | 'ready-for-import-review'
  createdAt: string
  updatedAt: string
}
```

Suggested helpers:

```ts
export function resolvePubPartsInternalLibraryCapability(
  env?: PubPartsInternalLibraryEnv,
): Promise<PubPartsInternalLibraryCapability>

export function resolvePubPartsInternalLibraryItemPaths(
  input: PubPartsInternalLibraryPathInput,
): PubPartsInternalLibraryItemPaths

export function buildPubPartsInternalLibraryManifest(
  input: PubPartsInternalLibraryManifestInput,
): PubPartsInternalLibraryManifest

export function sanitizePubPartsInternalLibraryManifest(
  rawValue: unknown,
): PubPartsInternalLibraryManifest | null
```

Use an injectable env in tests instead of reaching directly into `navigator` everywhere:

```ts
type PubPartsInternalLibraryEnv = {
  storageManager?: {
    estimate?: () => Promise<{ usage?: number; quota?: number }>
    getDirectory?: () => Promise<unknown>
  } | null
}
```

The default env can read `navigator.storage` when it exists.

#### Path Convention

Phase 1 should lock these paths without writing bytes yet:

```text
Internal Library/PubParts/
  parts/
    <itemSlug>/
      pubparts-source.json
      source/
        <sourceVersionKey>/
          <safeSourceFileName>
      archives/
        <sourceVersionKey>/
          <safeArchiveFileName>
      inspections/
        <sourceVersionKey>/
          archive-manifest.json
      extracted/
        <sourceVersionKey>/
          <normalized-archive-path>
      importable/
        <sourceVersionKey>/
          <safeFileName>
```

Rules:
- `<itemSlug>` should be deterministic from Catalog item label and id, matching the spirit of `preparePubPartsLocalSourceRecord`.
- `<sourceVersionKey>` should prefer `archiveLastUpdated`, then `sourceLastUpdated`, then `source-v1`.
- ZIP entry paths must stay normalized and must reuse the existing archive safety decisions from `pubPartsZipArchive.ts`; Phase 1 should not invent a second ZIP path sanitizer.
- The path helper can accept already-normalized safe archive paths for tests, but later write paths must revalidate through `pubPartsZipArchive.ts` before extraction.

#### Capability And State Rules

Phase 1 should make these states representable:
- `available`: `navigator.storage.getDirectory` exists and resolves; storage estimate may include usage/quota.
- `unsupported`: browser storage manager or `getDirectory` is missing.
- `quota-unavailable`: OPFS root can open, but `navigator.storage.estimate()` is missing or does not expose usable quota.
- `unavailable`: OPFS root open rejects, such as browser/private-mode refusal.
- `error`: unexpected capability/estimate error that should not be hidden as success.

Quota handling in Phase 1 is descriptive only. Do not reserve space, write source bytes, evict cached files, or enforce size limits yet.

#### Focused Tests

Add `src/app/catalog/pubPartsInternalLibrary.test.ts` with these test titles:

1. `reports OPFS internal library capability as available with origin usage and quota`
2. `reports OPFS internal library capability as unsupported when getDirectory is missing`
3. `reports OPFS internal library capability as quota-unavailable when estimate data is missing`
4. `reports OPFS internal library capability as unavailable when the OPFS root cannot open`
5. `resolves deterministic PubParts internal library paths for source, archive, inspection, extracted, and importable files`
6. `builds and sanitizes PubParts internal library manifests without Blob File objectUrl or imported-reference ownership`

Optional if the implementation touches Home Page storage visibility:

7. `reports OPFS internal library capability as error when the quota check fails`

Home Page storage visibility was not touched in Phase 1, so the optional `keeps PubParts Internal Library separate from localStorage bucket measurement` test was not added.

#### Existing Regression Tests To Run

Run these existing targeted tests because Phase 1 must not change current behavior:

```bash
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts
npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts
npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts
npm.cmd test -- src/app/workspace/homePageStorageTransparency.test.ts
```

Run the new focused test:

```bash
npm.cmd test -- src/app/catalog/pubPartsInternalLibrary.test.ts
```

Run the build:

```bash
npm.cmd run build
```

#### Verification Result

- `npm.cmd test -- src/app/catalog/pubPartsInternalLibrary.test.ts` passed: 7 passed.
- `npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts` passed: 14 passed.
- `npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts` passed: 5 passed.
- `npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts` passed: 7 passed.
- `npm.cmd test -- src/app/workspace/homePageStorageTransparency.test.ts` passed: 2 passed.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Acceptance:
- OPFS capability is checked through a small owner seam rather than directly in Catalog components.
- PubParts Internal Library path/manifest conventions are documented in code or tests.
- Browser unavailable/quota/error states are representable.
- Current `Add To Project`, source-options, local ZIP fallback, Import review, and viewer rehydration behavior remain unchanged.
- Focused owner tests plus the requested current PubParts storage/cache/archive/Home visibility tests pass.

#### Out Of Scope

- No OPFS byte writes yet.
- No OPFS reads for source-options cache hits yet.
- No migration from `pubPartsArchiveManifestCache.ts` localStorage manifest cache yet.
- No changes to current `Download ZIP`, `Upload ZIP`, selected-entry staging, or Import review handoff.
- No Local Library folder picker or filesystem mirror.
- No uploaded ZIP entry 3D preview toggle.
- No direct Dropbox/CORS/API/helper behavior.
- No STEP loader fidelity, `.stp` support expansion, builder behavior, or compatibility verdicts.

## [ ] `Catalog-Gen2-15 / Phase 2` - `User-Actioned Source Byte Cache And Reopen`

### Phase 2 Summary

Persist PubParts archive/source bytes only after an explicit user action, then let source options reopen from the Internal Library cache when the same PubParts source version is still current.

Status: complete.

#### Phase 2 Implementation Status

- Extended `src/app/catalog/pubPartsInternalLibrary.ts` with OPFS handle-like directory/file/writable types for deterministic jsdom tests.
- Added archive cache write/read helpers that require both archive bytes and inspection manifest metadata before returning a cache hit.
- Matched archive cache reads against staged source identity, source URL, linked archive URL, and source freshness/source-version key.
- Phase 2.1 guarded delayed OPFS/localStorage fallback updates so they only update source-options when the current dialog still exists and still belongs to the same `stagedSourceId`; a closed or replaced dialog is not reopened by a late cache read.
- Added extracted-candidate byte writes under the existing `extracted/<sourceVersionKey>/...` and `importable/<sourceVersionKey>/...` path convention while updating the Internal Library manifest.
- Kept OPFS failures nonblocking for Catalog source-options and Import review handoff.
- Added a backward-compatible `onExtractedEntries` callback to `materializePubPartsSharedLinkArchiveCandidateFiles`; callback failures are swallowed so selected file materialization still succeeds.
- Wired `CatalogSurface` local ZIP upload so a user-selected archive writes archive bytes plus inspected ZIP metadata into OPFS when available.
- Wired source-options open so OPFS same-source-version archive+manifest hits are checked before localStorage manifest fallback or remote inspection.
- Preserved the existing metadata-only localStorage archive manifest cache as fallback.
- Preserved selected-entry Import review ownership; Catalog cache writes do not auto-commit project assets or create imported references.
- Left Local Library mirror, Home Page storage UI, uploaded ZIP entry 3D preview, Dropbox helper/API work, STEP loader support, builder behavior, and compatibility verdicts out of Phase 2.

### Phase 2 Current Live Read

`src/app/workspace/CatalogSurface.tsx` owns the live source-options dialog state:
- `PubPartsSourceOptionsDialogState` already carries `archiveBlob`, `archiveBlobSourceUrl`, and `archiveBlobStagedSourceId`.
- `handleAddPubPartsDropboxFileToProject` first builds source candidates, then reads `readPubPartsArchiveManifestCacheRecord(stagedRecord)` when ZIP archive metadata is needed.
- When localStorage has metadata, the dialog can show cached ZIP entries, but it still warns that selected entries must be revalidated from real archive bytes before Import review.
- When localStorage misses, `inspectPubPartsSharedLinkArchive(stagedRecord)` fetches the remote ZIP, lists entries, writes the metadata-only localStorage manifest cache, and stores the fetched `archiveBlob` in dialog state.
- `handleChooseLocalPubPartsArchive` is the browser-honest fallback that prompts for a user-selected `.zip`, calls `listPubPartsZipArchiveEntries(archiveBlob)`, maps entries into candidates, and stores the local `archiveBlob` only in memory.
- `handleStageSelectedPubPartsSourceOptions` keeps Import ownership intact by calling `openStagedImportDraft({})` and `appendStagedImportDraftFiles(files)` only after selected files are materialized.

`src/app/catalog/pubPartsZipArchive.ts` remains the ZIP safety owner:
- `listPubPartsZipArchiveEntries(archiveBlob)` produces the inspected entry metadata used by source options.
- `extractPubPartsZipArchiveEntries(archiveBlob, normalizedArchivePaths)` extracts selected, supported entries to `Blob`s.
- Phase 2 should reuse these helpers and must not add a second archive-path safety system.

`src/app/catalog/pubPartsSharedLinkResolver.ts` already has the narrow archive-byte seam Phase 2 needs:
- `inspectPubPartsSharedLinkArchive(stagedRecord)` returns `archiveBlob`, `entries`, `candidates`, and `sourceUrl` after a successful fetch.
- `materializePubPartsSharedLinkArchiveCandidateFiles(stagedRecord, candidates, { archiveBlob })` already accepts a supplied archive `Blob`, which lets selected-entry staging reuse a local or OPFS-read archive instead of fetching again.
- The only likely helper adjustment is an optional extracted-entry capture seam so the Internal Library can store extracted candidate blobs after selected extraction without making `CatalogSurface` duplicate extraction logic.

`src/app/catalog/pubPartsArchiveManifestCache.ts` is still useful:
- it is metadata-only localStorage keyed by provider, catalog item id, source URL, and source freshness.
- Phase 2 must preserve it as the old metadata fallback while OPFS becomes the richer byte owner.

`src/app/catalog/pubPartsInternalLibrary.ts` now owns Phase 1 capability, path, and manifest shape:
- it can determine OPFS availability through an injectable `storageManager`.
- it can resolve deterministic Internal Library paths and build/sanitize manifests.
- it does not yet read or write OPFS directories, archive bytes, inspection manifests, or extracted candidate bytes.

### Smallest Implementation Slice

Phase 2 should wire the current local ZIP upload path first.

Reason:
- browser-blocked Dropbox ZIP fetches already force the user to make an explicit local ZIP grant.
- the `Upload ZIP` path already owns a real `Blob` and a selected PubParts staged source record.
- persisting that `Blob` plus inspected entries gives an immediate reopen win without claiming Dropbox can be silently fetched.

Implementation order:
1. Add OPFS read/write helpers to `pubPartsInternalLibrary.ts`.
2. Add deterministic in-memory OPFS handle fakes to `pubPartsInternalLibrary.test.ts`.
3. In `handleChooseLocalPubPartsArchive`, after a successful local ZIP listing, write the archive bytes and inspection manifest to the Internal Library when capability is available.
4. In `handleAddPubPartsDropboxFileToProject`, check OPFS for a same-source-version archive/manifest cache hit before falling back to localStorage metadata or remote inspection.
5. In selected archive-entry staging, reuse the OPFS/local dialog `archiveBlob` through the existing `materializePubPartsSharedLinkArchiveCandidateFiles(..., { archiveBlob })` seam.
6. Add a tiny extracted-entry capture seam to `materializePubPartsSharedLinkArchiveCandidateFiles` only if needed to persist extracted supported candidates without a second extraction pass.

Successful remote archive inspection can also write OPFS archive bytes because that is a successful source materialization, but the first user-visible behavior should be the local ZIP upload cache/reopen loop. Browser-blocked remote ZIP sources must continue to ask for `Download ZIP` plus `Upload ZIP`; OPFS must not imply ParaHook can silently fetch blocked Dropbox bytes.

### Proposed Helper API Surface

Extend `src/app/catalog/pubPartsInternalLibrary.ts` with minimal OPFS handle-like types so tests can run in jsdom:

```ts
export type PubPartsInternalLibraryDirectoryHandleLike = {
  getDirectoryHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<PubPartsInternalLibraryDirectoryHandleLike>
  getFileHandle: (
    name: string,
    options?: { create?: boolean },
  ) => Promise<PubPartsInternalLibraryFileHandleLike>
}

export type PubPartsInternalLibraryFileHandleLike = {
  getFile: () => Promise<Blob>
  createWritable: () => Promise<PubPartsInternalLibraryWritableFileLike>
}

export type PubPartsInternalLibraryWritableFileLike = {
  write: (data: Blob | string | Uint8Array) => Promise<void> | void
  close: () => Promise<void> | void
}
```

Broaden the Phase 1 env without forcing Catalog components to know browser APIs:

```ts
export type PubPartsInternalLibraryStorageManager = {
  estimate?: () => Promise<PubPartsInternalLibraryStorageEstimate>
  getDirectory?: () => Promise<PubPartsInternalLibraryDirectoryHandleLike>
}
```

Add owner-level archive cache helpers:

```ts
export type PubPartsInternalLibraryArchiveCacheWriteInput = {
  stagedRecord: PubPartsStagedSourceRecord
  archiveBlob: Blob
  entries: PubPartsZipArchiveEntryMetadata[]
  sourceFileName?: string
  createdAt?: string
  updatedAt?: string
  env?: PubPartsInternalLibraryEnv
}

export type PubPartsInternalLibraryArchiveCacheHit = {
  manifest: PubPartsInternalLibraryManifest
  archiveBlob: Blob
  entries: PubPartsZipArchiveEntryMetadata[]
  paths: PubPartsInternalLibraryItemPaths
}

export async function writePubPartsInternalLibraryArchiveCache(
  input: PubPartsInternalLibraryArchiveCacheWriteInput,
): Promise<PubPartsInternalLibraryArchiveCacheHit>

export async function readPubPartsInternalLibraryArchiveCache(
  stagedRecord: PubPartsStagedSourceRecord,
  env?: PubPartsInternalLibraryEnv,
): Promise<PubPartsInternalLibraryArchiveCacheHit | null>
```

The helper should write:
- `pubparts-source.json` with the Phase 1 manifest shape.
- `archives/<sourceVersionKey>/<safeArchiveFileName>` with the user-actioned archive `Blob`.
- `inspections/<sourceVersionKey>/archive-manifest.json` with the inspected ZIP entry metadata.

Add selected-extraction persistence helpers:

```ts
export type PubPartsInternalLibraryExtractedCandidateWriteInput = {
  stagedRecord: PubPartsStagedSourceRecord
  candidate: PubPartsSharedLinkCandidate
  extractedEntry: PubPartsZipArchiveExtractedEntry
  env?: PubPartsInternalLibraryEnv
}

export async function writePubPartsInternalLibraryExtractedCandidate(
  input: PubPartsInternalLibraryExtractedCandidateWriteInput,
): Promise<PubPartsInternalLibraryExtractedCandidate>
```

If the resolver needs to expose extracted blobs without duplicating extraction in `CatalogSurface`, make the smallest backward-compatible change:

```ts
type MaterializeSharedLinkArchiveEnv = FetchSharedLinkCandidateEnv & {
  archiveBlob?: Blob
  onExtractedEntries?: (
    entries: PubPartsZipArchiveExtractedEntry[],
  ) => Promise<void> | void
}
```

`onExtractedEntries` must run only after archive extraction succeeds and before object URLs are returned. If the cache write fails, Phase 2 should not block Import review staging; it should surface a cache warning in source-options status while preserving selected-entry staging.

### User-Visible Behavior

First local ZIP upload:
- The user still clicks `Upload ZIP` and chooses a `.zip`.
- The dialog still lists supported/unsupported archive entries and selects supported entries.
- When OPFS cache writes succeed, status copy should say the local ZIP was inspected and saved to the Internal Library.
- When OPFS is unsupported, unavailable, quota-unavailable, or write-erroring, status copy should say the ZIP was inspected for this session and the Internal Library cache is unavailable; the current selected-entry Import review flow must keep working.

Reopening source options for the same PubParts source version:
- `CatalogSurface` should check OPFS first for a source URL/freshness match.
- If OPFS has both archive bytes and inspection metadata, the dialog should open with candidates from the cached inspection and `archiveBlob` from OPFS.
- The chooser status should name an Internal Library cache hit and say selected ZIP entries will be revalidated from cached archive bytes before Import review.
- It must not fetch Dropbox bytes or claim the browser can bypass blocked Dropbox access.

Stale source metadata:
- If the source URL or freshness metadata changes, OPFS should miss and the current inspection/upload path should remain the only path forward.

Selected staging:
- Selected archive entries still stage through `materializePubPartsSharedLinkArchiveCandidateFiles`.
- Import review remains the only route to accepted project/imported-reference assets.
- No files are auto-committed to the project and no imported-reference ids are created by Catalog cache writes.

### Proposed Files

Likely implementation files:
- `src/app/catalog/pubPartsInternalLibrary.ts`
- `src/app/catalog/pubPartsInternalLibrary.test.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`

Possible tiny support files if the implementation read proves they avoid duplicated extraction:
- `src/app/catalog/pubPartsSharedLinkResolver.ts`
- `src/app/catalog/pubPartsSharedLinkResolver.test.ts`

Tracking files for implementation:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-15 - OPFS Internal Library And Local Folder Mirror.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

### Focused Tests

Add or update `src/app/catalog/pubPartsInternalLibrary.test.ts`:
1. `writes and reads PubParts archive bytes with inspected manifest metadata from OPFS`
2. `returns null for an Internal Library archive cache miss when source freshness changes`
3. `reports archive cache writes as unavailable without mutating Catalog behavior when OPFS is unsupported`
4. `writes extracted supported candidate bytes under the source version path`

Add or update `src/app/workspace/CatalogSurface.test.tsx`:
1. `writes local ZIP upload bytes and manifest into the PubParts Internal Library after Upload ZIP`
2. `reopens source options from the PubParts Internal Library cache for the same source version`
3. `falls back to the existing local ZIP upload path when the Internal Library cache is unavailable`
4. `does not use stale Internal Library archive bytes when source freshness changes`
5. `stages selected cached archive entries through Import review without auto-committing project assets`

Add or update `src/app/catalog/pubPartsSharedLinkResolver.test.ts` only if `onExtractedEntries` is added:
1. `passes extracted archive entries to the optional cache callback while preserving imported file materialization`
2. `stages selected archive entries when the optional cache callback fails`

### Verification Commands

Run the owner and ZIP/cache helper tests:

```bash
npm.cmd test -- src/app/catalog/pubPartsInternalLibrary.test.ts
npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts
npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts
```

Run targeted Catalog source-options tests:

```bash
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "writes local ZIP upload bytes and manifest into the PubParts Internal Library after Upload ZIP"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "reopens source options from the PubParts Internal Library cache for the same source version"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "falls back to the existing local ZIP upload path when the Internal Library cache is unavailable"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not use stale Internal Library archive bytes when source freshness changes"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "stages selected cached archive entries through Import review without auto-committing project assets"
```

Run the resolver test only if the optional extracted-entry callback is added:

```bash
npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts -t "passes extracted archive entries to the optional cache callback while preserving imported file materialization"
```

Run the build:

```bash
npm.cmd run build
```

### Verification Result

- `npm.cmd test -- src/app/catalog/pubPartsInternalLibrary.test.ts` passed: 11 passed.
- `npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts` passed: 5 passed.
- `npm.cmd test -- src/app/catalog/pubPartsZipArchive.test.ts` passed: 7 passed.
- `npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts` passed: 14 passed.
- `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts -t "passes extracted archive entries to the optional cache callback while preserving imported file materialization"` passed: 1 passed, 15 skipped.
- `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts -t "stages selected archive entries when the optional cache callback fails"` passed: 1 passed, 15 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "writes local ZIP upload bytes and manifest into the PubParts Internal Library after Upload ZIP"` passed: 1 passed, 34 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "reopens source options from the PubParts Internal Library cache for the same source version"` passed: 1 passed, 34 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not reopen source options when an Internal Library cache read resolves after the dialog closes"` passed: 1 passed, 35 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "falls back to the existing local ZIP upload path when the Internal Library cache is unavailable"` passed: 1 passed, 34 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not use stale Internal Library archive bytes when source freshness changes"` passed: 1 passed, 34 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "stages selected cached archive entries through Import review without auto-committing project assets"` passed: 1 passed, 34 skipped.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

### Acceptance Criteria

- OPFS archive cache writes happen only after explicit user action: local ZIP upload, successful browser source materialization, or selected extraction.
- The first shipped user-visible loop works for `Upload ZIP`: choose ZIP, inspect entries, write archive bytes plus manifest metadata to OPFS, close/reopen source options, and reuse the cached archive for the same PubParts source version.
- Cache identity uses the existing PubParts staged source identity, source URL, and freshness metadata; changed freshness/source URLs miss instead of reusing stale bytes.
- The source-options dialog truthfully names Internal Library cache hits and cache unavailability.
- Browser-blocked Dropbox sources still require the existing download/upload path unless a successful browser materialization has already produced bytes.
- Existing localStorage archive manifest cache remains as a metadata fallback and is not deleted, migrated, or treated as byte storage.
- Selected entries still reach Import review only through the existing selected-entry staging flow.
- Catalog cache writes do not create project assets, imported references, object URL ownership, or viewer runtime objects.
- Local Library folder mirror, Home Page storage UI changes, uploaded ZIP entry 3D preview toggles, direct Dropbox helper/API work, STEP loader support, and builder/compatibility behavior remain out of Phase 2.

## [x] `Catalog-Gen2-15 / Phase 3` - `Optional Local Library Folder Mirror`

### Phase 3 Summary

Add a browser-honest Local Library mirror boundary so a user can explicitly choose a visible folder and let ParaHook copy already app-managed PubParts source/cache/extracted candidate files into that folder when permission is available.

Status: complete.

Internal Library remains the default source/cache truth. The visible Local Library mirror is optional, best-effort, and never required for source-options reopen, Import review staging, accepted references, or viewer rehydration.

### Phase 3 Implementation Status

- Added `src/app/catalog/pubPartsLocalLibraryMirror.ts` as a pure owner seam for optional visible Local Library folder mirroring.
- Added handle-like directory/file/writable types so mirror behavior can be tested without browser disk access.
- Added `readPubPartsLocalLibraryMirrorCapability(env)` so support can be represented without opening a picker.
- Added `choosePubPartsLocalLibraryMirrorRoot(env)` so the browser directory picker is called only from an explicit choose action.
- Added deterministic mirror path planning under `PubParts/parts/<itemSlug>/...` from the existing Internal Library manifest shape.
- Added unsafe relative path rejection before mirror writes can create directories or files.
- Added manifest, archive, and extracted-candidate mirror write helpers that write only under the supplied selected-folder handle.
- Added nonthrowing write results so mirror failures are representable and nonblocking for later Catalog/Import flows.
- Added `toPubPartsLocalLibraryMirrorStorageConfig(...)` to map richer runtime mirror reads into the existing serializable `PubPartsLocalLibraryConfig` shape without storing directory handles.
- Left `pubPartsDownloadsStorage.ts` schema and current Local Library metadata behavior unchanged.
- Left `CatalogSurface`, Home Page storage transparency, source-options UI, Import review, project assets, object URLs, viewer runtime ownership, Dropbox/helper/API behavior, STEP loader behavior, builder behavior, and compatibility verdicts untouched.

### Current Live Read

`src/app/catalog/pubPartsDownloadsStorage.ts` already owns the Local Library metadata policy:
- `pubPartsLocalLibraryFolderPath` is `PubParts`.
- `setPubPartsLocalLibraryEnabled(true)` records `permission-needed` and a visible-folder label without claiming a browser folder handle.
- `setPubPartsLocalLibraryEnabled(false)` records `disabled`.
- `preparePubPartsLocalSourceRecord(item)` defines deterministic visible paths under `PubParts/parts/<itemSlug>/...` with `source`, `downloads`, `extracted`, `importable`, and source-version `versions/<sourceVersionKey>/files` subfolders.
- the current storage record deliberately avoids `FileSystemDirectoryHandle`, `Blob`, `File`, `objectUrl`, imported-reference, or project-asset ownership.

`src/app/catalog/pubPartsInternalLibrary.ts` owns the real app-managed byte cache:
- OPFS capability is injectable and representable as `available`, `unsupported`, `unavailable`, `quota-unavailable`, or `error`.
- archive cache reads are valid only when archive bytes and manifest metadata both exist and match the staged source identity/source URL/freshness.
- archive bytes and extracted supported candidates can be written under `Internal Library/PubParts/parts/<itemSlug>/...`.
- this owner should remain the canonical cache truth even when a visible Local Library mirror is configured.

`src/app/workspace/CatalogSurface.tsx` owns the current PubParts user-action seams:
- local ZIP upload gives Catalog a user-granted `archiveBlob`, lists entries, and writes archive bytes plus inspected manifest into the Internal Library when available.
- source-options reopen checks Internal Library cache before falling back to localStorage metadata or remote inspection.
- selected ZIP entries still stage into Import review through the existing selected-entry flow.
- OPFS cache failures are nonblocking for Import review handoff.

Home Page storage/status surfaces currently stay narrow:
- `src/app/workspace/homePageStorageTransparency.ts` lists `PubParts downloads` as a localStorage bucket using `pubPartsDownloadsStorageBucketDescriptor`.
- it exposes the expected `Catalog/PubParts/Downloads` and `PubParts` folder labels but does not read OPFS or File System Access handles.
- it separately reports browser origin storage estimates through `navigator.storage.estimate()`.
- `src/app/workspace/homePageStorageTransparency.test.ts` already proves the PubParts downloads bucket, owner seam, and local-library folder path appear in Home storage transparency.

Existing tests around PubParts downloads/local library currently prove metadata only:
- `src/app/catalog/pubPartsDownloadsStorage.test.ts` verifies local library status is tracked without claiming disk access.
- it verifies per-item folder and manifest metadata are predictable and do not persist object URLs, asset paths, or imported references.
- `src/app/workspace/CatalogSurface.test.tsx` already has deterministic fake OPFS handles for Internal Library cache flows, delayed cache reads, local ZIP upload, cache-hit reopen, stale freshness misses, and selected-entry Import review handoff.

### Smallest Code Cut

Recommended Phase 3 should be a pure Local Library mirror owner seam plus storage/status contract. It should not wire visible Catalog/Home UI unless the owner lands cleanly and the integration remains small enough for the same review.

Add:
- `src/app/catalog/pubPartsLocalLibraryMirror.ts`
- `src/app/catalog/pubPartsLocalLibraryMirror.test.ts`

Update only if needed for the owner contract:
- `src/app/catalog/pubPartsDownloadsStorage.ts`
- `src/app/catalog/pubPartsDownloadsStorage.test.ts`

Defer to `Catalog-Gen2-15 / Phase 3.1` unless Manager widens Phase 3:
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/workspace/homePageStorageTransparency.ts`
- `src/app/workspace/homePageStorageTransparency.test.ts`

The owner seam should expose handle-like types similar to the Internal Library fakeable OPFS types, but for the user-selected folder:

```ts
export type PubPartsLocalLibraryMirrorStatus =
  | 'unsupported'
  | 'not-configured'
  | 'permission-needed'
  | 'enabled'
  | 'disabled'
  | 'unavailable'
  | 'error'

export type PubPartsLocalLibraryMirrorEnv = {
  showDirectoryPicker?: () => Promise<PubPartsLocalLibraryDirectoryHandleLike>
}

export type PubPartsLocalLibraryMirrorPlan = {
  rootFolderPath: 'PubParts'
  catalogItemId: string
  sourceVersionKey: string
  manifestPath: string
  archivePath: string | null
  extractedPaths: string[]
  importablePaths: string[]
}
```

Likely public helpers:
- `readPubPartsLocalLibraryMirrorCapability(env)` returns unsupported/unavailable/error status without opening a picker.
- `choosePubPartsLocalLibraryMirrorRoot(env)` calls the browser directory picker only from an explicit user action.
- `resolvePubPartsLocalLibraryMirrorPlan(recordOrManifest)` derives deterministic visible paths from the existing `preparePubPartsLocalSourceRecord` convention.
- `writePubPartsLocalLibraryMirrorManifest(rootHandle, manifest)` writes `pubparts-source.json` under the selected root.
- `writePubPartsLocalLibraryMirrorArchive(rootHandle, archiveBlob, plan)` writes only the current source archive if the app already has bytes.
- `writePubPartsLocalLibraryMirrorExtractedCandidate(rootHandle, candidateBlob, plan)` writes only already-extracted supported candidates.
- `toPubPartsLocalLibraryMirrorStorageConfig(result)` produces serializable status/label metadata for `pubPartsDownloadsStorage`; it must not store raw directory handles in localStorage.

### User-Visible Behavior

Phase 3 owner behavior:
- A user-selected Local Library folder is optional.
- If the File System Access picker is unsupported, unavailable, denied, or errors, ParaHook can represent that state without changing current Add To Project behavior.
- If permission is available, mirror writes copy app-managed files into the selected visible folder under `PubParts/parts/<itemSlug>/...`.
- Mirror writes happen only after explicit user action has already produced app-owned bytes through local ZIP upload, successful browser materialization, or selected extraction.
- Mirror write failures are nonblocking and do not invalidate Internal Library cache hits.
- Reopening source options still uses Internal Library as the richer byte owner; the visible mirror is not a source of canonical cache truth in Phase 3.

Phase 3.1 UI behavior, if split:
- Catalog can show Local Library `not configured`, `permission needed`, `enabled`, `disabled`, `unavailable`, and `mirror failed` status.
- Home Page storage transparency can surface the visible Local Library folder path/status as policy metadata, not as a localStorage byte bucket and not as an OPFS replacement.
- Any connect/reconnect action must be user-actioned through the browser picker.

### Boundaries

- No arbitrary disk writes; writes must stay under the explicit user-selected directory handle and deterministic PubParts subpaths.
- No silent downloads, eager all-PubParts mirroring, Dropbox/CORS bypass, proxy/API helper, or remote-byte fetch expansion.
- No Local Library-as-canonical-truth behavior; Internal Library stays default app-managed source/cache truth.
- No Import review auto-open, project auto-commit, accepted imported-reference creation, viewer runtime possession, or source-options row selection side effects.
- No ZIP safety rule changes, STEP loader fidelity expansion, `.stp` support expansion, builder/load-as-starting-config behavior, or compatibility verdict work.
- No object URL ownership in the mirror owner.
- No stored `FileSystemDirectoryHandle` in localStorage unless a future browser-supported persistent handle strategy is explicitly approved; Phase 3 should store only serializable status, label, and path metadata.

### Focused Tests

Add `src/app/catalog/pubPartsLocalLibraryMirror.test.ts`:
1. `reports the Local Library mirror as unsupported when no directory picker exists`
2. `opens the Local Library folder picker only through an explicit choose call`
3. `builds deterministic PubParts mirror paths from a staged source manifest`
4. `rejects unsafe mirror path segments before writing to the selected folder`
5. `writes manifest and archive bytes only under the selected Local Library root`
6. `writes extracted supported candidates without changing Internal Library cache truth`
7. `returns a nonblocking error result when a mirror write fails`

Additional `src/app/catalog/pubPartsLocalLibraryMirror.test.ts` proof:
1. `maps mirror reads into serializable Local Library storage config without handles or blobs`

Phase 3 did not include Catalog integration. These tests remain for `Phase 3.1`:
1. `mirrors local ZIP upload bytes to the selected Local Library folder without blocking source-options`
2. `does not block selected-entry Import review staging when Local Library mirror write fails`
3. `does not fetch Dropbox bytes when Local Library mirror is enabled`

Phase 3 did not include Home status integration. This test remains for `Phase 3.1`:
1. `reports Local Library mirror status as policy metadata without counting it as localStorage bytes`

### Verification Commands

Run the new owner tests:

```bash
npm.cmd test -- src/app/catalog/pubPartsLocalLibraryMirror.test.ts
```

Run existing local-library metadata tests:

```bash
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts -t "Local Library|local source|mirror"
```

The filtered command currently does not match the existing test titles and skips the file; run the full file for Phase 3 verification:

```bash
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts
```

If Catalog integration is included:

```bash
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Local Library mirror|Internal Library|Import review"
```

If Home Page status integration is included:

```bash
npm.cmd test -- src/app/workspace/homePageStorageTransparency.test.ts -t "PubParts|Local Library|Storage"
```

Run the build:

```bash
npm.cmd run build
```

### Verification Result

- `npm.cmd test -- src/app/catalog/pubPartsLocalLibraryMirror.test.ts` passed: 8 passed.
- `npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts -t "Local Library|local source|mirror"` ran but skipped the file because the current test titles do not match that filter.
- `npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts` passed: 14 passed.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

### Acceptance Criteria

- [x] A pure, testable Local Library mirror owner seam exists with injected browser directory-picker/file-handle dependencies.
- [x] Phase 3 can represent unsupported, not-configured, permission-needed, enabled, disabled, unavailable, and error states without claiming disk access when none exists.
- [x] Mirror paths reuse the existing `PubParts/parts/<itemSlug>/...` visible-folder convention and reject traversal/absolute/unsafe path segments.
- [x] Mirror writes happen only under a user-selected folder handle and only from bytes ParaHook already owns through OPFS/Internal Library or current explicit user action.
- [x] Mirror failures are nonblocking for source-options cache writes, cache reads, selected-entry Import review staging, and current Catalog behavior.
- [x] Internal Library remains the canonical app-managed byte cache and source-options reopen owner.
- [x] Local Library status metadata remains serializable and does not persist raw handles, `Blob`s, `File`s, object URLs, imported references, or project assets.
- [x] No Catalog source-options behavior, Home Page UI, Import review, source-options preview, Dropbox helper/API, STEP loader, builder, or compatibility verdict behavior changed.

### Recommendation

Recommend Manager-close Phase 3 and proceed to `Catalog-Gen2-15 / Phase 3.1 - Local Library Mirror Status And Catalog Wiring` if the goal is to complete the user-visible portion of `Catalog-Gen2-HLG-19`.

Reason:
- Phase 3 proved the browser directory-picker owner, path safety, handle fakes, nonblocking writes, and serializable status mapping.
- The visible Local Library mirror is not reachable from Catalog or Home yet.
- `Catalog-Gen2-HLG-19` still needs a small UI/status wiring slice before the visible-folder mirror can be considered user-complete.

## [x] `Catalog-Gen2-15 / Phase 3.1` - `Local Library Mirror Status And Catalog Wiring`

### Phase 3.1 Summary

Wire the Phase 3 Local Library mirror owner into the existing Home Page and Catalog PubParts flow without changing canonical ownership.

Home Page should become the user-facing place to connect or disconnect the visible Local Library folder. Catalog should show mirror status and perform best-effort mirror writes only after ParaHook already has app-owned bytes from an explicit user action.

Status: complete.

### Implementation Status

- Added runtime/session Local Library root helpers to `src/app/catalog/pubPartsLocalLibraryMirror.ts`.
- Kept the selected directory handle out of `localStorage`; only serializable `PubPartsLocalLibraryConfig` status, root label, folder path, and timestamp metadata are persisted.
- Home Page PubParts Library now connects/reconnects through the browser directory picker with explicit `readwrite` intent when supported and can disable the mirror without writing bytes.
- Catalog now surfaces Local Library mirror status in the existing Local Downloads rail and PubParts item-page source rows.
- Catalog mirrors source manifests, uploaded/fetched archive bytes, and selected extracted candidate bytes best-effort when a runtime Local Library handle exists.
- Mirror writes now run from explicit app-owned blobs and are not gated by OPFS/Internal Library success. Local ZIP upload and selected extraction can mirror to the visible folder even when OPFS is unavailable.
- Mirror failures remain nonblocking for source-options, Internal Library cache attempts, selected-entry Import review staging, and project handoff.
- No IndexedDB persistent handle store, silent downloads, Dropbox helper/API expansion, Import/project auto-commit, viewer runtime ownership, STEP loader behavior, builder behavior, compatibility verdicts, or object URL storage was added.

### Current Live Read

`src/app/workspace/HomePageSurface.tsx` currently owns the Home Page storage controls:
- The `PubParts Library` control is currently a switch rendered through `renderStoragePolicySwitch`.
- Turning it on calls `setPubPartsLocalLibraryEnabled(true)`, which stores `permission-needed` metadata but does not call `showDirectoryPicker`.
- Turning it off calls `setPubPartsLocalLibraryEnabled(false)`, which stores `disabled`.
- The checked state is derived from `readPubPartsDownloadsStorage().library.status !== 'not-configured' && status !== 'disabled'`.
- `HomePageSurface.test.tsx` already has `toggles the PubParts Library status through the PubParts storage owner seam`, which should be revised into choose/connect/reconnect/disable behavior.

`src/app/workspace/homePageStorageTransparency.ts` currently stays policy-only:
- It lists `PubParts downloads` as a localStorage bucket with `folderPath: Catalog/PubParts/Downloads`.
- It also displays `localLibraryFolderPath: PubParts`.
- It does not read OPFS, File System Access handles, or mirror write state.
- This remains the right owner for Home Page storage inventory copy, but it should not count Local Library mirror bytes as localStorage bytes.

`src/app/catalog/pubPartsLocalLibraryMirror.ts` is ready as the pure owner seam:
- `readPubPartsLocalLibraryMirrorCapability(env)` can report unsupported/not-configured without opening a picker.
- `choosePubPartsLocalLibraryMirrorRoot(env)` opens `showDirectoryPicker` only when explicitly called.
- mirror writes require a supplied selected-folder handle.
- `toPubPartsLocalLibraryMirrorStorageConfig(...)` maps runtime status into serializable `PubPartsLocalLibraryConfig`.
- it does not yet provide a cross-surface runtime handle store.

`src/app/workspace/CatalogSurface.tsx` owns the live PubParts app-owned-byte moments:
- Local ZIP upload in `handleChooseLocalPubPartsArchive` already has `archiveBlob`, inspected entries, and a successful `writePubPartsInternalLibraryArchiveCache(...)` call when OPFS is available.
- Source-options open can load same-source-version archive bytes from `readPubPartsInternalLibraryArchiveCache(...)`.
- Browser remote materialization through `inspectPubPartsSharedLinkArchive(stagedRecord)` can produce `archiveBlob` when browser fetch succeeds, but blocked Dropbox still falls back to Download ZIP / Upload ZIP.
- Selected extraction in `handleStageSelectedPubPartsSourceOptions` already writes extracted candidates to the Internal Library through `writePubPartsInternalLibraryExtractedCandidate(...)` inside the optional extracted-entry callback.
- All mirror writes should be nonblocking and should only append truthful source-options status copy; Import review handoff must continue if extraction/materialization succeeds.

`src/app/catalog/ui/CatalogShellBrowseRail.tsx` already has the `Local Downloads / PubParts Library` rail section:
- It lists `pubPartsLocalSourceRecords`.
- It does not receive Local Library config or runtime mirror status.
- This is the smallest Catalog-wide place to show connected/reconnect/unavailable/mirror-error summary once `CatalogShell` receives a mirror status prop.

`src/app/catalog/ui/CatalogShellItemPage.tsx` already has PubParts rows that can carry item-level status:
- `Add To Project` opens source options for PubParts.
- `Local Fallback` contains `Prepare PubParts Folder`, `Stage Source Link`, and `Import Local Files`.
- `Local Folder` shows prepared visible path metadata.
- These rows should show Local Library mirror status and last mirror result, but should not add auto-import, auto-selection, project commit, or viewer behavior.

### Directory Handle Storage Decision

Use runtime/session state for the selected `FileSystemDirectoryHandle` in Phase 3.1. Do not add an IndexedDB persistent handle store yet.

Recommended shape:
- Add a tiny runtime seam, likely inside `src/app/catalog/pubPartsLocalLibraryMirror.ts` or a sibling `pubPartsLocalLibraryMirrorSession.ts`, with:
  - `setPubPartsLocalLibraryMirrorSessionRoot(handle, read)`
  - `getPubPartsLocalLibraryMirrorSessionRoot()`
  - `clearPubPartsLocalLibraryMirrorSessionRoot()`
  - `readPubPartsLocalLibraryMirrorSessionStatus(storageConfig, capability)`
- Store only `PubPartsLocalLibraryConfig` status/label/path metadata in localStorage.
- If localStorage says `enabled` but the runtime handle is missing after reload, show a truthful reconnect/permission-needed state.
- Defer IndexedDB persistent handle storage until a separate phase if Manager wants no-reconnect persistence.

Reason:
- persistent File System Access handles require IndexedDB lifecycle, permission revalidation, stale-handle cleanup, and additional security/state tests.
- Phase 3.1 can deliver the visible mirror loop in a browser-honest way without claiming persistence beyond the current session.
- This keeps raw handles out of localStorage and avoids widening the storage schema beyond serializable status metadata.

### Smallest Implementation Slice

Update `src/app/catalog/pubPartsLocalLibraryMirror.ts`:
- add runtime/session root-handle helpers or a sibling session module if that keeps the owner cleaner.
- add status-read helpers that combine current browser capability, localStorage config, and runtime handle presence.
- keep existing pure write helpers unchanged.

Update `src/app/catalog/pubPartsLocalLibraryMirror.test.ts`:
- prove session handle set/get/clear without localStorage persistence.
- prove `enabled` stored config plus missing runtime handle reads as reconnect/permission-needed.
- prove unsupported picker reads as unavailable/unsupported and does not open the picker.

Update `src/app/workspace/HomePageSurface.tsx`:
- replace the PubParts Library switch behavior with a real connect/reconnect/disable action driven by `choosePubPartsLocalLibraryMirrorRoot(...)`.
- keep copy truthful: unsupported, choose folder, connected for this session, reconnect needed, disabled, unavailable/error.
- after successful choose, store only serializable config through PubParts downloads storage and keep the handle in runtime/session state.
- do not write mirror bytes from Home Page.

Update `src/app/workspace/HomePageSurface.test.tsx`:
- replace/extend the current PubParts toggle test to prove:
  1. supported picker calls `showDirectoryPicker` only when the user clicks connect.
  2. successful choose stores serializable `enabled` metadata and no raw handle.
  3. denied choose stores/keeps `permission-needed` or unavailable status truthfully.
  4. unsupported browser shows unavailable/unsupported and does not call picker.
  5. disabling clears runtime handle and stores `disabled`.

Update `src/app/workspace/homePageStorageTransparency.ts` and `.test.ts` only if needed:
- add policy read fields for Local Library mirror status/root label.
- do not count mirror bytes or handles as localStorage bytes.
- keep origin storage estimate separate from Local Library folder status.

Update `src/app/workspace/CatalogSurface.tsx`:
- hold/read the current runtime mirror handle/status through the mirror session seam.
- after local ZIP upload, best-effort mirror manifest/archive bytes from the uploaded archive blob when a session handle is connected, regardless of whether OPFS/Internal Library writes succeed.
- after successful browser remote materialization/ZIP inspection, best-effort mirror manifest/archive bytes from the fetched archive blob when a session handle is connected, regardless of whether OPFS/Internal Library writes succeed.
- after selected extraction, best-effort mirror extracted/importable candidate bytes from extracted entry blobs when a session handle is connected, regardless of whether the optional OPFS extracted-candidate cache callback succeeds.
- on mirror write failure, keep source-options/Import flow working and add truthful status copy such as `Local Library mirror unavailable; Internal Library cache remains available.`
- do not mirror metadata-only localStorage cache rows when no archive bytes exist.

Update Catalog UI props only as needed:
- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`

Catalog visible status should be small:
- Rail `Local Downloads / PubParts Library`: show connected/reconnect/disabled/unsupported/unavailable and last mirror result summary.
- Item page Local Fallback or Add To Project area: show whether Local Library mirror is connected and whether the current item has a prepared local folder path.

Do not add new broad components unless the prop flow becomes too noisy; if that happens, extract a small presentational status read helper before adding UI complexity.

### Focused Tests

Add/update `src/app/workspace/HomePageSurface.test.tsx`:
1. `connects the PubParts Local Library folder through the browser picker`
2. `shows PubParts Local Library unsupported when the directory picker is unavailable`
3. `keeps PubParts Local Library reconnect-needed after reload when only serializable metadata remains`
4. `disables PubParts Local Library without storing directory handles`

Add/update `src/app/workspace/CatalogSurface.test.tsx`:
1. `mirrors local ZIP upload bytes to the selected Local Library folder without blocking source-options`
2. `does not block selected-entry Import review staging when Local Library mirror write fails`
3. `does not fetch Dropbox bytes when Local Library mirror is enabled`
4. `mirrors extracted selected ZIP entries after Internal Library extraction succeeds`
5. `does not mirror metadata-only source-options cache rows without archive bytes`
6. `mirrors local ZIP upload and selected extraction when OPFS Internal Library is unavailable`

Add/update `src/app/catalog/pubPartsLocalLibraryMirror.test.ts`:
1. `stores the selected Local Library root in runtime state only`
2. `reads reconnect-needed when stored config is enabled but no runtime handle exists`
3. `clears the runtime Local Library root without mutating serialized metadata`

Add/update `src/app/workspace/homePageStorageTransparency.test.ts` only if storage transparency gains mirror status fields:
1. `reports PubParts Local Library mirror status without counting mirror bytes as localStorage`

### Verification Commands

Run owner/session tests:

```bash
npm.cmd test -- src/app/catalog/pubPartsLocalLibraryMirror.test.ts
```

Run Home Page tests:

```bash
npm.cmd test -- src/app/workspace/HomePageSurface.test.tsx -t "PubParts Local Library|PubParts Library"
```

Run Catalog focused mirror tests:

```bash
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Local Library mirror|Local Library folder|metadata-only source-options"
```

Run storage transparency tests if touched:

```bash
npm.cmd test -- src/app/workspace/homePageStorageTransparency.test.ts -t "PubParts|Local Library|Storage"
```

Run existing downloads storage tests because serialized metadata remains the storage owner:

```bash
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts
```

Run build:

```bash
npm.cmd run build
```

### Verification Result

- `npm.cmd test -- src/app/catalog/pubPartsLocalLibraryMirror.test.ts src/app/catalog/pubPartsDownloadsStorage.test.ts` passed: 25 passed.
- `npm.cmd test -- src/app/workspace/HomePageSurface.test.tsx` passed: 11 passed.
- `npm.cmd test -- src/app/workspace/homePageStorageTransparency.test.ts` passed: 2 passed.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed: 3 passed.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Local Library mirror|mirrors local ZIP upload"` passed: 4 passed, 46 skipped.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` `path`/`crypto` externalization warnings and existing large chunk warning.

### Acceptance Criteria

- Home Page can connect the PubParts Local Library through a user-clicked browser directory picker where supported.
- Unsupported, denied/permission-needed, reconnect-needed, disabled, unavailable/error, and connected-for-session states are truthful.
- No directory handle, `Blob`, `File`, object URL, imported reference, or project asset is stored in localStorage.
- A stored `enabled` config without a runtime handle after reload reads as reconnect-needed rather than pretending writes can happen.
- Catalog shows Local Library mirror status in the existing Local Downloads/item-page source surfaces without changing Add To Project ownership.
- Local ZIP upload and successful browser materialization can mirror manifest/archive bytes only when a runtime handle is connected and app-owned bytes exist.
- Local ZIP upload and successful browser materialization mirror from app-owned archive bytes without requiring OPFS/Internal Library cache success.
- Selected extraction can mirror extracted/importable candidate bytes from extracted entry blobs without requiring OPFS/Internal Library extracted-candidate cache success.
- Mirror write failures do not block source-options, OPFS/Internal Library cache, selected-entry Import review staging, or project handoff.
- Metadata-only localStorage cache rows and blocked Dropbox sources do not trigger mirror writes or remote fetches.
- Internal Library remains canonical source/cache truth; Local Library remains a visible best-effort mirror.
- No silent downloads, Dropbox/CORS/helper/API expansion, object URL storage, viewer runtime ownership, STEP loader behavior, builder behavior, compatibility verdicts, or Import/project auto-commit are introduced.

### Recommendation

Recommend approval with the runtime/session handle approach and no IndexedDB persistent handle store in Phase 3.1.

Do not split further unless Manager wants persistent folder handles across browser reloads. If that is required, create `Catalog-Gen2-15 / Phase 3.2 - Persistent Local Library Handle Store` because IndexedDB handle persistence and permission revalidation deserve their own owner/tests.

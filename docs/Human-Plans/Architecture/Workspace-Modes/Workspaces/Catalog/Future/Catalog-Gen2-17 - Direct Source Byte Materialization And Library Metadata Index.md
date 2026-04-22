# Catalog-Gen2-17 - Direct Source Byte Materialization And Library Metadata Index

## Doc Header

### Doc History
12. 2026-04-21 17:45:20: Closed `Catalog-Gen2-17 / Phase 5 - Final Audit And Follow-Ups` as a docs/test audit after focused materialization, trusted-provider, source-library metadata index, Catalog source-options, and production build verification passed; confirmed `Catalog-Gen2-HLG-22` can close because Phases 1-4 together provide truthful direct source-byte materialization status, Add To Project-triggered browser ZIP attempt, trusted-provider boundary, OPFS/Internal Library large-byte ownership, Upload ZIP fallback, metadata-only index decisions, and unchanged Import review project-acceptance ownership while routing persistent IndexedDB/SQLite storage, real provider/native/API deployment, richer metadata UI, live end-to-end provider proof, Import/project, STEP, builder, compatibility, eager scan, and bulk archive import work to future owner phases instead of a Gen2-17 Phase 5.1.
11. 2026-04-21 17:43:06: Prepped `Catalog-Gen2-17 / Phase 5 - Final Audit And Follow-Ups` with an implementation-ready docs/test audit spec that names the exact source, storage, source-options, preview, Import handoff, metadata-index, Catalog Vision, Catalog Gen2 index, and tracking-doc surfaces to review; defines focused verification and build commands; sets HLG/CLG closure criteria for `Catalog-Gen2-HLG-22` and `Catalog-Gen2-CLG-40` through `Catalog-Gen2-CLG-42`; and routes any missing persistence, real provider/native/API, richer metadata-index UI, live end-to-end proof, Import/project, STEP, builder, compatibility, eager scan, or bulk archive work to explicit follow-ups instead of widening Phase 5.
10. 2026-04-21 17:39:49: Implemented `Catalog-Gen2-17 / Phase 4 - Source-Library Metadata Index` with a pure metadata-only PubParts source-library index/query owner that maps staged source records, Phase 1 materialization decisions, provider capability state, metadata-only archive manifests, Internal Library manifest/path metadata, Local Library mirror reads, and ZIP entry metadata into cached, inspected, previewable, importable, mirrored, stale, blocked, provider-state, and source-version records while preserving OPFS/Internal Library and visible mirrors as large-byte owners and deferring SQLite/IndexedDB persistence, blob storage, CatalogSurface UI wiring, Import/project, STEP, builder, compatibility, provider infrastructure, and source-options redesign work.
9. 2026-04-21 17:33:36: Prepped `Catalog-Gen2-17 / Phase 4 - Source-Library Metadata Index` with an implementation-ready pure metadata index/query contract spec that maps existing PubParts staged source records, materialization decisions, archive manifest metadata, Internal Library cache metadata, Local Library mirror reads, and provider states into queryable source/library records while preserving OPFS/Internal Library and visible mirrors as large-byte owners and deferring SQLite/IndexedDB persistence, blob storage, migration, Import/project, STEP, builder, compatibility, provider infrastructure, and source-options redesign work.
8. 2026-04-21 17:29:11: Implemented `Catalog-Gen2-17 / Phase 3 - Trusted Provider Boundary` with a pure/tiny trusted source-byte provider boundary owner, default unavailable adapter, fake/injected provider test seam, provider-result-to-Phase-1 materialization decision mapping, same-path trusted-provider archive assertion, and minimal Catalog source-options integration proving fake provider ZIP bytes reuse the existing Internal Library and archive list/preview/select/stage path while blocked provider states preserve browser fetch and Upload ZIP fallback.
7. 2026-04-21 17:22:15: Prepped `Catalog-Gen2-17 / Phase 3 - Trusted Provider Boundary` with an implementation-ready spec for a contract/tiny adapter seam that can represent configured, unavailable, blocked, failed, and provider-materialized source-byte states, use fake/injected providers in tests, route successful trusted-provider bytes through the Phase 1 materialization contract into the existing Internal Library and source-options archive path, and preserve browser fetch plus Upload ZIP fallback without implementing real provider/proxy/native/API, secrets, scraping, CORS bypass, OAuth, service worker, SQLite/IndexedDB, Import/project, STEP, builder, or compatibility behavior.
6. 2026-04-21 17:18:35: Implemented `Catalog-Gen2-17 / Phase 2 - Browser Fetch Attempt And Fallback Status` by wiring the existing Add To Project-triggered PubParts ZIP browser inspection through the Phase 1 materialization contract, asserting same-path archive handling for readable browser bytes and Internal Library cache hits, preserving metadata-only manifest non-materialization and Upload ZIP fallback, and verifying focused materialization/source-options tests plus `npm.cmd run build` with only existing Vite occt/chunk warnings.
5. 2026-04-21 17:13:30: Prepped `Catalog-Gen2-17 / Phase 2 - Browser Fetch Attempt And Fallback Status` with a source-options implementation spec for one explicit user-actioned PubParts ZIP browser fetch attempt, routing readable bytes through the Phase 1 materialization contract into the existing OPFS/Internal Library archive cache and ZIP list/preview/select/stage path while keeping blocked fetch fallback, provider/proxy/native/API materialization, eager download, SQLite/IndexedDB, Import/project, STEP fidelity, builder, and compatibility work out of Phase 2.
4. 2026-04-21 17:08:46: Implemented `Catalog-Gen2-17 / Phase 1 - Direct Source Byte Materialization Contract` with a pure PubParts source materialization contract/helper owner and focused tests for source identity, freshness, browser/provider fallback reads, uploaded/cache/provider materialized byte origins, same-path archive handling, and no runtime fetch/storage/UI/import fields; verified focused materialization tests, nearest PubParts source/downloads owner tests, and `npm.cmd run build` while preserving the no-fetch, no-provider, no-OPFS-write, no-ZIP-UI, no-Import/project, and no-SQLite/IndexedDB boundaries.
3. 2026-04-21 17:03:26: Prepped `Catalog-Gen2-17 / Phase 1 - Direct Source Byte Materialization Contract` with a pure contract-only implementation spec grounded in the current PubParts source, shared-link resolver, Internal Library, archive manifest cache, ZIP archive, and Catalog source-options seams; scoped the first implementation to materialization status/provenance/fallback/same-path helpers and contract tests while keeping actual network fetch, trusted provider implementation, OPFS writes, ZIP listing UI changes, SQLite/BLOB storage, and Import/project ownership out of Phase 1.
2. 2026-04-21 17:01:34: Added Manager guide-rails for `Catalog-Gen2-17 / Phase 1`, clarifying that stream-to-buffer is a byte-handling strategy after legal browser or provider access rather than a Dropbox/CORS bypass, and routing the first Worker prep toward pure materialization statuses, provenance, freshness, fallback decisions, same-path archive handling, metadata-first SQLite/IndexedDB indexing, and future size/quota guardrails without implementing fetch, provider, OPFS write, ZIP listing, or Import ownership behavior yet.
1. 2026-04-21 16:14:22: Created `Catalog-Gen2-17 - Direct Source Byte Materialization And Library Metadata Index` after the PubParts/Dropbox buffer-streaming discussion to plan direct in-memory source-byte attempts, trusted provider/proxy/native byte boundaries, OPFS-first binary storage, SQLite/IndexedDB metadata indexing, and an upload fallback when browser access is blocked.

### Purpose

This doc prepares the next Catalog Gen2 lane for making PubParts `Add To Project` feel smoother without lying about browser restrictions.

The goal is to try direct source-byte materialization first when a PubParts/Dropbox source can legally provide bytes to ParaHook after explicit user action. If bytes arrive, ParaHook should cache the archive in OPFS/Internal Library and reuse the existing source-options ZIP inspection, preview, selected-entry staging, and Import review handoff. If browser fetch, CORS, Dropbox access, or provider availability blocks the path, the user still gets the existing `Open Source` plus `Upload ZIP` fallback.

### Scope

This doc covers:
- direct source-byte materialization status and contract
- browser-readable ZIP fetch attempt for one user-selected PubParts source
- blocked/fallback states that preserve Upload ZIP
- trusted PubParts proxy, helper, native bridge, or API byte-provider boundary
- OPFS/Internal Library as the large binary owner
- SQLite/IndexedDB-style metadata indexing for source/library state
- reuse of existing ZIP entry preview and Import review staging

This doc does not cover:
- eager downloading every PubParts archive
- bypassing CORS or Dropbox API rules
- putting Dropbox secrets or API tokens in browser code
- scraping blocked Dropbox pages
- forcing browser downloads into a chosen folder
- replacing Upload ZIP
- storing large ZIP/model binaries in `localStorage`
- making SQLite the hidden primary owner for model/archive blobs without a later measured storage decision
- Import accept/project ownership changes
- STEP loader fidelity
- builder load-as-starting-configuration behavior
- compatibility verdicts

## Doc Body

### Recommendation

Add the smooth path as an attempt, not as the only path.

`Catalog-Gen2-13`, `Catalog-Gen2-15`, and `Catalog-Gen2-16` already made the honest staged importer path work from user-granted archive bytes. This phase should sit in front of that path:

```text
Add To Project
-> Source Options opens
-> ParaHook tries to materialize the PubParts ZIP bytes directly
-> if readable: cache archive in Internal Library and inspect it
-> if blocked: explain the block and keep Open Source + Upload ZIP
-> if trusted provider is available: request bytes through that provider boundary
-> user previews/selects supported entries
-> selected supported entries stage into Import review
```

This makes the feature feel closer to one-click when the source allows it, while preserving the current fallback when the browser cannot read the ZIP.

### Storage Read

Do not put large archive/model bytes in `localStorage`.

Default binary owner:
- OPFS/Internal Library stores ZIP archives, extracted candidates, previewable temporary files when persisted, and importable materialized files.

Optional visible owner:
- Local Library mirror writes app-owned source/extracted/importable files into a user-selected folder when permission exists.

Metadata owner:
- SQLite/IndexedDB-style storage may index item id, provider, source URL, source version, freshness key, content hash when available, archive manifest, candidate ids, preview/importable support, Internal Library path/id, Local Library mirror state, and provider materialization status.

SQLite can be considered later, especially if the app already ships or adopts a browser SQLite/OPFS layer. The first planning read should treat SQLite as an index, not as a bulk binary blob vault, unless a later storage phase measures and approves that tradeoff.

### Provider Boundary Read

A trusted source-byte provider may be:
- a PubParts-owned proxy endpoint that returns the ZIP bytes or a short-lived readable URL
- a local/native helper that downloads source bytes outside the browser sandbox and returns an app-owned blob/path
- a server/API bridge with appropriate Dropbox credentials kept outside browser code
- a future desktop packaged app bridge

The provider boundary must return explicit statuses. Example statuses:
- `available`
- `unavailable`
- `requires-configuration`
- `blocked-by-provider`
- `blocked-by-source`
- `materialized`
- `failed`

Browser code must not contain Dropbox tokens, refresh tokens, app secrets, or private provider credentials.

### User-Facing Read

The user should not need to understand CORS to use the flow.

The source-options window should explain the next honest step:
- direct source fetch available and running
- archive saved to Internal Library
- source blocked by browser, use Upload ZIP
- trusted provider unavailable, use Upload ZIP
- provider configured, fetching source
- source cached, preview/select entries

The fallback should remain a first-class path, not an error dead end.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-22. make PubParts Add To Project try direct in-memory source-byte materialization when a source URL, trusted PubParts proxy, helper, or native bridge can legally provide ZIP bytes, then store successful archives in the Internal Library and fall back to Upload ZIP when browser access is blocked`

### `Catalog-Gen2-17 Phase 1`

- [ ] `Catalog-Gen2-CLG-40. Add a direct source-byte materialization attempt that fetches readable PubParts/Dropbox ZIP bytes into memory after user action, writes successful archives to OPFS/Internal Library, and falls back to Upload ZIP when browser fetch, CORS, or provider access fails.`

### `Catalog-Gen2-17 Phase 2`

- [ ] `Catalog-Gen2-CLG-40. Add the browser fetch attempt and source-options fallback status so readable ZIPs flow into the existing Internal Library, ZIP listing, preview, and Import review staging path.`

### `Catalog-Gen2-17 Phase 3`

- [ ] `Catalog-Gen2-CLG-41. Add a trusted source-byte provider boundary for PubParts proxy, native, helper, or API materialization so ParaHook can receive ZIP bytes without exposing Dropbox secrets in browser code or scraping blocked Dropbox pages.`

### `Catalog-Gen2-17 Phase 4`

- [ ] `Catalog-Gen2-CLG-42. Add a source-library metadata index plan, preferring OPFS file blobs for large archives/models and a SQLite/IndexedDB-style metadata database for item, source, version, file-candidate, manifest, preview/importable, and local mirror status records rather than storing large binaries in localStorage.`

### `Catalog-Gen2-17 Phase 5`

- [ ] Audit the completed direct source-byte materialization and metadata-index lane against `Catalog-Gen2-HLG-22`, `Catalog-Gen2-CLG-40`, `Catalog-Gen2-CLG-41`, and `Catalog-Gen2-CLG-42`; add follow-up phases if direct bytes, provider boundaries, fallback states, OPFS storage, metadata indexing, or Import/project boundaries are still partial.

## [x] `Catalog-Gen2-17 / Phase 1` - `Direct Source Byte Materialization Contract`

### Phase 1 Summary

Define the pure source-byte materialization contract before wiring browser fetch or provider behavior.

### Phase 1 Owns

- source-byte attempt state shape
- status labels for readable, blocked, upload-required, provider-required, materialized, and failed states
- source identity and freshness fields needed to write a successful archive to Internal Library
- tests for status resolution and fallback decision reads

### Phase 1 Does Not Own

- actual network fetch
- provider/proxy implementation
- OPFS byte writes
- ZIP listing changes
- UI behavior changes beyond possible display-only contract tests

### Phase 1 Manager Guide-Rails For Worker Prep

Worker should prep this phase around a pure contract, not around a live direct-download behavior.

The friend-inspired `stream into a buffer` idea is valid only after a browser fetch, user file grant, Internal Library cache hit, or trusted provider is legally allowed to provide bytes. Phase 1 must not describe buffering as a workaround for CORS, Dropbox source restrictions, missing API permission, blocked shared pages, or unavailable providers.

The Phase 1 contract should define a byte-source and status matrix that can represent at least:
- browser-fetch-readable
- browser-fetch-blocked
- uploaded-local-zip
- internal-library-cache-hit
- provider-materialized
- provider-unavailable
- provider-blocked
- upload-required
- materialized
- failed

The contract should carry enough provenance and freshness data for later cache validity:
- Catalog item id
- provider/source kind
- source URL
- source version or freshness key
- `dropboxZipLastUpdated` or equivalent upstream timestamp when available
- content hash when available
- materialized-at timestamp when available
- byte origin, such as browser fetch, upload, Internal Library cache, or trusted provider

The first implementation should preserve the hard invariant that once bytes exist, browser fetch, upload, Internal Library cache hits, and trusted provider materialization all converge into the same existing archive/list/preview/select/stage path. Phase 1 should prevent parallel import systems from growing, even though it should not wire that path yet.

SQLite or IndexedDB should be treated as metadata/index storage in this phase. SQLite BLOB storage for large ZIP/model bytes remains a deferred measured decision, not the default Gen2-17 path. Large archive and model bytes should stay owned by OPFS/Internal Library or an explicit Local Library mirror unless a later storage phase measures and approves a different binary owner.

Worker may include future-facing guardrails for memory, size limits, abort/cancel, quota, stale cache, evicted cache, missing-byte, and mirror status, but Phase 1 should only implement enough pure contract shape to avoid boxing in those later decisions.

### Phase 1 Prep Assignment

Prep `Catalog-Gen2-17 / Phase 1 - Direct Source Byte Materialization Contract` inside this plan doc before implementation. The prepared section should add a real `Phase 1 Implementation Spec` with likely files, the exact first code cut, focused contract tests, `npm run build`, tracking-doc requirements, and a stop condition.

Do not implement during prep. Return to Manager for review after the spec is ready.

### Phase 1 Implementation Spec

Status: complete.

#### Implementation Status

- Added `src/app/catalog/pubPartsSourceMaterialization.ts` as a pure source-byte materialization contract/helper owner.
- Added `src/app/catalog/pubPartsSourceMaterialization.test.ts` with eight focused contract tests.
- Built materialization identity from existing `PubPartsStagedSourceRecord` fields instead of adding UI-owned identity.
- Added freshness reads for archive/source timestamps, `dropboxZipLastUpdated` equivalence, content hash, byte size, and materialized-at timestamp.
- Added browser-readable, browser-blocked, uploaded-local-ZIP, Internal Library cache-hit, provider-materialized, provider-unavailable, provider-blocked, upload-required, materialized, and failed decision reads.
- Preserved the same-path invariant with the explicit `archive-list-preview-select-stage` archive-byte input marker for legal successful byte origins.
- Kept blocked browser/provider states fallback-only through Open Source / Upload ZIP reads.
- Did not call `fetch`, implement a provider, write OPFS/Internal Library bytes, list/extract ZIP entries, change source-options UI, create object URLs or `File`s, alter Import/project/store/viewer/builder/compatibility behavior, or adopt SQLite/IndexedDB/BLOB storage.

#### Current Live Read

`src/app/catalog/pubPartsSource.ts` already normalizes PubParts record identity into `PubPartsNormalizedSourceItem`, including `providerId`, `sourceRecordKind`, `sourceUrl`, `externalItemUrl`, `linkedArchiveUrl`, `sourceLastUpdated`, `archiveLastUpdated`, and source metadata. This is the right upstream identity source for a direct materialization candidate; do not invent a second PubParts source identity shape in UI code.

`src/app/catalog/pubPartsDownloadsStorage.ts` already owns `PubPartsStagedSourceRecord` metadata for source-options handoff. Phase 1 should be able to read the staged record fields as the existing Catalog item/source identity carrier, but it should not change downloads storage or persist a new materialization state yet.

`src/app/catalog/pubPartsSharedLinkResolver.ts` currently owns shared-link candidate classification, Dropbox `dl=1` direct-download URL normalization, remote ZIP inspection through `inspectPubPartsSharedLinkArchive`, direct-file fetch staging through `fetchPubPartsSharedLinkCandidateFile`, and selected archive-entry extraction through `materializePubPartsSharedLinkArchiveCandidateFiles`. Phase 1 must not add a new fetch call here yet. It may define a contract that later Phase 2 can use before calling this resolver or replacing its private fetch helper with a shared byte materialization result.

`src/app/catalog/pubPartsInternalLibrary.ts` already owns OPFS/Internal Library capability, source-version pathing, archive cache read/write helpers, manifest shape, and same-source-version archive cache validation. Phase 1 should mirror its identity/freshness language but must not write archive bytes or add new OPFS calls.

`src/app/catalog/pubPartsArchiveManifestCache.ts` already owns metadata-only manifest cache identity keyed by provider, Catalog item id, source URL, linked archive URL, and freshness fields. Phase 1 should use that as the metadata-index precedent and explicitly avoid SQLite or IndexedDB implementation.

`src/app/catalog/pubPartsZipArchive.ts` owns ZIP entry listing/extraction safety and should remain the one archive-entry classifier. Phase 1 should only assert that all successful byte origins converge to the same archive/list/preview/select/stage path later; it should not change ZIP listing, preview, or extraction behavior.

`src/app/workspace/CatalogSurface.tsx` owns the live source-options orchestration. It currently has one dialog state with `archiveBlob`, `archiveBlobSourceUrl`, and `archiveBlobStagedSourceId`, plus a same-source-version cache read from Internal Library. This is the later wiring seam for direct materialization, but Phase 1 should not change dialog state, labels, buttons, upload fallback behavior, or Import review handoff.

#### Contract Shape

Add a pure source-byte materialization contract that can represent:
- `browser-fetch-readable`
- `browser-fetch-blocked`
- `uploaded-local-zip`
- `internal-library-cache-hit`
- `provider-materialized`
- `provider-unavailable`
- `provider-blocked`
- `upload-required`
- `materialized`
- `failed`

The contract should separate:
- source identity: Catalog item id, item label, provider id/name, source kind, source URL, linked archive URL, source page URL, source record kind when available
- freshness identity: source version/freshness key, `archiveLastUpdated` / `dropboxZipLastUpdated`, `sourceLastUpdated`, optional content hash, optional byte size
- byte origin: browser fetch, uploaded local ZIP, Internal Library cache, or trusted provider
- decision state: whether the next step is materialize, use cache, request provider, ask for Upload ZIP, or surface a failure
- same-path read: a successful byte result is an archive-byte input for the existing archive/list/preview/select/stage path, not a parallel import system

The first contract should allow future size, quota, abort/cancel, stale cache, evicted cache, missing-byte, and mirror-status states to be added without requiring a UI rewrite. It should not enforce actual limits yet unless those limits already exist in the current ZIP archive helper.

#### Likely Files

Implement the first cut in:
- `src/app/catalog/pubPartsSourceMaterialization.ts`
- `src/app/catalog/pubPartsSourceMaterialization.test.ts`

Likely read-only references while implementing:
- `src/app/catalog/pubPartsSource.ts`
- `src/app/catalog/pubPartsDownloadsStorage.ts`
- `src/app/catalog/pubPartsSharedLinkResolver.ts`
- `src/app/catalog/pubPartsInternalLibrary.ts`
- `src/app/catalog/pubPartsArchiveManifestCache.ts`
- `src/app/catalog/pubPartsZipArchive.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`

Avoid touching these in Phase 1 unless Manager explicitly widens the slice:
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`
- `src/app/catalog/ui/CatalogShell.tsx`
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/workspace/HomePageSurface.tsx`
- Import, project store, Viewer, builder, compatibility, and SQLite/IndexedDB files

#### Exact First Code Cut

Create `src/app/catalog/pubPartsSourceMaterialization.ts` as a pure helper module with no browser fetch, no OPFS write, no UI state, and no Import handoff.

Recommended public surface:

```ts
export type PubPartsSourceByteOrigin =
  | 'browser-fetch'
  | 'uploaded-local-zip'
  | 'internal-library-cache'
  | 'trusted-provider'

export type PubPartsSourceMaterializationStatus =
  | 'browser-fetch-readable'
  | 'browser-fetch-blocked'
  | 'uploaded-local-zip'
  | 'internal-library-cache-hit'
  | 'provider-materialized'
  | 'provider-unavailable'
  | 'provider-blocked'
  | 'upload-required'
  | 'materialized'
  | 'failed'

export type PubPartsSourceMaterializationFallback =
  | 'none'
  | 'upload-zip'
  | 'open-source-and-upload-zip'
  | 'configure-provider'

export type PubPartsSourceMaterializationSamePath =
  | 'archive-list-preview-select-stage'

export type PubPartsSourceMaterializationIdentity = {
  providerId: 'pubparts' | string
  providerName: string
  catalogItemId: string
  catalogItemLabel: string
  sourceKind: 'linked-archive' | 'direct-file' | 'uploaded-archive' | 'cached-archive'
  sourceRecordKind?: 'part' | 'resource'
  sourceCandidateUrl: string
  linkedArchiveUrl: string
  sourcePageUrl?: string
  sourceUrl?: string
}

export type PubPartsSourceMaterializationFreshness = {
  sourceVersionKey: string
  sourceVersionKind: 'archiveLastUpdated' | 'sourceLastUpdated' | 'contentHash' | 'unversioned'
  archiveLastUpdated?: string
  dropboxZipLastUpdated?: string
  sourceLastUpdated?: string
  contentHash?: string
  byteSize?: number
  materializedAt?: string
}
```

Then add discriminated result/decision types that can express:
- pending/attemptable browser fetch without executing it
- blocked browser fetch resolving to Upload ZIP fallback
- provider unavailable or provider blocked resolving to Upload ZIP fallback unless a future provider configuration action exists
- uploaded local ZIP and Internal Library cache hit as already materialized byte origins
- provider materialized as a trusted-provider byte origin
- failed as a recoverable state with Upload ZIP fallback unless the failure is explicitly nonrecoverable

Add pure helpers such as:
- `buildPubPartsSourceMaterializationIdentity(stagedRecord)`
- `buildPubPartsSourceMaterializationFreshness(stagedRecord, options?)`
- `resolvePubPartsSourceMaterializationDecision(input)`
- `isPubPartsSourceMaterialized(result)`
- `resolvePubPartsSourceMaterializationFallback(result)`
- `assertPubPartsSourceMaterializationSamePath(result)`

Keep the helper names local-style and boring. If implementation discovers an existing naming pattern that fits better, use that pattern while preserving the contract boundaries above.

#### No-Widening Rule

Phase 1 must not:
- call `fetch`, change `fetchPubPartsSharedLinkArchiveBlob`, or add a new browser network attempt
- add a PubParts proxy/helper/native/API provider implementation
- add provider configuration UI or secrets
- write OPFS/Internal Library bytes or Local Library mirror files
- change `CatalogSurface` source-options behavior, buttons, labels, status copy, dialog state, or cache read/write flow
- change ZIP entry listing, extraction, preview, selection, or staging behavior
- change Import review, project asset acceptance, reference ownership, Viewer behavior, builder behavior, or compatibility verdicts
- adopt SQLite, IndexedDB, or BLOB storage
- store ZIP/model binaries in `localStorage`
- treat buffering as a workaround for CORS, Dropbox rules, missing API permission, or blocked shared pages

The only acceptable Phase 1 implementation output is contract/types/helpers plus focused contract tests and tracking docs.

#### Implementation Risks

- Status names may drift from existing UI copy. Keep statuses machine-stable and let later UI phases map them to copy.
- Source identity could duplicate `PubPartsStagedSourceRecord`. Build from staged records and current PubParts source fields instead of inventing a second owner.
- `materialized` could accidentally imply OPFS persistence. In Phase 1, it means bytes are available from a legal origin and must enter the existing archive path later; it does not mean cached or written.
- Browser-readable and provider-readable states can be mistaken for a Dropbox bypass. Tests should prove blocked browser/provider reads choose Upload ZIP fallback.
- Internal Library cache hit can become stale if freshness fields are weak. Carry `archiveLastUpdated`, `sourceLastUpdated`, source version kind/key, and optional content hash without claiming validation logic beyond pure identity comparison.
- Same-path invariants may be too abstract. Encode a literal same-path marker/result so future phases cannot create a second import path without changing tests.
- Test names could overpromise behavior. Keep them contract-worded and avoid verbs like `fetches`, `writes`, `stages`, or `imports`.

#### Checklist

- [x] Add the pure `pubPartsSourceMaterialization.ts` owner seam.
- [x] Define materialization statuses for browser-readable, browser-blocked, upload-local, Internal Library cache hit, provider-materialized, provider-unavailable, provider-blocked, upload-required, materialized, and failed.
- [x] Define source identity and freshness fields that include Catalog item id, provider/source kind, source URLs, source version/freshness key, `dropboxZipLastUpdated` / `archiveLastUpdated`, optional content hash, optional byte size, materialized-at timestamp, and byte origin.
- [x] Define fallback decision reads that route browser/provider blocked and unavailable states to Upload ZIP/open-source fallback instead of dead ends.
- [x] Define a same-path invariant that successful bytes from browser fetch, upload, Internal Library cache, and trusted provider become archive-byte inputs for the existing archive/list/preview/select/stage path.
- [x] Add focused contract tests in `pubPartsSourceMaterialization.test.ts`.
- [x] Avoid all runtime/source-options/fetch/provider/OPFS/ZIP UI/Import/project behavior changes.
- [x] Update `docs/CHANGELOG.md` during implementation because Phase 1 will add source/test files even though it is contract-only.
- [x] Update this plan doc and `docs/Doc-Log.md` if implementation marks the phase complete or changes docs.

#### Focused Contract Tests

Add tests for:
1. `represents a PubParts ZIP source as a direct materialization candidate with source freshness identity`
2. `routes browser-fetch-blocked to the Upload ZIP fallback without marking bytes materialized`
3. `routes provider-unavailable and provider-blocked to fallback states without implying a provider exists`
4. `treats uploaded-local-zip as a materialized byte origin for the shared archive path`
5. `treats internal-library-cache-hit as a materialized byte origin only when source identity and freshness match`
6. `treats provider-materialized as a trusted-provider byte origin for the shared archive path`
7. `keeps failed materialization recoverable through Upload ZIP fallback`
8. `does not expose any network fetch, OPFS write, ZIP listing, object URL, File, Import review, or project ownership fields in the contract result`

Recommended command:

```bash
npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts
```

If the helper imports staged-record builders from downloads storage or source normalization helpers, also run the nearest owner tests touched by imports:

```bash
npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts src/app/catalog/pubPartsSource.test.ts
```

#### Build Verification

Run the Dispatch 4 implementation build gate:

```bash
npm.cmd run build
```

#### Verification Result

- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts` passed: 8 passed.
- `npm.cmd test -- src/app/catalog/pubPartsDownloadsStorage.test.ts src/app/catalog/pubPartsSource.test.ts` passed: 24 passed.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

#### Tracking Docs

During implementation:
- update `docs/CHANGELOG.md` because adding the contract module/tests is source/test implementation work
- update this plan doc if Phase 1 is completed, including the verification result and acceptance checkboxes
- update `docs/Doc-Log.md` for the plan-doc update

During this prep pass:
- update only this active plan doc and `docs/Doc-Log.md`
- do not update `docs/CHANGELOG.md`

#### Stop Condition

Stop after the pure contract module and focused contract tests pass and `npm.cmd run build` passes.

Return to Manager instead of continuing if implementation pressure appears to require any browser fetch wiring, provider implementation, OPFS write, ZIP listing/source-options UI change, SQLite/IndexedDB storage decision, or Import/project ownership change. Those belong to later phases and should be explicitly approved before work continues.

### Phase 1 Acceptance

- [x] A PubParts ZIP source can be represented as a direct materialization candidate.
- [x] Blocked browser access resolves to an Upload ZIP fallback, not a dead end.
- [x] Provider-required states do not imply a provider already exists.
- [x] The contract carries enough source identity for later OPFS cache writes and invalidation.

## [x] `Catalog-Gen2-17 / Phase 2` - `Browser Fetch Attempt And Fallback Status`

### Phase 2 Summary

Wire one explicit user-action direct fetch attempt for the current PubParts ZIP source.

### Phase 2 Owns

- source-options direct fetch attempt for one selected PubParts item/source
- successful archive blob write to OPFS/Internal Library through existing owners
- reuse of existing ZIP entry listing, preview, selected-entry staging, and Import review handoff
- visible blocked/fallback status when fetch fails due to browser/source access
- focused tests for readable, blocked, and fallback paths

### Phase 2 Does Not Own

- eager archive download
- provider/proxy behavior
- Local Library mirror policy changes beyond existing app-owned-byte mirror behavior
- Import accept/project asset changes

### Phase 2 Implementation Spec

Status: complete.

#### Implementation Status

- Imported and used the Phase 1 materialization contract helpers in `src/app/workspace/CatalogSurface.tsx` without adding a second fetch owner.
- Kept `Add To Project` as the explicit user action that opens source options and permits the one browser ZIP inspection attempt.
- Represented the in-progress attempt as `browser-fetch-readable` and mapped it to source-options status copy that stays honest about browser/source blocking.
- Represented successful readable ZIP bytes as `materialized` with `byteOrigin: 'browser-fetch'`, then asserted the same-path archive invariant before continuing through the existing archive list/preview/select/stage path.
- Represented same-source Internal Library archive cache hits as `internal-library-cache-hit`, asserted the same-path invariant, and preserved no-fetch reuse.
- Preserved metadata-only manifest cache rows as non-materialized bytes.
- Mapped blocked/failed browser fetch attempts through the Phase 1 fallback decision while keeping the source/download link and `Upload ZIP` available.
- Tightened `src/app/workspace/CatalogSurface.test.tsx` around browser attempt status, browser-byte materialized status, Internal Library cache write/read proof, cache-hit no-fetch reuse, and blocked fallback status.
- Did not implement provider/proxy/native/API materialization, eager downloads, SQLite/IndexedDB/BLOB storage, Import/project acceptance changes, STEP fidelity, builder behavior, or compatibility behavior.

#### Current Read

Phase 1 now owns the pure materialization contract in `src/app/catalog/pubPartsSourceMaterialization.ts`. That owner can represent `browser-fetch-readable`, `browser-fetch-blocked`, `internal-library-cache-hit`, `uploaded-local-zip`, `provider-materialized`, fallback decisions, source identity, source freshness, and the same-path invariant through `archive-list-preview-select-stage`.

`src/app/workspace/CatalogSurface.tsx` already has the correct runtime seam. `Add To Project` is the explicit user action that stages or reuses the current PubParts source record, opens the source-options dialog, checks `readPubPartsInternalLibraryArchiveCache`, checks the metadata-only `readPubPartsArchiveManifestCacheRecord`, and then calls the existing `inspectPubPartsSharedLinkArchive` path only after that user action. Successful archive bytes already flow through `writePubPartsArchiveManifestCacheRecord`, best-effort Local Library mirror write for app-owned bytes, `writePubPartsInternalLibraryArchiveCache`, the source-options `archiveBlob` dialog state, ZIP entry rows, preview actions, selected-entry extraction, and Import review staging. Phase 2 should contract-wrap and status-tighten this path rather than create a second downloader or a second importer.

`src/app/catalog/pubPartsSharedLinkResolver.ts` owns the current browser fetch attempt through `inspectPubPartsSharedLinkArchive`: it normalizes Dropbox links to `dl=1`, calls `fetch`, materializes a Blob, and lists entries through `listPubPartsZipArchiveEntries`. Keep this as the browser fetch/list owner for Phase 2 unless implementation finds a tiny helper split is required for clearer status mapping.

`src/app/catalog/pubPartsInternalLibrary.ts` owns OPFS archive cache reads/writes and same-source-version validation. `src/app/catalog/pubPartsArchiveManifestCache.ts` owns localStorage metadata-only ZIP entry manifests with source identity/freshness keys. `src/app/catalog/pubPartsZipArchive.ts` owns ZIP entry listing and extraction safety. Phase 2 should reuse those owners unchanged wherever possible.

The existing source-options tests in `src/app/workspace/CatalogSurface.test.tsx` already cover no fetch on Catalog load, one Add To Project-triggered ZIP inspection, Internal Library cache reuse without fetch, stale cache rejection, local ZIP fallback, and browser-honest ZIP download/upload guidance after inspection failure. Phase 2 should add or tighten focused assertions around the Phase 1 materialization decision/status language without weakening those proofs.

#### Likely Files And Seams

- `src/app/workspace/CatalogSurface.tsx`
  - import the Phase 1 contract helpers and use them inside the existing PubParts source-options archive inspection flow
  - keep `Add To Project` as the explicit user action that permits the browser fetch attempt
  - keep `readPubPartsInternalLibraryArchiveCache` before the network attempt, because an already-materialized same-source archive is the fastest successful byte origin
  - keep `readPubPartsArchiveManifestCacheRecord` as metadata-only and do not treat it as materialized bytes
  - keep the existing `archiveBlob`, `archiveBlobSourceUrl`, `archiveBlobStagedSourceId`, and `archiveBlobPreviewSource` state path for preview/extraction
  - map blocked/failed materialization decisions into truthful source-options status copy while preserving the existing source/download link and `Upload ZIP` action
- `src/app/workspace/CatalogSurface.test.tsx`
  - add or tighten source-options tests for direct browser materialization status, blocked fetch fallback status, no fetch on load, and same-path reuse
- `src/app/catalog/pubPartsSharedLinkResolver.ts`
  - read-only by default; only touch if implementation needs to expose a minimal browser-fetch result helper instead of reusing `inspectPubPartsSharedLinkArchive`
  - do not add a second fetch implementation
- `src/app/catalog/pubPartsSourceMaterialization.ts`
  - read-only by default; only add a small pure mapper if implementation reveals a contract gap that belongs in the contract owner
- `src/app/catalog/pubPartsInternalLibrary.ts`
  - read-only by default; use existing archive cache read/write helpers
- `src/app/catalog/pubPartsArchiveManifestCache.ts`
  - read-only by default; use existing metadata-only manifest cache behavior
- `src/app/catalog/pubPartsZipArchive.ts`
  - read-only by default; keep ZIP listing/extraction safety unchanged
- `docs/CHANGELOG.md`
  - update during Phase 2 implementation because runtime/source behavior and tests will ship
- this plan doc and `docs/Doc-Log.md`
  - update during implementation only after verification, including focused test/build results before marking Phase 2 complete

#### Exact First Code Cut

Start in `src/app/workspace/CatalogSurface.tsx` at the `handleAddPubPartsDropboxFileToProject` archive-inspection branch.

1. Import Phase 1 helpers from `../catalog/pubPartsSourceMaterialization`, favoring the already-available helpers instead of inventing a UI-owned source identity:
   - `buildPubPartsSourceMaterializationIdentity`
   - `buildPubPartsSourceMaterializationFreshness`
   - `resolvePubPartsSourceMaterializationDecision`
   - `assertPubPartsSourceMaterializationSamePath`
2. Add one small local helper near the existing PubParts source-options status helpers, such as `resolvePubPartsBrowserFetchAttemptStatus`, that accepts a `PubPartsStagedSourceRecord`, a materialization status, and optional byte-size/error context, then returns the Phase 1 decision plus current UI status copy. Keep the helper pure and local unless another owner clearly needs it.
3. Before calling `inspectPubPartsSharedLinkArchive(stagedRecord)`, build the attempted decision with `status: 'browser-fetch-readable'` for the staged record and use that to drive the in-progress message. This should describe the one current source attempt and must not imply that ParaHook can bypass browser/source access rules.
4. When `inspectPubPartsSharedLinkArchive` succeeds, build a successful materialization decision with:
   - `status: 'materialized'`
   - `byteOrigin: 'browser-fetch'`
   - source identity from `buildPubPartsSourceMaterializationIdentity(stagedRecord)`
   - freshness from `buildPubPartsSourceMaterializationFreshness(stagedRecord, { byteSize: archiveInspection.archiveBlob.size, materializedAt })`
   - same-path assertion through `assertPubPartsSourceMaterializationSamePath`
5. After the same-path assertion, continue through the existing path only: `writePubPartsArchiveManifestCacheRecord`, best-effort mirror write, `writePubPartsInternalLibraryArchiveCache`, source-options `archiveBlob` state, ZIP entry rows, preview action state, selected-entry extraction, and Import review staging. Do not create a parallel materialized-file importer, object URL field, File field, or Import acceptance path.
6. When the browser fetch/list attempt throws, resolve a blocked or failed decision through the Phase 1 contract and map it to the existing fallback status. The dialog must still expose the source/open-download link and `Upload ZIP`; checkboxes should remain disabled until bytes are available from browser fetch, Internal Library cache, or local ZIP upload.
7. For an Internal Library archive cache hit, optionally resolve an `internal-library-cache-hit` materialization decision and assert same-path before reopening source-options with cached archive bytes. This should remain a no-fetch path.
8. Leave metadata-only manifest cache behavior intact: it may show candidate rows and source status, but because it does not own archive bytes, it must not claim materialization or enable preview/extraction from bytes it does not have.

#### No-Widening Rule

Phase 2 is only the one explicit user-actioned browser fetch attempt and its fallback/status wiring. Do not add provider, proxy, native bridge, API, server, worker, OAuth, secret, or trusted-provider implementation. Do not add eager downloads on Catalog load or item-page open. Do not change source-options into a new UI flow, new importer, or new Import/project acceptance path. Do not add SQLite, IndexedDB, BLOB storage, localStorage BLOBs, or metadata index adoption. Do not change STEP fidelity, builder behavior, compatibility verdicts, direct-file staging semantics, ZIP extraction policy, Local Library mirror policy, or the existing `Upload ZIP` fallback.

If implementation pressure requires a new visible control such as `Try Direct Source Fetch`, treat that as a Manager decision before widening. The recommended Phase 2 path is to keep `Add To Project` as the explicit user action, because it already opens source options and does not fetch on Catalog load.

#### Implementation Risks

- The current code already performs one Add To Project-triggered browser ZIP inspection. The main risk is accidentally adding a second network call while trying to make the attempt more explicit.
- Browser/source failures should not overclaim CORS, Dropbox policy, or provider failure. Copy should say the browser/source fetch was blocked or failed and keep `Open Source` / `Download ZIP` plus `Upload ZIP` available.
- OPFS/Internal Library write failure must remain nonblocking after readable browser bytes arrive. The current dialog-held `archiveBlob` should still allow ZIP rows, preview, selection, extraction, and Import review staging for that session.
- Async source-options updates must keep the existing stale-dialog/source-id guards so a closed or replaced dialog is not reopened by a late cache read, fetch, mirror write, or OPFS write.
- Metadata-only manifest cache entries can describe archive contents but cannot power preview or extraction. Do not let metadata-only rows masquerade as materialized bytes.
- Same-source freshness must continue to prefer `archiveLastUpdated` when available and `sourceLastUpdated` otherwise, matching the Phase 1 and Internal Library cache identity shape.

#### Implementation Checklist

- [x] Import and use the Phase 1 materialization contract helpers in the existing source-options archive inspection branch.
- [x] Represent the Add To Project-triggered browser ZIP attempt as `browser-fetch-readable` before the call and `materialized` with `byteOrigin: 'browser-fetch'` after readable ZIP bytes are listed.
- [x] Preserve the same-path invariant by asserting that successful browser bytes enter the existing archive/list/preview/select/stage path.
- [x] Preserve Internal Library archive cache hit behavior as same-source materialized bytes with no browser fetch.
- [x] Preserve metadata-only manifest cache behavior as not materialized bytes.
- [x] Preserve blocked/fetch failed fallback status with source/open-download and `Upload ZIP` available.
- [x] Avoid new fetch paths, provider/proxy/native/API code, UI source-option redesign, Import/project acceptance changes, SQLite/IndexedDB/BLOB storage, STEP fidelity, builder, and compatibility changes.
- [x] Update focused source-options tests around browser attempt success, blocked fallback, no fetch on load, and Internal Library no-fetch reuse.
- [x] Update `docs/CHANGELOG.md` for the shipped Phase 2 source/test behavior.
- [x] Update this plan doc and `docs/Doc-Log.md` after verification, and mark Phase 2 complete only if tests and build pass.

#### Focused Verification

Required implementation verification:

- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- if `src/app/catalog/pubPartsSharedLinkResolver.ts` changes, also run `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- if `src/app/catalog/pubPartsInternalLibrary.ts` changes, also run `npm.cmd test -- src/app/catalog/pubPartsInternalLibrary.test.ts`
- `npm.cmd run build`

Useful focused filters while iterating, before the full affected file run:

- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "ZIP-inspected PubParts archive source options"`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "browser-honest ZIP download and upload guidance"`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Internal Library cache"`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not use stale Internal Library archive bytes"`

Verification run for implementation:

- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts` passed: 8 passed.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "ZIP-inspected PubParts archive source options|browser-honest ZIP download and upload guidance|Internal Library cache"` passed: 6 passed, 44 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed: 50 passed, with existing nonblocking OPFS-unavailable stderr in fallback/cache tests.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

#### Tracking Docs

Prep-only work for this spec updates this plan doc and `docs/Doc-Log.md` only. Do not update `docs/CHANGELOG.md` during prep.

Implementation work must update `docs/CHANGELOG.md` because runtime/source behavior and tests ship. If the implementation marks this phase complete or records verification in this plan doc, also update `docs/Doc-Log.md` in the same change set.

#### Stop Condition

Stop once a single explicit Add To Project-triggered browser fetch attempt is represented through the Phase 1 contract, readable ZIP bytes flow into the existing Internal Library/archive-cache and source-options ZIP list/preview/select/stage path, blocked/failed fetch keeps Open Source or source-download plus `Upload ZIP` truthful and usable, no fetch occurs on Catalog load, focused tests pass, and `npm.cmd run build` passes.

Return to Manager instead of continuing if implementation requires provider/proxy/native/API materialization, a new user-visible source-options flow, eager downloads, new persistent byte storage, Import/project acceptance changes, STEP fidelity work, builder behavior, compatibility verdicts, or a separate ZIP importer.

### Phase 2 Acceptance

- [x] A readable test ZIP source can be fetched after user action and cached in Internal Library.
- [x] The cached archive can enter the existing source-options ZIP listing/preview/staging path.
- [x] A blocked fetch keeps `Open Source` and `Upload ZIP` available with clear status.
- [x] No PubParts archive is fetched on Catalog load.

## [x] `Catalog-Gen2-17 / Phase 3` - `Trusted Provider Boundary`

### Phase 3 Summary

Define the bridge contract for a PubParts proxy, helper, native bridge, or API materializer without hardcoding one provider as required.

### Phase 3 Manager Guide-Rails For Worker Prep

Phase 3 should add the trusted source-byte provider boundary as a contract and app integration seam, not as a real Dropbox/PubParts credential implementation.

The trusted provider is allowed to represent a future PubParts proxy, native helper, desktop bridge, or API adapter that can legally return archive bytes after explicit user action. It must not:
- put Dropbox app secrets, bearer tokens, refresh tokens, cookies, or scraping logic in browser code
- scrape Dropbox HTML pages or attempt to bypass CORS/source restrictions
- require a mandatory server deployment before the existing browser-fetch and Upload ZIP paths remain usable
- replace the existing browser-readable source path, Internal Library cache path, metadata-only manifest path, or Upload ZIP fallback

Worker prep should keep the first implementation small and testable:
- define a pure provider request/capability/result shape or a tiny app-owned adapter seam
- include status reads for configured, unavailable, blocked, failed, and materialized provider states
- route successful provider bytes through the same Phase 1 materialization contract and the same archive list/preview/select/stage path as browser-fetched bytes
- use a fake/injected provider in tests instead of a live network service
- keep provider materialization opt-in and user-actioned from the existing source-options/Add To Project flow
- keep source identity/freshness and no-secret/no-bypass wording visible in status/fallback copy

If implementation pressure suggests a real local server, service worker, native helper protocol, OAuth flow, or PubParts API integration, stop at the boundary and route that to a follow-up phase. Phase 3 succeeds when ParaHook can represent and test trusted-provider materialization without shipping real secret-bearing infrastructure.

### Phase 3 Owns

- provider capability/status contract
- provider materialization result shape
- no-secret-in-browser boundary
- fallback behavior when provider is unavailable or blocked
- tests or contract fixtures proving provider results enter the same archive cache/list/preview/stage path as browser-readable bytes

### Phase 3 Does Not Own

- real Dropbox app credentials in the browser
- scraping Dropbox pages
- account-wide Dropbox browsing
- mandatory PubParts server changes
- replacing Upload ZIP fallback

### Phase 3 Implementation Spec

Status: complete.

#### Implementation Status

- Added `src/app/catalog/pubPartsTrustedSourceProvider.ts` as the trusted provider contract/app seam.
- Added a side-effect-free default unavailable provider so the app does not imply a real provider exists.
- Added resettable fake/injected provider support for tests.
- Added capability reads and provider-result-to-Phase-1 materialization decision mapping for configured, unavailable, blocked, failed, and provider-materialized states.
- Added same-path assertion support for provider-materialized trusted-provider archive bytes.
- Integrated the provider seam into `src/app/workspace/CatalogSurface.tsx` after Internal Library cache miss without replacing the existing browser fetch or Upload ZIP fallback.
- Routed fake provider ZIP bytes through existing ZIP entry listing, source-options candidates, archive manifest cache write, Internal Library archive cache write, preview state, selected-entry extraction, and Import review staging.
- Preserved stale-dialog/source-id guards by checking the current source-options dialog before applying async provider results or falling back to browser fetch.
- Did not add real provider/proxy/native/API infrastructure, browser secrets, scraping, CORS bypass, OAuth, service worker, SQLite/IndexedDB/BLOB storage, provider-specific UI/importer, Import/project acceptance changes, STEP fidelity, builder behavior, or compatibility behavior.

#### Current Read

Phase 1 owns the materialization decision contract in `src/app/catalog/pubPartsSourceMaterialization.ts`. It already has the status names Phase 3 needs: `provider-materialized`, `provider-unavailable`, `provider-blocked`, `failed`, plus the trusted byte origin `trusted-provider`. A provider-success decision should therefore be represented by the existing Phase 1 contract, not by a new provider-specific archive path.

Phase 2 wired `src/app/workspace/CatalogSurface.tsx` so the existing Add To Project-triggered source-options flow can build Phase 1 decisions for browser fetch attempts, browser-fetched bytes, Internal Library cache hits, and blocked browser fallback. The same file already contains the live seam for reusing successful bytes: `inspectArchiveFromSource` lists ZIP entries, writes metadata cache, writes/mirrors app-owned archive bytes, writes `writePubPartsInternalLibraryArchiveCache`, and then updates source-options with `archiveBlob` so preview, selected-entry extraction, and Import review staging use the same archive/list/preview/select/stage path.

`src/app/catalog/pubPartsSharedLinkResolver.ts` remains the browser fetch and ZIP candidate resolver owner. Phase 3 should not add another browser fetch implementation or put provider-specific credentials there. If a provider seam needs a shared "archive bytes become listed candidates" helper, the first preference is to keep that orchestration in `CatalogSurface` or a small Catalog provider-boundary module instead of blending provider trust concerns into the shared-link resolver.

`src/app/catalog/pubPartsInternalLibrary.ts` is still the only OPFS/Internal Library byte owner for archive cache writes. Provider bytes that successfully materialize should be passed into that existing owner the same way browser-fetched and uploaded ZIP bytes are, after the provider result has been translated into the Phase 1 `provider-materialized` decision.

#### Likely Files And Seams

- `src/app/catalog/pubPartsTrustedSourceProvider.ts` or `src/app/catalog/pubPartsSourceByteProvider.ts`
  - likely new pure/tiny contract owner for provider capability, request, result, status mapping, fallback reads, and an injectable provider interface
  - no live network, credentials, native protocol, OAuth, service worker, PubParts API, Dropbox API, or server code
  - should export a default unavailable provider adapter so the app can depend on the seam without requiring infrastructure
- `src/app/catalog/pubPartsTrustedSourceProvider.test.ts`
  - focused contract tests for configured/unavailable/blocked/failed/materialized states and Phase 1 decision mapping
- `src/app/workspace/CatalogSurface.tsx`
  - likely minimal integration point after Internal Library cache miss and before or after the existing browser fetch attempt, depending on the exact Manager-approved ordering
  - recommended first cut: preserve browser fetch as the current first direct attempt; provider unavailable/blocked must not prevent browser fetch or Upload ZIP fallback
  - if a fake provider is injected for tests and returns bytes, list those bytes and continue through the same code path used after `inspectPubPartsSharedLinkArchive`
  - provider status copy should stay honest and should not claim a real provider exists when the default adapter is unavailable
- `src/app/workspace/CatalogSurface.test.tsx`
  - add focused source-options tests using a fake/injected provider, not a real network service
  - prove successful provider bytes enter the same source-options ZIP rows, Internal Library cache write, preview availability, selected-entry staging, and no auto project commit path
  - prove unavailable/blocked provider status keeps the existing browser fetch and `Upload ZIP` fallback available
- `src/app/catalog/pubPartsSourceMaterialization.ts`
  - read-only by default because Phase 1 already has `provider-materialized`, `provider-unavailable`, `provider-blocked`, `failed`, and `trusted-provider`
  - touch only if implementation finds a small pure contract gap that cannot be represented by existing helpers
- `src/app/catalog/pubPartsSharedLinkResolver.ts`
  - read-only by default; do not add provider credentials or a second browser fetch implementation here
- `docs/CHANGELOG.md`
  - update during implementation because source/test behavior will ship
- this plan doc and `docs/Doc-Log.md`
  - update during implementation after verification if the phase is marked complete

#### Exact First Code Cut

Start with a new pure/tiny provider-boundary owner, preferably `src/app/catalog/pubPartsTrustedSourceProvider.ts`.

Define only contract-level shapes and a dependency-injection seam:

```ts
export type PubPartsTrustedSourceProviderCapabilityStatus =
  | 'configured'
  | 'unavailable'
  | 'requires-configuration'
  | 'blocked'

export type PubPartsTrustedSourceProviderMaterializationStatus =
  | 'not-attempted'
  | 'materialized'
  | 'unavailable'
  | 'blocked-by-provider'
  | 'blocked-by-source'
  | 'failed'

export type PubPartsTrustedSourceProviderRequest = {
  stagedRecord: PubPartsStagedSourceRecord
  explicitUserAction: 'add-to-project-source-options'
}

export type PubPartsTrustedSourceProviderResult =
  | { status: 'materialized'; archiveBlob: Blob; sourceUrl?: string; contentHash?: string; materializedAt: string; providerLabel: string }
  | { status: 'unavailable' | 'blocked-by-provider' | 'blocked-by-source' | 'failed'; reason: string; providerLabel?: string }

export type PubPartsTrustedSourceProvider = {
  getCapability: () => PubPartsTrustedSourceProviderCapability
  materializeArchiveBytes: (request: PubPartsTrustedSourceProviderRequest) => Promise<PubPartsTrustedSourceProviderResult>
}
```

Keep the exact exported names flexible, but the shape must preserve these concepts:
- provider capability is separate from materialization result
- source identity comes from `PubPartsStagedSourceRecord`
- materialization requires explicit user action context
- success returns only app-owned archive bytes and safe provenance, not secrets or remote credentials
- blocked/unavailable/failed states carry a truthful reason
- default provider is unavailable and side-effect free

Add pure mapping helpers in the provider-boundary owner:
- map provider capability to display/status reads without implying a provider is installed
- map provider result to Phase 1 decision input:
  - success -> `status: 'provider-materialized'`, trusted-provider byte origin via Phase 1 resolver, optional content hash/byte size/materializedAt freshness
  - unavailable -> `status: 'provider-unavailable'`
  - blocked-by-provider or blocked-by-source -> `status: 'provider-blocked'`
  - failed -> `status: 'failed'`
- expose a small `assert` or read helper that verifies provider success uses `assertPubPartsSourceMaterializationSamePath`

Only after the pure owner is tested should implementation touch `CatalogSurface.tsx`. The Catalog integration should be the smallest possible adapter:
1. Build a provider request from the same staged source used by the Add To Project source-options flow.
2. Use the default unavailable provider unless a test injects a fake provider through a narrow app seam.
3. Keep the existing Internal Library cache hit path first.
4. Preserve the existing browser fetch attempt and `Upload ZIP` fallback when provider is unavailable/blocked/failed.
5. If the injected provider returns `materialized` bytes, list the ZIP with `listPubPartsZipArchiveEntries`, convert entries through `mapPubPartsZipArchiveEntriesToSharedLinkCandidates`, assert Phase 1 same-path using `provider-materialized`, write the existing archive manifest cache, write/mirror Internal Library archive bytes through existing owners, and set source-options `archiveBlob` exactly like browser-fetched bytes.
6. Do not create a provider-specific importer, provider-specific ZIP listing UI, provider object URL field, provider `File` field, Import acceptance path, project commit path, or compatibility verdict.

If the app does not yet have an injection pattern suitable for tests, prefer a tiny module-level provider registry or optional function parameter with deterministic reset in tests. Keep that seam local, explicit, and side-effect free by default.

#### No-Widening Rule

Phase 3 is not a real provider implementation. Do not add Dropbox/PubParts app secrets, bearer tokens, refresh tokens, cookies, credential storage, HTML scraping, CORS bypass attempts, OAuth, service worker download interception, mandatory server deployment, real native helper protocol registration, PubParts API integration, account-wide Dropbox browsing, SQLite/IndexedDB adoption, new binary storage, Import/project acceptance changes, STEP fidelity work, builder behavior, or compatibility behavior.

Do not replace the browser-fetch path from Phase 2 and do not replace the Upload ZIP fallback. Provider unavailable, blocked, or failed states must keep the existing source-options path usable through browser fetch where possible and local ZIP upload when bytes are still unavailable.

#### Implementation Risks

- Provider success can accidentally become a second importer if the implementation builds a provider-only handoff. Avoid this by routing provider bytes through the exact same archive blob, ZIP listing, source-options rows, preview, selected-entry extraction, and Import review staging path used for browser-fetched bytes.
- A default provider seam can accidentally imply a real provider exists. The default adapter should be explicitly unavailable and testable.
- Provider status copy can accidentally overpromise that ParaHook can bypass browser/source restrictions. Keep language to trusted provider availability and legal byte materialization only.
- Adding provider orchestration inside the shared-link resolver could blur browser fetch and trusted provider ownership. Keep browser fetch and provider boundary separated.
- Async provider results can race source-options closure or source changes. Reuse the same stale-dialog/source-id guard pattern already used for Internal Library reads and browser fetch results.
- OPFS/Internal Library write failures must remain nonblocking after provider bytes arrive; the session-held `archiveBlob` should still power rows/preview/staging.
- Provider result freshness must not bypass source identity validation; build identity/freshness with existing Phase 1 helpers from the current staged record.

#### Implementation Checklist

- [x] Add a pure/tiny trusted provider boundary owner with capability, request, result, default unavailable adapter, and injected/fake provider test seam.
- [x] Add mapping helpers from provider results to existing Phase 1 materialization decisions, including `provider-materialized`, `provider-unavailable`, `provider-blocked`, and `failed`.
- [x] Prove provider-materialized results resolve to trusted-provider archive bytes and assert the same-path invariant.
- [x] Keep browser secrets, scraping, OAuth, service worker, native protocol, server, and PubParts API implementation out.
- [x] Integrate the provider seam into `CatalogSurface` only after Internal Library cache read and without replacing browser fetch or Upload ZIP fallback.
- [x] Route successful fake provider bytes through `listPubPartsZipArchiveEntries`, `mapPubPartsZipArchiveEntriesToSharedLinkCandidates`, existing archive manifest cache write, existing Internal Library archive cache write, existing source-options `archiveBlob` state, preview, selected-entry extraction, and Import review staging.
- [x] Keep provider unavailable/blocked/failed states truthful and recoverable through browser fetch and/or Upload ZIP fallback.
- [x] Add focused owner tests for provider capability/result mapping.
- [x] Add focused Catalog source-options tests with fake provider success and unavailable/blocked provider states.
- [x] Update `docs/CHANGELOG.md`, this plan doc, and `docs/Doc-Log.md` during implementation after verification.

#### Focused Verification

Required implementation verification:

- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts`
- `npm.cmd test -- src/app/catalog/pubPartsTrustedSourceProvider.test.ts` or the actual new provider-boundary test filename
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- if `src/app/catalog/pubPartsSharedLinkResolver.ts` changes, also run `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `npm.cmd run build`

Useful focused filters while iterating, before the full affected file run:

- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "trusted provider"`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Upload ZIP"`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Internal Library cache"`

Verification run for implementation:

- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts` passed: 8 passed.
- `npm.cmd test -- src/app/catalog/pubPartsTrustedSourceProvider.test.ts` passed: 7 passed.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "trusted provider"` passed: 2 passed, 50 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed: 52 passed, with existing nonblocking OPFS-unavailable stderr in fallback/cache tests.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

#### Tracking Docs

Prep-only work for this spec updates this plan doc and `docs/Doc-Log.md` only. Do not update `docs/CHANGELOG.md` during prep.

Implementation work must update `docs/CHANGELOG.md` because source/test behavior will ship. If implementation marks Phase 3 complete or records verification in this plan doc, update `docs/Doc-Log.md` in the same change set.

#### Stop Condition

Stop once ParaHook can represent trusted-provider capability and materialization results, prove those results through fake/injected tests, route successful provider bytes through the Phase 1 `provider-materialized` decision and the existing Internal Library/source-options archive path, and prove unavailable/blocked/failed provider states preserve browser fetch plus Upload ZIP fallback. `npm.cmd run build` must pass before the phase is marked complete.

Return to Manager instead of continuing if implementation requires a real provider service, Dropbox/PubParts credentials, scraping, CORS bypass, OAuth, service worker, native helper protocol, mandatory server deployment, PubParts API integration, SQLite/IndexedDB storage, Import/project acceptance changes, STEP fidelity, builder behavior, compatibility behavior, or any provider-only importer path.

### Phase 3 Acceptance

- [x] The app can represent a configured, unavailable, blocked, and successful source-byte provider state.
- [x] Successful provider bytes use the same Internal Library and source-options path as direct browser fetch bytes.
- [x] Browser code does not need or expose Dropbox secrets.
- [x] Provider unavailable states keep the manual upload fallback.

## [x] `Catalog-Gen2-17 / Phase 4` - `Source-Library Metadata Index`

### Phase 4 Summary

Plan and, if approved, introduce the metadata index for source/library state without moving large binaries into hidden metadata storage.

### Phase 4 Manager Guide-Rails For Worker Prep

Phase 4 should translate the SQLite/local database idea into a ParaHook-safe source-library metadata index. The goal is to make source state queryable, not to move ZIP/model bytes into a database by default.

The accepted storage split remains:
- OPFS/Internal Library owns large archive/model/extracted bytes.
- Optional Local Library mirror owns visible user-granted file copies.
- A SQLite/IndexedDB-style database may own small metadata records: source identity, source freshness/version, archive manifest summaries, file-candidate status, preview/importable status, provider materialization state, Internal Library file ids/paths, Local Library mirror status, stale/blocked reads, and timestamps.
- `localStorage` can remain a compatibility metadata cache during transition, but it must not store large binaries.

Worker prep should prefer a small implementation-ready contract first:
- define the metadata index record/schema shape and query answers that Phase 4 acceptance needs
- provide a pure builder/query owner that can answer cached, inspected, previewable, importable, mirrored, stale, blocked, and provider-state reads from existing source records, archive manifests, Internal Library manifests, Local Library mirror config, and provider decisions
- include an explicit IndexedDB-versus-SQLite decision note; do not add a SQLite dependency unless the prep proves a real need and Manager approves it
- keep existing source-options and Local Downloads as source truth; the metadata index should describe and unify state, not become a second owner of bytes or project assets

If the implementation cannot honestly add persistent IndexedDB/SQLite storage inside this phase without widening risk, stop at a pure metadata-index contract plus adapters and route persistence/migration into a follow-up phase. That is still valuable because it makes the future database boundary precise before storage choices harden.

### Phase 4 Owns

- metadata index schema or planning surface for source identity, source version, archive manifest, candidate entries, preview/importable status, Internal Library file ids/paths, optional Local Library mirror status, and provider materialization status
- OPFS-first binary ownership rule
- IndexedDB or SQLite decision note
- migration/fallback plan from existing localStorage metadata if needed

### Phase 4 Does Not Own

- storing ZIP/model binaries in `localStorage`
- bulk importing all PubParts archives into the database
- replacing OPFS/Internal Library as the binary owner
- project asset persistence changes

### Phase 4 Implementation Spec

Status: implemented and verified on 2026-04-21.

Current read:
- Phase 1 owns the source materialization contract: source identity/freshness, legal byte origins, provider/browser/upload/cache status, fallback reads, and same-path archive-byte assertions.
- Phase 2 and Phase 3 now route Add To Project-triggered browser bytes, Internal Library cache hits, and fake trusted-provider bytes into the same OPFS/Internal Library plus ZIP list/preview/select/stage path.
- Existing source truth already lives in staged PubParts source records, source-options state, Local Downloads settings, Internal Library archive cache metadata, metadata-only archive manifest cache records, Local Library mirror reads, and provider materialization decisions.
- Phase 4 should index those existing truths into queryable metadata records. It must not create a second byte owner, importer, project acceptance path, provider implementation, or storage engine.

Likely files and seams:
- Add `src/app/catalog/pubPartsSourceLibraryMetadataIndex.ts` as the pure schema/builder/query owner.
- Add `src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts` for focused contract tests.
- Read existing types/helpers where useful from `src/app/catalog/pubPartsSourceMaterialization.ts`, `src/app/catalog/pubPartsTrustedSourceProvider.ts`, `src/app/catalog/pubPartsArchiveManifestCache.ts`, `src/app/catalog/pubPartsInternalLibrary.ts`, `src/app/catalog/pubPartsLocalLibraryMirror.ts`, `src/app/catalog/pubPartsDownloadsStorage.ts`, `src/app/catalog/pubPartsZipArchive.ts`, and `src/app/catalog/pubPartsZipEntryPreview.ts`.
- Keep `src/app/workspace/CatalogSurface.tsx` read-only in the first cut unless Manager explicitly widens integration. The first implementation should be a pure index contract that can be fed by CatalogSurface or a later persistence adapter.
- Tracking updates for implementation: `docs/CHANGELOG.md`, this plan doc, and `docs/Doc-Log.md`.

Recommended schema/query shape:
- Define a schema version constant such as `PUB_PARTS_SOURCE_LIBRARY_METADATA_INDEX_SCHEMA_VERSION`.
- Define `PubPartsSourceLibraryMetadataRecord` as small metadata only:
  - source identity: provider id/name, catalog item id or label, staged/source record id if available, source kind, source URL, source page URL, candidate archive URL, linked archive URL, source version key, source version kind, source last-updated/archive last-updated, and indexed timestamp.
  - materialization summary: Phase 1 status, byte origin when present, provider state, fallback availability, next action, materialized-at timestamp, and optional byte count from existing metadata only.
  - archive summary: manifest source (`none`, `metadata-cache`, `internal-library`, `browser-fetch`, `trusted-provider`, `uploaded-local-zip`), inspected-at timestamp, entry count, supported entry count, previewable entry count, importable entry count, blocked entry count, and stale read.
  - candidate entry summaries: normalized path, file name, extension/type, support state, preview state, importable/selectable boolean, blocked reason, file size when manifest metadata has it, and modified timestamp when manifest metadata has it.
  - storage summary: Internal Library state/id/path metadata, Local Library mirror enabled/disabled/reconnect-needed/mirrored/not-mirrored status, and visible mirror label/path metadata without file handles or blobs.
  - read flags: cached, inspected, previewable, importable, mirrored, stale, blocked, upload fallback available, browser fetch attemptable, provider configured, provider unavailable, provider blocked, and provider materialized.
- Define `PubPartsSourceLibraryMetadataIndex` as an in-memory collection with deterministic maps by source identity/source version/catalog item id and path.
- Provide builder/query helpers:
  - `buildPubPartsSourceLibraryMetadataRecord(input)` maps one staged/source read plus optional archive manifest, Internal Library cache metadata, Local Library mirror read, materialization decision, and provider decision into one record.
  - `createPubPartsSourceLibraryMetadataIndex(records)` normalizes records and exposes query helpers.
  - Query helpers answer cached, inspected, previewable, importable, mirrored, stale, blocked, provider-state, source-version, and catalog-item reads without touching bytes.

Exact first code cut:
- Create the pure owner and type its inputs around existing public shapes instead of inventing UI-owned identity.
- Accept small metadata snapshots only. Do not accept `Blob`, `File`, `ArrayBuffer`, object URL, file handle, OPFS handle, ZIP bytes, extracted model bytes, or project asset payload fields.
- Implement deterministic derivation of record read flags from existing state:
  - `cached` is true only for Internal Library cache metadata that represents materialized bytes.
  - metadata-only archive manifest cache means `inspected` can be true but `cached` stays false unless Internal Library metadata is also present.
  - `previewable` and `importable` derive from candidate entry support/preview metadata, not from byte storage.
  - `mirrored` derives from Local Library mirror metadata and never implies OPFS ownership.
  - `stale` compares source identity/freshness/version reads against the current staged/source identity.
  - `blocked` includes blocked materialization/provider states and blocked entry summaries, but does not claim a CORS/provider reason unless the existing decision supplied one.
- Add focused contract tests before any UI wiring:
  - builds a cached, inspected, previewable/importable record from Internal Library plus manifest metadata.
  - maps metadata-only manifest cache as inspected but non-materialized and non-cached.
  - maps Local Library mirror status as mirrored without claiming byte ownership.
  - marks stale when source version/freshness changed.
  - marks blocked provider/browser decisions while keeping upload fallback readable.
  - queries by source version, provider state, cached, previewable, importable, mirrored, stale, and blocked.

IndexedDB-versus-SQLite decision note:
- Phase 4 should not add SQLite or IndexedDB persistence in the first code cut.
- IndexedDB is the safer browser-native follow-up candidate for small source/library metadata because it avoids a new dependency, works with existing browser storage/quota behavior, and can reference OPFS/Internal Library ids without storing blobs.
- SQLite over OPFS can become attractive later if ParaHook needs richer relational querying, migrations, ad hoc reporting, or cross-family metadata joins, but it brings dependency, worker/bundle, schema migration, quota, and backup/export decisions that are wider than this phase.
- Either persistence option must remain a metadata index only. Large ZIP/model/extracted bytes stay in OPFS/Internal Library or user-visible Local Library mirror files.

Migration and fallback plan:
- First cut is pure in-memory mapping from existing records. It should be safe to run without persistent database availability.
- Existing `localStorage` metadata caches remain compatibility sources during the transition and continue to hold only small metadata records.
- A future persistence phase can dual-read existing `localStorage` metadata plus the new index store, backfill metadata records, then retire compatibility reads only after tests prove no source-options or Local Downloads state loss.
- No migration may move ZIP/model bytes into localStorage, IndexedDB, SQLite, or a hidden blob table. Persisted metadata should reference OPFS/Internal Library ids/paths or visible mirror metadata instead.

No-widening rule:
- Do not add a SQLite dependency, IndexedDB store, migration runner, blob table, source-options redesign, Local Downloads redesign, provider infrastructure, API/proxy/native integration, Import/project acceptance behavior, STEP fidelity work, builder behavior, compatibility verdict behavior, eager catalog scanning, or bulk PubParts archive import.
- Do not add new byte ownership fields such as object URLs, `File`, `Blob`, `ArrayBuffer`, file handles, or extracted model payloads to metadata records.
- Do not mark Phase 4 complete if the record builder cannot answer the acceptance reads from existing metadata without creating a second source truth.

Implementation risks:
- Accidentally turning the metadata index into a hidden blob vault.
- Creating stale or conflicting source truth next to source-options, Local Downloads, OPFS/Internal Library, and Local Library mirror owners.
- Overclaiming why a source is blocked when only a generic failed/blocked materialization status is known.
- Treating metadata-only manifest cache as byte materialization.
- Making schema too UI-specific and hard to reuse from future persistence adapters.
- Expanding into database migration before the pure query contract is stable.

Implementation checklist:
- [x] Add the pure source-library metadata index owner under `src/app/catalog/`.
- [x] Define metadata-only record/input/query types and schema version.
- [x] Map existing source/materialization/archive/Internal Library/mirror/provider state into records.
- [x] Prove cached, inspected, previewable, importable, mirrored, stale, blocked, provider-state, and source-version queries with focused tests.
- [x] Keep large-byte ownership with OPFS/Internal Library or visible Local Library mirror files.
- [x] Keep metadata-only manifest cache distinct from materialized bytes.
- [x] Document the IndexedDB-versus-SQLite decision and persistence follow-up boundary in this phase record.
- [x] Update `docs/CHANGELOG.md`, this plan doc, and `docs/Doc-Log.md` after implementation verification.

Focused verification for implementation:
- `npm.cmd test -- src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts`
- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts`
- `npm.cmd test -- src/app/catalog/pubPartsTrustedSourceProvider.test.ts`
- If existing storage or archive owners are imported directly, also run the nearest affected tests, such as `npm.cmd test -- src/app/catalog/pubPartsArchiveManifestCache.test.ts src/app/catalog/pubPartsInternalLibrary.test.ts src/app/catalog/pubPartsDownloadsStorage.test.ts`.
- `npm.cmd run build`

Verification result:
- 2026-04-21: `npm.cmd test -- src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts` passed, 6 tests.
- 2026-04-21: `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts` passed, 8 tests.
- 2026-04-21: `npm.cmd test -- src/app/catalog/pubPartsTrustedSourceProvider.test.ts` passed, 7 tests.
- 2026-04-21: `npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts` passed, 5 tests, because Phase 4 imports the preview file-type helper at runtime.
- 2026-04-21: `npm.cmd run build` passed with the existing Vite occt browser-externalized and large-chunk warnings.

Stop condition:
- Stop Phase 4 implementation after a pure metadata index/query owner, focused tests, tracking docs, and passing build.
- If persistent IndexedDB/SQLite storage, localStorage migration, CatalogSurface UI wiring, Local Downloads redesign, or bulk archive indexing becomes necessary, pause and ask Manager to split that work into a follow-up phase instead of widening Phase 4.

### Phase 4 Acceptance

- [x] The metadata index can answer which PubParts sources are cached, inspected, previewable, importable, mirrored, stale, or blocked.
- [x] Large archive/model bytes still live in OPFS/Internal Library or visible mirror files.
- [x] Existing source-options and Local Downloads reads can be mapped to the index without creating a second source truth.
- [x] Any SQLite adoption is explicitly justified against IndexedDB/OPFS and does not become a hidden blob vault by default.

## [x] `Catalog-Gen2-17 / Phase 5` - `Final Audit And Follow-Ups`

### Phase 5 Summary

Close or extend the lane honestly.

### Phase 5 Manager Guide-Rails For Worker Prep

Phase 5 should be a final audit and closeout slice, not a stealth feature phase. Prep should prove whether `Catalog-Gen2-HLG-22` is now satisfied by the shipped Phase 1-4 stack:
- Phase 1 gives truthful materialization status/provenance/fallback reads.
- Phase 2 routes the existing Add To Project-triggered browser ZIP attempt through that materialization contract and keeps Upload ZIP fallback.
- Phase 3 adds the trusted-provider boundary without browser secrets, scraping, or mandatory proxy/native infrastructure.
- Phase 4 adds a pure metadata-only source-library index/query owner without creating a blob database.

The audit should compare the shipped behavior against the original user problem and friend's suggestion:
- "stream into a buffer and work on it there" is accepted only after legal browser/provider/user-granted byte access, then the bytes flow through the existing ZIP list/preview/select/stage path and OPFS/Internal Library ownership.
- "create a sqlite database in local storage" is translated into the safer metadata-index decision: IndexedDB is the likely browser-native persistence follow-up for small metadata first; SQLite-over-OPFS remains optional later for richer relational needs; neither owns ZIP/model blobs by default.

Worker prep should define:
- exact code/doc surfaces to audit
- exact focused tests/build to rerun
- which HLG/CLG boxes can close, and which must stay open if any proof is missing
- whether any follow-up phase is required for persistent IndexedDB metadata storage, real trusted provider/native/helper integration, richer UI surfacing of the metadata index, or live end-to-end Dropbox-provider proof

No-widening rule:
- Do not add persistent IndexedDB/SQLite storage during Phase 5.
- Do not add a real provider, proxy, native bridge, API secret, scraping path, CORS bypass, service worker, Import/project acceptance change, STEP loader change, builder change, compatibility change, eager archive scan, or bulk archive import.
- Do not rewrite completed phase history; append closeout truth and route follow-ups honestly.
- If a follow-up is needed, prefer adding a clearly scoped `Phase 5.1` section inside this doc only when it belongs to Gen2-17. If the gap is larger or belongs to another family, route it to the owning future phase instead.

Likely closeout verification:
- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts src/app/catalog/pubPartsTrustedSourceProvider.test.ts src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "ZIP-inspected PubParts archive source options|browser-honest ZIP download and upload guidance|Internal Library cache|trusted provider"`
- `npm.cmd run build`

Closeout tracking expectation:
- Update this phase doc, `Catalog-Gen2-Index.md`, `Catalog-Vision.md`, and `docs/Doc-Log.md`.
- Only update `docs/CHANGELOG.md` if Phase 5 changes source/runtime behavior.
- If the audit closes `Catalog-Gen2-HLG-22`, mark it complete in both Catalog Gen2 index and Catalog Vision duplicated HLG checklists.

### Phase 5 Implementation Spec

Status: implemented and verified on 2026-04-21.

Phase 5 should be a docs/test audit and closeout pass. It should not implement runtime behavior. If the audit finds a narrow source-code correction is essential to keep Phases 1-4 truthful, stop and report the needed correction for Manager approval instead of fixing it inside the closeout pass.

Audit surfaces:
- Phase 1 contract: `src/app/catalog/pubPartsSourceMaterialization.ts` and `src/app/catalog/pubPartsSourceMaterialization.test.ts`.
  - Confirm the materialization status/provenance/freshness/fallback/same-path model still distinguishes readable, blocked, uploaded, Internal Library cached, provider-materialized, provider-unavailable, provider-blocked, failed, and upload-required states.
  - Confirm successful legal byte origins resolve to the existing archive list/preview/select/stage path instead of a second importer.
- Phase 2 Catalog source-options integration: `src/app/workspace/CatalogSurface.tsx` and `src/app/workspace/CatalogSurface.test.tsx`.
  - Confirm `Add To Project` remains the explicit user action before any browser ZIP fetch attempt.
  - Confirm Internal Library archive cache hits avoid browser fetch and still reuse the same source-options archive path.
  - Confirm blocked/failed browser fetch states keep `Open Source` plus `Upload ZIP` fallback truthful without overclaiming CORS/provider causes.
  - Confirm metadata-only archive manifests do not become previewable byte sources.
- Phase 3 provider boundary: `src/app/catalog/pubPartsTrustedSourceProvider.ts`, `src/app/catalog/pubPartsTrustedSourceProvider.test.ts`, and the provider-focused CatalogSurface tests.
  - Confirm the default provider is unavailable and side-effect-free.
  - Confirm fake provider success maps through `provider-materialized` / `trusted-provider` and the existing Internal Library plus source-options path.
  - Confirm unavailable/blocked/failed provider reads preserve browser fetch and Upload ZIP fallback.
  - Confirm no Dropbox/browser secrets, scraping, CORS bypass, mandatory proxy/native bridge, OAuth, service worker, or API implementation landed.
- Phase 4 metadata index: `src/app/catalog/pubPartsSourceLibraryMetadataIndex.ts` and `src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts`.
  - Confirm the index is metadata-only and has no `Blob`, `File`, `ArrayBuffer`, `Uint8Array`, object URL, file handle, OPFS handle, ZIP byte, extracted model byte, or project asset ownership fields.
  - Confirm it answers cached, inspected, previewable, importable, mirrored, stale, blocked, provider-state, source-version, catalog-item, and record-id reads.
  - Confirm IndexedDB is documented as the likely browser-native metadata persistence follow-up and SQLite-over-OPFS remains optional only for richer relational needs; neither owns blobs by default.
- Storage and fallback owners:
  - `src/app/catalog/pubPartsInternalLibrary.ts` owns OPFS/Internal Library large archive/model/extracted bytes and manifests.
  - `src/app/catalog/pubPartsArchiveManifestCache.ts` remains metadata-only localStorage compatibility cache.
  - `src/app/catalog/pubPartsLocalLibraryMirror.ts` remains optional user-granted visible mirror ownership.
  - `src/app/catalog/pubPartsDownloadsStorage.ts` remains staged/source/local-download metadata truth.
- Preview and Import handoff:
  - `src/app/catalog/pubPartsZipEntryPreview.ts` and source-options tests should still prove preview only uses current dialog archive bytes or same-source-version Internal Library bytes.
  - `CatalogSurface.test.tsx` should still prove selected ZIP entries stage into Import review and do not become project assets directly.

Focused verification for closeout:
- `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts src/app/catalog/pubPartsTrustedSourceProvider.test.ts src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "ZIP-inspected PubParts archive source options|browser-honest ZIP download and upload guidance|Internal Library cache|trusted provider"`
- If the filtered CatalogSurface test names drift, run the nearest focused CatalogSurface tests covering uploaded ZIP fallback, browser fetch success/blocked, Internal Library cache reuse, provider success/blocked, source-options preview, and selected-entry Import staging.
- `npm.cmd run build`
- Docs-only verification after closeout edits: `git diff --check -- docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-17\ -\ Direct\ Source\ Byte\ Materialization\ And\ Library\ Metadata\ Index.md docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Vision.md docs/Doc-Log.md`

Closeout docs to update:
- This Gen2-17 plan doc:
  - mark Phase 5 complete only after the audit commands pass or any failures are documented as unrelated existing owner failures.
  - add Phase 5 verification results.
  - mark Phase 5 acceptance boxes with exact closure/follow-up notes.
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`:
  - if HLG-22 closes, mark `Catalog-Gen2-HLG-22` complete and mark `Catalog-Gen2-17` complete.
  - change dispatch next to `none` for Gen2-17, or to an explicitly named follow-up such as `Catalog-Gen2-17 / Phase 5.1` if the audit finds a Gen2-17-local gap.
  - preserve already-complete CLG-40, CLG-41, and CLG-42 entries without rewriting their history.
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Vision.md`:
  - if HLG-22 closes, mark the duplicated `Catalog-Gen2-HLG-22` checklist item complete with a concise shipped-read note.
  - if HLG-22 does not close, leave it open and add a precise follow-up note naming the missing proof.
- `docs/Doc-Log.md`:
  - record the Phase 5 closeout docs/test audit and any HLG/CLG routing.
- `docs/CHANGELOG.md`:
  - do not update for docs/test-only closeout.
  - update only if Manager approves and Phase 5 actually changes source/runtime behavior.

HLG/CLG closure rules:
- `Catalog-Gen2-CLG-40` can remain complete if the audit confirms the existing Add To Project-triggered browser ZIP attempt is represented through Phase 1, successful readable bytes write/reuse Internal Library where available, and blocked/failed reads preserve Upload ZIP fallback.
- `Catalog-Gen2-CLG-41` can remain complete if the audit confirms the trusted provider boundary exists, defaults unavailable, can be faked/injected in tests, maps success to `provider-materialized` / `trusted-provider`, and does not implement browser secrets, scraping, CORS bypass, OAuth, service worker, or mandatory provider infrastructure.
- `Catalog-Gen2-CLG-42` can remain complete if the audit confirms the metadata index is queryable and metadata-only, maps existing source/library state, and leaves large bytes in OPFS/Internal Library or visible Local Library mirror files.
- `Catalog-Gen2-HLG-22` can close if all three CLGs above remain complete and the combined shipped read satisfies: explicit user action, legal byte access only, same archive list/preview/select/stage path, OPFS/Internal Library large-byte ownership, Upload ZIP fallback when direct/provider access fails, metadata-only index decision, and Import review as project acceptance owner.
- `Catalog-Gen2-HLG-22` must stay open if the audit finds the shipped stack cannot honestly try direct source-byte materialization, cannot preserve fallback, cannot prove same-path archive handling, makes metadata storage a byte owner, or requires real provider/persistence/UI behavior that is not yet implemented.

Follow-up routing rules:
- Add `Phase 5.1` inside this doc only for a small Gen2-17-local correction or docs/test follow-up, such as missing audit coverage, HLG wording alignment, or a narrow source-options proof that belongs to the direct materialization lane.
- Route persistent IndexedDB metadata storage to a new future phase if Manager wants durable metadata indexing after the pure Phase 4 contract.
- Route SQLite-over-OPFS only to a future phase that first justifies richer relational query needs, migration shape, bundle/worker impact, quota behavior, and no-blob-vault guarantees.
- Route real trusted provider/proxy/native/API integration to a separate provider-infrastructure phase; do not hide it inside closeout.
- Route richer metadata-index UI, Local Downloads surfacing, or source-options redesign to a Catalog UI follow-up.
- Route Import/project acceptance, STEP fidelity, builder behavior, and compatibility verdicts to their owning Import, Builder, or Compatibility phases.
- Route live end-to-end Dropbox/provider proof only if Manager wants a real external integration test surface; do not require it for closing the contract/provider-boundary work unless the shipped HLG wording is changed to require live provider deployment.

Decision read for Manager:
- Closeout result: Phase 5 closes `Catalog-Gen2-HLG-22` because focused tests and build passed, and Phases 1-4 cover truthful direct materialization status, browser attempt integration, trusted provider boundary, OPFS/Internal Library ownership, Upload ZIP fallback, metadata-only indexing, and unchanged Import review project-acceptance ownership.
- Follow-up result: no `Phase 5.1` is needed. Persistent IndexedDB/SQLite storage, real provider deployment, richer metadata UI, live end-to-end provider proof, Import/project behavior, STEP fidelity, builder behavior, compatibility verdicts, eager archive scan, and bulk archive import remain optional future lanes rather than blockers for the current HLG.

Verification result:
- 2026-04-21: `npm.cmd test -- src/app/catalog/pubPartsSourceMaterialization.test.ts src/app/catalog/pubPartsTrustedSourceProvider.test.ts src/app/catalog/pubPartsSourceLibraryMetadataIndex.test.ts` passed, 21 tests across 3 files.
- 2026-04-21: `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "ZIP-inspected PubParts archive source options|browser-honest ZIP download and upload guidance|Internal Library cache|trusted provider"` passed, 8 filtered tests with 44 skipped.
- 2026-04-21: `npm.cmd run build` passed with the existing Vite occt browser-externalized and large-chunk warnings.

### Phase 5 Owns

- audit `Catalog-Gen2-HLG-22` and `Catalog-Gen2-CLG-40` through `Catalog-Gen2-CLG-42`
- compare shipped behavior against direct fetch, provider boundary, fallback, OPFS storage, metadata index, preview, Import handoff, and no-secret/no-bypass requirements
- update Catalog vision/index and Doc-Log
- add `Phase 5.1` or a new family phase if any wishlist item is partial

### Phase 5 Acceptance

- [x] Direct source-byte materialization status is truthful.
- [x] Upload ZIP remains available whenever source bytes cannot be read directly.
- [x] OPFS/Internal Library remains the large-binary owner.
- [x] Metadata indexing does not create hidden project or model ownership.
- [x] Import review remains the project acceptance owner.
- [x] Any remaining gaps are routed to follow-up phases instead of being silently checked off.

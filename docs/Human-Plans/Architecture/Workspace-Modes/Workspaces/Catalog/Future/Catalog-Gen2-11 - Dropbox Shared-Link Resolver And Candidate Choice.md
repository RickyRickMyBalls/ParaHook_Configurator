# Catalog-Gen2-11 - Dropbox Shared-Link Resolver And Candidate Choice

## Doc Header

### Doc History
4. 2026-04-20 23:55:14: Closed `Catalog-Gen2-11 / Phase 3 - Shared-Folder Candidate Listing` as a docs/test source-data audit after Manager denied the fake shared-folder fixture seam, confirming the current cached PubParts corpus has 305 Dropbox source URLs, all 305 are `.zip`, and zero folder-shaped Dropbox records exist; no runtime code was needed, focused cached-source/resolver tests passed, and `npm.cmd run build` passed while keeping real Dropbox shared-folder listing, browser scraping, API/helper/native materialization, archive extraction, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts deferred.
3. 2026-04-20 23:47:52: Closed `Catalog-Gen2-11 / Phase 2 - ZIP And Archive Candidate Inspection` after the shared-link resolver gained a deterministic manifest-backed archive candidate provider for the real `3d Printed Gripples` PubParts ZIP, the source-options dialog began showing archive entry paths, sizes, supported/unsupported states, and metadata-only selection copy, focused resolver/surface tests passed, and `npm.cmd run build` passed while keeping real ZIP parsing, extraction, Import byte staging, shared-folder listing, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts deferred.
2. 2026-04-20 23:43:57: Manager-reviewed the Phase 2 prep and approved the metadata/fixture-backed archive candidate-choice slice, adding the real `3d Printed Gripples` PubParts ZIP manifest as the first deterministic proof target while keeping browser ZIP parsing, extraction, byte materialization, Import review staging from archive members, shared-folder listing, `.stp` support, STEP fidelity, builder behavior, and compatibility verdicts deferred.
1. 2026-04-20 23:35:27: Created this `Catalog-Gen2-11` Family Phase Doc and closed Phase 1 after PubParts `Add To Project` began opening a Catalog-owned source-options dialog, direct supported shared-file links gained a fetch/stage resolver, ZIP/archive links remained visible but non-stageable, focused Catalog/source tests passed, and `npm.cmd run build` passed.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-11`.

Use it to answer:
- how PubParts-owned Dropbox shared links should behave behind `Add To Project`
- how direct shared-file links differ from ZIP/archive or shared-folder links
- how the floating source-options window should stage selected supported files into Import review
- what remains deferred after the first shared-link resolver slice

Do not use it for:
- account-wide Dropbox OAuth browsing
- pretending ZIP/archive or shared-folder contents are known before inspection
- silent native download into the PubParts local library
- STEP loader fidelity
- builder/runtime loading
- compatibility verdicts

## Doc Body

### Family Phase Goal

`Catalog-Gen2-11` should make `Add To Project` work from the PubParts source URL already attached to a Catalog item, without requiring the user to own the Dropbox files.

The first implementation slice is intentionally narrow:
1. User clicks `Add To Project` on a PubParts item page.
2. Catalog stages the source link metadata if it was not already staged.
3. Catalog resolves visible source candidates from the shared link.
4. Catalog opens a floating PubParts source-options window.
5. Direct supported shared files can be selected and staged into Import review with PubParts attribution.
6. ZIP/archive, unsupported, and unknown links remain visible but disabled until later inspection/listing support exists.

This is an upstream staging surface. It does not make a PubParts source file become project content until Import review accepts it.

### Ownership Boundary

Catalog owns:
- the `Add To Project` entry point for PubParts shared-link resolution
- source-link candidate classification for direct file, ZIP/archive, unsupported, and unknown links
- the floating source-options dialog and its selection controls
- forwarding selected supported files into the existing Import staged-review path
- preserving PubParts provider, item, source page, linked archive, and source URL attribution
- honest fallback copy when a link cannot be resolved automatically

Import owns:
- accepted import file types
- staged Import draft behavior
- accepted imported reference/project asset creation
- future `.stp` support if that file type becomes importable

Later Dropbox/API/helper owners own:
- ZIP/archive listing and extraction
- shared-folder listing
- Dropbox API metadata inspection if browser-only URL resolution is insufficient
- native/direct download into the PubParts local library

### Phase Read

`Catalog-Gen2-11 / Phase 1` is complete: `src/app/catalog/pubPartsSharedLinkResolver.ts` classifies PubParts shared source URLs, converts Dropbox direct shared-file links to `dl=1`, fetches supported direct files into Import-staged file objects, and keeps `.stp`, ZIP/archive, unsupported, and unknown links honest as non-stageable candidates when the current Import path or inspection layer cannot handle them.

The Catalog item page now routes PubParts `Add To Project` into a floating `PubParts Source Options` window. The window shows file name, type/status, source URL, selection controls, `Select All Supported`, `Clear Selection`, `Open Source`, and `Stage Selected`. ZIP/archive links remain visible as `Archive Needs Inspection` and disabled for staging.

Phase 1 deliberately did not inspect archive contents, list shared folders, extract files, use a Dropbox API key, silently download into a local library, add `.stp` Import support, change preview behavior, commit project assets directly from Catalog, or add builder/compatibility behavior.

`Catalog-Gen2-11 / Phase 2` is complete: the shared-link resolver now recognizes one trusted metadata manifest for the real `3d Printed Gripples` PubParts ZIP and exposes its supported `.stl` entry plus unsupported `.3mf` and `.pdf` entries in the source-options dialog. Supported archive entries are selectable as metadata-only archive candidates, but `Stage Selected` does not fetch ZIP bytes, parse or extract archives, create object URLs, append Import draft files, or create project assets. Plain ZIP/archive URLs without a trusted manifest still show `Archive Needs Inspection` with no selectable files.

Phase 2 deliberately did not add browser ZIP parsing, extraction, Dropbox API/helper behavior, shared-folder listing, native download, Import byte materialization, `.stp` support, STEP loader fidelity, builder/runtime behavior, or compatibility verdicts.

`Catalog-Gen2-11 / Phase 3` is complete as a docs/test source-data audit: Manager denied the fake shared-folder fixture seam because it would not advance current PubParts source coverage. The current cached PubParts full-part corpus has 305 Dropbox source URLs in `src/app/catalog/pubpartsSourceData/fullParts.ts`; all 305 are `.zip` archive links and zero are folder-shaped Dropbox records. No runtime shared-folder candidate implementation is needed for current Gen2. If PubParts later adds folder-shaped source records, reopen a follow-up phase with real source data and route listing/materialization to a Dropbox API/helper/native owner or a real trusted manifest instead of browser scraping or invented folder contents.

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-15. let Add To Project inspect PubParts-owned Dropbox shared links directly, starting with single shared-file resolution and later widening to ZIP/archive and shared-folder candidate choice, so users do not need to own the Dropbox files before ParaHook can stage supported source files` - complete for the current cached PubParts corpus because all 305 Dropbox source URLs are ZIP links and there are zero shared-folder records; future folder-shaped records must reopen a follow-up phase.

### Codex Level Goals

- [x] Catalog-Gen2-CLG-21. Add a Dropbox shared-link direct-file resolver for PubParts source links that classifies a linked URL, resolves supported direct files when browser fetch permits it, and stages the fetched file through Import with PubParts attribution.
- [x] Catalog-Gen2-CLG-22. Add an inspected candidate-choice lane for PubParts Dropbox ZIP/archive and shared-folder links so ParaHook can list supported files before extraction/import instead of assuming a shared link maps to one importable model. Complete for current PubParts data with ZIP/archive manifest-backed metadata proof and shared-folder source-missing audit; future folder records must reopen listing/materialization work.

### `Catalog-Gen2-11 / Phase 1`

- [x] Add a small PubParts shared-link resolver module.
- [x] Classify direct supported files, `.stp` Import gaps, ZIP/archive links, unsupported links, and unknown links.
- [x] Convert Dropbox direct shared-file links to direct-download URLs where possible.
- [x] Fetch selected supported direct-file candidates into Import-staged file objects.
- [x] Route PubParts item-page `Add To Project` into a floating source-options window.
- [x] Let the user select one, some, or all supported direct candidates before staging.
- [x] Keep ZIP/archive links visible but disabled until inspection support exists.
- [x] Preserve PubParts source attribution into staged Import files.
- [x] Add focused resolver and Catalog surface tests.
- [x] Run focused Catalog/source tests plus `npm.cmd run build`.
- [x] `Catalog-Gen2-HLG-15` partial direct-file slice.
- [x] Catalog-Gen2-CLG-21.

### `Catalog-Gen2-11 / Phase 2`

Status: complete.

Phase 2 decision: do not promise full browser-only ZIP/archive listing yet. The current app has no ZIP/archive parser dependency, Dropbox API owner, server/helper endpoint, native bridge, or Import-owned archive extractor. A Dropbox `.zip` URL can be classified and opened, but ParaHook cannot honestly know the archive entries from the URL, `Content-Type`, or filename alone. Fetching archive bytes in the browser would still require either a new ZIP parser/library, a bespoke central-directory parser, or a helper/API owner before contents can be listed safely.

Manager-approved first implementation slice should therefore be a bounded archive candidate-choice proof:
- [x] Keep plain Dropbox ZIP/archive links classified as `archive-needs-inspection` when there is no trusted manifest or fixture.
- [x] Add an explicit metadata/fixture-backed archive candidate provider seam for known test/dev records only; candidates must come from deterministic manifest data, not filename guesses.
- [x] Seed the first deterministic manifest from the real `3d Printed Gripples` PubParts ZIP currently linked from the cached source record, with `gripple_standard.stl` as a supported archive entry and `gripple_standard.3mf` plus the included PDF instructions as visible unsupported entries.
- [x] Represent manifest-backed archive entries with archive path, file name, extension, supported/unsupported state, optional size, and source attribution.
- [x] Reuse the existing `PubParts Source Options` window to display archive entries beside direct-link candidates.
- [x] Let supported manifest-backed archive entries be selectable only as metadata/candidate choices for a later extraction owner; do not fetch, extract, create object URLs, open Import review, or claim project assets from archive entries in this phase.
- [x] Keep unsupported archive entries visible, disabled, and unselected by default.
- [x] Keep unmanifested, blocked, CORS-failed, oversized, password-protected, or unknown archives routed to `Open Source`, `Import Downloaded Files`, and local-library fallback.
- [x] Preserve Phase 1 direct shared-file behavior unchanged.
- [x] `Catalog-Gen2-HLG-15` archive candidate-choice slice.
- [x] Catalog-Gen2-CLG-22 archive slice.

Ownership boundaries:
- Catalog owns archive URL classification, trusted manifest/fixture candidate normalization, source-options display, candidate selection state, supported/unsupported archive-entry copy, and PubParts attribution.
- Catalog does not own arbitrary ZIP central-directory parsing, ZIP extraction, archive entry byte materialization, object URL creation for archive members, Import review staging from archive bytes, Dropbox API metadata/listing, native download into the PubParts local library, `.stp` Import support, STEP fidelity, builder behavior, or compatibility verdicts.
- Import/helper/native owners must take the later extraction-and-file-materialization lane before selected archive entries can become real `File`/`Blob` objects for Import review.

Likely touched files for the implementation pass:
- `src/app/catalog/pubPartsSharedLinkResolver.ts`
- `src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/ui/CatalogShell.test.tsx`
- `src/app/catalog/ui/catalogShellShared.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/catalog/pubPartsDownloadsStorage.ts` only if Manager wants archive-candidate selections persisted outside the open dialog.

Tests to run:
- `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx src/app/catalog/ui/catalogShellShared.test.ts`
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/catalogActionPlan.test.ts`
- `npm.cmd run build`

Acceptance criteria:
- A normal PubParts Dropbox ZIP URL with no trusted manifest still opens the source-options dialog as `Archive Needs Inspection`, with no selectable stageable file and no Import draft changes.
- A fixture/manifest-backed archive record lists the exact manifest entries in the source-options dialog, including archive paths, file extensions, supported/unsupported states, and file sizes when the manifest provides them.
- Supported manifest-backed archive entries can be selected as archive candidate metadata only, and the UI clearly says extraction/materialization is still required before Import review.
- Unsupported manifest-backed entries remain visible but disabled and are not selected by `Select All Supported`.
- `Stage Selected` does not fetch ZIP bytes, parse ZIP contents, extract files, create object URLs, append Import draft files, or add project assets for archive-entry candidates in Phase 2.
- Existing direct `.step`, `.glb`, `.obj`, and `.stl` shared-file staging behavior and failure statuses remain covered by the Phase 1 tests.

Deferrals:
- real ZIP listing/extraction through JSZip, fflate, a bespoke parser, Dropbox API metadata, server/helper endpoint, or desktop/native bridge
- byte-range/CORS strategy for large Dropbox archives
- password-protected, corrupted, nested, or multi-volume archives
- shared-folder listing, which Phase 3 closed as source-missing for the current cached PubParts corpus and should reopen only if folder-shaped records appear
- `.stp` Import support and STEP loader fidelity
- native direct download into the PubParts local library
- builder/runtime load behavior and compatibility verdicts

### `Catalog-Gen2-11 / Phase 3`

Status: complete as a docs/test source-data audit.

Manager revision:
- [x] Denied the fake shared-folder fixture seam for Phase 3 because the current cached PubParts source data has no folder-shaped Dropbox source records.
- [x] Confirmed `src/app/catalog/pubpartsSourceData/fullParts.ts` contains 305 `dropboxUrl` values.
- [x] Confirmed all 305 current Dropbox source URLs are `.zip` links.
- [x] Confirmed there are zero non-ZIP/folder-shaped Dropbox source URLs in the current cached PubParts corpus.
- [x] Closed Phase 3 with no runtime implementation because a fixture-only folder seam would not advance current-source coverage.
- [x] Preserved the browser-honest future rule: real shared-folder listing needs a Dropbox API/helper/native owner or a real trusted manifest from source data.
- [x] `Catalog-Gen2-HLG-15` current-corpus shared-link closeout.
- [x] Catalog-Gen2-CLG-22 current-corpus ZIP/folder candidate-choice closeout.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts` passed, 13 tests.
- `npm.cmd run build` passed with the existing Vite occt browser-externalization and large chunk warnings.

Acceptance criteria:
- Current cached PubParts corpus proof records 305 Dropbox source URLs, all `.zip`.
- Current cached PubParts corpus proof records zero folder-shaped Dropbox source records.
- No shared-folder fixture provider, fake manifest seam, runtime listing, or UI widening is added for source-missing data.
- `Catalog-Gen2-11` closes under current corpus coverage while keeping future shared-folder records explicitly routed to a follow-up phase.

Deferrals:
- real Dropbox shared-link folder listing through `files/list_folder` or equivalent API
- Dropbox API credentials, OAuth/app-key policy, CORS handling, pagination, and rate-limit behavior
- scraping Dropbox web UI or parsing embedded Dropbox page data
- fake folder fixtures for absent current source records
- member direct-download URL generation and remote byte fetching for folder entries
- native direct download into the PubParts local library
- Import-owned file handle/byte materialization from selected folder entries
- `.stp` Import support and STEP loader fidelity
- ZIP/archive extraction beyond the completed Phase 2 manifest proof
- builder/runtime load behavior and compatibility verdicts

## [x] `Catalog-Gen2-11 / Phase 1` - `Dropbox Shared Direct File Resolver`

### Phase 1 Summary

Phase 1 is complete.

### Phase 1 Implementation Spec

Status: complete.

Closeout:
- PubParts `Add To Project` now opens the Catalog-owned source-options dialog instead of requiring a user Dropbox key.
- Direct supported `.step`, `.glb`, `.obj`, and `.stl` shared links can be staged into Import review with PubParts attribution when browser fetch succeeds.
- `.stp` is recognized but remains non-stageable until Import supports it.
- ZIP/archive links show `Archive Needs Inspection` and remain disabled for staging.
- The source-options dialog supports selecting supported candidates, selecting all supported candidates, clearing selection, opening the source, closing the dialog, and staging selected supported files.
- The implementation keeps Catalog as the upstream source/candidate surface and Import as the accepted-file/project-asset owner.

Verification:
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `npm.cmd run build`

## [x] `Catalog-Gen2-11 / Phase 2` - `ZIP And Archive Candidate Inspection`

### Phase 2 Summary

Phase 2 is complete.

### Phase 2 Implementation Spec

Status: complete.

Closeout:
- The resolver now has a deterministic manifest-backed archive candidate provider for known PubParts archive URLs.
- The first manifest is the real `3d Printed Gripples` Dropbox ZIP and includes `gripple_standard.stl` as a supported metadata candidate, plus `gripple_standard.3mf` and `598759-standard-gripples-for-onewheel-b51d2e2c-59bb-4ccf-bef0-14adeac089fb.pdf` as unsupported visible entries.
- Manifest-backed archive entries show file name, archive path, file type/support state, file size when known, and source URL context in the source-options dialog.
- Unsupported archive entries are disabled and unselected.
- Supported archive entries are selectable only as metadata; selecting and pressing `Stage Selected` reports that extraction/materialization is still required and does not open Import review.
- Plain ZIP/archive URLs without a trusted manifest still show `Archive Needs Inspection` and no selectable file.
- Phase 1 direct shared-file fetch/stage behavior remains unchanged.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

## [x] `Catalog-Gen2-11 / Phase 3` - `Shared-Folder Candidate Listing`

### Phase 3 Summary

Phase 3 is complete as a docs/test source-data audit.

### Phase 3 Implementation Spec

Status: complete.

Manager revision:
- The previously prepped fake folder fixture seam is denied.
- The current cached PubParts part corpus has no shared-folder Dropbox source records, so a fake fixture would not improve current-source coverage.

Closeout:
- `src/app/catalog/pubpartsSourceData/fullParts.ts` contains 305 `dropboxUrl` values.
- All 305 current Dropbox source URLs are `.zip` links.
- The current cached PubParts corpus has zero folder-shaped Dropbox source records.
- No runtime implementation is needed for Gen2 current-corpus completion.
- Future folder-shaped PubParts records should reopen a follow-up phase with real source data, likely requiring a Dropbox API/helper/native owner or a real trusted manifest.
- No Dropbox API, browser scraping, folder listing, folder member download, Import byte materialization, native download, `.stp` support, STEP fidelity, builder behavior, or compatibility verdicts shipped in Phase 3.

Verification:
- `npm.cmd test -- src/app/catalog/pubPartsCachedSource.test.ts src/app/catalog/pubPartsSharedLinkResolver.test.ts`
- `npm.cmd run build`

Dispatch next:
- none for `Catalog-Gen2-11` under the current cached PubParts corpus; reopen only if PubParts adds folder-shaped Dropbox source records or Manager routes real archive extraction/listing to a later owner.

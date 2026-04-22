# Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview

## Doc Header

### Doc History
5. 2026-04-21 15:21:03: Implemented `Catalog-Gen2-16 / Phase 3 - Preview Cleanup And No Auto Import Proof`, closing the lane after focused tests proved ZIP entry preview object URLs are revoked on preview switch, source-options close, local ZIP replacement, and CatalogSurface unmount; extraction failures surface as preview errors; and preview remains preview-only with no row selection, Import review staging, staged-file append, project-reference commit, Dropbox fetch, OPFS write, builder behavior, or compatibility verdict.
4. 2026-04-21 15:15:23: Implemented `Catalog-Gen2-16 / Phase 2.1 - Preview Object URL Ready-State Guard` after Manager review found the successful preview path used a synchronous `didApplyPreview` flag inside a React state updater; the preview success path now checks the latest source-options dialog ref before creating an object URL, sets ready state directly from the current dialog, and proves a successful uploaded ZIP preview URL is not revoked immediately while the preview remains ready.
3. 2026-04-21 15:09:51: Implemented `Catalog-Gen2-16 / Phase 2 - Source Options Uploaded ZIP Entry Preview` with a real source-options `Preview 3D` action for supported uploaded or OPFS-cached PubParts ZIP entries, one-entry extraction from the current dialog archive bytes, object URL preview through `CatalogCardPreviewViewport`, idle/loading/ready/error/unavailable source-options reads, focused uploaded/cache-hit/metadata-only tests, and build verification while preserving Import review, project reference, remote fetch, OPFS write, builder, and compatibility boundaries.
2. 2026-04-21 14:57:20: Implemented `Catalog-Gen2-16 / Phase 1 - Preview Candidate Contract And Source Options State` with a pure `pubPartsZipEntryPreview` helper and focused tests for supported uploaded/cached ZIP entry preview states, metadata-only/no-byte/stale-byte disabled reads, unsupported/unsafe/directory/blocked entries, direct/non-archive candidates, and stable archive path/selectable requirements while keeping dialog rendering, extraction, object URLs, Import review, OPFS writes, remote fetch, project commits, builder behavior, and compatibility behavior unchanged.
1. 2026-04-21 14:52:29: Created `Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview` to route the next PubParts staged importer preview lane into source-options first, with a preview candidate contract, one-entry uploaded/cached ZIP preview rendering, object URL cleanup proof, and no Import/project/builder/compatibility behavior.

### Purpose

This doc prepares the Catalog Gen2 lane for previewing one supported `3D` entry from an uploaded or OPFS-cached PubParts ZIP before the user stages anything into Import review.

The lane exists because `Catalog-Gen2-13` made the staged ZIP importer honest and `Catalog-Gen2-15` made user-actioned archive bytes reusable through the Internal Library. The remaining user value is a direct preview action for a selected supported ZIP entry while the user is still deciding what to stage.

### Scope

This doc covers:
- source-options preview candidate state for uploaded or cached PubParts ZIP entries
- explicit one-entry `3D` preview action/toggle in the staged importer flow
- preview extraction/materialization from current dialog archive bytes or same-source-version OPFS archive cache bytes
- reuse of `CatalogCardPreviewViewport` and `loadReferenceAssetObject` where possible
- object URL lifecycle cleanup
- tests proving preview does not stage Import review or commit project assets

This doc does not cover:
- item-page preview as the first surface
- multiple simultaneous ZIP entry previews
- silent fetch of blocked Dropbox bytes
- Local Library folder mirror behavior
- ZIP/source resolver rewrites
- Import accept changes
- accepted project asset creation
- builder/load-as-starting-configuration behavior
- compatibility verdicts
- STEP loader fidelity or new `.stp` support

## Doc Body

### Recommendation

Start with source-options preview, not item-page preview.

The source-options dialog already has the exact staged archive entry rows, selected candidate state, support-state copy, and current archive bytes after either `Upload ZIP` or an OPFS Internal Library cache hit. The item page is still the right place for source/image metadata and broad item actions, but it does not know which uploaded ZIP entry the user is considering.

### Current Live Read

`src/app/workspace/CatalogSurface.tsx` owns the source-options dialog state. The current state includes the staged record, candidate list, selected candidate ids, status message, inspecting/staging flags, and Phase 2 archive byte inputs: `archiveBlob`, `archiveBlobSourceUrl`, and `archiveBlobStagedSourceId`. The Phase 2 OPFS reopen path hydrates `archiveBlob` on a valid same-source-version cache hit, so uploaded and cached ZIPs can share the same preview-byte input.

`src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` renders staged ZIP entries with archive path, file name, type, size, support state, preview-state text, blocked reason, and selected state. Today the preview-state text says supported entries are previewable only after staging into Import review; Gen2-16 should replace that with an explicit preview action only when bytes are present.

`src/app/catalog/ui/CatalogCardPreviewViewport.tsx` accepts `previewSource: { fileType, objectUrl }`, loads it through `loadReferenceAssetObject`, and cleans up Three.js renderer/object resources. It does not revoke caller-owned object URLs. Gen2-16 should reuse this component by widening `surfaceKind` or adding a source-options presentation path if needed.

`src/app/catalog/ui/CatalogShellItemPage.tsx` is not the first surface. Its preview session is item-level and image/default-preview oriented, while uploaded ZIP entry preview is a staged importer decision after a specific archive byte grant.

`src/app/catalog/pubPartsZipArchive.ts` already exposes entry listing and extraction helpers. The preview lane should materialize only the selected supported entry for preview, not use the Import-oriented staging path as a side effect.

Existing tests live mostly in `src/app/workspace/CatalogSurface.test.tsx` and catalog UI tests. The focused preview tests should remain targeted because broader workspace click-through is not needed for this ownership proof.

### Byte Ownership Rule

Preview bytes may come from:
- the current source-options `archiveBlob` after a user uploads/chooses a ZIP
- the current source-options `archiveBlob` hydrated from a valid same-source-version OPFS Internal Library archive cache hit

Preview bytes must not come from:
- metadata-only localStorage archive manifest cache records
- stale OPFS archive records whose source identity, source URL, or freshness does not match
- blocked Dropbox bytes fetched silently only for preview
- unsupported or unsafe ZIP entries

### Supported Preview Types

The first preview lane supports only the renderable formats already routed through the current preview/import path:
- `step`
- `stl`
- `obj`
- `glb`

Keep `.stp` and STEP fidelity truthful. If the current preview loader cannot honestly preview a specific STEP-shaped entry, the UI should show a preview error/unavailable state rather than widening loader claims.

### User-Visible Behavior

Image/source metadata remains the default Catalog and source-options context. The user sees ZIP entry rows after upload/cache inspection as they do today.

For a supported entry with real archive bytes available, source options offers an explicit `Preview 3D` action or equivalent one-entry preview toggle. Activating it extracts only that entry into a preview-only blob, creates an object URL, and renders it through the Catalog preview viewport inside the source-options dialog.

Changing preview entry, closing source options, uploading a different ZIP, or unmounting `CatalogSurface` revokes any previous preview object URL.

Previewing an entry does not select it, stage it, open Import review, commit project assets, change builder state, or produce compatibility verdicts.

### Out Of Scope

- `CatalogSurface` source-options fetch/materialization policy changes
- `pubPartsSharedLinkResolver` Dropbox behavior changes
- OPFS write/cache changes
- Local Library folder mirror
- Home Page storage UI
- Import review accept/commit changes
- `ViewerHost` rehydration changes
- builder/load-as-starting-config
- compatibility verdicts
- broad AppShell/workspace UI click-through tests

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-21. let users preview one supported 3D entry from an uploaded or cached PubParts ZIP inside source options before staging it into Import review, using only user-granted or app-cached archive bytes and without auto-importing or creating project assets`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-38. Add a source-options ZIP entry preview contract that identifies one selected supported uploaded or cached archive entry, materializes only that entry for preview, renders it through the existing Catalog preview viewport/reference loader path where possible, and never stages Import review or creates project assets.
- [x] Catalog-Gen2-CLG-39. Prove uploaded/cached ZIP entry preview cleanup and boundary behavior, including object URL revocation, disabled states for metadata-only or stale/no-byte cache records, unsupported-entry blocking, no silent blocked-Dropbox fetch, and no auto-import/project commit.

### `Catalog-Gen2-16 / Phase 1`

- [x] define the preview candidate contract and source-options state shape
- [x] decide the smallest UI prop widening needed for `CatalogCardPreviewViewport` source-options reuse - no UI prop widening was needed in Phase 1 because the contract stayed pure
- [x] prove supported versus unsupported preview candidate detection
- [x] prove metadata-only/no-archive-byte candidates cannot preview
- [x] keep source-options rendering, Import review staging, OPFS writes, and project acceptance unchanged

### `Catalog-Gen2-16 / Phase 2`

- [x] add the source-options `Preview 3D` action or toggle for one supported uploaded/cached ZIP entry
- [x] extract only the chosen entry from `archiveBlob` for preview
- [x] create a preview object URL and pass it to `CatalogCardPreviewViewport`
- [x] show loading, success, unavailable, and error states in the source-options dialog
- [x] prove uploaded ZIP and OPFS cache-hit bytes preview without remote fetch

### `Catalog-Gen2-16 / Phase 3`

- [x] revoke preview object URLs on preview switch, dialog close, ZIP replacement, and unmount
- [x] prove preview does not open Import review, append staged import files, commit project references, or select/stage entries
- [x] prove unsupported, stale, metadata-only, and no-byte states remain disabled
- [x] close the lane with focused verification and docs audit

## [x] `Catalog-Gen2-16 / Phase 1` - `Preview Candidate Contract And Source Options State`

### Phase 1 Status

Implemented for Manager review.

### Phase 1 Goal

Create the smallest implementation-ready preview contract so the UI can identify whether a staged ZIP entry can be previewed from the current source-options bytes without changing existing source-options staging behavior.

### Phase 1 Likely Files

- `src/app/catalog/pubPartsZipEntryPreview.ts` - added
- `src/app/catalog/pubPartsZipEntryPreview.test.ts` - added
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.test.tsx`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Phase 1 did not need to touch `CatalogShellSourceOptionsDialog.tsx`, `CatalogShellSourceOptionsDialog.test.tsx`, `CatalogSurface.tsx`, or `CatalogSurface.test.tsx` because no display-only preview row state was wired yet.

### Phase 1 Exact Code Cut

Add a pure preview-candidate helper that can answer:
- candidate id
- archive path
- display file name
- normalized file type
- whether the entry is supported by the current preview path
- whether current source-options bytes are available
- why preview is unavailable when it is disabled

The helper should accept the current staged candidate metadata plus a byte-availability read derived from source-options state. It should not extract ZIP entries, create object URLs, render previews, write OPFS bytes, stage Import review, or fetch remote URLs.

If the dialog needs prop changes in Phase 1, keep them display-only: render a stable disabled/enabled preview-action state and copy, but do not make the action perform preview materialization until Phase 2.

### Phase 1 Implementation Notes

Added `resolvePubPartsZipEntryPreviewActionState` and `resolvePubPartsZipEntryPreviewActionStates` in `src/app/catalog/pubPartsZipEntryPreview.ts`.

The helper returns a UI-ready action state for PubParts source-options candidates:
- `canPreview: true` only for `supported-archive-entry` candidates with stable archive path, selectable state, supported preview file type, supported archive classification, and current archive bytes
- `metadata-only`, `no-archive-bytes`, and `stale-archive-bytes` disabled states for supported entries without current bytes
- disabled reason codes for unsupported, unsafe, directory, blocked, unselectable, missing-path, direct-file, and non-archive-entry candidates

No dialog props or rendering changed in Phase 1. That keeps `CatalogCardPreviewViewport` source-options reuse, extraction, object URL lifecycle, and actual preview UI in Phase 2/3.

### Phase 1 Focused Tests

Preferred targeted tests:
- [x] `identifies previewable supported uploaded ZIP entries in source options`
- [x] `disables ZIP entry preview when source options only has metadata cache entries`
- [x] `keeps unsupported ZIP entries out of source-options 3D preview`

Optional UI seam test if the prop cut reaches the dialog:
- [ ] `renders preview action state for staged ZIP entries without changing selection` - not added because Phase 1 did not touch dialog rendering

### Phase 1 Verification Commands

```powershell
npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts
npm.cmd test -- src/app/catalog/ui/CatalogShellSourceOptionsDialog.test.tsx -t "preview action state|3D preview"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "source options|ZIP entry preview"
npm.cmd run build
```

Actual Phase 1 verification:
- `npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts` passed: 5 passed.
- `npm.cmd run build` passed.

No focused dialog or `CatalogSurface` test was added or run because Phase 1 did not touch UI rendering or source-options behavior.

### Phase 1 Acceptance

- [x] A supported `step`, `stl`, `obj`, or `glb` staged ZIP entry can be identified as previewable only when the current source-options dialog has archive bytes.
- [x] Metadata-only localStorage manifest cache reads do not become previewable.
- [x] Unsupported entries remain unpreviewable with clear reason data.
- [x] Existing upload, cache reopen, selection, and `Stage Selected to Import Review` behavior is unchanged.
- [x] No object URLs are created yet.

## [x] `Catalog-Gen2-16 / Phase 2` - `Source Options Uploaded ZIP Entry Preview`

### Phase 2 Status

Implemented for Manager review.

### Phase 2 Goal

Render a real source-options preview action/surface for one supported uploaded or OPFS-cached ZIP entry.

### Phase 2 Likely Files

- `src/app/workspace/CatalogSurface.tsx` - updated
- `src/app/workspace/CatalogSurface.test.tsx` - updated
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` - updated
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.test.tsx` - not needed; covered through `CatalogSurface` source-options behavior
- `src/app/catalog/ui/CatalogCardPreviewViewport.tsx` - updated
- `src/app/theme/surfaces/catalog.css` - updated
- `src/app/catalog/pubPartsZipEntryPreview.ts`
- `src/app/catalog/pubPartsZipEntryPreview.test.ts` - rerun
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview.md` - updated
- `docs/CHANGELOG.md` - updated
- `docs/Doc-Log.md` - updated

### Phase 2 Exact Code Cut

Add one-entry preview state to `CatalogSurface` source-options state:
- candidate id
- status: idle/loading/ready/error/unavailable
- file type
- object URL when ready
- error/unavailable copy

Use `extractPubPartsZipArchiveEntries` or a thin helper over it to extract only the requested archive path from the current `archiveBlob`. Create an object URL for the extracted entry and render it through `CatalogCardPreviewViewport`.

Extend `CatalogCardPreviewViewport` only as needed to support a source-options surface. Do not create a separate Three.js viewer unless reuse proves impossible.

### Phase 2 Implementation Notes

`CatalogSurface` now owns one source-options ZIP entry preview session. It derives per-row action state from the Phase 1 helper, extracts only the chosen normalized archive path from the current dialog `archiveBlob`, creates a caller-owned object URL, and passes `{ fileType, objectUrl }` into the existing `CatalogCardPreviewViewport` with a source-options surface kind.

The preview action is available only when the current dialog has fresh archive bytes from a local upload or same-source-version Internal Library archive cache hit. Metadata-only localStorage manifest rows remain visible but disabled for preview.

The source-options dialog now shows row-level `Preview 3D` buttons plus a single preview panel with idle, loading, ready, and error copy. Unavailable states are represented by disabled row action state and explicit preview text.

Phase 2 includes basic object URL ownership hygiene: the previous preview URL is revoked when previewing another candidate, choosing/replacing the local archive, closing source options, or unmounting `CatalogSurface`. Phase 3 remains the cleanup proof matrix and no-auto-import audit.

### Phase 2.1 Correction

Manager review found the initial Phase 2 success path used a synchronous `didApplyPreview` flag inside a React state updater, then revoked the newly created preview object URL if that flag was still false. Because React state updater execution should not be treated as a synchronous commit signal, this could revoke a URL intended for the ready preview.

Phase 2.1 replaced that pattern with a current-dialog ref:
- `CatalogSurface` keeps `pubPartsSourceOptionsDialogRef` synchronized with the source-options dialog setter.
- after ZIP extraction completes, preview code checks the current dialog, staged source id, archive blob, and loading candidate before creating an object URL
- stale extraction completions return without creating an object URL
- current completions create the object URL, store it as the owned preview URL, and set ready preview state directly from the current dialog

Focused regression coverage now asserts a successful uploaded ZIP preview object URL is not revoked immediately while the ready preview is visible.

### Phase 2 Focused Tests

Preferred targeted tests:
- [x] `previews one supported ZIP entry from an uploaded PubParts ZIP without staging Import review`
- [x] `does not immediately revoke a successful uploaded ZIP entry preview object URL while ready`
- [x] `previews one supported ZIP entry from an Internal Library cache hit without fetching Dropbox`
- [x] `keeps metadata-only ZIP manifest rows unavailable for ZIP entry preview`
- [ ] `surfaces a preview error when the selected ZIP entry cannot be extracted` - left for Phase 3 cleanup/error proof matrix because Phase 2 already covers the required happy paths plus metadata-only unavailable state

### Phase 2 Verification Commands

```powershell
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "uploaded PubParts ZIP without staging Import review"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Internal Library cache hit without fetching Dropbox"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "metadata-only ZIP manifest rows unavailable"
npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts
npm.cmd run build
```

Actual Phase 2 verification:
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not reopen source options"` passed: 1 passed, 38 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "uploaded PubParts ZIP without staging Import review"` passed: 1 passed, 38 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not immediately revoke"` passed: 1 passed, 39 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Internal Library cache hit without fetching Dropbox"` passed: 1 passed, 38 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "metadata-only ZIP manifest rows unavailable"` passed: 1 passed, 38 skipped. The test logs the expected OPFS-unavailable warning from the non-OPFS metadata-cache setup while proving preview remains disabled.
- `npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts` passed: 5 passed.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` browser-compatibility and chunk-size warnings.

### Phase 2 Acceptance

- [x] The source-options dialog exposes a clear preview action for a supported ZIP entry only when archive bytes are available.
- [x] Uploaded ZIP bytes and valid OPFS cache-hit archive bytes both work.
- [x] Preview materialization extracts only the requested entry.
- [x] The preview renders through the existing Catalog preview viewport/reference loader path where possible.
- [x] Preview does not stage Import review, append staged files, commit project references, mutate builder state, or fetch blocked Dropbox bytes.

## [x] `Catalog-Gen2-16 / Phase 3` - `Preview Cleanup And No Auto Import Proof`

### Phase 3 Status

Implemented for Manager review. `Catalog-Gen2-16`, `Catalog-Gen2-HLG-21`, `Catalog-Gen2-CLG-38`, and `Catalog-Gen2-CLG-39` are complete under the source-options-first scope.

### Phase 3 Goal

Prove the preview-only lifecycle is clean and cannot leak object URLs or become an accidental import/project acceptance path.

### Phase 3 Likely Files

- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.test.tsx`
- `src/app/catalog/pubPartsZipEntryPreview.test.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-16 - Uploaded ZIP Entry 3D Preview.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

### Phase 3 Exact Code Cut

Audit and harden preview cleanup paths:
- revoke the previous preview object URL when previewing a different candidate
- revoke on source-options close
- revoke when a different ZIP is uploaded
- revoke on `CatalogSurface` unmount
- clear preview state when the staged source id changes

Add focused tests that spy on `URL.createObjectURL` and `URL.revokeObjectURL`, plus Import/store action mocks, to prove preview remains preview-only.

### Phase 3 Implementation Notes

No new feature behavior was needed beyond the Phase 2/2.1 preview implementation. Phase 3 added focused regression coverage around the existing cleanup paths and preview-only boundaries.

The proven cleanup paths are:
- previewing another ZIP entry revokes the previous preview object URL and keeps the new one live
- closing source options revokes the ready preview object URL
- uploading/replacing the local ZIP revokes the ready preview URL, clears the ready state, and returns the preview panel to idle
- unmounting `CatalogSurface` revokes the ready preview URL
- stale or mismatched archive cache entries surface a preview error without creating an object URL

The proven preview-only boundaries are:
- preview can run with the row unselected
- preview does not select rows or enable `Stage Selected`
- preview does not open Import review, append staged files, or commit project references
- preview does not fetch Dropbox bytes silently
- preview does not write OPFS bytes
- builder/load-as-starting-config and compatibility verdicts stay untouched because the preview path only extracts one current archive entry into a temporary object URL for `CatalogCardPreviewViewport`

### Phase 3 Focused Tests

Preferred targeted tests:
- [x] `revokes ZIP entry preview object URLs when the preview selection changes`
- [x] `revokes ZIP entry preview object URLs when source options closes`
- [x] `clears and revokes ZIP entry preview when a different local ZIP replaces the archive blob`
- [x] `revokes ZIP entry preview object URLs when CatalogSurface unmounts`
- [x] `surfaces a ZIP entry preview error when selected entry extraction fails`
- [x] `previews a ZIP entry without selecting rows, staging Import review, or writing OPFS`
- [x] `previews one supported ZIP entry from an uploaded PubParts ZIP without staging Import review`
- [x] `previews one supported ZIP entry from an Internal Library cache hit without fetching Dropbox`
- [x] `keeps metadata-only ZIP manifest rows unavailable for ZIP entry preview`

### Phase 3 Verification Commands

```powershell
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "revokes ZIP entry preview object URLs"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not open Import review"
npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not commit project references"
npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts
npm.cmd run build
```

Actual Phase 3 verification:
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "preview selection changes"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "source options closes"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "different local ZIP replaces"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "CatalogSurface unmounts"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "selected entry extraction fails"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "without selecting rows"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "uploaded PubParts ZIP without staging Import review"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "does not immediately revoke"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "Internal Library cache hit without fetching Dropbox"` passed: 1 passed, 45 skipped.
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx -t "metadata-only ZIP manifest rows unavailable"` passed: 1 passed, 45 skipped. The test logs the expected OPFS-unavailable warning from the non-OPFS metadata-cache setup while proving preview remains disabled.
- `npm.cmd test -- src/app/catalog/pubPartsZipEntryPreview.test.ts` passed: 5 passed.
- `npm.cmd run build` passed with the existing Vite `occt-import-js` browser-compatibility and chunk-size warnings.

### Phase 3 Acceptance

- [x] Object URLs created for ZIP entry preview are revoked on every ownership transition.
- [x] Preview state cannot outlive the source-options dialog or staged source id it belongs to.
- [x] Preview does not select entries, stage Import review, append staged files, commit project assets, trigger builder behavior, or produce compatibility verdicts.
- [x] The lane can close without claiming a full item-page preview or broad workspace click-through harness.

### Gen2-16 Closeout Read

`Catalog-Gen2-16` is complete for the source-options-first lane. Users can preview one supported `step`, `stl`, `obj`, or `glb` entry from uploaded or same-source-version OPFS-cached PubParts ZIP bytes before staging files into Import review. Preview uses the existing Catalog preview viewport/reference asset loader path, owns temporary object URL cleanup, keeps metadata-only/no-byte/stale/unsupported rows disabled, and remains preview-only.

Not claimed: item-page ZIP entry preview, multiple simultaneous ZIP previews, Local Library mirror, Dropbox helper/API or proxy behavior, STEP fidelity expansion, builder/load-as-starting-config, compatibility verdicts, auto-import, or broad workspace click-through harness.

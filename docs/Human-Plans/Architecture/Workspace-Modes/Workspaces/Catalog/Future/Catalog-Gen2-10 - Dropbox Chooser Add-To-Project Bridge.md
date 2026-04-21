# Catalog-Gen2-10 - Dropbox Chooser Add-To-Project Bridge

## Doc Header

### Doc History
2. 2026-04-20 23:01:58: Closed `Catalog-Gen2-10` after the typed Dropbox Chooser adapter, PubParts item-page `Add To Project` bridge, direct temporary-link fetch, staged Import review handoff with PubParts attribution, visible chooser unavailable/canceled/unsupported/fetch-failed states, local fallback controls, focused tests, and build verification shipped without taking on full Dropbox shared-link API inspection, folder listing, archive extraction, native download, STEP fidelity, builder behavior, or compatibility verdicts.
1. 2026-04-20 22:16:38: Created this `Catalog-Gen2-10` Family Phase Doc to plan Dropbox Chooser as the first direct Dropbox `Add To Project` bridge for PubParts items, keeping user file selection explicit while deferring the heavier Dropbox shared-link API inspector, folder listing, archive extraction, native direct download, STEP fidelity, builder behavior, and compatibility verdicts.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-10`.

Use it to answer:
- how Dropbox Chooser should fit behind PubParts `Add To Project`
- where the Dropbox integration seam should live
- how selected Dropbox files should become Import-staged files
- what failure/fallback states must stay visible
- which Dropbox API/shared-link/archive behavior stays deferred

Do not use it for:
- full Dropbox shared-link API inspection
- Dropbox folder listing from arbitrary shared links
- Dropbox ZIP extraction or archive content listing
- native direct download into a local PubParts library folder
- STEP loader fidelity
- builder/runtime loading
- compatibility verdicts

## Doc Body

### Family Phase Goal

`Catalog-Gen2-10` should make `Add To Project` feel more direct for PubParts Dropbox-backed items without overclaiming browser or Dropbox ownership.

The first recommended path is Dropbox Chooser:
1. User clicks `Add To Project` on an eligible PubParts item.
2. ParaHook opens Dropbox Chooser.
3. User selects the exact supported file.
4. ParaHook receives the direct temporary link from Chooser.
5. ParaHook fetches that selected file into a local `Blob`/`File`.
6. Import stages the file through the existing staged Import review path with PubParts attribution.

This avoids manual Downloads-folder hunting for files the user can select through Dropbox.

### Ownership Boundary

Catalog owns:
- deciding whether a PubParts item is eligible for the Dropbox Chooser bridge
- the visible `Add To Project` entry point
- user-facing chooser/loading/canceled/unsupported/failure/fallback status
- passing PubParts/Catalog attribution into the Import handoff
- keeping local-library fallback visible when Chooser is unavailable or fails

The Dropbox bridge owner seam owns:
- loading the Dropbox Chooser script
- detecting Chooser availability
- opening the Chooser with supported extension filtering where the API allows
- normalizing Chooser-selected file metadata
- fetching the selected direct temporary link into a file-like object

Import owns:
- staged Import draft creation
- accepted file type validation
- preview/import review
- accepted imported reference/project asset creation
- source attribution preservation after staging

Later owners own:
- full Dropbox shared-link API inspection
- Dropbox OAuth/account browsing beyond Chooser needs
- Dropbox shared-folder listing
- ZIP/shared-folder extraction
- native/direct download into the PubParts local library
- STEP loader fidelity

### Dropbox Chooser Direction

The first implementation should use a small typed adapter instead of putting Dropbox globals directly into Catalog components.

Expected adapter shape can be refined during implementation, but should roughly cover:
- `isDropboxChooserAvailable()`
- `openDropboxChooser(options)`
- selected file metadata with file name, size, extension, direct link, and source label
- fetch helper that returns a `File` or `Blob` plus metadata

The first supported extension set should match the current Catalog/Import handoff surface:
- `.step`
- `.stp`
- `.glb`
- `.obj`
- `.stl`

If `.stp` is still not fully accepted by the current Import path during implementation, keep it visible as selected-source metadata and route actual Import support to the owning Import phase instead of pretending it imported.

### Add To Project UX

The visible action should remain `Add To Project`.

The status beside it should say what is happening:
- `Choose Dropbox File`
- `Fetching Selected File`
- `Unsupported Dropbox File`
- `Chooser Canceled`
- `Dropbox Chooser Unavailable`
- `Ready For Import Review`
- `Use Local Library Fallback`

The user should not see multiple competing primary process buttons for Dropbox versus local library. Chooser should be one route behind the single action resolver, with the existing local-library/manual file picker route as fallback.

### Acceptance Read

This family phase is complete when:
- the Catalog vision/index and implementation agree that Dropbox Chooser is the first direct Dropbox bridge
- a typed Dropbox Chooser owner seam exists
- PubParts item-page `Add To Project` can route eligible entries into Chooser
- supported selected files can be fetched from Chooser's direct temporary link into a file-like object
- fetched files can enter the staged Import review path with PubParts attribution
- unsupported, canceled, unavailable, and fetch-failed states remain visible and recoverable
- local-library/manual file picker fallback remains available
- focused Catalog/Import tests and `npm.cmd run build` pass
- no full shared-link API inspector, folder listing, archive extraction, native downloader, STEP loader fidelity, builder behavior, or compatibility verdict ships by accident

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-14. let Add To Project use Dropbox Chooser as the first direct Dropbox bridge so the user can pick an exact supported source file and ParaHook can fetch/stage it with PubParts attribution without requiring manual Downloads-folder hunting`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-20. Add a Dropbox Chooser bridge behind the PubParts `Add To Project` flow that loads the Chooser script safely, lets the user select only supported source files, fetches the returned direct temporary link, and stages the resulting file through Import with PubParts attribution.

### `Catalog-Gen2-10 / Phase 1`

- [x] Define the Dropbox Chooser owner seam and supported-file contract.
- [x] Decide where the script-loading adapter should live.
- [x] Define chooser unavailable/canceled/unsupported/fetch-failed states.
- [x] Confirm the Import staged-file handoff shape for fetched remote blobs.
- [x] Keep full Dropbox shared-link API inspection out of scope.
- [x] `Catalog-Gen2-HLG-14`
- [x] Catalog-Gen2-CLG-20 boundary slice.

### `Catalog-Gen2-10 / Phase 2`

- [x] Implement the Dropbox Chooser adapter.
- [x] Add focused adapter tests for availability, selection normalization, supported extension checks, and fallback state.
- [x] Keep Dropbox globals behind the adapter.
- [x] Keep archive/folder listing out of scope.
- [x] `Catalog-Gen2-HLG-14`
- [x] Catalog-Gen2-CLG-20 adapter slice.

### `Catalog-Gen2-10 / Phase 3`

- [x] Route eligible PubParts `Add To Project` actions into Dropbox Chooser.
- [x] Fetch selected direct temporary links into file-like objects.
- [x] Stage selected files through Import with PubParts attribution.
- [x] Preserve local-library/manual import fallback.
- [x] Add focused CatalogSurface/Import handoff tests.
- [x] `Catalog-Gen2-HLG-14`
- [x] Catalog-Gen2-CLG-20 Add-To-Project bridge slice.

### `Catalog-Gen2-10 / Phase 4`

- [x] Audit whether Chooser satisfies the first direct Dropbox goal.
- [x] Route full Dropbox shared-link API inspection, folder listing, archive extraction, and native direct download to later owners.
- [x] Run focused tests plus `npm.cmd run build`.
- [x] `Catalog-Gen2-HLG-14`
- [x] Catalog-Gen2-CLG-20 closeout slice.

## [x] `Catalog-Gen2-10 / Phase 1` - `Dropbox Chooser Bridge Boundary`

### Phase 1 Summary

Phase 1 is complete inside the shipped `Catalog-Gen2-10` implementation.

### Phase 1 Implementation Spec

Status: complete.

Closeout:
- the adapter lives in `src/app/catalog/dropboxChooserBridge.ts`
- selected Chooser files normalize to typed metadata with `.step`, `.stp`, `.glb`, `.obj`, and `.stl` support
- `.stp` remains visible as selected source metadata but does not stage through the current Import reference path until the Import family owns that type
- direct links are fetched only after explicit user selection
- fetched `.step`, `.glb`, `.obj`, and `.stl` files enter the existing staged Import review path with PubParts attribution
- PubParts item pages expose `Add To Project` for the Chooser bridge and keep local-library/manual fallback controls visible
- chooser unavailable, canceled, unsupported, fetch-failed, ready-for-review, and Import-type-gap states have stable item-page status reads
- no shared-link API inspector, archive listing, native direct download, builder behavior, or compatibility verdict shipped

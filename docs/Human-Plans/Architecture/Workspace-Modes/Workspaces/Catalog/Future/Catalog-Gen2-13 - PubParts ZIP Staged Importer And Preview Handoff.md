# Catalog-Gen2-13 - PubParts ZIP Staged Importer And Preview Handoff

## Doc Header

### Doc History
9. 2026-04-21 10:50:24: Manager-closed `Catalog-Gen2-13` after scoped Catalog/Import handoff proof passed: `CatalogSurface.test.tsx` passed all 29 tests, targeted BrowserPanel staged Import review/preview coverage passed, targeted useAppStore staged-import attribution/commit coverage passed, and production build had already passed; recorded broader full-suite BrowserPanel staged Import structure/status failures and useAppStore graph/project-output failures as existing non-Catalog owner issues rather than blockers for the PubParts ZIP staged importer.
8. 2026-04-21 10:44:38: Implemented the approved `Catalog-Gen2-13 / Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` label/status polish by renaming the PubParts ZIP source-options final action to `Stage Selected to Import Review`, adding the `Staging to Import Review...` busy label, updating the staging status to say selected files are staging to Import review, and preserving the existing `openStagedImportDraft({})` plus `appendStagedImportDraftFiles(files)` handoff without calling `commitStagedImportDraft` from Catalog; focused Catalog surface coverage passed and production build passed, but the requested broader audit command still fails in existing BrowserPanel staged-structure/status expectations and useAppStore graph/project-output expectations, so `Catalog-Gen2-13` should remain open until Manager resolves or waives those audit failures.
7. 2026-04-21 10:39:17: Prepped `Catalog-Gen2-13 / Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` after researching the Catalog source-options handoff, staged Import dialog, store commit path, BrowserPanel import review tests, useAppStore staged-import tests, and Import preview viewport helper; decided the next Manager approval candidate should be a small Catalog source-options label/status polish plus a docs/test audit proving Catalog only stages selected PubParts ZIP files into Import review with attribution, Import remains the Add To Project acceptance gate, committed imported reference records are created by the store path, and model viewport geometry display beyond committed reference state belongs to the reference loader/viewer owner if not already covered by focused tests.
6. 2026-04-21 10:34:03: Closed `Catalog-Gen2-13 / Phase 3 - Preview Affordance For Previewable Supported Files` after staged ZIP entry rows gained an honest `Preview` field that labels selectable supported `step`, `stl`, `obj`, and `glb` entries as previewable in Import review after staging and labels unsupported/blocked/unselectable entries as not available, with stable selectors, focused Catalog surface coverage, and production build verification while direct Catalog geometry preview, early extraction/object URLs, Import accept/project asset behavior, native downloads/folders, STEP fidelity, supported type expansion, builder behavior, and compatibility verdicts stayed deferred.
5. 2026-04-21 10:29:15: Prepped `Catalog-Gen2-13 / Phase 3 - Preview Affordance For Previewable Supported Files` after researching the current Import/staged preview helpers, deciding that Catalog must not offer direct geometry preview for raw ZIP entries because true preview currently requires archive-entry materialization into staged Import draft files with object URLs, and defining the smaller honest `Preview in Import review after staging` row affordance, labels, tests, ownership boundaries, and no-project-acceptance/no-native-download/no-STEP-fidelity constraints for the next Manager approval candidate.
4. 2026-04-21 10:25:54: Closed `Catalog-Gen2-13 / Phase 2 - ZIP Entry Staged Importer List` after ZIP archive candidates began rendering as staged ZIP entry rows with archive path, file name, type, formatted size, support state, blocked reason when present, selected state, stable selectors, preserved source metadata, preserved selection controls, focused Catalog surface/shell tests, and production build verification while preview, project asset acceptance, native downloads, local folders, ZIP rule changes, Import accept changes, model-viewport insertion, STEP fidelity work, builder behavior, and compatibility verdicts stayed deferred.
3. 2026-04-21 10:22:03: Prepped `Catalog-Gen2-13 / Phase 2 - ZIP Entry Staged Importer List` as the next Manager approval candidate, replacing the placeholder Phase 2 read with an implementation-ready spec for staged ZIP rows, required row fields, source metadata persistence, disabled/blocked entry states, selection controls, final action wording, focused Catalog tests, and the no-preview/no-project-asset/no-native-download/no-ZIP-rule-change boundary.
2. 2026-04-21 10:19:01: Closed `Catalog-Gen2-13 / Phase 1 - Download And Upload Source Actions` after PubParts ZIP source options gained staged importer shell copy, PubParts source metadata, browser-honest `Download ZIP` guidance with Dropbox `dl=1` link preference where possible, explicit `Upload ZIP` local file grant wording, focused Catalog surface/shell tests, and `npm.cmd run build` verification while keeping preview, staged-list redesign, native downloads, folder ownership, Import accept changes, and accepted project asset changes deferred.
1. 2026-04-21 10:10:45: Created this Family Phase Doc as a new `Catalog-Gen2-13` follow-up instead of extending completed `Catalog-Gen2-12`, because the next work is the staged importer/source-options user workflow, preview affordance, and final handoff contract on top of the existing ZIP listing/extraction helpers rather than another ZIP mechanics repair.

### Purpose

This file owns `Catalog-Gen2-13`, the Catalog Gen2 follow-up that turns the PubParts ZIP path into a real staged importer workflow.

Use it to answer:
- how `Add To Project` opens the Catalog source-options/staged importer window for ZIP-backed PubParts records
- how ParaHook uses PubParts metadata and source links without pretending it controls browser downloads
- how the user explicitly grants local ZIP bytes through upload/choose-ZIP
- how ZIP entries populate the staged importer list
- where preview affordances belong before the final Import/project/model-viewport handoff

Do not use it for:
- changing PubParts source data shape
- replacing the existing ZIP reader/extraction safety helper
- adding native direct download, automatic folder ownership, or background local-library materialization
- accepting Import review files into project assets
- changing STEP fidelity, `.stp` support, builder behavior, or compatibility verdicts

### Why This Phase Exists

`Catalog-Gen2-12` made ZIP-backed PubParts sources mechanically usable: readable ZIP blobs can be listed, browser-blocked ZIPs can be chosen as local `.zip` files, and selected supported entries can stage into Import review.

The user-facing flow still needs a clearer staged importer shape. The desired path is not a fallback message. It should feel like:
1. user clicks `Add To Project`
2. source options opens with PubParts metadata and source link context
3. user downloads or opens the ZIP through normal browser behavior
4. user uploads or chooses that ZIP in ParaHook
5. ParaHook lists ZIP entries in a staged importer
6. user previews where feasible and selects supported files
7. selected files hand off to Import/project/model-viewport ownership through the normal path

## Doc Body

### Family Phase Goal

Make the ZIP-backed PubParts `Add To Project` path read as a staged importer instead of a technical fallback.

This phase should preserve the already-shipped ZIP inspection and selected extraction seams while improving the surrounding user workflow. The Catalog window should guide the user through browser-constrained download/open-source behavior, explicit local ZIP upload, ZIP entry review, preview affordances where available, and final selected-file handoff.

### Decision

This becomes `Catalog-Gen2-13`, not an extension of `Catalog-Gen2-12`.

Reason:
- `Catalog-Gen2-12` is the completed ZIP mechanics lane: reader, listing, selected extraction, manifest cache, and local ZIP fallback.
- The new work is a UX and ownership lane: source-options/staged importer flow, browser-honest download/upload copy, preview affordances, and handoff acceptance.
- Keeping it separate preserves the old historical ZIP phases and gives Manager a smaller first implementation target.

### Ownership Boundary

Catalog owns:
- PubParts item identity, source metadata, source page/source ZIP link, and attribution display
- the source-options/staged importer window that opens from PubParts `Add To Project`
- download/open-source action labeling and browser-honest status copy
- upload/choose-ZIP action and ephemeral local ZIP blob state after user grant
- ZIP entry staged importer list, selection state, support/unsupported status, and preview affordance placement
- selected supported file handoff into the existing Import review seam

Import owns:
- staged Import review once Catalog hands over selected supported files
- accepted project assets after the user accepts Import review
- project asset identity, object URL lifetime after acceptance, and model/project insertion semantics
- STEP fidelity, `.stp` support, heavy parse progress, units, and parse reuse

Model viewport/project owns:
- displaying accepted project assets after Import/project state owns them
- any viewer presentation consequences of accepted assets

Future local/native helper owns:
- automatic source ZIP download into a known folder
- helper-managed folder ownership or per-item source folder materialization
- background extraction into local library folders
- remote-byte proxying or native file writing

### Browser Constraints

- A browser button can open the PubParts source link or initiate normal browser download behavior.
- ParaHook cannot force the exact folder where the browser saves the ZIP.
- ParaHook cannot silently discover the user's `Downloads` folder.
- The upload/choose-ZIP action is the explicit user grant that lets ParaHook read local ZIP bytes.
- Local ZIP blobs in this phase should stay ephemeral unless a later local/native owner explicitly stores them.
- Source-options copy must avoid saying ParaHook downloaded the ZIP unless ParaHook actually has the bytes.

### Implementation Slices

Keep the first worker slice small. Do not try to ship preview and final handoff polish in the same cut as the download/upload shell.

Recommended implementation order:
1. `Phase 1 - Download And Upload Source Actions`
2. `Phase 2 - ZIP Entry Staged Importer List`
3. `Phase 3 - Preview Affordance For Previewable Supported Files`
4. `Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit`

## Vision

The finished `Catalog-Gen2-13` flow should make one PubParts ZIP feel inspectable and controllable inside ParaHook without hiding browser sandbox reality.

The user should understand:
- which PubParts item and source link they are acting on
- that the browser controls where a downloaded ZIP lands
- that choosing the ZIP is the explicit step that gives ParaHook bytes
- which archive entries are supported, unsupported, previewable, selected, or blocked
- that `Add To Project` from the staged importer sends selected supported files toward Import review first, not directly into permanent project truth

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-17. make the PubParts ZIP path feel like a real staged importer flow where Add To Project opens source options, ParaHook uses PubParts source metadata, the user downloads or opens the ZIP through normal browser behavior, explicitly uploads the saved ZIP back into ParaHook, reviews staged ZIP entries with preview affordances where feasible, and sends only selected supported files toward Import/project/model-viewport ownership`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-28. Make the ZIP-backed PubParts source-options window present a first-class staged importer state with PubParts metadata, source link context, and browser-honest download/open-source guidance.
- [x] Catalog-Gen2-CLG-29. Add an explicit upload/choose-ZIP action that treats the selected local ZIP as the user's file-read grant and keeps local ZIP bytes ephemeral.
- [x] Catalog-Gen2-CLG-30. Populate a staged ZIP entry list from the chosen ZIP with supported, unsupported, blocked, selected, size, type, and archive-path reads.
- [x] Catalog-Gen2-CLG-31. Add preview affordances for previewable supported staged entries where current Import/viewer helpers can honestly produce preview context before final project acceptance.
- [x] Catalog-Gen2-CLG-32. Route the final staged importer `Add To Project` action through Import review and then existing project/model-viewport handoff ownership without letting Catalog own accepted assets.

### `Catalog-Gen2-13 / Phase 1`

- [x] `HLG 17. staged importer flow`
- [x] `CLG 28. source-options staged importer shell`
- [x] `CLG 29. explicit upload/choose-ZIP grant`
- [x] Rename or clarify the ZIP source-options actions so the first action opens/starts normal browser download behavior and the second action uploads/chooses the saved ZIP.
- [x] Show PubParts item metadata and source-link context in the window.
- [x] Keep the existing ZIP listing/extraction helper behavior intact.
- [x] Do not add preview or final handoff behavior in this first slice.

### `Catalog-Gen2-13 / Phase 2`

- [x] `HLG 17. staged ZIP entry review`
- [x] `CLG 30. ZIP entry staged importer list`
- [x] Turn the current candidate list into an explicitly staged importer list with archive path, file name, type, size, support state, blocked reason when present, and selected state.
- [x] Keep unsupported, unsafe, directory, hidden/system, oversized, unknown-size, and malformed entries visible or summarized but unstageable.
- [x] Preserve per-row checkbox selection, `Select All Supported`, `Clear Selection`, and selected-count behavior.
- [x] Keep PubParts source metadata/source ZIP context visible above the staged entries.
- [x] Keep the final action on the existing Import review handoff path while Phase 4 remains the naming/final handoff audit.

### `Catalog-Gen2-13 / Phase 3`

- [x] `HLG 17. preview affordance`
- [x] `CLG 31. previewable supported entries`
- [x] Mark previewable supported entries separately from merely importable entries.
- [x] Add a preview affordance only where the current app can generate a truthful preview without accepting the file as a project asset; current code evidence limits that to staged Import review after archive entry materialization.
- [x] Label currently supported preview-after-staging ZIP entries without adding a direct Catalog geometry preview button for raw ZIP entries.
- [x] Keep unsupported, blocked, unsafe, directory, hidden/system, oversized, unknown-size, malformed, and `.stp` entries visibly no-preview/no-stage unless a later Import/loader phase expands support.
- [x] Keep STEP-heavy preview, `.stp` support, units, and tessellation fidelity deferred to Import/loader owners.

### `Catalog-Gen2-13 / Phase 4`

- [x] `HLG 17. final handoff`
- [x] `CLG 32. Import/project/model-viewport handoff`
- [x] Ensure the staged importer final action sends selected supported files to Import review with PubParts attribution.
- [x] Ensure accepted files follow the existing Import/project/model-viewport path.
- [x] Verify Catalog does not create accepted project assets directly.
- [x] Clarify source-options final action wording so the user understands selected files are staged to Import review, not accepted directly into project truth.
- [x] Audit existing Import review preview and Add To Project gate coverage before adding any new tests.
- [x] Prove committed imported reference records are created by `commitStagedImportDraft`, not by Catalog.
- [x] Record any remaining follow-up if Import accept does not yet place a supported file in the model viewport.

## [x] `Catalog-Gen2-13 / Phase 1` - `Download And Upload Source Actions`

### Phase 1 Summary

#### Purpose

Make the first visible step of the PubParts ZIP staged importer honest and understandable.

The source-options window should show that ParaHook has PubParts metadata and a source ZIP link, but that the user must use browser download/open-source behavior and then explicitly choose the local ZIP before ParaHook can inspect it.

#### Owns

- source-options/staged importer copy and action labels for ZIP-backed PubParts items
- PubParts item metadata/source link display in the window
- the `Download ZIP` or `Open Source ZIP` action wording and link behavior
- the `Upload ZIP` or `Choose ZIP` action wording and local file input trigger
- preserving the existing Phase 5.1 local ZIP inspection behavior behind the upload/choose action

#### Does Not Own

- changing ZIP helper classification or extraction rules
- replacing the existing `pubPartsZipArchive` helper
- adding preview affordances
- changing final Import review behavior
- accepting files into project assets
- native download, fixed-folder save location, file-system scanning, or local library materialization

#### First Pass Decisions

- Use `Catalog-Gen2-13` because this is a staged importer UX and handoff phase, not another `Catalog-Gen2-12` ZIP mechanics phase.
- Prefer labels that expose browser truth. Suggested labels are `Download ZIP` or `Open Source ZIP`, plus `Upload ZIP` or `Choose ZIP`.
- If implementation finds the browser can only open the source URL rather than reliably initiate a download, prefer `Open Source ZIP` copy and explain that the browser controls saving.
- The upload/choose action remains the only local-byte grant for the browser app.

### Phase 1 Implementation Spec

#### Exact First Code Cut

- Update the ZIP-backed PubParts source-options dialog copy so it reads as a staged importer shell.
- Add or relabel the source action that opens the PubParts ZIP/source link as the browser-controlled download/open step.
- Add or relabel the local ZIP picker action as the explicit upload/choose step.
- Keep the existing local ZIP file-input path and remote-readable fallback behavior intact.
- Add focused tests that assert the browser constraint copy and upload action are present when a PubParts ZIP source needs user-provided local bytes.

#### Likely Files

- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `src/app/catalog/ui/CatalogShell.test.tsx` only if shell-level rendering changes need coverage

#### No-Widening Rule

Do not add preview, rewrite entry classification, change Import review semantics, add native download behavior, add folder scanning, or alter accepted project assets in Phase 1.

#### Acceptance Criteria

- PubParts ZIP-backed `Add To Project` opens a staged importer/source-options window.
- The window identifies the PubParts item and source ZIP/source link.
- The download/open-source action tells the truth that browser behavior controls the save location.
- The upload/choose-ZIP action is available as the explicit local ZIP grant.
- Choosing a ZIP still routes into the existing ZIP listing path.
- No new accepted project asset is created by Catalog in this phase.

#### Focused Tests

- Source-options dialog renders browser-honest download/open-source guidance for a ZIP-backed PubParts item.
- Source-options dialog renders an upload/choose-ZIP action after remote ZIP fetch fails or when local bytes are needed.
- Existing fallback test still proves chosen local ZIP bytes can reach the current listing/staging path.

#### Verification Shape

- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` if dialog rendering tests change
- `npm.cmd run build`

#### Done Shape

Phase 1 is done when Manager can see a clear browser-honest staged importer shell for ZIP-backed PubParts sources, while the underlying ZIP mechanics and Import handoff remain unchanged.

#### Implementation Closeout

Status: implemented and closed.

Shipped behavior:
- PubParts ZIP source options now read as a staged importer shell and show provider, source page, and source ZIP/source link metadata.
- ZIP source links show `Download ZIP` and prefer direct Dropbox `dl=1` URLs where the shared URL can honestly be converted.
- The dialog and fallback status copy say the browser controls where the ZIP is saved and that ParaHook reads the ZIP only after the user chooses it.
- The local file-picker action now reads `Upload ZIP`, preserving the existing explicit user file-read grant and current ZIP listing/extraction path.

Verification:
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 29 tests.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed, 3 tests.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Follow-up:
- `Catalog-Gen2-13 / Phase 2 - ZIP Entry Staged Importer List` remains the next implementation phase.

## [x] `Catalog-Gen2-13 / Phase 2` - `ZIP Entry Staged Importer List`

### Phase 2 Summary

#### Purpose

Make the post-upload ZIP entry list read as staged importer inventory, not only resolver candidates.

After the user chooses the downloaded PubParts ZIP, the source-options dialog should visibly become a Catalog-owned staged importer list. The user should be able to scan each archive entry, understand whether it can be selected, select supported entries, and stage the selected supported files through the existing Import review path.

#### Owns

- visible staged entry rows
- supported/unsupported/blocked status language
- selection controls and selected-count summary
- source/archive path and file details display
- preserving PubParts source metadata/source ZIP context in the dialog while the entry list changes
- final action wording for this phase, as long as the action still uses the existing Import review handoff

#### Does Not Own

- preview rendering
- final Import accept behavior
- changing ZIP extraction safety
- changing supported file-type rules
- native download, fixed folder ownership, filesystem scanning, or background source materialization
- accepted project asset creation
- model-viewport insertion

### Phase 2 Implementation Spec

#### Exact First Code Cut

- Keep `CatalogShellSourceOptionsDialog.tsx` as the Catalog-owned dialog surface.
- Rename the candidate-list language/classes/data labels where useful so the ZIP-backed path reads as staged importer entries, without changing resolver/extraction contracts.
- Keep the Phase 1 source metadata block visible above the entry list:
  - provider
  - source page when present
  - source ZIP/source link
  - browser-honest download/upload context
- Update ZIP entry rows to show the exact row fields below.
- Preserve the current `Select All Supported`, `Clear Selection`, per-entry selection, and selected-count state, but make them read against staged entries rather than generic candidates.
- Keep the final action on the existing selected-files-to-Import-review path. Use current behavior-compatible wording such as `Stage Selected To Import Review` or keep `Stage Selected` if that is the least disruptive first cut; Phase 4 owns the final naming/audit.

#### Exact Row Fields

Each staged ZIP entry row should show:
- archive path: the original entry path inside the ZIP, including folder segments when present
- file name: the basename users recognize as the model/source file
- type: normalized extension/type read such as `STL`, `OBJ`, `STEP`, `GLB`, `Directory`, `Unsupported`, or `Unknown`
- size: formatted byte size when known; `Unknown size` when the helper cannot provide a safe size
- support state: one clear label such as `Supported`, `Unsupported`, `Blocked`, `Unsafe path`, `Directory`, `Hidden/system`, `Oversized`, `Unknown size`, or `Malformed`
- blocked reason when present: short reason text from the current candidate/helper classification, not a newly invented rule
- selected state: checked/unchecked checkbox for selectable supported entries; disabled unchecked checkbox or no checkbox affordance for unstageable entries

Row text should avoid implying unsupported entries can be imported. Unsupported or blocked entries can stay visible as context, but selection must be impossible.

#### Disabled Entry States

The following entries must be disabled and unstageable:
- unsupported file extensions or file types
- blocked entries from existing ZIP helper classification
- unsafe paths, including traversal or invalid archive paths
- directories
- hidden/system entries
- oversized entries
- entries with unknown unsafe size
- malformed entries

Phase 2 should consume the existing entry/candidate classification and display it clearly. It must not loosen, replace, or add extraction safety rules.

#### Selection Behavior

- Per-row checkbox toggles only selectable supported entries.
- Disabled rows remain unchecked and cannot be toggled by row click or checkbox click.
- `Select All Supported` selects every selectable supported entry and no disabled entry.
- `Clear Selection` clears all selected supported entries.
- Selected count updates from the selected supported entry set.
- The final action stays disabled when the selected count is zero or when the dialog is busy inspecting/staging.
- The final action sends only selected supported entries toward the existing Import review handoff path; Phase 4 will audit and refine final action naming/handoff semantics if needed.

#### Source Context Requirements

The staged importer list must not bury the source context. While showing entries, the dialog should still expose:
- PubParts item label
- provider
- source page when present
- source ZIP/source link
- `Download ZIP`/source action
- `Upload ZIP` action
- browser save-location constraint copy, or a compact equivalent if the shell becomes crowded

#### Suggested UI/Data Hooks

Use or add stable selectors so focused tests can assert the staged importer state without coupling to purely visual class names:
- dialog: existing `data-catalog-pubparts-source-options-dialog`
- source action: existing `data-catalog-pubparts-source-download-link`
- upload action: existing `data-catalog-pubparts-choose-local-zip`
- staged list region: suggested `data-catalog-pubparts-staged-zip-entry-list`
- staged row: suggested `data-catalog-pubparts-staged-zip-entry-row`
- staged row checkbox: suggested `data-catalog-pubparts-staged-zip-entry-checkbox`
- support state label: suggested `data-catalog-pubparts-staged-zip-entry-support-state`

Selectors can differ if the existing local test style points to a cleaner pattern, but tests should avoid brittle text-only traversal for every row.

#### Acceptance Criteria

- Uploaded ZIP entries populate a staged importer list.
- Source metadata/source ZIP context remains visible while entries are shown.
- Each visible entry shows archive path, file name, type, size, support state, blocked reason when present, and selected state.
- Supported entries are selectable with per-row checkboxes.
- Unsupported, blocked, unsafe, directory, hidden/system, oversized, unknown-size, and malformed entries cannot be selected.
- `Select All Supported` selects only supported selectable entries.
- `Clear Selection` clears the selected set.
- Selected count updates after per-row selection, select-all, and clear.
- Final action remains on the existing selected supported files to Import review path.
- No new accepted project asset is created by Catalog in this phase.

#### Focused Tests

- Extend the existing `CatalogSurface.test.tsx` local-ZIP fallback coverage so after `Upload ZIP` the dialog exposes a staged importer list rather than only generic candidate text.
- Assert at least one supported fixture entry row shows archive path, file name, type, formatted size, support state, and checked selected state.
- Assert unsupported fixture entries are visible with support state/reason text and cannot be toggled.
- Assert unsafe, directory, hidden/system, oversized, unknown-size, or malformed fixture entries are disabled where existing fixtures/helpers can provide those cases; add a small fixture only if existing ZIP helper tests already support the state and the Catalog surface lacks coverage.
- Assert `Select All Supported` selects only selectable supported rows.
- Assert `Clear Selection` clears selected rows and updates selected count.
- Assert source metadata/source ZIP context remains visible after the local ZIP is listed.
- Keep or add a shell-level test in `CatalogShell.test.tsx` only if the row rendering is factored into the shell/dialog enough to test without the full Catalog surface.

#### Verification Shape

- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` if dialog row rendering is covered there
- `npm.cmd run build`

#### No-Widening Rule

Do not add preview affordances, project asset acceptance, native downloads, local folder ownership, automatic source materialization, ZIP extraction rule changes, supported type changes, Import accept changes, model-viewport insertion, STEP fidelity work, builder behavior, or compatibility verdicts in Phase 2.

#### Done Shape

Phase 2 is done when Manager can upload/choose a PubParts ZIP and see a clear staged importer list whose rows explain what each archive entry is, whether it is selectable, why disabled entries are blocked, and which supported entries are selected before the existing Import review handoff.

#### Implementation Closeout

Status: implemented and closed.

Shipped behavior:
- ZIP archive candidates now render as staged ZIP entry rows with stable list, row, checkbox, and support-state selectors.
- Rows show archive path, file name, type, formatted size, support state, blocked reason when present, and selected state.
- Unsupported, directory, hidden/system, and other unselectable entries remain visible but disabled through the existing candidate `selectable` flag.
- PubParts provider, source page, source ZIP/source link, `Download ZIP`, and `Upload ZIP` context remain visible.
- Existing `Select All Supported`, `Clear Selection`, selected count, and `Stage Selected` to Import review behavior stayed intact.

Verification:
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 29 tests.
- `npm.cmd test -- src/app/catalog/ui/CatalogShell.test.tsx` passed, 3 tests.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Follow-up:
- `Catalog-Gen2-13 / Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` remains the next implementation phase.

## [x] `Catalog-Gen2-13 / Phase 3` - `Preview Affordance For Previewable Supported Files`

### Phase 3 Summary

#### Purpose

Add preview affordances to the staged importer only where ParaHook can preview honestly before project acceptance.

#### Owns

- previewable entry labeling
- preview affordance placement
- no-preview states for supported but not previewable entries

#### Does Not Own

- STEP fidelity improvements
- `.stp` support
- heavy loader progress
- accepting project assets

### Phase 3 Implementation Spec

#### Current Code Evidence

- `src/app/references/importReferenceFile.ts` defines `SUPPORTED_REFERENCE_IMPORT_FILE_TYPES` as `step`, `stl`, `obj`, and `glb`, and `ImportedReferenceFile` requires an `objectUrl`.
- `src/app/references/referenceManifest.ts` defines `ReferenceFileType` as `obj`, `glb`, `stl`, or `step`; `.stp` is not a current Import/reference type.
- `src/viewer/referenceAssetLoader.ts` can load `glb` through `GLTFLoader`, `obj` through `OBJLoader`, `stl` through `STLLoader`, and routes `step` to the STEP reference loader.
- `src/app/panels/StagedImportPreviewViewport.tsx` previews a `StagedImportDraftFileRecord` by calling `loadReferenceAssetObject({ fileType: selectedFile.fileType, assetPath: selectedFile.objectUrl })`; the viewport is therefore tied to a staged Import draft file, not to raw ZIP entry metadata.
- `src/app/store/useAppStore.ts` keeps previewable pre-acceptance files inside `StagedImportDraftState.stagedFiles` and only commits them through `commitStagedImportDraft`; this makes Import review the current pre-project-acceptance preview owner.
- `src/app/catalog/pubPartsSharedLinkResolver.ts` materializes selected archive entries into `ImportedReferenceFile` records with object URLs only inside `materializePubPartsSharedLinkArchiveCandidateFiles`.
- `src/app/workspace/CatalogSurface.tsx` calls `materializePubPartsSharedLinkArchiveCandidateFiles`, `openStagedImportDraft`, and `appendStagedImportDraftFiles` only from the existing `Stage Selected` path.
- `src/app/catalog/catalogActionPlan.ts` and `src/app/catalog/catalogItemContract.ts` support Catalog item-level temporary preview for repo-backed catalog items, not per-entry raw ZIP geometry preview.

#### Previewability Decision

Phase 3 should not add a direct `Preview` button in the Catalog ZIP entry list.

The truthful current affordance is row-level preview guidance: selectable supported ZIP entries whose file types are `step`, `stl`, `obj`, or `glb` should be marked `Preview in Import review after staging`. The user must still select entries and use the existing staging action before ParaHook extracts bytes, creates object URLs, opens the Import draft, and makes the Import preview viewport able to load geometry.

Direct Catalog preview before staging would require materializing an archive entry from ZIP bytes into a temporary object URL, owning that object URL lifetime, and deciding whether that temporary preview object should be shared with or duplicated by Import review. That is a new Catalog/Import ownership seam and is not part of Phase 3.

#### Preview State Rules

- `step`, `stl`, `obj`, and `glb` supported archive entries: show `Preview in Import review after staging`.
- supported archive entries that are selected: keep the same preview state label; selection should not extract or preview early.
- unsupported, blocked, unsafe, directory, hidden/system, oversized, unknown-size, malformed, and otherwise unselectable entries: show `No preview`.
- blocked rows with a blocked reason: keep the blocked reason visible and show `No preview` or `No preview - blocked`.
- `.stp` entries: show unsupported/no-preview under current Import/reference type support.
- direct supported file candidates may keep their existing generic/source-options rendering in this phase; the row-level ZIP preview affordance applies to staged ZIP entry rows only.

#### UI Surface

- Add a staged ZIP entry row field named `Preview`.
- For preview-after-staging rows, use the exact visible label `Preview in Import review after staging`.
- For no-preview rows, use the exact visible label `No preview`.
- Add a stable selector such as `data-catalog-pubparts-staged-zip-entry-preview-state` on the preview field.
- Keep source metadata/source ZIP context visible above the staged rows.
- Keep the final action wording on the existing staging handoff. Phase 3 may add supporting copy near the selection controls such as `Stage selected files to Import review to preview before accepting them`, but it must not rename acceptance/commit behavior or change the handoff.

#### Implementation Notes

- Likely primary implementation file: `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx`.
- Likely tests: `src/app/workspace/CatalogSurface.test.tsx`.
- A small helper such as `formatArchiveEntryPreviewState(candidate)` can live beside the existing archive row field helpers.
- The helper should classify only archive-entry candidates and should derive preview-after-staging from current supported Import/reference file types, not from guessed PubParts metadata.
- Do not call `materializePubPartsSharedLinkArchiveCandidateFiles` from a row preview affordance.
- Do not create object URLs, staged draft files, or project assets before the existing `Stage Selected` flow.
- Do not add a new Import preview selection jump in this phase unless Manager explicitly widens the scope; Phase 4 audits final handoff and naming.

#### Acceptance Criteria

- Staged ZIP entry rows include a `Preview` field with stable selector coverage.
- Supported/selectable `step`, `stl`, `obj`, and `glb` ZIP entries show `Preview in Import review after staging`.
- Unsupported, blocked, unsafe, directory, hidden/system, oversized, unknown-size, malformed, `.stp`, and otherwise unselectable entries show `No preview` while remaining visible and unstageable.
- The source metadata/source ZIP context remains visible.
- Per-row selection, `Select All Supported`, `Clear Selection`, selected count, and existing `Stage Selected` to Import review behavior remain unchanged.
- No Catalog row action extracts archive bytes, creates object URLs, opens/commits Import drafts, accepts project assets, or inserts anything into the model viewport.
- No STEP fidelity, `.stp` support, supported type expansion, native download/folder ownership, builder behavior, or compatibility verdict changes ship in this phase.

#### Focused Tests

- Update `src/app/workspace/CatalogSurface.test.tsx` staged ZIP row coverage so supported `.stl`, `.obj`, `.glb`, and `.step` rows show `Preview in Import review after staging`.
- Assert unsupported, blocked, directory, hidden/system, oversized, unknown-size, malformed, and `.stp` fixture rows show `No preview` and remain disabled/unselected.
- Assert the preview state selector exists per staged ZIP entry row.
- Assert no row-level preview control calls extraction/materialization before `Stage Selected`; existing staging tests should remain the only place that reaches `appendStagedImportDraftFiles`.
- Keep existing tests that prove `Stage Selected` still hands selected supported entries to Import review.
- Run focused Catalog surface tests and `npm.cmd run build` after implementation approval.

#### Manager Approval Recommendation

Approve Phase 3 as a UI/spec-honest preview-affordance slice, not as a geometry preview implementation. The first implementation cut should add the `Preview` row field and labels to `CatalogShellSourceOptionsDialog.tsx`, cover those labels/selectors in `CatalogSurface.test.tsx`, update `docs/CHANGELOG.md`, close this doc phase plus index status, update `docs/Doc-Log.md`, then run the focused Catalog surface test and `npm.cmd run build`.

#### Implementation Closeout

- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` now shows a staged ZIP row `Preview` field with `Preview: In Import review after staging` for selectable supported current Import reference types and `Preview: Not available` for unsupported, blocked, directory, hidden/system, `.stp`, or otherwise unselectable rows.
- `data-catalog-pubparts-staged-zip-entry-preview-state` gives tests a stable row preview-state selector.
- `src/app/workspace/CatalogSurface.test.tsx` covers supported preview-after-staging labels for `.stl`, `.obj`, `.glb`, and `.step`, no-preview labels for unsupported/blocked rows, preserved selection behavior, and the unchanged Import review staging path.
- No preview button, early extraction, early object URL creation, Catalog geometry preview, Import accept/project asset behavior, native download/folder behavior, STEP fidelity work, supported type expansion, builder behavior, compatibility verdicts, or ZIP extraction rule change shipped.

Verification:
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx` passed, 29 tests.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Follow-up:
- `Catalog-Gen2-13 / Phase 4 - Add-To-Project Import Review And Viewport Handoff Audit` is the next recommended phase.

## [x] `Catalog-Gen2-13 / Phase 4` - `Add-To-Project Import Review And Viewport Handoff Audit`

### Phase 4 Summary

#### Purpose

Prove the staged importer final action hands selected supported files to the right downstream owners.

#### Owns

- staged importer final `Add To Project` action wiring
- Import review handoff assertion
- project/model-viewport ownership audit
- follow-up routing if accepted files do not yet appear in the model viewport

#### Does Not Own

- rewriting Import accept behavior
- implementing missing model loader fidelity
- native downloads, local folder ownership, or automatic source materialization
- ZIP extraction rule changes or supported type expansion
- builder or compatibility behavior

### Phase 4 Implementation Spec

#### Research Conclusion

The core runtime handoff already exists. Phase 4 should not rewrite Import or store behavior unless the audit finds a regression.

Recommended Phase 4 shape:
- small Catalog source-options copy polish so the final ZIP action reads as an Import-review staging action
- focused Catalog test updates for the label/status and no-direct-project-asset assertion
- audit or reuse of existing BrowserPanel and useAppStore staged-import tests for Import acceptance and committed reference creation
- explicit documentation of any model-viewport display gap as a reference loader/viewer follow-up, not a Catalog commit path change

#### Code Evidence

- `src/app/workspace/CatalogSurface.tsx` selects `openStagedImportDraft`, `appendStagedImportDraftFiles`, and `addImportedReference` separately; the PubParts ZIP source-options staging path calls `materializePubPartsSharedLinkArchiveCandidateFiles`, then `openStagedImportDraft({})`, then `appendStagedImportDraftFiles(files)`.
- `src/app/workspace/CatalogSurface.tsx` uses `addImportedReference` for a separate direct Catalog reference commit path, not for the PubParts ZIP source-options staging path.
- Before Phase 4 implementation, `src/app/workspace/CatalogSurface.tsx` reported `Materializing selected PubParts source files for Import review...` while extracting selected ZIP entries and reported that PubParts source files were staged in Import review with attribution after append.
- Before Phase 4 implementation, `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` used the generic final action label `Stage Selected`; Phase 4 should rename this to `Stage Selected to Import Review` or equivalent handoff-specific wording.
- `src/app/store/useAppStore.ts` defines `openStagedImportDraft`, `appendStagedImportDraftFiles`, and `commitStagedImportDraft`; the first opens an empty staged draft, the second maps `ImportedReferenceFile` objects into staged draft records, and the third is the acceptance path that creates committed imported references.
- `src/app/store/useAppStore.ts` creates committed imported reference records inside `commitStagedImportDraft` with a new `referenceId`, `assetPath` from the staged object URL, `sourceAttribution`, visibility/load state, transform defaults, and reference workspace/order entries.
- `src/app/panels/useBrowserPanelController.ts` owns the staged Import dialog controller, calls `commitStagedImportDraft()` from the dialog's Add To Project action, and closes the staged draft only after a successful commit.
- `src/app/panels/browserTreeMenus.tsx` renders the staged Import dialog, preview tree, preview viewport shell, and the visible `Add To Project` acceptance button with `aria-label="Add staged imports to project"`.
- `src/app/panels/StagedImportPreviewViewport.tsx` previews staged files by loading the staged file object URL through Import/reference loader helpers and explicitly describes that the orbit preview stays local to the preview viewport and does not add project content.
- `src/app/workspace/CatalogSurface.test.tsx` already has PubParts source-options tests that expect `openStagedImportDraft({})`, `appendStagedImportDraftFiles([...])`, PubParts attribution, and no `addImportedReference` call.
- `src/app/panels/BrowserPanel.test.tsx` already covers staged Import dialog intake, preview tree/viewport presentation, disabled Add To Project with no files, enabled Add To Project with staged files, `commitStagedImportDraft`, draft closeout, committed imported references, and partial commit behavior.
- `src/app/store/useAppStore.test.ts` already covers staged draft open/append/commit behavior, source attribution preservation, committed imported reference creation, visibility/load-state defaults, object URL ownership, reviewed single-object commits, reviewed multi-object commits, and partial commit behavior.

#### Ownership Decision

Catalog owns only the source-options final staging action: selected supported PubParts ZIP entries become staged Import draft files with PubParts attribution.

Import owns preview context and the acceptance gate: the staged Import dialog shows preview/load context and the `Add To Project` button that calls `commitStagedImportDraft`.

The store owns accepted project/reference truth: committed imported reference records are created in `commitStagedImportDraft`, not in Catalog.

The model viewport display claim should stay narrow in Phase 4. The audit can prove accepted references exist in project/reference workspace state with visibility/load-state defaults. If geometry does not render after accepted import, the follow-up belongs to the reference loader/viewer or Import/viewer handoff owner rather than Catalog source-options.

#### Button And Status Decision

Change the Catalog source-options final ZIP action from generic `Stage Selected` to `Stage Selected to Import Review` if Manager approves Phase 4 implementation.

Allowed supporting copy:
- `Stage selected files to Import review before accepting them into the project.`
- busy state: `Staging to Import Review...`
- status: `Staging selected PubParts source files to Import review...`

Do not rename the staged Import dialog primary action in Phase 4. It already presents the acceptance gate as `Add To Project` with `aria-label="Add staged imports to project"`.

#### Exact First Implementation / Audit Cut

1. Update `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` final selected-entry action text to `Stage Selected to Import Review` and, if the component has a distinct busy label, use `Staging to Import Review...`.
2. Update `src/app/workspace/CatalogSurface.test.tsx` focused source-options coverage for the new action wording and keep assertions that PubParts ZIP staging calls `openStagedImportDraft({})` and `appendStagedImportDraftFiles(...)` with attribution while not calling `addImportedReference`.
3. Do not change `CatalogSurface.tsx` handoff behavior unless the label requires a prop/name adjustment; the existing `materializePubPartsSharedLinkArchiveCandidateFiles` to `openStagedImportDraft` to `appendStagedImportDraftFiles` path should remain intact.
4. Do not change `BrowserPanel`, `useBrowserPanelController`, `useAppStore`, Import accept behavior, project asset behavior, ZIP extraction rules, supported file types, native downloads/folders, STEP fidelity, builder behavior, or compatibility verdicts.
5. Run the existing audit suite after the label/test change: `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts`.
6. Run `npm.cmd run build`.

#### Acceptance Criteria

- The Catalog source-options final action clearly says selected ZIP entries are staged to Import review.
- Final action sends only selected supported files to Import review with PubParts attribution.
- Catalog does not call `addImportedReference` or directly create accepted project assets from the PubParts ZIP source-options path.
- Import review remains the acceptance gate and presents `Add To Project` / `Add staged imports to project`.
- Import review provides preview context for staged files through the existing preview tree/viewport shell after staging.
- Accepted assets follow the existing `commitStagedImportDraft` store path.
- Committed imported references preserve PubParts/source attribution and own reference workspace fields such as object URL asset path, visibility/load-state defaults, and imported reference ordering.
- Catalog does not directly create accepted project assets.
- Any model-viewport geometry display gap beyond committed reference state is recorded as an Import/reference-loader/viewer follow-up instead of hidden inside Catalog.

#### Focused Tests

- `src/app/workspace/CatalogSurface.test.tsx`: assert the source-options action reads `Stage Selected to Import Review` and the dialog/status still describes Import review handoff.
- `src/app/workspace/CatalogSurface.test.tsx`: keep or strengthen the selected-entry test so selected supported entries hand off with PubParts attribution, while unselected/unsupported entries do not.
- `src/app/workspace/CatalogSurface.test.tsx`: assert `addImportedReference` is not called by the PubParts ZIP source-options path.
- `src/app/panels/BrowserPanel.test.tsx`: run existing staged Import dialog tests that cover staged rows, preview context, `Add To Project`, commit call, closeout, committed imported references, and partial commit behavior; add only a small assertion if the audit finds the acceptance gate copy is not covered.
- `src/app/store/useAppStore.test.ts`: run existing staged import commit tests that cover `openStagedImportDraft`, `appendStagedImportDraftFiles`, `commitStagedImportDraft`, source attribution preservation, committed reference records, and partial commit behavior; add only if PubParts attribution or visibility/load-state state is not currently covered.
- Viewer/model viewport tests are not required for Phase 4 unless Manager explicitly widens the phase to prove rendered geometry. Store/project reference creation is the honest Phase 4 acceptance line.

#### Verification Shape

- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts`
- `npm.cmd run build`

#### Manager Approval Recommendation

Approve Phase 4 as a small label/status polish plus handoff audit, not as a new Import/store implementation phase.

The first implementation cut should be:
- rename the Catalog source-options final ZIP action to `Stage Selected to Import Review`
- update focused Catalog source-options tests
- run BrowserPanel/useAppStore staged import tests as audit evidence
- document any model viewport display gap as a later reference loader/viewer follow-up

#### Implementation Closeout

Status: implemented and closed for the scoped Catalog ZIP staged importer.

Shipped behavior:
- `src/app/catalog/ui/CatalogShellSourceOptionsDialog.tsx` now labels the PubParts ZIP source-options primary action as `Stage Selected to Import Review`.
- The same action now shows `Staging to Import Review...` while staging.
- `src/app/workspace/CatalogSurface.tsx` now reports `Staging selected PubParts source files to Import review...` before selected files materialize.
- The Catalog handoff still uses `openStagedImportDraft({})` and `appendStagedImportDraftFiles(files)`.
- Catalog still does not call `commitStagedImportDraft` or create accepted project assets from the PubParts ZIP source-options path.
- `src/app/workspace/CatalogSurface.test.tsx` now asserts the clarified final action label and still proves selected supported PubParts ZIP entries stage into Import review with attribution while `addImportedReference` is not called.

Verification:
- `npm.cmd test -- src/app/workspace/CatalogSurface.test.tsx src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts` failed outside the Catalog label/status change: `CatalogSurface.test.tsx` passed 29 tests, `BrowserPanel.test.tsx` failed 2 existing staged Import structure/status expectations, and `useAppStore.test.ts` failed 13 existing graph/project-output expectations.
- `npm.cmd test -- src/app/panels/BrowserPanel.test.tsx` failed with the same 2 staged Import structure/status expectation failures around `Multiple objects` and `Inspection failed` reads not appearing while staged files were still reading structure.
- `npm.cmd test -- src/app/store/useAppStore.test.ts` failed with the same 13 graph/project-output expectation failures, while the staged Import source attribution and staged Import commit tests in that file passed.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

Manager closeout:
- `Catalog-Gen2-13` is complete for the scoped browser-owned PubParts ZIP staged importer.
- Focused Catalog surface coverage passed, targeted BrowserPanel staged Import review/preview coverage passed, targeted useAppStore staged-import attribution/commit coverage passed, and production build had already passed.
- The broader full-suite BrowserPanel staged Import structure/status expectation failures belong to the Import/BrowserPanel owner.
- The broader useAppStore graph/project-output failures belong to the project/store graph-output owner, not Catalog source-options.
- Any model-viewport geometry display gap beyond committed reference state remains an Import/reference-loader/viewer follow-up, not a Catalog direct-commit follow-up.

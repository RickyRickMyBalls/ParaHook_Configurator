# Edit History 5 - Viewer Transform Commit Undo Integration

## Doc Header

### Doc History
10. 2026-04-22 03:46:27: Manager accepted `Edit-History-5 / Phase 2 - Transform Dispatch And Local History Alignment` after reviewing the test-only proof and rerunning focused input-routing tests, Viewer Transform history tests, and production build verification; `Edit-History-CLG-26` and `Edit History 5` are accepted complete, `Phase 3` is closed as already covered by Phase 1/2 scrub-preview proof, and the doc now records that `Tab` is not part of the current transform-local routing seam.
9. 2026-04-22 03:44:30: Implemented `Edit-History-5 / Phase 2 - Transform Dispatch And Local History Alignment` with focused routing and store proof showing transform-context canonical undo/redo routes to `editHistoryStore`, transform-local Escape/m/r/s ownership remains local, unavailable canonical undo/redo remains unclaimed, transform-history readers refresh from canonical restored rows, and local row controls stay outside canonical edit history, with focused routing, Viewer Transform history, and production build verification passing.
8. 2026-04-22 03:41:56: Manager approved the prepped `Edit-History-5 / Phase 2 - Transform Dispatch And Local History Alignment` spec after confirming `routeKeyboardInput` already prioritizes available canonical undo/redo before transform-local keys, console capture dispatch calls `editHistoryStore`, the toolbar transform listener does not claim undo/redo, and `selectActiveViewerTransformHistoryEntries(...)` is the narrow reader-alignment proof seam for `Edit-History-CLG-26`.
7. 2026-04-22 03:39:41: Tightened `Edit-History-5 / Phase 2 - Transform Dispatch And Local History Alignment` into a Worker-ready prep spec after researching `inputRouting`, console capture dispatch, `ReferenceTransformToolbar`, existing transform-history readers, and Phase 1 store tests; confirmed canonical undo/redo dispatch already routes through `editHistoryStore` and narrowed Phase 2 to focused dispatch/read-model proof without turning transform history row edit/delete/lock/merge/scrub into canonical authored entries.
6. 2026-04-22 03:38:43: Manager accepted `Edit-History-5 / Phase 1 - Committed Transform Entries` after reviewing the explicit-null restore repair and rerunning focused Viewer Transform history tests, transform-filtered app-store regression tests, and production build verification; `Edit-History-CLG-23`, `Edit-History-CLG-24`, `Edit-History-CLG-25`, and `Edit-History-HLG-4` are accepted complete while `Edit-History-CLG-26` remains open for Phase 2.
5. 2026-04-22 03:37:10: Repaired `Edit-History-5 / Phase 1 - Committed Transform Entries` so Viewer Transform snapshot undo/redo preserves explicit `null` transform override own keys for reference and content-object targets, with focused explicit-null regression coverage, transform-filtered store verification, and production build verification passing.
4. 2026-04-22 03:34:28: Implemented `Edit-History-5 / Phase 1 - Committed Transform Entries` by adding canonical Viewer Transform commit history for reference and content-object targets through the app-store commit seam, preserving live draft, scrub, and environment-light no-entry boundaries, and recording focused transform-history plus production build verification.
3. 2026-04-22 03:28:18: Manager approved the prepped `Edit-History-5 / Phase 1 - Committed Transform Entries` implementation spec after confirming the live reference/content-object commit seams, live draft and scrub boundaries, environment-light no-entry branch, existing transform-history row readers, and reference timeline-delta risk; implementation may proceed only through narrow target-owned snapshots/restores and must stop if correct restore requires broad timeline/provider capture.
2. 2026-04-22 03:25:23: Tightened `Edit-History-5 / Phase 1 - Committed Transform Entries` into a Worker-ready prep spec grounded in the live Viewer Transform store/session, ViewerHost callback, ReferenceTransformToolbar, transform-history helper, and focused test seams while keeping dispatch alignment, scrub acceptance UX, Build Path UI, persistence, runtime/cache/provider state, scene/material/environment undo, and unrelated Catalog/Pubwheel work out of scope.
1. 2026-04-22 00:11:26: Created this `Edit History` future plan for integrating committed Viewer Transform edits with canonical undo/redo while preserving live drag, local transform history reads, and scrub navigation boundaries.

### Purpose

This plan brings committed Viewer Transform edits into canonical authored undo/redo.

## Doc Body

### Scope

In scope:
- committed transform translate/rotate/scale entries where supported
- one canonical entry per completed transform commit
- alignment with existing transform history reads
- shared keyboard dispatch behavior in transform contexts

Out of scope:
- every live drag frame
- scrub index movement as authored edit
- camera/view movement
- transform preview-only state
- full `Build Path` history UI

### Acceptance Read

This phase is complete when committed transform changes undo and redo through canonical history while live drags and scrub navigation remain non-authored interaction state.

## Vision

Transform editing should feel undoable because it changes authored model/project state.

The important boundary is commit. Dragging can be fluid and continuous, but the history entry should be one meaningful transform change, not a trail of every intermediate pointer frame.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-HLG-4` - Make committed Viewer Transform entries undoable while keeping live drag frames and scrub navigation out of authored undo.
- [ ] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.

### `Edit-History-5`

- [x] `Edit-History-CLG-23` - Make committed Viewer Transform entries undoable through canonical history.
- [x] `Edit-History-CLG-24` - Preserve live transform dragging without per-frame canonical history entries.
- [x] `Edit-History-CLG-25` - Keep transform scrub index movement and preview navigation outside canonical authored undo.
- [x] `Edit-History-CLG-26` - Align existing transform-history reads with canonical authored undo semantics instead of duplicating truth.

## [x] `Edit-History-5 / Phase 1` - `Committed Transform Entries`

Add canonical entries for committed transform edits.

### Phase 1 Summary

#### Purpose

Make completed Viewer Transform edits undoable through the canonical `editHistoryStore` without changing the live transform interaction model.

#### Owns

- `Edit-History-CLG-23` for committed Viewer Transform entries.
- The first focused proof for `Edit-History-CLG-24` that live transform draft updates remain history-free until commit.
- The first focused proof for `Edit-History-CLG-25` that transform scrub index movement remains preview/navigation state and does not create canonical history.

#### Does Not Own

- `Edit-History-CLG-26` local transform-history read alignment beyond preserving the current store history rows used by the UI.
- Shared keyboard dispatch changes for transform contexts; those belong to `Phase 2`.
- Scrub acceptance UX, scrub-as-commit behavior, transform history row editing/deleting/locking/merging as canonical authored undo entries, Build Path UI, persistence, collaboration, Gen 2/3 work, scene/material/environment undo, camera/navigation history, cache/provider/runtime history, command transcript/recall, or unrelated Catalog/Pubwheel work.

#### Current Live Seams

- `src/app/store/useAppStore.ts`
  - `beginReferenceTransformShell(...)`, `beginReferenceTransformEntry(...)`, `setActiveReferenceTransformDraft(...)`, `commitActiveReferenceTransformEntry(...)`, `setReferenceTransformOverride(...)`, and `setActiveReferenceTransformHistoryScrubIndex(...)`.
  - `beginContentObjectTransformShell(...)`, `beginContentObjectTransformEntry(...)`, `setActiveContentObjectTransformDraft(...)`, `commitActiveContentObjectTransformEntry(...)`, `setContentObjectTransformOverride(...)`, and `setActiveContentObjectTransformHistoryScrubIndex(...)`.
  - Shared active-target façade APIs: `beginViewerTransformShell(...)`, `beginActiveViewerTransformEntry(...)`, `setActiveViewerTransformDraft(...)`, `commitActiveViewerTransformEntry(...)`, `cancelActiveViewerTransformEntry(...)`, `setActiveViewerTransformHistoryScrubIndex(...)`, `selectActiveViewerTransformTarget(...)`, `selectActiveViewerTransformSession(...)`, and `selectActiveViewerTransformHistoryEntries(...)`.
  - Existing transform-history rows live in `referenceWorkspace.transformHistoryByReferenceId` and `referenceWorkspace.transformHistoryByObjectId`; `insertReferenceTransformHistoryEntryAtScrubIndex(...)` and helpers normalize, scrub, and append rows.
- `src/app/components/ViewerHost.tsx`
  - `viewer.setOnViewerTransformChange(...)` updates only the active draft through `setActiveViewerTransformDraft(...)`.
  - `viewer.setOnViewerTransformCommit(...)` calls `commitActiveViewerTransformEntry()`.
  - `viewer.setOnViewerTransformHandleChange(...)` may promote shell into an active entry via `beginActiveViewerTransformEntry(...)`.
  - Viewer effects push `referenceWorkspace.transformOverrideById`, `contentObjectTransformOverrideById`, active sessions, and history overlays into the viewer.
- `src/app/components/ReferenceTransformToolbar.tsx`
  - Enter calls `getViewer()?.commitReferenceTransformSession()`.
  - Escape cancels active transform draft/session.
  - Keyboard mode shortcuts route through `routeKeyboardInput(...)` with `referenceTransformActive`.
  - The toolbar reads existing local transform-history rows for the "Viewer Transform History" section.
- `src/app/inputRouting.ts` and `src/app/inputRouting.test.ts`
  - Already route reference transform keyboard ownership separately from canonical edit-history undo/redo routing. Phase 1 should not change this.
- `src/viewer/ReferenceTransformHistoryHelper.ts` and `src/viewer/ReferenceTransformHistoryHelper.test.ts`
  - Render history overlays from local transform-history rows; these are read/projection helpers, not canonical undo owners.
- Existing tests:
  - `src/app/store/useAppStore.test.ts` covers transform history append, no duplicate unchanged commits, scrub insertion, scrub draft state, legacy row normalization, and history row edits.
  - `src/app/components/ViewerHost.test.tsx` covers viewer transform callbacks, draft updates, commit callback routing, history overlay VMs, reference/content-object sessions, and active handle promotion.
  - `src/app/components/ReferenceTransformToolbar.test.tsx` covers toolbar keyboard commit/cancel/mode behavior and displayed transform history.

#### First Pass Decisions

- Implement Phase 1 at the app-store commit seam, not inside the viewer or toolbar. The canonical entry should be created when `commitActiveViewerTransformEntry()` delegates to the reference/content-object commit path and the authored transform output actually changes.
- Keep live `setActiveViewerTransformDraft(...)`, `setActiveReferenceTransformDraft(...)`, and `setActiveContentObjectTransformDraft(...)` history-free.
- Start with supported authored Viewer Transform targets only: references and content objects. Environment-light transforms are viewer/scene presentation state for this phase and must remain no-entry.
- Preserve the current local transform-history rows. Undo/redo should restore the owned transform override map and matching local history rows for the target so the toolbar/history overlay remains consistent, but it should not capture camera pose, visible preview state, load/cache/provider state, selection-only state, or command transcript/recall.
- No-op commits are determined by normalized before/after target transform override and/or unchanged local history rows. They must create no canonical entry and must not invalidate redo.

### Phase 1 Implementation Spec

#### Likely Files

- `src/app/store/useAppStore.ts`
- New focused test file preferred: `src/app/store/viewerTransformEditHistoryStore.test.ts`
- `src/app/components/ViewerHost.test.tsx` only if callback-level proof is needed beyond store tests.
- `src/app/components/ReferenceTransformToolbar.test.tsx` only if toolbar commit/cancel behavior is touched.
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-5 - Viewer Transform Commit Undo Integration.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Exact Implementation Boundary

- Add a narrow Viewer Transform history snapshot/restore helper in `useAppStore.ts` for one target at a time.
- Snapshot only target-owned authored transform state:
  - reference target: `referenceWorkspace.transformOverrideById[referenceId]` and `referenceWorkspace.transformHistoryByReferenceId[referenceId]`.
  - content-object target: `referenceWorkspace.contentObjectTransformOverrideById[objectId]` and `referenceWorkspace.transformHistoryByObjectId[objectId]`.
- Add a history-aware commit wrapper around `commitActiveViewerTransformEntry()` or inside the delegated `commitActiveReferenceTransformEntry()` / `commitActiveContentObjectTransformEntry()` paths, whichever keeps the implementation smallest while preventing duplicate entries.
- Commit one canonical `Change Viewer transform` entry only when the committed transform changes for a supported target.
- Undo/redo should restore the target's transform override and local transform-history rows through `useAppStore.setState(...)` without restoring unrelated `referenceWorkspace` maps.
- Preserve existing local transform-history behavior: rows still append/normalize/scrub as they do today, toolbar/history overlay reads still work, and scrub insertion semantics stay unchanged.
- Environment-light transform commits, transform snap settings, row lock/edit/delete/merge controls, camera/navigation, and scrub index movement should create no canonical entries in Phase 1.

#### No-Widening Rule

Do not implement scrub acceptance UX, Build Path UI, persistence, collaboration, Gen 2/3 behavior, scene/material/environment undo, camera/navigation history, cache/provider/runtime history, provider/source load state undo, text-input undo routing, command transcript/recall undo, transform keyboard dispatch alignment, history panel UI, or unrelated Catalog/Pubwheel fixes. If the commit seam cannot be made canonical without refactoring ViewerHost/toolbar/viewer internals broadly, stop and report.

#### Implementation Risks

- `commitActiveViewerTransformEntry()` delegates to reference, content-object, or environment-light commit paths. The implementation must avoid giving environment-light scene state a canonical authored entry in Phase 1.
- Existing local transform-history rows are both UI-readable history and the source for scrub previews. Canonical undo/redo must keep those rows consistent without becoming a second row editor.
- Scrub insertion means a committed row can be inserted before future rows and replay the future. Snapshotting only the target-owned override and row list is safer than trying to reconstruct from deltas during undo/redo.
- `setReferenceTransformOverride(...)` also updates reference timeline deltas. Restore helpers should use the same narrow state shape or explicitly preserve timeline state if direct map restoration would skip needed derived timeline behavior. If restoring a committed transform correctly requires broad timeline/provider state capture, stop and report.
- ViewerHost callback tests may need a small assertion that live `setOnViewerTransformChange` drafts do not create canonical entries and that `setOnViewerTransformCommit` does, but broad ViewerHost reruns may have unrelated churn; keep verification scoped.

#### Checklist

- [x] Add target-scoped Viewer Transform snapshot/restore helper for reference and content-object targets.
- [x] Commit one canonical entry for changed reference translate/rotate/scale commits.
- [x] Commit one canonical entry for changed content-object translate/rotate/scale commits.
- [x] Prove undo/redo restores transform override and local history rows for the target.
- [x] Prove unchanged/no-op commits create no canonical entry.
- [x] Prove live draft updates create no canonical entry.
- [x] Prove scrub index movement creates no canonical entry and does not invalidate redo.
- [x] Prove environment-light transform commits remain outside canonical history in Phase 1.
- [x] Prove unrelated reference/content-object transform state, camera/view state, load/cache/provider-ish state, and command transcript/recall are not restored by transform undo/redo.

#### Focused Verification

- Run `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts` for the new focused store proof.
- Run `npm.cmd test -- --run src/app/store/useAppStore.test.ts -t "transform"` if existing transform-history store tests are touched or if the new test reuses helpers that may affect old local history behavior.
- Run `npm.cmd test -- --run src/app/components/ViewerHost.test.tsx -t "transform"` if ViewerHost callback wiring changes.
- Run `npm.cmd test -- --run src/app/components/ReferenceTransformToolbar.test.tsx -t "transform"` only if toolbar commit/cancel wiring changes.

#### Build Gate

- Run `npm.cmd run build` after focused tests pass.

#### Tracking Docs

- Implementation updates `docs/CHANGELOG.md` for shipped runtime/test behavior.
- Implementation updates this phase doc and its Doc History after focused verification and build pass.
- Implementation updates `docs/Doc-Log.md` for doc maintenance.
- Do not update the family index during Worker implementation; Manager handles `Edit-History-CLG-23` through `Edit-History-CLG-25` acceptance status after review.

#### Stop Condition

Stop and report instead of widening if committed transform state cannot be restored without capturing camera/view, scene/material/environment, cache/provider/runtime, timeline/provider-wide maps, Build Path, history UI, or broad viewer/toolbar refactors; if content-object transforms prove to be preview/runtime state rather than authored project content; or if keyboard dispatch changes are required to prove committed transform undo.

#### Done Shape

Phase 1 implementation is complete after `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts`, `npm.cmd test -- --run src/app/store/useAppStore.test.ts -t "transform"`, and `npm.cmd run build` passed on 2026-04-22. `Edit-History-CLG-23` can be recommended for Manager acceptance after reference and content-object committed transform entries undo/redo through canonical history. The first proof for `Edit-History-CLG-24` and `Edit-History-CLG-25` can be recommended because live draft updates and scrub index movement remain no-entry in focused tests.

## [x] `Edit-History-5 / Phase 2` - `Transform Dispatch And Local History Alignment`

Align transform-context undo dispatch and existing transform-history readers with the canonical owner.

### Phase 2 Summary

#### Purpose

Close `Edit-History-CLG-26` by proving the shipped Viewer Transform local history rows are projection/read state for authored transform commits while canonical undo/redo remains owned by `editHistoryStore`.

#### Owns

- `Edit-History-CLG-26` for reference/content-object Viewer Transform commits shipped in Phase 1.
- Focused proof that `Ctrl+Z` / `Ctrl+Y` dispatch already reaches the canonical edit-history owner in active transform contexts when canonical undo/redo is available.
- Focused proof that `Viewer Transform History` rows and toolbar readers refresh from canonical undo/redo restored state.
- Focused proof that local transform-history row controls and scrub movement remain local transform tools in this phase, not a second authored undo stack.

#### Does Not Own

- New canonical entries for transform history row edit/delete/lock/merge controls.
- Scrub acceptance UX or converting scrubbed preview state into authored transform commits.
- Environment-light, scene/material, camera/navigation, Build Path UI, history panel UI, persistence, collaboration, Gen 2/3 work, runtime/cache/provider state, command transcript/recall, native text-input undo, or unrelated Catalog/Pubwheel work.

#### Current Live Seams

- `src/app/inputRouting.ts`
  - `InputRoutingOwner` already includes `edit-history` and `reference-transform`.
  - `routeKeyboardInput(...)` checks editable targets first and defers native text undo/redo.
  - `Ctrl+Z` / `Meta+Z` route to `edit-history` only when `editHistoryCanUndo` is true.
  - `Ctrl+Y`, `Ctrl+Shift+Z`, and `Meta+Shift+Z` route to `edit-history` only when `editHistoryCanRedo` is true.
  - Transform-local keys still route separately: `Escape`, `m`, `r`, and `s` can route to `reference-transform`; `Tab` is not owned by this shared routing seam today.
  - `dispatchEditHistoryShortcut(...)` calls `owner.undo()` / `owner.redo()` only when the canonical owner can perform the requested operation.
- `src/app/console/useConsoleInteraction.ts`
  - The existing capture-phase `window.addEventListener('keydown', handleKeyDown, true)` calls `routeConsoleGlobalKey(event)`.
  - `routeConsoleGlobalKey(...)` passes `editHistoryStore.canUndo()` / `canRedo()` into `routeKeyboardInput(...)`.
  - Both docked and popout console global listeners call `dispatchEditHistoryShortcut(routing, event, editHistoryStore)` before local reference selection and console capture work.
  - This means no new broad keyboard manager is needed for Phase 2 unless focused tests prove transform contexts bypass this listener.
- `src/app/components/ReferenceTransformToolbar.tsx`
  - Imports `routeKeyboardInput(...)` for transform-local keyboard ownership, especially mode keys and Escape/cancel behavior.
  - Enter still commits via `getViewer()?.commitReferenceTransformSession()`.
  - Reads `selectActiveViewerTransformHistoryEntries(referenceWorkspace)` and `getReferenceTransformHistoryLatestScrubIndex(...)` for the `Viewer Transform History` section.
  - Local history controls call `toggleViewerTransformHistoryLock(...)`, `setViewerTransformHistoryEntryDeltaValue(...)`, `deleteViewerTransformHistoryEntry(...)`, `setActiveViewerTransformHistoryScrubIndex(...)`, and `mergeViewerTransformHistory(...)`.
- `src/app/components/ViewerHost.tsx`
  - Viewer commit callback already calls `commitActiveViewerTransformEntry()`, which Phase 1 made canonical for reference/content-object committed transforms.
  - Viewer change callbacks remain live draft updates and should stay no-entry.
- `src/app/store/useAppStore.ts`
  - Phase 1 canonical undo/redo restores target-owned transform override maps and local `transformHistoryByReferenceId` / `transformHistoryByObjectId` rows.
  - `selectActiveViewerTransformHistoryEntries(...)` reads those restored rows and is the clean seam for reader alignment proof.
- `src/app/store/editHistoryStore.ts`
  - Canonical `undo`, `redo`, `canUndo`, `canRedo`, `getUndoEntries`, and `getRedoEntries` own authored undo state.
- Existing tests:
  - `src/app/inputRouting.test.ts` already covers native text deferral, available/unavailable edit-history routing, dispatch ownership, viewer camera/fly priority, transform mode ownership, staged console recall, and console capture boundaries.
  - `src/app/store/viewerTransformEditHistoryStore.test.ts` covers canonical transform commit undo/redo, no-op/no-entry, live draft no-entry, scrub no-entry/no redo invalidation, environment-light exclusion, unrelated-state preservation, and explicit-null restore.
  - `src/app/components/ReferenceTransformToolbar.test.tsx` covers transform mode shortcuts, displayed path/history section, scrub/row controls, Enter/Escape-like toolbar behavior, and transform value/timeline controls.
  - `src/app/store/useAppStore.test.ts -t "transform"` covers local transform-history append, no duplicate unchanged commits, scrub insertion, row edits/deletes/locks/merge, and old transform row behavior.

#### First Pass Decisions

- Do not split Phase 2 unless implementation discovers that dispatch proof and reader alignment proof require separate runtime changes. Current research suggests one small test-focused implementation pass is enough.
- Treat canonical undo/redo routing as already implemented by Phase 3 of `Edit-History-1`; Phase 2 should add transform-context focused proof rather than a new keyboard dispatcher.
- Keep `Viewer Transform History` rows as target-local projection/read state restored by canonical entries. They are not themselves the canonical undo stack.
- Keep row edit/delete/lock/merge and scrub controls out of canonical authored entries in Phase 2. They remain local transform-history manipulation and preview/read controls unless a later phase explicitly turns a row operation into an authored commit.
- Use focused store/routing/toolbar tests to close `Edit-History-CLG-26`, with production code changes only if a missing seam is proven.

### Phase 2 Implementation Spec

#### Likely Files

- `src/app/inputRouting.test.ts`
- `src/app/store/viewerTransformEditHistoryStore.test.ts`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/store/useAppStore.test.ts` only if focused local-history read assertions need to live beside existing transform-history tests.
- `src/app/inputRouting.ts` only if a tiny transform-context route helper or missing test seam is required.
- `src/app/console/useConsoleInteraction.ts` only if focused proof shows transform contexts do not reach the existing canonical dispatch listener.
- `src/app/components/ReferenceTransformToolbar.tsx` only if reader refresh cannot be proven without a tiny selector/callback adjustment.
- Tracking docs after implementation: this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md`.

#### Exact Boundary

- Add or tighten focused routing tests proving available `Ctrl+Z` / `Ctrl+Y` still route to `edit-history` even when `referenceTransformActive` is true, while transform-local keys (`Escape`, `m`, `r`, `s`) still route to `reference-transform`.
- Add or tighten dispatch proof that `dispatchEditHistoryShortcut(...)` calls `editHistoryStore.undo()` / `redo()` for available canonical transform entries and leaves unavailable undo/redo unclaimed.
- Add focused store proof that after canonical transform undo/redo, `selectActiveViewerTransformHistoryEntries(...)` reads the restored target-local row list for references and content objects.
- Add focused toolbar proof only if needed: render the toolbar with an active transform shell and canonical transform history rows, perform canonical undo/redo through the store, and prove the `Viewer Transform History` section refreshes from restored rows without creating a second local undo stack.
- Add focused no-entry proof that row lock/delete/merge/scrub or row delta editing does not call canonical `editHistoryStore.commitEntry(...)` in Phase 2, unless the implementation pass explicitly discovers that one of those operations is already an authored commit seam required for `CLG-26`.

#### No-Widening Rule

Do not implement scrub acceptance UX, canonical entries for row edit/delete/lock/merge, Build Path UI, history panel UI, persistence, collaboration, Gen 2/3 work, scene/material/environment undo, camera/navigation history, cache/provider/runtime history, provider/source load state undo, command transcript/recall undo, native text-input undo changes, or unrelated Catalog/Pubwheel fixes. Do not refactor the global keyboard system or build a new transform-only keyboard manager.

#### Risks

- The global edit-history dispatch currently lives in console interaction capture listeners. If a transform-focused UI path runs without those listeners mounted, implementation may need a tiny integration seam or must stop and report rather than adding a broad keyboard manager.
- `ReferenceTransformToolbar` local row controls mutate the same local row arrays canonical undo/redo restores. Tests must distinguish row projection alignment from making row controls canonical authored entries.
- Toolbar tests are UI-heavy and may be brittle; prefer store/selector proof unless reader refresh genuinely requires mounted toolbar coverage.
- Transform history scrub can temporarily preview earlier rows. Phase 2 must not accidentally convert scrub position into canonical authored undo or invalidate canonical redo.

#### Checklist

- [x] Prove transform-context `Ctrl+Z` and redo shortcuts route to `edit-history` when canonical undo/redo is available.
- [x] Prove transform-local Escape/m/r/s ownership remains `reference-transform`.
- [x] Prove unavailable canonical undo/redo remains unclaimed in transform contexts.
- [x] Prove canonical transform undo/redo updates `selectActiveViewerTransformHistoryEntries(...)` reads for reference targets.
- [x] Prove canonical transform undo/redo updates `selectActiveViewerTransformHistoryEntries(...)` reads for content-object targets.
- [x] Prove local row edit/delete/lock/merge controls remain outside canonical edit history in this phase.
- [x] Preserve Phase 1 live draft, scrub, environment-light, explicit-null, and unrelated-state boundaries.

#### Focused Verification

- Run `npm.cmd test -- --run src/app/inputRouting.test.ts` if routing proof is added or changed.
- Run `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts` for canonical transform owner and reader alignment proof.
- Run `npm.cmd test -- --run src/app/components/ReferenceTransformToolbar.test.tsx -t "history"` if toolbar reader rendering is touched or needs UI proof.
- Run `npm.cmd test -- --run src/app/store/useAppStore.test.ts -t "transform"` if existing transform-history store behavior is touched or assertions are added there.

#### Build Gate

- Run `npm.cmd run build` after focused tests pass.

#### Tracking Docs

- Prep updates only this phase doc and `docs/Doc-Log.md`.
- Implementation updates `docs/CHANGELOG.md` for shipped runtime/test behavior.
- Implementation updates this phase doc and its Doc History after focused verification and build pass.
- Implementation updates `docs/Doc-Log.md` for doc maintenance.
- Do not update the family index during Worker implementation; Manager handles `Edit-History-CLG-26` acceptance status after review.

#### Stop Condition

Stop and report instead of widening if `Ctrl+Z` / `Ctrl+Y` in active transform contexts cannot be proven without a broad app-shell keyboard refactor; if toolbar reader alignment requires rewriting Viewer Transform History row ownership; if local row controls must become canonical authored commits to pass `CLG-26`; or if any fix would capture camera/view, scrub preview, scene/material/environment, runtime/cache/provider, Build Path, history UI, or unrelated Catalog/Pubwheel state.

#### Done Shape

Phase 2 implementation is complete after `npm.cmd test -- --run src/app/inputRouting.test.ts`, `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts`, and `npm.cmd run build` passed on 2026-04-22. `Edit-History-CLG-26` can be recommended for Manager acceptance because canonical undo/redo is proven to own authored transform reversal in transform contexts and existing Viewer Transform History rows/readers are proven to refresh from canonical restored state without becoming a second undo stack.

## [x] `Edit-History-5 / Phase 3` - `Scrub And Preview Boundary`

Lock the scrub/navigation boundary.

Implementation direction:
- moving through transform history or timeline preview should not automatically be an authored edit
- if a scrubbed state is later accepted as authored truth, that acceptance can become a separate committed entry

Acceptance:
- transform scrub movement does not create canonical entries
- accepting a transformed authored result can create one entry if the app has such a commit action
- camera and view movement remain outside canonical undo

Manager closeout:
- No separate implementation pass is required for Phase 3 in the current app shell.
- Phase 1 proved scrub movement remains no-entry and does not invalidate canonical redo.
- Phase 2 proved transform row controls/readers remain local projection state rather than a second canonical undo stack.
- No current scrub-acceptance authored commit seam exists to implement without widening into a new UX.

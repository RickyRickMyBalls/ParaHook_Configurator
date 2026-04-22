# Edit History 4 - Browser Project Content And Accepted Import Undo Coverage

## Doc Header

### Doc History
21. 2026-04-22 03:23:43: Manager accepted `Edit-History-4 / Phase 3.2 - Catalog Add To Project Commit Entries` after reviewing the Catalog-only snapshot repair, rerunning focused Import/Catalog history tests, rerunning Catalog commit eligibility tests, rerunning the focused CatalogSurface Add To Project slice with only the unrelated current heading expectation drift remaining, rerunning the production build, and marking `Edit-History-CLG-21`, `Edit-History-CLG-22`, and `Edit-History-HLG-3` complete.
20. 2026-04-22 03:21:44: Repaired `Edit-History-4 / Phase 3.2 - Catalog Add To Project Commit Entries` so direct Catalog Add To Project undo/redo uses a Catalog-only imported-reference snapshot that excludes `projectContent`, added proof that raw project-content mutations made after a Catalog add survive undo/redo of the `Add Catalog item to project` entry, and reran focused Catalog history verification.
19. 2026-04-22 03:18:08: Implemented `Edit-History-4 / Phase 3.2 - Catalog Add To Project Commit Entries` by adding a history-aware direct Catalog imported-reference add wrapper, routing eligible CatalogSurface Add To Project commits through that wrapper, proving one canonical `Add Catalog item to project` entry with same-id undo/redo restoration, preserving raw imported-reference setup as history-free, and recording the focused CatalogSurface Add To Project rerun's unrelated `Imported Catalog Entries` heading expectation drift while leaving final CLG acceptance to Manager review.
18. 2026-04-22 03:14:13: Manager accepted `Edit-History-4 / Phase 3.1 - Accepted Import Commit Entries` after reviewing the narrowed accepted Import restore payload, rerunning focused accepted Import history tests, rerunning targeted staged Import regression verification, rerunning the production build, and marking `Edit-History-CLG-20` complete while keeping direct Catalog/Add To Project and final `Edit-History-CLG-22` closeout open for `Phase 3.2`.
17. 2026-04-22 03:12:37: Repaired `Edit-History-4 / Phase 3.1 - Accepted Import Commit Entries` by narrowing accepted Import reference restoration to the imported reference ids and content-order keys touched by the accepted entry, adding proof that unrelated pre-existing imported-reference display/load/transform-ish state changed after accept survives `Accept Import` undo/redo, rerunning focused accepted Import history verification, targeted staged Import regression verification, and production build verification.
16. 2026-04-22 03:08:00: Implemented `Edit-History-4 / Phase 3.1 - Accepted Import Commit Entries` by adding a narrow accepted Import snapshot/restore path, routing Browser staged Import acceptance through `commitStagedImportDraftWithHistory(...)`, proving one canonical `Accept Import` entry for successful and partial accepted commits, no-entry behavior for raw/no-draft/no-file/failed-only commits, excluded staged draft/session/selection/transform preference/command transcript state preservation, focused accepted Import history verification, targeted staged Import regression verification, and production build verification while leaving direct Catalog/Add To Project history to `Phase 3.2`.
15. 2026-04-22 03:03:18: Manager approved the split `Edit-History-4 / Phase 3` prep and cleared `Edit-History-4 / Phase 3.1 - Accepted Import Commit Entries` for implementation after confirming `commitStagedImportDraft(...)` is the accepted Import mutation seam, Browser controller acceptance owns local selection/result/draft-close behavior, direct Catalog Add To Project should remain a later subphase, and accepted Import undo/redo must restore durable accepted content without restoring staged drafts, preview/session state, provider/cache/source browsing state, command transcript/recall, or new object URL lifecycle behavior.
14. 2026-04-22 03:01:41: Tightened `Edit-History-4 / Phase 3 - Accepted Import And Catalog Commits` into a Worker-ready prep spec, splitting the next implementation ladder into accepted staged Import commits in `Phase 3.1` and direct Catalog/Add To Project commits in `Phase 3.2` after live seam research showed `commitStagedImportDraft(...)` and CatalogSurface `addImportedReference(...)` handoffs have different commit boundaries and exclusion risks.
13. 2026-04-22 02:58:48: Manager accepted `Edit-History-4 / Phase 2 - Durable Create And Delete Entries` after reviewing the app-store Browser create/delete wrappers, controller routing, stable snapshot redo behavior, subtree delete restoration, raw and invalid no-entry coverage, rerunning focused Browser organization history tests, rerunning the production build, and marking `Edit-History-CLG-19` complete while keeping accepted Import/Catalog commits and excluded Browser/runtime state open.
12. 2026-04-22 02:54:21: Implemented `Edit-History-4 / Phase 2 - Durable Create And Delete Entries` by adding Browser/project create/delete canonical history wrappers for authored assemblies and components, routing Browser controller create/delete callbacks through those wrappers, proving stable create redo ids, subtree delete undo/redo, raw base-method history-free behavior, invalid no-entry paths, excluded-state preservation, focused Browser organization history tests, production build verification, and the known unrelated staged-import BrowserPanel failures.
11. 2026-04-22 02:51:04: Manager approved the prepped `Edit-History-4 / Phase 2 - Durable Create And Delete Entries` spec after confirming the live authored assembly/component create/delete seams, stable redo-by-snapshot direction, delete-subtree restoration requirement, and excluded-state boundary around Browser selection, rename prompts, confirmation flow, Import/Catalog sessions, provider/cache/preview state, console transcript/recall, Viewer Transform, and Build Path.
10. 2026-04-22 02:49:05: Tightened `Edit-History-4 / Phase 2 - Durable Create And Delete Entries` into a Worker-ready prep spec grounded in the live app-store Browser/project create/delete seams, Browser controller/context-menu routing, existing subtree delete tests, and the accepted Browser organization history helpers while keeping accepted Import/Catalog commits, source browsing, provider/cache/preview state, unaccepted import sessions, selection-only state, expand/collapse, console transcript/recall, history UI, persistence, Viewer Transform, and Build Path deferred.
9. 2026-04-22 02:48:02: Manager accepted `Edit-History-4 / Phase 1.2 - Browser Drop Organization Entries` after reviewing the completed-drop coalescing implementation and rerunning focused Browser organization history, targeted BrowserPanel drop/controller, and production build verification, then marked `Edit-History-CLG-18` complete while keeping create/delete, Import/Catalog commits, and excluded Browser/runtime state open.
8. 2026-04-22 02:45:48: Implemented `Edit-History-4 / Phase 1.2 - Browser Drop Organization Entries` by adding completed Browser drop organization history through a one-entry-per-user-drop controller boundary, focused reorder/reparent/grouped-drop/no-entry/exclusion coverage, production build verification, and a note that the broad BrowserPanel rerun still has unrelated staged-import expectation failures outside this drop-history slice.
7. 2026-04-22 02:39:59: Manager approved `Edit-History-4 / Phase 1.2 - Browser Drop Organization Entries` after rereading the completed Browser drop controller path, the single-drop multi-move fanout, the existing single and batch move seams, and the narrow project organization state that can be restored without making Browser selection, expand/collapse, drag preview/session state, console transcript/recall, provider/cache/preview, or runtime/build state authored history.
6. 2026-04-22 02:39:12: Manager accepted `Edit-History-4 / Phase 1.1 - Browser Rename Entries` after reviewing the app-store wrapper, Browser rename routing, focused rename-history coverage, and local production build proof, then marked `Edit-History-CLG-17` complete while keeping completed-drop organization, create/delete, Import/Catalog commits, and excluded Browser/runtime state open.
5. 2026-04-22 02:36:47: Implemented `Edit-History-4 / Phase 1.1 - Browser Rename Entries` by adding Browser/project rename canonical history through the app-store rename seam, focused assembly/component undo-redo and no-entry proof, Browser controller rename routing, production build verification, and a note that the broad BrowserPanel rerun still has unrelated staged-import expectation failures outside this rename slice.
4. 2026-04-22 02:33:02: Manager approved the repaired `Edit-History-4 / Phase 1.1 - Browser Rename Entries` prep after confirming the narrowed Browser/project rename-only scope, the existing `renameProjectContentOwner(...)` validation seam, the deferred completed-drop multi-move risk for `Phase 1.2`, and the no-widening boundary around create/delete, Import/Catalog commits, preview/cache/provider state, selection-only state, expand/collapse, console recall, UI history, and persistence.
3. 2026-04-22 02:29:56: Repaired `Edit-History-4 / Phase 1` prep by splitting the next implementation ladder into `Phase 1.1 - Browser Rename Entries` for `Edit-History-CLG-17` and later `Phase 1.2 - Browser Drop Organization Entries` for `Edit-History-CLG-18`, keeping completed-drop multi-move collapse, create/delete, accepted Import/Catalog commits, and excluded Browser/runtime state out of the immediate implementation pass.
2. 2026-04-22 02:28:21: Tightened `Edit-History-4 / Phase 1 - Browser Organization Entries` into a Worker-ready prep spec grounded in the live Browser/project store, panel controller, drag/drop, context-menu, selection, expand/collapse, and console-adjacent seams while keeping create/delete, accepted Import/Catalog commits, source browsing, preview/cache/provider status, selection-only state, expand/collapse state, history UI, persistence, and later generations deferred.
1. 2026-04-22 00:11:26: Created this `Edit History` future plan for Browser/project content organization, durable create/delete/rename/reorder/reparent commits, accepted Import or Catalog project commits, and console parity over those authored content seams.

### Purpose

This plan widens canonical undo/redo into project content organization and accepted content commits.

## Doc Body

### Scope

In scope:
- Browser/project rename
- reorder
- reparent
- create/delete where already supported
- accepted Import commits that add or replace durable project content
- accepted Catalog/Add To Project commits that add durable project content
- console commands over the same content mutation seams

Out of scope:
- Browser selection-only state
- collapse/expand state unless later modeled as durable user-authored layout
- source browsing, provider load, preview readiness, cache, and metadata refresh status
- Import preview sessions before acceptance
- Catalog preview sessions before `Add To Project`

### Acceptance Read

This phase is complete when durable project content organization and accepted content additions/removals can undo and redo through canonical history without treating preview, cache, provider, or selection state as authored undo.

## Vision

Users expect project organization to be recoverable.

If they rename, delete, move, reparent, or accept imported/catalog content into the project, undo should know what happened. If they merely browse sources, wait for a provider, inspect a preview, or select a row, canonical authored undo should stay quiet.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-HLG-3` - Make Browser/project organization and accepted import/catalog commits undoable without making selection, visibility-only, preview, cache, or provider status noise canonical.
- [ ] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.

### `Edit-History-4`

- [x] `Edit-History-CLG-17` - Make Browser/project rename commits undoable.
- [x] `Edit-History-CLG-18` - Make reorder and reparent commits undoable as one entry on drop.
- [x] `Edit-History-CLG-19` - Make durable create/delete operations undoable where the app already supports them.
- [x] `Edit-History-CLG-20` - Make accepted Import commits undoable after they mutate project content.
- [x] `Edit-History-CLG-21` - Make accepted Catalog/Add To Project commits undoable after they mutate project content.
- [x] `Edit-History-CLG-22` - Keep source browsing, previews, cache status, provider status, selection-only state, and unaccepted import/catalog sessions outside canonical undo.

## [x] `Edit-History-4 / Phase 1.1` - `Browser Rename Entries`

Add canonical entries for durable Browser/project rename commits.

### Phase 1.1 Summary

#### Purpose

Make stable Browser/project rename commits undoable through canonical edit history without treating Browser selection, expansion, preview, provider, cache, runtime state, command transcript, or command recall as authored project content.

#### Owns

- `Edit-History-CLG-17` only.
- Stable Browser/project content-owner rename commits through the existing rename validation path.
- One canonical `Rename Browser item` entry only when the normalized stored label changes.
- Undo/redo restoration of assembly and component labels through the app-store project-content path.
- No-entry protection for unchanged normalized labels, missing owners, unsupported owners, and existing rename validation failures.

#### Does Not Own

- Completed Browser drag/drop reorder or reparent; that moves to `Edit-History-4 / Phase 1.2`.
- Durable create/delete implementation; that stays in `Edit-History-4 / Phase 2`.
- Accepted Import and Catalog/Add To Project commits; those stay in later `Edit-History-4` phases.
- Catalog source browsing, Import preview sessions, provider/cache/preview readiness, metadata refresh, runtime build status, or source-library state.
- Browser selection-only state, hover/focus state, drag-preview state, command transcript entries, command recall, and console context-sync/status entries.
- Expand/collapse state unless a later phase deliberately models it as durable authored layout.
- Viewer Transform, Build Path, history UI, persistence, collaboration, Gen 2/3 work, or console parity for project organization commands.

#### Current Live Seams

- `src/app/store/useAppStore.ts`
  - Project content records live under `projectContent.assembliesById`, `projectContent.componentsById`, and `projectContent.objectsById`.
  - Durable authored rename seam: `renameProjectContentOwner(target, label): boolean`.
  - Adjacent but deferred organization seams: `moveProjectContentOwner(draggedTarget, dropTarget): boolean` and `moveProjectContentOwnersBatch(draggedTargets, dropTarget): boolean`.
  - Adjacent but deferred create/delete seams: `createProjectAssembly()`, `createProjectComponent(parentAssemblyId)`, and `deleteProjectContentOwner(target)`.
  - Component rename is already restricted to authored components. Assembly rename validation must be preserved exactly, including any current unsupported/missing-target failures.
- `src/app/panels/useBrowserPanelController.ts`
  - Rename UI calls `promptForContentOwnerRename(...)`, then `renameProjectContentOwner(...)`.
  - Browser create/delete callbacks call the adjacent store seams but remain out of Phase 1 implementation.
  - Browser local state owns `collapsedContentRowIds`, `expandedGraphDocumentIds`, `graphSectionExpandedByRowId`, `localSelectedBrowserRowId`, and drag preview/session state; these remain excluded from canonical history payloads.
- `src/app/panels/browserContentDrag.ts`
  - Pure drag-session and preview owner. It is named here only as an exclusion seam; keep it history-free in Phase 1.1.
- `src/app/panels/browserContextMenu.ts`
  - Context-menu routing exposes create, rename, and delete callbacks. Phase 1 should route only the rename callback through history.
- Existing focused tests:
  - `src/app/store/useAppStore.test.ts` covers project-content owner behavior and can provide rename validation context if needed.
  - A new focused `src/app/store/browserOrganizationEditHistoryStore.test.ts` should prove rename history behavior without broad Browser UI churn.
  - `src/app/panels/BrowserPanel.test.tsx` is needed only if the rename callback wiring has to move from the existing controller path.
  - `src/app/panels/browserInteractions.test.ts` covers selection and expand/collapse behavior that must remain non-authored history.
  - `src/app/panels/browserContextMenu.test.ts` covers context-menu callback availability.
- Console/app-shell routing:
  - The Browser panel appends status text and requests console context sync, but this prep found no accepted console command seam that mutates Browser organization. Console parity is therefore not a Phase 1 implementation requirement.

#### First Pass Decisions

- Keep low-level pure drag/drop decision helpers pure; do not import `editHistoryStore` into `browserContentDrag.ts`.
- Prefer a narrow app-store or app-store-adjacent helper that snapshots the target label before and after the accepted rename mutation and commits a canonical `EditHistoryEntry` only when the normalized authored label changes.
- Preserve `renameProjectContentOwner(...)` validation and return behavior; history should wrap the accepted mutation, not replace validation.
- Do not include reorder/reparent in Phase 1.1. Completed-drop history needs a separate design because a single Browser drop can fan out into multiple low-level move calls.
- Restore labels only; do not restore Browser selection, local expand/collapse, preview/cache/provider/runtime state, command transcript, or command recall.

### Phase 1.1 Implementation Spec

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/browserOrganizationEditHistoryStore.test.ts`
- `src/app/panels/useBrowserPanelController.ts` only if UI callback wiring is required to route existing Browser rename through the history-aware seam.
- `src/app/panels/BrowserPanel.test.tsx` only if controller rename wiring changes require live UI proof.
- `src/app/panels/browserInteractions.test.ts` only if selection or expand/collapse exclusion proof needs tightening.
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Exact Implementation Boundary

- Add canonical history for durable Browser rename only:
  - Route stable Browser/project rename commits through a history-aware Browser/project rename seam.
  - Call or preserve the existing `renameProjectContentOwner(...)` validation and return behavior.
  - Commit one entry only after the stored label changed.
- Use stable entry metadata:
  - label `Rename Browser item`
  - source metadata identifying the Browser/project organization surface
  - target id/label for the renamed owner when stable
- Restore only authored project organization state required for label undo and redo. Candidate snapshot field:
  - `projectContent`
- Do not restore or snapshot:
  - Browser local row selection
  - app workspace selection unless existing store mutation requires current behavior for the live operation
  - collapse/expand state
  - drag preview/session state
  - console transcript/recall
  - provider/cache/preview/build/runtime status
- Preserve existing store validation and return values. History should not make a previously invalid rename succeed.
- Preserve redo invalidation through the canonical owner by committing ordinary synchronous `EditHistoryEntry` values.

#### No-Widening Rule

Do not implement reorder/reparent/drop history, create/delete history, Import or Catalog accepted-content history, Catalog browsing, provider/cache/preview ownership, durable layout for expand/collapse, source metadata refresh, Viewer Transform, Build Path, history panel UI, persistence, collaboration, or new console command language in Phase 1.1.

#### Implementation Risks

- `renameProjectContentOwner(...)` has different validation by target kind. Component rename is authored-only; assembly rename must be reviewed so Phase 1 does not accidentally present history for runtime/reference roots.
- The UI rename path currently lives inside `useBrowserPanelController.ts`; if direct store wrapping is enough, avoid UI changes.
- Selection and console status updates can occur near Browser rename flows. History payloads should avoid making either an authored restore requirement.

#### Checklist

- [x] Add a focused Browser rename history helper or store seam.
- [x] Prove rename creates one canonical entry only when the stored label changes.
- [x] Prove rename undo/redo restores assembly labels.
- [x] Prove rename undo/redo restores component labels.
- [x] Prove unchanged normalized labels, missing owners, and unsupported owners create no entries and preserve existing return behavior.
- [x] Prove selection-only and expand/collapse interactions remain outside canonical history.
- [x] Keep reorder/reparent, create/delete, Import, Catalog, provider/cache/preview, and console command parity deferred.

#### Focused Verification

- Run the new/touched focused Browser rename history test:
  - `npm.cmd test -- --run src/app/store/browserOrganizationEditHistoryStore.test.ts`
- If existing app-store project-content behavior is touched beyond the new helper, run:
  - `npm.cmd test -- --run src/app/store/useAppStore.test.ts`
- If Browser controller rename wiring is touched, run:
  - `npm.cmd test -- --run src/app/panels/BrowserPanel.test.tsx`
- If selection or expand/collapse exclusion coverage is touched, run:
  - `npm.cmd test -- --run src/app/panels/browserInteractions.test.ts`

#### Build Gate

- `npm.cmd run build`

#### Tracking Docs

- Implementation updates `docs/CHANGELOG.md` for shipped runtime/test behavior.
- Implementation updates this phase doc and its Doc History after focused verification and build pass.
- Implementation updates `docs/Doc-Log.md` for doc maintenance.
- Do not update the family index during Worker implementation; Manager handles `Edit-History-CLG-17` and `Edit-History-CLG-18` acceptance status after review.

#### Stop Condition

Stop and report instead of widening if rename validation is too ambiguous to keep authored project content separate from runtime/reference roots, if rename history requires broad Browser controller refactoring, if restore cannot be limited to project-content labels, or if reorder/reparent/create/delete support becomes necessary to prove rename behavior.

#### Done Shape

- Phase 1.1 is implementation-complete after focused Browser rename history tests and `npm.cmd run build` passed on 2026-04-22 02:36:47. The broader `BrowserPanel.test.tsx` rerun still has two unrelated staged-import expectation failures around `Multiple objects` and `Inspection failed`; those are outside this rename slice and were not widened into.
- `Edit-History-CLG-17` closed after Manager acceptance on 2026-04-22 02:39:12.
- `Edit-History-CLG-18` remains open for `Edit-History-4 / Phase 1.2`.
- `Edit-History-CLG-19` through `Edit-History-CLG-22` remain open for later phases.

## [x] `Edit-History-4 / Phase 1.2` - `Browser Drop Organization Entries`

Add canonical entries for completed Browser/project reorder and reparent drops.

### Phase 1.2 Summary

#### Purpose

Make completed Browser/project drop organization undoable as one canonical entry per user drop after rename history is stable.

#### Owns

- `Edit-History-CLG-18` only.
- Completed reorder drops.
- Completed reparent drops.
- Grouped moves and multi-step move collapse as one canonical entry per completed user drop.
- Undo/redo restoration of content order and parentage without making Browser selection, expand/collapse, preview/cache/provider/runtime, command transcript, or command recall authored history.

#### Does Not Own

- Rename commits; those belong to `Edit-History-4 / Phase 1.1`.
- Durable create/delete implementation; that stays in `Edit-History-4 / Phase 2`.
- Accepted Import/Catalog commits and source browsing/provider/cache/preview state; those stay in later phases.
- New drop behavior, new Browser grammar, history UI, persistence, collaboration, or console command parity.

#### Current Live Seams

- `src/app/store/useAppStore.ts`
  - `moveProjectContentOwner(draggedTarget, dropTarget): boolean`
  - `moveProjectContentOwnersBatch(draggedTargets, dropTarget): boolean`
  - `resolveBrowserDraggableTargetDrop(...)`
  - `referenceWorkspace.contentOrderByParentKey` and `runtimeContentPlacementByRowId` are touched by some move paths and must be handled without broad provider/cache/preview snapshots.
- `src/app/panels/useBrowserPanelController.ts`
  - Completed Browser drop can call the move seam once or, for some cross-parent land-beside-child paths, more than once for one user gesture.
  - This is the reason Phase 1.2 is separate: history must commit one entry for the completed drop, not one entry per low-level move.
- `src/app/panels/browserContentDrag.ts`
  - Pure drag-session and preview owner; it should remain history-free.
- Existing focused tests:
  - `src/app/store/useAppStore.test.ts` covers reorder, reparent, batch move rollback, reference ordering overlays, and delete-adjacent behavior.
  - `src/app/panels/BrowserPanel.test.tsx` covers same-parent, cross-parent, grouped, and collapsed-row drops.
  - `src/app/panels/browserInteractions.test.ts` covers excluded selection and expand/collapse behavior.

### Phase 1.2 Implementation Spec

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/store/browserOrganizationEditHistoryStore.test.ts` or a separate focused drop-history test if rename coverage grows too large.
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts` only if exclusion coverage needs tightening.
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Exact Implementation Boundary

- Commit one canonical `Move Browser item` entry per completed user drop, after all internal move calls for that gesture finish.
- Restore authored organization state needed for order and parentage:
  - `projectContent`
  - `referenceWorkspace.contentOrderByParentKey` only when needed for existing reference ordering overlays
  - `runtimeContentPlacementByRowId` only to preserve existing content placement side effects of move paths
- Do not restore Browser local selection, expand/collapse, drag preview/session state, console transcript/recall, or provider/cache/preview/build/runtime state.
- Preserve existing move validation, grouped move rollback, and return behavior.

#### No-Widening Rule

Do not implement rename, create/delete, accepted Import/Catalog commits, source browsing/cache/provider state, durable expand/collapse layout, history UI, persistence, collaboration, new Browser drag/drop behavior, or console command language in Phase 1.2.

#### Implementation Risks

- A single user drop may fan out into multiple low-level store moves; the implementation must wrap the completed-drop boundary or otherwise coalesce those internal mutations.
- Grouped moves already have rollback behavior; history wrapping must not break it.
- Reference ordering overlays and runtime placement updates must be preserved narrowly without treating provider/cache/preview state as authored.

#### Checklist

- [x] Add or extend a focused Browser drop organization history helper.
- [x] Prove same-parent reorder creates one entry and undo/redo restores order.
- [x] Prove reparent creates one entry and undo/redo restores parent plus order.
- [x] Prove grouped or multi-step drops create one entry per completed user drop.
- [x] Prove invalid/no-change drops create no entries.
- [x] Prove selection-only and expand/collapse behavior remains outside canonical history.

#### Focused Verification

- `npm.cmd test -- --run src/app/store/browserOrganizationEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/store/useAppStore.test.ts`
- `npm.cmd test -- --run src/app/panels/BrowserPanel.test.tsx`
- `npm.cmd test -- --run src/app/panels/browserInteractions.test.ts` if touched

#### Build Gate

- `npm.cmd run build`

#### Tracking Docs

- Implementation updates `docs/CHANGELOG.md` for shipped runtime/test behavior.
- Implementation updates this phase doc and its Doc History after focused verification and build pass.
- Implementation updates `docs/Doc-Log.md` for doc maintenance.
- Do not update the family index during Worker implementation; Manager handles `Edit-History-CLG-18` acceptance status after review.

#### Stop Condition

Stop and report instead of widening if completed-drop coalescing requires broad Browser controller redesign, if move restore cannot stay limited to project organization and existing placement/order side effects, or if create/delete support becomes necessary to prove reorder/reparent behavior.

#### Done Shape

- Phase 1.2 is implementation-complete after focused Browser organization history tests and `npm.cmd run build` passed on 2026-04-22 02:45:48. The broader `BrowserPanel.test.tsx` rerun still has two unrelated staged-import expectation failures around `Multiple objects` and `Inspection failed`; those are outside this drop-history slice and were not widened into.
- `Edit-History-CLG-18` closed after Manager acceptance on 2026-04-22 02:48:02.
- `Edit-History-CLG-19` through `Edit-History-CLG-22` remain open for later phases.

## [x] `Edit-History-4 / Phase 2` - `Durable Create And Delete Entries`

Add canonical entries for durable project create/delete where already supported.

### Phase 2 Summary

#### Purpose

Make stable Browser/project authored create/delete commits undoable through canonical edit history while preserving the existing app-store validation, return values, Browser controller behavior, and the strict boundary around non-authored Browser/runtime state.

#### Owns

- `Edit-History-CLG-19` only.
- Durable authored assembly creation through `createProjectAssembly()`.
- Durable authored component creation through `createProjectComponent(parentAssemblyId)`.
- Durable authored assembly and component deletion through `deleteProjectContentOwner(target)`.
- Undo/redo restoration of authored project-content structure, child order, and deleted authored subtree payloads where the current store seam already supports them.
- No-entry protection for missing parents, missing owners, unsupported/non-authored owners, unchanged restore snapshots, and validation failures.

#### Does Not Own

- Accepted Import commits; those stay in `Edit-History-4 / Phase 3`.
- Accepted Catalog/Add To Project commits; those stay in later `Edit-History-4` phases.
- Catalog source browsing, provider/cache/preview state, unaccepted import sessions, staged import preview organization, source metadata refresh, imported reference add/remove, imported-reference explode/remove, and asset URL lifetime ownership.
- Browser selection-only state, local row selection, expand/collapse state, hover/focus, drag preview/session state, command transcript entries, command recall, console context-sync/status entries, history UI, persistence, collaboration, Viewer Transform, and Build Path.
- New Browser command language or new create/delete product behavior.

#### Current Live Seams

- `src/app/store/useAppStore.ts`
  - `createProjectAssembly()` always creates a top-level authored assembly, selects it, sets `activeSurface` to `viewer`, and returns the new assembly id.
  - `createProjectComponent(parentAssemblyId)` validates the parent assembly, creates an authored component under that assembly, selects it, sets `activeSurface` to `viewer`, and returns the new component id or `null`.
  - `deleteProjectContentOwner(target)` supports authored assemblies and authored components only. Assembly delete removes nested authored assembly/component/object subtree records; component delete removes the component and child object records; both return `false` for missing or unsupported targets and prune selection for deleted content.
  - The accepted Phase 1.2 helper already has a narrow project-organization restore pattern for `projectContent`, `referenceWorkspace.contentOrderByParentKey`, and `runtimeContentPlacementByRowId`; Phase 2 can reuse or generalize that shape if create/delete must preserve order overlays or runtime placement side effects.
- `src/app/panels/useBrowserPanelController.ts`
  - `handleCreateAssembly` calls `createProjectAssembly()`, selects the created row locally, syncs console context, then prompts rename.
  - `handleCreateComponent` calls `createProjectComponent(assemblyId)`, exits on `null`, selects the created row locally, syncs console context, then prompts rename.
  - `handleDeleteContentOwner` asks for confirmation when the target has children, calls `deleteProjectContentOwner(target)`, exits on `false`, then clears local selected row, syncs console context, and appends a Browser transcript entry.
- `src/app/panels/browserContextMenu.ts`
  - Adds `New Assembly`, `New Component`, and `Delete` menu items only where the row and capability predicates allow them.
  - Delete menu items are limited to authored assembly/component owner targets; imported/source-backed remove paths use separate reference handlers and stay out of this phase.
- Existing focused tests:
  - `src/app/store/useAppStore.test.ts` includes project-content delete behavior, subtree removal, content move/reparent behavior, imported reference removal, and console context capability coverage.
  - `src/app/store/browserOrganizationEditHistoryStore.test.ts` is the closest focused Browser edit-history file and should likely grow Phase 2 create/delete coverage unless a sibling `browserContentEditHistoryStore.test.ts` keeps the proof clearer.
  - `src/app/panels/BrowserPanel.test.tsx` covers menu-level create/delete routing but currently has unrelated staged-import expectation failures; use it only if implementation changes UI callback wiring.
  - `src/app/panels/browserContextMenu.test.ts` can cover context-menu availability/routing only if the implementation touches menu wiring.

#### First Pass Decisions

- Prefer app-store history-aware wrappers for create/delete, similar to `renameProjectContentOwnerWithHistory(...)`, while keeping base `createProjectAssembly()`, `createProjectComponent(...)`, and `deleteProjectContentOwner(...)` return behavior available.
- Create history should commit after the base create succeeds and undo by restoring the before authored content snapshot. Redo should restore the after snapshot with the same generated id and label.
- Delete history should capture before/after snapshots around the base delete and commit only when the base delete returns `true` and authored content actually changed.
- Use a narrow Browser content history source and stable labels such as `Create Browser item` and `Delete Browser item`; include target id/label metadata from the created/deleted assembly/component where available.
- Restore authored content and the minimal order/placement side effects needed for the project tree only. Do not restore Browser local selection, local row selection, expand/collapse, command transcript, console context-sync status, preview/cache/provider/runtime state, or active surface.
- Treat delete of imported/reference-backed content, source-root rows, runtime roots, and non-authored components as unsupported/no-entry for this phase.

### Phase 2 Implementation Spec

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/browserOrganizationEditHistoryStore.test.ts` or a new focused sibling such as `src/app/store/browserContentEditHistoryStore.test.ts`
- `src/app/panels/useBrowserPanelController.ts` only if Browser UI callback routing must switch to history-aware wrappers.
- `src/app/panels/BrowserPanel.test.tsx` only if controller callback wiring changes and the focused store proof is insufficient.
- `src/app/panels/browserContextMenu.test.ts` only if context-menu routing/capability wiring changes.
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Exact Implementation Boundary

- Add canonical history for successful authored assembly create.
- Add canonical history for successful authored component create under an existing assembly.
- Add canonical history for successful authored assembly delete, including restorable child assembly/component/object subtree payloads.
- Add canonical history for successful authored component delete, including restorable child object payloads and parent assembly child order.
- Preserve the base store methods' existing validation and return values. If adding wrapper methods, route Browser controller create/delete callbacks through wrappers while leaving direct base methods history-free unless tests prove the store API itself is the accepted authored command seam.
- Use before/after project-content snapshots or an equivalent normalized authored payload that restores order and parentage through the app-store project-content path.
- Do not capture or restore local Browser selection, workspace selection, expand/collapse, active surface, preview/cache/provider/runtime state, command transcript, command recall, or unaccepted Import/Catalog session state.

#### No-Widening Rule

Do not implement accepted Import commits, accepted Catalog/Add To Project commits, source browsing/cache/provider/preview ownership, imported reference add/remove/explode history, unaccepted import sessions, staged preview organization history, durable expand/collapse layout, selection-only history, history UI, persistence, collaboration, new Browser command language, Viewer Transform, or Build Path in Phase 2.

#### Implementation Risks

- `createProjectAssembly()` and `createProjectComponent(...)` currently perform selection/active-surface side effects. Undo/redo should not replay or restore those excluded state changes unless the base create path makes that unavoidable; prefer snapshot restore for authored project content only.
- Delete currently prunes workspace selection for deleted targets. History undo/redo should restore authored content without treating the selection prune as authored history.
- Assembly delete can remove nested assemblies, components, and object records. The proof must cover a subtree, not only an empty assembly.
- Component delete removes child objects and updates parent assembly order. The proof must cover object restoration and parent order.
- Create redo must restore the same generated id, not create a fresh id, so redo is stable and deterministic.
- Directly snapshotting too much app state could accidentally capture provider/cache/preview/runtime/session state. Keep the snapshot type narrow and test excluded state preservation.
- Broad `BrowserPanel.test.tsx` currently has unrelated staged-import expectation failures around `Multiple objects` and `Inspection failed`; report those if rerun instead of widening into Import.

#### Checklist

- [x] Add history-aware create/delete owner APIs or a focused helper that wraps accepted store mutations.
- [x] Prove authored assembly create creates one entry, undo removes it, and redo restores the same id/label/order.
- [x] Prove authored component create creates one entry, undo removes it from the parent, and redo restores the same id/label/parent order.
- [x] Prove authored component delete creates one entry, undo restores the component and child objects, and redo removes them again.
- [x] Prove authored assembly delete creates one entry, undo restores the deleted subtree, and redo removes it again.
- [x] Prove missing parent, missing owner, runtime-root/non-authored owner, imported/source-backed owner, and unchanged/no-op paths create no canonical entries.
- [x] Prove undo/redo does not restore Browser local selection, expand/collapse, command transcript/recall, provider/cache/preview/runtime, or unaccepted import session state.
- [x] Preserve existing create/delete return behavior and UI confirmation behavior.

#### Focused Verification

- `npm.cmd test -- --run src/app/store/browserOrganizationEditHistoryStore.test.ts` or the exact focused Browser create/delete history test file added.
- `npm.cmd test -- --run src/app/store/useAppStore.test.ts` if shared create/delete behavior or store helpers are touched enough to warrant the broader store proof.
- `npm.cmd test -- --run src/app/panels/BrowserPanel.test.tsx` only if Browser controller wiring changes; report the known unrelated staged-import failures if they persist.
- `npm.cmd test -- --run src/app/panels/browserContextMenu.test.ts` only if context-menu routing/capability wiring changes.

#### Build Gate

- `npm.cmd run build`

#### Tracking Docs

- Implementation updates `docs/CHANGELOG.md` for shipped runtime/test behavior.
- Implementation updates this phase doc and its Doc History after focused verification and build pass.
- Implementation updates `docs/Doc-Log.md` for doc maintenance.
- Do not update the family index during Worker implementation; Manager handles `Edit-History-CLG-19` acceptance status after review.

#### Stop Condition

Stop and report instead of widening if create/delete restore cannot stay limited to authored project-content structure and minimal order/placement side effects, if stable create redo requires a new id allocation scheme or persistence migration, if imported/source-backed content deletion is required to prove authored delete behavior, if UI confirmation behavior would need redesign, or if accepted Import/Catalog commit handling becomes necessary.

#### Done Shape

- Phase 2 is implementation-complete after focused Browser organization history tests and `npm.cmd run build` passed on 2026-04-22 02:54:21. The broader `BrowserPanel.test.tsx` rerun still has two unrelated staged-import expectation failures around `Multiple objects` and `Inspection failed`; those are outside this create/delete slice and were not widened into.
- `Edit-History-CLG-19` closed after Manager acceptance on 2026-04-22 02:58:48.
- `Edit-History-CLG-20` through `Edit-History-CLG-22` remain open for later phases.

## [x] `Edit-History-4 / Phase 3` - `Accepted Import And Catalog Commits`

Plan canonical entries for accepted Import/Catalog content commits, split into smaller implementation subphases because the live Import and Catalog seams have different mutation shapes.

### Phase 3 Summary

#### Purpose

Make accepted project-content commits from Import and Catalog undoable only after they create durable project content, while proving source browsing, previews, provider/cache state, upload/session status, and unaccepted staging remain outside canonical edit history.

#### Owns

- `Edit-History-CLG-20` in `Edit-History-4 / Phase 3.1` for accepted staged Import commits after `commitStagedImportDraft(...)` mutates durable project content.
- `Edit-History-CLG-21` in `Edit-History-4 / Phase 3.2` for direct eligible Catalog/Add To Project commits after Catalog hands a browser-project commit request to the app store.
- `Edit-History-CLG-22` as a cross-subphase exclusion proof. Do not mark it complete until both Import-side and Catalog-side no-entry proofs pass.

#### Does Not Own

- Staged Import sessions before acceptance, staged preview tree organization, upload status, browsing file pickers, provider/cache/metadata refresh, source-library writes, preview loading, or source attribution discovery.
- Catalog source browsing, PubParts source options, local-library mirroring, source staging, environment/HDRI actions, and direct preview sessions.
- Imported reference remove/explode history, accepted content replacement semantics beyond the existing commit paths, durable expand/collapse layout, selection-only state, Browser drag/drop organization, create/delete/rename history, history UI, persistence, collaboration, Viewer Transform, Build Path, command transcript, or command recall.

#### Current Live Seams

- `src/app/store/useAppStore.ts`
  - `commitStagedImportDraft(): StagedImportCommitResult | null` is the accepted Import mutation seam. It returns `null` for no draft/no files, returns failed/partial/success results, and only creates durable content when `committedReferenceCount > 0`.
  - The accepted Import path can create authored assemblies/components in `projectContent` and imported references in `referenceWorkspace.importedReferencesById`, `importedReferenceOrder`, `contentOrderByParentKey`, visibility/load/error maps, transform/timeline/snap maps, channel ranges, and part rows.
  - Partial commits leave failed/uncommitted files in `referenceWorkspace.stagedImportDraft`; success is closed by the controller through `closeStagedImportDraft()`.
  - `addImportedReference(...)` is the direct imported-reference mutation seam used by Browser direct import paths and Catalog direct Add To Project. It returns the created reference id and writes imported-reference records/order/content-order metadata.
- `src/app/panels/useBrowserPanelController.ts`
  - `handleCommitStagedImportDraft(...)` is the Browser acceptance controller boundary. It calls `commitStagedImportDraft()`, selects `anchorRowId` locally, records failed/partial commit results locally, and closes the staged draft only on success.
  - Import file browsing, preview selection, preview drag state, column widths, and local selected rows are controller/session state and must not become canonical history.
- `src/app/workspace/CatalogSurface.tsx`
  - `handleAddItemToProject(...)` resolves eligible repo/planned reference assets with `resolveCatalogReferenceCommitRequest(...)` and calls `addImportedReference(...)`.
  - External PubParts/source-option paths call `openStagedImportDraft(...)` and `appendStagedImportDraftFiles(...)`; those are staging/session operations and should only become undoable later through staged Import acceptance.
- `src/app/catalog/catalogReferenceCommit.ts`
  - `resolveCatalogReferenceCommitRequest(...)` returns browser-project commit requests only for eligible reference assets with an Add To Project browser-project action. It intentionally returns `null` for imports/external source entries and environment actions.
- Existing focused test surfaces:
  - `src/app/store/useAppStore.test.ts` already covers staged Import commit success, partial/no-file returns, source attribution preservation, and imported-reference store behavior.
  - `src/app/workspace/CatalogSurface.test.tsx` already covers eligible direct Add To Project handoff to `addImportedReference(...)`, multiple Catalog adds, preview/source paths that do not call `addImportedReference(...)`, and external source staging paths.
  - `src/app/catalog/catalogReferenceCommit.test.ts` already covers eligible and ineligible Catalog commit-request resolution.

#### First Pass Decisions

- Split the implementation. `Phase 3.1` should handle accepted staged Import commits first because it needs a wider accepted-content snapshot than Browser organization history and must handle partial commits without restoring unaccepted staged files.
- `Phase 3.2` should handle direct Catalog/Add To Project commits next because its live accepted boundary is the CatalogSurface `handleAddItemToProject(...)` handoff into `addImportedReference(...)`.
- Do not make the raw `addImportedReference(...)` method historyful by default unless the implementation proves it is the only accepted authored seam; prefer a history-aware wrapper for Catalog direct Add To Project so unrelated import tests and raw store setup stay history-free.
- Accepted Import history should commit only when `commitStagedImportDraft()` returns a result with `committedReferenceCount > 0` and the accepted-content snapshot changed. Failed commits, no draft, no files, and unchanged output create no canonical entry.
- Accepted Import undo/redo should restore only accepted durable content: project-content records/order and the imported-reference records/order/content-order maps needed to display accepted content. It must not restore staged draft/session state, local Browser selection, preview selection, preview drag state, provider/cache/source browsing state, command transcript, or command recall.
- Catalog direct Add To Project undo/redo should restore the created imported-reference record and its order/content-order metadata with the same generated id. It should not undo Catalog browsing, preview session, source staging, provider/cache/local-library state, or environment actions.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/browserOrganizationEditHistoryStore.test.ts` or a focused sibling such as `src/app/store/importCatalogEditHistoryStore.test.ts`
- `src/app/panels/useBrowserPanelController.ts` only if staged Import acceptance must route through a history-aware wrapper instead of wrapping in the store.
- `src/app/workspace/CatalogSurface.tsx` only for `Phase 3.2` direct Catalog Add To Project routing to a history-aware wrapper.
- `src/app/workspace/CatalogSurface.test.tsx` only for focused Catalog handoff/exclusion proof if CatalogSurface wiring changes; report unrelated Catalog/Pubwheel failures instead of widening.
- `src/app/catalog/catalogReferenceCommit.test.ts` only if commit-request eligibility behavior is touched.
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement source browsing, provider/cache/preview/metadata refresh history, staged Import sessions before acceptance, upload/session status, source-library persistence, imported reference remove/explode history, Browser organization/create/delete/rename history, selection-only state, expand/collapse, command transcript/recall, history UI, persistence, collaboration, Viewer Transform, Build Path, new Catalog command language, or new Import/Catalog UX in Phase 3.

#### Focused Verification

- `Phase 3.1`: run the focused accepted Import history test file added or touched, likely `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts` or `npm.cmd test -- --run src/app/store/browserOrganizationEditHistoryStore.test.ts`; run the nearest targeted staged Import store tests if the new coverage lands in `useAppStore.test.ts`.
- `Phase 3.2`: run the focused Catalog direct Add To Project history test file added or touched, plus `npm.cmd test -- --run src/app/workspace/CatalogSurface.test.tsx` only if CatalogSurface wiring changes and the suite is still scoped enough. If broad CatalogSurface currently has unrelated Catalog/Pubwheel failures, report them and do not widen.
- Run `npm.cmd test -- --run src/app/catalog/catalogReferenceCommit.test.ts` only if commit-request eligibility code changes.

#### Build Gate

Run `npm.cmd run build` after focused tests pass for each implementation subphase.

#### Tracking Docs

- Implementation updates `docs/CHANGELOG.md` for shipped runtime/test behavior.
- Implementation updates this phase doc and its Doc History after focused verification and build pass.
- Implementation updates `docs/Doc-Log.md` for doc maintenance.
- Do not update the family index during Worker implementation; Manager handles `Edit-History-CLG-20` through `Edit-History-CLG-22` acceptance after review.

#### Stop Condition

Stop and report instead of widening if accepted Import undo/redo cannot restore accepted content without also restoring unaccepted staged drafts, source sessions, provider/cache/preview state, or object URL lifecycle state; if partial Import commits require redesigning `commitStagedImportDraft(...)` return behavior; if Catalog direct Add To Project cannot be routed through a narrow history-aware store seam without disturbing unrelated Catalog/Pubwheel work; or if a broad CatalogSurface/import UI refactor becomes necessary.

## [x] `Edit-History-4 / Phase 3.1` - `Accepted Import Commit Entries`

Route accepted staged Import commits through canonical edit history.

### Phase 3.1 Implementation Spec

#### Owns

- `Edit-History-CLG-20`.
- Import-side proof for `Edit-History-CLG-22`, including failed/no-file/no-draft/staged-preview/session no-entry behavior.

#### Exact Implementation Boundary

- Add a history-aware accepted Import commit wrapper or store helper around `commitStagedImportDraft(...)`.
- Commit one canonical `Accept Import` entry only after the existing commit path succeeds or partially succeeds with `committedReferenceCount > 0` and accepted durable content changed.
- Preserve the existing `StagedImportCommitResult | null` return behavior, including `status`, `anchorRowId`, `committedReferenceCount`, and per-file results.
- Preserve controller behavior for local selected row, failed/partial result display, and closing the staged draft on success.
- Restore only accepted durable content on undo/redo:
  - `projectContent`
  - imported-reference records and order
  - reference `contentOrderByParentKey`
  - visibility/load/error/transform/timeline/snap/channel/part-row maps required for accepted imported references
- Do not restore staged draft files, preview tree/session state, preview selection, local Browser row selection, source browsing/cache/provider state, upload/session status, command transcript, or command recall.

#### Implementation Risks

- `commitStagedImportDraft(...)` can both create authored containers and imported-reference records. A project-content-only snapshot is not enough.
- Partial commits are the main risk: undo must remove accepted content without resurrecting already accepted staged files into the draft, and redo must restore the accepted content deterministically.
- Object URL ownership may be entangled with imported-reference add/remove behavior. If undo/redo needs a new object URL lifecycle policy, stop and report instead of widening.
- Successful commit closes the staged draft in the controller, not inside `commitStagedImportDraft(...)`; history must not make that controller/session close part of the canonical entry.

#### Checklist

- [x] Add a narrow accepted-content snapshot/restore helper that excludes staged drafts, preview/session state, and provider/cache/source browsing state.
- [x] Add a history-aware accepted Import commit wrapper while preserving the raw commit return behavior.
- [x] Prove successful staged Import creates one canonical entry, undo removes accepted content, and redo restores accepted content with stable ids/order.
- [x] Prove partial staged Import creates one canonical entry only for committed content and preserves remaining failed/uncommitted staged state outside undo/redo.
- [x] Prove no draft, no files, failed-only commit, and unchanged accepted output create no canonical entry.
- [x] Prove Import browsing/preview/session mutations before acceptance create no canonical entries by keeping the raw staged Import path history-free and routing history only through the accepted wrapper.
- [x] Prove undo/redo does not restore Browser local selection, preview/session draft state, provider/cache-like transform preference state, command transcript, command recall, or upload/session status.

#### Done Shape

- Phase 3.1 is implementation-complete after `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts`, `npm.cmd test -- --run src/app/store/useAppStore.test.ts -t staged`, and `npm.cmd run build` passed on 2026-04-22 03:08:00. A focused repair on 2026-04-22 03:12:37 narrowed accepted Import reference restoration to the entry-created imported reference ids and touched content-order keys, then reran the same focused accepted Import history test, staged Import regression filter, and production build successfully.
- `Edit-History-CLG-20` closed after Manager acceptance on 2026-04-22 03:14:13.
- `Edit-History-CLG-22` remains open until `Phase 3.2` proves Catalog-side source browsing, preview, cache/provider, and unaccepted session exclusions.

## [x] `Edit-History-4 / Phase 3.2` - `Catalog Add To Project Commit Entries`

Route eligible direct Catalog/Add To Project commits through canonical edit history.

### Phase 3.2 Implementation Spec

#### Owns

- `Edit-History-CLG-21`.
- Catalog-side proof for `Edit-History-CLG-22`; close `Edit-History-CLG-22` only if `Phase 3.1` has already passed Import-side exclusion proof.

#### Exact Implementation Boundary

- Add or reuse a history-aware imported-reference add wrapper in `useAppStore`.
- Route only eligible direct CatalogSurface `handleAddItemToProject(...)` requests from `resolveCatalogReferenceCommitRequest(...)` through that wrapper.
- Commit one canonical `Add Catalog item to project` entry only when a browser-project commit request creates a durable imported-reference record.
- Preserve `resolveCatalogReferenceCommitRequest(...)` eligibility: imports/external PubParts/source entries, environment actions, unavailable actions, and unsupported assets remain no-entry/no-handoff.
- Undo/redo should remove/restore the created imported-reference record, order entry, content-order placement, and minimal display metadata with the same generated reference id.
- Keep raw `addImportedReference(...)` history-free unless implementation research proves the raw method itself is the accepted command seam and tests can keep unrelated setup calls no-entry.

#### Implementation Risks

- CatalogSurface has broad ongoing Catalog/Pubwheel work. Keep the routing change tiny and report unrelated broad test failures.
- Catalog has two different "Add" meanings: direct repo/planned reference Add To Project mutates the project immediately, while external PubParts/source-option paths stage files into Import review. Only the direct accepted commit path belongs here.
- Preview/loading/source-option tests already assert `addImportedReference(...)` is not called for many source paths; keep those as no-entry proof rather than converting them into history.

#### Checklist

- [x] Add or reuse a narrow imported-reference accepted-content snapshot/restore path for direct Catalog adds.
- [x] Route eligible Catalog direct Add To Project through the history-aware wrapper.
- [x] Prove a direct Catalog add creates one canonical entry, undo removes the imported reference, and redo restores it with the same id/order/metadata.
- [x] Prove multiple Catalog adds create one entry per accepted user add, not one entry for preview/browse/source actions.
- [x] Prove ineligible Catalog items, external PubParts source staging, source-option materialization, preview sessions, environment actions, and provider/cache/local-library updates create no canonical entries.
- [x] Prove undo/redo does not restore Catalog browsing state, preview session state, provider/cache/local-library state, Browser selection, expand/collapse, command transcript, or command recall.

#### Done Shape

- Phase 3.2 is implementation-complete after `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts` and `npm.cmd run build` passed on 2026-04-22 03:18:08. A focused repair on 2026-04-22 03:21:44 split direct Catalog Add To Project restoration away from accepted Import `projectContent` snapshots, proved post-add raw project-content mutations survive Catalog add undo/redo, and reran focused Catalog history verification successfully. The focused CatalogSurface Add To Project rerun reached the imported `Shoe 1` handoff but still failed two assertions expecting the older `Imported Catalog Entries` heading while the current dirty Catalog surface renders `Catalog Info`; that expectation drift is outside this direct history slice and was not widened into.
- `Edit-History-CLG-21` closed after Manager acceptance on 2026-04-22 03:23:43.
- `Edit-History-CLG-22` closed after Manager acceptance on 2026-04-22 03:23:43, combining the accepted Phase 3.1 Import-side proof with the Phase 3.2 Catalog-side proof.

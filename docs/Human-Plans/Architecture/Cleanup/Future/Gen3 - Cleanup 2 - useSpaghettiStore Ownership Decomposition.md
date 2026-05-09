# `Gen 3 - Cleanup 2` - `useSpaghettiStore Ownership Decomposition`

## Doc Header

### Doc History
25. 2026-05-09 14:45:09: Implemented `Gen 3 - Cleanup 2 / Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction`, added `src/app/spaghetti/selectors/selectGraphViewerOutput.ts` plus focused tests, rewired the moved viewer/output selector seam back through `useSpaghettiStore.ts`, and advanced the lane so `Phase 5.1 - Active Graph Runtime Selector Extraction` is now honestly complete while `Phase 5.2 - Accepted Result And Preview Selector Extraction` becomes the next approved implementation target.
24. 2026-05-09 14:38:25: Tightened `Gen 3 - Cleanup 2 / Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` against the live post-`Phase 5.1.1` selector anchors, expanded the exact deferred selector list to include the shared-viewer helper seam plus `selectViewerTargetGraph(...)`, and locked the likely focused destination around one viewer/output selector module so the next implementation handoff stays Codex-sized and honest.
23. 2026-05-09 13:57:53: Implemented `Gen 3 - Cleanup 2 / Phase 5.1.1 - Graph Document And Runtime Selector Extraction`, added `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts` plus its focused tests, rewired the moved selector seam back through `useSpaghettiStore.ts`, and advanced the lane so `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` is now the next approved implementation target while the broader full-store OutputPreview drift remains unchanged.
22. 2026-05-09 08:11:01: Prepared `Gen 3 - Cleanup 2 / Phase 5.1 - Active Graph Runtime Selector Extraction` for implementation by promoting the selector ladder into dedicated `##` phase sections, tightening the `Phase 5.1` parent around the live late-selector seam, and keeping `Phase 5.1.1 - Graph Document And Runtime Selector Extraction` as the next explicit code-sized selector move while the broader output-surface and workspace read-model follow-ons remain separately owned.
21. 2026-05-07 07:14:07: Tightened `Gen 3 - Cleanup 2 / Phase 5.1.1 - Graph Document And Runtime Selector Extraction` against the live `useSpaghettiStore.ts` selector anchors, locked the likely `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts` destination module plus focused test target, and advanced the lane so the next implementation handoff is now explicit enough for one clean Codex pass
20. 2026-05-06 09:09:09: Narrowed the remaining `Gen 3 - Cleanup 2 / Phase 5.1 - Active Graph Runtime Selector Extraction` lane into smaller Codex-sized selector slices by splitting the broad active-document, graph-runtime, and graph-output read-model seam into `Phase 5.1.1 - Graph Document And Runtime Selector Extraction` and `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` before more implementation starts
19. 2026-05-06 09:09:09: Implemented `Gen 3 - Cleanup 2 / Phase 4.7 - Geometry Sketch Component Edit Action Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchComponentEditActions.ts`, recorded the landed geometry-sketch component-edit seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so the full sketch-session action lane is now complete while `Phase 5.1 - Active Graph Runtime Selector Extraction` becomes the next approved implementation target
18. 2026-05-06 09:04:34: Implemented `Gen 3 - Cleanup 2 / Phase 4.6 - Geometry Sketch Selection Action Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchSelectionActions.ts`, recorded the landed geometry-sketch selection and delete seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.6` is now complete while `Phase 4.7 - Geometry Sketch Component Edit Action Extraction` becomes the next approved implementation target
17. 2026-05-06 09:00:58: Implemented `Gen 3 - Cleanup 2 / Phase 4.5.2 - Draw Draft Commit And Undo Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchDrawDraftActions.ts`, recorded the landed geometry-sketch draw draft commit and undo seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.5.2` is now complete while `Phase 4.6 - Geometry Sketch Selection Action Extraction` becomes the next approved implementation target
16. 2026-05-05 22:26:55: Implemented `Gen 3 - Cleanup 2 / Phase 4.5.1 - Draw Session Control Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchDrawSessionControl.ts`, recorded the landed geometry-sketch draw session control seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.5.1` is now complete while `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` becomes the next approved implementation target
15. 2026-05-05 22:26:55: Narrowed the remaining `Gen 3 - Cleanup 2 / Phase 4.5 - Geometry Sketch Draw Draft Action Extraction` lane into smaller Codex-sized sub-slices by splitting the broad draw-session seam into `Phase 4.5.1 - Draw Session Control Extraction` and `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` before more implementation starts
14. 2026-05-05 22:26:55: Implemented `Gen 3 - Cleanup 2 / Phase 4.4 - Geometry Sketch Session Lifecycle Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchSessionLifecycle.ts`, recorded the landed geometry-sketch session lifecycle and history-scrub handoff seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.4` is now complete while `Phase 4.5 - Geometry Sketch Draw Draft Action Extraction` becomes the next approved implementation target
13. 2026-05-05 22:14:48: Implemented `Gen 3 - Cleanup 2 / Phase 4.3 - Geometry Sketch Plane Graph Write Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchPlaneGraphWrite.ts`, recorded the landed direct geometry-sketch plane graph-write seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.3` is now complete while `Phase 4.4 - Geometry Sketch Session Lifecycle Extraction` becomes the next approved implementation target
12. 2026-05-05 21:42:49: Implemented `Gen 3 - Cleanup 2 / Phase 4.2 - Sketch Plane Pick Draft Transform Extraction`, added `src/app/spaghetti/store/sketch/sketchPlanePickDraftTransform.ts`, recorded the landed sketch-plane draft-transform setter seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.2` is now complete while `Phase 4.3 - Geometry Sketch Plane Graph Write Extraction` becomes the next approved implementation target
11. 2026-05-05 21:33:34: Implemented `Gen 3 - Cleanup 2 / Phase 4.1 - Sketch Plane Pick Command Session Extraction`, added `src/app/spaghetti/store/sketch/sketchPlaneCommandSession.ts`, recorded the landed sketch-plane command-routing and stage-transition seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 4.1` is now complete while `Phase 4.2 - Sketch Plane Pick Draft Transform Extraction` becomes the next approved implementation target
10. 2026-05-05 21:14:30: Implemented `Gen 3 - Cleanup 2 / Phase 3.4 - Graph Node History Adapter Extraction`, added `src/app/spaghetti/store/history/graphNodeHistoryCommitAdapter.ts`, recorded the landed graph-node parameter and move history seam plus stable `useSpaghettiStore.ts` facade rewiring, then tightened the broad `Phase 4` sketch-session ladder into smaller command, transform, graph-write, lifecycle, draw, selection, and component-edit slices before further implementation starts
9. 2026-05-05 21:14:30: Implemented `Gen 3 - Cleanup 2 / Phase 3.3 - Part Feature History Adapter Extraction`, added `src/app/spaghetti/store/history/partFeatureHistoryCommitAdapter.ts`, recorded the landed part-feature-specific history adapter seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 3.3` is now complete while `Phase 3.4 - Graph Node History Adapter Extraction` becomes the next approved implementation target
8. 2026-05-05 21:07:16: Narrowed the remaining `Gen 3 - Cleanup 2` ladder into smaller Codex-sized slices by splitting the old `Phase 3.3` history seam into separate part-feature and graph-node adapter passes, then pre-splitting the later sketch-session, selector, and closeout work into `Phase 4.1` through `Phase 6.2` before further implementation starts
7. 2026-05-05 21:02:02: Implemented `Gen 3 - Cleanup 2 / Phase 3.2 - Geometry Sketch Commit Adapter Extraction`, added `src/app/spaghetti/store/history/geometrySketchHistoryCommitAdapter.ts`, recorded the landed geometry-sketch-specific commit adapter seam plus stable `useSpaghettiStore.ts` facade rewiring, and advanced the family handoff so `Phase 3.2` is now complete while `Phase 3.3 - Remaining Graph-History Commit Adapter Extraction` becomes the next approved implementation target
6. 2026-05-05 20:54:51: Narrowed the remaining `Gen 3 - Cleanup 2 / Phase 3.2` handoff by adding `Phase 3.2 - Geometry Sketch Commit Adapter Extraction` as the next explicit implementation target, keeping the broader graph-history adapter concern intact while deferring the part-feature and graph-node adapter seam to later `Phase 3.x` follow-up work
5. 2026-05-05 20:54:51: Implemented `Gen 3 - Cleanup 2 / Phase 3.1 - Geometry Sketch History Helper Extraction`, added `src/app/spaghetti/store/history/geometrySketchHistory.ts`, recorded the landed pure snapshot and local-history seam, and advanced the family handoff so `Phase 3.1` is now complete while `Phase 3.2 - Graph-History Commit Adapter Extraction` becomes the next approved implementation target
4. 2026-05-05 20:43:59: Narrowed the broad `Gen 3 - Cleanup 2 / Phase 3 - Graph Edit And History Helper Extraction` lane by adding `Phase 3.1 - Geometry Sketch History Helper Extraction` as the next explicit implementation target, keeping the overall history concern intact while deferring the live graph-history commit adapters to later `Phase 3.x` follow-up slices
3. 2026-05-05 20:43:59: Implemented `Gen 3 - Cleanup 2 / Phase 2 - Pure Types And Accepted Runtime Helper Extraction`, recorded the landed `graphRuntime/acceptedRuntime.ts` owner-area seam plus stable `useSpaghettiStore.ts` facade re-exports, and advanced the lane so `Phase 2` is now complete while `Phase 3 - Graph Edit And History Helper Extraction` becomes the next approved implementation target
2. 2026-05-05 20:30:15: Tightened `Gen 3 - Cleanup 2 / Phase 1 - Owner Map And Migration Rules Lock` against the live `useSpaghettiStore.ts` seam anchors, confirmed the first explicit destination modules for the accepted-runtime, history, sketch-session, and selector surfaces, and advanced the lane so `Phase 1` is now complete while `Phase 2 - Pure Types And Accepted Runtime Helper Extraction` becomes the next approved implementation target
1. 2026-05-05 20:30:15: Created this dedicated `Gen 3 - Cleanup 2` future doc to turn the post-`useAppStore` recommendation into the next concrete oversized-sink cleanup lane, grounding it in the current `src/app/spaghetti/store/useSpaghettiStore.ts` read and breaking the work into small owner-boundary phases that Codex can execute one by one

### Purpose
- decompose `src/app/spaghetti/store/useSpaghettiStore.ts` by owner boundary instead of by arbitrary line count
- preserve accepted graph-runtime and authored-node ownership while reducing one file's concentration of selectors, history, viewport/workspace glue, and runtime state
- give `Cleanup Gen3` the next implementation-ready family phase after the closed `useAppStore` lane
- keep the migration incremental enough that each implementation phase stays small enough for one clean Codex pass

### Scope

This phase covers:
- owner confirmation and decomposition planning for `useSpaghettiStore.ts`
- explicit extraction targets for pure types, accepted-runtime helpers, graph-edit history seams, selector/read-model seams, and viewport/workspace helpers
- stable-facade migration rules that preserve one exported `useSpaghettiStore` surface during the split
- verification and stop rules for each implementation phase

This phase does not cover:
- moving accepted build/result truth out of `useSpaghettiStore`
- a same-pass `Viewer.ts` or `ViewportOverlay.tsx` rewrite
- re-deciding app-store, Browser, or workspace canonical ownership
- a blind multi-store split just because the file is large

## Doc Body

### Family Phase Goal

`useSpaghettiStore.ts` should stop acting like one giant graph-runtime plus viewport-session plus workspace read-model bucket.

The target shape is:
- one exported `useSpaghettiStore` facade for callers during migration
- smaller internal modules that own coherent runtime, history, selector, and workspace-facing seams
- accepted graph/runtime truth still canonical in the spaghetti store
- editor/viewer/workspace consumers reading those truths through clearer owner-area modules instead of one 9k-line file

### Boundary Rules

- keep accepted graph-runtime, compile-build, and authored graph-edit truth in `useSpaghettiStore`
- do not move viewer runtime ownership into the app store
- do not turn viewport or workspace selectors into a second owner of graph truth
- do not combine this lane with `ViewportOverlay.tsx` or `Viewer.ts` extraction even when the seams touch each other
- preserve one exported `useSpaghettiStore` facade until the internal owner modules are proven

### Current Live Read

Current `useSpaghettiStore.ts` responsibilities cluster into at least six real owner seams:

1. Graph runtime and accepted build/result truth
- `GraphCompileBuildState`
- `GraphRuntimeState`
- accepted build bundle, preview bundle, accepted geometry result, and impact snapshot helpers

2. Graph edit and CAD history helpers
- graph node move, connect, parameter, and feature history option surfaces
- geometry sketch local-history and child-restore helpers
- edit-history shaping and restore-point coordination

3. Geometry sketch and transform session truth
- sketch plane pick state
- geometry sketch draw/review state
- transform- or session-adjacent helper surfaces that feed viewer and overlay reads

4. Workspace and viewport read/model glue
- editor workspace surface state helpers
- viewport restore and workspace presentation helpers
- split-direction and docking helper imports

5. Large selector/read-model surface
- selector cluster concentrated later in the file before the root store creation, starting around `selectActiveGraphDocument(...)` at `useSpaghettiStore.ts:4508`
- graph/editor/read-model helpers that are still mixed together with runtime truth

6. Root store composition
- the `create<SpaghettiStoreState>((set, get) => ({ ... }))` facade beginning around `useSpaghettiStore.ts:4888` plus the late file-tail setup that still reads as one second app kernel

### Acceptance Read

This family phase is acceptable when:
- `useSpaghettiStore.ts` has one visible owner-map and a small-phase decomposition ladder
- each implementation phase stays small enough for one clean Codex pass
- the eventual runtime split preserves accepted graph/runtime truth in the spaghetti store
- later `ViewportOverlay.tsx` and `Viewer.ts` cleanup can depend on the same owner-pattern without being coupled into the same lane

## Vision

This family phase belongs to `Cleanup Gen3` and advances the shipped pattern from `Gen 3 - Cleanup 1`.

The intended outcome is not "many new stores."

The intended outcome is:
- one honest spaghetti-store facade
- explicit owner-area modules under that facade
- smaller graph-runtime, sketch/history, selector, and workspace-read seams
- a better handoff for later UI and viewer cleanup without weakening graph-native ownership

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen3-HLG-1` - Break `useSpaghettiStore.ts` into smaller honest ownership seams without inventing second owners for graph runtime, accepted build truth, sketch sessions, or viewport-facing graph state.
- [ ] `Cleanup-Gen3-HLG-2` - Keep the migration incremental and proofable so each extraction pass is small enough for one Codex implementation without forcing risky context compaction or a big-bang graph-store rewrite.
- [ ] `Cleanup-Gen3-HLG-3` - Leave the runtime, selector, and session seams clearer so later `ViewportOverlay.tsx` and `Viewer.ts` cleanup can inherit the same pattern instead of reopening graph/store ownership first.

### Codex Level Goals

- [ ] CLG 1. Confirm the live `useSpaghettiStore.ts` owner map and lock the migration rules before any extraction starts.
- [ ] CLG 2. Extract pure types and accepted-runtime helpers before moving heavier graph-edit or viewport-facing action seams.
- [ ] CLG 3. Split graph-edit history, sketch-session, and selector/read-model seams into explicit owner-area modules one narrow slice at a time.
- [ ] CLG 4. End with a smaller spaghetti-store facade plus one explicit handoff for later `ViewportOverlay.tsx` and `Viewer.ts` cleanup.

### `Gen 3 - Cleanup 2 / Phase 1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] reconfirm the exact live owner map inside `useSpaghettiStore.ts`
- [ ] lock keep-one-facade, no-new-store, and no-Viewer/no-Overlay widening rules

### `Gen 3 - Cleanup 2 / Phase 2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract only pure types and accepted-runtime helper seams first

### `Gen 3 - Cleanup 2 / Phase 3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract graph-edit and geometry-history helper seams without widening into viewport runtime

### `Gen 3 - Cleanup 2 / Phase 3.1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract the pure geometry-sketch session snapshot, local-history, and staged-command helper cluster first

### `Gen 3 - Cleanup 2 / Phase 3.2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract the graph-history commit adapter helpers only after the pure geometry-sketch history helper seam is already isolated

### `Gen 3 - Cleanup 2 / Phase 3.3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract only the remaining part-feature history commit adapters after the geometry-sketch adapter seam is isolated

### `Gen 3 - Cleanup 2 / Phase 3.4`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract only the remaining graph-node history commit adapters after the part-feature adapter seam is isolated

### `Gen 3 - Cleanup 2 / Phase 4`

- [x] advance `Cleanup-Gen3-HLG-1`
- [x] advance `Cleanup-Gen3-HLG-3`
- [x] extract geometry-sketch and sketch-plane session helpers/actions behind explicit owner modules one owner seam at a time

### `Gen 3 - Cleanup 2 / Phase 4.1`

- [x] advance `Cleanup-Gen3-HLG-1`
- [x] advance `Cleanup-Gen3-HLG-3`
- [x] extract only the sketch-plane pick command-routing and stage-transition seam first

### `Gen 3 - Cleanup 2 / Phase 4.2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract only the sketch-plane pick draft-transform setter seam after the command-routing helpers are isolated

### `Gen 3 - Cleanup 2 / Phase 4.3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract only the geometry-sketch plane graph-write seam after the draft-transform setter seam is isolated

### `Gen 3 - Cleanup 2 / Phase 4.4`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the geometry-sketch session lifecycle and history-scrub handoff seam after the plane graph-write helpers are isolated

### `Gen 3 - Cleanup 2 / Phase 4.5`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the geometry-sketch draw-draft and staged-command action seam after the lifecycle seam is isolated

### `Gen 3 - Cleanup 2 / Phase 4.5.1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract only the geometry-sketch draw session control seam first: command routing, tool selection, and live hover draft state

### `Gen 3 - Cleanup 2 / Phase 4.5.2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the geometry-sketch draw draft commit, finish or cancel, and staged undo or redo seam after the control actions are isolated

### `Gen 3 - Cleanup 2 / Phase 4.6`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the geometry-sketch selection and delete action seam after the draw-draft actions are isolated

### `Gen 3 - Cleanup 2 / Phase 4.7`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the geometry-sketch component-edit action seam after the selection seam is isolated

### `Gen 3 - Cleanup 2 / Phase 5`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] split the large selector/read-model surface into explicit selector modules one cluster at a time

### `Gen 3 - Cleanup 2 / Phase 5.1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the active-document, graph-runtime, and graph-output selector cluster first

### `Gen 3 - Cleanup 2 / Phase 5.1.1`

- [x] advance `Cleanup-Gen3-HLG-1`
- [x] advance `Cleanup-Gen3-HLG-3`
- [x] extract only the graph document, active graph, and active graph-runtime selector seam first
- [x] move only the live selector block from `selectActiveGraphDocument(...)` through `selectActiveGraphCompileResult(...)`
- [x] defer viewer-target document/runtime, output-surface, preview-preparation, and accepted-result projections to later `Phase 5.x` slices

#### Purpose
- isolate the lightest graph-document and active-runtime read seam first so the selector lane starts with one stable owner cut instead of the whole late projection surface

#### Exact First Code Cut
- add one focused selector module at `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`
- move only these selectors first:
  - `selectActiveGraphDocument(...)`
  - `selectGraphDocumentById(...)`
  - `selectOrderedGraphDocuments(...)`
  - `selectGraphBrowserStorageWorkingSetSnapshot(...)`
  - `selectCachedGraphEntryById(...)`
  - `selectCachedGraphEntryByDocumentId(...)`
  - `selectOrderedCachedGraphEntries(...)`
  - `selectActiveGraph(...)`
  - `selectGraphByDocumentId(...)`
  - `selectGraphReceiveReferencesByDocumentId(...)`
  - `selectGraphRuntimeByDocumentId(...)`
  - `selectActiveGraphRuntime(...)`
  - `selectGraphCompileResultByDocumentId(...)`
  - `selectActiveGraphCompileResult(...)`
- re-export or rewire those selectors through `src/app/spaghetti/store/useSpaghettiStore.ts` without changing the public store surface

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule
- do not move `selectViewerTargetGraphDocumentId(...)`, `selectSharedViewerComposition(...)`, `selectViewerTargetGraphDocument(...)`, `selectViewerTargetGraph(...)`, or `selectViewerTargetGraphRuntime(...)` in this pass
- do not move `selectGraphPreviewPreparationByDocumentId(...)`, `selectGraphOutputSurfaceByDocumentId(...)`, `selectResolvedGraphReceiveReferencesByDocumentId(...)`, `selectViewerTargetGraphOutputSurface(...)`, or `selectViewerTargetGraphPreviewPreparation(...)` in this pass
- do not move accepted-result selectors, viewport selectors, or any action bodies in this pass

#### Verification Shape
- `npm.cmd run build` passes
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.test.ts` or the nearest focused selector test passes
- focused `useSpaghettiStore` reads that cover active graph document and active runtime resolution still pass

#### Done Shape
- the root file no longer owns the first graph-document and active-runtime selector seam inline
- `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` becomes the next honest selector follow-up

### `Gen 3 - Cleanup 2 / Phase 5.1.2`

- [x] advance `Cleanup-Gen3-HLG-1`
- [x] advance `Cleanup-Gen3-HLG-3`
- [x] extract the graph output, preview-preparation, and viewer-target runtime selector seam after the base graph document and runtime selectors are isolated

### `Gen 3 - Cleanup 2 / Phase 5.2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the accepted-result and preview selector cluster after the base graph-runtime selectors are isolated

### `Gen 3 - Cleanup 2 / Phase 5.3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the editor-viewport and workspace-facing selector cluster after the accepted-result selectors are isolated

### `Gen 3 - Cleanup 2 / Phase 6`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] shrink the root spaghetti-store facade and record the handoff to later UI/viewer cleanup

### `Gen 3 - Cleanup 2 / Phase 6.1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] remove duplicate helper residue and normalize the root facade around the extracted owner modules

### `Gen 3 - Cleanup 2 / Phase 6.2`

- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] close the lane honestly and record the handoff to later `ViewportOverlay.tsx` and `Viewer.ts` cleanup

### Prep Read

Current prep decision:
- `Phase 1` is now complete
- `Phase 2 - Pure Types And Accepted Runtime Helper Extraction` is now complete
- `Phase 3.1 - Geometry Sketch History Helper Extraction` is now complete
- `Phase 3.2 - Geometry Sketch Commit Adapter Extraction` is now complete
- `Phase 3.3 - Part Feature History Adapter Extraction` is now complete
- `Phase 3.4 - Graph Node History Adapter Extraction` is now complete
- `Phase 4.1 - Sketch Plane Pick Command Session Extraction` is now complete
- `Phase 4.2 - Sketch Plane Pick Draft Transform Extraction` is now complete
- `Phase 4.3 - Geometry Sketch Plane Graph Write Extraction` is now complete
- `Phase 4.4 - Geometry Sketch Session Lifecycle Extraction` is now complete
- the broad `Phase 4.5` draw-session concern is now intentionally narrowed
- `Phase 4.5.1 - Draw Session Control Extraction` is now complete
- `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` is now complete
- `Phase 4.6 - Geometry Sketch Selection Action Extraction` is now complete
- `Phase 4.7 - Geometry Sketch Component Edit Action Extraction` is now complete
- the full sketch-session action lane is now honestly closed
- the broad `Phase 5.1` selector concern is now intentionally narrowed
- `Phase 5.1 - Active Graph Runtime Selector Extraction` is now honestly complete
- `Phase 5.2 - Accepted Result And Preview Selector Extraction` is now the next approved implementation target
- `Phase 5.2` through `Phase 6.2` remain the approved small-phase ladder for the later selector, facade, and handoff work

Why:
- the top runtime type surface is now grounded at `GraphCompileBuildState` around `useSpaghettiStore.ts:225`, `AcceptedBuildImpactSnapshot` around `useSpaghettiStore.ts:253`, `StagedAuthoritativePreviewResult` around `useSpaghettiStore.ts:264`, and `GraphRuntimeState` around `useSpaghettiStore.ts:277`
- the accepted-runtime helper seam is now grounded around:
  - `finalizeAcceptedBuildBundle(...)` at `useSpaghettiStore.ts:396`
  - `buildAcceptedBuildImpactSnapshot(...)` at `useSpaghettiStore.ts:481`
  - `buildFinalizedAcceptedResultArtifacts(...)` at `useSpaghettiStore.ts:507`
  - clone and promotion helpers through roughly `useSpaghettiStore.ts:620`
- the geometry sketch and plane-pick session seam is now grounded around:
  - `SketchPlanePickSession` at `useSpaghettiStore.ts:677`
  - `GeometrySketchSession` at `useSpaghettiStore.ts:782`
  - `GeometrySketchHistoryScrubState` at `useSpaghettiStore.ts:802`
  - the main sketch snapshot and history helper cluster around `useSpaghettiStore.ts:2779` through `useSpaghettiStore.ts:3408`
- the remaining root-owned history adapter seam is now grounded around:
  - `commitPartSketchFeatureHistoryCommand(...)` at `useSpaghettiStore.ts:1906`
  - `commitPartFeatureParameterHistoryCommand(...)` at `useSpaghettiStore.ts:1982`
  - `commitGraphNodeParameterHistoryCommand(...)` at `useSpaghettiStore.ts:2029`
  - `commitGraphNodeMoveHistoryCommand(...)` at `useSpaghettiStore.ts:2059`
- the sketch-plane and sketch-session action seam is now grounded around:
  - sketch-plane command and stage-transition actions at `useSpaghettiStore.ts:4667` through `useSpaghettiStore.ts:5169`
  - sketch-plane draft-transform setter actions at `useSpaghettiStore.ts:5171` through `useSpaghettiStore.ts:5362`
  - geometry-sketch plane graph-write actions at `useSpaghettiStore.ts:5376` through `useSpaghettiStore.ts:5481`
  - geometry-sketch session lifecycle and history-scrub actions at `useSpaghettiStore.ts:5505` through `useSpaghettiStore.ts:5786`
  - geometry-sketch draw-draft and staged-command actions at `useSpaghettiStore.ts:5887` through `useSpaghettiStore.ts:6507`
  - geometry-sketch selection and delete actions at `useSpaghettiStore.ts:5939`, `useSpaghettiStore.ts:5974`, `useSpaghettiStore.ts:5994`, `useSpaghettiStore.ts:6021`, and `useSpaghettiStore.ts:6587`
  - geometry-sketch component-edit actions at `useSpaghettiStore.ts:6642` through `useSpaghettiStore.ts:6828`
- the giant selector/read-model seam is now grounded from `selectActiveGraphDocument(...)` around `useSpaghettiStore.ts:3661` through the late selector block ending before the root `create(...)` facade
- the first explicit owner-area module targets are now:
  - `src/app/spaghetti/store/graphRuntime/*` for runtime types plus accepted-build/result helpers
  - `src/app/spaghetti/store/history/*` for graph-edit and geometry-history helpers
  - `src/app/spaghetti/store/sketch/*` for sketch-plane and geometry-sketch session helpers/actions
  - `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts` first, then later selector files under `src/app/spaghetti/selectors/*` for the remaining late read-model seam
- the cleanest next move is now `Phase 5.1.1`, because the graph document, active graph, and active graph-runtime selectors form one lighter read-model seam while the output-surface, preview-preparation, and viewer-target runtime selectors still share a broader later projection surface that should remain a separate follow-up pass
- the exact `Phase 5.1.1` seam is now grounded at:
  - `selectActiveGraphDocument(...)` at `useSpaghettiStore.ts:3661`
  - `selectGraphDocumentById(...)` at `useSpaghettiStore.ts:3671`
  - `selectOrderedGraphDocuments(...)` at `useSpaghettiStore.ts:3676`
  - `selectGraphBrowserStorageWorkingSetSnapshot(...)` at `useSpaghettiStore.ts:3683`
  - `selectCachedGraphEntryById(...)` at `useSpaghettiStore.ts:3697`
  - `selectCachedGraphEntryByDocumentId(...)` at `useSpaghettiStore.ts:3702`
  - `selectOrderedCachedGraphEntries(...)` at `useSpaghettiStore.ts:3710`
  - `selectActiveGraph(...)` at `useSpaghettiStore.ts:3717`
  - `selectGraphByDocumentId(...)` at `useSpaghettiStore.ts:3750`
  - `selectGraphReceiveReferencesByDocumentId(...)` at `useSpaghettiStore.ts:3755`
  - `selectGraphRuntimeByDocumentId(...)` at `useSpaghettiStore.ts:3761`
  - `selectActiveGraphRuntime(...)` at `useSpaghettiStore.ts:3766`
  - `selectGraphCompileResultByDocumentId(...)` at `useSpaghettiStore.ts:3799`
  - `selectActiveGraphCompileResult(...)` at `useSpaghettiStore.ts:3805`
- the exact selectors deliberately deferred to `Phase 5.1.2` start at:
  - `selectViewerTargetGraphDocumentId(...)` at `useSpaghettiStore.ts:3721`
  - `selectSharedViewerComposition(...)` at `useSpaghettiStore.ts:3725`
  - `selectViewerTargetGraphDocument(...)` at `useSpaghettiStore.ts:3739`
  - `selectViewerTargetGraphRuntime(...)` at `useSpaghettiStore.ts:3771`
  - `selectGraphPreviewPreparationByDocumentId(...)` at `useSpaghettiStore.ts:3810`
  - `selectGraphOutputSurfaceByDocumentId(...)` at `useSpaghettiStore.ts:3816`
  - `selectResolvedGraphReceiveReferencesByDocumentId(...)` at `useSpaghettiStore.ts:3822`
  - `selectViewerTargetGraphOutputSurface(...)` at `useSpaghettiStore.ts:3845`
  - `selectViewerTargetGraphPreviewPreparation(...)` at `useSpaghettiStore.ts:3850`

## [x] `Gen 3 - Cleanup 2 / Phase 1` - `Owner Map And Migration Rules Lock`

### Phase 1 Summary

#### Purpose
- reconfirm the exact `useSpaghettiStore.ts` owner map and lock the migration rules before any extraction work starts

#### Owns
- live responsibility inventory
- extraction order
- keep-versus-move rules
- stop rules for what must stay in the root store versus what may leave

#### Does Not Own
- runtime behavior changes
- new stores
- selector or session extraction

#### Current Live Read
- `GraphCompileBuildState` starts around `useSpaghettiStore.ts:225`
- `AcceptedBuildImpactSnapshot` starts around `useSpaghettiStore.ts:253`
- `StagedAuthoritativePreviewResult` starts around `useSpaghettiStore.ts:264`
- `GraphRuntimeState` starts around `useSpaghettiStore.ts:277`
- accepted-build finalization helpers start around `useSpaghettiStore.ts:396`
- the sketch-session type seam starts around:
  - `SketchPlanePickSession` at `useSpaghettiStore.ts:677`
  - `GeometrySketchSession` at `useSpaghettiStore.ts:782`
  - `GeometrySketchHistoryScrubState` at `useSpaghettiStore.ts:802`
- the sketch-session helper cluster starts around `cloneGeometrySketchSessionSnapshot(...)` at `useSpaghettiStore.ts:2779`
- the large selector block starts around `selectActiveGraphDocument(...)` at `useSpaghettiStore.ts:4508`
- the root store creation begins around `useSpaghettiStore.ts:4888`
- the file is carrying graph-runtime truth, history shapes, workspace helpers, selectors, and store composition in one place, which makes the migration order the main risk

### Phase 1 Implementation Spec

#### Exact First Code Cut
- do not move runtime code yet
- inventory the owner buckets with live anchors
- name the first destination-module areas and explicit deferrals for later phases

#### First Pass Decisions
- keep one exported `useSpaghettiStore` facade during the whole lane unless a later phase proves otherwise
- do not create a second runtime store for accepted build/result truth
- route the first move into `src/app/spaghetti/store/graphRuntime/*` because the accepted-runtime types and helper math are already coherent and test-backed
- defer all late selector moves until `Phase 5`, even though the selector block is large, because the pure selector move should not compete with the accepted-runtime extraction in the first code pass
- defer sketch-plane and geometry-sketch session extraction until `Phase 4` because those helpers sit next to real user-action closure work and should not be mixed into the first runtime-helper slice

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen3 - Cleanup 2 - useSpaghettiStore Ownership Decomposition.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen3-Index.md`

#### No-Widening Rule
- do not extract helpers yet
- do not change caller-facing store API
- do not widen into `Viewer.ts` or `ViewportOverlay.tsx`

#### Verification Shape
- the doc records one stable owner map
- the next phase outputs are concrete enough to implement without re-planning the whole file

#### Done Shape
- the file has one explicit owner inventory and one agreed extraction order

### Phase 1 Result

#### Locked Owner Map

- confirmed the accepted-runtime type and helper seam as the smallest clean first extraction target
- confirmed the giant selector block as a later dedicated read-model phase instead of an early mixed move
- confirmed the geometry-sketch and sketch-plane session seam as its own later extraction lane instead of an accidental Phase 2 widening

#### Approved Module Targets

- `src/app/spaghetti/store/graphRuntime/*`
  - runtime types
  - accepted build/result helper math
  - staged-preview clone/promotion helpers
- `src/app/spaghetti/store/history/*`
  - graph-edit and geometry-history helper seams
- `src/app/spaghetti/store/sketch/*`
  - sketch-plane and geometry-sketch session helper and action seams
- later selector files under `src/app/spaghetti/selectors/*` or `src/app/spaghetti/store/selectors/*`

#### Phase 1 Close Read

- `Phase 1` is now honestly complete
- `Phase 2 - Pure Types And Accepted Runtime Helper Extraction` is now the next implementation target
- later phases remain intentionally sequenced so the runtime, history, sketch, and selector seams do not collide in one oversized pass

## [x] `Gen 3 - Cleanup 2 / Phase 2` - `Pure Types And Accepted Runtime Helper Extraction`

### Phase 2 Summary

#### Purpose
- move the safest non-action seams out first so later runtime extraction has smaller root-surface noise

#### Owns
- pure exported types that do not need root-store closure access
- accepted build/result helper cluster
- compile-build and accepted-impact helper math

#### Does Not Own
- graph-edit action bodies
- sketch-session actions
- viewport/workspace behavior

#### Current Live Read
- the type surface around `GraphCompileBuildState`, `AcceptedBuildImpactSnapshot`, and `GraphRuntimeState` is already visible near the top of the file
- the accepted-build helper cluster starts around `finalizeAcceptedBuildBundle(...)` and `buildAcceptedBuildImpactSnapshot(...)`
- this is the smallest clean first move after `Phase 1`

### Phase 2 Implementation Spec

#### Exact First Code Cut
- add explicit owner modules for accepted-runtime types and pure helper functions
- re-export or import them through the root facade without changing public callers

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/graphRuntime/*`
- focused runtime tests already covering accepted build/result shaping

#### No-Widening Rule
- do not move action closures that depend on `set` or `get`
- do not widen into selector extraction yet

#### Verification Shape
- `npm.cmd run build` passes
- focused runtime tests still pass for accepted build/result shaping

#### Done Shape
- the root file no longer owns the accepted-runtime helper bulk directly

### Phase 2 Result

#### Landed Extraction

- added `src/app/spaghetti/store/graphRuntime/acceptedRuntime.ts` as the first `graphRuntime/*` owner-area module
- moved `GraphCompileBuildState`, `AcceptedBuildImpactSnapshot`, `StagedAuthoritativePreviewResult`, and `GraphRuntimeState` into that module
- moved `finalizeAcceptedBuildBundle(...)`, `buildAcceptedBuildImpactSnapshot(...)`, `buildFinalizedAcceptedResultArtifacts(...)`, and the accepted build/result clone-promotion helpers into that module
- kept one exported `useSpaghettiStore` facade by re-exporting the moved runtime types through `useSpaghettiStore.ts`

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/useSpaghettiStore.test.ts` still fails in the same two `OutputPreview` expectation drifts that now show `publicationMode` fields inside normalized slot params, which sits outside this accepted-runtime extraction seam

#### Phase 2 Close Read

- `Phase 2` is now honestly complete
- the broad `Phase 3` history lane is still the next family concern, but it should be intentionally split before implementation because the pure geometry-sketch history helper seam is safer than the live graph-history commit adapters
- selector, sketch-session, and viewer or overlay cleanup remain deliberately deferred and untouched by this pass

## [ ] `Gen 3 - Cleanup 2 / Phase 3` - `Graph Edit And History Helper Extraction`

### Phase 3 Summary

#### Purpose
- separate graph-edit and geometry-history helper seams from the accepted-runtime seam before moving sketch-session actions

#### Owns
- graph-edit history option/helper surfaces
- geometry-sketch local-history shaping
- child-summary and restore-point helper clusters

#### Does Not Own
- viewport or workspace runtime behavior
- active sketch-session state mutation
- viewer-specific rendering helpers

#### Current Live Read
- graph node move, connect, parameter, feature, and geometry-sketch history option types cluster early in the file around the first 220 lines
- the pure geometry-sketch history helper cluster is concentrated around:
  - `cloneGeometrySketchSessionSnapshot(...)` at `useSpaghettiStore.ts:2450`
  - `buildGeometrySketchSessionSnapshot(...)` at `useSpaghettiStore.ts:2462`
  - `applyGeometrySketchSessionSnapshot(...)` at `useSpaghettiStore.ts:2483`
  - `cloneGeometrySketchSessionHistoryCommand(...)` at `useSpaghettiStore.ts:2521`
  - `buildGeometrySketchLocalHistoryState(...)` at `useSpaghettiStore.ts:2550`
  - `buildGeometrySketchSessionWithHistory(...)` at `useSpaghettiStore.ts:2591`
- the live graph-history commit adapters such as `commitGeometrySketchFeatureHistoryCommand(...)`, `commitPartFeatureParameterHistoryCommand(...)`, and `commitGraphNodeParameterHistoryCommand(...)` sit earlier and still depend directly on `useSpaghettiStore.getState()` plus `editHistoryStore`, which makes them a riskier first move than the pure helper cluster

### Phase 3 Implementation Spec

#### Exact First Code Cut
- do not keep the old broad `Phase 3` as one blind extraction pass
- use `Phase 3.1` for the pure geometry-sketch session snapshot, local-history, and staged-command helper cluster
- use later `Phase 3.x` follow-up work for the graph-history commit adapter helpers that still depend on direct store/edit-history wiring

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/history/*`
- `src/app/store/editHistoryStore.ts`

#### No-Widening Rule
- do not move viewport drag or workspace pick behavior
- do not combine this slice with accepted-runtime or selector cleanup if either grows

#### Verification Shape
- focused graph-edit-history tests still pass
- root history actions still read through the same user-facing flows

#### Done Shape
- history helper bulk has an explicit owner area and the root file keeps only composition glue

### Phase 3 Narrowing Decision

- do not dispatch the old broad `Phase 3` as one implementation pass
- `Phase 3.1 - Geometry Sketch History Helper Extraction` is now the next implementation-ready slice
- graph-history commit adapter extraction remains later `Phase 3.x` work after the pure helper seam is isolated

## [x] `Gen 3 - Cleanup 2 / Phase 3.1` - `Geometry Sketch History Helper Extraction`

### Phase 3.1 Summary

#### Purpose
- move the pure geometry-sketch history helper seam out first so the store file loses the densest session snapshot and local-history bulk before any live commit-adapter extraction starts

#### Owns
- geometry-sketch session snapshot clone/build/apply helpers
- geometry-sketch local-history clone/build helpers
- staged-command and child-summary helper shaping
- pure history-selection helpers such as preferred-command selection and history-state updates

#### Does Not Own
- live graph-history commit adapters
- `editHistoryStore.commitEntry(...)` call sites
- geometry-sketch action closures that still depend on `set` or `get`

#### Current Live Read
- the cleanest pure helper seam starts around `cloneGeometrySketchSessionSnapshot(...)` at `useSpaghettiStore.ts:2450`
- it continues through `buildGeometrySketchSessionWithHistory(...)` at `useSpaghettiStore.ts:2591`
- that block depends on existing clone and params helpers, but it does not need direct `set`/`get` store closure access

### Phase 3.1 Implementation Spec

#### Exact First Code Cut
- add a new owner-area history module under `src/app/spaghetti/store/history/*`
- move only the pure geometry-sketch session snapshot, local-history, staged-command, child-summary, and child-restore helper cluster into that module
- keep the live commit adapters and action closures in `useSpaghettiStore.ts`

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/history/*`
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`

#### No-Widening Rule
- do not move `commitGeometrySketchFeatureHistoryCommand(...)` in this pass
- do not move graph node/edge history entry adapters in this pass
- do not touch selectors, sketch-session runtime actions, or viewer/overlay files

#### Verification Shape
- `npm.cmd run build` passes
- focused graph-edit and sketch-history tests still pass
- the root file now imports the moved helper cluster instead of defining it inline

#### Done Shape
- the pure geometry-sketch history helper bulk has an explicit owner module and `Phase 3.2` becomes the next honest follow-up instead of hidden leftover scope

## [x] `Gen 3 - Cleanup 2 / Phase 3.2` - `Geometry Sketch Commit Adapter Extraction`

### Phase 3.2 Summary

#### Purpose
- move the geometry-sketch-specific history commit adapter seam next, while the helper cluster it depends on is already isolated in `history/geometrySketchHistory.ts`

#### Owns
- `commitGeometrySketchFeatureHistoryCommand(...)`
- `buildGeometrySketchStagedCommand(...)`
- `createGeometrySketchChildRestorePoints(...)`
- any tiny geometry-sketch history adapter helpers that exist only to support that same seam

#### Does Not Own
- part feature parameter history adapters
- part sketch feature history adapters
- graph node parameter or move history adapters
- selector or runtime-action extraction

#### Current Live Read
- the geometry-sketch commit adapter seam remains clustered around:
  - `commitGeometrySketchFeatureHistoryCommand(...)` at `useSpaghettiStore.ts:1963`
  - `buildGeometrySketchStagedCommand(...)` immediately below that area
  - `createGeometrySketchChildRestorePoints(...)` below the tool-selection helper
- these helpers still depend on root-local graph reads, param equality checks, staged-command ID generation, and restore callbacks, but they now sit on top of a cleaner imported helper layer after `Phase 3.1`

### Phase 3.2 Implementation Spec

#### Exact First Code Cut
- add a narrow geometry-sketch adapter module under `src/app/spaghetti/store/history/*`
- move only the geometry-sketch commit adapter, staged-command builder, and child-restore helper seam into that module
- inject the root-local dependencies it still needs instead of widening the move to unrelated graph-history adapters

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/history/*`
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`

#### No-Widening Rule
- do not move `commitPartFeatureParameterHistoryCommand(...)` in this pass
- do not move `commitPartSketchFeatureHistoryCommand(...)` in this pass
- do not move `commitGraphNodeParameterHistoryCommand(...)` or `commitGraphNodeMoveHistoryCommand(...)` in this pass
- do not widen into sketch-session runtime actions, selectors, or viewer/overlay files

#### Verification Shape
- `npm.cmd run build` passes
- focused graph-edit and sketch-history tests still pass
- the root file imports the moved geometry-sketch adapter seam instead of owning it inline

#### Done Shape
- the geometry-sketch-specific history adapter seam has an explicit owner module and `Phase 3.3` becomes the next honest history follow-up

### Phase 3.2 Result

#### Landed Extraction

- added `src/app/spaghetti/store/history/geometrySketchHistoryCommitAdapter.ts` as the focused `history/*` owner module for the geometry-sketch-specific commit adapter seam
- moved `commitGeometrySketchFeatureHistoryCommand(...)`, `buildGeometrySketchStagedCommand(...)`, and `createGeometrySketchChildRestorePoints(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved adapter seam through injected active-graph reads, graph normalization, node-param clone and equality helpers, staged-command and history-entry ID generation, edit-history commit wiring, and geometry-sketch restore callbacks
- left `buildGeometrySketchToolSelectionCommand(...)` in `src/app/spaghetti/store/useSpaghettiStore.ts` because it is outside the approved `Phase 3.2` seam and does not participate in the moved commit-adapter path

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/graphEditHistoryStore.test.ts src/app/spaghetti/store/sketchEditHistoryStore.test.ts` passed

#### Phase 3.2 Close Read

- `Phase 3.2` is now honestly complete
- `Phase 3.3 - Remaining Graph-History Commit Adapter Extraction` is now the next implementation target
- selector, sketch-session runtime action, and viewer or overlay cleanup remain deliberately deferred and untouched by this pass

### Phase 3.1 Result

#### Landed Extraction

- added `src/app/spaghetti/store/history/geometrySketchHistory.ts` as the first focused `history/*` owner-area module
- moved `GeometrySketchSessionSnapshot`, `GeometrySketchStagedCommand`, `GeometrySketchToolSelectionCommand`, `GeometrySketchSessionHistoryCommand`, and `GeometrySketchLocalHistoryState` into that module
- moved the pure geometry-sketch session snapshot clone/build/apply helpers, committed-session snapshot helper, local-history target-id helper, local-history clone/build/update helpers, preferred-command selection helper, session-with-history composition helper, and child-summary shaping helper into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to import the moved helper cluster while keeping the live graph-history commit adapters, staged-command builders, and child-restore closures in the root file

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/graphEditHistoryStore.test.ts src/app/spaghetti/store/sketchEditHistoryStore.test.ts` passed

#### Phase 3.1 Close Read

- `Phase 3.1` is now honestly complete
- `Phase 3.2 - Geometry Sketch Commit Adapter Extraction` is now the next implementation target
- selector, sketch-session runtime action, and viewer or overlay cleanup remain deliberately deferred and untouched by this pass

## [x] `Gen 3 - Cleanup 2 / Phase 4` - `Sketch Session And Plane Pick Slice Extraction`

### Phase 4 Summary

#### Purpose
- move the geometry-sketch and sketch-plane session seam behind explicit owner modules without widening into the full viewer runtime

#### Owns
- sketch plane pick session helpers
- geometry sketch session state/actions
- geometry sketch history scrub helper surface

#### Does Not Own
- viewer overlay rendering
- `ViewportOverlay.tsx` VM assembly
- `Viewer.ts` direct-manipulation runtime

#### Current Live Read
- the spaghetti store is already the canonical owner for geometry sketch session truth
- later UI surfaces consume `sketchPlanePickSession`, `geometrySketchSession`, and `geometrySketchHistoryScrub`, so the owner split must happen here first

### Phase 4 Implementation Spec

#### Exact First Code Cut
- create one narrow sketch-session owner module
- move only the session helpers and directly paired action bodies
- keep public store selectors stable through the root facade

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/sketch/*`
- focused sketch-session tests

#### No-Widening Rule
- do not touch `ViewportOverlay.tsx` in the same pass
- do not move viewer event-routing code

#### Verification Shape
- focused sketch-session and history-scrub tests still pass
- active sketch-plane and geometry-sketch flows still read from the same public store surface

#### Done Shape
- sketch-session truth has one explicit owner module beneath the store facade

### Phase 4 Narrowing Decision

- do not dispatch the old broad `Phase 4` as one implementation pass
- `Phase 4.1 - Sketch Plane Pick Command Session Extraction` is the next implementation-ready sketch-session slice after the history lane closes
- `Phase 4.2 - Sketch Plane Pick Draft Transform Extraction` remains the follow-up slice for the draft-transform setter seam
- `Phase 4.3 - Geometry Sketch Plane Graph Write Extraction` remains the follow-up slice for direct plane writes back into graph truth
- `Phase 4.4 - Geometry Sketch Session Lifecycle Extraction` remains the follow-up slice for open, close, return-level, and history-scrub handoff behavior
- `Phase 4.5 - Geometry Sketch Draw Draft Action Extraction` remains the follow-up slice for draw-draft, staged-command, and undo or redo action bodies
- `Phase 4.6 - Geometry Sketch Selection Action Extraction` remains the follow-up slice for selection-window, selected-component, and delete behavior
- `Phase 4.7 - Geometry Sketch Component Edit Action Extraction` remains the final sketch-session follow-up for component and selected-profile edit behavior

## [x] `Gen 3 - Cleanup 2 / Phase 4.1` - `Sketch Plane Pick Command Session Extraction`

### Phase 4.1 Summary

#### Purpose
- move the sketch-plane pick command-routing and stage-transition seam out first so the session command flow becomes explicit before the draft-transform setters and graph-write actions move

#### Owns
- `confirmSketchPlanePick(...)`
- `setSketchPlanePickDraftPlane(...)`
- `reopenSketchPlanePickPlaneSelection(...)`
- `setSketchPlanePickGizmoMode(...)`
- `setSketchPlanePickPreviewPlane(...)`
- `acceptActiveSketchPlaneTransformCommand(...)`
- `commitSketchPlaneTransformHistoryFromDraftRelease(...)`
- `toggleSketchPlaneTransformHistoryLock(...)`
- `mergeSketchPlaneTransformHistory(...)`
- `runSketchPlaneCommand(...)`
- `buildSketchPlaneMovePrompt(...)`
- `buildSketchPlaneMoveAxisPrompt(...)`
- `buildSketchPlaneMoveAxisOffSnapConfirmPrompt(...)`
- `buildSketchPlaneMoveSessionState(...)`
- `buildSketchPlaneRotatePrompt(...)`
- `buildSketchPlaneSnapPrompt(...)`
- `SKETCH_PLANE_ROOT_PROMPT`

#### Does Not Own
- `resetSketchPlanePickDraftTransform(...)`
- `setSketchPlanePickDraftTransform(...)`
- `setSketchPlanePickTranslationAxis(...)`
- `setSketchPlanePickRotationAxis(...)`
- `setSketchPlaneMoveAxisOffSnapConfirmation(...)`
- `clearSketchPlaneMoveAxisOffSnapConfirmation(...)`
- `setGeometrySketchPlane(...)`
- `setGeometrySketchPlaneOffset(...)`
- `setGeometrySketchPlaneTranslationAxis(...)`
- `setGeometrySketchPlaneRotationAxis(...)`
- `setGeometrySketchPlaneInPlaneRotation(...)`
- geometry-sketch session lifecycle, draw, selection, or component-edit actions
- selector extraction

#### Current Live Read
- the command-routing and stage-transition seam is clustered around:
  - `confirmSketchPlanePick(...)` at `useSpaghettiStore.ts:4667`
  - `setSketchPlanePickDraftPlane(...)` at `useSpaghettiStore.ts:4731`
  - `reopenSketchPlanePickPlaneSelection(...)` at `useSpaghettiStore.ts:4765`
  - `setSketchPlanePickGizmoMode(...)` at `useSpaghettiStore.ts:4789`
  - `setSketchPlanePickPreviewPlane(...)` at `useSpaghettiStore.ts:4807`
  - `acceptActiveSketchPlaneTransformCommand(...)` at `useSpaghettiStore.ts:4821`
  - `commitSketchPlaneTransformHistoryFromDraftRelease(...)` at `useSpaghettiStore.ts:4869`
  - `toggleSketchPlaneTransformHistoryLock(...)` at `useSpaghettiStore.ts:4908`
  - `mergeSketchPlaneTransformHistory(...)` at `useSpaghettiStore.ts:4936`
  - `runSketchPlaneCommand(...)` at `useSpaghettiStore.ts:4959`
- the supporting sketch-plane command helpers remain clustered around:
  - `buildSketchPlaneMovePrompt(...)` at `useSpaghettiStore.ts:2157`
  - `buildSketchPlaneMoveAxisPrompt(...)` at `useSpaghettiStore.ts:2164`
  - `buildSketchPlaneMoveAxisOffSnapConfirmPrompt(...)` at `useSpaghettiStore.ts:2167`
  - `buildSketchPlaneMoveSessionState(...)` at `useSpaghettiStore.ts:2172`
  - `buildSketchPlaneRotatePrompt(...)` at `useSpaghettiStore.ts:2185`
  - `buildSketchPlaneSnapPrompt(...)` at `useSpaghettiStore.ts:2192`
  - `SKETCH_PLANE_ROOT_PROMPT` at `useSpaghettiStore.ts:2200`

### Phase 4.1 Implementation Spec

#### Exact First Code Cut
- add a narrow sketch-plane command-session module under `src/app/spaghetti/store/sketch/*`
- move only the sketch-plane command-routing, prompt-building, and stage-transition seam into that module
- inject the root-local `set`, `get`, console logging, UI prefs reads, transform-history helpers, and finish or cancel callbacks it still needs instead of widening the move to later draft-transform setters or graph-write actions

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/sketch/*`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule
- do not move the draft-transform setter seam in this pass
- do not move the direct geometry-sketch plane graph-write actions in this pass
- do not move geometry-sketch session lifecycle, draw, selection, or component-edit actions in this pass
- do not widen into selector, viewer, or overlay files

#### Verification Shape
- `npm.cmd run build` passes
- focused sketch-plane and `useSpaghettiStore` tests still pass for the command-session flows
- the root file imports the moved sketch-plane command-session seam instead of owning it inline

#### Done Shape
- the sketch-plane command-routing and stage-transition seam has an explicit owner module and `Phase 4.2` becomes the next honest sketch-session follow-up

### Phase 4.1 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/sketchPlaneCommandSession.ts` as the focused `sketch/*` owner module for the sketch-plane command-routing and stage-transition seam
- moved `confirmSketchPlanePick(...)`, `setSketchPlanePickDraftPlane(...)`, `reopenSketchPlanePickPlaneSelection(...)`, `setSketchPlanePickGizmoMode(...)`, `setSketchPlanePickPreviewPlane(...)`, `acceptActiveSketchPlaneTransformCommand(...)`, `commitSketchPlaneTransformHistoryFromDraftRelease(...)`, `toggleSketchPlaneTransformHistoryLock(...)`, `mergeSketchPlaneTransformHistory(...)`, `runSketchPlaneCommand(...)`, and the supporting sketch-plane prompt and session-builder helpers into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set`, `get`, console logging, UI prefs reads, transform-history helpers, finish and cancel callbacks, and geometry-sketch session open behavior while keeping the public store API unchanged
- left the draft-transform setters, direct geometry-sketch plane graph writes, geometry-sketch lifecycle actions, selectors, and broader runtime flows in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.1` seam

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/useSpaghettiStore.test.ts -t "sketch-plane"` passed
- `npm.cmd run test -- src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` passed

#### Phase 4.1 Close Read

- `Phase 4.1` is now honestly complete
- `Phase 4.2 - Sketch Plane Pick Draft Transform Extraction` is now the next implementation target
- later plane graph-write, geometry-sketch lifecycle, draw, selection, and component-edit follow-up seams remain deliberately deferred and untouched by this pass

## [x] `Gen 3 - Cleanup 2 / Phase 4.2` - `Sketch Plane Pick Draft Transform Extraction`

### Phase 4.2 Summary

#### Purpose
- move the sketch-plane draft-transform setter seam out next so the root file loses the concentrated transform-draft mutation path before any direct graph-write extraction starts

#### Owns
- `resetSketchPlanePickDraftTransform(...)`
- `setSketchPlanePickDraftTransform(...)`
- `setSketchPlanePickTranslationAxis(...)`
- `setSketchPlanePickRotationAxis(...)`
- `setSketchPlaneMoveAxisOffSnapConfirmation(...)`
- `clearSketchPlaneMoveAxisOffSnapConfirmation(...)`

#### Does Not Own
- sketch-plane command-routing and prompt-building helpers already moved in `Phase 4.1`
- `setGeometrySketchPlane(...)`
- `setGeometrySketchPlaneOffset(...)`
- `setGeometrySketchPlaneTranslationAxis(...)`
- `setGeometrySketchPlaneRotationAxis(...)`
- `setGeometrySketchPlaneInPlaneRotation(...)`
- geometry-sketch session lifecycle, draw, selection, or component-edit actions
- selector extraction

#### Current Live Read
- the draft-transform setter seam is clustered around:
  - `resetSketchPlanePickDraftTransform(...)` at `useSpaghettiStore.ts:5171`
  - `setSketchPlanePickDraftTransform(...)` at `useSpaghettiStore.ts:5204`
  - `setSketchPlanePickTranslationAxis(...)` at `useSpaghettiStore.ts:5260`
  - `setSketchPlanePickRotationAxis(...)` at `useSpaghettiStore.ts:5294`
  - `setSketchPlaneMoveAxisOffSnapConfirmation(...)` at `useSpaghettiStore.ts:5324`
  - `clearSketchPlaneMoveAxisOffSnapConfirmation(...)` at `useSpaghettiStore.ts:5362`
- these actions share the same session draft-transform mutation surface, numeric normalization, and console feedback path without needing the later graph-write or geometry-sketch session lifecycle seams

### Phase 4.2 Implementation Spec

#### Exact First Code Cut
- add a narrow sketch-plane draft-transform module under `src/app/spaghetti/store/sketch/*`
- move only the sketch-plane draft-transform setter and off-snap confirmation seam into that module
- inject the root-local `set`, console logging, numeric normalization helpers, and default-transform helpers it still needs instead of widening the move to direct graph writes or geometry-sketch lifecycle actions

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/sketch/*`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule
- do not move the direct geometry-sketch plane graph-write seam in this pass
- do not move geometry-sketch session lifecycle, draw, selection, or component-edit actions in this pass
- do not widen into selector, viewer, or overlay files

#### Verification Shape
- `npm.cmd run build` passes
- focused sketch-plane draft-transform and `useSpaghettiStore` tests still pass
- the root file imports the moved draft-transform seam instead of owning it inline

#### Done Shape
- the sketch-plane draft-transform setter seam has an explicit owner module and `Phase 4.3` becomes the next honest sketch-session follow-up

### Phase 4.2 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/sketchPlanePickDraftTransform.ts` as the focused `sketch/*` owner module for the sketch-plane draft-transform setter and off-snap confirmation seam
- moved `resetSketchPlanePickDraftTransform(...)`, `setSketchPlanePickDraftTransform(...)`, `setSketchPlanePickTranslationAxis(...)`, `setSketchPlanePickRotationAxis(...)`, `setSketchPlaneMoveAxisOffSnapConfirmation(...)`, and `clearSketchPlaneMoveAxisOffSnapConfirmation(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set`, console logging, finite-number normalization helpers, and default, clone, or equality transform helpers while keeping the public store API unchanged
- left the direct geometry-sketch plane graph-write actions, geometry-sketch lifecycle actions, selectors, and broader runtime flows in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.2` seam

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/useSpaghettiStore.test.ts -t "sketch-plane"` passed
- `npm.cmd run test -- src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` passed

#### Phase 4.2 Close Read

- `Phase 4.2` is now honestly complete
- `Phase 4.3 - Geometry Sketch Plane Graph Write Extraction` is now the next implementation target
- later geometry-sketch lifecycle, draw, selection, and component-edit follow-up seams remain deliberately deferred and untouched by this pass

### Phase 4.3 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/geometrySketchPlaneGraphWrite.ts` as the focused `sketch/*` owner module for the direct geometry-sketch plane graph-write seam
- moved `setGeometrySketchPlane(...)`, `setGeometrySketchPlaneOffset(...)`, `setGeometrySketchPlaneTranslationAxis(...)`, `setGeometrySketchPlaneRotationAxis(...)`, and `setGeometrySketchPlaneInPlaneRotation(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set`, sketch-plane guards, graph-update helpers, transform-normalization helpers, and sketch-plane pick-session pruning while keeping the public store API unchanged
- left the geometry-sketch lifecycle and history-scrub actions, draw-draft and staged-command actions, selectors, and broader runtime flows in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.3` seam

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/useSpaghettiStore.test.ts -t "sketch-plane"` passed
- `npm.cmd run test -- src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` passed

#### Phase 4.3 Close Read

- `Phase 4.3` is now honestly complete
- `Phase 4.4 - Geometry Sketch Session Lifecycle Extraction` is now the next implementation target
- later geometry-sketch draw, selection, and component-edit follow-up seams remain deliberately deferred and untouched by this pass

### Phase 4.4 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/geometrySketchSessionLifecycle.ts` as the focused `sketch/*` owner module for the geometry-sketch session lifecycle and history-scrub handoff seam
- moved `startGeometrySketchSession(...)`, `closeGeometrySketchSession(...)`, `openGeometrySketchHistoryScrub(...)`, `clearGeometrySketchHistoryScrub(...)`, and `returnActiveSketchSessionOneLevel(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set` and `get`, geometry-sketch snapshot and local-history helpers, viewport collapse and restore hooks, console prompt builders, and the retained root callbacks for sketch-plane and draw-draft cancellation while keeping the public store API unchanged
- left the geometry-sketch draw-draft, staged-command, selection, delete, and component-edit actions in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.4` seam

#### Verification Result

- `npm.cmd run build` passed
- `npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts --testNamePattern "tracks draw/review session state and closes plane-pick when sketch editing begins|collapses the active editor viewport while draw sketch is open and restores it on close|uses returnActiveSketchSessionOneLevel across sketch-plane and sketch-draw session levels"` passed
- `npx vitest run src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` passed

#### Phase 4.4 Close Read

- `Phase 4.4` is now honestly complete
- the broad `Phase 4.5` draw-session concern is now intentionally narrowed
- `Phase 4.5.1 - Draw Session Control Extraction` is now the next implementation target
- later geometry-sketch selection and component-edit follow-up seams remain deliberately deferred and untouched by this pass

### Phase 4.5.1 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/geometrySketchDrawSessionControl.ts` as the focused `sketch/*` owner module for the geometry-sketch draw session control seam
- moved `runGeometrySketchDrawCommand(...)`, `setGeometrySketchSessionTool(...)`, and `setGeometrySketchDrawHoverPoint(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set` and `get`, draw-command normalization, session snapshot builders, geometry-sketch draft helpers, and retained root callbacks for the later finish, cancel, delete, and close actions while keeping the public store API unchanged
- left `confirmGeometrySketchDrawPoint(...)`, `finishGeometrySketchDrawDraft(...)`, `undoGeometrySketchDrawDraftPoint(...)`, `undoGeometrySketchStagedCommand(...)`, `redoGeometrySketchStagedCommand(...)`, `cancelGeometrySketchDrawDraft(...)`, and the later selection or component-edit actions in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.5.1` seam

#### Verification Result

- `npm.cmd run build` passed
- `npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts --testNamePattern "appends rich draw prompts when sketch draw starts, switches to PLine, and finishes|tracks viewer-owned Line draft points and commits a line on the second point before returning to idle|tracks viewer-owned Rectangle draft points and commits a rectangle on the second point before returning to idle|tracks viewer-owned Circle center and radius witness points and commits a circle on the second point before returning to idle"` passed

#### Phase 4.5.1 Close Read

- `Phase 4.5.1` is now honestly complete
- `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` is now the next implementation target
- later geometry-sketch selection and component-edit follow-up seams remain deliberately deferred and untouched by this pass

### Phase 4.5.2 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/geometrySketchDrawDraftActions.ts` as the focused `sketch/*` owner module for the geometry-sketch draw draft commit and undo seam
- moved `confirmGeometrySketchDrawPoint(...)`, `finishGeometrySketchDrawDraft(...)`, `undoGeometrySketchDrawDraftPoint(...)`, `undoGeometrySketchStagedCommand(...)`, `redoGeometrySketchStagedCommand(...)`, and `cancelGeometrySketchDrawDraft(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set` and `get`, geometry-sketch staged-command and session-snapshot helpers, graph-update and local-history helpers, draft normalization helpers, and retained root radius-commit behavior while keeping the public store API unchanged
- left `confirmGeometrySketchDrawRadius(...)`, the later selection and delete actions, and the later component-edit actions in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.5.2` seam

#### Verification Result

- `npm.cmd run build` passed
- `npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts --testNamePattern "tracks viewer-owned Line draft points and commits a line on the second point before returning to idle|tracks viewer-owned Rectangle draft points and commits a rectangle on the second point before returning to idle|tracks viewer-owned Circle center and radius witness points and commits a circle on the second point before returning to idle|stages Sketch Draw delete-selected as one undoable in-session command"` passed
- `npx vitest run src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts --testNamePattern "opens and clears read-only Sketch Draw history scrub without creating local authoring history|rejects Sketch Draw history scrub targets that are not active geometry sketch nodes"` passed

#### Phase 4.5.2 Close Read

- `Phase 4.5.2` is now honestly complete
- `Phase 4.6 - Geometry Sketch Selection Action Extraction` is now the next implementation target
- later geometry-sketch component-edit follow-up seams remain deliberately deferred and untouched by this pass

### Phase 4.6 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/geometrySketchSelectionActions.ts` as the focused `sketch/*` owner module for the geometry-sketch selection and delete seam
- moved `setGeometrySketchHoveredComponent(...)`, `setGeometrySketchSelectedComponents(...)`, `setGeometrySketchSelectionWindowDraft(...)`, and `deleteGeometrySketchSelectedComponents(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set`, selection normalization helpers, draft-point normalization helpers, graph-update helpers, and staged-command plus session-snapshot helpers while keeping the public store API unchanged
- left `confirmGeometrySketchDrawRadius(...)` and the later component-edit actions in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.6` seam

#### Verification Result

- `npm.cmd run build` passed
- `npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts --testNamePattern "tracks idle sketch entity selection and deletes the selected components|clears idle entity selection when a new draw tool is armed"` passed

#### Phase 4.6 Close Read

- `Phase 4.6` is now honestly complete
- `Phase 4.7 - Geometry Sketch Component Edit Action Extraction` is now the next implementation target
- the sketch-session action lane is now down to the final component-edit follow-up seam before the later selector work

### Phase 4.7 Result

#### Landed Extraction

- added `src/app/spaghetti/store/sketch/geometrySketchComponentEditActions.ts` as the focused `sketch/*` owner module for the geometry-sketch component-edit seam
- moved `appendGeometrySketchComponent(...)`, `updateGeometrySketchComponentPoint(...)`, `setGeometrySketchComponentName(...)`, `setGeometrySketchDrawGroupName(...)`, `moveGeometrySketchComponentUp(...)`, `moveGeometrySketchComponentDown(...)`, `removeGeometrySketchComponent(...)`, and `setGeometrySketchSelectedProfile(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved seam through injected root-local `set`, graph-update helpers, sketch recomputation helpers, component-name normalization, and root-facade graph-state update hooks while keeping the public store API unchanged
- left the later selector, facade-shrink, and closeout work in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 4.7` seam

#### Verification Result

- `npm.cmd run build` passed
- `npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts --testNamePattern "appends managed sketch components and recomputes profiles for Geometry/Sketch nodes"` passed

#### Phase 4.7 Close Read

- `Phase 4.7` is now honestly complete
- the full sketch-session action lane is now complete
- the broad `Phase 5.1` selector concern is now intentionally narrowed
- `Phase 5.1.1 - Graph Document And Runtime Selector Extraction` is now complete
- `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` is now the next implementation target
- viewer-target, output-surface, preview-preparation, and accepted-result projections still remain deferred to later `Phase 5.x` passes

## [ ] `Gen 3 - Cleanup 2 / Phase 5` - `Selector And Workspace Read-Model Extraction`

### Phase 5 Summary

#### Purpose
- split the late selector/read-model surface so the root file stops owning the huge query layer directly

#### Owns
- large selector clusters
- workspace/editor viewport read-model helpers
- pure projection helpers that derive from store truth

#### Does Not Own
- accepted-runtime truth
- sketch-session action logic
- actual workspace store ownership

#### Current Live Read
- the file carries a large selector cluster before the root `create(...)` block
- workspace and viewport helper imports near the top indicate a mixed read-model seam that should become explicit before the final facade shrink

### Phase 5 Implementation Spec

#### Exact First Code Cut
- extract only pure selectors and read-model helpers first
- route them through owner-area selector files instead of keeping them inline in the root

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/selectors/*`
- `src/app/spaghetti/selectors/*`

#### No-Widening Rule
- do not move action bodies in the same pass
- do not let workspace projections become a second owner of graph truth

#### Verification Shape
- focused selector tests still pass
- viewport/editor reads still resolve through the same public store surface

#### Done Shape
- the root file stops owning the main query layer directly

### Phase 5 Narrowing Decision

- do not dispatch the old broad `Phase 5` as one implementation pass
- `Phase 5.1 - Active Graph Runtime Selector Extraction` is the first selector slice
- `Phase 5.2 - Accepted Result And Preview Selector Extraction` is the second selector slice
- `Phase 5.3 - Editor Viewport And Workspace Selector Extraction` is the final selector slice

## [x] `Gen 3 - Cleanup 2 / Phase 5.1` - `Active Graph Runtime Selector Extraction`

### Phase 5.1 Summary

#### Purpose
- extract the first selector lane around graph document, active graph, graph runtime, and closely paired compile-result reads before the broader viewer-target and output-surface projections move

#### Owns
- the first late-file selector cluster rooted in active graph-document and graph-runtime reads
- the split between the lighter graph-document/runtime selectors and the later broader output-surface and viewer-target projections
- the first dedicated selector-owner module under `src/app/spaghetti/selectors/*`

#### Does Not Own
- accepted-result selectors
- preview-preparation or output-surface selectors
- editor viewport or workspace-facing read models
- any action bodies or runtime mutation seams

#### Current Live Read
- the broad selector concern is now concentrated from `selectActiveGraphDocument(...)` around `useSpaghettiStore.ts:3661` through the late selector block ending before the root `create(...)` facade
- the cleanest first selector move is still the graph-document and active-runtime seam because it has the lightest dependency footprint and can move without absorbing the later viewer-target and output-surface projection band
- `Phase 5.1` is implementation-ready only as a narrowed two-slice lane, not as one giant selector rewrite

### Phase 5.1 Implementation Spec

#### Exact First Code Cut
- do not dispatch the whole broad `Phase 5.1` selector concern as one code pass
- treat `Phase 5.1` as the prepared parent lane for two smaller implementation slices:
  - `Phase 5.1.1 - Graph Document And Runtime Selector Extraction`
  - `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction`
- implement `Phase 5.1.1` first and leave `Phase 5.1.2` explicitly deferred until that first cut is proven

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`
- later selector files under `src/app/spaghetti/selectors/*`
- focused selector and store-read tests

#### No-Widening Rule
- do not move accepted-result selectors in this lane
- do not move viewport/editor workspace selectors in this lane
- do not mix selector extraction with runtime action cleanup or facade-shrink work

#### Verification Shape
- `npm.cmd run build` passes
- focused selector tests pass for the moved graph document/runtime seam
- active graph document, runtime, and compile-result reads still resolve through the same public store surface after rewiring

#### Done Shape
- `Phase 5.1` is honestly complete only when both `Phase 5.1.1` and `Phase 5.1.2` are landed without widening into `Phase 5.2`
- that condition is now met, so `Phase 5.2` becomes the next approved implementation target

### Phase 5.1 Narrowing Decision

- do not dispatch `Phase 5.1` as one pass even though it is now implementation-ready as a parent lane
- `Phase 5.1.1` is now complete as the first explicit implementation slice
- `Phase 5.1.2` is now complete as the second explicit implementation slice
- `Phase 5.2` is now the follow-up for the accepted-result and preview selector seam

## [x] `Gen 3 - Cleanup 2 / Phase 5.1.1` - `Graph Document And Runtime Selector Extraction`

### Phase 5.1.1 Summary

#### Purpose
- isolate the lightest graph-document and active-runtime read seam first so the selector lane starts with one stable owner cut instead of the whole late projection surface

#### Owns
- the first graph-document, cached-entry, active-graph, and active-runtime selector cluster
- the first dedicated selector module at `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`
- rewiring those selectors through `useSpaghettiStore.ts` without changing the public store surface

#### Does Not Own
- viewer-target document/runtime selectors
- graph output or preview-preparation selectors
- accepted-result selectors
- any action bodies or workspace read-model selectors

#### Current Live Read
- the exact `Phase 5.1.1` seam is now grounded at:
  - `selectActiveGraphDocument(...)` at `useSpaghettiStore.ts:3661`
  - `selectGraphDocumentById(...)` at `useSpaghettiStore.ts:3671`
  - `selectOrderedGraphDocuments(...)` at `useSpaghettiStore.ts:3676`
  - `selectGraphBrowserStorageWorkingSetSnapshot(...)` at `useSpaghettiStore.ts:3683`
  - `selectCachedGraphEntryById(...)` at `useSpaghettiStore.ts:3697`
  - `selectCachedGraphEntryByDocumentId(...)` at `useSpaghettiStore.ts:3702`
  - `selectOrderedCachedGraphEntries(...)` at `useSpaghettiStore.ts:3710`
  - `selectActiveGraph(...)` at `useSpaghettiStore.ts:3717`
  - `selectGraphByDocumentId(...)` at `useSpaghettiStore.ts:3750`
  - `selectGraphReceiveReferencesByDocumentId(...)` at `useSpaghettiStore.ts:3755`
  - `selectGraphRuntimeByDocumentId(...)` at `useSpaghettiStore.ts:3761`
  - `selectActiveGraphRuntime(...)` at `useSpaghettiStore.ts:3766`
  - `selectGraphCompileResultByDocumentId(...)` at `useSpaghettiStore.ts:3799`
  - `selectActiveGraphCompileResult(...)` at `useSpaghettiStore.ts:3805`

### Phase 5.1.1 Implementation Spec

#### Exact First Code Cut
- add one focused selector module at `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`
- move only these selectors first:
  - `selectActiveGraphDocument(...)`
  - `selectGraphDocumentById(...)`
  - `selectOrderedGraphDocuments(...)`
  - `selectGraphBrowserStorageWorkingSetSnapshot(...)`
  - `selectCachedGraphEntryById(...)`
  - `selectCachedGraphEntryByDocumentId(...)`
  - `selectOrderedCachedGraphEntries(...)`
  - `selectActiveGraph(...)`
  - `selectGraphByDocumentId(...)`
  - `selectGraphReceiveReferencesByDocumentId(...)`
  - `selectGraphRuntimeByDocumentId(...)`
  - `selectActiveGraphRuntime(...)`
  - `selectGraphCompileResultByDocumentId(...)`
  - `selectActiveGraphCompileResult(...)`
- re-export or rewire those selectors through `src/app/spaghetti/store/useSpaghettiStore.ts` without changing the public store surface

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule
- do not move `selectViewerTargetGraphDocumentId(...)`, `selectSharedViewerComposition(...)`, `selectViewerTargetGraphDocument(...)`, `selectViewerTargetGraph(...)`, or `selectViewerTargetGraphRuntime(...)` in this pass
- do not move `selectGraphPreviewPreparationByDocumentId(...)`, `selectGraphOutputSurfaceByDocumentId(...)`, `selectResolvedGraphReceiveReferencesByDocumentId(...)`, `selectViewerTargetGraphOutputSurface(...)`, or `selectViewerTargetGraphPreviewPreparation(...)` in this pass
- do not move accepted-result selectors, viewport selectors, or any action bodies in this pass

#### Verification Shape
- `npm.cmd run build` passes
- `src/app/spaghetti/selectors/selectGraphDocumentRuntime.test.ts` or the nearest focused selector test passes
- focused `useSpaghettiStore` reads that cover active graph document and active runtime resolution still pass

#### Done Shape
- the root file no longer owns the first graph-document and active-runtime selector seam inline
- `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` becomes the next honest selector follow-up

### Phase 5.1.1 Result

#### Landed Extraction

- added `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts` as the first focused selector-owner module for graph-document, cached-entry, active-graph, graph-runtime, and compile-result reads
- moved `selectActiveGraphDocument(...)`, `selectGraphDocumentById(...)`, `selectOrderedGraphDocuments(...)`, `selectGraphBrowserStorageWorkingSetSnapshot(...)`, `selectCachedGraphEntryById(...)`, `selectCachedGraphEntryByDocumentId(...)`, `selectOrderedCachedGraphEntries(...)`, `selectActiveGraph(...)`, `selectGraphByDocumentId(...)`, `selectGraphReceiveReferencesByDocumentId(...)`, `selectGraphRuntimeByDocumentId(...)`, `selectActiveGraphRuntime(...)`, `selectGraphCompileResultByDocumentId(...)`, and `selectActiveGraphCompileResult(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to import and re-export the moved selector seam so the public store surface stayed stable while the root file stopped owning that first selector cluster inline
- added `src/app/spaghetti/selectors/selectGraphDocumentRuntime.test.ts` plus the barrel-contract update in `src/app/spaghetti/selectors/index.test.ts`
- left viewer-target, output-surface, preview-preparation, accepted-result, viewport, and workspace selectors in `src/app/spaghetti/store/useSpaghettiStore.ts` because they belong to the later `Phase 5.1.2` through `Phase 5.3` follow-up seams

#### Verification Result

- `npm.cmd run build` passed
- `npx.cmd vitest run src/app/spaghetti/selectors/selectGraphDocumentRuntime.test.ts src/app/spaghetti/selectors/index.test.ts` passed
- `npx.cmd vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "keeps the active GraphDocument in sync with the canonical graph bridge|selectGraphByDocumentId resolves the document graph before any viewport is opened|stores compile/build runtime per graph document and keeps preview-prep graph-local|selectGraphByDocumentId"` passed
- broader `npx.cmd vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts` still shows the same two unrelated `OutputPreview` expectation failures already present in the current worktree

#### Phase 5.1.1 Close Read

- `Phase 5.1.1` is now honestly complete
- `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` is now the next implementation target
- the first graph-document and active-runtime selector seam now has a dedicated `selectors/*` owner while the broader projection selectors remain deliberately deferred

## [x] `Gen 3 - Cleanup 2 / Phase 5.1.2` - `Graph Output And Viewer Target Selector Extraction`

### Phase 5.1.2 Summary

#### Purpose
- move the broader graph output, preview-preparation, and viewer-target runtime selector seam after the base graph document and runtime selectors are isolated

#### Owns
- the viewer-target graph projection seam
- output-surface, preview-preparation, and resolved receive-reference selector reads that still hang off the later graph-runtime projection band
- the follow-up selector-owner module or modules under `src/app/spaghetti/selectors/*`

#### Does Not Own
- accepted-result selectors
- viewport/editor workspace selectors
- any action bodies or facade-shrink work

#### Current Live Read
- the exact selectors deliberately deferred to `Phase 5.1.2` start at:
  - `selectViewerTargetGraphDocumentId(...)` at `useSpaghettiStore.ts:3694`
  - `selectSharedViewerComposition(...)` at `useSpaghettiStore.ts:3698`
  - `selectSharedViewerCompositionGraphDocumentIds(...)` at `useSpaghettiStore.ts:3702`
  - `selectIsGraphDocumentInSharedViewerComposition(...)` at `useSpaghettiStore.ts:3708`
  - `selectViewerTargetGraphDocument(...)` at `useSpaghettiStore.ts:3712`
  - `selectViewerTargetGraph(...)` at `useSpaghettiStore.ts:3718`
  - `selectViewerTargetGraphRuntime(...)` at `useSpaghettiStore.ts:3723`
  - `selectGraphPreviewPreparationByDocumentId(...)` at `useSpaghettiStore.ts:3751`
  - `selectGraphOutputSurfaceByDocumentId(...)` at `useSpaghettiStore.ts:3757`
  - `selectResolvedGraphReceiveReferencesByDocumentId(...)` at `useSpaghettiStore.ts:3763`
  - `selectViewerTargetGraphOutputSurface(...)` at `useSpaghettiStore.ts:3786`
  - `selectViewerTargetGraphPreviewPreparation(...)` at `useSpaghettiStore.ts:3791`
- the remaining seam now sits immediately after the landed `selectGraphDocumentRuntime.ts` re-export block, so the cleanest next move is still one focused viewer/output selector module before any accepted-result selectors begin

### Phase 5.1.2 Implementation Spec

#### Exact First Code Cut
- move only the deferred viewer-target, graph-output, and preview-preparation selector seam after `Phase 5.1.1` is landed
- move exactly this deferred selector cluster:
  - `selectViewerTargetGraphDocumentId(...)`
  - `selectSharedViewerComposition(...)`
  - `selectSharedViewerCompositionGraphDocumentIds(...)`
  - `selectIsGraphDocumentInSharedViewerComposition(...)`
  - `selectViewerTargetGraphDocument(...)`
  - `selectViewerTargetGraph(...)`
  - `selectViewerTargetGraphRuntime(...)`
  - `selectGraphPreviewPreparationByDocumentId(...)`
  - `selectGraphOutputSurfaceByDocumentId(...)`
  - `selectResolvedGraphReceiveReferencesByDocumentId(...)`
  - `selectViewerTargetGraphOutputSurface(...)`
  - `selectViewerTargetGraphPreviewPreparation(...)`
- keep the moved selectors in one focused selector file first, with `src/app/spaghetti/selectors/selectGraphViewerOutput.ts` as the likely destination unless the implementation pass proves a sharper name from the final ownership read
- preserve the same public read surface through `useSpaghettiStore.ts`

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectGraphViewerOutput.ts`
- `src/app/spaghetti/selectors/selectGraphViewerOutput.test.ts`
- `src/app/spaghetti/selectors/index.ts`
- `src/app/spaghetti/selectors/index.test.ts`
- focused selector tests plus the existing viewer-target and output-surface reads in `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule
- do not absorb accepted-result selectors from `Phase 5.2`
- do not absorb viewport/editor workspace selectors from `Phase 5.3`
- do not widen into runtime actions, overlay, or viewer implementation work

#### Verification Shape
- `npm.cmd run build` passes
- focused selector tests pass for viewer-target, shared-viewer, output-surface, resolved receive-reference, and preview-preparation reads
- the existing `useSpaghettiStore.test.ts` reads that cover viewer-target ownership, shared-viewer composition, graph output surfaces, and resolved receive references still pass
- output-surface, preview-preparation, and viewer-target resolutions still match the same public store contract

#### Done Shape
- the broader output-surface and viewer-target selector seam is out of the root file
- `Phase 5.2` becomes the next honest selector-lane follow-up

### Phase 5.1.2 Result

#### Landed Extraction

- added `src/app/spaghetti/selectors/selectGraphViewerOutput.ts` as the focused selector-owner module for the viewer-target, shared-viewer, output-surface, resolved receive-reference, and preview-preparation seam
- moved `selectViewerTargetGraphDocumentId(...)`, `selectSharedViewerComposition(...)`, `selectSharedViewerCompositionGraphDocumentIds(...)`, `selectIsGraphDocumentInSharedViewerComposition(...)`, `selectViewerTargetGraphDocument(...)`, `selectViewerTargetGraph(...)`, `selectViewerTargetGraphRuntime(...)`, `selectGraphPreviewPreparationByDocumentId(...)`, `selectGraphOutputSurfaceByDocumentId(...)`, `selectResolvedGraphReceiveReferencesByDocumentId(...)`, `selectViewerTargetGraphOutputSurface(...)`, and `selectViewerTargetGraphPreviewPreparation(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to import and re-export the moved selector seam so the public store surface stayed stable while the root file stopped owning the broader viewer/output selector band inline
- added `src/app/spaghetti/selectors/selectGraphViewerOutput.test.ts` and extended the selector barrel in `src/app/spaghetti/selectors/index.ts` plus `src/app/spaghetti/selectors/index.test.ts`
- left accepted-result selectors, viewport selectors, workspace selectors, and runtime action bodies in `src/app/spaghetti/store/useSpaghettiStore.ts` because they belong to `Phase 5.2` through later follow-up lanes

#### Verification Result

- `npm.cmd run build` passed
- `npx.cmd vitest run src/app/spaghetti/selectors/selectGraphViewerOutput.test.ts src/app/spaghetti/selectors/index.test.ts` passed
- `npx.cmd vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "viewer target follows focused viewport changes and viewport rebinding|shared viewer composition is explicitly authored by viewport actions and survives focus changes|removing the last shared viewer composition member clears the session|derives graph-owned output surfaces per graph and keeps them independent of viewer target changes|resolves linked receive references by explicit source graph and output ids|keeps linked receive resolution independent from graph labels, viewer target, and graph order|keeps missing linked source publications in an unresolved state and supports explicit removal"` passed

#### Phase 5.1.2 Close Read

- `Phase 5.1.2` is now honestly complete
- `Phase 5.1 - Active Graph Runtime Selector Extraction` is now honestly complete as a parent lane
- `Phase 5.2 - Accepted Result And Preview Selector Extraction` is now the next implementation target
- the root store no longer owns the first graph-document/runtime seam or the broader viewer/output selector seam inline

## [ ] `Gen 3 - Cleanup 2 / Phase 5.2` - `Accepted Result And Preview Selector Extraction`

### Phase 5.2 Summary

#### Purpose
- extract the accepted-result and preview selector cluster after the base graph-runtime selectors are isolated

#### Owns
- accepted build/result projection selectors
- preview-facing selector helpers derived from accepted runtime truth

#### Does Not Own
- graph document/runtime selectors already moved in `Phase 5.1.x`
- viewport/editor workspace selectors reserved for `Phase 5.3`
- runtime action seams

### Phase 5.2 Implementation Spec

#### Exact First Code Cut
- move only the accepted-result and preview selector cluster after `Phase 5.1.2`
- keep the public store read surface stable through re-exports or facade wiring

#### No-Widening Rule
- do not widen into workspace-facing selector reads or action bodies

#### Done Shape
- the accepted-result and preview selector concern leaves the root file without absorbing the later viewport/workspace lane

## [ ] `Gen 3 - Cleanup 2 / Phase 5.3` - `Editor Viewport And Workspace Selector Extraction`

### Phase 5.3 Summary

#### Purpose
- extract the editor-viewport and workspace-facing selector cluster last so the selector lane closes with the most UI-adjacent pure read-model surface

#### Owns
- editor viewport read-model helpers
- workspace-facing pure selector reads still derived from spaghetti-store truth

#### Does Not Own
- graph/runtime selectors already moved in `Phase 5.1.x`
- accepted-result selectors already moved in `Phase 5.2`
- action bodies or workspace-store ownership

### Phase 5.3 Implementation Spec

#### Exact First Code Cut
- move only the final viewport/editor workspace selector cluster after the earlier selector slices are proven
- keep the moved read-model helpers purely derived from store truth

#### No-Widening Rule
- do not turn workspace-facing selectors into a second owner of graph truth
- do not mix this pass with `Phase 6` facade cleanup

#### Done Shape
- the selector lane is honestly complete and `Phase 6` becomes the remaining facade/handoff closeout lane

## [ ] `Gen 3 - Cleanup 2 / Phase 6` - `Root Facade Shrink And UI Handoff`

### Phase 6 Summary

#### Purpose
- reduce `useSpaghettiStore.ts` to composed state wiring, stable exports, and a small amount of honest glue, then record the handoff to later UI/viewer cleanup

#### Owns
- import path normalization
- duplicate helper retirement left behind by earlier phases
- final keep-in-root decisions
- handoff notes for `ViewportOverlay.tsx` and `Viewer.ts`

#### Does Not Own
- a new broad viewer or overlay cleanup in the same pass
- caller-facing API redesign

### Phase 6 Implementation Spec

#### Exact First Code Cut
- remove any duplicate helper residue after the earlier moves
- normalize imports around the extracted owner modules
- keep only state composition, stable facade exports, and minimal shared glue in the root file

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- the extracted `graphRuntime`, `history`, `sketch`, and `selectors` modules
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen3-Index.md`

#### No-Widening Rule
- do not start `Gen 3 - Cleanup 3` or `Gen 3 - Cleanup 4` implementation from this pass

#### Verification Shape
- `useSpaghettiStore.ts` reads like a facade instead of a second graph workspace kernel
- the next family phase recommendation is explicit

#### Done Shape
- the lane is honestly complete and the later UI/viewer cleanup order is recorded

### Phase 6 Narrowing Decision

- do not dispatch the old broad `Phase 6` as one implementation pass
- `Phase 6.1 - Root Facade Shrink` is the final code-side cleanup slice
- `Phase 6.2 - Cleanup 2 Closeout And UI Handoff` is the final docs-side closeout slice

## [ ] `Gen 3 - Cleanup 2 / Phase 3.3` - `Part Feature History Adapter Extraction`

### Phase 3.3 Summary

#### Purpose
- move the remaining part-feature history adapter seam out first so the feature-stack restore path is isolated before the graph-node parameter and move adapters are touched

#### Owns
- `commitPartSketchFeatureHistoryCommand(...)`
- `commitPartFeatureParameterHistoryCommand(...)`
- `commitPartSketchFeatureStackHistoryCommand(...)`
- `findHistoryFeature(...)`
- `isHistorySupportedFeatureParameterTarget(...)`
- any tiny part-feature-only helpers needed to support the same feature-stack history seam

#### Does Not Own
- `commitGraphNodeParameterHistoryCommand(...)`
- `commitGraphNodeMoveHistoryCommand(...)`
- sketch-session runtime actions
- selector extraction

#### Current Live Read
- the remaining part-feature history seam is clustered around:
  - `commitPartSketchFeatureStackHistoryCommand(...)` at `useSpaghettiStore.ts:1855`
  - `commitPartSketchFeatureHistoryCommand(...)` at `useSpaghettiStore.ts:1906`
  - `commitPartFeatureParameterHistoryCommand(...)` at `useSpaghettiStore.ts:1982`
- these helpers all share part-node reads, feature-stack clone or equality helpers, and `restorePartNodeFeatureStackSnapshot(...)`, which makes them the cleanest remaining history move before the graph-node adapters

### Phase 3.3 Implementation Spec

#### Exact First Code Cut
- add a narrow part-feature adapter module under `src/app/spaghetti/store/history/*`
- move only the part-feature history adapter seam plus its tiny local feature helpers into that module
- inject the root-local graph reads, feature-stack helpers, history-entry ID source, and restore callbacks it still needs

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/history/*`
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`

#### No-Widening Rule
- do not move `commitGraphNodeParameterHistoryCommand(...)` in this pass
- do not move `commitGraphNodeMoveHistoryCommand(...)` in this pass
- do not widen into sketch-session runtime actions, selectors, or viewer/overlay files

#### Verification Shape
- `npm.cmd run build` passes
- focused graph-edit and sketch-history tests still pass
- the root file imports the moved part-feature adapter seam instead of owning it inline

#### Done Shape
- the part-feature-specific history adapter seam has an explicit owner module and `Phase 3.4` becomes the next honest history follow-up

### Phase 3.3 Result

#### Landed Extraction

- added `src/app/spaghetti/store/history/partFeatureHistoryCommitAdapter.ts` as the focused `history/*` owner module for the remaining part-feature history adapter seam
- moved `commitPartSketchFeatureStackHistoryCommand(...)`, `commitPartSketchFeatureHistoryCommand(...)`, `commitPartFeatureParameterHistoryCommand(...)`, `findHistoryFeature(...)`, and `isHistorySupportedFeatureParameterTarget(...)` into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved adapter seam through injected active-graph reads, feature-stack clone and equality helpers, part-node feature-stack readers and replacers, graph-history commit wiring, history-entry ID generation, and feature-stack restore callbacks
- left `commitGraphNodeParameterHistoryCommand(...)` and `commitGraphNodeMoveHistoryCommand(...)` in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 3.3` seam and now form the isolated `Phase 3.4` follow-up

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/graphEditHistoryStore.test.ts src/app/spaghetti/store/sketchEditHistoryStore.test.ts` passed

#### Phase 3.3 Close Read

- `Phase 3.3` is now honestly complete
- `Phase 3.4 - Graph Node History Adapter Extraction` is now the next implementation target
- sketch-session runtime action, selector, and viewer or overlay cleanup remain deliberately deferred and untouched by this pass

## [ ] `Gen 3 - Cleanup 2 / Phase 3.4` - `Graph Node History Adapter Extraction`

### Phase 3.4 Summary

#### Purpose
- move the remaining graph-node history adapter seam last so the generic node-parameter and move history wiring leaves the root before the sketch-session and selector lanes start

#### Owns
- `commitGraphNodeParameterHistoryCommand(...)`
- `commitGraphNodeMoveHistoryCommand(...)`
- any tiny graph-node position or history-target helpers that only support that same adapter seam

#### Does Not Own
- part-feature history adapters
- sketch-session runtime actions
- selector extraction

#### Current Live Read
- the remaining graph-node history seam is clustered around:
  - `commitGraphNodeParameterHistoryCommand(...)` at `useSpaghettiStore.ts:2029`
  - `commitGraphNodeMoveHistoryCommand(...)` at `useSpaghettiStore.ts:2059`
- these helpers share direct node param snapshots, graph-node position normalization, and restore callbacks but do not need the part-feature stack helpers once `Phase 3.3` is landed

### Phase 3.4 Implementation Spec

#### Exact First Code Cut
- add a narrow graph-node adapter module under `src/app/spaghetti/store/history/*`
- move only the graph-node parameter and move history adapter seam into that module
- inject the root-local graph reads, node-param clone and equality helpers, position normalization helpers, history-entry ID source, and restore callbacks it still needs

#### Likely Files
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/history/*`
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`

#### No-Widening Rule
- do not widen into sketch-session runtime actions, selectors, or viewer/overlay files
- do not reopen the already-landed geometry-sketch or part-feature history adapter seams in the same pass

#### Verification Shape
- `npm.cmd run build` passes
- focused graph-edit-history tests still pass
- the root file imports the moved graph-node adapter seam instead of owning it inline

#### Done Shape
- the graph-node history adapter seam has an explicit owner module and the history lane is honestly complete before `Phase 4.1` starts

### Phase 3.4 Result

#### Landed Extraction

- added `src/app/spaghetti/store/history/graphNodeHistoryCommitAdapter.ts` as the focused `history/*` owner module for the remaining graph-node history adapter seam
- moved `commitGraphNodeParameterHistoryCommand(...)`, `commitGraphNodeMoveHistoryCommand(...)`, and the tiny graph-node position normalization or equality helpers they depend on into that module
- rewired `src/app/spaghetti/store/useSpaghettiStore.ts` to bind the moved adapter seam through injected active-graph reads, node-param clone and equality helpers, node-width normalization, graph-history commit wiring, history-entry ID generation, and graph-node restore callbacks
- left the sketch-session runtime and selector surfaces in `src/app/spaghetti/store/useSpaghettiStore.ts` because they are outside the approved `Phase 3.4` seam and now form the next explicit `Phase 4.x` and `Phase 5.x` follow-up work

#### Verification Result

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed

#### Phase 3.4 Close Read

- `Phase 3.4` is now honestly complete
- the full history lane is now closed
- `Phase 4.1 - Sketch Plane Pick Command Session Extraction` is now the next implementation target

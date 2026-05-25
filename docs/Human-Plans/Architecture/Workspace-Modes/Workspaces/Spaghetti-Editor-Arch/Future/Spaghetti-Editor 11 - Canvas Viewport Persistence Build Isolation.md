# `Spaghetti-Editor 11` - `Canvas Viewport Persistence Build Isolation`

## Doc Header

### Doc History
2. 2026-05-25 14:39:45: Implemented and closed `Spaghetti-Editor 11 / Phase 1 - Canvas Viewport Persistence Build Isolation` with a document-only `setGraphViewport(...)` store action, SpaghettiCanvas routing, and focused build-isolation proof.
1. 2026-05-25 14:34:33: Created this phase from `Bug 25` after research showed Spaghetti canvas zoom/pan persistence can advance graph geometry revision and trigger worker/build churn.

### Purpose

Use this phase to make Spaghetti Editor canvas pan/zoom persistence a document/UI-only update, not a geometry edit.

The target behavior is:
- wheel zoom and canvas pan stay immediate
- `graph.ui.viewport` can still persist the canvas camera
- persistence does not advance `currentGraphRevision`
- persistence does not request worker builds
- accepted model-viewport geometry remains stable while the user navigates the graph canvas

### Scope

This phase covers:
- the Spaghetti canvas viewport persistence effect
- a dedicated document-only store action for `graph.ui.viewport`
- focused store and build-subscription regression tests

This phase does not cover:
- changing model-viewport camera behavior
- changing graph node position persistence
- changing worker build policy
- changing Auto/Draft/Final display semantics
- removing graph document dirty tracking for UI metadata

## Doc Body

### Current Grounding

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - stores the active canvas view locally
  - persists `view` into `graph.ui.viewport` after a debounce
  - currently uses `applyGraphPatch(...)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `applyGraphPatch(...)` defaults to geometry-scoped graph revision updates
  - `setNodePos(...)` and `setManyNodePos(...)` already use document-only scope for UI placement updates
- `src/app/store/builds/appStoreBuildSubscriptions.ts`
  - watches `currentGraphRevision` changes and can request builds
- `docs/Bugs/25_2026-05-25_spaghetti-canvas-zoom-triggers-worker-build.md`
  - tracks the user-facing bug and root-cause read

### Boundary Rules

- Treat canvas camera persistence as graph-document UI metadata.
- Keep `currentDocumentRevision` moving if the document changes.
- Keep `currentGraphRevision` reserved for geometry/build-affecting graph truth.
- Do not special-case build subscriptions to ignore this bug after the fact; prevent the false geometry revision at the source.

## Wishlist Organization

### High Level Goals

- [x] `Spaghetti-CanvasViewport-HLG-1. Preserve Spaghetti canvas pan/zoom persistence.`
- [x] `Spaghetti-CanvasViewport-HLG-2. Classify graph canvas viewport persistence as document-only.`
- [x] `Spaghetti-CanvasViewport-HLG-3. Prevent worker/build requests from zoom/pan-only graph canvas navigation.`

### `Spaghetti-Editor 11 / Phase 1`

- [x] Add a dedicated store action for graph canvas viewport persistence.
- [x] Route `SpaghettiCanvas` debounced `graph.ui.viewport` writes through that action.
- [x] Use document-only revision scope for the viewport metadata write.
- [x] Add store coverage proving `currentDocumentRevision` advances while `currentGraphRevision` does not.
- [x] Add app/build-subscription coverage proving zoom/pan persistence does not call `buildDispatcher.requestGraphBuild`.
- [x] `HLG 1. Preserve Spaghetti canvas pan/zoom persistence.`
- [x] `HLG 2. Classify graph canvas viewport persistence as document-only.`
- [x] `HLG 3. Prevent worker/build requests from zoom/pan-only graph canvas navigation.`

## [x] `Spaghetti-Editor 11 / Phase 1` - `Canvas Viewport Persistence Build Isolation`

### Phase 1 Summary

#### Purpose

Fix `Bug 25` by separating graph-canvas camera persistence from geometry revision/build invalidation.

#### Owns

- `graph.ui.viewport` persistence ownership
- document-only revision routing for canvas camera metadata
- regression tests around worker build isolation

#### Does Not Own

- worker scheduling policy changes
- model-viewport camera persistence
- node-position persistence beyond using it as precedent
- broader graph document dirty-state policy

#### Implementation Read

The clean fix is to add a narrow store action, for example `setGraphViewport(...)`, that updates `graph.ui.viewport` via the existing `withUpdatedGraphDocumentState(..., 'document-only')` path. `SpaghettiCanvas` should call that action from its debounced persistence effect instead of generic `applyGraphPatch(...)`.

#### Implementation Result

`setGraphViewport(...)` now owns graph-canvas viewport persistence and writes `graph.ui.viewport` through document-only revision scope. `SpaghettiCanvas` calls that action from its debounced view persistence effect. Store and app-level tests prove canvas viewport metadata behaves like UI document metadata instead of geometry truth.

#### Verification

- `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts -t "graph viewport edits|node-position edits"`
- `npm.cmd test -- src/app/store/useAppStore.test.ts -t "keeps UI-only node-position edits"`
- `npm.cmd run build`

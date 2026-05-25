# 25 - Spaghetti Canvas Zoom Triggers Worker Build

## Doc History
2. 2026-05-25 14:39:45: Marked this bug fixed after `Spaghetti-Editor 11 / Phase 1` added document-only graph viewport persistence through `setGraphViewport(...)` and regression coverage proving viewport metadata edits do not advance geometry revision or request worker builds.
1. 2026-05-25 14:34:33: Created this bug report after research showed Spaghetti Editor zoom/pan persistence writes `graph.ui.viewport` through the generic geometry-scoped graph patch path, advancing `currentGraphRevision` and allowing build subscriptions to treat canvas camera movement as geometry work.

## Status

- `[fixed]`

## Summary

Zooming or panning the Spaghetti Editor canvas should only change the editor camera. It should not reload graph objects, invalidate accepted geometry, or force the worker to rebuild.

Current research shows the canvas view is local while the user is interacting, but after a debounce it is persisted into `graph.ui.viewport` through the same broad graph patch path used for geometry edits. That path advances geometry revision state, so worker/build subscriptions can interpret the editor zoom as a real graph change.

## User-Facing Symptom

- User zooms in or out in the Spaghetti Editor.
- The editor should only scale/pan the graph canvas.
- Instead, the app can behave as if graph truth changed.
- In Auto/Live/Release build modes, that can trigger worker build scheduling or visible object reload churn.

## Current Strong Read

The problem is not the wheel zoom math itself.

The bug is the persistence path:

- `SpaghettiCanvas` stores wheel zoom in local React `view`.
- A debounced effect persists that view to `graph.ui.viewport`.
- That effect calls `applyGraphPatch(...)`.
- `applyGraphPatch(...)` defaults to geometry revision scope.
- `withUpdatedGraphDocumentState(...)` increments `currentGraphRevision` for geometry-scoped edits.
- build subscriptions watch `currentGraphRevision` and request graph builds when it changes.

Plain English: the canvas camera is being stored in graph UI metadata, but the store is classifying that metadata write as geometry.

## Likely Ownership

- Spaghetti graph-canvas viewport persistence
- graph document revision scoping
- build subscription graph-revision triggers
- tests proving UI-only graph metadata changes do not request worker builds

## Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/store/builds/appStoreBuildSubscriptions.ts`

## Related Phase

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Spaghetti-Editor 11 - Canvas Viewport Persistence Build Isolation.md`

## Fix Direction

Do not stop persisting the canvas viewport entirely. Users still benefit from reopening a graph with the same canvas pan/zoom.

Instead:

- add a dedicated store action for graph canvas viewport persistence
- write `graph.ui.viewport` through document-only revision scope
- keep local wheel zoom immediate and responsive
- do not increment `currentGraphRevision`
- do not trigger worker builds from zoom/pan-only changes

The existing `setNodePos(...)` and `setManyNodePos(...)` paths are the closest precedent: they update graph UI placement, increment document revision, and intentionally leave geometry revision unchanged.

## Acceptance Read

This bug is fixed when:

- zooming the Spaghetti canvas updates local view immediately
- persisted `graph.ui.viewport` survives graph reopen/remount
- zoom/pan persistence increments document revision, if needed
- zoom/pan persistence does not increment `currentGraphRevision`
- zoom/pan persistence does not call `buildDispatcher.requestGraphBuild`
- accepted model-viewport objects are not reloaded just because the Spaghetti graph canvas camera changed

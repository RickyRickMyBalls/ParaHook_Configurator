# Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer

## Doc Header

### Doc History
2. 2026-04-22 12:42:43: Completed this staged command-buffer phase after Sketch Draw completed create/delete commands began staging inside the active draw session, `Ctrl+Z`/`Ctrl+Y` began routing to staged undo/redo during draw mode, and `closeGeometrySketchSession()` began creating one canonical commit entry for the accepted staged delta.
1. 2026-04-22 12:12:20: Created this Future plan doc after user review clarified completed Sketch Draw commands must be undoable/redoable inside the active Sketch Draw session before the final sketch commit reaches canonical app history.

### Purpose

This doc plans the second Generation 4 Edit History family phase.

Use it to implement a Sketch Draw staged command buffer so completed in-session commands can be undone and redone before the user commits the final sketch change.

## Doc Body

### Vision

Sketch Draw should feel like a CAD sketch session with its own pending command stack.

The user should be able to:
- enter Sketch Draw
- draw five completed rectangles
- press `Ctrl+Z` twice while still inside Sketch Draw
- see only the two newest staged rectangles removed
- commit Sketch Draw
- produce one accepted sketch change containing the remaining three rectangles

The important distinction is staged authored sketch state versus canonical app history:
- completed draw/delete commands inside the active Sketch Draw session are authored sketch commands, but they are still pending session edits
- app-wide canonical edit history should receive the accepted session delta when the user commits Sketch Draw
- local draft-point edits, hover, snap preview, selection-only state, prompt text, and camera movement remain outside both canonical app history and staged command history unless they complete a real staged sketch command

### Current Gap

`Edit-History-Gen4-1` proved completed Sketch Draw draw/delete seams can become meaningful undo entries, but it does not fully match the desired workflow.

The remaining gap is that active Sketch Draw needs a local staged command buffer before the final commit boundary. The user should not need to commit Sketch Draw before undoing the second rectangle they just drew.

### Ownership Direction

Use a dedicated Sketch Draw session command owner, not a broad CAD command bus.

Recommended shape:
- store a staged command stack on or beside `geometrySketchSession`
- store enough before/after sketch-node or component delta data to undo/redo staged completed commands
- keep the visible graph or sketch feature in sync with the currently accepted staged stack while the session is active
- do not write app-wide canonical `editHistoryStore` entries for every staged command
- on final Sketch Draw commit, write one canonical app history entry for the accepted staged delta
- on cancel, discard staged commands and restore the pre-session sketch state

### Input Direction

While `geometrySketchSession.mode === 'draw'`:
- `Ctrl+Z` should first undo the latest staged completed Sketch Draw command when one exists
- `Ctrl+Y` should first redo the latest staged undone Sketch Draw command when one exists
- textual Sketch Draw `undo` can keep backing up in-progress draft points when a command is active
- if no staged completed command exists, `Ctrl+Z` should not accidentally trigger viewer zoom behavior
- fallback to canonical app history should only happen when it is clearly safe and does not steal active Sketch Draw command ownership

### Commit Direction

When the user commits Sketch Draw:
- compare the pre-session authored sketch state to the accepted staged sketch state
- if changed, commit one canonical app history entry such as `Commit sketch draw changes`
- undoing that canonical entry after session commit should restore the pre-session sketch
- redoing that canonical entry should restore the accepted staged sketch
- if the staged result equals the pre-session state, commit no canonical entry and preserve redo where appropriate

### Non-Goals

- Do not build a broad CAD command bus.
- Do not add persistence, checkpoints, branching, collaboration, or history-reader nesting in this phase.
- Do not make hover, selection-only, snap preview, camera movement, prompt text, active tool choice, or draft points canonical history.
- Do not create one app-wide canonical entry per uncommitted staged command.
- Do not change feature-stack add/remove/reorder outside Sketch Draw.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen4-HLG-2` - Let users undo and redo completed Sketch Draw commands inside the active Sketch Draw session before committing the final staged sketch change into canonical edit history.

### `Edit-History-Gen4-2 Phase 1`

- [x] `Edit-History-Gen4-HLG-2`
- [x] `Edit-History-Gen4-CLG-5` - Add a Sketch Draw session command buffer that records completed line, rectangle, circle, polyline, and delete-selected commands before final sketch commit.
- [x] `Edit-History-Gen4-CLG-8` - Preserve draft-point undo, hover, selection-only state, cancel/back/Escape, prompt text, camera/view state, and no-op staged actions as local/session-only behavior.

### `Edit-History-Gen4-2 Phase 2`

- [x] `Edit-History-Gen4-HLG-2`
- [x] `Edit-History-Gen4-CLG-6` - Route `Ctrl+Z` and `Ctrl+Y` inside active Sketch Draw to staged command undo/redo before falling back to canonical app history.
- [x] `Edit-History-Gen4-CLG-8` - Preserve draft-point undo, hover, selection-only state, cancel/back/Escape, prompt text, camera/view state, and no-op staged actions as local/session-only behavior.

### `Edit-History-Gen4-2 Phase 3`

- [x] `Edit-History-Gen4-HLG-2`
- [x] `Edit-History-Gen4-CLG-7` - Commit the accepted staged Sketch Draw delta into canonical app history only at the explicit Sketch Draw commit boundary.
- [x] `Edit-History-Gen4-CLG-8` - Preserve draft-point undo, hover, selection-only state, cancel/back/Escape, prompt text, camera/view state, and no-op staged actions as local/session-only behavior.

## [x] `Edit-History-Gen4-2 / Phase 1` - `Staged Sketch Draw Command Stack`

### Phase 1 Summary

Add the in-session staged command stack and use it for completed Sketch Draw command state.

This phase should create the data model and command mutation path that lets completed line, rectangle, circle, polyline, and delete-selected commands become staged undoable commands while the Sketch Draw session remains open.

### Phase 1 Implementation Spec

Research first:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `GeometrySketchSession`
  - `startGeometrySketchSession(...)`
  - `confirmGeometrySketchDrawPoint(...)`
  - `confirmGeometrySketchDrawRadius(...)`
  - `finishGeometrySketchDrawDraft(...)`
  - `deleteGeometrySketchSelectedComponents(...)`
  - `cancelGeometrySketchDrawDraft(...)`
  - `closeGeometrySketchSession(...)`
- `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`
- `src/app/inputRouting.ts`
- `src/app/useViewerCameraShortcuts.ts`

Implementation direction:
- capture a pre-session sketch baseline when entering Sketch Draw
- add staged undo/redo stack state for completed Sketch Draw commands
- route completed create/delete operations into the staged stack while updating the visible sketch state
- invalidate staged redo when a new staged command is completed after staged undo
- keep no-op completed commands out of the staged stack
- keep draft point undo and cancel/back/Escape local and history-free
- avoid committing canonical app history entries during this phase

Expected tests:
- drawing five rectangles creates five staged command entries while Sketch Draw stays active
- staged undo twice removes only the two newest rectangles and leaves the first three visible
- staged redo restores the undone rectangles in order
- drawing a new rectangle after staged undo invalidates staged redo
- draft-point undo before command completion does not create or consume staged entries
- hover/snap preview, selection-only state, and no-op delete do not create staged entries

Stop conditions:
- stop if the implementation requires a broad CAD command bus
- stop if active-session staged restore would clobber unrelated graph state outside the active sketch node
- stop if there is no reliable pre-session baseline to cancel or commit against

## [x] `Edit-History-Gen4-2 / Phase 2` - `Active Sketch Draw Undo Redo Routing`

### Phase 2 Summary

Route `Ctrl+Z` and `Ctrl+Y` while Sketch Draw is active to the staged command stack before canonical app history or viewer shortcuts.

This phase should make keyboard ownership match the user's active modeling context.

### Phase 2 Implementation Spec

Research first:
- `src/app/inputRouting.ts`
- `src/app/useViewerCameraShortcuts.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`
- `runGeometrySketchDrawCommand('undo')`

Implementation direction:
- add an explicit route owner or route branch for available staged Sketch Draw undo/redo
- make active Sketch Draw consume `Ctrl+Z` and `Ctrl+Y` when staged command undo/redo is available
- keep textual Sketch Draw `undo` as draft-point undo for active incomplete commands
- prevent `Ctrl+Z` from falling through to viewer zoom behavior while Sketch Draw owns command focus
- decide and document fallback behavior when no staged command exists

Expected tests:
- while Sketch Draw is active and staged entries exist, `Ctrl+Z` undoes a staged rectangle instead of app-wide canonical history
- while Sketch Draw is active and staged redo exists, `Ctrl+Y` redoes the staged rectangle
- `Ctrl+Z` does not trigger viewer Zoom Object or Zoom All behavior while Sketch Draw owns staged undo
- textual `undo` still removes only draft points for an active incomplete command
- editable targets still defer native undo/redo

Stop conditions:
- stop if routing requires rewriting all global shortcut ownership
- stop if editable target native undo semantics would be broken
- stop if fallback to canonical app history during active Sketch Draw is ambiguous enough to need a separate decision

## [x] `Edit-History-Gen4-2 / Phase 3` - `Final Sketch Commit Canonical Entry`

### Phase 3 Summary

Commit the accepted staged Sketch Draw delta into canonical app edit history at the final Sketch Draw commit boundary.

This phase should make the staged command stack visible to the app as one accepted authored sketch change after the user commits the sketch.

### Phase 3 Implementation Spec

Research first:
- Sketch Draw commit/close semantics in `useSpaghettiStore.ts`
- current canonical sketch/geometry history helpers near `commitGeometrySketchFeatureHistoryCommand(...)`
- current tests around close, cancel, no-op, and graph runtime exclusion

Implementation direction:
- compare the pre-session sketch baseline with the accepted staged sketch state on final commit
- commit one canonical app entry only when the accepted staged result changed authored sketch state
- label the canonical entry deterministically, such as `Commit sketch draw changes`
- undoing the canonical entry after commit restores the pre-session sketch state
- redoing the canonical entry restores the accepted staged sketch state
- canceling Sketch Draw discards staged commands and restores the pre-session sketch without canonical history
- no-op final commit creates no canonical entry

Expected tests:
- draw five rectangles, staged undo two, commit Sketch Draw, then canonical undo removes the remaining three committed rectangles
- canonical redo restores the remaining three committed rectangles
- cancel after staged commands restores the pre-session sketch and creates no canonical entry
- no-op staged result creates no canonical entry
- canonical redo is not invalidated by draft-only actions or no-op cancel

Stop conditions:
- stop if existing Sketch Draw close semantics do not distinguish commit from cancel cleanly
- stop if canonical commit needs nested reader UI or persisted staged command details
- stop if final restore would need whole-session snapshots rather than authored sketch state only

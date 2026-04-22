# Edit-History-Gen4-1 - Sketch Draw Authored Command Undo

## Doc Header

### Doc History
2. 2026-04-22 11:37:27: Completed this phase after Sketch Draw line, rectangle, circle, polyline, and delete-selected command completions began committing canonical edit-history entries with focused undo/redo, redo invalidation, and local draft/session exclusion proof.
1. 2026-04-22 11:10:11: Created this Future plan doc for making completed Sketch Draw lines, shapes, polylines, and delete commands undoable/redoable as individual authored sketch commands while keeping local draft/session state out of canonical history.

### Purpose

This doc plans the first Generation 4 Edit History family phase.

Use it to implement Sketch Draw authored command undo without reopening broad CAD command architecture, local draft undo, or advanced history productization.

## Doc Body

## Vision

Sketch Draw should feel like a real modeling surface.

When a user draws a line, rectangle, circle, or polyline inside Sketch Draw, that completed command mutates authored sketch geometry. The user should be able to undo and redo those completed commands one by one.

The key boundary is command completion:
- draft point changes before a command completes are local session state
- hover, snap preview, selection-only state, active tool choice, prompt text, and camera/view state are local/session state
- the finished command that adds or removes durable sketch components is authored state and should become canonical edit history

This phase should replace the current no-entry behavior for completed Sketch Draw mutations while preserving the exclusion proof for local draft/session behavior.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen4-HLG-1` - Make completed Sketch Draw lines, shapes, polylines, and delete commands undoable/redoable as individual authored sketch commands while keeping hover, selection, and in-progress draft points local.

### `Edit-History-Gen4-1 Phase 1`

- [x] `Edit-History-Gen4-HLG-1`
- [x] `Edit-History-Gen4-CLG-1` - Route completed Sketch Draw line, rectangle, circle, and polyline commits through canonical edit-history entries after durable sketch geometry changes.
- [x] `Edit-History-Gen4-CLG-3` - Preserve local draw-session behavior for draft-point undo, hover, selection-only state, snap preview, active tool choice, prompt text, Escape/back/cancel, and camera/view changes.

### `Edit-History-Gen4-1 Phase 2`

- [x] `Edit-History-Gen4-HLG-1`
- [x] `Edit-History-Gen4-CLG-2` - Route Sketch Draw delete-selected commits through canonical edit-history entries after durable sketch components are removed.
- [x] `Edit-History-Gen4-CLG-3` - Preserve local draw-session behavior for selection-only state and no-op delete attempts.

### `Edit-History-Gen4-1 Phase 3`

- [x] `Edit-History-Gen4-HLG-1`
- [x] `Edit-History-Gen4-CLG-4` - Prove `Ctrl+Z` and `Ctrl+Y` walk individual completed Sketch Draw commands without creating entries for in-progress draft actions.
- [x] `Edit-History-Gen4-CLG-3` - Preserve local draft/session exclusions while canonical history owns completed authored commands.

## [x] `Edit-History-Gen4-1 / Phase 1` - `Completed Draw Command Entries`

### Phase 1 Summary

Route completed Sketch Draw create commands into canonical edit history.

This phase should cover the completed command boundaries that add durable sketch components:
- two-point line completion
- rectangle completion
- circle completion by second point or radius
- polyline completion that creates a grouped run of line components

### Phase 1 Implementation Spec

Research first:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `confirmGeometrySketchDrawPoint(...)`
  - `confirmGeometrySketchDrawRadius(...)`
  - `finishGeometrySketchDrawDraft(...)`
  - `updateGeometrySketchNode(...)`
  - `recomputeSketchFeature(...)`
- existing history helpers near `commitPartSketchFeatureWithHistory(...)`
- existing exclusion test in `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`
- existing sketch edit-history regression coverage in `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`

Implementation direction:
- capture a normalized before/after graph or sketch-feature snapshot around each completed draw command that mutates durable geometry
- commit one canonical entry per completed user command
- use labels that read like user actions, such as `Draw sketch line`, `Draw sketch rectangle`, `Draw sketch circle`, and `Draw sketch polyline`
- set metadata so future readers can identify the source as Sketch Draw and the target as the affected sketch node/components
- keep in-progress point capture and `undoGeometrySketchDrawDraftPoint()` local and history-free
- preserve no-entry behavior for unchanged/tiny/no-op completions

Expected tests:
- completed line creates exactly one undo entry and undo/redo removes/restores that line
- completed rectangle creates exactly one undo entry and undo/redo removes/restores that rectangle
- completed circle by point and by radius create one undo entry each
- completed polyline creates one undo entry for the whole polyline command, not one entry per segment
- draft point undo before completion creates no canonical entry
- hover/snap preview creates no canonical entry
- canceled/back/Escape draft creates no canonical entry and does not invalidate redo

Stop conditions:
- stop if the implementation requires a broad CAD command bus
- stop if undo/redo cannot restore only the authored Sketch Draw change without clobbering unrelated graph state
- stop if `Ctrl+Z` routing needs a broad input-routing redesign rather than using the existing canonical owner path

## [x] `Edit-History-Gen4-1 / Phase 2` - `Delete Selected Draw Command Entries`

### Phase 2 Summary

Route Sketch Draw delete-selected commands into canonical edit history after selected durable sketch components are removed.

This phase should cover `deleteGeometrySketchSelectedComponents(...)` while preserving selection-only behavior as local session state.

### Phase 2 Implementation Spec

Research first:
- `deleteGeometrySketchSelectedComponents(...)`
- `setGeometrySketchSelectedComponents(...)`
- `setGeometrySketchHoveredComponent(...)`
- graph-pruning behavior for deleted component ids
- existing no-entry delete proof in `sketchDraftRuntimeExclusion.test.ts`

Implementation direction:
- capture before/after authored sketch state only when delete actually removes components
- commit one canonical entry per delete command
- label the entry `Delete sketch component` or `Delete sketch components` depending on count if that distinction is easy and deterministic
- restore removed components and selection pruning through the existing graph document path
- keep selection changes, hover changes, selection-window draft changes, and no-op delete attempts history-free

Expected tests:
- deleting one selected line creates one undoable entry
- deleting multiple selected components creates one undoable entry
- undo restores the removed components without duplicating unrelated components
- redo removes the same components again
- no selection, missing selection ids, hover-only state, and selection-window state create no entries

Stop conditions:
- stop if delete restoration needs whole-session restore or broad sketch-editor state snapshots
- stop if restoring deleted components would resurrect unrelated draft/session state

## [x] `Edit-History-Gen4-1 / Phase 3` - `Sketch Draw Undo Redo UX Proof`

### Phase 3 Summary

Prove the user-facing undo/redo shape after completed Sketch Draw command entries exist.

This phase should verify that `Ctrl+Z` / `Ctrl+Y` walk individual completed draw commands while the local `undo` draw command still only backs up in-progress draft points.

### Phase 3 Implementation Spec

Research first:
- `src/app/inputRouting.ts`
- `src/app/useViewerCameraShortcuts.ts`
- `runGeometrySketchDrawCommand('undo')`
- current `sketch-draw` keyboard owner behavior for Escape/Delete

Implementation direction:
- keep the textual/console `undo` command inside Sketch Draw as draft-point undo while a command is active
- keep global `Ctrl+Z` / `Ctrl+Y` routed through canonical edit history when entries are available
- add focused proof that completed draw commands are walked individually in stack order
- add focused proof that in-progress draft point undo remains local and does not create or consume canonical entries

Expected tests:
- draw line, draw rectangle, draw circle, then canonical undo walks circle -> rectangle -> line
- canonical redo walks line -> rectangle -> circle
- after undoing a completed command, starting a new completed Sketch Draw command invalidates redo through the canonical owner
- `runGeometrySketchDrawCommand('undo')` during an active draft removes only the last draft point and does not touch canonical undo entries
- Escape/back/cancel still clear local draft without canonical entries

Stop conditions:
- stop if the desired keyboard behavior conflicts with existing text-input/native undo ownership
- stop if the fix requires changing command recall or transcript ownership
- stop if redo preservation across local draft actions is ambiguous enough to need a separate transaction design phase

# Edit-History-Gen5-1 - Durable CAD Local History Batches

## Doc Header

### Doc History
2. 2026-04-22 18:29:20: Updated this Future plan after implementing Gen5 locally with target-scoped Sketch Draw local-history batches, canonical commit before/after batch snapshots, reopen hydration, same-tool geometry-first local undo/redo, focused store verification, and a no-extraction shared-owner closeout.
1. 2026-04-22 17:56:30: Created this Future plan doc after user review clarified CAD sessions such as Sketch Draw and Viewer Transform need durable local undo/redo command batches that survive final commit and later session re-entry while remaining nested under canonical app history.

### Purpose

This doc plans the first Generation 5 Edit History family phase.

Use it to implement durable CAD-local command history batches without replacing the canonical `editHistoryStore` app-wide undo/redo owner.

## Doc Body

## Vision

CAD sessions should remember their own authored command steps.

The user should be able to:
- enter Sketch Draw
- make five rectangles
- undo and redo individual rectangles during the session
- commit and leave Sketch Draw
- later reopen Sketch Draw for the same authored sketch
- still undo the fifth, fourth, third, second, and first rectangle locally
- redo those rectangles locally
- still use canonical app undo/redo for the larger accepted session boundary

Viewer Transform already points at the intended product shape:
- transform commits create canonical app-history entries
- transform targets also store local transform history rows
- canonical undo/redo restores both target state and the local transform history reader

Sketch Draw should move toward the same nested-history shape:
- local Sketch Draw commands are durable target-local history
- canonical app entries snapshot and restore the local batch
- `Ctrl+Z` has one routing policy but can delegate to the active local CAD owner before falling back to canonical app history

### Current Gap

Gen4 added an active Sketch Draw command stack, but the stack is session-local.

Current gap:
- local Sketch Draw staged geometry and tool-selection commands live in `geometrySketchSession`
- final Sketch Draw commit can produce one canonical app-history entry
- after closing and later reopening Sketch Draw, the local command stack is gone
- therefore the user cannot walk the five accepted rectangles individually after reopening the sketch

Viewer Transform already avoids that class of gap by storing local history per target:
- `transformHistoryByReferenceId`
- `transformHistoryByObjectId`
- canonical snapshots that restore local history rows with target state

### Ownership Direction

Use durable nested CAD-local history batches.

Recommended shape:
- `editHistoryStore` remains the only canonical app-wide undo/redo owner
- each CAD mode can expose a local history owner for active command-session undo/redo
- local CAD history batches are stored inside or beside the authored CAD target
- canonical entries snapshot before/after target state and before/after local history batch
- reopening the CAD session hydrates the local owner from the stored batch
- `Ctrl+Z` and `Ctrl+Y` route through one input policy that asks the active local CAD owner first, then canonical app history

### Non-Goals

- Do not create a second app-wide undo owner.
- Do not turn command transcript or command recall into authored undo.
- Do not add checkpoints, branching, collaboration, or Build Path comparison in this phase.
- Do not persist runtime preview geometry, cache state, provider state, build progress, hover, focus, or camera movement as local CAD command history.
- Do not require every future CAD mode to adopt the batch contract before Sketch Draw proves it.
- Do not rewrite Viewer Transform local history unless a small adapter is needed to document the shared shape.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen5-HLG-1` - Store durable CAD-local undo/redo command batches inside or beside authored CAD targets so Sketch Draw, Viewer Transform, and later CAD sessions can restore and replay local command histories after a committed session is reopened.

### `Edit-History-Gen5-1 Phase 1`

- [x] `Edit-History-Gen5-HLG-1`
- [x] `Edit-History-Gen5-CLG-1` - Define the shared durable CAD-local history batch contract, using Viewer Transform local history as the reference pattern and keeping `editHistoryStore` as the only canonical app-wide owner.
- [x] `Edit-History-Gen5-CLG-5` - Preserve native text undo, command recall exclusion, runtime/cache exclusion, redo invalidation rules, and canonical history reader alignment while adding durable local batches.

### `Edit-History-Gen5-1 Phase 2`

- [x] `Edit-History-Gen5-HLG-1`
- [x] `Edit-History-Gen5-CLG-2` - Route Sketch Draw completed geometry and tool-selection commands into a durable sketch-local batch instead of discarding the live session stack at final commit.

### `Edit-History-Gen5-1 Phase 3`

- [x] `Edit-History-Gen5-HLG-1`
- [x] `Edit-History-Gen5-CLG-3` - Make canonical Sketch Draw commit entries snapshot and restore both sketch authored state and the sketch-local history batch.

### `Edit-History-Gen5-1 Phase 4`

- [x] `Edit-History-Gen5-HLG-1`
- [x] `Edit-History-Gen5-CLG-4` - Hydrate local CAD histories when reopening an accepted CAD session or target, so local `Ctrl+Z` / `Ctrl+Y` can walk previous accepted commands before falling back to canonical app history.
- [x] `Edit-History-Gen5-CLG-5` - Preserve native text undo, command recall exclusion, runtime/cache exclusion, redo invalidation rules, and canonical history reader alignment while adding durable local batches.

### `Edit-History-Gen5-1 Phase 5`

- [x] `Edit-History-Gen5-HLG-1`
- [x] `Edit-History-Gen5-CLG-1` - Define the shared durable CAD-local history batch contract, using Viewer Transform local history as the reference pattern and keeping `editHistoryStore` as the only canonical app-wide owner.
- [x] `Edit-History-Gen5-CLG-5` - Preserve native text undo, command recall exclusion, runtime/cache exclusion, redo invalidation rules, and canonical history reader alignment while adding durable local batches.

## [x] `Edit-History-Gen5-1 / Phase 1` - `Batch Contract And Existing Transform Reference`

### Phase 1 Summary

Define the durable CAD-local history batch contract and prove the existing Viewer Transform behavior is the reference pattern.

This phase should be mostly contract and test/readiness work. It should not rewrite Sketch Draw yet.

### Phase 1 Implementation Spec

Research first:
- `src/app/store/editHistoryStore.ts`
- `src/app/store/useAppStore.ts`
  - `transformHistoryByReferenceId`
  - `transformHistoryByObjectId`
  - `selectActiveViewerTransformHistoryEntries(...)`
  - `commitActiveViewerTransformEntry(...)`
  - transform snapshot capture and restore helpers
- `src/app/store/viewerTransformEditHistoryStore.test.ts`
- `src/app/inputRouting.ts`

Implementation direction:
- define the shared language for durable CAD-local history batches
- document or type the minimum fields a batch needs:
  - owner id
  - target id
  - ordered local commands
  - active cursor or undo/redo split
  - before/after target snapshots where needed
  - labels and source metadata for reader surfaces
- prove Viewer Transform already stores and restores target-local rows through canonical undo/redo
- identify the smallest Sketch Draw target-storage seam for durable batches
- avoid changing runtime Sketch Draw behavior in this phase unless a tiny type/readiness helper is needed

Expected tests or proof:
- Viewer Transform local history still restores with canonical undo/redo
- local transform history row controls stay outside canonical app history
- readiness proof names the Sketch Draw batch storage seam and exclusions

Stop conditions:
- stop if the contract starts requiring a full command bus before Sketch Draw can use it
- stop if Viewer Transform would need a rewrite instead of acting as a reference pattern
- stop if batch persistence cannot be attached to a stable authored Sketch Draw target

### Phase 1 Completion Notes

- Used Viewer Transform's target-local history rows and canonical snapshot restore pattern as the contract reference.
- Kept `editHistoryStore` as the only app-wide undo/redo owner.
- Selected target-adjacent Sketch Draw local history keyed by graph document and sketch node as the first storage seam, avoiding a graph schema migration.

## [x] `Edit-History-Gen5-1 / Phase 2` - `Sketch Draw Durable Batch Storage`

### Phase 2 Summary

Persist Sketch Draw local commands as a durable sketch-local batch instead of keeping them only inside `geometrySketchSession`.

This phase should make the accepted Sketch Draw target carry the local command list, but it does not need to solve every keyboard dispatch edge yet.

### Phase 2 Implementation Spec

Research first:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `GeometrySketchSession`
  - `sessionUndoCommands`
  - `sessionRedoCommands`
  - `stagedUndoCommands`
  - `stagedRedoCommands`
  - `closeGeometrySketchSession(...)`
  - `startGeometrySketchSession(...)`
  - geometry sketch node params and feature shape
- `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`

Implementation direction:
- create a durable sketch-local history representation for completed geometry and tool-selection commands
- store the accepted local batch with the sketch target or target-adjacent authored state
- keep draft points, hover, selection-only state, prompt text, snap previews, and camera state out
- keep the live `geometrySketchSession` stack as a runtime adapter over the durable batch where practical
- make final Sketch Draw commit preserve the accepted batch instead of discarding it

Expected tests:
- draw five rectangles, commit Sketch Draw, and prove the stored sketch-local batch contains five accepted rectangle commands
- tool-selection commands can be included or explicitly filtered according to the Phase 1 contract
- draft-point undo and hover/selection-only changes do not appear in the durable batch

Stop conditions:
- stop if sketch-local batch storage requires a graph schema migration that is too broad for this phase
- stop if local command serialization cannot safely describe the accepted sketch mutations
- stop if command transcript or command recall starts being treated as authored local history

### Phase 2 Completion Notes

- Added `geometrySketchLocalHistoryByTargetId` as the durable target-adjacent Sketch Draw batch map.
- Stored accepted Sketch Draw session commands on close while clearing local redo at the accepted close boundary.
- Preserved draft points, hover/runtime state, prompt text, command recall, and build/cache state exclusions.

## [x] `Edit-History-Gen5-1 / Phase 3` - `Canonical Sketch Commit Batch Snapshots`

### Phase 3 Summary

Make canonical Sketch Draw commit entries restore both authored sketch state and the durable sketch-local batch.

This phase should make app-level undo/redo honest around local history readers.

### Phase 3 Implementation Spec

Research first:
- current Sketch Draw final commit path in `useSpaghettiStore.ts`
- graph node parameter snapshot helpers
- Viewer Transform snapshot helpers in `useAppStore.ts`
- `editHistoryStore.commitEntry(...)` usage for graph/sketch commits

Implementation direction:
- capture before and after snapshots for:
  - authored sketch geometry/state
  - durable sketch-local history batch
- update canonical Sketch Draw commit undo/redo so it restores both
- preserve redo invalidation rules in `editHistoryStore`
- keep one canonical app entry for the accepted Sketch Draw session boundary
- do not create one canonical entry per local Sketch Draw command

Expected tests:
- draw five rectangles and commit Sketch Draw; canonical undo removes the accepted sketch delta and restores the pre-session local batch
- canonical redo restores the accepted sketch delta and the five-command local batch
- unrelated graph/sketch state survives canonical undo/redo
- canonical history reader labels remain stable

Stop conditions:
- stop if restoring the local batch can desynchronize from authored sketch geometry
- stop if final Sketch Draw commit semantics become ambiguous
- stop if app-level undo starts consuming local commands one-by-one

### Phase 3 Completion Notes

- Extended the Sketch Draw canonical commit path to snapshot before/after local history batches alongside before/after sketch params.
- Canonical undo restores the pre-session sketch and pre-session local batch; canonical redo restores the accepted sketch and accepted local batch.
- Kept one canonical app entry for the accepted Sketch Draw close boundary.

## [x] `Edit-History-Gen5-1 / Phase 4` - `Reopen Hydration And Local CtrlZ`

### Phase 4 Summary

Hydrate accepted local CAD history when reopening Sketch Draw and route local `Ctrl+Z` / `Ctrl+Y` through the active local owner.

This phase should answer the user's exact workflow: make five rectangles, commit, reopen Sketch Draw, undo them one at a time, then redo them.

### Phase 4 Implementation Spec

Research first:
- `src/app/inputRouting.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`
- Sketch Draw session start/reopen paths in `useSpaghettiStore.ts`

Implementation direction:
- when Sketch Draw starts for a target with a durable local batch, hydrate the live session local-history owner from that batch
- make `Ctrl+Z` / `Ctrl+Y` walk the hydrated local batch while Sketch Draw is active
- when the hydrated local batch changes, keep authored sketch geometry and durable batch cursor aligned
- fall back to canonical app history only when the active local CAD owner has no local undo/redo step
- preserve native text undo in ordinary editable fields and meaningful unsent Console drafts

Expected tests:
- draw five rectangles, commit, close/reopen Sketch Draw, `Ctrl+Z` five times removes the accepted rectangles one by one
- after those undos, `Ctrl+Y` five times restores them one by one
- local undo after reopen does not create canonical app-history entries
- canonical app undo still works when Sketch Draw has no local step to consume
- focused Console input follows the same local-owner routing rules from Gen4-3

Stop conditions:
- stop if local batch cursor updates cannot stay aligned with geometry changes
- stop if fallback to canonical app history becomes ambiguous
- stop if native text undo becomes unreliable

### Phase 4 Completion Notes

- Hydrated Sketch Draw sessions from the stored local batch when reopening the accepted sketch target.
- Tightened local undo/redo so completed same-tool geometry commands, such as five rectangles, walk as five geometry undo/redo actions before tool-selection noise consumes extra presses.
- Left Gen4 focused-console routing intact; that route already delegates active Sketch Draw `Ctrl+Z` / `Ctrl+Y` to the store local owner before canonical fallback.

## [x] `Edit-History-Gen5-1 / Phase 5` - `Shared CAD Local Owner Cleanup`

### Phase 5 Summary

Clean up the shared shape after Sketch Draw proves durable local batches.

This phase should make the pattern reusable for Viewer Transform and later CAD sessions without overbuilding a full command bus.

### Phase 5 Implementation Spec

Research first:
- Viewer Transform local history helpers in `useAppStore.ts`
- Sketch Draw durable batch helpers from Phases 2 through 4
- `inputRouting.ts`
- Edit History reader view-model and reader surface tests

Implementation direction:
- extract small shared helper types only where duplication is real
- document or type a common active local CAD owner interface
- align labels/source metadata so history readers can explain canonical entries that include local batches
- keep Viewer Transform behavior stable while making it clear that it is a durable local-history owner
- add regression coverage that Sketch Draw and Viewer Transform both preserve local history alignment through canonical undo/redo

Expected tests:
- Viewer Transform local history behavior still passes unchanged
- Sketch Draw durable batch behavior still passes after any helper extraction
- canonical history reader still displays stable labels and source metadata
- no command recall, transcript, runtime/cache, or provider state leaks into local CAD batches

Stop conditions:
- stop if helper extraction forces large unrelated refactors
- stop if a broad CAD command bus becomes necessary before more than one local owner needs it
- stop if reader metadata changes require unrelated History UI redesign

### Phase 5 Completion Notes

- Closed as a no-extraction cleanup pass: Viewer Transform remains the reference durable local owner, and Sketch Draw now follows the same nested ownership shape without needing a shared command bus.
- Kept reader metadata stable by preserving the single canonical `Commit sketch draw changes` entry label and source.
- Deferred broader helper extraction until another CAD mode needs the same implementation surface.

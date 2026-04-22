# Edit History Gen5 Index

## Doc Header

### Doc History
2. 2026-04-22 18:29:20: Closed Generation 5 after implementing durable target-adjacent Sketch Draw local history batches, canonical batch snapshot restore, reopen hydration, geometry-first same-tool local undo/redo, focused verification, and a no-extraction shared-owner cleanup pass.
1. 2026-04-22 17:56:30: Created the Generation 5 planning index for durable CAD-local history batches after user review clarified Sketch Draw and Viewer Transform should preserve local undo/redo command batches across committed sessions instead of treating every CAD-local command stack as temporary live-session state.

### Purpose

This doc is the Generation 5 planning index for `Edit History`.

Use it to decide:
- how CAD session commands should keep local undo/redo histories after the session commits
- how local CAD histories should remain nested under canonical app history instead of becoming competing app-wide undo stacks
- how the existing Viewer Transform local history pattern should guide Sketch Draw and future CAD sessions
- which Future doc owns the first executable plan

## Doc Body

### Generation Goal

Generation 5 should make CAD-local command histories durable, replayable, and restorable after the accepted CAD session commits.

The user-facing goal is:
- enter a CAD session such as Sketch Draw or Viewer Transform
- make several command-level edits
- undo and redo those commands while the session is active
- commit or close the session
- later reopen the same CAD session or target
- still see and walk the local command history for that accepted CAD result

The canonical app-history goal is:
- keep `editHistoryStore` as the single app-wide authored undo/redo owner
- let canonical entries restore the before/after CAD target state and the before/after local CAD history batch
- avoid creating one canonical app-history entry for every uncommitted local CAD command
- avoid letting CAD-local undo stacks become independent global app-history owners

### Current Routing

- `Future/Edit-History-Gen5-1 - Durable CAD Local History Batches.md`
  - plans the first durable nested-history slice for Viewer Transform pattern extraction, Sketch Draw persistent batch storage, canonical snapshot wrapping, and active-session undo dispatch.

### Starting Boundary

Current accepted behavior:
- `editHistoryStore` is the canonical app-wide history owner.
- Viewer Transform already stores target-local history rows in `transformHistoryByReferenceId` and `transformHistoryByObjectId`.
- Viewer Transform canonical entries snapshot and restore both transform state and local transform history rows.
- Sketch Draw currently has live-session command stacks for staged geometry and tool selection, but those stacks do not survive final commit and later session re-entry as durable sketch-local history.

Generation 5 should preserve the useful parts:
- canonical entries stay the app-level undo/redo contract
- CAD sessions can have local command histories
- active CAD sessions can own `Ctrl+Z` / `Ctrl+Y` before canonical app history

Generation 5 should change the missing durable part:
- local CAD command histories should be stored with the authored CAD target or target-adjacent state
- canonical undo/redo should restore local history batches alongside authored state
- reopening a CAD session should hydrate the local batch instead of starting with an empty stack

### No-Widening Rule

Gen 5 must not turn into broad collaboration, branching, or Build Path work.

Do not widen into:
- persistent checkpoint or branching storage
- multiplayer or collaborative undo semantics
- Build Path comparison or live playhead ownership
- command transcript or command recall as authored undo
- provider/cache/runtime/build result history
- a complete CAD command bus for every future mode before Sketch Draw and Viewer Transform prove the batch contract
- a second app-wide undo stack outside `editHistoryStore`

### Acceptance Read

Gen 5 planning setup is acceptable when the family has:
- a clear HLG and CLG set for durable CAD-local history batches
- an explicit comparison to the existing Viewer Transform local history shape
- one Future doc with Codex-sized phases
- stop conditions that prevent local CAD histories from replacing canonical app history

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen5-HLG-1` - Store durable CAD-local undo/redo command batches inside or beside authored CAD targets so Sketch Draw, Viewer Transform, and later CAD sessions can restore and replay local command histories after a committed session is reopened.

### Codex Level Goals

- [x] `Edit-History-Gen5-CLG-1` - Define the shared durable CAD-local history batch contract, using Viewer Transform local history as the reference pattern and keeping `editHistoryStore` as the only canonical app-wide owner.
- [x] `Edit-History-Gen5-CLG-2` - Route Sketch Draw completed geometry and tool-selection commands into a durable sketch-local batch instead of discarding the live session stack at final commit.
- [x] `Edit-History-Gen5-CLG-3` - Make canonical Sketch Draw commit entries snapshot and restore both sketch authored state and the sketch-local history batch.
- [x] `Edit-History-Gen5-CLG-4` - Hydrate local CAD histories when reopening an accepted CAD session or target, so local `Ctrl+Z` / `Ctrl+Y` can walk previous accepted commands before falling back to canonical app history.
- [x] `Edit-History-Gen5-CLG-5` - Preserve native text undo, command recall exclusion, runtime/cache exclusion, redo invalidation rules, and canonical history reader alignment while adding durable local batches.

## [x] `Edit-History-Gen5-1` - `Durable CAD Local History Batches`

Planning doc:
- `Future/Edit-History-Gen5-1 - Durable CAD Local History Batches.md`

Status:
- implemented after user review clarified Gen4 temporary Sketch Draw session history is not enough
- closed with Sketch Draw target-adjacent local batches, canonical before/after batch restore, reopen hydration, and geometry-first same-tool local undo/redo

Boundary:
- keep local CAD command histories durable and target-scoped
- keep canonical app history as the app-wide undo/redo owner
- do not promote every local CAD command into its own app-wide canonical entry unless a later explicit product direction chooses that model

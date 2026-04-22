# Edit History Gen4 Index

## Doc Header

### Doc History
6. 2026-04-22 16:28:35: Marked `Edit-History-Gen4-3` complete after focused-console active Sketch Draw undo/redo routing, completed staged geometry undo/redo from focused Console, submitted tool-selection undo/redo, focused route and Console/store tests, and production build proof landed.
5. 2026-04-22 15:16:08: Added `Edit-History-Gen4-3` after console-focused research showed active Sketch Draw undo/redo can be blocked by editable console input ownership after submitted commands such as `rec`, requiring a focused-console command-session undo policy before the staged stack feels reliable in real console workflows.
4. 2026-04-22 12:42:43: Marked `Edit-History-Gen4-2` complete after Sketch Draw gained an in-session staged command buffer, active draw undo/redo routing, and one final canonical commit entry for the accepted staged sketch delta.
3. 2026-04-22 12:12:20: Added `Edit-History-Gen4-2` after user review clarified Sketch Draw needs an in-session staged command buffer so completed rectangles and other commands can be undone/redone before the final sketch commit reaches canonical app history.
2. 2026-04-22 11:37:27: Marked `Edit-History-Gen4-1` complete after Sketch Draw completed create and delete commands began creating canonical edit-history entries with focused undo/redo proof while local draft/session actions stayed history-free.
1. 2026-04-22 11:10:11: Created the Generation 4 planning index for Sketch Draw authored command undo after user review clarified completed Sketch Draw lines and commands should be undoable/redoable individually.

### Purpose

This doc is the Generation 4 planning index for `Edit History`.

Use it to decide:
- which Sketch Draw command mutations should become staged in-session undo/redo entries
- which final Sketch Draw commits should become canonical authored undo/redo entries
- which local Sketch Draw draft/session behavior must remain outside canonical history
- how the family should move from the current canonical-entry proof to a scoped staged-command implementation
- how focused console input should cooperate with active Sketch Draw command undo/redo after submitted console commands
- which Future doc owns the first executable plan

## Doc Body

### Generation Goal

Generation 4 should make completed Sketch Draw authored commands undoable and redoable before and after the user commits the Sketch Draw session.

The user-facing goal is simple:
- while Sketch Draw is active, the user can draw several completed commands, undo some of them, redo them, and then commit the resulting sketch
- example: draw five rectangles, press `Ctrl+Z` twice, commit Sketch Draw, and persist only the remaining three rectangles as the accepted sketch delta
- each completed in-session command should be a meaningful staged history step
- console-submitted Sketch Draw commands should remain undoable through the active Sketch Draw command owner even when the console input still has focus
- the final explicit Sketch Draw commit should be the boundary where the accepted staged delta becomes app-wide canonical history

The internal boundary is equally important:
- in-progress draft points can keep local `undo` behavior
- hover, selection-only state, active tool choice, command prompt text, snap preview, and camera/view movement stay out of canonical history
- staged command entries start only after a completed command mutates staged sketch geometry
- canonical app history starts only when the user explicitly commits Sketch Draw, exits through an accepted commit path, or performs the final accepted session commit action

### Current Routing

- `Future/Edit-History-Gen4-1 - Sketch Draw Authored Command Undo.md`
  - plans the first Sketch Draw authored command history slice for completed line/rectangle/circle/polyline and delete-selected commands
- `Future/Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer.md`
  - plans the follow-up session command-buffer slice so completed Sketch Draw commands can be undone/redone before final sketch commit
- `Future/Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership.md`
  - plans the focused-console command-session undo slice so submitted Sketch Draw console commands keep undo/redo ownership before final sketch commit

### Starting Boundary

Current accepted behavior proves `geometrySketchSession` draft/session actions stay outside canonical history, completed Sketch Draw commands can stage inside the active session, and the accepted staged sketch delta can become one canonical app-history entry at close.

That proof is still valuable, but the console workflow exposed another ownership gap. `Edit-History-Gen4-1` proved completed draw/delete seams can make meaningful undo entries, and `Edit-History-Gen4-2` moved those commands into an in-session staged stack. User review clarified the product shape:
- completed commands inside Sketch Draw must stay undoable before the user commits the sketch
- the active Sketch Draw session needs a staged command buffer
- app-wide canonical history should receive the accepted final staged delta at the Sketch Draw commit boundary
- when the user submits Sketch Draw commands through Console, the focused console input should not trap `Ctrl+Z` / `Ctrl+Y` away from the active Sketch Draw command owner
- a submitted tool-selection command such as `rec` needs an explicit undo answer instead of only becoming native text-field undo

Generation 4 should preserve the local-draft exclusion while staging the durable sketch mutations that happen when:
- `finishGeometrySketchDrawDraft(...)` commits a completed draw command
- `confirmGeometrySketchDrawPoint(...)` completes a two-point command
- `confirmGeometrySketchDrawRadius(...)` completes a circle command
- `deleteGeometrySketchSelectedComponents(...)` removes selected sketch components

### No-Widening Rule

Gen 4 must not add a general CAD command architecture before the first Sketch Draw seam is proven.

Do not widen into:
- feature-stack add/remove/reorder outside Sketch Draw
- sketch plane transform history
- local draft-point undo as canonical history
- hover, selection, active tool, prompt, or camera history
- command transcript or command recall undo
- a broad cross-mode console command-session framework before the Sketch Draw seam is proven
- nested canonical entries for every uncommitted staged Sketch Draw command
- Build Path, checkpoints, branching, collaboration, persistence, runtime cache, provider status, or preview/build output history

### Acceptance Read

Gen 4 planning setup is acceptable when the family has:
- one scan index for Sketch Draw authored command history
- Future docs for immediate authored-command proof, staged command-buffer follow-up, and focused-console undo ownership
- explicit HLG and CLG routing
- explicit local-draft exclusions
- a clear stop condition that prevents broad CAD command architecture work from hiding inside the first slice

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen4-HLG-1` - Make completed Sketch Draw lines, shapes, polylines, and delete commands undoable/redoable as individual authored sketch commands while keeping hover, selection, and in-progress draft points local.
- [x] `Edit-History-Gen4-HLG-2` - Let users undo and redo completed Sketch Draw commands inside the active Sketch Draw session before committing the final staged sketch change into canonical edit history.
- [x] `Edit-History-Gen4-HLG-3` - Let Sketch Draw keep undo/redo ownership after console command submissions even when the console input remains focused, so `Ctrl+Z` / `Ctrl+Y` act on the active Sketch Draw command session instead of native console text history.

### Codex Level Goals

- [x] `Edit-History-Gen4-CLG-1` - Route completed Sketch Draw line, rectangle, circle, and polyline commits through canonical edit-history entries after durable sketch geometry changes.
- [x] `Edit-History-Gen4-CLG-2` - Route Sketch Draw delete-selected commits through canonical edit-history entries after durable sketch components are removed.
- [x] `Edit-History-Gen4-CLG-3` - Preserve local draw-session behavior for draft-point undo, hover, selection-only state, snap preview, active tool choice, prompt text, Escape/back/cancel, and camera/view changes.
- [x] `Edit-History-Gen4-CLG-4` - Prove `Ctrl+Z` and `Ctrl+Y` walk individual completed Sketch Draw commands without creating entries for in-progress draft actions.
- [x] `Edit-History-Gen4-CLG-5` - Add a Sketch Draw session command buffer that records completed line, rectangle, circle, polyline, and delete-selected commands before final sketch commit.
- [x] `Edit-History-Gen4-CLG-6` - Route `Ctrl+Z` and `Ctrl+Y` inside active Sketch Draw to staged command undo/redo before falling back to canonical app history.
- [x] `Edit-History-Gen4-CLG-7` - Commit the accepted staged Sketch Draw delta into canonical app history only at the explicit Sketch Draw commit boundary.
- [x] `Edit-History-Gen4-CLG-8` - Preserve draft-point undo, hover, selection-only state, cancel/back/Escape, prompt text, camera/view state, and no-op staged actions as local/session-only behavior.
- [x] `Edit-History-Gen4-CLG-9` - Define a shared input-routing policy that lets an active command session outrank native console input undo/redo after submitted console commands while preserving native undo for meaningful unsent console drafts and ordinary editable fields.
- [x] `Edit-History-Gen4-CLG-10` - Route focused-console `Ctrl+Z` / `Ctrl+Y` to Sketch Draw staged undo/redo after completed console-driven Sketch Draw commands such as rectangle point submissions.
- [x] `Edit-History-Gen4-CLG-11` - Give submitted Sketch Draw tool-selection commands such as `rec` an explicit undo/redo or cancel/reapply behavior inside the active session.
- [x] `Edit-History-Gen4-CLG-12` - Prove the focused-console undo policy does not break global canonical app undo, viewer shortcuts, command recall, text-field native undo, or final Sketch Draw commit behavior.

## [x] `Edit-History-Gen4-1` - `Sketch Draw Authored Command Undo`

Planning doc:
- `Future/Edit-History-Gen4-1 - Sketch Draw Authored Command Undo.md`

Status:
- implemented with focused authored-command entries over existing Sketch Draw graph mutation seams
- completed line, rectangle, circle, polyline, and delete-selected commands now create canonical undo/redo entries
- local draft-point undo, hover, selection-only, cancel/back/Escape, and no-op delete behavior remains history-free
- broad CAD command architecture, persistence, checkpoints, and collaboration remain out of scope

Follow-up:
- user review clarified this is not the final Sketch Draw UX because active-session completed commands need undo/redo before the sketch is committed
- `Edit-History-Gen4-2` owns the staged command-buffer correction

## [x] `Edit-History-Gen4-2` - `Sketch Draw Staged Command Buffer`

Planning doc:
- `Future/Edit-History-Gen4-2 - Sketch Draw Staged Command Buffer.md`

Status:
- implemented after the Gen4-1 interim implementation exposed the need for in-session command history
- users can draw multiple completed commands, undo/redo them while still inside Sketch Draw, and commit only the accepted staged sketch delta
- `x` / `closeGeometrySketchSession()` is the current accepted commit seam; idle `esc`/`back` through `cancelGeometrySketchDrawDraft()` restores the pre-session sketch when staged commands exist
- broad CAD command architecture and app-wide canonical entries for uncommitted staged commands remain out of scope

Follow-up:
- user review clarified the real console workflow still fails when the console input keeps focus after submitted Sketch Draw commands
- `Edit-History-Gen4-3` owns the focused-console undo ownership correction

## [x] `Edit-History-Gen4-3` - `Console-Focused Sketch Draw Undo Ownership`

Planning doc:
- `Future/Edit-History-Gen4-3 - Console-Focused Sketch Draw Undo Ownership.md`

Status:
- implemented after research showed `inputRouting.ts` gave editable targets first claim, so focused console inputs could classify `Ctrl+Z` / `Ctrl+Y` as native text-field undo before Sketch Draw staged undo saw the event
- focused Console inputs now route `Ctrl+Z` / `Ctrl+Y` to active Sketch Draw when there is no meaningful unsent manual draft
- completed console-driven Sketch Draw geometry and submitted tool-selection commands now undo/redo inside the active Sketch Draw session before final commit

Boundary:
- preserve native text undo for meaningful unsent console drafts and ordinary editable targets
- route submitted Sketch Draw command undo/redo to the active Sketch Draw session before app-wide canonical history or viewer shortcuts
- keep final Sketch Draw close/commit as one canonical app-history entry for the accepted staged sketch delta

# Edit History Workspace Vision

## Doc Header

### Doc History
2. 2026-04-30 22:09:49: Added the unified timeline and history-marker direction so the Edit History workspace can move beyond separate Undo/Redo stack lists toward one chronological list with a visible current-position marker and optional scrub/slider navigation.
1. 2026-04-30 22:07:41: Created the Edit History workspace vision so the reader/workspace surface has its own planning home under Workspace Modes while canonical undo/redo ownership remains in the broader Edit-History architecture family.

### Purpose

This doc defines the workspace-surface direction for the `Edit History` workspace.

Use it to answer:
- what the Edit History workspace should show
- how committed canonical history, snapshot activity, and active local command history should be separated
- how this workspace relates to the broader `Architecture/Edit-History` family
- what must stay true when the surface grows new tabs, filters, or inspection panels

Related owner docs:
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Vision.md`
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

## Doc Body

### Short Version

The Edit History workspace is the read-and-inspect surface for history activity.

It should show:
- committed canonical Undo/Redo entries
- public snapshot activity metadata
- active local command buffers such as Sketch Draw before they commit
- enough source, target, and status context that the user can understand why an entry exists

It should not become:
- a second undo/redo owner
- a private payload viewer
- a checkpoint/branch store by accident
- a workspace layout history owner

### What Must Stay True

1. The canonical edit-history owner remains `editHistoryStore`.

2. The workspace reads public metadata and session-local surface state. It should not inspect private undo/redo closures or serialized command payloads.

3. Committed entries and uncommitted local history must stay visibly distinct.

4. Pending rows are navigation aids, not fake committed history entries.

5. Source systems keep their own local command semantics. The Edit History workspace can display them, but should not silently take ownership away from Sketch Draw, Viewer Transform, or later CAD-local sessions.

6. Snapshot activity is an activity log, not a durable document checkpoint system.

7. The surface should remain useful in tiled, windowed, and later pop-out workspace presentations without creating separate history worlds per host.

### Surface Model

The Edit History workspace should behave like a tool surface under Workspace Modes.

Expected tabs:
- `Undo`
  - committed canonical undo stack
  - may include pending navigation rows for active local buffers
- `Redo`
  - committed canonical redo stack
- `Sketch Draw`
  - active Sketch Draw local command buffer
  - visible only as local, not committed, history
- later CAD-local tabs as needed
  - Viewer Transform local batches
  - feature-session command buffers
  - other target-scoped local histories

Expected side panels:
- public metadata inspector
- snapshot activity log
- local session status when a local-history tab is active

### Unified Timeline Direction

The long-term reader should make Undo and Redo feel like one history timeline.

Instead of forcing the user to reason about two disconnected lists, the workspace should be able to show one chronological stack:
- older committed entries at one end
- newer entries at the other end
- a visible `history marker` showing the current applied point in time
- entries on the applied side of the marker are undoable
- entries on the unapplied side of the marker are redoable

The marker should be explicit.

Possible UI shape:
- a vertical history list
- a marker row between applied and unapplied entries
- a slim vertical scroll or slider rail beside the list
- dragging or clicking the rail previews or chooses a target point in time
- confirming the target performs the required undo/redo steps through the canonical owner

Important rule:
- the marker is a navigation/read model over canonical history
- it must not become a second stack, checkpoint store, or private payload serializer

Plain-English behavior:
- if the marker moves up, the app undoes entries until it reaches that point
- if the marker moves down, the app redoes entries until it reaches that point
- the UI can show the destination clearly before executing a multi-step jump

Open interaction question:
- whether dragging the marker should execute live while dragging, or stage a target and require release/confirm

Default recommendation:
- first implementation should use click-to-jump or drag-release-to-jump, not live-scrub execution, so accidental large undo/redo jumps are easier to avoid.

### Ownership Boundary

The Edit History workspace owns:
- presentation of public history metadata
- local tab/navigation state inside the reader
- filter and grouping affordances that do not mutate history
- pending-row navigation into active local-history tabs

The Edit History workspace does not own:
- committing entries
- undo/redo execution
- private snapshot payloads
- local command buffer mutation
- durable checkpoint storage
- workspace layout persistence

### Relationship To Canonical Edit-History Family

The broader `Architecture/Edit-History` family owns the history system:
- canonical owner rules
- transaction boundaries
- undo/redo restore semantics
- CAD-local history batching
- checkpoint/branch readiness

This workspace family owns how that history becomes visible as a workspace surface.

Plain-English split:
- `Architecture/Edit-History` decides what history is.
- `Workspace-Modes/Workspaces/Edit-History` decides how the user reads and navigates that history inside the workspace.

## Human Level Goals

### Generation 1 HLG

- [ ] `Edit-History-Workspace-Gen1-HLG-1` `Make committed Undo/Redo history visible without exposing private payloads.`
- [ ] `Edit-History-Workspace-Gen1-HLG-2` `Show active local command history before it commits, clearly marked as not committed yet.`
- [ ] `Edit-History-Workspace-Gen1-HLG-3` `Let pending rows route users to the correct local-history tab instead of pretending local work is canonical history.`
- [ ] `Edit-History-Workspace-Gen1-HLG-4` `Keep the workspace reader useful across tiled, windowed, and later pop-out hosts without creating separate history owners.`
- [ ] `Edit-History-Workspace-Gen1-HLG-5` `Show one chronological history timeline with a clear marker for the current applied point in time.`

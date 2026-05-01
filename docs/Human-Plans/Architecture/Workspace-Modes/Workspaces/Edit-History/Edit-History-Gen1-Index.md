# Edit History Workspace Gen1 Index

## Doc Header

### Doc History
35. 2026-05-01 09:32:23: Marked `Edit-History-Workspace-4 / Phase 11A` shipped after regression coverage proved scrub marker jumps preserve the canonical undo/redo pointer, Undo/Redo buttons continue from the scrubbed marker index, and no marker-move pseudo-entry is created.
34. 2026-05-01 09:10:55: Marked `Edit-History-Workspace-4 / Phase 11A` prepped for implementation with canonical scrub pointer regression coverage, shared jump-helper reuse, Ctrl+Z/Ctrl+Y after scrub expectations, and no marker-move pseudo-entry ownership.
33. 2026-05-01 08:41:07: Added pre-Phase-12 bridge phases 11A, 11B, and 11C to make the Timeline scrub list the canonical undo/redo projection, separate snapshot activity from scrub ownership, and reconcile expanded child rows before true child restore work starts.
32. 2026-05-01 08:06:29: Marked `Edit-History-Workspace-4 / Phase 12` prepped for implementation with private parent-owned child restore points, store-level child restore execution, Sketch Draw child boundary snapshots, and no independent child undo/redo entries.
31. 2026-05-01 01:27:27: Marked `Edit-History-Workspace-4 / Phase 11` shipped after expanded Sketch Draw child rows became measured read-only scrub targets and release continued to route through parent canonical boundaries.
30. 2026-05-01 01:20:25: Marked `Edit-History-Workspace-4 / Phase 11` prepped for implementation with rendered child target measurement, child detail selection, parent-boundary release semantics, and no true child restore ownership.
29. 2026-05-01 01:16:58: Renamed the unified timeline ladder back to `Edit-History-Workspace-4` in this workspace-family index so it stays distinct from the separate broader architecture `Edit-History-4` plan.
28. 2026-05-01 01:14:57: Added `Edit-History-Workspace-4 / Phase 11` and `Edit-History-Workspace-4 / Phase 12` to the Gen1 ladder for expanded Sketch Draw child scrub preview stops first, then true child restore points only after a real parent-owned restore contract exists.
27. 2026-05-01 00:14:08: Marked `Edit-History-Workspace-4 / Phase 10` shipped after public Sketch Draw child summaries landed on committed parent entries and expanded Timeline group cards began rendering real accepted local-command rows.
26. 2026-05-01 00:08:14: Marked `Edit-History-Workspace-4 / Phase 9` shipped after expandable timeline group-card wrappers, sibling jump/expand controls, fallback child details, and rail measurement preservation landed with focused tests and TypeScript verification.
25. 2026-04-30 23:56:51: Marked `Edit-History-Workspace-4 / Phase 10` prepped for implementation with public Sketch Draw child-summary metadata captured from accepted local commands and surfaced through the reader without changing parent undo/redo ownership.
24. 2026-04-30 23:53:08: Marked `Edit-History-Workspace-4 / Phase 9` prepped for implementation with expandable card event boundaries, local expansion state, and rail measurement preservation before Phase 10 child-summary data work.
23. 2026-04-30 23:43:33: Added `Edit-History-Workspace-4 / Phase 9` and `Edit-History-Workspace-4 / Phase 10` to the Gen1 ladder for expandable timeline group cards and public Sketch Draw commit child summaries.
22. 2026-04-30 23:30:55: Marked `Edit-History-Workspace-4 / Phase 8` shipped after the Timeline rail gained a thin muted line, visible entry dots, a large active blue node, and preserved scrub behavior.
21. 2026-04-30 23:27:40: Prepped `Edit-History-Workspace-4 / Phase 8` for implementation by grounding the thin rail and entry-dot pass in the current rail button, handle positioning, visible timeline entries, and behavior-preserving test scope.
20. 2026-04-30 23:26:18: Added `Edit-History-Workspace-4 / Phase 8` to the Gen1 ladder as the thin timeline rail and inactive entry dots polish pass following the shipped compact current-position marker row.
19. 2026-04-30 23:21:00: Marked `Edit-History-Workspace-4 / Phase 7` shipped after the Timeline current-position marker became a compact rail-connected row with reduced marker text while preserving inspector details and scrub behavior.
18. 2026-04-30 23:17:32: Prepped `Edit-History-Workspace-4 / Phase 7` for implementation with the compact marker row JSX shape, CSS connector strategy, active rail node treatment, focused tests, and behavior-preservation boundaries.
17. 2026-04-30 23:16:13: Added `Edit-History-Workspace-4 / Phase 7` as the future compact current-position marker row polish pass, keeping the marker connected to the rail while reducing row height and marker text density.
16. 2026-04-30 23:09:47: Marked `Edit-History-Workspace-4 / Phase 6` shipped after the Timeline scrub handle began moving continuously under the pointer while the current-position card preview remains snapped to discrete history slots.
15. 2026-04-30 23:07:21: Added `Edit-History-Workspace-4 / Phase 6` as the future smooth scrub handle polish pass, separating continuous handle motion from snapped current-position card preview.
14. 2026-04-30 22:58:03: Recorded the shipped Phase 5 alignment follow-up that keeps the Timeline scrub rail to the rendered card stack height and centers the handle on the current-position card slot.
13. 2026-04-30 22:54:23: Marked `Edit-History-Workspace-4 / Phase 5` shipped after the Edit History workspace Timeline scrub rail gained drag preview state, marker-card and rail drag starts, no-live-mutation pointer movement, release-time canonical commits, and cancel no-op behavior.
12. 2026-04-30 22:51:14: Prepped `Edit-History-Workspace-4 / Phase 5` as the implementation-ready draggable marker scrub release pass, defining preview-only state, pointer capture, release-time canonical commits, cancel behavior, and no-live-mutation tests.
11. 2026-04-30 22:47:10: Marked `Edit-History-Workspace-4 / Phase 4` shipped after the Edit History workspace Timeline tab gained a vertical scrub rail, marker handle positioning, and rail click targets routed through canonical undo/redo jumps.
10. 2026-04-30 22:44:38: Prepped `Edit-History-Workspace-4 / Phase 4` as the implementation-ready vertical scrub rail and click-target slice, defining discrete marker positions, rail click routing, no-drag boundaries, and focused reader-surface verification.
9. 2026-04-30 22:41:38: Extended `Edit-History-Workspace-4` with Phase 4 for a vertical scrub rail and Phase 5 for draggable marker scrub release, keeping rail and drag behavior tied to canonical undo/redo jumps instead of a new history owner.
8. 2026-04-30 22:28:54: Marked `Edit-History-Workspace-4 / Phase 3` shipped after timeline row clicks began routing marker jumps through canonical undo/redo calls while leaving checkpoint storage, branch graphs, and Sketch Draw local history outside the lane.
7. 2026-04-30 22:23:36: Prepped `Edit-History-Workspace-4 / Phase 3` as the next marker jump-routing pass, defining target marker index semantics, canonical undo/redo stepping, and no-widening boundaries around Sketch Draw, snapshots, checkpoints, and branch graphs.
6. 2026-04-30 22:22:22: Marked `Edit-History-Workspace-4 / Phase 2` shipped after the Edit History workspace gained a default Timeline tab with a visible read-only current-position marker over applied and redoable entries.
5. 2026-04-30 22:16:51: Prepped `Edit-History-Workspace-4 / Phase 2` as the next visible timeline UI pass, keeping marker jump execution deferred to Phase 3 while preserving the existing Undo, Redo, Sketch Draw, and snapshot activity surfaces.
4. 2026-04-30 22:15:23: Marked `Edit-History-Workspace-4 / Phase 1` shipped after the reader layer gained a unified public timeline model over canonical Undo/Redo entries while leaving visible marker UI and jump routing in later phases.
3. 2026-04-30 22:11:53: Renamed the unified timeline follow-on to `Edit-History-Workspace-4` and prepped its Phase 1 read-model slice as the next implementation-ready planning target.
2. 2026-04-30 22:09:49: Added `Edit-History-Workspace-4` as the unified timeline and history-marker follow-on so Undo/Redo can become one chronological reader with a visible current-position marker instead of separate stack lists.
1. 2026-04-30 22:07:41: Created the Generation 1 index for the Edit History workspace surface so committed history, snapshot activity, and active Sketch Draw local history can be routed as workspace-reader work instead of broad edit-history ownership work.

### Purpose

This doc routes Generation 1 of the `Edit History` workspace family.

Use it to answer:
- what the first Edit History workspace generation is trying to make visible
- which goals belong to the workspace reader instead of the canonical edit-history owner
- which follow-on phases should live under `Future/`
- what counts as shipped workspace-reader behavior

Related docs:
- `Edit-History-Vision.md`
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Gen5-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

## Doc Body

### Generation Goal

Generation 1 should make the Edit History workspace a trustworthy reader for history activity.

The first generation should distinguish:
- committed canonical Undo/Redo entries
- session snapshot activity
- active local command buffers that have not committed yet

It should not widen into:
- new undo/redo execution ownership
- checkpoint storage
- branch graphs
- private payload inspection
- workspace layout history

### Preserved HLG

- [ ] `Edit-History-Workspace-Gen1-HLG-1` `Make committed Undo/Redo history visible without exposing private payloads.`
- [ ] `Edit-History-Workspace-Gen1-HLG-2` `Show active local command history before it commits, clearly marked as not committed yet.`
- [ ] `Edit-History-Workspace-Gen1-HLG-3` `Let pending rows route users to the correct local-history tab instead of pretending local work is canonical history.`
- [ ] `Edit-History-Workspace-Gen1-HLG-4` `Keep the workspace reader useful across tiled, windowed, and later pop-out hosts without creating separate history owners.`
- [ ] `Edit-History-Workspace-Gen1-HLG-5` `Show one chronological history timeline with a clear marker for the current applied point in time.`

### Derived CLG

- [ ] `Edit-History-Workspace-Gen1-CLG-1` Keep Undo and Redo tabs backed by `editHistoryStore` public metadata only.
- [ ] `Edit-History-Workspace-Gen1-CLG-2` Keep snapshot activity as a public metadata activity log with linear session numbering.
- [ ] `Edit-History-Workspace-Gen1-CLG-3` Add local-history tabs for active command buffers without committing those buffers early.
- [ ] `Edit-History-Workspace-Gen1-CLG-4` Make pending canonical-list rows navigate into the owning local-history tab.
- [ ] `Edit-History-Workspace-Gen1-CLG-5` Keep host/presentation state separate from history ownership.
- [ ] `Edit-History-Workspace-Gen1-CLG-6` Present canonical history as one chronological timeline with a current-position marker over applied and redoable entries.

### Family Phase Ladder

#### `Edit-History-Workspace-1` - Reader Foundation And Public Metadata

Goal:
- Establish the Edit History workspace as a public metadata reader for canonical Undo/Redo and snapshot activity.

Status:
- Shipped in current implementation work.

Evidence:
- Undo/Redo tabs read `editHistoryStore.getSnapshot()`.
- Snapshot log rows show captured, undo, and redo activity with public labels and stack depths.
- Private undo/redo closures remain hidden.

#### `Edit-History-Workspace-2` - Active Local History Tabs

Goal:
- Show active local command buffers inside dedicated workspace tabs without pretending they are committed canonical history.

Status:
- Started with the active Sketch Draw tab and pending-row navigation.

Current behavior:
- `Sketch Draw (N)` reads active session undo commands.
- The Undo tab can show `Sketch Draw changes` as a pending row.
- Clicking the pending row opens the `Sketch Draw` tab.

Future direction:
- Add follow-on tabs only when a source system has a real local command buffer to read.
- Candidate later tabs include Viewer Transform local batches and feature-session command buffers.

#### `Edit-History-Workspace-3` - Workspace-Host Polish

Goal:
- Make the reader comfortable as a tiled, windowed, and later pop-out workspace surface.

Status:
- Future.

Likely scope:
- Responsive reader layout.
- Cleaner tab and source filtering density.
- No separate history owner per host.
- No saved reader preferences until a real preference owner exists.

#### `Edit-History-Workspace-4` - Unified Timeline And History Marker

Goal:
- Replace the two-list Undo/Redo mental model with one chronological timeline and a visible current-position marker.

Status:
- Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, Phase 6, Phase 7, Phase 8, Phase 9, Phase 10, Phase 11, and Phase 11A shipped.
- Phase 11B and Phase 11C added as required bridge phases before Phase 12.
- Phase 12 prepped for implementation.

Likely scope:
- One combined public timeline model derived from canonical undo and redo entries. Shipped in Phase 1.
- A marker row or rail position that separates applied entries from redoable entries. Shipped in Phase 2.
- Click-to-jump behavior that routes through the canonical owner by executing the needed undo/redo steps. Shipped in Phase 3.
- A vertical scrub rail with discrete marker positions and rail click targets. Shipped in Phase 4.
- A draggable current-position card/handle that previews movement and commits on release. Shipped in Phase 5.
- A smooth scrub handle that moves continuously while the current-position card preview snaps discretely. Shipped in Phase 6.
- A compact current-position marker row connected to the vertical rail with reduced marker text density. Shipped in Phase 7.
- A thin vertical timeline rail with inactive entry dots and a large active blue marker node. Shipped in Phase 8.
- Expandable canonical timeline group cards that can show read-only nested child summaries. Shipped in Phase 9.
- Public Sketch Draw commit child summaries so expanded committed sketch cards can show real sub-commands. Shipped in Phase 10.
- Expanded Sketch Draw child-summary rows as read-only scrub preview and selection targets. Shipped in Phase 11.
- Canonical scrub pointer alignment so marker movement is equivalent to canonical Undo/Redo steps instead of its own undoable marker entry. Shipped in Phase 11A.
- Snapshot activity separation so diagnostic rows cannot become the canonical scrub-list owner. Planned in Phase 11B.
- Expanded child-row policy reconciliation before true child restore, keeping Ctrl+Z/Ctrl+Y on parent canonical entries. Planned in Phase 11C.
- True partial Sketch Draw child restore points under the parent canonical entry. Prepped for Phase 12 with a private parent-owned restore contract.
- Clear pending state before a multi-step jump.

Exclusions:
- No private payload inspection.
- No checkpoint storage.
- No live-scrub execution in the first pass unless the interaction is proven safe.

### Future Folder

Use `Future/` for implementation-ready workspace-reader follow-ons.

Good candidates:
- `Edit-History-Workspace-2 - Expanded Local History Tabs.md`
- `Edit-History-Workspace-3 - Reader Host And Density Polish.md`
- `Edit-History-Workspace-4 - Unified Timeline And History Marker.md`

### Shipped Folder

Use `Shipped/` for completed workspace-reader records once a phase has implementation evidence and verification.

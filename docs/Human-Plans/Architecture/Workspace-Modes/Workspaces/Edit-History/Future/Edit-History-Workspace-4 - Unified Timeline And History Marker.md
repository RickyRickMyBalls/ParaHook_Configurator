# Edit-History-Workspace-4 - Unified Timeline And History Marker

## Doc Header

### Doc History
35. 2026-05-01 09:32:23: Marked `Edit-History-Workspace-4 / Phase 11A` shipped after focused reader-surface regression coverage proved scrub marker jumps keep the canonical undo/redo pointer, Undo/Redo buttons continue from the scrubbed marker index, same marker movement never creates a pseudo-entry, and focused verification passed.
34. 2026-05-01 09:10:55: Prepped `Edit-History-Workspace-4 / Phase 11A` for implementation with the current `jumpToTimelineMarkerIndex(...)` surface seam, canonical stack assertions after scrub release, Ctrl+Z/Ctrl+Y follow-up expectations, no marker-move pseudo-entry creation, child-selection cleanup, and focused regression tests for the `10 -> 5 -> undo goes 4` behavior.
33. 2026-05-01 08:41:07: Added pre-Phase-12 bridge phases for canonical scrub pointer alignment so the Timeline scrub list is treated as the canonical undo/redo projection, current-position movement never creates its own undoable marker action, snapshot activity stays diagnostic-only, and expanded child rows remain non-canonical until a later build-path or restore-specific lane owns them.
32. 2026-05-01 08:06:29: Prepped `Edit-History-Workspace-4 / Phase 12` for implementation with a private parent-owned child restore-point contract, store-level child restore execution, Sketch Draw boundary snapshots derived from accepted session commands, reader release integration after parent-boundary jumps, and hard exclusions for public private-payload exposure or independent child undo/redo entries.
31. 2026-05-01 01:27:27: Marked `Edit-History-Workspace-4 / Phase 11` shipped after expanded Sketch Draw child rows became measured scrub targets, child detail selection stayed read-only, release on child targets moved only to the parent canonical boundary, and focused reader/store verification plus TypeScript build passed.
30. 2026-05-01 01:20:25: Prepped `Edit-History-Workspace-4 / Phase 11` for implementation with rendered child-row target measurement, child selection state, parent-boundary release semantics, inspector honesty wording, focused tests, and hard exclusions for true child restore points or canonical child undo/redo ownership.
29. 2026-05-01 01:16:58: Renamed this workspace-reader lane back to `Edit-History-Workspace-4` so it no longer collides with the separate broader architecture `Edit-History-4` family plan.
28. 2026-05-01 01:14:57: Added `Edit-History-Workspace-4 / Phase 11` and `Edit-History-Workspace-4 / Phase 12` to route dragging the current-position marker onto expanded Sketch Draw sub-command rows, splitting the safe read-only child-target preview/selection work from later true partial Sketch Draw restore once child restore points exist.
27. 2026-05-01 00:14:08: Marked `Edit-History-Workspace-4 / Phase 10` shipped after public Sketch Draw child summaries were captured from accepted local commands, stored on the parent canonical entry, surfaced through the reader model, rendered in expanded Timeline group cards, and verified with focused tests plus TypeScript build.
26. 2026-05-01 00:08:14: Marked `Edit-History-Workspace-4 / Phase 9` shipped after the Timeline gained expandable group-card wrappers, sibling parent-jump and expand controls, unavailable committed-command fallback details, preserved rail card-center measurement, focused reader tests, and TypeScript build verification.
25. 2026-04-30 23:56:51: Prepped `Edit-History-Workspace-4 / Phase 10` for implementation around public Sketch Draw committed child summaries captured from accepted `sessionUndoCommands`, stored as metadata on the parent canonical entry, surfaced through the reader model, and rendered by the Phase 9 expanded group-card shell without changing undo/redo ownership.
24. 2026-04-30 23:53:08: Prepped `Edit-History-Workspace-4 / Phase 9` for implementation with sibling parent-jump and expand controls, local expanded-entry state, `Commit sketch draw changes` as the first group-capable entry, unavailable child-detail fallback, rail measurement preservation, and focused no-jump expansion tests.
23. 2026-04-30 23:43:33: Added `Edit-History-Workspace-4 / Phase 9` for expandable timeline group cards and `Edit-History-Workspace-4 / Phase 10` for public Sketch Draw commit child summaries, preserving the parent canonical entry as the only undo/redo owner.
22. 2026-04-30 23:38:25: Recorded the `Edit-History-Workspace-4 / Phase 8` alignment follow-up after rail dots and the active marker switched from equal slot percentages to measured rendered card centers with slot math retained as fallback.
21. 2026-04-30 23:30:55: Marked `Edit-History-Workspace-4 / Phase 8` shipped after the Timeline rail became a thin muted line with visible entry dots, a larger blue active node, preserved wide hit target, focused reader tests, and TypeScript build verification.
20. 2026-04-30 23:27:40: Prepped `Edit-History-Workspace-4 / Phase 8` for implementation by locking the live rail seam, visible-dot markup, slot-center positioning, CSS class targets, focused tests, and no-behavior-change boundaries.
19. 2026-04-30 23:26:18: Added `Edit-History-Workspace-4 / Phase 8` as the thin vertical timeline rail polish pass, capturing the reference image details for a muted line rail, per-entry dots, a large blue active node, and invisible hit-area preservation.
18. 2026-04-30 23:21:00: Marked `Edit-History-Workspace-4 / Phase 7` shipped after the current-position marker became a compact rail-connected row with reduced marker text, inspector-retained detail, blue active node styling, focused reader tests, and TypeScript build verification.
17. 2026-04-30 23:17:32: Prepped `Edit-History-Workspace-4 / Phase 7` for implementation by locking the compact marker row JSX shape, rail connector styling, active node treatment, behavior-preservation tests, and no-widening boundaries.
16. 2026-04-30 23:16:13: Added `Edit-History-Workspace-4 / Phase 7` as the compact current-position marker row follow-up, capturing the slimmer marker card, rail connector, large active rail node, and reduced marker text treatment from the user render.
15. 2026-04-30 23:09:47: Marked `Edit-History-Workspace-4 / Phase 6` shipped after scrub preview state split into continuous `dragPercent` handle motion and snapped `previewMarkerIndex` card placement, with release-time canonical commits, focused reader tests, and TypeScript verification.
14. 2026-04-30 23:07:21: Added `Edit-History-Workspace-4 / Phase 6` as the smooth scrub handle follow-up so the marker button can move continuously under the pointer while the current-position card preview snaps to the nearest discrete history slot.
13. 2026-04-30 22:58:03: Recorded the Phase 5 scrub rail alignment follow-up after the rail stopped stretching to the full panel height and began using rendered card slots so the handle lines up with the middle of the current-position card.
12. 2026-04-30 22:54:23: Marked `Edit-History-Workspace-4 / Phase 5` shipped after the Timeline scrub rail gained draggable preview state, marker-card and rail drag starts, pointer-id guarded preview movement, cancel no-op behavior, release-time canonical undo/redo commits, focused reader tests, and TypeScript build verification.
11. 2026-04-30 22:51:14: Prepped `Edit-History-Workspace-4 / Phase 5` into an implementation-ready draggable scrub release slice with pointer capture, preview marker state, rail coordinate reuse, release-time canonical commits, cancel behavior, styling expectations, and focused no-live-mutation tests.
10. 2026-04-30 22:47:10: Marked `Edit-History-Workspace-4 / Phase 4` shipped after adding the Timeline vertical scrub rail, discrete marker handle positioning, rail click-to-marker jump routing through canonical undo/redo, focused reader-surface tests, and TypeScript build verification.
9. 2026-04-30 22:44:38: Prepped `Edit-History-Workspace-4 / Phase 4` into an implementation-ready vertical scrub rail slice with discrete marker math, rail click semantics, file targets, accessibility requirements, focused tests, and explicit no-drag boundaries for Phase 5.
8. 2026-04-30 22:41:38: Added Phase 4 and Phase 5 to cover the vertical scrub rail direction, splitting the work into a rail/click-target pass and a draggable current-position card/handle pass that previews during drag and commits through canonical undo/redo on release.
7. 2026-04-30 22:28:54: Marked `Edit-History-Workspace-4 / Phase 3` shipped after timeline row clicks gained canonical undo/redo jump routing, with applied rows jumping backward, redoable rows jumping forward, marker clicks remaining no-op, focused multi-step reader tests, and TypeScript build verification.
6. 2026-04-30 22:23:36: Prepped `Edit-History-Workspace-4 / Phase 3` as the marker jump-routing implementation slice, locking target marker index semantics, canonical undo/redo step calculation, guarded execution loops, failure boundaries, file targets, and focused verification.
5. 2026-04-30 22:22:22: Marked `Edit-History-Workspace-4 / Phase 2` shipped after adding the default Timeline tab, visible current-position marker row, applied and redoable row treatments, marker inspector state, focused reader surface tests, and TypeScript build verification while leaving jump execution deferred to Phase 3.
4. 2026-04-30 22:16:51: Prepped `Edit-History-Workspace-4 / Phase 2` as the visible timeline UI slice, grounding it in the shipped Phase 1 reader model and locking file targets, display rules, selection behavior, source filtering behavior, tests, and no-jump boundaries.
3. 2026-04-30 22:15:23: Marked `Edit-History-Workspace-4 / Phase 1` shipped after adding the unified timeline reader model with applied/redoable classification, marker index counts, redo execution ordering, focused view-model tests, existing reader/store regression proof, and TypeScript build verification.
2. 2026-04-30 22:11:53: Renamed remaining planning identifiers to `Edit-History-Workspace-4` and tightened Phase 1 into an implementation-ready read-model spec with file targets, output shape, ordering rules, and verification gates.
1. 2026-04-30 22:09:49: Created this future phase doc to capture the unified history timeline and marker direction for the Edit History workspace reader.

### Purpose

This doc defines a future implementation lane for making the Edit History workspace show one chronological history timeline with a visible current-position marker.

Use it to answer:
- how Undo and Redo entries should be shown as one list
- what the history marker means
- how marker jumps should route through canonical undo/redo
- what the first implementation should avoid

## Doc Body

### Phase Summary

The Edit History workspace should not permanently force users to compare two separate lists.

It should be able to show one timeline:
- applied entries
- a visible `current history marker`
- redoable entries after the marker

The marker answers:
- where am I in time?
- what is already applied?
- what can be redone?
- what would happen if I jump to this point?

The vertical scrub rail should make the same marker feel like a handle on a real timeline:
- the rail is not the browser/list scrollbar
- the current-position card is attached to the rail
- dragging the marker previews the destination while the pointer moves
- releasing the marker commits the target through canonical undo/redo calls

### Phase Implementation Spec

Build the first version as a reader and navigation surface over the canonical owner.

Required behavior:
- derive one ordered timeline from the public undo and redo entries
- show applied entries and redoable entries in one list
- show a marker row between the two regions
- make each row visibly classify as applied or redoable
- allow the user to choose a target point
- execute the needed undo/redo steps through `editHistoryStore`
- add a vertical scrub rail once the basic timeline and click target behavior exists

Recommended first interaction:
- click a marker target or release a dragged marker to jump
- do not execute live while the marker is still being dragged
- show the destination before executing if the jump crosses multiple entries

Important implementation boundary:
- the marker is not a separate history owner
- the timeline does not serialize private undo/redo payloads
- jumps are repeated canonical undo/redo calls, not direct state mutation

### Acceptance Read

The phase is successful when:
- the user can see one combined chronological history list
- the current state is represented by a visible marker
- applied versus redoable entries are visually distinct
- selecting a target point moves the marker by performing canonical undo/redo
- existing Undo and Redo buttons still behave normally
- snapshot activity remains an activity log, not the primary timeline or a source of undoable marker movement

### Open Questions

- Should the vertical rail behave like a slider, a scrollbar, or both?
- Should large jumps ask for confirmation?
- Should the marker support keyboard movement?
- Should local uncommitted histories appear in the same timeline, or stay as separate pending sections until commit?

### Non-Goals

- No checkpoint storage.
- No branch graph UI.
- No private payload inspection.
- No history persistence redesign.
- No live scrub execution in the first scrub pass.
- No treating the visual rail as a second history owner.

## Wishlist Organization

### High Level Goals

- [ ] `Edit-History-Workspace-Gen1-HLG-5` `Show one chronological history timeline with a clear marker for the current applied point in time.`

### `Edit-History-Workspace-4`

- [x] `Edit-History-Workspace-Gen1-HLG-5` Derive a combined public timeline model from canonical undo and redo entries.
- [x] Render a visible current-position marker between applied and redoable entries.
- [x] Add target selection for marker jumps.
- [x] Route marker jumps through canonical undo/redo execution.
- [x] Add a vertical scrub rail tied to the current-position marker.
- [x] Let the current-position card/handle drag along the rail and commit on release.
- [x] Let the scrub handle move fluidly while the current-position card preview snaps discretely.
- [x] Render the current-position marker as a compact row connected to the vertical rail.
- [x] Restyle the vertical scrub rail as a thin timeline line with inactive entry dots and a large active marker node.
- [ ] Add expandable timeline group cards for canonical entries that can expose read-only child summaries.
- [ ] Store public Sketch Draw commit child summaries so expanded committed sketch entries can show their sub-commands.
- [ ] Let the scrub marker preview and select expanded Sketch Draw child-summary rows as virtual read-only stops without changing canonical undo/redo ownership.
- [ ] Treat the Timeline scrub list as the canonical undo/redo projection instead of a separate snapshot/visited-position list.
- [ ] Make moving the current-position marker equivalent to executing the required canonical Undo/Redo steps, with no marker-move history entry.
- [ ] Keep snapshot activity diagnostic-only so it cannot affect the next Ctrl+Z/Ctrl+Y target.
- [ ] Reconcile expanded child rows with canonical scrub semantics before adding true partial restore behavior.
- [ ] Add true partial Sketch Draw commit restore only after child restore-point data exists on the parent entry.
- [ ] Keep private payloads, checkpoint storage, and branch graphs out of scope.

## [x] `Edit-History-Workspace-4 / Phase 1` - `Timeline Read Model`

### Phase 1 Summary

Create the combined public timeline model without changing runtime behavior.

Phase 1 is a data/model prep slice only. It should make the reader able to ask for one combined timeline while leaving the UI mostly unchanged and leaving marker jumps for later phases.

### Phase 1 Implementation Spec

#### Scope

Implement the unified timeline read model in the reader layer.

Primary file targets:
- `src/app/store/editHistoryReaderViewModel.ts`
- `src/app/store/editHistoryStore.test.ts` only if the store snapshot needs a small public metadata assertion
- a new or existing focused reader-view-model test file if one exists, otherwise use `src/app/workspace/EditHistoryReaderSurface.test.tsx` only for minimal integration proof

Phase 1 should not change:
- edit-history mutation behavior
- `editHistoryStore.undo()` / `redo()` semantics
- reader tab layout
- marker jump execution
- snapshot payload ownership

#### Timeline Model Shape

Add a public reader model shaped roughly like:

```ts
type EditHistoryReaderTimelineEntryModel = {
  entryId: string
  label: string
  side: 'applied' | 'redoable'
  timelineIndex: number
  sourceSurface: string
  sourceId: string | null
  sourceLabel: string | null
  targetId: string | null
  targetLabel: string | null
  timestamp: string | null
  transactionId: string | null
  coalesceKey: string | null
}

type EditHistoryReaderTimelineModel = {
  entries: EditHistoryReaderTimelineEntryModel[]
  markerIndex: number
  appliedCount: number
  redoableCount: number
}
```

Naming can adjust to fit existing code style, but the model must expose:
- a single ordered row list
- a marker index
- applied versus redoable row classification
- the same public metadata already available to Undo/Redo stack rows

#### Ordering Rule

The timeline should read as chronological applied history followed by redoable future history.

Required order:
- `snapshot.undoEntries` stay in their existing oldest-to-newest order
- `snapshot.redoEntries` must be reversed for timeline display so the next redoable entry appears first after the marker
- `markerIndex` equals the number of applied undo entries

Example:

```text
undoEntries: [A, B]
redoEntries: [D, C]

timeline entries:
1. A applied
2. B applied
-- markerIndex 2 --
3. C redoable
4. D redoable
```

Reason:
- the redo stack internally keeps the next redo at the end
- the timeline should display redoable entries in the order they would be re-applied

#### Acceptance Checks

- Empty history returns `entries: []`, `markerIndex: 0`, `appliedCount: 0`, and `redoableCount: 0`.
- Committed-only history returns all rows as `applied` and marker at the end.
- Undoing one or more entries keeps the same public row metadata visible while moving those entries to the `redoable` side.
- Redoable rows display in redo execution order.
- The read model does not expose undo/redo functions or private payload data.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/store/editHistoryStore.test.ts src/app/workspace/EditHistoryReaderSurface.test.tsx
node_modules\.bin\tsc.cmd -b
```

If a new focused reader-view-model test file is added, include it in the Vitest command.

#### Phase 1 Completion Evidence

Implemented:
- `src/app/store/editHistoryReaderViewModel.ts` now exposes `timeline` on the full reader model.
- `createEditHistoryReaderTimelineModel()` derives one public ordered row list from canonical undo and redo entries.
- Timeline rows expose `side`, `timelineIndex`, and the same public metadata as existing Undo/Redo stack rows.
- Redoable rows are displayed in redo execution order while leaving canonical stack storage unchanged.
- Private undo/redo functions and payload data remain excluded from the reader model.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 2` - `Timeline UI`

### Phase 2 Summary

Render the unified timeline and marker in the Edit History workspace.

Phase 2 is a reader UI slice only. It should let the user see canonical history as one applied/marker/redoable timeline, but it should not make the marker draggable, clickable as a jump target, or execute multi-step undo/redo jumps yet.

### Phase 2 Implementation Spec

#### Scope

Implement the first visible timeline view in the existing Edit History workspace surface.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/store/editHistoryReaderViewModel.ts` only if a tiny display helper is needed

Phase 2 should not change:
- `editHistoryStore` mutation behavior
- `editHistoryStore.undo()` / `redo()` semantics
- timeline ordering rules from Phase 1
- marker jump execution
- snapshot log ownership
- Sketch Draw pending/local-history ownership

#### Current Live Read

The current workspace surface has:
- stack tabs for `Undo`, `Redo`, and `Sketch Draw`
- source filtering scoped to the active Undo/Redo stack
- a selected-entry inspector that reads public metadata only
- a snapshot activity log in the inspector
- optional Undo and Redo action buttons that already call the canonical store
- a pending `Sketch Draw changes` row in the Undo view that routes to the Sketch Draw tab

Phase 1 added:
- `model.timeline.entries`
- `model.timeline.markerIndex`
- `model.timeline.appliedCount`
- `model.timeline.redoableCount`
- `entry.side`
- `entry.timelineIndex`

#### First Pass Decisions

Use one new timeline tab in the same tab strip:

```text
Timeline (N)
Undo (N)
Redo (N)
Sketch Draw (N)
```

Default the active tab to `Timeline` so a fresh Edit History workspace leads with the combined mental model.

Timeline rows should render in `model.timeline.entries` order:
- all `applied` rows above the marker
- one marker row at `model.timeline.markerIndex`
- all `redoable` rows below the marker

The marker row should be visible even when history is empty:

```text
Current position
0 applied / 0 redoable
```

Suggested row labels:
- Applied rows: `Applied`
- Redoable rows: `Redoable`
- Marker row: `Current position`

Selection behavior:
- selecting a timeline row should populate the existing inspector with that row's public metadata
- selecting the marker row should show marker metadata in the inspector rather than pretending it is a history entry
- marker selection must not call undo or redo

Source filtering:
- source filters should work on timeline history rows and ignore the marker row
- if a filter hides all rows on one side, the marker should still render in its correct current-position place for the filtered view
- if this becomes too wide for Phase 2, preserve source filtering for the existing Undo/Redo tabs and leave the Timeline tab unfiltered, but record that choice explicitly in the changelog

Sketch Draw pending behavior:
- keep uncommitted Sketch Draw local history out of `model.timeline`
- keep the existing `Sketch Draw changes` pending row in the Undo tab
- optionally show a small pending Sketch Draw notice near the Timeline list, but do not place it into the canonical marker timeline as a fake entry

#### Visual Contract

Use dense workspace-reader styling, not a marketing or dashboard card treatment.

The timeline list should:
- fit inside the existing reader body
- scroll as a list when entries overflow
- use a stable marker row height
- visually separate applied rows, marker row, and redoable rows
- keep entry labels, source/target summaries, and timestamps from overflowing their row
- keep source filters and action buttons usable in narrow workspace hosts

The marker can be a row, rail notch, or row plus rail in Phase 2. Prefer the smallest implementation that makes the current position obvious and testable.

#### Checklist

- [ ] Add a `timeline` tab key to `EditHistoryReaderSurface`.
- [ ] Default the reader to the `Timeline` tab.
- [ ] Render `model.timeline.entries` in one list with `Applied` and `Redoable` row states.
- [ ] Render one visible `Current position` marker row at `model.timeline.markerIndex`.
- [ ] Keep the marker row non-mutating and non-jumping.
- [ ] Let selected timeline history rows reuse the existing public metadata inspector.
- [ ] Show marker-specific inspector content when the marker row is selected.
- [ ] Preserve existing Undo and Redo tabs, action buttons, source metadata reads, snapshot log, and Sketch Draw tab behavior.
- [ ] Add CSS for timeline rows, marker row, and side states.
- [ ] Add reader surface tests for default Timeline tab, marker placement, applied/redoable labels, no private payload exposure, and no undo/redo execution from selecting the marker.

#### Acceptance Checks

- Empty history opens to `Timeline (0)` and shows the `Current position` marker with `0 applied / 0 redoable`.
- Committed-only history shows all entries above the marker and the marker at the end.
- After undoing one or more entries, the timeline shows applied entries above the marker and redoable entries below it in redo execution order.
- The marker row is visible and selectable but does not execute undo/redo.
- Undo and Redo tabs still show their separate stack lists.
- Existing Undo and Redo buttons still behave normally.
- Snapshot activity remains an activity log, not the primary timeline.
- Active Sketch Draw local history remains visibly pending/local, not canonical timeline history.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 2 Completion Evidence

Implemented:
- `EditHistoryReaderSurface` now opens on a default `Timeline (N)` tab.
- Timeline rows render applied entries above the `Current position` marker and redoable entries below it.
- The marker row remains visible for empty history and shows applied/redoable counts plus the marker index.
- Selecting a timeline history row reuses the public metadata inspector.
- Selecting the marker row shows read-only marker metadata and does not execute undo or redo.
- Existing Undo, Redo, Sketch Draw, snapshot activity, and canonical action-button behavior remain available.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 4` - `Vertical Scrub Rail And Click Targets`

### Phase 4 Summary

Add a visible vertical scrub rail beside the Timeline list and tie the current-position card to that rail.

Phase 4 should make the timeline feel like one continuous control without introducing drag yet. The rail should expose discrete marker positions from `0` through `model.timeline.entries.length`, and clicking the rail should jump to the nearest marker index using the existing canonical Phase 3 jump path.

### Phase 4 Implementation Spec

#### Scope

Implement the rail as a visual and click-target layer inside the existing Edit History workspace Timeline tab.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`

Phase 4 should not change:
- edit-history stack ownership
- Phase 1 timeline ordering
- Phase 3 canonical jump execution
- drag behavior
- live scrub behavior
- Sketch Draw local history ownership

#### Rail Contract

The rail should:
- live in the Timeline tab only
- sit inside the timeline column beside the entry rows, not inside the inspector
- span the visible timeline list region
- expose one current-position handle attached to the marker card
- visually connect applied entries, marker position, and redoable entries
- use discrete marker indices, not pixel-continuous state
- expose an accessible click target labelled `Timeline scrub rail`

The rail is a history-position control, not a scroll bar.

Implementation shape:
- wrap the Timeline list and rail in a small layout container, for example `EditHistoryReaderTimelineScrub`.
- keep the current-position card rendered in the timeline list so the row remains readable, focusable, and testable.
- add a rail handle or notch whose position is derived from `model.timeline.markerIndex`.
- calculate handle position with:

```ts
const denominator = Math.max(model.timeline.entries.length, 1)
const markerPercent = (model.timeline.markerIndex / denominator) * 100
```

Empty history should therefore render the handle at `0%` and keep marker index `0`.

#### Click Target Semantics

Clicking the rail should:
- map the pointer `clientY` to the nearest discrete `targetMarkerIndex`
- clamp target marker index to `0..model.timeline.entries.length`
- call the existing canonical jump helper from Phase 3
- keep the Timeline tab active

The current-position card should still render as a marker row. Phase 4 may keep it in the list flow or position it visually beside the rail, as long as the marker remains readable and testable.

Use the rail element's `getBoundingClientRect()` for pointer mapping:

```ts
const normalized = (clientY - railTop) / railHeight
const clamped = Math.min(1, Math.max(0, normalized))
const targetMarkerIndex = Math.round(clamped * model.timeline.entries.length)
```

If `model.timeline.entries.length === 0`, clicking the rail should select or retain the marker view and perform no undo/redo.

Phase 4 should reuse the existing Phase 3 `jumpToTimelineMarkerIndex` path. It should not introduce direct stack mutation, new history state, pointer capture, pointer move handling, or drag preview state.

Rail click handling may call `event.preventDefault()` and `event.stopPropagation()` if needed to avoid selecting neighboring rows. Normal timeline row clicks from Phase 3 must keep working.

#### Implementation Checklist

- Add a Timeline-only scrub container around the current timeline entry list.
- Add a vertical rail element with `aria-label="Timeline scrub rail"`.
- Add a visual handle/notch positioned from the current `markerIndex`.
- Add a small pointer-to-marker-index helper inside `EditHistoryReaderSurface.tsx` unless the component already has an obvious local helper home.
- Wire rail clicks to the existing canonical marker jump helper.
- Keep marker row clicks as the existing no-op marker selection behavior.
- Preserve applied-row and redoable-row click-to-jump behavior from Phase 3.
- Add CSS for the rail, handle, active marker state, and list spacing without turning the rail into the browser/list scrollbar.
- Add focused reader-surface tests for visible rail, undo jump by rail click, redo jump by rail click, empty-history no-op, and row-click regression.

#### Acceptance Checks

- Empty history still shows the rail and marker at index `0`.
- With multiple entries, the rail handle position reflects `model.timeline.markerIndex`.
- Clicking above the current marker can trigger canonical undo jumps.
- Clicking below the current marker can trigger canonical redo jumps.
- Clicking the current marker position is a no-op.
- Dragging the rail or handle is not implemented in Phase 4.
- Pointer move events do not mutate history in Phase 4.
- The rail does not affect normal list scrolling.
- Undo, Redo, Sketch Draw, and snapshot log behavior remain intact.

#### Phase 4 Done Shape

The Timeline tab shows a vertical rail and current-position handle tied to the existing marker. Clicking the rail jumps to the nearest discrete history marker through canonical undo/redo calls. The current-position card remains readable, and drag-to-scrub remains untouched for Phase 5.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 4 Completion Evidence

Implemented:
- `EditHistoryReaderSurface` now renders a Timeline-only vertical scrub rail beside the timeline row list.
- The rail handle is positioned from the canonical timeline marker index using the discrete `0..entries.length` marker range.
- Rail clicks map pointer `clientY` through the rail bounding rect to the nearest marker index.
- Rail jumps reuse the existing Phase 3 canonical `editHistoryStore.undo()` / `editHistoryStore.redo()` path.
- Empty history rail clicks remain marker no-ops.
- Timeline row click behavior from Phase 3 remains intact.
- Drag, pointer capture, pointer move preview, checkpoint storage, branch graphs, and private payload reads remain out of scope.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 5` - `Draggable Marker Scrub Release`

### Phase 5 Summary

Make the current-position card/handle draggable along the vertical scrub rail.

Phase 5 should preview the destination while the user drags and execute the canonical jump only when the pointer is released. This keeps history mutation stable while still giving the user a scrubber-like control.

### Phase 5 Implementation Spec

#### Scope

Implement pointer drag behavior for the marker card and rail handle.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`

Phase 5 should not change:
- canonical undo/redo semantics
- Phase 4 rail click behavior
- source filtering ownership
- snapshot storage
- checkpoint or branch behavior
- live undo/redo while dragging
- timeline ordering
- Sketch Draw local history ownership

#### Drag Contract

Use local UI state only for preview:
- `isScrubbing`
- `previewMarkerIndex`
- `scrubPointerId`

Pointer behavior:
- pointer down on marker card or rail handle starts scrub
- pointer move updates `previewMarkerIndex`
- pointer up commits the preview marker index through the Phase 3 canonical jump helper
- pointer cancel clears preview without committing

Use pointer capture on the rail/handle drag origin so the release can be completed even when the pointer leaves the narrow rail. Release pointer capture during pointer up and pointer cancel.

Pointer down should:
- call `event.preventDefault()`
- stop propagation if needed to avoid row selection competing with scrub start
- initialize `previewMarkerIndex` from the current marker index or the pointer position
- mark `isScrubbing` true
- capture `event.pointerId`

Pointer move should:
- ignore moves from other pointers
- reuse the same rail coordinate mapping as Phase 4
- update `previewMarkerIndex`
- not call `editHistoryStore.undo()` or `editHistoryStore.redo()`

Pointer up should:
- ignore releases from other pointers
- resolve the final preview marker index
- clear scrub preview state
- commit through the existing Phase 3 `jumpToTimelineMarkerIndex` helper

Pointer cancel should:
- clear scrub preview state
- release pointer capture if held
- not mutate history

The preview should:
- show where the marker will land
- keep the current-position card visually tied to the rail
- not call undo/redo until release
- show enough visual distinction that the user can tell preview position from committed position

Implementation direction:
- Reuse or rename the Phase 4 `resolveTimelineRailTargetMarkerIndex` helper for both click and pointer move.
- Derive the displayed handle index from `previewMarkerIndex` while scrubbing, otherwise `model.timeline.markerIndex`.
- Derive the displayed handle percent from the displayed handle index, not directly from the committed marker index.
- Add a class such as `isScrubbing` to the rail or scrub wrapper while previewing.
- Add `data-preview-marker-index` only if it helps tests stay behavior-focused; avoid leaking private payloads.
- Keep the current-position card in normal list flow. Phase 5 may make the marker card itself a drag start target, but it should not move the actual card out of the timeline list.
- Keep rail clicks from Phase 4 working when no drag starts.

#### Implementation Checklist

- Add scrub preview state to `EditHistoryReaderSurface`.
- Add pointer handlers for rail handle and current-position marker drag start.
- Add pointer move, pointer up, and pointer cancel handling with pointer-id guards.
- Reuse the rail rect mapping for preview target marker index.
- Display the handle at the preview marker position while scrubbing.
- Commit only once on pointer up by calling the canonical marker jump helper.
- Clear preview state after pointer up or pointer cancel.
- Add CSS for active drag/preview state without making the control look like a browser scrollbar.
- Add focused tests for upward drag, downward drag, no mutation during pointer move, release no-op at the same index, pointer cancel no mutation, and Phase 4 click regression.

#### Acceptance Checks

- Dragging the marker upward previews lower marker indices and commits canonical undo calls on release.
- Dragging the marker downward previews higher marker indices and commits canonical redo calls on release.
- Releasing at the current index is a no-op.
- Pointer cancel does not mutate history.
- The Timeline tab stays active after scrub release.
- Snapshot activity records only the canonical undo/redo calls that happen on release.
- No live scrub execution happens during pointer move.
- Existing rail click behavior still works without a drag.
- Timeline row click behavior still works without a drag.
- Empty-history drag start and release remain no-op marker selection.

#### Phase 5 Done Shape

The user can grab the current-position marker handle or marker card, drag it along the vertical rail to preview a target point in history, and release to commit exactly one canonical jump sequence. The preview is local UI state only; the canonical stacks do not change until release.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 5 Completion Evidence

Implemented:
- `EditHistoryReaderSurface` now keeps local scrub preview state while a pointer drag is active.
- The current-position marker card and Timeline scrub rail both start preview scrubs.
- Pointer move updates the rail handle preview using the same rail coordinate mapping as Phase 4.
- Pointer move does not call canonical undo/redo.
- Pointer up clears preview state and commits one canonical marker jump through the existing undo/redo path.
- Pointer cancel clears preview state without mutating history.
- Same-index scrub release remains a no-op.
- Drag preview styling distinguishes the preview handle from the committed marker position.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

Follow-up alignment repair:
- The rail now measures the rendered timeline list content height instead of stretching to the full panel.
- The handle position uses rendered card slots, so the marker sits at the center of the current-position card slot.
- Rail click and drag target mapping now uses the same card-slot coordinate system.
- Focused reader tests were updated for center-slot handle positions.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 6` - `Smooth Scrub Handle With Snapped Preview`

### Phase 6 Summary

Make the scrub handle move fluidly under the pointer while keeping the history target discrete.

Phase 5 made drag-to-preview safe, but the handle currently derives from the snapped `previewMarkerIndex`, so it can visually jump from card slot to card slot. Phase 6 should separate the continuous visual handle position from the discrete history preview target:
- the handle follows the pointer smoothly
- the current-position card preview snaps to the nearest history slot
- canonical undo/redo still happens only on release

### Phase 6 Implementation Spec

#### Scope

Implement a visual smoothing layer for active Timeline scrub drags.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`

Phase 6 should not change:
- canonical undo/redo semantics
- Phase 5 commit-on-release behavior
- pointer cancel no-op behavior
- timeline ordering
- source filtering
- snapshot storage
- checkpoint or branch behavior
- Sketch Draw local history ownership

#### Interaction Contract

Extend the scrub preview state from a snapped-only model to a continuous-plus-discrete model:

```ts
type TimelineScrubPreviewState = {
  pointerId: number
  previewMarkerIndex: number
  dragPercent: number
}
```

Meaning:
- `dragPercent` is the continuous clamped visual position from `0..100`.
- `previewMarkerIndex` is the nearest discrete card-slot target.

While scrubbing:
- the rail handle should render from `dragPercent`
- the current-position card/preview selection should render from `previewMarkerIndex`
- pointer move should update both values
- pointer move should not call `editHistoryStore.undo()` or `editHistoryStore.redo()`

When not scrubbing:
- the handle should render at the committed marker slot center, as Phase 5 does now.

Pointer up should:
- commit `previewMarkerIndex`, not the raw `dragPercent`
- clear scrub preview state
- keep the Timeline tab active

Pointer cancel should:
- clear scrub preview state
- leave canonical history unchanged

#### Coordinate Helpers

Prefer two small helpers over mixing the math inline:
- one helper resolves continuous `dragPercent` from rail rect and `clientY`
- one helper resolves snapped `previewMarkerIndex` from the same normalized position/card-slot model

Both helpers should clamp out-of-bounds pointer positions.

#### Styling Direction

- Do not animate the handle while actively dragging; it should stay under the pointer.
- A short transition after release/cancel is acceptable if it does not lag during drag.
- Keep the blue/dark-mode Phase 5 rail theme.
- Preserve the card-slot rail height and center alignment from the Phase 5 alignment repair.

#### Acceptance Checks

- Dragging within a slot moves the handle continuously without changing canonical history.
- The snapped preview marker index changes only when the pointer crosses the nearest-slot threshold.
- Releasing commits the snapped preview marker index through canonical undo/redo.
- Pointer cancel clears the continuous handle preview without mutating history.
- Rail click behavior still jumps discretely.
- Current-position marker card remains readable and aligned to the snapped preview slot.
- The handle does not lag behind the pointer during active drag.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 6 Completion Evidence

Implemented:
- `TimelineScrubPreviewState` now stores both `previewMarkerIndex` and continuous `dragPercent`.
- Active drags render the scrub handle from `dragPercent` so it follows the pointer smoothly.
- The current-position card and target preview still snap through `previewMarkerIndex`.
- Pointer move remains preview-only and does not mutate canonical history.
- Pointer up commits the snapped preview marker index through the existing canonical undo/redo path.
- Rail clicks remain discrete.
- Reader-surface tests now cover continuous handle movement inside a snapped preview slot.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 7` - `Compact Current Position Marker Row`

### Phase 7 Summary

Make the `Current position` timeline marker feel like a compact scrubber position row instead of a full history entry card.

The user render shows:
- the current-position row is shorter than normal history cards
- the row keeps only essential text
- the row connects horizontally to the vertical rail
- the active rail node is larger and blue
- inactive rail points are smaller and muted
- applied and redoable history cards stay full-height

Phase 7 should be a visual/markup polish pass over the shipped Phase 6 behavior. It should not change undo/redo execution, scrub target math, or history ownership.

### Phase 7 Implementation Spec

#### Scope

Update the Timeline marker row treatment inside the Edit History workspace.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`

Phase 7 should not change:
- canonical undo/redo semantics
- rail click behavior
- drag preview behavior
- continuous `dragPercent` handle motion
- snapped `previewMarkerIndex` card placement
- timeline ordering
- snapshot log behavior
- source filtering
- Sketch Draw local history ownership

#### Visual Contract

The current-position row should:
- be visibly shorter than normal history event cards
- render as a blue selected marker row
- show a small icon/handle glyph on the left
- show `Current position`
- show `Marker index N` on the right
- stop showing `N applied / M redoable` in the row itself
- keep fuller marker detail in the inspector

Rail connection:
- add a short horizontal connector from the active rail node to the marker row
- align the connector to the vertical center of the compact marker row
- make the active rail node larger and blue
- keep non-active rail ticks/dots smaller and muted if they are rendered
- keep the rail height/card-slot alignment from Phase 5

#### Implementation Direction

- Keep the existing marker row in the timeline list flow.
- Prefer CSS pseudo-elements or a small child span for the connector instead of adding a new history owner concept.
- Add marker-row classes that do not affect applied/redoable entry card styles.
- Keep marker row pointer handlers wired to the existing scrub drag path.
- Preserve the inspector's existing `Marker index`, `Applied entries`, and `Redoable entries` details.

#### Current Live Read

The current marker row renders as a normal timeline button:
- `strong` text: `Current position`
- count text: `N applied / M redoable`
- index text: `Marker index N`

Phase 7 should replace only that marker row presentation. The rail, click jump, drag preview, continuous handle motion, and inspector details should remain wired to the same state and handlers.

#### Markup Shape

Use a compact internal row shape such as:

```tsx
<button className="EditHistoryReaderTimelineMarker EditHistoryReaderTimelineMarker--compact">
  <span className="EditHistoryReaderTimelineMarkerGrip" aria-hidden="true">...</span>
  <strong>Current position</strong>
  <span className="EditHistoryReaderTimelineMarkerIndex">Marker index {index}</span>
</button>
```

Implementation notes:
- The grip can be three small horizontal bars, a simple icon-like text glyph, or a CSS-only pseudo-element.
- Do not introduce an icon dependency for this phase unless the existing workspace already imports one nearby.
- Do not move marker details out of the inspector.
- Do not render `N applied / M redoable` inside the marker row after this phase.

#### CSS Shape

Use the existing marker class as the base and add a compact modifier.

Target styling:
- `min-height` near `44px` to `52px`, clearly shorter than normal history cards.
- grid/flex layout with left grip, middle title, right marker-index text.
- blue border/background consistent with the current dark blue rail theme.
- compact row text must fit on narrow timeline columns without overlapping.
- use `position: relative` on the marker row if a connector pseudo-element is used.

Connector strategy:
- Prefer `.EditHistoryReaderTimelineMarker--compact::before` or `::after` for the short horizontal connector.
- Position it from the marker row's vertical center.
- Extend it left toward the rail without covering text.
- Keep `pointer-events: none`.
- Keep the connector purely visual; it must not become another click or drag target.

Rail node treatment:
- If the current rail handle already provides the active node, restyle it to read as the large blue active node in the render.
- If a separate connector/node child is needed, keep it local to the marker/rail presentation and do not create new state.
- Non-active rail ticks/dots are optional in Phase 7; do not add them if they require new per-entry rail geometry.

#### Test Plan

Add or update focused reader-surface tests to prove:
- the marker row still renders `Current position`.
- the marker row renders `Marker index N`.
- the marker row no longer renders `N applied / M redoable`.
- the inspector still renders `Applied entries`, `Redoable entries`, and `Read only marker`.
- marker-row drag preview still works after the markup change.
- rail click and discrete row-click jump tests still pass.

#### Acceptance Checks

- The marker row renders `Current position` and `Marker index N`.
- The marker row no longer renders `N applied / M redoable`.
- The inspector still renders marker index, applied entries, redoable entries, and read-only status.
- The compact marker row can still start a scrub drag.
- The rail handle remains aligned to the marker row center.
- Rail click and drag behavior from Phase 6 still pass.
- Applied and redoable timeline cards remain full entry cards.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 7 Completion Evidence

Implemented:
- The timeline marker row now uses a compact internal layout with a left grip, `Current position`, and right-aligned `Marker index N`.
- The marker row no longer renders `N applied / M redoable` inside the timeline lane.
- The marker inspector keeps `Marker index`, `Applied entries`, `Redoable entries`, and read-only status.
- The compact marker row visually connects to the scrub rail with a horizontal blue connector.
- The active rail node now reads as a larger blue circular marker while keeping the existing smooth drag positioning.
- Applied and redoable timeline entries remain full history cards.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 8` - `Thin Timeline Rail And Entry Dots`

### Phase 8 Summary

Restyle the Timeline scrub rail so it reads like the reference image's timeline structure instead of a thick scrollbar-like control.

The current compact marker row from Phase 7 is good. Phase 8 should focus on the vertical rail itself:
- a thin muted vertical line
- small inactive dots aligned to history card centers
- one large active blue marker node aligned to the current-position row
- a short connector from the active node to the compact marker row
- a wider invisible hit area so click and drag remain easy

This is a visual and markup polish pass over the shipped Phase 7 interaction. It should not change undo/redo execution, scrub target math, timeline ownership, or the compact marker row's information shape.

### Phase 8 Implementation Spec

#### Scope

Update the Timeline scrub rail presentation inside the Edit History workspace.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`

Phase 8 should not change:
- canonical undo/redo semantics
- rail click behavior
- marker drag preview behavior
- continuous `dragPercent` handle motion
- snapped `previewMarkerIndex` card placement
- marker row compact text
- timeline ordering
- snapshot log behavior
- source filtering
- Sketch Draw local history ownership

#### Reference Details Extracted

The reference rail reads as:
- one thin vertical line, not a filled pill track
- muted gray-blue, low contrast, roughly `2px` to `3px` visually
- line starts near the first visible timeline card center and ends around the last visible card center
- inactive history points are small circular dots centered on the line
- inactive dots are light gray with a subtle border or shadow
- each inactive dot aligns to the vertical center of its matching history card
- the current-position node is much larger than inactive dots
- the active node is blue with an outer ring and inner filled circle
- the active node overlaps the rail and visually connects into the marker row
- a short blue horizontal connector runs from the active node to the compact marker row
- the rail continues through the current node so the marker feels embedded in one continuous timeline
- the visible rail must not look like the browser/list scrollbar

#### Implementation Direction

Keep the current rail button as the accessible and draggable hit target, but make its visible rail treatment thinner.

Recommended structure:
- keep `EditHistoryReaderTimelineRail` as the wide invisible pointer target
- render the visible line with `.EditHistoryReaderTimelineRail::before`
- render inactive dots as children inside the rail button before the active handle
- derive dot elements from the currently visible timeline entries, not from a separate store read
- position dots using the same slot-center math as the current marker
- keep the active node as the existing `.EditHistoryReaderTimelineRailHandle`
- keep the active node position driven by `timelineMarkerPercent`
- keep the compact marker connector on `.EditHistoryReaderTimelineMarker--compact::before` unless implementation proves the handle-owned connector aligns more cleanly

Do not introduce:
- a second timeline state owner
- separate persisted marker positions
- checkpoint/branch concepts
- live scrub execution
- scroll synchronization with the browser/list scrollbar

#### Live Implementation Read

The current live surface already has the right state and event seams:
- `timelineRailRef` points at the rail button.
- `timelineRailHeight` measures the rendered timeline list height.
- `timelineMarkerPercent` drives the active handle `top`.
- `handleTimelineRailClick` handles discrete rail jumps.
- `handleTimelineScrubPointerDown`, `handleTimelineScrubPointerMove`, `handleTimelineScrubPointerUp`, and `handleTimelineScrubPointerCancel` already support rail and marker drag.
- `appliedTimelineEntries` and `redoableTimelineEntries` are the visible filtered card rows around the marker.

Phase 8 should reuse those seams.

Add a small local render helper or inline map for visible rail dots:

```tsx
const timelineRailDots = filteredTimelineEntries.map((entry) => ({
  entryId: entry.entryId,
  percent: ((entry.timelineIndex + 0.5) / timelineRenderedSlotCount) * 100,
}))
```

Then render inside `EditHistoryReaderTimelineRail`:

```tsx
{timelineRailDots.map((dot) => (
  <span
    key={dot.entryId}
    className="EditHistoryReaderTimelineRailDot"
    style={{ top: `${dot.percent}%` }}
    aria-hidden="true"
  />
))}
<span className="EditHistoryReaderTimelineRailHandle" ... />
```

Notes:
- Keep dots `aria-hidden`.
- Keep dots `pointer-events: none`.
- Do not make dots their own buttons in this phase.
- Do not attach row-click semantics to dots in this phase.
- If a dot sits under the current active handle, the larger handle can visually cover it; no special state is required unless overlap looks noisy.

#### Dot Alignment Contract

Each rendered timeline entry should have one inactive dot when it is not the current marker.

Dot position should align to card-slot centers:
- entry index `0` aligns to slot center `0.5 / (entryCount + 1)`
- entry index `N` aligns to slot center `(N + 0.5) / (entryCount + 1)`
- current marker aligns to `(markerIndex + 0.5) / (entryCount + 1)` when not actively dragging
- active drag can continue using `dragPercent` for the large active node

If source filtering changes the visible timeline card list, the dots should follow the same visible filtered list rather than pretending hidden rows are visible. Keep this consistent with the currently rendered card stack.

Use `timelineRenderedSlotCount` as the denominator so dot placement stays aligned with the existing handle math.

Do not add new geometry measurement for individual card centers in Phase 8. If exact DOM-center dot placement is needed later, record it as a follow-up after this CSS/markup pass.

#### Styling Contract

Visible rail:
- thin `2px` to `3px` line
- muted gray-blue
- no thick pill background
- no warm gradient
- no filled scrollbar track
- the button hit area may stay `18px` or slightly wider, but its background should be transparent or nearly transparent

Inactive dots:
- circular
- smaller than the active marker
- muted light gray or gray-blue
- centered on the visible line
- purely visual unless they naturally sit inside the existing rail hit target
- about `12px` to `16px`, depending on how it reads beside the cards

Active node:
- large blue circle with a visible outer ring
- centered on the rail
- larger than inactive dots by at least `2x`
- remains the active drag/read target
- uses the existing smooth drag position
- keep the existing `style.top` driven positioning so tests and behavior remain stable

Hit target:
- keep enough invisible width for comfortable clicking and dragging
- do not shrink the actual pointer target down to the thin visible line

Suggested class work:
- update `.EditHistoryReaderTimelineRail` to remove the strong filled-track background.
- update `.EditHistoryReaderTimelineRail::before` to be the thin visible line.
- add `.EditHistoryReaderTimelineRailDot`.
- update `.EditHistoryReaderTimelineRailHandle` into the active blue ring/inner-fill read.
- keep `.EditHistoryReaderTimelineScrub.isScrubbing .EditHistoryReaderTimelineRailHandle` as the brighter active-drag read.

#### Test Plan

Add or update focused reader-surface tests to prove:
- the rail renders one `.EditHistoryReaderTimelineRailDot` per visible timeline entry.
- rail dot `top` styles match the same slot-center positions as the rendered timeline.
- the active handle still renders with a `top` style driven by marker position.
- the compact marker row and `Marker index N` still render.
- rail click still routes through canonical undo/redo.
- marker-row drag preview still works.
- the rail remains present for empty history.
- empty history renders no inactive dots and keeps the active handle at `50%`.

CSS visual details can be covered by class/element presence rather than brittle color assertions.

#### Acceptance Checks

- The visible rail reads as a thin timeline line instead of a thick scrollbar-style track.
- Inactive entry dots are visible and align with history card centers.
- The active current-position node is large, blue, and centered on the rail.
- The active node visually connects to the compact marker row.
- The rail remains easy to click and drag because the wider pointer target is preserved.
- Rail click, marker drag preview, pointer cancel, and release-time canonical undo/redo behavior still pass.
- No new history owner, checkpoint storage, branch graph state, or private payload exposure is introduced.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 8 Completion Evidence

Implemented:
- The Timeline rail now renders decorative `EditHistoryReaderTimelineRailDot` children from visible timeline entries.
- Rail dots use the same slot-center percentage math as the active marker handle.
- Empty history renders no inactive dots and keeps the active marker at `50%`.
- The visible rail was restyled from a filled track into a thin muted vertical line.
- The wide rail button remains the click and drag hit target.
- The active marker handle remains driven by `timelineMarkerPercent` and now reads as a larger blue ringed node.
- Rail click, marker drag preview, pointer cancel, and release-time canonical undo/redo behavior remain unchanged.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

Follow-up alignment repair:
- Rail dots and the active marker now measure the rendered timeline card centers when DOM geometry is available.
- The current-position marker uses the measured compact marker row center when idle.
- Decorative history dots use measured history card centers instead of equal theoretical slot percentages.
- The previous slot-center math remains as a fallback when measurements are unavailable.
- Focused reader-surface coverage now proves uneven card geometry produces measured dot and marker positions.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 9` - `Expandable Timeline Group Cards`

### Phase 9 Summary

Add expand/collapse behavior to timeline cards that represent grouped or batch-like canonical entries.

The first target is `Commit sketch draw changes`, but Phase 9 should keep the UI generic:
- the parent canonical entry remains the one timeline row
- the parent remains the only undo/redo jump step
- child rows are read-only details inside the parent card
- child rows do not become independent undo/redo entries
- entries with no child summary data can show a small empty/detail-unavailable row

This is a reader UI pass. It should not create a new history owner or change canonical undo/redo behavior.

### Phase 9 Implementation Spec

#### Current Live Read

The current Timeline reader renders applied entries, the compact current-position marker, and redoable entries inline in `EditHistoryReaderSurface.tsx`.

Important live seams:
- `selectedEntryId` owns inspector selection and must remain separate from expansion state.
- `timelineScrubPreview`, rail pointer handlers, and `jumpToTimelineMarkerIndex()` already own marker jump behavior.
- Timeline rail dot alignment now measures rendered card centers using `data-timeline-rail-entry-id`; Phase 9 must keep that attribute on the rendered card element whose visual center should receive the dot.
- The compact marker row uses `data-timeline-rail-marker="true"` and should not be widened in this phase.
- The reader model does not yet need to expose Sketch Draw committed child summaries. Phase 9 can show an unavailable detail row for the first expandable sketch commit target.

#### Scope

Implement expandable group presentation in the Edit History Timeline reader.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/store/editHistoryReaderViewModel.ts` only if a small public `childSummaries` read-model field already exists or can be safely surfaced from existing metadata

Phase 9 should not change:
- canonical undo/redo stack ownership
- `editHistoryStore.undo()` / `redo()` semantics
- marker jump behavior
- rail click or drag behavior
- timeline ordering
- snapshot log ownership
- private payload exposure
- Sketch Draw active local history ownership
- Sketch Draw commit serialization or command summary capture

#### Implementation Steps

1. Add local expansion state in `EditHistoryReaderSurface.tsx`.

```ts
const [expandedTimelineEntryIds, setExpandedTimelineEntryIds] = useState<Set<string>>(() => new Set())
```

2. Add a narrow capability helper for this first pass.

```ts
const isTimelineGroupExpandable = (entry: EditHistoryReaderTimelineEntryModel): boolean =>
  entry.label === 'Commit sketch draw changes'
```

This can stay label-based for Phase 9 because Phase 10 owns the real public child-summary data path.

3. Add a toggle helper that prevents the parent jump from firing.

```ts
const toggleTimelineEntryExpansion = (
  event: React.MouseEvent<HTMLButtonElement>,
  entryId: string,
): void => {
  event.preventDefault()
  event.stopPropagation()
  setExpandedTimelineEntryIds((current) => {
    const next = new Set(current)
    if (next.has(entryId)) {
      next.delete(entryId)
    } else {
      next.add(entryId)
    }
    return next
  })
}
```

4. Refactor timeline entry rendering into a small local render helper or component so applied and redoable rows share the same expandable-card markup.

5. Do not put a `<button>` inside the existing timeline entry `<button>`. Use a card wrapper with sibling controls:
- an outer card element that carries `data-timeline-rail-entry-id`
- a primary parent-jump `<button>` that calls `jumpToTimelineMarkerIndex(resolveTimelineEntryTargetMarkerIndex(entry))`
- an expand/collapse `<button>` that only toggles local expansion state
- an expanded child-detail region rendered inside the same outer card

6. Render unavailable child detail only for expandable entries without child summaries.

Suggested empty detail copy:
- `No committed command details available`

7. Add CSS for nested details without changing the scrub rail contract:
- `EditHistoryReaderTimelineEntryCard`
- `EditHistoryReaderTimelineEntryMain`
- `EditHistoryReaderTimelineExpandButton`
- `EditHistoryReaderTimelineChildList`
- `EditHistoryReaderTimelineChildCard`

Keep the expanded child rows visually nested inside the parent card, not as peer timeline entries on the rail.

#### HTML/Event Boundary

The expandable card must avoid nested interactive elements.

Required interaction ownership:
- parent jump button routes through the existing canonical undo/redo jump path
- expand button changes only `expandedTimelineEntryIds`
- expand button does not call undo, redo, or marker jump
- child detail rows are read-only and non-interactive in Phase 9
- rail dot measurement continues to target the full parent card center, not an inner button center

#### UI Contract

Cards that can expand should show a small expand/collapse control in the card header area.

Suggested behavior:
- collapsed label: compact chevron or `Expand`
- expanded label: compact chevron or `Collapse`
- clicking the expand control toggles local UI expansion only
- clicking the expand control must stop propagation so it does not trigger the parent timeline jump
- clicking the parent body keeps the existing timeline jump behavior
- expanded child content renders inside the parent card, below the existing card summary
- expanded child rows are visually nested sub-cards, not peer timeline cards

Parent card still shows:
- label
- source/target summary
- applied/redoable status
- timestamp

Expanded content shows:
- one child row per available public child summary
- a read-only unavailable row if the parent is expandable but no child summaries are available yet

#### Phase 9 / Phase 10 Boundary

Phase 9 is the expandable presentation shell.

Do not add Phase 10 data work here:
- no Sketch Draw command summary storage
- no committed sketch command serialization
- no private payload inspection
- no independent child undo/redo targets
- no snapshot-log child expansion behavior

#### Data Contract

Phase 9 may render from a generic public child-summary shape if already available:

```ts
type EditHistoryReaderChildSummaryModel = {
  childId: string
  label: string
  kind: string | null
  sequence: number | null
}
```

If the current canonical entries do not yet expose child summaries, Phase 9 should still add the expandable UI shell behind a narrow capability check, then render `No committed command details available` for `Commit sketch draw changes` only when it is explicitly expandable.

Do not serialize private undo/redo closures, function payloads, or full command payloads into the reader model.

#### Acceptance Checks

- Expandable timeline entries show an expand/collapse control.
- Clicking the expand control expands/collapses without performing marker jumps.
- The parent timeline card remains the only canonical jump target.
- Expanded sub-cards are visually nested inside the parent.
- Sub-cards are read-only and do not call undo/redo.
- Entries without child summaries do not invent fake details.
- Non-expandable timeline entries do not show the expand/collapse control.
- Rail dots remain aligned to the visual center of the full parent card after the wrapper is introduced.
- Existing rail, marker, timeline row jump, Undo, Redo, Sketch Draw tab, and snapshot log behavior still pass.

#### Focused Tests

Add or update `src/app/workspace/EditHistoryReaderSurface.test.tsx` coverage for:
- `Commit sketch draw changes` renders an expand/collapse control.
- clicking the expand/collapse control reveals `No committed command details available`.
- clicking the expand/collapse control does not call undo/redo or marker jump behavior.
- clicking the parent jump button still routes through the existing marker jump behavior.
- a non-group entry such as `Add graph node` does not render an expand/collapse control.
- rail dot alignment measurement still reads the outer parent card center.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

### Phase 9 Shipped Read

Shipped 2026-05-01 00:08:14.

Implemented:
- Timeline entries now render through a full-card wrapper with sibling controls instead of nested buttons.
- `Commit sketch draw changes` entries show a local expand/collapse control.
- Clicking the expand/collapse control only changes reader UI expansion state.
- Clicking the parent card's main button still routes through the canonical marker jump path.
- Expanded group cards render `No committed command details available` until Phase 10 adds real child-summary data.
- Decorative rail dot measurement stays tied to the full rendered parent card wrapper.
- Non-group timeline entries do not show an expand/collapse control.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 10` - `Sketch Draw Commit Child Summaries`

### Phase 10 Summary

Store and expose public Sketch Draw command summaries on the canonical `Commit sketch draw changes` entry so Phase 9 expanded group cards can show real committed sub-command rows.

Phase 10 is the data/read-model companion to Phase 9. It should add only public summary metadata. It must not make Sketch Draw sub-commands independently undoable after commit.

### Phase 10 Implementation Spec

#### Current Live Read

The live Sketch Draw commit path already has the right capture point.

Observed seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts` stores accepted draw-session history in `geometrySketchSession.sessionUndoCommands`.
- `closeGeometrySketchSession()` builds `acceptedLocalHistory` from `session.sessionUndoCommands` when the session has accepted graph parameter changes.
- `closeGeometrySketchSession()` then calls `commitGeometrySketchFeatureHistoryCommand()` with label `Commit sketch draw changes`.
- `commitGeometrySketchFeatureHistoryCommand()` creates one canonical `editHistoryStore.commitEntry()` entry with `source: geometrySketchDrawHistorySource`.
- `GeometrySketchStagedCommand` and `GeometrySketchToolSelectionCommand` already expose public `commandId`, `label`, and `kind` values that are enough for reader child summaries.
- `EditHistoryEntry` currently has no child-summary metadata field, and `createEditHistoryReaderEntryModel()` currently exposes only parent entry metadata.

This means Phase 10 should capture summaries from the accepted command list before the final parent entry is committed, then pass that public summary list through the edit-history entry contract and reader model.

#### Scope

Capture public child summaries when Sketch Draw local commands are committed into one canonical edit-history entry, then expose those summaries through the Edit History reader model.

Primary file targets:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/editHistoryStore.ts`
- `src/app/store/editHistoryReaderViewModel.ts`
- `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`
- `src/app/store/editHistoryReaderViewModel.test.ts`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`

Phase 10 should not change:
- local Sketch Draw command execution
- final sketch commit behavior
- canonical undo/redo ownership
- parent entry undo/redo semantics
- active uncommitted Sketch Draw tab behavior
- private payload exposure
- checkpoint or branch behavior
- Phase 9 expand/collapse event ownership
- snapshot log ordering or snapshot sequence semantics

#### Public Summary Shape

Add a public metadata-only shape near the canonical edit-history entry contract:

```ts
type EditHistoryEntryChildSummary = {
  childId: string
  label: string
  kind: string | null
  sequence: number
}
```

Then add an optional field to `EditHistoryEntry`:

```ts
childSummaries?: EditHistoryEntryChildSummary[]
```

Allowed source data from Sketch Draw local history commands:
- `command.commandId` as `childId`
- `command.label` as `label`
- `command.kind` as `kind`
- 1-based accepted-command order as `sequence`

Disallowed data:
- undo/redo functions
- full before/after sketch params
- raw command payloads that can expose private implementation state
- independent canonical entry ids for sub-commands unless they really exist as canonical entries

#### Implementation Steps

1. Add `EditHistoryEntryChildSummary` and optional `childSummaries` to `EditHistoryEntry` in `editHistoryStore.ts`.

2. Keep `childSummaries` immutable at public boundaries:
- copy arrays on commit if the store currently normalizes entry objects
- expose cloned arrays in reader model creation
- do not let UI code mutate the stored command summaries

3. Add a small helper in `useSpaghettiStore.ts` near Sketch Draw history helpers:

```ts
const createGeometrySketchChildSummaries = (
  commands: GeometrySketchSessionHistoryCommand[],
): EditHistoryEntryChildSummary[] =>
  commands.map((command, index) => ({
    childId: command.commandId,
    label: command.label,
    kind: command.kind,
    sequence: index + 1,
  }))
```

4. Add an optional `childSummaries` field to `CommitGeometrySketchFeatureHistoryOptions`.

5. In `closeGeometrySketchSession()`, pass summaries made from the accepted command list:

```ts
childSummaries: createGeometrySketchChildSummaries(session.sessionUndoCommands)
```

Use the accepted post-local-undo list, not `stagedBaselineHistory` or discarded redo commands.

6. In `commitGeometrySketchFeatureHistoryCommand()`, attach `options.childSummaries` to the parent `editHistoryStore.commitEntry()` call only when at least one summary exists.

7. In `editHistoryReaderViewModel.ts`, add `childSummaries` to `EditHistoryReaderEntryModel`. Timeline entries inherit it through the existing parent model spread.

8. In `EditHistoryReaderSurface.tsx`, replace Phase 9's unavailable child row with real `entry.childSummaries` rows when present. Keep the unavailable row for expandable entries with no summaries.

#### Ownership Boundary

The parent canonical entry remains the only undo/redo owner.

Child summaries are:
- display-only
- public metadata
- ordered details inside the parent card
- not selectable timeline entries
- not snapshot-log entries
- not undo/redo targets

Child summaries are not:
- commands that can be replayed by the Edit History workspace
- private graph/sketch payloads
- a second history stack
- a checkpoint or branch model

#### Reader Contract

`createEditHistoryReaderModel()` should expose child summaries as read-only public metadata on the parent timeline/stack entry model.

The parent card can then render:
- `#1 Draw sketch line`
- `#2 Delete sketch component`
- or equivalent public labels based on the local command names

#### Acceptance Checks

- Committing active Sketch Draw local commands stores public child summaries on the parent canonical entry.
- The parent canonical entry remains one undo/redo step.
- Reader models expose child summaries without private payload data.
- Expanded timeline cards show real child rows for committed Sketch Draw changes.
- Active uncommitted Sketch Draw history still appears in the Sketch Draw tab before commit.
- Undoing/redoing the parent entry still restores through the existing parent canonical command.
- Local Sketch Draw undo before commit removes discarded commands from the committed child summary list.
- Tool-selection commands can appear as public child summaries when they were accepted into the committed local history.
- Redoable parent entries preserve the same child summaries after undo.

#### Focused Tests

Add or update coverage for:
- `sketchDraftRuntimeExclusion.test.ts`: a committed Sketch Draw parent entry contains child summaries matching accepted local command labels in order.
- `sketchDraftRuntimeExclusion.test.ts`: commands undone locally before final commit are not included in the child summary list.
- `editHistoryReaderViewModel.test.ts`: reader entries and timeline entries expose cloned `childSummaries` without undo/redo functions or params.
- `EditHistoryReaderSurface.test.tsx`: expanding `Commit sketch draw changes` renders the real child summary rows instead of the unavailable fallback.
- `EditHistoryReaderSurface.test.tsx`: undoing the parent into redo keeps the expanded/readable child rows on the redoable parent card.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts
node_modules\.bin\tsc.cmd -b
```

### Phase 10 Shipped Read

Shipped 2026-05-01 00:14:08.

Implemented:
- Added public `EditHistoryEntryChildSummary` metadata to canonical edit-history entries.
- Stored Sketch Draw committed child summaries on the parent `Commit sketch draw changes` entry.
- Captured summaries from the accepted draw session `sessionUndoCommands` list, including accepted tool-selection and geometry commands.
- Kept locally undone geometry commands out of the committed geometry child-summary list.
- Surfaced cloned child summaries through the Edit History reader model.
- Rendered real child summary rows inside expanded Timeline group cards, replacing the unavailable fallback when data exists.
- Preserved the parent canonical entry as the only undo/redo owner.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 11` - `Expanded Child Scrub Preview Stops`

### Phase 11 Summary

Let the current-position marker visually target expanded Sketch Draw sub-command rows while keeping those child rows read-only.

Phase 11 is a reader interaction slice. It should make expanded child rows feel like timeline stops during drag and selection, but it must not pretend those child rows are independently undoable or redoable after commit.

### Phase 11 Implementation Spec

Phase 11 is prepped for implementation as a UI/read-model interaction pass over the already-shipped Phase 9 and Phase 10 surfaces.

Implementation owner:
- `src/app/workspace/EditHistoryReaderSurface.tsx`

Primary test owner:
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`

CSS owner:
- `src/app/theme/foundation/base.css`

Do not add new store ownership unless a tiny public reader-model helper becomes clearly simpler than local surface derivation.

#### Scope

Add virtual child scrub targets for expanded timeline group cards.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/store/editHistoryReaderViewModel.ts` only if a tiny public display id or child target helper belongs in the reader model
- `src/app/store/editHistoryReaderViewModel.test.ts` only if the reader model changes

Phase 11 should not change:
- canonical `editHistoryStore.undo()` / `redo()` semantics
- parent `Commit sketch draw changes` entry ownership
- Sketch Draw committed data shape beyond public display metadata
- private command payload visibility
- checkpoint storage
- branch graph behavior
- true partial restore behavior
- persisted reader state
- global keyboard undo/redo routing
- snapshot log semantics
- Sketch Draw local command-buffer behavior

#### Child Target Model

Use expanded rendered rows as visual target slots:
- parent timeline entry target
- each visible `entry.childSummaries` row target
- current-position marker target

Child targets should have stable display identity such as:
- parent `entryId`
- child `entryId:childId`
- marker `timeline-marker`

Child labels should read as nested positions:
- `#14 Commit sketch draw changes`
- `#14.1 Select sketch rectangle tool`
- `#14.2 Draw sketch rectangle`

The exact visual numbering can adjust to local style, but the child position must clearly belong under the parent canonical entry.

#### Implementation Direction

Use local surface state for child selection and preview.

Recommended state shape:

```ts
type TimelineSelection =
  | { kind: 'entry'; entryId: string }
  | { kind: 'marker' }
  | { kind: 'child'; entryId: string; childId: string }
```

This can replace or wrap the current `selectedEntryId` string state if that keeps the inspector simpler. If a smaller local patch is safer, keep `selectedEntryId` and add a sibling `selectedChildTarget` state.

Required local helpers:
- derive visible child target ids from expanded entries only
- render `data-timeline-rail-child-id` on each child row that should be measurable
- collect measured centers from parent cards, visible child rows, and the marker row
- resolve the nearest target from the pointer Y coordinate during drag
- convert a child target back to its parent canonical marker boundary on release

Do not make child summaries part of `model.timeline.entries`. They are not canonical timeline entries.

#### Measurement And Positioning

Phase 8 already measures card centers for rail dots and the idle active marker. Phase 11 should extend that idea instead of introducing a second measurement system.

Required measurement behavior:
- parent rows keep using `data-timeline-rail-entry-id`
- child rows get a dedicated child target data attribute
- collapsed children are absent from the target list
- the scrub preview marker can use a child row center while dragging
- the idle marker should only stay at a child row center if a child target is selected and the parent boundary is still the active canonical marker context

Fallback behavior:
- if DOM measurement is unavailable, keep current parent-slot fallback behavior
- do not invent child fallback percentages without rendered child rows

#### Drag Preview Behavior

While the user drags the current-position marker:
- resolve the nearest rendered target center from parent cards, child rows, and marker row
- let the active marker/preview snap beside the nearest child row when a child row is nearest
- keep the continuous rail handle motion from Phase 6
- keep the preview-only behavior until pointer release

On release over a child target:
- select/highlight the child row detail
- keep the canonical marker at the nearest parent boundary
- do not call extra undo/redo beyond the parent boundary required by the current canonical marker semantics
- set the inspector to the child target detail instead of the parent entry detail

If the target child belongs to an already-applied parent, releasing on the child may leave the canonical marker after that parent while selecting the child as the reader detail.

If the target child belongs to a redoable parent, releasing on the child may redo through that parent before selecting the child, because the parent is still the canonical step.

Parent boundary rule:
- applied parent child target -> target marker index immediately after the parent entry
- redoable parent child target -> target marker index immediately after the parent entry once redone

Reason:
- the child row belongs inside a committed parent entry; selecting it means "look at this point inside the parent commit", not "undo to before this child".

#### UI Requirements

- Child rows should be visibly selectable as preview targets when their parent is expanded.
- The current-position marker row or rail node should align to the child row center during preview.
- The inspector should make the child selection honest, using wording like `Read only child marker` or `Preview target only`.
- The UI must not label child rows as `Applied` or `Redoable` independently unless the parent boundary determines that state.
- Child rows can gain a subtle selected/preview style, but they should remain visually subordinate to the parent card.
- The parent card remains the visual canonical history item.
- The child detail inspector should show at least parent label, child sequence, child label, child kind, and status.

#### Acceptance Checks

- Dragging over an expanded Sketch Draw child row moves the visual preview to that child row.
- Releasing on a child row selects the child detail without creating a new canonical undo/redo entry.
- Parent entries remain the only canonical undo/redo targets.
- Collapsed group cards do not expose child scrub targets.
- Existing parent row clicks, rail clicks, marker drag release, expand/collapse, newest-first ordering, and child-summary rendering still work.
- Releasing on an applied parent child target does not undo the parent entry just to show the child.
- Releasing on a redoable parent child target redoes through the parent entry, then selects the child detail.
- Child selection clears when its parent is collapsed, filtered out, or no longer exists.
- Undo/Redo buttons continue to operate on parent canonical entries only.

#### Focused Tests

Add or update `src/app/workspace/EditHistoryReaderSurface.test.tsx` coverage for:
- expanded child rows expose measurable scrub targets
- collapsed child rows do not expose measurable scrub targets
- dragging over an expanded child row previews the marker at the child row center
- releasing on an applied child target selects child detail without undoing the parent entry
- releasing on a redoable child target redoes the parent entry and selects child detail
- collapsing the parent clears child selection
- existing parent row and rail jump behavior remains unchanged

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

### Phase 11 Shipped Read

Shipped 2026-05-01 01:27:27.

Implemented:
- Added local child target selection for expanded Timeline child rows.
- Rendered committed Sketch Draw child rows as measurable scrub targets with stable `data-timeline-rail-child-*` attributes.
- Allowed child rows to be selected directly without adding child entries to the canonical undo/redo stacks.
- Extended scrub preview resolution to use visible child row centers when the pointer is near a child target.
- Released child scrub targets through the parent canonical marker boundary while selecting the child detail afterward.
- Added read-only child marker inspector metadata for selected child rows.
- Added selected and preview styling for child rows while keeping the parent card as the canonical history item.
- Kept true child restore points deferred to Phase 12.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [x] `Edit-History-Workspace-4 / Phase 11A` - `Canonical Scrub Pointer Audit`

### Phase 11A Summary

Lock the Timeline scrub list back to the canonical undo/redo pointer.

The scrub list should be the user-facing canonical edit-history list, not a separate visited-position or screenshot timeline. Moving the `Current position` marker must mean "execute enough canonical undo/redo steps to put the edit-history owner at this index."

### Phase 11A Implementation Spec

Phase 11A is prepped for implementation as a focused bug-fix and proof slice over the already-shipped scrub interaction.

Live seams:
- `EditHistoryReaderSurface` already has `jumpToTimelineMarkerIndex(targetMarkerIndex)`.
- Row clicks, rail clicks, and scrub release should all route through that one helper.
- `editHistoryStore.undo()` moves the last applied entry from `undoEntries` to `redoEntries`.
- `editHistoryStore.redo()` moves the next redoable entry from `redoEntries` back to `undoEntries`.
- `model.timeline.markerIndex` is derived from `snapshot.undoEntries.length`.
- `snapshotLog` currently records commit, undo, and redo activity; it must not become the scrub-list source of truth.

#### Scope

Audit and repair scrub release, row click, Undo button, Redo button, and keyboard shortcut behavior so they all share one canonical pointer.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/store/editHistoryStore.ts`
- `src/app/store/editHistoryStore.test.ts`
- shortcut/input routing tests only if Ctrl+Z/Ctrl+Y ownership has drifted

Phase 11A should not:
- create a new history entry when the marker moves
- create a screenshot entry because the marker moved
- persist marker moves as a separate history stack
- change Sketch Draw child restore behavior
- add CAD build-path timeline behavior
- rename or remove the snapshot log; that is Phase 11B unless the bug fix requires a tiny wording guard
- make expanded child rows independent canonical targets; that is Phase 11C/Phase 12 territory

#### Canonical Pointer Rule

The Timeline marker index must be the canonical applied-entry count.

Required behavior:
- if the canonical timeline has 10 entries and the marker moves from 10 to 5, the store has 5 applied entries and 5 redoable entries
- the next Ctrl+Z after that move goes from marker index 5 to marker index 4
- the next Ctrl+Y/Redo goes from marker index 5 to marker index 6
- Undo/Redo buttons and keyboard shortcuts read the same current index as the scrub marker
- moving the scrub marker is not itself undoable
- same-index scrub release stays a no-op

Implementation direction:
- keep using repeated `editHistoryStore.undo()` / `editHistoryStore.redo()` calls or a store-owned batch jump helper
- prefer one shared helper for row click, rail click, marker drag release, and any future keyboard jump command
- assert that `Current position` rows are view-only handles and never appear in undo or redo stacks
- calculate the target using the full canonical `model.timeline.entries.length`, not the visible filtered list count
- keep newest-first visual ordering separate from canonical stack ordering
- after any successful marker jump, clear `selectedChildTarget` so a stale child selection cannot make the next Undo/Redo look like it targets a child or marker
- leave pointer-move preview local only; canonical mutation still happens on pointer up/click release

#### Focused Tests

Add or update coverage for:
- dragging from marker index 10 to 5 leaves the next Undo button/Ctrl+Z target at marker index 4
- dragging from marker index 10 to 5 leaves the next Redo button/Ctrl+Y target at marker index 6
- row click and scrub release produce the same undo/redo stack contents for the same target marker index
- the `Current position` marker never appears as an undoable entry
- Ctrl+Z/Ctrl+Y after a scrub jump operate on canonical edit entries, not on marker movement
- scrub release does not append any marker-move entry to `undoEntries` or `redoEntries`
- same-index release does not change stack depths or action order
- newest-first display still produces canonical stack order after a jump
- child-row selection is cleared after parent-boundary scrub jumps in Phase 11A scope

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

### Phase 11A Shipped Read

Shipped as a focused regression-proof pass.

Implemented:
- Added a reusable reader-surface test helper for numbered canonical history entries.
- Added regression coverage for dragging the scrub marker from marker index `10` to marker index `5`, then using the real Undo and Redo toolbar buttons.
- Proved the post-scrub Undo target is the previous canonical entry at marker index `4`, not a marker movement or redo-side entry.
- Proved the post-scrub Redo target returns to marker index `5`.
- Added coverage that scrub marker movement does not add a `Current position`, marker, or marker-move pseudo-entry to the canonical undo/redo stacks.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

## [ ] `Edit-History-Workspace-4 / Phase 11B` - `Snapshot Activity Separation`

### Phase 11B Summary

Separate diagnostic snapshot activity from the canonical Timeline scrub list.

The snapshot log can remain useful for debugging and reader audit, but it must not be the source of truth for scrub positions, and marker movement must not create new user-facing history entries.

### Phase 11B Implementation Spec

#### Scope

Review the current snapshot activity flow and make the Edit History workspace labels/contracts clear:
- `Timeline` is the canonical undo/redo projection
- `Snapshot log` is diagnostic activity only
- moving the marker does not add a new canonical entry
- moving the marker does not add a new "current position moved" snapshot row

Primary file targets:
- `src/app/store/editHistoryStore.ts`
- `src/app/store/editHistoryReaderViewModel.ts`
- `src/app/store/editHistoryReaderViewModel.test.ts`
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`

Phase 11B should not:
- delete the diagnostic snapshot log unless a narrower implementation proves it is dead
- make snapshot rows clickable canonical scrub targets
- change the existing Undo/Redo stack contract
- create persistence for snapshot activity

#### UI Wording Rule

If the diagnostic log remains visible in the inspector, label it so users do not confuse it with the canonical Timeline.

Allowed labels:
- `Activity log`
- `Diagnostic log`
- `Snapshot activity`

Avoid labels that imply ownership:
- `History`
- `Timeline`
- `Canonical history`
- `Undo list`

#### Focused Tests

Add or update coverage for:
- scrub marker movement does not append a marker-move activity row
- the Timeline count derives from canonical entries, not snapshot activity count
- snapshot/activity rows are not used as scrub rail dot sources
- inspector wording distinguishes diagnostic activity from canonical timeline entries

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

## [ ] `Edit-History-Workspace-4 / Phase 11C` - `Expanded Child Boundary Policy`

### Phase 11C Summary

Reconcile expanded Sketch Draw child rows with the canonical scrub-list rule before true child restore starts.

Expanded child rows are useful detail inside a parent canonical entry, but they are not currently independent canonical undo/redo entries. This phase decides and enforces how they appear in the canonical scrub list so Phase 12 does not accidentally turn them into a second timeline.

### Phase 11C Implementation Spec

#### Scope

Choose and implement the conservative child-row policy for the Edit History workspace.

Recommended policy:
- parent `Commit sketch draw changes` remains the only canonical scrub stop
- expanded child rows remain detail/inspection rows inside that parent card
- dragging near a child row may select or preview the child detail only after the marker has landed on the parent boundary
- Ctrl+Z/Ctrl+Y always moves between parent canonical entries
- true per-child build/playback belongs to the future CAD build-path timeline unless Phase 12 explicitly restores a temporary in-parent view without changing canonical ownership

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/store/editHistoryReaderViewModel.ts`
- `src/app/store/editHistoryReaderViewModel.test.ts`

Phase 11C should not:
- add child entries to `model.timeline.entries`
- create independent child undo/redo stack entries
- make Ctrl+Z stop on child summary rows
- implement true child restore points
- implement CAD build-path timeline playback

#### Decision Gate For Phase 12

Before Phase 12 starts, the doc and tests must prove one of these policies:
- child rows are inspectable only, with canonical scrub stops at parent entries
- child rows can restore a temporary in-parent view, but Ctrl+Z/Ctrl+Y still move between parent canonical entries

If the desired product direction shifts toward per-command build replay, move that work into the CAD build-path timeline instead of widening the Edit History workspace scrub list.

#### Focused Tests

Add or update coverage for:
- expanded child rows do not increase canonical Timeline entry count
- Ctrl+Z after selecting or previewing a child row moves to the previous parent canonical marker
- Ctrl+Y after selecting or previewing a child row moves to the next parent canonical marker when available
- collapsed and expanded parent cards produce the same canonical marker index when targeted
- child selection state clears or revalidates when the parent canonical marker changes

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts
node_modules\.bin\tsc.cmd -b
```

## [~] `Edit-History-Workspace-4 / Phase 12` - `Sketch Draw Child Restore Points`

### Phase 12 Summary

Add the data contract required for true partial restore inside a committed Sketch Draw parent entry.

Phase 12 should only start after Phase 11 proves the reader interaction and Phases 11A through 11C lock the Timeline scrub list to canonical undo/redo pointer semantics. It must make the child restore behavior real without turning child rows, snapshot activity, or current-position movement into separate canonical history entries.

### Phase 12 Implementation Spec

Phase 12 is prepped for implementation as a narrow restore-contract pass over the already-shipped Phase 11 child scrub targeting.

Selected approach:
- keep `childSummaries` public and read-only
- add a separate private parent-owned child restore-point contract on edit-history entries
- let the reader ask the canonical `editHistoryStore` to execute a child restore after it moves to the parent boundary
- keep child rows out of the global undo/redo stacks

Do not serialize private payloads into the reader model.

#### Scope

Implement private child restore points for committed Sketch Draw batches so selecting a child target can restore the graph/sketch state to that child boundary.

Primary file targets:
- `src/app/store/editHistoryStore.ts`
- `src/app/store/editHistoryStore.test.ts`
- `src/app/store/editHistoryReaderViewModel.ts`
- `src/app/store/editHistoryReaderViewModel.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`

Phase 12 should not:
- expose private command payloads in the reader UI
- create independent child entries in the global undo/redo stacks
- mutate history during pointer move
- replace the parent canonical entry as the undo/redo owner
- add generic checkpoint storage for all history entries unless a narrower contract cannot work
- persist child restore points beyond the in-memory edit-history entry contract
- create a new history reader store
- restore on pointer move
- make collapsed child rows restorable targets

#### Required Data Contract

Before child release can restore partial Sketch Draw state, each restorable child target needs enough durable data to restore the graph/sketch state at that child boundary.

Implement the private parent-owned callback option first.

Recommended edit-history entry addition:

```ts
export type EditHistoryEntryChildRestorePoint = {
  childId: string
  restore: EditHistoryOperation
}

export type EditHistoryEntry = {
  // existing fields...
  childSummaries?: readonly EditHistoryEntryChildSummary[]
  childRestorePoints?: readonly EditHistoryEntryChildRestorePoint[]
}
```

Recommended store owner method:

```ts
restoreChild: (entryId: string, childId: string) => EditHistoryEntry | null
```

Store behavior:
- search the currently applied undo stack for the parent entry by `entryId`
- find a matching `childRestorePoints` item by `childId`
- run the restore operation
- notify subscribers after a successful restore
- return the parent entry on success, otherwise `null`

The reader model may expose whether a public child summary has a restore point, but it must not expose the restore callback itself.

Recommended reader child model addition:

```ts
type EditHistoryReaderChildSummaryModel = {
  childId: string
  label: string
  kind: string | null
  sequence: number
  canRestore?: boolean
}
```

If all Phase 12 child summaries are restorable for committed Sketch Draw entries, `canRestore` can be omitted from the UI for now, but the model/test should prove non-restorable children do not claim restore capability if that case exists.

Do not implement a UI-only fake. If release on `#14.2` changes model state, the implementation must have a real state source that can survive the parent commit boundary used by the action.

#### Sketch Draw Restore Point Construction

Build restore points while closing an accepted Sketch Draw session.

Live seams:
- `closeGeometrySketchSession()` already has `session.stagedBaselineParams`
- `closeGeometrySketchSession()` already has `session.stagedBaselineHistory`
- `session.sessionUndoCommands` is the accepted child-command list
- `commitGeometrySketchFeatureHistoryCommand(...)` already receives public `childSummaries`
- parent undo restores `beforeParams` and `beforeLocalHistory`
- parent redo restores `afterParams` and `afterLocalHistory`

Implementation direction:
- derive child boundary snapshots from the accepted command list in order
- child `N` should restore the state after applying commands `1..N`
- use cloned node params and local history snapshots, not raw mutable session references
- attach private child restore points to the parent `Commit sketch draw changes` entry
- restore through `restoreGeometrySketchNodeParameterSnapshot(...)` so graph params and local Sketch Draw history stay aligned

Suggested helper shape:

```ts
const createGeometrySketchChildRestorePoints = (
  graphDocumentId: string,
  nodeId: string,
  commands: readonly GeometrySketchSessionHistoryCommand[],
): EditHistoryEntryChildRestorePoint[]
```

Exact helper inputs can adjust to fit the existing local-history builders, but restore points must be derived before the session is cleared.

Boundary snapshot rule:
- child restore `#1` restores after command 1
- child restore `#N` restores after command N
- parent redo remains the full accepted commit state
- parent undo remains the pre-session baseline

If a command is a tool-selection child that does not change sketch params, its restore point may restore the nearest state boundary after that command and preserve local command history position. Do not make tool-selection children disappear from restore targeting just because params are unchanged.

#### Release Behavior

When the user releases on a restorable child target:
- move canonical history to the parent boundary first
- execute the parent-owned child restore action for the selected child boundary
- show the selected child as the current in-parent marker
- keep Undo/Redo buttons honest about the parent canonical entry

Resolved Phase 12 decision:
- child restore is a temporary in-parent restored view over the applied parent entry
- it does not create a new canonical follow-up entry
- it does not become a pending uncommitted Sketch Draw session
- normal parent undo/redo clears or overwrites the in-parent child view naturally by restoring parent boundary snapshots

Reader integration:
- keep Phase 11 pointer-move preview-only behavior
- on release, jump to the parent boundary first
- call `editHistoryStore.restoreChild(parentEntryId, childId)`
- only show selected child detail as restored when the store restore succeeds
- if restore fails, fall back to Phase 11 read-only child selection wording

#### Acceptance Checks

- Releasing on a child target restores the visible Sketch Draw state to that child boundary using a real parent-owned restore contract.
- The parent canonical entry remains the only global undo/redo stack entry.
- Undoing past the parent entry clears any in-parent child marker state.
- Redoing the parent can restore the full committed parent state unless the user explicitly targets a child again.
- The reader clearly distinguishes parent canonical position from in-parent child position.
- Public reader metadata never exposes private command payloads or restore functions.
- `editHistoryStore.restoreChild(...)` returns `null` for missing parent entries, missing child ids, and non-restorable children.
- Store subscribers are notified after successful child restore.
- Child restore points are cloned/frozen or otherwise protected from accidental mutation consistently with current entry handling.
- Tool-selection child summaries remain eligible read targets and do not corrupt graph params.

#### Focused Tests

Add or update coverage for:
- `editHistoryStore` stores private child restore points without exposing callbacks through the reader model.
- `editHistoryStore.restoreChild(entryId, childId)` executes the matching restore operation and notifies subscribers.
- `editHistoryStore.restoreChild(...)` returns `null` for missing parent/child targets.
- Closing an accepted Sketch Draw session creates child restore points aligned with public child summaries.
- Restoring child `#1` returns graph params/local history to the first accepted child boundary.
- Restoring the last child matches the full parent redo state.
- Phase 11 child release calls restore after parent-boundary jump.
- If restore fails, the child row remains read-only selected without pretending the model restored.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts
node_modules\.bin\tsc.cmd -b
```

## [x] `Edit-History-Workspace-4 / Phase 3` - `Marker Jump Routing`

### Phase 3 Summary

Allow the user to choose a target point in the timeline and move there through canonical undo/redo.

Phase 3 is the first execution slice for the visible marker. It should turn timeline row choices into a target marker position and then move the canonical owner there by repeatedly calling `editHistoryStore.undo()` or `editHistoryStore.redo()`.

The marker still must not become its own state owner.

### Phase 3 Implementation Spec

#### Scope

Implement click-to-jump behavior for timeline marker targets.

Primary file targets:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/store/editHistoryReaderViewModel.ts` only if a small target-index helper belongs beside the timeline read model
- `src/app/store/editHistoryReaderViewModel.test.ts` only if that helper is added

Phase 3 should not change:
- the canonical edit-history stack data structure
- `editHistoryStore.undo()` / `redo()` semantics
- Phase 1 timeline ordering
- Phase 2 timeline default tab and marker display
- snapshot activity log ownership
- Sketch Draw local history ownership
- checkpoint storage or branch graph behavior

#### Target Marker Index Semantics

Use `targetMarkerIndex` as the one jump coordinate.

Meaning:
- `0` means before all entries
- `model.timeline.appliedCount` means the current marker position
- `model.timeline.entries.length` means after all entries

For a row click:
- clicking an applied row should target the marker position immediately before that row
- clicking a redoable row should target the marker position immediately after that row

Examples:

```text
timeline: A applied, B applied, marker, C redoable, D redoable
current markerIndex: 2

click A applied -> targetMarkerIndex 0 -> undo 2
click B applied -> targetMarkerIndex 1 -> undo 1
click marker -> targetMarkerIndex 2 -> no-op
click C redoable -> targetMarkerIndex 3 -> redo 1
click D redoable -> targetMarkerIndex 4 -> redo 2
```

Reason:
- applied rows represent already-applied history, so choosing one moves the marker back before that row
- redoable rows represent future history, so choosing one moves the marker forward through that row
- the marker row itself remains the current no-op point

If this feels too aggressive in implementation review, the fallback acceptable Phase 3 interaction is to add explicit small row controls such as `Jump before` for applied rows and `Jump through` for redoable rows. Do not add ambiguous jump behavior without tests.

#### Step Calculation

Compute:

```ts
const delta = targetMarkerIndex - model.timeline.markerIndex
```

Then:
- `delta < 0`: call `editHistoryStore.undo()` `Math.abs(delta)` times
- `delta > 0`: call `editHistoryStore.redo()` `delta` times
- `delta === 0`: no-op

Do not mutate arrays, marker indices, or snapshot objects directly.

#### Execution Boundary

Add a small local execution helper if needed, for example:

```ts
const jumpToTimelineMarkerIndex = (targetMarkerIndex: number) => {
  const currentMarkerIndex = model.timeline.markerIndex
  const delta = targetMarkerIndex - currentMarkerIndex
  for (let index = 0; index < Math.abs(delta); index += 1) {
    const movedEntry = delta < 0 ? editHistoryStore.undo() : editHistoryStore.redo()
    if (movedEntry === null) {
      break
    }
  }
}
```

Implementation details can vary, but the behavior must be:
- canonical calls only
- one call per timeline step
- stop if the canonical owner returns `null`
- leave source filtering and selected UI state in a coherent state after the store snapshot updates

#### UI Contract

Clicking timeline rows may execute the jump in Phase 3.

After a jump:
- the Timeline tab should remain active
- the marker should move according to the new store snapshot
- the inspector should show the marker by default, or the nearest coherent selected state if the implementation already has one
- Undo and Redo tabs should still reflect the canonical stacks after the jump

Visual treatment:
- timeline rows that can jump should look actionable without pretending they are normal undo/redo buttons
- marker row should remain visually distinct
- disabled/no-op marker click should not look like a destructive action

Source filtering:
- preserve existing source filtering if practical
- if a filtered timeline row jump moves entries outside the filtered view, the canonical jump still uses the full unfiltered marker index
- tests should cover at least the unfiltered jump path; filtered jump proof can be a follow-up only if Phase 3 stays otherwise small

Sketch Draw pending behavior:
- active Sketch Draw local history remains out of canonical timeline jumps
- do not jump local Sketch Draw command buffers from this marker

#### Checklist

- [ ] Add target marker index derivation for timeline row clicks.
- [ ] Route applied-row target selection to canonical undo calls.
- [ ] Route redoable-row target selection to canonical redo calls.
- [ ] Keep marker-row click as a no-op.
- [ ] Stop execution if the canonical owner returns `null`.
- [ ] Keep Timeline tab active after a jump.
- [ ] Preserve existing Undo, Redo, Sketch Draw, snapshot log, and action-button behavior.
- [ ] Add focused tests for multi-step undo jump from an applied row.
- [ ] Add focused tests for multi-step redo jump from a redoable row.
- [ ] Add focused proof that clicking the marker does not call undo or redo.
- [ ] Add focused proof that jumps update canonical stack contents instead of mutating read-model state.

#### Acceptance Checks

- With `A, B, marker, C, D`, clicking `A` performs two canonical undo calls and moves the marker to index `0`.
- With `A, B, marker, C, D`, clicking `D` performs two canonical redo calls and moves the marker to index `4`.
- Clicking the marker row performs no canonical calls.
- Undo and Redo buttons still work normally after marker jumps.
- Snapshot activity continues to record canonical undo/redo activity from the store.
- Sketch Draw pending/local history is unaffected by marker jumps.
- No private payloads, checkpoint storage, branch graph state, or direct stack mutation are introduced.

#### Verification

Run:

```powershell
node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts
node_modules\.bin\tsc.cmd -b
```

#### Phase 3 Completion Evidence

Implemented:
- Applied timeline row clicks compute a target marker index before that row and execute the needed canonical undo calls.
- Redoable timeline row clicks compute a target marker index after that row and execute the needed canonical redo calls.
- Marker row clicks remain no-op and keep the marker inspector behavior.
- Jump execution clamps target marker indices and stops if the canonical store returns `null`.
- Timeline selection returns to the marker after jump execution so the moved state reads coherently.

Verified:
- `node_modules\.bin\vitest.cmd run src/app/workspace/EditHistoryReaderSurface.test.tsx src/app/store/editHistoryReaderViewModel.test.ts src/app/store/editHistoryStore.test.ts`
- `node_modules\.bin\tsc.cmd -b`

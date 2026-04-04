# Dashboard Phase Dashboard-4.1 - Drag Sticky Notes Between Board Lanes

## Doc Header

### Doc History
3. 2026-04-04 06:40: Refreshed this shipped phase doc after the immediate drag-only cleanup, recording that the temporary sticky-note lane buttons were removed once cross-lane drag was validated, so the current shipped board now uses drag as the only lane-transition interaction while keeping the same dashboard-owned `lane + x + y` persistence model
2. 2026-04-04 06:35: Marked this phase shipped after the cross-lane sticky-note drag implementation landed, recording that sticky notes now preview across the `TO DO` and `Completed` lane boundary during drag, commit dashboard-owned `lane + x + y` placement together on drop, retain the explicit lane buttons as fallback interaction, and pass the focused dashboard verification slice plus `tsc` and production build while the full `AppShell` file still carries 3 unrelated pre-existing failures
1. 2026-04-04 06:30: Added this dedicated `Dashboard-4.1` future phase doc as the next dashboard follow-on after shipped `Dashboard-4`, locking the next interaction upgrade to dragging sticky notes between the existing `TO DO` and `Completed` lanes while keeping lane ownership in the dashboard widget model and leaving the shared notepad note model untouched

### Purpose

Use this phase to upgrade the two-lane sticky-note board so notes can move between lanes by drag and drop instead of only through card buttons.

The goal is not to redesign the dashboard data model.
The goal is to make the existing two-lane board feel more direct while preserving the clean ownership split that `Dashboard-4` established.

### Scope

This phase covers:
- allowing sticky notes to drag from `TO DO` to `Completed`
- allowing sticky notes to drag from `Completed` back to `TO DO`
- translating drop position into the target lane's local coordinate space
- updating both lane assignment and card position from one drop action
- preserving dashboard-owned lane persistence through the existing widget store

This phase does not cover:
- changing the shared note model
- adding more lanes
- adding due dates, priorities, tags, or checklist behavior
- adding note resizing or style presets
- adding new widget families
- console `Workspace Modes` adoption for `Dashboard` or `Notepad`
- popup-local `PopupWorkspaceShell` switching into `Dashboard` or `Notepad`

## Doc Body

### Summary

`Dashboard-4.1` should be the next narrow interaction pass after shipped `Dashboard-4`.

Current baseline:
- sticky notes already live in fixed `TO DO` and `Completed` lanes
- lane ownership already lives in the dashboard widget model
- drag already works for placement inside the current lane

That means the next honest slice is not a new board model.
The next honest slice is interaction polish:
- keep the same two lanes
- keep the same dashboard-owned `lane + x + y` model
- upgrade drag so dropping over the other lane changes the note's lane automatically

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/workspace/DashboardSurface.tsx`
  - already owns sticky-note pointer drag behavior
  - already has lane board refs and lane-local board rectangles
  - is the right place to detect which lane the note is currently over during drag and on drop
- `src/app/dashboard/useDashboardStore.ts`
  - already owns lane assignment and position state
  - should remain the only owner of persisted lane and coordinate updates
  - may need one combined action if the current separate lane and position writes feel too loose for drop commits
- `src/app/dashboard/dashboardTypes.ts`
  - already has the right small persisted layout shape
  - probably should stay unchanged unless one drag-state helper field truly proves necessary
- `src/app/dashboard/useDashboardStore.test.ts`
  - already covers lane assignment and persistence
  - should gain focused coverage for cross-lane drop commits if store helpers widen
- `src/app/AppShell.test.tsx`
  - already covers dashboard sticky-note behavior and drag persistence
  - is the natural place for an end-to-end drag-across-lanes test
- `src/app/theme/foundation/base.css`
  - already styles the two-lane board
  - may only need small visual affordances like hover or active-lane feedback

### Locked Direction

`Dashboard-4.1` should:
- keep note content in `Notepad`
- keep lane ownership in the dashboard widget model
- reuse the existing two-lane board
- make cross-lane drag update both lane and local board position

`Dashboard-4.1` should not:
- add task-state to the shared note model
- introduce custom lane creation
- push more dashboard-only orchestration into `AppShell.tsx`
- widen into a general Kanban or task-management system

### Product Shape

The upgraded interaction should feel like:
- grab a sticky note in `TO DO`
- drag it over the `Completed` lane
- release it
- the card lands inside `Completed` at a sensible local position

And the reverse should work the same way:
- drag from `Completed`
- drop into `TO DO`
- persist the new lane and local placement

Helpful follow-through:
- lane hover or active-drop feedback would be good if it stays visually light

### Implementation Shape

The likely first implementation cut is:

1. Teach the drag path in `DashboardSurface.tsx` to resolve which lane board the pointer is currently over.
2. On drop, compute the target lane-local position from that lane board's bounding rect.
3. Commit the new lane and coordinates together through the dashboard store.
4. Preserve the existing same-lane drag behavior when the note never crosses into the other lane.
5. Add focused coverage for cross-lane drop and persisted restore.

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/useDashboardStore.test.ts`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

### Main Risks

The main risks in this phase are:

- computing target-lane coordinates incorrectly on drop
- creating drag logic that feels jumpy at the lane seam
- scattering lane-switch logic between component state and store state
- widening the interaction so far that the dashboard board becomes harder to reason about

Healthy rule:
- one dashboard-owned persisted truth
- one surface-owned drag interaction
- no note-model widening

## [x] Phase Checklist

- [x] Allow sticky notes to drag across the `TO DO` and `Completed` lane boundary
- [x] Commit lane assignment and lane-local coordinates together on drop
- [x] Preserve same-lane drag behavior for ordinary card repositioning
- [x] Keep dashboard persistence restoring the new lane and position correctly
- [x] Add focused regression coverage for cross-lane drag and drop
- [x] Keep note content ownership in `Notepad` and lane ownership in the dashboard widget model
- [x] Keep multi-lane expansion, task metadata, resizing, style presets, extra widgets, console workspace-modes adoption, and popup-local switching deferred

## [x] Verification Shape

Minimum verification for this phase should cover:

- dragging a sticky note from `TO DO` into `Completed`
- dragging a sticky note from `Completed` back into `TO DO`
- confirming the drop commits both lane assignment and lane-local coordinates together
- confirming ordinary same-lane drag placement still works
- confirming the dropped lane and position persist after reload
- confirming the shared notepad note model remains unchanged

Recommended verification commands for the implementation pass:
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts src/app/AppShell.test.tsx -t dashboard`
- `npx.cmd tsc -p tsconfig.json --noEmit`
- `npm.cmd run build`

Actual verification run for the shipped pass:
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts src/app/AppShell.test.tsx -t dashboard`
- `npm.cmd test -- --run src/app/AppShell.test.tsx`
- `npx.cmd tsc -p tsconfig.json --noEmit`
- `npm.cmd run build`

Verification note:
- the focused dashboard slice passed
- the full `src/app/AppShell.test.tsx` run still has 3 unrelated pre-existing failures outside the dashboard scope

## [x] Done Shape

`Dashboard-4.1` is done when:

- users can drag sticky notes between `TO DO` and `Completed`
- dropped notes persist in the new lane after reload
- lane-local placement still feels stable
- the shared note model stays unchanged
- the board interaction feels more direct without making the architecture messier

Current shipped status:
- sticky notes now preview across the `TO DO` and `Completed` lane boundary during drag
- drop now commits `lane + x + y` together through the dashboard-owned widget store
- the active drop-target lane highlights during drag and lane movement now happens through drag only

# Dashboard Phase Dashboard-4 - Add To Do And Completed Board Lanes For Sticky Notes

## Doc Header

### Doc History
3. 2026-04-03 22:14: Marked this phase shipped after the live two-lane board implementation landed, recording that sticky notes now persist dashboard-owned `todo | completed` lane placement, render inside fixed `TO DO` and `Completed` board regions, move across lanes through explicit card actions, and keep the shared notepad note model clean while verification confirmed the focused dashboard slice, `tsc`, and production build
2. 2026-04-03 22:10: Tightened this phase doc into an implementation-ready first board-organization slice by re-reading the live dashboard store and board-render seams, locking lane ownership to the dashboard widget model, choosing explicit lane-move actions as the first safe cross-lane interaction instead of broad lane-drag complexity, and sharpening the exact file targets, execution order, and verification shape
1. 2026-04-03 22:04: Added this dedicated `Dashboard-4` future phase doc after `Dashboard-3` shipped, locking the next dashboard slice to two board lanes named `TO DO` and `Completed`, keeping that lane state dashboard-owned instead of note-model-owned, and grounding the phase in the live sticky-note board plus dashboard widget persistence seams

### Purpose

Use this phase to give the sticky-note dashboard board its first real task-flow structure.

The goal is not to turn notes into a global task system.
The goal is to let the existing sticky-note board organize pinned notes into two clear dashboard lanes without polluting the shared note model.

### Scope

This phase covers:
- adding two fixed dashboard lanes named `TO DO` and `Completed`
- storing sticky-note lane placement in the dashboard-owned widget model
- rendering sticky notes inside the correct lane area
- supporting moving notes between those two lanes
- persisting lane placement with the existing dashboard widget persistence layer
- keeping the existing open-in-notepad and unpin behavior working inside the two-lane board

This phase does not cover:
- a global task schema in the notepad note model
- due dates
- tags
- priorities
- board groups beyond the two fixed lanes
- multiple boards
- sticky note style presets or resizing
- extra widget families
- console `Workspace Modes` adoption for `Dashboard` or `Notepad`
- popup-local `PopupWorkspaceShell` switching into `Dashboard` or `Notepad`

## Doc Body

### Summary

`Dashboard-4` should be the first board-organization phase after sticky notes became real in `Dashboard-3`.

Current baseline:
- `Dashboard` already renders pinned notes as draggable sticky-note cards
- sticky-note placement already persists through the dashboard-owned widget store
- `Notepad` already owns the shared note model and pin state

That means the next honest slice is not richer note content.
The next honest slice is board structure:
- one `TO DO` lane
- one `Completed` lane
- lane placement owned by `Dashboard`, not by `Notepad`

Implementation-ready first-pass rule:
- keep drag for card placement inside the current lane
- use explicit card actions to move a sticky note between `TO DO` and `Completed`

This keeps the first cut clean and reliable while still delivering the product behavior the board needs.

### Current Code-Backed Read

The strongest owner seams for this phase are now:

- `src/app/dashboard/useDashboardStore.ts`
  - already owns sticky-note placement metadata by note id
  - is the right place to widen the sticky-note layout shape with lane ownership
  - should also own a small lane-change action rather than pushing that logic into the surface
- `src/app/dashboard/dashboardTypes.ts`
  - currently defines the persisted sticky-note layout record
  - should become the canonical place for a small lane union like `todo | completed`
- `src/app/dashboard/useDashboardStore.test.ts`
  - already covers seeding and persistence for sticky-note layouts
  - is the natural place to add lane-seeding, lane-preservation, and lane-move coverage
- `src/app/dashboard/dashboardPersistence.ts`
  - already persists dashboard widget layout separately from both workspace layout and notepad note content
  - should absorb lane persistence as part of the same sticky-note layout record
- `src/app/workspace/DashboardSurface.tsx`
  - already renders the board and sticky-note cards
  - should become the render owner for the two-lane layout
  - should keep lane-to-lane movement limited to explicit card actions in the first pass
- `src/app/notepad/useNotepadStore.ts`
  - already owns the shared note content and `isPinned`
  - should stay unchanged for task-lane ownership unless a later feature truly needs a cross-surface task model
- `src/app/AppShell.tsx`
  - already hydrates dashboard widget persistence
  - should only need narrow persistence-shape widening, not new dashboard-specific orchestration
- `src/app/AppShell.test.tsx`
  - already covers sticky-note rendering, open-in-notepad behavior, and persistence
  - should gain focused lane render and lane-restore tests rather than a broad new dashboard test harness

### Locked Direction

`Dashboard-4` should:
- keep note content in the existing notepad store
- keep `isPinned` in the existing shared note model
- add lane placement as dashboard-owned metadata only
- treat `TO DO` and `Completed` as board lanes, not as a global note status system

`Dashboard-4` should not:
- add `isCompleted` or similar task status fields to the shared notepad note model in this phase
- widen into due dates, task priorities, or checklist systems
- introduce more than the two fixed lanes yet
- reopen `AppShell.tsx` with dashboard-only conditional behavior

### Locked Ownership Split

The ownership split should stay:

- `useNotepadStore.ts`
  - owns note identity
  - owns title and body
  - owns pin state
- `useDashboardStore.ts`
  - owns board placement
  - owns lane assignment
  - owns later board-only organization metadata

Healthy rule:
- `Notepad` answers what the note is
- `Dashboard` answers where the pinned note lives on the board

### Locked First Lane Model

The sticky-note layout model should stay intentionally small even after this phase.

Recommended shape:
- `noteId`
- `lane`
- `x`
- `y`

Recommended lane union:
- `todo`
- `completed`

Important constraint:
- keep lanes fixed in this phase
- do not add custom lane creation yet

### Product Shape

The first board-lane version only needs:
- one visible `TO DO` area
- one visible `Completed` area
- sticky notes rendered inside the proper lane
- a way to move notes from one lane to the other
- stable persisted restore after reload

Locked first movement truth:
- drag within a lane should still move card position
- lane changes should happen through one explicit card action:
  - `Move to Completed` from `TO DO`
  - `Move to TO DO` from `Completed`

Important reason:
- the current sticky-note board uses absolute card placement in one shared board surface
- explicit lane-change actions are the safer first cut than broad drag-across-lane hit-testing, lane snapping, and coordinate translation
- later phases can upgrade lane transitions into full drag-across-lane behavior if that still feels worth it

### Exact First Code Cut

The implementation-ready first cut is:

1. Widen the dashboard sticky-note layout type so each pinned note stores a `lane`.
2. Update dashboard persistence normalization and serialization so lane placement restores safely.
3. Update `useDashboardStore.ts` with:
   - lane-aware default seeding
   - lane change action
   - lane-scoped position updates
   - reconcile behavior that preserves existing lane assignments
4. Rework `DashboardSurface.tsx` so the board renders two explicit lane regions:
   - `TO DO`
   - `Completed`
5. Keep sticky-note card rendering mostly intact, but scope each card to its lane container and lane-local placement space.
6. Add one explicit lane-move action to each card while preserving existing unpin and open-in-notepad behavior.
7. Add focused tests for lane seeding, lane persistence, lane restore, and lane movement, then stop without widening into cross-lane drag.

### Likely Files

- `src/app/dashboard/dashboardTypes.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/useDashboardStore.test.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/foundation/base.css`

Strong likely non-file:
- `src/app/AppShell.tsx` probably should not need meaningful new logic beyond the already-shipped dashboard persistence seam

### UI Direction

The safest first lane layout is:
- two clear column lanes
- one labeled `TO DO`
- one labeled `Completed`
- cards still feel like sticky notes, not Kanban software chrome
- lane actions stay small and obvious rather than turning each card into dense productivity chrome

The board should feel more organized, but still calm and lightweight.

### Implementation Risks

The most likely risks in this phase are:

- pushing task-state into the shared note model too early
- widening the first lane pass into a full task-management system
- making lane rendering so custom that `DashboardSurface.tsx` becomes hard to extend later
- overcomplicating lane drag behavior when a simpler first lane-move seam is already enough to ship the product value

Healthy rule:
- explicit lane-move actions are the locked first implementation
- keep the architecture clean even if the first UX is slightly simpler than a full drag-across-lane board

## [x] Phase Checklist

- [x] Add `lane` to the dashboard-owned sticky-note layout model without widening the shared notepad note model
- [x] Persist lane placement through the existing dashboard widget persistence layer
- [x] Render two explicit board lanes named `TO DO` and `Completed`
- [x] Keep sticky notes scoped to their current lane while preserving note content ownership in `Notepad`
- [x] Support moving sticky notes between lanes through explicit card actions
- [x] Keep unpin and open-in-notepad behavior working from both lanes
- [x] Add focused regression coverage for lane seeding, lane persistence, lane restore, and lane movement
- [x] Keep cross-lane drag, style presets, resizing, due dates, priorities, extra widgets, console workspace-modes adoption, and popup-local switching deferred

## [x] Verification Shape

Minimum verification for this phase should cover:

- pinning a note and confirming it appears in the default `TO DO` lane
- moving a note into `Completed` and confirming the lane change persists after reload
- moving a completed note back into `TO DO`
- confirming card positions still persist within each lane
- confirming unpin still removes the sticky note without deleting the note
- confirming open-in-notepad still activates the expected note
- confirming note content still comes from the shared notepad note model rather than duplicated dashboard state

Recommended verification commands for the first implementation pass:
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
- the full `src/app/AppShell.test.tsx` run no longer carries a dashboard-specific failure, but it still has 3 unrelated pre-existing failures outside the dashboard scope

### Done Shape

`Dashboard-4` is done when:

- the board has two real task-oriented areas
- sticky notes can live in either `TO DO` or `Completed`
- lane placement persists cleanly through the dashboard-owned store
- the shared note model stays clean and generic
- later style and board-polish work can build on a clearer organization model

Current shipped status:
- sticky notes now render inside real `TO DO` and `Completed` lane regions
- lane assignment persists through the dashboard-owned widget store and stays out of the shared notepad note model
- notes move between lanes through explicit card actions while drag remains lane-local for placement

# Dashboard Phase Dashboard-3 - Add Sticky Notes As The First Dashboard Widget

## Doc Header

### Doc History
2. 2026-04-03 21:58: Updated this phase doc after the shipped `Dashboard-3` implementation so it now records sticky notes as the first live dashboard widget, confirms the clean owner split between shared notepad note content and dashboard-owned placement persistence, and marks the phase complete with the real verification shape plus remaining deferred follow-ons
1. 2026-04-03 21:43: Added this dedicated `Dashboard-3` future phase doc by lifting `Phase 3 - Add Sticky Notes As The First Dashboard Widget` out of the umbrella `Dashboard.md`, grounding it in the live post-`Dashboard-2` seams where `Dashboard` is still a static board shell and `Notepad` already owns the shared note model plus `isPinned`, and locking the next slice to first sticky-note card rendering, drag placement, and dashboard-owned widget layout persistence without widening into styling, board organization, or extra widget families

### Purpose

Use this phase to make `Sticky Notes` real as the first actual widget family inside `Dashboard`.

The goal is not to redesign the whole dashboard system.
The goal is to connect the already-shipped `Notepad` note model to the already-shipped `Dashboard` surface through one honest sticky-note widget path.

### Scope

This phase covers:
- rendering pinned notes inside `Dashboard` as sticky-note cards
- reading note content from the shared notepad note model
- introducing one dashboard-owned sticky-note layout model
- supporting drag placement for sticky notes on the dashboard board
- supporting pin and unpin behavior through the shared note model
- supporting opening a sticky note back into `Notepad`
- adding narrow sticky-note widget persistence and restore outside both workspace layout persistence and notepad note persistence

This phase does not cover:
- sticky note style presets
- note resizing
- board groups or named boards
- tags
- rich text
- additional dashboard widgets
- console `Workspace Modes` adoption for `Dashboard` or `Notepad`
- popup-local `PopupWorkspaceShell` switching into `Dashboard` or `Notepad`

## Doc Body

### Summary

`Dashboard-3` is the first real widget phase for the dashboard family.

Current baseline:
- `Dashboard` already exists as a real workspace surface
- `Notepad` already owns the shared note model and `isPinned`
- pinned notes now render inside `Dashboard` as draggable sticky-note cards with dedicated dashboard-owned placement persistence

Shipped result:
- kept note content in `Notepad`
- let `Dashboard` read pinned notes from that shared note model
- let `Dashboard` own only sticky-note widget placement state and persistence

Remaining later follow-ons still stay out of this phase:
- sticky note style presets and resizing
- board organization
- extra widgets
- console `Workspace Modes` adoption
- popup-local `PopupWorkspaceShell` switching

### Current Code-Backed Read

The strongest owner seams for this phase are now:

- `src/app/workspace/DashboardSurface.tsx`
  - now renders pinned notes as sticky-note cards
  - owns the first board-level drag and empty-state experience
- `src/app/hosts/DashboardWindowHost.tsx`
  - already owns floating and popout dashboard host rendering
  - keeps detached dashboard widget behavior isolated from `AppShell.tsx`
- `src/app/notepad/useNotepadStore.ts`
  - already owns the shared note model
  - already exposes `setNotePinned(...)`
  - already keeps `isPinned` in the canonical note record
- `src/app/notepad/notepadTypes.ts`
  - currently defines the shared first-pass note model
  - should stay the source of note content truth rather than being duplicated for sticky cards
- `src/app/notepad/notepadPersistence.ts`
  - already persists note content separately from workspace layout
  - should remain note-content-only rather than absorbing board widget layout
- `src/app/notepad/NotepadSurface.tsx`
  - already exposes `Pin to Dashboard` and `Unpin`
  - should stay a writing surface, not become responsible for dashboard card rendering
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - already renders `DashboardSurface` in slotted hosts
  - now passes the slot-aware open-in-notepad callback seam
- `src/app/workspace/useWorkspaceStore.ts`
  - already owns slot and detached-surface placement
  - now owns one small generic detached-surface kind-switch helper for detached dashboard-to-notepad handoff
- `src/app/AppShell.tsx`
  - already hydrates workspace layout and notepad note persistence
  - now hydrates dashboard-widget persistence through a narrow dedicated path
- `src/app/dashboard/useDashboardStore.ts`
  - now owns sticky-note widget placement only
  - stays cleanly separate from note-content ownership
- `src/app/dashboard/dashboardPersistence.ts`
  - now owns dedicated dashboard widget persistence under `parahook.dashboard.widgets.v1`

### Locked Direction

`Dashboard-3` landed by:
- keep note content in the existing notepad store
- treat sticky notes as a dashboard view of pinned notes, not as a second note system
- introduce one small dashboard-owned widget layout store
- make the first board interaction real through drag placement only

`Dashboard-3` should not:
- move note bodies into a dashboard store
- add style presets or board-organization fields yet
- widen into a generic dashboard plugin system
- reopen `AppShell.tsx` with dashboard-specific condition trees

### Locked Sticky Note Ownership

The ownership split should stay simple:

- `useNotepadStore.ts`
  - owns note identity
  - owns note title and body
  - owns `isPinned`
- new dashboard store under `src/app/dashboard/`
  - owns sticky-note widget placement metadata only
  - owns board-facing widget persistence only
- `workspacePersistence.ts`
  - still owns workspace layout only

Healthy constraint:
- `Notepad` answers which notes exist and whether they are pinned
- `Dashboard` answers where pinned sticky notes sit on the board
- workspace layout only answers where the `Dashboard` surface itself lives

### Locked First Widget Model

The first sticky-note widget model should stay intentionally small:

- `noteId`
- `x`
- `y`

Recommended truth:
- use one fixed card size in `Phase 3`
- do not add width, height, color, style preset, or board grouping yet
- if a card needs future style or resize state, add that in `Dashboard-4`

Recommended persistence key shape:
- `parahook.dashboard.widgets.v1`

### Locked Product Shape

The first shipped sticky-note dashboard surface only needs:
- show all pinned notes as cards on the board
- drag cards to new positions
- unpin a note from the card
- open a note back into `Notepad`
- show a clear empty state when no notes are pinned

It does not need:
- inline body editing on the board
- color themes
- resize handles
- snapping or grouping systems
- multiple dashboard boards

### Important Architecture Rule

Sticky-note layout persistence should stay separate from both note-content persistence and workspace-layout persistence.

That means:
- `notepadPersistence.ts` should continue to persist note records only
- the new dashboard persistence layer should persist sticky-note placement only
- `workspacePersistence.ts` should continue to persist workspace slots and host modes only

If those layers start impersonating each other, the architecture is drifting.

### Open-In-Notepad Rule

Opening a sticky note back into `Notepad` should stay honest to the current workspace architecture.

Recommended first truth:
- `DashboardSurface` should receive one explicit `open note in notepad` callback seam
- slotted dashboard hosts can switch the current slot into `notepad` after setting the active note
- if floating or popout dashboard hosts need host-mode-preserving `Dashboard -> Notepad` switching, add one small generic detached-surface surface-kind replacement helper instead of special-casing dashboard logic in `AppShell.tsx`

Important constraint:
- do not solve this by adding dashboard-only imperative AppShell branching

### Exact First Code Cut

The implementation-ready first cut is:

1. Add a small dashboard feature folder under `src/app/dashboard/` with:
   - one sticky-note widget type file if needed
   - one `useDashboardStore.ts`
   - one `dashboardPersistence.ts`
2. Keep the first dashboard store narrow:
   - sticky-note layouts keyed by `noteId`
   - hydrate and serialize actions
   - set-position action
   - small helper to seed default placement for newly visible pinned notes
3. Rework `DashboardSurface.tsx` so it reads pinned notes from `useNotepadStore.ts` and sticky-note layout metadata from the new dashboard store.
4. Render pinned notes as fixed-size cards with drag interaction and an empty state when no notes are pinned.
5. Reuse the existing `setNotePinned(...)` seam so cards can unpin notes without inventing a second pin owner.
6. Add an explicit `open sticky note in notepad` callback seam across `ViewportSurfaceRegistry.tsx` and `DashboardWindowHost.tsx`, and only widen workspace host helpers further if detached host-mode continuity truly requires it.
7. Add dashboard-widget persistence hydration and autosave through the new dashboard persistence module.
8. Add focused tests, then stop without widening into sticky-note styling, resizing, board organization, or extra widget families.

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/hosts/DashboardWindowHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/AppShell.tsx`
- `src/app/notepad/useNotepadStore.ts`
- `src/app/notepad/NotepadSurface.tsx`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- possibly one small dashboard widget type file under `src/app/dashboard/`
- focused tests around sticky-note layout, drag persistence, pin or unpin behavior, and open-in-notepad behavior

### Recommended New Files

- `src/app/dashboard/useDashboardStore.ts`
  - own sticky-note widget placement only
  - stay dashboard-owned, not note-owned
- `src/app/dashboard/dashboardPersistence.ts`
  - own localStorage read and write for dashboard widget layout only
  - use a dedicated key such as `parahook.dashboard.widgets.v1`

### First Pass UI Direction

The safest first sticky-note board shape is:
- one calmer board canvas
- one fixed-size sticky-note card shape
- a visible card header for drag and actions
- body preview text, not full editor chrome

The first board should feel like notes have actually arrived, but it should still look like one disciplined widget family rather than a full productivity canvas.

### Follow-On Seams Already Known

These are real later follow-ons, but they should stay out of `Dashboard-3`:

- `Dashboard-4`
  - color or style presets
  - optional resize
  - better board organization
- extra dashboard widgets
  - time
  - weather
  - later project utilities
- `src/app/console/stagedNavigation.ts`
  - later add `Dashboard` and `Notepad` to console workspace-mode flows
- `src/app/console/radioCommandIdentity.ts`
  - later add matching workspace-mode identities
- `src/app/workspace/PopupWorkspaceShell.tsx`
  - later decide whether popup-local child-window shells also need dashboard and notepad widget transitions

### Implementation Risks

The most likely risks in this phase are:

- duplicating note content into a dashboard store
- pushing sticky-note placement data into `Notepad` note records too early
- overbuilding the first board interaction before style and organization requirements are actually ready
- handling `open in notepad` through dashboard-only AppShell branching instead of one explicit reusable seam
- silently widening the work into a generic dashboard-widget architecture before the first widget is even stable

Healthy constraint:
- if this phase discovers a real reusable detached-surface kind-switch helper, document it clearly
- but do not widen `Dashboard-3` into a broad host architecture rewrite unless the blocker is real and explicit

## [x] Phase Checklist

- [x] Add a dashboard-owned sticky-note layout store outside both `useNotepadStore.ts` and `useWorkspaceStore.ts`
- [x] Add narrow sticky-note widget persistence outside note-content persistence and workspace-layout persistence
- [x] Rework `DashboardSurface.tsx` so it renders pinned notes as sticky-note cards
- [x] Keep note title, body, and `isPinned` ownership in the shared notepad note model
- [x] Add fixed-size sticky-note drag placement on the dashboard board
- [x] Support unpinning from the sticky-note card without deleting the note
- [x] Support opening a sticky note back into `Notepad`
- [x] Add focused regression coverage for sticky-note layout, pin or unpin behavior, persistence, and host-mode behavior
- [x] Keep styling, resizing, board organization, extra widgets, console workspace-modes adoption, and popup-local switching deferred

## [x] Verification Shape

Minimum verification for this phase should cover:

- [x] pinning a note in `Notepad` and confirming it appears on `Dashboard`
- [x] unpinning a sticky note from `Dashboard` and confirming the note still exists in `Notepad`
- [x] dragging a sticky note and confirming its position persists after reload
- [x] reloading with multiple pinned notes and confirming the board restores stable positions
- [x] opening a sticky note back into `Notepad` and confirming the expected note becomes active
- [x] confirming dashboard cards read the same note content already shown in `Notepad`
- [x] confirming workspace layout persistence still only owns the `Dashboard` surface itself, not sticky-note board state

Actual verification run:
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts src/app/workspace/useWorkspaceStore.test.ts src/app/AppShell.test.tsx -t dashboard`
- `npx.cmd tsc -p tsconfig.json --noEmit`
- `npm.cmd run build`

Additional note:
- `npm.cmd test -- --run src/app/dashboard/useDashboardStore.test.ts src/app/workspace/useWorkspaceStore.test.ts src/app/AppShell.test.tsx` still reports 3 unrelated pre-existing `AppShell.test.tsx` failures outside this dashboard scope

### Done Shape

`Dashboard-3` is done when:

- pinned notes actually appear inside `Dashboard`
- the board has one honest first widget family instead of placeholder space
- note content still has one shared owner in `Notepad`
- sticky-note placement has one separate dashboard-owned owner path
- later styling and organization work can build on a real widget system instead of another placeholder shell

Current shipped status:
- this acceptance shape is now met through the live sticky-note widget path
- the next honest planning step is `Dashboard-4` rather than more `Dashboard-3` widening

# Dashboard Phase Dashboard-6 - User-Managed Board Lanes And Resizable Columns

## Doc Header

### Doc History
1. 2026-04-04 08:32: Closed `Phase 3 - Add Resizable Lane Widths And Layout Polish` after shipping adjacent-lane width resizing through vertical splitter bars, persisting the resized lane widths through the dashboard store, updating focused dashboard store and AppShell regressions, and verifying the slice through dashboard tests, `tsc`, and production build
1. 2026-04-04 08:25: Prepared `Phase 3 - Add Resizable Lane Widths And Layout Polish` for implementation by re-reading the live lane-width seams in `src/app/dashboard/useDashboardStore.ts`, `src/app/workspace/DashboardSurface.tsx`, `src/app/theme/foundation/base.css`, and the current dashboard integration coverage in `src/app/AppShell.test.tsx`, then tightening this phase around the exact runtime owner files, locked first-cut resize rules, execution order, exclusions, and verification shape for the vertical splitter pass
1. 2026-04-04 08:21: Closed `Phase 2 - Implement User-Managed Lanes` after shipping the dashboard runtime widening from hardcoded lanes to durable lane records plus `laneId` note placement, adding create/rename/delete lane flows with explicit note migration, updating focused dashboard store and AppShell regressions, and verifying the slice through dashboard tests, `tsc`, and production build
1. 2026-04-04 08:07: Prepared `Phase 2 - Implement User-Managed Lanes` for implementation by re-reading the live fixed-lane runtime seams in `src/app/dashboard/useDashboardStore.ts`, `src/app/dashboard/dashboardPersistence.ts`, `src/app/workspace/DashboardSurface.tsx`, and the existing dashboard regressions in `src/app/AppShell.test.tsx`, then tightening this phase around the exact runtime owner files, execution order, exclusions, and verification shape for widening the board from hardcoded lanes to stable `laneId` records
1. 2026-04-04 08:06: Closed `Phase 1 - Lock Dynamic Lane Contract` by marking the dynamic-lane contract questions answered, turning the first-cut lane-model decisions into explicit locked output, and leaving `Phase 2` as the next runtime implementation slice for widening the dashboard from fixed lanes to user-managed lane records
1. 2026-04-04 08:00: Prepared `Phase 1 - Lock Dynamic Lane Contract` for implementation by re-reading the live fixed-lane seams in `src/app/dashboard/useDashboardStore.ts`, `src/app/dashboard/dashboardPersistence.ts`, and `src/app/workspace/DashboardSurface.tsx`, then tightening this phase around the exact model decisions, owner files, execution order, and verification shape needed before widening the dashboard board to user-managed lanes
1. 2026-04-04 07:59: Reworked this `Dashboard-6` phase doc into an explicit sub-phase ladder so the dynamic-lane follow-on now breaks into a contract-and-data-model lock, a user-managed lane runtime slice, and a later vertical-resize plus polish slice instead of staying one oversized execution bucket
1. 2026-04-04 07:56: Added this dedicated `Dashboard-6` future phase doc as the next dashboard-family follow-on after shipped `Dashboard-5.2`, reframing the board from two fixed lanes into a user-managed lane system with add/remove behavior, a one-lane minimum, default seeded lanes, and resizable vertical dividers, while collecting the key design questions with concrete suggested answers before implementation

### Purpose

Use this phase to replace the fixed `TO DO` and `Completed` board split with user-managed lanes that can be added, removed, renamed, and resized.

The goal is not to widen immediately into a fully generic kanban framework or dashboard widget-layout system.
The goal is to promote the current lane model into a durable board structure the user can shape while preserving the current sticky-note and lane-camera interaction language.

### Scope

This phase covers:
- replacing the fixed two-lane dashboard board with a user-managed lane model
- keeping one minimum required lane
- seeding new dashboards with two default lanes named `TO DO` and `Completed`
- allowing users to add lanes
- allowing users to rename lanes
- allowing users to remove lanes when more than one remains
- introducing vertical dividers between lanes so users can resize lane widths
- persisting lane structure and lane widths in the dashboard-owned board model
- keeping sticky-note placement owned by the dashboard model and keyed by lane identity rather than lane label text

This phase does not cover:
- generalized board templates
- lane color presets in the first cut
- lane collapse
- lane reordering in the first cut
- WIP rules
- subtasks or checklist behavior
- full zoom tooling
- cross-board presets or board duplication

## Doc Body

### Summary

`Dashboard-6` should be the next structural follow-on after shipped `Dashboard-5.2`.

Current baseline:
- the dashboard board now has a real per-lane camera
- sticky-note placement is lane-local and dashboard-owned
- the current lane set is still fixed to two built-in buckets: `TO DO` and `Completed`

Important read:
- the board now behaves enough like a real surface that the remaining limitation is not camera feel
- the next product limitation is board structure: users still cannot shape the lane system to match their own workflow
- if the board is meant to become a real organizational surface, the next honest step is to promote lanes from hardcoded buckets into user-managed board structure

The next honest slice is:
- make `lane` the canonical board-structure concept
- seed new dashboards with `TO DO` and `Completed`
- let the user add, rename, remove, and resize lanes while preserving at least one lane

### Naming Suggestion

Canonical technical term:
- `lane`

Suggested user-facing wording:
- keep visible lane headers as just the lane names
- optionally use softer helper wording like `list` or `column` in onboarding copy if that reads more naturally

Why this suggestion is healthier:
- the current board already behaves more like a lane-based canvas than a plain text list
- sticky notes move between containers like a board system, not a note list view
- future ideas such as lane color, lane collapse, lane camera, lane rules, or lane reorder all fit the word `lane` more naturally than `list`

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/dashboard/useDashboardStore.ts`
  - already owns sticky-note lane assignment and lane-local placement persistence
  - is the correct place for durable lane metadata such as lane identity, order, and width
  - currently still assumes a fixed lane set, so this is the main structural seam that needs widening
- `src/app/workspace/DashboardSurface.tsx`
  - already renders lane headers, lane surfaces, fit actions, and local per-lane camera state
  - is the correct place for add-lane UI, lane-header actions, and vertical lane-resize interactions
  - should keep ephemeral UI state local while reading durable lane structure from the dashboard store
- `src/app/AppShell.test.tsx`
  - already covers sticky-note rendering, drag, inline editing, lane movement, and lane-camera behavior
  - is the right place for end-to-end regressions around lane add/remove/resize behavior
- `src/app/notepad/useNotepadStore.ts`
  - should remain unchanged as the note-content owner
  - should not absorb lane structure, lane names, or board-width logic

### Suggested Direction

`Dashboard-6` should:
- replace the hardcoded lane pair with persisted lane records
- keep sticky notes assigned by stable `laneId`
- let users shape the board while preserving one minimum lane
- persist lane widths as part of the dashboard-owned board structure
- keep lane-camera state local unless later persistence becomes clearly worth it

`Dashboard-6` should not:
- key sticky-note placement off lane title text
- push lane structure into the shared note model
- widen immediately into drag-reorder, collapse, templates, or generalized board presets

Recommended first-cut lane shape:
- `id`
- `title`
- `order`
- `width`

Recommended note-placement truth:
- sticky notes should reference `laneId`
- lane delete behavior should migrate notes before the lane record is removed

### Questions / Decisions

#### [x] Question 1 - What should the canonical concept be called in code and docs: `lane`, `list`, or `column`?

##### Suggestion
- use `lane` as the canonical system term

##### Why
- it matches the current board behavior better than `list`
- it leaves room for richer board behavior without renaming later
- it stays consistent with the existing dashboard lane history

#### [x] Question 2 - Should new dashboards still start with `TO DO` and `Completed`, or start with one blank lane?

##### Suggestion
- still seed two default lanes: `TO DO` and `Completed`

##### Why
- it preserves the current dashboard onboarding shape
- it gives users an immediate useful starting structure
- it still allows later subtraction down to one lane if that is what they want

#### [x] Question 3 - How should lane identity be modeled once lane names become editable?

##### Suggestion
- give each lane a stable `id` and treat the title as editable display text only

##### Why
- it prevents sticky-note placement and lane cameras from coupling to rename behavior
- it makes add/remove/migrate flows much safer
- it creates the right base for later lane reorder support

#### [x] Question 4 - What is the minimum lane count?

##### Suggestion
- require at least one lane at all times

##### Why
- it avoids the empty-board edge case where notes have nowhere valid to live
- it keeps the board concept understandable
- it matches the user request directly

#### [x] Question 5 - What should happen when the user deletes a lane that still contains notes?

##### Suggestion
- first cut should require choosing a destination lane before delete completes

##### Why
- it is safer than silently moving notes in a surprising way
- it keeps note migration explicit
- it reduces the risk of “where did my notes go?” confusion

Cheaper fallback if the first cut must stay smaller:
- auto-move notes into the nearest remaining lane by visual order

#### [x] Question 6 - How should lane widths be stored?

##### Suggestion
- persist a durable width value per lane in the dashboard store

##### Why
- the user is explicitly shaping the board layout, so width is part of the board structure
- widths should survive reload just like lane membership does
- storing width with the lane record is simpler than deriving it from viewport math later

Recommended first-cut truth:
- use one stored width value per lane
- enforce a minimum visible width so lane headers and notes remain usable

#### [x] Question 7 - Should lane resizing use vertical splitter bars between lanes?

##### Suggestion
- yes, use explicit vertical dividers between adjacent lanes

##### Why
- it matches the user mental model directly
- it is discoverable and precise
- it keeps resizing scoped to adjacent lanes instead of forcing a more complex board layout editor

#### [x] Question 8 - Should lane camera state persist through add/remove/resize in this same phase?

##### Suggestion
- keep lane camera transient, but preserve it across ordinary re-renders and recalculate sensibly when lane structure changes

##### Why
- the board structure change is already a meaningful widening of the dashboard store
- camera persistence is still a separate product choice
- keeping camera local prevents this phase from growing into lane-layout-plus-camera-restore all at once

Recommended first-cut truth:
- local lane cameras remain ephemeral
- lane add gets a default camera
- lane delete drops that lane camera
- lane resize may clamp the active camera if the visible viewport changes

### Likely Files

- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/dashboardTypes.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

### Main Risks

The main risks in this phase are:

- coupling sticky-note placement to lane title text instead of lane identity
- widening lane deletion into a dangerous note-loss path
- adding resizable widths without a strong minimum-width rule
- mixing durable lane structure with transient lane camera state
- overreaching into reorder, collapse, or kanban-template behavior before the basic dynamic-lane model is stable

Healthy rule:
- note content stays in the notepad model
- lane structure, lane widths, and sticky-note placement stay in the dashboard model
- lane camera stays a local view concern unless later persistence is intentionally added

### Done Shape

This phase is done when:
- the dashboard board is no longer limited to two hardcoded lanes
- new dashboards still open with `TO DO` and `Completed`
- users can add lanes
- users can rename lanes
- users can remove lanes while one minimum lane is preserved
- lane delete has an explicit note-migration rule
- lanes can be resized through vertical splitter bars
- sticky-note placement survives lane management through stable `laneId` ownership
- the dashboard plan is ready to split into tighter implementation subphases if needed

### Phase Sections

## [x] Phase 1 - Lock Dynamic Lane Contract
### info
Purpose:
- lock the first-cut lane model, lane-identity rules, and delete/migration truth before code starts widening the current fixed-lane store

Current code-backed read:
- `src/app/dashboard/useDashboardStore.ts`
  - still treats lane as a fixed union through `DashboardStickyNoteLane`
  - still creates default layouts through one hardcoded `defaultStickyNoteLane` of `todo`
  - still normalizes lane writes through `normalizeStickyNoteLane(...)` instead of reading durable lane records
- `src/app/dashboard/dashboardPersistence.ts`
  - still serializes and normalizes only `stickyNoteLayoutsByNoteId`
  - still assumes lane is one of two built-in values rather than a persisted board-structure record
- `src/app/workspace/DashboardSurface.tsx`
  - still renders from one hardcoded `dashboardLanes` array with `todo` and `completed`
  - already owns lane-local camera state and lane-header UI, so it should consume a later dynamic lane list without also becoming the durable lane-data owner

Main work:
- confirm `lane` as the canonical technical term
- lock the first persisted lane record shape
- lock seeded default lanes as `TO DO` and `Completed`
- lock the one-lane minimum rule
- lock the first-cut delete-with-notes behavior
- lock whether widths land in the same store shape now or in the later resize slice

Suggestion:
- this should be the first required subphase because the current dashboard store still assumes a fixed lane pair and the runtime work will get messy fast if identity, delete behavior, and width ownership remain ambiguous

Locked first-cut answers for implementation prep:
- `lane` is the canonical code and docs term
- new boards still seed with two lanes named `TO DO` and `Completed`
- each lane gets a stable `id`; title stays editable display text
- one lane minimum is enforced at all times
- delete with notes requires choosing a destination lane in the first cut
- lane widths belong to the durable lane model even if resize UI lands later
- sticky-note placement must move from lane-name coupling to `laneId`
- lane camera stays local and transient; it is not part of `Phase 1`

Recommended first-cut lane record:
- `id`
- `title`
- `order`
- `width`

Recommended first-cut note-placement truth:
- sticky-note layout should store `laneId`
- lane title must not be used as placement identity
- delete migration should reassign note placements before the source lane record is removed

Likely files for the later runtime pass this phase is preparing:
- `src/app/dashboard/dashboardTypes.ts`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`

Execution order this phase should lock:
1. Define the persisted lane record and board-shape truth in `dashboardTypes.ts`.
2. Decide whether width is present from day one in that shape even if resize UI waits for `Phase 3`.
3. Decide the exact sticky-note migration rule for lane delete.
4. Decide the exact seeded default lane records for first-load dashboard state.
5. Confirm that `Phase 2` can widen runtime code to `laneId` without reopening the above decisions.

Verification shape for this prep phase:
- the contract questions in this doc are answered and no longer open-ended
- the live owner seams in `useDashboardStore.ts`, `dashboardPersistence.ts`, and `DashboardSurface.tsx` are explicitly named
- the lane record shape, delete rule, and placement identity rule are locked tightly enough that `Phase 2` can implement the store widening directly

Current locked output:
- the canonical system term is `lane`
- seeded first-load board state still starts with `TO DO` and `Completed`
- lane identity is stable `id`, not lane title text
- sticky-note placement must move to `laneId`
- one lane minimum is required
- delete with notes uses explicit destination-lane migration in the first cut
- lane width is part of the durable lane model even though resize UI remains staged later
- lane camera stays local and transient outside this contract pass

Done shape:
- the lane model is explicit
- runtime work can move from hardcoded lane keys to stable `laneId` ownership without reopening core product decisions
- `Phase 2` has one narrow structural target

## [x] Phase 2 - Implement User-Managed Lanes
### info
Purpose:
- replace the fixed `TO DO` / `Completed` structure with a real user-managed lane model while keeping the existing sticky-note board, note ownership, and lane-camera behavior intact

Current code-backed read:
- `src/app/dashboard/useDashboardStore.ts`
  - still stores only `stickyNoteLayoutsByNoteId`
  - still exposes `setStickyNoteLane(...)` and `setStickyNotePlacement(...)` using the fixed `DashboardStickyNoteLane` union
  - still creates default layouts through one hardcoded `defaultStickyNoteLane`
- `src/app/dashboard/dashboardPersistence.ts`
  - still persists only sticky-note layout state
  - still normalizes stored lane values through the current fixed-lane `todo | completed` fallback path
- `src/app/workspace/DashboardSurface.tsx`
  - still renders lane UI from the hardcoded `dashboardLanes` array
  - still keeps local lane camera state keyed by the current fixed lane union
  - already owns the note rendering, lane header actions, and add-note affordance that the dynamic-lane runtime pass should continue to use
- `src/app/AppShell.test.tsx`
  - already has the dashboard integration coverage that should absorb lane-create, lane-rename, lane-delete, and dynamic-lane rendering regressions
  - is the right place to prove that widening to `laneId` does not break note editing, pinning, drag, or open-in-notepad behavior

Main work:
- widen the dashboard store from fixed lane keys to persisted lane records
- seed new dashboards with `TO DO` and `Completed`
- migrate sticky-note placement to stable `laneId`
- add lane create behavior
- add lane rename behavior
- add lane remove behavior with the locked note-migration rule
- preserve the one-lane minimum
- keep existing sticky-note drag, inline edit, color menu, and lane camera working after the model shift

Suggestion:
- this should be the main runtime subphase because it contains the actual structural move from hardcoded lanes to dynamic lanes, but still avoids widening into width-resize math in the same pass

Locked runtime direction:
- add durable lane records to the dashboard-owned model
- keep width in the lane record shape, but do not implement drag-resize UI in this phase
- move sticky-note placement from lane name coupling to `laneId`
- keep note content and color ownership in the shared notepad model
- keep lane camera local in `DashboardSurface.tsx`, adapting it to dynamic lane ids without persisting it
- keep the first runtime cut limited to create, rename, remove, and safe note migration

Runtime exclusions for this phase:
- no vertical splitter drag yet
- no lane reorder yet
- no lane collapse yet
- no lane color system yet
- no camera persistence
- no generalized board templates or saved presets

Likely files:
- `src/app/dashboard/dashboardTypes.ts`
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/AppShell.test.tsx`

Execution order:
1. Widen `dashboardTypes.ts` from fixed lane values to durable lane records plus `laneId` placement.
2. Update `dashboardPersistence.ts` so lane records and `laneId`-based note placement serialize, normalize, and hydrate safely from storage.
3. Update `useDashboardStore.ts` so the store seeds default lanes, manages lane create/rename/remove operations, and applies the locked note-migration rule on delete.
4. Update `DashboardSurface.tsx` so lane rendering, lane headers, note grouping, and local lane cameras read from dynamic lane records instead of the hardcoded `dashboardLanes` array.
5. Expand `AppShell.test.tsx` to prove lane create, rename, delete, one-lane minimum, and note migration behavior while keeping existing dashboard interactions intact.

Verification shape:
- new dashboards still seed with `TO DO` and `Completed`
- users can add, rename, and remove lanes while one minimum lane remains
- deleting a lane with notes requires explicit destination-lane migration
- sticky-note placement persists by `laneId`
- existing dashboard note creation, inline editing, drag, and open-in-notepad behavior still pass after the model widening

Current shipped status:
- the dashboard store now persists lane records with stable ids and widths
- sticky-note placement now persists through `laneId`
- the dashboard surface now renders dynamic lanes instead of a hardcoded lane pair
- users can add, rename, and delete lanes from the current runtime surface
- deleting a lane with notes now migrates those notes into an explicitly chosen destination lane
- the one-lane minimum stays protected
- vertical lane-width resizing remains the next still-open `Phase 3` follow-on

Done shape:
- the dashboard board is no longer fixed to exactly two lanes
- users can add, rename, and remove lanes safely
- sticky-note placement persists by `laneId`
- the board still opens with two default lanes on first load

## [x] Phase 3 - Add Resizable Lane Widths And Layout Polish
### info
Purpose:
- let users shape the visual board split through vertical divider bars once the dynamic lane model is already stable

Current code-backed read:
- `src/app/dashboard/useDashboardStore.ts`
  - already persists one durable `width` value per lane record
  - is the correct owner seam for resize commits and width normalization
  - does not yet expose a dedicated lane-width update path, so `Phase 3` should add one instead of overloading unrelated lane APIs
- `src/app/workspace/DashboardSurface.tsx`
  - already renders dynamic lanes from persisted lane records
  - already converts lane widths into the live board layout through `gridTemplateColumns`
  - is the correct place for vertical splitter elements, pointer-drag math, and resize-preview behavior
- `src/app/theme/foundation/base.css`
  - already owns the dashboard lane shell styling
  - is the correct place for splitter hit-area, hover, active, and crowded-multi-lane polish
- `src/app/AppShell.test.tsx`
  - already has the dashboard integration seam that should absorb lane-width persistence and resize-regression coverage
  - is the right place to prove resize does not break note rendering, note drag, lane delete, or lane camera behavior

Main work:
- add vertical lane splitters between adjacent lanes
- add a dedicated lane-width update path in the dashboard store
- enforce minimum visible widths
- rebalance adjacent lane widths during drag instead of recomputing the entire board
- clamp lane camera sensibly after resize when the viewport narrows
- add resize regressions and follow-up UX polish for crowded multi-lane boards

Suggestion:
- keep this as its own subphase because width-resize interaction adds pointer math, layout persistence, and adjacent-lane balancing on top of the already meaningful dynamic-lane store migration

Locked runtime direction:
- keep lane width as durable dashboard-owned lane state
- add one explicit store action for updating adjacent lane widths during resize
- keep the board on the existing CSS-grid lane layout rather than changing to a different layout system
- use vertical splitter bars only between adjacent lanes; do not add endcaps or freeform board resize controls
- keep the first cut on pointer drag plus persisted result, without widening into reorder, collapse, or saved layout presets
- clamp transient lane cameras after resize only when the new lane viewport would otherwise leave the camera out of bounds

Runtime exclusions for this phase:
- no lane reorder
- no lane collapse
- no lane camera persistence
- no zoom changes
- no generalized board templates
- no alternate mobile-specific resize model beyond preserving usable minimum widths

Likely files:
- `src/app/dashboard/useDashboardStore.ts`
- `src/app/dashboard/dashboardTypes.ts`
- `src/app/dashboard/dashboardPersistence.ts`
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Execution order:
1. Add the dedicated lane-width update seam and width normalization rules in `useDashboardStore.ts`.
2. Keep the persisted lane record shape unchanged except for any normalization tightening needed around valid minimum widths.
3. Update `DashboardSurface.tsx` to render adjacent splitter bars and drive resize preview plus commit behavior from pointer drag.
4. Clamp local lane cameras after resize so narrowed lanes still show valid stage bounds.
5. Expand `AppShell.test.tsx` to cover persisted lane resize plus non-regression for note and lane interactions.

Verification shape:
- users can drag a splitter between adjacent lanes to resize them
- lane widths persist after reload
- minimum lane width is enforced so lane headers and sticky notes stay usable
- resize does not break sticky-note drag, inline editing, fit-to-notes, or lane delete flows
- lane cameras still behave sensibly after a lane is narrowed

Implementation-ready prep checklist:
- [x] live width owner seam in `useDashboardStore.ts` is identified
- [x] live board-layout seam in `DashboardSurface.tsx` is identified
- [x] live styling owner in `base.css` is identified
- [x] dashboard regression seam in `AppShell.test.tsx` is identified
- [x] first-cut resize rules and exclusions are locked tightly enough for the runtime pass

Current shipped status:
- the dashboard store now exposes a dedicated adjacent-lane width update seam
- dashboard lane widths now resize through real vertical splitter bars between adjacent lanes
- resized lane widths now persist through the lane records and survive reload
- sticky-note placement, inline editing, fit-to-notes, and lane cameras still remain intact under lane resize
- `Dashboard-6` is now fully landed through dynamic user-managed lanes plus persisted lane-width resizing

Done shape:
- lane widths can be adjusted directly on the board
- widths persist
- resize does not break note rendering, note drag, or lane cameras
- the board feels stable when more than two lanes are present

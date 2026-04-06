# Dashboard Phase Dashboard-5.2 - Real Lane Canvas Camera

## Doc Header

### Doc History
1. 2026-04-04 08:52: Closed `Phase 4 - Optional Lane Zoom Unlock` after shipping the lane-header lock buttons, transient lane-local zoom unlock state, wheel-driven zoom updates in `DashboardSurface.tsx`, focused zoom-and-drag regressions, and the matching verification pass through dashboard tests, `tsc`, and production build
1. 2026-04-04 08:44: Added a new `Phase 4 - Optional Lane Zoom Unlock` follow-on inside `Dashboard-5.2` so the lane-camera ladder now captures one small post-ship zoom-control idea where each lane header gets a lock button beside the fit action, defaults to locked pan-only behavior, and only allows lane-local zoom after the user explicitly unlocks that lane camera
1. 2026-04-04 07:52: Closed `Phase 3 - Lane Fit-To-Notes Action` after shipping the lane-header fit buttons in `DashboardSurface.tsx`, adding the lane-local camera recenter helper plus focused dashboard regressions, and verifying the recovery-action slice through dashboard tests, `tsc`, and production build
1. 2026-04-04 07:46: Prepared `Phase 3 - Lane Fit-To-Notes Action` for implementation by re-reading the live `DashboardSurface.tsx` lane-header and local lane-camera seam plus the existing dashboard camera regressions in `AppShell.test.tsx`, then appending a concrete implementation-prep addendum with exact owner files, execution order, exclusions, and focused verification for this small recovery-action slice
1. 2026-04-04 07:44: Added a new `Phase 3 - Lane Fit-To-Notes Action` follow-on inside `Dashboard-5.2` so the real lane-camera ladder now includes one small lane-header recovery action for `TO DO` and `Completed`, letting users recenter all notes in a lane without widening immediately into full zoom tooling
1. 2026-04-04 07:39: Closed `Phase 2 - Implement Real Lane Camera` and the overall `Dashboard-5.2` phase after shipping the real lane-camera runtime in `DashboardSurface.tsx`, replacing DOM-scroll panning with local per-lane camera state plus transformed lane stages, updating focused dashboard regressions, and verifying the slice through dashboard tests, `tsc`, and production build
1. 2026-04-04 07:34: Prepared `Phase 2 - Implement Real Lane Camera` for implementation by re-reading the live `DashboardSurface.tsx` scroll-based lane-pan and drag-math seam plus the existing dashboard regressions in `AppShell.test.tsx`, then tightening this runtime slice around exact owner files, a narrow execution order, explicit exclusions, and focused verification for replacing DOM scroll with a real per-lane camera
1. 2026-04-04 07:34: Closed `Phase 1 - Lock Lane Camera Contract` by turning the previously open lane-camera questions into locked first-cut decisions, marking the contract checklist complete, and leaving `Phase 2` as the next actual runtime implementation slice for the real lane-camera work
1. 2026-04-04 07:31: Prepared `Phase 1 - Lock Lane Camera Contract` for implementation by re-reading the live `DashboardSurface.tsx` lane-scroll and visible-rect clamp seam plus the `SpaghettiCanvas.tsx` camera-transform reference path, then tightening this phase around one explicit first-cut contract, owner files, execution order, and verification shape instead of leaving it as a looser research bucket
1. 2026-04-04 07:27: Reworked this `Dashboard-5.2` phase doc into the same explicit sub-phase format used by the `Workspace 7.5-9` planning docs, splitting the lane-camera work into `Phase 1` design-lock questions and `Phase 2` implementation direction so the execution ladder reads more cleanly
1. 2026-04-04 07:20: Added this dedicated `Dashboard-5.2` future phase doc as the next dashboard-family planning follow-on after `Dashboard-5.1`, reframing later lane navigation around a real Spaghetti-style lane camera with `panX` and `panY` instead of DOM scroll, and collecting the key design questions with concrete recommended answers before implementation

### Purpose

Use this phase to promote each sticky-note lane from a scrollable board into a real canvas surface with its own view camera.

The goal is not to widen immediately into zoom, minimaps, or infinite whiteboard tooling.
The goal is to replace the current DOM-scroll lane navigation with a true lane-local camera model so panning feels closer to the Spaghetti editor canvas and sticky-note coordinates stop being tied to the visible board box.

### Scope

This phase covers:
- replacing DOM-scroll lane panning with a real lane camera model
- introducing lane-local `panX` and `panY` view state
- rendering sticky notes inside a transformed lane stage instead of relying on board scroll position
- converting sticky-note drag math to lane-world coordinates
- allowing real up/down and left/right panning like a canvas surface
- keeping sticky-note note ownership in the shared notepad note model
- keeping sticky-note lane and placement ownership in the dashboard placement model

This phase does not cover:
- zoom in the first cut
- persistent lane camera restore
- minimaps
- infinite canvas virtualization
- extra lane families
- note resizing
- grouping or selection frameworks
- plugin widget generalization

## Doc Body

### Summary

`Dashboard-5.2` should be the architectural follow-on after the first shipped middle-mouse panning pass.

Current baseline:
- `Dashboard-5.1` can pan lane boards by mutating DOM `scrollLeft` and `scrollTop`
- sticky-note positions are still stored as lane-local absolute `x/y`
- sticky-note drag still clamps against the visible lane board rect

Important read:
- that means the current interaction is still a scroll-container model, not a true canvas-camera model
- if the product goal is to make the lane feel like the Spaghetti editor canvas, the next honest step is to introduce a real lane camera and stop leaning on overflow scroll as the primary view abstraction

The next honest slice is:
- add a lane camera with `panX` and `panY`
- render sticky notes inside a transformed inner stage
- convert pointer math through that lane camera instead of the DOM scroll box

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/workspace/DashboardSurface.tsx`
  - already owns lane-board refs, note drag session state, note placement preview, and lane rendering
  - is the correct place for the lane-camera state and the lane-world versus viewport coordinate conversion layer
  - is also where the current `clampStickyNotePosition(...)` visible-box logic lives, which is the main reason the board still feels bounded to the viewport
- `src/app/workspace/DashboardStickyNoteCard.tsx`
  - already isolates note-local UI such as drag title bar, inline edit, and color menu
  - should stay note-local and should not become responsible for camera math
- `src/app/theme/foundation/base.css`
  - already owns the lane board shell and sticky-note visual treatment
  - should absorb the lane-stage transform shell styling and any active camera-pan visual states
- `src/app/AppShell.test.tsx`
  - already covers dashboard drag, inline edit, color menu, and lane-board panning interactions
  - is the right place for the future end-to-end lane-camera regressions
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - is the closest live reference for a real canvas camera in this repo
  - already stores `panX` and `panY`, applies a stage transform, and routes middle-mouse pan through camera state instead of DOM scroll

### Locked Direction

`Dashboard-5.2` should:
- treat sticky-note placement as lane-world coordinates
- treat panning as lane-camera viewport state
- render notes through a transformed stage layer like a lightweight board canvas
- move drag math into lane-world coordinates instead of viewport-clamped scroll-box math

`Dashboard-5.2` should not:
- move note ownership out of the shared note model
- move lane or note placement ownership into a separate generalized whiteboard store
- widen immediately into zoom or persistence unless the implementation proves those are required for a stable first cut

Implementation-ready direction:
- use a per-lane camera state in the dashboard surface first
- only promote that camera state into a broader dashboard store if later persistence becomes clearly necessary

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Useful reference read:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

### Main Risks

The main risks in this phase are:

- mixing lane camera state with note placement state
- accidentally breaking sticky-note drag by converting only half of the pointer math
- keeping hidden DOM scroll behavior alive and creating two competing viewport models
- over-building a generalized canvas abstraction before the dashboard board actually needs it

Healthy rule:
- note content stays in the notepad model
- note lane and placement stay in the dashboard placement model
- lane camera stays a separate view concern

### Phase Sections

## [x] Phase 1 - Lock Lane Camera Contract
### info
Purpose:
- lock the lane-camera interaction contract before implementation starts

Current read:
- `Dashboard-5.1` introduced middle-mouse panning through DOM scroll
- that shipped behavior works as a first usability pass, but it still behaves like a scroll container instead of a true canvas surface
- the current `DashboardSurface.tsx` seam still stores lane panning as `scrollLeft` and `scrollTop` and still clamps sticky-note drag against the visible lane board rect
- the live `SpaghettiCanvas.tsx` reference already shows the cleaner pattern we want: local `panX/panY`, pointer-to-stage conversion, and one transformed stage layer
- the next phase should answer the camera-model questions first so the implementation is not forced to guess at viewport ownership, bounds, or gesture rules halfway through

Main work:
- lock where lane camera state lives
- lock the exact first-cut camera contract as pan-only
- lock the lane world model and camera ownership boundaries
- lock the gesture and viewport rules so later code can implement one coherent model
- lock the exact implementation starting seam inside `DashboardSurface.tsx`

Done shape:
- the lane-camera contract is explicit
- the first implementation pass has one clear source of truth to target
- `Phase 2` can implement one narrow camera model without reopening the core contract

### Code-Backed Read

The current contract questions are not abstract anymore. The live code already points at the real owner seam:

- `src/app/workspace/DashboardSurface.tsx`
  - owns lane-board refs, lane-board pointer handlers, note drag session state, and lane-local layout reads
  - currently stores panning through `lanePanStateRef` with `originScrollLeft` and `originScrollTop`
  - currently computes note drag against `clampStickyNotePosition(...)` using the visible lane-board rect
  - is the exact place where viewport-space math must stop and lane-world-space math must start
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - already defines a simple `CanvasViewState` with `panX`, `panY`, and `zoom`
  - already converts client coordinates into stage coordinates with `toStagePointFromClient(...)`
  - already pans by mutating view state and renders one stage with `transform: translate(...) scale(...)`
  - is the right conceptual reference, even though `Dashboard-5.2 / Phase 1` should only adopt the pan-and-transform parts

### Locked First-Cut Answers

For implementation prep, `Phase 1` should stop treating the camera contract as open-ended research and lock these as the first-cut truth:

- lane camera state lives locally in `DashboardSurface.tsx`
- the first real camera cut is pan-only with no zoom
- each lane owns one independent camera
- sticky-note positions remain lane-world coordinates
- the first lane world is generous but finite
- middle mouse remains the only panning gesture
- DOM scroll stops being the primary viewport model once the real camera lands
- camera state stays transient in the first cut
- `SpaghettiCanvas.tsx` is the conceptual pattern source, not a forced shared abstraction

### Questions / Decisions

All major contract questions for the first cut are now answered and locked below.

#### [x] Question 1 - Should lane camera state live only in `DashboardSurface.tsx`, or move into `useDashboardStore.ts` immediately?

##### Suggestion
- keep it local to `DashboardSurface.tsx` in the first real camera cut

##### Why
- camera state is still a view concern, not durable board metadata
- keeping it local avoids widening persistence and the dashboard store contract too early
- it also matches the stated goal of proving the interaction first before deciding whether restore-on-reload is actually worth the extra complexity

#### [x] Question 2 - Should the first real camera cut include zoom, or stay on pan only?

##### Suggestion
- stay on pan only

##### Why
- zoom changes every pointer conversion path and every clamp rule at once
- the main product problem is that the lane still behaves like a scroll box, not that it lacks zoom
- pan-only keeps the first real canvas cut understandable and testable

#### [x] Question 3 - Should sticky-note coordinates remain bounded to a finite lane world, or become effectively unbounded?

##### Suggestion
- use one generous finite lane world in the first cut

##### Why
- it preserves predictable drag bounds and avoids accidental note loss in far-off empty space
- it still lets the lane feel much larger than the current viewport
- a later infinite-canvas follow-on can widen this if the product actually needs it

Recommended first-cut truth:
- choose one explicit lane world size large enough for real horizontal and vertical navigation
- clamp note drag against that lane world, not the visible board rect

#### [x] Question 4 - Should each lane get its own independent camera, or should the whole dashboard board share one camera model?

##### Suggestion
- keep one independent camera per lane

##### Why
- the current product model still treats `TO DO` and `Completed` as separate board spaces
- per-lane cameras fit the existing lane-local placement model more naturally
- it avoids forcing synchronized scrolling behavior that the user did not ask for

#### [x] Question 5 - Should middle mouse keep panning, or should left-drag on empty space also pan?

##### Suggestion
- keep middle mouse as the only pan gesture in the first real camera pass

##### Why
- left mouse is already busy with sticky-note drag and text editing expectations
- matching the current interaction contract reduces surprise
- this keeps the phase aligned with the already-shipped `5.1` gesture language

#### [x] Question 6 - Should the current DOM-scroll lane-board behavior be removed entirely, or coexist temporarily with the new camera?

##### Suggestion
- remove DOM-scroll as the primary pan model once the real camera lands

##### Why
- running both models at once creates two sources of truth for the viewport
- that will make pointer math and tests harder to reason about
- the whole point of this phase is to replace the scroll-container abstraction with a true surface camera

Recommended first-cut truth:
- keep native overflow only as a safety fallback if absolutely needed for edge cases, but do not keep it as the main panning mechanism

#### [x] Question 7 - Should lane camera state persist across reload in this same phase?

##### Suggestion
- no, not in this phase

##### Why
- persistence is a separate product decision and not required to prove the camera architecture
- a local transient camera makes the implementation smaller and easier to validate
- if the interaction proves good, persistence can be a later `Dashboard-5.2x` or `Dashboard-5.3` follow-on

#### [x] Question 8 - Should we mirror Spaghetti's canvas implementation directly, or only borrow the core camera ideas?

##### Suggestion
- borrow the camera ideas, not a literal shared subsystem in the first pass

##### Why
- the dashboard board is much simpler than Spaghetti and doesn't yet need zoom, node culling, or graph-stage complexity
- reusing the conceptual model is good; forcing a shared abstraction too early risks over-coupling two very different surfaces

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Helpful live reference:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

### Suggested Execution Order

The cleanest implementation-prep order for this phase is:

1. Replace the old lane-board pan contract in `DashboardSurface.tsx` with one per-lane local camera state shape.
2. Define one small dashboard-specific helper for client-space to lane-world conversion.
3. Replace visible-rect drag clamping assumptions with a larger explicit lane world contract.
4. Update the doc checklist and verification around that one locked camera model instead of mixed scroll and camera language.

Implementation note:
- `Phase 1` should not yet widen into code changes
- it should leave `Phase 2` with one narrow contract to implement instead of multiple competing viewport models

Checklist:
- [x] Lock `DashboardSurface.tsx` as the first-cut lane-camera owner seam
- [x] Lock the first cut to pan-only
- [x] Lock the first lane world as a generous finite world instead of visible-rect bounds
- [x] Lock the camera model as one independent camera per lane
- [x] Lock middle mouse as the first pan gesture
- [x] Lock replacement of DOM-scroll as the primary viewport model
- [x] Lock camera state as transient in the first cut
- [x] Lock `SpaghettiCanvas.tsx` as the conceptual reference, not a forced shared subsystem
- [x] Lock the implementation-prep execution order for `Phase 2`

Verification:
- the doc gives one clear answer for lane-camera ownership, gestures, bounds, and viewport truth
- the doc names the exact current scroll-based seam being replaced
- the next implementation pass can target one explicit lane-camera contract without reopening core design questions

Current locked output:
- `DashboardSurface.tsx` is the first-cut lane-camera owner
- `Phase 2` should ship a pan-only camera with one transient independent camera per lane
- sticky-note positions stay lane-world coordinates inside one generous finite world
- DOM scroll is replaced as the main viewport model instead of coexisting as a second camera truth
- `SpaghettiCanvas.tsx` is a conceptual reference for local camera state, client-to-stage conversion, and transformed stage rendering only

## [x] Phase 2 - Implement Real Lane Camera
### info
Purpose:
- replace DOM-scroll lane panning with a true lane-camera implementation

Current read:
- the current lane board can pan through DOM scroll, but sticky-note drag math and viewport truth are still scroll-container based
- `DashboardSurface.tsx` still stores lane panning through `lanePanStateRef` plus `scrollLeft` and `scrollTop`
- sticky-note drag still depends on `getBoundingClientRect()` plus visible-board `clampStickyNotePosition(...)`
- `AppShell.test.tsx` already contains the regression seam for dashboard pan, drag, color-menu, and inline-edit behavior, so the safest runtime cut is to replace the viewport model first and make note drag follow it instead of trying to half-mix both systems

Main work:
- add one local `panX` and `panY` camera state per lane
- render sticky notes inside an inner stage transformed by the lane camera
- replace DOM-scroll middle-mouse panning with camera-state updates
- convert sticky-note drag preview and drop math to lane-world coordinates
- clamp note placement against a larger explicit lane world instead of the visible board rect

Done shape:
- each lane feels like a real canvas surface instead of a scroll box
- the user can pan up, down, left, and right through lane camera movement
- sticky-note drag, edit, and color-menu behavior still work under the new camera model
- the overall `Dashboard-5.2` phase is ready to read as shipped

### Code-Backed Runtime Read

The exact implementation seam for this runtime slice is now clear:

- `src/app/workspace/DashboardSurface.tsx`
  - owns the current middle-mouse lane panning path
  - owns lane-board refs, drag session state, drag preview state, lane detection, and sticky-note placement commit
  - is where lane camera state, lane-world helpers, transformed stage rendering, and updated drag math should land
- `src/app/theme/foundation/base.css`
  - owns the current lane board shell and panning visual state
  - should absorb the lane-stage positioning rules, overflow cleanup, and any grab/grabbing camera states that survive the new implementation
- `src/app/AppShell.test.tsx`
  - already covers middle-mouse lane panning without placement mutation
  - already covers sticky-note drag between lanes and placement persistence
  - is the correct place to convert old scroll-based expectations into real lane-camera expectations and add the new vertical-pan-plus-drag regression coverage

Important live implementation read:
- this phase does not need to widen into store schema work
- the dashboard placement store can keep owning note lane and note `x/y`
- the new runtime concern is camera state and client-to-lane-world math inside the surface layer

### Locked Runtime Direction

The first runtime cut for `Phase 2` should be:

- local lane camera state in `DashboardSurface.tsx`
- one transformed inner stage per lane
- one explicit finite lane world
- one client-to-lane-world conversion helper
- one updated drag path that reads and writes lane-world note positions
- no zoom
- no camera persistence
- no generalized shared canvas subsystem

### Suggested Implementation Order

The safest narrow execution order is:

1. Add one per-lane local camera state shape in `DashboardSurface.tsx`.
2. Replace middle-mouse lane scrolling with camera-state updates.
3. Render notes inside a translated inner stage instead of relying on the lane board scroll position.
4. Replace visible-rect note drag calculations with lane-world conversion helpers.
5. Replace visible-board clamping with one explicit lane-world clamp.
6. Update and extend focused dashboard regressions in `AppShell.test.tsx`.

### Explicit Exclusions

This runtime slice should not widen into:

- zoom
- persisted lane camera restore
- minimaps
- infinite canvas behavior
- note resizing
- note grouping or multi-select
- generalized whiteboard or shared canvas infrastructure

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Useful live reference:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

Checklist:
- [x] Replace DOM-scroll lane panning with a real lane camera
- [x] Add local `panX` and `panY` state per lane
- [x] Render sticky notes through a transformed inner stage
- [x] Convert sticky-note drag math to lane-world coordinates
- [x] Clamp note movement against a larger lane world instead of the visible board box
- [x] Keep sticky-note inline edit, color menu, and note drag behavior working
- [x] Keep camera state transient in the first cut
- [x] Add focused regression coverage for camera pan and drag correctness

Verification:
- middle-mouse panning updates lane camera state instead of DOM scroll position
- sticky-note drag remains correct after camera offset is applied
- notes can be moved into areas above and below the initial viewport without camera or drag glitches
- inline sticky-note editing still works
- title-bar right-click color menu still works
- cross-lane drag still persists lane assignment and dropped lane-world placement correctly

Focused regression targets:
- update the current middle-mouse lane-pan test so it asserts camera-driven motion instead of `scrollLeft` and `scrollTop`
- keep the existing sticky-note drag persistence regressions passing after the math conversion
- add one regression proving notes can be dragged or viewed beyond the initial visible lane viewport in the new camera model

Recommended verification commands for the future implementation pass:
- `npm.cmd test -- --run src/app/notepad/useNotepadStore.test.ts src/app/AppShell.test.tsx -t dashboard`
- `npx.cmd tsc -p tsconfig.json --noEmit`
- `npm.cmd run build`

Current shipped status:
- dashboard lane boards now use one local transient camera per lane instead of DOM scroll as the main viewport model
- sticky notes now render inside translated lane stages and keep lane-world `x/y` placement under camera movement
- middle-mouse lane panning now moves the lane camera in both directions
- sticky-note drag still persists lane assignment plus dropped placement correctly after camera offsets are applied
- focused dashboard regressions, `tsc`, and production build all pass for this slice

### Acceptance And Done Shape

`Dashboard-5.2` is done when:

- the lane-camera contract is explicit before implementation
- each lane feels like a real canvas surface instead of a scroll box
- the user can pan up, down, left, and right through lane camera movement
- sticky-note coordinates stay stable as lane-world placement
- sticky-note drag, edit, and color-menu behavior still work under the new camera model

## [x] Phase 3 - Lane Fit-To-Notes Action
### info
Purpose:
- give the user one fast lane-local recovery action so notes are easy to find again after panning and reorganization

Current read:
- the real lane camera is now shipped, so notes can legitimately drift off-screen
- that is good for canvas freedom, but it also creates a small discoverability problem when the user loses track of where the notes in `TO DO` or `Completed` ended up
- the next narrow usability follow-on should solve that recovery problem without widening the camera system into full zoom controls

Main work:
- add one tiny lane-header action button beside each lane title
- use a magnifying-glass or fit-style icon
- compute the bounding box of notes in that lane
- move the lane camera so the lane viewport recenters that note cluster with a little padding
- keep the action lane-local so `TO DO` and `Completed` each fit their own notes independently

Done shape:
- the user can click one small lane action to find the notes in that lane again
- the action helps recover notes without changing note ownership or widening the camera model too much

### Suggested First Cut

The first cut should be:

- pan-to-fit, not zoom-to-fit
- one button in the `TO DO` header and one button in the `Completed` header
- disable the button or no-op when the lane has no notes
- if the lane has one note, center it comfortably in the lane viewport
- if the lane has many notes, center the bounding box of that group with some padding

### Important Rule

- do not widen this follow-on into full zoom UI
- do not add minimaps, saved camera presets, or persistent fit-history state
- keep note `x/y` placement unchanged and move only the lane camera

### Likely Files

- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

### Questions / Decisions

#### [ ] Question 1 - Should this be true zoom-to-fit or pan-only fit-to-notes?

##### Suggestion
- keep it pan-only in the first pass

##### Why
- `Dashboard-5.2` is still intentionally a pan-only camera model
- the core user problem is “I lost my notes,” not “I need camera zoom controls”

#### [ ] Question 2 - Where should the action live?

##### Suggestion
- put one tiny icon button in each lane header beside the lane title

##### Why
- the action is lane-local, not board-global
- users will naturally look near the lane label when trying to recover that lane’s notes

#### [ ] Question 3 - What should happen when the lane has no notes?

##### Suggestion
- disable the button visually

##### Why
- a disabled state explains that there is nothing to fit without creating a confusing no-op

#### [ ] Question 4 - What should the fit target be when there is only one note?

##### Suggestion
- center that note comfortably in the lane viewport with padding

##### Why
- single-note lanes should still feel intentional rather than snapping awkwardly toward a corner

Checklist:
- [ ] Add one lane-header fit action per lane
- [ ] Keep the first cut pan-only
- [ ] Fit the lane camera to the bounding box of notes in that lane
- [ ] Keep note placement unchanged
- [ ] Add focused regressions for fit-to-notes behavior in both `TO DO` and `Completed`

Verification:
- clicking the lane fit action recenters the notes for that lane
- the action does not mutate sticky-note placement persistence
- empty lanes do not produce confusing behavior

### Implementation-Prep Addendum

#### Code-Backed Read

The exact owner seam for this follow-on is already live:

- `src/app/workspace/DashboardSurface.tsx`
  - already renders the `TO DO` and `Completed` lane headers
  - already owns local per-lane camera state and lane-stage camera attributes
  - is the correct place to compute note bounds and update one lane camera in response to a lane-header action
- `src/app/theme/foundation/base.css`
  - already owns lane-header visual treatment
  - is the right place for the tiny fit-action button styling and disabled state
- `src/app/AppShell.test.tsx`
  - already has dashboard camera tests that read lane-stage camera attributes
  - is the correct place to assert that fit-to-notes updates camera position without mutating sticky-note layout persistence

Important live implementation read:
- this follow-on does not need new store schema
- it can compute note bounds from the existing lane-filtered sticky-note layouts already rendered in `DashboardSurface.tsx`
- it should update only the local lane camera and not touch note placement data

#### Locked First-Cut Direction

The first implementation pass should be:

- one tiny lane-header fit action per lane
- pan-only fit, not zoom-to-fit
- lane-local note-bounds calculation from the existing sticky-note layouts
- lane-camera recentering with padding
- disabled action when the lane has no notes
- no persistence beyond the current local camera state

#### Suggested Execution Order

The cleanest implementation order for this follow-on is:

1. Add one fit action button to each lane header in `DashboardSurface.tsx`.
2. Add one helper that computes the lane-local note bounds for the current lane.
3. Convert that note-bounds box into a camera target with comfortable padding.
4. Clamp the resulting camera target to the finite lane world.
5. Add focused dashboard regressions proving fit-to-notes updates the lane camera without mutating note placement.

#### Explicit Exclusions

This follow-on should not widen into:

- zoom controls
- automatic zoom-to-fit
- board-global fit behavior
- minimaps
- camera presets
- persisted fit history
- note placement rewrites

#### Implementation-Prep Checklist

- [x] Add one lane-header fit action per lane
- [x] Keep the first cut pan-only
- [x] Fit the lane camera to the bounding box of notes in that lane
- [x] Clamp the resulting camera target to the lane world bounds
- [x] Keep note placement unchanged
- [x] Add focused regressions for fit-to-notes behavior in both `TO DO` and `Completed`

#### Implementation-Prep Verification

- clicking the lane fit action recenters the notes for that lane
- the action does not mutate sticky-note placement persistence
- empty lanes do not produce confusing behavior
- the lane-stage camera attributes update to the expected lane-local target after fit

Current shipped status:
- each lane header now includes a small fit-to-notes recovery action
- clicking the action recenters that lane camera around the notes in the lane without changing sticky-note placement
- empty lanes expose the same action in a disabled state so the recovery affordance stays discoverable without becoming a confusing no-op
- focused dashboard regressions, `tsc`, and production build all pass for this slice

## [x] Phase 4 - Optional Lane Zoom Unlock
### info
Purpose:
- add one explicit lane-local zoom unlock control without breaking the current simple pan-first camera model

Current read:
- the real lane camera and fit-to-notes action are now both shipped
- the current camera model is intentionally simple: pan only, always available, no zoom controls
- the next idea is not to make zoom always-on, but to add a small lock button beside the magnifying-glass fit action so zoom remains off by default and becomes available only when the user explicitly unlocks that lane

Main work:
- add one small lock button beside the lane fit action
- default the lane camera to locked
- keep the current pan-only behavior while the lane is locked
- allow lane-local zoom in and out only after the user unlocks that lane
- keep zoom state local to the lane camera and transient in the first cut

Suggestion:
- keep this as a small `Dashboard-5.2` follow-on rather than a new top-level dashboard phase because it extends the lane-camera control surface directly instead of changing board structure

Locked first-cut direction:
- the lock button should live in each lane header beside the fit-to-notes button
- the default state should be locked so current dashboard behavior remains simple and familiar
- unlocking should enable lane-local zoom for that lane only
- the first cut should keep zoom transient and local to `DashboardSurface.tsx`
- fit-to-notes should continue to work with the unlocked camera model without mutating sticky-note placement

Questions / Decisions:

#### [x] Question 1 - Should zoom be always available once implemented, or guarded behind an explicit unlock control?

##### Suggestion
- guard it behind an explicit unlock control

##### Why
- it preserves the current simple pan-first dashboard feel by default
- it reduces accidental zoom while users are trying to pan or drag sticky notes

#### [x] Question 2 - Where should the unlock control live?

##### Suggestion
- place one small lock button directly beside the lane fit button in each lane header

##### Why
- both controls are lane-local camera actions
- the user will naturally look in the lane header for lane-specific camera controls

#### [x] Question 3 - Should zoom state persist across reload in this same follow-on?

##### Suggestion
- no, keep it transient in the first cut

##### Why
- this is still a camera-control experiment, not a persistence decision
- transient state keeps the follow-on smaller and easier to validate

#### [x] Question 4 - Should unlocking one lane unlock zoom for all lanes?

##### Suggestion
- no, keep unlock state lane-local

##### Why
- each lane already owns its own independent camera
- lane-local unlock avoids surprising camera-mode changes in the other lane

Likely files:
- `src/app/workspace/DashboardSurface.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/AppShell.test.tsx`

Done shape:
- each lane header exposes one small lock button beside the fit action
- lanes stay pan-only while locked
- unlocking a lane enables zoom for that lane camera without changing note placement ownership

Current shipped status:
- each lane header now exposes a small lock button beside the fit-to-notes action
- dashboard lanes stay pan-only by default and only allow wheel zoom after that lane is explicitly unlocked
- zoom state stays transient and lane-local inside `DashboardSurface.tsx`
- sticky-note placement remains unchanged while zoom modifies only the local lane camera
- focused dashboard regressions, `tsc`, and production build all pass for this slice

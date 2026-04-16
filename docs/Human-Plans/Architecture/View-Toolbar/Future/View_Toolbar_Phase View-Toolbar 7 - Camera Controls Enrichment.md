# View Toolbar Phase View-Toolbar 7 - Camera Controls Enrichment

## Doc Header

### Doc History
14. 2026-04-15 11:51:13: Marked `Phase 7 - Camera Subsection Grouping And Framing Split` complete after the `Camera` section gained one lower collapsible `Projection & Framing` subsection below the clip area, preserving the earlier command seams while hiding and restoring the grouped projection/preset/framing options cleanly when toggled
13. 2026-04-15 11:39:24: Prepped `Phase 7 - Camera Subsection Grouping And Framing Split` for implementation by grounding it in the current flat `CameraToolbar` body in `ViewToolbar.tsx`, the existing toolbar-local nested-`details` height resync path, and the likely `viewport-overlay.css` styling seam so the regrouping can land as one small collapsible-subsection pass instead of a vague camera redesign
12. 2026-04-15 11:39:24: Tightened `Phase 7 - Camera Subsection Grouping And Framing Split` so the new lower camera subsection is explicitly planned as a collapsible/expandable shell that can hide all of its regrouped projection and framing options when closed, instead of reading like a fixed always-open divider
11. 2026-04-15 11:27:04: Added `Phase 7 - Camera Subsection Grouping And Framing Split`, reopening `View-Toolbar 7` as one small follow-on so the current `Camera` section can be organized more clearly by moving the `Perspective` plus framing actions into their own subsection below the clip controls instead of leaving the phase family permanently closed after the earlier proof stop
10. 2026-04-15 11:23:53: Marked `Phase 6 - Projection Toggle Sync Proof And Stop` complete after focused toolbar proof was added for live `Perspective` -> `Orthographic` -> `Perspective` transitions, confirming that the perspective-only `FOV` row hides and restores correctly while `Clip Start` / `Clip End` plus their helper language stay synced through the same mounted camera section without widening the lane into more camera-surface growth
9. 2026-04-15 10:58:15: Prepped `Phase 6` for implementation by replacing the older vague "Focused Proof And Stop" placeholder with one explicit tests-only closeout slice around projection-mode transitions, camera-section sync, and no-new-surface guardrails so the final follow-on is small enough for Codex to land cleanly in one pass
8. 2026-04-15 10:09:23: Marked `Phase 5 - Value Language, Defaults, And Small Safety Polish` complete after the camera section gained one explicit `Auto Clip` return path plus clearer clip-mode helper text, and the shared viewer seam now supports resetting authored clip ownership back to auto so the first shipped camera controls feel more understandable without widening into another feature lane
7. 2026-04-15 08:38:45: Marked `Phase 4 - Clip Start And Clip End ParaSliders` complete after the visible `Camera` section gained live `Clip Start` and `Clip End` `ParaSlider` rows wired directly to the authored clip-range seam, with focused toolbar proof covering visible rendering, viewer-sync updates, and orthographic visibility while the perspective-only `FOV` row stays unchanged
6. 2026-04-15 08:33:29: Marked `Phase 3 - Authored Clip Range Runtime Contract` complete after the shared camera runtime gained one explicit authored clip-range seam, `CameraPose` now preserves clip ownership and values through history/restore paths, and focused viewer/controller proof covers validity plus change-notification behavior before any visible `Clip Start` or `Clip End` rows are added
5. 2026-04-15 08:25:00: Marked `Phase 2 - Camera Section FOV ParaSlider` complete after the `Camera` section gained one perspective-only `FOV` `ParaSlider` wired to the new shared viewer seam, with focused toolbar proof covering visible rendering, viewer-sync updates, and orthographic hiding without widening into clip-range controls
4. 2026-04-15 08:14:45: Marked `Phase 1 - Perspective FOV Viewer Contract` complete after the shared viewer seam landed in `viewerBridge.ts`, `Viewer.ts`, and `CameraController.ts`, with focused runtime tests proving dedicated perspective `FOV` read/write/change-notification ownership before any toolbar `ParaSlider` JSX is added
3. 2026-04-15 08:05:18: Prepped `View-Toolbar 7` for implementation by grounding it in the live `ViewToolbar.tsx`, `viewerBridge.ts`, `Viewer.ts`, `CameraController.ts`, and `viewSettingsTypes.ts` seams, then splitting the work into smaller Codex-sized phases so `FOV` can land first while the deeper clip-range runtime contract is handled separately
2. 2026-04-15 08:02:21: Updated this phase doc so `View-Toolbar 7` now explicitly includes a visible `FOV` `ParaSlider` alongside `Clip Start` and `Clip End`, tightening the first internal slice around the practical user-facing lens rows that are still missing from the live toolbar
1. 2026-04-15 07:53:39: Created this standalone future phase doc for `View-Toolbar 7`, giving the next camera-settings follow-on one dedicated planning home around enriching the visible `View` toolbar with user-facing `Clip Start` and `Clip End` `ParaSlider` controls without widening into a generic debug-camera surface

### Purpose

This doc locks the seventh `View-Toolbar` phase.

Use it to answer:
- what the next camera-settings follow-on should own after the earlier projection and `FOV` work
- how the first visible lens rows should appear in the `View` toolbar
- how `FOV`, `Clip Start`, and `Clip End` should route through one honest shared camera-setting seam
- how this lane should stay user-facing and compact instead of widening into a generic debug panel

### Why This Phase Exists

The `View` toolbar already has the broader direction to own explicit camera and viewport settings.

Projection belongs there, but the live toolbar still does not expose the first practical lens rows that users expect when camera framing needs real tuning.

The next honest follow-on is to expose the lens and clipping range in a deliberate way:
- `FOV`
- `Clip Start`
- `Clip End`

This phase exists to give those controls one explicit planning home so they land as real `View` toolbar settings instead of drifting in later as one-off viewer tweaks or hidden debug rows.

### Scope

This phase covers:
- visible `View` toolbar camera-settings enrichment
- the first user-facing `FOV`, `Clip Start`, and `Clip End` `ParaSlider` controls
- grouping and wording for those controls inside the visible toolbar
- routing those sliders through one shared camera-setting seam
- safe default/value behavior so the controls stay useful in ordinary viewport work

This phase does not cover:
- projection mode behavior
- grid, background, gizmo, or fly controls
- a generic debug-camera panel with every possible camera number exposed

## Doc Body

## [x] - `View-Toolbar 7` - `Camera Controls Enrichment`

### Header

Purpose:
- extend the visible `View` toolbar with the next practical camera-setting controls after projection, starting with one small lens-and-clipping row set

Owns:
- visible `FOV`, `Clip Start`, and `Clip End` `ParaSlider` controls
- where those controls live in the camera/lens surface
- the first shared view-toolbar seam for clip-plane settings
- guardrails that keep the values readable and safe

Keeps elsewhere:
- low-level camera gesture ownership
- debug-only viewer diagnostics
- unrelated view-state families

### Target Result

At the end of this phase:
- the `View` toolbar exposes `FOV`, `Clip Start`, and `Clip End` as real user-facing `ParaSlider` controls
- those controls live beside the rest of the camera/lens settings instead of in a hidden debug surface
- all three sliders route through one honest shared camera-setting seam
- the first shipped value model stays safe and understandable for normal viewport use

### Current Live Read

Current visible owner seam:
- `src/app/components/ViewToolbar.tsx`
  - the `Camera` section currently renders:
    - `Perspective`
    - `Orthographic`
    - camera preset buttons
    - `Frame`
    - `Frame All`
  - it already imports and uses `ParaSlider` elsewhere in the same component, so the visual control language is available
  - it does not yet render any `FOV`, `Clip Start`, or `Clip End` rows

Current shared viewer seam:
- `src/app/viewerBridge.ts`
  - already exposes shared fly-mode getters, setters, and change handlers
  - already exposes `getCameraPose`, `applyCameraPose`, and `setOnCameraPoseChange`
  - does not yet expose dedicated toolbar-facing getters, setters, or change handlers for:
    - `FOV`
    - `Clip Start`
    - `Clip End`

Current runtime camera seam:
- `src/viewer/scene/CameraController.ts`
  - already stores `lastPerspectiveFovDeg`
  - already includes `perspectiveFovDeg` in `CameraPose`
  - currently auto-computes perspective near/far through:
    - `syncNearFarFromDistance(...)`
  - currently auto-computes orthographic near/far through:
    - `updateOrthographicFrustum()`
  - does not yet expose an authored clip-range contract

Current viewer owner seam:
- `src/viewer/Viewer.ts`
  - already exposes fly-mode getter/setter/change-handler methods in the same style the toolbar uses today
  - already proxies camera-pose read/write
  - does not yet expose toolbar-friendly `FOV` or clip-range methods

Current shared settings read:
- `src/shared/viewSettingsTypes.ts`
  - owns broad view settings such as projection mode, grid, axis overlay, lighting, and materials
  - does not currently own persisted `FOV`, `Clip Start`, or `Clip End` values

Important implementation read:
- `FOV` is much closer to implementation because the runtime already tracks perspective FOV explicitly
- `Clip Start` and `Clip End` are a deeper pass because near/far are still auto-derived from camera distance rather than user-authored settings

### Locked Implementation Direction

#### 1. Split `FOV` From Clip-Range Runtime Work

Important rule:
- do not force `FOV`, `Clip Start`, and `Clip End` into one first implementation slice
- land `FOV` first
- handle the authored clip-range runtime contract in its own follow-on slice

Reason:
- `FOV` already has a real runtime value seam
- clip range does not yet have a stable authored contract and currently rides on auto near/far math

#### 2. Keep The First Visible Slider Perspective-Only

Important rule:
- the first visible `FOV` slider should appear only when perspective projection is active
- do not widen the same first cut into an orthographic size/zoom UI

Reason:
- the current runtime already models perspective FOV explicitly
- orthographic sizing is a different value model and should not be mixed into the same first implementation cut

#### 3. Keep Clip Validity In Viewer Runtime Ownership

Important rule:
- if `Clip Start` and `Clip End` become user-authored, validity and clamping must live in the shared viewer/runtime seam
- do not implement clip-range correction only in toolbar JSX

Reason:
- the runtime is the real owner of camera near/far behavior
- the toolbar should remain the visible surface, not the hidden rules engine

#### 4. Do Not Invent Persistence Until The Runtime Contract Is Honest

Important rule:
- do not add viewport persistence for these values in the first cut unless the runtime contract actually needs it
- prefer shipping the shared viewer seam first, then deciding whether remembered values belong in local view state or a broader view-settings contract

Reason:
- persistence should follow real ownership
- adding stored state too early would create another hidden owner

### Suggestions / Decisions

#### [ ] q1 - Should `FOV`, `Clip Start`, and `Clip End` live in the existing camera/lens section or in a new subsection?

Question:
- should the first lens-and-clipping controls appear together in the existing camera/lens group, or should they create a new subsection immediately?

Suggestion:
- keep them in the existing camera/lens area first
- only split them into a new subsection later if the section becomes too crowded

Reason:
- clip planes are still camera/lens-facing settings
- the first pass should stay compact and easy to discover

#### [ ] q2 - Should the first pass expose raw values directly?

Question:
- should the toolbar immediately expose raw clip distances without extra interpretation?

Suggestion:
- yes, but keep the labels explicit:
  - `FOV`
  - `Clip Start`
  - `Clip End`
- keep the first value model simple and stable instead of inventing a complex derived UI

Reason:
- the user asked for `ParaSlider` controls directly
- the toolbar should expose the real settings honestly

#### [ ] q3 - What should the first guardrail be when the user drags the sliders into a bad range?

Question:
- how should the first shipped controls behave if the values would cross or become invalid?

Suggestion:
- keep one clear invariant:
  - `Clip Start < Clip End`
- clamp or reject invalid movement through the shared seam instead of leaving the toolbar to invent its own correction rules

Reason:
- the camera-setting contract should own validity
- the toolbar should stay as the visible control surface, not the hidden rules engine

### Internal Phase Ladder

This phase should ship in a few small cuts that keep the first user-facing win narrow and honest.

Shared rule for every subphase:
- keep the `View` toolbar as the visible owner
- keep lens and clip-range validity in the shared camera-setting seam
- do not widen the first implementation into a broad camera-debug surface

## [x] Phase 1 - Perspective FOV Viewer Contract

Purpose:
- create one dedicated toolbar-facing `FOV` contract in the shared viewer seam before any new visible slider is rendered

Owns:
- the dedicated shared `FOV` getter, setter, and change-notification seam
- the runtime handoff between `Viewer.ts`, `viewerBridge.ts`, and `CameraController.ts`
- keeping the first cut limited to perspective FOV only

This phase should:
- add a shared viewer contract for reading current perspective `FOV`
- add a shared viewer contract for writing perspective `FOV`
- add a change-notification seam so the toolbar can stay live-synced
- keep orthographic behavior unchanged
- keep clip range out of this first slice

Does not own:
- visible toolbar rows yet
- clip-range ownership
- unrelated camera-debug readouts

Why first:
- the toolbar already depends on dedicated fly-mode contracts like:
  - `getFlyRollSpeed`
  - `setFlyRollSpeed`
  - `setOnFlyRollSpeedChange`
- `FOV` needs the same style of honest seam before a visible row is added

Done when:
- `viewerBridge.ts` exposes dedicated perspective-`FOV` methods
- `Viewer.ts` implements those methods
- `CameraController.ts` exposes narrow runtime helpers for reading and writing perspective `FOV`
- the first slice is small enough to land without any toolbar JSX churn yet

Implemented result:
- `viewerBridge.ts` now exposes dedicated perspective-`FOV` getter, setter, and change-handler methods
- `Viewer.ts` now proxies that seam and emits change notifications when direct `FOV` writes or applied camera poses change the perspective `FOV`
- `CameraController.ts` now owns narrow perspective-`FOV` read/write helpers, clamps authored values into a safe runtime range, and keeps orthographic mode behavior unchanged

## [x] Phase 2 - Camera Section FOV ParaSlider

Purpose:
- add the first visible lens row once the shared `FOV` contract exists

Owns:
- one `ParaSlider` labeled `FOV`
- its placement inside the existing `Camera` section
- perspective-only visibility/wiring for that row

This phase should:
- render one `FOV` `ParaSlider` in the `Camera` section
- wire it to the new shared perspective-`FOV` seam
- keep the slider hidden or disabled when orthographic projection is active
- keep the rest of the camera section behavior unchanged

Does not own:
- clip-range controls
- orthographic lens UI
- a broader camera-section redesign

Why next:
- once the shared contract exists, this is the smallest honest user-facing win

Done when:
- the `Camera` section renders an `FOV` `ParaSlider`
- the row stays in sync with live viewer `FOV`
- focused toolbar proof covers the new slider without widening into clip work

Implemented result:
- `ViewToolbar.tsx` now renders one `FOV` `ParaSlider` inside the existing `Camera` section when perspective projection is active
- the row now reads and writes through the shared perspective-`FOV` viewer seam instead of inventing toolbar-local camera state
- orthographic mode keeps the first cut narrow by hiding the `FOV` row entirely

## [x] Phase 3 - Authored Clip Range Runtime Contract

Purpose:
- replace the current auto-only near/far model with one runtime seam that can honestly support user-authored clip range

Owns:
- the first explicit runtime model for authored `Clip Start` and `Clip End`
- validity rules such as `Clip Start < Clip End`
- shared viewer bridge methods and notifications for clip range

This phase should:
- decide how authored clip values interact with the current auto near/far math
- add a dedicated runtime contract for clip range
- keep validity and clamping in the runtime owner
- avoid introducing toolbar-specific correction logic

Does not own:
- visible clip sliders yet
- broader camera persistence decisions unless they become necessary

Why separate:
- clip range is not a thin UI follow-on
- it requires changing current runtime ownership, so it deserves its own Codex-sized slice

Done when:
- the runtime has one honest authored clip-range seam
- `viewerBridge.ts` exposes that seam cleanly
- the toolbar can consume it later without owning the hard rules

Implemented result:
- `CameraController.ts` now owns one explicit clip-range runtime contract with authored-vs-auto ownership, clamp rules, and shared `Clip Start < Clip End` validity handling
- `Viewer.ts` and `viewerBridge.ts` now expose dedicated camera clip-range getter, setter, and change-handler seams for future toolbar/UI consumers
- `CameraPose` now carries clip-range mode plus values so authored clip ownership survives camera-pose history, viewport restore, and pose application instead of becoming a hidden side channel

## [x] Phase 4 - Clip Start And Clip End ParaSliders

Purpose:
- add the visible clip-range rows only after the authored runtime contract is stable

Owns:
- visible `Clip Start` and `Clip End` rows
- slider labeling and ordering
- wiring those rows to the shared authored clip-range seam

This phase should:
- add one `ParaSlider` labeled `Clip Start`
- add one `ParaSlider` labeled `Clip End`
- keep both rows in the same camera/lens surface as `FOV`
- reflect the shared clip-range validity rules without re-implementing them in the toolbar

Does not own:
- a generic camera-debug panel
- unrelated projection or orthographic controls

Done when:
- `Clip Start` and `Clip End` exist as visible `ParaSlider` rows
- both rows read and write the shared authored clip-range seam
- focused proof covers the toolbar rows plus the runtime validity behavior

Implemented result:
- `ViewToolbar.tsx` now renders live `Clip Start` and `Clip End` `ParaSlider` rows in the existing `Camera` section whenever the shared clip-range seam is available
- both rows now read and write the authored clip-range viewer seam while runtime ownership keeps the validity and clamping rules honest
- orthographic mode still hides the perspective-only `FOV` row, but now keeps both clip sliders visible because clip range applies across the shared camera runtime

### Expected File Targets

Phase 1 likely runtime files:
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`

Phase 2 likely runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Phase 3 likely runtime files:
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`

Phase 4 likely runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Likely proof files:
- `src/app/components/ViewToolbar.test.tsx`
- focused viewer or bridge tests around shared `FOV` and clip-setting validity seams

No-widening rule:
- do not turn this phase into a rebuild of the whole camera-settings surface
- do not widen it into unrelated viewport-HUD or gizmo controls
- do not hide the first shipped result behind a debug-only path

### Verification Bar

This phase is only done if it proves all of the following:
- the `View` toolbar renders `FOV`, `Clip Start`, and `Clip End` `ParaSlider` controls
- all three sliders read and write one shared lens/clip-setting seam
- invalid clip-range combinations are handled outside ad hoc toolbar-only logic
- the visible controls remain understandable for ordinary viewport use

Required proof:
- add focused proof for the Phase 1 shared `FOV` contract
- add focused toolbar proof for the Phase 2 `FOV` row
- add focused runtime proof for the Phase 3 authored clip-range contract
- add focused toolbar proof for the Phase 4 `Clip Start` and `Clip End` rows

Done when:
- `FOV`, `Clip Start`, and `Clip End` exist as real `ParaSlider` controls in the `View` toolbar
- their behavior is routed through one honest shared seam
- the first user-facing camera-controls enrichment lands without widening into a generic debug surface

## [x] Phase 5 - Value Language, Defaults, And Small Safety Polish

Purpose:
- make the first clip-control pass read more clearly once the sliders exist

This phase should:
- tighten visible wording if needed
- confirm the defaults and reset behavior feel sane
- add any small helper copy or range polish needed to keep the controls understandable

Important rule:
- keep this as a small follow-on polish bucket
- do not use it as a back door for unrelated camera-settings growth

Implemented result:
- the `Camera` section now shows explicit clip-mode helper text so the first shipped clip controls read more honestly in normal use
- authored clip mode now exposes one `Auto Clip` reset path that returns the viewer seam to auto distance-driven ownership
- the shared viewer/runtime seam now supports that reset behavior directly instead of forcing later UI to invent a toolbar-only workaround

## [x] Phase 6 - Projection Toggle Sync Proof And Stop

Purpose:
- close the lane with one explicit proof-only pass around projection transitions and camera-section sync, then stop before this phase turns into broader camera-settings growth

Owns:
- focused proof for switching between `Perspective` and `Orthographic` after the new camera controls exist
- proof that the `Camera` section keeps the right rows visible as projection mode changes
- proof that the shared `FOV` and clip seams stay synchronized through those visible projection changes

This phase should:
- add one focused toolbar proof that starts in perspective, confirms visible `FOV` plus clip rows, switches to orthographic, then confirms:
  - `FOV` is hidden
  - `Clip Start` and `Clip End` remain visible
  - clip helper language still reflects the current seam state
- add one focused toolbar proof that switches back to perspective and confirms the `FOV` row returns live-synced instead of coming back stale or empty
- add viewer/runtime proof only if the projection-toggle path still has an uncovered contract seam after the toolbar proof is written
- stop after the transition proof is covered; do not use this phase to add more controls, persistence, presets, or layout changes

Does not own:
- new camera-setting rows
- clip-range persistence
- orthographic zoom/height controls
- a broader camera section redesign

Why next:
- the value seams and visible rows are already shipped
- the remaining honest closeout is to prove the camera section behaves correctly when projection mode changes, because that is where the perspective-only `FOV` row and projection-agnostic clip rows meet

Likely implementation files:
- `src/app/components/ViewToolbar.test.tsx`
- `src/viewer/Viewer.test.ts`
- only if truly needed after the proof read:
  - `src/app/components/ViewToolbar.tsx`
  - `src/viewer/Viewer.ts`

Verification focus:
- focused toolbar proof around projection toggles plus camera-row visibility/sync
- `npm` test targeting the touched camera-toolbar proof files
- broader build only if the implementation needs runtime or JSX edits beyond tests

### Acceptance Shape

This phase is done when:
- one focused proof slice covers projection-toggle behavior for the shipped camera controls
- the `Camera` section correctly hides and restores the perspective-only `FOV` row while keeping clip controls visible across projection changes
- the lane stops without widening into more camera-surface growth

Implemented result:
- `ViewToolbar.test.tsx` now keeps one mounted toolbar alive while projection mode flips from `Perspective` to `Orthographic` and back, proving the camera section hides and restores the `FOV` row at the right times
- the same proof also confirms that `Clip Start`, `Clip End`, and the clip helper language stay synced to the shared seam across those projection transitions instead of coming back stale
- this final lane closed as focused proof only, without adding more camera rows, persistence, or broader section redesign work

## [x] Phase 7 - Camera Subsection Grouping And Framing Split

Purpose:
- organize the visible `Camera` section more clearly now that the lens and clip controls exist, without widening into a broader camera-surface redesign

Owns:
- one new lower camera subsection for the current projection/framing actions
- the collapse / expand behavior for that lower subsection
- moving the existing `Perspective` plus framing actions into that lower subsection
- preserving the current clip-control area above it

This phase should:
- keep the current `FOV`, `Clip Start`, `Clip End`, helper text, and `Auto Clip` path in the top camera subsection
- add one second camera subsection below the `Auto Clip` path
- make that lower subsection collapsible and expandable
- let the collapsed state hide all of the regrouped projection and framing options
- move these existing actions into that lower subsection:
  - `Perspective`
  - `Orthographic`
  - camera preset buttons such as `Top`, `Front`, `Left`, `Right`, `Iso`
  - `Frame`
  - `Frame All`
- keep the command routing exactly the same while only improving visible grouping and scan order

Current live implementation read:
- `src/app/components/ViewToolbar.tsx`
  - the `Camera` body is currently one flat `.V15Wrap.CameraToolbar`
  - `Perspective`, `Orthographic`, preset buttons, `Frame`, `Frame All`, `FOV`, clip sliders, helper text, and `Auto Clip` all render in one uninterrupted stack
- the same file already listens for nested `.ViewSection` `toggle` events and schedules toolbar height resync
  - this means a nested collapsible shell can likely reuse the existing height-settle path instead of inventing a second measurement system
- `src/app/theme/surfaces/viewport-overlay.css`
  - already owns the visible section-shell styling plus `.CameraToolbar` spacing
  - will likely need one small local style seam for the new lower camera subsection summary/body

Locked implementation direction:
- prefer a real nested `details` / `summary` subsection inside the `Camera` body over a custom boolean-only collapse shell
- keep the top camera subsection always visible
- default the new lower projection/framing subsection to open first unless live implementation shows a stronger reason to start collapsed
- keep all command handlers and viewer/command routing untouched; this pass should mainly move JSX into a new grouped shell and add the smallest supporting styles/tests

Implementation notes:
- do not move `FOV`, `Clip Start`, `Clip End`, helper text, or `Auto Clip` into the new lower subsection
- do not create a second owner for projection mode; `Perspective` / `Orthographic` must continue using the existing command seam
- keep tabs-mode behavior honest; if the parent `Camera` section is active in tabs mode, the new lower subsection should still be able to expand/collapse within that active panel
- prefer one local subsection label that reads as projection/framing ownership instead of a vague generic heading

Does not own:
- new camera controls
- projection behavior changes
- clip-range logic changes
- a broader rewrite of section shells or toolbar presentation modes

Why next:
- the `Camera` section now has enough controls that the older flat stacking reads less clearly
- the user-facing improvement is mostly layout and grouping, so it fits as one small follow-on after the earlier controls and proof work

Likely implementation files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`

Verification focus:
- focused toolbar proof that the new lower subsection renders below the clip area
- focused toolbar proof that collapsing the new lower subsection hides its grouped options and expanding it restores them
- focused toolbar proof that `Perspective`, camera preset buttons, `Frame`, and `Frame All` still render and route through the same command seams after the regrouping

Done when:
- the current flat `CameraToolbar` stack is split without changing command ownership
- the new lower subsection uses one honest collapsible shell
- toolbar height/overflow behavior still responds correctly when that subsection opens and closes
- focused toolbar proof covers both hidden/visible grouped-option states plus unchanged command routing

### Acceptance Shape

This phase is done when:
- the `Camera` section is split into a clearer upper clip/lens area and one lower projection/framing subsection
- the lower subsection sits below the `Auto Clip` path
- the lower subsection can collapse and expand to hide or reveal all of its grouped options
- the regrouped controls keep their previous command behavior unchanged

Implemented result:
- `ViewToolbar.tsx` now keeps the clip/lens controls in the top camera area and moves `Perspective`, `Orthographic`, the camera preset buttons, `Frame`, and `Frame All` into one lower `Projection & Framing` subsection
- that lower subsection now uses one collapsible `details` shell so the grouped projection/framing options can hide completely when closed and return when reopened
- `ViewToolbar.test.tsx` now proves the subsection sits below `Auto Clip`, hides its grouped options when collapsed, restores them when reopened, and preserves the same shared projection/preset/framing command routing

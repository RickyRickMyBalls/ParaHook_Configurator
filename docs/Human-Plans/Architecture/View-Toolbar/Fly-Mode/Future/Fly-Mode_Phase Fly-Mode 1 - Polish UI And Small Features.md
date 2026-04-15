# Fly Mode Phase Fly-Mode 1 - Polish UI And Small Features

## Doc Header

### Doc History
10. 2026-04-14 23:57:29: Marked `Phase 6 - Fly Mode Type Split: Drone And Free Cam` complete after the shipped runtime pass added a viewer-backed `Fly Mode Type` `ParaSelect` to `src/app/components/ViewToolbar.tsx`, preserved the current fly behavior as `Drone`, and introduced first-cut upright no-bank `Free Cam` behavior through one narrow viewer fly-type seam plus a small `CameraController` helper
9. 2026-04-14 23:48:08: Prepped `Phase 6 - Fly Mode Type Split: Drone And Free Cam` for implementation by locking the current shipped behavior as `Drone`, defining first-cut `Free Cam` around an upright no-bank camera read, and narrowing the next runtime pass to one visible mode select plus the smallest honest roll-suppression split in `src/viewer/Viewer.ts`
8. 2026-04-14 23:44:50: Added `Phase 6 - Fly Mode Type Split: Drone And Free Cam`, locking the next fly-mode follow-on to naming the current runtime feel as `Drone` and adding one second visible `Free Cam` mode that should make look/orbit behavior feel more normal and less drone-like without reopening the whole fly-runtime architecture
7. 2026-04-14 23:26:08: Marked `Phase 5 - Fly Mode Activate Select And Always-On Option` complete after the shipped runtime pass added a viewer-backed `Fly Mode Activate` `ParaSelect` to `src/app/components/ViewToolbar.tsx`, introduced one narrow fly-activation-mode contract in `src/app/viewerBridge.ts`, and made opt-in `Always On` mode real runtime truth in `src/viewer/Viewer.ts` with focused toolbar and viewer proof
6. 2026-04-14 23:07:18: Prepped `Phase 5 - Fly Mode Activate Select And Always-On Option` for implementation by locking the visible toolbar owner to the existing `Fly Mode` section in `src/app/components/ViewToolbar.tsx`, confirming that `src/app/viewerBridge.ts` still has no fly-activation-mode contract, and grounding the main runtime blocker in `src/viewer/Viewer.ts` where fly mode still starts only from `event.button === 2` pointerdown and keyboard fly routing only becomes active while `flySession !== null`
5. 2026-04-14 23:04:15: Added `Phase 5 - Fly Mode Activate Select And Always-On Option`, locking the next visible follow-on to one `ParaSelect` in the `Fly Mode` toolbar section with `Right Click` as the default activation policy and one explicit `Always On` option so users can enter fly mode without holding `RMB`, while keeping actual fly-session ownership and safety policy with `Camera-Controls` plus `Viewer.ts`
4. 2026-04-14 23:00:11: Marked `Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control` complete after the shipped runtime pass added a new top-level `Fly Mode` section in `src/app/components/ViewToolbar.tsx`, exposed a viewer-backed `Roll Speed` `ParaSlider`, and replaced the old hard-coded fly-roll seam in `src/viewer/Viewer.ts` with one narrow viewer-owned roll-speed contract plus focused toolbar and viewer proof
3. 2026-04-14 22:41:32: Prepped `Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control` for implementation by locking the visible toolbar owner to `src/app/components/ViewToolbar.tsx`, confirming that `src/app/viewerBridge.ts` currently exposes only fly-speed helpers and therefore needs one narrow roll-speed contract, and grounding the runtime blocker in the hard-coded `FLY_CAMERA_ROLL_RADIANS_PER_SEC` seam inside `src/viewer/Viewer.ts`
2. 2026-04-14 22:40:15: Added `Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control`, locking the next visible fly-mode follow-on to one explicit `Fly Mode` subsection in `ViewToolbar.tsx` and one `Roll Speed` `ParaSlider` so fly UI can widen beyond the HUD through a named toolbar home without moving fly runtime ownership out of `Camera-Controls`
1. 2026-04-14 22:36:17: Added this standalone future phase doc for `Fly-Mode 1`, turning the new `Fly-Mode` subfamily into one implementation-ready forward lane focused on viewport-local HUD polish, fly-status readability, and small user-facing follow-ons while keeping fly-navigation runtime ownership with `Camera-Controls`

### Purpose

This doc locks the first `Fly-Mode` phase.

Use it to answer:
- what the first fly-mode UI phase should own
- where fly-mode polish should start now that the base fly runtime already exists
- which visible fly affordances should be cleaned up before the family widens
- how small fly follow-ons should stay scoped to user-facing UI instead of turning into another camera-runtime phase

### Why This Phase Exists

The repo already has real fly behavior under `Camera-Controls`, including:
- held-`RMB` fly-session ownership
- fly-speed state
- fly roll behavior
- viewport-local fly-speed control
- roll, pointer-lock, and upright handoff follow-ons

That means the next honest fly-related work does not have to start with another deep runtime pass.

There is also a narrower user-facing lane around:
- HUD/readout clarity while fly mode is active
- small visible affordances that make fly mode easier to read and tune
- a future named toolbar home once the fly controls need to live outside the temporary HUD-only surface
- light UI cleanup so the fly surface feels intentional instead of merely functional

This phase exists to give that visible fly surface one clear first planning home.

### Scope

This phase covers:
- fly-mode HUD and status-surface polish
- small user-facing fly follow-ons
- readability, layout, and discoverability improvements for the visible fly surface
- the first explicit `View` toolbar home for fly-mode controls when that surface becomes justified

This phase does not cover:
- reworking fly-session ownership
- reworking fly camera math
- reworking keyboard routing or pointer-lock policy
- sticky fly mode
- large new control families unrelated to current fly UI

## Doc Body

## [ ] `Fly-Mode 1` - `Polish UI And Small Features`

### Header

Purpose:
- make the visible fly-mode surface feel cleaner, clearer, and more intentional now that the first runtime ladder already exists

Owns:
- viewport-local fly HUD polish
- small visible fly affordances
- focused UI follow-ons that help users read and tune fly mode more easily

Keeps for later or elsewhere:
- camera-runtime behavior
- input-owner changes
- movement semantics
- larger camera-control architecture changes

### Target Result

At the end of this phase:
- the fly-mode HUD reads clearly while active
- the current fly-state information feels easier to scan at a glance
- the existing fly-speed control surface feels visually intentional
- small fly-related UI gaps have dedicated follow-on space instead of being smuggled into unrelated camera-runtime work

### Cross-Doc Boundary

Important rule:
- this phase can touch the visible fly UI seam, but it must keep actual fly-navigation ownership with `Camera-Controls`

That means:
- `ViewportOverlay.tsx` and the viewport HUD surface are fair game
- `viewport-overlay.css` is fair game
- a tiny `ViewerApi` or viewer-facing support seam is acceptable only when the visible UI truly needs it
- `Viewer.ts` and `CameraController.ts` should not become the main owners of this phase

### Current Starting Point

Current doc-backed and code-backed read:

- `docs/Human-Plans/Architecture/Camera-Controls/Camera_Controls-Index.md`
  - already treats fly navigation as the `Camera-6.*` family
  - already records that the visible fly-speed slider belongs in the viewport HUD/status box rather than the `View` toolbar panel
- `src/app/components/ViewToolbar.tsx`
  - is the visible owner for named `View` toolbar subsections
  - is therefore the honest first toolbar home if fly-mode controls widen beyond the viewport HUD
- `src/app/components/ViewportOverlay.tsx`
  - already renders the viewport-local fly HUD surface
  - already owns the current `Fly Speed` `ParaSlider` seam
- `src/app/components/ViewportOverlay.test.tsx`
  - already proves that fly-speed HUD behavior renders and stays synced to the matching viewport viewer
- `src/app/theme/surfaces/viewport-overlay.css`
  - already owns the viewport HUD visual surface

Implementation-ready rule:
- start from the existing viewport HUD seam instead of relocating fly controls into a second surface

### Questions / Decisions

#### [ ] q1 - How much of this phase should stay pure polish versus adding one or two tiny conveniences?

Suggestion:
- keep polish first
- allow only small convenience additions that directly improve the existing visible fly surface instead of widening into a new control family

#### [ ] q2 - Should new fly UI stay viewport-local even when multiple viewports exist?

Suggestion:
- yes
- keep fly UI scoped to the active viewer/viewport surface, matching the current fly-speed HUD ownership model

#### [ ] q3 - When should fly controls graduate from the HUD into the `View` toolbar?

Suggestion:
- only when the control is stable enough to deserve a named reusable section
- if that happens, use one explicit `Fly Mode` subsection in the `View` toolbar instead of scattering fly controls into `Camera`, `View`, or `Gizmo`

### Internal Phase Ladder

This phase should still ship through a few narrow internal cuts instead of trying to solve every fly-mode UI idea at once.

## [ ] Phase 1 - HUD Layout And Readability Cleanup

Purpose:
- tighten the current fly HUD presentation so the active fly state and fly-speed control are easier to scan without changing runtime behavior

This phase should:
- review spacing, grouping, and label clarity in the fly HUD
- keep the current viewport-local `Fly Speed` control but improve its surrounding presentation if needed
- ensure the active fly read feels visually intentional rather than tacked on

Likely runtime files:
- `src/app/components/ViewportOverlay.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/components/ViewportOverlay.test.tsx`

Done when:
- the active fly HUD reads clearly
- the fly-speed control feels intentionally grouped with the rest of the fly readout
- the pass remains UI-local

## [ ] Phase 2 - Small Fly Convenience Follow-Ons

Purpose:
- add only the smallest honest user-facing follow-ons that improve the current visible fly experience without reopening camera ownership

This phase should:
- reserve room for one or two narrow UI-visible fly conveniences if the live HUD still feels incomplete after `Phase 1`
- prefer additions that clarify current state, tuning, or discoverability over deeper input changes
- keep all additions scoped to the existing viewport-local fly surface

Guardrail:
- do not widen this step into sticky fly mode, rebinding, or deeper camera-runtime behavior

Likely runtime files:
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- supporting viewer seams only if the visible UI truly needs one more exposed value

Done when:
- the small additions feel like honest polish follow-ons rather than a second fly-runtime phase
- the viewport-local ownership model stays intact

## [ ] Phase 3 - Focused Proof And Stop

Purpose:
- prove the visible fly surface works cleanly after the polish pass and then stop before the phase grows into a larger camera backlog

This phase should:
- widen focused proof around the fly HUD only as needed
- confirm the polished fly UI stays tied to the matching viewport
- confirm the work did not change the broader fly-runtime owner split

Likely proof file:
- `src/app/components/ViewportOverlay.test.tsx`

Done when:
- the fly UI changes are covered by focused proof
- the lane still reads as a small forward UI phase
- the repo has a clean stopping point before any later fly-mode ideas widen

## [x] Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control

Purpose:
- add the first named `Fly Mode` subsection to the `View` toolbar and expose one explicit `Roll Speed` control there through `ParaSlider`

This phase should:
- add a new top-level or clearly named `Fly Mode` subsection in `src/app/components/ViewToolbar.tsx`
- place one `Roll Speed` `ParaSlider` inside that subsection
- keep the control aligned with the active viewport/viewer fly state instead of inventing a second unrelated toolbar-only state owner
- preserve the existing fly HUD unless the later implementation proves a visible duplication should be reduced

Locked ownership direction:
- `Camera-Controls`
  - still owns actual roll semantics and fly-runtime behavior
- `ViewToolbar.tsx`
  - owns the visible named toolbar subsection and control placement
- supporting viewer/viewer-api seams
  - may expose the current roll-speed value and setter if the visible toolbar control needs one narrow shared contract

Important rule:
- do not turn this phase into a broader migration of all fly HUD controls into the toolbar
- do not move fly input ownership, roll math, or keyboard behavior into the toolbar
- do use the same `ParaSlider` language as the rest of the repo's visible control surfaces

### Implementation Read

Current live runtime seam:
- `src/app/components/ViewToolbar.tsx`
  - already owns the named top-level `View` toolbar subsections:
    - `Camera`
    - `Transform`
    - `Snap`
    - `Gizmo`
    - `View`
    - `Environment`
    - `Materials`
  - already imports and renders `ParaSlider`
  - is therefore the honest owner for the first explicit `Fly Mode` subsection
- `src/app/viewerBridge.ts`
  - currently exposes only fly-session UI helpers for:
    - `isFlyModeActive`
    - `getFlyMoveSpeed`
    - `setFlyMoveSpeed`
    - `setOnFlyMoveSpeedChange`
  - does not yet expose any roll-speed getter/setter/change subscription seam
- `src/app/components/ViewportOverlay.tsx`
  - proves the existing viewer-api pattern for fly UI:
    - read current value from viewer
    - subscribe to viewer-owned changes
    - write changes back through one narrow setter
- `src/viewer/Viewer.ts`
  - currently keeps fly roll speed as the hard-coded constant:
    - `FLY_CAMERA_ROLL_RADIANS_PER_SEC = Math.PI * 0.75`
  - currently applies roll through:
    - `this.cameraController.applyFlyRollDelta(rollDirection * FLY_CAMERA_ROLL_RADIANS_PER_SEC * dt)`
  - therefore owns the real runtime blocker for a user-facing `Roll Speed` control
- `src/app/components/ViewToolbar.test.tsx`
  - is already the focused proof seam for top-level section ownership and visible toolbar regrouping

Implementation-ready conclusion:
- `Phase 4` should reuse the existing fly-speed UI pattern, but for roll speed
- the narrow missing seam is:
  - one viewer-owned roll-speed value
  - one viewerBridge contract for getting/setting/subscribing to that value
  - one `ViewToolbar.tsx` subsection that renders the `ParaSlider`

### Locked Implementation Shape

The next runtime pass should:
1. add one viewer-owned fly roll-speed value in `src/viewer/Viewer.ts` instead of continuing to depend on only the hard-coded `FLY_CAMERA_ROLL_RADIANS_PER_SEC` constant
2. expose one narrow shared contract in `src/app/viewerBridge.ts`, likely mirroring the existing fly-speed seam:
   - `getFlyRollSpeed`
   - `setFlyRollSpeed`
   - optional `setOnFlyRollSpeedChange`
3. add one explicit `Fly Mode` subsection in `src/app/components/ViewToolbar.tsx`
4. render one `Roll Speed` `ParaSlider` inside that subsection
5. wire the slider to the active viewer through the shared viewer-api seam instead of inventing a toolbar-only state owner

Important rule:
- keep the first implementation cut to `Roll Speed` only
- do not migrate the existing `Fly Speed` control into the toolbar in the same pass unless a tiny follow-up cleanup is truly needed after the subsection lands
- do not widen this phase into sticky fly toggles, roll keybinding changes, or broader HUD redesign

### Expected File Targets

Primary runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Primary proof file:
- `src/app/components/ViewToolbar.test.tsx`

Possible supporting proof file:
- `src/app/components/ViewportOverlay.test.tsx` only if the shared fly-ui contract changes in a way that affects the existing HUD seam

No-widening rule:
- do not widen into `CameraController.ts` unless the roll-speed value truly cannot stay viewer-owned
- do not widen into `View`-state persistence or toolbar layout redesign beyond the one new subsection

### Suggested Implementation Order

1. Replace the hard-coded-only roll-speed ownership in `src/viewer/Viewer.ts` with one viewer-owned value that still defaults to the current `Math.PI * 0.75` behavior.
2. Add the matching getter/setter/change-subscription seam to `src/app/viewerBridge.ts`.
3. Add a new `Fly Mode` subsection to `src/app/components/ViewToolbar.tsx`.
4. Render a `Roll Speed` `ParaSlider` in that subsection using the shared viewer-api seam.
5. Add focused toolbar proof that the new subsection renders and routes changes through the shared viewer contract.

Likely runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- supporting viewer/viewer-api files only if one narrow roll-speed seam still needs to be exposed

Done when:
- the `View` toolbar has one explicit `Fly Mode` subsection
- that subsection includes one `Roll Speed` `ParaSlider`
- the control remains wired to the same fly-runtime truth rather than becoming a toolbar-only fake value
- the change stays scoped to visible fly UI ownership and proof

### Phase 4 Result

- `src/app/components/ViewToolbar.tsx`
  - now renders a new top-level `Fly Mode` section as a sibling of the other named `View` toolbar subsections
  - now subscribes to the active viewport viewer for fly-roll-speed updates and renders one `Roll Speed` `ParaSlider` there
- `src/app/viewerBridge.ts`
  - now exposes the narrow shared fly-roll-speed contract:
    - `getFlyRollSpeed`
    - `setFlyRollSpeed`
    - `setOnFlyRollSpeedChange`
- `src/viewer/Viewer.ts`
  - no longer depends only on the old hard-coded roll constant during live roll updates
  - now owns one viewer-backed fly-roll-speed value that defaults to the previous `Math.PI * 0.75` behavior and emits changes back to the toolbar seam
- focused proof landed in:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/viewer/Viewer.test.ts`
- the existing viewport HUD `Fly Speed` control was intentionally left alone in this pass
- `Camera-Controls` still owns actual roll behavior; the toolbar only owns visible control placement

## [x] Phase 5 - Fly Mode Activate Select And Always-On Option

Purpose:
- add one explicit activation-policy control to the `Fly Mode` toolbar section so users can choose whether fly mode is entered by holding `Right Click` or by keeping fly mode always active

This phase should:
- add one `ParaSelect` to the existing `Fly Mode` section in `src/app/components/ViewToolbar.tsx`
- keep `Right Click` as the default activation mode
- add one explicit `Always On` option so the user does not need to hold `RMB` to stay in fly mode
- keep the visible control wired to the active viewport/viewer instead of inventing toolbar-only state

Locked ownership direction:
- `Camera-Controls` and `Viewer.ts`
  - still own the real fly-session activation behavior, safety rules, and any transition policy
- `ViewToolbar.tsx`
  - owns the visible `ParaSelect` placement inside the existing `Fly Mode` section
- supporting viewer/viewer-api seams
  - may expose one narrow activation-mode contract if the toolbar needs it

Important rule:
- do not widen this phase into broader input rebinding
- do not add more than the two named activation modes in the first pass
- do not make always-on activation a hidden keyboard-only toggle; it should be a visible explicit mode choice

### Implementation Read

Current live runtime seam after `Phase 4`:
- `src/app/components/ViewToolbar.tsx`
  - now already owns the dedicated `Fly Mode` section
  - already renders one fly-specific control there through `ParaSlider`
  - already imports `ParaSelect`, so the visible control surface does not need a new toolbar-control primitive
- `src/app/viewerBridge.ts`
  - now already exposes narrow fly-roll helpers
  - does not yet expose any fly-activation-mode getter/setter/subscription seam
- `src/viewer/Viewer.ts`
  - still treats fly activation around the existing held-`RMB` session model
  - currently starts fly only from `handleSketchPlanePickPointerDown(...)` when `event.button === 2` and `canStartFlySession(event)` both pass
  - currently enters fly through `startFlySession(event)`, which still requires:
    - a real pointer event
    - a `pointerId`
    - pointer capture on the viewer canvas
    - the current pointer-lock request path
  - currently exits that session from pointer-up / cancel / blur paths through `endFlySession(...)`
- `src/app/inputRouting.ts`
  - currently routes viewer-fly movement keys only when `viewerFlyActive === true`
- `src/viewer/Viewer.ts`
  - currently feeds that routing seam with `viewerFlyActive: this.flySession !== null`
- `src/app/components/ViewToolbar.test.tsx`
  - is already the focused proof seam for the visible `Fly Mode` toolbar section
- `src/viewer/Viewer.test.ts`
  - is already the focused proof seam for fly-session start/stop behavior and the newer fly-roll runtime seam

Implementation-ready conclusion:
- `Phase 5` should reuse the same toolbar-to-viewer pattern established in `Phase 4`, but for activation mode instead of roll speed
- the missing seam is not only the toolbar select itself
- the real blocker is that fly activation truth is still a temporary pointer-owned session, not a persistent activation-policy value
- the next pass therefore needs:
  - one viewer-owned fly-activation-mode value
  - one shared viewerBridge contract for reading, writing, and subscribing to that value
  - one runtime path that can honor `Always On` without depending on `RMB` pointerdown as the only entry seam
  - one `ParaSelect` in the existing `Fly Mode` toolbar section

### Locked Implementation Shape

The next runtime pass should:
1. add one viewer-owned fly-activation-mode value with `Right Click` as the default
2. expose one narrow shared contract in `src/app/viewerBridge.ts` for that activation mode
3. add one `ParaSelect` to the existing `Fly Mode` section in `src/app/components/ViewToolbar.tsx`
4. use exactly these first options:
   - `Right Click`
   - `Always On`
5. replace the old hard dependency on `RMB` pointerdown as the only fly-entry seam so `Always On` can become real runtime truth instead of a toolbar-only label
6. keep the final behavior scoped to entering and sustaining fly mode, not to wider keybinding or input remapping

Important rule:
- preserve `Right Click` as the default shipped behavior
- treat `Always On` as an explicit opt-in mode
- keep any safety or exit-policy decisions with the fly-runtime owner, not the toolbar surface
- do not fake `Always On` by forcing toolbar-local booleans while `Viewer.ts` still only knows how to enter fly through pointer-owned `startFlySession(event)`

### Locked Runtime Blocker

The main implementation blocker is now explicit:

- `src/viewer/Viewer.ts`
  - still treats fly activation as a temporary session entered only from `RMB` pointerdown
  - still stores fly-active truth as `this.flySession !== null`
  - still gives keyboard fly routing ownership only while that session exists

That means `Always On` cannot be honest if the runtime stays exactly as-is.

The next runtime pass must therefore decide one narrow truthful path:
- either split activation policy from pointer-owned session startup
- or add a second viewer-owned fly-entry path that can activate movement/look routing without requiring held `RMB`

Guardrail:
- make that split only as large as needed to support:
  - `Right Click`
  - `Always On`
- do not widen it into a general fly-input rewrite

### Expected File Targets

Primary runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Primary proof files:
- `src/app/components/ViewToolbar.test.tsx`
- `src/viewer/Viewer.test.ts`

Possible supporting proof file:
- `src/app/components/ViewportOverlay.test.tsx` only if the activation-mode contract affects existing HUD reads

Possible supporting runtime file:
- `src/app/inputRouting.ts` only if the new activation-mode seam requires a narrow routing update beyond the current `viewerFlyActive` boolean path

Done when:
- the `Fly Mode` toolbar section includes one `ParaSelect` for activation mode
- `Right Click` remains the default behavior
- `Always On` exists as an explicit visible option
- the control is wired to real viewer-owned fly activation truth rather than a toolbar-only placeholder
- the phase stays narrow and does not widen into general input remapping

### Implementation Spec

This phase should:
- start with `Phase 1 - HUD Layout And Readability Cleanup`
- follow with `Phase 2 - Small Fly Convenience Follow-Ons`
- finish with `Phase 3 - Focused Proof And Stop`
- treat `Phase 4 - View Toolbar Fly Mode Subsection And Roll Speed Control` as the shipped first explicit toolbar-widening follow-on for the fly UI lane
- treat `Phase 5 - Fly Mode Activate Select And Always-On Option` as the shipped activation-policy follow-on now that the `Fly Mode` section exists
- keep all work anchored to the existing viewport-local fly HUD seam
- preserve the visible fly-speed control as a viewport-scoped surface
- avoid relocating fly UI into unrelated panels unless a later dedicated phase says otherwise

### Phase 5 Result

- `src/app/components/ViewToolbar.tsx`
  - now renders a viewer-backed `Fly Mode Activate` `ParaSelect` inside the existing `Fly Mode` section
  - keeps the control wired to the active viewport viewer through the same subscribe/read/write pattern already used for roll speed
- `src/app/viewerBridge.ts`
  - now exposes the narrow shared fly-activation-mode contract:
    - `getFlyActivationMode`
    - `setFlyActivationMode`
    - `setOnFlyActivationModeChange`
- `src/viewer/Viewer.ts`
  - now owns one explicit fly-activation-mode value with `Right Click` as the default
  - now supports opt-in `Always On` by starting fly from the next viewport click, consuming that entry click, keeping the session alive through pointer release, and ending the always-on session when blur/cancel happens or when the mode switches back to `Right Click`
- focused proof landed in:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/viewer/Viewer.test.ts`
- the existing fly-speed HUD and fly-roll behavior were intentionally left alone in this pass
- `Viewer.ts` still owns fly-session truth; the toolbar only owns visible control placement

## [x] Phase 6 - Fly Mode Type Split: Drone And Free Cam

Purpose:
- name the current fly behavior honestly as `Drone`
- add one second fly-mode type called `Free Cam`
- make `Free Cam` feel more like a normal free camera than the current drone-style flight read

This phase should:
- add one visible fly-mode-type control in the existing `Fly Mode` toolbar section
- preserve the current shipped fly feel as the baseline `Drone` mode instead of silently changing it
- add one new `Free Cam` mode that reduces the current drone-like read, especially around how the camera feels while looking/orbiting through space
- keep the mode switch wired to real viewer/runtime truth instead of inventing toolbar-only state

Locked naming direction:
- `Drone`
  - means the current shipped fly behavior
  - should preserve the current feel so existing users do not lose the behavior they already learned
- `Free Cam`
  - means a more normal free-camera travel mode
  - should aim for a less drone-like movement/look read, especially if the current mode feels too “aircraft” or too locked to that style

Important rule:
- do not rename the current fly behavior without preserving it as one explicit selectable mode
- do not widen this phase into gravity flight, controller support, or the broader `Generation 2` FPV lane
- do not try to solve every camera-feel complaint in one pass; the first honest goal is one clean two-mode split

### Suggested Specificity

Current suggestion:
- this idea is clear enough to add as a phase now
- implementation should still lock a few concrete behavior differences before coding starts

The most useful specifics to lock later are:
- whether `Free Cam` should completely disable roll, or only stop automatic aircraft-like feel while still allowing optional roll input
- whether `Free Cam` should keep the current vertical movement model or shift to a more neutral noclip-style rise/fall read
- whether “more normal orbit” means:
  - freer mouse-look only while flying
  - or a true pivot/orbit relationship when the user is near a target/selection
- whether `Free Cam` should preserve the current upright-handoff / exit behavior or get its own exit normalization

Best planning suggestion:
- define `Free Cam` first as “current fly minus the drone-feel parts” instead of trying to invent a full new cinematic camera system
- keep `Drone` as the compatibility mode
- lock only 2-3 explicit runtime differences for the first implementation pass so the split stays testable and understandable

### Locked Implementation Shape

The next runtime pass should:
1. add one viewer-owned fly-mode-type value with:
   - `Drone`
   - `Free Cam`
2. expose one narrow shared viewerBridge contract for that mode type
3. add one visible `ParaSelect` in the existing `Fly Mode` toolbar section for choosing the mode type
4. preserve the current shipped behavior under `Drone`
5. implement only the first narrow `Free Cam` behavior differences needed to make the mode feel more like a normal free camera

Suggested first-cut `Free Cam` behavior:
- remove or reduce the current drone-like roll read
- make look behavior feel more neutral and less aircraft-like
- keep the rest of the fly stack as unchanged as possible until the split itself proves useful

Guardrail:
- if the planned `Free Cam` differences start touching gravity, thrust curves, or input-device expansion, stop and move that work into the `Generation 2` lane instead

### Implementation Prep Update

Locked implementation decision:
- `Drone`
  - preserves the current shipped fly behavior
- `Free Cam`
  - becomes the upright no-bank mode in the first pass

Locked first-cut `Free Cam` behavior:
- left/right look should not create visible roll
- camera roll should settle back toward `0`
- manual roll input should do nothing while `Free Cam` is active
- current vertical movement, activation rules, and exit behavior should stay the same for now
- “more normal orbit” should mean neutral free-look while flying, not a new target-pivot orbit system

Implementation-ready conclusion:
- the next pass should not search for a new orbit architecture
- it should introduce one viewer-owned fly-mode-type value and use that to branch only the roll/banking behavior
- the honest first proof bar is:
  - `Drone` still behaves like today
  - `Free Cam` stays upright while looking around
  - roll input is ignored in `Free Cam`

Primary blocker:
- `src/viewer/Viewer.ts`
  - currently treats fly roll as one shared behavior path
  - therefore needs the real runtime branch for:
    - `Drone`
    - `Free Cam`

Additional implementation rule:
- keep the existing activation-mode select, speed, and roll-speed controls intact unless one tiny label clarification is truly needed

### Phase 6 Result

- `src/app/components/ViewToolbar.tsx`
  - now renders a viewer-backed `Fly Mode Type` `ParaSelect` inside the existing `Fly Mode` section
  - now exposes:
    - `Drone`
    - `Free Cam`
- `src/app/viewerBridge.ts`
  - now exposes the narrow shared fly-mode-type contract:
    - `getFlyModeType`
    - `setFlyModeType`
    - `setOnFlyModeTypeChange`
- `src/viewer/Viewer.ts`
  - now owns one explicit fly-mode-type value with `Drone` as the default
  - preserves the current shipped roll behavior under `Drone`
  - keeps `Free Cam` upright by suppressing manual roll input and restoring upright fly orientation after mode switches and fly-look updates
- `src/viewer/scene/CameraController.ts`
  - now provides one narrow `restoreFlyUpright()` helper so `Free Cam` can remove visible banking without exiting fly mode
- focused proof landed in:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/viewer/Viewer.test.ts`
- the existing activation-mode select, fly-speed behavior, and fly-roll-speed control were intentionally left intact in this pass
- `Viewer.ts` still owns fly-session truth; the toolbar only owns visible control placement

### Expected File Targets

Primary runtime files:
- `src/app/components/ViewToolbar.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Primary proof files:
- `src/app/components/ViewToolbar.test.tsx`
- `src/viewer/Viewer.test.ts`

Possible supporting runtime file:
- `src/viewer/CameraController.ts` only if the camera-feel split cannot stay viewer-owned

Done when:
- the current fly behavior is preserved and visible as `Drone`
- the user can switch to `Free Cam` from the existing `Fly Mode` toolbar section
- `Free Cam` feels meaningfully less drone-like in one or two concrete ways
- the phase stays small enough to remain a `Fly-Mode 1` follow-on instead of collapsing into the bigger `Generation 2` camera-feel backlog

### Phase Guardrail

This is a fly UI phase, not a hidden camera-runtime rewrite.

Important rule:
- do not treat `Fly-Mode 1` as permission to reopen `Camera-6.*`
- do not smuggle deeper navigation changes into the phase just because the viewport HUD is already being touched
- improve the visible fly surface, prove it, and stop

### Acceptance Shape

This phase is done when:
- the visible fly-mode surface feels cleaner and easier to read
- small fly UI follow-ons, if added, stay narrow and helpful
- the viewport-local ownership model remains intact
- `Camera-Controls` still clearly owns fly runtime behavior

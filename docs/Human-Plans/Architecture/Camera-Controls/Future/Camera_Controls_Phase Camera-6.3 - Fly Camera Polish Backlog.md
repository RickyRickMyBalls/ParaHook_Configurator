# `Camera-6.3` - `Fly Camera Polish Backlog`

## Doc Header

### Doc History
14. 2026-04-14: Tightened `Camera-6.3.6 - Free-Flight Pitch And Loop Support` into an implementation-ready slice by locking the fix to `CameraController.applyFlyLookDelta(...)`, clarifying that the current pitch step rotates only `forward` while leaving `up` fixed, and defining the needed free-flight basis update where pitch rotates both `forward` and `up` around the current right axis without the old pole clamp
13. 2026-04-14: Added planned `Camera-6.3.6 - Free-Flight Pitch And Loop Support` as the next narrow follow-on after wheel speed control, so the backlog now explicitly captures removing the current fly-look pole clamp and allowing pitch to carry through vertical for full aircraft-style loop-the-loops without changing camera type
12. 2026-04-14: Implemented `Camera-6.3.5 - Fly Mode Scroll Wheel Speed Control`, so held-`RMB` fly mode now temporarily remaps the wheel from zoom to base fly-speed adjustment, wheel up/down changes stay synced with the HUD speed control, and normal zoom resumes immediately on fly exit
11. 2026-04-14: Tightened `Camera-6.3.5 - Fly Mode Scroll Wheel Speed Control` into an implementation-ready slice by locking the fly-session wheel override seam in `Viewer.ts`, the shared base-speed ownership path, the recommended multiplicative wheel scaling direction, and the likely tiny `ViewerApi` fly-speed change callback needed to keep the HUD slider visually in sync
10. 2026-04-14: Added planned `Camera-6.3.5 - Fly Mode Scroll Wheel Speed Control` as the next narrow follow-on after roll, so the backlog now explicitly captures temporary wheel-owner remapping during held-`RMB` fly mode where wheel up increases fly speed, wheel down decreases fly speed, and normal zoom returns immediately after fly exit
9. 2026-04-14: Implemented `Camera-6.3.4 - Fly Camera Roll Controls`, so the fly camera now supports held `Q` / `E` roll, persistent rolled orientation across fly-session exit and re-entry, and upside-down flight while keeping `viewer-fly` keyboard ownership and the existing speed controls intact
8. 2026-04-14: Tightened `Camera-6.3.4 - Fly Camera Roll Controls` into an implementation-ready slice by locking the `Q` / `E` mapping, the no-auto-level rule, the per-frame roll seam in `Viewer.ts`, the forward-axis roll helper direction in `CameraController.ts`, and the test expectations around persistent upside-down orientation
7. 2026-04-14: Added planned `Camera-6.3.4 - Fly Camera Roll Controls` as the next narrow follow-on after the shipped speed ladder, so the backlog now explicitly captures `Q` / `E` roll input, persistent rolled camera orientation, and upside-down flight as the next implementation-ready polish slice
6. 2026-04-14: Implemented `Camera-6.3.3 - Viewport HUD Fly Speed ParaSlider`, so the existing viewport HUD/status box now exposes a viewport-scoped fly-speed `ParaSlider`, and the first `Camera-6.3.*` polish ladder is now fully shipped
5. 2026-04-14: Implemented `Camera-6.3.2 - Fly Base Speed State And Viewer Surface`, so the viewer now owns an explicit non-persistent base fly-speed value and exposes a narrow get/set seam through `ViewerApi` for the later viewport HUD `ParaSlider`
4. 2026-04-14: Updated the planned `Camera-6.3.3` control surface so the future fly-speed `ParaSlider` lands inside the existing viewport HUD/status box in `ViewportOverlay.tsx` rather than inside the separate `View` toolbar panel
3. 2026-04-14: Implemented `Camera-6.3.1 - Fly Boost And Descend Remap`, so the shipped fly runtime now uses `Ctrl` = descend, `Shift` = boost, and a fixed boost multiplier while keeping the existing `6.2` teardown and console-suppression seams intact
2. 2026-04-14: Recast `Camera-6.3` from one larger polish backlog into a small `Camera-6.3.*` ladder so Codex can implement the follow-on one narrow slice at a time without mixing runtime remap work, speed-state plumbing, and toolbar UI in one change
1. 2026-04-14: Created this standalone future phase doc for `[Camera-6.3]`, translating the first post-`6.2` fly-camera polish slice into an implementation-ready plan focused on `speed boost`, a `speed control slider`, and the key remap needed to free `Shift` for boost cleanly

### Purpose

This doc defines the fly-camera polish follow-on under the camera-controls family.

Use it to answer:
- how the first post-`6.2` polish work should be broken into Codex-sized slices
- which polish item should land first
- how the `Ctrl`/`Shift` remap should relate to boost and base speed
- where runtime state, viewer plumbing, and toolbar UI should be split apart
- what deeper fly-camera tuning should still stay out of scope for now

### Why This Phase Exists

`Camera-6.2` shipped the core ownership/runtime slice:
- held `RMB` fly-session entry and exit
- mouse look
- `W` / `A` / `S` / `D` movement
- `Space` / `Shift` vertical movement
- console typing suppression through `viewer-fly`
- viewport-local `contextmenu` suppression

That runtime baseline is useful, but the first feel/convenience layer is still missing:
- there is no quick temporary boost for long traversals
- there is no visible speed control for slower inspection or faster travel
- `Shift` is still occupied by descend, which blocks the cleanest boost mapping

The polish work should land next, but not as one wide patch.

If one change tries to do all of the following together:
- remap fly keys
- add boost math
- introduce fly-speed state
- plumb that state through viewer ownership seams
- add toolbar UI
- restabilize tests

then it becomes harder for Codex to finish cleanly in one turn.

So `Camera-6.3` should behave like a small polish umbrella with a tight internal ladder.

### Scope

This phase family covers:
- fly `speed boost` while fly mode is active
- remapping fly descend from `Shift` to `Ctrl`
- introducing a base fly-speed state/value
- surfacing a `speed control slider` for base fly speed
- remapping the scroll wheel during fly mode from zoom to fly-speed adjustment
- keeping boost as a multiplier on top of the base speed
- adding plane-style roll controls during fly mode
- allowing free-flight pitch to pass through vertical so the camera can complete loops
- verifying the updated fly key map still exits cleanly and does not regress viewer or console behavior

This phase family does not cover:
- pointer lock
- sticky toggle-based fly mode
- orthographic fly behavior
- mouse-look sensitivity UI
- invert-look options
- custom keybinding UI
- saved fly settings across app restarts
- a separate boost-tuning slider
- cinematic banking auto-return or auto-leveling

## Doc Body

## [x] `Camera-6.3` - `Fly Camera Polish Backlog`

### Summary

#### Purpose:
- break the first fly-camera polish pass into Codex-sized slices instead of one wider implementation

#### Target result:
- `Camera-6.3.1`
  - shipped:
    - remaps descend to `Ctrl`
    - adds a fixed `Shift` boost in the runtime
- `Camera-6.3.2`
  - shipped:
    - introduces explicit base fly-speed state/plumbing
    - exposes a narrow viewer bridge get/set seam for later HUD control
- `Camera-6.3.3`
  - shipped:
    - exposes that base speed through a viewport HUD `ParaSlider`
- `Camera-6.3.4`
  - shipped:
    - adds `Q` / `E` roll controls while fly mode is active
    - allows the camera to remain rolled, including upside down, after fly input stops
    - keeps fly translation aligned to the camera's rolled local axes for a more aircraft-like feel
- `Camera-6.3.5`
  - shipped:
    - temporarily remaps the scroll wheel during held-`RMB` fly mode from zoom to fly-speed adjustment
    - uses wheel up to increase fly speed and wheel down to decrease fly speed
    - restores normal wheel zoom immediately after fly mode exits
- `Camera-6.3.6`
  - planned:
    - removes the current fly-look pole clamp that blocks pitch through vertical
    - allows full aircraft-style loop-the-loops while staying on the existing `PerspectiveCamera`
    - keeps roll, translation, and wheel-speed control working in the same free-flight orientation model

#### Current code-backed read:
- `src/viewer/Viewer.ts` already owns:
  - fly-session state
  - held movement-key state
  - the per-frame movement update loop
  - fly start/stop and teardown behavior
- `src/viewer/scene/CameraController.ts` already owns the fly motion math
- `src/app/viewerBridge.ts` is the likely seam if the overlay HUD needs to talk to the active viewport's viewer instance
- `src/app/components/ViewportOverlay.tsx` already renders the viewport HUD/status box that shows:
  - `Geometry: ...`
  - `Mode: ...`
  - `Selected: ...`
- `src/app/components/ParaSlider.tsx` already exists and is already used by the viewport overlay surface
- the shared routing seam in `src/app/inputRouting.ts` should not need a new ownership model for this polish ladder

### Locked Direction

- keep the first polish priority on:
  - `speed boost`
  - `speed control slider`
- remap:
  - `Ctrl`
    - descend
  - `Shift`
    - boost
- treat boost as a multiplier on top of the current base fly speed
- do not mix persistence, pointer lock, or sensitivity UI into the first polish ladder

### Phase Breakdown

1. `Camera-6.3.1 - Fly Boost And Descend Remap`
Reason:
- this is the smallest useful runtime-only polish slice
- it improves feel immediately without requiring new toolbar UI or settings plumbing

2. `Camera-6.3.2 - Fly Base Speed State And Viewer Surface`
Reason:
- once boost/remap behavior is stable, the next smallest slice is introducing one explicit base-speed value and the viewer-facing seam needed to control it
- this keeps state/plumbing separate from the visible slider UI

3. `Camera-6.3.3 - View Toolbar Fly Speed Slider`
Reason:
- once the viewer already owns an explicit fly-speed value, the slider can land as a narrow HUD follow-on instead of inventing both the state model and UI at once

4. `Camera-6.3.4 - Fly Camera Roll Controls`
Reason:
- once the first speed ladder is stable, the next smallest feel upgrade is adding roll ownership without reopening the rest of the fly runtime
- this extends the current fly camera from yaw/pitch plus translation into a fuller plane-like orientation model while still staying inside the existing viewer and camera-controller seams

5. `Camera-6.3.5 - Fly Mode Scroll Wheel Speed Control`
Reason:
- once the viewer already owns base fly speed and the fly session already owns temporary input routing, the next small polish slice is letting wheel input tune speed in-place during fly mode
- this keeps speed adjustment under the user's hand while preserving the normal wheel zoom behavior outside held-`RMB` fly mode

6. `Camera-6.3.6 - Free-Flight Pitch And Loop Support`
Reason:
- once roll and wheel-speed control are in place, the next honest flight-feel gap is the current pitch clamp that still prevents the camera from looping over the top like an aircraft
- this is a math/orientation-model fix inside the existing perspective fly camera, not a camera-type swap

### Questions / Decisions

#### [ ] Question 1 - What should the updated fly key map be?

##### Suggested answer
- keep:
  - `W`
    - forward
  - `A`
    - strafe left
  - `S`
    - backward
  - `D`
    - strafe right
  - `Space`
    - ascend
- remap:
  - `Ctrl`
    - descend
  - `Shift`
    - boost

##### Why
- `Shift` is the most natural temporary boost key
- `Space` and `Ctrl` make the vertical pair easy to remember
- this avoids overloading one key with two opposite meanings

#### [ ] Question 2 - How should boost work in the first pass?

##### Suggested answer
- use a fixed multiplier in `Camera-6.3.1`
- do not add a second visible boost tuning control in this ladder

##### Why
- the user only prioritized:
  - `speed boost`
  - `speed control slider`
- a fixed multiplier keeps the first runtime polish slice small and easy to verify

#### [ ] Question 3 - What should the slider control?

##### Suggested answer
- the slider controls the base fly movement speed only
- boost multiplies that base speed while `Shift` is held

##### Why
- that keeps the mental model simple:
  - slider
    - normal speed
  - `Shift`
    - temporary faster travel

#### [ ] Question 4 - Where should the visible speed UI live?

##### Suggested answer
- `src/app/components/ViewportOverlay.tsx`
- specifically inside the existing viewport HUD/status box that already shows:
  - `Geometry: ...`
  - `Mode: ...`
  - `Selected: ...`

##### Why
- it keeps the speed control next to the live viewport state the user is already watching while flying
- it avoids making the user open the separate `View` toolbar just to adjust fly speed
- `ParaSlider` already exists in the same overlay component surface, so the control can match existing UI primitives cleanly

#### [ ] Question 5 - Should the first speed value persist across restarts?

##### Suggested answer
- no, not in `6.3.*`

##### Why
- persistence widens the change into saved settings ownership
- the first polish ladder should stay focused on runtime feel and a visible viewport-local control

#### [x] Question 6 - How should plane-style roll work?

##### Suggested answer
- use `Q`
  - roll left while held during fly mode
- use `E`
  - roll right while held during fly mode
- preserve the rolled orientation after the user releases `Q` / `E` or exits the current held-`RMB` fly session
- do not auto-level or snap the camera back upright

##### Why
- that creates the intended aircraft-like feel instead of treating roll as a temporary visual effect
- preserving the rolled `up` vector keeps later fly movement and look behavior consistent with what the user sees on screen

#### [ ] Question 7 - How should the scroll wheel behave during fly mode?

##### Suggested answer
- while held-`RMB` fly mode is active:
  - wheel up increases the current base fly speed
  - wheel down decreases the current base fly speed
- while fly mode is inactive:
  - wheel returns to the normal viewer zoom behavior immediately
- the fly-speed HUD slider and the temporary wheel adjustments both drive the same viewer-owned base fly-speed value

##### Why
- it removes the need to move the pointer to the HUD slider while the user is already flying
- it reuses the existing base-speed state instead of inventing a second temporary speed channel
- it keeps the interaction mode-dependent rather than permanently changing wheel semantics

#### [ ] Question 8 - Do we need a different camera type for loops?

##### Suggested answer
- no
- keep using the existing `PerspectiveCamera` for fly mode
- fix the fly-look orientation math instead of swapping camera classes

##### Why
- the current blocker is the pitch clamp in `CameraController.applyFlyLookDelta(...)`, not the camera type itself
- `PerspectiveCamera` is already the correct camera type for free-flight navigation
- changing camera type would not solve the current pole-clamp behavior on its own

## [x] `Camera-6.3.1` - `Fly Boost And Descend Remap`

### Summary

#### Purpose:
- land the smallest useful runtime polish slice first

#### Shipped result:
- fly descend now uses `Ctrl`
- fly boost now uses `Shift`
- boost uses a fixed multiplier on top of the current runtime base speed
- the shared keyboard-routing seam now keeps fly movement keys viewer-owned even while `Ctrl` is held for descend

#### Scope:
- remap descend from `Shift` to `Ctrl`
- add fixed temporary boost on `Shift`
- keep current fly entry/exit ownership exactly as shipped in `6.2`

#### Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/inputRouting.test.ts` only if one regression guard is needed

#### Suggested implementation direction:
1. update fly key handling so `Ctrl` becomes descend
2. add temporary boost handling on `Shift` while fly mode is active
3. apply a fixed multiplier during the movement update loop
4. verify existing viewer shortcuts still stay dormant while fly mode owns the keyboard
5. verify `RMB` release, `pointercancel`, and blur teardown still work unchanged

#### Definition of done:
- `Ctrl` descends during fly mode
- `Shift` temporarily boosts fly movement speed
- no toolbar/UI changes are required yet
- fly teardown and console suppression still behave as in `6.2`

## [x] `Camera-6.3.2` - `Fly Base Speed State And Viewer Surface`

### Summary

#### Purpose:
- introduce one explicit base-speed value after the runtime remap is already stable

#### Shipped result:
- `Viewer.ts` now owns an explicit base fly-speed value instead of only using a hard-coded movement constant
- `ViewerApi` now exposes a narrow fly-speed get/set seam for the active viewport's viewer instance
- boost still multiplies the current base speed instead of replacing it
- the first speed value remains non-persistent and runtime-local

#### Scope:
- add viewer-owned base fly-speed state/value
- expose the narrow seam needed for a later viewport-local control to read/write that value
- keep the speed value non-persistent in the first pass

#### Likely files:
- `src/viewer/Viewer.ts`
- `src/app/viewerBridge.ts`
- viewer bridge tests if needed
- `src/viewer/Viewer.test.ts`

#### Suggested implementation direction:
1. add one explicit base fly-speed value in the viewer
2. keep boost multiplicative on top of that value
3. expose a narrow get/set seam through the active viewer bridge path
4. keep defaults local to the runtime/workspace session
5. verify the viewer still behaves sensibly before any UI starts driving the value

#### Definition of done:
- fly movement uses an explicit base speed instead of only a hard-coded runtime constant
- the active viewer viewport exposes a narrow seam that later UI can call
- no visible slider is required yet

## [x] `Camera-6.3.3` - `Viewport HUD Fly Speed ParaSlider`

### Summary

#### Purpose:
- land the visible speed control only after the underlying speed state already exists

#### Shipped result:
- the existing viewport HUD/status box now renders a fly-speed `ParaSlider`
- the control is scoped through the overlay's viewport id, so the matching viewer instance owns the change
- the HUD slider drives the viewer's explicit base fly speed without affecting mouse look
- boost continues to multiply the slider-selected base speed

#### Scope:
- add one base fly-speed `ParaSlider` to the viewport HUD/status box
- bind that slider to the active viewer viewport's fly-speed seam
- keep the first slider focused on movement speed only

#### Likely files:
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/components/ParaSlider.tsx` only if one small presentation hook is needed
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/viewerBridge.ts` if the toolbar binding needs a small extension

#### Suggested implementation direction:
1. add one fly-speed row to the existing viewport HUD/status box under the current geometry/mode/selection readout
2. render that row with `ParaSlider`
3. wire the slider to the active viewer viewport's base speed seam
4. keep the control discoverable but narrow
5. verify multi-viewport usage still respects the overlay's viewport id
5. verify the slider changes movement speed without affecting mouse look

#### Definition of done:
- the viewport HUD/status box exposes one base fly-speed `ParaSlider`
- the slider changes the current viewport's fly speed
- boost continues to multiply the slider-selected base speed

## [x] `Camera-6.3.4` - `Fly Camera Roll Controls`

### Summary

#### Purpose:
- add the next narrow fly-feel upgrade after speed control by letting the user roll the camera like an aircraft during fly mode

#### Shipped result:
- `Viewer.ts` now tracks `roll-left` / `roll-right` fly keys and applies roll continuously even while the user is otherwise stationary
- `CameraController.ts` now exposes a dedicated fly-roll helper that rotates `camera.up` around the current forward axis
- `Q` / `E` stay routed through the existing `viewer-fly` keyboard owner while fly mode is active
- rolled orientation persists after fly-session exit, so re-entering fly mode resumes from the same rolled frame

#### Target result:
- `Q` rolls the fly camera left while held
- `E` rolls the fly camera right while held
- the rolled orientation persists after the user releases the roll key and after the current hold-to-fly session ends
- the camera can be rotated fully upside down
- fly translation continues to respect the camera's rolled local axes

#### Scope:
- add `Q` / `E` fly roll input while fly mode is active
- add camera-controller support for rolling around the current forward axis
- preserve the resulting rolled camera `up` orientation instead of forcing auto-upright recovery
- keep roll behavior limited to perspective fly mode
- keep the current speed slider and boost behavior unchanged

#### Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts`
- `src/viewer/Viewer.test.ts`
- `src/viewer/scene/CameraController.test.ts`
- `src/app/inputRouting.test.ts`

#### Suggested implementation direction:
1. extend the fly held-key model to include `roll-left` and `roll-right`
2. map `Q` and `E` to those new fly roll keys only while fly mode owns the keyboard
3. add a `CameraController` helper that rotates the camera around its current forward axis and preserves the resulting `camera.up`
4. apply roll per frame beside the existing fly movement update so the control feels continuous while held even when translation input is zero
5. verify that rolled orientation persists and that movement still follows the rolled local frame instead of snapping back to world-up assumptions

#### Locked implementation notes:
- `src/viewer/Viewer.ts`
  - extend `FlyMovementKey` with:
    - `roll-left`
    - `roll-right`
  - extend `resolveFlyMovementKey(...)` so:
    - `Q` maps to `roll-left`
    - `E` maps to `roll-right`
  - do not bolt roll onto the current translation-only early-return path
  - either split a separate `updateFlyRoll(...)` helper or refactor the fly per-frame step so roll still runs while the user is otherwise stationary
- `src/viewer/scene/CameraController.ts`
  - add a dedicated fly-roll helper instead of trying to fake roll through yaw/pitch deltas
  - compute the forward axis from:
    - `controls.target - camera.position`
  - rotate `camera.up` around that forward axis by the requested delta
  - keep the current target distance stable
  - then reapply `lookAt(...)` using the newly rolled `camera.up`
- `src/app/inputRouting.ts`
  - extend `isViewerFlyMovementKey(...)` so `Q` / `E` stay viewer-owned while fly mode is active
  - keep the existing rule that unrelated modified shortcuts are not broadly claimed just because fly mode is active

#### Locked behavior rules:
- roll is perspective-only, like the current fly look/move path
- roll is continuous while the user holds `Q` or `E`
- roll persists after the user releases `Q` / `E`
- roll persists after the user releases `RMB` and exits the current fly session
- there is no auto-leveling, horizon snap, or upright recovery in `6.3.4`
- the camera may become fully upside down
- `Space` and `Ctrl` continue to move along the camera's rolled local up/down axis, not world-up
- boost and the fly-speed slider continue to affect only translation speed, not roll rate

#### Suggested constants:
- start with a fixed roll rate constant in the runtime, similar in spirit to the fixed boost multiplier
- recommended initial value:
  - `Math.PI * 0.75` radians per second
  - about `135 deg/s`
- do not add a roll-rate slider in `6.3.4`

#### Seam read from current code:
- `Viewer.ts` currently returns early from `updateFlyMovement(...)` when there is no translation vector, so roll will not work correctly if it is bolted onto that method without restructuring
- `CameraController.applyFlyLookDelta(...)` already uses the active `camera.up`, which is good for post-roll yaw/pitch because the rolled orientation can remain the local frame of reference
- `CameraController.translateFly(...)` already uses `camera.up` and the derived right vector, so once roll changes `camera.up`, translation should naturally follow the rolled frame
- the shared routing seam in `inputRouting.ts` already has a dedicated `viewer-fly` owner, so `Q` / `E` should slot into that existing ownership path instead of inventing a new keyboard owner

#### Verification focus:
- `Q` rolls left and `E` rolls right during held-`RMB` fly mode
- roll still works while the user is otherwise stationary
- a rolled camera remains rolled after `Q` / `E` release
- a rolled camera remains rolled after `RMB` release and re-entry into fly mode
- the camera can pass through `180` degrees of roll and remain usable upside down
- after rolling about `90` degrees, `Space` and `Ctrl` move relative to the rolled camera frame rather than the old world vertical
- `Q` / `E` are routed to `viewer-fly` while fly mode is active, but `Ctrl+Q`, `Ctrl+E`, `Alt+Q`, and `Alt+E` are still not broadly claimed as fly shortcuts

#### Definition of done:
- `Q` and `E` roll the fly camera during held-`RMB` fly mode
- the camera can remain rolled or upside down after roll input stops
- fly movement still feels coherent in the rolled orientation
- existing fly teardown, console suppression, and viewport ownership behavior remain intact

## [x] `Camera-6.3.5` - `Fly Mode Scroll Wheel Speed Control`

### Summary

#### Purpose:
- let the user tune fly speed in-place during held-`RMB` fly mode without moving focus away from the viewport

#### Shipped result:
- `Viewer.ts` now overrides the normal wheel zoom seam during held-`RMB` fly mode and maps wheel direction to multiplicative base-speed changes
- the viewer bridge now exposes a narrow fly-speed change callback so internal viewer-owned speed changes can notify the overlay
- `ViewportOverlay.tsx` now listens for those fly-speed change notifications so the HUD `ParaSlider` stays visually aligned with wheel-driven speed changes

#### Target result:
- while fly mode is active, the scroll wheel no longer zooms the camera
- wheel up increases the current base fly speed
- wheel down decreases the current base fly speed
- when fly mode ends, wheel input immediately returns to normal viewer zoom
- the HUD `ParaSlider` and wheel adjustments stay in sync because they drive the same viewer-owned base fly-speed value

#### Scope:
- remap wheel behavior only while held-`RMB` fly mode is active
- update the existing viewer-owned base fly-speed value from wheel input
- restore normal wheel zoom on fly exit without changing non-fly behavior
- keep this first pass runtime-only without adding new visible UI

#### Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/viewerBridge.ts` if a tiny fly-speed change callback is needed
- `src/app/components/ViewportOverlay.tsx` if one small sync hook is needed

#### Suggested implementation direction:
1. intercept the existing viewer wheel path while `flySession !== null`
2. prevent the normal zoom path from running during fly mode
3. use wheel delta direction to increase or decrease the current base fly speed
4. clamp the result through the same viewer-owned fly-speed normalization path used by the HUD slider
5. verify wheel zoom resumes immediately after `RMB` release

#### Locked behavior rules:
- only held-`RMB` fly mode changes wheel meaning
- wheel up increases speed
- wheel down decreases speed
- the wheel changes the current base fly speed, not the boost multiplier
- the wheel does not affect roll rate or mouse-look sensitivity
- normal viewer zoom must return immediately when fly mode exits

#### Locked implementation notes:
- `src/viewer/Viewer.ts`
  - the current zoom seam already goes through:
    - `zoomCameraByWheelDelta(deltaY)`
  - `6.3.5` should branch there first:
    - if `flySession !== null`
      - adjust fly speed
      - do not call `cameraController.zoomByWheelDelta(...)`
    - else
      - keep the current zoom path unchanged
  - wheel-based speed changes should go through:
    - `setFlyMoveSpeed(...)`
    - so the same normalization/clamping rules apply as the HUD slider
- `src/app/viewerBridge.ts`
  - the viewer bridge already exposes:
    - `getFlyMoveSpeed`
    - `setFlyMoveSpeed`
  - but the current overlay only syncs fly speed on attach and on local slider writes
  - if wheel changes should visibly move the HUD slider immediately, add a tiny optional fly-speed change callback seam rather than inventing polling
- `src/app/components/ViewportOverlay.tsx`
  - only update this if the bridge needs one narrow subscription hook so wheel-driven fly-speed changes repaint the HUD slider in real time

#### Locked scaling direction:
- use multiplicative wheel scaling in the first pass
- recommended starting behavior:
  - wheel up multiplies the current base fly speed by about `1.1`
  - wheel down divides the current base fly speed by the same factor
- why:
  - multiplicative scaling behaves better across the now-wide speed range than a tiny fixed additive step
  - it makes the wheel useful at both slow inspection speeds and very fast traversal speeds

#### Seam read from current code:
- `Viewer.ts` already has one clear wheel seam in `zoomCameraByWheelDelta(deltaY)`, so `6.3.5` can stay narrow and avoid spreading fly-wheel logic across unrelated camera code
- `Viewer.ts` already owns base fly-speed state through `getFlyMoveSpeed()` / `setFlyMoveSpeed(...)`, so wheel changes should reuse that same value instead of introducing a second temporary fly-speed channel
- `ViewportOverlay.tsx` currently reads fly speed on initial viewer attach and after local slider writes, but not after internal viewer-owned speed changes, so the HUD may stay stale unless `6.3.5` adds a small fly-speed change notification path

#### Verification focus:
- during held-`RMB` fly mode, wheel input no longer calls the normal zoom path
- during held-`RMB` fly mode, wheel up increases base fly speed and wheel down decreases it
- wheel speed changes respect the existing fly-speed clamping/normalization rules
- after fly exit, the very next wheel event returns to normal zoom behavior
- if the HUD slider is visible, its value stays visually aligned with wheel-driven speed changes
- roll, boost, and normal fly translation continue to use the updated base speed without regressions

#### Definition of done:
- fly mode wheel input adjusts base fly speed instead of zoom
- wheel up/down direction matches the locked behavior above
- HUD slider state stays aligned with the wheel-adjusted speed
- normal wheel zoom still behaves exactly as before outside fly mode

## [ ] `Camera-6.3.6` - `Free-Flight Pitch And Loop Support`

### Summary

#### Purpose:
- remove the remaining FPS-style fly-look clamp so the camera can pitch through vertical and complete full aircraft-style loops

#### Target result:
- looking up while flying can continue smoothly past vertical instead of stopping near straight up
- the camera can pitch all the way through a loop and end up upside down or upright again
- roll and translation continue to work in the same free-flight orientation frame
- the implementation stays on the existing `PerspectiveCamera`

#### Scope:
- replace the current clamped fly-pitch behavior with free-flight pitch behavior
- keep fly mode perspective-only
- preserve the existing roll, translation, boost, and wheel-speed control features
- do not add new UI in this phase

#### Likely files:
- `src/viewer/scene/CameraController.ts`
- `src/viewer/scene/CameraController.test.ts`
- `src/viewer/Viewer.test.ts` if one integration guard is needed
- `src/viewer/Viewer.ts` only if one fly-mode integration guard is useful

#### Suggested implementation direction:
1. remove the current pitch guard that rejects motion when `forward` gets too close to `up`
2. stop treating pitch as a forward-only update
3. rotate both the camera forward vector and the camera up vector around the current right axis during pitch
4. rebuild an orthonormal local basis after yaw/pitch updates so free-flight orientation stays stable
5. keep target distance stable and continue using the resulting basis for later roll and translation

#### Locked behavior rules:
- keep `PerspectiveCamera` for fly mode
- allow pitch to pass through vertical in both directions
- do not auto-level or snap upright
- preserve the camera's current rolled orientation while pitching
- `W/A/S/D`, `Space/Ctrl`, `Q/E`, and wheel-based speed control should all continue to operate in the same local flight frame after the change

#### Locked implementation notes:
- `src/viewer/scene/CameraController.ts`
  - keep the current fly-look seam in:
    - `applyFlyLookDelta(deltaX, deltaY)`
  - after yaw:
    - recompute `right` from the yawed `forward` and current `up`
  - for pitch:
    - rotate both `forward` and `up` by the same pitch quaternion around the current `right` axis
    - do not leave `up` fixed during pitch
  - after yaw + pitch:
    - rebuild an orthonormal basis
    - recommended order:
      - recompute `right`
      - recompute `up`
      - normalize all three vectors
  - then:
    - copy the rebuilt `up` into `activeCamera.up`
    - rebuild `controls.target` from `position + forward * targetDistance`
    - call `lookAt(...)`
- do not switch to a different camera class
- do not introduce a brand-new persistent orientation state in `6.3.6` unless the simpler basis-based refactor proves insufficient

#### Locked anti-goals:
- do not keep the old:
  - `abs(forward.dot(up)) > 0.995`
  - pitch rejection path
- do not add an artificial pitch limit
- do not auto-correct the camera back toward world up
- do not break the already-shipped roll model by reintroducing a hidden world-up assumption during pitch

#### Seam read from current code:
- the current blocker lives in `CameraController.applyFlyLookDelta(...)`
- today the method rejects pitch when:
  - `abs(forward.dot(up)) > 0.995`
- that clamp is what prevents loop-the-loops
- today pitch also rotates only `forward` and leaves `up` unchanged, which is why the controller still behaves like a clamped FPS look model instead of a full aircraft-style free-flight basis update
- the current implementation already uses `PerspectiveCamera`, which is fine
- the needed change is orientation math, not camera type

#### Verification focus:
- repeated upward mouse look can carry the camera through straight up and over the top
- repeated downward mouse look can carry the camera through straight down and under the bottom
- after pitching through vertical, the camera remains controllable and does not snap its `up` vector back
- the camera can complete a loop while rolled, not only while upright
- after a loop, `translateFly(...)` still follows the new local `forward/right/up` basis coherently
- `applyFlyRollDelta(...)` still behaves correctly after the free-flight pitch change
- the current fly-session runtime in `Viewer.ts` does not need a new ownership model to support the new pitch math

#### Definition of done:
- fly look can pitch through vertical without hitting the old clamp
- the camera can complete a full loop while flying
- rolled orientation, translation, boost, and wheel-speed control still behave coherently after the change
- no camera-type swap is required

### Verification Matrix

Must verify by the end of `Camera-6.3.*`:
- held `Shift` increases fly movement speed while fly mode is active
- releasing `Shift` returns movement to the current base speed immediately
- held `Ctrl` moves the camera downward while fly mode is active
- `Space` and `Ctrl` behave as the vertical pair after the remap
- the speed slider updates the active viewer viewport's fly speed
- while fly mode is active, wheel up increases fly speed and wheel down decreases it
- when fly mode exits, the wheel returns immediately to normal zoom behavior
- held `Q` and `E` roll the fly camera left and right while fly mode is active
- the fly camera can remain upside down after roll input without auto-leveling
- fly look can pass smoothly through straight up and straight down without freezing or snapping back
- the camera can complete a loop and still move coherently afterward
- console capture still stands down while fly mode owns the keyboard
- viewer shortcuts do not fire while fly mode is active
- `RMB` release still exits fly mode and suppresses the same-interaction context menu cleanly

Likely focused tests across the ladder:
- `src/viewer/Viewer.test.ts`
- `src/viewer/scene/CameraController.test.ts`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/inputRouting.test.ts`

### Definition Of Done

- the `Camera-6.3.*` ladder lets Codex land fly polish in small, reviewable slices
- `Camera-6.3.1` owns remap plus fixed boost
- `Camera-6.3.2` owns base-speed state and viewer plumbing
- `Camera-6.3.3` owns the visible viewport-HUD `ParaSlider`
- `Camera-6.3.4` owns plane-style roll controls and persistent rolled orientation
- `Camera-6.3.5` owns temporary fly-mode wheel remapping from zoom to speed control
- `Camera-6.3.6` owns free-flight pitch through vertical and loop support
- deeper fly polish still stays intentionally deferred

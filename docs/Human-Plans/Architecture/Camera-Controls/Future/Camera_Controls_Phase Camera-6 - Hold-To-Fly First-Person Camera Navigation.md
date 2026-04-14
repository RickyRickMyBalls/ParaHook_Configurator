# `Camera-6` - `Hold-To-Fly First-Person Camera Navigation`

## Doc Header

### Doc History
13. 2026-04-14: Added planned `Camera-6.3.6 - Free-Flight Pitch And Loop Support`, so the fly-camera polish ladder now captures removing the current pitch clamp and allowing full loop-the-loops in the existing perspective fly camera without a camera-type swap
12. 2026-04-14: Implemented `Camera-6.3.5 - Fly Mode Scroll Wheel Speed Control`, so held-`RMB` fly mode now temporarily steals the wheel from zoom to adjust fly speed in-place, and normal wheel zoom returns immediately once fly mode ends
11. 2026-04-14: Added planned `Camera-6.3.5 - Fly Mode Scroll Wheel Speed Control`, so the fly-camera polish ladder now captures temporary wheel remapping during held-`RMB` fly mode where wheel input adjusts fly speed instead of zoom and normal zoom returns on fly exit
10. 2026-04-14: Implemented `Camera-6.3.4 - Fly Camera Roll Controls`, so the fly-camera polish ladder now also supports held `Q` / `E` roll, persistent rolled orientation, and upside-down flight in addition to the earlier boost and speed-slider work
9. 2026-04-14: Updated the planned `Camera-6.3.3` fly-speed control surface so the later slider lands in the existing viewport HUD/status box via `ParaSlider` instead of in the separate `View` toolbar panel
8. 2026-04-14: Recast `Camera-6.3 - Fly Camera Polish Backlog` into a small `Camera-6.3.*` ladder so the first post-`6.2` polish work can land as separate Codex-sized slices for remap/boost runtime, fly-speed state plumbing, and toolbar slider UI
7. 2026-04-14: Added the standalone future phase doc for `Camera-6.3 - Fly Camera Polish Backlog`, so the first post-`6.2` fly polish pass now has its own implementation-ready planning surface focused on `speed boost`, a `speed control slider`, and the `Ctrl`/`Shift` remap direction
6. 2026-04-14: Cleaned up `Camera-6.2 - Hold-To-Fly Runtime And Input Ownership` after implementation and advanced the umbrella family read so the first runtime cut now reads as shipped instead of as a stale implementation-plan draft
5. 2026-04-14: Added a first fly-camera polish backlog after the shipped runtime cut, prioritizing `speed boost` and a `speed control slider` first, and recorded the recommended input remap of `Ctrl` = descend so `Shift` can become boost cleanly
4. 2026-04-06 21:02: Added the standalone future phase doc for `Camera-6.2 - Hold-To-Fly Runtime And Input Ownership`, so the next fly-navigation runtime cut now has its own implementation-ready planning surface instead of living only inside the umbrella family doc
3. 2026-04-06 20:52: Marked `Camera-6.1 - Fly Navigation Research And Seam Audit` complete after locking the live viewer pointer seam, the shared keyboard-routing seam, the console capture dependency on `routeKeyboardInput(...)`, the camera-controller helper seam, and the viewport-local `contextmenu` suppression direction, so `Camera-6.2 - Hold-To-Fly Runtime And Input Ownership` is now the next honest runtime follow-on
2. 2026-04-06 20:33: Recast `Camera-6` from a single implementation-ready phase into the umbrella fly-navigation family phase, added the `[Camera-6.1]` seam-audit follow-on as the first concrete cut, and kept the later held-`RMB` implementation work under this umbrella so the actual runtime change can start from a stronger current-code read
1. 2026-04-06 20:20: Created this standalone future phase doc for `[Camera-6]`, translating the next camera-controls follow-on into an implementation-ready plan for temporary RMB-held fly navigation in the model viewport with first-person mouse look, WASD plus vertical movement, console typing suppression, and viewport-local context-menu blocking on release

### Purpose

This doc defines the `[Camera-6]` umbrella fly-navigation follow-on under the camera-controls family.

Use it to answer:
- why fly navigation deserves its own family slice
- how the fly-navigation work should be broken into safer subphases
- what the first seam-audit phase should answer before runtime implementation starts
- what the later hold-to-fly implementation phase still needs to deliver
- which fly-camera polish items should land after the first runtime pass

### Why This Phase Exists

The shipped camera-controls work already established a better authoring-friendly viewport baseline:
- `LMB` is no longer casually camera-owned during sketch work
- the model viewport has a clearer `wheel` / `MMB` / `Ctrl + MMB` camera map
- the canvas and model viewport now have a more explicit coexistence rule

The next useful navigation follow-on is fast inspection movement:
- hold `RMB`
- look around freely
- move with `W` / `A` / `S` / `D`
- move vertically with `Space` / `Shift`
- release `RMB` and immediately return to normal viewport behavior

This deserves its own phase because it touches multiple ownership seams at once:
- viewport pointer ownership
- viewer keyboard ownership
- console typing suppression
- temporary camera motion integration
- browser context-menu suppression on the viewport

It should not be left as an ad hoc hotkey because that would weaken the ownership model the camera-controls family has been trying to make more explicit.

### Scope

This phase covers:
- temporary hold-to-fly navigation in the model viewport
- first-person mouse look while fly mode is active
- `W` / `A` / `S` / `D` translation during fly mode
- `Space` / `Shift` vertical movement during fly mode
- viewport-local keyboard ownership while fly mode is active
- viewport-local browser context-menu suppression for the same `RMB` interaction

This phase does not cover:
- a sticky toggle-based fly mode
- customizable keybinding UI
- graph-canvas fly navigation
- pointer lock as a required first pass
- final camera speed tuning UI
- saved fly-camera presets or cinematic camera paths

## Doc Body

### Summary

`Camera-6` is the new fly-navigation family under camera controls.

Current read:
- the current code hints strongly at the likely seams, but the family should still lock those seams in a dedicated audit phase before implementation begins
- the first seam-audit pass should confirm:
  - where `RMB` can begin a temporary fly session without colliding with existing viewport owners
  - where keyboard ownership should flip from console/app typing to viewer-owned fly movement
  - where camera-controller helpers should own look and translation updates
  - where viewport-local `contextmenu` suppression should attach so releasing `RMB` does not open the browser menu
- the later runtime cut should still stay narrow:
  - `RMB`-held fly-mode start and stop
  - mouse look while flying
  - `W` / `A` / `S` / `D` plus `Space` / `Shift` movement
  - console typing suppression while flying
  - viewport-local `contextmenu` suppression on fly release

Locked recommendation:
- treat `Camera-6` as the umbrella fly-navigation phase
- split the work into at least:
  - `Camera-6.1`
    - seam audit and implementation read
  - `Camera-6.2`
    - first hold-to-fly runtime pass
- keep the first polish follow-on focused on:
  - `speed boost`
  - `speed control slider`
- keep pointer lock, tuning UI, and rebinds out of the first implementation cut

### Phase Breakdown

1. `Camera-6.1 - Fly Navigation Research And Seam Audit`
Reason:
- the safest first cut is to lock the current pointer, keyboard, camera-controller, and `contextmenu` seams before changing runtime behavior

2. `Camera-6.2 - Hold-To-Fly Runtime And Input Ownership`
Reason:
- once the seam read is concrete, the actual `RMB`-held fly mode can land as one narrow runtime slice without reopening discovery

3. `Camera-6.3 - Fly Camera Polish Backlog`
Reason:
- once the first hold-to-fly runtime cut is stable, the next honest slice is fly-camera feel and convenience polish rather than reopening the core ownership seams immediately
- `Camera-6.3` should then split internally into:
  - `Camera-6.3.1`
    - boost and descend remap
  - `Camera-6.3.2`
    - base-speed state and viewer seam
  - `Camera-6.3.3`
    - toolbar speed slider
  - `Camera-6.3.4`
    - plane-style roll controls with persistent rolled orientation
  - `Camera-6.3.5`
    - temporary wheel remap from zoom to fly-speed adjustment during fly mode
  - `Camera-6.3.6`
    - free-flight pitch through vertical and loop support

### Fly Camera Polish Backlog

Priority-first items:
- `speed boost`
- `speed control slider`

Codex-sized order:
- `Camera-6.3.1`
  - remap `Ctrl` = descend
  - remap `Shift` = boost
  - fixed boost multiplier only
- `Camera-6.3.2`
  - add explicit base fly-speed state and viewer-facing seam
- `Camera-6.3.3`
  - add the viewport HUD/status-box `ParaSlider` that drives that base speed
- `Camera-6.3.4`
  - add held `Q` / `E` roll so the camera can bank and remain upside down like an aircraft
- `Camera-6.3.5`
  - remap wheel to increase/decrease fly speed only while held-`RMB` fly mode is active, then restore normal zoom on exit
- `Camera-6.3.6`
  - remove the current fly-look pitch clamp so the camera can loop over the top like an aircraft

Suggested near-follow-ons:
- mouse-look sensitivity slider
- pointer lock as an optional upgrade
- persist fly settings between sessions
- reset-to-default fly settings action
- optional fly HUD or status hint while active

Suggested control direction for the first polish pass:
- keep:
  - `W` / `A` / `S` / `D`
    - planar movement
  - `Space`
    - ascend
- remap:
  - `Ctrl`
    - descend
  - `Shift`
    - speed boost

Recommendation:
- use `Ctrl` for descend so `Shift` can cleanly become boost without overloading one key with two opposite meanings
- treat the slider as the base fly speed
- treat boost as a multiplier on top of that base speed

### Questions / Decisions

#### [x] - `q1` Does `Camera-6` deserve subphases?

##### Suggestion
- yes
- this work crosses pointer, keyboard, camera-motion, and console seams
- a dedicated seam-audit pass lowers the risk of widening the implementation slice blindly

#### [x] - `q2` What should `[Camera-6.1]` own first?

##### Suggestion
- a concrete research and seam-audit read
- current pointer ownership path
- current keyboard ownership path
- current camera-controller motion seam
- viewport `contextmenu` behavior and suppression seam
- the first implementation-ready follow-on recommendation

#### [x] - `q3` What should the later implementation phase still target after `[Camera-6.1]`?

##### Suggestion
- keep the later runtime phase narrow:
  - hold `RMB` to fly
  - first-person mouse look
  - `W` / `A` / `S` / `D` plus `Space` / `Shift`
  - console typing suppression while flying
  - viewport-local browser-menu suppression
  - immediate exit on `RMB` release

## [x] `Camera-6.1` - `Fly Navigation Research And Seam Audit`

### Summary

#### Purpose:
- lock the current-code seam read before fly-navigation runtime work begins

#### Shipped result:
- the seam audit locked the live implementation direction:
  - `Viewer.ts` owns fly-session start/stop
  - `CameraController.ts` owns fly-look and fly-translate helpers
  - `inputRouting.ts` is the honest cross-surface seam for blocking console typing
  - viewport-local `contextmenu` suppression belongs on the viewer DOM element

#### Current read:
- the strongest likely owner seams are:
  - `src/viewer/Viewer.ts`
    - pointer-down / move / up ownership
    - viewport-local DOM event handling
    - keyboard event ownership
  - `src/viewer/scene/CameraController.ts`
    - camera pose and movement helpers
  - `src/app/inputRouting.ts`
    - broader keyboard ownership direction
  - console ownership/input files
    - whichever path currently decides whether typed keys become viewer actions or console text
- the first gap is not feature intent anymore
- the first gap is one concrete answer for where the fly-mode ownership flips should live

### Questions / Decisions

#### [x] Question 1 - Which seam should own `RMB` fly-mode start and release?

##### Must lock
- the viewer-side pointer seam
- the gate that denies fly mode when:
  - sketch interaction is active
  - gizmo/widget hits own the pointer
  - console camera drags or marquee selection already own the stream

#### [x] Question 2 - Which seam should own fly-mode movement keys and block console typing?

##### Must lock
- whether the existing viewer `keydown` path is enough
- whether one new `keyup`/held-key seam is needed
- how the broader input-routing model should recognize fly mode as the active keyboard owner

#### [x] Question 3 - Which camera helper surface should own look and translation?

##### Must lock
- whether narrow helper methods in `CameraController` are enough
- or whether one richer fly-session helper is worth it

#### [x] Question 4 - Which viewport seam should suppress the browser context menu?

##### Must lock
- viewport-local `contextmenu` listener behavior
- whether the same `RMB` interaction also needs a small release guard

### Research Spec

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts`
- the relevant console input/ownership files
- tests near:
  - `src/viewer/scene/CameraController.test.ts`
  - `src/app/components/ViewerHost.test.tsx`

Locked first-cut direction:
1. audit the current pointer ownership flow in the viewer
2. identify the exact gate for allowing or denying `RMB`-held fly-mode start
3. audit the current keyboard ownership and console text-input path
4. identify how held movement keys should be tracked while fly mode is active
5. audit the camera-controller API surface for look and translation helpers
6. audit the viewport DOM path for `contextmenu` suppression
7. record one narrow implementation-ready recommendation for `Camera-6.2`

Definition of done:
- `Camera-6.1` records one concrete seam read
- the later runtime phase no longer needs to reopen discovery

## [x] `Camera-6.2` - `Hold-To-Fly Runtime And Input Ownership`

### Summary

#### Purpose:
- land the first temporary held-`RMB` fly-navigation runtime behavior from the locked seam read in `Camera-6.1`

#### Shipped result:
- the first hold-to-fly runtime pass is now in place:
  - hold `RMB` to fly
  - mouse look while flying
  - `W` / `A` / `S` / `D` plus `Space` / `Shift`
  - console typing suppression while flying
  - viewport-local browser-menu suppression
  - explicit exit on `RMB` release, `pointercancel`, and blur
- pointer lock, tuning UI, boost/remap polish, and custom rebinds still belong later

### Questions / Decisions

#### [x] Question 1 - What was the first honest runtime scope?

##### Locked answer
- hold-based only:
  - `RMB down` enters
  - `RMB up` exits
- no sticky toggle in the first pass

#### [x] Question 2 - What movement keys shipped in the first pass?

##### Must lock
- `W` = forward
- `S` = backward
- `A` = strafe left
- `D` = strafe right
- `Space` = up
- `Shift` = down

#### [x] Question 3 - What did the first pass preserve?

##### Must lock
- outside fly mode, keep the shipped model-viewport baseline unchanged:
  - `Wheel` zoom
  - `MMB` pan
  - `Ctrl + MMB` orbit
- do not let fly mode start from gizmo handles or direct widget surfaces
- do not globally disable the browser context menu across the whole app

Required behavior-preservation rules:
- do not bypass the seam read locked in `Camera-6.1`
- do not widen into pointer lock, tuning UI, or custom keybinding work
- do not weaken the existing authoring-first ownership rules

### Implementation Spec

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts` if one narrow ownership clarification is needed
- tests near:
  - `src/viewer/scene/CameraController.test.ts`
  - `src/app/components/ViewerHost.test.tsx`

Shipped first-cut direction:
1. add one viewer-local fly-mode session state tied to held `RMB`
2. gate fly-mode start through the ownership rules locked in `Camera-6.1`
3. add narrow camera-controller helpers for look and translation
4. route `W` / `A` / `S` / `D` / `Space` / `Shift` into fly movement while active
5. suppress console typing while the viewer owns fly-mode keyboard input
6. suppress viewport-local `contextmenu` for the same interaction
7. stop movement and exit immediately on `RMB` release, `pointercancel`, or blur

Definition of done:
- the active viewer viewport supports temporary hold-to-fly navigation
- fly mode owns mouse look and movement keys only while `RMB` is held
- console typing does not compete with fly-mode movement input
- releasing fly mode does not open the browser context menu on the viewport

## `Camera-6` Family Done Means

- the fly-navigation work is split into foldable, explicit subphases
- `Camera-6.1` owns the seam audit
- `Camera-6.2` owns the first runtime pass
- later follow-ons can add pointer lock, tuning, or rebinds without muddying the first implementation slice

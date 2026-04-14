# `Camera-6.3` - `Fly Camera Polish Backlog`

## Doc Header

### Doc History
1. 2026-04-14: Created this standalone future phase doc for `[Camera-6.3]`, translating the first post-`6.2` fly-camera polish slice into an implementation-ready plan focused on `speed boost`, a `speed control slider`, and the key remap needed to free `Shift` for boost cleanly

### Purpose

This doc defines the next fly-camera polish follow-on under the camera-controls family.

Use it to answer:
- what the first fly-camera polish cut should target after the shipped `Camera-6.2` runtime baseline
- how `speed boost` and a `speed control slider` should fit the current hold-to-fly model
- why descend should move from `Shift` to `Ctrl`
- which seams should own the runtime and UI parts of the polish work
- what deeper fly-camera tuning should still stay out of scope for now

### Why This Phase Exists

`Camera-6.2` shipped the core ownership/runtime slice:
- held `RMB` fly-session entry and exit
- mouse look
- `W` / `A` / `S` / `D` movement
- `Space` / `Shift` vertical movement
- console typing suppression through `viewer-fly`
- viewport-local `contextmenu` suppression

That runtime baseline is useful, but it is still missing the first feel and convenience layer:
- there is no quick temporary boost for longer moves
- there is no visible speed control for slower inspection or faster traversal
- `Shift` is currently occupied by descend, which blocks the cleanest first-person boost mapping

This follow-on exists to improve fly-camera usability without reopening the deeper ownership work that `Camera-6.1` and `Camera-6.2` already locked down.

### Scope

This phase covers:
- fly `speed boost` while fly mode is active
- a `speed control slider` for base fly speed
- remapping fly descend from `Shift` to `Ctrl`
- treating boost as a multiplier on top of the slider-controlled base speed
- verifying the updated key map still exits cleanly and does not regress console or viewer shortcut behavior
- surfacing the speed control on the active viewer viewport's toolbar path

This phase does not cover:
- pointer lock
- sticky toggle-based fly mode
- orthographic fly behavior
- mouse-look sensitivity UI
- invert-look options
- custom keybinding UI
- saved fly settings across app restarts
- a second boost-tuning control

## Doc Body

## [ ] `Camera-6.3` - `Fly Camera Polish Backlog`

### Summary

#### Purpose:
- add the first feel and convenience polish on top of the shipped hold-to-fly runtime

#### Target result:
- the active viewer viewport keeps the shipped held-`RMB` fly baseline
- `Shift` becomes a temporary fly `speed boost`
- `Ctrl` becomes fly descend
- the user gets one visible `speed control slider` for base fly speed
- boost multiplies the current slider-selected base speed instead of introducing a second separate speed mode

#### Current code-backed read:
- `src/viewer/Viewer.ts` already owns:
  - fly-session state
  - held movement-key state
  - the per-frame movement update loop
  - fly start/stop and teardown behavior
- `src/viewer/scene/CameraController.ts` already owns the fly motion math
- `src/app/components/ViewToolbar.tsx` is the most natural current UI seam for viewport-local camera controls
- the current shared routing seam in `src/app/inputRouting.ts` should not need another ownership shape change for this polish cut

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
    - speed boost

##### Why
- `Shift` is the most natural first temporary boost key
- moving descend to `Ctrl` keeps the vertical pair easy to remember:
  - `Space`
    - up
  - `Ctrl`
    - down
- this keeps the runtime model simple instead of overloading one key with two different meanings

#### [ ] Question 2 - How should boost work in the first polish pass?

##### Suggested answer
- use a fixed boost multiplier on top of the current base speed
- keep that multiplier implementation-owned for now instead of adding a second visible tuning control in `6.3`

##### Why
- the user already asked to prioritize only:
  - `speed boost`
  - `speed control slider`
- one slider plus one held boost key is the smallest honest polish cut
- a second boost control would widen the UI and tuning surface immediately

#### [ ] Question 3 - What should the speed slider control?

##### Suggested answer
- the slider should control the base fly movement speed only
- boost should multiply that base speed while `Shift` is held

##### Why
- this makes the relationship easy to understand:
  - slider
    - normal speed
  - `Shift`
    - temporarily faster than whatever the slider currently sets
- the user can slow the camera for inspection work without losing access to a quick long-distance move

#### [ ] Question 4 - Where should the first speed UI live?

##### Suggested answer
- surface the slider in `src/app/components/ViewToolbar.tsx`
- keep it tied to the active viewer viewport toolbar path rather than inventing a new fly-only panel

##### Why
- the toolbar already reads as the viewport's explicit camera-control surface
- this keeps the first speed UI discoverable without introducing a new overlay or settings dialog
- it preserves the current multi-viewport architecture where each viewport already owns its own toolbar surface

#### [ ] Question 5 - Should the first speed setting persist across restarts?

##### Suggested answer
- no, not in `6.3`
- keep the first slider state runtime-local or workspace-local only

##### Why
- persistence is useful, but it widens the change into settings ownership and saved defaults
- the narrowest honest first polish cut is:
  - remap keys
  - add boost
  - add a visible base-speed control
- saved fly settings can stay in a later follow-on if the feature proves worth keeping sticky

### Implementation Spec

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewToolbar.test.tsx`
- `src/viewer/Viewer.test.ts`
- `src/app/theme/surfaces/viewport-overlay.css`

Suggested first-cut direction:
1. add one explicit fly-speed state/value that `Viewer.ts` uses when translating held movement input
2. remap descend from `Shift` to `Ctrl` in the viewer's fly key handling
3. add temporary boost handling on `Shift` while fly mode is active
4. apply boost as a multiplier on top of the current base fly speed during the movement update loop
5. expose the base fly speed through one slider in `ViewToolbar.tsx`
6. keep the slider scoped to the viewer viewport that owns the toolbar surface
7. verify the updated fly key map does not leak into console capture or existing viewer shortcuts outside active fly mode
8. verify fly exit still tears down cleanly on:
   - `RMB` release
   - `pointercancel`
   - `blur`

Behavior rules to preserve:
- outside fly mode, existing camera gestures stay unchanged
- `Shift` boost should only matter while fly mode is active
- the `Ctrl` descend remap should not weaken the existing fly exit path
- the first slider should change movement feel only, not mouse-look sensitivity

### Verification

Must verify:
- held `Shift` increases fly movement speed while fly mode is active
- releasing `Shift` returns movement to the slider-selected base speed immediately
- held `Ctrl` moves the camera downward while fly mode is active
- `Space` and `Ctrl` still behave as the vertical pair after the remap
- the speed slider updates the active viewer viewport's fly speed
- console capture still stands down while fly mode owns the keyboard
- viewer shortcuts do not fire while fly mode is active
- `RMB` release still exits fly mode and suppresses the same-interaction context menu cleanly

Likely focused tests:
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/inputRouting.test.ts`

### Definition Of Done

- fly mode supports temporary `Shift` boost
- fly descend is remapped to `Ctrl`
- the viewport toolbar exposes a base fly-speed slider
- boost multiplies the current base fly speed instead of bypassing it
- the shipped `Camera-6.2` ownership and teardown behavior remains intact
- deeper fly polish still stays intentionally deferred

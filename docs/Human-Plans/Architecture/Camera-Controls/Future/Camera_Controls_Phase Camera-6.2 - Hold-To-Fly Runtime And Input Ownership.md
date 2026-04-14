# `Camera-6.2` - `Hold-To-Fly Runtime And Input Ownership`

## Doc Header

### Doc History
2. 2026-04-14: Cleaned up `Camera-6.2` after the runtime shipped, replacing the older implementation-plan draft with a shipped record grounded in the active-viewer-viewport architecture, the shared `viewer-fly` keyboard owner, the added fly-session teardown seams, and the current verification surface
1. 2026-04-06 21:02: Created this standalone future phase doc for `[Camera-6.2]`, translating the next fly-navigation cut into an implementation-ready runtime plan grounded in the finished `Camera-6.1` seam audit, with held-`RMB` fly-session ownership in the viewer, camera-controller look/translation helpers, shared keyboard-routing ownership for console suppression, and viewport-local `contextmenu` blocking

### Purpose

This doc records the shipped `Camera-6.2` runtime cut under the fly-navigation family.

Use it to answer:
- what the first hold-to-fly runtime pass now ships
- which seams own the current implementation
- what behavior was intentionally kept out of the first cut
- what follow-on polish should build on top of this runtime baseline

### Scope

This phase shipped:
- held-`RMB` fly-session start and end
- first-person mouse look during fly mode
- `W` / `A` / `S` / `D` planar translation during fly mode
- `Space` / `Shift` vertical translation during fly mode
- shared keyboard-routing ownership for fly mode through `viewer-fly`
- console global-capture deferral while fly mode is active
- viewport-local `contextmenu` suppression for the same interaction
- explicit fly-session teardown on:
  - `RMB` release
  - `pointercancel`
  - window blur

This phase still does not cover:
- pointer lock
- orthographic fly behavior
- sticky toggle-based fly mode
- fly-speed UI
- custom keybinding UI
- graph-canvas fly behavior
- the later polish remap of `Ctrl` = descend and `Shift` = boost

## Doc Body

## [x] `Camera-6.2` - `Hold-To-Fly Runtime And Input Ownership`

### Summary

#### Purpose:
- land the first temporary held-`RMB` fly-navigation runtime behavior from the locked seam read in `Camera-6.1`

#### Shipped result:
- the active viewer viewport now supports a temporary held-`RMB` fly session
- `Viewer.ts` owns:
  - fly-session start and stop
  - held-key state
  - pointer capture and release
  - `keyup`, `blur`, and `pointercancel` teardown
  - viewport-local `contextmenu` suppression
- `CameraController.ts` owns:
  - fly-look delta application
  - fly translation helpers
- `inputRouting.ts` now exposes one explicit `viewer-fly` keyboard owner
- `useConsoleInteraction.ts` now defers console capture while fly mode owns the keyboard

#### Current code-backed read:
- `src/viewer/Viewer.ts` now owns the fly runtime directly:
  - held `RMB` starts a fly session when no higher-priority viewer owner already claims the interaction
  - pointer movement during that session drives camera look
  - held movement keys drive continuous translation through the render/update loop
  - `RMB` release, `pointercancel`, and window blur all exit the fly session cleanly
- `src/viewer/scene/CameraController.ts` now owns the narrow fly camera math:
  - apply fly look deltas
  - translate along forward, right, and up axes
  - keep that math out of `Viewer.ts`
- `src/app/inputRouting.ts` now resolves `viewer-fly` before console capture for unmodified keys
- `src/app/console/useConsoleInteraction.ts` now stands down while the active viewer is flying:
  - printable key auto-capture does not compete
  - staged submit via `Space` does not compete
  - early console shortcuts like `/` also defer
- the current first cut is still intentionally narrow:
  - perspective-only
  - hold-based only
  - no speed UI
  - no pointer lock
  - no remapped descend/boost keys yet

### Questions / Decisions

#### [x] Question 1 - What was the first honest runtime scope?

##### Locked answer
- hold-based only:
  - `RMB down`
    - enter fly mode
  - `RMB up`
    - exit fly mode
- no sticky toggle
- no pointer lock
- no orthographic promise

##### Why
- this was the narrowest honest runtime slice from the seam audit
- it kept the mode temporary and easy to escape
- it avoided widening into input-mode UI or camera-setting work

#### [x] Question 2 - What movement keys shipped in the first pass?

##### Locked answer
- `W`
  - forward
- `S`
  - backward
- `A`
  - strafe left
- `D`
  - strafe right
- `Space`
  - up
- `Shift`
  - down

##### Why
- this matched the original first-person direction for the first runtime cut
- the later boost/remap polish can build on this shipped baseline instead of widening the first pass retroactively

#### [x] Question 3 - How does fly mode block console typing now?

##### Locked answer
- `routeKeyboardInput(...)` now exposes `viewer-fly`
- the viewer reports whether fly mode is active through that shared routing seam
- console global capture defers whenever the active viewer resolves to `viewer-fly`

##### Why
- the console still sees keys before the viewer does
- surface truth alone is still not enough to block console typing
- the shared input-routing seam remains the honest ownership boundary

#### [x] Question 4 - What did the first pass preserve?

##### Locked answer
- outside active fly mode, the shipped model-viewport baseline stays unchanged:
  - `Wheel`
    - zoom
  - `MMB`
    - pan
  - `Ctrl + MMB`
    - orbit
- fly mode still does not start from:
  - active sketch interaction
  - active gizmo/widget ownership
  - active console camera drag
  - active workspace marquee drag
- browser context-menu suppression stayed viewport-local

##### Why
- this preserved the existing authoring-first input model and kept the new feature additive instead of disruptive

### Implementation Record

Primary files:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts`
- `src/app/console/useConsoleInteraction.ts`

Implementation direction that shipped:
1. add one viewer-local fly session in `Viewer.ts`
2. start that session from the existing pointer seam on held `RMB`
3. gate start so existing higher-priority viewer owners still win first
4. add pointer capture for the fly session and release it on exit
5. add narrow camera-controller helpers for:
   - fly-look deltas
   - translation along forward/right/up
6. drive continuous movement through the viewer render/update loop
7. extend `routeKeyboardInput(...)` with `viewer-fly`
8. make console global capture defer while the routing owner is `viewer-fly`
9. short-circuit the viewer's conflicting shortcut path while fly mode is active
10. add explicit fly teardown on:
   - `RMB` release
   - `pointercancel`
   - `blur`
11. suppress the viewport-local `contextmenu` for the same interaction

### Verification

Verified behavior:
- `RMB down` enters fly mode only when no higher-priority viewer owner already has the interaction
- moving the pointer during fly mode changes camera look
- held `W` / `A` / `S` / `D` moves the camera in the expected planar directions
- held `Space` / `Shift` moves the camera vertically
- console input does not capture printable movement keys while fly mode is active
- `Space` does not submit console staged input while fly mode is active
- viewer transform/gizmo shortcuts do not fire while fly mode is active
- `RMB` release exits fly mode and stops movement immediately
- right-click release from fly mode does not open the viewport browser menu
- outside fly mode, existing model-viewport camera gestures still behave exactly as before

Focused tests:
- `src/app/inputRouting.test.ts`
- `src/viewer/scene/CameraController.test.ts`
- `src/viewer/Viewer.test.ts`

### Definition Of Done

- held `RMB` starts a temporary fly session in the active viewer viewport
- fly mode owns mouse look and movement keys only while active
- console typing and viewer shortcut collisions are suppressed honestly through the shared keyboard-routing seam
- the viewport browser menu does not appear from the same fly interaction
- the shipped baseline camera behavior remains unchanged outside fly mode

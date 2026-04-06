# `Camera-6.2` - `Hold-To-Fly Runtime And Input Ownership`

## Doc Header

### Doc History
1. 2026-04-06 21:02: Created this standalone future phase doc for `[Camera-6.2]`, translating the next fly-navigation cut into an implementation-ready runtime plan grounded in the finished `Camera-6.1` seam audit, with held-`RMB` fly-session ownership in the viewer, camera-controller look/translation helpers, shared keyboard-routing ownership for console suppression, and viewport-local `contextmenu` blocking

### Purpose

Use this doc as the dedicated planning and execution surface for the first actual fly-navigation runtime cut after the finished `Camera-6.1` seam audit.

The goal here is:
- let held `RMB` enter a temporary fly session in the model viewport
- route first-person mouse look through the existing viewer/camera runtime
- move with `W` / `A` / `S` / `D`
- move vertically with `Space` / `Shift`
- stop console typing from competing with those same keys
- suppress the viewport browser menu for the same `RMB` interaction

### Scope

This phase covers:
- held-`RMB` fly-session start and end
- first-person mouse look during fly mode
- `W` / `A` / `S` / `D` planar translation during fly mode
- `Space` / `Shift` vertical translation during fly mode
- shared keyboard-routing ownership for fly mode
- console global-capture deferral while fly mode is active
- viewport-local `contextmenu` suppression for the same interaction

This phase does not cover:
- pointer lock
- orthographic fly behavior
- sticky toggle-based fly mode
- fly-speed UI
- custom keybinding UI
- graph-canvas fly behavior

## Doc Body

### Summary

`Camera-6.2` is the first runtime fly-navigation cut after the finished `Camera-6.1` seam audit.

Current code-backed read:
- `src/viewer/Viewer.ts` is the correct owner for fly-session start, held-key state, and fly-session teardown
- `src/viewer/scene/CameraController.ts` is the correct owner for:
  - look delta application
  - fly translation helpers
- `src/app/inputRouting.ts` is the honest seam for introducing one explicit `viewer-fly` keyboard owner so console auto-capture can stand down while fly mode is active
- `src/app/console/useConsoleInteraction.ts` already routes global key capture through `routeKeyboardInput(...)`, so the runtime cut should prefer extending that routing result over inventing a console-only special case
- the current viewer pointer seam already leaves `RMB` unused:
  - `MMB` owns pan / modified orbit
  - `LMB` owns console camera drags, selection, and sketch interaction
  - any other button currently returns early
- the current viewer keyboard seam already uses:
  - `W` / `E` / `R` / `Q`
    - transform/gizmo shortcuts
  - `A`
    - frame all
  - `F` / `Z`
    - frame selected
  - so fly mode must override these shortcuts explicitly while active rather than trying to share the same keys

Locked recommendation:
- keep the first runtime cut hold-based only:
  - `RMB down`
    - enter fly mode
  - `RMB up`
    - exit fly mode
- keep the first runtime cut perspective-only
- add one explicit `viewer-fly` keyboard owner in shared input routing
- keep browser-menu suppression viewport-local

### Current Seam Read

The strongest owner seams for this phase are:

- `src/viewer/Viewer.ts`
  - already owns the model-viewport pointer stream
  - already owns the viewer-side `keydown` seam
  - is the narrowest place to:
    - start and stop held-`RMB` fly mode
    - track held movement keys
    - gate fly-mode start against existing higher-priority viewer owners
    - attach viewport-local `contextmenu` suppression
- `src/viewer/scene/CameraController.ts`
  - already owns camera pose mutation and temporary orbit/pan helpers
  - is the narrowest place to add:
    - fly-look delta helper
    - fly-translate helper
  - should keep camera math out of `Viewer.ts`
- `src/app/inputRouting.ts`
  - already owns cross-surface keyboard arbitration
  - is the cleanest place to add:
    - `viewer-fly`
  - should let both the viewer and the console see the same ownership result
- `src/app/console/useConsoleInteraction.ts`
  - already captures global `keydown` in the capture phase
  - already routes through `routeKeyboardInput(...)`
  - should only need a narrow follow-on acknowledgment that `viewer-fly` means:
    - do not auto-capture printable keys into console input
    - do not treat `Space` as submit while fly mode is active

### Questions / Decisions

#### [x] Question 1 - What is the first honest runtime scope?

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
- this is the narrowest honest runtime slice from the seam audit
- it keeps the mode temporary and easy to escape
- it avoids widening into input-mode UI or camera-setting work

#### [x] Question 2 - What movement keys belong in the first pass?

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
- this matches the intended first-person feel already discussed for the feature
- it keeps the first cut simple and implementation-ready

#### [x] Question 3 - How should fly mode block console typing?

##### Locked answer
- add one explicit `viewer-fly` owner to `routeKeyboardInput(...)`
- make the viewer report fly mode through that shared routing seam
- make console global capture defer whenever `routeKeyboardInput(...)` resolves to `viewer-fly`

##### Why
- the console currently sees keys before the viewer does
- surface truth alone is not enough to block console typing
- the shared input-routing seam is already the repo’s honest ownership boundary

#### [x] Question 4 - What should the first pass preserve?

##### Locked answer
- outside active fly mode, keep the shipped model-viewport baseline unchanged:
  - `Wheel`
    - zoom
  - `MMB`
    - pan
  - `Ctrl + MMB`
    - orbit
- do not let fly mode start from:
  - active sketch interaction
  - active gizmo/widget ownership
  - active console camera drag
  - active workspace marquee drag
- do not globally disable the browser context menu across the app

##### Why
- this preserves the current authoring-first input model and keeps the new feature additive instead of disruptive

### Implementation Spec

Likely files:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts`
- `src/app/console/useConsoleInteraction.ts`
- likely tests near:
  - `src/viewer/scene/CameraController.test.ts`
  - viewer tests near `src/viewer/Viewer.ts`
  - `src/app/inputRouting.test.ts`
  - console keyboard-capture tests if the routing owner changes

Locked first-cut direction:
1. add one viewer-local fly session state in `Viewer.ts`, likely including:
   - whether fly mode is active
   - the active pointer id for held `RMB`
   - held movement-key state
2. start fly mode from the existing pointer seam in `Viewer.ts` when:
   - `event.button === 2`
   - no higher-priority viewer owner already claims the interaction
3. attach pointer capture for the fly session and release it on exit
4. add one viewport-local `contextmenu` listener/guard on `renderer.domElement` so the same interaction does not open the browser menu
5. add narrow camera-controller helpers for:
   - applying mouse-look deltas
   - translating along forward/right/up axes
6. extend the viewer render/update loop or per-frame tick so held movement keys produce continuous motion while fly mode is active
7. extend `routeKeyboardInput(...)` with one `viewer-fly` owner branch and the minimum request fields needed to resolve it
8. make `useConsoleInteraction.ts` defer printable-key and `Space` auto-capture while the routing owner is `viewer-fly`
9. short-circuit the viewer’s existing shortcut path while fly mode is active so:
   - gizmo `W` / `E` / `R` / `Q`
   - `A` frame all
   - `F` / `Z` frame selected
   do not fire during the fly session
10. stop movement and exit immediately on `RMB` release, cancellation, blur, or teardown

Scope honored:
- keep this cut runtime-focused
- do not widen into pointer lock
- do not widen into speed UI or rebind UI
- do not widen into graph-canvas fly behavior

Verification matrix:
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

Definition of done:
- held `RMB` starts a temporary fly session in the model viewport
- fly mode owns mouse look and movement keys only while active
- console typing and viewer shortcut collisions are suppressed honestly through the shared keyboard-routing seam
- the viewport browser menu does not appear from the same fly interaction
- the shipped baseline camera behavior remains unchanged outside fly mode

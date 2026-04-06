# `Camera-6.1` - `Fly Navigation Research And Seam Audit`

## Doc Header

### Doc History
2. 2026-04-06 20:52: Marked `Camera-6.1` complete after auditing the live viewer pointer/keyboard seams, the console global key capture path, the current surface-activation seam, and the camera-controller helper surface, then tightened the follow-on read so `Camera-6.2 - Hold-To-Fly Runtime And Input Ownership` is now the next honest runtime cut
1. 2026-04-06 20:33: Created this standalone future phase doc for `[Camera-6.1]`, translating the first fly-navigation cut into a seam-audit and current-code research pass so the later held-`RMB` implementation starts from one concrete read of viewer pointer ownership, keyboard ownership, camera-motion helpers, and viewport-local context-menu suppression

### Purpose

This doc defines the `[Camera-6.1]` follow-on under the camera-controls family.

Use it to answer:
- which current runtime seams would own fly navigation
- how `RMB`-held fly mode should start and stop without colliding with existing viewport owners
- how fly mode should block console typing
- where viewport-local `contextmenu` suppression should attach
- what the narrow later implementation cut should look like

### Why This Phase Exists

The fly-navigation idea touches several systems at once:
- viewer pointer ownership
- viewer keyboard ownership
- camera runtime motion helpers
- console typing/input routing
- browser context-menu behavior over the viewport

That is still small enough to ship, but wide enough that it should not start with blind implementation guesses.

This phase exists to lock one honest current-code read first, so the later runtime work does not:
- patch the wrong input seam
- accidentally leak movement keys into console typing
- weaken existing authoring ownership rules
- globally disable right click instead of suppressing the viewport-local menu only when the same `RMB` fly interaction ends

### Scope

This phase covers:
- current-code seam audit for fly navigation
- viewer pointer-start and pointer-end seam audit
- keyboard ownership and console-typing seam audit
- camera-controller seam audit for look and movement helpers
- viewport-local `contextmenu` suppression seam audit
- recommended follow-on implementation slice

This phase does not cover:
- shipping the fly-navigation runtime itself
- adding final movement feel
- adding pointer lock
- adding keybinding customization
- graph-canvas fly navigation

## Doc Body

## [x] `Camera-6.1` - `Fly Navigation Research And Seam Audit`

### Summary

#### Purpose:
- lock the current-code seam read for fly navigation before the runtime change lands

#### Shipped result:
- `Camera-6.1` now records the live pointer, keyboard, console, and camera seams that a held-`RMB` fly mode would need to use
- the seam audit confirms that `Camera-6.2` can stay narrow:
  - viewer-owned held-`RMB` fly session
  - camera-controller movement/look helpers
  - explicit console typing suppression through the existing input-routing path
  - viewport-local `contextmenu` suppression

#### Current code-backed read:
- `src/viewer/Viewer.ts` already owns the model-viewport pointer stream:
  - it registers `pointerdown` / `pointermove` / `pointerup` directly on `renderer.domElement`
  - it already multiplexes camera drag, console camera drag, sketch input, and workspace marquee input through one pointer seam
  - today it only special-cases:
    - `MMB`
    - `LMB`
  - any other mouse button returns early, which leaves `RMB` free as the first likely fly trigger seam
- `src/viewer/Viewer.ts` also already owns the viewer-side global keyboard seam:
  - `window.addEventListener('keydown', this.handleKeyDown)`
  - the current handler already contains camera/view shortcuts and transform/gizmo shortcuts
  - that means fly mode should plug into this handler instead of creating a second unrelated viewer key listener
- the current viewer key map already consumes:
  - `W`
    - translate gizmo mode
  - `E`
    - rotate gizmo mode
  - `R`
    - scale gizmo mode
  - `Q`
    - local/world gizmo space
  - `A`
    - frame all
  - `F` / `Z`
    - frame selected
  - so fly mode will need an explicit higher-priority branch while active rather than trying to coexist with those shortcuts opportunistically
- `src/app/inputRouting.ts` is the real cross-surface ownership seam for keyboard capture:
  - it currently knows about:
    - `text-field`
    - `sketch-plane`
    - `sketch-draw`
    - `reference-transform`
    - `staged-console`
    - `flat-console`
  - it does not yet know about a viewer fly owner
  - that makes it the cleanest place to add one new `viewer-fly` ownership branch later instead of hard-coding a console-only exception
- `src/app/console/useConsoleInteraction.ts` captures global `keydown` in the capture phase and routes through `routeConsoleGlobalKey(...)`, which itself calls `routeKeyboardInput(...)`
  - because the console listens with `window.addEventListener('keydown', handleKeyDown, true)`, the console currently gets first shot at printable keys before the viewer's non-capture `keydown` handler
  - that means fly mode cannot rely on the viewer keyboard handler alone to stop console typing
  - the honest seam is:
    - teach `routeKeyboardInput(...)` about fly ownership
    - let console capture see that owner and stand down
- `src/app/components/ViewerHost.tsx` already promotes viewer interactions into app-level surface truth with `setActiveSurface('viewer')`
  - that existing seam is useful for fly-mode entry too
  - but `activeSurface === 'viewer'` alone is not enough to block console typing, because console capture currently keys off `routeKeyboardInput(...)`, not surface truth by itself
- `src/viewer/scene/CameraController.ts` is the right motion seam:
  - it already owns orbit/pan/zoom helpers and camera pose mutation
  - it does not currently expose any fly-style translation or look helper
  - that suggests `Camera-6.2` should add narrow helpers here instead of implementing raw camera math in `Viewer.ts`
- the viewport currently has no `contextmenu` handler at all
  - so the clean suppression seam is the viewer DOM element itself
  - that should stay viewport-local instead of disabling right click globally

### Questions / Decisions

#### [x] Question 1 - Which seam should own `RMB` fly-mode start and release?

##### Locked answer
- `src/viewer/Viewer.ts`

##### Why
- it already owns the pointer stream for the model viewport
- it already gates other camera and selection interactions there
- `RMB` is currently unused in that seam, so adding fly-mode start there is lower-risk than widening other surfaces first

#### [x] Question 2 - Which seam should own fly-mode movement keys and block console typing?

##### Locked answer
- use two layers together:
  - `src/viewer/Viewer.ts`
    - own the actual fly-mode movement state and per-key behavior
  - `src/app/inputRouting.ts`
    - own the cross-surface keyboard arbitration so console capture can defer while fly mode is active

##### Why
- the viewer already owns the key meanings
- the console currently captures keys in the capture phase through `routeKeyboardInput(...)`
- so fly mode needs one explicit routing owner in the shared keyboard path, not a viewer-only workaround

#### [x] Question 3 - Which seam should own look and translation motion?

##### Locked answer
- `src/viewer/scene/CameraController.ts`

##### Why
- it already owns camera pose mutation
- it already exposes temporary orbit and pan helpers
- adding narrow fly helpers there keeps camera math in one place instead of duplicating motion logic in `Viewer.ts`

#### [x] Question 4 - Which seam should suppress the browser context menu?

##### Locked answer
- attach viewport-local suppression to `renderer.domElement` in `src/viewer/Viewer.ts`

##### Why
- the browser menu should only be suppressed for the model viewport interaction that actually entered fly mode
- this avoids globally disabling right click across the rest of the app

#### [x] Question 5 - Should the later implementation stay non-pointer-lock and perspective-only first?

##### Locked answer
- yes

##### Why
- nothing in the seam audit forces pointer lock into the first cut
- orthographic fly behavior would widen the contract and likely feel strange
- the narrowest honest first runtime pass is:
  - no pointer lock required
  - perspective-only fly behavior
  - model viewport only

### Research Spec

Likely files for `Camera-6.2`:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts`
- `src/app/console/useConsoleInteraction.ts` only if the new routing owner needs one narrow capture-path acknowledgment
- likely tests near:
  - `src/viewer/scene/CameraController.test.ts`
  - viewer tests near `src/viewer/Viewer.ts`
  - console/input-routing tests if keyboard ownership changes

Locked follow-on direction:
1. add one viewer-local fly session in `Viewer.ts` tied to held `RMB`
2. start that session only when no higher-priority viewer owner already has the interaction
3. add one new keyboard-routing owner for fly mode in `inputRouting.ts`
4. make console global capture defer when that fly owner is active
5. add narrow fly-look and fly-translate helpers in `CameraController.ts`
6. track held movement keys in the viewer while fly mode is active
7. add viewport-local `contextmenu` suppression on the same interaction
8. stop movement and release ownership immediately on `RMB` release

Scope honored:
- this phase stayed research-only
- no runtime fly mode landed yet
- no pointer lock or tuning UI was mixed in

Definition of done:
- the fly-navigation idea now has one concrete seam-audit record
- `Camera-6.2` has a narrower, safer implementation entry point
- the family no longer needs to reopen discovery before starting the runtime change

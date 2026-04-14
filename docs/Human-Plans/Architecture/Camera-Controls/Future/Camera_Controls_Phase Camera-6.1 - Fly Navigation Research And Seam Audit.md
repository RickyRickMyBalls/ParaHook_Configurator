# `Camera-6.1` - `Fly Navigation Research And Seam Audit`

## Doc Header

### Doc History
3. 2026-04-14: Re-did `Camera-6.1` against the current code after the workspace/viewer split matured, replacing the older single-viewport read with an active-viewer-viewport seam audit and tightening the follow-on expectations around console capture, per-viewport ownership, and missing release seams like `keyup`, `blur`, and viewport-local `contextmenu`
2. 2026-04-06 20:52: Marked `Camera-6.1` complete after auditing the live viewer pointer/keyboard seams, the console global key capture path, the current surface-activation seam, and the camera-controller helper surface, then tightened the follow-on read so `Camera-6.2 - Hold-To-Fly Runtime And Input Ownership` is now the next honest runtime cut
1. 2026-04-06 20:33: Created this standalone future phase doc for `[Camera-6.1]`, translating the first fly-navigation cut into a seam-audit and current-code research pass so the later held-`RMB` implementation starts from one concrete read of viewer pointer ownership, keyboard ownership, camera-motion helpers, and viewport-local context-menu suppression

### Purpose

This doc defines the refreshed `[Camera-6.1]` follow-on under the camera-controls family.

Use it to answer:
- which current runtime seams would own fly navigation now
- how held-`RMB` fly mode should start and stop without colliding with existing viewport owners
- how fly mode should block console typing through the shared routing seam
- how active viewer viewport ownership changes the implementation read
- where viewport-local `contextmenu` suppression and fly-session teardown should attach
- what the narrow later implementation cut should look like now

### Why This Phase Exists

The fly-navigation idea still touches several systems at once:
- viewer pointer ownership
- viewer keyboard ownership
- camera runtime motion helpers
- console typing and keyboard routing
- workspace active-viewer ownership
- browser context-menu behavior over the viewport

That is still small enough to ship, but wide enough that it should not start from stale assumptions.

This refreshed seam audit exists to lock one honest current-code read first, so the later runtime work does not:
- patch the wrong viewer instance in a multi-viewport workspace
- accidentally leak movement keys into console typing
- weaken existing authoring ownership rules
- assume a release seam already exists when `keyup`, `blur`, and viewport-local `contextmenu` handling still need to be introduced deliberately
- globally disable right click instead of suppressing the viewport-local menu only when the same held-`RMB` fly interaction ends

### Scope

This phase covers:
- current-code seam audit for fly navigation
- active-viewer-viewport ownership audit
- viewer pointer-start and pointer-end seam audit
- keyboard ownership and console-typing seam audit
- camera-controller seam audit for look and movement helpers
- viewport-local `contextmenu` suppression and release-seam audit
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

#### Refreshed result:
- `Camera-6.1` now records the live pointer, keyboard, console, active-viewport, and camera seams that a held-`RMB` fly mode would need to use
- the seam audit still confirms that `Camera-6.2` can stay narrow:
  - viewer-owned held-`RMB` fly session
  - active viewer viewport only
  - camera-controller look and translation helpers
  - explicit console typing suppression through the existing input-routing path
  - viewport-local `contextmenu` suppression
  - explicit fly teardown on `RMB` release plus the missing release seams

#### Current code-backed read:
- `src/viewer/Viewer.ts` still owns the viewport-local pointer stream:
  - it registers `pointerdown` / `pointermove` / `pointerup` directly on `renderer.domElement`
  - it already multiplexes camera drag, console camera drag, sketch input, and workspace marquee input through one pointer seam
  - today it only special-cases:
    - `MMB`
    - `LMB`
  - any other mouse button still returns early, which leaves `RMB` free as the first likely fly trigger seam
- `src/viewer/Viewer.ts` still owns the viewer-side `keydown` seam:
  - `window.addEventListener('keydown', this.handleKeyDown)`
  - the current handler already contains camera/view shortcuts and transform/gizmo shortcuts
  - that means fly mode should still plug into this handler instead of creating a second unrelated viewer keydown path
- `src/viewer/Viewer.ts` does not currently own:
  - a `keyup` listener
  - a window `blur` listener
  - a viewport-local `contextmenu` listener
  - a `pointercancel` listener
  - so the later runtime phase cannot assume fly-session teardown already has those release seams available
- the current viewer key map still consumes:
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
  - so fly mode will still need an explicit higher-priority branch while active rather than trying to coexist with those shortcuts opportunistically
- `src/viewer/scene/CameraController.ts` is still the right motion seam:
  - it already owns orbit, pan, zoom, and camera pose mutation
  - it still leaves `RIGHT` mouse unbound
  - it still does not expose any fly-style look or translation helper
  - that means `Camera-6.2` should still add narrow fly helpers there instead of implementing raw camera math in `Viewer.ts`
- `src/app/inputRouting.ts` is still the real cross-surface ownership seam for keyboard capture:
  - it currently knows about:
    - `text-field`
    - `sketch-plane`
    - `sketch-draw`
    - `reference-transform`
    - `staged-console`
    - `flat-console`
  - it still does not know about a viewer fly owner
  - that keeps it as the cleanest place to add one new `viewer-fly` ownership branch later instead of hard-coding a console-only exception
- `src/app/console/useConsoleInteraction.ts` still captures global `keydown` in the capture phase and routes through `routeConsoleGlobalKey(...)`, which itself calls `routeKeyboardInput(...)`
  - because the console capture runs before the viewer's non-capture keydown handler, fly mode still cannot rely on the viewer keyboard handler alone to stop console typing
  - the honest seam is still:
    - teach `routeKeyboardInput(...)` about fly ownership
    - let console capture see that owner and stand down
- the app now has a stronger multi-viewport ownership layer than the older audit assumed:
  - `src/app/hosts/useAppShellSurfaceActivation.ts` explicitly sets the active viewer viewport id and the active viewer bridge entry when a viewport is activated
  - `src/app/viewerBridge.ts` tracks viewer instances per viewport id and resolves one active viewer viewport
  - that means the modern fly-navigation target is not "the model viewport" in the abstract
  - it is the currently active viewer viewport instance that owns the held-`RMB` interaction
- active surface truth is still useful, but not sufficient:
  - viewer activation still publishes the viewer as the active surface
  - but `activeSurface === 'viewer'` alone still does not block console typing, because console capture keys off `routeKeyboardInput(...)`, not surface truth by itself
- the viewport still has no viewer-owned `contextmenu` suppression today
  - so the clean suppression seam is still the viewer DOM element itself
  - but the refreshed read should now treat that as part of a wider fly-session exit bundle:
    - pointer release
    - key release cleanup
    - blur cleanup
    - viewport-local `contextmenu` suppression for the same held-`RMB` interaction only

### Questions / Decisions

#### [x] Question 1 - Which seam should own held-`RMB` fly-mode start and release now?

##### Locked answer
- `src/viewer/Viewer.ts`

##### Why
- it still owns the viewport-local pointer stream
- it already gates other camera and selection interactions there
- `RMB` is still unused in that seam
- this keeps fly-session start tied to the exact viewer instance that received the interaction

#### [x] Question 2 - Which seam should own fly-mode movement keys and block console typing?

##### Locked answer
- use two layers together:
  - `src/viewer/Viewer.ts`
    - own the actual fly-mode movement state, held-key state, and per-key behavior for the active viewer viewport instance
  - `src/app/inputRouting.ts`
    - own the cross-surface keyboard arbitration so console capture can defer while fly mode is active

##### Why
- the viewer still owns the key meanings
- the console still captures keys in the capture phase through `routeKeyboardInput(...)`
- so fly mode still needs one explicit routing owner in the shared keyboard path, not a viewer-only workaround

#### [x] Question 3 - Which seam should own look and translation motion?

##### Locked answer
- `src/viewer/scene/CameraController.ts`

##### Why
- it still owns camera pose mutation
- it already exposes temporary orbit and pan helpers
- adding narrow fly helpers there keeps camera math in one place instead of duplicating motion logic in `Viewer.ts`

#### [x] Question 4 - Which seam should suppress the browser context menu?

##### Locked answer
- attach viewport-local suppression to `renderer.domElement` in `src/viewer/Viewer.ts`

##### Why
- the browser menu should only be suppressed for the viewer interaction that actually entered fly mode
- this still avoids globally disabling right click across the rest of the app

#### [x] Question 5 - What release seams does the later implementation need to add explicitly?

##### Locked answer
- the first runtime cut should plan explicit cleanup for:
  - `RMB` / pointer release
  - movement-key release
  - window blur or equivalent viewer deactivation cleanup
  - viewport-local `contextmenu` suppression tied to the same interaction

##### Why
- those release seams are not already present in `Viewer.ts`
- without them, held-key movement and right-click release behavior would be fragile

#### [x] Question 6 - Should the later implementation stay non-pointer-lock and perspective-only first?

##### Locked answer
- yes

##### Why
- nothing in the refreshed seam audit forces pointer lock into the first cut
- orthographic fly behavior would widen the contract and likely feel strange
- the narrowest honest first runtime pass is still:
  - no pointer lock required
  - perspective-only fly behavior
  - active viewer viewport only

### Research Spec

Likely files for `Camera-6.2`:
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/app/inputRouting.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/hosts/useAppShellSurfaceActivation.ts` only as context for active viewer viewport ownership
- `src/app/viewerBridge.ts` only as context for per-viewport viewer resolution
- likely tests near:
  - `src/viewer/scene/CameraController.test.ts`
  - viewer tests near `src/viewer/Viewer.ts`
  - `src/app/inputRouting.test.ts`
  - console/input-routing tests if keyboard ownership changes

Locked follow-on direction:
1. add one viewer-local fly session in `Viewer.ts` tied to held `RMB`
2. start that session only when no higher-priority viewer owner already has the interaction
3. bind that session to the active viewer viewport instance that received the interaction
4. add one new keyboard-routing owner for fly mode in `inputRouting.ts`
5. make console global capture defer when that fly owner is active
6. add narrow fly-look and fly-translate helpers in `CameraController.ts`
7. track held movement keys in the viewer while fly mode is active
8. add the missing release seams needed for honest teardown:
   - key release handling
   - blur or equivalent session cleanup
   - viewport-local `contextmenu` suppression
9. stop movement and release ownership immediately on fly-session exit

Scope honored:
- this phase stayed research-only
- no runtime fly mode landed yet
- no pointer lock or tuning UI was mixed in

Definition of done:
- the fly-navigation idea now has one refreshed seam-audit record grounded in the current multi-viewport architecture
- `Camera-6.2` has a narrower, safer implementation entry point
- the family no longer needs to reopen discovery before starting the runtime change

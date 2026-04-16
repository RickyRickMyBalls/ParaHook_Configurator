# `Camera-7` - `Active Viewer Camera Control Shortcuts`

## Doc Header

### Doc History
18. 2026-04-16: Marked `Camera-7 / Phase 3.2 - Animated Zoom To Object Through Shared Framing Seam` shipped after widening the shared framing command seam with explicit animation options, routing both active-viewer `Shift+Z` and Console `Zoom Object` through that animated framing path, and teaching the camera controller to interpolate orthographic zoom height so object zoom now animates instead of snapping in both perspective and orthographic views
17. 2026-04-16: Prepped `Camera-7 / Phase 3.2 - Animated Zoom To Object Through Shared Framing Seam` for implementation by grounding the follow-on in the live shared zoom-target resolver, the current `Shift+Z` and Console `Zoom Object` entry points, the shared framing command seam, and the existing Camera-7 transition-duration preference so the animation pass can land as one honest widening of object framing instead of a shortcut-only branch
16. 2026-04-16: Revised the shipped `Camera-7 / Phase 3.1` keyboard binding so `Zoom Object` now lives on `Shift+Z` and no longer uses `Numpad .`, closing the NumLock overlap where the physical decimal key could alias to `Delete` with NumLock off or leak `.` into console capture with NumLock on while keeping the shared zoom-to-object seam and viewport-aware reference framing intact
15. 2026-04-16: Marked `Camera-7 / Phase 3.1 - Numpad Decimal Entry Into Shared Zoom To Object` shipped after adding `Numpad .` as an active-viewer-only entry into the shared zoom-to-object seam, extracting one shared selected-target zoom resolver for both keyboard and Console `Zoom Object`, and widening the shared reference framing command so reference zoom stays viewport-aware under that same active-viewer shortcut path
14. 2026-04-16: Prepped `Camera-7 / Phase 3.1 - Numpad Decimal Entry Into Shared Zoom To Object` for implementation by grounding the follow-on in the live `frameSelectedCommand(...)` and `frameReferenceCommand(...)` seams, the existing Console `Zoom Object` selected-target resolver, and the current active-viewer shortcut hook so the first `Numpad .` cut can stay on one honest object-framing path without widening into animation yet
13. 2026-04-16: Marked `Camera-7 / Phase 2.2 - View Toolbar Camera Transition Duration ParaSlider` shipped after adding one shared camera shortcut transition duration preference, surfacing it as a `Transition` `ParaSlider` under `View Toolbar > Camera > Projection & Framing`, and routing the active-viewer standard-view numpad shortcuts through that live shared duration instead of the old fixed `320ms` constant
12. 2026-04-16: Prepped `Camera-7 / Phase 2.2 - View Toolbar Camera Transition Duration ParaSlider` for implementation by grounding the duration-control pass in the live `ViewToolbar` camera section, the shared `useUiPrefsStore` scalar-pref pattern, and the current `useViewerCameraShortcuts.ts` fixed `320ms` animation option so the follow-on can land as one narrow shared timing control without widening into viewport-local persistence or broader camera-feel tuning
11. 2026-04-16: Split the planned `Camera-7 / Phase 4` projection follow-on into smaller implementation-ready subphases, keeping `Shift+P` and `Shift+O` restoration in `Phase 4.1` and adding `Phase 4.2` to consolidate and fix the Console `Camera > Projection` area so it changes camera projection through the same active-viewer path as those restored shortcuts
10. 2026-04-16: Revised the planned `Camera-7 / Phase 3.1` and `Phase 3.2` wording to consolidate zoom-to-object ownership around the shared framing seam, so `Numpad .` reads as one new entry surface into the existing zoom path and the later animation phase now explicitly covers both keyboard and Console `Zoom Object` instead of sounding numpad-only
9. 2026-04-16: Added the planned `Camera-7 / Phase 4 - Projection Shortcut Restoration` follow-on so `Shift+P` and `Shift+O` can return as active-viewer-only projection shortcuts through the shared projection command seam without disturbing the shipped numpad standard-view ladder
8. 2026-04-16: Marked `Camera-7 / Phase 2.1 - Animated Standard View Transitions` shipped after widening the shared preset seam with explicit animation options, routing the active-viewer numpad standard-view shortcuts through that animated path at a fixed `320ms`, and adding focused proof for command forwarding, viewer forwarding, animated preset execution, and in-flight transition replacement
7. 2026-04-16: Prepped `Camera-7 / Phase 2.1 - Animated Standard View Transitions` for implementation by grounding it in the live shortcut, command, viewer, and controller seams and by locking an explicit animated-preset contract, file targets, verification shape, and done shape
6. 2026-04-16: Broke the remaining planned Camera-7 follow-ons into smaller implementation-ready subphases so Codex can land them one by one, splitting the old broad `Phase 2` into `2.1` animation behavior plus `2.2` duration UI and splitting the old broad `Phase 3` into `3.1` numpad-decimal target mapping plus `3.2` animated zoom-to-object behavior
5. 2026-04-16: Added the planned `Camera-7 / Phase 3 - Numpad Decimal Zoom To Object` follow-on, mapping the new Camera-7 wishlist item onto one later phase where `Numpad .` should zoom to the selected object and do so through an animated transition instead of an instant jump
4. 2026-04-16: Corrected `## Wishlist Tracking` so it now tracks only the two Camera-7 wishlist items themselves, mapping `shortcut controls` to `Phase 1` and `animated transitions` to `Phase 2` instead of reading like a broader feature bucket
3. 2026-04-16: Expanded the planned `Camera-7 / Phase 2 - Animated Standard View Transitions` follow-on so it now includes one `ParaSlider` in the `View` toolbar `Camera` section for transition duration, with `320ms` kept as the first default instead of burying animation timing as a hard-coded shortcut-only constant
2. 2026-04-16: Added the planned `Camera-7 / Phase 2 - Animated Standard View Transitions` follow-on, grounding the suggestion in the existing `CameraController.animateToDirection(...)` seam so the current numpad view shortcuts can animate to `Top` / `Front` / `Back` / `Left` / `Right` without inventing a shortcut-only camera path
1. 2026-04-16: Created this standalone shipped record for `Camera-7`, grounding the first active-viewer camera shortcut pass in shared keyboard routing, viewer-host installation, a centralized numpad shortcut map, and the widened `Back` camera preset seam

### Purpose

This doc records the shipped `Camera-7 / Phase 1` shortcut cut and the remaining planned `Camera-7` subphases under the camera-controls family.

Use it to answer:
- what the first viewer camera shortcut pass now ships
- which keys are currently bound
- which seams own shortcut arbitration versus camera execution
- what this phase intentionally left for later

### Scope

This phase shipped:
- active-viewer-only camera view shortcuts
- physical numpad shortcut detection through `KeyboardEvent.code`
- first standard view bindings:
  - `Numpad5` = `Top`
  - `Numpad2` = `Front`
  - `Numpad8` = `Back`
  - `Numpad4` = `Left`
  - `Numpad6` = `Right`
- shared keyboard-routing ownership through `viewer-camera-shortcuts`
- viewer-host installation through one dedicated hook
- a real `Back` camera preset in the shared viewer camera contract

This phase still does not cover:
- projection shortcuts
- `Iso`
- `Frame Selected`
- `Frame All`
- customizable keybinding UI
- toolbar button expansion for `Back`

## Doc Body

## Wishlist Tracking

- [x] `Shortcut controls`
  - `Phase 1`
  - shipped in:
    - active-viewer standard-view shortcuts
    - `Numpad5` = `Top`
    - `Numpad2` = `Front`
    - `Numpad8` = `Back`
    - `Numpad4` = `Left`
    - `Numpad6` = `Right`

- [x] `Animated transitions`
  - `Phase 2.1`
  - `Phase 2.2`
  - shipped in:
    - `Phase 2.1`
    - active-viewer standard-view shortcuts animate instead of snap with a fixed `320ms` duration through the shared preset seam
    - `Phase 2.2`
    - `View Toolbar > Camera > Projection & Framing` now exposes one shared `Transition` `ParaSlider`
    - active-viewer standard-view shortcuts now read the live shared duration value instead of a local `320ms` constant

- [x] `Zoom to object`
  - `Phase 3.1`
  - `Phase 3.2`
  - shipped in:
    - `Phase 3.1`
    - `Shift+Z` now enters the shared zoom-to-object seam for the active viewer
    - keyboard and Console `Zoom Object` now reuse one selected-target zoom resolver
    - reference zoom now stays viewport-aware under that shared shortcut path
    - `Phase 3.2`
    - the shared zoom-to-object move animates instead of snapping for both keyboard and console entry points
    - the shared Camera-7 transition duration now applies to that animated zoom path too

- [ ] `Projection shortcuts`
  - `Phase 4.1`
  - `Phase 4.2`
  - planned for:
    - `Phase 4.1`
    - `Shift+P` restores `Perspective`
    - `Shift+O` restores `Orthographic`
    - `Phase 4.2`
    - Console `Camera > Projection` changes the same active viewer camera projection through the same shared path as `Shift+P` and `Shift+O`

## [x] `Camera-7` - Phase 1 - `Active Viewer Camera Control Shortcuts`

### Summary

#### Purpose:
- add the first honest keyboard shortcut surface for standard viewer camera views without widening into a full keybinding system

#### Shipped result:
- the active model viewer now responds to:
  - `Numpad5` = `Top`
  - `Numpad2` = `Front`
  - `Numpad8` = `Back`
  - `Numpad4` = `Left`
  - `Numpad6` = `Right`
- `src/app/cameraShortcuts.ts` owns the centralized binding table and resolves shortcuts by `event.code` so the binding stays explicitly numpad-scoped
- `src/app/inputRouting.ts` exposes a dedicated `viewer-camera-shortcuts` owner before flat console capture while still keeping fly mode ahead of this shortcut path
- `src/app/useViewerCameraShortcuts.ts` installs the active-viewer listener and routes the resolved action through the shared `setCameraPresetCommand(...)` seam
- `src/viewer/scene/CameraController.ts` and `src/app/viewerBridge.ts` now include a real `back` preset instead of forcing the shortcut layer to fake that view

### Questions / Decisions

#### [x] Question 1 - What exact first-cut shortcut set shipped?

##### Locked answer
- `Numpad5`
  - `Top`
- `Numpad2`
  - `Front`
- `Numpad8`
  - `Back`
- `Numpad4`
  - `Left`
- `Numpad6`
  - `Right`

##### Why
- this matches the requested numeric standard-view block directly
- it keeps the first cut narrow and physically tied to the numpad instead of overloading general letter keys

#### [x] Question 2 - Which seam owns the bindings versus the runtime camera action?

##### Locked answer
- `src/app/cameraShortcuts.ts`
  - owns the binding map
  - resolves `KeyboardEvent.code`
- `src/app/inputRouting.ts`
  - owns cross-surface shortcut arbitration
- `src/app/useViewerCameraShortcuts.ts`
  - owns the active-viewer listener
  - calls the shared command seam
- `src/viewer/scene/CameraController.ts`
  - owns the actual `back` / `front` / `left` / `right` / `top` preset direction math

##### Why
- the binding map needed to stay easy to revise later
- the viewer shortcut path needed to respect the same active-surface and console-routing rules already used by the wider camera/input system

### Verification Shape

- shortcut resolution tests should prove the numpad-code map and modifier gating
- routing tests should prove `viewer-camera-shortcuts` wins before flat console capture for the active viewer
- hook tests should prove only the active viewer fires camera preset commands
- hook tests should prove fly mode keeps this shortcut layer dormant

## [x] `Camera-7` - Phase 2.1 - `Animated Standard View Transitions`

### Summary

#### Purpose:
- change the current standard-view shortcut result from an instant snap into a smooth camera transition while preserving the same active-viewer numpad bindings from `Phase 1`

#### Shipped result:
- `src/app/viewCommands.ts`, `src/app/viewerBridge.ts`, `src/viewer/Viewer.ts`, and `src/viewer/scene/CameraController.ts` now support an explicit animated camera-preset option instead of forcing every preset caller onto one motion path
- `src/app/useViewerCameraShortcuts.ts` now opts the active-viewer `Numpad5` / `Numpad2` / `Numpad8` / `Numpad4` / `Numpad6` standard-view shortcuts into that animated preset path with a fixed `320ms` duration
- default preset callers such as existing toolbar buttons still keep their current snap behavior unless they explicitly request animation
- repeated animated preset requests replace the in-flight transition instead of queueing stacked moves

#### Owns:
- animated transition behavior for:
  - `Top`
  - `Front`
  - `Back`
  - `Left`
  - `Right`
- the shared seam choice for how a camera preset can request animation instead of snapping
- fixed first duration recommendation for that transition

#### Keeps for later:
- visible duration UI
- projection-mode animation
- `Iso`
- `Frame Selected`
- `Frame All`
- per-shortcut customization

### Suggestion

- keep `src/app/cameraShortcuts.ts` unchanged:
  - the shortcut map is already correct for `Phase 1`
  - `Phase 2` should change camera motion behavior, not the binding table
- avoid solving this in `src/app/useViewerCameraShortcuts.ts` with a local shortcut-only animation branch
- prefer widening the shared camera preset seam itself so future callers can reuse the same behavior:
  - current `Phase 1` path:
    - shortcut hook
    - `setCameraPresetCommand(...)`
    - `Viewer.setCameraPreset(...)`
    - `CameraController.setPreset(...)`
    - `snapToDirection(...)`
  - suggested `Phase 2` path:
    - shortcut hook stays the same
    - shared command seam opts into animated preset application
    - `Viewer` forwards that request to `CameraController.animateToDirection(...)`
- ground the implementation in the existing `src/viewer/scene/CameraController.ts` transition seam:
  - `animateToDirection(...)` already exists
  - it already preserves the current target and current camera distance
  - it already picks a safe `up` vector for near-top or near-bottom directions
  - it already carries a default duration option

### Recommended First Cut

- keep the same five `Phase 1` bindings:
  - `Numpad5`
  - `Numpad2`
  - `Numpad8`
  - `Numpad4`
  - `Numpad6`
- when one of those shortcuts fires:
  - animate to the requested direction instead of snapping
- keep the first duration fixed and modest:
  - `320ms`
- keep repeated shortcut presses simple in the first cut:
  - a new shortcut press should replace the previous transition cleanly rather than queueing several camera animations

### Questions / Decisions

#### [x] Question 1 - Where should `Phase 2` animation live?

##### Suggested answer
- in the shared camera preset seam, not in the shortcut hook itself

##### Why
- the shortcut layer should stay a thin binding and routing surface
- `CameraController` already owns the actual camera transition math through `animateToDirection(...)`
- a shared animated-preset seam would also leave room for later reuse by toolbar buttons or other explicit camera-command surfaces

#### [x] Question 2 - Should `Phase 2` animate only shortcut views, or all preset callers immediately?

##### Suggested answer
- start with animated standard-view shortcuts only, but implement that by adding an explicit animated-preset option to the shared preset seam

##### Why
- the user-facing ask is specifically about shortcut behavior
- the command and viewer seams should still be widened honestly so this does not become a dead-end shortcut-only exception
- keeping the option explicit avoids accidentally changing unrelated callers in the same cut

### Implementation Spec

Recommended file changes:
- edit `src/app/viewCommands.ts`
- edit `src/app/useViewerCameraShortcuts.ts`
- edit `src/app/viewerBridge.ts`
- edit `src/viewer/Viewer.ts`
- edit `src/viewer/scene/CameraController.ts`
- update focused tests in:
  - `src/app/viewCommands.test.ts`
  - `src/app/useViewerCameraShortcuts.test.tsx`
  - `src/viewer/Viewer.test.ts`
  - `src/viewer/scene/CameraController.test.ts`

Current seam read:
- `src/app/useViewerCameraShortcuts.ts` already does the right thin job:
  - resolve the numpad action
  - gate to the active viewer
  - call `setCameraPresetCommand(...)`
- `src/app/viewCommands.ts` currently forwards only `preset` and `viewportId`, so this is the first safe command seam to widen with an explicit animation option
- `src/app/viewerBridge.ts` currently exposes `ViewerApi.setCameraPreset(preset)` with no motion options yet, so the bridge contract also needs to widen honestly
- `src/viewer/Viewer.ts` currently calls `cameraController.setPreset(preset)` for standard preset changes, but it already uses `cameraController.animateToDirection(..., { durationMs: 320 })` in two nearby places:
  - axis-gizmo orientation clicks
  - geometry-sketch camera alignment
- `src/viewer/scene/CameraController.ts` already owns both sides of the motion model:
  - `setPreset(...)` for snap behavior
  - `animateToDirection(...)` for eased camera transitions

Implementation steps:
1. widen the shared preset command contract so a caller can request animation explicitly instead of silently changing all preset calls
2. preferred first-cut shape:
   - `setCameraPresetCommand(preset, viewportId?, options?)`
   - `options.animate?: boolean`
   - `options.durationMs?: number`
3. widen the viewer bridge contract to match:
   - `ViewerApi.setCameraPreset(preset, options?)`
4. keep `src/app/useViewerCameraShortcuts.ts` thin:
   - continue resolving the same five numpad bindings
   - change only the command call so these shortcuts pass:
     - `animate: true`
     - `durationMs: 320`
5. widen `Viewer.setCameraPreset(...)` so it can route by option:
   - when animation is not requested:
     - preserve the current `cameraController.setPreset(...)` snap path
   - when animation is requested:
     - map the preset to the same direction truth
     - forward to `cameraController.animateToDirection(...)`
6. keep the preset-direction truth centralized:
   - do not duplicate one preset-to-vector switch in the shortcut hook and another in the viewer if one shared helper or controller seam can own it cleanly
7. keep repeated shortcut presses simple:
   - a new animated preset request should replace any in-flight camera transition instead of queueing multiple moves
   - the current `CameraController.animateToDirection(...)` transition state already points in this direction, so preserve that behavior
8. keep the first cut narrow:
   - only the `Phase 1` standard-view shortcuts opt into animation
   - toolbar buttons and other preset callers should stay unchanged unless they explicitly pass the new option
9. keep the duration fixed in this phase:
   - `320ms`
   - no `ParaSlider` work yet
   - the visible duration control stays in `Phase 2.2`

Required behavior-preservation rules:
- do not change the physical key map from `Phase 1`
- do not widen this cut into `Iso`, projection shortcuts, `Frame Selected`, or `Frame All`
- do not hide the new behavior behind a shortcut-only branch inside `useViewerCameraShortcuts.ts`
- do not silently change every existing `setCameraPreset(...)` caller to animate
- do not couple this phase to toolbar state, persisted prefs, or new UI

Expected result after this phase:
- pressing `Numpad5`, `Numpad2`, `Numpad8`, `Numpad4`, or `Numpad6` in the active viewer animates to `Top`, `Front`, `Back`, `Left`, or `Right` instead of snapping instantly
- the first transition duration is a fixed `320ms`
- the shortcut layer stays thin and the real motion decision lives in the shared preset seam
- other preset callers remain on their current behavior until they explicitly opt into animation later

### Verification Shape

- camera-controller or viewer tests should prove the requested preset path uses `animateToDirection(...)` instead of `snapToDirection(...)`
- shortcut-layer tests should continue to prove the same numpad bindings still fire for the active viewer
- runtime proof should show a repeated shortcut replaces the in-flight transition cleanly instead of stacking queued moves

Verification:
- run:
  - `src/app/viewCommands.test.ts`
  - `src/app/useViewerCameraShortcuts.test.tsx`
  - `src/viewer/Viewer.test.ts`
  - `src/viewer/scene/CameraController.test.ts`
- add or update assertions so they prove:
  - `useViewerCameraShortcuts` still resolves the same five numpad bindings but now passes explicit animation options through `setCameraPresetCommand(...)`
  - `viewCommands` forwards the new preset options to the viewer unchanged
  - `Viewer.setCameraPreset(...)` keeps the snap path when no animation option is passed
  - `Viewer.setCameraPreset(...)` uses `animateToDirection(...)` with `320ms` when animation is requested
  - a second animated preset request replaces the first transition instead of queueing on top of it
- manually smoke-check:
  - focus one viewer pane in a multi-viewport layout
  - press `Numpad5`, `Numpad2`, `Numpad8`, `Numpad4`, and `Numpad6`
  - confirm only the active viewer responds
  - confirm each move animates instead of snapping
  - tap different preset shortcuts quickly and confirm the newest request wins cleanly
  - confirm toolbar camera preset buttons, if clicked, still keep their current behavior in this phase unless explicitly widened later

Definition of done:
- the five shipped Camera-7 numpad standard-view shortcuts animate through the shared preset seam
- `320ms` is the fixed first duration
- non-shortcut preset callers are not silently changed
- `Phase 2.2` remains free to add the `ParaSlider` later without needing to undo shortcut-local logic from this phase

## [x] `Camera-7` - Phase 2.2 - `View Toolbar Camera Transition Duration ParaSlider`

### Summary

#### Purpose:
- add one visible duration control in `View Toolbar > Camera` for the standard-view transition timing introduced in `Phase 2.1`

#### Shipped result:
- `src/app/store/uiPrefsStore.ts` now owns one shared `cameraShortcutTransitionDurationMs` preference with a clamped setter and a default of `320`
- `src/app/components/ViewToolbar.tsx` now renders one `Transition` `ParaSlider` inside `Camera > Projection & Framing`
- `src/app/useViewerCameraShortcuts.ts` now reads that shared value at dispatch time, so the active-viewer `Numpad5` / `Numpad2` / `Numpad8` / `Numpad4` / `Numpad6` transitions no longer depend on a local hard-coded duration

#### Owns:
- one shared duration value for Camera-7 standard-view transitions
- one `ParaSlider` in the `View` toolbar `Camera` section
- the first default value:
  - `320ms`

#### Keeps for later:
- per-shortcut timing
- separate duration controls for zoom-to-object versus standard views
- broader camera feel tuning UI

### Suggestion

- keep the animation behavior itself in `Phase 2.1`
- use this phase only to expose and store the shared duration value
- prefer the same existing toolbar language already used by nearby camera controls:
  - one `ParaSlider`
  - in the `Camera` section
- let the Phase 2.1 animated standard-view path read this shared value once it exists

### Recommended First Cut

- render one `ParaSlider` under `View Toolbar > Camera`
- initialize it to `320ms`
- changing the slider updates the shared animated-preset duration used by standard-view shortcut transitions
- keep the first scope narrow:
  - it controls standard-view transitions only
  - it does not need to retune every other camera move in the app yet

### Questions / Decisions

#### [x] Question 1 - Where should the duration control live?

##### Suggested answer
- in the `View` toolbar under `Camera`, as one `ParaSlider`, with `320ms` as the initial default

##### Why
- the current toolbar already uses `ParaSlider` for nearby camera controls, so the control language already matches
- exposing the value in `Camera` makes the timing discoverable and adjustable without turning the shortcut map itself into settings UI
- one shared toolbar-owned duration is cleaner than baking a permanent number into the shortcut hook

#### [x] Question 2 - Where should the shared duration value live?

##### Suggested answer
- in a dedicated shared `useUiPrefsStore` scalar field, not in `ViewSettings` and not in `WorkspaceViewportLocalViewState`

##### Why
- this value is a UI-owned shortcut preference, not part of the truthful camera pose or rendering state
- `ViewSettings` currently holds viewer-facing rendering and scene-view settings such as projection, lighting, and materials, so mixing shortcut timing into that type would widen the model awkwardly
- `WorkspaceViewportLocalViewState` is currently for viewport chrome and a small set of local view toggles, and widening it here would pull `Phase 2.2` into workspace persistence and per-viewport behavior decisions the user has not asked for
- `useUiPrefsStore` already owns nearby shared scalar controls such as the sketch-plane toolbar values, so the store pattern is already proven

#### [x] Question 3 - Should the first cut persist as viewport-local workspace state?

##### Suggested answer
- no, keep the first cut as one shared runtime preference

##### Why
- the request is for one `ParaSlider` under `View Toolbar > Camera`, not separate per-viewport tuning
- one shared value keeps `Phase 2.2` aligned with the existing Camera-7 shortcut behavior, which is already one shared shortcut family
- this keeps the pass smaller and leaves room for a later persistence or per-viewport decision only if the user actually wants it

### Implementation Spec

Recommended file changes:
- edit `src/app/store/uiPrefsStore.ts`
- edit `src/app/components/ViewToolbar.tsx`
- edit `src/app/useViewerCameraShortcuts.ts`
- update focused tests in:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/app/useViewerCameraShortcuts.test.tsx`

Current seam read:
- `src/app/components/ViewToolbar.tsx` already renders multiple camera-section `ParaSlider`s and already owns the `Projection & Framing` subsection where this new control should live
- `src/app/store/uiPrefsStore.ts` already owns shared toolbar-style scalar preferences with dedicated clamped setters
- `src/app/useViewerCameraShortcuts.ts` currently hard-codes:
  - `animate: true`
  - `durationMs: 320`
- `Phase 2.1` already widened the shared camera-preset seam, so `Phase 2.2` does not need to touch `viewCommands`, `viewerBridge`, `Viewer`, or `CameraController`

Suggested contract:
- add one dedicated shared preference in `useUiPrefsStore`, for example:
  - `cameraShortcutTransitionDurationMs`
- add one dedicated setter, for example:
  - `setCameraShortcutTransitionDurationMs(...)`
- clamp it in the store so the shortcut hook never has to sanitize raw UI input
- initialize it to:
  - `320`
- have `ViewToolbar.tsx` render one `ParaSlider` in the `Camera` section under `Projection & Framing`
- have `useViewerCameraShortcuts.ts` read the current shared duration from `useUiPrefsStore.getState()` when dispatching animated preset commands
- keep the explicit animated-preset option shape from `Phase 2.1` unchanged:
  - only the duration source changes from a local constant to the shared pref

Suggested first slider shape:
- label:
  - `Transition`
- value format:
  - `320 ms`
- first range:
  - `50` to `2000`
- first step:
  - `10`

Keep out of this phase:
- per-shortcut duration overrides
- workspace serialization changes
- viewport-local duration values
- projection or zoom-to-object duration adoption
- a separate reset button if the existing slider affordance already makes `320` easy to restore

Done shape:
- the `Camera` toolbar renders one transition-duration `ParaSlider`
- that slider initializes to `320ms`
- changing the slider updates one shared UI-pref value
- the active-viewer numpad standard-view shortcuts from `Phase 2.1` use that live shared value instead of the local `320ms` constant
- non-shortcut camera preset callers remain unchanged unless they already opt into the animated preset seam

### Verification Shape

- toolbar proof should show the `Camera` section renders the duration `ParaSlider` under `Projection & Framing` and initializes it to `320ms`
- toolbar interaction proof should show changing that slider updates the shared `useUiPrefsStore` duration value
- shortcut-hook proof should show `Numpad5` / `Numpad2` / `Numpad8` / `Numpad4` / `Numpad6` forward the current shared duration into `setCameraPresetCommand(...)` instead of always forwarding `320`
- regression proof should show other `Phase 2.1` behavior stays intact:
  - still active-viewer-only
  - still animated
  - still uses the same shared animated preset seam

## [x] `Camera-7` - Phase 3.1 - `Shift+Z Entry Into Shared Zoom To Object`

### Summary

#### Purpose:
- add one Camera-7 follow-on where pressing `Shift+Z` enters the existing shared zoom-to-object seam for the current selected object, without widening into animation yet

#### Owns:
- the `Shift+Z` shortcut mapping into zoom-to-object
- reuse of the existing shared selected-object framing seam
- keeping keyboard `Shift+Z` and existing console `Zoom Object` on one honest target-resolution path

#### Keeps for later:
- animated zoom-to-object behavior through the shared seam
- graph-canvas zoom object behavior
- multi-object selection-set framing from the same shortcut
- customization of the `Shift+Z` binding

#### Shipped result:
- `src/app/cameraShortcuts.ts` now maps `Shift+Z` to a dedicated `Zoom Object` camera-shortcut action through `KeyboardEvent.code === 'KeyZ'` plus an exact `shiftKey` requirement
- `src/app/zoomObjectTarget.ts` now owns one shared selected-target zoom resolver used by both:
  - `src/app/useViewerCameraShortcuts.ts`
  - Console `Zoom Object`
- the shared target-resolution order now stays aligned across both entry points:
  - selected part
  - otherwise selected object to first object part
  - otherwise selected reference
  - otherwise no target
- `src/app/useViewerCameraShortcuts.ts` now routes active-viewer `Shift+Z` presses into:
  - `frameSelectedCommand(partKey, viewportId)`
  - or `frameReferenceCommand(referenceId, viewportId)`
- `src/app/viewCommands.ts` now lets shared reference framing target an explicit viewport, so reference zoom stays on the same active-viewer ownership model as the keyboard shortcut
- the old `Numpad .` shortcut is now intentionally dormant, avoiding the NumLock overlap with `Delete` and printable console `.` capture
- the first cut still snaps instead of animating, leaving timing adoption for `Phase 3.2`

### Suggestion

- keep this phase under Camera-7 because it is still a keyboard camera-shortcut follow-on, but do not treat it as a separate object-framing runtime path
- prefer reusing the existing shared framing seam instead of inventing a shortcut-only object-zoom path:
  - current honest object-framing seam already exists around:
    - `frameSelectedCommand(...)`
    - selected object or part truth
- existing console `Zoom Object` already uses that shared seam, so this phase should only add `Shift+Z` as another entry path into the same owner
- keep the shortcut resolution explicit and physical-key-scoped:
  - `KeyboardEvent.code === 'KeyZ'`
  - `event.shiftKey === true`
- if no eligible object is selected:
  - do nothing silently or return an honest no-target response through the existing command surface
  - do not guess a fallback target in the first cut

### Recommended First Cut

- add one new Camera-7 shortcut:
  - `Shift+Z`
    - `Zoom To Object` through the existing shared framing seam
- first target rule:
  - use the current selected object or selected part truth only
- first motion rule:
  - keep the existing snap behavior in this phase if that keeps the target-resolution seam narrow and honest
- keep the first cut narrow:
  - do not widen into `Frame All`
  - do not widen into selection-set heuristics
  - do not widen into graph-surface behavior
  - do not fork console `Zoom Object` onto a different target-resolution path

### Questions / Decisions

#### [x] Question 1 - Which target should `Shift+Z` use first?

##### Suggested answer
- the current selected object or selected part only

##### Why
- this matches the user's ask most directly
- the current app already has shared selection truth that camera framing commands can read
- it avoids ambiguous fallback behavior in the first cut

#### [x] Question 2 - Should `Shift+Z` get its own zoom-to-object owner, or reuse the existing console/shared framing path?

##### Suggested answer
- reuse the existing shared framing path and add `Shift+Z` as one more entry surface into it

##### Why
- console `Zoom Object` already exists and should not drift onto a different implementation seam
- it keeps target resolution and fallback behavior honest across keyboard and console entry points
- it avoids turning the first numpad-decimal cut into a second hidden framing system

#### [x] Question 3 - Does `Phase 3.1` need a viewport-aware reference framing seam?

##### Suggested answer
- yes, if `Shift+Z` is allowed to zoom a selected reference, widen `frameReferenceCommand(...)` so the keyboard path can target the active viewer viewport explicitly

##### Why
- `frameSelectedCommand(...)` already accepts an optional `viewportId`, but `frameReferenceCommand(...)` still routes only through the global active viewer
- `Phase 3.1` is explicitly an active-viewer shortcut phase, so reference zoom should stay on that same active-viewport ownership model
- this keeps object-part and reference zoom honest under one keyboard path instead of leaving reference zoom on a hidden global fallback

### Implementation Spec

Recommended file changes:
- edit `src/app/cameraShortcuts.ts`
- edit `src/app/useViewerCameraShortcuts.ts`
- edit `src/app/viewCommands.ts`
- likely extract or add one shared selected-target zoom resolver from the existing Console logic, then update the current Console owner to reuse it
- update focused tests in:
  - `src/app/cameraShortcuts.test.ts`
  - `src/app/useViewerCameraShortcuts.test.tsx`
  - `src/app/viewCommands.test.ts`
  - one focused test for the shared zoom-target resolver if it gets extracted

Current seam read:
- `src/app/cameraShortcuts.ts` currently only resolves:
  - `Top`
  - `Front`
  - `Back`
  - `Left`
  - `Right`
- `src/app/useViewerCameraShortcuts.ts` already owns the active-viewer keyboard listener and is the correct narrow place to add the new `Shift+Z` entry handling
- Console `Zoom Object` and `Shift+Z` now resolve one honest shared target path through `src/app/zoomObjectTarget.ts`:
  - selected part if present
  - otherwise selected object to first object part
  - otherwise selected reference
  - otherwise warn
- `src/app/viewCommands.ts` already exposes:
  - `frameSelectedCommand(partKey, viewportId?)`
  - `frameReferenceCommand(referenceId, viewportId?)`
- `Viewer.frameSelected(...)` and `Viewer.frameReference(...)` still snap in this phase, which is correct for the first non-animated cut

Suggested contract:
- add one new camera shortcut action for:
  - `Shift+Z`
    - `Zoom Object`
- keep it exact through:
  - `KeyboardEvent.code === 'KeyZ'`
  - `event.shiftKey === true`
- resolve the zoom target through one shared helper or utility that both:
  - `useViewerCameraShortcuts.ts`
  - existing Console `Zoom Object`
  can call
- the first target-resolution order should stay aligned with the current Console behavior:
  - selected part
  - otherwise selected object to first object part
  - otherwise selected reference
  - otherwise no target
- route the resolved target into the existing shared framing seam:
  - part target -> `frameSelectedCommand(partKey, viewportId)`
  - reference target -> `frameReferenceCommand(referenceId, viewportId)` after widening that command signature
- if no eligible target exists:
  - do nothing in the keyboard path
  - do not call `frameAll()`
  - do not invent a keyboard-only fallback

Keep out of this phase:
- animated zoom-to-object behavior
- reuse of the `Transition` slider from `Phase 2.2`
- multi-object selection-set zoom from `Shift+Z`
- graph-canvas zoom object behavior
- any broader Console zoom redesign beyond reusing the same target resolver

Done shape:
- `Shift+Z` resolves only for the active viewer and only with the exact modifier shape
- it reuses the same target-resolution rules already used by Console `Zoom Object`
- part targets frame through the existing shared selected-part seam
- reference targets frame through a viewport-aware shared reference seam
- no-target keyboard presses stay quiet and do not trigger `Frame All`

### Verification Shape

- shortcut tests should prove `Shift+Z` resolves only for the active viewer
- shortcut-hook tests should prove `Shift+Z` routes into the same selected-object or selected-reference framing seam already used by console `Zoom Object`
- command tests should prove `frameReferenceCommand(...)` can target the active viewer viewport explicitly if widened in this phase
- shared-helper proof should show the same selected-target zoom resolution is used by both keyboard and Console entry points

## [x] `Camera-7` - Phase 3.2 - `Animated Zoom To Object Through Shared Framing Seam`

### Summary

#### Purpose:
- widen the shared zoom-to-object seam so object framing animates instead of snapping, covering both `Shift+Z` and the existing console `Zoom Object` entry path

#### Owns:
- animated zoom-to-object behavior through the shared selected-object framing seam
- reuse of that animated seam by:
  - `Shift+Z`
  - console `Zoom Object`
- reuse of the shared Camera-7 transition duration control

#### Keeps for later:
- graph-canvas object zoom
- selection-set framing heuristics
- separate timing UI just for object zoom

#### Shipped result:
- `src/app/viewCommands.ts` and `src/app/viewerBridge.ts` now let shared selected-object and reference framing opt into explicit animation options instead of always snapping
- `src/app/useViewerCameraShortcuts.ts` now routes active-viewer `Shift+Z` through that animated framing seam using the shared Camera-7 transition duration value from `Phase 2.2`
- Console `Zoom Object` in `src/app/console/useConsoleInteraction.ts` now forwards the same animated framing options instead of staying on a snap-only path
- `src/viewer/Viewer.ts` now forwards those animated framing options into the camera controller for both:
  - selected parts
  - references
- `src/viewer/scene/CameraController.ts` now resolves framed poses and animates object zoom through `animateToPose(...)` instead of forcing immediate frame snaps
- orthographic object zoom now interpolates view height during that transition, so the zoom amount itself animates instead of jumping at the start of the move
- repeated shared object-zoom requests still replace the in-flight transition instead of queueing

### Suggestion

- keep `Phase 3.1` responsible for adding `Shift+Z` into the shared zoom-to-object entry path
- use this phase only to replace the shared selected-object snap with an animated move
- prefer reusing the same shared duration value introduced in `Phase 2.2` so Camera-7 motion timing stays coherent
- still route through the existing shared framing seam instead of inventing a second shortcut-only camera path
- treat console `Zoom Object` as in-scope here because it already uses that same shared framing seam

### Recommended First Cut

- when the shared zoom-to-object seam resolves an eligible selected object:
  - animate to the framed object instead of snapping instantly
- this should automatically cover both:
  - `Shift+Z`
  - console `Zoom Object`
- reuse the same shared `View Toolbar > Camera` duration control from `Phase 2.2`
- keep `320ms` as the default unless the user changes that shared slider

### Questions / Decisions

#### [x] Question 1 - Should console `Zoom Object` animate too, or should animation stay keyboard-only?

##### Suggested answer
- console `Zoom Object` should animate too through the same shared framing seam

##### Why
- console already uses the same selected-object framing owner, so keeping animation keyboard-only would create an artificial behavior split
- the user's desired zoom-to-object behavior reads better as one shared camera capability than as a numpad-only exception
- it keeps the later duration control coherent across all object-zoom entry points

#### [x] Question 2 - Should shared zoom-to-object animation reuse the same duration control as standard-view transitions?

##### Suggested answer
- yes, reuse the same shared `View Toolbar > Camera` duration `ParaSlider`

##### Why
- it keeps Camera-7 animation timing coherent across standard-view transitions and zoom-to-object
- it avoids creating a second tiny timing control for one closely related camera motion family

### Verification Shape

- runtime proof should show both `Shift+Z` and console `Zoom Object` animate through the same shared framing seam instead of snapping
- toolbar proof should show the same shared duration control affects that shared zoom-to-object path too

### Implementation Spec

Recommended file changes:
- edit `src/app/viewCommands.ts`
- edit `src/app/viewerBridge.ts` if the shared bridge contract needs widened framing options
- edit `src/viewer/Viewer.ts`
- edit `src/viewer/scene/CameraController.ts`
- likely touch `src/app/useViewerCameraShortcuts.ts` only if the animated framing options need explicit forwarding from the keyboard entry path
- likely touch `src/app/console/useConsoleInteraction.ts` only if the console framing calls need explicit animated options at dispatch time
- update focused tests in:
  - `src/app/useViewerCameraShortcuts.test.tsx`
  - `src/app/viewCommands.test.ts`
  - `src/viewer/Viewer.test.ts`
  - `src/viewer/scene/CameraController.test.ts`
  - one focused console proof if the console path now forwards animation options explicitly

Current seam read:
- `src/app/zoomObjectTarget.ts` already gives both keyboard and console one shared target-resolution order
- `src/app/useViewerCameraShortcuts.ts` already routes `Shift+Z` into the shared framing seam:
  - part target -> `frameSelectedCommand(partKey, viewportId, options)`
  - reference target -> `frameReferenceCommand(referenceId, viewportId, options)`
- Console `Zoom Object` already uses the same shared target resolver and the same framing command seam
- `src/app/viewCommands.ts`, `src/viewer/Viewer.ts`, and `src/viewer/scene/CameraController.ts` now carry the animated framing options through the shared zoom-to-object seam
- `src/app/store/uiPrefsStore.ts` already owns the shared `cameraShortcutTransitionDurationMs` value from `Phase 2.2`
- `src/viewer/scene/CameraController.ts` is the real owner of whether object/reference framing snaps or animates

Suggested contract:
- keep `Phase 3.1` keyboard ownership unchanged:
  - `Shift+Z` remains the active-viewer entry path
- widen the shared framing seam so selected-object framing can opt into animation explicitly instead of always snapping
- the same animated framing contract should be reusable by both:
  - `Shift+Z`
  - Console `Zoom Object`
- prefer one explicit option shape aligned with the existing animated preset contract:
  - `animate: true`
  - `durationMs: number`
- reuse the shared Camera-7 duration value from `useUiPrefsStore`
- if another object-zoom request arrives while a prior object-frame animation is still running:
  - replace the in-flight move with the new one
  - do not queue animations

Keep out of this phase:
- changes to the `Shift+Z` binding itself
- new timing UI beyond the already-shipped `Transition` slider
- graph-canvas `Zoom Object`
- multi-object selection-set heuristics beyond the already-owned shared zoom-to-object rules
- projection animation
- different duration controls for keyboard versus console object zoom

Done shape:
- `Shift+Z` animates object or reference zoom through the shared framing seam instead of snapping
- Console `Zoom Object` animates through that same shared framing seam too
- both entry points reuse the same shared Camera-7 transition-duration value
- repeated object zoom requests replace the in-flight animation instead of stacking
- no-target `Shift+Z` still stays quiet

### Focused Verification Shape

- shortcut-hook proof should show `Shift+Z` now forwards animated framing through the same shared zoom-to-object seam instead of the snap path
- console proof should show Console `Zoom Object` uses the same animated framing seam instead of keeping snap-only behavior
- command proof should show the shared framing commands can carry explicit animation options without changing unrelated callers
- viewer or controller proof should show object or reference framing honors:
  - `animate: true`
  - the shared duration value
  - replacement of any in-flight object-frame animation

## [ ] `Camera-7` - Phase 4.1 - `Projection Shortcut Restoration`

### Summary

#### Purpose:
- restore the older projection keyboard path so the active viewer can switch projection modes through `Shift+P` and `Shift+O` again without widening into a full projection-keybinding system

#### Owns:
- `Shift+P`
  - `Perspective`
- `Shift+O`
  - `Orthographic`
- active-viewer-only routing for those projection shortcuts
- reuse of the shared projection command seam instead of inventing a second viewer-local projection path

#### Keeps for later:
- additional projection shortcuts beyond `Perspective` and `Orthographic`
- user-remappable projection keybindings
- projection-mode animation
- any toolbar or console redesign around projection

### Suggestion

- keep the shipped Camera-7 numpad standard-view bindings untouched
- add this as one separate shortcut lane because these are projection toggles, not camera-preset direction changes
- prefer routing through the existing shared projection seam:
  - shortcut resolution
  - `setProjectionModeCommand(...)`
  - existing viewer or workspace projection ownership
- keep the same active-viewer ownership model already used by the Camera-7 shortcut path
- keep the restored bindings explicit and narrow:
  - `Shift+P`
    - `Perspective`
  - `Shift+O`
    - `Orthographic`

### Recommended First Cut

- restore exactly two projection shortcuts:
  - `Shift+P`
    - `Perspective`
  - `Shift+O`
    - `Orthographic`
- keep them active-viewer-only just like the current Camera-7 standard-view shortcut surface
- do not widen this cut into `Iso`, framing, or additional letter shortcuts
- do not make this phase depend on the Camera-7 animation ladder because projection switching is a separate behavior seam

### Questions / Decisions

#### [x] Question 1 - Should these restored projection shortcuts live inside the same Camera-7 shortcut routing surface?

##### Suggested answer
- yes, but as a separate action branch from the camera-preset direction shortcuts

##### Why
- they still belong to the same active-viewer keyboard ownership surface
- they should reuse the existing shared routing and active-viewer gating instead of reintroducing a second ad hoc projection shortcut listener
- they route to a different command seam than the directional preset actions, so the action types should stay honest

#### [x] Question 2 - Should `Shift+P` / `Shift+O` be restored exactly, or remapped to something new?

##### Suggested answer
- restore them exactly as `Shift+P` = `Perspective` and `Shift+O` = `Orthographic`

##### Why
- that is the stated ask
- it keeps this phase small and avoids turning the restoration into a naming or keybinding redesign pass

### Verification Shape

- shortcut tests should prove `Shift+P` resolves to `Perspective` and `Shift+O` resolves to `Orthographic`
- routing tests should prove those shortcuts still require the active viewer surface
- command tests should prove they route through the shared `setProjectionModeCommand(...)` seam instead of a viewer-local projection branch

## [ ] `Camera-7` - Phase 4.2 - `Console Projection Parity With Projection Shortcuts`

### Summary

#### Purpose:
- consolidate and fix the Console `Camera > Projection` area so its `Perspective` and `Orthographic` actions change the same active viewer camera projection through the same shared path as `Shift+P` and `Shift+O`

#### Owns:
- Console `Camera > Projection > Perspective`
- Console `Camera > Projection > Orthographic`
- parity between Console projection actions and restored projection shortcuts
- one shared active-viewer projection path instead of separate shortcut and Console behavior seams

#### Keeps for later:
- broader Console camera menu redesign
- additional projection options beyond `Perspective` and `Orthographic`
- projection animation
- toolbar projection redesign

### Suggestion

- treat this as a parity and consolidation pass, not a Console UX redesign
- keep the visible Console `Camera > Projection` shape if it already reads well enough
- fix ownership underneath it so both surfaces converge on the same shared projection action path:
  - `Shift+P` / `Shift+O`
  - Console `Camera > Projection`
  - shared `setProjectionModeCommand(...)`
  - same active-viewer routing and projection owner
- avoid leaving Console projection on a separate local branch because that invites drift between keyboard and Console behavior

### Recommended First Cut

- keep the Console projection menu structure intact
- make only two Console actions part of this parity pass:
  - `Perspective`
  - `Orthographic`
- ensure selecting either Console action changes the same active viewer camera projection that the restored `Shift+P` / `Shift+O` shortcuts would change
- do not widen this cut into extra projection entries, Console copy cleanup, or broader staged-navigation redesign

### Questions / Decisions

#### [x] Question 1 - Should the Console projection actions keep their own execution path?

##### Suggested answer
- no, they should converge on the same shared active-viewer projection path as the restored shortcuts

##### Why
- projection mode should not behave differently depending on whether the user used the keyboard or the Console
- one shared path is easier to test, easier to reason about, and less likely to drift

#### [x] Question 2 - Should this subphase redesign the Console `Camera > Projection` UI while fixing parity?

##### Suggested answer
- no, keep this pass narrow and fix behavior parity first

##### Why
- the immediate ask is about consistent projection behavior, not Console information architecture
- separating parity from UI redesign keeps the implementation smaller and easier to verify

### Verification Shape

- Console staged-navigation tests should prove `Camera > Projection > Perspective` and `Camera > Projection > Orthographic` still resolve correctly
- command and routing tests should prove Console projection actions and `Shift+P` / `Shift+O` share the same active-viewer projection path
- runtime proof should show the Console projection action changes the same camera projection state as the restored shortcut action

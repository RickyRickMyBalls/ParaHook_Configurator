# Camera Controls Phase Camera-2 - Fusion-Style Model Viewport Camera Baseline

## Doc Header

### Doc History
4. 2026-03-27 19:44: Renamed this live phase record from `5.0H-2` to `Camera-2` so the camera-controls family can start using the simpler `Camera-*` phase names while preserving the older numbering in historical log entries
3. 2026-03-22 20:52: Marked this phase shipped after landing the Fusion-style model-viewport baseline in runtime, moving the phase record from `Future/` to `Shipped/`, and locking the first implementation scope to `MMB` pan, `Shift + MMB` orbit, `MMB` double-click zoom fit to `Viewer.frameAll()`, and the already-shipped sketch-draw camera block staying intact
2. 2026-03-22 20:44: Tightened this phase into a more implementation-ready spec by grounding it in the current camera runtime: `CameraController` still uses the default `OrbitControls` mouse map, `Viewer` already owns `frameAll()` / `frameSelected()` / `frameReference()`, there is no current viewer double-click camera path yet, and `orbitEnabled` still needs to remain a broad camera toggle while the gesture remap lands
1. 2026-03-22 20:42: Created this standalone future phase doc for `[5.0H-2]`, translating the next camera-controls cut into an implementation-ready plan around a Fusion-style model-viewport gesture baseline after the shipped `Sketch Draw` camera block, while keeping graph-canvas coexistence, camera console commands, and the later shared input-owner model out of scope

### Purpose

This doc defines the second implementation cut under the camera-controls family.

Use it to answer:
- what `[Camera-2]` should change in the model viewport
- which gestures become canonical in this phase
- which files are the first safe seams
- how to keep this cut narrow enough to land before `[Camera-3]`

### Why This Phase Exists

The shipped `[Camera-1]` cut proved that the viewer can selectively stop camera ownership from stealing `Sketch Draw` interactions.

The next problem is that the model viewport still lacks one clear canonical camera baseline:
- wheel zoom should follow the mouse more consistently
- `MMB` drag should be the standard pan gesture
- `Shift + MMB` drag should be the standard orbit gesture
- `MMB` double-click should provide one predictable zoom-fit behavior

This phase exists to lock those model-viewport gestures into one stable baseline before graph-canvas coexistence, camera console commands, and the later shared owner model add more complexity.

### Scope

This phase covers:
- the canonical gesture map for the 3D model viewport
- wheel zoom behavior in the model viewport
- `MMB` pan behavior in the model viewport
- `Shift + MMB` orbit behavior in the model viewport
- `MMB` double-click zoom-fit behavior in the model viewport

This phase does not cover:
- graph-canvas versus model-viewport coexistence rules
- `Ctrl` pass-through from the `Spaghetti Editor` canvas
- camera console commands
- shared gizmo/input-owner arbitration
- final keybinding customization UI

## Doc Body

## [x] - `[Camera-2]` - `Fusion-Style Model Viewport Camera Baseline`

### Header

Purpose:
- lock the model viewport onto one clear Fusion-style gesture baseline without widening into cross-surface routing or console work

Owns:
- wheel zoom in the model viewport
- `MMB` pan in the model viewport
- `Shift + MMB` orbit in the model viewport
- `MMB` double-click zoom-fit in the model viewport

Keeps for later phases:
- graph-canvas coexistence under `[Camera-3]`
- camera console commands under `[Camera-4]`
- shared gizmo/input-owner cleanup under `[Camera-5]`

### Target Result

- the model viewport has one explicit Fusion-style camera gesture map
- wheel zoom remains available and feels consistent with the current camera target
- `MMB` drag pans instead of relying on the older left-button orbit feel
- `Shift + MMB` drag becomes the explicit orbit gesture
- `MMB` double-click frames one predictable target without colliding with authoring ownership

### Current Seam Read

- `src/viewer/scene/CameraController.ts` already owns `OrbitControls`, so it is the main seam for changing the viewport gesture baseline
- `src/viewer/scene/CameraController.ts` still uses the default `OrbitControls` mouse map in practice:
  - `LEFT = ROTATE`
  - `MIDDLE = DOLLY`
  - `RIGHT = PAN`
- `src/viewer/Viewer.ts` already owns higher-level framing operations like `frameAll()`, `frameSelected()`, and `frameReference()`, so it is the right home for the first `MMB` double-click zoom-fit target rule
- there is no current viewer-level double-click camera handler yet, so this phase must add one explicitly instead of assuming it already exists
- `src/shared/viewSettingsTypes.ts` and `src/app/components/ViewToolbar.tsx` currently still expose `orbitEnabled`, so this phase should preserve that general on/off camera toggle while changing the underlying model-viewport mouse map
- the shipped `[Camera-1]` block already removed the most urgent `Sketch Draw` conflict, so this phase can stay focused on the default 3D viewport gesture baseline itself

### Questions / Decisions

#### [x] - `q1` What exact gesture map should become canonical in this phase?

##### Suggestion
- wheel = zoom
- `MMB` drag = pan
- `Shift + MMB` drag = orbit
- `MMB` double-click = zoom fit
- remap the underlying `OrbitControls` mouse buttons so the default viewport path no longer keeps the old `LEFT = ROTATE / MIDDLE = DOLLY / RIGHT = PAN` baseline active beneath the new behavior
- do not leave multiple competing orbit gestures active in the default model viewport path once this phase lands

#### [x] - `q2` Should this phase change the graph canvas too?

##### Suggestion
- no
- keep this phase model-viewport-only
- leave graph-canvas coexistence and any `Ctrl` pass-through rules to `[Camera-3]`

#### [x] - `q3` What is the first `MMB` double-click zoom-fit target?

##### Suggestion
- use visible model content as the first default zoom-fit target
- route that first cut to `Viewer.frameAll()`
- if there is later a stronger selected/active-target rule, add that in a follow-on cut instead of overloading this phase

#### [x] - `q4` Should `orbitEnabled` stay as a general camera toggle?

##### Suggestion
- yes
- keep `orbitEnabled` as the broad camera-enabled state for now
- change the underlying gesture map, but do not redesign the surrounding settings contract in this phase

### Implementation Spec

Recommended file changes:
- edit `src/viewer/scene/CameraController.ts`
- edit `src/viewer/Viewer.ts`
- edit `src/viewer/scene/CameraController.test.ts`
- optional only if a settings/UI test fails because it assumed the older baseline:
  - edit `src/app/components/ViewToolbar.test.tsx`
- no CSS changes planned

Implementation steps:
1. update the `OrbitControls` mouse-button mapping in `CameraController` to the new baseline:
   - `LEFT` stays non-canonical and must not become default orbit again
   - `MIDDLE` no longer uses the old dolly ownership
   - the canonical result is `MMB` pan and modified `MMB` orbit
2. add one narrow `CameraController` seam for the new modified-orbit gesture so temporary orbit matches `Shift + MMB` instead of the old left-button assumption
3. update `Viewer` to start, update, and end temporary orbit only from the intended modified gesture path for the model viewport
4. add an explicit viewer-level `MMB` double-click path that routes to `frameAll()` for the first zoom-fit target
5. keep the shipped `Sketch Draw` camera block from `[Camera-1]` intact
6. leave graph-canvas routing and console commands unchanged

Required behavior-preservation rules:
- do not widen into graph-canvas input routing
- do not change the `Sketch Draw` ownership block from `[Camera-1]`
- do not add camera console commands here
- do not redesign the view-settings schema beyond what is required for the new baseline
- treat the model viewport as the only surface that changes in this phase

Expected result after this phase:
- the model viewport uses one clear Fusion-style gesture baseline
- the shipped sketch authoring behavior from `[Camera-1]` remains intact
- the graph canvas remains unchanged and can be handled separately in `[Camera-3]`
- later camera-console and shared-owner work can build on a stable viewport baseline instead of moving target gestures

Verification:
- run:
  - `src/viewer/scene/CameraController.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/components/ViewportOverlay.test.tsx`
- manually smoke-check:
  - wheel zoom in the model viewport
  - `MMB` drag pan
  - `Shift + MMB` drag orbit
  - `MMB` double-click zoom fit to visible model content
  - `Sketch Draw` still keeps `LMB` ownership while open
  - outside `Sketch Draw`, the new model-viewport camera baseline behaves consistently
- run a production build if the repo is otherwise buildable, and record unrelated pre-existing failures separately instead of widening this phase

Definition of done:
- the model viewport has the new Fusion-style gesture baseline
- `Sketch Draw` still blocks camera `LMB` ownership as shipped in `[Camera-1]`
- graph-canvas behavior is unchanged
- the cut lands without silently absorbing `[Camera-3]`, `[Camera-4]`, or `[Camera-5]`

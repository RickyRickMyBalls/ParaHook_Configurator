# Camera Controls Phase Camera-1 - Sketch Draw Camera Blocking

## Doc Header

### Doc History
4. 2026-03-27 19:44: Renamed this live phase record from `5.0H-1` to `Camera-1` so the camera-controls family can start phasing out the older mixed numbering system without rewriting the earlier historical log entries
3. 2026-03-22 20:27: Marked this phase complete after shipping the first sketch-camera ownership block by disabling the viewer's left-button orbit claim while `Sketch Draw` is open, suppressing temporary orbit-drag requests through the same block, and keeping the broader wheel/`MMB` camera remap deferred to `[5.0H-2]`
2. 2026-03-22 14:56: Tightened this phase into a more implementation-ready spec by replacing the earlier generic seam guesses with the current concrete runtime path: `ViewerHost` already feeds sketch state into the viewer, `Viewer` owns the blocking decision, `CameraController` owns the `OrbitControls` left-button claim, and the temporary orbit bridge in `viewerBridge.ts` must also be ignored while `Sketch Draw` is open
1. 2026-03-22 14:56: Created this standalone future phase doc for `[5.0H-1]`, translating the first camera-controls cut into an implementation-ready plan around stopping camera ownership from stealing `Sketch Draw` left-click and drag interactions while keeping the change narrow enough to land before the broader viewport-gesture baseline work

### Purpose

This doc defines the first implementation cut under the camera-controls family.

Use it to answer:
- what `[Camera-1]` should fix first
- which interactions must stop being camera-owned
- which files are the first safe seams
- how to keep this cut narrow enough to land before `[Camera-2]`

### Why This Phase Exists

The current viewport input path is still too camera-first for honest CAD-style sketch authoring.

The immediate blocker is `Sketch Draw`:
- active draw tools need plain `LMB` to place points
- idle `Sketch Draw` needs plain `LMB` click to select entities
- idle `Sketch Draw` needs plain `LMB` drag to create blue `Window` and green `Crossing` selection boxes

But orbit/navigation behavior is still stealing too much of that plain viewport press/drag path, which makes the shipped `DS-3` selection behavior hard to test and weakens the whole sketch authoring flow.

This phase exists to fix that ownership conflict first because it is the smallest high-value cut in the camera-controls family and it unblocks honest testing of the already-shipped sketch selection work.

### Scope

This phase covers:
- preventing camera orbit/navigation from owning plain `LMB` press/drag while `Sketch Draw` is open
- making active `Sketch Draw` tool clicks and drags win over camera behavior
- making idle `Sketch Draw` click selection and box selection win over camera behavior
- keeping the change narrow and local to the `Sketch Draw` versus camera conflict

This phase does not cover:
- the full Fusion-style camera-gesture remap for the model viewport
- graph-canvas versus model-viewport coexistence rules
- camera console commands
- gizmo ownership model
- final camera feel tuning or keybinding customization

## Doc Body

## [x] - `[Camera-1]` - `Sketch Draw Camera Blocking`

### Header

Purpose:
- stop camera behavior from stealing the plain `LMB` interactions that belong to `Sketch Draw`

Owns:
- `Sketch Draw` versus camera input priority
- active-tool click ownership in the viewport
- idle `Sketch Draw` click selection ownership
- idle `Sketch Draw` box-selection drag ownership

Keeps for later phases:
- full model-viewport gesture remap under `[Camera-2]`
- graph-canvas coexistence under `[Camera-3]`
- camera console commands under `[Camera-4]`
- shared gizmo/input-owner cleanup under `[Camera-5]`

### Target Result

- while `Sketch Draw` is open, plain `LMB` in the model viewport belongs to sketch interaction instead of camera navigation
- active sketch tools keep full ownership of their click/drag path
- idle `Sketch Draw` can reliably do single-click entity selection plus `Window` / `Crossing` drag selection
- camera navigation still remains available through non-conflicting paths that already exist or are left intact during this cut

### Shipped Result

- `src/viewer/scene/CameraController.ts` now exposes a narrow left-button ownership seam so `OrbitControls` can stop claiming `LMB` without changing wheel zoom or the broader controller contract.
- `src/viewer/Viewer.ts` now derives a `Sketch Draw` camera block from the live geometry-sketch overlay, applies it to the camera controller, and ignores temporary orbit-drag requests while the sketch session is open.
- `src/viewer/scene/CameraController.test.ts` now covers disabling and restoring left-button orbit ownership without disturbing the other mouse-button bindings.

### Current Seam Read

- `src/app/components/ViewerHost.tsx` already builds the geometry-sketch viewer VM and passes `mode`, `drawStage`, `activeTool`, and `selectionWindowDraft` into the viewer overlay state
- `src/viewer/Viewer.ts` already owns the model-viewport runtime seam and is the right place to derive a simple `Sketch Draw camera blocked` state from the current geometry-sketch overlay/session
- `src/viewer/scene/CameraController.ts` currently owns `OrbitControls` on the viewer DOM element, which means the left mouse button is still being claimed through the controller unless we explicitly disable that path
- `src/app/viewerBridge.ts` still exposes the temporary orbit drag path, so the first cut must also ensure those bridge calls do nothing while `Sketch Draw` is open
- the already-landed `Sketch Draw` entity selection path depends on uninterrupted viewport `LMB` click and drag ownership, so the cleanest first cut is:
  - derive the block in `Viewer`
  - apply it to `CameraController`
  - suppress temporary orbit drag while blocked

### Questions / Decisions

#### [x] - `q1` What is the first blocking rule?

##### Suggestion
- when the geometry-sketch viewer overlay/session is in `draw`, plain viewport `LMB` should no longer start camera orbit/navigation
- do not wait for the full camera remap to fix this
- make `Sketch Draw` ownership explicit first, even if the broader camera baseline still lands in `[Camera-2]`

#### [x] - `q2` Should this phase change wheel / `MMB` behavior too?

##### Suggestion
- no
- keep this phase narrow to plain `LMB` ownership blocking only
- leave wheel zoom, pan, orbit-gesture remap, and `MMB` policy for `[Camera-2]`

#### [x] - `q3` Should the block apply only to active draw tools, or to idle `Sketch Draw` too?

##### Suggestion
- apply it to all of `Sketch Draw`, including idle draw
- idle `Sketch Draw` still needs plain `LMB` for click selection and box selection
- if the block only applies to active tools, `DS-3` remains unreliable

#### [x] - `q4` Where should the first ownership gate live?

##### Suggestion
- put the first ownership gate in the viewer runtime seam, not in scattered higher-level UI callers
- derive the blocking condition from the geometry-sketch overlay/session state that `ViewerHost` already feeds into `Viewer`
- let `Viewer` tell `CameraController` not to allow left-button orbit ownership and ignore temporary orbit-drag requests while blocked

### Implementation Spec

Recommended file changes:
- edit `src/viewer/Viewer.ts`
- edit `src/viewer/scene/CameraController.ts`
- edit `src/app/viewerBridge.ts` only if the bridge itself needs an explicit guard helper or clearer API contract
- no `ViewerHost.tsx` changes expected unless one tiny extra viewer-VM field is truly required
- no CSS changes planned

Implementation steps:
1. add one viewer-side derived flag for whether camera ownership should be blocked because the geometry-sketch overlay/session is in `draw`
2. add a narrow `CameraController` seam to disable left-button orbit ownership while leaving the rest of the controller intact
3. have `Viewer` apply that controller setting whenever the geometry-sketch overlay/session changes
4. make `Viewer.beginTemporaryOrbitDrag`, `updateTemporaryOrbitDrag`, and `endTemporaryOrbitDrag` no-op while the sketch-draw camera block is active
5. preserve the existing `Sketch Draw` tool click path for active draw tools
6. preserve the existing idle `Sketch Draw` click-selection path
7. preserve the existing idle `Sketch Draw` drag-selection path for blue `Window` and green `Crossing`
8. keep wheel, `MMB`, and broader camera gesture remap behavior unchanged in this phase
9. keep the implementation narrow enough that `[Camera-2]` can still own the broader Fusion-style camera-baseline remap cleanly later

Required behavior-preservation rules:
- do not redesign the full viewer control scheme in this phase
- do not widen into graph-canvas input routing
- do not add camera console commands here
- do not redesign the sketch session model
- do not repurpose `orbitEnabled` into a sketch-specific state toggle
- treat the current shipped `Sketch Draw` tool and selection behavior as canonical and unblock it

Expected result after this phase:
- opening `Sketch Draw` makes viewport plain `LMB` safe for sketch ownership by removing the camera's left-button claim
- active sketch tools can place points without camera interference
- idle `Sketch Draw` can select entities and drag selection windows without camera interference
- broader camera gesture cleanup remains available as a later dedicated phase instead of being partially mixed into this cut

Verification:
- run:
  - `src/viewer/scene/CameraController.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/viewer/geometrySketchOverlay.test.ts`
  - `src/app/components/ViewportOverlay.test.tsx`
- manually smoke-check:
  - open `Sketch Draw`
  - arm `Line`, `Rectangle`, and `Circle`, and confirm viewport `LMB` places points instead of starting camera behavior
  - return to idle `Sketch Draw` and confirm single-click entity selection works
  - drag right and drag left in idle `Sketch Draw` and confirm `Crossing` / `Window` selection works
  - confirm temporary orbit drag requests do nothing while `Sketch Draw` is open
  - confirm that outside `Sketch Draw`, existing camera behavior still works as before
- run a production build if the repo is otherwise buildable, and record unrelated pre-existing failures separately instead of widening this phase

Definition of done:
- plain viewport `LMB` is no longer camera-owned while `Sketch Draw` is open
- the temporary orbit bridge path no longer bypasses that block while `Sketch Draw` is open
- active and idle `Sketch Draw` interactions can both claim the viewport press/drag path they need
- the cut lands without silently folding in the broader Fusion-style camera remap

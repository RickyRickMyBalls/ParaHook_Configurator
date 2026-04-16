# `Camera-7` - `Active Viewer Camera Control Shortcuts`

## Doc Header

### Doc History
2. 2026-04-16: Added the planned `Camera-7 / Phase 2 - Animated Standard View Transitions` follow-on, grounding the suggestion in the existing `CameraController.animateToDirection(...)` seam so the current numpad view shortcuts can animate to `Top` / `Front` / `Back` / `Left` / `Right` without inventing a shortcut-only camera path
1. 2026-04-16: Created this standalone shipped record for `Camera-7`, grounding the first active-viewer camera shortcut pass in shared keyboard routing, viewer-host installation, a centralized numpad shortcut map, and the widened `Back` camera preset seam

### Purpose

This doc records the shipped `Camera-7 / Phase 1` shortcut cut and the planned `Phase 2` animation follow-on under the camera-controls family.

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

## [ ] `Camera-7` - Phase 2 - `Animated Standard View Transitions`

### Summary

#### Purpose:
- change the current standard-view shortcut result from an instant snap into a smooth camera transition while preserving the same active-viewer numpad bindings from `Phase 1`

#### Owns:
- animated transition behavior for:
  - `Top`
  - `Front`
  - `Back`
  - `Left`
  - `Right`
- the shared seam choice for how a camera preset can request animation instead of snapping
- first duration or feel recommendation for that transition

#### Keeps for later:
- projection-mode animation
- `Iso`
- `Frame Selected`
- `Frame All`
- user-tunable camera-transition duration UI
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
- keep the first duration modest:
  - suggestion: stay on the existing `320ms` default first
  - if the first pass feels heavy, the next likely safer reduction is around `240ms`
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

### Verification Shape

- camera-controller or viewer tests should prove the requested preset path uses `animateToDirection(...)` instead of `snapToDirection(...)`
- shortcut-layer tests should continue to prove the same numpad bindings still fire for the active viewer
- runtime proof should show a repeated shortcut replaces the in-flight transition cleanly instead of stacking queued moves

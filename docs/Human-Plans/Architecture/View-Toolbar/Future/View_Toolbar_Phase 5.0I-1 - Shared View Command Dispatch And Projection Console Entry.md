# View Toolbar Phase 5.0I-1 - Shared View Command Dispatch And Projection Console Entry

## Doc Header

### Doc History
1. 2026-03-23 14:07: Created this standalone future phase doc for `[5.0I-1]`, translating the first `View-Toolbar` implementation cut into an implementation-ready plan centered on the shared console/toolbar projection seam and the first real `Orthographic` versus `Perspective` command path
2. 2026-03-23 14:35: Tightened this doc into an implementation-ready Phase 1 spec that matches the shipped projection seam, shared `ViewSettings` ownership, root/scoped console grammar, toolbar surface, viewer/controller architecture, and required verification

### Purpose

This doc locks the first implementation cut under the `View-Toolbar` family.

Use it to answer:
- what `[5.0I-1]` actually ships
- how projection mode is owned and persisted
- how console and toolbar both route through one projection seam
- which viewer/controller rules must hold for a real orthographic mode
- how this phase is verified

### Why This Phase Exists

The `View-Toolbar` family needs a small but honest first vertical slice.

This phase exists to land:
- a real `Perspective` / `Orthographic` seam
- one shared persisted projection setting
- one root console family
- one `Sketch Draw`-local camera branch
- the smallest visible toolbar proof that console and toolbar both drive the same seam

This phase stays narrow on purpose:
- no `ParaSelect`
- no user-facing `FOV` editor
- no grid/background/helper work

### Scope

This phase covers:
- shared `projectionMode` state in `ViewSettings`
- real perspective versus orthographic switching in the viewer
- root console commands:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
- `Sketch Draw` feature-assist camera branch:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
- local `O` / `P` aliases inside the final `Projection` choice step
- minimal `ViewToolbar` projection buttons

This phase does not cover:
- `ParaSelect`
- user-facing `FOV` controls
- grid controls
- background/environment controls
- orientation gizmo tuning
- broader camera-feel controls like inertia/decay/spin

## Doc Body

## [x] - `[5.0I-1]` - `Shared View Command Dispatch And Projection Console Entry`

### Header

Purpose:
- ship the first real `View-Toolbar` command family by making projection mode reachable through one shared seam from both toolbar and console

Owns:
- `projectionMode` as shared persisted view state
- `Camera > Projection > Orthographic`
- `Camera > Projection > Perspective`
- local aliases `O` and `P` inside the `Projection` choice step
- scoped reuse inside `Sketch Draw` feature assist
- a real viewer-side orthographic camera implementation

Keeps for later phases:
- `ParaSelect`
- user-facing `FOV`
- grid/background/helper settings
- broader camera-feel tuning

### Target Result

- the app has one real projection command family instead of only doc intent
- projection mode is persisted in shared `ViewSettings`
- the root console can switch between `Perspective` and `Orthographic`
- `Sketch Draw` can reach the same projection family through feature assist
- the visible `ViewToolbar` exposes the same projection seam without a second bespoke implementation path
- `Orthographic` means a real orthographic camera, not reduced-perspective `FOV`

### Public Interfaces And State

Phase 1 owns these shared interfaces:

- `ViewSettings.projectionMode: 'perspective' | 'orthographic'`
- `DEFAULT_VIEW_SETTINGS.projectionMode = 'perspective'`
- `ViewerApi.setProjectionMode(mode: 'perspective' | 'orthographic'): void`
- `CameraPose.projectionMode`
- `CameraPose.perspectiveFovDeg`
- `CameraPose.orthoViewHeight`

State ownership rule:
- `useUiPrefsStore.view` is the source of truth for projection mode in Phase 1
- `ViewerHost` continues to push view state into the viewer through `applyViewSettings(view)`
- toolbar and console both update shared view state
- toolbar and console do not call private camera logic directly

### Console And Command Model

#### Root Grammar

Phase 1 adds this root staged command family:
- `Camera > Projection > Orthographic`
- `Camera > Projection > Perspective`

Aliases:
- root alias:
  - `Camera` = `C`
- local projection-step aliases only:
  - `O` = `Orthographic`
  - `P` = `Perspective`

Phase 1 intentionally does not add a short alias for `Projection`.

#### Action Ids

The exact execute actions for this phase are:
- `camera.projection.orthographic`
- `camera.projection.perspective`

#### Console Structure Changes

`src/app/console/stagedNavigation.ts`
- add `cameraRoot`
- add `cameraProjectionRoot`
- add root `Camera` choice
- add `Projection` scope under `Camera`
- execute:
  - `camera.projection.orthographic`
  - `camera.projection.perspective`

`src/app/console/radioCommandIdentity.ts`
- add identities for:
  - root `Camera`
  - staged `cameraRoot`
  - staged `cameraProjectionRoot`
  - `camera.projection.orthographic`
  - `camera.projection.perspective`
  - `Sketch Draw` feature-assist `Camera`
  - `Sketch Draw` feature-assist `Projection`
  - `Sketch Draw` feature-assist `Orthographic`
  - `Sketch Draw` feature-assist `Perspective`

`src/app/console/ConsoleDock.tsx`
- handle `camera.projection.orthographic` by updating shared view state
- handle `camera.projection.perspective` by updating shared view state
- do not call the viewer directly from the console command handler
- append a clear transcript line:
  - `Projection: Orthographic`
  - `Projection: Perspective`

### Sketch Draw Scoped Behavior

Phase 1 uses the real app shape:
- this is not modeled as deeper staged navigation under `Graph > Sketch > Sketch Draw`
- `Sketch Draw` already uses feature assist, so projection mode is added as a local branch inside that session

The `Sketch Draw` feature-assist branch is:
- idle choice:
  - `Camera`
- inside `Camera`:
  - `Projection`
- inside `Projection`:
  - `Orthographic`
  - `Perspective`

Alias rules inside this branch:
- `O` = `Orthographic`
- `P` = `Perspective`

Completion rule:
- after execution, return to the normal `Sketch Draw` idle feature-assist prompt
- this should behave like other one-shot `Sketch Draw` assist actions such as zoom/previous returning to the draw session

### Viewer And Camera Implementation

#### Camera Strategy

Phase 1 must use two real cameras in `Viewer`:
- `perspectiveCamera`
- `orthographicCamera`

One active camera reference is then used for:
- render
- raycasting
- sketch helpers
- transform gizmo
- pointer projection

Do not fake ortho by reducing perspective `fov`.

#### Controller Strategy

`CameraController` owns:
- active projection mode
- orbit target
- current view direction
- current up vector
- `lastPerspectiveFovDeg`
- `orthoViewHeight`
- viewport size

`CameraController` must expose:
- `setProjectionMode(mode)`
- `getProjectionMode()`
- `getActiveCamera()`

`CameraPose` must include projection metadata so zoom/history restoration remains correct across mode switches.

#### Projection Toggle Behavior

When switching `Perspective -> Orthographic`:
- preserve target
- preserve view direction
- preserve up vector
- compute visible world height at the current target distance using the active perspective `fov`
- store that as `orthoViewHeight`
- configure the orthographic frustum from `orthoViewHeight` and current aspect

When switching `Orthographic -> Perspective`:
- preserve target
- preserve view direction
- preserve up vector
- restore the previous perspective `fov`

On resize:
- perspective updates aspect normally
- orthographic recomputes `left/right/top/bottom` from `orthoViewHeight` and current aspect

#### Supporting Viewer Rules

`Viewer` must replace hard-coded single-camera assumptions with active-camera usage for:
- render
- raycasting
- sketch plane and sketch draw projection
- transform gizmo camera
- view snap / direction alignment

Additional behavior rules:
- orthographic wheel zoom changes `orthoViewHeight`, not camera-to-target distance
- `frameBox` must work in both modes
- framing in orthographic updates `orthoViewHeight` to fit bounds while preserving direction/target
- pose history must survive projection switches
- gizmo camera must update when projection mode changes

### Toolbar Surface

Phase 1 includes the smallest visible toolbar proof:

`src/app/components/ViewToolbar.tsx`
- add `Perspective` button
- add `Orthographic` button
- place them in the `Camera` section
- read active state from `view.projectionMode`
- write changes through `setViewKey('projectionMode', ...)`
- do not call `viewer.setProjectionMode(...)` directly from the toolbar

This phase stops there:
- no `ParaSelect`
- no `FOV`

### Expected File Touches

Primary implementation files:
- `src/shared/viewSettingsTypes.ts`
- `src/app/viewerBridge.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/viewer/gizmo/TransformGizmo.ts`

Primary verification files:
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/viewer/scene/CameraController.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Verification

Required automated verification:

- `ConsoleDock.test.tsx`
  - root `Camera > Projection > Orthographic`
  - root `Camera > Projection > Perspective`
  - `O` and `P` only inside the projection step
  - `Sketch Draw > Camera > Projection > Orthographic` returns to normal draw idle prompt
- `stagedNavigation.test.ts`
  - root `Camera` scope exists
  - `Projection` branch executes the two new action ids
- `ViewerHost` or store-driven verification
  - changing `view.projectionMode` causes `applyViewSettings` to drive the viewer change
- `CameraController.test.ts`
  - perspective-to-ortho preserves framing
  - ortho-to-perspective restores framing and prior perspective `fov`
  - ortho wheel zoom changes ortho size, not camera distance
  - `frameBox` fits correctly in orthographic mode
  - pose history survives projection switches

Focused test command used for this phase:

```powershell
npm.cmd test -- --run src/app/console/stagedNavigation.test.ts src/viewer/scene/CameraController.test.ts src/app/console/ConsoleDock.test.tsx src/app/components/ViewerHost.test.tsx
```

Focused test result for this phase:
- 4 test files passed
- 149 tests passed

Required manual smoke checks:
- root console command switches projection
- `Sketch Draw` scoped command switches projection and returns to the draw prompt
- toolbar buttons switch projection
- resize in ortho keeps framing stable
- `Frame All`, `Frame`, `Top`, `Front`, `Left`, `Right`, `Iso`, and sketch pointer projection still work in both modes

### Assumptions And Defaults

- projection is persisted in shared `ViewSettings` now, not later
- Phase 1 ships both console access and a real toolbar toggle
- perspective remains the default on startup
- perspective `fov` stays at the current baseline in Phase 1
- user-facing `FOV` editing is deferred to `[5.0I-2]`
- root and scoped commands target the same active viewer projection seam
- `Sketch Draw` scoped projection uses the existing feature-assist model, not a new staged-navigation subtree

### Definition Of Done

- the app persists `projectionMode` in shared view settings
- the root console exposes `Camera > Projection > Orthographic|Perspective`
- `Sketch Draw` feature assist exposes `Camera > Projection > Orthographic|Perspective`
- `O` and `P` work only inside the projection choice step
- the viewer uses a real orthographic camera
- toolbar and console both route through shared view state
- the focused automated verification passes
- the phase lands without absorbing `[5.0I-2]`

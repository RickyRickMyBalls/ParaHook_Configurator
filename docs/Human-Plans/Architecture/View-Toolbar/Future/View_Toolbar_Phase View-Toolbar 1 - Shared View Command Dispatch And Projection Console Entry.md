# View Toolbar Phase View-Toolbar 1 - Shared View Command Dispatch And Projection Console Entry

## Doc Header

### Doc History
5. 2026-03-30 15:18: Rewrote this phase into a current-code-audited implementation-ready spec by grounding it in the live `ViewToolbar`, `viewCommands`, `ConsoleDock`, `stagedNavigation`, `ViewerHost`, `Viewer`, and `CameraController` seams, correcting stale toolbar-owner wording, and adding a concrete implementation checklist, file map, and verification shape
4. 2026-03-30 15:00: Renamed this future phase doc from the older `5.0I-1` numbering to `View-Toolbar 1`, so the standalone file now matches the live family naming used by `View-Toolbar-Index.md` while preserving the same projection-focused phase scope
3. 2026-03-23 22:25: Recorded the shipped orthographic-pan follow-up that clarified the real remaining bug path was normal viewport `OrbitControls` panning, which required `screenSpacePanning = true` in addition to the custom temporary-pan fixes
2. 2026-03-23 14:35: Tightened this doc into an implementation-ready Phase 1 spec that matches the shipped projection seam, shared `ViewSettings` ownership, root/scoped console grammar, toolbar surface, viewer/controller architecture, and required verification
1. 2026-03-23 14:07: Created this standalone future phase doc for `[5.0I-1]`, translating the first `View-Toolbar` implementation cut into an implementation-ready plan centered on the shared console/toolbar projection seam and the first real `Orthographic` versus `Perspective` command path

### Purpose

This doc locks `View-Toolbar 1` as an implementation-ready phase spec.

Use it to answer:
- what this first `View-Toolbar` phase actually owns
- how projection mode is owned and persisted
- how toolbar and console both route through one projection seam
- how `Sketch Draw` reaches the same projection family locally
- which viewer/controller rules must hold for a real orthographic implementation
- which files, tests, and manual checks define completion

### Why This Phase Exists

`View-Toolbar` needs a small but honest first vertical slice.

This phase exists to land:
- a real `Perspective` / `Orthographic` seam
- one shared persisted projection setting
- one root console family
- one `Sketch Draw` local camera branch
- the smallest visible toolbar proof that toolbar and console drive the same projection owner

This phase stays narrow on purpose:
- no `ParaSelect`
- no user-facing `FOV` editor
- no grid/background/helper work
- no later camera-feel tuning

### Scope

This phase covers:
- shared `projectionMode` state in `ViewSettings`
- real perspective versus orthographic switching in the viewer
- root console commands:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
- `Sketch Draw` local camera branch:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
- local `O` / `P` aliases inside the final `Projection` choice step
- minimal `ViewToolbar` projection buttons

This phase does not cover:
- `ParaSelect`
- user-facing `FOV`
- grid controls
- background/environment controls
- helper tuning
- inertia/decay/roll/spin

## Doc Body

## [x] - `View-Toolbar 1` - `Shared View Command Dispatch And Projection Console Entry`

### Short Version

`View-Toolbar 1` is the first honest projection phase.

It should make one thing true across the app:
- `Perspective` and `Orthographic` are shared view commands
- toolbar and console both trigger that same owner seam
- the viewer uses a real orthographic camera path, not a fake low-`FOV` approximation

### Current Code Audit

The repo already contains the core seam this phase is meant to define.

Current live read:
- `src/shared/viewSettingsTypes.ts`
  - `ViewSettings.projectionMode` already exists
  - `DEFAULT_VIEW_SETTINGS.projectionMode` already defaults to `'perspective'`
- `src/app/viewCommands.ts`
  - `setProjectionModeCommand(mode)` already updates shared view state through `useUiPrefsStore`
- `src/app/components/ViewToolbar.tsx`
  - visible `Perspective` and `Orthographic` buttons already call `setProjectionModeCommand(...)`
- `src/app/console/stagedNavigation.ts`
  - `camera.projection.orthographic`
  - `camera.projection.perspective`
  - `sketchdraw.camera.projection.orthographic`
  - `sketchdraw.camera.projection.perspective`
- `src/app/console/ConsoleDock.tsx`
  - both root and sketch-local projection actions already resolve through `setProjectionModeCommand(...)`
- `src/app/components/ViewerHost.tsx`
  - `viewerRef.current?.applyViewSettings(view)` already pushes shared view settings into the viewer
- `src/viewer/Viewer.ts`
  - `applyViewSettings(settings)` already calls `setProjectionMode(settings.projectionMode)`
- `src/viewer/scene/CameraController.ts`
  - already owns a real perspective camera plus orthographic camera
  - already exposes `setProjectionMode(...)`
  - already uses `screenSpacePanning = true`
- existing tests already prove key parts of the seam

Practical read:
- this doc should now read as the buildable contract for the phase, grounded in current code
- it is already useful both as an implementation spec and as the canonical record of what this phase requires

### Phase Goal

Make projection the first real shared `View-Toolbar` command family by ensuring:
- one shared projection owner seam
- one persisted projection setting
- one root console path
- one `Sketch Draw` local branch
- one minimal visible toolbar surface
- one real orthographic camera implementation

### Locked Outcome

At the end of this phase:
- the app has one real projection command family instead of only doc intent
- projection mode is persisted in shared `ViewSettings`
- the root console can switch between `Perspective` and `Orthographic`
- `Sketch Draw` can reach the same projection family through its local command path
- the visible `ViewToolbar` exposes the same projection seam without a bespoke private implementation
- `Orthographic` means a real orthographic camera, not reduced-perspective `FOV`

### Public Interfaces And State

This phase owns these shared interfaces:
- `ViewSettings.projectionMode: 'perspective' | 'orthographic'`
- `DEFAULT_VIEW_SETTINGS.projectionMode = 'perspective'`
- `setProjectionModeCommand(mode: ProjectionMode): void`
- `Viewer.applyViewSettings(settings: ViewSettings): void`
- `Viewer.setProjectionMode(mode: ProjectionMode): void`
- `CameraController.setProjectionMode(mode: ProjectionMode): void`
- `CameraPose.projectionMode`
- `CameraPose.perspectiveFovDeg`
- `CameraPose.orthoViewHeight`

State ownership rule:
- `useUiPrefsStore.view` is the source of truth for projection mode in `View-Toolbar 1`
- toolbar and console both update shared view state
- `ViewerHost` applies that shared view state to the viewer
- toolbar and console do not call private camera math directly

### Command Model

#### Root Grammar

This phase owns the root staged command family:
- `Camera > Projection > Orthographic`
- `Camera > Projection > Perspective`

Aliases:
- root alias:
  - `Camera` = `C`
- local projection-step aliases only:
  - `O` = `Orthographic`
  - `P` = `Perspective`

Guardrail:
- do not add a global alias for `Projection`
- keep `O` and `P` local to the final projection choice step only

#### Action Ids

Exact action ids for this phase:
- `camera.projection.orthographic`
- `camera.projection.perspective`
- `sketchdraw.camera.projection.orthographic`
- `sketchdraw.camera.projection.perspective`

#### Transcript Rule

When projection changes through console:
- write a clear transcript/result line:
  - `Projection: Orthographic`
  - `Projection: Perspective`

### Sketch Draw Local Behavior

This phase uses the real current app shape:
- do not model this as a deeper global staged subtree under `Graph > Sketch > Sketch Draw`
- `Sketch Draw` already exposes local command assistance, so projection belongs as a local branch inside that session

The local branch is:
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
- after execution, return to the normal `Sketch Draw` idle prompt
- this should behave like other one-shot local camera actions instead of trapping the user in the projection branch

### Toolbar Surface

`ViewToolbar` should include only the smallest visible proof in this phase:
- `Perspective` button
- `Orthographic` button
- both in the `Camera` section
- both reading active state from `view.projectionMode`
- both calling `setProjectionModeCommand(...)`

Toolbar rule:
- do not call `viewer.setProjectionMode(...)` directly from `ViewToolbar`
- the toolbar is an adapter over the shared owner seam, not the owner itself

### Viewer And Camera Spec

#### Camera Strategy

The viewer must use two real cameras:
- `perspectiveCamera`
- `orthographicCamera`

One active camera reference then drives:
- render
- raycasting
- sketch helper projection
- transform gizmo camera
- pointer projection

Guardrail:
- do not fake orthographic mode by driving perspective `fov` toward zero

#### Controller Strategy

`CameraController` owns:
- active projection mode
- orbit target
- current view direction
- current up vector
- `lastPerspectiveFovDeg`
- `orthoViewHeight`
- viewport size

Required controller behaviors:
- `setProjectionMode(mode)`
- `getProjectionMode()`
- `getActiveCamera()`
- pose metadata preservation across mode switches

#### Projection Toggle Behavior

When switching `Perspective -> Orthographic`:
- preserve target
- preserve view direction
- preserve up vector
- compute visible world height at the current target distance from active perspective `fov`
- store that as `orthoViewHeight`
- configure orthographic `left/right/top/bottom` from `orthoViewHeight` and current aspect

When switching `Orthographic -> Perspective`:
- preserve target
- preserve view direction
- preserve up vector
- restore the prior perspective `fov`

On resize:
- perspective updates aspect normally
- orthographic recomputes `left/right/top/bottom` from `orthoViewHeight` and current aspect

#### Supporting Viewer Rules

The viewer must replace hard-coded single-camera assumptions with active-camera usage for:
- render
- raycasting
- sketch plane and sketch draw projection
- transform gizmo camera
- view snap / direction alignment

Additional behavior rules:
- orthographic wheel zoom changes `orthoViewHeight`, not camera-to-target distance
- `frameBox` must work in both modes
- orthographic framing must update `orthoViewHeight` while preserving direction/target
- pose history must survive projection switches
- gizmo camera must update when projection changes
- normal viewport pan in orthographic mode must honor the visible screen axes
- the shared `OrbitControls` path therefore needs `screenSpacePanning = true`
- sketch-plane-aligned orthographic views depend on correct camera `up` alignment and projection-switch re-alignment while idle `SketchDraw`

### Non-Goals

This phase explicitly does not widen into:
- `ParaSelect`
- user-facing `FOV`
- grid sections
- background controls
- environment/look controls
- orientation-gizmo tuning
- later motion-feel controls

Guardrail:
- if a task feels like it needs a second camera/lens subsection, it probably belongs in `View-Toolbar 2`

### File Map

Primary implementation files:
- `src/shared/viewSettingsTypes.ts`
- `src/app/viewCommands.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/scene/CameraController.ts`
- `src/viewer/gizmo/TransformGizmo.ts`

Primary verification files:
- `src/app/viewCommands.test.ts`
- `src/app/components/ViewToolbar.test.tsx`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/viewer/scene/CameraController.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Recommended Implementation Order

1. Lock shared view state:
   - ensure `projectionMode` lives in `ViewSettings`
   - ensure the default remains `'perspective'`
2. Lock the shared command owner seam:
   - route toolbar and console projection changes through `setProjectionModeCommand(...)`
3. Lock root console grammar:
   - `Camera > Projection > Orthographic`
   - `Camera > Projection > Perspective`
4. Lock `Sketch Draw` local routing:
   - add the local `Camera > Projection` branch and return-to-idle behavior
5. Lock viewer behavior:
   - real orthographic camera
   - active-camera usage everywhere it matters
   - orthographic zoom and framing behavior
6. Lock regression coverage:
   - toolbar
   - command owner seam
   - staged navigation
   - console
   - camera controller

### Implementation Checklist

- [x] Add `projectionMode` to `ViewSettings`
- [x] Default `projectionMode` to `'perspective'`
- [x] Add `setProjectionModeCommand(...)` as the shared projection owner seam
- [x] Add root staged console `Camera > Projection`
- [x] Add root actions:
  - [x] `camera.projection.orthographic`
  - [x] `camera.projection.perspective`
- [x] Add `Sketch Draw` local projection actions:
  - [x] `sketchdraw.camera.projection.orthographic`
  - [x] `sketchdraw.camera.projection.perspective`
- [x] Keep `O` / `P` local to the final projection choice step
- [x] Add visible `Perspective` / `Orthographic` toolbar buttons
- [x] Route toolbar projection changes through `setProjectionModeCommand(...)`
- [x] Route console projection changes through `setProjectionModeCommand(...)`
- [x] Apply shared view settings to the viewer through `ViewerHost`
- [x] Use a real orthographic camera path in the viewer
- [x] Preserve framing and pose metadata across projection switches
- [x] Keep orthographic pan aligned with screen axes using `screenSpacePanning = true`
- [x] Keep the phase narrow and defer `ParaSelect` / `FOV`

### Verification Checklist

Automated:
- [x] `viewCommands.test.ts`
  - projection updates shared state through one owner seam
- [x] `ViewToolbar.test.tsx`
  - toolbar projection buttons call the shared owner seam
- [x] `stagedNavigation.test.ts`
  - root `Camera` projection branch exists
  - `O` and `P` only work inside projection choice
- [x] `ConsoleDock.test.tsx`
  - root projection commands update shared state
  - `Sketch Draw` local projection commands return to idle correctly
- [x] `CameraController.test.ts`
  - perspective-to-ortho preserves framing
  - ortho-to-perspective restores prior framing / `fov`
  - ortho wheel zoom changes `orthoViewHeight`
  - orthographic pan follows screen axes
  - pose history survives projection switches
- [x] `ViewerHost.test.tsx`
  - changing `view.projectionMode` causes `applyViewSettings(view)` to drive the viewer

Manual:
- [x] Root console command switches projection
- [x] `Sketch Draw` local command switches projection and returns to the draw prompt
- [x] Toolbar buttons switch projection
- [x] Resize in orthographic keeps framing stable
- [x] `Frame All`, `Frame`, `Top`, `Front`, `Left`, `Right`, and `Iso` keep working in both modes
- [x] Normal middle-mouse orthographic pan follows visible screen axes

### Focused Verification Command

```powershell
npm.cmd test -- --run src/app/viewCommands.test.ts src/app/components/ViewToolbar.test.tsx src/app/console/stagedNavigation.test.ts src/app/console/ConsoleDock.test.tsx src/viewer/scene/CameraController.test.ts src/app/components/ViewerHost.test.tsx
```

### Notes From Current Audit

- The doc previously said the toolbar should write `projectionMode` through `setViewKey(...)` directly.
- Current code is already cleaner than that:
  - `ViewToolbar` calls `setProjectionModeCommand(...)`
- The main orthographic pan bug was not a Three.js orthographic limitation.
- The decisive fix was enabling `screenSpacePanning = true` on shared `OrbitControls`.
- The repo already contains the important staged action ids and tests for the projection family.

### Definition Of Done

- projection is persisted in shared `ViewSettings`
- the root console exposes `Camera > Projection > Orthographic|Perspective`
- `Sketch Draw` exposes the same projection family through its local command path
- `O` and `P` work only inside the projection choice step
- the toolbar exposes `Perspective` and `Orthographic` through the shared owner seam
- the viewer uses a real orthographic camera path
- focused automated verification covers the owner seam, console, toolbar, host, and controller
- the phase lands without absorbing `View-Toolbar 2`

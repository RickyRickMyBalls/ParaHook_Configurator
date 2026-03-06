# ParaHook Repository Hierarchy & Boundaries

This document defines ownership, responsibility, and import rules.
Violating these rules risks architectural regression.

---

# 1. High-Level Architecture

UI (React)
↓
Intent Classifier
↓
Build Dispatcher
↓
Worker (CAD Engine)
↓
Deterministic Product Pipeline
↓
Viewer (Three.js, render only)

No reverse flow.
No cross-layer leakage.

---

# 2. Folder Ownership

## /src/app

Purpose:
- UI components
- Zustand stores
- Intent classification
- Worker dispatching
- Panels & toolbars

May import:
- shared/
- viewerBridge (optional)
- local app modules

Must NOT import:
- worker/
- geometry/

Rebuilds are triggered ONLY from here.

---

## /src/viewer

Purpose:
- Scene graph
- Rendering
- Camera
- Gizmo
- Materials
- Ephemeral transforms

May import:
- three
- shared/
- viewer-local modules

Must NOT import:
- worker/
- geometry/

Viewer never computes CAD.
Viewer never mutates canonical schema.

---

## /src/worker

Purpose:
- Geometry builds
- Filter stack execution
- Engine routing
- Assemble preview
- Export generation

May import:
- geometry/
- shared/

Must NOT import:
- app/
- viewer/

Worker is deterministic and side-effect isolated.

---

## /src/geometry

Purpose:
- Pure math helpers
- Loft sampling
- Rail fitting
- Frame generation
- Transform helpers

Must:
- Contain no three.js
- Contain no replicad
- Be deterministic

May import:
- shared/ types only

---

## /src/shared

Purpose:
- Canonical schemas
- Build types
- Part types
- Transform types
- Engine mode enums

This is the only cross-layer contract.

---

## /src/runtime

Purpose:
- Audio engine
- Timeline
- Non-CAD runtime systems

May not interact with worker directly.

---

# 3. Canonical Source of Truth

Canonical model lives in Zustand store:

- Product schema
- Part instances
- Root transforms
- Filter stacks

Worker receives serialized snapshot.
Worker never owns canonical state.

---

# 4. Transform Model

Viewer:
- Holds ephemeral transforms for interactive editing.
- Does not mutate canonical state.

Apply Transform:
- Commits TRS into canonical schema.
- Triggers rebuild.
- Clears ephemeral transform.

---

# 5. Filter Stack Model

Each PartInstance has:

filters: ordered FilterSpec[]

Worker applies filters in order.
Order must be deterministic.

---

# 6. Assemble Preview

- Never automatic.
- Triggered explicitly.
- Cached by signature.
- Used for export validation.

---

# 7. Import Rules (Critical)

Allowed directions:

app → shared
viewer → shared
worker → shared
worker → geometry

Forbidden:

app → worker
app → geometry
viewer → worker
viewer → geometry
worker → app
worker → viewer

---

# 8. What Triggers Rebuild

Triggers:
- Geometry parameter changes
- Filter changes
- Apply Transform commit
- Engine switch
- Control mode change

Does NOT trigger rebuild:
- Visibility toggle
- Material change
- Selection change
- Camera movement
- Gizmo movement (until Apply)

---

# 9. Error Handling Model

Worker emits:
- build_result
- assemble_result
- worker_error

UI surfaces error.
Viewer does not handle error logic.

---

# 10. Anti-Patterns (Never Do)

- Put CAD math in viewer.
- Put UI state in worker.
- Auto-assemble on every rebuild.
- Modify canonical state inside viewer.
- Hide engine routing inside random functions.

---

# 11. Long-Term Stability Goal

The repo must allow:

- New products without touching viewer core.
- New filters without rewriting build pipeline.
- New engines without breaking legacy path.
- Deterministic signature comparisons.
- Safe fallback routing.

---

.
`-- parahook
    |-- public
    |   `-- vite.svg
    |-- src
    |   |-- app
    |   |   |-- components
    |   |   |   |-- BuildStatus.tsx
    |   |   |   |-- Toolbar.tsx
    |   |   |   `-- ViewerHost.tsx
    |   |   |-- io
    |   |   |-- modes
    |   |   |   |-- jakeMode
    |   |   |   `-- profileEditor
    |   |   |-- panels
    |   |   |   |-- AudioSamplerPanel.tsx
    |   |   |   |-- BoxPanel.tsx
    |   |   |   |-- MaterialPanel.tsx
    |   |   |   |-- PartsListPanel.tsx
    |   |   |   `-- RadioPanel.tsx
    |   |   |-- presets
    |   |   |-- store
    |   |   |   |-- audioSamplerStore.ts
    |   |   |   |-- intentClassifier.ts
    |   |   |   |-- partsListStore.ts
    |   |   |   `-- useAppStore.ts
    |   |   |-- buildDispatcher.ts
    |   |   `-- AppShell.tsx
    |   |-- assets
    |   |   `-- react.svg
    |   |-- geometry
    |   |   |-- bezier.ts
    |   |   |-- catmullRom.ts
    |   |   |-- loftSampling.ts
    |   |   |-- railFit.ts
    |   |   |-- spineFrames.ts
    |   |   `-- transforms.ts
    |   |-- runtime
    |   |   `-- audio
    |   |       |-- AudioEngine.ts
    |   |       |-- ClipLibrary.ts
    |   |       |-- SamplerKeys.ts
    |   |       `-- TimelineTransport.ts
    |   |-- shared
    |   |   |-- buildTypes.ts
    |   |   |-- constants.ts
    |   |   |-- exportTypes.ts
    |   |   |-- partsTypes.ts
    |   |   `-- productSchema.ts
    |   |-- viewer
    |   |   |-- assets
    |   |   |-- controlViz
    |   |   |   `-- ControlSpheres.ts
    |   |   |-- gizmo
    |   |   |   `-- GizmoController.ts
    |   |   |-- materials
    |   |   |   `-- materialLibrary.ts
    |   |   |-- renderers
    |   |   |   |-- MeshRenderer.ts
    |   |   |   `-- PartsRenderer.ts
    |   |   |-- scene
    |   |   |   `-- SceneManager.ts
    |   |   `-- Viewer.ts
    |   |-- worker
    |   |   |-- oc
    |   |   |   `-- ocInit.ts
    |   |   |-- pipeline
    |   |   |   |-- artifactEmitter.ts
    |   |   |   |-- buildPipeline.ts
    |   |   |   |-- exportService.ts
    |   |   |   `-- stageAssembler.ts
    |   |   |-- products
    |   |   |   |-- foothook
    |   |   |   |   |-- parts
    |   |   |   |   |   |-- baseplate.ts
    |   |   |   |   |   |-- heelKick.ts
    |   |   |   |   |   `-- toeHook.ts
    |   |   |   |   `-- buildFoothook.ts
    |   |   |   |-- footpad
    |   |   |   `-- rail
    |   |   |-- scheduler.ts
    |   |   |-- validation.ts
    |   |   `-- worker.ts
    |   |-- index.css
    |   `-- main.tsx
    |-- tests
    |   |-- geometry
    |   |-- pipeline
    |   `-- products
    |-- .gitignore
    |-- dev-check.log
    |-- eslint.config.js
    |-- index.html
    |-- package.json
    |-- package-lock.json
    |-- README.md
    |-- tsconfig.app.json
    |-- tsconfig.json
    |-- tsconfig.node.json
    `-- vite.config.ts

# 12. Snapshot Hierarchy (Current Snapshot: 2026-03-03)

.
`-- parahook
    |-- docs
    |   |-- humanplan.md
    |   |-- listofchanges.md
    |   `-- targetrepo.md
    |-- public
    |   `-- vite.svg
    |-- src
    |   |-- app
    |   |   |-- components
    |   |   |   |-- BuildStatsDrawer.tsx
    |   |   |   |-- BuildStatus.tsx
    |   |   |   |-- TitleStatusBar.tsx
    |   |   |   |-- Toolbar.tsx
    |   |   |   |-- ViewerHost.tsx
    |   |   |   |-- ViewportOverlay.tsx
    |   |   |   `-- ViewToolbar.tsx
    |   |   |-- io
    |   |   |-- modes
    |   |   |   |-- jakeMode
    |   |   |   `-- profileEditor
    |   |   |-- panels
    |   |   |   |-- AudioSamplerPanel.tsx
    |   |   |   |-- BoxPanel.tsx
    |   |   |   |-- MaterialPanel.tsx
    |   |   |   |-- PartsListPanel.tsx
    |   |   |   |-- RadioPanel.tsx
    |   |   |   `-- SpaghettiPanel.tsx
    |   |   |-- parts
    |   |   |   `-- partKeyResolver.ts
    |   |   |-- presets
    |   |   |-- spaghetti
    |   |   |   |-- canvas
    |   |   |   |   |-- NodeView.tsx
    |   |   |   |   |-- PortView.tsx
    |   |   |   |   |-- SpaghettiCanvas.tsx
    |   |   |   |   |-- spaghettiWires.ts
    |   |   |   |   |-- types.ts
    |   |   |   |   `-- WireLayer.tsx
    |   |   |   |-- compiler
    |   |   |   |   |-- compileGraph.ts
    |   |   |   |   |-- evaluateGraph.ts
    |   |   |   |   `-- validateGraph.ts
    |   |   |   |-- dev
    |   |   |   |   `-- sampleGraph.ts
    |   |   |   |-- integration
    |   |   |   |   `-- buildInputsToRequest.ts
    |   |   |   |-- registry
    |   |   |   |   `-- nodeRegistry.ts
    |   |   |   |-- schema
    |   |   |   |   |-- spaghettiSchema.ts
    |   |   |   |   `-- spaghettiTypes.ts
    |   |   |   |-- store
    |   |   |   |   `-- useSpaghettiStore.ts
    |   |   |   `-- ui
    |   |   |       |-- CollapsedEditor.tsx
    |   |   |       |-- ExpandedEditor.tsx
    |   |   |       |-- SpaghettiEditor.tsx
    |   |   |       `-- SpaghettiEditorBoundary.tsx
    |   |   |-- store
    |   |   |   |-- audioSamplerStore.ts
    |   |   |   |-- buildStatsStore.ts
    |   |   |   |-- intentClassifier.ts
    |   |   |   |-- partsListStore.ts
    |   |   |   |-- uiPrefsStore.ts
    |   |   |   `-- useAppStore.ts
    |   |   |-- theme
    |   |   |   `-- v15Theme.css
    |   |   |-- AppShell.tsx
    |   |   |-- bootstrapBuildWiring.ts
    |   |   |-- buildDispatcher.ts
    |   |   |-- main.tsx
    |   |   |-- protocol.ts
    |   |   `-- viewerBridge.ts
    |   |-- assets
    |   |   `-- react.svg
    |   |-- geometry
    |   |   |-- bezier.ts
    |   |   |-- catmullRom.ts
    |   |   |-- loftSampling.ts
    |   |   |-- railFit.ts
    |   |   |-- spineFrames.ts
    |   |   `-- transforms.ts
    |   |-- runtime
    |   |   `-- audio
    |   |       |-- AudioEngine.ts
    |   |       |-- ClipLibrary.ts
    |   |       |-- SamplerKeys.ts
    |   |       `-- TimelineTransport.ts
    |   |-- shared
    |   |   |-- buildTypes.ts
    |   |   |-- constants.ts
    |   |   |-- exportTypes.ts
    |   |   |-- partsTypes.ts
    |   |   |-- productSchema.ts
    |   |   `-- viewSettingsTypes.ts
    |   |-- tests
    |   |   |-- geometry
    |   |   |-- pipeline
    |   |   `-- products
    |   |-- viewer
    |   |   |-- assets
    |   |   |-- controlViz
    |   |   |   `-- ControlSpheres.ts
    |   |   |-- gizmo
    |   |   |   |-- GizmoController.ts
    |   |   |   `-- TransformGizmo.ts
    |   |   |-- materials
    |   |   |   `-- materialLibrary.ts
    |   |   |-- overlay
    |   |   |   `-- AxisGizmo.ts
    |   |   |-- renderers
    |   |   |   |-- MeshRenderer.ts
    |   |   |   `-- PartsRenderer.ts
    |   |   |-- scene
    |   |   |   |-- CameraController.ts
    |   |   |   `-- SceneManager.ts
    |   |   `-- Viewer.ts
    |   |-- worker
    |   |   |-- oc
    |   |   |   `-- ocInit.ts
    |   |   |-- pipeline
    |   |   |   |-- artifactEmitter.ts
    |   |   |   |-- buildPipeline.ts
    |   |   |   |-- exportService.ts
    |   |   |   |-- paramRouting.ts
    |   |   |   |-- partsSpec.ts
    |   |   |   |-- signatures.ts
    |   |   |   `-- stageAssembler.ts
    |   |   |-- products
    |   |   |   |-- foothook
    |   |   |   |   |-- parts
    |   |   |   |   |   |-- baseplate.ts
    |   |   |   |   |   |-- heelKick.ts
    |   |   |   |   |   `-- toeHook.ts
    |   |   |   |   `-- buildFoothook.ts
    |   |   |   |-- footpad
    |   |   |   `-- rail
    |   |   |-- scheduler.ts
    |   |   |-- validation.ts
    |   |   `-- worker.ts
    |   |-- App.css
    |   |-- App.tsx
    |   |-- index.css
    |   `-- main.tsx
    |-- .gitignore
    |-- dev-start.err.log
    |-- dev-start.out.log
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.app.json
    |-- tsconfig.json
    |-- tsconfig.node.json
    `-- vite.config.ts

End of REPO_HIERARCHY.md

---

----------------------------------
## ACTUAL repo in /20/ (2026-03-03)
----------------------------------

```text
`-- parahook
    |-- docs
    |   |-- humanplan.md
    |   |-- listofchanges.md
    |   `-- targetrepo.md
    |-- public
    |   `-- vite.svg
    |-- src
    |   |-- app
    |   |   |-- components
    |   |   |   |-- BuildStatsDrawer.tsx
    |   |   |   |-- BuildStatus.tsx
    |   |   |   |-- TitleStatusBar.tsx
    |   |   |   |-- Toolbar.tsx
    |   |   |   |-- ViewerHost.tsx
    |   |   |   |-- ViewportOverlay.tsx
    |   |   |   `-- ViewToolbar.tsx
    |   |   |-- io
    |   |   |-- modes
    |   |   |   |-- jakeMode
    |   |   |   `-- profileEditor
    |   |   |-- panels
    |   |   |   |-- AudioSamplerPanel.tsx
    |   |   |   |-- BoxPanel.tsx
    |   |   |   |-- MaterialPanel.tsx
    |   |   |   |-- PartsListPanel.tsx
    |   |   |   |-- RadioPanel.tsx
    |   |   |   `-- SpaghettiPanel.tsx
    |   |   |-- parts
    |   |   |   `-- partKeyResolver.ts
    |   |   |-- presets
    |   |   |-- spaghetti
    |   |   |   |-- canvas
    |   |   |   |   |-- NodeView.tsx
    |   |   |   |   |-- PortView.tsx
    |   |   |   |   |-- SpaghettiCanvas.tsx
    |   |   |   |   |-- spaghettiWires.ts
    |   |   |   |   |-- types.ts
    |   |   |   |   `-- WireLayer.tsx
    |   |   |   |-- compiler
    |   |   |   |   |-- compileGraph.ts
    |   |   |   |   |-- evaluateGraph.ts
    |   |   |   |   `-- validateGraph.ts
    |   |   |   |-- dev
    |   |   |   |   `-- sampleGraph.ts
    |   |   |   |-- integration
    |   |   |   |   `-- buildInputsToRequest.ts
    |   |   |   |-- registry
    |   |   |   |   `-- nodeRegistry.ts
    |   |   |   |-- schema
    |   |   |   |   |-- spaghettiSchema.ts
    |   |   |   |   `-- spaghettiTypes.ts
    |   |   |   |-- store
    |   |   |   |   `-- useSpaghettiStore.ts
    |   |   |   `-- ui
    |   |   |       |-- CollapsedEditor.tsx
    |   |   |       |-- ExpandedEditor.tsx
    |   |   |       |-- SpaghettiEditor.tsx
    |   |   |       `-- SpaghettiEditorBoundary.tsx
    |   |   |-- store
    |   |   |   |-- audioSamplerStore.ts
    |   |   |   |-- buildStatsStore.ts
    |   |   |   |-- intentClassifier.ts
    |   |   |   |-- partsListStore.ts
    |   |   |   |-- uiPrefsStore.ts
    |   |   |   `-- useAppStore.ts
    |   |   |-- theme
    |   |   |   `-- v15Theme.css
    |   |   |-- AppShell.tsx
    |   |   |-- bootstrapBuildWiring.ts
    |   |   |-- buildDispatcher.ts
    |   |   |-- main.tsx
    |   |   |-- protocol.ts
    |   |   `-- viewerBridge.ts
    |   |-- assets
    |   |   `-- react.svg
    |   |-- geometry
    |   |   |-- bezier.ts
    |   |   |-- catmullRom.ts
    |   |   |-- loftSampling.ts
    |   |   |-- railFit.ts
    |   |   |-- spineFrames.ts
    |   |   `-- transforms.ts
    |   |-- runtime
    |   |   `-- audio
    |   |       |-- AudioEngine.ts
    |   |       |-- ClipLibrary.ts
    |   |       |-- SamplerKeys.ts
    |   |       `-- TimelineTransport.ts
    |   |-- shared
    |   |   |-- buildTypes.ts
    |   |   |-- constants.ts
    |   |   |-- exportTypes.ts
    |   |   |-- partsTypes.ts
    |   |   |-- productSchema.ts
    |   |   `-- viewSettingsTypes.ts
    |   |-- tests
    |   |   |-- geometry
    |   |   |-- pipeline
    |   |   `-- products
    |   |-- viewer
    |   |   |-- assets
    |   |   |-- controlViz
    |   |   |   `-- ControlSpheres.ts
    |   |   |-- gizmo
    |   |   |   |-- GizmoController.ts
    |   |   |   `-- TransformGizmo.ts
    |   |   |-- materials
    |   |   |   `-- materialLibrary.ts
    |   |   |-- overlay
    |   |   |   `-- AxisGizmo.ts
    |   |   |-- renderers
    |   |   |   |-- MeshRenderer.ts
    |   |   |   `-- PartsRenderer.ts
    |   |   |-- scene
    |   |   |   |-- CameraController.ts
    |   |   |   `-- SceneManager.ts
    |   |   `-- Viewer.ts
    |   |-- worker
    |   |   |-- oc
    |   |   |   `-- ocInit.ts
    |   |   |-- pipeline
    |   |   |   |-- artifactEmitter.ts
    |   |   |   |-- buildPipeline.ts
    |   |   |   |-- exportService.ts
    |   |   |   |-- paramRouting.ts
    |   |   |   |-- partsSpec.ts
    |   |   |   |-- signatures.ts
    |   |   |   `-- stageAssembler.ts
    |   |   |-- products
    |   |   |   |-- foothook
    |   |   |   |   |-- parts
    |   |   |   |   |   |-- baseplate.ts
    |   |   |   |   |   |-- heelKick.ts
    |   |   |   |   |   `-- toeHook.ts
    |   |   |   |   `-- buildFoothook.ts
    |   |   |   |-- footpad
    |   |   |   `-- rail
    |   |   |-- scheduler.ts
    |   |   |-- validation.ts
    |   |   `-- worker.ts
    |   |-- App.css
    |   |-- App.tsx
    |   |-- index.css
    |   `-- main.tsx
    |-- .gitignore
    |-- dev-start.err.log
    |-- dev-start.out.log
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.app.json
    |-- tsconfig.json
    |-- tsconfig.node.json
    `-- vite.config.ts
```

---

----------------------------------
## ACTUAL repo in /20/ (2026-03-03 17:52 current snapshot)
----------------------------------

```text`-- parahook
    |-- docs
    |   |-- humanplan.md
    |   |-- listofchanges.md
    |   `-- targetrepo.md
    |-- public
    |   `-- vite.svg
    |-- src
    |   |-- app
    |   |   |-- components
    |   |   |   |-- BuildStatsDrawer.tsx
    |   |   |   |-- BuildStatus.tsx
    |   |   |   |-- TitleStatusBar.tsx
    |   |   |   |-- Toolbar.tsx
    |   |   |   |-- ViewerHost.tsx
    |   |   |   |-- ViewportOverlay.tsx
    |   |   |   `-- ViewToolbar.tsx
    |   |   |-- io
    |   |   |-- modes
    |   |   |   |-- jakeMode
    |   |   |   `-- profileEditor
    |   |   |-- panels
    |   |   |   |-- AudioSamplerPanel.tsx
    |   |   |   |-- BoxPanel.tsx
    |   |   |   |-- MaterialPanel.tsx
    |   |   |   |-- PartsListPanel.tsx
    |   |   |   |-- RadioPanel.tsx
    |   |   |   `-- SpaghettiPanel.tsx
    |   |   |-- parts
    |   |   |   `-- partKeyResolver.ts
    |   |   |-- presets
    |   |   |-- spaghetti
    |   |   |   |-- canvas
    |   |   |   |   |-- NodeView.tsx
    |   |   |   |   |-- PortView.tsx
    |   |   |   |   |-- SpaghettiCanvas.tsx
    |   |   |   |   |-- spaghettiWires.ts
    |   |   |   |   |-- types.ts
    |   |   |   |   `-- WireLayer.tsx
    |   |   |   |-- compiler
    |   |   |   |   |-- compileGraph.ts
    |   |   |   |   |-- evaluateGraph.ts
    |   |   |   |   `-- validateGraph.ts
    |   |   |   |-- dev
    |   |   |   |   `-- sampleGraph.ts
    |   |   |   |-- integration
    |   |   |   |   `-- buildInputsToRequest.ts
    |   |   |   |-- registry
    |   |   |   |   `-- nodeRegistry.ts
    |   |   |   |-- schema
    |   |   |   |   |-- spaghettiSchema.ts
    |   |   |   |   `-- spaghettiTypes.ts
    |   |   |   |-- store
    |   |   |   |   `-- useSpaghettiStore.ts
    |   |   |   `-- ui
    |   |   |       |-- CollapsedEditor.tsx
    |   |   |       |-- ExpandedEditor.tsx
    |   |   |       |-- SpaghettiEditor.tsx
    |   |   |       `-- SpaghettiEditorBoundary.tsx
    |   |   |-- store
    |   |   |   |-- audioSamplerStore.ts
    |   |   |   |-- buildStatsStore.ts
    |   |   |   |-- intentClassifier.ts
    |   |   |   |-- partsListStore.ts
    |   |   |   |-- uiPrefsStore.ts
    |   |   |   `-- useAppStore.ts
    |   |   |-- theme
    |   |   |   `-- v15Theme.css
    |   |   |-- AppShell.tsx
    |   |   |-- bootstrapBuildWiring.ts
    |   |   |-- buildDispatcher.ts
    |   |   |-- main.tsx
    |   |   |-- protocol.ts
    |   |   `-- viewerBridge.ts
    |   |-- assets
    |   |   `-- react.svg
    |   |-- geometry
    |   |   |-- bezier.ts
    |   |   |-- catmullRom.ts
    |   |   |-- loftSampling.ts
    |   |   |-- railFit.ts
    |   |   |-- spineFrames.ts
    |   |   `-- transforms.ts
    |   |-- runtime
    |   |   `-- audio
    |   |       |-- AudioEngine.ts
    |   |       |-- ClipLibrary.ts
    |   |       |-- SamplerKeys.ts
    |   |       `-- TimelineTransport.ts
    |   |-- shared
    |   |   |-- buildTypes.ts
    |   |   |-- constants.ts
    |   |   |-- exportTypes.ts
    |   |   |-- partsTypes.ts
    |   |   |-- productSchema.ts
    |   |   `-- viewSettingsTypes.ts
    |   |-- tests
    |   |   |-- geometry
    |   |   |-- pipeline
    |   |   `-- products
    |   |-- viewer
    |   |   |-- assets
    |   |   |-- controlViz
    |   |   |   `-- ControlSpheres.ts
    |   |   |-- gizmo
    |   |   |   |-- GizmoController.ts
    |   |   |   `-- TransformGizmo.ts
    |   |   |-- materials
    |   |   |   `-- materialLibrary.ts
    |   |   |-- overlay
    |   |   |   `-- AxisGizmo.ts
    |   |   |-- renderers
    |   |   |   |-- MeshRenderer.ts
    |   |   |   `-- PartsRenderer.ts
    |   |   |-- scene
    |   |   |   |-- CameraController.ts
    |   |   |   `-- SceneManager.ts
    |   |   `-- Viewer.ts
    |   |-- worker
    |   |   |-- oc
    |   |   |   `-- ocInit.ts
    |   |   |-- pipeline
    |   |   |   |-- artifactEmitter.ts
    |   |   |   |-- buildPipeline.ts
    |   |   |   |-- exportService.ts
    |   |   |   |-- paramRouting.ts
    |   |   |   |-- partsSpec.ts
    |   |   |   |-- signatures.ts
    |   |   |   `-- stageAssembler.ts
    |   |   |-- products
    |   |   |   |-- foothook
    |   |   |   |   |-- parts
    |   |   |   |   |   |-- baseplate.ts
    |   |   |   |   |   |-- heelKick.ts
    |   |   |   |   |   `-- toeHook.ts
    |   |   |   |   `-- buildFoothook.ts
    |   |   |   |-- footpad
    |   |   |   `-- rail
    |   |   |-- scheduler.ts
    |   |   |-- validation.ts
    |   |   `-- worker.ts
    |   |-- App.css
    |   |-- App.tsx
    |   |-- index.css
    |   `-- main.tsx
    |-- .gitignore
    |-- dev-start.err.log
    |-- dev-start.out.log
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.app.json
    |-- tsconfig.json
    |-- tsconfig.node.json
    `-- vite.config.ts
```



---

----------------------------------
## ACTUAL repo in /20/ (2026-03-03 22:57 condensed short tree)
----------------------------------

```text
`-- parahook
    |-- docs
    |   |-- humanplan.md
    |   |-- listofchanges.md
    |   |-- targetrepo.md
    |   `-- old/
    |-- public
    |   `-- vite.svg
    |-- src
    |   |-- app
    |   |   |-- components/
    |   |   |-- io/
    |   |   |-- modes/
    |   |   |-- panels/
    |   |   |-- parts/
    |   |   |-- presets/
    |   |   |-- spaghetti/
    |   |   |-- store/
    |   |   |-- theme/
    |   |   |-- AppShell.tsx
    |   |   |-- bootstrapBuildWiring.ts
    |   |   |-- buildDispatcher.ts
    |   |   |-- main.tsx
    |   |   |-- protocol.ts
    |   |   `-- viewerBridge.ts
    |   |-- assets/
    |   |-- geometry/
    |   |-- runtime/
    |   |-- shared/
    |   |-- tests/
    |   |-- viewer/
    |   |-- worker/
    |   |-- App.css
    |   |-- App.tsx
    |   |-- index.css
    |   `-- main.tsx
    |-- .gitignore
    |-- dev-start.err.log
    |-- dev-start.out.log
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.app.json
    |-- tsconfig.json
    |-- tsconfig.node.json
    `-- vite.config.ts
```

---

----------------------------------
## ACTUAL repo in /20/ (2026-03-03 23:18 condensed short tree)
----------------------------------

```text
`-- parahook
    |-- docs
    |   |-- datNEWNEW_task-list.md
    |   |-- humanplan.md
    |   |-- listofchanges.md
    |   |-- Master Plan Chat.md
    |   |-- Master Plan Human.md
    |   |-- rules.md
    |   |-- targetrepo.md
    |   |-- wishlist_Params.md
    |   `-- old/
    |-- public
    |   `-- vite.svg
    |-- src
    |   |-- app/
    |   |-- assets/
    |   |-- geometry/
    |   |-- runtime/
    |   |-- shared/
    |   |-- tests/
    |   |-- viewer/
    |   |-- worker/
    |   |-- App.css
    |   |-- App.tsx
    |   |-- index.css
    |   `-- main.tsx
    |-- .gitignore
    |-- dev-start.err.log
    |-- dev-start.out.log
    |-- eslint.config.js
    |-- index.html
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.app.json
    |-- tsconfig.json
    |-- tsconfig.node.json
    `-- vite.config.ts
```

---


---

## Repo Hierarchy (as of 2026-03-04 18:19)

```text
Folder PATH listing
Volume serial number is 00000055 6604:E599
C:\USERS\RUBBE\DESKTOP\PARAHOOKCONFIG\20\PARAHOOK
|   .gitignore
|   AGENTS.md
|   CHANGELOG.md
|   dev-start.err.log
|   dev-start.out.log
|   eslint.config.js
|   index.html
|   package-lock.json
|   package.json
|   README.md
|   tsconfig.app.json
|   tsconfig.json
|   tsconfig.node.json
|   vite.config.ts
|   
+---.github
|   \---workflows
|           deploy-pages.yml
|           
+---dist
|   |   index.html
|   |   vite.svg
|   |   
|   \---assets
|           index-CQtrlgVL.js
|           index-CtIJ-moC.css
|           worker-BGgkRTKb.js
|           
+---docs
|   |   datNEWNEW_task-list.md
|   |   humanplan.md
|   |   listofchanges.md
|   |   Master Plan Chat.md
|   |   Master Plan Human.md
|   |   NODE-tasklist.md
|   |   repo-tree-screenshot-2026-03-04.png
|   |   rules.md
|   |   targetrepo.md
|   |   wishlist_Params.md
|   |   
|   +---old
|   |       listofchanges_2026-03-03_134519.md
|   |       nodeLIST.md
|   |       oldchanges.md
|   |       
|   \---tasks
|           master-tasks.md
|           
+---node_modules
|   |   .package-lock.json
|   |   
|   +---.bin
|   |       acorn
|   |       acorn.cmd
|   |       acorn.ps1
|   |       baseline-browser-mapping
|   |       baseline-browser-mapping.cmd
|   |       baseline-browser-mapping.ps1
|   |       browserslist
|   |       browserslist.cmd
|   |       browserslist.ps1
|   |       esbuild
|   |       esbuild.cmd
|   |       esbuild.ps1
|   |       eslint
|   |       eslint.cmd
|   |       eslint.ps1
|   |       js-yaml
|   |       js-yaml.cmd
|   |       js-yaml.ps1
|   |       jsesc
|   |       jsesc.cmd
|   |       jsesc.ps1
|   |       json5
|   |       json5.cmd
|   |       json5.ps1
|   |       nanoid
|   |       nanoid.cmd
|   |       nanoid.ps1
|   |       node-which
|   |       node-which.cmd
|   |       node-which.ps1
|   |       parser
|   |       parser.cmd
|   |       parser.ps1
|   |       rollup
|   |       rollup.cmd
|   |       rollup.ps1
|   |       semver
|   |       semver.cmd
|   |       semver.ps1
|   |       tsc
|   |       tsc.cmd
|   |       tsc.ps1
|   |       tsserver
|   |       tsserver.cmd
|   |       tsserver.ps1
|   |       update-browserslist-db
|   |       update-browserslist-db.cmd
|   |       update-browserslist-db.ps1
|   |       vite
|   |       vite-node
|   |       vite-node.cmd
|   |       vite-node.ps1
|   |       vite.cmd
|   |       vite.ps1
|   |       vitest
|   |       vitest.cmd
|   |       vitest.ps1
|   |       why-is-node-running
|   |       why-is-node-running.cmd
|   |       why-is-node-running.ps1
|   |       
|   +---.tmp
|   |       tsconfig.app.tsbuildinfo
|   |       tsconfig.node.tsbuildinfo
|   |       
|   +---.vite
|   |   +---deps
|   |   |       chunk-G3PMV62Z.js
|   |   |       chunk-G3PMV62Z.js.map
|   |   |       chunk-ITCRF2YK.js
|   |   |       chunk-ITCRF2YK.js.map
|   |   |       chunk-IWOBEF4E.js
|   |   |       chunk-IWOBEF4E.js.map
|   |   |       chunk-RY7GF66K.js
|   |   |       chunk-RY7GF66K.js.map
|   |   |       package.json
|   |   |       react-dom.js
|   |   |       react-dom.js.map
|   |   |       react-dom_client.js
|   |   |       react-dom_client.js.map
|   |   |       react.js
|   |   |       react.js.map
|   |   |       react_jsx-dev-runtime.js
|   |   |       react_jsx-dev-runtime.js.map
|   |   |       react_jsx-runtime.js
|   |   |       react_jsx-runtime.js.map
|   |   |       three.js
|   |   |       three.js.map
|   |   |       three_examples_jsm_controls_OrbitControls__js.js
|   |   |       three_examples_jsm_controls_OrbitControls__js.js.map
|   |   |       three_examples_jsm_controls_TransformControls__js.js
|   |   |       three_examples_jsm_controls_TransformControls__js.js.map
|   |   |       zod.js
|   |   |       zod.js.map
|   |   |       zustand.js
|   |   |       zustand.js.map
|   |   |       _metadata.json
|   |   |       
|   |   \---vitest
|   |       \---da39a3ee5e6b4b0d3255bfef95601890afd80709
|   |               results.json
|   |               
|   +---.vite-temp
|   +---@babel
|   |   +---code-frame
|   |   |   |   LICENSE
|   |   |   |   package.json
|   |   |   |   README.md
|   |   |   |   
|   |   |   \---lib
|   |   |           index.js
|   |   |           index.js.map
|   |   |           
|   |   +---compat-data
|   |   |   |   corejs2-built-ins.js
|   |   |   |   corejs3-shipped-proposals.js
|   |   |   |   LICENSE
|   |   |   |   native-modules.js
|   |   |   |   overlapping-plugins.js
|   |   |   |   package.json
|   |   |   |   plugin-bugfixes.js
|   |   |   |   plugins.js
|   |   |   |   README.md
|   |   |   |   
|   |   |   \---data
|   |   |           corejs2-built-ins.json
|   |   |           corejs3-shipped-proposals.json
|   |   |           native-modules.json
|   |   |           overlapping-plugins.json
|   |   |           plugin-bugfixes.json
|   |   |           plugins.json
|   |   |           
|   |   +---core
|   |   |   |   LICENSE
|   |   |   |   package.json
|   |   |   |   README.md
|   |   |   |   
|   |   |   +---lib
|   |   |   |   |   index.js
|   |   |   |   |   index.js.map
|   |   |   |   |   parse.js
|   |   |   |   |   parse.js.map
|   |   |   |   |   transform-ast.js
|   |   |   |   |   transform-ast.js.map
|   |   |   |   |   transform-file-browser.js
|   |   |   |   |   transform-file-browser.js.map
|   |   |   |   |   transform-file.js
|   |   |   |   |   transform-file.js.map
|   |   |   |   |   transform.js
|   |   |   |   |   transform.js.map
|   |   |   |   |   
|   |   |   |   +---config
|   |   |   |   |   |   cache-contexts.js
|   |   |   |   |   |   cache-contexts.js.map
|   |   |   |   |   |   caching.js
|   |   |   |   |   |   caching.js.map
|   |   |   |   |   |   config-chain.js
|   |   |   |   |   |   config-chain.js.map
|   |   |   |   |   |   config-descriptors.js
|   |   |   |   |   |   config-descriptors.js.map
|   |   |   |   |   |   full.js
|   |   |   |   |   |   full.js.map
|   |   |   |   |   |   index.js
|   |   |   |   |   |   index.js.map
|   |   |   |   |   |   item.js
|   |   |   |   |   |   item.js.map
|   |   |   |   |   |   partial.js
|   |   |   |   |   |   partial.js.map
|   |   |   |   |   |   pattern-to-regex.js
|   |   |   |   |   |   pattern-to-regex.js.map
|   |   |   |   |   |   plugin.js
|   |   |   |   |   |   plugin.js.map
|   |   |   |   |   |   printer.js
|   |   |   |   |   |   printer.js.map
|   |   |   |   |   |   resolve-targets-browser.js
|   |   |   |   |   |   resolve-targets-browser.js.map
|   |   |   |   |   |   resolve-targets.js
|   |   |   |   |   |   resolve-targets.js.map
|   |   |   |   |   |   util.js
|   |   |   |   |   |   util.js.map
|   |   |   |   |   |   
|   |   |   |   |   +---files
|   |   |   |   |   |       configuration.js
|   |   |   |   |   |       configuration.js.map
|   |   |   |   |   |       import.cjs
|   |   |   |   |   |       import.cjs.map
|   |   |   |   |   |       index-browser.js
|   |   |   |   |   |       index-browser.js.map
|   |   |   |   |   |       index.js
|   |   |   |   |   |       index.js.map
|   |   |   |   |   |       module-types.js
|   |   |   |   |   |       module-types.js.map
|   |   |   |   |   |       package.js
|   |   |   |   |   |       package.js.map
|   |   |   |   |   |       plugins.js
|   |   |   |   |   |       plugins.js.map
|   |   |   |   |   |       types.js
|   |   |   |   |   |       types.js.map
|   |   |   |   |   |       utils.js
|   |   |   |   |   |       utils.js.map
|   |   |   |   |   |       
|   |   |   |   |   +---helpers
|   |   |   |   |   |       config-api.js
|   |   |   |   |   |       config-api.js.map
|   |   |   |   |   |       deep-array.js
... (truncated)
```

----------------------------------
## ACTUAL repo in /20/ (2026-03-04 18:20 current snapshot)
----------------------------------

```text
Folder PATH listing
Volume serial number is 0000000C 6604:E599
C:\USERS\RUBBE\DESKTOP\PARAHOOKCONFIG\20
\---parahook
    |   .gitignore
    |   AGENTS.md
    |   CHANGELOG.md
    |   dev-start.err.log
    |   dev-start.out.log
    |   eslint.config.js
    |   index.html
    |   package-lock.json
    |   package.json
    |   README.md
    |   tsconfig.app.json
    |   tsconfig.json
    |   tsconfig.node.json
    |   vite.config.ts
    |   
    +---.github
    |   \---workflows
    |           deploy-pages.yml
    |           
    +---dist
    |   |   index.html
    |   |   vite.svg
    |   |   
    |   \---assets
    |           index-CQtrlgVL.js
    |           index-CtIJ-moC.css
    |           worker-BGgkRTKb.js
    |           
    +---docs
    |   |   datNEWNEW_task-list.md
    |   |   humanplan.md
    |   |   listofchanges.md
    |   |   Master Plan Chat.md
    |   |   Master Plan Human.md
    |   |   NODE-tasklist.md
    |   |   repo-tree-screenshot-2026-03-04.png
    |   |   rules.md
    |   |   targetrepo.md
    |   |   wishlist_Params.md
    |   |   
    |   +---old
    |   |       listofchanges_2026-03-03_134519.md
    |   |       nodeLIST.md
    |   |       oldchanges.md
    |   |       
    |   \---tasks
    |           master-tasks.md
    |           
    +---node_modules
    |   |   .package-lock.json
    |   |   
    |   +---.bin
    |   |       acorn
    |   |       acorn.cmd
    |   |       acorn.ps1
    |   |       baseline-browser-mapping
    |   |       baseline-browser-mapping.cmd
    |   |       baseline-browser-mapping.ps1
    |   |       browserslist
    |   |       browserslist.cmd
    |   |       browserslist.ps1
    |   |       esbuild
    |   |       esbuild.cmd
    |   |       esbuild.ps1
    |   |       eslint
    |   |       eslint.cmd
    |   |       eslint.ps1
    |   |       js-yaml
    |   |       js-yaml.cmd
    |   |       js-yaml.ps1
    |   |       jsesc
    |   |       jsesc.cmd
    |   |       jsesc.ps1
    |   |       json5
    |   |       json5.cmd
    |   |       json5.ps1
    |   |       nanoid
    |   |       nanoid.cmd
    |   |       nanoid.ps1
    |   |       node-which
    |   |       node-which.cmd
    |   |       node-which.ps1
    |   |       parser
    |   |       parser.cmd
    |   |       parser.ps1
    |   |       rollup
    |   |       rollup.cmd
    |   |       rollup.ps1
    |   |       semver
    |   |       semver.cmd
    |   |       semver.ps1
    |   |       tsc
    |   |       tsc.cmd
    |   |       tsc.ps1
    |   |       tsserver
    |   |       tsserver.cmd
    |   |       tsserver.ps1
    |   |       update-browserslist-db
    |   |       update-browserslist-db.cmd
    |   |       update-browserslist-db.ps1
    |   |       vite
    |   |       vite-node
    |   |       vite-node.cmd
    |   |       vite-node.ps1
    |   |       vite.cmd
    |   |       vite.ps1
    |   |       vitest
    |   |       vitest.cmd
    |   |       vitest.ps1
    |   |       why-is-node-running
    |   |       why-is-node-running.cmd
    |   |       why-is-node-running.ps1
    |   |       
    |   +---.tmp
    |   |       tsconfig.app.tsbuildinfo
    |   |       tsconfig.node.tsbuildinfo
    |   |       
    |   +---.vite
    |   |   +---deps
    |   |   |       chunk-G3PMV62Z.js
    |   |   |       chunk-G3PMV62Z.js.map
    |   |   |       chunk-ITCRF2YK.js
    |   |   |       chunk-ITCRF2YK.js.map
    |   |   |       chunk-IWOBEF4E.js
    |   |   |       chunk-IWOBEF4E.js.map
    |   |   |       chunk-RY7GF66K.js
    |   |   |       chunk-RY7GF66K.js.map
    |   |   |       package.json
    |   |   |       react-dom.js
    |   |   |       react-dom.js.map
    |   |   |       react-dom_client.js
    |   |   |       react-dom_client.js.map
    |   |   |       react.js
    |   |   |       react.js.map
    |   |   |       react_jsx-dev-runtime.js
    |   |   |       react_jsx-dev-runtime.js.map
    |   |   |       react_jsx-runtime.js
    |   |   |       react_jsx-runtime.js.map
    |   |   |       three.js
    |   |   |       three.js.map
    |   |   |       three_examples_jsm_controls_OrbitControls__js.js
    |   |   |       three_examples_jsm_controls_OrbitControls__js.js.map
    |   |   |       three_examples_jsm_controls_TransformControls__js.js
    |   |   |       three_examples_jsm_controls_TransformControls__js.js.map
    |   |   |       zod.js
    |   |   |       zod.js.map
    |   |   |       zustand.js
    |   |   |       zustand.js.map
    |   |   |       _metadata.json
    |   |   |       
    |   |   \---vitest
    |   |       \---da39a3ee5e6b4b0d3255bfef95601890afd80709
    |   |               results.json
    |   |               
    |   +---.vite-temp
    |   +---@babel
    |   |   +---code-frame
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---lib
    |   |   |           index.js
    |   |   |           index.js.map
    |   |   |           
    |   |   +---compat-data
    |   |   |   |   corejs2-built-ins.js
    |   |   |   |   corejs3-shipped-proposals.js
    |   |   |   |   LICENSE
    |   |   |   |   native-modules.js
    |   |   |   |   overlapping-plugins.js
    |   |   |   |   package.json
    |   |   |   |   plugin-bugfixes.js
    |   |   |   |   plugins.js
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   \---data
    |   |   |           corejs2-built-ins.json
    |   |   |           corejs3-shipped-proposals.json
    |   |   |           native-modules.json
    |   |   |           overlapping-plugins.json
    |   |   |           plugin-bugfixes.json
    |   |   |           plugins.json
    |   |   |           
    |   |   +---core
    |   |   |   |   LICENSE
    |   |   |   |   package.json
    |   |   |   |   README.md
    |   |   |   |   
    |   |   |   +---lib
    |   |   |   |   |   index.js
    |   |   |   |   |   index.js.map
    |   |   |   |   |   parse.js
    |   |   |   |   |   parse.js.map
    |   |   |   |   |   transform-ast.js
    |   |   |   |   |   transform-ast.js.map
    |   |   |   |   |   transform-file-browser.js
    |   |   |   |   |   transform-file-browser.js.map
    |   |   |   |   |   transform-file.js
    |   |   |   |   |   transform-file.js.map
    |   |   |   |   |   transform.js
    |   |   |   |   |   transform.js.map
    |   |   |   |   |   
    |   |   |   |   +---config
    |   |   |   |   |   |   cache-contexts.js
    |   |   |   |   |   |   cache-contexts.js.map
    |   |   |   |   |   |   caching.js
    |   |   |   |   |   |   caching.js.map
    |   |   |   |   |   |   config-chain.js
    |   |   |   |   |   |   config-chain.js.map
    |   |   |   |   |   |   config-descriptors.js
    |   |   |   |   |   |   config-descriptors.js.map
    |   |   |   |   |   |   full.js
    |   |   |   |   |   |   full.js.map
    |   |   |   |   |   |   index.js
    |   |   |   |   |   |   index.js.map
    |   |   |   |   |   |   item.js
    |   |   |   |   |   |   item.js.map
    |   |   |   |   |   |   partial.js
    |   |   |   |   |   |   partial.js.map
    |   |   |   |   |   |   pattern-to-regex.js
    |   |   |   |   |   |   pattern-to-regex.js.map
    |   |   |   |   |   |   plugin.js
    |   |   |   |   |   |   plugin.js.map
    |   |   |   |   |   |   printer.js
    |   |   |   |   |   |   printer.js.map
    |   |   |   |   |   |   resolve-targets-browser.js
    |   |   |   |   |   |   resolve-targets-browser.js.map
    |   |   |   |   |   |   resolve-targets.js
    |   |   |   |   |   |   resolve-targets.js.map
    |   |   |   |   |   |   util.js
    |   |   |   |   |   |   util.js.map
    |   |   |   |   |   |   
    |   |   |   |   |   +---files
    |   |   |   |   |   |       configuration.js
    |   |   |   |   |   |       configuration.js.map
    |   |   |   |   |   |       import.cjs
    |   |   |   |   |   |       import.cjs.map
    |   |   |   |   |   |       index-browser.js
    |   |   |   |   |   |       index-browser.js.map
    |   |   |   |   |   |       index.js
    |   |   |   |   |   |       index.js.map
    |   |   |   |   |   |       module-types.js
    |   |   |   |   |   |       module-types.js.map
    |   |   |   |   |   |       package.js
    |   |   |   |   |   |       package.js.map
    |   |   |   |   |   |       plugins.js
    |   |   |   |   |   |       plugins.js.map
    |   |   |   |   |   |       types.js
    |   |   |   |   |   |       types.js.map
    |   |   |   |   |   |       utils.js
    |   |   |   |   |   |       utils.js.map
    |   |   |   |   |   |       
    |   |   |   |   |   +---helpers
    |   |   |   |   |   |       config-api.js
    |   |   |   |   |   |       config-api.js.map
    |   |   |   |   |   |       deep-array.js
    |   |   |   |   |   |       deep-array.js.map
    |   |   |   |   |   |       environment.js
    |   |   |   |   |   |       environment.js.map
    |   |   |   |   |   |       
    |   |   |   |   |   \---validation
    |   |   |   |   |           option-assertions.js
    |   |   |   |   |           option-assertions.js.map
    |   |   |   |   |           options.js
    |   |   |   |   |           options.js.map
    |   |   |   |   |           plugins.js
    |   |   |   |   |           plugins.js.map
    |   |   |   |   |           removed.js
    |   |   |   |   |           removed.js.map
    |   |   |   |   |           
    |   |   |   |   +---errors
    |   |   |   |   |       config-error.js
    |   |   |   |   |       config-error.js.map
    |   |   |   |   |       rewrite-stack-trace.js
    |   |   |   |   |       rewrite-stack-trace.js.map
    |   |   |   |   |       
    |   |   |   |   +---gensync-utils
    |   |   |   |   |       async.js
    |   |   |   |   |       async.js.map
    |   |   |   |   |       fs.js
    |   |   |   |   |       fs.js.map
    |   |   |   |   |       functional.js
    |   |   |   |   |       functional.js.map
    |   |   |   |   |       
    |   |   |   |   +---parser
    |   |   |   |   |   |   index.js
    |   |   |   |   |   |   index.js.map
    |   |   |   |   |   |   
    |   |   |   |   |   \---util
    |   |   |   |   |           missing-plugin-helper.js
    |   |   |   |   |           missing-plugin-helper.js.map
    |   |   |   |   |           
    |   |   |   |   +---tools
    |   |   |   |   |       build-external-helpers.js
    |   |   |   |   |       build-external-helpers.js.map
    |   |   |   |   |       
    |   |   |   |   +---transformation
    |   |   |   |   |   |   block-hoist-plugin.js
    |   |   |   |   |   |   block-hoist-plugin.js.map
    |   |   |   |   |   |   index.js
    |   |   |   |   |   |   index.js.map
    |   |   |   |   |   |   normalize-file.js
    |   |   |   |   |   |   normalize-file.js.map
    |   |   |   |   |   |   normalize-opts.js
    |   |   |   |   |   |   normalize-opts.js.map
    |   |   |   |   |   |   plugin-pass.js
    |   |   |   |   |   |   plugin-pass.js.map
    |   |   |   |   |   |   
    |   |   |   |   |   +---file
    |   |   |   |   |   |       babel-7-helpers.cjs
    |   |   |   |   |   |       babel-7-helpers.cjs.map
    |   |   |   |   |   |       file.js
    |   |   |   |   |   |       file.js.map
    |   |   |   |   |   |       generate.js
    |   |   |   |   |   |       generate.js.map
    |   |   |   |   |   |       merge-map.js
    |   |   |   |   |   |       merge-map.js.map
    |   |   |   |   |   |       
    |   |   |   |   |   \---util
    |   |   |   |   |           clone-deep.js
    |   |   |   |   |           clone-deep.js.map
    |   |   |   |   |           
    |   |   |   |   \---vendor
    |   |   |   |           import-meta-resolve.js
    |   |   |   |           import-meta-resolve.js.map
    |   |   |   |           
    |   |   |   \---src
    |   |   |       |   transform-file-browser.ts
    |   |   |       |   transform-file.ts
    |   |   |       |   
    |   |   |       \---config
    |   |   |           |   resolve-targets-browser.ts
    |   |   |           |   resolve-targets.ts
    |   |   |           |   
    |   |   |           \---files
... (truncated)
```


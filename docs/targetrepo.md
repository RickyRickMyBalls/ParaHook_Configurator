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

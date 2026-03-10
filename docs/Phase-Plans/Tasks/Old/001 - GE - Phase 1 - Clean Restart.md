# 001 - GE - Phase 1 - Clean Restart

## Doc History
1. 2026-03-06 17:35: Added top-level `Summary`, `Core Concepts`, and `Golden Rules` sections so this restored task reads more like a proper historical phase doc
2. 2026-03-06 17:31: Added restored-history context at the top so this file is clearly framed as a reconstruction from `8 - chatgpt.md`, not a literal original plan doc

## Restored Context

This file should be read as a restored early-phase task doc.

It appears to capture the first real executable vertical-slice plan from:
- `/docs/History/8 - chatgpt.md`

Important note:
- this is not being treated as a guaranteed literal original task file that existed at the time
- it is being treated as a strong reconstructed first-phase plan based on the clean-restart conversation history
- it likely represents the first concrete implementation slice inside restored:
  - `GE - Phase 1 - Clean Restart Architecture`

## Summary

This restored phase captures the first practical bring-up slice of the restarted `/20/` app.

The point of this phase was to prove that the new architecture could stand up end to end:
- UI captures inputs
- app/store routes intent
- a warm worker receives build requests
- the worker returns deterministic stub output
- the viewer renders that output cleanly

This was not about real CAD yet.

It was about proving the new engine shape with the smallest useful vertical slice.

## Core Concepts

- Clean layer separation
  - app/UI captures intent
  - worker executes build logic
  - viewer renders results
- Shared contracts
  - request/result types should live in shared files, not be duplicated ad hoc
- Warm worker baseline
  - the worker should stay alive and receive repeated build requests instead of being recreated
- Latest-only thinking
  - newer requests win and stale results should not overwrite current state
- Stub geometry first
  - prove the system with a simple box before real ParaHook geometry
- End-to-end proof over feature breadth
  - one complete vertical slice is more valuable than many disconnected half-systems

## Golden Rules

- Do not let UI code perform CAD work directly
- Do not let viewer code become a second geometry engine
- Keep message/request/result types centralized and shared
- Keep the worker warm and sequence-aware
- Prefer deterministic simple output over premature geometry complexity
- Prove the pipeline works before expanding the feature surface

## Restored Task Text

You are setting up a brand-new production-grade repo called "parahook".

Tech stack:
- Vite
- React
- TypeScript
- Three.js
- Web Worker
- Zod
- Zustand

Goals:
- Warm worker (never restarts)
- Latest-only scheduling
- No history scrubber
- Parts List system instead
- Profile Editor = primary geometry source
- Jake Mode = constraint wrapper
- Multi-product scalable
- Audio sampler runtime subsystem
- Strict UI / Worker / Geometry isolation
- Deterministic artifact pipeline

Create the complete folder structure exactly as specified below.
Do NOT simplify.
Do NOT merge folders.
Respect separation boundaries.

==================================================
STEP 1 — Initialize Project
==================================================

npm create vite@latest parahook -- --template react-ts
cd parahook
npm install
npm install three zustand zod

==================================================
STEP 2 — Create Folder Structure
==================================================

Inside src/, create:

app/
app/store/
app/modes/profileEditor/
app/modes/jakeMode/
app/panels/
app/components/
app/io/
app/presets/

viewer/
viewer/scene/
viewer/renderers/
viewer/gizmo/
viewer/controlViz/
viewer/materials/
viewer/assets/

worker/
worker/pipeline/
worker/products/
worker/products/foothook/
worker/products/foothook/parts/
worker/products/footpad/
worker/products/rail/
worker/oc/

geometry/

runtime/
runtime/audio/

shared/

tests/
tests/geometry/
tests/pipeline/
tests/products/

==================================================
STEP 3 — Create Core Files
==================================================

Create empty starter files:

src/app/store/useAppStore.ts
src/app/store/intentClassifier.ts
src/app/store/partsListStore.ts
src/app/store/audioSamplerStore.ts

src/app/protocol.ts
src/app/buildDispatcher.ts

src/app/panels/PartsListPanel.tsx
src/app/panels/MaterialPanel.tsx
src/app/panels/AudioSamplerPanel.tsx
src/app/panels/RadioPanel.tsx

src/app/components/Toolbar.tsx
src/app/components/BuildStatus.tsx

src/viewer/Viewer.ts
src/viewer/scene/SceneManager.ts
src/viewer/renderers/MeshRenderer.ts
src/viewer/renderers/PartsRenderer.ts
src/viewer/materials/materialLibrary.ts
src/viewer/gizmo/GizmoController.ts
src/viewer/controlViz/ControlSpheres.ts

src/worker/worker.ts
src/worker/scheduler.ts
src/worker/validation.ts
src/worker/pipeline/buildPipeline.ts
src/worker/pipeline/stageAssembler.ts
src/worker/pipeline/artifactEmitter.ts
src/worker/pipeline/exportService.ts
src/worker/oc/ocInit.ts

src/worker/products/foothook/buildFoothook.ts
src/worker/products/foothook/parts/baseplate.ts
src/worker/products/foothook/parts/heelKick.ts
src/worker/products/foothook/parts/toeHook.ts

src/geometry/bezier.ts
src/geometry/catmullRom.ts
src/geometry/loftSampling.ts
src/geometry/railFit.ts
src/geometry/spineFrames.ts
src/geometry/transforms.ts

src/runtime/audio/AudioEngine.ts
src/runtime/audio/TimelineTransport.ts
src/runtime/audio/SamplerKeys.ts
src/runtime/audio/ClipLibrary.ts

src/shared/productSchema.ts
src/shared/partsTypes.ts
src/shared/buildTypes.ts
src/shared/exportTypes.ts
src/shared/constants.ts

==================================================
STEP 4 — Enforce Architectural Rules
==================================================

Rules:

1. app/ must never import from worker/ or geometry/
2. geometry/ must never import three or replicad
3. worker/ may import geometry/
4. viewer/ must never import worker/
5. All worker communication goes through protocol.ts

==================================================
STEP 5 — Minimal Worker Skeleton
==================================================

Create worker.ts with:

- message listener
- scheduler integration
- build request handler
- export request handler
- warm OpenCascade init
- stale-drop protection

Do not implement geometry yet.
Just stub deterministic artifact return.

==================================================
STEP 6 — Minimal Viewer Skeleton
==================================================

Create Viewer.ts with:

- Scene
- Camera
- Renderer
- Resize handling
- render loop
- ability to receive mesh payload

==================================================
STEP 7 — Confirm Build
==================================================

npm run dev

Ensure project compiles with zero TypeScript errors.

==================================================
END OF SETUP
==================================================





# MAYBE task 2? - or maybe gap in time from repo set up to this task

You are implementing the first vertical slice of the ParaHook app.

Goal:
Create a working system where:
- UI has 3 sliders: width, length, height
- Changing sliders triggers a worker build
- Worker returns a simple box mesh definition
- Viewer renders the box
- Worker is warm and uses latest-only scheduling
- No real CAD, just stub geometry

==================================================
STEP 1 — Define Shared Types
==================================================

Create src/shared/buildTypes.ts

Define:

export type BoxParams = {
  width: number
  length: number
  height: number
}

export type BuildRequest = {
  type: "build"
  seq: number
  payload: BoxParams
}

export type BuildResult = {
  type: "build_result"
  seq: number
  mesh: {
    width: number
    length: number
    height: number
  }
}

==================================================
STEP 2 — Zustand Store
==================================================

Create src/app/store/useAppStore.ts

Store must contain:

- box: BoxParams
- setBoxParam(key, value)
- lastBuildSeq
- setBuildResult(result)

When box changes, call buildDispatcher.requestBuild(box)

==================================================
STEP 3 — Build Dispatcher
==================================================

Create src/app/buildDispatcher.ts

- Create worker:
  new Worker(new URL("../worker/worker.ts", import.meta.url), { type: "module" })

- Maintain sequence counter

- Implement requestBuild(params):
  increment seq
  post BuildRequest
  ignore stale results
  forward latest result to store

==================================================
STEP 4 — Worker
==================================================

Implement src/worker/worker.ts

- Keep global currentSeq
- On message:
    if type === "build"
       if seq < currentSeq → ignore
       else:
         set currentSeq
         post back BuildResult
         echo width/length/height

No CAD. Just echo values.

==================================================
STEP 5 — Viewer
==================================================

Implement src/viewer/Viewer.ts

- Setup Three.js scene
- Camera
- Renderer
- Render loop
- Function updateBox({width, length, height})
    Remove previous mesh
    Create new THREE.BoxGeometry(length, height, width)
    Add to scene

==================================================
STEP 6 — ViewerHost Component
==================================================

Create src/app/components/ViewerHost.tsx

- Mount Viewer instance using useRef + useEffect
- Subscribe to build result from store
- Call viewer.updateBox when result changes

==================================================
STEP 7 — UI Sliders
==================================================

Create src/app/panels/BoxPanel.tsx

Render 3 sliders:

Width
Length
Height

Each slider:
- value from store
- onChange → setBoxParam

==================================================
STEP 8 — App Shell
==================================================

Create src/app/main.tsx

Render:

<div style={{display: "flex"}}>
  <BoxPanel />
  <ViewerHost />
</div>

==================================================
DONE CRITERIA
==================================================

- npm run dev works
- Sliders update box size in real time
- Worker stays warm
- No TypeScript errors
- Latest-only scheduling enforced
# Engine Architecture

Purpose:

This file explains the ParaHook engine in plain English.

It is meant to answer:
- where the real source of truth lives
- what the worker does
- what the viewer does
- how legacy mode and Spaghetti mode fit together
- how data moves through the app

## Short Version

ParaHook is built as three main systems:

1. The app layer
   - UI
   - Zustand stores
   - authoring state
   - compile requests
2. The worker layer
   - deterministic build execution
   - part generation
   - build progress
3. The viewer layer
   - rendering only
   - camera
   - selection display
   - visibility display

The most important architectural rule is:

The app owns truth.
The worker computes.
The viewer displays.

## The Main Flow

At a high level, the app works like this:

User input
-> app state changes
-> build request is prepared
-> worker computes results
-> typed results come back
-> viewer renders those results

In code, the main runtime path is roughly:

`src/app`
-> `src/app/buildDispatcher.ts`
-> `src/worker/worker.ts`
-> `src/worker/pipeline/buildPipeline.ts`
-> typed outputs from `src/shared`
-> `src/app/components/ViewerHost.tsx`
-> `src/viewer/Viewer.ts`

## What The App Layer Owns

The app layer is the control center.

It owns:
- the current editing mode
- the current graph
- the current box params
- the current selected part
- visibility state
- compile state
- build policy
- worker results after they return

The canonical app state lives in Zustand stores.

Important stores:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

This means the worker is not the source of truth.
The viewer is not the source of truth.

They both depend on state prepared by the app layer.

## What The Worker Layer Owns

The worker layer owns build execution.

It does not own product truth.

Its job is:
- receive a serialized request
- validate message shape
- run deterministic build logic
- emit progress
- return typed results

Important files:
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/*`

The worker is isolated from the UI.

That is important because it keeps geometry/build logic separate from React behavior.

## What The Viewer Layer Owns

The viewer renders parts and assembled output.

It owns:
- Three.js scene state
- camera state
- render-only selection display
- render-only visibility display

It should not own:
- CAD logic
- graph logic
- canonical part definitions
- schema mutations

Important files:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

The viewer is a consumer of typed outputs, not a source of model truth.

## Shared Contracts

The layer boundary is enforced by shared types.

Important file:
- `src/shared/buildTypes.ts`

This is where the app and worker agree on:
- build request shape
- build result shape
- assemble result shape
- worker error shape
- part artifact shape

This is one of the strongest parts of the architecture.

The shared contract reduces hidden coupling between UI code and worker code.

## The Build Dispatcher

`src/app/buildDispatcher.ts` is the bridge between app state and the worker.

Its job is:
- create the worker
- send requests
- track request sequence numbers
- ignore stale worker results
- route progress into build stats
- route build results into the app store
- route assemble results into the app store
- route worker errors into the app store

This file is important because it keeps worker communication centralized instead of scattering worker calls across the UI.

## Startup Wiring

`src/main.tsx` calls `bootstrapBuildWiring()`.

That wiring step connects:
- the app store
- the build dispatcher
- build result handling
- assemble result handling
- worker error handling
- instance providers
- build-stats providers

Important file:
- `src/app/bootstrapBuildWiring.ts`

This is the setup step that makes the app feel like one connected system.

## Legacy Mode vs Spaghetti Mode

Right now the app supports two input paths:

1. Legacy mode
   - direct box-style params
   - simpler request path
2. Spaghetti mode
   - graph editing
   - compile step
   - graph-derived build request

Important state field:
- `inputMode` in `src/app/store/useAppStore.ts`

This is a major design decision:

Spaghetti is not a completely separate runtime.
It is a front-end authoring and compile system that feeds the same worker/build pipeline.

That means:
- you did not build two separate engines
- you built one execution engine with two authoring paths

## How Spaghetti Fits In

Spaghetti adds a compile layer between the editor and the worker.

The flow is:

Graph
-> evaluate/validate/resolve
-> compile graph into build inputs
-> translate build inputs into a worker request patch
-> worker builds `PartArtifact[]`
-> preview selectors map artifacts to OutputPreview slots
-> viewer renders preview parts

Important files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`

So the real engine shape is:

authoring
-> compile
-> deterministic worker build
-> typed artifacts
-> selector-owned render VM
-> viewer

## Why The Engine Feels Powerful

The engine is powerful because it is layered.

It separates:
- authoring
- build execution
- rendering
- contracts

That gives you room to add:
- new node systems
- new feature stack behavior
- new worker runtime operations
- new viewer behavior

without collapsing the whole app into one giant state machine.

## Why It Feels Hard To Understand

It feels hard to understand because the important logic is spread across several boundaries:

- store state
- compile logic
- request translation
- build dispatcher
- worker pipeline
- selectors
- viewer host

The architecture itself is not weak.
The complexity comes from the number of stages.

In other words:

the engine is organized well,
but it now needs better explanation and phase discipline so the mental model stays readable.

## The Most Important Rules

If you want to preserve this architecture, protect these rules:

1. App state is canonical.
2. Worker computes but does not own canonical model state.
3. Viewer renders but does not compute CAD.
4. Shared contracts define cross-layer communication.
5. Spaghetti compiles into the existing execution pipeline instead of creating a second hidden runtime.
6. Preview identity and build identity stay separate.

## Preview Identity vs Build Identity

This rule matters a lot in the current app.

Build/source identity:
- `nodeId`
- `partKey`
- `partKeyStr`

Preview/view identity:
- `slotId`
- `viewerKey`

That separation keeps the system honest.

It means:
- build artifacts keep their true source identity
- preview slots stay a presentation concern
- the viewer does not have to pretend slot identity is artifact identity

## Plain-English Summary

ParaHook is set up as a deterministic build engine with a UI in front of it and a viewer behind it.

The UI does not directly build geometry.
The viewer does not decide what the model is.
The worker does not own the app state.

The app decides what to build.
The worker builds it.
The viewer shows it.

Spaghetti is the graph-based authoring system that compiles into that same engine.

That is the core idea behind the current architecture.

# System Map

## Doc History
1. 2026-03-06 01:13: Updated doc history format to include time
2. 2026-03-06 01:13: Added local doc history block
3. 2026-03-06 01:13: Created the current `/20/` architecture map covering app shell, stores, selectors, compiler, dispatcher, worker, viewer, and identity boundaries

This is the one-page map of the current `/20/parahook` architecture.

Use this doc to answer:
- where does this behavior belong?
- which layer should own this change?
- what is source of truth vs derived view-model?

## Top-Level Shape

The current app is a layered system:

1. `React app shell`
2. `App stores`
3. `Selectors / derived view-models`
4. `Build dispatcher`
5. `Worker runtime`
6. `Viewer host / viewer`
7. `Spaghetti compiler front-end`

The main rule is:
- UI and app state live in the app layer
- build execution lives in the worker
- rendering lives in the viewer
- Spaghetti compiles graph state into build inputs; it does not replace the worker

## Current Entry Point

Main startup:
- `src/main.tsx`

What it does:
- starts React
- calls `bootstrapBuildWiring()`

Why that matters:
- build wiring is bootstrapped once at app startup
- React rendering and worker/build plumbing are intentionally separate

## App Layer

Main app shell:
- `src/app/AppShell.tsx`

This layer owns:
- top-level layout
- floating Spaghetti editor window shell
- viewport chrome
- major panels and toolbars

This layer should own:
- window layout
- panel composition
- UI container behavior

This layer should not own:
- CAD build logic
- compile logic
- viewer rendering internals

## App Stores

### Main app store

Main file:
- `src/app/store/useAppStore.ts`

This store owns app-level product state such as:
- current `box` params
- build mode / build policy
- current `parts`
- assembled result
- part visibility
- selected part
- input mode: `legacy` or `spaghetti`
- latest Spaghetti compile result
- pending Spaghetti build inputs metadata

This is the main product-state store.

Use this store for:
- product-level state
- build-related state
- part visibility and selection
- switching between legacy and Spaghetti input modes

Do not use this store for:
- detailed graph editing state that belongs to Spaghetti
- local viewer engine state

### Spaghetti store

Main file:
- `src/app/spaghetti/store/useSpaghettiStore.ts`

This store owns Spaghetti graph/editor state such as:
- the graph itself
- node and edge state
- selected node / selected edge
- edge waypoints
- feature-stack editing state
- graph-level compile helpers

Use this store for:
- graph topology
- node params and positions
- feature-stack editing
- graph interaction state

Do not use this store for:
- canonical built parts
- viewer-rendered output
- worker-owned execution state

### Other support stores

Examples:
- `src/app/store/buildStatsStore.ts`
- `src/app/store/uiPrefsStore.ts`

These support:
- build stats/status presentation
- user view preferences

## Selectors And Derived View-Models

Main idea:
- selectors turn canonical state into UI-facing read models
- they should aggregate truth, not invent parallel systems

Important area:
- `src/app/spaghetti/selectors/`

Examples:
- `selectPreviewRenderVm.ts`
- `selectDebugInspectorVm.ts`
- `selectNodeVm.ts`
- `selectDiagnosticsVm.ts`

Use selectors for:
- shaping data for UI
- deterministic ordering
- display-oriented aggregation
- debug read models

Do not use selectors for:
- mutating graph state
- mutating build outputs
- performing hidden repair logic

## Spaghetti Compiler Front-End

Important files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`

This layer owns:
- graph evaluation
- diagnostics
- feature-stack compilation
- conversion from graph state to build inputs
- runtime feature-stack payload preparation

The compiler layer answers:
- what did the graph mean?
- what parts were resolved?
- what feature-stack IR should be sent forward?
- what build inputs should the app request?

Important rule:
- Spaghetti is a front-end compiler into the existing build/runtime path
- it is not a replacement for the worker runtime

## Build Wiring

Important file:
- `src/app/bootstrapBuildWiring.ts`

This layer connects:
- app state
- build dispatcher
- worker result handlers

It decides:
- where changed param ids come from
- how build results return into the app store
- how assembled results return into the app store
- how spaghetti build metadata feeds the dispatcher

This is glue code, not business logic.

## Build Dispatcher

Important file:
- `src/app/buildDispatcher.ts`

This layer owns:
- worker creation
- request sequencing
- stale result handling
- build/assemble request sending
- build progress routing
- result validation
- build stats integration

Use this layer for:
- message transport and orchestration
- build request lifecycle
- worker message normalization

Do not use this layer for:
- graph editing
- viewer UI logic
- product layout/UI concerns

## Worker Runtime

Important area:
- `src/worker/`

The worker owns:
- actual build execution
- assemble execution
- export execution
- deterministic runtime operations

The worker should receive:
- typed requests

The worker should return:
- typed build results
- typed assemble results
- typed progress/errors

Important rule:
- the worker is execution, not source of truth

## Viewer Host And Viewer

Important files:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

`ViewerHost` owns:
- mounting the viewer
- feeding it parts or assembled output
- translating selected app/view state into viewer calls

The `Viewer` owns:
- actual rendering
- camera
- scene objects
- graphics behavior

Important rule:
- `ViewerHost` is app glue
- `Viewer` is render engine

## Preview Pipeline

Current Spaghetti preview pipeline:

`graph`
-> `compile/evaluate`
-> `worker build result (PartArtifact[])`
-> `OutputPreview slot mapping`
-> `selectPreviewRenderVm`
-> `ViewerHost`
-> `Viewer`

This is the most important current diagnostic path.

## Identity Boundaries

Two identities exist on purpose.

Build/source identity:
- `nodeId`
- `partKey`
- `partKeyStr`
- `PartArtifact`

Preview identity:
- `slotId`
- `viewerKey`

Important rule:
- preview identity is not the same thing as artifact/build identity
- `selectPreviewRenderVm` keeps preview rows slot-scoped even when they point at the same artifact identity

## OutputPreview

Important file:
- `src/app/spaghetti/system/outputPreviewNode.ts`

This is a system node used to map source parts into preview slots.

It belongs to:
- Spaghetti graph/system architecture

It does not belong to:
- the worker runtime
- the viewer engine

## Where Things Should Go

If the change is about:

- app layout or panel structure
  - put it in `src/app/*`

- product/build state
  - put it in `useAppStore.ts` or app-store-adjacent code

- graph structure, node editing, feature-stack editing
  - put it in `src/app/spaghetti/*`

- display shaping or debug read-models
  - put it in selectors

- worker request sequencing or message handling
  - put it in `buildDispatcher.ts`

- deterministic CAD build execution
  - put it in `src/worker/*`

- raw rendering or camera/scene behavior
  - put it in `src/viewer/*`

## Current Mental Model

The shortest correct mental model for `/20/` is:

- React owns the app shell
- Zustand stores own canonical app and graph state
- selectors shape UI-facing derived state
- Spaghetti compiles graph intent into build inputs
- the dispatcher talks to the worker
- the worker builds artifacts
- `ViewerHost` passes renderable data into the viewer
- the viewer renders, but does not own product truth

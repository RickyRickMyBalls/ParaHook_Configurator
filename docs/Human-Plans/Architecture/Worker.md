# Worker

## Doc Header

### Doc History
1. 2026-03-19 00:00: Created this architecture doc to define the ParaHook `Worker` seam, clarify the current app/dispatcher/worker split, record the remaining legacy contract leaks, and describe the cleanup path toward a graph-native worker contract

### Purpose

This doc defines the architecture direction for the ParaHook `Worker`.

Use it to answer:
- what the worker should own
- what the worker should not own
- where the current separation is still healthy
- where the current worker seam is still legacy-shaped
- what needs to change before the worker contract is honestly graph-native

### Why This Doc Exists

ParaHook already has a real worker path:
- app-side request preparation
- a shared typed message contract
- worker-side build execution
- typed build/progress/error messages coming back

That is good.

But the seam is not clean yet.

Right now the worker is still partly shaped by older `BoxParams` assumptions, the dispatcher still carries some UI/store responsibilities, and the worker build path still mixes legacy parts logic with newer graph/feature-stack work.

This doc exists to make the target worker boundary explicit before more runtime/build behavior gets layered onto the current hybrid seam.

### Scope

This doc covers:
- the app-to-worker contract
- the dispatcher-to-worker runtime seam
- worker-owned build execution
- worker-owned progress and error reporting
- the cleanup path from legacy request shape to graph-native request shape

This doc does not cover:
- viewer rendering architecture
- full graph compiler architecture
- final content-row execution policy
- final export UI

## Doc Body

### Short Version

ParaHook should keep one warm worker.

That worker should:
- receive typed build requests
- execute deterministic geometry/build logic
- emit typed progress
- return typed results

The worker should not:
- own app truth
- own Browser truth
- own console truth
- own view/layout/focus state
- depend on React or Zustand stores

Current reality:
- the app/worker split is still basically healthy
- but the request contract is still legacy-shaped
- and the dispatcher still owns some UI/store side effects that should eventually move outward

### Core Worker Rule

The worker computes.

The app owns product truth and orchestration.

The viewer displays.

The worker is not the source of truth for:
- graph documents
- browser hierarchy
- selected rows
- active tool state
- command state
- viewport state

The worker is the source of truth only for:
- the actual execution of a requested build/export operation
- the progress emitted while that operation is running
- the returned result/error for that specific request

### Target Ownership Split

#### App Owns

- authored graph state
- project/workspace state
- compile/build intent
- request routing identity
- acceptance/rejection of returned results
- user policy such as when to build or what target is active

#### Dispatcher Owns

- worker lifetime
- message transport
- request sequencing
- stale-drop / latest-only protection
- typed message validation at the boundary

#### Worker Owns

- deterministic execution of the request it was given
- part/build artifact generation
- progress reporting
- worker-side error reporting

#### Viewer Owns

- rendering only
- visual selection/highlight display
- camera and scene behavior

### Current Good Separation

Several parts of the worker seam are already in the right place.

Good current properties:
- the worker entry point is narrow:
  - `src/worker/worker.ts`
- the app still talks to the worker through typed shared contracts:
  - `src/shared/buildTypes.ts`
- graph routing identity is already carried through the build request/result path:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
- the app still decides whether to accept or ignore a returned result
- the worker is not reaching into React components or app stores directly

This is enough to say the worker is still separated reasonably well at the app-versus-worker boundary.

### Current Problems

The worker seam is still not clean enough to be considered finished.

#### 1. The Worker Contract Is Still Legacy-Shaped

The biggest remaining problem is the request payload shape.

Current reality:
- the shared build request still carries `payload: BoxParams`
- app-side graph builds are translated into that shape by patching graph-derived data onto legacy box state

That means the worker is not yet consuming an honest graph-native request.

Instead, the app is still adapting graph truth into an older payload seam.

This is the main architectural leak.

#### 2. The Dispatcher Still Owns UI-Facing Side Effects

The dispatcher currently does more than transport and sequencing.

It also directly touches:
- console publishing
- build-stats store updates

This is workable for now, but it couples:
- worker transport
- runtime bookkeeping
- UI-facing diagnostics

The long-term direction should keep the dispatcher focused on transport/runtime concerns and let outer app layers decide how to publish UI state.

#### 3. Worker Build Execution Still Mixes Legacy And Newer Product Paths

The worker runtime still starts from legacy parts logic and then conditionally layers newer feature-stack artifacts on top.

That means the worker is not yet internally cleanly separated between:
- old legacy product generation
- newer graph-native / feature-stack generation

This is acceptable during transition, but it is still transitional architecture.

### Current Code Reality

Today the worker path is roughly:

- app prepares build intent
- app translates graph build inputs into a worker request
- dispatcher posts the typed message
- worker validates request shape
- worker runs build pipeline
- worker emits progress/results/errors
- app accepts or rejects the returned result

Important current seams:
- app runtime:
  - `src/app/store/useAppStore.ts`
- app-to-worker translation:
  - `src/app/spaghetti/integration/buildInputsToRequest.ts`
- dispatcher:
  - `src/app/buildDispatcher.ts`
- shared contracts:
  - `src/shared/buildTypes.ts`
- worker entry:
  - `src/worker/worker.ts`
- worker pipeline:
  - `src/worker/pipeline/buildPipeline.ts`
- worker model generation:
  - `src/worker/buildModel.ts`

### Target Worker Contract

Long term, the worker should consume a graph-native compiled build request.

That request should be shaped around current engine truth, not older box-param compatibility.

That means:
- the app/compiler should produce a durable build request object
- the worker should consume that object directly
- the shared contract should describe graph/build intent honestly
- the app should stop patching graph data onto legacy `BoxParams`

Important rule:
- do not make the worker understand React/app structures
- do not move app truth into the worker
- only make the worker contract honest about the real build input

### Cleanup Goals

The worker cleanup should aim for these outcomes:

1. one honest request contract
- remove the main dependence on `BoxParams` as the worker build payload shape
- replace compatibility patching with a graph-native request shape

2. cleaner dispatcher boundary
- keep worker lifetime, message validation, sequencing, and stale-drop logic in the dispatcher
- move direct UI publishing pressure outward where practical

3. clearer worker internals
- stop layering new graph-native build behavior on top of legacy generation forever
- separate transitional legacy support from the long-term runtime path

4. stronger result semantics
- keep graph/project/build request identity explicit
- keep result acceptance app-owned
- keep worker progress/result reporting strongly typed

### Recommended Cleanup Sequence

The cleanup should happen in this order:

#### 1. Lock The Target Request Shape

Define the graph-native worker request contract explicitly.

That contract should answer:
- what compiled graph/build data the worker really needs
- what routing identity must always be carried
- what changed-input / affected-part hints belong in the request

Do this before trying to remove legacy compatibility code.

#### 2. Keep Translation In One Place

Until the old seam is removed, keep translation localized.

That means:
- one app-side translation seam
- no duplicate ad hoc payload patching
- no spreading worker-shape compatibility logic across multiple stores/components

#### 3. Move Toward Graph-Native Worker Execution

Once the request contract is locked:
- let the worker consume graph-native compiled data directly
- reduce dependence on legacy parts derivation as the default base path
- make the newer runtime path the real path instead of a layered add-on

#### 4. Thin The Dispatcher

After the contract is cleaner:
- review what dispatcher-owned side effects still belong there
- preserve request sequencing and stale-drop behavior
- avoid letting the dispatcher become a second app store/controller

### Open Questions

- what exact graph-native request shape should replace `payload: BoxParams`?
- which worker-side outputs should remain coarse `PartArtifact[]` results, and which need richer typed structure later?
- how much progress truth should remain worker-owned versus app-derived from worker messages?
- how much legacy worker/runtime compatibility should remain during the transition?

Current recommendation:
- keep one warm worker
- keep the current typed message boundary
- keep app-owned result acceptance
- define the graph-native request contract next
- treat the current `BoxParams` payload seam as transitional, not architectural truth

### Short Version

The right mental model is:
- the worker is an execution engine, not an app-state owner
- the dispatcher is a transport/runtime seam, not the product brain
- the current worker boundary is usable but still transitional
- the biggest cleanup need is replacing the legacy `BoxParams` worker contract with an honest graph-native build contract

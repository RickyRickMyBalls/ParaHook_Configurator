# Worker

## Doc Header

### Doc History
1. 2026-03-20 12:24: Added the user-controlled execution-cost direction for the worker, including preview versus final paths, per-part detail controls, and the possibility of fast Three.js preview geometry alongside slower exact worker builds
1. 2026-03-20 12:13: Added the explicit rebuild-ownership rule that child rebuilds must not imply parent assembly/component rebuilds, and tied that requirement to the worker planning phases
1. 2026-03-20 10:12: Added a dedicated `phases` roadmap section so the worker cleanup can be planned as explicit execution phases
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

The user should eventually have explicit control over worker cost.

That means the architecture should support:
- cheaper interactive preview behavior when heavy exact geometry would be too slow
- more expensive final/exact behavior when the user wants authoritative output
- per-part or per-feature controls where those controls materially help editing speed

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
- rebuild ownership rules for the artifacts it actually computes

Important rebuild rule:
- rebuilding a child part/object must not automatically mean its parent component or assembly rebuilt
- parent rows may reflect child dirtiness or child rebuild activity
- parent rows should not imply that all children were recomputed unless a real parent-owned rebuild operation occurred

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

#### 4. Rebuild Ownership Is Still Too Blurry

ParaHook needs a stronger rule for what actually counts as rebuilt.

Target rule:
- child/object rebuilds do not automatically imply parent component rebuilds
- child/component rebuilds do not automatically imply parent assembly rebuilds
- parent rows may aggregate child rebuild status, but that is not the same as a parent rebuild

Current risk:
- if the worker result semantics stay too coarse, the app and browser can drift into treating a parent status change as though the whole parent content subtree rebuilt
- if the worker always recomputes broad output sets, the runtime will not preserve unaffected siblings and parent-owned structure cleanly

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

Important performance rule:
- the contract should eventually be honest not only about geometry input, but also about execution intent
- the user should be able to tell the system whether they want cheap preview behavior, exact final behavior, or disabled/deferred work for specific heavy content

Recommended direction:
- keep one authored parameter truth
- let the request carry execution controls explicitly instead of hiding them inside ad hoc UI behavior
- allow preview geometry to be approximate when the request is explicitly preview-oriented
- do not let preview output silently pretend to be exact final worker truth

Likely control families:
- build mode:
  - `live`
  - `preview`
  - `final`
- detail level:
  - per part or later per heavy feature class
- execution toggles:
  - render on/off
  - auto-update on/off
  - defer-until-release / manual-only for expensive work

Possible preview direction:
- exact heavy geometry may still run through slower worker-side `replicad` / CAD execution
- interactive preview for complex loft-like behavior may use a faster approximate path
- that approximate path may be worker-side simplified geometry or a viewer-side Three.js preview surface
- if a Three.js preview path is added, it should remain clearly marked as preview-only and should not replace authoritative final build results

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
- make rebuild ownership explicit so child-only rebuilds can preserve unaffected siblings and parent structure

5. user-controlled execution cost
- let the user decide when heavy geometry should be interactive, deferred, simplified, or exact
- support explicit preview-versus-final intent instead of forcing one runtime behavior for every edit
- keep quality/detail controls honest and structured instead of scattering one-off performance hacks across the UI

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
- which execution controls belong in the worker request from day one:
  - build mode
  - per-part detail level
  - render on/off
  - auto-update policy
- should fast preview geometry for heavy loft-like features live:
  - in the worker as a simplified runtime
  - in the viewer as Three.js preview geometry
  - or in both with clearly different semantics?

Current recommendation:
- keep one warm worker
- keep the current typed message boundary
- keep app-owned result acceptance
- define the graph-native request contract next
- treat the current `BoxParams` payload seam as transitional, not architectural truth
- explicitly plan for user-controlled execution cost so heavy geometry editing does not force exact slow rebuilds on every drag

### Short Version

The right mental model is:
- the worker is an execution engine, not an app-state owner
- the dispatcher is a transport/runtime seam, not the product brain
- the current worker boundary is usable but still transitional
- the biggest cleanup need is replacing the legacy `BoxParams` worker contract with an honest graph-native build contract

# phases

## [ ] Phase 1 - Audit The Real Current Worker

- map the live request/result/progress contract that is actually in use
- identify dead or drifting protocol paths
- document the real current lanes:
  - `build`
  - `assemble`
  - planned-but-not-live `export`

## [ ] Phase 2 - Lock The Graph-Native Request Contract

- define the worker request shape the compiled graph should produce
- decide what routing identity is always required
- decide what changed-input / affected-part hints belong in the request
- remove ambiguity about whether legacy `BoxParams` fields are compatibility-only or still architectural truth

## [ ] Phase 3 - Define Worker Lanes Explicitly

- decide the permanent worker lane set
- define what each lane owns, returns, and reports as progress
- decide whether `export` is a first-class worker lane or a follow-on service fed by build artifacts
- decide whether preview/assemble stays separate from build or becomes a graph-native build mode
- lock rebuild ownership:
- child rebuilds must not imply parent rebuilds
- component and assembly rows may be aggregate status containers without becoming rebuild owners by default
- define execution-intent controls:
- preview versus final
- per-part detail level
- render/update toggles for expensive features
- decide whether fast preview is a worker lane, a build mode, or a separate preview runtime contract

## [ ] Phase 4 - Thin The Dispatcher

- keep worker lifetime, transport, sequencing, stale-drop, and boundary validation
- identify console/store side effects that should move outward into app orchestration
- preserve app-owned acceptance/rejection of returned worker results

## [ ] Phase 5 - Separate Legacy Runtime From Target Runtime

- isolate the legacy box-parts path as compatibility scaffolding
- stop treating legacy part derivation as the permanent base path
- define the product-neutral worker core versus product-specific adapters
- decide how foothook-specific runtime code should plug into the future worker
- make the runtime preserve unaffected siblings and parent-owned structure when only targeted children rebuild
- avoid broad recompute behavior that makes child edits look like full parent rebuilds
- separate exact heavy geometry execution from cheap interactive preview execution where needed
- allow heavy `replicad`-style operations to use a simpler preview path without confusing preview with final truth
- evaluate whether complex interactive preview should be generated:
- inside the worker with simplified geometry rules
- inside the viewer with Three.js approximation
- or with both paths explicitly named

## [ ] Phase 6 - Strengthen Worker Result Semantics

- decide whether `PartArtifact[]` remains enough for the next stage
- define richer typed outputs if graph-native execution needs more than coarse part boxes
- keep progress semantics deterministic and lane-specific
- keep graph/project/build identity explicit in every relevant result and error
- make result semantics explicit enough to distinguish:
- rebuilt child artifacts
- retained unaffected siblings
- parent aggregate status versus true parent rebuild
- distinguish preview-only output from exact final output
- make result semantics clear enough that the app can show:
- cheap interactive preview meshes
- in-flight exact worker builds
- accepted final geometry

## [ ] Phase 7 - Cut Over To The New Worker Contract

- keep translation in one place during transition
- migrate callers from legacy-shaped requests to graph-native requests
- remove dead protocol shapes once the live path is stable
- verify that stale-drop, caching, diagnostics, and progress still behave correctly after cutover

# Worker

## Doc Header

### Doc History
9. 2026-03-23 13:12: Marked `[5.3A-2]` complete after shipping the graph-native worker request-and-state contract, moved its standalone phase record into `Worker/Shipped/`, updated the family index and phase ladder to the shipped path, and refreshed the current seam read so the umbrella Worker doc now reflects the live `compiledBuildData + buildIdentity + invalidation` graph-build path with coarse result semantics still deferred to `[5.3A-6]`
8. 2026-03-22 19:50: Added the standalone future phase doc for `[5.3A-4]`, so the dispatcher-boundary cleanup now has its own implementation-ready planning surface under the Worker family with the live `BuildDispatcher` store/console side effects mapped to the later outward-hook and bootstrap-wiring cleanup
7. 2026-03-22 19:29: Refreshed the local `[5.3A-2]` phase summary to match the real post-`5.3A-3` sequencing, so the umbrella Worker doc now treats `5.3A-2` as the request-and-result-first code phase that replaces the `BoxParams` request seam underneath the already-shipped lane-and-intent scaffold instead of still reading like a pure pre-`5.3A-3` contract-definition step
6. 2026-03-22 19:19: Updated the local Worker phase ladder to use the real `[5.3A-1]` through `[5.3A-7]` titles and checklist state, replacing the older generic `Phase 1` through `Phase 7` labels so the umbrella doc now matches the roadmap and shipped/future Worker family records
5. 2026-03-22 19:15: Marked `[5.3A-3]` complete after shipping the lane-definition and execution-intent cut, moved its standalone phase record into `Worker/Shipped/`, and updated the family index so the Worker docs now reflect that the canonical build lane plus first explicit execution-intent contract are live code instead of future-only planning
4. 2026-03-22 19:05: Added the standalone future phase doc for `[5.3A-3]`, so the worker lane-definition and execution-intent follow-up now has its own implementation-ready planning surface under the Worker family instead of remaining only as umbrella bullets in `Worker.md`
3. 2026-03-22 18:09: Added the standalone future phase doc for `[5.3A-2]`, so the graph-native contract and separate-build identity work now has its own implementation-ready planning surface under the Worker family instead of living only as an umbrella-phase bullet in `Worker.md`
2. 2026-03-22 18:04: Updated the worker family after shipping the `[5.3A-1]` audit, pointing the umbrella doc at the new shipped record and marking the first worker phase complete now that the live worker lanes, startup legacy path, and Browser/Console build-truth leaks are concretely inventoried for `[5.3A-2]`
1. 2026-03-22 14:57: Turned `Worker` into a real family folder by adding `Future/` and `Shipped/` structure plus the roadmap-aligned `[5.3A]` mini-family read, so the worker architecture now mirrors the newer umbrella-plus-standalone-phase-doc pattern already used by `AppShell` instead of staying one flat architecture note with no future/shipped doc landing zones
1. 2026-03-22 14:57: Added the workspace-modes boundary note that tiled/windowed/pop-out shell placement must preserve one shared worker/build truth for `Browser` and `Console`, while also locking that workspace-layout follow-through as a separate phase family rather than widening the worker cleanup lane
1. 2026-03-22 14:54: Added the startup legacy-cleanup rule that the graph-first app must stop booting into fallback `baseplate` / `heelKick` / `toeHook` worker rows, tying that removal to the worker phases so legacy default instances, legacy build-stats ordering, legacy `assembled` startup narration, and old part-derivation fallback do not survive the graph-native cutover
1. 2026-03-22 14:44: Added the worker-sequencing clarification that separate-build ownership and a graph-native request contract must land before any broad cleanup refactor, and that `Pasta Path` timeline scrubbing should be treated as a later downstream consumer of that cleaner build seam instead of driving the first worker cut
1. 2026-03-20 12:24: Added the user-controlled execution-cost direction for the worker, including preview versus final paths, per-part detail controls, and the possibility of fast Three.js preview geometry alongside slower exact worker builds
1. 2026-03-20 12:13: Added the explicit rebuild-ownership rule that child rebuilds must not imply parent assembly/component rebuilds, and tied that requirement to the worker planning phases
1. 2026-03-20 10:12: Added a dedicated `phases` roadmap section so the worker cleanup can be planned as explicit execution phases
1. 2026-03-19 00:00: Created this architecture doc to define the ParaHook `Worker` seam, clarify the current app/dispatcher/worker split, record the remaining legacy contract leaks, and describe the cleanup path toward a graph-native worker contract

### Purpose

This doc defines the architecture direction for the ParaHook `Worker`.

This file is the umbrella index for the `Worker` family.

Use it to answer:
- what the worker should own
- what the worker should not own
- where the current separation is still healthy
- where the current worker seam is still legacy-shaped
- what needs to change before the worker contract is honestly graph-native
- where the standalone `Worker` `Future/` and `Shipped/` docs live

### Family Structure

Use this folder like this:

- `Worker.md`
  - umbrella architecture direction
  - live seam read
  - roadmap-family summary
- `Future/`
  - standalone implementation-ready `Worker` phase docs
- `Shipped/`
  - later shipped records for completed `Worker` cuts if the family grows enough to justify them

Current roadmap home:
- `[5.3]` Build Sequencing, Build Bars, And Output Build Control
- `[5.3A]` Worker And Graph-Native Build Contract
- `[5.3A-1]` Worker Audit And Legacy Startup Inventory
  - shipped record:
    - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
- `[5.3A-2]` Graph-Native Worker Contract And Separate-Build Identity
  - shipped record:
    - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `[5.3A-3]` Worker Lane Definition And Execution-Intent Model
  - shipped record:
    - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- `[5.3A-4]` Dispatcher Boundary Cleanup
  - future doc:
    - `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`
- `[5.3A-5]` Legacy Runtime And Startup Fallback Removal
- `[5.3A-6]` Result Semantics, Browser Truth, And Console Truth
- `[5.3A-7]` Graph-Native Worker Cutover And Legacy Contract Deletion

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

#### Browser Owns

- presenting build structure to the user
- showing child rows, parent aggregate rows, and unaffected siblings honestly
- reflecting rebuild activity without pretending aggregate parents were truly rebuilt
- reading worker/build identity, not inventing a second rebuild model in UI state

Important Browser rule:
- if a child rebuilds, parent rows may surface that child activity
- parent rows must not present that as a real parent-owned rebuild unless the parent was actually recomputed

#### Console Owns

- presenting the runtime story of a build to the user
- showing queued/building/cache-hit/done/error state in a user-readable way
- exposing lane/unit progress without changing worker truth
- staying a transcript and routing surface, not the owner of build semantics

Important Console rule:
- the console may summarize or group worker progress
- but it must not collapse child-only rebuild activity into misleading "parent rebuilt" language

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
- graph document builds now carry canonical:
  - `compiledBuildData`
  - `buildIdentity`
  - `invalidation`
- the shared build request still also carries legacy `payload: BoxParams` compatibility fields
- result semantics and live progress are still transitional:
  - coarse `PartArtifact[]`
  - `partKey` live progress

That means the worker request seam is healthier than before, but the worker contract is not finished yet.

The remaining leak is no longer "graph builds only speak box payload"; it is that compatibility fields and coarse result/progress semantics still survive around the newer graph-native request path.

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

The follow-through for that worker truth does not stop at the worker boundary.

The same separate-build identity has to survive into:
- the `Browser`, so the tree can show what actually rebuilt versus what is only an aggregate container
- the `Console`, so transcript and progress rows can describe the real runtime story instead of flattening it into one coarse parent event

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

6. downstream Browser and Console honesty
- make worker identity strong enough that the `Browser` can show child rebuilds, parent aggregate state, and unaffected siblings without faking broad parent rebuilds
- make worker progress/result semantics strong enough that the `Console` can narrate separate-build runtime truth per lane or per build unit without inventing a second interpretation layer

7. no legacy foothook boot assumptions
- a fresh graph-first app load must not default to fake fallback worker rows for `baseplate`, `heelKick`, or `toeHook` unless the active graph actually defines those build units
- startup build wiring, Browser rows, and Console transcript output should all read from real graph-native build identity instead of old foothook defaults
- legacy startup assumptions such as default `heelKickInstances`, default `toeHookInstances`, legacy build-stats order fallback, and legacy `assembled` narration should not survive once the graph-native worker seam is real

### Sequencing Clarification

Do not start this family with a broad cleanup refactor.

The first honest worker task is to reorganize the seam around separate-build ownership and a graph-native request contract.

That means:
- define what the real buildable unit is
- make child-versus-parent rebuild ownership explicit
- make the worker contract honest about per-part or per-feature build identity
- keep translation localized while the old seam still exists

Only after that seam is real should the code be broadly cleaned up or refactored around the new boundaries.

`Pasta Path` should influence the target direction, but it should not drive the first worker cut.

Timeline scrubbing depends on more than separate building:
- stable graph-to-step mapping
- partial evaluation / rollback semantics
- deterministic result ownership
- sync back to the `Spaghetti Editor` and viewport

So the safe ordering is:
1. reorganize for separate building
2. refactor around the new seam
3. add separate-building plus timeline scrubbing as a later consumer layer

Blunt rule:
- separate building is a prerequisite for `Pasta Path`
- `Pasta Path` is not the prerequisite for separate building

Related UI rule:
- the first downstream consumers of separate-build truth are the `Browser` and `Console`
- if those surfaces cannot read and present the model honestly, timeline scrubbing will be standing on an unstable contract

Related startup rule:
- when the app first loads, it should either build the active graph truth or stay quiet/ready
- it should not bootstrap fake legacy foothook output just because old worker defaults still exist

Related workspace rule:
- `Windowed`, `Tiled`, and later browser-pop-out placement must not fork worker/build truth
- `Browser` and `Console` should read the same graph/build/request identity regardless of host placement
- this matters to the worker cleanup, but the actual workspace-layout follow-through should remain in the separate `Workspace Modes` phase family rather than being absorbed into the worker phases

### Recommended Cleanup Sequence

The cleanup should happen in this order:

#### 1. Lock The Target Request Shape And Separate-Build Ownership

Define the graph-native worker request contract explicitly.

That contract should answer:
- what compiled graph/build data the worker really needs
- what routing identity must always be carried
- what changed-input / affected-part hints belong in the request
- what a child-only rebuild means versus a parent/component/assembly status update

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

#### 4. Thin The Dispatcher And Refactor Around The Real Seams

After the contract is cleaner:
- review what dispatcher-owned side effects still belong there
- preserve request sequencing and stale-drop behavior
- avoid letting the dispatcher become a second app store/controller

Do not treat this as a generic cleanup pass.

This refactor should happen after the build contract and separate-build ownership rules are already real, so the code can be reorganized around stable boundaries instead of guessed ones.

#### 5. Treat Timeline Scrubbing As A Later Consumer

`Pasta Path` and timeline scrubbing should sit downstream of the cleaner build seam.

That later phase should consume:
- a stable separate-build model
- explicit partial-evaluation / rollback semantics
- deterministic result identity that can drive viewport filtering and `Spaghetti Editor` highlight sync

Before that point, the `Browser` and `Console` should already be reading the same separate-build truth successfully:
- `Browser`
  - child rows
  - parent aggregate rows
  - unaffected siblings
- `Console`
  - per-unit or per-lane progress
  - cache-hit/building/done/error truth
  - non-misleading parent-versus-child wording

Do not widen the first worker cleanup to solve timeline UX, step grouping, and scrub semantics at the same time.

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

## [x] `[5.3A-1]` - `Worker Audit And Legacy Startup Inventory`

- map the live request/result/progress contract that is actually in use
- identify dead or drifting protocol paths
- document the real current lanes:
  - `build`
  - `assemble`
  - planned-but-not-live `export`
- explicitly inventory the startup legacy path:
  - auto-build on boot
  - default `heelKickInstances` / `toeHookInstances`
  - legacy build-stats ordering
  - legacy `assembled` transcript/progress narration
  - legacy fallback part derivation
- shipped record:
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`

## [x] `[5.3A-2]` - `Graph-Native Worker Contract And Separate-Build Identity`

- replace the canonical `payload: BoxParams` request seam underneath the already-shipped `build` lane and `executionIntent` scaffold
- define the graph-native request shape the compiled graph should produce
- keep routing identity and shipped lane/intent truth intact while replacing the authored-input seam
- lock `output entry` as the first honest separate-build unit
- adopt `buildUnitId` first in request creation, staged graph-build state, and accepted build-result ownership
- keep live progress temporarily allowed on `partKey` if needed for a safe rollout
- remove ambiguity about whether legacy `BoxParams`, instance fallback, and `profilePatch` fields are compatibility-only or still architectural truth
- lock the startup rule that the worker contract must not imply `baseplate` / `heelKick` / `toeHook` output unless the active graph actually resolves those units
- shipped record:
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`

## [x] `[5.3A-3]` - `Worker Lane Definition And Execution-Intent Model`

- lock `build` as the one canonical live worker lane
- keep `export` reserved as a future lane without widening this phase into export implementation
- lock preview/final as explicit `executionIntent`, not separate permanent lane truth
- lock default normal graph builds to final/full/auto accepted-output intent
- lock `assemble` as transitional-only compatibility rather than a permanent worker lane
- lock fast preview as execution-intent-driven behavior under `build`, not fake final output
- shipped record:
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`

## [ ] `[5.3A-4]` - `Dispatcher Boundary Cleanup`

- keep worker lifetime, transport, sequencing, stale-drop, and boundary validation
- move direct console/build-stats side effects out of `BuildDispatcher` and into outer runtime wiring
- keep `bootstrapBuildWiring.ts` as the preferred owner for the moved side effects
- introduce one narrow runtime-hooks seam instead of a generic event bus
- preserve app-owned acceptance/rejection of returned worker results
- refactor only after the request/build-unit contract and lane/intent seams are stable enough to organize around honestly

## [ ] `[5.3A-5]` - `Legacy Runtime And Startup Fallback Removal`

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
- remove startup dependence on:
- default `heelKickInstances`
- default `toeHookInstances`
- `LEGACY_BUILD_STATS_PART_ORDER`
- legacy fallback `baseplate` / `heelKick` / `toeHook` part derivation
- do not allow the graph-first app to boot into fake foothook output once the target runtime path exists

## [ ] `[5.3A-6]` - `Result Semantics, Browser Truth, And Console Truth`

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
- make result semantics strong enough that a later `Pasta Path` scrubber can filter, roll back, and sync without guessing rebuild ownership from coarse aggregate output

## [ ] `[5.3A-7]` - `Graph-Native Worker Cutover And Legacy Contract Deletion`

- keep translation in one place during transition
- migrate callers from legacy-shaped requests to graph-native requests
- remove dead protocol shapes once the live path is stable
- verify that stale-drop, caching, diagnostics, and progress still behave correctly after cutover
- acceptance rule:
- on first app load, Browser and Console must not show fallback `baseplate` / `heelKick` / `toeHook` startup output unless the active graph truly builds those units
- if no real graph-native build units exist yet, startup should stay empty/ready instead of fabricating legacy rows

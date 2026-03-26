# Worker Phase 5.3A-4 - Dispatcher Boundary Cleanup

## Doc Header

### Doc History
4. 2026-03-25 18:22: Shipped `[5.3A-4]` after the dispatcher-boundary cleanup landed in code, moving this phase record into `Worker/Shipped/` and locking that `BuildDispatcher` no longer writes directly to build-stats or console state now that runtime presentation/bookkeeping flows outward through `bootstrapBuildWiring.ts`
3. 2026-03-25 18:06: Tightened this future dispatcher phase against the live `src/app` code, clarifying that `bootstrapBuildWiring.ts` already owns the provider-and-handler wiring, locking one whole-object runtime-hooks registration seam plus deterministic hook ordering, and extending the verification/read targets so `[5.3A-4]` now reads as a cleaner implementation-ready boundary move instead of a looser cleanup note
2. 2026-03-23 13:24: Refreshed this future dispatcher phase after shipping `[5.3A-2]`, updating its prerequisite wording and reading order so the doc now treats the graph-native request/build-unit contract as completed groundwork with the standalone `5.3A-2` record living under `Worker/Shipped/`
1. 2026-03-22 19:50: Created this standalone future phase doc for `[5.3A-4]`, turning the dispatcher cleanup follow-up into an implementation-ready planning surface that keeps worker lifetime, typed validation, request sequencing, and stale-drop inside `BuildDispatcher` while moving build-stats and console side effects outward into app runtime wiring after the graph-native request/build-unit contract lands

### Purpose

This doc defines the fourth worker phase under `[5.3A]`.

Use it to answer:
- what `BuildDispatcher` should still own after the worker contract cleanup
- which current dispatcher side effects must move outward
- how build-stats and console publishing should be wired after the move
- what runtime hooks are needed without reopening the worker contract
- what later phases should delete or strengthen instead of re-deciding the dispatcher boundary

### Why This Phase Exists

`[5.3A-1]` proved the dispatcher was doing more than transport.

`[5.3A-3]` already shipped the lane-and-intent scaffold:
- explicit `build` lane truth
- explicit `executionIntent`
- `assemble` as compatibility-only

`[5.3A-2]` already shipped the request/build-unit replacement groundwork:
- replace canonical `payload: BoxParams`
- land graph-native `buildUnitId` truth in request/staged/accepted state

That leaves one boundary problem that should not stay blurry:
- `BuildDispatcher` still writes directly to `useBuildStatsStore`
- `BuildDispatcher` still publishes transcript lines directly through `appendConsoleEntry`
- `BuildDispatcher` still mixes worker transport concerns with app runtime presentation concerns

This phase exists to keep the dispatcher as the worker-runtime seam instead of letting it remain a second app controller.

### Scope

This phase covers:
- `BuildDispatcher` ownership cleanup
- outward runtime hooks for build-stats and console side effects
- app runtime wiring ownership for those hooks
- preserving current worker transport, validation, sequencing, and stale-drop behavior
- preserving current visible build/console behavior while changing where those writes happen

This phase does not cover:
- replacing the worker request contract
- removing `assemble` compatibility yet
- Browser schema or UX redesign
- stronger `buildUnitId` progress/result semantics
- legacy runtime deletion

## Doc Body

## [x] - `[5.3A-4]` - `Dispatcher Boundary Cleanup`

### Header

Purpose:
- keep `BuildDispatcher` focused on worker transport/runtime concerns and move console/build-stats writes into app wiring

Owns:
- dispatcher ownership boundary
- runtime hook contract
- bootstrap wiring responsibilities
- preservation of current stale-drop and sequencing behavior

Does not own:
- graph-native request replacement
- legacy runtime deletion
- Browser/Console semantic redesign
- richer result semantics

### Current Constraints

This phase starts from:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`

Locked constraints from earlier phases:
- `BuildDispatcher` must keep worker lifetime ownership
- `BuildDispatcher` must keep typed message validation at the boundary
- `BuildDispatcher` must keep request sequencing and stale-drop ownership
- the canonical live lane is still `build`
- `assemble` is still compatibility-only but remains live in this phase
- visible console/build-stats behavior should stay materially unchanged during the boundary move
- app-owned result acceptance and error handling must remain outside the dispatcher
- `[5.3A-2]` is where the request/build-unit contract changes; `[5.3A-4]` must not reopen that decision

Current direct side effects that must move out of the dispatcher:
- `useBuildStatsStore.getState().resetStatsForSeq(...)`
- `useBuildStatsStore.getState().applyProgress(...)`
- `useBuildStatsStore.getState().setOverallState(...)`
- `useBuildStatsStore.getState().triggerCacheHitPulse()`
- `appendConsoleEntry(...)`

Current seams this phase defines against:
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/buildStatsStore.ts`
- `src/app/console/useConsoleStore.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/console/consolePublishers.test.ts`

Live code alignment for this phase:
- `bootstrapBuildWiring.ts` already owns the current provider and handler registration for:
  - changed-param ids
  - build instances
  - build-stats part keys
  - build-result acceptance
  - worker-error handling
- `BuildDispatcher` still directly owns the request-start, progress, result-settled, worker-error, and compatibility cache-hit writes into:
  - `useBuildStatsStore`
  - `appendConsoleEntry`
- the compatibility `assemble` path is currently still dispatcher-local and mostly dormant outside this file
- this phase should reroute `assemble` presentation/bookkeeping side effects outward without widening into a broader assemble-result architecture redesign

### Implementation Target

`[5.3A-4]` should make one boundary shift real:

- `BuildDispatcher` still validates, sequences, stale-drops, posts messages, and accepts worker responses
- app runtime wiring becomes the only place allowed to translate dispatcher events into:
  - build-stats store writes
  - console transcript entries
  - cache-hit pulses
  - overall-state presentation

This phase should preserve current visible runtime behavior:
- `Build started (...)`
- `${partKey}: ${state}`
- `Build complete (...)`
- `Assemble started`
- `Assemble complete`
- `Assembled cache hit`

But it should stop treating those writes as dispatcher-owned responsibilities.

### Dispatcher Ownership After Phase

After this phase, `BuildDispatcher` should still own:
- worker construction and disposal
- typed inbound/outbound boundary validation
- request sequence generation
- routing-ledger tracking
- stale-drop decisions
- compatibility `assemble` request posting and cache validation
- normalization helpers for request metadata
- delivery of accepted non-stale worker events to outward hooks and app-owned result/error handlers

After this phase, `BuildDispatcher` should no longer own direct writes to:
- `useBuildStatsStore`
- `useConsoleStore`

Hard rule:
- the dispatcher may synthesize compatibility events such as `assemble` cache-hit progress
- but even those synthesized events must flow outward through hooks rather than writing directly to stores

### Runtime Hooks Contract

This phase introduces one narrow outward side-effect seam:
- `BuildDispatcherRuntimeHooks`

Recommended registration shape:
- `buildDispatcher.setRuntimeHooks(hooks)`
- store one whole hooks object on the dispatcher instead of adding many new setter methods for presentation-only side effects
- keep existing dedicated result/error handlers separate from runtime hooks so app-owned result acceptance does not get collapsed into presentation wiring

Recommended shape:
- `onBuildRequestStarted(context)`
- `onAssembleRequestStarted(context)`
- `onBuildProgress(progress)`
- `onBuildResultSettled(result)`
- `onAssembleResultSettled(result)`
- `onWorkerError(error)`
- `onAssembleCacheHit(context)`

Recommended contract rules:
- all hooks are optional
- hooks only fire for non-stale accepted events
- existing app-owned result/error handlers remain in place for this phase
- the new hooks are specifically for runtime presentation and bookkeeping side effects

Required payload direction:
- `onBuildRequestStarted`
  - carries `seq`
  - carries routing identity
  - carries `executionIntent`
  - carries the seeded part-key order used for current build-stats reset
- `onAssembleRequestStarted`
  - carries `seq`
  - carries the seeded `assembled` key
- `onBuildProgress`
  - carries the validated `BuildProgress`
- `onBuildResultSettled`
  - carries the accepted `BuildResult`
- `onAssembleResultSettled`
  - carries the accepted `AssembleResult`
- `onWorkerError`
  - carries the accepted `WorkerError`
- `onAssembleCacheHit`
  - carries the current `seq`
  - carries the synthetic compatibility progress messages or enough data for outer wiring to produce the same effect

Required ordering rules:
- request-start hooks fire after sequence, routing identity, and pending-ledger state are finalized but before `worker.postMessage(...)`
- progress hooks fire only after validated messages survive stale-drop checks
- build-result and worker-error hooks fire only after validated messages survive stale-drop checks and dispatcher ledger cleanup
- existing app-owned build-result and worker-error handlers should keep their current relative priority ahead of the new runtime-presentation hooks
- compatibility assemble cache-hit hooks must be the only outward way the cache-valid path reaches build-stats or console writes

Explicit non-goal:
- do not invent a generic app-wide event bus in this phase
- use one dispatcher-local runtime hook seam only

### Bootstrap / Wiring Ownership

After this phase, `bootstrapBuildWiring.ts` should become the owner of:
- registering `BuildDispatcherRuntimeHooks`
- translating dispatcher runtime events into build-stats store writes
- translating dispatcher runtime events into console transcript entries
- keeping existing app-owned acceptance/error callbacks wired

Preferred direction:
- extend `bootstrapBuildWiring.ts`
- do not create a second parallel bootstrap file unless the implementation proves that extension is unworkable

Outer-wiring responsibilities after the move:
- reset build stats on build/assemble start
- apply incoming progress to `useBuildStatsStore`
- set overall build state transitions
- trigger cache-hit pulse on compatibility cache hits
- append the current transcript lines with the same visible wording
- keep `useAppStore.getState().acceptBuildResult(result)` outside the dispatcher
- keep `useAppStore.getState().setWorkerError(error.message)` outside the dispatcher

Live ownership rule:
- keep the existing provider registration in `bootstrapBuildWiring.ts`:
  - `setChangedParamIdsProvider`
  - `setBuildInstancesProvider`
  - `setBuildStatsPartKeysProvider`
- add runtime-hook registration in that same file instead of inventing a second coordination surface
- if the current code still does not need broader app-owned assemble acceptance, do not widen this phase just to invent it

### Compatibility Boundary

Keep inside `BuildDispatcher` in this phase:
- request posting
- stale-drop logic
- routing ledgers
- compatibility `assemble` message handling
- compatibility cache-hit synthesis

Move out of `BuildDispatcher` in this phase:
- build-stats reset
- build-stats progress application
- overall state presentation
- cache-hit pulse triggering
- console transcript publishing

Do not delete yet in this phase:
- `assembleIfNeeded`
- legacy stats part-key order fallback
- compatibility start/complete transcript wording

Deletion of those legacy behaviors belongs later to:
- `[5.3A-5]` for runtime fallback removal
- `[5.3A-6]` for stronger result/console/browser semantics

### Later-Phase Handoff

#### `[5.3A-5]` must delete against the cleaner boundary

- remove legacy startup/runtime fallback after the dispatcher no longer owns UI/store writes directly
- delete compatibility paths without having to untangle store coupling at the same time

#### `[5.3A-6]` must strengthen semantics on the outer side

- upgrade Browser and Console truth after the dispatcher boundary is already clean
- keep semantic strengthening in the app/runtime layer, not by re-inflating dispatcher ownership

#### `[5.3A-7]` must cut over against the cleaned seam

- final graph-native worker cutover should happen with one thin dispatcher boundary already in place
- dead compatibility hooks can then be removed without rebuilding the dispatcher architecture again

### Implementation Spec

Recommended reading order:
1. shipped `5.3A-1` audit record
2. shipped `5.3A-2` request/build-unit phase doc
3. shipped `5.3A-3` lane-and-intent record
4. `src/app/buildDispatcher.ts`
5. `src/app/bootstrapBuildWiring.ts`
6. `src/app/store/useAppStore.ts`
7. `src/app/store/buildStatsStore.ts`
8. `src/app/console/useConsoleStore.ts`
9. `src/app/buildDispatcher.test.ts`
10. `src/app/console/consolePublishers.test.ts`

Required written outputs from this phase:
1. `Current Constraints`
2. `Implementation Target`
3. `Dispatcher Ownership After Phase`
4. `Runtime Hooks Contract`
5. `Bootstrap / Wiring Ownership`
6. `Compatibility Boundary`
7. `Later-Phase Handoff`

Suggested execution steps:
1. isolate every direct store/console side effect currently living in `BuildDispatcher`
2. add one whole-object dispatcher runtime-hooks seam without disturbing existing result/error handlers
3. move build-stats reset/progress/overall-state writes into `bootstrapBuildWiring.ts`
4. move current console transcript publishing into `bootstrapBuildWiring.ts`
5. preserve the current handler-versus-presentation ordering for accepted build results and worker errors
6. preserve current stale-drop filtering before outward hooks fire
7. keep compatibility `assemble` and cache-hit behavior visible but routed through hooks

Suggested verification:
- confirm `BuildDispatcher` no longer imports `useBuildStatsStore`
- confirm `BuildDispatcher` no longer imports `appendConsoleEntry`
- confirm `bootstrapBuildWiring.ts` becomes the only place that bridges dispatcher runtime events into build-stats and console side effects
- confirm `bootstrapBuildWiring.ts` still owns provider registration for changed params, build instances, and build-stats part keys
- confirm current visible transcript wording and build-stats behavior stay materially unchanged
- confirm stale progress/results/errors still do not leak into the outward hook path
- confirm the compatibility cache-hit path still emits equivalent visible `assembled` progress behavior without direct dispatcher store writes
- confirm tests cover both the dispatcher stale-drop path and the moved console-publisher path

Suggested verification commands:
- `rg -n "appendConsoleEntry|useBuildStatsStore" src/app/buildDispatcher.ts src/app/bootstrapBuildWiring.ts`
- `rg -n "setBuildResultHandler|setAssembleResultHandler|setWorkerErrorHandler|setBuildStatsPartKeysProvider|setChangedParamIdsProvider|setBuildInstancesProvider|setRuntimeHooks" src/app`
- `rg -n "Build started|Build complete|Assemble started|Assemble complete|Assembled cache hit" src/app`
- `rg -n "build lifecycle worker lines|Build started \\(graph-a\\)|Build complete \\(graph-a\\)" src/app`

Discipline rules:
- do not widen into request-contract replacement in this phase
- do not widen into result-semantics redesign in this phase
- do not remove `assemble` compatibility yet
- do not replace the dispatcher with a generic event bus
- do not change visible transcript wording unless absolutely required by the boundary move

Definition of done:
- `BuildDispatcher` keeps worker/runtime boundary ownership only
- direct build-stats and console writes are removed from `BuildDispatcher`
- outer wiring owns the moved side effects
- stale-drop behavior still works
- current visible build/console behavior is materially unchanged
- later phases can delete legacy runtime and strengthen semantics without untangling dispatcher/store coupling again

# Worker Phase 5.3A-4 - Dispatcher Boundary Cleanup

## Doc Header

### Doc History
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

`[5.3A-2]` is the still-pending request/build-unit replacement phase:
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

## [ ] - `[5.3A-4]` - `Dispatcher Boundary Cleanup`

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
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`

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
- `src/app/store/buildStatsStore.ts`
- `src/app/console/useConsoleStore.ts`

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
2. future `5.3A-2` request/build-unit phase doc
3. shipped `5.3A-3` lane-and-intent record
4. `src/app/buildDispatcher.ts`
5. `src/app/bootstrapBuildWiring.ts`
6. `src/app/store/buildStatsStore.ts`
7. `src/app/console/useConsoleStore.ts`

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
2. add one dispatcher runtime-hooks seam without disturbing existing result/error handlers
3. move build-stats reset/progress/overall-state writes into `bootstrapBuildWiring.ts`
4. move current console transcript publishing into `bootstrapBuildWiring.ts`
5. preserve current stale-drop filtering before outward hooks fire
6. keep compatibility `assemble` and cache-hit behavior visible but routed through hooks

Suggested verification:
- confirm `BuildDispatcher` no longer imports `useBuildStatsStore`
- confirm `BuildDispatcher` no longer imports `appendConsoleEntry`
- confirm `bootstrapBuildWiring.ts` becomes the only place that bridges dispatcher runtime events into build-stats and console side effects
- confirm current visible transcript wording and build-stats behavior stay materially unchanged
- confirm stale progress/results/errors still do not leak into the outward hook path

Suggested verification commands:
- `rg -n "appendConsoleEntry|useBuildStatsStore" src/app/buildDispatcher.ts src/app/bootstrapBuildWiring.ts`
- `rg -n "setBuildResultHandler|setWorkerErrorHandler|setBuildStatsPartKeysProvider|setChangedParamIdsProvider" src/app`
- `rg -n "Build started|Build complete|Assemble started|Assemble complete|Assembled cache hit" src/app`

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

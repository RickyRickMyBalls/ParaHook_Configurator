# Worker Phase 5.3A-7 - Graph-Native Worker Cutover And Legacy Contract Deletion

## Doc Header

### Doc History
2. 2026-03-25 20:41: Tightened this future phase doc against the live shared contract, dispatcher, app acceptance/runtime, worker entry, compatibility adapter, and viewer seams so `[5.3A-7]` now reads as an implementation-ready deletion spec with explicit API removals, migration order, concrete file targets, and a verification bar grounded in the actual remaining `BoxParams`, `assemble`, and compatibility-wrapper surfaces
1. 2026-03-25 20:37: Created this standalone future phase doc for `[5.3A-7]`, turning the final worker cutover into an implementation-ready planning surface that locks one outer-edge translation seam, bundle-first consumer cutover, `assemble` deletion, product-neutral core boundaries, and the deletion-grade verification bar required before the worker family can honestly claim the graph-native contract is complete

### Purpose

This doc defines the seventh worker phase under `[5.3A]`.

Use it to answer:
- where the final remaining legacy-to-graph-native translation seam is allowed to live
- how completely Browser, Console, and runtime consumers must cut over to bundle-first truth
- what happens to `assemble` during the permanent worker-contract cutover
- where any surviving product-specific runtime logic may still live after deletion
- what verification bar proves the legacy worker path is actually gone

### Why This Phase Exists

`[5.3A-6]` already strengthened result truth:
- `BuildResult.bundle` is now the canonical worker result payload
- accepted graph runtime state now stores bundle-backed truth
- Browser output shaping reads typed result-entry semantics
- Console now narrates deterministic bundle-summary completion truth

That means the remaining worker problem is no longer result ambiguity.

It is the last compatibility/deletion layer:
- the shared contract still carries `BoxParams` and compatibility-only request/result shapes
- `assemble` still exists as an explicit compatibility lane
- app and runtime surfaces still expose some flat convenience selectors and legacy wrappers
- worker and dispatcher seams still retain compatibility-oriented fallback structure such as `legacyPayload`, `LEGACY_BUILD_STATS_PART_ORDER`, `requestAssemble(...)`, `assembleIfNeeded(...)`, and worker-side compatibility validation that should not survive the final graph-native cutover

This phase exists to finish the cutover cleanly instead of leaving the worker family permanently split between graph-native truth and legacy compatibility scaffolding.

### Scope

This phase covers:
- final deletion of legacy worker request/protocol shapes
- one explicit outer-edge compatibility translation rule
- deletion of `assemble` from the permanent worker contract
- bundle-first consumer cutover for primary runtime surfaces
- deletion-grade verification that the legacy worker path is actually gone

This phase does not cover:
- new Browser UX beyond the bundle-first truth cutover
- new preview-generation modes
- broader Viewer redesign
- product-level feature expansion unrelated to worker contract deletion
- later `Pasta Path` history UI

## Doc Body

## [ ] - `[5.3A-7]` - `Graph-Native Worker Cutover And Legacy Contract Deletion`

### Header

Purpose:
- finish the worker family by deleting the remaining legacy compatibility protocol/path shapes and making the live worker boundary honestly graph-native

Owns:
- final request/protocol cutover
- outer-edge-only translation ownership
- bundle-first consumer cutover
- `assemble` deletion from the permanent worker contract
- deletion-grade verification

Does not own:
- new result semantics
- Browser panel redesign
- Viewer feature redesign
- later history/scrubber UI

### Current Constraints

This phase starts from:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md`

Locked constraints from earlier phases:
- the canonical live worker lane is still `build`
- bundle-based accepted result truth is already landed and must remain the canonical semantic surface
- Browser and Console already read shared semantic facts rather than inventing their own result categories
- startup must remain quiet on empty graphs
- the worker core must remain product-neutral

Locked decisions for this phase:
- translation ownership:
  - the final translation seam lives only at one outer app/bootstrap edge
- bundle-first cutover:
  - primary runtime consumers must become bundle-first
  - any surviving flat selectors may remain only as narrow read-only convenience views
- `assemble` deletion:
  - `assemble` is deleted from the permanent worker contract in this phase
- product-neutral core:
  - any surviving product-specific behavior lives only behind explicit product adapters/plugins outside the shared worker contract
- verification bar:
  - this phase requires deletion-grade proof, not only smoke-test confidence

Current seams this phase defines against:
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/worker/worker.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- `src/viewer/Viewer.ts`

Live code alignment for this phase:
- `src/shared/buildTypes.ts` still defines:
  - `BoxParams`
  - `BuildPhase = 'parts' | 'assemble' | 'export'`
  - `ViewMode = 'parts' | 'assembled'`
  - `AssembleRequest`
  - `AssembleResult`
  - compatibility-oriented `FoothookCompatBuildConfig`
- `src/app/buildDispatcher.ts` still carries:
  - `requestBuild(params: BoxParams, ...)`
  - `requestGraphBuild(... legacyPayload?: BoxParams ...)`
  - `requestAssemble(...)`
  - `assembleIfNeeded(...)`
  - `LEGACY_BUILD_STATS_PART_ORDER`
  - synthetic assemble cache-hit/runtime-hook behavior
- `src/app/bootstrapBuildWiring.ts` still bridges:
  - `onAssembleRequestStarted(...)`
  - `onAssembleResultSettled(...)`
  - assembled-only build-stats rows and transcript wording
- `src/worker/worker.ts` still validates and routes:
  - compatibility-bearing build requests
  - explicit `assemble` requests
- `src/worker/buildModel.ts`, `src/worker/pipeline/signatures.ts`, and `src/worker/pipeline/buildPipeline.ts` still depend on:
  - `payload: BoxParams`
  - compatibility plumbing
  - `assemblePipeline(...)`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts` still carries:
  - `BoxParams`
  - foothook compatibility instances
  - worker-side product-specific translation/runtime behavior
- `src/app/store/useAppStore.ts` and `src/app/spaghetti/store/useSpaghettiStore.ts` still expose:
  - foothook-era compatibility wrappers/state
  - flat compatibility-derived selectors and helper surfaces that should not remain architectural truth after cutover
- `src/viewer/Viewer.ts` still has explicit assembled-preview handling:
  - `setAssembled(...)`
  - assembled mesh state

### Implementation Target

`[5.3A-7]` should make one final cutover real:

- the worker boundary becomes graph-native only
- compatibility translation moves to one explicit outer edge if anything still needs adapting
- `assemble` disappears from the permanent worker contract
- bundle truth becomes the primary consumer surface across runtime, Browser, and Console
- the remaining legacy request/protocol shapes are deleted rather than merely ignored

This phase should materially remove:
- `BoxParams` as architectural truth at the worker boundary
- worker-level dependence on compatibility-only request/result shapes
- `assemble` as an active worker lane
- primary Browser/Console/runtime dependence on flat compatibility selectors
- shared-contract product leakage

### Chosen Defaults

- `Outer-edge translation only`:
  - if any temporary compatibility caller survives during migration, it adapts before crossing the shared worker boundary
- `Bundle-first runtime truth`:
  - accepted bundle state remains canonical
  - flat artifact selectors may survive only as derived read helpers
- `Delete assemble, do not quarantine it as a hidden lane`:
  - this phase removes `assemble` from the permanent worker contract rather than relocating it inside the worker family
- `Delete dead shapes instead of preserving inert compatibility aliases`:
  - the goal is not merely to stop using legacy shapes
  - the goal is to remove them from the live contract and primary runtime flow

### Implementation Plan

#### 1. Shared Contract Cutover

- remove shared worker-boundary protocol shapes that exist only for legacy compatibility:
  - `AssembleRequest`
  - `AssembleResult`
  - any `BuildPhase` / `ViewMode` values that survive only for assembled compatibility
- stop treating `BoxParams` as worker-boundary truth
- narrow the shared worker build request model so the permanent worker boundary is graph-native-only:
  - remove `payload: BoxParams` from the permanent build request shape
  - remove `CompatBuildRequest` from the permanent shared worker boundary
- keep bundle/result-entry semantics from `[5.3A-6]` as the canonical accepted result surface

#### 2. Dispatcher And App Boundary Cleanup

- remove `requestAssemble(...)`, `assembleIfNeeded(...)`, and assembled cache-hit behavior from `BuildDispatcher`
- remove `requestBuild(params: BoxParams, ...)` as the architectural build entry
- delete `legacyPayload?: BoxParams` fallback from `requestGraphBuild(...)`
- delete fallback `LEGACY_BUILD_STATS_PART_ORDER` seeding from the active worker dispatch path
- remove assembled-only runtime-hook surfaces from the bootstrap bridge:
  - `onAssembleRequestStarted(...)`
  - `onAssembleResultSettled(...)`
  - assembled stats/progress/transcript paths
- keep dispatcher ownership focused on:
  - worker lifetime
  - routing/seq identity
  - validation
  - stale-drop
  - runtime hooks
- if any compatibility caller still needs translation, move that translation to one explicit outer app/bootstrap seam instead of keeping it in dispatcher/worker internals

#### 3. Worker Core Deletion Pass

- remove `assemblePipeline(...)` from the permanent worker flow
- remove compatibility-bearing request validation/branching from `worker.ts`
- remove `payload: BoxParams` as the permanent worker build-model input
- remove compatibility-bearing request signatures from:
  - `buildModel.ts`
  - `pipeline/signatures.ts`
  - any worker-side feature adapter that still depends on shared-boundary `BoxParams`
- refactor worker build pipeline inputs so graph-native compiled/request data is sufficient without compatibility fallback
- keep any surviving product-specific behavior behind a clearly isolated adapter/plugin seam outside the shared graph-native worker contract

#### 4. Consumer Cutover

- migrate primary runtime consumers to read bundle truth directly:
  - app acceptance/runtime state
  - Browser row/output shaping
  - Console narration inputs
- keep the following rule explicit during cleanup:
  - if a convenience selector remains, it may summarize bundle truth
  - it may not preserve old ownership semantics or act as the source-of-truth contract
- allow narrow flat selectors only if they are:
  - clearly derived
  - read-only
  - not architectural truth
  - not write-path inputs
- remove any consumer path that still treats flat compatibility arrays or assembled-only state as the primary truth surface

#### 5. Compatibility Cleanup

- delete foothook-era compatibility wrappers that exist only to preserve the old worker boundary
- delete or collapse legacy wrapper comments and helper names that would otherwise imply the compatibility path still exists:
  - `Legacy compatibility methods kept for existing tests/callers`
  - `Legacy compatibility wrappers`
- keep product adapters only where they still represent real product-specific behavior, not legacy request/protocol glue
- remove dead test helpers/fixtures that preserve deleted request/result shapes after the cutover lands

### Recommended Execution Order

1. Shared contract deletion:
   - remove `AssembleRequest` / `AssembleResult`
   - narrow `BuildRequest`
   - stop exporting shared-boundary compatibility-only types
2. Worker entry and pipeline deletion:
   - remove `assemble` routing and pipeline support
   - remove compatibility-bearing validation and signatures
3. Dispatcher/bootstrap cleanup:
   - delete assembled request helpers, cache-hit behavior, and assembled transcript/stats wiring
4. App/runtime consumer cutover:
   - remove primary dependence on flat compatibility selectors and wrappers
   - keep only obviously derived convenience views if still needed
5. Viewer and residual surface cleanup:
   - remove assembled-only viewer handling if no real caller remains
6. Test cleanup and deletion-grade verification:
   - update or delete fixtures that depend on the removed contract

### Acceptance Criteria

- the shared worker contract is graph-native only
- `assemble` no longer exists as a permanent worker request/result path
- `BuildDispatcher` no longer exposes assembled compatibility request helpers
- no primary Browser/Console/runtime consumer depends on flat compatibility selectors as architectural truth
- product-specific request/result fields do not appear in the shared worker boundary
- startup on an empty graph remains silent
- stale-drop, caching, progress, and worker-error routing still behave correctly after the deletions

### Verification

Required code targets to verify:
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/worker/worker.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/signatures.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- `src/viewer/Viewer.ts`

Required test targets to update or add:
- `src/app/buildDispatcher.test.ts`
- `src/app/bootstrapBuildWiring.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/worker/worker.test.ts` if introduced or already present through adjacent worker coverage
- `src/app/components/ViewerHost.test.tsx` if assembled-viewer paths are removed or replaced

Required verification scenarios:
- graph-native build requests compile and dispatch without legacy compatibility request fields
- no shared worker build request still requires `payload: BoxParams` or compatibility-only request unions
- no empty-graph startup path emits fallback build work, assembled rows, or assembled transcript entries
- Browser and Console read one shared bundle-first truth path after cutover
- no dispatcher/bootstrap API still exposes `requestAssemble(...)`, `assembleIfNeeded(...)`, or assembled-only runtime-hook plumbing
- no stale progress/result/error events leak through after the protocol deletions
- any removed compatibility shapes are absent by code search, not merely left unused

Suggested code-search verification strings:
- `AssembleRequest`
- `AssembleResult`
- `requestAssemble(`
- `assembleIfNeeded(`
- `legacyPayload`
- `LEGACY_BUILD_STATS_PART_ORDER`
- `setAssembled(`
- `payload: BoxParams`

### Notes

- this phase is allowed to be deletion-heavy
- prefer deleting dead compatibility code over renaming it and leaving it in place
- do not widen the phase into unrelated Browser or Viewer redesign work just because some compatibility cleanup touches those files

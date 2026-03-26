# Worker Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal

## Doc Header

### Doc History
2. 2026-03-25 19:03: Marked this phase shipped after implementation, moved the standalone record from `Worker/Future/` into `Worker/Shipped/`, and kept the phase contract aligned with the landed code where graph-native startup stays quiet on empty graphs, worker compatibility now lives behind one explicit foothook adapter seam, build stats seed from active request identity, and targeted accepted outputs preserve unaffected siblings
1. 2026-03-25 18:34: Created this standalone future phase doc for `[5.3A-5]`, turning the next worker runtime-cleanup cut into an implementation-ready planning surface that locks the anonymized worker-core seam, graph-first silence-on-empty startup, request-driven build-stats identity, the first preview strategy split, and the no-full-wipe preservation rule before broader result semantics land in `[5.3A-6]`

### Purpose

This doc defines the fifth worker phase under `[5.3A]`.

Use it to answer:
- where the product-neutral worker core should stop and compatibility adapters should begin
- which startup fallback behaviors must be deleted after the dispatcher boundary is already clean
- how build-stats seeding should become request-driven instead of legacy-list-driven
- how preview-versus-final behavior should be staged during runtime cleanup without confusing accepted build truth
- what preservation rules must already hold before the richer Browser/Console/result semantics phase

### Why This Phase Exists

`[5.3A-4]` already cleaned the dispatcher boundary:
- `BuildDispatcher` no longer writes directly into build-stats or console state
- `bootstrapBuildWiring.ts` now owns the worker-facing presentation/bookkeeping bridge

That cleaner boundary makes the next deletion phase practical.

The remaining worker/runtime problem is no longer mainly dispatcher ownership.

It is that several live seams still carry foothook-era runtime assumptions:
- default `heelKickInstances` / `toeHookInstances`
- `LEGACY_BUILD_STATS_PART_ORDER`
- synthetic startup `assembled` narration
- worker-core logic that still knows specific foothook family names
- broad fallback runtime behavior that can still look like "wipe and rebuild everything"

This phase exists to remove those legacy startup/runtime assumptions without widening into the later `[5.3A-6]` semantic-strengthening phase or the final `[5.3A-7]` cutover/deletion pass.

### Scope

This phase covers:
- product-neutral worker-core versus compatibility-adapter separation
- graph-first startup silence when no real build units exist
- removal of legacy default instance and build-stats-order fallback behavior
- first runtime preview strategy alignment under the shipped `executionIntent` model
- preservation of unaffected siblings and parent-owned structure during targeted rebuilds where current request identity already allows it

This phase does not cover:
- dispatcher boundary cleanup
- richer final result semantics for Browser/Console truth
- the final deletion of every compatibility protocol shape
- Viewer UX polish for transient approximation previews
- full `Pasta Path` rollback/filter semantics

## Doc Body

## [x] - `[5.3A-5]` - `Legacy Runtime And Startup Fallback Removal`

### Header

Purpose:
- delete foothook-era runtime and startup fallback assumptions now that the dispatcher boundary is already clean

Owns:
- anonymized worker-core boundary
- compatibility-adapter placement
- silence-on-empty startup behavior
- request-driven build-stats identity
- first preview-path split during runtime cleanup
- the no-full-wipe preservation rule

Does not own:
- dispatcher refactor
- full result-schema redesign
- Browser/Console semantic strengthening
- final legacy-contract deletion

### Current Constraints

This phase starts from:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`

Locked constraints from earlier phases:
- the canonical live worker lane is still `build`
- `executionIntent` already owns preview-versus-final truth
- `assemble` is compatibility-only and must not regain permanent architectural status here
- dispatcher presentation/store ownership already moved outward in `[5.3A-4]`
- request/build-unit truth already exists and must remain graph-native instead of falling back to `BoxParams` vocabulary as architecture truth
- later Browser/Console truth strengthening belongs primarily to `[5.3A-6]`

Locked decisions for this phase:
- the worker core is anonymized:
  - the permanent core should know build units and typed identities, not foothook family names
- silence is success:
  - if the active graph resolves zero real build units, startup should do zero worker work
- build-stats identity is request-driven:
  - active request identity seeds stats; no hard-coded legacy part-order fallback remains as architectural truth
- preview strategy is split:
  - worker-side simplification is the standard post-interaction draft path
  - viewer-side approximation is acceptable only for clearly transient interaction feedback
- stop the full wipe:
  - targeted rebuilds must not delete unrelated surviving output when current request identity allows preservation

Current seams this phase defines against:
- `src/app/bootstrapBuildWiring.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/buildStatsStore.ts`
- `src/shared/buildStatsKeys.ts`
- `src/shared/buildTypes.ts`
- `src/worker/worker.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`

Live code alignment for this phase:
- `bootstrapBuildWiring.ts` still injects fallback:
  - `heelKickInstances: [1]`
  - `toeHookInstances: [1]`
  - `LEGACY_BUILD_STATS_PART_ORDER`
  - startup `requestSpaghettiBuild()`
- `buildInputsToRequest.ts` still emits foothook-shaped compatibility data:
  - `instances.heelKickInstances`
  - `instances.toeHookInstances`
  - `withAssembledBuildStatsKey(...)`
- `worker.ts` still validates foothook-specific request fields:
  - `heelKickInstances`
  - `toeHookInstances`
- `buildModel.ts` still mixes:
  - `deriveLegacyParts(...)`
  - `runFoothookFeatureStack(...)`
  - foothook-family labels such as `baseplate`, `heelKick`, and `toeHook`

### Implementation Target

`[5.3A-5]` should make one deletion shift real:

- the permanent worker core becomes build-unit-first and product-neutral
- the remaining foothook-specific compatibility path becomes one explicit adapter instead of diffuse worker/runtime truth
- startup stops fabricating old foothook output when the graph has nothing real to build
- build-stats seeding comes from the active request only
- preview-versus-final runtime behavior stays explicitly named
- targeted rebuilds stop erasing unrelated visible output just because old fallback runtime paths were broad

This phase should materially remove:
- default foothook instance fallback
- legacy fixed-part startup ordering
- implicit "assembled on boot" narration as fake startup truth
- broad fallback runtime assumptions that make every edit look like a full parent-wide rebuild

### Anonymized Worker Core

After this phase, the permanent worker core should know:
- typed request identity
- build-unit ids
- execution intent
- deterministic geometry/runtime execution
- typed progress/result/error families

After this phase, the permanent worker core should not directly know:
- `baseplate`
- `heelKick`
- `toeHook`
- foothook-specific fallback derivation defaults
- product-family naming as core architectural truth

Hard rule:
- if foothook compatibility still survives after this phase, it must survive through one explicit compatibility adapter seam rather than through scattered worker-core fields, labels, and fallback branches

Preferred direction:
- app-side translation remains allowed where needed
- worker-side product-specific logic may remain temporarily, but behind one named adapter path
- do not leave foothook-family assumptions spread across `worker.ts`, `buildModel.ts`, and startup wiring as though they are permanent core concepts

### Compatibility Adapter Boundary

This phase should isolate compatibility logic into one narrow adapter layer.

The adapter owns:
- mapping old foothook-shaped authored/runtime inputs into the anonymized core request shape
- any temporary foothook-specific artifact naming or feature translation that still cannot be removed safely in one pass
- temporary compatibility-only `assembled` seeding while `assemble` still exists at all

The core owns:
- accepted typed request execution
- build-unit routing and deterministic computation
- execution-intent-driven runtime behavior
- typed progress, result, and error emission

Explicit non-goal:
- do not rename everything in the codebase just for aesthetics
- the goal is ownership cleanup, not cosmetic string replacement

### Silence-On-Empty Startup

This phase locks startup behavior as:
- if the graph resolves real build units, startup may request real build work
- if the graph resolves no real build units, startup stays quiet/ready

Hard rule:
- "nothing to build" is a valid steady state
- do not fabricate fallback `baseplate`, `heelKick`, `toeHook`, or synthetic `assembled` transcript output just to prove that bootstrap is alive

Practical implication:
- a fresh empty graph should not produce immediate worker errors
- the console may remain empty until the user creates real buildable graph content
- build stats should remain empty/idle instead of showing fake part rows from legacy defaults

### Request-Driven Build Stats Identity

After this phase, build stats should be seeded only by the active request identity.

That means:
- if the active request targets graph-native output entries, those units seed stats
- if a temporary compatibility path still intentionally seeds `assembled`, that seed must come from the current accepted compatibility request, not from a repo-global fixed fallback list

Delete in this phase:
- architectural dependence on `LEGACY_BUILD_STATS_PART_ORDER`
- any hidden replacement default list that recreates the same fixed-part assumption in another file

Hard rule:
- the stats surface must no longer behave as though the worker always builds a 2024 foothook part list

### Preview Strategy During Runtime Cleanup

This phase locks the first preview strategy as:

1. viewer approximation
- allowed only for clearly transient interaction feedback
- expected for immediate drag/gesture responsiveness
- must not pretend to be accepted worker output

2. worker-side draft build
- the standard post-interaction simplified runtime path
- should use explicit draft/preview execution intent rather than hidden legacy branch behavior
- remains worker truth, but still distinct from final/accepted output

3. worker-side final build
- authoritative final path
- should follow the same explicit `executionIntent` naming

Hard semantic rule:
- name these flows explicitly as preview/draft/final so Console and later result semantics do not need to infer what happened from timing alone

Explicit non-goal:
- do not widen this phase into a complete Viewer preview architecture
- only lock enough of the runtime rule that legacy runtime deletion does not create new semantic ambiguity

### Preservation Rule

This phase locks one runtime preservation rule before `[5.3A-6]`:

- do not delete what the request did not rebuild

That means:
- if the user edits one targeted child/output entry, unrelated surviving siblings should remain visible when the current request/result identity makes retention possible
- parent-owned structure should not be regenerated broadly just because old fallback runtime code was easier to reset wholesale

This phase does not need to finish the full semantic truth model for:
- parent aggregate state
- retained sibling classification
- final Browser/Console wording

But it must stop obviously broad fallback behavior from masquerading as legitimate graph-native execution.

### Later-Phase Handoff

#### `[5.3A-6]` must strengthen the semantics that this phase protects

- Browser and Console truth should build on:
  - anonymized worker-core ownership
  - silence-on-empty startup
  - request-driven stats identity
  - the no-full-wipe preservation rule
- `[5.3A-6]` should describe retained siblings and parent aggregate state more precisely instead of having to first undo broad runtime fallback behavior

#### `[5.3A-7]` must delete the remaining compatibility scaffolding

- once the compatibility adapter seam is narrow and explicit, `[5.3A-7]` can remove the remaining legacy protocol shapes without rediscovering runtime ownership

### Implementation Spec

Recommended reading order:
1. shipped `5.3A-1` audit record
2. shipped `5.3A-2` request/build-unit record
3. shipped `5.3A-3` lane-and-intent record
4. shipped `5.3A-4` dispatcher-boundary record
5. `src/app/bootstrapBuildWiring.ts`
6. `src/app/spaghetti/integration/buildInputsToRequest.ts`
7. `src/shared/buildStatsKeys.ts`
8. `src/shared/buildTypes.ts`
9. `src/worker/worker.ts`
10. `src/worker/buildModel.ts`
11. `src/worker/pipeline/buildPipeline.ts`

Required written outputs from this phase:
1. `Current Constraints`
2. `Implementation Target`
3. `Anonymized Worker Core`
4. `Compatibility Adapter Boundary`
5. `Silence-On-Empty Startup`
6. `Request-Driven Build Stats Identity`
7. `Preview Strategy During Runtime Cleanup`
8. `Preservation Rule`
9. `Later-Phase Handoff`

Suggested execution steps:
1. isolate every remaining foothook-specific runtime assumption in startup wiring, request translation, worker validation, and worker model generation
2. decide the one compatibility adapter seam that temporarily owns those assumptions
3. remove default startup fallback instances and fixed-part stats seeding
4. make startup quiet when no real graph-native build units resolve
5. keep preview-versus-final behavior explicitly named through `executionIntent`
6. stop broad fallback wipe/rebuild behavior where current request identity already permits targeted preservation
7. leave richer retained-sibling and parent-aggregate semantics to `[5.3A-6]`

Suggested verification:
- confirm `bootstrapBuildWiring.ts` no longer injects default `heelKickInstances` / `toeHookInstances`
- confirm `bootstrapBuildWiring.ts` no longer seeds build stats from `LEGACY_BUILD_STATS_PART_ORDER`
- confirm empty startup no longer emits fake foothook output or synthetic worker errors
- confirm worker-core seams no longer require foothook-family names as permanent input fields
- confirm any surviving foothook compatibility path is isolated behind one explicit adapter seam
- confirm targeted rebuilds do not wipe unrelated surviving output where current request/result identity already allows preservation
- confirm preview-versus-final runtime paths remain explicitly named rather than inferred from ad hoc timing branches

Suggested verification commands:
- `rg -n "LEGACY_BUILD_STATS_PART_ORDER|heelKickInstances|toeHookInstances|requestSpaghettiBuild|assembled" src/app src/shared src/worker`
- `rg -n "baseplate|heelKick|toeHook|runFoothookFeatureStack|deriveLegacyParts" src/worker src/app`
- `rg -n "preview|draft|final|transient_preview|accepted_final" src/shared src/app src/worker`

Discipline rules:
- do not widen into full Browser/Console result semantics in this phase
- do not re-inflate dispatcher ownership while deleting runtime fallbacks
- do not keep a hidden fixed-part fallback list under a new name
- do not let transient viewer approximation masquerade as accepted worker output
- do not claim targeted rebuild preservation is complete if broad wipe/rebuild behavior still dominates the live runtime

Definition of done:
- the permanent worker core is build-unit-first and product-neutral
- foothook-specific compatibility is isolated behind one explicit adapter seam if it still exists at all
- empty startup stays quiet when no real build units exist
- build stats are seeded from active request identity rather than fixed legacy part order
- preview-versus-final runtime behavior is explicitly named through the shipped execution-intent model
- targeted rebuilds no longer wipe unrelated surviving output just because legacy runtime fallback remained broad

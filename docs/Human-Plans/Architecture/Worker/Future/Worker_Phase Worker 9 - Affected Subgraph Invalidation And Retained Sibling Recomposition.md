# Worker Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition

## Doc Header

### Doc History
6. 2026-04-13 15:22:17: Prepped `Worker 9 Phase 3 - Retained Sibling Recomposition Through Output Preview` for implementation by grounding it in the landed `Phase 2` local-branch narrowing behavior plus the current accepted-bundle, accepted-output, and artifact-emission seams in `useSpaghettiStore.ts` and `artifactEmitter.ts`, making the first retained-plus-rebuilt recomposition bar explicit, and tightening the file targets, implementation order, verification, and no-fake-recomposition stop rule
5. 2026-04-13 15:19:11: Marked `Worker 9 Phase 2 - Worker Downstream-Only Routing For Parallel Extrude Branches` complete after landing the first real local-branch worker narrowing across `paramRouting.ts`, `buildPipeline.ts`, request target build-unit narrowing in `buildInputsToRequest.ts`, focused worker/runtime proof coverage, and build, while leaving retained-sibling `Output Preview` recomposition hardening as the next `Phase 3` target
4. 2026-04-13 15:09:18: Marked `Worker 9 Phase 1 - Changed-Input Classification And First Extrude-Local Hints` complete after the shipped `changedInputHint` request-contract slice landed across `buildTypes.ts`, `buildInputsToRequest.ts`, dispatcher/store/worker threading, focused tests, and build, then prepped `Worker 9 Phase 2 - Worker Downstream-Only Routing For Parallel Extrude Branches` for implementation by grounding it in the current `paramRouting.ts`, `buildPipeline.ts`, and `buildModel.ts` seams, making the first actual worker-scope narrowing bar explicit, and tightening the file targets, implementation order, verification, and no-fake-narrowing stop rule
3. 2026-04-13 14:52:25: Prepped `Worker 9 Phase 1 - Changed-Input Classification And First Extrude-Local Hints` for implementation by grounding the phase in the live `buildInputsToRequest.ts`, `buildTypes.ts`, `buildModel.ts`, and `paramRouting.ts` seams, making the first branch-local extrude proof graph and first shared-sketch widening control explicit, and tightening the contract, file-target, implementation-order, verification, and no-widening rules around the current `sp_featureStackIR` transport-versus-hint split
2. 2026-04-13 14:45: Rewrote this phase around the clearer `changed node -> true downstream dependents only` invalidation rule, explicitly clarifying upstream versus downstream direction, tightening the retained-sibling recomposition story around `Output Preview`, and aligning the request-hint plus ownership framing with the shipped cleanup canon for shared worker-facing contracts and graph-runtime accepted-result ownership
1. 2026-04-10 00:00: Created this standalone future Worker phase doc so the new `Worker 9` lane has an implementation-ready planning surface for graph-native affected-subgraph invalidation, retained sibling recomposition, and the first explicit `Extrude 2 changes should not rebuild Object 1` worker-proof ladder instead of leaving that goal only as a short section in `Worker-Index.md`

### Purpose

This doc defines the next implementation-ready phase under `Worker`.

Use it to answer:
- how ParaHook should narrow graph-native worker invalidation from broad feature-stack churn into `changed node + true downstream dependents only`
- how upstream nodes and unrelated sibling branches should stay retained when one authored branch changes
- where request-time changed-input hints must become precise enough to identify the changed node and its dependency cone
- where worker/runtime recomposition should happen when downstream composition such as `Output Preview` depends on several parallel branches

### Why This Phase Exists

Today ParaHook already has:
- graph-native build requests
- build-unit identity
- explicit rebuilt/retained/evicted accepted bundle semantics
- accepted-bundle recomposition strong enough to preserve retained siblings when target build units are already narrow and correct

That is enough for result honesty.

It is not enough for affected-subgraph precision.

Current reality:
- request translation can still collapse graph-native geometry edits into broad shared `sp_featureStackIR` change detection
- worker-side affected-part routing still treats `sp_*` changes as broad affected work
- parallel geometry branches can therefore rebuild together even when only one authored branch changed
- upstream nodes can stay conceptually untouched, but the worker still ends up doing broad downstream work because the invalidation hints are too coarse
- the first visible symptom is:
  - `Extrude 2 -> Object 2` changes
  - `Extrude 1 -> Object 1` still reloads or rebuilds even though it should remain retained

This phase exists to close that gap without widening yet into full `Build Path` history, workspace-mode scrubber UX, or deeper CAD-kernel replay work.

The goal is:
- rebuild only the changed node and its true downstream dependency cone
- keep upstream nodes unchanged unless they were themselves edited
- retain parallel sibling branches outside that cone
- let downstream composition surfaces recompose from retained plus rebuilt branch outputs instead of forcing broad sibling reloads

### Scope

This phase covers:
- request-time changed-input precision for graph-native geometry edits
- worker/runtime affected-subgraph routing
- explicit downstream-only invalidation from the changed node
- retained sibling recomposition for parallel branch outputs
- first explicit proof cases for shared-sketch parallel extrudes
- verification that accepted bundle truth stays honest while the worker becomes narrower

This phase does not cover:
- `Build Path` history UI
- full CAD command checkpoint history
- workspace-mode scrubber UX
- authoritative scheduling policy
- broad viewer presentation redesign

## Doc Body

## [ ] Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition

### Header

Purpose:
- make graph-native worker rebuilds follow the changed node plus true downstream dependency cone instead of broad feature-stack-wide churn

Owns:
- affected-subgraph routing for graph-native geometry requests
- narrower request-time changed-input hints
- retained sibling recomposition for parallel branch outputs
- the first concrete `Extrude 2 changes should not rebuild Object 1` worker proof

Does not own:
- `Build Path` workspace mode UX
- command-history checkpoints or scrubber behavior
- authoritative timing policy
- full viewer compare overlays

### Current Constraints

This phase starts from the shipped groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker-Index.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`
- `docs/Human-Plans/Architecture/Build-Path/build-path-index.md`

Locked starting constraints:
- build-unit identity already exists and should remain the worker-facing ownership key
- accepted bundles already know how to classify:
  - `rebuilt`
  - `retained`
  - `evicted`
- this phase should make those classifications truer by narrowing actual rebuild scope, not by faking more app-side wording
- the first target is worker/runtime precision, not history playback

Current live seams this phase should read against:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/shared/buildTypes.ts`
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Current code-backed read:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - already filters worker-facing extrudes down to those wired into `Output Preview`
  - still collapses graph-native geometry changes into shared `sp_featureStackIR` patch comparison
- `src/shared/buildTypes.ts`
  - already owns the worker-facing `BuildRequest` contract
  - is the cleanup-aligned place where any richer changed-input or invalidation hint shape must be recorded if this phase outgrows raw `changedParamIds`
- `src/worker/pipeline/paramRouting.ts`
  - currently treats `sp_*` changes as broad affected work
  - is therefore too coarse for graph-native parallel extrude branches because it expands one changed authored branch into broad downstream work
- `src/worker/pipeline/buildPipeline.ts`
  - already distinguishes affected versus cache-hit parts
  - currently depends on `changedParamIds` being precise enough to matter
- `src/worker/buildModel.ts`
  - still computes the included worker-facing part set as one request-level build model result before later progress publication
  - therefore can still do broad work even when later per-part progress looks narrower
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already finalizes accepted bundles with retained sibling semantics when target build-unit scope is honest
  - should not become the hidden owner of affected-subgraph guessing in this phase

Important current-reality rule:
- this phase should not pretend ParaHook already has full command-history checkpoints or generic CAD replay
- the first honest win is narrowing graph-native branch invalidation inside the current worker request/build path

### Locked Direction

#### 1. The worker should rebuild the affected downstream cone, not every parallel branch

The guiding rule for this phase is:
- changing one authored node should rebuild that node and its true downstream dependents
- upstream nodes that the changed node depends on should remain untouched unless they were themselves edited
- parallel sibling branches outside that cone should remain retained

The first concrete proof case is:
- `Extrude 2 -> Object 2` changes
- `Extrude 1 -> Object 1` remains retained
- downstream `Output Preview` recomposes from:
  - retained `Object 1`
  - rebuilt `Object 2`

Important rule:
- composition is not itself a reason to recompute unrelated sibling branches

#### 2. Request-time changed-input hints must become precise enough to identify the changed node before worker routing widens to its downstream cone

The current `sp_featureStackIR`-wide patch comparison is too broad for graph-native geometry edits.

Recommended first direction:
- preserve existing shared feature-stack payload transport
- add one narrower changed-input classification layer that can distinguish:
  - shared sketch/profile topology changes
  - branch-local extrude parameter changes
  - later branch-local downstream feature changes
- make the changed-input contract describe the changed authored branch precisely enough that worker routing can derive the true downstream cone instead of treating all `sp_*` changes as graph-wide churn

Important rule:
- do not throw away `sp_featureStackIR` transport in this phase
- first separate:
  - payload transport truth
  - changed-input / affected-subgraph hint truth

#### 3. `Output Preview` recomposition is a downstream consumer, not a reason to rebuild unrelated siblings

The downstream composition rule for this phase is:
- `Output Preview` and similar composition surfaces may need to recompose after one branch changes
- that recomposition should use:
  - rebuilt outputs from the affected downstream cone
  - retained outputs from unaffected sibling branches
- composition itself is not evidence that sibling authored branches were affected

Important rule:
- do not let downstream composition semantics turn into broad sibling invalidation
- do not treat "included in the same preview/output surface" as equivalent to "downstream dependent of the changed node"

#### 4. Accepted retained-sibling truth should remain finalized in runtime acceptance, but worker-facing scope must get honest enough to feed it

This phase should keep the current ownership split:
- worker/request translation plus worker routing own the narrow rebuilt set
- graph runtime acceptance finalizes retained-versus-rebuilt bundle truth

Important rule:
- do not move retained-sibling classification back into loose Browser or viewer heuristics
- keep graph runtime as the accepted-result owner while this phase makes the worker-facing affected scope narrow enough to feed it honestly

#### 5. The first implementation should target one narrow graph-native family before widening

The first real target should be:
- shared-sketch or parallel-branch `Geometry/Extrude` cases

That means the first behavior bar is:
- extrude parameter changes such as depth, taper, or direction stay local to the changed extrude branch unless true upstream topology changed

Important rule:
- do not widen the first slice into every future geometry node type if `Extrude` gives a clear enough proof surface

### Implementation Target

`Worker 9` should make one architecture shift real:

- graph-native request translation stops describing every feature-stack change as broad worker-affected work
- worker/runtime affected-part scope becomes honest enough to follow `changed node -> downstream dependents only`
- upstream nodes and unrelated sibling branches remain retained when they are outside that downstream cone
- accepted bundles become more truthful without inventing new app-side semantic categories

The minimum meaningful behavior change should be:
1. two parallel branch outputs are wired into `Output Preview`
2. the user edits one branch-local extrude parameter
3. only that extrude branch rebuilds
4. the unaffected sibling branch stays retained
5. the recomposed accepted result still contains both outputs

### Expected File Targets

Primary implementation files:
- `src/shared/buildTypes.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/pipeline/paramRouting.ts`

Likely supporting files:
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- targeted graph/worker/store tests around accepted retained sibling behavior

### Verification Bar

This phase is only done if it proves both:
- rebuild scope became narrower
- accepted result truth stayed honest

Required proof:
- changing one extrude depth in a parallel-branch graph no longer marks the sibling extrude branch as rebuilt
- changing one branch-local extrude parameter does not rebuild upstream nodes that were not edited
- accepted bundles still show:
  - changed branch as `rebuilt`
  - unaffected sibling branch as `retained`
- recomposed output still includes both visible objects after the rebuild
- true shared-topology changes still widen affected scope when they actually should
- no new app-side heuristic layer is needed to fake retained sibling truth

### Internal Phase Ladder

This doc is split into five internal implementation slices so Codex can execute them one at a time without widening into the whole lane at once.

## [x] Worker 9 Phase 1 - Changed-Input Classification And First Extrude-Local Hints

### Purpose

Separate broad feature-stack payload transport from the narrower changed-input hints needed to tell when a graph-native extrude edit is branch-local.

### Owns

- first explicit changed-input classification for graph-native extrude-local edits
- preserving existing worker payload transport while adding narrower hints
- the first narrow contract between request translation and worker affected-part routing

### Does Not Own

- full downstream-cone execution pruning
- broad recomposition changes
- non-extrude node families

### Implementation Target

After this slice:
- request translation can distinguish at least one first class of branch-local extrude edits from broad shared-sketch topology edits
- the worker receives changed-input hints narrow enough for later affected-part routing to identify the changed branch before deriving its downstream cone

### First Proof

- an extrude depth-only edit no longer arrives at worker routing as an undifferentiated broad `sp_*` feature-stack change
- the new hint contract is narrow and explicit enough that later worker routing can stay deterministic

### Current Landed Baseline

This slice should start from the current live reality:

- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - already filters worker-facing extrudes down to the ones that `Output Preview` actually consumes
  - already builds deterministic output-entry build units for grouped versus split publication
  - still reports graph-native geometry edits through the coarse `sp_featureStackIR` patch diff
- `src/shared/buildTypes.ts`
  - already owns the worker-facing `BuildRequest` contract and is the correct home for any richer changed-input hint shape
- `src/worker/pipeline/paramRouting.ts`
  - currently widens any `sp_*` changed param to all ordered part keys
- `src/worker/buildModel.ts`
  - still builds the full request-level part set before the later affected/cache-hit distinction in `buildPipeline.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns accepted retained-versus-rebuilt bundle truth and should stay downstream from the new hint contract rather than guessing the affected graph itself

Important current-baseline rule:
- `Phase 1` is not enough if it only changes progress labels
- the first hint contract must be shaped so later `Phase 2` can narrow real worker scope, not just post-build reporting

### Locked Contract Direction

The first contract addition should stay narrow.

Recommended first shape:
- keep `changedParamIds` for compatibility and existing diagnostics reads
- add one explicit graph-native hint surface on the worker-facing request contract that can say at least:
  - one branch-local `Geometry/Extrude` authored node changed
  - one shared upstream sketch/profile source changed
- make the new hint describe authored graph identity, not viewer/output interpretation

The first contract should be able to answer:
- which authored extrude node changed
- which worker-facing part key owns that authored node
- whether the change is branch-local extrude params versus shared upstream topology/input truth

Important contract rule:
- do not replace `sp_featureStackIR`
- do not ask `useSpaghettiStore.ts` to infer the changed node after the worker result returns
- do not encode `Output Preview` composition membership as the affected-subgraph answer

### First Explicit Proof Graph

The first implementation proof graph for this slice should be one narrow parallel-branch case:

- one `Geometry/Sketch`
- two downstream `Geometry/Extrude` nodes consuming that sketch
- one `System/OutputPreview`
- both extrude outputs published through separate visible objects

The first edit proof should be:
- change only `Extrude 2` depth
- classify that edit as branch-local to `Extrude 2`
- preserve the possibility that later worker routing can keep `Extrude 1` out of the affected cone

The first widening control should be:
- change shared sketch/profile topology instead of the extrude depth
- classify that edit as shared-upstream so later worker routing is still allowed to widen

### Expected File Targets

Primary files for this slice:
- `src/shared/buildTypes.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- targeted request-contract tests in `src/app/spaghetti/integration/buildInputsToRequest.test.ts`

Supporting read-only or follow-on-aware files for this slice:
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`

Important target rule:
- `Phase 1` may prepare later worker routing files for the new contract shape
- `Phase 1` should not yet widen into the actual downstream-cone execution logic that belongs to `Phase 2`

### Implementation Order

1. Add the narrow changed-input hint shape to `src/shared/buildTypes.ts` without deleting `changedParamIds`.
2. Teach `src/app/spaghetti/integration/buildInputsToRequest.ts` to derive the first extrude-local versus shared-upstream classification from current and previous graph-native build inputs.
3. Keep the existing worker payload transport intact while threading the new hint through the request contract.
4. Add focused tests proving the first branch-local extrude edit and first shared-upstream widening classification read.
5. If needed, make only the smallest compatibility updates in worker-side readers so the new request contract remains accepted without yet changing routing behavior.

### Verification Bar

This slice is only done if it proves:

- a branch-local extrude depth edit no longer reaches the worker contract only as broad `sp_featureStackIR` churn
- the new hint contract identifies the changed authored extrude node and its owning worker-facing part key
- a shared sketch/profile topology change still arrives as a widening-allowed classification instead of a branch-local extrude hint
- existing output-entry build-unit targeting and `Output Preview` filtering stay unchanged
- existing accepted-bundle ownership does not move out of graph runtime acceptance

Suggested proof surfaces:
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/shared/buildTypes.test.ts`

### Landed Result

This slice is now landed in the current codebase:

- `src/shared/buildTypes.ts`
  - now owns the explicit `BuildChangedInputHint` worker-facing contract plus runtime validation
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - now derives the first honest split between:
    - branch-local `graph_local_extrude_params`
    - shared-upstream `graph_shared_upstream`
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`
- `src/worker/worker.ts`
  - now preserve and validate the new request hint end to end
- focused proof coverage now exists in:
  - `src/shared/buildTypes.test.ts`
  - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
  - `src/app/buildDispatcher.test.ts`
  - `src/worker/worker.test.ts`

The current landed behavior is:
- branch-local extrude depth/taper/direction-style edits no longer enter the worker contract only as undifferentiated `sp_featureStackIR` churn
- shared sketch/profile changes still classify as widening-allowed upstream edits
- target build-unit selection and actual worker routing remain intentionally broad until `Phase 2`

### Stop Rule

`Phase 1` stops after the request contract and request translation can describe the first narrow changed-node classification honestly.

It does not yet own:
- actual downstream-cone pruning in worker routing
- execution-time retained sibling recomposition changes
- broad non-extrude graph-native node coverage
- full graph dependency replay or history semantics

## [x] Worker 9 Phase 2 - Worker Downstream-Only Routing For Parallel Extrude Branches

### Purpose

Use the narrower changed-input hints to make worker-side affected-part routing honest for the first shared-sketch or parallel-branch extrude cases.

### Owns

- first worker-side affected-part narrowing for graph-native extrude-local edits
- explicit `changed branch -> downstream dependents only` routing for the first parallel extrude cases
- preserving broader widening when upstream sketch/profile topology truly changed
- the first explicit affected downstream cone for parallel extrude branches

### Does Not Own

- general recomposition architecture
- broader node-family widening beyond the first extrude target

### Implementation Target

After this slice:
- a branch-local extrude parameter edit affects only the changed extrude branch
- downstream dependents of that changed extrude branch still rebuild when they truly consume it
- shared-sketch topology edits can still widen affected scope when they truly should

### First Proof

- `Extrude 2` depth changes no longer mark `Extrude 1` as affected when only branch-local authored extrude params changed
- `Extrude 2` depth changes do not rebuild unchanged upstream authored nodes
- a true shared sketch/profile change can still affect both branches

### Current Landed Baseline

This slice should start from the current live reality after `Phase 1`:

- `src/shared/buildTypes.ts`
  - already carries the `changedInputHint` worker-facing contract
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - already derives:
    - branch-local `graph_local_extrude_params`
    - shared-upstream `graph_shared_upstream`
- `src/worker/pipeline/paramRouting.ts`
  - still only reads `changedParamIds`
  - still widens any `sp_*` change to all ordered part keys
- `src/worker/pipeline/buildPipeline.ts`
  - still computes `affectedSet` after `buildModelResult(...)`
  - therefore still depends on the worker model itself being able to narrow real scope
- `src/worker/buildModel.ts`
  - still builds request-level draft and authoritative geometry from the full `compiledBuildData`
  - still seeds request `partKeys` from the full ordered part key or feature-stack part set before later affected/cache-hit reporting

Important current-baseline rule:
- `Phase 2` is not enough if it only narrows `build_progress` messages
- this slice must narrow real worker execution scope for the first parallel-extrude case, not just post-build narration

### Locked Routing Direction

The first worker narrowing should stay explicit and small.

#### 1. Branch-local extrude hints should narrow the first affected set to the changed worker-facing part key

For the first target case:
- `graph_local_extrude_params`
- one changed extrude node
- one changed worker-facing part key

The routing result should be:
- affected set starts at that changed part key
- unchanged sibling extrude branches stay out of the first affected set
- unchanged upstream sketch nodes stay untouched because the edit is not upstream truth

#### 2. Shared-upstream hints should remain widening-allowed for the first sketch-driven proof

For the first shared-sketch case:
- `graph_shared_upstream`
- changed part keys already describe the downstream branches that depend on the shared source

The routing result should be:
- affected set widens to those changed downstream part keys
- the first local-extrude narrowing does not regress shared-topology honesty

#### 3. `changedInputHint` should narrow worker routing without deleting compatibility reads

This slice should:
- prefer `changedInputHint` when it is present and valid for graph-native requests
- preserve `changedParamIds` as the fallback compatibility path
- avoid turning the new hint into a hidden requirement for older worker request shapes

#### 4. Real worker scope must narrow before acceptance/recomposition phases claim success

This slice should treat as insufficient:
- changing only `computeAffectedPartKeys(...)` while `buildModelResult(...)` still does broad full-request work
- changing only result labels or progress events

The first honest worker-scope narrowing should ensure:
- the model/execution request can follow the narrowed affected part set for the first local-extrude proof case
- later `Phase 3` recomposition can build on real retained sibling truth instead of optimistic labels

### First Explicit Proof Graph

Use the same first narrow control graph from `Phase 1`:

- one shared `Geometry/Sketch`
- two downstream `Geometry/Extrude` nodes
- one `System/OutputPreview`
- each extrude published through its own output object

Required local proof:
- change only `Extrude 2` depth
- worker affected scope narrows to the `Extrude 2` branch
- `Extrude 1` stays outside the affected set

Required widening control:
- change the shared sketch/profile topology
- worker affected scope widens to both downstream extrude branches

### Expected File Targets

Primary files for this slice:
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.ts`

Likely supporting files:
- `src/shared/buildTypes.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- focused worker-routing and worker-pipeline tests

Important target rule:
- `Phase 2` should consume the `Phase 1` hint contract that already landed
- `Phase 2` should not yet widen into accepted-bundle recomposition hardening, which belongs to `Phase 3`

### Implementation Order

1. Teach `src/worker/pipeline/paramRouting.ts` to read the new graph-native `changedInputHint` contract while preserving `changedParamIds` fallback behavior.
2. Thread the narrowed affected-part read through `src/worker/pipeline/buildPipeline.ts` so the first local-extrude proof path stops treating all `sp_*` edits as broad affected work.
3. Update `src/worker/buildModel.ts` so the first local-extrude proof can narrow actual model/execution scope instead of only narrowing progress reporting after full request work already happened.
4. Add focused tests proving:
   - local extrude hints narrow to one branch
   - shared-upstream hints still widen honestly
   - unchanged upstream authored nodes are not treated as rebuilt for the local extrude proof
5. Keep accepted-result ownership where it already lives; do not move retained/rebuilt classification into app-side heuristics during this slice.

### Verification Bar

This slice is only done if it proves:

- `graph_local_extrude_params` narrows worker affected scope to the changed extrude branch in the first parallel-extrude proof graph
- the first local extrude proof no longer executes broad full-request worker work just because `changedParamIds` still contains `sp_featureStackIR`
- unchanged upstream authored sketch inputs are not treated as affected for the local extrude proof
- `graph_shared_upstream` still widens worker affected scope when shared sketch/profile truth changed
- existing accepted-result ownership and output-entry build-unit identity stay unchanged

Suggested proof surfaces:
- `src/worker/pipeline/paramRouting.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- targeted worker-model or graph-native worker integration tests for the first parallel-extrude proof graph

### Stop Rule

`Phase 2` stops after the worker can narrow real execution scope for the first parallel-extrude branch-local proof while preserving widening for shared-upstream edits.

It does not yet own:
- retained-sibling recomposition hardening through `Output Preview`
- accepted-bundle visibility proofs for `Object 1 retained / Object 2 rebuilt`
- broader non-extrude dependency coverage
- history or scrubber semantics

### Landed Result

This slice is now landed in the current codebase:

- `src/worker/pipeline/paramRouting.ts`
  - now prefers `changedInputHint` for the first graph-native local-versus-shared affected-part read while preserving the older `changedParamIds` fallback
- `src/worker/pipeline/buildPipeline.ts`
  - now narrows the first actual execution scope to affected part keys for local branch hints instead of only narrowing later progress interpretation
  - now emits narrowed partial bundles for the first local-branch proof and omits partial geometry lanes so accepted runtime truth can retain the previous full geometry bundle until later recomposition work lands
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - now narrows target and affected build-unit ids to the changed branch for the first local extrude proof so accepted bundle finalization does not evict untouched siblings
- focused proof coverage now exists in:
  - `src/worker/pipeline/paramRouting.test.ts`
  - `src/worker/pipeline/buildPipeline.test.ts`
  - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`

The current landed behavior is:
- a branch-local `Extrude 2` change narrows worker execution to the `Extrude 2` branch
- unchanged sibling branches no longer get pulled into the first local-branch execution pass just because `changedParamIds` still includes `sp_featureStackIR`
- shared-upstream sketch changes still widen to both downstream branches
- accepted bundle finalization can now keep untouched siblings retained when the narrowed local-branch bundle lands

Important remaining rule:
- this slice intentionally stops short of making `Output Preview` recomposition and accepted geometry lanes explicitly merge retained plus rebuilt branch geometry truth; that is still the `Phase 3` target

## [ ] Worker 9 Phase 3 - Retained Sibling Recomposition Through Output Preview

### Purpose

Make the current accepted-result recomposition path prove that downstream composition can keep retained sibling outputs alive while one parallel branch rebuilds.

### Owns

- retained plus rebuilt recomposition for the first parallel branch proof case
- ensuring `Output Preview`-driven composition does not force sibling branch reload by itself
- hardening accepted bundle truth around the new narrower affected scope

### Does Not Own

- Build Path history storage
- branch restore or timeline scrub UX
- generalized viewer overlay presentation

### Implementation Target

After this slice:
- parallel branch rebuilds recompose through the accepted bundle/output surface without dropping or reloading unaffected sibling outputs
- the recomposition step reads as a downstream consumer over retained plus rebuilt outputs instead of as a reason to invalidate sibling authored branches
- the first visible `Object 1 retained, Object 2 rebuilt` proof becomes real

### First Proof

- after `Extrude 2 -> Object 2` changes, `Object 1` remains visible from retained accepted truth while `Object 2` updates
- output composition still converges on one honest accepted result surface

### Current Landed Baseline

This slice should start from the current live reality after `Phase 2`:

- `src/worker/pipeline/buildPipeline.ts`
  - already narrows local branch execution to the changed part keys for the first `graph_local_extrude_params` proof
  - currently emits narrowed partial bundles for local branch edits
  - currently omits partial draft/authoritative geometry lanes on those narrowed passes so runtime truth does not silently replace full accepted geometry with a partial branch snapshot
- `src/worker/pipeline/artifactEmitter.ts`
  - already maps worker `parts` plus optional geometry lanes into build-result bundle entries
  - currently has no explicit retained-plus-rebuilt recomposition ownership of its own
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already finalizes accepted bundles with `rebuilt`, `retained`, and `evicted` statuses
  - already derives accepted output artifacts from that finalized bundle
  - currently treats accepted draft/authoritative geometry promotion as whole-lane acceptance rather than retained-plus-rebuilt branch recomposition
- `src/app/spaghetti/outputSurface.ts`
  - already derives graph output-surface publication from the finalized accepted bundle
  - should stay a downstream consumer of accepted recomposition truth rather than becoming the hidden owner of retained-branch guessing

Important current-baseline rule:
- `Phase 3` is not about proving retained outputs only through artifact labels while geometry lanes stay stale or partial
- this slice must make the accepted runtime/output composition read as one honest recomposed result surface for the first parallel-branch case

### Locked Recomposition Direction

The first retained-sibling recomposition pass should stay explicit and runtime-owned.

#### 1. Accepted bundle recomposition remains the owner of retained-versus-rebuilt output truth

This slice should keep the current ownership split:
- worker emits the narrowed rebuilt branch result
- graph runtime acceptance recomposes that rebuilt branch together with retained sibling entries

Important rule:
- do not move retained-sibling recomposition into Browser/viewer heuristics
- do not ask `artifactEmitter.ts` to invent retained entries by itself

#### 2. `Output Preview` should read the recomposed accepted result as one downstream surface

For the first proof case:
- `Object 2` rebuilds
- `Object 1` remains retained

The accepted result should converge so that:
- accepted bundle entries still contain both outputs
- accepted output artifacts still contain both visible objects
- the output surface/publication read sees one honest recomposed result instead of a partial narrowed worker snapshot

#### 3. Accepted geometry lanes should stay honest when local branch builds are partial

The current `Phase 2` behavior intentionally omits partial geometry lanes for narrowed local branch worker passes.

`Phase 3` should decide and prove the first honest retained-plus-rebuilt geometry outcome:
- either accepted geometry remains explicitly whole-result and safely preserved when a narrowed branch pass cannot recompose it yet
- or runtime acceptance learns the first explicit retained-plus-rebuilt geometry recomposition rule for the first parallel branch case

Important rule:
- do not silently replace a full accepted geometry bundle with a partial local-branch geometry snapshot
- do not claim recomposition is done if accepted draft/authoritative truth is still only “whatever happened to survive”

#### 4. The first proof should stay inside the existing shared-sketch parallel extrude case

This slice should continue using:
- one shared sketch
- two extrude branches
- one `Output Preview`

Important rule:
- do not widen the first recomposition pass into a generalized multi-node-family composition framework

### First Explicit Proof Graph

Use the same first narrow control graph from `Phase 1` and `Phase 2`:

- one shared `Geometry/Sketch`
- two downstream `Geometry/Extrude` nodes
- one `System/OutputPreview`
- each extrude published through its own output object

Required local proof:
- change only `Extrude 2` depth
- worker rebuild scope stays local to `Extrude 2`
- accepted bundle/output composition still exposes both visible output objects
- `Object 1` stays retained while `Object 2` is rebuilt

Required geometry-lane control:
- if accepted geometry lanes are preserved rather than recomposed in this slice, prove they remain explicitly stable and non-partial across the narrowed branch update
- if accepted geometry lanes are recomposed in this slice, prove the first retained-plus-rebuilt branch geometry read is explicit and deterministic

### Expected File Targets

Primary files for this slice:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/worker/pipeline/artifactEmitter.ts`

Likely supporting files:
- `src/app/spaghetti/outputSurface.ts`
- `src/worker/pipeline/buildPipeline.ts`
- focused graph-runtime acceptance and output-surface tests

Important target rule:
- `Phase 3` should build directly on the landed `Phase 2` narrowed worker result shape
- `Phase 3` should not reopen worker routing rules that already belong to `Phase 2`

### Implementation Order

1. Lock the first accepted-runtime recomposition rule in `src/app/spaghetti/store/useSpaghettiStore.ts` for how narrowed rebuilt entries merge with retained sibling entries and accepted outputs.
2. Decide the first honest treatment of accepted draft/authoritative geometry lanes for narrowed local-branch builds and implement that rule without allowing partial branch geometry to masquerade as whole accepted truth.
3. Keep `src/worker/pipeline/artifactEmitter.ts` limited to emitting the rebuilt worker result while tightening any bundle-entry details needed so runtime acceptance can recompose deterministically.
4. Verify that `Output Preview` and accepted output-surface reads still expose both visible objects after a narrowed local branch rebuild.
5. Add focused tests proving retained sibling bundle truth, accepted output artifact truth, and the chosen accepted geometry-lane rule for the first parallel-extrude proof graph.

### Verification Bar

This slice is only done if it proves:

- after a local `Extrude 2` rebuild, accepted bundle entries still contain both output objects with:
  - `Object 2` as `rebuilt`
  - `Object 1` as `retained`
- accepted output artifacts still expose both visible objects after the narrowed branch rebuild
- the output surface/publication read remains converged on one honest accepted result instead of a partial local-branch snapshot
- accepted draft/authoritative geometry truth follows one explicit honest rule for narrowed local branch passes and never regresses to partial hidden truth
- no Browser/viewer heuristic layer is introduced to fake retained sibling recomposition

Suggested proof surfaces:
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- targeted output-surface or accepted-build-output tests for the first shared-sketch parallel extrude graph

### Stop Rule

`Phase 3` stops after retained sibling recomposition through the accepted runtime/output path is explicit and honest for the first parallel-extrude proof graph.

It does not yet own:
- broader shared-upstream widening hardening beyond the first proof family
- generalized multi-node-family composition rules
- history, restore, or scrubber semantics

## [ ] Worker 9 Phase 4 - Shared-Upstream Widening Rules And Hardening

### Purpose

Lock the boundary between branch-local edits and true shared-upstream edits so the worker widens affected scope only when the dependency graph actually requires it.

### Owns

- hardening around shared sketch/profile topology changes
- explicit proof that widening still happens when upstream authored shape truth changed
- confidence that the earlier narrowing logic does not under-rebuild

### Does Not Own

- full generic node-family dependency analysis
- command-history checkpoints
- workspace-mode scrubber behavior

### Implementation Target

After this slice:
- branch-local extrude edits stay local
- shared-upstream edits widen honestly
- downstream-only invalidation is now explicit enough that future worker work can reuse it without re-explaining upstream versus downstream direction
- the first parallel-branch affected-subgraph rule is trustworthy enough to build on

### First Proof

- changing one extrude depth stays local
- changing shared upstream sketch/profile topology widens to the downstream branches that truly depend on it
- accepted bundle truth remains consistent in both cases

## [ ] Worker 9 Phase 5 - Family Handoff Toward Build Path And Broader Node Coverage

### Purpose

Close the first worker-only affected-subgraph lane cleanly so later `Build Path` and broader geometry-node work can build on stable worker truth instead of restating the same retained-sibling rule.

### Owns

- hardening the worker-facing contract and tests for the first parallel-branch target
- recording what later families can now assume
- narrowing the follow-on gap toward command-history checkpoints and wider node-family coverage

### Does Not Own

- actual `Build Path` history implementation
- workspace-mode UX
- all later geometry node generalization

### Implementation Target

After this slice:
- the worker family has one proven affected-subgraph base for parallel branch rebuilds
- later `Build Path` phases can assume retained sibling recomposition is real instead of speculative
- later worker work can widen from the extrude-first proof into other graph-native geometry families if justified

### First Proof

- the repo has one stable end-to-end proof that parallel branch rebuilds no longer force unrelated sibling reloads
- later `Build Path` planning can cite this worker lane as a shipped prerequisite instead of restating the original bug

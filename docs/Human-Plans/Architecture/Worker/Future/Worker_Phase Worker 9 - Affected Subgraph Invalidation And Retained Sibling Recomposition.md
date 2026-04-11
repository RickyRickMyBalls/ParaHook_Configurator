# Worker Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition

## Doc Header

### Doc History
1. 2026-04-10 00:00: Created this standalone future Worker phase doc so the new `Worker 9` lane has an implementation-ready planning surface for graph-native affected-subgraph invalidation, retained sibling recomposition, and the first explicit `Extrude 2 changes should not rebuild Object 1` worker-proof ladder instead of leaving that goal only as a short section in `Worker-Index.md`

### Purpose

This doc defines the next implementation-ready phase under `Worker`.

Use it to answer:
- how ParaHook should narrow graph-native worker invalidation from broad feature-stack churn into true affected-subgraph rebuilds
- how parallel geometry branches should keep retained siblings alive while only one branch rebuilds
- where request-time changed-input hints should become more precise
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
- the first visible symptom is:
  - `Extrude 2 -> Object 2` changes
  - `Extrude 1 -> Object 1` still reloads or rebuilds even though it should remain retained

This phase exists to close that gap without widening yet into full `Build Path` history, workspace-mode scrubber UX, or deeper CAD-kernel replay work.

The goal is:
- rebuild only the changed node and its true downstream dependency cone
- retain parallel sibling branches outside that cone
- let downstream composition surfaces recompose from retained plus rebuilt branch outputs instead of forcing broad sibling reloads

### Scope

This phase covers:
- request-time changed-input precision for graph-native geometry edits
- worker/runtime affected-subgraph routing
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
- make graph-native worker rebuilds follow the true affected downstream cone instead of broad feature-stack-wide churn

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
- `src/worker/pipeline/paramRouting.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Current code-backed read:
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - already filters worker-facing extrudes down to those wired into `Output Preview`
  - still collapses graph-native geometry changes into shared `sp_featureStackIR` patch comparison
- `src/worker/pipeline/paramRouting.ts`
  - currently treats `sp_*` changes as broad affected work
  - is therefore too coarse for graph-native parallel extrude branches
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
- parallel sibling branches outside that cone should remain retained

The first concrete proof case is:
- `Extrude 2 -> Object 2` changes
- `Extrude 1 -> Object 1` remains retained
- downstream `Output Preview` recomposes from:
  - retained `Object 1`
  - rebuilt `Object 2`

Important rule:
- composition is not itself a reason to recompute unrelated sibling branches

#### 2. Request-time changed-input hints must become more precise before the worker can become more precise

The current `sp_featureStackIR`-wide patch comparison is too broad for graph-native geometry edits.

Recommended first direction:
- preserve existing shared feature-stack payload transport
- add one narrower changed-input classification layer that can distinguish:
  - shared sketch/profile topology changes
  - branch-local extrude parameter changes
  - later branch-local downstream feature changes

Important rule:
- do not throw away `sp_featureStackIR` transport in this phase
- first separate:
  - payload transport truth
  - changed-input / affected-subgraph hint truth

#### 3. Accepted retained-sibling truth should remain finalized in runtime acceptance, but worker-facing scope must get honest enough to feed it

This phase should keep the current ownership split:
- worker/request translation owns the narrow rebuilt set
- runtime acceptance finalizes retained-versus-rebuilt bundle truth

Important rule:
- do not move retained-sibling classification back into loose Browser or viewer heuristics
- make the worker-facing affected scope narrow enough that the existing accepted bundle merge becomes more truthful automatically

#### 4. The first implementation should target one narrow graph-native family before widening

The first real target should be:
- shared-sketch or parallel-branch `Geometry/Extrude` cases

That means the first behavior bar is:
- extrude parameter changes such as depth, taper, or direction stay local to the changed extrude branch unless true upstream topology changed

Important rule:
- do not widen the first slice into every future geometry node type if `Extrude` gives a clear enough proof surface

### Implementation Target

`Worker 9` should make one architecture shift real:

- graph-native request translation stops describing every feature-stack change as broad worker-affected work
- worker/runtime affected-part scope becomes honest enough for parallel sibling branches to remain retained
- accepted bundles become more truthful without inventing new app-side semantic categories

The minimum meaningful behavior change should be:
1. two parallel branch outputs are wired into `Output Preview`
2. the user edits one branch-local extrude parameter
3. only that extrude branch rebuilds
4. the unaffected sibling branch stays retained
5. the recomposed accepted result still contains both outputs

### Expected File Targets

Primary implementation files:
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
- accepted bundles still show:
  - changed branch as `rebuilt`
  - unaffected sibling branch as `retained`
- recomposed output still includes both visible objects after the rebuild
- true shared-topology changes still widen affected scope when they actually should
- no new app-side heuristic layer is needed to fake retained sibling truth

### Internal Phase Ladder

This doc is split into five internal implementation slices so Codex can execute them one at a time without widening into the whole lane at once.

## [ ] Worker 9 Phase 1 - Changed-Input Classification And First Extrude-Local Hints

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
- the worker receives changed-input hints narrow enough for later affected-part routing to depend on

### First Proof

- an extrude depth-only edit no longer arrives at worker routing as an undifferentiated broad `sp_*` feature-stack change
- the new hint contract is narrow and explicit enough that later worker routing can stay deterministic

## [ ] Worker 9 Phase 2 - Worker Affected-Part Routing For Parallel Extrude Branches

### Purpose

Use the narrower changed-input hints to make worker-side affected-part routing honest for the first shared-sketch or parallel-branch extrude cases.

### Owns

- first worker-side affected-part narrowing for graph-native extrude-local edits
- preserving broader widening when upstream sketch/profile topology truly changed
- the first explicit affected downstream cone for parallel extrude branches

### Does Not Own

- general recomposition architecture
- broader node-family widening beyond the first extrude target

### Implementation Target

After this slice:
- a branch-local extrude parameter edit affects only the changed extrude branch
- shared-sketch topology edits can still widen affected scope when they truly should

### First Proof

- `Extrude 2` depth changes no longer mark `Extrude 1` as affected when only branch-local authored extrude params changed
- a true shared sketch/profile change can still affect both branches

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
- the first visible `Object 1 retained, Object 2 rebuilt` proof becomes real

### First Proof

- after `Extrude 2 -> Object 2` changes, `Object 1` remains visible from retained accepted truth while `Object 2` updates
- output composition still converges on one honest accepted result surface

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

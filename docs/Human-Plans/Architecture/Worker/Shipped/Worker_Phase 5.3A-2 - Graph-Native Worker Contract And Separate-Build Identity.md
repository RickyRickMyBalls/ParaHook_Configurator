# Worker Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity

## Doc Header

### Doc History
4. 2026-03-23 13:12: Shipped `[5.3A-2]` by adding a canonical graph-native `compiledBuildData` request path under the existing dispatcher wrapper, landing `buildIdentity` / `invalidation` plus output-entry `buildUnitId` truth in staged and accepted graph-build state, preserving coarse `BuildResult.parts` and part-key progress as transitional compatibility, and validating the seam with focused translation/dispatcher/pipeline/store tests plus a full production build
3. 2026-03-22 19:29: Reworked `[5.3A-2]` into a real implementation-phase spec for the post-`5.3A-3` world by treating the shipped lane-and-intent scaffold as fixed groundwork, replacing the stale pre-`5.3A-3` assumptions with a request-plus-result-first rollout target, locking `output entry` as the first canonical `buildUnitId`, and defining the transitional rule that live progress may keep `partKey` while staged and accepted build state adopt graph-native build-unit truth
2. 2026-03-22 18:18: Reworked this future phase into a decision-complete contract-definition spec by locking `output entry` as the first canonical build unit, keeping `executionIntent` minimal in this phase, replacing the open-ended suggestions with one explicit request/result contract target, and defining the hard keep-versus-retire boundary that later worker, dispatcher, Browser, and Console phases must implement against
1. 2026-03-22 18:09: Created this standalone future phase doc for `[5.3A-2]`, turning the post-audit worker follow-up into an implementation-ready contract-definition phase that locks the graph-native request shape, the first honest separate-build unit, survivable routing/progress semantics, and the Browser/Console follow-through required before runtime deletion or dispatcher cleanup starts

### Purpose

This doc defines the second worker phase under `[5.3A]`.

Use it to answer:
- what code-facing request shape should replace `payload: BoxParams`
- how the first canonical `buildUnitId` lands in staged and accepted build state
- which seams still stay transitional in this phase
- what `Browser` and `Console` are allowed to postpone until later phases
- what later worker phases should implement rather than re-decide

### Why This Phase Exists

`[5.3A-1]` proved that the worker is:
- graph-routed outside
- legacy-shaped inside

`[5.3A-3]` already landed the first lane-and-intent scaffold:
- explicit `build` lane truth
- explicit `executionIntent`
- default final/full/auto graph builds
- `assemble` kept alive only as compatibility

That means the remaining architectural gap is narrower and more concrete:
- the live build seam still depends on legacy `payload: BoxParams`
- app-side graph input is still translated through `profilePatch` plus legacy instance fields
- staged and accepted build state still do not carry graph-native `buildUnitId` truth as the architectural identity
- live progress can still remain transitional for one more phase if needed

This phase exists to replace that request-and-result seam underneath the already-landed lane scaffold, so later phases can clean up dispatcher ownership, delete legacy startup/runtime fallback, and strengthen Browser/Console result semantics without inventing the contract again.

### Scope

This phase covers:
- the first graph-native request shape that real code should adopt
- the first canonical separate-build unit
- staged graph-build state and accepted-result ownership at `buildUnitId` level
- the transitional rule for keeping live progress on `partKey` temporarily
- the compatibility-only legacy boundary
- the concrete handoff for `[5.3A-4]`, `[5.3A-5]`, and `[5.3A-6]`

This phase does not cover:
- runtime deletion
- dispatcher cleanup
- Browser or Console UX redesign
- lane re-definition already locked by `[5.3A-3]`
- full `buildUnitId` progress-event adoption

## Doc Body

## [x] - `[5.3A-2]` - `Graph-Native Worker Contract And Separate-Build Identity`

### Header

Purpose:
- replace the legacy worker request seam with one graph-native code target and start carrying graph-native build-unit truth in staged and accepted result state

Owns:
- request contract replacement
- build-unit identity adoption for staged and accepted state
- accepted-result identity target
- transitional progress boundary
- hard compatibility boundary

Does not own:
- runtime deletion
- dispatcher refactor
- lane cleanup
- Browser/Console redesign
- detailed execution-intent policy

### Current Constraints

This phase starts from:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`

Locked constraints from shipped earlier phases:
- `build` is the only canonical current live lane
- `assemble` is live but transitional and compatibility-only
- `export` remains reserved but not implemented
- `lane` and `executionIntent` already exist on the live build path
- startup auto-build is real and currently unconditional
- routing identity already exists and should survive:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
- the current build payload is still canonically `payload: BoxParams`
- graph-native build input is still being translated through `profilePatch`, legacy instance fields, and `sp_*` patching
- `output entry` is still the first canonical worker `buildUnitId`
- `Browser` and `Console` still read coarse or legacy-shaped build truth rather than explicit worker-unit identity

Code seams this phase defines against:
- `src/shared/buildTypes.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
### Implementation Target

`[5.3A-2]` is no longer only a contract-definition note.

It is the phase that should make the following code-level shift real:

- app-to-worker request creation stops treating `payload: BoxParams` plus `profilePatch` as the canonical authored input seam
- staged graph-build state starts tracking graph-native `buildUnitId` identity
- accepted build results can be tied back to graph-owned output-entry identity

This phase intentionally does not require:
- full `buildUnitId` adoption in live progress events
- Browser row-schema changes
- Console transcript changes

The rollout rule is:
- request + staged state + accepted result first
- live progress may remain `partKey`-based temporarily if that keeps the cut safe
- coarse `BuildResult.parts` may remain unchanged in this phase while accepted build-unit truth lands app-side

### Graph-Native Request Contract

This phase locks the replacement worker request shape for live code adoption.

The replacement request must be one graph-native build request with these top-level families:

1. `routingIdentity`
- `projectFileId`
- `graphDocumentId`
- `buildRequestId`

2. `buildIdentity`
- current graph revision
- target `buildUnitIds`

3. `executionIntent`
- already shipped by `[5.3A-3]`
- preserved as-is in this phase
- not re-decided here

4. `invalidation`
- changed authored ids
- affected `buildUnitIds`

5. `compiledBuildData`
- graph-native compiled payload
- no canonical `BoxParams` patching
- no canonical `heelKickInstances` / `toeHookInstances` dependence
- no legacy foothook-family naming as the authored input seam

Implemented boundary in this shipped cut:
- graph-native requests now carry:
  - `compiledBuildData`
  - `buildIdentity`
  - `invalidation`
- legacy `payload` plus instance fields remain as compatibility-wrapper fields only
- graph document builds no longer patch `profilePatch` onto `state.box` as the canonical request path

Important contract rule:
- the worker request must describe graph/build truth honestly
- it must not require app-side translation into legacy part-family patch fields to be considered canonical

Important implementation rule:
- the old compatibility path may remain for a while
- but after this phase it is no longer the architectural truth the live build lane is organized around

### Build Unit Identity

This phase locks the first canonical separate-build unit as:
- one `buildUnitId` per graph-owned `output entry`

This is the canonical identity for:
- staged build targeting
- accepted build ownership
- later unit-aware progress/result/error follow-through
- later `Browser` and `Console` follow-through

Why `output entry` wins in this phase:
- it matches the current graph publication seam better than legacy part-family names
- it matches current `Browser` and project-content ownership better than a raw `slot`-only identity
- it is more stable for later `Receive` and `Build Path` consumption than `published object`, which is a downstream projection layer

Locked implications:
- `published object` is not the canonical worker build unit
- `published object` remains a downstream Browser/content projection
- raw worker artifacts may still exist beneath the unit
- legacy part keys are not canonical build-unit identity

Transitional part-key rule in this phase:
- `partKey` may survive temporarily as:
  - live progress identity
  - internal artifact labels
  - compatibility mapping labels
- `partKey` must not remain the architectural identity for staged and accepted graph build truth

### Accepted Result / Staged State Contract

This phase locks the first graph-native identity adoption depth.

Required first adoption:
- app-side request creation targets `buildUnitIds`
- staged graph-build state records `buildUnitIds`
- accepted build results can be tied back to `buildUnitIds`

This phase should therefore stop treating these as the canonical staged-build truth:
- `changedParamIds`
- `pendingStatsPartKeys`
- `pendingInstances`

Those fields may remain temporarily as compatibility bookkeeping, but staged graph build identity must start carrying:
- current graph revision
- target `buildUnitIds`
- affected `buildUnitIds`

This phase does not require richer final result schema beyond that first identity landing.

Implemented shipped choice:
- `BuildResult.parts` remains coarse in this phase
- accepted build-unit identity is promoted from staged graph-build state on acceptance
- richer worker result semantics remain deferred to `[5.3A-6]`

It only requires that accepted results and staged state can answer:
- which output-entry unit was requested?
- which output-entry unit was accepted?
- which units were affected by the authored change?

### Transitional Progress Contract

This phase keeps live progress narrower on purpose.

Allowed transitional rule:
- live progress and error events may remain `partKey`-based during `[5.3A-2]`

Required preserved identity even in that transitional state:
- `projectFileId`
- `graphDocumentId`
- `buildRequestId`
- `lane`
- `executionIntent`

Progress-state vocabulary remains unchanged:
- `queued`
- `cache_hit`
- `building`
- `done`
- `error`

Important limit:
- this phase must not pretend that `partKey` is the final unit model
- it is only a temporary live-progress identity while request, staged-state, and accepted-result truth move to `buildUnitId`

### Compatibility Boundary

This phase locks the keep-versus-retire boundary explicitly.

#### Preserved

Keep these as canonical:
- `projectFileId`
- `graphDocumentId`
- `buildRequestId`
- typed worker message families
- dispatcher stale-drop ledger model
- current progress-state vocabulary

#### Transitional Only

Treat these as compatibility-only after this phase:
- `payload: BoxParams`
- `PART_ORDER`
- `LEGACY_RUNTIME_PROJECT_FILE_ID`
- `LEGACY_RUNTIME_GRAPH_DOCUMENT_ID`
- `LEGACY_BUILD_STATS_PART_ORDER`
- default instance fallback as architectural truth
- `profilePatch` plus graph-to-legacy `sp_*` patch translation
- legacy-first part derivation as the default internal runtime path

Hard rule:
- later phases may keep some of these temporarily for compatibility
- later phases must not treat them as architectural truth anymore

### Later-Phase Handoff

#### `5.3A-3` already shipped groundwork

- `build` is the canonical live worker lane
- `executionIntent` is already explicit
- default graph builds already use final/full/auto accepted-output intent
- `assemble` is already classified as compatibility-only lane residue

#### `[5.3A-4]` must implement against this contract

- keep dispatcher ownership focused on:
  - worker lifetime
  - transport
  - typed validation
  - stale-drop
- stop treating dispatcher-published transcript/build-stats side effects as the contract-defining layer

#### `[5.3A-5]` must delete against this boundary

- remove startup/runtime dependence on:
  - legacy default instances
  - legacy build-stats order fallback
  - legacy foothook-family startup truth
  - legacy part-derivation default path

Deletion rule:
- `[5.3A-5]` should remove only what this phase has already classified as transitional-only

#### `[5.3A-6]` must strengthen result and progress semantics

- upgrade transitional live progress from `partKey` truth toward `buildUnitId`-aware truth where needed
- give `Browser` enough explicit semantics to map unit-specific rebuilds to output-entry rows and later aggregate parents without implying parent rebuilds
- give `Console` enough explicit semantics to narrate unit-specific runtime truth without using legacy part-family names as canonical identity

### Implementation Spec

Recommended reading order:
1. shipped `5.3A-1` audit record
2. shipped `5.3A-3` lane-and-intent record
3. `src/shared/buildTypes.ts`
4. `src/app/spaghetti/integration/buildInputsToRequest.ts`
5. `src/app/store/useAppStore.ts`
6. `src/app/spaghetti/store/useSpaghettiStore.ts`
7. `src/app/spaghetti/outputSurface.ts`
8. `src/worker/worker.ts`
9. `src/worker/pipeline/buildPipeline.ts`
10. `src/app/buildDispatcher.ts`

Required written outputs from this phase:
1. `Current Constraints`
2. `Implementation Target`
3. `Graph-Native Request Contract`
4. `Build Unit Identity`
5. `Accepted Result / Staged State Contract`
6. `Transitional Progress Contract`
7. `Compatibility Boundary`
8. `Later-Phase Handoff`

Suggested execution steps:
1. restate the shipped audit facts plus the shipped `5.3A-3` groundwork that constrain this phase
2. write the replacement request shape as one explicit family-level contract for live code adoption
3. lock `output entry` as the first canonical `buildUnitId`
4. define request-plus-result-first adoption depth for staged state and accepted results
5. classify `partKey` as temporary live-progress identity only
6. lock the keep-versus-retire boundary
7. write the `[5.3A-4]`, `[5.3A-5]`, and `[5.3A-6]` handoff without widening into their implementation work

Suggested verification:
- confirm the rewritten doc stays aligned with:
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- confirm the rewritten doc leaves no open decision about:
  - canonical build unit
  - request-plus-result-first adoption depth
  - replacement request families
  - transitional `partKey` boundary
  - keep-versus-retire boundary

Suggested verification commands:
- `rg -n "payload: BoxParams|type BuildRequest|type BuildResult|type BuildProgress" src/shared src/app src/worker`
- `rg -n "outputEntryId|slotId|acceptedArtifactKey|publishedAtBuildSeq|rebuildGraphDocumentIds" src/app`
- `rg -n "LEGACY_|assembled|heelKickInstances|toeHookInstances|sp_" src/shared src/app src/worker`

Discipline rules:
- do not delete legacy code in this phase
- do not re-decide detailed execution-intent policy in this phase
- do not widen into Browser/Console UX redesign in this phase
- do not require live progress to finish the full `buildUnitId` migration in this phase
- do not leave open request/build-unit questions for later implementers

Definition of done:
- the doc contains one explicit graph-native replacement for `payload: BoxParams`
- the first canonical worker build unit is locked as `output entry`
- the doc is explicit that `published object` is downstream presentation, not canonical worker identity
- the doc is explicit that staged state and accepted results adopt `buildUnitId` before live progress must do so
- the compatibility-only legacy boundary is explicit
- later phases can implement dispatcher cleanup, runtime deletion, and richer Browser/Console semantics without deciding the request/build-unit contract again

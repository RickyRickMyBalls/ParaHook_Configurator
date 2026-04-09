# `Extrude-4` - `Closed Profile Selection And Consumption Contract`

## Doc Header

### Doc History
17. 2026-04-08 08:26: Marked `Extrude 4 Phase 3C - Focused Verification And Failure Matrix Hardening` shipped after the aggregate compile/request hardening pass landed with repeated mixed-count compile proof, focused feature-stack single-selection parity guards, and draft-runtime versus authoritative failure-honesty alignment for partially invalid aggregate sketch payloads, then cleaned this child doc into a closed shipped-lane read instead of leaving `Phase 3C` open
16. 2026-04-08 08:06: Tightened `Extrude 4 Phase 3C - Focused Verification And Failure Matrix Hardening` into an implementation-ready next slice by grounding it in the already-shipped aggregate compile-acceptance test in `validateGraph.test.ts`, the compile ordering proof in `compileGraph.test.ts`, the existing feature-stack aggregate payload coverage in `compileFeatureStack.test.ts`, the current draft-runtime aggregate success plus empty/stale failure checks in `featureStackRuntime.test.ts`, and the authoritative aggregate success plus stale/empty failure checks in `buildAuthoritativeGeometry.test.ts`, while locking this phase to filling the remaining focused matrix gaps and aligning draft versus authoritative failure honesty without reopening visible copy or runtime semantics
15. 2026-04-08 08:03: Marked `Extrude 4 Phase 3B - Node Toolbar And Result Copy Honesty` shipped after `selectNodeVm.ts` gained the aggregate-aware `profileTargetMode` plus `profileCount` summary seam, `NodeView.tsx` stopped saying aggregate `SketchProfiles` is not executable and now distinguishes singular versus aggregate profile targets honestly in waiting, resolved, and placeholder copy, and the feature-style extrude summaries in `FeatureStackView.tsx` plus `ExtrudeFeatureView.tsx` now use `Profile Target` wording while focused selector and node-surface tests prove the new visible contract
14. 2026-04-08 07:45: Tightened `Extrude 4 Phase 3B - Node Toolbar And Result Copy Honesty` into an implementation-ready next slice by grounding it in the stale singular-only `Geometry/Extrude` node copy still living in `NodeView.tsx`, the still-singular extrude feature-panel summary in `ExtrudeFeatureView.tsx`, and the selector-owned extrude VM/result summary seams in `selectNodeVm.ts`, while locking this phase to visible honesty only so aggregate closed-profile execution reads truthfully across node, toolbar, and result surfaces without widening runtime or graph contracts again
13. 2026-04-08 07:42: Marked `Extrude 4 Phase 3A - SolidBody Result Ownership For Aggregate Consumption` shipped after the `Geometry/Extrude` node-side `SolidBody` publish contract began accepting whole-port aggregate `SketchProfiles` input as one feature-owned result, the runtime/result types renamed the merged aggregate shape from generic `mesh_pack_merge` to explicit `aggregate_extrusion`, and focused graph, draft-runtime, and retained-result tests now prove aggregate consumption still yields one output token, one runtime body entry, and one retained body artifact
12. 2026-04-08 07:31: Tightened `Extrude 4 Phase 3A - SolidBody Result Ownership For Aggregate Consumption` into an implementation-ready next slice by grounding it in the already-shipped one-output `Geometry/Extrude` node contract, the aggregate compile/runtime payload now emitted by `compileGraph.ts`, the new merged draft body behavior in `featureStackRuntime.ts`, and the multi-shape-set authoritative result path in `buildAuthoritativeGeometry.ts`, while locking that one extrude feature should keep publishing one feature-owned `SolidBody` result even when aggregate execution yields disconnected geometry
11. 2026-04-08 07:22: Marked `Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty` shipped after both `featureStackRuntime.ts` and `buildAuthoritativeGeometry.ts` began resolving explicit aggregate `allFromSketch` selection as the worker-owned source of truth, aggregate extrudes now produce one feature-owned draft result plus one authoritative shape-set-backed result without singular fallback, and stale or empty aggregate requests now fail honestly without collapsing through legacy `profileRef`
10. 2026-04-08 07:13: Tightened `Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty` into an implementation-ready next slice by grounding it in the now-shipped explicit aggregate compile payload, the still-singular `featureStackRuntime.ts` and `buildAuthoritativeGeometry.ts` selection seams, and the recommendation that both runtime paths should resolve `allFromSketch` deterministically while failing empty or stale aggregate cases honestly instead of falling back through legacy `profileRef`
9. 2026-04-08 07:05: Marked `Extrude 4 Phase 2B - Compile Graph And Geometry Request Routing` shipped after whole-port `SketchProfiles -> ExtrusionProfile` wiring became the explicit aggregate compile lane, graph compilation began emitting `profileSelection.mode = 'allFromSketch'` while preserving sketch-derived profile order, and focused parity plus compile tests now prove the aggregate branch stays explicit without collapsing into fake singular `profileRef` success
8. 2026-04-08 06:52: Tightened `Extrude 4 Phase 2B - Compile Graph And Geometry Request Routing` into an implementation-ready next slice by grounding it in the shipped `profileSelection` payload now emitted by both compile paths, the current whole-port `SketchProfiles -> ExtrusionProfile` validation rejection, and the recommendation to let compile ownership explicitly map whole-port aggregate wiring to `mode: 'allFromSketch'` while preserving deterministic sketch/profile order and keeping worker execution widening deferred to `Phase 2C`
7. 2026-04-08 06:28: Marked `Extrude 4 Phase 2A - Explicit Aggregate Selection Payload Contract` shipped after the graph-to-worker contract gained the explicit extrude-owned `profileSelection` descriptor, both current emit paths began populating the `single` selection branch alongside the still-legacy singular `profileRef`, and focused contract tests now prove the new request shape without widening runtime selection behavior yet
6. 2026-04-07 21:57: Tightened `Extrude 4 Phase 2A - Explicit Aggregate Selection Payload Contract` into an implementation-ready next slice by grounding it in the live singular `profileRef` request boundary, the current `compileFeatureStack.ts` and `compileGraph.ts` emit paths, and the recommendation to replace hidden aggregate inference with one explicit extrude-owned `profileSelection` descriptor while keeping compile routing and worker execution widening deferred to `Phase 2B` and `Phase 2C`
5. 2026-04-07 21:48: Promoted each remaining `Extrude-4` Codex-sized chunk into its own real `##` phase entry by turning the earlier `Phase 2A-2C` and `Phase 3A-3C` breakdown into separate implementation/prep units, while keeping `Phase 2 / Phase 3` as umbrella handoff summaries and advancing the immediate next slice to `Phase 2A - Explicit Aggregate Selection Payload Contract`
4. 2026-04-07 21:48: Expanded this `Extrude-4` child doc into the full remaining subphase ladder by keeping the existing top-level `Phase 2 / Phase 3` handoff intact while adding the concrete `Phase 2A-2C` and `Phase 3A-3C` execution breakdown for explicit aggregate selection payloads, compile/runtime routing, result ownership, surface honesty, and final verification hardening
3. 2026-04-07 21:43: Marked `Extrude 4 Phase 1 - Closed Profile Reference And Surface Contract` shipped after the live `Geometry/Extrude` node copy stopped implying the parent `SketchProfiles` aggregate already executes as one profile, the waiting/placeholder wording now explicitly stays singular around `SketchProfile`, and focused graph-validation coverage now guards that whole-port `SketchProfiles -> ExtrusionProfile` wiring still fails honestly until later compile/runtime widening
2. 2026-04-07 21:33: Tightened `Extrude 4 Phase 1 - Closed Profile Reference And Surface Contract` into an implementation-ready next slice by grounding it in the live `Geometry/Sketch` aggregate-versus-selected output pair, the still-singular `Geometry/Extrude` `ExtrusionProfile` input and node wording, the unchanged singular `profileRef` compile/runtime contract, and the recommendation to lock parent-versus-child authored meaning first while deferring all-profiles execution to `Phase 2`
1. 2026-04-07 18:44: Added this dedicated future phase doc by carving the post-authoritative-groundwork closed-profile consumption lane out of the broader `Extrude` family, locking the next extrude-owned question to parent-versus-child `SketchProfiles` consumption instead of more kernel groundwork, and tightening `Phase 1 - Closed Profile Reference And Surface Contract` into the first implementation-ready slice

### Purpose

Use this doc as the dedicated planning and execution surface for the next extrude-owned follow-on after the first narrow worker-authoritative closed-profile `Body` path already exists.

The goal here is:
- define what `Geometry/Extrude` means when it consumes the parent `SketchProfiles` output
- define what `Geometry/Extrude` means when it consumes one child closed profile
- keep sketch responsible for profile derivation while extrude owns profile selection and consumption
- keep this lane focused on closed profiles only before any open-path or wall behavior is widened later

### Scope

This phase covers:
- the closed-profile consumption contract for `Geometry/Extrude`
- parent-versus-child closed-profile wiring meaning
- the first honest node, selector, and compile/runtime wording for one-selected-profile versus all-closed-profiles behavior
- the minimum shared contract work needed to align `Extrude` with the planned `SketchProfiles` parent-array surface

This phase does not cover:
- open-path or wall extrusion behavior
- reopening worker-authoritative OC edge/wire/face/body groundwork
- unrelated toolbar polish
- broader boolean, operation, or body-management behavior
- a full sketch-output redesign beyond the handoff needed for closed profiles

## Doc Body

### Summary

`Extrude-4` is the now-shipped extrude-owned closed-profile selection lane that followed the first narrow authoritative closed-profile `Body` path downstream from graph-authored truth.

Current read:
- worker-authoritative closed-profile body lowering now exists for the shipped aggregate closed-profile subset
- `Geometry/Sketch` already publishes:
  - the aggregate `SketchProfiles` output
  - the singular `SketchProfile` output for the selected or sole closed profile
- `Geometry/Extrude` now has one explicit closed-profile consumption contract:
  - child `SketchProfile`
    - consume one selected closed profile
  - parent `SketchProfiles`
    - consume all closed profiles from the source sketch
- compile/runtime and authoritative seams now carry that authored meaning explicitly through:
  - `profileSelection`
  - legacy `profileRef` compatibility
- draft/runtime and authoritative execution now fail aggregate requests honestly for:
  - empty aggregate output
  - stale aggregate references
  - partially invalid aggregate sketch payloads
- one aggregate extrude feature still publishes one feature-owned `SolidBody` result
- visible node and feature-style surfaces now distinguish:
  - one selected `SketchProfile`
  - aggregate `SketchProfiles`
- `Sketch - 2` is still the upstream cleanup lane for making the sketch-side output surface and expanded child rows more honest
- this lane is now closed for the current closed-profile subset
- later open-path, wall, or broader sketch-surface follow-ons still belong outside this doc

Locked recommendation:
- keep this doc focused on closed profiles only
- let `Sketch` keep owning profile derivation and output structure
- let `Extrude` own profile selection and consumption meaning
- keep the shipped authored rules stable for:
  - parent `SketchProfiles`
  - one child closed profile
- stage later open-path and wall behavior as separate follow-on work

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/registry/nodeRegistry.ts`
  - already gives `Geometry/Sketch` both:
    - `SketchProfiles`
    - `SketchProfile`
  - keeps `Geometry/Extrude` on one explicit profile-target input:
    - `ExtrusionProfile`
  - remains the narrowest graph-surface owner for the shipped closed-profile consumption contract
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - now carries the local/effective authored state plus aggregate-aware target-summary state that the node surface presents
  - is the selector-owned seam for honest profile-target summary wording across singular versus aggregate wiring
- `src/app/spaghetti/canvas/NodeView.tsx`
  - renders the live `Geometry/Extrude` input surface
  - now distinguishes singular versus aggregate profile targets honestly in waiting, resolved, and placeholder copy
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - lowers feature-stack authored truth into the worker-facing request contract
  - now has focused parity coverage for:
    - explicit `single` payload lowering
    - stale feature-stack `profileRef` honesty
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - is the typed boundary for the graph-to-worker handoff
  - carries:
    - explicit `profileSelection`
    - legacy singular `profileRef`
  - is the durable closed-profile selection contract for the shipped subset
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - now uses the aggregate-aware `Profile Target` summary wording that matches the node-side contract
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - owns the narrow supported authoritative `Body` result path for the shipped aggregate subset
  - now stays aligned with draft-runtime failure honesty for stale, empty, and partially invalid aggregate requests

### Phase Breakdown

1. `Extrude 4 Phase 1 - Closed Profile Reference And Surface Contract`
Reason:
- the safest first cut is locking what the node means when it points at the parent `SketchProfiles` output versus one child closed profile before widening compile/runtime behavior

2. `Extrude 4 Phase 2 - Compile And Runtime Selection Contract`
Reason:
- once the visible surface contract is explicit, the next honest step is carrying the chosen one-profile versus all-profiles meaning through compile/runtime without hidden inference
Current status:
- shipped
- current handoff:
  - `Phase 3A - SolidBody Result Ownership For Aggregate Consumption`

3. `Extrude 4 Phase 3 - Profile Target Summary And Consumption Honesty Cleanup`
Reason:
- after the contract survives execution, the remaining work is cleaning visible wording, summaries, and fallback behavior so the node, toolbar, and final result stop implying broader profile-selection support than actually exists
Current status:
- shipped
- this closes `Extrude-4` for the current closed-profile subset

## [x] Extrude 4 Phase 1 - Closed Profile Reference And Surface Contract

### Summary

#### Purpose:
- lock the first explicit closed-profile selection contract for the graph-native `Geometry/Extrude` node surface
- define the first honest meaning for parent-versus-child `SketchProfiles` wiring
- avoid mixing this first slice with open paths, walls, or broader runtime widening

#### Shipped result:
- `Geometry/Extrude` now has one explicit first-pass authored rule for what it means to consume:
  - the parent `SketchProfiles` output
  - one child closed profile
- the live node wording now stays explicitly singular around:
  - `SketchProfile`
  - one executable profile
- the node no longer implies the parent `SketchProfiles` aggregate already executes end to end in this phase
- focused graph validation now keeps whole-port aggregate wiring honest:
  - `SketchProfiles -> ExtrusionProfile`
  - still rejected until later widening
- compile/runtime execution remains intentionally singular in this shipped slice

#### Current handoff:
- `Extrude 4 Phase 2 - Compile And Runtime Selection Contract`
- keep the authored meaning locked and carry it through compile/runtime next without silently inferring aggregate execution from the parent row

#### Locked direction:
- stay closed-profile only
- keep profile derivation and output discovery in `Sketch`
- keep profile selection and consumption meaning in `Extrude`
- prefer one honest narrow first-pass behavior over a broader ambiguous multi-profile promise
- keep the compiled and worker-executed contract singular in `Phase 1`
- defer all-profiles execution to `Phase 2`

### Questions / Decisions

#### [x] Question 1 - Should `Extrude-4` own raw profile derivation or profile selection meaning?

##### Locked answer
- own profile selection and consumption meaning only
- keep raw profile derivation in `Sketch`

##### Why
- sketch already owns profile formation and should stay the source of closed-profile truth
- extrude is the correct family to decide how a chosen closed profile or profile set gets consumed

#### [x] Question 2 - Should this first slice include open paths or wall behavior?

##### Locked answer
- no
- keep the first pass to closed profiles only

##### Why
- the current missing contract is already large enough without mixing in open-path or wall semantics
- keeping the scope narrow lets the parent-versus-child closed-profile rule become explicit first

#### [x] Question 3 - What should this first slice lock before compile/runtime widening?

##### Locked answer
- the visible authored meaning of:
  - parent `SketchProfiles`
  - one child closed profile
- the first row and summary wording needed so the node can speak that difference honestly

##### Why
- surface truth needs to exist before deeper compile/runtime work can be judged or verified honestly

#### [x] Question 4 - What should the parent `SketchProfiles` output mean for `Extrude` once this lane is complete?

##### Locked answer
- the parent `SketchProfiles` output should mean:
  - consume all closed profiles

##### Why
- this stays aligned with the sketch-side direction already locked in `Sketch - 2`
- it gives the graph one clean aggregate meaning instead of pretending the parent row is just another name for one selected profile

#### [x] Question 5 - Should `Phase 1` widen compile/runtime execution to all profiles immediately?

##### Locked answer
- no
- keep `Phase 1` on the authored reference and visible surface contract only
- keep the live executable path singular around one child `SketchProfile`
- move all-profiles compile/runtime and worker selection behavior to `Phase 2`

##### Why
- the current code path is singular from:
  - `Geometry/Extrude` input evaluation
  - selector VM
  - `compileFeatureStack.ts`
  - `geometryRequest.ts`
- forcing aggregate execution into the same first slice would broaden the implementation and verification surface too much

#### [x] Question 6 - What should the visible row call the executable first-pass target in `Phase 1`?

##### Locked answer
- keep the visible first-pass executable target as:
  - `SketchProfile`

##### Why
- that is the honest current executable contract
- renaming the row to a broader aggregate-sounding target before `Phase 2` would imply support the compile/runtime path does not yet have

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- focused tests near the node registry, selector, node view, and compile seams

Locked first-cut direction:
1. lock the authored meaning now:
   - child `SketchProfile`
     - consume one selected closed profile
   - parent `SketchProfiles`
     - later means consume all closed profiles
2. make the current live surface honest about the still-singular executable path:
   - keep the visible executable target wording on:
     - `SketchProfile`
   - stop implying the aggregate parent path already executes end to end
3. keep the first pass honest and narrow:
   - closed profiles only
   - no open paths
   - no wall behavior
4. keep the compiled/runtime request contract singular in `Phase 1`:
   - no all-profiles execution yet
   - no worker-owned aggregate selection policy yet
5. keep worker-authoritative OC body construction downstream from this contract rather than re-owning selection policy in the worker
6. defer broader compile/runtime widening until `Phase 2` unless a tiny contract addition is required to keep authored meaning typed and explicit

Verification matrix:
- the docs and visible node wording explicitly distinguish:
  - parent `SketchProfiles`
  - one child `SketchProfile`
- the node surface stays honest that `Phase 1` executable support is still one child closed profile
- the selector and summary wording stop implying the aggregate parent path already executes
- the phase does not imply open-path or wall support
- the already-shipped narrow authoritative closed-profile `Body` path remains the downstream execution owner, not a new source of selection policy
- singular `profileRef` compile/runtime ownership remains intact until `Phase 2`

## [ ] Extrude 4 Phase 2 - Compile And Runtime Selection Contract

### Summary

#### Purpose:
- make the now-shipped authored distinction between one child `SketchProfile` and aggregate `SketchProfiles` survive compile/runtime explicitly

#### Current status:
- next open umbrella phase
- immediate next Codex-sized phase:
  - `Phase 2B - Compile Graph And Geometry Request Routing`

#### Locked direction:
- prefer one explicit typed aggregate selection contract over hidden whole-port inference
- keep compile ordering deterministic
- keep worker failure honesty explicit when aggregate selection resolves to zero valid closed profiles

### Implementation Spec

Suggested execution order:
1. `Phase 2A` is now shipped and owns the explicit payload shape
2. ship `Phase 2B` so compile-side routing preserves authored intent deterministically
3. ship `Phase 2C` so worker draft and authoritative paths resolve aggregate selection honestly

Definition of done:
- aggregate closed-profile selection can survive end-to-end execution without hidden inference
- single-profile behavior remains explicit and unchanged
- later result/surface cleanup can describe one real shipped execution contract

## [ ] Extrude 4 Phase 3 - Profile Target Summary And Consumption Honesty Cleanup

### Summary

#### Purpose:
- finish the lane by making result ownership, node copy, toolbar wording, and verification all match the shipped aggregate execution truth

#### Current status:
- active umbrella follow-on after shipped `Phase 2`, shipped `Phase 3A`, and shipped `Phase 3B`
- immediate next slice:
  - `Phase 3C - Focused Verification And Failure Matrix Hardening`

#### Locked direction:
- keep one feature-owned `SolidBody` output contract
- keep visible copy count-aware and mode-aware once aggregate execution exists
- close with explicit regression coverage instead of leaving aggregate behavior as an under-tested side effect

### Implementation Spec

Suggested execution order:
1. lock `Phase 3A` result ownership before broader wording changes
2. land `Phase 3B` surface honesty once the result contract is explicit
3. close with `Phase 3C` focused verification and failure-matrix hardening

Definition of done:
- result ownership, visible copy, and verification all agree on the same aggregate closed-profile contract
- `Extrude-4` can hand forward without leaving ambiguous ownership around aggregate selection

## [x] Extrude 4 Phase 2A - Explicit Aggregate Selection Payload Contract

### Summary

#### Purpose:
- replace hidden whole-port inference with one explicit typed contract for closed-profile selection
- keep the authored distinction between:
  - one child `SketchProfile`
  - the parent `SketchProfiles` aggregate
- prepare later compile/runtime widening without overloading the old singular `profileRef`

#### Locked direction:
- do not overload aggregate selection onto the existing singular `profileRef` shape
- add one explicit selection descriptor that can represent:
  - one selected closed profile
  - all closed profiles from one sketch source
- keep the descriptor graph-authored and typed before worker execution widens

#### Shipped result:
- the graph-to-worker extrude contract now accepts one explicit extrude-owned:
  - `profileSelection`
- both current emit paths now populate the singular branch explicitly:
  - `mode: 'single'`
  - `sketchFeatureId`
  - `profileId`
  - `profileIndex`
- the still-live worker/runtime singular path remains intact through the existing:
  - `profileRef`
- focused contract coverage now proves:
  - the payload accepts explicit `single`
  - the payload accepts explicit `allFromSketch`
  - malformed `profileSelection` payloads fail validation

#### Current handoff:
- `Extrude 4 Phase 2B - Compile Graph And Geometry Request Routing`
- keep the new payload boundary explicit and carry authored aggregate-versus-single intent through compile routing next

### Implementation Spec

Current code-backed read:
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - is still the narrowest typed boundary for this lane
  - now exposes:
    - `profileSelection?: GeometryRequestExtrudeProfileSelection | null`
    - `profileRef: GeometryRequestProfileRef | null`
  - is now the durable place where aggregate-versus-single meaning can live before later runtime work widens
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - now emits the explicit `single` `profileSelection` branch for feature-stack extrudes
  - keeps the old `profileRef` in place for current runtime compatibility
- `src/app/spaghetti/compiler/compileGraph.ts`
  - now synthesizes graph-native `Geometry/Extrude` requests with the same explicit `single` `profileSelection` branch
  - is the second emit path that now matches the new request shape
- `src/app/spaghetti/contracts/contractParity.test.ts`
  - is the strongest shared guard that the graph, feature-stack, and request contracts do not silently drift after the new payload is introduced

Locked payload recommendation:
- add one new explicit extrude-owned selection descriptor:
  - `profileSelection`
- make it a typed discriminated union instead of a reused nullable singular ref:
  - single selected closed profile
  - all closed profiles from one sketch source
- keep the single-profile branch structurally close to the current singular contract so migration stays narrow:
  - `mode: 'single'`
  - `sketchFeatureId`
  - `profileId`
  - `profileIndex`
- keep the aggregate branch minimal and authored:
  - `mode: 'allFromSketch'`
  - `sketchFeatureId`
- do not make `Phase 2A` decide worker result shape, body splitting, or stale-profile recovery policy
- do not leave aggregate meaning encoded only in:
  - whole-port wiring shape
  - absent `from.path`
  - compile-side special cases with no request-level type

Likely owner seams:
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- any shared graph-node-to-request typing that still assumes the old singular-only `profileRef`
- focused tests near:
  - `src/app/spaghetti/contracts/contractParity.test.ts`
  - `src/app/spaghetti/features/compileFeatureStack.test.ts`
  - `src/app/spaghetti/compiler/compileGraph.test.ts`

Questions / Decisions:

#### [x] Question 1 - Should aggregate closed-profile selection overload the existing nullable `profileRef` field?

##### Locked answer
- no
- `Phase 2A` should introduce one new explicit selection descriptor instead

##### Why
- `profileRef` already means one selected profile everywhere it exists today
- overloading aggregate intent onto that field would keep the most important contract change implicit

#### [x] Question 2 - Should the new descriptor be extrude-owned at the request boundary instead of inferred from graph edge shape later?

##### Locked answer
- yes
- lock it in the request contract first

##### Why
- the aggregate-versus-single distinction needs to survive beyond selectors and compile helpers
- this keeps graph-authored intent explicit at the worker boundary

#### [x] Question 3 - Should `Phase 2A` also route or execute aggregate selection?

##### Locked answer
- no
- keep `Phase 2A` on the payload contract only
- move deterministic routing to `Phase 2B`
- move worker resolution and failure honesty to `Phase 2C`

##### Why
- the exact request shape should be stable before routing and execution work stack on top of it
- separating these cuts keeps the first implementation slice small enough to verify clearly

#### [x] Question 4 - What is the narrowest first payload shape that still covers the full planned closed-profile distinction?

##### Locked answer
- one discriminated union with:
  - `mode: 'single'`
  - `mode: 'allFromSketch'`

##### Why
- that covers the shipped single-profile path and the planned aggregate-from-parent path without widening into unrelated future selection models
- it stays aligned with the currently locked authored meaning:
  - child `SketchProfile`
  - parent `SketchProfiles`

Suggested execution order:
1. add the new `profileSelection` request types and validators in `geometryRequest.ts`
2. update both emit paths to target the new type shape without widening runtime behavior yet:
   - `compileFeatureStack.ts`
   - `compileGraph.ts`
3. keep the old singular branch behavior intact through the new descriptor
4. add focused contract-parity coverage so later phases can trust the payload boundary

Definition of done:
- the graph-to-worker request contract can describe aggregate closed-profile intent explicitly
- both current emit paths produce the same typed descriptor shape for the singular path
- later phases no longer need to infer aggregate meaning only from whole-port wiring shape
- the singular `SketchProfile` path remains representable without ambiguity
- compile/runtime behavior outside the payload contract remains intentionally unchanged until `Phase 2B`

## [x] Extrude 4 Phase 2B - Compile Graph And Geometry Request Routing

### Summary

#### Purpose:
- carry the now-explicit authored selection contract through graph compilation deterministically
- keep graph ordering and sketch-profile ordering stable when aggregate selection is chosen

#### Shipped result:
- whole-port parent `SketchProfiles -> ExtrusionProfile` wiring now reaches the authored aggregate compile lane instead of failing validation up front
- graph-native `Geometry/Extrude` compilation now distinguishes:
  - parent whole-port aggregate wiring
  - child selected-profile wiring
- aggregate compile requests now emit:
  - `profileSelection.mode = 'allFromSketch'`
  - the owning `sketchFeatureId`
- aggregate compile preserves the upstream sketch-derived `profilesResolved` order exactly
- the legacy `profileRef` seam stays singular and honest:
  - aggregate compile does not fake success by collapsing to the first profile there

#### Current handoff:
- `Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty`
- keep the authored aggregate branch explicit and teach worker execution to resolve or reject it honestly next

#### Locked direction:
- resolve aggregate intent in compile-side code, not in viewer-only or selector-only helpers
- preserve stable profile ordering from sketch-derived profile order rather than introducing compile-time re-sorting
- keep the compile output explicit about whether the extrude is:
  - single-profile
  - aggregate closed-profile

### Implementation Spec

Current code-backed read:
- `src/app/spaghetti/compiler/validateGraph.ts`
  - still rejects whole-port:
    - `SketchProfiles -> ExtrusionProfile`
  - keeps the aggregate lane blocked until compile ownership is widened intentionally
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - now emits explicit `profileSelection`
  - still only ever emits:
    - `mode: 'single'`
  - already has deterministic sketch-derived profile order in `profilesResolved`
- `src/app/spaghetti/compiler/compileGraph.ts`
  - now emits the same explicit `single` branch for graph-native `Geometry/Extrude`
  - still finds only one whole incoming `ExtrusionProfile` edge and treats the source as one selected profile
  - still does not distinguish:
    - parent whole-port aggregate wiring
    - child selected-profile wiring
- `src/app/spaghetti/compiler/evaluateGraph.ts`
  - already resolves:
    - whole-port outputs
    - path-based child outputs
    - `*` path traversal for array-style data
  - is the upstream seam compile code must read honestly instead of inventing a second aggregate inference path
- `src/app/spaghetti/contracts/contractParity.test.ts`
  - is the strongest guard that any new aggregate compile acceptance rule stays aligned between cheap and canonical validation

Locked compile recommendation:
- make compile ownership explicit for the aggregate lane:
  - whole-port parent `SketchProfiles`
    - compile to `profileSelection.mode = 'allFromSketch'`
  - child selected `SketchProfile`
    - keep compiling to `profileSelection.mode = 'single'`
- preserve authored source ownership in the payload:
  - the aggregate branch should name the source sketch only
- do not add compile-side profile re-sorting, filtering, or worker-style fallback selection in this phase
- keep the legacy `profileRef` compatibility seam singular in `2B`
  - aggregate compile support should not fake success by quietly collapsing to the first profile in that field
- treat graph-native and feature-stack compile paths as one contract:
  - both should emit the same authored distinction once widened

Likely owner seams:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/contracts/contractParity.test.ts`

Questions / Decisions:

#### [x] Question 1 - Should `Phase 2B` widen whole-port aggregate wiring acceptance or leave the validator rejecting it?

##### Locked answer
- widen it in this phase
- whole-port parent `SketchProfiles` wiring should become the compile-owned aggregate route

##### Why
- `2A` already shipped the payload needed to express aggregate intent explicitly
- leaving the validator closed would keep the newly explicit aggregate branch unreachable from the authored graph

#### [x] Question 2 - Where should the parent-versus-child distinction be decided once `2B` starts?

##### Locked answer
- in compile ownership
- not in selector copy, not in viewer helpers, and not by worker-only inference later

##### Why
- this keeps graph-authored intent explicit at the request boundary before execution starts
- it prevents runtime-only policy from becoming the hidden source of selection truth

#### [x] Question 3 - What should the compile output do with aggregate selection while the worker still only understands singular runtime behavior?

##### Locked answer
- emit explicit aggregate `profileSelection`
- keep the legacy `profileRef` compatibility seam non-aggregate and honest

##### Why
- `2B` should preserve authored aggregate intent in the request payload
- `2C` is the right place to decide how worker execution resolves or rejects that aggregate branch

#### [x] Question 4 - What ordering rule should `2B` lock for aggregate compile output?

##### Locked answer
- preserve the existing sketch-derived profile order exactly
- do not re-sort by area, profile id, or traversal order invented inside compile

##### Why
- deterministic authored order already exists upstream in sketch derivation
- preserving that order makes later worker resolution and regression coverage much easier to reason about

Suggested execution order:
1. widen validation so whole-port `SketchProfiles -> ExtrusionProfile` can be accepted only as the explicit aggregate lane
2. teach `compileGraph.ts` to distinguish:
   - whole-port parent `SketchProfiles`
   - child selected-profile path wiring
3. emit:
   - `mode: 'allFromSketch'` for whole-port aggregate
   - `mode: 'single'` for child selected profile
4. keep the legacy `profileRef` seam singular and honest for now
5. add focused parity and compile determinism coverage before `2C` widens worker execution

Definition of done:
- compile output preserves the authored aggregate-versus-single distinction explicitly
- repeated identical graphs compile to the same ordered selection payload
- whole-port aggregate selection no longer depends on hidden compile fallback or accidental first-item selection
- whole-port aggregate wiring is reachable from authored graph connections without inventing worker-only selection policy

## [x] Extrude 4 Phase 2C - Worker Selection Resolution And Failure Honesty

### Summary

#### Purpose:
- teach the worker execution path how to resolve the explicit aggregate selection payload honestly
- keep zero-profile, stale-profile, and mixed-invalid cases from silently degrading into fake single-profile success

#### Shipped result:
- worker draft/runtime now resolves explicit `profileSelection` before legacy `profileRef`:
  - `mode: 'single'`
  - `mode: 'allFromSketch'`
- aggregate closed-profile extrudes now execute as one feature-owned draft body result by merging the consumed profile meshes into the existing one-`SolidBody` output lane
- authoritative candidate collection now follows the same authored selection rule and can mint one `shape_set`-backed authoritative result for aggregate closed-profile extrudes without collapsing to a fake singular path
- stale or empty aggregate selections now fail honestly:
  - no accidental `profileRef` fallback
  - no draft body result
  - no authoritative handle
- supported aggregate execution stays intentionally narrow in this shipped slice:
  - closed profiles only
  - current `Body` subset only
  - current taper/offset restrictions only

#### Current handoff:
- `Extrude 4 Phase 3A - SolidBody Result Ownership For Aggregate Consumption`
- keep the now-real aggregate execution path on one explicit feature-owned `SolidBody` result contract next before visible copy cleanup widens

#### Locked direction:
- resolve aggregate profile selection in worker execution layers, not back in node UI code
- make draft/runtime and authoritative/runtime follow the same authored aggregate-versus-single meaning
- fail honestly when aggregate selection resolves to no usable closed profiles
- do not let aggregate requests fall back through legacy singular `profileRef` as if they were ordinary single-profile extrudes
- keep supported worker behavior limited to the same closed-profile subset already allowed by the first authoritative path

### Implementation Spec

Current code-backed read:
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - now exposes the explicit aggregate branch:
    - `profileSelection.mode = 'allFromSketch'`
  - still keeps the legacy singular compatibility seam:
    - `profileRef`
- `src/worker/cad/featureStackRuntime.ts`
  - still executes extrudes only through:
    - `feature.profileRef`
  - currently emits:
    - `missing_profile_ref`
    - `missing_profile`
  - does not yet read `profileSelection`
  - is where draft/runtime aggregate resolution can be added without pushing selection policy back into app code
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - still collects supported authoritative candidates only through singular:
    - `operation.profileRef`
  - currently returns `null` for unsupported or unresolved authoritative subsets
  - is the worker-authoritative seam where aggregate selection must stay explicit and fail honestly if no supported closed profiles remain
- `src/worker/cad/featureStackRuntime.test.ts`
  - already covers ordinary singular extrudes, duplicate IDs, and depth/failure cases
  - is the strongest place to prove aggregate draft/runtime execution and honest aggregate diagnostics
- `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
  - already covers supported singular authoritative success plus malformed-loop and OC-failure honesty
  - is the strongest place to prove aggregate authoritative success, stale aggregate failure, and no-handle-on-empty-aggregate honesty

Locked worker recommendation:
- keep `profileSelection` as the first worker-owned source of truth once present:
  - `mode: 'single'`
    - resolve one sketch-owned profile explicitly
  - `mode: 'allFromSketch'`
    - resolve all closed profiles from the named sketch in existing sketch-derived order
- let the legacy `profileRef` seam continue to support older singular requests only
- do not collapse aggregate requests into:
  - first profile in sketch order
  - first globally available profile
  - whichever singular `profileRef` happened to be present or stale
- keep supported aggregate execution narrow in this phase:
  - closed profiles only
  - current `Body` subset only
  - current taper/offset restrictions only
- if aggregate selection resolves to zero usable profiles:
  - draft/runtime should emit an honest diagnostic
  - authoritative build should return `null` and mint no `shape_set` handle

Likely owner seams:
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`

Questions / Decisions:

#### [x] Question 1 - Once `profileSelection` is present, should worker execution still prefer `profileRef`?

##### Locked answer
- no
- `profileSelection` should become the worker-owned selection source of truth when present

##### Why
- `2A` and `2B` already made authored intent explicit at the request boundary
- continuing to prefer `profileRef` would reintroduce hidden singular fallback and make aggregate requests dishonest

#### [x] Question 2 - What ordering should aggregate worker execution use?

##### Locked answer
- preserve the existing sketch-derived profile order exactly

##### Why
- `2B` already locked compile output to that order
- re-sorting in worker code would create a second hidden owner for profile selection meaning

#### [x] Question 3 - What should happen when `allFromSketch` resolves to no usable supported profiles?

##### Locked answer
- fail honestly
- do not build a body
- do not mint an authoritative handle

##### Why
- an empty aggregate selection is not a successful single-profile extrude
- hidden fallback would make preview and final results drift from authored graph truth

#### [x] Question 4 - Should `2C` widen supported extrude behavior beyond the already-shipped authoritative subset?

##### Locked answer
- no
- keep this pass on explicit aggregate selection resolution and failure honesty only

##### Why
- the ownership gap is worker selection meaning, not broader feature support
- widening walls, taper, or offset behavior here would blur the phase boundary and expand verification unnecessarily

Suggested execution order:
1. add one worker-local selection resolver that can read:
   - explicit `profileSelection`
   - legacy singular `profileRef` only as backward compatibility
2. apply that resolver in `featureStackRuntime.ts` so draft/runtime aggregate extrudes either:
   - execute all supported sketch profiles in order
   - or fail with an honest diagnostic
3. apply the same authored selection rule in `buildAuthoritativeGeometry.ts` so authoritative candidate collection no longer depends only on singular `profileRef`
4. keep aggregate authoritative support on the already-shipped narrow subset and return `null` when no usable aggregate candidates remain
5. add focused runtime and authoritative tests for:
   - aggregate success
   - stale sketch reference
   - empty aggregate resolution
   - no fake first-profile fallback

Definition of done:
- worker execution can consume the explicit aggregate selection payload deterministically
- no-profile and stale-profile aggregate cases fail honestly
- the worker does not silently collapse aggregate intent into an accidental first-profile success path

## [x] Extrude 4 Phase 3A - SolidBody Result Ownership For Aggregate Consumption

### Summary

#### Purpose:
- lock what one `Geometry/Extrude` node publishes when aggregate closed-profile consumption executes successfully
- keep output ownership explicit before visible summary and toolbar cleanup widen

#### Locked direction:
- keep one `Geometry/Extrude` node publishing one `SolidBody` output token
- allow the underlying executed result to represent one or more disconnected closed-profile extrude bodies under that one feature-owned result
- do not widen the graph surface into multiple body outputs in this lane

#### Why:
- this preserves one feature -> one authored result-owner shape
- it keeps aggregate selection from forcing a premature graph-output redesign
- it aligns better with explicit feature ownership than inventing one hidden body-owner per consumed profile

#### Shipped result:
- one aggregate `Geometry/Extrude` feature now keeps publishing one `SolidBody` result token even when the upstream `ExtrusionProfile` input is the parent whole-port `SketchProfiles` aggregate
- draft/runtime aggregate result ownership is now explicit in type space:
  - `kind: 'aggregate_extrusion'`
- retained draft geometry and authoritative geometry both still expose one feature-owned body entry keyed by one `bodyId`
- aggregate closed-profile consumption now has focused ownership proof across:
  - graph evaluation
  - draft/runtime execution
  - retained draft result packaging

#### Current handoff:
- `Extrude 4 Phase 3B - Node Toolbar And Result Copy Honesty`
- keep the one-result contract locked and make the visible node, toolbar, and result wording honest about aggregate execution next

### Implementation Spec

Current code-backed read:
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - still exposes one extrude output only:
    - `SolidBody`
  - is the narrowest graph-surface owner for locking that aggregate execution does not widen into multiple graph outputs
- `src/app/spaghetti/compiler/compileGraph.ts`
  - already compiles aggregate closed-profile selection as one extrude op with:
    - one `featureId`
    - one `bodyId`
    - one downstream `SolidBody` lane
  - is where the one-feature-owned result contract is already implicit and should become explicit
- `src/worker/cad/featureStackRuntime.ts`
  - now resolves aggregate selection and merges all consumed sketch-profile meshes into one `Shape3D` entry keyed by one `bodyKey`
  - currently uses:
    - `kind: 'aggregate_extrusion'`
  - is the draft/runtime seam where one-feature-owned aggregate result identity is already live
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - now resolves aggregate selection to multiple OC prism candidates when needed
  - still registers one authoritative result bundle and one `shape_set` handle for the feature-owned output
  - is the authoritative seam where disconnected underlying bodies already live under one result owner
- `src/worker/cad/cadTypes.ts`
  - currently models draft/runtime result ownership with one `Shape3D` per `bodyKey`
  - is the typed seam where aggregate result kind naming may need to become more intentional if the current merged representation stays

Locked ownership recommendation:
- keep one extrude feature mapped to one authored result owner:
  - one extrude node
  - one compiled extrude op
  - one `bodyId`
  - one `SolidBody` graph output token
- allow the underlying executed geometry to contain:
  - one connected body
  - or multiple disconnected closed-profile extrude islands
- treat aggregate execution as one feature-owned solid result, not as an implicit multi-output feature family
- keep any representation detail local to runtime/authoritative layers:
  - merged preview mesh is acceptable
  - multi-shape authoritative backing is acceptable
  - multiple graph outputs are not

Likely owner seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- focused tests near result ownership and output count behavior

Questions / Decisions:

#### [x] Question 1 - Should one aggregate `Geometry/Extrude` feature widen into multiple `SolidBody` graph outputs?

##### Locked answer
- no
- keep one feature-owned `SolidBody` output

##### Why
- the graph contract is still one extrude feature producing one output token
- widening to multiple outputs here would be a separate graph-surface redesign, not a small ownership clarification

#### [x] Question 2 - Is disconnected underlying geometry acceptable under that one result owner?

##### Locked answer
- yes
- disconnected geometry may live under one feature-owned result

##### Why
- aggregate closed-profile consumption already makes multiple islands possible
- that does not require inventing multiple feature owners when the authored operation is still one extrude

#### [x] Question 3 - Where should the one-result ownership contract be locked first?

##### Locked answer
- in the graph/runtime/result contract seams first
- not only in node copy

##### Why
- `3B` will clean visible wording later
- `3A` should first make the actual output/result ownership explicit in the seams that execute and publish the result

#### [x] Question 4 - Should `3A` change visible node or toolbar wording yet?

##### Locked answer
- no
- keep this phase on result ownership only

##### Why
- copy honesty belongs to `3B`
- mixing ownership and copy cleanup would blur what this phase is proving

Suggested execution order:
1. lock the one-feature-owned result contract explicitly across the current owner seams:
   - node/output registry
   - compile body identity
   - draft/runtime body identity
   - authoritative result bundle identity
2. tighten any type or helper naming that still makes aggregate result ownership look accidental instead of intentional
3. add focused tests proving aggregate execution still yields:
   - one `SolidBody` graph output contract
   - one runtime body entry
   - one authoritative result bundle / handle
4. keep visible copy changes deferred to `3B`

Definition of done:
- aggregate closed-profile execution still yields one feature-owned `SolidBody` result contract
- disconnected underlying geometry does not require multiple graph outputs
- later surface work can describe that result honestly

## [x] Extrude 4 Phase 3B - Node Toolbar And Result Copy Honesty

### Summary

#### Purpose:
- update all visible authored/result copy so aggregate execution reads honestly once it is real
- keep node, toolbar, and result-state wording aligned with the shipped selection contract
- remove the stale singular-only wording left behind from `Phase 1` now that parent `SketchProfiles` execution is live

#### Shipped result:
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - now exposes the aggregate-aware extrude target summary seam:
    - `profileTargetMode`
    - `profileCount`
  - so node surfaces can describe:
    - one selected `SketchProfile`
    - aggregate `SketchProfiles`
    - no profile target yet
- `src/app/spaghetti/canvas/NodeView.tsx`
  - no longer says the parent `SketchProfiles` aggregate output is not executable
  - now distinguishes singular versus aggregate profile targets honestly in:
    - waiting copy
    - resolved target summary
    - placeholder copy
    - row labeling
- `src/app/spaghetti/ui/FeatureStackView.tsx`
  - now uses `Profile Target` wording in the feature-row summary instead of the narrower singular-only `Profile` label
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - now uses `Profile Target` wording in the feature-style extrude summary
- focused tests now prove the new visible contract across selector-owned aggregate target state and both node-surface test suites

#### Current handoff:
- `Extrude 4 Phase 3C - Focused Verification And Failure Matrix Hardening`
- keep the now-honest visible contract and close the lane with focused regression and failure-matrix coverage next

#### Locked direction:
- make the node surface explicitly describe:
  - one selected `SketchProfile`
  - aggregate `SketchProfiles`
- add aggregate-aware wording when parent `SketchProfiles` selection is active
- prefer honest target-summary copy over new feature behavior:
  - singular child profile stays singular
  - parent aggregate selection reads as all closed profiles from the source sketch
- keep feature-toolbar and final-result wording aligned with the same authored truth instead of drifting into separate stories
- keep `SolidBody` ownership singular even when the visible source summary says the feature consumed multiple closed profiles

### Questions / Decisions

#### [x] Question 1 - Should `3B` change execution, selection, or ownership behavior again?

##### Locked answer
- no
- keep `3B` on visible honesty only

##### Why
- `Phase 2A-2C` already locked selection and execution
- `Phase 3A` already locked one-result ownership
- this phase should only make surfaces tell that shipped truth accurately

#### [x] Question 2 - What should the node say when whole-port `SketchProfiles` is wired?

##### Locked answer
- describe the target as an aggregate closed-profile source
- make it clear the extrude is consuming all closed profiles from the upstream sketch

##### Why
- the old `one SketchProfile` wording is now false on the aggregate lane
- users need the node surface to distinguish parent aggregate wiring from one child profile wiring

#### [x] Question 3 - Should aggregate consumption make the visible result/output wording plural?

##### Locked answer
- no
- keep the published result wording on one feature-owned `SolidBody`
- make only the source/target summary aggregate-aware

##### Why
- `Phase 3A` already locked one-result ownership
- changing result labels to plural here would imply a different ownership contract than the shipped runtime/result path

#### [x] Question 4 - Should this phase introduce count-aware copy such as `2 profiles`?

##### Locked answer
- only where the count is already cheaply and honestly available from current selector/runtime state
- do not make this phase depend on new aggregate metadata plumbing

##### Why
- the goal is surface honesty, not a new aggregate-inspection contract
- if a stable count is already available, use it
- otherwise prefer clear aggregate wording like `all closed profiles` over fake precision

### Implementation Spec

Likely owner seams:
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- any final/result selectors that summarize current extrude support

Suggested execution order:
1. add one selector-owned extrude target-summary seam if needed so node/result surfaces do not each invent their own aggregate wording
2. update `NodeView.tsx` waiting, resolved, and placeholder copy so it distinguishes:
   - one selected `SketchProfile`
   - aggregate `SketchProfiles`
3. update `ExtrudeFeatureView.tsx` summary copy so the feature-style panel no longer implies aggregate selection is impossible
4. tighten any final/result-facing wording that still implies the source contract is singular-only
5. add focused surface tests around the visible copy that changed

Definition of done:
- aggregate execution no longer leaves singular-only copy behind in node or toolbar surfaces
- visible profile-target wording matches the real execution contract
- final/result copy does not imply broader support than actually shipped
- `SolidBody` result ownership still reads as singular while the source summary can read as aggregate

## [x] Extrude 4 Phase 3C - Focused Verification And Failure Matrix Hardening

### Summary

#### Purpose:
- close the lane with the focused regression coverage and failure honesty checks needed to keep aggregate consumption stable

#### Shipped result:
- focused regression coverage now closes the remaining aggregate hardening matrix across:
  - compile acceptance
  - repeated mixed-count aggregate compile determinism
  - feature-stack single-selection payload parity
  - draft-runtime aggregate success and honest failure
  - authoritative aggregate success and honest failure
- draft/runtime aggregate execution now fails instead of partially succeeding when the source sketch contains invalid closed-profile payloads
- authoritative aggregate output stays aligned with that unsupported case by returning `null` before OC boot rather than drifting into a broader success story

#### Current handoff:
- this closes `Extrude-4` as a shipped closed-profile selection and consumption lane for the current subset
- later follow-ons should stay outside this doc:
  - open-path or wall behavior
  - broader sketch-side output cleanup from `Sketch - 2`
  - unrelated toolbar or authored-surface growth owned by other `Extrude` lanes

#### Current code-backed read:
- `src/app/spaghetti/compiler/validateGraph.test.ts`
  - proves whole-port `SketchProfiles -> ExtrusionProfile` is accepted as the aggregate compile lane
- `src/app/spaghetti/compiler/compileGraph.test.ts`
  - now proves aggregate compile output preserves sketch-derived profile order, emits explicit `profileSelection.mode = 'allFromSketch'`, and stays deterministic across repeated mixed-count aggregate builds
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
  - now proves the explicit `single` payload branch, the close-profile-fed parity path, and stale feature-stack `profileRef` honesty
- `src/worker/cad/featureStackRuntime.test.ts`
  - now covers:
    - aggregate merged-body success
    - missing aggregate sketch failure
    - empty aggregate sketch failure
    - partially invalid aggregate sketch failure
- `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
  - now covers:
    - aggregate authoritative success
    - stale aggregate failure
    - empty aggregate failure
    - partially invalid aggregate failure aligned with draft runtime

#### Locked direction:
- prove deterministic ordering for:
  - repeated aggregate builds
  - mixed sketch profile counts
- prove honest failure for:
  - empty aggregate output
  - stale sketch/profile references
  - partially invalid aggregate selections
- verify draft and authoritative paths stay aligned about supported versus unsupported aggregate cases
- prefer focused additions to the existing aggregate test homes over inventing new broad integration surfaces

### Questions / Decisions

#### [x] Question 1 - Should `3C` reopen visible copy or runtime semantics?

##### Locked answer
- no
- keep `3C` on verification and failure-matrix hardening only

##### Why
- `Phase 3B` already closed visible honesty
- `Phase 2B`, `Phase 2C`, and `Phase 3A` already locked compile/runtime semantics and one-result ownership
- this phase should prove the shipped contract rather than redefining it

#### [x] Question 2 - What counts as the main remaining hardening gap?

##### Locked answer
- not “more tests in general”
- specifically:
  - deterministic aggregate ordering proof where it is still thin
  - draft/runtime versus authoritative/runtime failure-honesty alignment
  - any missing aggregate payload parity checks left outside the current focused test homes

##### Why
- the aggregate lane already has meaningful coverage
- the remaining risk is inconsistency across seams, not total absence of tests

#### [x] Question 3 - Should this phase widen the supported aggregate subset?

##### Locked answer
- no
- keep the hardening matrix scoped to the already-shipped closed-profile `Body` lane

##### Why
- widening support would turn this phase back into feature work
- the goal is to close verification debt on the existing shipped contract first

### Implementation Spec

Likely owner seams:
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/features/compileFeatureStack.test.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`

Suggested execution order:
1. audit the current aggregate matrix across compile, draft/runtime, and authoritative/runtime tests
2. add any missing aggregate compile assertions where deterministic order or explicit aggregate payload parity is still under-specified
3. add any missing draft-runtime failure cases so aggregate empty/stale/partially invalid selection stays honest without fallback
4. add matching authoritative failure cases or support-alignment checks where draft and authoritative behavior could still drift
5. close with one small doc/changelog pass that explicitly says the aggregate lane is now hardened rather than just feature-complete

Definition of done:
- aggregate closed-profile extrude support is covered by focused regression tests
- failure cases stay honest instead of degrading silently
- the lane can hand forward without leaving an unverified aggregate-selection debt pocket
- draft/runtime and authoritative/runtime now read as intentionally aligned about the shipped aggregate subset rather than coincidentally similar

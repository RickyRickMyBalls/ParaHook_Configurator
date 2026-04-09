# `Extrude-3` - `Type Modes And Functional Completion`

## Doc Header

### Doc History
8. 2026-04-06 10:05: Cleaned this broader `Extrude-3` umbrella doc into a parent roadmap after the dedicated `Extrude-3.2` and `Extrude-3.3` ladders shipped, removing stale pseudo-open implementation language, normalizing the naming to the now-shipped `Body / Walls` and `Direction / Symmetric` truth, and leaving only the still-open `3.4` and `3.5` follow-ons as real future work here
7. 2026-04-06 08:17: Carved `Extrude-3.3 - Direction Modes And Depth Row Contract` out into its own dedicated future doc so the post-`Extrude-3.2` direction selector and depth-row branching lane now has a real execution home instead of living only as one section inside this broader `Extrude-3` umbrella ladder
6. 2026-04-05 11:19: Carved `Extrude-3.2 - Real Type Modes Contract` out into its own dedicated future doc so the first post-`Extrude-3.1` authored-semantics lock now has a real implementation home instead of living only as one section inside this broader `Extrude-3` umbrella ladder
5. 2026-04-05 11:15: Reformatted `Extrude-3 - Type Modes And Functional Completion` into a real multi-phase ladder so the next authored extrude work now reads as explicit `Extrude 3 Phase N` slices, with the completed `Extrude-3.1` enum-row groundwork recognized as the finished first phase and the remaining semantics, extent, taper, and runtime-convergence work broken into separately scannable follow-ons
4. 2026-04-05 09:41: Carved task `1` out into the dedicated future phase `Extrude-3.1 - Enum Input Row And Type Selector`, locking that the first explicit `Extrude Type` control should land as the first reusable primitive `enum input row` template and reserving `Extrude-3.1-1` / `Extrude-3.1-2` if that lane later needs its own subphases
3. 2026-04-05 09:28: Tightened the `Extrude-3` node-shell direction by locking that the authored `Type`, extent-mode, depth, and taper controls should all live under `Inputs`, the old `Details` section should be deleted, and the extrude node should settle into an `Inputs` plus `Outputs` shell only
2. 2026-04-05 09:26: Expanded the `Extrude-3` task stack after the next authored feature requests by locking the follow-on extent-mode selector to `One Side`, `Two Sides`, and `Symmetrical`, adding `Taper Angle` as the next explicit task, and recording that choosing `Two Sides` should replace the single `Depth` row with `Start Depth` plus `End Depth`
1. 2026-04-05 09:22: Created this dedicated `Extrude-3` future doc as the first explicit task stack for getting `Extrude` to feel functionally complete beyond the landed placement repair and the still-open toolbar polish lane, locking task `1` to a real `Type` `ParaSelector` with `Body` and `Profile` options while staging the downstream contract, runtime, and surface work that choice implies

## Doc Body

### Summary

`Extrude-3` is now the umbrella authored-semantics roadmap for the broader `Extrude` family, not the detailed implementation home for every subphase.

Current read:
- the enum-row groundwork is done through the finished `Extrude-3.1` ladder
- the real type-semantics lane is done through the finished `Extrude-3.2` ladder
- the graph-native node-side direction/depth lane is done through the finished `Extrude-3.3` ladder
- the node shell direction is locked:
  - `Inputs`
  - `Outputs`
  - no new `Details` bucket
- the remaining open authored follow-ons under this umbrella are:
  - `Taper Angle`
  - later type-aware surface honesty
  - broader compile/runtime/preview/result convergence beyond the now-shipped graph-native baseline

Locked recommendation:
- keep this file as the parent roadmap only
- do not reuse this file as the detailed implementation source for shipped `3.2` or shipped `3.3`
- use the dedicated child docs for the durable detailed history of:
  - `Extrude-3.1`
  - `Extrude-3.2`
  - `Extrude-3.3`
- keep all authored extrude controls under `Inputs`
- do not regrow a `Details` section just because the semantics become richer

### Current Code-Backed Read

The strongest owner seams for the remaining `Extrude-3` umbrella are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - already owns the live authored row surface
  - is still the proving surface for later mode-aware visibility and copy honesty
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries local/effective authored state
  - is still the main seam for later mode-aware node truth
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - already owns the graph-native extrude param and input contract
  - is still the narrowest place to evolve authored controls honestly
- `src/app/spaghetti/features/featureTypes.ts`
  - is where later feature-stack parity and richer authored contracts still need to become explicit
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - is where later feature-stack convergence work still has to survive compilation
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - are still the likely follow-on authored surfaces that need to stop drifting from the node surface

### Phase Breakdown

1. `Extrude 3 Phase 1 - Enum Row Foundation And Type Selector`
Reason:
- the repo first needed a reusable enum-row template plus a real `Extrude Type` row before the authored type semantics could be made honest
Current status:
- shipped in the dedicated `Extrude-3.1` ladder

2. `Extrude 3 Phase 2 - Real Type Modes Contract`
Reason:
- once the selector row existed, the next honest step was deciding what the type choices actually meant instead of leaving them as label-only modes
Dedicated future doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.2 - Real Type Modes Contract.md`
Current status:
- shipped in the dedicated `Extrude-3.2` ladder

3. `Extrude 3 Phase 3 - Direction Modes And Depth Row Contract`
Reason:
- once type semantics were locked, the next major authored lever was direction/depth behavior, which forced the `Depth` row split into `Start Depth` / `End Depth`
Dedicated future doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.3 - Direction Modes And Depth Row Contract.md`
Current status:
- shipped for the graph-native node-side path in the dedicated `Extrude-3.3` ladder

4. `Extrude 3 Phase 4 - Taper Angle And Type-Aware Surface Honesty`
Reason:
- after type and direction are explicit, the next debt is surfacing `Taper Angle` honestly and making visibility/editability follow the selected authored mode
Dedicated future doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty.md`
Current status:
- still open here

5. `Extrude 3 Phase 5 - Compile Runtime Preview And Result Convergence`
Reason:
- once the authored surface is honest, the remaining work is pushing that same meaning through compile/runtime/preview/output ownership so the feature stops pretending one fixed contract underneath richer UI
Current status:
- still open here

## [x] Extrude 3.1 - Enum Row Foundation And Type Selector

### Summary

#### Purpose:
- record that the row-template groundwork moved into its own dedicated ladder and is now shipped

#### Current read:
- this work was split into the dedicated `Extrude-3.1` ladder because it needed its own row-template subphases
- that ladder is now complete and should be treated as closed groundwork here

### Implementation Spec

Shipped implementation home:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.1 - Enum Input Row And Type Selector.md`

Definition of done:
- `Extrude-3.1` is complete
- later `Extrude-3` work can assume the row template exists and is no longer the blocker

## [x] Extrude 3.2 - Real Type Modes Contract

### Summary

#### Purpose:
- record that the authored type-semantics lane moved into its own dedicated ladder and is now shipped

#### Current read:
- this umbrella doc is no longer the implementation source of truth for type semantics
- the dedicated `Extrude-3.2` ladder shipped the real authored type contract:
  - `Body`
  - `Walls`
- the old `Basic / Twist` wording in this umbrella file is historical and should not be used going forward

### Implementation Spec

Shipped implementation home:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.2 - Real Type Modes Contract.md`

Definition of done:
- `Extrude-3.2` is complete
- this umbrella doc no longer pretends the type lane is still open here

## [x] Extrude 3.3 - Direction Modes And Depth Row Contract

### Summary

#### Purpose:
- record that the authored direction/depth lane moved into its own dedicated ladder and is now shipped for the graph-native node-side path

#### Current read:
- this umbrella doc is no longer the implementation source of truth for direction/depth behavior
- the dedicated `Extrude-3.3` ladder shipped the graph-native node-side contract:
  - `Direction`
    - `One Side`
    - `Two Sides`
    - `Symmetric`
  - honest `Depth` versus `Start Depth / End Depth` row branching
  - shipped graph-native runtime meaning for those modes
- any later older feature-stack extrude direction parity work is still future work outside this closed `Extrude-3.3` cut

### Implementation Spec

Shipped implementation home:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.3 - Direction Modes And Depth Row Contract.md`

Definition of done:
- `Extrude-3.3` is complete for the graph-native node-side path
- this umbrella doc no longer pretends the direction/depth lane is still open here

## [ ] Extrude 3.4 - Taper Angle And Type-Aware Surface Honesty

### Summary

#### Purpose:
- make `Taper Angle` a real authored control instead of another visible debt
- make the authored surfaces respond honestly to the selected authored mode

#### Current read:
- taper is part of user expectation around extrude
- it should not appear as a no-op or always-on control if it only applies in specific authored cases
- this is now the first still-open authored follow-on after the shipped `3.2` and `3.3` ladders
- this umbrella doc is no longer the detailed implementation home for the taper lane

#### Locked direction:
- add `Taper Angle`
- make its visibility/editability depend on the selected authored mode honestly
- keep the authored controls under `Inputs`

### Questions / Decisions

#### [x] Question 1 - What is the next scalar control after the shipped type and direction lanes?

##### Locked answer
- `Taper Angle`

#### [ ] Question 2 - Which type/direction combinations should actually surface it?

##### Must lock
- visibility
- editability
- fallback/disabled behavior

### Implementation Spec

Dedicated future doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Extrude/Future/Extrude_Phase Extrude-3.4 - Taper Angle And Type-Aware Surface Honesty.md`

Definition of done:
- `Taper Angle` is either implemented honestly or not shown as active authored behavior
- the visible control set now depends on the selected authored mode instead of staying fixed

## [ ] Extrude 3.5 - Compile Runtime Preview And Result Convergence

### Summary

#### Purpose:
- carry the authored type/direction/taper meaning all the way through compile, runtime, preview, and result ownership

#### Current read:
- even once the node surface is honest, the feature is still incomplete if runtime silently behaves as a thinner contract underneath richer UI
- this is also the likely umbrella home for later older feature-stack extrude convergence work that still sits outside the closed graph-native `Extrude-3.3` cut

#### Locked direction:
- thread the selected authored meaning through:
  - registry/view-model reads
  - feature-stack types
  - compile output
  - worker/runtime behavior
  - preview/output shaping
- keep the landed sketch-plane transform contract intact

### Questions / Decisions

#### [ ] Question 1 - How should each authored mode be represented through compile/runtime?

##### Must lock
- compile payload shape
- runtime branch ownership
- preview shaping

#### [ ] Question 2 - How should result ownership and downstream compatibility be named?

##### Must lock
- output identity
- browser/workspace labeling
- downstream compatibility expectations

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/worker/cad/featureStackRuntime.ts`
- viewer/output ownership seams as needed

Definition of done:
- authored extrude meaning survives compile/runtime/preview/output honestly
- the remaining graph-node versus feature-stack drift is explicitly reduced instead of hidden behind richer UI wording

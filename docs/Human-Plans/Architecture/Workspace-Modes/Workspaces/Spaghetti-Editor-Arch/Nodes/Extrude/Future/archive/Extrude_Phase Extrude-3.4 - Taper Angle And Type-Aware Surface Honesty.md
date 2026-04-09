# `Extrude-3.4` - `Taper Angle And Type-Aware Surface Honesty`

## Doc Header

### Doc History
5. 2026-04-06 10:49: Marked `Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` shipped after the graph-native `Geometry/Extrude` selector and `NodeView` began hiding `Taper Angle` outside the first honest `Body + OneSide` support set while preserving authored `taperAngleDeg` state non-destructively, then refreshed this doc so `Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup` is now the next honest follow-on
4. 2026-04-06 10:42: Tightened `Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` into an implementation-ready next slice by locking the first honest supported set to `Body + OneSide`, choosing hidden-over-disabled behavior for unsupported combinations, grounding the work in the selector plus `NodeView` visibility seam only, and preserving authored taper state non-destructively while the row is hidden
3. 2026-04-06 10:38: Marked `Extrude 3.4 Phase 1 - Taper Angle Names And Authored State Contract` shipped after the graph-native `Geometry/Extrude` node gained a real `Taper Angle` row, authored `taperAngleDeg` state, selector-owned taper ownership fields, and live node rendering/tests, then refreshed this doc so `Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules` is now the next honest follow-on
2. 2026-04-06 10:15: Tightened `Extrude 3.4 Phase 1 - Taper Angle Names And Authored State Contract` into an implementation-ready next slice by grounding it in the current graph-native `Geometry/Extrude` seams, locking the first row id and authored param direction, the visible row order, and the explicit non-goals around taper runtime meaning and later visibility rules
1. 2026-04-06 10:10: Added this dedicated future phase doc by carving the post-`Extrude-3.3` taper and mode-aware surface lane out of the broader `Extrude-3` umbrella, splitting it into smaller `Extrude 3.4 Phase 1` through `Phase 3` slices, and tightening `Phase 1 - Taper Angle Names And Authored State Contract` into an implementation-ready first cut

### Purpose

Use this doc as the dedicated planning and execution surface for the next authored extrude follow-on after the finished graph-native `Extrude-3.3` direction/depth contract.

The goal here is:
- add a real `Taper Angle` row under `Inputs`
- decide when that row is visible and editable honestly
- stop the surface from implying taper exists everywhere if runtime still only supports a narrower mode set
- keep the node-side authored truth aligned with the now-shipped `Body / Walls` and `Direction` contract

### Scope

This phase covers:
- the authored `Taper Angle` control for `Geometry/Extrude`
- the row order and visibility implications for taper
- the first honest type-aware and direction-aware taper surface rules
- the next graph-native seams needed before wider runtime parity is attempted

This phase does not cover:
- the reusable enum-row template itself
- the already-shipped `Body / Walls` contract
- the already-shipped `Direction / Depth` contract
- `Wall Thickness` implementation
- `Operation` implementation
- full older feature-stack extrude parity

## Doc Body

### Summary

`Extrude-3.4` is the next authored-truth phase after the finished graph-native `Extrude-3.3` direction/depth lane.

Current read:
- `Type` is now honest enough:
  - `Body`
  - `Walls`
- `Direction` is now honest enough:
  - `One Side`
  - `Two Sides`
  - `Symmetric`
- the next authored missing truth is:
  - when taper exists at all
  - when taper should be hidden
  - when visible taper wording must stay aligned with real supported meaning

Locked recommendation:
- add `Taper Angle` as the next scalar input row under `Inputs`
- keep it below the current depth row set
- lock its first pass to graph-native `Geometry/Extrude` only
- stage wider feature-stack parity for later instead of hiding that scope inside this doc

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - already owns the live `SketchProfile -> Type -> Direction -> depth rows` surface
  - is where taper visibility and wording must become honest next
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries local/effective authored state
  - is the main seam for taper visibility and driven ownership truth
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - already owns the graph-native extrude param and input contract
  - is the narrowest place to add authored taper state
- `src/app/spaghetti/compiler/compileGraph.ts`
  - already emits graph-native extrude runtime payloads
  - is the seam where taper meaning must later survive compilation honestly
- `src/worker/cad/featureStackRuntime.ts`
  - is where later graph-native taper meaning would have to become real if the first surface contract proves stable
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - is the likely later authored surface that must not drift from the node-side taper story

### Phase Breakdown

1. `Extrude 3.4 Phase 1 - Taper Angle Names And Authored State Contract`
Reason:
- the safest first cut is to add the real taper row, lock its authored state, and make the node speak taper honestly before trying to widen runtime meaning

2. `Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules`
Reason:
- once taper exists as authored state, the next missing truth is which `Type` and `Direction` combinations should actually surface it

3. `Extrude 3.4 Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup`
Reason:
- after the authored row contract is explicit, the remaining work is making graph-native compile/runtime meaning plus visible copy honest without widening into the older feature-stack extrude surface yet

## [x] Extrude 3.4 Phase 1 - Taper Angle Names And Authored State Contract

### Summary

#### Purpose:
- add the next authored scalar control row for extrude taper
- lock the taper row name, units, and authored-state contract
- prepare later visibility and runtime work without trying to do everything at once

#### Shipped result:
- the live `Geometry/Extrude` node now has:
  - `SketchProfile`
  - `Type`
  - `Direction`
  - depth rows
  - `Taper Angle`
- the graph-native authored taper contract now exists as:
  - input port id:
    - `TaperAngle`
  - authored param:
    - `taperAngleDeg`
  - selector-owned state:
    - `localTaperAngleDeg`
    - `effectiveTaperAngleDeg`
    - `taperDriven`
- the first row stays always visible for now while later visibility truth is still deferred to `Phase 2`
- compile/runtime taper meaning is still intentionally deferred

#### Locked direction:
- keep the work inside one `Extrude` node
- add `Taper Angle` as a real scalar row under `Inputs`
- place it after the current depth row set
- use degrees as the authored unit
- keep the first slice limited to authored state and row presence

### Questions / Decisions

#### [x] Question 1 - What should the authored taper row be called?

##### Locked answer
- `Taper Angle`

##### Why
- this matches the expected CAD wording closely enough for the first ParaHook cut
- it is explicit about the value being angular, not a generic taper amount

#### [x] Question 2 - Where should the new `Taper Angle` row live?

##### Locked answer
- under `Inputs`
- after the current depth row set

##### Why
- `Extrude-3` already locked the shell direction to `Inputs` plus `Outputs`
- taper is authored input truth, not a `Details`-only helper

#### [x] Question 3 - What should this first slice actually promise?

##### Locked answer
- only the authored row and state contract

##### Why
- surface truth has to exist before later visibility and runtime work can be judged honestly

#### [x] Question 4 - What should the first authored row id and param direction be?

##### Locked answer
- row label:
  - `Taper Angle`
- graph-native input port id:
  - `TaperAngle`
- authored param:
  - `taperAngleDeg`

##### Why
- this keeps the row label readable
- it keeps the port id stable and explicit beside the existing `Direction`, `Depth`, `StartDepth`, and `EndDepth` ids
- it keeps the authored param self-describing about units instead of overloading a generic `taper`

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/registry/extrudeParams.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- focused tests for registry, selector, and `NodeView`

Locked first-cut direction:
1. add authored taper state to `Geometry/Extrude` params:
   - `taperAngleDeg`
2. extend the live `Geometry/Extrude` input contract so the node can speak the real taper row id:
   - `TaperAngle`
3. expose `Taper Angle` as the next real scalar row under `Inputs`
3. place the row order as:
   - `SketchProfile`
   - `Type`
   - `Direction`
   - depth rows
   - `Taper Angle`
4. carry local and effective taper state through the selector VM using the same unwired-versus-driven ownership rule already proven by:
   - `Depth`
   - `Type`
   - `Direction`
5. use degrees as the first authored unit and keep the first row always visible while taper visibility rules are still deferred to `Phase 2`
6. keep later visibility and runtime meaning deferred:
   - do not widen compile/runtime taper semantics yet
   - do not claim every type/direction combination already owns honest taper behavior underneath

Scope honored:
- keep this slice limited to the taper row and authored-state contract
- do not widen into runtime taper meaning yet
- do not make this first slice argue about which type/direction combinations should hide or disable taper
- do not fold `Wall Thickness` or `Operation` into this phase
- do not turn this phase into a broader feature-surface redesign

Verification matrix:
- `Geometry/Extrude` now owns a real `TaperAngle` input row under `Inputs`
- the visible row order stays:
  - `SketchProfile`
  - `Type`
  - `Direction`
  - depth rows
  - `Taper Angle`
- unwired taper uses the authored `taperAngleDeg` value as local state
- driven taper follows the same local-versus-effective ownership rule already used by:
  - `Type`
  - `Direction`
  - depth rows
- no compile/runtime behavior change is implied yet by the presence of the row

Definition of done:
- `Taper Angle` exists as a real input row under `Inputs`
- the authored taper value is explicit and stable
- the node and selector VM can now speak taper honestly
- `Phase 2` can focus only on visibility/editability truth instead of still arguing about row naming or placement

Status:
- shipped on `2026-04-06`
- verification completed with:
  - `npm.cmd exec vitest run src/app/spaghetti/registry/extrudeParams.test.ts src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx`
  - `./node_modules/.bin/tsc.cmd -b --pretty false`

## [x] Extrude 3.4 Phase 2 - Type-Aware And Direction-Aware Taper Visibility Rules

### Summary

#### Purpose:
- make the visible taper-row story match the currently supported authored modes honestly

#### Shipped result:
- the graph-native `Geometry/Extrude` selector VM now carries explicit taper visibility truth as:
  - `taperVisible`
- the live node now shows `Taper Angle` only for:
  - `Type = Body`
  - `Direction = OneSide`
- the live node now hides `Taper Angle` for:
  - `Walls + OneSide`
  - `Body + TwoSides`
  - `Body + Symmetric`
  - all `Walls` direction combinations
- switching away from the supported set does not clear authored `taperAngleDeg`
- switching back to `Body + OneSide` restores the previously authored taper value
- compile/runtime taper meaning is still intentionally deferred to `Phase 3`

### Questions / Decisions

#### [x] Question 1 - Which `Type` modes should surface taper first?

##### Locked answer
- `Body` only

##### Why
- this is the narrowest honest first owner
- it avoids implying that `Walls` already owns the same taper story before wall-thickness and later surface work are settled
- it gives `Phase 3` one smaller graph-native runtime target instead of forcing multiple type contracts at once

#### [x] Question 2 - Which `Direction` modes should surface taper first?

##### Locked answer
- `One Side` only

##### Why
- this keeps the first visible taper owner aligned with the simplest existing depth/result story
- it avoids pretending `Two Sides` and `Symmetric` already have a coherent taper contract before runtime meaning is locked
- it keeps the first support set small enough that visibility truth can land without hidden semantic drift underneath

#### [x] Question 3 - What is the honest hidden-versus-disabled behavior?

##### Locked answer
- hide unsupported taper rows completely

##### Why
- this is the most honest first surface while taper support is still intentionally partial
- it avoids training users that the visible row should work everywhere even though later phases still need to widen meaning
- it keeps the node surface cleaner than a disabled explanation row for every unsupported combination

### Implementation Spec

Likely files:
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- focused tests for selector and `NodeView`

Locked direction:
1. lock the first supported authored taper set to:
   - `Type = Body`
   - `Direction = OneSide`
2. add selector-owned visibility truth for the taper row:
   - visible for `Body + OneSide`
   - hidden for:
     - `Walls + OneSide`
     - `Body + TwoSides`
     - `Body + Symmetric`
     - all `Walls` direction combinations
3. keep the authored `taperAngleDeg` param non-destructive when the row is hidden:
   - switching away from `Body + OneSide` must not clear authored taper state
   - switching back to `Body + OneSide` must restore the previously authored taper value
4. keep the row ordering unchanged when visible:
   - `SketchProfile`
   - `Type`
   - `Direction`
   - depth rows
   - `Taper Angle`
5. keep runtime meaning deferred:
   - no compile changes
   - no worker/runtime changes
   - no visible wording that implies taper geometry already exists underneath

Scope honored:
- keep this slice limited to visibility/editability truth
- do not widen into graph-native taper runtime meaning yet
- do not widen the first support set beyond `Body + OneSide`
- do not add disabled explanation copy for unsupported combinations in this first cleanup
- do not fold `Wall Thickness` or `Operation` into this phase

Verification matrix:
- `Taper Angle` is visible when:
  - `Type = Body`
  - `Direction = OneSide`
- `Taper Angle` is hidden when:
  - `Type = Walls`
  - `Direction = TwoSides`
  - `Direction = Symmetric`
- hiding the row does not clear the authored `taperAngleDeg` param
- returning to `Body + OneSide` restores the previously authored taper value
- no compile/runtime behavior change is implied yet by the visibility cleanup

Definition of done:
- the visible taper row no longer implies support everywhere
- type-aware and direction-aware visibility is explicit
- the first supported set is concretely locked to `Body + OneSide`
- `Phase 3` can focus on graph-native runtime meaning and wording cleanup

Status:
- shipped on `2026-04-06`
- verification completed with:
  - `npm.cmd exec vitest run src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `./node_modules/.bin/tsc.cmd -b --pretty false`

## [ ] Extrude 3.4 Phase 3 - Graph-Native Taper Runtime Meaning And Surface Honesty Cleanup

### Summary

#### Purpose:
- make the graph-native `Geometry/Extrude` build/result path obey the authored taper contract for the supported mode set
- clean up the remaining node-surface wording so it matches that runtime truth

#### Current read:
- after `Phase 1` and `Phase 2`, the live taper row can become honest as authored state and visible surface truth
- the remaining missing truth is whether graph-native compile/runtime meaning and visible copy still drift from that authored taper story underneath

### Questions / Decisions

#### [ ] Question 1 - What is the first graph-native runtime owner for taper?

##### Suggested answer
- the graph-native `Geometry/Extrude` node path first:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
  - `src/worker/cad/featureStackRuntime.ts`
  - `src/app/spaghetti/canvas/NodeView.tsx`

#### [ ] Question 2 - What supported mode set should actually gain taper meaning in this first runtime cut?

##### Must lock
- exact `Type` and `Direction` combinations

#### [ ] Question 3 - What visible wording must become honest in the same slice?

##### Must lock
- waiting copy
- output/result copy
- any disabled/hidden taper explanation that survives from `Phase 2`

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- focused tests for compiler, runtime, and `NodeView`

Locked direction:
1. carry authored taper state through graph-native compile output
2. teach the graph-native runtime the first honest taper meaning for the supported mode set
3. keep the worker/runtime contract backward-compatible where possible
4. update visible node wording so supported versus unsupported taper behavior is honest
5. keep older feature-stack extrude taper parity explicitly out of scope unless this phase is later widened on purpose

Definition of done:
- taper is no longer UI-only state for the supported graph-native extrude modes
- the live node wording no longer drifts from that runtime truth
- any remaining older feature-stack taper parity work is clearly left for a later dedicated phase instead of hidden inside `Extrude-3.4`

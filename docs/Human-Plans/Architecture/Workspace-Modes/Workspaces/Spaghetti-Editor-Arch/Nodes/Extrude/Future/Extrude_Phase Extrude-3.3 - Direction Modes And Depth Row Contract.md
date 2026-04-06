# `Extrude-3.3` - `Direction Modes And Depth Row Contract`

## Doc Header

### Doc History
6. 2026-04-06 09:53: Corrected the shipped `Symmetric` runtime read so the single `Depth` row now means total centered span rather than per-side mirrored magnitude, which means a value like `20` resolves to `10` on each side instead of `20` on each side
5. 2026-04-06 09:50: Marked `Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` shipped after the graph-native `Geometry/Extrude` path began carrying authored `OneSide / TwoSides / Symmetric` meaning through node publish truth, compile IR, worker runtime execution, and live waiting-copy wording, while explicitly leaving older feature-stack extrude direction parity for a later follow-on
4. 2026-04-06 09:31: Tightened `Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` into an implementation-ready next slice by grounding it in the current one-sided-only `Geometry/Extrude` compile/runtime seams, locking the first direction meanings for `OneSide / TwoSides / Symmetric`, and explicitly scoping the first cut to the graph-native node path plus visible node-summary honesty instead of widening into the older feature-stack extrude surface
3. 2026-04-06 08:58: Marked `Extrude 3.3 Phase 2 - Depth Row Surface Split And Visibility Rules` shipped after the live `Geometry/Extrude` node gained real `StartDepth / EndDepth` row ids, direction-aware depth-row visibility, and non-destructive `depthMm -> startDepthMm / endDepthMm` local fallback behavior, then refreshed the remaining read so `Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup` is now the next honest follow-on
2. 2026-04-06 08:46: Marked `Extrude 3.3 Phase 1 - Direction Names And Authored State Contract` shipped after the live node gained the real authored `Direction` row and local/effective direction state, then tightened `Phase 2 - Depth Row Surface Split And Visibility Rules` into an implementation-ready next slice by locking the row set, visible order, authored depth params, and first non-destructive direction-switch behavior
1. 2026-04-06 08:17: Added this dedicated future phase doc by carving the post-`Extrude-3.2` direction/depth lane out of the broader `Extrude-3` umbrella, splitting the work into smaller `Extrude 3.3 Phase 1` through `Phase 3` slices, and tightening `Phase 1 - Direction Names And Authored State Contract` into an implementation-ready first cut

### Purpose

Use this doc as the dedicated planning and execution surface for the next authored extrude follow-on after the finished `Extrude-3.2` `Body / Walls` contract.

The goal here is:
- add a real `Direction` row under `Inputs`
- lock the authored direction choices
- define how those choices change the visible depth-row stack
- stop the current one-row `Depth` story from pretending it is honest for every direction mode
- stage the later runtime and surface-cleanup work behind one explicit direction contract

### Scope

This phase covers:
- the authored direction choices for `Geometry/Extrude`
- the row order and row visibility implications for:
  - `One Side`
  - `Two Sides`
  - `Symmetric`
- the first honest contract for:
  - `Depth`
  - `Start Depth`
  - `End Depth`
- the next selector/state seams needed before runtime behavior is widened

This phase does not cover:
- the reusable enum-row template itself
- the already-shipped `Body / Walls` contract
- final runtime implementation for every direction mode
- `Taper Angle` implementation
- `Wall Thickness` implementation
- `Operation` implementation

## Doc Body

### Summary

`Extrude-3.3` is the next authored-truth phase after the finished `Extrude-3.2` `Body / Walls` split.

Current read:
- `Type` is now honest enough:
  - `Body`
  - `Walls`
- the enum-row groundwork is now stable enough to reuse for another authored selector
- the current `Depth` row is only fully honest for the one-sided case
- the next authored missing truth is:
  - how the extrude extends from the source profile
  - when one depth row is enough
  - when the row set must split

Locked recommendation:
- add `Direction` as the next enum input row under `Inputs`
- first options:
  - `One Side`
  - `Two Sides`
  - `Symmetric`
- keep the row stack in this order:
  - `SketchProfile`
  - `Type`
  - `Direction`
  - depth rows
- treat `Two Sides` as the first explicit row-splitting case:
  - `Start Depth`
  - `End Depth`
- keep the honest `Symmetric` row story explicit instead of hand-waving it

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - already owns the live `SketchProfile -> Type -> Depth` authored row surface
  - is where the next `Direction` row and later depth-row branching must become honest
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries the local/effective state that can be extended to direction-aware truth
  - is the main seam for deciding which depth rows should be visible
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - already owns the current extrude param and input contract
  - is the narrowest place to add authored direction state and later depth split params
- `src/app/spaghetti/features/featureTypes.ts`
  - is where the later direction-aware feature contract should become explicit
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - is the likely follow-on authored surface that must stop drifting from the node surface once direction is real

### Phase Breakdown

1. `Extrude 3.3 Phase 1 - Direction Names And Authored State Contract`
Reason:
- the safest first cut is to add the real direction selector, lock its values, and make the node state contract honest before any row-splitting or runtime work lands

2. `Extrude 3.3 Phase 2 - Depth Row Surface Split And Visibility Rules`
Reason:
- once direction is explicit, the next missing truth is when one depth row is valid and when the node must switch to `Start Depth` plus `End Depth`

3. `Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup`
Reason:
- after the authored row contract is explicit, the compiler/runtime and remaining surface copy need one cleanup pass so the feature stops pretending every direction still means the old one-sided depth story underneath

## [x] Extrude 3.3 Phase 1 - Direction Names And Authored State Contract

### Summary

#### Purpose:
- add the next authored selector row for extrude extent direction
- lock the direction choices in node state and selector state
- define the first honest authored meaning of those choices at the state-contract layer
- prepare later depth-row splitting and runtime work without trying to do everything at once

#### Current read:
- the live `Geometry/Extrude` node now has:
  - `SketchProfile`
  - `Type`
  - `Direction`
  - `Depth`
- the next authored selector requested by the product direction is:
  - shipped
- the current single `Depth` row should stay as the first visible row story only until direction-aware branching is added in `Phase 2`

#### Locked direction:
- keep the work inside one `Extrude` node
- add `Direction` as a real enum row under `Inputs`
- place it between:
  - `Type`
  - depth rows
- lock the authored direction options as:
  - `One Side`
  - `Two Sides`
  - `Symmetric`
- keep `Depth` as the first default visible depth row while the later split remains staged for `Phase 2`

### Questions / Decisions

#### [x] Question 1 - What are the authored direction choices and selector order?

##### Locked answer
- `One Side`
- `Two Sides`
- `Symmetric`

##### Why
- this matches the intended Fusion-style authored flow closely enough for the first ParaHook cut
- it gives the row stack a stable order before we split depth behavior

#### [x] Question 2 - Where should the new `Direction` row live?

##### Locked answer
- under `Inputs`
- between `Type` and the depth rows

##### Why
- `Extrude-3` already locked the shell direction to `Inputs` plus `Outputs`
- `Direction` is authored input truth, not a `Details`-only helper

#### [x] Question 3 - What should the first authored state values be?

##### Locked answer
- `OneSide`
- `TwoSides`
- `Symmetric`

##### Why
- these stable internal values map cleanly to the visible labels without baking spaces into the param contract
- they leave room for later runtime branching without another rename pass

#### [x] Question 4 - Does this first slice already split `Depth` into `Start Depth` and `End Depth`?

##### Locked answer
- no

##### Why
- this first slice should lock names and authored state first
- the visible row branching belongs to `Extrude 3.3 Phase 2`

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
- `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx`

Locked first-cut direction:
1. add authored direction state to `Geometry/Extrude` params with canonical internal values:
   - `OneSide`
   - `TwoSides`
   - `Symmetric`
2. expose `Direction` as the next real enum row under `Inputs`
3. place the row order as:
   - `SketchProfile`
   - `Type`
   - `Direction`
   - `Depth`
4. carry local and effective direction state through the selector VM using the same unwired-versus-driven ownership rule already proven by:
   - `Depth`
   - `Type`
5. keep the later row split deferred:
   - `OneSide` still shows `Depth`
   - `TwoSides` and `Symmetric` depth branching waits for `Phase 2`

Scope honored:
- keep this slice limited to the direction selector and authored-state contract
- do not widen into runtime direction meaning yet
- do not implement `Start Depth` / `End Depth` yet
- do not fold `Taper Angle`, `Wall Thickness`, or `Operation` into this phase

Definition of done:
- `Direction` exists as a real input row under `Inputs`
- the authored direction values are explicit and stable
- the node and selector VM can now speak direction honestly
- `Phase 2` can focus only on depth-row branching instead of still arguing about direction names or row placement

## [x] Extrude 3.3 Phase 2 - Depth Row Surface Split And Visibility Rules

### Summary

#### Purpose:
- make the visible depth-row set match the authored direction mode honestly

#### Current read:
- `Phase 1` is shipped:
  - the direction selector exists
  - the authored internal values are locked:
    - `OneSide`
    - `TwoSides`
    - `Symmetric`
- `Phase 2` is now also shipped:
  - the live row order stays:
    - `SketchProfile`
    - `Type`
    - `Direction`
    - depth rows
  - the live depth-row set is now honest by direction:
    - `OneSide`
      - `Depth`
    - `TwoSides`
      - `Start Depth`
      - `End Depth`
    - `Symmetric`
      - `Depth`
  - the authored split params now exist:
    - `startDepthMm`
    - `endDepthMm`
  - switching away from `TwoSides` hides the split rows without deleting their authored values
- the remaining missing truth is runtime/build meaning and any visible wording that still implies the old one-sided contract underneath

### Questions / Decisions

#### [x] Question 1 - What row set should each direction mode own?

##### Locked answer
- `One Side`
  - `Depth`
- `Two Sides`
  - `Start Depth`
  - `End Depth`
- `Symmetric`
  - `Depth`

##### Why
- `Two Sides` is the first explicit split case where one row is no longer honest
- `One Side` still maps cleanly to one magnitude row
- `Symmetric` should not pretend it needs independent start/end values when the authored intent is equal distance in both directions

#### [x] Question 2 - What is the honest `Symmetric` row story?

##### Locked answer
- keep one magnitude row:
  - `Depth`

##### Why
- this is the narrowest honest authored story for the current phase
- it preserves a calm first cut before later runtime semantics decide whether a richer centered-depth variant is needed

#### [x] Question 3 - What authored depth params should back the split row surface?

##### Locked answer
- keep:
  - `depthMm`
- add:
  - `startDepthMm`
  - `endDepthMm`

##### Why
- `depthMm` is already the honest first authored value for `One Side`
- `Two Sides` needs separate persisted values instead of one overloaded row pretending to mean two directions
- keeping `depthMm` for both `One Side` and `Symmetric` avoids an unnecessary rename or migration pass before runtime meaning is widened

#### [x] Question 4 - How should direction switching behave before runtime semantics are widened?

##### Locked answer
- switching to `TwoSides` should reveal:
  - `Start Depth`
  - `End Depth`
- if `startDepthMm` or `endDepthMm` are missing, their first local fallback should come from:
  - `depthMm`
- switching away from `TwoSides` should hide `Start Depth` and `End Depth`
- hiding those rows should not delete their authored values

##### Why
- this keeps the first split non-destructive
- it avoids forcing a brittle migration every time the user changes `Direction`
- it gives `Phase 3` stable authored params to consume later when runtime meaning is widened

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
- focused tests for registry, selector, and `NodeView`

Locked first-cut direction:
1. add the next authored depth params to `Geometry/Extrude`:
   - `startDepthMm`
   - `endDepthMm`
2. extend the live `Geometry/Extrude` input contract so the node can speak these real row ids:
   - `Depth`
   - `StartDepth`
   - `EndDepth`
3. keep the visible input-row order under `Inputs` as:
   - `SketchProfile`
   - `Type`
   - `Direction`
   - depth rows
4. make row visibility honest by direction:
   - `OneSide`
     - show `Depth`
   - `TwoSides`
     - show `Start Depth`
     - show `End Depth`
   - `Symmetric`
     - show `Depth`
5. carry enough selector VM state for each visible row to stay honest about:
   - local fallback value
   - effective value
   - driven state
   - visibility
6. keep the first split non-destructive:
   - missing `startDepthMm` / `endDepthMm` may fall back locally from `depthMm`
   - switching away from `TwoSides` hides those rows but preserves authored values
7. keep the built-result meaning deferred:
   - do not widen compiler/runtime direction semantics yet
   - do not claim in visible copy that `TwoSides` or `Symmetric` already build with their final meaning underneath

Scope honored:
- keep this slice focused on row visibility, row naming, and authored depth-state truth
- do not widen into final runtime direction meaning yet
- do not fold `Taper Angle`, `Wall Thickness`, or `Operation` into this phase
- do not turn this phase into a feature-surface or toolbar cleanup pass

Verification matrix:
- unwired `OneSide` shows only `Depth`
- unwired `TwoSides` shows `Start Depth` plus `End Depth` and hides the single `Depth` row
- unwired `Symmetric` shows only `Depth`
- driven row ownership still follows the same local-versus-effective contract already proven by `Type` and the original `Depth` row
- switching directions does not silently delete hidden authored depth params
- the visible row order stays stable around:
  - `SketchProfile`
  - `Type`
  - `Direction`
  - depth rows

Definition of done:
- the visible depth-row set now matches the authored `Direction` mode honestly
- `TwoSides` no longer reuses one misleading `Depth` row
- `Symmetric` has one explicit first-cut row story instead of hand-waving
- `Phase 3` can focus on compile/runtime meaning and visible wording cleanup instead of still arguing about which depth rows should exist

## [x] Extrude 3.3 Phase 3 - Direction Runtime Meaning And Surface Honesty Cleanup

### Summary

#### Purpose:
- make the graph-native `Geometry/Extrude` build/result path obey the authored `Direction` contract instead of still behaving like the old one-sided `Depth` story underneath
- clean up the remaining node-surface wording so it matches that runtime truth
- finish the `Extrude-3.3` node-side direction lane without widening into older feature-stack extrude parity work

#### Current read:
- after `Phase 1` and `Phase 2`, the live node row stack is now honest:
  - `OneSide`
    - `Depth`
  - `TwoSides`
    - `Start Depth`
    - `End Depth`
  - `Symmetric`
    - `Depth`
- the current graph-native runtime still mostly behaves like the pre-direction one-sided contract:
  - shipped:
    - `src/app/spaghetti/registry/nodeRegistry.ts`
      - now publishes `SolidBody` using direction-aware positive-depth rules
    - `src/app/spaghetti/compiler/compileGraph.ts`
      - now emits explicit `extrudeDirection` plus split-depth runtime fields for graph-native extrudes
    - `src/worker/cad/featureStackRuntime.ts`
      - now executes `OneSide`, `TwoSides`, and `Symmetric` with their first honest meanings
- `src/app/spaghetti/canvas/NodeView.tsx` waiting/output copy is now direction-aware for:
  - `OneSide`
  - `TwoSides`
  - `Symmetric`
- the older feature-stack extrude contract still has no direction concept at all:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
- that means this phase is now shipped for the graph-native node path, while any older feature-stack direction parity remains a later dedicated follow-on instead of hidden inside this phase

### Questions / Decisions

#### [x] Question 1 - What is the first runtime owner for `Direction`?

##### Locked answer
- the first runtime owner should be the graph-native `Geometry/Extrude` node path:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
  - `src/worker/cad/featureStackRuntime.ts`
  - `src/app/spaghetti/canvas/NodeView.tsx`
- the older feature-stack extrude authoring surface is out of scope for this first cut:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`

##### Why
- the live node now owns the real authored `Direction` truth already
- the graph-native compile/runtime path is the user-visible build result that currently drifts from that truth
- the feature-stack extrude contract does not yet even have direction params, so widening into it here would turn one honest implementation slice into a cross-family contract redesign

#### [x] Question 2 - What direction meanings should `Phase 3` lock?

##### Locked answer
- `OneSide`
  - keep the current meaning:
    - extrude forward from the source profile plane by `Depth`
- `TwoSides`
  - extrude backward by `Start Depth`
  - extrude forward by `End Depth`
- `Symmetric`
  - use the single `Depth` row as total centered span
  - extrude equally on both sides of the source profile plane using `Depth / 2` per side

##### Why
- `OneSide` is already the shipped truthful baseline
- `TwoSides` must stop pretending that one row and one forward-only runtime magnitude is enough
- `Symmetric` only becomes honest if the one visible `Depth` value stays numerically true as the total centered result instead of silently doubling the user-authored span

#### [x] Question 3 - What IR/runtime contract should carry those meanings?

##### Locked answer
- extend the graph-native extrude op contract so direction-aware data is explicit:
  - `extrudeDirection`
  - keep `depthResolved` for the single-row modes
  - add:
    - `startDepthResolved`
    - `endDepthResolved`
- `compileFeatureStack` may keep emitting the old one-sided extrude shape by default for now:
  - treat missing `extrudeDirection` as `OneSide`
  - treat missing split depths as absent, not as a runtime error

##### Why
- phase 3 should remove hidden one-sided assumptions from the runtime seam itself
- explicit direction fields preserve the repo’s preference for typed contracts over implicit overloaded meaning
- allowing the older feature-stack path to default to one-sided truth keeps this phase narrow while still making the shared worker payload forward-compatible

#### [x] Question 4 - What visible wording must become honest in the same slice?

##### Locked answer
- the node-side `SolidBody` summary and waiting copy in `src/app/spaghetti/canvas/NodeView.tsx` must become direction-aware:
  - `OneSide`
    - may still reference one positive `Depth`
  - `TwoSides`
    - must reference `Start Depth` and `End Depth`
  - `Symmetric`
    - must reference symmetric depth rather than generic one-sided depth language
- the older feature-stack extrude view copy is not part of this first cut

##### Why
- the live node row surface is already honest, so leaving one-sided result wording behind would keep the visible contract split
- the feature-stack extrude surface cannot be made truly honest without first deciding whether it will also gain a real `Direction` model, which is bigger than this phase

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`

Locked first-cut direction:
1. make graph-node publish/read truth direction-aware in `src/app/spaghetti/registry/nodeRegistry.ts`:
   - `OneSide`
     - `SolidBody` requires positive `Depth`
   - `TwoSides`
     - `SolidBody` requires positive `Start Depth` and `End Depth`
   - `Symmetric`
     - `SolidBody` requires positive `Depth`
2. extend the graph-native extrude IR shape in `src/app/spaghetti/compiler/compileGraph.ts` so `Geometry/Extrude` no longer collapses every direction mode into one `depthResolved` field
3. carry the current effective authored/driven values into compile output:
   - `Direction`
   - `Depth`
   - `StartDepth`
   - `EndDepth`
4. teach `src/worker/cad/featureStackRuntime.ts` to execute the three meanings honestly:
   - `OneSide`
     - forward extent
   - `TwoSides`
     - backward-plus-forward extent using split depths
   - `Symmetric`
     - equal mirrored extent from one magnitude
5. keep the worker/runtime contract backward-compatible for older feature-stack extrudes:
   - missing `extrudeDirection` reads as `OneSide`
   - missing split depths do not break existing one-sided feature-stack IR
6. update `src/app/spaghetti/canvas/NodeView.tsx` summary/waiting copy so the visible body/result language matches the now-shipped direction meaning instead of generic one-sided depth wording

Scope honored:
- keep this slice focused on the graph-native `Geometry/Extrude` direction runtime and node-surface wording
- do not widen into a broader `ExtrudeFeatureView` redesign or feature-stack direction authoring pass
- do not fold `Taper Angle`, `Wall Thickness`, or `Operation` into this phase
- do not redesign the already-shipped `Direction` and depth-row UI contract

Verification matrix:
- compile output for `Geometry/Extrude` now carries explicit direction-aware extrude fields
- runtime execution produces distinct extent meaning for:
  - `OneSide`
  - `TwoSides`
  - `Symmetric`
- `evaluateGraph` / node compute no longer treats `TwoSides` as if one positive `Depth` were enough to publish a body
- node summary/waiting copy no longer implies one-sided depth when `Direction` is:
  - `TwoSides`
  - `Symmetric`
- existing older feature-stack extrude IR still executes through the default one-sided compatibility path

Definition of done:
- `Direction` is no longer UI-only state for the graph-native `Geometry/Extrude` node
- the runtime extent meaning now matches the authored node direction mode
- the live node summary/output wording no longer drifts from that runtime truth
- any remaining feature-stack direction parity work is clearly left for a later dedicated phase instead of hidden inside `Extrude-3.3`

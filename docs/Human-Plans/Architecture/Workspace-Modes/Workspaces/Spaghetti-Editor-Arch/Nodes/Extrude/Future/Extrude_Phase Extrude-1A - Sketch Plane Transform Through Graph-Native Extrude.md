## [ ] - `Extrude-1A` - `Sketch Plane Transform Through Graph-Native Extrude`

### Summary

#### Purpose:
- make `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview` extrude from the authored sketch plane frame instead of only the base plane enum

#### Owns:
- the first implementation-ready fix for the current authored-plane placement bug
- graph-native extrude placement truth for `plane + planeTransform`
- runtime mesh generation from the resolved sketch plane frame
- the first worker-safe shared sketch-plane frame math used by both viewer and runtime
- focused regression coverage for translated and rotated sketch-driven extrudes

#### Does not own:
- plural profile-input rollout
- `taper/offset` runtime support
- Browser or console extrude authoring growth
- boolean or richer extent semantics
- the broader graph-node versus feature-stack contract cleanup

#### Current seam read:

- `Geometry/Sketch` already owns authored `planeTransform` truth in:
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- viewer-side sketch overlays already render that transformed plane honestly through:
  - `src/viewer/sketch/sketchPlaneMath.ts`
  - `src/viewer/geometrySketchOverlay.ts`
- the graph-native `Geometry/Extrude` compile path currently only carries `plane` from the source sketch in:
  - `src/app/spaghetti/compiler/compileGraph.ts`
- graph-native runtime currently extrudes from the base plane enum only in:
  - `src/worker/cad/featureStackRuntime.ts`
  - `src/worker/cad/cadKernelAdapter.ts`
- the mesh-backed preview/result path is already truthful enough that it should be treated as downstream guardrail, not as the main remaining blocker:
  - `src/shared/buildTypes.ts`
  - `src/worker/buildModel.ts`
  - `src/viewer/Viewer.ts`

Current strongest read:
- the body is wrong because graph-native extrude geometry is still generated from local/base plane placement
- `OutputPreview` is mostly showing that wrong body honestly

### Questions

#### [x] Question 1 - Where should the first canonical authored-plane contract live?

##### Locked answer
- carry `planeTransform` through the graph-native sketch/runtime contract explicitly
- let the runtime resolve extrude placement from the referenced sketch feature instead of guessing from viewer-side state
- keep `plane` as the current coarse orientation field, but stop treating it as sufficient authored placement truth by itself

##### Why
- this keeps authored placement truth explicit in the real runtime contract
- it avoids hiding the fix inside viewer-side state or a later preview-only correction seam

#### [x] Question 2 - What is the safest first geometry strategy?

##### Locked answer
- do not try to patch placement later in `OutputPreview`
- do not keep separate viewer-only versus worker-only plane math
- extract a worker-safe shared sketch-plane frame helper from the current viewer-owned `sketchPlaneMath` rules and use that helper when building extrude mesh vertices
- generate extrude geometry directly in the resolved sketch plane frame for the first honest fix

##### Why
- the bug is in generated body placement, not in the `OutputPreview` slot mapping
- one shared worker-safe plane-frame helper is safer than duplicating viewer math and worker math again

#### [x] Question 3 - What is the narrowest file seam for this phase?

##### Locked answer
- focus on:
  - `src/app/spaghetti/compiler/compileGraph.ts`
  - `src/app/spaghetti/compiler/compileGraph.test.ts`
  - `src/worker/cad/featureStackRuntime.ts`
  - `src/worker/cad/featureStackRuntime.test.ts`
  - `src/worker/cad/cadKernelAdapter.ts`
  - one new shared worker-safe sketch-plane frame helper extracted from the current viewer-owned math
- touch the mesh artifact / viewer preview path only if the new placement truth exposes a regression there

##### Why
- these are the smallest seams that can carry `planeTransform` through compile and runtime to actual mesh generation
- the downstream mesh artifact path is already honest enough to stay a guardrail unless the new placement fix proves otherwise

### Spec

Implementation-ready spec:
- `Extrude-1A` is the narrow graph-native contract repair for the current single-profile placement bug
- when a sketch owns a non-default `planeTransform`, wiring `SketchProfile -> Geometry/Extrude -> OutputPreview` must produce a body attached to that same transformed plane
- this phase keeps the current single-profile plus positive-depth seam
- this phase does not widen into `EWR` plural-profile authoring

Locked behavior:
1. `Geometry/Sketch` remains the owner of `plane + planeTransform`.
2. Graph-native extrude runtime consumes that authored placement truth instead of rebuilding placement from `XY/XZ/YZ` alone.
3. `System/OutputPreview` remains topology-only for this fix:
   - it maps slot to source node to built artifact
   - it does not apply a second placement correction layer
4. The first shipped fix must cover:
   - translation
   - world rotation
   - in-plane rotation
   - `XY`, `XZ`, and `YZ`

Implementation seams:
- extract the worker-safe plane-frame math out of `src/viewer/sketch/sketchPlaneMath.ts` into a shared helper that does not depend on `three`
- extend the graph-native sketch IR emitted by `src/app/spaghetti/compiler/compileGraph.ts` so the source sketch op carries `planeTransform`
- extend the runtime payload/context in `src/worker/cad/featureStackRuntime.ts` so the sketch runtime stores `planeTransform` with the sketch plane
- update `src/worker/cad/cadKernelAdapter.ts` so extrude mesh generation uses the resolved sketch plane frame instead of only the base plane enum mapping
- keep the current mesh artifact / preview path unchanged unless focused regressions prove another narrow fix is necessary

Implementation steps:
1. Extract one shared worker-safe sketch-plane frame helper from the current viewer-owned plane math rules.
2. Make graph-native sketch IR carry `planeTransform` alongside `plane` and resolved profiles.
3. Preserve that transform in runtime validation and sketch runtime context.
4. Replace the current `plane-only` mesh point mapping with resolved plane-frame point generation for both the bottom and top extrude faces.
5. Keep depth semantics unchanged:
   - one positive depth
   - no taper
   - no offset
6. Add focused compile/runtime coverage for transformed sketches.

Acceptance checks:
- translated `XY` sketch extrudes from the translated origin instead of world origin
- rotated `XY` sketch extrudes in the authored rotated orientation
- in-plane-rotated sketch extrudes in the authored local rotation
- translated `XZ` sketch stays attached
- translated `YZ` sketch stays attached
- existing untransformed `XY` sketch extrude does not regress
- irregular closed sketch profiles still preserve shape fidelity after the placement fix

Verification:
- focused graph-native compile verification in:
  - `src/app/spaghetti/compiler/compileGraph.test.ts`
- focused runtime extrusion verification in:
  - `src/worker/cad/featureStackRuntime.test.ts`
- focused shared helper verification for the extracted plane-frame math
- manual verification:
  - author a sketch on a moved or rotated sketch plane
  - wire `SketchProfile -> Geometry/Extrude -> System/OutputPreview`
  - confirm the produced body sits on the same authored plane as the sketch outline

Definition of done:
- graph-native extrude bodies honor the authored sketch plane transform
- the current screenshot-class bug is gone for the supported translated/rotated first-pass matrix
- preview and runtime describe the same placed body without a viewer-only correction hack

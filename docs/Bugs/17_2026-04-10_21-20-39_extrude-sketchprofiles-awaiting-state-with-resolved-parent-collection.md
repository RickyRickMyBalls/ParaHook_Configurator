# 17 - Extrude SketchProfiles Awaiting State With Resolved Parent Collection

## Doc History
1. 2026-04-10 21:20:39: Created this bug note to track the case where `Geometry/Extrude` still reads as awaiting `SketchProfiles` even though the upstream parent `SketchProfiles` output visibly resolves multiple child `SketchProfile` members, which appears to suppress the expected `SolidBodies` child-row expansion and may also block split `Output Preview` object fan-out

## Doc Body

### Status

- `[investigating]`

### Summary

A live graph can show:

- `Geometry/Sketch` publishing a resolved parent `SketchProfiles` collection
- explicit child `SketchProfile` rows under that parent
- that parent `SketchProfiles` row wired into `Geometry/Extrude.ExtrusionProfile`

but the downstream `Geometry/Extrude` input row still reads `Awaiting SketchProf...` and the `SolidBodies` output row remains `Waiting`.

That appears to leave the extrude surface in an inconsistent mixed state:

- upstream collection truth is visible and resolved
- downstream extrude still narrates the profile input as unresolved
- child `SolidBody` member rows do not appear
- the connected `Output Preview` surface does not widen into multiple published objects

### User-Facing Symptom

- an upstream sketch clearly shows a resolved `SketchProfiles` parent row with multiple child `SketchProfile` items
- that parent collection is wired into `Geometry/Extrude`
- the extrude input row still says `Awaiting SketchProf...`
- the extrude `SolidBodies` output row stays `Waiting`
- the expected child `SolidBody` rows do not appear under `SolidBodies`
- `Output Preview` is connected and geometry is visible, but it does not publish multiple objects from that collection-fed path

### Confirmed Current Behavior

- the upstream `Geometry/Sketch` surface can show `4 profiles` on the parent `SketchProfiles` row
- the sketch node can also show four explicit child `SketchProfile` rows with pins
- the wire from the parent `SketchProfiles` row to `Geometry/Extrude.ExtrusionProfile` is visibly present
- despite that, the extrude node still reports an awaiting profile state and waiting body state in the captured case
- the downstream `Output Preview` connection exists, but the result still behaves like the plural publication path did not fully engage

### Strongest Current Likely Cause

The strongest current read is a mismatch between one or more of these layers:

- the sketch-side collection row visibility and its resolved profile-count truth
- the extrude selector/evaluator logic that decides whether `ExtrusionProfile` is resolved as aggregate input
- the extrude body-member placeholder or resolved-member count logic for authored `New Objects`
- the downstream output-preview split/publication surface, which may be receiving geometry visibility without the expected plural object-publication truth

Put simply: the graph appears to have enough upstream collection truth for extrude to stop saying `Awaiting`, but one downstream seam is still treating that same connection as unresolved or incomplete.

### Likely Ownership

- `Geometry/Sketch` to `Geometry/Extrude` collection handoff
- extrude selector/evaluator readiness logic
- extrude `SolidBodies` child-row readiness
- connected `Output Preview` plural publication surface

### Likely Files

- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/features/effectivePorts.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`

### Impact

- medium UX impact because the graph surface shows conflicting truth between upstream resolved collections and downstream waiting narration
- medium workflow impact because users may not get the expected child `SolidBody` drag targets in `New Objects`
- medium publication impact because connected `Output Preview` may fail to widen into multiple objects even when the collection path looks valid

### Questions To Resolve

1. Is the upstream `SketchProfiles` parent row truly resolved in evaluator truth, or only visibly resolved in the sketch node surface?
2. Is `Geometry/Extrude.ExtrusionProfile` failing to read aggregate profile truth from the parent `SketchProfiles` wire in this specific graph state?
3. Is the `SolidBodies` waiting state blocked by profile readiness, by depth/body validity, or by a later body-member placeholder/resolution seam?
4. Is `Output Preview` failing because extrude never reaches resolved plural body publication, or because output-preview split/publication widening has its own independent bug here?

### Repro

1. Create or open a graph where `Geometry/Sketch` resolves a parent `SketchProfiles` collection with four child `SketchProfile` members.
2. Wire the parent `SketchProfiles` output into `Geometry/Extrude.ExtrusionProfile`.
3. Set extrude output mode to `New Objects`.
4. Observe that the extrude input row still reads `Awaiting SketchProf...` in the captured failure state.
5. Observe that the `SolidBodies` output row remains `Waiting` and does not reveal child `SolidBody` rows.
6. Observe that connected `Output Preview` geometry is visible, but multiple published objects are not created.

### Definition Of Done

- the extrude input row no longer reports an awaiting profile state when the upstream parent `SketchProfiles` connection is truly resolved
- `SolidBodies` child rows appear when the graph has enough authored or resolved truth for plural extrude output
- connected `Output Preview` behavior matches the true grouped-versus-split publication state of the resolved extrude output


## Implementation plan

## Fix `SketchProfiles -> Extrude` Aggregate Readiness Regression

### Summary
Fix the regression where a resolved parent `SketchProfiles` wire into `Geometry/Extrude.ExtrusionProfile` still leaves extrude in an awaiting state, which in turn keeps `SolidBodies` waiting and blocks the expected downstream end-to-end behavior. The implementation should restore the intended aggregate handoff contract, keep early `SolidBody` child rows visible when justified, and verify connected `Output Preview` behavior end-to-end without changing grouped-vs-split semantics.

### Key Changes
- Reproduce the failing graph in focused tests using the exact proving case:
  - one `Geometry/Sketch` with 4 resolved profiles
  - parent `SketchProfiles` wired into `Geometry/Extrude`
  - extrude in authored `New Objects`
  - connected `Output Preview`
- Trace and fix the aggregate profile-read seam so `selectNodeVm` and the extrude UI do not fall back to `Awaiting SketchProfiles contributors` when evaluator truth already contains a resolved aggregate profile array.
- Treat the selector/evaluator contract as the primary owner:
  - `evaluateGraph.ts` must still normalize a whole-port `SketchProfiles` wire into `inputs.ExtrusionProfile`
  - `selectNodeVm.ts` must derive `profileTargetMode: 'allFromSketch'`, `hasProfile: true`, correct `profileCount`, and expected `bodyMemberPortIds` from that aggregate input consistently
  - `NodeView.tsx` should then naturally show the resolved aggregate profile summary and the non-waiting `SolidBodies` state
- Keep `Combine` unchanged and singular.
- Keep `Output Preview` semantics explicit:
  - if the connected slot is `grouped`, preserve one published object
  - if the connected slot is `split`, verify the same fixed extrude output now fans out into multiple published objects
  - do not change `publicationMode` defaults as part of this fix
- If the failing state comes from stale or mismatched selector fallback logic rather than evaluator truth, remove the fallback that masks the aggregate resolved state and replace it with one deterministic source-of-truth read.

### Implementation Notes
- Add one regression test in the selector layer for the exact failing shape from the screenshot, asserting:
  - aggregate `SketchProfiles` wire is recognized
  - `hasProfile` is true
  - `profileCount` matches upstream count
  - `bodyMemberPortIds` and `bodyCount` are consistent for `New Objects`
- Add one UI test for the same graph asserting:
  - extrude input row no longer says `Awaiting SketchProf...`
  - `SolidBodies` is not stuck in the waiting branch when depth/profile truth is valid
  - child `SolidBody` rows appear under the parent row in `New Objects`
- Add one end-to-end publication test around connected `Output Preview`:
  - grouped slot stays singular
  - split slot widens into multiple objects from the same collection source
- If needed, add a narrow integration test around `previewPreparation.ts` / `outputSurface.ts` to prove the extrude fix reaches the output surface once the slot is `split`.

### Test Plan
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - assert the exact 4-profile parent-collection extrude path still publishes plural `SolidBodies`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - add regression coverage for aggregate parent `SketchProfiles` not reading as awaiting
- `src/app/spaghetti/canvas/NodeView.test.tsx` or `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - assert resolved aggregate profile narration and visible child `SolidBody` rows
- `src/app/spaghetti/outputSurface.test.ts` and/or `src/app/spaghetti/previewPreparation.ts` focused test
  - assert connected `Output Preview` behavior is correct for grouped vs split after the extrude fix

### Assumptions
- The screenshot reflects a real regression/state mismatch, not intended behavior, because existing tests already establish that a parent `SketchProfiles` wire into extrude should resolve.
- `Output Preview` should only create multiple objects when the target slot is authored `split`; grouped behavior remains one object and is not part of the bug.
- The plan should fix the full chain only to the extent that the same root cause blocks downstream output publication; it should not introduce new output-preview semantics.

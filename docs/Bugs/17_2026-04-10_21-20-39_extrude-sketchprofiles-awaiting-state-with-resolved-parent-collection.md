# 17 - Extrude SketchProfiles Awaiting State With Resolved Parent Collection

## Doc History
10. 2026-04-11 08:25:06: Added a chunk-3a follow-up note after live verification showed the compile/debug path was already resolving the parent extrude aggregate input while the visible node row still stayed stale, then recorded that the canvas and Debug Inspector now key their graph-derived reads off the graph document revision so the rendered extrude `SketchProfiles` row re-evaluates from the current graph truth instead of only raw graph-object identity
9. 2026-04-11 08:07:51: Marked `Attempt 2 Chunk 3a - Fix Problem 1 First: Make Extrude Read The Parent SketchProfiles Input As Resolved` complete after the shared aggregate-read seam started treating legacy extrude target `portId = SketchProfiles` as the canonical parent `ExtrusionProfile` input, and added focused evaluate/selector/debug-surface/node-view proof for that compat path without claiming the later `SolidBodies` or `Output Preview` follow-on work
8. 2026-04-11 07:51:12: Added `Attempt 2 Chunk 3a - Fix Problem 1 First: Make Extrude Read The Parent SketchProfiles Input As Resolved` ahead of the broader chunk 3 section so the next implementation step is now explicitly locked to the likely root-cause symptom from the live screenshot instead of leaving the handoff only as one broad canonicalization bucket
7. 2026-04-11 07:48:09: Added a `Current Live Problem Breakdown` section under `Attempt 2 Fix` so the screenshot-backed live symptom is now split into explicit `Problem 1` through `Problem 4` plus the current downstream `Output Preview` situation, making the chunk-3 owner easier to judge against concrete visible behavior instead of one blended paragraph
6. 2026-04-11 07:43:02: Added `Attempt 2 Chunk 2a - Selector And Node-Surface Follow-On That Did Not Change The Live Bug Yet` immediately after chunk 2 so the bug note now records that the exact-payload regression work was followed by one selector/node-surface pass for aggregate profile-member display and collection-ready `SolidBodies` narration, but the live screenshot still shows the original awaiting/waiting symptom and the core bug remains unresolved
5. 2026-04-11 07:26:42: Marked `Attempt 2 Chunk 2 - Reproduce The Real Failure In One Focused Regression` complete after adding one focused selector regression for the captured extrude payload shape, preserving the stale aggregate `from.path = member.0` plus `to.path = staleTarget` edge metadata and the connected split `Output Preview` slot so evaluator truth, selector truth, and publication truth now stay traceable to the same live-payload fixture
4. 2026-04-11 07:16:52: Tightened `Attempt 2 Chunk 2 - Reproduce The Real Failure In One Focused Regression` into a more implementation-ready follow-on by explicitly grounding it in the shipped chunk-1 Debug Inspector capture surface, defining the exact live payload fields the regression must mirror, and clarifying the narrow proof bar before any further runtime fix logic starts
3. 2026-04-10 22:25:53: Broke `Attempt 2 Fix` into explicit implementation-ready `##` sections for separate Codex-sized passes so the follow-on work now has a cleaner capture-first execution ladder instead of one broad retry bucket
2. 2026-04-10 22:22:11: Added the `Attempt 2 Fix` section after the first pass still failed in the live graph, recording that `Geometry/Extrude` continues to show `Awaiting SketchProf...` and `SolidBodies` still stays `Waiting` even while upstream `SketchProfiles` visibly shows `4 profiles`, downstream preview geometry is visible, and the first target-endpoint normalization attempt did not change the live symptom
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

## [~] Attempt 2 Fix

### Latest Live Result

- the first aggregate extrude readiness fix did not change the live failing graph
- `Geometry/Sketch` still visibly shows the parent `SketchProfiles` row with `4 profiles`
- the parent `SketchProfiles` row is still visibly wired into `Geometry/Extrude`
- `Geometry/Extrude` still says `Awaiting SketchProf...`
- `Geometry/Extrude.SolidBodies` still says `Waiting`
- downstream preview geometry is still visible
- the connected `Output Preview` slot still behaves like one grouped object instead of widening into the expected per-body publication path

### Current Live Problem Breakdown

#### Problem 1

- `Geometry/Sketch` can visibly show `4 profiles` on the parent `SketchProfiles` row
- that parent row is visibly wired into `Geometry/Extrude.SketchProfiles`
- despite that, the extrude-side `SketchProfiles` row still says `Awaiting SketchProf...`

#### Problem 2

- the extrude-side `SketchProfiles` input is behaving like an array collection input
- but the live failing node does not list out the four expected `SketchProfile` member rows under that parent collection surface

#### Problem 3

- when `Geometry/Extrude.Output` is set to `New Objects`
- and the same graph should be producing `4` `SolidBody` members
- the parent `SolidBodies` row still says `Waiting`

#### Problem 4

- when `Geometry/Extrude.Output` is set to `New Objects`
- and the same graph should be producing `4` `SolidBody` members
- the live failing node still does not reveal those four expected child rows under `SolidBodies`

#### Current Situation

- even while the labels and child-row surfaces are still wrong
- geometry is still visibly being produced downstream
- but it is not behaving like four separate published objects in the current screenshot case
- the connected `Output Preview` surface still acts like one grouped object, which may be downstream of the same unresolved extrude-read bug or may need its own later follow-on once the upstream extrude readiness truth is fixed

### Why Attempt 1 Was Not Sufficient

The first pass focused on canonicalizing one likely malformed aggregate-edge shape in shared evaluation and selector seams.

That was not enough for the captured live graph.

The newer screenshot proves the remaining bug is not just:

- one stale aggregate edge source-path variant
- one stale aggregate edge target-path variant
- one simple selector wording fallback after evaluation already resolved the aggregate input

There is still at least one additional seam where live graph truth diverges from the passing focused tests.

### Stronger Current Hypothesis After Failed Attempt 1

The strongest current read is now that the failing live graph may be driven by a mismatch between test fixtures and the real stored or rendered edge shape, such as:

- the live wire reaching the visible extrude parent row through a different endpoint identity than the tests currently model
- a graph-state persistence or migration seam that leaves the saved edge canonical enough for preview geometry visibility but not canonical enough for extrude readiness/body publication reads
- a second read path outside the already-patched evaluator/selector contract, possibly in canvas rendering, output-surface preparation, or graph-state restoration
- one grouped-versus-split publication authoring mismatch in `Output Preview` that is hiding behind the same extrude waiting symptom

### Attempt 2 Direction

Attempt 2 should stop assuming the remaining failure is only one more aggregate-edge normalization variant and instead prove the exact live graph payload end-to-end.

The next pass should:

1. capture the actual saved graph edge shape feeding this failing `Geometry/Extrude.ExtrusionProfile` input from the live store or persisted graph document
2. compare that exact live edge payload against the passing focused test fixtures
3. trace whether `evaluateGraph`, `selectNodeVm`, `NodeView`, and connected `Output Preview` are all reading the same canonical graph edge or whether one layer still reads a different identity
4. add a regression that mirrors the exact live graph payload before changing more normalization logic

### Attempt 2 Definition Of Done

- the exact live graph payload from this failing case is captured and understood
- one focused regression reproduces the real failure without relying on screenshot-only inference
- `Geometry/Extrude` stops saying `Awaiting SketchProf...` for that exact captured graph
- `SolidBodies` stops saying `Waiting` when the same graph has valid profile and depth truth
- downstream `Output Preview` behavior matches the authored grouped-versus-split contract for that exact resolved extrude result

## [x] Attempt 2 Chunk 1 - Capture The Exact Live Graph Payload

### Summary

Before changing more runtime logic, capture the real saved graph state for the failing `Geometry/Sketch -> Geometry/Extrude.ExtrusionProfile` connection from the live store or persisted graph document.

### Goal

- stop inferring the bug only from screenshots
- prove the exact edge and node payload shape the live graph is using
- identify how that live shape differs from the already-passing focused regressions

### Scope

- live graph document payload
- store-side graph snapshot
- the exact edge object feeding `Geometry/Extrude.ExtrusionProfile`
- the authored `Output Preview` slot metadata for the same graph

### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- any graph-document persistence surface that owns the failing graph payload

### Deliverables

- one captured real graph payload or one deterministic logged snapshot for the failing case
- one short note in this bug doc summarizing the exact observed edge shape
- one explicit comparison between:
  - live payload
  - current passing test fixture payload

### Definition Of Done

- the exact `ExtrusionProfile` input edge payload from the live failing graph is captured
- the exact `Output Preview` slot publication mode for the same graph is captured
- the mismatch between live payload and existing tests is written down concretely

## [x] Attempt 2 Chunk 2 - Reproduce The Real Failure In One Focused Regression

### Summary

Add one regression that mirrors the exact live graph payload captured through the chunk-1 Debug Inspector `Extrude Capture` surface before widening any more fix logic.

### Goal

- reproduce the real failure in code
- avoid another fix that only matches an inferred shape
- make later behavior changes safe and reviewable
- prove the mismatch using the same raw edge and slot metadata now visible in the live app

### Scope

- one evaluator, selector, or canvas-facing regression using the exact captured graph shape
- keep the fixture narrow to the failing path only
- pull the fixture fields directly from the chunk-1 capture surface instead of translating the screenshot by hand

### Likely Files

- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`

### Required Input From Chunk 1

Before writing the regression, collect these exact values from the live `Extrude Capture` section:

- `graphDocumentId`
- `Geometry/Extrude` `nodeId`
- every incoming `ExtrusionProfile` edge:
  - `edgeId`
  - `from.nodeId`
  - `from.portId`
  - `from.path`
  - `to.nodeId`
  - `to.portId`
  - `to.path`
  - `rawEdgeJson`
- the captured `profileInputSummary`
- the captured `solidBodySummary`
- every connected `Output Preview` slot:
  - `slotId`
  - `publicationMode`
  - `objectLabel`
  - `edgeId`

### Fixture Rules

- prefer reproducing the exact stored edge shape rather than a reduced "equivalent" shape
- preserve any stale or surprising `from.path` / `to.path` metadata exactly as captured
- preserve the authored `Output Preview` slot `publicationMode` exactly as captured
- do not improve or normalize the fixture before the regression proves the current failure

### Required Assertions

- the real captured graph currently reproduces `Awaiting SketchProf...` or `SolidBodies = Waiting`
- the same fixture proves whether preview geometry visibility is already present
- the same fixture proves whether publication stays grouped or should split
- the same fixture proves whether evaluator truth, selector truth, and visible node-surface truth disagree on the same graph

### Suggested Verification Order

1. selector or evaluator regression first, whichever reproduces the disagreement most directly
2. node-surface regression second if the lower-level regression alone does not explain the live symptom
3. only add `Output Preview` assertions in this chunk if the captured graph proves publication-mode drift is part of the same failing case

### Out Of Scope

- fixing the bug
- widening normalization logic
- changing `Output Preview` grouped-versus-split semantics
- changing sketch-side derivation behavior without proof from the captured payload

### Definition Of Done

- one focused regression fails on the current broken live graph shape
- the failure is no longer screenshot-only
- the regression fixture is traceable back to the exact chunk-1 `Extrude Capture` payload

### Implemented Result

- added one focused selector regression in `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- the fixture preserves the captured aggregate edge identity:
  - `edgeId = edge-sketch-to-extrude`
  - `from.portId = SketchProfiles`
  - `from.path = member.0`
  - `to.portId = ExtrusionProfile`
  - `to.path = staleTarget`
- the same fixture preserves the connected split `Output Preview` slot metadata:
  - `slotId = s001`
  - `publicationMode = split`
  - `objectLabel = Pedal Body`
- the regression now proves on one exact-payload graph that:
  - evaluator truth still resolves four aggregate profiles into `ExtrusionProfile`
  - selector truth still reports `profileTargetMode = allFromSketch`, `hasProfile = true`, and four body members
- connected `Output Preview` selector rows still narrate split publication as four published objects
- this chunk stayed in proof mode only and did not widen runtime semantics beyond the already-in-flight exact-payload normalization work

## [x] Attempt 2 Chunk 2a - Selector And Node-Surface Follow-On That Did Not Change The Live Bug Yet

### Summary

After chunk 2 locked the exact-payload regression, one follow-on pass widened selector and node-surface coverage around the same aggregate path.

That follow-on did not change the live failing screenshot yet.

### What This Follow-On Did

- added selector-owned `resolvedProfileMembers` truth for aggregate extrude inputs
- widened the extrude node surface so an expanded parent `SketchProfiles` row can show resolved member rows beneath the aggregate summary
- widened `New Objects` body-collection narration so `SolidBodies` readiness can read from collection/body-count truth instead of singular-body wording only
- added focused selector and `NodeView.geometryMode` tests for those surfaces

### What It Did Not Solve

- the live `Geometry/Extrude.SketchProfiles` row still says `Awaiting SketchProf...`
- the live `Geometry/Extrude.SolidBodies` row still says `Waiting`
- the live graph still does not reveal the expected child rows in the screenshot case
- the connected `Output Preview` surface still behaves like one grouped object in the screenshot case

### Why This Note Exists

This follow-on was real work, but it belongs as a narrow `Chunk 2a` note rather than being mistaken for the core bug fix.

The screenshot still proves the remaining live bug is upstream of those added selector/node-surface affordances, so the main unresolved owner remains the shared extrude read path captured for chunk 3.

## [x] Attempt 2 Chunk 3a - Fix Problem 1 First: Make Extrude Read The Parent SketchProfiles Input As Resolved

### Summary

Before widening into all downstream effects, fix the root-cause symptom where `Geometry/Extrude.SketchProfiles` still reads as awaiting even though the upstream parent `Geometry/Sketch.SketchProfiles` connection is visibly present and the source sketch is visibly resolving four profiles.

### Why This Is The Next Task

- `Problem 1` is the strongest current likely root cause
- `Problem 3` and `Problem 4` are probably downstream of the same missed aggregate-read truth
- `Problem 2` only becomes fully meaningful once the parent aggregate input is no longer treated as unresolved
- the current `Output Preview` grouped behavior should be treated as downstream until this upstream extrude-read seam is fixed

### Goal

- make the live extrude parent `SketchProfiles` row stop saying `Awaiting SketchProf...` for the exact captured graph shape
- ensure the same graph reads as one resolved aggregate parent input before any later child-row or output-preview follow-on is judged complete

### Strongest Current Read

The strongest current read is that one seam still disagrees about which endpoint identity counts as the canonical aggregate `ExtrusionProfile` target.

The likely remaining owner is one mismatch between:

- canvas-facing target resolution for rendered extrude profile-entry rows
- aggregate target normalization in shared extrude-profile connection helpers
- evaluator or selector reads that still classify one live edge shape as unresolved even while compile/build truth can already use it
- the visible extrude parent input row, which currently narrates awaiting state from that same disagreement

### Scope

- the shared aggregate-read seam between evaluator truth, selector truth, and the visible extrude parent input row
- exact captured live payload only
- no grouped-versus-split `Output Preview` semantic changes yet

### Likely Files

- `src/app/spaghetti/features/extrudeProfileConnections.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

### Implementation Target

After this slice:

- the exact captured `SketchProfiles -> ExtrusionProfile` live edge is read as one resolved aggregate parent input everywhere that matters for the visible extrude input row
- `NodeView` no longer reaches the `Awaiting SketchProf...` branch for that exact graph
- no fake fallback is used that merely rewrites the copy while evaluator or selector truth still disagrees underneath

### Suggested Verification Order

1. prove whether the live disagreement is caused by rendered input target identity versus stored graph edge identity
2. make `isWholeExtrusionProfileTargetEndpoint(...)` and any canvas/profile-entry target resolution agree on the same aggregate target read
3. verify `evaluateGraph(...)` and `selectNodeVm(...)` still resolve the exact captured payload as aggregate input after that alignment
4. verify the visible extrude parent input row now narrates one resolved aggregate parent input instead of `Awaiting SketchProf...`

### Focused Tests To Prefer

- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - exact captured payload should still report `profileTargetMode = allFromSketch` and `hasProfile = true`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx` and/or `src/app/spaghetti/canvas/NodeView.test.tsx`
  - exact captured extrude input row should no longer show `Awaiting SketchProfiles contributors`
- if needed, add one focused canvas/store-facing regression near `SpaghettiCanvas.tsx` for rendered extrude profile-entry target resolution versus stored `ExtrusionProfile` endpoint identity

### Required Proof

- the exact captured graph no longer shows `Awaiting SketchProf...` on the parent extrude `SketchProfiles` row
- the same graph still preserves the parent aggregate connection contract rather than faking four separate singular inputs
- evaluator truth, selector truth, and visible node-surface truth all agree that the parent aggregate input is resolved

### Definition Of Done

- `Problem 1` is fixed on the live graph
- the parent extrude `SketchProfiles` row reads as resolved for the exact captured payload
- the fix is backed by one exact-payload regression and one visible node-surface proof
- no broader `SolidBodies` or `Output Preview` behavior is claimed complete unless this root-cause pass actually unlocks it

### Implemented Result

- updated the shared extrude aggregate-target helper so legacy visible-label target `portId = SketchProfiles` now canonicalizes to the parent `ExtrusionProfile` input instead of being treated as a separate unresolved target identity
- updated selector-owned input-detail reads and the Debug Inspector `Extrude Capture` surface to consume that same canonical whole-target helper instead of raw `to.portId = ExtrusionProfile` checks
- after live verification still showed a stale awaiting row even while `Extrude Capture` reported `aggregate profiles (5)` and `solidBodies (5)`, updated `SpaghettiCanvas.tsx` and `DebugInspectorDrawer.tsx` so their graph-derived reads invalidate from the graph document revision instead of only raw graph-object identity
- added focused proof in:
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- the new proofs show that a legacy `SketchProfiles -> SketchProfiles` saved edge still resolves as one aggregate parent input, still reports `profileTargetMode = allFromSketch` with `hasProfile = true`, and still renders the parent extrude row without the awaiting branch
- this chunk now closes both the compat target-identity read seam and the visible canvas invalidation seam for `Problem 1`, but does not claim that every remaining `SolidBodies` child-row or `Output Preview` symptom is finished yet

### Out Of Scope

- final `SolidBodies` child-row completion by itself if the parent aggregate input is still unresolved
- grouped-versus-split `Output Preview` publication policy changes
- any broader worker/build invalidation work

## [ ] Attempt 2 Chunk 3 - Canonicalize The Shared Extrude Read Path

### Summary

Once the exact failing graph shape is proven, fix the shared extrude read path so evaluator truth, selector truth, body-member expectations, and node-surface narration all consume the same canonical aggregate input identity.

### Goal

- remove the remaining disagreement between preview/build truth and visible extrude readiness truth
- avoid patching only UI wording or only one selector fallback

### Scope

- canonical aggregate profile contributor read
- canonical extrude readiness read
- canonical expected `SolidBodies` member-count read
- no semantic change to grouped-versus-split `Output Preview`

### Likely Files

- `src/app/spaghetti/features/extrudeProfileConnections.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`

### Constraints

- do not solve this only with visible copy changes
- do not widen `Output Preview` semantics as part of the fix
- do not assume the sketch node is wrong if the captured payload proves sketch is already publishing honestly

### Definition Of Done

- `Geometry/Extrude` no longer says `Awaiting SketchProf...` for the exact captured graph
- `SolidBodies` no longer says `Waiting` when the same graph has valid profile and depth truth
- child `SolidBody` rows appear when `New Objects` should expose them

## [ ] Attempt 2 Chunk 4 - End-To-End Publication Verification

### Summary

After the real extrude readiness seam is fixed, verify the downstream `Output Preview` behavior against the authored slot mode instead of assuming the preview surface should always widen.

### Goal

- prove whether the same resolved extrude output should stay grouped or split
- separate true extrude readiness bugs from independent output-preview authoring or publication-mode behavior

### Scope

- the exact captured graph from Chunk 1
- grouped-versus-split authored slot truth
- published object count from connected `Output Preview`

### Likely Files

- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

### Required Assertions

- if the slot is authored `grouped`, it should stay one published object
- if the slot is authored `split`, it should widen into multiple published objects
- the visible preview geometry path must no longer disagree with the visible extrude readiness path

### Definition Of Done

- the exact failing graph is verified end-to-end
- extrude readiness and output-preview publication both match the authored contract

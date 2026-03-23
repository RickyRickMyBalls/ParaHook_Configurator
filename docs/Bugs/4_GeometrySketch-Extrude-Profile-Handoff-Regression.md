# 4 - Geometry Sketch To Extrude Profile Handoff Regression

## Doc History
4. 2026-03-23 13:50: Marked this bug as code-resolved pending manual app verification after shipping the graph-native mesh-preview repair, updating the status from implementation-ready to resolved-question-mark, and preserving the note as the historical bug record for the old `worker mesh -> PartArtifact -> Viewer` collapse
3. 2026-03-23 13:32: Refreshed this bug note after shipping `[5.3A-2]`, replacing the stale `compileGraph loop.segments` primary diagnosis with the current downstream `worker mesh -> PartArtifact -> Viewer` seam, updating the likely files and fix direction, and marking the bug as implementation-ready instead of still-open-ended investigation
2. 2026-03-23 01:19: Added an implementation-ready bottom section for fixing this regression, translating the current sketch-to-extrude suspicion into a concrete contract-repair plan with `### Header`, `### Current Seam Read`, `### Questions / Decisions`, and `### Implementation Spec`
1. 2026-03-23 01:10: Created this bug note to capture the current regression where irregular `Sketch Draw` profiles can be selected and connected into `Geometry/Extrude`, but the resulting extruded body does not match the authored sketch shape

## Status

- `[resolved?]`

## Summary

When the user:

- authors an irregular closed shape in `Sketch Draw`
- selects the derived `SketchProfile`
- feeds that profile into `Geometry/Extrude`
- and then routes the result into `System/OutputPreview`

the previewed body could fail to match the real sketch shape.

The current live read is that the code-side graph-native worker path now preserves real mesh geometry through the result contract and viewer preview path, with manual in-app verification still recommended for the authored irregular `PLine` case.

## User-Facing Symptom

- a non-rectangular or irregular `PLine`-based sketch can produce the wrong extruded body
- the selected profile appears valid in the sketch node
- `Geometry/Extrude` still produces a body
- but the final solid does not reflect the true `Sketch Draw` loop the user authored

## Most Likely Cause

The strongest confirmed cause was the downstream result seam after runtime extrusion:

- `src/worker/buildModel.ts`
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/viewer/Viewer.ts`

The graph-native worker path could produce real mesh bodies, but the build/output contract reduced them to a box artifact and the viewer rendered graph outputs as boxes.

That meant the final preview could still be wrong even when the upstream sketch-profile handoff was no longer the primary broken seam.

## Why This Is The Most Likely Cause Now

At fix time, the code seams showed:

- the old graph-native `compileGraph.ts` handoff suspicion was real, but that is no longer the best explanation for the current remaining defect
- `[5.3A-2]` already landed the graph-native request path, so the worker is now receiving canonical compiled build data instead of the old box-centered request seam
- runtime extrusion still happened from real mesh bodies in:
  - `src/worker/cad/featureStackRuntime.ts`
- but after runtime, `buildModel.ts` converted those bodies into bounds boxes
- `PartArtifact` was still box-only in `buildTypes.ts`
- app-side build-result validation still expected box-only artifacts in `buildDispatcher.ts`
- the viewer still turned preview parts into `BoxGeometry` in `Viewer.ts`

That made the bug more like a result/preview-contract collapse than an upstream sketch-profile-loss problem.

## Likely Ownership

- worker result contract
- graph-native preview artifact shape
- viewer preview rendering
- graph-native sketch/extrude compile verification only as a guardrail

## Likely Files

- `src/shared/buildTypes.ts`
- `src/shared/buildTypes.test.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/buildModel.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/viewer/Viewer.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`

## Desired Fix Direction

The likely fix is to stop flattening graph-native extrude bodies into a box-only artifact/result shape and let preview carry real mesh geometry.

That probably means:

1. Keep the upstream sketch/extrude compile path under verification so the old handoff bug stays closed.
2. Add a mesh-capable `PartArtifact` variant and matching validation.
3. Make `buildModel.ts` publish real graph-native extrude geometry instead of only a bounds box stand-in.
4. Make `Viewer.ts` render the true graph-native preview geometry instead of always building `BoxGeometry`.

## Current Resolution Read

The shipped code now does that narrow repair:

1. `src/shared/buildTypes.ts` carries a mesh-capable `PartArtifact` variant.
2. `src/worker/buildModel.ts` emits mesh artifacts for compiled graph-native feature-stack bodies instead of flattening them to bounds boxes.
3. `src/viewer/Viewer.ts` renders those mesh artifacts through `BufferGeometry` while preserving the current viewer axis convention.
4. Focused shared, dispatcher, runtime, and pipeline tests now guard the widened contract.

Manual in-app verification is still recommended before treating the bug as fully closed in user-facing terms.

## Verification

Useful verification path:

1. Create an irregular closed `PLine` profile in `Sketch Draw`.
2. Select the intended `SketchProfile`.
3. Connect it to `Geometry/Extrude`.
4. Connect extrude output to `System/OutputPreview`.
5. Confirm the extruded body matches the authored 2D loop instead of a simplified or incorrect proxy shape.

## Notes

This bug still overlaps conceptually with earlier preview-trust issues, but the current evidence now points downstream of runtime extrusion more than upstream of it.

The main remaining risk is that the old compile/handoff bug could still reappear if no compile verification is kept while the result contract is widened.

## [x] - `Fix Spec` - `Geometry Sketch To Extrude Contract Repair`

### Header

Purpose:
- repair the graph-native `Sketch -> Extrude -> Output Preview` path so irregular `Sketch Draw` profiles preview from the real runtime geometry instead of a box-only artifact stand-in

Owns:
- graph-native preview/result artifact shape
- worker build/output conversion behavior
- viewer rendering support for graph-native mesh artifacts
- a narrow compile-path verification so the old handoff bug does not silently regress

Does not own:
- broad `EWR` rollout
- new `Sketch Draw` tools or snap types
- `OutputPreview` UI redesign
- general 3D viewport picking

### Current Seam Read

- `Geometry/Sketch` currently derives real profiles from authored sketch components in:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
- the evaluated `SketchProfile` / `SketchProfiles` values survive graph evaluation in:
  - `src/app/spaghetti/compiler/evaluateGraph.ts`
- the feature-stack compile path preserves richer profile data in:
  - `src/app/spaghetti/features/compileFeatureStack.ts`
  - including:
    - `profileId`
    - `profileIndex`
    - `area`
    - `loop`
    - `verticesProxy`
- the graph-native `Geometry/Extrude` path in `src/app/spaghetti/compiler/compileGraph.ts` should now be treated as a verification checkpoint, not the primary broken seam
- the worker runtime still produces real body meshes in:
  - `src/worker/cad/featureStackRuntime.ts`
- after runtime, the current build/output path reduces those bodies to bounds boxes in:
  - `src/worker/buildModel.ts`
- `PartArtifact` and build-result validation are still box-only in:
  - `src/shared/buildTypes.ts`
  - `src/app/buildDispatcher.ts`
- the viewer still previews graph build outputs as boxes in:
  - `src/viewer/Viewer.ts`

Current strongest suspicion:
- the graph-native runtime can already preserve more true geometry than the preview path shows
- the remaining defect is the `worker mesh -> PartArtifact -> Viewer` collapse, with compile verification kept only so the old upstream bug stays closed

### Questions / Decisions

#### [x] - `q1` Should the fix target `OutputPreview`, `Geometry/Extrude`, or the graph-native sketch-to-extrude contract?

##### Suggestion
- target the downstream result/preview contract first
- keep the graph-native sketch-to-extrude contract under verification, but do not spend the main implementation budget there unless that verification fails

#### [x] - `q2` Should graph-native `Geometry/Extrude` keep synthesizing a sketch op from a reduced `SketchProfile` payload?

##### Suggestion
- no as a general rule, but that is no longer the main remaining blocker for this bug
- the practical fix path now starts with widening the result artifact and preview contract

#### [x] - `q3` Should graph-native `Geometry/Extrude` align more closely with the feature-stack compile contract?

##### Suggestion
- yes
- use the feature-stack path in `compileFeatureStack.ts` as a guardrail for upstream fidelity
- but implement the remaining fix in the worker result and viewer seam first

#### [x] - `q4` What is the first safe definition of done for this fix?

##### Suggestion
- an irregular closed `PLine` profile from `Sketch Draw` extrudes to the same silhouette the user authored
- the viewer no longer shows only a bounding box stand-in for that graph-native extrude result
- existing simple shapes like rectangle and circle do not regress

### Implementation Spec

Recommended file focus:
- edit `src/shared/buildTypes.ts`
- edit `src/shared/buildTypes.test.ts`
- edit `src/app/buildDispatcher.ts`
- edit `src/worker/buildModel.ts`
- edit `src/viewer/Viewer.ts`
- update focused graph-native extrude tests in:
  - `src/worker/cad/featureStackRuntime.test.ts`
  - preview/viewer selector tests
- inspect `src/app/spaghetti/compiler/compileGraph.ts` only if upstream fidelity verification fails

Implementation steps:
1. confirm the current graph-native compile path is still preserving selected profile loop data as far as the worker runtime input, and only reopen `compileGraph.ts` if that check fails
2. define the minimum new `PartArtifact` variant needed to carry graph-native mesh geometry without flattening it to bounds
3. update shared validation and app-side worker result acceptance so graph-native mesh artifacts are allowed
4. update `buildModel.ts` so graph-native feature-stack bodies stop being converted only through bounds-box artifacts
5. update `Viewer.ts` so graph-native preview artifacts render their true geometry instead of always creating `BoxGeometry`
6. update preview/selectors/tests that currently assume all graph outputs are boxes, keeping this layer narrow because it is mostly pass-through mapping
7. verify the irregular `Sketch Draw` profile case through the full `Sketch -> Extrude -> Output Preview` path plus rectangle and circle regressions

Behavior-preservation rules:
- do not widen this fix into the broader `EWR` rollout
- do not redesign `Geometry/Sketch` node UX in this phase
- do not replace the current selected-profile model as part of this bug fix
- do not mix in new draw-command, snap, or toolbar work

Verification:
- run graph/compiler verification so the old handoff bug stays closed
- run shared contract / dispatcher validation tests affected by the new artifact variant
- run worker/runtime tests that cover graph-native extrude output
- run preview/viewer tests touched by the new artifact shape
- manually verify:
  - create an irregular closed `PLine` profile in `Sketch Draw`
  - select the intended `SketchProfile`
  - route it into `Geometry/Extrude`
  - route extrude output into `System/OutputPreview`
  - confirm the extruded body matches the original authored 2D loop
  - also confirm no regression for:
  - rectangle profile extrusion
  - circle profile extrusion
  - simple line-based closed profile extrusion

Definition of done:
- graph-native extrude results are no longer forced through a box-only preview artifact
- the viewer can render the true graph-native extruded shape
- irregular `Sketch Draw` profiles preview as the correct body shape while the old upstream handoff bug remains closed

# Nodes Phase 3.2A-0.1 - Sketch To Extrude To Preview Contract Repair

## Doc Header

### Doc History
3. 2026-03-23 13:50: Shipped `[3.2A-0.1]` by widening the shared preview artifact contract to support graph-native mesh outputs, updating the worker build-model and viewer preview path so compiled `Geometry/Sketch -> Geometry/Extrude` builds stop collapsing to bounds boxes, and validating the repair with focused shared/dispatcher/runtime/pipeline tests plus a production build
2. 2026-03-23 13:32: Refreshed this future repair phase after shipping `[5.3A-2]`, tightening the plan around the actual remaining `worker mesh -> PartArtifact -> Viewer` seam, demoting the older sketch-profile-handoff suspicion to a verification checkpoint instead of the main diagnosis, and naming the concrete shared/result/viewer tests and validators that now gate the fix
1. 2026-03-23 11:08: Created this standalone future phase doc for `[3.2A-0.1]`, translating the newly confirmed sketch-to-extrude-to-preview fidelity gap into an implementation-ready contract-repair plan around the graph-native compile seam, box-only artifact flattening, and viewer preview shape

### Purpose

This doc defines the immediate post-foundation cleanup under the `[3.2A]` family.

Use it to answer:
- where the current `Sketch -> Extrude -> Output Preview` path is still losing shape fidelity
- which seam should be fixed first
- which files own the graph-native geometry contract today
- how to keep this repair narrow before the broader `EWR` rollout begins

### Why This Phase Exists

The shipped `[3.2A-0]` foundation proved the first real geometry type language and the first `Geometry/Sketch` shell, but it did not fully prove an honest end-to-end `Sketch Draw -> SketchProfile -> Geometry/Extrude -> Output Preview` shape path.

Current code truth now shows:

- the old graph-native sketch-profile handoff bug has already been repaired enough that selected profile loop data can survive into graph-native extrusion more honestly than before
- `[5.3A-2]` already shipped the canonical graph-native request path, so this repair no longer needs to fight the old `payload: BoxParams` request seam
- but the build/output side still collapses the resulting geometry back into a box-only artifact and a box-only viewer preview

This phase exists to repair that gap before the later `EWR` work starts building more node hierarchy on top of a geometry result path that is still not truthful.

### Scope

This phase covers:
- repairing the graph-native `Geometry/Sketch -> Geometry/Extrude` contract where the selected profile shape still degrades
- replacing or bypassing the current box-only artifact flattening for graph-native extrude preview
- making `Output Preview` capable of showing the true extruded shape for graph-native geometry nodes
- verifying irregular `PLine`-based sketch profiles survive honestly through preview

This phase does not cover:
- the broader `EWR` rollout
- new sketch draw tools or new snap families
- general 3D viewport picking
- browser hierarchy redesign
- richer per-part build bars or later worker packaging beyond what this repair needs

## Doc Body

## [x] - `[3.2A-0.1]` - `Sketch To Extrude To Preview Contract Repair`

### Header

Purpose:
- make the current graph-native geometry path truthful enough that irregular `Sketch Draw` profiles can reach preview as the real extruded shape

Owns:
- graph-native sketch-profile compile fidelity
- graph-native extrude preview artifact shape
- viewer preview support for non-box graph-native extrude output

Does not own:
- `EWR`
- sketch draw command growth
- worker build-bar semantics
- Browser output hierarchy growth

### Current Seam Read

- `Geometry/Sketch` computes derived profiles from real authored sketch components in:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
- graph evaluation carries the selected `SketchProfile` in:
  - `src/app/spaghetti/compiler/evaluateGraph.ts`
- graph-native extrude compile currently routes through:
  - `src/app/spaghetti/compiler/compileGraph.ts`
- the old `loop.segments: []` graph-native handoff suspicion in `compileGraph.ts` is no longer the primary read; the current compile path should be treated as a verification checkpoint, not the default target seam
- runtime extrusion currently happens in:
  - `src/worker/cad/featureStackRuntime.ts`
  - `src/worker/cad/cadKernelAdapter.ts`
- the current runtime is not Replicad-backed here; it is using the local stub CAD adapter path
- after runtime, the build/output path currently flattens shape back into a bounds box in:
  - `src/worker/buildModel.ts`
- shared output artifacts are still box-only in:
  - `src/shared/buildTypes.ts`
- app-side worker result validation is still box-only in:
  - `src/app/buildDispatcher.ts`
- the viewer still renders graph build outputs as boxes in:
  - `src/viewer/Viewer.ts`
- preview selectors currently carry `PartArtifact` through mostly as pass-through mapping and are not the primary blocker:
  - `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - `src/app/spaghetti/viewer/selectPreviewRenderList.ts`

Current strongest read:
- the old profile-handoff bug was real, but it is no longer the main remaining defect
- the graph-native worker path can now preserve more real sketch shape internally
- the build/result/viewer contract still hides that shape by reducing it to a box-only artifact and box-only preview mesh

### Questions / Decisions

#### [x] - `q1` What is the primary remaining broken seam?

##### Suggestion
- treat the primary remaining seam as `Shape3D mesh -> PartArtifact -> Viewer`
- not `Output Preview` UI alone
- not `EWR`

#### [x] - `q2` Should this phase introduce a true mesh-capable preview artifact for graph-native geometry?

##### Suggestion
- yes
- this is the first honest place to stop forcing graph-native extrudes through `PartArtifact.kind = 'box'`

#### [x] - `q3` Should this phase switch to Replicad?

##### Suggestion
- no
- keep this phase narrow
- repair fidelity using the current stub CAD runtime and a better result/preview contract first
- Replicad adoption, if desired later, should be a separate runtime phase

#### [x] - `q4` What is the first safe definition of done?

##### Suggestion
- an irregular closed `PLine` profile from `Sketch Draw` extrudes and previews as the actual authored silhouette
- the viewer no longer shows only a bounding box for that graph-native extrude result
- existing rectangle and circle cases do not regress

### Implementation Result

Files changed:
- `src/shared/buildTypes.ts`
- `src/shared/buildTypes.test.ts`
- `src/app/buildDispatcher.test.ts`
- `src/worker/buildModel.ts`
- `src/viewer/Viewer.ts`
- `src/worker/cad/featureStackRuntime.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`

Shipped changes:
1. `src/shared/buildTypes.ts` now supports a mesh-capable `PartArtifact` variant and validates graph-native mesh payloads alongside the existing box artifact path.
2. `src/worker/buildModel.ts` now emits merged mesh artifacts for compiled graph-native feature-stack bodies while preserving the legacy box-backed path for non-graph-native builds.
3. `src/viewer/Viewer.ts` now renders mesh artifacts through `BufferGeometry`, preserving the current viewer axis convention instead of forcing graph-native extrudes through `BoxGeometry`.
4. `src/app/buildDispatcher.test.ts`, `src/shared/buildTypes.test.ts`, `src/worker/cad/featureStackRuntime.test.ts`, and `src/worker/pipeline/buildPipeline.test.ts` now guard the widened result contract and the graph-native mesh preview path.
5. The compile-path concern in `compileGraph.ts` stayed as a verification checkpoint only; this phase did not reopen the upstream sketch-profile contract because the downstream result seam was the actual blocker.

Behavior-preservation rules:
- do not widen into `EWR`
- do not redesign `Sketch Draw`
- do not widen into general Browser/project output hierarchy work
- do not replace the entire worker/runtime system in this phase
- keep legacy box-backed part nodes working while graph-native extrude preview gains truthful geometry

Verification:
- `npm.cmd test -- --run src/shared/buildTypes.test.ts src/app/buildDispatcher.test.ts src/worker/cad/featureStackRuntime.test.ts src/worker/pipeline/buildPipeline.test.ts`
- `npm.cmd run build`
- manual verification still recommended for:
  - irregular `PLine` sketch profile -> `Geometry/Extrude` -> `Output Preview`
  - rectangle profile extrusion
  - circle profile extrusion
  - no regression for existing box-backed preview parts

Definition of done:
- graph-native extrude results are no longer forced through a box-only preview artifact
- the viewer can render the true graph-native extruded shape
- the code path for `Sketch Draw` irregular profiles now publishes real extrude mesh through preview instead of a bounding-box stand-in

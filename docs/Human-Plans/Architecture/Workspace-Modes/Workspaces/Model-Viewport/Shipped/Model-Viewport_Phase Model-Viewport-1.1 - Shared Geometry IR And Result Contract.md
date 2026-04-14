# `Model-Viewport-1.1` - `Shared Geometry IR And Result Contract`

## Doc Header

### Doc History
10. 2026-04-06 16:08: Closed `Model-Viewport 1.1 Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup` after preserving retained geometry across later bundle-only accepted results, moving the retained geometry-result contract onto a neutral shared seam in `src/shared/geometryResult.ts`, and tightening the remaining `1.1` close-out boundary before `1.2`
9. 2026-04-06 14:09: Closed `Model-Viewport 1.1 Phase 4 - Retained Result Adoption And Boundary Cleanup` after threading the retained geometry-result bundle through the live worker -> build-result -> accepted graph-runtime path, narrowing the retained contract to the current honest `draft + ok` producer truth, and decoupling the retained result layer from direct worker mesh/body type ownership through contract-owned geometry payload types
8. 2026-04-06 13:54: Reopened `Model-Viewport 1.1` with a new `Phase 4 - Retained Result Adoption And Boundary Cleanup`, tightened that follow-up into an implementation-ready cleanup slice, and locked the narrow close-out work needed after review showed the new retained geometry-result bundle exists but is not yet truly retained by the live build path, still over-claims unsupported statuses/classes, and remains too coupled to the current mesh-first worker types
7. 2026-04-06 13:46: Closed `Model-Viewport 1.1 Phase 3 - Shared Geometry Result Contract` after extracting a shared retained `GeometryResultBundle`, adapting raw `executeFeatureStack(...)` output into that bundle before foothook artifact emission, threading request identity through the retained layer, and making the raw-worker -> retained-result -> artifact/build-output boundary explicit enough for `1.2` and `1.3` to inherit
6. 2026-04-06 13:34: Tightened `Model-Viewport 1.1 Phase 3 - Shared Geometry Result Contract` into an implementation-ready result-definition slice by grounding the next contract in the actual `executeFeatureStack -> foothookCompatibilityAdapter -> artifactEmitter -> BuildResultBundle` chain, locking the recommendation that a retained geometry-result bundle should sit between raw worker geometry and artifact/output routing, and naming the first result fields, identity rules, and downstream adapter boundaries `1.2` and `1.3` should inherit
5. 2026-04-06 13:25: Closed `Model-Viewport 1.1 Phase 2 - Shared Geometry Request / IR Contract` after extracting a canonical `GeometryRequestPayload` contract above both compile paths, aligning executable `sketch` and `extrude` ops to that shared family while keeping `closeProfile` compile-local, repointing `compileGraph` packaging plus the draft worker runtime to consume the extracted request shape, and preserving authored graph-native taper meaning instead of zeroing it before execution
4. 2026-04-06 13:09: Tightened `Model-Viewport 1.1 Phase 2 - Shared Geometry Request / IR Contract` into an implementation-ready contract-definition slice by locking the next request family to a new extracted geometry-execution contract above both current compile paths, naming the first canonical payload shape, and grounding the scope in the exact compile, packaging, and parity seams that must change before draft and authoritative execution can share one authored request truth
3. 2026-04-06 12:57: Closed `Model-Viewport 1.1 Phase 1 - Current Seam Audit` after tracing the live geometry request path from `compileFeatureStack` and the direct graph-native `Geometry/Extrude` compile fork through runtime packaging, build-request translation, worker execution, compatibility artifact emission, and preview consumption, which locked the current request seam map, result seam map, identity map, and first drift list strongly enough to hand the family forward into `Phase 2 - Shared Geometry Request / IR Contract`
2. 2026-04-06 12:54: Tightened `Model-Viewport 1.1 Phase 1 - Current Seam Audit` into an implementation-ready contract-audit slice by grounding it in the actual compile, worker, build-request, and preview-consumption seams, locking the exact outputs that audit must produce, and naming the first known request/result drift points the repo needs captured before `Phase 2` and `Phase 3` can safely define new shared contracts
1. 2026-04-06 12:49: Carved `Model-Viewport 1.1` out of the broader `Model-Viewport-1` umbrella so the foundational geometry-contract work now has its own dedicated planning surface, and split that child into `Phase 1 - Current Seam Audit`, `Phase 2 - Shared Geometry Request / IR Contract`, and `Phase 3 - Shared Geometry Result Contract` before viewport-swap or authoritative-build implementation widens further

### Purpose

Use this doc as the dedicated planning and execution surface for the `Model-Viewport-1 / Task 1` geometry-contract ladder.

The goal here is:
- first audit the current compile, worker, and viewport seams
- then lock one shared geometry request / IR contract
- then lock one shared geometry result contract
- then harden retained-result adoption and boundary honesty enough that later viewport/export work is not built on a half-adopted contract
- then hand the viewport-swap and authoritative-build work forward to `Model-Viewport-1.2` and `Model-Viewport-1.3` without letting those children invent sidecar request/result shapes

### Scope

This phase family covers:
- the current graph compile to worker geometry request seam
- the current worker result to viewport/export seam
- the naming and meaning of geometry result classes such as:
  - `draft`
  - `authoritative`
- identity, cancellation, staleness, and replacement rules needed before two-speed execution can stay sane

This phase family does not cover:
- the final viewport display-state and swap policy itself
- the final authoritative engine/library choice by itself
- the final export UI
- deeper camera-control behavior

## Doc Body

### Summary

`Model-Viewport-1.1` is now the dedicated geometry-contract ladder for the `Model Viewport` overhaul.

Current baseline:
- `Model-Viewport-1` already locked the larger direction:
  - shared geometry request contract
  - shared geometry result contract
  - `Auto / Draft / Final` viewport policy
  - later authoritative geometry and export handoff
- this child is the foundation under that whole ladder
- `Phase 1 - Current Seam Audit` is now shipped
- the current code already proves:
  - graph compile can emit runtime-facing geometry payloads
  - the worker can execute them into fast mesh-first results
  - the viewport can display those results quickly
- what is still missing is one explicit contract family shared by:
  - draft preview
  - authoritative geometry
  - later export handoff

Locked recommendation:
- keep this child doc focused on contracts, not viewport polish
- treat the audit as shipped groundwork
- treat `Phase 2 - Shared Geometry Request / IR Contract` as shipped groundwork
- treat `Phase 3 - Shared Geometry Result Contract` as shipped groundwork
- treat `Phase 4 - Retained Result Adoption And Boundary Cleanup` as shipped close-out groundwork
- treat `Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup` as shipped final close-out groundwork
- `Model-Viewport 1.1` can now hand forward into `1.2` without leaving the retained-result adoption gap implicit

Why this order is healthier:
- the repo already has a useful fast path, so the next risk is not "can it build anything?"
- the next risk is contract drift
- if draft preview and authoritative geometry do not share one request/result family, every later viewport/export choice gets harder to unwind

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/compiler/compileGraph.ts`
  - now packages graph-authored geometry into the extracted `GeometryRequestPayload`
  - is the seam where both feature-stack and direct graph-native compile sources now converge before build/output routing
- `src/app/spaghetti/features/compileFeatureStack.ts`
  - now aligns executable `sketch` and `extrude` ops with the extracted shared request family while keeping `closeProfile` compile-local
  - is still the clearest reminder that compile-only helpers and execution-boundary ops should remain different surfaces
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - now owns the canonical request payload, op, profile, and validator types shared across compile and runtime
  - is the new file-backed proof that the request family no longer lives privately inside one compiler or executor module
- `src/shared/geometryResult.ts`
  - now owns the canonical retained geometry-result contract for worker, shared transport, and app/runtime consumers
  - is the strongest proof that the retained result boundary no longer depends upward on app-only contract ownership
- `src/worker/cad/featureStackRuntime.ts`
  - now validates and executes the extracted shared request family instead of a narrower private runtime payload
  - is still the main seam where result-class and authoritative-versus-draft ownership remain implicit
- `src/worker/cad/cadKernelAdapter.ts`
  - already builds the current mesh-first geometry
  - proves the draft path can be fast, but also shows how narrow the current result contract is
- `src/worker/cad/cadTypes.ts`
  - already defines the current mesh-first result shape
  - is the strongest proof that later authoritative geometry cannot just be bolted on without a clearer result family
- `src/viewer/stepReferenceLoader.ts`
  - already proves the app can consume imported STEP geometry
  - is the clearest reminder that import-side CAD handling and authored graph-side geometry execution are still separate seams today
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - now explicitly require preview meshes and clean export outputs to stay downstream from one executed geometry truth

### Phase Breakdown

1. `Model-Viewport 1.1 Phase 1 - Current Seam Audit`
Reason:
- before the repo names a new request/result contract, it needs one explicit read of the actual compile, worker, viewport, and export-adjacent seams that exist today
Current status:
- shipped in this doc

2. `Model-Viewport 1.1 Phase 2 - Shared Geometry Request / IR Contract`
Reason:
- once the real current seams are audited, the next honest task is locking the neutral request shape that both draft and authoritative geometry must consume
Current status:
- shipped in this doc

3. `Model-Viewport 1.1 Phase 3 - Shared Geometry Result Contract`
Reason:
- after the request side is explicit, the remaining foundational task is locking the result bundle, result-class naming, and identity/staleness/cancellation rules that downstream viewport and export surfaces must share
Current status:
- shipped in this doc

4. `Model-Viewport 1.1 Phase 4 - Retained Result Adoption And Boundary Cleanup`
Reason:
- after the retained result bundle exists, the repo still needs one narrow close-out pass so that bundle is actually retained by the live build path, only claims statuses/classes the runtime can truly produce today, and stops coupling the neutral result contract too tightly to the current mesh-first worker types
Current status:
- shipped in this doc

6. `Model-Viewport 1.1 Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup`
Reason:
- after `Phase 4`, one last compatibility hole still remained where bundle-only accepted results could wipe retained geometry and the shared transport seam still depended upward on an app-owned contract path
Current status:
- shipped in this doc

## [x] Model-Viewport 1.1 Phase 1 - Current Seam Audit

### Summary

#### Purpose:
- audit the current compile, worker, and viewport seams before locking new request/result contracts

#### Shipped audit result:
- `src/app/spaghetti/features/compileFeatureStack.ts` already defines the richest current authored geometry contract:
  - sketch plane and plane transform
  - profile references
  - extrude type
  - depth
  - taper
  - offset
- `src/app/spaghetti/compiler/compileGraph.ts` is not only an adapter:
  - it also owns a second direct graph-native `Geometry/Extrude` compile seam through `buildGeometryExtrudeOps(...)`
  - that seam currently hardcodes `taperResolved: 0` and `offsetResolved: 0`
  - so authored extrude meaning is already split before the worker sees it
- `src/worker/cad/featureStackRuntime.ts` validates and executes a narrower runtime `IRExtrude` than the richer feature-stack compile surface:
  - direction and depth survive
  - taper and offset do not
  - result-class naming such as `draft` versus `authoritative` does not exist yet
- `src/worker/cad/cadTypes.ts` plus `src/worker/cad/cadKernelAdapter.ts` prove the current worker result is mesh-first:
  - `Shape3D` owns `mesh`
  - `ExecuteFeatureStackResult` owns `mergedMesh`
  - no B-rep handle or authoritative geometry placeholder exists
- viewport-adjacent consumption still reads through part/build artifacts rather than a shared geometry result family:
  - `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
  - those seams still assume `partKey -> artifact/renderable` more strongly than `geometry request -> geometry result bundle`

#### Locked audit output:

##### Current request seam map:
1. `src/app/spaghetti/features/compileFeatureStack.ts`
   - compiles feature-stack-authored operations into the richest current `FeatureStackIR`
   - preserves:
     - profile references
     - plane/plane transform
     - extrude type
     - depth
     - taper
     - offset
2. `src/app/spaghetti/compiler/compileGraph.ts`
   - `computeFeatureStackIrParts(...)` owns part-key routing and mixes two authored geometry sources:
     - compiled feature stacks from part nodes
     - direct graph-native `Geometry/Extrude` ops from `buildGeometryExtrudeOps(...)`
   - `buildGeometryExtrudeOps(...)` is a real compile fork, not only a thin adapter
   - that direct fork currently preserves:
     - profile reference
     - extrude type
     - direction
     - depth / start depth / end depth
     - plane / plane transform
   - that direct fork currently drops authored taper/offset by emitting:
     - `taperResolved: 0`
     - `offsetResolved: 0`
3. `src/app/spaghetti/compiler/compileGraph.ts`
   - `toRuntimeFeatureStackParts(...)` narrows the richer compile-side operations into the runtime payload stored as:
     - `buildInputs.resolvedShared.sp_featureStackIR`
4. `src/app/spaghetti/integration/buildInputsToRequest.ts`
   - lifts the packaged runtime payload into `CompiledBuildData`
   - adds preview/output routing identity such as:
     - `buildUnitId`
     - `outputEntryId`
     - `sourceNodeId`
     - `partKey`
   - this is the seam where geometry request meaning is already mixed with build/output routing meaning
5. `src/worker/cad/featureStackRuntime.ts`
   - validates the runtime payload with `isFeatureStackIRPayload(...)`
   - executes the narrowed runtime request, not the richer compile-side contract directly

##### Current result seam map:
1. `src/worker/cad/featureStackRuntime.ts`
   - `executeFeatureStack(...)` returns the first real geometry execution result bundle:
     - `bodies`
     - `mergedMesh`
     - `diagnostics`
     - `bodyTrace`
2. `src/worker/cad/cadTypes.ts`
   - defines that geometry bundle as mesh-first through:
     - `Shape3D.mesh`
     - `MeshPack`
     - `RuntimeTraceBody`
3. `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
   - immediately collapses worker geometry results into per-part merged mesh `PartArtifact[]`
   - this is the current compatibility seam where geometry-execution truth becomes artifact truth
4. `src/worker/pipeline/artifactEmitter.ts`
   - wraps `PartArtifact[]` into a downstream `BuildResultBundle`
   - this is the current app-facing result family:
     - not the worker geometry bundle directly
     - not a geometry-result contract that can carry both draft and authoritative geometry
5. `src/app/spaghetti/previewPreparation.ts` and `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
   - consume preview through:
     - `PartArtifact[]`
     - `slotId`
     - `sourceNodeId`
     - `partKey`
   - the viewport currently routes artifacts/results by output-preview topology and part-key lookup rather than by one retained geometry-result bundle

##### Locked drift list:
1. Compile-side authored geometry meaning is already split between:
   - richer feature-stack compile
   - direct graph-native `Geometry/Extrude` compile
2. The direct graph-native extrude compile fork drops authored taper/offset before runtime by hardcoding zeros.
3. Runtime `IRExtrude` is narrower than compile-side `IRExtrude`, so request meaning is flattened before execution rather than only adapted at engine boundaries.
4. The first real geometry-execution result bundle exists in the worker, but the app-facing result family is currently:
   - `PartArtifact[]`
   - `BuildResultBundle`
   rather than a shared geometry-result contract.
5. Preview currently consumes routed artifacts, not retained geometry execution truth, which makes later `draft` versus `authoritative` result-class design a real contract change rather than a label-only rename.

##### Locked identity audit:
- `featureId`
  - operation identity inside compile and worker execution
- `bodyId`
  - logical body identity inside extrude/runtime output
- `bodyKey`
  - runtime-only unique key: `partKey:bodyId`
- `partKey`
  - the main bridge identity between compile, compatibility artifact emission, and preview routing
- `sourceNodeId`
  - output-preview and build-output routing identity, not worker body identity
- `slotId`
  - output-preview viewport routing identity only
- `buildUnitId`
  - downstream build/output identity added after compile for result-bundle routing

#### Locked carry-forward read:
- `Phase 2 - Shared Geometry Request / IR Contract` must decide whether the future canonical request starts from:
  - the richer feature-stack compile surface
  - or a new extracted shared contract above both compile paths
- `Phase 2` must stop the direct graph-native compile fork from silently dropping authored meaning.
- `Phase 3 - Shared Geometry Result Contract` must decide whether the future canonical result starts from:
  - worker geometry execution truth
  - or a new retained bundle that can reference both geometry payloads and downstream artifact views
- `Phase 3` must separate geometry-result identity from build-output routing identity instead of letting `partKey` and `buildUnitId` blur those roles forever.

### Questions / Decisions

#### [x] Question 1 - Which current files define the active geometry request seam today?

##### Locked answer
- graph compile seam
- feature-stack compile seam
- worker request seam
- build-request packaging seam

##### Locked files
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/cad/featureStackRuntime.ts`

#### [x] Question 2 - Where does authored geometry meaning already drift before the worker executes?

##### Locked answer
- direct graph-native extrude compile versus feature-stack compile
- fields preserved in one seam but dropped in another
- where flattening already happens too early

##### Locked drift points
- `buildGeometryExtrudeOps(...)` hardcodes taper/offset to zero
- runtime `IRExtrude` is narrower than compile-side `IRExtrude`
- build-request packaging already mixes geometry payload and downstream output routing concerns

#### [x] Question 3 - Which current files define the active geometry result seam today?

##### Locked answer
- worker result bundle
- mesh/result types
- viewport consumption seams
- any export-adjacent read paths that already assume mesh-first truth

##### Locked files
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/shared/buildTypes.ts`

#### [x] Question 4 - Which identity keys already exist across compile, worker, build, and preview seams?

##### Locked answer
- `partKey`
- `featureId`
- `bodyId`
- `bodyKey`
- `sourceNodeId`
- `slotId`
- `buildUnitId`
- which of those are request identity versus result identity versus viewport routing only

##### Locked role read
- `featureId`, `bodyId`, and `bodyKey` currently belong closest to geometry execution truth
- `partKey` currently bridges both geometry ownership and downstream artifact routing
- `sourceNodeId`, `slotId`, and `buildUnitId` are downstream output-routing identities, not canonical geometry identities

### Implementation Spec

Likely files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/cadTypes.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/shared/buildTypes.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- `src/worker/pipeline/artifactEmitter.ts`

Shipped implementation:
1. Audited the current request side from authored graph meaning to worker payload across:
   - `compileFeatureStack(...)`
   - `computeFeatureStackIrParts(...)`
   - `buildGeometryExtrudeOps(...)`
   - `toRuntimeFeatureStackParts(...)`
   - `buildInputs.resolvedShared.sp_featureStackIR`
2. Audited the runtime execution seam across:
   - `isFeatureStackIRPayload(...)`
   - local runtime `IRExtrude`
   - `executeFeatureStack(...)`
3. Audited the current result side from geometry execution to app-facing artifacts across:
   - `ExecuteFeatureStackResult`
   - `Shape3D`
   - `MeshPack`
   - `RuntimeTraceBody`
   - `buildFoothookCompatibleArtifacts(...)`
   - `emitArtifacts(...)`
4. Audited the current build/preview consumption seam across:
   - `buildRequestFromBuildInputs(...)`
   - `prepareGraphPreviewPreparation(...)`
   - `selectPreviewRenderList(...)`
   - `PartArtifact`
   - `BuildResultBundle`
5. Locked the first explicit seam map, drift list, and identity map in this phase doc so later request/result contract work can start from file-backed evidence instead of memory.

Scope honored:
- keep this phase limited to current-state seam mapping
- do not choose the final B-rep engine here
- do not define `Auto / Draft / Final` viewport behavior beyond what must be audited as an upstream dependency
- do not widen into export UI or camera-control design

Shipped verification:
- verified the request seam against:
  - `src/app/spaghetti/features/compileFeatureStack.ts`
  - `src/app/spaghetti/compiler/compileGraph.ts`
  - `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - `src/worker/cad/featureStackRuntime.ts`
- verified the result seam against:
  - `src/worker/cad/cadTypes.ts`
  - `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
  - `src/worker/pipeline/artifactEmitter.ts`
  - `src/shared/buildTypes.ts`
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- no runtime tests were needed because this phase shipped as a code-backed architecture audit and docs update only

Definition of done:
- the repo has one explicit seam audit for current request and result ownership
- the audit names the exact active files and exact ownership boundaries instead of generic layer labels alone
- the audit records the current graph-native `Geometry/Extrude` compile fork and the current mesh-first worker result as first-class facts
- the audit records the current identity keys already flowing across compile, worker, build, and preview seams
- the audit records that the app-facing result family is currently `PartArtifact[]` plus `BuildResultBundle`, not the worker geometry bundle directly
- the next phase can lock contracts against the real code instead of memory or assumptions

## [x] Model-Viewport 1.1 Phase 2 - Shared Geometry Request / IR Contract

### Summary

#### Purpose:
- lock the neutral geometry request / IR contract between graph-authored truth and geometry execution

#### Current strongest read:
- the repo already has two compile-side request sources:
  - richer feature-stack compile in `src/app/spaghetti/features/compileFeatureStack.ts`
  - direct graph-native `Geometry/Extrude` compile in `src/app/spaghetti/compiler/compileGraph.ts`
- neither of those current shapes should become the permanent request contract by accident
- the audit proved the request family must be extracted above both current compile paths because:
  - the direct graph-native compile fork is already dropping authored taper/offset
  - build-request packaging already mixes geometry request meaning with build/output routing identity
  - runtime payload validation in `src/worker/cad/featureStackRuntime.ts` is already narrower than the richer compile surface
- the healthiest first contract is therefore:
  - geometry-execution-first
  - not mesh-preview-first
  - not artifact-routing-first
  - still simple enough that the current draft mesh runtime can consume it with an adapter

#### Shipped implementation result:
- `src/app/spaghetti/contracts/geometryRequest.ts` now owns the canonical execution-boundary request family:
  - `GeometryRequestPayload`
  - `GeometryRequestOp`
  - `GeometryRequestSketchOp`
  - `GeometryRequestExtrudeOp`
  - shared profile/reference shapes
  - request-payload validation
- `src/app/spaghetti/features/compileFeatureStack.ts` now aligns executable `sketch` and `extrude` ops with that shared request family while keeping `closeProfile` local to compile/UI reads
- `src/app/spaghetti/compiler/compileGraph.ts` now packages `buildInputs.resolvedShared.sp_featureStackIR` as the extracted shared request payload instead of inventing a second private runtime-only shape
- the direct graph-native `Geometry/Extrude` compile fork now preserves authored taper meaning through `taperResolved` instead of silently forcing zero when node params or resolved inputs provide a real value
- `src/worker/cad/featureStackRuntime.ts` now validates and executes the extracted shared request family directly, adapting profile loops into draft mesh wires at runtime instead of flattening the request contract down to preview-only vertices at compile time

#### Locked direction:
- define one shared geometry request / IR family extracted above both current compile paths
- make that extracted contract the canonical compile target before:
  - worker execution
  - build-output routing
  - artifact emission
- preserve authored operation meaning strongly enough that authoritative geometry does not have to reconstruct intent from preview-mesh-only assumptions
- keep the contract neutral enough that both fast draft and authoritative execution can consume it
- keep compile-only helpers such as `closeProfile` out of the execution contract once they have been resolved into executable references

#### Locked recommendation:
- do not treat `FeatureStackIR` as the permanent shared request family just because it is currently the richer compile surface
- instead extract a new nearby shared contract and make:
  - feature-stack compile emit it
  - direct graph-native `Geometry/Extrude` compile emit it
  - `compileGraph` package that extracted contract into the build request
- keep downstream build/output routing identity such as:
  - `buildUnitId`
  - `outputEntryId`
  - `sourceNodeId`
  out of the geometry request contract itself

#### Locked first contract shape:
- `schemaVersion`
- `parts: Record<partKey, GeometryRequestOp[]>`
- first executable ops only:
  - `sketch`
  - `extrude`
- first sketch op preserves:
  - `featureId`
  - `plane`
  - `planeTransform`
  - resolved profiles with:
    - `profileId`
    - `profileIndex`
    - `area`
    - `loop`
    - `verticesProxy`
- first extrude op preserves:
  - `featureId`
  - `profileRef`
  - `extrudeType`
  - `extrudeDirection`
  - `depthResolved`
  - `startDepthResolved`
  - `endDepthResolved`
  - `taperResolved`
  - `offsetResolved`
  - `plane`
  - `planeTransform`
  - `bodyId`

#### Why this shape is the current best fit:
- it starts from already-proven authored meaning instead of inventing a brand new CAD vocabulary too early
- it is richer than the current runtime payload where it needs to be
- it is still narrow enough that the current draft executor can adapt to it without requiring the authoritative engine to exist first
- it stops preview-only flattening from becoming the canonical compile contract

### Questions / Decisions

#### [x] Question 1 - What authored meaning must the request contract preserve?

##### Locked answer
- operation identity
- authored parameter meaning
- source/profile/body references
- transform/placement truth
- enough kernel-facing meaning to survive beyond the first draft mesh path

##### Locked preservation rules
- preserve resolved executable geometry meaning, not raw UI state
- preserve profile loops and not only tessellated preview vertices
- preserve extrude direction, taper, and offset whenever authored or resolved
- preserve explicit body/profile references instead of forcing later engines to recover them from part-level meshes
- preserve part ownership through `partKey`, but do not let part/build routing ids define the operation contract itself

#### [x] Question 2 - How should graph-native and feature-stack compile seams relate to this request contract?

##### Locked answer
- one canonical request family or explicit compatibility layer
- where adapters are allowed
- where flattening is forbidden

##### Locked relationship rule
- both compile paths must emit one canonical geometry request family
- adapters are allowed:
  - from feature-stack authored data into the shared request family
  - from direct graph-native node data into the shared request family
  - from the shared request family into the current draft mesh runtime while that runtime remains transitional
- flattening is forbidden:
  - from profile loops into preview-only vertices as the only preserved shape truth
  - from authored taper/offset into zero defaults just because the current draft runtime does not honor them yet
  - from geometry request identity into build-output routing identity

#### [x] Question 3 - What should the first extracted contract be named and where should it live?

##### Locked recommendation
- use a new shared geometry-contract file near the existing compile/runtime seam, not inside one current executor module

##### Suggested first names
- `GeometryRequestPayload`
- `GeometryRequestPart`
- `GeometryRequestOp`
- `GeometryRequestSketchOp`
- `GeometryRequestExtrudeOp`

##### Suggested first home
- a new shared contract file under `src/app/spaghetti` or a nearby shared compile/worker seam
- do not leave the canonical type trapped inside:
  - `compileFeatureStack.ts`
  - `compileGraph.ts`
  - `featureStackRuntime.ts`

### Implementation Spec

Likely files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/features/compileFeatureStack.ts`
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`

Shipped implementation:
1. Added `src/app/spaghetti/contracts/geometryRequest.ts` and moved the canonical execution-boundary request types plus validator there.
2. Repointed `compileFeatureStack(...)` so executable `sketch` and `extrude` ops now align with that extracted contract instead of owning a private compile-only request family.
3. Reworked the direct graph-native `Geometry/Extrude` compile path in `compileGraph.ts` so it emits the same extracted request ops and now preserves authored taper meaning instead of hardcoding `taperResolved: 0`.
4. Replaced the private runtime-packaging narrowing in `compileGraph.ts` so the value stored under `buildInputs.resolvedShared.sp_featureStackIR` is now the extracted shared request family with loops, `verticesProxy`, and `profileIndex` preserved.
5. Reworked `src/worker/cad/featureStackRuntime.ts` so the draft mesh runtime now consumes the extracted request family directly and derives previewable profile vertices from the preserved loop/`verticesProxy` shape at execution time.
6. Added contract/parity proof in:
   - `src/app/spaghetti/compiler/compileGraph.test.ts`
   - `src/worker/cad/featureStackRuntime.test.ts`
   - `src/worker/pipeline/buildPipeline.test.ts`
   - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`

Scope honored:
- keep this phase on request-contract definition and compile-side adoption only
- do not define draft versus authoritative result bundles here
- do not widen into viewport swap policy or final export handoff
- do not require the authoritative engine to exist before the request family is locked

Focused verification target:
- one extracted shared request contract exists
- both current compile paths emit it
- the direct graph-native extrude path no longer silently drops authored meaning that the contract claims to preserve
- build-request packaging carries the shared request family without mixing in downstream result/output routing fields
- the current draft runtime still has a clear adapter path from that shared request family

Shipped verification:
- ran `npm.cmd exec vitest run src/app/spaghetti/compiler/compileGraph.test.ts src/worker/cad/featureStackRuntime.test.ts src/worker/pipeline/buildPipeline.test.ts src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- ran `./node_modules/.bin/tsc.cmd -b --pretty false`

Definition of done:
- the repo has one explicit shared geometry request / IR contract
- feature-stack compile and direct graph-native compile no longer invent separate execution request families
- the request contract preserves enough kernel-facing meaning that later authoritative geometry can consume it without reverse-engineering preview-only artifacts
- the request contract stays distinct from build-output routing and artifact/result ownership

## [x] Model-Viewport 1.1 Phase 3 - Shared Geometry Result Contract

### Summary

#### Purpose:
- lock the neutral geometry result contract between geometry execution and downstream viewport/export consumers

#### Current read:
- the current raw worker geometry result already exists in `src/worker/cad/featureStackRuntime.ts` as:
  - `bodies`
  - `mergedMesh`
  - `diagnostics`
  - `bodyTrace`
- that raw worker result is not the app-facing result family
- the next seam immediately collapses it through:
  - `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
    - geometry execution truth -> `PartArtifact[]`
  - `src/worker/pipeline/artifactEmitter.ts`
    - `PartArtifact[]` -> `BuildResultBundle`
- `src/shared/buildTypes.ts` already proves the app-facing result family is build/output-oriented:
  - `BuildResultBundle`
  - `BuildResultEntry`
  - `resultClass`
  - `buildUnitId`
  - `outputEntryId`
- that means the repo still has no retained geometry-result contract between:
  - raw worker geometry execution truth
  - downstream artifact/build-output routing truth
- this phase should define that missing retained geometry-result layer before `1.2` and `1.3` widen viewport swap or authoritative execution behavior

#### Shipped implementation result:
- `src/app/spaghetti/contracts/geometryResult.ts` now owns the shared retained geometry-result contract:
  - `GeometryResultBundle`
  - `GeometryResultRequestIdentity`
  - `draft / authoritative` result-class naming
  - `ok / failed / cancelled / stale` status naming
  - bundle validation and snapshot helpers
- `src/worker/products/foothook/buildFoothook.ts` now adapts raw `executeFeatureStack(...)` output into the retained `draft` geometry-result bundle instead of returning raw worker geometry directly to the next seam
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts` now makes the ownership boundary explicit through:
  - `buildFoothookRetainedGeometryResult(...)`
  - `buildFoothookCompatibleArtifactsFromRetainedGeometryResult(...)`
- `src/worker/buildModel.ts` now exposes `buildModelResult(...)` as the first retained-geometry-plus-artifact boundary while preserving `buildModel(...)` for existing artifact-only callers
- `src/worker/pipeline/buildPipeline.ts` now carries real `graphDocumentId` and `buildRequestId` into the retained geometry-result layer before downstream artifact/build-bundle emission

#### Locked direction:
- define one shared retained geometry-result bundle family above raw worker execution and below artifact/build-output routing
- do not treat `ExecuteFeatureStackResult` as the permanent app-facing result contract just because it is the first worker geometry payload
- do not treat `BuildResultBundle` as the permanent geometry result contract just because the app already accepts it
- keep one explicit adapter boundary:
  - raw worker geometry result
    -> retained geometry result bundle
    -> artifact/build-output bundle
- define explicit result classes such as:
  - `draft`
  - `authoritative`
- define identity, cancellation, staleness, and replacement rules on the retained geometry-result layer before those rules get blurred into `buildUnitId` and artifact-entry semantics
- keep viewport and export downstream from that same retained geometry-result truth

### Questions / Decisions

#### [x] Question 1 - What should the first shared result bundle contain?

##### Locked answer
- one retained geometry-result bundle should exist between raw worker geometry and downstream artifact/build routing
- that retained bundle should carry geometry identity and geometry-class truth first
- artifact/output routing should adapt from it later rather than define it

##### Locked first result shape
- `schemaVersion`
- `request`:
  - request-side geometry identity only
  - first shipped fields:
    - `graphDocumentId`
    - `buildRequestId`
    - `partKeys`
  - do not put `buildUnitId` or `outputEntryId` here
- `resultClass`
  - `draft`
  - `authoritative`
- `status`
  - `ok`
  - `failed`
  - `cancelled`
  - `stale`
- `bodies`
  - retained body-level geometry results keyed by geometry identity, not output-entry identity
- `meshPreview`
  - optional mesh payload for viewport use
- `diagnostics`
  - geometry-execution diagnostics, not console/build-row formatting
- `trace`
  - execution/body trace payload carried forward from worker execution
- `authoritativeHandle`
  - optional authoritative geometry handle or placeholder field
  - may be `null` in the first draft-only implementation

##### Locked naming rule
- use `draft` and `authoritative` on the retained geometry-result layer
- leave current downstream `BuildResultClass` (`transient / draft / final`) alone until adapters are explicitly widened
- do not overload `final` to mean both build acceptance and authoritative geometry

#### [x] Question 2 - How should staleness and cancellation be represented?

##### Locked answer
- staleness and cancellation should be represented on the retained geometry-result bundle itself, not inferred only from missing artifacts or superseded `BuildResultBundle` rows
- the retained geometry-result bundle should own replacement semantics before viewport swap behavior is built on top

##### Locked status rules
- `cancelled`
  - the requested geometry execution was intentionally abandoned before becoming the active retained result
- `stale`
  - the result completed, but a newer accepted request/result superseded it before downstream consumers should treat it as current
- `failed`
  - geometry execution ended without a usable retained result
- `ok`
  - geometry execution produced a usable retained result

##### Locked replacement rule
- the retained geometry-result layer should compare requests by request identity first
- downstream artifact/build-output layers can still choose whether they retain or evict entries, but they should not be the first owner of stale-versus-current geometry truth

##### Locked consumer rule
- `Model-Viewport-1.2` should consume the retained geometry-result family for viewport swap/state rules
- `Model-Viewport-1.3` should consume that same retained geometry-result family for authoritative geometry and export handoff
- do not make `1.2` read raw worker geometry while `1.3` reads a different retained bundle

### Implementation Spec

Likely files:
- `src/shared/geometryResult.ts`
- `src/app/spaghetti/contracts/geometryResult.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/worker/cad/cadTypes.ts`
- `src/worker/buildModel.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/shared/buildTypes.ts`

Shipped implementation:
1. Added the retained geometry-result contract as a first-class shared seam and now keep its canonical home at `src/shared/geometryResult.ts` with a thin app-side re-export wrapper for local callers that still read through `src/app/spaghetti/contracts/geometryResult.ts`.
2. Kept `src/worker/cad/featureStackRuntime.ts` as the raw worker execution seam, then adapted its `ExecuteFeatureStackResult` into the retained geometry-result layer instead of silently treating that raw worker payload as the permanent app-facing result family.
3. Reworked `src/worker/products/foothook/buildFoothook.ts` plus `src/worker/products/foothook/foothookCompatibilityAdapter.ts` so the current foothook path now reads:
   - raw worker execution
   - retained geometry result bundle
   - compatibility artifact emission
4. Added `buildModelResult(...)` in `src/worker/buildModel.ts` so worker callers now have one explicit retained-geometry-plus-artifact boundary even while `buildModel(...)` remains available for legacy artifact-only callers.
5. Reworked `src/worker/pipeline/buildPipeline.ts` so the build path now threads real request identity into the retained geometry-result layer before `emitArtifacts(...)` emits the downstream `BuildResultBundle`.
6. Added focused proof coverage in `src/worker/buildModel.test.ts` and kept regression proof alive through:
   - `src/worker/pipeline/buildPipeline.test.ts`
   - `src/worker/cad/featureStackRuntime.test.ts`

Scope honored:
- keep this phase on retained geometry-result contract definition and first ownership boundaries
- do not define viewport swap visuals here
- do not choose the final authoritative engine/library here
- do not widen into final export UI here

Focused verification target:
- one retained geometry-result contract exists between raw worker execution and downstream artifact/build-output routing
- result-class naming for `draft` versus `authoritative` lives on that retained geometry-result layer
- stale/cancelled/current result semantics are explicit before viewport swap behavior is built
- downstream artifact/build bundles remain adapters rather than the only durable geometry-result family

Shipped verification:
- ran `npm.cmd exec vitest run src/worker/buildModel.test.ts src/worker/pipeline/buildPipeline.test.ts src/worker/cad/featureStackRuntime.test.ts`
- ran `./node_modules/.bin/tsc.cmd -b --pretty false`

Definition of done:
- the repo has one explicit retained geometry-result contract above raw worker execution and below artifact/build-output routing
- `1.2` can lock viewport swap rules against that retained result family
- `1.3` can lock authoritative geometry and export handoff against that same retained result family

## [x] Model-Viewport 1.1 Phase 4 - Retained Result Adoption And Boundary Cleanup

### Summary

#### Purpose:
- make the retained geometry-result bundle truly adopted by the live build path before `1.2` or `1.3` starts depending on it

#### Shipped implementation result:
- `src/shared/buildTypes.ts` plus `src/worker/pipeline/artifactEmitter.ts` now let the live build-result message carry an optional retained `geometryResult` alongside the existing downstream `BuildResultBundle`
- `src/worker/pipeline/buildPipeline.ts` now threads the retained geometry result through that live build-result path instead of dropping it after artifact adaptation
- `src/app/buildDispatcher.ts`, `src/app/store/useAppStore.ts`, and `src/app/spaghetti/store/useSpaghettiStore.ts` now preserve and accept that retained geometry result through the real production request/result path, ending with graph-local accepted ownership in:
  - `acceptedGeometryResult`
  - `acceptedPreviewGeometryResult`
- `src/shared/geometryResult.ts` now narrows the retained contract to today's honest producer truth:
  - result class: `draft`
  - status: `ok`
- that same contract file now owns neutral geometry payload types:
  - `GeometryMesh`
  - `GeometryBody`
  - `GeometryDiagnostic`
  - `GeometryTraceBody`
  instead of importing the current worker `cadTypes.ts` mesh/body types directly
- `src/worker/products/foothook/buildFoothook.ts` now adapts raw worker execution into those contract-owned payload types before the retained result bundle is created
- focused proof now exists at:
  - `src/worker/pipeline/buildPipeline.test.ts`
  - `src/app/buildDispatcher.test.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### Locked result:
- the retained geometry result is now truly present in one live production-owned path
- retained result naming now matches current producer reality instead of claiming unsupported states/classes
- the retained result layer no longer reads as a thin alias of today's worker mesh/body types
- `Model-Viewport 1.1` is now honest enough to hand forward into `1.2`

### Questions / Decisions

#### [x] Question 1 - What exactly must become true before `1.1` can hand forward honestly?

##### Locked answer
- one live runtime owner must actually keep the retained geometry result
- result-class/status naming must match producer reality
- the neutral result contract must stop reading as a thin alias of the current worker mesh implementation

##### Locked close-out rules
- `buildPipeline` or a nearby accepted-build seam must retain the geometry result instead of immediately dropping it after artifact adaptation
- if the runtime only emits `draft + ok` today, the contract/docs should say that clearly unless this phase also adds real `failed / cancelled / stale / authoritative` producers
- the neutral retained result layer should move toward geometry-contract-owned types or an explicit adapter seam instead of importing draft-runtime mesh/body types as its foundational vocabulary

#### [x] Question 2 - What should stay out of this cleanup phase?

##### Locked answer
- viewport mode UI
- swap/render policy
- export UI
- final authoritative engine/library choice

##### Why
- this phase is meant to make `1.1` honest and handoff-safe, not to start `1.2` or `1.3` early

### Implementation Spec

Shipped implementation:
1. Reworked the live build-result path so the retained geometry result survives worker execution, artifact emission, dispatcher validation, app acceptance, and graph-runtime storage instead of disappearing before any production owner can keep it.
2. Narrowed `geometryResult.ts` so the retained contract only claims the current honest producer truth:
   - result class: `draft`
   - status: `ok`
3. Replaced direct retained-contract imports of worker `MeshPack`, `Shape3D`, `RuntimeDiagnostic`, and `RuntimeTraceBody` with contract-owned geometry payload types plus a one-way adaptation seam in `buildFoothook.ts`.
4. Added focused proof that the retained result is now kept in a real graph-runtime owner seam and remains isolated per graph document.

Scope honored:
- keep this phase on retained-result adoption and boundary cleanup only
- do not define `Auto / Draft / Final` viewport behavior here
- do not widen into authoritative kernel execution here
- do not widen into export UI or final export routing here

Shipped verification:
- ran `npm.cmd exec vitest run src/worker/buildModel.test.ts src/worker/pipeline/buildPipeline.test.ts src/app/buildDispatcher.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts`
- ran `./node_modules/.bin/tsc.cmd -b --pretty false`

## [x] Model-Viewport 1.1 Phase 6 - Bundle-Only Retention Guard And Shared Boundary Cleanup

### Summary

#### Purpose:
- close the last small `1.1` compatibility and boundary gaps before `1.2` starts depending on retained geometry more heavily

#### Shipped implementation result:
- `src/app/spaghetti/store/useSpaghettiStore.ts` now preserves:
  - `acceptedGeometryResult`
  - `acceptedPreviewGeometryResult`
  when a later accepted build result arrives without `geometryResult`, instead of silently wiping retained geometry during bundle-only compatibility flows
- the retained geometry-result contract now has a neutral canonical home at:
  - `src/shared/geometryResult.ts`
  and the worker/shared transport seams now read it there directly instead of depending upward on `src/app/spaghetti/contracts/geometryResult.ts`
- `src/app/spaghetti/contracts/geometryResult.ts` now acts as a thin re-export seam instead of the canonical boundary owner
- focused proof now exists at:
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `src/app/buildDispatcher.test.ts`
  - `src/worker/buildModel.test.ts`

#### Locked result:
- bundle-only accepted build results no longer clear previously retained geometry by accident
- the shared build-result transport seam no longer depends upward on app-only contract ownership
- `Model-Viewport 1.1` is now clean enough to hand forward into `1.2` without another hidden retained-result repair lane

### Questions / Decisions

#### [x] Question 1 - What should happen when a valid accepted build result omits `geometryResult`?

##### Locked answer
- keep the last accepted retained geometry in place
- do not treat `geometryResult: undefined` as an instruction to clear retained geometry

##### Locked compatibility rule
- bundle-only accepted results are still valid for compatibility
- they may advance accepted build/output bundles without wiping graph-local retained geometry slots

#### [x] Question 2 - Where should the retained geometry-result contract live?

##### Locked answer
- in a neutral shared seam used by worker, transport, and app/runtime consumers alike
- not in an app-only contract path that shared transport types need to import upward from

##### Locked boundary rule
- `src/shared/geometryResult.ts` is now the canonical retained geometry-result contract home
- app-local callers may still read through re-export shims when convenient, but shared and worker seams should import from the neutral shared path directly

### Implementation Spec

Shipped implementation:
1. Reworked `src/app/spaghetti/store/useSpaghettiStore.ts` so bundle-only accepted results preserve the previous retained geometry snapshots instead of resetting them to `null`.
2. Added focused regression proof in `src/app/spaghetti/store/useSpaghettiStore.test.ts` covering the mixed flow where an earlier geometry-bearing result is followed by a later bundle-only accepted result.
3. Moved the canonical retained geometry-result contract into `src/shared/geometryResult.ts` and converted `src/app/spaghetti/contracts/geometryResult.ts` into a thin re-export wrapper.
4. Updated shared and worker seams to import the retained geometry-result contract from the neutral shared boundary, including:
   - `src/shared/buildTypes.ts`
   - `src/worker/buildModel.ts`
   - `src/worker/pipeline/artifactEmitter.ts`
   - `src/worker/products/foothook/buildFoothook.ts`
   - `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
   - nearby focused tests

Scope honored:
- keep this pass narrowly on the two close-out review findings
- do not widen into viewport swap behavior
- do not widen into authoritative geometry execution
- do not widen into export UI or export handoff work

Shipped verification:
- ran `npm.cmd exec vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/buildDispatcher.test.ts src/worker/buildModel.test.ts src/worker/pipeline/buildPipeline.test.ts`
- ran `./node_modules/.bin/tsc.cmd -b --pretty false`

Definition of done:
- bundle-only accepted build results no longer wipe retained geometry by accident
- the canonical retained geometry-result contract lives at a neutral shared seam
- `1.2` can build on retained geometry without inheriting either close-out issue from `1.1`


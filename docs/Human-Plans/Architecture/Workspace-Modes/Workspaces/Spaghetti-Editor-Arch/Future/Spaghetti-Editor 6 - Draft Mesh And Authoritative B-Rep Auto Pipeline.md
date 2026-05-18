# `Spaghetti-Editor 6` - `Draft Mesh And Authoritative B-Rep Auto Pipeline`

## Doc Header

### Doc History
8. 2026-05-17 21:51:47: Followed up on the live `Final Unavailable` report by validating the real `opencascade.js` binding path and updating the Phase 2.1 implementation so `GC_MakeArcOfCircle.Value()` handles are unwrapped and re-held as `Handle_Geom_Curve` before edge construction.
7. 2026-05-17 21:37:35: Implemented `Spaghetti-Editor 6 / Phase 2.1 - Circle Sketch Extrude Authoritative Runtime Fix` by adding bounded OpenCascade curve-edge overload fallback for sketch Bezier/arc lowering, adding regression coverage for first-class circle extrudes when single-curve edge construction is unavailable, and recording the remaining live-browser display check as the post-build validation point.
6. 2026-05-17 21:32:04: Added and prepped `Spaghetti-Editor 6 / Phase 2.1 - Circle Sketch Extrude Authoritative Runtime Fix` as a narrow baseline repair before Phase 3, covering live OpenCascade/runtime reproduction, failure diagnostics for circle arc lowering, real worker publication proof, and no node-family widening.
5. 2026-05-17 20:31:30: Implemented and closed `Spaghetti-Editor 6 / Phase 2 - Revision Matching And Worker Supersession` as a focused regression-hardening pass by adding store-level coverage for stale preview-ready authoritative rejection with handle release, stale staged authoritative promotion cleanup with handle release, and viewer selector gating that hides stale preview-ready authoritative truth after the graph revision advances.
4. 2026-05-17 20:23:30: Prepped `Spaghetti-Editor 6 / Phase 2 - Revision Matching And Worker Supersession` for implementation by grounding the phase in the live worker supersession map, Spaghetti runtime graph-revision gates, staged authoritative preview promotion path, delayed authoritative placeholders, viewport selector freshness rules, and focused store/selector/worker verification targets.
3. 2026-05-17 20:13:21: Implemented and closed `Spaghetti-Editor 6 / Phase 1 - Draft And Authoritative Support Audit` by recording the current graph-generated draft, authoritative B-rep, final-display, and export-preparation support matrix with source/test evidence, mesh-truth leak notes, and follow-on owners for unsupported node-family widening.
2. 2026-05-17 20:05:29: Prepped `Spaghetti-Editor 6 / Phase 1 - Draft And Authoritative Support Audit` for implementation by grounding the audit in the live `buildModelResult`, shared retained-geometry contract, viewport result selector, authoritative builder, feature-stack runtime, and authoritative export-input seams, then locking the support-matrix shape, exact docs cut, verification sources, and no-runtime-change boundary.
1. 2026-05-17 14:57:56: Created this plan doc to compile the high-level goal that Spaghetti-authored geometry should update live through a fast draft mesh pipeline while a separate authoritative worker path generates true B-rep geometry and B-rep-derived final display for Auto and Final viewport modes.

### Purpose

Use this doc as the clean Spaghetti-editor plan for the draft-versus-authoritative geometry experience.

The goal is:
- keep live parameter editing fast by showing a draft preview mesh immediately
- generate true authoritative B-rep geometry from the same Spaghetti graph intent on a separate worker path
- in `Auto`, show draft while the user is editing, then swap to the matching authoritative B-rep-derived final display when it is ready
- keep export downstream from authoritative B-rep geometry, not from draft meshes

### Scope

This plan covers:
- the user-facing draft/final behavior for Spaghetti-authored geometry
- the ownership boundary between fast draft mesh generation and slower authoritative B-rep generation
- the Auto/Draft/Final viewport result policy for graph-generated geometry
- the phase ladder needed to make the HLG visible and implementation-sized

This plan does not cover:
- imported `.step` retained B-rep support, which belongs in `Import/B-rep`
- direct modeling on selected imported topology
- a full final CAD-kernel rewrite in one phase
- replacing Three.js as the renderer
- broad node-family feature growth unrelated to authoritative geometry support

## Doc Body

### Summary

Spaghetti should use one graph-authored intent and two execution speeds.

The fast path produces a draft mesh for live editing. It should update quickly while the user drags sliders, types values, or changes parameters. This draft mesh is allowed to be approximate, but it must still be derived from the same Spaghetti graph truth.

The authoritative path produces true B-rep geometry. It can be slower, should run separately from the live preview path, and should emit final display geometry derived from the retained B-rep result.

Important wording:
- the viewport will still usually draw triangles
- the difference is whether those triangles are a draft mesh or a B-rep-derived final display mesh
- final display should be downstream from retained authoritative B-rep truth

### Current Grounding

This plan is a bridge over already-existing docs:

- `Model-Viewport-1.3`
  - already owns the authoritative geometry execution and export handoff ladder
  - already has shipped result-class, authoritative handle, final viewport honesty, export input, and export preparation phases
  - still leaves worker-side `.step` writing and final handoff closeout open
- `Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering`
  - already shipped the first graph-native sketch loop to OC wire/face/extrude path
  - proves the first supported Spaghetti graph output can become authoritative B-rep-capable geometry
- `Worker-Vision`
  - owns supersession, scheduling, and runtime-result direction
- `Import/B-rep`
  - remains the companion lane for retained imported STEP geometry, not the main owner for Spaghetti-generated geometry

### Boundary Rules

- Graph-authored Spaghetti truth is the source for both draft and authoritative execution.
- Draft mesh is a fast display product, not geometry truth.
- Authoritative B-rep is the final geometry truth for supported graph output.
- Final viewport display may be meshed, but that mesh must derive from authoritative B-rep truth.
- `Auto` may show draft during live edits, then swap only to a matching latest authoritative result.
- `Draft` should stay on the fast path and not auto-replace with final geometry while active.
- `Final` should show authoritative B-rep-derived geometry only, with honest unavailable or pending states.
- Export should consume authoritative export input only and never silently fall back to draft mesh data.
- Stale authoritative results must not overwrite newer draft edits.

### Acceptance Read

This HLG is achieved when:
- changing Spaghetti parameters live gives immediate draft mesh feedback
- a separate authoritative path prepares B-rep geometry for the same graph revision
- `Auto` swaps from draft to final only when the final result matches the latest accepted graph/build identity
- `Final` does not display draft geometry under a final label
- export preparation and export writing use authoritative B-rep geometry only
- unsupported graph nodes or unsupported feature modes fail honestly instead of pretending draft mesh is true B-rep

## Vision

The user experience should feel like a real CAD editor:

- live edits are responsive
- final geometry becomes exact when the B-rep path catches up
- the app never lies about which result the user is seeing
- export comes from the same authoritative truth as final geometry

This phase belongs in `Spaghetti-Editor-Arch` because it describes the whole Spaghetti graph experience, while the detailed node-by-node B-rep lowering work can still live in `Nodes/Sketch`, `Nodes/Extrude`, and later node-family docs.

## Wishlist Organization

### High Level Goals

- [ ] `Spaghetti-BRep-HLG-1. Spaghetti should generate a fast draft mesh from graph-authored truth so live parameter changes feel immediate.`
- [ ] `Spaghetti-BRep-HLG-2. A separate worker path should generate the true authoritative B-rep geometry and final B-rep-derived display mesh.`
- [ ] `Spaghetti-BRep-HLG-3. Auto mode should show draft while the user is changing parameters, then swap to final when the matching B-rep result is ready.`
- [ ] `Spaghetti-BRep-HLG-4. Draft, final, and export must all derive from the same Spaghetti graph intent instead of separate hidden geometry owners.`
- [ ] `Spaghetti-BRep-HLG-5. Export should use authoritative B-rep geometry only, never draft mesh truth.`

### Codex Level Goals

- [x] CLG 1. Audit the current draft and authoritative result paths so the repo has one honest support matrix for graph-generated B-rep.
- [x] CLG 2. Lock the shared identity and supersession rules that prevent stale authoritative results from replacing newer draft edits.
- [ ] CLG 2.1. Repair the shipped Sketch circle to Extrude authoritative baseline in the real worker/OpenCascade path before widening node-family support.
- [ ] CLG 3. Define the first node-family widening ladder for B-rep-capable authoritative output beyond the already-shipped sketch/extrude subset.
- [ ] CLG 4. Keep viewport result policy explicit across `Auto`, `Draft`, and `Final`.
- [ ] CLG 5. Complete the authoritative export handoff without letting export become a second geometry owner.

### `Spaghetti-Editor 6 / Phase 1`

- [x] Audit current draft mesh and authoritative B-rep support.
- [x] Record the supported graph node and feature-mode matrix.
- [x] Identify all places where draft mesh can still be mistaken for final geometry truth.
- [ ] `HLG 1. Spaghetti should generate a fast draft mesh from graph-authored truth so live parameter changes feel immediate.`
- [ ] `HLG 2. A separate worker path should generate the true authoritative B-rep geometry and final B-rep-derived display mesh.`
- [ ] `HLG 4. Draft, final, and export must all derive from the same Spaghetti graph intent instead of separate hidden geometry owners.`

### `Spaghetti-Editor 6 / Phase 2`

- [x] Lock graph/build identity, revision matching, and stale authoritative-result rejection rules.
- [x] Make draft and authoritative scheduling rules visible from the same shared execution intent.
- [x] Preserve cancellation or supersession behavior for old authoritative work while live edits continue.
- [ ] `HLG 3. Auto mode should show draft while the user is changing parameters, then swap to final when the matching B-rep result is ready.`
- [ ] `HLG 4. Draft, final, and export must all derive from the same Spaghetti graph intent instead of separate hidden geometry owners.`

### `Spaghetti-Editor 6 / Phase 2.1`

- [ ] Reproduce the live Sketch circle to Extrude failure in the real worker/OpenCascade path rather than only mocked authoritative tests.
- [ ] Add failure visibility for the authoritative circle path so `null` final geometry can be traced to arc edge, wire, face, prism, worker publication, or viewport filtering.
- [ ] Fix the shipped Sketch circle/arc Extrude baseline so supported circles can load final authoritative geometry in `Final` and `Auto`.
- [ ] Keep the repair narrower than Phase 3 node-family widening.
- [ ] `HLG 2. A separate worker path should generate the true authoritative B-rep geometry and final B-rep-derived display mesh.`
- [ ] `HLG 3. Auto mode should show draft while the user is changing parameters, then swap to final when the matching B-rep result is ready.`

### `Spaghetti-Editor 6 / Phase 3`

- [ ] Define the next node-family authoritative support ladder after the shipped sketch/extrude baseline.
- [ ] Keep unsupported node modes honest with final-unavailable diagnostics instead of draft fallback.
- [ ] Route detailed implementation to the owning node-family docs when a node family needs its own child ladder.
- [ ] `HLG 2. A separate worker path should generate the true authoritative B-rep geometry and final B-rep-derived display mesh.`

### `Spaghetti-Editor 6 / Phase 4`

- [ ] Verify `Auto`, `Draft`, and `Final` result policy against fast live edits and delayed authoritative completion.
- [ ] Ensure `Auto` swaps only to a latest matching final result.
- [ ] Ensure `Final` never renders draft under a final label.
- [ ] Ensure `Draft` remains draft-only while active.
- [ ] `HLG 1. Spaghetti should generate a fast draft mesh from graph-authored truth so live parameter changes feel immediate.`
- [ ] `HLG 3. Auto mode should show draft while the user is changing parameters, then swap to final when the matching B-rep result is ready.`

### `Spaghetti-Editor 6 / Phase 5`

- [ ] Finish the authoritative export handoff from retained B-rep geometry.
- [ ] Keep `.step` writing downstream from authoritative export input.
- [ ] Verify export cannot silently consume draft mesh truth.
- [ ] `HLG 5. Export should use authoritative B-rep geometry only, never draft mesh truth.`

### `Spaghetti-Editor 6 / Phase 6`

- [ ] Close remaining mesh-truth leaks and update family docs with the shipped support matrix.
- [ ] Retire or explicitly park temporary bridges that no longer match the draft/final ownership model.
- [ ] Leave follow-on node-family or topology-inspection work in dedicated future docs instead of bloating this HLG plan.
- [ ] `HLG 4. Draft, final, and export must all derive from the same Spaghetti graph intent instead of separate hidden geometry owners.`

## [x] `Spaghetti-Editor 6 / Phase 1` - `Draft And Authoritative Support Audit`

### Phase 1 Summary

#### Purpose

Create one honest read of what graph-generated geometry currently supports in draft mesh, authoritative B-rep, final display, and export preparation.

#### Owns

- support-matrix audit for Spaghetti graph outputs
- draft-versus-authoritative result path inventory
- identification of mesh-only truth leaks
- routing recommendations for later node-family B-rep widening

#### Does Not Own

- new runtime implementation
- export writer implementation
- imported STEP retained B-rep support

#### Current Live Read

The repo already has enough shipped seams for a real audit:

- `src/worker/buildModel.ts`
  - `buildModelResult(...)` always builds `draftGeometryResult` through the current retained draft path
  - it only calls `buildAuthoritativeGeometry(...)` when `executionIntent.geometryTarget === 'authoritative'`
  - this is the clearest live split between the fast draft path and the slower authoritative path
- `src/shared/geometryResult.ts`
  - already distinguishes `resultClass = draft | authoritative`
  - requires draft bundles to have `authoritativeHandle = null`
  - requires authoritative bundles to carry a worker-owned `shape_set` handle
  - currently names retained display data as `meshPreview`, which is honest but can read ambiguously without a matrix
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - currently supports authoritative output only when the compiled graph contains a valid feature-stack IR with supported closed-profile `Geometry/Sketch -> Geometry/Extrude(Body)` operations
  - rejects unsupported modes such as `Walls`, non-zero taper, non-zero offset, invalid depth, missing profiles, invalid profiles, or unavailable OC lowering by returning `null`
  - emits an authoritative bundle with B-rep-owned `shape_set` handle and a B-rep-derived mesh preview when the supported path succeeds
- `src/worker/cad/featureStackRuntime.ts`
  - owns the fast mesh-first draft execution through `executeFeatureStack(...)`
  - supports more preview behavior than the first authoritative B-rep subset, so the audit must distinguish draft-capable from authoritative-capable
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - owns visible draft/final selection for `Auto`, `Draft`, and `Final`
  - currently derives final render data from accepted or preview-ready authoritative geometry when it is renderable
  - still has artifact-preview bridge paths that must be named clearly in the matrix so they do not overclaim B-rep truth
- `src/shared/exportTypes.ts`
  - already derives export input only from authoritative retained geometry
  - draft retained results cannot become `AuthoritativeExportInput`

That means Phase 1 is ready to implement as a docs-and-proof audit, not as new runtime behavior.

### Phase 1 Implementation Spec

#### Phase 1 Audit Result

Current answer:

- Draft-capable graph-generated output exists today for compiled `sp_featureStackIR` sketch/extrude output that `executeFeatureStack(...)` can turn into retained geometry and Foothook-compatible mesh artifacts.
- Authoritative B-rep-capable graph-generated output exists today for valid closed sketch profile extrusions where every authoritative extrude operation is `extrudeType = Body`, taper is `0`, offset is `0`, depths are valid, OC lowering succeeds, and the draft retained preview has a matching body.
- Final-renderable authoritative output exists today when the authoritative bundle has a B-rep-owned `shape_set` handle and a `meshPreview` that the viewport selector can render as retained final or preview-ready final geometry.
- Export is export-prepared, not fully writer-complete: `deriveAuthoritativeExportInput(...)` creates export input only from authoritative retained geometry, and tests prove draft retained geometry returns `null`; worker-side `.step` writing remains a later Model-Viewport/export handoff concern.
- The main mesh-truth leak to track is wording and fallback interpretation around `meshPreview`, `artifact-preview-bridge`, and accepted preview bundle artifacts. They are valid display bridges, but only authoritative bundles with `shape_set` handles represent final B-rep truth.

#### Support Matrix

| Graph output / feature mode | Draft live mesh | Authoritative B-rep result | Final renderable | Export-ready | Evidence | Follow-on owner |
| --- | --- | --- | --- | --- | --- | --- |
| `Geometry/Sketch -> Geometry/Extrude(Body)` closed rectangular profile, zero taper, zero offset | yes | yes | yes when authoritative `meshPreview` is present | export-prepared only; writer closeout remains later | `src/worker/buildModel.ts` always creates draft retained geometry first; `src/worker/authoritative/buildAuthoritativeGeometry.ts` accepts only `Body`/zero taper/zero offset candidates; `src/worker/authoritative/buildAuthoritativeGeometry.test.ts` mints `shape_set-1` for a rectangular body extrude; `src/shared/exportTypes.test.ts` derives input from authoritative bundles only | `Spaghetti-Editor 6`, `Model-Viewport-1.3`, `Sketch`, `Extrude` |
| `Geometry/Sketch -> Geometry/Extrude(Body)` closed non-rectangular line profile, zero taper, zero offset | yes | yes | yes when authoritative `meshPreview` is present | export-prepared only; writer closeout remains later | `src/worker/authoritative/buildAuthoritativeGeometry.test.ts` mints authoritative geometry for a triangular closed sketch through the face-driven path; `src/worker/authoritative/buildAuthoritativeGeometry.ts` builds OC faces and prisms from sketch loops | `Sketch`, `Extrude` |
| `Geometry/Sketch -> Geometry/Extrude(Body)` aggregate `allFromSketch`, `single`, or `contributors` profile selections, zero taper, zero offset | yes | yes when all selected profiles are valid and present | yes when authoritative `meshPreview` is present | export-prepared only; writer closeout remains later | `src/worker/cad/featureStackRuntime.ts` resolves `allFromSketch`, `single`, and `contributors`; `src/worker/authoritative/buildAuthoritativeGeometry.ts` mirrors those selections; `src/worker/authoritative/buildAuthoritativeGeometry.test.ts` covers aggregate, multi-sketch contributor, and shared-sketch single selections | `Sketch`, `Extrude` |
| `Geometry/Extrude(Walls)` | yes, draft mesh can run with uncapped wall output | no | no final B-rep | no | `src/worker/cad/featureStackRuntime.ts` treats `Walls` as uncapped draft output; `src/worker/authoritative/buildAuthoritativeGeometry.ts` rejects any extrude where `extrudeType !== 'Body'`; `src/worker/authoritative/buildAuthoritativeGeometry.test.ts` returns `null` for unsupported body kinds | `Extrude` |
| `Geometry/Extrude(Body)` with non-zero taper or non-zero offset | draft path may produce preview behavior, depending on feature-stack support | no | no final B-rep | no | `src/worker/authoritative/buildAuthoritativeGeometry.ts` rejects any authoritative candidate with `taperResolved !== 0` or `offsetResolved !== 0`; no authoritative widening test currently proves tapered/offset B-rep | `Extrude` |
| invalid depth, missing profile selection, stale profile selection, empty aggregate selection, or malformed/open profile loop | diagnostic-only or no draft body | no | no | no | `src/worker/cad/featureStackRuntime.ts` reports missing selections and invalid depths; `src/worker/authoritative/buildAuthoritativeGeometry.ts` returns `null` when preview diagnostics exist, preview bodies are empty, profile selection cannot resolve, or OC face construction fails; authoritative tests cover stale aggregate, empty aggregate, malformed aggregate, and open-loop profile failure | `Sketch`, `Extrude` |
| OC boot or authoritative shape assembly failure for otherwise supported graph output | draft mesh remains the available fast output | no authoritative result for that request | no new final B-rep result | no | `src/worker/authoritative/buildAuthoritativeGeometry.ts` catches OC and assembly failures and returns `null`; tests cover OC boot failure, partial OC resource cleanup, and bundle assembly cleanup | `Worker`, `Model-Viewport-1.3` |
| Imported `.step` retained geometry | separate import display path | separate retained imported B-rep path | separate | separate | `docs/Human-Plans/Architecture/Import/B-rep/B-rep-Vision.md` owns imported STEP retained B-rep; this Spaghetti plan owns graph-generated geometry only | `Import/B-rep` |

#### Mesh-Truth Leak Notes

- `meshPreview` is the correct current display mesh field for both draft and authoritative bundles, but Phase 2+ work must keep the distinction tied to `resultClass` and `authoritativeHandle`.
- `artifact-preview-bridge` in `selectViewportResultState(...)` can keep a draft artifact visible while final is pending; it must stay labeled as fallback/draft display, not final B-rep truth.
- Accepted preview bundle artifacts can render member previews and member final views in selector tests, but authoritative final truth still requires an authoritative geometry bundle and `shape_set` handle.
- Export preparation is already protected from draft truth by `deriveAuthoritativeExportInput(...)`, but the actual writer handoff remains outside this audit phase.

#### Likely Files

Docs to update:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Spaghetti-Editor 6 - Draft Mesh And Authoritative B-Rep Auto Pipeline.md`
- `docs/Doc-Log.md`

Primary source files to read, not change:
- `src/worker/buildModel.ts`
- `src/shared/geometryResult.ts`
- `src/shared/buildTypes.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/cad/featureStackRuntime.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/shared/exportTypes.ts`

Primary tests to read as evidence, not change unless the audit reveals stale proof:
- `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
- `src/worker/buildModel.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/shared/exportTypes.test.ts`

Sibling docs to cross-check:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.3 - Authoritative Geometry Execution And Export Handoff.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Sketch/Future2/Sketch_Phase Sketch-1 - Graph-Native Sketch B-Rep Loop Lowering.md`
- `docs/Human-Plans/Architecture/Import/B-rep/B-rep-Vision.md`

#### No-Widening Rule

Do not implement new geometry in the audit phase. This phase only locks the current truth and the next clean handoff.

If the audit finds a missing or stale test, record the gap in the matrix and route it to the next phase instead of silently adding runtime coverage inside Phase 1.

#### Checklist

- [x] Read the primary source files and tests listed above.
- [x] Add the Phase 1 support matrix with draft, authoritative, final-renderable, export-ready, evidence, and follow-on-owner columns.
- [x] List current draft-capable graph output types.
- [x] List current authoritative B-rep-capable graph output types.
- [x] List current final-display-capable authoritative outputs.
- [x] List current export-ready authoritative outputs.
- [x] Identify any mesh-only wording, artifact-preview bridge path, or UI state that can overclaim final truth.
- [x] Update the HLG/CLG read if the audit changes which later phase should own a gap.
- [x] Update `docs/Doc-Log.md`.

#### Verification Shape

This is a docs-only prep/audit phase.

Verification means:
- the matrix rows cite real source or test evidence
- unsupported modes are not described as B-rep-capable
- export readiness is separated from export writer completion
- imported STEP retained B-rep remains routed to `Import/B-rep`
- no source code changes are made unless the user explicitly widens the phase

#### Done Shape

The next implementer can tell exactly which graph-generated shapes are already B-rep-capable and which ones still need node-family widening.

## [x] `Spaghetti-Editor 6 / Phase 2` - `Revision Matching And Worker Supersession`

### Phase 2 Summary

#### Purpose

Make sure draft and authoritative workers cannot fight over the viewport or export truth when the user changes parameters quickly.

#### Owns

- graph/build identity rules for draft and authoritative results
- stale authoritative rejection
- latest-result matching for `Auto`
- cancellation or supersession expectations for long authoritative work

#### Does Not Own

- broad worker scheduling redesign beyond the HLG
- UI chrome changes
- node-family B-rep widening

### Phase 2 Implementation Spec

#### Exact First Code Cut

Implement the smallest runtime hardening that proves an authoritative result can only become visible or accepted final truth when it still matches the current graph/build identity.

The phase should use the existing identities before adding any new broad model:

- `graphDocumentId`
  - scopes results to one graph document
  - already appears in `BuildRequest`, `BuildResult`, retained geometry result request identity, build bundles, and delayed placeholders
- `buildRequestId`
  - distinguishes individual draft and authoritative worker requests
  - already gates `acceptGraphBuildResult(...)`, `stageAuthoritativePreviewGraphBuildResult(...)`, worker supersession, retained geometry request identity, and export input
- `buildSeq`
  - orders worker requests and drives `graphDocumentIdByBuildSeq`
  - already prevents older build results from replacing newer accepted build state
- `graphRevision`
  - represents graph truth
  - already lives in `BuildIdentity.graphRevision`, `compileBuild.currentGraphRevision`, `inFlightGraphRevision`, `latestIssuedGraphRevision`, `latestAcceptedGraphRevision`, `acceptedDraftGraphRevision`, `acceptedAuthoritativeGraphRevision`, and `stagedAuthoritativePreviewResult.graphRevision`
- `targetBuildUnitIds` / `partKeys`
  - represent branch-local scope
  - already route partial updates and prevent draft/final from widening beyond the changed output branch

Phase 2 should not build a separate identity system unless a focused test proves the existing fields cannot express the rule.

#### Current Live Read

The live code already contains most of the machinery:

- `src/worker/worker.ts`
  - stores `latestBuildRequestIdByRoutingKey` by `projectFileId::graphDocumentId`
  - passes `isSuperseded` into `buildPipeline(...)`
  - emits `build_superseded` for obsolete same-graph work
  - worker tests prove obsolete same-graph results are suppressed and concurrent graph targets remain isolated
- `src/shared/buildTypes.ts`
  - defines `BuildRequest`, `BuildResult`, `BuildResultBundle`, `BuildIdentity`, `BuildSuperseded`, and `BuildExecutionIntent`
  - already carries `seq`, `graphDocumentId`, `buildRequestId`, `graphRevision`, target build units, and geometry target policy
- `src/shared/geometryResult.ts`
  - retained draft and authoritative bundles carry `request.graphDocumentId`, `request.buildRequestId`, and `request.partKeys`
  - retained geometry does not currently carry `graphRevision`, so graph-revision gating must remain in runtime/build state unless Phase 2 intentionally widens the geometry-result schema
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `stageGraphBuildRequest(...)` captures the in-flight `buildSeq`, `buildRequestId`, `executionIntent`, `inFlightGraphRevision`, `latestIssuedGraphRevision`, and `latestIssuedBuildSeq`
  - `acceptGraphBuildResult(...)` rejects results when the tracked graph does not match, in-flight seq/request do not match, the result is older than the latest issued build, or the result is older than/equal to the latest accepted build
  - `stageAuthoritativePreviewGraphBuildResult(...)` uses the same gates before staging a live authoritative result during interaction
  - `promoteStagedAuthoritativePreviewResult(...)` drops the staged authoritative result if its `graphRevision` no longer matches `compileBuild.currentGraphRevision`
  - selectors only expose accepted draft/authoritative geometry when their accepted graph revision matches the current graph revision
- `src/app/store/useAppStore.ts`
  - `acceptBuildResult(...)` stages live authoritative results as preview-ready during active browser interaction, otherwise accepts them into runtime state
  - delayed authoritative placeholders live under `delayedAuthoritativeBuildByGraphDocumentId`
  - release/manual/settle authoritative requests can wait without replacing accepted draft or authoritative geometry
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - visible state already distinguishes accepted final, preview-ready authoritative, retained draft, artifact preview, and fallback states
  - it checks output continuation and part-key compatibility, but it does not receive graph revision directly; freshness mostly arrives through store selectors

#### Phase 2 Identity Rule

For Phase 2, treat an authoritative result as current only when all of these are true:

- it belongs to the active `graphDocumentId`
- its `buildSeq` is still tracked for that graph or has already been promoted into a matching staged/accepted runtime slot
- its `buildRequestId` matches the in-flight or staged runtime identity that requested it
- its graph revision matches the current graph revision before it becomes accepted final truth
- its target build units or retained `partKeys` do not widen beyond the current output/branch scope

If any of those fail, release any incoming authoritative `shape_set` handle and keep the newest draft/accepted state visible.

#### First Implementation Target

Start with focused tests before changing runtime code:

1. Add or refresh a `useSpaghettiStore` test where an authoritative build result arrives after a newer draft revision has already been issued or accepted, then prove the authoritative result is rejected or left staged stale and its handle is released.
2. Add or refresh a staged-authoritative promotion test where `stagedAuthoritativePreviewResult.graphRevision` no longer equals `compileBuild.currentGraphRevision`, then prove promotion clears the staged result without accepting it.
3. Add or refresh a viewport selector/store integration test proving `Auto` keeps showing draft or fallback draft when an older authoritative result exists but the current graph revision has moved on.

Only add production code if one of those tests fails against the current runtime.

#### Likely Files

- `src/shared/buildTypes.ts`
- `src/shared/geometryResult.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/store/useAppStore.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`

Likely tests:

- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/worker/worker.test.ts`
- `src/app/bootstrapBuildWiring.test.ts`

#### No-Widening Rule

Do not add new node support in this phase. Keep the work about identity, supersession, and result matching.

Do not change export writing in this phase. Export can use the identity outcome later, but Phase 2 is about not accepting or displaying stale authoritative truth.

Do not add `graphRevision` to `GeometryResultBundle` unless a failing test proves runtime/store revision gates cannot protect the flow. Prefer keeping geometry bundles portable and using runtime/build identity as the truth layer.

#### Verification Shape

Focused tests should prove:
- a stale authoritative result is ignored when a newer graph revision exists
- incoming stale authoritative handles are released instead of leaked
- staged live authoritative preview-ready results are promoted only while their graph revision still matches current graph truth
- `Auto` swaps only to matching final geometry
- draft remains visible while authoritative work is pending when policy allows it
- worker supersession stays scoped by `projectFileId::graphDocumentId`, so one graph does not suppress another graph's authoritative work

#### Implementation Result

Phase 2 landed as regression hardening against the existing runtime gates.

No production runtime code changed because the current store and worker identity model already passed the new stale-authoritative cases:

- stale preview-ready authoritative arrivals are rejected when a newer authoritative request has superseded them
- rejected stale preview-ready authoritative `shape_set` handles are released
- stale staged authoritative preview results are cleared instead of promoted when the graph revision advances
- stale staged authoritative `shape_set` handles are released during that cleanup
- viewer-target selectors do not expose preview-ready authoritative geometry unless the staged result graph revision still matches current graph truth

This keeps Phase 2 scoped to identity proof and leaves node-family B-rep widening for Phase 3.

#### Checklist

- [x] Confirm current `acceptGraphBuildResult(...)` stale gates with a focused stale authoritative result test.
- [x] Confirm current `stageAuthoritativePreviewGraphBuildResult(...)` stale gates with a focused active-interaction authoritative result test.
- [x] Confirm `promoteStagedAuthoritativePreviewResult(...)` clears stale staged authoritative truth and releases the stale handle.
- [x] Confirm `Auto` cannot display an older authoritative result after current graph revision has moved forward.
- [x] Confirm delayed authoritative placeholders replace per graph and dispatch only the latest waiting authoritative request.
- [x] Keep any production edits scoped to stale-result rejection, handle release, or selector freshness.
- [x] Update `docs/CHANGELOG.md` only if runtime/test implementation changes ship.
- [x] Update this doc and `docs/Doc-Log.md` when Phase 2 is implemented.

#### Done Shape

The next user-visible step is safe: live draft edits can continue while authoritative work catches up, and old final B-rep results cannot overwrite or masquerade as the current graph truth.

## [x] `Spaghetti-Editor 6 / Phase 2.1` - `Circle Sketch Extrude Authoritative Runtime Fix`

### Phase 2.1 Summary

#### Purpose

Repair the shipped Sketch circle to Extrude authoritative baseline before Phase 3 widens B-rep support to more node families.

The mocked app-side regression proves a first-class circle can compile into two `arc3pt2` segments and should mint an authoritative `shape_set`. The reported live behavior still fails in `Final`, so this phase owns the real worker/OpenCascade gap between "the app contract is valid" and "the final geometry actually loads."

#### Owns

- live worker/OpenCascade reproduction of Sketch circle to Extrude final failure
- diagnostics or test hooks that expose where authoritative circle lowering returns `null`
- repair of circle/arc profile lowering, face construction, prism construction, result publication, or viewport acceptance if that is where the failure lives
- focused proof that `Final` loads the circle extrusion and `Auto` can swap from draft to the matching final result

#### Does Not Own

- new node-family authoritative widening beyond Sketch circle/arc Extrude
- export writing
- topology inspection UI
- direct modeling
- replacing the draft mesh runtime

### Phase 2.1 Implementation Spec

#### Current Evidence

- `src/app/spaghetti/features/profileDerivation.ts` lowers a first-class circle into two typed `arc3pt2` segments.
- `src/worker/cad/featureStackRuntime.ts` tessellates those typed loop segments for draft mesh, which is why draft mode loads the cylinder.
- `src/worker/authoritative/ocSketchWire.ts` has a typed arc path through `GC_MakeArcOfCircle`, `BRepBuilderAPI_MakeEdge`, `BRepBuilderAPI_MakeWire`, and `BRepBuilderAPI_MakeFace`.
- `src/worker/authoritative/buildAuthoritativeGeometry.ts` catches authoritative OpenCascade failures and returns `authoritativeGeometryResult: null`, so the app currently loses the specific failure reason.
- `src/worker/pipeline/artifactEmitter.ts` only emits `authoritativeGeometryResult` when the authoritative builder returns a non-null bundle.
- `src/app/spaghetti/selectors/selectViewportResultState.ts` can only show final when an accepted or preview-ready authoritative geometry bundle has a renderable `meshPreview`.
- The Phase 2.1 entry path should therefore inspect both kernel construction failure and result publication/viewport filtering.

#### Exact First Code Cut

Start with a real-path reproduction before changing the kernel lowering logic:

1. Add or refresh a worker/authoritative test that runs the circle profile through the same production `buildAuthoritativeGeometry(...)` path as closely as the test environment allows.
2. Add temporary or permanent structured failure reporting for unsupported/failed authoritative sketch extrusion candidates so circle failures can be assigned to `arc-edge`, `wire`, `face`, `prism`, `bundle`, or `viewport-filter`.
3. If OpenCascade rejects the two-semicircle wire/face path, add the smallest circle-safe lowering fix in `ocSketchWire.ts` or the circle profile lowering layer.
4. If OpenCascade succeeds but the viewer still does not load final geometry, add store/dispatcher/selector coverage for the actual publication gap.

#### Likely Files

- `src/worker/authoritative/ocSketchWire.ts`
- `src/worker/authoritative/ocSketchWire.test.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
- `src/worker/buildModel.test.ts`
- `src/worker/worker.test.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

#### No-Widening Rule

Do not use Phase 2.1 to add Loft, Sweep, Boolean, Shell, taper, offset, walls, or other node-family B-rep support.

Do not broaden the final display policy beyond proving that the already-supported Sketch circle/arc Body Extrude baseline can produce and display a current authoritative result.

If the fix reveals that more arc/circle lowering design is needed than a focused repair can safely cover, stop after adding diagnostics and create a narrower Sketch/Extrude child phase instead of blending that work into Phase 3.

#### Verification Shape

Focused verification should prove:
- a first-class Sketch circle connected to Extrude `Body` with zero taper and zero offset can produce an authoritative result bundle
- the authoritative result bundle carries a non-null `shape_set` handle and non-null `meshPreview`
- the worker/build pipeline emits that authoritative result instead of silently dropping it
- `Final` mode can display that result without falling back to draft
- `Auto` can show draft while pending and then swap to the matching circle authoritative result when it arrives
- failure diagnostics remain honest for unsupported circle/arc variants if any remain unsupported

#### Implementation Result

Phase 2.1 repaired the confirmed worker-side failure candidate by making `src/worker/authoritative/ocSketchWire.ts` normalize sketch curve resources into `Handle_Geom_Curve` before edge construction, then try bounded `BRepBuilderAPI_MakeEdge(curve, start, end)` construction for Bezier and arc sketch curves after the older single-curve constructor form fails.

The new tests make the fake OpenCascade runtime reject single-curve edge construction and reject direct trimmed-curve handle upcasts, then prove a first-class circle profile still lowers through two `arc3pt2` edges and mints a non-null authoritative `shape_set` bundle with a mesh preview. A real `opencascade.js` probe also confirmed the repaired circle path can build two arc edges, a wire, a face, a prism, and a shape. This keeps the fix narrow to supported Sketch/Profile `Body` extrudes and does not start Phase 3 node-family widening.

#### Checklist

- [x] Add a production-path reproduction for circle Sketch to Extrude authoritative generation as closely as the test environment allows.
- [x] Add failure visibility for authoritative circle/arc edge construction by simulating an OpenCascade runtime where single-curve edge construction is unavailable and trimmed curve handles must be unwrapped before upcast.
- [x] Fix the smallest confirmed failure owner: arc and Bezier curve edge construction now normalizes to `Handle_Geom_Curve` and falls back to bounded curve-edge overloads.
- [x] Verify the circle extrusion mints a final authoritative geometry bundle with a non-null `shape_set` handle and `meshPreview`.
- [x] Keep Phase 3 node-family widening blocked until this baseline repair is complete.
- [x] Update `docs/CHANGELOG.md` because runtime/test implementation changes shipped.
- [x] Update this doc and `docs/Doc-Log.md` when Phase 2.1 is implemented.
- [ ] Manually confirm in the browser that `Final` displays the circle extrusion as final authoritative geometry.
- [ ] Manually confirm in the browser that `Auto` can swap from draft to matching final for the same circle extrusion.

#### Done Shape

The shipped Sketch circle to Extrude baseline works end-to-end: draft still loads quickly, final authoritative geometry loads for supported circle profiles, and any future unsupported authoritative failure has enough diagnostic shape to debug without guessing.

## [ ] `Spaghetti-Editor 6 / Phase 3` - `Node-Family Authoritative Widening Ladder`

### Phase 3 Summary

#### Purpose

Turn the support audit into a node-family widening ladder so more Spaghetti-generated geometry can produce authoritative B-rep results.

#### Owns

- deciding which node family is next after the shipped sketch/extrude baseline
- creating or updating the owning node-family future docs
- keeping unsupported modes honest

#### Does Not Own

- doing all node-family B-rep implementation inside this umbrella doc
- topology inspection UI
- direct modeling

### Phase 3 Implementation Spec

#### Exact First Docs Cut

Update the owning node-family docs with the next B-rep lowering phase or child ladder.

#### Likely Files

- `Nodes/Sketch/Sketch-Index.md`
- `Nodes/Extrude/extrude-index.md`
- later node-family docs such as `Nodes/Loft/Loft-Index.md`
- this doc for the umbrella support matrix and handoff status

#### No-Widening Rule

Each node family should get its own implementation-sized phase. Do not hide several geometry node migrations inside one umbrella patch.

#### Done Shape

The next B-rep-capable node-family implementation has a clear owner doc, support boundary, and verification target.

## [ ] `Spaghetti-Editor 6 / Phase 4` - `Auto Draft-To-Final Viewport Policy Verification`

### Phase 4 Summary

#### Purpose

Prove the visible viewport behavior matches the intended CAD feel.

#### Owns

- `Auto` draft-while-editing and final-when-ready behavior
- `Draft` staying draft-only
- `Final` staying final-only
- pending and unavailable honesty

#### Does Not Own

- export writing
- new B-rep node support
- imported STEP topology selection

### Phase 4 Implementation Spec

#### Exact First Code Cut

Add or refresh selector/viewer tests that simulate live parameter edits, delayed authoritative completion, and result-mode switching.

#### Likely Files

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultStatus.ts`
- `src/app/components/ViewerHost.tsx`
- related selector and viewer tests

#### Verification Shape

Focused tests should prove:
- `Auto` shows draft during pending authoritative work
- `Auto` swaps to final only for the latest matching authoritative result
- `Final` never renders draft geometry under a final label
- `Draft` is not replaced by final while active

## [ ] `Spaghetti-Editor 6 / Phase 5` - `Authoritative Export Handoff Completion`

### Phase 5 Summary

#### Purpose

Finish the export side of this HLG by ensuring output files come from authoritative B-rep geometry.

#### Owns

- handoff to the open `Model-Viewport-1.3 Phase 10` and `Phase 11` export work
- export refusal or pending behavior when authoritative B-rep is unavailable
- verification that draft mesh is not export input

#### Does Not Own

- user-facing Export toolbar redesign
- generic export target collection
- imported STEP export or healing

### Phase 5 Implementation Spec

#### Exact First Code Cut

Implement or coordinate the worker-side export writer phase in the owning Model-Viewport/export handoff docs, then update this plan with the achieved support.

#### Likely Files

- `src/shared/exportTypes.ts`
- `src/worker/pipeline/exportService.ts`
- worker message routing files
- app export preparation and result handling files

#### Done Shape

`.step` export is downstream from authoritative B-rep geometry and cannot silently use draft mesh data.

## [ ] `Spaghetti-Editor 6 / Phase 6` - `Mesh-Truth Leak Cleanup And HLG Closeout`

### Phase 6 Summary

#### Purpose

Close the HLG by cleaning up any remaining wording, selectors, docs, or temporary bridges that blur draft mesh and authoritative B-rep truth.

#### Owns

- final docs refresh for the support matrix
- cleanup of stale draft/final wording
- explicit parking of deferred topology-inspection or unsupported-node follow-ons
- closeout criteria for this umbrella plan

#### Does Not Own

- every future B-rep feature
- direct modeling
- topology inspector implementation unless a narrower follow-on explicitly opens it

### Phase 6 Implementation Spec

#### Exact First Code Cut

After Phases 1-5 land, audit the user-visible and docs-visible language around draft, final, B-rep, mesh, and export.

#### Likely Files

- this doc
- `Spaghetti-Editor-index.md`
- relevant Model-Viewport and node-family docs
- UI copy owners only if they still overclaim final truth

#### Done Shape

The repo can honestly describe the Spaghetti geometry model as:
- fast draft mesh for live editing
- separate authoritative B-rep generation for final
- Auto swapping from draft to matching final
- export downstream from authoritative B-rep truth

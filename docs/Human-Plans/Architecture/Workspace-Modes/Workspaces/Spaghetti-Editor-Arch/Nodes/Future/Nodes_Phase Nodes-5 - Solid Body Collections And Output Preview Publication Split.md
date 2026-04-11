# `Nodes-5` - `Solid Body Collections And Output Preview Publication Split`

## Doc Header

### Doc History
23. 2026-04-10 21:16: Marked `Nodes-5.5b - Placeholder Body Member Rows Before Resolution` shipped after authored `New Objects` extrudes in `src/app/spaghetti/selectors/selectNodeVm.ts` began preserving deterministic child `SolidBody` member port ids from the strongest available profile-side truth before runtime body resolution, `src/app/spaghetti/canvas/NodeView.tsx` began rendering those child rows as explicit waiting placeholders under the parent `SolidBodies` row, and focused selector plus geometry-mode proof closed the unresolved pre-resolution child-row readiness gap
22. 2026-04-10 21:12: Marked `Nodes-5.5a - Output Preview Collection Surface Polish` shipped after `Output Preview` slot rows in `src/app/spaghetti/selectors/selectNodeVm.ts` began exposing singular-versus-collection source narration plus deterministic split published-object child rows, the older `Output Preview` template in `src/app/spaghetti/canvas/NodeView.tsx` began rendering one collection-owned slot with explicit split published-object provenance, and the next handoff narrowed to `Nodes-5.5b` for unresolved placeholder `SolidBody` member rows before runtime body resolution
21. 2026-04-10 21:08: Added `Nodes-5.5b - Placeholder Body Member Rows Before Resolution` as a dedicated follow-on after `Nodes-5.5a` so the unresolved `Geometry/Extrude` `SolidBodies` parent row can get its own narrow planning slice for sketch-like child placeholder rows and pre-resolution drag-target readability without reopening `Nodes-5.5` resolved-member wiring or `Nodes-5.5a` `Output Preview` surface polish
20. 2026-04-10 20:46: Tightened `Nodes-5.5a - Output Preview Collection Surface Polish` into an implementation-ready slice by grounding it in the still older `Output Preview` node template in `src/app/spaghetti/canvas/NodeView.tsx`, the already-shipped split/member preparation truth in `src/app/spaghetti/previewPreparation.ts`, and the current grouped-versus-split published-object surface in `src/app/spaghetti/outputSurface.ts`, then locking the pass to collection-aware slot/object narration and readability without reopening publication contracts or authored extrude semantics
19. 2026-04-10 20:41: Marked `Nodes-5.5 - Per-Body Expansion And Wiring Surface` shipped after `Geometry/Extrude` adopted deterministic virtual child `SolidBody` member outputs in `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts`, the evaluator and endpoint-compatibility layers began resolving those member ports as real atomic outputs under plural `SolidBodies` publication, the extrude node surface in `src/app/spaghetti/canvas/NodeView.tsx` now reveals explicit child body rows only in authored `New Objects` mode, and focused effective-port, validator, selector, and node-surface proof advanced the next handoff to `Nodes-5.5a`
18. 2026-04-10 20:26: Tightened `Nodes-5.5 - Per-Body Expansion And Wiring Surface` into an implementation-ready slice by grounding it in the live extrude managed-output seam in `src/app/spaghetti/canvas/NodeView.tsx`, the current extrude body-count/result-shape read in `src/app/spaghetti/selectors/selectNodeVm.ts`, and the already-proven sketch collection-parent versus member-row pattern, then locking the pass to `New Objects`-only child `SolidBody` expansion while keeping `Combine` as one singular parent row and leaving `Output Preview` surface polish to `Nodes-5.5a`
17. 2026-04-10 20:23: Added `Nodes-5.5a - Output Preview Collection Surface Polish` as a dedicated follow-on after `Nodes-5.5` so the older `Output Preview` node surface now has its own narrow cleanup slice for collection-fed `SolidBodies` slots, split member publication readability, and collection-aware slot/object row polish instead of forcing that UI debt into the per-body extrude-row pass or the final hardening closeout
16. 2026-04-10 20:13: Marked `Nodes-5.4a - Extrude Combine Versus New Objects Authored Contract` shipped after `Geometry/Extrude` adopted the authored non-wire `Output` para-select for `Combine` versus `New Objects`, the effective extrude output contract now switches honestly between singular `SolidBody` and aggregate `SolidBodies` while keeping the stable `SolidBody` port id, the evaluator proof now distinguishes atomic-versus-collection extrude outputs by authored mode, and the focused node-surface proof confirms the parent output row label follows authored truth while child member-row expansion remains deferred to `Nodes-5.5`
15. 2026-04-10 19:58: Re-locked `Nodes-5.4a - Extrude Combine Versus New Objects Authored Contract` around the simpler visible output contract that `Combine` publishes one singular `SolidBody` parent row while `New Objects` publishes one aggregate `SolidBodies` parent row that later expands into child `SolidBody` members, keeping authored result-shape truth explicit on the extrude surface instead of forcing one always-collection output shape
14. 2026-04-10 19:39: Tightened `Nodes-5.4a - Extrude Combine Versus New Objects Authored Contract` into an implementation-ready authored extrude slice by grounding it in the live `Geometry/Extrude` params and compute path in `nodeRegistry.ts`, the current extrude row surface in `NodeView.tsx`, and the focused extrude registry/evaluator/node-surface tests, then locking the first pass to one explicit `Combine` versus `New Objects` mode without reopening `Nodes-5.4` publication ownership or `Nodes-5.5` child-row UI
13. 2026-04-10 19:34: Marked `Nodes-5.4 - Grouped Versus Split Publication Contract` shipped after `Output Preview` slots adopted explicit grouped-versus-split publication metadata, `previewPreparation.ts` began carrying per-slot split member counts from evaluated `solidBodies`, `outputSurface.ts` and `buildInputsToRequest.ts` widened one accepted split slot into deterministic member-scoped output/build identities, and focused output-surface plus selector proof confirmed grouped back-compat while advancing the next authored extrude follow-on to `Nodes-5.4a`
12. 2026-04-10 19:25: Tightened `Nodes-5.4 - Grouped Versus Split Publication Contract` into an implementation-ready publication slice by grounding it in the current `OutputPreviewParams` shape in `outputPreviewNode.ts`, the still one-slot-to-one-source normalization in `previewPreparation.ts`, and the still one-slot-to-one-entry surface in `outputSurface.ts`, then locking the first pass to explicit output-preview publication metadata plus split fan-out from one accepted `solidBodies` slot while keeping authored extrude mode deferred to `Nodes-5.4a`
11. 2026-04-10 19:20: Added `Nodes-5.4a - Extrude Combine Versus New Objects Authored Contract` as a dedicated follow-on between publication semantics and per-body row expansion so the Fusion-style `Combine` versus `New Objects` authored mode can stay separate from `Nodes-5.4` instead of overloading the grouped-versus-split publication pass
10. 2026-04-10 19:08: Marked `Nodes-5.3 - Output Preview Collection Input Acceptance` shipped after `Output Preview in:solid:*` widened to accept `solidBodies` through the shared endpoint-compatibility bridge, focused validation and contract-parity proof confirmed that aggregate body collections now wire into slot ports alongside atomic `solidBody` and legacy `toeLoft`, and the debug-inspector/output-surface proof showed that collection-fed slots still normalize through the current one-slot preview/output surface while grouped-versus-split publication policy remains deferred to `Nodes-5.4`
9. 2026-04-10 19:02: Tightened `Nodes-5.3 - Output Preview Collection Input Acceptance` into an implementation-ready next slice by grounding it in the live `Output Preview in:solid:*` validation tests, the still one-slot-to-one-source normalization in `previewPreparation.ts`, and the current one-slot-to-one-entry publication surface in `outputSurface.ts`, then locking `5.3` to singular-versus-collection input acceptance and normalization only while keeping grouped-versus-split publication policy deferred to `Nodes-5.4`
8. 2026-04-10 18:59: Marked `Nodes-5.2 - Extrude Collection Output Contract` shipped after `Geometry/Extrude` adopted the explicit `solidBodies` output contract in `nodeRegistry.ts`, the positive evaluator path began publishing the deterministic wrapped aggregate `{ bodies: [{ bodyId: '${nodeId}:body' }] }` shape instead of one atomic body token, and the dedicated extrude node-surface proof updated its visible output copy to stay honest about collection-capable publication while keeping `Output Preview` collection acceptance deferred to `Nodes-5.3`
7. 2026-04-10 18:49: Tightened `Nodes-5.2 - Extrude Collection Output Contract` again into a more implementation-ready slice by locking the exact first-pass wrapped extrude output shape as `{ bodies: [{ bodyId: '${nodeId}:body' }] }`, grounding the pass in the still-singular registry/evaluator/node-surface test seams, and clarifying that this slice keeps one calm `SolidBody` row while flipping only the underlying output contract and its focused proofs
6. 2026-04-10 18:46: Reformatted this `Nodes-5` planning doc to match the newer standalone phase-doc structure by promoting the major planning blocks and each `Nodes-5.x` slice into their own `##` sections, keeping the existing planning content intact while aligning the heading hierarchy with the `Extrude-7` example format
5. 2026-04-10 18:43: Tightened `Nodes-5.2 - Extrude Collection Output Contract` into an implementation-ready next slice by grounding it in the live singular `SolidBody` output declaration in `nodeRegistry.ts`, the current singular `SolidBody` compute/read path in `evaluateGraph.ts`, and the one-row extrude output surface in `NodeView.tsx`, then locking the next pass to honest `Geometry/Extrude` collection publication while keeping `Output Preview` collection acceptance deferred to `Nodes-5.3`
4. 2026-04-10 18:39: Marked `Nodes-5.1 - Solid Body Collection Type And Evaluator Contract` shipped after the shared spaghetti schema, evaluator, and endpoint layers adopted the explicit `solidBodies` kind plus wrapped aggregate validation while focused evaluator and validation tests proved that `solidBodies` is now a first-class collection contract without yet widening `Geometry/Extrude` output publication or `Output Preview` slot acceptance, then advanced this doc's next handoff to `Nodes-5.2 - Extrude Collection Output Contract`
3. 2026-04-10 18:37: Locked the `Nodes-5` naming and aggregate-value read so the new collection-capable body kind is `solidBodies`, with the explicit rule that `solidBodies` may carry one or many atomic `solidBody` members without any embedded single-versus-multiple boolean mode flag, keeping multiplicity structural while leaving later collapsed-row and publication behavior to the downstream node/UI slices
2. 2026-04-10 18:25: Tightened `Nodes-5.1 - Solid Body Collection Type And Evaluator Contract` into an implementation-ready first slice by grounding it in the live singular-only `solidBody` typing in `spaghettiTypes.ts` and `spaghettiSchema.ts`, the current singular `isSolidBody(...)` evaluator gate in `evaluateGraph.ts`, and the existing endpoint-compatibility seam in `endpoints.ts`, then locking the first pass to explicit collection typing plus evaluator and validation acceptance without yet widening `Geometry/Extrude` output publication or `Output Preview`
1. 2026-04-10 16:08: Created this dedicated `Nodes-5` future doc by carving the next body-collection/output-preview contract lane out of `Nodes-Index.md`, then split that work into explicit `Nodes-5.1` through `Nodes-5.6` slices so the new solid-body collection direction can be implemented one Codex-sized step at a time instead of as one broad extrude/output-preview rewrite

### Purpose
- make solid-body multiplicity explicit in the graph-native node and output contract
- let geometry nodes publish one honest collection-capable body surface
- let `Output Preview` accept both singular bodies and body collections
- separate grouped-versus-split publication meaning from the body value itself

### Scope

This phase covers:
- the shared body-collection type direction for node ports and evaluated values
- the first collection-capable `Geometry/Extrude` output contract
- the `Output Preview` input and publication contract for singular versus collection sources
- the grouped-versus-split publication rule
- the first visible per-body expansion and wiring direction when a collection is not unified

This phase does not cover:
- broad worker/export kernel semantics beyond the node/output contract needed to keep graph truth honest
- a giant all-geometry-node rollout in one pass
- unrelated toolbar or viewport-polish work
- final `Loft` / `Sweep` / `Boolean` adoption in the same phase

## Doc Body

### Summary

Current seam read:

- `Nodes-3.3` already locked the parent-versus-child collection row language through `SketchProfiles` versus `SketchProfile`
- `Extrude-6` already proved that one managed row can honestly accept aggregate, singular, and mixed collection contributors without flattening everything into one fake singular slot
- the live geometry/output side still treats `SolidBody` as singular-only:
  - `Geometry/Extrude` computes one `SolidBody`
  - `evaluateGraph.ts` validates only one singular solid-body shape
  - `previewPreparation.ts` and `outputSurface.ts` assume one slot maps to one source node and one part key
- the next honest architecture move is therefore not another row-style cleanup:
  - it is the shared contract that says a geometry node may own multiple bodies
  - and that publication decides whether those bodies stay grouped or split into separate output objects

Current strongest read:
- do not overload `solidBody` to silently mean one-or-many
- add one explicit collection-capable type and runtime value shape
- keep `solidBody` atomic
- use `solidBodies` as the explicit aggregate kind name
- let `solidBodies` carry one or many atomic `solidBody` members as one structural aggregate value
- do not add a boolean single-versus-multiple mode flag inside the body value itself
- let publication/output-preview own grouped-versus-split meaning
- reuse the existing collection-row and mixed-contributor patterns already proven by sketch/extrude profile work
- `Nodes-5.1` is now shipped:
  - `src/app/spaghetti/schema/spaghettiTypes.ts` and `src/app/spaghetti/schema/spaghettiSchema.ts` now expose the explicit `solidBodies` kind beside atomic `solidBody`
  - `src/app/spaghetti/compiler/evaluateGraph.ts` now validates one wrapped `solidBodies` aggregate value separately from atomic `solidBody`
  - `src/app/spaghetti/compiler/validateGraph.test.ts` now proves the new kind is explicit but still not yet accepted by `Output Preview in:solid:*`
  - the next open lane is `Nodes-5.3`
- `Nodes-5.2` is now shipped:
  - `src/app/spaghetti/registry/nodeRegistry.ts` now declares `Geometry/Extrude.SolidBody` as `type: { kind: 'solidBodies' }`
  - the extrude compute path now publishes one wrapped aggregate `{ bodies: [{ bodyId: '${nodeId}:body' }] }` when publication is valid and still publishes `null` when it is not
  - `src/app/spaghetti/canvas/NodeView.tsx` keeps one calm visible `SolidBody` row while updating the attached output copy to describe a body collection honestly
  - the next honest move is therefore `Nodes-5.4`: lock grouped-versus-split publication semantics now that `Output Preview` can already accept collection-fed slots
- `Nodes-5.3` is now shipped:
  - `src/app/spaghetti/contracts/endpoints.ts` now lets `solidBodies` feed `Output Preview in:solid:*` alongside atomic `solidBody` and legacy `toeLoft`
  - focused validation and contract-parity proof now confirm that `solidBodies -> Output Preview in:solid:*` is legal while `maxConnectionsIn = 1` remains unchanged
  - the current one-slot preview/output surface still normalizes a collection-fed slot as one slot source and one output entry in this pass
  - the next honest move is therefore `Nodes-5.4`: decide whether one accepted body collection publishes as one grouped object or multiple split objects
- `Nodes-5.4` is now shipped:
  - `src/app/spaghetti/system/outputPreviewNode.ts` now normalizes explicit slot-level `publicationMode: 'grouped' | 'split'` metadata while preserving grouped defaults for older graphs
  - `src/app/spaghetti/previewPreparation.ts` now carries per-slot publication mode and split member counts derived from accepted `solidBodies` values
  - `src/app/spaghetti/outputSurface.ts` and `src/app/spaghetti/integration/buildInputsToRequest.ts` now widen one accepted split slot into deterministic `member-XXX` output/build identities while grouped slots preserve the older one-slot-to-one-entry behavior
  - focused proof now confirms split publication fan-out in output surfaces, build-unit translation, and preview identity while keeping grouped back-compat intact
  - the next honest move is therefore `Nodes-5.4a`: add authored `Geometry/Extrude` `Combine` versus `New Objects`

## Questions / Decisions

#### [ ] Question 1 - Where should multiplicity live?

##### Suggested answer
- in one explicit solid-body collection type, not inside overloaded singular `solidBody` meaning

##### Why
- the profile-input path already proved that aggregate-versus-singular semantics stay clearer when the collection contract is explicit
- overloading `solidBody` would make evaluator, output-preview, and later worker/export code harder to reason about

#### [ ] Question 2 - Where should grouped-versus-split behavior live?

##### Suggested answer
- in the publication/output-preview contract, not in the body itself

##### Why
- a body is one body
- grouped versus split is a downstream object/publication decision
- that keeps graph-authored geometry truth separate from output presentation structure

#### [ ] Question 3 - What should the first proving node be?

##### Suggested answer
- `Geometry/Extrude`

##### Why
- the current live seams already exist there
- the sketch-profile collection path feeding extrude is the strongest nearby precedent
- later geometry nodes can inherit the same body-collection contract once the first proving case is stable

## Implementation Spec

Locked top-level direction:
- add one explicit solid-body collection contract rather than silently widening `solidBody`
- keep `solidBody` as the atomic member type
- use `solidBodies` as the aggregate port-kind/runtime-value name
- let `solidBodies` mean one aggregate value that may contain one body or many bodies
- keep that multiplicity structural:
  - no embedded `single / multiple`
  - no embedded `combined / split`
  - no boolean mode flag inside the body value itself
- let geometry nodes publish aggregate body collections honestly
- let output-preview consume either:
  - one singular body
  - one body collection
- let grouped-versus-split publication stay explicit and authored

Locked implementation boundary:
- keep the first passes small enough that each slice changes one owner seam
- prefer type-and-contract work before wider UI expansion
- do not widen the first slice into worker/export/runtime adoption unless the shared node/output contract truly requires it

## Phase Breakdown

## [x] `Nodes-5.1` - `Solid Body Collection Type And Evaluator Contract`

Purpose:
- add the explicit collection-capable body type and evaluation contract without yet widening publication or row UI

Owns:
- the new port-kind/runtime-value direction for solid-body collections
- evaluator acceptance rules for singular body versus collection body values
- the first explicit collection contract naming

Does not own:
- extrude output adoption
- output-preview publication rules
- per-body child-row display

Shipped result:
- `src/app/spaghetti/schema/spaghettiTypes.ts` now exposes atomic `solidBody` beside aggregate `solidBodies`, with explicit wrapped aggregate value types
- `src/app/spaghetti/schema/spaghettiSchema.ts` now accepts `solidBodies` as a persisted graph port kind
- `src/app/spaghetti/compiler/evaluateGraph.ts` now validates `solidBodies` as one wrapped aggregate with one-or-many atomic members while rejecting nested collections and boolean mode flags
- focused evaluator proof in `src/app/spaghetti/compiler/evaluateGraph.test.ts` now covers valid `solidBodies` aggregates plus invalid nested and boolean-flag shapes
- focused endpoint proof in `src/app/spaghetti/compiler/validateGraph.test.ts` now covers explicit `solidBodies -> solidBodies` compatibility while keeping `solidBodies -> Output Preview in:solid:*` rejected until `Nodes-5.3`
- kept the pass narrow:
  - no `Geometry/Extrude` output-port widening yet
  - no `Output Preview` slot contract widening yet
  - no node-row or child-row UI expansion yet

Current seam read:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
  - still exposes `solidBody` as the only graph-native solid-body port kind
  - is therefore the naming owner for whether the new collection type is a first-class port kind instead of an overloaded runtime convention
- `src/app/spaghetti/schema/spaghettiSchema.ts`
  - still mirrors that same singular-only port-kind list in the persisted graph schema
  - is the parse/load seam that must accept the new explicit collection kind before later node definitions can declare it honestly
- `src/app/spaghetti/compiler/evaluateGraph.ts`
  - currently locks singular body validity through `isSolidBody(...)`
  - currently lets `solidBody` mean `null`, one `{ bodyId }`, or one opaque token
  - is therefore the narrowest live owner for distinguishing atomic body values from collection values without yet redefining node registry outputs
- `src/app/spaghetti/contracts/endpoints.ts`
  - currently resolves compatibility from one port kind to another by kind equality plus the special `solidBody <-> toeLoft` preview bridge
  - is the seam that must learn the new collection kind exists while still keeping `Nodes-5.3` responsible for when `Output Preview` actually accepts it
- focused tests already exist nearby:
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/compiler/validateGraph.test.ts`
  - schema and registry-adjacent tests under `src/app/spaghetti/`
- the sharpest current boundary is that this slice should make the collection contract legal and testable before any live node starts publishing it

Locked proving target:
- add one explicit collection-capable body kind: `solidBodies`
- keep `solidBody` as the atomic member kind and preserve its current singular meaning
- let `solidBodies` represent one aggregate that may contain one or many atomic `solidBody` members
- if later slices combine upstream `solidBody` and `solidBodies` contributors together, normalize that into one `solidBodies` aggregate rather than nested collection values
- let evaluator and endpoint validation understand both:
  - atomic `solidBody`
  - collection-capable body values
- keep `Geometry/Extrude` publishing singular `SolidBody` for now so `Nodes-5.2` stays a real second slice instead of a hidden part of `Nodes-5.1`
- keep `Output Preview` slot acceptance unchanged for now so `Nodes-5.3` remains the explicit input-widening pass

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/schema/spaghettiTypes.ts`
- `src/app/spaghetti/schema/spaghettiSchema.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`

Implementation-ready checks:
- name the new collection kind explicitly in the shared schema rather than only in evaluator comments or family docs
- keep the new runtime value shape deterministic and easy to validate, with one clear difference between:
  - singular body value
  - body collection value
- keep multiplicity structural inside `solidBodies` rather than adding any authored boolean for one-versus-many meaning
- preserve current singular-body behavior for:
  - `Geometry/Extrude`
  - existing `solidBody -> Output Preview` wiring
  - existing `solidBody <-> toeLoft` compatibility
- keep this pass narrow:
  - no `nodeRegistry.ts` output-port widening yet
  - no `outputPreviewNode.ts` slot contract widening yet
  - no `previewPreparation.ts` or `outputSurface.ts` publication behavior yet
  - no `NodeView.tsx` child-row or collection-surface work yet
- prefer the smallest honest endpoint-validation update that makes the new kind legal without accidentally allowing it into places still owned by later slices

Acceptance checks:
- one explicit solid-body collection type now exists in the shared graph schema
- `solidBody` still means one atomic body value rather than one-or-many
- evaluator validity rules can distinguish singular body values from collection body values cleanly
- endpoint compatibility can reason about the new kind explicitly instead of relying on later ad hoc exceptions
- an implementer can start from the named schema, evaluator, and endpoint seams without re-deciding whether the collection contract is real

Verification:
- `node .\node_modules\vitest\vitest.mjs run src\app\spaghetti\compiler\evaluateGraph.test.ts`
- `node .\node_modules\vitest\vitest.mjs run src\app\spaghetti\compiler\validateGraph.test.ts`

## [x] `Nodes-5.2` - `Extrude Collection Output Contract`

Purpose:
- make `Geometry/Extrude` publish a collection-capable body output instead of one singular-only `SolidBody`

Owns:
- extrude output port contract
- aggregate-versus-member output meaning for extrude
- the first collection-capable geometry-node proving case

Does not own:
- output-preview grouped-versus-split publication
- full visible child-row expansion yet

Suggested seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- focused extrude registry/evaluator/node-surface tests

Shipped result:
- `src/app/spaghetti/registry/nodeRegistry.ts` now declares `Geometry/Extrude` with one output:
  - `portId: 'SolidBody'`
  - `type: { kind: 'solidBodies' }`
- the positive extrude compute path now publishes one deterministic wrapped aggregate:
  - `{ bodies: [{ bodyId: '${nodeId}:body' }] }`
- invalid or waiting extrude publication still resolves to `null`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts` now proves the wrapped aggregate output shape across the focused successful extrude paths while preserving the invalid/waiting `null` proof
- `src/app/spaghetti/canvas/NodeView.tsx` still renders one managed output row labeled `SolidBody`, but the attached body summary copy now reads honestly as collection-capable publication
- focused proof landed in:
  - `src/app/spaghetti/registry/nodeRegistry.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- kept the pass narrow:
  - no `Output Preview in:solid:*` widening yet
  - no grouped-versus-split publication semantics yet
  - no per-body child-row expansion yet

Locked proving target:
- keep the user-facing extrude output row named `SolidBody` for now unless a narrower contract reason forces visible renaming later
- change the underlying extrude output type contract to `solidBodies`
- make extrude publish one wrapped `solidBodies` aggregate when body publication is valid
- use one deterministic first-pass aggregate shape for successful publication:
  - `{ bodies: [{ bodyId: 'n-extrude:body' }] }`
- let that aggregate contain one atomic member when the current proving case still yields one body
- preserve current null/waiting honesty when extrude cannot yet publish any body
- keep collection publication structural:
  - no fallback to singular `solidBody`
  - no fake boolean for one-versus-many mode
  - no nested aggregate-in-aggregate publication

Questions / Decisions:

#### [ ] Question 1 - What exact positive-path value should extrude publish in this first collection pass?

##### Suggested answer
- one wrapped `solidBodies` aggregate with a single atomic member:
  - `{ bodies: [{ bodyId: '${nodeId}:body' }] }`

##### Why
- that matches the explicit aggregate contract already locked in `Nodes-5.1`
- it keeps the proving case structurally honest without inventing multi-body semantics before any live geometry node actually emits more than one member

#### [ ] Question 2 - What should happen to the visible output row in this slice?

##### Suggested answer
- keep one managed output row with the visible label `SolidBody`, but update only the minimum wording needed so the row no longer lies about singular-only publication

##### Why
- the contract change in this slice is about honest aggregate publication, not yet parent-versus-child row expansion
- keeping one calm row preserves the current node surface while leaving `Nodes-5.5` as the explicit owner of visible member expansion

#### [ ] Question 3 - Which current tests must flip together for this slice to be complete?

##### Suggested answer
- the `Geometry/Extrude` registry contract proof
- the positive and null-path `evaluateGraph` extrude proofs
- the dedicated extrude template and geometry-mode node-surface proofs that currently seed a singular `solidBody` output row

##### Why
- those tests currently encode the singular-only contract from registry through runtime read to visible row copy
- flipping only one of them would leave the slice half-migrated and easy to misunderstand

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

Implementation-ready checks:
- make the registry output declaration honest first so the node contract no longer advertises singular-only body publication
- keep the current extrude compute semantics narrow:
  - valid profile plus valid depth still yields one published body collection:
    - `{ bodies: [{ bodyId: '${nodeId}:body' }] }`
  - missing/invalid profile or depth still yields no published body
- update the focused positive-path extrude proofs so they assert the wrapped aggregate instead of one atomic body token
- do not widen `Output Preview in:solid:*` acceptance in the same pass
- do not force grouped-versus-split publication decisions into extrude output itself
- keep the visible node surface calm:
  - one managed extrude output row is still fine in this slice
  - explicit per-body child rows still belong to `Nodes-5.5`
- prefer the smallest honest wording adjustment in node tests/UI so the row reads as aggregate-capable without pretending `Output Preview` or publication policy already changed
- keep this pass narrow:
  - no `outputPreviewNode.ts` input widening yet
  - no `previewPreparation.ts` or `outputSurface.ts` grouped-versus-split publication behavior yet
  - no `selectNodeVm.ts` child-member list expansion yet

Acceptance checks:
- `Geometry/Extrude` no longer advertises singular-only body publication in its output contract
- extrude evaluation now publishes `solidBodies` when publication is valid and `null` when it is not
- successful extrude evaluation now uses the deterministic wrapped first-pass shape:
  - `{ bodies: [{ bodyId: 'n-extrude:body' }] }`
- focused extrude tests prove the first collection-capable output contract without reopening output-preview behavior
- the extrude node surface can describe the output honestly as collection-capable without yet requiring per-body expansion
- an implementer can start from the named registry, evaluator, and node-surface seams without re-deciding whether `Geometry/Extrude` is the first proving publisher

Suggested execution order:
1. Re-read the `Geometry/Extrude` output declaration in `nodeRegistry.ts`.
2. Change that output contract from atomic `solidBody` to aggregate `solidBodies` while keeping the visible port id and row label `SolidBody`.
3. Change the positive-path extrude compute result from `{ bodyId: '${nodeId}:body' }` to `{ bodies: [{ bodyId: '${nodeId}:body' }] }`, keeping invalid/waiting cases at `null`.
4. Update the focused `evaluateGraph` extrude proofs so every successful path asserts the wrapped aggregate output shape and every invalid path still asserts `null`.
5. Re-read the current singular `SolidBody` node-surface render path in `NodeView.tsx` and make the smallest visible contract adjustment needed so the row stays honest as an aggregate-capable output.
6. Extend focused registry, evaluator, and node-surface tests around the new collection-capable extrude output contract while keeping `Output Preview` rejection unchanged.

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/registry/nodeRegistry.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- if the node-surface wording stays very narrow, keep at least one evaluator proof and one node-surface proof in the final verification set

Definition of done:
- `Nodes-5.2` is now shipped
- `Geometry/Extrude` is the first explicit collection-capable geometry publisher
- `Nodes-5.3` can now widen `Output Preview` acceptance without also having to invent the first collection-capable geometry publisher

## [x] `Nodes-5.3` - `Output Preview Collection Input Acceptance`

Purpose:
- let `Output Preview` accept singular body and body-collection sources honestly

Owns:
- output-preview input contract widening
- source normalization from singular versus collection sources
- preview-preparation input acceptance rules

Does not own:
- final grouped-versus-split publication policy
- deeper per-body child-row display

Suggested seams:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- focused output-preview and preview-preparation tests

Shipped result:
- `src/app/spaghetti/contracts/endpoints.ts` now widens the `Output Preview in:solid:*` compatibility bridge so slot ports accept:
  - atomic `solidBody`
  - aggregate `solidBodies`
  - legacy `toeLoft`
- `src/app/spaghetti/compiler/validateGraph.test.ts` now proves that `solidBodies -> Output Preview in:solid:*` is accepted instead of failing as `EDGE_TYPE_MISMATCH`
- `src/app/spaghetti/contracts/contractParity.test.ts` now proves the cheap-check/canonical-validator parity for `Geometry/Extrude.SolidBody -> Output Preview in:solid:*`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts` now proves that a collection-fed `Extrude -> Output Preview` slot still normalizes through the current one-slot preview/output surface with one resolved slot entry, one preview entry, and one viewer entry
- kept the pass narrow:
  - no grouped-versus-split publication metadata yet
  - no one-slot-to-many-entry output-surface widening yet
  - no per-body child-row UI expansion yet

Locked proving target:
- make `Output Preview in:solid:*` accept:
  - atomic `solidBody`
  - aggregate `solidBodies`
  - existing legacy `toeLoft` bridge
- keep max-connections behavior unchanged:
  - one incoming wire per `in:solid:${slotId}` port
- normalize singular and collection sources into the same one-slot preview-preparation surface for now
- keep one accepted slot mapped to one preview/output entry in this slice even when that slot's source is `solidBodies`
- do not invent grouped-versus-split publication metadata yet
- do not split one accepted `solidBodies` slot into multiple output entries or published objects yet

Questions / Decisions:

#### [ ] Question 1 - What exactly should `Output Preview in:solid:*` accept after this slice?

##### Suggested answer
- the slot should accept:
  - atomic `solidBody`
  - aggregate `solidBodies`
  - the existing legacy `toeLoft` bridge

##### Why
- that keeps the slot honest against both the newer graph-native body contracts and the still-supported legacy bridge
- it widens acceptance without forcing later publication semantics into the same pass

#### [ ] Question 2 - What should happen when a slot is fed by `solidBodies` in `Nodes-5.3`?

##### Suggested answer
- treat that collection source as one accepted slot source and normalize it into the existing one-slot preview/output surface for now

##### Why
- `previewPreparation.ts` and `outputSurface.ts` are still structurally one-slot-to-one-source and one-slot-to-one-entry
- changing that shape in the same pass would silently pull grouped-versus-split publication policy into `Nodes-5.3`

#### [ ] Question 3 - What should remain explicitly out of scope until `Nodes-5.4`?

##### Suggested answer
- whether one accepted `solidBodies` slot publishes:
  - one grouped object
  - multiple split objects

##### Why
- that is publication policy, not input acceptance
- the current normalized slot and output-entry structures are still single-entry seams, so `Nodes-5.4` should own any structural widening there

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`

Implementation-ready checks:
- widen endpoint compatibility so `solidBodies -> Output Preview in:solid:*` becomes legal without disturbing:
  - `solidBody -> Output Preview in:solid:*`
  - `toeLoft -> Output Preview in:solid:*`
- keep slot arity unchanged:
  - one incoming wire per `in:solid:${slotId}`
- keep `Output Preview` params and slot normalization narrow:
  - no grouped-versus-split authored mode yet
  - no extra per-member publication metadata yet
- teach `previewPreparation.ts` to treat an accepted `solidBodies` source as one valid slot source rather than only atomic `solidBody`
- keep the current one-slot surface honest:
  - one slot still yields one preview/output entry in `Nodes-5.3`
  - later `Nodes-5.4` may widen that into grouped-versus-split publication behavior
- prefer focused proof that covers:
  - accepted `solidBodies -> Output Preview in:solid:*`
  - preserved `solidBody` and `toeLoft` acceptance
  - preserved `maxConnectionsIn = 1`
  - one-slot normalization remaining stable when the source port kind is `solidBodies`

Acceptance checks:
- `Output Preview in:solid:*` now accepts `solidBodies` as well as `solidBody` and legacy `toeLoft`
- the slot-validation proof no longer treats `solidBodies -> Output Preview in:solid:*` as an `EDGE_TYPE_MISMATCH`
- preview preparation can normalize a slot fed by `solidBodies` without marking it unresolved just because the source is aggregate
- the output surface remains structurally one-slot-to-one-entry in this slice
- an implementer can start from the named endpoint, preview-preparation, and output-surface seams without re-deciding whether grouped-versus-split publication belongs here

Suggested execution order:
1. Re-read the `Output Preview in:solid:*` compatibility rule in `src/app/spaghetti/contracts/endpoints.ts` and the focused validation proofs in `src/app/spaghetti/compiler/validateGraph.test.ts`.
2. Widen slot acceptance so `solidBodies -> Output Preview in:solid:*` is legal alongside `solidBody` and `toeLoft`.
3. Re-read `src/app/spaghetti/previewPreparation.ts` and make the smallest normalization change needed so one slot can treat `solidBodies` as one accepted source while preserving current unresolved/null behavior.
4. Re-read `src/app/spaghetti/outputSurface.ts` and keep the current one-slot-to-one-entry structure honest for accepted collection-fed slots without adding grouped-versus-split publication semantics yet.
5. Extend focused validation and preview/output-surface proof around the widened slot acceptance while keeping grouped-versus-split publication behavior explicitly deferred.

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/compiler/validateGraph.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- if new focused `previewPreparation` or `outputSurface` tests are added in this slice, include them in the final verification set

Definition of done:
- `Nodes-5.3` is now shipped
- `Output Preview` can accept collection-capable body sources without yet deciding grouped-versus-split publication policy
- `Nodes-5.4` remains the explicit owner of whether one accepted body collection becomes one grouped object or multiple split objects

## [x] `Nodes-5.4` - `Grouped Versus Split Publication Contract`

Purpose:
- lock how one accepted body collection becomes one grouped published object or multiple split objects

Owns:
- grouped-versus-split authored/publication semantics
- object-surface mapping from collection to published output objects
- the explicit publication metadata needed to keep output structure honest

Does not own:
- broader worker/export adoption
- later multi-node family rollout

Suggested seams:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- Browser/content-facing tests that read published output objects

Shipped result:
- `src/app/spaghetti/system/outputPreviewNode.ts` now normalizes `Output Preview` slot-level `publicationMode` metadata with grouped back-compat defaults for older graphs
- `src/app/spaghetti/registry/nodeRegistry.ts` now accepts that optional grouped-versus-split slot metadata in the persisted `Output Preview` params schema
- `src/app/spaghetti/previewPreparation.ts` now carries per-slot publication mode and split member counts so one accepted `solidBodies` slot can fan out downstream without pretending it was multiple incoming wires
- `src/app/spaghetti/outputSurface.ts` now keeps grouped slots at one output entry but widens split slots into deterministic member-scoped output entries and published objects
- `src/app/spaghetti/integration/buildInputsToRequest.ts` now mirrors the same member-scoped output-entry identities for build-unit targeting
- focused proof landed in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
  - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
  - `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
  - `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- kept the pass narrow:
  - no authored `Geometry/Extrude` `Combine` versus `New Objects` mode yet
  - no visible per-body child-row expansion or drag-off wiring yet
  - no wider Browser/content hierarchy redesign beyond the output/publication surface

Current seam read:
- `src/app/spaghetti/system/outputPreviewNode.ts`
  - currently normalizes `OutputPreviewParams` with only:
    - `componentLabel`
    - `objects`
    - `slots`
    - `nextSlotIndex`
  - is therefore the schema owner for where grouped-versus-split publication metadata should live if the mode must be authored and persisted
- `src/app/spaghetti/previewPreparation.ts`
  - currently normalizes one accepted slot into one `PreviewPreparationEntry`
  - currently records one `sourceNodeId`, one `sourcePartKeyStr`, and one `sourcePortId` per slot
  - is therefore the narrowest live owner for deciding whether one accepted `solidBodies` slot stays one grouped publication source or fans out into multiple split publication entries
- `src/app/spaghetti/outputSurface.ts`
  - currently builds one `GraphPublishedOutputEntry` per slot id
  - currently derives `outputEntryId` from `slotId` plus `sourceNodeId`
  - currently lets the content surface become:
    - one direct object row for one published object
    - one grouped component row for multiple published objects across multiple slots
  - is therefore the owner seam for making one slot publish multiple output objects without pretending those came from separate slots
- focused proof already exists nearby:
  - `src/app/spaghetti/outputSurface.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
  - `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
  - `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- the sharpest current boundary is that this slice must widen publication semantics without pulling authored extrude result-shape choice forward from `Nodes-5.4a`

Locked proving target:
- add explicit grouped-versus-split publication metadata to `Output Preview` params rather than encoding publication meaning inside `solidBodies`
- keep the authored publication mode owned by `Output Preview`, not by the body payload and not by `Geometry/Extrude`
- start with one narrow publication rule for slots fed by `solidBodies`:
  - `grouped`
  - `split`
- preserve current singular-source honesty:
  - atomic `solidBody` and legacy `toeLoft` still publish as one object
  - grouped-versus-split only changes behavior when the accepted source is `solidBodies`
- let `grouped` keep the current one-slot-to-one-entry publication shape
- let `split` widen one accepted `solidBodies` slot into multiple output entries and published objects, one per atomic body member in source order
- keep the first pass deterministic:
  - stable per-member ordering must follow the `solidBodies.bodies[]` order already authored/published by the source value
  - split output ids should be derived from stable slot-plus-member identity rather than random IDs
- keep this pass publication-only:
  - no authored `Geometry/Extrude` `Combine` versus `New Objects` mode yet
  - no visible per-body child rows or drag-off wiring yet
  - no broader Browser hierarchy redesign beyond the output/content surface read

Questions / Decisions:

#### [ ] Question 1 - Where should the grouped-versus-split mode live?

##### Suggested answer
- in explicit `Output Preview` params/publication metadata

##### Why
- that matches the already-locked rule that grouped-versus-split meaning belongs to publication, not the body value itself
- `outputPreviewNode.ts` is already the schema owner for authored publication structure such as slots and object rows

#### [ ] Question 2 - What should the first-pass split behavior be for one accepted `solidBodies` slot?

##### Suggested answer
- when the slot publication mode is `split`, one accepted `solidBodies` source should fan out into one output entry and one published object per atomic body member in `bodies[]` order

##### Why
- that is the smallest honest way to distinguish grouped versus split publication in the current one-node proving lane
- it keeps multiplicity structural and explicit without requiring `Geometry/Extrude` to change authored result shape in the same pass

#### [ ] Question 3 - What should remain out of scope until `Nodes-5.4a` and `Nodes-5.5`?

##### Suggested answer
- `Geometry/Extrude` authored `Combine` versus `New Objects`
- visible child rows under the node output surface
- drag-off wiring from individual body members

##### Why
- those are separate seams:
  - `Nodes-5.4a` owns authored geometry result-shape choice
  - `Nodes-5.5` owns visible parent-versus-child body-row expansion

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`

Implementation-ready checks:
- widen `OutputPreviewParams` with the smallest explicit publication-mode metadata needed for one slot to say whether a collection source should publish as grouped or split
- keep the metadata deterministic and backward-compatible:
  - existing docs/graphs without explicit mode should normalize to current grouped behavior
- preserve one-slot input acceptance:
  - `maxConnectionsIn = 1` stays unchanged
  - one accepted wire may still fan out downstream only at publication time
- teach `previewPreparation.ts` to carry enough normalized source metadata for split publication without pretending one slot is multiple independent incoming wires
- widen `outputSurface.ts` so:
  - grouped mode keeps one output entry for the slot
  - split mode produces multiple output entries tied to the same slot but distinct per member
- keep content-surface truth honest:
  - one grouped object remains one object row or one object inside the grouped component row
  - one split collection becomes multiple published objects even when they came from one slot
- prefer focused proof that covers:
  - grouped default/back-compat behavior for existing slots
  - split behavior for a `solidBodies`-fed slot
  - preserved singular `solidBody` and legacy `toeLoft` behavior
  - stable output-entry identity and object ordering for split publication
- do not widen this pass into:
  - `Geometry/Extrude` authored mode rows
  - `NodeView.tsx` child-row expansion
  - Browser/container ownership cleanup unrelated to output publication truth

Acceptance checks:
- one explicit grouped-versus-split publication contract now exists on the `Output Preview` authored surface
- existing graphs without the new metadata still normalize to grouped one-slot-to-one-entry behavior
- one accepted `solidBodies` slot can now publish either:
  - one grouped output object
  - multiple split output objects
- split publication produces deterministic entry/object ordering and stable identity derived from slot-plus-member position
- singular `solidBody` and legacy `toeLoft` sources keep their current single-object publication behavior
- an implementer can start from the named output-preview, preview-preparation, and output-surface seams without re-deciding where publication policy lives

Suggested execution order:
1. Re-read the current `OutputPreviewParams` shape in `src/app/spaghetti/system/outputPreviewNode.ts` and add the smallest explicit publication-mode metadata needed for grouped versus split behavior.
2. Keep normalization backward-compatible so missing metadata still resolves to grouped publication.
3. Re-read `src/app/spaghetti/previewPreparation.ts` and widen the normalized preparation shape only enough to describe split publication from one accepted `solidBodies` slot.
4. Re-read `src/app/spaghetti/outputSurface.ts` and change the output-entry build so one grouped slot stays one entry while one split `solidBodies` slot fans out into multiple deterministic entries.
5. Update the content-surface mapping so split publication from one slot yields multiple published objects without pretending those objects came from different slots.
6. Extend focused output-surface and selector proof so grouped back-compat, split collection publication, and preserved singular behavior all move together.

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/outputSurface.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- if new focused `outputPreviewNode` or `previewPreparation` tests are added in this slice, include them in the final verification set

Definition of done:
- `Nodes-5.4` is now shipped
- grouped-versus-split publication policy is explicit on `Output Preview` instead of being implied by slot count or hidden inside the body value
- one accepted collection slot can now publish either one grouped object or multiple split objects without waiting for authored extrude-mode work
- `Nodes-5.4a` is now shipped:
  - `src/app/spaghetti/registry/nodeRegistry.ts` now persists authored `bodyGenerationMode: 'Combine' | 'NewObjects'` and computes `Geometry/Extrude.SolidBody` as either one atomic `solidBody` or one wrapped `solidBodies` collection based on authored mode
  - `src/app/spaghetti/features/effectivePorts.ts` and the shared validation/evaluation seams now switch the effective parent output contract between singular `SolidBody` and aggregate `SolidBodies` while preserving the stable `portId: 'SolidBody'`
  - `src/app/spaghetti/canvas/NodeView.tsx` now renders one non-wire `Output` para-select row above the output surface and lets the parent output-row label follow authored truth without yet expanding child body rows
- the next honest move is therefore `Nodes-5.5`: expose child `SolidBody` rows only when the authored extrude result is plural
- after that row/wiring pass, `Nodes-5.5a` should polish the still older `Output Preview` surface so one accepted `SolidBodies` source reads honestly as a collection-aware slot and, when split, as multiple published object rows from one upstream collection source

## [x] `Nodes-5.4a` - `Extrude Combine Versus New Objects Authored Contract`

Purpose:
- give `Geometry/Extrude` one explicit authored body-generation mode that decides whether multiple contributing profiles merge into one resulting body or stay as multiple new bodies

Owns:
- the new `Geometry/Extrude` para-select/authored mode above the `SolidBody` output row
- the first Fusion-aligned `Combine` versus `New Objects` contract for extrude result shape
- the rule that authored geometry-generation intent may choose whether extrude surfaces one singular `SolidBody` output row or one aggregate `SolidBodies` output row before later publication and child-row display

Does not own:
- `Output Preview` grouped-versus-split publication semantics
- broader later boolean-family adoption such as `Join`, `Cut`, or `Intersect`
- the full visible per-body child-row and drag-off wiring surface

Shipped result:
- `src/app/spaghetti/registry/nodeRegistry.ts` now persists authored `bodyGenerationMode: 'Combine' | 'NewObjects'`, defaults older graphs to `NewObjects` for back-compat, and computes either one atomic `solidBody` or one wrapped `solidBodies` result from the same stable `SolidBody` port id
- `src/app/spaghetti/features/effectivePorts.ts`, `src/app/spaghetti/compiler/evaluateGraph.ts`, and the shared validation path now switch the effective `Geometry/Extrude.SolidBody` output contract between singular `solidBody` and aggregate `solidBodies` according to authored mode
- `src/app/spaghetti/canvas/NodeView.tsx` now renders one non-wire `Output` para-select row above the parent output row and switches the visible parent output-row label between `SolidBody` and `SolidBodies`
- focused proof now covers authored-mode default normalization, atomic-versus-aggregate evaluator truth, dynamic output-port compatibility, and the visible extrude output-row contract without yet widening into child-member rows

Suggested seams:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/evaluateGraph.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- focused extrude contract, evaluator, and node-surface tests

Current seam read:
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - currently persists `Geometry/Extrude` params with:
    - `extrudeType`
    - `extrudeDirection`
    - `depthMm`
    - `startDepthMm`
    - `endDepthMm`
    - `taperAngleDeg`
  - currently has no authored result-shape field for `Combine` versus `New Objects`
  - currently computes one wrapped `solidBodies` aggregate whenever publication is valid, regardless of whether the incoming sketch source is singular or aggregate
  - is therefore the schema and evaluator owner for the new authored mode plus the first rule that mode changes both the extrude result shape and the visible parent output-row contract before downstream publication
- `src/app/spaghetti/canvas/NodeView.tsx`
  - currently renders explicit extrude managed rows for:
    - `Type`
    - `Direction`
    - depth/taper controls
    - one calm `SolidBody` output row
  - already imports and uses `ParaSelect` plus the shared enum-row machinery nearby
  - is therefore the narrowest live owner for surfacing a dedicated authored `Combine` versus `New Objects` row above `SolidBody` without yet widening into child-row expansion
- focused proof already exists nearby:
  - `src/app/spaghetti/registry/nodeRegistry.test.ts`
  - `src/app/spaghetti/registry/extrudeParams.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- the sharpest current boundary is that this slice must change authored extrude intent and result-shape truth without moving grouped-versus-split publication ownership back out of `Output Preview`

Locked proving target:
- add one authored `Geometry/Extrude` mode row above `SolidBody`, implemented as a para-select rather than a publication-only toggle on the output row itself
- start with exactly two options:
  - `Combine`
  - `New Objects`
- align the authored meaning to the Fusion-style mental model:
  - `Combine` means multiple contributing sketch profiles resolve into one resulting extruded body contract and the node surfaces one singular `SolidBody` parent output row
  - `New Objects` means multiple contributing sketch profiles resolve into a collection-capable `solidBodies` result and the node surfaces one aggregate `SolidBodies` parent output row with later parent-versus-child row expansion
- keep grouped-versus-split publication semantics in `Nodes-5.4`, downstream from this authored geometry-generation choice
- keep the body value contract explicit:
  - do not overload `solidBody` to mean one-or-many
  - do not move publication metadata into the body payload
  - do not let the para-select become a hidden substitute for explicit type truth
- let later `Nodes-5.5` own the full visible `SketchProfiles` / `SketchProfile`-style child-row expansion and wiring surface when the authored result is plural
- keep the first authored compute rule deterministic and narrow:
  - `Combine` should resolve valid extrude publication to one atomic `solidBody` result and therefore one singular `SolidBody` parent row
  - `New Objects` should resolve valid extrude publication to one wrapped `solidBodies` result and therefore one aggregate `SolidBodies` parent row
  - singular sketch input may still be normalized honestly through either mode without inventing fake second bodies
- let the visible parent-row label follow the authored truth in this pass:
  - `SolidBody` for `Combine`
  - `SolidBodies` for `New Objects`
- keep `Nodes-5.4a` focused on authored extrude truth, not downstream publishing:
  - `Output Preview` still owns whether a collection publishes grouped or split
  - this pass only decides what extrude itself authors as its result contract

Questions / Decisions:

#### [ ] Question 1 - Should the authored mode live on the output row itself or as its own row above `SolidBody`?

##### Suggested answer
- add a dedicated authored mode row above `SolidBody`

##### Why
- that makes the geometry-generation intent explicit before any publication step
- it matches the familiar Fusion-style authoring model better than a downstream publication toggle attached directly to the output row

#### [ ] Question 2 - What should the first authored mode options be?

##### Suggested answer
- start with:
  - `Combine`
  - `New Objects`

##### Why
- those two options cover the immediate body-count contract without widening the pass into the fuller boolean-family surface too early
- later `Join`, `Cut`, and related options can extend the same authored row once the narrow proving case is stable

#### [ ] Question 3 - Why is this not part of `Nodes-5.4`?

##### Suggested answer
- because it changes authored geometry-generation intent and extrude result shape, not just how an already-accepted collection gets published downstream

##### Why
- keeping it separate preserves the one-owner boundary:
  - `Nodes-5.4` owns publication semantics
  - `Nodes-5.4a` owns authored extrude result-shape choice
  - `Nodes-5.5` owns visible per-body row expansion and wiring

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/registry/nodeRegistry.test.ts`
- `src/app/spaghetti/registry/extrudeParams.test.ts`
- `src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

Implementation-ready checks:
- widen `Geometry/Extrude` params with the smallest explicit authored mode field needed for:
  - `Combine`
  - `New Objects`
- keep the new authored mode deterministic and backward-compatible:
  - existing graphs without the new field should normalize to the current calm default
  - that default should be chosen explicitly in code and tests rather than left implicit
- make the authored mode affect the extrude result-shape contract honestly:
  - `Combine` publishes one atomic `solidBody` result when publication is valid
  - `New Objects` publishes one wrapped `solidBodies` result when publication is valid
  - invalid or waiting extrude cases still publish `null`
- make the authored mode affect the visible parent output-row contract honestly:
  - `Combine` surfaces one singular `SolidBody` row
  - `New Objects` surfaces one aggregate `SolidBodies` row
  - child `SolidBody` rows stay deferred until `Nodes-5.5`
- preserve the current input-side wiring and depth-direction behavior:
  - do not reopen `extrudeType`, `extrudeDirection`, or `TwoSides` depth rules beyond what the new authored mode requires
- surface the authored mode in `NodeView.tsx` as one explicit row above the current output row, with the parent output label switching between `SolidBody` and `SolidBodies` to match authored truth
- keep the node surface calm in this pass:
  - no per-body child-row expansion yet
  - no drag-off wiring from individual body members yet
  - no output-row publication selector, because publication already belongs to `Nodes-5.4`
- prefer focused proof that covers:
  - default/back-compat authored mode normalization
  - `Combine` versus `New Objects` evaluator result-shape truth
  - visible extrude row presence and copy for the new mode surface
  - `SolidBody` versus `SolidBodies` parent-row copy and presence without child-member expansion yet
- do not widen this pass into:
  - `Output Preview` publication metadata changes
  - `previewPreparation.ts` or `outputSurface.ts` grouped-versus-split logic
  - `selectNodeVm.ts` child-row expansion

Acceptance checks:
- one explicit authored extrude mode now exists for `Combine` versus `New Objects`
- existing graphs without that mode still normalize to the chosen backward-compatible default
- `Geometry/Extrude` no longer always publishes the same result shape regardless of authored intent
- `Combine` and `New Objects` are distinguishable in focused evaluator proof through atomic-versus-aggregate result shape
- the extrude node surface exposes the new authored mode and switches the parent output-row contract between `SolidBody` and `SolidBodies` without yet requiring per-body child rows
- an implementer can start from the named registry, evaluator, and node-surface seams without re-deciding whether this behavior belongs to authored geometry or downstream publication

Suggested execution order:
1. Re-read the current `Geometry/Extrude` params schema and default params in `src/app/spaghetti/registry/nodeRegistry.ts`, then add the smallest explicit authored mode field for `Combine` versus `New Objects`.
2. Add or update focused param-reader proof so the new mode has one deterministic default for older graphs.
3. Re-read the current `Geometry/Extrude` compute path and make the authored mode decide whether valid publication resolves to atomic `solidBody` or aggregate `solidBodies`.
4. Update focused `evaluateGraph` proof so `Combine` and `New Objects` assert different result shapes while invalid/waiting paths still assert `null`.
5. Re-read the current extrude managed row stack in `src/app/spaghetti/canvas/NodeView.tsx` and add one explicit mode row above the output surface while making the parent output row switch between `SolidBody` and `SolidBodies` without reopening per-body child-row UI.
6. Extend focused registry and node-surface proof so the new authored row is visible and the parent output row truthfully follows `Combine` versus `New Objects`.

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/registry/nodeRegistry.test.ts src/app/spaghetti/registry/extrudeParams.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/compiler/evaluateGraph.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- if compile-payload seams need a focused truth update for the new authored mode, include the matching `compileGraph` test in the final verification set

Definition of done:
- `Nodes-5.4a` is now shipped
- `Geometry/Extrude` owns one explicit authored `Combine` versus `New Objects` contract instead of relying on downstream publication toggles to imply geometry intent
- the authored mode changes both extrude result-shape truth and the visible parent output-row contract while leaving `Output Preview` as the owner of grouped-versus-split publication semantics
- `Nodes-5.5` remains the explicit owner of visible per-body child-row expansion and wiring

## [x] `Nodes-5.5` - `Per-Body Expansion And Wiring Surface`

Purpose:
- expose individual collection members as real child rows when the collection is not unified

Owns:
- visible parent-versus-member body-row contract
- per-body child-row expansion
- drag-off wiring direction for individual bodies

Does not own:
- full later-family adoption beyond the proving case
- `Output Preview` slot/object-row polish beyond the minimum truth needed to keep member wiring honest

Suggested seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- focused node-surface and selector tests

Shipped result:
- `src/app/spaghetti/features/extrudeBodyVirtualPorts.ts` now owns deterministic plural extrude member output ids plus the first runtime read for one atomic child `SolidBody` member per collection index
- `src/app/spaghetti/features/effectivePorts.ts` and `src/app/spaghetti/contracts/endpoints.ts` now resolve those plural extrude member outputs as real source endpoints when authored extrude mode is `New Objects`
- `src/app/spaghetti/compiler/evaluateGraph.ts` now publishes atomic child member outputs beside the aggregate parent `SolidBodies` output, so downstream wiring can consume one member without flattening the parent collection contract
- `src/app/spaghetti/selectors/selectNodeVm.ts` now carries plural extrude member-port truth into the node VM while keeping unrelated node-output surfaces unchanged
- `src/app/spaghetti/canvas/NodeView.tsx` now reveals one child `SolidBody` row per resolved member under the parent `SolidBodies` row only when authored output mode is `New Objects`
- `Combine` remains singular:
  - one parent `SolidBody` row
  - no child body rows
- focused proof landed in:
  - `src/app/spaghetti/features/effectivePorts.test.ts`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/compiler/validateGraph.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- the next honest move is therefore `Nodes-5.5a`: polish the older `Output Preview` collection surface now that plural extrude child outputs are visible and wireable

Current seam read:
- `Nodes-5.4a` already locked the authored parent-row truth:
  - `Combine` surfaces one singular parent `SolidBody` row
  - `New Objects` surfaces one aggregate parent `SolidBodies` row
- the live extrude node surface in `src/app/spaghetti/canvas/NodeView.tsx` already has the right managed-row shell pieces:
  - one stable managed parent output row via `renderManagedGeometryOutputPort(...)`
  - one authored `Output` para-select above that row
  - one existing sketch precedent where a collection parent row can reveal explicit child member rows in the attached body
- the live selector seam in `src/app/spaghetti/selectors/selectNodeVm.ts` already computes enough proving truth to drive this pass:
  - `bodyGenerationMode`
  - `bodyId`
  - `bodyCount`
  - the effective output value shape read from `evaluation.outputsByNodeId[node.nodeId]?.SolidBody`
- the sharpest current boundary is therefore not another evaluator or output-contract rewrite:
  - it is visible parent-plus-child row expansion only when the authored extrude result is plural
  - `Combine` should stay visually calm and singular

Locked proving target:
- in authored `Combine` mode:
  - keep one singular `SolidBody` parent row
  - do not show child body rows
- in authored `New Objects` mode:
  - keep one aggregate `SolidBodies` parent row
  - let that parent row expand into one child `SolidBody` row per resolved member body
  - each child row should be a real output row with its own drag-off wiring surface rather than decorative text only
- keep the parent row as the aggregate owner:
  - dragging from the parent still means the whole `SolidBodies` collection
  - dragging from a child means one atomic `SolidBody` member
- follow the already-proven sketch collection-parent contract:
  - parent row owns the collection summary and attached body
  - child rows are explicit members of that same parent value
- keep the first pass narrow:
  - no `Output Preview` row polish beyond what is minimally needed to keep child wiring honest
  - no new collection semantics in evaluator or preview preparation
  - no later `Loft` / `Sweep` / `Boolean` adoption in this pass

Questions / Decisions:

#### [ ] Question 1 - When should child `SolidBody` rows be visible?

##### Suggested answer
- only when authored extrude output mode is `New Objects` and the parent `SolidBodies` result is the active truth

##### Why
- `Combine` is explicitly singular after `Nodes-5.4a`
- showing child rows in `Combine` would fight the authored output contract and create fake member truth

#### [ ] Question 2 - What should the parent wire versus child wires mean?

##### Suggested answer
- parent wire = whole `SolidBodies` collection
- child wire = one atomic `SolidBody` member

##### Why
- this matches the already-proven `SketchProfiles` versus `SketchProfile` parent/member contract
- it gives users one clean choice between grouped collection wiring and individual member wiring

#### [ ] Question 3 - What data should drive child row count in the first pass?

##### Suggested answer
- the resolved evaluated extrude output and selector-owned `bodyCount`, not only authored contributor count

##### Why
- the surface should reflect actual published members
- later geometry families may not always map one input contributor to one output body, so the first pass should stay attached to resolved output truth

Implementation-ready checks:
- re-read the existing sketch collection attached-body pattern in `src/app/spaghetti/canvas/NodeView.tsx` and reuse that parent-versus-child ownership model instead of inventing a new row family
- keep the stable extrude parent port id as `SolidBody` while letting the visible parent row surface switch between `SolidBody` and `SolidBodies` exactly as `Nodes-5.4a` already locked
- add one deterministic child-row identity scheme for plural extrude members so expanded rows stay stable across renders
- make child-row labels stay simple and explicit:
  - visible row label `SolidBody`
  - member identity/detail copy can carry index or body id
- route child drag-off wiring through real output endpoints rather than fake UI-only rows
- preserve calm behavior when:
  - there are zero resolved bodies
  - there is exactly one resolved body in `New Objects`
  - the node is collapsed or not expanded enough to show attached body content
- keep this pass focused on the proving case:
  - `Geometry/Extrude`
  - one plural `SolidBodies` output
  - one visible collection parent with member rows

Acceptance checks:
- in `Combine`, `Geometry/Extrude` still shows one singular `SolidBody` output row and no child rows
- in `New Objects`, the `SolidBodies` parent row can expand into one child `SolidBody` row per resolved member
- dragging from the parent row still represents the aggregate collection output
- dragging from a child row represents one atomic member output
- the node surface now makes the parent-versus-member contract visible instead of requiring users to infer it from collection wording alone

Suggested implementation order:
1. Re-read the existing sketch collection attached-body and child-row rendering in `src/app/spaghetti/canvas/NodeView.tsx`.
2. Confirm the selector already exposes enough plural extrude truth in `src/app/spaghetti/selectors/selectNodeVm.ts`; only widen that VM if a child-row identity or per-member list is truly missing.
3. Extend the extrude managed output attached body so `New Objects` can render real member rows while `Combine` remains singular.
4. Thread those child rows through real output-row rendering and pointer registration so they behave like actual draggable member outputs.
5. Add focused proof for:
   - `Combine` = no child rows
   - `New Objects` = child rows visible
   - parent versus child wiring affordance
   - selector truth if VM shape changed

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectNodeVm.test.ts`
- if virtual-port or endpoint plumbing changes, include the matching focused compatibility test in the final verification set

Definition of done:
- `Nodes-5.5` is now shipped
- authored `Combine` stays a singular parent output surface
- authored `New Objects` exposes explicit child `SolidBody` rows under the aggregate `SolidBodies` parent
- parent-versus-member wiring meaning is visible and real on the extrude surface
- `Nodes-5.5a` remains the owner of later `Output Preview` collection-surface polish

## [x] `Nodes-5.5a` - `Output Preview Collection Surface Polish`

Purpose:
- make the older `Output Preview` node surface read honestly when one accepted slot is driven by a `SolidBodies` collection, especially in authored `New Objects` plus split-publication cases

Owns:
- collection-aware `Output Preview` slot-row wording and visual presentation
- better readability when one accepted `SolidBodies` source publishes multiple output objects
- narrow UI polish for how the parts/object list narrates one collection source versus many published objects

Does not own:
- changing the already-shipped grouped-versus-split publication contract
- reopening `Geometry/Extrude` authored output-mode semantics
- full later-family geometry adoption beyond `Extrude` and `Output Preview`

Suggested seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- focused `Output Preview` node-surface, selector, and output-surface tests

Shipped result:
- `src/app/spaghetti/selectors/selectNodeVm.ts` now exposes collection-aware `Output Preview` slot-row narration, including explicit singular-versus-collection source wording plus deterministic child published-object rows when one split `SolidBodies` source fans out into many published objects
- `src/app/spaghetti/canvas/NodeView.tsx` now renders those collection-aware slot rows honestly:
  - one accepted collection source still reads as one slot row
  - split publication now renders explicit child published-object rows under that owning slot instead of reading like many unrelated singular sources
  - split collection label editing now reads as one `Object Prefix` owner rather than many fake independent object editors
- focused proof landed in:
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
- the next honest move is therefore `Nodes-5.5b`: show sketch-like placeholder child `SolidBody` member rows earlier on the unresolved authored `New Objects` extrude surface

Current seam read:
- the contract layer now already supports the right truth:
  - one `SolidBodies` source may legally feed `Output Preview in:solid:*`
  - one accepted slot may publish grouped as one object or split into many object identities
- the prep and publication layers already carry the right downstream facts:
  - `src/app/spaghetti/previewPreparation.ts` now tracks `publicationModeBySlotId`, `splitMemberCountBySlotId`, and member-scoped preview entries
  - `src/app/spaghetti/outputSurface.ts` now widens one split slot into many published object rows with deterministic `member-XXX` ids and labels
- the visible `Output Preview` surface is older and still reads like a one-slot-to-one-object era UI:
  - the input row still looks singular-first because `renderOutputPreviewTemplate(...)` mainly narrates one slot as one object row with only light secondary meta
  - the parts/object list can feel like repeated singular slots instead of one collection source widening into multiple published objects
  - split publication from one collection source needs better provenance readability so users can tell which object rows came from the same upstream `SolidBodies` wire
  - grouped collection sources and singular `SolidBody` sources should remain visually distinct without inventing new runtime meaning
- the sharpest current boundary is therefore not another contract rewrite:
  - it is visible polish so the node surface matches the already-shipped collection and split-publication truth
  - the pass should stay mostly in node-surface narration and row presentation, with only the smallest selector/preparation/output-surface touches needed to expose already-owned truth cleanly

Locked proving target:
- keep one accepted upstream slot contract:
  - do not invent multi-wire collection fan-in for this pass
- make one collection-fed slot read explicitly as a collection-capable source when the connected port kind is `solidBodies`
- make split-publication cases read explicitly as multiple published objects derived from one upstream collection source
- preserve grouped back-compat readability for singular `SolidBody` and grouped `SolidBodies` cases
- prefer the smallest honest row/UI adjustment that improves scan clarity without reopening the output-preview data model again

Questions / Decisions:

#### [ ] Question 1 - What should the user be able to tell at a glance after this pass?

##### Suggested answer
- whether a slot is driven by one atomic `SolidBody` or one aggregate `SolidBodies` collection
- whether many published object rows come from one split collection source or from many separate slot sources

##### Why
- that is the exact honesty gap left after the contract work shipped
- it improves scan clarity without inventing new authored behavior

#### [ ] Question 2 - Where should `5.5a` stop?

##### Suggested answer
- at surface narration, slot/object row readability, and light selector/output-surface exposure of already-existing truth

##### Why
- publication mode, member count, and object fan-out already shipped in `Nodes-5.4`
- authored extrude plurality already shipped in `Nodes-5.4a` and `Nodes-5.5`
- this pass should not reopen those owners just to improve wording and row readability

#### [ ] Question 3 - Which current seams are the most likely real owners?

##### Suggested answer
- `src/app/spaghetti/canvas/NodeView.tsx` for visible slot/object-row structure and wording
- `src/app/spaghetti/selectors/selectNodeVm.ts` if the Output Preview VM needs one clearer collection-source descriptor
- `src/app/spaghetti/outputSurface.ts` and `src/app/spaghetti/previewPreparation.ts` only if one already-computed fact needs to be exposed more directly to the node UI

##### Why
- the contract and publication truth already exists lower down
- the missing piece is making that truth legible in the visible node surface

Implementation-ready checks:
- re-read `renderOutputPreviewTemplate(...)` in `src/app/spaghetti/canvas/NodeView.tsx` and identify the smallest row changes that can distinguish:
  - singular source slot
  - grouped collection source slot
  - split collection source slot
- prefer using already-owned facts from preview preparation/output surface rather than recomputing collection logic inside the node template
- keep one accepted input row per slot:
  - do not turn one slot into many input pins
  - do not make `Output Preview` look like it accepted many separate upstream wires when it only accepted one collection source
- make the published object list read honestly when one slot fans out into many objects:
  - object labels may remain editable
  - provenance/meta copy should clarify they came from one split collection source
- preserve grouped and singular back-compat:
  - singular `SolidBody` should still read calmly
  - grouped `SolidBodies` should still read as one published object from one collection source
- keep this pass narrow:
  - no new `publicationMode` schema rules
  - no new slot connection semantics
  - no extrude row changes
  - no worker/export/runtime changes beyond already-owned surface truth exposure

Suggested implementation order:
1. Re-read the current `Output Preview` slot/object rows in `src/app/spaghetti/canvas/NodeView.tsx`.
2. Confirm which already-shipped facts from `src/app/spaghetti/previewPreparation.ts` and `src/app/spaghetti/outputSurface.ts` the node surface is not yet exposing clearly.
3. Add the smallest selector or row-view-model widening only if the current node surface cannot cheaply read the needed collection-source truth.
4. Adjust the slot-row and published-object-row narration so split collection publication reads as “one collection source -> many objects” instead of “many unrelated singular rows”.
5. Add focused proof for:
   - singular `SolidBody` slot readability
   - grouped `SolidBodies` slot readability
   - split `SolidBodies` publication readability
   - deterministic object-row provenance when many objects come from one slot

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `npm.cmd exec vitest run src/app/spaghetti/outputSurface.test.ts src/app/spaghetti/previewPreparation.ts`
- if the node VM or Output Preview node params surface changes, include the matching focused test in the final verification set

Acceptance checks:
- a user can tell when an `Output Preview` slot is fed by one `SolidBodies` collection rather than one atomic `SolidBody`
- a user can tell when one accepted collection source is publishing multiple object rows because publication is split, not because multiple unrelated slots were connected
- the `Output Preview` node surface reads as collection-aware instead of frozen in the older singular-only visual model

Definition of done:
- `Nodes-5.5a` is now shipped
- the `Output Preview` node surface now reads as collection-aware instead of frozen in the older singular-only slot/object model
- the pass stayed on visible Output Preview collection-surface polish rather than reopening publication contracts or authored extrude semantics
- `Nodes-5.5b` is now the explicit owner of unresolved placeholder `SolidBody` member-row readiness

## [x] `Nodes-5.5b` - `Placeholder Body Member Rows Before Resolution`

Purpose:
- let authored `New Objects` show sketch-like child `SolidBody` placeholder rows under the parent `SolidBodies` row before the extrude has fully resolved real member outputs

Owns:
- unresolved and pre-resolution child-row visibility for authored plural extrude output
- placeholder narration for expected member rows while the parent `SolidBodies` row is still waiting
- the first honest rule for when child drag targets may appear before fully resolved runtime body ids exist

Does not own:
- changing the shipped resolved-member output-port contract from `Nodes-5.5`
- reopening `Output Preview` slot/object narration from `Nodes-5.5a`
- inventing fake published geometry or fake body ids when no authored basis exists

Suggested seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/features/effectivePorts.ts`
- focused extrude node-surface and selector tests

Shipped result:
- `src/app/spaghetti/selectors/selectNodeVm.ts` now preserves deterministic child `SolidBody` member port ids for authored `New Objects` even before runtime body outputs resolve, using resolved body members when present and otherwise falling back to the strongest available profile-side truth for the proving case
- `src/app/spaghetti/canvas/NodeView.tsx` now renders those early child rows beneath the parent `SolidBodies` row as explicit waiting placeholders with deterministic member identity and unresolved copy instead of hiding the per-body surface until body results exist
- `Combine` remains singular:
  - one parent `SolidBody` row
  - no placeholder child rows
- focused proof landed in:
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- the next honest move is therefore `Nodes-5.6`: close the body-collection lane with regression proof and family handoff

Current seam read:
- `Nodes-5.5` already proved the resolved case:
  - when authored mode is `New Objects` and evaluated `solidBodies` members exist, the parent `SolidBodies` row can reveal one real child `SolidBody` row per member with real drag-off pins
- the remaining UX gap appears earlier:
  - while the parent row is still `Waiting`, users cannot yet see the future per-body wiring surface
  - this feels rough next to the already-proven `SketchProfiles` parent row, which exposes explicit member rows more eagerly
- the sharpest current boundary is therefore not another output-contract change:
  - it is whether authored plural extrude truth should surface placeholder member rows before full result resolution
  - and, if so, what the placeholder row count should be allowed to come from without inventing fake geometry truth
- the strongest nearby live seams are now clearer after `Nodes-5.5` and `Nodes-5.5a` shipped:
  - `src/app/spaghetti/canvas/NodeView.tsx` already has the parent `SolidBodies` managed-row shell plus the resolved child-row rendering branch
  - `src/app/spaghetti/selectors/selectNodeVm.ts` already owns authored `bodyGenerationMode`, resolved `bodyCount`, and member-port ids, but does not yet expose a pre-resolution placeholder count
  - the likely next owner question is therefore whether authored aggregate profile truth, not runtime body truth, should provide the first honest placeholder count for unresolved `New Objects`

Locked proving target:
- in authored `Combine` mode:
  - keep one singular parent `SolidBody` row
  - never show placeholder child rows
- in authored `New Objects` mode:
  - allow the parent `SolidBodies` row to reveal child placeholder `SolidBody` rows before runtime body ids resolve when there is already enough authored or upstream source truth to justify the expected count
  - preserve the already-shipped resolved-member rows once real member outputs exist
- keep the parent row as the aggregate owner:
  - parent row still means the whole `SolidBodies` collection
  - placeholder child rows should read as future atomic members of that same parent collection
- do not invent fake body ids:
  - placeholder rows may use deterministic member index identity and waiting copy
  - resolved runtime body ids should replace placeholder copy once available

Questions / Decisions:

#### [ ] Question 1 - What should drive placeholder child-row count before resolution?

##### Suggested answer
- the strongest already-available authored or upstream aggregate truth, with resolved output still taking priority once it exists

##### Why
- it keeps the surface honest enough to preview the likely member shape without pretending unresolved geometry is already built
- it matches the user expectation set by `SketchProfiles` while preserving graph-authored ownership

#### [ ] Question 2 - Should placeholder child rows be wireable immediately?

##### Suggested answer
- yes, but only if the endpoint/virtual-port contract can stay deterministic before resolution; otherwise show visible placeholder rows first and defer active drag pins to the smallest honest follow-on

##### Why
- the main value of these rows is earlier per-body wiring affordance
- but fake endpoint identity would be worse than a brief placeholder-only surface if deterministic ports are not yet truly stable

#### [ ] Question 3 - Where should `5.5b` stop?

##### Suggested answer
- at authored `New Objects` placeholder child-row visibility and, if honest, deterministic pre-resolution member drag targets for `Geometry/Extrude` only

##### Why
- `Nodes-5.5` already owns the resolved-member case
- `Nodes-5.5a` already owns `Output Preview`
- later geometry families should not be pulled into this proving pass

Implementation-ready checks:
- re-read the existing `SketchProfiles` parent/member surface in `src/app/spaghetti/canvas/NodeView.tsx` and the shipped resolved extrude member-row path from `Nodes-5.5`
- identify the smallest selector-owned count source that can justify placeholder rows in authored `New Objects` mode before `solidBodies` resolution
- prefer using already-available authored profile aggregate truth from the extrude input path if that is the strongest honest predictor of expected body members in the proving case
- keep child-row identity deterministic so placeholder rows and resolved rows can transition calmly
- preserve the current waiting parent summary and make child placeholder copy explicit:
  - these are expected member rows from one authored `SolidBodies` parent
  - they are not yet resolved body outputs unless runtime member truth exists
- keep the pass narrow:
  - no `Output Preview` changes
  - no grouped-versus-split publication changes
  - no later geometry family rollout

Suggested implementation order:
1. Re-read the shipped resolved-member logic in `src/app/spaghetti/canvas/NodeView.tsx` and `src/app/spaghetti/selectors/selectNodeVm.ts`.
2. Decide the smallest honest pre-resolution count source for authored `New Objects` member placeholders.
3. Add placeholder child rows under the parent `SolidBodies` row while preserving the current resolved-member path.
4. If deterministic virtual member ports already support it honestly, turn those placeholder rows into real early drag targets; otherwise stop at visible placeholder rows and note the remaining wiring gap explicitly.
5. Add focused proof for:
   - `Combine` = no placeholder child rows
   - `New Objects` waiting state = placeholder child rows visible when justified
   - resolved runtime member rows replace placeholder narration cleanly

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectNodeVm.test.ts`
- if endpoint or effective-port behavior changes, include the matching focused compatibility test in the final verification set

Acceptance checks:
- a user can see likely per-body child rows under `SolidBodies` before the extrude fully resolves when authored `New Objects` truth already justifies them
- `Combine` remains singular and calm
- resolved member rows still come from real runtime output truth once available
- the pass stays on extrude child-row readiness rather than drifting back into `Output Preview` or publication semantics

Definition of done:
- `Nodes-5.5b` is now shipped
- authored `New Objects` can expose sketch-like child `SolidBody` rows earlier when profile truth already justifies the expected member count
- those early rows stay honest as unresolved placeholders until runtime body outputs exist
- the family now hands forward to `Nodes-5.6` for hardening, regression proof, and broader handoff

## [ ] `Nodes-5.6` - `Hardening, Regression Proof, And Family Handoff`

Purpose:
- close the body-collection lane with explicit proof and handoff boundaries for later geometry families

Owns:
- focused regression matrix across evaluator, preview preparation, output surface, and node UI
- copy and visible contract cleanup
- explicit handoff wording for later `Loft` / `Sweep` / `Boolean` adoption

Does not own:
- implementing all later node families
- reopening earlier slices without a concrete regression

Suggested seams:
- focused tests under `src/app/spaghetti/`
- this doc plus `Nodes-Index.md`

## Suggested Execution Order

1. Lock the new collection-capable body type in `Nodes-5.1`.
2. Make `Extrude` publish that collection truth in `Nodes-5.2`.
3. Teach `Output Preview` to accept singular and collection sources in `Nodes-5.3`.
4. Lock grouped-versus-split publication semantics in `Nodes-5.4`.
5. Add the authored `Geometry/Extrude` `Combine` versus `New Objects` mode in `Nodes-5.4a`.
6. Widen the visible node/UI surface into per-body rows and wiring in `Nodes-5.5`.
7. Polish the older `Output Preview` collection surface in `Nodes-5.5a`.
8. Add unresolved placeholder body-member rows in `Nodes-5.5b`.
9. Finish with regression proof and family handoff in `Nodes-5.6`.

## Acceptance Checks

- the body-collection direction is explicit instead of implied
- `solidBody` remains atomic while collection meaning becomes first-class
- `Output Preview` no longer assumes one node source always means one singular body/object
- grouped-versus-split publication is explicitly owned and testable
- the lane is small enough that each subphase can be handed to Codex one at a time

## Definition Of Done

- `Nodes-5` exists as a real execution home instead of only an ad hoc idea
- the work is split into implementation-grade subphases small enough for one-owner execution
- later geometry-node families can inherit the same collection-capable body contract instead of reinventing it

# `Extrude-7` - `Multi-Wire SketchProfiles Input Enablement`

## Doc Header

### Doc History
11. 2026-04-09 00:31: Marked `Extrude 7 Phase 4 - Hardening And Family Handoff` shipped after graph-native preview preparation began invalidating stale extrude preview slots whenever `Extrude.SketchProfiles` stops publishing a valid `SolidBody`, the live viewer/store proof now covers that required-wire disconnect path, and the family closeout now explicitly hands later viewport, toolbar, and taxonomy work back out of `Extrude-7`
10. 2026-04-09 00:18: Tightened `Extrude 7 Phase 4 - Hardening And Family Handoff` again so the final slice now explicitly owns preview invalidation when `Extrude.SketchProfiles` loses a required contributor wire, locking that stale extrude geometry must disappear immediately instead of persisting as cached last-known-good output
9. 2026-04-09 00:15: Tightened `Extrude 7 Phase 4 - Hardening And Family Handoff` again after the shipped contributor-runtime regression fix, so the final slice now explicitly owns the remaining proof matrix around draft plus authoritative worker execution for cross-sketch whole-port `SketchProfiles` contributors, together with any last copy drift and the final family closeout wording
8. 2026-04-09 00:03: Marked `Extrude 7 Phase 3 - Selector And Surface Multi-Wire Parity` shipped after authored incoming contributor order, real expanded child-row wire anchors, and collapsed-versus-expanded extrude wire routing landed in the live selector and canvas seams, then tightened `Extrude 7 Phase 4 - Hardening And Family Handoff` into the next implementation-ready final slice around focused proof cleanup, closeout wording, and explicit out-of-family handoff boundaries
7. 2026-04-08 23:45: Tightened `Extrude 7 Phase 3 - Selector And Surface Multi-Wire Parity` into an implementation-ready next slice by grounding it in the live selector-owned `profileInputEntries` seam, the current extrude child-row rendering in `NodeView.tsx`, the still-stale edge-id ordering fallback, and the remaining need to make expanded child rows act as real wire-anchor targets instead of metadata-only summaries
6. 2026-04-08 23:30: Marked `Extrude 7 Phase 2 - Compile And Runtime Collection Meaning` shipped after the shared `geometryRequest` contract widened to an explicit ordered contributor collection, `evaluateGraph` and `compileGraph` began treating multi-wire `ExtrusionProfile` input as one ordered aggregate-plus-singular contributor list, and the family handoff moved forward to `Phase 3 - Selector And Surface Multi-Wire Parity`
5. 2026-04-08 23:21: Tightened `Extrude 7 Phase 2 - Compile And Runtime Collection Meaning` into an implementation-ready next slice by grounding it in the live singular-only `compileGraph` lowering seam, the current `geometryRequest` `single` / `allFromSketch` contract limit, and the focused compile/runtime proof needed before later selector or node-surface parity work
4. 2026-04-08 23:21: Marked `Extrude 7 Phase 1 - Input Port Contract Widening` shipped after `Geometry/Extrude.ExtrusionProfile` widened to an explicit unbounded multi-wire input, same-sketch plus cross-sketch profile contributors validated cleanly, and the family handoff moved forward to `Phase 2 - Compile And Runtime Collection Meaning`
3. 2026-04-08 23:06: Reworked this `Extrude-7` plan into the same execution-doc shape used by `Extrude-6` by promoting every remaining subphase into its own real `##` section, so `Phase 2` through `Phase 4` now exist as separate Codex-sized implementation surfaces instead of living only in the summary breakdown
2. 2026-04-08 22:57: Reworked `Extrude-7` around the explicit authored multi-wire vision that `Geometry/Extrude.SketchProfiles` should accept unlimited incoming `SketchProfile` and `SketchProfiles` wires from any sketch, locked that collapsed mode keeps all wires terminating at the one parent pin while expanded mode reveals one child row per actual incoming wire, and tightened `Extrude 7 Phase 1 - Input Port Contract Widening` into the first implementation-ready slice for widening the real port and validation contract to match that authored direction
1. 2026-04-08 22:49: Added this dedicated future phase doc by carving the true multi-wire `ExtrusionProfile` enablement lane out of the now-closed `Extrude-6` surface-contract subset, splitting the work into `Extrude 7 Phase 1` through `Phase 4`, and locking the new family around the real graph-contract widening from single-wire validation to honest multi-wire collection-input behavior

### Purpose

Use this doc as the dedicated planning and execution surface for the next extrude-owned contract follow-on after the closed `Extrude-6` collection-input surface lane.

The goal here is:
- widen the real `Geometry/Extrude.ExtrusionProfile` graph contract from today’s effective single-wire limit to an honest multi-wire collection input
- let the user wire in as many `SketchProfile` and `SketchProfiles` contributors as they want from any sketch
- carry that widened contract through validation, compile/runtime meaning, selector state, and visible node-surface behavior
- keep aggregate and singular contributor ownership explicit instead of letting multi-wire behavior become an accidental side effect of surface wording alone
- separate true graph-contract enablement from later viewport, toolbar, and broader sketch-taxonomy follow-ons

### Scope

This phase covers:
- the real inbound connection limit and validation contract for `Geometry/Extrude.ExtrusionProfile`
- authored acceptance of unlimited incoming `SketchProfile` and `SketchProfiles` wires from any sketch
- collapsed versus expanded wire-anchoring behavior for the extrude `SketchProfiles` row
- compile/runtime meaning for multiple incoming aggregate and singular profile contributors
- selector and node-surface parity once multi-wire is actually allowed
- focused hardening needed to close the first honest multi-wire extrude input subset

This phase does not cover:
- reopening the already-shipped `Extrude-6` parent-row and child-row surface contract except where the real multi-wire graph contract forces narrow parity updates
- viewport-owned profile picking or toolbar auto-wiring
- broader sketch curve, line, or point taxonomy rollout
- unrelated extrude output-row, taper, or body-management work

## Doc Body

### Summary

`Extrude-7` is the dedicated enablement lane for making `Geometry/Extrude` truly accept more than one incoming profile wire.

Current read:
- the closed `Extrude-6` lane made the visible input surface read like one real `SketchProfiles` collection row
- the live graph contract still behaves as single-wire because `ExtrusionProfile` falls back to `maxConnectionsIn = 1`
- that means the current surface contract and the real validated authoring contract are still out of sync
- the next honest extrude-owned step is no longer surface wording
- it is widening the actual input contract and proving the resulting compile/runtime, selector, and UI meaning end to end
- the authored vision for this lane is explicit:
  - the user can wire one `SketchProfile` from `Sketch 1` into `Extrude.SketchProfiles`
  - then wire a second `SketchProfile` from `Sketch 1` into that same row
  - then wire a third contributor from `Sketch 2`, where that wire may come from either `SketchProfile` or `SketchProfiles`
  - and continue adding as many wires as they want from any sketch using either contributor kind

Locked recommendation:
- treat `ExtrusionProfile` as a real multi-wire collection input
- let that input accept unlimited incoming wires from any sketch
- each incoming wire may be either:
  - `SketchProfile`
  - `SketchProfiles`
- keep aggregate whole-port `SketchProfiles` and singular `SketchProfile` contributors explicit all the way through the pipeline
- keep collapsed mode simple:
  - all incoming wires terminate visually at the one parent `SketchProfiles` pin
- keep expanded mode literal:
  - reveal one child row per actual incoming wire
  - route each wire to the matching child row
  - keep aggregate wires aggregate
  - keep singular wires singular
- keep child-row ordering authored and stable:
  - preserve incoming wire order instead of regrouping by sketch or contributor kind
- stage the widening in Codex-sized cuts:
  - input-port contract first
  - compile/runtime meaning second
  - selector and surface parity third
  - hardening and family handoff last

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/registry/nodeRegistry.ts`
  - owns the authoritative input-port contract for `Geometry/Extrude`
  - is where the current effective single-wire limit must become an explicit multi-wire contract
- `src/app/spaghetti/compiler/validateGraph.ts`
  - currently treats missing `maxConnectionsIn` as `1`
  - is the live validation seam that still prevents true multi-wire authoring on `ExtrusionProfile`
- compile/runtime seams under `src/app/spaghetti/compiler/` and downstream worker routing
  - are where multiple incoming aggregate and singular contributors will need one explicit lowering story instead of accidental last-write or first-write behavior
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already owns the extrude input-entry read
  - is the best seam for keeping selector meaning aligned once multi-wire becomes graph-valid instead of surface-only
- `src/app/spaghetti/canvas/NodeView.tsx`
  - already renders the collection row and visible child-entry list
  - is where the final visible contract must stay honest once the underlying graph contract really allows more than one wire

### Phase Breakdown

1. `Extrude 7 Phase 1 - Input Port Contract Widening`
Reason:
- the first honest cut is making `ExtrusionProfile` truly accept unlimited inbound `SketchProfile` and `SketchProfiles` wires at the registry and validation layer before widening compile/runtime meaning
Current status:
- shipped
- current handoff:
  - `Extrude 7 Phase 2 - Compile And Runtime Collection Meaning`

2. `Extrude 7 Phase 2 - Compile And Runtime Collection Meaning`
Reason:
- once multiple incoming wires are graph-valid, the next missing truth is how aggregate and singular contributors lower through compile/runtime without hidden ambiguity
Current status:
- shipped
- current handoff:
  - `Extrude 7 Phase 3 - Selector And Surface Multi-Wire Parity`

3. `Extrude 7 Phase 3 - Selector And Surface Multi-Wire Parity`
Reason:
- after the graph and runtime contract become real, the selector and node surface must prove they still tell the truth about actual authored multi-wire state, including collapsed-parent versus expanded-child wire anchoring
Current status:
- shipped
- current handoff:
  - `Extrude 7 Phase 4 - Hardening And Family Handoff`

4. `Extrude 7 Phase 4 - Hardening And Family Handoff`
Reason:
- once the multi-wire contract is live end to end, the remaining work is focused hardening, verification, and explicit handoff wording for anything still left outside this first widened subset
Current status:
- shipped
- this closes `Extrude-7` for the first honest multi-wire extrude input subset

## [x] Extrude 7 Phase 1 - Input Port Contract Widening

### Summary

#### Purpose:
- widen the real `Geometry/Extrude.ExtrusionProfile` input-port contract from the current effective single-wire limit to an honest multi-wire collection input
- lock the first authored acceptance story for unlimited incoming `SketchProfile` and `SketchProfiles` wires from any sketch
- keep this first slice on registry and validation truth before compile/runtime meaning or deeper UI parity widens

#### Current strongest read:
- this slice is now shipped
- the real graph contract no longer falls back to the effective one-wire limit on `ExtrusionProfile`
- valid additional profile wires from the same sketch or different sketches now pass graph validation
- invalid non-profile contributors remain rejected
- compile/runtime collection lowering meaning is still intentionally deferred to `Phase 2`

#### Locked direction:
- `Geometry/Extrude.SketchProfiles` should accept unlimited incoming wires
- each incoming wire may come from any sketch
- each incoming wire may be either:
  - `SketchProfile`
  - `SketchProfiles`
- authored examples this phase should explicitly support:
  - one `SketchProfile` from `Sketch 1`
  - a second `SketchProfile` from `Sketch 1`
  - a third contributor from `Sketch 2` using either `SketchProfile` or `SketchProfiles`
  - continued additional wires from any sketch using either contributor kind
- collapsed row behavior remains:
  - all wires visually terminate at the one parent `SketchProfiles` pin
- expanded row behavior remains the locked target for later parity work:
  - one visible child row per actual incoming wire
  - each wire routes to the appropriate child row
  - authored wire order stays stable

#### Implementation-ready seam read:
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - is the contract owner for changing `ExtrusionProfile` from the current effective single-wire limit to a true multi-wire input
- `src/app/spaghetti/compiler/validateGraph.ts`
  - is the live seam that must stop rejecting valid second, third, and later profile wires once the registry contract widens
- focused validation tests under `src/app/spaghetti/compiler/`
  - are the smallest honest proof surface for the first widening pass because they can prove same-sketch and cross-sketch multi-wire acceptance before compile/runtime lowering changes
- `src/app/spaghetti/selectors/selectNodeVm.ts` and `src/app/spaghetti/canvas/NodeView.tsx`
  - should remain out of scope for substantive changes in this phase unless the widened port contract forces a tiny parity adjustment

#### Non-goals for this slice:
- do not lock final compile/runtime lowering semantics for multiple incoming wires yet
- do not decide duplicate profile handling or final aggregate-plus-singular flattening policy yet
- do not widen into deeper selector or node-surface rendering changes beyond what already shipped in `Extrude-6`
- do not widen into viewport profile-picking or toolbar auto-wiring
- do not widen into broader sketch taxonomy or member-expansion behavior

### Questions / Decisions

#### [x] Question 1 - What contributor kinds should the widened input contract allow?

##### Current answer
- unlimited incoming `SketchProfile` and `SketchProfiles` wires

##### Why
- that matches the authored vision for this lane
- it keeps the collection input honest without forcing the user into one sketch or one contributor kind

#### [x] Question 2 - Can those wires come from different sketches?

##### Current answer
- yes

##### Why
- the collection input should not be restricted to one upstream sketch if the authored graph is intentionally combining contributors across sketches

#### [x] Question 3 - What should collapsed versus expanded wire anchoring do?

##### Current answer
- collapsed:
  - all wires terminate at the one parent `SketchProfiles` pin
- expanded:
  - each wire routes to the matching child row for that incoming connection entry

##### Why
- collapsed mode should preserve one calm collection-input read
- expanded mode should stay authored and literal instead of hiding which wire belongs to which entry

#### [x] Question 4 - What ordering rule should later phases preserve?

##### Current answer
- authored incoming wire order

##### Why
- that keeps rewiring predictable
- regrouping by sketch or contributor kind would make the visible connection list harder to trust

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/validateGraph.ts`
- `src/app/spaghetti/compiler/validateGraph.test.ts`
- possibly one small selector or node-surface parity touch only if the widened contract exposes a narrow regression

Locked first-cut direction:
1. widen `Geometry/Extrude.ExtrusionProfile` so it no longer falls back to the effective single-wire input limit
2. allow multiple valid incoming wires targeting `ExtrusionProfile` when those contributors are:
   - `SketchProfile`
   - `SketchProfiles`
3. explicitly allow those valid wires from:
   - the same sketch
   - different sketches
4. keep invalid non-profile contributors rejected
5. lock the authored wire-anchoring rule for later phases to honor:
   - collapsed parent pin only
   - expanded one child row per actual incoming wire
6. defer compile/runtime lowering meaning, duplicate policy, and final aggregate-plus-singular combination semantics to `Phase 2`

Scope honored:
- keep this slice limited to real port and validation enablement for multi-wire authoring
- do not widen into full compile/runtime execution meaning yet
- do not widen into deeper selector or node-surface redesign beyond narrow parity if required
- do not widen into viewport or toolbar behavior

Acceptance checks:
- a second valid `SketchProfile` wire into `ExtrusionProfile` is graph-valid
- additional valid `SketchProfile` and `SketchProfiles` wires from other sketches are graph-valid
- invalid non-profile wires into `ExtrusionProfile` still fail validation
- final multi-wire lowering meaning remains explicitly deferred to `Extrude 7 Phase 2`

## [x] Extrude 7 Phase 2 - Compile And Runtime Collection Meaning

### Summary

#### Purpose:
- define what multiple incoming aggregate and singular profile wires actually mean once they are graph-valid
- keep the lowering story explicit across compile/runtime instead of allowing accidental first-write or last-write behavior
- avoid mixing this slice with broader UI parity or final hardening work

#### Current strongest read:
- this slice is now shipped
- the shared geometry request contract can now describe multiple ordered extrude contributors without collapsing aggregate and singular entries together
- `evaluateGraph.ts` now treats valid multi-wire `ExtrusionProfile` input as one ordered contributor collection instead of rejecting it as `MULTIPLE_INPUTS`
- `compileGraph.ts` now lowers that ordered collection honestly, emits contributor-aware `profileSelection` for multi-wire paths, keeps `profileRef` as a narrow singular-only bridge, and avoids inventing one fake owning sketch when contributors come from different sketches
- selector and node-surface parity remains intentionally deferred to `Phase 3`

#### Locked direction:
- compile/runtime should treat the widened `ExtrusionProfile` input as one ordered collection of incoming contributors
- each collection entry should preserve its authored contributor kind:
  - `SketchProfiles`
  - `SketchProfile`
- lowering should preserve authored incoming wire order
- aggregate contributors should not be silently exploded in the authored graph contract
- singular contributors should not be silently collapsed into aggregate contributors
- contributors from different sketches should remain representable in the request contract without inventing one fake owning sketch
- this phase should produce one explicit compile/runtime descriptor for multiple incoming profile contributors instead of relying on the old singular-only seam

#### Implementation-ready seam read:
- `src/app/spaghetti/compiler/compileGraph.ts`
  - is the immediate owner for replacing the one-edge `ExtrusionProfile` lowering assumption with one ordered incoming-contributor read
  - is where plane/planeTransform sourcing, compatibility `profileRef`, and sketch-op emission will need one honest multi-contributor rule
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - is the contract seam that must stop limiting extrude profile selection to only `single` or `allFromSketch`
  - is where the next explicit ordered contributor descriptor should become typed and validated
- downstream runtime seams under `src/app/spaghetti/compiler/` and worker-owned extrude execution
  - are where the widened ordered contributor collection must become real execution meaning after compile emits it honestly
- focused compile/runtime tests under `src/app/spaghetti/compiler/`
  - are the smallest honest proof surface for:
    - aggregate-only contributor lowering
    - singular-only contributor lowering
    - mixed aggregate-plus-singular contributor lowering
    - same-sketch versus cross-sketch contributor ordering
- selector and node-surface seams
  - should stay mostly unchanged in this phase unless compile/runtime truth exposes one narrow parity regression

#### Non-goals for this slice:
- do not reopen the Phase 1 validation and port-limit decision
- do not widen into final selector or node-surface parity cleanup
- do not widen into viewport or toolbar-owned authoring flows
- do not widen into broader sketch taxonomy or member-expansion UI
- do not turn this phase into final hardening or family closeout

### Questions / Decisions

#### [x] Question 1 - What should multiple incoming wires lower into?

##### Current answer
- one explicit ordered collection of profile contributors in the shared geometry request contract

##### Why
- that matches the authored collection-input contract
- it keeps compile/runtime meaning honest instead of pretending the input is still singular

#### [x] Question 2 - Should authored wire order survive compile/runtime lowering?

##### Current answer
- yes

##### Why
- preserving authored order keeps rewiring predictable
- hidden reordering would make the input collection harder to reason about

#### [x] Question 3 - Should aggregate and singular contributor kinds remain distinct in the request contract?

##### Current answer
- yes

##### Why
- the authored graph should not lose whether a contributor came from `SketchProfiles` or `SketchProfile`
- that distinction is part of the node contract now

#### [x] Question 4 - Which exact seam should the first implementation cut widen first?

##### Current answer
- widen the shared `geometryRequest` extrude profile-selection contract first, then make `compileGraph` emit that widened ordered contributor collection

##### Why
- `compileGraph` is still blocked by the current `single` / `allFromSketch` contract shape
- widening runtime meaning without widening the typed request envelope first would hide the real ownership change

#### [x] Question 5 - What compatibility behavior should remain temporarily allowed during the Phase 2 cut?

##### Current answer
- keep the old singular `profileRef` compatibility field only as a temporary bridge for singular-only lowering paths while the new ordered collection contract becomes the honest source of truth

##### Why
- that gives the phase one safe migration lane without pretending `profileRef` is still the long-term real owner
- it keeps the runtime contract change explicit instead of silently overloading the legacy singular field

### Implementation Spec

Likely files:
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/contracts/geometryRequest.ts`
- widened compile/runtime extrude request seams under `src/app/spaghetti/compiler/`
- focused compile/runtime tests for extrude multi-wire lowering

Locked first-cut direction:
1. widen `GeometryRequestExtrudeProfileSelection` beyond the current `single` / `allFromSketch` split so the request can describe an ordered collection of contributors
2. replace the old one-edge singular-only lowering assumption in `compileGraph.ts` with one explicit ordered collection-input contract for `ExtrusionProfile`
3. preserve authored incoming wire order in that contract
4. preserve contributor kind per entry:
   - aggregate `SketchProfiles`
   - singular `SketchProfile`
5. keep different-sketch contributors representable without collapsing them onto one fake source sketch owner
6. keep `profileRef` temporary-compatibility behavior explicit and narrow if singular-only downstream seams still need it during the migration
7. prove aggregate-only, singular-only, mixed, same-sketch, and cross-sketch contributor lowering with focused compile/runtime tests
8. defer selector/node-surface parity cleanup and closeout wording to later phases

Scope honored:
- keep this slice on compile/runtime meaning only
- do not widen into full node-surface polish yet
- do not widen into final hardening or family closeout

Acceptance checks:
- `compileGraph.ts` no longer relies on one chosen extrude profile edge as the only contributor source
- the shared geometry request contract can represent more than one ordered extrude profile contributor
- `evaluateGraph.ts` accepts valid multi-wire `ExtrusionProfile` collections and still lets `Geometry/Extrude` publish `SolidBody`
- multiple incoming contributors lower as one ordered collection
- aggregate-only, singular-only, mixed, same-sketch, and cross-sketch contributor sets have explicit tested meaning
- later selector and node-surface parity work remains explicitly deferred to `Extrude 7 Phase 3`

## [x] Extrude 7 Phase 3 - Selector And Surface Multi-Wire Parity

### Summary

#### Purpose:
- make the selector and node surface fully truthful once the graph and runtime contract actually allow more than one incoming wire
- lock collapsed-versus-expanded wire anchoring and child-row behavior against the real widened graph state
- keep this slice on visible parity instead of reopening core execution semantics

#### Current strongest read:
- this slice is now shipped
- the selector, canvas, and node surface now tell one consistent multi-wire story:
  - collapsed mode keeps all wires on the parent pin
  - expanded mode reveals one child row per actual incoming wire
  - each expanded wire routes to the matching child row
  - authored order now follows the real incoming graph-edge order instead of a secondary `edgeId` sort
- `selectNodeVm.ts` now exposes ordered `profileInputEntries` with one stable child endpoint id per incoming contributor entry
- `NodeView.tsx` now renders expanded child rows as real registered input endpoints instead of metadata-only summary rows
- `SpaghettiCanvas.tsx` now resolves those child endpoints back to the underlying `ExtrusionProfile` graph port for validation, rewire, and rendered-edge anchoring
- compile/runtime ordering no longer drifts from the visible surface because the stale edge-id ordering fallback was removed from the relevant graph-evaluation and compile seams

#### Locked direction:
- keep the parent row named `SketchProfiles`
- in collapsed mode:
  - all wires terminate at the one parent pin
- in expanded mode:
  - one child row per actual incoming wire
  - each child row keeps its contributor kind explicit
  - each wire anchors to the matching child row
- preserve authored incoming wire order in the visible child list
- keep aggregate contributors visibly aggregate and singular contributors visibly singular

#### Implementation-ready seam read:
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - remains the best seam for exposing one ordered incoming-entry list tied to the real widened graph state
  - already builds `profileInputEntries`, so the main work is tightening that seam onto the same authored incoming-edge order contract the widened graph/runtime path should honor
- `src/app/spaghetti/canvas/NodeView.tsx`
  - is the owner for collapsed-versus-expanded wire anchoring and per-entry child-row rendering
  - already renders visible child rows, so the remaining UI truth work is making those expanded rows act as the real wire-anchor targets instead of metadata-only attached-body entries
- focused selector and node-surface tests under `src/app/spaghetti/`
  - are the smallest honest proof surface for same-sketch, cross-sketch, aggregate, singular, and mixed visible parity
  - should explicitly prove both authored-order stability and expanded child-row endpoint ownership

#### Non-goals for this slice:
- do not reopen the widened input-port validation contract from Phase 1
- do not reopen the compile/runtime lowering meaning from Phase 2
- do not widen into viewport or toolbar-owned authoring interactions
- do not widen into final closeout and family handoff work yet

### Questions / Decisions

#### [x] Question 1 - What should collapsed mode do once multiple wires are real?

##### Current answer
- keep all wires terminating at the one parent `SketchProfiles` pin

##### Why
- collapsed mode should stay calm and legible even when the collection grows

#### [x] Question 2 - What should expanded mode show?

##### Current answer
- one child row per actual incoming wire

##### Why
- expanded mode should stay authored and literal
- the user should be able to see exactly which wire belongs to which entry

#### [x] Question 3 - What ordering rule should the visible child list preserve?

##### Current answer
- authored incoming wire order

##### Why
- the surface should match the authored graph instead of re-sorting it behind the user’s back
- for this slice, treat authored order as the actual incoming-edge order from the graph contract rather than a secondary deterministic `edgeId` sort

### Implementation Spec

Likely files:
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- focused selector and node-surface tests under `src/app/spaghetti/`

Locked first-cut direction:
1. keep the parent row as `SketchProfiles`
2. keep collapsed mode parent-only for wire anchoring
3. make expanded mode reveal one child row per actual incoming wire from the widened graph contract
4. keep each child row explicit about contributor kind:
   - `SketchProfiles`
   - `SketchProfile`
5. preserve authored incoming wire order by reading the real incoming-edge order instead of re-sorting entries by `edgeId`
6. anchor each expanded wire to the matching child row by giving each visible child row one real endpoint identity that maps back to the corresponding incoming connection entry
7. keep collapsed mode using only the parent `ExtrusionProfile` endpoint so the calmer parent-only wire read remains unchanged
8. prove the selector-owned entry list and node-surface child rows are driven by the same ordered contributor source instead of parallel drifting derivations

Scope honored:
- keep this slice on selector and node-surface parity only
- do not reopen compile/runtime semantics
- do not widen into final hardening or family closeout

Acceptance checks:
- collapsed mode still routes all wires to the one parent pin
- expanded mode shows one child row per actual incoming wire
- expanded child rows expose one real endpoint/anchor target per incoming wire instead of metadata-only summary rows
- wires anchor to the appropriate expanded child row
- aggregate and singular contributors remain visibly distinct
- authored incoming wire order remains stable on the surface
- focused selector and node-surface tests cover same-sketch, cross-sketch, aggregate-only, singular-only, and mixed incoming sets with explicit authored-order expectations

## [x] Extrude 7 Phase 4 - Hardening And Family Handoff

### Summary

#### Purpose:
- finish the first honest multi-wire extrude input subset with focused hardening, verification, and closeout wording
- close `Extrude-7` without hiding later follow-ons inside the same pass

#### Current strongest read:
- this slice is now shipped
- the first honest multi-wire extrude input subset now closes with the core proof surface in place:
  - validation allows same-sketch, cross-sketch, aggregate, singular, and mixed contributors
  - compile/runtime meaning preserves authored contributor order
  - draft and authoritative worker execution now both honor contributor-mode whole-port `SketchProfiles` sources across sketches
  - selector and node/canvas surface parity remain aligned on collapsed parent anchoring versus expanded child-row anchoring
- preview invalidation is now explicit for the graph-native extrude lane:
  - if a wired `Geometry/Extrude` no longer publishes a valid `SolidBody`, the OutputPreview slot now goes unresolved immediately instead of continuing to render stale retained extrude geometry
  - the focused viewer/store proof covers that required `SketchProfiles -> ExtrusionProfile` disconnect path directly
- later work remains explicitly outside this closed family:
  - viewport-owned profile selection
  - toolbar-driven auto-wiring
  - broader sketch taxonomy and later profile-surface expansion

#### Locked direction:
- add focused verification for:
  - same-sketch multi-wire
  - cross-sketch multi-wire
  - aggregate-only contributors
  - singular-only contributors
  - mixed aggregate-plus-singular contributors
  - multi-sketch whole-port `SketchProfiles` contributors executing through both draft and authoritative worker paths
  - collapsed versus expanded wire anchoring
  - invalid non-profile rejection
- lock preview invalidation behavior so disconnecting a required `SketchProfiles` contributor wire removes the previously shown extrude geometry instead of retaining stale cached output
- clean any remaining wording drift between runtime meaning, selector summaries, and node-surface copy
- end the family with explicit handoff boundaries for what still belongs to later phases outside `Extrude-7`
- prefer adding only the smallest honest test or wording deltas still missing after the shipped `Phase 3` proof surface

#### Implementation-ready seam read:
- focused compile/runtime, selector, and node-surface tests under `src/app/spaghetti/`
  - are the main proof surface for closing the widened contract honestly
- likely first proof seams now are:
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/compiler/evaluateGraph.test.ts`
  - `src/app/spaghetti/compiler/compileGraph.test.ts`
- worker proof seams now matter explicitly too:
  - `src/worker/cad/featureStackRuntime.test.ts`
  - `src/worker/authoritative/buildAuthoritativeGeometry.test.ts`
  - `src/worker/buildModel.test.ts`
- `src/app/spaghetti/canvas/NodeView.tsx` and `src/app/spaghetti/selectors/selectNodeVm.ts`
  - are the likely visible copy seams if any wording still drifts after the earlier phases
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
    - is the likely hardening seam only if an edge-case rewire or anchor regression still appears under mixed incoming sets
  - preview/result retention seams under the build-result and viewport path
    - are the likely owner if disconnecting `Extrude.SketchProfiles` still leaves stale geometry visible after the current graph stops publishing a valid body
  - `src/worker/cad/featureStackRuntime.ts` and `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - should stay out of scope unless the final proof pass still exposes another contributor-mode execution edge case
- this doc plus `extrude-index.md`
  - are the correct closeout surfaces for recording what the first widened subset actually proved and what still remains outside it

#### Non-goals for this slice:
- do not reopen the core widened port contract
- do not reopen the compile/runtime lowering model unless a focused regression forces it
- do not widen into viewport picking, toolbar auto-wiring, or broader sketch taxonomy work
- do not hide later follow-ons inside this closeout pass

### Questions / Decisions

#### [x] Question 1 - What should this final slice own?

##### Current answer
- focused hardening and explicit closeout only

##### Why
- the contract work should already be settled by the earlier slices
- widening the final pass would make the family harder to close honestly

#### [x] Question 2 - What should remain explicitly outside `Extrude-7` after it closes?

##### Current answer
- viewport-owned profile selection
- toolbar-driven auto-wiring
- broader sketch taxonomy and later profile-surface expansion

##### Why
- those are real follow-ons, but they are not required to prove the first honest multi-wire extrude input subset

### Implementation Spec

Likely files:
- focused extrude tests under `src/app/spaghetti/`
- focused worker tests under `src/worker/`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- this doc and `extrude-index.md`

Locked first-cut direction:
1. close any remaining verification gaps around the shipped widened multi-wire contract under the main authored cases
2. explicitly prove the shipped worker execution path for contributor-mode aggregate sources from different sketches stays aligned between draft and authoritative builds
3. harden preview invalidation so removing a required `Extrude.SketchProfiles` contributor wire clears stale geometry immediately when the current graph no longer resolves a valid body
4. clean any remaining visible wording drift only if the proof pass exposes it
5. close the docs loop by explicitly recording what `Extrude-7` now owns
6. hand later viewport, toolbar, and taxonomy work back out of the closed family

Scope honored:
- keep this slice limited to hardening and closeout
- do not widen into new feature design

Acceptance checks:
- focused verification covers the main same-sketch, cross-sketch, aggregate, singular, mixed, and invalid-contributor cases
- focused verification covers the exact user-authored case of `SketchProfiles` from `Sketch 1` plus `SketchProfiles` from `Sketch 2` feeding one extrude input
- focused verification explicitly covers collapsed parent anchoring versus expanded child-row anchoring on the shipped canvas surface
- draft preview and authoritative geometry stay aligned for contributor-mode multi-sketch aggregate execution
- disconnecting a required wire from `Extrude.SketchProfiles` causes the extrude preview geometry to disappear immediately when the current graph no longer resolves a valid body
- selector and node-surface wording stay aligned with the widened runtime meaning
- `Extrude-7` closes with explicit handoff boundaries for later follow-ons

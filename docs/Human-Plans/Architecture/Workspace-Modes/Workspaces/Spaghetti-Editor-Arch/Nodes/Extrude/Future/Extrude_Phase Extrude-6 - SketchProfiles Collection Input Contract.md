# `Extrude-6` - `SketchProfiles Collection Input Contract`

## Doc Header

### Doc History
9. 2026-04-08 22:41: Marked `Extrude 6 Phase 4 - Surface Hardening And Follow-On Handoff` shipped after the last singular-contributor wording drift on the dedicated extrude `SketchProfiles` row was tightened to `one SketchProfile contributor`, the focused proof matrix gained an explicit singular-only node-surface regression beside the already-shipped aggregate, mixed, and invalid-contributor coverage, and the family closeout now explicitly hands runtime-ordering, viewport, toolbar, and broader taxonomy questions back out of the closed `Extrude-6` subset
8. 2026-04-08 22:38: Tightened `Extrude 6 Phase 4 - Surface Hardening And Follow-On Handoff` into the implementation-ready final slice by grounding it in the already-shipped parent-row, child-entry, and selector-owned validation seams, locking the remaining work to focused verification plus visible copy drift cleanup, and making the `Extrude-6` closeout explicitly document what still belongs to later runtime-ordering, viewport, and toolbar follow-ons
7. 2026-04-08 22:29: Marked `Extrude 6 Phase 3 - Collection Entry Identity And Validation Rules` shipped after the live selector-owned `profileInputEntries` seam began filtering down to valid aggregate-versus-singular profile contributors only, invalid non-profile wires stopped surfacing as fake extrude child entries, and focused selector plus graph-validation tests proved the first narrow collection-entry identity and rejection contract without widening into final hardening or runtime-ordering policy
6. 2026-04-08 22:23: Tightened `Extrude 6 Phase 3 - Collection Entry Identity And Validation Rules` into an implementation-ready next slice by grounding it in the live selector-owned `profileInputEntries` seam plus the visible extrude child-entry rows, locking one stable child-row identity per actual incoming connection entry and the first narrow valid profile-contributor matrix, and keeping final ordering plus runtime-flattening policy explicitly deferred to later phases
5. 2026-04-08 22:21: Marked `Extrude 6 Phase 2 - Mixed Aggregate And Singular Entry Display` shipped after the live extrude selector VM began exposing one ordered incoming profile-entry list, the dedicated `SketchProfiles` row started rendering one child row per actual aggregate or singular contributor in essentials and expanded modes, and focused selector plus node-surface tests proved the mixed-entry display contract without widening into validation or runtime-ordering work
4. 2026-04-08 22:12: Tightened `Extrude 6 Phase 2 - Mixed Aggregate And Singular Entry Display` into an implementation-ready next slice by grounding it in the live extrude parent-row surface plus selector-owned target summary seams, locking one child row per actual incoming connection entry in essentials and expanded modes, and keeping entry validation, final ordering, and runtime flattening policy explicitly deferred to later phases
3. 2026-04-08 22:10: Marked `Extrude 6 Phase 1 - Parent SketchProfiles Row Contract Lock` shipped after the live `Geometry/Extrude` registry and dedicated node surface adopted the always-parent `SketchProfiles` input label, the attached-body copy stopped drifting back toward a singular-only profile slot, and focused registry plus node-surface tests proved the collection-first row contract without widening into child-entry rendering or runtime-ordering work
2. 2026-04-08 22:05: Tightened `Extrude 6 Phase 1 - Parent SketchProfiles Row Contract Lock` into an implementation-ready next slice by grounding it in the current extrude input-row naming and selector summary seams, locking the always-parent `SketchProfiles` label plus first valid contributor matrix, and keeping expanded child-entry rendering plus runtime-ordering policy explicitly deferred to later phases
1. 2026-04-08 22:00: Added this dedicated future phase doc by carving the `SketchProfiles` collection-input lane out of the broader extrude family read, splitting the work into `Extrude 6 Phase 1` through `Phase 4`, and tightening `Phase 1 - Parent SketchProfiles Row Contract Lock` into the first implementation-ready cut

### Purpose

Use this doc as the dedicated planning and execution surface for the next extrude-owned input-contract follow-on after the closed `Extrude-5` output-row cleanup lane.

The goal here is:
- make the `Geometry/Extrude` profile input read like one real parent `SketchProfiles` collection row instead of a singular-looking profile slot
- let the parent row accept honest aggregate, singular, and mixed contributor sets without pretending every incoming connection is the same kind of thing
- keep collapsed, essentials, and expanded modes aligned around one clear collection-entry display contract
- stage the visible row contract before later runtime flattening, ordering, viewport, or toolbar follow-ons widen the scope

### Scope

This phase covers:
- the visible `SketchProfiles` parent input row on `Geometry/Extrude`
- the collection meaning of that row across aggregate `SketchProfiles` and singular `SketchProfile` contributors
- the first mixed aggregate-versus-singular input-entry display contract
- the row-level validation and interaction rules needed to keep multi-wire collection input behavior honest

This phase does not cover:
- changing the shipped aggregate closed-profile runtime/result semantics from `Extrude-4`
- final runtime flattening or ordering evaluation policy
- viewport picking or toolbar-driven auto-wiring
- broader sketch curve, line, or point taxonomy rollout
- unrelated extrude output-row or toolbar cleanup

## Doc Body

### Summary

`Extrude-6` is the dedicated input-contract lane for making `Geometry/Extrude` own one real parent `SketchProfiles` collection row.

Current read:
- the shipped `Extrude-4` lane proved honest aggregate-versus-singular closed-profile consumption for the current subset
- the visible input side still does not yet own the fuller `Idea 1` direction from `Nodes-Vision.md`
- the remaining gap is now mainly row-contract and connection-entry honesty:
  - the parent input should stay named `SketchProfiles`
  - that parent row should own the collection meaning at all times
  - aggregate and singular contributors should remain visibly distinct when the row expands
- the current problem is not broad runtime meaning anymore
- it is making the node surface and row identity match the stronger collection-input direction already visible on the sketch side

Locked recommendation:
- keep one parent input row named `SketchProfiles`
- let that row accept:
  - one aggregate `SketchProfiles` contributor
  - one singular `SketchProfile` contributor
  - multiple singular `SketchProfile` contributors
  - one mixed aggregate-plus-singular contributor set
- keep collapsed mode simple:
  - all wires terminate at the parent row
- use essentials and expanded modes to reveal one child row per incoming connection entry
- defer runtime flattening and final ordering semantics until the visible input contract is trustworthy

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - owns the live `Geometry/Extrude` node surface
  - is where the parent `SketchProfiles` row plus later child entry rows must render honestly across collapsed, essentials, and expanded modes
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already carries the selector-owned extrude input summary and aggregate-versus-singular target read
  - is the best seam for keeping row labels, child-entry state, and visible input summaries aligned with the actual authored graph state
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - owns the graph-native extrude input contract
  - is the narrowest place to lock the parent `SketchProfiles` row identity and valid contributor story
- shared row-structure seams under `src/app/spaghetti/`
  - are the likely source of collection-row ownership, expansion, and child-row wiring behavior that this phase should adopt instead of inventing another extrude-only pattern
- focused extrude and node-surface tests under `src/app/spaghetti/`
  - are the likely proving surface for mixed contributor rendering and row-contract honesty without widening into runtime work

### Phase Breakdown

1. `Extrude 6 Phase 1 - Parent SketchProfiles Row Contract Lock`
Reason:
- the safest first cut is locking that `Geometry/Extrude` owns one parent `SketchProfiles` collection row before mixing in multi-entry rendering or validation detail
Current status:
- shipped
- current handoff:
  - `Extrude 6 Phase 2 - Mixed Aggregate And Singular Entry Display`

2. `Extrude 6 Phase 2 - Mixed Aggregate And Singular Entry Display`
Reason:
- once the parent row contract is explicit, the next honest step is showing how aggregate and singular incoming connections should read in essentials and expanded modes without exploding aggregate sources into fake member lists
Current status:
- shipped
- current handoff:
  - `Extrude 6 Phase 3 - Collection Entry Identity And Validation Rules`

3. `Extrude 6 Phase 3 - Collection Entry Identity And Validation Rules`
Reason:
- after the visible parent-versus-child row story is in place, the next missing truth is what counts as one valid connection entry, how mixed contributor sets stay distinct, and what the first focused acceptance matrix should reject or allow
Current status:
- shipped
- current handoff:
  - `Extrude 6 Phase 4 - Surface Hardening And Follow-On Handoff`

4. `Extrude 6 Phase 4 - Surface Hardening And Follow-On Handoff`
Reason:
- once the row contract, entry display, and validation rules land, the remaining work is focused hardening, visible copy cleanup, and documenting what runtime-ordering or viewport follow-ons still remain explicitly out of scope
Current status:
- shipped
- this closes `Extrude-6` for the current collection-input surface subset

## [x] Extrude 6 Phase 1 - Parent SketchProfiles Row Contract Lock

### Summary

#### Purpose:
- lock the first explicit parent collection-input contract for the visible `Geometry/Extrude` profile target row
- decide what the parent row is called, what it means, and what contributor kinds it can own
- avoid mixing this first slice with expanded child-row rendering, entry validation, or runtime-ordering policy

#### Shipped result:
- the live `Geometry/Extrude` node now renders its visible parent profile input row as:
  - `SketchProfiles`
- the internal graph/runtime port id remains:
  - `ExtrusionProfile`
- the dedicated extrude node copy now treats that row as one parent collection input instead of a singular-looking slot:
  - empty states now talk about `SketchProfiles` contributors
  - singular resolved targets now read as one contributor inside the `SketchProfiles` collection input
  - aggregate resolved targets still read honestly as the parent `SketchProfiles` source
- focused registry and node-surface tests now prove the parent-row label and collection-first wording without widening into child-entry rendering

#### Current handoff:
- `Extrude 6 Phase 2 - Mixed Aggregate And Singular Entry Display`
- use that next slice to decide how actual incoming aggregate and singular contributors should reveal as child entries when the parent row opens

#### Current strongest read:
- the current extrude surface and nearby selector-owned copy still carry drift risk because the node has already proven aggregate-versus-singular consumption through `Extrude-4`, but the input row itself is not yet locked as an always-parent collection contract
- the first pass should decide the parent row contract before deeper rendering or validation logic widens
- that contract should stay aligned with `Nodes-Vision.md` `Idea 1` and the broader graph-native collection-row direction instead of falling back to singular-first naming
- the safest first implementation cut is row-contract truth only:
  - one always-parent label
  - one explicit collection meaning
  - one explicit valid contributor matrix
  - no child-row rendering promises yet

#### Locked direction:
- expose one parent input row named `SketchProfiles`
- keep that name in all modes even when only one singular `SketchProfile` contributor is connected
- treat the parent row as owning one collection input, not one singular input slot
- lock the first valid contributor set to:
  - one aggregate `SketchProfiles`
  - one singular `SketchProfile`
  - multiple singular `SketchProfile` contributors
  - one mixed aggregate `SketchProfiles` contributor plus singular `SketchProfile` contributors
- keep this first slice focused on the parent row naming, meaning, and contributor contract only

#### Implementation-ready seam read:
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - is the narrowest contract owner for the parent input row id, label, and accepted profile-contributor story
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - is the live seam most likely to keep extrude target summaries and parent-row wording honest once the row is locked as a collection input
- `src/app/spaghetti/canvas/NodeView.tsx`
  - is where the current visible row label and parent-row read must stop drifting back toward a singular-looking slot
- focused extrude registry, selector, and node-surface tests
  - are the smallest proof surface for this first cut without widening into later child-entry rendering work

#### Non-goals for this slice:
- do not add child entry rows yet
- do not decide collapsed versus expanded child-entry visuals yet
- do not lock final entry ordering or runtime flattening policy
- do not reopen shipped `Extrude-4` aggregate execution semantics
- do not widen into toolbar or viewport-owned profile picking behavior

### Questions / Decisions

#### [x] Question 1 - What should the parent extrude profile row be called?

##### Current answer
- `SketchProfiles`

##### Why
- that is the honest name for the collection input the node owns
- it avoids drifting back toward a singular-looking slot that hides the real input shape

#### [x] Question 2 - Should the parent row rename itself when only one singular profile is connected?

##### Current answer
- no

##### Why
- the node still owns a collection input even when the current contributor count is one
- changing the row name by state would make the authored contract harder to trust

#### [x] Question 3 - What contributor kinds should this phase explicitly allow?

##### Current answer
- one aggregate `SketchProfiles`
- one singular `SketchProfile`
- multiple singular `SketchProfile` contributors
- one mixed aggregate-plus-singular contributor set

##### Why
- those are the smallest honest contributor forms already implied by `Idea 1`
- locking them here gives later row-render and validation work one stable contract to build on

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- focused extrude registry, selector, and node-surface tests under `src/app/spaghetti/`

Locked first-cut direction:
1. lock the visible parent extrude profile row name to:
   - `SketchProfiles`
2. make that row read as one parent collection input in the registry and node-surface contract instead of a singular-slot fallback
3. keep the row label stable regardless of current contributor count:
   - zero contributors
   - one singular contributor
   - one aggregate contributor
   - mixed contributors
4. lock the first accepted contributor matrix to:
   - one aggregate `SketchProfiles`
   - one singular `SketchProfile`
   - multiple singular `SketchProfile` contributors
   - one mixed aggregate-plus-singular contributor set
5. keep the selector-owned summary and visible node copy aligned with that parent collection meaning
6. defer child-entry rendering, validation hardening, and runtime-ordering policy to later phases

Scope honored:
- keep this slice limited to parent row naming, collection meaning, and first contributor acceptance language
- do not widen into essentials or expanded child-entry rendering
- do not widen into mixed-entry identity rules beyond the explicit accepted contributor matrix
- do not make promises yet about flattening, evaluation order, or aggregate-child expansion

Acceptance checks:
- `Geometry/Extrude` owns one parent input row named `SketchProfiles`
- the row keeps that name in collapsed, essentials, and expanded modes
- the row contract explicitly reads as collection input ownership, not a singular-slot fallback
- the valid first contributor matrix is explicit and stable enough for later child-entry rendering work
- selector-owned summary and visible node wording no longer drift back toward singular-only profile-slot language

Verification:
- `npm.cmd test -- src/app/spaghetti/registry/nodeRegistry.test.ts src/app/spaghetti/registry/extrudeParams.test.ts src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

## [x] Extrude 6 Phase 2 - Mixed Aggregate And Singular Entry Display

### Summary

#### Purpose:
- lock how the visible `SketchProfiles` parent row should reveal incoming aggregate and singular contributors in essentials and expanded modes
- preserve aggregate-versus-singular distinction without exploding aggregate sources into fake upstream member rows

#### Shipped result:
- the live extrude selector VM now exposes one ordered `profileInputEntries` list with one item per actual incoming aggregate or singular profile connection
- the visible `SketchProfiles` parent input row now behaves like this:
  - collapsed mode:
    - still parent-only
  - essentials mode:
    - reveals one child row per actual incoming connection entry
  - expanded mode:
    - keeps those child rows visible and also keeps the fuller resolved collection summary in the attached body
- aggregate contributors stay visibly aggregate
- singular contributors stay visibly singular
- mixed aggregate-plus-singular contributor sets now render as one mixed child-entry list instead of collapsing into one generic resolved-summary row

#### Current handoff:
- `Extrude 6 Phase 3 - Collection Entry Identity And Validation Rules`
- use that next slice to lock what counts as stable entry identity and the first row-level validation matrix rather than widening this display phase further

#### Current strongest read:
- once the parent row contract is locked, the next missing truth is how incoming contributors should actually appear when the row opens
- collapsed mode should stay simple
- essentials and expanded modes should expose one child row per incoming connection entry rather than pretending the collection has one generic repeated child type
- the safest next implementation cut is display-contract truth only:
  - keep the parent row as the one collapsed target
  - reveal child rows only when the row opens
  - map one visible child row to one actual incoming connection entry
  - keep aggregate contributors visibly aggregate and singular contributors visibly singular
- this slice should stay on the visible row contract, not widen into contributor validation or runtime semantics

#### Locked direction:
- in collapsed mode:
  - all incoming wires terminate visually at the one parent `SketchProfiles` row
- in essentials and expanded modes:
  - reveal one child row per incoming connection entry
  - keep aggregate entries aggregate
  - keep singular entries singular
- if one upstream aggregate `SketchProfiles` source is connected:
  - show one aggregate child row
- if multiple singular `SketchProfile` sources are connected:
  - show one singular child row per singular source
- if the set is mixed:
  - show one aggregate child row plus one singular child row per singular source

#### Implementation-ready seam read:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - is the main seam for turning the current parent-only extrude row into a parent-with-child-entry display in essentials and expanded modes
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - is the best seam for exposing the minimum aggregate-versus-singular incoming-entry summary the node surface needs without forcing later validation or runtime policy into this pass
- shared structured-row and managed-row seams under `src/app/spaghetti/canvas/`
  - are the likely reuse point for parent-row expansion state and child-row shell behavior, so this phase should prefer those patterns over another extrude-only rendering fork
- focused node-surface tests under `src/app/spaghetti/canvas/`
  - are the smallest honest proof surface for collapsed, essentials, and expanded child-entry behavior

#### Non-goals for this slice:
- do not lock final entry identity or contributor validation policy yet
- do not decide final mixed-source ordering semantics beyond the visible authored graph order needed for rendering
- do not explode aggregate `SketchProfiles` sources into resolved upstream member rows
- do not widen into runtime flattening or worker evaluation policy
- do not widen into viewport or toolbar-owned profile-picking behavior

### Questions / Decisions

#### [x] Question 1 - Should collapsed mode show individual child rows?

##### Current answer
- no

##### Why
- collapsed mode should preserve the simple one-parent-row read
- the user should not need expanded connection detail until they opt into it

#### [x] Question 2 - What should essentials and expanded modes reveal?

##### Current answer
- one child row per actual incoming connection entry

##### Why
- that preserves the authored wire story
- it avoids flattening away the difference between aggregate and singular contributors

#### [x] Question 3 - Should an aggregate `SketchProfiles` contributor explode into all upstream member profiles in the extrude input UI?

##### Current answer
- no

##### Why
- the aggregate source should stay one aggregate connection entry in the extrude UI
- exploding it would blur upstream member derivation into the downstream row contract

#### [x] Question 4 - What should one visible child row correspond to in this phase?

##### Current answer
- one actual incoming connection entry

##### Why
- that is the smallest honest visible contract for mixed aggregate and singular contributors
- it preserves the authored wire story without forcing later validation or runtime identity work into the same slice

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- shared collection-row or structured-row seams under `src/app/spaghetti/`
- focused node-surface tests that cover collapsed, essentials, and expanded row states

Locked first-cut direction:
1. keep collapsed mode parent-only:
   - all incoming wires still terminate at `SketchProfiles`
2. make essentials mode reveal one child row per actual incoming connection entry
3. make expanded mode reveal the same child-entry structure with the fuller attached-body detail this row state already owns
4. keep aggregate sources visibly aggregate:
   - one aggregate `SketchProfiles` source becomes one aggregate child row
5. keep singular sources visibly singular:
   - one singular `SketchProfile` source becomes one singular child row
   - multiple singular sources become one singular child row per source
6. keep mixed sets visibly mixed:
   - one aggregate child row plus one singular child row per singular source
7. keep this display contract surface-only:
   - no aggregate-member explosion
   - no final ordering promises
   - no validation or runtime flattening expansion yet

Scope honored:
- keep this slice limited to visible parent-versus-child display behavior
- do not widen into contributor acceptance validation beyond the already-locked Phase 1 matrix
- do not widen into final row identity or ordering policy beyond the authored graph order needed to render the current state
- do not make this slice prove runtime flattening, final evaluation semantics, or viewport behavior

Acceptance checks:
- collapsed mode still reads as one parent `SketchProfiles` row with incoming wires terminating there
- essentials and expanded modes show one child row per incoming connection entry
- aggregate entries remain aggregate entries
- singular entries remain singular entries
- mixed contributor sets render without exploding upstream aggregate members into fake child lists
- the live row contract stays anchored in shared structured-row behavior instead of introducing another extrude-only child-row shell

Verification:
- `npm.cmd test -- src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

## [x] Extrude 6 Phase 3 - Collection Entry Identity And Validation Rules

### Summary

#### Purpose:
- define the first honest row-level identity and validation rules for incoming `SketchProfiles` collection contributors
- keep mixed aggregate and singular contributor sets legible and deterministic at the visible node-surface level

#### Shipped result:
- the live extrude selector-owned `profileInputEntries` seam now only publishes valid profile contributors for the visible `SketchProfiles` child-entry list:
  - aggregate whole-port `SketchProfiles`
  - singular whole-port `SketchProfile`
  - singular virtual-member `SketchProfile:<id>`
- invalid non-profile contributors no longer surface as fake visible child rows under the extrude `SketchProfiles` parent input
- the first focused graph-validation proof now explicitly guards the invalid non-profile-to-`ExtrusionProfile` mismatch path
- mixed aggregate and singular contributor sets keep stable visible selector-owned entry identity without widening this phase into final ordering or runtime flattening policy

#### Current handoff:
- `Extrude 6 Phase 4 - Surface Hardening And Follow-On Handoff`
- use that final slice to finish focused verification, copy hardening, and explicit closeout wording for what still remains outside the current `Extrude-6` subset

#### Current strongest read:
- after the parent row and child-entry display contract land, the remaining gap is whether the visible child rows actually map to stable incoming connection entries
- this slice should prove the first contributor acceptance matrix and reject invalid drift without widening into runtime flattening rules
- the safest next implementation cut is identity-and-validation truth only:
  - one stable child-row identity per actual incoming connection entry
  - one narrow accepted contributor matrix
  - one explicit rejection boundary for invalid non-profile contributors
  - no final runtime-ordering or flattening promises yet

#### Locked direction:
- treat each visible child row as one actual incoming connection entry
- keep the first validation matrix narrow:
  - allow valid aggregate `SketchProfiles` contributors
  - allow valid singular `SketchProfile` contributors
  - reject invalid non-profile contributors
- preserve entry identity well enough that mixed contributor sets stay readable across node-surface refresh and expansion changes
- keep ordering policy only as visible entry-order honesty for the current authored graph state, not as a broader runtime evaluation commitment

#### Implementation-ready seam read:
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - now owns the live `profileInputEntries` seam, so it is the narrowest owner for locking stable entry ids and the first accepted aggregate-versus-singular contributor matrix
- `src/app/spaghetti/canvas/NodeView.tsx`
  - already renders one child row per entry, so this phase should keep that surface tied to stable selector-owned entry identity instead of letting row identity drift with display-only copy
- graph validation seams under `src/app/spaghetti/compiler/`
  - are the likely place to prove the first invalid non-profile rejection behavior for the visible collection-input contract without widening into runtime semantics
- focused selector, validation, and node-surface tests under `src/app/spaghetti/`
  - are the smallest honest proof surface for stable mixed-entry identity plus the first narrow acceptance matrix

#### Non-goals for this slice:
- do not widen into final runtime flattening or worker evaluation policy
- do not decide the long-range ordering rule beyond deterministic visible entry order for the current authored graph state
- do not widen into viewport or toolbar-owned contributor editing
- do not widen into aggregate-member explosion or deeper upstream sketch member taxonomy
- do not turn this slice into the final hardening/closeout pass reserved for `Phase 4`

### Questions / Decisions

#### [x] Question 1 - What should one visible child row correspond to?

##### Current answer
- one actual incoming connection entry

##### Why
- that keeps the UI aligned with the authored wire story instead of inventing synthetic child structure

#### [x] Question 2 - Does this phase lock final runtime flattening or execution ordering semantics?

##### Current answer
- no

##### Why
- this slice is about visible entry identity and first validation truth
- the later runtime policy should stay a separate follow-on once the surface contract is already trustworthy

#### [x] Question 3 - What should the first validation matrix protect?

##### Current answer
- valid profile-collection contributors only

##### Why
- that is the smallest honest contract needed for the collection-input row
- widening into unrelated source types would blur the proving slice

#### [x] Question 4 - What should stay stable for each visible entry across refresh and expansion changes?

##### Current answer
- the selector-owned entry id and contributor kind

##### Why
- the row should keep representing the same authored incoming connection entry even if the row mode or attached summary copy changes
- this phase is about identity stability, not just rendering the same text twice

### Implementation Spec

Likely files:
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- focused graph-validation and node-surface tests under `src/app/spaghetti/`

Locked first-cut direction:
1. keep one stable selector-owned identity per visible child entry:
   - one entry id
   - one contributor kind
   - one contributor label
2. keep that entry identity tied to one actual incoming connection entry instead of display-only grouping
3. lock the first narrow valid contributor matrix for visible child entries to:
   - aggregate `SketchProfiles`
   - singular `SketchProfile`
4. prove that invalid non-profile contributors are rejected by the collection-input contract instead of silently appearing as fake child entries
5. preserve deterministic visible entry order for the current authored graph state without turning that into a broader runtime-evaluation promise
6. keep the node surface reading from that selector-owned identity seam instead of inventing another local entry-key story in the render layer

Scope honored:
- keep this slice limited to entry identity and the first visible validation matrix
- do not widen into final hardening, copy polish, or family closeout wording yet
- do not widen into final runtime flattening, evaluation order, or worker semantics
- do not widen into broader sketch taxonomy adoption beyond the current closed-profile contributors

Acceptance checks:
- each visible child row maps to one actual incoming connection entry
- invalid non-profile contributors are rejected by the visible contract
- mixed aggregate and singular contributor sets keep stable visible entry identity
- the phase stays out of final runtime flattening or evaluation-order promises
- selector-owned entry identity remains the one source of truth for the visible child-row contract

Verification:
- `npm.cmd test -- src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

## [x] Extrude 6 Phase 4 - Surface Hardening And Follow-On Handoff

### Summary

#### Purpose:
- finish the current collection-input surface lane by hardening copy, focused verification, and handoff boundaries
- close `Extrude-6` without hiding later runtime-ordering or viewport follow-ons inside the same pass

#### Shipped result:
- the dedicated extrude `SketchProfiles` surface now keeps the singular waiting/body wording aligned with the actual accepted singular contributor kind:
  - `one SketchProfile contributor`
- the focused verification matrix for the closed `Extrude-6` subset now explicitly covers:
  - aggregate-only contributors
  - singular-only contributors
  - mixed aggregate-plus-singular contributors
  - invalid non-profile contributor rejection
- the current `Extrude-6` lane now closes as one honest collection-input surface subset that owns:
  - one parent `SketchProfiles` row
  - one child row per accepted incoming connection entry in essentials and expanded modes
  - one narrow valid profile-contributor matrix

#### Current handoff:
- `Extrude-6` is closed for the current collection-input surface subset
- later follow-ons remain explicitly outside this closed lane:
  - runtime flattening and final ordering semantics
  - viewport profile selection and toolbar-driven auto-wiring
  - broader sketch taxonomy expansion beyond the current closed-profile contributor subset

#### Current strongest read:
- after the row contract, entry display, and validation matrix are explicit, the remaining work should be narrow:
  - verification
  - visible copy cleanup
  - explicit handoff wording for what still belongs to later phases
- this final slice should keep the collection-input lane honest and closed for the current node-surface subset
- the safest implementation-ready final cut is closeout truth only:
  - prove the already-shipped row contract against the main contributor cases
  - remove any remaining aggregate-versus-singular wording drift between selector summaries and node-surface copy
  - end with one explicit architectural handoff so later runtime and interaction questions do not quietly reopen this surface lane

#### Locked direction:
- add focused verification for:
  - parent row naming
  - collapsed versus essentials/expanded behavior
  - aggregate-only, singular-only, and mixed contributor sets
  - invalid contributor rejection
- clean any remaining visible copy drift between the node surface and selector-owned summaries
- end the phase with explicit follow-on boundaries that keep later runtime-ordering, viewport selection, and toolbar auto-wiring work out of this closed subset

#### Implementation-ready seam read:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - remains the main seam for any final visible copy cleanup on the dedicated extrude `SketchProfiles` row, including attached-body wording and expanded-state summaries
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - remains the owner for any final aggregate-versus-singular summary wording so the node surface does not drift away from the selector-owned collection-entry contract already locked by earlier phases
- focused extrude tests under `src/app/spaghetti/`
  - are the smallest honest proof surface for this final slice because the row contract is already shipped and only needs final contributor-matrix coverage plus wording-stability regression checks
- this child doc plus `extrude-index.md`
  - are the correct closeout seams for recording what `Extrude-6` actually proved and what later runtime-ordering or viewport-owned follow-ons still remain out of scope

#### Non-goals for this slice:
- do not reopen the Phase 1 parent-row contract
- do not reopen the Phase 2 child-entry display contract
- do not reopen the Phase 3 accepted-contributor matrix or selector-owned identity model unless a focused regression forces it
- do not widen into runtime flattening, final evaluation order, worker semantics, or result ownership
- do not widen into viewport-picking or toolbar-owned auto-wiring behavior
- do not widen into broader sketch taxonomy work beyond the current closed-profile contributor subset

### Questions / Decisions

#### [x] Question 1 - What should this final slice own?

##### Current answer
- focused hardening and explicit closeout only

##### Why
- the contract work should already be settled by the earlier slices
- widening this final pass would make the family harder to close honestly

#### [x] Question 2 - What follow-ons should remain explicitly out of scope after `Extrude-6` closes?

##### Current answer
- runtime flattening and final ordering semantics
- viewport selection and toolbar-driven auto-wiring
- broader sketch taxonomy expansion beyond closed-profile contributors

##### Why
- those are real next questions, but they are not required to prove the current collection-input surface contract

#### [x] Question 3 - What should the final verification matrix prove before this lane closes?

##### Current answer
- the already-shipped surface contract across the main contributor cases

##### Why
- this final pass should prove the lane is stable, not invent a new contract
- the closeout should show that parent naming, child-entry behavior, and invalid-contributor rejection still hold together as one visible collection-input story

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- focused extrude node-surface and validation tests under `src/app/spaghetti/`
- the family index and adjacent planning docs if the closeout handoff needs a doc refresh

Locked first-cut direction:
1. re-run and, only if needed, tighten the focused verification matrix around:
   - parent `SketchProfiles` naming
   - collapsed parent-only behavior
   - essentials and expanded child-entry behavior
   - aggregate-only contributor sets
   - singular-only contributor sets
   - mixed aggregate-plus-singular contributor sets
   - invalid non-profile contributor rejection
2. clean any remaining visible wording drift so the dedicated extrude row and selector-owned summaries speak the same aggregate-versus-singular collection language
3. keep any final surface edits anchored in the already-shipped selector-owned entry contract instead of inventing another render-local summary or identity path
4. close the docs loop by making `Extrude-6` explicitly say what this lane now owns:
   - one parent `SketchProfiles` row
   - one child row per accepted incoming connection entry in essentials and expanded modes
   - one narrow valid profile-contributor matrix
5. close the docs loop by explicitly handing later follow-on work back out to:
   - runtime flattening and final ordering semantics
   - viewport selection and toolbar auto-wiring
   - broader sketch taxonomy and later profile-surface expansion

Acceptance checks:
- focused coverage proves the parent `SketchProfiles` row contract across the main contributor cases
- node-surface copy and selector-owned summaries do not drift on aggregate versus singular contributor wording
- the `Extrude-6` closeout leaves explicit documented handoff boundaries for later runtime-ordering and viewport-owned follow-ons

Verification:
- `npm.cmd test -- src/app/spaghetti/compiler/validateGraph.test.ts src/app/spaghetti/selectors/selectNodeVm.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

# `Sketch-2` - `Sketch Node Output Cleanup And Profile Array Surface`

## Doc Header

### Doc History
8. 2026-04-08 16:06: Marked `Sketch - 2 Phase 3A - Surface And Selector Aggregate Versus Singular Contract` shipped after the sketch output surface and selector proof now explicitly distinguish parent `SketchProfiles` aggregate meaning from singular revealed `SketchProfile` member targets in `src/app/spaghetti/canvas/NodeView.tsx`, `src/app/spaghetti/canvas/NodeView.test.tsx`, and `src/app/spaghetti/selectors/selectNodeVm.test.ts`, then tightened `Sketch - 2 Phase 3B - Child Member Endpoint And Wiring Identity` into the next implementation-ready slice around the remaining child-target identity question
7. 2026-04-08 15:47: Tightened `Sketch - 2 Phase 3A - Surface And Selector Aggregate Versus Singular Contract` into an implementation-ready next slice by grounding it in the live sketch parent/child output wording in `src/app/spaghetti/canvas/NodeView.tsx`, the current aggregate-aware extrude target summary seam in `src/app/spaghetti/selectors/selectNodeVm.ts`, and the focused sketch plus extrude node-surface tests in `NodeView.test.tsx`, `NodeView.geometryMode.test.tsx`, and `selectNodeVm.test.ts`, while keeping deeper child-endpoint mechanics deferred to `Phase 3B`
6. 2026-04-08 15:29: Split the old `Sketch - 2 Phase 3 - Aggregate Versus Singular Wiring Contract` into `Phase 3A - Surface And Selector Aggregate Versus Singular Contract` plus `Phase 3B - Child Member Endpoint And Wiring Identity`, keeping the next sketch slice Codex-sized by separating visible contract alignment from deeper child-endpoint mechanics
5. 2026-04-08 16:25: Marked `Sketch - 2 Phase 2 - Child SketchProfile Row Reveal` shipped after the sketch output surface was tightened so `SketchProfiles` now reveals one parent-owned child `SketchProfile` row per resolved profile member inside the attached body instead of restoring a competing top-level singular output, and advanced the ladder so `Phase 3 - Aggregate Versus Singular Wiring Contract` is now the next implementation-ready slice
4. 2026-04-08 16:18: Tightened `Sketch - 2 Phase 2 - Child SketchProfile Row Reveal` into an implementation-ready next slice by grounding it in the live sketch output-row assembly and summary labels in `src/app/spaghetti/canvas/NodeView.tsx`, the current sketch output-row expectations in `NodeView.test.tsx` plus `NodeView.geometryMode.test.tsx`, and the selector-owned `profileCount` seam in `src/app/spaghetti/selectors/selectNodeVm.ts`, while keeping downstream aggregate-versus-singular wiring meaning deferred to `Phase 3`
3. 2026-04-08 16:12: Marked `Sketch - 2 Phase 1 - Parent SketchProfiles Contract Lock` shipped after the sketch output surface was tightened so `SketchProfiles` now reads as the one top-level profile output row while the competing top-level `SketchProfile` read was deferred out of the root output stack, and advanced the ladder so `Phase 2 - Child SketchProfile Row Reveal` is now the next implementation-ready slice
2. 2026-04-08 16:05: Tightened `Sketch - 2 Phase 1 - Parent SketchProfiles Contract Lock` into an implementation-ready next slice by grounding it in the live sketch output-row assembly in `src/app/spaghetti/canvas/NodeView.tsx`, the current sketch output render coverage in `src/app/spaghetti/canvas/NodeView.test.tsx` plus `NodeView.geometryMode.test.tsx`, and the selector-owned resolved-profile count seam in `src/app/spaghetti/selectors/selectNodeVm.ts`, while keeping child-row reveal and aggregate-versus-singular wiring follow-ons deferred to later phases
1. 2026-04-08 15:55: Created the dedicated child doc for `Sketch - 2`, split the sketch profile-output cleanup into four implementation-ready subphases, and tightened the first pass around locking `SketchProfiles` as the one honest parent collection output before widening into child-row reveal, downstream wiring meaning, and focused surface verification

### Purpose

Use this doc as the dedicated planning and execution surface for the `Sketch - 2` ladder.

The goal here is:
- make `Geometry/Sketch` expose one honest parent `SketchProfiles` collection output
- reveal one singular `SketchProfile` child row per resolved closed profile when the parent expands
- keep aggregate-versus-singular profile wiring explicit for downstream consumers such as `Geometry/Extrude`
- separate this node-surface and graph-wiring cleanup from the already-shipped worker-owned B-rep lowering path in `Sketch - 1`

### Scope

This phase family covers:
- locking `SketchProfiles` as the one parent aggregate output for resolved closed profiles
- removing ambiguity between the parent aggregate row and singular child-member rows
- revealing one `SketchProfile` child row per resolved profile in essentials and expanded modes
- keeping child identity stable enough for wiring and later viewport-selection follow-ons
- defining the downstream meaning of parent aggregate versus singular member profile wiring
- focused wording, count, and verification cleanup around the sketch node output surface

This phase family does not cover:
- worker-owned OpenCascade lowering or authoritative geometry construction
- the broader sketch curve and shared-point taxonomy
- viewport picking or direct viewport-to-member selection
- the later extrude toolbar workflow
- the full `Build-Path` workspace

## Doc Body

### Summary

`Sketch - 2` should be the dedicated sketch-family ladder for the first honest `SketchProfiles` output collection contract.

Current baseline:
- `Sketch - 1` already shipped the worker-owned B-rep lowering path and should stay closed
- the sketch node still needs one cleaner output story for profile collections:
  - one parent `SketchProfiles` row
  - one child `SketchProfile` row per resolved closed profile member
- downstream `Geometry/Extrude` planning already expects the sketch side to publish:
  - one aggregate parent collection wire target
  - one singular-member wire target per resolved profile
- this is primarily a node-surface, selector/view-model, and graph-wiring contract cleanup

Current internal status:
- `Phase 1 - Parent SketchProfiles Contract Lock`
  - shipped
- `Phase 2 - Child SketchProfile Row Reveal`
  - shipped
- `Phase 3A - Surface And Selector Aggregate Versus Singular Contract`
  - shipped
- `Phase 3B - Child Member Endpoint And Wiring Identity`
  - implementation-ready
- `Phase 4 - Surface Honesty And Focused Verification`
  - proposed

Locked recommendation:
- do not split this work into a second top-level sketch family phase before implementation
- keep `Sketch - 2` as the one main phase for profile-output cleanup
- use `Phase 1` to lock the parent aggregate meaning first
- use `Phase 2` to reveal child-member rows
- use `Phase 3A` to tighten the visible and selector-owned aggregate-versus-singular contract
- use `Phase 3B` to isolate any deeper child-member endpoint and wiring-identity mechanics
- use `Phase 4` to finish wording, counts, and focused verification

Why this order is healthier:
- it locks the parent collection meaning before widening the visible row tree
- it lets Codex ship the row-identity and reveal behavior separately from downstream aggregate-versus-singular consumption semantics
- it keeps selector/surface alignment separate from any riskier endpoint-path or child-target mechanics
- it keeps the first patch surface small enough to review honestly
- it avoids mixing profile-output cleanup with the later broader sketch curve taxonomy

Immediate handoff:
- `Sketch - 2` remains the active sketch-family execution lane
- next implementation-ready slice: `Phase 3B - Child Member Endpoint And Wiring Identity`
- later sketch widening should become a separate phase after this profile collection contract is stable in live code

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - already owns the sketch output-row render path
  - already has dedicated `SketchProfiles` and `SketchProfile` output-row wording seams
  - is the clearest surface for locking parent-versus-child row meaning
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - already proves sketch output-row behavior in node modes
  - is the best interactive render seam for collapsed versus expanded output expectations
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - already proves static render structure and output wording
  - is the best static seam for child-row presence and output-surface honesty
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already exposes resolved sketch-profile counts and downstream aggregate-consumption hints
  - is the strongest selector/view-model seam for stable output-row identity and parent summary state
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - already covers whole-port aggregate-consumption behavior into extrude
  - is the strongest selector seam for later aggregate-versus-singular wiring proof

### Phase Breakdown

1. `Sketch - 2 Phase 1 - Parent SketchProfiles Contract Lock`
Reason:
- before widening the visible row tree, the sketch node needs one explicit answer that `SketchProfiles` is the one parent aggregate output and that any singular `SketchProfile` rows are child members rather than competing top-level outputs
Current status:
- shipped in this doc

2. `Sketch - 2 Phase 2 - Child SketchProfile Row Reveal`
Reason:
- once the parent aggregate meaning is locked, the node can honestly reveal one singular `SketchProfile` child row per resolved closed profile in essentials and expanded modes
Current status:
- shipped in this doc

3. `Sketch - 2 Phase 3A - Surface And Selector Aggregate Versus Singular Contract`
Reason:
- once the child rows are real, the downstream graph meaning must be tightened so a parent aggregate wire means “all profiles” while one child-member wire means “one selected profile”
Current status:
- shipped in this doc

4. `Sketch - 2 Phase 3B - Child Member Endpoint And Wiring Identity`
Reason:
- once the visible and selector-owned contract is explicit, any deeper work that turns revealed child members into more explicit endpoint or wiring targets should live in its own follow-on slice instead of hiding inside the surface-honesty pass
Current status:
- next implementation-ready slice in this doc

5. `Sketch - 2 Phase 4 - Surface Honesty And Focused Verification`
Reason:
- once the parent/child contract and wiring meaning are live, the family needs one final pass on wording, counts, empty-state honesty, and focused verification so the output surface becomes trustworthy and reviewable
Current status:
- proposed in this doc

## [x] `Sketch - 2 Phase 1` - `Parent SketchProfiles Contract Lock`

### Summary

#### Purpose:
- lock `SketchProfiles` as the one parent aggregate output row for all resolved closed sketch profiles

#### Owns:
- the parent aggregate meaning of `SketchProfiles`
- removal of the “competing top-level singular output” ambiguity
- the collapsed-mode baseline read for the sketch profile output surface

#### Does not own:
- revealing the per-profile child rows yet
- downstream extrude wiring semantics beyond the top-level aggregate meaning
- broader sketch curve or point taxonomy

#### Current strongest read:
- the sketch node already has enough resolved-profile state and output-row seams to lock the parent aggregate contract without reopening worker geometry or downstream toolbar work
- the live gap is narrower and more concrete than the broad phase title suggests:
  - `NodeView.tsx` still renders both `SketchProfiles` and `SketchProfile` as top-level managed output rows in the sketch output stack
  - the selector/view-model seam already exposes the resolved profile count the parent row should summarize
  - focused node-surface tests already prove the current top-level output structure and therefore are the right proving surface for the first cleanup pass
- the healthiest next step is to lock the top-level parent output meaning first, before revealing child rows or widening downstream wiring semantics

#### Shipped result:
- tightened the sketch output-surface contract so `SketchProfiles` now reads as the one top-level profile output row
- removed the competing top-level `SketchProfile` read from the root sketch output stack so later child-row reveal work can inherit one honest parent owner
- preserved the selector-owned resolved profile count as the parent summary seam instead of inventing a second count source
- kept this pass narrow:
  - no child-row reveal yet
  - no aggregate-versus-singular wiring expansion yet
  - no broader sketch curve taxonomy widening

#### Current code-backed read:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - already computes:
    - `collectionSummaryLabel`
    - `selectedProfileSummaryLabel`
  - already finds:
    - `sketchProfilesPort`
    - `sketchProfilePort`
  - still renders both ports as top-level managed outputs in the sketch output surface around the current `renderManagedGeometryOutputPort(...)` calls
  - is therefore the clearest implementation seam for removing the competing top-level singular-output read
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - already contains static output-surface assertions for both `SketchProfiles` and `SketchProfile`
  - is the best proving seam for top-level output structure and wording cleanup
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - already contains collapsed/expanded geometry-mode expectations for the sketch output rows
  - is the best proving seam for keeping the collapsed parent-row baseline honest
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already computes `profileCount` from `evaluation.outputsByNodeId[node.nodeId]?.SketchProfiles`
  - is the strongest selector seam for keeping the parent row summary grounded in resolved profile truth instead of family-local copy only

### Questions

#### [ ] Question 1 - What should the one durable top-level profile output row be?

##### Locked answer
- `SketchProfiles`

##### Why
- the sketch node owns a resolved collection of closed profiles, not one singular durable top-level profile slot

#### [ ] Question 2 - What should collapsed mode show first?

##### Locked answer
- one parent `SketchProfiles` row

##### Why
- collapsed mode should privilege the aggregate collection story first and avoid immediately widening into child members

### Spec

Locked first-cut direction:
- `Geometry/Sketch` should show one top-level profile output row named `SketchProfiles`
- that row should mean the whole ordered collection of resolved closed profiles currently available from the sketch
- the old singular `SketchProfile` output should stop reading like a competing top-level profile story
- collapsed mode should continue to show the one parent aggregate row even when only one resolved closed profile exists
- keep this pass narrow:
  - no child-row reveal yet
  - no broader sketch curve taxonomy work
  - no downstream extrude input rewrite
  - no viewport-selection work

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts` only if the visible parent summary still needs a small selector-backed cleanup

Implementation-ready checks:
- prove that `SketchProfiles` is the one durable top-level profile output row, not only the nicer label
- name the exact current ambiguity before implementation broadens:
  - `SketchProfiles` and `SketchProfile` both still render as top-level sketch outputs today
  - that top-level dual-output read makes the later parent-versus-child reveal harder to explain
- preserve the current resolved profile count seam instead of inventing a new count source
- keep the first pass on top-level ownership and collapsed-mode baseline only, so later child-row reveal still has a clean parent contract to build on

Suggested execution order:
1. Re-read the live sketch output-row assembly in `src/app/spaghetti/canvas/NodeView.tsx`, especially the current `sketchProfilesPort` and `sketchProfilePort` top-level render path.
2. Re-read the focused sketch output-row expectations in:
   - `src/app/spaghetti/canvas/NodeView.test.tsx`
   - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
3. Adjust the smallest sketch output-row seam needed so `SketchProfiles` becomes the one top-level profile output row in the sketch surface.
4. Preserve the selector-owned resolved profile count summary unless one small cleanup is needed to keep the parent row honest.
5. Extend focused tests so collapsed and current top-level sketch output expectations now prove the one-parent-row contract.

Definition of done:
- the sketch node has one explicit top-level `SketchProfiles` output row
- collapsed mode reads through that parent collection row
- the doc and code no longer imply that `SketchProfile` is a separate competing top-level output contract
- an implementer can start directly from the named `NodeView` and focused test seams without re-deciding whether this pass should already reveal child rows

## [x] `Sketch - 2 Phase 2` - `Child SketchProfile Row Reveal`

### Summary

#### Purpose:
- reveal one child `SketchProfile` row per resolved closed profile member when the parent collection expands

#### Owns:
- child-row reveal in essentials and expanded modes
- stable child-row identity
- keeping child rows visibly owned by the parent collection

#### Does not own:
- broad downstream aggregate-versus-singular consumption rules
- viewport member picking
- the broader sketch curve taxonomy

#### Current strongest read:
- once the parent aggregate row is locked, the next honest step is to reveal the child members directly under it instead of keeping per-profile targeting implicit or hidden
- the live seam is now concrete enough to name:
  - `SketchProfiles` already owns the parent collection summary and attached-body wording in `NodeView.tsx`
  - the repo still has old singular-row assumptions in tests and output-row lookups that need to move from “top-level output” expectations to “parent-owned child row” expectations
  - the selector/view-model seam already exposes `profileCount`, which is the honest first source of how many child rows should appear
- the healthiest next pass is to reveal child rows directly under the parent collection while keeping downstream aggregate-versus-singular wiring meaning deferred to `Phase 3`

#### Shipped result:
- tightened the sketch output-surface contract so `SketchProfiles` now owns the revealed singular `SketchProfile` member rows inside its attached body instead of restoring `SketchProfile` as a competing top-level output
- kept collapsed mode on the one parent collection row while essentials and expanded modes now reveal one child member row per resolved profile
- grounded child-row count in the existing resolved profile state instead of inventing a second output-count source
- kept this pass narrow:
  - no downstream aggregate-versus-singular wiring rewrite yet
  - no viewport member picking yet
  - no broader sketch curve taxonomy widening

#### Current code-backed read:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - already computes:
    - `resolvedProfileCount`
    - `collectionSummaryLabel`
    - `selectedProfileSummaryLabel`
  - already owns the parent `SketchProfiles` output-row render path and the attached-body copy seam for collection meaning
  - is the clearest surface for introducing parent-owned child `SketchProfile` rows instead of restoring a competing top-level singular output
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - already has helper coverage for finding sketch output rows and checking row-open state
  - is the best interactive proving seam for collapsed versus essentials/expanded child-row reveal
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - already asserts sketch output surface structure and wording around `SketchProfiles` and `SketchProfile`
  - is the best static proving seam for moving `SketchProfile` expectations from top-level output presence to parent-owned child-row presence
- `src/app/spaghetti/selectors/selectNodeVm.ts`
  - already exposes `profileCount`
  - is the strongest current seam for honest child-row count before later stable member-identity widening lands

### Questions

#### [ ] Question 1 - When should child profile rows appear?

##### Locked answer
- in essentials and expanded modes when `SketchProfiles` is revealed

##### Why
- collapsed mode should stay compact, while the richer modes should expose the resolved member structure

#### [ ] Question 2 - What should each child row be named?

##### Locked answer
- `SketchProfile`

##### Why
- each row means one resolved singular profile member, not another aggregate collection

### Spec

Locked first-cut direction:
- essentials and expanded modes should reveal one child `SketchProfile` row per resolved closed profile member
- those child rows should remain children of the parent `SketchProfiles` output row
- child rows should be directly wireable later, so their row identity must be stable enough for endpoints and tests
- the number of child rows should match the actual resolved profile count honestly
- keep this pass narrow:
  - no downstream extrude aggregate-versus-singular wiring rewrite yet
  - no viewport-selection behavior
  - no broader sketch curve taxonomy widening
  - no attempt to solve the final stable member-id system beyond what the current row/test seams honestly need

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- sketch selector / VM seams for stable child identity if needed

Implementation-ready checks:
- prove that `SketchProfile` returns as a parent-owned child row, not as a reverted top-level output row
- name the exact visible gap before implementation broadens:
  - Phase 1 established the one-parent-row contract
  - the sketch surface still does not reveal one child row per resolved profile member under that parent
- keep the child-row count grounded in the resolved profile count seam the repo already has
- keep the first child-row pass on reveal and ownership only, so `Phase 3` can still own aggregate-versus-singular wiring meaning cleanly

Suggested execution order:
1. Re-read the current parent `SketchProfiles` render path in `src/app/spaghetti/canvas/NodeView.tsx`, especially the output-row assembly and attached-body seams around the sketch output stack.
2. Re-read the focused sketch output-row expectations in:
   - `src/app/spaghetti/canvas/NodeView.test.tsx`
   - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
3. Adjust the smallest sketch output-row seam needed so essentials and expanded modes reveal one parent-owned child `SketchProfile` row per resolved closed profile member.
4. Keep child ordering and count grounded in the current resolved profile count seam unless one tiny selector/view-model cleanup is required.
5. Extend focused tests so the sketch surface now proves:
   - collapsed mode stays on the parent row
   - essentials and expanded modes reveal the child rows
   - the child rows are owned by `SketchProfiles`, not restored as separate top-level outputs

Definition of done:
- essentials and expanded modes reveal one child `SketchProfile` row per resolved closed profile
- child rows stay visibly owned by the parent `SketchProfiles` collection
- child row identity is stable enough for later wiring follow-ons
- an implementer can start directly from the named `NodeView` and focused test seams without re-deciding whether this pass should already widen into downstream extrude wiring semantics

## [x] `Sketch - 2 Phase 3A` - `Surface And Selector Aggregate Versus Singular Contract`

### Summary

#### Purpose:
- lock the visible sketch-surface and selector-owned meaning of parent aggregate versus singular child profile wiring

#### Owns:
- parent aggregate output meaning in the sketch surface
- singular child output meaning in the sketch surface
- selector-owned summary and target-state alignment for aggregate versus singular consumption

#### Does not own:
- child-member endpoint-path mechanics
- a new graph endpoint shape for revealed child rows
- the later extrude toolbar
- the broader curve and point taxonomy
- the full viewport selection contract

#### Current strongest read:
- once the child rows are real, the sketch surface and selector layer need one explicit rule:
  - parent `SketchProfiles` means “all resolved closed profiles”
  - child `SketchProfile` means “one selected resolved profile member”

### Questions

- the downstream extrude-owned aggregate contract is already shipped, so the next healthy sketch-side pass is to align visible row wording and selector-owned summaries to that truth before any deeper child-endpoint mechanics widen
- the live gap is now concrete enough to name:
  - `NodeView.tsx` already gives `SketchProfiles` aggregate-parent wording and `SketchProfile` child-member wording, but phase `3A` still needs one tighter explicit aggregate-versus-singular read instead of relying on scattered attached-body copy alone
  - `selectNodeVm.ts` already exposes the aggregate-aware extrude target seam through `profileTargetMode` and `profileCount`, so the selector layer already has the strongest current proof surface for the downstream meaning this sketch pass should mirror
  - focused node-surface tests already cover both the sketch parent/child output read and the extrude aggregate-versus-singular target read, making them the healthiest proving seam for a narrow visible-contract pass
- the healthiest next pass is to lock sketch-side visible and selector-owned honesty first, then leave any deeper child-endpoint mechanics to `Phase 3B`

#### Current code-backed read:

### Questions

#### [ ] Question 1 - What should wiring the parent `SketchProfiles` row mean?

##### Locked answer
- consume all resolved closed profiles from the sketch

##### Why
- the parent row is the aggregate collection output

#### [ ] Question 2 - What should wiring one child `SketchProfile` row mean?

##### Locked answer
- consume only that one selected resolved profile member

##### Why
- the child row is a singular member output, not another aggregate shortcut

### Spec

Locked first-cut direction:
- parent `SketchProfiles` output wording should mean aggregate consumption
- one child `SketchProfile` output wording should mean singular-member consumption
- downstream consumers such as `Geometry/Extrude` should continue to distinguish those two cases honestly
- the visible output-row contract and the selector/view-model contract should use the same aggregate-versus-singular meaning
- keep this pass narrow:
  - no new child endpoint-path contract yet
  - no compile/runtime routing rewrite
  - no viewport-selection widening

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`

Suggested execution order:
1. Re-read the current sketch selector path plus the already-shipped extrude aggregate target read.
2. Tighten the visible sketch output-row wording so aggregate and singular meanings stay explicit in the parent row, child rows, and attached-body summaries.
3. Verify selector-owned summary state still distinguishes parent collection versus one singular profile member honestly.
4. Extend selector and node-surface tests to prove both meanings remain stable without introducing a new child-endpoint contract.

Definition of done:
- the sketch output contract clearly distinguishes parent aggregate versus singular member meaning at the surface and selector layers
- downstream consumers still read both cases honestly without any sketch-side wording drift
- focused tests prove the visible and selector-owned contract is stable

#### Shipped result:
- tightened the sketch output surface so `SketchProfiles` now reads consistently as the aggregate parent collection while revealed child rows read explicitly as singular member targets
- kept the aggregate target summary visible in the parent collection body instead of hiding the collection meaning behind one managed-row state
- added focused selector proof that wiring `SketchProfile` into `Geometry/Extrude` still resolves as the singular `profileTargetMode: 'single'` path
- kept this pass narrow:
  - no child endpoint-path contract yet
  - no compile/runtime routing rewrite
  - no viewport-selection widening

#### Current code-backed read:
- `src/app/spaghetti/canvas/NodeView.tsx`
  - now keeps the aggregate target summary visible from the parent `SketchProfiles` row
  - now gives revealed child rows explicit singular-member wording
  - is the live sketch-surface seam that `Phase 3B` should treat as already-honest copy, not as an open wording problem
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - now proves the parent collection hint, aggregate summary, and singular child-member wording together
  - is the strongest static guard against sketch-side wording drift
- `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - now explicitly proves that `SketchProfile -> ExtrusionProfile` still lands as `profileTargetMode: 'single'`
  - is the strongest current selector-owned guard that the singular downstream meaning stays intact

## [ ] `Sketch - 2 Phase 3B` - `Child Member Endpoint And Wiring Identity`

### Summary

#### Purpose:
- isolate any deeper child-member endpoint and wiring-identity mechanics after the visible aggregate-versus-singular contract is already explicit

#### Owns:
- child-member endpoint identity if the revealed `SketchProfile` rows need to become more explicit graph targets
- any endpoint-path or row-to-endpoint mapping needed so child members are not only visible but also structurally addressable
- focused proof that child-member targeting stays distinct from the parent aggregate target

#### Does not own:
- re-deciding the visible aggregate-versus-singular wording that `Phase 3A` already owns
- broad compile/runtime widening beyond the smallest child-target identity seam actually needed
- the later extrude toolbar
- viewport picking

#### Current strongest read:
- the child rows now exist visibly under `SketchProfiles`, but any work that turns those revealed members into a more explicit endpoint or wiring contract is a separate risk class from surface-copy and selector alignment
- `Phase 3A` already locked the visible aggregate-versus-singular wording and selector proof, so the remaining gap is no longer "what should these rows mean?" but "do these revealed children already have enough structural identity to be addressed as distinct graph targets?"
- the current sketch child rows are still primarily a parent-owned visual surface in `NodeView.tsx`, while the stronger explicit graph-target seams still live in the registry, endpoint, and compile contracts
- the healthiest next move is to isolate that deeper mechanical question in its own follow-on slice instead of folding it into the already-shipped `Phase 3A`

### Questions

#### [ ] Question 1 - Do revealed child `SketchProfile` rows need their own explicit endpoint identity beyond the current parent-owned visual row surface?

##### Locked answer
- yes, if later wiring or endpoint registration still needs a stable member-target seam that the current visual child rows do not already provide

##### Why
- visible child ownership and explicit endpoint identity are related but not identical concerns

#### [ ] Question 2 - Should this pass reopen aggregate-versus-singular execution semantics?

##### Locked answer
- no
- keep this pass on child-member endpoint identity only

##### Why
- aggregate-versus-singular execution meaning already exists downstream and `Phase 3A` should already have aligned the visible sketch-side contract before this follow-on begins

### Spec

Locked first-cut direction:
- inspect whether the current child rows already map cleanly onto the endpoint and wiring seams the repo uses
- if not, add only the smallest child-member endpoint identity needed for stable targeting
- keep the parent `SketchProfiles` aggregate target distinct from any singular child-member target
- keep this pass narrow:
  - no broad graph endpoint redesign
  - no new viewport-selection behavior
  - no broader sketch taxonomy widening

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/contracts/endpoints.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- focused selector seams only if child-target identity needs one small view-model clarification

Implementation-ready checks:
- prove the exact remaining gap before implementation widens:
  - `Phase 3A` already made the parent-versus-child meaning explicit at the sketch surface and selector layers
  - the revealed child rows are still primarily visual children of `SketchProfiles`
  - `3B` should only decide whether they also need a distinct structural endpoint or path identity
- keep the parent `SketchProfiles` aggregate target as the one whole-port collection contract
- add only the smallest child-target identity seam needed for stable downstream targeting
- do not reopen aggregate-versus-singular runtime meaning that `Extrude-4` and `Sketch-2 Phase 3A` already locked
- do not broaden into viewport picking, toolbar workflow, or a general endpoint-system redesign

Suggested execution order:
1. Re-read the current child-row render seam in `src/app/spaghetti/canvas/NodeView.tsx` and the endpoint registration / compatibility seams in `src/app/spaghetti/contracts/endpoints.ts` plus `src/app/spaghetti/registry/nodeRegistry.ts`.
2. Re-read the compile handoff in `src/app/spaghetti/compiler/compileGraph.ts` to confirm where a child-member identity would need to survive beyond the surface.
3. Decide whether the revealed child rows already have enough stable endpoint identity for later wiring without inventing a second aggregate contract.
4. Add only the smallest row-to-endpoint or path-based identity seam needed so singular child targets stay explicit and structurally distinct from the parent collection target.
5. Extend focused tests so child-member targeting remains distinct from the parent aggregate target without reopening the broader runtime selection contract.

Definition of done:
- revealed child `SketchProfile` members are not only visible but structurally distinct enough for later wiring follow-ons
- the parent aggregate target remains explicit and separate
- the repo no longer has to guess whether child-row visibility already implies stable child-target identity

## [ ] `Sketch - 2 Phase 4` - `Surface Honesty And Focused Verification`

### Summary

#### Purpose:
- finish the sketch profile-output surface with honest wording, counts, empty states, and focused verification

#### Owns:
- visible count and summary cleanup
- empty-state honesty
- final focused tests for the `Sketch - 2` output contract

#### Does not own:
- broader sketch taxonomy growth
- viewport picking
- toolbar workflows

#### Current strongest read:
- once the parent/child output contract and wiring meaning are real, the last healthy pass is to tighten visible honesty and focused regression coverage instead of immediately widening into new entity families

### Questions

#### [ ] Question 1 - What should this final pass optimize for?

##### Locked answer
- visible honesty and reviewable proof

##### Why
- the user should be able to trust that counts, row presence, and empty wording match the actual resolved profile state

### Spec

Locked first-cut direction:
- make output counts match the resolved profile set
- keep empty-state wording explicit when no closed profiles exist
- keep parent and child row labels consistent with the aggregate-versus-singular contract
- add focused test coverage proving collapsed, essentials, and expanded reads stay honest

Likely implementation seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- any selector/view-model seams needed for count honesty

Suggested execution order:
1. Re-read the visible sketch output summaries and empty-state copy.
2. Tighten counts, labels, and empty wording to match the real resolved profile state.
3. Extend focused tests across collapsed, essentials, and expanded modes.
4. Record the shipped `Sketch - 2` result in the parent sketch index after implementation lands.

Definition of done:
- the sketch output surface reads honestly in all row modes
- the user can trust the visible counts and row presence
- `Sketch - 2` has one reviewable proof surface for future sketch-output widening

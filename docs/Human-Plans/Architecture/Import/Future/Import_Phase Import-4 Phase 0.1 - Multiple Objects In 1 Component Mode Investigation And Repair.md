# `Import-4 Phase 0.1` - `Multiple Objects In 1 Component Mode Investigation And Repair`

## Doc Header

### Doc History
9. 2026-04-16: Implemented `Import-4 / Phase 0.1.4 - Regression Proof And Narrow Cleanup` by tightening the staged Browser journey proof around the repaired `.glb` split-import path so it now explicitly covers truthful preview rows before commit, committed direct split child rows after `Add To Project`, unchanged flat `1 Object` behavior, and the absence of the old malformed exploded-child shape without widening the repair lane into new runtime behavior
8. 2026-04-16: Prepped `Import-4 / Phase 0.1.4 - Regression Proof And Narrow Cleanup` for implementation by grounding the final closeout pass in the existing staged Browser journey proof, the committed direct-child store proof, and the focused viewer plus viewer-host split-import load seams so the repaired `Multiple Objects In 1 Component` path can be locked end to end without widening into new import behavior or broader viewer cleanup
7. 2026-04-16: Implemented `Import-4 / Phase 0.1.3 - Commit Path Wiring For Multiple Objects In 1 Component` by rewiring the staged `commitStagedImportDraft()` helper so split child rows now emit the direct part-backed child marker added in `Phase 0.1.2`, while preserving `explodedFromReferenceId: null`, flat `1 Object` behavior, accepted transform settings, and preview-owned parent component plus ordering behavior
6. 2026-04-16: Prepped `Import-4 / Phase 0.1.3 - Commit Path Wiring For Multiple Objects In 1 Component` for implementation by grounding the next cut in the live `commitStagedImportDraft()` seam, the shared `createCommittedImportedReference(...)` helper, and the existing staged split-import store proof so the shipped multi-object mode can start emitting the new direct part-backed child contract without changing preview organization or the `1 Object` path
5. 2026-04-16: Implemented `Import-4 / Phase 0.1.2 - Part-Backed Child Load Contract` by adding one explicit direct part-backed child marker to the imported-reference runtime shape, teaching the viewer to branch direct child loads away from exploded provenance, and adding focused viewer proof that the new split-import load contract isolates the requested shared-asset child without weakening the older exploded path
4. 2026-04-16: Prepped `Import-4 / Phase 0.1.2 - Part-Backed Child Load Contract` for implementation by grounding the next cut in the imported-reference runtime shape owner, the viewer's current exploded-provenance branch, and the narrow direct child-isolation seam so the new split-import load contract can land without prematurely rewiring the staged commit path
3. 2026-04-16: Implemented `Import-4 / Phase 0.1.1 - Current Split-Import Failure Proof` by tightening the staged split-import store proof so it now explicitly records the missing `explodedFromReferenceId` on committed child rows, and by adding one focused viewer proof that current per-part child fields without exploded provenance are rejected before asset load begins
2. 2026-04-16: Prepped `Import-4 / Phase 0.1.1 - Current Split-Import Failure Proof` for implementation by grounding the first cut in the live staged commit seam, the viewer's exploded-versus-direct reference-load branching, the existing staged split-import store proof, and the already-shipped explode proof so the next change can lock the exact regression before any runtime contract repair begins
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 0.1`, splitting the broken `Multiple Objects In 1 Component` path into smaller subphases so Codex can research, repair, wire, and verify the staged `.glb` split-import flow one narrow step at a time

### Purpose

This doc defines the dedicated repair lane for the broken staged `Multiple Objects In 1 Component` mode.

Use it to answer:
- why the currently visible staged split-import mode is producing red committed child rows
- what contract should replace the current explode-shaped behavior for staged multi-object `.glb` imports
- how the repair should be broken into small enough implementation cuts for Codex to execute one by one
- what should stay out of scope while fixing this one import-mode path

### Why This Phase Exists

The staged import dialog already exposes:
- `1 Object`
- `Multiple Objects In 1 Component`

The user-visible problem is now narrower than generic staged feedback:
- the staged preview can organize split children under one parent component
- the accepted Browser rows land under that parent component
- but the committed child rows turn red after `Add To Project`

The current read is:
- `src/app/store/useAppStore.ts`
  - already commits split children as imported references under one authored component
  - currently stores `sourcePartKey` and `sourceMeshIndex` on those children
  - currently does not give those children a distinct first-class split-import load contract
- `src/viewer/Viewer.ts`
  - already knows how to load a whole imported reference
  - already knows how to isolate a child mesh when a reference is treated like an exploded child
  - currently treats child mesh provenance through the explode-shaped path
- `src/app/components/ViewerHost.tsx`
  - already turns thrown child-load errors into real Browser red/error rows
- `src/app/panels/selectStagedImportPreviewRows.ts`
  - already gives the staged preview the correct split rows before commit

So the next honest gap is not preview organization.

The next honest gap is:
- the split children need a first-class part-backed import load contract instead of piggybacking on exploded-reference semantics

## Doc Body

## [x] `Import-4 Phase 0.1` - `Multiple Objects In 1 Component Mode Investigation And Repair`

### Summary

#### Purpose:
- repair the currently broken staged `Multiple Objects In 1 Component` path so split `.glb` child rows load as normal imported children under one parent component instead of failing as if they were malformed exploded references

#### Target result:
- selecting `Multiple Objects In 1 Component` still produces one parent component with one child imported reference per truthful part
- committed split children can share the same source asset path while loading through an explicit part-backed contract
- committed split children no longer turn red immediately after `Add To Project`
- the `1 Object` path remains unchanged
- the older explode flow remains intact unless a later cleanup phase deliberately retires shared seams

#### Scope statement:
- this lane means repairing one already-shipped staged import mode
- this lane does not mean new import modes, drag-and-drop, generalized asset refactors, or a redesign of explode semantics outside what is required to stop the split-import regression

### Locked Direction

- keep the staged preview organization behavior intact unless a narrow correction is needed for parity with the final committed result
- prefer a first-class part-backed child load contract for split `.glb` imports:
  - child imported references may share the same `assetPath`
  - child imported references should carry explicit part-backed provenance
  - child imported references should not be treated as exploded-reference children by default
- keep truthful mode visibility:
  - `Multiple Objects In 1 Component` still appears only when the inspected structure honestly supports it
- keep the parent component ownership model intact:
  - one authored parent component
  - one imported child row per truthful part
- do not widen into:
  - new import settings
  - staged-session feedback or partial-failure contract work
  - preview Browser redesign
  - generalized viewer reference-loading cleanup beyond what this path needs

### Non-Goals

This lane should not expand into:
- changing the shipped `1 Object` import path
- reworking `explodeImportedReference(...)` unless a temporary bridge is required
- new file-format support
- broader import result messaging
- generalized imported-reference schema cleanup beyond the part-backed child load seam

### Internal Phase Ladder

The cleanest repair ladder is:

1. `Import-4 Phase 0.1.1 - Current Split-Import Failure Proof`
2. `Import-4 Phase 0.1.2 - Part-Backed Child Load Contract`
3. `Import-4 Phase 0.1.3 - Commit Path Wiring For Multiple Objects In 1 Component`
4. `Import-4 Phase 0.1.4 - Regression Proof And Narrow Cleanup`

Reason:
- first lock the exact failure surface in proof so implementation does not fix the wrong seam
- then add the minimal dedicated load contract the viewer can honor directly
- then wire the staged commit path to that contract
- finally prove the full staged journey and clean any narrow residue left by the temporary mismatch

## [x] `Import-4` - `Phase 0.1.1 - Current Split-Import Failure Proof`

### Purpose

- turn the current red-row regression into one explicit failing contract that names the real broken seam

### Goal

- prove exactly why committed split children fail after `Add To Project`

### Locked Direction

- keep this phase research and proof focused
- confirm the current staged preview still behaves as expected
- confirm the committed split children are failing because their current load provenance is wrong, not because the preview organization or parent component ownership is wrong

### Expected Implementation Shape

- inspect and tighten proof around:
  - `src/app/store/useAppStore.ts`
  - `src/app/store/useAppStore.test.ts`
  - `src/viewer/Viewer.ts`
  - `src/viewer/Viewer.test.ts`
- add or tighten one failing proof that the current committed split child contract is explode-shaped and invalid for direct staged split import
- capture the expected repair target in test language before changing runtime behavior

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - `commitStagedImportDraft()` currently commits split child rows through `createCommittedImportedReference(...)`
  - that helper currently writes:
    - `sourcePartKey`
    - `sourceMeshIndex`
    - but `explodedFromReferenceId: null`
  - this is the strongest runtime seam for the broken committed child contract
- `src/viewer/Viewer.ts`
  - `resolveExplodedReferenceLoadProvenance(...)` currently treats any row carrying any exploded field as an exploded child load
  - if `sourcePartKey` or `sourceMeshIndex` is present without a valid `explodedFromReferenceId`, the viewer throws an invalid provenance error
  - this is the strongest seam for proving the current split-import children are being interpreted through the wrong load contract
- `src/app/components/ViewerHost.tsx`
  - already converts thrown reference-load errors into Browser `error` state and red rows
  - this is useful context for the expected user-visible outcome, but Phase `0.1.1` should not change this file
- `src/app/store/useAppStore.test.ts`
  - already has staged split-import commit proof
  - currently proves:
    - one authored parent component
    - one child imported reference per part
    - part key and mesh index storage
  - currently does not prove:
    - the committed child load contract is incomplete
    - the missing `explodedFromReferenceId`
    - the direct causal mismatch with viewer load expectations
- `src/viewer/Viewer.test.ts`
  - already proves exploded-child failure when `sourceMeshIndex` cannot be resolved
  - already has the right neighborhood for one new focused proof that incomplete exploded provenance is rejected
  - gives this phase a narrow place to lock the runtime interpretation without widening into full staged-import integration tests

### First Pass Decisions

- keep `Phase 0.1.1` proof-only:
  - no runtime contract changes
  - no staged commit changes
  - no Browser copy or UI changes
- prefer tightening the existing split-import store proof over adding a broad new integration harness
- add one viewer proof only if it materially names the current contract mismatch more clearly than the store proof alone
- make the regression explicit in test language:
  - current committed split children are storing per-part fields
  - current committed split children are not storing a valid explode provenance contract
  - the current viewer interpretation therefore routes them into the wrong load branch
- keep the expected future direction visible in test wording:
  - the split-import path should become a direct part-backed child load, not an implicit explode child

### Exact First Code Cut

1. Tighten the staged split-import commit proof in `src/app/store/useAppStore.test.ts` so it explicitly asserts the current broken contract:
   - committed split children have `sourcePartKey`
   - committed split children have `sourceMeshIndex`
   - committed split children have `explodedFromReferenceId === null`
   - this is documented in the test name or expectation text as the currently broken state to be repaired by later phases
2. Add one focused viewer proof in `src/viewer/Viewer.test.ts` that locks the current interpretation:
   - a reference carrying split-child per-part fields without valid exploded provenance is rejected as invalid exploded provenance
   - keep the proof narrow to the viewer contract and do not involve staged import UI
3. If needed, add a short comment in the affected test describing why the current failure matters:
   - staged split import is currently committing per-part child rows through an explode-shaped contract the viewer does not accept as complete provenance

### Likely Files

- `src/app/store/useAppStore.test.ts`
- `src/viewer/Viewer.test.ts`

### No-Widening Rule

- do not change `src/app/store/useAppStore.ts` yet
- do not change `src/viewer/Viewer.ts` yet
- do not change Browser UI or dialog copy
- do not add a new imported-reference runtime shape in this phase
- do not turn this proof pass into the actual fix

### Implementation Risks

- accidentally fixing the runtime while trying to add proof, which would skip the point of this phase
- writing a test that only restates the current object shape without proving why it is invalid
- overfitting to Browser red-row UI instead of naming the actual runtime contract mismatch
- duplicating broad staged-import integration setup when the existing store and viewer proof seams are already sufficient

### Checklist

- [ ] tighten the staged split-import store proof so it explicitly names the current broken committed child contract
- [ ] add viewer proof that incomplete explode-shaped provenance is rejected for child loads
- [ ] keep the phase proof-only with no runtime changes
- [ ] make the next repair target obvious from the failing or tightened expectations

### Verification Shape

Minimum verification for this phase should cover:

- the staged split-import test now explicitly proves the current child rows are committed with per-part fields but without valid exploded provenance
- the viewer proof explicitly proves that this incomplete provenance is rejected by the current load contract
- no production behavior changes land in this phase

### Done Shape

`Phase 0.1.1` is done when:

- the exact committed split-import contract mismatch is explicit in proof
- the runtime reason for the red child rows is no longer implicit or tribal knowledge
- the next phase can add a direct part-backed child load contract without first rediscovering why the current path fails

### Done Shape

- the current failure is reproducible in focused proof
- the broken seam is explicit enough that the next implementation phase can fix one contract instead of guessing across multiple owners

### Implemented Result

- the staged split-import store proof now explicitly asserts that committed child rows carry `sourcePartKey` and `sourceMeshIndex` but still commit with `explodedFromReferenceId === null`
- the viewer proof now explicitly asserts that the current load contract rejects those per-part child fields without valid exploded provenance before any asset load begins
- the next repair target is now explicit in proof: split-import child rows need a direct part-backed load contract instead of the current incomplete explode-shaped contract

## [x] `Import-4` - `Phase 0.1.2 - Part-Backed Child Load Contract`

### Purpose

- give committed split child references one explicit direct-load contract instead of routing them through explode semantics

### Goal

- let the viewer isolate a part-backed child from a shared `.glb` asset without requiring exploded-wrapper provenance

### Locked Direction

- add the narrowest honest contract needed for direct part-backed child loads
- keep the contract explicit in runtime data rather than implicit in labels or preview rows
- avoid making split children pretend they came from `explodeImportedReference(...)`
- keep this phase runtime-contract-focused:
  - add the direct load contract
  - teach the viewer to honor it
  - do not yet rewire staged commit production data to use it
- keep the older exploded child contract explicit and separate:
  - exploded child loads still require `explodedFromReferenceId`
  - direct part-backed child loads must not silently fall through the exploded branch

### Expected Implementation Shape

- update the imported-reference runtime contract in the narrowest owner seam
- update viewer load branching so it can distinguish:
  - whole-reference load
  - exploded child load
  - direct part-backed split-import child load
- keep the direct part-backed branch truthful:
  - isolate the requested mesh or part from the shared asset
  - do not require exploded-wrapper provenance when the row is a split-import child

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - `ImportedReferenceRecord` is currently the narrowest runtime owner for imported-reference provenance fields
  - it currently exposes:
    - `explodedFromReferenceId`
    - `sourcePartKey`
    - `sourceMeshIndex`
  - Phase `0.1.2` should extend this record shape in the narrowest truthful way so direct part-backed child rows can identify themselves without borrowing explode semantics
- `src/viewer/Viewer.ts`
  - `resolveExplodedReferenceLoadProvenance(...)` currently interprets any exploded-style field presence as an exploded child load
  - `loadReferenceObject(...)` already contains the real mesh-isolation seam once a target part or mesh is known
  - this is the strongest implementation owner for splitting the load path into:
    - whole reference
    - exploded child
    - direct part-backed child
- `src/viewer/Viewer.test.ts`
  - now already proves the current incomplete exploded provenance is rejected
  - gives this phase the right narrow proof seam for the new direct part-backed branch without widening into staged UI or commit behavior
- `src/app/store/useAppStore.test.ts`
  - already locks the current broken committed child shape from `Phase 0.1.1`
  - should likely stay unchanged in this phase because the staged commit path is intentionally deferred to `Phase 0.1.3`

### First Pass Decisions

- keep `Phase 0.1.2` runtime-contract-only:
  - no staged import dialog changes
  - no staged commit wiring changes
  - no Browser error copy changes
- prefer one explicit direct child provenance marker over overloaded inference from missing exploded fields
- keep the new contract honest and narrow:
  - enough to load a part-backed child directly from a shared asset
  - not a generalized imported-reference schema redesign
- keep mesh or part isolation behavior aligned with the viewer's existing single-asset load semantics rather than inventing a second asset-loading owner
- preserve older explode behavior:
  - existing exploded reference tests should still describe a different branch with different required provenance

### Exact First Code Cut

1. Extend the imported-reference runtime shape in `src/app/store/useAppStore.ts` with one explicit direct part-backed child load marker or equivalent narrow contract field that distinguishes split-import child rows from exploded child rows.
2. Refactor the viewer load-branch seam in `src/viewer/Viewer.ts` so it resolves three cases explicitly:
   - whole imported reference
   - exploded child imported reference
   - direct part-backed child imported reference
3. Route the new direct part-backed branch into the existing mesh or part isolation seam without requiring `explodedFromReferenceId`.
4. Add focused proof in `src/viewer/Viewer.test.ts` that a direct part-backed child reference can load through the new branch while the older exploded branch still requires complete exploded provenance.
5. If needed, add one short comment in the viewer branch describing why split-import child rows are now a separate contract instead of an implicit explode variant.

### Likely Files

- `src/app/store/useAppStore.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`

### No-Widening Rule

- do not rewire `commitStagedImportDraft()` in this phase
- do not change staged preview organization or Browser layout
- do not change the shipped `1 Object` path
- do not broaden this into generalized reference-loader cleanup beyond the direct child contract split
- do not retire exploded-reference fields or rename the older explode path yet

### Implementation Risks

- adding a direct child marker that is too vague, forcing the viewer to keep guessing across branches
- accidentally changing the currently shipped staged commit path in the same pass, which would blur the boundary with `Phase 0.1.3`
- duplicating mesh-isolation logic instead of reusing the existing viewer seam that already isolates a child mesh after asset load
- making the new direct contract so broad that it becomes a stealth imported-reference schema rewrite
- weakening the older exploded branch by making incomplete exploded provenance silently behave like direct part-backed child load

### Checklist

- [x] add one explicit direct part-backed child load contract to the imported-reference runtime shape
- [x] update viewer load branching to distinguish direct part-backed child loads from exploded child loads
- [x] keep the older exploded child provenance contract explicit and intact
- [x] add focused viewer proof for the new direct part-backed child load branch
- [x] keep staged commit wiring deferred to `Phase 0.1.3`

### Verification Shape

Minimum verification for this phase should cover:

1. a direct part-backed child reference can be interpreted by the viewer without `explodedFromReferenceId`
2. the viewer still rejects incomplete exploded provenance when the row is not marked as a direct part-backed child
3. the whole-reference branch remains unchanged
4. no staged import commit behavior changes land in this phase

### Done Shape

- the viewer can load a part-backed child reference from a shared `.glb` asset through a direct split-import path
- the older explode path still has its own explicit provenance contract
- the staged split-import commit seam is now unblocked for `Phase 0.1.3` without this phase having to change shipped staged behavior yet

### Implemented Result

- `ReferenceLoadableItem` and the imported-reference runtime now expose one explicit `directPartSourceKind` marker for direct split-import child loads without changing the staged commit seam yet
- `Viewer.ts` now branches direct part-backed child loads ahead of exploded provenance and isolates the requested shared-asset mesh without requiring `explodedFromReferenceId`
- the older exploded child branch still keeps its existing explicit provenance contract and still rejects incomplete exploded rows that are not marked as direct part-backed children
- focused viewer proof now covers:
  - successful direct part-backed child load through the new split-import contract
  - continued rejection of per-part child fields that still have neither direct nor exploded provenance

## [x] `Import-4` - `Phase 0.1.3 - Commit Path Wiring For Multiple Objects In 1 Component`

### Purpose

- wire the staged split-import commit path to the new direct part-backed child contract

### Goal

- make `Multiple Objects In 1 Component` commit children that load successfully and stay nested under the authored parent component

### Locked Direction

- keep the staged UI and preview behavior stable unless a narrow parity fix is required
- preserve:
  - one authored parent component
  - one committed child imported reference per truthful part
  - existing up-axis and scale or units accepted-transform behavior
- keep the `1 Object` commit path untouched
- only rewire the shipped staged split-import commit output:
  - direct part-backed child loads should be emitted for `Multiple Objects In 1 Component`
  - exploded child loads should remain owned by the separate explode path
- keep the new direct child marker narrow and deterministic:
  - split children with real `sourcePartKey` and `sourceMeshIndex` should emit the new direct contract
  - flat-file and `1 Object` rows should continue to emit no child provenance

### Expected Implementation Shape

- update the staged commit seam in `src/app/store/useAppStore.ts`
- ensure committed split children carry the new direct part-backed provenance instead of the current broken explode-shaped data
- keep content ordering and parent-component ownership behavior unchanged

### Implementation-Prep Read

- `src/app/store/useAppStore.ts`
  - `commitStagedImportDraft()` is the explicit accept boundary for staged import and is the one owner that should flip from the old broken split-child shape to the new direct contract
  - `createCommittedImportedReference(...)` is the narrow helper currently used for:
    - flat `1 Object` acceptance
    - split child acceptance under preview-authored components
  - it currently writes:
    - `directPartSourceKind: null`
    - `explodedFromReferenceId: null`
    - `sourcePartKey`
    - `sourceMeshIndex`
  - this means the current staged split-import path is still not using the new `Phase 0.1.2` contract even though the viewer now supports it
- `src/app/store/useAppStore.test.ts`
  - already contains staged commit proof for the mixed flat-plus-structured acceptance path
  - currently proves the broken state by asserting split children still commit with `explodedFromReferenceId === null`
  - this is the strongest existing proof seam to flip toward the repaired direct child contract
- `src/viewer/Viewer.ts`
  - already supports the direct part-backed child load contract from `Phase 0.1.2`
  - should not need more than a narrow touch, if any, in this phase
- `src/viewer/Viewer.test.ts`
  - already proves the direct child branch itself
  - should likely stay unchanged unless one small proof is needed for parity with the committed record shape

### First Pass Decisions

- keep `Phase 0.1.3` commit-owner-focused:
  - no staged dialog UI changes
  - no Browser layout or copy changes
  - no generalized imported-reference cleanup
- prefer updating the single committed-reference helper rather than branching the staged commit path in multiple places
- preserve the existing accepted transform-override behavior exactly:
  - up-axis acceptance remains unchanged
  - scale or units acceptance remains unchanged
- preserve ownership and ordering exactly:
  - same authored parent component behavior
  - same child row order
  - same landing behavior
- keep the explode path fully separate:
  - do not make exploded children emit the direct child marker
  - do not change `explodeImportedReference(...)` in this phase unless a tiny compatibility adjustment is required

### Exact First Code Cut

1. Update `createCommittedImportedReference(...)` in `src/app/store/useAppStore.ts` so committed staged split children emit the new direct part-backed child marker when both:
   - `sourcePartKey` is present
   - `sourceMeshIndex` is present
2. Keep `explodedFromReferenceId` as `null` for staged split children in this direct contract path.
3. Keep flat staged imports and `1 Object` acceptance emitting:
   - `directPartSourceKind: null`
   - `sourcePartKey: null`
   - `sourceMeshIndex: null`
4. Tighten the existing staged split-import commit proof in `src/app/store/useAppStore.test.ts` so it now asserts:
   - split children keep truthful `sourcePartKey`
   - split children keep truthful `sourceMeshIndex`
   - split children now emit `directPartSourceKind: 'split-import-child'`
   - split children still emit `explodedFromReferenceId === null`
   - flat accepted rows still emit `directPartSourceKind === null`
5. If needed, add one short store comment noting that staged split imports now commit as direct part-backed children rather than exploded children.

### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

### No-Widening Rule

- do not change the staged preview Browser organization contract
- do not change Browser error presentation or retry behavior
- do not change `ViewerHost.tsx` load orchestration unless a narrow wiring fix is unexpectedly required
- do not widen into the final end-to-end cleanup and review work planned for `Phase 0.1.4`
- do not change the manual explode flow to use the direct child contract

### Implementation Risks

- accidentally setting the new direct child marker on flat rows or `1 Object` rows that should remain whole-reference imports
- accidentally touching the explode path and blurring the distinction between exploded children and split-import children
- updating the committed child record shape without tightening proof, leaving the new contract implicit again
- changing content ordering or accepted transform behavior while editing the shared commit helper
- widening this pass into Browser integration work that belongs in `Phase 0.1.4`

### Checklist

- [x] rewire staged split-import committed child rows to emit the new direct part-backed child marker
- [x] keep staged split children on `explodedFromReferenceId === null`
- [x] preserve flat and `1 Object` acceptance behavior unchanged
- [x] tighten staged commit proof for the new direct child contract
- [x] leave broader end-to-end cleanup deferred to `Phase 0.1.4`

### Verification Shape

Minimum verification for this phase should cover:

1. committed staged split children now carry `directPartSourceKind: 'split-import-child'`
2. committed staged split children still carry truthful `sourcePartKey` and `sourceMeshIndex`
3. committed staged split children still do not carry exploded provenance
4. committed flat accepted rows still do not carry the direct child marker
5. parent component ownership, committed ordering, and accepted transform overrides remain unchanged

### Done Shape

- after `Add To Project`, split child rows no longer enter Browser error state for this path
- split children still land in the right parent component and in truthful part order
- the staged commit seam now emits the `Phase 0.1.2` direct child contract, leaving only regression proof and narrow cleanup for `Phase 0.1.4`

### Implemented Result

- `commitStagedImportDraft()` now commits staged split child rows with:
  - `directPartSourceKind: 'split-import-child'`
  - truthful `sourcePartKey`
  - truthful `sourceMeshIndex`
  - `explodedFromReferenceId: null`
- flat accepted rows and `1 Object` acceptance still commit with no direct child marker
- the shared commit helper still preserves:
  - authored parent component ownership
  - committed child ordering
  - accepted up-axis and scale or units transform overrides
- the existing staged split-import store proof now names the repaired committed child contract instead of the old broken shape

## [x] `Import-4` - `Phase 0.1.4 - Regression Proof And Narrow Cleanup`

### Purpose

- lock the repaired behavior into focused proof and remove only the residue directly caused by the old broken split-import contract

### Goal

- leave the repaired mode covered and stable without widening the import family

### Locked Direction

- prefer proof and narrow cleanup only
- do not widen into new import functionality or larger viewer refactors
- keep any cleanup local to the split-import repair seam
- preserve the now-shipped direct part-backed split-import contract exactly
- keep the `1 Object` path and the older explode path explicit and unchanged

### Expected Implementation Shape

- expand the staged import Browser and or store proof to cover:
  - selecting `Multiple Objects In 1 Component`
  - truthful staged preview rows
  - successful committed child loads
  - unchanged `1 Object` behavior
- remove only the temporary split-import mismatch residue left by earlier phases

### Implementation-Prep Read

- `src/app/panels/BrowserPanel.test.tsx`
  - already has staged import journey coverage and split-mode visibility coverage
  - already includes the strongest Browser-facing seam for proving:
    - selecting `Multiple Objects In 1 Component`
    - truthful preview organization before commit
    - the repaired staged journey still staying draft-only until `Add To Project`
  - this is the strongest place to tighten one end-to-end user-flow proof instead of adding a broader integration harness
- `src/app/store/useAppStore.test.ts`
  - already proves the committed direct child contract from `Phase 0.1.3`
  - already locks:
    - direct child marker
    - truthful `sourcePartKey`
    - truthful `sourceMeshIndex`
    - shared parent ownership and ordering
    - unchanged flat-row null behavior
  - this is the strongest seam if one extra committed-result assertion is still missing after the Browser-flow pass
- `src/viewer/Viewer.test.ts`
  - already proves:
    - direct part-backed child load success
    - rejection of incomplete exploded provenance
    - direct split sibling derivation from one shared source in `0.2`
  - gives this phase an existing proof seam to preserve rather than extend unless one split-import closeout assertion is clearly absent
- `src/app/components/ViewerHost.test.tsx`
  - already proves grouped split siblings no longer fall back into repeated child loads once handoff is available
  - already proves the repaired runtime no longer routes grouped split rows into the old repeated per-child load path
  - should likely stay unchanged in this phase unless one end-to-end post-commit Browser state gap is still missing
- `src/app/components/ViewerHost.tsx`
  - already reflects the repaired split-import load path
  - should only change in `0.1.4` if one tiny cleanup is directly retired by the now-complete proof, not for style or architecture reshaping

### First Pass Decisions

- prefer tightening one existing staged Browser journey test over creating a new large integration harness
- treat `0.1.4` as the closeout proof pass for the repaired user flow:
  - staged settings selection
  - truthful preview rows
  - successful committed result
  - unchanged `1 Object` behavior
- keep cleanup tiny and optional:
  - remove only residue directly left by the old broken split-import mismatch
  - if no such cleanup is clearly unlocked, proof-only is acceptable
- preserve all direct split runtime contracts from `0.1.2` and `0.1.3`
- preserve the older explode proof and `0.2` performance proof without folding those lanes together

### Exact First Code Cut

1. Tighten the strongest staged import Browser journey proof in `src/app/panels/BrowserPanel.test.tsx` so it explicitly covers:
   - selecting `Multiple Objects In 1 Component`
   - truthful split preview rows before commit
   - `Add To Project`
   - committed child rows loading successfully instead of entering Browser red or error state
   - unchanged `1 Object` path behavior in the same proof neighborhood or in one adjacent focused assertion
2. Inspect `src/app/store/useAppStore.test.ts` and extend it only if one committed-result truth is still missing after the Browser-flow proof, such as:
   - preserved parent component ownership
   - preserved part order
   - unchanged flat-row null behavior
3. Inspect `src/app/components/ViewerHost.tsx` and related split-import seams for one-pass cleanup opportunities directly retired by the earlier broken-contract bridge work.
4. Remove only clearly retired residue and keep all remaining behavior unchanged.

### Likely Files

- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.tsx`

### No-Widening Rule

- do not add new import settings or new split-import behavior
- do not redesign staged preview organization
- do not widen into generic viewer caching or loader cleanup
- do not reshape the direct split runtime contract again
- do not merge the split-import repair lane with the `0.2` performance lane

### Implementation Risks

- writing a proof that only reasserts internal runtime shape without proving the repaired user-visible journey
- widening the phase into extra viewer cleanup that is not directly retired by the old broken split-import path
- weakening the unchanged `1 Object` path while tightening multi-object proof
- overlapping too much with `0.2` performance proof instead of closing out the correctness lane
- spending the phase on speculative cleanup when the real missing work is just the end-to-end regression proof

### Checklist

- [ ] tighten staged Browser journey proof for the repaired `Multiple Objects In 1 Component` flow
- [ ] prove committed split children no longer turn red after `Add To Project`
- [ ] keep parent ownership, truthful part order, and `1 Object` behavior unchanged in proof
- [ ] remove only narrow residue directly retired by the old broken split-import contract
- [ ] leave broader viewer and performance work out of scope

### Done Shape

- the repaired split-import path is covered end to end
- the old broken contract is no longer the hidden default for staged `Multiple Objects In 1 Component`

### Implemented Result

- `src/app/panels/BrowserPanel.test.tsx` now uses the repaired `.glb` split-import path as the closeout proof seam for this lane
- the staged Browser journey proof now explicitly covers:
  - selecting `Multiple Objects In 1 Component`
  - truthful split preview rows before commit
  - successful `Add To Project`
  - committed direct split child rows with:
    - truthful `sourcePartKey`
    - truthful `sourceMeshIndex`
    - `directPartSourceKind: 'split-import-child'`
    - one shared `directPartSourceGroupId`
    - `explodedFromReferenceId: null`
  - unchanged neighboring flat `1 Object` behavior for the accepted flat row
- no additional runtime cleanup landed in this phase because the remaining honest gap was regression proof, not another behavior change

### Verification

Minimum proof for `Import-4 Phase 0.1`:

1. the staged preview still shows truthful split rows under one parent component before commit
2. committed split children no longer turn red after `Add To Project`
3. committed split children still share the intended parent component and part order
4. the `1 Object` path still behaves exactly as before
5. the older explode path still has explicit proof and does not silently change shape

### Exit Criteria

`Import-4 Phase 0.1` is ready to implement when:
- the broken split-import failure is reproduced in focused proof
- the direct part-backed child load contract has one explicit owner
- the staged commit wiring and the viewer load branch are split into narrow enough cuts for Codex to execute one by one

# Worker Phase Worker 13 - Output Entry Locality Inside Shared Output Composition

## Doc Header

### Doc History
2. 2026-04-14 11:26:27: Marked `Worker 13 Phase 1 - Confirm Shared-Surface Locality Seam` complete as a read-only attribution pass, recording that the remaining shared-surface preview bug is primarily an upstream output-entry membership problem in `buildPreviewPreparationEntries(...)` and `selectPreviewRenderVmFromPreparation(...)` rather than a new `ViewerHost` assembly bug because `selectViewportResultState.ts` already applies branch-local retained-baseline splitting by overlay `viewerKey` membership and the host mostly forwards the resulting layer recipe
1. 2026-04-14 11:18: Added this standalone future Worker phase doc so the next worker-family lane can target the broader shared-output-composition preview-locality gap where one local branch edit inside a composed `Output Preview` surface can still dim, yellow, or drop unaffected sibling outputs because the viewport path does not yet scope retained baseline, preview overlay, and settled loaded-scene membership at the output-entry level

### Purpose

This doc defines the next implementation-ready phase under `Worker`.

Use it to answer:
- how ParaHook should scope preview locality when several visible outputs share one composed `Output Preview` surface
- why one local branch edit can still visually affect untouched sibling outputs even after the earlier simpler branch-local proofs landed
- where output-entry membership should decide:
  - stable loaded base
  - dimmed retained baseline
  - yellow preview overlay
  - settled loaded-scene completeness
- how to fix that locality gap without widening into worker invalidation redesign or viewer-only guesswork

### Why This Phase Exists

Current live symptom family:
- the user edits one branch inside a graph that publishes several visible outputs through one shared `Output Preview` surface
- the changed branch should keep:
  - dimmed retained baseline underneath
  - yellow preview overlay above it
- untouched sibling outputs inside that same composed surface should stay:
  - fully loaded/base during drag
  - visible in the settled loaded scene after commit

But the current preview path can still behave too broadly:
- untouched siblings can inherit the dimmed `lastLoaded` baseline treatment
- untouched siblings can be treated like preview members even though they are not changing
- after commit, untouched siblings can disappear from the settled loaded scene

The big-picture problem is not just one exact graph.

The broader issue is:
- branch-local viewport behavior inside one shared composed output surface is still too coarse
- the system can tell that the composed surface contains changed work
- but it cannot yet always tell which output entries inside that surface belong to:
  - the changed branch
  - retained untouched siblings

This phase exists to make preview locality output-entry-aware inside shared output composition surfaces.

### Scope

This phase covers:
- output-entry-level preview locality inside one shared `Output Preview` surface
- output-entry-level retained-baseline and overlay membership during local edit
- settled loaded-scene recomposition that preserves untouched sibling outputs after commit
- proofs that shared output composition no longer causes untouched outputs to look "in edit"

This phase does not cover:
- broad worker invalidation redesign
- separate `Output Preview` node support beyond what is already landed
- interaction release channel changes
- viewer cleanup or mesh-lifecycle bugs
- generic compare tooling or history playback

## Doc Body

## [ ] Worker 13 - Output Entry Locality Inside Shared Output Composition

### Header

Purpose:
- make branch-local preview behavior inside one shared composed output surface honest at the output-entry level

Owns:
- output-entry-level preview membership
- output-entry-level retained-baseline scoping
- settled loaded-scene completeness for untouched sibling outputs inside one shared output composition surface

Does not own:
- worker invalidation scope narrowing
- generic viewport theming redesign
- separate preview-node aggregation, except as already shipped elsewhere

### Current Constraints

This phase starts from the shipped groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker-Index.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Index-Gen2.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`

Locked starting constraints:
- keep graph-authored and accepted runtime truth upstream of the viewer
- do not let the viewer guess branch membership from styling alone
- prefer output-entry membership truth over broad whole-surface heuristics
- keep the next fix narrow to shared composed output surfaces before widening into more general topology or dependency redesign

Current live seams this phase should read against:
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- focused selector and viewer-host tests

Current code-backed read:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already applies branch-local retained-baseline layering by matching overlay `viewerKey` membership
  - so the final visual split is only as honest as the upstream output-entry membership it receives
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - already converts preview-preparation entries plus accepted bundle truth into viewer parts
  - is therefore the primary owner for making rebuilt-only versus retained output-entry membership more exact inside one shared composed surface
- `src/app/spaghetti/previewPreparation.ts`
  - still defines the slot-entry and output-entry translation that `selectPreviewRenderVm.ts` consumes
  - so any shared-surface fix should only widen into this file if the render-VM proof shows the membership gap begins before renderable-entry filtering
- `src/app/components/ViewerHost.tsx`
  - already knows how to render:
    - loaded base
    - dimmed retained baseline
    - preview overlay
  - so it should remain downstream unless proof shows the selector truth is already correct and only render-layer assembly is still too broad

Phase 1 code-backed attribution:
- the strongest current owner is rebuilt-versus-retained output-entry membership flowing through:
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- the strongest supporting reasons are:
  - `selectViewportResultState.ts` already splits branch-local baseline versus stable base strictly by overlay `viewerKey` membership instead of inventing a broad whole-surface rule
  - `ViewerHost.tsx` mainly forwards:
    - all-accepted preview parts
    - rebuilt-only preview parts
    - the selector-owned layer recipe
  - so if untouched siblings still dim or disappear inside one shared composed surface, the most likely miss is that the upstream preview VM still does not classify rebuilt-only versus retained output entries narrowly enough for the richer shared-surface case

Phase 1 locked outcome:
- `Worker 13` should treat the remaining bug primarily as a rebuilt-versus-retained output-entry membership seam
- `Phase 2` should therefore start by proving the shared-surface failure against the preview render VM and then read that same graph through `ViewerHost`

Important current-reality rule:
- this phase should not be framed as "fix one sketch with four profiles"
- the real issue is broader:
  - shared output composition still scopes preview membership too coarsely

### Locked Direction

#### 1. Preview locality inside one composed output surface must be output-entry-aware

The guiding rule for this phase is:
- one changed branch inside a shared composed output surface must not visually reclassify untouched sibling output entries

Important rule:
- "same `Output Preview` surface" is not enough reason for two output entries to share preview styling

#### 2. Retained baseline dimming belongs only to changed output entries

When one branch changes:
- changed output entries may keep a dimmed retained baseline underneath live preview
- untouched sibling output entries must stay ordinary loaded/base

Important rule:
- do not dim the whole composed surface just because one output entry inside it changed

#### 3. Settled loaded-scene recomposition must keep untouched sibling output entries visible

After commit:
- the changed output entry settles back to ordinary loaded/base presentation
- untouched sibling output entries remain visible in the loaded scene

Important rule:
- do not collapse the settled scene down to only the changed branch just because the surface was involved in the edit

#### 4. Keep the next fix local to output-entry membership truth

The likely seam is:
- output-entry membership flowing from preview preparation and preview render VM into selector layering

Important rule:
- fix output-entry membership before widening into more general viewer styling or invalidation redesign

### Implementation Target

`Worker 13` should make one behavior shift real:

- when one local branch changes inside one shared composed `Output Preview` surface, only the changed output entries receive branch-local preview treatment while untouched sibling output entries stay loaded/base during drag and remain visible after settle

The minimum meaningful behavior change should be:
1. one composed `Output Preview` surface shows several visible outputs
2. only one authored branch changes
3. changed output entries receive:
   - dimmed retained baseline
   - yellow preview overlay
4. untouched sibling output entries receive:
   - ordinary `lastLoaded` base during drag
   - continued visibility in the settled loaded scene after commit

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`

Likely supporting files:
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/components/ViewerHost.tsx`
- focused proof files under selector and viewer-host tests

### Verification Bar

This phase is only done if it proves both:
- untouched sibling outputs inside one shared composed surface no longer inherit branch-local preview styling during drag
- untouched sibling outputs remain visible after settle instead of disappearing from the loaded scene

Required proof:
- one selector-level regression for shared composed output locality
- one viewer-host regression for the same graph shape
- surrounding simpler branch-local proofs stay green

### Implementation Order

1. Confirm the coarse-membership seam inside one shared output composition surface.
2. Add the failing shared-surface locality regressions.
3. Narrow output-entry membership for retained baseline and overlay behavior.
4. Verify settled sibling completeness and stop.

## [x] Worker 13 Phase 1 - Confirm Shared-Surface Locality Seam

Goal:
- prove exactly where shared output composition is still too coarse:
  - preview preparation
  - preview render VM
  - selector layer construction
  - or final viewer read-through

Owns:
- seam attribution for branch-local preview locality inside one shared composed surface

File targets:
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- existing related proof files

Implementation target:
- name the exact owner of the broad shared-surface preview classification before runtime code changes begin

Verification bar:
- the remaining owner must be named precisely enough that the next phase can add failing proofs against one exact seam

Done when:
- the next sub-phase can say whether the bug is primarily:
  - rebuilt-versus-retained output-entry membership
  - retained-baseline scoping
  - or settled loaded-scene recomposition

Phase 1 result:
- the bug is primarily rebuilt-versus-retained output-entry membership in the preview render VM path
- `selectViewportResultState.ts` remains a downstream consumer of that membership truth
- `ViewerHost.tsx` remains a read-through/verification seam rather than the first repair target

Important rule:
- no broad runtime patch in this step

Stop rule:
- stop once the coarse-membership owner is attributable to one named seam

## [ ] Worker 13 Phase 2 - Add Shared-Composed-Surface Locality Regressions

Goal:
- lock the shared composed output-surface bug in focused failing proofs before changing runtime code

Owns:
- failing proof coverage for branch-local locality inside one shared `Output Preview` surface

File targets:
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

Implementation target:
- model one shared composed output surface where one local branch edit must not visually affect untouched sibling output entries
- start at the render-VM seam first, then keep one viewer-host read-through proof for the same graph shape

Verification bar:
- one failing render-VM or selector proof at the named membership seam
- one failing viewer-host proof

Done when:
- the failing proofs show:
  - untouched siblings dimming or yellowing during drag
  - or disappearing after settle

Important rule:
- keep the proof broader than one exact profile numbering story
- target shared output composition as the architectural condition

Stop rule:
- stop once the richer shared-surface bug is reproducible in focused proofs

## [ ] Worker 13 Phase 3 - Narrow Output Entry Preview Membership

Goal:
- make branch-local retained-baseline and overlay membership output-entry-aware inside one shared composed output surface

Owns:
- output-entry-level rebuilt-versus-retained preview membership
- output-entry-level retained-baseline scoping during local edit

File targets:
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- only the smallest supporting preparation seam if required

Implementation target:
- during drag, only changed output entries receive dimmed retained-baseline plus `previewMesh`

Verification bar:
- the Phase 2 locality regressions pass for drag-time behavior
- earlier simpler branch-local overlay proofs stay green

Done when:
- untouched sibling output entries stay `lastLoaded` during drag even though they share the same composed output surface

Important rule:
- keep this step focused on drag-time membership
- do not widen into settle behavior unless required by the same owner seam

Stop rule:
- stop once drag-time locality is honest

## [ ] Worker 13 Phase 4 - Preserve Settled Sibling Completeness And Verify

Goal:
- make the settled loaded scene preserve untouched sibling outputs after the changed branch commits

Owns:
- settled loaded-scene completeness for shared composed output surfaces
- final verification band for the new output-entry locality contract

File targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- focused proof files only

Implementation target:
- after commit, touched output entries settle back to ordinary loaded/base and untouched siblings remain visible

Verification bar:
- the shared-surface settle proof passes
- the earlier simpler branch-local proofs stay green

Done when:
- untouched sibling outputs no longer disappear after commit

Important rule:
- keep this step focused on settled loaded-scene completeness
- do not widen into unrelated compare or theming work

Stop rule:
- stop once shared-surface drag-time locality and settled sibling completeness are both honest

# Worker Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview

## Doc Header

### Doc History
12. 2026-04-13 18:16:40: Reworked the old mixed `Worker 10 Phase 2b` into an explicit umbrella with four smaller implementation subphases so Codex can now land post-release `auto / live` normalization, idle `draft` normalization, settled loaded-scene completeness, and branch-local visual stability one at a time instead of forcing one large selector-plus-viewer patch
11. 2026-04-13 18:12:11: Tightened `Worker 10 Phase 2b` against the updated `Worker 11` draft contract by making the settled draft/base proof explicitly require the whole loaded scene to remain visible, including retained siblings such as untouched parallel extrudes, so the next implementation pass does not accidentally trade yellow-preview cleanup for missing loaded objects
10. 2026-04-13 18:10:39: Updated the remaining Worker 10 phase language to align with the now-explicit `Worker 11` `final` contract, so `Phase 3` and the final behavior bar now treat final mode as authoritative-settled by default with only optional explicit `previewBrep` comparison instead of leaving final-mode overlay behavior implicit
9. 2026-04-13 18:03:14: Prepped `Worker 10 Phase 2b - Normalize Accepted Post-Release Draft Presentation To Committed Base` for implementation by grounding the pass directly in the new `Worker 11` `auto / live` and `draft` contract, tightening the exact file band, proving both the post-release `auto / live` and idle `draft` cases explicitly, and locking the no-previewBrep/no-final-redesign stop rule so the next code slice stays a true presentation-normalization pass
8. 2026-04-13 18:01:32: Added `Worker 10 Phase 2b - Normalize Accepted Post-Release Draft Presentation To Committed Base` after locking the first `auto / live` and `draft` contract in `Worker 11`, so the remaining Worker 10 implementation path now explicitly separates rebuilt-only overlay narrowing from the next accepted-post-release presentation fix instead of leaving that behavior as an ambiguous Phase 3 catch-all
7. 2026-04-13 17:17:27: Added the post-ship `Worker 10 Phase 2` follow-up note after narrowing the missed project-draft-preview shortcut in `selectViewportResultState.ts`, so graph-local rebuilt-only accepted preview overlay now wins over broad project draft viewer parts when both are available and the real-app two-extrude case no longer depends on the earlier test-only path
6. 2026-04-13 17:10:05: Marked `Worker 10 Phase 2 - Narrow Preview Overlay Membership To Rebuilt Work` complete after landing the rebuilt-only preview render mode across `previewPreparation.ts`, `selectPreviewRenderVm.ts`, and `selectViewportResultState.ts`, adding the focused rebuilt-versus-retained two-extrude proof coverage, and verifying the preview, viewport-selector, and build bands while leaving end-to-end viewer read-through and release/promotion behavior as the remaining `Phase 3` target
5. 2026-04-13 17:00:46: Prepped `Worker 10 Phase 2 - Narrow Preview Overlay Membership To Rebuilt Work` for implementation by grounding the next pass in the live preview render-VM, preview-preparation, and accepted-bundle seams, making the exact one-rebuilt-one-retained parallel-extrude proof graph explicit, and tightening the file targets, implementation order, verification band, and no-viewer-promotion stop rule so the slice stays a true rebuilt-only overlay-membership pass
4. 2026-04-13 16:57:08: Marked `Worker 10 Phase 1 - Freeze The Drag-Time Committed Base` complete after landing the selector-side committed-baseline freeze in `selectViewportResultState.ts`, adding the focused two-extrude live-drag regression, and verifying the selector proof plus build while leaving rebuilt-only overlay membership as the still-unshipped `Phase 2` target
3. 2026-04-13 16:53:43: Prepped `Worker 10 Phase 1 - Freeze The Drag-Time Committed Base` for implementation by grounding the first pass in the live retained-base and committed-authoritative selector seams, making the exact two-extrude drag proof graph explicit, and tightening the file targets, implementation order, verification band, and no-overlay-filtering stop rule so the first code slice stays a true committed-baseline freeze pass
2. 2026-04-13 16:50:00: Reworked `Worker 10` into three smaller implementation phases so the drag-time viewport-baseline lane can ship in narrow Codex-sized slices, separating the retained committed-base freeze, rebuilt-only preview overlay membership, and final viewer-layer plus release/promotion proof instead of treating the whole viewport-honesty pass as one large mixed seam
1. 2026-04-13 16:44:29: Created this standalone future Worker phase doc so the drag-time viewport baseline problem has its own implementation-ready planning surface, locking the intended `last committed -> preview mesh -> preview b-rep -> promoted final` behavior against the current selector, viewer, preview-bundle, and runtime seams instead of leaving it buried inside `Worker 9` notes

### Purpose

This doc defines the next implementation-ready phase under `Worker` for drag-time viewport result honesty.

Use it to answer:
- what geometry should remain visible when a user starts dragging a parameter in `auto` viewport mode with `live` execution
- how ParaHook should preserve the last committed geometry baseline while current preview results churn
- where retained base, preview overlay, and promotion semantics currently drift apart
- how branch-local preview overlays should stay narrow when only one authored branch changed

### Why This Phase Exists

Today ParaHook already has:
- retained base versus overlay fields in `selectViewportResultState.ts`
- layered viewer rendering in `ViewerHost.tsx`
- explicit accepted preview bundles with `rebuilt` / `retained` / `evicted`
- separate draft preview mesh and preview-ready authoritative geometry lanes

That is enough for the intended interaction model.

It is not enough for honest drag-time viewport presentation.

Current visible failure:
- the user starts dragging one `Extrude` depth in `auto` viewport mode with `live` execution
- the viewport enters preview styling
- the expected old committed geometry baseline no longer appears where the pre-drag object shape should remain
- the drag-time preview can therefore look like one broad preview scene instead of:
  - frozen last committed base
  - current preview overlay

Current code-backed reason:
- `selectViewportResultState.ts` still computes a retained base lane
- but the retained authoritative render VM is currently allowed to come from current published preview artifacts instead of the true pre-drag committed authoritative geometry
- and the preview overlay path can still include retained sibling entries from the accepted preview bundle instead of rebuilt-only entries

This phase exists to make the viewport tell one honest story:
- keep the last committed geometry visible during drag
- layer current preview results above it
- narrow preview overlay membership to the actually rebuilt branch when possible
- promote the best current result after release without inventing fake viewer-only geometry truth

### Scope

This phase covers:
- drag-time retention of the pre-drag committed geometry baseline
- preview overlay membership for branch-local rebuilds
- selector, runtime, and viewer layering semantics for `last committed`, `preview mesh`, and `preview b-rep`
- first explicit proof for one changed extrude branch in a parallel-branch graph

This phase does not cover:
- broader Worker 9 affected-subgraph routing
- scheduling policy redesign
- new viewport color systems beyond the existing presentation settings
- compare/scrubber UX
- generic multi-step geometry history playback

## Doc Body

## [ ] Worker 10 - Last-Committed Viewport Baseline During Live Preview

### Header

Purpose:
- keep the true pre-drag committed geometry visible as the retained base while live preview results update above it

Owns:
- drag-time viewport baseline semantics
- last committed versus current preview overlay separation
- rebuilt-only overlay membership for branch-local preview when an accepted preview bundle contains retained siblings
- promotion rules after release for draft mesh versus preview-ready authoritative geometry

Does not own:
- worker invalidation routing beyond what is already needed to expose honest rebuilt-versus-retained bundle entries
- full geometry-history playback
- viewer styling customization beyond the existing presentation-state ids

### Current Constraints

This phase starts from the shipped groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker-Index.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`

Locked starting constraints:
- graph-authored and accepted runtime truth remain the source of geometry state
- the viewport must not invent a hidden fourth geometry owner
- retained base truth should stay downstream from graph runtime accepted and committed lanes
- the viewer may layer base plus overlay, but should not decide geometry membership heuristically from styling alone

Current live seams this phase should read against:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Current code-backed read:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already exposes:
    - `lastLoaded`
    - `previewMesh`
    - `previewBrep`
  - already computes separate retained base and overlay render VMs
  - currently lets authoritative retained rendering prefer published preview artifacts, which can collapse the true pre-drag committed baseline into current preview publication
- `src/app/components/ViewerHost.tsx`
  - already supports layered rendering with:
    - `baseParts`
    - `overlayParts`
  - is therefore not the primary missing seam for base-plus-overlay capability
- `src/app/spaghetti/previewPreparation.ts`
  - currently excludes only `evicted` bundle entries when building preview renderables
  - can therefore pull `retained` sibling artifacts into the preview overlay path
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already finalizes accepted bundles with honest `rebuilt` / `retained` / `evicted` entries
  - should remain the owner of accepted bundle truth instead of pushing bundle reinterpretation into the viewer

Important current-reality rule:
- this phase should not rename the architecture into four permanent geometry lanes unless the code truly needs that contract
- the immediate honest need is a frozen drag-time committed baseline, not a generic history system

### Locked Direction

#### 1. Treat drag-time `last committed` as a frozen baseline, not as whatever the newest accepted preview publication happens to render

The intended behavior during interaction is:
- before drag:
  - the current accepted final geometry is the normal loaded base
- while drag is active:
  - the geometry that was committed before the drag began remains visible as the retained base
  - current preview results render above it
- after release:
  - the promoted current result becomes the new committed base

Important rule:
- drag-time retained base must not be refreshed from current preview publication if that publication already contains the changed branch

#### 2. `previewMesh` and `previewBrep` are overlay states, not replacements for the drag-time baseline

The intended visual story is:
- `last committed` stays underneath
- `previewMesh` is the live draft overlay
- `previewBrep` is the preview-ready authoritative overlay

Important rule:
- entering preview should not imply clearing the drag-time committed base when that base is still structurally valid

#### 3. Branch-local preview overlay membership should prefer rebuilt-only entries when bundle truth already distinguishes rebuilt from retained

When only one branch changed:
- the overlay should contain the rebuilt branch
- retained siblings should stay only in the retained base

Important rule:
- retained sibling entries in an accepted preview bundle are recomposition truth, not automatic preview overlay membership truth

#### 4. Promotion after release should use the best current result without inventing a separate permanent `last committed` result lane

On release:
- if preview-ready authoritative geometry is current and valid, it becomes the promoted committed result
- otherwise the current draft-visible result may remain visible until authoritative catches up
- once acceptance completes, the newly committed result returns to ordinary loaded/base presentation

Important rule:
- keep promotion semantics runtime-owned
- keep viewer presentation downstream from runtime acceptance instead of creating a viewer-owned commit cache

### Phase Plan

#### [x] Phase 1 - Freeze The Drag-Time Committed Base

Goal:
- make the retained base during live drag come from the true committed authoritative lane instead of the newest published preview publication

Owns:
- selector-side retained-base sourcing during interaction
- the first explicit proof that `last committed` remains visible under drag-time preview

Does not own:
- rebuilt-only overlay membership
- viewer release/promotion polish beyond what is needed to prove the retained base stays honest

Expected file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Current live read for this phase:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - currently builds `publishedAuthoritativeRenderVm` from current accepted preview publication
  - currently allows both `authoritativeRenderVm` and `committedAuthoritativeRenderVm` to prefer that published render VM over the true committed authoritative geometry render VM
  - currently computes the retained base through `resolveRetainedBaseCandidate(...)`, so this phase should stay in that selector seam instead of inventing a new runtime owner
- `src/app/components/ViewerHost.tsx`
  - already supports `baseParts` plus `overlayParts`
  - therefore should remain read-through proof only in this phase, not the main implementation owner
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already exposes both:
    - current accepted authoritative truth gated to current revision
    - committed authoritative truth ungated
  - therefore should remain the runtime source surface, not the place where the drag-time freeze is newly invented

First proof graph:
- one shared sketch feeds two parallel `Extrude` nodes
- both extrudes publish into `Output Preview`
- the user drags `Extrude 2` depth smaller in `auto` viewport mode with `live` execution
- expected result for this phase:
  - the retained base for `Extrude 2` still reflects the pre-drag committed authoritative shape
  - the live preview state may still be `previewMesh`
  - the untouched sibling may still overpaint incorrectly until `Phase 2`, but the changed branch's old committed shape must remain available as the retained base under the current preview overlay

Implementation target:
- in `auto` + `live`, a branch being dragged still shows the pre-drag committed geometry as the retained base
- the base must not silently switch to current accepted preview artifacts when those artifacts already include the changed branch

Verification bar:
- a focused selector proof for a parallel two-extrude graph
- drag-time retained base comes from committed authoritative geometry
- preview state still reports `previewMesh` or `previewBrep` honestly when present

Implementation order:
1. Add a failing selector proof in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` for the two-extrude live-drag case where the committed authoritative baseline for the changed branch differs from the current preview publication
2. Narrow `src/app/spaghetti/selectors/selectViewportResultState.ts` so the drag-time retained authoritative base does not source from current published preview artifacts when that would collapse the pre-drag committed baseline
3. Re-run the existing retained-base and auto-live preview selector tests to make sure this pass preserves current `previewMesh` / `previewBrep` state reporting
4. Leave viewer-host and overlay-membership behavior unchanged unless the selector contract itself proves they must move

Important rule:
- this phase is allowed to preserve the current broad overlay as long as the retained committed base becomes truthful again
- do not solve the retained-sibling yellow overlay problem here by partially reimplementing `Phase 2`

Stop rule:
- stop once the committed baseline stays visible and honest during live drag
- do not pull overlay-membership filtering into this phase unless it is strictly required to prove the base fix

#### [x] Phase 2 - Narrow Preview Overlay Membership To Rebuilt Work

Goal:
- make the preview overlay show rebuilt entries only when the accepted preview bundle already distinguishes rebuilt from retained

Owns:
- preview render-VM membership for branch-local preview overlays
- the first explicit proof that retained sibling geometry does not get painted as current preview work

Does not own:
- the selector-side committed-base freeze from `Phase 1`
- release/promotion behavior beyond what is needed to preserve existing overlay routing

Expected file targets:
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/previewPreparation.ts`
- targeted preview/selector tests

Current live read for this phase:
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - currently builds preview viewer parts from `buildPreviewPreparationEntries(...)` without any rebuilt-only filtering mode
  - is the smallest honest owner seam for deciding which accepted preview artifacts become overlay viewer parts
- `src/app/spaghetti/previewPreparation.ts`
  - currently excludes only `evicted` bundle entries when building `artifactByOutputEntryId`
  - therefore still allows `retained` entries to satisfy overlay renderability the same way `rebuilt` entries do
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already finalizes accepted bundles with honest `rebuilt` / `retained` / `evicted` status
  - should remain the owner of that truth rather than making the viewer or selector guess which artifacts are rebuilt
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already has the retained committed base fix from `Phase 1`
  - should consume a narrower overlay render VM in this phase, not become the place where bundle-entry-status filtering is reimplemented ad hoc

First proof graph:
- one shared sketch feeds two parallel `Extrude` nodes
- both extrudes publish into `Output Preview`
- a branch-local depth change rebuilds `Extrude 2`
- accepted preview bundle truth for the current graph revision contains:
  - `Extrude 1` output entry as `retained`
  - `Extrude 2` output entry as `rebuilt`
- expected result for this phase:
  - retained base still contains both committed objects from `Phase 1`
  - preview overlay contains only the rebuilt `Extrude 2` branch
  - `Extrude 1` no longer appears yellow just because it is retained in recomposed accepted preview truth

Implementation target:
- after a one-branch rebuild, the overlay contains rebuilt branch geometry only
- retained sibling entries remain in accepted bundle truth but do not automatically become preview overlay parts

Verification bar:
- a focused parallel-extrude proof where one branch is `rebuilt` and one branch is `retained`
- the untouched sibling no longer renders in yellow preview overlay styling
- accepted bundle recomposition remains intact

Implementation order:
1. Add a failing preview/selector proof for the exact one-rebuilt-one-retained two-extrude graph, asserting that preview overlay viewer parts include only the rebuilt output entry
2. Narrow `src/app/spaghetti/selectors/selectPreviewRenderVm.ts` and/or `src/app/spaghetti/previewPreparation.ts` so accepted preview bundle entries marked `retained` no longer automatically satisfy preview overlay membership
3. Re-run the `Phase 1` committed-base proof to ensure the retained base still carries the untouched sibling after overlay narrowing
4. Re-run focused viewer or selector read-through tests only as needed to prove that recomposed accepted bundle truth still exists even though overlay membership is now rebuilt-only

Important rule:
- do not delete or weaken retained bundle truth in this phase
- only narrow which accepted bundle entries become preview overlay renderables
- do not widen into release/promotion logic or viewer-layer styling polish here

Stop rule:
- stop once overlay membership is no broader than the actual rebuilt set for the proof graph
- do not widen into viewer-layer styling cleanup unless the render-VM contract truly requires it

#### [ ] Phase 2b - Post-Release Draft Presentation Umbrella

Important implementation rule:
- do not implement this umbrella in one patch
- implement the following subphases one by one

#### [x] Phase 2b.1 - End `previewMesh` Once `auto / live` Interaction Settles

Goal:
- make post-release `auto / live` accepted current draft/base stop reading as active preview

Owns:
- the first narrow `auto / live` post-release rule from `Worker 11`
- the selector-side distinction between active interaction preview and settled accepted draft/base truth

Expected file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Current contract source for this subphase:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
  - in `auto / live`, after release:
    - accepted current draft/base should read as `lastLoaded`
    - the old pre-drag retained base should no longer stay visible
    - `previewMesh` should no longer persist once interaction is over

Current live read for this subphase:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - currently owns the visible presentation-state decision for draft-visible truth
  - is the smallest honest seam for deciding when visible state stops being `previewMesh` and returns to settled base presentation
- `src/app/components/ViewerHost.tsx`
  - already reads selector-owned presentation-state ids
  - should remain untouched in this subphase unless selector truth is correct and rendered style still disagrees

Proof target:
- while dragging:
  - changed branch still uses `previewMesh`
- after release:
  - accepted current draft/base reads as `lastLoaded`
  - `previewMesh` is no longer the visible settled state

Verification bar:
- a focused selector proof for `auto / live` showing `previewMesh` during drag
- a focused selector proof for `auto / live` showing `lastLoaded` after release
- no regression to the `Phase 1` retained-base freeze or `Phase 2` rebuilt-only overlay membership

Implementation order:
1. Add a failing proof in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` for the post-release `auto / live` state where the current accepted draft result should present as `lastLoaded` instead of `previewMesh`
2. Narrow `src/app/spaghetti/selectors/selectViewportResultState.ts` so preview presentation ends when interaction ends and the accepted current draft/base becomes the visible truth
3. Re-run the retained-base and rebuilt-only overlay proofs to ensure this pass does not reopen already-fixed drag-time honesty work
4. Touch `src/app/components/ViewerHost.tsx` only if selector truth becomes correct but the rendered visible style still disagrees

Important rule:
- keep this subphase limited to `auto / live` post-release presentation normalization
- do not widen into idle `draft`, sibling-completeness, or dimmed-baseline styling here
- do not create a new geometry truth owner or accepted-result cache

Stop rule:
- stop once post-release `auto / live` no longer leaves the accepted current draft/base yellow
- do not widen into idle `draft` or sibling-completeness fixes here

#### [x] Phase 2b.2 - Normalize Idle `draft` To Settled Base Presentation

Goal:
- make idle accepted current draft/base read as settled `lastLoaded` instead of perpetual preview

Owns:
- the idle `draft` presentation rule from `Worker 11`
- the selector-side distinction between active `draft` interaction preview and idle settled `draft` truth

Expected file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.tsx` only if selector truth is already correct but read-through styling is still wrong
- `src/app/components/ViewerHost.test.tsx` only if needed for read-through proof

Current contract source for this subphase:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
  - in `draft`, when idle:
    - accepted current draft/base should read as `lastLoaded`
    - settled accepted draft should not remain `previewMesh`
    - only active interaction should keep yellow preview styling

Current live read for this subphase:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - currently owns the visible presentation-state decision for idle `draft` truth
  - is the smallest honest seam for deciding when settled `draft` returns to base presentation instead of staying in perpetual preview styling
- `src/app/components/ViewerHost.tsx`
  - already reads selector-owned presentation-state ids
  - should remain untouched in this subphase unless selector truth becomes correct and the rendered visible style still disagrees

Proof target:
- while actively editing in `draft`:
  - changed branch still uses `previewMesh`
- in idle `draft`, accepted current draft/base reads as `lastLoaded`
- idle settled draft no longer reads as perpetual `previewMesh`

Verification bar:
- a focused selector proof for `draft` showing `previewMesh` during active interaction
- a focused selector proof for idle `draft` showing `lastLoaded` after interaction settles
- a viewer-host read-through proof only if selector truth becomes correct but the rendered style still stays yellow
- no regression to the `Phase 1` retained-base freeze or `Phase 2` rebuilt-only overlay membership

Implementation order:
1. Add a failing proof in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` for idle `draft` where the accepted current draft result should present as `lastLoaded` instead of `previewMesh`
2. Narrow `src/app/spaghetti/selectors/selectViewportResultState.ts` so idle `draft` presentation ends preview styling once interaction is over and the accepted current draft/base becomes the visible truth
3. Re-run the active `draft` preview proof plus the retained-base and rebuilt-only overlay proofs to ensure this pass does not reopen already-fixed drag-time honesty work
4. Touch `src/app/components/ViewerHost.tsx` only if selector truth becomes correct but the rendered visible style still disagrees

Important rule:
- keep this subphase limited to idle `draft` presentation normalization
- do not widen into settled loaded-scene completeness, retained sibling visibility, or dimmed-baseline styling here
- do not create a new geometry truth owner or accepted-result cache

Stop rule:
- stop once idle `draft` settled truth no longer stays yellow
- do not widen into sibling-completeness or dimmed-baseline styling here

#### [x] Phase 2b.3 - Preserve Settled Draft Loaded-Scene Completeness

Goal:
- ensure settled draft/base still shows every object that belongs in the loaded scene after one branch changes

Owns:
- the settled loaded-scene completeness rule from `Worker 11`
- retained sibling visibility after one local branch edit settles

Expected file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.tsx` only if selector truth is already correct but the loaded scene still drops retained siblings
- `src/app/components/ViewerHost.test.tsx` only if needed for read-through proof

Current contract source for this subphase:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
  - in settled `draft`:
    - the accepted current draft/base should read as `lastLoaded`
    - the loaded scene must still include retained siblings such as untouched parallel extrudes
    - the scene must not collapse to only the changed branch after one local edit settles

Current live read for this subphase:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - currently owns the choice between visible draft truth and retained-base layering
  - is the smallest honest seam for deciding whether the settled visible draft scene includes only the changed branch or the full loaded object set
- `src/app/components/ViewerHost.tsx`
  - already reads selector-owned render VMs and presentation-state ids
  - should remain untouched in this subphase unless selector truth becomes correct and the loaded scene still drops retained siblings at render time

Proof target:
- with two extrudes, after changing and settling `Extrude 2`:
  - `Extrude 2` remains visible as settled loaded/base truth
  - retained sibling `Extrude 1` also remains visible
  - the scene does not collapse to only the changed branch

Verification bar:
- a focused selector proof for settled `draft` with two extrudes where one branch rebuilt and one sibling was retained
- a viewer-host read-through proof only if selector truth becomes correct but the rendered visible scene still drops the retained sibling
- no regression to `Phase 1`, `Phase 2`, `Phase 2b.1`, or `Phase 2b.2`

Implementation order:
1. Add a failing proof in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` for settled `draft` with two extrudes where changing `Extrude 2` must still leave retained `Extrude 1` visible in the loaded scene
2. Narrow `src/app/spaghetti/selectors/selectViewportResultState.ts` so settled `draft` visible truth preserves the full loaded object set instead of collapsing to only the rebuilt branch
3. Re-run the settled `draft` base-style proofs plus the rebuilt-only overlay and retained-base honesty proofs to ensure this pass does not reopen already-fixed preview-scoping behavior
4. Touch `src/app/components/ViewerHost.tsx` only if selector truth becomes correct but the rendered visible scene still drops retained siblings

Important rule:
- keep this subphase limited to settled loaded-scene completeness
- do not widen into per-object dimming, unchanged-sibling styling polish, or compare-state redesign here
- do not re-broaden preview overlay membership just to get retained siblings visible again

Stop rule:
- stop once settled draft/base preserves the whole loaded object set
- do not widen into per-object opacity or styling polish here

#### [x] Phase 2b.4 - Apply Branch-Local Visual Stability Styling

Goal:
- localize dimmed retained-baseline treatment to the edited branch while keeping unchanged siblings fully stable

Owns:
- the branch-local visual stability rule from `Worker 11`
- per-object changed-branch versus unchanged-sibling presentation during local edit

Expected file targets:
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- supporting selector seams only if the viewer needs clearer per-object ownership data

Current contract source for this subphase:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
  - while one branch is being edited:
    - unchanged siblings stay fully loaded/base and stable
    - the edited branch keeps a dimmed retained baseline underneath
    - only the edited branch gets `previewMesh`
    - unchanged siblings must not dim, flicker, disappear, or turn yellow

Current live read for this subphase:
- `src/app/components/ViewerHost.tsx`
  - currently owns the actual layered base-versus-overlay visual treatment
  - is the main seam for deciding whether styling is localized per object or flattened across the whole retained base layer
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already provides the retained base plus narrowed overlay split
  - should remain untouched in this subphase unless the viewer truly needs clearer ownership data to separate changed-branch styling from unchanged-sibling styling

Proof target:
- with two extrudes while editing `Extrude 2`:
  - unchanged `Extrude 1` stays fully loaded/base and stable
  - edited `Extrude 2` keeps a dimmed retained baseline underneath
  - only `Extrude 2` gets `previewMesh`
  - `Extrude 1` does not dim, flicker, disappear, or turn yellow

Verification bar:
- a focused viewer-host proof for the two-extrude branch-local edit case
- a proof that unchanged siblings keep ordinary `lastLoaded` styling while the edited branch alone receives retained-baseline plus preview treatment
- no regression to `Phase 1`, `Phase 2`, or the settled `Phase 2b` normalization/completeness passes

Implementation order:
1. Add a failing viewer-host proof in `src/app/components/ViewerHost.test.tsx` for the two-extrude case where only `Extrude 2` is being edited and `Extrude 1` must remain fully loaded/base
2. Narrow `src/app/components/ViewerHost.tsx` so branch-local visual treatment is applied per object instead of flattening the whole retained base layer into one dimmed or preview-colored scene
3. Re-run the rebuilt-only overlay, settled `draft`, and retained-base freeze proofs to ensure this pass does not reopen earlier honesty work
4. Touch selector seams only if the viewer cannot separate changed-branch versus unchanged-sibling treatment from the current data it already receives

Important rule:
- keep this subphase limited to per-object visual stability styling
- do not reopen overlay membership or settled loaded-scene completeness just to get styling separation
- do not widen into compare tooling, new theming systems, or color-system redesign here

Stop rule:
- stop once per-object visual stability is honest for the edited-versus-unchanged branch split
- do not widen into compare tooling or general color-system redesign here

Implementation status:
- landed in the viewer-owned seam through `src/viewer/Viewer.ts` plus `src/app/components/ViewerHost.tsx`
- the viewer now has an explicit `baselineParts` layer and a branch-local retained-baseline layer builder so unchanged siblings can stay fully loaded/base while the edited branch alone receives dimmed retained-baseline plus `previewMesh` treatment
- focused proof coverage now lives in `src/app/components/ViewerHost.test.tsx`, while the earlier selector-side `Phase 1`, `Phase 2`, and `Phase 2b.1` through `Phase 2b.3` verification band stayed green
- `Phase 3` remains the next open Worker 10 slice

- `draft` means “show draft truth,” not “keep draft truth yellow forever”

#### [ ] Phase 3 - Prove Viewer Layering And Release / Promotion Behavior

Goal:
- prove the full viewport story end to end:
  - retained committed base underneath
  - yellow preview mesh during live drag
  - blue committed/base presentation after release once the accepted current result settles
  - strict final-mode authoritative/base presentation by default
  - green preview-ready authoritative overlay only where final-mode comparison is intentionally allowed
  - return to ordinary committed/base presentation after promotion

Owns:
- viewer-layer proof through `ViewerHost`
- final release/promotion read-through for the `Worker 10` behavior story

Does not own:
- generic geometry-history systems
- broader worker invalidation redesign

Expected file targets:
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- supporting selector/runtime tests only if needed for honest read-through
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md` as the contract reference only

Implementation target:
- the viewer consumes the `Phase 1`, `Phase 2`, and `Phase 2b` contracts without flattening them back into one misleading preview surface
- final mode stays on authoritative/base truth by default instead of drifting into draft-visible preview presentation
- preview-ready authoritative comparison remains readable without overwriting the committed/base contract prematurely where that comparison is intentionally allowed
- after promotion, the committed accepted result becomes the ordinary loaded/base result again

Verification bar:
- a viewer-host proof for retained base plus preview overlay in the two-extrude drag case
- a viewer-host proof for post-release committed/base presentation after the accepted current draft result settles
- a viewer-host proof that final mode stays authoritative/base-only during live drag and waiting states
- a viewer-host proof for preview-ready authoritative overlay above the same base only if final-mode comparison is explicitly allowed
- a viewer-host or selector read-through proof that committed/base presentation returns after acceptance

Stop rule:
- stop once the end-to-end visual story is honest in the viewer
- do not widen into broader viewport theming or compare tooling

### Final Behavior Bar

`Worker 10` is complete only when all three phases together prove:
1. a parallel-branch graph has two visible extrude outputs
2. the user drags one extrude depth smaller in `auto` mode with `live` execution
3. the pre-drag committed shape of that branch remains visible as the retained base
4. the unaffected sibling remains visible as retained base, not as preview overlay
5. after release, the accepted current draft result returns to ordinary committed/base presentation instead of staying yellow
6. final mode keeps showing authoritative/base truth during live drag and waiting states instead of draft-visible preview
7. if a green preview-ready authoritative result appears before promotion and final-mode comparison is explicitly allowed, it overlays the same committed/base story honestly
8. after promotion and acceptance, the promoted committed result becomes the new ordinary loaded/base result

### Global Stop Rule

Do not widen `Worker 10` into:
- a generic geometry-history system
- viewport compare tooling
- broader `Worker 9` invalidation redesign
- unrelated `ViewerHost` styling cleanup

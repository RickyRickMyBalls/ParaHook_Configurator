# 18 - No Geometry While Changing Params

## Doc History
21. 2026-04-12 08:19:54: Completed `Phase 5 - Cleanup And Bug Closeout` by rerunning the final bug-18 proof matrix, marking the bug fixed, and recording the final shipped behavior that keeps retained committed geometry visible during waiting, restores yellow waiting preview in `Auto`, and stabilizes draft preview behavior in `Draft`
20. 2026-04-12 08:18:42: Tightened `Phase 5 - Cleanup And Bug Closeout` so the final bug-18 pass is implementation-ready around the shipped proof matrix, explicit fixed-state wording for both `Auto` and `Draft`, and the closeout-only boundary that avoids reopening runtime or selector ownership unless the final rerun exposes a real new seam
19. 2026-04-12 08:15:28: Completed `Phase 4 - Real Interaction Regression On The Actual Parameter Path` by proving the remaining yellow-preview seam on the real `Auto` waiting path, repairing the fallback so committed draft geometry can still surface as `previewMesh` while a newer live draft result is in flight, and handing bug 18 forward to final closeout
18. 2026-04-12 08:10:23: Tightened `Phase 4 - Real Interaction Regression On The Actual Parameter Path` so the next bug-18 pass is implementation-ready around the remaining live seam where `Waiting For Geometry` can still show retained committed geometry but no yellow `previewMesh`, narrowing the owner to real drag-lifecycle proof for current draft truth during waiting
17. 2026-04-12 08:05:11: Completed `Phase 3c - Retained Geometry Persistence During Waiting` by preserving retained committed geometry during temporary unresolved churn, adding the missing `Auto` retained-final base-only viewer path, and recording new proof that `Waiting For Geometry` can coexist with visible last-loaded geometry without weakening true dependency-break clearing
16. 2026-04-12 07:50:09: Tightened `Phase 3c - Retained Geometry Persistence During Waiting` so the next bug-18 pass is implementation-ready around the exact retained-base selector clear rule, the missing `Auto` retained-final base-only viewer path, and the proof split between temporary unresolved waiting versus true output removal or membership break
15. 2026-04-12 07:46:52: Added `Phase 3c - Retained Geometry Persistence During Waiting`, recording the new live finding that bug 18 still clears the last committed mesh while the status bar says `Geometry: Waiting For Geometry`, which narrows the next owner to retained-base clearing and viewer rendering of retained committed geometry during temporary unresolved churn
14. 2026-04-12 07:40:39: Completed `Phase 3b - Auto Draft Freshness Alignment` by gating viewer-target accepted preview artifacts behind the same current draft revision rule as accepted draft geometry, recording new proof that stale yellow artifact preview no longer surfaces as live current draft truth in `Auto`, and handing bug 18 forward to the real interaction regression phase
13. 2026-04-12 07:33:08: Added `Phase 3b - Auto Draft Freshness Alignment` after confirming bug 18 remains glitchy after `Phase 3a`, recording the new finding that `Auto` still mixes strict current-revision draft geometry with non-revision-gated preview artifacts, which can leave the yellow mesh stale or flickering during drag churn
12. 2026-04-12 07:28:38: Completed `Phase 3a - Live Auto Draft Lane Staging Repair` by carrying `draftGeometryResult` through the live authoritative-preview staging seam, recording new focused proof that `Auto` now advances the accepted draft lane to the current graph revision while preview-ready authoritative staging still preserves final acceptance rules, and handing bug 18 forward to the real interaction regression phase
11. 2026-04-12 07:20:21: Added `Phase 3a - Live Auto Draft Lane Staging Repair` after confirming the repaired yellow `previewMesh` can still get stuck in `Auto`, recording the new runtime finding that live authoritative-preview staging appears to preserve preview-ready and final lanes while dropping the fresh draft-geometry handoff that the live yellow mesh should follow
10. 2026-04-12 07:14:53: Completed `Phase 3 - Viewer Layer And Presentation Re-Proof` by adding focused `ViewerHost` regressions that prove the new `Phase 2` draft-only selector states already render as visible single-layer `previewMesh` output in both `Draft` and `Auto`, which means no `ViewerHost.tsx` composition fix was needed and the next remaining owner is now the real interaction path
9. 2026-04-12 07:11:26: Tightened `Phase 3 - Viewer Layer And Presentation Re-Proof` so the next bug-18 pass is implementation-ready around the exact `ViewerHost.tsx` retained-layer composition branch, the missing draft-geometry fallback proofs after `Phase 2`, and the stop-rule boundary that keeps this pass viewer-focused unless composition proof still fails
8. 2026-04-12 07:09:07: Completed `Phase 2 - Selector Draft Visibility Repair` by switching draft-preview resolution in `selectViewportResultState.ts` from artifact-preview-only gating to an artifact-first then current-draft-geometry fallback, which makes both `Draft` and `Auto` keep visible draft geometry even when the artifact-preview bridge is empty while preserving existing authoritative preview and release-policy selector proof
7. 2026-04-12 07:03:53: Added `Phase 2` through `Phase 5` for bug 18, breaking the post-research fix path into Codex-sized passes that start with the narrow selector draft-visibility repair, then prove viewer composition and real interaction behavior, and finally close the bug only after the full `Auto` plus `Draft` regression matrix stays green
6. 2026-04-12 06:59:37: Completed `Phase 1 - Runtime Timeline Trace` by recording new selector proof that current draft geometry can already exist while the viewport still resolves `no visible geometry` whenever the artifact-preview bridge is empty, which identifies the first bad transition inside viewport-result resolution rather than worker production and narrows the next owner to the draft-visibility contract in `selectViewportResultState.ts`
5. 2026-04-12 06:53:32: Added `Phase 1 - Runtime Timeline Trace` so bug 18 now has an explicit next research pass focused on capturing the real viewport-state handoff across drag start, drag settle, and release before any selector or viewer behavior changes are attempted
4. 2026-04-12 06:47:32: Completed `Phase 0` research for bug 18 by recording that current selector and viewer proof already covers retained draft base behavior in `Draft` plus draft-preview overlay behavior in `Auto`, so the loaded-draft-mesh hypothesis is not currently proven as a selector or viewer-composition failure and the stronger next owner is now the live runtime handoff path that feeds those surfaces
3. 2026-04-12 06:44:35: Added `Phase 0 - Research To Prove Or Disprove The Loaded Draft Mesh Hypothesis` so bug 18 now has an explicit first investigation pass centered on the narrower shared theory that the transient live preview can still appear but the retained or loaded draft mesh handoff fails in both `Auto` and `Draft`
2. 2026-04-12 06:42:19: Added the second live repro in `Draft` viewport mode after verification showed the transparent blue draft mesh can appear while `Geometry/Extrude.Depth` is actively moving but then disappears as soon as motion stops or the drag releases, which narrows the strongest current hypothesis toward the retained or loaded draft-mesh handoff rather than the first transient live-preview emission itself
1. 2026-04-12 06:38:46: Created this bug note to track the live viewport regression where changing a parameter such as `Geometry/Extrude.Depth` can make geometry disappear in the `Auto` viewport during the drag interaction, with the current repro showing no yellow `Preview mesh while changing param` layer at drag start, then a green preview mesh while the mouse is still held after the drag stops, and finally the final B-rep after mouse release

## Doc Body

### Status

- `[fixed]`

### Summary

This bug is fixed.

The shipped behavior now keeps geometry visible throughout parameter dragging:

- in `Auto`, the viewport keeps retained committed geometry visible during `Waiting For Geometry`
- in `Auto`, the yellow `Preview mesh while changing param` stays available during the waiting window when matching current or committed draft truth exists
- in `Draft`, the draft preview path stays visible through drag, settle-while-held, and release-adjacent behavior instead of disappearing

### Main Problem

When the user drags parameters, geometry disappears during the live interaction instead of keeping a visible preview layer on screen.

### Current Repro

#### Situation 1

- active viewport mode: `Auto`
- example parameter: `Geometry/Extrude.Depth`

#### Observed Sequence

1. If the user clicks `Depth` and starts to drag, geometry disappears and no yellow preview appears.
2. When the user stops dragging but keeps the mouse clicked, the green preview mesh loads.
3. When the user lets go of the mouse, the final B-rep geometry loads.

#### Situation 2

- active viewport mode: `Draft`
- example parameter: `Geometry/Extrude.Depth`

#### Observed Sequence

1. When the user drags `Depth`, they see a transparent blue mesh.
2. When the user stops moving the mouse but still holds the drag, that blue mesh quickly disappears.
3. When the user lets go of the mouse, the draft mesh disappears.

### User-Facing Symptom

- drag a live parameter in `Auto`
- the model disappears at drag start
- `Preview mesh while changing param` is missing during the live drag
- `Preview B-rep while changing param` can still appear later
- the final accepted geometry returns on release
- drag a live parameter in `Draft`
- a blue draft mesh can appear during active motion
- that draft mesh does not stay visible once movement stops or release happens

### Confirmed Current Behavior

- the issue is currently confirmed in the `Auto` viewport
- the missing layer is specifically `Preview mesh while changing param`
- the later green preview mesh and final B-rep are still able to appear
- this means the regression is not a total geometry failure; it is a missing or delayed live preview state during the drag
- the issue is also confirmed in the `Draft` viewport
- `Draft` can still emit a live transparent blue mesh while the parameter is actively moving
- the draft-mesh problem appears when that live preview should settle into the retained or loaded draft state

### Likely Scope

- `Auto` viewport live preview composition
- preview-state timing during drag interaction
- draft preview mesh visibility while the interaction is still active
- retained or loaded draft mesh visibility after movement stops
- any upstream preview-preparation or output-preview artifact path that feeds that live draft layer

### Likely Files

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`

### Impact

- high UX impact because the model disappears at the exact moment a user expects live visual feedback
- medium workflow impact because users lose confidence in whether the drag is working until they stop moving
- medium debugging impact because the later preview and final layers still appear, which can hide the missing live-preview seam
- the `Draft` repro increases confidence that the retained or loaded draft mesh handoff is part of the bug

### Questions To Resolve

1. Why does `Auto` lose `Preview mesh while changing param` at drag start while `Draft` can still show preview mesh behavior?
2. Is the live preview mesh state missing from selector state, or present in state but not composed into the visible viewer layers?
3. Did the recent `OutputPreview` / preview-preparation changes alter the artifact-backed preview entries that `Auto` relies on during churn?
4. Is the drag-start disappearance caused by a timing gap between retained geometry, draft preview mesh, and preview-ready authoritative preview?
5. In `Draft`, why does the live blue mesh appear during motion but fail to remain visible as the retained or loaded draft mesh once motion stops?

### Repro

1. Open a graph with visible extrude geometry.
2. Keep the active viewport in `Auto`.
3. Click and drag `Geometry/Extrude.Depth`.
4. Observe that geometry disappears immediately when the drag begins.
5. Keep holding the mouse after stopping the drag and observe that a green preview mesh appears.
6. Release the mouse and observe that the final B-rep geometry appears.
7. Switch the viewport to `Draft`.
8. Click and drag `Geometry/Extrude.Depth`.
9. Observe that a transparent blue draft mesh appears while the parameter is actively moving.
10. Stop moving the mouse without releasing and observe that the blue draft mesh disappears.
11. Release the mouse and observe that the draft mesh remains gone.

### Definition Of Done

- dragging a live parameter in `Auto` keeps geometry visible for the whole interaction
- `Preview mesh while changing param` appears during the live drag instead of disappearing
- the later preview-ready and final states still transition normally after drag stop and release
- dragging a live parameter in `Draft` keeps the loaded draft mesh visible after motion stops and after release

## [x] Phase 0 - Research To Prove Or Disprove The Loaded Draft Mesh Hypothesis

### Phase 0 Goal

Prove whether the shared failing seam is the retained or loaded draft mesh handoff, rather than the first transient live-preview emission itself.

### Current Hypothesis

- the transient live draft preview can still appear
- the retained or loaded draft mesh does not remain visible when the interaction settles
- that same failure can explain both:
  - `Auto` missing `Preview mesh while changing param`
  - `Draft` losing the blue draft mesh when motion stops or release happens

### Phase 0 Research Questions

1. During active drag, does selector state still publish a draft preview state in both `Auto` and `Draft`?
2. When mouse movement stops but the drag is still active, does the selector lose `retained-draft`, `previewMesh`, or both?
3. On mouse release, does `Draft` lose geometry because the accepted or retained draft lane is empty, or because the viewer composition stops drawing it?
4. Is the missing `Auto` yellow preview mesh caused by the same retained-draft handoff failure, or by an `OutputPreview` artifact-preparation gap that only affects `Auto`?

### Phase 0 Proof Plan

1. Add focused selector coverage in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` for:
   - `Draft` during active drag
   - `Draft` after drag motion stops but before release
   - `Draft` immediately after release
   - `Auto` during active drag with retained final plus draft preview available
2. Add one viewer-composition proof in `src/app/components/ViewerHost.test.tsx` for:
   - retained draft base plus draft overlay in `Draft`
   - retained final base plus draft overlay in `Auto`
3. Trace the runtime state that feeds those tests:
   - `acceptedDraftGeometryResult`
   - `committedDraftGeometryResult`
   - `acceptedPreviewBuildOutputs`
   - `visiblePresentationStateId`
   - `retainedBaseState`
   - `overlayResultClass`
4. If selector proof stays correct but the live bug remains, trace the interaction timing path in:
   - `src/app/store/useAppStore.ts`
   - `src/app/components/ViewportOverlay.tsx`
   - `src/app/spaghetti/canvas/NodeView.tsx`

### Expected Phase 0 Outcomes

- If the hypothesis is correct:
  - the tests will show the transient draft preview exists
  - the retained or loaded draft path will fail to remain visible during settle or release
- If the hypothesis is wrong:
  - the draft retained path will still be healthy in tests
  - the real bug will be more likely inside `OutputPreview` artifact preparation, viewer composition timing, or interaction lifecycle handling

### Phase 0 Findings

- Current selector proof already covers the retained draft base path in synthetic state.
- Current viewer proof already covers the retained-layer compositions we expected to fail if the loaded draft mesh seam were globally broken.
- That means Phase 0 does not currently prove that the loaded or retained draft mesh contract itself is broken in selector or viewer composition code.

### Existing Proof That Already Passes

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `uses retained draft mesh preview as the strict draft base during parameter churn`
  - `exposes previewMesh as the live preview state in auto live interaction when only draft preview exists`
- `src/app/components/ViewerHost.test.tsx`
  - `renders retained draft as a solid base plus live draft as a 50 percent overlay in draft mode`
  - `maps lastLoaded base style and previewMesh overlay style into the viewer layers`
  - `renders retained lastLoaded base plus previewBrep overlay in auto mode when a distinct authoritative preview-ready result exists`

### What Phase 0 Says Right Now

- `Draft` selector truth for retained draft and `Auto` selector truth for preview mesh are already provable under controlled state.
- `Draft` viewer composition for retained draft plus draft overlay is already provable under controlled state.
- `Auto` viewer composition for retained base plus preview overlay is already provable under controlled state.
- Because those seams are already covered and still pass, the stronger next owner is not currently `selectViewportResultState.ts` or `ViewerHost.tsx` by themselves.
- The stronger next owner is the live runtime handoff that feeds those proven seams during the real interaction timeline.

### Runtime Areas Now Most Suspect

- `src/app/store/useAppStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- any upstream live preview-preparation or artifact-staging path that changes what runtime state reaches the selector during drag start, drag settle, and release

### Phase 0 Verification

- Ran:
  - `npm.cmd exec vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/components/ViewerHost.test.tsx src/app/store/useAppStore.test.ts --reporter=verbose`
- Result:
  - `selectViewportResultState.test.ts` passed
  - `ViewerHost.test.tsx` passed
  - `useAppStore.test.ts` reported unrelated baseline failures in project-content and published-output areas, which did not disprove the preview-layer findings above

### Phase 0 Result

The retained or loaded draft mesh handoff is not currently proven as the failing seam.

The stronger next owner is the live runtime state-production and interaction-handoff path that feeds selector and viewer composition during:

- drag start
- drag motion stop while still held
- drag release

Phase 1 should stay research-first and trace the exact runtime values reaching the viewport stack across those three moments before we change selector or viewer behavior.

### Phase 0 Stop Rule

Do not change runtime behavior in Phase 0.

Phase 0 is complete only when we can say one of these two statements honestly:

- `The retained or loaded draft mesh handoff is the failing seam.`
- `The retained or loaded draft mesh handoff is not the failing seam, and the stronger next owner is X.`

## [x] Phase 1 - Runtime Timeline Trace

### Phase 1 Goal

Capture the real runtime viewport-state timeline during parameter dragging so we can prove whether geometry disappears because it is:

- never produced
- produced but staged into the wrong lane
- staged correctly but not selected
- selected correctly but not rendered

### Phase 1 Scope

- stay research-only
- do not change live viewport behavior yet
- prefer instrumentation, temporary debug surfacing, or focused runtime trace collection over speculative fixes

### Phase 1 Core Question

Across these three moments, what exact state reaches the viewport stack?

1. drag start
2. drag motion stops while the mouse is still held
3. drag release

### Phase 1 Trace Targets

For each of the three moments above, capture:

- `acceptedDraftGeometryResult`
- `committedDraftGeometryResult`
- `acceptedAuthoritativeGeometryResult`
- `acceptedPreviewBuildOutputs`
- `visiblePresentationStateId`
- `retainedBaseState`
- `overlayResultClass`
- any `previewPreparation` or artifact-preview entry counts that affect `Auto`

### Phase 1 Likely Owners

- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`

### Phase 1 Proof Plan

1. Trace the parameter-drag lifecycle for one concrete repro:
   - `Geometry/Extrude.Depth`
   - viewport mode `Auto`
   - viewport mode `Draft`
2. Add temporary instrumentation or debug surfacing around the runtime handoff points that feed the viewport selector.
3. Record the captured values for the three key moments:
   - drag start
   - drag stop while still held
   - release
4. Compare those traces against the already-passing selector and viewer proof from `Phase 0`.
5. Identify the first point in the pipeline where expected geometry truth disappears or changes class.

### Phase 1 Expected Outcomes

- If draft geometry never appears in runtime state, the owner is upstream production or worker staging.
- If draft geometry exists in runtime state but the selector drops it, the owner moves back toward selector logic.
- If selector truth is correct but visible geometry still disappears, the owner moves toward viewer composition or render-layer mapping.
- If `Auto` alone loses artifact-backed preview inputs while `Draft` keeps draft truth, the owner becomes `OutputPreview` or preview-preparation staging.

### Phase 1 Deliverable

At the end of Phase 1, bug 18 should include one honest statement naming the strongest next owner, such as:

- `The first bad transition happens in runtime staging before selector evaluation.`
- `The first bad transition happens when selector state resolves the viewport result.`
- `The first bad transition happens in viewer-layer composition after selector truth is already correct.`
- `The first bad transition happens in OutputPreview-backed preview preparation for Auto only.`

### Phase 1 Stop Rule

Do not implement the fix in Phase 1.

Phase 1 is complete only when the bug note names the first bad transition in the real runtime timeline with enough confidence to justify a narrow implementation phase.

### Phase 1 Findings

- The intended `Auto` contract is still `draft_preview` first and authoritative follow-through second.
- Current selector proof already shows a narrower failure mode than `worker did not build geometry`.
- New proof shows the viewport can already have current draft geometry while still resolving `no visible geometry`.

### New Proof Added In Phase 1

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `hides current draft geometry in draft mode when the artifact preview bridge is empty`
  - `falls to no visible geometry in auto mode when only draft geometry exists and retained final clears`

### What The New Proof Shows

- In `Draft`, the selector can receive a renderable `currentDraftGeometryResult` and still return:
  - `visibleResultClass = null`
  - `visibleSourceKind = none`
  - `fallbackReason = no-accepted-geometry`
- That happens even while:
  - `retainedBaseState = current`
  - the retained base is still `retained-draft`
  - the accepted draft state still exists
- In `Auto`, the same draft-only state also resolves to `no visible geometry` once the retained final base is cleared by dependency-break conditions.
- This means the draft lane can already be present, but the selector still does not treat it as usable visible draft geometry unless the artifact-preview bridge is also present.

### Current Strongest Cause

The first bad transition happens when viewport result state is resolved.

More specifically:

- live draft visibility is currently gated by the artifact-preview bridge
- the selector computes `draftPreviewCandidate` from artifact preview render data instead of the current draft geometry render VM
- the selector also computes `hasUsableDraftPreview` from artifact preview render data
- so `currentDraftGeometryResult` alone is not enough to produce visible `previewMesh`

### Why This Matches The Live Bug

- In `Draft`, a transient blue mesh can appear while artifact-backed preview is available, then disappear once that bridge is gone even though draft geometry truth still exists.
- In `Auto`, if the retained final base is also cleared during the same churn window, the viewport falls to zero visible geometry.
- Later, green `previewBrep` can still appear because preview-ready authoritative geometry uses a different selector lane.
- Final accepted B-rep can still appear on release because accepted authoritative truth uses a different selector lane again.

### Phase 1 Verification

- Ran:
  - `npm.cmd exec vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts --reporter=verbose`
- Result:
  - `selectViewportResultState.test.ts` passed with the new focused draft-visibility proofs

### Phase 1 Result

The first bad transition happens when selector state resolves the viewport result.

The strongest next owner is the live draft-visibility contract in `src/app/spaghetti/selectors/selectViewportResultState.ts`, especially the places where draft preview and usable draft geometry are still treated as artifact-preview-only.

### Phase 2 Recommendation

Keep the next implementation narrow.

- preserve the current authoritative preview-ready and final lanes
- preserve retained-base dependency-break rules unless the draft fix proves they also need adjustment
- make current draft geometry render data count as usable visible draft geometry even when the artifact-preview bridge is empty
- then re-prove both:
  - `Draft` keeps the blue draft mesh visible through drag settle and release-adjacent states
  - `Auto` keeps either yellow draft preview or retained visible geometry instead of dropping to nothing

## [x] Phase 2 - Selector Draft Visibility Repair

### Goal

Repair the narrow selector seam proven in `Phase 1` so current draft geometry can become visible draft preview even when the artifact-preview bridge is empty.

### Why This Phase Is Separate

- `Phase 1` already identified the first bad transition.
- The safest first fix is to change only the draft-visibility contract in one owning selector.
- This phase should not reopen viewer layering, interaction lifecycle, or unrelated `OutputPreview` behavior unless the selector fix proves insufficient.

### Scope

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- focused selector regression updates in `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Exact Owner Seams

- `resolveOverlayCandidate(...)`
- `buildViewportResultState(...)`
- the top-level `hasUsableDraftPreview` and visible-draft branch inside `selectViewportResultState(...)`

### Implementation Target

- stop treating artifact-preview render data as the only usable draft-preview lane
- allow `currentDraftGeometryRenderVm` to drive visible draft preview when it exists
- keep authoritative preview-ready and final accepted lanes unchanged

### Implementation-Ready Shape

1. Unify draft-preview selection around one candidate instead of two different draft-visibility checks.
2. In `resolveOverlayCandidate(...)`:
   - keep authoritative preview-ready behavior exactly as it is now
   - when draft display is allowed, prefer artifact preview if `previewRenderVm.viewerParts.length > 0`
   - otherwise fall back to `currentDraftGeometryRenderVm` if it has viewer parts
3. In `buildViewportResultState(...)`:
   - stop hard-coding `draftPreviewCandidate` as `buildCandidate('draft', 'artifact-preview', currentDraftGeometryResult, previewRenderVm)`
   - instead pass the real resolved draft candidate from step 2
4. In the top-level visible-draft path:
   - stop computing `hasUsableDraftPreview` from `previewRenderVm.viewerParts.length > 0`
   - compute draft usability from the resolved draft candidate
   - when the visible result becomes draft, use that candidate's `sourceKind` and `renderVm`

### Preferred Source-Kind Rule

- if artifact preview exists, keep `sourceKind = artifact-preview`
- if artifact preview is empty but current draft geometry render VM exists, use `sourceKind = retained-draft`
- do not add a new source-kind enum in `Phase 2` unless the existing values prove insufficient

### Must-Stay-True Constraints

- do not change `previewBrep` selection or authoritative preview-ready precedence
- do not change release-policy suppression behavior
- do not change retained-base dependency-break rules in this phase
- do not change `acceptedState` ownership unless the draft-visibility fix cannot land without it

### Proof To Add Or Tighten

- keep the two `Phase 1` regressions and make them pass with visible draft output
- add one explicit assertion that artifact-backed draft preview still wins over draft-geometry fallback when both are present
- keep the existing tests that prove:
  - `previewMesh` in `Auto` live interaction
  - `previewBrep` in `Auto` live interaction
  - release-policy preview suppression

### Suggested Verification Command

- `npm.cmd exec vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Acceptance

- the two new `Phase 1` draft-only selector regressions flip from `no visible geometry` to visible draft behavior
- existing `previewBrep`, retained-final, and release-policy selector tests still pass
- no unrelated viewer or store behavior is changed in this phase

### Implementation Completion Statement

`Phase 2` is complete only when we can honestly say:

- `Draft` no longer depends on artifact-preview-only truth to show current draft geometry
- `Auto` no longer falls to zero visible geometry in the selector when draft geometry exists but artifact preview is empty
- the selector still preserves authoritative preview-ready and final precedence exactly as before

### Stop Rule

Do not edit `ViewerHost.tsx`, `useAppStore.ts`, or `previewPreparation.ts` in `Phase 2` unless the selector change alone proves impossible.

### Phase 2 Findings

- The selector now resolves one usable draft-preview candidate instead of treating artifact-preview render data as the only visible-draft lane.
- Artifact-backed preview still wins when it exists.
- When artifact preview is empty, current draft geometry render data now becomes the visible draft-preview source.

### What Changed In Phase 2

- `resolveOverlayCandidate(...)` now falls back from `artifact-preview` to current draft geometry render data for draft-capable modes.
- `buildViewportResultState(...)` now receives the real draft-preview candidate instead of rebuilding an artifact-only draft candidate internally.
- The top-level visible-draft branch now uses the resolved draft candidate for:
  - draft usability
  - `visibleSourceKind`
  - `renderVm`
  - draft fallback metadata

### Phase 2 Verification

- Ran:
  - `npm.cmd exec vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Result:
  - `selectViewportResultState.test.ts` passed with all selector regressions green

### Phase 2 Result

`Phase 2` is complete.

The selector no longer requires artifact-preview-only truth to show current draft geometry in `Draft` or `Auto`.

The next owner is now `Phase 3 - Viewer Layer And Presentation Re-Proof`, which should confirm that the repaired selector truth is composed into the visible viewer layers exactly the way the user expects.

## Phase 3 - Viewer Layer And Presentation Re-Proof

### Goal

Prove that the fixed selector truth actually maps into the visible viewer layers for both `Draft` and `Auto`.

### Why This Phase Is Separate

- if `Phase 2` repairs selector truth but the visible mesh still drops, the remaining owner is likely composition or presentation-state mapping
- this keeps viewer work isolated from selector work

### Scope

- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewerHost.tsx` only if a narrowly scoped mapping fix is required

### Exact Owner Seam

- the retained-layer composition branch in `src/app/components/ViewerHost.tsx`
- specifically the `viewportResultState.retainedBaseState === 'retained'` gate that currently owns:
  - retained final base plus overlay in `Auto`
  - retained draft base plus overlay in `Draft`
  - fallback to single-layer `renderVm` when that retained-base gate does not match

### Proof Targets

- `Draft` keeps retained draft base plus visible draft overlay after motion settles
- `Auto` keeps visible draft preview or retained visible geometry instead of dropping to zero
- `previewMesh`, `previewBrep`, and `lastLoaded` presentation styles still map correctly

### Why Phase 3 Still Matters After Phase 2

- `Phase 2` repaired selector truth, but viewer composition still decides whether that truth becomes:
  - a two-layer retained-plus-overlay stack
  - or a single visible `renderVm`
- the current viewer composition only enters its special two-layer branches when `retainedBaseState === 'retained'`
- bug 18 still needs explicit proof that the new selector states from `Phase 2` render correctly through that viewer logic

### Implementation-Ready Shape

1. Start with proof only in `src/app/components/ViewerHost.test.tsx`.
2. Add one `Draft` case that mirrors the new `Phase 2` selector state:
   - current draft geometry exists
   - artifact preview is empty
   - viewer still renders visible draft geometry instead of zero layers
3. Add one `Auto` case that mirrors the new `Phase 2` selector state:
   - retained final is cleared
   - current draft geometry exists
   - artifact preview is empty
   - viewer still renders visible draft geometry instead of zero layers
4. If those tests fail because `ViewerHost.tsx` is dropping into the wrong composition path, make the smallest possible viewer fix:
   - prefer using the selector-provided `renderVm` and presentation ids correctly for the new draft-only states
   - do not redesign the whole layering system

### Existing Viewer Proof To Preserve

- `renders retained final as a solid base plus live draft as a 50 percent overlay in auto mode`
- `renders retained draft as a solid base plus live draft as a 50 percent overlay in draft mode`
- `maps lastLoaded base style and previewMesh overlay style into the viewer layers`
- `renders retained lastLoaded base plus previewBrep overlay in auto mode when a distinct authoritative preview-ready result exists`

### Must-Stay-True Constraints

- do not reopen `selectViewportResultState.ts` in `Phase 3` unless the viewer proof exposes a true selector/viewer contract mismatch
- do not edit `useAppStore.ts`, `previewPreparation.ts`, or interaction-lifecycle code in this phase
- preserve existing `previewBrep`, `lastLoaded`, and retained-base layering behavior
- keep any viewer code change limited to mapping or composition, not runtime ownership

### Suggested Verification Command

- `npm.cmd exec vitest run src/app/components/ViewerHost.test.tsx`

### Acceptance

- new or tightened viewer tests prove the visible layer stack for the bug-18 repro states
- no viewer regression against existing authoritative-preview or final-view paths

### Implementation Completion Statement

`Phase 3` is complete only when we can honestly say:

- the selector states repaired in `Phase 2` render correctly in `ViewerHost`
- the bug-18 `Draft` and `Auto` viewer compositions no longer have an unproven gap between selector truth and visible layers
- any remaining bug-18 risk has moved out of viewer composition and into the real interaction path

### Stop Rule

Do not edit runtime build dispatch or preview-preparation in `Phase 3` unless viewer proof shows selector truth is correct but composition is still wrong.

### Phase 3 Findings

- The repaired `Phase 2` selector states already map cleanly through `ViewerHost`.
- The viewer does not need an extra composition fix for the draft-only bug-18 states.
- In both `Draft` and `Auto`, the viewer can render those repaired states as a single visible `previewMesh` layer with no overlay.

### What Phase 3 Proved

- In `Draft`, current draft geometry with an empty artifact-preview bridge still renders visibly through `ViewerHost`.
- In `Auto`, current draft geometry with a cleared retained final base and an empty artifact-preview bridge still renders visibly through `ViewerHost`.
- The single-layer `renderVm` fallback path in `ViewerHost.tsx` is already sufficient for those repaired selector states.

### What Did Not Need To Change

- `src/app/components/ViewerHost.tsx`

### Phase 3 Verification

- Ran:
  - `npm.cmd exec vitest run src/app/components/ViewerHost.test.tsx`
- Result:
  - `ViewerHost.test.tsx` passed with all viewer regressions green

### Phase 3 Result

`Phase 3` is complete.

The next owner is now `Phase 3a - Live Auto Draft Lane Staging Repair`.

The bug is no longer blocked on selector truth or viewer composition proof. The new remaining seam is narrower: in `Auto`, the yellow `previewMesh` can return but still look stuck on the last accepted draft shape instead of following the active parameter drag, which points at runtime draft-lane staging rather than viewport composition.

## [x] Phase 3a - Live Auto Draft Lane Staging Repair

### Goal

Repair the live `Auto` interaction handoff so the yellow `previewMesh` follows the current drag instead of staying frozen on an older accepted draft shape.

### Why This Phase Exists

- `Phase 2` fixed missing draft visibility
- `Phase 3` proved `ViewerHost` already renders the repaired selector states correctly
- the new live repro shows a narrower runtime seam between those completed passes and the later interaction-regression proof
- that seam deserves its own bounded fix before we spend time writing broader end-to-end proof

### Current Finding

- in `Auto`, the yellow `previewMesh` can now appear again during drag
- but it does not visibly grow or shrink with the live parameter change
- the green preview-ready mesh and later final `B-rep` can still continue updating
- the strongest current owner is the live authoritative-preview staging path, where incoming `draftGeometryResult` appears not to be preserved alongside the staged preview-ready authoritative result

### Likely Owner Files

- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- focused proof in:
  - `src/app/store/useAppStore.test.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts` if selector proof needs one more live-lane assertion

### Exact Repair Target

- the `acceptBuildResult(...)` branch that stages live authoritative preview during active browser interaction
- the `stageAuthoritativePreviewGraphBuildResult(...)` runtime path that currently stages preview-ready authoritative truth without carrying the fresh draft geometry lane forward

### Implementation-Ready Shape

1. Add proof that a live `Auto` authoritative-preview acceptance during active interaction keeps the incoming `draftGeometryResult` available for the viewport draft lane instead of leaving the last older accepted draft shape in place.
2. Repair the narrow runtime staging seam so the fresh draft geometry stays reachable while authoritative preview-ready staging is active.
3. Re-prove that:
   - yellow `previewMesh` in `Auto` follows current draft geometry during drag
   - green preview-ready and later final `B-rep` behavior remains unchanged

### Must-Stay-True Constraints

- do not reopen `ViewerHost.tsx` in this phase
- do not reopen `previewPreparation.ts` or `OutputPreview` in this phase
- preserve `Draft` mode behavior that Phase 2 already repaired
- preserve live authoritative preview-ready staging and release promotion rules

### Suggested Verification

- `npm.cmd exec vitest run src/app/store/useAppStore.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Acceptance

- active `Auto` interaction keeps a live-updating yellow `previewMesh` instead of a stuck draft snapshot
- preview-ready authoritative staging still works during the same interaction
- no selector or viewer regressions are introduced while fixing the runtime handoff

### Stop Rule

Keep this phase narrow. If the runtime staging proof unexpectedly stays healthy, reopen the owner question explicitly instead of quietly stretching this phase into generic interaction debugging.

### Phase 3a Findings

- The active live authoritative-preview staging seam was preserving preview-ready authoritative truth without also advancing the incoming draft lane.
- `Auto` draft preview was therefore free to stay visible but stale, because the yellow `previewMesh` still read from the accepted draft lane keyed to the current graph revision.
- Carrying the incoming `draftGeometryResult` through that staging seam is enough to advance the live draft lane without reopening selector or viewer ownership.

### What Phase 3a Changed

- `useAppStore.ts` now forwards `draftGeometryResult` when live authoritative preview acceptance is staged during active browser interaction.
- `useSpaghettiStore.ts` now lets `stageAuthoritativePreviewGraphBuildResult(...)` accept optional `draftGeometryResult`.
- When that draft geometry is present, the runtime now advances:
  - `acceptedDraftGeometryResult`
  - `acceptedDraftGraphRevision`
- The same staging path still leaves:
  - `acceptedAuthoritativeGeometryResult`
  - `acceptedAuthoritativeGraphRevision`
  unchanged until the later promotion step.
- `StagedAuthoritativePreviewResult` stays authoritative-only.

### What Phase 3a Proved

- A live authoritative-preview acceptance can now update the accepted draft lane to the incoming current revision during active interaction.
- Final-authoritative acceptance rules still remain deferred until preview-ready promotion or release.
- Existing `ViewerHost` proof still stays green after the runtime staging repair.

### Phase 3a Verification

- Passed:
  - `npm.cmd exec -- vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "stages live authoritative preview while advancing the accepted draft lane to the incoming current revision"`
  - `npm.cmd exec -- vitest run src/app/store/useAppStore.test.ts -t "stages live authoritative results as preview-ready during active browser interaction without advancing accepted final truth"`
  - `npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx`
- Additional note:
  - full-file `useSpaghettiStore.test.ts` and `useAppStore.test.ts` runs still report unrelated baseline failures outside bug 18, so Phase 3a verification is anchored on the new focused regressions plus the viewer safety run above

### Phase 3a Result

`Phase 3a` is complete.

The next owner is now `Phase 3b - Auto Draft Freshness Alignment`.

## [ ] Phase 3b - Auto Draft Freshness Alignment

### Goal

Align `Auto` preview freshness so the yellow `previewMesh` follows the current drag revision instead of mixing fresh draft geometry rules with stale artifact-preview outputs.

### Why This Phase Exists

- `Phase 3a` repaired the live authoritative-preview staging seam
- the bug still looks glitchy in real use
- the new runtime finding is narrower than the later end-to-end interaction proof: `Auto` still appears to mix two different freshness contracts during drag churn

### Current Finding

- each geometry drag step advances `currentGraphRevision`
- accepted draft geometry is only considered visible when `acceptedDraftGraphRevision === currentGraphRevision`
- accepted preview artifacts are still available even when they were produced for an older accepted revision
- that mismatch can leave `Auto` showing:
  - stale yellow preview that does not grow with the drag
  - flicker when the current revision temporarily has no matching accepted draft geometry

### Likely Owner Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- focused proof in:
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Exact Repair Question

Decide how `Auto` should handle artifact-preview freshness during active drag churn:

1. gate artifact preview by the same current-revision freshness rule as accepted draft geometry
2. or suppress stale artifact preview during active interaction whenever current draft geometry is not current

Current recommendation:

- prefer option `1`
- make accepted preview artifacts obey the same revision-freshness contract as accepted draft geometry
- that keeps `Auto` from showing stale yellow preview as if it were live current draft truth

### Implementation-Ready Shape

1. Add proof for the churn state where:
   - `currentGraphRevision` is ahead of `acceptedDraftGraphRevision`
   - accepted preview artifacts still exist from the older revision
   - `Auto` should not present those stale artifacts as live current yellow preview
2. Repair the narrow freshness seam at the runtime-selector boundary.
3. Re-prove that:
   - `Auto` either shows current draft geometry or nothing-live honestly during that exact stale state
   - it no longer shows stale yellow geometry that appears frozen while the parameter keeps changing

### Must-Stay-True Constraints

- do not reopen `ViewerHost.tsx` in this phase
- do not reopen `OutputPreview` or `previewPreparation.ts` in this phase
- preserve the `Phase 2` and `Phase 3a` draft-lane fixes
- preserve preview-ready authoritative and final promotion behavior

### Suggested Verification

- `npm.cmd exec -- vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Acceptance

- `Auto` no longer renders stale yellow preview artifacts as if they were the current drag result
- the live drag either shows current draft truth or suppresses stale draft truth honestly
- flicker caused by revision-freshness mismatch is removed or materially reduced without regressing preview-ready/final behavior

### Stop Rule

Keep this phase narrowly about freshness alignment. If the proof shows artifacts are already freshness-correct, reopen the owner question explicitly before touching broader interaction code.

### Phase 3b Findings

- The remaining `Auto` glitch came from a freshness mismatch, not from missing runtime storage.
- Viewer-target accepted draft geometry was already gated by current revision, but viewer-target accepted preview artifacts were not.
- That let stale yellow artifact preview remain visible as if it were current live draft truth whenever drag churn advanced `currentGraphRevision` ahead of the last accepted draft revision.

### What Phase 3b Changed

- `useSpaghettiStore.ts` now gates `selectViewerTargetGraphAcceptedPreviewBuildOutputs(...)` with the same current draft revision check already used by `selectViewerTargetGraphAcceptedPreviewGeometryResult(...)`.
- Stored runtime `acceptedPreviewBuildOutputs` stay unchanged.
- Graph-level accepted output selectors and app-store policy logic stay unchanged.
- `ViewerHost.test.tsx` was updated so the preserved draft-mode artifact-preview proof now models a fresh current draft revision instead of the older stale-artifact shape that `Phase 3b` intentionally removed.

### What Phase 3b Proved

- Viewer-target preview artifacts are now hidden when `acceptedDraftGraphRevision !== currentGraphRevision`, even though the runtime still retains those stored artifacts.
- `Auto` no longer receives stale yellow artifact preview through the viewer-target selector during drag churn.
- Fresh draft-mode artifact preview and the broader `ViewerHost` safety suite still remain green after the freshness gate.

### Phase 3b Verification

- Passed:
  - `npm.cmd exec -- vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "gates viewer-target accepted preview build outputs by the current accepted draft revision while preserving stored artifacts"`
  - `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts -t "does not surface artifact-preview or previewMesh in auto mode when viewer-facing stale preview artifacts have been freshness-gated away"`
  - `npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx`

### Phase 3b Result

`Phase 3b` is complete.

The next owner is now `Phase 3c - Retained Geometry Persistence During Waiting`.

## [x] Phase 3c - Retained Geometry Persistence During Waiting

### Goal

Keep the last committed mesh visible while geometry is temporarily waiting, and keep the yellow live draft preview visible whenever current draft truth exists.

### Why This Phase Exists

- `Phase 3a` fixed live draft staging
- `Phase 3b` fixed stale yellow artifact freshness
- the live repro still shows the viewport going blank while the status bar says `Geometry: Waiting For Geometry`
- that means the remaining owner is now the retained committed geometry path, not the stale artifact path

### Current Finding

- `selectViewportResultState.ts` currently clears retained committed geometry too early because temporary unresolved output is still treated as if the current output no longer continues the accepted dependency path
- `ViewerHost.tsx` currently only has an `Auto` retained-final composition path when there is also a visible overlay, so retained committed geometry can still fail to render even if selector state keeps it
- the live repro is specifically:
  - top-right status reaches `Geometry: Waiting For Geometry`
  - the old committed mesh flickers off
  - the yellow preview may also disappear
  - the viewport can go blank even though the user still expects at least the last committed geometry to remain visible

### Likely Owner Files

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- focused proof in:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`

### Exact Repair Target

1. Split temporary waiting from true dependency break inside retained-base resolution:
   - temporary unresolved waiting should preserve retained committed geometry
   - true output removal, true source break, or true membership break should still clear it
2. Preserve or add a dedicated `Auto` viewer path that can render retained final base by itself when there is no current draft or preview-ready overlay
3. Keep the fresh yellow preview on top when current draft truth exists, but never require that overlay for the retained committed base to remain visible
4. Keep status reporting honest:
   - `Waiting For Geometry` may coexist with visible retained committed geometry
   - this phase must not fake `draft`, `final`, or `building-final` when only retained committed fallback is visible

### Implementation-Ready Shape

1. In `selectViewportResultState.ts`, narrow the continuation and retained-base clearing rules:
   - keep the existing hard clear for true missing output continuation or true part-membership break
   - stop treating temporary unresolved waiting as an automatic retained-base dependency break
2. Add focused selector proof in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` for:
   - `Auto` temporary unresolved waiting with retained committed final still visible
   - `Draft` temporary unresolved waiting with retained committed draft still visible
   - true output-membership drop still clearing retained committed geometry
3. In `ViewerHost.tsx`, add or preserve a base-only `Auto` retained-final render branch so selector truth can still become visible geometry without a draft or final overlay.
4. Add focused viewer proof in `src/app/components/ViewerHost.test.tsx` for:
   - `Auto` retained final visible by itself while waiting
   - `Auto` retained final plus yellow overlay still layering correctly when fresh draft truth exists
5. Re-prove status behavior in `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`:
   - `Waiting For Geometry` can coexist with visible retained committed fallback
   - preview-ready authoritative and final-visible status rules remain unchanged

### Must-Stay-True Constraints

- do not reopen `OutputPreview`, `previewPreparation.ts`, or runtime artifact storage in this phase
- preserve the `Phase 3a` live draft-lane fix
- preserve the `Phase 3b` stale artifact freshness gate
- preserve true dependency-break clearing when output membership genuinely disappears
- do not silently promote retained committed fallback into current draft or current final truth
- do not rewrite status semantics just to hide the blank-viewport bug; the fix must come from retained geometry persistence and rendering

### Suggested Verification

- `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/components/ViewerHost.test.tsx src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`

### Acceptance

- while the status bar says `Geometry: Waiting For Geometry`, the last committed mesh remains visible if it still exists
- `Auto` does not flicker to an empty viewport during temporary unresolved churn
- yellow live draft preview still appears on top when fresh current draft truth exists
- true output removal or membership break still clears retained geometry instead of leaving stale committed shapes behind

### Stop Rule

Keep this phase strictly about retained committed geometry persistence during waiting. Do not reopen drag dispatch, `OutputPreview`, or runtime build staging in this pass. If the viewport still blanks after retained-base selector proof and `ViewerHost` base-only rendering are repaired, reopen the owner question explicitly before broadening into interaction-lifecycle code.

### Phase 3c Findings

- temporary unresolved waiting was still being treated as if the current output no longer continued the accepted dependency path
- that caused retained committed geometry to clear too early in `selectViewportResultState.ts`
- even when selector state preserved retained final, `Auto` still had no base-only retained-final render branch in `ViewerHost.tsx`
- status behavior itself did not need a semantic rewrite; the missing piece was allowing visible retained committed geometry to coexist with `Waiting For Geometry`

### What Phase 3c Changed

- `selectViewportResultState.ts`
  - `hasCurrentOutputContinuation(...)` now treats slot status `unresolved` as continuing output ownership when the source node and part key still exist
  - true empty or missing continuation still clears retained committed geometry
- `ViewerHost.tsx`
  - `Auto` now has a retained-final base-only layered render path when no live overlay is currently available
- focused proof updates
  - `selectViewportResultState.test.ts`
  - `ViewerHost.test.tsx`
  - `selectViewportResultStatus.test.ts`

### What Phase 3c Proved

- temporary unresolved waiting now keeps retained committed final and draft geometry available as `lastLoaded` fallback
- true output-membership break still clears retained geometry
- `Auto` can now render retained final by itself while geometry is temporarily waiting
- `Waiting For Geometry` can honestly remain the status label while last-loaded geometry is still visible
- when fresh draft truth exists during unresolved waiting, `Auto` keeps retained final underneath the yellow draft preview instead of blanking the base

### Phase 3c Verification

- Passed:
  - `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx`
  - `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`

### Phase 3c Result

`Phase 3c` is complete.

The next owner is now `Phase 4 - Real Interaction Regression On The Actual Parameter Path`.

## [x] Phase 4 - Real Interaction Regression On The Actual Parameter Path

### Goal

Prove the remaining live bug against the real parameter-edit interaction path and identify why current yellow `previewMesh` still disappears while the viewport reports `Waiting For Geometry`.

### Why This Phase Is Separate

- the bug is user-visible during a real drag interaction
- we need one regression that exercises the actual interaction lifecycle so the bug does not come back through event timing
- `Phase 3c` repaired retained committed fallback, but the live yellow draft-preview seam is still not fully proven on the actual drag path

### Scope

- likely `src/app/store/useAppStore.test.ts`
- likely `src/app/components/ViewerHost.test.tsx`
- possibly one focused real-surface interaction test around `NodeView` or `ViewportOverlay` if needed
- first preference: use the highest stable test seam that can model the actual drag lifecycle without reopening unrelated viewer or selector ownership

### Current Remaining Seam

- when geometry is `Waiting For Geometry`, the last committed mesh can now stay visible
- but the yellow `previewMesh` still may not appear during the same waiting window
- that means the unresolved waiting base-fallback seam is no longer the only owner
- the next question is whether current draft truth is:
  - never produced during the drag timing window
  - produced but not staged into the live lane
  - staged but not considered current during waiting
  - considered current but still not surfaced through the real interaction path

### Implementation-Ready Shape

1. Add one focused real interaction regression around `Geometry/Extrude.Depth` or the closest stable equivalent that captures these moments:
   - drag start
   - active drag churn
   - waiting while still held
   - release
2. For each moment above, assert the real viewport-visible contract:
   - last committed geometry remains visible during waiting
   - yellow `previewMesh` is visible whenever current draft truth exists
   - green preview-ready and final follow-through still behave honestly
3. Record which lane is actually missing at the first bad moment:
   - current draft geometry result
   - accepted preview outputs
   - retained base
   - preview state / overlay state
4. If the regression exposes one new narrow owner, fix only that owner in this phase.
5. Do not broaden this pass into generic UI test cleanup or a new planning spike.

### Proof Targets

- in `Draft`, drag start, drag settle while still held, and release-adjacent state all keep visible draft geometry
- in `Auto`, drag start no longer drops to zero visible geometry before preview-ready or final follow-through arrives
- in `Auto`, `Waiting For Geometry` still keeps yellow `previewMesh` whenever current draft truth exists during the live drag lifecycle
- release policy and authoritative follow-through rules still behave correctly

### Must-Stay-True Constraints

- do not reopen `Phase 3c` retained-base persistence unless the real interaction proof disproves it
- do not remove the `Phase 3b` freshness gate just to make yellow preview appear
- do not fake yellow preview from stale artifact data
- keep status semantics honest: `Waiting For Geometry` may coexist with retained committed fallback and with yellow preview if current draft truth exists

### Suggested Verification

- preferred:
  - `npm.cmd exec -- vitest run src/app/store/useAppStore.test.ts -t "bug 18"`
  - `npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t "bug 18"`
- if the final implementation lands in a different focused seam, rerun that targeted file too and record the exact proof scope honestly

### Acceptance

- at least one end-to-end-ish regression covers the real extrude parameter path or the closest stable equivalent
- the regression fails on old bug behavior and passes with the fix
- the first bad moment in the real drag lifecycle is identified explicitly instead of inferred from synthetic state
- yellow `previewMesh` is either proven present when current draft truth exists or the new missing owner is fixed within this same bounded phase

### Stop Rule

Keep this phase proof-focused around the real drag lifecycle and the missing yellow-preview seam. If the new regression shows the remaining owner is outside the current viewport/runtime seam, stop and open that owner explicitly instead of stretching `Phase 4` into a mixed interaction refactor.

### Phase 4 Findings

- the remaining live seam was not a new `useAppStore` staging bug
- the waiting fallback draft lane could already reach `previewState` in selector state
- but `overlayResultClass`, `overlaySourceKind`, `overlayGeometryResult`, and `overlayRenderVm` were still being derived from the older raw overlay candidate instead of the active preview state
- that meant the viewer never received the yellow waiting overlay even though selector preview state had already resolved it

### What Phase 4 Changed

- `selectViewportResultState.ts`
  - added a live-`Auto` waiting fallback that uses committed draft geometry as `previewMesh` when:
    - interaction is active
    - current output still continues and still matches the committed draft part membership
    - fresh current draft has not landed yet
  - aligned the exported overlay fields with the active `previewState` instead of the raw pre-fallback overlay candidate so the viewer sees the same draft/final overlay the selector is actually presenting
- focused proof
  - `selectViewportResultState.test.ts`
  - `ViewerHost.test.tsx`

### What Phase 4 Proved

- in live `Auto` interaction, the viewport can keep:
  - retained committed final as the last-loaded base
  - committed draft geometry as the yellow waiting overlay
  while a newer draft result is still in flight
- the real viewer path now receives and renders that yellow waiting overlay instead of dropping to base-only
- this repair stayed inside the viewport/runtime seam and did not require reopening app-store build dispatch

### Phase 4 Verification

- Passed:
  - `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx`

### Phase 4 Result

`Phase 4` is complete.

The next owner is now `Phase 5 - Cleanup And Bug Closeout`.

## [x] Phase 5 - Cleanup And Bug Closeout

### Goal

Close bug 18 cleanly now that the selector, waiting-state, and real interaction proof are all stable.

### Why This Phase Is Separate

- closeout should not be mixed into the riskier behavior-changing passes
- this phase is for final wording cleanup, proof matrix confirmation, and honest closure

### Scope

- bug 18 doc
- any final targeted test rerun needed for the full matrix
- tracking docs and bug status updates
- no new runtime behavior changes unless the final matrix exposes a real regression that invalidates the current fixed-state claim

### Closeout Matrix

- `Draft`:
  - visible draft mesh during drag
  - visible draft mesh after motion stops while still held
  - no draft disappearance on release-adjacent settle
- `Auto`:
  - no zero-geometry drop at drag start
  - visible draft preview during churn or retained visible geometry when appropriate
  - retained committed geometry stays visible during `Waiting For Geometry`
  - yellow `previewMesh` stays visible during the waiting window whenever matching committed or current draft truth exists
  - preview-ready `B-rep` and final accepted geometry still transition normally

### Implementation-Ready Shape

1. Run the final targeted proof matrix for the bug-18 ownership seams:
   - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
   - `src/app/components/ViewerHost.test.tsx`
   - `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`
   - add one focused app-store file only if a bug-18-specific regression there is still part of the claimed final behavior
2. Update this bug doc to mark:
   - `Phase 5` complete
   - bug status from `[investigating]` to a fixed-state marker
   - an explicit final summary of what was repaired in `Auto` and `Draft`
3. Record the final closeout in:
   - `docs/CHANGELOG.md` only if this phase includes a final code adjustment
   - `docs/Doc-Log.md` for the bug-doc closeout wording
4. If the matrix stays green and no new owner appears, close bug 18 without opening another phase.

### Suggested Verification

- `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/components/ViewerHost.test.tsx src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`

### Acceptance

- bug 18 can state the user repro is fixed, not just improved in one mode
- the final proof matrix passes without reopening another owner seam
- the final bug summary explicitly mentions:
  - retained committed geometry persistence during waiting
  - yellow waiting preview in `Auto`
  - stable draft preview behavior in `Draft`

### Stop Rule

Keep this pass closeout-only. If the final matrix exposes another real owner, stop and open one narrow follow-on instead of stretching `Phase 5` into a mixed fix phase.

### Phase 5 Findings

- the final targeted proof matrix stayed green with no new owner seam exposed
- bug 18 no longer needs another runtime, selector, or viewer follow-on phase
- the repaired behavior is now stable enough to state the user repro is fixed rather than partially improved

### Final Shipped Behavior

- `Auto`
  - no zero-geometry drop at drag start
  - retained committed geometry stays visible during `Waiting For Geometry`
  - yellow `previewMesh` remains available during the waiting window when matching draft truth exists
  - preview-ready `B-rep` and final accepted geometry still transition normally
- `Draft`
  - visible draft mesh during drag
  - visible draft mesh after motion stops while still held
  - no release-adjacent disappearance back to an empty viewport

### Phase 5 Verification

- Passed:
  - `npm.cmd exec -- vitest run src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/components/ViewerHost.test.tsx src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`

### Phase 5 Result

`Phase 5` is complete.

Bug 18 is closed as fixed.


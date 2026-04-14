# Auto Draft Final Index

## Doc Header

### Doc History
34. 2026-04-14 09:45: Marked `Phase 9.4 - Verify And Stop` complete and closed `Phase 9` after rerunning the direct repeated-commit `Viewer.test.ts` regression plus the most relevant settled `ViewerHost` and selector proofs, confirming the transparent-shape stack is now closed as a viewer cleanup issue with no need to reopen selector, host, or interaction-lifecycle semantics for this symptom
33. 2026-04-14 09:41: Marked `Phase 9.3 - Clear Stale Baseline Meshes On Layer Replacement` complete after the narrow `Viewer.ts` cleanup patch gave baseline-layer meshes the same explicit lifecycle ownership as base and overlay meshes, so repeated render-layer replacement now removes stale `:baseline` meshes instead of stacking them, with the new direct `Viewer.test.ts` regression and surrounding settled `ViewerHost` proofs both green
32. 2026-04-14 09:36: Marked `Phase 9.2 - Add A Repeated-Commit Viewer Regression` complete after adding a direct `src/viewer/Viewer.test.ts` proof that instantiates the real `Viewer`, applies three successive baseline-only replacements for the same output key, and fails with three surviving `:baseline` meshes where only one should remain, locking the repeated-commit transparent-shape stack as an explicit viewer cleanup regression before any runtime patch
31. 2026-04-14 09:31: Marked `Phase 9.1 - Confirm The Accumulation Seam` complete after tracing the real `Viewer.ts` render-layer replacement path and locking the owner: `baselineParts` meshes are created in `setViewportRenderLayers(...)` but only base and overlay meshes are tracked in cleanup maps, so `clearPartMeshes()` never removes baseline meshes from the scene and repeated commits can stack stale transparent `last committed` shapes even though selector truth has already settled
30. 2026-04-14 09:27: Added `Phase 9 - Clear Viewer Baseline Mesh Accumulation` as the next narrow follow-up after live repro and screenshot review showed the real app can still stack multiple old transparent `last committed` shapes from one-extrude repeated commits, narrowing the next likely seam to viewer-side mesh replacement in `Viewer.ts` rather than more selector or interaction-lifecycle logic
29. 2026-04-14 08:58: Marked `Phase 8.5 - Auto Live Read-Through Proof And Verification` complete after extending the existing two-branch `Auto / Live` host transition proof to assert both the active branch-local comparison state and the settled winner-only state, adding the matching selector-input projection proof in `buildViewportResultSelectorOptions.test.ts`, and closing `Phase 8` as a proof-only family finish because the joined producer-to-selector-to-host handoff now stays green without any runtime patch
28. 2026-04-14 08:53: Prepped `Phase 8.5 - Auto Live Read-Through Proof And Verification` for implementation by tightening the final `Phase 8` handoff after the 8.3 typed-commit and 8.4 pointer-release producer proofs landed, explicitly naming the remaining risk as the producer-to-selector-to-host collapse path and grounding the next slice in one focused `Auto / Live` branch-local read-through plus the smallest selector-input projection proof needed if the settled interaction flags still fail to reach the viewport recipe cleanly
27. 2026-04-14 00:01: Marked `Phase 7.4 - Host Read-Through Proof For Post-Commit Cleanup` complete after adding one focused `ViewerHost` transition proof that starts from the same two-branch live branch-local comparison shape, then flips only the interaction state to settled while intentionally leaving the graph-scoped browser interaction flag behind, locking that the viewer now receives the settled draft winner as a plain `lastLoaded` base layer with no `baselineParts` and no overlay instead of continuing to render the old comparison baseline
26. 2026-04-13 23:58: Marked `Phase 7.3 - Selector Proof For Post-Commit Cleanup` complete after adding one focused selector proof that holds the same two-branch graph shape, committed interaction baseline inputs, and rebuilt-only changed branch from the live branch-local interaction case, then flips only the interaction state to settled and locks the intended cleanup: the old comparison baseline disappears, the recipe returns to `base-only`, and the changed winner remains visible as settled `lastLoaded` draft truth
25. 2026-04-13 23:54: Marked `Phase 7.2 - Clear The Old Baseline At Settle` complete after tightening the viewport-facing interaction contract so selector-owned comparison layering now requires both graph-scoped browser interaction and active UI interaction, with `buildViewportResultSelectorOptions.ts`, `ViewerHost.tsx`, and `ViewportOverlay.tsx` all updated to stop treating lingering scheduler interaction as active viewport comparison time while a new selector-options unit proof locks that settled UI interaction must already clear the old baseline path
24. 2026-04-13 23:39: Marked `Phase 7.1 - Find The Settled Baseline Leak` complete after tracing the lingering old-baseline path through selector, app interaction flags, and `ViewerHost`, then locking the seam attribution: the primary issue appears to be interaction lifecycle still feeding `isInteractionActive` after settle, with `committedInteractionBaselineRef` as the secondary bridge that preserves the old baseline snapshot until interaction really clears, so `Phase 7.2` can now target that ownership path directly
23. 2026-04-13 23:36: Prepped `Phase 7.1` through `Phase 7.5` for implementation inside the new post-commit comparison-baseline follow-up doc by turning each sub-phase into a concrete seam-owned slice with current live read, file targets, implementation target, proof bar, and stop rule, so the family now has one implementation-ready ladder for clearing the old changed-part baseline after settle without reopening the disconnect work
22. 2026-04-13 23:34: Added `Phase 7 - Clear Old Comparison Baseline After Commit` as the next narrow follow-up after the disconnect slice closed, explicitly capturing the next remaining viewport issue: once the user releases, commits, or explicitly builds, the old changed-part comparison baseline should disappear while the new winner and unchanged geometry stay visible, so the family now has one dedicated planning home for that cleanup
21. 2026-04-13 23:30: Marked `Phase 6 - Clear Selector-Visible Geometry On Output Disconnect` complete after the selector guard, selector disconnect proof, host empty-layer read-through proof, and final targeted verification all landed cleanly, closing the stale-visible-result disconnect bug as a narrow selector-first fix while explicitly stopping before widening into the separate post-commit comparison-baseline cleanup question
20. 2026-04-13 23:29: Marked `Phase 6.3 - Host Empty-Layer Read-Through Proof` complete after adding one focused `ViewerHost` proof for the disconnect bug where accepted final geometry still exists in runtime but the selector-cleared disconnect state now reaches the viewer as empty `base`, `baseline`, and `overlay` layers, with both targeted host plus selector vitest suites still green and `Phase 6.4` left as the final verification-and-stop checkpoint
19. 2026-04-13 23:27: Marked `Phase 6.2 - Selector Proof For Disconnected Output` complete after adding one explicit selector proof for the disconnect bug where accepted final geometry still exists in runtime inputs but must not remain visible once `Output Preview` loses all continuation, with both targeted selector plus host vitest suites still green and `Phase 6.3` now clearly isolated as the host empty-layer read-through proof
18. 2026-04-13 23:25: Marked `Phase 6.1 - Selector Disconnect Guard` complete after tightening selector-visible accepted and preview-ready geometry visibility to obey current output continuation when `previewPreparation` exists, narrowing the fix specifically to the disconnect seam after preserving explicit member-publication final behavior, and keeping both targeted selector plus host vitest suites green so `Phase 6.2` can now add the first dedicated disconnect proof
17. 2026-04-13 23:10: Prepped `Phase 6.1` through `Phase 6.4` for implementation inside the new disconnect follow-up doc by turning each sub-phase into a concrete selector-first slice with exact seam read, file targets, proof bar, and stop rule, so the family now has one implementation-ready ladder for closing the stale-visible-result disconnect bug without reopening broader baseline or runtime cleanup
16. 2026-04-13 23:07: Added `Phase 6 - Clear Selector-Visible Geometry On Output Disconnect` as a narrow post-Phase-5 follow-up after live research on the disconnect bug showed the most likely remaining seam is selector-visible stale-result truth, not viewer-layer assembly: retained fallback geometry already clears on dependency break, but accepted authoritative visibility still appears able to survive after `Output Preview` loses all continuation, so the family now has one explicit home for fixing that contract before any separate baseline-wipe cleanup
15. 2026-04-13 22:58: Marked `Phase 5 - Full Nine-State Proof Matrix And Residue Removal` complete after the family gained one explicit nine-state selector matrix, one matching host-side layer-mapping matrix, the matrix expectations were aligned to the real settled retained-base contracts across `auto`, `draft`, and `final`, both targeted vitest suites stayed green, and residue cleanup was intentionally kept conservative so the older high-signal branch-local proofs remain as edge-case coverage
14. 2026-04-13 22:46: Prepped `Phase 5 - Full Nine-State Proof Matrix And Residue Removal` in a dedicated implementation doc, grounding the final slice in the post-Phase-4 state where the architecture seams are largely in place but the proof surface is still clustered around a few high-value corners instead of one explicit nine-state matrix, so the family now has one implementation-ready home for final proof hardening and residue cleanup
13. 2026-04-13 22:43: Marked `Phase 4 - Simplify ViewerHost To Render The Recipe` complete after the remaining host adaptation work was collapsed into small presentational helpers, the leftover branch-local assembly helper was removed, `ViewerHost.tsx` now routes selector-owned recipe rendering through one viewer-layer adapter, and both targeted host plus selector vitest suites stayed green
12. 2026-04-13 22:39: Prepped `Phase 4 - Simplify ViewerHost To Render The Recipe` in a dedicated implementation doc, grounding the next slice in the post-Phase-3 live seam where `ViewerHost.tsx` no longer owns recipe meaning or committed-baseline source truth but still owns interaction-time preview fallback acquisition, the small committed-baseline bridge lifecycle, presentation-style resolution, and the last recipe-to-viewer adaptation path
11. 2026-04-13 22:36: Marked `Phase 3 - Explicit Committed Baseline Ownership` complete after the old frozen render-history selector inputs were replaced with explicit committed-baseline inputs, `ViewerHost.tsx` was changed to snapshot retained committed-source parts instead of `viewportRenderLayers.baseParts`, the selector kept the same Phase 2 recipe surface while consuming committed baseline truth directly, and both targeted selector plus host vitest suites stayed green
10. 2026-04-13 22:28: Prepped `Phase 3 - Explicit Committed Baseline Ownership` in a dedicated implementation doc, grounding the next slice in the live post-Phase-2.1 seam where `ViewerHost.tsx` still freezes idle rendered layers into `frozenInteractionBaseRef` and threads that bridge into `selectViewportResultState.ts`, so the family now has one explicit implementation-ready plan for replacing host-history baseline capture with committed-source ownership
9. 2026-04-13 22:24: Recorded the narrow `Phase 2.1` follow-up after the Phase 2 review, closing the remaining recipe leaks by requiring selector-visible overlay truth before branch-local layering can win, letting branch-local recipes carry `previewMesh` or `previewBrep` styling honestly, making `layerRecipe.kind` truthful when overlays are absent, and tightening the frozen-base compatibility bridge without widening into Phase 3 baseline ownership
8. 2026-04-13 22:09: Marked the initial `Phase 2 - Selector-Owned Viewport Layer Recipe` landing complete after the selector-owned `layerRecipe` contract landed, the interaction-preview and frozen-base compatibility inputs were threaded through the selector options, `ViewerHost.tsx` was reduced to recipe consumption, and both selector plus host targeted vitest suites passed with the new branch-local and settled recipe assertions in place
7. 2026-04-13 22:00: Prepped `Phase 2 - Selector-Owned Viewport Layer Recipe` in a dedicated implementation doc, grounding the next slice in the exact remaining seam from `Phase 0`: the selector already decides visible-result truth, but `ViewerHost.tsx` still decides `base` / `baseline` / `overlay`, so Phase 2 now has one concrete recipe-ownership target with explicit file seams, proof graph, implementation order, and stop rule
6. 2026-04-13 21:52: Marked `Phase 1 - Freeze The Shared Mode Matrix` complete after the selector-side `previewBrep` restriction landed, the stale churn-era selector expectations were aligned to the settled `lastLoaded` contract, the release/manual no-green proofs were added, and both selector plus `ViewerHost` tests passed so the family can now treat the matrix as frozen going into the selector-owned recipe phase
5. 2026-04-13 21:51: Prepped `Phase 1 - Freeze The Shared Mode Matrix` for implementation in a dedicated phase doc, grounding the first actual AutoDraftFinal code slice in the live selector seams, the stale churn-era selector tests, and the current `previewBrep` leakage after release/manual so Phase 1 now has one implementation-ready home instead of only the umbrella bullets in this index
4. 2026-04-13 21:43: Revised the future phase ladder after the final `Phase 0` code audit, shifting the family away from separate `Live`, `On Release`, and `Manual` implementation passes and toward the seam the research actually found: freeze the matrix, move full layer-recipe ownership into the selector, give committed baseline ownership its own phase, then simplify `ViewerHost` and harden the full nine-state proof matrix
3. 2026-04-13 21:38: Closed `Phase 0` with one code-backed research package, locking the seam ownership map, the nine-state current-behavior matrix, the preview-data contract audit, the Bug 19 closure read, and the current test/proof-gap inventory so `Phase 1` can freeze a shared contract without more exploratory selector or host reading
2. 2026-04-13 21:34: Added `Phase 0 - Current Seam Audit And Vision Gap Map`, explicitly making `Bug 19` and the current viewport seam inventory part of the family plan so implementation starts with one research-grade current-versus-target map instead of another direct behavior patch
1. 2026-04-13 21:28: Created this implementation umbrella for the `AutoDraftFinal` worker/viewer family so the newly locked visual vision now has one explicit phase ladder for turning the `Auto / Draft / Final` plus `Live / On Release / Manual` contract into code across selector ownership, viewport layering, timing triggers, and proof coverage

### Purpose

This doc defines the implementation path for the `AutoDraftFinal` family.

Use it to answer:
- what code seams need to change to achieve the `AutoDraftFinal-Vision`
- what should be implemented first versus later
- which parts belong in selectors, runtime state, or the viewer host
- how to sequence the work so we stop breaking one corner while fixing another

### Relationship To Other Docs

- `AutoDraftFinal-Vision.md`
  - the user-visible target behavior
- `../Future/Worker_Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview.md`
  - existing retained-base and preview-overlay implementation history
- `../Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
  - older viewport contract framing that this family should now simplify and replace where needed
- `../../../Bugs/19_2026-04-13_20-00-17_worker-11-viewport-presentation-contract-gap.md`
  - current live bug surface proving the old seam is still too brittle

### Why This Doc Exists

The vision is now simpler than the current implementation.

The user-visible rule can be explained in a few clear sentences:
- unchanged geometry stays stable
- changed geometry keeps its last committed baseline
- preview appears only where and when it should
- the winning visible result depends on mode and timing policy

The current code does not yet read that simply.

Today the behavior is still spread across:
- graph runtime accepted and committed result state
- `selectViewportResultState.ts`
- shared selector-input preparation
- `ViewerHost.tsx`
- viewer layer assembly
- mode and policy timing flags
- bug-fix gates and fallbacks added over time

This doc exists to turn the vision into a cleaner implementation ladder instead of continuing to patch the seam ad hoc.

### Scope

This doc covers:
- viewport result presentation for `Auto / Draft / Final`
- timing-policy behavior for `Live / On Release / Manual`
- selector-owned visible-layer recipes
- host/viewer simplification
- branch-local changed-versus-unchanged geometry behavior

This doc does not cover:
- worker invalidation precision beyond the minimum needed to identify changed-versus-unchanged geometry honestly
- full worker scheduling redesign outside the visible-mode contract
- export behavior
- broad viewer rendering architecture unrelated to result layering

## Doc Body

### Short Version

The implementation goal is:
- one visual system
- one place that decides what layers should be visible
- one smaller host path that renders those layers
- explicit timing rules for `live`, `on release`, and `manual`

The main cleanup direction should be:
- selectors decide the visible recipe
- runtime owns accepted and committed truth
- the viewer host renders the recipe
- the host should stop re-deciding product behavior through gates and fallback tangles

### Current Problem Read

The current seam is fragile because several concerns are mixed together:
- what geometry is changed versus unchanged
- what result classes currently exist
- which result class should win for the current mode
- whether preview should start now, on release, or on explicit build
- how many layers the viewer should render

That makes small fixes dangerous.

The likely root issue is not that the vision is complicated.

The likely root issue is that the code path is not yet shaped like the vision.

### Locked Implementation Direction

#### 1. The visible contract should be selector-owned

The selector layer should decide:
- what the current visible base is
- whether a retained changed-part baseline exists
- whether draft preview should be visible
- whether B-rep preview should be visible
- which result wins after release or explicit build

`ViewerHost.tsx` should mainly render the recipe it is given.

#### 2. The host should stop inventing a second product story

The host may still:
- cache frozen interaction state if truly needed
- assemble viewer layers from selector-owned inputs

But it should not remain the place where the product meaning of:
- `auto`
- `draft`
- `final`
- `live`
- `on release`
- `manual`

is reinterpreted through branching fallback logic.

#### 3. Timing and styling should be separate

The implementation should distinguish:
- timing policy
  - when preview or final starts
- visible layer recipe
  - what the user sees once those results exist

This should let the same visual system work across:
- `Live`
- `On Release`
- `Manual`

without duplicating the whole rendering contract for each one.

#### 4. Branch-local scope should remain explicit

The system must keep one explicit distinction between:
- changed geometry
- unchanged geometry

This distinction should drive:
- retained baseline styling
- draft preview membership
- B-rep preview membership
- settled winner promotion

#### 5. On-release and manual modes should stay calmer than live

`Live` modes may show progressive preview while editing.

`On Release` and `Manual` modes should not churn preview during drag.

That calmer rule should be explicit in selector/runtime policy, not left as accidental host behavior.

## [ ] Auto Draft Final - Visual Mode And Timing System

### Header

Purpose:
- implement the `AutoDraftFinal-Vision` as one unified visible-result system across mode and timing combinations

Owns:
- viewport result recipe definition
- timing-policy-to-visibility mapping
- branch-local retained baseline behavior
- draft and B-rep preview visibility rules
- post-release and post-build winner rules

Does not own:
- broad worker generation redesign
- export UX
- unrelated viewer engine cleanup

### Phase Ladder

## [x] Phase 0 - Current Seam Audit And Vision Gap Map

Goal:
- map the current viewport/result seam against the new `AutoDraftFinal-Vision` before more implementation starts

This phase should answer:
- where the current code already matches the vision
- where the current code partially matches it
- where the current code directly contradicts it
- which gates, fallbacks, and host-side branches are still necessary
- which gates, fallbacks, and host-side branches are likely legacy seam residue

Primary inputs:
- `AutoDraftFinal-Vision.md`
- `../../../Bugs/19_2026-04-13_20-00-17_worker-11-viewport-presentation-contract-gap.md`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/buildViewportResultSelectorOptions.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

Expected output:
- one current-versus-target matrix for:
  - `Auto / Live`
  - `Auto / On Release`
  - `Auto / Manual`
  - `Draft / Live`
  - `Draft / On Release`
  - `Draft / Manual`
  - `Final / Live`
  - `Final / On Release`
  - `Final / Manual`
- one seam map saying where each current decision is made
- one first-pass classification of:
  - selector-owned truth
  - host-owned fallback logic
  - viewer-only rendering logic
  - likely removable legacy residue

Important rule:
- this phase is research, not patching
- do not mix the audit with behavior edits unless a tiny instrumentation aid is truly required

Why this phase exists:
- the current seam is already fragile
- Bug 19 proves we do not yet have a stable current read
- starting with a direct implementation pass would likely keep breaking corners instead of reducing the seam

Done when:
- the family has one explicit current-state map
- later implementation phases can point at exact mismatches instead of broad symptoms
- we can say which branches in `ViewerHost.tsx` are:
  - still required
  - wrongly shaped
  - likely removable after the selector-owned recipe lands

### Phase 0 Research Package - 2026-04-13

#### Ownership Map

- `buildViewportResultSelectorOptions.ts`
  - owns projection of app/runtime policy into selector inputs
  - translates graph browser policy into `browserExecutionPolicy`
  - passes interaction flags, delayed-placeholder flags, accepted and committed result lanes, and preview-preparation inputs into the selector
  - current classification: selector-input owner

- `selectViewportResultState.ts`
  - already owns most product truth
  - decides result-class priority between committed final, preview-ready authoritative, accepted draft, and no-geometry fallbacks
  - decides mode preference for `auto`, `draft`, and `final`
  - decides policy timing suppression for `live` versus `release` versus `manual`
  - decides `lastLoaded`, `previewMesh`, and `previewBrep` presentation-state ids
  - decides retained-base and overlay candidates
  - current classification: primary selector-owned truth that should survive

- `selectPreviewRenderVm.ts`
  - owns output-entry membership derivation from `previewPreparation`
  - is the only seam that honestly knows `allAccepted` versus `rebuiltOnly`
  - current classification: preview-membership owner that should survive

- `ViewerHost.tsx`
  - should only assemble and render layers, but currently still re-decides product behavior
  - owns interaction-time raw-runtime preview fallback, branch-local gate, frozen interaction-base capture, and several mode-specific retained/overlay fallback branches
  - current classification:
    - raw-runtime accepted-preview fallback: intentional temporary bridge
    - branch-local gate and per-mode fallback ladder: legacy residue
    - mode-blind branch-local overlay path: direct architectural contradiction because it can consume rebuilt-only draft overlay independently of selector mode

- `Viewer.ts`
  - owns rendering only
  - applies `base`, `baseline`, and `overlay` parts, styles, opacity, and render order
  - current classification: viewer-only rendering logic that should remain presentational

#### Bug 19 Closure Read

- `Phase A` and `Phase B` are now enough to say the remaining `Bug 19` risk is mostly `layer assembly`, not mostly source availability
- the decisive reason is that `selectViewportResultState.ts` already classifies timing, visible state, and overlay state, but `ViewerHost.tsx` still picks between:
  - branch-local retained-baseline layers
  - retained-final plus overlay
  - retained-final alone
  - retained-draft plus overlay
  - retained-draft alone
  - visible-base only
- `frozenInteractionBaseRef` is still a real integrity risk, but it is secondary
  - it freezes `viewportRenderLayers.baseParts` and `currentAcceptedOutputPreviewRenderVm.viewerParts` only when interaction is inactive
  - that means it captures the last rendered base, not an explicit committed-source contract
  - this becomes risky when the last idle scene was already a settled draft bridge or another non-final visible base
- locked Phase 0 attribution:
  - primary seam: `Phase C - layer assembly read-through`
  - secondary seam: `Phase D - frozen interaction-base integrity`

#### Nine-State Current-Behavior Matrix

| Combination | Idle | Interaction Active | Post Release Or Post Build | Current Read |
| --- | --- | --- | --- | --- |
| `Auto / Live` | selector prefers final when renderable; otherwise settled accepted draft is relabeled as `lastLoaded` | selector can expose `previewMesh` or `previewBrep`; branch-local rendering is possible but only through a host gate plus rebuilt-only overlay plus frozen base | settled draft collapses back to `lastLoaded`; preview-ready authoritative can still win as `previewBrep` | partial match |
| `Auto / On Release` | same idle behavior as `Auto / Live` | selector suppresses preview during drag and returns retained base only if a retained candidate exists | accepted draft can appear as `lastLoaded`, but preview-ready authoritative still surfaces as `previewBrep` after release | contradicts vision after release because green-stage behavior still exists |
| `Auto / Manual` | same idle behavior as `Auto / Live` | no preview appears until explicit build produces newer result lanes | once build results exist, behavior mirrors the release path and can still surface `previewBrep` | partial timing match, post-build green-stage mismatch |
| `Draft / Live` | accepted draft settles as `lastLoaded` base | selector exposes `previewMesh`; branch-local layering is possible only through host residue, otherwise host uses retained-draft plus overlay | accepted draft settles back to `lastLoaded` base | partial match |
| `Draft / On Release` | accepted draft settles as `lastLoaded` base | release suppression keeps retained base only when a retained draft candidate exists | settled draft returns as `lastLoaded`; no green stage exists in selector for draft mode | mostly matches, but active suppression still depends on retained-base availability |
| `Draft / Manual` | accepted draft settles as `lastLoaded` base | same visible behavior as release while no explicit build has run | after explicit build, settled draft returns as `lastLoaded` | mostly matches, but explicit-build proof is still indirect |
| `Final / Live` | accepted final settles as final base | selector blocks draft preview, but host branch-local logic is mode-blind and can still consume rebuilt-only draft overlay if available; preview-ready final becomes `previewBrep` | final base or preview-ready final comparison state | direct contradiction in host branch-local path, otherwise partial |
| `Final / On Release` | accepted final settles as final base | release suppression keeps retained final only during drag | preview-ready authoritative can still surface as `previewBrep` after release before final acceptance | contradicts vision because on-release should skip green-stage comparison |
| `Final / Manual` | accepted final settles as final base | same visible behavior as release until explicit build starts producing newer lanes | once newer authoritative preview exists, current code can still surface `previewBrep` | contradicts vision because manual should mirror on-release without green stage |

#### Preview Data Contract Audit

- `acceptedPreviewGraphRevision`
  - current guarantee:
    - selector-visible accepted preview bundle and outputs are hidden unless their revision matches `compileBuild.currentGraphRevision`
  - current dependency:
    - `selectViewerTargetGraphAcceptedPreviewBuildBundle` and `selectViewerTargetGraphAcceptedPreviewBuildOutputs` freshness-gate the selector-visible lane
  - Phase 0 read:
    - safe as a freshness contract for selector truth
    - not sufficient by itself for interaction-time branch-local layering

- raw runtime `acceptedPreviewBuildBundle` and `acceptedPreviewBuildOutputs`
  - current guarantee:
    - expose the latest accepted preview state on the runtime even before the freshness-gated selector lane catches up
  - current dependency:
    - `ViewerHost.tsx` now uses them only during active interaction as a fallback source
  - Phase 0 read:
    - useful as a temporary bridge
    - should not remain a permanent parallel product lane in `ViewerHost`

- `allAccepted` versus `rebuiltOnly` preview render VMs
  - current guarantee:
    - `allAccepted` preserves full accepted preview truth
    - `rebuiltOnly` isolates the changed subset
  - current dependency:
    - `currentAcceptedOutputPreviewRenderVm` provides branch-stable truth
    - `currentAcceptedRebuiltPreviewRenderVm` drives branch-local overlay membership
  - Phase 0 read:
    - this split is sound and should survive
    - the later cleanup should move ownership of when each lane is used out of `ViewerHost`

- `suppressVisiblePreviewDuringRelease`
  - current guarantee:
    - while drag is active in `release`, the selector hides preview states
  - current dependency:
    - `selectViewportResultState.ts` returns retained base or empty visible geometry during drag
  - Phase 0 read:
    - the suppression rule itself matches the calmer `on release` family
    - the current implementation is too coarse because it can return empty visible geometry when no retained base candidate exists
    - Phase 1 should preserve the calm timing rule but freeze a stronger visible-base fallback contract

#### Residue List

- selector-owned truth that should survive
  - mode behavior and result priority in `selectViewportResultState.ts`
  - `lastLoaded`, `previewMesh`, and `previewBrep` state ids
  - rebuilt-only versus full accepted preview membership in `selectPreviewRenderVm.ts`

- host-side fallback logic that should be removed or collapsed later
  - mode-specific fallback ladder inside `viewportRenderLayers`
  - mode-blind branch-local overlay selection
  - reliance on raw runtime accepted preview state as a permanent second source of truth

- viewer-only rendering logic that should remain purely presentational
  - `ViewerViewportRenderLayers`
  - render-order separation between base, baseline, and overlay
  - material/style application

#### Current Test Read

- proved and passing today
  - `selectPreviewRenderVm.test.ts`
    - rebuilt-only overlay narrowing and accepted-preview membership rules are stable
  - `ViewerHost.test.tsx`
    - branch-local helper split works
    - interaction-time raw-runtime accepted-preview fallback works
    - retained final, settled draft, preview-ready overlay, and manual-final host branches are all currently exercised

- already failing today
  - `selectViewportResultState.test.ts`
    - `exposes retained final base eligibility in auto mode during parameter churn without promoting it as current final`
    - `uses retained draft mesh preview as the strict draft base during parameter churn`
  - Phase 0 read:
    - the selector suite is already carrying stale expectations from the older churn contract
    - this is another sign that the matrix needs to be frozen before more implementation work lands

- still missing as explicit proof
  - one full nine-state matrix suite covering idle, active, and post-release or post-build behavior
  - explicit `manual` proof that no visual change occurs before `Build`
  - explicit `on release` proof that green-stage `previewBrep` does not appear in `Auto / On Release` or `Final / On Release`
  - explicit `final / live` proof that host branch-local fallback never leaks draft-visible overlay

#### Phase 1 Handoff

- freeze one shared matrix from `AutoDraftFinal-Vision.md` using the nine-state read above
- treat `selectViewportResultState.ts` as the owner of:
  - result priority
  - mode preference
  - timing suppression
  - preview-state classification
- treat `ViewerHost.tsx` as needing reduction, not more feature logic
- preserve `selectPreviewRenderVm.ts` membership logic, but move the choice of which preview lane is active into selector-owned recipe assembly
- enter `Phase 1` assuming:
  - `Bug 19` is now narrowed enough to stop exploratory seam chasing
  - the next architectural move is contract freezing, not another one-off host patch

## [x] Phase 1 - Freeze The Shared Mode Matrix

Goal:
- translate the prose in `AutoDraftFinal-Vision.md` into one explicit implementation matrix the code can depend on

Dedicated implementation doc:
- `AutoDraftFinal_Phase 1 - Freeze The Shared Mode Matrix.md`

This phase should answer:
- which visible layers exist:
  - committed base
  - changed-part retained baseline
  - draft preview
  - B-rep preview
- which timing families exist:
  - `live`
  - `on release`
  - `manual`
- which winning result each mode wants after release/build:
  - `auto`
  - `draft`
  - `final`

Expected output:
- one locked nine-state behavior matrix covering:
  - `Auto / Live`
  - `Auto / On Release`
  - `Auto / Manual`
  - `Draft / Live`
  - `Draft / On Release`
  - `Draft / Manual`
  - `Final / Live`
  - `Final / On Release`
  - `Final / Manual`
- one stable vocabulary for:
  - base
  - baseline
  - overlay
  - preview winner
  - final winner
- one explicit rule that `previewBrep` is `live`-only and must not appear in `on release` or `manual`
- one selector-facing set of expected outcomes for:
  - idle
  - interaction active
  - post-release or post-build promotion
- one cleanup pass on stale selector expectations that still assert the older churn contract

Important rule:
- do not start with more patches
- first freeze the matrix the code is supposed to implement

Done when:
- every mode and timing combination has one explicit winner rule
- `selectViewportResultState.test.ts` expectations match the frozen matrix instead of older behavior
- later phases can build one selector-owned layer recipe without re-deciding product behavior

## [x] Phase 2 - Create One Selector-Owned Layer Recipe Contract

Goal:
- make the selector own the actual visible layer recipe instead of only intermediate result classifications

Dedicated implementation doc:
- `AutoDraftFinal_Phase 2 - Selector-Owned Viewport Layer Recipe.md`

This phase should answer:
- base layer parts
- baseline layer parts
- overlay layer parts
- presentation state for each layer
- why a layer exists or is absent
- what counts as changed versus unchanged membership
- which style token each layer should use:
  - `lastLoaded`
  - `previewMesh`
  - `previewBrep`

Likely file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/buildViewportResultSelectorOptions.ts`
- possibly one new selector-owned layer-recipe helper

Important rule:
- the contract should describe the user-visible result directly
- do not make `ViewerHost.tsx` infer missing product meaning from raw fields
- preserve `selectPreviewRenderVm.ts` as the owner of preview membership derivation

Done when:
- the selector hands the host one recipe instead of a bag of partially interpreted state
- `ViewerHost.tsx` no longer has to choose which product story wins between retained base, draft overlay, and preview-ready final

Follow-up read:
- `Phase 2.1` is now also closed inside this phase
- it specifically fixed:
  - mode-blind branch-local leakage
  - branch-local `previewBrep` styling gaps
  - misleading `layerRecipe.kind` values when no overlay exists
- `Phase 3` remains the first phase that is allowed to redesign committed-baseline ownership

## [x] Phase 3 - Explicit Committed Baseline Ownership

Goal:
- replace implicit frozen-host baseline capture with one explicit committed-baseline contract

Dedicated implementation doc:
- `AutoDraftFinal_Phase 3 - Explicit Committed Baseline Ownership.md`

This phase should answer:
- what the retained changed-part baseline is actually sourced from
- what the unchanged stable base is actually sourced from
- when the interaction baseline is captured
- when it is invalidated or refreshed

Likely file targets:
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- any adjacent runtime or selector helper that becomes the baseline owner

Important rule:
- the system must stop depending on "last rendered base equals correct committed baseline"
- this phase is about baseline ownership, not adding another smarter host cache

Done when:
- branch-local layering can be rebuilt from explicit truth instead of host history
- `frozenInteractionBaseRef` is removed or reduced to a minimal rendering aid instead of product logic

Landed result:
- selector inputs now use explicit committed-baseline names instead of frozen render-history names
- `ViewerHost.tsx` now snapshots retained committed-source parts and presentation state, not the last rendered base layer stack
- the Phase 2 recipe surface stayed stable while branch-local layering moved onto committed baseline truth

## [x] Phase 4 - Simplify `ViewerHost` To Render The Recipe

Goal:
- reduce `ViewerHost.tsx` from product-semantics owner to layer renderer

Dedicated implementation doc:
- `AutoDraftFinal_Phase 4 - Simplify ViewerHost To Render The Recipe.md`

This phase should make true:
- `ViewerHost.tsx` mostly consumes:
  - base parts
  - baseline parts
  - overlay parts
  - stable presentation states
- the host no longer has to interpret most of the mode matrix itself
- existing fragile gates become smaller, more local, or removable

Likely file targets:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- any adjacent host tests

Important rule:
- remove decision fan-out only after the selector-owned recipe is strong enough
- do not delete guardrails before their owning logic is replaced

Done when:
- `ViewerHost.tsx` is no longer a second product-policy engine
- host logic is visibly smaller and easier to reason about than the current seam

Landed result:
- the remaining viewport-result path in `ViewerHost.tsx` is now concentrated in small presentational helpers
- the older exported branch-local assembly helper is gone
- host tests now prove presentational recipe-to-viewer mapping instead of older host-owned branch-local assembly behavior

## [x] Phase 5 - Full Nine-State Proof Matrix And Residue Removal

Goal:
- prove the whole mode/policy system works without reopening the seam every patch, and remove leftover residue from the older Worker 10/11 seam

Dedicated implementation doc:
- `AutoDraftFinal_Phase 5 - Full Nine-State Proof Matrix And Residue Removal.md`

The proof matrix should cover at least:
- `Auto / Live`
- `Auto / On Release`
- `Auto / Manual`
- `Draft / Live`
- `Draft / On Release`
- `Draft / Manual`
- `Final / Live`
- `Final / On Release`
- `Final / Manual`

And for each:
- idle
- active drag
- release without trigger where applicable
- explicit build where applicable
- draft-visible waiting state
- final/B-rep-ready promotion where applicable
- unchanged sibling stability

Likely proof surfaces:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- any shared selector/helper tests needed for the recipe contract

Important rule:
- prove all nine combinations together instead of implementing them as three separate timing-family mini-systems
- delete leftover residue only after the proof matrix covers the replacement contract

Landed result:
- the family now has one explicit selector matrix and one matching host-side layer-mapping matrix covering all nine mode and timing combinations
- the matrix now locks the real settled retained-base distinctions for `auto`, `draft`, and `final` instead of relying on looser historical corner names
- no runtime cleanup was needed in this phase; the remaining non-matrix tests were kept where they still add branch-local and preview-readiness signal

## [x] Phase 6 - Clear Selector-Visible Geometry On Output Disconnect

Goal:
- make a disconnected `Output Preview` show no geometry by fixing selector-visible stale-result truth first

Dedicated implementation doc:
- `AutoDraftFinal_Phase 6 - Clear Selector-Visible Geometry On Output Disconnect.md`

This phase should make true:
- if `Output Preview` has no valid continuation:
  - accepted final does not stay visible
  - accepted draft does not stay visible
  - preview-ready authoritative does not stay visible
  - retained base is cleared
  - overlay is cleared
  - the viewer receives empty layers

Likely file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

Important rule:
- fix visible-result truth before fixing old committed comparison-baseline cleanup
- baseline wipe alone will not solve the disconnect bug if the selector still thinks stale accepted geometry is the visible winner

Done when:
- disconnecting all `Output Preview` wires produces no visible geometry in selector and host proofs
- the family can separate this bug cleanly from the later question of when to wipe the old changed-part comparison baseline after commit

Landed result:
- disconnected `Output Preview` now clears selector-visible stale accepted geometry instead of letting old renderable geometry linger
- the selector suite now has a dedicated disconnect proof
- the host suite now has a matching empty-layer read-through proof
- the slice stopped cleanly without widening into post-commit comparison-baseline cleanup

## [ ] Phase 7 - Clear Old Comparison Baseline After Commit

Goal:
- make the old changed-part comparison baseline disappear once the user releases, commits, or explicitly builds

Dedicated implementation doc:
- `AutoDraftFinal_Phase 7 - Clear Old Comparison Baseline After Commit.md`

This phase should make true:
- active comparison may still show old versus new
- settled post-commit state no longer shows the old changed-part baseline
- the new winning changed geometry remains visible
- unchanged geometry remains stable

Likely file targets:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

Important rule:
- clear only the old changed-part comparison baseline
- do not clear the new winner and do not disturb unchanged geometry

Done when:
- settled post-commit states no longer include the old changed-part comparison baseline
- selector and host proofs both lock that cleanup

## [x] Phase 8 - End Comparison On Explicit Commit

Goal:
- make explicit commit terminate viewport comparison immediately enough that `Auto / Live` no longer keeps the old changed-part `50%` blue baseline visible after commit

Dedicated implementation doc:
- `AutoDraftFinal_Phase 8 - End Comparison On Explicit Commit.md`

This phase should make true:
- explicit commit ends comparison for:
  - typed numeric commit
  - pointer release
  - arrow-step click
  - explicit `Build`
- raw typing alone does not end comparison
- after explicit commit, the old blue baseline disappears and the new winner remains visible

Likely file targets:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- related control, store, selector, and host proof files

Important rule:
- this phase is about lifecycle producers, not selector result meaning
- do not reopen the selector contract unless a proof shows the settled recipe itself is still wrong

Done when:
- explicit commit no longer leaves `Auto / Live` in comparison state
- one viewport-facing read-through proves the old baseline disappears and the winner remains visible

Landed read so far:
- `Phase 8.1` is now complete
- explicit `Build` already has a dedicated target-graph settle seam in `useAppStore.ts`
- `Phase 8.3` is now complete
- feature-stack typed numeric commit now clears both interaction channels on explicit typed settle instead of waiting for `blur`
- `Phase 8.4` is now complete
- canvas primitive pointer release now has both control-level and `NodeView` read-through proof coverage showing release clears both interaction channels without a runtime patch
- the remaining family risk is now the joined viewport handoff:
  - do the already-proved explicit-settle producer edges actually collapse the real `Auto / Live` branch-local comparison recipe and viewer layers for the same graph the user sees

Landed result:
- `Phase 8.5` is now complete
- the family now has the missing joined handoff proof:
  - `buildViewportResultSelectorOptions.test.ts` proves the settled app-store projection no longer keeps `isInteractionActive` alive once UI interaction ends
  - `ViewerHost.test.tsx` proves the same two-branch `Auto / Live` graph renders branch-local comparison while active, then collapses to winner-only `lastLoaded` base after settle
- no runtime patch was needed in this final slice
- `Phase 8` now closes as a proof-only finish because explicit typed commit, pointer release, explicit build settle, selector collapse, and host render handoff are all locked together

## [x] Phase 9 - Clear Viewer Baseline Mesh Accumulation

Goal:
- remove the real-app repeated-commit bug where a one-object graph can keep stacking old transparent `last committed` shapes in the viewport after repeated explicit commits

Dedicated implementation doc:
- `AutoDraftFinal_Phase 9 - Clear Viewer Baseline Mesh Accumulation.md`

This phase should make true:
- repeated explicit commits replace old viewer baseline meshes instead of accumulating them
- one-object repeated commits do not keep `10`, `20`, `30`, and `40` all visible together as stale transparent shapes
- triangle count no longer climbs just because old baseline meshes were left in the scene

Likely file targets:
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- related host or viewer proof files

Important rule:
- treat this as a viewer cleanup seam first
- do not reopen selector meaning or interaction lifecycle unless a direct viewer regression disproves the accumulation read

Done when:
- repeated commits no longer leave stale transparent baseline geometry stacked in the viewport
- a viewer-facing regression locks that old baseline meshes are removed on replacement while the current winner stays visible

Landed read so far:
- `Phase 9.1` is now complete
- the accumulation owner is the viewer cleanup seam in `src/viewer/Viewer.ts`
- `setViewportRenderLayers(...)` creates baseline meshes but does not track them in a cleanup collection
- `clearPartMeshes()` removes only meshes found in:
  - `partMeshes`
  - `overlayPartMeshes`
- result:
  - stale baseline meshes can remain in the real scene across repeated commits and stack old transparent `last committed` geometry
- `Phase 9.2` is now complete
- `src/viewer/Viewer.test.ts` now locks the bug directly by instantiating the real `Viewer`, applying repeated baseline-only layer replacements for one output key, and inspecting the live scene graph
- current failing proof:
  - three `:baseline` meshes remain alive after the third replacement where only one should remain
- `Phase 9.3` is now complete
- `src/viewer/Viewer.ts` now tracks baseline meshes in a dedicated cleanup map and clears them alongside base and overlay meshes on every render-layer replacement
- result:
  - the direct viewer regression now passes
  - the surrounding settled `ViewerHost` proofs still pass
- `Phase 9.4` is now complete
- the direct viewer regression plus the settled `ViewerHost` and selector proof band all pass together
- `Phase 9` closes as a viewer cleanup issue:
  - stale baseline meshes were the real owner
  - no selector or interaction-lifecycle widening is needed for this symptom family

### Suggested First File Targets

The current next implementation passes should likely stay centered on:
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- the narrowest related viewer or host proof files needed to lock repeated-commit replacement

### Immediate Next Step

The best next step is:
- stop this lane here
- treat any future viewport issue as a new symptom to re-attribute instead of reopening the completed `Phase 9` seam by default

### Guardrails

If a patch claims to support this family, it should make the code more like this:
- one shared visual language
- one selector-owned visible recipe
- one smaller host rendering path
- explicit timing triggers
- explicit changed-versus-unchanged geometry membership

If it instead adds:
- another host-only gate
- another fallback branch that reinterprets mode meaning
- another patch that only fixes one mode/policy corner

then it is probably increasing seam fragility instead of reducing it.

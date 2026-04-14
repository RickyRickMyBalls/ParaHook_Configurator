# AutoDraftFinal Phase 9 - Clear Viewer Baseline Mesh Accumulation

## Doc Header

### Doc History
5. 2026-04-14 09:45: Completed `Phase 9.4 - Verify And Stop` by rerunning the direct `Viewer.test.ts` repeated-commit regression plus the most relevant settled `ViewerHost` and selector proofs, confirming the accumulation bug now stays closed as a viewer cleanup issue without reopening selector or interaction-lifecycle semantics
4. 2026-04-14 09:41: Completed `Phase 9.3 - Clear Stale Baseline Meshes On Layer Replacement` by giving `Viewer.ts` baseline-layer meshes the same explicit lifecycle ownership as base and overlay meshes, so repeated `setViewportRenderLayers(...)` replacement now removes and disposes stale `:baseline` meshes instead of leaving them stacked in the scene while the direct viewer regression and surrounding `ViewerHost` settle proofs stay green
3. 2026-04-14 09:36: Completed `Phase 9.2 - Add A Repeated-Commit Viewer Regression` by adding a direct `src/viewer/Viewer.test.ts` regression that drives three successive `setViewportRenderLayers(...)` baseline-only replacements on one output key and proves the real leak: the viewer currently leaves three `:baseline` meshes alive in the scene where only one should remain, so the bug is now locked at the viewer cleanup seam before any runtime patch
2. 2026-04-14 09:31: Completed `Phase 9.1 - Confirm The Accumulation Seam` by tracing the real render-layer replacement path in `Viewer.ts` and locking the owner: `setViewportRenderLayers(...)` creates `baselineParts` meshes but only base and overlay meshes are tracked in `partMeshes` and `overlayPartMeshes`, so `clearPartMeshes()` never removes baseline meshes from the root scene and repeated commits can stack stale transparent `last committed` shapes even when selector truth has already collapsed correctly
1. 2026-04-14 09:27: Created this dedicated Phase 9 planning doc after live repro and screenshot review showed a new post-Phase-8 symptom that the real app can still stack multiple old `last committed` transparent shapes from one-extrude parameter edits, narrowing the next likely seam to viewer-layer cleanup in `Viewer.ts` rather than more selector or interaction-lifecycle logic

### Purpose

This doc defines the next narrow follow-up phase under `AutoDraftFinal`.

Use it to answer:
- why repeated explicit commits can still leave multiple old `last committed` transparent shapes visible in the viewport
- whether the leak is really selector truth, host wiring, or viewer mesh cleanup
- how to prove the viewer replaces old baseline meshes instead of accumulating them
- how to fix that viewer cleanup seam without reopening the broader Phase 1 through Phase 8 contract work

### Why This Phase Exists

`Phase 8` proved the explicit-commit lifecycle well enough to close the family handoff on paper:
- typed commit clears both interaction channels
- pointer release clears both interaction channels
- explicit `Build` settles the target graph
- selector and host read-through proofs show the settled recipe collapsing to one winner

The real app still shows one important symptom that those proofs do not cover:
- a one-extrude graph can visually keep `10`, `20`, `30`, and `40` depth states all visible as separate transparent `last committed` shapes after repeated commits
- triangle count keeps climbing
- the old transparent shapes do not disappear even though the graph itself owns only one extrude

That symptom no longer reads like:
- a simple interaction-lifecycle miss
- or a simple selector decision leak

It now most strongly reads like:
- viewer-layer accumulation
- specifically, old baseline-layer meshes not being removed from the real Three.js scene between repeated render-layer updates

### Scope

This phase covers:
- repeated-settle viewport behavior after explicit parameter commits
- viewer-side cleanup for `base`, `baseline`, and `overlay` render-layer replacement
- proof that a one-object graph does not accumulate stale baseline meshes across repeated commits

This phase does not cover:
- new selector-visible result semantics
- new interaction lifecycle rules
- worker invalidation changes
- style or opacity redesign for `lastLoaded`

## Doc Body

## [x] Phase 9 - Clear Viewer Baseline Mesh Accumulation

### Header

Purpose:
- make repeated explicit commits replace the old viewer baseline layer instead of stacking stale transparent geometry in the scene

Owns:
- viewer-layer cleanup truth for repeated render updates
- baseline-mesh accumulation proof
- the narrow host-to-viewer read-through needed to show old baseline meshes are removed on the next settled render

Does not own:
- selector-visible result ownership
- interaction-lifecycle producer behavior
- worker scheduling or invalidation

### Current Constraints

This phase starts from the landed groundwork in:
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 8 - End Comparison On Explicit Commit.md`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

Locked starting constraints:
- selector and host proofs already say settled `Auto / Live` should collapse back to one winner
- the real app symptom now shows multiple stale transparent shapes from one graph object, so proof-only selector work is no longer enough
- the next pass should prefer the smallest viewer-cleanup fix that explains the triangle-count growth

Current strongest seam read:
- `Viewer.ts` creates meshes for:
  - `baseParts`
  - `overlayParts`
  - `baselineParts`
- `clearPartMeshes()` explicitly clears:
  - `partMeshes`
  - `overlayPartMeshes`
- the baseline-layer loop should be treated as the first suspect seam until proof says otherwise

Important current-reality rule:
- do not add more selector or store logic first
- prove whether the viewer is keeping old baseline meshes alive

### Locked Direction

#### 1. Treat this as a viewer cleanup bug first

The guiding rule for this phase is:
- if one graph object can leave multiple old transparent shapes behind after repeated commits, the first suspect is the viewer scene cleanup path

Important rule:
- do not reopen interaction-state logic unless a real viewer regression proves the scene is already clean

#### 2. Prove accumulation at the real render seam

The next proof should not stop at selector state.

It should prove one of these two outcomes:
- repeated render-layer updates replace old baseline meshes correctly
- or the viewer keeps stale baseline meshes alive across updates

Important rule:
- prefer one direct `Viewer.ts` or host-to-viewer regression over more indirect selector-only expectations

#### 3. Fix only replacement, not meaning

If the viewer leak is real, the fix should only do this:
- remove stale viewer meshes that no longer belong to the current `base`, `baseline`, or `overlay` recipe

It should not do this:
- change which result is supposed to be visible
- change when comparison begins or ends
- change `lastLoaded` styling

### Implementation Target

`Phase 9` should make one behavior shift real:

- after repeated explicit commits on a one-object graph, the viewport still shows only the current expected layers for that one object instead of accumulating old transparent baseline shapes from prior commits

The minimum meaningful behavior change should be:
1. user edits one extrude from `10` to `20`
2. user commits
3. user edits again to `30`
4. user commits
5. user edits again to `40`
6. user commits
7. viewport shows only the current intended settled layers for one object
8. old committed transparent shapes from `10`, `20`, and `30` are no longer still present in the scene

### Expected File Targets

Primary implementation files:
- `src/viewer/Viewer.ts`

Likely supporting files:
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- one new or existing viewer-focused regression file if direct viewer coverage is easier there than through the host

### Verification Bar

This phase is only done if it proves both:
- repeated commits do not accumulate stale baseline meshes
- the current intended winner still remains visible after cleanup

Required proof:
- one viewer-facing regression that exercises repeated render-layer replacement across at least three successive commits
- one host read-through proof or equivalent that the same repeated-commit graph no longer grows stale visible transparent shapes

### Suggested Phase Ladder

## [x] Phase 9.1 - Confirm The Accumulation Seam

Goal:
- prove whether the repeated transparent-shape stack is caused by viewer-layer cleanup rather than selector-visible truth

Owns:
- seam attribution for the repeated-commit accumulation bug

File targets:
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- existing related proof files

Implementation target:
- trace whether old baseline meshes are removed on every new `setViewportRenderLayers(...)` call

Verification bar:
- the likely owner must be named precisely before a runtime patch begins

Done when:
- the next sub-phase can say whether baseline accumulation is:
  - a viewer cleanup leak
  - a host duplication leak
  - or unexpectedly still a selector-recipe leak

Important rule:
- no broad code changes in this step

Stop rule:
- stop once the accumulation seam is attributable to one named owner

Landed result:
- the repeated transparent-shape stack is attributable to the viewer cleanup seam, not primarily to selector-visible truth or interaction lifecycle
- `Viewer.ts` creates three render-layer populations in `setViewportRenderLayers(...)`:
  - `baseParts`
  - `overlayParts`
  - `baselineParts`
- only two of those populations are tracked for later cleanup:
  - `partMeshes`
  - `overlayPartMeshes`
- the `baselineParts` loop creates baseline meshes and adds them to the scene, but does not store them in a dedicated cleanup collection
- `clearPartMeshes()` removes and disposes only meshes found in:
  - `partMeshes`
  - `overlayPartMeshes`
- direct consequence:
  - baseline meshes added directly to `rootGroup` can survive repeated render-layer replacement and visually stack old transparent `last committed` shapes across repeated commits
- secondary note:
  - if a baseline mesh is attached through a content-object pivot, removing the pivot may detach it from the scene, but the baseline mesh still is not part of the explicit disposal path

Locked handoff for the next sub-phase:
- `Phase 9.2` should add one repeated-commit regression that proves stale baseline meshes remain until the viewer cleanup path is fixed
- no selector or interaction-lifecycle widening is needed before that regression exists

## [x] Phase 9.2 - Add A Repeated-Commit Viewer Regression

Goal:
- lock the real accumulation symptom in one failing proof before changing runtime code

Owns:
- regression coverage for repeated-settle replacement of baseline meshes

File targets:
- `src/app/components/ViewerHost.test.tsx`
- or one viewer-focused test file if direct scene inspection is clearer there

Implementation target:
- model one-object repeated commits and prove stale transparent shapes do not remain in the rendered scene or layer application path

Verification bar:
- the regression must fail before the runtime patch and pass after it

Done when:
- the repo has one explicit repeated-commit proof for this exact accumulation symptom

Important rule:
- the proof should count visible layer members or concrete mesh ownership, not only selector state

Stop rule:
- stop once the repeated-commit accumulation is captured in a failing regression

Landed result:
- the repo now has one direct viewer-owned regression in:
  - `src/viewer/Viewer.test.ts`
- the proof instantiates a real `Viewer`, applies three successive baseline-only `setViewportRenderLayers(...)` updates for the same output key, and inspects the live Three.js root group instead of only selector or host state
- current failing result:
  - the scene keeps three `:baseline` meshes alive after the third replacement where only one should remain
- this matches the live repeated-commit symptom:
  - old transparent `last committed` shapes stack visually
  - triangle count can keep growing
- important scope lock:
  - no runtime code changed in this phase
  - `Phase 9.3` is now the first allowed viewer cleanup patch

## [x] Phase 9.3 - Clear Stale Baseline Meshes On Layer Replacement

Goal:
- fix the viewer cleanup seam so repeated settled renders replace old baseline meshes instead of keeping them alive

Owns:
- the narrow runtime patch for stale baseline-layer cleanup

File targets:
- `src/viewer/Viewer.ts`

Implementation target:
- ensure every obsolete viewer mesh created by prior `base`, `baseline`, or `overlay` layers is removed and disposed before the next layer set is applied

Verification bar:
- the Phase 9.2 regression passes
- no existing host/selector layer proofs regress

Done when:
- repeated commits no longer stack stale transparent shapes for a one-object graph

Important rule:
- change cleanup only as much as needed
- do not redesign `ViewerViewportRenderLayers`

Stop rule:
- stop once stale baseline accumulation is gone and the viewer still renders the intended current layer set

Landed result:
- `Viewer.ts` now tracks baseline-layer meshes in an explicit cleanup collection alongside the existing base and overlay mesh maps
- `clearPartMeshes()` now removes and disposes:
  - base meshes
  - baseline meshes
  - overlay meshes
- `applyShadowFlags()` now also keeps baseline meshes on the same non-shadowing presentation path as overlay meshes
- direct effect:
  - repeated `setViewportRenderLayers(...)` replacement no longer leaves stale `:baseline` meshes alive in the scene
- proof result:
  - the new direct `src/viewer/Viewer.test.ts` regression now passes
  - surrounding settled `ViewerHost` proofs still pass

## [x] Phase 9.4 - Verify And Stop

Goal:
- confirm the viewer cleanup fix closes the real-app accumulation symptom without reopening the wider AutoDraftFinal ladder

Owns:
- final verification and cleanup stop decision for this bug

File targets:
- the narrow set touched by `Phase 9.2` and `Phase 9.3`

Implementation target:
- rerun the repeated-commit regression plus the most relevant existing `ViewerHost` settle proofs

Verification bar:
- repeated-commit accumulation proof passes
- existing settle and branch-local viewport proofs stay green

Done when:
- the family can say the repeated transparent-shape stack is closed as a viewer cleanup issue

Important rule:
- do not widen into new mode semantics after the fix is proven

Stop rule:
- stop once the accumulation bug is closed and the surrounding proof band stays green

Landed result:
- the repeated-commit accumulation bug now closes as a viewer cleanup issue
- verification reran:
  - the direct `src/viewer/Viewer.test.ts` repeated-replacement regression
  - the settled `ViewerHost` proofs for:
    - winner-only `lastLoaded` base after interaction ends
    - dropping the old branch-local baseline after settle
  - the matching settled selector proofs for:
    - returning `auto / live` to `lastLoaded`
    - dropping the old branch-local baseline after settle
- all targeted proofs passed after the `Phase 9.3` cleanup patch
- explicit stop decision:
  - no further selector, host, or interaction-lifecycle widening is needed for this symptom family
  - `Phase 9` is complete

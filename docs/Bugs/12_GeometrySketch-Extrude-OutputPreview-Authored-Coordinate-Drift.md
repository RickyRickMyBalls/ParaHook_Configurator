# 12 - Geometry Sketch To Extrude OutputPreview Authored Coordinate Drift

## Doc History
8. 2026-04-04 22:20: Completed `Phase 4 - Verify viewer grouping does not re-center graph mesh unexpectedly` by narrowing project-mode `contentObjectTransformGroups` so ordinary graph-owned preview solids are no longer grouped into viewer pivots by default, adding focused `ViewerHost` regressions for both the new default and the retained active-transform grouping path, and recording the landing as the permanent `Extrude-1A - Graph Preview Grouping Gate` runtime entry
7. 2026-04-04 22:20: Prepared `Phase 4 - Verify viewer grouping does not re-center graph mesh unexpectedly` for implementation by grounding it in the live `ViewerHost -> contentObjectTransformGroups -> Viewer.setParts -> anchorContentObjectPivotToBoundsCenter(...)` seam, locking the investigation around graph-owned preview solids being recentered to mesh bounds instead of authored sketch space, and replacing the earlier short placeholder with concrete file focus, regression targets, and behavior-preservation rules
6. 2026-04-04 22:10: Completed `Phase 3 - Patch active viewport authority` by shipping a transient project-mode `ViewerHost` override that remaps the qualifying extrude preview mesh from the committed sketch plane frame into the live `sketchPlanePickSession` draft frame, adds focused `ViewerHost` regression coverage for live draft movement plus cancel-to-accepted fallback, and leaves accepted build outputs unchanged
5. 2026-04-04 22:10: Prepared `Phase 3 - Patch active viewport authority` for implementation by grounding it in the live `ViewerHost -> previewList -> selectRenderedProjectPartSet` project-mode seam, locking the scope to a transient active-viewport draft override driven by `sketchPlanePickSession.draftTransform`, and replacing the earlier broad placeholder with concrete selector ownership, activation rules, regression targets, and behavior-preservation boundaries
4. 2026-04-04 22:03: Prepared `Phase 2 - Decide draft-plane/origin preview contract` for implementation by locking the active-viewport UX rule that sketch-plane/origin draft edits should live-update the extrude body, narrowing the owned scope to transient active-viewport preview authority rather than published output semantics, and replacing the earlier placeholder questions with concrete file focus, activation boundaries, verification, and definition of done
3. 2026-04-04 21:41: Completed `Phase 1 - Prove active viewport freshness vs accepted-build lag` by adding focused `ViewerHost` regression coverage that proves project-mode body rendering starts from accepted output artifacts while the visible sketch overlay can follow a newer committed sketch transform, then updated this bug note so the primary current seam now reads as active viewport freshness / authority lag instead of another worker coordinate-loss bug
2. 2026-04-04 21:35: Prepared `Phase 1 - Prove active viewport freshness vs accepted-build lag` for implementation by replacing the earlier short placeholder with a concrete seam read, locked questions, file focus, verification steps, and definition of done around the current strongest live suspicion that the sketch overlay is live while the graph-owned preview mesh is still driven by accepted output state
1. 2026-04-04 21:31: Created this bug note to track the still-open post-`Extrude-1A` problem where `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview` now respects the authored sketch plane better, but the previewed body still fails to stay aligned with the live sketch coordinates and can lag when the sketch origin/plane draft moves

## Doc Body

### Status

- `[investigating]`

### Summary

We have improved the extrude path, but the bug is not fully closed.

The current live read is:

- the extruded body now appears on the correct authored plane more often
- the worker/build path now preserves sketch-local profile coordinates better than before
- but the final viewport result can still drift away from the cyan sketch outline
- and moving the sketch origin / sketch-plane draft can move the overlay without moving the blue body

That means the remaining defect is no longer best described as "extrude ignores the plane."
It is now more like a preview-authority / freshness / presentation mismatch across:

- live sketch overlay state
- accepted build output state
- viewer graph-part placement and grouping

### User-Facing Symptom

- `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview` can still show a blue body offset from the cyan sketch shape
- the body may be on the right plane orientation but still not appear to come from the same local sketch coordinates
- moving the sketch origin or active sketch-plane draft can move the cyan overlay while the blue body stays behind
- this makes `OutputPreview` feel stale or untrustworthy during sketch-plane adjustment work

### Confirmed Improvements So Far

These fixes already improved the path and should be treated as landed groundwork, not discarded attempts:

1. `Extrude-1A` graph-native extrude now carries `planeTransform` through compile/runtime and builds the body from the authored sketch plane frame.
2. Mesh-backed preview artifacts now render in authored world space instead of the older preview-gallery offset path.
3. Viewer artifact-mesh conversion now consumes runtime mesh coordinates directly instead of the older axis-remap path.
4. Runtime part materials now render double-sided so the start cap on the sketch plane is more readable.
5. Focused regressions now prove graph-native extrude meshes preserve non-origin sketch-local coordinates in the worker/build path.

### Current Strongest Live Suspicion

Phase 1 now strongly supports that the viewport is mixing two different authorities:

- the cyan sketch overlay is fed from newer sketch state
- the blue extrude body is still sourced from accepted graph build outputs

That means the overlay can update ahead of the body while the body stays on the last accepted build.

This is especially plausible because:

- `ViewerHost.tsx` uses live sketch feature params for visible sketch overlays
- graph-owned preview meshes in project mode come through `renderedProjectPartSet.viewerParts`
- that path is backed by accepted graph build outputs, not a draft-aware transient extrude preview
- sketch-plane draft editing lives in `sketchPlanePickSession.draftTransform` and is only committed to the graph on finish

Secondary suspicion:

- the viewer still groups graph-owned parts under content-object pivots and anchors those pivots to bounds centers
- that path may still be worth ruling out with a focused regression, even though it no longer looks like the strongest primary cause

### Likely Ownership

- `SP`
- `VR`
- graph preview freshness / browser build policy behavior
- viewer graph-part placement and content-object grouping

### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/viewer/Viewer.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.ts`
- `src/app/store/useAppStore.ts` (`selectRenderedProjectPartSet`)

### Relation To Older Bugs

This is related to, but not the same as:

- `Bug 4` (`Cube connected to OutputPreview does not render`)
- `Bug 7` / `Bug 4_GeometrySketch-Extrude-Profile-Handoff-Regression.md`

The older extrude bug was mainly about:

- mesh collapse
- box-only artifact preview
- missing plane-transform propagation

This newer bug is narrower and more interactive:

- the body can still be stale or visually detached from the live sketch even after those earlier contract repairs landed

## Attempt Log

### Attempt 1 - Carry authored sketch plane transform through graph-native extrude

Status:
- `[landed]`

What changed:

- threaded `planeTransform` from `Geometry/Sketch` into graph-native extrude compile/runtime
- updated runtime mesh generation so extrude uses the authored sketch plane frame

What it fixed:

- the body no longer falls back as often to only the base `XY/XZ/YZ` plane enum

What it did not fully fix:

- the body can still appear offset from the sketch outline in the final viewport

### Attempt 2 - Stop preview mesh gallery offset / axis remap

Status:
- `[landed]`

What changed:

- stopped mesh artifacts from being re-laid out like gallery items
- removed the old viewer artifact-mesh axis remap

What it fixed:

- the mesh preview now preserves authored world-space geometry better

What it did not fully fix:

- the live viewport can still disagree with the sketch overlay during sketch-plane/origin editing

### Attempt 3 - Make start cap readable with double-sided materials

Status:
- `[landed]`

What changed:

- runtime part materials now render double-sided

What it fixed:

- some "looks offset" cases were really back-face-culling readability problems, and this improved that

What it did not fully fix:

- the body still appears stale in the latest user report when the sketch origin/draft moves

### Attempt 4 - Worker/build regression to prove non-origin sketch-local coordinates survive

Status:
- `[landed]`

What changed:

- added focused regression proving graph-native extrude mesh preserves sketch-local coordinates away from `(0, 0)`

What it tells us:

- the worker/build mesh path is no longer the strongest suspect for the remaining bug

What it did not prove:

- whether the real project-mode viewport uses fresh enough output or the same coordinate authority as the live sketch overlay

## Phase Tracker

## [x] Phase 1 - Prove active viewport freshness vs accepted-build lag

### Header

Purpose:
- prove whether the remaining live mismatch is primarily a freshness / authority problem in the active viewport, not another worker extrude coordinate bug

Owns:
- active viewport data-source tracing for graph-owned preview parts
- accepted-output vs live/draft overlay comparison
- build-policy interaction for graph preview freshness
- one focused regression or harness check that can preserve the conclusion

Does not own:
- the final UX decision for draft-plane/origin editing
- a full viewer placement refactor
- `Extrude-1B`
- new graph/runtime architecture beyond what is needed to prove the seam

### Current Seam Read

- the visible sketch overlay in `ViewerHost.tsx` is built directly from live sketch node params and active sketch/session state
- active sketch-plane draft editing lives in `sketchPlanePickSession.draftTransform` inside `src/app/spaghetti/store/useSpaghettiStore.ts`
- that draft state is only persisted to the graph on `finishSketchPlanePick()`
- graph-owned mesh preview in the main viewport flows through:
  - `ViewerHost.tsx`
  - `selectRenderedProjectPartSet(...)` in `src/app/store/useAppStore.ts`
  - `renderedProjectPartSet.viewerParts`
- that path is fed by graph runtime accepted output state, not by the live sketch-plane draft session
- the viewer target preview selectors still read accepted preview outputs from:
  - `selectViewerTargetGraphAcceptedPreviewBuildOutputs(...)`
  - `selectGraphAcceptedBuildOutputsByDocumentId(...)`
- browser build policy can intentionally suppress or delay rebuilds in:
  - `src/app/store/useAppStore.ts`
- there is also still a secondary viewer grouping seam:
  - `Viewer.setParts(...)`
  - `setContentObjectTransformGroups(...)`
  - `anchorContentObjectPivotToBoundsCenter(...)`
- but that now looks secondary to the stronger freshness mismatch suspicion

Current strongest suspicion:
- the cyan sketch is updating from live or draft state
- the blue body is still coming from the last accepted build
- therefore origin / plane draft changes can move the sketch immediately while the body remains behind until commit or rebuild

### Questions / Decisions

#### [x] - `q1` Is the current active viewport expected to reflect sketch-plane draft edits before commit?

##### Suggestion
- no by default as an architectural assumption for this phase
- Phase 1 should prove what the current code actually does before we decide what it should do in Phase 2

#### [x] - `q2` What is the first thing Phase 1 needs to prove?

##### Suggestion
- prove whether the active viewport body is sourced from accepted build outputs while the sketch overlay is sourced from live/draft state
- if that is true, treat stale preview as the primary bug seam

#### [x] - `q3` Should Phase 1 patch behavior yet?

##### Suggestion
- no unless a tiny diagnostic guardrail is needed for proof
- this phase should mainly reduce uncertainty and leave behind one durable regression or test seam

#### [x] - `q4` What result should move the work into Phase 2?

##### Suggestion
- one confirmed conclusion among:
  - accepted-build lag is the primary cause
  - draft-only transform behavior is the primary cause
  - viewer grouping still introduces a real post-build offset

### Implementation Spec

Recommended file focus:
- inspect `src/app/components/ViewerHost.tsx`
- inspect `src/app/store/useAppStore.ts`
- inspect `src/app/spaghetti/store/useSpaghettiStore.ts`
- inspect `src/viewer/Viewer.ts`
- add focused regression coverage in the smallest layer that can preserve the conclusion

Implementation steps:
1. trace the exact active viewport source for graph-owned mesh parts and write down the selector chain from graph runtime to `Viewer.setParts(...)`
2. confirm whether the active viewport path is using:
   - accepted build outputs
   - accepted preview outputs
   - or any live transient preview path
3. confirm the sketch overlay source for:
   - persisted sketch params
   - active sketch draw session
   - active sketch-plane draft session
4. reproduce the "overlay moves, body stays behind" behavior at code level by identifying whether:
   - the graph has not yet changed
   - the graph changed but no build was accepted
   - or the viewer repositions an already-correct mesh
5. add one focused regression or selector-level test that proves the discovered seam
6. leave a short conclusion in this bug doc that says which of the three candidate causes won

Behavior-preservation rules:
- do not widen this phase into solving the full preview UX
- do not change worker extrude math in this phase unless the proof unexpectedly disproves the existing regression coverage
- do not redesign browser build policy semantics here
- do not remove content-object grouping in this phase unless it is directly proven to be the root cause

Verification:
- run focused tests for any touched selector/store/viewer path
- manually verify the exact user sequence:
  - start with `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview`
  - move sketch origin or sketch-plane draft without finishing the pick session
  - observe whether the cyan overlay moves before the blue body
  - then commit the change and observe whether a rebuild catches the body up
  - note the active browser build policy during the check

Definition of done:
- we can say with confidence which seam is primary:
  - stale accepted output
  - missing transient draft preview
  - or viewer re-centering/group offset
- at least one focused regression or harness check exists so we do not have to rediscover the same answer later
- the bug doc contains a concise conclusion that directly feeds Phase 2

### Phase 1 Conclusion

Phase 1 outcome:

- `[confirmed-primary]` active viewport freshness / authority lag

What we proved:

1. In project mode, `ViewerHost` starts body rendering from accepted output artifacts.
2. A newer sketch transform can update the visible sketch overlay while accepted build output remains unchanged.
3. That means the remaining bug is no longer best explained by worker extrude coordinate loss.

What we did not prove yet:

1. whether draft-only sketch-plane edits should preview live or stay stale by design
2. whether viewer content-object grouping also adds a smaller secondary offset in some cases

Phase 2 should therefore decide the intended preview contract for sketch-plane/origin editing, and Phase 3 should patch the active viewport authority to match that choice.

## [ ] Phase 2 - Decide draft-plane/origin preview contract

### Header

Purpose:
- lock the active-viewport preview rule for sketch-plane/origin draft editing so the cyan sketch overlay and blue extrude body share one immediate authority during editing

Owns:
- the user-facing behavior decision for active sketch-plane/origin draft edits
- the active-viewport rule for transient graph-native extrude preview while draft state is changing
- the boundary between live active-viewport preview and accepted/published output semantics
- the implementation-ready contract that Phase 3 should ship

Does not own:
- the full Phase 3 runtime patch
- browser/output-surface publishing redesign
- general `OutputPreview` architecture cleanup beyond this draft-edit seam
- `Extrude-1B`, plural profile work, or `taper/offset` behavior

### Current Seam Read

- Phase 1 proved the current body/overlay mismatch is primarily a freshness and authority split:
  - the visible sketch overlay can move with newer sketch state
  - the body can remain on accepted build output
- the current UX makes `System/OutputPreview` look broken during sketch-plane/origin work even when committed graph state is internally consistent
- the active editing viewport is the place where the user expects one live authored-shape story, not a split between draft overlay and stale solid
- accepted output still matters for browser/project/published surfaces, but that should not force the active editing viewport to stay stale

Locked recommendation:
- the active viewport should live-update the extrude body during sketch-plane/origin draft edits
- accepted/published/project surfaces may remain commit-based
- later, if desired, this can become a user-facing option, but this phase locks the default behavior as live updating

### Questions / Decisions

#### [x] - `q1` Should the extrude body update live while sketch-plane/origin draft is active in the active viewport?

##### Suggestion
- yes
- the active viewport should show a transient live extrude preview that follows the same draft sketch-plane/origin authority as the visible sketch overlay

#### [x] - `q2` Should accepted/published/project outputs also switch to draft-aware live behavior?

##### Suggestion
- no
- keep accepted-output authority for non-active and published surfaces unless a later phase explicitly widens that contract

#### [x] - `q3` Should stale-body behavior remain as the default while draft editing is active?

##### Suggestion
- no
- stale-body or hidden-body behavior can remain a fallback only if transient preview proves too risky, but it should not be the default contract

#### [x] - `q4` What exact behavior should Phase 3 implement?

##### Suggestion
- while sketch-plane/origin draft editing is active for the active graph, the main editing viewport should consume fresh transient extrude preview output driven by the draft transform
- when the draft session ends, the viewport can return to the normal accepted-output path once committed state catches up
- browser/project/published surfaces should keep their current accepted-output semantics

### Spec

Recommended file focus:
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.ts`
- `src/viewer/Viewer.ts`

Implementation steps:
1. lock the active-viewport contract in docs and notes:
   - active viewport uses transient live extrude preview during sketch-plane/origin draft edits
   - accepted/published surfaces remain commit-based
2. identify the smallest runtime seam that can switch the active viewport from accepted output to fresh transient preview output while draft editing is active
3. define the activation condition precisely:
   - active graph
   - active sketch-plane/origin draft session
   - graph-native sketch-to-extrude preview path
4. define the deactivation condition precisely:
   - draft session finishes or cancels
   - viewport returns to normal accepted-output path outside the live draft session
5. leave Phase 3 a concrete implementation target by writing down:
   - which selector or view-model should branch
   - which surface stays on accepted output
   - what regression should prove the new contract

Behavior-preservation rules:
- do not widen this phase into changing browser publishing semantics
- do not redesign content-object ownership or slot identity
- do not reopen worker extrude math unless new evidence disproves existing regressions
- do not require a user-facing toggle yet; this phase only locks the default behavior

Verification:
- re-read the Phase 1 proof and ensure the Phase 2 decision directly answers the proven seam
- confirm the spec clearly separates:
  - active live viewport behavior
  - accepted/published surface behavior
- ensure the next implementation phase can be executed without reopening the user-facing behavior question

Definition of done:
- the bug doc explicitly says the active viewport should live-update the extrude body during sketch-plane/origin draft edits
- the bug doc explicitly says accepted/published/project surfaces may remain commit-based
- Phase 3 has a concrete implementation target instead of an open behavior question
- a later optional user-control toggle is recorded as future flexibility, not a blocker for implementation

## [x] Phase 3 - Patch active viewport authority

### Header

Purpose:
- make the active editing viewport follow the same draft sketch-plane/origin authority as the cyan sketch overlay by adding a transient active-viewport override for the qualifying extrude body during sketch-plane/origin editing

Owns:
- the runtime patch that makes the active viewport body move with `sketchPlanePickSession.draftTransform`
- the selector or view-model branch that chooses transient active-viewport preview over accepted project output for the active draft case
- the first regression that proves the active body follows draft movement while non-active published surfaces remain unchanged

Does not own:
- browser/project/published surface semantics outside the active viewport
- a general graph-preview architecture redesign
- worker extrude math changes
- viewer grouping cleanup unless a regression in Phase 4 proves it is still needed

### Current Seam Read

- `ViewerHost.tsx` currently prefers `renderedProjectPartSet.viewerParts` whenever the app is in project/shared-composition mode
- `renderedProjectPartSet` comes from `selectRenderedProjectPartSet(...)` in `src/app/store/useAppStore.ts`
- `selectRenderedProjectPartSet(...)` currently builds graph-owned preview parts from:
  - `previewPreparation`
  - `acceptedBuildOutputs`
- the direct viewer-target path already has access to `acceptedPreviewBuildOutputs`, but the project-mode path does not use them
- swapping to `acceptedPreviewBuildOutputs` alone is not enough for this bug because sketch-plane draft state lives in `sketchPlanePickSession.draftTransform` and is not yet committed into the graph runtime
- therefore Phase 3 needs a transient active-viewport override driven directly from draft session state, not only a different accepted bundle

Recommended implementation shape:
- keep `selectRenderedProjectPartSet(...)` as the project-mode source of truth for ordinary accepted output rendering
- add a narrow active-viewport override path in `ViewerHost.tsx` for the active graph while a qualifying `sketchPlanePickSession` is live
- the override should affect only the qualifying graph-native extrude preview for the active draft session, not every graph-owned part in the project
- preview identity should remain slot-scoped and graph-qualified exactly as it is today

### Questions / Decisions

#### [x] - `q1` Where should the first behavior branch live?

##### Suggestion
- in `ViewerHost.tsx`, where `previewList` currently short-circuits to `renderedProjectPartSet.viewerParts`
- this is the narrowest layer that already sees:
  - project-mode viewer parts
  - active graph document identity
  - sketch-plane draft session state

#### [x] - `q2` What data should drive the live draft movement?

##### Suggestion
- `sketchPlanePickSession.draftTransform`
- compare it against the authored transform already represented by the current graph/runtime state and derive a transient active-viewport override from that delta

#### [x] - `q3` Should the first implementation change accepted build state or published output state?

##### Suggestion
- no
- Phase 3 should be viewport-local and transient only

#### [x] - `q4` How wide should the first implementation slice be?

##### Suggestion
- narrow it to the reproduced graph-native path:
  - `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview`
- only the qualifying active graph preview body should receive the draft override
- if broader dependency coverage is needed later, widen after the first regression-protected slice lands

### Spec

Recommended file focus:
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/components/ViewerHost.test.tsx`

Implementation steps:
1. introduce a small active-draft detection helper for the active viewport:
   - active `sketchPlanePickSession`
   - matching active/viewer-target graph document
   - qualifying `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview` path
2. define a transient override payload for the active viewport:
   - source graph document id
   - qualifying viewer key or slot id
   - authored transform
   - draft transform
3. patch `ViewerHost` preview assembly so project-mode rendering can:
   - start from `renderedProjectPartSet.viewerParts`
   - replace or transform only the qualifying active graph preview body while draft editing is active
4. keep accepted output semantics intact everywhere else:
   - `selectRenderedProjectPartSet(...)` remains accepted-output based by default
   - browser/project/published surfaces do not gain draft-aware behavior in this phase
5. prefer the smallest technically honest transient strategy:
   - if the body can be moved correctly by a viewer-local transform delta derived from the sketch-plane draft, use that first
   - only widen to transient rebuild/re-artifact generation if the viewer-local draft transform cannot preserve placement truth
6. add focused regressions that prove:
   - active viewport body moves with sketch-plane/origin draft edits
   - ending or canceling the draft session returns the viewport to the ordinary accepted-output path
   - unrelated project-mode parts remain unchanged

Behavior-preservation rules:
- do not rewrite build acceptance semantics
- do not mutate `acceptedBuildOutputs` or `acceptedPreviewBuildOutputs` to fake draft state
- keep slot-scoped `viewerKey` identity and graph-qualified viewer ownership unchanged
- do not patch every project-mode part when only one qualifying active preview body needs the draft override
- do not widen into Phase 4 viewer-grouping work unless a new regression proves an additional offset

Verification:
- run focused viewer-host coverage around the project-mode path
- manually verify:
  - start `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview`
  - enter sketch-plane/origin draft edit
  - move or rotate the draft transform
  - confirm the blue body follows live in the active viewport
  - cancel or finish the draft session and confirm the viewport returns to normal accepted-output behavior
- confirm browser/project/published surfaces still read from accepted output only

Definition of done:
- the active viewport no longer leaves the blue body behind while the cyan sketch overlay moves during sketch-plane/origin draft edits
- the implementation is transient and viewport-local rather than a mutation of accepted build state
- slot-scoped identity and project/published semantics stay unchanged
- focused regressions cover live draft movement and draft-session exit behavior

### Phase 3 Conclusion

Phase 3 outcome:

- `[landed]` transient active-viewport draft override for the qualifying project-mode extrude preview body

What changed:

1. `ViewerHost` now applies a narrow active-draft override for the reproduced `Geometry/Sketch -> Geometry/Extrude -> System/OutputPreview` path.
2. The override remaps the current mesh artifact from the committed sketch plane frame into the live `sketchPlanePickSession` draft frame.
3. Accepted build outputs stay unchanged; the behavior is viewer-local and transient only.

What this fixed:

1. while a sketch-plane draft session is active, the blue extrude body now follows live draft plane/origin movement in the active project-mode viewport
2. canceling the draft session returns the body to the ordinary accepted-output artifact path

What remains open:

1. whether viewer grouping still introduces any secondary placement delta after the live draft override
2. whether later user-facing control should be added for live versus committed-only draft preview behavior

## [x] Phase 4 - Verify viewer grouping does not re-center graph mesh unexpectedly

### Header

Purpose:
- verify and, if proven, remove the remaining viewer-side recentering seam that can pull graph-owned preview solids toward a viewer/object-centered placement instead of leaving them in authored sketch world space

Owns:
- the `Viewer.setParts(...)` grouping and pivot-centering behavior for graph-owned preview solids
- the `ViewerHost` content-object transform-group feed for project-mode graph preview parts
- the first regression that proves whether `anchorContentObjectPivotToBoundsCenter(...)` shifts authored graph mesh placement

Does not own:
- worker extrude math
- accepted build state or published output semantics
- broader content-object transform UX redesign outside the minimum fix required for authored graph preview placement

### Current Seam Read

- `ViewerHost.tsx` builds `contentObjectTransformGroups` from `renderedProjectPartSet.parts`, which means ordinary graph-owned preview solids are still opt-in members of content-object grouping even when the user is not actively transforming the object
- `Viewer.setParts(...)` adds grouped parts under per-object pivots
- after all grouped meshes are attached, `Viewer.setParts(...)` calls `anchorContentObjectPivotToBoundsCenter(...)`
- that helper subtracts the mesh-bounds center from every child and moves the pivot to that center
- the cyan sketch overlay does not go through this same pivot-centering path

Current strongest suspicion:
- for graph-owned preview solids, the pivot-centering pass is still normalizing the body around its own bounds center
- that makes the blue solid read as if it is tied to viewer/object center rather than the authored sketch origin
- this is now a stronger suspect than the already-landed draft-preview seam

Recommended implementation shape:
- first prove the placement delta with a focused regression
- if proven, skip pivot-centering for graph-owned preview solids when no content-object transform override/session is active
- keep any pivot-centered behavior only where it is actually needed for object-transform tooling

### Questions / Decisions

#### [x] - `q1` What exact seam should the first regression target?

##### Suggestion
- `ViewerHost -> contentObjectTransformGroups -> Viewer.setParts -> anchorContentObjectPivotToBoundsCenter(...)`
- use a grouped graph-owned mesh artifact that already has authored world coordinates away from origin and assert whether the final rendered object is still in that authored frame

#### [x] - `q2` Where should the first behavior fix live if the regression proves a placement delta?

##### Suggestion
- prefer the narrowest fix that preserves authored graph preview placement:
  - either stop feeding graph-owned preview solids into `contentObjectTransformGroups` by default in `ViewerHost.tsx`
  - or make `Viewer.ts` skip pivot-centering for graph-owned preview solids unless an active content-object transform override/session requires it

#### [x] - `q3` Should this phase remove all content-object grouping?

##### Suggestion
- no
- only remove or bypass the grouping/centering path for graph-owned preview solids when it is not needed for transform tooling

#### [x] - `q4` What result counts as success for this phase?

##### Suggestion
- the blue body stays in the same authored world frame as the cyan sketch outline in project mode
- graph-owned preview solids no longer drift toward object/viewer center because of pivot anchoring
- content-object transform behavior stays intact for the cases that still rely on it

### Spec

Recommended file focus:
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- optional small helper coverage if the grouping decision is extracted

Implementation steps:
1. add a focused regression that reproduces the current project-mode grouped-part path with:
   - a graph-owned mesh artifact already authored away from origin
   - a content-object transform group
   - no active content-object transform override
2. assert whether the final rendered object remains in authored world position or gets recentered by `anchorContentObjectPivotToBoundsCenter(...)`
3. if the regression proves recentering:
   - patch the narrowest layer so graph-owned preview solids skip the centering path by default
   - preserve current slot-scoped identity and selection/highlight behavior
4. keep transform-tool compatibility by preserving grouping/centering only where it is still required:
   - active content-object transform sessions
   - explicit content-object transform overrides
   - or later cases that truly need pivot-centered manipulation
5. add or update project-mode viewport coverage proving:
   - authored graph preview placement is preserved
   - sketch overlay and solid share one world-space story
   - unrelated transform-tool behavior does not regress

Behavior-preservation rules:
- do not reopen accepted-output or draft-preview authority decisions already settled in earlier phases
- do not change viewer-key identity, browser visibility mapping, or part selection ownership
- do not remove grouping for reference objects or transform-tool cases that still rely on pivots
- do not widen this pass into more worker/build changes unless a new regression proves they are implicated

Verification:
- run focused viewer or viewer-host tests around grouped graph-owned mesh parts
- manually verify in project mode:
  - a graph-owned extrude body authored away from origin
  - no active object-transform session
  - body remains attached to the sketch origin instead of viewer/object center
- re-check that draft-edit live preview from Phase 3 still works after the grouping fix

Definition of done:
- a focused regression proves whether viewer pivot-centering was introducing the remaining placement delta
- if proven, the landed patch preserves authored graph preview placement in project mode
- the blue body and cyan sketch outline now share the same world frame in the reproduced case
- transform tooling still works for the remaining content-object cases that need grouping

### Phase 4 Conclusion

Phase 4 outcome:

- `[landed]` project-mode graph preview grouping is now gated to real content-object transform cases

What changed:

1. `ViewerHost` no longer feeds ordinary graph-owned preview solids into `contentObjectTransformGroups` by default.
2. Grouping is still preserved when an object has an active content-object transform session or a non-null transform override.
3. Focused `ViewerHost` coverage now protects both the default authored-placement path and the retained transform-tool path.

What this fixed:

1. graph-owned preview solids are no longer sent through viewer pivot centering unless transform tooling actually needs a pivot
2. the strongest remaining "viewer origin instead of sketch origin" seam has been narrowed out of the default project-mode path

What remains open:

1. live manual verification is still useful to confirm the screenshot case is fully gone in the real viewport
2. if any residual offset remains after this, it is likely in a narrower viewer/object-transform path rather than the broad always-on grouping seam
## Suggested Definition Of Done

This bug is done when:

1. the blue extrude body and cyan sketch outline stay aligned in the active viewport
2. moving sketch origin / sketch plane behaves according to one explicit preview rule
3. the user no longer sees the body remain behind while the sketch overlay moves ahead
4. regressions cover both:
   - committed graph state
   - and the chosen draft-edit behavior

## Notes

Right now the best next implementation target is not more worker extrude math.

It is:

- prove the freshness mismatch
- decide the draft-preview contract
- then patch the active viewport authority accordingly

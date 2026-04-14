# 19 - Worker 11 Viewport Presentation Contract Gap

## Doc History
7. 2026-04-13 20:49:42: Updated this bug note to record the shipped `Phase B` result after `ViewerHost.tsx` gained an active-interaction fallback to raw runtime accepted preview bundle/output state, capturing that the earlier `Phase A` gate failure was a wrong-source gap rather than a fundamentally unreachable branch-local path because the new end-to-end two-extrude proof now reaches a real three-layer call with stable unchanged sibling base, changed-branch dimmed baseline, and rebuilt-only overlay even while the selector-visible accepted preview bundle remains intentionally empty
6. 2026-04-13 20:41:18: Recorded the first `Phase A` seam-inspection result after a targeted `ViewerHost` proof attempt, capturing that the end-to-end two-extrude active-drag path still never reaches the branch-local retained-baseline layer call and instead stays on retained authoritative-only rendering with no overlay, so the next viewport debugging pass now has one concrete gating failure instead of only the broader live symptom list
5. 2026-04-13 20:25:09: Added a seam-by-seam viewport investigation order to `Bug 19`, breaking the `ViewerHost.tsx` debugging work into explicit phases around the branch-local gating condition, rebuilt-only overlay source, layer assembly, frozen interaction base, helper split logic, and selector handoff so the next viewport-path fixes can be inspected one seam at a time instead of patched as one blended problem
4. 2026-04-13 20:19:43: Narrowed `Bug 19` to the viewport-path symptom family only after the first Worker 10 read-through research pass, explicitly moving the over-eager live authoritative / `previewBrep` scheduling complaint out of this note's core scope so the remaining bug now tracks only the `Worker 11` presentation-contract failures across `auto / live`, `draft`, `final`, and branch-local visual stability
3. 2026-04-13 20:12:37: Added the next live symptom batch for `draft` and `final`, classifying the disappearing retained sibling in `draft`, the still-transparent settled changed branch in `draft`, and the over-dimmed unchanged sibling in `final` against `Worker 11`, so the bug note now captures concrete contract violations across all three viewport modes instead of only `auto / live`
2. 2026-04-13 20:06:35: Added the first concrete `auto / live` symptom batch from live testing, classifying the click-without-change yellowing, missing affected retained baseline, missing unaffected retained sibling base, and over-eager per-change `previewBrep` / authoritative work against the `Worker 11` contract so the report now distinguishes viewport-presentation violations from the likely separate worker/build-policy violation
1. 2026-04-13 20:00:17: Created this bug note to track the remaining live viewport behavior that may still diverge from the now-explicit `Worker 11` presentation contract, so symptom review can be recorded condition by condition against the agreed `auto / live`, `draft`, `final`, and branch-local visual-stability rules before more Worker 10 or Worker 9 changes are attempted

## Doc Body

### Status

- `[investigating]`

### Summary

This bug note exists to compare the live viewport against `Worker 11`, not to assume one specific root cause yet.

This note is now scoped to viewport-path behavior only.
It does not own live authoritative scheduling, `previewBrep` throttling, or broader worker/build-policy timing unless those behaviors directly appear as a pure viewport presentation symptom.

The question is:

- which viewport behaviors already match the agreed contract
- which behaviors still fail that contract
- which failures belong to already-shipped Worker 10 phases versus later `Phase 3`

### Main Problem

The viewport contract is now explicit in `Worker 11`, but live behavior may still disagree with that contract in one or more states.

That means the next useful debugging step is not to keep patching blindly.
It is to record each observed symptom and check it directly against the `Worker 11` rules first.

### Related Docs

- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
- `docs/CHANGELOG.md`

### Current Contract Baseline

The current agreed contract comes from `Worker 11`.

The most important rules to compare against are:

- branch-local visual stability
  - unchanged siblings stay fully loaded/base
  - the edited branch keeps a dimmed retained baseline underneath
  - only the edited branch gets `previewMesh`
  - unchanged siblings must not flicker, disappear, dim, or turn yellow
- `auto / live`
  - dragging: blue retained base plus yellow changed-only overlay
  - dragging before narrow overlay exists: blue base only
  - after release: accepted current result reads as `lastLoaded`
  - `previewBrep` is an overlay/comparison state, not the normal base
- `draft`
  - idle accepted draft reads as `lastLoaded`
  - settled draft/base still includes the whole loaded scene, including retained siblings
  - only active interaction gets `previewMesh`
- `final`
  - final stays authoritative/base by default
  - no draft-visible leakage
  - `previewBrep` is only an optional comparison state if intentionally allowed

### Symptom Capture Method

For each live symptom we observe, record:

1. the active viewport mode
2. whether interaction is active, settled, or fully complete
3. the exact visible geometry and colors
4. whether that matches or violates the corresponding `Worker 11` condition
5. whether the symptom belongs to:
   - already-shipped Worker 10 work
   - likely `Worker 10 Phase 3`
   - a new viewport bug outside the current Worker 10 scope

### Worker 11 Check Surface

#### Branch-Local Visual Stability

- unchanged sibling stays fully loaded/base
  - status: `[x] violated by current live symptom`
- unchanged sibling avoids yellow preview styling
  - status: `[x] violated by current live symptom`
- unchanged sibling avoids dimmed retained-baseline styling
  - status: `[ ] not yet explicitly checked`
- edited branch keeps visible retained baseline underneath preview
  - status: `[x] violated by current live symptom`
- edited branch alone receives `previewMesh`
  - status: `[x] likely violated by current live symptom`
- unchanged sibling avoids flicker or disappearance
  - status: `[x] violated by current live symptom`

#### `auto / live`

- idle shows committed/base only as `lastLoaded`
  - status: `[ ] unknown`
- active drag shows retained committed base
  - status: `[x] violated by current live symptom`
- active drag shows changed-only yellow `previewMesh`
  - status: `[x] likely violated by current live symptom`
- broad whole-scene yellow fallback stays suppressed when narrowed preview is not ready
  - status: `[x] violated by current live symptom`
- after release, accepted current draft/base returns to `lastLoaded`
  - status: `[ ] unknown`
- when authoritative preview is ready, overlay behavior matches the agreed `previewBrep` rule
  - status: `[ ] out of scope for this viewport-only note unless a pure presentation symptom remains after scheduling is separated`

#### `draft`

- idle accepted draft/base reads as `lastLoaded`
  - status: `[x] likely violated by current live symptom`
- idle settled draft/base includes all loaded objects, including retained siblings
  - status: `[x] violated by current live symptom`
- active drag shows retained draft base
  - status: `[ ] not yet explicitly checked`
- active drag shows changed-only `previewMesh`
  - status: `[ ] not yet explicitly checked`
- broad whole-scene yellow fallback stays suppressed when narrowed preview is not ready
  - status: `[ ] unknown`
- after release, accepted draft/base stays visible as settled base
  - status: `[x] violated by current live symptom`

#### `final`

- idle final shows authoritative/base only as `lastLoaded`
  - status: `[ ] unknown`
- active drag does not leak draft-visible overlay into final
  - status: `[ ] not yet explicitly checked`
- waiting states do not replace final base with draft-visible geometry
  - status: `[x] likely violated by current live symptom`
- optional `previewBrep` comparison only appears if intentionally allowed
  - status: `[ ] unknown`

### Current Known Symptoms

#### Symptom Batch 1 - `auto / live`

1. Clicking a parameter without changing its value can already turn geometry yellow.
   - `Worker 11` check:
     - violates `auto / live` `Condition 2` because yellow `previewMesh` should only appear if changed preview geometry exists
     - violates the branch-local visual-stability rule because unchanged objects should not enter preview styling just from pointer-down with no value change
   - current classification:
     - contract violation
     - belongs to already-promised viewport behavior, not a later optional `Phase 3` comparison state

2. While the user is holding a slider and changing a value, the last committed geometry for the branch being edited disappears.
   - expected by `Worker 11`:
     - the edited branch should keep a visible retained baseline underneath preview
     - that retained baseline may be dimmed, but it should remain blue and visible
   - current classification:
     - contract violation
     - belongs to already-promised branch-local visual stability, not a later `Phase 3` promotion rule

3. While the user is holding a slider and changing a value, the last committed geometry for the branch not being edited also disappears.
   - expected by `Worker 11`:
     - unchanged siblings remain fully loaded/base
     - unchanged siblings stay `100%` blue and stable
     - unchanged siblings must not disappear, dim, flicker, or turn yellow
   - current classification:
     - contract violation
     - belongs to already-promised branch-local visual stability, not a later `Phase 3` comparison or release rule

4. The authoritative / `previewBrep` worker appears to try to compute or commit every slider change while the user drags the value up and down.
   - `Worker 11` check:
     - likely violates the intended `auto / live` story, where active drag is the retained-base-plus-`previewMesh` period and `previewBrep` is a later comparison-ready state after the value settles
     - this is not just a viewport-presentation issue; it points at worker/build-policy timing
   - current classification:
     - intentionally out of scope for this viewport-path bug
     - belongs in a separate worker scheduling / authoritative throttling / build-policy note
     - should not drive the next `Worker 10` viewport fix selection

#### Current Read

The current symptom batches suggest a split:

- Symptoms `1` through `3` are viewport contract violations against already-promised `Worker 11` branch-local and `auto / live` behavior.
- Symptom `4` is not part of this bug's active scope anymore.
  - it looks more like a worker/build-policy problem that the viewport then exposes
  - it should move to a separate follow-on bug rather than continue to blur the viewport-path investigation
- Symptoms `5` through `7` add two more viewport contract failures:
  - `draft` still appears to drop retained sibling completeness and settled-base solidity
  - `final` still appears to dim unchanged siblings even though only the changed branch should carry comparison styling

So the active `Bug 19` scope is now:

- branch-local visibility and styling failures
- settled `auto / live` presentation failures
- settled `draft` presentation and loaded-scene completeness failures
- `final` presentation leakage or over-broad comparison styling

And the active `Bug 19` scope does not include:

- live authoritative scheduling
- per-tick `previewBrep` dispatch policy
- worker throttling or release-policy decisions

### Likely Ownership

- `WK`
- `VR`
- viewport presentation read-through across selector and viewer seams

### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/viewer/Viewer.ts`

### Seam Inspection Order

The next viewport-path debugging pass should inspect `ViewerHost.tsx` in this order so we can isolate which seam is still dropping the `Worker 11` contract.

#### [x] Phase A - Branch-Local Gate Reachability

Primary seam:

- `showsBranchLocalRetainedBaseline` in `src/app/components/ViewerHost.tsx`

Question:

- does the real drag path actually enter the branch-local retained-baseline branch when one extrude is edited in a two-extrude scene

Why first:

- if this gate never opens at the right time, later helper and style work cannot matter

Proof target:

- end-to-end `ViewerHost.test.tsx` proof for active drag on one branch in `auto / live`
- verify the viewer receives a three-layer call instead of the fallback retained/global path

Current finding:

- attempted end-to-end proof still stayed on retained authoritative-only rendering
- the viewer received only:
  - `baseParts = [graph-document-1:authoritative-preview]`
  - `baselineParts = []`
  - `overlayParts = []`
- so the real interaction path did not reach the branch-local retained-baseline layers in that proof setup

Current classification:

- this remains the correct pre-fix read-through result
- the helper-level split logic was still proven separately, but the real `ViewerHost` read-through did not enter that branch until the interaction-time accepted preview fallback landed
- `Phase B` later showed the missing path was a wrong-source gap rather than an unreachable branch-local branch, so `Phase A` is now satisfied for the raw-runtime accepted-preview interaction case

#### [x] Phase B - Rebuilt-Only Overlay Source Availability

Primary seam:

- `currentAcceptedRebuiltPreviewRenderVm` in `src/app/components/ViewerHost.tsx`

Question:

- does the rebuilt-only accepted preview overlay exist early enough during interaction to drive branch-local layering, or is it empty during the first drag churn

Why second:

- the branch-local path currently depends on this source being populated

Proof target:

- two-extrude drag proof showing exactly when rebuilt-only overlay parts first become non-empty
- classify whether the current symptom is a timing gap or a wrong-source gap

Current finding:

- the missing branch-local path was a wrong-source gap
- during active interaction, `ViewerHost.tsx` could still see an empty selector-visible accepted preview bundle/output pair because `acceptedPreviewGraphRevision` did not yet match the current graph revision
- after adding an active-interaction fallback to raw runtime `acceptedPreviewBuildBundle` and `acceptedPreviewBuildOutputs`, the rebuilt-only preview render VM became available early enough to drive branch-local layering
- the new end-to-end two-extrude `ViewerHost` proof now reaches a real three-layer call with:
  - `baseParts = [output-entry:slot-extrude-1:node-extrude-1]`
  - `baselineParts = [output-entry:slot-extrude-2:node-extrude-2]`
  - `overlayParts = [output-entry:slot-extrude-2:node-extrude-2]`

Current classification:

- `Phase B` is now closed
- the rebuilt-only overlay source can be made available during drag if `ViewerHost` falls back to raw runtime accepted preview state while interaction is active
- the next useful seam is now `Phase C`, because the remaining live symptoms are more likely to be in layer assembly choices and per-mode read-through than in this overlay-source availability gap

#### [ ] Phase C - Layer Assembly Read-Through

Primary seam:

- `viewportRenderLayers` assembly in `src/app/components/ViewerHost.tsx`

Question:

- when the branch-local gate is open and overlay parts exist, does `ViewerHost` still choose the wrong retained/draft/final fallback branch instead of the branch-local layer split

Why third:

- this is where the file decides whether to use:
  - branch-local layers
  - retained `auto`
  - retained `draft`
  - retained `final`
  - or the default single-layer fallback

Proof target:

- assert the exact layer payload sent to the viewer for:
  - active `auto / live`
  - settled `draft`
  - active `final`

#### [ ] Phase D - Frozen Interaction Base Integrity

Primary seam:

- `frozenInteractionBaseRef` and its refresh `useEffect` in `src/app/components/ViewerHost.tsx`

Question:

- is the frozen base being captured from the correct pre-edit scene and preserved long enough, or is it being refreshed too early or from the wrong source

Why fourth:

- this seam controls whether the old committed geometry remains available while the preview changes

Proof target:

- verify the frozen base before pointer-down, during active drag, and immediately after release

#### [ ] Phase E - Helper Split Correctness

Primary seam:

- `buildBranchLocalRetainedBaselineLayers(...)` in `src/app/components/ViewerHost.tsx`

Question:

- once the right inputs arrive, does the helper still split stable base parts, dimmed baseline parts, and overlay parts the way `Worker 11` requires

Why fifth:

- this helper is already partly proven, so it should only be revisited after the real path reaches it

Proof target:

- confirm the changed branch alone is dimmed and overlaid while unchanged siblings stay full-base

#### [ ] Phase F - Selector Handoff Audit

Primary seam:

- `selectViewportResultState.ts` inputs consumed by `ViewerHost.tsx`

Question:

- if the viewer seams above are honest, is the selector still handing the viewer the wrong retained base, overlay source, or mode/result-class combination

Why last:

- the current strongest evidence says the main trouble is in `ViewerHost` read-through first, not selector ownership first

Proof target:

- only inspect selector-side inputs after `ViewerHost` proves it cannot satisfy the contract with the inputs it already receives

### Questions To Resolve

1. Which current live symptoms truly violate `Worker 11`, and which ones are already allowed by the contract?
2. Which of symptoms `1` through `3` are true regressions in already-shipped Worker 10 behavior versus proof gaps where the code path is still incomplete in the real app?
3. Which viewport-path symptom should become the next narrow end-to-end proof target in `ViewerHost.test.tsx`?
4. Are symptoms `5` and `6` regressions in already-promised `draft` behavior, or is there still one missing read-through seam after the shipped Worker 10 work?
5. Is symptom `7` a `final`-mode branch-local visual-stability failure, a broader compare-overlay leakage problem, or part of the still-open `Phase 3` final-mode read-through work?
6. Which remaining failures are actually the still-open `Worker 10 Phase 3` surface rather than regressions?
7. Do any remaining viewport symptoms indicate a new selector/runtime truth bug rather than a viewer read-through bug?

### Definition Of Done

- every currently observed viewport symptom is recorded against a specific `Worker 11` condition
- each symptom is classified as:
  - contract match
  - contract violation
  - or still-open `Phase 3` behavior
- the next fix target is chosen from that symptom-by-symptom comparison rather than from a blended general impression

### Symptom Batch 2 - `draft` And `final`

5. In `draft`, when the user changes `Extrude 1`, `Extrude 2` disappears.
   - expected by `Worker 11`:
     - idle or settled draft/base must include all loaded objects, including retained siblings
     - unchanged siblings should stay fully loaded/base and stable
   - current classification:
     - contract violation
     - belongs to already-promised `draft` loaded-scene completeness and branch-local visual stability, not a later optional comparison state

6. In `draft`, when the user changes `Extrude 1` and lets go, the changed geometry stays `50%` transparent instead of returning to solid/base presentation.
   - expected by `Worker 11`:
     - after release, accepted draft/base stays visible as settled base
     - idle accepted draft/base should read as `lastLoaded`
     - settled draft/base should not keep preview-style transparency
   - current classification:
     - contract violation
     - belongs to already-promised settled `draft` presentation, not a later `previewBrep` or promotion-only behavior

7. In `final`, when the user changes `Extrude 1`, both `Extrude 1` and `Extrude 2` go `50%` transparent.
   - expected by `Worker 11`:
     - unchanged geometry should stay `100%` and authoritative/base
     - only changed geometry, if any comparison styling is shown at all, should carry the reduced-opacity comparison treatment
     - `final` should not broadly reclassify the whole scene during one-branch edits
   - current classification:
     - likely contract violation
     - may overlap with the still-open `Worker 10 Phase 3` final-mode read-through surface, but it still directly conflicts with the current `Worker 11` branch-local and `final` rules

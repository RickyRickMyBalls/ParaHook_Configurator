# `Spaghetti-Editor 9` - `Repeat Extrude Retained Output While Building`

## Doc Header

### Doc History
9. 2026-05-20 14:04:09: Added the stable Extrude part-identity follow-up after console proof showed the first compiled Extrude could appear as `extrude` before later being addressed as `extrude#1`; Phase 1 now numbers `Geometry/Extrude` parts from the first operation so retained display, preview preparation, build requests, and worker cache identity do not lose Object 1 when a second Extrude is added.
8. 2026-05-20 13:14:39: Added the new-branch active preview follow-up after user testing showed Extrudes 1 and 2 were visible before typing depth for Extrude 3, then disappeared once the third preview overlay updated; Phase 1 now keeps accepted sibling branches as retained base when the active overlay is a brand-new output branch with no matching baseline key.
7. 2026-05-20 10:28:46: Added the auto final build loop follow-up after console proof showed the worker completed the same `extrude#2` final build repeatedly and the app immediately re-requested it; Phase 1 now guards auto authoritative follow-through once a current authoritative-target bundle has been accepted, even when export-grade authoritative geometry is unavailable.
6. 2026-05-20 10:16:26: Replaced the undo/redo follow-up approach after user testing showed the browser-build interaction wrapper tinted retained geometry blue and still did not settle the second Extrude; Phase 1 now records accepted Extrude commits as real edit-history graph snapshots from before the live node/auto-wire existed, so Undo can remove the committed Extrude instead of leaving it behind.
5. 2026-05-20 09:52:26: Added the undo/redo follow-up repair to Phase 1 after testing showed the two Extrudes load correctly after history replay; `ViewerHost` now brackets active Extrude command sessions as browser build interactions so `OK`/`Cancel` releases the interaction and promotes any staged final result instead of leaving `Building Final...` stuck.
4. 2026-05-20 09:15:28: Repaired the Phase 1 implementation after screenshot proof showed the first Extrude still disappeared after `OK`; retained committed final base rendering now falls back to the raw accepted `OutputPreview` artifact VM when the graph revision has advanced for the second Extrude and the committed geometry result has no standalone mesh preview.
3. 2026-05-20 09:04:52: Implemented and closed `Spaghetti-Editor 9 / Phase 1 - Retain Existing Output Entries During Repeat Extrude` after the A/D/F viewport result selector gained retained output-overlap matching for additive repeat-Extrude output slots, preserving already visible first-output renderables while a new output entry is pending and keeping explicit `SolidBody:*` subset dependency breaks intact.
2. 2026-05-20 08:19:45: Prepped `Spaghetti-Editor 9 / Phase 1 - Retain Existing Output Entries During Repeat Extrude` for implementation by narrowing the first code cut to selector-first retained output-entry overlap proof, preserving explicit member-publication dependency-break behavior, and adding a store-level repeat-Extrude regression only if the selector proof cannot cover the real slot-widening path.
1. 2026-05-20 08:00:24: Created this future plan after a read-only investigation of the repeat-Extrude viewer unload report, grounding the first phase in retained output-entry continuity while a second Extrude build is pending and separating that fix from broader worker-runtime rewriting.

### Purpose

Use this doc to fix the user-visible repeat-Extrude failure where the first accepted Extrude appears to unload when the user creates a second Extrude and the second build is still pending or stuck.

The target behavior is simple:
- the first accepted Extrude should remain visible while the second Extrude is being built
- adding a new output preview slot should not blank already-built output entries
- worker supersession should remain allowed, but the viewport should keep honest retained geometry when still-valid outputs are waiting for newer outputs

### Scope

This plan covers:
- retained output display while repeat Extrude adds a new `OutputPreview` slot
- viewport selector behavior for partial output continuity
- build/request tests that prove the second build can be pending without hiding the first result
- focused worker diagnostics only if the second build truly stalls after retention is fixed

This plan does not cover:
- rewriting the worker scheduler
- replacing the draft/final architecture from `Spaghetti-Editor 6`
- changing Extrude node semantics or profile selection rules
- changing the `OutputPreview` slot model beyond what is needed to retain already-built visible output
- Build Path history UI

## Doc Body

### Summary

The current symptom reads like a worker problem, but the first code read points to a viewport retention gap.

The worker intentionally supersedes older builds for the same `projectFileId::graphDocumentId`. That is normal. The visible problem is that adding a second Extrude changes the current `OutputPreview` candidate set from one output to two outputs. The viewport retention check then treats the previous accepted result as no longer matching the current output shape, so the first accepted result can be cleared before the second build has produced anything renderable.

This phase should make retention entry-aware instead of all-or-nothing:
- keep retained geometry for output entries whose current graph output still points at the same source part
- show pending/missing state only for the new output entry
- replace the full visible set when the matching newer build result arrives

### Current Grounding

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `wireAcceptedExtrudeCommandToOutputPreview(...)` wires accepted live Extrudes into the first open `System/OutputPreview` solid slot.
  - `acceptExtrudeCommandSession(...)` commits the live Extrude node, writes durable params, wires the output, then advances graph revision.
  - `normalizeGraphForStoreCommit(...)` ensures there is a trailing open output slot.
  - `stageGraphBuildRequest(...)` records the in-flight build identity for the current graph revision.
  - `acceptGraphBuildResult(...)` accepts only the current in-flight result and updates accepted preview/final artifacts.
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - `doesCurrentOutputMatchGeometryResultPartKeys(...)` currently compares the whole current output candidate part-key set to the accepted result part-key set.
  - when the current output has two part keys and the accepted result has one, retention can fall to `cleared-by-dependency-break`.
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
  - output preview entries become build-unit ids.
  - repeat Extrude creates another output entry, so the second build request may target the widened output set.
- `src/worker/worker.ts`
  - worker supersession is keyed by `projectFileId::graphDocumentId`.
  - a newer build request superseding an older same-graph request is expected behavior.
- `src/worker/pipeline/buildPipeline.ts`
  - the long geometry call happens before the next supersession checkpoint, so a slow or stuck second build can leave the app waiting.

### Boundary Rules

- Do not keep stale geometry if the source output is genuinely broken or rewired away from the retained source.
- Do keep retained geometry when the current output still includes an already-accepted output entry and only adds a new pending output.
- Treat retention at the output-entry level, not only at the whole graph/output-set level.
- Do not mark the new Extrude as ready until its own output entry has a renderable artifact or geometry result.
- Do not relax stale build identity gates.
- Do not allow an older worker result to overwrite a newer graph revision.
- Do not hide a real worker stall behind retained geometry; add diagnostics once retention no longer blanks the scene.

### Acceptance Read

This plan is done when:
- first Extrude remains visible after accepting a second Extrude while the second build is still pending
- the viewport can represent "one retained output, one pending output" instead of blanking the whole scene
- stale worker results remain rejected
- focused tests cover repeat Extrude output-slot widening and pending second builds
- if the second build still stalls, diagnostics identify the worker stage instead of making the first Extrude disappear

## Vision

Repeat Extrude should feel like normal CAD modeling: each accepted operation adds to the visible model without making earlier accepted bodies vanish while the next body is still calculating.

The graph remains the source of truth. The viewer is allowed to retain previously accepted renderable output only as a downstream display continuity behavior, not as a new geometry owner.

## Wishlist Organization

### High Level Goals

- [ ] `Spaghetti-RetainedOutput-HLG-1. The first accepted Extrude should stay visible while a second Extrude is being built.`
- [ ] `Spaghetti-RetainedOutput-HLG-2. Adding a new OutputPreview slot should not clear already-built output entries that still match the current graph.`
- [ ] `Spaghetti-RetainedOutput-HLG-3. If the worker is actually stuck on the second Extrude, the app should expose that as a pending or diagnostic state instead of unloading the first result.`

### Codex Level Goals

- [x] CLG 1. Prove the repeat-Extrude repro at selector/store level with one accepted output and one newly pending output.
- [x] CLG 2. Refine viewport retained-result matching from all-or-nothing part-key equality to output-entry continuity where safe.
- [x] CLG 3. Preserve worker/build identity gates while making visible retention less brittle.
- [x] CLG 4. Add focused diagnostics or progress proof only after retained display continuity is fixed.

### `Spaghetti-Editor 9 / Phase 1`

- [x] Add a focused failing test for first Extrude retained while second Extrude output is pending.
- [x] Update viewport result selection so retained base can include matching current output entries even when new output entries are pending.
- [x] Keep stale build-result rejection behavior unchanged.
- [x] `HLG 1. The first accepted Extrude should stay visible while a second Extrude is being built.`
- [x] `HLG 2. Adding a new OutputPreview slot should not clear already-built output entries that still match the current graph.`

### `Spaghetti-Editor 9 / Phase 2`

- [ ] Add worker/build progress diagnostics if the second Extrude still stalls after the retention fix.
- [ ] Verify worker supersession remains graph-scoped and does not suppress unrelated graph builds.
- [ ] Add a visible pending-state test if the second output entry has no renderable artifact yet.
- [ ] `HLG 3. If the worker is actually stuck on the second Extrude, the app should expose that as a pending or diagnostic state instead of unloading the first result.`

## [x] `Spaghetti-Editor 9 / Phase 1` - `Retain Existing Output Entries During Repeat Extrude`

### Phase 1 Summary

#### Purpose

Keep already accepted Extrude output visible while a new repeat Extrude adds another output preview slot and waits for its build result.

#### Owns

- selector/store proof for the repeat-Extrude unload symptom
- retained output-entry continuity for current outputs that still match accepted geometry
- pending second-output behavior while the new build is in flight
- focused regression coverage around `OutputPreview` slot widening

#### Does Not Own

- changing the worker supersession model
- adding new Extrude modes
- changing profile picking or command accept behavior
- Build Path projection
- export behavior

#### Current Live Read

The first accepted Extrude is likely cleared because the current output candidate set widens from one part key to two part keys after the second Extrude commit. The viewport selector currently asks whether the entire current output candidate set equals the accepted result part-key set. That is too strict for additive output authoring.

The critical behavior lives in `src/app/spaghetti/selectors/selectViewportResultState.ts`:
- `hasCurrentOutputContinuation(...)` only checks that some current output slot still has a valid source.
- `doesCurrentOutputMatchGeometryResultPartKeys(...)` then requires the current preview candidate part-key set and the committed retained geometry part-key set to have the same size and membership.
- `resolveRetainedBaseCandidate(...)` clears retained final or draft geometry as `cleared-by-dependency-break` when that whole-set match fails.

That whole-set test is correct for real dependency breaks, but it is too strict for additive output authoring where the first output still exists and only the second output is new and pending.

The first implementation should prove the failure without depending on full browser interaction:
- build a current preview-preparation state with two output slots
- provide an accepted result/render bundle for only the first slot
- assert the selector keeps the first slot visible and marks the second slot as pending/unavailable rather than returning no visible geometry

#### First Pass Decisions

- Prefer output-entry or slot-entry continuity over coarse whole-output equality.
- Keep the initial production change inside the selector unless the real slot-widening flow cannot be represented there.
- Keep exact stale-result gates in `useSpaghettiStore` unchanged.
- Do not retain geometry if the current source part key no longer appears in the output preparation or if the current output explicitly switched to `SolidBody:*` subset publication.
- Do not make retained geometry the source of graph truth; it is only display continuity.
- Preserve `Final` and `Draft` mode honesty: retained geometry may be visible as retained display, but a new pending output is not final or draft-ready until its own build result exists.
- Treat Phase 1 as successful if it fixes the visible unload while leaving worker supersession behavior untouched.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a focused selector regression in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` that models repeat Extrude output widening:
   - current `previewPreparation.previewCandidatePartKeys` includes `extrude` and `extrude#2`
   - current `previewPreparation.sourceEntriesBySlotId` has one entry for the already-built first Extrude and one entry for the new pending second Extrude
   - accepted retained geometry/result inputs contain only the first Extrude part key and a renderable VM for that first output
   - the selector returns a visible retained base instead of `visibleSourceKind = none`
2. Add or refine a narrow helper near `doesCurrentOutputMatchGeometryResultPartKeys(...)`.
   - likely shape: `doesCurrentOutputRetainGeometryResultPartKeys(...)`
   - it should return true when every retained geometry result part key still appears in the current output candidate set, even if the current output candidate set has additional pending part keys
   - it must still return false for explicit `SolidBody:*` subset publication via the existing `hasExplicitSolidBodyMemberPublication(...)` guard
3. Use the overlap helper only in the retained-base path.
   - keep exact current-result visibility checks strict
   - do not let a retained old result masquerade as a complete current result
4. Preserve the existing full equality helper or rename it only if that keeps the code clearer.
   - if the equality helper is still needed elsewhere, leave it as-is and add the overlap helper next to it
5. Add a store-level repeat Extrude regression only if the selector test cannot cover the actual `OutputPreview` slot-widening behavior.
   - if added, it should create/accept first Extrude, stage/accept its build result, accept second Extrude, and prove the selected viewport state still has retained first-output renderable parts before the second build result arrives

#### Likely Files

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule

Do not edit worker scheduling in Phase 1 unless the selector/store proof shows retained output continuity is already correct and the disappearance is only caused by worker result handling.

Do not change Extrude command accept semantics. The second Extrude should still create and wire a normal graph-authored `Geometry/Extrude` node.

#### Implementation Risks

- Retaining too broadly could show stale output after a real dependency break.
- Matching only by coarse part key may be too weak when split/member publications are involved.
- Existing tests intentionally clear retained geometry for explicit `SolidBody:*` subset publication; Phase 1 must preserve that safety rule.
- A selector-only fix may not reproduce the full app state if accepted preview bundles and geometry results diverge; add store coverage if that happens.
- A store-level regression may need lightweight build-result fixtures rather than real worker execution to stay fast and deterministic.

#### Checklist

- [x] Add repeat-Extrude pending-output retention regression.
- [x] Keep explicit `SolidBody:*` subset dependency-break tests passing.
- [x] Keep stale authoritative/draft result rejection behavior unchanged.
- [x] Verify the first accepted output remains visible while the second output is pending.
- [x] Avoid worker scheduling changes unless selector/store proof shows the unload is not retention-owned.
- [x] Update `docs/CHANGELOG.md` because runtime/test code changes shipped.
- [x] Update this doc, `Spaghetti-Editor-index.md`, and `docs/Doc-Log.md` when Phase 1 ships.

#### Verification Shape

Run focused tests around:
- viewport result state retention
- preview render VM output-entry mapping
- Spaghetti store build acceptance/staging if touched

Suggested command:

```text
npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts
```

#### Done Shape

The repeat-Extrude visible model no longer goes blank just because the graph gained a second pending output. The user can see the first accepted body while the second body builds.

#### Implementation Result

Phase 1 shipped as a selector-owned A/D/F retention fix.

`src/app/spaghetti/selectors/selectViewportResultState.ts` now keeps the existing full output-set equality helper for current-result matching, while adding a separate retained-output overlap helper for retained base selection. That overlap path is deliberately narrower than "show anything old": it only allows retention when every retained geometry result part key still appears in the current output candidate set, and it still refuses explicit `SolidBody:*` subset publication through the existing dependency-break guard.

The new selector regression models repeat Extrude by giving the current `OutputPreview` two slots, one renderable first Extrude output and one pending second Extrude output. The selector now keeps a visible first-output renderable and preserves the retained final base instead of returning an empty visible result. Existing explicit member-publication dependency-break tests remain covered.

The screenshot follow-up showed a second retained-render path: after `OK`, the current graph revision advances, so the normal accepted-preview selectors intentionally hide prior accepted `OutputPreview` artifacts because they no longer match the current revision. In the real app, the committed final geometry can still be the truth owner while its renderable mesh comes from the accepted `OutputPreview` artifact bundle rather than `meshPreview`. `ViewerHost` now keeps a raw accepted preview VM available for retained base rendering, and the viewport selector uses that VM as the committed final render fallback when the committed geometry result has no standalone mesh preview.

The first undo/redo follow-up showed the graph and worker result data were valid, because history replay made both Extrudes appear correctly. A browser-build interaction wrapper in `ViewerHost` was tested and removed because it tinted the retained first Extrude as an active preview layer and did not fix the post-`OK` stuck state.

The corrected follow-up moved the ownership to the graph command history path. `acceptExtrudeCommandSession()` now records an edit-history entry for successful Extrude accepts. Its undo snapshot is captured by rolling back the live Extrude command graph before accept, so it represents the state before the live Extrude node and auto-wires existed. Its redo snapshot is the accepted graph after durable depth params and `OutputPreview` wiring. That makes Undo erase the last committed Extrude operation instead of leaving the live node/auto-wire behind.

The console loop follow-up showed the worker was not hanging: each final-target build completed, then auto mode immediately requested another final build for the same graph revision. The auto follow-through guard now treats a current accepted authoritative-target build bundle as a completed auto final attempt, even when `acceptedAuthoritativeGeometryResult` is still unavailable for export. That stops the viewport from spamming repeat final builds after `extrude#2: done` / `cache_hit` and leaves explicit export authority checks to the export path.

The new-branch live preview follow-up showed a separate layer-composition issue. Branch-local preview layering only created a retained baseline recipe when the overlay viewer key matched one of the already accepted sibling keys. That was correct for rebuilding Extrude 2, but wrong for adding Extrude 3: the new preview key had no matching baseline key, so the selector fell through to showing only the new overlay. The layer recipe now falls back to retained base plus overlay when accepted sibling parts exist and the active overlay is a brand-new branch.

The stable identity follow-up found the root naming drift behind the user's latest "first Extrude is still not showing" console log. A single Extrude compiled as `extrude`, but once another Extrude existed the same first operation was addressed as `extrude#1`; that rename could make retained viewport output and worker result entries disagree about the same object. `compileGraph` now treats `Geometry/Extrude` like the other numbered part families and emits `extrude#1` from the first operation, so the first Extrude keeps its identity before and after later Extrudes are added.

The follow-up also aligned direct compiler, build-request, preview-preparation, and preview-render VM expectations with that stable numbered identity. The focused preview-render pass refreshed the existing `topologyPreview: null` viewer-part snapshot shape so the VM contract matches runtime output.

#### Verification Result

- Passed: `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Passed after screenshot follow-up: `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Passed after screenshot follow-up: `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not render branch-local yellow draft overlay"`
- Passed after undo/redo follow-up: `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "confirms the Extrude command toolbar by accepting the live graph node"`
- Passed after undo/redo follow-up: `npm.cmd test -- src/app/store/useAppStore.test.ts -t "keeps auto authoritative follow-through scoped"`
- Passed after edit-history follow-up: `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "confirms the Extrude command toolbar by accepting the live graph node"`
- Passed after edit-history follow-up: `npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts -t "Extrude"`
- Passed after edit-history follow-up: `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Passed after auto-loop follow-up: `npm.cmd test -- src/app/store/useAppStore.test.ts -t "auto authoritative follow-through"`
- Passed after auto-loop follow-up: `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "confirms the Extrude command toolbar by accepting the live graph node"`
- Passed after auto-loop follow-up: `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Passed after new-branch preview follow-up: `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Passed after new-branch preview follow-up: `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "confirms the Extrude command toolbar by accepting the live graph node"`
- Passed after new-branch preview follow-up: `npm.cmd test -- src/app/store/useAppStore.test.ts -t "auto authoritative follow-through"`
- Passed after stable identity follow-up: `npm.cmd test -- --run src/app/spaghetti/compiler/compileGraph.test.ts`
- Passed after stable identity follow-up: `npm.cmd test -- --run src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- Passed after stable identity follow-up: `npm.cmd test -- --run src/app/spaghetti/previewPreparation.test.ts src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- Passed after stable identity follow-up: `npm.cmd test -- src/app/store/useAppStore.test.ts -t "auto authoritative follow-through"`
- Passed after stable identity follow-up: `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "confirms the Extrude command toolbar by accepting the live graph node"`
- Full `npm.cmd test -- --run src/app/components/ViewerHost.test.tsx` timed out in this workspace before returning results.
- Passed: `npm.cmd run build`

## [ ] `Spaghetti-Editor 9 / Phase 2` - `Second Build Pending Diagnostics`

### Phase 2 Summary

#### Purpose

After retained display continuity is fixed, determine whether the second Extrude build is actually stuck and expose the pending/failure point clearly.

#### Owns

- focused worker/build-progress diagnostics for the second Extrude request
- proof that same-graph supersession behaves as intended
- visible pending-state honesty for an output entry that has not produced geometry yet

#### Does Not Own

- worker architecture rewrite
- replacing draft/final policy
- export or Build Path work

### Phase 2 Implementation Spec

#### Exact First Code Cut

Start with tests and instrumentation around the existing build identity path:
- prove the second Extrude request is issued with the expected target build units
- prove older same-graph requests can be superseded without clearing accepted visible output
- if the second build fails, surface whether it fails in compile, request translation, worker pipeline, model build, artifact emission, or result acceptance

#### Likely Files

- `src/app/store/builds/appStoreBuildRequests.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- related worker and build dispatcher tests

#### No-Widening Rule

Do not add new scheduling policy until the retained-output fix proves the remaining issue is really worker-side.

#### Done Shape

If the second build is slow, the app keeps showing retained output and indicates pending work. If the second build fails, the failure owner is visible enough to plan the next narrow repair.

# Edit History Gen3-3 - Advanced Build Path Comparison

## Doc Header

### Doc History
3. 2026-04-22 10:44:55: Manager accepted `Edit-History-Gen3-3 / Phase 1 - Live Build Path Surface And Comparison Readiness Proof` as a deferred no-current-scope closeout after the Worker and Manager source scans found no live Build Path product surface/store/playhead/comparison UI, marked `Edit-History-Gen3-CLG-3` and `Edit-History-Gen3-HLG-3` complete for current planning scope, and kept runtime Build Path comparison blocked until a future family creates a live surface.
2. 2026-04-22 10:44:02: Tightened Phase 1 as a prep-only Build Path comparison readiness proof, recording the live re-scan requirement, current absence of a Build Path surface/store/playhead, adjacent derived build/viewport proof seams, future verification gates, and continued deferral of runtime comparison work until a live surface exists.
1. 2026-04-22 09:52:07: Created this Gen 3 future planning surface for advanced Build Path comparison, branch/variant comparison, and playhead/navigation exclusions after Gen 1 derived-reader proof found no live Build Path surface.

### Purpose

This doc plans advanced Build Path and variant comparison as derived readers over canonical authored history.

## Doc Body

### Owns

- advanced Build Path comparison planning after a live Build Path surface exists
- branch, variant, and checkpoint comparison semantics where they read canonical authored state
- playhead/navigation exclusion rules for Build Path-like surfaces
- proof that comparison readers do not become competing undo owners

### Does Not Own

- creating a Build Path workspace in setup
- making Build Path a canonical undo owner
- checkpoint/snapshot storage owned by Gen3-2
- history reader panel owned by Gen3-1
- Gen 2 durable setting/content undo, Browser/project runtime work, Viewer Transform runtime work, Catalog/Pubwheel, command transcript/recall, runtime/cache/provider state, persistence architecture, or collaboration/multiplayer unless promoted

### Acceptance Read

This candidate is implementation-ready only after a live Build Path surface exists and exposes stable reader/playhead/comparison seams that can be proven derived from canonical authored state.

### No-Widening Rule

Do not create Build Path UI, a Build Path store, comparison state, branch storage, checkpoint storage, or a second undo stack during setup. Advanced comparison must stay derived from canonical authored truth and accepted checkpoint/branch semantics.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen3-HLG-3` - Plan advanced Build Path comparison and variant comparison only after a live Build Path surface exists and stays derived from canonical authored truth.

### Codex Level Goals

- [x] `Edit-History-Gen3-CLG-3` - Define advanced Build Path comparison ownership, live-surface prerequisites, variant comparison semantics, and playhead/navigation exclusions before implementation.

## [x] Edit-History-Gen3-3 / Phase 1 - Live Build Path Surface And Comparison Readiness Proof

### Phase 1 Summary

Purpose:
- keep advanced Build Path comparison downstream from canonical authored state
- re-scan for a live Build Path component/store/playhead/comparison surface before any implementation starts
- preserve playhead/navigation as local reader state unless a future authored commit action is explicitly introduced
- keep the phase proof-only/deferred while the app has only adjacent derived build/viewport selector evidence

Owns:
- readiness routing for Build Path comparison after the live surface exists
- comparison candidate routing for current state, checkpoints, branches, and variants
- no-entry/no-redo-invalidation proof for playhead/navigation state once a playhead seam exists
- adjacent confirmation that current build/viewport readers are derived from canonical authored state, not competing undo owners

Does not own:
- creating the Build Path surface
- checkpoints/snapshots/branch storage before Gen3-2 semantics are accepted
- history panel UI
- making Build Path a second undo owner
- build worker/progress/cache/provider runtime history
- playhead-as-authored-undo semantics
- comparison UI before reader truth and checkpoint/branch semantics are available

Current known seams:
- `src/app/store/buildPathDerivedSync.test.ts` currently proves adjacent derived build/viewport reader behavior over canonical authored undo/redo, build runtime progress no-entry behavior, and scrub-like transform navigation no-entry behavior.
- `src/app/components/buildViewportResultSelectorOptions.ts` and `src/app/spaghetti/selectors/selectViewportResultState.ts` are current derived build/viewport selector seams.
- `src/app/store/buildStatsStore.ts` is build runtime/progress state and remains excluded from canonical history.
- Source re-scan for `Build Path` / `BuildPath` / `buildPath` finds no live Build Path workspace surface, product store, playhead, or comparison UI in `src/app`; the `ReferenceTimelineGraph.tsx` `buildPath` helper is an SVG path function, not the Build Path product surface.

First-pass decisions:
- Phase 1 should remain docs/proof-only and deferred while there is no live Build Path surface.
- A future proof implementation may re-run/extend `src/app/store/buildPathDerivedSync.test.ts` only as adjacent confirmation; that proof does not by itself create a Build Path comparison feature.
- If a live Build Path surface appears, the first implementation should prove it reads canonical authored state and that playhead/navigation movement creates no canonical entries and preserves redo.
- Advanced comparison may read checkpoints/branches only after Gen3-2 restore/storage semantics are accepted.

### Phase 1 Implementation Spec

Exact first proof cut:
- Before any approved implementation, re-scan `src/app` for live Build Path component/store/playhead/comparison seams using names such as `Build Path`, `BuildPath`, `buildPath`, playhead, comparison, variant, and the current workspace surface registry.
- If still absent, keep Phase 1 docs/proof-only and deferred; do not create source/tests solely to invent a Build Path surface.
- If present, add a focused proof that canonical authored undo/redo changes the Build Path reader output while Build Path playhead/navigation movement creates no canonical entries and preserves redo.
- If only adjacent derived seams exist, proof may cite or extend `src/app/store/buildPathDerivedSync.test.ts`, `src/app/components/buildViewportResultSelectorOptions.test.ts`, and `src/app/spaghetti/selectors/selectViewportResultState.test.ts` as confirmation that current build/viewport readers are derived, not as acceptance of a live Build Path comparison surface.
- Do not implement comparison UI until live reader truth and playhead exclusion are proven.

Likely files:
- future live Build Path component/store/test files once they exist
- `src/app/store/buildPathDerivedSync.test.ts`
- `src/app/components/buildViewportResultSelectorOptions.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- current workspace surface registry files only if a real Build Path surface is later added by another approved family phase
- this phase doc, `docs/CHANGELOG.md` for proof/runtime implementation, and `docs/Doc-Log.md`

No-widening rule:
- Do not create Build Path UI, a Build Path store, checkpoint/branch storage, comparison UI, build worker/cache/provider ownership, playhead-as-authored-undo, or any second history owner.
- Do not widen into Gen3-1 reader UI, Gen3-2 checkpoint/snapshot ownership, Gen2 runtime settings/content, Browser/project content undo, Viewer Transform runtime work, Catalog/Pubwheel, command transcript/recall, persistence architecture, or collaboration/multiplayer.

Focused verification guidance:
- focused Build Path reader tests once a live surface exists
- focused no-entry/redo tests for playhead/navigation movement once a playhead seam exists
- `npm.cmd test -- --run src/app/store/buildPathDerivedSync.test.ts` if the proof uses current adjacent derived evidence
- focused derived build/viewport selector regressions only if reused:
  - `npm.cmd test -- --run src/app/components/buildViewportResultSelectorOptions.test.ts`
  - `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd run build`

Build gate:
- Required for runtime/proof implementation. Not required for docs-only setup.

Tracking docs:
- Runtime/proof implementation must update `docs/CHANGELOG.md`.
- Any docs closeout must update this doc and `docs/Doc-Log.md`.
- Manager handles Gen3 index and run-state acceptance/status.

Stop conditions:
- Stop if implementation requires creating the Build Path surface, adding checkpoint/branch storage, changing build worker/cache/provider ownership, or turning playhead navigation into authored undo.
- Stop if comparison depends on checkpoints/branches before Gen3-2 defines their restore semantics.
- Stop if the only available evidence is the existing derived build/viewport selector proof and no live Build Path product surface exists; in that case keep the phase deferred.

Done shape:
- While no live Build Path surface exists, the phase is not implementation-ready and should remain deferred with this prep as the current routing record.
- Once a live surface exists, the phase is done when that surface is proven derived from canonical authored state, its playhead/navigation state is proven no-entry and redo-preserving, and comparison prerequisites are explicit.
- `Edit-History-Gen3-CLG-3` can be recommended complete only after live-surface readiness and comparison boundaries are proven, or after Manager explicitly accepts the absence of a live surface as a deferred/no-current-scope closeout.

Acceptance mapping:
- Advances `Edit-History-Gen3-HLG-3`.
- Does not advance history reader UI or checkpoint/branch storage goals except as dependencies.

Recommended next Manager action:
- Manager accepted this phase as a deferred no-current-scope closeout because no live Build Path product surface exists.
- Runtime Build Path comparison remains blocked until a future approved family phase creates a live Build Path surface and the first proof can show it reads canonical authored state while playhead/navigation remains no-entry and redo-preserving.
- Existing adjacent derived build/viewport proof remains useful evidence, but it is not a Build Path comparison implementation.

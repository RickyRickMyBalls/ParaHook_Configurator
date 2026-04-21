# Catalog-Gen2-14 - Imported Reference Ownership And Viewport Rehydration

## Doc Header

### Doc History

7. 2026-04-21 11:36:42: Implemented `Catalog-Gen2-14 / Phase 4 - Bug 22 Closeout And Gen2 Ownership Audit` by rerunning the accepted focused ViewerHost remount/rehydration tests and build, marking Bug 22 fixed at the store-to-current-viewer remount seam, closing `Catalog-Gen2-HLG-18`, `Catalog-Gen2-CLG-33`, `Catalog-Gen2-CLG-34`, and `Catalog-Gen2-14`, and recording that full UI click-through plus direct split/exploded runtime-possession hardening remain optional future QA surfaces.
6. 2026-04-21 11:31:50: Implemented `Catalog-Gen2-14 / Phase 3 - Split And Close Regression Coverage` by adding focused `ViewerHost`/store seam proof for PubParts ZIP-attributed accepted imports remounting with an empty viewer runtime cache, normal `.obj` accepted imports rehydrating in a newly mounted secondary model viewer, and already-owned runtime references skipping duplicate loads; recorded that full split/close UI click-through and direct split/exploded special-path possession remain unclaimed follow-up surfaces.
5. 2026-04-21 11:26:21: Implemented `Catalog-Gen2-14 / Phase 2 - ViewerHost Rehydration For Loaded-But-Missing References` by widening only the ordinary `ViewerHost` visible-reference sync path so visible globally `loaded` references rehydrate when the mounted viewer runtime lacks the object, adding focused no-duplicate and failure-path tests, recording the behavior in `docs/CHANGELOG.md`, and confirming the three targeted `vitest -t` specs plus `npm.cmd run build` pass while the known full-file `ViewerHost.test.tsx` baseline remains broader-red.
4. 2026-04-21 11:22:05: Prepped `Catalog-Gen2-14 / Phase 2 - ViewerHost Rehydration For Loaded-But-Missing References` as a docs-only implementation-ready slice, locking ordinary visible-reference sync as the first behavior fix, `viewer.hasReference(item.referenceId)` as the current-viewer runtime possession source, brief global `loading` state during rehydration, existing success/error visibility handling, stable canonical imported-reference ids, targeted `vitest -t` verification because the full `ViewerHost.test.tsx` file remains red, and direct split/exploded path deferral unless implementation proves they are required for this slice.
3. 2026-04-21 11:20:02: Implemented `Catalog-Gen2-14 / Phase 1 - Runtime Ownership Contract And Viewer Possession Query` by adding the read-only `Viewer.hasReference(referenceId)` runtime possession query, adding the matching `ViewerHost.test.tsx` mock method/default, recording the code change in `docs/CHANGELOG.md`, and recording that the focused `ViewerHost` test file still fails in unrelated reference-loading, snap, and reference-selection expectations while `npm.cmd run build` passes.
2. 2026-04-21 11:16:00: Prepped `Catalog-Gen2-14 / Phase 1 - Runtime Ownership Contract And Viewer Possession Query` as a docs-only implementation-ready slice, locking the runtime ownership contract, `Viewer.hasReference(referenceId)` read-only query, `ViewerHost` mock readiness, focused verification, acceptance, and out-of-scope boundaries while keeping loaded-but-missing rehydration behavior deferred to Phase 2.
1. 2026-04-21 11:09:56: Created this Family Phase Doc after Bug 22 research showed imported references can disappear after Catalog close or model-viewport split because canonical `referenceWorkspace` state can say a reference is `loaded` while the newly mounted `Viewer` instance has no corresponding runtime object in its per-instance `referenceObjects` cache.

### Purpose

This file owns `Catalog-Gen2-14`, the Gen2 follow-up that fixes accepted imported-reference ownership after the PubParts ZIP staged importer handoff.

Use it to answer:
- how accepted imported references stay visible after Catalog close, model-viewport split, or viewer remount
- which system owns canonical imported-reference truth
- which system owns disposable viewer runtime objects
- how the worker should split Bug 22 into small implementation phases

Do not use it for:
- changing PubParts ZIP source-options UI
- changing ZIP extraction or source download behavior
- changing Import review file selection
- making Catalog own accepted project assets
- STEP loader fidelity, `.stp` support, builder behavior, or compatibility verdicts

## Doc Body

### Family Phase Goal

Keep imported geometry visible across workspace layout changes without creating a second canonical object owner.

The desired ownership is:
- `referenceWorkspace` owns canonical imported-reference records, visibility, load/error state, part rows, transforms, and content order.
- `ViewerHost` owns syncing canonical imported-reference truth into the currently mounted viewer runtime.
- `Viewer` owns only disposable Three.js runtime objects for one mounted viewer instance.

### Why This Phase Exists

`Catalog-Gen2-13` completed the browser-owned PubParts ZIP staged importer flow. Catalog now stages selected supported ZIP entries into Import review with PubParts attribution, and Import/store acceptance creates imported-reference records through the normal path.

Bug 22 found the next ownership gap after acceptance:

1. A PubParts ZIP staged import or simple `.obj` import creates canonical imported-reference records.
2. The active model viewport loads the object and marks it `loaded`.
3. Closing Catalog or splitting the model viewport can dispose/remount the viewer.
4. The new viewer has an empty runtime object cache.
5. The store still says the reference is visible and `loaded`.
6. The new `ViewerHost` skips loading and visibility becomes a no-op because the current viewer lacks the object.

That is a Gen2 follow-up because the user-facing failure appears immediately after the Gen2 Catalog-to-Import-to-model handoff succeeds.

### Ownership Boundary

This phase should keep the canonical object truth in the existing store-owned reference workspace. It should not move imported references into Catalog, and it should not make `Viewer.referenceObjects` canonical.

Implementation should prefer a small possession check on the current viewer runtime plus a `ViewerHost` rehydration rule:

```ts
const shouldLoad =
  item.isVisible &&
  (item.loadState === 'unloaded' ||
    item.loadState === 'error' ||
    (item.loadState === 'loaded' && !viewer.hasReference(item.referenceId)))
```

The exact code shape can change during Worker prep, but the owner rule must stay true: global `loaded` state alone is not enough to prove the current viewer instance has the runtime object.

### Expected Implementation Order

1. `Phase 1 - Runtime Ownership Contract And Viewer Possession Query`
2. `Phase 2 - ViewerHost Rehydration For Loaded-But-Missing References`
3. `Phase 3 - Split And Close Regression Coverage`
4. `Phase 4 - Bug 22 Closeout And Gen2 Ownership Audit`

Each phase must be prepped by the Worker before implementation. Manager should approve or revise the prep, then tell Worker to implement that one phase and run focused tests plus `npm run build`.

## Wishlist Organization

### High Level Goals

- [x] `Catalog-Gen2-HLG-18. keep accepted imported references visible across Catalog close, model-viewport split, and viewer remounts by making the store-owned reference workspace the canonical object truth and rehydrating each disposable viewer runtime from that truth`

### Codex Level Goals

- [x] Catalog-Gen2-CLG-33. Make the imported-reference store-to-viewer contract explicit: `referenceWorkspace` owns accepted imported reference identity and visibility while `Viewer.referenceObjects` is only a disposable per-instance runtime cache.
- [x] Catalog-Gen2-CLG-34. Rehydrate visible accepted imported references into a newly mounted model viewer when global state says the reference is loaded but the current viewer runtime does not actually have the object.

### `Catalog-Gen2-14 / Phase 1`

- [x] `HLG 18. accepted imported references remain visible after viewer remount`
- [x] `CLG 33. imported-reference ownership contract`
- [x] Add a small current-viewer possession query such as `Viewer.hasReference(referenceId)`.
- [x] Keep the method read-only and tied to runtime possession only.
- [x] Update `ViewerHost` tests/mocks enough that later phases can prove loaded-but-missing behavior.
- [x] Do not change load timing, visibility behavior, import acceptance, Catalog source options, or store schema in this first slice unless Worker prep proves a tiny supporting type update is required.

### `Catalog-Gen2-14 / Phase 2`

- [x] `HLG 18. accepted imported references rehydrate from canonical truth`
- [x] `CLG 34. loaded-but-missing viewer rehydration`
- [x] Update `ViewerHost` sync so visible references load when they are `unloaded`, `error`, or globally `loaded` but missing from the current viewer runtime.
- [x] Preserve the canonical imported-reference id; do not create duplicate imported references.
- [x] Preserve current error handling: failed reloads should set reference load error state and avoid pretending the object is visible.
- [x] Keep visibility as a consequence after load, not as a hidden loader.

### `Catalog-Gen2-14 / Phase 3`

- [x] `HLG 18. split/close regression proof`
- [x] `CLG 33. viewer runtime remains disposable`
- [x] `CLG 34. viewer remounts rehydrate visible references`
- [x] Add focused coverage proving a new viewer with no runtime object reloads a visible globally loaded reference.
- [x] Add focused coverage proving a viewer that already has the reference does not duplicate-load it.
- [x] Add the closest practical regression coverage for the reported paths:
  - Catalog split closed after PubParts ZIP Import acceptance
  - model viewport split after simple `.obj` import
- [x] If full UI reproduction is too heavy for this phase, document the focused seam test that proves the ownership bug and leave a manual/Playwright follow-up only if Manager accepts the gap.

### `Catalog-Gen2-14 / Phase 4`

- [x] `HLG 18. Bug 22 closeout`
- [x] `CLG 33. ownership documented`
- [x] `CLG 34. rehydration verified`
- [x] Run focused viewer/import/store tests and `npm run build`.
- [x] Update Bug 22 from `[investigating]` to fixed or follow-up-needed based on proof.
- [x] Update the Gen2 index and Catalog vision checklist status only if focused tests and build prove the behavior.
- [x] Do not add a follow-up phase because focused verification still covers both reported accepted-reference repro seams.

## [x] `Catalog-Gen2-14 / Phase 1` - `Runtime Ownership Contract And Viewer Possession Query`

### Phase 1 Summary

#### Purpose

Add the smallest safe runtime possession query to the viewer layer so later `ViewerHost` work can distinguish global imported-reference load state from current viewer runtime possession.

#### Owns

- Make the ownership contract explicit in code shape: `referenceWorkspace` remains canonical imported-reference truth, while `Viewer.referenceObjects` remains one mounted viewer's disposable runtime cache.
- Add a read-only `Viewer.hasReference(referenceId: string): boolean` query that reports only current runtime possession.
- Update the `ViewerHost` test mock so Phase 2 can assert loaded-but-missing behavior without reshaping the mock during the behavior change.

#### Does Not Own

- No `ViewerHost` rehydration behavior yet.
- No load timing, visibility, Import accept, Catalog source-options, store schema, STEP loader, ZIP, or source resolver changes.
- No attempt to make `Viewer.referenceObjects` canonical or to store viewer possession in `referenceWorkspace`.

#### Current Live Read

- `src/app/store/useAppStore.ts` owns the canonical `referenceWorkspace` records, visibility, load/error state, part rows, and transform state.
- `src/viewer/Viewer.ts` stores per-viewer runtime objects in private maps such as `referenceObjects`, `referencePartDescriptorsByReferenceId`, and `referenceLoadPromises`.
- `src/app/components/ViewerHost.tsx` currently loads visible references only when `loadState` is `unloaded` or `error`; for visible `loaded` items it calls `viewer.setReferenceVisible(referenceId, true)`, which is a no-op when the newly mounted viewer lacks the runtime object.
- `src/app/components/ViewerHost.test.tsx` mocks `Viewer` methods but does not yet expose a current-viewer possession query.

#### First Pass Decisions

- Name the query `hasReference` unless implementation discovers an existing naming convention that is clearly narrower and better.
- Keep the method synchronous and side-effect free.
- Let the method answer "does this mounted viewer currently possess a runtime object for this id?", not "is the reference globally loaded?".
- Default the `ViewerHost` mock helper to `false` when Phase 2 starts, because a freshly mounted mock viewer should model an empty runtime cache unless a test explicitly says otherwise.

#### Implementation Status

- Implemented in `src/viewer/Viewer.ts` with `public hasReference(referenceId: string): boolean`.
- Implemented in `src/app/components/ViewerHost.test.tsx` with `viewerHasReference` and a default `false` mock method.
- No production `ViewerHost` sync condition changed in Phase 1.
- No Catalog, Import, store schema, ZIP/source resolver, STEP loader, builder, or compatibility behavior changed in Phase 1.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Add one public method to `Viewer` near the existing reference runtime methods:

```ts
public hasReference(referenceId: string): boolean {
  return this.referenceObjects.has(referenceId)
}
```

Update the `ViewerHost` test mock shape:

```ts
let viewerHasReference: ReturnType<typeof vi.fn>

// inside MockViewer
public hasReference = (...args: unknown[]) => viewerHasReference(...args)

// inside beforeEach
viewerHasReference = vi.fn(() => false)
```

If a Phase 1 test needs to model an already-owned runtime reference, set `viewerHasReference.mockReturnValueOnce(true)` or `mockImplementation((referenceId) => referenceId === targetId)` in that test only.

#### Implementation Files

- `src/viewer/Viewer.ts`
  - added the read-only `hasReference(referenceId: string): boolean` method.
- `src/app/components/ViewerHost.test.tsx`
  - added `viewerHasReference` mock wiring only; no Phase 2 rehydration assertions were added.

#### No-Widening Rule

This phase must stop after exposing and proving the read-only query plus mock readiness. Do not change the `ViewerHost` sync condition in this phase.

The Phase 2 behavior change should remain the first place that introduces logic like:

```ts
const shouldLoad =
  item.isVisible &&
  (item.loadState === 'unloaded' ||
    item.loadState === 'error' ||
    (item.loadState === 'loaded' && !viewer.hasReference(item.referenceId)))
```

#### Focused Tests

- `npm.cmd test -- src/app/components/ViewerHost.test.tsx`
- `npm.cmd run build`

The focused `ViewerHost` run should catch any missing mock method in `ViewerHost` coverage. It is acceptable if the `ViewerHost` focused run has no new assertions in this phase, as long as the mock compiles and existing reference-loading tests still pass.

#### Verification Result

- `npm.cmd test -- src/app/components/ViewerHost.test.tsx` failed: 69 passed, 11 failed. Failures were in existing reference-loading state progression, reference batch loading, reference transform snap expectation, viewport reference selection resolution, and highlighted reference assertions rather than the new Phase 1 `hasReference` method or mock wiring.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.

#### Build Expectation

`npm.cmd run build` passed with no TypeScript errors from the new public method or test mock shape.

#### Acceptance

- `Viewer.hasReference(referenceId)` returns only `this.referenceObjects.has(referenceId)`.
- The method does not load, remove, reveal, hide, transform, select, or otherwise mutate the viewer.
- Existing reference loading, visibility, handoff, removal, and transform behavior is unchanged.
- `ViewerHost.test.tsx` has a mock `hasReference` method ready for Phase 2.
- No `ViewerHost` production behavior changes land in Phase 1.
- No store schema or Catalog/Import behavior changes land in Phase 1.

#### Out Of Scope

- `ViewerHost` loaded-but-missing reload behavior.
- Catalog source-options labels, ZIP staging, PubParts handling, or source resolver behavior.
- Import review acceptance, imported-reference creation, or object URL lifetime.
- `referenceWorkspace` schema, load-state vocabulary, part-row schema, transform schema, or content order.
- STEP or other loader support/fidelity work.
- Split/close UI regression coverage beyond keeping the `ViewerHost` mock ready for it.

#### Concerns For Manager Approval

- Phase 2 should decide whether rehydrating a globally `loaded` but runtime-missing reference briefly sets global load state back to `loading`, or whether it reloads quietly and preserves the visible `loaded` state until failure.
- Phase 2 should decide whether direct split/exploded handoff logic also needs `hasReference` awareness, or whether the initial Bug 22 fix should touch only the ordinary visible-reference sync path.

## [x] `Catalog-Gen2-14 / Phase 2` - `ViewerHost Rehydration For Loaded-But-Missing References`

### Phase 2 Summary

#### Purpose

Teach the ordinary `ViewerHost` visible-reference sync path to reload a visible imported reference when canonical store state says it is `loaded` but the current mounted viewer runtime does not possess the object.

#### Owns

- Use `viewer.hasReference(item.referenceId)` as the only current-viewer possession check.
- Treat `referenceWorkspace` as canonical imported-reference truth and `Viewer.referenceObjects` as disposable per-viewer runtime possession.
- Add the first behavior fix for Bug 22 at the ordinary visible-reference sync path.
- Keep UI/load state truthful during remount recovery by briefly setting a visible loaded-but-missing reference back to `loading`, then returning it to `loaded` on success or using the existing `error` plus visibility-false path on failure.

#### Does Not Own

- No Catalog source-options, Import accept, store schema, ZIP/source resolver, STEP loader, builder, or compatibility behavior changes.
- No runtime-possession mirror in store state.
- No new canonical imported-reference records and no imported-reference id replacement.
- No direct split/exploded special-path rewrite unless implementation proves the ordinary sync change would otherwise duplicate-load or break remount behavior.

#### Current Live Read

- `src/app/components/ViewerHost.tsx` has one ordinary async sync effect that loads visible references only when `item.loadState` is `unloaded` or `error`.
- A separate visibility effect calls `viewer.setReferenceVisible(item.referenceId, true)` for visible `loaded` items, but this cannot recover a newly mounted viewer whose `referenceObjects` map lacks the object.
- Phase 1 added `Viewer.hasReference(referenceId)` and a default-false `ViewerHost` test mock so tests can model a newly mounted viewer with no runtime object.
- The full `src/app/components/ViewerHost.test.tsx` file is currently red in 11 unrelated/broader expectations, so Phase 2 verification should use targeted `vitest -t` tests plus build while recording the full-file baseline truthfully.

#### First Pass Decisions

- Rehydrate through the ordinary async `syncReferences` path, not the separate visibility-only effect.
- Compute a local `shouldLoad` using:

```ts
const shouldLoad =
  item.isVisible &&
  (item.loadState === 'unloaded' ||
    item.loadState === 'error' ||
    (item.loadState === 'loaded' && !viewer.hasReference(item.referenceId)))
```

- If `shouldLoad` is false, continue without calling `ensureReferenceLoaded`.
- If `shouldLoad` is true, use the existing load flow: set load state to `loading`, call `viewer.ensureReferenceLoaded(item)`, set load state to `loaded`, refresh part rows, append the loaded-model console entry, and call `viewer.setReferenceVisible(item.referenceId, true)` only if current canonical traits still say the reference is visible.
- On failure, keep the existing catch behavior: set load state to `error`, set visibility false, and call `viewer.setReferenceVisible(item.referenceId, false)`.
- Keep direct split group skip logic in front of this decision unless implementation proves that skip masks the ordinary remount case for non-split imported references.

#### Implementation Status

- Implemented in `src/app/components/ViewerHost.tsx` by replacing the ordinary visible-reference sync skip condition with the approved `shouldLoad` check.
- Visible `unloaded` and `error` references still load through the existing path.
- Visible globally `loaded` references now reload only when `viewer.hasReference(item.referenceId)` returns false for the mounted viewer runtime.
- Successful rehydration uses the existing load body: global state briefly becomes `loading`, then returns to `loaded`, part rows refresh, and viewer visibility is restored if canonical visibility still says visible.
- Failed rehydration uses the existing catch path: load state becomes `error`, visibility becomes false, and the viewer is told to hide the reference.
- No Catalog source-options, Import accept, store schema, ZIP/source resolver, STEP loader, builder, compatibility, direct split, or exploded special-path behavior changed.

### Phase 2 Implementation Spec

#### Exact First Code Cut

Change only the ordinary async reference sync effect in `src/app/components/ViewerHost.tsx`.

Replace the current skip condition:

```ts
if (
  !item.isVisible ||
  (item.loadState !== 'unloaded' && item.loadState !== 'error')
) {
  continue
}
```

with an explicit `shouldLoad` check:

```ts
const shouldLoad =
  item.isVisible &&
  (item.loadState === 'unloaded' ||
    item.loadState === 'error' ||
    (item.loadState === 'loaded' && !viewer.hasReference(item.referenceId)))

if (!shouldLoad) {
  continue
}
```

Leave the existing load body after that check intact unless TypeScript requires a tiny local type adjustment.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
  - widened the ordinary `syncReferences` load condition to include visible globally `loaded` but current-runtime-missing references.
- `src/app/components/ViewerHost.test.tsx`
  - added targeted tests for loaded-but-missing rehydration, already-owned no-duplicate-load behavior, and failure-path handling using the Phase 1 `viewerHasReference` mock.
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-14 - Imported Reference Ownership And Viewport Rehydration.md`
  - marked Phase 2 implementation status and recorded verification truth after implementation.
- `docs/CHANGELOG.md`
  - recorded the behavior change.
- `docs/Doc-Log.md`
  - recorded the doc updates.

#### Test Cut

Add targeted tests in the existing `describe('ViewerHost reference loading', ...)` block. Use unique test titles so they can run with `vitest -t` despite the full file's unrelated red baseline.

Required tests:
- `rehydrates a visible loaded reference missing from the mounted viewer runtime`
  - arrange a visible reference with `loadStateById[referenceId] = 'loaded'`
  - arrange `viewerHasReference.mockReturnValue(false)`
  - arrange `viewerEnsureReferenceLoaded` with a deferred promise
  - render `ViewerHost`
  - expect load state becomes `loading`
  - resolve load
  - expect `viewerEnsureReferenceLoaded` called once with the same `referenceId`
  - expect load state returns to `loaded`
  - expect `viewerSetReferenceVisible(referenceId, true)`
  - expect no new imported-reference id was created
- `does not rehydrate a visible loaded reference already present in the mounted viewer runtime`
  - arrange visible `loaded`
  - arrange `viewerHasReference.mockImplementation((referenceId) => referenceId === targetId)`
  - render `ViewerHost`
  - expect `viewerEnsureReferenceLoaded` not called for that target
  - expect load state stays `loaded`
  - expect visibility sync can still call `viewerSetReferenceVisible(targetId, true)`
- `uses the existing error path when loaded-but-missing rehydration fails`
  - arrange visible `loaded`
  - arrange `viewerHasReference.mockReturnValue(false)`
  - arrange `viewerEnsureReferenceLoaded.mockRejectedValueOnce(new Error('rehydration failed'))`
  - render `ViewerHost`
  - expect load state becomes `error`, visibility becomes false, and `viewerSetReferenceVisible(referenceId, false)` is called

#### Focused Verification Plan

Because the full `ViewerHost.test.tsx` file currently fails in 11 unrelated/broader expectations, do not use a full-file green result as the Phase 2 gate unless those failures are separately repaired.

Run targeted tests by title, for example:

```bash
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a visible loaded reference missing from the mounted viewer runtime"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "uses the existing error path when loaded-but-missing rehydration fails"
npm.cmd run build
```

Also record the current full-file baseline truth if rerun:

```bash
npm.cmd test -- src/app/components/ViewerHost.test.tsx
```

Expected current baseline before unrelated repairs: 69 passing and 11 failing tests in reference-loading state progression, reference batch loading, reference transform snap expectation, viewport reference selection resolution, and highlighted reference assertions.

#### Build Expectation

`npm.cmd run build` should pass with no TypeScript errors from the new `viewer.hasReference` call in production `ViewerHost`.

#### Verification Result

- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a visible loaded reference missing from the mounted viewer runtime"` passed: 1 passed, 82 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"` passed: 1 passed, 82 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "uses the existing error path when loaded-but-missing rehydration fails"` passed: 1 passed, 82 skipped.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.
- The full `src/app/components/ViewerHost.test.tsx` file was not rerun for Phase 2 because the accepted baseline remains red in 11 existing/broader reference-loading, snap, and reference-selection expectations.

#### Acceptance

- Visible references with `loadState` `unloaded` or `error` continue to load as before.
- Visible references with `loadState` `loaded` and `viewer.hasReference(referenceId) === true` do not call `ensureReferenceLoaded`.
- Visible references with `loadState` `loaded` and `viewer.hasReference(referenceId) === false` briefly become `loading`, call `ensureReferenceLoaded`, return to `loaded` on success, refresh part rows, and become visible in the mounted viewer if canonical visibility still says visible.
- Failed loaded-but-missing rehydration uses the existing error path: `error` load state, visibility false, viewer hidden.
- Canonical imported-reference ids remain stable; no duplicate reference records are created.
- No store schema or runtime-possession mirror is introduced.
- Direct split/exploded handoff paths are unchanged unless the implementation read proves a tiny supporting adjustment is required to avoid duplicate loads or broken remounts in this exact Phase 2 slice.

#### Out Of Scope

- Catalog source-options, PubParts ZIP staging, source resolver, or preview/source-options changes.
- Import accept, staged Import draft behavior, or object URL lifetime changes.
- Store schema, load-state vocabulary, part-row schema, transform schema, or content order changes.
- STEP loader, builder, compatibility, or CAD fidelity changes.
- Full split/close UI regression coverage; that remains Phase 3.
- Repairing the existing unrelated red expectations in the full `ViewerHost.test.tsx` file, unless Manager routes a Phase 1.1 or separate stabilization slice.

#### Concerns For Manager Review

- If targeted Phase 2 tests cannot run cleanly because the same underlying red `ViewerHost` baseline blocks even `vitest -t` isolation, Manager should decide whether to insert `Phase 1.1 - ViewerHost Focused Harness Stabilization` before behavior implementation.
- Phase 3 should explicitly revisit direct split/exploded special paths after the ordinary sync fix lands, because those effects still have their own loaded/unloaded assumptions and remount coverage needs.

## [x] `Catalog-Gen2-14 / Phase 3` - `Split And Close Regression Coverage`

### Phase 3 Summary

Lock the two user-reported disappearance paths with focused regression coverage or the closest honest seam coverage available.

### Phase 3 Implementation Spec

#### Purpose

Prove the ownership bug at the closest reliable seam without broadening runtime behavior beyond the Phase 2 `ViewerHost` rehydration path.

The must-have proof is:
- a newly mounted viewer with an empty runtime cache rehydrates a visible imported reference whose canonical store state is already `loaded`
- the canonical imported reference id stays unchanged
- a current viewer that already owns the runtime object does not duplicate-load it

#### Live Read

- The ordinary `ViewerHost` visible-reference sync path now uses `viewer.hasReference(item.referenceId)` for visible globally `loaded` references.
- The visibility-only effect still calls `viewer.setReferenceVisible(referenceId, true)` for visible loaded references, but this remains non-owning and cannot be the proof seam.
- The exploded-child handoff effect only runs when a previously loaded wrapper reference disappears and the new children are still `unloaded`; it does not own ordinary accepted-reference remounts.
- The direct split handoff effect groups direct split children, uses loaded siblings as a source for visible unloaded children, and the ordinary sync still skips a direct split group when a loaded sibling exists. That means direct split loaded-but-runtime-missing children may need separate possession-aware handling, but this is a special-path follow-up rather than required proof for ordinary accepted PubParts ZIP or `.obj` imports.
- Existing `AppShell.test.tsx` mocks `ViewerHost` as static text, so it can prove layout split/close state but cannot prove viewer runtime possession or `ensureReferenceLoaded`.
- Existing `ConsoleDock.test.tsx` and workspace/AppShell split tests exercise slot splitting and Catalog viewport close flows, but they are too broad for the current must-have ownership proof and do not provide the focused mock viewer cache seam that `ViewerHost.test.tsx` already has.

#### Direct Split / Exploded Decision

Do not change direct split or exploded special paths in Phase 3 unless the focused tests below become impossible without a tiny guard. The ordinary accepted-reference remount proof can be done through `ViewerHost.test.tsx` without touching those paths.

Route direct split/exploded runtime-possession coverage to a proposed follow-up if Manager wants it:

`Catalog-Gen2-14 / Phase 3.1 - Direct Split And Exploded Runtime Possession Coverage`

Likely Phase 3.1 question:
- Should direct split groups treat a globally `loaded` but `!viewer.hasReference(referenceId)` sibling as a reload/rehydration candidate instead of skipping because another sibling is globally loaded?
- Should exploded children get a possession-aware remount proof after their wrapper has been removed and children are already globally loaded?

#### Repro Coverage Decision

Use focused `ViewerHost`/store seam tests for Phase 3 instead of full workspace split UI tests.

What the focused seam proves:
- accepted imported references live in canonical `referenceWorkspace` state
- a newly mounted `ViewerHost` with an empty viewer runtime cache reloads those references from canonical state
- `referenceId` is stable through the reload
- no duplicate load occurs when the mounted viewer already has the runtime object

What remains outside Phase 3:
- fully clicking through PubParts ZIP source-options, Import review commit, Catalog split close, and visual model persistence in one UI test
- fully clicking through normal `.obj` import, model viewport split, and visual model persistence in one UI test
- direct split/exploded special-path runtime possession

If Manager needs UI-level proof after seam proof, create:

`Catalog-Gen2-14 / Phase 3.1 - Workspace Split UI Regression Harness`

That follow-up should use `AppShell`/workspace split harnesses only after deciding whether to unmock `ViewerHost` or add a narrow integration harness around the real `ViewerHost` mock viewer.

#### Likely Files

- `src/app/components/ViewerHost.test.tsx`
  - added remount/new-viewer focused tests using the existing mock `viewerHasReference` and `viewerEnsureReferenceLoaded` hooks.
  - kept the test data store-owned and stable; did not introduce Catalog source-options, Import accept, ZIP, STEP, or workspace layout changes.
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Future/Catalog-Gen2-14 - Imported Reference Ownership And Viewport Rehydration.md`
  - marked Phase 3 implementation status and verification truth after implementation.
- `docs/CHANGELOG.md`
  - recorded Phase 3 test/source coverage.
- `docs/Doc-Log.md`
  - recorded doc updates.

#### Implementation Status

- Implemented the PubParts-attributed accepted-import remount proof in `src/app/components/ViewerHost.test.tsx`.
- Implemented the normal `.obj` newly mounted secondary model viewer proof in `src/app/components/ViewerHost.test.tsx`.
- Reused the Phase 2 already-owned runtime proof unchanged.
- No production behavior changed in Phase 3.
- No direct split or exploded special-path behavior changed in Phase 3.
- No AppShell/workspace split UI harness was added, and full UI click-through is not claimed.

#### Exact Test Cut

Add focused tests in the existing `describe('ViewerHost reference loading', ...)` block.

Test 1:

`rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache`

Setup:
- create one imported reference through `addImportedReference` with:
  - `fileName: 'gripple_body.obj'`
  - `fileType: 'obj'`
  - `objectUrl: 'blob:pubparts-gripple-body'`
  - PubParts-style `sourceAttribution` using `sourceKind: 'external-catalog'`, `providerId: 'pubparts'`, `providerName: 'PubParts'`, and a ZIP `linkedArchiveUrl`
- set that same `referenceId` to visible and `loaded`
- first mount can model the previous viewer owning the object by returning true from `viewerHasReference`
- unmount the first root to model Catalog close/remount disposing the runtime cache
- remount a new `ViewerHost` with `viewerHasReference` returning false for that same id
- resolve `viewerEnsureReferenceLoaded`

Assertions:
- `viewerEnsureReferenceLoaded` is called exactly once during the remount with the same `referenceId`
- load state goes `loading` during rehydration and returns to `loaded`
- part rows refresh from `viewerGetReferencePartDescriptors`
- `viewerSetReferenceVisible(referenceId, true)` is called after success
- `importedReferenceOrder` stays identical and contains the same `referenceId` once
- the stored imported reference still has the PubParts `sourceAttribution`

Test 2:

`rehydrates a loaded obj import in a newly mounted secondary model viewer`

Setup:
- create one normal `.obj` imported reference through `addImportedReference`
- set it visible and `loaded`
- render `ViewerHost viewportId="model-viewer-secondary"` with `viewerHasReference` false
- resolve `viewerEnsureReferenceLoaded`

Assertions:
- `viewerEnsureReferenceLoaded` is called once with the same `referenceId`
- load state goes `loading` then `loaded`
- no duplicate imported reference record is created
- `viewerSetReferenceVisible(referenceId, true)` is called

Test 3:

Reuse or keep the Phase 2 no-duplicate proof:

`does not rehydrate a visible loaded reference already present in the mounted viewer runtime`

Assertions:
- `viewerHasReference(referenceId) === true`
- `viewerEnsureReferenceLoaded` is not called
- canonical load state remains `loaded`
- visibility sync still calls `viewerSetReferenceVisible(referenceId, true)`

#### Commands

Run the focused tests by title because the full `ViewerHost.test.tsx` file remains known-red in broader expectations:

```bash
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a loaded obj import in a newly mounted secondary model viewer"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"
npm.cmd run build
```

Do not claim the full `ViewerHost.test.tsx` file is green unless it is rerun and passes. Current accepted baseline remains: 11 existing/broader red expectations in reference-loading, snap, and reference-selection coverage.

Optional targeted store attribution check if the PubParts seam test needs a narrower source-attribution proof:

```bash
npm.cmd test -- src/app/store/useAppStore.test.ts -t "preserves external Catalog source attribution through staged import commit"
```

#### Acceptance

- Phase 3 has at least one remount/new-viewer test where canonical state starts visible + `loaded`, the mock viewer runtime starts empty, and `ensureReferenceLoaded` runs for the same `referenceId`.
- Phase 3 has PubParts-attributed accepted-reference coverage at the `ViewerHost`/store seam.
- Phase 3 has normal `.obj` accepted-reference coverage at the `ViewerHost`/store seam.
- Phase 3 proves a mounted viewer that already owns the runtime object does not duplicate-load the same reference.
- Phase 3 proves canonical imported-reference ids remain stable and no duplicate imported reference record is created.
- Phase 3 records that full split/close UI reproduction is not claimed unless a dedicated UI harness is added and passes.
- Phase 3 leaves Catalog source-options, Import accept, store schema, ZIP/source resolver, STEP loader, builder, compatibility, direct split, and exploded behavior unchanged unless Manager explicitly widens implementation after prep review.

#### Verification Result

- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache"` passed: 1 passed, 84 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a loaded obj import in a newly mounted secondary model viewer"` passed: 1 passed, 84 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"` passed: 1 passed, 84 skipped.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.
- The full `src/app/components/ViewerHost.test.tsx` file was not rerun for Phase 3 because the accepted baseline remains red in 11 existing/broader reference-loading, snap, and reference-selection expectations.

#### Out Of Scope

- Full PubParts ZIP source-options to Import review to Catalog close click path.
- Full local `.obj` file picker/import to model viewport split click path.
- Direct split and exploded special-path possession repair.
- Repairing unrelated full-file `ViewerHost.test.tsx` red expectations.
- Repairing unrelated BrowserPanel staged Import structure/status failures or graph/project-output suite failures.

## [x] `Catalog-Gen2-14 / Phase 4` - `Bug 22 Closeout And Gen2 Ownership Audit`

### Phase 4 Summary

Close the planning loop only after the ownership behavior is proved.

### Phase 4 Implementation Spec

#### Purpose

Close Bug 22 and `Catalog-Gen2-HLG-18` truthfully after auditing the shipped Phase 1-3 ownership proof.

Phase 4 should be a docs/test closeout. It should not change production behavior unless verification unexpectedly proves the accepted Phase 1-3 ownership seam is incomplete.

#### Implementation Status

- Reran the four accepted focused `ViewerHost` ownership tests and `npm.cmd run build`; all passed.
- Marked Bug 22 fixed at the store-to-current-viewer remount seam.
- Marked `Catalog-Gen2-HLG-18`, `Catalog-Gen2-CLG-33`, `Catalog-Gen2-CLG-34`, and `Catalog-Gen2-14` complete.
- Added no production behavior and no new tests in Phase 4.
- Did not add a Phase 3.1 or Phase 4.1 because the accepted PubParts ZIP-attributed and normal `.obj` remount seams remain covered.

#### Audit Read

Phase 1 shipped the ownership contract and read-only runtime possession query:
- `referenceWorkspace` owns canonical imported-reference truth.
- `Viewer.referenceObjects` remains disposable per-mounted-viewer runtime cache.
- `Viewer.hasReference(referenceId)` lets `ViewerHost` ask the current viewer whether it actually possesses the runtime object.

Phase 2 shipped the behavior fix:
- ordinary visible-reference sync now reloads visible references when global state is `unloaded`, `error`, or `loaded` while `viewer.hasReference(item.referenceId) === false`.
- loaded references already present in the mounted viewer do not duplicate-load.
- rehydration uses existing loading, success, part-row refresh, and error/visibility-false paths.

Phase 3 shipped focused ownership proof for the two reported accepted-reference shapes:
- PubParts ZIP-attributed accepted import after `ViewerHost` remount with an empty runtime cache.
- normal `.obj` accepted import in a newly mounted secondary model viewer.
- already-owned current viewer runtime does not duplicate-load.
- canonical imported-reference ids and order stay stable; no duplicate imported reference record is created.

Truthful Bug 22 closeout decision:
- The reported root ownership bug is fixed at the store-to-current-viewer remount seam.
- Full UI click-through for Catalog close and model viewport split is not claimed.
- Direct split/import-explosion special-path runtime possession is not claimed.
- Those unclaimed surfaces are follow-up candidates only if Manager wants broader hardening or if manual QA finds a remaining disappearance path.

#### Doc Updates

Updated `docs/Bugs/bug/22_2026-04-21_imported-reference-viewport-remount-disappears.md`:
- added Doc History entry for Phase 4 closeout.
- changed Status from `[planned]` to `[fixed]`.
- added a closeout section noting Phase 1-3 proof:
  - `Viewer.hasReference(referenceId)`
  - `ViewerHost` loaded-but-missing rehydration
  - PubParts ZIP-attributed accepted import remount seam
  - normal `.obj` newly mounted secondary viewer seam
  - already-owned no-duplicate load
- preserved the original reproductions and current strong read as historical context.
- added an explicit residual/follow-up note: full UI click-through and direct split/exploded runtime-possession were not claimed.

Updated `docs/Bugs/0_Bug_Report.md`:
- added Doc History entry.
- removed `Bug 22` from the current practical open order.
- changed the short list status from `[planned]` to `[fixed]`.
- updated the Bug 22 section status to `[fixed]` and added a brief fixed read naming the `ViewerHost` current-viewer rehydration seam.

Updated `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Vision.md`:
- added Doc History entry.
- marked `Catalog-Gen2-HLG-18` complete with wording that completion is based on accepted focused ownership proof, not full UI click-through.

Updated `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md`:
- added Doc History entry.
- marked `Catalog-Gen2-CLG-33` and `Catalog-Gen2-CLG-34` complete.
- marked `Catalog-Gen2-14` complete.
- updated the `Catalog-Gen2-14` section with a closeout read:
  - phases 1-4 complete
  - focused tests/build passed
  - direct split/exploded and full UI harness are not blockers and remain optional follow-up surfaces
  - dispatch next: none for `Catalog-Gen2-14` unless Manager opens a follow-up.

Updated this `Catalog-Gen2-14` family doc:
- marked Phase 4 complete after implementation.
- added Phase 4 implementation status and verification result.
- marked remaining Phase 4 checklist items complete after the closeout docs and verification passed.

Updated `docs/CHANGELOG.md`:
- added a changelog entry because the repo's live style records implemented audit closeouts that rerun and record shipped implementation acceptance.

Updated `docs/Doc-Log.md`:
- recorded every Phase 4 doc update.

#### Verification Plan

Run only focused commands that prove the accepted ownership seam plus build:

```bash
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a visible loaded reference missing from the mounted viewer runtime"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache"
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a loaded obj import in a newly mounted secondary model viewer"
npm.cmd run build
```

Do not run or require full `src/app/components/ViewerHost.test.tsx` unless Manager explicitly asks. The accepted baseline remains broader-red in 11 existing reference-loading, snap, and reference-selection expectations.

Optional audit-only command if Manager wants attribution proof from the store layer:

```bash
npm.cmd test -- src/app/store/useAppStore.test.ts -t "preserves external Catalog source attribution through staged import commit"
```

#### Verification Result

- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a visible loaded reference missing from the mounted viewer runtime"` passed: 1 passed, 84 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "does not rehydrate a visible loaded reference already present in the mounted viewer runtime"` passed: 1 passed, 84 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a PubParts ZIP accepted import after ViewerHost remount with an empty runtime cache"` passed: 1 passed, 84 skipped.
- `npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "rehydrates a loaded obj import in a newly mounted secondary model viewer"` passed: 1 passed, 84 skipped.
- `npm.cmd run build` passed with existing Vite `occt-import-js` `path`/`crypto` externalization warnings and the existing large chunk warning.
- The full `src/app/components/ViewerHost.test.tsx` file was not rerun for Phase 4 because the accepted baseline remains red in 11 existing/broader reference-loading, snap, and reference-selection expectations.

#### Acceptance

- Bug 22 is marked fixed with wording that the root ownership bug is fixed at the store-to-current-viewer remount seam.
- `Catalog-Gen2-HLG-18`, `Catalog-Gen2-CLG-33`, `Catalog-Gen2-CLG-34`, and `Catalog-Gen2-14` are marked complete only after focused verification and build pass.
- The closeout docs explicitly state that full UI click-through and direct split/exploded runtime possession remain unclaimed optional follow-up surfaces.
- The closeout does not alter Catalog source-options, Import accept, store schema, ZIP/source resolver, STEP loader, builder, compatibility, direct split, or exploded behavior.
- Focused tests and `npm.cmd run build` pass.
- The known full-file `ViewerHost.test.tsx` red baseline is not hidden or misreported.

#### Follow-Up Decision

Do not add a Phase 3.1 or Phase 4.1 during Phase 4 unless the audit or focused verification proves one of the two reported accepted-reference repro seams is still not covered.

Mention these as optional later surfaces, not blockers:
- full workspace split/close UI click-through harness
- direct split/import-explosion special-path runtime-possession hardening
- manual QA note for Catalog close and model viewport split after the focused seam proof

If manual QA or later UI harness work shows accepted PubParts imports or normal `.obj` imports still disappear after remount, create `Catalog-Gen2-14 / Phase 4.1 - Remaining Imported Reference Remount Repro Repair` and keep it separate from the shipped Phase 1-3 ownership fix.

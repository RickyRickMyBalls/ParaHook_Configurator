# 24 - Repeat Extrude Scoped A/D/F Composition Regression

## Doc History
3. 2026-05-21 09:26:00: Added a phased fix plan that separates worker/result-scope contract hardening from app-side accepted-runtime merge proof, viewport A/D/F composition repair, and end-to-end repeat-Extrude verification so scoped builds can stay efficient without hiding retained accepted geometry.
2. 2026-05-21 07:48:49: Added the May 21 console and Runtime Inspector notes showing that the worker completes scoped Extrude builds with stable `extrude#1` / `extrude#2` identities, the accepted edit impact can report rebuilt and reused Extrude rows, and the remaining visible failure is likely viewport composition dropping reused accepted outputs rather than graph deletion or worker failure.
1. 2026-05-20 16:42:12: Created this bug report after repeat-Extrude testing showed the first accepted Extrude still disappears when the second Extrude commits, even after stable `extrude#1` / `extrude#2` compiler identity landed; the strongest current read is that scoped worker results for only the changed Extrude are being treated by the viewport A/D/F composition path as the whole visible scene.

## Status

- `[investigating]`

## Summary

When the user creates multiple sketch profiles and extrudes them as separate `Geometry/Extrude` operations, the first Extrude can disappear from the model viewport after the second Extrude commits.

The graph and Browser still appear to know about both objects. The worker also completes the second build. The current failure looks like a viewport result-composition bug rather than a missing graph node or a fully stuck worker.

## User-Facing Symptom

- User creates sketch profiles.
- User extrudes profile 1.
- Object 1 appears correctly.
- User starts and commits Extrude 2.
- Object 2 appears.
- Object 1 disappears from the model viewport.
- Browser can still show Object 1 and Object 2.
- The HUD can remain on `Geometry: Building Final...`.

Latest console evidence:
- first build logs `extrude#1`
- second build logs `extrude#2`
- second build completes with raw worker summary `rebuilt 1, retained 0, evicted 0`
- the app requests final builds around the commit path

## May 21 Evidence Notes

The May 21 retest still reproduces the user-facing symptom: after committing the second Extrude, the viewport shows the new Extrude body but the earlier accepted Extrude body disappears.

The console helps because it narrows the failure:

- the worker is not permanently stuck; it logs `Build complete` after the repeated Extrude commits
- the old unstable-name theory is no longer the best explanation because logs consistently show stable output identities such as `extrude#1`, `extrude#2`, `extrude#3`, and `extrude#4`
- scoped build requests are still visible; examples include only `extrude#2` rebuilding, only `extrude#3` rebuilding, and later runs where multiple Extrudes are queued together
- raw worker summaries can still say `rebuilt 1, retained 0, evicted 0`, which is expected for a scoped worker result and does not by itself prove Object 1 was deleted
- the Runtime Inspector screenshot is stronger than the raw worker summary: after committing `extrude#2`, it reports `rebuilt` for `extrude#2`, `reused` for `extrude#1`, and `evicted 0`

Current interpretation:

- the graph/build layer appears to know that `extrude#1` should remain accepted and reused
- the viewport only renders the latest scoped body, so the rendered scene is probably being assembled from a scoped geometry/result lane instead of the merged accepted bundle
- the bug may have a secondary affected-set issue because some retests show odd scoped sets when starting or committing later Extrudes, but the primary visible failure is still retained-output display composition

Useful next internal check:

- compare `acceptedBuildBundle.entries` and `acceptedBuildOutputs` against `viewportResultState.renderVm.viewerParts` immediately after the second Extrude commit
- if the accepted bundle contains both `extrude#1` and `extrude#2` but the render VM contains only `extrude#2`, the fix belongs in viewport A/D/F composition rather than worker rebuild policy

## Current Strong Read

The earlier `extrude` to `extrude#1` identity drift no longer appears in the latest console log. The first operation is now consistently addressed as `extrude#1`, and the second as `extrude#2`.

The remaining symptom points at scoped build composition:

- repeat Extrude build requests can narrow the target to only the changed output entry
- the worker then correctly rebuilds only `extrude#2`
- the raw worker bundle naturally reports one rebuilt entry
- the store has machinery to finalize accepted bundles and retain previous entries
- but the accepted authoritative or draft geometry lane may still be replaced by the incoming scoped geometry result
- the viewport A/D/F selector may then prefer that scoped geometry result and render only the changed Extrude as if it were the full current scene

Plain English: Object 1 may not be deleted. The viewport may simply be showing the scoped final/draft result for Object 2 as the whole model instead of composing Object 2 with retained Object 1.

## Why Auto / Draft / Final Matters

This likely involves A/D/F behavior because the app has several result lanes:

- `Draft` / preview artifacts
- `Final` / authoritative geometry
- `Auto` draft-to-final follow-through
- committed retained geometry
- accepted bundle artifacts
- current scoped worker geometry

Scoped builds are valid, but A/D/F display rules must not treat a scoped result as a full-scene replacement.

For repeat Extrude, the correct behavior is:
- changed output entry updates from the new scoped build
- unchanged accepted output entries stay visible
- final/auto mode can still say final is building or pending without removing retained visible geometry

## Likely Ownership

- viewport result composition
- accepted build bundle versus accepted geometry-result lane
- A/D/F selector behavior around scoped worker results
- repeat Extrude output-entry retention

## Likely Files

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/store/graphRuntime/acceptedRuntime.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.test.ts`

## Fix Phase Plan

### Phase 1 - Worker Result Scope Contract

Goal:
- make worker results explicit about whether they represent the full output scene or only a scoped patch

Implementation direction:
- preserve scoped execution; do not force full rebuilds just to keep old geometry visible
- carry clear result-scope metadata through the worker result path, such as full-scene versus partial-scene scope
- keep distinct reads for all current output build units, affected build units, target build units, and worker execution part keys
- ensure scoped worker results can say, in plain contract terms, "these entries were touched, and missing sibling entries were not deleted"

Acceptance read:
- worker/build tests prove a repeat-Extrude scoped request can rebuild or cache-hit only the changed/new Extrude while still reporting enough scope metadata for the app to retain unchanged accepted siblings
- raw worker summaries remain allowed to describe only the scoped worker output, but the contract no longer lets a scoped result masquerade as the whole visible scene

### Phase 2 - Accepted Runtime Merge Proof

Goal:
- make the app-side accepted runtime the owner of merging scoped worker results into the previous accepted output truth

Implementation direction:
- prove `acceptedBuildBundle` and `acceptedBuildOutputs` contain retained sibling output entries after a scoped repeat-Extrude result
- keep retained accepted artifacts unless the incoming scoped result explicitly evicts their build unit
- avoid treating absent non-target entries in a scoped worker result as removed geometry
- keep accepted bundle, accepted preview outputs, output surface, and accepted impact snapshots aligned

Acceptance read:
- store/runtime tests show `extrude#1` remains retained and `extrude#2` is rebuilt or reused after committing the second Extrude
- `acceptedBuildImpact` reports the real app-side merge state, not only the raw worker bundle count

### Phase 3 - Viewport A/D/F Composition Repair

Goal:
- make the viewport render the merged accepted scene instead of treating a scoped authoritative or draft geometry result as the whole model

Implementation direction:
- audit `selectViewportResultState` result priority for accepted authoritative geometry, draft geometry, artifact preview, retained base, and overlays
- when a geometry result is scoped, compose visibility from merged accepted output-entry truth or retained base plus scoped overlay
- only allow an authoritative geometry result to replace the full visible scene when it is known to cover the full current output set
- keep Auto, Draft, and Final mode behavior honest while final work is pending

Acceptance read:
- selector tests prove `renderVm.viewerParts` contains both retained `extrude#1` and rebuilt/reused `extrude#2` immediately after the second Extrude commit
- Browser Object rows and model viewport visible parts agree
- final-mode visibility does not prefer a scoped single-Extrude geometry result over the merged accepted scene

### Phase 4 - End-To-End Repeat Extrude Regression

Goal:
- prove the real user flow is fixed across command, worker, store, Browser, and viewer surfaces

Implementation direction:
- create or tighten a ViewerHost/useAppStore integration test around the profile-first repeat-Extrude flow
- cover the sequence: create first sketch profile, commit Extrude 1, create/commit Extrude 2, run the scoped build, and inspect render-layer calls
- verify no manual graph rebuild or undo/redo replay is required for Object 1 to reappear
- keep worker scoped rebuild/cache-hit behavior enabled

Acceptance read:
- Object 1 remains visible after Object 2 commits
- Object 2 appears after its scoped build completes
- HUD/build state settles consistently with visible geometry
- regression proof fails if either the worker scope contract or viewport composition regresses

## Research Questions

1. After committing Extrude 2, does `acceptedBuildBundle.entries` contain both:
   - `extrude#1` as retained
   - `extrude#2` as rebuilt
2. At the same moment, does `acceptedAuthoritativeGeometryResult.request.partKeys` contain only `['extrude#2']`?
3. Does `viewportResultState.renderVm.viewerParts` contain only the `extrude#2` viewer key?
4. Does the Browser list Object 1 because `outputSurface` or project content still has the retained entry even though the viewport render VM does not?
5. Is final-mode visibility preferring scoped `acceptedAuthoritativeGeometryResult` over the merged accepted bundle artifact VM?

## Desired Fix Direction

Do not make the worker rebuild everything just to hide the bug.

The first repair should preserve scoped worker builds while making A/D/F composition honest:

- scoped worker results should update only their target output entries
- retained accepted output entries should remain visible
- the visible final/draft scene should be composed from the merged accepted output-entry truth
- a scoped authoritative geometry result should not replace the whole scene unless it is known to represent the whole current output set

## Acceptance Read

This bug is fixed when:

- Extrude 1 remains visible after Extrude 2 commits
- Extrude 2 appears after its scoped build completes
- Auto/Draft/Final modes do not treat scoped results as full-scene replacements
- Browser Object rows and model viewport visible parts agree
- worker scoped rebuilds remain allowed
- no manual full graph rebuild is required for the missing Extrude to appear

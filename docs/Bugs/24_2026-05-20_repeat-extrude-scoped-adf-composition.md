# 24 - Repeat Extrude Scoped A/D/F Composition Regression

## Doc History
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

# 17 - Attempt 4 - Frontend Extrude Node Surface Handoff Repair

## Doc History
5. 2026-04-11 10:25:45: Cleaned up this attempt-4 note after the live fix and real-canvas regression both landed, marking the doc status complete, rewriting the problem list as resolved closeout items, and collapsing the planned chunk 3 into an absorbed follow-on because the new `SpaghettiCanvas.render.test.tsx` proof already guards the missing `extrudeVm` handoff seam directly
4. 2026-04-11 10:23:31: Marked `Attempt 4 Chunk 2 - Re-Prove The Visible Extrude Row States On The Real Canvas Path` complete after adding the first real `SpaghettiCanvas` render regression for the proving `SketchProfiles -> Extrude` graph, which now asserts the visible `Parent collection` and `Ready` row states directly on the live canvas path instead of only through direct `NodeView` rendering
3. 2026-04-11 10:18:18: Marked `Attempt 4 Chunk 1 - Restore The Canvas Extrude Vm Handoff` complete after forwarding the selector-owned `extrudeVm` through the live `SpaghettiCanvas.tsx -> NodeView.tsx` render path, which closes the concrete frontend handoff gap that kept the visible extrude node in false empty and waiting branches despite already-correct debug, output-preview, and model-viewport truth
2. 2026-04-11 10:16:07: Tightened `Attempt 4 Chunk 1 - Restore The Canvas Extrude Vm Handoff` into an implementation-ready frontend handoff pass by grounding it in the exact live `<NodeView ...>` call inside `SpaghettiCanvas.tsx`, locking the missing `extrudeVm={nodeVm?.extrudeVm}` prop as the first concrete owner to fix, and clarifying that the next proof must come from the real canvas path instead of another direct `NodeView` render
1. 2026-04-11 10:13:58: Created this fresh attempt-4 execution note after frontend research isolated the remaining live bug to the canvas `Geometry/Extrude` node surface path, where `SpaghettiCanvas.tsx` builds selector-owned `extrudeVm` truth but does not currently hand that vm into `NodeView.tsx`, leaving the visible extrude rows stuck in false empty and waiting branches even while Debug Inspector, Output Preview, and the model viewport already read the correct resolved state

## Doc Body

### Status

- `[complete]`

### Reference

Use this file as the clean execution surface for the frontend-only follow-up.

Background history and the earlier contract/evaluator work remain in:

- `docs/Bugs/17_Atempt 3.md`
- `docs/Bugs/17_2026-04-10_21-20-39_extrude-sketchprofiles-awaiting-state-with-resolved-parent-collection.md`

### Closeout Problem List

- `Problem 1 - Canvas extrude-vm handoff gap`
  Resolved by forwarding `extrudeVm` through the live `SpaghettiCanvas.tsx -> NodeView.tsx` render path.
- `Problem 2 - Visible extrude node parity drift`
  Resolved after the live extrude node started consuming that forwarded vm, bringing the visible `SketchProfiles` and `SolidBodies` rows back into parity with Debug Inspector, Output Preview, and model viewport truth.
- `Problem 3 - Test coverage gap on the real canvas path`
  Resolved by adding a real `SpaghettiCanvas` render regression that asserts the live extrude node shows collection-ready `SketchProfiles` state and `SolidBodies = Ready`.

This attempt is now complete.

### Closeout Root-Cause Read

The final root cause was frontend-local.

- selector truth was already correct
- `NodeView.tsx` already knew how to render that truth
- the live `SpaghettiCanvas.tsx` render path dropped `extrudeVm` before the extrude node rendered
- once that prop was forwarded, the visible node matched the already-correct debug, output-preview, and viewport surfaces
- the new real-canvas regression now guards the same seam directly

### What Must Stay True

- the repaired `SketchProfiles` parent-input contract from attempt 3 must stay intact
- Debug Inspector, Output Preview, model viewport, and live canvas should all agree on the same extrude truth
- new regression coverage must exercise the real canvas handoff, not only direct `NodeView` rendering

## [x] Attempt 4 Chunk 1 - Restore The Canvas Extrude Vm Handoff

### Goal

Make the live `SpaghettiCanvas -> NodeView` render path forward the selector-owned `extrudeVm`.

### Current Surface Read

The strongest owner seam is now very narrow.

In `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`, the live node render currently does this:

- `utilityVm={nodeVm?.utilityVm}`
- `sketchVm={nodeVm?.sketchVm}`

but does not do this:

- `extrudeVm={nodeVm?.extrudeVm}`

That matters because `src/app/spaghetti/canvas/NodeView.tsx` already reads `extrudeVm` for:

- `profileInputEntries`
- `profileWireCount`
- `resolvedProfileMembers`
- `bodyCount`
- `bodyMemberPortIds`
- the visible `SketchProfiles` summary ladder
- the visible `SolidBodies` ready-versus-waiting ladder

So the current live fallback is consistent with one missing prop handoff, not with wrong graph truth.

### Required Work

- update the live `<NodeView ...>` call inside `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- pass `extrudeVm={nodeVm?.extrudeVm}` alongside the already-forwarded `utilityVm` and `sketchVm`
- confirm the fix applies to the actual editor canvas path, not only isolated component renders

### Locked Goal For This Chunk

- keep the fix local to the live canvas handoff unless implementation proves another owner is still involved
- make the visible `Geometry/Extrude` node consume the same selector-owned extrude truth that the canvas already uses for other extrude-specific seams
- stop the live node from falling back to false empty-state and waiting-state narration when selector truth already exists

### Implementation-Ready Checks

- confirm the `NodeViewProps` surface already accepts `extrudeVm`
- confirm `selectNodeVm.ts` already builds non-empty `extrudeVm` for the proving graph
- confirm the live `<NodeView ...>` call is the only canvas handoff location that needs widening for this chunk
- avoid reopening evaluator, selector, or node-template copy in this chunk unless the prop handoff alone unexpectedly fails to change the live surface

### Suggested Implementation Order

1. Add `extrudeVm={nodeVm?.extrudeVm}` to the live `<NodeView ...>` call in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`.
2. Re-run the most focused existing canvas and node-surface tests to confirm the handoff compiles cleanly.
3. Only if the live behavior still fails after the prop is forwarded, move to chunk 2 and widen proof on the real canvas path.

### Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`

### Focused Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`

### Proof

- the live extrude input row no longer falls back to `No SketchProfiles contributors yet` when the upstream parent `SketchProfiles` wire is connected and resolved
- the live `SolidBodies` row no longer falls back to `Waiting` when the extrude body collection is already resolved

### Acceptance Checks

- the proving graph still shows correct Debug Inspector truth
- the visible canvas `Geometry/Extrude` node now matches that truth on the parent `SketchProfiles` input row
- the visible canvas `Geometry/Extrude` node now matches that truth on the `SolidBodies` output row
- if this chunk lands cleanly, chunk 2 can stay focused on regression proof instead of more frontend diagnosis

### Implemented Result

- updated the live `<NodeView ...>` call in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` to forward `extrudeVm={nodeVm?.extrudeVm}` alongside the already-forwarded `utilityVm` and `sketchVm`
- kept the pass frontend-local to the real canvas handoff seam and did not reopen evaluator, selector, or node-template copy logic
- preserved the existing direct `NodeView` extrude-template behavior while making the actual canvas render path consume the same selector-owned extrude truth

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`

## [x] Attempt 4 Chunk 2 - Re-Prove The Visible Extrude Row States On The Real Canvas Path

### Goal

Prove that the visible canvas extrude node now consumes the forwarded vm truth end-to-end.

### Required Work

- add focused coverage that renders through `SpaghettiCanvas`, an editor harness, or the closest real canvas path rather than calling `NodeView` directly
- assert the live row text for:
  - resolved aggregate `SketchProfiles`
  - resolved `SolidBodies`
- confirm the actual rendered node no longer shows the stale empty and waiting copy seen in the screenshots

### Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- any nearby canvas integration harness already used for live-node rendering proof

### Proof

- one aggregate `SketchProfiles -> Extrude` graph rendered through the canvas shows collection-ready profile copy
- one `New Objects` extrude rendered through the canvas shows `SolidBodies` as ready when body output already exists

### Implemented Result

- added `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` as the first real canvas-path regression for this bug family
- rendered `SpaghettiCanvas` against a proving graph with:
  - one `Geometry/Sketch`
  - one `Geometry/Extrude`
  - one aggregate `SketchProfiles -> ExtrusionProfile` edge
- asserted directly on the rendered live extrude node that:
  - the `SketchProfiles` input row shows `Parent collection`
  - the row no longer falls back to `No SketchProfiles contributors yet`
  - the `SolidBodies` output row shows `Ready`
  - the row no longer falls back to `Waiting`
- this new real-canvas regression would fail again if the `extrudeVm` handoff were removed, so it substantially covers the originally planned chunk-3 guard as well

### Verification

- `npm.cmd exec vitest run src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

## [absorbed] Attempt 4 Chunk 3 - Close The Frontend Drift With A Real Regression Guard

### Outcome

This chunk is absorbed by chunk 2.

### Why It Was Absorbed

- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` now renders the real canvas path and asserts the exact visible bug-17 symptom pair is gone
- removing the `extrudeVm` handoff would break that regression
- there is no remaining distinct chunk-3 implementation work needed after chunk 2

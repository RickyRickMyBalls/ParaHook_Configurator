# Extrude Type Row Source-Of-Truth Split

## Status
- Fixed on `2026-04-05`

## Summary
- The live `Geometry/Extrude` `Type` row could display `Body` while the built result behaved like `Walls`.
- This made the visible arrows, menu selection, and drag behavior feel broken even when the authored node param had already changed.

## User-Visible Symptoms
- Clicking `Walls` in the `Type` row could appear to do nothing.
- The `Type` row could remain on `Body` after visible interaction.
- The generated extrude could still behave like `Walls` even while the row read `Body`.
- The visible `SolidBody` summary could disagree with the actual runtime geometry result.

## Root Cause
- The runtime/compiler path was already using `node.params.extrudeType`.
- The live node UI in `src/app/spaghetti/canvas/NodeView.tsx` was still reading unwired `Type` state from `extrudeVm`.
- That created two competing truths:
  - authored/runtime truth from `node.params.extrudeType`
  - visible row truth from `extrudeVm`

## Fix
- `Geometry/Extrude` now follows the same ownership contract already proven by `Depth`:
  - no wire:
    - use local authored `node.params.extrudeType`
  - real `Type` wire present:
    - use the effective wire-driven selector value from `extrudeVm`
- The visible `SolidBody` summary now follows that same ownership rule.

## Main Files
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/worker/cad/featureStackRuntime.ts`

## Notes
- The final repair landed under `Extrude 3.1 Phase 8 - Type Row And Runtime Source Of Truth Trace`.
- This bug is a good reference case for future primitive-row work:
  - unwired rows must read from local authored params
  - driven rows must read from effective wire-owned values

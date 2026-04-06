# Browser-9.5 - Library Object Rows And Direct Placement Drag

## Summary

Implemented the Fusion-style direct-placement follow-on so source/library rows like `XL.step` now read as Browser `Object` rows and can drag directly into the working hierarchy.

Shipped result:
- source/library rows in `References` now render as structural Browser `Object` rows instead of `reference-item` rows
- Browser can start the same visible drag interaction from those source/library object rows
- dropping a source/library object creates a landed imported working object under the chosen owner
- the visible drag grammar stays shared:
  - `before`
  - `after`
  - `into`
- landed-object rearrange still commits through `moveProjectContentOwner(...)`
- current `reference-item` workspace-target compatibility remains in place for selection, Console routing, and transform entry

## What Landed

- added a Browser-level draggable target widening so drag sessions can distinguish:
  - existing landed content owners
  - source/library object rows
- added a separate store placement seam for source-object drag that lands a new imported working object without overloading the existing move seam
- updated Browser row derivation so source/library reference rows render through the `object` row shell with source-reference metadata
- widened Browser controller, row actions, context menu, interaction routing, and presenter seams so source-reference object rows keep reference-backed behavior where needed
- added regression coverage for the new source-row object rendering and kept the focused Browser/store drag suite passing

## Notes

This shipped phase intentionally keeps:
- the current `reference-item` workspace-target compatibility seam
- current imported/reference transform routing
- the existing landed imported-object maintenance path

This phase does not yet cover:
- shared transform-backend convergence between imported and generated objects
- deeper source/library versus landed identity cleanup for every older imported-reference edge case

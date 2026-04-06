# Browser-9.6 - Placement Shelf Removal And Single Object Identity

## Summary

Implemented the no-copy Browser follow-on so rows like `XL.step` in `References` now move as the same reference-backed object instead of creating a second landed copy during ordinary drag.

Shipped result:
- built-in manifest/library rows now have stable reference-backed owner identity in store before drag begins
- ordinary Browser drag from `References` now uses the shared `imported-reference` owner move seam instead of the temporary `source-reference` placement branch
- dragging `XL.step` from `References` into `Assembly 1` now moves that same object into the new owner path
- manifest/library rows only remain in the `References` branch while they have no content parent
- once parented into content, those rows render in the content hierarchy as reference-backed object rows without creating a duplicate record
- current `reference-item` selection, Console routing, and transform compatibility stayed adapter-backed during the identity cleanup

## What Landed

- seeded the built-in manifest rows into the shared reference-backed record map with `sourceKind` and `categoryId` metadata so Browser no longer needs a second hidden source-only identity for ordinary drag
- updated Browser row selection/derivation so manifest rows with content parents move out of the `References` branch and into the content hierarchy
- changed Browser drag start to treat both source-reference and imported-reference object rows as the same reference-backed owner target during ordinary drag
- removed the controller-level copy-on-drop behavior from normal Browser drag and reused `moveProjectContentOwner(...)` for the moved reference-backed object
- added regression coverage for:
  - moving a built-in manifest reference-backed object through the shared move seam
  - rendering a manifest object in content once it gains a landing parent

## Notes

This shipped phase intentionally keeps:
- the current `reference-item` workspace-target compatibility seam
- the existing reference-backed transform routing
- the separate explicit placement seam available for later duplicate/import/place actions if needed

This phase does not yet cover:
- a later explicit duplicate/place command surface for reference-backed objects
- deeper shared transform-backend convergence between imported and generated content

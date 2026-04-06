# Browser-9.4 - Imported Object Promotion To True Content Owners

## Summary

Promoted landed imported/reference-backed object rows into true Browser content owners, so they can participate in normal content drag/rearrange behavior while keeping the current imported-object transform seam intact.

Shipped result:
- landed imported object rows now resolve as true content-owner drag targets in Browser
- imported rows can reorder and reparent under valid `Assembly` / `Component` owners through the same shared move seam as other content owners
- imported rows still select back to the existing `reference-item` target so current reference transform compatibility stays intact
- imported objects keep their darker/static imported-object treatment instead of collapsing into generated/loading row styling

## What Landed

- added an explicit imported-reference owner target in the shared content-owner typing instead of treating landed imports as Browser-only presentation
- extended content-owner resolution, legality, and move/reparent logic so imported rows participate in the shared Browser drag model
- introduced mixed per-parent content ordering so authored content rows and imported object rows can interleave honestly under the same assembly/component parent
- updated Browser content-tree derivation so imported rows render in the working hierarchy using that mixed order while staying compatible with current reference-backed selection/transform routing
- added regression coverage for imported-row ordering and imported-row reparenting through the shared move seam

## Notes

This shipped phase intentionally stops short of:
- shared transform-backend convergence between imported and generated objects
- changing imported-object visual treatment into generated/loading treatment
- promoting Browser-local imported `Part` rows into shared workspace `part` targets

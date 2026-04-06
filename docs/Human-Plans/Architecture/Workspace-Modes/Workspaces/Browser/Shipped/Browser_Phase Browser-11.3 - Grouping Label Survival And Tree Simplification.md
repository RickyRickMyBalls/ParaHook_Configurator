# Browser-11.3 - Grouping Label Survival And Tree Simplification

## Doc Header

### Doc History
1. 2026-03-29 09:21: Marked `Browser-11.3 - Grouping Label Survival And Tree Simplification` shipped after the live Browser stopped rendering the historical `User References` grouping row, flattened those imported object rows directly under the surviving real `References` assembly, and kept `References`, `Footpads`, `Shoes`, and `Premade Foothooks` as the locked first-pass real grouping structure

## Doc Body

## Summary

Simplify the live Browser tree by keeping only the grouping labels that still reflect real project structure.

Shipped outcome:
- `References` remains a real top-level assembly
- `Footpads`, `Shoes`, and `Premade Foothooks` remain real grouping components
- the live Browser no longer renders `User References` as a historical grouping parent
- imported rows that previously sat under `User References` now flatten directly under the surviving `References` assembly
- surviving grouping rows keep their ordinary owner actions instead of relying on a separate category-only presentation model

## What Landed

- removed the visible `User References` grouping row from the live Browser-facing content tree
- flattened ungrouped imported reference rows directly under `References` in both the shared store selector path and the fallback Browser-row derivation path
- updated the effective `References` assembly owner record so those flattened imported rows participate honestly in root child ordering under the surviving assembly
- kept the underlying `referenceWorkspace` compatibility category metadata intact for runtime/reference maintenance actions while simplifying only the live Browser tree
- refreshed focused store, selector, and Browser panel tests so the shipped Browser shape now reflects the surviving grouping-label set

## Scope / Constraints Honored

- kept the change narrowly focused on grouping-label survival and tree simplification instead of widening into Browser-11.4 compatibility-seam retirement
- preserved `References`, `Footpads`, `Shoes`, and `Premade Foothooks` as the locked first-pass real structure instead of flattening them away prematurely
- preserved current runtime/reference behavior by leaving the lower `referenceWorkspace` tree and `user-references` metadata intact where compatibility still needs them

## Follow-On Notes

- Browser-11.3 shipped the first tree-simplification cut, not the full seam deletion pass
- `User References` is now gone from the live Browser tree, but underlying compatibility metadata still exists where runtime/reference flows still use it
- Browser-11.4 remains the follow-on for retiring the leftover adapted-container compatibility seams once the surviving tree shape is settled

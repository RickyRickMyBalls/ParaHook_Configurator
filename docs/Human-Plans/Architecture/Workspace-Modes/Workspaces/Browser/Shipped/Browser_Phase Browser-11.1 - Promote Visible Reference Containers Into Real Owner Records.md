# Browser-11.1 - Promote Visible Reference Containers Into Real Owner Records

## Summary

Implemented the first Browser-11 container-truth cut so visible rows like `References`, `Footpads`, `Shoes`, and `Premade Foothooks` now resolve through effective assembly/component owner records in the shared store owner path instead of living only as ad hoc synthetic Browser-container fallbacks.

Shipped result:
- `References` now resolves as an effective assembly owner record
- visible reference grouping parents now resolve as effective component owner records
- owner-resolution, content-selection, and top-level-assembly helpers now use the same effective owner seam for those containers
- the visible Browser tree shape stays the same while container truth underneath gets more honest
- current special container drag gating and runtime/reference adapters intentionally stay in place for later Browser-11 follow-ons

## What Landed

- added effective reference-container owner-record builders in `src/app/store/useAppStore.ts` for the visible `References` assembly and category component parents
- updated shared store owner selectors in `src/app/store/useAppStore.ts` so `resolveWorkspaceSelectedContentOwnerTarget(...)`, `resolveProjectContentOwnerRecord(...)`, `resolveOwnedContentSelection(...)`, `resolveSingleTargetContentSelection(...)`, and parent-label resolution all read those visible containers through the effective owner-record seam
- updated reference-id resolution in `src/app/store/useAppStore.ts` so selecting `References` or a category parent includes shelf objects as part of that visible owner scope instead of only already-parented reference rows
- updated `selectCurrentProjectTopLevelAssemblies(...)` and the Browser content-row builder in `src/app/store/useAppStore.ts` so visible reference containers are sourced from the same effective owner model before row presentation
- refreshed focused store and Browser panel tests to follow the promoted owner-record contract

## Notes

This shipped phase intentionally keeps:
- current `referenceContainerKind` Browser row traits
- the special non-draggable container rule for visible reference parents
- current reference/runtime/transform compatibility adapters

This phase does not yet cover:
- container drag and reparent parity
- grouping-label survival cleanup
- adapted-container seam retirement

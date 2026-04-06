# Browser-9.7 - Normal Assembly Component Rows For Reference Hierarchy

## Summary

Implemented the Browser container-species cleanup so the reference side of the tree now renders through the same normal assembly/component hierarchy lane as the authored content side.

Shipped result:
- `References` now renders as a normal top-level `Assembly` row in `contentRows`
- `Footpads`, `Shoes`, and `Premade Foothooks` now render as normal `Component` rows under that assembly
- Browser no longer renders those containers through the special `references-root` and `reference-category` row species during normal tree display
- source and imported reference-backed object rows stay visible as normal `Object` rows under those containers or under their landed content owners
- the converged reference containers now travel through the same normal content-row drag preview and row-shell path as authored assemblies/components
- current reference selection, visibility, context-menu, Console, and transform compatibility stayed adapter-backed during the container-row convergence

## What Landed

- rewired Browser row selection/derivation so the `References` root and visible reference grouping containers are emitted into `contentRows` as synthetic `assembly` / `component` rows with explicit reference-container metadata
- kept source-reference and imported-reference object rows on the normal object lane while preserving reference-specific metadata for visibility, styling, and actions
- taught Browser interactions and context menus to treat the converged assembly/component rows as reference-backed compatibility containers for selection, expand/collapse, visibility, and `Load All`
- prevented the synthetic `References` assembly and grouping components from acting like authored draggable owners while still letting them render through the shared content-lane presentation
- updated the row presenter plus content section rendering so these converged rows use the reference-style state bars and nested empty-state messaging without falling back to the authored build-state surface
- refreshed focused Browser tests so the new clean tree shape is treated as the source of truth

## Notes

This shipped phase intentionally keeps:
- the existing `references-root` / `reference-category` workspace-target compatibility seam behind the converged rows
- the current reference-backed transform routing
- the older `reference-item` compatibility types for deeper Browser/Console/viewer adapters that have not been retired yet

This phase does not yet cover:
- deleting the remaining compatibility target kinds from the wider app
- deeper reference/import transform-backend convergence
- any later library/reference catalog redesign

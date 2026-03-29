# Browser-10.2 - Single Browser Tree Derivation

## Summary

Implemented the first Browser tree-derivation cut so the live Browser now renders from one visible content-row lane instead of deriving visible hierarchy from both `contentRows` and a separate `referenceWorkspaceTree`.

Shipped result:
- Browser now derives its live visible tree from unified `contentRows`
- `referenceRows` is no longer the live visible hierarchy lane
- visible reference assembly/category/object rows now come through the same content-row path as authored Browser rows
- `referenceWorkspaceTree` remains only as a compatibility fallback and metadata/runtime support seam, not the primary live Browser hierarchy source
- reference-target selection, Console, viewer, and transform compatibility remain adapter-backed for later Browser-10 routing cleanup

## What Landed

- widened `selectCurrentProjectContentBrowserRows(...)` so the store can emit the visible reference hierarchy through the same `ProjectContentBrowserRowVm[]` lane as authored assemblies, components, and objects
- reworked `selectBrowserTreeRows(...)` so the Browser content tree renders from unified content rows, keeps `referenceRows` empty in the live path, and only uses `referenceWorkspaceTree` as a compatibility fallback when callers still provide old-style fixtures
- simplified `BrowserPanel` content rendering so the Content section no longer depends on a separate `referenceRows` visible lane
- updated Browser controller collapse/import behavior so reference category expand state still maps into the unified collapsed-row model and default import landing prefers real authored assemblies instead of the synthetic `References` root
- refreshed Browser selector/panel tests so they follow the unified content-lane Browser shape

## Notes

This shipped phase intentionally keeps:
- `referenceWorkspaceTree` as a compatibility fallback for older test and adapter callers
- `referenceContainerKind`, `contentOriginKind`, and reference load/runtime styling as row traits on unified content rows
- current `references-root`, `reference-category`, and `reference-item` routing compatibility for later Browser-10.3 cleanup

This phase does not yet cover:
- collapsing Browser, Console, and viewer selection/routing onto one owner-target model
- removing all remaining reference-target compatibility kinds
- final runtime/load-trait cleanup
- compatibility seam retirement

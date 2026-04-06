# Browser-10.3 - Unified Owner Routing Across Browser Console And Viewer

## Summary

Implemented the Browser-10.3 routing cleanup so visible Browser rows now keep their assembly/component/object owner identity across Browser selection, Console context, and viewer reflection instead of being translated back into legacy reference target kinds.

Shipped result:
- converged Browser `assembly`, `component`, and `object` rows now commit selection through those same owner targets
- imported/reference-backed object rows now route through their `object` row ids in Browser drag/selection follow-up paths
- viewer reference picks now resolve back into owner `object` targets while reference highlighting still adapts from owner metadata
- Console owner-label/context helpers now understand reference-backed assembly/component/object owners directly
- legacy `reference-item` targeting remains only as a narrow compatibility seam where runtime/reference actions still need `referenceId`

## What Landed

- widened the shared store owner selectors in `src/app/store/useAppStore.ts` so reference-backed `References` assembly, category-component rows, and imported object rows all resolve through the same owner-selection and resolved-content-selection helpers as normal authored Browser owners
- updated `src/app/panels/browserInteractions.ts` so converged Browser rows stop translating back into `references-root`, `reference-category`, and `reference-item` targets when the visible row is already an `assembly`, `component`, or `object`
- simplified `src/app/panels/useBrowserPanelController.ts` so grouped Browser selection comes from the shared resolved-content payload, imported-reference drag follow-up selection resolves to owner object row ids, and reference transform entry now selects the owner object row before opening the existing transform shell
- updated `src/app/components/ViewerHost.tsx` so viewer highlight derives reference ids from the shared owner-target helper and viewer reference picks commit back into imported owner object targets instead of legacy `reference-item` selection
- widened dependent owner-routing callsites in `src/app/console/ConsoleDock.tsx` and `src/app/components/ReferenceTransformToolbar.tsx` so owner-based reference selection works cleanly through zoom/context and transform-toolbar ownership reads
- refreshed Browser/store/viewer tests to follow the owner-routed selection and highlight contract

## Notes

This shipped phase intentionally keeps:
- `WorkspaceSelectedTarget` support for `references-root`, `reference-category`, and `reference-item` as compatibility kinds
- current runtime/reference actions that still legitimately need `referenceId`
- staged Console navigation compatibility while the broader Browser-10 cleanup continues

This phase does not yet cover:
- Browser-10.4 runtime/load-trait cleanup
- Browser-10.5 compatibility seam retirement
- full removal of legacy reference target kinds from the type surface

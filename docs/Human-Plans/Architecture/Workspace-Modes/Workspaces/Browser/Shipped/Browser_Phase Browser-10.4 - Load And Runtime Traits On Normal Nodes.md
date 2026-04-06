# Browser-10.4 - Load And Runtime Traits On Normal Nodes

## Summary

Implemented the Browser-10.4 runtime-trait cleanup so unified Browser/viewer/Console code now reads shared reference-backed load, visibility, error, transform-override, and part-row truth through one normal-node trait seam instead of scattering direct `referenceWorkspace` map lookups.

Shipped result:
- added one shared reference-backed runtime-trait resolver in the app store
- unified Browser item and content-row derivation behind that shared runtime-trait seam
- narrowed `ViewerHost` and `ConsoleDock` onto the same helper for ordinary load/visibility truth
- kept Browser membership independent from viewer load state
- preserved the current loader, batch, and transform compatibility adapters for later cleanup

## What Landed

- added `resolveReferenceRuntimeTraits(...)` plus the shared internal builder in `src/app/store/useAppStore.ts` so reference-backed normal nodes can read:
  - visibility
  - load state
  - error state
  - transform override
  - part rows
- rewired `selectReferenceWorkspaceItems(...)`, `selectReferenceWorkspaceBrowserTree(...)`, and `selectCurrentProjectContentBrowserRows(...)` in `src/app/store/useAppStore.ts` to reuse the same runtime-trait seam instead of duplicating raw `referenceWorkspace` reads
- updated `src/app/components/ViewerHost.tsx` so post-load visibility restoration goes back through the shared runtime-trait helper instead of directly reading `referenceWorkspace.visibilityById`
- updated `src/app/console/ConsoleDock.tsx` so `reference.loadModel` resolves current load/visibility state from the shared runtime-trait helper
- added regression coverage in `src/app/store/useAppStore.test.ts` to verify that shared runtime traits project consistently through:
  - the direct store helper
  - reference workspace items
  - unified content rows

## Notes

This shipped phase intentionally keeps:
- runtime storage physically under `referenceWorkspace`
- current `referenceLoadBatch` behavior and loader adapters
- current reference/content transform session ownership and compatibility behavior
- Browser/viewer/Console trait presentation layered on normal rows instead of inventing new row kinds

This phase does not yet cover:
- moving runtime storage fully out of `referenceWorkspace`
- loader or transform-backend redesign
- deleting the remaining compatibility seams tracked under `Browser-10.5`

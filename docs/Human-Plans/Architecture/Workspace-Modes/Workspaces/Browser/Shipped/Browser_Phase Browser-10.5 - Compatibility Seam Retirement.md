# Browser-10.5 - Compatibility Seam Retirement

## Summary

Implemented the Browser-10.5 cleanup so the live Browser and Console contract now keeps `References`, category rows, and reference-backed objects on normal `assembly`, `component`, and `object` targets instead of emitting the older special reference-container target kinds.

Shipped result:
- Browser and Console now select `References` as an `assembly`
- Browser and Console now select category rows like `Footpads` as `component` targets
- Browser and Console now select reference-backed object rows as normal `object` targets
- the older `references-root`, `reference-category`, and broad public `reference-item` contract is reduced to compatibility fallback behavior instead of the live primary path
- runtime actions that still need `referenceId` remain supported through owner-first context metadata and helper seams

## What Landed

- updated `src/app/store/useAppStore.ts` so `selectConsoleWorkspaceContextTarget(...)` now resolves owner-first `assembly`, `component`, and `object` contexts for the reference hierarchy while attaching only the narrow metadata still needed for reference load/transform actions
- updated `src/app/console/stagedNavigation.ts` so owner-first assembly/component/object contexts can still sync into the existing reference-focused staged sessions without depending on dedicated public `references-root` / `reference-category` context kinds
- updated `src/app/console/ConsoleDock.tsx` so staged reference navigation commits owner-first workspace targets, and reference zoom now resolves the active reference through the shared `resolveReferenceIdsForWorkspaceTarget(...)` helper instead of requiring `reference-item` selection
- updated `src/app/console/referenceTransformConsole.ts` so reference transform console targeting now points at the real imported object row while still carrying `referenceId` metadata for runtime transform execution
- updated `src/app/store/workspaceIntents.ts` and `src/app/panels/browserInteractions.ts` so reference-focused intent and Browser explicit-selection entry points now map to owner-first object targets instead of perpetuating the older public reference-only selection contract
- refreshed focused Browser/Console/store tests to follow the new owner-first target shape

## Notes

This shipped phase intentionally keeps:
- fallback support for older `references-root`, `reference-category`, and `reference-item` target kinds where compatibility callers still exist
- current runtime reference execution paths that still legitimately need `referenceId`
- current load, retry, remove, zoom, highlight, and transform behavior

This phase does not yet cover:
- deleting every leftover legacy reference target type from the full codebase
- loader/runtime redesign
- transform-backend redesign

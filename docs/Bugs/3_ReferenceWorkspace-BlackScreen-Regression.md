# 3 - Reference Workspace Black Screen Regression

## Doc History
2. 2026-03-16 16:19: Resolved this regression by removing the direct derived-selector hook subscriptions from `BrowserPanel` and `ViewerHost`, switching both surfaces back to stable `referenceWorkspace` slice reads, and rebuilding the derived reference tree/item arrays in `useMemo`
1. 2026-03-16 16:14: Created this bug note to record the new post-`02.4A` black-screen regression where the app again appears to load into a dark empty screen after the reference-workspace update

## Status

- `[resolved]`

## Summary

After the `02.4A` reference-workspace implementation shipped, the app could again:
- load into a dark screen
- lose the normal visible Browser/app shell
- look like a viewer-only background had taken over the page

This looks very similar to the earlier Browser startup crashes.
It is likely not a new viewer-layout issue.
It is more likely another React/Zustand render-crash regression caused by unstable hook snapshots.

## User-Facing Symptom

- the page loads to a dark/black screen after the update
- the normal Browser tree and app shell are missing
- the viewer background remains visible, which makes the failure look like a render or layout takeover instead of a store crash

## Root Cause

The new `02.4A` pass added two direct app-store subscriptions to derived selectors:

- `BrowserPanel` now reads:
  - `useAppStore(selectReferenceWorkspaceBrowserTree)`
- `ViewerHost` now reads:
  - `useAppStore(selectReferenceWorkspaceItems)`

Both selectors build fresh objects/arrays each time they run.

Under the current React 19 + Zustand behavior, that is the same unstable-snapshot pattern that previously caused:

- `The result of getSnapshot should be cached to avoid an infinite loop`
- `Maximum update depth exceeded`

That produced the same failure mode as Bugs 1 and 2:
- a new derived reference-workspace selector was used as a live hook subscription
- React receives a fresh snapshot identity every render
- the render loop destabilizes and the app appears to collapse to a dark screen

## Why This Is The Most Likely Cause

This is the same bug family as:

- `1_BrowserPanel-Startup-Crash.md`
- `2_BrowserPanel-ProjectContent-Selector-Crash.md`

The new `02.4A` implementation introduced exactly the same risky pattern those fixes were trying to eliminate:

- direct subscription to a selector that allocates a fresh array/object snapshot

The visual symptom is also the same class:
- the app looks like a black viewer background
- but the more likely real failure is a Browser/render crash higher in the React tree

## Fix

The fix followed the same rule used in Bugs 1 and 2:

1. Stop subscribing `BrowserPanel` directly to `selectReferenceWorkspaceBrowserTree`.
2. Stop subscribing `ViewerHost` directly to `selectReferenceWorkspaceItems`.
3. Subscribe only to stable store slices instead:
   - `referenceWorkspace`
   - any other primitive/stable slices actually needed
4. Rebuild the reference Browser tree and the visible reference item list inside `useMemo`.

## Likely Files

- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- possibly `src/app/panels/selectBrowserTreeRows.ts` if a memoized rebuild seam is needed

## Verification

Verified with:

- `cmd /c npx tsc -p tsconfig.json --noEmit`
- `cmd /c npx vitest run src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts src/app/panels/selectBrowserTreeRows.test.ts`

Confirmed after fix:

- the app no longer boots into a dark/black screen after the `02.4A` update
- `BrowserPanel` does not directly subscribe to a derived reference-tree selector
- `ViewerHost` does not directly subscribe to a derived reference-item array selector
- the Browser `References` subtree still renders correctly after the selector-stability fix

## Notes

This note intentionally follows the same shape as Bug 2 because the new regression is most likely the same technical class, just reintroduced through the reference-workspace feature.

If that suspicion is confirmed, the forward rule stays the same:
- direct hook subscriptions should use stable store slices
- derived Browser/viewer arrays and objects should be rebuilt in `useMemo` or otherwise cached before React subscribes to them

# 2 - BrowserPanel Project Content Selector Crash

## Doc History
1. 2026-03-12 21:08: Created this bug note to record the `12B` startup-crash regression where the new project-content Browser subscription reintroduced the same unstable-selector failure pattern that previously hit the Browser after `11B`

## Status

- `[resolved]`

## Summary

After `GE - Phase 12B - Project Content Tree Ownership` shipped, the app could again:
- load briefly
- lose the normal left-dock UI
- look like a dark viewer/editor overlay had taken over the whole screen

This was not a new floating-window layout bug.
It was another React render crash inside `BrowserPanel`.

## User-Facing Symptom

- startup could succeed for a moment and then the Browser/app shell would disappear
- the remaining dark viewport background made it look like a full-screen overlay issue
- the bug looked visually similar to the earlier Browser startup crash even though the new trigger came from the `12B` project-content work

## Root Cause

`BrowserPanel` subscribed to app state with:

- `useAppStore(selectCurrentProjectContentBrowserRows)`

That selector builds and returns a new array every time it runs.

Under the current React 19 + Zustand behavior, that unstable snapshot could again trigger:

- `The result of getSnapshot should be cached to avoid an infinite loop`
- `Maximum update depth exceeded`

So the new `12B` Browser content section reintroduced the same selector-instability class that had already been fixed for cached graph rows.

## Why It Happened

`12B` added a thin Browser read surface for:

- `Assembly Root`
- project-owned `Component` rows

The implementation reused a derived selector:

- `selectCurrentProjectContentBrowserRows`

That selector is fine for plain reads and tests, but not as a direct live Zustand hook subscription because it allocates a fresh array on every call.

There was also a smaller related risk in spaghetti viewer-target selectors that used:

- `?? []`

Those fallbacks also create fresh arrays when the viewer target is absent.

## Fix

The fix was:

1. Stop subscribing `BrowserPanel` directly to `selectCurrentProjectContentBrowserRows`.
2. Subscribe only to stable app-store slices:
   - `currentProject`
   - `projectContent`
3. Rebuild the Browser project-content rows inside `useMemo`.
4. Harden the spaghetti build-output selectors to use one shared empty-array constant instead of fresh `?? []` fallbacks.

## Files Changed

- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

## Final Behavior After Fix

- the app root stays mounted after startup
- the Browser `Content` section can render the `Assembly Root -> Component` surface without crashing React
- the left dock remains visible
- the viewer-target output selectors no longer create fresh empty arrays when no viewer target is set

## Verification

Verified with:

- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/store/useAppStore.test.ts`
- `npm.cmd run build`

Confirmed after fix:

- `BrowserPanel` no longer subscribes to a derived array selector for project content
- spaghetti output selectors now reuse a stable shared empty array fallback
- all targeted tests passed
- production build passed

## Notes

This is the same bug family as:

- `1_BrowserPanel-Startup-Crash.md`

The repeated failure mode is:
- a selector that returns a fresh array or object is safe for direct reads
- that same selector is not safe as a live React/Zustand subscription unless its snapshot identity is stable

Future rule:
- Browser- and viewer-facing hook subscriptions should read stable store slices
- derived arrays/objects should be rebuilt in `useMemo` or otherwise cached before React subscribes to them

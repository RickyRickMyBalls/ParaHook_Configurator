# 1 - BrowserPanel Startup Crash

## Doc History
1. 2026-03-10 21:20: Created this bug note to record the startup crash that made the app look like a full-screen viewport overlay after the `11B` Browser changes

## Status

- `[resolved]`

## Summary

This bug looked like:
- the app loaded for a moment
- then the main UI disappeared
- the screen was left looking like a dark full-screen viewport or editor overlay

The real issue was not an editor viewport opening on top of everything.
The real issue was a React render crash inside `BrowserPanel`.

## User-Facing Symptom

- the left dock and normal app UI vanished after startup
- the page looked like a giant floating viewport had covered the whole app
- refreshing did not clearly explain the cause because the viewer background was still visible

## Root Cause

`BrowserPanel` subscribed to Zustand with:

- `useSpaghettiStore(selectOrderedCachedGraphEntries)`

That selector builds and returns a new array every render.

Under the current React 19 + Zustand behavior, that unstable snapshot caused:

- `The result of getSnapshot should be cached to avoid an infinite loop`
- `Maximum update depth exceeded`

Once `BrowserPanel` crashed, the React root effectively died and the remaining dark viewer background made the app look like a viewport-overlay bug.

## Why It Happened

`11B` introduced Browser rows backed by cached graph entries.

The first implementation reused the derived selector:

- `selectOrderedCachedGraphEntries`

That selector is safe for plain reads and tests, but it was not safe as a direct live React subscription because it returned a fresh array on every call.

## Fix

The fix was:

1. Stop subscribing `BrowserPanel` directly to `selectOrderedCachedGraphEntries`.
2. Read stable store slices instead:
   - `cachedGraphEntriesById`
   - `cachedGraphEntryOrder`
3. Rebuild the ordered Browser list inside `useMemo`.
4. Remove the earlier wrong startup workaround in `AppShell` that forced `inputMode` back to `legacy` on mount.

## Files Changed

- `src/app/panels/BrowserPanel.tsx`
- `src/app/AppShell.tsx`

## Final Behavior After Fix

- the app root stays mounted
- the left dock renders normally
- the Browser renders normally
- no spaghetti floating window appears on first load unless the user actually opens one
- the startup screen no longer looks like a full-screen viewport overlay

## Verification

Verified with:

- `npm.cmd run build`
- headless browser probe against `http://localhost:5173/ParaHook_Configurator/`

Confirmed after fix:

- `.LeftDock` exists
- `.BrowserPanelRoot` exists
- `.SpaghettiFloatingWindow` does not exist on startup
- no `Maximum update depth exceeded` error
- no `getSnapshot` infinite-loop warning

## Notes

This is a good example of a bug whose visual symptom pointed at layout, but whose actual cause was store-subscription instability.

If a future Browser selector returns a new array or object every render, the same class of crash can happen again.

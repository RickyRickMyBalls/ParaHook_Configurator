# 8 - Workspace 5.2 SpaghettiWindowHost Ordered Viewport Selector Black Screen

## Doc History
1. 2026-03-30 13:14: Created this bug note to record the new post-`Workspace 5.2` startup blank-screen regression where the app can load into a dark blue-black shell after the detached-editor widening landed in `SpaghettiWindowHost`

## Status

- `[investigating]`

## Summary

After the first `Workspace 5.2` slice landed, the app can again:
- boot into a dark blue-black screen
- lose the visible Browser and normal app shell
- look similar to the older selector-instability startup failures

The strongest current read is that this is not a new viewport-layout takeover.
It is much more likely another React 19 + Zustand unstable-snapshot regression.

## User-Facing Symptom

- the app loads into a dark blue-black screen
- the expected Browser, title shell, and normal workspace chrome are missing
- the failure looks similar to Bugs 1 through 3, where the background remains visible after the interactive React tree destabilizes

## Strongest Current Likely Cause

`SpaghettiWindowHost` now directly subscribes to:

- `useSpaghettiStore(selectOrderedEditorViewports)`

That selector is defined in `useSpaghettiStore.ts` as:

- `editorViewportOrder.map(...).filter(...)`

which means it builds and returns a fresh array every time it runs.

Under the current React 19 + Zustand behavior, that is the same unstable-snapshot pattern that previously caused:

- `The result of getSnapshot should be cached to avoid an infinite loop`
- `Maximum update depth exceeded`

This exact new direct hook subscription now exists at:

- `src/app/hosts/SpaghettiWindowHost.tsx`

and the selector itself still allocates a new array at:

- `src/app/spaghetti/store/useSpaghettiStore.ts`

## Why This Is The Most Likely Cause

This is the same bug family as:

- `1_BrowserPanel-Startup-Crash.md`
- `2_BrowserPanel-ProjectContent-Selector-Crash.md`
- `3_ReferenceWorkspace-BlackScreen-Regression.md`

The user-facing symptom is also the same class:

- app shell appears to disappear
- dark viewer/background styling remains visible
- the failure looks like layout takeover, but the more likely real cause is a render-loop or render-crash higher in the React tree

The newly introduced risky pattern is also very specific and easy to point at:

- `SpaghettiWindowHost` now subscribes directly to a selector that returns a fresh array
- that direct subscription was widened during the new detached-editor-surface work
- the timing matches the first appearance of the regression

## Most Suspicious Code Seam

- `src/app/hosts/SpaghettiWindowHost.tsx`
  - `const orderedEditorViewports = useSpaghettiStore(selectOrderedEditorViewports)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `selectOrderedEditorViewports(...)`

The new detached-surface flow then derives:

- `detachedEditorViewports`
- per-detached popout rendering

which makes `SpaghettiWindowHost` a startup-critical subscriber in a way it was not before.

## Likely Fix

Follow the same rule that fixed Bugs 1 through 3:

1. Stop subscribing `SpaghettiWindowHost` directly to `selectOrderedEditorViewports`.
2. Subscribe only to stable store slices:
   - `editorViewportsById`
   - `editorViewportOrder`
3. Rebuild the ordered viewport list and detached viewport list inside `useMemo`.
4. Verify the app no longer boots into the dark screen.

## Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- possibly `src/app/AppShell.tsx` if a temporary startup recovery path is needed during investigation

## Verification To Run

- launch the app normally at `http://localhost:5173/ParaHook_Configurator/`
- verify the normal Browser/app shell renders instead of a dark blue-black screen
- verify no `Maximum update depth exceeded` error
- verify no `getSnapshot should be cached` warning
- verify detached editor windows still work after replacing the unstable selector subscription

## Notes

The important read is that this likely is not a brand-new rendering class.
It appears to be the older unstable-derived-selector bug family reintroduced through the new `Workspace 5.2` detached-editor surface widening.

That is good news in one sense:
- the symptom is severe
- but the likely fix pattern is already known

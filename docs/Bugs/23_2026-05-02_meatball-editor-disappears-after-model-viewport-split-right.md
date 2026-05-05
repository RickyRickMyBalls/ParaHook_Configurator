# Bug 23 - Meatball Editor Disappears After Splitting The Model Viewport Right

## Doc History

1. 2026-05-02 09:30:37: Created this bug report after a live repro where the docked meatball editor appears correctly after dragging a Spaghetti editor into the left toolbar, but disappears again when the user splits the model viewport to the right, and recorded the current strongest read as a split between the docked meatball ownership branch and the split / window-mode reclassification path.
2. 2026-05-02 09:46:35: Implemented Attempt 1 by narrowing the repro to stale portal-target ownership during left-dock host remounts, updating `SpaghettiWindowHost` to re-target the meatball and floating portals when workspace layout state changes, and adding the matching AppShell regression for the split-right path.

## Status

- `[investigating]`

## Summary

The docked meatball editor currently works through the first part of the repro:

- load the page
- open a Spaghetti editor window
- drag it into the left toolbar
- the docked meatball editor appears as expected

The bug appears after the next layout step:

- split the model viewport to the right
- the meatball editor disappears from the left toolbar area

That makes this look like a real dock-preservation / surface-ownership bug rather than a simple styling issue.

## User-Facing Symptom

- the user can successfully create the docked meatball editor
- the meatball editor is visible in the left toolbar
- after the model viewport is split right, the meatball editor vanishes
- the main workspace continues running, but the left-dock editor slot no longer shows the meatball surface

## Reproduction

1. Load the app from a fresh page load.
2. Open a Spaghetti editor window.
3. Drag the editor into the left toolbar so it becomes the meatball editor.
4. Confirm the meatball editor is visible in the dock.
5. Split the model viewport to the right.
6. Observe that the meatball editor disappears.

## Current Strong Read

The strongest current read is that the meatball editor is still being owned through a window-mode / viewport-state path that can be reclassified when the model viewport split changes the overall workspace layout.

The most suspicious split is between:

- the docked meatball render branch in `src/app/hosts/SpaghettiWindowHost.tsx`
- the viewport-mode bookkeeping in `src/app/AppShell.tsx`
- the editor window-mode transitions in `src/app/spaghetti/store/useSpaghettiStore.ts`

The relevant runtime reads that stand out are:

- `AppShell` computes `isMeatballDockOccupied` by scanning for `windowMode === 'meatball editor view'`
- `SpaghettiWindowHost` finds the docked meatball surface from `orderedViewportStates.find((viewportState) => viewportState.isMeatballDock)`
- `useSpaghettiStore` still contains special handling for `meatball editor view` alongside split, collapsed, maximized, and separate-window transitions

That suggests the split-right action may be moving or reclassifying the meatball surface in a way that removes it from the dock render path instead of keeping the docked editor alive across the layout change.

## Attempt 1 - Preserve Meatball Dock Ownership Through Split-Right

Tracked in:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Spaghetti-Editor 5 - Meatball Dock Persistence Across Split Layouts.md`

Implemented root-cause read:
- the docked meatball shell is rendered through a portal owned by `SpaghettiWindowHost`
- the primary model-viewport split-right path can remount the left-dock host DOM node
- the old portal-target state was not re-synced when that host node changed, so the meatball editor could stay pointed at a stale detached target and disappear from the live dock

What Attempt 1 should prove:
- the docked meatball editor keeps its dock ownership through a split-right change
- split-right should not silently convert the meatball surface into a plain expanded surface unless the user explicitly undocks or rehomes it
- the left dock should continue to show the meatball editor after the model viewport split finishes

Phase 1 target:
- re-target the meatball portal host when workspace layout changes remount the left dock
- preserve the docked meatball state across the right-split transition
- add one focused regression proving the dock remains occupied after the exact split-right repro path

Implementation status:
- `SpaghettiWindowHost` now re-syncs `dockedMeatballPortalTarget` and `floatingSpaghettiPortalTarget` when workspace placement or slot-layout state changes.
- `AppShell.test.tsx` now includes `keeps the meatball editor docked after splitting the primary model viewport right`.
- Focused host verification passed with `npm.cmd exec vitest run src/app/hosts/SpaghettiWindowHost.test.tsx`.
- The full `AppShell.test.tsx` suite still reports unrelated pre-existing branch failures, so Attempt 1 should be treated as implemented with focused coverage rather than full-suite green.

## Likely Ownership

- `AppShell` owns the left-dock occupancy checks and the top-level view wiring that decides whether the meatball host should stay visible.
- `SpaghettiWindowHost` owns the docked meatball render branch and the editor-surface mode handling.
- `useSpaghettiStore` owns the editor window-mode transitions that may be rewriting the meatball surface into a different placement state during split changes.
- `WorkspaceViewportTree` / workspace split behavior may be the trigger that causes the docked editor to be reclassified or remounted.

## Likely Affected Files

- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`

## Code Evidence

`src/app/AppShell.tsx`:
- derives `isMeatballDockOccupied` from the current editor viewport modes.
- passes meatball dock occupancy down into the workspace viewport tree.

`src/app/hosts/SpaghettiWindowHost.tsx`:
- treats `meatball editor view` as a special docked surface mode.
- renders the docked meatball shell from `orderedViewportStates.find((viewportState) => viewportState.isMeatballDock)`.
- owns the meatball docking, undocking, and related titlebar actions.

`src/app/spaghetti/store/useSpaghettiStore.ts`:
- still has an explicit `meatball editor view` transition branch.
- also keeps split, collapsed, maximized, and separate-window behavior in the same mode-switching machinery.
- expands any other viewport currently in `meatball editor view` when a new one takes that mode, which means the meatball state is still controlled by shared viewport-mode bookkeeping rather than a dedicated dock-ownership record.

`src/app/workspace/WorkspaceViewportTree.tsx`:
- receives the meatball dock occupancy / preview signals from `AppShell`.
- participates in the workspace layout that changes when the model viewport is split.

## Expected Behavior

The meatball editor should remain visible after the user splits the model viewport right.

More specifically:

- the docked meatball editor should stay alive as a left-toolbar presentation
- the model viewport split should not remove or remount the meatball dock surface
- the docked meatball state should survive layout changes the same way the browser dock does

## Suspected Fix Shape

The likely fix is to make the meatball editor survive split-layout changes through one stable dock-owner record instead of relying only on the current `windowMode` / active viewport classification.

Possible repair directions:

- keep the docked meatball surface as its own preserved dock slot when the model viewport splits
- stop the split-right path from reclassifying the meatball editor out of the docked presentation
- make the docked meatball branch rehydrate from canonical dock ownership the same way the other workspace hosts do

The next implementation pass should probably prove which branch is actually dropping the meatball surface before changing the ownership model.

## Acceptance Read

- Drag a Spaghetti editor into the left toolbar and confirm it becomes the meatball editor.
- Split the model viewport right and confirm the meatball editor remains visible.
- Confirm the meatball editor survives the layout change without needing a second manual re-open.
- Add a focused regression covering the exact split-right repro path.

## Notes

This looks like a real layout-ownership regression, not just a cosmetic collapse.
The user report is specifically about the docked editor disappearing after a model viewport split, so the fix should stay centered on dock persistence and surface ownership rather than generic styling or spacing cleanup.

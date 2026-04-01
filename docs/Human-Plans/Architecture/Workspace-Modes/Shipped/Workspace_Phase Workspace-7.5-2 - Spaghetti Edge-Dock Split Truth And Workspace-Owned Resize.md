# Workspace Phase Workspace-7.5-2 - Spaghetti Edge-Dock Split Truth And Workspace-Owned Resize

## Doc Header

### Doc History
1. 2026-04-01 00:57: Closed the `Workspace 7.5-2` implementation and verification checklist after re-checking the shipped Spaghetti split-migration work against the landed workspace-slot split truth, AppShell migration bridge, retired bespoke split branch, and focused verification coverage, so this phase record can now move from `Future/` into `Shipped/` as honest landed history
1. 2026-04-01 00:03: Cleaned up this native `Workspace 7.5-2` subphase doc after a read-only recheck by explicitly naming `AppShell` as a second active owner of old Spaghetti split truth, calling out that split-layout gating, persistence hydration, and split-menu actions still read and write editor-local `split view` state there, and widening the execution plus acceptance language so the implementation cut removes that remaining shell ownership instead of only retiring the bespoke `SpaghettiWindowHost` branch
1. 2026-03-31 23:40: Tightened this native `Workspace 7.5-2` subphase into an implementation-ready Spaghetti split-migration spec by grounding it more explicitly in the live `beginFloatingSpaghettiDrag(...)`, `handleSplitResizeStart(...)`, and `showSplitLayout` seams, locking the first-cut boundary around edge-drop plus split-resize truth, and adding a concrete execution checklist, likely file list, and sharper acceptance plus verification shape for the direct post-`7.5-1` implementation cut
1. 2026-03-31 23:13: Added this native `Workspace 7.5-2` subphase doc to isolate the live Spaghetti drag-to-edge split cleanup after a read-only code pass showed that the current edge-drop gesture still branches between shared detached-surface redock and editor-owned `split view`, with split rendering and resize truth still living inside `SpaghettiWindowHost` instead of the workspace slot tree

### Purpose

Use this phase to migrate the Spaghetti drag-to-side split gesture fully onto the shared workspace shell system.

The goal is to make one edge-dock gesture mean one thing:
- always create or rehome a real workspace split
- never branch back into editor-local `split view` truth

### Scope

This phase covers:
- the drag-to-edge path from floating Spaghetti into a side split
- the split divider resize truth for that same split
- removal of the bespoke `SpaghettiWindowHost` split layout once the workspace tree owns it
- demotion or deletion of editor-owned `split view` shell truth where the workspace layout replaces it

This phase does not cover:
- the initial generic contract extraction from `7.5-1`
- broader feature rewrites inside the graph editor
- the later host-adapter retirement and future-surface onboarding proof

## Doc Body

### Summary

`Workspace 7.5-2` is the direct fix for the current Spaghetti split hybrid.

Today the drag-to-edge gesture is mixed:
- detached Spaghetti surfaces already use shared `redockDetachedSurface(...)`
- non-detached Spaghetti surfaces still fall back to `setEditorViewportSplitDockSide(...)` plus `setEditorViewportWindowMode(..., 'split view')`
- split resize still writes editor-local `splitRatio`
- `SpaghettiWindowHost` still renders its own `viewer + divider + editor` split branch

This phase should make the workspace slot tree the only shell truth for that gesture.

Practical read:
- the user should still be able to drag a floating Spaghetti surface to a viewport edge and get the same visible result
- but that result should now always come from the shared workspace split tree
- `7.5-2` is where the old editor-owned `split view` branch stops being the runtime owner for that gesture

### Current Code Read

Primary seams:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`

Specific live mismatch:
- `beginFloatingSpaghettiDrag(...)` in `SpaghettiWindowHost` still branches between shared redock and editor-local split mode
- `handleSplitResizeStart(...)` still writes `setEditorViewportSplitRatio(...)`
- `showSplitLayout` still gates a bespoke split container inside `SpaghettiWindowHost`
- `AppShell` still restores and mutates editor-local split truth through `showSplitLayout`, split-menu actions, and persistence hydration paths tied to `windowMode === 'split view'`

Concrete live read:
- edge-drop currently branches at `src/app/hosts/SpaghettiWindowHost.tsx`
  - `redockDetachedSurface(editorViewportId, nextSplitDockSide)` for detached surfaces
  - `setEditorViewportSplitDockSide(editorViewportId, nextSplitDockSide)` plus `setEditorViewportWindowMode(editorViewportId, 'split view')` for non-detached surfaces
- split resize still writes editor-local ratio through `setEditorViewportSplitRatio(...)`
- split rendering still happens through the `showSplitLayout` branch that renders `viewer + divider + editor` inside `SpaghettiWindowHost`
- `AppShell` still derives `showSplitLayout` from `windowMode === 'split view'`, hydrates editor-local split ratio/direction/window mode from persisted editor placement, and exposes split-menu actions that still call `setEditorViewportSplitDirection(...)`, `setEditorViewportSplitRatio(...)`, and `setEditorViewportWindowMode(...)`

### Locked Questions / Decisions

#### [x] Workspace 7.5-2 - Question 1 - What should the edge-drop gesture resolve through?

##### Locked Answer
- always through the shared workspace split tree

##### Why
- one user gesture should not land in two shell systems based on incidental current host state

#### [x] Workspace 7.5-2 - Question 2 - What owns split ratio and dock side after migration?

##### Locked Answer
- workspace layout truth
- not editor-local `split view` state

##### Why
- split geometry is shell layout ownership, not graph-editor feature ownership

#### [x] Workspace 7.5-2 - Question 3 - What should happen to `windowMode: 'split view'`?

##### Locked Answer
- it should stop being a source of shell truth for the drag-to-edge split path
- if it survives temporarily, it should be a compatibility projection only

##### Why
- the workspace slot tree must become the honest runtime owner for that split

#### [x] Workspace 7.5-2 - Question 4 - What should the first implementation cut preserve from the current user-facing behavior?

##### Locked Answer
- the edge-drag gesture should still work from the floating Spaghetti shell
- edge targets should still feel like `top` / `right` / `bottom` / `left` docking choices
- the split should still be resizable immediately after docking
- meatball left-dock behavior should stay outside this migration unless the shared split path directly touches it

##### Why
- `7.5-2` is a shell-truth migration, not a UX redesign

#### [x] Workspace 7.5-2 - Question 5 - What is explicitly out of scope for this cut even if the old split path touches it nearby?

##### Locked Answer
- broader graph-editor window-mode cleanup outside the drag-to-edge split path
- `meatball editor view` redesign
- full host-adapter retirement that belongs to `7.5-3`
- speculative multi-surface layout features not required to make this one gesture honest

##### Why
- this cut should stay tightly scoped to the Spaghetti split hybrid instead of ballooning into a larger editor-shell rewrite

### Locked Boundary

`Workspace 7.5-2` is in scope for:
- replacing the drag-to-edge branch that still falls back to editor-owned `split view`
- moving split ratio ownership for this path into workspace layout state
- removing the bespoke `showSplitLayout` render branch once the workspace shell owns the split
- repointing `AppShell` split-layout gating, split-menu actions, and persistence hydration so they no longer recreate editor-owned split truth for the migrated path
- keeping compatibility glue only where needed to stop the old editor-owned split truth from reappearing during the migration

`Workspace 7.5-2` is out of scope for:
- generic contract extraction already handled by `7.5-1`
- full editor window-mode cleanup beyond the drag-to-edge split path
- final host-adapter retirement and future-surface onboarding from `7.5-3`

### Locked Implementation Direction

The implementation should move in this order:

1. make edge-drop always create or rehome a workspace split
2. repoint split resize to workspace layout node ratio updates
3. move the visible split render path out of the bespoke `SpaghettiWindowHost` branch and onto the shared workspace slot tree
4. demote `windowMode: 'split view'` to compatibility-only status for any remaining editor-store paths that still need one bridging cut, including the leftover `AppShell` split-menu and persistence seams

Important rule:
- do not leave two active shell owners for the same drag-to-edge gesture once this cut lands
- if a compatibility seam survives, it should project from workspace truth instead of competing with it

### First Implementation Cut

1. make Spaghetti edge-drop always create or rehome a workspace split
2. rewrite split resize to update workspace split-node ratio instead of editor-local `splitRatio`
3. remove the bespoke split render branch from `SpaghettiWindowHost`
4. demote or delete editor-owned `split view` shell transitions that the workspace layout now replaces, including `AppShell` split-layout gating, split-menu actions, and persistence rehydration for this path

### Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

### Execution Checklist

- [x] Replace the edge-drop fallback so non-detached Spaghetti surfaces also resolve through the shared workspace split tree
- [x] Repoint split-divider resize to `setViewportLayoutSplitRatio(...)` or the equivalent workspace-owned split ratio action
- [x] Remove the bespoke `showSplitLayout` branch from `SpaghettiWindowHost` once the shared workspace render path is active
- [x] Repoint or remove `AppShell` split-layout gating, split-menu actions, and persistence hydration paths that still recreate editor-local `split view` ownership for the migrated drag-to-edge path
- [x] Keep any surviving `split view` editor-store state as compatibility-only projection instead of shell truth
- [x] Add or update focused tests for edge-drop, split resize, and re-float behavior after the migration
- [x] Verify that meatball left-dock behavior still works without reviving the old split owner

### Shipped Read

`Workspace 7.5-2` is now shipped.

What landed:
- Spaghetti edge-drop now always creates or rehomes a real workspace split instead of branching back into editor-owned `split view`
- the bespoke `SpaghettiWindowHost` split container is gone, so the shared workspace slot tree and generic divider own the visible split path
- `AppShell` now migrates legacy `split view` compatibility state into workspace slot truth instead of reviving the old shell
- floating Spaghetti split-menu actions now target real workspace splits rather than the retired bespoke split layout
- any surviving `split view` state now behaves as compatibility-only input rather than live shell ownership

Verification that landed with the shipped implementation:
- `.\node_modules\.bin\tsc.cmd --noEmit`
- `npm.cmd run test -- src/app/hosts/SpaghettiWindowHost.test.tsx`
- `npm.cmd run test -- src/app/AppShell.test.tsx -t "split-priority divider menu|floating spaghetti titlebar context menu|generic workspace divider|does not revive the old split spaghetti title bar|migrates split view compatibility state without exposing the old draggable split title bar|bottom split ghost"`

### Acceptance And Done Shape

`Workspace 7.5-2` is done when:
- dragging Spaghetti to a viewport edge always lands in the shared workspace split tree
- split resize uses workspace-owned split ratio truth
- `SpaghettiWindowHost` no longer needs a bespoke split container for this path
- `AppShell` no longer restores or mutates shell split ownership for this path through editor-local `split view` state
- the user-facing gesture still feels the same while the shell truth becomes honest
- no remaining branch for that gesture can silently recreate editor-owned split truth behind the shared workspace path

### Verification Shape

Minimum verification for `Workspace 7.5-2` should cover:
- dragging a floating Spaghetti surface to each edge creates or rehomes a real workspace split
- resizing that split persists through the workspace layout path
- redocking and re-floating still work without reviving editor-local split ownership
- the migrated path does not break meatball re-dock behavior or the normal floating editor drag loop
- `SpaghettiWindowHost` tests and relevant `AppShell` slot-layout tests still pass for the migrated path

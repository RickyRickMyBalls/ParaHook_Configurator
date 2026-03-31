# Workspace Phase Workspace-7.2c-2 - Left Dock Ref Repoint And Behavior Parity

## Doc Header

### Doc History
4. 2026-03-31 00:05: Checked off `Workspace 7.2c-2` after shipping the live parity cut around Browser preview, Meatball preview, resize, split-toggle, and primary-only attachment, so the new `PrimaryViewportLeftDock` now reads as the real left-dock behavior owner and `7.2c-3` can take over as the old-shell retirement lane
3. 2026-03-30 23:59: Tightened `Workspace 7.2c-2` into an implementation-ready behavior-parity spec by locking the exact live-parity boundary, the concrete code seams, the first-cut sequence, the parity acceptance shape, and the verification checklist now that `7.2c-1` has already landed structurally
2. 2026-03-30 23:34: Updated `Workspace 7.2c-2` after shipping `7.2c-1` so the parity follow-on now explicitly inherits the extracted `PrimaryViewportLeftDock` host and records that the Browser and Meatball dock refs already point at that new host before the remaining live preview and resize parity work begins
1. 2026-03-30 23:26: Added this native `Workspace 7.2c-2` subphase doc to isolate the second left-dock-unification cut around ref rewiring, preview parity, and resize behavior after the new primary-viewport left dock host exists

### Purpose

Use this subphase to make the new primary viewport left dock host behave like the old shell did.

The goal is to preserve:
- Browser dock behavior
- Meatball dock behavior
- dock preview ghosts
- resize rail behavior
- split toggle behavior

while those systems now target the new viewport-local left dock host.

## Doc Body

### Summary

`Workspace 7.2c-2` is the behavior-parity cut after the host extraction.

It should deliver:
- Browser and Meatball host refs pointing at the new dock host
- working preview ghosts
- working resize rail and split toggle
- working left-split attachment to the primary viewport

Practical read:
- `7.2c-1` already moved the whole top-left family under one primary-viewport-local host
- `7.2c-2` should now prove that this new host is the real live dock target instead of only the new markup owner
- this subphase should finish parity before `7.2c-3` deletes the old shell outright

### Locked Direction

`Workspace 7.2c-2` should be:
- a live behavior-parity cut
- a ref-target and preview-target verification cut
- a primary-viewport ownership proof

`Workspace 7.2c-2` should not be:
- a broad Browser runtime rewrite
- a broad Meatball runtime rewrite
- an old-shell deletion pass
- a generic layout-polish or offset-tuning phase

### Scope

This subphase covers:
- re-pointing Browser dock refs into the new host
- re-pointing Meatball dock refs into the new host
- keeping `useAppShellDockController` behavior working with the new host
- keeping dock preview detection and resize detection correct
- proving the unified left dock stays attached only to the primary model viewport through slot changes

This subphase does not cover:
- final deletion of the old app-global left dock shell
- major Browser or Spaghetti runtime rewrites

### Current Code Read

Current shipped seam after `7.2c-1`:
- `PrimaryViewportLeftDock` now exists under `src/app/workspace/`
- the top-left family now mounts from the primary `modelViewer` slot path instead of the old app-global shell
- Browser and Meatball refs already point structurally at that new host
- the remaining risk is no longer markup ownership, but live parity:
  - preview ghosts
  - resize rail behavior
  - split toggle behavior
  - primary-viewport-only attachment through slot changes

Main reason this subphase exists:
- the user should not be able to tell whether the left dock is running on the old shell or the new host
- after `7.2c-2`, the left dock should feel fully native to the primary viewport
- only then is `7.2c-3` safe to delete the old shell path

### Progress Checklist

Current progress read:
- `7.2c-2` is now shipped
- the extracted `PrimaryViewportLeftDock` host is now also the real live left-dock behavior owner
- `7.2c-3` is now the active next lane for deleting more of the old shell assumptions once that parity proof is in place

- [x] Re-point Browser dock refs to the new primary viewport left dock host
- [x] Re-point Meatball dock refs to the new primary viewport left dock host
- [x] Keep Browser dock previews working
- [x] Keep Meatball dock previews working
- [x] Keep resize rail width changes working
- [x] Keep split toggle behavior working
- [x] Prove the unified left dock stays attached only to the primary viewport after `Split Left`
- [x] Prove the unified left dock stays attached only to the primary viewport after other slot layout changes

### First-Cut Sequence

Recommended order:
1. prove Browser dock preview and dock-target hit testing still uses the new host correctly
2. prove Meatball dock preview and dock-target hit testing still uses the new host correctly
3. prove resize rail width changes still update the same shared dock width truth
4. prove split toggle behavior still uses the new host without drifting away from the primary viewport
5. prove the unified host stays attached only to the primary `Model Viewport` after `Split Left`, `Split Right`, and deeper slot-tree changes
6. only after those parity checks pass, mark `7.2c-2` shipped and move shell deletion to `7.2c-3`

### Locked Outcome

At the end of `7.2c-2`:
- the new left dock host is not just structural, it is the real live dock target
- the primary viewport owns the full top-left toolbar/dock behavior
- the old shell is ready for retirement in `7.2c-3`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2c - Primary Viewport Left Dock Unification.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/theme/shell/docks.css`

### Likely Files

- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/theme/shell/docks.css`

### Questions / Decisions

#### [x] Workspace 7.2c-2 - Question 1 - What is the exact job of this subphase?

##### Locked Answer
- keep the new `PrimaryViewportLeftDock` host
- make it behave like the old live dock target did
- stop short of deleting the old shell until parity is proven

##### Why
- `7.2c-1` already handled structural ownership
- `7.2c-2` should now prove behavior
- `7.2c-3` can then safely do the final retirement cleanup

#### [x] Workspace 7.2c-2 - Question 2 - What behavior must stay visibly intact during this cut?

##### Locked Answer
- Browser dock preview and dock target behavior
- Meatball dock preview and dock target behavior
- left-dock resize rail behavior
- left-dock split toggle behavior
- primary-viewport-only attachment during slot changes

##### Why
- those are the user-facing parity seams that still make the old shell feel alive
- if they drift during `7.2c-2`, the new host is not actually ready to replace the old one

### Verification Shape

Focused verification should cover:
- Browser dock and undock still work
- Meatball dock and undock still work
- resize rail still changes dock width
- preview ghosts still appear correctly
- the unified host stays with the primary viewport after left/right slot changes

Recommended manual checks:
- drag Browser in and out of the unified left dock and confirm preview ghosts still target the primary viewport host correctly
- drag Meatball in and out of the unified left dock and confirm preview ghosts still target the same host correctly
- resize the left dock and confirm the full unified stack moves together
- use `Split Left`, `Split Right`, and one deeper slot split and confirm the unified left dock stays attached only to the primary `Model Viewport`

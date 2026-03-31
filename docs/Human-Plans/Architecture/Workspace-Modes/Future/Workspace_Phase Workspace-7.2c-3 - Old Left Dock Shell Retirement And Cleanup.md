# Workspace Phase Workspace-7.2c-3 - Old Left Dock Shell Retirement And Cleanup

## Doc Header

### Doc History
3. 2026-03-31 00:36: Checked off `Workspace 7.2c-3` after shipping the old-shell retirement cleanup, so the phase now records that the live left-dock route no longer depends on `.LeftDock` DOM or resize-menu naming, the focused left-dock parity bundle still passes under `PrimaryViewportLeftDock`, and the umbrella lane can now hand forward to `Workspace 7.3`
2. 2026-03-31 00:11: Tightened `Workspace 7.2c-3` into an implementation-ready old-shell-retirement spec by locking the exact cleanup boundary, the concrete code seams, the first-cut sequence, a small locked question set, and the acceptance plus verification shape now that `7.2c-1` and `7.2c-2` have already landed
1. 2026-03-30 23:26: Added this native `Workspace 7.2c-3` subphase doc to isolate the final left-dock-unification cut around retiring the old app-global left dock shell after the new primary-viewport host owns the live behavior

### Purpose

Use this subphase to retire the old app-global left dock shell once the new primary viewport-owned host is proven.

The goal is to stop carrying two overlapping left-dock ownership models.

## Doc Body

### Summary

`Workspace 7.2c-3` is the retirement and cleanup cut.

It should deliver:
- removal or emptying of the old app-global `.LeftDock` shell
- cleanup of leftover CSS and DOM assumptions
- one clear primary-viewport-owned left dock path

Practical read:
- `7.2c-1` already moved the full left-dock family under `PrimaryViewportLeftDock`
- `7.2c-2` already proved Browser preview, Meatball preview, resize, split toggle, and primary-only attachment on top of that new host
- `7.2c-3` should now delete the meaningful remaining old-shell residue instead of leaving two ownership stories alive

### Locked Direction

`Workspace 7.2c-3` should be:
- an old-shell retirement cut
- a CSS and DOM cleanup cut
- a final ownership-convergence cut before `Workspace 7.3`

`Workspace 7.2c-3` should not be:
- a new behavior-design phase
- a broad Browser or Spaghetti runtime rewrite
- a multi-viewport widening phase
- a catch-all visual polish lane

### Scope

This subphase covers:
- deleting or reducing the old `.LeftDock` shell to zero meaningful ownership
- cleaning up old CSS assumptions tied only to that shell
- cleaning up tests to reflect the new ownership model
- deleting or shrinking old left-dock-only wrapper markup in `AppShell`
- making sure Browser and Meatball compatibility routes still work after those old wrappers are gone

This subphase does not cover:
- broader `Workspace 7.3` multiple-model-viewport widening
- generic left docks for every viewport slot
- re-inventing Browser or Meatball host behavior that `7.2c-2` already proved

### Current Code Read

Current shipped seam after `7.2c-2`:
- `PrimaryViewportLeftDock` is now the structural and live behavior owner
- Browser and Meatball preview, resize, split toggle, and primary-only attachment are already proven on that new host
- the remaining work is mostly cleanup:
  - removing old app-global left-dock wrapper ownership
  - removing stale CSS that still speaks as if `.LeftDock` is app-global shell chrome
  - updating tests that still read old-shell structure instead of the new primary-viewport host

Main reason this subphase exists:
- the code should stop telling two stories about the left dock
- after `7.2c-3`, the only real top-left dock path should be the primary-viewport-owned host
- that cleaner ownership is what `Workspace 7.3` should build on

### Progress Checklist

- [x] Remove or empty the old app-global `.LeftDock` shell
- [x] Remove stale AppShell wrapper assumptions that only existed for the old shell
- [x] Remove stale CSS that only supported the old app-global shell
- [x] Remove stale test assumptions that still expect the old shell to own the left dock
- [x] Re-run the full left-dock parity QA pass
- [x] Mark `Workspace 7.2c` complete

### First-Cut Sequence

Recommended order:
1. identify the remaining `.LeftDock` app-global shell markup and decide whether it should be deleted outright or left as a zero-ownership compatibility wrapper
2. delete or flatten that old shell path in `AppShell` so the primary viewport-local host is the only meaningful left-dock owner
3. remove stale CSS selectors that only existed to support the old app-global dock shell
4. update tests so they assert the new ownership model instead of the old shell structure
5. re-run the focused Browser / Meatball / resize / split parity checks
6. only after those pass, mark `7.2c` complete and hand the lane forward to `7.3`

### Locked Outcome

At the end of `7.2c-3`:
- there is one honest ownership path for the top-left dock family
- the primary viewport owns it
- `Workspace 7.3` can build on that cleaner ownership model instead of inheriting more old shell residue

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2c - Primary Viewport Left Dock Unification.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/shell/docks.css`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/theme/shell/docks.css`
- `src/app/theme/foundation/base.css`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`

### Questions / Decisions

#### [x] Workspace 7.2c-3 - Question 1 - What is the exact job of this subphase?

##### Locked Answer
- remove the meaningful remaining old app-global left-dock shell ownership
- keep the new `PrimaryViewportLeftDock` as the only real left-dock owner
- stop short of broader `7.3` viewer-runtime widening

##### Why
- `7.2c-1` already handled structure
- `7.2c-2` already handled live parity
- `7.2c-3` should now finish ownership convergence before the next family widens

#### [x] Workspace 7.2c-3 - Question 2 - What behavior must stay visibly intact during this cleanup?

##### Locked Answer
- Browser dock preview and redock behavior
- Meatball dock preview and redock behavior
- resize rail behavior
- split toggle behavior
- primary-viewport-only left-dock attachment

##### Why
- retiring old shell residue is only safe if those already-proven behaviors remain unchanged
- otherwise this subphase would be re-opening `7.2c-2` instead of finishing cleanup

### Verification Shape

Focused verification should cover:
- no duplicate left-dock shell remains
- Browser and Meatball still behave correctly
- the status card and resize rail still belong to the primary viewport only

Recommended manual checks:
- confirm the left dock still renders only under the primary model viewport after `Split Left`, `Split Right`, and one deeper nested slot split
- drag Browser and Meatball in and out of the dock and confirm preview plus re-dock still work after the old shell cleanup
- resize the dock and toggle the split from the same unified host and confirm nothing regressed

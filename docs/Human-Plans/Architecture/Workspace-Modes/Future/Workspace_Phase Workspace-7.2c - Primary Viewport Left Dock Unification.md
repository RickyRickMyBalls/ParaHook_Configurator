# Workspace Phase Workspace-7.2c - Primary Viewport Left Dock Unification

## Doc Header

### Doc History
5. 2026-03-31 00:36: Updated `Workspace 7.2c` after shipping `7.2c-3`, so the umbrella checklist now records the old-shell retirement and cleanup lane as landed, the full left-dock-unification family as complete, and the next `Workspace 7` execution surface as `Workspace 7.3`
4. 2026-03-31 00:05: Updated `Workspace 7.2c` after shipping `7.2c-2`, so the umbrella checklist now records the live Browser / Meatball preview, resize, split-toggle, and primary-only-attachment parity work as landed and moves the active execution lane forward to `7.2c-3` for old-shell retirement
3. 2026-03-30 23:34: Updated `Workspace 7.2c` after shipping `7.2c-1`, so the umbrella checklist now records the structural extraction as landed, the Browser and Meatball refs as already re-pointed into the new host, and `7.2c-2` as the active next behavior-parity lane
2. 2026-03-30 23:26: Broke `Workspace 7.2c` into native `7.2c-1` through `7.2c-3` subphase docs so the left-dock-unification work is now staged as host extraction first, behavior-parity rewiring second, and old-shell retirement third
1. 2026-03-30 23:22: Added this native `Workspace 7.2c` follow-on doc to isolate the primary-viewport left-dock unification work into one implementation-ready slice, so the `ParaHook Generator v20` status card, Browser dock, Meatball dock, and resize rail can converge under one viewport-owned host before `Workspace 7.3`

### Purpose

Use this phase to unify the current top-left hybrid chrome into one primary-model-viewport-owned left dock host.

The goal is to stop treating these as separate systems:
- `ParaHook Generator v20`
- `Browser` dock target
- `Meatball Editor` dock target
- left-dock resize rail and preview seam

and instead make them one honest primary viewport local toolbar/dock family.

### Scope

This phase covers:
- one viewport-local left dock host owned by the primary `Model Viewport`
- moving the `TitleStatusBar` into that unified host instead of treating it as a separate viewport overlay card
- moving the docked `Browser` and docked `Meatball Editor` target shells into that same unified host
- moving the left-dock resize rail and split toggle into that same unified host
- keeping the existing Browser and Meatball refs alive, but re-pointing them at the new viewport-local dock host
- making left splits, right splits, and later slot growth keep that whole left dock attached only to the primary model viewport

This phase does not cover:
- full multiple-`Model Viewport` runtime parity
- generic left docks for every viewport slot
- full retirement of every older Browser or Spaghetti compatibility host
- later `Workspace 7.3` viewer-runtime widening

## Doc Body

### Summary

`Workspace 7.2c` is the cleanup slice that turns the current mixed top-left shell into one primary viewport-owned left dock.

It should deliver:
- one `PrimaryViewportLeftDock` style host
- one consistent top-left stack for status, Browser, and Meatball
- one resize rail that belongs to the primary model viewport instead of the app globally
- less overlap and less split-brain between old left-dock shell ownership and the new viewport-slot model

### Why This Exists

This phase existed because the old live reality was split:
- the `ParaHook Generator v20` card had already moved to the primary viewport slot path
- the Browser dock target and Meatball dock target were still carrying older app-global left-dock assumptions
- the resize rail and split toggle were still carrying that older left-dock shell naming too

That means the user still sees one thing, but the code still owns it as two systems:
- a viewport-local status card
- an app-global left dock

This creates layout bugs and makes future `Workspace 7` cleanup harder:
- left splits can make the top-left family feel visually disconnected
- offsets and spacing fixes keep piling up because ownership is still mixed
- the primary viewport cannot honestly own its full left chrome family yet

### Progress Checklist

Current progress read:
- `7.2c-1` is shipped as the structural ownership move
- the full left-dock family now mounts under one primary-viewport-local host
- `7.2c-2` is now shipped as the live parity and behavior-cleanup lane
- `7.2c-3` is now shipped as the old-shell retirement and cleanup lane
- `Workspace 7.2c` is now complete

Current active execution surface:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.3 - Multiple Model Viewports And Per-Viewport Runtime Parity.md`

Checklist:
- [x] Add one viewport-local left dock host component for the primary model viewport
- [x] Move `TitleStatusBar` into that unified host as the top element of the dock stack
- [x] Move the docked Browser target into that unified host
- [x] Move the docked Meatball target into that unified host
- [x] Move the left-dock resize rail and split toggle into that unified host
- [x] Re-point Browser and Meatball dock refs to the new viewport-local host
- [x] Keep left-dock preview ghosts and resize behavior working under the new host
- [x] Prove the unified host stays attached only to the primary model viewport after `Split Left`
- [x] Prove the unified host stays attached only to the primary model viewport after other slot layout changes
- [x] Remove the old app-global left-dock shell once parity is proven

### Locked Direction

`Workspace 7.2c` should be:
- a primary viewport ownership cleanup
- a left-dock unification phase
- a migration step away from the old app-global dock shell

`Workspace 7.2c` should not be:
- a generic “add more spacing” phase
- a second viewer-runtime widening phase
- a broad redesign of Browser or Meatball behavior
- a replacement for `Workspace 7.3`

### Locked Outcome

At the end of `Workspace 7.2c`:
- the primary model viewport owns one honest left dock host
- `TitleStatusBar`, Browser dock, Meatball dock, and the resize rail all belong to that one host
- left splits and other slot changes do not leave top-left dock chrome floating over unrelated slots
- the old app-global `.LeftDock` shell is either removed or reduced to zero meaningful ownership

### Current Code Read

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/theme/shell/docks.css`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`

Current converged ownership:
- `TitleStatusBar` mounts from the primary viewport slot path in `AppShell`
- Browser and Meatball dock targets now mount only through `PrimaryViewportLeftDock`
- the resize rail and split toggle now mount only through that same primary-viewport-owned host
- the remaining old `.LeftDock` route is retired from the live left-dock path

Important read:
- this is not just a styling problem
- it is one ownership problem
- the right fix is one shared primary-viewport dock host, not more offset tuning

### Questions / Decisions

#### [x] Workspace 7.2c - Question 1 - What should this left dock be treated as in the new workspace model?

##### Locked Answer
- one primary-model-viewport-owned left dock host
- not three separate overlay systems that merely line up visually

##### Why
- the user already experiences these as one toolbar/dock family
- the code should match that read

#### [x] Workspace 7.2c - Question 2 - Which pieces belong inside that unified host?

##### Locked Answer
- `TitleStatusBar`
- Browser dock target
- Meatball dock target
- resize rail
- split toggle
- preview ghost surfaces for those dock targets

##### Why
- those are the full current left-dock chrome family from the user’s point of view

#### [x] Workspace 7.2c - Question 3 - Which viewport should own this unified left dock host?

##### Locked Answer
- the protected primary `Model Viewport`

##### Why
- this matches the current architecture staging
- later multiple-model-viewport growth can generalize from that honest first ownership rule

#### [x] Workspace 7.2c - Question 4 - Should this be solved with more offsets or with one structural host move?

##### Locked Answer
- one structural host move
- not more spacing or anchoring patches

##### Why
- the bug family comes from mixed ownership, not from one bad offset value

### Important Interfaces And Types To Lock

- `PrimaryViewportLeftDock`
  - viewport-local host component
  - top band for `TitleStatusBar`
  - dock stack for Browser and Meatball
  - resize rail and split toggle
- `BrowserDockHost`
  - should still receive a dock target ref
  - but that ref should point at the new primary viewport local host
- `SpaghettiWindowHost`
  - should still receive a meatball dock target ref
  - but that ref should point at the new primary viewport local host

Important rule:
- keep the existing host contracts where possible
- move ownership first
- do not widen behavior unnecessarily in the same slice

### First Implementation Cut

`Workspace 7.2c` should land in this sequence:

1. extract one `PrimaryViewportLeftDock` component from the current `AppShell` left-dock and status-card seams
2. move the `TitleStatusBar` into that unified host
3. move Browser and Meatball dock targets into that unified host
4. move the resize rail and split toggle into that unified host
5. re-point the existing Browser and Meatball refs into that host
6. prove the unified left dock stays attached to the primary viewport through left splits and normal slot changes
7. remove or empty the old app-global `.LeftDock` shell once parity is proven

Subphase ladder:
- `7.2c-1`
  - extract the unified primary viewport left dock host and move the full left-dock family into it structurally
- `7.2c-2`
  - re-point Browser / Meatball refs and restore live resize / preview / dock behavior under that host
- `7.2c-3`
  - retire the old app-global left dock shell and clean up the remaining CSS / test residue

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/theme/shell/docks.css`
- `src/app/theme/foundation/base.css`

### Verification Shape

Manual verification should cover:
- Browser dock still renders and resizes correctly
- Meatball dock still renders and previews correctly
- resize rail still changes dock width correctly
- `Split Left` keeps the whole left dock attached to the primary viewport only
- the status card no longer needs separate overlap fixes because it is part of the same dock host

Focused automated verification should cover:
- primary viewport-only ownership of the unified left dock host
- Browser and Meatball dock target refs still mount and receive content
- left split no longer leaves top-left dock chrome overlapping the secondary slot

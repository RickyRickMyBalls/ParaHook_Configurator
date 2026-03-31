# Workspace Phase Workspace-7.2c-1 - Primary Viewport Left Dock Host Extraction

## Doc Header

### Doc History
3. 2026-03-30 23:34: Checked off `Workspace 7.2c-1` after shipping the structural extraction move, so the phase now records that `PrimaryViewportLeftDock` exists, the full left-dock family moved under it, and the primary model viewport now owns that family structurally before the `7.2c-2` parity rewiring pass
2. 2026-03-30 23:31: Tightened `Workspace 7.2c-1` into an implementation-ready extraction spec by locking the structural-only boundary, the exact left-dock family to move, the first-cut file seams, and the acceptance plus verification shape before behavior-parity rewiring begins
1. 2026-03-30 23:26: Added this native `Workspace 7.2c-1` subphase doc to isolate the first safe left-dock-unification cut around extracting one viewport-local primary left dock host before ref rewiring and old-shell retirement

### Purpose

Use this subphase to extract one viewport-local left dock host for the protected primary model viewport.

The goal is to create one structural home for:
- `ParaHook Generator v20`
- Browser dock target
- Meatball dock target
- left-dock resize rail and split toggle

without changing their live behavior yet beyond the ownership move.

## Doc Body

### Summary

`Workspace 7.2c-1` is the structural extraction cut.

It should deliver:
- one `PrimaryViewportLeftDock` component
- one primary-viewport-local mount point for the whole left dock family
- no more split ownership between viewport-local status and app-global left dock markup

### Locked Direction

`Workspace 7.2c-1` should be:
- a structural extraction cut
- a primary-viewport ownership cut
- a move-the-existing-family-together phase

`Workspace 7.2c-1` should not be:
- a broad Browser behavior rewrite
- a broad Meatball behavior rewrite
- a resize or preview redesign phase
- the old-shell retirement phase itself

### Scope

This subphase covers:
- extracting a new viewport-local left dock host component
- moving the status card, Browser dock target, Meatball dock target, resize rail, split toggle, and ghost slots into it
- mounting that host from the primary model viewport slot path
- keeping the existing runtime behavior as close as possible to current behavior

This subphase does not cover:
- ref rewiring cleanup beyond what is minimally needed to compile
- deeper Browser or Meatball behavior changes
- old app-global left-dock shell deletion

### Progress Checklist

Current progress read:
- `Workspace 7.2c-1` is shipped as the structural ownership move
- the full left-dock family now mounts under one primary-viewport-local host
- `7.2c-2` is now the active next execution surface for parity rewiring and behavior cleanup

- [x] Add `PrimaryViewportLeftDock` under `src/app/workspace/` or another appropriate shell folder
- [x] Move `TitleStatusBar` into that host as the top band
- [x] Move Browser and Meatball dock targets into that host
- [x] Move resize rail and split toggle into that host
- [x] Move preview ghost slots into that host
- [x] Mount that host from the primary `Model Viewport` slot path
- [x] Keep the app compiling and the basic docked UI visible after the move

### Locked Outcome

At the end of `7.2c-1`:
- the primary model viewport owns one extracted left dock host
- the left dock family is structurally together in one place
- later `7.2c-2` can focus on host refs and behavior parity instead of markup ownership

### Current Code Read

Current live split-brain before `7.2c-1`:
- `TitleStatusBar` mounts from the primary viewport slot path
- Browser and Meatball dock shells still live in the older app-global left dock shell
- the left-dock resize rail and split toggle still belong to that older global shell
- left-dock preview and drag behavior still assume that older dock ownership path

Main reason this subphase exists:
- the user experiences one top-left dock family
- the code still owns it as two systems
- more spacing fixes will keep piling up until one shared primary-viewport host owns the whole family structurally

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2c - Primary Viewport Left Dock Unification.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/theme/shell/docks.css`
- `src/app/theme/foundation/base.css`

### Questions / Decisions

#### [x] Workspace 7.2c-1 - Question 1 - What is the exact job of this first subphase?

##### Locked Answer
- extract one `PrimaryViewportLeftDock` style host
- move the existing left-dock family into it structurally
- stop short of broader behavior rewiring and old-shell retirement

##### Why
- this keeps the first cut focused on ownership
- it lets `7.2c-2` handle ref rewiring and parity work from a cleaner base

#### [x] Workspace 7.2c-1 - Question 2 - Which pieces must move together in this structural cut?

##### Locked Answer
- `TitleStatusBar`
- Browser dock target
- Meatball dock target
- left-dock resize rail
- split toggle
- preview ghost slots tied to that dock family

##### Why
- moving only part of the family would keep the ownership split alive

#### [x] Workspace 7.2c-1 - Question 3 - Which viewport owns the extracted host?

##### Locked Answer
- the protected primary `Model Viewport`

##### Why
- that is the honest current viewport owner of this chrome family
- later multiple-model-viewport growth can generalize from that first clean rule

#### [x] Workspace 7.2c-1 - Question 4 - What behavior must remain intentionally stable during this extraction?

##### Locked Answer
- Browser docked rendering should stay visible
- Meatball docked rendering should stay visible
- the resize rail and split toggle should still appear
- existing drag, preview, and resize behavior should stay as close as possible to current behavior until `7.2c-2`

##### Why
- this phase is supposed to move ownership first, not widen behavior risk unnecessarily

### Important Interfaces And Types To Lock

- `PrimaryViewportLeftDock`
  - top band for `TitleStatusBar`
  - dock stack for Browser and Meatball shells
  - resize rail and split toggle
  - preview-ghost region for the current left-dock family
- `PrimaryViewportLeftDockProps`
  - primary viewport ownership context
  - dock width
  - dock refs
  - shell visibility state needed by current Browser and Meatball hosts

Important rule:
- keep Browser and Meatball host contracts as intact as possible in `7.2c-1`
- move their mount home first
- let `7.2c-2` handle the deeper ref and parity rewiring

### First Implementation Cut

`Workspace 7.2c-1` should land in the smallest safe sequence:

1. extract a new `PrimaryViewportLeftDock` component under `src/app/workspace/`
2. move `TitleStatusBar` into that host as the top band
3. move the docked Browser and Meatball target shells into that host
4. move the resize rail and split toggle into that host
5. move the left-dock preview ghost markup into that host
6. mount that host from the primary `Model Viewport` slot path in `AppShell`
7. keep the old app-global shell alive only as temporary scaffolding where needed to compile, but with no new meaningful ownership added

Implementation boundary:
- `7.2c-1` should end once the full family is structurally mounted under one primary-viewport-local host
- `7.2c-2` should begin where live ref rewiring and parity behavior become the main task

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/components/TitleStatusBar.tsx`
- `src/app/theme/shell/docks.css`
- `src/app/theme/foundation/base.css`
- new host component file under `src/app/workspace/` or `src/app/hosts/`

### Acceptance And Done Shape

`Workspace 7.2c-1` is done when:
- one extracted viewport-local left dock host exists for the primary model viewport
- `TitleStatusBar`, Browser dock target, Meatball dock target, resize rail, split toggle, and preview ghosts all live under that host structurally
- the primary viewport slot path mounts that host
- the app still compiles and the docked UI still appears visibly intact after the move
- the remaining work is clearly about ref rewiring and parity, not about finding scattered markup ownership anymore

### Verification Shape

Focused verification should cover:
- the status card still renders
- Browser dock target still renders
- Meatball dock target still renders
- the unified left dock mounts only with the primary model viewport

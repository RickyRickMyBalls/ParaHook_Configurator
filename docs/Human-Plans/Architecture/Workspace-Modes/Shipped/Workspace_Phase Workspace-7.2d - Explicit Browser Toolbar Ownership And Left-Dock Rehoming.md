# Workspace Phase Workspace-7.2d - Explicit Browser Toolbar Ownership And Left-Dock Rehoming

## Doc Header

### Doc History
4. 2026-03-31 16:20: Checked off this shipped `Workspace 7.2d` umbrella record after the landed `7.2d-2` Browser toolbar claim parity work, so the full Browser toolbar-ownership family now reads as complete and ready to move into `Workspace-Modes/Shipped/`
3. 2026-03-31 11:02: Added the native `Workspace 7.2d-2` follow-on doc and refreshed the umbrella phase so `7.2d-1` now reads as the shipped structural owner-state cut while `7.2d-2` becomes the active next execution surface for Browser toolbar claim and rehome parity
2. 2026-03-31 10:47: Broke `Workspace 7.2d` into staged subphases so the Browser toolbar-owner cleanup now starts with a structural `7.2d-1` owner-state and `AppShell` repoint cut before the later dock-left claim and rehoming parity follow-on
1. 2026-03-31 10:41: Added this native `Workspace 7.2d` follow-on doc to isolate the next Browser cleanup around replacing the remaining implicit left-toolbar Browser suppression with explicit toolbar ownership and deterministic left-dock rehoming before `Workspace 7.3`

### Purpose

Use this phase to replace the remaining implicit Browser left-toolbar ownership with one explicit toolbar-owner rule.

The goal is to make the primary viewport left toolbar behave like an honest Browser host again:
- any chosen Browser surface can claim it
- unrelated Browser slots elsewhere do not suppress it
- quick-docking a floating Browser rehomes that exact Browser surface instead of falling back to older singleton assumptions

### Scope

This phase covers:
- adding explicit Browser toolbar-owner truth under workspace state
- removing the broad global Browser-slot suppression rule that still hides the left toolbar when unrelated Browser slots exist elsewhere
- making Browser `dock left` and quick-dock actions explicitly rehome the chosen Browser surface into the primary viewport left toolbar
- making the left-toolbar Browser route independent from unrelated Browser split, floating, and popout copies
- adding regression coverage for the multi-Browser ownership paths that currently make the toolbar Browser disappear

This phase does not cover:
- wider `Workspace 7.3` multiple-`Model Viewport` runtime parity
- a broad Browser redesign beyond toolbar ownership and rehoming truth
- full generic toolbar-owner widening for every future surface kind in the same slice

## Doc Body

### Summary

`Workspace 7.2d` is the Browser toolbar-ownership cleanup that should follow the shipped `7.2c` left-dock-unification work.

It should deliver:
- one explicit Browser surface owner for the primary viewport left toolbar
- deterministic `dock left` behavior for floating Browser surfaces
- no more unrelated Browser slots suppressing or deleting the toolbar Browser route

Practical read:
- `7.2c` already unified the left dock structurally under the primary viewport
- newer Browser multi-surface work now allows slot, floating, and popout copies to coexist
- the remaining bug family comes from one older implicit singleton seam still deciding who "owns" the toolbar Browser
- this cleanup should now stage as `7.2d-1` for structural owner-state repointing first, then a later parity follow-on for dock-left claim behavior

### Locked Direction

`Workspace 7.2d` should be:
- an ownership cleanup phase
- a Browser toolbar rehoming phase
- a deterministic left-dock claim phase before `Workspace 7.3`

`Workspace 7.2d` should not be:
- a broad multi-viewport widening phase
- a general Browser feature redesign
- a catch-all cleanup bucket for unrelated workspace residue

### Scope Read

This phase exists because the current left-toolbar Browser path still tells two different stories:
- the left dock is now structurally owned by `PrimaryViewportLeftDock`
- but Browser visibility inside that toolbar is still partly decided by old global Browser-presence heuristics

That mismatch is what makes flows like this fail:
1. split one Browser into another slot
2. move a different Browser into floating mode
3. quick-dock that floating Browser back to the left toolbar
4. watch the Browser disappear because some other Browser slot still globally suppresses the toolbar route

The real fix is not more suppression tuning.

The real fix is:
- explicit Browser toolbar ownership
- explicit Browser rehoming into that toolbar
- no global "some Browser exists somewhere" rule deciding whether the toolbar Browser may render

### Current Code Read

Current ownership seam:
- `src/app/AppShell.tsx` still computes `suppressLegacyDockedBrowserSurface` from global Browser presence:
  - `browserSlotCount > 0`
  - `activeDetachedBrowserSurface !== null`
- that read is too broad now that Browser can exist in more than one honest host at once

Current supporting seams:
- `rootLeftSplitSlotIds` in `AppShell` already knows how to identify the real root-left slot route
- `BrowserDockHost` already has an explicit quick-dock action for the `<` button
- that quick-dock path currently clears detached split ownership and drops the Browser back into the legacy left-toolbar route
- but it still does not assign an explicit toolbar Browser owner, so other Browser slots can still suppress the route afterward

Main reason this follow-on exists:
- the Browser toolbar route still behaves like a singleton compatibility shell
- the rest of Browser is already moving toward honest multi-surface ownership
- `7.2d` should close that gap before `7.3` widens the model further

### Progress Checklist

Current progress read:
- `Workspace 7.2d` is now staged
- `7.2d-1` is now shipped as the structural owner-state and `AppShell` repoint cut
- `7.2d-2` is now shipped as the Browser toolbar claim and rehome parity cut
- `Workspace 7.2d` is now complete

- [x] Add explicit Browser toolbar-owner state under workspace ownership
- [x] Render the left-toolbar Browser from that explicit owner instead of broad global Browser-slot suppression
- [x] Make Browser quick-dock assign the chosen Browser surface as the toolbar owner
- [x] Make Browser `dock left` release that surface from its previous floating or split-specific host cleanly
- [x] Ensure unrelated Browser slots no longer suppress or delete the left-toolbar Browser route
- [x] Keep Browser popout copies independent until the user explicitly docks one of them left
- [x] Add focused regressions for the disappearing-toolbar Browser paths
- [x] Re-run the focused Browser host-mode parity pass after the ownership cleanup

Current active execution surface:
- none inside `Workspace 7.2d`; this family is shipped and ready to live under `Workspace-Modes/Shipped/`

### First-Cut Sequence

Recommended order:
1. land `7.2d-1` as the structural owner-state and `AppShell` repoint cut
2. land the later parity follow-on that rewires Browser quick-dock and other left-dock claim actions around that explicit owner
3. keep popout-copy Browser behavior independent unless the user explicitly docks that copy into the left toolbar
4. update tests to cover multi-Browser slot, floating, popout, and toolbar-claim interactions
5. re-run the focused Browser parity bundle and only then hand forward to `Workspace 7.3`

Subphase ladder:
- `7.2d-1`
  - add explicit Browser toolbar-owner state
  - repoint `AppShell` away from broad global Browser suppression
- `7.2d-2`
  - make Browser quick-dock and `dock left` claim that owner deterministically
  - close the remaining live rehome parity gaps once the owner seam is real

### Locked Outcome

At the end of `7.2d`:
- the primary viewport left toolbar has one explicit Browser owner
- any chosen Browser surface can claim that toolbar deterministically
- unrelated Browser slots elsewhere do not make the toolbar Browser disappear
- `Workspace 7.3` can widen from a cleaner multi-surface Browser ownership model instead of inheriting one more singleton seam

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2c - Primary Viewport Left Dock Unification.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2d - Question 1 - What is the exact job of this follow-on?

##### Locked Answer
- replace the remaining implicit Browser left-toolbar suppression with explicit toolbar-owner truth
- make Browser `dock left` actions explicitly rehome one chosen Browser surface into the primary viewport left toolbar

##### Why
- the current disappearing-toolbar bug is an ownership problem, not just a layout bug
- the left dock should stop depending on global Browser presence somewhere else in the workspace

#### [x] Workspace 7.2d - Question 2 - What should own the left-toolbar Browser route?

##### Locked Answer
- one explicit Browser surface instance id under workspace state
- not `browserSlotCount`
- not "whichever Browser compatibility shell happened to exist first"

##### Why
- Browser can now exist in slot, floating, and popout forms at the same time
- one explicit owner is the cleanest way to make the toolbar deterministic again

#### [x] Workspace 7.2d - Question 3 - What should Browser `dock left` mean in this model?

##### Locked Answer
- the chosen Browser surface becomes the toolbar owner
- that Browser leaves its previous host cleanly
- the toolbar does not wait for older singleton restore logic to decide what shows up

##### Why
- `dock left` should be a direct rehome action
- anything softer will keep re-opening the same disappearing-toolbar bug family

#### [x] Workspace 7.2d - Question 4 - Should unrelated Browser slots elsewhere suppress the left-toolbar Browser?

##### Locked Answer
- no
- Browser presence in some other slot, float host, or popout copy should not by itself suppress the toolbar Browser route

##### Why
- the toolbar is now a specific viewport-local route under the primary viewport
- unrelated Browser surfaces should not globally erase that route

#### [x] Workspace 7.2d - Question 5 - Should this slice generalize toolbar-owner truth for every surface kind immediately?

##### Locked Answer
- no
- ship the Browser version first
- keep the shape reusable for later widening if Meatball or other left-toolbar surfaces need the same ownership model

##### Why
- Browser is the live failing route today
- a narrower first pass is safer and keeps the cleanup focused

### Verification Shape

Focused verification should cover:
- the left-toolbar Browser no longer disappears when another Browser slot already exists
- quick-docking a floating Browser claims the toolbar deterministically
- popout copies stay independent unless explicitly docked left

Recommended manual checks:
- start with the docked Browser in the left toolbar, split one Browser right, split another Browser top, drag that top Browser into floating, click `<`, and confirm that Browser docks left instead of disappearing while the other split Browser remains
- create a Browser popout copy from the left toolbar, drag the original Browser into floating, quick-dock it back left, and confirm the popout copy stays open while the left toolbar still shows the chosen Browser
- keep one unrelated Browser slot alive elsewhere in the layout and confirm the primary viewport left-toolbar Browser remains visible after repeated float and dock-left cycles

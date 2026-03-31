# Workspace Phase Workspace-7.2d-1 - Browser Toolbar Owner State And AppShell Repoint

## Doc Header

### Doc History
2. 2026-03-31 11:02: Checked off `Workspace 7.2d-1` after shipping the explicit Browser toolbar-owner state plus `AppShell` repoint cut, so the phase now records that Browser toolbar visibility is explicit workspace-owned truth and the later `7.2d-2` claim-parity slice can take over
1. 2026-03-31 10:47: Added this native `Workspace 7.2d-1` subphase doc to isolate the first safe Browser toolbar-ownership cut around adding explicit toolbar-owner state and repointing `AppShell` away from broad global Browser suppression before the later dock-left parity pass

### Purpose

Use this subphase to add explicit Browser toolbar-owner truth and make `AppShell` render the primary left-toolbar Browser from that owner.

The goal is to create one honest structural ownership rule for the Browser toolbar route:
- one explicit Browser owner under workspace state
- no more global `browserSlotCount` suppression deciding whether the toolbar Browser may exist
- a cleaner base for the later dock-left and rehoming parity work

## Doc Body

### Summary

`Workspace 7.2d-1` is the structural Browser-toolbar ownership cut.

It should deliver:
- one explicit Browser toolbar-owner field under workspace state
- one `AppShell` render path keyed off that owner instead of global Browser presence
- one cleaner left-toolbar Browser contract before the later behavior-parity pass

Practical read:
- `7.2c` already made the left dock structurally belong to the primary viewport
- `7.2d` identified that Browser visibility inside that dock still depends on older singleton suppression rules
- `7.2d-1` should replace that structural ownership seam first, before `7.2d-2` widens into live dock-left claim parity

### Locked Direction

`Workspace 7.2d-1` should be:
- a structural ownership cut
- an `AppShell` Browser-route repoint
- a workspace-state truth cleanup

`Workspace 7.2d-1` should not be:
- the full Browser `dock left` parity pass
- a broad Browser runtime redesign
- a general multi-surface cleanup bucket

### Scope

This subphase covers:
- adding explicit Browser toolbar-owner state under workspace ownership
- repointing the primary viewport left-toolbar Browser route in `AppShell` to use that owner
- shrinking or removing the broad `browserSlotCount > 0` suppression logic from the toolbar route
- keeping the docked Browser visible through the new owner seam with minimal behavior churn
- adding focused structural regressions for the explicit owner route

This subphase does not cover:
- fully rewiring every Browser `dock left` action to claim that owner
- full floating/slotted/popout Browser rehoming parity
- the wider multi-Browser claim matrix that belongs to the later follow-on

### Progress Checklist

Current progress read:
- `Workspace 7.2d-1` is now shipped as the first Browser toolbar-owner cleanup cut
- the left dock already belongs structurally to the primary viewport after shipped `7.2c`
- Browser ownership inside that dock is now explicit instead of global and implicit
- `7.2d-2` is now the active next lane for Browser toolbar claim and rehome parity

- [x] Add explicit Browser toolbar-owner state under `src/app/workspace/`
- [x] Repoint the left-toolbar Browser route in `AppShell` to that explicit owner
- [x] Remove or narrow the broad global Browser suppression rule from that toolbar route
- [x] Keep the docked Browser visible under the new owner seam
- [x] Keep the app compiling and the primary left-toolbar Browser route rendering after the repoint

### Locked Outcome

At the end of `7.2d-1`:
- the Browser toolbar route has one explicit workspace-owned owner
- `AppShell` no longer decides toolbar Browser visibility from global Browser presence elsewhere
- the remaining follow-on work is primarily about claim and rehome behavior, not structural ownership

### Current Code Read

Current live seam before `7.2d-1`:
- `src/app/AppShell.tsx` computes `suppressLegacyDockedBrowserSurface` from:
  - `browserSlotCount > 0`
  - `activeDetachedBrowserSurface !== null`
- that logic is still acting like Browser-in-toolbar is a singleton compatibility route
- Browser can now exist honestly in slot, floating, and popout forms at once, so that suppression rule is too broad

Main reason this subphase exists:
- the toolbar route should stop asking "does any Browser exist somewhere?"
- it should instead ask "which Browser surface owns this toolbar?"
- once that owner seam is explicit, the later dock-left parity work can build on a stable base

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2d - Explicit Browser Toolbar Ownership And Left-Dock Rehoming.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2d-1 - Question 1 - What is the exact job of this first subphase?

##### Locked Answer
- add explicit Browser toolbar-owner truth
- repoint `AppShell` so the primary left-toolbar Browser route renders from that owner
- stop short of the broader dock-left claim parity cleanup

##### Why
- this keeps the first cut focused on structural ownership
- it gives the later parity slice one honest owner seam to build on

#### [x] Workspace 7.2d-1 - Question 2 - What should define whether the left-toolbar Browser route exists?

##### Locked Answer
- one explicit Browser surface owner under workspace state
- not total Browser slot count
- not detached Browser presence somewhere else in the workspace

##### Why
- Browser is now multi-surface
- the toolbar route needs a specific owner, not a global presence heuristic

#### [x] Workspace 7.2d-1 - Question 3 - What behavior should stay intentionally stable during this first cut?

##### Locked Answer
- the docked Browser should still render in the primary viewport left toolbar
- Browser slot, floating, and popout routes should keep working as they do today unless the owner repoint requires a minimal adjustment to compile
- broader `dock left` claim semantics can wait for the next subphase

##### Why
- this phase is about ownership truth first
- behavior widening is safer once the structural route no longer depends on the old singleton seam

#### [x] Workspace 7.2d-1 - Question 4 - What remains for the later follow-on after this first cut lands?

##### Locked Answer
- wiring Browser quick-dock and other `dock left` actions to claim the toolbar owner deterministically
- proving unrelated Browser slots no longer interfere with those claim flows
- closing the remaining floating/slotted/popout rehome parity gaps

##### Why
- those are behavior-parity tasks
- they deserve a separate slice once the explicit owner model exists

### Important Interfaces And Types To Lock

- Browser toolbar-owner field under workspace state
  - likely a Browser `surfaceInstanceId`
  - should identify which Browser surface currently owns the primary viewport left toolbar
- `AppShell`
  - should render the left-toolbar Browser route from that explicit owner
  - should stop deriving that route from broad Browser presence heuristics

Important rule:
- `7.2d-1` should introduce one explicit owner seam
- it should not yet try to solve every Browser claim path in the same cut

### First Implementation Cut

`Workspace 7.2d-1` should land in the smallest safe sequence:

1. add explicit Browser toolbar-owner state under `src/app/workspace/`
2. choose a stable initial owner rule for the current toolbar Browser route
3. repoint `AppShell` so the left-toolbar Browser uses that explicit owner
4. narrow or remove the old global Browser suppression logic from that route
5. keep the app compiling and the primary toolbar Browser visible after the repoint
6. leave broader dock-left claim rewiring for `7.2d-2`

Implementation boundary:
- `7.2d-1` should end once Browser toolbar ownership is explicit and `AppShell` is no longer using the old broad suppression seam as the primary truth
- `7.2d-2` should begin where Browser claim and rehome actions become the main task

### Likely Files

- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/BrowserDockHost.tsx`

### Acceptance And Done Shape

`Workspace 7.2d-1` is done when:
- one explicit Browser toolbar-owner field exists under workspace state
- the primary left-toolbar Browser route in `AppShell` renders from that owner
- broad global Browser suppression is removed or sharply narrowed for that route
- the app still compiles and the docked Browser still appears in the primary viewport left toolbar
- the remaining follow-on work is clearly about Browser claim and rehome parity, not structural toolbar ownership

### Verification Shape

Focused verification should cover:
- the docked Browser still renders in the primary viewport left toolbar
- Browser visibility there no longer depends on an unrelated Browser slot existing elsewhere
- the app still compiles after the owner-state repoint

Recommended manual checks:
- keep a Browser docked in the left toolbar, create another Browser slot elsewhere, and confirm the toolbar Browser still exists under the new owner seam
- reload the normal workspace entry path and confirm the primary left-toolbar Browser still appears without requiring a split Browser elsewhere
- sanity-check that Browser float, slot, and popout paths still mount without obvious regressions after the owner-state repoint

# Workspace Phase Workspace-7.2d-2 - Browser Toolbar Claim And Rehoming Parity

## Doc Header

### Doc History
2. 2026-03-31 16:20: Checked off `Workspace 7.2d-2` after the shipped Browser toolbar claim and rehome parity work, so the record now reads as the landed second `7.2d` cut and is ready to move into `Workspace-Modes/Shipped/`
1. 2026-03-31 11:02: Added this native `Workspace 7.2d-2` subphase doc to isolate the next Browser toolbar-ownership cut around making quick-dock, drag-back, and other left-toolbar claim paths consistently rehome one chosen Browser surface now that the explicit owner seam from `7.2d-1` exists

### Purpose

Use this subphase to make Browser toolbar claims and Browser left-dock rehoming behave consistently on top of the new explicit toolbar-owner seam.

The goal is to make every real "dock this Browser left" action mean the same thing:
- this chosen Browser surface becomes the toolbar owner
- its previous host is released cleanly
- unrelated Browser slot, floating, or popout surfaces do not interfere

## Doc Body

### Summary

`Workspace 7.2d-2` is the Browser toolbar-claim and rehoming parity cut.

It should deliver:
- deterministic Browser quick-dock and drag-back ownership claims
- no more "a different Browser still owns the toolbar" residue during Browser host changes
- one consistent Browser left-toolbar rehome rule across slot, floating, and popout-adjacent flows

Practical read:
- `7.2d-1` already gave Browser the explicit toolbar-owner seam and removed the broad global suppression logic
- the remaining work is no longer structural ownership
- the remaining work is live parity: making every Browser toolbar-claim interaction use that owner seam consistently

### Locked Direction

`Workspace 7.2d-2` should be:
- a Browser claim-parity cut
- a Browser left-dock rehoming cut
- a focused interaction-consistency slice before `Workspace 7.3`

`Workspace 7.2d-2` should not be:
- a broad Browser redesign
- a generic toolbar-owner system for every surface kind
- a multiple-model-viewport widening phase

### Scope

This subphase covers:
- making Browser quick-dock claim toolbar ownership deterministically
- making Browser drag-back-to-toolbar claim toolbar ownership deterministically
- making Browser host transitions release or reclaim toolbar ownership only when the user actually leaves or re-enters the toolbar route
- keeping Browser popout copies independent unless the user explicitly docks one of them left
- adding focused regressions for the remaining "wrong Browser owns the toolbar" cases

This subphase does not cover:
- structural Browser toolbar-owner state design, which belongs to shipped `7.2d-1`
- a broader generic toolbar-owner architecture for non-Browser surfaces
- wider `Workspace 7.3` per-viewport multi-viewer work

### Progress Checklist

Current progress read:
- `7.2d-1` is now shipped as the structural Browser toolbar-owner cut
- the toolbar route now has one explicit Browser owner and no longer disappears because another Browser exists elsewhere
- `7.2d-2` is now shipped as the claim and rehome parity cut on top of that owner seam
- `Workspace 7.2d` can now honestly count as complete

- [x] Make Browser quick-dock claim toolbar ownership deterministically
- [x] Make Browser drag-back-to-toolbar claim toolbar ownership deterministically
- [x] Keep Browser leaving the toolbar from falsely preserving toolbar ownership
- [x] Keep Browser popout copies independent unless explicitly docked left
- [x] Prove unrelated Browser slot and floating surfaces no longer steal or resurrect toolbar ownership during Browser rehome flows
- [x] Re-run the focused Browser host-mode parity bundle and mark `7.2d` complete

### Locked Outcome

At the end of `7.2d-2`:
- Browser toolbar ownership changes only when the user actually changes which Browser should live in the toolbar
- Browser quick-dock, drag-back, and other left-dock claim flows all agree on the same ownership rule
- `Workspace 7.3` inherits a cleaner Browser host model with both structural ownership and live rehome parity in place

### Current Code Read

Current shipped seam after `7.2d-1`:
- `browserToolbarOwnerSurfaceInstanceId` now exists under workspace state
- `AppShell` now keys the left-toolbar Browser route from that explicit owner instead of broad global Browser slot suppression
- Browser undocking from the left toolbar now releases that ownership

Main remaining residue:
- Browser toolbar claims still need one final interaction pass so every legitimate dock-left flow explicitly claims the same owner seam
- the code should stop feeling like Browser toolbar ownership is partly explicit and partly legacy-behavior-derived

Current supporting seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2d - Explicit Browser Toolbar Ownership And Left-Dock Rehoming.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.2d-1 - Browser Toolbar Owner State And AppShell Repoint.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Current code seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Questions / Decisions

#### [x] Workspace 7.2d-2 - Question 1 - What is the exact job of this second subphase?

##### Locked Answer
- make Browser toolbar claim and rehome interactions use the explicit owner seam consistently
- stop short of broader non-Browser toolbar architecture work

##### Why
- `7.2d-1` already solved the structural owner truth
- `7.2d-2` should now finish the live interaction parity on top of that truth

#### [x] Workspace 7.2d-2 - Question 2 - What should Browser quick-dock and drag-back mean now?

##### Locked Answer
- they should both explicitly make the chosen Browser surface the toolbar owner
- they should both release any prior incompatible host cleanly

##### Why
- those are real user-driven "put this Browser back in the left toolbar" actions
- they should not rely on older fallback Browser restore rules anymore

#### [x] Workspace 7.2d-2 - Question 3 - What should not change toolbar ownership by itself?

##### Locked Answer
- unrelated Browser slots elsewhere
- unrelated floating Browser surfaces elsewhere
- Browser popout copies unless the user explicitly docks one of them left

##### Why
- Browser can now exist in more than one honest host at once
- the toolbar owner should change only from explicit user rehome intent

#### [x] Workspace 7.2d-2 - Question 4 - What behavior should stay intentionally stable during this parity cut?

##### Locked Answer
- the primary toolbar Browser should still remain independent from unrelated Browser slots
- popout copy behavior should stay copy-based
- Browser split, float, and popout routes should keep working unless the claim parity cleanup requires the smallest necessary host-lifecycle adjustment

##### Why
- this is a parity slice, not a redesign
- the goal is consistency around toolbar claims, not a wider Browser feature rewrite

### Important Interfaces And Types To Lock

- `browserToolbarOwnerSurfaceInstanceId`
  - remains the one Browser toolbar-owner seam
  - `7.2d-2` should consume it consistently rather than replacing it
- Browser quick-dock and drag-back actions
  - should explicitly assign toolbar ownership when the user rehomes a Browser left

Important rule:
- let explicit rehome actions change toolbar ownership
- do not let passive Browser presence elsewhere change it

### First Implementation Cut

`Workspace 7.2d-2` should land in the smallest safe sequence:

1. audit every Browser path that means "dock this Browser left"
2. make those paths explicitly assign `browserToolbarOwnerSurfaceInstanceId`
3. keep Browser leave-toolbar paths releasing ownership only when the user actually leaves that route
4. prove popout copies and unrelated Browser slots remain independent
5. add focused regressions for the remaining wrong-owner Browser flows
6. re-run the focused Browser parity bundle and then mark `7.2d` complete

Implementation boundary:
- `7.2d-2` should end once Browser toolbar-owner claims are consistent across the remaining live Browser rehome paths
- `Workspace 7.3` should begin where multiple-model-viewport and per-viewport host targeting become the dominant work

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`

### Acceptance And Done Shape

`Workspace 7.2d-2` is done when:
- Browser quick-dock and drag-back-to-toolbar paths explicitly claim toolbar ownership
- Browser leave-toolbar paths do not leave hidden toolbar ownership behind
- unrelated Browser slot, floating, and popout surfaces no longer interfere with the toolbar-owner read
- the remaining Browser toolbar behavior no longer feels split between explicit owner-state logic and older fallback restore logic
- `Workspace 7.2d` can honestly count as complete

### Verification Shape

Focused verification should cover:
- quick-dock claims the toolbar deterministically
- drag-back-to-toolbar claims the toolbar deterministically
- leaving the toolbar does not let a hidden docked Browser route resurrect itself later
- popout copies stay independent unless explicitly docked left

Recommended manual checks:
- float the toolbar Browser, quick-dock it back left, and confirm that same Browser becomes the toolbar owner with no duplicate Browser left behind
- float the toolbar Browser, dock it into a viewport slot, split that Browser again, and confirm the toolbar does not resurrect unless the user explicitly docks a Browser left
- keep another Browser slot and a Browser popout copy alive while rehoming one Browser back left and confirm the chosen Browser is the only one that claims the toolbar

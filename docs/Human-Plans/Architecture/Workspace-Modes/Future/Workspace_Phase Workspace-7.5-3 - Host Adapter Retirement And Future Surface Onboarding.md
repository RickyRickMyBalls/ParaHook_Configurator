# Workspace Phase Workspace-7.5-3 - Host Adapter Retirement And Future Surface Onboarding

## Doc Header

### Doc History
1. 2026-04-01 01:58: Marked `Part 6` as shipped after the final close-out slice landed, moving the remaining detached Browser plus Console rehome lookup behind the shared `workspaceSurfaceActions.ts` seam so `AppShell` no longer hand-orchestrates that feature-specific restore path, and writing down the explicit future-surface onboarding recipe using the now-proven Browser, Spaghetti, and Console contract boundaries
1. 2026-04-01 01:50: Locked the main `Part 6` close-out questions and tightened that final slice into an implementation-ready `AppShell` plus onboarding-recipe spec by explicitly deciding that `Console` is already sufficient as the proof surface, that the remaining work should stay small and close-out-focused instead of becoming another broad refactor, and that the final deliverable is both the last avoidable `AppShell` glue cleanup and one explicit code-facing onboarding recipe for later workspace surfaces
1. 2026-04-01 01:47: Marked `Part 5` as shipped after the Spaghetti compatibility retirement slice landed, closing its checklist now that AppShell no longer re-authors persisted `split view` as live runtime state during hydration, Spaghetti popout dock-back flows use an explicit separate-window restore helper instead of toggling `windowMode` through `setEditorViewportWindowMode(..., 'separateWindow')`, and the focused Spaghetti plus AppShell compatibility regressions are green
1. 2026-04-01 01:41: Tightened `Part 5` into a more implementation-ready Spaghetti-only cleanup slice by grounding it in the live `SpaghettiWindowHost`, `AppShell`, and `useSpaghettiStore` compatibility seams around `split view`, `separateWindow`, and `meatball editor view`, explicitly naming the remaining authoring paths that still write `windowMode`, and sharpening the part-5 direction, boundary, checklist, and verification shape around demoting those paths to compatibility-only status
1. 2026-04-01 01:37: Marked `Part 4` as shipped after the Browser preview-versus-commit cleanup landed, closing its checklist now that Browser quick-dock, floating split-menu commit, detached split-menu redock, and related drag/drop commit paths delegate further through the shared workspace surface-action seam while Browser preview geometry and ghost derivation remain local in `BrowserDockHost`
1. 2026-04-01 01:31: Tightened `Part 4` into a more implementation-ready Browser-only cleanup slice by grounding it in the live `BrowserDockHost` preview and commit helpers, explicitly separating preview derivation seams like `resolveBrowserSplitDockPreviewSide(...)` and `resolveBrowserNestedSplitPreview(...)` from remaining commit orchestration seams like `commitBrowserSlotSplit(...)`, `commitBrowserWholeLayoutSplit(...)`, `handleQuickDockBrowser(...)`, and floating split-menu selection, and sharpening the part-4 boundary, checklist, and verification shape around that exact preview-versus-commit cleanup
1. 2026-04-01 01:29: Normalized the bottom `Workspace 7.5-3` execution ladder so every visible part heading now carries an explicit checklist marker in the title, marking the already-landed `Part 3` slice as shipped alongside the earlier shipped parts and leaving parts 4 through 6 visibly open
1. 2026-04-01 01:24: Added an explicit shipped `Part 1` section to this `Workspace 7.5-3` umbrella doc so the original shared-host-action implementation slice is tracked with the same visible part structure as parts 2 through 6, instead of only being referenced indirectly by the later follow-on sections
1. 2026-04-01 01:22: Extended the bottom of this `Workspace 7.5-3` umbrella doc beyond the earlier `Part 3` slice by turning the remaining residue into a longer staged ladder, explicitly splitting the post-part-3 cleanup into dedicated Browser preview-versus-commit retirement, Spaghetti compatibility retirement, and final AppShell plus onboarding-recipe close-out chunks so the rest of the lane can be executed in smaller responsible pieces
1. 2026-04-01 01:11: Added a bottom `Part 3` section to turn the remaining post-part-2 residue into a final implementation-ready cleanup slice, explicitly narrowing the work to Browser drag-preview and split-preview ownership, remaining Spaghetti compatibility demotion, last AppShell glue trimming, and the code-facing future-surface onboarding recipe after Console proved the shared host-action seam can already carry another live surface
1. 2026-04-01 00:57: Tightened the bottom `Part 2` follow-on into a more implementation-ready remaining-work slice by grounding it in the shipped `workspaceSurfaceActions.ts` seam, explicitly locking Browser popout as still out of scope for this cut, clarifying that `ConsoleDock` must become the first explicit contract-proof surface rather than only an implicit participant, and sharpening the part-2 file list, checklist, and done shape around the exact Browser, Spaghetti, AppShell, and compatibility seams still left after the first `7.5-3` slice
1. 2026-04-01 00:51: Added a new bottom `Part 2` follow-on section to keep `Workspace 7.5-3` as the umbrella doc after the first shipped slice, explicitly recording what landed in the shared host-action seam, what Browser, Spaghetti, AppShell, and Console cleanup still remains, and what the next concrete implementation target should be without splitting the phase into a separate subphase file
1. 2026-04-01 00:25: Tightened this native `Workspace 7.5-3` subphase into an implementation-ready post-`7.5-2` close-out spec by grounding it in the still-live `BrowserDockHost`, `SpaghettiWindowHost`, `AppShell`, and `useSpaghettiStore` adapter seams, locking `console` as the first future-surface onboarding proof, and adding a concrete retirement boundary, likely file list, execution checklist, and sharper acceptance plus verification shape for the final `Workspace 7.5` cut
1. 2026-03-31 23:13: Added this native `Workspace 7.5-3` subphase doc to reserve the final `7.5` cleanup cut for deleting leftover Browser-only and Spaghetti-only host adapters after the shared contract and Spaghetti split-truth migration have landed, while also proving that at least one future surface can onboard without another one-off shell cleanup ladder

### Purpose

Use this phase to close the loop after `7.5-1` and `7.5-2`.

The goal is to prove that the shared shell contract is not just an internal refactor:
- Browser and Spaghetti host adapters should become materially thinner
- future surfaces should be able to adopt the contract directly

### Scope

This phase covers:
- deleting leftover compatibility shims after the shared contract is proven
- retiring Browser-only and Spaghetti-only host lifecycle helpers that the workspace layer replaces
- proving at least one additional future-ready surface can adopt the contract without another Browser-style cleanup ladder

This phase does not cover:
- the initial generic contract extraction
- the direct Spaghetti drag-to-edge split migration
- large feature rewrites unrelated to shell ownership

## Doc Body

### Summary

`Workspace 7.5-3` is the retirement-and-proof cut.

It should deliver:
- thinner host adapters
- less duplicated shell logic
- one clear onboarding recipe for future workspace surfaces

Practical read after shipped `7.5-1` and `7.5-2`:
- the shared workspace contract now exists
- Browser and Spaghetti are no longer the right places to keep inventing shell lifecycle truth
- `7.5-3` is where we stop treating those hosts as semi-special shell owners and make the contract the default path

### Current Code Read

Primary seams:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Specific live residue after shipped `7.5-1` and `7.5-2`:
- `BrowserDockHost` still owns a large amount of Browser-specific drag, menu, and split-shell orchestration even though route ownership and placement truth now live in `useWorkspaceStore`
- `SpaghettiWindowHost` now uses the shared workspace split tree for edge-dock truth, but it still owns feature-plus-shell mixed actions such as meatball rehome, floating drag, split toggle presentation, and popout handoff
- `AppShell` still contains feature-specific split-menu and hydration glue for Spaghetti compatibility instead of delegating all shell transitions through one generic surface-host recipe
- `useSpaghettiStore` still carries `windowMode: 'split view'` as a compatibility concept even though the shared workspace slot tree now owns honest split layout
- `console` already participates in slotted, floating, and popout host modes through the workspace layer, which makes it the best current proof target for a future-surface onboarding path that does not need a Browser-style cleanup ladder

Concrete live read:
- `BrowserDockHost` still renders its own `WorkspaceSplitMenu` and owns Browser-specific titlebar drag/re-dock logic while also reading the generic `hostRouteOwnershipByRouteId`
- `SpaghettiWindowHost` still mixes feature-local editor controls with host lifecycle verbs like float, split-toggle, popout, and re-dock
- `AppShell` still restores editor split compatibility state during persistence hydration and still wires Spaghetti split-menu actions directly
- `ConsoleDock` is already comparatively closer to a reusable hosted surface because the workspace layer owns more of its slot/floating/popout placement story

### Locked Questions / Decisions

#### [x] Workspace 7.5-3 - Question 1 - What proves that `7.5` actually worked?

##### Locked Answer
- at least one future-ready non-Browser surface can adopt the shared contract without another custom shell ladder

##### Why
- the real success condition is reusable onboarding, not just cleaned-up Browser and Spaghetti code

#### [x] Workspace 7.5-3 - Question 2 - What should host adapters look like after cleanup?

##### Locked Answer
- mostly renderers plus feature-local actions
- not owners of shell lifecycle truth

##### Why
- shell lifecycle belongs in the workspace layer once the reusable contract exists

#### [x] Workspace 7.5-3 - Question 3 - What is the first proof surface for future-surface onboarding?

##### Locked Answer
- `console`

##### Why
- it already participates in slotted, floating, and popout host modes without carrying Browser-only ownership seams or Spaghetti-only editor window modes, so it is the lowest-risk proof that the shared contract can onboard another surface cleanly

#### [x] Workspace 7.5-3 - Question 4 - What should happen to remaining Spaghetti `split view` compatibility state in this cut?

##### Locked Answer
- stop treating it as a live shell authoring path
- keep only the minimum compatibility needed for restore or migration until it can be deleted cleanly

##### Why
- `7.5-2` already moved honest split truth to the workspace slot tree, so `7.5-3` should continue the retirement instead of letting compatibility state linger as a silent second owner

#### [x] Workspace 7.5-3 - Question 5 - What makes an adapter “thin enough” at the end of this phase?

##### Locked Answer
- it should mostly render feature UI and call shared workspace actions for focus, float, popout, redock, split, and host-route claim behavior

##### Why
- that is the point where future surfaces can copy the contract instead of copying Browser or Spaghetti cleanup history

### Locked Boundary

`Workspace 7.5-3` is in scope for:
- removing no-longer-needed Browser-only and Spaghetti-only shell lifecycle helpers that duplicate the workspace contract
- thinning `BrowserDockHost`, `SpaghettiWindowHost`, and any remaining `AppShell` glue so host transitions route through shared workspace actions by default
- reducing `split view` compatibility state to migration-only or delete-ready status instead of active shell truth
- proving the reusable onboarding recipe by routing one additional surface through the shared host contract, with `console` as the first proof target
- writing down the future-surface onboarding recipe in code-facing terms once the proof path lands

`Workspace 7.5-3` is out of scope for:
- a large Browser UI redesign
- a large Spaghetti editor feature rewrite
- speculative multi-window systems not needed to prove reusable host onboarding
- unrelated shell cleanup outside the `Workspace 7.5` host-standardization lane

### Locked Implementation Direction

The implementation should move in this order:

1. inventory and delete the remaining Browser-only and Spaghetti-only shell helpers that duplicate shared workspace actions
2. repoint `AppShell` and the host adapters so feature hosts delegate shell verbs instead of authoring them
3. thin the remaining Spaghetti compatibility paths so `split view` is no longer a normal shell authoring mode
4. prove the contract with `console` as the first future-surface onboarding target
5. capture the reusable onboarding recipe while the code path is still fresh and honest

Important rule:
- do not replace one special-case adapter with a new differently named adapter seam
- every retirement in this phase should move toward shared workspace verbs, not sideways into another host-local orchestration layer

### First Implementation Cut

1. remove the easiest no-longer-needed Browser and Spaghetti shell helpers that already duplicate shipped workspace truth
2. thin `BrowserDockHost` and `SpaghettiWindowHost` so titlebar/menu actions call shared workspace verbs wherever possible
3. repoint the lowest-risk `console` host transitions onto the same contract surface without adding a new one-off adapter
4. leave only a minimal `split view` compatibility bridge in Spaghetti if a final deletion cannot safely land in the same cut
5. record the resulting future-surface onboarding recipe

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

### Execution Checklist

- [ ] Identify and remove the Browser-only and Spaghetti-only shell helpers that are now duplicating shared workspace contract behavior
- [ ] Repoint remaining host titlebar and menu actions to shared workspace verbs wherever the contract already covers the transition
- [ ] Reduce Spaghetti `split view` to compatibility-only or delete-ready status so it no longer behaves like a normal shell authoring mode
- [ ] Use `console` as the first proof that another surface can adopt the contract without starting another Browser-style cleanup ladder
- [ ] Add or update focused tests showing Browser, Spaghetti, and Console all use the shared host-transition path for the covered behaviors
- [ ] Write down the future-surface onboarding recipe once the proof surface is real

### Acceptance And Done Shape

`Workspace 7.5-3` is done when:
- Browser and Spaghetti host adapters are materially thinner
- the shared shell contract is the default adoption path for future surfaces
- `console` proves that an additional surface can adopt that contract without another cleanup ladder
- no major host transition still depends on Browser-only or editor-only lifecycle truth
- remaining Spaghetti `split view` state is no longer acting like a normal shell authoring path

### Verification Shape

Minimum verification for `Workspace 7.5-3` should cover:
- Browser, Spaghetti, and Console all use the same host-transition contract for the covered behaviors
- no deleted adapter path was still carrying unique user-facing behavior
- Browser drag/re-dock, Spaghetti float/split/popout transitions, and Console host-mode transitions still behave correctly after delegation
- future-surface onboarding no longer requires re-running the Browser cleanup ladder
- the resulting code leaves one clear contract recipe for later workspace windows

## [x] Part 1 - First Shared Host-Action Slice

### Why Part 1 Existed

Part 1 was the first proof that `Workspace 7.5-3` could move out of planning language and into real code.
Its job was not to finish the whole lane.
Its job was to create the first reusable host-action seam and prove Browser and Spaghetti could start delegating to it.

### What Landed In Part 1

The first shipped `7.5-3` slice established the shared host-action base:
- `src/app/workspace/workspaceSurfaceActions.ts` was added as the first shared host-action seam
- `AppShell`, `BrowserDockHost`, and `SpaghettiWindowHost` started calling shared workspace verbs for selected float, split, and redock flows
- Browser quick-dock moved onto the generic host-route redock path
- Spaghetti edge-dock and split-migration flows started using the same workspace-owned split action instead of staying fully host-local

### Part 1 Goal

Part 1 was meant to:
- prove that shared workspace host verbs could exist as a real seam
- repoint the easiest high-signal Browser and Spaghetti transitions first
- create enough real delegation that later cleanup slices could narrow onto residue instead of still debating the contract

### Part 1 Done Shape

Part 1 is done because:
- the shared host-action seam exists in code
- Browser and Spaghetti both use it in meaningful places
- the `7.5-3` lane could then split honestly into narrower follow-on parts instead of remaining one large speculative cleanup phase

## [x] Part 2 - Remaining Work After The First Shipped Slice

### What Landed In Part 1

The first shipped `7.5-3` slice already proved the direction:
- `src/app/workspace/workspaceSurfaceActions.ts` now exists as a shared host-action seam
- `AppShell`, `BrowserDockHost`, and `SpaghettiWindowHost` now call that seam for some float, split, and redock flows
- Browser quick-dock now routes through the generic host-route redock path
- Spaghetti edge-dock and split-migration flows now share the same workspace-owned split action

That means `7.5-3` is no longer speculative.
The contract is real enough to keep thinning adapters without inventing another Browser-style cleanup ladder.

### What Still Remains

The remaining `7.5-3` work is now narrower and more specific:
- `BrowserDockHost` still owns a lot of Browser-only drag-preview and split-menu orchestration even when the transition itself is already generic
- `SpaghettiWindowHost` still mixes feature-local controls with shell verbs like popout, redock, titlebar menu actions, and meatball rehome
- `AppShell` still carries compatibility-oriented feature glue that should keep shrinking as hosts delegate more directly
- `ConsoleDock` still proves host-mode behavior mostly by local store paths rather than by reading as a clean example of the shared contract
- `useSpaghettiStore` still carries residual compatibility concepts that should be pushed further toward migration-only status

Concrete post-part-1 read:
- `workspaceSurfaceActions.ts` now covers shared float, popout, redock, and split-side placement, but Browser popout still intentionally stays on the compatibility shell path instead of the generic helper
- `BrowserDockHost` now uses `redockWorkspaceSurface(...)` for quick-dock, but it still owns Browser-specific split-preview, drag-preview, and popout orchestration
- `SpaghettiWindowHost` now uses `splitWorkspaceSurfaceToSide(...)` for edge-dock split truth, but popout, meatball rehome, and several titlebar actions still drive shell transitions locally through `setEditorViewportWindowMode(...)`
- `AppShell` now uses the shared surface helpers for slot float, slot popout, and Spaghetti split migration, but it still contains feature-specific Browser and Spaghetti bridging logic that should shrink further once the hosts delegate more directly
- `ConsoleDock` still calls `switchToFloating()` and `switchToPopout()` directly instead of reading as an obvious client of the shared workspace host-action seam

### Part 2 Goal

Part 2 should finish the “retirement and proof” story by:
- thinning the remaining Browser and Spaghetti adapter actions that still author shell behavior locally
- making `ConsoleDock` the first clear future-surface proof of the shared host contract
- reducing the leftover Spaghetti compatibility residue until it is plainly migration-only or obviously ready for deletion
- leaving one practical onboarding recipe that another future workspace surface could follow directly

### Locked Part 2 Direction

The next implementation slice should move in this order:

1. repoint more Browser and Spaghetti titlebar/menu actions to shared workspace verbs instead of host-local orchestration
2. tighten `ConsoleDock` so its float, popout, redock, and split-facing actions read as a clean contract proof surface
3. trim `AppShell` and `useSpaghettiStore` compatibility glue that is no longer needed after those repoints
4. document the resulting onboarding recipe in concrete code-facing terms

Important guardrail:
- do not force Browser popout or other still-useful compatibility paths onto the generic seam just for symmetry if that would create behavioral regressions
- the goal is honest shared shell ownership, not artificial one-file purity

Locked out-of-scope rule for part 2:
- Browser popout child-window behavior should stay on the compatibility shell path in this cut unless a later change proves the generic seam can preserve the existing popout-copy behavior without regressions
- `meatball editor view` may be repointed where it already matches shared shell verbs, but part 2 should not redesign the meatball interaction model itself

### Part 2 Locked Boundary

Part 2 is in scope for:
- repointing Browser and Spaghetti titlebar or menu actions that already have behavior-equivalent shared workspace verbs
- using `ConsoleDock` as the first explicit proof that a non-Browser surface can adopt the shared host-action seam cleanly
- shrinking `AppShell` glue that only exists because Browser or Spaghetti still author shell transitions locally
- demoting leftover Spaghetti compatibility paths that still look like live shell authorship
- documenting the resulting future-surface onboarding recipe after the proof surface is real

Part 2 is out of scope for:
- a Browser popout rewrite
- a full meatball editor behavior redesign
- large Browser drag-preview or UI restyling work not required to move ownership to shared verbs
- speculative new window families beyond proving the contract with the surfaces already in the repo

### Part 2 Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.ts`
- `src/app/AppShell.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/AppShell.test.tsx`

### Part 2 Checklist

- [x] Repoint the next tier of Browser titlebar and split-menu actions onto shared workspace verbs where behavior is already equivalent
- [x] Repoint the next tier of Spaghetti titlebar, popout, and meatball rehome actions onto shared workspace verbs where behavior is already equivalent
- [x] Use `ConsoleDock` as the first explicit future-surface contract proof by routing at least one visible host-mode transition through the shared host-action seam instead of only local store verbs
- [x] Reduce remaining `AppShell` compatibility glue that only exists because hosts are still partially authoring shell transitions
- [x] Further demote leftover Spaghetti compatibility state until it is clearly migration-only or safely removable
- [x] Add focused tests proving the part-2 contract path across Browser, Spaghetti, and Console

### Part 2 Verification Shape

Minimum verification for part 2 should cover:
- Browser still keeps its existing popout-copy behavior while any newly repointed titlebar or split-menu actions route through shared workspace verbs
- Spaghetti titlebar and meatball-facing transitions still behave the same after the repointed actions stop authoring shell state locally
- `ConsoleDock` demonstrates at least one visible float or popout action through the shared host-action seam
- no newly deleted AppShell glue was still carrying unique host-transition behavior
- focused Browser, Spaghetti, Console, and AppShell tests still pass for the repointed paths

### Part 2 Done Shape

This remaining `7.5-3` work is done when:
- Browser and Spaghetti host adapters are thinner than they were after part 1 in visible, reviewable ways
- `ConsoleDock` reads as the first clean future-surface onboarding proof
- shared workspace verbs own the important host transitions for all covered surfaces
- the leftover compatibility seams are obviously temporary instead of acting like shadow shell truth

## [x] Part 3 - Final Residue And Onboarding Recipe

### Why Part 3 Exists

After the shipped part-2 slice, the remaining `7.5-3` work is smaller and more architectural:
- the shared host-action seam exists
- Browser, Spaghetti, and Console all use it in meaningful places
- the remaining problems are now mostly about adapter residue and documentation of the final reusable recipe

That means part 3 should be the cleanup-and-capture pass, not another broad migration.

### What Still Remains After Part 2

The remaining live residue is now concentrated in four areas:
- `BrowserDockHost` still owns a lot of drag-preview and split-preview orchestration even where the committed action already routes through shared workspace verbs
- `SpaghettiWindowHost` and `useSpaghettiStore` still carry compatibility-driven window-mode logic that should keep shrinking until `split view` is obviously migration-only
- `AppShell` still contains some feature-specific bridging logic that only exists because Browser and Spaghetti are not yet delegating every covered shell transition directly
- the code-facing onboarding recipe is still implied by the implementation instead of being written down as an explicit reusable pattern for the next future workspace surface

Concrete read after part 2:
- Browser split commits and quick-dock now use shared workspace verbs in more places, but preview-state derivation and some titlebar orchestration still live entirely in `BrowserDockHost`
- Spaghetti split and popout flows now use shared workspace verbs more often, but `setEditorViewportWindowMode(...)` remains a compatibility-heavy bridge around `separateWindow`, `meatball editor view`, and restore behavior
- Console now proves the shared host-action seam through visible float and popout transitions when a real slotted console surface exists
- the remaining work is now more about deleting or documenting residue than introducing new shared action categories

### Part 3 Goal

Part 3 should finish `7.5-3` by:
- removing or shrinking the last obvious Browser and Spaghetti host-local shell orchestration that still duplicates shared ownership
- leaving Spaghetti compatibility state visibly migration-only instead of ambiguously half-live
- trimming the last `AppShell` glue that only survives because older host-local seams still exist
- writing down the concrete onboarding recipe for the next future workspace surface while the contract is now proven in code

### Locked Part 3 Direction

The next implementation slice should move in this order:

1. trim the remaining Browser adapter-owned orchestration that still duplicates shared host ownership after commit time
2. demote the remaining Spaghetti compatibility state until it is clearly bridge-only and no longer reads like authoring truth
3. remove any now-dead `AppShell` glue that those adapter reductions make unnecessary
4. write the code-facing onboarding recipe using the now-proven Browser, Spaghetti, and Console examples

Important guardrail:
- do not force Browser drag-preview geometry or other preview-only state into the generic host-action seam if that state is still legitimately renderer-local
- part 3 should only move ownership when the behavior is actually shared lifecycle truth, not just because two files have similar-looking code

### Part 3 Locked Boundary

Part 3 is in scope for:
- trimming the last Browser and Spaghetti host-local lifecycle orchestration that still duplicates shared commit behavior
- further demoting `split view` and related Spaghetti compatibility state until it is clearly migration-only or safe to delete
- removing the `AppShell` glue that only exists to support those older compatibility seams
- capturing one explicit future-surface onboarding recipe in code-facing terms after the contract proof is complete

Part 3 is out of scope for:
- Browser popout redesign or generic popout abstraction expansion
- a large Browser drag-preview rewrite for purely visual polish
- a large meatball editor redesign
- new workspace surface families beyond documenting how they should onboard

### Part 3 Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-3 - Host Adapter Retirement And Future Surface Onboarding.md`

### Part 3 Checklist

- [x] Remove or shrink the remaining Browser adapter-owned shell orchestration that still duplicates shared commit behavior
- [x] Further demote leftover Spaghetti compatibility state until `split view` and related window-mode residue are clearly migration-only or safely removable
- [x] Remove the remaining `AppShell` glue that only exists because those older Browser or Spaghetti compatibility seams are still present
- [x] Add or update focused tests proving the final covered Browser and Spaghetti transitions no longer depend on adapter-local lifecycle truth
- [x] Write down the code-facing future-surface onboarding recipe using the now-proven shared host-action seam

### Part 3 Verification Shape

Minimum verification for part 3 should cover:
- Browser and Spaghetti still behave the same for the covered transitions after the last adapter-owned shell residue is trimmed
- no final `AppShell` cleanup removed behavior that was still required for restore, redock, or compatibility flows
- the focused Browser, Spaghetti, and AppShell suites still pass for the final covered transitions
- the onboarding recipe is concrete enough that a later workspace surface could follow it without re-running the Browser cleanup ladder

### Part 3 Done Shape

This final `7.5-3` residue pass is done when:
- Browser and Spaghetti host adapters no longer contain obvious duplicate lifecycle ownership for the covered transitions
- leftover Spaghetti compatibility state reads as clearly temporary bridge code instead of a shadow shell model
- `AppShell` no longer carries avoidable feature-specific host glue for the `7.5` contract path
- the future-surface onboarding recipe is explicitly documented instead of only being inferable from the code

## [x] Part 4 - Browser Preview And Commit Residue Separation

### Why Part 4 Exists

After the first three shipped slices, the remaining Browser work is no longer about generic contract creation.
It is about making the Browser host honest about what is truly renderer-local preview state versus what is still accidental shell ownership.

That means Browser should get its own narrower follow-on instead of staying mixed together with every other remaining `7.5-3` concern.

### What Part 4 Should Isolate

The Browser-specific residue now looks like this:
- `BrowserDockHost` still owns drag-preview and split-preview orchestration that is partly legitimate local rendering state and partly older commit-time ownership residue
- some Browser titlebar and menu plumbing still knows too much about how the final split or redock commit happens
- Browser popout still stays on the compatibility path, which is fine, but the doc should keep that boundary explicit so preview cleanup does not silently widen into a popout rewrite

The main implementation question for this part is:
- which Browser preview helpers are truly presentation-only and should stay local
- and which ones still carry real shell lifecycle authorship that should move to shared workspace verbs

Concrete live read:
- `resolveBrowserSplitDockPreviewSide(...)` and `resolveBrowserNestedSplitPreview(...)` in `src/app/hosts/BrowserDockHost.tsx` are the clearest candidates to remain Browser-local because they derive visible preview geometry and active-side suggestion state from pointer position
- `commitBrowserSlotSplit(...)`, `commitBrowserWholeLayoutSplit(...)`, `handleQuickDockBrowser(...)`, and `handleSelectFloatingSplitDockSide(...)` are the main remaining Browser-local seams that still touch real commit ownership after the shared workspace action seam already exists
- `handleBrowserDragStart(...)` and `handleBrowserSplitDragStart(...)` currently sit right on the line between legitimate local drag setup and older shell ownership, so part 4 should decide explicitly what stays host-local there and what should route through shared workspace verbs
- Browser popout still remains intentionally outside this part even though the floating titlebar sits near the same controls, because its child-window-copy behavior is still a compatibility-preservation seam, not preview-versus-commit cleanup

### Part 4 Goal

Part 4 should:
- separate Browser preview derivation from Browser commit ownership more explicitly
- move any remaining Browser commit-time shell truth to shared workspace actions if it is still hiding in the host
- leave Browser preview geometry local when it is genuinely view-only
- reduce the Browser host to a thinner preview-plus-render adapter instead of a partial shell owner

### Part 4 Locked Direction

Part 4 should move in this order:

1. classify the live Browser helpers into preview-only versus commit-owning groups
2. move any remaining commit-owning Browser paths to shared workspace verbs where the shared seam already covers the lifecycle
3. leave preview-only Browser geometry, hover intent, and ghost derivation inside `BrowserDockHost`
4. add focused Browser regression coverage that proves floating, quick-dock, split-menu, and edge-drop commits no longer depend on preview helpers carrying hidden shell truth

Important guardrail:
- do not force `BrowserDockHost` preview math into `workspaceSurfaceActions.ts`
- part 4 is about separating ownership cleanly, not about pretending all Browser logic belongs in one generic file

### Part 4 Locked Boundary

Part 4 is in scope for:
- trimming Browser titlebar or menu commit paths that still duplicate shared workspace verbs
- deleting or demoting Browser helper code that still mixes preview state with commit state
- sharpening the code comments or local structure where Browser preview logic legitimately stays local
- adding focused Browser tests that prove preview and commit responsibilities are now cleanly separated

Part 4 is out of scope for:
- Browser popout redesign
- broad Browser visual restyling
- generic preview abstractions that do not buy real ownership cleanup
- moving pointer-driven preview geometry out of `BrowserDockHost` just for symmetry

### Part 4 Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/AppShell.test.tsx`

### Part 4 Checklist

- [x] Audit the remaining Browser helpers and explicitly classify `resolveBrowserSplitDockPreviewSide(...)`, `resolveBrowserNestedSplitPreview(...)`, `handleBrowserDragStart(...)`, `handleBrowserSplitDragStart(...)`, `handleQuickDockBrowser(...)`, `handleSelectFloatingSplitDockSide(...)`, `commitBrowserSlotSplit(...)`, and `commitBrowserWholeLayoutSplit(...)` as preview-only, mixed, or commit-owning seams
- [x] Move any remaining Browser commit-time shell ownership to shared workspace actions where the shared contract already covers it
- [x] Leave clearly renderer-local Browser preview geometry and ghost derivation in the host and make that boundary obvious in code
- [x] Tighten focused Browser regressions so quick-dock, floating split-menu commit, edge-drop split commit, and split-to-float handoff all still behave correctly after the ownership cleanup

### Part 4 Verification Shape

Minimum verification for part 4 should cover:
- Browser drag previews and nested split previews still render correctly after the helper split between local preview state and shared commit state is cleaned up
- Browser quick-dock, floating split-menu commit, and edge-drop commit still behave correctly after more commit ownership moves out of `BrowserDockHost`
- the Browser split-to-float handoff still consumes the source host honestly and does not reintroduce duplicate-slot regressions
- Browser popout copy behavior stays unchanged because it remains explicitly out of scope for this part

### Part 4 Done Shape

Part 4 is done when:
- Browser preview logic reads as local rendering state rather than mixed shell truth
- Browser commit-time transitions no longer hide in preview-oriented host helpers
- Browser popout remains intentionally unchanged

## [x] Part 5 - Spaghetti Compatibility Retirement And Window-Mode Demotion

### Why Part 5 Exists

Spaghetti is now the main remaining place where old shell truth can still hide behind compatibility naming.
That makes it worth giving its own cleanup chunk instead of continuing to bundle it with Browser residue.

### What Part 5 Should Isolate

The remaining Spaghetti-specific residue now looks like this:
- `setEditorViewportWindowMode(...)` still acts as a bridge around `separateWindow`, `meatball editor view`, and restore behavior
- `useSpaghettiStore` still carries window-mode concepts that are no longer the honest source of split truth
- `SpaghettiWindowHost` still blends feature-local titlebar behavior with compatibility-era shell transitions

The main implementation question for this part is:
- how far can `windowMode` be demoted now that split truth already lives in workspace layout, without destabilizing restore and editor-specific UX

Concrete live read:
- `handleSplitToggle(...)` and `handleViewportSplitToggle(...)` in `src/app/hosts/SpaghettiWindowHost.tsx` still remove slots and then write `setEditorViewportWindowMode(..., 'expanded')`, which means split exit is already mostly workspace-owned but still uses window-mode writes as cleanup glue
- `handleTogglePopout(...)` and `handleViewportDockFromPopout(...)` in `src/app/hosts/SpaghettiWindowHost.tsx` still branch between shared workspace verbs and direct `setEditorViewportWindowMode(..., 'separateWindow')` writes, which keeps `separateWindow` acting as a live compatibility seam
- `handleMeatballMode(...)` and `handleViewportMeatballMode(...)` still treat `meatball editor view` as an explicitly authored window mode, so part 5 needs to decide what remains a real feature mode versus what is only shell residue
- `src/app/AppShell.tsx` still writes `setEditorViewportWindowMode(...)` during persistence hydration, split-view migration, split-menu direction changes, and split-close actions, which means the shell still helps re-author Spaghetti window-mode state in several places
- the large `setEditorViewportWindowMode(...)` branch in `src/app/spaghetti/store/useSpaghettiStore.ts` still contains the main compatibility logic for `split view`, `separateWindow`, `collapsed`, `maximized`, and `meatball editor view`, so part 5 is really about narrowing which of those remain true authoring modes versus compatibility restore bridges

### Part 5 Goal

Part 5 should:
- keep pushing Spaghetti `windowMode` toward compatibility-only status
- remove any remaining normal authoring flows that still treat `split view` like live shell truth
- leave only the minimum bridge needed for restore or legacy migration
- make `SpaghettiWindowHost` read more like a feature renderer with shared shell verbs, not an alternate shell model

### Part 5 Locked Direction

Part 5 should move in this order:

1. identify which `windowMode` values are still real feature/presentation modes and which ones are only legacy shell transport
2. remove or demote any remaining normal authoring flows that still set `split view` as if it were live shell truth
3. narrow `separateWindow` handling so shared workspace popout and redock flows own the shell transition while `windowMode` remains only the minimum restore bridge needed for editor-specific behavior
4. decide whether `meatball editor view` stays a real feature mode or needs a smaller compatibility wrapper, then tighten the remaining writes accordingly
5. shrink the AppShell hydration and split-menu writes so they stop re-authoring compatibility state that the workspace layer already owns

Important guardrail:
- do not delete `windowMode` wholesale just because split truth moved
- part 5 should separate legitimate editor presentation modes from shell-layout residue, not flatten all editor state into one generic mode

### Part 5 Locked Boundary

Part 5 is in scope for:
- further demoting `split view` and related Spaghetti compatibility state
- reducing local host actions that still author shell transitions through Spaghetti-specific window-mode paths
- adding focused Spaghetti tests for the remaining restore, popout, and compatibility flows
- tightening AppShell hydration and split-menu writes that still re-author Spaghetti compatibility state after the workspace split tree already owns layout

Part 5 is out of scope for:
- a meatball editor redesign
- rethinking editor-specific feature behavior that is not actually shell ownership
- broad editor UX rewrites unrelated to window-mode retirement

### Part 5 Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

### Part 5 Checklist

- [x] Inventory the remaining Spaghetti `windowMode` and compatibility paths after shipped `7.5-2` and `7.5-3` parts 1 through 4, explicitly covering `handleSplitToggle(...)`, `handleViewportSplitToggle(...)`, `handleTogglePopout(...)`, `handleViewportDockFromPopout(...)`, `handleMeatballMode(...)`, `handleViewportMeatballMode(...)`, AppShell hydration and split-menu writes, and the `setEditorViewportWindowMode(...)` store branch
- [x] Remove or demote any remaining normal shell-authoring flows that still depend on `split view` as live shell truth
- [x] Narrow `separateWindow` handling so shared workspace popout/redock flows own the shell transition and `windowMode` only carries the minimum restore bridge needed for editor-specific behavior
- [x] Keep only the minimum restore or migration bridge needed for older Spaghetti compatibility cases
- [x] Add focused Spaghetti and AppShell tests proving the remaining compatibility bridge is no longer a shadow shell model

### Part 5 Verification Shape

Minimum verification for part 5 should cover:
- Spaghetti split enter, split exit, and split-close flows still behave correctly after `split view` stops acting like a normal authored shell mode
- Spaghetti popout and dock-back flows still work when shared workspace actions own more of the shell transition and `separateWindow` becomes a narrower compatibility bridge
- AppShell persistence hydration and legacy split migration do not reintroduce `split view` as a live second owner of layout truth
- meatball editor view still behaves correctly if it remains a real feature mode, or still restores honestly if it is narrowed behind a smaller compatibility seam
- focused `SpaghettiWindowHost` and `AppShell` regressions still pass for split, popout, meatball, and restore behavior

### Part 5 Done Shape

Part 5 is done when:
- `split view` no longer reads like a normal authored shell mode
- Spaghetti restore and compatibility flows still work
- the remaining Spaghetti bridge code is obviously temporary and narrow

## [x] Part 6 - AppShell Close-Out And Explicit Future-Surface Onboarding Recipe

### Why Part 6 Exists

Once Browser and Spaghetti residue are reduced further, the last `7.5-3` work should become a clean close-out slice.
That final slice should not be another hidden adapter cleanup bucket.
It should explicitly close the loop on `AppShell` glue and write down the reusable onboarding pattern that `console` already helped prove.

### What Part 6 Should Deliver

Part 6 should convert the now-proven contract into an explicit recipe:
- what state a new surface needs
- which shared workspace verbs it should call
- what should stay surface-local
- what should never be reintroduced as a new Browser-style adapter seam

It should also clean up any last `AppShell` glue that only survived because earlier Browser or Spaghetti compatibility seams were still present.

Concrete live read:
- after shipped parts 4 and 5, the remaining `AppShell` residue should now be smaller and mostly limited to feature-specific glue that survived because Browser and Spaghetti were still converging on the shared contract in earlier slices
- `Console` already acts as the first credible proof surface for reusable onboarding, which means part 6 does not need to invent another new surface just to prove the recipe again
- the biggest remaining risk is not missing another new shared action, but forgetting to write down the actual onboarding rule set and accidentally letting future windows rebuild a Browser-style special case

### Part 6 Locked Questions / Decisions

#### [x] Part 6 - Question 1 - What is the main purpose of this final slice?

##### Locked Answer
- final `AppShell` cleanup plus one explicit onboarding recipe

##### Why
- Browser and Spaghetti already proved the contract in code; part 6 should close the loop and document the default adoption path instead of opening another broad migration lane

#### [x] Part 6 - Question 2 - Does part 6 need another new proof surface beyond `Console`?

##### Locked Answer
- no

##### Why
- `Console` is already enough as the first reusable proof surface, so this final cut should not create more implementation scope just to prove the same point twice

#### [x] Part 6 - Question 3 - What shared verbs must the onboarding recipe make explicit?

##### Locked Answer
- `focus`
- `float`
- `popout`
- `redock`
- `split`
- `claim host route`

##### Why
- those are the core shell transitions that the standardized contract already proved across Browser, Spaghetti, and Console

#### [x] Part 6 - Question 4 - What state belongs in the generic workspace layer?

##### Locked Answer
- host-route ownership
- detached surface state
- slot/split layout truth
- shared surface placement needed for host transitions and restore

##### Why
- those are the parts of shell lifecycle that future surfaces should reuse rather than re-implement locally

#### [x] Part 6 - Question 5 - What state should remain feature-local?

##### Locked Answer
- surface-specific preview/render geometry
- feature-specific titlebar and panel controls
- feature presentation state that is not shared shell lifecycle truth

##### Why
- the goal is a reusable shell contract, not flattening every feature into one generic host file

#### [x] Part 6 - Question 6 - What should part 6 explicitly forbid for future work?

##### Locked Answer
- reintroducing feature-local ownership for split commit, redock, detached-surface handling, or named host-route ownership when the shared workspace layer already covers those transitions

##### Why
- that is how the repo would accidentally grow another Browser-style cleanup ladder

### Part 6 Goal

Part 6 should:
- remove the last avoidable feature-specific `AppShell` host glue
- capture one explicit code-facing onboarding recipe for the next workspace surface
- leave `Workspace 7.5` with a documented default path for future surface adoption instead of another archaeology exercise

### Part 6 Locked Direction

Part 6 should move in this order:

1. inventory the last `AppShell` branches that only survive because older Browser or Spaghetti compatibility seams used to exist
2. delete the ones that are now clearly redundant after shipped parts 4 and 5
3. write the onboarding recipe in direct implementation language:
   - what workspace state to use
   - what shared verbs to call
   - what stays local
   - what must not be rebuilt as a feature-local shell path
4. validate that `Console` still reads as the first clean example of that default path

Important guardrail:
- part 6 should stay small and close-out focused
- if a remaining cleanup idea starts turning into another broad runtime migration, it should become a later phase instead of expanding this final slice

### Part 6 Locked Boundary

Part 6 is in scope for:
- deleting the last `AppShell` glue that only exists to support older Browser or Spaghetti compatibility seams
- documenting the shared host onboarding recipe directly in this phase doc or the most appropriate nearby planning surface
- validating that `console` still stands as the proof that a later surface can onboard without a Browser-style cleanup ladder

Part 6 is out of scope for:
- introducing a new future surface implementation just to prove the recipe twice
- large `AppShell` architecture rewrites unrelated to host-standardization close-out

### Part 6 Likely Files

- `src/app/AppShell.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-3 - Host Adapter Retirement And Future Surface Onboarding.md`

### Part 6 Checklist

- [x] Remove the last avoidable `AppShell` glue left over from Browser or Spaghetti compatibility support
- [x] Write down the explicit future-surface onboarding recipe using Browser, Spaghetti, and Console as the concrete examples, including the exact shared verbs, generic workspace state, and feature-local boundaries
- [x] Verify that Console still demonstrates the default reusable adoption path cleanly without requiring a new special-case host ladder
- [x] Add any final focused tests needed to show the last shared contract path no longer depends on feature-specific shell glue

### Part 6 Verification Shape

Minimum verification for part 6 should cover:
- no remaining `AppShell` branch still acts like avoidable feature-specific shell ownership for Browser or Spaghetti
- the focused `AppShell` checks still pass after the final cleanup
- the written onboarding recipe is concrete enough that a later surface could follow it without rediscovering Browser cleanup history
- `Console` still reads as the first clean proof of the default contract path after the final `AppShell` cleanup

### Part 6 Done Shape

Part 6 is done when:
- `AppShell` no longer carries avoidable feature-specific host glue for the `7.5` contract path
- the future-surface onboarding recipe is explicit, concrete, and code-facing
- `Workspace 7.5` can close honestly because the remaining path for later surfaces is documented instead of implicit

### Part 6 What Landed

The final `7.5-3` close-out slice kept scope intentionally small:
- detached Browser and Console restore lookup now routes through the shared `workspaceSurfaceActions.ts` seam instead of being hand-resolved inside `AppShell`
- the remaining `AppShell` shell glue is now mostly honest compatibility or rendering coordination rather than another feature-specific host-transition owner
- `Console` remains the first clean proof that a later surface can adopt the shared shell contract without replaying Browser cleanup history

### Explicit Future-Surface Onboarding Recipe

Use this recipe for later workspace surfaces and toolbars.

1. Put shared shell truth in workspace state.
   - Add or reuse `WorkspaceSurfaceKind`
   - Use workspace-owned host-route ownership, detached-surface state, slot or split layout truth, and shared surface placement for restore plus host transitions

2. Keep the host adapter thin.
   - The host file should mostly render feature UI
   - Local preview geometry, ghost rendering, and feature-specific titlebar controls stay local
   - The host should not become the owner of split commit, redock, detached-surface handling, or named host-route ownership

3. Call the shared shell verbs for shell transitions.
   - `focus`
   - `float`
   - `popout`
   - `redock`
   - `split`
   - `claim host route`

4. Keep feature-local state feature-local.
   - Presentation modes, panel controls, and feature-specific render state should stay in the feature store unless they are true shell lifecycle state
   - Do not force every feature into one generic UI model just for symmetry

5. Use the current surfaces as examples.
   - `Console` is the cleanest adoption proof for the default contract path
   - `Browser` shows the shared host-route and split ownership pattern
   - `Spaghetti` shows how to migrate a harder legacy surface without keeping old split truth alive

6. Do not rebuild the old problem.
   - Never reintroduce feature-local split commit ownership
   - Never reintroduce feature-local redock or detached-surface truth
   - Never create another Browser-style special host ladder when the shared workspace seam already covers the transition

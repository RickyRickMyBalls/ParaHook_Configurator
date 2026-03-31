# Workspace Phase Workspace-7.2 - Duplicated Surface Instances, Restore Rules, And Host-Mode Parity

## Doc Header

### Doc History
2. 2026-03-30 18:24: Reframed this doc as the shipped first `Workspace 7.2` slice after the duplicated slot-tree and retained-surface restore cut landed in code, and moved the remaining host-mode parity plus split-host retirement residue into the new active follow-on `Workspace 7.2b`
1. 2026-03-30 18:00: Added this native `Workspace 7.2` phase doc to turn the second subphase of the viewport-slot vision into an implementation-ready spec, locking real duplicate `Browser`, `Console`, and `Spaghetti Editor` surfaces under the slot model, stronger retained-surface restore and rebind rules, fuller host-mode parity across `slotted`, `floating`, and `popout`, and the first retirement pass for older special-case split hosts that the new slot system replaces

### Purpose

Use this phase to widen the `Workspace 7.1` slot foundation into a real duplicated-surface system.

The goal is to prove that the slot model can host more than one honest non-viewer surface instance at once while keeping the rules for:
- restore
- rebind
- float
- popout
- re-dock

under one shared host-mode model instead of old Browser or Spaghetti specific shell paths.

### Scope

This phase covers:
- real duplicate `Browser` surfaces under the slot model
- real duplicate `Console` surfaces under the slot model
- real duplicate `Spaghetti Editor` surfaces under the slot model
- stronger retained-surface restore rules when slots change kind and later return
- stronger editor rebind rules when duplicated editors start on one graph and later diverge
- fuller host-mode parity across `slotted`, `floating`, and `popout`
- the first retirement pass for older special-case Browser and Spaghetti split hosts where the slot model already replaces them

This phase does not cover:
- full duplicate `Model Viewport` runtime parity
- the deepest slot lifecycle actions such as `Duplicate Slot`, `Close Slot`, and `Join/Merge Slots`
- later viewport copy-library or preset features
- the final deletion pass for every temporary migration adapter

## Doc Body

### Summary

`Workspace 7.2` now reads as the shipped first duplicated-surface slice.

What landed in the first slice:
- deeper duplicated non-primary slot-tree hosting
- stronger retained-surface restore rules
- first recursive non-primary slot rendering under the slot model

What moved into `Workspace 7.2b`:
- fuller parity between `slotted`, `floating`, and `popout`
- the first real retirement of older Browser and Spaghetti split-specific adapters

### Locked Direction

`Workspace 7.2` should be:
- a duplicated-surface phase
- a retained-surface restore phase
- a host-mode parity phase
- an adapter-retirement phase where the slot system has already proven itself

`Workspace 7.2` should not be:
- full multiple-`Model Viewport` runtime widening
- the final cleanup phase
- a broad preset, duplication-library, or advanced viewport UX phase
- another special-case one-off Browser or Spaghetti patch lane

### Locked Outcome

At the end of `Workspace 7.2`:
- more than one `Browser` surface can exist honestly under the slot model
- more than one `Console` surface can exist honestly under the slot model
- more than one `Spaghetti Editor` surface can exist honestly under the slot model
- duplicated `Browser` and `Console` surfaces still reflect shared underlying truth
- duplicated `Spaghetti Editor` surfaces can start on the same graph and later rebind independently
- slotted, floating, and popped-out non-viewer surfaces follow one clearer owner-transfer model
- returning a slot to a previous surface kind restores the right retained surface more deterministically
- old split-specific Browser and Spaghetti host behavior starts shrinking where slot hosting already replaces it

### Current Code Read

Current shipped seam before `Workspace 7.2`:
- `Workspace 7.1` establishes the first slot tree, local viewport header, right-click type picker, and first split/floating loop
- Browser already has the most mature float and popout path under the current workspace seam
- `Workspace 5.2` already introduced first multiple editor surface identity and graph binding, but it still carries mixed old/new ownership residue
- `Workspace 5.3` still owns the later user-facing multi-graph `Open Editors` UX layer above these lower-level surface rules

Main residue blocking the first honest duplicated-surface cut:
- `Workspace 7.1` still centers its slot proof on one primary slot plus one secondary slot instead of a richer duplicated-surface model
- Browser still carries legacy split assumptions beside the new slot shell
- Spaghetti still carries older active-editor and split-host assumptions beside the new slot shell
- restore and rebind behavior still depends too heavily on temporary adapter logic instead of one clear retained-surface rule
- `popout` parity is still weaker and less uniform than `floating`

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-7.1 - Viewport Slot Foundations, Header Shell, And First Split Loop.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/vision1.md`

Critical locked umbrella decisions already inherited from `Workspace 7`:
- all viewport kinds should end as honest duplicable surface kinds, even if staged safely across subphases
- duplicated `Browser` and `Console` surfaces should reflect shared underlying truth
- duplicated `Spaghetti Editor` surfaces should start on the same graph by default and later allow independent rebind
- slot changes should restore prior retained surfaces when sensible instead of always creating new ones
- `Pop Out` should ultimately follow the same owner-transfer truth as `Float`

Current code seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Questions / Decisions

#### [x] Workspace 7.2 - Question 1 - What is the main job of this second subphase?

##### Locked Answer
- prove real duplicate non-viewer surfaces under the new slot model
- prove stronger retained-surface restore and editor rebind behavior
- prove fuller host-mode parity between `slotted`, `floating`, and `popout`

##### Why
- `Workspace 7.1` proves the slot foundation
- `Workspace 7.2` should prove that the slot system can host multiple honest surface instances without falling back into old special-case shell logic

#### [x] Workspace 7.2 - Question 2 - Which duplicated surface kinds must participate in this cut?

##### Locked Answer
- `browser`
- `console`
- `spaghettiEditor`

##### Why
- those are the three non-viewer viewport kinds already locked for duplication in the `Workspace 7` umbrella
- they are the safest place to prove duplication before widening into full multiple-`Model Viewport` runtime parity

#### [x] Workspace 7.2 - Question 3 - What should duplicated `Browser` surfaces share versus own locally?

##### Locked Answer
- duplicated `Browser` surfaces should share underlying Browser truth
- each Browser surface can still own local presentation state such as:
  - host mode
  - host target
  - local slot placement
  - local frame state

##### Why
- the user wants multiple viewport hosts onto the Browser, not accidental separate Browser worlds
- the slot model still needs each Browser surface to be a real hosted instance with its own placement and presentation

#### [x] Workspace 7.2 - Question 4 - What should duplicated `Console` surfaces share versus own locally?

##### Locked Answer
- duplicated `Console` surfaces should share underlying Console truth
- each Console surface can still own local presentation state such as:
  - host mode
  - host target
  - local slot placement
  - local frame state

##### Why
- multiple Console surfaces should behave like multiple synced views onto one console truth, not separate console universes

#### [x] Workspace 7.2 - Question 5 - What should duplicated `Spaghetti Editor` surfaces share versus own locally?

##### Locked Answer
- if two editor surfaces point at the same graph, they should show the same graph truth
- each editor surface must still own its own:
  - host mode
  - host target
  - slot placement
  - local frame or presentation state
- one duplicated editor surface must be allowed to rebind later without forcing the other editor surfaces to move

##### Why
- this is the minimum honest rule that supports both "two editors on Graph A" and later "Editor B moves to Graph B"

#### [x] Workspace 7.2 - Question 6 - What restore rule must be stronger by the end of this phase?

##### Locked Answer
- when a slot returns to a prior surface kind, it should restore the most recent compatible retained surface for that slot and context when one exists
- only create a fresh surface when no sensible retained surface remains

##### Why
- the slot system should feel reversible instead of destructive
- `Workspace 7.2` is the right time to make that rule more deterministic because the first duplicate surface instances now exist for real

#### [x] Workspace 7.2 - Question 7 - What rebind rule must be stronger by the end of this phase?

##### Locked Answer
- duplicated `Spaghetti Editor` surfaces should start on the same graph as the source editor by default
- later rebind of one editor surface should move only that surface
- do not collapse the other editor surfaces back into one dominant active-editor assumption

##### Why
- this is one of the main architectural reasons `Workspace 5.2` existed at all
- `Workspace 7.2` should make that behavior honest under the slot system instead of leaving it half old-model and half new-model

#### [x] Workspace 7.2 - Question 8 - What host-mode parity must already be real in this phase?

##### Locked Answer
- duplicated non-viewer surfaces should move honestly between:
  - `slotted`
  - `floating`
  - `popout`
- leaving a slot for `floating` or `popout` should dissolve the now-empty slot
- that same surface should later be able to re-dock into a new split slot
- `popout` should follow the same owner-transfer rule as `float`, differing only by host location

##### Why
- without this parity, the duplicated-surface architecture will still fracture into one slot model and one older popup model

#### [x] Workspace 7.2 - Question 9 - What old host logic should begin shrinking in this phase?

##### Locked Answer
- start retiring older special-case Browser split ownership where the slot system already replaces it
- start retiring older special-case Spaghetti split ownership where the slot system already replaces it
- do not keep both full systems alive once the slot model covers the same runtime path honestly

##### Why
- `Workspace 7.2` should begin convergence, not just add more parallel host systems
- leaving duplicate host paths alive too long will make later `7.4` cleanup harder and riskier

#### [x] Workspace 7.2 - Question 10 - What must still stay out of scope in this phase?

##### Locked Answer
- full multiple-`Model Viewport` runtime parity
- the deepest slot lifecycle actions:
  - `Duplicate Slot`
  - `Close Slot`
  - `Join/Merge Slots`
- later viewport preset and copy-library features
- the final delete-everything cleanup pass

##### Why
- the duplicated non-viewer surface model is already enough risk for one subphase
- the heavier multi-viewer widening still deserves its own dedicated `7.3` cut

### Important Interfaces And Types To Lock

- `WorkspaceSurfaceInstanceRecord`
  - `surfaceInstanceId`
  - `surfaceKind`
  - `hostMode`
  - `hostSlotId | hostViewportId | childWindowId`
  - retained-surface restore metadata
- `WorkspaceViewportSlot`
  - local hosted surface instance id
  - slot-local header state
  - layout leaf id
- `WorkspaceRetainedSurfaceRecord`
  - surface kind
  - last slot context
  - last host mode
  - host viewport affinity
  - restore priority or timestamp
- `WorkspaceEditorSurfaceBinding`
  - graph document id
  - editor surface instance id
  - rebind-safe ownership rules
- `WorkspaceSurfaceHostRegistry`
  - render host mapping for `browser`, `console`, and `spaghettiEditor`
  - duplicate-surface-safe resolution by concrete `surfaceInstanceId`

Important rule:
- these types should make duplicate surface ownership and restore rules explicit
- do not hide duplicated-surface truth behind one old active-surface fallback once this phase lands

### First Implementation Cut

`Workspace 7.2` should land in the smallest safe sequence:

1. extend workspace slot/surface types so duplicated non-viewer surfaces have honest instance records
2. widen the slot render registry so slot hosting resolves by `surfaceInstanceId`, not only by kind
3. make duplicate `Browser` surface instances real under the slot model
4. make duplicate `Console` surface instances real under the slot model
5. make duplicate `Spaghetti Editor` surface instances real under the slot model
6. strengthen retained-surface restore so slot-kind changes and returns pick the right prior instance
7. strengthen editor rebind behavior so duplicated editors can diverge without killing each other
8. make `popout` follow the same slot-leave / dissolve / re-dock loop already proven for `float`
9. retire old Browser and Spaghetti split-specific host paths where the slot system now fully owns that runtime path

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Acceptance And Done Shape

`Workspace 7.2` is done when:
- the slot model can host more than one real `Browser` surface
- the slot model can host more than one real `Console` surface
- the slot model can host more than one real `Spaghetti Editor` surface
- duplicated `Browser` and `Console` surfaces stay synced to shared underlying truth
- duplicated `Spaghetti Editor` surfaces can start on the same graph and later rebind independently
- duplicated non-viewer surfaces move cleanly between `slotted`, `floating`, and `popout`
- restoring a slot to a prior surface kind chooses the right retained surface deterministically
- old Browser and Spaghetti split-specific host paths have started shrinking where the slot system fully replaces them

### Verification Shape

Minimum verification for `Workspace 7.2` should cover:
- creating and hosting two real `Browser` surfaces under the slot model
- creating and hosting two real `Console` surfaces under the slot model
- creating and hosting two real `Spaghetti Editor` surfaces under the slot model
- proving duplicated `Browser` and `Console` surfaces stay in sync with shared underlying truth
- proving two duplicated editors can start on one graph and later let one rebind without killing the other
- proving duplicated non-viewer surfaces can leave a slot for `floating` and `popout`, dissolve the empty slot, and later re-dock into a new split slot
- proving at least one older special-case Browser or Spaghetti split path is no longer needed where the slot system now owns that route

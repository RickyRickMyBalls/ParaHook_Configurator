# Workspace Phase Workspace-7.2b - Host-Mode Parity And Split-Host Retirement

## Doc Header

### Doc History
4. 2026-03-30 21:09: Updated the `7.2b` progress checklist after shipping the next Browser host-parity slice so the doc now records that detached slotted Browser surfaces bypass the old left-dock preview and redock directly into the slot tree when they edge-drop back onto a viewport side
3. 2026-03-30 20:58: Updated the `7.2b` progress checklist after shipping the next live-parity cleanup slice so the doc now records that duplicate docked Browser and Console compatibility surfaces are suppressed once the slot tree or detached-slot seam already owns those same surfaces
2. 2026-03-30 20:36: Added a live `7.2b` progress checklist after shipping the first parity slice so the doc now separates what is already implemented from what still remains before the phase can honestly move on to `Workspace 7.3`
1. 2026-03-30 18:24: Added this native `Workspace 7.2b` phase doc to isolate the post-`7.2a` residue into one implementation-ready follow-on for slotted/floating/popout parity, deterministic slot dissolve and re-dock behavior, and the first real retirement pass for older Browser and Spaghetti split-specific hosts where the slot tree now owns the route

### Purpose

Use this phase to finish the non-viewer host-mode parity work that remains after the first `Workspace 7.2` slice.

The goal is to make duplicated non-viewer surfaces move honestly between:
- `slotted`
- `floating`
- `popout`

while shrinking the old Browser and Spaghetti split-specific hosts where the slot tree now replaces them.

### Scope

This phase covers:
- stronger `slotted` -> `floating` -> re-dock parity for `Browser`, `Console`, and `Spaghetti Editor`
- stronger `slotted` -> `popout` -> re-dock parity for `Browser`, `Console`, and `Spaghetti Editor`
- deterministic slot dissolve and layout recombine behavior when a slotted surface leaves
- deterministic restore or reattach rules when that same surface later docks back into the slot tree
- the first real retirement pass for older Browser split-specific host ownership that the slot tree now replaces
- the first real retirement pass for older Spaghetti split-specific host ownership that the slot tree now replaces

This phase does not cover:
- full duplicate `Model Viewport` runtime parity
- final deletion of every migration adapter
- the deepest slot lifecycle actions such as `Duplicate Slot`, `Close Slot`, and `Join/Merge Slots`
- later advanced viewport preset, copy-library, or template features

## Doc Body

### Summary

`Workspace 7.2b` is the host-mode parity and split-host retirement follow-on after the first `7.2` duplicated-slot-tree slice.

It should deliver:
- stronger non-viewer host-mode parity
- clearer slot dissolve and re-dock truth
- less old Browser and Spaghetti split-host duplication

### Progress Checklist

Current progress read:
- first `7.2b` parity slice is shipped
- full `7.2b` is not done yet

Checklist:
- [x] Add a shared detached-slot surface record under `src/app/workspace/`
- [x] Make slot `Float` detach through that shared workspace seam
- [x] Make slot `Pop Out` detach through that shared workspace seam
- [x] Make detached `Browser` surfaces redock back into the slot tree through the shared seam
- [x] Make detached `Console` surfaces redock back into the slot tree through the shared seam
- [x] Make detached `Spaghetti Editor` surfaces redock back into the slot tree when they edge-dock from floating
- [x] Make detached `Spaghetti Editor` surfaces redock back into the slot tree when their popout closes
- [x] Suppress the duplicate docked Browser compatibility surface while the slot tree or detached-slot seam already owns that Browser surface
- [x] Suppress the duplicate docked Console compatibility surface while the slot tree or detached-slot seam already owns that Console surface
- [x] Make detached slotted `Browser` floating surfaces ignore the old left-dock preview and redock directly into the slot tree when they edge-drop back onto a viewport side
- [ ] Make live `Browser` slot / floating / popout parity feel fully uniform under the slot-owned host model
- [ ] Make live `Console` slot / floating / popout parity feel fully uniform under the slot-owned host model
- [ ] Make live `Spaghetti Editor` slot / floating / popout parity feel fully uniform under the slot-owned host model
- [ ] Retire more of the old Browser split-specific host ownership where the slot tree now fully owns that route
- [ ] Retire more of the old Spaghetti split-specific host ownership where the slot tree now fully owns that route
- [ ] Re-run the full non-viewer parity QA pass and mark `7.2b` complete

### Locked Direction

`Workspace 7.2b` should be:
- a host-mode parity phase
- a slot dissolve and re-dock phase
- an adapter-retirement phase

`Workspace 7.2b` should not be:
- another slot-tree-foundation phase
- a multiple-`Model Viewport` runtime widening phase
- a broad advanced viewport UX or preset phase

### Locked Outcome

At the end of `Workspace 7.2b`:
- slotted non-viewer surfaces can leave for `floating` honestly
- slotted non-viewer surfaces can leave for `popout` honestly
- an empty slot dissolves deterministically when its hosted surface leaves
- that same surface can later re-dock into a new split slot deterministically
- older Browser split-specific host logic shrinks further where the slot tree already owns that route
- older Spaghetti split-specific host logic shrinks further where the slot tree already owns that route

### Current Code Read

Current shipped seam after the first `Workspace 7.2` slice:
- the slot tree can now host deeper duplicated non-primary surfaces
- retained surface restore by slot kind is now more explicit under `src/app/workspace/`
- AppShell now renders the viewport area from the recursive slot tree
- Browser floating and popout still rely on the older Browser host as a compatibility shell
- Spaghetti floating and popout still rely on the older Spaghetti host as a compatibility shell

Main residue that still belongs to `7.2b`:
- `floating` and `popout` still feel less uniform than `slotted`
- Browser and Spaghetti still carry older split-host seams beside the slot tree
- host-mode transitions still need stronger deterministic re-dock rules under one slot-owned model

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-7.1 - Viewport Slot Foundations, Header Shell, And First Split Loop.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Shipped/Workspace_Phase Workspace-7.2 - Duplicated Surface Instances, Restore Rules, And Host-Mode Parity.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

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

#### [x] Workspace 7.2b - Question 1 - What is the main job of this follow-on slice?

##### Locked Answer
- finish non-viewer host-mode parity after the first `7.2` slot-tree slice
- make slot leave, dissolve, and re-dock behavior deterministic
- shrink old split-specific Browser and Spaghetti host ownership where the slot tree now replaces it

##### Why
- the first `7.2` slice proved deeper duplicated slot hosting and retained-surface restore
- the next honest move is to finish the host-mode transitions before widening to `7.3`

#### [x] Workspace 7.2b - Question 2 - Which surface kinds must participate in this parity cut?

##### Locked Answer
- `browser`
- `console`
- `spaghettiEditor`

##### Why
- those are the non-viewer surface kinds already widened in `7.2a`
- `Model Viewport` widening still belongs to `7.3`

#### [x] Workspace 7.2b - Question 3 - What is the required slot-leave rule for `floating`?

##### Locked Answer
- when a slotted non-viewer surface leaves for `floating`, it leaves the slot tree honestly
- if that slot becomes empty, the slot dissolves
- the layout recombines deterministically

##### Why
- this keeps `floating` parallel with the rules already locked in the umbrella `Workspace 7` vision
- empty dead slots would make the slot model feel broken

#### [x] Workspace 7.2b - Question 4 - What is the required slot-leave rule for `popout`?

##### Locked Answer
- `popout` should follow the same owner-transfer truth as `floating`
- when a slotted non-viewer surface leaves for `popout`, it leaves the slot tree honestly
- if that slot becomes empty, the slot dissolves
- the layout recombines deterministically

##### Why
- `popout` should not be a second special-case host system
- the only real difference between `floating` and `popout` should be host location

#### [x] Workspace 7.2b - Question 5 - What re-dock rule must be true by the end of this phase?

##### Locked Answer
- a floating or popped-out non-viewer surface must be able to dock back into a new split slot deterministically
- that re-dock path should use the same slot tree and slot split rules as the normal slotted system

##### Why
- without this, host-mode transitions are still asymmetric
- the slot tree should be the authoritative place where tiled layout gets rebuilt

#### [x] Workspace 7.2b - Question 6 - What old Browser host logic should shrink in this phase?

##### Locked Answer
- older Browser split-specific slot ownership should shrink where the slot tree now renders and owns that path
- keep Browser floating and popout compatibility shells only where the slot system does not yet replace them

##### Why
- Browser already has the most mature older host path
- `7.2b` should converge the split route instead of keeping two full slot-like systems alive

#### [x] Workspace 7.2b - Question 7 - What old Spaghetti host logic should shrink in this phase?

##### Locked Answer
- older Spaghetti split-specific slot ownership should shrink where the slot tree now renders and owns that path
- keep Spaghetti floating and popout compatibility shells only where the slot system does not yet replace them

##### Why
- Spaghetti still carries the most split-brain host residue
- `7.2b` should reduce that residue before the later multi-viewer widening in `7.3`

#### [x] Workspace 7.2b - Question 8 - What should still stay out of scope here?

##### Locked Answer
- full multiple-`Model Viewport` runtime parity
- final deletion of every migration adapter
- deep slot lifecycle actions such as `Duplicate Slot`, `Close Slot`, and `Join/Merge Slots`

##### Why
- this follow-on should finish host-mode parity, not widen into the next viewer-runtime phase

### Important Interfaces And Types To Lock

- `WorkspaceSurfaceInstanceRecord`
  - `surfaceInstanceId`
  - `surfaceKind`
  - `hostMode`
  - `hostSlotId | hostViewportId | childWindowId`
  - restore metadata
- `WorkspaceViewportSlot`
  - hosted surface instance id
  - slot-local header state
  - layout leaf id
- `WorkspaceRetainedSurfaceRecord`
  - surface kind
  - last slot context
  - last host mode
  - host viewport affinity

Important rule:
- host-mode transitions should be explicit workspace-owned truth
- do not let older Browser or Spaghetti split adapters keep co-owning the same route once the slot tree covers it

### First Implementation Cut

`Workspace 7.2b` should land in the smallest safe sequence:

1. strengthen slot leave and dissolve rules for `floating`
2. strengthen slot leave and dissolve rules for `popout`
3. strengthen deterministic re-dock into the slot tree
4. make Browser slot/floating/popout parity more uniform under one slot-owned owner-transfer model
5. make Console slot/floating/popout parity more uniform under one slot-owned owner-transfer model
6. make Spaghetti slot/floating/popout parity more uniform under one slot-owned owner-transfer model
7. retire older Browser split-specific host ownership where the slot tree now fully owns that route
8. retire older Spaghetti split-specific host ownership where the slot tree now fully owns that route

Implementation status:
- steps `1` through `3` are now shipped in the first `7.2b` slice
- step `6` is partially shipped through the detached Spaghetti edge-dock and popout-close redock path
- steps `4`, `5`, `7`, and `8` still remain as the live residue before the phase is done

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Acceptance And Done Shape

`Workspace 7.2b` is done when:
- slotted `Browser`, `Console`, and `Spaghetti Editor` surfaces can leave honestly for `floating`
- slotted `Browser`, `Console`, and `Spaghetti Editor` surfaces can leave honestly for `popout`
- empty slots dissolve deterministically when their hosted surface leaves
- the layout recombines deterministically after slot dissolve
- those same surfaces can later re-dock into a new split slot deterministically
- older Browser and Spaghetti split-specific host routes have shrunk further where the slot tree now fully owns the route

### Verification Shape

Minimum verification for `Workspace 7.2b` should cover:
- slot -> `floating` -> re-dock for `Browser`
- slot -> `floating` -> re-dock for `Console`
- slot -> `floating` -> re-dock for `Spaghetti Editor`
- slot -> `popout` -> re-dock for `Browser`
- slot -> `popout` -> re-dock for `Console`
- slot -> `popout` -> re-dock for `Spaghetti Editor`
- proving empty-slot dissolve and layout recombine after each leave path
- proving at least one old Browser split-specific route is no longer needed where the slot tree owns the same path
- proving at least one old Spaghetti split-specific route is no longer needed where the slot tree owns the same path

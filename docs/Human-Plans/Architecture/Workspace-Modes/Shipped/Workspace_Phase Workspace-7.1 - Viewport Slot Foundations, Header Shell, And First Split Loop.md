# Workspace Phase Workspace-7.1 - Viewport Slot Foundations, Header Shell, And First Split Loop

## Doc Header

### Doc History
3. 2026-03-30 22:54: Checked off the `7.1` split-divider drag item after shipping the first live slot-tree divider resize loop, so the checklist now reflects that viewport-slot split ratios can be adjusted directly from the new divider instead of staying fixed
2. 2026-03-30 20:39: Added a live `7.1` progress checklist after the later `7.2` and `7.2b` work so the phase doc now clearly shows that the core slot-foundation scope is effectively shipped, while the rougher host-parity residue moved forward into `Workspace 7.2` instead of meaning `7.1` never landed
1. 2026-03-30 17:42: Added this native `Workspace 7.1` phase doc to turn the first subphase of the viewport-slot vision into an implementation-ready spec, locking the first slot types, local header shell, right-click viewport-type picker, first slot-based split creation, and drag-out-to-float plus re-dock loop while leaving duplicate-model-viewport runtime parity and deeper slot lifecycle actions for later `7.x` cuts

### Purpose

Use this phase to land the first real viewport-slot foundation under the new `Workspace 7` architecture.

The goal is to replace the first special-case split path with one honest slot model that already supports:
- local viewport headers
- the viewport-type picker
- slot-based split creation
- drag-out to floating
- drag-back to edge re-docking

### Scope

This phase covers:
- canonical viewport-slot and layout-node types
- a reusable local viewport header shell
- the top-left viewport control with existing left-click behavior preserved
- the right-click viewport-type picker
- first slot-based split creation
- first drag-out-to-floating and re-dock loop
- Browser, Spaghetti, and Console as slot-capable surfaces in the new model
- one protected primary model viewport wrapped by the new slot shell

This phase does not cover:
- full duplicate `Model Viewport` runtime parity
- deeper slot lifecycle actions such as `Duplicate Slot`, `Close Slot`, and `Join/Merge Slots`
- full host cleanup of every older special-case split host
- later advanced viewport presets or copy libraries

## Doc Body

### Summary

`Workspace 7.1` is the first working viewport-slot foundation phase.

It should deliver:
- one honest slot tree foundation
- one real local viewport header shell
- one right-click area-type picker
- one first slot-based split loop
- one drag-out to floating and drag-back to split loop

### Progress Checklist

Current progress read:
- `Workspace 7.1` is effectively shipped as the first slot-foundation phase
- later parity cleanup and deeper host-mode convergence moved into `Workspace 7.2` and `Workspace 7.2b`

Checklist:
- [x] Add canonical viewport-slot and layout-node types under `src/app/workspace/`
- [x] Add a reusable local `ViewportFrame`
- [x] Preserve the existing left-click top-left viewport control behavior
- [x] Add the right-click viewport-type picker to that same local control
- [x] Wrap the protected primary model viewport in the new slot shell
- [x] Add the first surface-host registry for `modelViewport`, `Browser`, `Console`, and `Spaghetti Editor`
- [x] Re-express the first split as slot leaves in a layout tree instead of one viewer plus one special split host
- [x] Let the first secondary slot host `Browser`
- [x] Let the first secondary slot host `Console`
- [x] Let the first secondary slot host `Spaghetti Editor`
- [x] Prove the first slot -> floating leave path with empty-slot dissolve
- [x] Prove the first floating -> slot redock loop back into the split layout
- [x] Keep the protected primary model viewport stable through those first slot-host transitions
- [x] Add slot split-divider drag resizing
- [ ] Fully retire the older special-case Browser / Spaghetti split hosts

Important read:
- the unchecked items above are not evidence that `7.1` failed
- they are later polish or migration residue that was intentionally widened into `Workspace 7.2` and `Workspace 7.2b`
- the actual `7.1` foundation goal was to prove the slot shell, first slot tree, first type picker, and first leave / redock loop, and that core goal is landed

### Locked Direction

`Workspace 7.1` should be:
- a slot-foundation phase
- a local viewport-header phase
- a first split-authoring conversion phase
- a host-mode loop proof between `slotted` and `floating`

`Workspace 7.1` should not be:
- full multiple-model-viewport runtime parity
- a cleanup-everything phase
- a broad advanced viewport feature phase
- another special-case Browser or Spaghetti split patch

### Locked Outcome

At the end of `Workspace 7.1`:
- one primary model viewport is wrapped by the new slot shell
- the first split is represented as two slot leaves in a layout tree
- Browser, Spaghetti, and Console can occupy that secondary slot through the new slot model
- the local top-left viewport button keeps ParaHook's existing left-click view behavior
- right-click on that same button opens the viewport-type picker for the slot
- dragging a slotted surface out dissolves the empty slot and turns that same surface into a floating host
- dragging that floating surface back to a viewport edge creates a new split slot again

### Current Code Read

Current shipped seam before `Workspace 7.1`:
- `Workspace 3` already gives us one protected viewport-local host seam around the primary viewer
- `Workspace 5.1` and `Workspace 5.2` already widened the workspace seam toward real multiple surface instances and child-window hosting
- `Workspace 6` already gives the family one shared activation and intent seam
- the current runtime still expresses split behavior through Browser and Spaghetti specific hosts more than one generic slot tree

Main residue blocking the first honest slot cut:
- no canonical viewport-slot type yet owns the split layout
- Browser and Spaghetti still carry special-case split hosting behavior
- the local viewport header and type-picker affordance do not exist as one reusable slot shell yet
- drag-out to floating and re-dock are still expressed as feature-specific shell rules rather than one slot/host-mode rule

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/vision1.md`

Critical locked umbrella decisions already inherited from `Workspace 7`:
- viewport slot is the primary workspace object
- host mode is separate from surface instance
- split targets should read as `Top`, `Right`, `Bottom`, and `Left`
- left-click on the local viewport button keeps the current view-mode behavior
- right-click on that same button opens the viewport-type picker
- dragging a surface out should dissolve the now-empty slot and allow later re-docking

Current code seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`

### Questions / Decisions

#### [x] Workspace 7.1 - Question 1 - What is the main job of this first subphase?

##### Locked Answer
- establish the first real slot-tree and viewport-header foundation
- prove one honest split loop under the new slot model
- prove the first host-mode loop between `slotted` and `floating`

##### Why
- this is the smallest cut that turns the `Workspace 7` umbrella from architecture direction into a live system

#### [x] Workspace 7.1 - Question 2 - Which surface kinds must participate in the first slot model?

##### Locked Answer
- `modelViewport`
- `spaghettiEditor`
- `browser`
- `console`

##### Why
- these are the first concrete viewport kinds already locked in the `Workspace 7` umbrella
- leaving one of them outside would immediately weaken the honesty of the slot model

#### [x] Workspace 7.1 - Question 3 - What must the first local header shell do?

##### Locked Answer
- host the top-left viewport button
- preserve existing left-click view-mode behavior
- open the viewport-type picker on right-click
- expose the first local slot actions:
  - `Split Top`
  - `Split Right`
  - `Split Bottom`
  - `Split Left`
  - `Float`
  - `Pop Out`

##### Why
- the header is the visible proof that slots are first-class workspace objects, not hidden layout records

#### [x] Workspace 7.1 - Question 4 - What is the first split behavior this phase must prove?

##### Locked Answer
- create a second slot by edge target
- place the dragged surface into that new slot automatically
- keep the original slot intact unless it loses its hosted surface

##### Why
- this is the direct bridge from today's edge-driven Browser and Spaghetti behavior into the slot system

#### [x] Workspace 7.1 - Question 5 - What floating behavior must already work in this first cut?

##### Locked Answer
- dragging a slotted surface out must turn it into a floating surface
- if the old slot becomes empty, the slot dissolves and the layout recombines
- that same floating surface must be able to dock back into a new split slot by edge drag later

##### Why
- if this loop is not proven in `7.1`, the slot model will still feel bolted onto the old shell

#### [x] Workspace 7.1 - Question 6 - What must still stay out of scope in this first cut?

##### Locked Answer
- full duplicate `Model Viewport` runtime parity
- slot duplicate / close / merge lifecycle actions
- broad cleanup of every older special-case host
- later advanced viewport features

##### Why
- these are better staged into `7.2+` after the slot foundation is proven

### Important Interfaces And Types To Lock

- `WorkspaceViewportSlot`
  - `viewportSlotId`
  - `surfaceKind`
  - `surfaceInstanceId`
  - local header state
  - layout leaf id
- `WorkspaceLayoutNode`
  - branch or leaf
  - split direction
  - ratio
  - child ids
- `WorkspaceSurfaceHostMode`
  - `slotted`
  - `floating`
  - `popout`
- `WorkspaceSurfaceHostTarget`
  - slot id when slotted
  - explicit `hostViewportId` when floating
  - child window id plus preserved `hostViewportId` when popped out
- `ViewportFrameProps`
  - slot id
  - current surface kind
  - header actions
  - selector actions
  - local chrome host
- `WorkspaceSurfaceHostRegistry`
  - one registry mapping viewport surface kinds to their render hosts

Important rule:
- these types should describe slot, shell, and host ownership only
- they should not absorb authored graph or project content truth

### First Implementation Cut

`Workspace 7.1` should land in the smallest safe sequence:

1. add canonical viewport-slot and layout-node types under `src/app/workspace/`
2. add one reusable `ViewportFrame` with:
   - local header shell
   - top-left viewport button
   - right-click viewport-type picker
3. wrap the protected primary viewer in that `ViewportFrame`
4. add the first surface-host registry for:
   - `modelViewport`
   - `spaghettiEditor`
   - `browser`
   - `console`
5. re-express the first split as two slot leaves instead of one viewer plus one special split host
6. let the secondary slot host Browser, Spaghetti, or Console through the new slot model
7. prove the drag-out-to-floating loop:
   - leave slot
   - dissolve empty slot
   - recombine layout
8. prove the re-dock loop:
   - drag floating surface to edge
   - create new split slot
   - place that same surface into the slot

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`

### Acceptance And Done Shape

`Workspace 7.1` is done when:
- the primary viewer is hosted through the new slot shell
- the first split exists as a slot tree, not as a special-case Browser or Spaghetti split path
- the top-left viewport button and right-click viewport-type picker work on the slot shell
- Browser, Spaghetti, and Console can all occupy the first secondary slot
- dragging a slotted surface out dissolves the empty slot and creates a floating host
- dragging that floating surface back to an edge re-creates a split slot and hosts the same surface there

### Verification Shape

Minimum verification for `Workspace 7.1` should cover:
- right-clicking the viewport button to open the slot-local type picker
- switching the secondary slot between Browser, Spaghetti, and Console
- dragging one slotted surface out into floating and confirming the empty slot dissolves
- dragging that same floating surface back to an edge and confirming a new split slot is created
- keeping the protected primary model viewport stable during those slot-host transitions

# Workspace Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping

## Doc Header

### Doc History
6. 2026-03-30 15:18: Locked the first slot-switch restore rule for `Workspace 7`, clarifying that changing a slot's surface kind should immediately detach the old surface from that slot but keep meaningful surfaces like `Browser` and `Spaghetti Editor` alive in workspace state for restore or rehousing instead of tearing them down destructively
5. 2026-03-30 15:15: Locked the first floating-host target rule for `Workspace 7`, clarifying that floating and popout surfaces should carry an explicit `hostViewportId` immediately instead of deriving ownership from the nearest or currently active viewport, so the modular host-mode model stays stable once more than one model viewport exists
4. 2026-03-30 15:12: Expanded `Workspace 7` to lock the modular host-mode model explicitly, clarifying that the goal is not to replace floating windows with slots but to treat `viewport slot`, `floating window`, and `popout window` as peer host modes for the same surface instance, and added the first concrete host-target rule for what a floating surface belongs over
3. 2026-03-30 15:09: Updated the `Workspace 7.EndQ1` interaction rule after clarifying the current ParaHook control conflict, locking that normal left-click on the local viewport button should keep its existing view-mode behavior while right-click on that same button opens the viewport-type picker so the Blender-style slot swap can coexist with today's view controls
2. 2026-03-30 15:06: Tightened this phase after directly reviewing the referenced Blender screenshots, clarifying that the target interaction is a real per-viewport area header with a local area-type selector rather than just a floating corner button, and added an end-of-doc questions-and-decisions section to lock the first UI and layout behavior more concretely
1. 2026-03-30 15:02: Added this native Workspace-family phase doc to capture the new viewport-slot vision from `vision1.md`, locking the Blender-style top-left viewport selector, slot-based surface swapping, and layout-tree direction into an implementation-ready architecture surface that builds on shipped `Workspace 6` activation seams instead of overwriting them

### Purpose

Use this phase to move ParaHook from special-case Browser and Spaghetti split hosting toward a generic viewport-slot workspace model.

The goal is to make each viewport a local workspace slot that can host different surface types and change independently, like Blender-style interchangeable editors.

### Scope

This phase covers:
- viewport slots as first-class workspace objects
- a generic viewport frame with a local per-viewport header bar
- a local area-type selector in the top-left of that header
- surface-kind versus surface-instance separation
- modular host modes for the same surface instance
- slot-local surface swapping between `Model Viewport`, `Spaghetti Editor Viewport`, and `Browser Viewport`
- the layout-tree foundation needed so split view becomes slot-driven instead of feature-driven

This phase does not cover:
- full user-facing multi-graph UX polish that still belongs to `Workspace 5.3`
- generic native desktop windows outside the browser child-window model already proven by `Workspace 5`
- separate independent viewer worlds with separate scene truth
- a rewrite of graph-authored content or Browser project-authored data

## Doc Body

### Summary

`Workspace 7` is the viewport-slot architecture phase.

It should deliver:
- one honest viewport-slot model
- one generic viewport frame with a real local header
- one local area-type selector menu
- one modular host-mode model where slot, floating, and popout are peers
- one slot-based path for swapping between viewport surface kinds without changing unrelated slots

### Locked Direction

`Workspace 7` should be:
- a viewport-slot architecture phase
- a surface-kind versus surface-instance separation phase
- a host-mode modularization phase
- a layout-tree preparation phase
- a local viewport header, chrome, and selector phase

`Workspace 7` should not be:
- another one-off Browser split upgrade
- another one-off Spaghetti split upgrade
- a replacement for floating windows with slot-only behavior
- a full multi-viewer runtime rewrite in the first cut
- a replacement for the shipped shared activation and intent seam from `Workspace 6`

### Locked Outcome

At the end of `Workspace 7`:
- a viewport slot is the primary workspace object
- each viewport slot can host one surface kind plus one concrete surface instance
- the same surface instance can move between `viewport slot`, `floating window`, and `popout window`
- one viewport can switch to another surface kind without forcing the whole workspace to change modes
- split view is defined as a layout of viewport slots instead of a set of feature-specific split behaviors
- the first Blender-style local area header exists as a real workspace control
- the top-left selector behaves like a viewport-type switcher for that slot only

### Vision Grounding

The direct vision input for this phase is:
- `docs/Human-Plans/Architecture/Workspace-Modes/vision1.md`

Key user-facing read from that vision:
- every viewport should have a top-left local selector inside its own header
- the selector should let the user switch that viewport only
- the system should support more than one `Spaghetti Editor`, more than one `Browser`, and later more than one `Model Viewport`

Direct screenshot-informed clarification:
- the target pattern is a real per-viewport area header like Blender, not just a small overlay button floating over content
- the selector should act like an area-type picker for that slot
- the rest of the header should belong to that viewport slot only

Important modularity clarification:
- the Blender-style slot system should not delete ParaHook's existing floating-over-viewport strength
- `viewport slot`, `floating window`, and `popout window` should be treated as peer host modes for one surface instance
- if the current floating-window system needs restructuring to support that cleanly, that restructuring is in scope for the architectural direction

### Current Code Read

Current shipped seams before `Workspace 7`:
- `Workspace 3` created a viewport-local host seam around the protected primary viewer
- `Workspace 5.1` and `Workspace 5.2` widened the shared workspace seam to cover editor pop-out plus first multiple-editor-surface identity
- `Workspace 6` already gives the workspace family one shared activation and intent seam

Main architectural residue still blocking the viewport-slot vision:
- Browser, Spaghetti, and the protected viewer still behave like separate shell systems more than one shared slot model
- split behavior is still largely expressed as feature-specific placement logic instead of one generic layout tree
- `SpaghettiWindowHost` still carries too much shell responsibility for floating, split, meatball, and child-window roles at once
- the app still thinks in terms of one protected viewer plus special surrounding tool hosts more than interchangeable viewport slots

### Current State And Source Inputs

Primary planning sources:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/vision1.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.3 - Open Editors Multi-Graph Workspace UX And Session Truth.md`
- `docs/Bugs/10_Workspace-5.2-SpaghettiPopup-Mixed-Ownership-Vs-Console.md`

Current code seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`

### Questions / Decisions

#### `Workspace 7.Q1` - What is the primary workspace object in this vision?

Locked answer:
- one viewport slot
- not one special Browser shell, one special Spaghetti shell, and one special Viewer shell

Why:
- the user wants one viewport to change independently from another viewport
- that only stays honest if the slot itself is the first-class object

#### `Workspace 7.Q2` - What is the difference between surface kind and surface instance?

Locked answer:
- surface kind answers what a slot is hosting:
  - `modelViewport`
  - `spaghettiEditor`
  - `browser`
- surface instance answers which live instance of that kind is hosted in that slot

Why:
- two Browsers or two Spaghetti editors need the same kind but different instances
- later two Model Viewports may need the same kind with different local camera or presentation state

#### `Workspace 7.Q2A` - What is the difference between a surface instance and a host mode?

Locked answer:
- a surface instance is the real live thing
- a host mode is where that surface instance is currently presented:
  - `slotted`
  - `floating`
  - `popout`

Why:
- this is the cleanest way to keep split layouts, floating overlays, and browser popouts modular instead of becoming separate feature systems

#### `Workspace 7.Q3` - What should the first selector menu offer?

Locked answer:
- `Model Viewport`
- `Spaghetti Editor Viewport`
- `Browser Viewport`

Why:
- those are the three concrete surface kinds already named in `vision1.md`
- the first menu should stay tight and prove the slot system before widening further

#### `Workspace 7.Q3A` - What visual pattern should the selector follow?

Locked answer:
- a local header-bar selector pattern like Blender's area-type control
- not a free-floating overlay-only button

Why:
- the screenshots show the selector living inside a real local area header
- that keeps the viewport type affordance understandable and consistent across split panes

#### `Workspace 7.Q4` - What should a split create in the target architecture?

Locked answer:
- a branch in a layout tree whose leaves are viewport slots
- not a feature-specific split mode owned separately by Browser or Spaghetti

Why:
- the whole point of this phase is to stop reinventing split behavior per surface family

#### `Workspace 7.Q5` - What should stay protected in the first cut?

Locked answer:
- keep one primary `Model Viewport` runtime protected in the first cut
- do not require full multiple-independent-viewer parity in the same phase

Why:
- the architecture should become viewport-slot-friendly before the viewer runtime is widened further

#### `Workspace 7.Q6` - How should this relate to `Workspace 5.3`?

Locked answer:
- do not pretend `Workspace 7` replaces `Workspace 5.3`
- `Workspace 5.3` still owns the user-facing multi-graph `Open Editors` truth
- `Workspace 7` is the broader viewport-slot and surface-swapping architecture that should build on the earlier multi-surface groundwork

Why:
- multi-graph editor UX and Blender-style viewport swapping are adjacent, but they are not the same layer

#### `Workspace 7.Q7` - Should split slots and floating windows coexist?

Locked answer:
- yes
- the user should still be able to float a surface over a model viewport even when split slots exist elsewhere in the workspace

Why:
- that hybrid flexibility is already one of ParaHook's strengths
- slots should become a new host mode, not a forced replacement for windowed behavior

#### `Workspace 7.Q8` - What should a floating surface belong over?

Locked answer:
- a floating surface should belong over one specific model viewport host target
- floating mode should not be ownerless or global to the whole app
- store that target as an explicit `hostViewportId` immediately
- use nearest or active viewport only as a temporary migration fallback if older state has no explicit host yet

Why:
- once the workspace can contain more than one model viewport, a floating surface needs a clear viewport-relative host target
- it keeps floating behavior deterministic instead of focus-driven
- it also gives popout a stable home-context record when the same surface instance leaves the viewport and moves into a child window

#### `Workspace 7.Q9` - What should happen when a slot changes surface kind?

Locked answer:
- changing a slot kind should immediately detach the old surface instance from that slot
- keep meaningful retained surfaces like `Browser` and `Spaghetti Editor` alive in workspace state for restore or rehousing
- do not let the old slot owner linger invisibly as if it still owns the slot
- keep slot-local viewer state as slot state, not as a floating retained tool surface in the first cut

Why:
- slot switching should feel reversible without being destructive
- the slot itself must change immediately and honestly
- `Browser` and `Spaghetti Editor` are long-lived tool surfaces whose state is valuable to preserve

### Locked UX Rule

The user-facing rule should be simple:
- every viewport owns a local header and selector control
- choosing a new viewport type changes only that viewport
- other viewports keep their current surface kind and state
- a surface can still leave a slot and become a floating overlay over a model viewport when the user chooses to

### Important Interfaces And Types To Lock

- `WorkspaceViewportSlot`
  - `viewportSlotId`
  - `surfaceKind`
  - `surfaceInstanceId`
  - local chrome state
  - layout-leaf identity
- `WorkspaceViewportSurfaceKind`
  - `modelViewport`
  - `spaghettiEditor`
  - `browser`
- `WorkspaceSurfaceHostMode`
  - `slotted`
  - `floating`
  - `popout`
- `WorkspaceSurfaceHostTarget`
  - slot id when slotted
  - explicit `hostViewportId` when floating
  - child window id plus preserved `hostViewportId` when popped out
- `WorkspaceLayoutNode`
  - split branch versus leaf
  - split direction
  - ratio
  - child ids
- `ViewportFrameProps`
  - slot id
  - current surface kind
  - selector actions
  - local header actions
  - local chrome host
- `WorkspaceSurfaceHostRegistry`
  - one registry mapping surface kind to render host

Important rule:
- these types should describe shell, slot, and layout ownership
- they should not absorb graph-authored content or Browser project-authored content

### First Implementation Cut

`Workspace 7` should land in the smallest safe sequence:

1. add canonical viewport-slot and layout-node types under `src/app/workspace/`
2. add one generic `ViewportFrame` with a real local header and top-left selector affordance
3. wrap the protected primary viewer in that `ViewportFrame`
4. define a first surface-host registry for:
   - `modelViewport`
   - `spaghettiEditor`
   - `browser`
5. define the modular host-mode model for one surface instance:
   - `slotted`
   - `floating`
   - `popout`
6. re-express the first split case as two viewport slots instead of one viewer plus one special split surface
7. let the secondary slot switch between `Browser` and `Spaghetti Editor` without changing the primary viewer slot
8. preserve the ability to move that surface back out into a floating overlay over a model viewport
9. leave duplicated Model Viewports, viewport copying, and deeper layout editing as follow-ons once slot switching is stable

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`

### Acceptance And Done Shape

`Workspace 7` is done when:
- one viewport slot can switch between `Model Viewport`, `Browser Viewport`, and `Spaghetti Editor Viewport`
- the switch changes only the targeted viewport slot
- the first split layout is expressed as a layout of viewport slots
- Browser and Spaghetti are no longer treated as one-off split systems in that first slot-swapping path
- the shipped `Workspace 6` activation and intent seam still works across the slot-hosted surfaces
- the first slot header clearly reads as a local viewport header, not app-global chrome
- the same surface instance can move between slotted and floating presentation without becoming a different conceptual surface

### Verification Shape

Minimum verification for `Workspace 7` should cover:
- switching one viewport slot between Browser and Spaghetti without changing the other slot
- keeping the protected primary viewer slot stable during those swaps
- split creation and resize behavior on the first slot-based layout branch
- surface activation and command routing still behaving correctly after a slot swap
- Browser and Spaghetti retaining sane restore and focus behavior when moved back out of the slot-swapping path
- floating one slotted surface back over a model viewport without disturbing unrelated slots

### End Questions / Decisions

These are the end-of-doc decisions to keep visible while implementation planning starts.

#### `Workspace 7.EndQ1` - Should the viewport-type control be left-click, right-click, or both?

Locked answer:
- normal left-click on the local viewport button should keep the existing ParaHook view-mode behavior
- right-click on that same local viewport button should open the viewport-type picker for the slot
- do not force the first `Workspace 7` cut to steal the current left-click behavior just to mirror Blender exactly

Why:
- ParaHook already uses normal left-click there for viewport/view-mode behavior
- preserving that left-click behavior reduces regression risk while still giving the slot system a clear local entry point
- the important architectural rule is that the control is local to the viewport slot; the exact mouse button can differ from Blender when the current app already owns left-click for another meaningful action

#### `Workspace 7.EndQ2` - What should the local header own in the first cut?

Locked answer:
- the area-type selector
- the current viewport title or kind label
- a small local action region for later split or duplicate actions

Why:
- the header should clearly belong to one slot
- later slot-local actions need a natural home

#### `Workspace 7.EndQ3` - When the user changes a slot from one surface kind to another, should other slots change too?

Locked answer:
- no
- switching a slot changes only that slot

Why:
- this is the core promise of the Blender-style area model

#### `Workspace 7.EndQ4` - What should happen to a surface instance when its slot changes kind?

Locked answer:
- the old surface instance should leave that slot cleanly without forcing unrelated slots to reset
- meaningful retained surfaces like `Browser` and `Spaghetti Editor` should stay alive in workspace state for restore or rehousing
- the slot itself should switch immediately and honestly to the new kind
- slot-local viewer state should stay slot-local in the first cut instead of being promoted into another retained floating tool surface automatically

Why:
- slot swapping should feel reversible and local, not destructive to the whole workspace

#### `Workspace 7.EndQ5` - What should the first split create by default?

Locked answer:
- splitting should create a second viewport slot with the same local header pattern
- the new slot can inherit a sensible default hosted surface first, then be changed through the selector

Why:
- this keeps split creation and surface swapping as two related but distinct actions

#### `Workspace 7.EndQ5A` - Should a surface be able to leave a slot and become a floating window?

Locked answer:
- yes
- slot hosting and floating hosting should coexist as modular host modes for the same surface instance

Why:
- the goal is a modular workspace system, not a slot-only system
- preserving floating-over-viewport behavior keeps one of ParaHook's strongest hybrid interactions alive

#### `Workspace 7.EndQ5B` - What should floating mode target?

Locked answer:
- one specific model viewport host
- not the app globally
- store that target as an explicit `hostViewportId`
- use nearest or active viewport only as a temporary migration fallback if old state has no explicit host yet

Why:
- that target is needed once more than one model viewport can exist
- it keeps floating behavior local and predictable
- it gives popout a stable home-context record too

#### `Workspace 7.EndQ6` - What should stay out of the first `Workspace 7` cut even if the architecture allows it later?

Locked answer:
- full multi-viewer runtime parity
- viewport copy libraries or named viewport presets
- every possible Blender-like area type from day one

Why:
- the first cut should prove slot identity, header ownership, selector behavior, and slot-local surface swapping before widening further

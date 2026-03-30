# Workspace Phase Workspace-7 - Viewport Slot Architecture And Surface Swapping

## Doc Header

### Doc History
22. 2026-03-30 16:15: Locked the first `Workspace 7.1` scope question, clarifying that the first subphase should cover viewport-slot types, local headers, the right-click viewport-type picker, first slot-based split creation, and the drag-out-to-float plus re-dock loop, while leaving full duplicate-model-viewport runtime parity and deeper slot lifecycle actions for later `7.x` cuts
21. 2026-03-30 16:11: Reorganized the `Workspace 7` question ladder for readability while keeping all 31 locked questions, adding a short question-status summary and regrouping the questions into a cleaner sequential order so the architecture checklist is easier to scan without changing the underlying decisions
20. 2026-03-30 16:06: Locked the drag-out lifecycle loop for `Workspace 7`, clarifying that when a slotted surface is dragged into floating mode its now-empty slot should dissolve and the layout should recombine cleanly, while that same floating surface can later be dragged back to a viewport edge to create a new split slot again
19. 2026-03-30 16:01: Locked the slot-restore rule for `Workspace 7`, clarifying that when a slot changes away from one surface kind and later returns, it should restore the prior surface instance if that instance still exists and only create a fresh one when no sensible retained surface remains
18. 2026-03-30 15:59: Locked the duplicated-`Spaghetti Editor` start-and-rebind rule for `Workspace 7`, clarifying that a duplicated editor should start on the same graph as the source editor by default, stay synced while both surfaces point at that graph, and still allow one duplicated editor surface to be rebound later to a different graph without forcing the original editor to move
17. 2026-03-30 15:57: Locked the first duplicated-surface start-state rule for `Workspace 7`, clarifying that duplicated `Browser` and `Console` surfaces should start as synced copies of the current visible view state while duplicated `Model Viewport` surfaces should start as copies of the current camera/view state and then diverge locally after creation
16. 2026-03-30 15:54: Locked the first duplicated-`Model Viewport` shared-versus-local rule for `Workspace 7`, aligning the viewport behavior more explicitly with Blender by clarifying that duplicated model viewports should share scene and generated-model truth while still owning their own camera, view settings, floating-host context, and local viewport chrome
15. 2026-03-30 15:51: Locked the first shared-truth versus per-instance-state matrix for `Workspace 7`, clarifying that duplicated `Browser` and `Console` surfaces should reflect shared underlying truth, that `Spaghetti Editor` surfaces may bind to different graphs but should stay synchronized when two surfaces point at the same graph, and that duplicated `Model Viewport` surfaces should share model truth while still owning their own camera/view state and floating-host context
14. 2026-03-30 15:48: Locked the first duplicated-console rule for `Workspace 7`, clarifying that multiple `Console` viewport surfaces may exist at once but should all reflect the same shared console truth by default instead of becoming separate console worlds
13. 2026-03-30 15:42: Corrected the floating-host lifecycle rule for `Workspace 7`, locking that a floating or popped-out surface may outlive its last model viewport host without being forcibly rehomed or destroyed, and clarifying that `hostViewportId` should act as an explicit affinity or restore target rather than a hard live dependency
12. 2026-03-30 15:37: Locked the first slot-local action set for `Workspace 7`, clarifying that the initial viewport-slot controls beyond the selector should be the four edge split targets plus `Float` and `Pop Out`, while `Duplicate Slot`, `Close Slot`, and `Join/Merge Slots` stay deferred until a later subphase with stronger slot lifecycle rules
11. 2026-03-30 15:34: Tightened the `Workspace 7` split-language read to match the newer edge-driven drag behavior already proven in the live shell, clarifying that slot-split actions should speak in `Top`, `Right`, `Bottom`, and `Left` targets rather than the older `Horizontal` and `Vertical` wording that only describes divider orientation
10. 2026-03-30 15:31: Reformed the `Workspace 7` question sections into one checklist-style ladder, converting the locked questions to the new `#### [x] Workspace 7 - Question N - ...` format, moving the answers under foldable subheads, and removing the older `EndQ` wording so the decision set reads as one consistent architecture checklist
9. 2026-03-30 15:28: Expanded `Workspace 7` to include `Console` in the viewport-slot surface family, clarifying that the honest modular end-state should also allow `Console` as a hosted viewport surface and later duplicate surface kind, not just `Model Viewport`, `Spaghetti Editor`, and `Browser`
8. 2026-03-30 15:25: Clarified the overall execution rule for `Workspace 7`, locking that this phase is expected to break into multiple safe subphases when needed, but that the end state must still be a true honest viewport-slot system with no permanent workaround architecture even if that requires restructuring the current floating or slot hosts
7. 2026-03-30 15:21: Locked the first split-default rule for `Workspace 7`, clarifying that splitting a slot should duplicate the source slot's surface kind by default while always creating a new surface instance instead of sharing one owner across two slots
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
- slot-local surface swapping between `Model Viewport`, `Spaghetti Editor Viewport`, `Browser Viewport`, and `Console Viewport`
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
- a permanent workaround layer that preserves old special cases instead of converging on one honest system

### Locked Outcome

At the end of `Workspace 7`:
- a viewport slot is the primary workspace object
- each viewport slot can host one surface kind plus one concrete surface instance
- the same surface instance can move between `viewport slot`, `floating window`, and `popout window`
- one viewport can switch to another surface kind without forcing the whole workspace to change modes
- split view is defined as a layout of viewport slots instead of a set of feature-specific split behaviors
- the first Blender-style local area header exists as a real workspace control
- the top-left selector behaves like a viewport-type switcher for that slot only

### Locked Staging Rule

`Workspace 7` is expected to break into multiple subphases.

That staging is acceptable when it improves safety, but the end-state rule must stay strict:
- the final system should be a true honest viewport-slot architecture
- do not keep permanent workaround ownership rules just because they helped an earlier migration cut ship
- if the current floating-window or slot-host structure needs to change to make the final model clean, that restructuring is acceptable and should be preferred over long-lived adapter clutter

Important rule:
- stage safely
- converge honestly

### Vision Grounding

The direct vision input for this phase is:
- `docs/Human-Plans/Architecture/Workspace-Modes/vision1.md`

Key user-facing read from that vision:
- every viewport should have a top-left local selector inside its own header
- the selector should let the user switch that viewport only
- the system should support more than one `Spaghetti Editor`, more than one `Browser`, more than one `Console`, and later more than one `Model Viewport`

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

### Question Status

- locked questions: `32`
- open questions: `0`
- current need: break `Workspace 7` into safe implementation subphases, not discover a new first-wave architecture question set

### Core Architecture

#### [x] Workspace 7 - Question 1 - What is the primary workspace object in this vision?

##### Locked Answer
- one viewport slot
- not one special Browser shell, one special Spaghetti shell, and one special Viewer shell

##### Why
- the user wants one viewport to change independently from another viewport
- that only stays honest if the slot itself is the first-class object

#### [x] Workspace 7 - Question 2 - What is the difference between surface kind and surface instance?

##### Locked Answer
- surface kind answers what a slot is hosting:
  - `modelViewport`
  - `spaghettiEditor`
  - `browser`
  - `console`
- surface instance answers which live instance of that kind is hosted in that slot

##### Why
- two Browsers, two Spaghetti editors, or two Consoles need the same kind but different instances
- later two Model Viewports may need the same kind with different local camera or presentation state

#### [x] Workspace 7 - Question 3 - What is the difference between a surface instance and a host mode?

##### Locked Answer
- a surface instance is the real live thing
- a host mode is where that surface instance is currently presented:
  - `slotted`
  - `floating`
  - `popout`

##### Why
- this is the cleanest way to keep split layouts, floating overlays, and browser popouts modular instead of becoming separate feature systems

#### [x] Workspace 7 - Question 4 - What should the first selector menu offer?

##### Locked Answer
- `Model Viewport`
- `Spaghetti Editor Viewport`
- `Browser Viewport`
- `Console Viewport`

##### Why
- those are the first concrete surface kinds the modular workspace should support
- the first menu should stay tight but still include the already-landed shared-surface family beyond only the original three examples

#### [x] Workspace 7 - Question 5 - What visual pattern should the selector follow?

##### Locked Answer
- a local header-bar selector pattern like Blender's area-type control
- not a free-floating overlay-only button

##### Why
- the screenshots show the selector living inside a real local area header
- that keeps the viewport type affordance understandable and consistent across split panes

#### [x] Workspace 7 - Question 6 - What should a split create in the target architecture?

##### Locked Answer
- a branch in a layout tree whose leaves are viewport slots
- not a feature-specific split mode owned separately by Browser or Spaghetti
- user-facing split targets should be expressed as `Top`, `Right`, `Bottom`, and `Left`
- do not make the new slot language depend on older `Horizontal` or `Vertical` wording

##### Why
- the whole point of this phase is to stop reinventing split behavior per surface family
- `Top / Right / Bottom / Left` matches the edge-driven drag intent the user already sees in the current shell
- `Horizontal / Vertical` describes divider orientation, not user intent

#### [x] Workspace 7 - Question 7 - What should stay protected in the first cut?

##### Locked Answer
- keep one primary `Model Viewport` runtime protected in the first cut
- do not require full multiple-independent-viewer parity in the same phase

##### Why
- the architecture should become viewport-slot-friendly before the viewer runtime is widened further

#### [x] Workspace 7 - Question 8 - How should this relate to `Workspace 5.3`?

##### Locked Answer
- do not pretend `Workspace 7` replaces `Workspace 5.3`
- `Workspace 5.3` still owns the user-facing multi-graph `Open Editors` truth
- `Workspace 7` is the broader viewport-slot and surface-swapping architecture that should build on the earlier multi-surface groundwork

##### Why
- multi-graph editor UX and Blender-style viewport swapping are adjacent, but they are not the same layer

#### [x] Workspace 7 - Question 9 - Should split slots and floating windows coexist?

##### Locked Answer
- yes
- the user should still be able to float a surface over a model viewport even when split slots exist elsewhere in the workspace

##### Why
- that hybrid flexibility is already one of ParaHook's strengths
- slots should become a new host mode, not a forced replacement for windowed behavior

#### [x] Workspace 7 - Question 10 - What should a floating surface belong over?

##### Locked Answer
- a floating surface should belong over one specific model viewport host target
- floating mode should not be ownerless or global to the whole app
- store that target as an explicit `hostViewportId` immediately
- use nearest or active viewport only as a temporary migration fallback if older state has no explicit host yet
- treat `hostViewportId` as an explicit affinity or restore target, not as a hard live dependency that must always stay valid while the surface is running

##### Why
- once the workspace can contain more than one model viewport, a floating surface needs a clear viewport-relative host target
- it keeps floating behavior deterministic instead of focus-driven
- it also gives popout a stable home-context record when the same surface instance leaves the viewport and moves into a child window
- it avoids surprise jumps or forced destruction when the old host viewport changes kind or disappears

#### [x] Workspace 7 - Question 11 - What should happen when a slot changes surface kind?

##### Locked Answer
- changing a slot kind should immediately detach the old surface instance from that slot
- keep meaningful retained surfaces like `Browser` and `Spaghetti Editor` alive in workspace state for restore or rehousing
- do not let the old slot owner linger invisibly as if it still owns the slot
- keep slot-local viewer state as slot state, not as a floating retained tool surface in the first cut

##### Why
- slot switching should feel reversible without being destructive
- the slot itself must change immediately and honestly
- `Browser` and `Spaghetti Editor` are long-lived tool surfaces whose state is valuable to preserve

#### [x] Workspace 7 - Question 12 - What should splitting a slot create by default?

##### Locked Answer
- splitting a slot should duplicate the source slot's surface kind by default
- the new slot must always get its own new surface instance
- do not let two slots pretend to host the same live surface owner

##### Why
- this feels closest to the user's immediate context
- it keeps split creation fast and intuitive
- the architecture still stays honest because the split duplicates kind, not ownership

### Controls And Slot Actions

#### [x] Workspace 7 - Question 13 - Should the viewport-type control be left-click, right-click, or both?

##### Locked Answer
- normal left-click on the local viewport button should keep the existing ParaHook view-mode behavior
- right-click on that same local viewport button should open the viewport-type picker for the slot
- do not force the first `Workspace 7` cut to steal the current left-click behavior just to mirror Blender exactly

##### Why
- ParaHook already uses normal left-click there for viewport/view-mode behavior
- preserving that left-click behavior reduces regression risk while still giving the slot system a clear local entry point
- the important architectural rule is that the control is local to the viewport slot; the exact mouse button can differ from Blender when the current app already owns left-click for another meaningful action

#### [x] Workspace 7 - Question 14 - What should the local header own in the first cut?

##### Locked Answer
- the area-type selector
- the current viewport title or kind label
- a small local action region for the first slot actions:
  - `Split Top`
  - `Split Right`
  - `Split Bottom`
  - `Split Left`
  - `Float`
  - `Pop Out`

##### Why
- the header should clearly belong to one slot
- later slot-local actions need a natural home

#### [x] Workspace 7 - Question 15 - What are the first slot-local actions besides the top-left selector?

##### Locked Answer
- `Split Top`
- `Split Right`
- `Split Bottom`
- `Split Left`
- `Float`
- `Pop Out`
- hold these for a later subphase:
  - `Duplicate Slot`
  - `Close Slot`
  - `Join/Merge Slots`

##### Why
- the first six actions prove the core workspace model without taking on the full slot-destruction lifecycle immediately
- edge splits plus host-mode transitions are the highest-value first actions
- duplicate, close, and merge are more sensitive because they depend on stronger slot lifecycle and restore rules

### Duplication And Surface Truth

#### [x] Workspace 7 - Question 16 - Which surface kinds should the first honest duplicate rules cover?

##### Locked Answer
- allow duplicate `Browser`
- allow duplicate `Spaghetti Editor`
- allow duplicate `Console`
- keep full duplicate `Model Viewport` runtime parity staged into a later `Workspace 7.x` subphase if needed for safety

##### Why
- `Browser`, `Spaghetti Editor`, and `Console` are all real workspace surfaces that should fit the same modular slot system
- `Model Viewport` is the riskiest technically, so it is the safest one to stage while still keeping the architecture honest

#### [x] Workspace 7 - Question 17 - If the user has multiple `Console` viewports open, should they stay synced?

##### Locked Answer
- yes
- multiple `Console` viewport surfaces may exist at once
- by default they should all reflect the same shared console truth
- do not treat duplicated `Console` viewports as separate console worlds unless a later phase explicitly introduces that behavior

##### Why
- the workspace vision wants multiple viewports, not accidental forks of shared tool truth
- `Console` is most believable as multiple surfaces over one shared command and log state
- this keeps duplication modular at the surface-host level without inventing independent console state unnecessarily

#### [x] Workspace 7 - Question 18 - Which duplicated surface kinds should reflect shared truth, and which should own per-instance local state?

##### Locked Answer
- `Browser`
  - duplicated Browser surfaces should reflect the same shared Browser truth by default
  - they are multiple views onto the same underlying project/browser state
- `Console`
  - duplicated Console surfaces should reflect the same shared Console truth by default
  - they are multiple views onto the same underlying command/log state
- `Spaghetti Editor`
  - different Spaghetti Editor surfaces may bind to different graph documents
  - if two Spaghetti Editor surfaces are bound to the same graph, they should show the same graph truth
- `Model Viewport`
  - duplicated Model Viewport surfaces should reflect the same shared model or scene truth generated from the graph and hosted content
  - each Model Viewport surface can still own different camera/view state
  - each Model Viewport surface can still host different floating overlays

##### Why
- this keeps the modular viewport system honest without inventing unnecessary separate worlds
- it distinguishes shared underlying content truth from per-surface presentation state
- it matches the intended behavior:
  - Browser and Console are multiple synced views
  - Spaghetti can show different graphs, but shared graph bindings stay consistent
  - Model Viewports share scene truth while still giving the user different camera angles and local floating context

#### [x] Workspace 7 - Question 19 - What should a duplicated `Model Viewport` share, and what should stay local per viewport?

##### Locked Answer
- duplicated `Model Viewport` surfaces should share:
  - model or scene truth
  - selection truth
  - generated output from graph and hosted Browser content
- each duplicated `Model Viewport` surface should keep local:
  - camera angle
  - projection and view settings
  - local floating-window host context
  - local viewport chrome state

##### Why
- this aligns the viewport behavior with the Blender-style multi-viewport read
- the user should be able to look at the same underlying model from different viewpoints without forking the model truth itself
- keeping camera and local chrome state per viewport preserves the value of having more than one viewport open at once

#### [x] Workspace 7 - Question 20 - When the user duplicates a `Browser`, `Console`, or `Model Viewport`, should the duplicate start as a copy of the current view state or reset to defaults?

##### Locked Answer
- duplicated `Browser` surfaces should start as synced copies of the current visible Browser view state
- duplicated `Console` surfaces should start as synced copies of the current visible Console view state
- duplicated `Model Viewport` surfaces should start as copies of the current camera and view state, then diverge locally after creation

##### Why
- this feels most like "duplicate this area" instead of "create a random new default area"
- it makes the duplicate immediately useful
- it aligns the duplicated viewport behavior more closely with Blender-style expectations

#### [x] Workspace 7 - Question 21 - When the user duplicates a `Spaghetti Editor`, should the duplicate stay bound to the same graph by default or open fresh?

##### Locked Answer
- by default, a duplicated `Spaghetti Editor` should start bound to the same graph as the source editor
- while both editor surfaces point at that same graph, they should stay synced to the same graph truth
- the user should still be able to later rebind one duplicated editor surface to a different graph without forcing the original editor surface to move

##### Why
- this makes duplication immediately useful
- it matches the intended "two editors on Graph A" behavior
- it still preserves the later multi-graph flexibility where `Editor A` can stay on `Graph A` while `Editor B` moves to `Graph B`

### Slot Switching And Lifecycle

#### [x] Workspace 7 - Question 22 - When the user changes a slot from one surface kind to another, should other slots change too?

##### Locked Answer
- no
- switching a slot changes only that slot

##### Why
- this is the core promise of the Blender-style area model

#### [x] Workspace 7 - Question 23 - What should happen to a surface instance when its slot changes kind?

##### Locked Answer
- the old surface instance should leave that slot cleanly without forcing unrelated slots to reset
- meaningful retained surfaces like `Browser` and `Spaghetti Editor` should stay alive in workspace state for restore or rehousing
- the slot itself should switch immediately and honestly to the new kind
- slot-local viewer state should stay slot-local in the first cut instead of being promoted into another retained floating tool surface automatically

##### Why
- slot swapping should feel reversible and local, not destructive to the whole workspace

#### [x] Workspace 7 - Question 24 - What should the first split create by default?

##### Locked Answer
- splitting should create a second viewport slot with the same local header pattern
- by default it should duplicate the source slot's surface kind
- the new slot must get its own new surface instance, not a second host onto the same live owner
- edge-target actions for that split should read as:
  - `Split Top`
  - `Split Right`
  - `Split Bottom`
  - `Split Left`

##### Why
- this keeps split creation intuitive while preserving honest surface-instance ownership
- it also matches the already-proven edge-driven Spaghetti split interaction better than `Split Horizontal` and `Split Vertical`

#### [x] Workspace 7 - Question 25 - Should a surface be able to leave a slot and become a floating window?

##### Locked Answer
- yes
- slot hosting and floating hosting should coexist as modular host modes for the same surface instance

##### Why
- the goal is a modular workspace system, not a slot-only system
- preserving floating-over-viewport behavior keeps one of ParaHook's strongest hybrid interactions alive

#### [x] Workspace 7 - Question 26 - What should floating mode target?

##### Locked Answer
- one specific model viewport host
- not the app globally
- store that target as an explicit `hostViewportId`
- use nearest or active viewport only as a temporary migration fallback if old state has no explicit host yet
- if that old host later changes kind or disappears, the floating or popped-out surface can keep running without being forced to rehome immediately

##### Why
- that target is needed once more than one model viewport can exist
- it keeps floating behavior local and predictable
- it gives popout a stable home-context record too

#### [x] Workspace 7 - Question 27 - What should happen when the old host model viewport of a floating or popped-out surface goes away?

##### Locked Answer
- the surface should keep running
- it does not need to immediately find a new model viewport host
- do not force a rehome just because the old host changed kind or disappeared
- keep the old `hostViewportId` as explicit affinity or restore history until the user later reattaches or the system truly needs a new valid slot target

##### Why
- this avoids surprise jumps
- it avoids destroying a live surface just because its former host changed
- it keeps restore logic separate from live running behavior

#### [x] Workspace 7 - Question 28 - What should happen when the user changes a slot from one surface kind to another and then back again later?

##### Locked Answer
- if the prior surface instance still exists, restore that same retained surface back into the slot
- if no sensible retained surface remains, create a fresh one
- do not always create a new surface by default when a meaningful prior one can be restored

##### Why
- this makes slot swapping feel reversible
- it preserves useful Browser, Console, and Editor state
- it fits the already-locked rule that slot changes should detach surfaces honestly without destroying them unnecessarily

#### [x] Workspace 7 - Question 29 - What should happen when a slotted surface is dragged out into floating mode?

##### Locked Answer
- the surface should leave the slot and become a floating surface
- if that slot becomes empty, the slot should dissolve
- the layout tree should recombine cleanly instead of leaving an empty dead viewport behind
- that same floating surface can later be dragged back to a viewport edge to create a new split slot again

##### Why
- dragging out should remove the surface from the tiled layout, not leave a blank hole behind
- dissolving the empty slot keeps the layout readable and intentional
- letting that same floating surface dock again preserves the modular host-mode loop between slotted and floating behavior

### Phasing And Scope

#### [x] Workspace 7 - Question 30 - Is it acceptable to stage this through multiple subphases?

##### Locked Answer
- yes
- safety staging is acceptable
- but the final system must still converge on one honest architecture with no permanent workaround ownership rules

##### Why
- this vision is large enough that breaking it into safe subphases is practical
- staging should reduce risk, not lower the quality bar of the final system

#### [x] Workspace 7 - Question 31 - What should stay out of the first `Workspace 7` cut even if the architecture allows it later?

##### Locked Answer
- full multi-viewer runtime parity
- viewport copy libraries or named viewport presets
- every possible Blender-like area type from day one

##### Why
- the first cut should prove slot identity, header ownership, selector behavior, and slot-local surface swapping before widening further

#### [x] Workspace 7 - Question 32 - What should the first `Workspace 7.1` implementation cut include, and what should it leave for later subphases?

##### Locked Answer
- `Workspace 7.1` should include:
  - viewport slot and layout-node types
  - local viewport header shell
  - the top-left viewport button behavior
  - the right-click viewport-type picker
  - first slot-based split creation
  - the drag-out-to-floating plus re-dock loop
  - one protected primary model viewport
  - Browser, Spaghetti, and Console as slot-capable surfaces in the new model
- `Workspace 7.1` should leave for later:
  - full duplicate `Model Viewport` runtime parity
  - slot `Duplicate`, `Close`, and `Join/Merge` lifecycle actions
  - deeper popout parity for every slot action
  - heavier cleanup of older special-case hosts after the new slot model proves itself

##### Why
- this gives the first real working viewport-slot architecture without forcing the riskiest parts into the same cut
- it is enough to prove the new slot model, host-mode transitions, and viewport selector behavior
- it keeps the later `Workspace 7.x` ladder meaningful instead of collapsing every risk into the first implementation pass

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
  - `console`
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
   - `console`
5. define the modular host-mode model for one surface instance:
   - `slotted`
   - `floating`
   - `popout`
6. re-express the first split case as two viewport slots instead of one viewer plus one special split surface
7. let the secondary slot switch between `Browser` and `Spaghetti Editor` without changing the primary viewer slot
8. preserve the ability to move that surface back out into a floating overlay over a model viewport
9. leave duplicated Model Viewports, viewport copying, and deeper layout editing as follow-ons once slot switching is stable

### Likely Follow-On Breakdown

`Workspace 7` will likely need a subphase ladder.

A reasonable first shape is:

1. `Workspace 7.1`
- viewport slot and layout-node types
- local viewport header and selector shell
- first slot-based split branch

2. `Workspace 7.2`
- surface kind versus surface instance separation widened across Browser and Spaghetti slot hosting
- honest host-mode transitions between slotted and floating

3. `Workspace 7.3`
- additional model viewport support
- stronger viewport-local host targeting
- deeper slot duplication and layout editing

4. `Workspace 7.4`
- further cleanup after the migration adapters are no longer needed
- delete any surviving temporary split or floating special cases that block the honest end-state

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
- one viewport slot can switch between `Model Viewport`, `Browser Viewport`, `Spaghetti Editor Viewport`, and `Console Viewport`
- the switch changes only the targeted viewport slot
- the first split layout is expressed as a layout of viewport slots
- Browser and Spaghetti are no longer treated as one-off split systems in that first slot-swapping path
- the shipped `Workspace 6` activation and intent seam still works across the slot-hosted surfaces
- the first slot header clearly reads as a local viewport header, not app-global chrome
- the same surface instance can move between slotted and floating presentation without becoming a different conceptual surface

### Verification Shape

Minimum verification for `Workspace 7` should cover:
- switching one viewport slot between Browser and Spaghetti without changing the other slot
- switching one viewport slot into Console without disturbing unrelated slots
- keeping the protected primary viewer slot stable during those swaps
- split creation and resize behavior on the first slot-based layout branch
- surface activation and command routing still behaving correctly after a slot swap
- Browser and Spaghetti retaining sane restore and focus behavior when moved back out of the slot-swapping path
- floating one slotted surface back over a model viewport without disturbing unrelated slots

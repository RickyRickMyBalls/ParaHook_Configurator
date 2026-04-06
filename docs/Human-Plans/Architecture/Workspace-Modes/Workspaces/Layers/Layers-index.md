# Layers

## Doc Header

### Doc History
5. 2026-03-28 14:06: Corrected the family-structure note so this umbrella doc now points at the real live `Layers-index.md` root file instead of the older `Layers.md` placeholder name that no longer exists on disk
4. 2026-03-26 12:55: Broke the `Layers` family into a code-backed four-phase execution ladder, added the first standalone `Layers/Future/` phase docs, and grounded the phase boundaries in the live app-store, Browser, Console, Viewer, and sketch-session seams instead of leaving the family as one umbrella note
3. 2026-03-26 11:26: Expanded the layer-controls direction so the architecture now explicitly owns console-driven `turn off layer`, `turn on all layers`, and multi-layer `isolate layers` behavior instead of leaving those management actions implied by the earlier visibility-only wording
2. 2026-03-26 11:16: Expanded this umbrella `Layers` architecture doc from a folder placeholder into a real AutoCAD-style direction surface, locking the first layer-manager behavior, supported selection/assignment targets, visibility/color expectations, and the distinction between CAD/content layers versus the separate console transcript layers
1. 2026-03-26 07:18: Created this folderized `Layers` architecture family with `Future/` and `Shipped/` placeholders so later layer-specific planning can grow under one umbrella doc instead of staying scattered across other architecture notes

### Purpose

This doc defines the architecture direction for ParaHook `Layers`.

This file is the umbrella index for the `Layers` family.

Use it to answer:
- what the `Layers` family is for
- what `layers` should mean in ParaHook
- how an AutoCAD-style layer manager should behave
- how layer selection and assignment should connect to Browser, viewport, and sketch selection truth
- where future `Layers` planning should live
- where shipped `Layers` records should move later

### Family Structure

Use this folder like this:

- `Layers-index.md`
  - umbrella architecture direction
  - family summary
  - future routing surface
- `Future/`
  - standalone implementation-ready `Layers` phase docs
- `Shipped/`
  - shipped records for completed `Layers` cuts

### Why This Doc Exists

ParaHook already uses the word `layers` in multiple architecture conversations.

This family gives CAD/content layers one canonical home before later layer-specific planning gets split into standalone phase docs.

Important distinction:
- this `Layers` family is about AutoCAD-style authored content layers
- this family is not the same thing as the Console transcript layer/filter system

### Scope

This doc covers:
- the umbrella home for AutoCAD-style `Layers`
- the first user-facing layer-manager direction
- the initial layer data model and behavior expectations
- shared selection-driven assignment for sketch geometry and 3D content
- console-facing layer visibility commands
- where future `Layers` phase docs should live
- where completed `Layers` records should move later

This doc does not cover:
- the final implementation phase split yet
- every later CAD layer feature such as lock, freeze, print/no-print, or per-viewport overrides
- every other doc that happens to mention layers incidentally

## Doc Body

### Current Status

This family now has a locked high-level direction, but it does not yet have standalone implementation-ready phase docs.

Use this doc as the umbrella entry point for later `Layers` planning.

Create future implementation-ready phase docs in `Future/` when the scope is clear.

Move completed standalone phase docs into `Shipped/` when they become shipped history.

### Core Direction

ParaHook `Layers` should work like a real CAD layer system.

Locked direction:
- the user should get a dedicated `Layer Manager` surface
- the user should be able to create layers
- each layer should have at least:
  - a user-facing name
  - a user-facing color
  - a visibility toggle
- the user should be able to select supported authored entities and assign them to a layer
- the system should support both:
  - sketch entities such as lines created in `Sketch Draw`
  - 3D authored objects that already participate in shared Browser/viewport selection

This should feel closer to AutoCAD layer ownership than to a temporary viewer-only filter panel.

### Layer Manager Direction

The first real `Layer Manager` should be the canonical surface for layer ownership and editing.

Expected first-pass manager responsibilities:
- create a layer
- rename a layer
- choose or edit a layer color
- toggle layer visibility on or off
- set one layer as the current/default target for new authored work
- assign the current supported selection to a chosen layer

Recommended first-pass presentation:
- one row per layer
- visible color swatch plus editable name
- clear visibility control
- obvious current-layer indicator
- a direct action for moving the current selection onto the highlighted layer

### Console Layer Controls

The Console should expose a small first-class layer-command surface for fast management actions.

Locked first commands:
- `turn off layer`
  - turns the chosen layer off
- `turn on all layers`
  - restores visibility for every layer
- `isolate layers`
  - turns every non-selected layer off
  - keeps the selected layer set on
  - must support isolating more than one selected layer at once

Recommended interaction model:
- these commands should operate on the current layer selection truth from the `Layer Manager`
- `isolate layers` should consume the currently selected layer rows rather than forcing the user into a one-layer-only isolate path
- the Console commands should act as management shortcuts for the same underlying layer visibility state owned by the manager

Important distinction:
- these are CAD/content layer commands exposed in the Console
- they are not the same thing as the Console transcript layer filter toolbar

### Selection And Assignment Model

Layer assignment should reuse shared workspace selection truth.

Locked rule:
- do not invent a second layer-local selection system
- Browser row selection, viewport selection, and `Sketch Draw` entity selection should all be able to feed layer assignment when they already produce real shared authored targets
- the layer manager consumes that selection truth and writes the new layer ownership back to the authored target

This matters because the repo already has active Browser, viewport, and Console work built around one shared selection model.

`Layers` should join that system rather than bypassing it.

### Supported Target Direction

The first supported layer-assignment targets should be the authored things the user can already meaningfully select.

Recommended first owned targets:
- committed sketch entities created inside `Sketch Draw`
  - example: line, polyline segment, rectangle, circle, and later similar sketch primitives
- authored 3D content objects that already surface as selectable Browser/viewport targets

Recommended ownership rule:
- layer membership should live on the authored/project-side target
- do not treat layer assignment as a transient viewer-instance decoration
- rebuilds and redraws should preserve layer membership because the layer belongs to the authored thing, not to one temporary render pass

Deferred for later follow-ons unless explicitly pulled in:
- reference assets
- imported context models that are intentionally not project-owned content
- assembly/component inheritance rules beyond the first direct object-level assignment cut

### Visibility And Color Semantics

Layer visibility should be layer-owned behavior, not just cosmetic UI state.

Locked direction:
- if a layer is hidden, its members should leave the active visible/selectable authored surface
- Browser, viewport, and any later layer-aware inspectors should stay in sync with that visibility truth
- a layer color should be the recognizable user-facing identifier for that layer across the manager and supported authored surfaces

Locked visibility actions:
- `turn off layer`
  - hides the targeted layer and removes its members from the active visible/selectable authored surface
- `turn on all layers`
  - clears any all-off or isolate state and restores every layer to visible
- `isolate layers`
  - leaves only the selected layer set visible
  - all non-selected layers become hidden until the user restores them or runs `turn on all layers`

Important non-goal for the first pass:
- layer color does not need to become a full material/render-style system
- it is acceptable for the first pass to use layer color primarily as management and authored-entity identification rather than a photoreal shading override

### Current Layer Direction

The system should support one current layer.

Locked direction:
- newly created supported authored entities should default onto the current layer unless a stronger local rule explicitly owns that creation path
- direct reassignment of an existing selection to another layer should remain possible after creation
- current-layer ownership should be visible inside the manager so the user can tell where the next sketch/entity/object will land

This is especially important for `Sketch Draw`, because AutoCAD-style expectations are not only about hiding old work but also about choosing where new work gets authored.

### Phase Ladder

The first executable `Layers` ladder should be:

- `Layers-1`
  - `Layer State, Membership, And Visibility Foundation`
  - create the canonical layer data model plus shared visibility commands before UI-specific work spreads the logic across Browser, Console, Viewer, and sketch state
- `Layers-2`
  - `Layer Manager And Console Command Surface`
  - add the real manager UI, layer-row selection, and Console buttons/commands over the shared layer state
- `Layers-3`
  - `Sketch Entity Layer Ownership`
  - make `Sketch Draw` create and manage entities on layers, with color/visibility/selection assignment tied to the current layer and sketch selection truth
- `Layers-4`
  - `Authored 3D Object Layer Ownership And Visibility`
  - make Browser/viewport-selected authored objects honor layer membership, assignment, and visibility in the shared 3D content pipeline

Standalone future docs:
- `Future/Layers_Phase Layers-1 - Layer State, Membership, And Visibility Foundation.md`
- `Future/Layers_Phase Layers-2 - Layer Manager And Console Command Surface.md`
- `Future/Layers_Phase Layers-3 - Sketch Entity Layer Ownership.md`
- `Future/Layers_Phase Layers-4 - Authored 3D Object Layer Ownership And Visibility.md`

Why this split fits the live code:
- `useAppStore.ts` already owns project content, part/reference visibility, and shared workspace selection
- `workspaceSelectionCommands.ts` already centralizes shared target-selection side effects
- `useBrowserPanelController.ts` already bridges Browser rows to shared workspace selection and visibility actions
- `ConsoleDock.tsx` already owns staged command/shortcut surfaces and should host layer commands as a distinct CAD/content command family rather than reusing transcript-layer filters
- `useSpaghettiStore.ts` already owns `geometrySketchSession.selectedComponentIds` and sketch mutation seams
- `Viewer.ts` already owns both authored object picking and sketch overlay interaction, making it the correct visibility/application seam once layer state exists

Later follow-ons can still be added after this ladder for richer layer features such as lock, freeze, reference-layer policy, print/no-print, or per-viewport overrides.

### Summary

The umbrella direction is now:
- ParaHook should have real CAD/content layers
- the user should manage them from one AutoCAD-style `Layer Manager`
- the Console should expose `turn off layer`, `turn on all layers`, and multi-layer `isolate layers` as fast management actions over the same layer state
- the first supported layer actions are create, name, color, visibility, current-layer selection, and selection-to-layer assignment
- supported first-pass targets should include both `Sketch Draw` entities and 3D authored objects
- layer assignment should reuse the repo's shared selection truth and persist on authored targets rather than living only in the viewer

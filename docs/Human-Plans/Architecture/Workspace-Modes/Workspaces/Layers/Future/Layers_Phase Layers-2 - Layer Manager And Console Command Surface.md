# Layers Phase Layers-2 - Layer Manager And Console Command Surface

## Doc Header

### Doc History
1. 2026-03-26 12:55: Created this second standalone `Layers` phase doc to lock the first user-facing `Layer Manager` and Console command surface around multi-row layer selection, current-layer control, and the explicit `turn off layer`, `turn on all layers`, and multi-layer `isolate layers` actions

### Purpose

This phase adds the first real user-facing layer controls.

Use it to answer:
- what the first `Layer Manager` must expose
- how layer-row selection should work
- how the Console should manage CAD/content layers
- how to keep layer commands separate from the existing Console transcript layer toolbar

## Doc Body

## [ ] Layers-2 - Layer Manager And Console Command Surface

### Summary

`Layers-2` turns the foundational layer state into a real management surface.

Phase outcome:
- the user gets a dedicated `Layer Manager`
- the manager can create, rename, recolor, and choose the current layer
- the manager can select one or more layer rows
- the Console exposes the first fast layer commands over that same selected layer set

### Owns

- `Layer Manager` UI shell
- manager row selection behavior
- current-layer indicator and setter
- layer create/rename/recolor controls
- Console layer commands:
  - `turn off layer`
  - `turn on all layers`
  - `isolate layers`

### Does Not Own

- sketch-entity rendering by layer
- 3D object rendering by layer
- final Browser row decoration for content objects
- richer layer semantics such as lock or freeze

### Current Code Read

The live UI seams already suggest the correct split:
- `src/app/console/ConsoleDock.tsx`
  - already owns staged command surfaces and command-family wiring
- `src/app/console/ConsolePanel.tsx`
  - already exposes transcript layer filter controls that must stay separate from CAD/content layers
- `src/app/panels/BrowserPanel.tsx`
  - shows the project-side panel pattern but is not by itself the layer-state owner

Current gap:
- there is no layer manager
- there is no layer-row selection truth
- there is no CAD/content layer command family in the Console

### Locked Direction

Manager rules:
- one row per layer
- visible name and color
- visible current-layer indicator
- support selecting more than one layer row
- support direct current-layer switching without also forcing layer isolation

Console rules:
- `turn off layer`
  - operates on the targeted or selected layer rows
- `turn on all layers`
  - is global
- `isolate layers`
  - consumes the currently selected layer rows
  - must keep more than one selected layer visible when more than one row is selected

Important distinction:
- do not graft CAD/content layer commands onto the transcript layer filter toolbar
- the transcript `visibleLayers` / `isolatedLayer` / `subsetLayers` state is a different system

### Required File Targets

Expected primary seams:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- a new layer-manager surface component and/or controller
- `src/app/store/useAppStore.ts`

Possible related verification seams:
- `src/app/console/ConsoleDock.test.tsx`
- tests for the new layer-manager component

### Verification

Required proof for `Layers-2`:
- the manager can create, rename, recolor, and select layers
- one layer can be set as current without breaking selected layer rows
- the manager can select multiple layer rows
- `turn off layer` changes the chosen layer visibility state
- `turn on all layers` restores every layer to visible
- `isolate layers` keeps exactly the selected layer-row set visible
- Console transcript layer filter controls remain unchanged and distinct from CAD/content layer commands

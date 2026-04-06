# Layers Phase Layers-3 - Sketch Entity Layer Ownership

## Doc Header

### Doc History
1. 2026-03-26 12:55: Created this third standalone `Layers` phase doc to lock the sketch-side layer cut around current-layer authoring, selected sketch-entity reassignment, and layer-driven color/visibility behavior in the live sketch session plus viewport overlay

### Purpose

This phase makes `Sketch Draw` layer-aware.

Use it to answer:
- how new sketch entities should inherit the current layer
- how selected sketch entities should be reassigned to another layer
- how layer visibility and color should affect the sketch overlay

## Doc Body

## [ ] Layers-3 - Sketch Entity Layer Ownership

### Summary

`Layers-3` connects the new layer model to sketch authoring.

Phase outcome:
- new committed sketch entities land on the current layer
- selected sketch entities can be reassigned to another layer
- hidden sketch layers stop rendering/selecting in the active sketch overlay
- layer colors can become the first recognizable sketch-entity color identity

### Owns

- current-layer application to newly created sketch entities
- selected sketch-entity assignment to another layer
- sketch overlay visibility by layer
- sketch overlay color by layer
- layer-aware sketch selection filtering

### Does Not Own

- 3D content object integration
- Browser object-row layer semantics
- reference-layer behavior
- final material/render-style semantics outside sketch overlays

### Current Code Read

The live sketch seams are already concentrated:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns `geometrySketchSession.selectedComponentIds`
  - already owns selection-window draft and sketch component mutation seams
- `src/viewer/geometrySketchOverlay.ts`
  - already derives sketch render layers and row-id-based selection mapping
- `src/viewer/Viewer.ts`
  - already owns sketch hover/select/delete and overlay rendering

Current gap:
- sketch entities do not yet carry CAD/content `layerId`
- sketch overlay layers today are renderer-purpose layers, not user-authored CAD layers

### Locked Direction

Sketch rules:
- when a new sketch entity is committed, assign it to the current layer
- when the sketch session has selected components, the manager/commands may reassign that selection to another layer
- hidden layers:
  - do not render their sketch entities
  - do not remain selectable through ordinary sketch picking
- visible layers:
  - may use layer color as the first user-facing sketch identity color

Important rule:
- preserve the existing internal render-purpose overlay layers such as selected/hovered/draft behavior
- user-authored CAD `layerId` should drive what base entity set exists underneath those render-purpose overlays, not replace every internal overlay category with CAD layer names

### Required File Targets

Expected primary seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- sketch feature/entity type definitions that hold committed component data
- `src/viewer/geometrySketchOverlay.ts`
- `src/viewer/Viewer.ts`

Possible related verification seams:
- `src/viewer/geometrySketchOverlay.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- sketch-session store tests

### Verification

Required proof for `Layers-3`:
- a new `Line`, `PLine`, `Rectangle`, or `Circle` entity inherits the current layer
- selected sketch entities can be reassigned to another layer without corrupting sketch selection
- hidden-layer sketch entities do not render in the active overlay
- hidden-layer sketch entities are not pickable through normal sketch selection
- visible entities retain sketch selection, hover, and draft behavior after the layer integration lands

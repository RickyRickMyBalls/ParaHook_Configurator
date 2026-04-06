# Layers Phase Layers-4 - Authored 3D Object Layer Ownership And Visibility

## Doc Header

### Doc History
1. 2026-03-26 12:55: Created this fourth standalone `Layers` phase doc to lock the authored 3D-object layer cut around Browser/viewport-selected object assignment, layer-driven viewer visibility, and shared selection behavior for project-owned content

### Purpose

This phase makes authored 3D content layer-aware.

Use it to answer:
- how Browser and viewport-selected objects should be assigned to layers
- how layer visibility should affect authored 3D object rendering
- how hidden-layer objects should interact with shared selection truth

## Doc Body

## [ ] Layers-4 - Authored 3D Object Layer Ownership And Visibility

### Summary

`Layers-4` connects the layer model to project-owned 3D content.

Phase outcome:
- selected authored 3D objects can be assigned to layers from shared Browser/viewport selection truth
- hidden layers stop rendering/selecting their owned objects
- Browser and viewport stay honest about which authored objects are visible and selectable

### Owns

- object-level layer membership for project-owned 3D content
- assignment from Browser/viewport shared selection truth
- viewer visibility filtering by layer
- Browser honesty around hidden-layer objects

### Does Not Own

- sketch-entity layer ownership
- reference workspace layer policy
- final assembly/component inheritance beyond the first object-owned cut
- richer material-system work

### Current Code Read

The live 3D content seams already line up:
- `src/app/store/useAppStore.ts`
  - owns project content records and shared workspace selection
- `src/app/store/workspaceSelectionCommands.ts`
  - already owns cross-surface selection side effects
- `src/app/panels/useBrowserPanelController.ts`
  - already bridges Browser rows to shared selection and visibility actions
- `src/viewer/Viewer.ts`
  - already owns authored object picking and rendered part visibility

Current gap:
- authored 3D objects do not yet store CAD/content `layerId`
- current content visibility is still organized around older content/part visibility seams rather than one layer system

### Locked Direction

3D content rules:
- selected project-owned objects should be assignable to a layer from shared Browser or viewport selection truth
- hidden layers:
  - do not render owned objects
  - do not remain selectable by ordinary viewport picking
- Browser should reflect hidden-layer truth honestly instead of pretending hidden objects are still ordinary visible rows

First ownership boundary:
- first pass is object-owned
- do not force full assembly/component inheritance in the same cut unless the code read shows one object-owned layer is impossible

Important rule:
- reference assets remain out of scope for this phase
- do not blur project-owned authored objects and reference workspace items into one layer system in the first 3D content pass

### Required File Targets

Expected primary seams:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceSelectionCommands.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/viewer/Viewer.ts`

Possible related verification seams:
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- viewer interaction tests

### Verification

Required proof for `Layers-4`:
- Browser-selected and viewport-selected objects can both be assigned to a layer through the same shared selection truth
- hidden-layer authored objects stop rendering
- hidden-layer authored objects are not pickable through normal viewport selection
- empty-space deselect and replacement selection still behave honestly after layer visibility changes
- reference workspace visibility remains a separate system in this pass

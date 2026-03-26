# Layers Phase Layers-1 - Layer State, Membership, And Visibility Foundation

## Doc Header

### Doc History
1. 2026-03-26 12:55: Created this first standalone `Layers` phase doc to lock the foundational data/state cut around canonical layer records, current-layer truth, authored membership, and shared visibility commands before manager, sketch, and 3D-object surfaces are implemented

### Purpose

This phase creates the canonical layer foundation.

Use it to answer:
- where the real layer records should live
- how current-layer and visibility truth should be represented
- how authored targets should store layer membership
- which shared commands should exist before manager, Console, Browser, and Viewer surfaces start wiring into layers

## Doc Body

## [ ] Layers-1 - Layer State, Membership, And Visibility Foundation

### Summary

`Layers-1` creates the canonical data and command layer for CAD/content layers before UI-specific work starts duplicating ownership.

Phase outcome:
- one canonical layer record model exists
- one current-layer truth exists
- authored targets have a place to store layer membership
- shared visibility commands exist for:
  - `turn off layer`
  - `turn on all layers`
  - `isolate layers`
- later manager, Console, sketch, and 3D object work can all consume the same layer state instead of inventing local copies

### Owns

- canonical layer record shape
- stable layer ids, names, colors, and visibility truth
- one current-layer id
- authored target layer-membership storage contract
- shared visibility command semantics
- default bootstrap behavior such as an initial base layer

### Does Not Own

- the final manager UI
- Console button rendering
- sketch-entity layer rendering
- 3D object layer rendering
- richer follow-ons such as lock, freeze, print/no-print, or per-viewport overrides

### Current Code Read

The live code already has the right host seams for a foundation cut:
- `src/app/store/useAppStore.ts`
  - owns project content, reference visibility, and shared workspace selection
- `src/app/store/workspaceSelectionCommands.ts`
  - already centralizes shared selection side effects
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns sketch-session selection and sketch mutation seams

Current gap:
- there is no canonical CAD/content layer state yet
- visibility today is split across content/reference/sketch-specific controls rather than one cross-surface layer model

### Locked Direction

Foundation rules:
- create one canonical layer collection
- create one current-layer id
- create shared commands for:
  - create layer
  - rename layer
  - recolor layer
  - set current layer
  - turn off one layer
  - turn on all layers
  - isolate a provided layer-id set
- support more than one isolated layer at once
- keep layer membership on authored targets, not only in one viewer cache

Recommended first data contract:
- layer record:
  - `layerId`
  - `name`
  - `color`
  - `isVisible`
- workspace layer state:
  - ordered layer ids
  - current layer id
- authored membership:
  - one `layerId` on supported sketch entities and authored 3D objects

Important rule:
- do not make the Console transcript-layer store the owner of CAD/content layers

### Required File Targets

Expected primary seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- any shared authored-type definitions that need a `layerId`

Possible related verification seams:
- `src/app/store/useAppStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/viewer/geometrySketchOverlay.test.ts`

### Verification

Required proof for `Layers-1`:
- a default layer exists on startup or project creation
- new layer records can be created, renamed, recolored, and reordered deterministically
- current-layer truth can change without mutating selection truth
- `turn off layer` hides exactly one target layer in shared state
- `turn on all layers` restores every layer to visible
- `isolate layers` keeps the provided layer-id set visible and hides all others
- no manager, Console, Browser, or Viewer code path creates a second competing layer state owner

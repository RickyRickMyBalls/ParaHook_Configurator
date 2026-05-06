# `Gen 3 - Cleanup 3` - `ViewportOverlay Runtime Surface Decomposition`

## Doc Header

### Doc History
1. 2026-05-05 20:30:15: Created this dedicated `Gen 3 - Cleanup 3` future doc to capture `src/app/components/ViewportOverlay.tsx` as the next queued UI-side oversized sink after the spaghetti-store cleanup, grounding the plan in the live overlay, sketch, build-policy, and HUD seam clusters and breaking the lane into small one-pass Codex phases

### Purpose
- decompose `src/app/components/ViewportOverlay.tsx` into smaller runtime, VM, and panel seams without inventing new owners for app-store or spaghetti-store truth
- keep overlay UI behavior incremental enough that each implementation phase is small enough for one Codex pass
- queue the next UI-side Gen3 sink behind the store-side cleanup instead of leaving it as an informal note

### Scope

This phase covers:
- overlay VM/helper extraction
- sketch and sketch-plane panel splitting
- build-policy and viewport-result panel extraction
- final shell shrink and import normalization

This phase does not cover:
- changing canonical store ownership
- a same-pass `Viewer.ts` runtime rewrite
- re-deciding workspace surface ownership

## Doc Body

### Family Phase Goal

`ViewportOverlay.tsx` should stop being one giant mixed VM-builder, panel coordinator, and UI shell.

The target shape is:
- a smaller overlay shell component
- extracted VM/helper modules for pure row and formatting logic
- extracted focused panel components for sketch-plane, sketch-session, and result/build-policy areas
- stable reads from `useAppStore` and `useSpaghettiStore` without moving ownership into the overlay

### Boundary Rules

- keep store truth in `useAppStore` and `useSpaghettiStore`
- keep viewer runtime truth in `Viewer.ts`
- let the overlay own presentation, VM shaping, and UI interaction wiring only
- do not widen this lane into graph-store or viewer-runtime decomposition

### Current Live Read

Current `ViewportOverlay.tsx` responsibilities cluster into at least five seams:

1. Pure overlay constants and formatting helpers
- overlay density, sizing, color, and preset helpers
- sketch detail formatting helpers

2. Sketch entity VM building
- `buildSketchEntityListRows(...)`
- row selection/hover helpers
- sketch tool label and icon helpers

3. Root overlay shell and store wiring
- `ViewportOverlay(...)` root component
- large `useAppStore` and `useSpaghettiStore` read cluster
- browser build-policy and sketch-session action wiring

4. Sketch-plane and geometry-sketch panel surfaces
- sketch plane pick session
- geometry sketch session and history scrub
- panel layout, selection, hover, and command wiring

5. Viewport-result and HUD/presentation surface
- viewport result state/status reads
- overlay chrome, docking, and HUD behavior

### Acceptance Read

This family phase is acceptable when:
- `ViewportOverlay.tsx` has a small visible implementation ladder
- each phase can be implemented one by one without reopening store ownership
- the final overlay shell is smaller and more navigable while still reading from the same canonical stores

## Vision

This family phase belongs after `Gen 3 - Cleanup 2`.

The intended result is not a new state owner.

The intended result is:
- clearer overlay presentation seams
- smaller focused panel components
- simpler UI-side maintenance around sketch and result surfaces

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen3-HLG-1` - Break `ViewportOverlay.tsx` into smaller honest UI seams without moving graph, sketch, build-policy, or selection truth out of their canonical stores.
- [ ] `Cleanup-Gen3-HLG-2` - Keep the overlay cleanup incremental enough that each extraction pass is small enough for one Codex implementation.
- [ ] `Cleanup-Gen3-HLG-3` - Leave a smaller overlay shell that can evolve UI behavior without repeatedly touching one 4k-line component.

### Codex Level Goals

- [ ] CLG 1. Lock the overlay owner map and keep store-ownership boundaries explicit before any extraction starts.
- [ ] CLG 2. Move pure helper and VM seams first, then split the big panel surfaces one by one.
- [ ] CLG 3. End with a smaller root overlay shell plus normalized imports and explicit panel ownership.

### `Gen 3 - Cleanup 3 / Phase 1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] lock the overlay owner map and no-widening rules

### `Gen 3 - Cleanup 3 / Phase 2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract pure constants, formatting, and row-builder helpers

### `Gen 3 - Cleanup 3 / Phase 3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the sketch-plane panel surface

### `Gen 3 - Cleanup 3 / Phase 4`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract the geometry-sketch session panel surface

### `Gen 3 - Cleanup 3 / Phase 5`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract viewport-result, build-policy, and HUD presentation sections

### `Gen 3 - Cleanup 3 / Phase 6`

- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] shrink the root overlay shell and close the lane honestly

## [ ] `Gen 3 - Cleanup 3 / Phase 1` - `Owner Map And Panel Boundary Lock`

### Phase 1 Summary

#### Purpose
- confirm the live `ViewportOverlay.tsx` seam map and lock the extraction order before runtime UI splitting starts

#### Current Live Read
- the root component starts around `ViewportOverlay.tsx:465`
- the file already carries distinct helper and panel seams before the root component starts
- the biggest risk is mixing store reads, VM shaping, and panel JSX extraction in one pass

### Phase 1 Implementation Spec

#### Exact First Code Cut
- do not extract code yet
- inventory the panel and helper seams with live anchors
- lock the extraction order and explicit keep-in-root rules

#### Done Shape
- the next panel/helper slices are concrete enough to implement one by one

## [ ] `Gen 3 - Cleanup 3 / Phase 2` - `Pure Helper And VM Extraction`

### Phase 2 Summary

#### Purpose
- move the safest non-component seams out first so the root component loses helper bulk before JSX extraction begins

#### Current Live Read
- pure helper seams include overlay presets, position clamps, sketch detail formatting, row selection helpers, and `buildSketchEntityListRows(...)`

### Phase 2 Implementation Spec

#### Exact First Code Cut
- extract pure constants, formatting helpers, and row-builder helpers into explicit overlay helper modules

#### Verification Shape
- focused overlay tests or targeted render checks still pass

#### Done Shape
- the root file no longer owns the pure helper and row-builder bulk directly

## [ ] `Gen 3 - Cleanup 3 / Phase 3` - `Sketch Plane Panel Extraction`

### Phase 3 Summary

#### Purpose
- carve out the sketch-plane pick and transform-history presentation slice without widening into the full geometry-sketch session

### Phase 3 Implementation Spec

#### Exact First Code Cut
- extract the sketch-plane pick panel into a focused component with explicit props

#### No-Widening Rule
- do not move geometry-sketch session UI in the same pass

#### Done Shape
- sketch-plane UI has one obvious owner component beneath the overlay shell

## [ ] `Gen 3 - Cleanup 3 / Phase 4` - `Geometry Sketch Session Panel Extraction`

### Phase 4 Summary

#### Purpose
- split the geometry-sketch session panel out of the root overlay once the shared helper seams are already smaller

### Phase 4 Implementation Spec

#### Exact First Code Cut
- extract the geometry-sketch tool/session panel and keep store reads either in the shell or behind explicit panel props

#### No-Widening Rule
- do not change geometry-sketch canonical store truth

#### Done Shape
- the geometry-sketch session UI no longer lives inline in one giant root component

## [ ] `Gen 3 - Cleanup 3 / Phase 5` - `Viewport Result And HUD Surface Extraction`

### Phase 5 Summary

#### Purpose
- split the result/build-policy and HUD presentation seams so the root overlay shell stops owning the remaining mixed presentation bulk

### Phase 5 Implementation Spec

#### Exact First Code Cut
- extract the viewport-result status/build-policy surface and the HUD/presentation chrome into focused components or helper modules

#### No-Widening Rule
- do not move build-policy truth out of the app store

#### Done Shape
- the overlay shell coordinates child surfaces instead of rendering most presentation logic inline

## [ ] `Gen 3 - Cleanup 3 / Phase 6` - `Overlay Shell Shrink And Handoff`

### Phase 6 Summary

#### Purpose
- reduce `ViewportOverlay.tsx` to a smaller shell plus explicit child components and close the lane honestly

### Phase 6 Implementation Spec

#### Exact First Code Cut
- normalize imports, retire duplicate helper residue, and keep only shell coordination in the root component

#### Done Shape
- `ViewportOverlay.tsx` reads like a composed shell instead of one monolithic mixed UI surface

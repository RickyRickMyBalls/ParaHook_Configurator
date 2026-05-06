# `Gen 3 - Cleanup 4` - `Viewer Runtime Boundary Decomposition`

## Doc Header

### Doc History
1. 2026-05-05 20:30:15: Created this dedicated `Gen 3 - Cleanup 4` future doc to capture `src/viewer/Viewer.ts` as the later queued viewer-runtime oversized sink, grounding the lane in the live camera, transform, sketch, workspace-selection, and render-loop seam clusters and breaking the work into small sequential phases instead of one giant viewer rewrite

### Purpose
- decompose `src/viewer/Viewer.ts` into smaller runtime owner seams without moving canonical authored or graph truth out of the correct stores
- queue the later viewer-runtime cleanup as a real family phase with Codex-sized steps instead of a vague future note

### Scope

This phase covers:
- viewer runtime helper and subsystem extraction
- transform and sketch runtime boundary cleanup
- workspace-selection and camera/runtime split cleanup
- final viewer facade shrink

This phase does not cover:
- changing graph or app-store ownership
- reworking overlay UI in the same lane
- replacing the viewer architecture wholesale

## Doc Body

### Family Phase Goal

`Viewer.ts` should stop acting like one giant camera, gizmo, sketch, selection, and render-loop controller.

The target shape is:
- one smaller `Viewer` facade class
- explicit subsystem helpers for camera/runtime, transform runtime, sketch runtime, and workspace selection
- clearer boundaries between viewer-owned live manipulation and store-owned committed truth

### Boundary Rules

- keep viewer-owned live manipulation in viewer-side runtime helpers
- keep committed authored truth in the app or spaghetti stores
- do not move workspace ownership into the viewer
- do not combine this lane with store cleanup or overlay UI cleanup

### Current Live Read

Current `Viewer.ts` responsibilities cluster into at least six seams:

1. Camera and renderer setup
- cameras, renderer, controller, clip range, pose, and resize wiring

2. Transform runtime
- transform gizmo
- reference/content/environment transform active state
- transform callbacks, commit, handle, mode, and space wiring

3. Sketch-plane and geometry-sketch runtime
- sketch plane pick helper
- geometry sketch overlay, materials, selection window, and draft helpers

4. Workspace selection and pick runtime
- workspace selection overlay DOM
- click tracking and pick dispatch

5. Input routing and camera mode behavior
- pointer handlers
- keyboard state
- camera orbit/fly/zoom behavior

6. Render-loop and teardown lifecycle
- resize observer
- listener lifecycle
- dispose behavior

### Acceptance Read

This family phase is acceptable when:
- `Viewer.ts` has a real phased execution ladder
- each step is small enough for one Codex implementation
- the final viewer class coordinates explicit subsystems instead of owning every runtime seam inline

## Vision

This family phase belongs after the store-side and overlay-side Gen3 cleanup.

The intended result is:
- a calmer viewer runtime surface
- clearer viewer-live versus store-committed boundaries
- easier future work on transform, sketch, and workspace-selection behavior

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen3-HLG-1` - Break `Viewer.ts` into smaller runtime seams without moving committed authored truth or graph truth into the viewer.
- [ ] `Cleanup-Gen3-HLG-2` - Keep the viewer cleanup incremental enough that each pass is small enough for one Codex implementation.
- [ ] `Cleanup-Gen3-HLG-3` - Leave a smaller viewer facade whose subsystems are easier to reason about and test.

### Codex Level Goals

- [ ] CLG 1. Lock the viewer subsystem map and no-widening rules before code extraction starts.
- [ ] CLG 2. Split camera/runtime, transform runtime, sketch runtime, and workspace-selection seams one narrow slice at a time.
- [ ] CLG 3. End with a smaller viewer facade and explicit subsystem handoff points.

### `Gen 3 - Cleanup 4 / Phase 1`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] confirm the viewer subsystem map and extraction order

### `Gen 3 - Cleanup 4 / Phase 2`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract camera and render-lifecycle helpers

### `Gen 3 - Cleanup 4 / Phase 3`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract transform runtime helpers

### `Gen 3 - Cleanup 4 / Phase 4`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] extract sketch-plane and geometry-sketch runtime helpers

### `Gen 3 - Cleanup 4 / Phase 5`

- [ ] advance `Cleanup-Gen3-HLG-1`
- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] extract workspace-selection and pick-routing helpers

### `Gen 3 - Cleanup 4 / Phase 6`

- [ ] advance `Cleanup-Gen3-HLG-2`
- [ ] advance `Cleanup-Gen3-HLG-3`
- [ ] shrink the root viewer facade and close the lane honestly

## [ ] `Gen 3 - Cleanup 4 / Phase 1` - `Subsystem Map And Migration Rules Lock`

### Phase 1 Summary

#### Purpose
- confirm the viewer subsystem map and lock extraction order before runtime code starts moving

#### Current Live Read
- `export class Viewer` starts around `Viewer.ts:439`
- camera, renderer, transform, sketch, workspace-selection, and runtime listener seams are all visible as separate field clusters near the class start
- the main risk is trying to move multiple runtime subsystems at once

### Phase 1 Implementation Spec

#### Exact First Code Cut
- document the subsystem map and explicit keep-versus-move rules
- do not move runtime code yet

#### Done Shape
- the next viewer extraction slices are concrete and ordered

## [ ] `Gen 3 - Cleanup 4 / Phase 2` - `Camera And Render Lifecycle Helper Extraction`

### Phase 2 Summary

#### Purpose
- move the safest viewer runtime support seams first so the root class loses setup/dispose bulk before interaction extraction begins

### Phase 2 Implementation Spec

#### Exact First Code Cut
- extract camera pose, clip-range, resize, and render-lifecycle helpers that do not need to own transform or sketch runtime

#### Done Shape
- the root class stops owning the first chunk of setup/dispose bulk directly

## [ ] `Gen 3 - Cleanup 4 / Phase 3` - `Transform Runtime Helper Extraction`

### Phase 3 Summary

#### Purpose
- isolate the transform-gizmo and reference/content/environment transform runtime seam behind explicit helpers

### Phase 3 Implementation Spec

#### Exact First Code Cut
- extract only the transform runtime helper cluster and its directly paired callbacks

#### No-Widening Rule
- do not move committed transform history truth out of the stores

#### Done Shape
- the transform runtime no longer lives inline in the main viewer class

## [ ] `Gen 3 - Cleanup 4 / Phase 4` - `Sketch Runtime Helper Extraction`

### Phase 4 Summary

#### Purpose
- isolate sketch-plane pick and geometry-sketch live runtime without widening into overlay UI

### Phase 4 Implementation Spec

#### Exact First Code Cut
- extract sketch-plane pick and geometry-sketch overlay/material helper seams

#### No-Widening Rule
- do not move `ViewportOverlay.tsx` presentation concerns into this lane

#### Done Shape
- the viewer owns a smaller explicit sketch runtime subsystem instead of inline mixed code

## [ ] `Gen 3 - Cleanup 4 / Phase 5` - `Workspace Selection And Input Routing Extraction`

### Phase 5 Summary

#### Purpose
- split the workspace selection and pick-routing seam after camera, transform, and sketch helpers are smaller

### Phase 5 Implementation Spec

#### Exact First Code Cut
- extract workspace selection overlay, pick dispatch, and the tight helper cluster that supports that surface

#### No-Widening Rule
- do not absorb generic workspace ownership into the viewer

#### Done Shape
- workspace-selection runtime has an explicit viewer-side helper boundary

## [ ] `Gen 3 - Cleanup 4 / Phase 6` - `Viewer Facade Shrink And Handoff`

### Phase 6 Summary

#### Purpose
- reduce `Viewer.ts` to a smaller coordinating facade plus explicit subsystems and close the lane honestly

### Phase 6 Implementation Spec

#### Exact First Code Cut
- normalize imports, retire duplicate helper residue, and keep only subsystem coordination in the root class

#### Done Shape
- `Viewer.ts` reads like a coordinating facade instead of one monolithic runtime kernel

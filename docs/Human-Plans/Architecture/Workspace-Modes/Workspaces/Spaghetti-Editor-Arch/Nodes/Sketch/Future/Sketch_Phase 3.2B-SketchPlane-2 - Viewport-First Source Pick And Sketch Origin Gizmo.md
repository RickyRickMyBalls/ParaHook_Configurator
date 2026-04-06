## [ ] - `3.2B-SketchPlane-2` - `Viewport-First Source Pick And Sketch Origin Gizmo`

### Header

Purpose:
- make sketch-plane picking a real viewport-first placement workflow

Owns:
- `Pick In Viewport`
- temporary spaghetti-editor collapse into a compact bar
- sketch origin gizmo / transform tool
- ghost plane boxes
- ghost sketch grids
- spatial reference aids around the origin gizmo

### Questions / Decisions

#### [ ] - `q1` Use the detailed `### 3.2b-2` decision block below as the working planning surface for this phase.

##### Suggestion
- yes
- keep the numbered `3.2b-2` questions below as the detailed decision checklist
- keep this subphase section focused on scope and implementation-readiness

### Implementation Spec

Implementation-ready spec:
- `3.2B-2` replaces the old overlay-based `Sketch Plane` picker with one canonical viewport-first source-pick session
- this phase is origin-plane only:
  - `XY`
  - `XZ`
  - `YZ`
- model-face picking and geometry-driven source setup are deferred to `3.2B-3`

Locked user flow:
1. user clicks `Pick In Viewport` from `SketchPlane`
2. the `Spaghetti Editor` is forced into the existing window-level `collapsed mode`
3. the old draggable `XY / XZ / YZ` popup is no longer the intended long-term picker path
4. the viewport opens one live source-pick session showing:
   - three origin plane boxes on entry
   - active candidate plane fill
   - active candidate grid
   - basic axis/orientation cues
5. the user picks `XY`, `XZ`, or `YZ`
6. the sketch-origin gizmo appears immediately in that same live session
7. the user adjusts the plane with:
   - move
   - rotate
8. the user confirms with `Done` or `Enter`
9. the user cancels with:
   - `X`
   - `Esc`
   - temporary console `x`

Locked defaults:
- origin-plane picking only in this phase
- first gizmo is world-space only
- `Flip` stays row-only, not in the viewport gizmo
- rich ghost/source preview exists only during the active pick session
- the expanded `SketchPlane` row may show temporary live session state, but authored values commit only on confirm
- this phase extends the existing `sketchPlanePickSession` seam first instead of introducing a second competing session model unless that seam proves unable to represent preview, temporary transform, and confirm/cancel state honestly

Implementation seams:
- expand `sketchPlanePickSession` from `{ nodeId }` into one authoritative temporary source-pick session model
- force the active spaghetti window into the real AppShell `collapsed` mode during pick instead of using panel header collapse
- replace the old `ViewportOverlay` plane-button popup with the new viewport-first preview/session UI
- wire `Done`, `X`, `Enter`, `Esc`, and temporary console `x` to the same confirm/cancel session behaviors
- emit readable console/session trace entries for:
  - session started
  - plane selected
  - gizmo moved
  - gizmo rotated
  - session confirmed
  - session cancelled

Acceptance checks:
- starting `Pick In Viewport` collapses the floating `Spaghetti Editor` into the existing header-only shell
- the old overlay-based `XY / XZ / YZ` picker is no longer the primary user-facing path
- entering the session shows origin-plane preview content before commit
- picking `XY`, `XZ`, or `YZ` immediately opens the gizmo in the same live session
- the first gizmo supports `move + rotate` only
- `Done` and `Enter` commit the authored sketch-plane values
- `X`, `Esc`, and temporary console `x` all cancel through the same cleanup path
- live session state can appear in the expanded `SketchPlane` row without committing until confirm
- closing the session removes the richer ghost/source preview and returns to the normal sketch-preview model

Out of scope for this phase:
- model-face picking
- existing-sketch or model-geometry-driven source picking
- geometry validity rules for those picks
- hover/selection highlighting for geometry-derived source references
- viewport `Flip`



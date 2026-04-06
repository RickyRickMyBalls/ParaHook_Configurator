## [x] - `3.2B-DrawSketch-1` - `Viewer-Owned Live Draw Preview`
### Header

Purpose:
- prove the first honest viewer-owned sketch drawing session in the real model viewport

Owns:
- first active draw preview in the real Three viewport
- first click-to-place draw flow for:
  - `Line`
  - `PLine`
- first draw-session toolbar / viewport ownership split

### Questions / Decisions

#### [x] - `q1` Keep the first real viewer-owned draw cut limited to `Line` and `PLine`.

##### Suggestion
- locked
- `DrawSketch-1` is limited to `Line` and `PLine`
- use `Line` and `PLine` as the first honest pair because they prove the shared point-projection and live-preview seam without pulling in more complex tool families too early

#### [x] - `q2` Treat the first sketch-draw console commands as local session commands, not a second permanent workflow.

##### Suggestion
- locked
- use temporary local commands like `line`, `pline`, `status`, and `help`
- treat them as local session commands, not a second permanent workflow
- model them as a future branch of the deeper graph/node/sketch/draw command tree

#### [x] - `q3` Decide how viewport clicks project onto the active sketch plane in the first honest cut.

##### Suggestion
- locked
- when the user enters `Draw Sketch`, align the camera to the active sketch-plane normal or its opposite so the user is looking at the sketch plane directly
- move the active working grid onto the chosen sketch plane
- keep the origin point visible at the center of that grid
- project viewport clicks directly onto the current resolved sketch plane from `SketchPlane`
- use one canonical viewer-side plane-intersection helper for both `Line` and `PLine`
- allow the drawing cursor/pen to snap to the visible sketch origin so the user can use it as a first point or later endpoint
- do not add alternate geometry-derived projection rules in this phase

#### [x] - `q4` Decide whether the first `DrawSketch-1` cut is click-first only, or whether typed numeric entry must already work during the live tool session.

##### Suggestion
- locked
- make the first honest cut click-first
- after the camera aligns to the sketch plane, the user should feel like they are drawing directly into a 2D drafting plane similar to AutoCAD
- the active `Line` tool should let the user click a first point on the chosen sketch plane, then move the mouse to preview a ghost line from that first point to the live cursor projection
- the line stays snapped to the chosen sketch plane while the user moves the mouse
- left click confirms the second point and completes the line
- allow the toolbar to reflect live point values, but defer true typed numeric-entry workflow until the viewer-owned draw seam is stable

#### [x] - `q5` Decide what the live preview must show for `Line` and `PLine`.

##### Suggestion
- locked
- `Line`
  - before the first click, show the projected current cursor point on the active sketch plane
  - after the first click, show one ghost line from the locked start point to the live cursor projection
  - show the live endpoint marker at the cursor
  - keep the visible origin point available as a snap target
- `PLine`
  - show the current temporary chain so far
  - show one ghost next segment from the last active endpoint to the live cursor projection
  - show the live endpoint marker at the cursor
- keep committed geometry visually stronger than the live ghost segment
- keep the preview viewer-owned and do not fake it with toolbar-only fields

#### [x] - `q6` Decide the minimum commit boundary for the first viewer-owned draw cut.

##### Suggestion
- locked
- `DrawSketch-1` should already be able to commit first-pass `Line` and `PLine` entities into sketch component state
- keep the commit rules minimal and defer deeper lifecycle polish to `3.2B-DrawSketch-2`
- do not let `DrawSketch-1` become preview-only, because that would leave the first viewer-owned draw seam structurally incomplete

#### [x] - `q7` Decide whether `PLine` commits segment-by-segment immediately in `DrawSketch-1`, or stays one temporary chain until the command finishes.

##### Suggestion
- locked
- keep one temporary live `PLine` chain during the active command
- commit the chain as authored sketch content only when the user finishes it
- defer partial-segment commit complexity until a later pass unless implementation forces it sooner

#### [x] - `q8` Decide what active draw-session state the toolbar must mirror while the viewer owns the live geometry.

##### Suggestion
- locked
- toolbar should mirror:
  - active tool
  - current step/prompt
  - current point values if available
  - simple finish/cancel hints
- but the toolbar should not become the drawing surface or own the temporary geometry

#### [x] - `q9` Decide what first-pass hover and snapping aids belong in `DrawSketch-1`.

##### Suggestion
- locked
- keep first-pass hover simple:
  - projected current point
  - current temporary segment
- keep origin snap in scope from day one
- defer richer endpoint/object snapping, inference guides, and constraint-like feedback until later unless one tiny snap rule is needed to make `Line`/`PLine` usable

#### [x] - `q10` Decide what temporary console commands are required on day one for the first viewer-owned draw cut.

##### Suggestion
- locked
- require:
  - `line`
  - `pline`
  - `status`
  - `help`
- keep them dev-oriented and session-local
- make them call the same underlying draw-session actions as the toolbar

#### [x] - `q11` Decide what viewer-side helper/module should own the temporary draw preview.

##### Suggestion
- locked
- add a dedicated viewer-side helper module for sketch draw preview, parallel to the sketch-plane helper direction
- keep temporary geometry viewer-owned
- keep committed sketch entities store-owned
- bridge the draw session through one clear viewer/app seam instead of scattering draw logic across toolbar-only components

#### [x] - `q12` Decide the exact out-of-scope boundary for `DrawSketch-1`.

##### Suggestion
- locked
- keep out of scope:
  - `Arc3Point`
  - `BezierSpline`
  - `Rectangle`
  - `Circle`
  - rich snapping/inference
  - entity editing
  - browser/deeper expose work
  - final global console grammar
- use `DrawSketch-1` only to prove the first honest viewer-owned `Line` / `PLine` seam

#### [x] - `q13` Decide whether entering `Draw Sketch` should always collapse the active `Spaghetti Editor` for this phase.

##### Suggestion
- locked
- yes
- keep the same compact-shell behavior used by the current sketch draw session and the sketch-plane viewport workflow
- make the real model viewport the clear drawing surface from the start

### Implementation Spec

#### Summary

`3.2B-DrawSketch-1` should make `Draw Sketch` the first honest viewer-owned sketch authoring workflow.

The toolbar remains the control surface, but the real interaction happens in the main Three viewport. The first cut is intentionally narrow and proves only:
- `Line`
- `PLine`

This phase must already be able to commit first-pass authored sketch entities. It is not a preview-only phase.

#### Locked Workflow

1. the user clicks `Draw` inside `SketchDraw`
2. the active `Spaghetti Editor` collapses into the compact shell
3. the `Sketch Draw` toolbar opens
4. the camera aligns to the active sketch-plane normal or its opposite so the user is looking at the sketch directly
5. the working grid moves onto the chosen sketch plane
6. the origin point stays visible at the center of that grid
7. the user chooses:
   - `Line`
   - `PLine`
8. the viewer projects cursor movement directly onto the resolved sketch plane
9. the active tool shows viewer-owned ghost preview geometry as the user moves the mouse
10. left click confirms the next point on the sketch plane
11. `Line` completes after the second point
12. `PLine` stays alive as one temporary chain until the user finishes it

#### Viewer Ownership

- add a dedicated viewer-side draw-preview helper/module for sketch drawing
- keep temporary draw geometry viewer-owned
- keep committed sketch entities store-owned
- use one canonical plane-intersection/projection helper for both `Line` and `PLine`
- do not add alternate geometry-derived projection rules in this phase

Viewer must render:
- active sketch-plane grid
- visible origin point at the grid center
- current projected cursor point
- origin snap feedback
- ghost `Line` preview after the first point
- ghost `PLine` next-segment preview from the last active endpoint
- stronger committed geometry than live ghost geometry
- live endpoint marker at the cursor

#### Tool Behavior

`Line`
- first click sets the start point on the sketch plane
- mouse movement updates one ghost preview segment
- left click confirms the second point
- the line commits into sketch component state
- the command ends

`PLine`
- first click sets the start point on the sketch plane
- each next click extends the temporary chain
- mouse movement updates one ghost next segment from the last active endpoint
- keep one temporary live chain during the command
- commit the chain as authored sketch content only when the user finishes it

#### Toolbar / Session Behavior

The toolbar should mirror:
- active tool
- current step/prompt
- live point values if available
- simple finish/cancel hints

The toolbar must not:
- become the drawing surface
- own temporary draw geometry

The first cut is click-first:
- do not require typed numeric entry yet
- allow later toolbar reflection of point values
- defer true typed numeric-entry workflow until a later phase

#### Console Commands

Temporary day-one local session commands:
- `line`
- `pline`
- `status`
- `help`

Rules:
- they are local session commands, not a second permanent workflow
- they must call the same underlying session/tool actions as the toolbar
- they should be modeled as a future branch of the deeper `graph > node > sketch > draw` command tree

#### Commit / State Rules

- `DrawSketch-1` must already commit first-pass `Line` and `PLine` entities into sketch component state
- keep commit rules minimal in this phase
- defer deeper lifecycle polish to `3.2B-DrawSketch-2`
- do not let this phase become preview-only

#### Required First-Pass Aids

Keep in scope:
- projected current point
- current temporary segment/chain preview
- origin snap

Keep out of scope:
- `Arc3Point`
- `BezierSpline`
- `Rectangle`
- `Circle`
- rich snapping/inference
- entity editing
- browser/deeper expose work
- final global console grammar

#### Implementation Seams

- extend the existing geometry-sketch session so `draw` mode can own an active viewer-backed draft tool session
- add a dedicated viewer-side helper module for temporary sketch draw preview
- bridge active tool/session state from app/store into the viewer
- send viewer-picked sketch-plane points back through one canonical draw-session seam
- commit authored `Line` / `PLine` output back into sketch component state through the existing sketch feature/store path
- keep the active `Spaghetti Editor` collapsed while the draw session is active

#### Acceptance Checks

- clicking `Draw` collapses the active `Spaghetti Editor`
- the camera aligns to the sketch plane
- the working grid moves onto the chosen sketch plane
- the origin point is visible at the center of the grid
- the cursor can snap to the origin
- `Line` works as:
  - first click start
  - ghost preview while moving
  - second click commit
- `PLine` works as:
  - first click start
  - live temporary chain while moving
  - next clicks extend the chain
- committed geometry is visually stronger than ghost geometry
- toolbar mirrors active tool and prompt state without becoming the drawing surface
- local console commands `line`, `pline`, `status`, and `help` work against the active draw session

#### Assumptions And Defaults

- first implementation target is the real main model viewport
- first implementation target is the current active sketch plane chosen through `SketchPlane`
- first implementation target is `Line` and `PLine` only
- first implementation target is click-first, not typed-entry-first



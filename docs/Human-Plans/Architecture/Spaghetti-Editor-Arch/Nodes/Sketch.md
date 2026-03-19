# Sketch

## Doc Header

### Doc History
26. 2026-03-18 22:19: Expanded the `3.2B-2-Cleanup` phase with two concrete visual/product requirements: restore the sketch-plane toolbar to the earlier compact title-bar language keyed off the sketch-plane pin color, and move the source-pick interaction fully into the main model viewport with a central origin gizmo plus three clickable ghost origin planes instead of a faux embedded viewport panel
25. 2026-03-18 22:14: Added a real `3.2B-2-Cleanup` phase section that captures the post-implementation cleanup work needed after the first viewport-first source-pick cut, including removing the faux mini-viewport treatment, moving preview responsibility back onto the main model viewport, tightening draft-versus-committed ownership, and clearing remaining prototype/dev seams
24. 2026-03-18 21:54: Revised the `3.2B-2` phase section itself into an implementation-ready spec, adding the locked viewport-first source-pick flow, explicit implementation seams, acceptance checks, and out-of-scope boundaries, and then answered the remaining `3.2B-2` decision items by promoting their standing suggestions into explicit defaults for this phase
23. 2026-03-18 21:47: Marked `3.2B-2` decisions `6` and `7` as answered, locking the first viewport-first source-pick cut to one continuous live placement session where origin-plane pick immediately opens the sketch-origin gizmo, and keeping the first gizmo toolset to `move + rotate` while leaving `Flip` in the row/control surface for later
22. 2026-03-18 21:42: Reordered the `3.2B-2` viewport-pick decision questions back into strict numeric sequence so the planning checklist now reads cleanly from `1` through `15` without the later-added picker questions interrupting the earlier numbered flow
21. 2026-03-18 21:41: Marked `3.2B-2` decision `14` as answered, locking the direction that the existing sketch-plane picker should be expanded into the newer viewport-first source-pick tool and should become the replacement path rather than remaining a parallel long-term overlay picker
20. 2026-03-18 21:39: Updated the sketch node architecture doc with current code-truth for viewport-first source pick, clarifying that the repo already has a real window-level `Spaghetti Editor` `collapsed mode`, that header collapse is a separate panel behavior, that the current `Pick In Viewport` flow is still an older `XY / XZ / YZ` overlay picker, and that `3.2B-2` should explicitly replace that picker path instead of only polishing it
19. 2026-03-18 21:35: Marked `3.2B-2` decision `3` as answered, locking the viewport-pick compact surface to use the existing preset `Spaghetti Editor` `collapsed mode` that hides the editor body and leaves the top bar visible during active sketch-plane source picking
18. 2026-03-18 21:33: Reformatted the full `3.2B-2` decision block so each viewport-pick question now uses a consistent collapsible `####` heading with nested `##### Decision` and `##### Suggestion` sections, making the planning surface easier to scan and collapse question-by-question
17. 2026-03-18 21:11: Added a dedicated `Console integration` section to the sketch architecture doc so the viewport-pick workflow now has one clear place to define how sketch-plane sessions should expose debug/status commands, session tracing, and developer-side console hooks during early implementation
16. 2026-03-18 21:10: Marked `3.2B-2` decision `2` as answered, locking the exit model so the `SketchPlane` pick session can be cancelled by the `X` action in the sketch-plane surface, by `Esc`, and by typing `x` in the console while the workflow is still in active development/debugging
15. 2026-03-18 21:08: Marked `3.2B-2` decision `1` as answered, locking viewport-pick to wait for explicit user confirmation, calling for a confirm action in the `SketchPlane` surface plus an `Enter` shortcut, and adding the requirement that the active pick session should record the user's steps/actions to the console for debugging
14. 2026-03-18 21:24: Numbered the open `3.2B-2` viewport-pick checklist questions so each remaining decision can be referenced directly during planning and later implementation discussion
13. 2026-03-18 21:22: Reformatted the open `3.2B-2` viewport-pick decision questions into a checklist so the remaining scope and product choices for that phase can be answered directly in-place as planning decisions are made
12. 2026-03-18 21:19: Added a `Decisions` section for `3.2B-1` through `3.2B-3`, marking `3.2B-1` as effectively settled, capturing the remaining implementation questions for `3.2B-2`, and separating `3.2B-3` as the later geometry-driven follow-on
11. 2026-03-18 21:12: Reformatted the local `3.2B-N` sketch subphase map so the phase headings now use one consistent checkbox-style `##` pattern, preserving the shipped first phases as checked and the remaining future phases as unchecked
10. 2026-03-18 20:51: Added the UI-structure vision that the sketch-plane setup steps are conceptual only and should render as grouped editable rows inside the expanded `SketchPlane` input surface, letting the user adjust reference, move, rotate, and flip in any order
9. 2026-03-18 20:39: Replaced the earlier two-mode `Pick In Viewport` framing with one hybrid source-pick workflow so origin planes, existing sketch geometry, and model faces can all participate in the same placement session without a hard mode split
8. 2026-03-18 20:36: Clarified that `Source > Pick In Viewport` should support two explicit input modes, one for starting from the world/origin reference planes and one for deriving sketch-plane setup from existing model geometry
7. 2026-03-18 20:32: Added a `3.2B-N` sketch subphase map to this doc, treating the currently shipped `[3.2B]` work as `3.2B-0` and breaking the next sketch follow-ons into a numbered sequence for source, viewport pick, auto-setup, browser, and later sketch-content growth
6. 2026-03-18 20:27: Added a long-term `Flip` control to the `Sketch plane` vision as a simple `ParaSelect` orientation action that flips the sketch direction without forcing the user into deeper manual rotation every time
5. 2026-03-18 20:26: Expanded the `Sketch plane` vision so the sketch-origin gizmo now explicitly represents free plane placement/orientation and the source workflow now includes model-geometry auto-setup with viewport edge highlighting requirements
4. 2026-03-18 20:24: Expanded the `Sketch plane` viewport-pick vision so `Pick In Viewport` now explicitly collapses the spaghetti editor into a compact bar, promotes a sketch-origin gizmo/transform tool in the viewport, and calls for additional spatial reference aids around that origin during placement
3. 2026-03-18 20:22: Expanded the long-term `SketchPlane` source-pick direction to explicitly require viewport gizmo support plus ghost plane boxes and grid previews so source picking can become a real placement workflow instead of only a static picker
2. 2026-03-18 20:20: Added a dedicated `Sketch plane` section that defines the vision for `SketchPlane` as the sketch's nested source/setup surface, including `Source` plus `Transform`, row-mode behavior, viewport-pick direction, and the intended boundary between immediate v1 controls and later richer face-pick/orientation work
1. 2026-03-18 20:14: Created this architecture doc to define the future ParaHook `Sketch` as a real authored content family, including source selection, transform ownership, viewport exposure, browser placement, and the boundary between sketch setup and sketch-produced content

### Purpose

This doc defines the architecture direction for the ParaHook `Sketch`.

Use it to answer:
- what a `Sketch` is supposed to be in ParaHook
- what belongs to `SketchPlane` versus the wider sketch object
- how sketch source and transform should be modeled
- how sketches should appear in the browser
- how sketches should preview in the viewport before downstream consumption
- what content a sketch should eventually produce
- how to separate immediate v1 work from later richer sketch content work

### Why This Doc Exists

The current `Geometry/Sketch` node has grown beyond a simple plane picker.

It now touches several different product concerns:
- choosing a sketch source plane
- transforming that source plane
- editing sketch curves
- deriving sketch profiles
- previewing sketch content in the viewport
- exposing sketch content into the browser even before a downstream node consumes it

Those are related, but they are not the same problem.

This doc exists to describe the full `Sketch` object honestly before more UI work gets added as disconnected one-off controls.

### Scope

This doc covers:
- the future role of `Sketch` as an authored object
- the ownership split between `Sketch`, `SketchPlane`, `Source`, and `Transform`
- browser placement for sketches
- viewport exposure behavior for sketches
- the relationship between authored sketch curves, profiles, and future export
- the recommended first implementation seams

This doc does not cover:
- final visual styling
- the full detailed runtime geometry implementation for transformed planes
- DXF export implementation details
- every future sketch editing tool
- final browser-child row behavior for all future sketch sub-surfaces

## Doc Body

### Short Version

ParaHook should treat `Sketch` as a real authored content family, not just as a temporary profile source for extrusion.

`SketchPlane` should remain the input/parameter name for the sketch source surface.

The sketch itself should eventually own:
- `Source`
- `Transform`
- `Curves`
- `Profiles`
- later `Export`

At the browser level, sketches should eventually sit under:
- `Content`
  - `References`
  - `Assembly`
  - `Sketches`

At the node level, the immediate work should still start with the `SketchPlane` source workflow before the browser and exposure surfaces become deeper.

### Core Naming Decisions

Use these terms:

- `Sketch`
  - the authored sketch object/family
- `Geometry/Sketch`
  - the current graph node that authors a sketch
- `SketchPlane`
  - the input/parameter name for the sketch source setup
- `Source`
  - how the sketch chooses its base plane or face
- `Transform`
  - how the source plane is offset or reoriented
- `Curves`
  - authored 2D/vector sketch entities like lines, arcs, splines, circles, rectangles
- `Profiles`
  - derived closed-loop sketch regions
- `Expose`
  - the user action that makes a sketch previewable and browser-visible even without downstream output consumption

Important rule:
- `SketchPlane` is not the sketch itself
- `SketchPlane` is one authored setup surface inside the wider `Sketch`

### Current Reality

Right now the repo already has a meaningful first sketch seam:
- `Geometry/Sketch` exists as a node
- `SketchPlane` exists as a managed input row
- the node authors sketch components
- profile derivation already exists
- the viewer can render an active sketch overlay

But the current system is still conceptually thin:
- `SketchPlane` is still effectively a plane-choice seam
- viewport preview is tied to the active sketch session, not general sketch exposure
- the browser does not yet treat sketches as a first-class content family
- the user cannot yet expose a sketch into the viewport/browser without routing through downstream content

### Problem Statement

ParaHook needs to stop treating sketches as disposable setup state.

The real product direction is larger:
- a sketch has a source
- a sketch has a transform
- a sketch produces authored vector content
- a sketch can produce profiles for modeling
- a sketch may later be exportable as vector content like `.dxf`

If the architecture keeps treating sketch setup, sketch preview, and sketch content as separate hacks, the browser and viewport flows will keep drifting.

### Main Architecture Direction

#### 1. `Sketch` Should Become A Real Authored Content Family

`Sketch` should eventually stand beside `Assembly` as a real authored output family.

Recommended browser family structure:
- `Content`
  - `References`
  - `Assembly`
  - `Sketches`

Reason:
- `Assembly` is built 3D content
- `Sketches` are authored 2D/vector content
- `References` are imported source material

This is a cleaner long-term model than hiding all sketch truth only inside graph-node internals.

#### 2. `SketchPlane` Should Remain A Child Setup Surface

Do not lift `SketchPlane` to the same level as `Sketches`.

`SketchPlane` should remain nested under each sketch as the authored source/setup surface.

That means:
- top-level family: `Sketches`
- per-sketch child concerns:
  - `Source`
  - `Transform`
  - `Curves`
  - `Profiles`
  - later `Export`

#### 3. `Sketch` Should Be Previewable Before Downstream Use

A sketch should not need a downstream node connection before the user can see it in the viewport.

That implies a real authored exposure rule:
- a sketch can be `exposed`
- exposed sketches preview in the model viewport
- exposed sketches become visible in the browser under `Content > Sketches`

Important rule:
- exposed sketch preview is authoring visibility
- it is not the same thing as published assembly content

### The Sketch Object Shape

The honest future sketch object is:

```text
Sketch
├─ Source
│  ├─ origin plane
│  └─ later face pick
├─ Transform
│  ├─ offset
│  ├─ translation
│  ├─ rotation
│  └─ in-plane rotation
├─ Curves
│  ├─ lines
│  ├─ arcs
│  ├─ splines
│  ├─ rectangles
│  └─ circles
├─ Profiles
│  └─ derived closed regions
└─ Export
   └─ later vector export such as `.dxf`
```

Important rule:
- `Source` and `Transform` are setup surfaces
- `Curves` and `Profiles` are authored/derived sketch content

### `SketchPlane` V1 Ownership

The current near-term `SketchPlane` work should still be treated as a v1 setup surface inside `Sketch`.

Recommended split:
- `collapsed`
  - top row only
- `essentials`
  - `Source`
  - compact `Transform`
- `expanded`
  - richer `Source`
  - fuller `Transform`

Control language:
- use `ParaSelect` for discrete source choices like `XY / XZ / YZ`
- use `ParaSlider` for numeric transform controls

Important rule:
- the current `SketchPlane` work is not the whole sketch architecture
- it is the first authored setup seam inside the larger sketch system

### `SketchDraw` V1 Direction

`Sketch` should gain a second input pin named:
- `SketchDraw`

This pin should represent the authored sketch-content entry seam, separate from `SketchPlane`.

Recommended near-term role:
- `SketchPlane`
  - source/setup
- `SketchDraw`
  - drawing/editing entry surface for authored 2D sketch content

Inside `SketchDraw`, the first visible action should be a button:
- `Draw`

That `Draw` button should:
- enter the sketch drawing session
- open the sketch drawing toolbar
- keep the main model viewport as the real drawing surface

Important rule:
- `SketchDraw` is the node-level content pin
- `Draw` is the first action inside that pin
- do not treat `Draw` itself as the deeper owned data model

### `Draw Sketch` Viewport-First Direction

After the `SketchDraw` pin exists and can open `Draw Sketch`, the next honest step is:
- move actual sketch drawing into the real main model viewport

Important rule:
- the floating `Sketch Draw` toolbar is the control surface
- the real authored drawing interaction happens in the main Three viewer
- do not treat the toolbar itself as the drawing canvas

Recommended user flow:
1. user clicks `Draw` inside `SketchDraw`
2. the active `Spaghetti Editor` collapses out of the way
3. the `Sketch Draw` toolbar opens with the current tool family
4. the user picks:
   - `Line`
   - `Arc3Point`
   - `BezierSpline`
   - `Rectangle`
   - `Circle`
5. the user then clicks in the real model viewport to place points and author sketch entities
6. the active draw preview is rendered directly in the Three viewport before commit
7. when the entity is accepted, the authored sketch component is committed back into the sketch feature

Ownership split:
- `SketchDraw`
  - owns the authored sketch-content seam at the node level
- `Draw Sketch`
  - the user-facing workflow/session name
- `Draw Sketch` toolbar
  - owns active tool choice, per-tool options, session status, and session actions
- Three viewer
  - owns the actual live drawing preview, hover guides, point picking, and temporary in-viewport geometry
- sketch feature/store state
  - owns committed sketch components and derived profiles

Important rule:
- temporary draw state should stay session-local until the current entity is accepted
- committed sketch component data should only update when the user finishes the current entity step cleanly

Recommended first subphase split:

#### `DrawSketch-1` - `Viewer-Owned Live Draw Preview`

Purpose:
- prove that sketch entity authoring is happening in the real Three viewport instead of only through toolbar form rows

Owns:
- viewer-owned temporary draw preview for the active tool
- viewport click capture for sketch-space points
- hover preview for the next point
- active-tool status reflected in the toolbar
- first pass for:
  - line
  - rectangle
  - circle

Important boundary:
- keep this first viewport draw cut narrow
- do not block it on every advanced sketch tool at once

#### `DrawSketch-2` - `Multi-Step Tool Sessions And Commit Rules`

Purpose:
- make the draw tools feel like real interactive sessions instead of one-off point drops

Owns:
- multi-click tool progression
- explicit accept/cancel behavior for the current entity
- per-tool temporary state machines
- session-local draft geometry before commit
- cleaner handoff from temporary draw preview into committed sketch components

Recommended tool progression:
- `Line`
  - first point
  - second point
  - commit
- `Rectangle`
  - first corner
  - opposite corner
  - commit
- `Circle`
  - center
  - edge/radius
  - commit
- `Arc3Point`
  - start
  - mid
  - end
  - commit
- `BezierSpline`
  - progressive point placement
  - later tangent/control refinement if needed

#### `DrawSketch-3` - `Selection, Editing, And Richer Sketch Feedback`

Purpose:
- move beyond raw draw-only placement into a fuller sketch authoring surface

Owns:
- entity hover/selection in the viewport
- editing of existing sketch entities from the viewport
- richer preview styling for:
  - active
  - hovered
  - selected
  - invalid
- later snapping and inference aids
- later constraint-like feedback if desired

Implementation seam recommendation:
- add a dedicated viewer-side sketch draw helper module, similar in spirit to the sketch-plane preview helper
- keep tool session state bridged from the app/store into the viewer
- keep temporary draw geometry viewer-owned
- keep committed sketch components graph/store-owned

Important rule:
- this should follow the same architectural lesson as `SketchPlane`
- toolbar = controls
- viewer = real interaction surface
- store/feature = committed truth

### Browser Direction

The browser should eventually support sketches as authored content, not only as graph-node internals.

Recommended browser direction:

```text
Content
├─ References
├─ Assembly
└─ Sketches
   ├─ Sketch 1
   │  ├─ Source
   │  ├─ Curves
   │  ├─ Profiles
   │  └─ later Export
   └─ Sketch 2
```

Important rule:
- `Sketches` is the family
- `SketchPlane` / `Source` is nested inside each sketch

### Viewport Exposure Direction

The sketch node should gain an `eyeball`-style expose toggle.

When enabled:
- the sketch can preview in the model viewport
- the sketch can appear as active authored content in the browser
- the user can keep working on sketch content even without a downstream output consumer

When disabled:
- preview hides
- authored sketch data remains intact
- assembly content does not change

### Source-Pick Direction

The longer-term source workflow should move toward two user-facing controls:

1. `Source`
- choose an origin plane
- later pick a planar face in the model viewport

2. `Transform`
- offset and rotate/reorient the sketch plane

That is the clean simplification of the richer underlying plane model.

### Future Sketch Content Direction

The sketch should eventually be able to stand on its own as vector-authored content.

That means the architecture should assume future support for:
- richer sketch-curve browsing
- profile browsing
- viewport-only sketch preview
- later vector export, especially `.dxf`

This is why the browser family should be `Sketches`, not only `SketchPlane`.

### Immediate Planning Split

The work should be thought of as several related tracks, not one blob:

1. `SketchPlane` source/setup workflow
2. viewport-first source picking and preview
3. browser structure for `Content > Sketches`
4. exposure/eyeball behavior
5. deeper sketch-content browser surfaces
6. later sketch export and richer content ownership

Important rule:
- do not collapse all of these into one implementation task
- keep the setup work and content-family work related, but distinct

## [x] - `3.2B-N` Sketch Subphase Map

For this doc, treat the current shipped roadmap phase `[3.2B] Sketch Operation Authoring` as:
- `3.2B-0`

Use the next sketch follow-ons as:

## [x] - `3.2B-0` - `Existing Sketch Operation Authoring`

Purpose:
- the already-landed first real graph-native sketch authoring cut

Owns:
- `Geometry/Sketch` as a real node
- first authored sketch components
- profile derivation
- first honest sketch review/output flow

## [x] - `3.2B-1` - `SketchPlane Source And Transform Surface`

Purpose:
- turn `SketchPlane` into a richer setup surface instead of a thin plane row

Owns:
- `Source + Transform`
- `collapsed / essentials / expanded` row behavior
- `ParaSelect` for plane choice
- `ParaSlider` for numeric transform values
- simple orientation actions like `Flip`

## [ ] - `3.2B-2` - `Viewport-First Source Pick And Sketch Origin Gizmo`

Purpose:
- make sketch-plane picking a real viewport-first placement workflow

Owns:
- `Pick In Viewport`
- temporary spaghetti-editor collapse into a compact bar
- sketch origin gizmo / transform tool
- ghost plane boxes
- ghost sketch grids
- spatial reference aids around the origin gizmo

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

## [ ] - `3.2B-2-Cleanup` - `Main Viewport Integration And First-Pass Workflow Cleanup`

Purpose:
- clean up the first `3.2B-2` implementation so the sketch-plane pick flow reads as one honest main-model-viewport workflow instead of a mixed prototype with leftover faux-viewport UI

Owns:
- return the sketch-plane session toolbar/chrome to the earlier compact title-bar language, including the sketch-plane accent color keyed from the live sketch-plane pin color
- remove the visual feeling that `Pick In Viewport` opens a second mini viewport inside the overlay
- move sketch-plane preview responsibility back onto the real main model viewport instead of relying on a boxed preview/stage panel
- keep the compact `Spaghetti Editor` shell and the active pick controls, but make the main viewer the obvious working surface
- render the first honest main-viewport origin-pick composition:
  - sketch origin gizmo at the world origin
  - three ghost origin planes/boxes in the viewport
  - direct click targets on those ghost planes
- tighten draft-versus-committed ownership so active sketch-plane session edits remain temporary until confirm across the full `SketchPlane` surface
- clean up prototype/dev-only seams from the first cut, including temporary console affordances, temporary wording, and any now-obsolete overlay-picker remnants
- normalize the first-pass session layout so:
  - toolbar/shell controls stay compact
  - preview and ghost-plane/grid cues belong to the main viewport
  - transform adjustment feels attached to the same placement session
- audit whether the session should keep overlay slider controls for move/rotate, or whether the next honest step is to hand off to a true shared viewer gizmo surface
- reduce duplicate or conflicting source-pick UI so there is one clear `Pick In Viewport` path and one clear `SketchPlane` session state

Cleanup findings from the current first pass:
- the repo now has a real viewport-first `sketchPlanePickSession`, but the current UI still renders a faux stage/preview box in the overlay that can read like a second viewport
- the current session toolbar language drifted away from the earlier compact sketch-plane title-bar treatment and should be pulled back toward that simpler accent-bar style
- the first pass successfully collapses the `Spaghetti Editor` shell, but the pick experience still needs a stronger separation between:
  - compact session controls
  - main model viewport preview
- the current first pass does not yet match the intended main-viewport composition of:
  - central origin gizmo
  - three clickable ghost origin planes
  - one compact control block off to the side
- the first pass uses temporary draft state for picked plane, translation, and rotation, but the wider `SketchPlane` row still needs a stricter cleanup pass so all session-visible values clearly behave as draft-only until confirm
- temporary console affordances like console `x` are acceptable for development, but should be kept explicitly temporary and not become the permanent primary workflow
- the current first cut should be treated as the foundation, not the finished viewport interaction language

Recommended acceptance target for this cleanup phase:
- entering `Pick In Viewport` clearly uses the main model viewport as the working surface
- the user no longer perceives a second embedded viewport or boxed mini-view as the actual plane-picking canvas
- previewed plane boxes, ghost planes, and grid cues read as viewer overlays, not as a separate internal panel
- the sketch-plane toolbar returns to a compact title-bar treatment with the sketch-plane accent color instead of reading like a large detached secondary window
- the user sees the intended first origin-pick layout:
  - sketch origin gizmo in the model viewport
  - three ghost origin planes at the origin
  - a compact side control block rather than a faux internal viewport
- the active session keeps one clean control surface for:
  - plane choice
  - move
  - rotate
  - confirm / cancel
- draft sketch-plane values stay temporary until `Done / Enter`
- obsolete legacy picker UI and mixed prototype seams are removed or clearly retired

Important rule:
- this cleanup phase still belongs to `3.2B-2` territory
- do not let it absorb `3.2B-3` geometry-driven face/edge picking
- do not let it absorb the later generic transform-tool architecture either
- the goal here is to make the first viewport-first origin-plane workflow honest, not to expand scope
### Implemented cleanup plan
#### `3.2B-2-Cleanup` — Main Viewport Integration And First-Pass Workflow Cleanup

##### Summary
Refactor the shipped `3.2B-2` sketch-plane pick flow so it reads as one honest main-model-viewport workflow.

Keep the current single `sketchPlanePickSession`, the collapsed `Spaghetti Editor` shell, explicit `Done` / `X`, `Enter` / `Esc`, and draft-until-confirm behavior. Remove the faux embedded “stage” / mini-viewport treatment. The main viewer becomes the clear picking surface, with:
- a viewport-resident origin gizmo/axis anchor
- three clickable ghost origin planes at world origin
- one compact right-side sketch-plane control dock
- no second internal panel pretending to be the viewport

##### Key Changes
###### Viewer / Overlay
- Remove the boxed `.ViewportOverlaySketchPlaneStage` and `.ViewportOverlaySketchPlanePreview` composition entirely.
- Render the first honest origin-pick composition directly in the main viewport overlay:
  - world-origin anchor
  - `X / Y / Z` axis cues
  - three ghost origin planes for `XY / XZ / YZ`
  - direct click targets on those planes
- Keep the viewer interaction origin-plane-only for this cleanup. Do not add face/edge picking here.
- Treat the viewport gizmo in this cleanup as a viewer-owned origin/plane overlay, not a full generalized draggable 3D transform manipulator.

###### Compact Control Dock
- Replace the current large detached session chrome with one compact right-side dock.
- Restore the earlier sketch-plane title-bar language:
  - compact title/header
  - sketch-plane accent keyed from the live pin color
  - lighter chrome, not a large secondary window
- Keep these controls in the right dock:
  - current plane summary
  - `XY / XZ / YZ` state reflection
  - `Move / Rotate` mode toggle
  - move sliders
  - rotate sliders
  - `Done`
  - `X`
- Keep move/rotate as side controls for this cleanup pass. Do not move them fully into an in-viewport manipulator yet.

###### Session Ownership
- Keep one canonical `sketchPlanePickSession`; do not add a second session model.
- During an active pick session, all session-visible sketch-plane values must resolve from draft state first, committed feature state second.
- Nothing commits until `Done` or `Enter`.
- `X`, `Esc`, and hidden/developer console `x` all cancel through the same path.
- Keep console trace logging for:
  - session started
  - plane selected
  - move
  - rotate
  - confirmed
  - cancelled
- Keep console `x` hidden/dev-only; do not surface it as primary UX.

###### UI / Cleanup Boundaries
- Remove obsolete legacy picker remnants and any mixed “old popup vs new session” seams.
- Keep the collapsed spaghetti shell behavior exactly as the current window-level collapsed mode.
- Do not expand scope into:
  - face picking
  - edge picking
  - geometry validity rules
  - generic transform-tool architecture
  - browser/expose work

##### Test Plan
- Starting `Pick In Viewport` still collapses the active spaghetti window into the real header-only shell.
- The old faux stage/preview box no longer renders.
- The main viewport session renders:
  - origin anchor
  - axis cues
  - three ghost origin planes
- Clicking a ghost plane updates draft plane state and advances the session into adjust mode.
- The compact right-side dock renders the compact sketch-plane title bar with active controls.
- Move/rotate controls still edit only draft values.
- `Done` commits draft plane and transform.
- `X`, `Esc`, and hidden console `x` all cancel without committing.
- After cancel/confirm, the extra ghost-plane/grid/session overlay content is removed cleanly.
- Existing `NodeView` / store tests continue to pass for draft-vs-committed behavior.

##### Assumptions And Defaults
- Control surface placement: fixed compact right-side dock in the main viewport.
- Move/rotate interaction: keep side controls for this cleanup pass.
- Console behavior: keep session logs and keep `x` as hidden/dev-only.
- Toolbar style: restore the earlier compact sketch-plane title-bar language with pin-color accent.
- “Gizmo now” means a viewport-resident origin/plane overlay now, not full transform-tool unification now.


## [ ] - `3.2B-3` - `Geometry-Driven Auto-Setup And Selection Highlighting`

Purpose:
- allow model geometry to help drive sketch-plane setup

Owns:
- click geometry to infer sketch-plane placement/orientation
- first useful edge/geometry-driven auto-setup
- viewer hover/selection highlighting
- edge-line highlight feedback
- filled/tinted selection feedback
- hover versus committed source feedback

## [ ] - `3.2B-4` - `Sketch Exposure And Browser Structure`

Purpose:
- give sketches a truthful authored-content presence before downstream body consumption

Owns:
- sketch `eyeball` / expose behavior
- viewport preview for exposed sketches
- first browser family structure:
  - `Content`
    - `References`
    - `Assembly`
    - `Sketches`

## [ ] - `3.2B-5` - `Sketch Browser Depth And Authored Content Surfaces`

Purpose:
- deepen the browser and content model once sketches are already visible as a family

Owns:
- sketch child rows like:
  - `Source`
  - `Curves`
  - `Profiles`
  - later `Export`
- richer browser participation in sketch-source workflow
- better authored sketch-content readability

## [ ] - `3.2B-6` - `Sketch Content Ownership And Later Export`

Purpose:
- let sketch stand on its own as authored vector content, not just as a body-feature feeder

Owns:
- stronger `Sketches` content-family identity
- later vector-export direction like `.dxf`
- richer sketch-content ownership beyond the node-only editing surface

Important rule:
- `3.2B-1` through `3.2B-3` are primarily about sketch-plane/source workflow
- `3.2B-4` through `3.2B-6` are primarily about sketch exposure, browser ownership, and later content growth

### First Honest Next Step

The next planning/implementation step should still begin with the sketch-source workflow, not the browser shelf.

Reason:
- `Source` semantics need to stabilize first
- the viewport pick flow depends on them
- browser integration becomes cleaner once the source model is honest

That means:
- start with `SketchPlane` source/picker cleanup
- then deepen viewport-first source-pick behavior
- then add stronger browser integration for `Sketches`

### What This Doc Locks

This doc locks these decisions:
- `Sketch` is the wider authored object
- `SketchPlane` remains a nested setup/input surface
- `Sketches` should eventually live beside `Assembly` under `Content`
- sketches should be expose-able to viewport/browser before downstream consumption
- sketches should eventually own vector-authored content and later export seams

### What This Doc Leaves Open

This doc intentionally does not fully decide:
- the final runtime data model for transformed sketch planes
- the exact browser child-row interaction design
- the final face-pick implementation
- the final export surface shape
- the final viewer model for one active sketch versus multiple exposed sketches

Those should be decided in follow-on task/planning docs under this architecture direction.


## Sketch plane

### Short Version

`SketchPlane` should be treated as the sketch's authored source/setup surface.

It is not the whole sketch, and it is not just a thin plane enum picker anymore.

Its job is:
- define where the sketch starts
- define how that starting plane is adjusted
- stay simple enough that the user can understand it as one coherent setup surface

The intended user-facing split is:
- `Source`
- `Transform`

### What `SketchPlane` Is

`SketchPlane` is the input/parameter name for the sketch setup surface inside `Geometry/Sketch`.

It should own:
- the base source the sketch is attached to
- the first transform controls that modify that source

It should not own:
- the whole sketch object
- authored curves
- derived profiles
- export behavior

Important rule:
- `SketchPlane` is a child authored setup surface inside `Sketch`
- it is not the top-level content family

### The User Mental Model

The user should be able to think about `SketchPlane` in just two steps:

1. `What am I sketching on?`
2. `How do I adjust it?`

That maps cleanly to:
- `Source`
- `Transform`

This is the right simplification even if the underlying runtime model becomes richer later.

### `Source`

`Source` is how the sketch chooses its starting plane.

The long-term source options should be:
- origin plane
  - `XY`
  - `XZ`
  - `YZ`
- later planar face pick from the model viewport

For v1, the first honest source control is:
- origin plane choice with `ParaSelect`

That keeps the control language simple while leaving room for later face-pick.

### `Transform`

`Transform` is how the user adjusts the chosen source plane.

The long-term transform surface can include:
- offset
- translation
- rotation
- in-plane rotation
- flip

But the user should still experience it as one grouped transform surface, not a random pile of numeric ports.

For v1, the transform direction should stay focused on:
- offset
- simple rotation
- the existing authored transform values already being stored for the sketch plane

Use the shared control language:
- `ParaSlider` for numeric values
- `ParaSelect` for simple discrete orientation actions like `Flip`

`Flip` should be treated as a simple authored direction control.

Its job is:
- flip the direction of the sketch plane
- give the user a quick orientation correction without requiring deeper manual rotation

Important rule:
- `Flip` should stay simple and readable
- it is not a replacement for the richer transform surface

### Expanded-Row UI Structure

The setup flow can be described as steps conceptually, but the actual `SketchPlane` UI should not become a locked step-by-step wizard.

Inside the expanded `SketchPlane` input row, these should simply render as grouped editable rows using the shared control language.

That means the user should see a flexible parameter list such as:

```text
SketchPlane
├─ Reference
│  ├─ ParaSelect
│  └─ Pick In Viewport
├─ Move
│  ├─ X -> ParaSlider
│  ├─ Y -> ParaSlider
│  └─ Z -> ParaSlider
├─ Rotate
│  ├─ X -> ParaSlider
│  ├─ Y -> ParaSlider
│  └─ Z -> ParaSlider
└─ Flip
   └─ ParaSelect
```

Important rule:
- these are planning steps, not interaction locks
- the user should be free to set `Flip` first, move first, rotate first, or change the reference first
- the expanded `SketchPlane` row should behave like an authored parameter stack, not a forced wizard

Recommended read:
- `Reference`
  - pick the initial sketch reference
  - origin planes, existing sketches, and model faces all belong here
- `Move`
  - refine origin placement
- `Rotate`
  - refine orientation
- `Flip`
  - quick direction correction

### Row-Mode Behavior

The `SketchPlane` row should support the existing three row modes intentionally.

Recommended behavior:

- `collapsed`
  - top row only
  - show the port name and current source summary
  - no nested controls visible

- `essentials`
  - top row
  - `Source`
  - compact `Transform`
  - enough control to choose the plane and make the most common adjustments

- `expanded`
  - top row
  - fuller `Source`
  - fuller `Transform`
  - the richer authored setup surface for deeper editing

Important rule:
- `collapsed` should remain a true summary surface
- `essentials` should be the main everyday working mode
- `expanded` should reveal depth, not become the only usable mode

### Viewport-Pick Direction

The long-term `SketchPlane` source flow should become viewport-first.

Current code reality:
- the repo already has a real window-level `Spaghetti Editor` `collapsed mode` that keeps the title bar shell and removes the floating body
- this is different from the panel's header-collapse behavior, which only shrinks the header area while keeping the editor body alive
- the current `Pick In Viewport` flow is still an older overlay picker that opens a draggable `Sketch Plane` popup with `XY / XZ / YZ` buttons
- `3.2B-2` should explicitly replace that older overlay-picker workflow with the newer viewport-first session instead of only polishing the existing popup

That means:
- the user can enter source-pick from the sketch node
- the spaghetti editor should collapse into a compact bar so the viewport becomes primary
- the viewport should preview the candidate source plane or face before commit

The intended `Pick In Viewport` interaction is:
- user clicks `Pick In Viewport`
- spaghetti editor collapses into a compact top bar / shell
- viewport becomes the main working surface
- the sketch origin gizmo appears at the world origin by default
- user sees the three origin reference boxes / planes in the viewport, similar to Fusion-style origin picking
- the user can use transform controls on that gizmo to move and adjust the sketch plane before sketching

`Pick In Viewport` should be treated as one hybrid source-pick workflow, not two separate mode families.

The session should open with the world origin and the three origin reference planes visible by default, but the user should also be able to click valid existing geometry in the same session to redefine the sketch-plane source.

The same source-pick workflow should allow:
- start from `0,0,0`
- click one of the world/origin reference planes:
  - `XY`
  - `XZ`
  - `YZ`
- click valid existing sketch geometry when that geometry is a useful source reference
- click valid model geometry such as object faces
- later refine the resulting sketch plane with the same sketch origin gizmo / transform controls

Important rule:
- this should feel like one continuous source workflow
- origin picking and geometry-driven picking are just different ways to create the initial sketch-plane reference
- the later transform tool should stay the same regardless of how the source was first chosen

This gizmo should be treated as the sketch origin gizmo / transform tool, not as a generic unrelated viewer control.

Long term, this should allow the user to:
- place the sketch plane wherever they want
- rotate the sketch plane however they want
- treat source-pick plus transform as one continuous placement workflow instead of two disconnected tools

Fusion-style behavior is the right reference here:
- pick a plane or planar face in the viewport
- see a live preview
- commit the source

To make that source flow feel real, the viewport will also need dedicated preview/placement visuals:
- a gizmo for adjusting the active sketch plane placement/orientation
- ghost plane boxes rendered in the viewport before commit
- ghost grid previews rendered on the candidate sketch plane
- additional spatial reference cues around the sketch origin gizmo so the user can read orientation and placement more easily

The source workflow should also support auto-setup from model geometry.

That means the user should eventually be able to click geometry in the model and have the sketch plane infer a useful starting placement/orientation from that selection.

The likely first useful version is:
- click an existing sketch or other qualifying geometric reference
- click a model face or other qualifying geometric reference
- auto-set the sketch plane from that reference

To support that, the viewer will need explicit geometry-selection preview states such as:
- highlighted edge lines
- a filled selection surface or selection tint near the chosen reference
- clear hover-versus-committed selection feedback
- enough visual feedback that the user understands what reference is currently driving the sketch plane

Important rule:
- these previews should make the sketch plane feel spatial and editable before the user starts drawing
- the source picker should evolve from a simple selector into a real placement workflow

Important rule:
- this is a `Source` workflow
- it should not be framed as a disconnected temporary plane-picker forever

### Browser Relationship

`SketchPlane` should not be lifted to the same level as `Sketches` in the browser.

The browser family should eventually be:
- `Content`
  - `References`
  - `Assembly`
  - `Sketches`

Inside each sketch, `SketchPlane` / `Source` should remain nested setup state.

That keeps the browser honest:
- `Sketches` is the authored content family
- `SketchPlane` is one setup surface inside each sketch

### Exposure Relationship

`SketchPlane` should help determine what the sketch preview means, but exposure belongs to the sketch, not only to the plane row.

That means:
- the sketch can be exposed with an eyeball-style action
- exposed sketch preview uses the current sketch source/setup
- `SketchPlane` is part of that preview pipeline, but it is not the whole exposure product

### Console Integration

During early `SketchPlane` viewport-pick development, the console should be treated as a first-class debugging and session-inspection surface.

This is not the long-term primary user interface.

It is a development support layer that helps us:
- inspect the active source-pick session
- confirm what the user just did
- verify that viewport picks, gizmo moves, and confirm/cancel actions are being interpreted correctly
- test the workflow quickly before every action has a polished permanent UI home

The console integration should support three kinds of behavior:

1. session tracing
- log the major steps of the active sketch-plane pick session
- examples:
  - session started
  - source candidate hovered
  - source candidate selected
  - gizmo moved
  - gizmo rotated
  - session confirmed
  - session cancelled

2. status inspection
- give the developer a readable summary of the active sketch-plane session state
- examples:
  - current source reference
  - current preview state
  - current transform values
  - whether the session is dirty/unconfirmed

3. temporary command hooks
- allow simple console commands while the workflow is still being built/debugged
- current accepted/planned examples:
  - `Enter`
    - confirm the current session
  - `x`
    - cancel / exit the current session
- later useful candidates:
  - `status`
    - print the current session summary
  - `help`
    - print the active temporary sketch-plane commands

Important rules:
- console integration is a temporary development/debugging seam first, not a replacement for the permanent `SketchPlane` UI
- console actions should mirror real session actions instead of creating a second conflicting workflow
- if a console command exists, it should trigger the same underlying session behavior as the visible UI action
- the active session trace should be readable enough that we can reconstruct what the user did while debugging viewport-pick issues

For `3.2B-2`, this means:
- the viewport-pick session should emit a readable action trace
- confirm and cancel should both be reachable from the console during development
- the console should help verify that source pick, gizmo movement, and commit/cancel semantics are stable before deeper browser or geometry-driven integration work begins

### V1 Boundary

The first implementation boundary for `SketchPlane` should be:

- `Source`
  - origin plane selection
- `Transform`
  - compact numeric controls using shared templates
- row-mode behavior
  - `collapsed / essentials / expanded`
- a path into viewport-first source picking later

V1 should not try to solve all of these at once:
- full face-pick product flow
- final browser integration depth
- final multi-sketch viewer overlay model
- final runtime transformed-plane geometry behavior

### What This Section Locks

This `Sketch plane` section locks these decisions:
- `SketchPlane` is the sketch's nested source/setup surface
- the user-facing model should be `Source + Transform`
- `ParaSelect` is the right control for discrete plane choice
- `ParaSlider` is the right control for numeric transform values
- row modes should stay meaningful and intentional
- viewport-first source picking is the right long-term direction
- `SketchPlane` stays nested under each sketch, not lifted above `Sketches`

### What Still Needs To Be Decided

This section intentionally does not fully decide:
- exactly when face-pick enters the product
- how much transform depth belongs in `essentials` versus `expanded`
- whether every current transform field should stay in v1
- the exact runtime geometry interpretation of all authored transform values
- the final browser-child layout once `Sketches` becomes a full content family

## Decisions

### 3.2b-1

- No major blocking product questions remain here.
- Treat `3.2B-1` as done for planning purposes:
  - `SketchPlane` has a real `Source + Transform` surface
  - the row has `collapsed / essentials / expanded`
  - shared `ParaSelect` / `ParaSlider` language is established
- Follow-on refinements can still happen, but they should not re-open the phase boundary.

### 3.2b-2

`3.2B-2` is now decision-complete for implementation planning. These checklist items capture the locked defaults:

#### [x] `1.` `Pick In Viewport` should stay live until the user confirms with an explicit accept action.

##### Decision
- add a confirm action in the `SketchPlane` / source-pick surface
- allow `Enter` as the keyboard confirm shortcut
- record the active pick-session steps/actions in the console so the workflow is easier to inspect while this system is still being developed

##### Suggestion
- keep confirm visible both in the compact pick surface and in the expanded `SketchPlane` context so there is one obvious completion action

#### [x] `2.` Decide the exact exit model for viewport-pick.

##### Decision
- the `X` action in the `SketchPlane` / source-pick surface exits the active pick session
- `Esc` exits the active pick session
- typing `x` in the console should also exit while this workflow is still being actively debugged/built

##### Suggestion
- treat all three exit paths as the same underlying cancel action so the session does not branch into different cleanup behavior

#### [x] `3.` Decide what controls must remain visible in the compact collapsed spaghetti-editor bar during pick.

##### Decision
- `Pick In Viewport` should force the `Spaghetti Editor` into its preset `collapsed mode`
- that `collapsed mode` should hide the body of the `Spaghetti Editor`
- the compact pick surface should reuse that remaining top bar as the visible shell during active source pick
- this specifically means the existing window-level `collapsed mode`, not the separate header-collapse behavior inside the panel

##### Suggestion
- keep the first cut narrow:
  - reuse the existing `collapsed mode` top bar
  - keep the body hidden for the duration of the pick session
  - surface only the minimum pick-session controls in that bar instead of inventing a second compact-shell system

#### [x] `4.` Decide whether the first `3.2B-2` cut allows clicking only origin planes, or also planar model faces and existing sketch geometry.

##### Decision
- keep `3.2B-2` to origin-plane picking only
- let `3.2B-3` own model-face and sketch-geometry-driven picks

##### Suggestion
- keep `3.2B-2` to origin-plane picking only
- let `3.2B-3` own model-face and sketch-geometry-driven picks

#### [x] `5.` If existing sketch geometry is allowed in `3.2B-2`, decide which geometry counts as valid.

Current options:
- whole sketch plane only
- planar profiles
- individual curves/edges

##### Decision
- defer this whole decision to `3.2B-3`
- if it must come forward later, start with whole planar references before individual curves/edges

##### Suggestion
- defer this whole decision to `3.2B-3`
- if it must come forward later, start with whole planar references before individual curves/edges

#### [x] `6.` Decide whether the sketch-origin gizmo appears immediately in the same session after the first reference is chosen, or whether the first cut commits source first and opens transform second.

##### Decision
- `3.2B-2` should use one continuous live placement session
- the user picks the initial origin plane reference
- the sketch-origin gizmo appears immediately in that same live session
- the user adjusts placement/orientation before commit
- the user confirms with `Done` or `Enter`

##### Suggestion
- show the sketch-origin gizmo immediately in the same session after the first reference is chosen
- keep source pick and first transform adjustment as one continuous viewport workflow

#### [x] `7.` Decide what transform controls belong directly in the viewport gizmo for the first cut.

Current options:
- move only
- move + rotate
- move + rotate + flip

##### Decision
- the first viewport gizmo cut should support `move + rotate`
- `Flip` should stay out of the gizmo for now
- `Flip` remains in the row/control surface until later

##### Suggestion
- first cut should support `move + rotate`
- keep `Flip` out of the gizmo for now and leave it in the row/control surface until later

#### [x] `8.` Decide whether the first viewport gizmo operates in world space only, or whether it needs a local sketch-plane space toggle immediately.

##### Decision
- keep the first cut in world space only
- defer local sketch-plane space toggles until the base pick/preview/gizmo loop feels stable

##### Suggestion
- keep the first cut in world space only
- defer local sketch-plane space toggles until the base pick/preview/gizmo loop feels stable

#### [x] `9.` Decide the minimum ghost-preview set for the first cut.

Current options:
- three origin plane boxes only
- active candidate plane fill
- active candidate grid
- axis labels / orientation cues

##### Decision
- minimum first cut should include:
  - three origin plane boxes on entry
  - active candidate plane fill
  - active candidate grid
  - basic axis/orientation cues

##### Suggestion
- minimum first cut should include:
  - three origin plane boxes on entry
  - active candidate plane fill
  - active candidate grid
  - basic axis/orientation cues

#### [x] `10.` Decide whether the preview remains visible while the user is still editing the sketch node, or only exists inside the active pick session.

##### Decision
- keep the richer ghost/source preview scoped to the active pick session only
- once the session closes, return to the normal sketch-preview model rather than leaving the picker preview half-live

##### Suggestion
- keep the richer ghost/source preview scoped to the active pick session only
- once the session closes, return to the normal sketch-preview model rather than leaving the picker preview half-live

#### [x] `11.` Decide whether the `SketchPlane` expanded row updates live while the viewport session is open, or only updates on commit.

##### Decision
- show temporary live session state in the UI while the session is open
- only commit the authored sketch-plane values when the user confirms

##### Suggestion
- show temporary live session state in the UI while the session is open
- only commit the authored sketch-plane values when the user confirms

#### [x] `12.` Decide whether `Flip` is available inside the viewport-first session in `3.2B-2`, or remains row-only until later.

##### Decision
- keep `Flip` row-only in `3.2B-2`
- add it to the viewport session later only if the move/rotate workflow proves insufficient

##### Suggestion
- keep `Flip` row-only in `3.2B-2`
- add it to the viewport session later only if the move/rotate workflow proves insufficient

#### [x] `13.` Decide whether `3.2B-2` includes true model-face picking on day one, or defers that so `3.2B-2` ships with origin-plane picking plus gizmo and `3.2B-3` owns geometry-driven picks.

##### Decision
- defer true model-face picking to `3.2B-3`
- let `3.2B-2` ship the cleaner origin-plane plus gizmo loop first

##### Suggestion
- defer true model-face picking to `3.2B-3`
- let `3.2B-2` ship the cleaner origin-plane plus gizmo loop first

#### [x] `14.` Decide whether `3.2B-2` fully replaces the current overlay-based `XY / XZ / YZ` picker, or temporarily keeps both paths alive.

##### Decision
- `3.2B-2` should expand the existing sketch-plane picker path into the newer viewport-first source-pick tool
- this newer tool should become the canonical replacement path for `Pick In Viewport`
- the product should not keep two equal long-term picker systems alive
- if a short transition period is needed during implementation, the viewport-first flow should still be the only intended user-facing direction

##### Suggestion
- treat `3.2B-2` as the replacement path for the current draggable overlay picker
- keep one canonical `Pick In Viewport` workflow so the product does not split into an older popup path and a newer viewport-first path
- if a temporary overlap is unavoidable during implementation, make the viewport-first path the only user-facing entry and treat the old overlay as transitional code only

#### [x] `15.` Decide whether the first `3.2B-2` implementation can reuse the current `sketchPlanePickSession` seam and extend it, or whether it should introduce a richer dedicated viewport-pick session model immediately.

##### Decision
- extend the existing `sketchPlanePickSession` seam first if that keeps the first cut smaller
- only introduce a separate richer session object immediately if the current shape cannot honestly represent preview, temporary transform, confirm, and cancel state
- do not let the first implementation split source-pick truth across multiple competing session models

##### Suggestion
- extend the existing `sketchPlanePickSession` seam first if that keeps the first cut smaller
- only introduce a separate richer session object immediately if the current shape cannot honestly represent preview, temporary transform, confirm, and cancel state
- do not let the first implementation split source-pick truth across multiple competing session models

Recommended default if we want to reduce risk:
- `3.2B-2` ships with origin-plane picking, compact editor collapse, live ghost plane/grid preview, immediate gizmo-based move/rotate, and explicit `Done / Cancel`
- planar-face and sketch-geometry-driven picking move to `3.2B-3`



### `3.2B-2-Cleanup Part 2` - `Real Three-Rendered Ghost Planes And Gizmo`

This section exists to plan the next cleanup pass after the first main-viewport integration.

The goal is to stop faking the origin gizmo and the three ghost origin planes with DOM/CSS overlay elements and instead render them as real viewer-owned Three content that lives in the same world/camera space as the model viewport.

This cleanup part should:
- move the origin anchor, axis cues, and three ghost origin planes into the actual viewer scene
- make those visuals rotate correctly with the camera
- keep the compact right-side sketch-plane dock as UI chrome only
- keep one canonical `sketchPlanePickSession`
- keep `Done` / `X`, `Enter` / `Esc`, and hidden console `x`

This cleanup part should not:
- expand into model-face picking
- expand into edge picking
- introduce a second picker session model
- fully generalize the transform tool for all content types

#### Locked Decisions

- reuse the existing viewer-side `TransformGizmo` path for `move + rotate`
- do not build a second custom sketch-only move/rotate gizmo
- add three new real Three-rendered ghost origin planes:
  - `XY`
  - `XZ`
  - `YZ`
- create one temporary sketch-plane preview pivot/root object in the viewer and attach the reused gizmo to that pivot
- render the origin anchor, axis cues, ghost planes, and active draft grid as real viewer-owned Three content
- keep `ViewportOverlay` responsible only for compact dock chrome, buttons, and status text
- keep `sketchPlanePickSession` as the single source of truth for draft plane, draft transform, stage, and confirm/cancel lifecycle
- use real viewer raycasting against the temporary origin-plane meshes for `XY / XZ / YZ` picking
- keep this pass origin-plane only; do not add model-face or edge picking here
- create and destroy all temporary preview objects strictly with the active pick session
- keep labels optional; if they hurt readability, rely on plane fill/edge emphasis instead
- use a dedicated sketch-plane viewer helper/module rather than burying this logic inside `ViewportOverlay`

### `3.2B-2-Cleanup Part 2A` - `Real Three Ghost Planes And Preview Pivot`

#### Summary
- replace the DOM/CSS ghost planes and origin cues with real viewer-owned Three preview content
- create the real sketch-plane preview pivot/helper set in the viewer
- do not attach the reused `TransformGizmo` yet in this subphase

#### Locked Decisions
- viewer owns all temporary sketch-plane preview visuals
- `ViewportOverlay` keeps only compact dock chrome, status, `Done`, and `X`
- `sketchPlanePickSession` stays the single source of truth
- add a dedicated viewer helper module for this work
- create one temporary sketch-plane preview pivot/root object in the viewer
- add three temporary ghost origin-plane meshes:
  - `XY`
  - `XZ`
  - `YZ`
- add lightweight axis/origin cues in the same helper set
- add a real active-plane grid/helper aligned to the selected draft plane
- use real viewer raycasting against the three plane meshes
- origin-plane only; no face/edge/model picking
- labels are optional and not required in `2A`
- helper set exists only during active `sketchPlanePickSession`

#### Implementation Changes
- add a viewer-side module, e.g. `SketchPlanePickHelper`
- create/destroy the helper from the viewer based on session lifecycle
- render:
  - preview pivot/root
  - 3 ghost plane meshes
  - axis/origin cues
  - active plane grid/helper
- map `draftPlane` from `sketchPlanePickSession` to:
  - active plane highlight
  - active grid orientation
- raycast plane clicks in the viewer and update `draftPlane`
- remove all remaining fake ghost-plane/axis rendering from `ViewportOverlay`

#### Visual Defaults
- inactive planes: faint fill, readable outline, clearly clickable
- active plane: stronger fill plus stronger edge emphasis
- grid: viewer-aligned and tied to the active draft plane
- no text labels required for the first pass if readability is weak

#### Test Targets
- starting `Pick In Viewport` creates the viewer helper set
- helper set contains preview pivot, 3 planes, and active grid/helper
- clicking `XY / XZ / YZ` updates draft plane through viewer picking
- active plane highlight updates immediately
- confirm/cancel fully tears down the helper set
- `ViewportOverlay` no longer owns ghost plane rendering

### `3.2B-2-Cleanup Part 2B` - `Reused TransformGizmo Attachment And Live Draft Transform`

#### Summary
- reuse the existing viewer `TransformGizmo` by attaching it to the temporary sketch-plane preview pivot
- drive live draft move/rotate from that viewer-owned pivot
- keep the plane-picking visuals from `2A` active while the gizmo is attached

#### Locked Decisions
- reuse the existing viewer-side `TransformGizmo`
- do not build a second sketch-specific move/rotate gizmo
- attach the reused gizmo to the temporary sketch-plane preview pivot from `2A`
- keep this pass to `move + rotate`
- keep `Flip` out
- keep confirm/cancel lifecycle unchanged:
  - `Done` / `Enter` commit
  - `X` / `Esc` / hidden console `x` cancel
- keep world-space behavior as the default for this pass
- do not generalize this into the whole-app transform architecture yet

#### Implementation Changes
- add viewer-side sketch-plane transform session wiring using the existing gizmo seam
- attach/detach `TransformGizmo` to the preview pivot only while the sketch-plane pick session is active
- map gizmo object changes back into sketch-plane draft transform state
- keep draft translation/rotation live in the viewer without committing until confirm
- keep the compact right-side dock for:
  - stage/status
  - `Done`
  - `X`
  - any remaining non-gizmo controls still needed during transition
- keep the plane-selection visuals from `2A` active while the gizmo is attached

#### Test Targets
- active pick session attaches the reused `TransformGizmo` to the preview pivot
- gizmo move updates draft translation live
- gizmo rotate updates draft rotation live
- draft transform updates do not commit authored state until confirm
- confirm commits draft plane + transform and removes helper/gizmo
- cancel removes helper/gizmo without committing
- previous `Done` / `X` / `Enter` / `Esc` / console `x` behavior still works

#### Assumptions / Defaults
- `2A` should ship before `2B`
- `2A` is implementation-ready on its own and leaves the current side move/rotate controls intact if needed temporarily
- `2B` depends on the preview pivot/helper lifecycle from `2A`
- both subphases remain origin-plane only and keep geometry-derived picking deferred to `3.2B-3`
- the current `3.2B-2-Cleanup Part 2` section should be replaced by these two sections, not kept alongside them

### `3.2B-3` - `Geometry-Driven Auto-Setup And Selection Highlighting`

- Treat `3.2B-3` as intentionally dependent on `3.2B-2`.
- Main later decisions belong here instead of blocking `3.2B-2`:
  - which geometry types are valid source references
  - how edge/curve-derived orientation is inferred
  - how hover versus committed highlight states look
  - whether sketch-derived picks and model-derived picks use identical preview styling
- If we want the first viewport-pick cut to stay implementation-safe, these should remain out of `3.2B-2`.

#### Decision list

#### [ ] `1.` Decide the first allowed geometry source types for `3.2B-3`.

##### Suggestion
- start with planar model faces and existing sketch planes/profiles only
- defer edge-only and arbitrary curved-surface picks until a later follow-on

#### [ ] `2.` Decide whether planar model faces and existing sketch-derived picks ship together or in two smaller cuts.

##### Suggestion
- if we want lower implementation risk, ship planar model faces first and add sketch-derived geometry as the second cut inside `3.2B-3`

#### [ ] `3.` Decide what minimum data a picked geometry source must provide.

##### Suggestion
- require enough information to infer:
  - origin
  - normal
  - stable in-plane orientation
- reject geometry that cannot provide those three things honestly

#### [ ] `4.` Decide how in-plane orientation is inferred when the picked source does not already expose an obvious `X` direction.

##### Suggestion
- prefer a deterministic fallback order
- if no honest stable direction exists, require one extra user correction step rather than guessing silently

#### [ ] `5.` Decide whether edge or curve picks are valid as primary sketch-plane sources or only as orientation helpers.

##### Suggestion
- treat edges/curves as later orientation helpers, not as first primary sources

#### [ ] `6.` Decide how hover, preview, selected, and committed highlight states should differ in the viewport.

##### Suggestion
- use four explicit visual states:
  - hover candidate
  - active preview source
  - committed source
  - invalid source

#### [ ] `7.` Decide whether sketch-derived picks and model-derived picks use one shared highlight language or visibly different styling.

##### Suggestion
- keep one shared highlight language first
- only add source-type-specific styling later if users actually need the distinction

#### [ ] `8.` Decide whether geometry-derived picks immediately auto-place the sketch plane and open adjust mode, or pause in a preview state first.

##### Suggestion
- preview the inferred result first, then let the user confirm and continue into adjust mode

#### [ ] `9.` Decide what happens when geometry-derived auto-setup is ambiguous.

##### Suggestion
- prefer explicit ambiguity handling:
  - show the inferred result
  - explain what is missing
  - offer one correction path
- do not silently choose a weak orientation guess

#### [ ] `10.` Decide whether model-face and sketch-derived source picks should reuse the same `sketchPlanePickSession` shape or require a richer geometry-pick payload.

##### Suggestion
- keep one canonical session seam if possible
- extend the payload with geometry-source metadata rather than forking into a second picker system

#### [ ] `11.` Decide what geometry-derived source metadata must be preserved after confirm.

##### Suggestion
- persist enough metadata to:
  - re-identify the source
  - explain the inferred setup
  - rebuild preview/highlight later

#### [ ] `12.` Decide whether `3.2B-3` includes browser-visible source provenance or keeps that hidden until later.

##### Suggestion
- keep provenance visible in the expanded `SketchPlane` surface first
- defer deeper browser exposure until the later sketch/browser phases

### `3.2B-DrawSketch`

#### `3.2B-DrawSketch-1` - `Viewer-Owned Live Draw Preview`

##### [ ] `1.` Decide the first viewport-draw tool set for the first honest Three-viewer cut.

###### Suggestion
- start with:
  - `Line`
  - `PLine`
- use `3.2B-DrawSketch-1` to prove the real viewer-owned draw session seam with the smallest honest pair of segment-based tools
- keep the behavioral split explicit:
  - `Line`
    - pick start
    - pick end
    - commit
    - command ends
  - `PLine`
    - pick start
    - pick next point
    - keep the command alive
    - each new point extends from the last endpoint until the user explicitly finishes
- defer:
  - `Rectangle`
  - `Circle`
  - `Arc3Point`
  - `BezierSpline`
  until later `Draw Sketch` cuts

##### [ ] `2.` Decide whether the active draw preview is fully viewer-owned or partly faked in overlay DOM.

###### Suggestion
- keep the active draw preview fully viewer-owned in the Three scene
- do not repeat the earlier fake-overlay pattern from the first sketch-plane prototype

##### [ ] `3.` Decide how viewport clicks are projected into sketch-local draw points.

###### Suggestion
- project viewport picks onto the current committed sketch plane
- convert those hit points into sketch-local coordinates before authoring component values
- keep the viewer preview world-space and the committed component values sketch-space

##### [ ] `4.` Decide whether `Draw Sketch` should collapse the spaghetti editor the same way `SketchPlane` viewport pick does.

###### Suggestion
- yes
- keep `Draw Sketch` as a viewport-first session and collapse the editor out of the way while the draw toolbar remains visible

##### [ ] `5.` Decide whether the first viewport-draw cut commits one entity at a time or keeps the whole draw session as one giant draft.

###### Suggestion
- commit one entity at a time
- keep only the currently in-progress entity as temporary viewer-owned draft state

##### [ ] `6.` Decide what temporary console commands should exist for `Draw Sketch` during early viewport-first development.

###### Suggestion
- keep the console seam temporary and debugging-oriented, just like early `SketchPlane`
- first useful commands should mirror real draw-session actions:
  - `line`
    - switch the active tool to `Line`
  - `pline`
    - switch the active tool to `PLine`
  - `status`
    - print the current draw-session state
  - `help`
    - print the temporary `Draw Sketch` command list
- do not let console commands become a second conflicting drawing workflow
- console commands should always trigger the same underlying tool/session actions as the visible toolbar

##### [ ] `7.` Decide whether `Draw Sketch` console commands are app-global or only valid inside resolved graph/node scope.

###### Suggestion
- `Draw Sketch` commands should eventually live inside graph/node scope, not as a totally separate top-level console system
- the intended command-depth should read more like:
  - `graph`
  - `node`
  - `sketch`
  - `draw`
- that matches the real ownership model:
  - the sketch belongs to a node
  - the node belongs to a graph
- later convenience aliases can exist, but they should be sugar on top of the deeper graph/node-scoped truth
- the temporary early `Draw Sketch` commands should already be modeled as one local command branch that can later plug into the larger app-wide console grammar instead of becoming a separate sketch-only console product

#### `3.2B-DrawSketch-2` - `Multi-Step Tool Sessions And Commit Rules`

##### [ ] `1.` Decide whether every draw tool should become an explicit multi-step state machine.

###### Suggestion
- yes
- make each tool honest about its own click progression instead of pretending all sketch tools behave like single-step placement

##### [ ] `2.` Decide the first accept/cancel keyboard model for the in-progress entity.

###### Suggestion
- `Enter`
  - for `Line`, accept the current in-progress entity when it is valid
  - for `PLine`, finish the current polyline command
- `Esc`
  - cancel the current in-progress entity or active `PLine` command without necessarily closing the whole `Draw Sketch` session
- `X`
  - still exits the overall `Draw Sketch` session

##### [ ] `3.` Decide whether the active tool stays selected after an entity is committed or resets to neutral.

###### Suggestion
- keep the active tool selected after commit
- let the user place repeated lines without re-picking the tool every time in the first cut
- let `PLine` stay active as one continuous command until the user explicitly finishes it
- extend that same rule to later tools once they enter scope

##### [ ] `4.` Decide the first honest spline progression model.

###### Suggestion
- do not pull spline into `3.2B-DrawSketch-2` unless the first `Line`-based viewer/session seam is already stable
- when spline does enter, start with click-to-add-point progression plus explicit finish
- defer deeper tangent/control-handle editing until later instead of overloading the first spline pass

##### [ ] `5.` Decide whether the toolbar should mirror the in-progress draft geometry values while the viewport session is active.

###### Suggestion
- yes, when the current tool has meaningful current-step values
- but keep those values clearly temporary until the current entity is accepted

##### [ ] `6.` Decide the first confirm/cancel/continue console verbs for active `Line` and `PLine` sessions.

###### Suggestion
- keep the first command set small and mirror the real session lifecycle:
  - `enter`
    - accept the current `Line`
    - finish the current `PLine`
  - `esc`
    - cancel the current in-progress entity or active `PLine`
  - `x`
    - exit the overall `Draw Sketch` session
  - `undo`
    - remove the last temporary `PLine` segment/point when a polyline is still in progress
- keep these as development/debug hooks first
- visible toolbar/session actions should remain the primary product surface

#### `3.2B-DrawSketch-3` - `Selection, Editing, And Richer Sketch Feedback`

##### [ ] `1.` Decide whether the first editing cut selects whole entities first or jumps immediately to per-point editing handles.

###### Suggestion
- select whole entities first
- add point/handle editing as the next layer once base selection behavior is stable

##### [ ] `2.` Decide the first hover/active/selected/invalid visual language for sketch entities in the viewer.

###### Suggestion
- use explicit distinct viewer states for:
  - hovered candidate
  - active in-progress entity
  - selected committed entity
  - invalid draft/operation

##### [ ] `3.` Decide the first snapping/inference set for viewport sketch drawing.

###### Suggestion
- start with:
  - grid
  - axis
  - endpoint
- defer midpoint/intersection/tangent inference until later follow-ons

##### [ ] `4.` Decide whether editing existing entities stays inside `Draw Sketch` or later becomes a separate toolbar/session.

###### Suggestion
- keep editing inside `Draw Sketch`
- extend the same toolbar/session rather than spawning a second competing sketch-edit surface

##### [ ] `5.` Decide whether `Draw Sketch-3` should include browser-facing entity selection/provenance or stay viewer/session-focused.

###### Suggestion
- keep `Draw Sketch-3` viewer/session-focused first
- defer deeper browser-facing entity structure to the later sketch browser/content phases

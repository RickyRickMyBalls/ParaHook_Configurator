# Sketch

## Doc Header

### Doc History
27. 2026-03-19 13:41: Added a bottom-of-file section map for the real sketch-plane toolbar parts, aligning the new placeholders to the live overlay structure with `Title Bar`, `I Menu`, `Toolbar Window`, `Sketch Plane UI`, `Plane Selection`, `Transform`, `Move`, and `Rotate`, and cleaned the new `Sketch Draw` placeholder headings to `Title Bar` / `Section`
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

# Sub-Phases

## [x] - `3.2B` - `Sketch Operation Authoring Family Map`

### Header

For this doc, treat the current shipped roadmap phase `[3.2B] Sketch Operation Authoring` as:
- `3.2B-0`

Use the next sketch follow-ons as:

### Questions / Decisions

#### [x] - `q1` Keep one clear `3.2B` family map in this doc.

##### Suggestion
- yes
- use this section as the scan-friendly phase inventory
- keep the deeper detailed planning in the later decision sections below

### Implementation Spec

- use this section to see the full sketch family at a glance
- use the later `Sketch plane` and `3.2B-DrawSketch` sections as the detailed decision surfaces

## [x] - `3.2B-0` - `Existing Sketch Operation Authoring`

### Header

Purpose:
- the already-landed first real graph-native sketch authoring cut

Owns:
- `Geometry/Sketch` as a real node
- first authored sketch components
- profile derivation
- first honest sketch review/output flow

### Questions / Decisions

#### [x] - `q1` Treat this as shipped history, not the next planning surface.

##### Suggestion
- yes
- keep it here as the baseline phase that later sketch work builds on

### Implementation Spec

- already landed
- keep this phase as the historical foundation for the later `SketchPlane` and `Draw Sketch` families

## [x] - `3.2B-SketchPlane-1` - `Source And Transform Surface`

### Header

Purpose:
- turn `SketchPlane` into a richer setup surface instead of a thin plane row

Owns:
- `Source + Transform`
- `collapsed / essentials / expanded` row behavior
- `ParaSelect` for plane choice
- `ParaSlider` for numeric transform values
- simple orientation actions like `Flip`

### Questions / Decisions

#### [x] - `q1` Treat this as the shipped row-surface foundation for later viewport-first work.

##### Suggestion
- yes
- keep later `SketchPlane` planning focused on viewport-first placement instead of reopening the basic row-surface contract

### Implementation Spec

- already landed
- this phase remains the source/setup row foundation that later viewport-first sketch-plane work builds on

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

## [ ] - `3.2B-SketchPlane-2-Cleanup` - `Main Viewport Integration And First-Pass Workflow Cleanup`

### Header

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

### Questions / Decisions

#### [ ] - `q1` Keep this cleanup phase focused on honesty and integration, not scope expansion.

##### Suggestion
- yes
- use this phase to clean up the real viewer ownership, toolbar honesty, and draft-versus-committed behavior
- do not let it absorb `3.2B-SketchPlane-3` geometry-pick scope

### Implementation Spec

### `3.2B-SketchPlane-2-Cleanup` - `Implemented Cleanup Plan`
#### `3.2B-SketchPlane-2-Cleanup` - `Main Viewport Integration And First-Pass Workflow Cleanup`

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


## [ ] - `3.2B-SketchPlane-3` - `Geometry-Driven Auto-Setup And Selection Highlighting`

### Header

Purpose:
- allow model geometry to help drive sketch-plane setup

Owns:
- click geometry to infer sketch-plane placement/orientation
- first useful edge/geometry-driven auto-setup
- viewer hover/selection highlighting
- edge-line highlight feedback
- filled/tinted selection feedback
- hover versus committed source feedback

### Questions / Decisions

#### [ ] - `q1` Use the later `### 3.2B-3` section as the detailed working decision surface for this phase.

##### Suggestion
- yes
- keep this phase centered on geometry-driven source inference and highlight language
- keep the deeper source-type questions in the later dedicated decision block

### Implementation Spec

- implementation spec should be derived from the later `### 3.2B-3` decision block once its open questions are locked
- keep this phase centered on:
  - geometry-driven source inference
  - hover / selected / committed highlight states
  - preserved geometry-source metadata

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

## [x] - `3.2B-DrawSketch-1-Cleanup` - `Viewport Draw Workflow Cleanup`

### Header

Purpose:
- clean up the first shipped `DrawSketch-1` pass so the line/polyline workflow reads as one honest drafting session in the main model viewport instead of a first-cut prototype with leftover seams

Owns:
- draw-session visual cleanup after the first viewer-owned `Line` / `PLine` cut
- toolbar wording and section cleanup for `SketchDraw`
- camera / grid / origin polish for the aligned sketch-draw view
- ghost preview readability and temporary-chain clarity
- cleanup of first-pass local console/dev seams that should stay explicitly temporary
- draft-versus-committed honesty during an active draw session

### Questions / Decisions

#### [x] - `q1` Keep this cleanup phase focused on honesty and polish, not on expanding tool scope.

##### Suggestion
- yes
- use this phase to clean up:
  - viewport drafting feel
  - toolbar/session clarity
  - preview readability
  - confirm/cancel polish
- do not let this phase absorb:
  - new draw tools
  - richer snapping/inference
  - editing of existing entities
  - browser/deeper expose work

### Implementation Spec

Implemented cleanup from the shipped `DrawSketch-1` pass:

- tightened the real viewer-owned ghost preview so `Line` and `PLine` both show honest in-progress geometry in the main viewport instead of feeling like they only appear on commit
- stabilized the draft-to-committed handoff so the ghost preview and final committed line render on the same effective sketch plane without a visible jump on second click
- removed start/end/cursor marker drift by moving the drafting markers into the sketch-plane local frame so they stay visually locked to the same surface as the drawn geometry
- kept the active aligned sketch grid centered and readable while preserving the chosen sketch-plane view as the drafting surface
- expanded the `Sketch Draw` `i Menu` with first-pass real draw-visual controls for:
  - snap on/off
  - snap distance
  - crosshair size
  - start point on/off
  - start point symbol type
  - start point symbol size
- improved start-point defaults so the first loaded drafting marker is smaller and calmer:
  - default symbol is `circle`
  - default size is reduced
  - min clamp is low enough for fine tuning
- added `PLine` point-symbol controls in the `i Menu` for:
  - on/off
  - point size
  - symbol type
- added visible historical `PLine` point markers so prior polyline points remain readable in a muted color while the active last point still reads as the live endpoint

Cleanup boundaries that were kept intact:

- no new draw tools were added
- no richer snapping/inference system was added beyond first-pass origin behavior and visibility controls
- no selection/editing of existing entities was pulled forward
- no browser/expose work was mixed into this cleanup

Result:

- `3.2B-DrawSketch-1` now reads as a more honest first drafting loop
- `3.2B-DrawSketch-2` remains the next deeper session/lifecycle phase
- `3.2B-DrawSketch-3` remains the later selection/editing/richer-feedback phase

## [ ] - `3.2B-DrawSketch-2` - `Multi-Step Tool Sessions And Commit Rules`

### Header

Purpose:
- make `Line` and `PLine` feel like real interactive command sessions instead of one-off point drops

Owns:
- start / continue / finish rules
- explicit accept / cancel behavior
- temporary entity draft state before commit
- early draw-session console command hooks

### Questions / Decisions

#### [ ] - `q1` Decide the exact finish / continue / cancel behavior for `Line` versus `PLine`.

##### Suggestion
- `Line`
  - pick start
  - pick end
  - commit
  - command ends
- `PLine`
  - pick start
  - pick next point
  - stay alive
  - `Enter` finishes
  - `Esc` cancels the live command

#### [ ] - `q2` Decide which temporary console lifecycle commands should mirror the draw session in this phase.

##### Suggestion
- use:
  - `enter`
  - `esc`
  - `x`
  - `undo`
- keep them as temporary command seams that mirror the real draw-session actions

### Implementation Spec

- detailed open questions live in the later `### 3.2B-DrawSketch` section
- first implementation should prove:
  - multi-step draft state machines
  - explicit finish / cancel rules
  - commit-on-finish behavior
  - temporary console-assisted lifecycle hooks

## [ ] - `3.2B-DrawSketch-3` - `Selection, Editing, And Richer Sketch Feedback`

### Header

Purpose:
- move beyond raw first-pass drawing into a fuller sketch authoring workflow

Owns:
- hover / selected / active draw feedback
- editing of existing sketch entities
- richer snapping and later inference aids

### Questions / Decisions

#### [ ] - `q1` Decide the first honest editing scope after raw drawing is stable.

##### Suggestion
- start with:
  - hover
  - selected
  - active
  - simple entity editing
- defer richer constraints and deeper inferencing until the raw draw session feels stable

### Implementation Spec

- detailed open questions live in the later `### 3.2B-DrawSketch` section
- first implementation should prove:
  - viewport hover / selected language
  - editing of existing line-based entities
  - richer draw feedback without overloading the first draw-session seam

## [ ] - `3.2B-4` - `Sketch Exposure And Browser Structure`

### Header

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

### Questions / Decisions

#### [ ] - `q1` Decide the first honest expose/browser cut once the core sketch interaction seams are stable.

##### Suggestion
- expose sketch preview in the viewport
- add the first `Content > Sketches` browser family
- keep this phase separate from the core `SketchPlane` and `Draw Sketch` interaction work

### Implementation Spec

- first implementation should focus on:
  - expose toggle behavior
  - viewport visibility for exposed sketches
  - first browser family structure for `Sketches`

## [ ] - `3.2B-5` - `Sketch Browser Depth And Authored Content Surfaces`

### Header

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

### Questions / Decisions

#### [ ] - `q1` Decide the first browser child surfaces once sketches already exist as a visible family.

##### Suggestion
- start with:
  - `Source`
  - `Curves`
  - `Profiles`
- leave later `Export` as a future child surface

### Implementation Spec

- first implementation should focus on:
  - browser readability
  - authored sketch-content visibility
  - child surface structure under each sketch entry

## [ ] - `3.2B-6` - `Sketch Content Ownership And Later Export`

### Header

Purpose:
- let sketch stand on its own as authored vector content, not just as a body-feature feeder

Owns:
- stronger `Sketches` content-family identity
- later vector-export direction like `.dxf`
- richer sketch-content ownership beyond the node-only editing surface

### Questions / Decisions

#### [ ] - `q1` Decide how far sketch should stand on its own as authored vector content beyond body-feature use.

##### Suggestion
- strengthen `Sketches` as a content family
- leave concrete export details like `.dxf` to a later deeper spec
- use this phase to lock the ownership direction first

### Implementation Spec

- first implementation should focus on:
  - stronger sketch-content ownership language
  - later vector-export direction
  - keeping sketch meaningful even without immediate downstream solid consumption

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


# Sketch plane
## Title Bar
## I Menu
### Toolbar Window
### Sketch Plane UI
## Plane Selection
## Transform
### Move
### Rotate

# Sketch Draw
## Title Bar
## Section
## Tool Selection
## Active Tool
## Entities

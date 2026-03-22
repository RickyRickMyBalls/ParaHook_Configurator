# Sketch

## Doc Header

### Doc History
45. 2026-03-21 23:38: Landed `[3.2B-DrawSketch-2] Multi-Step Tool Sessions And Commit Rules`, so `Line` and `PLine` now behave like real hybrid multi-step draw commands with typed `Vec2` fallback, dynamic `P1 / P2 / P3` status readout, local `Previous` / `undo`, and direct cancel-to-idle behavior instead of the older one-off point-drop flow
44. 2026-03-21 22:24: Landed `[3.2B-S7] SketchPlane Transform History`, so the sketch-plane toolbar now ships a persistent `Transform History` section with per-commit signed diff rows, `Lock` toggles, destructive `Merge History`, and matching committed viewport path segments that restore when the user re-enters `SketchPlane`
43. 2026-03-21 19:14: Added a new open `[3.2B-S8] SketchPlane Move Again Re-Arm` follow-on, locking the direction that `SketchPlane > Move` should gain a local `Move Again` choice with alias `M` so repeated whole-vector move re-entry can happen from the current committed point without backing out of the move scope
42. 2026-03-21 18:49: Split the new `[3.2B-S7] SketchPlane Transform History` direction into its own standalone future phase doc, turning the toolbar history and viewport path idea into an implementation-ready planning surface under `Future/`
41. 2026-03-21 18:46: Tightened `[3.2B-S7] SketchPlane Transform History` so the phase now explicitly records a point-to-point committed path, meaning the toolbar history and viewport lines should preserve each landed sketch-plane point in sequence rather than reading only as independent translation diffs
40. 2026-03-21 18:41: Added a new open `[3.2B-S7] SketchPlane Transform History` follow-on, locking the direction that committed sketch-plane move/transform steps should accumulate into a toolbar-visible history list plus viewport guide lines so the user can read how the plane reached its current placement from the origin and later collapse or lock parts of that path
39. 2026-03-21 13:17: Landed `[3.2B-S6] SketchPlane Move Axis Numeric Entry`, so `SketchPlane > Move > X / Y / Z` now exist as real sketch-plane child levels with float-only console entry, shared overlay activation, off-snap confirm/deny handling, and post-commit return to the parent `Move` scope
38. 2026-03-21 12:36: Reorganized the standalone sketch phase docs into `Shipped/` and `Future/` subfolders, so fully shipped phase records now live separately from open or partial follow-ons and the main `Sketch.md` can describe one cleaner status-based phase-doc structure
37. 2026-03-21 12:23: Landed the first `[3.2B-6] Sketch Content Ownership And Later Export` browser/content cut, so authored `Geometry/Sketch` nodes now surface under a real `Sketches` browser family with per-sketch authored rows that can return to the source graph node even before later vector-export work exists
36. 2026-03-21 12:06: Added a new open sketch follow-on `[3.2B-S6] SketchPlane Move Axis Numeric Entry`, locking the direction that `SketchPlane > Move > X / Y / Z` should become real child console/session levels with float-only value entry and post-commit return to `Move` instead of leaving axis motion as a shallower implied action
35. 2026-03-21 10:18: Split the sketch phase sections into standalone phase-doc copies in this same folder using the `Sketch_Phase <phase id> - <title>.md` naming pattern, so the main `Sketch.md` can stay the architecture/index surface while each execution phase now also has its own dedicated planning file similar to the newer `Radio` phase split
34. 2026-03-21 09:10: Added a clearer post-cleanup sketch continuation order after the shipped sketch-session and console-assist work, then expanded `[3.2B-SketchPlane-3] Geometry-Driven Auto-Setup And Selection Highlighting` into an implementation-ready direction grounded in the current `sketchPlanePickSession`, shared sketch command routing, and feature-assist prompt seams so the next source/setup step is easier to continue cleanly
33. 2026-03-20 00:49: Tightened `[3.2B-S4] Sketch Return One Level` into an implementation-ready spec by grounding it in the current sketch-plane and sketch-draw cancel seams, locking the first shared `returnOneLevel()` target behavior, and adding explicit current-code mapping, phase boundaries, and acceptance checks for the later shared back-step cleanup
32. 2026-03-20 00:37: Implemented the first `[3.2B-S3] SketchDraw Session Cleanup` pass in code and updated this doc to match the shipped behavior: `SketchDraw` now announces an explicit idle prompt (`Sketch Draw > [Line, PLine, X]`) instead of `Sketch Draw started`, console status reads the named draw stage directly, and idle `Esc` remains inside the durable draw session while `x` stays the explicit exit
31. 2026-03-20 00:08: Expanded the new `[3.2B-S1]` through `[3.2B-S5]` sketch hierarchy-cleanup subphases with concrete `Questions / Decisions` and `Implementation Spec` blocks, recording what is already known now about sketch-node parent scope, one-level return behavior, sketch-plane cancel/adjust flow, sketch-draw durability, and toolbar/console shared-command alignment
30. 2026-03-19 23:39: Restructured the hierarchy-cleanup vision into separate sketch cleanup subphase sections, keeping the first hierarchy-model heading and splitting the remaining vision into dedicated `Return One Level`, `SketchPlane Cleanup`, `SketchDraw Cleanup`, and `Toolbar / Console Unification` sections
29. 2026-03-19 23:31: Added a new `Hierarchy Cleanup Vision` section to the sketch architecture, defining the intended clean session/scope structure for `SketchPlane` and `SketchDraw`, clarifying that `Esc` / `Back` should return one level through shared sketch-session rules, and locking the direction that sketch feature sessions should eventually sit as explicit levels under the selected sketch-node command scope instead of remaining scattered special cases
28. 2026-03-19 23:03: Added an explicit toolbar-to-console mapping note to the sketch architecture so `SketchPlane` and `Sketch Draw` now lock the direction that toolbar sections should mirror the same command scopes, groups, and actions the console will use as those node surfaces become increasingly command-driven
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

### Post-Cleanup Continuation Order

With the sketch-local session cleanup work now shipped in:
- `[3.2B-S1]` through `[3.2B-S5]`

And the console-side assist/routing work now shipped in:
- `[4.1J]`
- `[4.1N]`

The next honest continuation order should be:
1. finish `3.2B-SketchPlane-2-Cleanup`
2. land `3.2B-SketchPlane-3`
3. return to `3.2B-DrawSketch-2`
4. only then deepen `3.2B-4` through `3.2B-6`

Reason:
- `SketchPlane` still defines the spatial contract that `SketchDraw` depends on
- the current shared sketch-session, return-one-level, and console-assist seams are now stable enough that deeper source-pick work can stay inside one command model
- browser/expose depth becomes easier to design once source semantics are honest for:
  - origin planes
  - geometry-derived setup

Important rule:
- the next continuation should not jump straight to browser depth just because the command/session cleanup family is now in good shape
- source/setup remains the right next frontier

### Phase Docs

Each sketch phase below now also has a standalone phase-doc copy in a status-based subfolder.

Naming pattern:
- `Sketch_Phase <phase id> - <title>.md`

Folder layout:
- `Shipped/`
  - fully shipped phase docs marked `[x]`
- `Future/`
  - open `[ ]` and partial `[~]` phase docs

Use `Sketch.md` as the architecture/index surface.

Use the standalone `Sketch_Phase ... .md` files when a single phase needs its own execution/planning surface.

Use `Shipped/` when you need the historical implementation record for a completed sketch phase.

Use `Future/` when you need the active planning surface for work that is still open or only partially shipped.

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

#### [x] - `q2` Decide the first qualifying geometry-source set for the first honest cut.

##### Suggestion
- locked direction:
- keep origin planes available
- add planar-face picking as the first geometry-derived source path
- do not open first-pass source inference to:
  - arbitrary edges as standalone source owners
  - vertices / points
  - curved faces
  - free multi-reference inference

Reason:
- planar faces are the first geometry class that already carries a clear sketch-plane answer:
  - plane orientation
  - stable normal
  - obvious surface highlight language
- this keeps `3.2B-SketchPlane-3` as a real source/setup follow-on instead of a general geometry-picking research phase

#### [x] - `q3` Decide whether geometry-driven setup should create a second pick/session model.

##### Suggestion
- locked direction:
- no
- geometry-derived source picking should stay inside the current `sketchPlanePickSession`
- do not invent a second `facePickSession` or separate geometry-only sketch-plane mode

Reason:
- the repo already has the right broad seams for this work:
  - one canonical `sketchPlanePickSession`
  - shared `runSketchPlaneCommand(...)`
  - shared `returnActiveSketchSessionOneLevel()`
  - shared console feature-assist descriptors for sketch-plane prompt/choice state
- this phase should deepen the pick inputs and source metadata, not replace the session model

#### [x] - `q4` Decide the first honest highlight language for geometry-derived source pick.

##### Suggestion
- locked direction:
- use three visible source states:
  - `Hover Candidate`
  - `Draft Selected Source`
  - `Committed Source`
- first-pass viewport reads should be:
  - `Hover Candidate`
    - face tint plus edge outline
  - `Draft Selected Source`
    - stronger tint plus edge outline plus candidate sketch grid/plane read
  - `Committed Source`
    - normal authored sketch preview after the session ends

Important rule:
- edge highlighting belongs here primarily as feedback around a hovered or selected planar face
- do not treat "highlighted edge" as meaning that loose edge selection itself is already a supported authored source type

#### [x] - `q5` Decide what face selection should do to the current sketch-plane session.

##### Suggestion
- locked direction:
- clicking a qualifying planar face should:
  - update draft source metadata
  - derive a draft sketch plane from that face
  - transition the existing session into `adjust`
  - keep `Move`, `Rotate`, `Back`, `Done`, `Enter`, `X`, and `Esc` working through the same current sketch-plane session verbs
- authored sketch values should still commit only on confirm

Default derivation:
- use a stable face-derived plane frame
- use a stable face-space anchor for the initial draft origin
  - default: face center / centroid unless a stronger existing face-frame seam already exists in code
- let the user refine that result immediately with the current draft move/rotate controls

#### [x] - `q6` Decide how much source metadata this phase must preserve.

##### Suggestion
- locked direction:
- preserve enough geometry-source metadata that the sketch can honestly report where the draft plane came from
- but do not block the phase on full long-term associativity or face-topology persistence

First preserved metadata target:
- source kind:
  - `origin-plane`
  - `planar-face`
- owning object/reference identity when available
- stable face key when available
- sampled face-plane frame used to derive the draft plane

Important rule:
- if stable downstream face identity is not fully trustworthy yet, this phase may still ship with:
  - authored plane + transform as the canonical committed geometry truth
  - geometry-source metadata as advisory/source-trace data
- do not stall the UX phase waiting for the final long-term parametric reattachment model

#### [x] - `q7` Decide what console/support behavior must remain aligned during this phase.

##### Suggestion
- locked direction:
- keep using the same sketch-plane command/prompt seam
- geometry-derived picking should extend session trace/status reads, not create a second console language

First new trace/status events:
- `geometry hover`
- `geometry selected`
- `draft source updated`
- `draft plane derived from face`

### Implementation Spec

Purpose:
- turn the cleaned-up viewport-first origin-plane session into one broader source-pick session that can also consume qualifying model geometry honestly

Current code-to-target mapping:
- current canonical sketch-plane session seam:
  - `sketchPlanePickSession`
- current stable depth model already exists as:
  - `stage: 'pick'`
  - `stage: 'adjust'`
- current deeper adjust scopes already exist as:
  - `adjustScope: 'root'`
  - `adjustScope: 'move'`
  - `adjustScope: 'move-snap'`
  - `adjustScope: 'rotate'`
  - `adjustScope: 'rotate-snap'`
- current draft ownership already exists as:
  - `draftPlane`
  - `previewPlane`
  - `draftTransform`
- current command/routing seams already exist as:
  - `runSketchPlaneCommand(...)`
  - `returnActiveSketchSessionOneLevel()`
- current console assist seam already exists as:
  - feature-assist prompt descriptors in `ConsoleDock`
  - staged/feature shared prefill + choice cycling from `[4.1N]`

Phase boundary:
- `[3.2B-SketchPlane-3]` should extend the current sketch-plane source session so it can derive draft setup from planar geometry
- this phase should not redesign:
  - the sketch-plane session hierarchy
  - the sketch command routing model
  - the console assist model
  - the generic viewer transform-tool architecture
  - browser/expose ownership
- those are already handled elsewhere or belong to later phases

First supported source set:
- existing origin planes:
  - `XY`
  - `XZ`
  - `YZ`
- qualifying planar model faces

Not supported yet:
- curved faces
- loose edge-as-source authoring
- point/vertex source picking
- multi-reference plane solving
- final live-associative source reattachment rules

Locked user flow:
1. user enters `Pick In Viewport`
2. the same cleaned-up sketch-plane source session opens
3. user may still choose:
   - `XY`
   - `XZ`
   - `YZ`
4. user may instead hover a qualifying planar face in the main viewport
5. hovered face shows:
   - tinted face fill
   - highlighted boundary edges
6. clicking that face updates the active draft source to `planar-face`
7. the session derives a draft sketch plane from the selected face
8. the session transitions into the existing `adjust` depth
9. the user refines the result with the existing controls:
   - `Move`
   - `Rotate`
10. `Done` or `Enter` commits the authored sketch-plane values
11. `Back`, `X`, and `Esc` continue to use the same existing sketch-plane session return/exit behavior

Ownership rule:
- face hover and face selection are pick-stage inputs into the existing sketch-plane session
- `Move` and `Rotate` remain adjust-stage tools inside that same session
- do not split "geometry pick" and "plane adjust" into separate feature products

First data/model target:
- extend the temporary session state so it can remember:
  - draft source kind
  - draft source reference metadata
  - derived face-plane frame
- keep authored sketch truth compatible with the current committed feature fields:
  - plane
  - plane transform
- if source-reference metadata is available at commit time, preserve it as source-trace metadata
- if not, still allow commit of the derived plane/transform result

Highlight language:
- `Hover Candidate`
  - face tint plus edge outline
- `Draft Selected Source`
  - stronger tint
  - stronger edge outline
  - candidate sketch grid / plane preview
- `Committed Source`
  - normal authored sketch preview after session close

Console / prompt alignment:
- keep the existing sketch-plane feature-assist descriptor as the prompt owner
- do not invent a second feature-session prompt system for geometry pick
- extend console/session tracing so the debug read can report:
  - whether the active draft source is `origin-plane` or `planar-face`
  - the currently hovered candidate when useful
  - the currently selected draft source
- shared sketch commands remain:
  - `Back`
  - `Done`
  - `Enter`
  - `X`
  - `Move`
  - `Rotate`
- geometry hover itself remains viewport-driven, not a typed console action

Implementation seams:
- extend `sketchPlanePickSession` instead of replacing it
- add viewer hit-testing for qualifying planar faces during `SketchPlane > Plane Selection`
- derive one stable draft plane frame from the selected planar face
- transition into the existing adjust/root state after selection
- keep `runSketchPlaneCommand(...)` as the owner for post-selection sketch-plane actions
- keep `returnActiveSketchSessionOneLevel()` as the owner for one-level back behavior after geometry-derived selection
- publish readable command/session trace lines when geometry-derived source state changes

Acceptance checks:
- origin-plane picking still works through the same session after this phase lands
- hovering a qualifying planar face shows a clear candidate read in the main viewport
- clicking a qualifying planar face updates draft source state and opens the existing adjust depth instead of a second special-case mode
- `Move` and `Rotate` continue to operate on draft state only
- `Back` from adjust returns to pick/selection without committing authored values
- `X` and `Esc` still cancel through the existing sketch-plane cleanup path
- `Done` and `Enter` still commit through the existing confirm path
- the session can report whether the active source came from:
  - origin-plane
  - planar-face
- no second sketch-plane pick session or second console-prompt system is introduced

Out of scope for this phase:
- non-planar geometry inference
- standalone edge source authoring
- full constraint/inference solving between multiple references
- browser/expose work
- final source associativity/rebuild behavior across topology changes

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
- `3.2B-DrawSketch-2` is now shipped as the real multi-step session/commit pass for `Line` and `PLine`
- `3.2B-DrawSketch-3` remains the later selection/editing/richer-feedback phase

## [x] - `3.2B-DrawSketch-2` - `Multi-Step Tool Sessions And Commit Rules`

### Header

Purpose:
- make `Line` and `PLine` feel like real interactive command sessions instead of one-off point drops

Owns:
- start / continue / finish rules
- explicit accept / cancel behavior
- temporary entity draft state before commit
- early draw-session console command hooks

### Implementation Spec

- shipped in runtime:
  - `Line` now commits on `P2` and returns to idle `Sketch Draw`
  - `PLine` now stays alive across progressive point entry and finishes on empty `Enter` once it has at least 2 points
  - click and typed `Vec2` submissions now share one canonical point-confirm seam
  - the top console status path now shows the current draw target like `... > P2 > Vec(N,N)` while the real input stays free for typed `Vec2`
  - `Previous` / `P` now re-arms the last used draw tool with a fresh draft
  - `undo` now removes only the last live point in the active uncommitted chain
  - `Esc` and `Back` now cancel the active tool directly back to idle `Sketch Draw`

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

## [~] - `3.2B-6` - `Sketch Content Ownership And Later Export`

### Header

Purpose:
- let sketch stand on its own as authored vector content, not just as a body-feature feeder

Owns:
- stronger `Sketches` content-family identity
- later vector-export direction like `.dxf`
- richer sketch-content ownership beyond the node-only editing surface

Current shipped cut:
- the Browser now exposes a real `Sketches` root with per-sketch child rows derived from authored `Geometry/Sketch` nodes
- those rows make sketch content visible even without immediate downstream solid consumption
- selecting or opening a sketch row returns the user to the authoring graph node instead of leaving sketch truth stranded inside node-local editing UI

Still later:
- `.dxf` export
- deeper browser child surfaces under each sketch
- fuller sketch exposure policy outside the first browser/content identity cut

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

Toolbar / command alignment rule:
- the visible sketch toolbar structure should map to the same underlying command structure the console uses
- toolbar parent surfaces like `Sketch Plane` or `Sketch Draw` should map to command scopes
- toolbar sections like `Plane Selection`, `Transform`, `Move`, `Rotate`, or `Tool Selection` should map to command groups
- concrete actions like `XY`, `XZ`, `YZ`, `Line`, `PLine`, `Enter`, `Esc`, and `X` should map to commands or valid follow-up tokens inside those scopes

Important rule:
- do not let sketch toolbar clicks and console commands drift into two separate behavior systems
- both should dispatch to the same underlying sketch-session verbs and state transitions
- the toolbar is the visible grouped control surface
- the console is the typed command surface
- both should reflect one shared sketch interaction model

For `3.2B-2`, this means:
- the viewport-pick session should emit a readable action trace
- confirm and cancel should both be reachable from the console during development
- the console should help verify that source pick, gizmo movement, and commit/cancel semantics are stable before deeper browser or geometry-driven integration work begins

### [ ]Hierarchy Cleanup Vision - `3.2B-S`

This vision should now be treated as a parent bucket with its own subphases.

Use these subphases:
- `[3.2B-S1]`
  - `Sketch Session Hierarchy Model`
- `[3.2B-S2]`
  - `SketchPlane Session Cleanup`
- `[3.2B-S3]`
  - `SketchDraw Session Cleanup`
- `[3.2B-S4]`
  - `Sketch Return One Level`
- `[3.2B-S5]`
  - `Sketch Toolbar / Console Command Alignment`
- `[3.2B-S6]`
  - `SketchPlane Move Axis Numeric Entry`
  - shipped runtime follow-on for real `Move > X / Y / Z` child levels
- `[3.2B-S7]`
  - `SketchPlane Transform History`
  - shipped runtime follow-on for persistent toolbar-visible committed move history, `Merge History`, and preserved locked path segments
- `[3.2B-S8]`
  - `SketchPlane Move Again Re-Arm`
  - open follow-on for local `Move Again` / `M` whole-move re-entry inside `SketchPlane > Move`

## [x] [3.2B-S1] - `Sketch Session Hierarchy Model`

The sketch interaction model should be cleaned up into one readable hierarchy instead of a mix of staged-console scopes, feature-local session branches, and special-case `Esc` behavior.

The intended long-term shape is:

```text
Graph
└─ Sketch node selected
   ├─ SketchPlane
   │  ├─ Plane Selection
   │  └─ Adjust
   └─ SketchDraw
      ├─ Session Idle
      ├─ Tool Selected
      └─ Draft Active
```

Important rule:
- the selected sketch node should remain the parent scope
- `SketchPlane` and `SketchDraw` should become explicit child levels under that sketch-node scope
- do not treat them as detached one-off modes that discard the parent command context

Current code-to-target mapping:
- current staged-console parent scope:
  - `graphSketchSelected`
  - this should remain the user-facing parent sketch-node scope
- current `SketchPlane` session seam:
  - `sketchPlanePickSession`
  - `pick` should map to `SketchPlane > Plane Selection`
  - `adjust` should map to `SketchPlane > Adjust`
- current `SketchDraw` session seam:
  - `geometrySketchSession`
  - `drawStage: sessionIdle`
    - maps to `SketchDraw > Session Idle`
  - `drawStage: toolSelected`
    - maps to `SketchDraw > Tool Selected`
  - `drawStage: draftActive`
    - maps to `SketchDraw > Draft Active`
  - `activeTool: null`
    - means the draw session is open with no armed tool

Phase boundary:
- `[3.2B-S1]` is only responsible for naming and locking the hierarchy
- this phase does not yet need to fully implement:
  - one-level `Esc` behavior
  - command routing cleanup
  - toolbar/console shared dispatch
- those belong to:
  - `[3.2B-S4]`
  - `[3.2B-S2]`
  - `[3.2B-S3]`
  - `[3.2B-S5]`

### Questions / Decisions

#### [x] `q1` Decide what the stable parent scope should be for sketch-local command work.

##### Suggestion
- locked direction:
- the selected sketch node should remain the stable parent scope
- `SketchPlane` and `SketchDraw` should become child levels under that selected sketch scope, not detached parallel products

#### [x] `q2` Decide whether `SketchPlane` and `SketchDraw` should be modeled as deeper levels or as unrelated modes.

##### Suggestion
- locked direction:
- treat both as deeper sketch-node levels
- this keeps prompt restoration, `Back`, and `Esc` behavior coherent

### Implementation Spec

- first cleanup pass should make the hierarchy explicit in code/doc terms:
  - `graphSketchSelected`
    - parent sketch-node scope
  - `SketchPlane`
    - `Plane Selection`
    - `Adjust`
  - `SketchDraw`
    - `Session Idle`
    - `Tool Selected`
    - `Draft Active`
- implementation should prefer explicit named levels over inferring hierarchy from scattered booleans and feature-local branches
- the first honest code target is not a global app-wide hierarchy rewrite
- the first honest code target is:
  - keep the existing selected sketch-node staged scope
  - make `SketchPlane` levels explicit against that parent
  - make `SketchDraw` levels explicit against that parent
- the first implemented state seam should read as:
  - draw session opens with:
    - `activeTool: null`
    - `drawStage: sessionIdle`
  - choosing a tool transitions to:
    - `drawStage: toolSelected`
  - beginning a draft transitions to:
    - `drawStage: draftActive`
- prompt restoration and next-step prompts should always resolve back through the selected sketch-node scope instead of skipping around it
- this phase does not require every other node family to adopt the same model yet
- success means later `Esc` / `Back` work can target named levels instead of vague local feature states

Acceptance checks:
- a reader can point to one stable parent sketch-node scope in both doc language and code language
- `SketchPlane` and `SketchDraw` are described as child levels under that parent, not as detached modes
- later phases can reference named levels directly:
  - `SketchPlane > Plane Selection`
  - `SketchPlane > Adjust`
  - `SketchDraw > Session Idle`
  - `SketchDraw > Tool Selected`
  - `SketchDraw > Draft Active`
- no additional hierarchy levels are invented in this phase unless they are needed by a real current code seam

## [x] [3.2B-S2] - `SketchPlane Session Cleanup`

`SketchPlane` should cleanly read as:
- `Sketch node selected`
  - parent scope
- `SketchPlane > Plane Selection`
  - choose `XY / XZ / YZ` or later other source references
- `SketchPlane > Adjust`
  - refine move / rotate / later other transform actions

Recommended `Esc` / `Back` behavior:
- from `Adjust`
  - return to `Plane Selection`
- from `Plane Selection`
  - cancel `SketchPlane` and return to the selected sketch-node scope

Important rule:
- do not force the user to explicitly choose `Pick Plane` versus `Transform` as a separate menu step up front
- plane selection should be the natural first level
- transform should become active after a plane/source is chosen

Current code-to-target mapping:
- current canonical session seam:
  - `sketchPlanePickSession`
  - this should remain the only source of truth for `SketchPlane`
- current stage mapping:
  - `stage: 'pick'`
    - maps to `SketchPlane > Plane Selection`
  - `stage: 'adjust'`
    - maps to `SketchPlane > Adjust`
- current console seam:
  - entering `SP` prints:
    - `Sketch Plane > [XY, XZ, YZ]`
  - direct typed `XY / XZ / YZ` already routes into `setSketchPlanePickDraftPlane(...)`
- current cancel/handoff seam:
  - canceling `SketchPlane` already restores the staged console to the selected sketch-node scope
  - viewport clicks during `SketchPlane` already keep the command context alive so camera adjustment does not collapse the session

Phase boundary:
- `[3.2B-S2]` is responsible for making the existing two-level `SketchPlane` session read cleanly and consistently
- this phase should not invent a second sketch-plane session model
- this phase does not need to redesign:
  - full toolbar/console command unification
  - generic one-level return across every sketch surface
  - face-pick or broader source families beyond the current plane-selection seam
- those belong to later work in:
  - `[3.2B-S4]`
  - `[3.2B-S5]`
  - later sketch-plane source-expansion phases

### Questions / Decisions

#### [x] `q1` Decide the first honest `SketchPlane` levels.

##### Suggestion
- locked direction:
- `Plane Selection`
- `Adjust`

#### [x] `q2` Decide what `Esc` should do from each level.

##### Suggestion
- locked direction:
- from `Adjust`
  - return to `Plane Selection`
- from `Plane Selection`
  - cancel `SketchPlane` and return to the selected sketch-node scope

#### [x] `q3` Decide whether the user should explicitly choose `Pick Plane` versus `Transform` as a separate first prompt.

##### Suggestion
- locked direction:
- no
- `Plane Selection` should be the natural entry level
- `Adjust` should become available after a plane/source is chosen

### Implementation Spec

- keep the first `SketchPlane` cleanup narrow:
  - one stable plane-selection level
  - one stable adjust level
  - one-level `Esc` return between them
  - cancel from plane-selection returns to the selected sketch-node scope
- console prompt/state should reflect whichever of those two levels is active
- clicking the viewport to adjust the camera should not collapse the active sketch-plane command context
- implementation should keep one canonical `sketchPlanePickSession` model instead of splitting plane choice, transform, and confirm/cancel into separate temporary seams
- the first honest code target is:
  - entering `SP` opens `SketchPlane > Plane Selection`
  - choosing `XY / XZ / YZ` transitions into `SketchPlane > Adjust`
  - `Adjust` owns move / rotate gizmo and draft transform edits
  - cancel from `Adjust` returns to `Plane Selection`
  - cancel from `Plane Selection` exits back to the selected sketch-node scope
- the console and overlay should both describe the same current level:
  - `Plane Selection`
    - plane choices active
    - transform controls not yet primary
  - `Adjust`
    - transform controls active
    - plane reselection still possible only through an intentional back/reopen step
- viewer interaction should remain compatible with camera movement while the sketch-plane session stays active
- success means `SketchPlane` feels like one session with two readable depths instead of several disconnected hacks

Acceptance checks:
- a reader can point to one canonical sketch-plane session seam in code:
  - `sketchPlanePickSession`
- `pick` and `adjust` are explicitly understood as:
  - `SketchPlane > Plane Selection`
  - `SketchPlane > Adjust`
- entering `SP` exposes plane-selection state first, not a separate mode chooser
- choosing `XY / XZ / YZ` advances into adjust state instead of behaving like a detached action
- cancel from plane selection returns to the selected sketch-node scope
- camera adjustment from viewport clicks does not collapse the active sketch-plane command surface
- no second sketch-plane session model is introduced in this phase

### SketchPlane Live Transform Follow-On

Now that `SketchPlane` has a cleaner session hierarchy, `Move` and `Rotate` should stop being menu-only commands and become real live viewport transform commands.

Locked direction:
- `g > s > sp > xy > move` should activate live sketch-plane translation immediately
- `g > s > sp > xy > rotate` should activate live sketch-plane rotation immediately
- child axis commands like `Move X` or `Rotate Z` should narrow that same live session to one axis only

Implementation-ready behavior:

1. `Move` activates live sketch-plane translation
- when the user confirms `Sketch Plane > Move`, the sketch-plane gizmo/origin should immediately begin a live move session
- the move should begin relative to the mouse position at activation time so the gizmo does not jump or fly away
- this should follow the same interaction lesson as the reference transform `M` flow

2. whole `Move` highlights all translation rows
- while whole `Move` is active, the `X`, `Y`, and `Z` move rows should all read as active
- that communicates that the user is moving the sketch plane freely across all three translation axes

3. `Move X` narrows the live session to one axis
- when the user goes into `Move > Move X`, only the `Move X` row should remain highlighted
- in the viewport, the gizmo should move with the mouse on the `X` axis only
- this should feel like a constrained version of the wider move session, not a detached new tool

4. `Move Y` and `Move Z` follow the same rule
- each command should highlight only its own row
- each command should constrain the viewport move session to its own axis only

5. `Rotate` mirrors the same structure
- whole `Rotate` should activate live sketch-plane rotation
- whole `Rotate` should highlight all rotation rows
- `Rotate X`, `Rotate Y`, and `Rotate Z` should each narrow the live session to a single rotation axis
- this should follow the same overall interaction pattern as the move family

Hard rules:
- do not treat `Move`, `Move X`, `Move Y`, `Move Z`, `Rotate`, `Rotate X`, `Rotate Y`, and `Rotate Z` as transcript-only commands
- each command must correspond to real live gizmo behavior in the viewport
- row highlight state and viewport constraint state must be driven from the same sketch-plane command/session truth
- entering an axis command should refine the current live transform session, not create a disconnected parallel mode

Acceptance checks:
- `Move` starts live translation without a gizmo jump
- `Move` highlights `X`, `Y`, and `Z`
- `Move X` highlights only `Move X` and constrains translation to `X`
- `Move Y` and `Move Z` behave the same way for their axes
- `Rotate` starts live rotation and highlights all rotation rows
- `Rotate X`, `Rotate Y`, and `Rotate Z` each constrain the live rotation session to their own axis

## [x] [3.2B-S7] - `SketchPlane Transform History`

Once `SketchPlane > Move` is a stable live command family, the sketch-plane toolbar should begin recording how the plane actually reached its current placement instead of only showing the latest draft/final transform.

Goal:
- let the user read the committed move path from the origin to the current sketch-plane placement
- make the toolbar and viewport explain the same transform history
- allow the user to collapse redundant intermediate diffs without losing intentionally preserved checkpoints

First user-facing shape:
- add a new collapsible `Transform History` section inside the `SketchPlane` toolbar
- every time the user commits a sketch-plane move/transform change, record the newly landed sketch-plane point as a history entry
- the first committed path still begins from the origin
- example:
  - user enters `G > S > SP > M`
  - user commits `Vec3(3,3,3)`
  - `Transform History` records that committed step and the viewport draws the corresponding path segment from the origin to that committed point

History model:
- each entry should represent one committed transform step, not a transient drag sample
- each entry should preserve the landed point reached by that committed step
- the list should be readable in order from earliest to latest
- the latest committed sketch-plane position should still remain the active final placement
- the first honest cut should focus on committed translation `Vec3` history, even if the underlying model later grows into broader sketch-plane transform history
- conceptually, this should read like a committed point chain:
  - `origin -> p1 -> p2 -> p3`
  - not like isolated unrelated values

Viewport direction:
- draw a history line for each committed segment, similar in spirit to the current live move guide line
- each line segment should connect the previously committed point to the newly committed point
- the full visible path should show how the plane got from the origin to the current final placement
- the viewport should therefore read as one accumulated polyline/path through all committed sketch-plane positions
- the active live move guide can still sit on top of that history while a new move command is in progress

Toolbar controls:
- `Transform History` should be collapsible like a normal toolbar section
- add a `Merge History` control that folds unlocked intermediate steps into accumulated diffs and leaves a shorter readable list
- merged output should still preserve the final resulting `Vec3`

Locked-entry rule:
- the user can `Lock` any history entry
- locked entries must survive `Merge History`
- collapsing should add together only the unlocked spans between preserved locked entries
- if the user locks the last committed `Vec3`, collapsing can reduce the later span entirely into that locked final entry

Implementation direction:
- build this from committed sketch-plane move acceptance, not from per-frame drag updates
- keep the history attached to the active sketch-plane placement/session truth so toolbar rows and viewport lines read from the same source
- store enough information to reconstruct the committed point chain in order, not only the latest final value
- do not let collapse delete the actual final placement; collapse is only a history presentation/aggregation action
- keep the first cut local to `SketchPlane`; later browser/export surfaces can decide if this history becomes authored sketch metadata
- the shipped first cut is implemented through persistent sketch `uiState` history, toolbar `Transform History` rows, `Lock` toggles, destructive `Merge History`, and viewer-side committed history segments

Acceptance checks:
- first committed move after entering `SketchPlane > Move` records a history step from the origin
- later committed move steps append in order and draw matching path segments
- `Transform History` can be expanded/collapsed in the toolbar
- `Merge History` reduces unlocked intermediate rows while preserving the final resulting `Vec3`
- locked entries remain visible after collapse
- viewport history lines match the visible toolbar history order

## [x] [3.2B-S3] - `SketchDraw Session Cleanup`

`SketchDraw` should be cleaned into explicit levels instead of only implicit tool/draft state:
- `Sketch node selected`
  - parent scope
- `SketchDraw > Session Idle`
  - draw session is open but no active tool is running
- `SketchDraw > Tool Selected`
  - a tool like `Line` or `PLine` is armed
- `SketchDraw > Draft Active`
  - the current tool has temporary authored points/geometry in progress

Recommended `Esc` / `Back` behavior:
- from `Draft Active`
  - clear/cancel the current draft and return to `Tool Selected`
- from `Tool Selected`
  - return to `Session Idle`
- from `Session Idle`
  - return to the selected sketch-node scope only if the product still wants `Esc` to leave `SketchDraw`
  - otherwise keep exit as explicit `X` / `Back`

Important rule:
- `SketchDraw` should feel like a durable authoring surface, not a fragile one-shot command that collapses on the first extra `Esc`

Current code-to-target mapping:
- current canonical session seam:
  - `geometrySketchSession`
  - this should remain the only source of truth for `SketchDraw`
- current stage mapping:
  - `drawStage: 'sessionIdle'`
    - maps to `SketchDraw > Session Idle`
  - `drawStage: 'toolSelected'`
    - maps to `SketchDraw > Tool Selected`
  - `drawStage: 'draftActive'`
    - maps to `SketchDraw > Draft Active`
  - `activeTool: null`
    - means the draw session is open with no armed tool
- current console seam:
  - entering `SketchDraw` now prints the explicit idle-session prompt:
    - `Sketch Draw > [Line, PLine, X]`
  - local sketch-draw commands already exist for:
    - `line / l`
    - `pline / pl`
    - `enter`
    - `esc`
    - `x`
    - `status`
    - `help`
- current cancel/handoff seam:
  - draft cancel already clears active draft state first
  - a second cancel from an armed tool now returns the draw session to idle instead of relying on the old implicit-line default
  - `Esc` from `Session Idle` now keeps `SketchDraw` open instead of exiting the session

Phase boundary:
- `[3.2B-S3]` is responsible for making the current three-level `SketchDraw` session read cleanly and consistently
- this phase should not invent a second sketch-draw session model
- this phase does not need to redesign:
  - full toolbar/console command unification
  - broad staged-console architecture changes
  - every future sketch tool family beyond the current line / pline seam
- those belong to later work in:
  - `[3.2B-S4]`
  - `[3.2B-S5]`
  - later richer `SketchDraw` tool phases

### Questions / Decisions

#### [x] `q1` Decide the first honest `SketchDraw` levels.

##### Suggestion
- locked direction:
- `Session Idle`
- `Tool Selected`
- `Draft Active`

#### [x] `q2` Decide whether entering `SketchDraw` should auto-arm a tool.

##### Suggestion
- locked direction:
- no
- entering `SketchDraw` should open the durable draw session without auto-selecting a tool

#### [x] `q3` Decide how `Esc` should step back through those levels.

##### Suggestion
- locked direction:
- from `Draft Active`
  - clear/cancel current draft and return to `Tool Selected`
- from `Tool Selected`
  - return to `Session Idle`
- from `Session Idle`
  - only leave `SketchDraw` if the product still wants that behavior; otherwise keep exit explicit

### Implementation Spec

- the first cleanup pass should make `SketchDraw` read like a durable command surface:
  - session can stay open without an armed tool
  - tool selection is explicit
  - draft state is distinct from tool selection
- avoid treating `SketchDraw` as one big anonymous mode where tool, draft, and exit behavior are all mixed together
- implementation should keep one canonical `geometrySketchSession` model instead of splitting idle state, active tool, draft state, and session exit into separate temporary seams
- the first honest code target is:
  - entering `SketchDraw` opens `Session Idle`
  - choosing `Line` or `PLine` transitions into `Tool Selected`
  - beginning point placement transitions into `Draft Active`
  - cancel from `Draft Active` returns to `Tool Selected`
  - cancel from `Tool Selected` returns to `Session Idle`
  - explicit close/exit remains separate from that one-level stepback behavior
- the console and overlay should both describe the same current level:
  - `Session Idle`
    - no armed tool
    - prompt should tell the user to choose a tool
  - `Tool Selected`
    - armed tool present
    - prompt should describe the next point/action for that tool
  - `Draft Active`
    - temporary geometry in progress
    - prompt and status should describe the live draft honestly
- viewer interaction should remain compatible with an idle draw session that has no active tool instead of silently coercing idle back to `Line`
- success means the user can enter `SketchDraw`, stay there comfortably, and use `Esc` to step back through draw depth instead of falling out of the session unexpectedly

Acceptance checks:
- a reader can point to one canonical sketch-draw session seam in code:
  - `geometrySketchSession`
- `drawStage` and `activeTool` are explicitly understood as:
  - `Session Idle`
  - `Tool Selected`
  - `Draft Active`
- entering `SketchDraw` no longer depends on a fake default `Line` tool to represent the session
- overlay and console status reads can describe idle draw state honestly
- draft cancel and tool cancel read as one-level stepback inside the same session instead of collapsing straight out of draw
- no second sketch-draw session model is introduced in this phase

## [x] [3.2B-S4] - `Sketch Return One Level`

To make the hierarchy honest:
- `Esc` should mean `return one level`
- `Back` should call the same underlying one-level return behavior
- toolbar back/cancel buttons should call that same underlying behavior when they mean “go one level up”
- explicit close/exit actions like `X` may still exist, but they should remain distinct from one-level return

Important rule:
- do not keep programming unrelated bespoke `Esc` outcomes in every sketch surface forever
- the sketch system should eventually expose one shared sketch-session `returnOneLevel()` style behavior and let:
  - keyboard `Esc`
  - console `Back`
  - toolbar `Back`
  all dispatch to it

Current code-to-target mapping:
- current parent scope:
  - `graphSketchSelected`
  - this remains the selected sketch-node parent scope that one-level return should eventually resolve back into
- current `SketchPlane` return seam:
  - `reopenSketchPlanePickPlaneSelection()`
    - already performs:
      - `SketchPlane > Adjust`
      - to `SketchPlane > Plane Selection`
  - `cancelSketchPlanePick()`
    - already performs:
      - `SketchPlane > Plane Selection`
      - to selected sketch-node scope
- current `SketchDraw` return seam:
  - `cancelGeometrySketchDrawDraft()`
    - already performs:
      - `SketchDraw > Draft Active`
      - to `SketchDraw > Tool Selected`
    - and:
      - `SketchDraw > Tool Selected`
      - to `SketchDraw > Session Idle`
  - idle draw currently stays open
    - explicit exit remains:
      - `closeGeometrySketchSession()`
      - console `x`
      - toolbar/window close
- current dispatch surfaces:
  - viewport keyboard `Escape`
    - still routes through feature-local branches
  - console typed `esc`
    - still routes through feature-local branches
  - toolbar cancel/back-style buttons
    - still call feature-local methods directly

Phase boundary:
- `[3.2B-S4]` is responsible for introducing one shared sketch-local one-level-return seam
- this phase should not replace the existing sketch session types
- this phase should not redesign:
  - app-wide console dispatcher architecture
  - toolbar / console command-group alignment as a whole
  - full workspace-surface context sync
- those belong to:
  - `[3.2B-S5]`
  - later console/workspace phases
- this phase should stay inside sketch-local behavior:
  - `SketchPlane`
  - `SketchDraw`
  - selected sketch-node handoff

### Questions / Decisions

#### [x] `q1` Decide what `Esc` should mean inside the sketch hierarchy.

##### Suggestion
- locked direction:
- `Esc` should mean `return one level`
- it should not mean `jump to root`

#### [x] `q2` Decide how `Back` should relate to `Esc`.

##### Suggestion
- locked direction:
- `Back` should call the same underlying one-level return behavior as `Esc`
- `Back` is the visible command
- `Esc` is the keyboard shortcut

#### [x] `q3` Decide whether `X` should remain distinct.

##### Suggestion
- locked direction:
- yes
- explicit close/exit actions like `X` may still exist, but they should stay distinct from one-level return

### Implementation Spec

- first cleanup pass should expose one shared sketch-local `returnOneLevel()` style action instead of continuing to answer each sketch `Esc` path independently
- the first honest code target is:
  - `SketchPlane > Adjust`
    - return one level to:
      - `SketchPlane > Plane Selection`
  - `SketchPlane > Plane Selection`
    - return one level to:
      - selected sketch-node scope
  - `SketchDraw > Draft Active`
    - return one level to:
      - `SketchDraw > Tool Selected`
  - `SketchDraw > Tool Selected`
    - return one level to:
      - `SketchDraw > Session Idle`
  - `SketchDraw > Session Idle`
    - stay in `SketchDraw` for now
    - explicit exit remains separate
- the first callers should be:
  - keyboard `Esc`
  - console `Back`
  - toolbar `Back`
- `esc` in the console may continue to call the same one-level-return seam during active sketch sessions, but visible `Back` should become the clearer command surface name
- feature-local close/cancel actions that truly mean full exit may keep separate verbs such as:
  - `X`
  - close button
  - explicit session close
- implementation should prefer one shared sketch-local reducer/action that delegates based on active sketch scope instead of copy-pasting parent-step logic into:
  - `ConsoleDock`
  - `ViewportOverlay`
  - feature-local button handlers
- success means sketch behavior no longer depends on scattered bespoke `Esc` branches to answer simple parent/child navigation

Acceptance checks:
- a reader can point to one shared sketch-local one-level-return seam in code
- `SketchPlane` and `SketchDraw` both use that seam for parent-step behavior instead of each surface inventing new `Esc` rules
- `Back` and keyboard `Esc` read as two triggers for the same underlying behavior
- explicit close/exit paths like `X` remain distinct from one-level return
- selected sketch-node scope remains the parent handoff target when sketch-local return leaves `SketchPlane`
- this phase does not introduce a second sketch session model or broaden into whole-app back-navigation architecture

## [x] [3.2B-S5] - `Sketch Toolbar / Console Command Alignment`

The toolbar structure, console structure, and sketch session structure should describe the same hierarchy.

Important rule:
- toolbar parent surfaces like `Sketch Plane` and `Sketch Draw` should map to scopes
- toolbar sections should map to command groups
- toolbar actions should map to commands or follow-up tokens
- console commands and toolbar clicks should dispatch to the same underlying sketch-session verbs

Current code truth:
- the selected sketch node already exists as a staged console scope
- `SketchPlane` already has the beginnings of explicit levels:
  - `pick`
  - `adjust`
- `SketchDraw` still has mostly implicit levels expressed through:
  - active tool
  - draft points
  - draw versus review mode
- current shared sketch-session verbs already exist in the store seam:
  - `setSketchPlanePickDraftPlane(...)`
  - `returnActiveSketchSessionOneLevel()`
  - `cancelSketchPlanePick()`
  - `setGeometrySketchSessionTool(...)`
  - `finishGeometrySketchDrawDraft()`
  - `closeGeometrySketchSession()`
- current split problem:
  - the toolbar surface in `ViewportOverlay.tsx` already calls several of those verbs directly
  - the console surface in `ConsoleDock.tsx` still hard-codes token branches like:
    - `xy / xz / yz`
    - `line / l`
    - `pline / pl`
    - `back / b / esc`
    - `x`
    - `enter`
  - that means the same sketch action still has two owner surfaces and duplicated intent knowledge

So the next cleanup direction is not a new product direction.

It is:
- formalize the already-emerging sketch levels
- reduce special-case `Esc` handling
- keep the selected sketch node as the stable parent scope
- make toolbar structure, console structure, and sketch session structure describe the same hierarchy

### Questions / Decisions

#### [x] `q1` Decide how toolbar structure should relate to console structure.

##### Suggestion
- locked direction:
- toolbar parent surfaces map to scopes
- toolbar sections map to groups
- toolbar actions map to commands or follow-up tokens

#### [x] `q2` Decide whether toolbar clicks and console commands may own separate behavior implementations.

##### Suggestion
- locked direction:
- no
- both should dispatch to the same underlying sketch-session verbs

### Implementation Spec

Purpose:
- make toolbar clicks and console commands read as two input surfaces over one sketch command model instead of parallel behavior trees

#### Current Code-To-Target Mapping

- current toolbar-side ownership lives mostly in:
  - `src/app/components/ViewportOverlay.tsx`
  - visible title-bar and section actions already call store verbs for:
    - `Back`
    - `X`
    - `Move`
    - `Rotate`
    - `Line`
    - `PLine`
    - draw finish/cancel actions
- current console-side ownership lives mostly in:
  - `src/app/console/ConsoleDock.tsx`
  - sketch-local token parsing still decides behavior in feature-specific branches
- current target:
  - toolbar and console should both resolve into one sketch command layer
  - that command layer should call the existing store verbs instead of either surface owning the real behavior

#### Scope

Owned here:
- one shared sketch command mapping layer for:
  - `SketchPlane`
  - `SketchDraw`
- explicit mapping from:
  - toolbar actions
  - console tokens
  to:
  - shared sketch-session verbs
- alignment between visible toolbar grouping and visible console prompt grouping

Not owned here:
- a whole-app generic command registry for every future feature
- freeform fuzzy command search
- redesign of staged graph navigation
- broader workspace-surface selection sync
- deep toolbar visual redesign outside what is needed to expose the shared command structure honestly

#### First Command Families To Align

`SketchPlane`
- scope:
  - `Sketch Plane`
- group:
  - `Plane Selection`
    - `XY`
    - `XZ`
    - `YZ`
- group:
  - `Session Controls`
    - `Back`
    - `X`
- group:
  - `Adjust`
    - `Move`
    - `Rotate`

`SketchDraw`
- scope:
  - `Sketch Draw`
- group:
  - `Tool Selection`
    - `Line`
    - `PLine`
- group:
  - `Session Controls`
    - `Back`
    - `X`
    - `Enter`
- group:
  - `Active Tool`
    - tool-specific status/prompt reads

Important rule:
- `Move` and `Rotate` remain subtools inside `SketchPlane > Adjust`
- `Line` and `PLine` remain tool-selection actions inside `SketchDraw`
- this phase is about command ownership alignment, not inventing new sketch hierarchy levels

#### Recommended First Implementation Cut

- add one shared sketch-command mapping seam close to the sketch/session layer
- first scope of that seam should stay narrow and explicit:
  - `SketchPlane`
    - `xy`
    - `xz`
    - `yz`
    - `back`
    - `x`
    - `move`
    - `rotate`
  - `SketchDraw`
    - `line`
    - `l`
    - `pline`
    - `pl`
    - `back`
    - `b`
    - `esc`
    - `x`
    - `enter`
- the console should submit sketch-local tokens through that shared seam
- the toolbar should call that same seam or the same underlying store verbs behind it
- do not keep `ConsoleDock` as the place that permanently owns sketch behavior branching

#### Ownership Rule

- `ViewportOverlay`
  - should own presentation, button layout, and visible grouping
- `ConsoleDock`
  - should own token submission and transcript echo
- shared sketch command layer
  - should own token-to-verb resolution for sketch-local commands
- `useSpaghettiStore`
  - should remain the owner of the real sketch-session mutations

Avoid:
- toolbar buttons directly deciding business behavior in one way while console tokens decide it in another
- prompt text and visible toolbar grouping drifting away from the real sketch command families
- adding a new toolbar row or console alias that requires copying behavior into two separate surfaces

#### Hard Rules

- do not let toolbar clicks and console tokens keep separate implementations for the same sketch action
- do not make `ConsoleDock` the permanent sketch command registry
- do not widen this phase into all-node command alignment
- do not redesign freeform command grammar here
- do not replace the current store verbs with a second sketch command state model

#### Acceptance Shape

- [x] a reader can point to one shared sketch command mapping seam in code
- [x] `SketchPlane` and `SketchDraw` both route toolbar actions and console tokens through that same mapping seam or the same underlying store verbs
- [x] `ViewportOverlay` no longer needs bespoke behavior branches for actions that also exist in console token form
- [x] `ConsoleDock` no longer needs bespoke behavior branches for actions that already exist as toolbar actions
- [x] the visible toolbar sections read like command groups for the same scope the console is describing
- [x] adding a sketch command alias or toolbar action no longer requires inventing a second behavior path for the same action

#### Shipped Summary

- `useSpaghettiStore` now exposes:
  - `runSketchPlaneCommand(...)`
  - `runGeometrySketchDrawCommand(...)`
- `ConsoleDock` now routes overlapping sketch-local console tokens through those shared sketch command seams instead of owning the real behavior branches directly
- `ViewportOverlay` now routes overlapping toolbar actions through those same shared sketch command seams for:
  - `Back`
  - `X`
  - `XY / XZ / YZ`
  - `Move`
  - `Rotate`
  - `Line`
  - `PLine`
  - `Enter`
- non-overlapping actions like `Done`, `Reset Transform`, and `Review Profiles` remain outside this phase

#### V1 Boundary

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

#### What This Section Locks

This `Sketch plane` section locks these decisions:
- `SketchPlane` is the sketch's nested source/setup surface
- the user-facing model should be `Source + Transform`
- `ParaSelect` is the right control for discrete plane choice
- `ParaSlider` is the right control for numeric transform values
- row modes should stay meaningful and intentional
- viewport-first source picking is the right long-term direction
- `SketchPlane` stays nested under each sketch, not lifted above `Sketches`

#### What Still Needs To Be Decided

This section intentionally does not fully decide:
- exactly when face-pick enters the product
- how much transform depth belongs in `essentials` versus `expanded`
- whether every current transform field should stay in v1
- the exact runtime geometry interpretation of all authored transform values
- the final browser-child layout once `Sketches` becomes a full content family


The sketch interaction model should be cleaned up into one readable hierarchy instead of a mix of staged-console scopes, feature-local session branches, and special-case `Esc` behavior.

The intended long-term shape is:

```text
Graph
└─ Sketch node selected
   ├─ SketchPlane
   │  ├─ Plane Selection
   │  └─ Adjust
   └─ SketchDraw
      ├─ Session Idle
      ├─ Tool Selected
      └─ Draft Active
```

Important rule:
- the selected sketch node should remain the parent scope
- `SketchPlane` and `SketchDraw` should become explicit child levels under that sketch-node scope
- do not treat them as detached one-off modes that discard the parent command context

# Nodes Index

## Doc Header

### Doc History
5. 2026-03-22 13:14: Added the wireable sketch-object hierarchy under `Geometry/Sketch`, locking the direction that `SketchProfiles` should be the one top-level profile output, expandable into per-profile rows, member entity references, and then deeper entity-to-point breakdown without demoting first-class composite entities like `Rectangle` and `PLine`
4. 2026-03-22 13:10: Reformatted the `Geometry Nodes` checklist into the stronger nested `inputs / outputs` shape the user started, grounding `Sketch`, `Extrude`, and planned `Loft` in the current `Spaghetti-Types` and registry contracts so the node inventory now reads more like a compact node-interface map instead of only a flat family list
3. 2026-03-22 13:06: Corrected the bottom node checklist so it now reflects the real live registry rather than only the geometry slice, adding current `Part`, `Output`, `Param`, `Primitive`, and `Utility` nodes, keeping output nodes in the main inventory, and trimming the mistaken primitive-node entries out of the `[L]` legacy list
2. 2026-03-22 13:00: Reworked the new bottom `Nodes` and `Legacy` sections into explicit checklists, separating live/planned node families from `[L]` legacy nodes and node-adjacent seams that are still present in code and should be removed later
1. 2026-03-22 12:49: Created this umbrella index for `Spaghetti-Editor-Arch/Nodes`, recording which geometry node families already have real planning surfaces, which ones are still only placeholders, and the first working inventory of shipped versus needed AutoCAD-style command growth so future node-command planning has one canonical home

### Purpose

This file is the umbrella planning index for the `Nodes` family under `Spaghetti-Editor-Arch`.

Use it to answer:
- which node families already have real planning/docs here
- which node families still need dedicated docs
- what sketch authoring commands already exist
- what AutoCAD-style commands still need to be added
- where later `Extrude` and `Loft` planning should branch

### How To Use This File

- use `Node Family Inventory` to see what is already real versus still missing
- use `Current Command Inventory` to see what the sketch node already ships
- use `Needed Command Backlog` to plan the next AutoCAD-like command waves
- use `Doc Split Follow-Ons` when deciding which missing node-family docs should be created next

### Scope Note

This doc is intentionally node-focused.

It is mainly about:
- `Geometry/Sketch`
- `Geometry/Extrude`
- `Geometry/Loft`

It is not the main home for:
- camera/view commands
- global console architecture
- browser/content hierarchy
- generic viewer gizmo architecture

Those still belong in their own canonical docs.

## Doc Body

### Short Version

Right now `Sketch` is the only geometry-node family in this folder with a real architecture/planning surface.

`Extrude` and `Loft` already exist as product directions in the roadmap, but their `Nodes/` folders are still placeholders and need dedicated family docs.

For AutoCAD-style command growth, almost all of the immediate work belongs to `Geometry/Sketch`, not to `Extrude` or `Loft`.

### Node Family Inventory

#### [x] `Geometry/Sketch`

Status:
- real node family
- real architecture doc exists
- multiple shipped and future subphase docs already exist

Canonical doc:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`

Current role:
- sketch-plane setup and transform
- sketch draw authoring
- committed sketch entity selection/delete
- later sketch browser exposure and export planning

#### [~] `Geometry/Extrude`

Status:
- roadmap family exists
- node/runtime work has shipped at the foundation level
- this `Nodes/Extrude/` folder does not yet have a dedicated node-family doc

Current gap:
- needs one `Extrude` architecture/index doc in this folder
- needs the same family split treatment `Sketch` now has

#### [ ] `Geometry/Loft`

Status:
- roadmap family exists as a later geometry follow-on
- this `Nodes/Loft/` folder does not yet have a dedicated node-family doc
- current folder is effectively a placeholder

Current gap:
- needs one `Loft` architecture/index doc in this folder
- should be planned after `Sketch` and `Extrude` are more stable

### Current Command Inventory

This is the current practical AutoCAD-like command surface that already exists or is already clearly shipped in `Geometry/Sketch`.

#### [x] Draw Commands

- `line`
- `pline`
- `rectangle`
- `rec`
- `circle`
- `cc`

#### [x] Draw Interaction Rules

- multi-step point sessions
- viewport-owned live ghost preview
- hybrid viewport plus typed input
- immediate commit after the final accepted step
- return to idle `Sketch Draw` after commit

#### [x] Entity Selection And Delete

- single-click entity selection
- blue `Window Selection`
- green `Crossing Selection`
- `delete`
- `del`
- viewport `Delete`

#### [~] Sketch-Plane Authoring Commands

This family already has real command growth, but it is not the main AutoCAD command backlog this file is tracking.

Current known shipped/planned shape includes:
- source setup
- transform / move / rotate ownership
- move-axis leaves
- transform history

Primary canonical source:
- `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md`

### Needed Command Backlog

This is the first practical inventory of what still needs to be added so `Sketch Draw` can feel much closer to AutoCAD.

The list is grouped by value and risk, not by final implementation order.

#### [ ] Tier 1 - Core Missing Commands

These are the highest-value next commands after the currently shipped `Line / PLine / Rectangle / Circle / Selection / Delete` baseline.

- endpoint snap
- move
- copy
- rotate
- mirror
- offset
- trim
- extend

#### [ ] Tier 2 - Strong Follow-On Commands

These deepen day-to-day sketch usefulness after the first modify set is stable.

- arc
- polygon
- fillet
- chamfer
- scale
- explode
- join

#### [ ] Tier 3 - Richer Drafting Commands

These are useful, but they should not block the first "honest AutoCAD-like" sketch workflow.

- ellipse
- spline
- slot
- array
- stretch
- construction line / centerline

#### [ ] Tier 4 - Selection And Snap Growth

These support the command families above and will matter once modify commands start chaining together.

- midpoint snap
- center snap
- intersection snap
- tangent snap
- perpendicular snap
- nearest snap
- quadrant snap
- additive selection
- subtractive selection
- fence selection
- select last
- select previous

### Recommended Near-Term Order

If the goal is the fewest commands that make sketching start to feel honestly CAD-like, the next best order is:

1. endpoint snap
2. move
3. copy
4. offset
5. trim
6. extend
7. rotate
8. mirror

Reason:
- snaps make the current draw commands immediately more usable
- `move / copy / offset / trim / extend` create the first real edit loop
- `rotate / mirror` are important, but they can follow once selection and modify ownership are proven

### What I Have Versus What I Need

#### What I Have

- one real `Sketch` node family doc with shipped and future phase structure
- shipped sketch draw commands for:
  - `Line`
  - `PLine`
  - `Rectangle`
  - `Circle`
- shipped sketch entity selection/delete
- placeholder `Extrude` and `Loft` node-family folders

#### What I Need

- one umbrella `Nodes` index
- one dedicated `Extrude` family doc
- one dedicated `Loft` family doc
- one growing sketch-command inventory for AutoCAD-style planning
- the first modify-command wave after the current draw baseline
- the first snap wave beyond current plain cursor projection

### Doc Split Follow-Ons

The next docs that should likely be created under this folder are:

- `Nodes/Extrude/Extrude-Index.md`
- `Nodes/Loft/Loft-Index.md`

After that, if the sketch command backlog becomes too large for `Sketch.md`, it should split into its own family index plus command-focused future docs rather than keeping every command backlog inside one giant sketch architecture file.


## Nodes

Checklist rule for this section:
- `[x]` = node family exists in code now
- `[~]` = node exists in code now but is still evolving
- `[ ]` = node family is still needed

#### Geometry Nodes

- [x] `Geometry/Sketch`
      - inputs
        - `SketchPlane`
        - `Sketch Draw`
      - outputs
        - `SketchProfiles`
      - output hierarchy
        - `SketchProfiles`
          - top-level wireable profile collection
          - expands into one wireable `SketchProfile` row per derived closed profile
        - `SketchProfile`
          - expands into referenced member `SketchEntity` rows
        - `SketchEntity`
          - base authored/derived sketch-object layer
          - concrete rows include:
            - `SketchLine`
            - `SketchCircle`
            - `SketchRectangle`
            - `SketchPLine`
            - later `SketchArc`
        - `SketchPoint`
          - leaf sketch object under line/segment expansion
          - exposes editable `Vec2`
      - structure rules
        - `Rectangle` is a first-class composite sketch entity that expands into derived child `Line` rows
        - `PLine` is a first-class composite sketch entity that expands into ordered segment rows
        - `Line` is an atomic sketch entity composed of two `Point` rows
        - child rows are derived/reference rows unless a later explicit `explode` workflow says otherwise
- [x] `Geometry/Extrude`
      - inputs
        - `SketchProfile`
        - Modifiers
          - `Depth`
          - later `Taper / Offset / Mode`
      - outputs
        - `SolidBody`
- [ ] `Geometry/Loft`
      - inputs
        - `StartProfile`
        - `EndProfile`
        - later `LoftType / RailGuide`
      - outputs
        - `SolidBody`
- [ ] `Geometry/Revolve`
- [ ] `Geometry/Sweep`
- [ ] `Geometry/Boolean`

#### Part Nodes

- [~] `Part/Baseplate`
- [~] `Part/Cube`
- [L] `Part/CubeProof`
- [~] `Part/ToeHook`
- [~] `Part/HeelKick`

#### Output Nodes

- [~] `System/OutputPreview`
- [~] `Output/Assembled`

#### Param Nodes

- [x] `Param/Number`
- [x] `Param/Boolean`
- [x] `Param/Vec2`

#### Primitive Nodes

- [x] `Primitive/Number`
- [x] `Primitive/Vec2`
- [x] `Primitive/SplineFromPoints`

#### Utility Nodes

- [~] `Utility/IdentitySpline2`
- [~] `Utility/IdentityNumberMm`

### Legacy

Checklist rule for this section:
- `[L]` = legacy and still in code, intended for later removal

- [L] `Part/CubeProof`
  - still present in code and older planning surfaces as a proof-path part node

- [L] `toeLoft`
  - not a node family, but still a live legacy output-type seam in ports/compiler/tests and should be removed once graph-native solid-body output typing fully replaces it

# Nodes Index

## Doc Header

### Doc History
14. 2026-03-22 14:04: Moved the planned `Flip` boolean in the `Geometry/Sketch` input tree so it now hangs directly under `Plane` instead of under `Transform`, keeping the sketch-plane hierarchy aligned with the intended surface layout where plane orientation owns the flip toggle while `Transform` stays focused on `Vec3` motion channels
13. 2026-03-22 14:00: Renamed the local `Nodes-Index.md` phase ladder to match the roadmap-owned `[3.2A-1]` through `[3.2A-4]` naming, so the node-family planning surface now lines up directly with the `3.2A` mini-family in `roadmap.md` instead of still using generic `Phase 1` through `Phase 4` headings
12. 2026-03-22 14:00: Broke the `Nodes-Index.md` direction into a four-phase rollout under `## Phases`, using the fewest safe phases that still separate the shared `EWR` foundation, the first `Geometry/Sketch` vertical slice, the downstream geometry-node family follow-ons, and the later node-family cleanup/legacy migration work while adding explicit `Questions / Decisions` plus `Suggestion` blocks for each phase
11. 2026-03-22 13:49: Reworked the full `Geometry Nodes` section into a cleaner EWR-first structure, grouping each geometry node by `inputs`, `outputs`, and the relevant expandable internal hierarchy so the section now reads like one coherent wireable-node family map instead of an accreted sequence of local edits
10. 2026-03-22 13:43: Added the new `Expandable Wireable Rows` (`EWR`) terminology to this node index, locking the user-facing name for the expandable pin-bearing row hierarchy and pairing it with the code-facing `WireableRowNode` / `WireableRowTree` naming so future node/tree planning can use one consistent term
9. 2026-03-22 13:36: Expanded the `SketchPlane > Transform` input tree so it now reflects the locked 3D structure: `Transform` as the parent 3-channel block, `Move` and `Rotate` as expandable `Vec3` rows with `X / Y / Z` float children, later `Scale` as another `Vec3`, and `Flip` as a `Boolean`
8. 2026-03-22 13:31: Expanded the simplified sketch leaf structure again so `Vec2` no longer stays opaque, locking the direction that a `SketchPoint` row may expand into `X` and `Y` float children for direct wiring and parameter editing
7. 2026-03-22 13:29: Expanded the simplified `Geometry/Sketch` input side so `SketchPlane` and `Sketch Draw` now break down into clearer nested substructure, making the sketch-node contract read more like one compact input/output tree instead of a flat input label pair
6. 2026-03-22 13:26: Expanded the simplified `Geometry/Sketch` hierarchy example so `SketchLine`, `SketchCircle`, `SketchRectangle`, and `SketchPLine` each now have a clearer internal breakdown, making the row tree read more like a real expandable wireable object structure instead of only a shallow type list
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

#### Expandable Wireable Rows

- `Expandable Wireable Rows`
  - short form: `EWR`
  - user-facing term for rows that:
    - can expand into child rows
    - can expose output pins
    - may represent either wireable objects or primitive values

- code-facing term:
  - `WireableRowNode`

- grouped tree/model term:
  - `WireableRowTree`

- row kinds inside this model:
  - `object rows`
    - examples:
      - `SketchProfile`
      - `SketchLine`
      - `SketchPoint`
  - `value rows`
    - examples:
      - `Vec2`
      - `Vec3`
      - `Float`
      - `Boolean`

- recommendation for the first cut:
  - treat the current `Geometry/Sketch` attached input/output rows as the first `EWR` proving slice, not as the final generalized framework
  - extract the shared row contract first at the data/model level
  - keep sketch-owned behaviors like `Draw`, plane-pick flow, and review ownership outside the base `EWR` shape
  - do not force `Extrude` or non-geometry families onto `EWR` until `SketchPlane`, `Sketch Draw`, and `SketchProfiles` all fit one honest row-tree path

#### Geometry Nodes

- [x] `Geometry/Sketch`
  - inputs
    - `SketchPlane`
      - `Plane`
        - `Flip` = `Boolean`
      - `Transform`
        - `Move` = `Vec3`
          - `X` = `Float`
          - `Y` = `Float`
          - `Z` = `Float`
        - `Rotate` = `Vec3`
          - `X` = `Float`
          - `Y` = `Float`
          - `Z` = `Float`
        - later `Scale` = `Vec3`
          - `X` = `Float`
          - `Y` = `Float`
          - `Z` = `Float`
      - later `Source`
        - `Origin Plane`
        - `Planar Face`
    - `Sketch Draw`
      - `Line`
      - `PLine`
      - `Rectangle`
      - `Circle`
      - later `Selection`
      - later `Snaps`
  - outputs
    - `SketchProfiles`
  - EWR output tree
    - `SketchProfiles`
      - `SketchProfile`
        - `SketchEntity`
          - `SketchLine`
            - `Point A` = `SketchPoint`
              - `SketchPoint` = `Vec2`
                - `X` = `Float`
                - `Y` = `Float`
            - `Point B` = `SketchPoint`
              - `SketchPoint` = `Vec2`
                - `X` = `Float`
                - `Y` = `Float`
          - `SketchCircle`
            - `Center` = `SketchPoint`
              - `SketchPoint` = `Vec2`
                - `X` = `Float`
                - `Y` = `Float`
            - `Radius` = `Float`
          - `SketchRectangle`
            - `SketchLine`
              - `Point A` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
              - `Point B` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
            - `SketchLine`
              - `Point A` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
              - `Point B` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
            - `SketchLine`
              - `Point A` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
              - `Point B` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
            - `SketchLine`
              - `Point A` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
              - `Point B` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
          - `SketchPLine`
            - `SketchLine`
              - `Point A` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
              - `Point B` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
            - `SketchLine`
              - `Point A` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
              - `Point B` = `SketchPoint`
                - `SketchPoint` = `Vec2`
                  - `X` = `Float`
                  - `Y` = `Float`
            - later `SketchArc`
  - structure rules
    - `Rectangle` remains a first-class composite entity that expands into derived child `SketchLine` rows
    - `PLine` remains a first-class composite entity that expands into ordered segment rows
    - `Line` remains an atomic entity made of two `SketchPoint` rows
    - child rows are derived/reference layers unless a later explicit `explode` workflow exists
- [x] `Geometry/Extrude`
  - inputs
    - `SketchProfile`
    - `Modifiers`
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
  - inputs
    - `SketchProfile`
    - `Angle`
    - `Axis`
  - outputs
    - `SolidBody`
- [ ] `Geometry/Sweep`
  - inputs
    - `SketchProfile`
    - `Path`
    - later `Twist / Frenet / Guide Controls`
  - outputs
    - `SolidBody`
- [ ] `Geometry/Boolean`
  - inputs
    - `TargetBody`
    - `ToolBody`
    - `Mode`
      - `Union`
      - `Cut`
      - `Intersect`
  - outputs
    - `SolidBody`

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


## Main Questions / Decisions

### [ ] - `Q1` - Should `Geometry/Sketch` use separate top-level `EWR` roots for `SketchPlane`, `SketchDraw`, and `SketchProfiles` rather than one parent `Sketch` `EWR` that contains all three?

#### Suggestion

Yes. Keep `Geometry/Sketch` as the node shell, and make `SketchPlane`, `SketchDraw`, and `SketchProfiles` separate top-level `EWR` roots. Do not create one parent `Sketch` `EWR` that mixes those three under a single expandable row, because that would blur input/output ownership and make pin direction less honest. The current sketch row work should still be treated as the first proving slice for the shared `EWR` contract rather than the final generalized framework.

### [ ] - `Q2` - Should `EWR` stay sketch-first until `SketchPlane`, `Sketch Draw`, and `SketchProfiles` all fit the same row-tree contract?

#### Suggestion

Yes. Keep `EWR` sketch-first until those three surfaces all fit one honest row-tree path with acceptable expand/collapse behavior, child ordering, and pin exposure. Do not branch into `Extrude`, `Loft`, or non-geometry families before that proof exists.

### [ ] - `Q3` - Should the first `EWR` phase lock only the shared row contract, or should it also absorb sketch-specific workflow ownership like `Draw`, plane picking, and review?

#### Suggestion

Lock only the shared row contract in the first phase. The base `EWR` type should own generic row concerns like hierarchy, labels, optional pins, and ordering, while sketch-specific workflow ownership stays outside the base model and plugs into it through sketch-owned actions or row content.

### [ ] - `Q4` - Should the first `EWR` contract support both object rows and primitive value rows from day one?

#### Suggestion

Yes. The first contract should support both object rows and primitive value rows immediately. Without that, the row tree cannot honestly represent the intended sketch hierarchy where objects like `SketchPoint` expand into value layers like `Vec2 -> X / Y Float`.

### [ ] - `Q5` - Should downstream geometry nodes consume child sketch rows from the `EWR` hierarchy rather than relying on duplicated top-level outputs?

#### Suggestion

Yes. The long-term direction should be that downstream geometry nodes consume child rows from the `EWR` hierarchy, especially `SketchProfile` rows under `SketchProfiles`, instead of depending on duplicated top-level outputs that split the source of truth.




## Phases

### [ ] [3.2A-1] - EWR Foundation And Shared Row Contract

- [ ] lock the shared `Expandable Wireable Rows` (`EWR`) vocabulary
- [ ] define one base `WireableRowNode` / `WireableRowTree` shape for:
  - object rows
  - value rows
  - expandable child rows
  - optional output pins
- [ ] lock the primitive value-row set for the first wave:
  - `Float`
  - `Boolean`
  - `Vec2`
  - `Vec3`
- [ ] define the base row behaviors:
  - expand / collapse
  - label
  - pin exposure
  - child ordering
- [ ] keep this phase contract-first:
  - shared row data/model
  - shared row behavior rules
  - no sketch-specific draw/review workflow ownership in the base type
- [ ] keep this phase framework-only and avoid pulling full sketch authoring behavior into the same cut

#### [ ] - `q1` Should every EWR row type be wireable by default, or should some rows be display-only?

##### Suggestion

Make every EWR row wireable by default unless there is a strong reason not to. That keeps the mental model simple: if the row exists in the tree, it can expose a pin.

#### [ ] - `q2` Should the first row-tree contract support both object rows and primitive value rows from day one?

##### Suggestion

Yes. Do not ship an object-only tree first. The whole point of the deeper hierarchy is that objects like `SketchPoint` can expand into primitive value rows like `Float`.

#### [ ] - `q3` Should the first EWR implementation live inside geometry-node surfaces only?

##### Suggestion

Yes. Start with geometry-node surfaces. Do not try to generalize the same row-tree into every node family before the geometry path proves the model.

#### [ ] - `q4` Should the current `Geometry/Sketch` row work be treated as the reusable system already, or as the first proving slice for it?

##### Suggestion

Treat it as the first proving slice. The current sketch row work is valuable because it exposes the right pressure, but it should not be mistaken for the final shared framework yet. Extract the common row contract in this phase, then let the first real reuse happen through the sketch tree instead of through premature cross-family generalization.

### [ ] [3.2A-2] - Geometry Sketch EWR Vertical Slice

- [ ] ship the first honest `Geometry/Sketch` EWR tree
- [ ] expose `SketchPlane` and `Sketch Draw` as expandable input rows
- [ ] expose `SketchProfiles` as the one top-level profile output row
- [ ] expand `SketchProfiles` into per-profile rows
- [ ] expand profile rows into member `SketchEntity` rows
- [ ] expand entity rows into:
  - `SketchLine`
  - `SketchCircle`
  - `SketchRectangle`
  - `SketchPLine`
- [ ] expand point/value leaves:
  - `SketchPoint -> Vec2 -> X / Y Float`
- [ ] keep composite-versus-atomic rules honest:
  - `Rectangle` and `PLine` stay first-class composite entities
  - `Line` stays atomic
- [ ] use this phase to prove one shared row path across:
  - `SketchPlane`
  - `Sketch Draw`
  - `SketchProfiles`
- [ ] do not expand beyond `Geometry/Sketch` until those three surfaces fit the same contract cleanly

#### [ ] - `q1` Should `Geometry/Sketch` keep only one top-level profile output row?

##### Suggestion

Yes. Keep `SketchProfiles` as the one top-level profile output. Let the per-profile rows live underneath it as expandable child EWR rows instead of exposing a second top-level selected-profile output by default.

#### [ ] - `q2` Should profile-member entity rows be editable there, or only reference/navigate back to the authored entity rows?

##### Suggestion

Keep them reference-first in the first cut. They should be inspectable, highlightable, and wireable, but editing ownership should stay in the authored entity rows under the sketch tree.

#### [ ] - `q3` Should `SketchPlane > Transform` use full 3D value rows from the first EWR slice?

##### Suggestion

Yes. Keep `Transform` focused on `Move`, `Rotate`, and later `Scale` as `Vec3 -> X / Y / Z Float`, while `Plane` owns the separate `Flip` boolean. That keeps the row tree aligned with the intended surface layout instead of mixing the orientation toggle into the motion channels.

#### [ ] - `q4` What should count as the exit condition before `EWR` expands into downstream geometry nodes?

##### Suggestion

Do not branch into `Extrude`, `Loft`, or non-geometry adoption until `SketchPlane`, `Sketch Draw`, and `SketchProfiles` are all running through the same honest row-tree contract with acceptable expand/collapse behavior, pin exposure, and child ordering. `Geometry/Sketch` should prove the model first.

### [ ] [3.2A-3] - Downstream Geometry Node Hierarchy Expansion

- [ ] give `Geometry/Extrude` a real EWR-shaped contract
- [ ] create the first real `Geometry/Loft` family contract
- [ ] define `Geometry/Revolve`, `Geometry/Sweep`, and `Geometry/Boolean` as later geometry-node follow-ons with explicit input/output rows
- [ ] keep downstream geometry consumers wired around:
  - `SketchProfile`
  - `SolidBody`
- [ ] create dedicated family docs for:
  - `Nodes/Extrude/Extrude-Index.md`
  - `Nodes/Loft/Loft-Index.md`

#### [ ] - `q1` Should downstream geometry nodes consume child `SketchProfile` rows directly rather than a second top-level sketch-profile output?

##### Suggestion

Yes. Let downstream nodes consume the child `SketchProfile` rows exposed under `SketchProfiles`. That matches the EWR hierarchy and avoids duplicating profile truth at the sketch-node top level.

#### [ ] - `q2` Should `Extrude` stay the only shipped downstream geometry consumer before `Loft` starts?

##### Suggestion

Yes. Keep `Extrude` as the first real downstream geometry consumer. Make `Loft` the next one only after the `SketchProfiles -> SketchProfile -> SolidBody` path is stable.

#### [ ] - `q3` Should `Revolve`, `Sweep`, and `Boolean` stay planning-only in this phase?

##### Suggestion

Yes. Give them explicit contracts in the doc, but do not force implementation in the same wave as `Extrude` and `Loft`.

### [ ] [3.2A-4] - Registry Alignment And Legacy Cleanup

- [ ] align the real registry/read surfaces to the newer node-family planning language
- [ ] keep `Output` nodes in the live inventory:
  - `System/OutputPreview`
  - `Output/Assembled`
- [ ] review how far non-geometry families should adopt EWR:
  - `Part`
  - `Output`
  - `Param`
  - `Primitive`
  - `Utility`
- [ ] clean up or retire legacy seams:
  - `Part/CubeProof`
  - `toeLoft`
- [ ] prune overlap between:
  - `Nodes-Index.md`
  - `Spaghetti-Types.md`

#### [ ] - `q1` Should non-geometry node families adopt full EWR in the same shape as `Geometry/Sketch`?

##### Suggestion

Not immediately. Let geometry prove the row model first. Then adopt EWR selectively where the hierarchy actually helps instead of forcing every node family into the same depth.

#### [ ] - `q2` Should `toeLoft` be treated as a real legacy-migration target in this family?

##### Suggestion

Yes. Keep it explicitly marked `[L]` until graph-native body typing fully replaces it in ports, validators, and downstream wiring.

#### [ ] - `q3` When should `Spaghetti-Types.md` stop acting like the old umbrella node index?

##### Suggestion

After `Extrude-Index.md` and `Loft-Index.md` exist and the geometry-family docs are stable enough that `Spaghetti-Types.md` can go back to being primarily a vocabulary/type-system bridge instead of carrying overlapping node-family planning.

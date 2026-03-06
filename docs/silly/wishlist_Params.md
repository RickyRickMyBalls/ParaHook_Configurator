# Node Wishlist

This file is the canonical wishlist for node types.

## Change-PARAM Log

### [001] 2026-03-04 01:00 (Initialized Change-PARAM Log)
- Added top-level parameter-change tracking section.
- Use this section for parameter wishlist changes, naming, ranges, defaults, or semantics.

Update rule:
- Whenever a node type is added to this wishlist, add a new entry in the `Change Log` section below.
- Keep the complete canonical list in `Full Node List (Canonical)` at the bottom.

## Change Log

### [002] 2026-03-04 01:07 (Added TODO List Above Canonical Value Nodes)
- Added a `TODO List` section at the top of `Full Node List (Canonical)`.
- Added items:
  - `Baseplate`
  - `ToeHook`
  - `HeelKick`
  - `BasePlateBuilder`
  - `Output`

### [001] 2026-03-04 00:46 (Wishlist Structure + Initial CAD Additions)
- Added in-document changelog protocol.
- Added roadmap-oriented categories and dependency ideas.
- Added candidate nodes:
  - `Constraint/Coincident`
  - `Constraint/Horizontal`
  - `Constraint/Vertical`
  - `Constraint/Distance`
  - `Constraint/Angle`
  - `Plane`
  - `SketchPlane`
  - `DatumAxis`
  - `DatumPoint`

## Near-Term Focus (Suggested)

Priority 1 (foundation):
- `Number`
- `Boolean`
- `Vec2`
- `Parameter`
- `Add`
- `Subtract`
- `Multiply`
- `Divide`
- `Clamp`

Priority 2 (first real feature chain):
- `Sketch`
- `Line`
- `Rectangle`
- `ProfileLoop`
- `Extrude`
- `Body`

Priority 3 (CAD maturity):
- `Fillet`
- `Chamfer`
- `Revolve`
- `Loft`
- `Sweep`
- `Union`
- `Intersect`
- `Subtract`

## Full Node List (Canonical)

TODO LIST
---------
Baseplate
ToeHook
HeelKick
BasePlateBuilder
Output

VALUE NODES
-----------
Number
Boolean
Vec2
Vec3

PARAM / DRIVER NODES
--------------------
Parameter
Add
Subtract
Multiply
Divide
Clamp
Remap

GEOMETRY DATA NODES
-------------------
Spline2
Spline3
ProfileLoop
Stations

REFERENCE / DATUM NODES
-----------------------
Plane
SketchPlane
DatumAxis
DatumPoint

SKETCH NODES
------------
Sketch
Line
Arc
Circle
Rectangle
Point

SKETCH CONSTRAINT NODES
-----------------------
Constraint/Coincident
Constraint/Horizontal
Constraint/Vertical
Constraint/Distance
Constraint/Angle

FEATURE NODES
-------------
Extrude
Revolve
Loft
Sweep
Hole
Fillet
Chamfer
Shell

BOOLEAN NODES
-------------
Union
Subtract
Intersect

TRANSFORM NODES
---------------
Translate
Rotate
Scale
Mirror
Pattern

PART / PRODUCT NODES
--------------------
Part
FeatureStack
Body

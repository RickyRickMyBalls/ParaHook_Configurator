# 01.0 - Master Spaghetti

## Doc History
1. 2026-03-06 01:27: Added a master inventory of the main Spaghetti editor elements and the current node types that can be spawned on the canvas
2. 2026-03-06 01:27: Created the doc

## Purpose

This is the master inventory doc for the Spaghetti Editor.

Use it to answer:
- what things exist inside the editor
- what the major element types are
- what kinds of nodes exist right now
- what can currently be spawned on the canvas

This is not the deep explanation doc for every concept yet.

It is the "what exists?" map.

## Main Things Inside The Spaghetti Editor

These are the main element groups you currently need to identify.

### Canvas

The main workspace where nodes are placed and connected.

It contains:
- node boxes
- wires
- ports
- edge routes
- selection state
- node position/layout

### Nodes

The main typed boxes in the graph.

A node can be:
- a part node
- a param/value node
- a system node
- a primitive/helper node
- a utility/identity node

### Wires

These are the graph connections between node outputs and node inputs.

In code terms, these are edges.

A wire connects:
- a source node output port
- to a target node input port

### Ports

Ports are the input/output connection points on a node.

Port types currently include:
- `number`
- `boolean`
- `vec2`
- `vec3`
- `spline2`
- `spline3`
- `profileLoop`
- `stations`
- `railMath`
- `toeLoft`

### Parts

These are the nodes that represent actual buildable/generated part definitions.

Current part node family:
- `Part/Baseplate`
- `Part/Cube`
- `Part/CubeProof`
- `Part/ToeHook`
- `Part/HeelKick`

These matter most because they can feed the build pipeline and eventually become built outputs.

### Feature Stack

Feature Stack lives inside part nodes.

It is not a separate canvas node system.

Right now the important internal feature operations are:
- sketch
- extrude

Feature Stack belongs to the part node's internal data and UI, not to nested graph nodes.

### Output Preview

This is the system node that maps built/source parts into preview slots.

Current system node:
- `System/OutputPreview`

This is about preview routing, not geometry generation.

### Params

These are explicit value nodes used to feed values into part nodes or other nodes.

Current param node family:
- `Param/Number`
- `Param/Boolean`
- `Param/Vec2`

### Selection / Interaction State

The editor also has interaction-level elements, even though they are not graph nodes themselves.

Examples:
- selected node
- selected edge
- hovered edge
- connection drag state
- edge waypoints

## Node Families

These are the current node families in the registry.

### Part Nodes

- `Part/Baseplate`
- `Part/Cube`
- `Part/CubeProof`
- `Part/ToeHook`
- `Part/HeelKick`

### System Nodes

- `System/OutputPreview`
- `Output/Assembled`

### Param Nodes

- `Param/Number`
- `Param/Boolean`
- `Param/Vec2`

### Primitive Nodes

- `Primitive/Number`
- `Primitive/Vec2`
- `Primitive/SplineFromPoints`

### Utility Nodes

- `Utility/IdentitySpline2`
- `Utility/IdentityNumberMm`

## Current Build-Oriented Part Nodes

These are the current major part nodes you will probably ask the most questions about.

### Baseplate

Node type:
- `Part/Baseplate`

What it is:
- the base plate / base shape part node

### Cube

Node type:
- `Part/Cube`

What it is:
- a simple cube part node used as a basic build/preview part

### Cube Proof

Node type:
- `Part/CubeProof`

What it is:
- a proof/test-style cube node
- not intended as a normal user-addable node

### Toe Hook

Node type:
- `Part/ToeHook`

What it is:
- the toe-hook part node

### Heel Kick

Node type:
- `Part/HeelKick`

What it is:
- the heel-kick part node

## Things You Can Spawn On The Canvas Right Now

This is the most important practical list.

These are the current user-addable node types from the node registry.

### Spawnable Part Nodes

- `Part/Baseplate`
- `Part/Cube`
- `Part/ToeHook`
- `Part/HeelKick`

### Spawnable Param Nodes

- `Param/Number`
- `Param/Boolean`
- `Param/Vec2`

### Spawnable Primitive Nodes

- `Primitive/SplineFromPoints`

### Spawnable Utility Nodes

- `Utility/IdentitySpline2`
- `Utility/IdentityNumberMm`

## Nodes That Exist But Are Not Normal User-Spawns

These exist in the system, but are not normal user-addable nodes.

- `Part/CubeProof`
- `System/OutputPreview`

Likely meaning:
- `CubeProof` is a proof/testing/internal node
- `OutputPreview` is a system-owned node rather than a normal user toolbox node

## Practical Question Categories

If you want to understand the editor better, the next useful question groups are:

- what is a node?
- what is a wire?
- what is a port?
- what is a part node?
- what is the Feature Stack?
- what is `OutputPreview`?
- what is the difference between `Param/*`, `Primitive/*`, and `Utility/*`?
- what is build identity vs preview identity?
- how does a part node become a previewed/rendered result?

## Suggested Next Docs

If you want to keep splitting this master doc into focused follow-ups, the next good docs are:

- `01.1 - Wires.md`
- `01.2 - Ports.md`
- `01.3 - Feature Stack.md`
- `01.4 - Nodes.md`
- `01.5 - Output Preview.md`
- `01.6 - Parts.md`
- `01.7 - Param Nodes.md`
- `01.8 - Canvas Interaction.md`

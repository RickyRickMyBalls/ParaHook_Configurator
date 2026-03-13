# 01.0 - Master Spaghetti

## Doc History
1. 2026-03-12 15:05: Reworked this doc so it reflects the shipped multi-graph workspace architecture after `SP - Phase 11`, `SP - Phase 12`, `2.1A`, and `2.1B`, instead of reading only like an early node inventory
2. 2026-03-06 01:27: Added a master inventory of the main Spaghetti editor elements and the current node types that can be spawned on the canvas
3. 2026-03-06 01:27: Created the doc

## Purpose

This is the current high-level architecture map for the Spaghetti Editor.

Use it to answer:
- what the Spaghetti workspace is made of now
- how graph documents, editor viewports, Browser rows, and the shared viewer relate
- what data is graph-owned versus Browser-local versus project-owned
- what kinds of nodes currently exist
- what can currently be added through the canvas versus the simpler toolbar quick-add

This is no longer just a node list.

It is the current "what exists, and how the pieces fit together?" doc.

## Current Architecture Layers

The Spaghetti Editor is now bigger than one canvas.

The main layers are:
- graph documents
- editor viewports
- the graph canvas
- the node registry and node families
- part-internal Feature Stack editing
- graph runtime state
- graph-owned published output surfaces
- the Browser workspace
- the shared viewer

## Graph Documents

Graph documents are now the main authored graph unit.

Each graph document has:
- a `graphDocumentId`
- a name
- one graph payload
- graph-local runtime state
- graph-local published output state

Important rule:
- the app is no longer built around one implicit graph
- multiple graph documents can exist at once

## Editor Viewports

Editor viewports are the windows/surfaces that open graph documents for editing.

An editor viewport:
- is bound to one graph document at a time
- can be focused independently
- can be opened multiple times across different graph documents
- is not the same thing as Browser selection

Important rule:
- focused editor viewport state is meaningful, but it is not the only workspace target anymore

## Browser Workspace

The Browser is now part of the Spaghetti architecture, not just a side list.

Current first-pass Browser structure:
- `Project`
- `Content`
- `Graph Documents`
- `Open Viewports`

Current important Browser row types:
- graph-document rows
- published graph-output rows
- viewport rows

Graph-document rows:
- can expand/collapse
- show saved/dirty state
- show open/focused viewport state
- own one thin published-output child level

Published-output child rows:
- come from graph-owned publication state
- are not yet project-owned `Component / Object / Part` rows
- show `resolved`, `unresolved`, or `empty` publication state

Viewport rows:
- represent currently open editor viewports
- expose explicit viewport focus/close actions

Important truth boundary:
- Browser row truth about graphs and published outputs comes from `useSpaghettiStore`
- Browser expand/collapse and Browser row selection are Browser-local UI state
- project content remains a separate `useAppStore` seam

## Browser Interaction Rules

These are the current shipped workspace rules.

### Selection Versus Focus

Browser row-body click:
- selects the Browser row
- does not automatically move editor focus
- does not automatically change shared viewer composition

Explicit actions move editor state:
- graph row `Open`
- graph row `New Editor`
- graph row `Swap Editor`
- viewport row `Focus`

### Reveal Versus Composition

Browser `Reveal` is now the first Browser-to-viewer coordination path.

`Reveal`:
- exists on graph rows
- exists on published-output rows
- is graph-scoped in the first pass
- uses `viewerTargetGraphDocumentId` when shared composition is not active

When shared composition is active:
- Browser rows may show read-only participation status
- Browser rows do not add/remove composition membership
- `Reveal` is disabled instead of silently mutating shared composition

Important rule:
- selected Browser item
- focused editor viewport
- viewer reveal target
- shared composition membership

These are now different things on purpose.

## Graph Canvas

The canvas is still the main graph-authoring surface inside one editor viewport.

It contains:
- node boxes
- wires
- ports
- edge routes and waypoints
- selection state
- node row modes
- node position/layout
- the canvas add-node menu

The canvas is graph-document-bound through the viewport that owns it.

Important rule:
- the canvas edits one graph document at a time
- the wider workspace can still contain multiple graph documents and multiple editor viewports

## Nodes

Nodes are still the main typed boxes in the graph.

A node can currently be:
- a part node
- a param node
- an output node
- a primitive node
- a utility node
- a system node

## Ports

Ports are the typed connection points on nodes.

Current port kinds visible in the registry include:
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

## Wires

Wires are graph edges.

A wire connects:
- one source output endpoint
- to one target input endpoint

The canvas also supports:
- edge selection
- edge hover state
- edge waypoints
- waypoint tangent flipping

## Feature Stack

Feature Stack still lives inside part nodes.

It is:
- part-internal authored geometry logic
- not a nested graph canvas

Current important Feature Stack operations include:
- sketch
- closeProfile
- extrude

Important rule:
- Feature Stack belongs to part-node internals
- it is separate from Browser hierarchy and separate from graph-document ownership

## Graph Runtime State

Each graph document now has its own runtime state.

That runtime state includes:
- compile/build tracking
- preview preparation
- accepted build outputs
- accepted preview build outputs
- output surface publication state

Important rule:
- preview/build memory is graph-local now
- runtime/output truth should not come from one flat app-global spaghetti parts list

## Graph-Owned Published Output Surface

Published graph output is now an explicit graph-owned seam.

The important current object is:
- `GraphOutputSurface`

It owns:
- published output entries per graph
- output-entry labels
- publication state
- published build sequence metadata

Current entry states include:
- `resolved`
- `unresolved`
- `empty`

Important rule:
- this is the Browser child-row truth under graph documents
- it is not yet the final project-content hierarchy

## Shared Viewer

The shared viewer is now able to render:
- one graph-targeted preview path by default
- or a composed multi-graph result when shared composition is active

Current default fallback:
- `viewerTargetGraphDocumentId`

When no shared composition session exists:
- the viewer behaves like a single graph-targeted preview surface

## Shared Viewer Composition

Shared viewer composition is now a real runtime-owned workspace seam.

Current composition unit:
- graph documents

Composition truth lives in:
- `useSpaghettiStore`

It currently carries:
- a composition id
- participating `graphDocumentId`s

Current first-pass authoring path:
- explicit viewport action from editor viewports

Current render rule:
- render the union of resolved participating graph contributions
- unresolved participating graphs stay members but render nothing

Important rule:
- focus can point at composition
- focus cannot redefine composition membership

## Current Node Families

These are the current node families in the registry.

### Part Nodes

- `Part/Baseplate`
- `Part/Cube`
- `Part/CubeProof`
- `Part/ToeHook`
- `Part/HeelKick`

### System Nodes

- `System/OutputPreview`

### Output Nodes

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

## Current Major Part Nodes

### Baseplate

Node type:
- `Part/Baseplate`

Current role:
- main base shape / anchor-spline source part node

### Cube

Node type:
- `Part/Cube`

Current role:
- simple proof/build part node with seeded rectangle-extrude Feature Stack defaults

### Cube Proof

Node type:
- `Part/CubeProof`

Current role:
- internal/proof-oriented cube variant
- not a normal user-addable node

### Toe Hook

Node type:
- `Part/ToeHook`

Current role:
- toe-hook part node that consumes anchor spline and optional rail math

### Heel Kick

Node type:
- `Part/HeelKick`

Current role:
- heel-kick part node that consumes anchor spline and optional rail math

## Current Add-Node Reality

There are now two different "add node" surfaces, and they are not identical.

### Canvas Add Menu

The canvas context-menu add flow is registry-driven through `listUserAddableNodeTypes()`.

Current user-addable registry types include:
- `Part/Baseplate`
- `Part/Cube`
- `Part/ToeHook`
- `Part/HeelKick`
- `Output/Assembled`
- `Param/Number`
- `Param/Boolean`
- `Param/Vec2`
- `Primitive/SplineFromPoints`
- `Utility/IdentitySpline2`
- `Utility/IdentityNumberMm`

### Toolbar Quick-Add

The simpler header quick-add currently exposes only these part nodes:
- `Part/Baseplate`
- `Part/ToeHook`
- `Part/HeelKick`

Important rule:
- "addable in the registry/canvas menu"
- is not always the same as
- "shown in the simple toolbar quick-add"

## Nodes That Exist But Are Not Normal User-Adds

These exist in the system but are not normal user-addable nodes.

- `System/OutputPreview`
- `Part/CubeProof`
- `Primitive/Number`
- `Primitive/Vec2`

Likely meaning:
- `OutputPreview` is a system-owned singleton-style support node
- `CubeProof` is an internal/proof node
- `Primitive/Number` and `Primitive/Vec2` still exist for compatibility/internal use, but new authoring is expected to prefer `Param/*`

## The Most Important Current Mental Model

The Spaghetti Editor is now best understood like this:

- graph documents are the authored graph units
- editor viewports are the graph-editing windows
- the canvas edits one graph document inside one viewport
- graph runtime and published output state are graph-local
- the Browser is a workspace shell above those graph documents and viewports
- the shared viewer can either target one graph or compose more than one graph
- Browser selection, editor focus, viewer target, and shared composition membership are intentionally separate concepts

## What This Doc Still Does Not Try To Define

This doc does not try to fully define:
- the final `Component / Assembly / Object / Part` Browser hierarchy
- Browser context-menu cleanup from later `[2.1C]`
- Browser build bars and project-content build controls
- richer visibility/material/reference workspace systems
- detached multi-window graph editing
- final `Publish / Receive` execution behavior

Those belong to later roadmap phases.

## Suggested Next Docs

If this master doc gets split again, the next useful focused docs are:

- `01.1 - Graph Documents And Viewports.md`
- `01.2 - Browser Workspace.md`
- `01.3 - Shared Viewer And Composition.md`
- `01.4 - Canvas And Wires.md`
- `01.5 - Nodes And Ports.md`
- `01.6 - Feature Stack.md`
- `01.7 - Graph Runtime And Output Surface.md`

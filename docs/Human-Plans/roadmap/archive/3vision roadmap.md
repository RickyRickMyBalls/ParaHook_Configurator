ParaHook Vision Roadmap
1. Graph Engine (Core Infrastructure)

The deterministic graph system that powers the entire editor.

[~] Graph data model
[~] Deterministic node/edge storage
[~] Node registry system
[~] Port contract system
[~] Graph validation layer
[~] Graph resolver system
[~] Deterministic compile pipeline
[~] Worker execution pipeline
[ ] Graph versioning
[ ] Graph migration utilities
[ ] Graph persistence / save system

Purpose:

stable architecture foundation

deterministic builds

safe evolution of node systems

2. Node System

The framework that defines how nodes exist, render, and behave.

[~] Node template system
[~] Part node template
[ ] Utility node templates
[ ] Param node templates
[ ] Input node templates
[ ] Output node templates
[ ] Node palette / creation system
[ ] Node categorization system
[ ] Node documentation metadata

Key rule for the project:

NodeView must remain generic.

Nodes define behavior through the registry and templates, not custom UI code.

3. Editor UX (Spaghetti Editor)

The node-based editing environment.

[~] Node canvas system
[~] Node selection model
[~] Node dragging model
[~] Node header/body interaction zones
[~] Node collapse modes
        collapsed
        essentials
        everything

[ ] Section collapse model
        Drivers
        Feature Stack
        Outputs

[ ] Wire rendering system
[ ] Wire type coloring
[ ] Wire validation feedback
[ ] Wire snapping / routing

[ ] Node palette UI
[ ] Node search
[ ] Node creation UX

[ ] Editor diagnostics panel
[ ] Compile error highlighting
[ ] Graph validation feedback

Goal:

Create a professional node editor UX similar to Blender / Grasshopper.

4. Parameter System

The system that produces values used by parts and features.

[~] Driver system (numbers / vec2)
[ ] Param nodes
        number
        boolean
        vec2
        color
        enum

[ ] Pin exposure system
[ ] Parameter wiring system
[ ] Default parameter values
[ ] Parameter grouping
[ ] Parameter constraints / limits

Goal:

Enable fully parametric models.

5. Part System

The core parametric geometry nodes.

[~] Part node template
[~] Baseplate part
[ ] ToeHook part
[ ] HeelKick part
[ ] Future part nodes

[~] Deterministic part ownership
[~] Feature stack integration
[~] Multi-part support

[ ] Part parameter presets
[ ] Part metadata system

Goal:

Each Part Node represents a manufacturable component.

6. Feature Stack System

Parametric geometry definition.

[~] Feature Stack IR
[~] Feature execution pipeline

Features
[~] Sketch
[~] Extrude
[ ] Fillet
[ ] Chamfer
[ ] Boolean
[ ] Pattern
[ ] Mirror

[ ] Feature dependency visualization
[ ] Feature diagnostics

Goal:

Create a deterministic parametric modeling engine.

7. Geometry Runtime

The system that produces mesh or CAD geometry.

[~] Runtime tessellation pipeline
[~] Deterministic geometry generation
[~] Worker runtime operations

Runtime ops
[~] sketch
[~] extrude
[ ] boolean
[ ] fillet
[ ] chamfer

[ ] mesh generation pipeline
[ ] spline output support
[ ] geometry caching

Goal:

Reliable geometry generation independent of UI.

8. Assembly System

How multiple parts become a single assembly.

[~] OutputPreview node
[~] slot system
[~] dynamic slot expansion
[ ] assembly graph
[ ] part transform system
[ ] assembly constraints

Goal:

The OutputPreview node becomes the root of the model assembly.

9. Visualization System

Rendering geometry in the editor.

[~] OutputPreview render VM
[~] ViewerHost
[ ] multi-part rendering
[ ] highlight selected part
[ ] part visibility toggles
[ ] render performance optimization
10. Export System

Exporting manufacturable geometry.

[ ] mesh export (STL)
[ ] CAD export (STEP)
[ ] profile export
[ ] manufacturing metadata
11. Advanced Systems (Future)
[ ] Rail math system
[ ] Simulation nodes
[ ] Constraints solver
[ ] procedural pattern system
[ ] generative design tools
Current System Status (Reality Check)

Based on your recent phases:

Graph Engine        ~70% complete
Node System         ~60% complete
Editor UX           ~50% complete
Feature Stack       ~65% complete
Geometry Runtime    ~40% complete
Part System         ~55% complete
Assembly System     ~35% complete
Param System        ~20% complete
Export System        ~5% complete

The core architecture is already working.

What you're doing now is stabilization and expansion, not invention.

The 5 Pillars of the System

Everything in your roadmap ultimately belongs to one of these:

1 Graph Engine
2 Node System
3 Feature Stack
4 Assembly System
5 Editor UX

If a future feature doesn't clearly fit one of those, it probably means the architecture needs reconsideration.


ParaHook Master Roadmap
Core Architecture
[x] FS-0A  Feature Stack proof pipeline
[x] FS-0B  CubeProof test node
[x] FS-0C  Cube Part Node MVP
[x] FS-1   PartArtifact contract
[x] FS-2   Feature semantics (Sketch → Extrude)
[x] FS-3   Feature stack visualization
[x] FS-4   Multi-Part Feature Stack support
Output System
[x] OP-1  OutputPreview node creation
[x] OP-2  Slot normalization
[x] OP-3  Slot ordering determinism
[x] OP-4  OutputPreview node UI slot rows
[ ] OP-5  Viewer integration + render VM pipeline
[ ] OP-6  Parts list panel integration
Resolver / Validation System
[x] CT-1  Contract lock (resolver / validator / canvas parity)
[x] CT-2  Deterministic validation rules
[ ] CT-3  Feature input validation
View Model Layer
[x] VM-1  Derived ViewModel selectors
[ ] VM-2  Port rendering view models
[ ] VM-3  Feature stack view models
Node Interaction System
[x] NI-1  Selection + drag interaction
[x] NI-2  Per-node view mode system foundation
[~] NI-3  Section collapse consistency
[ ] NI-4  Node UI rendering cleanup

NI-3 is where your expand / collapse problems currently live.

Feature Wiring System
[x] FW-1  Virtual feature input port architecture
[x] FW-2  External feature param wiring (Extrude.depth)
[x] FW-3  Additional extrude params (taper / offset)
[ ] FW-4  Feature param promotion system

FW-4 will implement:

Pin to Input

Param Promotion System
[ ] PP-1  "Pin to Input" feature param binding model
[ ] PP-2  Inputs section rendering for pinned params
[ ] PP-3  Feature stack param linked-state UI
[ ] PP-4  Right-click param context menu

This replaces the current incorrect Feature Wire Inputs inside Feature Stack.

Node Template System
[x] Base Part Node template
[x] Drivers section
[x] Feature Stack section
[x] Outputs section
[~] Inputs section stabilization

Inputs are currently unstable due to the feature wiring experiment.

Param Node System

(from your wishlist)

[ ] Param node (number / boolean / vec2)
[ ] Param node UI
[ ] Param node wiring rules
Utility Node System
[ ] RailMath node
[ ] RailMath → ToeHook / HeelHook integration
Future Part Nodes
[x] Cube
[x] Baseplate
[x] ToeHook
[x] HeelKick
Graph UX
[ ] Node palette
[ ] Node search
[ ] Node creation toolbar
Advanced UI
[ ] Pin exposure system
[ ] Node compact mode UI polish
[ ] Blender-style number drag bars

Some of these are already partially implemented.

Compile / Worker System
[x] Deterministic compileGraph pipeline
[x] Worker runtime sketch / extrude
[x] Runtime tessellation determinism
Viewer System
[ ] ViewerHost render pipeline
[ ] Mesh preview identity
[ ] Multi-part preview rendering
Very Important Immediate Priorities

Based on your current state, the correct next order is:

1️⃣ NI-3  Fix expand / collapse system
2️⃣ NI-4  Stabilize node rendering rules
3️⃣ PP-1  Implement "Pin to Input"
4️⃣ PP-2  Move feature param inputs to Inputs section
5️⃣ OP-5  Viewer render integration

If you skip NI-3, the UI will keep breaking whenever new rows are introduced.
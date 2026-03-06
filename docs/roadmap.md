--------------------------------------------------------------------------------------------------------------------------------------------
## [8] MASTER ROADMAP (Next ~20 Phases)
--------------------------------------------------------------------------------------------------------------------------------------------

Master tracks:
- DR - Driver system
- FS - Feature stack / geometry
- SK - Sketch system
- ND - Node architecture

Driver System (DR)
[~] DR-1 - Driver diagnostics + invalid wiring visualization (dashed wires)
[ ] DR-2 - Driver dependency inspector (show upstream driver chain)
[ ] DR-3 - Driver pinning system (expose driver pins externally)
[ ] DR-4 - Driver parameter grouping (collapsible driver groups)

Feature Stack / Geometry (FS)
[ ] FS-1 - First geometry output
    - PartNode.solid -> OutputPreview -> mesh preview
[ ] FS-2 - Compile full feature stack -> geometry
    - Sketch
    - Extrude
[ ] FS-3 - Feature stack editing UI hardening
    - reorder features
    - disable feature
    - deterministic rebuild
[ ] FS-4 - Feature dependency graph (show feature -> feature dependency wires)
[ ] FS-5 - Multi-part preview rendering
    - Part A
    - Part B
    - Part C
[ ] FS-6 - Boolean feature support
    - Union
    - Difference
    - Intersect

Sketch System (SK)
[ ] SK-1 - Sketch node architecture
    - Input/Profile
    - Input/ProfileClosed
[ ] SK-2 - Sketch editing UI
    - add/remove points
    - edit handles
[ ] SK-3 - Sketch constraint system
    - horizontal
    - vertical
    - equal length
[ ] SK-4 - Sketch solver
    - deterministic constraint resolution
[ ] SK-5 - Sketch node -> Feature stack integration

Node Architecture (ND)
[ ] ND-1 - Part node template system
    - reusable node shell: Drivers, Inputs, Feature Stack, Outputs
[ ] ND-2 - Node palette / creation toolbar
    - add nodes via searchable palette
[ ] ND-3 - Node grouping
    - group nodes into subgraphs
[ ] ND-4 - Node collapse / expand architecture
    - improve node view modes
[ ] ND-5 - Internal dependency visualization
    - show Drivers -> Feature Stack inside node

Output / Artifact System (OP)
[ ] OP-7 - Export pipeline
    - STL
    - STEP
    - OBJ
[ ] OP-8 - Parts artifact generator
    - BOM
    - cut list
    - print files

Final Target Architecture
Sketch Nodes
     ->
Part Nodes
     ->
Feature Stack
     ->
Compiler
     ->
Worker CAD Runtime
     ->
OutputPreview
     ->
Viewer / Export

Where You Are Right Now
[x] CK-1 - Graph Command Kernel
[x] VM-1 - Selector View Models
[x] CT-1 - Connection Contract Lock
[~] DR-1 - Diagnostics Visualization (CURRENT)
[ ] FS-1 - First Geometry Output (NEXT)
--------------------------------------------------------------------------------------------------------------------------------------------
## [0] EXPANSION TRACK (Future)
--------------------------------------------------------------------------------------------------------------------------------------------

ROADMAP CHECKLIST (Execution View)
OutputPreview Track
[x] OP-0 — OutputPreview Contract
[x] OP-1 — OutputPreview Singleton Enforcement
[x] OP-2 — Dynamic Slot Ports
[x] OP-3 — Slot Normalization
[x] OP-4 — OutputPreview Node UI
[x] OP-5 — Viewer Integration (OutputPreview render contract)
[x] OP-6 — Parts List Panel (OutputPreview slots)
[x] OP-6.1 — Hide trailing empty slot in Parts List
Driver / Parametric Control Track
[x] DR-0 — Driver Input + Output Ports (canonical IDs + dual-read compatibility)
[x] 2C v2.2 — Numeric Offset Mode for Driven Numeric Drivers
[ ] DR-1 — Driver Diagnostics & Invalid Wiring Visualization
[ ] DR-2 — Drivers as Param Node Docking Stations
Core Architecture Hardening
[x] CK-1 — Graph Command Kernel (De-Spaghetti)
[~] VM-1 — Derived View Model Selectors
[ ] CT-1 — Resolver / Validator / Canvas Contract Lock
Geometry / Feature Stack
[ ] FS-1 — Part Solid Output Pin (Baseplate.solid MVP)
[ ] FS-2 — Feature Stack Node (Extruded Box MVP)
Sketch System Reliability
[ ] SK-1 — SketchBuild Contract
[ ] SK-2 — CloseProfile Determinism + Diagnostics
[ ] SK-3 — Feature Stack Integration + Compiler Parity
Node Editor Expansion
[ ] ND-1 — Node Palette / Toolbar
[ ] ND-2 — Pin Exposure System
[ ] ND-3 — Internal Dependency Visualization


## [0] OLD FUTURE

[ ] ND-3 - Internal Dependency Visualization ("everything" mode only)
[ ] ND-2 - Pin Exposure System
[ ] ND-1 - Node Palette / Toolbar
[ ] Rail Math Node (railMath object)
[ ] Param Node (utility: number/boolean/vec2)

--------------------------------------------------------------------------------------------------------------------------------------------
## [7] NOW / NEXT
--------------------------------------------------------------------------------------------------------------------------------------------

Now:
- OP-6.1 - Hide trailing empty slot in Parts List (UI-only)

Next:
- DR-0 - Driver Input+Output Ports (Global Wiring)

--------------------------------------------------------------------------------------------------------------------------------------------
## [6] OUTPUTPREVIEW TRACK (Render Contract)
--------------------------------------------------------------------------------------------------------------------------------------------

[x] OP-6.1 - QoL: Hide trailing empty slot row in Parts List (UI-only)
- panel filters out last unconnected slot from display
- graph invariant remains unchanged

[x] OP-6 - Parts List Panel (Spaghetti Only)
- reuse existing PartsListPanel UI
- spaghetti rows derived from OutputPreview slots/edges
- slotId keying for selection + visibility (matches OP-5)
- ViewerHost uses store visibility map for spaghetti mode
- selector tests + changelog

[x] OP-5 - Viewer Integration (Spaghetti Only)
- viewer renders ONLY OutputPreview-connected parts
- stable identity lock: viewer partKeyStr = slotId
- selector-driven render list + tests + changelog

[x] OP-4 - OutputPreview Node UI
- slot rows + pins + upstream metadata display

[x] OP-3 - Slot Normalization
- exactly one trailing empty slot
- append-on-fill + end-only trim + preserve interior empties
- integrated into normalizeGraphForStoreCommit + tests + changelog

[x] OP-2 - Dynamic Slot Ports
- effectivePorts emits `in:solid:<slotId>` from params.slots
- optional=true, maxConnectionsIn=1, kind alias stays (`toeLoft`)
- canvas pin rendering + tests + changelog

[x] OP-1 - OutputPreview Singleton Enforcement
- non-deletable + auto-heal singleton via store normalization
- deterministic duplicate resolution + edge cleanup
- tests + changelog

[x] OP-0 - OutputPreview Contract
- node type + params (slots, nextSlotIndex)
- deterministic defaults + creation helpers
- registry integration + tests + changelog

--------------------------------------------------------------------------------------------------------------------------------------------
## [5] CORE ARCHITECTURE TRACK (De-Spaghetti)
--------------------------------------------------------------------------------------------------------------------------------------------

[ ] CT-1 - Contract Lock (Resolver/Validator/Canvas Parity)
- centralize endpoint key + path normalization
- cheap-check vs validateGraph parity tests
- shared reason codes / diagnostics contract

[ ] VM-1 - Derived VM Selectors (Source vs Derived State Separation)
- selectors for node rows, driver rows, diagnostics, preview render VM
- reduce component-local computed state
- determinism + fewer parity bugs

[ ] CK-1 - Graph Command Kernel
- move graph mutations out of SpaghettiCanvas/NodeView into pure graphCommands/
- deterministic command helpers + unit tests
- store applies patches from commands (testable, undo-ready)

--------------------------------------------------------------------------------------------------------------------------------------------
## [4] PARAMETRIC CONTROL TRACK (Drivers as Param Nodes)
--------------------------------------------------------------------------------------------------------------------------------------------

[ ] DR-1 - Driver-to-FeatureStack UX + Diagnostics (QoL)
- show "connected but unresolved" states (dashed/badged wires)
- parts list / node badges for not-ready drivers

[ ] DR-0 - Driver Input+Output Ports (Global Wiring)
- effectivePorts emits BOTH:
  - in:drv:<driverId>
  - out:drv:<driverId>
- driver pins appear in UI; user can drag wires from/to drivers
- type/units enforced by existing validator
- edges persist even if upstream invalid (diagnostics instead of pruning)
- tests + changelog

[ ] 2C v2.2 - Numeric Offset Mode for Driven Drivers (Planned)
- numeric drivers only
- drivenValue + offsetValue -> effectiveValue
- UI shows driven/offset/effective
- unit checks + evaluateGraph determinism tests

--------------------------------------------------------------------------------------------------------------------------------------------
## [3] GEOMETRY / FEATURE STACK TRACK (First Real Shapes)
--------------------------------------------------------------------------------------------------------------------------------------------

[ ] FS-2 - "FeatureStack Node" (Extruded Box MVP)
- optional shortcut node that emits a simple extruded rectangle
- used as a geometry source to exercise OutputPreview/Viewer early
- later replaced by full Baseplate + sketch pipeline

[ ] FS-1 - Part Solid Output Pin (Baseplate.solid minimum viable)
- expose solid output port on a part node
- map feature stack result -> PartArtifact
- connect Baseplate.solid -> OutputPreview slot -> viewer
- first real node-generated geometry visible

--------------------------------------------------------------------------------------------------------------------------------------------
## [2] SKETCH SYSTEM TRACK (Robust Profiles)
--------------------------------------------------------------------------------------------------------------------------------------------

[ ] SK-3 - Feature Stack Integration + Compiler Parity
[ ] SK-2 - CloseProfile Determinism + Diagnostics
[ ] SK-1 - SketchBuild Contract





--------------------------------------------------------------------------------------------------------------------------------------------
## History Tree
--------------------------------------------------------------------------------------------------------------------------------------------
ParaHook Configurator Development Roadmap
�
+- 1. Core Spaghetti Editor Foundations
�   �
�   +- [001] Spaghetti core system
�   �   +- Node editor canvas
�   �   +- Ports + wires
�   �   +- Composite path endpoints
�   �   +- Vec2 composite field tree
�   �   +- Deterministic evaluation + compile pipeline
�   �
�   +- [002] Floating node editor window
�   �   +- Drag + viewport anchoring behavior
�   �
�   +- Composite Field Architecture
�   �   +- [006] FieldTree composite system
�   �   +- [007] Composite expansion state + leaf rendering
�   �   +- [008] Drag rerender stability guard
�   �   +- [009] Anchor interaction ? essentials mode
�   �   +- [010] Interactive target pointer guards
�   �   +- [011] Input node click promotes collapsed ? essentials
�
+- 2. Part Node Template System
�   �
�   +- [012] Data-driven Part Template v1
�   �   +- driverVm render model
�   �   +- template-driven NodeView
�   �   +- metadata-driven sections
�   �
�   +- Node Section Taxonomy
�   �   +- [021] Drivers
�   �   +- [021] Inputs
�   �   +- [021] Feature Stack
�   �   +- [021] Outputs
�   �
�   +- Container Architecture
�   �   +- [037] partSlots container contract
�   �   +- [040] deterministic normalization + parse hardening
�   �   +- [045] row ordering metadata (partRowOrder)
�   �
�   +- Row Interaction UI
�       +- reorder controls
�       +- deterministic ordering
�       +- [049] output row alignment
�       +- [051] reorder button polish
�
+- 3. Part Definitions (Initial Library)
�   �
�   +- Baseplate
�   �   +- [022] output interface cleanup
�   �
�   +- ToeHook
�   �   +- [023] template + alias compatibility
�   �
�   +- HeelKick
�       +- [024] template parity with ToeHook
�
+- 4. Feature Stack System
�   �
�   +- App Layer Specification
�   �   +- [003] deterministic profile derivation + stack helpers
�   �
�   +- Worker Execution
�   �   +- [004] Feature Stack runtime (Option-B execution)
�   �
�   +- UI Debug / Preview
�   �   +- [005] Feature Stack preview panel (IR-driven)
�   �
�   +- External Feature Wiring
�   �   +- [043] virtual input ports (Extrude.depth)
�   �   +- [060] expanded inputs
�   �        +- Extrude.taper
�   �        +- Extrude.offset
�   �
�   +- Deterministic Geometry Pipeline
�       +- [061] runtime bridge planning
�       +- [062] tessellation determinism + CCW enforcement
�
+- 5. Driver Wiring System
�   �
�   +- Driver Output Ports
�   �   +- [052] drv:<paramId>
�   �   +- [053] parser hardening + determinism
�   �
�   +- Driver Input Ports
�   �   +- [055] drv:in:<paramId>
�   �
�   +- Deterministic Drop Semantics
�       +- [057] auto-replace incoming driver wires
�
+- 6. Node UI / Interaction System
�   �
�   +- Node control UX
�   �   +- scrub slider system
�   �   +- preset picker
�   �   +- header mode switching
�   �
�   +- Numeric field controls
�   �   +- [025] shared Blender-style NumberField + Vec2Field
�   �
�   +- Visual style pass
�   �   +- [026] node UI polish pass
�   �
�   +- Layout improvements
�   �   +- [035] preset width fit
�   �   +- [036] collapse / toolbar improvements
�   �
�   +- Typed wiring visuals
�       +- [027] colored sockets + wire types
�
+- 7. OutputPreview Assembly System
�   �
�   +- (Referenced in current development phase)
�   +- Special system node
�   +- Non-deletable
�   +- Auto-expanding input slots
�   +- Defines active parts list for viewer rendering
�
+- 8. Documentation / Task Tracking Infrastructure
    �
    +- [038] NODE tasklist checklist
    +- [039] difficulty scale added
    +- [042] master task file
    +- [044] tasklist updates after Phase 2
    +- [056] planning updates
    +- [058] tasklist completion updates
    +- [059] numbering correction

    ParaHook Configurator � Current Development Hierarchy
(derived from ChangeLog entries 062 ? 058)

�
+- Phase 4A Geometry Runtime Stability
�
�   +- [061] Runtime Bridge Planning
�   �
�   �   Goal
�   �   Bridge analytic ProfileLoop segments ? runtime vertex loops
�   �
�   �   Key design rules
�   �   - tessellation only at compile boundary
�   �   - worker runtime remains minimal
�   �   - runtime ops stay: sketch + extrude
�   �
�   �   Result
�   �   Documentation entry to track upcoming runtime bridge task
�   �
�
�   +- [062] Tessellation Determinism Hardening
�
�       Compiler responsibility
�       +- runtimeTessellation.ts
�
�       Determinism guarantees
�       +- canonical float rounding (6 decimals)
�       +- epsilon duplicate suppression
�       +- closure snap
�       +- CCW enforcement
�       +- deterministic loop orientation
�
�       Test coverage
�       +- repeat compile determinism
�       +- closure behavior
�       +- epsilon join suppression
�       +- payload byte-identical guarantee
�
�       Result
�       Stable compile payload geometry emission
�
�
+- Phase 2B Feature Wiring Expansion
�
�   +- [060] Feature Virtual Input Expansion
�
�       Previous capability
�       +- Extrude.depth wiring
�
�       New capability
�       +- Extrude.depth
�       +- Extrude.taper
�       +- Extrude.offset
�
�       Virtual Port Contract
�       +- fs:in:<featureId>:extrude:depth
�       +- fs:in:<featureId>:extrude:taper
�       +- fs:in:<featureId>:extrude:offset
�
�       Architecture rules preserved
�       +- whole-port connections only
�       +- path wiring rejected
�       +- maxConnectionsIn = 1
�       +- resolver remains single source of truth
�
�       Pipeline integration
�       +- validateGraph
�       +- evaluateGraph
�       +- compileGraph
�       +- UI feature rows
�
�       Compile IR fields
�       +- depthResolved
�       +- taperResolved
�       +- offsetResolved
�
�
+- Phase 2C Driver Wiring System
�
�   +- [058] Driver Input Auto-Replace (v2.1 completion)
�
�       Driver endpoint contract
�       +- drv:in:<paramId>
�
�       Drop behavior
�       +- replacing existing driver edge
�       +- duplicate drop ? no-op
�       +- deterministic replace semantics
�       +- cycle check at final commit
�
�       Endpoint rules
�       +- whole-port key lock
�       +- scoped replacement logic
�
�       Result
�       Deterministic driver wiring UX
�
�
+- Documentation / Task System Maintenance
�
�   +- [059] NODE Tasklist Renumbering
�
�       Fix
�       +- duplicate section number
�       +- downstream numbering shifted
�       +- roadmap readability restored
�
�
+- Current System State (after [062])

    Stable systems
    +- deterministic compile pipeline
    +- feature stack wiring
    +- driver wiring replacement logic
    +- UI feature parameter editing

    In-progress architectural direction
    +- runtime bridge for analytic geometry
    +- further feature wiring expansion
    +- upcoming assembly/output pipeline work


askParaHook — Master Wishlist (Living Checklist)

----------------------------------------------------------------
A) Core System Architecture (Non-Negotiable Invariants)
----------------------------------------------------------------
[x] Warm worker (never restarts during editing)
[x] Latest-only scheduling (drop stale builds)
[x] Deterministic builds (same graph → same geometry)
[x] Stable ordering everywhere
        nodes
        edges
        profiles
        feature execution
[x] Strict separation
        UI
        Graph
        Compiler
        Features
        Worker
        Viewer
[x] Pure UI actions never trigger rebuild
        row modes
        expand/collapse
        selection
        menus

----------------------------------------------------------------
B) Spaghetti Editor Canvas
----------------------------------------------------------------
[x] Node add context menu (search + place at cursor)
[x] Node drag/select stable
[x] Wire drag/drop stable
[x] Path-aware endpoints (nodeId + portId + path)
[x] Deterministic edge ordering
[x] Reroute points
[x] Tangent routing
[x] Stable port hit targets
[x] Wire-drag rerender guard
[x] Interactive target guard (chevrons/value bars)

----------------------------------------------------------------
C) Row View Modes
----------------------------------------------------------------
[x] collapsed
[x] essentials
[x] everything
[x] Mode changes are render-only
[x] Parent anchors active when collapsed
[x] Leaf rendering rules implemented

----------------------------------------------------------------
D) Composite Field System
----------------------------------------------------------------
[x] fieldTree recursive exposure
[x] vec2 composite support
[x] spline2 composite support
[x] profileLoop composite support
[x] Deterministic leaf ordering

----------------------------------------------------------------
E) Feature Stack Runtime
----------------------------------------------------------------
[x] compileFeatureStack pipeline
[x] deterministic profile derivation
[x] worker feature stack execution
[x] mesh-pack runtime
[x] IR-driven preview
[x] deterministic diagnostics

----------------------------------------------------------------
F) Part Node Template (Node Toolbar Template)
----------------------------------------------------------------
[~] Remove Baseplate special-casing in NodeView
[~] Gate legacy uiSections to everything/debug mode
[~] Make FeatureStackView the single stack UI in essentials
[ ] Ensure Baseplate + ToeHook use same template rendering
[ ] Standardize node structure

Target template:
    Header
    Drivers
    Feature Stack
    Outputs (pins)

----------------------------------------------------------------
G) Feature Stack Structure (Baseplate)
----------------------------------------------------------------
[ ] Sketch_1 (Closed Profile)

        Spline_1
            Points_Array
            Spline Controls

        Offset_1

        Line_1
        Line_2

[ ] Extrude_1

Outputs
    Inner Spline Anchor
    Mesh Output (always last)

----------------------------------------------------------------
H) Pin Exposure System
----------------------------------------------------------------
[ ] Full-width row model

Inputs
    left pin only

Outputs
    right pin only

[x] Feature Stack generates output pins

[ ] Right-click INPUT → "Expose as Output Pin"

Result:
    dual-pin row (left + right)

[ ] Store exposed pin metadata
[ ] Deterministic exposed pin key

----------------------------------------------------------------
I) Baseplate Output Rules
----------------------------------------------------------------
[x] Inner spline anchor output
[x] Mesh output
[x] Mesh output always last
[x] Mesh output bottom-right
[x] Mesh output produced by final Feature Stack operation

----------------------------------------------------------------
J) Collapsed Node Design
----------------------------------------------------------------
[ ] Baseplate collapsed view

Baseplate
    Drivers ▸
    Feature Stack ▸

Outputs
    Inner Spline Anchor
    Mesh Output

----------------------------------------------------------------
K) Essentials Node Design
----------------------------------------------------------------
[~] Feature Stack summary mode

Drivers
Feature Stack
    Sketch_1
    Extrude_1

Outputs
    Inner Spline Anchor
    Mesh Output

----------------------------------------------------------------
L) Everything Node Mode
----------------------------------------------------------------
[ ] Full Feature Stack editors
[ ] Internal dependency spaghetti visualization

Example:
Spline_1.end → Line_1.start
Offset_1.end → Line_1.end

----------------------------------------------------------------
M) Node Toolbar (Node Spawn UI – future)
----------------------------------------------------------------
[ ] Node palette / toolbar for spawning nodes

Sections
    Parts
        Baseplate
        ToeHook
        HeelKick

    Drivers
        Number
        Boolean

    Utilities
        (future)

----------------------------------------------------------------
N) Drivers System
----------------------------------------------------------------
[ ] Driver nodes
[ ] Driver groups
[ ] Promote value → driver
[ ] Driver → feature parameter references

----------------------------------------------------------------
O) Future Feature Stack Operations
----------------------------------------------------------------
[ ] Fillet
[ ] Chamfer
[ ] Offset surfaces
[ ] Boolean ops
[ ] Loft operations

----------------------------------------------------------------
P) Product Expansion
----------------------------------------------------------------
[ ] ToeHook feature stack
[ ] HeelKick feature stack
[ ] Footpad generator
[ ] Rail generator

----------------------------------------------------------------
Q) Performance / Stability
----------------------------------------------------------------
[x] NodeView memoization
[x] stable handler callbacks
[x] connectionDragAnchor guard
[x] canvas-local composite expansion
[ ] large graph performance testing
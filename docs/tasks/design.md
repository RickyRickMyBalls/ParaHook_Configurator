MASTER VISION — Design Breakdown (Node System / Drivers / Feature Stack / Wires)

Legend
[x] implemented
[~] in progress
[ ] planned
[?] exploratory


------------------------------------------------
A) CORE MODELING LAYERS
------------------------------------------------

[x] A1. Graph layer (Spaghetti Graph)
    Nodes + edges define dependencies between values and parts.

[x] A2. Part layer (Part Nodes)
    A Part Node is a container with fixed sections:
    Drivers → Inputs → Feature Stack → Outputs

[x] A3. CAD layer (Feature Stack)
    Each Part internally builds geometry via ordered operations (Sketch/Extrude/Loft/etc).


------------------------------------------------
B) NODE CONTENT MODEL (WHAT A NODE CONTAINS)
------------------------------------------------

[x] B1. Drivers (node-owned parameters)
    - Editable fields on the node
    - Deterministic defaults
    - Can become “driven” by graph wires (future v2)
    - Can output values to the graph (Phase 2C v1)

[x] B2. Inputs (external parameters)
    - Values that can be wired in from other nodes
    - When wired, UI becomes read-only and shows resolved value
    - Used to parameterize the part and/or feed the Feature Stack

[x] B3. Feature Stack (internal operations)
    - Ordered list of features
    - Each feature has params (some editable, some wireable)
    - Remains embedded in node.params.featureStack (v1 architecture)

[x] B4. Outputs (things the node produces)
    - Geometry (future mesh endpoint)
    - Profiles/splines/typed objects
    - Reserved outputs exist (fixed, non-orderable)


------------------------------------------------
C) WIRES (WHAT THEY MEAN)
------------------------------------------------

[x] C1. Wires are typed
    Each edge connects compatible PortSpec types (kind + unit + shape).

[x] C2. Wires are deterministic
    Validation/evaluation/compile order is stable and reproducible.

[x] C3. Whole-port wiring first
    v1 wiring does not use composite paths unless already supported by the VM.

[ ] C4. Driver → Input wires (Phase 2C v1)
    - Drivers expose virtual output ports drv:<paramId>
    - Inputs accept incoming wires

[ ] C5. Wire → Driver wires (Phase 2C v2)
    - Drivers gain virtual input ports
    - When wired, driver enters driven mode

[ ] C6. Feature input wires (v1 done for Extrude.depth)
    - Node graph can drive feature params via virtual feature input ports

[ ] C7. Feature outputs + internal wiring (future)
    - Feature outputs become endpoints
    - Internal feature-to-feature semantics added later


------------------------------------------------
D) RESOLUTION RULES (HOW VALUES FLOW)
------------------------------------------------

[x] D1. Single-source effective port resolver
    Same port universe used by:
    validateGraph / evaluateGraph / canvas cheap-check / UI pin listing

[x] D2. Evaluation produces resolved values
    inputsByNodeId and outputsByNodeId computed deterministically.

[x] D3. Compile applies feature overrides
    Evaluated virtual feature inputs override feature params before IR generation.

[ ] D4. Driver driven-mode resolution (future)
    If driver has incoming wire:
      baseValue = incomingValue
      UI locked for base value edits

[?] D5. Offset mode for numeric drivers (optional future)
    If driver is wired:
      effectiveValue = incomingValue + offset
      show incoming value read-only + editable offset control
      fill bar changes style/color in offset mode


------------------------------------------------
E) UI / UX VISION (WHAT IT FEELS LIKE)
------------------------------------------------

[x] E1. NodeView is generic
    Node rendering is template-driven; no part-specific branching.

[x] E2. Modes: collapsed / essentials / everything
    Same data, different visibility.

[ ] E3. “Everything” shows internal dependency visualization
    Drivers → Feature Stack wiring overlay (internal wires), enabled only in everything mode.

[ ] E4. Blender-style parameter interaction
    Drag-value bars, clean fields, resolved-value display when driven.

[ ] E5. Row ordering is customizable
    Deterministic per-part ordering metadata (implemented)
    (Future UX: drag reorder instead of buttons)


------------------------------------------------
F) EXPANSION NODES (WHAT MAKES IT POWERFUL)
------------------------------------------------

[ ] F1. Param Node (utility)
    Outputs number/boolean/vec2 values for wiring.

[ ] F2. Rail Math Node
    Produces railMath object for loft-related feature stacks.

[ ] F3. Profile Node(s)
    Provides sketch/profileLoop data into parts.

[ ] F4. Node Palette / Toolbar
    Create nodes quickly, categorized by type.


------------------------------------------------
G) STABILITY GUARANTEES (NON-NEGOTIABLES)
------------------------------------------------

[x] G1. No worker/protocol/scheduler changes for editor phases
[x] G2. Deterministic builds and diagnostics
[x] G3. Backward-compatible graphs
[x] G4. Reserved mesh output row stays disabled until endpoint exists
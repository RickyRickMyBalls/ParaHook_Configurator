# ParaHook Design Checklist

## A) Core Modeling Layers
- [x] A1. Graph layer (Spaghetti Graph)
- [x] A2. Part layer (Part Nodes)
- [x] A3. CAD layer (Feature Stack)

## B) Node Content Model
- [x] B1. Drivers (node-owned parameters)
- [x] B2. Inputs (external parameters)
- [x] B3. Feature Stack (internal operations)
- [x] B4. Outputs (things the node produces)

## C) Wires
- [x] C1. Wires are typed
- [x] C2. Wires are deterministic
- [x] C3. Whole-port wiring first
- [ ] C4. Driver to Input wires (Phase 2C v1)
- [ ] C5. Wire to Driver wires (Phase 2C v2)
- [ ] C6. Feature input wires
- [ ] C7. Feature outputs and internal wiring

## D) Resolution Rules
- [x] D1. Single-source effective port resolver
- [x] D2. Evaluation produces resolved values
- [x] D3. Compile applies feature overrides
- [ ] D4. Driver driven-mode resolution
- [ ] D5. Offset mode for numeric drivers (optional)

## E) UI / UX Vision
- [x] E1. NodeView is generic
- [x] E2. Modes: collapsed / essentials / everything
- [ ] E3. Everything mode internal dependency visualization
- [ ] E4. Blender-style parameter interaction
- [ ] E5. Row ordering drag reorder UX

## F) Expansion Nodes
- [ ] F1. Param Node (utility)
- [ ] F2. Rail Math Node
- [ ] F3. Profile Node(s)
- [ ] F4. Node Palette / Toolbar

## G) Stability Guarantees
- [x] G1. No worker/protocol/scheduler changes
- [x] G2. Deterministic builds and diagnostics
- [x] G3. Backward-compatible graphs
- [x] G4. Reserved mesh output row stays disabled until endpoint exists

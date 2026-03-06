## Phase 2B v2.0 — Feature Input Wiring Expansion

[ ] Select 1–2 additional feature parameters to wire (e.g., Extrude.taper, Extrude.offset, Fillet.radius)

Feature Virtual Ports
[ ] Extend featureVirtualPorts.ts to support new param IDs
[ ] Define new virtual port IDs: fs:in:<featureId>:<paramName>
[ ] Ensure listing order follows Feature Stack order
[ ] Enforce whole-port only (no path support)
[ ] Set maxConnectionsIn = 1

Resolver Integration
[ ] Extend effectivePorts.ts to include new feature virtual inputs
[ ] Ensure resolver remains single source of truth

Validation
[ ] Update validateGraph.ts to accept new feature virtual input ports
[ ] Enforce maxConnectionsIn = 1
[ ] Ensure deterministic diagnostic ordering

Evaluation
[ ] Extend evaluateGraph.ts to resolve values for new feature inputs
[ ] Populate inputsByNodeId[nodeId][virtualPortId]

Compile Integration
[ ] Update compileGraph.ts to override feature params (e.g., taper, offset)
[ ] Preserve deterministic override order

UI Integration
[ ] Add input pins in relevant FeatureView components (e.g., ExtrudeFeatureView.tsx)
[ ] Lock manual editor when feature param is driven
[ ] Display resolved value in UI

Tests
[ ] Add featureVirtualPorts tests for new param IDs
[ ] Add validateGraph tests for wiring acceptance/rejection
[ ] Add evaluateGraph tests for deterministic propagation
[ ] Add compileGraph tests confirming feature param override
[ ] Add UI tests verifying wiring pins and driven-state behavior

Verification
[ ] Run npm.cmd run test
[ ] Run npm.cmd run build


Phase 2B v2.0 — Feature Input Wiring Expansion

Goal
Expand Feature Stack wiring beyond Extrude.depth so additional feature parameters can be driven by the node graph.

Scope (v2.0 slice)
Add support for 1–2 additional numeric feature parameters using the same virtual-port pattern.

Example candidates:
- Extrude.taper
- Extrude.offset
- Fillet.radius
- Shell.thickness

Keep scope small and repeatable.

--------------------------------

Feature Virtual Port Contract

Port ID format:
fs:in:<featureId>:<paramName>

Examples:
fs:in:extrude1:taper
fs:in:extrude1:offset

Rules
- inputs only
- whole-port only (no path)
- maxConnectionsIn = 1
- external-only invariant maintained
- deterministic ordering = feature stack order

--------------------------------

Implementation Steps

1. featureVirtualPorts.ts
- extend port builders for additional params
- update listFeatureVirtualInputPorts()
- ensure deterministic ordering

2. effectivePorts.ts
- include new feature virtual inputs in listEffectiveInputPorts
- keep resolver as single source of truth

3. validateGraph.ts
- allow new feature virtual input endpoints
- enforce maxConnectionsIn = 1
- keep deterministic diagnostics

4. evaluateGraph.ts
- resolve wired values into inputsByNodeId[nodeId][virtualPortId]
- preserve deterministic evaluation order

5. compileGraph.ts
- extend override mapping:
  extrude.params.taper
  extrude.params.offset
  etc.

6. UI integration
- update FeatureView components
  - ExtrudeFeatureView.tsx
  - others if added
- render input pin for new feature params

--------------------------------

Test Plan

1. featureVirtualPorts tests
- correct port IDs
- deterministic ordering

2. validateGraph tests
- accept compatible wiring
- reject type mismatch
- enforce maxConnectionsIn

3. evaluateGraph tests
- wired values propagate deterministically

4. compileGraph tests
- overridden feature params reflected in generated IR

5. UI tests
- new wiring pins render
- driven state locks manual editor

--------------------------------

Verification

- npm.cmd run test
- npm.cmd run build

--------------------------------

Acceptance Criteria

- Additional feature parameters expose wiring pins
- Graph can drive those feature parameters
- Validation/evaluation/compile/UI all remain resolver-consistent
- Determinism maintained
- No worker/protocol/schema changes
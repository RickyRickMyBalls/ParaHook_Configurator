## Phase 2B v2.0 — Feature Input Wiring Expansion (Extrude taper + offset)

Legend: [ ] todo  [~] in progress  [x] done

Feature Scope Locks
[x] Lock supported params to exactly: Extrude.taper and Extrude.offset
[x] Lock virtual ID format: fs:in:<featureId>:extrude:<paramName>
[x] Lock whole-port behavior (no path support)
[x] Lock maxConnectionsIn = 1
[x] Lock external-only invariant for feature virtual inputs
[x] Lock unit contract: taper=deg, offset=mm

Feature Data Model
[ ] Add optional NumberExpression params to Extrude: taper?: NumberExpression, offset?: NumberExpression
[x] Lock default literal shape: { kind:'lit', value: 0 }
[ ] Ensure legacy stacks load without migration

Virtual Port Layer
[ ] Extend featureVirtualPorts.ts to build IDs for taper/offset
[ ] Ensure deterministic listing order follows feature stack order
[ ] Ensure type/unit metadata emitted correctly

Resolver Integration
[ ] Extend effectivePorts.ts input resolver to include new feature virtual inputs
[x] Maintain resolver ordering: declared → feature virtual → driver virtual
[x] Ensure no direct validator/canvas type lookup bypasses resolver (policy lock)

Validation Rules
[ ] Update validateGraph.ts to accept new feature virtual inputs
[ ] Enforce type + unit matching
[ ] Reject path usage with code FEATURE_VIRTUAL_INPUT_PATH_UNSUPPORTED
[x] Reuse existing same-node rejection code (FEATURE_WIRE_INTRA_NODE_UNSUPPORTED)
[x] Maintain deterministic diagnostics ordering (policy lock)

Cheap-Check Parity
[ ] Update validateConnectionCheap to match validator behavior
[ ] Reject path usage with same code/reason
[x] Reject occupied endpoints (no auto-replace for feature inputs)
[x] Maintain same accept/reject matrix as validateGraph (policy lock)

Evaluation Semantics
[ ] Resolve wired taper/offset values into inputsByNodeId
[x] Preserve deterministic evaluation ordering (policy lock)
[x] Wired-but-unresolved behavior lock:
    - emit INPUT_SOURCE_VALUE_MISSING
    - driven-unresolved state
    - no fallback to manual value

Compile Override
[ ] Extend compileGraph override mapping for taper and offset
[x] Lock deterministic override order: depth → taper → offset
[ ] Extend IRExtrude carry-through fields: taperResolved, offsetResolved
[x] IR policy lock: always emit resolved numeric values (default 0 if unwired)

UI Integration
[ ] Add taper input pin in ExtrudeFeatureView
[ ] Add offset input pin in ExtrudeFeatureView
[ ] Lock manual editor when param is driven
[ ] Display resolved value when driven
[x] Maintain unresolved-driven display behavior (policy lock)
[x] Ensure NodeView remains generic (policy lock)

Store / Defaults
[ ] Initialize taper and offset to literal 0 for new Extrude features
[ ] Preserve legacy feature stacks without forced migration

Tests
[ ] featureVirtualPorts.test.ts (IDs, order, type/unit)
[ ] validateGraph.test.ts (accept, mismatch, path)
[ ] SpaghettiCanvas.validation.test.ts (cheap-check parity)
[ ] evaluateGraph.test.ts (propagation + unresolved behavior)
[ ] compileGraph.test.ts (override + determinism)
[ ] UI tests (pins render + driven lock state)

Verification
[ ] npm.cmd run test
[ ] npm.cmd run build

Acceptance
[ ] Users can wire node.out → fs:in:<featureId>:extrude:taper
[ ] Users can wire node.out → fs:in:<featureId>:extrude:offset
[ ] Validation/evaluation/compile/UI parity maintained
[ ] No schema bump
[ ] No worker/protocol/scheduler changes
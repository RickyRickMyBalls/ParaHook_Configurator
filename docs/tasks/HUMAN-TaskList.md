
----------------------------------------------------------------------------------------------------------------------------
Rules:

1. NEVER delete or rewrite previous entries.
2. ALWAYS add new phases at the top of TASKLIST entries (directly under this rules block).
3. Keep the current formatting style (separator lines + checklist style) for all new entries.
4. Entry headers must follow this format:

   ## [NNN] YYYY-MM-DD HH:mm (Task Title)

5. Use the current system time when generating the entry.
6. `NNN` must be the next highest sequential number in the file.
end rules
----------------------------------------------------------------------------------------------------------------------------



----------------------------------------------------------------------------------------------------------------------------
#12
PHASE FS-4 — Multi-Part Feature Stack Support
----------------------------------------------------------------------------------------------------------------------------
[ ] Multi-part compilation
    [ ] Compile multiple part nodes in same graph
    [ ] Preserve deterministic part ordering

[ ] OutputPreview integration
    [ ] Render multiple parts
    [ ] Maintain slot ordering determinism

[ ] Assembly preparation
    [ ] Track part dependencies
    [ ] Prepare for boolean operations

[ ] Tests
    [ ] Multi-part compile determinism
    [ ] Multi-part preview rendering

[ ] Changelog + verification
    [ ] Add changelog entry
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------
#11
PHASE FS-3 — Feature Dependency Visualization
----------------------------------------------------------------------------------------------------------------------------
[ ] Internal dependency mapping
    [ ] Map feature → feature dependencies
    [ ] Map driver → feature dependencies

[ ] Visualization
    [ ] Display dependency wires inside node
    [ ] Toggle dependency view modes

[ ] Debug tooling
    [ ] Highlight dependency chains
    [ ] Surface feature evaluation order

[ ] Tests
    [ ] Deterministic dependency graph output
    [ ] VM snapshot tests

[ ] Changelog + verification
    [ ] Add changelog entry
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------------------------------------------
#10
PHASE FS-2 — Feature Stack Core Operations Expansion
----------------------------------------------------------------------------------------------------------------------------
[ ] Add additional feature types
    [ ] SketchProfile inputs
    [ ] Extrude variants
    [ ] Offset / taper support

[ ] Feature stack editing
    [ ] Reorder features
    [ ] Enable/disable features
    [ ] Deterministic feature rebuild

[ ] Dependency graph integrity
    [ ] Ensure feature dependencies remain deterministic
    [ ] Prevent invalid feature ordering

[ ] Tests
    [ ] Feature ordering tests
    [ ] Compile determinism tests

[ ] Changelog + verification
    [ ] Add changelog entry
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------------------------------------------
#9
PHASE FS-1 — Feature Stack Solid Contract Lock
----------------------------------------------------------------------------------------------------------------------------
[ ] Solid output contract
    [ ] Define canonical part output artifact contract
    [ ] Confirm OutputPreview slot port types

[ ] Feature stack output resolution
    [ ] Ensure feature stacks produce deterministic output artifacts
    [ ] Ensure evaluation marks part output readiness

[ ] Selector integration
    [ ] Ensure selectPreviewRenderVm uses artifact contract
    [ ] Ensure unresolved parts excluded from preview render

[ ] Determinism guarantees
    [ ] Confirm feature stack order deterministic
    [ ] Confirm compile payload stable across runs

[ ] Tests
    [ ] Deterministic compile snapshot tests
    [ ] Deterministic preview render tests

[ ] Changelog + verification
    [ ] Add changelog entry
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------------------------------------------
#8
PHASE FS-0C — Cube Part Node MVP
----------------------------------------------------------------------------------------------------------------------------
[ ] Part node registration
    [ ] Add new node type Part/Cube
    [ ] Register in PART_NODE_SPECS
    [ ] Add deterministic default params

[ ] Cube feature stack
    [ ] Implement rectangle sketch feature
    [ ] Rectangle accepts:
        [ ] width
        [ ] length
    [ ] Reuse Extrude feature for:
        [ ] height

[ ] Real wireable inputs
    [ ] Expose virtual feature input ports
        [ ] rect width
        [ ] rect length
        [ ] extrude depth
    [ ] Confirm they are real graph edges
    [ ] Confirm DR-1 diagnostics apply to them

[ ] Compile / evaluate path
    [ ] Ensure rectangle sketch compiles to existing sketch/profile IR
    [ ] Ensure extrude compiles via existing extrude IR
    [ ] Ensure cube produces valid PartArtifact

[ ] OutputPreview integration
    [ ] Confirm Cube connects to OutputPreview
    [ ] Confirm selectPreviewRenderVm includes cube
    [ ] Confirm unresolved inputs behave correctly

[ ] Viewer result
    [ ] Cube renders in Viewer
    [ ] Dimension rewiring updates deterministically

[ ] Tests
    [ ] Fixture graph: width/length/height inputs → Cube → OutputPreview
    [ ] Deterministic compile test
    [ ] Deterministic preview render selector test

[ ] Changelog + verification
    [ ] Add changelog entry
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------





----------------------------------------------------------------------------------------------------------------------------
#7
PHASE FS-0B — First Renderable Part Through Existing Part Pipeline
----------------------------------------------------------------------------------------------------------------------------
[ ] Part pipeline verification
    [ ] Confirm how part nodes map to partKey / PartArtifact
    [ ] Confirm PART_NODE_SPECS participation for new parts
    [ ] Confirm computeFeatureStackIrParts includes new part nodes
    [ ] Confirm OutputPreview consumes PartArtifacts via partKey

[ ] Feature stack compile path verification
    [ ] Confirm compileFeatureStack produces deterministic IR
    [ ] Confirm IR supports sketch + extrude path
    [ ] Confirm compileGraph includes new part output in payload

[ ] Runtime artifact verification
    [ ] Confirm worker runtime returns renderable artifact
    [ ] Confirm artifact shape is accepted by viewer pipeline
    [ ] Confirm deterministic artifact generation

[ ] OutputPreview path verification
    [ ] Confirm slot → nodeId → partKey resolution
    [ ] Confirm selectPreviewRenderVm includes new part artifact
    [ ] Confirm unresolved slot behavior preserved

[ ] Viewer verification
    [ ] Confirm viewer renders artifact from preview render VM
    [ ] Confirm deterministic render across repeated runs

[ ] Tests
    [ ] Add fixture graph: minimal part node → OutputPreview
    [ ] Add deterministic compile payload snapshot
    [ ] Add deterministic preview render selector snapshot

[ ] Changelog + verification
    [ ] Add changelog entry
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------



----------------------------------------------------------------------------------------------------------------------------
#6
PHASE DR-1 - Driver Diagnostics & Invalid Wiring Visualization
----------------------------------------------------------------------------------------------------------------------------
[x] Diagnostics Contract
[x] Define deterministic edge diagnostic kinds
    [x] ok
    [x] unresolved
    [x] typeMismatch
    [x] missingPort
    [x] cycle
[x] Create stable edge key helper (used by selectors + UI)
[x] Extend diagnostics output from resolver/validator layer
[x] Resolver / Validator Integration
[x] Emit edgeStatus map for every edge
[x] Include:
    [x] kind
    [x] message
    [x] blame (from / to / both)
[x] Ensure diagnostics are pure functions of graph + registry
[x] Selector Layer (VM-1 compliant)
[x] Extend selectDiagnosticsVm
[x] Add edgeStatus
[x] Add OutputPreview slotStatus
[x] Maintain deterministic ordering
[x] Canvas Rendering
[x] Read diagnostics from selectDiagnosticsVm
[x] Change edge style:
    [x] ok -> solid wire
    [x] error -> dashed wire
[x] Add CSS class for dashed edges
[x] Preserve hit-testing behavior
[x] Driver UI Indicators
[x] Show warning indicator on driver rows
[x] Tooltip message from diagnostics
[x] Only when driver input edge is non-ok
[x] Parts List Panel
[x] Add slot state:
    [x] ok
    [x] unresolved
    [x] empty
[x] Render warning indicator for unresolved slots
[x] Preserve invariant:
    [x] exactly one trailing empty slot
[x] Preview Rendering Behavior
[x] Skip unresolved slots during render
[x] Still show them in parts list UI
[x] Tests
[x] Deterministic diagnostics selector tests
[x] Edge cases
    [x] type mismatch
    [x] missing port
    [x] unresolved upstream value
    [x] cycle detection
[x] Changelog
[x] Add entry
[x] [070] Phase DR-1 Driver Diagnostics & Invalid Wiring Visualization
----------------------------------------------------------------------------------------------------------------------------
#5
PHASE VM-1B - Selector Contract Hardening
----------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------
PHASE VM-1B — Selector Contract Hardening
----------------------------------------------------------------------------------------------------------------------------
[ ] Selector barrel / import contract
    [ ] Standardize selector imports through:
        [ ] src/app/spaghetti/selectors/index.ts
    [ ] Remove direct ad-hoc selector imports in UI where they bypass the barrel
    [ ] Keep export surface deterministic and typed

[ ] Enforce selector-only UI access pattern
    [ ] SpaghettiCanvas must not derive node rows / port display / diagnostics locally
    [ ] NodeView must not derive driver row state / OutputPreview row state locally
    [ ] PartsListPanel must not build item state from raw graph locally
    [ ] ViewerHost must not derive preview render items from raw graph locally

[ ] Move remaining local derivation into selectors
    [ ] Move any remaining graph.nodes / graph.edges mapping/filtering used for VM shaping out of UI
    [ ] Move any remaining diagnostics grouping out of UI
    [ ] Move any remaining preview list shaping out of UI
    [ ] Move any remaining parts-list shaping out of UI
    [ ] Move any remaining port-display / row-display shaping out of UI

[ ] Harden selector contracts
    [ ] Explicitly type and export:
        [ ] NodeVm
        [ ] DriverRowVm
        [ ] PreviewRenderVm
        [ ] DiagnosticsVm
    [ ] Ensure UI components consume typed selector outputs directly
    [ ] Remove reliance on ad-hoc inferred VM object shapes in UI

[ ] Stable identity guarantees
    [ ] nodeVm includes stable nodeId
    [ ] driver rows include stable paramId / rowId
    [ ] preview items include stable slotId / nodeId identity
    [ ] diagnostics items include stable ids (edgeId / diagnostic id)
    [ ] React keys are derived from selector-provided stable identities, not recomputed locally

[ ] Referential stability / memoization hardening
    [ ] Add memoization guards where appropriate
    [ ] Avoid recreating equivalent VM arrays/objects when inputs are unchanged
    [ ] Keep selector outputs deterministic across repeated calls

[ ] Regression coverage
    [ ] Deterministic selector tests for repeated calls
    [ ] Snapshot tests for NodeVm shape
    [ ] Snapshot tests for DriverRowVm shape
    [ ] Snapshot tests for PreviewRenderVm shape
    [ ] Snapshot tests for DiagnosticsVm shape
    [ ] Regression tests ensuring UI-facing selectors remain stable across benign graph mutations

[ ] Scope / constraint lock
    [ ] No topology mutation in evaluation / selectors / render / compile
    [ ] Only graphCommands/ + normalizeGraphForStoreCommit may mutate topology
    [ ] No worker protocol changes
    [ ] No schemaVersion changes
    [ ] No OutputPreview invariant changes
    [ ] No compile/runtime behavior changes unless absolutely required to remove UI-local derivation drift

[ ] Changelog
    [ ] Add prepend-only CHANGELOG entry:
        [ ] [071] Phase VM-1B Selector Contract Hardening

[ ] Verification
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------------------------------------------
#4
PHASE CT-1 - Contract Lock (Resolver / Validator / Canvas Parity)
----------------------------------------------------------------------------------------------------------------------------

[x] Create shared endpoint contract module
    - src/app/spaghetti/contracts/endpoints.ts (or repo-appropriate location)
    - single source of truth for endpoint canonicalization + resolution + connection decision

[x] Implement canonicalization helpers
    - canonicalizeDriverPortId(portId)
    - driver aliases: drv:<id> <-> out:drv:<id>, drv:in:<id> <-> in:drv:<id>
    - canonicalizePortIdByNodeType(nodeType, portId)
    - OutputPreview slot ports: in:solid:<slotId>
    - feature virtual ports (extrude params)
    - canonical dynamic port families pass through unchanged
    - endpointKey canonicalization for maxConnections counting (driver inputs by paramId)

[x] Implement endpoint key helper
    - buildCanonicalEndpointKey(nodeId, portId, path?)
    - collapse in:drv:<paramId> and drv:in:<paramId> to one logical input key
    - keep non-driver keys stable + collision-free

[x] Implement unified endpoint resolver API
    - resolveEndpoint(graph, registry, endpoint) -> ResolvedEndpoint
    - ResolvedEndpoint includes: exists, nodeId, canonicalized portId, direction, type, optional, maxConnectionsIn, canonicalEndpointKey, path/leaf metadata
    - must use effectivePorts for dynamic ports and registry for static ports
    - no duplicated resolver logic in canvas/validator

[x] Implement shared connection decision function (with reason codes)
    - validateConnectionContract(...) -> { ok, code, details? }
    - standardized deterministic reason codes:
      OK, ERR_NO_SUCH_PORT, ERR_DIRECTION_MISMATCH, ERR_TYPE_MISMATCH, ERR_MAX_CONNECTIONS, ERR_PATH_REQUIRED, ERR_PATH_INVALID, ERR_EXTERNAL_ONLY
    - enforce path/composite rules currently enforced by validateGraph
    - include rewire/replace semantics for max-connection checks when relevant

[x] Wire Canvas cheap-check to shared connection decision
    - remove any duplicate logic; only call contract function
    - UI messaging must derive from reason code mapping (not ad-hoc strings)

[x] Wire validateGraph to shared connection decision
    - same decision + same reason codes (diagnostics reuse code)
    - keep compileGraph/evaluateGraph behavior unchanged

[x] Add parity test suite
    - cheap-check vs validateGraph agree on ok/deny + reason code
    - cover: driver ports (canonical + legacy), unit mismatch, maxConnectionsIn, OutputPreview slots, feature virtual ports, composite leaf paths (if applicable)
    - mixed canonical+legacy driver-input aliases count as one logical endpoint
    - OutputPreview dynamic slot ports resolve through effectivePorts
    - add helper path for asserting validateGraph reason codes in tests if not currently exposed at runtime
    - assert both:
      cheapCheck.ok === validateGraphDecision.ok
      cheapCheck.code === validateGraphDecision.code

[x] Update existing tests that depended on old reason strings (if any)

[x] Preserve architecture/scope locks
    - topology mutation allowed only in graphCommands + deterministic normalization
    - no topology mutation in evaluation/selector/render/compile
    - no worker protocol changes
    - no schemaVersion changes
    - no compileGraph/evaluateGraph behavior changes
    - no OutputPreview invariant changes
    - no new node types

[x] docs/CHANGELOG.md entry (next sequential index)
    - prepend-only rules + separator format + prepend proof
    - include first 25 lines prepend proof snippet in implementation response

[x] Verification
    - npm.cmd run test
    - npm.cmd run build

[x] Stop conditions (ask before proceeding)
    - if cheap-check is not test-accessible without broad UI refactor
    - if resolver consolidation spans too many modules beyond phase scope
    - if parity would require compileGraph/evaluateGraph behavior changes


    
----------------------------------------------------------------------------------------------------------------------------
#3
PHASE VM-1 — Derived View Model Selectors
----------------------------------------------------------------------------------------------------------------------------

[x] Create selector layer for derived UI state (no topology mutation)
[x] Implement selectNodeVm (node card rows, ports, sections)
[x] Implement selectDriverVm (driver row VMs, including offset-mode fields)
[x] Implement selectPreviewRenderVm (OutputPreview → render list VM parity with OP-5)
[x] Implement selectDiagnosticsVm (resolver/validation diagnostics surfaced to UI)
[x] Replace component-local derived state in SpaghettiCanvas with selectors
[x] Replace component-local derived state in NodeView with selectors
[x] Add deterministic selector tests (repeat calls deep-equal)
[x] CHANGELOG entry (next sequential index)
[x] Verification: npm.cmd run test + npm.cmd run build


----------------------------------------------------------------------------------------------------------------------------
#2
PHASE CK-1 — Graph Command Kernel (De-Spaghetti)
----------------------------------------------------------------------------------------------------------------------------


[x] Introduce graphCommands/ pure helpers for node + edge operations
[x] Move edge add/remove/replace logic out of SpaghettiCanvas into graphCommands
[x] Move driverInputAutoReplace and similar graph-mutation helpers into graphCommands
[x] Centralize repair/normalization entrypoint (commit boundary only)
[x] Add unit tests for commands (no UI dependency)
[x] Reduce canvas/component responsibilities to orchestration only
[x] Changelog: prepend next sequential entry
[x] Verification: npm.cmd run test + npm.cmd run build

----------------------------------------------------------------------------------------------------------------------------
#1 
PHASE 2C v2.2 — Numeric Offset Mode for Driven Numeric Drivers (Output+UI Scope)
----------------------------------------------------------------------------------------------------------------------------

[x] Extend part params schema to accept driverOffsetByParamId and driverDrivenByParamId (optional)
[x] Add commit-boundary normalization to initialize offset=0 when numeric driver first becomes driven
[x] Persist driven-state metadata driverDrivenByParamId deterministically (no topology changes)
[x] Preserve stored offsets on disconnect; clear driven-flag entry on disconnect
[x] Update driverVirtualPorts output value resolver to emit effectiveValue for driven numeric drivers
[x] Update driver VM to expose drivenValue/offset/effective/offsetMode fields
[x] Update SpaghettiCanvas to compute drivenValue + effectiveValue for VM (unresolved semantics preserved)
[x] Update NodeView to render driven layout (driven RO, offset editable, effective RO)
[x] Add scoped styling for driven offset mode (v15Theme.css)
[x] Extend handleDriverNumberChange to patch offset values (nodeParamOffset)
[x] Tests: store normalization (init, preserve, disconnect, non-numeric ignored)
[x] Tests: driverVirtualPorts (effective output only when driven)
[x] Tests: evaluateGraph (effective out:drv:* without eval-file edits, determinism, unresolved)
[x] Tests: validateGraph regression (unit mismatch still rejected)
[x] Tests: NodeView driven layout + unresolved rendering
[x] Changelog: prepend docs/CHANGELOG.md entry [066] with separators + prepend proof
[x] Verification: npm.cmd run test
[x] Verification: npm.cmd run build


----------------------------------------------------------------------------------------------------------------------------
#0
PHASE 1 - App Creation Foundation (Historical, entries [001]-[010])
----------------------------------------------------------------------------------------------------------------------------

Goal: preserve the earliest achieved foundation work that established the app/editor architecture.

[x] Built initial Spaghetti editor foundation (node add/search menu, typed ports, anchored floating editor)
[x] Established deterministic graph behavior (path-aware endpoints, stable validate/evaluate/compile ordering)
[x] Added advanced wire editing/routing (curviness, reroute points, tangency controls)
[x] Added inline numeric interaction model (value bars, drag-scrub, step controls, baseplate sketch inputs)
[x] Added composite field-tree/path system for leaf-level wiring and deterministic endpoint identity
[x] Completed Feature Stack v1 app-layer spec alignment (profile derivation, auto-link, diagnostics contract)
[x] Activated Feature Stack v1 worker runtime path (Option-B execution, deterministic part/feature/body order)
[x] Added IR-driven Feature Stack debug preview UI with deterministic labels/sorting/diagnostics
[x] Added row view mode system (collapsed / essentials / everything) + composite leaf rendering rules
[x] Stabilized interaction and performance guards (drag rerender guard, interactive target guard, anchor click mode lock)
[x] Completed early floating window UX hardening (default geometry + immediate drag behavior)
[x] Verified early phase quality gate repeatedly (`npm.cmd run test` and `npm.cmd run build`)





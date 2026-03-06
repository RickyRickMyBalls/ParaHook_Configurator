
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
---------------------------------------------------------------------------------------------------------------------------------
PHASE FS-4 — Multi-Part Feature Stack Support
----------------------------------------------------------------------------------------------------------------------------

[x] Multi-part compile support
    [x] Audit current compileGraph path for single-part assumptions
    [x] Allow multiple part-producing nodes to compile in one graph
    [x] Preserve deterministic discovered-part ordering
    [x] Preserve explicit nodeId -> partKey / partKeyStr ownership mapping
    [x] Keep single-part behavior as a valid subset of multi-part behavior

[x] Canonical multi-part identity
    [x] Define deterministic partKeyStr scheme for multiple graph parts
    [x] Always number duplicates of the same part-producing type
    [x] Keep source/build identity separate from preview slot identity
    [x] Preserve nodeId / partKey / partKeyStr as source/build identity
    [x] Do not use slotId/viewerKey as artifact identity

[x] Worker / build flow
    [x] Ensure existing worker/build path handles multiple canonical PartArtifacts
    [x] Preserve FS-1 PartArtifact contract unchanged
    [x] Preserve deterministic artifact ordering across repeated runs
    [x] Avoid introducing new worker protocol or message shapes

[x] OutputPreview integration
    [x] Allow multiple OutputPreview slots to resolve to valid artifacts at once
    [x] Preserve slot ordering from OutputPreview.params.slots
    [x] Preserve explicit mapping:
        [x] slotId -> sourceNodeId -> sourcePartKeyStr -> PartArtifact
    [x] Preserve unresolved slot behavior
        [x] unresolved slots remain visible in Parts List
        [x] unresolved slots remain excluded from preview rendering
    [x] Preserve exactly one trailing empty slot invariant

[x] Preview selector integration
    [x] Extend selectPreviewRenderVm for multiple preview entries
    [x] Preserve stable viewerKey / slotId preview identity
    [x] Preserve canonical source/build identity on artifacts
    [x] Keep output deterministic across repeated selector calls
    [x] Avoid node-type-specific preview logic

[x] Viewer integration
    [x] Ensure ViewerHost / Viewer render multiple preview entries deterministically
    [x] Preserve slot-scoped visibility/selection identity
    [x] Preserve existing single-part viewer behavior as a subset
    [x] Avoid special-casing Cube or specific part nodes

[x] Build Stats / cache alignment
    [x] Extend FS-1A stats flow for multiple spaghetti part rows
    [x] Key stats rows by canonical source/build partKeyStr
    [x] Preserve assembled row as final row
    [x] Preserve cache semantics without redesign
    [x] Ensure repeated unchanged multi-part builds show deterministic cache-hit rows

[x] Determinism / ordering rules
    [x] Keep compile/build order deterministic for source/build ownership
    [x] Keep preview/render order deterministic from OutputPreview slot order
    [x] Keep compile order and preview order explicitly mapped, not implicitly merged
    [x] Preserve repeated-run parity for the same multi-part graph

[x] Tests
    [x] Add multi-part compileGraph tests
    [x] Add deterministic part discovery / ordering tests
    [x] Add deterministic multi-artifact build output tests
    [x] Add OutputPreview multi-slot render selector tests
    [x] Add unresolved-slot behavior tests in multi-part graphs
    [x] Add stable slotId -> sourceNodeId -> sourcePartKeyStr -> artifact mapping tests
    [x] Add Build Stats / cache regression tests for multiple spaghetti parts
    [x] Add repeated compile/build parity tests for identical multi-part graphs

[x] Changelog + verification
    [x] Add next prepend-only CHANGELOG entry
    [x] [084] Phase FS-4 Multi-Part Feature Stack Support
    [x] npm.cmd run test
    [x] npm.cmd run build
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------









----------------------------------------------------------------------------------------------------------------------------
#19
DOCS POLICY â€” Rewrite AGENTS.md Into Clean Canonical Rules
----------------------------------------------------------------------------------------------------------------------------
[x] Instruction cleanup
    [x] Rewrite AGENTS.md into a cleaner canonical rules file
    [x] Preserve existing maintenance requirements
    [x] Consolidate duplicate guidance into a single readable flow

[x] Maintenance coverage
    [x] Keep CHANGELOG.md maintenance requirements explicit
    [x] Keep TASKLIST.md maintenance requirements explicit
    [x] Keep change-List.md maintenance requirements explicit

[x] Changelog + verification
    [x] Add changelog entry
    [x] [083] Docs Policy: Rewrite AGENTS.md Into Clean Canonical Rules
    [x] Review rewritten AGENTS.md for consistency
    [x] No build/test required for docs-only policy update

----------------------------------------------------------------------------------------------------------------------------
#18
DOCS POLICY â€” Preserve Full Completed Phase Blocks In Tasklist
----------------------------------------------------------------------------------------------------------------------------
[x] Tasklist retention rules
    [x] Forbid deletion of old phase task lists after completion
    [x] Require completed phases to remain as full checklist blocks
    [x] Require accomplished items to remain marked `[x]`

[x] Tasklist presentation rules
    [x] Keep visible phase headers for completed phase blocks
    [x] Keep separator-line section boundaries for completed phase blocks
    [x] Avoid collapsing completed work into one-line summaries only

[x] Changelog + verification
    [x] Add changelog entry
    [x] [082] Docs Policy: Preserve Full Completed Phase Blocks In Tasklist
    [x] Review updated AGENTS.md instructions
    [x] No build/test required for docs-only policy update

----------------------------------------------------------------------------------------------------------------------------
#17
PHASE FS-1 â€” Feature Stack Solid Contract Lock
----------------------------------------------------------------------------------------------------------------------------
[x] Solid output contract
    [x] Define canonical PartArtifact contract for part nodes
    [x] Confirm artifact fields required by ViewerHost
    [x] Confirm artifact fields required by OutputPreview
    [x] Ensure artifact identity stability (partKey / slotId mapping)

[x] Part node output standardization
    [x] Ensure all part nodes expose a canonical solid output
    [x] Confirm Part/Cube follows the same artifact contract
    [x] Ensure future parts can plug into the same output pipeline

[x] OutputPreview integration verification
    [x] Confirm OutputPreview consumes PartArtifact deterministically
    [x] Confirm slot ordering remains deterministic
    [x] Confirm slot -> nodeId -> partKey mapping is stable
    [x] Ensure unresolved slots remain visible but excluded from preview render

[x] Selector pipeline verification
    [x] Ensure selectPreviewRenderVm relies only on PartArtifact contract
    [x] Ensure unresolved artifacts do not enter preview render list
    [x] Confirm deterministic selector output ordering

[x] Compile pipeline guarantees
    [x] Confirm compileGraph emits stable artifact payload
    [x] Confirm feature stack evaluation order deterministic
    [x] Confirm compile payload stable across repeated runs

[x] Viewer pipeline verification
    [x] Confirm ViewerHost renders artifact contract without assumptions about node type
    [x] Confirm cube artifact renders identically across repeated builds

[x] Determinism tests
    [x] Add compile snapshot test for PartArtifact payload
    [x] Add preview render selector snapshot test
    [x] Add deterministic rebuild test for cube dimensions

[x] Changelog + verification
    [x] Add CHANGELOG entry (next sequential index)
    [x] [073] Phase FS-1 Feature Stack Solid Contract Lock
    [x] npm.cmd run test
    [x] npm.cmd run build

----------------------------------------------------------------------------------------------------------------------------
#16
PHASE VM-1B â€” Selector Contract Hardening
----------------------------------------------------------------------------------------------------------------------------
[x] Selector barrel / import contract
    [x] Standardize selector imports through:
        [x] src/app/spaghetti/selectors/index.ts
    [x] Remove direct ad-hoc selector imports in UI where they bypass the barrel
    [x] Keep export surface deterministic and typed

[x] Enforce selector-only UI access pattern
    [x] SpaghettiCanvas must not derive node rows / port display / diagnostics locally
    [x] NodeView must not derive driver row state / OutputPreview row state locally
    [x] PartsListPanel must not build item state from raw graph locally
    [x] ViewerHost must not derive preview render items from raw graph locally

[x] Move remaining local derivation into selectors
    [x] Move any remaining graph.nodes / graph.edges mapping/filtering used for VM shaping out of UI
    [x] Move any remaining diagnostics grouping out of UI
    [x] Move any remaining preview list shaping out of UI
    [x] Move any remaining parts-list shaping out of UI
    [x] Move any remaining port-display / row-display shaping out of UI

[x] Harden selector contracts
    [x] Explicitly type and export:
        [x] NodeVm
        [x] DriverRowVm
        [x] PreviewRenderVm
        [x] DiagnosticsVm
    [x] Ensure UI components consume typed selector outputs directly
    [x] Remove reliance on ad-hoc inferred VM object shapes in UI

[x] Stable identity guarantees
    [x] nodeVm includes stable nodeId
    [x] driver rows include stable paramId / rowId
    [x] preview items include stable slotId / nodeId identity
    [x] diagnostics items include stable ids (edgeId / diagnostic id)
    [x] React keys are derived from selector-provided stable identities, not recomputed locally

[x] Referential stability / memoization hardening
    [x] Add memoization guards where appropriate
    [x] Avoid recreating equivalent VM arrays/objects when inputs are unchanged
    [x] Keep selector outputs deterministic across repeated calls

[x] Regression coverage
    [x] Deterministic selector tests for repeated calls
    [x] Snapshot tests for NodeVm shape
    [x] Snapshot tests for DriverRowVm shape
    [x] Snapshot tests for PreviewRenderVm shape
    [x] Snapshot tests for DiagnosticsVm shape
    [x] Regression tests ensuring UI-facing selectors remain stable across benign graph mutations

[x] Scope / constraint lock
    [x] No topology mutation in evaluation / selectors / render / compile
    [x] Only graphCommands/ + normalizeGraphForStoreCommit may mutate topology
    [x] No worker protocol changes
    [x] No schemaVersion changes
    [x] No OutputPreview invariant changes
    [x] No compile/runtime behavior changes unless absolutely required to remove UI-local derivation drift

[x] Changelog
    [x] Add prepend-only CHANGELOG entry:
        [x] [071] Phase VM-1B Selector Contract Hardening

[x] Verification
    [x] npm.cmd run test
    [x] npm.cmd run build

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
PHASE FS-3 — Feature Dependency Visualization
----------------------------------------------------------------------------------------------------------------------------

[x] Dependency graph model
    [x] Add shared feature dependency analysis utility if not already present
    [x] Compute deterministic feature -> feature dependency mapping
    [x] Compute deterministic driver -> feature dependency mapping
    [x] Keep dependency analysis based on existing feature stack/source refs only
    [x] Do not mutate graph or feature order during dependency analysis

[x] Internal visualization data
    [x] Expose dependency visualization data through selector/VM path
    [x] Provide stable feature row identities for dependency endpoints
    [x] Provide stable driver row identities for dependency endpoints
    [x] Keep output deterministic across repeated calls

[x] Node UI rendering
    [x] Render internal dependency wires inside part nodes
    [x] Show Driver -> Feature connections
    [x] Show Feature -> Feature dependencies
    [x] Keep rendering scoped to the existing node UI architecture
    [x] Avoid part-specific branching in NodeView

[x] View modes / visibility
    [x] Add dependency visualization only in the intended node mode(s)
    [x] Keep default compact modes readable
    [x] Ensure dependency wires can be toggled or gated by mode cleanly

[x] Debug / inspection behavior
    [x] Surface feature evaluation order visually
    [x] Keep disabled/unresolved feature states readable alongside dependency wires
    [x] Preserve DR-1 diagnostic styling/readability

[x] Determinism / regression tests
    [x] Add deterministic dependency graph output tests
    [x] Add selector/VM snapshot coverage
    [x] Add regression tests for reordered / disabled features
    [x] Add regression tests for driver-fed feature dependencies

[x] Changelog + verification
    [x] Add next CHANGELOG entry
    [x] [081] Phase FS-3 Feature Dependency Visualization
    [x] npm.cmd run test
    [x] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------




----------------------------------------------------------------------------------------------------------------------------
PHASE FS-2 — Feature Stack Core Operations Expansion
----------------------------------------------------------------------------------------------------------------------------

[x] Feature operation expansion
    [x] Harden support for additional feature-stack-driven operations
    [x] Confirm sketch/profile-driven feature inputs compile deterministically
    [x] Confirm extrude parameter variants remain deterministic
    [x] Preserve existing Cube path while generalizing feature-stack behavior

[x] Feature editing behavior
    [x] Add deterministic feature reorder support
    [x] Add feature enable / disable support
    [x] Ensure rebuild behavior is deterministic after reorder/edit

[x] Dependency integrity
    [x] Define valid feature dependency ordering rules
    [x] Prevent invalid reorder that breaks upstream/downstream dependency assumptions
    [x] Keep compile/evaluate/runtime ordering aligned

[x] Compile integration
    [x] Ensure compileFeatureStack emits deterministic ordered IR
    [x] Ensure compileGraph preserves stable feature-stack payload ordering
    [x] Preserve FS-1 artifact contract unchanged

[x] UI integration
    [x] Keep feature stack UI generic and selector-driven
    [x] Ensure reordered/disabled features render correctly in existing feature UI
    [x] Avoid Cube-specific UI branching

[x] Regression coverage
    [x] Add feature ordering determinism tests
    [x] Add repeated compile snapshot/regression tests
    [x] Add feature enable/disable regression tests
    [x] Add invalid dependency-order regression tests

[x] Changelog + verification
    [x] Add next CHANGELOG entry
    [x] [080] Phase FS-2 Feature Stack Core Operations Expansion
    [x] npm.cmd run test
    [x] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------
PHASE FS-1 — Feature Stack Solid Contract Lock
----------------------------------------------------------------------------------------------------------------------------

[	] Solid output contract
[	] Define canonical PartArtifact contract for part nodes
[	] Confirm artifact fields required by ViewerHost
[	] Confirm artifact fields required by OutputPreview
[	] Ensure artifact identity stability (partKey / slotId mapping)

[	] Part node output standardization
[	] Ensure all part nodes expose a canonical solid output
[	] Confirm Part/Cube follows the same artifact contract
[	] Ensure future parts can plug into the same output pipeline

[	] OutputPreview integration verification
[	] Confirm OutputPreview consumes PartArtifact deterministically
[	] Confirm slot ordering remains deterministic
[	] Confirm slot → nodeId → partKey mapping is stable
[	] Ensure unresolved slots remain visible but excluded from preview render

[	] Selector pipeline verification
[	] Ensure selectPreviewRenderVm relies only on PartArtifact contract
[	] Ensure unresolved artifacts do not enter preview render list
[	] Confirm deterministic selector output ordering

[	] Compile pipeline guarantees
[	] Confirm compileGraph emits stable artifact payload
[	] Confirm feature stack evaluation order deterministic
[	] Confirm compile payload stable across repeated runs

[	] Viewer pipeline verification
[	] Confirm ViewerHost renders artifact contract without assumptions about node type
[	] Confirm cube artifact renders identically across repeated builds

[	] Determinism tests
[	] Add compile snapshot test for PartArtifact payload
[	] Add preview render selector snapshot test
[	] Add deterministic rebuild test for cube dimensions

[	] Changelog + verification
[	] Add CHANGELOG entry (next sequential index)
[	] npm.cmd run test
[	] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------





----------------------------------------------------------------------------------------------------------------------------
#8
PHASE FS-0C — Cube Part Node MVP
----------------------------------------------------------------------------------------------------------------------------
[ ] Replace proof node
    [ ] Introduce real part node type: Part/Cube
    [ ] Remove or deprecate Part/CubeProof
    [ ] Register Part/Cube in PART_NODE_SPECS
    [ ] Map cube -> 'cube' partKey

[ ] Cube part node defaults
    [ ] Provide deterministic default params for cube dimensions
    [ ] Seed featureStack with:
        [ ] rectangle sketch
        [ ] extrude feature

[ ] Public dimension control path
    [ ] Expose cube dimension inputs:
        [ ] width
        [ ] length
        [ ] height
    [ ] Ensure inputs are graph-wireable sources
    [ ] Ensure dimension values flow into feature stack deterministically

[ ] Feature stack geometry generation
    [ ] Rectangle sketch uses width + length
    [ ] Extrude depth uses height
    [ ] Confirm compileFeatureStack emits deterministic IR

[ ] Compile / evaluate path
    [ ] Ensure computeFeatureStackIrParts includes cube part
    [ ] Ensure compileGraph includes cube IR
    [ ] Ensure worker runtime executes cube feature stack
    [ ] Ensure cube produces valid PartArtifact

[ ] OutputPreview integration
    [ ] Connect Part/Cube output to OutputPreview slot via existing contract
    [ ] Confirm slot -> nodeId -> partKey -> artifact resolution works
    [ ] Confirm selectPreviewRenderVm includes cube when resolved
    [ ] Confirm unresolved-slot exclusion still works

[ ] Viewer integration
    [ ] ViewerHost renders cube artifact through existing path
    [ ] Confirm deterministic render across repeated runs
    [ ] Confirm dimension rewiring updates geometry deterministically

[ ] Diagnostics compatibility
    [ ] Ensure DR-1 diagnostics still apply to cube dimension wires
    [ ] Missing dimension inputs produce unresolved slot state
    [ ] Dashed wire rendering remains correct

[ ] Tests
    [ ] Fixture graph: numeric inputs -> Part/Cube -> OutputPreview
    [ ] Deterministic compileGraph payload snapshot
    [ ] Deterministic preview selector snapshot
    [ ] Negative-path test: missing dimension input -> no viewer render

[ ] Changelog + verification
    [ ] Add CHANGELOG entry [073] Phase FS-0C Cube Part Node MVP
    [ ] npm.cmd run test
    [ ] npm.cmd run build
----------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------





----------------------------------------------------------------------------------------------------------------------------
#7
PHASE FS-0B — First Renderable Part Through Existing Part Pipeline
----------------------------------------------------------------------------------------------------------------------------
[x] Part pipeline verification
    [x] Confirm how part nodes map to partKey / PartArtifact
    [x] Confirm PART_NODE_SPECS participation for new parts
    [x] Confirm computeFeatureStackIrParts includes new part nodes
    [x] Confirm OutputPreview consumes PartArtifacts via partKey

[x] Feature stack compile path verification
    [x] Confirm compileFeatureStack produces deterministic IR
    [x] Confirm IR supports sketch + extrude path
    [x] Confirm compileGraph includes new part output in payload

[x] Runtime artifact verification
    [x] Confirm worker runtime returns renderable artifact
    [x] Confirm artifact shape is accepted by viewer pipeline
    [x] Confirm deterministic artifact generation

[x] OutputPreview path verification
    [x] Confirm slot → nodeId → partKey resolution
    [x] Confirm selectPreviewRenderVm includes new part artifact
    [x] Confirm unresolved slot behavior preserved

[x] Viewer verification
    [x] Confirm viewer renders artifact from preview render VM
    [x] Confirm deterministic render across repeated runs

[x] Tests
    [x] Add fixture graph: minimal part node → OutputPreview
    [x] Add deterministic compile payload snapshot
    [x] Add deterministic preview render selector snapshot

[x] Changelog + verification
    [x] Add changelog entry
    [x] npm.cmd run test
    [x] npm.cmd run build
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





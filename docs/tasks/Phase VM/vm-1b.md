----------------------------------------------------------------------------------------------------------------------------
PHASE VM-1B - Selector Contract Hardening
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

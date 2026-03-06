Phase 3 — True Child-Container Migration (Optional)

[ ] Decide architecture: Drivers / Inputs / Feature Stack / Outputs become real child-node containers
[ ] Define container node types (DriverContainer, InputContainer, FeatureStackContainer, OutputContainer)
[ ] Define parent–child relationship between Part node and container nodes
[ ] Design migration strategy from current VM-row model to container model
[ ] Preserve backward compatibility for existing graphs
[ ] Implement adapter layer so current renderer continues to work during transition
[ ] Update nodeRegistry definitions to support container nodes
[ ] Extend effective port resolver to support ports on container nodes
[ ] Update validateGraph to traverse container nodes deterministically
[ ] Update evaluateGraph to resolve container node outputs deterministically
[ ] Ensure Feature Stack execution semantics remain unchanged
[ ] Update NodeView rendering pipeline to optionally render container children
[ ] Maintain deterministic ordering across containers
[ ] Update tests for container traversal, evaluation, and validation
[ ] Add migration tests for legacy graphs
[ ] Run full regression suite
[ ] Update changelog and architecture docs




Phase 3A — Container Model + Adapter (no migration)
- Add container node types + schemas
- Add parent→child relationship metadata
- Add adapter so current UI/evaluator can still use VM rows
- No graphs created using containers yet

Phase 3B — Dual-Read (containers + legacy)
- Renderer can read either:
  - legacy VM-row Part nodes, or
  - Part nodes with container children
- Resolver/validate/evaluate support both paths
- Deterministic ordering locked for both

Phase 3C — Migration (optional, gated)
- Add deterministic migration tool (legacy → containers)
- Keep compatibility window (load legacy without migrating)
- Add migration tests + rollback policy

Phase 3D — Default-On Containers (after proven)
- New nodes created with containers by default
- Legacy still supported

Phase 3E — Cleanup (much later)
- Remove dead adapter code only when you decide legacy support can end
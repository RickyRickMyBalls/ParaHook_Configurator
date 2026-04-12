# Cleanup Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership

## Doc Header

### Doc History
1. 2026-04-12 13:42: Created this standalone `Cleanup 6` future phase doc to hold the graph-runtime accepted-result ownership lane under the Cleanup family

### Purpose

This doc defines the sixth cleanup phase for the `Cleanup` family.

Use it to answer:
- where accepted graph/build result truth should live
- what should remain derived from graph runtime acceptance
- how this cleanup lane should be sequenced at a high level

Do not use it for:
- detailed graph-runtime implementation steps
- full Spaghetti store split planning
- worker scheduling redesign outside accepted-result ownership

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - cleanup framing for large ownership sinks

- `../Canonical-Ownership-Targets.md`
  - graph document and accepted-result ownership targets

- `../Canonical-Owner-Decisions.md`
  - owner-decision baseline

## Doc Body

## [ ] Cleanup 6 - Graph Runtime And Accepted Result Ownership

### Header

Purpose:
- keep graph document truth and accepted build-result truth clearly canonical in graph runtime state inside `useSpaghettiStore` while reducing app/project/Browser presentation to derived consumers

Owns:
- accepted-result ownership clarity
- graph runtime versus app presentation boundary
- one-owner direction for graph-local result acceptance

Does not own:
- full store decomposition for every graph concern
- worker lifecycle ownership beyond the accepted-result boundary
- Browser hierarchy cleanup except where it depends on derived result presentation

### Why This Phase Exists

One of the strongest cleanup hotspots is:
- accepted build output versus project presentation

When accepted result truth feels split between:
- graph runtime state
- app/project presentation
- Browser-facing structures

it becomes unclear where result acceptance should actually change.

This phase exists to make accepted result truth easier to localize.

### Scope

This phase covers:
- graph runtime acceptance ownership
- accepted draft and authoritative result ownership
- derived app/project/Browser presentation over accepted graph truth

This phase does not cover:
- every graph-editing concern
- general node or UI decomposition
- worker scheduling semantics that belong to the dispatcher lane

### Locked Direction

- graph documents and graph runtime truth live in `useSpaghettiStore`
- accepted draft and accepted authoritative result truth live in graph runtime state
- app-level project presentation and Browser structures derive from that accepted truth
- accepted-result ownership should not be split across multiple presentation layers

### Phase Ladder

## [ ] Phase 1 - Reconfirm Graph Runtime As The Accepted-Result Owner

Purpose:
- restate which accepted-result fields are canonical in graph runtime state

Focus:
- last accepted draft result
- last accepted authoritative result
- accepted build outputs
- accepted preview outputs
- accepted build impact

## [ ] Phase 2 - Trace Presentation-Layer Drift

Purpose:
- identify where app/project presentation or Browser-facing structures still feel like accepted-result owners instead of derived consumers

Likely hotspots:
- project presentation over published content
- Browser-facing result/status surfaces
- any store helpers that persist accepted-result meaning outside graph runtime

## [ ] Phase 3 - Tighten Derived Presentation Rules

Purpose:
- make app/project/Browser result surfaces explicitly derive from graph runtime acceptance instead of storing competing accepted-result truth

## [ ] Phase 4 - Prove One Accepted-Result Owner Remains

Purpose:
- verify that accepted-result changes can now be localized to graph runtime state without reopening several presentation layers at once

### Acceptance Checks

- accepted build-result truth has one obvious canonical owner
- app/project/Browser result surfaces read as derived
- graph-runtime acceptance is easier to reason about and change safely

### Likely Related Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`

### Success Read

This phase succeeds when:
- accepted-result behavior has one obvious home
- project presentation no longer competes with graph runtime as the owner
- later graph or Browser cleanup can treat accepted-result ownership as settled

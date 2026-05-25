# Build-Path-14 - Node Deletion And Reference Orphan Contract

## Doc Header

### Doc History
2. 2026-05-25 09:02:43: Implemented and closed Phase 1 with direct Spaghetti node deletion now resyncing Build Path cards from graph truth, while receive-reference reads preserve explicit unresolved dependency intent until undo restores the original source identity.
1. 2026-05-25 08:50:18: Added this Build Path planning phase so explicit Spaghetti node deletion can remove current Build Path cards while downstream reference intent survives as a visible orphaned or unresolved dependency.

### Purpose

This doc plans `Build-Path-14`.

Use it to answer:
- how Build Path should react when the user deletes a Sketch, Extrude, or later supported command node directly in Spaghetti
- how deleted reference-providing nodes should affect downstream consumers
- how undo/redo should restore both Build Path cards and reference resolution without making Build Path a second graph truth

Do not use it for:
- implementing restore, replay, branch-from-here, compare, or pin behavior
- silently remapping downstream references to replacement nodes
- making Build Path the owner of reference identity
- changing the graph file format before reference publication storage has its own schema phase

## Doc Body

`Build-Path-14` should make direct Spaghetti graph deletion honest across Build Path and future reference consumers.

The core product rule is:
- Build Path cards are projections of current graph-authored command nodes.
- If graph truth removes a command node, Build Path removes that command card.
- If another system held a reference to that node or one of its published outputs, that reference should remain as authored dependency intent but become explicitly unresolved or orphaned.

This keeps both surfaces honest:
- Build Path does not show a command card for a node that no longer exists.
- Reference consumers do not silently lose the fact that they depended on a deleted source.
- Undo can restore the deleted graph node and allow the same reference identity to resolve again.

### Boundary Rules

- Manual node deletion, command undo, graph load, and graph-history redo should converge through one graph-snapshot Build Path sync path.
- Deleted source nodes remove current Build Path presence for those nodes.
- Downstream references should not auto-bind to newly created replacement nodes.
- Reference repair should be explicit: rebind, delete the consumer, or restore the source through undo/redo or later Restore.
- Broken reference UI belongs to the reference-consuming surface or Browser/Properties read model, while Build Path may expose dependency warning badges only as derived readback.
- Build Path must not become the canonical reference registry.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-15. Treat direct Spaghetti node deletion as graph truth for Build Path card removal while preserving downstream reference intent as explicit unresolved or orphaned dependencies.

### `Build-Path-14 / Phase 1`

- [x] Route explicit Spaghetti node deletion through the same Build Path graph-snapshot sync used by graph-history restore.
- [x] Remove Build Path cards whose backing command nodes no longer exist.
- [x] Preserve existing graph lifecycle cards and unrelated graph events.
- [x] Preserve downstream reference records as unresolved or orphaned instead of deleting or remapping them silently.
- [x] Restore Build Path cards and reference resolution when undo restores the deleted node.
- [x] Add focused proof for deleting an Extrude node that currently feeds Build Path.
- [x] Add focused proof for a future reference-shaped consumer whose source node is deleted and then restored.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`

## [x] `Build-Path-14 / Phase 1` - `Manual Node Deletion Sync And Orphaned References`

### Phase 1 Summary

Make direct Spaghetti node deletion remove Build Path cards from current graph truth while preserving downstream dependency intent as explicit unresolved reference state.

### Phase 1 Implementation Spec

The implementation pass should:
- identify the explicit graph-node delete command path used by Spaghetti UI actions
- ensure that path resyncs Build Path from the post-delete graph snapshot
- remove Build Path events and dependency hints for deleted command nodes in the affected graph document
- keep graph lifecycle cards such as `Graph Created` and `Graph Loaded`
- keep unrelated graph-document Build Path events untouched
- define a reference read state for missing source node/output identity, even if Phase 1 uses a narrow test fixture before the full reference-provider UI exists
- avoid auto-rebinding unresolved references to replacement nodes
- prove undo restores the deleted node, Build Path card, and reference resolution state

Likely implementation seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/graphCommands/removeNode.ts`
- `src/app/buildPath/useBuildPathRuntimeStore.ts`
- `src/app/buildPath/reconstructBuildPathFromGraph.ts`
- future reference consumer/read-model owner once reference-providing nodes ship

Verification should cover:
- deleting a committed `Geometry/Extrude` node removes the `Extrude` Build Path card
- deleting a committed `Geometry/Sketch` node removes the `Sketch` Build Path card and any derived dependency lane hints
- undo restores deleted command cards from graph truth
- redo removes them again
- a reference consumer keeps an unresolved/orphaned read when its source node is deleted
- newly created replacement nodes do not silently satisfy the old reference
- `npm.cmd exec -- vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "deletes Build Path cards"`
- `npm.cmd exec -- tsc --noEmit`

Do not include:
- broad reference UI
- graph-file schema migration
- restore/replay execution
- compare, pin, or branch runtime
- automatic replacement-node matching
- Build Path-owned reference registry

### Phase 1 Implementation Result

Implemented.

What landed:
- direct Spaghetti `removeGraphNodeWithHistory` commits now apply the post-delete graph snapshot and immediately resync the affected Build Path runtime graph snapshot
- deleted command nodes disappear from current Build Path cards because command-card projection follows current graph truth
- undo and redo reuse graph-history snapshot restore so deleted cards return or disappear with the graph node identity
- existing receive-reference reads stay explicit: references keep their authored source graph/output ids, become unresolved when the source publication disappears, and resolve again when undo restores the original source identity

Verification:
- `npm.cmd exec -- vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "removes Build Path command cards when a graph node is deleted directly|keeps receive references orphaned" --reporter=verbose`
- `npm.cmd exec -- tsc --noEmit`

## Open Questions

- Which surface should first display unresolved reference repair actions: Browser, Properties, Spaghetti node rows, or Build Path warning badges?
- Should Build Path show a small warning on downstream cards when dependencies are missing, or should it only remove deleted-node cards and leave broken-input status to Spaghetti/reference consumers?
- What is the exact stable publication id shape for reference-providing command nodes once cross-graph references ship?

## Manager Packet

Assignment: `Implemented`.

Scope:
- direct Spaghetti node deletion
- Build Path current-card resync from graph truth
- reference orphan/unresolved-state contract
- undo/redo restoration proof

Exclusions:
- no restore/replay
- no implicit replacement binding
- no broad reference repair UI
- no graph-file schema migration
- no worker checkpoint/cache implementation

Build gate:
- focused node-delete/Build Path tests passed
- focused unresolved-reference read proof passed through existing receive-reference fixtures
- TypeScript passed

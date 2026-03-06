SYSTEM ROADMAP

PHASE OP-0 — OutputPreview Contract
[x] Define OutputPreviewSlot type
[x] Define OutputPreviewParams type
[x] Create outputPreviewNode.ts helper module
[x] Implement deterministic defaults
[x] Implement createOutputPreviewNode(graph)
[x] Implement createOutputPreviewNodePatch(graph)
[x] Extend NodeTypeId with "System/OutputPreview"
[x] Extend NodeDefinition metadata with isUserAddable
[x] Register OutputPreview node in registry
[x] Add Zod params schema
[x] Update add-node menu filtering
[x] Serialization compatibility tests
[x] Inert compile/evaluate tests
[x] CHANGELOG entry


PHASE OP-1 — OutputPreview Singleton Enforcement
[x] Implement ensureOutputPreviewSingletonPatch
[x] Deterministic duplicate resolution
[x] Edge cleanup for removed duplicates
[x] Create normalizeGraphForStoreCommit wrapper
[x] Integrate wrapper into setGraph
[x] Integrate wrapper into applyGraphPatch
[x] Integrate wrapper into init graph
[x] Integration tests
[x] CHANGELOG entry


PHASE OP-2 — Dynamic Slot Ports
[x] Extend effectivePorts resolver
[x] Emit ports from params.slots
[x] Port contract in:solid:<slotId>
[x] Type alias kind=toeLoft
[x] optional=true
[x] maxConnectionsIn=1
[x] Canvas dynamic pin rendering
[x] Resolver tests
[x] Validator tests
[x] CHANGELOG entry


PHASE OP-3 — Slot Normalization
[~] Create ensureOutputPreviewSlots.ts
[~] Implement slot seed logic
[~] Implement filled-slot detection
[~] Implement trailing empty invariant
[~] Implement append rule
[~] Implement trim rule
[~] Preserve slot order
[~] Integrate into normalizeGraphForStoreCommit
[~] Unit tests
[~] Store integration test
[~] CHANGELOG entry


PHASE OP-4 — OutputPreview Node UI
[ ] Create OutputPreview node renderer
[ ] Render slot rows from params.slots
[ ] Detect filled slots via edges
[ ] Display upstream node label/type
[ ] Display empty trailing slot row
[ ] Render real pin for in:solid:<slotId>
[ ] Preserve slot ordering
[ ] Ensure node drag/select behavior unaffected
[ ] Optional: locate upstream node button
[ ] Minimal render test
[ ] CHANGELOG entry

PHASE OP-5 — Viewer Integration

[ ] Create selectPreviewRenderList selector
[ ] Read filled OutputPreview slots
[ ] Resolve upstream solids from build outputs
[ ] Produce stable render entries keyed by slotId
[ ] Update ViewerHost to render only OutputPreview entries
[ ] Preserve deterministic ordering
[ ] Minimal integration test
[ ] CHANGELOG entry


PHASE OP-6 — Parts List Panel

[ ] Create PartsList panel
[ ] Read OutputPreview slots
[ ] Display filled slots as parts
[ ] Display upstream node labels
[ ] Sync panel with graph updates
[ ] CHANGELOG entry



Milestone After OP-5

When OP-5 completes, the full pipeline becomes live:

Baseplate.solid
      ↓
OutputPreview
      ↓
build()
      ↓
meshShape()
      ↓
Viewer

That is the first real geometry visible from the node graph.
Phase Plan — OutputPreview Singleton + Dynamic Slots + Viewer Hookup

Legend: [ ] todo [~] in progress [x] done

Phase OP-0 — Contracts and Node Registration

 Lock input type for OutputPreview ports (solid recommended)

 Add node type System/OutputPreview

 Register in nodeRegistry / schema

 Default params:

 slots=[{slotId:"s001"}]

 nextSlotIndex=2

Exit criteria

 Graph loads/saves OutputPreview deterministically

Phase OP-1 — Singleton + Non-deletable Invariants

 Implement ensureOutputPreviewSingleton(graph) -> GraphPatch|null

 auto-create if missing

 if multiple: keep smallest nodeId, remove extras deterministically

 Block delete in store/reducer command path

 Disable delete in UI paths (context menu + delete key)

Exit criteria

 Exactly one OutputPreview always exists

 Delete attempts do nothing deterministically

Phase OP-2 — Dynamic Slot Ports via Resolver

 Extend effectivePorts to emit input ports from params.slots

 portId = in:solid:<slotId>

 type=solid, maxConnectionsIn=1

 Confirm validator + cheap-check enumerate ports only via resolver

Exit criteria

 Canvas can connect Baseplate.solid → OutputPreview slot port

 Validation and cheap-check match

Phase OP-3 — Slot Normalization and Auto-Append

 Implement ensureOutputPreviewSlots(graph) -> GraphPatch|null

 if no slots → create one

 ensure exactly one trailing empty

 if trailing empty becomes connected → append new empty

 trim extra trailing empties deterministically

 no compaction

 deterministic slotId generation (use nextSlotIndex)

 Run this normalization:

 on load/init repair

 after edge add/remove commits

 after undo/redo restore

Exit criteria

 Connecting to the trailing empty slot always appends a new empty slot

 Slot identities remain stable

Phase OP-4 — OutputPreview Node UI + Parts List Panel

 Create OutputPreview node view rendering slot rows

 Show upstream node label/type for filled slots

 Show trailing empty slot input pin row

 Parts List panel reads filled slots in order

Exit criteria

 Parts list is driven purely by OutputPreview filled slots

Phase OP-5 — Viewer Hookup

 Implement selector: selectPreviewRenderList(graph, buildOutputs)

 read OutputPreview filled slots

 resolve upstream solid build output

 stable ordering = slot order

 stable keys = slotId

 Update ViewerHost to render only this list

Exit criteria

 Viewer renders only OutputPreview-connected parts

 Ordering stable and deterministic

Phase OP-6 — Tests + Verification + Changelog

 Singleton tests (missing/multiple/delete-block)

 Slot behavior tests (append/trim/no-compaction/deterministic ids)

 Preview integration smoke test

 npm.cmd run test

 npm.cmd run build

 Update docs/listofchanges.md

Exit criteria

 Tests pass

 Changelog updated with scope/constraints and verification steps
# Build-Path-12.1 - Graph Lifecycle Timeline Cards

## Doc Header

### Doc History
1. 2026-05-23 13:54:15: Added and prepped this Build Path follow-up phase to plan explicit `Graph Created` and `Graph Loaded` timeline cards before returning to Parallel lane icon layout.

### Purpose

This doc plans `Build-Path-12.1`.

Use it to answer:
- how Build Path should show graph lifecycle moments such as graph creation and graph file load
- how lifecycle cards differ from CAD/build operation cards such as Sketch and Extrude
- how loaded-graph reconstruction should be visually introduced before reconstructed build events appear

Do not use it for:
- graph-file schema changes
- persisted Build Path event history
- restore, branch-from-here, compare, or pin execution
- worker checkpoint/cache behavior
- full Parallel lane icon rendering

## Doc Body

`Build-Path-12.1` adds structural timeline cards for graph lifecycle events.

Build-Path-12 made loaded graph files produce reconstructed Sketch/Extrude events. The missing clarity is a card that says why those reconstructed events appeared. A loaded graph should not look like the user just performed Sketch/Extrude commands live; it should start with a `Graph Loaded` marker. A newly created graph should likewise have a `Graph Created` marker before its first build operation.

Boundary rule:
- Graph lifecycle cards are structural Build Path markers.
- They are not geometry build operations.
- They must not affect viewport preview masking as if they produced geometry.
- They must not mutate graph truth, Browser visibility, worker state, or Edit History.

## Vision

The healthy Build Path read is:
- project/global Build Path can show graph context changes
- `Graph Created` and `Graph Loaded` cards explain why a graph lane or reconstructed timeline begins
- lifecycle cards look different from Sketch/Extrude cards
- lifecycle cards can anchor Parallel lanes without pretending to be CAD operations
- loaded graph reconstruction remains honest and labeled as reconstructed

## Wishlist Organization

### High Level Goals

- [ ] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [ ] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [ ] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [ ] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [ ] Build-Path-Gen1-CLG-12. Add explicit graph lifecycle timeline cards for graph creation and graph load without treating them as geometry operations or Edit History.

### `Build-Path-12.1 / Phase 1`

- [ ] Define lifecycle event/card data for `Graph Created` and `Graph Loaded`.
- [ ] Decide how lifecycle cards relate to existing Build Path events and reconstructed events.
- [ ] Keep lifecycle cards non-geometry and non-restore.
- [ ] `Build-Path-Gen1-HLG-2`
- [ ] `Build-Path-Gen1-HLG-7`

### `Build-Path-12.1 / Phase 2`

- [ ] Record or derive a `Graph Created` card when a graph document is created.
- [ ] Record or derive a `Graph Loaded` card when a graph file is loaded.
- [ ] Ensure loaded graph reconstructed events appear after the load marker.
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] `Build-Path-Gen1-HLG-7`

### `Build-Path-12.1 / Phase 3`

- [ ] Render lifecycle cards distinctly from Sketch/Extrude build-operation cards.
- [ ] Prove lifecycle cards do not affect viewport geometry preview masking.
- [ ] Verify lifecycle cards support the later Parallel lane visual model.
- [ ] `Build-Path-Gen1-HLG-9`

## [ ] `Build-Path-12.1 / Phase 1` - `Lifecycle Card Contract`

### Phase 1 Summary

Define Build Path lifecycle card semantics for graph creation and graph loading.

### Phase 1 Implementation Spec

The implementation pass should:
- decide whether lifecycle cards are represented as a wider Build Path event union or as a separate timeline card model
- support at least `graph-created` and `graph-loaded`
- include graph document id, graph label/name, source kind, sequence, and display metadata
- mark lifecycle cards as structural and non-geometry
- keep existing Sketch/Extrude Build Path events compatible

Do not include:
- graph-file schema changes
- persisted event history
- viewport masking behavior
- restore/replay
- UI rendering

Verification should cover:
- lifecycle cards can sort with build-operation cards
- lifecycle cards preserve graph document identity
- lifecycle cards are not classified as Sketch/Extrude command truth

## [ ] `Build-Path-12.1 / Phase 2` - `Graph Created And Loaded Intake`

### Phase 2 Summary

Create lifecycle cards from graph creation and graph file-load seams.

### Phase 2 Implementation Spec

The implementation pass should:
- create a `Graph Created` card when a graph document is newly created in the app
- create a `Graph Loaded` card when a graph file is loaded
- keep reconstructed Sketch/Extrude events after the `Graph Loaded` card
- avoid duplicating lifecycle cards when the same loaded graph is refreshed
- preserve unrelated graph lifecycle/build cards

Do not include:
- changing file export format
- exact historical event persistence
- graph mutation outside the already-requested graph create/load action
- Edit History writes just for Build Path cards

Verification should cover:
- creating a graph produces a `Graph Created` card
- loading a graph produces a `Graph Loaded` card before reconstructed build cards
- repeated load refresh replaces stale loaded lifecycle/reconstructed data for that graph
- Edit History redo remains intact

## [ ] `Build-Path-12.1 / Phase 3` - `Lifecycle Card Display And Safety Proof`

### Phase 3 Summary

Render lifecycle cards as distinct Build Path timeline cards and prove they stay structural.

### Phase 3 Implementation Spec

The implementation pass should:
- add distinct display metadata/icon treatment for lifecycle cards
- ensure lifecycle cards do not produce viewport preview masks
- keep lifecycle cards selectable only as inspection context unless a later phase defines actions
- make the compact dock readable with lifecycle cards present
- leave full Parallel lane layout to Build-Path-11

Do not include:
- Parallel lane icon rendering beyond compatibility
- restore/branch/compare/pin execution
- worker checkpoint/cache behavior

Verification should cover:
- lifecycle cards render separately from Sketch/Extrude icons
- selecting `Graph Loaded` or `Graph Created` does not hide/show geometry as if it were a build operation
- focused Build Path tests
- `npx.cmd tsc -b`
- `npm.cmd run build` if runtime code changes

## Manager Packet

Assignment: `Packet` for now. Implement after user approval.

Scope:
- plan explicit `Graph Created` and `Graph Loaded` timeline cards
- keep them structural and non-geometry
- make them a bridge into Build-Path-11 Parallel lane layout

Exclusions:
- no runtime code changes in this setup pass
- no graph-file schema changes
- no persisted Build Path event history
- no restore/replay
- no worker cache implementation
- no Compare/Pin/Branch execution

Build gate:
- docs-only setup does not require build
- runtime implementation phases will require focused Build Path tests, `npx.cmd tsc -b`, and `npm.cmd run build`

Stop condition:
- Build-Path-12.1 is ready for implementation once the user confirms lifecycle cards should land before Build-Path-11 visual lane work.

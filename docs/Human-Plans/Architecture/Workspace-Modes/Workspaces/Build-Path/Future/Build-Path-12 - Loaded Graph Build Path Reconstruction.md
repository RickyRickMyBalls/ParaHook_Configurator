# Build-Path-12 - Loaded Graph Build Path Reconstruction

## Doc Header

### Doc History
2. 2026-05-23 12:45:30: Implemented and closed `Build-Path-12 / Phases 1-3` with pure loaded-graph reconstruction, reconstructed source markers, graph-load runtime intake, focused tests, typecheck, and production build.
1. 2026-05-23 12:27:02: Added and prepped this future Build Path phase after deciding to pause Parallel lane implementation until loaded graphs can produce an honest reconstructed Build Path read from graph structure.

### Purpose

This doc plans `Build-Path-12`.

Use it to answer:
- how Build Path should behave when a user loads an existing graph file
- how much build-path truth can be reconstructed from graph nodes and edges
- how reconstructed timeline data should stay visually and semantically separate from true recorded command history

Do not use it for:
- persisted Build Path event history in graph/project files
- exact historical replay from old files
- restore, branch-from-here, compare, or pin execution
- worker checkpoint/cache behavior
- Parallel lane icon rendering polish

## Doc Body

`Build-Path-12` adds the missing loaded-graph Build Path read.

Current Build Path events are live accepted command events. When a graph is loaded from a `.parahook-graph.json` file, the graph contains nodes and edges, but it does not contain the true creation order. Build Path can still derive a useful structural timeline and dependency read, as long as the result is marked as reconstructed instead of recorded.

Boundary rule:
- loaded-graph Build Path reconstruction is a derived read from graph structure
- it must not claim exact user history, mutate graph truth, write file-format metadata, or create Edit History entries
- persisted Build Path event history belongs to a later file-format phase if the product direction asks for exact reopen/replay truth

## Vision

The healthy loaded-graph read is:
- loaded graphs are not blank in Build Path when they contain supported build nodes
- reconstructed events are honest and deterministic
- dependency lanes come from graph edges, not guessed user intent
- live recorded events remain the stronger source of truth
- persisted event history remains a later explicit schema phase

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-11. Reconstruct a derived Build Path timeline and dependency read when graph files are loaded, while marking the source as reconstructed and preserving graph/Edit History truth.

### `Build-Path-12 / Phase 1`

- [x] Add a pure graph-structure reconstruction helper.
- [x] Derive supported Sketch and Extrude events from loaded graph nodes.
- [x] Derive dependency hints from graph edges.
- [x] Mark reconstructed events as reconstructed rather than recorded.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-12 / Phase 2`

- [x] Feed reconstructed events into Build Path runtime when a graph file is loaded.
- [x] Replace stale reconstructed events for the same graph without clearing unrelated live events.
- [x] Preserve Edit History undo/redo stacks.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-12 / Phase 3`

- [x] Prove loaded graph reconstruction works for Sketch -> Extrude and independent branch structures.
- [x] Verify Parallel mode can use reconstructed dependency hints later.
- [x] Record persisted Build Path event history as a deferred follow-up, not part of this phase.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`

## [x] `Build-Path-12 / Phase 1` - `Pure Loaded Graph Reconstruction`

### Phase 1 Summary

Create a pure Build Path helper that reconstructs timeline events and dependency hints from a loaded graph document.

### Phase 1 Implementation Spec

The implementation pass should:
- inspect graph nodes and create reconstructed Build Path events for supported build node types
- initially support `Geometry/Sketch` as `Sketch` and `Geometry/Extrude` as `Extrude`
- sort reconstructed events deterministically from graph dependencies and file order
- derive graph dependency hints from edges between reconstructed event nodes
- include output ids where graph output-preview edges provide them
- mark reconstructed events with an explicit source marker

Do not include:
- file-format schema changes
- persisted Build Path event history
- UI changes
- restore/replay
- branch/compare/pin execution

Verification should cover:
- empty/unsupported graph produces no reconstructed events
- Sketch -> Extrude graph produces Sketch then Extrude
- independent Sketch/Extrude chains keep deterministic order and dependency hints
- reconstructed events are marked reconstructed

### Phase 1 Result

Implemented `src/app/buildPath/reconstructBuildPathFromGraph.ts`.

Result:
- reconstructs `Geometry/Sketch` and `Geometry/Extrude` graph nodes as Build Path events
- marks events with `sourceKind: reconstructed`
- derives dependency hints from graph edges between supported build nodes
- derives output ids from Output Preview solid input edges where available
- keeps unsupported graph nodes out of the reconstructed timeline

Verification:
- `npm.cmd test -- --run src/app/buildPath/reconstructBuildPathFromGraph.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathViewportPreview.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts -t "reconstructBuildPathFromLoadedGraph|Build Path runtime state|deriveBuildPathMasterTimeline|BuildPathSurface|deriveBuildPathViewportPreviewRead|applyBuildPathViewportPreviewMaskToLayerRecipe|loadGraphDocumentFromFile creates a clean file-load cached entry"`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## [x] `Build-Path-12 / Phase 2` - `Loaded Graph Runtime Intake`

### Phase 2 Summary

Feed reconstructed loaded-graph Build Path data into the runtime store when graph files are loaded.

### Phase 2 Implementation Spec

The implementation pass should:
- call the reconstruction helper after normal graph-file load normalization
- replace previous reconstructed data for the same graph id
- preserve unrelated live recorded events and unrelated reconstructed graph reads
- avoid Edit History writes
- avoid saving reconstructed data back into the graph file

Do not include:
- graph-file export schema changes
- project-file event persistence
- rebuilding worker checkpoints
- UI lane rendering changes

Verification should cover:
- `loadGraphDocumentFromFile` populates reconstructed Build Path events
- loading the same graph again replaces stale reconstructed events instead of duplicating them
- unrelated graph events remain present
- Edit History redo remains intact

### Phase 2 Result

Implemented loaded graph runtime intake.

Result:
- `loadGraphDocumentFromFile` reconstructs Build Path data after graph normalization and writes it into the Build Path runtime store
- `loadGraphDocumentIntoNewGraphFromFile` reconstructs against the fresh cloned graph id
- the Build Path runtime can replace stale reconstructed events/dependencies for one graph without clearing unrelated recorded events
- no graph file schema changes were made

Verification:
- focused graph-load store test confirms a loaded Sketch -> Extrude graph creates reconstructed Build Path events and dependencies
- runtime replacement test confirms stale reconstructed data is replaced without clearing unrelated recorded data

## [x] `Build-Path-12 / Phase 3` - `Proof And Follow-Up Routing`

### Phase 3 Summary

Close the loaded-graph reconstruction phase and route exact history persistence to a later phase.

### Phase 3 Implementation Spec

The implementation pass should:
- run focused Build Path reconstruction and graph-load tests
- run TypeScript and production build
- update Build Path family docs only for achieved behavior
- explicitly defer persisted Build Path event history into a later phase

Do not include:
- Build-Path-11 Parallel icon rendering implementation
- graph/project file schema changes
- restore/branch/compare/pin execution

Verification should cover:
- focused Build Path tests
- focused graph load test
- `npx.cmd tsc -b`
- `npm.cmd run build`

### Phase 3 Result

Closed the phase and routed exact event persistence to later work.

Result:
- focused reconstruction tests cover unsupported graphs, dependent Sketch -> Extrude, and independent branch chains
- focused graph-load test covers runtime population on `.parahook-graph.json` load
- full production build passes
- persisted Build Path event history remains deferred to a later schema/file-format phase
- initial full `useSpaghettiStore.test.ts` run still showed existing OutputPreview expectation mismatches around `publicationMode` fields; the focused graph-load test passed and those failures are outside Build-Path-12

Verification:
- `npm.cmd test -- --run src/app/buildPath/reconstructBuildPathFromGraph.test.ts src/app/buildPath/buildPathRuntime.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/buildPathViewportPreview.test.ts src/app/spaghetti/store/useSpaghettiStore.test.ts -t "reconstructBuildPathFromLoadedGraph|Build Path runtime state|deriveBuildPathMasterTimeline|BuildPathSurface|deriveBuildPathViewportPreviewRead|applyBuildPathViewportPreviewMaskToLayerRecipe|loadGraphDocumentFromFile creates a clean file-load cached entry"`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## Manager Packet

Assignment: `Packet + Implement`.

Scope:
- implement loaded graph structural reconstruction for supported Sketch/Extrude graph nodes
- feed reconstructed graph reads into Build Path runtime on graph-file load
- preserve live recorded events, graph truth, and Edit History

Exclusions:
- no graph-file export schema change
- no persisted Build Path event history
- no Build-Path-11 icon-lane UI implementation
- no restore/replay
- no worker cache implementation
- no Compare/Pin/Branch execution

Build gate:
- focused Build Path reconstruction tests
- focused graph load test
- `npx.cmd tsc -b`
- `npm.cmd run build`

Stop condition:
- Complete. Build Path reconstructs a timeline for loaded Sketch/Extrude graph files and this doc defers exact persisted event history to a later phase.

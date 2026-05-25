# Build-Path-11 - Parallel Lane Icon Layout

## Doc Header

### Doc History
8. 2026-05-25 10:27:42: Implemented and closed Phases 3-6 by unboxing the workspace Parallel topology graph from the nested `Parallel` panel chrome, adding UI-only top/center/bottom alignment controls, collapsing lane readback behind a secondary disclosure, polishing connector/card spacing, and adding focused proof that alignment changes preserve graph truth, semantic connector colors, and Edit History boundaries; browser smoke was attempted but the `iab` browser backend was unavailable in this session.
7. 2026-05-25 10:14:53: Added follow-up phases for the post-Phase-2 visual direction: unbox the Parallel graph from the nested panel so it can live directly in workspace space, add user-facing topology alignment controls for top/center/bottom placement of source and sink cards against sibling stacks, and move the lane readback into a secondary/collapsible role before final proof closeout.
6. 2026-05-25 10:06:57: Implemented Phase 2 by replacing the hidden-only topology readback with a visible workspace Parallel topology renderer: fixed-size Build Path icon cards in topology columns, an SVG mini-connector layer colored from connector records, selectable command topology cards wired through the existing branch playhead path, and focused DOM proof for the canonical `1 > 6 > 1` layout with six `sketchProfile` and six `solidBody` connectors.
5. 2026-05-25 10:01:11: Prepped Phase 2 for implementation as the visible topology renderer over the Phase 1 read model: render compact Build Path icon cards in topology columns, draw mini SVG/CSS connectors from connector records, preserve semantic wire colors, keep branch playhead selection wired through existing timeline ids, and treat viewport-docked painting as conservative until workspace mode proves the `1 > 6 > 1` layout.
4. 2026-05-25 09:48:43: Implemented Phase 1 by adding the derived Build Path topology layout read model, endpoint-aware dependency metadata, Spaghetti edge-source-kind reuse, OutputPreview sink dependency reconstruction, hidden Parallel-surface topology readback attributes, and focused proof for the `Sketch -> six parallel Extrudes -> Output` `1 > 6 > 1` shape with `sketchProfile` and `solidBody` connector color semantics.
3. 2026-05-25 09:27:31: Prepped Phase 1 for implementation by locking the first code slice to a derived topology layout read model, explicit fan-out/fan-in proof from `Graph-1.parahook-graph-PARALLEL.json`, and connector color semantics that should reuse Spaghetti's `resolveCanvasEdgeSourceKind` plus `getTypeColor` path rather than inventing Build Path-only lane colors.
2. 2026-05-25 09:22:10: Added the clarified Parallel icon-card graph topology target: Build Path 11 should render a compact icon-card projection of Spaghetti fan-out/fan-in structure, with connector colors derived from the underlying reference wire semantics, using the `Graph-1.parahook-graph-PARALLEL.json` Sketch to six Extrudes to Output graph as the canonical proof case.
1. 2026-05-23 12:27:02: Added and prepped this future Build Path phase to clean up Parallel mode by drawing branch-local build icons in parallel lanes instead of reading independent branch work as one cramped linear strip.

### Purpose

This doc plans `Build-Path-11`.

Use it to answer:
- how Parallel mode should draw Build Path icons side by side when independent branch lanes exist
- how branch-local icon placement should become a compact icon-card projection of Spaghetti graph topology
- how fan-out and fan-in patterns such as `Sketch -> six Extrudes -> Output` should read as `1 > 6 > 1`
- how mini connector lines should keep the same semantic color language as the source reference wires
- what needs to stay true before later branch comparison, restore, or authored branch creation work starts

Do not use it for:
- changing branch classification truth
- changing accepted Build Path event order
- graph layout or Spaghetti node layout
- restore, branch-from-here, compare, or pin execution
- worker checkpoint/cache behavior
- replacing the Master timeline

## Doc Body

`Build-Path-11` is a visual cleanup phase for the already-shipped Parallel mode.

Current behavior has enough branch/dependency data to know when independent work exists, but the visual lane read still needs to become easier to understand. Parallel branch work should be drawn as parallel icon lanes, not only as a compressed serial-looking strip.

Clarified product target:
- Parallel mode should feel like a compact icon-card version of the Spaghetti graph.
- Build Path should still use the existing command icon cards, not full Spaghetti node cards.
- Connector lines between icon cards should preserve the source reference wire color language.
- If one Sketch feeds six independent Extrudes and all six feed one OutputPreview node, the Build Path Parallel read should show one Sketch icon card, six parallel Extrude icon cards, and one Output icon card: `1 > 6 > 1`.
- The canonical example graph for this shape is `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json`.

Boundary rule:
- Parallel lane icon layout is a Build Path presentation read over existing timeline and branch-lane derivations.
- It must not invent new dependency truth, reorder the master timeline, mutate graph truth, or make scrub movement into restore behavior.
- Mini connector colors must derive from graph dependency edge or port semantics, matching the Spaghetti reference-wire color family, not arbitrary lane colors.

The user has now clarified the desired visual shape. This plan should prep implementation around topology projection: shared upstream command cards fan out into sibling parallel icon lanes, then shared downstream output or merge cards fan those lanes back into the common master story.

## Vision

The healthy Build Path Parallel read is:
- Master mode keeps one accepted event order.
- Parallel mode shows a compact icon-card graph projection of the Spaghetti dependency topology.
- Parallel mode uses Build Path icon cards as graph nodes and mini connector lines as graph edges.
- Connector line colors preserve the same semantic language as Spaghetti wires, such as Sketch profile references into Extrude and SolidBody/output references into OutputPreview.
- Independent branch chains should be visually parallel where the available dependency data supports it.
- Sibling command nodes are parallel when they share an upstream dependency but do not depend on each other.
- A shared downstream OutputPreview/output node should collapse parallel sibling lanes back into one sink card.
- The canonical proof shape is `Sketch -> six parallel Extrudes -> Output`, visually reading as `1 > 6 > 1`.
- Merge or checkpoint candidates should stay anchored to the common master story instead of pretending every lane is a separate authored history.
- The compact viewport-docked presentation should stay usable and should not become a full graph editor.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-10. Draw Parallel mode branch-local build icons in derived parallel lanes without changing master timeline order, graph truth, or Edit History.
- [x] Build-Path-Gen1-CLG-10.1. Derive a compact topology icon layout from graph dependencies so fan-out/fan-in structures such as `Sketch -> six Extrudes -> Output` render as icon cards connected by semantically colored mini wires.

### `Build-Path-11 / Phase 1`

- [x] Inventory the current Parallel mode render shape and branch-lane data available to the UI.
- [x] Define the visual lane model for side-by-side icon placement as a compact Spaghetti topology projection.
- [x] Define fan-out/fan-in grouping for shared-source sibling commands and shared downstream output/sink cards.
- [x] Define connector color mapping from dependency edge/port semantics to the existing Spaghetti reference-wire color language.
- [x] Use `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json` as the first canonical proof fixture.
- [x] Preserve Master timeline order as the ordering truth.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 2`

- [x] Render branch-local icons in parallel lanes where lane data exists.
- [x] Render fan-out/fan-in icon-card groups with mini connector lines between cards.
- [x] Color mini connector lines from the source reference wire semantics.
- [x] Keep branch-local selected/playhead styling readable per lane.
- [x] Preserve compact viewport-docked constraints.
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 3`

- [x] Remove the nested `Parallel` panel/frame feeling so the topology graph can live directly in Build Path workspace space.
- [x] Keep the Master/Parallel toggle near the timeline while letting the active Parallel graph breathe in the empty workspace.
- [x] Preserve the graph as a Build Path presentation read, not a graph editor.
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 4`

- [x] Add user-facing topology alignment controls for `Align Top`, `Align Center`, and `Align Bottom`.
- [x] Let alignment control source/sink card placement against wider sibling stacks without changing graph truth.
- [x] Keep `Align Center` as the safe default unless user testing points to a better default.
- [x] Prove bottom alignment can match the user's sketched baseline-style layout.
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 5`

- [x] Move the lane readback out of the primary visual stack.
- [x] Make lane readback secondary, collapsed, or detail-oriented once the topology graph is visible.
- [x] Improve connector/card polish after the graph is unboxed and alignment controls exist.
- [x] Add manual/browser proof and record remaining follow-up direction.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`

### `Build-Path-11 / Phase 6`

- [x] Add focused tests for independent branch lane icon placement and master-order preservation.
- [x] Verify the side-panel app with a Sketch plus independent/dependent branch setup if the live setup is available.
- [x] Record any visual follow-up that requires more product direction from the user.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`

## [x] `Build-Path-11 / Phase 1` - `Parallel Lane Visual Model`

### Phase 1 Summary

Define exactly how existing Build Path branch-lane data should become a side-by-side icon layout in Parallel mode.

Prep status:
- implemented as the derived topology read-model slice
- final painted connector SVG/path UI remains deferred to Phase 2
- proof now covers the `1 > 6 > 1` topology and connector color metadata before Phase 2 paints the final connector UI

Implementation status:
- `deriveBuildPathTopologyLayout(...)` now produces topology columns, icon-card nodes, output sink nodes, and connector records from the Build Path master timeline plus graph dependency metadata
- `BuildPathGraphDependency` can carry source/target port ids, connector semantic kind, and resolved connector color
- loaded graph reconstruction now preserves command-to-command dependencies and Extrude-to-OutputPreview sink dependencies with endpoint metadata
- Spaghetti's edge source-kind resolver was extracted into a shared helper so Build Path can reuse the same wire semantics as the canvas
- Parallel mode exposes hidden `data-build-path-topology-*` readback attributes for Phase 1 proof without changing the visible branch-lane UI
- the canonical proof shape is covered by `src/app/buildPath/reconstructBuildPathFromGraph.test.ts`

### Phase 1 Implementation Spec

The implementation pass should:
- add a derived topology layout read, likely in a new helper near `src/app/buildPath/buildPathTimeline.ts`, instead of stretching the current branch-lane projection to do two jobs
- keep `deriveBuildPathBranchProjection(...)` available for branch-local playheads and existing Parallel readback, but add a topology read that can represent shared-source fan-out and shared-sink fan-in
- ingest the active graph dependencies plus enough graph edge endpoint metadata to recover edge ids, source/target node ids, source/target port ids, and connector semantic kind
- treat `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json` as the canonical fixture for `Sketch -> six Extrudes -> Output`
- output a deterministic shape with topology columns, icon-card nodes, and connector records
- represent command nodes as Build Path icon cards, not full Spaghetti cards
- represent OutputPreview or output publication as a compact output/sink icon card when it is the shared downstream destination
- define mini connector line semantics and color mapping from dependency edge/port types
- reuse or extract Spaghetti's existing wire-color semantics where possible: `resolveCanvasEdgeSourceKind(...)` in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` and `getTypeColor(...)` in `src/app/spaghetti/canvas/typeColors.ts`
- preserve `sketchProfile` / `sketchProfiles` connector color semantics for SketchProfile-to-Extrude edges and `solidBody` connector color semantics for Extrude-to-OutputPreview edges
- keep Master mode unchanged
- use a stacked middle-lane topology for the first proof: column 1 source card, column 2 six sibling Extrude cards, column 3 output sink card
- keep the docked strip decision conservative: Phase 1 may expose layout metadata and data attributes without final viewport-dock painting, while Phase 2 can tune the compact scroll/stack presentation
- preserve stable event ids, timeline step ids, branch lane ids, and branch-local playheads

### Phase 1 Data Shape

The implementation should prefer an explicit read model over ad hoc JSX grouping.

Suggested types:
- `BuildPathTopologyLayout`
  - `status`: `empty`, `single-step`, `dependency-hints-unavailable`, `ready`
  - `columns`: ordered `BuildPathTopologyColumn[]`
  - `nodes`: ordered `BuildPathTopologyNode[]`
  - `connectors`: ordered `BuildPathTopologyConnector[]`
  - `sourceGraphDocumentId`
- `BuildPathTopologyNode`
  - stable id
  - kind: `command`, `output-sink`, or `lifecycle-anchor`
  - optional `timelineStepId`
  - optional `nodeId`
  - display metadata reused from Build Path icon cards
  - column index and lane index
- `BuildPathTopologyConnector`
  - stable id
  - source topology node id
  - target topology node id
  - graph edge id
  - source and target endpoint port ids
  - semantic color kind such as `sketchProfile`, `sketchProfiles`, or `solidBody`
  - resolved color value from the same Spaghetti type-color map

Canonical fixture expectation:
- source column: one Sketch command card for `node-018b75f8-cf1c-45e6-917a-de92f37ba2bb`
- middle column: six Extrude command cards, one per Extrude node in `Graph-1.parahook-graph-PARALLEL.json`
- sink column: one OutputPreview/output sink card for `node-18a758ee-34d0-45a0-8473-774edca4c4e9`
- connectors: six SketchProfile-to-Extrude connectors using `sketchProfile` or the equivalent normalized Sketch profile semantic color, plus six SolidBody-to-OutputPreview connectors using `solidBody`
- master timeline ids and event order remain unchanged

### Phase 1 Likely Code Tasks

1. Add a topology-layout helper and tests.
2. Add or widen dependency metadata so reconstructed and live Build Path graph dependencies can carry edge endpoint port ids where available.
3. Load or mirror enough of `Graph-1.parahook-graph-PARALLEL.json` in a focused test fixture to prove the `1 > 6 > 1` topology.
4. Add lightweight Build Path surface readback attributes if useful, such as `data-build-path-topology-state`, `data-build-path-topology-columns`, `data-build-path-topology-node-kind`, and `data-build-path-topology-connector-kind`.
5. Leave final connector SVG/path painting to Phase 2 unless the Phase 1 implementation naturally needs a minimal read-only preview for verification.

Do not include:
- new dependency inference
- graph mutation
- worker replay
- restore or branch execution
- compare or pin behavior
- broad restyling outside Build Path
- arbitrary lane coloring disconnected from Spaghetti wire/reference semantics

Likely seams:
- `src/app/buildPath/BuildPathSurface.tsx`
- `src/app/buildPath/buildPathRuntime.ts`
- `src/app/buildPath/buildPathTimeline.ts`
- `src/app/buildPath/reconstructBuildPathFromGraph.ts`
- `src/app/buildPath/recordBuildPathGraphCommand.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/typeColors.ts`
- `src/app/theme/foundation/base.css`
- focused Build Path tests

Verification should cover:
- [x] Master mode still renders in accepted event order
- [x] Parallel mode can read the branch lanes needed for layout
- [x] the example graph shape can be read as one Sketch source, six parallel Extrude siblings, and one OutputPreview sink
- [x] connector color metadata can be derived from the underlying dependency edge or port semantics
- [x] missing/insufficient branch lane data stays honest instead of drawing fake parallelism
- [x] focused topology helper tests prove `1 > 6 > 1`
- [x] focused surface tests prove the read model is available without mutating Edit History, graph truth, or master selection

Verification run:
- `npm.cmd test -- --run src/app/buildPath/reconstructBuildPathFromGraph.test.ts src/app/buildPath/buildPathTimeline.test.ts src/app/buildPath/BuildPathSurface.test.tsx src/app/spaghetti/canvas/SpaghettiCanvas.validation.test.ts`
- `npm.cmd exec -- tsc --noEmit`
- `npm.cmd run build`

## [x] `Build-Path-11 / Phase 2` - `Parallel Icon Lane Rendering`

### Phase 2 Summary

Render independent branch-local Build Path icons in visibly parallel lanes.

Prep status:
- implemented as the visible workspace-hosted topology renderer over the Phase 1 read model
- the hidden-only topology readback is now a visible compact topology preview inside workspace-hosted Parallel mode
- the first visible proof targets the `Sketch -> six parallel Extrudes -> Output` `1 > 6 > 1` graph shape
- viewport-docked rendering remains conservative; the visible topology preview currently lives in workspace-hosted Parallel mode

Implementation status:
- `BuildPathTopologyRead` now renders a visible grid of fixed-size icon cards from `deriveBuildPathTopologyLayout(...)`
- topology columns drive the visual x-axis, while topology `laneIndex` drives the row position for sibling parallel cards
- one-card source/sink columns span and center against the widest sibling lane stack
- connectors render as SVG paths behind the cards and read stroke color from `BuildPathTopologyConnector.connectorColor`
- command topology cards select through the existing branch playhead path, preserving Edit History boundaries
- the older branch lane list remains available underneath as a conservative readback/fallback while the topology renderer matures

### Phase 2 Implementation Spec

The implementation pass should:
- render from `deriveBuildPathTopologyLayout(...)`; do not rebuild topology by re-scanning events inside JSX
- keep `BuildPathParallelModeRead` as the workspace Parallel container, but split the topology renderer into a small component if the JSX grows past simple markup
- treat topology columns as the visual x-axis and `laneIndex` as the y-axis inside each column
- use existing `BuildPathStepIcon` glyphs for command topology cards
- add a compact OutputPreview/output sink glyph or reuse the lifecycle-card visual language for the sink card if that keeps the first slice smaller
- make topology cards fixed-size icon controls with short accessible labels and stable data attributes
- draw connectors as an absolutely positioned SVG layer or CSS line layer behind/under the icon cards
- source connector endpoints from `BuildPathTopologyConnector.fromTopologyNodeId` and `toTopologyNodeId`; avoid guessing from DOM order
- color connector strokes from `BuildPathTopologyConnector.connectorColor`
- preserve connector semantic kind data attributes such as `sketchProfile`, `sketchProfiles`, and `solidBody`
- keep the existing branch lane list available as fallback/readback until the topology preview has equivalent selection affordances
- make command topology cards selectable by reusing the existing timeline step id and branch selection path where possible
- draw branch-local icons in lane rows or columns according to the Phase 1 visual model
- draw topology connector lines between icon cards while preserving the Build Path icon-card scale
- color SketchProfile/Profile-to-Extrude connectors with the same semantic color family as those references use in Spaghetti
- color Extrude/SolidBody-to-Output connectors with the same semantic color family as those references use in Spaghetti
- keep master context visible enough that the user can understand where the branch lane belongs
- show selected branch-local playheads without hiding the selected master step readback
- keep icon controls stable in size so lane labels, hover states, and selection states do not shift the dock
- preserve the compact viewport-docked Build Path surface and the normal titlebar behavior for split/tiled/windowed hosting

### Phase 2 Layout Contract

The first visible renderer should use a deterministic grid:
- one column per topology column from the Phase 1 read model
- one row per lane slot needed by the widest column
- icon cards centered in their column/row slot
- `Sketch -> six Extrudes -> Output` renders as:
  - column 1: one Sketch icon card vertically centered against the six-lane middle column
  - column 2: six Extrude icon cards stacked as sibling parallel lanes
  - column 3: one Output icon card vertically centered against the six-lane middle column
- connectors draw from the right side of the source card to the left side of the target card
- connector lines may be straight or gently curved in Phase 2, but must not overlap card icons enough to hide them
- connector line color is the connector record color, not lane color
- if topology status is `empty` or has insufficient connectors, keep the existing honest empty/single-step/dependency-hints read

Do not include:
- graph layout changes
- new graph document creation
- compare UI
- restore/branch execution
- pin persistence
- worker checkpoint/cache implementation
- replacing the Master timeline strip
- changing how timeline selection enters Edit History

Verification should cover:
- [x] two independent branch chains can still draw through the existing branch lane fallback/read
- [x] the canonical `Sketch -> six Extrudes -> Output` graph draws as `1 > 6 > 1`
- [x] mini connector colors preserve reference-wire semantics
- [x] a dependent chain remains visually connected to its dependency lane/read
- [x] selected branch-local playhead styling is readable
- [x] Edit History entry counts are unchanged by lane selection
- [x] focused DOM tests can find three topology columns, six middle Extrude cards, one Output sink card, twelve connectors, six `sketchProfile` connectors, and six `solidBody` connectors
- [x] `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/reconstructBuildPathFromGraph.test.ts`
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build`

Likely implementation seams:
- `src/app/buildPath/BuildPathSurface.tsx`
- `src/app/buildPath/BuildPathSurface.test.tsx`
- `src/app/theme/foundation/base.css`
- `src/app/buildPath/buildPathTimeline.ts` only if Phase 2 needs tiny presentational fields added to the read model

Stop condition:
- workspace-hosted Parallel mode visibly renders the Phase 1 topology read as compact icon cards and semantically colored connectors, with the canonical `1 > 6 > 1` proof passing in focused tests.

## [x] `Build-Path-11 / Phase 3` - `Unboxed Parallel Graph Surface`

### Phase 3 Summary

Remove the nested panel/card feeling from the visible Parallel topology graph so it can occupy Build Path workspace space directly.

Implementation status:
- workspace Parallel mode no longer renders the visible `Parallel` header/frame around the topology graph
- the topology graph sits directly in the Build Path workspace body under the existing Master/Parallel mode switch
- the graph remains a presentation read over `deriveBuildPathTopologyLayout(...)`; no graph editing, dragging, or mutation was added
- existing viewport-docked strip behavior remains outside the workspace-only Parallel read

### Phase 3 Implementation Spec

The implementation pass should:
- remove the visible `Parallel` box/frame around the topology graph in workspace-hosted Parallel mode
- keep the Master/Parallel toggle near the top timeline controls
- let the topology graph sit directly in the workspace body with enough breathing room
- avoid turning the graph into a draggable or authored graph editor
- keep the existing Build Path workspace shell/titlebar behavior intact
- keep the topology renderer derived from `deriveBuildPathTopologyLayout(...)`
- preserve the existing branch lane readback as secondary until Phase 5 handles its final placement
- avoid breaking the viewport-docked icon strip

Do not include:
- alignment controls
- draggable cards
- graph layout mutation
- lane readback redesign beyond keeping it from visually dominating the graph
- restore/branch/compare/pin behavior

Verification should cover:
- [x] workspace-hosted Parallel mode renders the topology graph without an inner `Parallel` panel box
- [x] the Master/Parallel toggle remains available
- [x] the canonical `1 > 6 > 1` graph remains visible
- [x] Edit History stays unchanged by switching modes or selecting topology cards
- [x] `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx`
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build`

## [x] `Build-Path-11 / Phase 4` - `Topology Alignment Controls`

### Phase 4 Summary

Give users explicit `Align Top`, `Align Center`, and `Align Bottom` controls for source/sink card placement against a parallel sibling stack.

Implementation status:
- workspace Parallel mode now has compact icon alignment controls for top, center, and bottom placement
- `center` remains the default after reset
- one-card source and sink columns align to the first lane, midpoint, or last lane against wider sibling stacks
- alignment is stored as Build Path UI state and does not mutate graph truth or create Edit History entries
- connector paths recompute from the active alignment mode while preserving semantic connector color records

### Phase 4 Implementation Spec

The implementation pass should:
- add a compact icon control group for topology alignment in workspace-hosted Parallel mode
- use familiar alignment icons or tight icon+tooltip controls instead of explanatory in-app copy
- support `top`, `center`, and `bottom` alignment modes
- keep `center` as the default at first
- make `top` align one-card source/sink columns with the first sibling lane
- make `center` align one-card source/sink columns with the visual midpoint of the sibling stack
- make `bottom` align one-card source/sink columns with the last sibling lane, matching the user's sketch
- store alignment as Build Path UI state, not graph truth
- keep alignment changes out of Edit History unless a later phase explicitly makes layout preferences undoable
- keep connector paths recomputed from the rendered alignment mode

Do not include:
- manual card dragging
- persistent graph-layout coordinates
- Spaghetti node layout changes
- graph mutation
- lane readback redesign

Verification should cover:
- [x] top alignment places the Sketch and Output cards on the first Extrude lane for the `1 > 6 > 1` graph
- [x] center alignment preserves the current centered source/sink read
- [x] bottom alignment places the Sketch and Output cards on the last Extrude lane
- [x] alignment changes do not mutate graph truth or create Edit History entries
- [x] connector colors remain semantic after alignment changes
- [x] `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx`
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build`

## [x] `Build-Path-11 / Phase 5` - `Lane Readback And Topology Polish`

### Phase 5 Summary

Move the lane readback into a secondary role and polish the now-unboxed topology graph.

Implementation status:
- branch lane readback is collapsed by default behind a secondary `Lane readback` disclosure
- connector stroke thickness, opacity, card size, and column spacing were tuned for the unboxed graph surface
- selected topology-card styling remains readable without replacing semantic connector colors
- lane readback remains available for branch/debug proof when explicitly expanded

### Phase 5 Implementation Spec

The implementation pass should:
- decide whether lane readback is collapsed by default, moved to a side/detail area, or hidden behind a small disclosure
- keep lane readback available for branch/debug/proof value without competing with the primary topology graph
- tune connector thickness, opacity, and spacing after unboxing and alignment controls land
- tune icon card scale and horizontal spacing so source, sibling stack, and output are easier to scan
- keep selected-card styling readable without making selected cards overpower connector colors
- preserve all graph-truth and Edit History boundaries

Do not include:
- new alignment modes beyond top/center/bottom
- graph mutation
- manual card dragging
- restore/branch/compare/pin behavior

Verification should cover:
- [x] lane readback no longer visually dominates the primary topology graph
- [x] topology graph remains readable in workspace-hosted Build Path
- [x] selected card and connector colors remain legible
- [x] focused Build Path rendering tests
- [x] manual/browser smoke when available; attempted against `http://localhost:5173/ParaHook_Configurator/`, but the `iab` browser backend was unavailable in this session

## [x] `Build-Path-11 / Phase 6` - `Parallel Lane Proof And Follow-Up Routing`

### Phase 6 Summary

Prove the new Parallel lane icon layout and record any next visual cleanup that needs more product direction.

Implementation status:
- focused surface tests cover the `1 > 6 > 1` visible icon-card topology, semantic connector colors, branch readback disclosure, top/center/bottom alignment, and Edit History safety
- TypeScript and production build passed after the runtime/style changes
- in-app browser smoke was attempted after confirming a local 5173 server was listening, but the Browser plugin reported `iab` unavailable
- no additional product-direction-dependent visual follow-up was invented beyond leaving future restore, compare, pin, worker cache, and deeper layout persistence outside this phase

### Phase 6 Implementation Spec

The implementation pass should:
- add focused tests for lane layout data and rendered Parallel-mode state
- add focused proof for `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json`
- run TypeScript and production build when runtime source changes
- verify in the in-app browser if a live branch setup is available
- update the Build Path family docs only for behavior actually achieved
- leave unresolved visual choices as explicit follow-up notes instead of silently stretching this phase

Do not include:
- expanding the scope into restore, branch-from-here, compare, pin, or worker checkpoint behavior
- changing Master scrub semantics
- changing viewport preview masking

Verification should cover:
- [x] the `Graph-1.parahook-graph-PARALLEL.json` fixture produces one source card, six parallel sibling cards, one output sink card, and reference-colored connector metadata
- [x] focused Build Path tests
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] `npm.cmd run build` if runtime source changes
- [x] in-app browser smoke check at `http://localhost:5173/ParaHook_Configurator/` when a live branch scenario is available; attempted, but the `iab` browser backend was unavailable in this session

## Manager Packet

Assignment: `Phases 3-6 Closeout`.

Scope:
- keep this as a Parallel-mode visual layout cleanup
- unbox the Parallel graph from nested panel chrome
- add top/center/bottom topology alignment controls
- move lane readback into a secondary role
- polish topology connector/card spacing
- preserve and extend the `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json` proof case

Exclusions:
- no restore/replay
- no graph mutation
- no manual card dragging or persisted graph layout coordinates
- no worker cache implementation
- no Compare/Pin/Branch execution

Build gate:
- [x] focused Build Path surface rendering tests for each follow-up implementation slice
- [x] `npm.cmd exec -- tsc --noEmit`
- [x] production build if runtime/component styling changes ship

Stop condition:
- Build-Path-11 renders an unboxed workspace Parallel topology graph with UI-only alignment controls, collapsed secondary lane readback, semantic connector colors, focused proof, TypeScript proof, and production build proof.

# Build-Path-11 - Parallel Lane Icon Layout

## Doc Header

### Doc History
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

- [ ] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [ ] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [ ] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [ ] Build-Path-Gen1-CLG-10. Draw Parallel mode branch-local build icons in derived parallel lanes without changing master timeline order, graph truth, or Edit History.
- [ ] Build-Path-Gen1-CLG-10.1. Derive a compact topology icon layout from graph dependencies so fan-out/fan-in structures such as `Sketch -> six Extrudes -> Output` render as icon cards connected by semantically colored mini wires.

### `Build-Path-11 / Phase 1`

- [x] Inventory the current Parallel mode render shape and branch-lane data available to the UI.
- [x] Define the visual lane model for side-by-side icon placement as a compact Spaghetti topology projection.
- [x] Define fan-out/fan-in grouping for shared-source sibling commands and shared downstream output/sink cards.
- [x] Define connector color mapping from dependency edge/port semantics to the existing Spaghetti reference-wire color language.
- [x] Use `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json` as the first canonical proof fixture.
- [x] Preserve Master timeline order as the ordering truth.
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] `Build-Path-Gen1-HLG-6`
- [ ] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 2`

- [ ] Render branch-local icons in parallel lanes where lane data exists.
- [ ] Render fan-out/fan-in icon-card groups with mini connector lines between cards.
- [ ] Color mini connector lines from the source reference wire semantics.
- [ ] Keep branch-local selected/playhead styling readable per lane.
- [ ] Preserve compact viewport-docked constraints.
- [ ] `Build-Path-Gen1-HLG-6`
- [ ] `Build-Path-Gen1-HLG-7`

### `Build-Path-11 / Phase 3`

- [ ] Add focused tests for independent branch lane icon placement and master-order preservation.
- [ ] Verify the side-panel app with a Sketch plus independent/dependent branch setup if the live setup is available.
- [ ] Record any visual follow-up that requires more product direction from the user.
- [ ] `Build-Path-Gen1-HLG-5`
- [ ] `Build-Path-Gen1-HLG-6`

## [~] `Build-Path-11 / Phase 1` - `Parallel Lane Visual Model`

### Phase 1 Summary

Define exactly how existing Build Path branch-lane data should become a side-by-side icon layout in Parallel mode.

Prep status:
- implementation-ready packet is prepared
- no runtime code has shipped yet
- Phase 1 should land the derived read model and proof tests before Phase 2 paints the final connector UI

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
- Master mode still renders in accepted event order
- Parallel mode can read the branch lanes needed for layout
- the example graph can be read as one Sketch source, six parallel Extrude siblings, and one OutputPreview sink
- connector color metadata can be derived from the underlying dependency edge or port semantics
- missing/insufficient branch lane data stays honest instead of drawing fake parallelism
- focused topology helper tests prove `1 > 6 > 1`
- focused surface tests prove the read model is available without mutating Edit History, graph truth, or master selection

## [ ] `Build-Path-11 / Phase 2` - `Parallel Icon Lane Rendering`

### Phase 2 Summary

Render independent branch-local Build Path icons in visibly parallel lanes.

### Phase 2 Implementation Spec

The implementation pass should:
- draw branch-local icons in lane rows or columns according to the Phase 1 visual model
- draw topology connector lines between icon cards while preserving the Build Path icon-card scale
- color SketchProfile/Profile-to-Extrude connectors with the same semantic color family as those references use in Spaghetti
- color Extrude/SolidBody-to-Output connectors with the same semantic color family as those references use in Spaghetti
- keep master context visible enough that the user can understand where the branch lane belongs
- show selected branch-local playheads without hiding the selected master step readback
- keep icon controls stable in size so lane labels, hover states, and selection states do not shift the dock
- preserve the compact viewport-docked Build Path surface and the normal titlebar behavior for split/tiled/windowed hosting

Do not include:
- graph layout changes
- new graph document creation
- compare UI
- restore/branch execution
- pin persistence
- worker checkpoint/cache implementation

Verification should cover:
- two independent branch chains draw as distinct parallel lanes
- the canonical `Sketch -> six Extrudes -> Output` graph draws as `1 > 6 > 1`
- mini connector colors preserve reference-wire semantics
- a dependent chain remains visually connected to its dependency lane/read
- selected branch-local playhead styling is readable
- Edit History entry counts are unchanged by lane selection

## [ ] `Build-Path-11 / Phase 3` - `Parallel Lane Proof And Follow-Up Routing`

### Phase 3 Summary

Prove the new Parallel lane icon layout and record any next visual cleanup that needs more product direction.

### Phase 3 Implementation Spec

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
- the `Graph-1.parahook-graph-PARALLEL.json` fixture produces one source card, six parallel sibling cards, one output sink card, and reference-colored connector metadata
- focused Build Path tests
- `npx.cmd tsc -b`
- `npm.cmd run build` if runtime source changes
- in-app browser smoke check at `http://localhost:5173/ParaHook_Configurator/` when a live branch scenario is available

## Manager Packet

Assignment: `Implementation-ready Prep`.

Scope:
- reserve and prep the Build-Path-11 family phase
- keep this as a Parallel-mode visual layout cleanup
- implement a compact icon-card topology projection of Spaghetti graph dependencies
- preserve reference-wire semantic colors on mini connector lines
- use `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json` as the first canonical proof case
- Phase 1 should land the topology read model and proof before Phase 2 focuses on final painted connector layout

Exclusions:
- no runtime code changes in this setup pass
- no restore/replay
- no graph mutation
- no Browser visibility mutation
- no worker cache implementation
- no Compare/Pin/Branch execution

Build gate:
- focused topology-layout tests
- focused Build Path surface readback tests if the surface is touched
- `npm.cmd exec -- tsc --noEmit`
- production build only if runtime/component styling changes make it necessary

Stop condition:
- Build-Path-11 Phase 1 is ready to implement around a derived topology read model for the `1 > 6 > 1` icon-card graph layout.

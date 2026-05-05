# Edit History 2 - Graph And Parameter Undo Coverage

## Doc Header

### Doc History
22. 2026-05-05 12:43:52: Implemented and closed `Edit-History-2 / Phase 1.1 - Wire Surface History Parity` by routing the live canvas wire-create, selected-edge delete, and occupied-input detach surfaces through the accepted `connectGraphEdgeWithHistory(...)` and `removeGraphEdgeWithHistory(...)` seams, then adding focused canvas undo/redo parity proof so the remaining user-facing wire paths now create canonical `Connect graph wire` and `Remove graph wire` entries.
21. 2026-05-05 12:36:47: Added `Edit-History-2 / Phase 1.1 - Wire Surface History Parity` after user review clarified that accepted graph-structure history coverage is not enough if any user-facing wire create/remove surface still bypasses the canonical `connectGraphEdgeWithHistory(...)` or `removeGraphEdgeWithHistory(...)` seams; the new follow-up keeps wire parity in `Edit-History-2` instead of widening into a separate family lane.
20. 2026-04-22 01:45:48: Manager accepted `Edit-History-2 / Phase 4` after rerunning the focused console add/delete parity and command-recall exclusion tests, rerunning the graph-history regression suite, and rerunning the production build gate; `Edit-History-2` is complete and family-index closeout can mark `Edit-History-CLG-11` and `Edit-History-HLG-1` complete.
19. 2026-04-22 01:43:40: Implemented `Edit-History-2 / Phase 4 - Console Parity` by routing staged console graph node delete through `removeGraphNodeWithHistory(...)`, proving console-created graph nodes still create exactly one canonical add entry through the accepted add-node seam, proving console node delete creates exactly one canonical remove entry with undo/redo restoration, and proving console command recall remains outside canonical history; targeted console parity tests, graph-history regression tests, and production build passed while the broader `ConsoleDock.test.tsx` command still shows unrelated existing failures in other console branches.
18. 2026-04-22 01:41:22: Manager approved the `Edit-History-2 / Phase 4 - Console Parity` prep after confirming the live staged console `node.delete` path still bypasses canonical graph history via `applyGraphCommand(removeNodeCommand(...))`, while console-created graph nodes already route through `createGraphNodeInDocumentAndSelect(...)` and the accepted `addGraphNodeWithHistory(...)` seam.
17. 2026-04-22 01:38:25: Tightened `Edit-History-2 / Phase 4 - Console Parity` into a Worker-ready prep spec after researching `useConsoleInteraction`, `ConsoleDock`, `stagedNavigation`, `consoleCommandParser`, console recall tests, and the accepted Spaghetti graph-history store seams; the first implementation slice should route existing staged console graph node delete through `removeGraphNodeWithHistory(...)`, preserve already-history-enabled console node creation, and keep command transcript, recall, viewer/camera, reference/content, workspace, sketch, feature-stack, and runtime state outside canonical undo.
16. 2026-04-22 01:35:13: Manager accepted `Edit-History-2 / Phase 3.1` after adding a driven-field lifecycle guard repair, rerunning focused `PortView` and graph-history tests, and rerunning the production build gate; `Edit-History-CLG-10` is complete and the retained Worker lane advances to Phase 4 console parity prep.
15. 2026-04-22 01:32:06: Implemented `Edit-History-2 / Phase 3.1 - Typed Numeric Parameter Commit Entries` with optional typed interaction lifecycle callbacks on generic `NumberField`, `PortView valueInput` wiring into the accepted graph parameter history callbacks, focused typed Enter/blur/disabled lifecycle tests, graph-history regression verification, and production build verification while preserving feature-stack controls, sketch-plane transforms, console parity, runtime state, and native text-input undo exclusions.
14. 2026-04-22 01:29:59: Manager approved the `Edit-History-2 / Phase 3.1 - Typed Numeric Parameter Commit Entries` prep after confirming the live `NumberField` typed path lacks optional focus/blur/Enter lifecycle callbacks while `PortView` and `NodeView` already carry the accepted graph parameter history callbacks needed for a small implementation pass.
13. 2026-04-22 01:27:29: Tightened `Edit-History-2 / Phase 3.1 - Typed Numeric Parameter Commit Entries` into a Worker-ready prep spec for closing `Edit-History-CLG-10`, grounded in the accepted `commitGraphNodeParameterWithHistory(...)` seam, `PortView` generic `valueInput` / `NumberField` typed path, and focused `PortView` / graph-history tests while preserving feature-stack controls, sketch-plane transforms, console parity, runtime state, and text-input-local undo as out of scope.
12. 2026-04-22 01:26:13: Manager accepted the `Edit-History-2 / Phase 3` slider-release implementation after rerunning focused graph-history, PortView, and NodeView tests plus the production build gate; `Edit-History-CLG-9` is complete, `Edit-History-CLG-10` moved into new `Edit-History-2 / Phase 3.1 - Typed Numeric Parameter Commit Entries`, and console parity remains Phase 4.
11. 2026-04-22 01:22:31: Implemented the `Edit-History-2 / Phase 3 - Parameter Commit Entries` slider-release slice with a canonical graph node parameter history helper, generic driver-number range release commit hooks, focused store/UI tests, and production build verification; `Edit-History-CLG-9` is covered while `Edit-History-CLG-10` remains a follow-up because the generic typed `NumberField` confirm/blur path lacks an accepted commit boundary without widening into a broader field refactor.
10. 2026-04-22 01:14:42: Manager tightened `Edit-History-2 / Phase 3 - Parameter Commit Entries` after review so implementation targets generic UI graph node numeric parameter commits through the driver-number and node-param seams only, while explicitly deferring feature-stack parameter controls, sketch-plane transforms, sketch entity edits, and console parity to later Edit-History phases.
9. 2026-04-22 01:09:13: Tightened `Edit-History-2 / Phase 3 - Parameter Commit Entries` into a Worker-ready prep spec after researching `useSpaghettiStore` parameter setters, `SpaghettiCanvas` driver-number callbacks, `NodeView` graph-parameter interaction hooks, `PortView` primitive value interactions, `ParaSlider`, `FeatureValueBar`, `ExtrudeFeatureView`, and existing focused tests; split console parity into Phase 4 so Phase 3 stays scoped to UI graph parameter commit entries only.
8. 2026-04-22 01:08:01: Manager accepted `Edit-History-2 / Phase 2 - Node Movement Commit Entries` after reviewing the completed movement commit seam, rerunning focused graph-history and canvas render tests, and rerunning the production build gate; `Edit-History-CLG-8` is complete while graph parameter commits and console parity remain in later phases.
7. 2026-04-22 01:05:15: Implemented `Edit-History-2 / Phase 2 - Node Movement Commit Entries` with one canonical `Move graph node` entry per completed rounded-position movement, history-free live drag frames, document-only undo/redo position restoration, focused movement/no-op/excluded-state tests, canvas render verification, and production build verification while leaving graph parameters, typed numeric commits, and console parity deferred.
6. 2026-04-22 00:59:07: Tightened `Edit-History-2 / Phase 2 - Node Movement Commit Entries` into a Worker-ready prep spec grounded in `SpaghettiCanvas` node drag release, `setNodePos` / `setManyNodePos` graph UI position seams, `setNodePosition`, and focused store/canvas tests while scoping implementation to one canonical entry per completed changed node move only.
5. 2026-04-22 00:58:17: Manager accepted `Edit-History-2 / Phase 1 - Graph Structure Entries` after reviewing the repaired graph-history apply/restore seam, rerunning the focused graph edit-history adapter tests, rerunning graph command regression tests, and rerunning the production build gate; `Edit-History-CLG-6` and `Edit-History-CLG-7` are complete while node movement, parameter commits, and console parity remain in later phases.
4. 2026-04-22 00:55:00: Repaired `Edit-History-2 / Phase 1` graph-history apply and restore internals to use a narrow normalized graph-document update matching `applyGraphCommand`-style side effects instead of broad `setGraph()` clearing, with focused tests proving unrelated selection, hover, connection drag, UI message, and edge waypoints are preserved while removed-edge waypoints are pruned.
3. 2026-04-22 00:52:00: Implemented `Edit-History-2 / Phase 1 - Graph Structure Entries` with canonical graph-structure edit-history entries at the Spaghetti store seam, focused graph edit-history adapter tests, graph command regression verification, and production build verification while leaving node movement, parameter commits, console parity, UI, Build Path, persistence, runtime/cache/provider state, and non-graph surfaces deferred.
2. 2026-04-22 00:45:50: Tightened `Edit-History-2 / Phase 1 - Graph Structure Entries` into a Worker-ready implementation spec for the first real graph adapter slice, grounded in `editHistoryStore`, `addNode`, `removeNode`, `connectEdgeWithAutoReplace`, `graphCommands.test.ts`, and `useSpaghettiStore` mutation seams while scoping the pass to node add/remove and wire connect/remove canonical entries only.
1. 2026-04-22 00:11:26: Created this `Edit History` future plan for graph structure edits, graph parameter commits, slider and typed-field transaction boundaries, and console parity over the same graph mutation seams.

### Purpose

This plan makes the highest-value `Spaghetti Editor` graph edits undoable through the canonical history owner.

## Doc Body

### Scope

In scope:
- node add/remove
- wire connect/remove
- node move
- graph parameter commits
- slider and typed numeric commit semantics
- console commands that mutate the same graph/parameter state

Out of scope:
- node-owned CAD feature-stack internals
- committed sketch entity history
- Browser/project organization
- Viewer Transform integration
- `Build Path` derived-reader UI

### Acceptance Read

This phase is complete when common graph edits and parameter commits undo and redo through the canonical owner with one entry per meaningful edit, regardless of whether the mutation came from the visible UI or a console command routed through the same authored seam.

## Vision

Graph edits are the first broad proof that `Edit History` is real.

The graph should not feel like a local editor with a private undo stack. It should become the first major authored surface that plugs into the canonical app-level undo/redo owner.

## Wishlist Organization

### High Level Goals

- [ ] `Edit-History-HLG-1` - Make graph structure and graph parameter commits undoable first.
- [ ] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.

### `Edit-History-2`

- [x] `Edit-History-CLG-6` - Make node add/remove undoable and redoable.
- [x] `Edit-History-CLG-7` - Make wire connect/remove undoable and redoable.
- [x] `Edit-History-CLG-8` - Make node movement undoable as one committed move per completed drag.
- [x] `Edit-History-CLG-9` - Make graph parameter slider commits undoable as one entry on release.
- [x] `Edit-History-CLG-10` - Make typed numeric parameter commits undoable on `Enter`, blur, or equivalent confirm.
- [x] `Edit-History-CLG-11` - Route console graph/parameter mutations through the same authored seams so canonical undo is surface-agnostic.

## [x] `Edit-History-2 / Phase 1` - `Graph Structure Entries`

Add canonical entries for graph structure mutations.

### Phase 1 Summary

#### Purpose

Implement the first real authored-surface adapter for canonical edit history by making graph structure edits undoable and redoable.

This phase should cover node add/remove and wire connect/remove only. It should prove that graph shape mutations can commit canonical entries without changing visible graph behavior or widening into parameters, movement, console parity, or UI.

#### Owns

- canonical edit-history entries for node add and node remove
- canonical edit-history entries for wire connect and wire remove
- before/after graph restoration for graph structure edits
- no-op protection for duplicate node add, missing node remove, duplicate/no-op wire connect, missing wire remove, and other unchanged graph results
- deterministic auto-replace restoration for driver-input wire connect behavior
- focused tests proving undo and redo restore graph shape, related edges, and relevant graph UI structure owned by the graph document
- preserving the accepted `Edit-History-1` owner/dispatch contract

#### Does Not Own

- node movement or drag transaction entries
- graph parameter slider or typed numeric commits
- console graph/parameter parity
- CAD/sketch feature-stack internals or committed sketch entity history
- Browser/project undo, import undo, Viewer Transform undo, Catalog undo, or Build Path sync
- history panel UI, derived readers, persistence, async entries, snapshots, branch history, or durable presentation/productivity undo
- selection, hover, focus/menu state, runtime build results, preview/cache/provider state, or command transcript/recall
- broad graph store refactors or graph command rewrites beyond the minimum adapter seam
- updating `docs/CHANGELOG.md`, because this prep pass does not ship runtime behavior

#### Current Live Seams

The canonical owner lives in `src/app/store/editHistoryStore.ts`. The graph adapter should commit ordinary `EditHistoryEntry` values to that owner and use `undo` / `redo` callbacks that restore graph state synchronously.

Graph structure commands already exist under `src/app/spaghetti/graphCommands/`:
- `addNode.ts` inserts a node, optional rounded UI position, and optional initial node mode; duplicate node ids return the original graph unchanged.
- `removeNode.ts` removes a node, dependent edges, and that node's UI position while preserving viewport UI when present.
- `addEdge.ts` / `removeEdge.ts` already provide direct edge add/remove command behavior.
- `connectEdgeWithAutoReplace.ts` exposes `planConnectEdgeWithAutoReplace` and `connectEdgeWithAutoReplace`; the plan includes deterministic no-op/insert behavior, normalized extrude profile endpoints, removed driver-input edge ids, and the final `nextGraph`.

`src/app/spaghetti/graphCommands/graphCommands.test.ts` already proves graph command determinism for add node, remove node, add/remove edge, driver input auto-replace, inert aggregate extrude source/target path normalization, and output-preview singleton repair through store command application.

`src/app/spaghetti/store/useSpaghettiStore.ts` is the likely live mutation boundary. It exposes `setGraph(next)`, `applyGraphCommand(cmd)`, `addEdge(edge)`, and `removeEdge(edgeId)`. `setGraph` and `applyGraphCommand` normalize graph commits, update the active graph document, prune sketch-plane/geometry-sketch sessions that no longer match graph shape, and prune edge waypoints for removed edges.

`src/app/spaghetti/store/useSpaghettiStore.test.ts` is large but available for focused store-seam proof if the adapter touches store behavior. Prefer narrow tests by name or a new focused adapter test if that keeps the proof smaller.

#### First Pass Decisions

- Prefer one small graph edit-history adapter/helper near the graph store or graph command ownership boundary instead of spreading history commits through UI components.
- Prefer before/after graph snapshots for Phase 1 restoration because node remove and auto-replace wire connect can affect related edges and graph UI; inverse command-only restoration can lose removed edge details or auto-replaced edge order.
- Route all Phase 1 graph structure history through the same normalized graph commit path used by the store, so undo/redo sees canonical graph shape.
- Treat unchanged command results as no-ops and do not commit canonical entries.
- Keep selection, hover, focused node/edge, console preview, edge waypoint UI, build/runtime outputs, and preview/provider/cache state out of the history entry unless the existing graph commit path already prunes graph-owned edge waypoints as a consequence of graph shape.
- Keep labels and source metadata stable enough for future history UI, such as `Add graph node`, `Remove graph node`, `Connect graph wire`, and `Remove graph wire`, with graph/document/node/edge target metadata when available.

Implementation direction:
- identify the shared graph mutation functions or store actions
- wrap node add/remove and wire connect/remove at the authored mutation boundary
- capture enough before/after graph state to restore safely
- keep selection and hover state outside the entry unless necessary for authored restoration

Acceptance:
- undoing node add removes the node and dependent wires consistently
- undoing node remove restores the node and intended connections
- undoing wire connect/remove restores the correct graph shape
- redo repeats the same authored result

### Phase 1 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - likely live mutation boundary if adding graph-history-aware store actions or wrapping existing graph structure actions
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - focused store-seam tests if the implementation changes store actions directly
- `src/app/spaghetti/graphCommands/addNode.ts`
  - read context for no-op duplicate node and UI position/mode behavior; avoid changing unless required
- `src/app/spaghetti/graphCommands/removeNode.ts`
  - read context for dependent edge and UI node removal behavior; avoid changing unless required
- `src/app/spaghetti/graphCommands/addEdge.ts`
  - read context for direct edge add behavior
- `src/app/spaghetti/graphCommands/removeEdge.ts`
  - read context for direct edge remove behavior
- `src/app/spaghetti/graphCommands/connectEdgeWithAutoReplace.ts`
  - read context and likely helper for connect planning, no-op detection, endpoint normalization, and auto-replace details
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
  - focused command-level regression tests for graph shape and auto-replace behavior
- a new focused graph edit-history adapter test only if it keeps the proof smaller than broad `useSpaghettiStore` tests
- `src/app/store/editHistoryStore.ts`
  - read context for canonical owner APIs; avoid changing the owner contract in this phase
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - implementation closeout only after verification and build pass
- `docs/CHANGELOG.md`
  - required when implementation ships runtime/test behavior
- `docs/Doc-Log.md`
  - required for implementation closeout doc maintenance

#### No-Widening Rule

Do not implement node movement, graph parameter commits, slider transaction entries, typed numeric commit entries, or console parity in Phase 1.

Do not make CAD/sketch internals, Browser/project organization, Viewer Transform, Catalog, Build Path, history UI, persistence, async entries, preview/cache/provider state, runtime build results, selection, hover, focus/menu state, command transcript, or command recall undoable.

Do not change graph command semantics except for the smallest adapter seam needed to commit canonical entries. If a command behavior bug is discovered, stop and report unless fixing it is required for the Phase 1 acceptance proof.

#### Implementation Risks

- Wrapping too high in UI code could miss console or future graph mutation paths; prefer the shared graph mutation/store seam.
- Wrapping too low in pure graph commands could make pure commands impure by importing the canonical owner; keep pure commands pure if possible.
- Snapshot restoration can accidentally restore excluded UI/runtime state if the snapshot is too broad. Keep snapshots to graph document shape and graph-owned UI needed for node positions/modes, not selection/hover/runtime/cache state.
- Auto-replace wire connect must restore both the inserted edge and any removed driver-input edges on undo/redo. Using the before/after graph snapshot is safer than hand-building inverse edge commands.
- No-op detection must compare normalized graph results, not only raw command intent, because store normalization can repair output preview or normalize endpoints.
- `removeNode` removes dependent edges; undo must restore the node and intended connections exactly.
- Existing `removeEdge` store behavior also prunes edge waypoints; decide whether edge waypoints are graph-owned shape adornment or out of Phase 1. Prefer preserving the current store pruning behavior and do not broaden into waypoint history unless existing tests force it.

#### Checklist

- [x] Identify the final shared graph structure mutation boundary for node add/remove and wire connect/remove.
- [x] Add a small graph edit-history adapter/helper or store action path that can capture before/after normalized graph snapshots.
- [x] Commit one canonical entry for changed node add.
- [x] Commit one canonical entry for changed node remove, including dependent edge restoration on undo.
- [x] Commit one canonical entry for changed wire connect, including deterministic auto-replace restoration.
- [x] Commit one canonical entry for changed wire remove.
- [x] Ignore no-op graph structure mutations without creating canonical entries.
- [x] Ensure undo and redo restore graph shape through the store's normalized graph commit path.
- [x] Keep selection, hover, focus/menu, build/runtime, preview/cache/provider, command transcript, and command recall outside entries.
- [x] Add focused tests for node add/remove undo/redo and wire connect/remove undo/redo.
- [x] Add focused tests for no-op duplicate/missing structure mutations and auto-replace determinism.
- [x] Leave node movement, graph parameters, and console parity to later phases.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/graphCommands/graphCommands.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "graph"`
  - use a narrower `-t` pattern if the implementation adds named focused graph-history tests
- run the new focused graph edit-history adapter test command if a new test file is added
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` if the implementation touches canonical owner assumptions or needs to prove owner compatibility

The implementation closeout should report the exact commands and test counts.

Closeout verification:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed with 10 tests after the repair added graph-history side-effect preservation coverage.
- `npm.cmd test -- --run src/app/spaghetti/graphCommands/graphCommands.test.ts` passed with 7 tests.
- `npm.cmd run build` passed with existing Vite warnings for browser-externalized `path` / `crypto` from `occt-import-js` and large chunks.
- Additional broad store sweep `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts` still fails two OutputPreview `publicationMode` expectation mismatches outside this phase's graph-history adapter scope.

#### Build Gate

Run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 1 failures.

#### Tracking Docs

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

This prep pass updates only the active phase doc and `docs/Doc-Log.md`.

#### Stop Condition

Stop and report instead of widening if the only apparent implementation path requires graph UI rewrites, console command rewrites, parameter controls, node movement handling, Browser/project ownership, Viewer Transform migration, Build Path UI, or history panel work.

Stop and report if normalized before/after graph snapshots would need to include excluded state such as selection, hover, focus/menu, build/runtime output, preview/cache/provider state, command transcript, or command recall.

Stop and report if existing graph command no-op or auto-replace behavior is ambiguous enough that adapter correctness cannot be proven with focused tests.

#### Done Shape

Phase 1 is done when node add/remove and wire connect/remove mutations commit canonical edit-history entries at a shared graph mutation boundary, undo/redo restore the expected normalized graph shape and related edges, no-op graph structure mutations do not create entries, auto-replace wire connect restores deterministically, focused tests pass, and production build passes.

The closeout should mark `Edit-History-CLG-6` and `Edit-History-CLG-7` complete only if node add/remove and wire connect/remove are both covered. Leave `Edit-History-CLG-8`, `Edit-History-CLG-9`, `Edit-History-CLG-10`, and `Edit-History-CLG-11` open for later phases.

## [x] `Edit-History-2 / Phase 1.1` - `Wire Surface History Parity`

Close any remaining user-facing wire create/remove paths that still bypass the accepted graph-history helpers.

### Phase 1.1 Summary

#### Purpose

Keep wire history ownership in the same `Edit-History-2` graph-structure lane while proving that real user-facing wire creation and wire removal surfaces create canonical history entries instead of only relying on the lower-level store seam.

Phase 1 proved the canonical helper path and store restoration semantics. Phase 1.1 should only cover parity for live wire surfaces that may still call raw graph commands or other history-free graph mutation paths.

#### Owns

- user-facing wire creation parity through the accepted `connectGraphEdgeWithHistory(...)` seam
- user-facing wire removal parity through the accepted `removeGraphEdgeWithHistory(...)` seam
- one canonical entry per accepted wire create/remove action from supported user-facing surfaces
- preservation of accepted Phase 1 labels, metadata shape, auto-replace behavior, and normalized graph restore behavior
- focused proof that supported user actions create canonical `Connect graph wire` and `Remove graph wire` entries instead of mutating graph structure silently

#### Does Not Own

- graph-structure helper semantics already accepted in Phase 1 unless a tiny parity repair is required
- node add/remove parity, node movement, graph parameter commits, typed numeric commits, or console graph/parameter parity
- feature-stack, committed sketch entity, Browser/project, Viewer Transform, Build Path, history UI, persistence, branching, collaboration, or later-generation history work
- edge waypoint history as its own authored lane
- new user-facing wire workflows or new wire commands beyond parity for already-supported surfaces

#### Current Live Seams

The accepted canonical wire helpers already exist in `src/app/spaghetti/store/useSpaghettiStore.ts`:
- `connectGraphEdgeWithHistory(...)`
- `removeGraphEdgeWithHistory(...)`

The likely live user-facing wire surfaces remain in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`:
- pointer-release wire creation through the existing connection drag flow
- selected-edge Delete/Backspace removal or other direct edge-removal callbacks
- any context-menu or click-path edge removal surface that still calls raw graph commands

`src/app/spaghetti/store/graphEditHistoryStore.test.ts` already proves canonical add/remove/move/parameter history behavior at the store seam. Phase 1.1 should add or extend focused canvas/user-surface proof only where it is needed to show real user parity.

#### First Pass Decisions

- Prefer parity wiring at the live user-facing surface boundary, not a second broad graph-history abstraction.
- Reuse the accepted Phase 1 store helpers and labels instead of inventing new wire-specific history entry types.
- Preserve current no-op behavior: invalid connects, unchanged auto-replace no-ops, and missing-edge deletes should not create entries.
- Preserve selected-edge precedence and existing selection/hover/focus/user-feedback behavior unless a tiny parity repair requires a narrow adjustment.

Implementation direction:
- audit every supported user-facing wire create/remove path
- route any bypassing path into `connectGraphEdgeWithHistory(...)` or `removeGraphEdgeWithHistory(...)`
- keep raw helper/store tests as the reference truth and add focused user-surface proof only where parity was missing

Acceptance:
- creating a wire from the supported user surface creates one canonical `Connect graph wire` entry
- removing a wire from the supported user surface creates one canonical `Remove graph wire` entry
- undo and redo restore the same authored graph shape through the accepted store seam

### Phase 1.1 Implementation Spec

#### Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - likely live wire create/remove UI boundary if any path still bypasses the accepted history helper seam
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - read-only reference seam unless a tiny parity helper adjustment is required
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`
  - likely place for focused user-surface wire parity proof
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - accepted store-history regression seam if parity repair changes helper behavior
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - update for implementation closeout after verification
- `docs/CHANGELOG.md`
  - required when runtime behavior ships
- `docs/Doc-Log.md`
  - required for doc maintenance in this planning pass and later implementation closeout

#### No-Widening Rule

Do not reopen broad Phase 1 graph-structure restoration design. The accepted helpers, snapshot direction, and labels are already the canonical reference unless a tiny parity repair proves necessary.

Do not widen into node delete parity, node movement, graph parameter commits, console parity, new wire affordances, edge waypoint authored history, Browser/project undo, Viewer Transform undo, Build Path sync, history UI, persistence, or later-generation history features.

#### Implementation Risks

- A surface can look history-covered because the store helper exists while the live UI still calls `applyGraphCommand(...)` or another raw mutation path.
- Edge removal parity can hide behind keyboard or selection routing rather than a dedicated remove button, so focused tests should exercise the real user path.
- Auto-replace wire connect must keep the accepted no-op and deterministic restore behavior from Phase 1; parity routing must not silently change that contract.
- A broad graph-wrapper attempt would duplicate the accepted seam and risk reopening already-closed ownership decisions.

#### Checklist

- [x] Audit the current user-facing wire create paths and confirm which already use `connectGraphEdgeWithHistory(...)`.
- [x] Audit the current user-facing wire remove paths and confirm which already use `removeGraphEdgeWithHistory(...)`.
- [x] Route any bypassing wire create path through the accepted canonical helper seam.
- [x] Route any bypassing wire remove path through the accepted canonical helper seam.
- [x] Preserve no-op behavior, auto-replace behavior, and current non-history UI behavior outside authored graph shape.
- [x] Add focused user-surface tests proving one canonical entry for supported wire create/remove actions.
- [x] Keep node, parameter, console, and non-graph surfaces out of scope.

#### Focused Verification

Focused command run:

- `npm.cmd exec -- vitest run src/app/spaghetti/store/graphEditHistoryStore.test.ts src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`

Covered parity paths:

- live canvas connection-drag pointer release now commits through `connectGraphEdgeWithHistory(...)`
- selected-edge Delete/Backspace removal now commits through `removeGraphEdgeWithHistory(...)`
- occupied-input detach during rewiring now commits through `removeGraphEdgeWithHistory(...)`

#### Tracking Docs

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Implementation closeout updated this active phase doc plus the required changelog and doc-log surfaces.

#### Stop Condition

Stop and report instead of widening if the apparent missing parity path depends on introducing a brand-new wire authoring workflow, a broad graph-command wrapper, edge-waypoint ownership changes, or unrelated node-selection/input-routing rewrites.

Stop and report if the only way to prove parity is to change already-accepted Phase 1 helper semantics beyond a tiny repair.

#### Done Shape

Phase 1.1 is done when every currently supported user-facing wire create/remove path routes through the accepted canonical helper seam, supported user actions create one canonical wire history entry, undo/redo restores the authored graph shape through the existing normalized restore path, focused parity tests pass, and the change stays inside `Edit-History-2`.

## [x] `Edit-History-2 / Phase 2` - `Node Movement Commit Entries`

Add undo entries for completed node movement.

### Phase 2 Summary

#### Purpose

Make graph node movement undoable through the canonical edit-history owner without making every live drag frame a separate history entry.

This phase should close `Edit-History-CLG-8` only. Live dragging can continue to update graph UI positions continuously for responsiveness, but release or equivalent movement completion should collapse the authored movement into one canonical entry when the rounded node position changed.

#### Owns

- canonical edit-history entries for completed graph node movement
- one entry per completed changed drag or equivalent committed movement
- undo and redo restoration of graph UI node position through the graph store's existing document-only position update behavior
- no-op protection for missing nodes, unchanged rounded positions, canceled movement, and drag releases that do not move the node
- focused tests proving live drag frames do not create many entries
- focused tests proving selection, hover, camera/view state, runtime/build/cache/provider state, command transcript, and command recall remain excluded
- preserving the Phase 1 graph-structure entries and repaired narrow graph-history side-effect behavior

#### Does Not Own

- graph node add/remove or wire connect/remove entries already completed in Phase 1
- graph parameter slider commits
- typed numeric parameter commits
- console graph/parameter parity
- CAD/sketch feature-stack internals or committed sketch entity history
- Browser/project undo, Viewer Transform undo, Catalog undo, Build Path sync, history panel UI, persistence, async entries, branch history, or durable presentation/productivity undo
- selection, hover, focus/menu state, camera/view pan/zoom, viewer fly/camera shortcuts, runtime build results, preview/cache/provider state, command transcript, or command recall
- broad graph canvas rewrites or UX changes to node dragging
- updating `docs/CHANGELOG.md`, because this prep pass does not ship runtime behavior

#### Current Live Seams

`src/app/spaghetti/canvas/SpaghettiCanvas.tsx` appears to be the live node drag owner:
- `dragStateRef` captures `nodeId`, start pointer coordinates, and starting node position on header pointer down.
- `queueNodePos` batches live movement frames into `queuedNodePosRef`.
- `flushQueuedNodePos` calls `setManyNodePos(...)`.
- `handleNodePointerDown` starts header drags, selects the node, clears selected edge and UI message, and on pointer up currently clears `dragStateRef`, flushes queued node positions, and removes window listeners.

`src/app/spaghetti/store/useSpaghettiStore.ts` owns the live graph UI position update seam:
- `setNodePos(nodeId, x, y)` calls `upsertNodePos(...)` and updates graph document state with `withUpdatedActiveGraphDocumentState(..., 'document-only')`.
- `setManyNodePos(updates)` batches multiple UI position updates into the same document-only graph update path.
- `ensureNodePositions()` normalizes missing graph UI positions and should remain a layout/initialization helper, not a history commit source.

`src/app/spaghetti/graphCommands/setNodePosition.ts` is a pure command context seam:
- it rounds incoming coordinates
- it no-ops if the node is missing
- it no-ops if the rounded position is unchanged
- it updates only `graph.ui.nodes[nodeId]`

Tests to inspect or extend during implementation:
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - existing focused graph-history adapter coverage and side-effect preservation proof
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - existing graph document revision / node position tests around `setNodePos`
- `src/app/spaghetti/canvas/SpaghettiCanvas.test.tsx` or the nearest current canvas test file if node drag behavior is already rendered there
- `src/app/spaghetti/canvas/interactionModel.test.ts`
  - existing header/body/control drag-start ownership proof, likely read-only unless routing behavior changes
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
  - possible small pure-command regression coverage if `setNodePosition` needs direct no-op proof

#### First Pass Decisions

- Prefer a small node-move history seam in or near `useSpaghettiStore` so the canvas can call a committed movement API on drag release without importing `editHistoryStore` into UI-heavy code.
- Keep `setManyNodePos` as the live-frame update path and do not make it commit history entries directly.
- Capture the movement origin before live drag updates begin, then compare it with the final rounded node position on release.
- Commit exactly one entry on release if the rounded start and final positions differ and the node still exists.
- Undo and redo should update only the graph document's node position through the same document-only graph UI position path, not broad `setGraph()` clearing.
- Use stable labels/source metadata such as `Move graph node`, source `spaghetti-graph` / `graph-node-position`, and node target metadata.
- Preserve Phase 1 graph-structure helper behavior; do not change pure graph commands unless a tiny no-op test seam proves necessary.

### Phase 2 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - likely place for a movement commit helper such as `commitGraphNodeMoveWithHistory(...)` or transaction-like begin/commit functions
  - keep live `setNodePos` / `setManyNodePos` behavior intact unless adding a separate committed-move API
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - likely drag-release integration point because it already owns `dragStateRef`, queued live frames, and pointer-up completion
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - likely focused tests for committed movement entries, undo/redo, no-op/cancel behavior, and excluded state preservation
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - possible focused store-seam proof for node position document-only revision behavior if touched
- `src/app/spaghetti/canvas/SpaghettiCanvas.test.tsx` or nearest existing canvas test file
  - use only if store-level tests cannot prove one-entry-per-release behavior or if the canvas integration is touched enough to need render-level proof
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
  - read context for rounded no-op semantics; avoid changing unless implementation needs a tiny pure helper
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
  - possible focused pure command regression if `setNodePosition` assumptions need proof
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - implementation closeout only after verification and build pass
- `docs/CHANGELOG.md`
  - implementation later only; this prep pass must not update it
- `docs/Doc-Log.md`
  - required for this prep and later implementation doc maintenance

#### No-Widening Rule

Do not implement graph parameter commits, typed numeric commits, console parity, CAD/sketch undo, Browser/project undo, Viewer Transform undo, Build Path sync, history UI, persistence, async entries, runtime/cache/provider state, command transcript, command recall, or later-generation undo behavior in Phase 2.

Do not turn live drag frames, `setManyNodePos(...)`, `ensureNodePositions()`, camera pan/zoom, viewer fly/camera shortcuts, selection, hover, edge waypoints, focus/menu state, or runtime/build result state into canonical history entries.

Do not refactor the canvas drag model broadly. Only add the minimal committed-movement handoff needed for one canonical entry on completed changed movement.

#### Implementation Risks

- Committing inside `setManyNodePos` would spam history during drag frames; keep it as live state only.
- Committing from canvas pointer-up before flushing queued movement can capture a stale final position; flush first or read the final rounded position after live updates are applied.
- Canceled or zero-distance drags must not create entries.
- Position rounding matters. Compare normalized/rounded start and final coordinates so sub-pixel movement that rounds back to the original position is a no-op.
- Undo/redo must avoid broad `setGraph()` clearing and should preserve selection, hover, connection drag, UI message, camera/view state, runtime/cache/provider state, and unrelated edge waypoints.
- Node removal during a drag or before commit could make the movement target missing; treat as no-op or stop and report if current live behavior cannot be preserved.
- Existing broad `useSpaghettiStore.test.ts` has unrelated OutputPreview `publicationMode` expectation failures; prefer focused tests and report the existing broad-suite status honestly if rerun.

#### Checklist

- [x] Confirm the live node drag release path in `SpaghettiCanvas.tsx`.
- [x] Add a committed node movement store/API seam without making live `setManyNodePos` create entries.
- [x] Capture movement start position and final rounded position for one node.
- [x] Commit one canonical `Move graph node` entry only when the rounded final position differs from the rounded start position.
- [x] Undo restores the start position.
- [x] Redo restores the final position.
- [x] Missing-node, unchanged-position, canceled, and no-move releases create no entry.
- [x] Multiple live drag frames collapse into one committed entry.
- [x] Preserve existing graph document-only position update behavior and avoid broad `setGraph()` clearing.
- [x] Keep selection, hover, camera/view, runtime/cache/provider state, command transcript, command recall, and unrelated graph UI state outside entries.
- [x] Add focused tests for store/API movement entry behavior.
- [x] Add a narrow canvas integration test only if needed to prove release collapse.
- [x] Leave graph parameters, typed numeric commits, console parity, CAD/sketch, Browser/project, transform, Build Path, UI panel, persistence, and later generations deferred.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - expected main proof if movement commit tests join the existing graph-history focused suite
- `npm.cmd test -- --run src/app/spaghetti/graphCommands/graphCommands.test.ts`
  - run if `setNodePosition` pure-command assumptions are touched or tested
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "node position"`
  - run if existing store node-position behavior is touched; report unrelated broad OutputPreview failures separately if the full file is rerun
- run the narrow canvas test command if `SpaghettiCanvas` release behavior receives a rendered integration test

The implementation closeout should report exact commands and test counts.

Closeout verification:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed with 13 tests.
- `npm.cmd test -- --run src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` passed with 2 tests.
- `npm.cmd run build` passed with existing Vite warnings for browser-externalized `path` / `crypto` from `occt-import-js` and large chunks.

#### Build Gate

Run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 2 failures.

#### Tracking Docs

This prep pass updates only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Stop Condition

Stop and report instead of widening if proving node movement requires a broad canvas drag rewrite, a general transaction manager rewrite, parameter control changes, console command rewrites, Browser/project ownership, Viewer Transform migration, Build Path UI, history panel work, or persistence.

Stop and report if the current drag lifecycle cannot distinguish live movement frames from release/commit without changing visible drag behavior.

Stop and report if undo/redo would need to capture excluded state such as selection, hover, camera/view pan/zoom, runtime build output, preview/cache/provider state, command transcript, or command recall.

#### Done Shape

Phase 2 is done when completed graph node movement creates exactly one canonical edit-history entry when the rounded node position changes, live drag frames do not create multiple entries, cancel/no-op/missing-node movement creates no entry, undo and redo restore the expected node position through the existing graph document-only position update path, focused tests pass, and production build passes.

The closeout should mark `Edit-History-CLG-8` complete only if completed node movement is covered. Leave `Edit-History-CLG-9`, `Edit-History-CLG-10`, and `Edit-History-CLG-11` open for later phases.

## [x] `Edit-History-2 / Phase 3` - `Parameter Slider Release Entries`

Add undo entries for graph parameter commits.

### Phase 3 Summary

#### Purpose

Make UI-authored generic graph node numeric parameter changes undoable through the canonical edit-history owner without creating one entry per live slider tick.

This phase should close `Edit-History-CLG-9` and `Edit-History-CLG-10` only if slider-release commits and typed numeric confirm/blur commits are both covered through the same generic graph node-parameter history seam. Console parity should move to Phase 4 because the live console command path needs its own surface-parity proof and should not widen the UI parameter implementation slice.

#### Owns

- canonical edit-history entries for UI graph node parameter commits through the generic node-param / driver-number seams
- slider release commits for generic graph node numeric parameters
- typed numeric field commits on `Enter`, blur, or equivalent confirm when they use the same generic graph node-parameter seam
- one entry per meaningful committed parameter change, even when live interaction updates continuously
- no-op protection for unchanged effective authored parameter values, missing nodes, missing parameters, canceled edits, disabled/driven inputs, and invalid numeric values
- undo and redo restoration through the graph document update path without broad `setGraph()` clearing
- focused tests proving live updates do not spam history while release/confirm commits one entry
- focused tests proving runtime/build/cache/provider, preview, selection/hover, text-input-local undo, command transcript, and command recall stay excluded
- preserving Phase 1 graph-structure history and Phase 2 node-movement behavior

#### Does Not Own

- console command parity for graph/parameter mutations
- non-numeric enum/select parameter commits unless the implementation naturally shares the numeric commit seam and Manager explicitly approves widening
- feature-stack parameter controls, including `FeatureValueBar`, `ExtrudeFeatureView`, `setExtrudeDepth`, `setExtrudeTaper`, and `setExtrudeOffset`
- node movement, node add/remove, or wire connect/remove entries already completed in earlier phases
- node CAD/sketch internals as standalone history
- sketch entity commits, sketch-plane transform history, or geometry sketch draw operations
- Browser/project undo, Viewer Transform undo, Catalog undo, Build Path sync, history panel UI, persistence, async entries, branch history, or durable presentation/productivity undo
- selection, hover, focus/menu state, camera/view pan/zoom, viewer fly/camera shortcuts, runtime build results, preview/cache/provider state, command transcript, or command recall
- broad `ParaSlider`, `PortView`, `NodeView`, or canvas refactors
- updating `docs/CHANGELOG.md`, because this prep pass does not ship runtime behavior

#### Current Live Seams

`src/app/spaghetti/store/useSpaghettiStore.ts` owns generic graph document mutation paths:
- `applyGraphCommand(...)` and `applyGraphPatch(...)` are the broad graph document update seams used by graph node parameter UI paths.
- graph document normalization canonicalizes node params and driver offset metadata during store commits.
- Phase 1/2 history helpers already show how to commit ordinary `EditHistoryEntry` values at the store seam and restore through narrow graph-document updates.
- feature-stack setters such as `setExtrudeDepth(...)`, `setExtrudeTaper(...)`, and `setExtrudeOffset(...)` are adjacent seams to avoid in Phase 3 because feature-stack parameter undo belongs to `Edit-History-3`.

`src/app/spaghetti/canvas/SpaghettiCanvas.tsx` is a broader graph parameter UI bridge:
- imports `setNodeParamsCommand` and applies it through `applyGraphCommand(...)` / `applyGraphPatch(...)` for utility, OutputPreview, structured-wire, and driver-number parameter paths.
- `handleDriverNumberChange(...)` updates numeric driver values, vec2 axes, offsets, and first-extrude depth using `applyGraphPatch(...)` or `setExtrudeDepth(...)`.
- passes `handleDriverNumberChange` into `NodeView` as `onDriverNumberChange`.

`src/app/spaghetti/canvas/NodeView.tsx` owns most graph node row controls:
- `beginGraphParameterInteraction()` / `endGraphParameterInteraction()` already wrap parameter interactions and Browser build-interaction state.
- `renderInputRow(...)`, driver numeric rows, utility rows, and structured wire numeric rows eventually call `onDriverNumberChange(...)` or local `setNodeParamsCommand(...)` wrappers.
- `createStructuredWireNumericRowProps(...)` uses `onInteractionStart` / `onInteractionEnd` for graph parameter interaction boundaries.
- sketch-plane transform sliders also use `beginGraphParameterInteraction` / `endGraphParameterInteraction`, but they are explicitly out of Phase 3.

`src/app/spaghetti/canvas/PortView.tsx` owns primitive number row interactions:
- primitive drag starts with `beginPrimitiveInteraction()`, calls `valueInput.onChange(...)` during pointer moves, and ends with `endPrimitiveInteraction()` on `pointerup` / `pointercancel`.
- typed primitive edits call `valueInput.onChange(...)` only on commit and `valueInput.onInteractionEnd?.()` on `Enter` / blur.
- existing `src/app/spaghetti/canvas/PortView.test.tsx` covers typed primitive edits and pointer interaction boundaries.

`src/app/components/ParaSlider.tsx` owns reusable slider mechanics:
- pointer drag calls `onActivate?.()` at start, `onChange(...)` during drag, and `onChangeEnd?.(dragValue)` on pointer release/cancel.
- step buttons call `onChange(...)` and `onChangeEnd?.(...)`.
- typed slider value commits call `onChange(...)` and `onChangeEnd?.(...)` on blur/`Enter`; `Escape` cancels local input.
- existing `src/app/components/ParaSlider.test.tsx` covers pointerup and typed slider commit mechanics.

Adjacent seams to avoid:
- `FeatureValueBar` calls `onInteractionStart` on focus/button work, updates continuously through `onChange(...)`, and calls `onInteractionEnd` on blur/`Enter`/`Escape` or button completion.
- `ExtrudeFeatureView` wires depth/taper/offset bars to `setExtrudeDepth`, `setExtrudeTaper`, and `setExtrudeOffset`.
- sketch-plane transform sliders in `NodeView` / viewport overlays use parameter-like interactions but are not generic graph node params for this phase.

Relevant focused tests to extend or add:
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `src/app/spaghetti/canvas/PortView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/components/ParaSlider.test.tsx`

#### First Pass Decisions

- Split console parity into `Edit-History-2 / Phase 4 - Console Parity` instead of keeping it inside Phase 3.
- Prefer a small store/API seam for graph parameter history commits, similar in spirit to `commitGraphNodeMoveWithHistory(...)`, so UI controls can begin live updates and commit only at release/confirm.
- Keep live parameter update setters such as `applyGraphPatch(...)` and `applyGraphCommand(...)` history-free unless invoked through an explicit commit helper.
- Use before/after normalized graph snapshots or a narrowly scoped node-param snapshot for undo/redo; choose the smallest shape that restores the authored graph document parameter without capturing excluded state.
- Treat changed effective graph params as the equality boundary. If normalization leaves before/after graph params equivalent, do not create an entry.
- Start with numeric graph parameter commits that are already surfaced through `PortView` primitive rows, `ParaSlider`, and `setNodeParamsCommand(...)` / driver-number paths; do not attempt every enum/select/string parameter in this phase unless it naturally shares the same seam without widening.
- Use stable labels/source metadata such as `Change graph parameter`, source `spaghetti-graph` / `graph-parameter`, and node/parameter target metadata.
- Preserve existing text-input native undo by not routing `Ctrl+Z` inside editable inputs to canonical history.

### Phase 3 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - likely place for a graph parameter history helper or explicit committed-parameter API
  - read and preserve existing graph normalization and Phase 1/2 history helpers
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - likely bridge for `handleDriverNumberChange(...)` and `setNodeParamsCommand(...)` paths if the committed API needs UI handoff
- `src/app/spaghetti/canvas/NodeView.tsx`
  - likely place to connect `beginGraphParameterInteraction` / `endGraphParameterInteraction` to parameter commit capture for UI rows
- `src/app/spaghetti/canvas/PortView.tsx`
  - likely place to pass `onInteractionStart` / `onInteractionEnd` through primitive number rows if needed
- `src/app/components/ParaSlider.tsx`
  - read context for `onActivate` / `onChangeEnd`; avoid changing unless a tiny missing commit hook is required
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
  - adjacent feature-stack seam to avoid in this phase
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - adjacent feature-stack seam to avoid in this phase
- `src/app/spaghetti/graphCommands/setNodeParams.ts`
  - read-only context for node-param replacement behavior; keep pure command files pure unless a tiny no-op helper is necessary
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - likely focused store/history tests for graph parameter commit entries, undo/redo, no-op protection, redo invalidation, and excluded state preservation
- `src/app/spaghetti/canvas/PortView.test.tsx`
  - focused UI interaction-boundary tests for primitive drag and typed commit if touched
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - focused integration tests for extrude depth primitive row / typed input commit if touched
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - focused static/render regression tests if node row props change
- `src/app/components/ParaSlider.test.tsx`
  - focused slider release/typed confirm tests only if `ParaSlider` changes
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - implementation closeout only after focused verification and build pass
- `docs/CHANGELOG.md`
  - implementation later only; this prep pass must not update it
- `docs/Doc-Log.md`
  - required for this prep and later implementation doc maintenance

#### No-Widening Rule

Do not implement console parity in Phase 3. Console graph/parameter commands should be handled by Phase 4 after the UI parameter commit seam is accepted.

Do not implement feature-stack parameter history, sketch entity history, sketch-plane transform history, node CAD/sketch internals, Browser/project undo, Viewer Transform undo, Catalog undo, Build Path sync, history UI, persistence, async entries, runtime/cache/provider state, command transcript, command recall, or later-generation undo behavior.

Do not turn every `onChange(...)`, live slider tick, live typed input edit, focus change, selection change, hover change, preview update, or build/runtime update into a canonical entry.

Do not broadly refactor `NodeView`, `PortView`, `ParaSlider`, `FeatureValueBar`, or `SpaghettiCanvas`. Add the smallest explicit commit hook needed for one entry per release/confirm.

#### Implementation Risks

- Committing inside live `onChange(...)` would spam history during slider drags and primitive lane movement.
- `beginGraphParameterInteraction` / `endGraphParameterInteraction` currently also wrap Browser build interaction state; adding history there must not capture runtime/build state, feature-stack params, or sketch-plane transforms by accident.
- `NodeView` has several parameter-like paths, including utility nodes, OutputPreview labels, structured-wire params, feature-stack params, and sketch-plane transform sliders. Phase 3 should start with generic graph numeric parameter commits and avoid unrelated domains.
- `setNodeParamsCommand` replaces a full node params object, so equality must compare normalized before/after authored graph state to avoid false entries caused only by object identity.
- Driven or disabled inputs may display effective values from wires; committing those display values as authored params would be wrong.
- `ParaSlider` uses `onActivate` and `onChangeEnd`, while `PortView` primitive rows use `onInteractionStart` and `onInteractionEnd`; the implementation may need a small adapter contract that treats both as the same commit boundary.
- Typed inputs must preserve native text editing undo/redo while focused; canonical undo should only apply after an explicit field commit.
- Existing broad `useSpaghettiStore.test.ts` may still have unrelated OutputPreview expectation failures; prefer focused tests and report unrelated broad-suite results if rerun.

#### Checklist

- [x] Confirm which generic graph numeric parameter rows are in Phase 3's first implementation cut.
- [x] Add a committed graph parameter history API/helper without making live parameter update setters create entries.
- [x] Capture the authored before value or normalized before graph at interaction start.
- [x] Apply live changes through the existing UI/store path during drag/edit.
- [x] Commit one canonical `Change graph parameter` entry on slider release.
- [x] Move typed numeric `Enter`, blur, or equivalent confirm coverage into `Edit-History-2 / Phase 3.1`.
- [x] Undo restores the previous authored parameter value.
- [x] Redo restores the final authored parameter value.
- [x] No-op, canceled, disabled/driven, missing node, missing parameter/feature, invalid numeric, and normalized-unchanged commits create no entry for the accepted slider-release seam.
- [x] Preserve text-input-local undo while an editable numeric field is focused.
- [x] Preserve selection, hover, camera/view, runtime/build/cache/provider, preview, command transcript, and command recall exclusions.
- [x] Add focused store/history tests for graph parameter entry ordering, undo/redo, no-op, and excluded-state preservation.
- [x] Add or extend focused UI interaction tests only where needed to prove slider release boundaries.
- [x] Leave console parity to Phase 4 and leave later generations deferred.

Phase 3 closeout note: this implementation covers `Edit-History-CLG-9` for generic UI graph node numeric parameter slider/range release commits through `commitGraphNodeParameterWithHistory(...)`. `Edit-History-CLG-10` remains open because the generic typed `NumberField` path does not expose an accepted release/confirm history boundary within the approved write scope; adding that should be a follow-up rather than a broad field refactor in this pass.

Manager acceptance verification:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed with 16 tests.
- `npm.cmd test -- --run src/app/spaghetti/canvas/PortView.test.tsx` passed with 4 tests.
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.test.tsx` passed with 47 tests.
- `npm.cmd run build` passed with existing Vite warnings for browser-externalized `path` / `crypto` from `occt-import-js` and large chunks.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - expected main proof if parameter history tests join the existing focused graph-history suite
- `npm.cmd test -- --run src/app/spaghetti/canvas/PortView.test.tsx`
  - run if primitive value interaction boundaries are touched
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - run if graph parameter row behavior or extrude depth/taper/offset UI behavior is touched
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.test.tsx`
  - run if NodeView row props or render behavior are touched
- `npm.cmd test -- --run src/app/components/ParaSlider.test.tsx`
  - run if `ParaSlider` changes

The implementation closeout should report exact commands and test counts.

#### Build Gate

Run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 3 failures.

#### Tracking Docs

This prep pass updates only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Stop Condition

Stop and report instead of widening if proving graph parameter commits requires console command rewrites, a broad node row refactor, generalized transaction lifecycle rewrites, sketch entity history, sketch-plane transform history, Browser/project ownership, Viewer Transform migration, Build Path UI, history panel work, or persistence.

Stop and report if the current UI seams cannot distinguish live parameter updates from release/confirm commits without changing visible interaction behavior.

Stop and report if undo/redo would need to capture excluded state such as selection, hover, camera/view pan/zoom, runtime build output, preview/cache/provider state, command transcript, command recall, or native text-input undo.

#### Done Shape

Phase 3 is done when UI graph numeric parameter changes create exactly one canonical edit-history entry on slider release or typed numeric confirm/blur, live value changes remain responsive without history spam, no-op/canceled/missing/disabled/driven commits create no entry, undo and redo restore the authored parameter value through the graph document update path, focused tests pass, and production build passes.

The closeout marked `Edit-History-CLG-9` complete because slider-release graph parameter commits are covered. `Edit-History-CLG-10` remains open for Phase 3.1. Leave `Edit-History-CLG-11` open for Phase 4 console parity.

## [x] `Edit-History-2 / Phase 3.1` - `Typed Numeric Parameter Commit Entries`

Add undo entries for typed generic graph node numeric parameter commits on `Enter`, blur, or equivalent confirm.

### Phase 3.1 Summary

#### Purpose

Close the remaining typed numeric half of generic UI graph node parameter undo without widening into feature-stack controls, sketch/CAD parameter systems, or console parity.

This follow-up should reuse the accepted `commitGraphNodeParameterWithHistory(...)` seam from Phase 3. It exists because the generic `NumberField` path currently emits `onChange(...)` from the input field but does not expose the same explicit focus/confirm/blur commit lifecycle that `PortView` range sliders now expose.

#### Owns

- typed generic graph node numeric parameter commits on `Enter`, blur, or equivalent confirm
- one canonical `Change graph parameter` entry per changed committed typed value through the accepted graph parameter history seam
- history-free live typed editing before confirm/blur from the canonical owner perspective
- canceled, invalid, unchanged, disabled, driven, missing-node, and missing-parameter no-entry behavior where the generic typed seam exposes those states
- preservation of text-input-local undo while the field is focused
- focused tests proving typed commit boundaries, no history spam, no-op protection, and excluded-state preservation

#### Does Not Own

- feature-stack parameter controls, including `FeatureValueBar`, `ExtrudeFeatureView`, `setExtrudeDepth`, `setExtrudeTaper`, and `setExtrudeOffset`
- sketch-plane transforms/sliders, sketch entity edits, node CAD/sketch internals, or geometry feature parameters
- console command parity for graph/parameter mutations
- enum/select/string parameter commits unless Manager explicitly approves a same-seam widening
- broad `NumberField`, `PortView`, `NodeView`, `SpaghettiCanvas`, or store refactors
- Browser/project undo, Viewer Transform undo, Catalog undo, Build Path sync, history UI, persistence, runtime/cache/provider state, command transcript, or command recall

#### Current Live Seams

`src/app/spaghetti/store/useSpaghettiStore.ts` already owns the accepted Phase 3 history seam:
- `commitGraphNodeParameterWithHistory(...)` compares a before graph against the current or supplied after graph and commits one `Change graph parameter` entry only when node params changed.
- undo/redo restore node params through graph document updates, not broad `setGraph()` clearing.
- this phase should reuse that API and avoid changing the owner unless a tiny type/helper adjustment is unavoidable.

`src/app/spaghetti/canvas/NodeView.tsx` already provides generic graph parameter draft capture for `renderInputRow(...)`:
- `beginGenericGraphParameterInteraction(...)` captures the before graph and target metadata.
- `endGenericGraphParameterInteraction(...)` calls `commitGraphNodeParameterWithHistory(...)`.
- `renderInputRow(...)` passes `onInteractionStart` / `onInteractionEnd` into generic `valueInput` rows when `driver.numberInput` exists.
- direct driver rows rendered with `NumberField` outside `PortView` are adjacent but riskier; Phase 3.1 should start with generic `PortView valueInput` rows unless Manager approves widening.

`src/app/spaghetti/canvas/PortView.tsx` is the likely minimal integration seam:
- generic `valueInput.renderAs !== 'paraSlider'` renders `NumberField` and optional `.SpaghettiPortRangeInput`.
- Phase 3 added range-slider `onInteractionStart` / `onInteractionEnd` wiring.
- primitive rows already have typed commit behavior, but those are not the generic `NumberField` path that remains open for `Edit-History-CLG-10`.
- the likely first code cut is to pass optional typed interaction callbacks from generic `valueInput` into `NumberField` without changing unrelated port wiring.

`src/app/spaghetti/canvas/fields/NumberField.tsx` owns the typed number input:
- the controlled `<input type="number">` currently calls `onChange(...)` immediately for finite edits.
- it has no `onFocus`, `onBlur`, `onKeyDown Enter`, `Escape`, `onInteractionStart`, or `onInteractionEnd` contract today.
- a small optional interaction contract can let parents capture a before graph on focus and commit on blur/Enter without making every typed edit a canonical entry.
- text-input native undo should remain local because global undo routing already defers editable targets; this phase must not intercept `Ctrl+Z` / `Meta+Z` inside the field.

`src/app/spaghetti/canvas/PortView.test.tsx` already has nearby focused interaction coverage:
- primitive typed edits stay active until `Enter` commits.
- generic range slider edits now prove start/change/end ordering.
- this is the best first test file for typed generic `NumberField` interaction lifecycle.

`src/app/spaghetti/store/graphEditHistoryStore.test.ts` should remain the focused store/history proof:
- accepted Phase 3 tests already prove graph parameter undo/redo and excluded-state preservation through `commitGraphNodeParameterWithHistory(...)`.
- Phase 3.1 may extend it only if a typed path integration needs one more store-level no-op or redo proof; otherwise rerun it as regression coverage.

#### First Pass Decisions

- Reuse `commitGraphNodeParameterWithHistory(...)`; do not introduce a second parameter history owner.
- Prefer an optional typed interaction lifecycle on `NumberField`, such as `onInteractionStart` on focus and `onInteractionEnd` on blur/Enter, routed through `PortView` generic `valueInput`.
- Keep `NumberField.onChange(...)` as the live value update callback unless a tiny local draft is required for valid typed confirm behavior.
- If keeping immediate `onChange(...)`, canonical history still commits only on blur/Enter because the before graph is captured at focus and compared on end.
- Preserve native text input undo by not handling `Ctrl+Z` / `Meta+Z` in `NumberField`; keyboard handling should be limited to `Enter` confirm and optional `Escape` cancel only if it can be done without visible behavior churn.
- Treat invalid numeric text as no committed value. If the current controlled input model cannot represent invalid drafts safely, do not widen into a full local-draft rewrite; report the limitation.
- Start with generic `PortView` `valueInput` rows that already receive `onInteractionStart` / `onInteractionEnd` from `NodeView`. Leave direct driver `NumberField` rows, utility node fields, structured feature-stack bars, and sketch-plane controls outside this pass unless Manager explicitly widens.
- Keep focused tests at the component seam plus the accepted graph-history store regression; avoid broad app-shell tests.

### Phase 3.1 Implementation Spec

#### Likely Files

- `src/app/spaghetti/canvas/PortView.tsx`
  - pass generic `valueInput.onInteractionStart` / `valueInput.onInteractionEnd` through to the `NumberField` rendered by generic port value rows
  - avoid touching primitive rows except as regression context
- `src/app/spaghetti/canvas/NodeView.tsx`
  - expected to need no or tiny changes because generic `renderInputRow(...)` already passes begin/end graph parameter hooks into `valueInput`
  - run focused tests if any row prop shape changes
- `src/app/spaghetti/canvas/fields/NumberField.tsx`
  - likely place for an optional typed commit lifecycle: focus starts, blur/Enter ends, disabled/driven fields do not start or end
  - keep changes additive and optional so existing callers without callbacks preserve behavior
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - read context only unless a tiny type/helper adjustment is required; the accepted `commitGraphNodeParameterWithHistory(...)` API should remain the commit seam
- `src/app/spaghetti/canvas/PortView.test.tsx`
  - extend with a generic `NumberField` typed focus/change/Enter or blur interaction proof
  - prove start happens before live value change and end happens only on confirm/blur
  - prove disabled generic typed inputs do not emit interaction lifecycle callbacks
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - run as regression proof for parameter history undo/redo and excluded state
  - add only if implementation needs a new store-level typed no-op proof
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - run if `NodeView` typed row props change
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - implementation closeout only after focused verification and build pass
- `docs/CHANGELOG.md`
  - implementation later only; this prep pass must not update it
- `docs/Doc-Log.md`
  - required for this prep and later implementation doc maintenance

#### No-Widening Rule

Do not implement console parity in Phase 3.1. Do not touch feature-stack controls, sketch-plane transform controls, sketch entity edits, node CAD/sketch internals, utility-node-specific controls, enum/select/string params, Browser/project undo, Viewer Transform undo, Build Path sync, history UI, persistence, runtime/cache/provider state, command transcript, or command recall.

Do not make every live typed input keystroke a canonical entry. Commit only on `Enter`, blur, or equivalent confirm after the authored value changed.

Do not broadly refactor `NumberField`, `PortView`, `NodeView`, `SpaghettiCanvas`, or the store. The intended change is a small optional lifecycle handoff that existing callers can ignore.

#### Implementation Risks

- `NumberField` is used in several surfaces, including direct driver rows, inline values, utility rows, and other canvas controls. A non-optional lifecycle change could accidentally route unrelated numeric edits into edit history.
- `NumberField` currently emits `onChange(...)` on every valid typed edit. If the implementation tries to redesign it as a local-draft commit field, that can become a broad behavior refactor.
- Controlled number inputs can be awkward for invalid intermediate text. Invalid text should not create a canonical entry, but the phase should not rewrite all number editing semantics just to represent invalid drafts.
- `Enter` and blur can both fire for the same typed edit. The implementation needs a small guard so one focus session produces at most one `onInteractionEnd`.
- `Escape` cancel would be useful, but if implementing cancel requires a broader local draft/reset model, leave it as a follow-up and ensure unchanged/no-op blur does not create an entry.
- Direct `NodeView` driver `NumberField` rows may look like generic numeric params but do not flow through `PortView valueInput`; include them only if the same optional `NumberField` callbacks can be wired without widening.

#### Checklist

- [x] Confirm the first cut targets generic `PortView valueInput` rows rendered through `NumberField`.
- [x] Add optional typed interaction callbacks to `NumberField` without changing existing caller behavior when omitted.
- [x] Start the graph parameter history draft on typed focus for enabled generic value inputs.
- [x] End the draft and commit through `commitGraphNodeParameterWithHistory(...)` on blur or `Enter`.
- [x] Ensure live typed edits update through the existing `onChange(...)` path but do not create canonical entries until confirm/blur.
- [x] Ensure unchanged focus/blur creates no entry through the accepted no-op graph parameter store comparison.
- [x] Ensure disabled/driven generic typed fields do not start or commit an interaction.
- [x] Preserve current invalid numeric handling without a broad local-draft rewrite; invalid numeric text does not call `onChange(...)`.
- [x] Preserve native text-input undo while focused and do not claim `Ctrl+Z` / `Meta+Z`.
- [x] Add focused `PortView.test.tsx` coverage for typed generic lifecycle ordering and no-op/disabled/driven behavior.
- [x] Rerun focused graph-history store tests for accepted parameter undo/redo behavior.
- [x] Confirm `NodeView.test.tsx` is not required because `NodeView` was not changed.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` during implementation closeout only.

Manager acceptance verification:

- `npm.cmd test -- --run src/app/spaghetti/canvas/PortView.test.tsx` passed with 8 tests after the driven-field lifecycle guard repair.
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed with 16 tests.
- `npm.cmd run build` passed with existing Vite warnings for browser-externalized `path` / `crypto` from `occt-import-js` and large chunks.
- `src/app/spaghetti/canvas/NodeView.test.tsx` was not run because `NodeView` did not change in this implementation.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/canvas/PortView.test.tsx`
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.test.tsx` if `NodeView` row props change

Build gate:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 3.1 failures.

#### Tracking Docs

This prep pass updates only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Stop Condition

Stop and report instead of widening if typed commit proof requires a broad `NumberField` local-draft rewrite, direct driver row migration, `SpaghettiCanvas` command refactor, graph parameter transaction rewrite, app-shell keyboard changes, feature-stack parameter wiring, sketch-plane transform history, or console command parity.

Stop and report if preserving native text-input undo would require intercepting global undo shortcuts or changing the shared keyboard dispatch boundary.

Stop and report if undo/redo would need to capture excluded state such as selection, hover, camera/view pan/zoom, runtime build output, preview/cache/provider state, command transcript, command recall, or native text-input undo.

#### Done Shape

Phase 3.1 is done: typed generic graph node numeric parameter commits now produce the accepted graph parameter history commit lifecycle on `Enter` or blur, live typed updates continue through the existing `onChange(...)` path, native field undo remains local while focused, duplicate blur-after-Enter is guarded, disabled/driven typed fields do not start canonical lifecycle callbacks, focused tests pass, and production build passes. `Edit-History-CLG-10` is complete in this phase doc; the family index remains for Manager closeout.

## [x] `Edit-History-2 / Phase 4` - `Console Parity`

Route console graph/parameter mutations through the same authored seams after UI parameter commits are accepted.

### Phase 4 Summary

#### Purpose

Close `Edit-History-CLG-11` by making existing console-authored graph/parameter mutations use the same canonical edit-history seams as equivalent UI-authored mutations.

This phase is parity over commands that already exist. It should not add a new console command language, new graph operations, or broad parser behavior. The first implementation should make the existing staged console graph-node delete path undoable through the accepted graph structure seam and verify that console-created graph nodes already flow through the accepted add-node seam.

#### Owns

- console parity for existing authored Spaghetti graph mutations that have equivalent accepted history seams
- staged console graph node delete routing through `removeGraphNodeWithHistory(...)`
- regression proof that staged console node creation continues through `createGraphNodeInDocumentAndSelect(...)` / `addGraphNodeWithHistory(...)`
- focused tests proving console-authored add/delete create the same canonical graph-history entries as UI/store-authored add/remove
- focused negative tests proving command transcript, command recall, staged navigation, camera/view, workspace mode, reference/content, sketch, and runtime behavior remain outside canonical undo
- preserving the accepted `Edit-History-1` dispatch boundary and the `Edit-History-2` graph-history store seams

#### Does Not Own

- new console command syntax, broad parser redesign, or adding graph/wire/parameter commands that do not already exist
- feature-stack parameter controls such as `FeatureValueBar`, `ExtrudeFeatureView`, `setExtrudeDepth`, `setExtrudeTaper`, or `setExtrudeOffset`
- sketch-plane transforms/sliders, sketch entity edits, geometry sketch internals, or node CAD/sketch internals
- Browser/project undo, Viewer Transform undo, reference/content transform undo, workspace layout undo, Build Path sync, history UI, persistence, async entries, runtime/cache/provider state, command transcript undo, or command recall undo
- app-shell keyboard routing, shared undo/redo dispatch changes, text-input-local undo, or console recall key handling

#### Current Live Seams

- `src/app/console/useConsoleInteraction.ts`
  - owns `handleSubmitCommand(...)` for staged and flat console submissions
  - imports `removeNodeCommand` and currently routes staged `node.delete` through `useSpaghettiStore.getState().applyGraphCommand(removeNodeCommand(...))`, which bypasses canonical graph history
  - already calls `dispatchEditHistoryShortcut(...)` for global undo/redo and must not be refactored in this phase
  - flat parser commands are currently help/console/clear/history/frame/zoom/pan/orbit/move/rotate/scale/snap/echo/status, which are mostly app/view/reference shells rather than generic graph parameter commits
- `src/app/console/ConsoleDock.tsx`
  - wires `createMissingGraphNodeInGraphDocument(...)` into `useConsoleInteraction(...)`
  - that callback calls `useSpaghettiStore.getState().createGraphNodeInDocumentAndSelect(...)`, then activates the created graph node
  - console command recall/history tests live here and should remain local
- `src/app/console/stagedNavigation.ts`
  - exposes graph staged scopes and `node.delete`
  - currently offers graph sketch/extrude/output-preview creation by entering empty staged lists and graph node delete from selected node scopes
  - does not expose wire connect/remove, node movement, or generic numeric graph parameter entry commands in the researched first-pass seams
- `src/app/console/consoleCommandParser.ts`
  - parses flat console command names, but does not currently define generic node graph-parameter commands
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - accepted history seams include `addGraphNodeWithHistory(...)`, `removeGraphNodeWithHistory(...)`, `connectGraphEdgeWithHistory(...)`, `removeGraphEdgeWithHistory(...)`, `commitGraphNodeMoveWithHistory(...)`, and `commitGraphNodeParameterWithHistory(...)`
  - `createGraphNodeInDocumentAndSelect(...)` already calls `addGraphNodeWithHistory(...)`
  - `applyGraphCommand(...)` remains a history-free graph mutation seam and should not be used for console-authored mutations that already have an accepted history seam
- `src/app/console/ConsoleDock.test.tsx`
  - already covers graph staged navigation, empty-list node creation, graph node delete paths, command recall arrows, and console history behavior
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - owns accepted graph history semantics for add/remove, move, and parameter commit restoration/exclusion behavior

#### First Pass Decisions

- Treat console-created graph nodes as already parity-aligned because `createGraphNodeInDocumentAndSelect(...)` calls `addGraphNodeWithHistory(...)`.
- Route the existing staged console `node.delete` action through `useSpaghettiStore.getState().removeGraphNodeWithHistory(...)` instead of `applyGraphCommand(removeNodeCommand(...))`.
- Do not add console wire connect/remove, node movement, or parameter mutation commands in Phase 4 because the researched staged/flat console seams do not expose those as existing equivalent commands.
- Do not make console transcript entries, command history/recall, staged navigation selection, graph focus, editor presentation mode, camera/view commands, reference/content commands, workspace mode commands, sketch draw commands, radio commands, or runtime/build commands canonical history entries.
- Keep the implementation inside existing console integration and tests. Avoid a new command manager or graph adapter layer unless the direct seam proves untestable.

### Phase 4 Implementation Spec

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
  - replace the staged `node.delete` history-free `applyGraphCommand(removeNodeCommand(...))` call with `removeGraphNodeWithHistory(...)`
  - preserve the existing staged-session resume, breadcrumb output, target activation, diagnostics, and radio burst behavior
  - avoid touching global key routing, prompt handling, flat parser command behavior, reference/content commands, workspace commands, sketch commands, or viewer/camera commands
- `src/app/console/ConsoleDock.test.tsx`
  - add or tighten focused parity coverage for console-created sketch/extrude/output-preview nodes creating one canonical undo entry
  - add or tighten focused parity coverage for staged console node delete creating one canonical undo entry and undo/redo restoring graph shape
  - add negative coverage that command transcript/history/recall paths do not create canonical entries
  - reuse existing staged graph navigation helpers where possible instead of adding broad app-shell tests
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - run as a regression gate for the accepted graph-history seams
  - add only if a small store-level parity regression is needed; prefer keeping console-specific behavior in console tests
- `src/app/console/useConsoleStore.test.ts` or `src/app/console/ConsoleBar.test.tsx`
  - run or extend only if `ConsoleDock.test.tsx` cannot prove command transcript/recall exclusions
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - implementation closeout only after focused tests and build pass
- `docs/CHANGELOG.md`
  - implementation later only; this prep pass must not update it
- `docs/Doc-Log.md`
  - required for this prep and later implementation doc maintenance

#### No-Widening Rule

Do not implement new console graph commands, parser grammar, command aliases, command prompt flows, or graph adapter architecture in this phase. Phase 4 is parity for existing console graph/parameter mutations only.

Do not touch feature-stack parameter controls, sketch-plane transform controls, sketch entity edits, node CAD/sketch internals, Browser/project undo, Viewer Transform undo, reference/content transform undo, workspace layout undo, Build Path sync, history UI, persistence, runtime/cache/provider state, command transcript, command recall, app-shell keyboard routing, or shared undo/redo dispatch.

Do not convert view/runtime console actions into canonical edit-history entries. Camera pan/orbit/zoom/frame, graph editor presentation mode, workspace viewport split/type/float/close, reference/content visibility/load/delete/transform, radio settings, and staged navigation movement remain local or owned by other future families.

#### Implementation Risks

- `node.delete` currently uses the pure graph command directly from the console integration. Switching to `removeGraphNodeWithHistory(...)` should preserve graph deletion behavior, but tests need to verify the existing staged-session resume and graph target activation still happen.
- Console-created node parity is already implemented indirectly. Tests should avoid double-committing by asserting the existing path produces one add-node entry, not by adding a second console-specific entry.
- Console tests are broad and include many app-shell behaviors. The implementation should add the smallest focused assertions around existing graph staged flows to avoid unrelated churn.
- Command history/recall lives in console-local state and can be exercised through existing `ConsoleDock` / `ConsoleBar` paths. Asserting no canonical entries for these paths is useful; routing them through edit history would be a scope break.
- Flat console commands named `move`, `rotate`, `scale`, and `snap` can refer to reference/content transform shells, not graph node movement or graph parameters. Do not treat them as CLG-11 graph parameter parity without a concrete existing graph-param mutation seam.

#### Checklist

- [x] Confirm the implementation targets only existing console-authored graph mutations with accepted history seams.
- [x] Preserve console-created node flow through `createGraphNodeInDocumentAndSelect(...)` and `addGraphNodeWithHistory(...)`.
- [x] Route staged console `node.delete` through `removeGraphNodeWithHistory(...)`.
- [x] Keep missing-node/no-op delete behavior aligned with the accepted graph history no-op protection.
- [x] Preserve staged-session resume, graph target activation, console output, and radio burst behavior after node delete.
- [x] Prove console-created nodes create one canonical add entry and undo/redo through the canonical owner.
- [x] Prove console node delete creates one canonical remove entry and undo/redo restores the graph through the accepted graph-history restoration path.
- [x] Prove command transcript entries and command recall/history actions create no canonical entries.
- [x] Prove camera/view, graph editor presentation mode, workspace mode, reference/content, sketch draw, radio, and other runtime/view console actions remain excluded or untouched by this phase.
- [x] Rerun focused console parity tests.
- [x] Rerun accepted graph-history store tests as regression coverage.
- [x] Run production build.
- [x] Update `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` during implementation closeout only.

#### Focused Verification

Implementation should run:

- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx`
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`

If command transcript/recall exclusion is proven in a different narrower file, also run the touched test, likely one of:

- `npm.cmd test -- --run src/app/console/useConsoleStore.test.ts`
- `npm.cmd test -- --run src/app/console/ConsoleBar.test.tsx`

Record any unrelated existing console test failures separately from Phase 4 failures.

Implementation verification:

- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "creates a sketch node when graph sketch scope is empty|deletes a selected sketch node with d and returns to graph scope|focuses the console from slash and recalls command history"` passed with 3 focused parity/exclusion tests.
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed with 16 tests.
- `npm.cmd run build` passed with existing Vite warnings for browser-externalized `path` / `crypto` from `occt-import-js` and large chunks.
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx` was also run and still shows unrelated existing failures in non-Phase-4 console branches, including reference/content transform, workspace/view, sketch-plane, and graph navigation expectations. The Phase 4 touched tests passed in that run.

#### Build Gate

Implementation should run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 4 failures.

#### Tracking Docs

This prep pass updates only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-2 - Graph And Parameter Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Stop Condition

Stop and report instead of widening if CLG-11 cannot be closed without adding new console command language, redesigning `consoleCommandParser`, broadening staged navigation, adding wire/parameter console commands, or rewriting app-shell keyboard dispatch.

Stop and report if console graph/parameter parity requires feature-stack parameter controls, sketch-plane transforms, sketch entity history, node CAD/sketch internals, Browser/project undo, Viewer Transform undo, reference/content transform undo, workspace layout undo, Build Path sync, history UI, persistence, runtime/cache/provider state, command transcript undo, or command recall undo.

Stop and report if a flat command appears graph-like by name but actually maps to reference/content transform, camera/view, workspace, or other local/runtime behavior.

#### Done Shape

Phase 4 is done: existing console-authored graph mutations with accepted equivalent seams now route through those seams. Staged console graph node delete uses `removeGraphNodeWithHistory(...)`, console-created graph nodes continue through `createGraphNodeInDocumentAndSelect(...)` / `addGraphNodeWithHistory(...)` without duplicate entries, focused tests prove canonical add/remove undo/redo behavior, command recall remains outside canonical undo, graph-history regression coverage passes, and production build passes. `Edit-History-CLG-11` is complete in this phase doc; the family index remains for Manager closeout.

New console command language and non-graph undo families remain future planning.

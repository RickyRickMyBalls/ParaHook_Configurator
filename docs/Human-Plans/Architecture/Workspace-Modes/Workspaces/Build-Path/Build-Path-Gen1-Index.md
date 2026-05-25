# Build Path Gen1 Index

## Doc Header

### Doc History
48. 2026-05-25 10:44:40: Implemented and closed `Build-Path-15 / Phases 1-2` with presentation-only `past` / `current` / `future` temporal-state attributes on linear timeline cards, Fusion-style subdued future icon styling that keeps cards clickable, and matching workspace Parallel topology card/connector future dimming from the selected master scrub position.
47. 2026-05-25 10:38:21: Added `Build-Path-15 - Scrub Future Icon State` as the next visual scrub clarity phase so timeline icons after the selected scrub position can read as inactive/future without becoming disabled, while preserving click-to-scrub behavior, graph truth, and Edit History boundaries.
46. 2026-05-25 10:27:42: Recorded `Build-Path-11 / Phases 3-6` as implemented with the workspace Parallel topology graph unboxed from nested `Parallel` panel chrome, UI-only top/center/bottom alignment controls, collapsed secondary lane readback, connector/card polish, focused alignment proof, TypeScript proof, production build proof, and an attempted browser smoke blocked by unavailable `iab`.
45. 2026-05-25 10:14:53: Added Build-Path-11 follow-up phases for the user's new visual goals: unbox the Parallel topology graph from nested panel chrome, add top/center/bottom topology alignment controls, move lane readback into a secondary role, and reserve final proof routing after those polish slices land.
44. 2026-05-25 10:06:57: Recorded `Build-Path-11 / Phase 2 - Parallel Icon Lane Rendering` as implemented with a visible workspace Parallel topology renderer, fixed-size icon-card columns, SVG mini connectors colored from semantic connector records, branch-playhead card selection, and focused `1 > 6 > 1` DOM proof.
43. 2026-05-25 10:01:11: Prepped `Build-Path-11 / Phase 2 - Parallel Icon Lane Rendering` for implementation as the visible renderer over the Phase 1 topology read model, including fixed-size icon-card columns, semantically colored connector lines, workspace-first proof, and the canonical `1 > 6 > 1` visual gate.
42. 2026-05-25 09:48:43: Recorded `Build-Path-11 / Phase 1 - Parallel Lane Visual Model` as implemented with a derived topology layout read model, endpoint-aware dependency metadata, OutputPreview sink reconstruction, shared Spaghetti wire color semantics, and the `Sketch -> six Extrudes -> Output` `1 > 6 > 1` proof.
41. 2026-05-25 09:27:31: Prepped `Build-Path-11 / Phase 1 - Parallel Lane Visual Model` for implementation around a new derived topology layout read model, endpoint-aware dependency metadata, Spaghetti wire-color semantic reuse, and a focused `Graph-1.parahook-graph-PARALLEL.json` `1 > 6 > 1` proof before final connector painting.
40. 2026-05-25 09:22:10: Refined `Build-Path-11 - Parallel Lane Icon Layout` around the clarified icon-card graph topology target, where a Sketch fan-out to six Extrudes and fan-in to Output should render as `1 > 6 > 1` with mini connector colors derived from Spaghetti reference-wire semantics.
39. 2026-05-25 09:02:43: Implemented and closed `Build-Path-14 / Phase 1 - Manual Node Deletion Sync And Orphaned References` so direct Spaghetti node deletion now removes current Build Path command cards from graph truth while receive references remain unresolved until undo restores the original source identity.
38. 2026-05-25 08:50:18: Added `Build-Path-14 - Node Deletion And Reference Orphan Contract` so direct Spaghetti node deletion can remove current Build Path command cards while preserving downstream reference intent as explicit unresolved or orphaned dependency state.
37. 2026-05-24 09:43:51: Layered the Model Viewport split-corner handle above the bottom-left Build Path dock so the corner split affordance remains reachable while the dock stays flush to the viewport edge.
36. 2026-05-24 09:31:22: Refined the viewport-docked Build Path rail so the horizontal scrollbar stays hidden while the strip is still growing and appears only after the timeline actually overflows its available Model Viewport width.
35. 2026-05-24 09:19:11: Updated the viewport-docked Build Path timeline so it grows with its cards up to full Model Viewport width, then exposes horizontal scrolling for longer timelines.
34. 2026-05-24 09:14:00: Moved the default viewport-docked Build Path placement to the bottom-left Model Viewport edge with zero offset as the first placement-frame cleanup before later drag/resize work.
33. 2026-05-24 09:07:39: Removed the dock-only current-command readback and previous/next panel from `Build-Path-13 / Phase 1` now that the draggable scrub marker owns viewport-docked Build Path scrub navigation.
32. 2026-05-24 08:47:02: Corrected the `Build-Path-13 / Phase 1` current-position marker so it sits after the loaded/current command card, between the current card and the next card, instead of behind the current position.
31. 2026-05-24 08:43:47: Adjusted the `Build-Path-13 / Phase 1` current-position marker so it sits in front of the loaded command card, between timeline cards, instead of centered over the selected card.
30. 2026-05-24 08:36:23: Implemented and closed `Build-Path-13 / Phase 1 - Draggable Current Position Line` with a Build Path marker overlay, drag-to-scrub selection through the existing history path, focused tests, TypeScript, production build, and local HTTP smoke coverage.
29. 2026-05-24 08:29:49: Prepped `Build-Path-13 / Phase 1 - Draggable Current Position Line` for implementation against the live Build Path strip, selection store, CSS, and focused surface tests.
28. 2026-05-24 08:25:38: Added and prepped `Build-Path-13 - Draggable Current Position Line` as an open-ended Build Path cleanup doc whose first phase adds a Fusion-style draggable current-position line for timeline scrub.
27. 2026-05-23 16:22:05: Added, implemented, and closed `Build-Path-12.2 - Timeline Selection Edit History` so user-driven Build Path master timeline selection changes now enter global Edit History and undo/redo selection without mutating CAD graph truth.
26. 2026-05-23 15:35:05: Recorded the Build Path accepted CAD command selection-follow repair so committed CAD/build events now advance the Build Path scrub selection to the newly accepted timeline step while cancelled commands leave selection alone.
25. 2026-05-23 15:09:00: Recorded `Build-Path-12.1 - Graph Lifecycle Timeline Cards` as implemented with structural `Graph Created` and `Graph Loaded` timeline cards, graph create/load intake, distinct lifecycle card display, viewport-mask safety proof, focused tests, typecheck, build, and browser smoke coverage.
24. 2026-05-23 13:54:15: Added and prepped `Build-Path-12.1 - Graph Lifecycle Timeline Cards` to plan explicit `Graph Created` and `Graph Loaded` Build Path cards before returning to Parallel lane icon layout.
23. 2026-05-23 12:45:30: Added, implemented, and closed `Build-Path-12 - Loaded Graph Build Path Reconstruction` with reconstructed Sketch/Extrude events from loaded graph structure, reconstructed dependency hints, graph-load runtime intake, focused tests, typecheck, and production build.
22. 2026-05-23 12:27:02: Added and prepped `Build-Path-11 - Parallel Lane Icon Layout` as the next collaborative Build Path phase for cleaning up Parallel mode by drawing branch-local icons in parallel lanes while preserving master timeline order and derived graph truth.
21. 2026-05-23 10:21:56: Recorded `Build-Path-10 - Viewport Scrub Preview Masking` as implemented with a Build Path-owned preview read model, presentation-only Model Viewport layer masking, source-node fallback, default first-step preview alignment, focused tests, typecheck, production build, and honest browser smoke coverage.
20. 2026-05-23 10:06:28: Added and prepped `Build-Path-10 - Viewport Scrub Preview Masking` after live review showed Build Path could select `Sketch` while the Model Viewport still showed later Extrudes, making derived viewport preview masking the next legal Build Path handoff.
19. 2026-05-23 09:09:09: Recorded `Build-Path-9 - Compare Pin And Checkpoint Contracts` as implemented with explicit Compare source/target/read-model readiness, Pin/checkpoint persistence boundaries, worker checkpoint/cache owner routing, and non-executable Compare, Pin, and checkpoint replay proof, closing the Generation 1 action-boundary ladder.
18. 2026-05-23 08:59:03: Recorded `Build-Path-8 - Branch From Here Contract` as implemented with branch-from-here readiness data, new graph-document destination policy, branch name preview, graph ownership/storage requirements, confirmation/Edit History policy, and non-executable Branch proof, advancing the action handoff to `Build-Path-9`.
17. 2026-05-23 08:54:37: Recorded `Build-Path-7 - Restore Readiness Contract` as implemented with restore readiness data, explicit missing graph snapshot/worker checkpoint requirements, confirmation/Edit History policy, and non-executable Restore proof, advancing the action handoff to `Build-Path-8` or `Build-Path-9`.
16. 2026-05-23 01:38:53: Recorded `Build-Path-6 - Explicit Actions And Checkpoint Readiness` as implemented with checkpoint readiness reads, disabled planned action affordances for Restore/Branch/Compare/Pin, and confirmed follow-on owners for restore, branch-from-here, compare/pin, and checkpoint readiness.
15. 2026-05-23 01:21:42: Added and closed `Build-Path-5.1 - Dependency Proof And Follow-Up Routing` with a fresh Sketch to dependent Extrude Parallel-lane proof, and added explicit future owners for restore readiness, branch-from-here, compare/pin, and checkpoint readiness before `Build-Path-6` starts.
14. 2026-05-23 00:39:55: Recorded `Build-Path-5 / Phases 2-3` as implemented with explicit graph dependency hints, dependency-backed branch lanes, role readbacks, branch-local playhead state, and view-only safety proof, advancing the Build Path handoff to `Build-Path-6`.
13. 2026-05-22 23:13:04: Recorded `Build-Path-5 / Phase 1 - Parallel Mode Entry` as implemented with a workspace-hosted Master/Parallel mode switch and dependency-hints-unavailable read, keeping branch lane rendering deferred until graph dependency hints are available.
12. 2026-05-22 23:09:24: Added and closed `Build-Path-4.1 - Viewport Dock Scrub Readback`, making the docked Build Path scrub selection visible with previous/next controls before the broader `Build-Path-5` parallel branch UI handoff.
11. 2026-05-22 22:45:13: Recorded the dependent Extrude intake repair after browser review showed a Sketch plus Extrude graph with only one Build Path icon, backfilling missing source Sketch nodes before the accepted Extrude event so new dependent Extrudes preserve the visible Sketch -> Extrude timeline.
10. 2026-05-22 21:20:57: Recorded the `Build-Path-4` live event population repair after browser review showed the mounted Build Path surface had no runtime events, wiring accepted live Sketch and Extrude command summaries into the Build Path store with distinct live projection ids and advancing the handoff to `Build-Path-5`.
9. 2026-05-22 21:07:40: Recorded `Build-Path-4 - View Only Scrub Inspection Integration` as implemented with Build Path-owned visible timeline selection, selected-step styling, workspace event readback, and safety proof that selection leaves Edit History redo plus authored graph snapshots unchanged, advancing the handoff to live event population or `Build-Path-5`.
8. 2026-05-22 20:42:43: Recorded `Build-Path-3 - Viewport Docked Icon Strip And Workspace Surface` as implemented with shared workspace surface registration, a bottom Model Viewport-docked no-label icon strip, workspace/floating hosted chrome, focused tests, build proof, and browser verification, advancing the handoff to `Build-Path-4`.
7. 2026-05-22 20:04:43: Recorded `Build-Path-2 - Runtime Event Intake And Timeline State` as implemented with a Build Path-owned runtime event state seam, deterministic command projection intake, duplicate/cancelled skip behavior, master timeline reads, and Edit History safety proof, advancing the handoff to `Build-Path-3`.
6. 2026-05-22 19:55:49: Expanded the Build Path Generation 1 index beyond the completed foundation phase, adding the next family-phase ladder for runtime event intake, viewport-docked UI, scrub inspection, parallel mode UI, and explicit action/checkpoint planning, with matching `Future/` phase-doc handoffs.
5. 2026-05-22 19:43:21: Recorded `Build-Path-1 / Phases 2-6` as implemented with the first pure master timeline, view-only master scrub state, dependency-aware branch projection, branch-local parallel scrub, and explicit restore/branch/compare/pin boundaries, closing the Generation 1 foundation without adding UI or Edit History ownership.
4. 2026-05-22 18:53:41: Recorded `Build-Path-1 / Phase 1 - Accepted Graph Build Event Model` as implemented with a Build Path-owned event helper and focused tests, advancing the current handoff to `Build-Path-1 / Phase 2 - Master Linear Timeline`.
3. 2026-05-22 18:45:37: Added the Generation 1 presentation boundary for a clean Model Viewport-docked CAD icon timeline with no content label, plus Console-like titlebar chrome when Build Path is split, tiled, or windowed.
2. 2026-05-22 18:00:21: Prepped `Build-Path-1 / Phase 1` as the current implementation handoff, grounding it in the live `console/buildPathProjection` seam and narrowing the first runtime cut to a Build Path-owned event wrapper over existing command projections.
1. 2026-05-22 17:51:51: Added this active Generation 1 planning index for the `Build Path` workspace family, routing graph-authored build events, master scrub, branch timelines, and later restore/branch actions into the first standalone `Build-Path-1` future plan.

### Purpose

This file is the active `Generation 1` planning index for the `Build Path` workspace family under `Workspace Modes`.

Use it to answer:
- how the `Build Path` `Generation 1` vision becomes family phases
- which `Generation 1` HLG are preserved from `Build-Path-Vision.md`
- which first family phase should be created or implemented next
- how Build Path stays separate from canonical Edit History undo/redo
- how Build Path reads Spaghetti graph-authored command history without becoming Spaghetti

Do not use it for:
- broad Build Path north-star ownership that belongs in `Build-Path-Vision.md`
- later generations after a dedicated `Build-Path-GenN-Index.md` exists
- implementation-phase specs that belong in standalone `Future/` Family Phase Docs
- worker cache/checkpoint details before the owning implementation phase
- runtime restore, branch, or comparison UI before view-only scrub exists

### Family Structure

Use this folder like this:

- `Build-Path-Vision.md`
  - north-star product and ownership direction
- `Build-Path-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Future/`
  - standalone implementation-ready `Build Path` Family Phase Docs
- `Shipped/`
  - completed `Build Path` records after implementation closes
- `archive/`
  - old Build Path planning records retained for history

## Doc Body

### Short Version

`Build Path` should become a real workspace surface for reading and scrubbing accepted graph-authored CAD/build history.

The first family lane is `Build-Path-1`.

`Build-Path-1` should prove the graph build timeline foundation first:
- define accepted graph build event records
- derive one master linear timeline
- add view-only master scrub semantics
- derive parallel branch lanes from graph dependencies
- add branch-local scrub mode
- keep explicit restore, branch-from-here, compare, and pin actions separate until the reader is trustworthy
- preserve the default presentation as a clean Model Viewport icon strip with no content label
- keep split/tiled/windowed presentation compatible with normal workspace titlebar chrome

### Current Planning Read

This file owns the active `Generation 1` family-phase routing.

Current legal family-phase ladder:
- `Build-Path-1` - accepted graph event timeline foundation, master scrub, branch detection, and parallel scrub planning
- `Build-Path-2` - runtime event intake and Build Path state ownership
- `Build-Path-3` - viewport-docked icon strip and workspace surface mounting
- `Build-Path-4` - view-only scrub inspection and graph/viewport readback
- `Build-Path-4.1` - viewport-docked scrub readback and previous/next controls
- `Build-Path-5` - parallel branch timeline UI and branch-local scrub controls
- `Build-Path-5.1` - fresh dependency proof and follow-up phase routing
- `Build-Path-6` - explicit restore, branch, compare, pin, and checkpoint action planning
- `Build-Path-7` - restore readiness contract
- `Build-Path-8` - branch-from-here contract
- `Build-Path-9` - compare, pin, and checkpoint contracts
- `Build-Path-10` - viewport scrub preview masking
- `Build-Path-11` - parallel lane icon layout
- `Build-Path-12` - loaded graph build path reconstruction
- `Build-Path-12.1` - graph lifecycle timeline cards
- `Build-Path-12.2` - timeline selection Edit History
- `Build-Path-13` - draggable current-position line
- `Build-Path-14` - node deletion and reference orphan contract
- `Build-Path-15` - scrub future icon state

Important planning rule:
- use this index to choose and bound the next `Build-Path-N` family phase
- use a matching standalone `Future/` Family Phase Doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone

Dispatch next:
- Build Path Generation 1 visual-preview and action-boundary ladder is complete through `Build-Path-10`.
- `Build-Path-12.1` is complete; structural `Graph Created` and `Graph Loaded` cards are now available as graph/lane anchors.
- accepted CAD/build command intake now auto-selects the newly accepted Build Path timeline step so the dock follows the user's latest commit.
- `Build-Path-12.2` is complete; user-driven master timeline selection changes now enter global Edit History so Ctrl+Z/Ctrl+Y can walk Build Path timeline moves.
- `Build-Path-13 / Phase 1` is complete; Build Path now has a draggable current-position line over the existing strip, using the current `selectTimelineStep` selection/history path.
- `Build-Path-14 / Phase 1` is complete: direct Spaghetti node deletion removes current Build Path command cards from graph truth, while downstream receive-reference reads preserve explicit unresolved intent instead of silently remapping.
- `Build-Path-11` is complete through Phase 6: workspace Parallel mode now renders the topology graph unboxed in workspace space, supports top/center/bottom source/sink alignment as UI state, keeps lane readback secondary/collapsed, and preserves semantic connector colors.
- `Build-Path-15` is complete: linear timeline cards and workspace Parallel topology cards/connectors now expose presentation-only temporal state so future steps after the current scrub position read as inactive/future while staying clickable scrub targets.
- `Build-Path-12` is complete for reconstructed loaded-graph structure; exact persisted Build Path event history remains a later schema/file-format phase.
- `Build-Path-11` visual direction is captured: the canonical proof graph is `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json`, which should read as `Sketch -> six parallel Extrudes -> Output`.
- later action runtime still needs a new explicit phase for compare UI, pin persistence, restore/branch execution, worker checkpoint/cache ownership, or deeper seeded browser replay proof.
- the accepted live Sketch/Extrude command population seam is now wired and covered by a fresh dependency proof in `Build-Path-5.1`; new accepted Extrudes also backfill missing source Sketch nodes before the Extrude event and emit Build Path dependency hints for branch lane projection.
- `Build-Path-6` now confirms `Build-Path-7`, `Build-Path-8`, and `Build-Path-9` as follow-on owners for restore, branch-from-here, compare/pin, and checkpoint/cache readiness.
- keep any live event population pass separate from scrub mutation, restore, branch, compare, pin, and checkpoint behavior.

## Vision

`Build-Path-Vision.md` remains the broad north-star.

This Generation Index Doc owns the current `Generation 1` family-phase routing read.

The healthy Generation 1 read is:
- Build Path records accepted graph-authored build events across all graphs
- master timeline shows one linear accepted order
- branch timelines are derived from dependencies, not stored as a second source of history
- master scrub is the main global playhead
- branch scrub controls are branch-local inspection playheads anchored to the same master story
- scrub navigation is view-only by default
- viewport scrub preview can hide or ghost later geometry as derived presentation, but it must not become restore, replay, or authored graph mutation
- Edit History remains the canonical Ctrl+Z and Redo owner
- Spaghetti remains the graph authoring owner
- the default Build Path presentation is a compact Model Viewport-docked icon strip
- split, tiled, and windowed Build Path presentations still use normal workspace titlebar chrome like Console
- explicit restore, branch-from-here, compare, and pin actions are later deliberate commands

Important boundary rule:
- if a question is about broad `Build Path` purpose, use `Build-Path-Vision.md`
- if a question is about current `Generation 1` family-phase order, use this index
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc

## Wishlist Organization

### High Level Goals

The canonical human-level goals live in `Build-Path-Vision.md` under `## Doc Body > ### Human Level Goals`.

This index repeats them so current `Generation 1` family-phase routing stays readable.

- [x] `Build-Path-Gen1-HLG-1. Build Path should have its own dedicated workspace-family folder with a vision, generation index, and future implementation plan.`
- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-1. Add a workspace-family planning home and route `Build Path` through the shared workspace surface model.
- [x] Build-Path-Gen1-CLG-2. Define a stable accepted graph build event record over committed graph command summaries.
- [x] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.
- [x] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [x] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [x] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.
- [x] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.
- [x] Build-Path-Gen1-CLG-9. Add a derived viewport preview mask for Build Path scrub selection without changing graph truth, viewer build truth, or Edit History.
- [x] Build-Path-Gen1-CLG-10. Draw Parallel mode branch-local build icons in derived parallel lanes without changing master timeline order, graph truth, or Edit History.
- [x] Build-Path-Gen1-CLG-10.1. Derive a compact topology icon layout from graph dependencies so fan-out/fan-in structures such as `Sketch -> six Extrudes -> Output` render as icon cards connected by semantically colored mini wires.
- [x] Build-Path-Gen1-CLG-11. Reconstruct a derived Build Path timeline and dependency read when graph files are loaded, while marking the source as reconstructed and preserving graph/Edit History truth.
- [x] Build-Path-Gen1-CLG-12. Add explicit graph lifecycle timeline cards for graph creation and graph load without treating them as geometry operations or Edit History.
- [x] Build-Path-Gen1-CLG-13. Add global Edit History entries for user-driven Build Path master timeline selection changes without mutating graph truth.
- [x] Build-Path-Gen1-CLG-14. Add a visible draggable current-position line to the Build Path timeline that scrubs existing selection state without changing graph truth, accepted event order, or restore/replay boundaries.
- [ ] Build-Path-Gen1-CLG-15. Treat direct Spaghetti node deletion as graph truth for Build Path card removal while preserving downstream reference intent as explicit unresolved or orphaned dependencies.
- [x] Build-Path-Gen1-CLG-16. Add presentation-only temporal state to Build Path timeline icons so future steps after the scrub position read as inactive without becoming disabled or mutating graph truth.

### `Build-Path-1`

- [x] Create the standalone `Future/Build-Path-1 - Accepted Graph Event Timeline Foundation.md` Family Phase Doc.
- [x] Define accepted graph build event shape.
- [x] Derive a master linear timeline from accepted graph build events.
- [x] Define view-only master scrub behavior.
- [x] Derive branch lanes from graph dependencies.
- [x] Define branch-local scrub mode.
- [x] Preserve explicit restore, branch, compare, and pin actions as later commands.
- [x] Keep Edit History, Spaghetti graph authoring, and worker checkpoint ownership separate.
- [x] Preserve the no-content-label icon timeline direction for the default viewport-docked Build Path surface and the titlebar rule for split/tiled/windowed mode.
- [x] `Build-Path-Gen1-HLG-1`
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`
- [x] `Build-Path-Gen1-HLG-9`
- [x] Build-Path-Gen1-CLG-1.
- [x] Build-Path-Gen1-CLG-2.
- [x] Build-Path-Gen1-CLG-3.
- [x] Build-Path-Gen1-CLG-4.
- [x] Build-Path-Gen1-CLG-5.
- [x] Build-Path-Gen1-CLG-6.
- [x] Build-Path-Gen1-CLG-7.
- [x] Build-Path-Gen1-CLG-8.

### `Build-Path-2`

- [x] Create a Build Path-owned runtime state seam for accepted event intake.
- [x] Connect accepted command projections to Build Path events without making Console, Spaghetti, or Edit History own the timeline.
- [x] Derive the master timeline from live Build Path state.
- [x] Preserve empty-state behavior when no accepted events exist.
- [x] Keep event intake idempotent and ordered by accepted sequence.
- [x] Avoid UI mounting, scrub visual replay, branch UI, restore actions, and worker checkpoint/cache behavior.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-2.
- [x] Build-Path-Gen1-CLG-3.

### `Build-Path-3`

- [x] Register Build Path as a real workspace surface or viewport-attached child surface through the shared workspace model.
- [x] Render the default Model Viewport-docked icon strip with no visible content label.
- [x] Support top or bottom viewport docking, with bottom sitting above Console.
- [x] Preserve normal titlebar chrome when Build Path is split, tiled, windowed, or otherwise hosted as a workspace pane.
- [x] Render accepted events as CAD/build icons using the Phase 2/3 timeline display metadata.
- [x] Avoid scrub movement, branch UI, restore actions, comparison UI, and worker checkpoint/cache behavior.
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`
- [x] Build-Path-Gen1-CLG-1.
- [x] Build-Path-Gen1-CLG-3.
- [x] Build-Path-Gen1-CLG-8.

### `Build-Path-4`

- [x] Wire Build Path timeline selection to view-only master scrub inspection.
- [x] Show the selected build step and related graph/build references without mutating authored graph truth.
- [x] Preserve Edit History undo/redo stacks while scrub selection changes.
- [x] Add graph/node highlighting or readback only as derived inspection, not authored selection mutation.
- [x] Keep restore, branch-from-here, compare, pin, and worker checkpoint replay out of implicit scrub.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`
- [x] Build-Path-Gen1-CLG-4.
- [x] Build-Path-Gen1-CLG-7.

### `Build-Path-5`

- [x] Add a parallel mode UI entry over the Build Path workspace surface.
- [x] Render branch-local timelines without replacing the master timeline.
- [x] Let branch-local playheads move independently inside their lanes while staying anchored to master context.
- [x] Classify and present linear, branch-local, merge, and checkpoint candidate events clearly.
- [x] Keep branch-local scrub view-only and avoid graph layout/arrangement behavior.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-5.
- [x] Build-Path-Gen1-CLG-6.

### `Build-Path-5.1`

- [x] Add a fresh Sketch to dependent Extrude dependency proof through the public Build Path recording helpers.
- [x] Prove dependency-backed Parallel mode reaches `ready`.
- [x] Prove the proof path preserves master order and Edit History redo.
- [x] Add future phase docs for restore readiness, branch-from-here, compare/pin, and checkpoint readiness.
- [x] Keep `Build-Path-6` as the next legal action-boundary task.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`
- [ ] `Build-Path-Gen1-HLG-8`
- [x] Build-Path-Gen1-CLG-5.
- [x] Build-Path-Gen1-CLG-6.
- [ ] Build-Path-Gen1-CLG-7.

### `Build-Path-4.1`

- [x] Add a compact selected-step readback to the viewport-docked Build Path strip.
- [x] Add previous/next dock controls over Build Path-owned selection state.
- [x] Preserve the no-content-label dock presentation.
- [x] Prove dock scrub controls do not create Edit History entries or clear redo.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`
- [x] Build-Path-Gen1-CLG-4.
- [x] Build-Path-Gen1-CLG-8.

### `Build-Path-6`

- [x] Plan and gate explicit restore, branch-from-here, compare, and pin commands after view-only scrub is visible.
- [x] Define checkpoint/readiness requirements before any action mutates authored graph truth or stores worker replay state.
- [x] Keep actions user-invoked and never triggered by scrub movement alone.
- [x] Route worker checkpoint/cache details into their own implementation phase before runtime storage ships.
- [x] Create follow-on family phases if restore, branch creation, comparison UI, or checkpoint storage proves too broad for one pass.
- [x] `Build-Path-Gen1-HLG-8`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-7.

### `Build-Path-7`

- [x] Define restore-ready event/checkpoint requirements.
- [x] Define restore command UX, confirmation, and Edit History relationship.
- [x] Keep restore explicit and separate from scrub movement.
- [x] `Build-Path-Gen1-HLG-8`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-7.

### `Build-Path-8`

- [x] Define branch-from-here authored ownership rules.
- [x] Decide graph/document/storage implications.
- [x] Define branch naming, visibility, and Edit History relationship.
- [x] Preserve view-only branch-local scrub.
- [x] `Build-Path-Gen1-HLG-8`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-7.

### `Build-Path-9`

- [x] Define compare boundary and needed read models.
- [x] Define pin/checkpoint candidate persistence boundaries.
- [x] Define worker checkpoint/cache readiness or split it into a dedicated owner.
- [x] `Build-Path-Gen1-HLG-8`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-7.

### `Build-Path-10`

- [x] Define the selected-step viewport preview read model.
- [x] Map accepted Build Path events to included/excluded output ids where the data supports it.
- [x] Apply the preview read to the Model Viewport as presentation-only masking.
- [x] Hide or ghost later geometry when an earlier Build Path step is selected.
- [x] Preserve final geometry when scrub preview is cleared or the latest step is selected.
- [x] Prove preview masking does not mutate graph truth, Browser content truth, worker cache state, or Edit History.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-8`
- [x] Build-Path-Gen1-CLG-9.

### `Build-Path-11`

- [x] Define the Parallel-mode visual lane model for side-by-side branch-local icons.
- [x] Render branch-local icons in derived parallel lanes where existing branch data supports it.
- [x] Keep Master mode and master timeline order unchanged.
- [x] Preserve branch-local playhead/readback safety and Edit History separation.
- [x] Record any follow-up visual decisions after user direction.
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-10.

### `Build-Path-12`

- [x] Add a pure graph-structure reconstruction helper.
- [x] Derive supported Sketch and Extrude events from loaded graph nodes.
- [x] Derive reconstructed dependency hints from graph edges.
- [x] Feed reconstructed events into Build Path runtime when graph files are loaded.
- [x] Replace stale reconstructed events for the same graph without clearing unrelated recorded events.
- [x] Defer persisted Build Path event history to a later schema/file-format phase.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-6`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-11.

### `Build-Path-12.1`

- [x] Define lifecycle event/card data for `Graph Created` and `Graph Loaded`.
- [x] Record or derive a `Graph Created` card when a graph document is created.
- [x] Record or derive a `Graph Loaded` card when a graph file is loaded.
- [x] Render lifecycle cards distinctly from Sketch/Extrude build-operation cards.
- [x] Prove lifecycle cards do not affect viewport geometry preview masking.
- [x] Keep lifecycle cards structural, non-geometry, and separate from Edit History.
- [x] `Build-Path-Gen1-HLG-2`
- [x] `Build-Path-Gen1-HLG-5`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`
- [x] Build-Path-Gen1-CLG-12.

### `Build-Path-12.2`

- [x] Record user-driven master timeline selection changes in global Edit History.
- [x] Undo restores the previous Build Path selected timeline step.
- [x] Redo restores the later Build Path selected timeline step.
- [x] Keep accepted CAD command auto-follow as internal selection state.
- [x] Preserve graph truth, restore boundaries, and worker/cache boundaries.
- [x] `Build-Path-Gen1-HLG-4`
- [x] `Build-Path-Gen1-HLG-7`
- [x] Build-Path-Gen1-CLG-13.

### `Build-Path-13`

- [x] Create the standalone `Future/Build-Path-13 - Draggable Current Position Line.md` Family Phase Doc.
- [x] Add a visible current-position line to the Build Path strip.
- [x] Let the user drag the line left and right to scrub existing Build Path timeline steps.
- [x] Keep icon selection/readback, viewport preview masking, and Edit History semantics downstream from the selected timeline step.
- [x] Preserve graph truth, accepted event order, restore/replay boundaries, and compact viewport-docked presentation.
- [ ] Leave later cleanup phases open for the user's next direction.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`
- [x] Build-Path-Gen1-CLG-14.

### `Build-Path-14`

- [x] Create the standalone `Future/Build-Path-14 - Node Deletion And Reference Orphan Contract.md` Family Phase Doc.
- [ ] Route explicit Spaghetti node deletion through Build Path graph-snapshot sync.
- [ ] Remove current Build Path cards whose backing command nodes no longer exist.
- [ ] Preserve downstream reference intent as unresolved or orphaned instead of deleting or remapping it silently.
- [ ] Prove undo restores the deleted node, Build Path card, and reference resolution.
- [ ] Prove replacement nodes do not steal old reference identities without explicit user rebind.
- [ ] `Build-Path-Gen1-HLG-2`
- [ ] `Build-Path-Gen1-HLG-7`
- [ ] `Build-Path-Gen1-HLG-8`
- [ ] Build-Path-Gen1-CLG-15.

### `Build-Path-15`

- [x] Create the standalone `Future/Build-Path-15 - Scrub Future Icon State.md` Family Phase Doc.
- [x] Derive `past`, `current`, and `future` temporal state from the selected master timeline position.
- [x] Show future icons after the scrub marker as visually inactive without disabling them.
- [x] Preserve click-to-scrub behavior for future cards.
- [x] Carry the same temporal-state language into Parallel topology cards and connectors after the linear strip is proven.
- [x] Preserve graph truth, accepted event order, Edit History boundaries, and viewport geometry masking ownership.
- [x] `Build-Path-Gen1-HLG-3`
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-9`
- [x] Build-Path-Gen1-CLG-16.

## [x] `Build-Path-1` - `Accepted Graph Event Timeline Foundation`

### Family Phase Summary

Create the first implementation-planning surface for the `Build Path` workspace.

This phase should make the accepted graph event and scrub-timeline direction concrete before any runtime implementation starts.

The first family phase should be small enough to ship in slices:
1. accepted event model
2. master timeline
3. view-only master scrub
4. branch detection
5. parallel scrub mode
6. explicit restore/branch action boundaries

Current handoff:
- `Build-Path-1` is implemented through Phase 6.
- next Build Path runtime work should create a new explicit future phase for UI mounting, restore/branch actions, compare, pin, or worker checkpoint behavior.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-1. Build Path should have its own dedicated workspace-family folder with a vision, generation index, and future implementation plan.`
- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`
- [x] Build-Path-Gen1-CLG-1. Add a workspace-family planning home and route `Build Path` through the shared workspace surface model.
- [x] Build-Path-Gen1-CLG-2. Define a stable accepted graph build event record over committed graph command summaries.
- [x] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.
- [x] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [x] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [x] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.
- [x] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.

### Owns

- first Build Path workspace-family implementation ladder
- accepted graph build event model
- master timeline projection
- view-only scrub semantics
- branch lane derivation
- parallel scrub mode direction
- restore/branch boundary planning
- viewport-docked icon-strip presentation boundary
- split/tiled/windowed titlebar chrome boundary

### Does Not Own

- replacing `Edit History`
- changing Ctrl+Z or Redo behavior
- making scrub movement canonical undo entries
- owning Spaghetti graph nodes, wires, or params
- worker checkpoint/cache implementation before its phase
- final restore/branch/compare UI
- broad graph layout or arrangement behavior

### Planning Read

The first implementation should begin from the strongest existing Spaghetti-side bridge:
- accepted graph-command summaries from viewport/console/toolbar command work
- `Spaghetti-Editor 8 / Phase 4` Build Path projection handoff
- committed Sketch and Extrude command summaries
- graph ids, node ids, mutation summaries, command family, and entry point

The first runtime pass should stay conservative:
- cancelled command sessions do not become Build Path events
- transient preview states do not become Build Path events
- Build Path can be empty if there are no accepted graph build events
- no authored graph mutation should happen when the user scrubs

### Family Phase Doc

- [x] `Future/Build-Path-1 - Accepted Graph Event Timeline Foundation.md`

## [x] `Build-Path-2` - `Runtime Event Intake And Timeline State`

### Family Phase Summary

Make the shipped Build Path event and timeline helpers part of live runtime state.

Current handoff:
- `Build-Path-2` is implemented.
- next code cut should use `Future/Build-Path-3 - Viewport Docked Icon Strip And Workspace Surface.md` to register and mount the first visible Build Path surface.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-2. Define a stable accepted graph build event record over committed graph command summaries.
- [x] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.

### Owns

- Build Path runtime state ownership
- accepted event intake
- timeline read derivation from stored Build Path events
- ordering/idempotency policy for accepted events

### Does Not Own

- visible Build Path UI
- scrub replay or inspection presentation
- branch lane UI
- restore, branch, compare, or pin actions
- worker checkpoint/cache storage

### Family Phase Doc

- [x] `Future/Build-Path-2 - Runtime Event Intake And Timeline State.md`

## [x] `Build-Path-3` - `Viewport Docked Icon Strip And Workspace Surface`

### Family Phase Summary

Mount Build Path visibly as the compact viewport-docked icon strip and as a normal workspace-hosted surface when split, tiled, or windowed.

Current handoff:
- `Build-Path-3` is implemented.
- next code cut should use `Future/Build-Path-4 - View Only Scrub Inspection Integration.md` to connect visible timeline selection to view-only inspection state.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`
- [x] Build-Path-Gen1-CLG-1. Add a workspace-family planning home and route `Build Path` through the shared workspace surface model.
- [x] Build-Path-Gen1-CLG-3. Derive one master timeline from accepted graph build events without depending on Edit History private payloads.
- [x] Build-Path-Gen1-CLG-8. Preserve the compact viewport-docked icon-strip presentation while allowing split/tiled/windowed workspace chrome to show a titlebar.

### Owns

- workspace surface registration or viewport-attached surface routing
- compact icon timeline rendering
- dock placement rules
- split/tiled/windowed titlebar behavior

### Does Not Own

- scrub movement
- branch mode UI
- restore/branch/compare/pin actions
- worker checkpoint/cache storage

### Family Phase Doc

- [x] `Future/Build-Path-3 - Viewport Docked Icon Strip And Workspace Surface.md`

## [x] `Build-Path-4` - `View Only Scrub Inspection Integration`

### Family Phase Summary

Connect visible timeline selection to view-only master scrub inspection without touching authored graph truth or Edit History stacks.

Current handoff:
- `Build-Path-4` is implemented.
- next practical integration is live accepted command population into the Build Path runtime store, then `Build-Path-5 - Parallel Branch Timeline UI`.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] Build-Path-Gen1-CLG-4. Define view-only master scrub behavior that does not create canonical undo entries or mutate the authored graph head.
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### Owns

- timeline selection interaction
- selected-step readback
- derived graph/build reference highlighting
- proof that scrub selection is not undo/redo

### Does Not Own

- authored restore
- branch creation
- comparison UI
- worker checkpoint replay

### Family Phase Doc

- [x] `Future/Build-Path-4 - View Only Scrub Inspection Integration.md`

## [x] `Build-Path-5` - `Parallel Branch Timeline UI`

### Family Phase Summary

Add the visible parallel mode over derived branch lanes and branch-local playheads while preserving one master story.

Current handoff:
- `Build-Path-5` is implemented.
- next code cut should use `Future/Build-Path-6 - Explicit Actions And Checkpoint Readiness.md` to plan restore, branch-from-here, compare, pin, and checkpoint readiness as explicit later commands.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [x] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.

### Owns

- parallel mode toggle or surface state
- branch lane rendering
- branch-local playhead controls
- merge/checkpoint candidate presentation

### Does Not Own

- graph layout or arrangement UI
- authored branch creation
- restore/compare runtime
- worker checkpoint/cache implementation

### Family Phase Doc

- [x] `Future/Build-Path-5 - Parallel Branch Timeline UI.md`

## [x] `Build-Path-5.1` - `Dependency Proof And Follow-Up Routing`

### Family Phase Summary

Prove the fresh dependency-backed Parallel path before action-boundary planning, then create the explicit follow-up action owner docs that `Build-Path-6` should confirm or revise.

Current handoff:
- `Build-Path-5.1` is implemented.
- next code/docs cut should use `Future/Build-Path-6 - Explicit Actions And Checkpoint Readiness.md`.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [ ] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] Build-Path-Gen1-CLG-5. Derive branch lanes from graph dependency structure so Build Path can distinguish linear chains, parallel work, and merge/checkpoint boundaries.
- [x] Build-Path-Gen1-CLG-6. Define branch-local scrub mode over derived branch timelines while preserving one master timeline and one source event model.
- [ ] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### Owns

- fresh Build Path dependency proof
- follow-up phase routing for action owners
- Dispatch handoff to `Build-Path-6`

### Does Not Own

- restore runtime
- branch creation runtime
- comparison UI
- pin persistence
- worker checkpoint/cache implementation

### Family Phase Doc

- [x] `Future/Build-Path-5.1 - Dependency Proof And Follow-Up Routing.md`

## [x] `Build-Path-6` - `Explicit Actions And Checkpoint Readiness`

### Family Phase Summary

Plan the first explicit command surfaces after Build Path has visible, trustworthy view-only scrub behavior.

Current handoff:
- `Build-Path-6` is implemented.
- next legal action-lane task is `Future/Build-Path-7 - Restore Readiness Contract.md`, unless the user chooses branch-from-here or compare/pin first.
- follow-on owner docs exist for `Build-Path-7`, `Build-Path-8`, and `Build-Path-9`.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### Owns

- explicit action command boundaries
- checkpoint readiness rules
- worker/cache handoff planning
- follow-on phase routing for restore, branch, compare, or pin
- disabled planned workspace action affordance boundaries

### Does Not Own

- implicit scrub side effects
- unapproved authored graph restore
- unapproved branch graph storage
- comparison UI before a reader truth exists

### Family Phase Doc

- [x] `Future/Build-Path-6 - Explicit Actions And Checkpoint Readiness.md`

## [x] `Build-Path-7` - `Restore Readiness Contract`

### Family Phase Summary

Define what a real restore command needs before Build Path can mutate authored graph truth from a timeline point.

Current handoff:
- `Build-Path-7` is implemented.
- restore readiness is closed; any Restore execution now needs a new explicit runtime phase.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### Owns

- restore-ready data requirements
- restore command boundary
- Edit History relationship planning
- explicit proof that Restore is not executable without graph snapshot semantics and worker checkpoint data

### Does Not Own

- implicit scrub restore
- runtime graph replay
- branch creation
- comparison UI

### Family Phase Doc

- [x] `Future/Build-Path-7 - Restore Readiness Contract.md`

## [x] `Build-Path-8` - `Branch From Here Contract`

### Family Phase Summary

Define branch-from-here as an authored command separate from view-only branch-local scrub.

Current handoff:
- `Build-Path-8` is implemented.
- branch-from-here readiness is closed; any Branch execution now needs a new explicit runtime phase.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### Owns

- branch-from-here ownership rules
- graph/document/storage implications
- branch naming and history relationship
- explicit proof that Branch is not executable without branch storage policy

### Does Not Own

- hidden branch creation
- restore replay
- comparison UI
- worker checkpoint storage

### Family Phase Doc

- [x] `Future/Build-Path-8 - Branch From Here Contract.md`

## [x] `Build-Path-9` - `Compare Pin And Checkpoint Contracts`

### Family Phase Summary

Define compare, pin, and checkpoint/cache readiness boundaries without making Build Path a hidden graph truth or worker cache owner.

Current handoff:
- `Build-Path-9` is implemented.
- next Build Path action runtime needs a new explicit phase for compare UI, pin persistence, restore/branch execution, or worker checkpoint/cache ownership.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-7. Keep restore, branch-from-here, compare, and pin actions explicit later commands rather than implicit scrub side effects.

### Owns

- compare read model planning
- pin/checkpoint persistence boundaries
- worker checkpoint/cache readiness routing
- explicit proof that Compare, Pin, and checkpoint replay are not executable without later runtime owners

### Does Not Own

- comparison UI execution
- pin persistence before ownership is accepted
- worker cache implementation
- restore or branch runtime

### Family Phase Doc

- [x] `Future/Build-Path-9 - Compare Pin And Checkpoint Contracts.md`

## [x] `Build-Path-10` - `Viewport Scrub Preview Masking`

### Family Phase Summary

Make Build Path scrub visually legible in the Model Viewport by hiding or ghosting geometry that belongs to later Build Path steps.

Current handoff:
- `Future/Build-Path-10 - Viewport Scrub Preview Masking.md`
- implemented and closed with a pure preview read model plus presentation-only viewer masking.
- next Build Path runtime work must create a new explicit future phase before adding compare UI, pin persistence, restore/branch execution, worker checkpoint/cache ownership, or seeded browser replay proof.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] Build-Path-Gen1-CLG-9. Add a derived viewport preview mask for Build Path scrub selection without changing graph truth, viewer build truth, or Edit History.

### Owns

- selected-step viewport preview read model
- included/excluded output id mapping from accepted Build Path events where available
- presentation-only masking or ghosting of later geometry in Model Viewport
- safety proof that visual preview is not restore, replay, Browser visibility mutation, or Edit History mutation

### Does Not Own

- authored graph restore
- worker checkpoint replay
- graph rebuild execution
- Compare UI
- Pin persistence
- Branch or Restore command execution

### Family Phase Doc

- [x] `Future/Build-Path-10 - Viewport Scrub Preview Masking.md`

## [x] `Build-Path-11` - `Parallel Lane Icon Layout`

### Family Phase Summary

Clean up Build Path Parallel mode so independent branch-local build icons become a compact icon-card graph projection of Spaghetti topology instead of reading as one cramped linear strip.

Current handoff:
- `Future/Build-Path-11 - Parallel Lane Icon Layout.md`
- Phase 1 is implemented as the derived topology layout read model and focused proof.
- Phase 2 is implemented as the visible workspace-hosted renderer over the Phase 1 topology read model.
- Phases 3-6 are implemented: the workspace Parallel graph is unboxed from nested panel chrome, top/center/bottom alignment controls are UI-only state, lane readback is collapsed behind a secondary disclosure, and final proof routing is recorded.
- the target is Build Path icon cards connected by mini dependency lines, not full Spaghetti node cards.
- connector colors should derive from the same semantic reference-wire color family used by the underlying Spaghetti edge or port type.
- the canonical proof graph is `docs/example-graphs/Graph-1.parahook-graph-PARALLEL.json`.
- the canonical rendered shape is `Sketch -> six parallel Extrudes -> Output`, visually reading as `1 > 6 > 1`.
- Phase 1 source seams are `buildPathTimeline.ts`, `reconstructBuildPathFromGraph.ts`, `recordBuildPathGraphCommand.ts`, `BuildPathSurface.tsx`, shared `edgeSourceKind.ts`, and `getTypeColor(...)` color semantics.
- Phase 2-6 source seams are `BuildPathSurface.tsx`, `BuildPathSurface.test.tsx`, `useBuildPathRuntimeStore.ts`, and `base.css`.
- browser smoke was attempted against the local 5173 app, but the in-app `iab` browser backend was unavailable in this session.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-10. Draw Parallel mode branch-local build icons in derived parallel lanes without changing master timeline order, graph truth, or Edit History.
- [x] Build-Path-Gen1-CLG-10.1. Derive a compact topology icon layout from graph dependencies so fan-out/fan-in structures such as `Sketch -> six Extrudes -> Output` render as icon cards connected by semantically colored mini wires.

### Owns

- Parallel-mode icon lane visual model
- side-by-side branch-local icon placement where existing lane data supports it
- fan-out/fan-in icon-card topology projection
- mini connector lines colored from Spaghetti reference-wire semantics
- output/sink icon-card read for shared downstream OutputPreview/output destinations
- topology graph panel/chrome removal so the graph can breathe in workspace space
- top/center/bottom source/sink alignment controls
- secondary placement for lane readback after topology graph is primary
- selected branch-local playhead/readback styling inside the parallel lane view
- proof that master order, graph truth, and Edit History stay unchanged

### Does Not Own

- new dependency inference
- authored graph restore
- graph layout or Spaghetti node layout
- Compare UI
- Pin persistence
- Branch or Restore command execution
- worker checkpoint/cache implementation

### Family Phase Doc

- [x] `Future/Build-Path-11 - Parallel Lane Icon Layout.md`

## [x] `Build-Path-12` - `Loaded Graph Build Path Reconstruction`

### Family Phase Summary

Reconstruct an honest Build Path timeline and dependency read from loaded graph files so reopened Sketch/Extrude graphs are not blank in Build Path.

Current handoff:
- `Future/Build-Path-12 - Loaded Graph Build Path Reconstruction.md`
- implemented and closed with graph-structure reconstruction.
- next Parallel visual work can return to `Build-Path-11` with reconstructed loaded-graph lanes available.
- exact persisted Build Path event history remains deferred to a later schema/file-format phase.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-11. Reconstruct a derived Build Path timeline and dependency read when graph files are loaded, while marking the source as reconstructed and preserving graph/Edit History truth.

### Owns

- loaded-graph structural Build Path reconstruction
- reconstructed source markers on Build Path events
- dependency hints from graph edges between supported build nodes
- graph-load runtime intake for reconstructed events
- replacement of stale reconstructed data for the same graph id

### Does Not Own

- graph-file export schema changes
- persisted Build Path event history
- exact historical command replay from loaded files
- Build-Path-11 icon-lane rendering implementation
- Restore, Branch, Compare, or Pin execution
- worker checkpoint/cache implementation

### Family Phase Doc

- [x] `Future/Build-Path-12 - Loaded Graph Build Path Reconstruction.md`

## [x] `Build-Path-12.1` - `Graph Lifecycle Timeline Cards`

### Family Phase Summary

Add explicit structural Build Path cards for graph lifecycle events so `Graph Created` and `Graph Loaded` can anchor graph timelines before Sketch/Extrude operation cards appear.

Current handoff:
- `Future/Build-Path-12.1 - Graph Lifecycle Timeline Cards.md`
- implementation is complete.
- next handoff is `Build-Path-11 - Parallel Lane Icon Layout` with lifecycle cards available as lane anchors.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`
- [x] Build-Path-Gen1-CLG-12. Add explicit graph lifecycle timeline cards for graph creation and graph load without treating them as geometry operations or Edit History.

### Owns

- `Graph Created` lifecycle card planning
- `Graph Loaded` lifecycle card planning
- structural/non-geometry lifecycle card display metadata
- lifecycle card ordering before graph build/reconstructed events
- safety proof that lifecycle cards do not drive viewport preview masking or Edit History

### Does Not Own

- graph-file export schema changes
- persisted Build Path event history
- exact historical command replay from loaded files
- full Build-Path-11 Parallel lane rendering
- Restore, Branch, Compare, or Pin execution
- worker checkpoint/cache implementation

### Family Phase Doc

- [x] `Future/Build-Path-12.1 - Graph Lifecycle Timeline Cards.md`

## [x] `Build-Path-12.2` - `Timeline Selection Edit History`

### Family Phase Summary

Make user-driven Build Path master timeline movement participate in the global app Edit History so Ctrl+Z/Ctrl+Y can walk timeline selection changes.

Current handoff:
- `Future/Build-Path-12.2 - Timeline Selection Edit History.md`
- implementation is complete.
- next handoff remains `Build-Path-11 - Parallel Lane Icon Layout`; branch-local playhead history can be a later follow-up if Parallel lane movement should receive the same Edit History treatment.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] Build-Path-Gen1-CLG-13. Add global Edit History entries for user-driven Build Path master timeline selection changes without mutating graph truth.

### Owns

- user-driven master timeline selection Edit History entries
- undo/redo restoration of Build Path selected timeline step
- no-op selection skip behavior
- proof that graph truth remains unchanged

### Does Not Own

- authored graph restore
- branch-local playhead history
- automatic accepted-command selection history entries
- worker checkpoint replay
- Compare, Pin, Branch, or Restore command execution

### Family Phase Doc

- [x] `Future/Build-Path-12.2 - Timeline Selection Edit History.md`

## [x] `Build-Path-13` - `Draggable Current Position Line`

### Family Phase Summary

Clean up the Build Path strip with a visible current-position line that the user can drag left and right to scrub through existing timeline steps.

Current handoff:
- `Future/Build-Path-13 - Draggable Current Position Line.md`
- Phase 1 is implemented and closed.
- the marker now sits after the loaded/current command card, in the gap between the current card and the next card.
- the old dock-only current-command readback and previous/next panel has been removed; viewport-docked Build Path now relies on the icon strip and draggable marker.
- the default viewport-docked placement is bottom-left with zero offset from the Model Viewport edge.
- the viewport-docked strip grows with the visible card run until it reaches full Model Viewport width, then scrolls horizontally.
- the horizontal scrollbar stays hidden while the strip is still growing and appears only when the rail actually overflows.
- the Model Viewport split-corner handle now layers above the dock so the corner split affordance remains reachable at the bottom-left edge.
- later phases remain intentionally open for user-specified Build Path cleanup targets.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`
- [x] Build-Path-Gen1-CLG-14. Add a visible draggable current-position line to the Build Path timeline that scrubs existing selection state without changing graph truth, accepted event order, or restore/replay boundaries.

### Owns

- current-position line visual affordance
- drag-to-scrub interaction over existing master timeline steps
- selected-step synchronization between icon selection, marker position, readback, and viewport preview masking
- proof that marker dragging preserves graph truth, accepted event order, restore/replay boundaries, and existing Edit History semantics
- open-ended follow-up lane for later user-specified Build Path cleanup phases

### Does Not Own

- restore, replay, Branch From Here, Compare, Pin, or checkpoint execution
- accepted event ordering changes
- graph truth mutation
- Spaghetti graph layout
- worker checkpoint/cache implementation
- full Parallel lane icon layout beyond avoiding marker overlap

### Family Phase Doc

- [x] `Future/Build-Path-13 - Draggable Current Position Line.md`

## [x] `Build-Path-14` - `Node Deletion And Reference Orphan Contract`

### Family Phase Summary

Define how Build Path follows direct Spaghetti graph deletion while future reference consumers preserve broken dependency intent honestly.

Current handoff:
- `Future/Build-Path-14 - Node Deletion And Reference Orphan Contract.md`
- Phase 1 is implemented and closed.
- explicit Spaghetti node deletion routes through the same graph-snapshot Build Path sync path used by graph-history restore.
- deleting a command node removes that command's current Build Path card.
- downstream receive references to the deleted source publication remain as unresolved intent until the user restores, rebinds, or deletes the consumer.
- undo restores the original node identity, Build Path card, and receive-reference resolution.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [x] Build-Path-Gen1-CLG-15. Treat direct Spaghetti node deletion as graph truth for Build Path card removal while preserving downstream reference intent as explicit unresolved or orphaned dependencies.

### Owns

- explicit Spaghetti node-delete Build Path sync planning
- deleted command-node card removal behavior
- reference orphan/unresolved-state contract
- undo/redo restoration proof for deleted source nodes
- no-silent-rebind rule for replacement nodes

### Does Not Own

- broad reference repair UI
- reference-provider graph-file schema migration
- automatic replacement-node matching
- restore, branch, compare, or pin execution
- worker checkpoint/cache implementation

### Family Phase Doc

- [x] `Future/Build-Path-14 - Node Deletion And Reference Orphan Contract.md`

## [x] `Build-Path-15` - `Scrub Future Icon State`

### Family Phase Summary

Plan Fusion-style visual suppression for Build Path timeline icons that sit after the selected scrub position.

Current handoff:
- `Future/Build-Path-15 - Scrub Future Icon State.md`
- Phase 1 is implemented with `past`, `current`, and `future` temporal-state attributes on the linear timeline strip.
- future cards read as inactive/ahead-of-scrub through opacity, desaturation, and softer chrome.
- future cards remain clickable scrub targets, not native disabled controls.
- Phase 2 is implemented with the same temporal-state language on Parallel topology cards and connector strength.

### HLG / CLG Coverage

- [x] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`
- [x] Build-Path-Gen1-CLG-16. Add presentation-only temporal state to Build Path timeline icons so future steps after the scrub position read as inactive without becoming disabled or mutating graph truth.

### Owns

- visual temporal-state planning for Build Path timeline icons
- future/ahead-of-scrub icon styling
- preserving click-to-scrub behavior for future cards
- Parallel topology future-card and future-connector follow-up planning
- tests proving state is presentation-only and graph-safe

### Does Not Own

- graph mutation
- restore or replay
- worker checkpoint/cache implementation
- command disabling
- viewport geometry masking logic
- accepted event ordering changes

### Family Phase Doc

- [x] `Future/Build-Path-15 - Scrub Future Icon State.md`

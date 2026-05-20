# Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge

## Doc Header

### Doc History
47. 2026-05-19 22:50:18: Added the Phase 3.6 repeat-Extrude cleanup so profile-driven `Extrude` starts now create a new `Geometry/Extrude` command node by default even when a previous accepted Extrude node is still selected, while reused-node editing remains an explicit opt-in path for future edit flows.
46. 2026-05-19 22:34:25: Added the Phase 3.6 output-preview follow-up so accepting a live Extrude command now auto-wires the accepted `Geometry/Extrude.SolidBody` output into the first open `System/OutputPreview` solid slot when that Extrude node is not already published, preserving the no-second-Extrude rule and the existing OutputPreview slot normalization contract.
45. 2026-05-19 22:21:30: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.6 - Extrude Commit Cancel Proof And Phase 3 Closeout` by adding the store-owned `acceptExtrudeCommandSession()` live-node finalizer, wiring toolbar `OK` through it, writing durable Extrude depth/default operation params onto the live node, preserving live profile wires, returning committed/cancelled command summaries, clearing transient preview/session state after accept, and preserving Cancel rollback behavior without creating a second Extrude node.
44. 2026-05-19 22:14:36: Prepped `Spaghetti-Editor 8 / Phase 3.6 - Extrude Commit Cancel Proof And Phase 3 Closeout` for implementation after Phase 3.5C shipped, narrowing the next cut to accepting the existing live `Geometry/Extrude` command node instead of creating a second node on `OK`, writing durable depth/default operation params, preserving live profile wires, clearing transient viewport/session preview state, producing committed/cancelled command summaries, and keeping Build Path UI, imported face picking, generic planar face extrusion, drag handles, taper fidelity, and arrangement UI out of scope.
43. 2026-05-19 22:02:52: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` by adding a transient Extrude command preview VM, deriving selected profile/depth preview data from the active Extrude session, rendering first-pass translucent preview caps and side walls in the viewer, and proving focused preview projection plus no graph mutation while keeping `OK` acceptance, durable depth params, Build Path rows, imported face picking, generic planar face extrusion, and Settings-backed colors deferred.
42. 2026-05-19 21:26:05: Refreshed `Spaghetti-Editor 8 / Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` for implementation after the profile-selection follow-ups, making multi-profile toggle selection, blue selected-profile state, white hover priority, and visible singular profile wires explicit inputs to the preview slice while keeping `OK`, Build Path, imported face picking, generic planar face extrusion, Settings-backed color controls, and durable graph param writes out of scope.
41. 2026-05-19 20:53:26: Prepped `Spaghetti-Editor 8 / Phase 3.5C - Extrude Depth Preview Volume And Value Feedback` for implementation after Phase 3.5B shipped, grounding the next slice in the live `extrudeCommandSession`, selected profile overlay/preselection state, `ViewerHost` overlay projection, `viewerBridge`/`Viewer` sketch overlay seams, and the existing `activeDraftExtrudePreview` helper as adjacent context while narrowing the first code cut to transient command-owned selected-profile cap/body preview data, no graph mutation, no `OK` acceptance, and no Settings or Build Path widening.
40. 2026-05-19 20:41:28: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.5B - Viewport Profile Hover And Preselection` by adding selectable sketch-profile filled overlay regions, white hovered-profile overlay state, transient viewport profile preselection in the Spaghetti store, outside-Extrude plain and Shift-click profile selection, selected/hovered profile projection into active and visible sketch overlays, and root Extrude startup seeding from valid preselected profiles through the Phase 3.5A live node/wire path.
39. 2026-05-19 20:27:26: Re-prepped `Spaghetti-Editor 8 / Phase 3.5B - Viewport Profile Hover And Preselection` after the Phase 3.5A live graph contract shipped, tightening the next implementation slice around first-pass filled selectable sketch profiles, white hover highlight, transient viewport profile preselection outside Extrude, valid preselection seeding into `startExtrudeCommandSession(...)`, and active Extrude click parity through the live auto-wiring path.
38. 2026-05-19 20:17: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract` by extending the Extrude command session with live graph metadata, creating or reusing a live `Geometry/Extrude` node when the command starts, synchronizing Console and viewport profile selections into exact `SketchProfile:<profileId>` wires, rolling back command-owned node/wire edits on Cancel, and updating focused store, viewport, Console, command-session, and build verification.
37. 2026-05-19 20:03:02: Prepped `Spaghetti-Editor 8 / Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract` for implementation by grounding it in `useSpaghettiStore` command/session actions, `applyGraphCommand(...)`, Console root Extrude entry, `ViewerHost` profile-pick routing, the existing Extrude graph-authoring plan shape, and the sketch-profile connection normalization helpers, with the first cut narrowed to live node creation/reuse, exact profile-row auto-wiring, session/graph synchronization, and command-owned rollback tracking.
36. 2026-05-19 19:51:27: Reworked the remaining Phase 3 Extrude ladder around the required live auto-wiring model: starting `Extrude` should create or reuse a real graph `Geometry/Extrude` node immediately, each selected sketch profile should auto-wire into that live node's `ExtrusionProfile` input, `OK` should accept/finalize rather than first create graph truth, and the previous hover/preselection and preview-volume polish slices were shifted later behind a new `Phase 3.5A - Live Extrude Node And Profile Auto-Wiring Contract`.
35. 2026-05-19 19:47:21: Prepped `Spaghetti-Editor 8 / Phase 3.5A - Viewport Profile Hover And Preselection` for implementation by grounding it in the shipped `setOnGeometrySketchSelectProfile(...)` callback, visible sketch overlay profile ids, `ViewerHost` graph-authored sketch projection, and shared Extrude session source updater, narrowing the first code cut to filled selectable closed profiles, white hover highlight, transient viewport profile preselection outside Extrude, Extrude startup seeding from that preselection, and no graph mutation or preview volume work.
34. 2026-05-19 19:42:24: Added `Spaghetti-Editor 8 / Phase 3.5B - Extrude Depth Preview Volume And Value Feedback` from the second Fusion-style reference, naming the selected-profile-plus-depth preview target as a transient blue selected profile cap, translucent extrusion body/side-wall preview at the typed depth value, and viewport depth arrow/value feedback before Phase 3.6 turns `OK` into durable graph mutation.
33. 2026-05-19 19:38:33: Added `Spaghetti-Editor 8 / Phase 3.5A - Viewport Profile Hover And Preselection` as the next planned polish slice before commit, expanding profile picking into a normal viewport selection affordance outside active Extrude sessions, adding selectable-profile fill goals, white hover highlight for closed profiles, and a rule that starting Extrude can consume an existing profile preselection while active Extrude can still select closed sketch profiles directly.
32. 2026-05-19 19:14:48: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.5 - Profile Picking Count And Preview State` by adding a dedicated viewport sketch-profile pick callback, tagging graph-authored sketch profile overlay lines with source node/profile ids, routing active Extrude picks through the transient session selected-profile source updater, supporting Shift-click same-sketch expansion, updating the toolbar count/depth state, and proving profile picking remains no-mutation until Phase 3.6 wires `OK`.
31. 2026-05-19 19:06:52: Prepped `Spaghetti-Editor 8 / Phase 3.5 - Profile Picking Count And Preview State` for implementation by grounding the next slice in the live `ViewerHost` sketch overlay projection, `viewerBridge` geometry-sketch overlay callbacks, `extrudeCommandSession` selected-profile source updater, and `buildSketchProfileMemberPortId(...)`, narrowing the first code cut to viewport sketch-profile pick handoff, shift-pick same-sketch expansion, toolbar count/depth-step updates, and no graph mutation while leaving actual OK commit and rich preview/drag handles to later work unless the existing viewer seam can expose the first highlight state safely.
30. 2026-05-19 19:01:25: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.4 - Model Viewport Extrude Toolbar Shell` by mounting a compact `ViewerHost` Extrude toolbar over the shared `extrudeCommandSession`, displaying step, selected count, depth, operation, and blocked/ready state, wiring Cancel to clear only transient session state, and proving render/cancel behavior leaves graph nodes and edges unchanged while profile picking, preview, and OK commit remain deferred.
29. 2026-05-19 18:54:59: Prepped `Spaghetti-Editor 8 / Phase 3.4 - Model Viewport Extrude Toolbar Shell` for implementation by grounding it in the shipped `extrudeCommandSession` owner, `ViewerHost` overlay seam, Console active-session projection, and focused ViewerHost/ConsoleDock proof, narrowing the next code cut to a visible read-only-plus-cancel toolbar shell with no profile picking, preview, graph commit, or local duplicate command state.
28. 2026-05-19 12:36:07: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.3 - Viewport Shortcut Modal Guarding` by adding an idle-only viewport command shortcut guard to shared input routing, passing active command/session ownership from Console into the route context, preserving root-level idle viewport `S`, and proving active Extrude profile selection blocks viewport `S` from starting Sketch.
27. 2026-05-19 12:28:13: Prepped `Spaghetti-Editor 8 / Phase 3.3 - Viewport Shortcut Modal Guarding` for implementation by grounding it in the live `routeKeyboardInput(...)` `viewport-command` branch, the `routeConsoleGlobalKey(...)` context builder, and the docked/popout global key handlers, narrowing the slice to an idle-command-state guard for viewport `S` while sketch plane pick, sketch draw/review, staged Console, reference transform, or active Extrude sessions own input.
26. 2026-05-19 11:00:21: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.2A - Extrude Select Profiles Console Prompt` by routing the next Console token through the active `Extrude > Select Profiles` session before root parsing, adding pure graph-sketch profile Console choices, resolving exact/alias profile tokens into transient selected profile sources, moving resolved sessions to `Depth`, and preserving no graph mutation plus the no-duplicate-Extrude-command rule.
25. 2026-05-19 10:43:01: Added the explicit no-duplicate-Extrude-command guardrail to `Spaghetti-Editor 8 / Phase 3.2A`, clarifying that root `Extrude` is a user-facing shortcut into the canonical `Graph > Extrude` workflow and must share the same transient session plus later atomic graph commit path instead of creating a Console-only command family.
24. 2026-05-19 10:40:25: Prepped `Spaghetti-Editor 8 / Phase 3.2A - Extrude Select Profiles Console Prompt` for implementation by grounding it in the shipped `extrudeCommandSession` state, the current Console submit routing, and the existing sketch profile member port contract, narrowing the first cut to active prompt routing, optional pure profile-token selection, unresolved-token diagnostics, and transient session updates only.
23. 2026-05-19 10:37:45: Added `Spaghetti-Editor 8 / Phase 3.2A - Extrude Select Profiles Console Prompt` as the missing command-conversation bridge after the real Extrude session owner, so root `extrude` can make Console ask for the next required sketch-profile input before toolbar, viewport picking, preview, or graph commit work proceeds.
22. 2026-05-19 10:35:28: Repaired the shipped `Spaghetti-Editor 8 / Phase 3.2` root `Extrude` feedback so submitting `extrude` now clears the typed token and pins a Console status summary of `Extrude > Select Profiles` with `Waiting for sketch profiles`, making the transient session visible while preserving the no-graph-mutation start/cancel boundary.
21. 2026-05-19 10:15:09: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.2 - Real Extrude Session Owner And Command Tree` by adding the shared Extrude command-session helper and Spaghetti store slice, routing root Console `Extrude` through that session instead of a prompt-only pseudo-session, logging `Extrude > Select Profiles > Depth`, adding Escape cancellation, and verifying no graph mutation on start or cancel.
20. 2026-05-19 10:05:12: Prepped `Spaghetti-Editor 8 / Phase 3.2 - Real Extrude Session Owner And Command Tree` for implementation by grounding it in the live prompt-only root `Extrude` behavior, separating the shared transient session owner from Console and toolbar presentation, naming the first `Extrude > Select Profiles > Depth` command-tree projection, and narrowing the slice to start/cancel/step-transition proof with no profile hit-testing, drag handle, preview, graph commit, or Build Path scope.
19. 2026-05-19 09:41:36: Implemented and shipped `Spaghetti-Editor 8 / Phase 3.1 - Atomic Extrude Graph Commit Repair` by changing `authorExtrudeGraphCommand` to build a preflighted Extrude graph command plan and call one atomic `commitExtrudeGraphPlan(...)` boundary, preserving committed summary output while preventing cancelled create-node or profile-wire failures from being reported after partial helper-owned mutation.
18. 2026-05-19 09:27:48: Refined the remaining `Spaghetti-Editor 8 / Phase 3` Extrude continuation from the Fusion-style reference screenshot, making the intended command tree explicit as `Extrude > Select Profiles > Depth`, adding shift-click all-profiles selection behavior, clarifying that the depth drag handle appears after profile selection, and widening `Phase 3.2` to include the Console/session staging needed for that tree before toolbar, picking, and commit phases build on it.
17. 2026-05-19 09:22:10: Prepped `Spaghetti-Editor 8 / Phase 3.1 - Atomic Extrude Graph Commit Repair` for implementation by grounding the slice in the live `authorExtrudeGraphCommand` callback-order risk, naming the required no-partial-mutation tests, and narrowing the repair to a preflightable Extrude graph-authoring plan plus one commit call that either succeeds as a committed summary or cancels before durable mutation.
16. 2026-05-19 09:12:52: Split the remaining `Spaghetti-Editor 8 / Phase 3` Extrude work into explicit top-level `Phase 3.1` through `Phase 3.6` follow-up sections for atomic graph commit repair, real Extrude session ownership, viewport shortcut modal guards, toolbar shell, profile picking and preview state, and commit/cancel closeout.
15. 2026-05-19 08:47:12: Implemented and shipped `Spaghetti-Editor 8 / Phase 5 - Background Node Layout And Arrangement Modes` by adding the pure `commandNodePlacement` planner and focused tests for downstream, bridge, stacked-repeat, fallback, existing-position preservation, and edge-inferred anchor placement without mutating graph semantics or adding arrangement UI.
14. 2026-05-19 08:44:05: Prepped `Spaghetti-Editor 8 / Phase 5 - Background Node Layout And Arrangement Modes` for implementation by narrowing the first slice to a pure command-created node placement planner over graph nodes, edges, and `graph.ui.nodes` positions, with deterministic downstream/bridge/repeated-node placement and explicit manual-position preservation while leaving full arrangement modes, UI controls, and graph-layout-engine work as follow-ons.
13. 2026-05-19 08:41:03: Implemented and shipped `Spaghetti-Editor 8 / Phase 4 - Build Path Projection Handoff` by adding a pure `buildPathProjection` helper and focused tests that turn committed graph-command summaries into Build Path-ready projection records while skipping cancelled commands, preserving graph ids, keeping build result linkage optional, and avoiding Build Path UI or worker checkpoint/replay scope.
12. 2026-05-19 08:35:53: Prepped `Spaghetti-Editor 8 / Phase 4 - Build Path Projection Handoff` for implementation by narrowing it to a Spaghetti-side accepted-command projection contract over existing graph command summaries, explicitly excluding Build Path workspace UI, worker checkpoint/replay storage, restore/branch behavior, and any second source of node, wire, parameter, or geometry truth.
11. 2026-05-19 08:32:52: Implemented the first `Spaghetti-Editor 8 / Phase 3` runtime slice by adding root `Extrude` staged command routing, a canonical radio identity, a no-mutation console/session start prompt, and a shared Extrude graph-authoring owner that can create or reuse `Geometry/Extrude` and wire selected sketch-profile contributors through the existing `ExtrusionProfile` input contract.
10. 2026-05-19 08:23:25: Prepped `Spaghetti-Editor 8 / Phase 3 - Root Extrude And Viewport Profile Selection Toolbar` for implementation by grounding the slice in the shipped Phase 1 command lifecycle, Phase 2 graph authoring seam, and existing Extrude `SketchProfiles` collection/multi-wire contract while narrowing the first cut to root command entry, transient viewport session state, profile selection handoff, and graph-authored commit/cancel behavior.
9. 2026-05-19 08:20:56: Marked `Spaghetti-Editor 8 / Phase 2 - Shared Command To Graph Authoring Seam` shipped after extracting Sketch graph node create/reuse into `graphCommandAuthoring`, adding focused owner tests, and keeping console root, New Sketch, and viewport `S` behavior on the shared authoring path.
8. 2026-05-19 08:14:37: Prepped `Spaghetti-Editor 8 / Phase 2 - Shared Command To Graph Authoring Seam` for implementation by narrowing it to extracting the existing Sketch graph-authoring path behind a shared seam, preserving the Phase 1 lifecycle contract, and leaving root Extrude toolbar/profile behavior for Phase 3.
7. 2026-05-19 08:09:08: Marked `Spaghetti-Editor 8 / Phase 1 - Viewport Command Commit Contract` shipped after adding the shared command commit contract module, focused lifecycle tests, and root Sketch/New Sketch/viewport shortcut integration that records committed graph summaries without changing the existing Sketch runtime behavior.
6. 2026-05-19 08:04:06: Prepped `Spaghetti-Editor 8 / Phase 1 - Viewport Command Commit Contract` for implementation by turning the guardrail into a concrete contract slice with target behavior, ownership surfaces, implementation steps, non-goals, verification, and done-shape criteria that root Extrude should build against.
5. 2026-05-19 08:00:03: Reviewed the phase ladder after the first root Sketch/New Sketch runtime proof and clarified the current execution read: Phase 1 remains the command-commit guardrail, Phase 2 is the active shared authoring spine, Phase 3 is the next root Extrude/profile-toolbar implementation target, and Build Path plus full layout/arrangement work stay deferred.
4. 2026-05-19 01:19:25: Added the next implementation phase for root `Extrude` plus the model-viewport extrude toolbar workflow, focusing on Fusion-style individual sketch profile picking, selected-profile count, distance/taper entry, preview handles, and graph-authored `Geometry/Extrude` commit behavior.
3. 2026-05-19 01:11:30: Recorded the first runtime proof for the command-authoring bridge: root console `sketch`, root console `new sketch`, and viewport `S` can now create or activate `Geometry/Sketch` nodes and open sketch plane pick while keeping the authored node in Spaghetti graph truth.
2. 2026-05-19 00:42:25: Expanded the plan with a background graph layout phase so viewport/console-created nodes are placed neatly in the Spaghetti editor first, then later gain alternate arrangement modes for dependency, command-history, compact, or selected-flow reads.
1. 2026-05-19 00:36:42: Created this future planning doc to flesh out the viewport-first CAD command idea where Fusion/Blender-style model-viewport commands still create and wire normal Spaghetti graph truth in the background, while later `Build Path` can present those accepted commands as a readable history projection.

### Purpose

This doc captures the bridge between viewport-first CAD authoring, console/shortcut command entry, the Spaghetti graph, and later `Build Path`.

Use it to answer:
- how a user can operate mostly in the model viewport without bypassing graph truth
- what should happen in the Spaghetti editor when commands like `Sketch` or `Extrude` are committed from console, shortcuts, toolbar, or viewport workflows
- how automatic background node creation and wiring should relate to the existing smart-wiring phase
- how the same authored command commits can later feed a Build Path history-style projection

## Doc Body

This idea widens the current `Smart Wiring` direction.

`Spaghetti-Editor 1` proves one narrow canvas action:
- the user drags a sketch profile toward an output solid slot
- the canvas inserts `Geometry/Extrude`
- the canvas wires the missing bridge automatically

This phase captures the larger product direction:
- the user should be able to work like they are in Fusion 360 or Blender, mostly from the model viewport
- console commands, keyboard shortcuts, toolbar actions, and viewport commits should all author the same graph underneath
- the Spaghetti editor should draw the background work as normal nodes and wires
- background-created nodes should land in readable positions instead of piling up or hiding the authored flow
- `Build Path` should later show those accepted command commits as a familiar CAD-style history without becoming a second source of truth

The core rule is simple:

```text
Viewport / Console / Shortcut Command
  -> Graph Command Commit
  -> Spaghetti Nodes And Wires
  -> Geometry Execution
  -> Build Path History Projection
```

The model viewport may be the user's primary surface, but the authored graph remains the durable source of truth.

## Vision

### User Experience Target

The user should feel like they can model directly:
- press a shortcut or enter `Sketch`
- pick or create sketch geometry in the model viewport
- commit the sketch
- enter `Extrude`
- pick profiles and set depth in the viewport
- see the body appear

Behind the scenes, ParaHook should create and update the graph:
- create a `Geometry/Sketch` node when the sketch command becomes durable
- add sketch entities to that node's authored content
- create a `Geometry/Extrude` node when the extrude command becomes durable
- wire the selected sketch profile or profile collection into the extrude node
- wire the extrude output into the current output preview or active downstream target when the intent is clear

The user should not need to manually open Spaghetti and build the node graph for every ordinary CAD operation, but when they do open Spaghetti, the graph should honestly show what happened.

### Product Shape

This creates three coordinated views over the same authored work:

- `Model Viewport`
  - the direct manipulation surface
  - best for selection, picking, handles, previews, and flow
- `Spaghetti Editor`
  - the topology and dependency truth surface
  - shows nodes, wires, params, collections, and outputs
- `Build Path`
  - the command-history projection
  - later shows one accepted command row per meaningful CAD step

None of these should own a separate modeling truth.

### Relationship To Build Path

`Build Path` should not replace Spaghetti.

It should be a history-style projection of the same graph-authoring commits:
- `Sketch` appears as a command row because a sketch node or sketch commit entered the graph
- `Extrude` appears as a command row because an extrude node was created or accepted
- parameter changes appear as row edits because graph-authored params changed
- wire changes appear as dependency edits because graph connections changed

This gives the user two ways to understand the same model:
- dependency graph in Spaghetti
- accepted command sequence in Build Path

### Relationship To Smart Wiring

Smart wiring remains the first narrow proof.

This phase should reuse its direction, but not treat mouse wire-drop as the only entry point.

The long-term shared seam should support:
- mouse drag/drop wire intent
- console command commits
- keyboard shortcut command commits
- toolbar command commits
- viewport-first tool commits

All of those should call into graph-command ownership instead of each surface cloning its own node creation and wiring logic.

### Relationship To Node Layout

Automatic graph authoring needs an automatic layout contract.

If viewport-first commands create useful graph truth but place every node in a messy pile, the Spaghetti editor stops being a helpful truth surface.

The first layout goal should be modest:
- newly created command nodes land near the related upstream and downstream nodes
- `Sketch -> Extrude -> OutputPreview` reads left-to-right or otherwise follows one clear dependency direction
- batches of background-created nodes avoid direct overlap
- existing user-moved node positions are respected unless the user explicitly asks for rearrangement

Later, the editor can offer different arrangement reads over the same graph:
- dependency flow
- command-history flow
- compact selected chain
- grouped-by-feature or grouped-by-output
- manual layout with optional tidy-up

Those arrangements should change node positions or view presentation only. They should not change graph semantics.

## Wishlist Organization

### High Level Goals

- [ ] `Spaghetti-Editor-8-HLG-1` `Let users operate mostly from the model viewport like Fusion 360 or Blender.`
- [ ] `Spaghetti-Editor-8-HLG-2` `When commands are committed, draw the hidden background work in the Spaghetti editor as normal nodes and wires.`
- [ ] `Spaghetti-Editor-8-HLG-3` `Let console commands and shortcuts create the same graph truth as toolbar or viewport workflows.`
- [ ] `Spaghetti-Editor-8-HLG-4` `Connect this command-authored graph truth to Build Path so command history can be presented without becoming a second model.`
- [ ] `Spaghetti-Editor-8-HLG-5` `Place automatically created nodes neatly, then later support different graph arrangements that make the model easier to read.`

### `Spaghetti-Editor 8 / Phase 1`

- advances `Spaghetti-Editor-8-HLG-1`
- advances `Spaghetti-Editor-8-HLG-2`
- define the first durable command-commit contract for viewport-first graph authoring
- separate transient preview from accepted graph mutation
- identify the first commands that should create or update graph nodes

### `Spaghetti-Editor 8 / Phase 2`

- advances `Spaghetti-Editor-8-HLG-2`
- advances `Spaghetti-Editor-8-HLG-3`
- create one shared graph-command authoring seam used by console, shortcut, toolbar, and viewport triggers
- keep command surfaces thin and graph mutation centralized
- reuse existing smart-wiring planner direction when command intent implies missing wires

### `Spaghetti-Editor 8 / Phase 3`

- advances `Spaghetti-Editor-8-HLG-1`
- advances `Spaghetti-Editor-8-HLG-2`
- advances `Spaghetti-Editor-8-HLG-3`
- add root `Extrude` command entry
- add the first model-viewport Extrude toolbar/session surface
- let users pick individual sketch profiles, see selected count, edit distance, preview the extrusion, and commit a graph-authored `Geometry/Extrude`

### `Spaghetti-Editor 8 / Phase 4`

- advances `Spaghetti-Editor-8-HLG-2`
- advances `Spaghetti-Editor-8-HLG-4`
- define how accepted graph command commits should be summarized for Build Path
- keep Build Path as a projection over graph truth
- avoid duplicating node params, wires, or selection state in a separate history-only model

### `Spaghetti-Editor 8 / Phase 5`

- advances `Spaghetti-Editor-8-HLG-2`
- advances `Spaghetti-Editor-8-HLG-5`
- define the first automatic node placement rules for background-created command nodes
- preserve user-authored/manual node positions by default
- plan later arrangement modes without making arrangement a graph-semantic mutation

## Current Phase Read

All five phases remain relevant, but they should not all be implemented immediately.

- `Phase 1` is shipped as the baseline command-commit contract. The first shared lifecycle module now names `idle`, `previewing`, `readyToCommit`, `committed`, and `cancelled`, reserves durable graph mutation for the ready-to-commit transition, and lets the existing root `Sketch` / `New Sketch` proof emit committed graph summaries.
- `Phase 2` is shipped as the first shared command-authoring seam. Root `Sketch`, root `New Sketch`, and viewport `S` now share `graphCommandAuthoring`, so root `Extrude` should extend that seam instead of creating another one-off mutation path.
- `Phase 3` is shipped as the first usable viewport-first Extrude workflow. Root `Extrude` is now a command entry, the command starts with live `Geometry/Extrude` graph truth, Console and viewport profile selections auto-wire exact sketch-profile rows into the live node, selected profiles can drive a transient depth preview volume, `OK` accepts the live node with durable params, and Cancel rolls back unaccepted command-owned graph work.
- `Phase 4` is shipped as the Build Path-ready projection contract. Committed graph-command summaries can now become projection records that preserve graph ids and mutation summaries while cancelled commands are skipped.
- `Phase 5` is shipped as the pure command-created node placement contract. Later command call sites can consume the planner to place background-created graph work readably without moving existing positioned nodes or starting a full arrangement-mode UI.

## [x] `Spaghetti-Editor 8 / Phase 1` - `Viewport Command Commit Contract`

### Phase 1 Summary

Define what counts as a durable command commit when the user works from the model viewport.

Current status: shipped. This phase implemented the narrow command-commit contract that root `Extrude` and later viewport commands should build against, not a broad runtime feature.

This phase is planning and contract work first. It should decide the boundary between:
- transient viewport preview
- active command session state
- accepted graph mutation
- Build Path history eligibility

### Phase 1 Implementation Spec

Implementation target:
- introduce or formalize a small command-commit contract that distinguishes:
  - `preview` state that may render in the viewport but does not mutate graph truth
  - `session` state that owns active command intent and selection while the tool is open
  - `commit` state that performs durable graph mutation
  - `cancel` state that drops preview/session state without graph mutation
- make the contract explicit enough for `Sketch`, `New Sketch`, and the upcoming `Extrude` command to share language and tests
- keep the first implementation centered on the existing root `Sketch` proof and the upcoming root `Extrude` handoff

Likely ownership surfaces:
- `src/app/console/stagedNavigation.ts`
  - root command discovery and staged-command routing
- `src/app/console/useConsoleInteraction.ts`
  - command execution handoff from console text to durable command behavior
- `src/app/console/radioCommandIdentity.ts`
  - root command identity and naming
- `src/app/inputRouting.ts`
  - viewport shortcut dispatch into the same root command behavior
- the shared graph/store command surface that currently creates or activates `Geometry/Sketch`
  - should become the first named owner for graph-authored command commit behavior if one is not already clear enough
- future Phase 3 viewport toolbar/session files
  - should consume the Phase 1 contract instead of defining their own commit semantics

Implementation steps:
- name the command lifecycle states used by viewport/console commands:
  - `idle`
  - `previewing`
  - `readyToCommit`
  - `committed`
  - `cancelled`
- define what operations are allowed in each state:
  - preview/session state may update selection, handles, distance values, and temporary artifacts
  - commit state may create nodes, edit durable node params, add wires, and request graph validation
  - cancel state must not leave new nodes, wires, or durable params behind
- codify the first durable operations:
  - root `sketch` may reuse or create a `Geometry/Sketch` node when the command enters durable graph truth
  - root `new sketch` may always create a fresh `Geometry/Sketch` node when the command enters durable graph truth
  - upcoming root `extrude` should not create durable `Geometry/Extrude` graph truth until the user accepts a valid profile/distance session
- add a small command-commit summary shape only if useful for tests and later Build Path:
  - command family
  - durable graph node ids touched or created
  - durable edge ids touched or created
  - durable params touched
  - cancelled versus committed result
- keep any Build Path-facing data as a summary of accepted graph truth, not as a new model owner

Non-goals:
- do not implement the full Extrude toolbar in Phase 1
- do not implement Build Path rows in Phase 1
- do not build node arrangement modes in Phase 1
- do not create a hidden command transcript store as modeling truth
- do not rework sketch drawing tools beyond what is needed to name the commit boundary

Hard rules:
- do not let viewport-only state become the hidden model owner
- do not create Build Path-only command truth
- do not store command transcript text as the canonical authored command
- do not make every pointer movement a graph commit
- do not let console, shortcut, and viewport paths define separate meanings for `commit` and `cancel`

Verification targets:
- console root `sketch` still creates or activates a graph-authored `Geometry/Sketch`
- console root `new sketch` still creates a fresh graph-authored `Geometry/Sketch`
- viewport `S` still reaches the same root Sketch behavior when model viewport shortcuts are active
- cancelling a future command session has a documented no-durable-mutation contract
- the contract names the point where root `Extrude` may create `Geometry/Extrude`, set params, and wire selected profile references

Acceptance read:
- a reader can explain when `Sketch`, `New Sketch`, or upcoming `Extrude` becomes a real graph-authored operation
- a reader can distinguish active command preview/session state from accepted graph mutation
- a reader can name the shared command-commit owner or target seam that console, shortcuts, and viewport tools should use
- a reader can see why Build Path can later summarize accepted graph commits without owning separate geometry truth
- Phase 3 can start root `Extrude` implementation without reopening what `commit`, `preview`, and `cancel` mean

### Phase 1 Runtime Note

The shipped implementation adds:
- `src/app/console/commandCommitContract.ts`
  - lifecycle states: `idle`, `previewing`, `readyToCommit`, `committed`, `cancelled`
  - graph mutation allowance only for `readyToCommit`
  - committed and cancelled summary shapes for later Build Path projection work
- `src/app/console/commandCommitContract.test.ts`
  - proof that only `readyToCommit` may mutate graph truth
  - proof that committed summaries capture durable node ids
  - proof that cancelled summaries carry no durable graph mutation
- root Sketch integration in `src/app/console/useConsoleInteraction.ts`
  - console root `sketch`, console root `new sketch`, and viewport `S` all use the same contract language
  - viewport `S` is identified as `viewport-shortcut`
  - existing Sketch graph behavior stays unchanged while now giving Phase 3 a concrete commit contract

## [x] `Spaghetti-Editor 8 / Phase 2` - `Shared Command To Graph Authoring Seam`

### Phase 2 Summary

Create or define one shared graph-command authoring seam for command surfaces.

Current status: shipped. This phase extracted the existing root `Sketch` / `New Sketch` graph-authoring behavior behind a shared seam so console, viewport shortcut, and later toolbar/session callers do not own graph mutation directly.

The goal is that console, shortcuts, toolbar buttons, and viewport tools can all create/update the same graph through one owner instead of each surface inventing its own graph mutation path.

### Phase 2 Implementation Spec

Implementation target:
- create one small shared graph-command authoring owner for the current Sketch proof
- move the durable Sketch graph mutation decision out of `useConsoleInteraction.ts` as much as practical:
  - choose active selected `Geometry/Sketch` when allowed
  - reuse the first existing `Geometry/Sketch` when `sketch` is not forced fresh
  - create a fresh `Geometry/Sketch` when no reusable sketch exists
  - always create a fresh `Geometry/Sketch` for `new sketch`
  - return a Phase 1 commit summary with created or reused node ids
- keep console and viewport shortcut behavior as thin callers:
  - resolve command context
  - dispatch command intent to the shared authoring owner
  - open sketch plane pick with the returned graph-authored sketch node id
- keep the seam shaped so Phase 3 can add root `Extrude` without inventing a separate mutation path

Likely ownership surfaces:
- new or existing `src/app/console/*graphCommand*` / `src/app/console/*commandAuthoring*` module
  - owns Sketch graph command intent to graph mutation
  - consumes `commandCommitContract.ts`
  - returns committed or cancelled summaries
- `src/app/console/useConsoleInteraction.ts`
  - should stop owning the durable Sketch node-selection/create decision directly
  - should remain responsible for console entries, prompt setup, sketch plane handoff, radio burst, and UI focus
- `src/app/console/commandCommitContract.ts`
  - remains the lifecycle/summary contract from Phase 1
- tests near the new owner
  - prove reuse, forced-fresh creation, no active graph cancellation, and summary output
- existing ConsoleDock/input-routing tests
  - keep proving user-visible root Sketch/New Sketch/viewport `S` behavior

Implementation steps:
- define a pure-ish request shape for graph-authored Sketch commands:
  - graph document id
  - selected node id
  - force-fresh flag
  - entry point from Phase 1
  - current graph document or graph nodes
  - node creation callback
- return an explicit result shape:
  - `committed`
  - `cancelled`
  - sketch node id when committed
  - created node label when a node was created
  - Phase 1 command summary
  - user-readable cancellation reason when cancelled
- refactor `startRootSketchCommand` to call the shared authoring owner instead of deciding selected/reused/created sketch nodes inline
- keep all existing root `sketch`, root `new sketch`, and viewport `S` behavior unchanged
- add focused unit tests for the authoring owner and keep existing integration tests green

Important relationship:
- `Spaghetti-Editor 1` smart wiring should stay available as a planner for obvious missing bridges
- this phase should make command-driven insertion able to reuse that same planner or graph-command layer

Non-goals:
- do not implement root `Extrude` in Phase 2
- do not implement the model-viewport Extrude toolbar/session in Phase 2
- do not implement sketch-profile picking, distance preview, or extrude handles in Phase 2
- do not implement automatic downstream `OutputPreview` wiring yet
- do not implement Build Path rows or node arrangement modes
- do not move console rendering, prompt text, radio behavior, or sketch plane UI ownership into the graph authoring owner

Hard rules:
- command surfaces should dispatch intent, not own graph topology
- graph commands should be deterministic and testable
- existing graph validation must still decide whether the result is legal
- automatic wiring should require clear intent, not broad type guessing
- the shared seam must not become a hidden model store
- cancellation must not create durable nodes, wires, or params

Verification targets:
- new authoring-owner tests prove:
  - `sketch` reuses the selected sketch when selected
  - `sketch` reuses the first existing sketch when no selected sketch is active
  - `sketch` creates a sketch when none exists
  - `new sketch` creates a fresh sketch even when one exists
  - missing graph context returns a cancelled/no-durable-mutation result
- existing root Sketch/New Sketch/viewport shortcut tests still pass
- TypeScript compile still passes

Acceptance read:
- one command pathway can be named as the owner for durable Sketch node creation/reuse
- console and shortcut command commits target the same graph-authoring behavior as later viewport tools should
- the Spaghetti editor can redraw the resulting nodes and wires as if the graph had been built manually
- Phase 3 can add `Extrude` to the same authoring owner or adjacent owner without reopening Sketch command mutation rules

### Phase 2 First Runtime Proof

The first runtime proof now exists for `Sketch`:
- console root `sketch` executes a root command instead of requiring `Graph > Sketch`
- console root `new sketch` executes a root command that always creates a fresh `Geometry/Sketch` node
- viewport `S` executes the same root Sketch command when the active surface is the model viewport and console input priority is `Shortcuts first`
- the command reuses the active sketch node when possible, creates `Geometry/Sketch` when needed, and opens sketch plane pick
- the authored sketch node remains normal Spaghetti graph truth, so later phases can place and project it instead of inventing command-only history truth

This does not yet finish the full shared graph-command authoring seam. `Extrude`, toolbar parity, automatic downstream wiring, and neat node placement remain follow-on work.

### Phase 2 Runtime Note

The shipped implementation adds:
- `src/app/console/graphCommandAuthoring.ts`
  - owns root Sketch graph-authoring decisions for selected-sketch reuse, first-sketch reuse, forced-fresh `New Sketch`, created sketch nodes, and cancelled no-mutation results
  - consumes the Phase 1 command commit contract
  - returns committed summaries with created or reused sketch node ids
- `src/app/console/graphCommandAuthoring.test.ts`
  - proves selected sketch reuse
  - proves first sketch fallback reuse
  - proves sketch creation when none exists
  - proves forced-fresh `New Sketch`
  - proves missing graph and creation-failed cancellation summaries
- `src/app/console/useConsoleInteraction.ts`
  - now calls the shared Sketch authoring owner and keeps UI handoff duties: console entries, radio burst, prompt clearing, and sketch plane pick startup

This phase intentionally does not add root `Extrude`, profile selection, preview handles, Build Path rows, automatic `OutputPreview` wiring, or node arrangement.

## [~] `Spaghetti-Editor 8 / Phase 3` - `Root Extrude And Viewport Profile Selection Toolbar`

### Phase 3 Summary

Add the first root `Extrude` command and the model-viewport tool surface needed to make extrusion feel like Fusion-style direct modeling while still authoring Spaghetti graph truth.

Current status: shipped. Root `Extrude` is available from the command root, starts a live Extrude session, creates/reuses `Geometry/Extrude`, auto-wires selected sketch-profile contributors, shows the viewport toolbar/count state, supports profile hover/preselection/toggle selection, displays a transient selected-profile depth preview, and accepts or cancels through the live command graph owner.

The user should be able to:
- enter `extrude` from the console root or start Extrude from the viewport command surface
- move through one visible staged command tree:
  - `Extrude`
  - `Select Profiles`
  - `Depth`
- see a compact Extrude toolbar in the model viewport
- pick individual sketch profiles or planar sketch-profile regions in the viewport
- shift-click a sketch profile to select all compatible profiles from that sketch
- see a selected-profile count such as `1 selected` or `2 selected`
- after profile selection, see the extrusion preview and a depth drag handle
- adjust distance through the toolbar value and viewport drag handle
- preview the extrusion before commit
- commit the operation as normal `Geometry/Extrude` graph truth

### Phase 3 Implementation Spec

Implementation target:
- add root `Extrude` command entry from the console root
- add the first shared Extrude command/session owner that uses the Phase 1 lifecycle and Phase 2 authoring seam style
- add a staged command tree that can be read by Console and viewport UI as:
  - `Extrude > Select Profiles > Depth`
- add a minimal model-viewport Extrude session surface:
  - profile selection mode
  - selected profile count
  - distance value
  - `OK`
  - `Cancel`
- let the user pick existing visible sketch profile contributors from the current graph-authored sketch/profile data that already feeds `Geometry/Extrude.SketchProfiles`
- commit by creating or updating a `Geometry/Extrude` node, setting durable extrude params, and wiring selected profile contributors into the existing `SketchProfiles` / `ExtrusionProfile` graph contract
- cancel by clearing transient session state without creating nodes, wires, or durable params

Implementation-ready first cut:
- root `Extrude` staged command entry and radio identity
- one shared extrude command/session owner used by console root and viewport toolbar entry
- Console/session staging that can represent `Extrude`, `Select Profiles`, and `Depth` as the active command path instead of one flat prompt
- model-viewport Extrude toolbar with at least:
  - profile selection state
  - selected profile count
  - distance value
  - operation mode defaulting to `New Body`
  - `OK` / `Cancel`
- viewport picking for individual sketch profiles from visible authored sketches
- shift-click selection that expands from one picked sketch profile to all compatible profile contributors from the same sketch
- selection highlighting that distinguishes selectable sketch profiles from selected sketch profiles
- preview extrusion display and a depth drag handle driven by selected profiles plus distance
- graph commit that creates or activates `Geometry/Extrude`, sets the durable params, wires selected sketch profile references, and leaves the Spaghetti editor able to show the authored node and wires

Likely ownership surfaces:
- `src/app/console/stagedNavigation.ts`
  - add root `Extrude` command entry
  - represent the staged `Extrude > Select Profiles > Depth` command tree if the existing root/staged model is the right owner
- `src/app/console/radioCommandIdentity.ts`
  - add root `Extrude` command identity
- `src/app/console/useConsoleInteraction.ts`
  - route root `Extrude` to the shared Extrude command/session owner
  - keep console logging, staged command labels, and UI prompt handoff thin
- `src/app/console/graphCommandAuthoring.ts`
  - either extend with an `authorExtrudeGraphCommand` owner or add an adjacent Extrude authoring owner
  - consume the Phase 1 command commit contract
  - return committed/cancelled summaries
- viewport overlay/session owner files under `src/app/components/` or a closer existing viewport-command/session seam
  - own transient command step, profile selection, selected count, distance value, depth-handle state, OK/Cancel, and preview state
  - must not own durable graph truth
- existing Extrude graph seams:
  - `src/app/spaghetti/registry/nodeRegistry.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
  - graph validation / wiring helpers already used by the multi-wire `SketchProfiles` contract

Existing contract to reuse:
- `Extrude-6` already made the visible input read as one parent `SketchProfiles` collection row
- `Extrude-7` already widened the real graph contract so `Geometry/Extrude.SketchProfiles` can accept multiple `SketchProfile` or `SketchProfiles` contributors
- Phase 3 should use that shipped contract instead of inventing a separate viewport-only profile collection model

Implementation steps:
- add root `extrude` command discovery and tests
- define an Extrude session state shape:
  - lifecycle state
  - graph document id
  - entry point
  - command step:
    - `selectProfiles`
    - `depth`
  - selected profile contributor ids or wire targets
  - selected count
  - distance
  - preview validity
- add a start action that opens the session without graph mutation
- add profile pick actions that update only transient session state
- add shift-click profile pick behavior that selects every compatible profile contributor from the picked profile's owning sketch
- transition the session from `selectProfiles` into `depth` once at least one profile is selected, while still allowing profile selection edits before `OK`
- add distance edit action that updates only transient session/preview state
- add depth drag-handle actions that update the same transient distance state as typed toolbar entry
- add cancel action that clears the session and returns a cancelled no-mutation summary
- add commit action that:
  - validates at least one selected profile contributor
  - creates or reuses a `Geometry/Extrude` node according to explicit command context
  - writes durable distance/default operation params
  - wires selected profile contributors into the existing `SketchProfiles` collection input
  - returns a committed summary with touched node and edge ids
- keep preview rendering opportunistic in the first cut:
  - if an existing graph/runtime preview path can be reused safely, use it
  - otherwise show selection/count/session state first and leave richer live extrusion preview as a named follow-on

Important Fusion-style behavior:
- clicking one sketch profile selects only that profile, not the whole sketch node
- shift-clicking one profile selects all compatible profiles in that same graph-authored sketch
- multiple profile selection should be supported when profiles are compatible with one extrude operation
- the toolbar should update selected count immediately after picks
- the command tree should read like `Extrude > Select Profiles > Depth` so the user can understand which step owns the current input
- the profile picker should remain editable until the user confirms or cancels, even after moving into depth adjustment
- the depth drag handle appears only after selected profiles make an extrusion preview/depth step meaningful
- distance handle movement and numeric value entry are preview/session state until `OK` commits the graph change

Non-goals:
- do not implement imported STEP face extrusion
- do not implement general planar face picking outside graph-authored sketch profiles
- do not implement boolean operation variants beyond a default `New Body` command state
- do not implement final taper/runtime fidelity
- do not implement Build Path rows
- do not implement node arrangement modes
- do not build a separate Console command language owner just for Extrude; any Console tree work should extend the existing staged command/root command model
- do not rebuild the already-shipped `SketchProfiles` collection or multi-wire graph contract
- do not require full rich extrusion preview if the first cut can honestly ship command/session/pick/commit/cancel behavior first

Hard rules:
- do not treat a whole `Geometry/Sketch` node as the selected profile when the user picked one closed profile
- do not commit graph nodes, wires, or distance changes for every hover or drag movement
- do not create a viewport-only extrusion model that bypasses Spaghetti graph truth
- do not make toolbar state a separate durable command source; accepted truth must resolve to graph nodes, params, and wires
- do not let Console staged labels become a second source of command truth separate from the Extrude session owner
- do not widen this phase into full face selection, imported STEP face extrusion, boolean operation variants, taper runtime fidelity, or Build Path row editing
- do not create a second profile-selection storage model that disagrees with the existing Extrude graph input contract

Verification targets:
- root staged navigation recognizes `extrude`
- root `extrude` has a canonical radio identity
- starting `extrude` opens an Extrude session without creating graph nodes or wires
- selecting one sketch profile updates selected count to `1 selected`
- shift-clicking one profile selects all compatible profiles in that profile's owning sketch
- selecting multiple compatible sketch profiles updates selected count correctly
- after at least one profile is selected, the active command step can advance to `Depth`
- changing depth by drag handle and changing depth by value entry update the same transient session value
- cancelling clears the session and leaves graph nodes/edges unchanged
- committing with selected profiles creates or updates `Geometry/Extrude` and wires selected profile contributors into `SketchProfiles`
- committing without a selected profile stays blocked or cancelled without durable graph mutation
- focused TypeScript and existing root Sketch command tests remain green

Acceptance read:
- [x] a user can start `Extrude` from the root command path
- [x] the model viewport shows an Extrude toolbar/session while extrusion is active
- [x] Console/session state can represent the staged command tree `Extrude > Select Profiles > Depth`
- [x] individual sketch profiles can be selected and counted
- [x] shift-click can select all compatible profiles from the picked sketch
- [ ] selected profiles reveal an extrusion preview/depth step with a drag handle or equivalent first-pass handle state
- [x] selected profiles plus distance produce either a safe first preview or an explicit valid session state ready for preview follow-up
- [x] the graph-authoring owner can create or reuse `Geometry/Extrude` graph truth and wire selected profiles
- [x] starting the command creates or reuses a live `Geometry/Extrude` graph node for the command
- [x] profile picks auto-wire selected sketch profile contributors into the live Extrude node
- [ ] confirming from the viewport toolbar accepts/finalizes the live graph-authored Extrude instead of first creating it
- [x] cancelling removes or rolls back only the live command-created node/wires that have not been accepted
- [ ] Phase 4 can later read accepted Extrude command summaries without reverse-engineering viewport state

### Phase 3 Runtime Note

The shipped first slice covers the command and graph-authoring foundation:
- root `extrude` now routes through staged navigation with canonical radio identity `Console.Root.Extrude`
- starting `Extrude` from the root command path now creates or reuses a live `Geometry/Extrude` graph node and stores command-owned rollback metadata on the active session
- `graphCommandAuthoring` now includes `authorExtrudeGraphCommand`
- `authorExtrudeGraphCommand` cancels before mutation when graph context or profile selection is missing
- committed Extrude authoring can create or reuse a selected `Geometry/Extrude` node and wire selected sketch-profile contributors to `ExtrusionProfile`
- Console and viewport profile selections now route through the same store action, so selected profile sources and live graph `ExtrusionProfile` wires stay synchronized

Phase 3 remains partial because the live command-authoring model needs one more correction before visual polish and commit closeout. The desired model is now live graph truth during the command: calling `Extrude` creates or reuses a real `Geometry/Extrude` node, profile picks auto-wire into that node, and `OK` accepts/finalizes the live authored command instead of being the first mutation point.

The remaining Phase 3 work is now split into dedicated follow-up sections. The intended user-facing flow across those sections is:

```text
Extrude
  -> Select Profiles
    -> Depth
      -> OK / Cancel
```

- `Select Profiles` owns individual profile picks, selected count, and shift-click all-profiles-from-this-sketch behavior.
- `Depth` owns the extrusion preview, typed distance, and viewport drag handle.
- `OK` accepts or finalizes live graph truth that already exists during the command.
- `Cancel` must roll back or remove only the live command-created Extrude node/wires that have not been accepted.

- `Phase 3.1` - shipped atomic Extrude graph commit repair
- `Phase 3.2` - create a real Extrude session owner and Console-visible command tree
- `Phase 3.3` - guard viewport command shortcuts against active modal owners
- `Phase 3.4` - shipped model-viewport Extrude toolbar shell
- `Phase 3.5` - shipped profile picking, selected count, and preview-ready depth state
- `Phase 3.5A` - shipped live Extrude graph node creation, profile auto-wiring, and Cancel rollback
- `Phase 3.5B` - add viewport profile hover, fill, selected state, and preselection handoff
- `Phase 3.5C` - add transient depth preview volume and viewport value feedback
- `Phase 3.6` - commit/cancel proof and Phase 3 closeout

## [x] `Spaghetti-Editor 8 / Phase 3.1` - `Atomic Extrude Graph Commit Repair`

### Phase 3.1 Summary

Repair the shared Extrude graph-authoring owner so cancelled or failed Extrude commits never leave behind a created node or partial profile wires.

Current status: shipped. The shared Extrude authoring helper now builds a preflighted `ExtrudeGraphCommandPlan` and calls a single `commitExtrudeGraphPlan(...)` boundary instead of owning separate create-node and add-profile-edge callbacks.

This repaired the sharpest data-integrity edge from the first Phase 3 runtime slice before the visible toolbar/session work depends on `authorExtrudeGraphCommand`.

### Phase 3.1 Implementation Spec

#### Purpose

Make `authorExtrudeGraphCommand` match the Phase 1 lifecycle contract:
- `cancelled` means no durable graph mutation
- `committed` means all requested durable graph mutation succeeded
- partial node/wire creation must not be reported as cancellation

The shipped repair makes the Extrude graph-authoring helper preflightable. The helper no longer calls mutating callbacks in an order where `createExtrudeNode(...)` or the first `addProfileEdge(...)` can succeed and a later `addProfileEdge(...)` can fail while the result says `cancelled`.

#### Owns

- atomicity for Extrude node creation plus profile-wire creation
- failure behavior when any profile wire cannot be added
- focused tests for no partial mutation on failed wire creation
- clear return semantics for failed versus committed graph-authoring work
- a narrow graph-authoring plan shape if that is the smallest way to preflight selected profile wires before mutation
- preserving the existing committed `GraphCommandCommitSummary` fields for Build Path projection

#### Does Not Own

- visible toolbar UI
- profile picking
- preview extrusion
- node placement call-site integration
- Build Path UI
- distance or operation-mode parameter persistence

#### Current Live Read

Before this phase, `authorExtrudeGraphCommand` called the supplied `createExtrudeNode(...)` before profile wires were added, then looped over `addProfileEdge(...)`.

If a later profile edge failed, the helper returned `profile-wire-failed` as a cancelled result, but earlier callback side effects could already have created the Extrude node and some edges.

Live code grounding:
- `src/app/console/graphCommandAuthoring.ts`
  - `AuthorExtrudeGraphCommandRequest` now exposes `commitExtrudeGraphPlan(...)` as one atomic boundary
  - `authorExtrudeGraphCommand(...)` chooses create versus reuse target, preserves selected profile sources, and passes `targetProfilePortId: 'ExtrusionProfile'` in the plan
  - the successful result still returns `createdNode`, `addedEdgeIds`, `selectedProfileSources`, and the committed summary needed by Phase 4 projection
- `src/app/console/graphCommandAuthoring.test.ts`
  - proves successful create-and-wire behavior, selected Extrude reuse, missing profile cancellation, and missing graph cancellation
  - proves precondition cancellations do not call the atomic commit boundary
  - proves create-node and profile-wire failures return cancelled summaries through the atomic boundary instead of helper-owned partial mutation

#### First Pass Decisions

1. Prefer one atomic store-level operation if the live graph command layer can create the node and all edges as one history entry.
2. If a true store-level atomic helper is too large for this slice, split `authorExtrudeGraphCommand` into a pure plan step and a commit step so callers can preflight before mutation.
3. Do not return `cancelled` after durable mutation has already happened.
4. Keep the public committed summary shape from Phase 1 where possible.
5. Keep `profile-wire-failed` as a cancelled preflight failure only. Once durable mutation starts, a later failure should be impossible in this helper or should surface as an explicit non-cancelled error result that does not pretend no mutation happened.
6. Treat selected profile sources as the source of truth for the plan. Do not inspect viewport state, Build Path projection state, or current UI selection during commit.

#### Preferred Implementation Shape

Use the smallest shape that makes callback ordering honest:

1. Build an `ExtrudeGraphCommandPlan` from:
   - `graphDocumentId`
   - selected or newly requested Extrude target
   - selected profile sources
   - intended target input port, still `ExtrusionProfile`
2. Validate before mutation:
   - graph document exists
   - at least one profile source exists
   - selected reusable node is a real `Geometry/Extrude` when reuse is requested
   - each planned profile edge has a valid source endpoint and target endpoint
3. Commit with one owner callback, such as `commitExtrudeGraphPlan(plan)`, or with an existing store command that can create the node and all edges together.
4. Return:
   - `cancelled` only for pre-mutation failures
   - `committed` only after node and every planned profile edge are known to be durable

If the existing store has no atomic graph command yet, the first acceptable fallback is:
- make `authorExtrudeGraphCommand` produce a plan/result without mutating
- add a small caller-owned commit adapter that applies that plan in one known graph store action
- keep the tests focused on callback ordering and result semantics

#### Shipped Code Cut

- replaced separate `createExtrudeNode(...)` and `addProfileEdge(...)` callbacks with one `commitExtrudeGraphPlan(...)` callback
- added `ExtrudeGraphCommandPlan` with explicit create/reuse target, selected profile sources, graph document id, and `ExtrusionProfile` target port
- preserved successful multi-profile wiring behavior and committed summary fields
- preserved selected-existing-Extrude reuse behavior through the same atomic plan boundary
- added cancellation tests for missing graph/profile preconditions, create failure, and profile-wire failure
- updated the Phase 3 runtime note with the new atomicity read

#### Likely Files

- `src/app/console/graphCommandAuthoring.ts`
- `src/app/console/graphCommandAuthoring.test.ts`
- possibly `src/app/spaghetti/graphCommands/` if an owner-backed atomic graph command already exists or should host the mutation
- `src/app/console/buildPathProjection.test.ts`
  - only if the committed summary shape changes and Phase 4 projection needs proof
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not build the toolbar, profile picker, preview, or OK/Cancel UI in this phase.

Do not add distance/default operation param writes here unless they are already required by the existing Extrude graph-authoring helper. Phase 3.6 owns final toolbar commit params.

Do not wire the Phase 5 node-placement planner into Extrude command creation here. Atomic graph mutation comes first; placement can be consumed by a later command call-site slice.

#### Implementation Risks

- A rollback-style fix can be misleading if callbacks have already triggered history, subscriptions, or derived graph validation.
- A pure-plan refactor may require tests to stop asserting direct callback order and instead assert the plan plus one commit boundary.
- Build Path projection depends on committed summaries preserving created/reused node ids and added edge ids, so this phase should avoid reshaping summaries unless strictly needed.
- Reusing a selected Extrude node still needs the same all-or-nothing edge behavior even though no node creation is involved.

#### Checklist

- [x] Add failing proof for the old partial-mutation path.
- [x] Add create-failure proof that no edge mutation is attempted.
- [x] Refactor Extrude authoring so cancelled results are pre-mutation only.
- [x] Preserve committed summary shape for created-node, reused-node, and added-edge cases.
- [x] Update the Phase 3 runtime note after the repair lands.

#### Phase 3.1 Runtime Note

The shipped slice added:
- `ExtrudeGraphCommandPlan`
  - explicit graph document id
  - create/reuse target
  - selected profile sources
  - `ExtrusionProfile` target port
- `commitExtrudeGraphPlan(...)`
  - one atomic graph mutation boundary supplied by the caller/store owner
  - returns either a committed node/edge result or a cancelled pre-commit reason
- focused `authorExtrudeGraphCommand` tests for:
  - created Extrude node plus multiple selected profile wires
  - selected Extrude node reuse
  - missing profile and missing graph cancellation before commit
  - create-node failure through the atomic boundary
  - profile-wire failure through the atomic boundary

This phase intentionally does not create the real Extrude session owner, toolbar, profile picker, depth handle, graph-node placement call site, or Build Path UI.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/console/graphCommandAuthoring.test.ts
npm.cmd exec -- vitest run src/app/console/buildPathProjection.test.ts
npm.cmd run build
```

## [x] `Spaghetti-Editor 8 / Phase 3.2` - `Real Extrude Session Owner And Command Tree`

### Phase 3.2 Summary

Replace the root `Extrude` pseudo-session prompt with a real transient command session owner and the staged command tree needed by Console and model-viewport UI.

After this phase, entering `extrude` should create an owned session state that later toolbar, profile picking, depth drag, preview, OK, and Cancel behavior can read and mutate.

The toolbar must not own this state. The toolbar should later be a viewer/controller over the active Extrude command session: it reads the session, dispatches edits such as profile selection/depth changes/OK/Cancel, and lets the session owner plus graph-authoring owner decide what is true.

The visible command path should be able to read as:

```text
Extrude
  -> Select Profiles
    -> Depth
```

### Phase 3.2 Implementation Spec

#### Purpose

Make root `Extrude` honest: it should either start a real command session or clearly report why it cannot start.

The current prompt tells the user to select profiles and use OK/Cancel, but no active owner currently receives profile picks or OK/Cancel.

This phase should also make the Console side ready for the staged tree instead of leaving `Extrude` as one flat root prompt. It does not need to build final Console UI chrome, but the state/labels should be present enough that later UI can show `Extrude > Select Profiles > Depth`.

#### Live Code Read

- `src/app/console/useConsoleInteraction.ts` now handles root `Extrude` by creating the shared Extrude command session, appending the command path, and preserving no durable graph mutation on start.
- `src/app/console/stagedNavigation.ts` currently treats root `Extrude` as an executable root action and also has separate graph-node Extrude navigation scopes. Those graph-node scopes are not the new viewport command session and should not be reused as the session owner.
- `src/app/console/ConsoleDock.test.tsx` now proves that root `extrude` creates a real session, logs `Extrude > Select Profiles > Depth`, leaves the graph unchanged, and cancels on Escape without graph mutation.
- Phase 3.1 already repaired `authorExtrudeGraphCommand(...)` behind one atomic graph plan/commit boundary. Phase 3.2 should not call that commit path yet; it only creates the active session that Phase 3.6 can commit later.

#### Ownership Rule

The new owner should be shared command-session state, not toolbar state and not a Console-only prompt artifact.

Console owns:
- interpreting typed/root `Extrude` as a command start request
- presenting/logging the active command path
- reporting start failures such as missing graph document

The session owner owns:
- the active Extrude command lifecycle
- the active staged step
- selected profile contributors
- depth value/defaults
- validation and command-tree read state
- cancel/clear behavior

The toolbar and viewport later own:
- reading the active session
- dispatching profile/depth/OK/Cancel intents
- displaying controls and handles

The Spaghetti graph remains the durable truth after commit. This session is temporary command truth only.

#### Owns

- first Extrude transient session state shape
- staged command step labels for `Extrude`, `Select Profiles`, and `Depth`
- root `Extrude` start behavior that initializes the session
- session cancellation path with no graph mutation
- status/prompt text that reflects real available behavior
- focused tests proving the session exists after root `extrude`
- the first transition rule from `selectProfiles` to `depth` once profile selection exists, even if Phase 3.5 supplies the actual viewport picks later

#### Does Not Own

- visible toolbar styling
- profile pick hit-testing
- extrusion preview rendering
- graph commit with selected profiles
- final drag-handle implementation
- Build Path projection changes

#### Session Shape

The first session should track:
- lifecycle state, probably the existing command lifecycle language from Phase 1 (`previewing` while active before commit)
- graph document id
- entry point, such as console root command or later viewport shortcut/toolbar entry
- active command step:
  - `selectProfiles`
  - `depth`
- selected profile contributors, reusing the Phase 3.1 profile-source shape where practical
- distance/depth value, defaulting to a deterministic starter value rather than creating geometry
- operation mode defaulting to `New Body`
- validation state, at minimum:
  - needs profiles
  - ready for depth
- command tree labels or descriptors:
  - `Extrude`
  - `Select Profiles`
  - `Depth`

Suggested first type shape:

```ts
type ExtrudeCommandStep = 'selectProfiles' | 'depth';

type ExtrudeCommandSession = {
  commandFamily: 'Extrude';
  lifecycleState: 'previewing';
  graphDocumentId: string;
  entryPoint: GraphCommandEntryPoint;
  activeStep: ExtrudeCommandStep;
  selectedProfileSources: ExtrudeGraphCommandProfileSource[];
  depth: number;
  operationMode: 'newBody';
  validation: 'needsProfiles' | 'readyForDepth';
  commandPath: ['Extrude', 'Select Profiles', 'Depth'];
};
```

The exact file/type names may follow the existing store shape, but the behavior should stay this narrow.

#### Shipped Runtime Notes

- Added `src/app/spaghetti/commands/extrudeCommandSession.ts` as the pure owner for the first transient Extrude command-session shape.
- Added `extrudeCommandSession` plus start/cancel/profile-source transition actions to `useSpaghettiStore` so later viewport and toolbar code can read and dispatch against shared session state.
- Root Console `extrude` now starts the shared session with `previewing`, `selectProfiles`, `needsProfiles`, default `New Body`, default depth, and `Extrude > Select Profiles > Depth`.
- Root Console `extrude` now visibly clears the submitted input token and pins the Console summary to `Extrude > Select Profiles` with `Waiting for sketch profiles`, so the user can see the session is active before the toolbar and picker phases exist.
- Escape cancels the active Extrude command session and leaves graph nodes and edges untouched.
- Profile-source transition proof exists in the pure session tests; real profile hit-testing and shift-click selection remain Phase 3.5 scope.

#### Exact First Code Cut

- add a focused transient Extrude session helper/store slice in the nearest shared app/spaghetti/viewport state owner so Console, viewport, and later toolbar can all read it
- route root `Extrude` through that owner instead of only appending a prompt
- preserve no durable graph mutation on start
- expose enough session read state for Phase 3.4 toolbar rendering without implementing the toolbar
- expose a command-tree read projection for Console to present or log `Extrude > Select Profiles > Depth`
- keep root `Extrude` start failure behavior for missing graph document explicit and non-mutating
- add cancel/clear behavior that removes the active session and does not touch graph nodes or edges
- add an action/reducer transition that can move from `selectProfiles` to `depth` when selected profile contributors are present; this can be seeded in tests or by a tiny internal action because Phase 3.5 owns real viewport picking
- add tests for start, command tree labels, missing graph diagnostics, cancellation, step transition, toolbar-readable session state, and no graph mutation

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/stagedNavigation.test.ts`
- likely a new focused Extrude command-session helper, or a narrow slice in the existing Spaghetti app state if that is the local session pattern
- optional focused `extrudeCommandSession.test.ts` if the owner can be pure enough to test directly
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not add profile hit-testing, shift-click selection behavior, drag-handle UI, extrusion preview rendering, OK graph commit, automatic node placement call sites, or Build Path projection in this phase.

The session may start with zero selected profiles and a disabled commit state. The only profile-selection behavior allowed in this phase is an internal/testable state transition proving that once selected profile contributors exist, the command can advance from `Select Profiles` to `Depth`.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/console/ConsoleDock.test.tsx -t "Extrude"
npm.cmd exec -- vitest run src/app/console/stagedNavigation.test.ts -t "Extrude"
npm.cmd exec -- vitest run src/app/spaghetti/commands/extrudeCommandSession.test.ts
npm.cmd run build
```

## [x] `Spaghetti-Editor 8 / Phase 3.2A` - `Extrude Select Profiles Console Prompt`

### Phase 3.2A Summary

Turn the active root `Extrude` session from a passive waiting status into an active Console command conversation.

After this phase, entering `extrude` should make Console ask for the next required thing: a sketch profile selection. The next Console submission should be interpreted in the context of `Extrude > Select Profiles`, not as an unrelated root command.

This phase exists because Phase 3.2 created the session owner and visible waiting state, but the command still does not feel like a guided operation until the active step owns the next input.

### Phase 3.2A Implementation Spec

#### Purpose

Give the `Select Profiles` step an actual Console prompt surface.

Console should not merely display `Waiting for sketch profiles`; it should make clear that the command is asking for a sketch profile and keep the next typed command scoped to that request. This provides the text-command half of the workflow while later viewport and toolbar phases add click picking and visual controls.

#### Live Code Read

- `src/app/spaghetti/commands/extrudeCommandSession.ts` already owns the transient session shape, `selectedProfileSources`, and the automatic `selectProfiles` to `depth` transition when selected profile sources become non-empty.
- `src/app/spaghetti/store/useSpaghettiStore.ts` already exposes `setExtrudeCommandSelectedProfileSources(...)`, so Phase 3.2A can update transient session state without touching graph nodes or edges.
- `src/app/console/useConsoleInteraction.ts` currently sets a status-mode feature assist descriptor after root `extrude`, but `handleSubmitCommand(...)` does not yet intercept the next token for the active Extrude session before generic command parsing.
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts` already has `buildSketchProfileMemberPortId(profileId)` and derived sketch profile helpers, which are the right contract for turning a chosen sketch profile into a transient `ExtrudeGraphCommandProfileSource`.
- Many tests already model sketch features with `outputs.profiles`, so a pure selector can likely enumerate existing graph sketch profiles without viewport hit-testing.

#### Owns

- active Console prompt/assist state for `Extrude > Select Profiles`
- routing the next Console submission through the active Extrude session before generic root/staged command parsing
- honest prompt text when no selectable profile choices are enumerable yet
- optional profile-choice display if existing sketch profile sources are already enumerable from current graph/runtime state
- focused tests proving `extrude` leaves Console in a profile-selection prompt
- focused tests proving the next Console token is handled as an Extrude profile-selection attempt, not a root command
- no-mutation behavior while profile selection is missing or unresolved

#### Does Not Own

- model-viewport profile hit-testing
- shift-click all-profiles selection
- toolbar shell or toolbar controls
- depth drag handle
- extrusion preview rendering
- OK graph commit
- Build Path projection

#### Prompt Behavior

Minimum acceptable behavior:
- after root `extrude`, Console summary reads as an active prompt:
  - `Extrude > Select Profiles`
  - `Select a sketch profile`
- if the user types an unknown profile token, Console reports that profile selection is not available/found yet and keeps the Extrude session active
- Escape cancels the active Extrude session as Phase 3.2 already supports

Preferred first behavior because current graph/runtime appears to expose enough sketch profile data:
- list selectable sketch profile choices under the prompt
- accept an explicit profile token/id/name, such as:
  - full profile id
  - shortened profile id when unambiguous
  - generated label such as `Profile 1`
- update `extrudeCommandSession.selectedProfileSources` using the selected sketch node id and `buildSketchProfileMemberPortId(profileId)`
- transition the session to `Depth` through the existing session helper/store action

If profile enumeration is not cleanly available yet, keep this phase honest with prompt/routing/diagnostic behavior only and leave real selection to Phase 3.5.

#### Ownership Rule

Console owns the prompt and text input routing for the active step.

Root `Extrude` must not become a duplicate Extrude command.

The canonical command flow is still `Graph > Extrude`. Root `Extrude` is a shortcut/entry point for viewport-first users that should enter the same transient `extrudeCommandSession` and later commit through the same `authorExtrudeGraphCommand(...)` / `commitExtrudeGraphPlan(...)` graph-authoring path.

Entry surfaces:
- `Graph > Extrude`
- `Root > Extrude`
- later toolbar button
- later viewport shortcut

All of those surfaces should route into the same command family and session owner. None of them should define a separate Extrude command truth.

The Extrude command session still owns:
- selected profile sources
- active step transition
- validation state
- command path

The toolbar and viewport still do not own command truth.

#### Exact First Code Cut

- replace the current passive Extrude status descriptor with an active `Select Profiles` prompt/assist descriptor after root `extrude`
- route `handleSubmitCommand(...)` so active `extrudeCommandSession.activeStep === 'selectProfiles'` receives the next input before root command parsing
- keep root `Extrude` implemented as a shortcut into the canonical Graph Extrude command/session path, not as a second command branch
- keep Escape cancellation behavior intact
- add a diagnostic response for unresolved profile tokens while keeping the session active and re-showing the profile prompt
- add a small pure selector that maps current graph `Geometry/Sketch` profile outputs to Console choices if the profile data is present
- when a token resolves to exactly one profile, call `setExtrudeCommandSelectedProfileSources(...)` with one transient source and update the Console prompt to `Extrude > Depth`
- when multiple profiles match a token, report ambiguity and keep `Select Profiles` active
- add tests for:
  - root `extrude` summary/prompt asks for sketch profile input
  - next typed token while Extrude is active does not invoke unrelated root command parsing
  - unresolved profile token preserves the active session and shows a diagnostic/prompt
  - successful profile token moves the session to `Depth` without graph mutation
  - ambiguous profile token keeps the session in `Select Profiles`

#### Suggested Helper Shape

Add a pure helper near `extrudeCommandSession.ts` or in a small adjacent module:

```ts
type ExtrudeProfileConsoleChoice = {
  label: string;
  aliases: string[];
  profileSource: ExtrudeGraphCommandProfileSource;
};

type ResolveExtrudeProfileTokenResult =
  | { kind: 'resolved'; choice: ExtrudeProfileConsoleChoice }
  | { kind: 'ambiguous'; choices: ExtrudeProfileConsoleChoice[] }
  | { kind: 'not-found' }
  | { kind: 'no-profiles' };
```

The helper should take graph nodes or a narrow graph snapshot, not React/store state. That keeps the selection rules testable and prevents Console from becoming the profile owner.

#### Likely Files

- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
- `src/app/spaghetti/commands/extrudeCommandSession.test.ts`
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts` for the existing profile-member port helper
- optional new `src/app/spaghetti/commands/extrudeCommandProfilePrompt.ts` if keeping profile-choice parsing separate is cleaner
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not turn this into viewport picking or toolbar work. This phase is about making Console ask for and route the profile-selection step.

Do not commit graph changes from this prompt. Profile selection may update transient session state only.

Do not invent a second profile identity. Use existing sketch profile ids and existing sketch profile member port ids.

Do not invent a second Extrude command. Root, Graph, toolbar, and viewport entry points must share the same Extrude session and later graph commit path.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/console/ConsoleDock.test.tsx -t "Extrude"
npm.cmd exec -- vitest run src/app/spaghetti/commands/extrudeCommandSession.test.ts
npm.cmd run build
```

### Phase 3.2A Runtime Note

The shipped slice added:
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - pure Console-choice enumeration for derived `Geometry/Sketch` profile member ports
  - exact profile-token resolution for generated labels, full profile ids, short profile ids, and node/profile aliases
  - unresolved, ambiguous, and no-profile result states that keep prompt routing testable outside React/store state
- `src/app/console/useConsoleInteraction.ts`
  - root `Extrude` now shows an active `Extrude > Select Profiles` prompt with selectable profile choices when graph sketches expose derived profiles
  - while the Extrude session is in `selectProfiles`, the next Console submission is handled by the Extrude session before root command parsing
  - resolved profile tokens call `setExtrudeCommandSelectedProfileSources(...)` and transition the shared session to `Depth`
  - unresolved or unavailable profile tokens report diagnostics and keep the active Extrude session alive
- focused tests proving:
  - the active profile prompt intercepts the next token instead of invoking unrelated root commands
  - a resolved text profile token moves the transient session to `Depth` without mutating the graph
  - pure profile-choice and token-resolution behavior stays independent of UI ownership

This remains intentionally Console-prompt-only. Viewport hit-testing, shift-click all-profiles selection, toolbar controls, preview geometry, depth drag handles, and graph commit remain deferred to later Phase 3.3 through Phase 3.6 work.

## [x] `Spaghetti-Editor 8 / Phase 3.3` - `Viewport Shortcut Modal Guarding`

### Phase 3.3 Summary

Harden viewport command shortcuts so root Sketch or later Extrude shortcuts do not fire while another command/session owns input.

This keeps Shortcuts-first mode useful without letting viewport command shortcuts steal keys from sketch plane pick, staged Console, sketch draw/review, reference transform, or the new Extrude session.

Current status: implementation-prepped. The next code cut should stay on shared input-routing guardrails and the existing viewport `S` command path, not on new command UI.

### Phase 3.3 Implementation Spec

#### Purpose

Make the `viewport-command` route in shared input routing modal-aware.

Viewport command shortcuts are useful only when the viewport is the active surface and no command conversation is already in progress. If another session owns the next key, that owner should win before `viewport-command` can start a root command.

#### Live Code Read

- `src/app/inputRouting.ts` currently routes `viewport-command` after viewer display/camera shortcuts but before Shortcuts-first deliberate Console entry and printable suppression.
- The viewport command route currently only checks:
  - `viewportCommandShortcutsEnabled`
  - `consoleInputPriorityMode === 'shortcuts-first'`
  - `KeyS` without modifiers
- `src/app/console/useConsoleInteraction.ts` builds `viewportCommandShortcutsEnabled` from active viewer surface plus viewer availability, but it does not yet fold in active command/session owners.
- The same hook handles both docked and popout global key listeners; both call `routeConsoleGlobalKey(...)` and both currently respond to `routing.owner === 'viewport-command' && routing.viewportCommandAction === 'sketch'` by calling `startRootSketchCommand(...)`.
- Phase 3.2A added `spaghettiState.extrudeCommandSession`; while that session exists, keys should belong to Extrude cancellation/profile/depth flow rather than starting another root viewport command.
- Existing routing already gives Escape/Enter/Delete and several transform keys to sketch-plane, sketch-draw, staged Console, or reference-transform owners. Phase 3.3 should extend that modal ownership to printable viewport command shortcuts, not create a second shortcut system.

#### Owns

- guard conditions for viewport command shortcuts
- focused routing tests for active modal/session owners
- docked and popout Console parity if the global key handler needs adjustment
- preserving the already-shipped viewport `S` behavior when the command surface is idle
- preserving Console-first behavior where plain `s` continues to route as Console text capture

#### Does Not Own

- new shortcuts beyond the already introduced viewport `S`
- root `Extrude` shortcut assignment
- shortcut rebinding
- toolbar UI
- graph command mutation
- profile selection, preview, depth drag handles, or graph commit

#### Exact First Code Cut

- add an explicit idle-command-state guard to the viewport command route, either as a new `viewportCommandShortcutsBlocked`/`commandSessionActive` input on `routeKeyboardInput(...)` or by making `viewportCommandShortcutsEnabled` false in `routeConsoleGlobalKey(...)` when a modal command owner exists
- prefer the shared routing seam owning the guard if it can stay readable, because the bug is not specific to `ConsoleDock`
- add routing tests proving viewport `S` does not route to `viewport-command` while these are active:
  - sketch plane pick
  - sketch draw or review
  - staged Console choice/session where the key should belong to Console
  - reference transform
  - active Extrude session from Phase 3.2
- add a ConsoleDock-level regression proving active Extrude plus Shortcuts-first viewport `S` does not create a sketch node and does not cancel/change the Extrude session
- if the guard is applied in `routeConsoleGlobalKey(...)`, prove both docked and popout global handlers consume the same guarded routing result rather than duplicating conditions
- update `routeKeyboardInput(...)` or its caller context so viewport command shortcuts require a clear idle command state:
  - no `sketchPlanePickSession`
  - no `geometrySketchSession`
  - no staged navigation session
  - no Console prompt session
  - no feature assist descriptor that represents an active command prompt
  - no reference/content transform entry session
  - no active `extrudeCommandSession`
- preserve Shortcuts-first viewport `S` behavior when no modal owner is active
- preserve Console-first plain `s` as Console typing

#### Likely Files

- `src/app/inputRouting.ts`
- `src/app/inputRouting.test.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.test.tsx`
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Acceptance Read

- [ ] viewport `S` still starts root Sketch from the model viewport in Shortcuts-first mode when no command/session owns input
- [ ] viewport `S` does not start Sketch during sketch plane pick
- [ ] viewport `S` does not start Sketch during sketch draw or sketch review
- [ ] viewport `S` does not start Sketch while staged Console or prompt sessions own the next key
- [ ] viewport `S` does not start Sketch during reference/content transform entry
- [ ] viewport `S` does not start Sketch while an active Extrude session owns `Extrude > Select Profiles` or later `Depth`
- [ ] Console-first plain `s` remains Console text capture
- [ ] docked and popout global key handling share the same routing decision

#### No-Widening Rule

Do not use this phase to add the Extrude toolbar or broader key-binding customization.

Do not add new command shortcuts. If Extrude eventually gets a viewport shortcut, it should use the same guarded command-route contract after this phase.

#### Verification Shape

```powershell
npm.cmd test -- src/app/inputRouting.test.ts
npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "viewport S"
npm.cmd run build
```

### Phase 3.3 Runtime Note

The shipped slice added:
- `src/app/inputRouting.ts`
  - a `viewportCommandModalOwnerActive` route input for caller-known command/session ownership such as active Extrude or non-root staged Console flows
  - viewport command shortcut blocking when sketch plane pick, sketch draw/review, reference transform, or explicit modal command ownership is active
  - preserved Shortcuts-first viewport `S` routing when the command surface is idle
- `src/app/console/useConsoleInteraction.ts`
  - shared route context now marks viewport command shortcuts as blocked while sketch plane pick, sketch draw/review, active Extrude, non-root staged navigation, Console prompt sessions, or reference/content transform entry sessions own input
  - the root staged Console surface remains idle for viewport command purposes, so the existing viewport `S` proof still works
- focused tests proving:
  - viewport `S` stays idle-only across modal command/session owners in the pure router
  - active Extrude profile selection prevents viewport `S` from starting Sketch or creating graph mutation
  - the existing idle viewport `S` shortcut still starts Sketch in Shortcuts-first mode

This remains intentionally shortcut-guard-only. It does not add new shortcuts, shortcut rebinding, toolbar UI, profile picking, preview, drag handles, or graph commit behavior.

## [x] `Spaghetti-Editor 8 / Phase 3.4` - `Model Viewport Extrude Toolbar Shell`

### Phase 3.4 Summary

Mount the first visible model-viewport Extrude toolbar shell over the real session owner from Phase 3.2.

The toolbar should make the command state visible without committing graph truth by itself.

Current status: shipped. The model viewport now shows a compact Extrude toolbar while `extrudeCommandSession` is active, reading the shared session owner for command step, selected profile count, depth, operation, and blocked/ready state without creating toolbar-local command truth.

### Phase 3.4 Implementation Spec

#### Purpose

Give users the visible command surface promised by root `Extrude`:
- selected profile count
- distance control
- active command step read
- default operation read
- OK and Cancel controls

#### Owns

- visible toolbar shell while an Extrude session is active
- session-derived `Select Profiles` versus `Depth` display
- selected profile count display from `selectedProfileSources.length`
- depth display from the session's `depth`
- operation read from the session's `operationMode`, with first-pass wording such as `New Body`
- disabled `OK` visual state while validation is `needsProfiles`
- active `Cancel` control wired to the existing session cancel action
- focused tests that prove rendering and cancellation do not mutate graph nodes or edges

#### Does Not Own

- profile hit-testing
- selected profile toggling
- live extrusion preview
- depth editing if the session owner does not yet expose a dedicated setter
- commit behavior
- shortcut routing
- Console profile-token routing
- final toolbar styling polish beyond usable first-pass fit

#### Current Live Read

Live files and seams:
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - owns `ExtrudeCommandSession`
  - exposes `activeStep`, `selectedProfileSources`, `depth`, `operationMode`, `validation`, and `commandPath`
  - moves from `selectProfiles` to `depth` when selected profile sources exist
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns `extrudeCommandSession`
  - already exposes start, cancel, and selected-profile-source update actions
  - should remain the toolbar's command-state source for this phase
- `src/app/console/useConsoleInteraction.ts`
  - starts root Extrude from Console and viewport shortcuts
  - projects active Extrude assist descriptors back into Console
  - already cancels active Extrude sessions from Escape
- `src/app/console/ConsoleDock.test.tsx`
  - proves root `Extrude`, Console root `E`, viewport `Shift+E`, viewport plain `E` in Shortcuts-first, active profile prompt routing, and no graph mutation on session start
  - can remain the command-entry proof while `ViewerHost` owns the visible toolbar proof
- `src/app/components/ViewerHost.tsx`
  - is the nearest model-viewport overlay host
  - already renders viewport-local overlays and display-mode UI above the canvas layer
  - already reads from `useSpaghettiStore` for sketch plane and sketch draw viewport state
- `src/app/components/ViewerHost.test.tsx`
  - already has a broad jsdom harness for rendering `ViewerHost` against store state
  - is the right first target for toolbar mount/cancel/no-mutation proof

#### First Pass Decisions

- Put the first toolbar shell in the model viewport host path, not Console.
- Read all toolbar state from `useSpaghettiStore.getState().extrudeCommandSession` or equivalent selectors.
- Keep the toolbar compact and anchored as a viewport overlay, not inside a card-heavy panel.
- Use explicit test hooks or accessible labels for the shell, selected count, depth, `OK`, and `Cancel`.
- Leave `OK` disabled in this slice unless the current session validation is already `readyForDepth`; do not wire it to graph commit yet.
- If depth editing needs a store setter that does not exist, either add a narrow transient session setter with focused tests or display depth read-only and record editing as Phase 3.5/3.6 follow-up. Do not create local-only depth truth.
- `Cancel` should call the existing cancel action and should not author a command summary or graph mutation in this phase.

#### Exact First Code Cut

- Add a small viewport Extrude toolbar component or local `ViewerHost` overlay section.
- Render it only when `extrudeCommandSession !== null`.
- Display:
  - `Extrude`
  - current step label: `Select Profiles` or `Depth`
  - selected count: `0 selected`, `1 selected`, or `N selected`
  - depth value from the session, initially the current default `10`
  - operation read: `New Body`
  - `OK`
  - `Cancel`
- Wire `Cancel` to `useSpaghettiStore.getState().cancelExtrudeCommandSession()`.
- Keep `OK` disabled when `session.validation === 'needsProfiles'`.
- If the shell receives a pre-seeded ready session, allow the visual state to show `Depth`, selected count, and non-disabled readiness if that is already present in `validation`, but do not execute commit.
- Keep graph nodes, edges, and params unchanged on render and cancel.
- Add focused tests for:
  - no toolbar when no Extrude session exists
  - toolbar appears after a seeded active Extrude session
  - `selectProfiles` state shows `0 selected`, default depth, `New Body`, disabled `OK`, and active `Cancel`
  - pre-seeded selected profile sources render `Depth` and the correct selected count
  - clicking `Cancel` clears the session and leaves the graph unchanged

#### Likely Files

- `src/app/components/ViewerHost.tsx` or the nearest model-viewport overlay host
- optional new `src/app/components/ExtrudeCommandToolbar.tsx` or local helper if `ViewerHost.tsx` should stay smaller
- optional CSS beside the existing viewport overlay styles if the shell needs scoped styling
- `src/app/components/ViewerHost.test.tsx`
- optional `src/app/spaghetti/commands/extrudeCommandSession.test.ts` only if a new transient depth setter is added
- `src/app/console/ConsoleDock.test.tsx` only if the implementation needs to prove root/shortcut entry creates the shell through the full docked flow
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement profile picking, selected-profile hit testing, shift-click selection, preview geometry, depth drag handles, toolbar `OK` commit, Build Path projection changes, or graph mutation in this phase.

Do not create a second toolbar-local copy of command state. The toolbar may have local DOM/input state only if it is immediately synchronized to a session-owner action; otherwise display session state read-only.

#### Implementation Risks

- `ViewerHost.tsx` is already large, so the toolbar should be small and easy to extract if the markup grows.
- Broad `ViewerHost.test.tsx` can be expensive; keep the new tests focused and query by accessible labels or stable data attributes.
- If `OK` visually enables for pre-seeded ready sessions, the button must still not commit until Phase 3.6 owns commit behavior.
- Console active assist and viewport toolbar should both reflect the same session state, but neither should become the durable command truth.

#### Checklist

- [x] Render a viewport toolbar only for active Extrude sessions.
- [x] Show `Select Profiles` and `Depth` from the session owner.
- [x] Show selected profile count from `selectedProfileSources`.
- [x] Show depth and operation from the session owner.
- [x] Keep `OK` blocked when profiles are missing.
- [x] Make `Cancel` clear only transient session state.
- [x] Prove render and cancel do not mutate graph nodes or edges.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t "Extrude"
npm.cmd exec -- vitest run src/app/console/ConsoleDock.test.tsx -t "starts root Extrude|routes the next Console token through active Extrude"
npm.cmd run build
```

#### Done Shape

Phase 3.4 is done when starting or seeding an Extrude session makes the model viewport show a compact Extrude toolbar backed by `extrudeCommandSession`, Cancel clears that transient session without graph mutation, and the user can see the command step, selected count, depth, operation, and blocked/ready status before Phase 3.5 adds real profile picking.

### Phase 3.4 Runtime Note

The shipped slice mounts the toolbar in `src/app/components/ViewerHost.tsx` and styles it through `src/app/theme/surfaces/viewport-overlay.css`.

Runtime behavior:
- active Extrude sessions render an `Extrude` viewport toolbar over the canvas
- the toolbar reads `Select Profiles` versus `Depth`, selected profile count, depth, operation, and validation directly from `extrudeCommandSession`
- `OK` is visibly blocked while validation is `needsProfiles`
- seeded ready sessions can show the depth step and enabled visual readiness, but `OK` still does not commit graph truth in this phase
- `Cancel` calls the existing session cancel action and clears only transient session state
- rendering and cancellation leave graph nodes and edges unchanged

Focused proof landed in `src/app/components/ViewerHost.test.tsx`, with Console entry/session regression proof still covered by `src/app/console/ConsoleDock.test.tsx`. Phase 3.5 now owns real viewport profile picking, selected-profile updates from hit testing, and preview-ready depth state.

## [x] `Spaghetti-Editor 8 / Phase 3.5` - `Profile Picking Count And Preview State`

### Phase 3.5 Summary

Wire viewport sketch-profile selection into the active Extrude session and open the depth step once the selection is meaningful.

The user should be able to pick individual sketch profiles, shift-click one profile to select all compatible profiles in that sketch, see the selected count update, and then see an honest first depth preview/handle state.

Current status: shipped. Clicking visible graph-authored sketch profiles now updates `extrudeCommandSession.selectedProfileSources` and the Phase 3.4 toolbar count/depth state without committing graph truth.

### Phase 3.5 Implementation Spec

#### Purpose

Make the toolbar meaningful by connecting it to selectable graph-authored sketch profiles.

#### Owns

- a narrow viewport-to-session profile pick handoff for visible graph-authored sketch profiles
- selecting one profile as one `ExtrudeGraphCommandProfileSource`
- shift-click selecting all compatible profiles from the picked sketch
- replacing/toggling transient selected-profile state without durable graph mutation
- selected count updates in the Phase 3.4 toolbar
- transition from `Select Profiles` to `Depth` through the existing session owner
- selected profile highlight/readiness state if the existing overlay path can expose it safely
- preview-ready session state, not durable preview or commit behavior

#### Does Not Own

- imported STEP face picking
- generic planar face extrusion
- boolean operation variants
- rich live preview fidelity
- depth drag handles unless the first profile-pick seam makes them trivial and non-mutating
- durable graph commit

#### Current Live Read

Live files and seams:
- `src/app/components/ViewerHost.tsx`
  - already builds `geometrySketchOverlay` for the active sketch and `visibleGeometrySketchOverlays` for visible inactive graph-authored sketches
  - maps sketch profile ids and vertices through `getProfileDisplayVertices(...)`
  - currently routes ordinary viewer object picks through `setOnWorkspaceSelectionPick(...)`, which should not become the profile-selection owner
- `src/app/viewerBridge.ts`
  - exposes `GeometrySketchOverlayVm.profiles` and `VisibleGeometrySketchOverlayVm.profiles`
  - exposes component callbacks such as `setOnGeometrySketchSelectComponents(...)`
  - now exposes the dedicated `setOnGeometrySketchSelectProfile(...)` graph sketch-profile pick callback instead of overloading whole-part selection
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - owns `selectedProfileSources`
  - already moves the session from `selectProfiles` to `depth` when selected profile sources become non-empty
  - already provides Console profile choices from sketch member output ports
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - exposes `setExtrudeCommandSelectedProfileSources(...)`
  - keeps the transient session separate from durable graph nodes and edges
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - owns `buildSketchProfileMemberPortId(profileId)` and `listSketchProfileMemberOutputPorts(node)`
  - is the right source for turning a picked profile id into a `SketchProfile:<profileId>` source port
- `src/app/components/ViewerHost.test.tsx`
  - already mocks viewer bridge callbacks and is the right focused test surface for profile-pick handoff, toolbar count, depth-step transition, and no graph mutation

#### First Pass Decisions

- Add a dedicated profile-pick callback to the viewer bridge if no existing profile callback exists.
- Route profile picks only while `extrudeCommandSession !== null`; otherwise existing viewer/sketch selection behavior should remain unchanged.
- Treat visible graph-authored sketch profile picks as transient command input, not workspace target selection.
- Convert picked `{ sketchNodeId, profileId }` to `{ nodeId: sketchNodeId, portId: buildSketchProfileMemberPortId(profileId) }`.
- Plain click replaces the selected profile source list with the clicked profile.
- Shift-click selects all compatible profiles from the same sketch node for the first implementation pass.
- Do not create graph nodes, edges, command summaries, or Build Path projection rows in Phase 3.5.
- If profile highlighting requires viewer-side support, keep it as a simple selected-profile id/source projection and defer richer preview styling.
- Keep depth read-only unless a session-owned setter already exists or can be added narrowly without committing durable graph truth.

#### Exact First Code Cut

- add the smallest viewer-bridge callback needed for profile picks, likely shaped around `{ sketchNodeId, profileId, shiftKey }`
- have `ViewerHost` register that callback and ignore it when no Extrude command session is active
- find the picked sketch node in the active graph document/session context
- verify the picked profile exists on that sketch's resolved `SketchProfiles` member output list
- on plain click, call `setExtrudeCommandSelectedProfileSources([{ nodeId: sketchNodeId, portId: buildSketchProfileMemberPortId(profileId) }])`
- on shift-click, collect every member profile output from the same sketch node and call the same setter with all compatible sources
- keep the selected sources editable after the session enters `depth`
- update any toolbar selected/highlighted projection from the same session state
- keep graph nodes, edges, params, and command summaries unchanged
- add focused tests for:
  - profile pick is ignored when no Extrude session is active
  - one viewport profile pick selects exactly one `SketchProfile:<profileId>` source and moves to `Depth`
  - shift-click selects every profile source from the picked sketch only
  - toolbar count updates from `1 selected` to `N selected`
  - no whole-sketch `SketchProfiles` fallback is used for individual picks
  - render/pick does not mutate graph nodes or edges

#### Likely Files

- `src/app/viewerBridge.ts`
- viewer implementation file that consumes `GeometrySketchOverlayVm` / `VisibleGeometrySketchOverlayVm` and owns sketch-profile hit handling
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/commands/extrudeCommandSession.ts` only if a tiny reusable helper is needed for source replacement/shift expansion
- `src/app/spaghetti/commands/extrudeCommandSession.test.ts` only if that helper is added
- `src/app/theme/surfaces/viewport-overlay.css` only if selected-profile/highlight display needs a small toolbar state style
- this future doc
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not commit graph nodes or wires in this phase. The session state should become commit-ready, and depth can remain existing session state, but Phase 3.6 owns acceptance.

Do not route profile picks through whole-part workspace selection, imported STEP topology picking, generic face selection, or the Spaghetti canvas wire/port row system. This phase is only the viewport command-session path for graph-authored sketch profiles.

Do not add Build Path projection changes, boolean operation variants, imported face extrusion, final preview fidelity, or OK behavior.

#### Implementation Risks

- The viewer bridge currently has overlay profile data but no dedicated profile-pick callback; adding one should be narrower than reusing whole-workspace part selection.
- `visibleGeometrySketchOverlays` currently carry `overlayId` but not the source graph node id directly; implementation may need to add a `nodeId` to the overlay VM or otherwise preserve a stable pick-to-node mapping.
- Active-sketch overlays and visible inactive sketch overlays need the same picked profile source shape.
- Shift-click all-profiles must only gather compatible profiles from the picked sketch, not every visible sketch in the scene.
- Console profile-token selection and viewport profile selection should converge on the same `setExtrudeCommandSelectedProfileSources(...)` session state.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t "Extrude" --reporter verbose
npm.cmd exec -- vitest run src/app/spaghetti/commands/extrudeCommandSession.test.ts
npm.cmd run build
```

#### Done Shape

Phase 3.5 is done when a user can start Extrude, click a visible graph-authored sketch profile in the model viewport, see the toolbar count update and the command move to `Depth`, shift-click to select all compatible profiles from that sketch, and prove all of that remains transient with no graph mutation until Phase 3.6 wires `OK`.

### Phase 3.5 Runtime Note

Phase 3.5 shipped the first viewport profile-pick bridge for active Extrude sessions:
- graph-authored sketch profile overlay lines now carry stable sketch node/profile pick metadata
- the viewer bridge exposes `setOnGeometrySketchSelectProfile(...)`
- `ViewerHost` ignores profile picks when no Extrude session is active
- a plain profile click replaces the transient selected profile source with the picked `SketchProfile:<profileId>` member port
- Shift-click selects every profile from the picked sketch only
- the shared Extrude session moves to `Depth`, updates the toolbar count, and leaves graph nodes/edges unchanged

This phase intentionally stops before `OK` commit, Build Path projection, imported STEP face picking, rich preview, or depth handles. Phase 3.6 owns turning the selected profiles plus depth into durable graph truth.

## [x] `Spaghetti-Editor 8 / Phase 3.5A` - `Live Extrude Node And Profile Auto-Wiring Contract`

### Phase 3.5A Summary

Make `Extrude` become live graph-authored truth as soon as the command starts.

When the user calls `Extrude`, ParaHook should create or reuse a real `Geometry/Extrude` node in the active graph immediately. When the user clicks a closed sketch profile, ParaHook should auto-wire that exact `SketchProfile:<profileId>` row into the live Extrude node's `ExtrusionProfile` input. The viewport session and toolbar remain the command-editing UI, but the Spaghetti graph should already show the authored node and profile wires while the command is in progress.

Current status: shipped. `startExtrudeCommandSession(...)` now creates or reuses a live `Geometry/Extrude` node, `setExtrudeCommandSelectedProfileSources(...)` reconciles exact sketch-profile member wires into that live node, and `cancelExtrudeCommandSession(...)` removes command-created nodes/wires or restores pre-command profile wires on reused nodes.

### Phase 3.5A Implementation Spec

#### Purpose

Replace the earlier no-mutation-until-OK model with live graph command authoring for Extrude.

#### Owns

- creating or reusing a live `Geometry/Extrude` graph node when `Extrude` starts
- storing that live Extrude node id on the active command session
- auto-wiring selected sketch profile member rows into the live node's `ExtrusionProfile` input as profiles are selected
- replacing profile wires on plain click so the live graph matches the current selected profile list
- replacing same-sketch profile wires on Shift-click with every profile from the picked sketch only
- making `Cancel` roll back or remove unaccepted live command work
- focused proof that auto-wiring uses individual `SketchProfile:<profileId>` member ports instead of whole-sketch fallback

#### Does Not Own

- selectable-profile fill and hover polish
- profile preselection outside active Extrude sessions
- depth preview volume rendering
- final `OK` acceptance behavior and accepted Build Path row projection
- imported STEP face picking
- generic planar face extrusion
- boolean operation variants
- final distance/taper runtime fidelity

#### Product Rules

- Calling `Extrude` should make the Spaghetti graph show the Extrude node right away.
- Selecting a profile should make the Spaghetti graph show the wire from the selected sketch profile row into that live Extrude node right away.
- The live graph node/wires are command-owned until accepted.
- `OK` should later accept/finalize the command-owned live graph work; it should not be the first time the node or wires appear.
- `Cancel` should remove or roll back the live command-owned Extrude node/wires if they were created only for the unaccepted command.
- Reusing an existing selected Extrude node should not delete user-authored pre-existing graph truth on cancel; only command-owned edits should be reversible.
- The command session should remain the UI/editing owner for active step, selected count, depth, operation, and validation.

#### Current Live Read

Live files and seams:
- `src/app/console/graphCommandAuthoring.ts`
  - already has `authorExtrudeGraphCommand(...)` and `ExtrudeGraphCommandPlan`
  - currently requires `selectedProfileSources.length > 0` before committing
  - currently treats commit as the point where create/reuse plus profile wires happen
  - can either be split so live graph authoring gets a plan/finalize helper, or left as the later accept-summary helper while a neighboring live owner handles command-time mutation
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - owns selected profile sources, depth, step, and validation
  - now stores live Extrude node id, created-node marker, command-owned profile edge ids, and replaced pre-command profile edges
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns `startExtrudeCommandSession(...)` and `setExtrudeCommandSelectedProfileSources(...)`
  - now `cancelExtrudeCommandSession(...)` rolls back command-owned live graph edits before clearing session state
  - exposes `applyGraphCommand(...)` / `applyGraphPatch(...)` for store-normalized graph mutation
  - will need a narrow store-owned way to create/reuse the live Extrude node and keep profile wires synchronized with selected sources
- `src/app/console/useConsoleInteraction.ts`
  - root `Extrude` calls `startExtrudeCommandSession(...)`, which now creates/reuses live graph truth
  - Console profile token resolution calls `setExtrudeCommandSelectedProfileSources(...)`, which now syncs live graph wires
- `src/app/components/ViewerHost.tsx`
  - receives profile picks and calls the same session/profile action that updates live graph wires
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - already owns `buildSketchProfileMemberPortId(profileId)` and `ExtrusionProfile` normalization
  - `normalizeExtrudeProfileConnectionEndpoints(...)` and `isWholeExtrusionProfileTargetEndpoint(...)` are the right guardrails for wiring into `ExtrusionProfile`

#### First Pass Decisions

- Add live command metadata to the Extrude session, likely `liveExtrudeNodeId`, `createdExtrudeNodeId`, and command-owned profile edge ids.
- On root/viewport `Extrude` start, create or reuse the target `Geometry/Extrude` node immediately even if no profile is selected yet.
- When selected profiles change, reconcile the live Extrude node's `ExtrusionProfile` incoming edges to match the selected source list.
- Prefer one store action that updates selected profile sources and live graph wires together so the UI/session and graph cannot drift.
- Treat `authorExtrudeGraphCommand(...)` as either an accepted-summary/finalize helper later or split a new live authoring helper from it; do not bypass the graph-authoring owner.
- Keep profile rows individual: selected profile sources should be `SketchProfile:<profileId>`, not whole `SketchProfiles`, unless the user explicitly selects an aggregate later.
- Do not use raw `applyGraphCommand(...)` directly from UI components for the live Extrude mutation. Route through store/authoring helpers so rollback metadata and graph normalization stay together.

#### Rollback Model

- If Phase 3.5A creates a new Extrude node for the active command, Cancel removes that node and every command-owned wire attached to it.
- If Phase 3.5A reuses an existing Extrude node, Cancel keeps that node.
- For reused nodes, Cancel removes only wires created by this active command and restores any pre-command `ExtrusionProfile` wires that were replaced by the command.
- Command-owned edge ids should be tracked explicitly where possible; if edge ids are generated during graph mutation, return them from the live sync helper and store them on the session.
- Profile-wire reconciliation should be idempotent: applying the same selected source list twice should not create duplicate wires.
- Accept/finalize in Phase 3.6 should clear rollback metadata after the user confirms the command-owned graph work.

#### Exact First Code Cut

- extend `ExtrudeCommandSession` with live graph command fields:
  - `liveExtrudeNodeId`
  - `createdExtrudeNodeId` or equivalent create/reuse marker
  - command-owned profile edge ids
  - optional replaced pre-command profile edges for reused-node rollback
- add/create a store action for starting Extrude with live node creation/reuse
- add/create a store action for syncing selected profile sources to live Extrude profile wires
- update Console and viewport root Extrude entry points to use the live start action through `startExtrudeCommandSession(...)`
- update profile pick handling so one profile click and Shift-click update both session state and graph wires
- update Console profile-token resolution so text-selected profiles also auto-wire into the live Extrude node
- prove the live graph contains the Extrude node immediately after command start
- prove the live graph wire appears after profile selection and targets `ExtrusionProfile`
- prove one profile pick wires `SketchProfile:<profileId>`, not whole `SketchProfiles`
- prove Shift-click wires every profile from the picked sketch only
- prove cancel rolls back command-owned live node/wires while preserving unrelated graph truth
- prove reused existing Extrude cancel keeps the reused node and restores/removes only command-owned profile-wire changes
- update docs/changelog when implemented

#### Likely Files

- `src/app/spaghetti/commands/extrudeCommandSession.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/console/graphCommandAuthoring.ts` or a new adjacent live Extrude authoring helper
- focused ConsoleDock/ViewerHost/store/graph-authoring tests
- `src/app/spaghetti/store/useSpaghettiStore.test.ts` if live graph mutation/rollback is easiest to prove at store level
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement hover fill, white hover, extrusion preview volume, depth handles, final Build Path projection, imported STEP face selection, or generic planar face extrusion in this phase.

Do not make graph mutation happen from hover. Only command start and selected-profile changes should mutate the live command-owned graph.

Do not lose the rollback boundary. If this phase creates live graph truth before `OK`, it must also define which node/edges are command-owned and reversible on `Cancel`.

Do not auto-wire whole `SketchProfiles` unless the selected source explicitly is an aggregate. Viewport and Console profile picks in this lane should wire exact `SketchProfile:<profileId>` member rows.

Do not emit accepted Build Path summaries yet. Phase 3.5A may create live graph truth, but Phase 3.6 owns accepted/finalized command summaries.

#### Implementation Risks

- The existing graph-authoring helper cancels when profiles are missing, so live node creation may need a sibling helper rather than forcing `authorExtrudeGraphCommand(...)` to mean two different lifecycle moments.
- Store graph mutation and session metadata must update together; a node/wire mutation without matching rollback metadata would make Cancel unsafe.
- Reused Extrude nodes need a snapshot of their pre-command profile input edges before reconciliation starts.
- Edge id generation and graph normalization must be deterministic enough for rollback tests to assert exact command-owned edge removal.
- Console token selection and viewport click selection must converge on the same live sync action.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/console/ConsoleDock.test.tsx -t "Extrude" --reporter verbose
npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t "Extrude" --reporter verbose
npm.cmd exec -- vitest run src/app/spaghetti/commands/extrudeCommandSession.test.ts --reporter verbose
npm.cmd exec -- vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "Extrude" --reporter verbose
npm.cmd run build
```

#### Done Shape

Phase 3.5A is done when starting `Extrude` creates or reuses a live `Geometry/Extrude` graph node, profile picks immediately wire exact sketch profile member ports into that live node, selected source state and graph wires stay synchronized, and Cancel can remove or roll back command-owned live graph work without touching unrelated graph truth.

## [x] `Spaghetti-Editor 8 / Phase 3.5B` - `Viewport Profile Hover And Preselection`

### Phase 3.5B Summary

Make closed graph-authored sketch profiles feel selectable before the user commits to Extrude.

The user should be able to see selectable closed profiles as filled regions, hover a closed profile and see a clear white highlight, select a profile in the viewport outside the Extrude command, and then start Extrude with that preselected profile already available. The same profile selection visual language should also work while Extrude is active.

Current status: shipped. Closed graph-authored sketch profiles now produce selectable filled overlay regions, hovered profiles project as a white highlight, profile clicks outside Extrude store transient viewport preselection without graph mutation, and root Extrude startup can consume valid preselected profiles through the shipped Phase 3.5A live node/wire path.

### Phase 3.5B Implementation Spec

#### Purpose

Move profile picking from an Extrude-only hidden command input into a visible viewport selection affordance that Extrude can consume.

#### Owns

- selectable closed sketch-profile fill presentation
- first-pass selectable fill color using 50% opacity of the existing sketch/profile line color
- a future settings-owned customization goal for the selectable profile fill color
- white hover highlight when the pointer is over a closed profile
- selected profile state outside an active Extrude command
- active Extrude consuming existing profile preselection when the command starts through the live node/wire path
- active Extrude continuing to accept closed-profile clicks after the command starts
- focused tests proving preselection does not mutate graph truth

#### Does Not Own

- durable graph commit
- Build Path projection
- imported STEP face picking
- generic planar face extrusion
- final Settings UI for the color picker unless the existing settings owner makes it trivial
- rich extrusion preview or depth drag handles

#### Product Rules

- A closed graph-authored sketch profile that can be selected should be visibly filled even before Extrude is active.
- For the first implementation, use the same color as the sketch/profile line at 50% opacity for selectable profile fill.
- Later Settings should own customization of the selectable profile fill color and opacity.
- Hovering a closed selectable profile should highlight the profile in white, matching the user's reference direction.
- Profile selection outside Extrude should be transient viewport/workspace selection, not graph mutation.
- Starting Extrude with one or more selected profiles should create/reuse the live Extrude node, seed `extrudeCommandSession.selectedProfileSources`, auto-wire those profiles, and move to `Depth` when valid.
- Starting Extrude with no selected profiles should preserve the existing `Extrude > Select Profiles` path.
- While Extrude is active, selecting closed sketch profiles should continue to update the active session exactly as Phase 3.5 shipped.

#### Current Live Read

Live files and seams:
- `src/app/viewerBridge.ts`
  - already carries `nodeId` on graph-authored sketch overlays
  - already exposes `setOnGeometrySketchSelectProfile(...)` with `{ sketchNodeId, profileId, shiftKey }`
  - currently has no selected/hovered profile VM fields for viewport-level profile selection outside sketch review
- `src/viewer/geometrySketchOverlay.ts`
  - already emits profile polylines with `profileId`
  - currently renders profile outlines only; it does not yet emit filled profile surfaces or a hovered-profile layer
  - selected profile styling currently depends on `overlay.selectedProfileId`, which is sketch-review UI state rather than a general viewport profile preselection owner
- `src/viewer/Viewer.ts`
  - already tags profile outline lines with `geometrySketchProfilePick`
  - already raycasts profile outlines for click selection
  - currently gates profile picking on `onGeometrySketchSelectProfile !== null`, so the next implementation can keep one callback but route it differently in `ViewerHost`
  - already has topology hover overlay patterns that can guide hover state, but Phase 3.5B should stay in the sketch-profile overlay lane
- `src/app/components/ViewerHost.tsx`
  - builds active and visible graph-authored sketch overlays from sketch feature profiles
  - currently ignores profile picks when no Extrude session is active
  - currently maps active Extrude profile picks directly to `setExtrudeCommandSelectedProfileSources(...)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns `extrudeCommandSession` and `setExtrudeCommandSelectedProfileSources(...)`
  - `startExtrudeCommandSession(...)` now creates/reuses the live Extrude node and accepts initial `selectedProfileSources`
  - `setExtrudeCommandSelectedProfileSources(...)` now keeps selected sources and live `ExtrusionProfile` graph wires synchronized
  - `cancelExtrudeCommandSession(...)` now rolls back command-created live nodes/wires or restores replaced reused-node profile wires
  - does not currently own a general selected sketch-profile source list outside Extrude
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - remains the right helper for converting selected profile ids into `SketchProfile:<profileId>` member port ids

#### First Pass Decisions

- Add the narrowest transient selected-profile owner that can live outside Extrude and still be consumed by Extrude startup.
- Prefer storing selected profile sources as `{ nodeId, portId }` plus enough `{ sketchNodeId, profileId }` display identity to light the overlay; do not invent a second durable graph selection schema.
- Plain viewport profile click outside Extrude should replace the selected profile list with the clicked closed profile.
- Shift-click outside Extrude should select every profile from the picked sketch only, matching Phase 3.5 active-Extrude behavior.
- Active Extrude profile clicks should keep updating `extrudeCommandSession.selectedProfileSources` and may also mirror the selected visual state if that keeps display consistent.
- Starting Extrude should seed from the preselected profile list by passing valid sources into `startExtrudeCommandSession(...)`; the existing Phase 3.5A startup path should create/reuse the live node, set selected sources, create the exact profile wires, and advance to `Depth`.
- If preselected profiles are stale or no longer resolve, ignore/drop them and start the normal `Select Profiles` flow.
- Fill selectable profiles in review overlays using the current profile/sketch line color at 50% opacity.
- Use a hard white hover highlight for the hovered closed profile in this first pass; defer Settings-backed hover/fill controls.
- Keep all profile preselection and hover display transient; graph nodes, edges, params, and command summaries must remain unchanged.

#### Exact First Code Cut

- extend the sketch overlay VM with optional selected/hovered profile ids or selected profile source identity needed for viewport display
- extend `buildGeometrySketchRenderPolylines(...)` or add a small companion render output so closed profiles can produce filled surfaces in addition to outline lines
- add a hovered profile layer/state in the viewer overlay path with white highlight presentation
- keep profile click hit testing on the existing Phase 3.5 profile pick metadata
- update `ViewerHost` so profile picks outside Extrude write transient viewport profile preselection instead of returning early
- update the root Extrude startup callers so they resolve valid transient preselected profiles and pass them as initial `selectedProfileSources` into `startExtrudeCommandSession(...)`
- project selected and hovered profile ids back into both active and visible graph-authored sketch overlays
- add focused tests for:
  - selectable graph-authored profiles receive filled overlay presentation data
  - hover over a closed profile produces white hover/highlight state
  - clicking a profile outside Extrude stores transient preselection and does not mutate graph nodes/edges
  - Shift-click outside Extrude preselects every profile from the picked sketch only
  - starting Extrude after valid preselection creates/reuses the live Extrude node, seeds selected profile sources, wires exact profile inputs, and moves to `Depth`
  - starting Extrude without preselection keeps the existing `Select Profiles` state
  - active Extrude profile clicks still update the session as Phase 3.5 proved

#### Likely Files

- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/geometrySketchOverlay.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts` or a narrower existing app/viewport selection owner, depending on where transient graph-profile preselection best fits
- `src/app/spaghetti/commands/extrudeCommandSession.ts` only if startup seeding needs a small helper to validate/normalize profile sources
- focused ViewerHost/viewer overlay tests
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement the Phase 3.5C extrusion volume preview in this phase. Do not add depth arrows, depth drag handles, toolbar value editing, OK commit, Build Path rows, imported STEP face selection, or generic planar face extrusion.

Do not make selectable profile fill a Settings UI project yet. The first implementation should use a hardcoded first-pass presentation that can later be wired to Settings without changing selection ownership.

Do not treat profile preselection as durable graph truth. It is allowed to behave like viewport/workspace selection state, but it must not create graph nodes, graph edges, params, command summaries, or published content rows.

#### Implementation Risks

- Filled profile rendering may need mesh/shape disposal beside the existing line disposal path; keep ownership local to the sketch overlay group.
- Profile hover should not fight existing sketch component hover in active draw mode; keep hover profile behavior focused on closed review profiles.
- The existing `selectedProfileId` on sketch feature UI state is not the same thing as cross-sketch viewport preselection; avoid silently overloading it if multiple sketches can be visible.
- Seeding Extrude from preselection must validate the profile still exists before creating live wires.
- Shift-click should stay same-sketch only and should not gather profiles across every visible overlay.

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t "profile|Extrude" --reporter verbose
npm.cmd exec -- vitest run src/viewer/geometrySketchOverlay.test.ts --reporter verbose
npm.cmd run build
```

#### Done Shape

Phase 3.5B is done when closed selectable sketch profiles show a first-pass filled region, hovering one gives a white profile highlight, selecting a profile outside Extrude stores a transient preselection without graph mutation, starting Extrude consumes that preselection into the live node/wire/session source shape from Phase 3.5A, and active Extrude profile clicks keep working.

### Phase 3.5B Runtime Note

The shipped implementation adds:
- selectable closed-profile fill render regions from the sketch overlay helper
- white hovered-profile fill/outline layers in the viewer overlay lane
- viewport profile hover callback routing into transient Spaghetti store state
- transient `viewportSelectedSketchProfiles` state for profile preselection outside Extrude
- outside-Extrude plain click to preselect one profile and Shift-click to preselect every profile in the picked sketch only
- active Extrude profile clicks mirroring the selected visual state while still updating live `ExtrusionProfile` graph wires
- root Extrude startup seeding from valid preselected profiles through `startExtrudeCommandSession(...)`

The shipped implementation does not add Settings-backed color controls, depth preview geometry, drag handles, `OK` acceptance, Build Path rows, imported STEP face selection, or generic planar face extrusion.

## [x] `Spaghetti-Editor 8 / Phase 3.5C` - `Extrude Depth Preview Volume And Value Feedback`

### Phase 3.5C Summary

Show the user what the selected profile and current depth value will create before `OK` commits anything.

The target is the Fusion-style preview from the reference screenshot: the selected profile is visibly active, the typed distance produces a temporary extrusion volume at that depth, and the viewport shows clear depth direction/value feedback while accepted graph truth remains unfinalized.

Current status: shipped. Phase 3.5A already creates/reuses the live Extrude node and wires selected profiles. Phase 3.5B plus its follow-ups already make closed profiles selectable, allow plain-click toggle multi-selection, keep selected profiles blue, keep hover white, and keep singular profile auto-wires visible in the Spaghetti canvas. Phase 3.5C now adds transient command-owned preview presentation for the selected profiles plus current depth value, without accepting/finalizing the live Extrude command.

### Phase 3.5C Implementation Spec

#### Purpose

Make the `Depth` step visually trustworthy before durable graph mutation exists.

#### Owns

- transient preview geometry for selected graph-authored sketch profiles plus the current depth value
- selected-profile cap presentation similar to the blue active profile region in the reference
- translucent extrusion side/body preview at the input distance
- first-pass viewport depth direction/value feedback only if the existing viewer overlay seam can support it safely
- keeping typed toolbar distance and viewport preview distance on the same session-owned value
- focused tests or visual-state proof that preview generation does not mutate graph nodes, edges, params, or command summaries

#### Does Not Own

- `OK` accept/finalize behavior
- Build Path projection
- final B-rep preview fidelity
- imported STEP face extrusion
- boolean operation variants beyond displaying the currently selected operation label if already present
- polished drag-handle editing or pointer-drag depth authoring if that needs a separate interaction owner
- writing `depthMm` or other accepted params onto the live Extrude node

#### Product Rules

- Preview appears only when at least one selected profile and a valid depth value exist.
- The preview is temporary command/session presentation, not accepted graph/output truth.
- Every selected profile cap should remain visually distinct from non-selected selectable profiles and the white hover highlight.
- Multiple selected profiles should preview together; toggling one profile out should remove only that profile's preview contribution.
- The extrusion body should read as a preview volume rather than final accepted geometry.
- The preview must update when selected profiles or the depth value changes.
- Cancelling or leaving the command clears the preview and relies on the Phase 3.5A rollback boundary for unaccepted live graph work.
- Confirming remains Phase 3.6; preview alone does not accept/finalize `Geometry/Extrude` graph truth.
- If the first implementation cannot safely create side-wall volume geometry, it should still ship the selected-profile cap plus explicit no-graph-mutation preview-state projection rather than widening into worker/mesh execution.

#### Current Live Read

Live files and seams:
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - owns selected profile sources, depth value, operation mode, live graph metadata, and `depth` versus `selectProfiles` command step state
  - does not yet own a preview VM or depth setter beyond initial session creation
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns active `extrudeCommandSession`, live node/wire creation, profile-source synchronization, Cancel rollback, and the 3.5B transient selected/hovered profile state
  - should stay the session owner if a small preview projection or depth setter is needed
- `src/app/components/ViewerHost.tsx`
  - already projects selected/hovered profile ids into active and visible sketch overlays
  - already treats plain viewport profile clicks as toggle multi-selection outside Extrude and inside active Extrude
  - already renders the compact Extrude toolbar from `extrudeCommandSession.depth`
  - should be the first candidate for deriving a preview VM from selected profiles plus session depth
- `src/app/viewerBridge.ts`
  - now carries sketch overlay selected/hovered profile ids and can be extended with a narrow Extrude preview overlay VM
- `src/viewer/geometrySketchOverlay.ts`
  - already builds profile fill regions and profile outline layers from sketch profile vertices
  - can guide selected-profile cap shape construction, but it should not become the owner of command preview semantics
- `src/viewer/Viewer.ts`
  - now renders sketch profile fill/hover/select overlay meshes/lines
  - selected profile material is blue, normal selectable profile fill is cyan, and hovered profile material is white
  - can host a separate transient Extrude preview overlay group or a narrow extension to the existing sketch overlay group if disposal and hit testing stay clear
- `src/app/components/activeDraftExtrudePreview.ts`
  - adjacent context for sketch-plane draft transforms over already-built extrudes
  - should not be reused as accepted-output truth for command preview unless the first cut can keep the preview purely transient and session-owned

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/geometrySketchOverlay.ts` only if shared profile-cap point conversion is needed
- a small command-preview helper under `src/app/components/` or `src/viewer/` if deriving preview cap/body geometry inside `ViewerHost` would get bulky
- `src/app/spaghetti/commands/extrudeCommandSession.ts` and `src/app/spaghetti/store/useSpaghettiStore.ts` only if a narrow depth setter or preview projection helper is needed
- focused ViewerHost/viewer/overlay tests
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Exact First Code Cut

- add a narrow transient Extrude preview VM that can describe:
  - graph document id
  - selected sketch node/profile ids, preserving the current selected source order
  - one selected profile cap vertex set per selected profile
  - depth value
  - operation label/state if already available
- derive the preview VM only when `extrudeCommandSession.activeStep === 'depth'`, `validation === 'readyForDepth'`, at least one selected profile still resolves, and depth is finite/non-zero
- project selected profile caps using the same sketch plane/transform and profile vertices used by the 3.5B overlay path
- render first-pass selected caps and translucent preview body/side walls if the viewer seam can do that without worker/build involvement
- if side walls are too large for the first cut, render selected caps and depth witness/value feedback first, with side walls left as the next preview-polish follow-up
- clear the preview when the command returns to `selectProfiles`, selected profiles become stale, depth is invalid, Cancel runs, or the Extrude session is null
- keep graph nodes, graph edges, graph params, accepted runtime output, command summaries, and Build Path projections unchanged
- add focused tests for:
  - selected profiles plus valid depth create preview VM/render calls
  - multiple selected profiles produce multiple preview caps/volumes or multiple preview cap entries
  - no selected profiles or invalid/stale selected profiles create no preview
  - changing selection/depth changes preview projection
  - toggling one selected profile out removes only that profile from the preview projection
  - Cancel clears preview through session removal
  - preview generation does not mutate graph nodes, edges, params, or command summaries
  - existing 3.5B profile fill/hover/preselection tests still pass

#### Verification Shape

```powershell
npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t Extrude --reporter verbose
npm.cmd exec -- vitest run src/app/components/ViewerHost.test.tsx -t preview --reporter verbose
npm.cmd exec -- vitest run src/viewer/geometrySketchOverlay.test.ts --reporter verbose
npm.cmd run build
```

#### Done Shape

Phase 3.5C is shipped. One or more selected sketch profiles plus a valid depth value now produce a transient viewport extrusion preview at that value, the selected profile/preview volume is visually distinct from ordinary selectable profiles, toggling profile selection updates the preview projection, and cancelling still rolls back unaccepted live command graph work through the Phase 3.5A ownership boundary.

#### Shipped Code Cut

- Added `ExtrudeCommandPreviewOverlayVm` to the viewer bridge.
- Derived the active Extrude preview from `extrudeCommandSession.selectedProfileSources`, sketch profile vertices, sketch plane transforms, and session depth inside `ViewerHost`.
- Rendered first-pass translucent caps, side walls, and top outline in a separate `Viewer` preview group.
- Kept preview generation display-only; it does not mutate graph nodes, graph edges, graph params, accepted output, command summaries, or Build Path projection.
- Added focused `ViewerHost` proof for multi-profile preview projection and no graph mutation.

## [x] `Spaghetti-Editor 8 / Phase 3.6` - `Extrude Commit Cancel Proof And Phase 3 Closeout`

### Phase 3.6 Summary

Connect toolbar `OK` and `Cancel` to the atomic graph-authoring owner and close the Phase 3 Extrude workflow.

After this phase, selected profiles plus depth should be accepted/finalized as normal `Geometry/Extrude` graph truth, and cancellation should roll back unaccepted command-owned graph changes without touching unrelated graph truth.

Current status: shipped. `OK` now accepts the already-live command node and profile wires instead of calling the older create/reuse authoring path in a way that creates a second Extrude node. The implementation added a store-owned accept/finalize action, wired the toolbar `OK` button to it, and keeps the transient preview/session boundary honest.

### Phase 3.6 Implementation Spec

#### Purpose

Finish the first usable viewport-first Extrude command.

#### Owns

- toolbar `OK` accept/finalize behavior for the live command-authored Extrude
- toolbar `Cancel` rollback behavior for unaccepted command-owned live graph work
- durable distance/default operation params
- final depth value handoff from the session owner
- selected profile contributors wired into `ExtrusionProfile`
- committed/cancelled command summaries
- final Phase 3 acceptance and doc closeout read
- clearing viewport-selected profile preselection and transient Extrude preview after accept/cancel when it belongs to the completed command

#### Does Not Own

- final rich preview fidelity
- taper runtime fidelity
- imported STEP face extrusion
- Build Path UI
- arrangement-mode UI
- creating a second Extrude node during `OK`
- replacing the live auto-wire owner with a separate toolbar-local graph mutation path
- changing profile hover/fill/selection visual language

#### Current Live Read

Live files and seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns `startExtrudeCommandSession(...)`, `setExtrudeCommandSelectedProfileSources(...)`, `cancelExtrudeCommandSession()`, live Extrude node creation/reuse, live profile-wire synchronization, and rollback through `rollbackLiveExtrudeCommandGraph(...)`
  - should own the new accept/finalize action so `ViewerHost` does not mutate graph truth directly
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - already carries `depth`, `selectedProfileSources`, `validation`, `entryPoint`, and live graph metadata
  - likely needs no large lifecycle rewrite for the first cut, but can gain a small helper/result type if it keeps accept validation deterministic
- `src/app/components/ViewerHost.tsx`
  - already renders the toolbar, disables `OK` when profiles are missing, calls Cancel, and projects 3.5C preview data
  - should pass a store action to `ExtrudeCommandToolbar` and add `onClick` to `Confirm Extrude`
- `src/app/console/commandCommitContract.ts`
  - already defines committed/cancelled summary shapes and mutation kinds, including `update-params`, `add-wire`, and `remove-wire`
  - should be reused for the accept/cancel summaries instead of inventing a new summary shape
- `src/app/console/graphCommandAuthoring.ts`
  - still contains the older atomic create/reuse authoring helper
  - useful as a summary/contract reference, but Phase 3.6 should not blindly call it on `OK` because the live command graph already exists
- `src/app/spaghetti/families/Geometry/contracts/sketchExtrudeProfileContract.ts`
  - defines `Geometry/Extrude` stored params and defaults: `depthMm`, `extrudeDirection`, `bodyGenerationMode`, `taperAngleDeg`, and related readers
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - confirms current default Extrude params: `extrudeType: 'Body'`, `extrudeDirection: 'OneSide'`, `bodyGenerationMode: 'NewObjects'`, `depthMm: defaultGeometryExtrudeDepthMm`, and `taperAngleDeg: 0`

#### Exact First Code Cut

- add a store-owned action such as `acceptExtrudeCommandSession(): GraphCommandCommitSummary`
- make the action cancel with a cancelled summary when:
  - no `extrudeCommandSession` exists
  - the session has no live graph metadata
  - the target graph document is missing
  - no selected profile sources remain
  - depth is not finite or is effectively zero
- on valid accept:
  - find the live `Geometry/Extrude` node from `session.liveGraph.liveExtrudeNodeId`
  - preserve the current live profile edges already synchronized by 3.5A/3.5B/3.5C
  - write durable params onto the live node:
    - `depthMm: session.depth`
    - `extrudeType: 'Body'`
    - `extrudeDirection: 'OneSide'`
    - `bodyGenerationMode: 'NewObjects'`
    - `taperAngleDeg: 0`
  - clear `extrudeCommandSession`
  - clear command-owned viewport profile preselection/hover if it would otherwise leave stale blue selection after accept
  - return or record a committed summary using `commitReadyGraphCommandPlan(...)`
- summary shape guidance:
  - `createdNodeIds` includes the live Extrude node only when `session.liveGraph.createdExtrudeNodeId` is not null
  - `reusedNodeIds` includes the live Extrude node when accepting an existing selected Extrude node
  - `updatedNodeIds` includes the live Extrude node because params are accepted
  - `addedEdgeIds` includes `session.liveGraph.commandOwnedProfileEdgeIds`
  - `removedEdgeIds` includes replaced profile edge ids for reused-node sessions where accept intentionally replaces old profile inputs
- route toolbar `OK` through the new store action
- keep toolbar `Cancel` using the existing rollback action
- keep the 3.5C preview clearing through `extrudeCommandSession === null`
- update tests so:
  - `OK` on a valid new live Extrude session writes params, preserves profile wires, clears session, and returns/records a committed summary with created node, updated node, and added edges
  - `OK` on a reused live Extrude session writes params, keeps the selected existing node, does not restore replaced profile wires, and summarizes reused/updated/added/removed ids
  - `OK` with missing profiles or invalid depth does not accept and leaves rollback-safe state clear or cancelled according to the chosen action contract
  - toolbar `Confirm Extrude` calls the accept action and removes the toolbar/preview after success
  - Cancel still removes a command-created live node and restores reused-node replaced wires
  - focused build/compile behavior sees the accepted `Geometry/Extrude` params and wires as ordinary graph truth
- update Phase 3 checklist and runtime note honestly after implementation

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/commands/extrudeCommandSession.ts` only if a small validation/result helper is useful
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/console/commandCommitContract.ts` only if a tiny helper is needed; prefer using the existing committed/cancelled summary helpers
- `src/app/console/graphCommandAuthoring.ts`
- `src/app/console/graphCommandAuthoring.test.ts` only if the older authoring helper needs summary parity updates
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not expand into Build Path UI, imported STEP face extrusion, boolean variants, taper fidelity, or arrangement-mode UI.

Do not make the viewer preview or toolbar own durable graph mutation. They should dispatch to the store/session owner.

Do not call a create/reuse helper from `OK` if it would create another Extrude node instead of accepting the existing live command node.

#### Verification Shape

```powershell
cmd /c npx vitest run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "Extrude"
cmd /c npx vitest run src/app/components/ViewerHost.test.tsx -t "Extrude command"
cmd /c npx vitest run src/app/console/graphCommandAuthoring.test.ts -t "Extrude"
cmd /c npm run build
```

#### Done Shape

Phase 3.6 is shipped. Toolbar `OK` accepts the live Extrude command node as durable graph truth with depth params and selected profile wires intact, toolbar `Cancel` still rolls back unaccepted command-owned live graph edits, command summaries distinguish committed versus cancelled results, the transient preview/session state clears after accept/cancel, and the Phase 3 Extrude workflow can be described as usable from root command start through profile selection, depth preview, and final accept/cancel.

#### Shipped Code Cut

- Added `acceptExtrudeCommandSession()` to the Spaghetti store.
- Finalized the existing live `Geometry/Extrude` node with durable `depthMm`, `extrudeType`, `extrudeDirection`, `bodyGenerationMode`, and `taperAngleDeg` params.
- Preserved live profile wires created by the 3.5A/3.5B auto-wiring path.
- Auto-wired accepted Extrude nodes from `SolidBody` into the first open `System/OutputPreview` `in:solid:<slotId>` slot when that node is not already published.
- Changed normal profile-driven Extrude starts to create a new `Geometry/Extrude` command node by default, so repeating Extrude on the same profile creates a second operation instead of editing the prior accepted node.
- Returned committed/cancelled graph command summaries for accept attempts.
- Wired the viewport toolbar `OK` button to the store-owned accept action.
- Added focused store and toolbar proof for new live-node accept, reused live-node accept, invalid accept rejection, preview/session clearing, and Cancel rollback preservation.

## [x] `Spaghetti-Editor 8 / Phase 4` - `Build Path Projection Handoff`

### Phase 4 Summary

Define the handoff from accepted graph command commits into later `Build Path` history rows.

Current status: shipped. This phase added and tested the Spaghetti-side projection shape that later Build Path phases can consume from accepted graph-command summaries.

This is not the full Build Path implementation. It is the Spaghetti-side contract that makes Build Path possible without duplicating graph truth, command params, wires, node state, preview meshes, worker checkpoints, or restore/branch semantics.

### Phase 4 Implementation Spec

Implementation target:
- create a small Build Path projection contract beside the command-commit contract, likely under `src/app/console/` or a nearby graph-command owner
- consume accepted `GraphCommandCommitSummary` values from Phase 1/2/3
- emit Build Path-ready projection records that describe graph-authored changes without copying graph truth
- keep projection records stable enough for later Build Path/Worker phases to read, but small enough to avoid pretending history replay is already implemented

Suggested first projection shape:
- `projectionId`
  - deterministic or caller-supplied id for the projected command entry
- `graphDocumentId`
  - owning graph document
- `commandFamily`
  - `Sketch`
  - `Extrude`
  - later `Loft`, `Fillet`, `Boolean`, and other feature commands
- `entryPoint`
  - console root
  - viewport shortcut
  - viewport toolbar
  - feature assist
- `graphMutationSummary`
  - created node ids
  - reused node ids
  - updated node ids
  - added edge ids
  - removed edge ids
- `affectedGraphIds`
  - graph document id
  - touched node ids
  - touched edge ids
  - optional output ids where a later accepted build/result link is available
- `buildResultState`
  - `pending`
  - `linked`
  - `unavailable`
- optional friendly row label derived from command family and graph ids

Implementation-ready first cut:
- add a pure projection helper such as `projectGraphCommandCommitForBuildPath`
- accept only committed command summaries; cancelled summaries should project to `null` or an explicit skipped result
- require `graphDocumentId` from the command owner/caller instead of inferring it from current UI state
- preserve created/reused/updated node ids and added/removed edge ids exactly as graph-authored ids
- create friendly row labels only as presentation hints; they must not become identity or truth
- add tests for:
  - Sketch created-node projection
  - Sketch reused-node projection
  - Extrude created-node plus profile-wire projection
  - cancelled command summaries not becoming Build Path rows
  - graph document id staying explicit
  - projection preserving ids without reading live graph state

Likely ownership surfaces:
- `src/app/console/commandCommitContract.ts`
  - existing accepted/cancelled graph-command summary source
- `src/app/console/graphCommandAuthoring.ts`
  - current Sketch/Extrude graph-authoring owner that produces summaries
- new focused helper file, likely `src/app/console/buildPathProjection.ts`
  - pure Build Path projection contract over committed graph summaries
- `src/app/console/buildPathProjection.test.ts`
  - focused proof that Spaghetti-side command summaries can become Build Path-ready records
- `docs/Human-Plans/Architecture/Build-Path/build-path-index.md`
  - relationship note if the projection shape affects the Build Path family read

Build Path should later read these projected summaries as rows, but Spaghetti remains the graph-topology owner.

Readiness notes from earlier phases:
- Phase 1 already introduced committed/cancelled command summaries
- Phase 2 already made Sketch graph authoring produce committed summaries
- Phase 3 first slice already made Extrude graph authoring able to produce committed summaries for selected profile wires
- Phase 3 viewport toolbar/profile-pick UI is still partial, so Phase 4 should not assume there is a complete user-facing Extrude workflow yet

Hard rules:
- Build Path rows should point back to real graph nodes or accepted graph commits
- Build Path should not own a separate copy of node params or wires
- command-history labels can be friendly, but their source must be graph-authored change truth
- restore, branch, and scrub behavior remain Build Path family work, not this phase
- worker checkpoint, replay, cache, and accepted-result storage remain Build Path/Worker family work
- do not infer command history by diffing live graph state after the fact when an accepted command summary is available
- do not create a hidden viewport-history model parallel to Spaghetti graph truth
- do not require Phase 3's visible Extrude toolbar to be complete before this projection contract can be unit-tested

Acceptance read:
- [x] a later Build Path phase can consume accepted graph command summaries without reverse-engineering from viewport state
- [x] the same model can be understood as both a graph and a command history
- [x] no new hidden geometry source is introduced between viewport commands and graph truth
- [x] cancelled commands do not become Build Path history rows
- [x] projected rows preserve graph ids and graph mutation summaries without copying params or geometry
- [x] Phase 4 leaves timeline UI, scrubbing, restore, branch, worker checkpoints, and cache replay out of scope

### Phase 4 Runtime Note

The shipped slice added:
- `src/app/console/buildPathProjection.ts`
  - pure Build Path projection helper over `GraphCommandCommitSummary`
  - committed summaries become projection records
  - cancelled summaries project to `null`
  - graph document id is explicit caller input
  - node ids, edge ids, optional output ids, command family, entry point, row label, and build result state are preserved in a Build Path-ready shape
- `src/app/console/buildPathProjection.test.ts`
  - Sketch created-node projection
  - Sketch reused-node projection
  - Extrude created-node plus profile-wire projection
  - cancelled command skip behavior
  - explicit graph document id and graph-id preservation

This remains intentionally projection-only. Build Path workspace UI, timeline scrubbing, restore/branch behavior, worker-owned accepted history storage, checkpoints, replay, and cache handles belong to later Build Path and Worker phases.

## [x] `Spaghetti-Editor 8 / Phase 5` - `Background Node Layout And Arrangement Modes`

### Phase 5 Summary

Define how automatically authored nodes should be placed in the Spaghetti editor.

Current status: shipped. The first slice created a pure placement planner for command-created nodes so later viewport-first commands can place background-authored graph work readably without silently rearranging the user's manual layout.

This phase exists because viewport-first modeling will create graph work that the user did not manually place. The editor needs to make that background work readable by default.

### Phase 5 Implementation Spec

Implementation target:
- add a small pure placement planner for command-created graph nodes
- keep placement planning separate from React canvas/UI code
- consume only graph ids, existing node positions, graph edges, and the command-created node ids supplied by the command owner
- return proposed positions that the graph creation/update caller can apply through existing graph/node-position commands
- leave full arrangement modes and arrangement UI out of this implementation slice

Suggested owner:
- new focused helper under `src/app/spaghetti/layout/`, such as `commandNodePlacement.ts`
- focused tests in `src/app/spaghetti/layout/commandNodePlacement.test.ts`

Input shape should include:
- existing graph nodes
- existing graph edges
- existing `graph.ui.nodes` positions
- node ids created by the command
- optional strongest upstream node id
- optional downstream/target node id for bridge insertion
- optional command family or placement role:
  - `source`
  - `consumer`
  - `bridge`
  - `output`
- spacing constants with conservative defaults

Output shape should include:
- proposed node positions keyed by node id
- placement reason per node:
  - `downstream-of-upstream`
  - `between-source-and-target`
  - `stacked-repeat`
  - `fallback-lane`
- no graph mutation by itself

Implementation-ready first cut:
- define the planner and types
- use a left-to-right dependency direction by default
- place a consuming node downstream from its strongest upstream source
- place an inserted bridge node between source and target when both positions exist
- place repeated command-created nodes in a deterministic vertical stack/lane instead of overlapping
- use a fallback lane when no upstream or target position exists
- treat nodes with an existing position as user/manual-positioned for this first slice and avoid proposing replacements for them
- add tests for:
  - `Sketch -> Extrude` downstream placement
  - bridge placement between existing source and target
  - repeated command-created nodes receiving deterministic offsets
  - fallback placement when no related node has position truth
  - existing positioned nodes being preserved
  - no graph semantics or edges changing

Later arrangement modes may include:
- `Dependency Flow`
  - show upstream inputs, feature nodes, and outputs as a readable dependency graph
- `Command Flow`
  - arrange nodes in roughly the accepted command order that Build Path will later summarize
- `Compact Chain`
  - focus a selected output and arrange only the nodes needed to explain it
- `Grouped By Output`
  - cluster source and feature nodes around the output or published object they feed
- `Manual`
  - preserve user placement and only use auto-placement for newly added nodes

Hard rules:
- layout and arrangement should not change graph semantics
- automatic layout should not erase manual organization silently
- command-created graph work should be readable immediately after creation
- arrangement modes should be optional presentation or position tools, not separate graph models
- the first pass should solve neat placement for background-created nodes before attempting a full graph-layout engine
- do not infer manual intent from selection state or viewport state in the first slice; preserve any existing stored position
- do not add a new persisted layout layer unless a later arrangement-mode phase explicitly needs it
- do not make Build Path order the only layout order; dependency direction remains the first placement truth

Acceptance read:
- [x] a pure planner can propose readable positions for automatically created `Sketch`, `Extrude`, and output-facing nodes
- [x] inserted bridge nodes can be positioned between source and target without overlapping either
- [x] repeated command-created nodes use deterministic offsets
- [x] nodes with existing stored positions are not silently rearranged
- [x] the first implementation does not mutate graph semantics or own a separate graph model
- [x] a later arrangement-mode feature can build from this contract without changing authored graph truth

### Phase 5 Runtime Note

The shipped slice added:
- `src/app/spaghetti/layout/commandNodePlacement.ts`
  - pure command-created node placement planner
  - downstream placement from strongest upstream node
  - bridge placement between source and target positions
  - deterministic stacking for repeated command-created nodes
  - fallback lane placement when no anchor position exists
  - preservation of nodes that already have stored positions
  - no graph mutation by itself
- `src/app/spaghetti/layout/commandNodePlacement.test.ts`
  - downstream `Sketch -> Extrude` placement proof
  - bridge placement proof
  - repeated-node stack proof
  - fallback lane proof
  - existing-position preservation proof
  - edge-inferred anchor proof that leaves graph semantics untouched

This remains a planner-only foundation. Wiring the planner into concrete command-created node call sites and adding optional arrangement-mode UI belong to later follow-on work.

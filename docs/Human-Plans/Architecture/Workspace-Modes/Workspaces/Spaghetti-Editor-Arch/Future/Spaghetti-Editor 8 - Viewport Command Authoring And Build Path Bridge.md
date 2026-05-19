# Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge

## Doc Header

### Doc History
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
- `Phase 3` has its first runtime slice shipped. Root `Extrude` is now a command entry, the command can start without graph mutation, and the shared graph-authoring owner can commit selected sketch-profile contributors into `Geometry/Extrude`; the visible model-viewport profile picker/toolbar remains the next Phase 3 continuation before Phase 4.
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

Current status: first runtime slice shipped. Root `Extrude` is available from the command root, starts a no-mutation Extrude session prompt, and the shared authoring owner now knows how to commit selected sketch-profile contributors by creating or reusing `Geometry/Extrude` and adding profile wires. The visible model-viewport profile picker/toolbar, selected-count UI, distance editing, and OK/Cancel buttons remain the next Phase 3 continuation before this phase can be closed.

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
- [ ] the model viewport shows an Extrude toolbar/session while extrusion is active
- [ ] Console/session state can represent the staged command tree `Extrude > Select Profiles > Depth`
- [ ] individual sketch profiles can be selected and counted
- [ ] shift-click can select all compatible profiles from the picked sketch
- [ ] selected profiles reveal an extrusion preview/depth step with a drag handle or equivalent first-pass handle state
- [ ] selected profiles plus distance produce either a safe first preview or an explicit valid session state ready for preview follow-up
- [x] the graph-authoring owner can create or reuse `Geometry/Extrude` graph truth and wire selected profiles
- [ ] confirming from the viewport toolbar creates or updates durable graph truth
- [x] starting the command leaves no durable graph mutation from the transient session prompt
- [ ] Phase 4 can later read accepted Extrude command summaries without reverse-engineering viewport state

### Phase 3 Runtime Note

The shipped first slice covers the command and graph-authoring foundation:
- root `extrude` now routes through staged navigation with canonical radio identity `Console.Root.Extrude`
- starting `Extrude` from the root command path clears transient console state, emits an Extrude session prompt, and does not create nodes or wires
- `graphCommandAuthoring` now includes `authorExtrudeGraphCommand`
- `authorExtrudeGraphCommand` cancels before mutation when graph context or profile selection is missing
- committed Extrude authoring can create or reuse a selected `Geometry/Extrude` node and wire selected sketch-profile contributors to `ExtrusionProfile`

Phase 3 remains partial because the user-visible Fusion-style toolbar/picker is not mounted yet. `Phase 3.1` is now the prepared next implementation slice because the visible toolbar should not depend on the current partial-mutation callback order.

The remaining Phase 3 work is now split into dedicated follow-up sections. The intended user-facing flow across those sections is:

```text
Extrude
  -> Select Profiles
    -> Depth
      -> OK / Cancel
```

- `Select Profiles` owns individual profile picks, selected count, and shift-click all-profiles-from-this-sketch behavior.
- `Depth` owns the extrusion preview, typed distance, and viewport drag handle.
- `OK` is the only point where selected profiles plus depth become durable graph truth.

- `Phase 3.1` - shipped atomic Extrude graph commit repair
- `Phase 3.2` - create a real Extrude session owner and Console-visible command tree
- `Phase 3.3` - guard viewport command shortcuts against active modal owners
- `Phase 3.4` - mount the model-viewport Extrude toolbar shell
- `Phase 3.5` - add profile picking, selected count, and preview state
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

## [ ] `Spaghetti-Editor 8 / Phase 3.4` - `Model Viewport Extrude Toolbar Shell`

### Phase 3.4 Summary

Mount the first visible model-viewport Extrude toolbar shell over the real session owner from Phase 3.2.

The toolbar should make the command state visible without committing graph truth by itself.

### Phase 3.4 Implementation Spec

#### Purpose

Give users the visible command surface promised by root `Extrude`:
- selected profile count
- distance control
- active command step read
- default operation read
- OK and Cancel controls

#### Presents / Dispatches

- visible toolbar shell while an Extrude session is active
- visible `Select Profiles` versus `Depth` state read from the session owner
- selected count display, initially `0 selected`, read from the session owner
- distance value display/input that dispatches changes to the session owner
- disabled/enabled visual state for `OK` read from session validation
- active `Cancel` control that dispatches cancellation to the session owner

#### Does Not Own

- profile hit-testing
- live extrusion preview
- commit behavior
- final toolbar styling polish beyond usable first-pass fit

#### Exact First Code Cut

- render the toolbar in the model viewport only while the Extrude session is active
- connect the toolbar to the session owner, not to a local component-only state source
- show the first command-step read from the session tree, even if the first visual version is compact
- make `Cancel` clear the session and leave graph nodes/edges unchanged
- keep `OK` disabled until Phase 3.5/3.6 supplies selected profiles
- add focused render and cancel tests

#### Likely Files

- `src/app/components/ViewerHost.tsx` or the nearest model-viewport overlay host
- new Extrude toolbar component/helper if local patterns support it
- the session owner from Phase 3.2
- focused viewport/component tests
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not implement profile picking, preview geometry, or graph commit in this phase.

#### Verification Shape

```powershell
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "Extrude"
npm.cmd run build
```

## [ ] `Spaghetti-Editor 8 / Phase 3.5` - `Profile Picking Count And Preview State`

### Phase 3.5 Summary

Wire viewport sketch-profile selection into the active Extrude session and open the depth step once the selection is meaningful.

The user should be able to pick individual sketch profiles, shift-click one profile to select all compatible profiles in that sketch, see the selected count update, and then see an honest first depth preview/handle state.

### Phase 3.5 Implementation Spec

#### Purpose

Make the toolbar meaningful by connecting it to selectable graph-authored sketch profiles.

#### Owns

- profile contributor hit-testing or selection handoff for visible authored sketch profiles
- selected/unselected profile state
- shift-click all-compatible-profiles-from-this-sketch behavior
- selected count updates
- transition from `Select Profiles` to `Depth`
- preview validity state
- first depth drag-handle state if the viewer can expose it safely
- optional first preview display if the existing preview pipeline can be reused safely

#### Does Not Own

- imported STEP face picking
- generic planar face extrusion
- boolean operation variants
- final live preview fidelity
- durable graph commit

#### Exact First Code Cut

- expose selectable profile contributors from existing graph-authored sketch/profile data
- let picking one profile select only that profile, not the whole sketch node
- let shift-clicking a profile select all compatible profile contributors from the same sketch
- support multiple compatible selected profiles
- update toolbar count immediately
- move the session to `depth` when at least one profile is selected
- keep the selected profiles editable after entering `depth`
- expose one transient depth value owner shared by numeric entry and the first drag-handle state
- show selected/highlighted profile presentation if the existing viewer selection path can support it
- keep all picks transient until `OK`
- add tests for one profile, shift-click all profiles in one sketch, multiple compatible profiles, depth-step transition, and no whole-sketch fallback

#### Likely Files

- viewport selection/ViewerHost files that already know topology or sketch-profile display
- Extrude session owner
- Extrude toolbar component
- selectors that expose sketch profile contributors
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not commit graph nodes or wires in this phase. The session state should be commit-ready, and depth can be preview/session state, but Phase 3.6 owns acceptance.

#### Verification Shape

```powershell
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "Extrude"
npm.cmd run build
```

## [ ] `Spaghetti-Editor 8 / Phase 3.6` - `Extrude Commit Cancel Proof And Phase 3 Closeout`

### Phase 3.6 Summary

Connect toolbar `OK` and `Cancel` to the atomic graph-authoring owner and close the Phase 3 Extrude workflow.

After this phase, selected profiles plus depth should commit as normal `Geometry/Extrude` graph truth, and cancellation should leave no durable graph mutation.

### Phase 3.6 Implementation Spec

#### Purpose

Finish the first usable viewport-first Extrude command.

#### Owns

- toolbar `OK` commit behavior
- toolbar `Cancel` no-mutation behavior
- durable distance/default operation params
- final depth value handoff from the session owner
- selected profile contributors wired into `ExtrusionProfile`
- committed/cancelled command summaries
- final Phase 3 acceptance and doc closeout read

#### Does Not Own

- final rich preview fidelity
- taper runtime fidelity
- imported STEP face extrusion
- Build Path UI
- arrangement-mode UI

#### Exact First Code Cut

- route `OK` through the atomic owner from Phase 3.1
- validate that at least one profile is selected before commit
- validate that the session has reached the `depth` step or has a valid depth value before commit
- create or reuse `Geometry/Extrude` according to explicit command context
- write durable distance/default operation params
- wire selected profile contributors into the existing `SketchProfiles` / `ExtrusionProfile` graph contract
- clear the transient session after commit or cancel
- emit committed/cancelled command summaries
- prove the Spaghetti editor can show the resulting node and wires
- update Phase 3 checklist and runtime note honestly

#### Likely Files

- Extrude session owner
- Extrude toolbar component
- `src/app/console/graphCommandAuthoring.ts`
- graph command/store helpers used for durable node/wire mutation
- focused viewport/session/graph-authoring tests
- this future doc
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

Do not expand into Build Path UI, imported STEP face extrusion, boolean variants, taper fidelity, or arrangement-mode UI.

#### Verification Shape

```powershell
npm.cmd test -- src/app/console/graphCommandAuthoring.test.ts
npm.cmd test -- src/app/components/ViewerHost.test.tsx -t "Extrude"
npm.cmd run build
```

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

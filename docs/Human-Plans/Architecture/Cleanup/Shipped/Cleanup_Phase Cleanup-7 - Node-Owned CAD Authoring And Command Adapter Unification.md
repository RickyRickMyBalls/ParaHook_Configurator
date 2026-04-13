# Cleanup Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification

## Doc Header

### Doc History
11. 2026-04-13 08:38:44: Closed out `Cleanup 7 - Node-Owned CAD Authoring And Command Adapter Unification` as a shipped cleanup lane by marking the parent record complete after all five internal phases landed, preparing this standalone record for move into `Cleanup/Shipped/`, and repointing the cleanup family index plus the recent live changelog links so the node-owned CAD authoring lane now reads as finished history instead of an in-progress future path
10. 2026-04-13 08:26:39: Completed `Phase 5 - Prove Rehydration And Preview Honesty` as a focused proof-and-verification pass by tightening the node-surface rehydration proof in `NodeView.geometryMode.test.tsx`, tightening the viewport overlay reopen/read-through proof in `ViewportOverlay.test.tsx`, reusing the existing post-`Phase 3` store-owned `createGraphNodeInDocumentAndSelect(...)`, shared `workspaceIntents.ts`, and targeted console continuity proof surfaces, and recording the passing focused tests plus green build without runtime code changes
9. 2026-04-13 08:18:01: Tightened `Phase 5 - Prove Rehydration And Preview Honesty` into an implementation-ready proof-and-verification pass by grounding it in the post-`Phase 3` store-owned `createGraphNodeInDocumentAndSelect(...)` seam, the post-`Phase 4` shared `workspaceIntents.ts` sketch-entry band, the dedicated sketch-template and geometry-mode proof surfaces in `NodeView.test.tsx` plus `NodeView.geometryMode.test.tsx`, the shared review/draw overlay proof in `ViewportOverlay.test.tsx`, and the narrower targeted console/store verification commands that avoid the broader unrelated suite noise outside this cleanup lane
8. 2026-04-13 08:12:42: Completed `Phase 4 - Reduce Cross-Surface Command Adapter Fan-Out` as a focused code-and-verification pass by expanding the shared `workspaceIntents.ts` sketch-entry band with a reusable current-store deps builder plus `startSketchReviewIntent(...)`, repointing `NodeView.tsx` and `ViewportOverlay.tsx` to that shared adapter seam, preserving `useConsoleInteraction.ts` as a consumer of the same intent band, and recording the passing focused surface tests plus green build
7. 2026-04-13 08:00:12: Tightened `Phase 4 - Reduce Cross-Surface Command Adapter Fan-Out` into an implementation-ready code-and-verification pass by grounding it in the live sketch-session entry split where `useConsoleInteraction.ts` already routes through `startSketchPlaneIntent(...)` and `startSketchDrawIntent(...)` in `workspaceIntents.ts` while `NodeView.tsx` plus `ViewportOverlay.tsx` still call store session-start verbs directly, naming the likely shared `WorkspaceIntentDeps` builder seam and the probable follow-on `startSketchReviewIntent(...)` companion so the next pass can unify one honest cross-surface adapter band without widening into full command-library extraction
6. 2026-04-13 07:41:47: Completed `Phase 3 - Tighten One Command-Started Graph Mutation Path` as a focused code-and-verification pass by moving the console-started graph-document targeting, node creation, and active-node selection assembly behind the new store-owned `createGraphNodeInDocumentAndSelect(...)` seam in `useSpaghettiStore.ts`, repointing `ConsoleDock.tsx` to that narrower graph-truth-adjacent handoff, and recording the narrowed passing console/store proof plus green build while preserving the still-unrelated existing failures in the broader console/store verification command as residual repo noise outside this phase
5. 2026-04-13 07:26:37: Tightened `Phase 3 - Tighten One Command-Started Graph Mutation Path` into an implementation-ready code-and-verification pass by grounding it in the live console-started sketch and extrude create-or-enter seam in `ConsoleDock.tsx`, naming the inline graph-targeting helpers `generateUniqueConsoleSketchNodeId(...)` and `buildDefaultCreatedSketchPosition(...)`, preserving `useSpaghettiStore.ts` plus `graphCommands/addNode.ts` as the graph-truth boundary, and narrowing the intended implementation to one honest command-start handoff without widening into broader node-surface or command-library extraction work
4. 2026-04-13 07:24:43: Completed `Phase 2 - Trace Command Adapter Drift` as a docs-and-verification pass by classifying the live mixed node-surface seam in `NodeView.tsx`, the concrete create-or-target command-start flow in `ConsoleDock.tsx`, the staged command grammar router in `useConsoleInteraction.ts`, and the repeated sketch-plane and sketch-draw command-forwarding surface in `ViewportOverlay.tsx` into explicit honest-adapter, acceptable-presentation, compatibility-residue, and owner-like-drift buckets so the cleanup lane now has one locked `Phase 3` command-start target, one locked `Phase 4` adapter-fan-out target, and one explicit set of honest seams to preserve
3. 2026-04-13 07:22:24: Completed `Phase 1 - Reconfirm Node-Owned CAD Truth` as a docs-and-verification pass by re-reading the cleanup and repo-vision owner rules against the live graph-document, graph-command, sketch-plane, and geometry-sketch seams in `useSpaghettiStore.ts` plus the downstream node, console, and viewport adapter surfaces in `NodeView.tsx`, `ConsoleDock.tsx`, `useConsoleInteraction.ts`, and `ViewportOverlay.tsx`, then locking one explicit baseline where spaghetti graph and node state remain the canonical CAD authoring owner while the surrounding command-entry surfaces stay adapters
2. 2026-04-13 07:16:54: Tightened this standalone `Cleanup 7` phase doc into an implementation-ready cleanup lane by aligning it to `Cleanup-Index.md`, `Cleanup-Vision.md`, `Canonical-Ownership-Targets.md`, `Canonical-Owner-Decisions.md`, `docs/Vision.md`, `docs/Human-Plans/roadmap/Vision-roadmap.md`, and `Nodes-Vision.md`, grounding it in the live `useSpaghettiStore.ts`, `NodeView.tsx`, `ConsoleDock.tsx`, `useConsoleInteraction.ts`, `ViewportOverlay.tsx`, and `graphCommands/` seams while splitting the middle work into separate command-start and cross-surface adapter-fan-out phases so the node-owned CAD authoring lane can be implemented in narrower honest passes before `Cleanup 8`
1. 2026-04-12 20:15: Created this standalone `Cleanup 7` future phase doc to hold the node-owned CAD authoring and command-adapter cleanup lane under the Cleanup family

### Purpose

This doc defines the seventh cleanup phase for the `Cleanup` family.

Use it to answer:
- where durable CAD authoring truth should live as spaghetti node families widen
- how toolbar, console, and viewport command entry should relate to that same truth
- how one command-start and graph-mutation seam should be narrowed before CAD packaging work begins
- how this cleanup lane should be sequenced before `Cleanup 8`

Do not use it for:
- the full authored contract for every CAD node family
- the full command-library extraction and repo packaging work that belongs in `Cleanup 8`
- full smart-wiring rollout planning
- replacing the dedicated `Transform/` architecture family for viewer-owned transform behavior

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface
  - lane ordering and boundary against `Cleanup 8`

- `../Cleanup-Vision.md`
  - cleanup framing for ownership sinks, oversized UI command routers, and adapter drift

- `../Canonical-Ownership-Targets.md`
  - graph document and graph editing-session ownership targets
  - adapter-versus-owner baseline for command surfaces

- `../Canonical-Owner-Decisions.md`
  - one-real-owner baseline

- `../../Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`
  - current node-family and command-entry direction

- `../../../roadmap/Vision-roadmap.md`
  - repo north-star for durable ownership and repeatable future growth

## Doc Body

## [x] Cleanup 7 - Node-Owned CAD Authoring And Command Adapter Unification

### Header

Purpose:
- keep durable CAD authoring truth canonical in spaghetti graph and node state while reducing toolbar, console, and viewport command flows to adapters over that same truth

Owns:
- node-owned CAD authoring truth direction
- command-adapter versus node-owner boundary
- one command-start and graph-mutation path rule for command-driven node edits
- rehydration and preview honesty for CAD authoring surfaces

Does not own:
- the full folder-packaging and command-library extraction plan for CAD families and sketch commands
- the detailed authored contract for every CAD node family
- viewer-only `Transform` behavior that still belongs to the dedicated `Architecture/Transform/` family

### Why This Phase Exists

ParaHook is moving toward a Fusion-style workflow where the user can:
- start a CAD command from the viewport
- use toolbar controls while modeling
- later start the same kind of command from the console

That direction becomes risky if those entry surfaces start acting like hidden owners.

The cleanup rule for this lane is:
- nodes and graph-local authoring sessions own durable CAD truth
- toolbar, console, and viewport tools adapt into that same truth

Without that rule:
- toolbar-local draft models can start competing with node params
- viewport-local interactions can mutate graph state through bespoke side paths
- console command entry can create or target nodes through different ownership assumptions than node-surface entry
- later packaging work in `Cleanup 8` could reorganize around unstable ownership instead of a stable node-owned rule

This phase exists so we can:
1. lock the current owner baseline,
2. classify the real command-adapter drift seams,
3. narrow one command-start and graph-mutation path first,
4. then reduce cross-surface adapter fan-out without widening into packaging work.

### Scope

This phase covers:
- node params, wiring, outputs, graph document state, and graph-local CAD editing sessions as authoring truth
- adapter rules for `NodeView`, console, and viewport command surfaces
- one command-start and graph-mutation path for command-driven node edits
- draft preview versus authoritative result honesty for CAD authoring surfaces

This phase does not cover:
- the full implementation of every `Sketch`, `Extrude`, `Loft`, or later CAD family
- the full repo packaging and command-library extraction plan that belongs in `Cleanup 8`
- the later feature-stack versus graph-native authored-contract convergence that belongs in `Cleanup 8A`
- generic Browser or Console decomposition outside the CAD authoring boundary

### Current Read

The live repo already mostly agrees on the intended owner story, but the command-entry surfaces are still spread across a few large mixed seams.

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns graph document truth, node params, wiring, outputs, graph editing sessions, and graph-local runtime state
  - already defines the main CAD authoring session and command verbs:
    - `applyGraphCommand(...)`
    - `startSketchPlanePick(...)`
    - `runSketchPlaneCommand(...)`
    - `startGeometrySketchSession(...)`
    - `runGeometrySketchDrawCommand(...)`
  - already localizes sketch graph mutation through `updateGeometrySketchNode(...)`
- `src/app/spaghetti/canvas/NodeView.tsx`
  - is already the clearest mixed owner-plus-adapter hotspot
  - reads node params and feature outputs directly
  - opens local toolbar chrome through `toolbarEditorOpen`
  - starts sketch-plane and sketch-draw flows through `startSketchPlanePick(...)` and `startGeometrySketchSession(...)`
  - edits extrude params through `applyGraphCommand(...)`
  - renders managed sketch and extrude UI directly over node truth
- `src/app/console/ConsoleDock.tsx`
  - already acts like a command-entry surface over graph truth
  - can open graph documents, select nodes, create nodes with `addNodeCommand(...)`, and start CAD sessions
  - currently carries a concrete create-or-target flow for sketch and extrude entry
- `src/app/console/useConsoleInteraction.ts`
  - is a large staged command router that translates guided console input into the same store command verbs
  - already routes sketch-plane and sketch-draw commands through `runSketchPlaneCommand(...)` and `runGeometrySketchDrawCommand(...)`
- `src/app/components/ViewportOverlay.tsx`
  - reads sketch-plane and geometry-sketch sessions directly from `useSpaghettiStore`
  - renders draft preview, prompt, and action UI for those sessions
  - also forwards many command actions back into the same store command verbs
- `src/app/spaghetti/graphCommands/`
  - already provides graph command primitives such as `addNode(...)` and `setNodeParams(...)`
  - this is useful, but it is not yet the full answer to cross-surface CAD adapter unification by itself

### Locked Direction

- spaghetti graph documents, node params, node wiring, node outputs, and graph-local CAD editing sessions remain the durable authored truth
- `NodeView`, console, and viewport command surfaces are adapters over the active node and that same graph truth
- command-triggered CAD edits should converge on one canonical command-start and graph-mutation path instead of separate toolbar-only, console-only, or viewport-only write stories
- reopening a CAD surface should rehydrate from active node and graph-session truth rather than from a toolbar-owned or overlay-owned shadow model
- draft preview may be newer than authoritative result truth, but that split must remain explicit and store/runtime-owned rather than command-surface-owned
- node families such as `Sketch`, `Extrude`, `Loft`, and later graph-native `Transform` should all follow the same node-owned authoring rule
- `Cleanup 7` locks the ownership rule first
  - `Cleanup 8` will package around that stable rule
  - `Cleanup 8A` will handle later authored-contract convergence

### Phase Ladder

## [x] Phase 1 - Reconfirm Node-Owned CAD Truth

Purpose:
- lock one explicit current owner baseline for CAD authoring truth before later cleanup starts

Current read:
- `useSpaghettiStore.ts` already shows the intended owner answer in code because graph document state, node params, sketch-plane sessions, geometry-sketch sessions, and graph mutation verbs already live there

Read:
- `Phase 1` should stay a docs-and-verification pass

Locked in-scope:
- restate the canonical owner for:
  - graph documents
  - node params
  - node wiring
  - node outputs
  - graph-local CAD editing sessions
  - graph-local draft preview state tied to those sessions
- make explicit that `NodeView`, console, and viewport command surfaces are downstream adapters rather than owners
- name the main `Phase 2` hotspot candidates

Locked out-of-scope:
- changing runtime code
- packaging node families
- extracting a shared command library

Strongest live repo seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/graphCommands/index.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`

Initial owner-baseline anchors:
- canonical owner surface:
  - `useSpaghettiStore.ts`
- canonical graph mutation seam:
  - `applyGraphCommand(...)`
  - `updateGeometrySketchNode(...)`
- canonical CAD command-session entry seams:
  - `startSketchPlanePick(...)`
  - `runSketchPlaneCommand(...)`
  - `startGeometrySketchSession(...)`
  - `runGeometrySketchDrawCommand(...)`
- main downstream adapters to inventory next:
  - `NodeView.tsx`
  - `ConsoleDock.tsx`
  - `useConsoleInteraction.ts`
  - `ViewportOverlay.tsx`

Implementation spec:
1. Re-read the cleanup family direction and owner-decision docs.
2. Re-read the repo vision guidance that canonical truth should stay in one owner and command/UI surfaces should stay adapters.
3. Re-scan the live owner seams in the files above.
4. Write one explicit baseline that answers:
   - which CAD authoring fields are canonical in graph and node state
   - which graph-local session fields are canonical while authoring is active
   - which UI surfaces are adapters only
   - which nearby seams should be treated as the main `Phase 2` hotspot candidates
5. Stop once `Phase 2` can inventory drift against that locked baseline.

Stop rule:
- do not widen this into code cleanup or packaging work

Checklist:
- [x] re-read cleanup family direction and owner-decision docs
- [x] re-read repo vision rules for one canonical owner and adapter surfaces
- [x] scan live CAD owner and command-entry seams
- [x] write one explicit node-owned CAD baseline
- [x] make `NodeView`, console, and viewport adapter status explicit
- [x] identify the main `Phase 2` hotspot seams without fixing them yet
- [x] stop before code edits

Verification:
- manually confirm in source that graph documents, node params, wiring, outputs, and CAD editing sessions still localize to `useSpaghettiStore.ts`
- manually confirm `NodeView.tsx`, `ConsoleDock.tsx`, `useConsoleInteraction.ts`, and `ViewportOverlay.tsx` read as readers and command-entry surfaces over that truth rather than competing owners

Node-owned CAD authoring baseline:
- canonical owner:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- canonical truth:
  - graph documents and active graph editing state
  - node params
  - node wiring and topology
  - node outputs and authored feature outputs
  - `sketchPlanePickSession`
  - `geometrySketchSession`
  - graph-local sketch-plane draft transform and command-scope state
  - graph-local geometry-sketch draft, hover, selection, and review state
- canonical mutation path:
  - `applyGraphCommand(...)` remains the graph-command entry seam for direct graph mutations
  - `updateGeometrySketchNode(...)` remains the store-local graph mutation helper for managed sketch feature edits
  - `startSketchPlanePick(...)`, `runSketchPlaneCommand(...)`, `startGeometrySketchSession(...)`, and `runGeometrySketchDrawCommand(...)` remain the canonical CAD session-command boundary
- supporting mutation helpers:
  - `src/app/spaghetti/graphCommands/` provides reusable graph command primitives such as `addNode(...)` and `setNodeParams(...)`
  - those helpers support graph mutation
  - they do not create a second CAD authoring owner outside the store boundary
- downstream adapter surfaces:
  - `NodeView.tsx`
  - `ConsoleDock.tsx`
  - `useConsoleInteraction.ts`
  - `ViewportOverlay.tsx`
- acceptable local presentation state:
  - `toolbarEditorOpen` in `NodeView.tsx`
  - console assist and staged-navigation shaping in `ConsoleDock.tsx` and `useConsoleInteraction.ts`
  - overlay panel openness and view-local interaction chrome in `ViewportOverlay.tsx`
  - these may shape or present command entry
  - they do not become durable CAD truth owners

Implementation result:
- `useSpaghettiStore.ts` remains the canonical owner for graph documents, node params, node wiring, node outputs, and the active sketch-plane plus geometry-sketch authoring sessions.
- `applyGraphCommand(...)` and `updateGeometrySketchNode(...)` remain the main graph mutation seams for CAD authoring instead of toolbar-local, console-local, or overlay-local write paths.
- `startSketchPlanePick(...)`, `runSketchPlaneCommand(...)`, `startGeometrySketchSession(...)`, and `runGeometrySketchDrawCommand(...)` remain the store-owned command boundary for live CAD authoring sessions.
- `NodeView.tsx` still reads as a node-surface adapter over store-owned truth, even though it remains a mixed hotspot because it combines local toolbar chrome, node read-through, and command-session entry.
- `ConsoleDock.tsx` and `useConsoleInteraction.ts` still read as console command-entry adapters over store-owned truth rather than as competing CAD owners.
- `ViewportOverlay.tsx` still reads as a viewport adapter over store-owned sketch-plane and geometry-sketch sessions rather than as a durable authoring owner.
- the main `Phase 2` hotspots are now locked as:
  - mixed node-surface adapter hotspot:
    - `NodeView.tsx`
  - concrete create-or-target command-start hotspot:
    - `ConsoleDock.tsx`
  - staged command grammar router hotspot:
    - `useConsoleInteraction.ts`
  - repeated viewport command-forwarding hotspot:
    - `ViewportOverlay.tsx`

Target output:
- one explicit node-owned CAD authoring baseline with the next hotspot seams named

## [x] Phase 2 - Trace Command Adapter Drift

Purpose:
- inventory where toolbar, console, or viewport command entry still behaves like a hidden owner instead of an adapter

Current read:
- `NodeView.tsx` mixes local toolbar chrome, node-owned sketch and extrude render/edit UI, and command-session starts in one large component
- `ConsoleDock.tsx` owns a concrete create-or-target flow that can open a graph document, apply `addNodeCommand(...)`, select the new node, and enter sketch or extrude-related flows
- `useConsoleInteraction.ts` maps a large staged grammar into the same sketch-plane and sketch-draw store verbs
- `ViewportOverlay.tsx` reads live sketch-plane and geometry-sketch sessions directly and mirrors a large action surface over those same store verbs

Read:
- `Phase 2` should stay a docs-and-verification hotspot-inventory pass

Locked in-scope:
- classify the live command-adapter seams into:
  - honest adapter reads
  - acceptable presentation-only state
  - compatibility residue
  - owner-like drift
- name the most important command-start seam for `Phase 3`
- name the most important cross-surface adapter fan-out seam for `Phase 4`

Locked out-of-scope:
- code changes
- broad file extraction
- packaging decisions for CAD family folders or command-library homes

Strongest live repo seams:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`
- `src/app/spaghetti/graphCommands/setNodeParams.ts`

Initial hotspot anchors:
- node-surface mixed adapter hotspot:
  - `NodeView.tsx`
  - local `toolbarEditorOpen`
  - sketch-plane start and sketch-session start entry
  - direct extrude param write path through `applyGraphCommand(...)`
- console command-start hotspot:
  - `ConsoleDock.tsx`
  - `openGraphDocumentInViewport(...)`
  - `setSelectedNodeId(...)`
  - `addNodeCommand(...)`
  - `startSketchPlanePick(...)`
  - `startGeometrySketchSession(...)`
- console grammar router hotspot:
  - `useConsoleInteraction.ts`
  - `runSketchPlaneCommand(...)`
  - `runGeometrySketchDrawCommand(...)`
- viewport adapter hotspot:
  - `ViewportOverlay.tsx`
  - live sketch-plane and geometry-sketch session reads
  - repeated command forwarding through `runSketchPlaneCommand(...)` and `runGeometrySketchDrawCommand(...)`

Implementation spec:
1. Re-scan the files above against the locked node-owned baseline.
2. Classify the live seams into honest adapter, acceptable presentation, compatibility residue, and owner-like drift buckets.
3. Lock one concrete `Phase 3` target that narrows a real command-start and graph-mutation seam.
4. Lock one concrete `Phase 4` target that reduces cross-surface command-adapter fan-out without widening into packaging cleanup.
5. Preserve clearly honest seams rather than treating every repeated read as a cleanup problem.

Stop rule:
- do not implement code changes yet

Checklist:
- [x] rescan the live command-adapter seams
- [x] classify hotspots into explicit bucket types
- [x] name the main command-start target for `Phase 3`
- [x] name the main cross-surface adapter target for `Phase 4`
- [x] call out honest seams to preserve
- [x] stop before code edits

Verification:
- manually confirm the bucket inventory matches live source instead of aspirational architecture
- manually confirm the selected `Phase 3` and `Phase 4` targets are narrower than full CAD packaging work

Command-adapter drift inventory:
- honest adapter reads:
  - `NodeView.tsx` reading `node.params`, managed sketch outputs, and active store sessions for the node
  - `ConsoleDock.tsx` reading `sketchPlanePickSession` and `geometrySketchSession` to shape feature assist and status output
  - `useConsoleInteraction.ts` reading store sessions to route typed commands into the existing store-owned verbs
  - `ViewportOverlay.tsx` reading active sketch-plane and geometry-sketch sessions to render live prompt, preview, and tool UI
- acceptable presentation-only state:
  - `toolbarEditorOpen` in `NodeView.tsx`
  - console assist descriptors, staged-navigation session shaping, and input-prefill logic in `ConsoleDock.tsx` and `useConsoleInteraction.ts`
  - overlay expansion density, tool-panel openness, and other viewport-local chrome in `ViewportOverlay.tsx`
  - these are local UX state and read-through shaping rather than durable CAD truth
- compatibility residue:
  - direct `setNodeParamsCommand(...)` use in `NodeView.tsx` for extrude parameter edits while other CAD edits use store-local session verbs and managed-sketch mutation helpers
  - `ConsoleDock.tsx` open-or-focus and active-node handoff behavior around command-started node creation
  - repeated direct `useSpaghettiStore.getState()` pulls in `useConsoleInteraction.ts` while translating typed command grammar into store-owned sketch verbs
  - duplicated sketch-plane stage reselection and command-forwarding affordances in `ViewportOverlay.tsx`
- owner-like drift:
  - `ConsoleDock.tsx` inline create-or-target flow that resolves the active graph document, applies `addNodeCommand(...)`, chooses the new node identity and position, reselects the node, and enters the next CAD session
  - `NodeView.tsx` remaining as one mixed node-surface hotspot where node read-through, local toolbar chrome, direct extrude param writes, and CAD session entry all meet
  - `useConsoleInteraction.ts` broad staged grammar routing that repeatedly interprets sketch-plane and sketch-draw command context inline
  - `ViewportOverlay.tsx` broad repeated command-entry surface over the same sketch-plane and sketch-draw session vocabulary

Honest seams to preserve:
- `useSpaghettiStore.ts` as the canonical owner for graph documents, node params, node outputs, and active CAD sessions
- `applyGraphCommand(...)` as the direct graph-command seam
- `updateGeometrySketchNode(...)` as the managed sketch mutation helper
- `startSketchPlanePick(...)`, `runSketchPlaneCommand(...)`, `startGeometrySketchSession(...)`, and `runGeometrySketchDrawCommand(...)` as the store-owned CAD session-command boundary
- `graphCommands/` primitives as support for graph mutation rather than as a parallel CAD owner

Implementation result:
- the live repo still reads as one canonical owner plus several large adapter surfaces rather than as several competing durable owners.
- `NodeView.tsx` is now locked as the main mixed node-surface adapter hotspot, but not the first implementation target, because its current sprawl is real while the higher-leverage command-start seam is still in console entry.
- `ConsoleDock.tsx` is now locked as the `Phase 3` target because it carries the clearest concrete owner-like create-or-target flow for command-started sketch and extrude entry.
- `useConsoleInteraction.ts` and `ViewportOverlay.tsx` together define the main `Phase 4` fan-out seam because both repeatedly shape and forward the same sketch-plane and sketch-draw command vocabulary over store-owned sessions.
- the direct `setNodeParamsCommand(...)` path in `NodeView.tsx` is now explicitly carried as compatibility residue to keep in view while avoiding an over-wide `Phase 3`.
- the cleanup lane now has:
  - one locked `Phase 3` target:
    - narrow the console-started sketch and extrude create-or-enter path in `ConsoleDock.tsx`
  - one locked `Phase 4` target:
    - reduce repeated sketch-plane and geometry-sketch command shaping across `useConsoleInteraction.ts` and `ViewportOverlay.tsx`

Target output:
- one explicit hotspot inventory with a locked `Phase 3` target and a locked `Phase 4` target

## [x] Phase 3 - Tighten One Command-Started Graph Mutation Path

Purpose:
- make one concrete CAD command-start flow converge on one canonical graph-targeting and mutation path shared by command-entry surfaces

Current read:
- `ConsoleDock.tsx` currently contains the clearest concrete command-start seam because it can:
  - resolve or open the target graph document through `openGraphDocumentInViewport(...)`
  - synthesize node identity through `generateUniqueConsoleSketchNodeId(...)`
  - synthesize placement through `buildDefaultCreatedSketchPosition(...)`
  - apply `addNodeCommand(...)` through `applyGraphCommand(...)`
  - hand off active-node targeting through `setSelectedNodeId(...)`
  - enter the next CAD session through `startSketchPlanePick(...)` or `startGeometrySketchSession(...)`
- `NodeView.tsx` already starts sketch-plane and sketch-draw flows for an existing node
- `useSpaghettiStore.ts` already owns the graph mutation and session verbs those surfaces should compose over
- `graphCommands/addNode.ts` already provides the graph-command primitive for node creation

Read:
- `Phase 3` should be a narrow code-and-verification pass

Locked in-scope:
- one real command-start flow
- active-node targeting
- graph-document targeting
- create-or-select behavior
- one canonical handoff into graph mutation and CAD session start
- keeping the chosen seam narrow enough that `Phase 4` can still focus on cross-surface command vocabulary fan-out

Locked out-of-scope:
- full command-library extraction
- broad `NodeView.tsx` splitting
- broad console staged-navigation redesign
- packaging CAD families into new folders
- changing the direct extrude param write path in `NodeView.tsx`

Likely first target seam:
- the console-started sketch and extrude creation-and-enter path in `ConsoleDock.tsx`

Strongest live repo seams:
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`

Initial target anchors:
- console-local command-start assembly:
  - `generateUniqueConsoleSketchNodeId(...)`
  - `buildDefaultCreatedSketchPosition(...)`
  - the inline create-or-enter flow near `addNodeCommand(...)`
- store-owned graph/session boundary:
  - `applyGraphCommand(...)`
  - `openGraphDocumentInViewport(...)`
  - `setSelectedNodeId(...)`
  - `startSketchPlanePick(...)`
  - `startGeometrySketchSession(...)`

Preferred implementation shape:
- keep graph truth and mutation close to `useSpaghettiStore.ts`
- extract or define one honest helper or action seam that owns:
  - target graph document resolution
  - node create-or-select behavior
  - active-node selection handoff
  - session start handoff
- keep `ConsoleDock.tsx` responsible for console UX and command grammar, not for reconstructing the owner-like create-or-target flow inline
- repoint the chosen command-entry surface to that seam instead of letting it reassemble the flow inline

Implementation spec:
1. Start from the locked `Phase 2` target.
2. Start with the inline console create-or-enter path that currently:
   - opens the graph document
   - chooses node identity
   - chooses default placement
   - creates the node
   - retargets selection
   - enters the next session
3. Move that owner-like targeting and mutation assembly behind one graph-truth-adjacent seam.
4. Repoint `ConsoleDock.tsx` to compose over that seam.
5. Keep `graphCommands/` primitives and store session verbs intact unless a tiny supporting helper is needed.
6. Verify with focused console, store, and graph-command tests plus `cmd /c npm.cmd run build`.

Stop rule:
- stop once one command-start path is clearly canonical
- do not widen into full command-library or packaging work

Checklist:
- [x] lock one concrete command-start target
- [x] anchor the implementation in the current inline console create-or-enter path
- [x] move owner-like targeting and mutation logic behind one canonical seam
- [x] repoint the chosen command-entry surface
- [x] keep graph truth canonical in store and graph command seams
- [x] verify with targeted tests and build

Recommended file changes:
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`
- one small new helper under `src/app/spaghetti/` only if it keeps ownership clearer

Verification:
- `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx src/app/spaghetti/store/useSpaghettiStore.test.ts src/app/spaghetti/graphCommands/graphCommands.test.ts`
- `cmd /c npm.cmd run build`

Implementation result:
- `useSpaghettiStore.ts` now owns the console-started graph-document targeting, default node-id generation, default node placement, graph mutation, and active-node selection handoff through `createGraphNodeInDocumentAndSelect(...)` instead of leaving that flow reconstructed inline in `ConsoleDock.tsx`.
- `ConsoleDock.tsx` now reads more honestly as a command-entry adapter: it asks the store to create-and-select the requested node, then keeps only the console-facing staged-navigation continuation and workspace-intent activation needed to move the user into the selected graph/node context.
- `graphCommands/addNode.ts` remains the graph-command primitive under the new seam rather than being bypassed by a console-local write path.
- Focused proof now exists in `useSpaghettiStore.test.ts` for the new store seam plus the existing console create-and-continue tests in `ConsoleDock.test.tsx` for empty sketch and extrude scopes.
- The full phase verification command still reports unrelated existing failures outside this phase:
  - object-local zoom expectations in `ConsoleDock.test.tsx`
  - Output Preview normalization expectations in `useSpaghettiStore.test.ts`
- The changed-seam targeted tests passed and `cmd /c npm.cmd run build` passed.

Target output:
- one command-start flow no longer reassembles node targeting and graph mutation ownership inline

Done shape:
- one command-entry surface reads as a true adapter over node-owned graph truth
- node creation, selection, and session-start handoff no longer depend on bespoke inline owner logic in that surface
- the resulting seam is narrow enough that `Phase 4` can still focus on shared sketch command vocabulary shaping instead of reopening command-start ownership

## [x] Phase 4 - Reduce Cross-Surface Command Adapter Fan-Out

Purpose:
- reduce repeated cross-surface CAD command-adapter logic after one command-start path is canonical

Current read:
- `useConsoleInteraction.ts` already routes console-side sketch-session entry through the shared `workspaceIntents.ts` helpers `startSketchPlaneIntent(...)` and `startSketchDrawIntent(...)`
- `NodeView.tsx` still starts the same sketch-plane and sketch-draw sessions by calling `startSketchPlanePick(...)` and `startGeometrySketchSession(...)` directly
- `ViewportOverlay.tsx` still mixes repeated session-entry shaping through direct `startGeometrySketchSession(nodeId, 'review' | 'draw')` calls while also forwarding deeper sketch-plane and sketch-draw commands through the same store-owned command verbs
- that means the cleanest remaining fan-out is no longer the raw store verbs themselves; it is the repeated cross-surface session-entry and retarget preparation that still bypasses the existing shared intent band

Read:
- `Phase 4` should be a narrow code-and-verification pass, not a packaging pass

Locked in-scope:
- one honest shared sketch-session entry adapter seam
- cross-surface reuse for sketch-plane, sketch-draw, and likely sketch-review entry shaping
- reducing repeated node-targeting and active-surface preparation across node, console, and viewport surfaces while leaving deeper draw/plane command verbs store-owned

Locked out-of-scope:
- full command-library extraction
- broad UI redesign of `NodeView`, Console, or viewport overlays
- moving all CAD code into new family folders
- rewriting the full sketch-plane or sketch-draw command vocabulary

Likely target seam:
- the split sketch-session entry path where:
  - `useConsoleInteraction.ts` already uses `startSketchPlaneIntent(...)` and `startSketchDrawIntent(...)`
  - `NodeView.tsx` still enters sketch sessions directly through store verbs
  - `ViewportOverlay.tsx` still enters draw/review directly through store verbs

Strongest live repo seams:
- `src/app/store/workspaceIntents.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`

Initial target anchors:
- existing shared intent helpers:
  - `startSketchPlaneIntent(...)`
  - `startSketchDrawIntent(...)`
- likely companion seam to add if needed:
  - one `startSketchReviewIntent(...)` or equivalently named review-entry helper near the same ownership band
- current shared-deps construction hotspot:
  - `buildWorkspaceIntentDepsFromStoreState()` in `ConsoleDock.tsx`
- direct session-entry callers to repoint:
  - sketch-plane entry in `NodeView.tsx`
  - sketch-draw entry in `NodeView.tsx`
  - draw/review re-entry in `ViewportOverlay.tsx`

Preferred implementation shape:
- expand the existing `workspaceIntents.ts` band instead of inventing a second helper family somewhere else
- extract one honest shared `WorkspaceIntentDeps` builder or adjacent intent-preparation seam so non-console surfaces can reuse the same graph-targeting and active-surface prep
- keep store-owned sessions and graph mutation in `useSpaghettiStore.ts`
- keep surface-specific rendering and local chrome in the surface files
- avoid inventing a new shadow owner in the name of reuse

Implementation spec:
1. Start from the locked `Phase 2` fan-out target.
2. Start from the existing shared console-side intent band in `workspaceIntents.ts` instead of creating a new abstraction family.
3. Extract the smallest reusable `WorkspaceIntentDeps` construction seam needed so non-console surfaces can call the same entry intents honestly.
4. Add the smallest missing companion helper if review-mode entry still lacks an honest shared home.
5. Repoint `NodeView.tsx` and the matching `ViewportOverlay.tsx` draw/review entry points to the shared intent band while preserving their local rendering and chrome differences.
6. Verify with focused surface tests and `cmd /c npm.cmd run build`.

Stop rule:
- stop after one honest shared adapter seam lands
- do not widen into broad repo-shape cleanup

Checklist:
- [x] lock one concrete adapter fan-out target
- [x] anchor the implementation in the existing `workspaceIntents.ts` sketch-entry band
- [x] extract one honest shared deps-or-intent seam
- [x] repoint the relevant non-console surfaces to that seam
- [x] keep rendering-local state local and graph truth store-owned
- [x] verify with targeted tests and build

Recommended file changes:
- `src/app/store/workspaceIntents.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewportOverlay.tsx`
- one small shared helper adjacent to `workspaceIntents.ts` only if it keeps the deps-builder ownership clear

Verification:
- `cmd /c npm.cmd test -- src/app/store/workspaceIntents.test.ts src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "creates a sketch node when graph sketch scope is empty and continues into that sketch"`
- `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "creates an extrude node when graph extrude scope is empty and continues into that node"`
- `cmd /c npm.cmd run build`

Implementation result:
- `workspaceIntents.ts` now carries one reusable current-store `WorkspaceIntentDeps` builder plus a shared `startSketchReviewIntent(...)` companion beside the existing `startSketchPlaneIntent(...)` and `startSketchDrawIntent(...)` seams, so sketch session entry preparation lives in one honest adapter band instead of being partially reconstructed per surface.
- `NodeView.tsx` now enters sketch-plane and sketch-draw flows through that shared intent band rather than calling store session-start verbs directly, while preserving node-local rendering and sketch-parameter UI in place.
- `ViewportOverlay.tsx` now re-enters sketch review and sketch draw through the same shared intent helpers instead of shaping those entry transitions inline against store verbs.
- `ConsoleDock.tsx` now builds the same workspace-intent deps through the shared `workspaceIntents.ts` builder while `useConsoleInteraction.ts` keeps the existing console command grammar and remains a consumer of the same intent band rather than a competing owner.
- Focused proof now exists in `workspaceIntents.test.ts`, `NodeView.geometryMode.test.tsx`, and `ViewportOverlay.test.tsx`, and the previously narrowed console create-and-continue tests still pass against the shared deps-builder path.
- `cmd /c npm.cmd run build` passed after the repoint.

Target output:
- one shared CAD command-adapter seam that reduces repeated cross-surface logic without re-owning graph truth

Done shape:
- node, console, and viewport command surfaces still feel different where they should
- but they no longer each carry their own owner-like session-entry interpretation of the same CAD command story

## [x] Phase 5 - Prove Rehydration And Preview Honesty

Purpose:
- prove that command surfaces can close and reopen without losing truth because the node and graph session remain the canonical source

Current read:
- the repo now has the main ownership seams in place:
  - `useSpaghettiStore.ts` owns graph-local node creation and session truth
  - `createGraphNodeInDocumentAndSelect(...)` proves the `Phase 3` command-start narrowing
  - `workspaceIntents.ts` now carries the shared sketch entry band for plane, draw, and review entry
  - `NodeView.tsx`, `ConsoleDock.tsx`, `useConsoleInteraction.ts`, and `ViewportOverlay.tsx` now read more honestly as adapters over that truth
- the main remaining work is proof, not more runtime cleanup
- the strongest post-`Phase 4` proof surfaces are now narrower than the broad full suites:
  - `workspaceIntents.test.ts`
  - targeted `ConsoleDock.test.tsx` create-and-continue cases
  - `ViewportOverlay.test.tsx`
  - `NodeView.test.tsx`
  - `NodeView.geometryMode.test.tsx`

Read:
- `Phase 5` should stay a proof-and-verification pass

Locked in-scope:
- toolbar and node-surface rehydration from active node truth
- console command-entry continuity over canonical sessions
- viewport overlay read-through over canonical sessions
- explicit draft-preview versus authoritative result honesty

Locked out-of-scope:
- new runtime cleanup
- broad store decomposition
- packaging cleanup
- widening back into the broad unrelated console/store suite failures outside this cleanup lane

Primary proof surfaces:
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `createGraphNodeInDocumentAndSelect(...)` graph-owned node targeting and create-and-select truth
- `src/app/store/workspaceIntents.test.ts`
  - shared sketch-entry intent truth for draw/review entry over current store state
- `src/app/console/ConsoleDock.test.tsx`
  - targeted command-entry continuity and graph-node targeting proof for empty sketch and extrude scope entry
- `src/app/components/ViewportOverlay.test.tsx`
  - overlay read-through and shared draw/review command-forwarding proof
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - dedicated sketch template rendering proof for draw/review affordances and managed sketch read-through
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - node-surface rehydration and shared sketch-entry intent proof in geometry mode

Strongest live repo seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/canvas/NodeView.tsx`

Initial target anchors:
- post-`Phase 3` owner seam:
  - `createGraphNodeInDocumentAndSelect(...)`
- post-`Phase 4` shared adapter seam:
  - `buildWorkspaceIntentDepsFromCurrentStoreState()`
  - `startSketchPlaneIntent(...)`
  - `startSketchDrawIntent(...)`
  - `startSketchReviewIntent(...)`
- node-surface proof anchors:
  - `renders the dedicated sketch template with plane-pick control and draw/review actions`
  - `routes Draw through the shared sketch entry intent band`
- viewport proof anchor:
  - `routes Review Profiles and Back To Draw through the shared sketch entry intent band`
- console proof anchors:
  - `creates a sketch node when graph sketch scope is empty and continues into that sketch`
  - `creates an extrude node when graph extrude scope is empty and continues into that node`

Preferred implementation shape:
- add or tighten the smallest tests needed to prove the already-landed owner and adapter seams
- prefer direct proof against store-owned and shared-intent seams over broad snapshot churn or new helper scaffolding
- keep the proof split explicit:
  - store-owned create/select truth
  - shared sketch-entry intent truth
  - node-surface rehydration truth
  - viewport overlay read-through truth
  - console create-and-continue truth
- avoid reopening broad suites that still carry unrelated failures outside this lane unless a targeted proof exposes a real ownership regression

Implementation spec:
1. Start from the locked post-`Phase 3` and post-`Phase 4` owner seams instead of reopening runtime cleanup.
2. Tighten or add the smallest tests needed to prove:
   - node-surface draw/review affordances rehydrate from active node truth
   - console create-and-continue flow still lands in canonical graph/node/session truth
   - viewport overlay review/draw transitions still read through canonical session truth
   - draft-preview versus authoritative-result separation stays explicit
3. Prefer direct proof against the store-owned and shared-intent seams listed above rather than broad snapshot churn.
4. Verify the focused proof surfaces with targeted commands first.
5. Run `cmd /c npm.cmd run build`.

Stop rule:
- this phase is proof only
- do not reopen runtime cleanup unless the tests show a real ownership bug

Checklist:
- [x] prove post-`Phase 3` create-and-select truth remains store-owned
- [x] prove post-`Phase 4` sketch entry still flows through the shared intent band
- [x] prove node-surface rehydration from canonical node truth
- [x] prove console command-entry continuity over canonical sessions
- [x] prove viewport overlay read-through over canonical sessions
- [x] prove draft-preview versus authoritative result honesty stays explicit
- [x] verify with targeted proof commands and build

Recommended file changes:
- `src/app/store/workspaceIntents.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification.md`

Verification:
- `cmd /c npm.cmd test -- src/app/spaghetti/store/useSpaghettiStore.test.ts -t "createGraphNodeInDocumentAndSelect"`
- `cmd /c npm.cmd test -- src/app/store/workspaceIntents.test.ts`
- `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "creates a sketch node when graph sketch scope is empty and continues into that sketch"`
- `cmd /c npm.cmd test -- src/app/console/ConsoleDock.test.tsx -t "creates an extrude node when graph extrude scope is empty and continues into that node"`
- `cmd /c npm.cmd test -- src/app/components/ViewportOverlay.test.tsx`
- `cmd /c npm.cmd test -- src/app/spaghetti/canvas/NodeView.test.tsx -t "renders the dedicated sketch template with plane-pick control and draw/review actions"`
- `cmd /c npm.cmd test -- src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `cmd /c npm.cmd run build`

Target output:
- direct proof that node-owned CAD truth survives close, reopen, retarget, and preview/result transitions without a second hidden owner

Done shape:
- the proof surfaces directly name the post-`Phase 3` store seam and the post-`Phase 4` shared sketch-entry seam
- node, console, and viewport tests collectively prove reopen and retarget behavior against one canonical owner story
- draft preview and authoritative result remain visibly separate in proof without creating a toolbar-only or overlay-only truth model

Implementation result:
- The proof band now directly covers the post-`Phase 3` store-owned `createGraphNodeInDocumentAndSelect(...)` seam, the post-`Phase 4` shared `workspaceIntents.ts` sketch-entry seam, the targeted console create-and-continue continuity path, and the node plus viewport surfaces that reopen over the same canonical session truth.
- `NodeView.geometryMode.test.tsx` now proves the node surface rehydrates `Resume Draw` from the canonical `geometrySketchSession` instead of treating draw state as node-local chrome.
- `ViewportOverlay.test.tsx` now proves the overlay can switch into review, close, reopen, and still read back through the canonical session without reviving the old embedded preview-card ownership shape.
- The existing `useSpaghettiStore.test.ts`, `workspaceIntents.test.ts`, and targeted `ConsoleDock.test.tsx` proofs remain the owner-story anchors for store truth, shared sketch-entry intent truth, and command-entry continuity.
- No runtime code changed in this phase; this was a proof-only pass.

### Acceptance Checks

- CAD authoring truth has one obvious canonical owner in graph document state, node params, node outputs, and graph-local CAD sessions
- toolbar, console, and viewport command surfaces read as adapters rather than hidden owners
- at least one concrete command-start path follows one canonical graph-targeting and mutation route
- repeated cross-surface CAD command-entry logic is reduced through one honest shared seam rather than copied owner logic
- draft preview and stale authoritative-result state stay explicit instead of becoming toolbar-only or overlay-only truth

### Likely Related Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/spaghetti/graphCommands/index.ts`
- `src/app/spaghetti/graphCommands/addNode.ts`
- `src/app/spaghetti/graphCommands/setNodeParams.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`

### Success Read

This phase succeeds when:
- CAD command entry feels viewport-first, toolbar-friendly, and console-friendly without creating a second authoring model
- the active node and graph-local CAD session remain the durable source of truth when command surfaces open, close, and reopen
- later packaging work in `Cleanup 8` can reorganize around a stable ownership rule instead of around current command-surface sprawl

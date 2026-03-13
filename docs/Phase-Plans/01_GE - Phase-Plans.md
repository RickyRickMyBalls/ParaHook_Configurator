# GE - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
21. 2026-03-12 21:32: Added five more `GE - Phase 12C` implementation-prep questions with suggested answers covering the exact first cut, where receive relationships should live, the minimum receive-reference shape, the proof bar, and the out-of-scope line so the later `12C` task doc can be written without drifting into Browser or later publish/receive execution work
20. 2026-03-12 21:27: Added first-pass suggested answers under `GE - Phase 12C` questions `Q1` through `Q4`, so the family doc now carries a concrete proposal for cross-graph `Publish / Receive`, `Link` versus `Hard Copy`, minimum cross-graph identity, and the singleton assumptions that `12C` must stop treating as architecture truth without locking those answers yet
19. 2026-03-11 20:56: Implemented `[1.4B] GE - Phase 12B - Project Content Tree Ownership`, updating the family doc so the four `12B` ownership questions now read as locked instead of suggested, the first-pass component mapping is explicitly tied to resolved graph output entries, and the `12B` checklist now reflects shipped root-assembly, project-content, and thin Browser read-surface ownership
18. 2026-03-11 17:56: Added a `12B` carry-forward caution note under the `Component` suggestion so the family doc now explicitly warns against hard-locking one-component-per-graph granularity too early before the later output-structure work clarifies final grouping
17. 2026-03-11 17:52: Added first-pass suggested answers under `GE - Phase 12B` questions `Q1` through `Q4`, so the family doc now carries a concrete proposal for minimum project content tree shape, first-pass `Component` meaning, project-versus-graph parenting authority, and the explicit `12B` out-of-scope boundary without locking those answers yet
16. 2026-03-11 17:46: Added an explicit `What 12A Left Out` carry-forward block to the `GE - Phase 12` family section so the deferred boundary after the shipped `12A` cut is visible directly in the family doc rather than only in the dedicated `12A` task doc
15. 2026-03-11 17:40: Implemented `[1.4A] GE - Phase 12A - Project File Core And Graph Collection Ownership`, updating the family doc so the first three `12A` ownership questions are now locked rather than only suggested, the `12A` checklist work reads as complete, and the family notes now reflect one real in-memory project-above-graphs model with project-routed graph-aware build requests
14. 2026-03-11 17:08: Added first-pass suggested answers under `GE - Phase 12A` questions `Q1` through `Q3`, so the family doc now carries a concrete proposal for minimum `Project File` shape, project-owned graph collection scope, and durable-versus-runtime state boundaries without locking those answers yet
13. 2026-03-11 17:02: Expanded the future `GE - Phase 12 - Multi-Document Graph Ownership` family section into a real question surface with open `12A` / `12B` / `12C` planning prompts, so the next subphase task docs can be defined against explicit ownership questions instead of only a placeholder summary
12. 2026-03-11 12:23: Added the future `GE - Phase 12 - Multi-Document Graph Ownership` family section so the `GE` family doc now reflects the roadmap carry-forward into fuller project-file, graph-document, and project-content ownership work after `GE - Phase 11`
11. 2026-03-11 00:35: Implemented `GE - Phase 11C - Save/Load Interaction With Editors`, updating the family doc so `11C` now reads as implemented rather than pending after explicit Browser row actions, same-graph multi-viewport editor opens, focused-editor swap/save behavior, and clone-on-load graph copy behavior landed in code
10. 2026-03-10 22:15: Answered the remaining family-level `GE - Phase 11C` editor-action questions using the carry-forward Codex notes, locking the first-pass `Open Graph`, `Load Into New Graph`, `Open In New Editor`, `Swap Current Editor`, save-target, and Browser/editor focus rules in the family doc before implementation
9. 2026-03-10 21:35: Replaced the old Phase 11 family-level `11B` question-lock block with the actual remaining `11C` editor-action decision questions, and updated the Phase 11 current-state notes so the family doc now reflects `11B` as implemented instead of still pending
8. 2026-03-10 00:05: Added the new `GE - Phase 11 - Graph Persistence And Save Load` family section with a dedicated question-lock block for the remaining `11B` / `11C` lifecycle, identity, dirty-state, and editor-action decisions so those answers have one shared family-level surface before implementation
7. 2026-03-08 00:00: Removed the checklist-side `#### Fold Hack 4` wrapper from every `GE` phase while keeping the overview-side fold wrapper, so `Ctrl+4` now opens checklist content directly but still keeps notes and file-footprint sections folded one level deeper
6. 2026-03-08 00:00: Added a `#### Fold Hack 4` wrapper under every `GE` phase `Overview` and `CheckList` so `Ctrl+4` keeps the main phase surface compact while the notes, file-footprint sections, and detailed checklist buckets stay one fold level deeper
5. 2026-03-08 00:00: Cleaned `GE - Phase 1` through `GE - Phase 3` so each phase now keeps one main detailed checklist surface instead of duplicating a short flat checklist above the grouped checklist buckets, and moved Phase 1 file-footprint sections into the notes area to match the newer layout
4. 2026-03-08 00:00: Expanded `GE - Phase 1` through `GE - Phase 3` with grouped high-detail checklist blocks and estimated file-footprint sections compiled from `docs/Archive/History/0 - History-TaskLog.md`, so this family file can act as the main GE checklist surface
3. 2026-03-08 00:00: Re-formatted this file to match the live family phase-plan structure used by `OO - Phase-Plans.md`, adding the fold-oriented header nesting, a single family `##` section, and normalized per-phase `Overview` / `CheckList` buckets without changing the actual GE phase content
2. 2026-03-07 17:06: Folded the remaining clear `GE` checklist detail from `docs/TaskHistoryCompilation.md` into the `GE` family phases, including the `Phases 1-3` foundation split, `Phase 8` runtime-bridge hardening, `Phase 9` graph command kernel, and the early mixed contract/planning carry-forward cluster
1. 2026-03-07 16:36: Built this file as the family-level `GE` phase doc using `docs/CHANGELOG.md` as the primary evidence source and the `OO` family doc as the structure template

##### Purpose

This file is the simple phase-family history document for the `GE` prefix.

Use this file for:
- the canonical `GE` phase sequence
- a simple explanation of what each `GE` phase did
- understanding how the engine/core system work evolved over time
- seeing where major `GE` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `GE` Means

`GE` is the canonical general-engine / core-system prefix.

It is used when the main work is about:
- core architecture direction
- runtime and rebuild rules
- repo/system execution baseline setup
- worker routing and engine behavior
- engine-side contract locking across the core graph/runtime path

##### Format And Depth

Use this file as the planning and checklist home for canonical `GE` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - GE - Phase 1 - `Clean Restart Architecture` - Reconstructed

Human Summary: This reset the project on a cleaner architectural footing and established the early core engine direction that later runtime and editor work were built on top of.



### Phase 1 Overview
#### Fold Hack 4
##### Phase Notes

This is the first confirmed canonical `GE` phase in the reconstructed history band.

It represents the restart point for the current architecture story.

##### Estimated Worked On Files

- [x] App shell and routing boundary files
  - [x] `src/index.ts`
  - [x] `src/app/store/useAppStore.ts`
  - [x] `src/app/store/selectors.ts`
  - [x] `src/app/buildDispatcher.ts`
  - [x] `src/app/protocol.ts`
- [x] Viewer and worker startup files
  - [x] `src/viewer/Viewer.ts`
  - [x] `src/viewer/scene/SceneManager.ts`
  - [x] `src/worker/worker.ts`
  - [x] `src/worker/scheduler.ts`
  - [x] `src/worker/pipeline/buildPipeline.ts`
- [x] Shared boundary and core schema files
  - [x] `src/shared/productSchema.ts`
  - [x] `src/shared/buildTypes.ts`
  - [x] `src/shared/partsTypes.ts`

##### Estimated Added Files

- [x] App bootstrap and state
  - [x] `src/index.ts`
  - [x] `src/app/store/useAppStore.ts`
  - [x] `src/app/store/selectors.ts`
  - [x] `src/app/buildDispatcher.ts`
  - [x] `src/app/protocol.ts`
- [x] App modes and panels
  - [x] `src/app/profileEditor/ProfileControls.tsx`
  - [x] `src/app/profileEditor/profileSchema.ts`
  - [x] `src/app/profileEditor/profileValidation.ts`
  - [x] `src/app/jakeMode/JakeControls.tsx`
  - [x] `src/app/jakeMode/jakeConstraints.ts`
  - [x] `src/app/jakeMode/jakeAdapter.ts`
  - [x] `src/app/panels/PartsListPanel.tsx`
  - [x] `src/app/panels/BuildStatusPanel.tsx`
- [x] Viewer skeleton
  - [x] `src/viewer/Viewer.ts`
  - [x] `src/viewer/scene/SceneManager.ts`
  - [x] `src/viewer/renderers/MeshRenderer.ts`
  - [x] `src/viewer/gizmo/`
  - [x] `src/viewer/controlViz/`
- [x] Worker skeleton and pipeline
  - [x] `src/worker/worker.ts`
  - [x] `src/worker/scheduler.ts`
  - [x] `src/worker/validation.ts`
  - [x] `src/worker/pipeline/buildPipeline.ts`
  - [x] `src/worker/pipeline/exportService.ts`
- [x] Shared contracts and core types
  - [x] `src/shared/productSchema.ts`
  - [x] `src/shared/buildTypes.ts`
  - [x] `src/shared/partsTypes.ts`
  - [x] `src/shared/constants.ts`

##### Phase Summary

Main outcomes:
- established the clean-restart architecture direction
- set the early core-engine baseline for the rebuilt repo
- anchored later `GE` runtime and execution phases on a fresh system model

### Phase 1 CheckList

  - [x] Architecture boundaries
    - [x] lock the clean `app -> worker -> viewer` separation as the foundation of the restarted app
    - [x] lock the rule that UI captures intent but does not build geometry
    - [x] lock the rule that worker executes CAD but does not reach into UI state
    - [x] lock the rule that viewer renders payloads only and does not perform CAD logic
    - [x] lock the need for shared schema/protocol boundaries so state and payload definitions do not drift
  - [x] Clean repo and stack setup
    - [x] initialize a new `parahook` repo with Vite, React, TypeScript, Three.js, Zustand, and Zod
    - [x] create the clean-slate top-level source layout for `app/`, `viewer/`, `worker/`, `geometry/`, `runtime/`, `shared/`, and `tests/`
    - [x] create the major app-layer subareas for stores, modes, panels, components, io, and presets
    - [x] create the major viewer-layer subareas for scene, renderers, gizmo, control viz, materials, and assets
    - [x] create the major worker-layer subareas for pipeline, products, foothook parts, future footpad/rail folders, and OpenCascade init
    - [x] create the core starter files for stores, dispatcher, UI panels, viewer skeleton, worker skeleton, pipeline files, part builders, toolbelt files, runtime audio, and shared protocol/types
  - [x] Foundation enforcement and baseline bring-up
    - [x] enforce the first hard architecture boundaries between `app`, `viewer`, `worker`, and `geometry`
    - [x] build the first warm-worker skeleton with message handling, scheduler integration, build/export handlers, warm init, stale-drop protection, and deterministic stub artifacts
    - [x] build the first viewer skeleton with scene, camera, renderer, resize handling, render loop, and mesh-payload input path
    - [x] confirm the clean restart compiled before real geometry work started

## [x] - GE - Phase 2 - `Runtime And Rebuild Rules` - Reconstructed

Human Summary: This phase defined the early runtime and rebuild rules so the system had a clearer contract for what should re-run, when it should rebuild, and how the engine should behave under change.

### Phase 2 Overview
#### Fold Hack 4

##### Phase Notes

This phase follows directly from the clean restart and begins locking operational engine behavior.

##### Estimated Worked On Files

- [x] Runtime dispatch and scheduling files
  - [x] `src/app/buildDispatcher.ts`
  - [x] `src/worker/worker.ts`
  - [x] `src/worker/scheduler.ts`
- [x] Intent and state boundary files
  - [x] `src/app/store/useAppStore.ts`
  - [x] `src/app/store/intentClassifier.ts`
  - [x] `src/app/protocol.ts`
- [x] Shared request/response contracts
  - [x] `src/shared/buildTypes.ts`
  - [x] `src/shared/productSchema.ts`

##### Estimated Added Files

- [x] Likely runtime support files
  - [x] `src/app/store/intentClassifier.ts`
  - [x] `src/worker/scheduler.ts`
  - [x] `src/worker/validation.ts`


##### Phase Summary

Main outcomes:
- established runtime behavior expectations
- clarified rebuild rules and system triggers
- tightened the early engine-side contract around change propagation

### Phase 2 CheckList


  - [x] Worker lifetime and scheduling
    - [x] lock one warm worker as a restart invariant
    - [x] use latest-only scheduling so rapid control churn collapses into the newest valid build request
    - [x] drop stale worker results so out-of-order completions do not overwrite newer intent
  - [x] Intent routing rules
    - [x] lock the idea of an intent classifier to separate render-only work from geometry-affecting work
    - [x] treat render-only changes as viewer work instead of geometry rebuild work
    - [x] treat geometry-affecting changes as worker-bound build work
    - [x] keep intent classification as the boundary that protects the worker from unnecessary rebuild spam
  - [x] State and protocol discipline
    - [x] lock canonical model state and UI/view state as separate concerns
    - [x] keep worker communication on shared protocol/schema boundaries instead of ad hoc UI-to-runtime coupling
    - [x] prefer full canonical snapshots plus internal caching over premature delta-protocol complexity in the restart baseline
  - [x] define the early runtime rules for the restarted system
  - [x] define rebuild expectations and propagation behavior
  - [x] tighten the engine-side operational contract after the restart


## [x] - GE - Phase 3 - `Engine Roadmap Foundation` - Reconstructed

Human Summary: This created the early engine roadmap foundation so the core-system direction was documented as an intentional plan rather than just a series of isolated tasks.

### Phase 3 Overview
#### Fold Hack 4

##### Phase Notes

This is still reconstructed history, but it is strongly evidenced as a real completed phase.

##### Phase Summary

Main outcomes:
- documented the early engine roadmap foundation
- turned engine direction into an explicit planned sequence
- gave later `GE` work a clearer long-form structure


##### Estimated Worked On Files

- [x] Routing and ownership files
  - [x] `src/app/store/useAppStore.ts`
  - [x] `src/app/buildDispatcher.ts`
  - [x] `src/shared/buildTypes.ts`
  - [x] `src/shared/partRouting.ts`
- [x] Worker pipeline and signature files
  - [x] `src/worker/pipeline/buildPipeline.ts`
  - [x] `src/worker/pipeline/partsSpec.ts`
  - [x] `src/worker/pipeline/signatures.ts`
- [x] Shared part identity files
  - [x] `src/shared/partsTypes.ts`
  - [x] `src/shared/constants.ts`

##### Estimated Added Files

- [x] Likely new foundation files
  - [x] `src/shared/partRouting.ts`
  - [x] `src/worker/pipeline/partsSpec.ts`
  - [x] `src/worker/pipeline/signatures.ts`


- legacy carry-forward cluster retained from the old unified task history

##### Legacy Carry-Forward

The old unified task history also includes a mixed early `GE` closure / planning cluster that has not been cleanly split into a later dedicated canonical phase.

Carry-forward items:
- [x] finalize `partSlots` / contract hardening work for the old Phase 1 closeout
- [x] establish docs task infrastructure and planning checklist structure during that closure period
- [x] sync status and closure entries across roadmap / tasklist / changelog docs

### Phase 3 CheckList

  - [x] Routing foundation
    - [x] define param ownership and routing as the first real engine-foundation milestone after the clean restart
    - [x] move param ownership and routing ahead of UI polish as the first major post-restart engine foundation
    - [x] track changed param ids so future rebuild routing can know what parts were actually affected
    - [x] add optional build-request metadata so the worker can reason about affected parts without guessing from UI state
  - [x] Part identity and selective recompute
    - [x] define deterministic per-part signatures as part of the new foundation
    - [x] establish deterministic per-part signatures as the basis for selective recompute and stable artifact identity
    - [x] define worker-side affected-part routing as a necessary step before real toe geometry
    - [x] keep validation rules preserving the current stub outputs while the routing foundation was introduced
  - [x] Roadmap sequencing
    - [x] order the roadmap as routing first, selective recompute second, and real toe replacement third

## [?] - GE - Phase 4 - `First Repo Setup Execution` - Reconstructed

Human Summary: This appears to be the first real repo-setup execution step after the early engine planning phases, but it is still held as a gap-style reconstructed phase because the evidence is incomplete.

### Phase 4 Overview
#### Fold Hack 4

##### Phase Notes

This is currently treated as a reconstructed gap entry rather than a fully locked completed phase.

##### Phase Summary

Current understanding:
- it likely covered the first real repo-setup execution pass
- it sits between the early roadmap foundation and the first running vertical slice
- the phase title is strong enough to keep, but the detailed body evidence is still thin

### Phase 4 CheckList

- [x] preserve this gap as a visible canonical `GE` slot
- [ ] recover stronger evidence for the exact execution work inside this phase

## [?] - GE - Phase 5 - `First Running Box Vertical Slice` - Reconstructed

Human Summary: This appears to be the first working vertical slice in the rebuilt engine path, but it is still a gap-style reconstructed phase because the detailed source evidence is not yet complete.

### Phase 5 Overview
#### Fold Hack 4

##### Phase Notes

This phase is also currently held as a reconstructed gap rather than a fully locked completed phase.

##### Likely Files Touched

- [?] App/runtime/viewer vertical-slice files
  - [?] `src/app/buildDispatcher.ts`
  - [?] `src/app/store/useAppStore.ts`
  - [?] `src/worker/worker.ts`
  - [?] `src/viewer/Viewer.ts`

##### Phase Summary

Current understanding:
- it likely represents the first running box-style vertical slice
- it bridges the early setup execution work into more concrete engine behavior
- the title is retained because it fits the current historical sequence, but the proof remains incomplete

### Phase 5 CheckList

- [x] Inferred vertical-slice milestone
  - [x] preserve this gap as a visible canonical `GE` slot
  - [?] likely add the first `width / length / height` controls
  - [?] likely prove the first real end-to-end box slice through app, worker, and viewer
  - [?] likely harden the first dispatcher/latest-only rebuild loop around a running vertical slice
- [ ] Evidence recovery
  - [ ] recover stronger evidence for the exact slice behavior and scope
  - [ ] confirm the likely file footprint beyond the currently inferred app/worker/viewer touch points

## [x] - GE - Phase 6 - `Worker Affected-Part Routing And Cache Preference` - Reconstructed

Human Summary: This phase pushed the engine deeper into real worker behavior by routing affected parts more deliberately and preferring cached work where possible.

### Phase 6 Overview
#### Fold Hack 4

##### Phase Notes

This is the first later reconstructed `GE` phase after the early gap band.

##### Files Changed

- [x] Routing and affected-part files
  - [x] `src/app/buildDispatcher.ts`
  - [x] `src/shared/buildTypes.ts`
  - [x] `src/shared/partRouting.ts`
- [x] Worker execution files
  - [x] `src/worker/pipeline/buildPipeline.ts`
  - [x] `src/worker/pipeline/signatures.ts`

##### Phase Summary

Main outcomes:
- improved affected-part routing in the worker path
- clarified cache preference behavior
- moved the engine toward more practical incremental execution

### Phase 6 CheckList

- [x] Affected-part routing foundation
  - [x] define worker-side affected-part routing as real build input
  - [x] route affected parts more deliberately through the worker path
  - [x] strengthen the bridge between routing metadata and worker execution
- [x] Cache-preference direction
  - [x] add cache-preference thinking around unaffected parts
  - [x] establish cache-preference behavior in that flow
  - [x] strengthen the engine toward selective recompute without restarting the architecture
- [x] Reconstructed constraints and verification
  - [x] preserve the one warm worker rule
  - [x] preserve the deterministic stub-output baseline while routing work matured
  - [x] keep the summary aligned with the recovered routing/signature work from conversation-derived history

## [x] - GE - Phase 7 - `Early Modern Baseline - Compiled Master Entry`

Human Summary: This phase acts as the early modern baseline for the current changelog era, marking the point where the GE work becomes part of the modern compiled history block.

### Phase 7 Overview
#### Fold Hack 4

##### Phase Notes

This phase is represented in the modern changelog as the baseline bridge into later completed engine work.

##### Files Changed

- [x] Canvas/UI core
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/WireLayer.tsx`
  - [x] `src/app/spaghetti/canvas/spaghettiWires.ts`
  - [x] `src/app/spaghetti/canvas/types.ts`
- [x] Node/port/composite UI
  - [x] `src/app/spaghetti/canvas/NodeView.tsx`
  - [x] `src/app/spaghetti/canvas/PortView.tsx`
  - [x] `src/app/spaghetti/ui/SpaghettiContextMenu.tsx`
  - [x] `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - [x] `src/app/spaghetti/ui/ExpandedEditor.tsx`
  - [x] `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- [x] Schema/store/types
  - [x] `src/app/spaghetti/schema/spaghettiTypes.ts`
  - [x] `src/app/spaghetti/schema/spaghettiSchema.ts`
  - [x] `src/app/spaghetti/store/useSpaghettiStore.ts`
  - [x] `src/app/spaghetti/types/fieldTree.ts`
- [x] Compiler/runtime behavior
  - [x] `src/app/spaghetti/compiler/validateGraph.ts`
  - [x] `src/app/spaghetti/compiler/evaluateGraph.ts`
  - [x] `src/app/spaghetti/compiler/compileGraph.ts`
- [x] Registry/theme/tooling/tests
  - [x] `src/app/spaghetti/registry/nodeRegistry.ts`
  - [x] `src/app/theme/v15Theme.css`
  - [x] `package.json`
  - [x] `src/app/spaghetti/types/fieldTree.test.ts`
  - [x] `src/app/spaghetti/compiler/validateGraph.test.ts`
  - [x] `src/app/spaghetti/compiler/evaluateGraph.test.ts`

##### Phase Summary

Main outcomes:
- anchors the early modern `GE` baseline
- bridges reconstructed engine history into the modern compiled changelog era
- provides a stable handoff point for later runtime hardening and command-kernel work

### Phase 7 CheckList

- [x] Locked invariants and baseline posture
  - [x] preserve the early modern baseline as the bridge into the current compiled era
  - [x] keep compile/build explicit rather than auto-triggered by canvas interactions
  - [x] preserve deterministic path-aware logic and composite handling
  - [x] keep legacy mixed graphs preserved with warnings instead of destructive cleanup
- [x] Canvas and editor baseline
  - [x] add right-click canvas node-add menu with search and cursor placement
  - [x] add typed color coding for ports and anchors
  - [x] fix floating editor/canvas anchoring and node layout structure
  - [x] add collapsible `Preview Mode` and `Parts List` sections
  - [x] make Baseplate present grouped `Drivers` and `Sketch Inputs`
- [x] Wire/composite/path system foundations
  - [x] add wire curviness slider and reroute-point editing
  - [x] enforce node-end tangency and waypoint tangent controls
  - [x] add composite field-tree/path endpoint system with leaf-path-aware validation and rendering
  - [x] update evaluator and compile helpers for deterministic path-aware behavior
  - [x] add composite vec2 parent UX with break/group and info-menu behavior
- [x] Testing and tooling baseline
  - [x] add Vitest setup and tests for field tree, validator path rules, and evaluator precedence
  - [x] add `npm run test` script and `vitest` dev dependency
  - [x] keep the reconstructed-to-modern handoff visible in the GE family story

## [x] - GE - Phase 8 - `Runtime Bridge Hardening`

Human Summary: This hardened the runtime bridge, including tessellation determinism and CCW lock behavior, so the engine/render handoff became more stable and predictable.

### Phase 8 Overview
#### Fold Hack 4

##### Phase Notes

This phase appears as a small cluster in the modern changelog rather than one single entry.

##### Files Changed

- [x] Runtime bridge hardening docs/change tracking
  - [x] `docs/listofchanges.md`
- [x] Runtime tessellation/compiler files
  - [x] `src/app/spaghetti/compiler/runtimeTessellation.ts`
  - [x] `src/app/spaghetti/compiler/compileGraph.ts`
- [x] Runtime bridge test files
  - [x] `src/app/spaghetti/compiler/runtimeTessellation.test.ts`
  - [x] `src/app/spaghetti/compiler/compileGraph.test.ts`

##### Phase Summary

Main outcomes:
- hardened the runtime bridge layer
- tightened tessellation determinism
- locked CCW behavior more explicitly

##### Phase Sub-Phases

- added next-task runtime-bridge changelog support
- tessellation determinism and CCW lock

### Phase 8 CheckList

- [x] Change-tracking and scope lock
  - [x] add the runtime-bridge hardening follow-up changelog/task entry
  - [x] keep tessellation strictly at the compile-to-worker boundary
  - [x] preserve worker protocol and runtime contract
  - [x] keep analytic `ProfileLoop.segments` authoritative in app state
  - [x] avoid moving tessellation into worker/runtime layers
- [x] Deterministic tessellation pipeline
  - [x] extract runtime tessellation into compiler-local helper `runtimeTessellation.ts`
  - [x] wire `compileGraph` to use the extracted tessellation helper
  - [x] canonicalize emitted values to 6 decimals
  - [x] apply epsilon-based duplicate suppression after canonicalization
  - [x] implement deterministic closure snap after full segment emission
  - [x] enforce CCW using open-ring signed area with implicit closing edge
  - [x] avoid synthetic close-point appends while normalizing near-closure deterministically
- [x] Contract and verification coverage
  - [x] preserve runtime op contract and schema invariants
  - [x] add compile payload determinism tests for curved `sketch -> closeProfile -> extrude`
  - [x] assert byte-identical payload JSON across runs
  - [x] assert `schemaVersion` lock and runtime op set lock
  - [x] add focused tessellation unit tests for epsilon join suppression, closure snap/no double-close, CCW enforcement, and repeat determinism
  - [x] run targeted tests, full test suite, and build verification

## [x] - GE - Phase 9 - `Graph Command Kernel`

Human Summary: This established the graph command kernel so core graph operations had a more formal engine-side command structure.

### Phase 9 Overview
#### Fold Hack 4

##### Phase Notes

This is one of the stronger single-entry GE phases in the modern changelog block.

##### Files Changed

- [x] Graph command kernel files
  - [x] `src/app/spaghetti/graphCommands/types.ts`
  - [x] `src/app/spaghetti/graphCommands/addNode.ts`
  - [x] `src/app/spaghetti/graphCommands/removeNode.ts`
  - [x] `src/app/spaghetti/graphCommands/addEdge.ts`
  - [x] `src/app/spaghetti/graphCommands/removeEdge.ts`
  - [x] `src/app/spaghetti/graphCommands/replaceEdge.ts`
  - [x] `src/app/spaghetti/graphCommands/setNodeParams.ts`
  - [x] `src/app/spaghetti/graphCommands/setNodePosition.ts`
  - [x] `src/app/spaghetti/graphCommands/connectEdgeWithAutoReplace.ts`
  - [x] `src/app/spaghetti/graphCommands/index.ts`
- [x] Store and UI integration files
  - [x] `src/app/spaghetti/store/useSpaghettiStore.ts`
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- [x] Verification/docs files
  - [x] `src/app/spaghetti/graphCommands/graphCommands.test.ts`
  - [x] `docs/CHANGELOG.md`

##### Phase Summary

Main outcomes:
- established the graph command kernel
- tightened the engine-side structure for graph operations
- moved more graph behavior into a clearer command model

### Phase 9 CheckList

- [x] Command kernel foundation
  - [x] introduce centralized graph command kernel under `src/app/spaghetti/graphCommands/`
  - [x] keep commands pure in the form `(graph) => nextGraph`
  - [x] add core commands for node and edge add/remove/replace operations
  - [x] add `setNodeParams` and `setNodePosition` commands
  - [x] add `connectEdgeWithAutoReplace` plus planning wrapper for driver input auto-replace
- [x] Store normalization and integration
  - [x] add `applyGraphCommand(cmd)` to `useSpaghettiStore`
  - [x] wire command commits through existing normalization and waypoint pruning
  - [x] update legacy store edge methods to route topology changes through graph commands
  - [x] centralize graph mutation commit path through store normalization
- [x] UI refactor and behavior preservation
  - [x] refactor canvas wire connect/replace flows to command calls
  - [x] refactor edge detach/delete to `removeEdge` command calls
  - [x] refactor node-add flows in both canvas and editor to `addNode`
  - [x] reduce canvas/editor responsibility to orchestration only
  - [x] preserve worker protocol, graph schema version, compile/evaluate behavior, and OutputPreview invariants
- [x] Verification coverage
  - [x] add command-layer tests for add/remove node/edge behavior
  - [x] cover auto-replace connect behavior and determinism
  - [x] verify OutputPreview non-deletable invariant through command+normalization path
  - [x] run tests and build verification

## [x] - GE - Phase 10 - `Contract Lock`

Human Summary: This locked the resolver/validator/canvas contract into parity so the core system behaved more consistently across the graph-resolution path and the editor-facing surface.

### Phase 10 Overview
#### Fold Hack 4

##### Phase Notes

This is the current strongest later `GE` contract-lock phase in the changelog.

##### Files Changed

- [x] Shared contract/parity files
  - [x] `src/app/spaghetti/contracts/endpoints.ts`
  - [x] `src/app/spaghetti/contracts/contractParity.test.ts`
- [x] Canvas and auto-replace integration files
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/driverInputAutoReplace.ts`
- [x] Validator/docs files
  - [x] `src/app/spaghetti/compiler/validateGraph.ts`
  - [x] `docs/CHANGELOG.md`

##### Phase Summary

Main outcomes:
- locked resolver, validator, and canvas parity
- strengthened the contract between engine validation and presentation-facing graph behavior
- closed an important consistency gap in the core system

### Phase 10 CheckList
- [x] Shared endpoint contract
  - [x] add shared endpoint contract module at `src/app/spaghetti/contracts/endpoints.ts`
  - [x] canonicalize driver aliases into consistent endpoint forms
  - [x] add node-type-aware canonicalization entrypoint
  - [x] add canonical endpoint key builder with driver-input collapse for max-connection counting
  - [x] unify endpoint resolution using effective ports and registry definitions
  - [x] add deterministic `validateConnectionContract(...)` with stable rule codes
- [x] Canvas and validator parity
  - [x] rewire canvas cheap-check to call the shared contract only
  - [x] preserve driver-input auto-replace drop semantics via projected-edge validation
  - [x] standardize UI rejection messaging from shared reason codes
  - [x] rewire `validateGraph` connection decisions to the shared contract
  - [x] preserve cycle-exclusion behavior and deterministic diagnostics ordering
  - [x] update auto-replace target keying to use the shared canonical endpoint key helper
- [x] Contract parity verification
  - [x] add CT-1 parity tests for canvas cheap-check vs validator agreement on `ok` and `code`
  - [x] cover driver aliases, mixed alias counting, unit mismatch, OutputPreview dynamic slot ports, feature virtual ports, and composite leaf-path rules
  - [x] keep worker protocol, graph schema version, compile/evaluate behavior, and OutputPreview invariants unchanged
  - [x] run tests and build verification

## [x] - GE - Phase 11 - `Graph Persistence And Save Load`

Human Summary: This phase family covers the move from live in-memory graph documents to real saved graph persistence, Browser-owned cached graph lifecycle, and explicit save/load behavior in editor viewports.

### Phase 11 Overview
#### Fold Hack 4

##### Phase Notes

`GE - Phase 11` is now split into:
- `11A`
  - graph-document persistence core
- `11B`
  - cached graph lifecycle
- `11C`
  - save/load interaction with editors

Current state:
- `11A` is implemented
- `11B` is implemented
- `11C` is implemented
- the first-pass family-level `11C` editor-action answers are now locked here
- the full `GE - Phase 11` family is now implemented

Main family outcome target:
- make graph persistence real without blurring:
  - durable file state
  - Browser cached-entry state
  - editor viewport state

##### Phase Summary

Main outcomes this family needs:
- durable graph-document save/load
- Browser-owned cached graph lifecycle
- explicit editor-facing open/swap/load behavior
- clear identity rules across saved files, cached entries, graph documents, and editor viewports

##### Phase Sub-Phases

- `[1.2A] GE - Phase 11A - Graph Document Persistence Core`
- `[1.2B] GE - Phase 11B - Cached Graph Lifecycle`
- `[1.2C] GE - Phase 11C - Save/Load Interaction With Editors`

##### Family-Level 11C Decision Locks

###### Q1 - `Should Browser row click simply remain Open Graph in GE - Phase 11C?`

This asks:
- whether `Open Graph` should stay the current Browser row-click `open-or-focus` action
- or whether `Open Graph` should become a separate explicit action surface

Why it matters:
- this decides whether the default Browser behavior stays simple
- and whether later explicit editor actions are layered on top instead of replacing the current basic open/focus path

Humanized summary:
- when I click a graph row in the Browser, is that just `Open Graph`?

Locked answer:
- yes
- Browser row click should remain the simple `Open Graph` `open-or-focus` action in the first `11C` pass
- keep `Open In New Editor` and `Swap Current Editor` as explicit secondary actions instead of overloading row click

###### Q2 - `What exactly should Load Into New Graph do to graph identity in GE - Phase 11C?`

This asks:
- whether `Load Into New Graph` should always create a fresh live `graphDocumentId`
- or whether it should ever preserve the loaded graph id

Why it matters:
- this is the cleanest place where `11C` either preserves or breaks identity on purpose
- and it decides whether the app treats this action as a clone/import action versus a reopen action

Humanized summary:
- if I load content into a new graph, is it always a new graph copy?

Locked answer:
- yes
- `Load Into New Graph` should always create a fresh live `graphDocumentId` and fresh Browser cached-entry identity
- it may preserve source/provenance metadata for the new copy, but it should not preserve the loaded graph's live identity
- reopening an already-known saved/cached graph belongs to `Open Graph`, not `Load Into New Graph`

###### Q3 - `Should Open In New Editor allow multiple viewports bound to the same graph document?`

This asks:
- whether `Open In New Editor` should permit a second viewport on the same live graph document
- or whether it should require a cloned graph first

Why it matters:
- this defines the relationship between viewport identity and graph identity
- and it decides whether "new editor" means "new window on the same graph" or "new graph copy"

Humanized summary:
- can I open the same graph in two editor windows at once?

Locked answer:
- yes
- `Open In New Editor` should explicitly allow multiple editor viewports bound to the same live graph document
- that action creates a new viewport, not a new graph copy
- if the user wants an independent editable copy, use `Load Into New Graph` instead

###### Q4 - `What should Swap Current Editor do when there is no focused editor viewport?`

This asks:
- whether `Swap Current Editor` should no-op
- be disabled
- or silently fall back to opening a viewport anyway

Why it matters:
- this is a small action rule, but it strongly affects whether `11C` feels explicit or surprising
- and it keeps `Swap Current Editor` from collapsing back into `Open Graph`

Humanized summary:
- if there is no active editor to swap, what should happen?

Locked answer:
- `Swap Current Editor` should be disabled when there is no focused editor viewport
- if it is somehow invoked with no focused viewport, it should no-op rather than silently opening a new editor
- this keeps `Swap Current Editor` explicit and prevents it from collapsing back into `Open Graph`

###### Q5 - `Which first-pass UI surface should own each 11C editor action?`

This asks:
- where the user should launch:
  - `Open Graph`
  - `Load Into New Graph`
  - `Open In New Editor`
  - `Swap Current Editor`

Why it matters:
- the actions can be semantically correct but still feel messy if the launch surface is unclear
- and `11C` needs a small honest action map instead of vague future UI language

Humanized summary:
- where should each of the four editor actions actually live in the UI?

Locked answer:
- `Open Graph`
  - Browser row click
- `Load Into New Graph`
  - explicit Browser/file-load action after choosing a source graph file
- `Open In New Editor`
  - explicit Browser row secondary action such as a row-action button or context menu item
- `Swap Current Editor`
  - explicit Browser row secondary action such as a row-action button or context menu item
- the Browser should stay the first-pass action-launch surface because it owns the target cached graph entry
- the editor header graph dropdown remains the viewport-local graph-switch surface, not the primary owner of these `11C` load/open actions

###### Q6 - `What should Save target in GE - Phase 11C?`

This asks:
- whether save should act on the cached Browser row
- the focused editor graph
- or both together

Why it matters:
- `11B` already made cached graph lifecycle real
- so `11C` needs to say how editor actions and Browser-owned cached entries meet at save time

Humanized summary:
- when I hit save from the editor side, what object am I really saving?

Locked answer:
- save should target the underlying cached Browser entry / live graph-document pair that the action is acting on
- from the editor side, `Save` should save the graph bound to the focused editor viewport
- from the Browser side, `Save` should save the targeted cached graph row
- these are two entry surfaces for the same underlying save target, not two different save objects

###### Q7 - `Should Browser focus follow editor rebinding actions in GE - Phase 11C?`

This asks:
- whether Browser focus should automatically follow the graph bound to the affected viewport
- after `Swap Current Editor` or `Open In New Editor`

Why it matters:
- this keeps Browser/editor coordination predictable
- and avoids the user seeing a Browser selection that no longer matches the viewport they just acted on

Humanized summary:
- when an editor switches or opens on another graph, should the Browser follow it automatically?

Locked answer:
- yes
- Browser focus/selection should follow the graph bound to the affected focused viewport after `Swap Current Editor`
- Browser focus/selection should also follow the graph opened by `Open In New Editor` once that new viewport becomes focused
- this should update Browser/editor coordination only; it should not silently change graph active/inactive or generate/view state

###### Decision Checklist

- [x] Q1 - Should Browser row click simply remain `Open Graph` in `GE - Phase 11C`?
- [x] Q2 - What exactly should `Load Into New Graph` do to graph identity in `GE - Phase 11C`?
- [x] Q3 - Should `Open In New Editor` allow multiple viewports bound to the same graph document?
- [x] Q4 - What should `Swap Current Editor` do when there is no focused editor viewport?
- [x] Q5 - Which first-pass UI surface should own each `11C` editor action?
- [x] Q6 - What should `Save` target in `GE - Phase 11C`?
- [x] Q7 - Should Browser focus follow editor rebinding actions in `GE - Phase 11C`?

### Phase 11 CheckList

- [x] `11A` persistence core exists
  - [x] one graph document can be saved
  - [x] one graph document can be loaded
  - [x] load validation uses the canonical parser boundary
- [x] `11B` cached graph lifecycle
  - [x] define saved graph versus cached live graph behavior
  - [x] define Browser-owned cached graph entries
  - [x] support reopen/focus behavior for cached entries
  - [x] lock dirty-state rules
- [x] `11C` editor interaction policy
  - [x] separate `Open Graph` from `Load Into New Graph`
  - [x] separate `Open In New Editor` from `Swap Current Editor`
  - [x] keep Browser cached-entry ownership separate from viewport identity
- [x] family-level identity discipline
  - [x] keep saved-file identity, cached-entry identity, graph-document identity, and viewport identity explicit
  - [x] avoid silent copy/replace behavior

## [ ] - GE - Phase 12 - `Multi-Document Graph Ownership`

Human Summary: Future placeholder. This phase is the later `GE` ownership expansion after `GE - Phase 11`, where project-file, graph-document, and project-content ownership rules become explicit enough for the Browser and later content structure work to sit on a stable core model.

### Phase 12 Overview
#### Fold Hack 4

##### Phase Notes

This is currently a future canonical `GE` phase.

It is the later ownership home after:
- `GE - Phase 11`
  - graph persistence and save/load
- `SP - Phase 10`
  - graph-aware routing/runtime ownership
- the first `SP - Phase 11` Browser hierarchy pass

Current state:
- the lane and sub-phase names are defined in the roadmap
- `12A` is now implemented
- `12B` is now implemented
- `12C` remains future
- this section now exists as the family ownership surface and the remaining question surface for `12C`
- richer Browser workspace behavior and Browser-facing output structure still belong to later `SP` / `AS` / `VR` phases rather than this `GE` ownership family

##### Phase Summary

Current placeholder understanding:
- this phase should define fuller `Project File` ownership rather than leaving it as only a synthetic routing identity
- it should make the graph-documents-versus-project-content ownership split explicit
- it should become the family home for the later project/content ownership rules intentionally kept out of the first `SP - Phase 11` Browser pass

##### Phase Sub-Phases

- `GE - Phase 12A`
  - `Project File Core And Graph Collection Ownership`
- `GE - Phase 12B`
  - `Project Content Tree Ownership`
- `GE - Phase 12C`
  - `Cross-Graph Ownership Rules`

##### Family-Level 12 Planning Questions
##### A
###### [12A] Q1 - `What is the minimum first-pass Project File shape that GE - Phase 12A should make canonical?`

This asks:
- which fields must become real project-owned data instead of staying implicit runtime glue
- and how small the first honest `Project File` can be while still supporting multi-document ownership

Why it matters:
- `12A` should make project ownership real without prematurely collapsing into final Browser structure
- and the minimum shape decides what later lanes can safely rely on

Humanized summary:
- what is the smallest real project file that still means something?

Open decision target:
- define the first-pass canonical `Project File` shape for `12A`
- keep it aligned with the roadmap carry-forward around:
  - `projectFileId`
  - `name`
  - `version`
  - `graphDocuments`
  - `rootAssembly`

Locked answer:
- `12A` should make a small but real `ProjectFile` canonical
- it should own project identity and graph membership, but not yet final Browser hierarchy polish or richer workspace state

Recommended first-pass shape:

```ts
type ProjectFile = {
  projectFileId: string
  name: string
  version: number

  graphDocuments: ProjectGraphDocumentEntry[]
  rootAssemblyId: string | null
}

type ProjectGraphDocumentEntry = {
  graphDocumentId: string
  label: string
  sourceFilePath: string | null
  orderIndex: number
}
```

Why this is the right cut:
- it matches the roadmap's intended minimum project shape
- it makes project membership real without dragging in later Browser/output structure too early
- it gives `12B` a clean place to attach project content ownership later

###### [12A] Q2 - `What exactly should project-level graph collection ownership own in GE - Phase 12A?`

This asks:
- whether the project layer owns only durable graph membership
- or also owns cached/open graph collection state explicitly

Why it matters:
- `GE - Phase 11` already made saved graphs and cached graph entries real
- so `12A` now needs to say how those graph documents sit inside a project without blurring file identity, live graph identity, and project membership

Humanized summary:
- when a graph belongs to a project, what does the project actually own?

Open decision target:
- define the project-owned graph collection boundary
- define whether first-pass project ownership tracks:
  - graph membership only
  - graph order
  - default open/focused hints
  - cached/live graph lifecycle hooks

Locked answer:
- project-level graph collection ownership should own:
  - which graph documents belong to the project
  - stable graph membership identity
  - graph ordering inside the project
  - minimal graph metadata such as label and optional source path
- it should not own:
  - editor viewport state
  - focused/open viewport state
  - viewer presentation state
  - transient build/runtime memory
  - cached graph lifecycle behavior beyond whatever is needed to reopen/load the owned graph document

Rule:
- the project owns the collection
- the app/store still owns live runtime/editor state
- `GE - Phase 11` cached-entry behavior remains related but not synonymous with project membership

Why this is the right cut:
- a graph can belong to a project even when it is not open, not focused, and not loaded into an editor
- it keeps project membership durable and runtime state replaceable
- it avoids collapsing project ownership into session behavior

###### [12A] Q3 - `How should GE - Phase 12A separate durable project data from app-runtime-only graph state?`

This asks:
- which graph/project facts belong inside the durable project file
- and which should remain runtime/editor state only

Why it matters:
- if `12A` stores too little, project ownership stays fake
- if it stores too much, it starts swallowing viewport/editor/runtime behavior that should stay outside the durable model

Humanized summary:
- what should be saved in the project, and what should stay live-only?

Open decision target:
- lock the boundary between:
  - durable project-owned graph membership and structure
  - runtime cached graph state
  - editor viewport state
  - viewer presentation state

Locked answer:
- `12A` should draw the boundary like this

Durable project data:
- `projectFileId`
- project `name` / `version`
- graph membership
- graph order
- minimal graph metadata
- project-owned root composition anchor such as `rootAssemblyId`

Runtime-only state:
- live graph runtime memory
- graph-local build outputs
- graph-owned output surfaces
- dirty cached editor copies
- focused graph/editor viewport
- open viewport list
- viewer target / camera / selection / visibility state

Plain rule:
- if the data describes what the project is, save it
- if the data describes what the app is currently doing with the project, keep it runtime-only

Why this is the right cut:
- it keeps the project file honest but small
- it avoids persisting volatile editor/viewer/session behavior
- it keeps `12A` aligned with the current roadmap and vision boundary where project ownership does not become runtime ownership

##### What `12A` Left Out

`12A` intentionally did not try to finish the rest of `GE - Phase 12`.

Left out on purpose:
- project-file disk persistence and project-file load/save UX
- multiple project files or project switching
- project content tree records beyond the nullable `rootAssemblyId`
- first-pass `Component / Assembly / Object / Part` ownership structure
- Browser hierarchy growth, Browser row UX, and Browser workspace controls
- graph-authored output placement/composition rules above the project layer
- cross-graph `Publish / Receive`
- `Link` versus `Hard Copy`
- cross-graph identity/reference rules
- reference assets inside `Project File` ownership

Carry-forward rule:
- `12A` makes the project layer real
- `12B` owns project content tree and composition
- `12C` owns cross-graph ownership and composition rules
- later `SP` / `AS` / `VR` phases own richer Browser/workspace and Browser-facing output structure
##### b
###### [12B] Q1 - `What is the minimum project content tree shape that GE - Phase 12B should define above graph-authored outputs?`

This asks:
- what first-pass project-owned hierarchy must exist above graph outputs
- without forcing the later full Browser-facing structure too early

Why it matters:
- `12B` is where project content ownership becomes explicit
- but it should still stop before the later `AS` output-structure lane finishes the richer Browser hierarchy

Humanized summary:
- once graphs publish outputs, what project tree do those outputs land in?

Open decision target:
- define the first-pass project content tree boundary
- keep it compatible with later growth toward:
  - `Project File`
  - `Assembly`
  - `Component`
  - `Object`
  - `Part`

Locked answer:
- use this first-pass tree:
  - `Project File`
  - project-owned content anchored by `rootAssemblyId`
  - `Assembly Root`
  - `Component`
- that is enough for `GE - Phase 12B`

Meaning:
- graphs publish upward into project-owned content
- project content has one stable root
- the first real owned unit under that root is `Component`

Do not require yet:
- full `Component -> Object -> Part` Browser rendering
- nested assemblies everywhere
- full output row depth

Why this is the right cut:
- `12B` should define ownership, not finish the Browser tree UX
- `Assembly Root -> Component` is the smallest honest project content tree that can grow later
- it stays aligned with `12A`, where `rootAssemblyId` already exists as the first project anchor

Short version:
- first-pass tree = `Project File -> Assembly Root -> Component`

###### [12B] Q2 - `What should Component mean in the first pass of GE - Phase 12B?`

This asks:
- whether `Component` should already be treated as the graph-produced bundle
- and how much of that meaning belongs in `GE - Phase 12B` versus later `AS` structure work

Why it matters:
- `Component` is the bridge between graph-owned publication and project-owned composition
- and if that meaning stays vague, later Browser and assembly work will drift

Humanized summary:
- when a graph publishes something into the project, what exactly is the thing it creates?

Open decision target:
- define first-pass `Component` meaning as the graph-produced project-owned bundle
- keep richer Browser-facing object/part breakdown deferred where possible

Locked answer:
- `Component` should mean:
  - the first project-owned bundle created from graph-published output
- in first pass, `Component` is the stable bridge between:
  - graph-authored output
  - project-owned composition

Keep it simple in `12B`:
- do not force visible internal `Object / Part` breakdown yet
- do not make it a full Browser UI structure yet
- do not over-lock one final component granularity rule beyond:
  - graph-published output becomes project-owned component content

Working rule:
- `Graph Document` publishes project-consumable output
- `Project File` receives that output as `Component` content under project-owned composition
- in the shipped first pass, one resolved graph output entry becomes one project-owned `Component` record

Why this is the right cut:
- `Component` becomes the graph-to-project composition unit without forcing final Browser-facing structure
- it leaves room for later `AS` structure work to clarify deeper output grouping without rewriting the ownership model

Granularity caution:
- do not over-lock `Component` too early as:
  - exactly one component per graph
- safer first-pass wording is:
  - `Component` is the first project-owned bundle created from graph-published output
- that keeps `12B` flexible until later output-structure work clarifies whether one graph publishes:
  - one component
  - multiple components
  - or some later grouped output shape

Short version:
- `Component = graph-produced project bundle`

###### [12B] Q3 - `Where should assembly and object parenting authority live relative to graph-authored truth in GE - Phase 12B?`

This asks:
- which parent/child relationships belong to graph-authored declaration
- and which belong to project-level composition above graph outputs

Why it matters:
- this is the core boundary between graph-owned output truth and project-owned placement/composition
- and it prevents later Browser structure from mutating graph meaning silently

Humanized summary:
- what does the graph own, and what does the project own, once things are arranged into a larger assembly?

Open decision target:
- define project-level parenting/composition rules above graph-authored content
- keep graph-authored output declaration separate from project-owned placement and containment

Locked answer:
- split authority like this

Graph owns:
- what it publishes
- the authored output declaration
- the internal meaning of that published bundle

Project owns:
- where published components are placed
- which assembly contains which component
- higher-level project parenting/composition

So:
- graph-authored truth says:
  - `I publish this component content`
- project-level authority says:
  - `This component lives under this assembly`

Why this is the right cut:
- it keeps Browser/project composition from silently rewriting graph meaning
- it preserves graph-authored output truth while still allowing real project-level containment

Short version:
- graph owns output declaration
- project owns placement and containment

###### [12B] Q4 - `What must stay out of GE - Phase 12B so it does not collapse into the later Browser workspace lane?`

This asks:
- which tempting Browser/content features should be explicitly deferred
- even once a first-pass project content tree exists

Why it matters:
- `12B` should define ownership and containment, not finish row UX, materials, visibility, or final output nesting polish

Humanized summary:
- what should this phase refuse to do, even if the Browser wants it next?

Open decision target:
- explicitly defer:
  - Browser row UX polish
  - build bars and richer inspection controls
  - materials and visibility controls
  - final Browser-facing output hierarchy polish

Locked answer:
- keep these out of `GE - Phase 12B`:
  - full Browser UI row design
  - rich expand/collapse interaction design
  - row context menus
  - build bars / build-control UX
  - materials controls
  - visibility-control polish
  - viewer-reference workspace behavior
  - deep `Component -> Object -> Part` Browser rendering
  - final nested assembly interaction tools

`12B` should stop at:
- project content ownership shape
- `Assembly Root`
- `Component`
- project-level parenting authority

Leave later lanes to handle:
- `AS`
  - output structure and deeper content hierarchy
- `SP - Phase 11`
  - Browser surface/rows
- `VR`
  - viewer/workspace controls

Why this is the right cut:
- `12B` should define ownership structure first
- later lanes should define Browser behavior and rich content interaction once the structure exists

Short version:
- `12B` defines ownership structure
- later lanes define Browser behavior and rich content interaction

##### c
###### [12C] Q1 - `What is the first-pass publish and receive model across graph documents in GE - Phase 12C?`

This asks:
- how one graph should expose output to another graph
- and where cross-graph ownership starts and stops in the first pass

Why it matters:
- `12C` is where multi-document ownership becomes more than a container list
- and it decides whether cross-graph composition has one clear handoff model or several ad hoc ones

Humanized summary:
- how does one graph use something published by another graph?

Open decision target:
- define the first-pass `publish / receive` contract across graph documents
- keep it aligned with the already-shipped graph-owned output surface from `SP - Phase 10C`

Suggested answer:
- first-pass cross-graph reuse should use an explicit `Publish / Receive` model
- the publishing graph remains the owner of its published output declaration
- the receiving graph does not own the source output itself
- the receiving side owns only a receive/reference node that points at published output from another graph
- `Receive` should consume graph-published output through explicit identity, not through labels, viewport state, or copied runtime buckets
- first pass should support:
  - one source graph publishing output
  - another graph receiving that output as an input/reference
- first pass should not yet require:
  - deep Browser/project interaction polish
  - final assembly/object/part visualization of received content
  - export semantics for linked cross-graph content

Working rule:
- graph A publishes
- graph B receives a reference to that published output
- project composition may place both results in the same project, but publication ownership stays with graph A

Why this is the right cut:
- it keeps graph-owned output truth with the source graph
- it avoids inventing another app-global shared-output bucket
- it gives later `Publish / Receive Execution` work one honest ownership seam to implement

Short version:
- `Publish` exposes graph-owned output
- `Receive` references it explicitly in another graph
- source graph owns the published thing; receiving graph owns only the reference/use site

###### [12C] Q2 - `How should GE - Phase 12C distinguish Link versus Hard Copy when graph content crosses document boundaries?`

This asks:
- whether cross-graph usage should stay live-linked by default
- and when the system should create an owned independent copy instead

Why it matters:
- this is the first place where cross-document composition can either stay explicit or become silently destructive/confusing
- and it directly affects identity, update propagation, and user expectation

Humanized summary:
- if I bring graph output into another graph or project location, is it still linked or is it now a copy?

Open decision target:
- define the first-pass difference between:
  - linked graph-owned references
  - copied/embedded owned content

Suggested answer:
- `Link` should be the default first-pass cross-graph behavior
- `Link` means:
  - the receiving graph references the source graph's published output by identity
  - updates to the source publication flow through to the receiver
  - the receiver does not become the owner of the source content
- `Hard Copy` should be explicit, not implicit
- `Hard Copy` means:
  - create a new owned record or graph-local authored content based on the source at copy time
  - after copy, the new content no longer updates from the original source graph
  - copied content becomes owned by the receiving graph/project side according to later structure rules
- first pass of `12C` should lock the distinction in ownership terms even if only `Link` is fully implemented first

Working rule:
- linked = live reference to source-owned published output
- hard copy = new owned content with no live dependency on the source

Why this is the right cut:
- it keeps cross-graph reuse explicit and understandable
- it avoids surprising destructive behavior where a reference silently becomes an embedded copy
- it matches the roadmap split where ownership rules come now and fuller execution/polish comes later

Short version:
- default to `Link`
- allow `Hard Copy` only as an explicit ownership-conversion action

###### [12C] Q3 - `What identity and reference keys must cross-graph ownership carry in GE - Phase 12C?`

This asks:
- which ids/references must stay explicit when a project content node points at graph-owned output from another document
- without dragging full later export/runtime structure into the first pass

Why it matters:
- cross-graph composition will become fragile quickly if references are inferred from labels or viewport state
- and this is where ownership either stays deterministic or becomes hard to reason about

Humanized summary:
- what exact ids need to travel when one document references output from another?

Open decision target:
- define the minimum cross-graph identity set for:
  - source graph document
  - published output identity
  - project-owned receiving node

Suggested answer:
- the minimum explicit identity set should include:
  - `sourceProjectFileId` or current project identity context if needed
  - `sourceGraphDocumentId`
  - `sourceOutputEntryId`
  - `receivingGraphDocumentId`
  - `receiveNodeId` or equivalent receiver-side authored identity
- if project content creates a receiving project-owned component/reference record above the graph layer, that record should also carry:
  - `receivingProjectContentId` or equivalent project-owned receiver identity
- do not key cross-graph ownership by:
  - labels
  - graph order
  - active viewport
  - focused graph
  - viewer target
- first pass does not need final export/runtime ids like:
  - `assemblyId`
  - `objectId`
  - `partId`
  unless later structure work makes them real

Working rule:
- every receive relationship must say:
  - which graph published
  - which published entry was used
  - which graph/receiver is consuming it

Why this is the right cut:
- it keeps cross-graph composition deterministic
- it avoids fragile inferred relationships
- it aligns with the already-shipped `GraphOutputSurface.entries` identity model

Short version:
- carry explicit source graph id, source output entry id, and receiver-side identity
- never infer cross-graph references from names or UI state

###### [12C] Q4 - `Which singleton assumptions must GE - Phase 12C break so project-level ownership becomes real?`

This asks:
- which current single-graph assumptions in stores, selectors, runtime ownership, and Browser/editor coordination will block real multi-document composition

Why it matters:
- `12C` should not only define ownership rules on paper
- it also needs to name the singleton assumptions that must stop being treated as permanent architecture

Humanized summary:
- what parts of the current app still act like there is really only one important graph?

Open decision target:
- identify the singleton assumptions that later `12C` implementation must remove or route around
- keep Browser/editor convenience logic separate from the core ownership model

Suggested answer:
- `12C` should explicitly reject these as permanent assumptions:
  - one `active graph` as the only meaningful graph
  - one viewer-target path standing in for project composition truth
  - one focused editor viewport standing in for cross-graph ownership truth
  - one global output-consumption path derived from current UI focus
  - Browser/editor convenience state acting as ownership state
- `12C` should require that:
  - cross-graph references resolve by explicit graph/output identity
  - project composition does not depend on whichever graph is open or focused
  - receiver behavior is not derived from viewer-target or active-editor state
  - selectors and read models can resolve source-versus-receiver relationships without relying on singleton UI state
- `12C` does not need to remove all convenience singletons from the UI
- but it must stop treating them as architecture truth

Working rule:
- active graph, focused viewport, and viewer target are workspace conveniences
- they are not ownership or cross-graph composition authority

Why this is the right cut:
- it keeps project-level ownership real instead of UI-derived
- it preserves multi-graph growth
- it prevents cross-graph behavior from collapsing back into whatever graph is currently open

Short version:
- break the assumption that focus state equals ownership state
- route cross-graph composition by explicit ids, not singleton UI context

###### [12C] Q5 - `What is the exact first implementation cut for GE - Phase 12C?`

This asks:
- whether `12C` should stop at ownership rules on paper
- or whether it should land a minimal real linked receive seam in code

Why it matters:
- without a hard first-cut line, `12C` can sprawl into later `Publish / Receive Execution`
- it also risks drifting into Browser hierarchy work that belongs in `SP` / `AS`

Humanized summary:
- what is the smallest real `12C` implementation that still counts?

Open decision target:
- define the minimum first implementation cut that makes cross-graph ownership real without trying to finish the whole reuse system

Suggested answer:
- the first real `12C` cut should include:
  - ownership rules for `Publish / Receive`
  - a minimal authored receive/reference seam
  - explicit linked cross-graph identity
  - unresolved behavior when the source publication is missing or no longer valid
- the first real `12C` cut should not require:
  - polished Browser UI for received content
  - hard-copy UX
  - final assembly/object/part visualization of received content
  - final export behavior for linked references

Working rule:
- `12C` should land one honest linked receive path
- later `Publish / Receive Execution` phases can deepen the feature

Why this is the right cut:
- it makes `12C` real in code instead of remaining purely conceptual
- it stops short of the later lane that owns the fuller execution/polish wave
- it gives later Browser and output-structure phases a real cross-graph seam to read

Short version:
- `12C` should ship one minimal linked receive path, not only paper rules and not the whole final system

###### [12C] Q6 - `Where should the receive relationship actually live in the first pass of GE - Phase 12C?`

This asks:
- whether the receive relationship belongs in graph-authored state
- project-owned composition state
- or both with an explicit authored-versus-derived split

Why it matters:
- this is the core ownership placement question for `12C`
- if it is placed in the wrong layer, cross-graph reuse will blur graph authorship and project composition again

Humanized summary:
- where does the app remember that one graph is receiving output from another graph?

Open decision target:
- define the first-pass ownership location for receive relationships

Suggested answer:
- the authored receive relationship should live in graph-authored graph state
- the graph should own:
  - the receive node or equivalent authored reference declaration
  - the source graph/output identity it points at
- project-owned state may later derive project composition from that relationship
- but project state should not become the authored source of truth for graph-to-graph receive declarations

Working rule:
- graph-authored receive intent lives with the receiving graph
- project-owned state may consume the result of that relationship, but does not author it

Why this is the right cut:
- it keeps graph-native truth in graph-authored state
- it preserves the `GraphDocument -> Graph Runtime -> Graph Output Declaration -> Project Composition` flow
- it prevents `useAppStore` from becoming the hidden owner of graph-to-graph authored behavior

Short version:
- receive declarations belong to the receiving graph
- project state reads the consequences later, but does not author the relationship

###### [12C] Q7 - `What is the minimum first-pass data shape for a receive reference in GE - Phase 12C?`

This asks:
- what exact first-pass record shape should represent a receive relationship
- without forcing the final long-range publish/receive feature surface

Why it matters:
- the implementation doc should not need to invent this shape ad hoc later
- it is the contract that will keep receive identity explicit and testable

Humanized summary:
- what exact fields should a first receive reference have?

Open decision target:
- define the minimum first-pass receive-reference contract

Suggested answer:
- the first-pass receive-reference shape should stay small and explicit, for example:

```ts
type GraphReceiveReference = {
  receiveId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  mode: 'link'
}
```

- if needed, the receiving graph can also carry the authored owner identity such as:
  - `receiveNodeId`
- first pass should not require:
  - hard-copy metadata
  - final assembly/object/part ids
  - export/package metadata
  - Browser row state

Working rule:
- one receive reference says:
  - who is receiving
  - which graph published
  - which published output entry is linked
  - which cross-graph mode is in use

Why this is the right cut:
- it is explicit enough to test and route
- it stays small enough to avoid over-design
- it aligns with the already-shipped graph-output identity model

Short version:
- keep the first receive-reference type minimal, explicit, and link-first

###### [12C] Q8 - `What proof bar should make GE - Phase 12C count as real?`

This asks:
- what the implementation must prove before `12C` can be called complete

Why it matters:
- without a proof bar, `12C` can claim completion while still being only a partial ownership sketch
- the phase needs a testable boundary before a dedicated task doc is written

Humanized summary:
- how do we know `12C` actually landed instead of only being described?

Open decision target:
- define the minimum automated and behavior proof bar for `12C`

Suggested answer:
- `12C` should count as real only when tests prove:
  - receive references resolve by explicit source graph/output identity
  - linked receive relationships update when the source published output changes
  - missing or removed source publication produces a clear unresolved state
  - active graph, focused viewport, and viewer target changes do not redefine cross-graph ownership
  - wrong-graph or stale writes cannot overwrite another graph's receive relationship
  - no label-based or UI-state-based identity inference is required
- first pass does not need to prove:
  - final Browser row UX
  - hard-copy interaction
  - final export restrictions

Working rule:
- `12C` proof should test ownership and identity behavior first, not polish

Why this is the right cut:
- it gives the later task doc a concrete acceptance bar
- it keeps the phase architecture-focused
- it ensures the feature is real enough for later workspace phases to build on

Short version:
- `12C` is complete when linked cross-graph ownership is explicit, stable, and test-proven

###### [12C] Q9 - `What must stay out of GE - Phase 12C so it does not collapse into later publish/receive execution or Browser work?`

This asks:
- where the final stop line should be for the `12C` ownership phase

Why it matters:
- `12C` sits right before several tempting follow-up lanes
- if the stop line is not explicit, the task doc will absorb too much future work

Humanized summary:
- what should `12C` refuse to do, even if it feels nearby?

Open decision target:
- define the exact out-of-scope line for `12C`

Suggested answer:
- keep these out of `12C`:
  - polished Browser surfaces for received content
  - final `Component -> Object -> Part` Browser-facing structure
  - hard-copy UX and broader content-conversion tooling
  - export/package semantics for linked references
  - richer visibility/material/reference workspace behavior
  - broader `Publish / Receive Execution` workflow polish
- `12C` should stop at:
  - cross-graph ownership rules
  - minimal linked receive identity and authored relationship shape
  - one honest linked receive seam
  - unresolved/missing-source behavior

Working rule:
- `12C` owns ownership and minimal linked composition
- later lanes own deeper execution, Browser, and workspace behavior

Why this is the right cut:
- it protects the phase boundary
- it keeps `GE` focused on ownership rather than UI/system polish
- it preserves clear later homes for the richer publish/receive and Browser work

Short version:
- `12C` defines cross-graph ownership and one minimal linked receive path
- later lanes finish the user-facing system

###### Decision Checklist

- [x] [12A] Q1 - What is the minimum first-pass `Project File` shape that `GE - Phase 12A` should make canonical?
- [x] [12A] Q2 - What exactly should project-level graph collection ownership own in `GE - Phase 12A`?
- [x] [12A] Q3 - How should `GE - Phase 12A` separate durable project data from app-runtime-only graph state?
- [x] [12B] Q1 - What is the minimum project content tree shape that `GE - Phase 12B` should define above graph-authored outputs?
- [x] [12B] Q2 - What should `Component` mean in the first pass of `GE - Phase 12B`?
- [x] [12B] Q3 - Where should assembly and object parenting authority live relative to graph-authored truth in `GE - Phase 12B`?
- [x] [12B] Q4 - What must stay out of `GE - Phase 12B` so it does not collapse into the later Browser workspace lane?
- [ ] [12C] Q1 - What is the first-pass `publish / receive` model across graph documents in `GE - Phase 12C`?
- [ ] [12C] Q2 - How should `GE - Phase 12C` distinguish `Link` versus `Hard Copy` when graph content crosses document boundaries?
- [ ] [12C] Q3 - What identity and reference keys must cross-graph ownership carry in `GE - Phase 12C`?
- [ ] [12C] Q4 - Which singleton assumptions must `GE - Phase 12C` break so project-level ownership becomes real?
- [ ] [12C] Q5 - What is the exact first implementation cut for `GE - Phase 12C`?
- [ ] [12C] Q6 - Where should the receive relationship actually live in the first pass of `GE - Phase 12C`?
- [ ] [12C] Q7 - What is the minimum first-pass data shape for a receive reference in `GE - Phase 12C`?
- [ ] [12C] Q8 - What proof bar should make `GE - Phase 12C` count as real?
- [ ] [12C] Q9 - What must stay out of `GE - Phase 12C` so it does not collapse into later publish/receive execution or Browser work?

### Phase 12 CheckList

- [x] `12A` project-file core and graph collection ownership
  - [x] define first-pass `Project File` ownership beyond the synthetic runtime `projectFileId`
  - [x] define the minimum canonical `Project File` shape
  - [x] define graph-document collection ownership inside the project layer
  - [x] separate durable project-owned data from runtime/editor/viewer-only state
- [x] `12B` project content tree ownership
  - [x] define the project-content tree boundary versus graph-authored truth
  - [x] define first-pass `Component` meaning as the graph-produced bundle
  - [x] define project-level assembly/object parenting above graph-authored outputs
  - [x] keep Browser-facing hierarchy polish out of the first ownership pass
- [ ] `12C` cross-graph ownership rules
  - [ ] define cross-graph ownership and composition rules
  - [ ] define first-pass `publish / receive` behavior between graph documents
  - [ ] define `Link` versus `Hard Copy`
  - [ ] define minimum cross-graph identity/reference requirements
  - [ ] identify singleton assumptions that block real multi-document ownership
  - [ ] define the exact first implementation cut
  - [ ] define where receive relationships live as authored truth
  - [ ] define the minimum receive-reference contract
  - [ ] define the minimum proof bar
  - [ ] define the explicit out-of-scope boundary
- [ ] family boundary discipline
  - [ ] keep richer Browser workspace controls in their later `SP` / `VR` homes
  - [ ] keep Browser-facing output-structure polish in its later `AS` home

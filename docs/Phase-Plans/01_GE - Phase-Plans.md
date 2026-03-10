# GE - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
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

## [ ] - GE - Phase 11 - `Graph Persistence And Save Load`

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
- `11B` has a task doc
- `11C` has a task doc

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

##### Open Questions To Lock Before / During Implementation

- [ ] `11B` dirty-state rule
  - what exactly makes a cached graph row become `dirty`?
  - recommended default:
    - any graph-authored change after load/save
    - not viewport state
    - not Browser focus/open state
- [ ] `11B` close behavior
  - if a cached graph is closed from all editors, should it stay in Browser memory?
  - recommended default:
    - yes
    - stay cached until the user explicitly removes it
- [ ] `11B` duplicate-load identity rule
  - if the same file is loaded again and the app keeps it as a new cached copy, should that new copy get a new live `graphDocumentId`?
  - recommended default:
    - yes
    - avoid identity collisions between copies
- [ ] `11B` Browser row state
  - should `11B` show simple `dirty/saved` state on Browser graph rows?
  - recommended default:
    - yes
- [ ] `11B` richer row bars
  - should `11B` also own richer Browser row loading/build bars?
  - locked direction:
    - no
    - keep richer loading/build bars deferred to later Browser/build-control work
- [ ] `11C` default Browser open action
  - when a user opens a graph from Browser, should the default behavior reuse/focus the current editor or open a new one?
  - recommended default:
    - reuse/focus current editor unless the user explicitly chooses `Open In New Editor`
- [ ] `11C` `Load Into New Graph` meaning
  - what exactly should `Load Into New Graph` do?
  - recommended default:
    - create a new editable graph copy from loaded content with a new live identity
- [ ] `11C` save target rule
  - should save act on the cached Browser row, the focused editor graph, or both?
  - recommended default:
    - save the cached graph entry the focused editor is currently bound to
- [ ] `11C` focus-follow rule
  - after `Swap Current Editor`, should Browser focus follow the new bound graph automatically?
  - recommended default:
    - yes

### Phase 11 CheckList

- [x] `11A` persistence core exists
  - [x] one graph document can be saved
  - [x] one graph document can be loaded
  - [x] load validation uses the canonical parser boundary
- [ ] `11B` cached graph lifecycle
  - [ ] define saved graph versus cached live graph behavior
  - [ ] define Browser-owned cached graph entries
  - [ ] support reopen/focus behavior for cached entries
  - [ ] lock dirty-state rules
- [ ] `11C` editor interaction policy
  - [ ] separate `Open Graph` from `Load Into New Graph`
  - [ ] separate `Open In New Editor` from `Swap Current Editor`
  - [ ] keep Browser cached-entry ownership separate from viewport identity
- [ ] family-level identity discipline
  - [ ] keep saved-file identity, cached-entry identity, graph-document identity, and viewport identity explicit
  - [ ] avoid silent copy/replace behavior

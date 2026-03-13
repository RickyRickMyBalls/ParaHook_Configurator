# 8 Codex Chat Notes

## Doc Header

### Doc Notes

- Working notes for the current planning pass after reading:
  - `docs/Doc-Index.md`
  - `docs/CHANGELOG.md`
  - `docs/Human-Plans/roadmap/roadmap.md`
  - `docs/Human-Plans/Decisions.MD`
  - `docs/Phase-Plans/Tasks/Future/01.07 - GE - Phase 11B.md`
  - `docs/Phase-Plans/Tasks/Future/01.08 - GE - Phase 11C.md`
- Use this file as the temporary Codex scratchpad for:
  - current-state summary
  - next implementation candidates
  - open planning questions before implementation

## Doc Body

## Session 1 Notes

##### [92] 2026-03-10 00:00 - Current State Snapshot

Current read:

- `9A`, `9B`, `9C`, and `11A` are implemented.
- `11B` and `11C` are the most implementation-ready near-term task docs.
- `SP 10` and `GE 12` are roadmap-broken-down, but they do not yet have dedicated task docs.
- `[1.5] SP - Phase 11 - Graphs Panel And Nested Parts` is the main Lane `[1]` planning gap still marked as not broken down enough.

Working consequence:

- the project has already done the groundwork for:
  - graph documents
  - Browser/editor viewport coordination
  - graph-local compile/preview prep
  - low-level graph save/load persistence
- the next work should probably choose between:
  - implementing `11B`
  - implementing `11C`
  - tightening the planning/doc surface for `SP 10`, `GE 12`, or `[1.5]`

##### [93] 2026-03-10 00:00 - Current Boundary Read

Locked enough already:

- `11B`
  - Browser owns cached graph entries
  - saved graph != cached live graph
  - cached graph identity must stay separate from viewport identity
- `11C`
  - editor-facing actions must stay explicit
  - `Open Graph`, `Load Into New Graph`, `Open In New Editor`, and `Swap Current Editor` should not blur together
- later phases
  - `SP 10` owns graph-aware routing
  - `GE 12` owns project-level graph collection/content ownership
  - `[1.5]` owns the first richer Browser hierarchy surface

Main planning pressure:

- the docs already lock many ownership rules
- the biggest remaining ambiguity is less about architecture direction and more about:
  - which near-term cut should land first
  - what exact user-facing behavior should be considered the first acceptable implementation for that cut

##### [94] 2026-03-10 00:00 - Questions To Resolve Before Implementation

Questions for the next user pass:

- do we want the next code implementation to be `11B` first, `11C` first, or a planning/doc pass for another lane first
- if `11B` is next:
  - should the first pass support loading from disk straight into a Browser cached entry immediately
  - should Browser rows already show only `dirty/saved`, or any additional state in this cut
- if `11C` is next:
  - what should be the default human-facing action when a user chooses a graph from the Browser:
    - focus existing editor
    - swap focused editor
    - open new editor
  - should `Load Into New Graph` mean cloning the loaded file contents into a brand new graph identity immediately
- if planning comes first:
  - should the next planning target be `[1.5] SP - Phase 11`
  - or should we instead create dedicated task docs for `SP 10A/10B/10C` or `GE 12A/12B/12C`

## Session 2 Notes

##### [95] 2026-03-10 00:00 - `/src/` Architecture Read

High-level structure:

- `src/main.tsx` is the real entry and boots app wiring before render.
- `src/app/main.tsx` and `src/app/AppShell.tsx` are the real runtime shell.
- `src/App.tsx` looks like leftover Vite boilerplate and is not the main app path.
- `src/app/`
  - app shell, panels, stores, build wiring, viewer bridge
- `src/app/spaghetti/`
  - graph authoring system, compiler, schema, runtime, editor UI
- `src/worker/`
  - build execution, pipeline, assemble/build message handling
- `src/viewer/`
  - Three.js viewer runtime
- `src/shared/`
  - shared request/result contracts and product schema

Working read:

- ParaHook is currently a hybrid app:
  - a legacy parameter/build pipeline still powers the worker side
  - a newer graph-document authoring system is increasingly real on the app side

##### [96] 2026-03-10 00:00 - App Shell And UI Ownership

UI shell read:

- `AppShell` owns the visible workspace frame:
  - left Browser/tools surface
  - center viewer
  - floating spaghetti editor panel when spaghetti mode is active
- `BrowserPanel` already provides a first Browser tree shape:
  - `Project`
    - `Graphs`
    - `Open Viewports`
- `SpaghettiPanel` and `SpaghettiEditor` are the active graph-editing surface.

Important implication:

- the Browser-side shell for `SP - Phase 11` is not hypothetical.
- it already exists as a live seam and should be evolved, not reinvented.

##### [97] 2026-03-10 00:00 - Store Split

Current store ownership:

- `useAppStore`
  - app-wide bridge store
  - legacy box params
  - build policy and worker-facing result state
  - mode switching
  - parts list / viewer-facing assembled state
- `useSpaghettiStore`
  - real owner of graph documents
  - graph runtime state
  - editor viewports
  - graph selection / drag / hovered-edge UI state
  - graph compile/build state
  - preview-preparation state

Important consequence:

- graph documents and editor viewports are already separate concepts in code.
- that supports the `11B` / `11C` planning boundary:
  - graph identity should stay separate from editor viewport identity

##### [98] 2026-03-10 00:00 - Current Build Path

Current end-to-end path:

- graph authoring happens in the spaghetti subsystem
- graph evaluation/compile runs through:
  - `evaluateGraph.ts`
  - `compileGraph.ts`
- graph build inputs are translated through:
  - `buildInputsToRequest.ts`
- translated requests are sent through:
  - `buildDispatcher.ts`
- worker execution still runs through the legacy-oriented worker pipeline:
  - `worker.ts`
  - `pipeline/buildPipeline.ts`
  - `buildModel.ts`

Working read:

- spaghetti is already real as an authoring layer
- but it still feeds a compatibility bridge into the older worker contract

##### [99] 2026-03-10 00:00 - Viewer And Preview Read

Viewer-side read:

- `ViewerHost` decides whether to render:
  - legacy parts
  - assembled result
  - spaghetti preview parts
- `previewPreparation.ts` is the key seam between graph outputs and viewer preview
- the viewer itself is already capable of rendering multiple result modes

Important implication:

- the app already has a meaningful separation between:
  - graph-document authoring
  - preview/result presentation
- that supports deferring richer Browser content hierarchy until later phases

##### [100] 2026-03-10 00:00 - `SP - Phase 11` / `11B` Relevant Seams

Most relevant current seams for near-term planning:

- Browser tree already exists but is still lightweight
- graph rows already open/focus graphs
- open viewport rows already focus/close editor viewports
- graph documents are already persisted separately from viewport state
- editor viewports can already rebind to different graph documents

Why this matters:

- `SP - Phase 11`
  - should evolve the existing Browser graph tree into the first official hierarchy surface
- `11B`
  - should likely formalize Browser-owned cached graph entries on top of the existing graph-document layer
- `11C`
  - should likely tighten explicit editor actions on top of the existing viewport-binding model

##### [101] 2026-03-10 00:00 - Main Transitional Truth

Best plain-language summary after reading `/src/`:

- the app is no longer "just a box builder"
- but it is also not yet fully a graph-native project/content system
- the real current state is:
  - graph-native authoring on the app side
  - legacy-compatible build execution on the worker side
  - an early Browser/editor shell that is now ready to be made more official

##### [102] 2026-03-10 00:00 - Preliminary Plan: Remove Legacy Structure Cleanly

Preliminary goal:

- move ParaHook from a hybrid app into a graph-native app with one clear runtime path
- remove legacy-only UI, state, contracts, and worker assumptions once graph-native replacements exist

Why this matters:

- the current codebase still carries a split mental model:
  - legacy param/build app
  - graph-native authoring app
- that makes ownership harder to reason about
- it also keeps the worker contract and UI shell more complicated than they should be long-term

Recommended cleanup sequence:

- Phase 1
  - finish Browser/project-side graph ownership work first
  - make graph documents, Browser hierarchy, and project-content ownership fully explicit
- Phase 2
  - replace legacy worker request assumptions with graph-native build contracts
  - stop translating graph outputs through compatibility patch keys
- Phase 3
  - replace legacy viewer/build presentation paths with graph/project-content-native presentation paths
- Phase 4
  - remove legacy mode toggle and legacy-only panels once graph-native workflows cover the same core use cases
- Phase 5
  - remove dead compatibility code, unused store branches, and old product-schema assumptions

Main legacy seams likely to remove later:

- `useAppStore` ownership that only exists for box-param editing
- `BoxPanel` and legacy parameter sliders
- `Legacy` vs `Spaghetti` mode split in the toolbar/app shell
- worker request/result shapes that assume `BoxParams`-centric builds
- compatibility translation in `buildInputsToRequest.ts`
- legacy-oriented product/build assumptions in worker-side model code

Guardrail:

- do not remove legacy infrastructure just because it is old
- remove it only after the graph-native path owns:
  - authoring
  - build execution
  - Browser/project hierarchy
  - viewer presentation

Working conclusion:

- a clean app probably means:
  - one graph/project-native store model
  - one build contract
  - one Browser/workspace model
  - no app-wide "legacy mode" branch
- but that should be treated as a staged cleanup plan after the next graph/project phases land, not as an immediate refactor

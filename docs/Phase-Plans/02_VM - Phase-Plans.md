# VM - Phase-Plans

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
4. 2026-03-08 00:00: Tightened the header area to use the clearer two-step naming `Fold Hack 3` and `Fold Hack 4`, with the real housekeeping sections kept at `#####`
3. 2026-03-08 00:00: Updated this family file to the settled family phase-plan layout by removing `Doc Body`, moving phase titles to `##`, adding the overview-side `Fold Hack 4` wrapper, and keeping checklist content directly visible under each phase checklist
2. 2026-03-07 17:01: Folded the legacy `VM ([009])` checklist detail from `docs/TaskHistoryCompilation.md` into `VM - Phase 1` so the family doc now holds that checklist truth directly
1. 2026-03-07 16:42: Built this file as the family-level `VM` phase doc using `docs/CHANGELOG.md` as the primary evidence source and the `OO` / `GE` family docs as the structure template

##### Purpose

This file is the simple phase-family history document for the `VM` prefix.

Use this file for:
- the canonical `VM` phase sequence
- a simple explanation of what each `VM` phase did
- understanding how the view-model/store layer evolved over time
- seeing where major `VM` work clusters belong

Do not use this file for:
- phase-setup rules
- the canonical master prefix list
- the detailed checklist for one active task file
- the full proof/history that belongs in dedicated detailed phase task docs

##### What `VM` Means

`VM` is the canonical view-model / selector-discipline prefix.

It is used when the main work is about:
- selector discipline
- derived view-model state
- instance-aware store shaping
- UI-facing state preparation
- keeping render surfaces fed by stable, deliberate derived data

##### Format And Depth

Use this file as the planning and checklist home for canonical `VM` phases.

For the canonical family phase-plan structure and folding rules, see:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - `### Family Phase-Plan Format Rule`

This file follows that setup rule rather than redefining the formatting locally.

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [x] - VM - Phase 1 - `Selector Discipline` - Reconstructed

Human Summary: This established selector discipline as an explicit architectural rule so UI-facing state would be read through deliberate derived boundaries instead of loose direct access patterns.

### Phase 1 Overview
#### Fold Hack 4
##### Phase Notes

This is the first confirmed `VM` phase in the reconstructed history band.

It sets the conceptual foundation for the later view-model and selector work.

##### Files Changed

- [x] Selector and state access files
  - [x] `src/app/store/selectors.ts`
  - [x] `src/app/store/useAppStore.ts`
- [x] UI consumer files
  - [x] `src/app/components/ViewerHost.tsx`
  - [x] `src/app/panels/PartsListPanel.tsx`
  - [x] `src/app/panels/BuildStatusPanel.tsx`

##### Phase Summary

Main outcomes:
- established selector discipline as a real system rule
- moved UI-facing state access away from broad store reads and toward deliberate derived boundaries
- made rerender ownership and subscription scope part of the architecture story instead of a later cleanup
- laid the baseline for later instance-aware state shaping and selector-backed UI contracts

### Phase 1 CheckList

- [x] Selector-first architecture baseline
  - [x] establish selector discipline as a canonical architecture rule
  - [x] treat selectors as architecture rather than late optimization
  - [x] establish source-state versus read-model discipline early
- [x] UI subscription shaping
  - [x] move the UI/state layer toward deliberate derived access patterns
  - [x] use selectors early for narrow Zustand subscriptions
  - [x] prevent whole-store subscriptions from becoming the default restart pattern
- [x] Early scalability and rerender control
  - [x] keep rerender boundaries explicit even on stub geometry
  - [x] use selector discipline to keep the restart UI scalable

## [x] - VM - Phase 2 - `Instance-Aware Store And ViewModel Baseline` - Reconstructed

Human Summary: This gave the store and view-model layer an instance-aware baseline so selectors and UI state could be derived against the right scoped data instead of assuming one flat shared model.

### Phase 2 Overview
#### Fold Hack 4
##### Phase Notes

This is the first later reconstructed `VM` phase after the initial selector-discipline foundation.

##### Files Changed

- [x] Store and selector files
  - [x] `src/app/store/useAppStore.ts`
  - [x] `src/app/store/selectors.ts`
- [x] Shared identity and consumer files
  - [x] `src/shared/partsTypes.ts`
  - [x] `src/app/panels/PartsListPanel.tsx`

##### Phase Summary

Main outcomes:
- established an instance-aware store baseline instead of assuming one flat monolithic output path
- connected that baseline to the view-model layer so selectors and UI surfaces could reason about scoped identities
- prepared the app for later multi-part, parts-list, and derived-selector work on top of cleaner ownership boundaries

### Phase 2 CheckList

- [x] Instance-aware baseline
  - [x] establish an instance-aware store baseline
  - [x] make instance-aware state and view-model shaping part of the baseline
  - [x] reduce single-instance assumptions across store and UI logic
- [x] View-model alignment
  - [x] align the view-model layer with that instance-aware structure
  - [x] prepare the app for more than one owned part/view path
  - [x] create the baseline for later derived selector work

## [x] - VM - Phase 3 - `UI Stabilization - Composite Map State + Output Leaf Rendering`

Human Summary: This stabilized the UI-facing view-model path by tightening composite map state and output leaf rendering behavior so the editor could render nested composite data more predictably.

### Phase 3 Overview
#### Fold Hack 4
##### Phase Notes

This is the first strong modern `VM` phase in the shipped changelog block.

##### Files Changed

- [x] Canvas and node rendering files
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/NodeView.tsx`
- [x] Row/composite state files
  - [x] `src/app/spaghetti/canvas/rowViewMode.ts`
  - [x] `src/app/spaghetti/canvas/compositeExpansion.ts`
- [x] Verification files
  - [x] `src/app/spaghetti/canvas/rowViewMode.test.ts`
  - [x] `src/app/spaghetti/canvas/compositeExpansion.test.ts`
  - [x] `src/app/spaghetti/compiler/compileGraph.test.ts`
  - [x] `docs/listofchanges.md`

##### Phase Summary

Main outcomes:
- stabilized composite map state as a deliberate canvas-owned UI concern rather than scattered local render behavior
- moved node evaluation and derived display shaping upward into `SpaghettiCanvas` instead of leaving it inside `NodeView`
- improved output leaf rendering so composite rows, leaf anchors, and row modes behave more deterministically across the UI-facing path

##### Phase Sub-Phases

- composite map state stabilization
- output leaf rendering stabilization

### Phase 3 CheckList

- [x] Row-mode helper shaping
  - [x] add row-mode helper flags in `rowViewMode` limited to row concerns only
  - [x] keep row modes render-only and deterministic
- [x] Composite expansion state
  - [x] add composite expansion key helper with exact parent-key format
  - [x] move composite expansion ownership to `SpaghettiCanvas` using `Map<string, boolean>`
  - [x] keep parent-row scoped expansion state for both `in` and `out` directions
- [x] Render-path cleanup
  - [x] remove `evaluateSpaghettiGraph` usage from `NodeView`
  - [x] prepare node evaluation and derived display data in `SpaghettiCanvas`
  - [x] keep `NodeView` render-focused and memoized
  - [x] replace per-node inline hover/drop wrappers with stable shared callbacks
- [x] Output leaf rendering
  - [x] implement deterministic field-tree traversal and mode-gated output leaf rendering
  - [x] ensure output leaf anchors mount only when leaf rows are visible
  - [x] keep parent anchors mounted
  - [x] make composite-derived rendering more predictable

## [x] - VM - Phase 4 - `Derived View Model Selectors`

Human Summary: This formalized derived view-model selectors so more UI state could be prepared through stable selector logic instead of ad hoc render-time computation.

### Phase 4 Overview
#### Fold Hack 4
##### Phase Notes

This phase follows naturally from the earlier selector-discipline and instance-aware store work.

##### Files Changed

- [x] Selector layer files
  - [x] `src/app/spaghetti/selectors/selectNodeVm.ts`
  - [x] `src/app/spaghetti/selectors/selectDriverVm.ts`
  - [x] `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - [x] `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
  - [x] `src/app/spaghetti/selectors/index.ts`
- [x] Selector test files
  - [x] `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - [x] `src/app/spaghetti/selectors/selectDriverVm.test.ts`
  - [x] `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
  - [x] `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
- [x] UI consumer files
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/components/ViewerHost.tsx`
  - [x] `docs/CHANGELOG.md`

##### Phase Summary

Main outcomes:
- introduced a dedicated deterministic selector layer for node, driver, preview, and diagnostics view models
- pushed more UI-facing state preparation into pure derived selectors instead of ad hoc canvas/viewer render logic
- turned the VM layer into a clearer contract surface that later selector hardening could build on directly

### Phase 4 CheckList

- [x] Selector layer foundation
  - [x] add pure deterministic selector layer under `src/app/spaghetti/selectors/`
  - [x] add `selectNodeVm` for node-card derived rows/details/composite input state
  - [x] add `selectDriverVm` for driven driver row state and offset/effective derivation
  - [x] add `selectPreviewRenderVm` as preview parity wrapper with `isReady` metadata
  - [x] add `selectDiagnosticsVm` for merged stable grouped diagnostics VM
- [x] UI integration
  - [x] refactor `SpaghettiCanvas` node render-data derivation to use `selectNodeVm`
  - [x] route diagnostics grouping through `selectDiagnosticsVm`
  - [x] update viewer preview wiring to use `selectPreviewRenderVm`
  - [x] move more UI-facing state into derived selector logic
- [x] Verification and determinism
  - [x] add selector test coverage for deterministic ordering and offset-mode correctness
  - [x] add parity/idempotence coverage for preview and diagnostics selectors
  - [x] reduce looser render-time computation patterns

## [x] - VM - Phase 5 - `Selector Contract Hardening`

Human Summary: This hardened the selector contract so the view-model layer had clearer guarantees about what selectors return and how downstream UI code should depend on them.

### Phase 5 Overview
#### Fold Hack 4
##### Phase Notes

This is the current latest confirmed `VM` phase in the changelog.

##### Files Changed

- [x] Hardened selector contract files
  - [x] `src/app/spaghetti/selectors/index.ts`
  - [x] `src/app/spaghetti/selectors/selectDiagnosticsVm.ts`
  - [x] `src/app/spaghetti/selectors/selectDriverVm.ts`
  - [x] `src/app/spaghetti/selectors/selectNodeVm.ts`
  - [x] `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- [x] Selector verification files
  - [x] `src/app/spaghetti/selectors/index.test.ts`
  - [x] `src/app/spaghetti/selectors/selectDiagnosticsVm.test.ts`
  - [x] `src/app/spaghetti/selectors/selectDriverVm.test.ts`
  - [x] `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - [x] `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
  - [x] `src/app/spaghetti/selectors/__snapshots__/selectDiagnosticsVm.test.ts.snap`
  - [x] `src/app/spaghetti/selectors/__snapshots__/selectDriverVm.test.ts.snap`
  - [x] `src/app/spaghetti/selectors/__snapshots__/selectNodeVm.test.ts.snap`
  - [x] `src/app/spaghetti/selectors/__snapshots__/selectPreviewRenderVm.test.ts.snap`
- [x] Consumer cleanup files
  - [x] `src/app/spaghetti/partsList/selectPartsListItems.ts`
  - [x] `src/app/spaghetti/partsList/selectPartsListItems.test.ts`
  - [x] `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - [x] `src/app/spaghetti/canvas/NodeView.tsx`
  - [x] `src/app/spaghetti/canvas/WireLayer.tsx`
  - [x] `src/app/spaghetti/canvas/NodeView.test.tsx`
  - [x] `src/app/components/ViewerHost.tsx`
  - [x] `src/app/panels/PartsListPanel.tsx`
  - [x] `docs/CHANGELOG.md`

##### Phase Summary

Main outcomes:
- hardened selector outputs into more explicit UI-facing contracts with stable identities and shared barrel access
- removed more remaining UI-local shaping from canvas, preview, and parts-list consumers in favor of selector-provided data
- strengthened the VM-to-UI boundary so render surfaces depend on stable prepared view models rather than reshaping raw state on their own

### Phase 5 CheckList

- [x] Contract hardening
  - [x] standardize selector access through `src/app/spaghetti/selectors/index.ts`
  - [x] expand barrel exports for hardened VM contracts and types
  - [x] harden `selectNodeVm`, `selectDriverVm`, `selectPreviewRenderVm`, and `selectDiagnosticsVm` contracts and identities
  - [x] add same-reference memoization guards across hardened selectors where safe
- [x] Consumer cleanup
  - [x] remove remaining target UI-local shaping from raw graph/state
  - [x] make `SpaghettiCanvas` pass selector-provided node display metadata to `NodeView`
  - [x] make `NodeView` consume selector-provided driver grouping and preview row identities
  - [x] make `PartsListPanel` consume selector-shaped panel VM
  - [x] make `ViewerHost` consume selector-provided preview VM
- [x] Verification and contract confidence
  - [x] add selector barrel contract test
  - [x] add VM snapshot coverage for Node/Driver/Preview/Diagnostics contracts
  - [x] clarify selector-output expectations for downstream UI code
  - [x] strengthen the stability of the VM / UI boundary

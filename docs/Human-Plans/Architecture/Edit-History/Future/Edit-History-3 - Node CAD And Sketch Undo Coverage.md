# Edit History 3 - Node CAD And Sketch Undo Coverage

## Doc Header

### Doc History
29. 2026-05-01 20:11:10: Added a cross-plan handoff to `Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation`, clarifying that editor window density, `O` overlay presentation state, overlay titlebar controls, and overlay readability settings are owned by the Spaghetti Editor shell plan and should remain excluded from canonical node-CAD undo unless a later workspace-history owner explicitly takes presentation-state history.
28. 2026-05-01 20:01:21: Implemented and closed `Edit-History-3 / Phase 7 - Node Deletion Surface History Parity` after canvas selected-node Delete/Backspace deletion was routed through canonical `Remove graph node` history, selected-edge delete precedence was preserved, focused canvas deletion, graph-history, Console delete regression, and production build verification passed, and `Edit-History-3-CLG-19` became ready for Manager acceptance.
27. 2026-05-01 19:49:54: Prepped `Edit-History-3 / Phase 7 - Node Deletion Surface History Parity` for implementation after confirming Console `node.delete` already uses `removeGraphNodeWithHistory(...)`, the store/test seam already proves `Remove graph node` undo/redo including related edges, and the first code cut should add canvas selected-node Delete/Backspace deletion through the canonical helper while preserving selected-edge delete precedence, selection clearing, waypoint cleanup, and user feedback behavior.
26. 2026-05-01 19:48:36: Added `Edit-History-3 / Phase 7 - Node Deletion Surface History Parity` after Phase 6 closed node creation parity, keeping Console `node.delete` as the accepted `removeGraphNodeWithHistory(...)` reference seam while planning remaining user-facing node deletion surfaces to create canonical `Remove graph node` snapshots without widening into edge deletion, feature-stack remove, or sketch-session delete behavior.
25. 2026-05-01 19:44:56: Implemented and closed `Edit-History-3 / Phase 6 - Node Creation Surface History Parity` after canvas menu-created Sketch and Extrude nodes and `SpaghettiPanel` part-node creation were routed through canonical `Add graph node` history, focused graph-history and creation-surface tests passed, and the production build passed with known Vite warnings.
24. 2026-05-01 19:40:23: Prepped `Edit-History-3 / Phase 6 - Node Creation Surface History Parity` for implementation after confirming `addGraphNodeWithHistory(...)` is the accepted graph-structure snapshot seam, Console-created missing Sketch nodes already prove the reference behavior, and the first code cut should replace direct `applyGraphCommand(addNodeCommand(...))` calls in `SpaghettiCanvas` and `SpaghettiPanel` while preserving placement, spawn mode, selection, and user feedback behavior.
23. 2026-05-01 19:37:20: Added `Edit-History-3 / Phase 6 - Node Creation Surface History Parity` after research found canvas node-add menu and `SpaghettiPanel` node creation paths still use direct graph commands instead of the canonical `addGraphNodeWithHistory` snapshot seam used by console-created Sketch and Extrude nodes.
22. 2026-05-01 18:50:31: Implemented and closed `Edit-History-3 / Phase 5` after Extrude node-template Type, Direction, Depth, Start Depth, End Depth, Taper Angle, and Output row commits gained canonical graph-parameter history coverage with focused undo/redo and driven-row proof.
21. 2026-05-01 18:43:00: Prepped `Edit-History-3 / Phase 5 - Extrude Node Template Row Parameter Commits` for implementation against the live `NodeView` Extrude template, confirmed the authored schema keys and row commit seams, split Depth coverage across one-sided/symmetric and two-sided depth rows, and locked the first code cut plus focused verification targets.
20. 2026-05-01 18:35:27: Added `Edit-History-3 / Phase 5 - Extrude Node Template Row Parameter Commits` after user review clarified the newer Extrude node-template rows for Type, Direction, Depth, Taper Angle, and Output should receive canonical history coverage as part of the longer-range direction that every authored node row eventually logs through Edit History.
19. 2026-04-22 02:25:19: Manager accepted `Edit-History-3 / Phase 4 - Sketch Draft And Runtime Exclusion Proof` after rerunning the focused sketch/runtime exclusion suite, sketch-history regression, graph-history regression, and production build gate; `Edit-History-CLG-15` and `Edit-History-CLG-16` are complete, while `Edit-History-CLG-12` remains open for a future feature remove/delete seam.
18. 2026-04-22 02:23:32: Implemented `Edit-History-3 / Phase 4 - Sketch Draft And Runtime Exclusion Proof`: focused exclusion tests now prove local `geometrySketchSession` draft/session actions, current finish/delete sketch-session graph mutations, representative graph runtime/build/preview/result/cache operations, and cached graph save metadata do not create canonical edit-history entries; authored sketch undo/redo was proven not to capture or restore excluded sketch-session draft or runtime state, focused sketch/runtime exclusion, sketch-history regression, graph-history regression, and production build verification passed, and `Edit-History-CLG-15` and `Edit-History-CLG-16` are ready for Manager acceptance while the `Edit-History-CLG-12` feature remove gap remains open.
17. 2026-04-22 02:20:23: Manager reviewed and approved the `Edit-History-3 / Phase 4 - Sketch Draft And Runtime Exclusion Proof` prep after confirming the local `geometrySketchSession` draft/session seams, current finish/delete graph-mutation ambiguity, representative graph runtime/cache seams, and accepted sketch-history restore path; implementation is cleared for focused exclusion/protection tests only, with no routing of geometry sketch session commands into canonical history.
16. 2026-04-22 02:15:44: Manager accepted `Edit-History-3 / Phase 3 - Committed Sketch Edits` after rerunning focused sketch-history store, FeatureStack UI, feature-stack regression, graph-history regression, and production build verification; `Edit-History-CLG-14` is complete while `Edit-History-CLG-15`, `Edit-History-CLG-16`, and the `Edit-History-CLG-12` feature remove gap remain open.
14. 2026-04-22 02:16:22: Tightened `Edit-History-3 / Phase 4 - Sketch Draft And Runtime Exclusion Proof` into a Worker-ready prep spec after researching `geometrySketchSession`, sketch draw commands, draw draft/hover/selection-window state, sketch-session finish/cancel/delete paths, graph runtime build/preview/result state, cached graph metadata, and the accepted sketch-history restore path; Phase 4 is scoped to proof/guard coverage for `Edit-History-CLG-15` and `Edit-History-CLG-16` without implementing local draft undo or runtime/cache/provider history.
13. 2026-04-22 02:13:03: Implemented `Edit-History-3 / Phase 3 - Committed Sketch Edits`: durable authored sketch component add/reorder/delete operations now create canonical sketch-history entries, sketch point and cube-seed rectangle dimension ticks stay live/history-free until one semantic interaction-end commit, undo/redo restores authored sketch feature-stack data through the graph document path, focused sketch-history store, FeatureStack UI, feature-stack regression, and production build verification passed, and `Edit-History-CLG-14` is ready for Manager acceptance while local sketch-session undo remains deferred.
12. 2026-04-22 02:08:32: Manager reviewed and approved the `Edit-History-3 / Phase 3 - Committed Sketch Edits` prep after confirming the live durable sketch component setters and local `geometrySketchSession` draft boundary, and corrected the Phase 3 `FeatureValueBar` path before implementation dispatch.
11. 2026-04-22 02:06:58: Tightened `Edit-History-3 / Phase 3 - Committed Sketch Edits` into a Worker-ready prep spec after researching `SketchFeatureView`, `FeatureStackView`, `FeatureValueBar`, `useSpaghettiStore` sketch component setters, legacy sketch wrappers, and geometry sketch session/draft seams; Phase 3 is scoped to durable authored sketch component commits while local sketch-session undo remains deferred.
10. 2026-04-22 02:05:42: Manager dispatched retained Worker Rawls to prep `Edit-History-3 / Phase 3 - Committed Sketch Edits`, scoped to researching live sketch component/entity seams and tightening the implementation spec while keeping local sketch drafts, feature remove, runtime/cache/provider state, and later family surfaces out of scope.
9. 2026-04-22 02:05:42: Manager accepted `Edit-History-3 / Phase 2 - Feature Parameter Commits` after rerunning focused feature-parameter store, FeatureStack UI, feature-stack regression, graph-history regression, and production build verification; `Edit-History-CLG-13` is complete, while feature remove, committed sketch edits, local sketch draft undo, and runtime/cache/provider exclusions remain open.
8. 2026-04-22 02:01:48: Implemented `Edit-History-3 / Phase 2 - Feature Parameter Commits`: close-profile source and extrude profile-ref selects now create immediate canonical `Change feature parameter` entries, extrude depth/taper/offset numeric interactions collapse live ticks into one committed entry on interaction end, focused feature-parameter store/UI/regression verification and production build passed, and `Edit-History-CLG-13` is ready for Manager acceptance while `Edit-History-CLG-12`, committed sketch edits, local sketch draft undo, and runtime/cache/provider exclusions remain deferred.
7. 2026-04-22 01:57:35: Manager approved the `Edit-History-3 / Phase 2 - Feature Parameter Commits` prep after confirming the live feature parameter seams in `FeatureStackView`, `FeatureValueBar`, `ExtrudeFeatureView`, `CloseProfileFeatureView`, and `useSpaghettiStore`; implementation is cleared for close-profile source, extrude depth/taper/offset, and extrude profile reference commits while sketch component controls remain deferred.
6. 2026-04-22 01:56:08: Tightened `Edit-History-3 / Phase 2 - Feature Parameter Commits` into a Worker-ready prep spec after researching `FeatureStackView`, `FeatureValueBar`, `ExtrudeFeatureView`, `CloseProfileFeatureView`, `SketchFeatureView`, and `useSpaghettiStore` feature parameter setters; Phase 2 is scoped to existing close-profile source and extrude depth/taper/offset/profile-ref commits, with sketch component edits and feature remove coverage remaining deferred.
5. 2026-04-22 01:54:39: Manager accepted `Edit-History-3 / Phase 1` after rerunning focused feature-stack edit-history tests, feature dependency tests, graph-history regression tests, and the production build gate; Phase 1 is complete for supported add/reorder coverage, while `Edit-History-CLG-12` remains open for a future stable feature remove/delete seam.
4. 2026-04-22 01:52:58: Implemented `Edit-History-3 / Phase 1 - Feature Stack Entries` for supported add/reorder operations only: `addSketchFeature(...)`, `addCloseProfileFeature(...)`, `addExtrudeFeature(...)`, `moveFeatureUp(...)`, and `moveFeatureDown(...)` now create canonical feature-stack history entries with authored stack undo/redo, focused feature-stack history/dependency/graph-history verification and production build passed, and `Edit-History-CLG-12` remains open for future feature remove coverage.
3. 2026-04-22 01:49:34: Manager approved the `Edit-History-3 / Phase 1 - Feature Stack Entries` prep after confirming the live `FeatureStackView` and `useSpaghettiStore` feature add/reorder seams, dependency-safe `moveFeatureInStack(...)` behavior, and absence of a stable feature-stack remove/delete operation; implementation is cleared for add/reorder only, with `Edit-History-CLG-12` remaining open until remove coverage exists.
2. 2026-04-22 01:47:13: Tightened `Edit-History-3 / Phase 1 - Feature Stack Entries` into a Worker-ready prep spec after researching `FeatureStackView`, `FeatureValueBar`, `ExtrudeFeatureView`, feature-stack schema/dependency helpers, `useSpaghettiStore` feature-stack actions, and existing focused tests; the first implementation slice is scoped to supported feature add and dependency-safe reorder operations only, leaving unsupported feature remove, feature parameter commits, committed sketch edits, local sketch draft undo, and runtime/cache/provider state for later phases.
1. 2026-04-22 00:11:26: Created this `Edit History` future plan for node-owned CAD authoring, feature-stack edits, committed sketch edits, and the boundary between local sketch drafts and canonical authored undo.

### Purpose

This plan widens canonical undo from graph structure into node-owned CAD authoring.

## Doc Body

### Scope

In scope:
- node-owned CAD feature add/remove/reorder where supported
- committed feature parameter changes
- committed sketch entity creation, delete, transform, and constraint-like edits where supported
- clear local-draft versus committed-authored boundaries

Out of scope:
- sketch draft point-by-point undo before a committed entity exists
- geometry worker runtime progress
- result cache state
- preview-only geometry state
- feature types that do not yet have stable authored state
- Spaghetti Editor shell presentation state such as window density, `O` overlay mode, overlay titlebar controls, and overlay readability settings, which are tracked by `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Future/Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation.md`

### Acceptance Read

This phase is complete when node-owned CAD and committed sketch edits that already represent durable authored state can undo and redo through the same canonical history owner as graph edits.

## Vision

The graph is not only boxes and wires. For ParaHook, a node can own real modeling intent.

`Edit History 3` should make that authoring feel recoverable without pretending every transient sketch draft point or worker preview is durable authored state.

### Adjacent Plan Handoff

`Spaghetti-Editor 3 - Overlay O Mode And Window Density Separation` is a related editor-shell plan, not a node-CAD undo plan.

That plan owns:
- the `- / e / + / O` editor titlebar mode split
- restoring `e` to essential float-window meaning
- routing overlay-on-model-viewport behavior through `O`
- overlay titlebar controls, active graph labeling such as `O Graph 1`, direct overlay exit behavior, and first readability controls such as background transparency

For `Edit-History-3`, this means editor presentation state should stay outside canonical node-CAD undo:
- window density changes are not authored CAD history
- entering or leaving `O` overlay mode is not graph/node authored state
- overlay titlebar controls and overlay readability settings should not become `Add graph node`, `Remove graph node`, feature-stack, sketch, or graph-parameter history entries
- if presentation-state undo is ever desired, it should be planned under a workspace/editor-history owner rather than this node-owned CAD authoring lane

## Wishlist Organization

### High Level Goals

- [ ] `Edit-History-HLG-2` - Make node-owned CAD authoring, feature-stack edits, and committed sketch edits undoable through the same canonical owner.
- [ ] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.

### `Edit-History-3`

- [ ] `Edit-History-CLG-12` - Make stable feature-stack add/remove/reorder operations undoable where the app already supports those authored operations.
- [x] `Edit-History-CLG-13` - Make feature parameter commits undoable through the same transaction semantics as graph parameters.
- [x] `Edit-History-CLG-14` - Make committed sketch entity edits undoable after the edit becomes durable authored state.
- [x] `Edit-History-CLG-15` - Keep local sketch draft interactions outside canonical undo until they commit an authored entity.
- [x] `Edit-History-CLG-16` - Keep worker progress, preview geometry, and result cache state outside canonical undo.
- [x] `Edit-History-3-CLG-17` - Make authored Extrude node-template row commits undoable for Type, Direction, Depth, Taper Angle, and Output while preserving the long-range rule that every durable node row should eventually log through canonical Edit History.
- [x] `Edit-History-3-CLG-18` - Make every live user-facing graph node creation surface route through canonical `Add graph node` snapshots for Sketch, Extrude, and other user-addable nodes.
- [x] `Edit-History-3-CLG-19` - Make every live user-facing graph node deletion surface route through canonical `Remove graph node` snapshots for Sketch, Extrude, and other user-deletable nodes.

## [x] `Edit-History-3 / Phase 1` - `Feature Stack Entries`

Add canonical history entries for stable node-owned feature-stack edits.

### Phase 1 Summary

#### Purpose

Make the currently supported node-owned feature-stack authored operations undoable through the canonical edit-history owner.

Live research shows stable feature add and dependency-safe feature reorder operations exist today. Stable feature remove is not currently exposed in the store/UI as a feature-stack operation, so this phase should not claim all of `Edit-History-CLG-12`. Phase 1 should implement add/reorder history, then leave `Edit-History-CLG-12` open for a later remove-capable follow-up such as `Edit-History-3 / Phase 1.1 - Feature Stack Remove Entries`.

#### Owns

- canonical edit-history entries for supported feature-stack add operations:
  - `addSketchFeature(...)`
  - `addCloseProfileFeature(...)`
  - `addExtrudeFeature(...)`
- canonical edit-history entries for supported dependency-safe feature reorder operations:
  - `moveFeatureUp(...)`
  - `moveFeatureDown(...)`
- before/after authored `node.params.featureStack` restoration for the owning part node
- no-op protection for missing node, non-part node, missing feature, dependency-blocked reorder, unchanged stack, and unsupported remove paths
- focused tests proving undo/redo restores authored feature-stack order/content without capturing runtime/cache/provider state
- preserving the accepted graph document update path, graph-history owner contract, and existing feature dependency rules

#### Does Not Own

- feature remove/delete history because no stable feature remove operation is currently exposed
- closing all of `Edit-History-CLG-12`; only the add/reorder portion should advance in this phase
- `Edit-History-CLG-13` feature parameter commits, including `FeatureValueBar`, `ExtrudeFeatureView`, `setExtrudeDepth(...)`, `setExtrudeTaper(...)`, `setExtrudeOffset(...)`, and `setExtrudeProfileRef(...)`
- `Edit-History-CLG-14` committed sketch entity edits such as sketch component add/remove/move/update
- `Edit-History-CLG-15` local sketch draft undo before committed authored sketch entities exist
- `Edit-History-CLG-16` runtime/cache/provider changes beyond proof that feature-stack history does not capture those states
- feature collapsed UI state, section/group collapse state, selection, hover, camera/view, command transcript, command recall, Browser/project, Viewer Transform, Build Path, history UI, persistence, async entries, graph parameter commits, or console parity

#### Accepted Live Seams

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns the feature-stack mutation APIs currently called by the UI
  - `addSketchFeature(...)`, `addCloseProfileFeature(...)`, and `addExtrudeFeature(...)` append durable authored feature records into `node.params.featureStack`
  - `moveFeatureUp(...)` and `moveFeatureDown(...)` call `moveFeatureInStack(...)` and preserve dependency rules
  - `setFeatureEnabled(...)` is a durable feature authored state change, but it is not add/remove/reorder and should stay outside this Phase 1 slice
  - `toggleFeatureCollapsed(...)` changes UI state and should not become an authored feature-stack history target in this phase
  - `updatePartNodeFeatureStack(...)` updates part node feature stacks and recomputes close-profile outputs before graph document state is committed
  - `withUpdatedActiveGraphDocumentState(...)` keeps graph document state and feature-stack IR cache aligned; history restore should use this style of document update, not broad runtime/cache snapshots
- `src/app/spaghetti/features/featureDependencies.ts`
  - `moveFeatureInStack(...)` and `canMoveFeatureInStack(...)` already provide dependency-safe reorder/no-op behavior
  - `featureDependencies.test.ts` proves dependency-breaking reorders are rejected and valid reorders preserve deterministic ordering
- `src/app/spaghetti/ui/FeatureStackView.tsx`
  - renders `+ Sketch`, `+ Close Profile`, `+ Extrude`, `Up`, and `Down` controls that call the store APIs directly
  - no remove/delete button or store call is present for stack-level feature removal
- `src/app/spaghetti/ui/FeatureStackView.test.tsx`
  - currently covers feature-stack numeric interaction/build interaction, useful later for `Edit-History-CLG-13`
  - can gain tiny UI proof only if implementation touches UI wiring; preferred Phase 1 implementation should stay at the store seam
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - already includes focused feature-stack reorder and enable/disable semantics near the store
  - can be extended or avoided in favor of a new smaller feature edit-history test file

#### No-Widening Rules

Do not create a feature remove operation just to close `Edit-History-CLG-12`. If remove is not live, the implementation should mark Phase 1 as add/reorder complete and leave `Edit-History-CLG-12` open.

Do not implement feature parameter commit history in Phase 1. `FeatureValueBar`, `ExtrudeFeatureView`, `setExtrudeDepth(...)`, `setExtrudeTaper(...)`, `setExtrudeOffset(...)`, and `setExtrudeProfileRef(...)` stay for Phase 2 / `Edit-History-CLG-13` unless a minimal fixture is needed to create a valid reorder stack.

Do not implement committed sketch entity history, local sketch draft undo, sketch-plane transform undo, Browser/project undo, Viewer Transform undo, Build Path sync, history UI, persistence, async entries, runtime/cache/provider history, command transcript undo, command recall undo, graph parameter commits, or console command parity.

### Phase 1 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - add a small feature-stack history helper near the existing graph edit-history helpers or feature-stack mutation section
  - route supported feature add/reorder store APIs through the helper so existing UI calls become undoable without touching `FeatureStackView`
  - keep restore scoped to authored graph document state and derived feature-stack IR cache
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts` or a new `src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`
  - preferred focused home for feature-stack add/reorder history tests
  - prove undo/redo for sketch/close-profile/extrude adds and valid reorder
  - prove no-entry behavior for missing/non-part nodes, dependency-blocked reorder, and missing feature
  - prove feature collapsed UI state and runtime/cache/provider-like state are not captured
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - run or extend only if implementation changes existing feature-stack store semantics in a way the current tests should cover
- `src/app/spaghetti/features/featureDependencies.test.ts`
  - run as a regression gate if reorder dependency behavior is touched or relied on directly
- `src/app/spaghetti/ui/FeatureStackView.test.tsx`
  - run only if UI wiring changes; preferred first cut should not need UI changes
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
  - implementation closeout only after focused tests and build pass
- `docs/CHANGELOG.md`
  - implementation later only; this prep pass must not update it
- `docs/Doc-Log.md`
  - required for this prep and later implementation doc maintenance

#### Exact Implementation Boundary

The first code cut should add canonical history around existing supported store APIs, not invent new feature-stack behaviors:

- feature add:
  - `addSketchFeature(nodeId)`
  - `addCloseProfileFeature(nodeId)`
  - `addExtrudeFeature(nodeId)`
- feature reorder:
  - `moveFeatureUp(nodeId, featureId)`
  - `moveFeatureDown(nodeId, featureId)`

Use before/after authored feature-stack snapshots or before/after graph-document snapshots scoped to the owning part node. The history entry should restore the authored `node.params.featureStack` through the graph document update path so derived feature-stack IR recomputes from authored state. The entry must not snapshot accepted build outputs, preview geometry, worker progress, runtime cache, command transcript, command recall, selection, hover, or view state.

Stable labels should distinguish operation families enough for the history panel later, for example:

- `Add feature`
- `Reorder feature`

Use source metadata that identifies the Spaghetti feature stack surface, and target metadata for `nodeId` / feature id where available.

Do not route `setFeatureEnabled(...)` in this phase unless Manager explicitly widens the phase. It is durable authored state, but it is not add/remove/reorder and fits better as a separate feature state/parameter commit decision.

#### Focused Verification

Suggested focused commands for implementation:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`

If a new focused test file is added, run that exact file, for example:

- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`

If implementation changes or relies directly on existing store/dependency behavior, also run:

- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts -t "feature"`
- `npm.cmd test -- --run src/app/spaghetti/features/featureDependencies.test.ts`

If UI wiring changes despite the preferred store-only cut, also run:

- `npm.cmd test -- --run src/app/spaghetti/ui/FeatureStackView.test.tsx`

Record known unrelated broad store failures separately from Phase 1 failures if a broad test command is run.

#### Build Gate

Implementation should run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 1 failures.

#### Tracking Docs

This prep pass updates only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Do not update the family index during implementation; Manager will close index status after acceptance.

#### Stop Condition

Stop and report instead of widening if closing the requested behavior requires adding a new feature remove UI/API, redesigning feature-stack schema, changing feature dependency ordering rules, changing feature parameter controls, rewriting `FeatureStackView`, or adding a generic CAD command system.

Stop and report if undo/redo would need to capture runtime/cache/provider state, accepted build outputs, preview geometry, worker progress, command transcript, command recall, selection, hover, camera/view, Browser/project, Viewer Transform, Build Path, history UI, persistence, or async entries.

Stop and report if the only way to prove add/reorder history is to implement feature parameter commits, committed sketch entity history, or local sketch draft undo.

#### Done Shape

Phase 1 is done when supported feature-stack add and dependency-safe reorder operations commit canonical edit-history entries, undo/redo restore the authored part-node feature stack through the graph document update path, blocked/no-op operations create no entry, derived feature-stack IR follows restored authored state, focused tests pass, and production build passes.

Phase 1 should not mark `Edit-History-CLG-12` complete unless a stable feature remove operation is also found and routed through the same canonical seam during implementation. With the current live seams, the expected closeout is: Phase 1 complete for add/reorder coverage, `Edit-History-CLG-12` remains open, and a later remove-capable `Phase 1.1` or equivalent follow-up is needed before CLG-12 can close.

### Phase 1 Closeout

Status: complete for the approved add/reorder-only implementation slice.

Implemented:
- canonical `Add feature` entries for `addSketchFeature(...)`, `addCloseProfileFeature(...)`, and `addExtrudeFeature(...)`
- canonical `Reorder feature` entries for dependency-safe `moveFeatureUp(...)` and `moveFeatureDown(...)`
- authored part-node `featureStack` undo/redo restoration through the graph document update path
- no-entry protection for missing nodes, non-part nodes, missing features, top/bottom unchanged reorder, dependency-blocked reorder, and feature collapsed UI state
- focused proof that feature-stack history does not clear unrelated view/runtime-like store state

Verification passed:
- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/features/featureDependencies.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd run build`

`Edit-History-CLG-12` remains open because the app still has no stable feature-stack remove/delete operation. A later remove-capable follow-up should close the remaining CLG-12 coverage.

## [x] `Edit-History-3 / Phase 2` - `Feature Parameter Commits`

Add canonical entries for committed feature parameter changes.

### Phase 2 Summary

#### Purpose

Make existing durable feature parameter changes undoable through canonical edit history without turning every live slider tick into a separate entry.

This phase can target `Edit-History-CLG-13` in one implementation pass if it covers the concrete feature parameter seams currently exposed by the live app:

- close-profile source selection
- extrude depth, taper, and offset numeric parameters
- extrude profile reference selection

Sketch component points, rectangle dimensions, sketch component add/remove/reorder, and local sketch drafts should stay with `Edit-History-CLG-14` / `Edit-History-CLG-15`, even though some of those controls also use `FeatureValueBar`.

#### Owns

- canonical edit-history entries for `setCloseProfileSource(...)`
- canonical edit-history entries for `setExtrudeDepth(...)`
- canonical edit-history entries for `setExtrudeTaper(...)`
- canonical edit-history entries for `setExtrudeOffset(...)`
- canonical edit-history entries for `setExtrudeProfileRef(...)`
- transaction-like collapse for `FeatureValueBar` numeric interactions so a drag, arrow click, typed edit, Enter, blur, or equivalent commit creates at most one entry for the semantic parameter change
- immediate one-entry commits for select-based feature parameter changes
- no-entry protection for missing nodes, non-part nodes, missing features, wrong feature type, driven/disabled numeric controls, unchanged parameter values, canceled/no-effective-change interactions, and invalid profile/source selections where the store output is unchanged
- undo/redo restoration of authored `node.params.featureStack` parameter values through the graph document update path, with derived IR/cache/build outputs recomputed rather than captured
- focused tests proving feature parameter history does not capture selection, hover, camera/view, runtime/cache/provider state, command transcript, or command recall

#### Does Not Own

- `Edit-History-CLG-12` feature remove/delete coverage; the feature remove gap remains open
- reopening Phase 1 add/reorder behavior except for regression coverage
- sketch component create/delete/reorder or point/geometry edits
- cube rectangle sketch width/length history via `setSketchRectangleDimensions(...)`; this is sketch-authored state and belongs with committed sketch phases
- sketch-plane transform sliders, local sketch draft undo, CAD/sketch internals beyond the listed parameter seams, Browser/project undo, Viewer Transform undo, Build Path sync, history UI, persistence, async entries, runtime/cache/provider history, command transcript undo, command recall undo, graph parameter commits, or console parity

#### Accepted Live Seams

- `src/app/spaghetti/ui/FeatureStackView.tsx`
  - reads feature stacks and renders feature editors
  - already passes `beginGraphParameterInteraction` / `endGraphParameterInteraction` into `SketchFeatureView` and `ExtrudeFeatureView`
  - those callbacks currently drive app/build interaction state, not canonical edit-history transactions
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
  - exposes `onInteractionStart` and `onInteractionEnd`
  - calls start/end around arrow clicks
  - keeps typed edits active from focus until Enter/Escape/blur, with duplicate blur-after-Enter guarded by `skipBlurEndInteractionRef`
  - calls `onChange` for live numeric value updates
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - wires depth, taper, and offset `FeatureValueBar` controls to `setExtrudeDepth(...)`, `setExtrudeTaper(...)`, and `setExtrudeOffset(...)`
  - disables those numeric controls when the corresponding virtual input is driven
  - wires source/profile selects to `setExtrudeProfileRef(...)`
- `src/app/spaghetti/ui/features/CloseProfileFeatureView.tsx`
  - wires the source sketch select to `setCloseProfileSource(...)`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - also uses `FeatureValueBar`, but for sketch component point and rectangle-dimension edits; those are committed sketch-edit seams and should be excluded from Phase 2 except as explicit no-widening notes
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns `setCloseProfileSource(...)`, `setExtrudeDepth(...)`, `setExtrudeTaper(...)`, `setExtrudeOffset(...)`, and `setExtrudeProfileRef(...)`
  - all five update authored feature-stack state through `updatePartNodeFeatureStack(...)`
  - Phase 1 already added feature-stack history helpers and authored stack snapshot restoration that can likely be reused or generalized
- `src/app/spaghetti/ui/features/FeatureValueBar.test.tsx`
  - already proves interaction start/end behavior for arrow and typed interactions
- `src/app/spaghetti/ui/FeatureStackView.test.tsx`
  - already has an extrude fixture and is the likely UI integration test surface for interaction-to-store commit proof
- `src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`
  - is the nearest focused store-history test surface to extend or mirror with feature parameter history tests

#### No-Widening Rules

Do not implement feature remove/delete in this phase. `Edit-History-CLG-12` stays open until a stable remove seam exists.

Do not route `setFeatureEnabled(...)` unless Manager explicitly widens the phase. It is feature authored state, but it is not part of the concrete numeric/profile parameter seam accepted for this phase.

Do not route `setSketchRectangleDimensions(...)`, `updateSketchComponentPoint(...)`, `addSketchComponent(...)`, `moveSketchComponentUp(...)`, `moveSketchComponentDown(...)`, or `removeSketchComponent(...)`. These belong to committed sketch edit coverage.

Do not change shared keyboard dispatch or native text-input undo behavior. Text input undo while focused should remain local to the input; canonical history begins only at the feature parameter commit boundary.

### Phase 2 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - add or generalize a feature parameter history helper around authored `featureStack` before/after snapshots
  - expose transaction-like begin/end APIs only if needed for UI numeric interaction collapse
  - preserve direct live setter behavior during `onChange` ticks while committing one entry at the semantic end
- `src/app/spaghetti/ui/FeatureStackView.tsx`
  - likely owner for feature parameter interaction begin/end because it already receives active graph document state and passes interaction callbacks to feature editors
  - may need to pass parameter identity to begin/end callbacks instead of using anonymous app/build interaction callbacks
- `src/app/spaghetti/ui/features/ExtrudeFeatureView.tsx`
  - likely tiny callback wiring for depth/taper/offset identity and select commits
  - avoid broad refactor of rendering or profile-preview logic
- `src/app/spaghetti/ui/features/CloseProfileFeatureView.tsx`
  - likely tiny callback wiring for close-profile source select commit
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
  - touch only if the existing start/end lifecycle cannot carry enough commit identity from parent components
  - existing start/end semantics should be preferred
- `src/app/spaghetti/store/featureStackEditHistoryStore.test.ts` or a new focused `src/app/spaghetti/store/featureParameterEditHistoryStore.test.ts`
  - prove store helper undo/redo, no-op protection, missing/wrong target protection, and view/runtime exclusion
- `src/app/spaghetti/ui/FeatureStackView.test.tsx`
  - prove UI numeric interactions collapse into one canonical entry and select changes create one canonical entry
- `src/app/spaghetti/ui/features/FeatureValueBar.test.tsx`
  - run if `FeatureValueBar` lifecycle is touched; extend only if the lifecycle itself changes
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - run as regression if shared graph/feature-stack restore helpers are touched

#### Exact Implementation Boundary

Implement canonical history for these existing authored feature parameter setters only:

- `setCloseProfileSource(nodeId, featureId, sourceSketchFeatureId)`
- `setExtrudeDepth(nodeId, featureId, depth)`
- `setExtrudeTaper(nodeId, featureId, taper)`
- `setExtrudeOffset(nodeId, featureId, offset)`
- `setExtrudeProfileRef(nodeId, featureId, ref)`

Numeric `FeatureValueBar` changes should keep the existing live `onChange(...)` path so the UI remains responsive. The canonical entry should be committed only when the interaction ends, using the starting authored feature-stack value and final authored feature-stack value. Multiple tick updates inside one drag/typed focus session should collapse to one `Change feature parameter` entry.

Select-based parameter changes should commit one entry immediately after a changed authored value is applied, because the select interaction is already a semantic commit.

Use stable source metadata for feature parameters, for example:

- `surface: 'spaghetti-graph'`
- `sourceId: 'graph-feature-parameter'`
- `sourceLabel: 'Graph Feature Parameter'`

Use target metadata with enough future panel context, for example:

- `targetId: ${nodeId}:${featureId}:depth`
- `targetLabel: 'Extrude depth'`

Undo/redo should restore only the authored feature-stack parameter values for the owning part node through the graph document update path. It should not snapshot or restore derived feature-stack IR, accepted build outputs, preview geometry, worker progress, runtime/cache/provider state, command transcript, command recall, selection, hover, camera/view, or focus/menu state.

#### Focused Verification

Implementation should run focused commands for touched files:

- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/ui/FeatureStackView.test.tsx`

If a new focused test file is added, run that exact file, for example:

- `npm.cmd test -- --run src/app/spaghetti/store/featureParameterEditHistoryStore.test.ts`

If `FeatureValueBar` changes:

- `npm.cmd test -- --run src/app/spaghetti/ui/features/FeatureValueBar.test.tsx`

If shared graph/feature-stack history helpers change:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`

#### Build Gate

Implementation must run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 2 failures.

#### Tracking Docs

This prep pass updates only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Do not update the family index during implementation; Manager will close index status after acceptance.

#### Stop Condition

Stop and report instead of widening if the implementation requires redesigning `FeatureValueBar`, rewriting `FeatureStackView`, adding a generic CAD command system, changing sketch component editing semantics, changing feature dependency rules, or creating a feature remove API.

Stop and report if typed numeric commit support would require a broad local-draft rewrite. The current `FeatureValueBar` already has focus-to-Enter/blur interaction boundaries; use those if sufficient.

Stop and report if undo/redo would need to capture runtime/cache/provider state, accepted build outputs, preview geometry, worker progress, command transcript, command recall, selection, hover, camera/view, Browser/project state, Viewer Transform state, Build Path state, history UI state, persistence, or async entries.

#### Done Shape

Phase 2 is done when existing close-profile source and extrude depth/taper/offset/profile-ref commits create canonical edit-history entries, live numeric ticks collapse into one entry per semantic interaction, no-op/missing/wrong-target cases create no entry, undo/redo restores authored feature parameter values through the graph document update path, focused tests pass, and production build passes.

If all five accepted seams above are covered, `Edit-History-CLG-13` can close after Manager acceptance. `Edit-History-CLG-12` remains open for feature remove/delete, and `Edit-History-CLG-14` / `Edit-History-CLG-15` remain open for committed sketch edits and local draft boundaries.

### Phase 2 Closeout

Status: complete for the approved feature-parameter implementation slice.

Implemented:
- canonical `Change feature parameter` entries for `setCloseProfileSource(...)`
- canonical `Change feature parameter` entries for `setExtrudeProfileRef(...)`
- one-entry commit-on-interaction-end history for extrude depth, taper, and offset numeric `FeatureValueBar` interactions
- live numeric setter ticks remain history-free until the semantic interaction ends
- no-entry protection for missing nodes, non-part nodes, missing features, wrong feature types, unchanged values, and sketch-owned parameter probes
- authored part-node `featureStack` parameter undo/redo restoration through the graph document update path
- focused proof that feature parameter history does not clear unrelated view/runtime-like store state

Verification passed:
- `npm.cmd test -- --run src/app/spaghetti/store/featureParameterEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/ui/FeatureStackView.test.tsx`
- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd run build`

`Edit-History-CLG-13` is ready for Manager acceptance because all accepted concrete feature parameter seams are covered. `Edit-History-CLG-12` remains open for feature remove/delete. `Edit-History-CLG-14` and `Edit-History-CLG-15` remain open for committed sketch edits and local sketch draft boundaries.

## [x] `Edit-History-3 / Phase 3` - `Committed Sketch Edits`

Add canonical entries for committed durable sketch edits.

### Phase 3 Summary

#### Purpose

Make durable authored sketch component edits undoable through the canonical `editHistoryStore` once those edits are written into a part node's authored `featureStack`. This phase targets `Edit-History-CLG-14` only if the stable committed store seams below are covered. `Edit-History-CLG-15` remains a separate local draft/sketch-session exclusion phase unless implementation naturally adds focused negative proof without routing local draft undo.

#### Owns

- canonical entries for committed sketch component add operations through `addSketchComponent(...)`
- canonical entries for committed sketch component point edits through `updateSketchComponentPoint(...)`
- canonical entries for committed sketch component reorder operations through `moveSketchComponentUp(...)` and `moveSketchComponentDown(...)`
- canonical entries for committed sketch component deletion through `removeSketchComponent(...)`
- canonical entries for committed cube-seed rectangle dimension edits through `setSketchRectangleDimensions(...)`
- collapse of live numeric point/dimension ticks into one committed entry on interaction end when a stable start/end interaction seam exists
- no-entry protection for missing nodes, non-part nodes, missing sketch features, missing components/rows, unchanged authored sketch data, dependency/no-op reorder, canceled/no-effective-change numeric interactions, and unchanged rectangle dimensions
- undo/redo restoration of authored part-node `featureStack` sketch data through the graph document update path without broad `setGraph()` clearing or runtime/cache/provider snapshots

#### Does Not Own

- `Edit-History-CLG-12` feature remove/delete coverage; the feature remove gap stays open
- `Edit-History-CLG-13` feature parameter commits; Manager accepted that phase separately
- `Edit-History-CLG-15` local sketch draft undo, sketch-session command history, point-by-point in-progress geometry edits, or local editor undo layers
- geometry sketch command language, draw-command parser behavior, `geometrySketchSession` draft ownership, or sketch-session keyboard shortcuts
- feature parameter commits, feature enable/disable routing, graph parameter commits, Browser/project undo, Viewer Transform undo, Build Path, history UI, persistence, collaboration, runtime/cache/provider/build outputs, command transcript, command recall, generic CAD command architecture, selection, hover, focus, or camera/view state

#### Accepted Live Seams

- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
  - calls `addSketchComponent(...)`, `updateSketchComponentPoint(...)`, `moveSketchComponentUp(...)`, `moveSketchComponentDown(...)`, `removeSketchComponent(...)`, and `setSketchRectangleDimensions(...)`
  - uses `FeatureValueBar` for component point X/Y and cube seed rectangle Width/Length controls, already exposing `onBeginInteraction` / `onEndInteraction`
  - component Add, Up, Down, and Delete buttons currently call the store actions immediately
- `src/app/spaghetti/ui/FeatureStackView.tsx`
  - owns the feature-stack UI callback bridge and already has Phase 2 feature-parameter begin/end interaction patterns
  - currently passes generic graph-parameter interaction callbacks into `SketchFeatureView`; Phase 3 may need a small sketch-specific interaction draft so sketch point/dimension edits do not get misclassified as graph node parameters
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx`
  - remains the numeric interaction lifecycle seam if existing callbacks are sufficient; avoid changing it unless a tiny missing commit hook blocks point/dimension collapse
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns durable authored sketch component setters and legacy wrappers `addSketchLine(...)` / `updateSketchLineEndpoint(...)`
  - sketch setters update authored part-node `featureStack` through existing part-node stack update/recompute paths; history payloads should snapshot authored stack data only
- `src/app/spaghetti/sketchCommands/drawCommands.ts` and store `geometrySketchSession` state
  - represent local draft/session tooling and command behavior; Phase 3 should not route these into canonical undo

#### First Pass Decisions

- Prefer a store/API helper parallel to feature-stack and feature-parameter history helpers, for example a small sketch feature snapshot helper in `useSpaghettiStore.ts` that commits ordinary `EditHistoryEntry` values to `editHistoryStore`.
- Use before/after authored feature-stack snapshots for the owning part node and feature, not derived IR/cache/build/runtime outputs.
- Immediate authored operations (`addSketchComponent`, `moveSketchComponentUp/Down`, `removeSketchComponent`) should commit one entry only when the authored stack changes.
- Numeric `FeatureValueBar` point and rectangle dimension interactions may update live on every tick, but should create one canonical entry on interaction end using the interaction's starting authored sketch stack and final authored sketch stack.
- Legacy wrappers should benefit only if they delegate to the routed durable setters. Do not add separate legacy history paths unless the implementation proves those wrappers are still an active public seam and can be covered without widening.
- Local sketch-session draft commands should remain local. If the only way to prove a committed entity path is to refactor `geometrySketchSession`, stop and report instead of broadening the phase.

### Phase 3 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/FeatureStackView.tsx`
- `src/app/spaghetti/ui/features/SketchFeatureView.tsx`
- `src/app/spaghetti/ui/features/FeatureValueBar.tsx` only if the existing begin/end interaction callbacks are insufficient
- new focused store test such as `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`
- `src/app/spaghetti/ui/FeatureStackView.test.tsx` only if UI callback wiring changes
- `src/app/spaghetti/store/featureStackEditHistoryStore.test.ts` if shared feature-stack restore helpers change
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts` if graph document restore helpers change
- `src/app/spaghetti/sketchCommands/drawCommands.test.ts` only if implementation unexpectedly touches sketch command/session code; preferred Phase 3 implementation should not touch it

#### Exact Implementation Boundary

- Add canonical history entries for authored sketch component create/update/reorder/delete and rectangle dimension commits.
- Route store setters through a narrow history-aware authored sketch helper that:
  - captures the active part-node authored feature stack before the mutation
  - applies the existing durable mutation/recompute path
  - captures the authored stack after the mutation
  - compares normalized authored sketch data and ignores no-op output
  - commits a synchronous undo/redo entry that restores the authored feature stack through the graph document update path
- Add a sketch numeric interaction draft only where needed to collapse `FeatureValueBar` point/dimension tick updates into one final entry.
- Keep live UI behavior unchanged: controls should continue to update during the interaction, and history should appear only after release/commit.
- Preserve native text input undo and shared keyboard dispatch by avoiding keyboard routing changes.
- Preserve sketch-session draft behavior by not importing `editHistoryStore` into draw-command local undo paths.

#### No-Widening Rule

Do not implement local sketch draft undo, sketch-session command history, sketch entity command architecture, feature remove/delete, feature enable/disable history, graph parameter history, feature parameter history, Browser/project undo, Viewer Transform undo, Build Path, history UI, persistence, collaboration, async history entries, runtime/cache/provider/build-output history, command transcript undo, command recall undo, selection/hover/focus/camera/view history, or broad UI refactors.

#### Implementation Risks

- `FeatureStackView` currently passes graph-parameter begin/end callbacks into `SketchFeatureView`; reusing that directly could mislabel sketch point/dimension commits as graph node parameter history.
- `FeatureValueBar` may fire `onEndInteraction` after a final live update; tests should guard against duplicate or stale before/after entries.
- Sketch component add/remove/reorder and point updates recompute sketch-derived authored feature data; snapshot comparison should focus on durable authored feature-stack data, not transient derived runtime outputs.
- Legacy `addSketchLine(...)` and `updateSketchLineEndpoint(...)` wrappers may be testable only as store aliases. Do not let legacy coverage drive a broader API rewrite.
- Geometry sketch session commands have local undo/delete/back semantics; canonical history must not claim those draft actions.

#### Checklist

- [x] Research live call sites one more time before implementation to confirm no store action was renamed after this prep.
- [x] Add a focused sketch edit-history store test for component add undo/redo.
- [x] Add a focused sketch edit-history store test for component point update collapsed to one entry when using the committed interaction seam.
- [x] Add a focused sketch edit-history store test for component reorder undo/redo and dependency/no-op reorder no-entry behavior if applicable.
- [x] Add a focused sketch edit-history store test for component remove undo/redo.
- [x] Add a focused sketch edit-history store test for rectangle dimension committed changes and no-change commits.
- [x] Add no-entry tests for missing node, non-part node, missing sketch feature, missing component/row, unchanged values, canceled/no-effective-change interactions, and unsupported local draft/session actions if exposed cleanly.
- [x] Add `FeatureStackView` UI wiring coverage only if implementation changes callback plumbing between `FeatureStackView` and `SketchFeatureView`.
- [x] Confirm undo/redo restores authored sketch data without clearing selection, hover, camera/view, transcript/recall, runtime/cache/provider, or build output state.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout only after verification passes.

#### Focused Verification

- `npm.cmd test -- --run src/app/spaghetti/store/sketchEditHistoryStore.test.ts` or the exact focused store test file added by implementation
- `npm.cmd test -- --run src/app/spaghetti/ui/FeatureStackView.test.tsx` if `FeatureStackView` or `SketchFeatureView` UI wiring changes
- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts` if shared feature-stack history helpers change
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` if graph document restore helpers change
- `npm.cmd test -- --run src/app/spaghetti/sketchCommands/drawCommands.test.ts` only if sketch command/session files are touched; touching them should be treated as a warning sign for scope

#### Build Gate

- `npm.cmd run build`

#### Tracking Docs

- Prep changes update only this active phase doc and `docs/Doc-Log.md`.
- Implementation closeout updates this phase doc and Doc History, `docs/CHANGELOG.md` for shipped runtime/test behavior, and `docs/Doc-Log.md` for docs maintenance.
- Do not update the family index in the implementation pass; Manager will mark `Edit-History-CLG-14` after acceptance.

#### Stop Condition

Stop and report instead of widening if committed sketch coverage requires a broad `FeatureValueBar`, `SketchFeatureView`, `FeatureStackView`, `useSpaghettiStore`, sketch-session, or draw-command refactor; if durable authored sketch commits cannot be separated from `geometrySketchSession` local draft undo; or if closing `Edit-History-CLG-14` depends on inventing a generic CAD command architecture.

#### Done Shape

Phase 3 is done when durable authored sketch component add/update/reorder/delete and rectangle dimension changes create canonical entries only after committed changes, undo/redo restores authored sketch feature state through the graph document path, no-op/missing/wrong-target/canceled interactions create no entries, focused verification and build pass, and docs are updated. `Edit-History-CLG-14` may be ready for Manager acceptance at that point. `Edit-History-CLG-15` remains open for local sketch draft/session exclusion unless Manager separately accepts focused proof; `Edit-History-CLG-12` remains open for feature remove/delete, and `Edit-History-CLG-13` remains accepted.

### Phase 3 Closeout

Status: complete for the approved durable authored sketch component implementation slice.

Implemented:
- `addSketchComponent(...)` creates one canonical `Add sketch component` entry when authored sketch component data changes
- `moveSketchComponentUp(...)` and `moveSketchComponentDown(...)` create one canonical `Reorder sketch component` entry only for effective authored reorder changes
- `removeSketchComponent(...)` creates one canonical `Remove sketch component` entry only when a component is actually removed
- `updateSketchComponentPoint(...)` remains live/history-free during ticks, with `commitPartSketchFeatureWithHistory(...)` creating one `Change sketch component` entry on semantic interaction end when authored sketch data changed
- `setSketchRectangleDimensions(...)` remains live/history-free during ticks, with `commitPartSketchFeatureWithHistory(...)` creating one `Change sketch dimensions` entry on semantic interaction end when authored cube-seed rectangle dimensions changed
- `FeatureStackView` now uses a sketch-specific interaction draft for `SketchFeatureView` numeric edits so sketch commits are not mislabeled as feature parameter history

Verification:
- `npm.cmd test -- --run src/app/spaghetti/store/sketchEditHistoryStore.test.ts` passed 6 tests
- `npm.cmd test -- --run src/app/spaghetti/ui/FeatureStackView.test.tsx` passed 2 tests
- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts` passed 5 tests
- `npm.cmd run build` passed with the known Vite browser-externalization and chunk-size warnings

`Edit-History-CLG-14` is ready for Manager acceptance because the durable authored sketch component seams are covered. `Edit-History-CLG-15` remains open for local `geometrySketchSession` / draft-session undo and exclusion proof. `Edit-History-CLG-12` remains open for feature remove/delete, and `Edit-History-CLG-13` remains accepted.

## [x] `Edit-History-3 / Phase 4` - `Sketch Draft And Runtime Exclusion Proof`

Prove local sketch draft/session state and node-owned CAD/sketch runtime output state stay outside canonical edit history.

### Phase 4 Summary

#### Purpose

Close the remaining Edit History 3 exclusion proof after durable authored feature-stack, feature-parameter, and sketch component seams have landed. This phase should prove that canonical history only changes through accepted authored entry seams and does not capture local sketch draft/session behavior or graph runtime/cache/provider/build output state.

This phase targets:
- `Edit-History-CLG-15` - local sketch draft and `geometrySketchSession` interactions stay outside canonical undo until a later explicit authored seam routes a committed entity
- `Edit-History-CLG-16` - worker progress, preview geometry, accepted/staged build results, result caches, provider/runtime state, and graph cache metadata stay outside canonical undo

#### Owns

- focused negative tests for local `geometrySketchSession` state changes that should not create canonical entries
- focused negative tests for draw-session local command behavior, including tool changes, hover point updates, selection-window draft updates, local draw-point undo/back/cancel, and local command aliases that remain sketch-session behavior
- focused negative tests for sketch-session deletion/finish paths only as exclusion probes; do not route those paths into canonical history in this phase
- focused proof that accepted sketch-history undo/redo restores authored feature-stack sketch data without restoring or clearing unrelated local sketch draft/session state beyond existing graph-pruning behavior
- focused proof that graph runtime/build/preview/cache/provider-like state changes do not create canonical entries and are not restored by canonical authored sketch undo/redo
- focused proof that `editHistoryStore` entries remain limited to accepted authored seams from Phase 1 through Phase 3

#### Does Not Own

- local sketch draft undo, sketch-session command history, or a local editor undo layer for `geometrySketchSession`
- new canonical entries for geometry sketch session commands such as `finishGeometrySketchDrawDraft(...)`, `deleteGeometrySketchSelectedComponents(...)`, `updateGeometrySketchComponentPoint(...)`, `setGeometrySketchComponentName(...)`, `moveGeometrySketchComponentUp/Down(...)`, `removeGeometrySketchComponent(...)`, or `setGeometrySketchSelectedProfile(...)`
- feature remove/delete coverage; `Edit-History-CLG-12` remains open
- feature parameter work; `Edit-History-CLG-13` is accepted/done
- durable part-node sketch component history; `Edit-History-CLG-14` is accepted/done
- Browser/project undo, Viewer Transform undo, Build Path, history UI, persistence, collaboration, feature enable/disable, command transcript/recall undo, keyboard dispatch, generic CAD command architecture, or provider/runtime/cache implementation changes

#### Current Live Seams

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `geometrySketchSession` is store-local session state with `activeTool`, `lastUsedTool`, `drawStage`, `drawDraft`, `hoveredComponentId`, `selectedComponentIds`, `selectionWindowDraft`, `editorViewportId`, and viewport-restore flags
  - `startGeometrySketchSession(...)` / `closeGeometrySketchSession(...)` open and close local sketch sessions without canonical history ownership
  - `runGeometrySketchDrawCommand(...)` routes `line`, `pline`, `rectangle`, `circle`, `previous`, `undo`, `enter`, `delete`, `back`, `esc`, and `x` into local sketch-session actions
  - `setGeometrySketchSessionTool(...)`, `setGeometrySketchDrawHoverPoint(...)`, `setGeometrySketchHoveredComponent(...)`, `setGeometrySketchSelectedComponents(...)`, `setGeometrySketchSelectionWindowDraft(...)`, `undoGeometrySketchDrawDraftPoint(...)`, `confirmGeometrySketchDrawPoint(...)`, and `confirmGeometrySketchDrawRadius(...)` mutate draft/session state
  - `finishGeometrySketchDrawDraft(...)`, `cancelGeometrySketchDrawDraft(...)`, and `deleteGeometrySketchSelectedComponents(...)` are the key session finish/cancel/delete seams to prove are not accidentally claimed by canonical edit history in this proof phase
  - geometry sketch authored setters such as `appendGeometrySketchComponent(...)`, `updateGeometrySketchComponentPoint(...)`, `setGeometrySketchComponentName(...)`, `moveGeometrySketchComponentUp/Down(...)`, `removeGeometrySketchComponent(...)`, and `setGeometrySketchSelectedProfile(...)` are not routed to canonical edit history in Phase 4
- `src/app/spaghetti/sketchCommands/drawCommands.ts`
  - owns draw-command normalization and action ids for local sketch-session commands
  - existing command vocabulary includes local `undo`, `back`, `esc`, `delete`, `previous`, and `x` behavior that must not be confused with canonical undo/redo
- `src/app/spaghetti/store/useSpaghettiStore.ts` runtime/cache seams
  - `graphRuntimeByDocumentId` holds `GraphRuntimeState` with `compileBuild`, `previewPreparation`, accepted/staged build bundles, accepted draft/authoritative geometry results, accepted build outputs, output surface, and staged authoritative preview result
  - build/result APIs include `stageGraphBuildRequest(...)`, `acceptGraphBuildResult(...)`, `stageAuthoritativePreviewGraphBuildResult(...)`, `promoteStagedAuthoritativePreviewResult(...)`, and `clearGraphBuildRequest(...)`
  - cache/document metadata seams include `cachedGraphEntriesById`, `cachedGraphEntryOrder`, `saveCachedGraphEntryToFile(...)`, graph document create/load/reset paths, and related selectors
- Accepted history seams from earlier phases:
  - `editHistoryStore` is the canonical owner
  - graph/feature/sketch history restore paths restore authored graph or feature-stack snapshots and should not snapshot runtime/cache/provider state
  - `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`, `featureStackEditHistoryStore.test.ts`, `featureParameterEditHistoryStore.test.ts`, and `graphEditHistoryStore.test.ts` are the closest focused history proof surfaces
- Existing broader tests:
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts` already covers much of the sketch-session and graph runtime/cache behavior but may be too broad for this proof lane if unrelated OutputPreview/Catalog-adjacent failures are present
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx` covers geometry-mode UI behavior and should be used only if the proof cannot be expressed at the store seam

#### First Pass Decisions

- Make implementation proof/guard focused. Prefer adding focused negative tests to a new small file such as `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` or to the existing focused history test files if that keeps setup smaller.
- Do not implement canonical history for `geometrySketchSession` actions. If a session command mutates authored graph state today, Phase 4 should prove the current exclusion behavior and document the future authored-seam decision rather than silently routing it.
- Do not alter `src/app/spaghetti/sketchCommands/drawCommands.ts`; command normalization should remain read-only context unless a test seam is truly missing.
- Use fake runtime/build/result payloads already present in `useSpaghettiStore.test.ts` patterns if runtime exclusion proof needs build state. Keep assertions focused on `editHistoryStore.getUndoEntries()` and preservation/exclusion from authored history payloads.
- Use the accepted sketch-history restore path as the positive contrast: commit/undo/redo one durable authored sketch entry, then prove local session and runtime/cache state is not captured as part of that entry.

### Phase 4 Implementation Spec

#### Likely Files

- `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` or another new focused store-level exclusion test
- `src/app/spaghetti/store/sketchEditHistoryStore.test.ts` only if extending existing sketch-history side-effect proof is smaller
- `src/app/spaghetti/store/featureStackEditHistoryStore.test.ts` or `featureParameterEditHistoryStore.test.ts` only for regression proof if shared setup is touched
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts` only for graph-history regression proof
- `src/app/spaghetti/store/useSpaghettiStore.test.ts` only if the implementation cannot avoid a broader store fixture; prefer not to depend on the full file as the only focused gate
- active phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

Production code changes should not be needed. If a tiny missing test seam is discovered, prefer a narrow read/helper export only after confirming no existing selector or store API can prove the exclusion.

#### Exact Implementation Boundary

- Add negative tests proving local sketch-session operations do not create canonical entries:
  - `startGeometrySketchSession(...)` / `closeGeometrySketchSession(...)`
  - `setGeometrySketchSessionTool(...)`
  - `setGeometrySketchDrawHoverPoint(...)`
  - `setGeometrySketchHoveredComponent(...)`
  - `setGeometrySketchSelectedComponents(...)`
  - `setGeometrySketchSelectionWindowDraft(...)`
  - `confirmGeometrySketchDrawPoint(...)` / `confirmGeometrySketchDrawRadius(...)` while still in draft state
  - `undoGeometrySketchDrawDraftPoint(...)`, `cancelGeometrySketchDrawDraft(...)`, `runGeometrySketchDrawCommand('undo'|'back'|'esc'|'previous')`
- Add negative tests for `finishGeometrySketchDrawDraft(...)` and `deleteGeometrySketchSelectedComponents(...)` as current session graph-mutation exclusion probes. These tests should prove they do not create canonical entries in Phase 4; they should not assert that those paths are permanently ineligible for a future authored-seam phase.
- Add negative tests proving runtime/cache/provider-like operations do not create canonical entries:
  - staging/accepting/clearing build requests/results
  - staging/promoting authoritative preview results
  - updating preview/output-surface/runtime graph state
  - cached graph metadata updates where exposed cleanly
- Add preservation tests proving canonical authored sketch undo/redo does not restore or overwrite:
  - `geometrySketchSession` local draft/selection/hover state except existing graph pruning when a referenced node/component disappears
  - `graphRuntimeByDocumentId` build/preview/result state
  - `cachedGraphEntriesById` metadata
- Keep all tests focused on history ownership: `editHistoryStore.getUndoEntries()`, `getRedoEntries()`, and state preservation around canonical undo/redo.

#### No-Widening Rule

Do not implement local sketch draft undo, route geometry sketch session commands to canonical history, create a new CAD command architecture, change draw-command grammar, change shared keyboard dispatch, change command transcript/recall behavior, implement feature remove/delete, route feature enable/disable, add Browser/project or Viewer Transform undo, touch Build Path, add history UI, add persistence/collaboration, change runtime/cache/provider behavior, or refactor app-shell/editor/canvas ownership.

#### Implementation Risks

- `finishGeometrySketchDrawDraft(...)` and `deleteGeometrySketchSelectedComponents(...)` mutate authored graph state today while still being part of the local geometry sketch session. Phase 4 should avoid turning that ambiguity into a hidden implementation decision.
- Full `useSpaghettiStore.test.ts` is broad and has previously been adjacent to unrelated OutputPreview failures. Prefer a new focused test file with minimal fixtures.
- Build/runtime state has many fields. Tests should prove representative accepted/staged build output and geometry result state is excluded without duplicating the whole runtime test suite.
- Canonical history restore paths may legitimately prune session state if the underlying authored graph object disappears. Tests should distinguish expected pruning from accidental snapshot/restore behavior.
- Command transcript entries are appended by some sketch commands, but transcript undo remains out of scope. Do not make transcript assertions unless they are needed to prove no canonical history entry was created.

#### Checklist

- [x] Reconfirm the live geometry sketch session command names before implementation.
- [x] Add focused proof that local sketch-session open/close/tool/hover/selection-window/draft-point actions do not create canonical entries.
- [x] Add focused proof that local sketch-session command aliases and draft undo/back/cancel behavior do not create canonical entries.
- [x] Add focused proof that `finishGeometrySketchDrawDraft(...)` and `deleteGeometrySketchSelectedComponents(...)` do not create canonical entries in this phase.
- [x] Add focused proof that graph runtime/build/preview/result operations do not create canonical entries.
- [x] Add focused proof that canonical authored sketch undo/redo does not capture or restore runtime/cache/provider-like state.
- [x] Add focused proof that canonical authored sketch undo/redo does not snapshot local sketch-session draft state beyond existing graph pruning behavior.
- [x] Run focused sketch/runtime exclusion tests.
- [x] Run nearby history regressions if shared fixtures or history helpers are touched.
- [x] Run `npm.cmd run build`.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout only after verification passes.

#### Focused Verification

- `npm.cmd test -- --run src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` or the exact focused exclusion test file added by implementation
- `npm.cmd test -- --run src/app/spaghetti/store/sketchEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/store/featureStackEditHistoryStore.test.ts` if shared feature-stack restore helpers are touched
- `npm.cmd test -- --run src/app/spaghetti/store/featureParameterEditHistoryStore.test.ts` if shared feature-parameter setup is touched
- `npm.cmd test -- --run src/app/spaghetti/store/useSpaghettiStore.test.ts` only if the implementation actually touches or depends on broad store runtime behavior; report any known unrelated OutputPreview failures separately instead of fixing them in this phase

#### Build Gate

- `npm.cmd run build`

#### Tracking Docs

- Prep changes update only this active phase doc and `docs/Doc-Log.md`.
- Implementation closeout updates this phase doc and Doc History, `docs/CHANGELOG.md` for shipped test/proof behavior, and `docs/Doc-Log.md` for docs maintenance.
- Do not update the family index in the implementation pass; Manager will mark `Edit-History-CLG-15`, `Edit-History-CLG-16`, and any HLG/family status after acceptance.

#### Stop Condition

Stop and report instead of widening if the proof requires changing draw-command semantics, introducing local draft undo, routing geometry sketch session mutations into canonical history, changing build/runtime/cache/provider ownership, touching shared keyboard dispatch, editing command transcript/recall behavior, or fixing unrelated OutputPreview/Catalog/Pubwheel failures.

#### Done Shape

Phase 4 is done when focused tests prove local `geometrySketchSession` draft/session actions and representative runtime/cache/provider/build-output operations do not create canonical history entries, accepted authored sketch undo/redo does not capture or restore those excluded states, focused verification and build pass, and tracking docs are updated. If both local draft/session exclusion and runtime/cache/provider exclusion are covered, `Edit-History-CLG-15` and `Edit-History-CLG-16` can be ready for Manager acceptance. `Edit-History-CLG-12` remains open for a future feature remove/delete seam.

### Phase 4 Closeout

Implemented focused proof coverage in `src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts`.

Verification:
- `npm.cmd test -- --run src/app/spaghetti/store/sketchDraftRuntimeExclusion.test.ts` passed 4 tests
- `npm.cmd test -- --run src/app/spaghetti/store/sketchEditHistoryStore.test.ts` passed 6 tests
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed 16 tests
- `npm.cmd run build` passed with the known Vite browser-externalization and chunk-size warnings

`Edit-History-CLG-15` and `Edit-History-CLG-16` are ready for Manager acceptance because local `geometrySketchSession` draft/session actions, current sketch-session finish/delete graph mutations, representative graph runtime/build/preview/result/cache operations, and cached graph save metadata are proven outside canonical edit history, while authored sketch undo/redo is proven not to capture or restore excluded sketch-session draft or runtime state. `Edit-History-CLG-12` remains open for a future feature remove/delete seam.

## [x] `Edit-History-3 / Phase 5` - `Extrude Node Template Row Parameter Commits`

Add canonical entries for committed authored Extrude node-template row changes.

### Phase 5 Summary

#### Purpose

Close the newer Extrude node-template parameter gap that is separate from the older feature-stack `ExtrudeFeatureView` coverage accepted in Phase 2.

Phase 2 covered close-profile source, feature-stack extrude depth/taper/offset, and feature-stack extrude profile reference seams. The live graph-native Extrude node template now exposes authored row controls directly on the node surface. Those rows should log through canonical Edit History too.

This phase should cover:
- Type
- Direction
- Depth, including the visible one-sided/symmetric `depthMm` row and the two-sided `startDepthMm` / `endDepthMm` row split
- Taper Angle
- Output / body generation

This is also the first explicit planning marker for the longer-range rule: every durable authored node row should eventually become visible to Edit History as a meaningful committed row change.

#### Owns

- canonical `Change graph parameter` or equivalent row-parameter entries for Extrude node-template Type commits
- canonical entries for Extrude Direction commits
- canonical entries for Extrude Depth commits
- canonical entries for Extrude Taper Angle commits
- canonical entries for Extrude Output / body-generation commits
- one entry per semantic commit, not one entry per live tick
- disabled/driven row exclusion where a row is controlled by a real wire
- no-entry protection for missing nodes, non-Extrude nodes, unchanged values, invalid row values, and hidden/inapplicable row states
- undo/redo restoration through the authored graph document path, not runtime, preview, worker, or cache snapshots
- focused proof that these row commits preserve selection, hover, camera/view, command transcript, command recall, build/runtime, preview/cache/provider state, and local sketch session state

#### Does Not Own

- reopening Phase 2 feature-stack `ExtrudeFeatureView` depth/taper/offset/profile-ref coverage except as regression proof
- feature-stack remove/delete coverage; `Edit-History-CLG-12` remains the owning open gap
- sketch component edits, sketch draw command sessions, local sketch draft undo, or Sketch Draw durable local history
- wire creation/removal, edge waypoints, node row display mode, node movement, Browser/project undo, Viewer Transform undo, Build Path, history UI, checkpoints, branching, persistence, collaboration, or command transcript/recall undo
- making runtime/effective values canonical when the row is driven by a wire; the authored local fallback value is the only possible row-history target unless a later explicit driven-override phase says otherwise

#### Current Live Read

- `src/app/spaghetti/canvas/NodeView.tsx`
  - owns the newer Extrude node-template rendering path in `renderExtrudeTemplate()`
  - builds structured row props for Type, Direction, one-sided/symmetric Depth, two-sided Start Depth, two-sided End Depth, Taper Angle, and Output/body-generation rows
  - uses `updateExtrudeParams(...)` to call `applyGraphCommand(setNodeParamsCommand(...))`, so the current Extrude template writes are history-free until this phase wires the canonical commit seam
  - already has `beginGenericGraphParameterInteraction(...)` / `endGenericGraphParameterInteraction()` helpers that capture a graph snapshot at interaction start, keep live row ticks responsive, and call `commitGraphNodeParameterWithHistory(...)` on interaction end
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
  - already accepts `onInteractionStart` and `onInteractionEnd`, and the Extrude Depth / Start Depth / End Depth / Taper Angle rows pass through this helper
  - should keep live value updates responsive while committing only at the accepted semantic boundary by using row-specific generic graph parameter interaction targets
- `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx`
  - owns the Type and Direction enum row UI path; choices are immediate semantic commits through `onChange(nextValue)`
  - enum choices should capture `beforeGraph`, apply the changed authored param, then commit one history entry per accepted changed value
- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
  - builds Type and Direction enum props with driven-row disabling and unchanged-value protection at the component level
- Output/body-generation row in `NodeView.tsx`
  - currently uses a direct `ParaSelect` instead of `StructuredWireEnumRow`
  - should use the same immediate semantic commit pattern as Type and Direction while preserving its current `showEditors` disabled guard
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - accepted graph parameter history seam is `commitGraphNodeParameterWithHistory(...)`
  - existing low-level param writes should not create history entries until the UI or row controller reaches a semantic commit boundary
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - already proves accepted graph parameter undo/redo semantics and no-entry behavior for generic graph params
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - already has focused Extrude template interaction coverage for Type, Direction, Output/body generation, and row visibility
  - should be the first UI proof surface for this phase
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - already has broader Extrude template rendering coverage and can remain supporting coverage unless the implementation touches shared rendering behavior

#### First Pass Decisions

- Treat Extrude node-template rows as graph-node authored parameters, not feature-stack parameters.
- Reuse `commitGraphNodeParameterWithHistory(...)` unless implementation research proves the row needs a narrower wrapper over the same canonical owner.
- Use row-specific target metadata so the history reader can later say which Extrude row changed, for example:
  - `targetId: ${nodeId}:extrude:extrudeType`
  - `targetLabel: 'Extrude type'`
  - `targetId: ${nodeId}:extrude:extrudeDirection`
  - `targetLabel: 'Extrude direction'`
  - `targetId: ${nodeId}:extrude:depthMm`
  - `targetLabel: 'Extrude depth'`
  - `targetId: ${nodeId}:extrude:startDepthMm`
  - `targetLabel: 'Extrude start depth'`
  - `targetId: ${nodeId}:extrude:endDepthMm`
  - `targetLabel: 'Extrude end depth'`
  - `targetId: ${nodeId}:extrude:taperAngleDeg`
  - `targetLabel: 'Extrude taper angle'`
  - `targetId: ${nodeId}:extrude:bodyGenerationMode`
  - `targetLabel: 'Extrude output'`
- Keep driven effective values read-only for history purposes. If a wire drives Depth or another row, changing the wire or upstream driver owns the authored edit, not the driven row's displayed effective value.
- Do not generalize to every node row in this phase. This phase should prove the Extrude template row pattern first, then later phases can apply the same row-history contract to Sketch, OutputPreview, driver rows, composite rows, and future node families.

### Phase 5 Implementation Spec

#### Likely Files

- `src/app/spaghetti/canvas/NodeView.tsx`
  - owner for beginning and ending Extrude template numeric row history interactions
  - owner for immediate enum/output row semantic commits and row-specific target metadata
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
  - run as regression proof because the needed start/end callbacks already exist
- `src/app/spaghetti/canvas/StructuredWireEnumRow.tsx`
  - run as regression proof for immediate enum row behavior; only change if the current `onChange` contract cannot support canonical commits cleanly
- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
  - run or extend if driven enum disabling or unchanged-choice protection needs clearer proof
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - read or use the accepted `commitGraphNodeParameterWithHistory(...)` seam; avoid changing the owner contract unless implementation research proves a tiny wrapper is needed
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - store-level proof for Extrude row param snapshot restore if that can be expressed without broad rendering setup
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - preferred UI proof for Type, Direction, Output/body generation, row visibility, and representative numeric row history behavior
- `src/app/spaghetti/canvas/NodeView.test.tsx`
  - supporting broad rendering proof if the implementation touches shared row rendering
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.test.ts`
  - run or extend if numeric row prop lifecycle changes
- `src/app/spaghetti/canvas/StructuredWireEnumRow.test.tsx`
  - run or extend if enum row commit behavior changes
- active phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

#### Exact Implementation Boundary

Implement canonical history for committed authored changes to these Extrude node-template params only:

- `extrudeType` / Type
- `extrudeDirection` / Direction
- `depthMm` / one-sided and symmetric Depth
- `startDepthMm` / two-sided Start Depth
- `endDepthMm` / two-sided End Depth
- `taperAngleDeg` / Taper Angle
- `bodyGenerationMode` / Output-body generation

The live schema and reader path already use those authored keys for the Geometry/Extrude node template. Reconfirm before editing in case intervening work changed the schema, but do not invent new param names for this phase.

Numeric rows should stay live while dragging or typing and should create one canonical entry only on release, blur, `Enter`, or equivalent accepted commit. Enum rows should create one entry for each changed accepted choice.

Undo/redo should restore authored node params through graph document state using the existing graph parameter snapshot path. It should not snapshot or restore build output, preview geometry, runtime caches, selection, hover, camera/view, local sketch sessions, command transcript, command recall, history UI state, or workspace shell state.

#### First Code Cut

1. Keep the existing low-level `updateExtrudeParams(nextParams)` path as the live graph write helper for numeric drag/type ticks.
2. Replace the Extrude numeric row `onInteractionStart` / `onInteractionEnd` wiring with row-specific generic graph parameter interactions:
   - Depth: call `beginGenericGraphParameterInteraction` with target id `${node.nodeId}:extrude:depthMm` and label `Extrude depth`
   - Start Depth: call `beginGenericGraphParameterInteraction` with target id `${node.nodeId}:extrude:startDepthMm` and label `Extrude start depth`
   - End Depth: call `beginGenericGraphParameterInteraction` with target id `${node.nodeId}:extrude:endDepthMm` and label `Extrude end depth`
   - Taper Angle: call `beginGenericGraphParameterInteraction` with target id `${node.nodeId}:extrude:taperAngleDeg` and label `Extrude taper angle`
   - all four rows should end through `endGenericGraphParameterInteraction`
3. Add a tiny immediate semantic commit helper in `NodeView.tsx` for enum/output rows, for example `updateExtrudeParamsWithHistory(nextParams, targetId, targetLabel)`, that:
   - captures `beforeGraph = useSpaghettiStore.getState().graph`
   - applies `setNodeParamsCommand({ nodeId: node.nodeId, params: nextParams })`
   - calls `commitGraphNodeParameterWithHistory({ nodeId: node.nodeId, beforeGraph, targetId, targetLabel })`
4. Route Type through the helper with target id `${node.nodeId}:extrude:extrudeType` and label `Extrude type`.
5. Route Direction through the helper with target id `${node.nodeId}:extrude:extrudeDirection` and label `Extrude direction`.
6. Route Output/body generation through the helper with target id `${node.nodeId}:extrude:bodyGenerationMode` and label `Extrude output`.
7. Preserve current guards:
   - invalid enum values return without writing
   - unchanged values return without writing
   - driven Type/Direction rows remain disabled
   - Output remains disabled when editors are hidden
   - hidden rows do not create history entries
8. Do not add a generic every-node-row abstraction in this phase. If a helper is needed, keep it local to `NodeView` unless the implementation discovers a small existing local pattern.

#### No-Widening Rule

Do not implement row history for every node family in Phase 5. The long-range direction is every durable authored node row, but this phase owns only Extrude node-template Type, Direction, Depth, Taper Angle, and Output.

Do not change the feature-stack `ExtrudeFeatureView` history path except for regression proof. Do not move feature-stack parameters into graph-node template params or collapse the two systems.

Do not change wire semantics, driven effective-value resolution, compile/evaluate behavior, worker requests, preview rendering, OutputPreview publication behavior, or CAD feature-stack execution semantics.

Do not add history UI, checkpoints, branching, persistence, collaboration, generic CAD command architecture, or command transcript/recall undo.

#### Implementation Risks

- Extrude has both feature-stack parameter seams and graph-node template row seams. Mixing them could double-log one change or restore the wrong authored owner.
- Driven rows may display effective values that come from wires. History should target the authored local fallback only when it is actually editable.
- Numeric row helpers may emit live updates without an explicit commit lifecycle. If so, add the smallest row-level lifecycle hook rather than redesigning all node row editing.
- Enum rows may already commit immediately. That is acceptable if each changed choice produces exactly one canonical history entry and unchanged reselects produce none.
- Direction changes alter which depth rows are visible. Preserve current visibility behavior while proving that the Direction row itself owns only the direction entry, and that two-sided Start Depth / End Depth commits own their own entries.
- The Output row maps to `bodyGenerationMode` and currently uses a direct `ParaSelect`, so it needs explicit history wiring in `NodeView` rather than assuming the structured enum helper covers it.
- Tests should distinguish authored param restoration from derived compile/evaluate output changes.

#### Checklist

- [x] Confirm live Extrude node-template schema keys for Type, Direction, Depth, Taper Angle, and Output/body generation.
- [x] Confirm which row components own numeric and enum commit boundaries.
- [x] Route Extrude Type row changes through canonical graph parameter history.
- [x] Route Extrude Direction row changes through canonical graph parameter history.
- [x] Route Extrude one-sided/symmetric Depth row changes through canonical graph parameter history.
- [x] Route Extrude two-sided Start Depth row changes through canonical graph parameter history.
- [x] Route Extrude two-sided End Depth row changes through canonical graph parameter history.
- [x] Route Extrude Taper Angle row changes through canonical graph parameter history.
- [x] Route Extrude Output/body-generation row changes through canonical graph parameter history.
- [x] Ensure numeric live ticks do not create history entries before semantic commit.
- [x] Ensure enum unchanged reselects and invalid choices create no entries.
- [x] Ensure driven/disabled rows do not create local row entries.
- [x] Prove undo/redo restores authored Extrude node params.
- [x] Prove excluded runtime/view/session/cache states are not captured.
- [x] Run focused graph-history and Extrude row tests.
- [x] Run production build.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout only.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx -t "extrude"`
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.test.tsx -t "Extrude"`
- `npm.cmd test -- --run src/app/spaghetti/canvas/structuredWireNumericRowProps.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/canvas/StructuredWireEnumRow.test.tsx`

Build gate:

- `npm.cmd run build`

#### Phase 5 Closeout

Implemented in `src/app/spaghetti/canvas/NodeView.tsx` and `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`.

Verification:
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx -t "commits extrude|driven Type or Depth"` passed 4 tests
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts src/app/spaghetti/canvas/structuredWireNumericRowProps.test.ts src/app/spaghetti/canvas/StructuredWireEnumRow.test.tsx` passed 20 tests
- `npm.cmd test -- --run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx -t "extrude"` passed 14 tests
- `npm.cmd run build` passed with the known Vite browser-externalization and chunk-size warnings

`Edit-History-3-CLG-17` is ready for Manager acceptance because Extrude node-template Type, Direction, one-sided/symmetric Depth, two-sided Start Depth, two-sided End Depth, Taper Angle, and Output/body-generation authored row changes now create canonical `Change graph parameter` entries at semantic commit boundaries, undo/redo restores authored graph node params, driven Type/Depth controls create no local row entries, and the implementation stayed local to the Extrude node-template row seams. Broader every-node-row history remains future follow-up work.

#### Tracking Docs

Prep changes update only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Do not update the family index during implementation unless Manager explicitly asks to reconcile broader Edit History status.

#### Stop Condition

Stop and report instead of widening if Extrude row history requires a broad node-row framework rewrite, changes to compile/evaluate contracts, feature-stack migration, driven-value ownership changes, OutputPreview publication changes, shared keyboard dispatch changes, or generic every-node-row implementation.

Stop and report if undo/redo would need to capture runtime/cache/provider state, accepted build outputs, preview geometry, worker progress, command transcript, command recall, selection, hover, camera/view, Browser/project state, Viewer Transform state, Build Path state, history UI state, persistence, or async entries.

#### Done Shape

Phase 5 is done when committed Extrude node-template Type, Direction, Depth including one-sided/symmetric `depthMm` and two-sided `startDepthMm` / `endDepthMm`, Taper Angle, and Output row changes each create one canonical history entry per semantic edit, undo/redo restores authored Extrude node params through graph document state, driven/disabled/unchanged rows create no entries, focused verification and build pass, and tracking docs are updated. `Edit-History-3-CLG-17` can be ready for Manager acceptance at that point, while broader every-node-row history remains later follow-up work.

## [x] `Edit-History-3 / Phase 6` - `Node Creation Surface History Parity`

Route every current user-facing graph node creation surface through the canonical graph-node snapshot seam.

### Phase 6 Summary

#### Purpose

Close the newly found graph-node creation parity gap after Phase 5.

Console-created missing Sketch and Extrude nodes already use `createGraphNodeInDocumentAndSelect(...)`, which calls `addGraphNodeWithHistory(...)` and creates a canonical `Add graph node` entry. The canvas node-add menu and `SpaghettiPanel` add-node path still call `applyGraphCommand(addNodeCommand(...))` directly, so those surfaces mutate authored graph structure without creating an edit-history snapshot.

This phase should make node creation feel consistent regardless of whether the user creates a Sketch, Extrude, part, or other user-addable node from Console, the canvas menu, or the panel.

#### Owns

- canvas node-add menu creation through `addGraphNodeWithHistory(...)`
- `SpaghettiPanel` add-node creation through `addGraphNodeWithHistory(...)`
- one canonical `Add graph node` entry per successful user-created node
- undo/redo restoration for Sketch and Extrude node creation from the canvas/menu-facing path
- no-entry behavior for duplicate, missing, invalid, or unchanged creation attempts
- preservation of current node placement, spawn mode, selection, and user feedback behavior after successful creation
- proof that selection, hover, camera/view, node palette/menu state, command transcript, command recall, build/runtime, preview/cache/provider state, and workspace shell state are not captured as authored snapshot payloads

#### Does Not Own

- changing graph command semantics generally
- inventing a new node creation abstraction beyond the smallest shared helper needed for parity
- changing `createGraphNodeInDocumentAndSelect(...)` except for regression proof
- node deletion, node movement, wire creation, wire removal, node parameter commits, feature-stack commits, Sketch Draw local history, Viewer Transform, Browser/project history, Build Path, history UI, checkpoints, branching, persistence, collaboration, or command transcript/recall undo
- making system-only nodes user-addable or widening which node types can be created

#### Current Live Read

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `addGraphNodeWithHistory(...)` already owns canonical graph-node add snapshots
  - `createGraphNodeInDocumentAndSelect(...)` already uses the canonical helper for Console-created missing Sketch, Extrude, and OutputPreview nodes
- `src/app/console/ConsoleDock.test.tsx`
  - already proves console-created missing Sketch nodes create an `Add graph node` undo entry
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - `handleAddNodeFromMenu(...)` currently calls `applyGraphCommand(addNodeCommand(...))`, bypassing canonical edit history
  - this path also owns menu stage position, `newNodeSpawnMode`, selected-node updates, selected-edge clearing, and add-node user feedback
- `src/app/panels/SpaghettiPanel.tsx`
  - `handleAddPartNode(...)` currently calls `applyGraphCommand(addNodeCommand(...))`, bypassing canonical edit history
  - this path also owns selected-node/focused-node updates and add-node user feedback
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - already proves `addGraphNodeWithHistory(...)` undo/redo behavior at the store seam

#### First Pass Decisions

- Treat user-created Sketch, Extrude, and part nodes as graph-structure history, not node-CAD parameter history.
- Reuse `addGraphNodeWithHistory(...)` instead of adding a second snapshot owner.
- Preserve current placement and spawn-mode behavior by passing the same node, position, and `nodeMode` values into the history helper.
- Keep direct `applyGraphCommand(addNodeCommand(...))` available for tests, imports, hydration, or internal graph normalization paths that are not user-authored creation commits.
- Do not route OutputPreview singleton normalization or system-created graph repair through canonical history.

#### Prep Read

Phase 6 is ready for implementation against the current live seams:

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - accepted owner seam: `addGraphNodeWithHistory(...)`
  - accepted helper shape: `addGraphNodeWithHistory({ node, position, nodeMode })`
  - accepted snapshot behavior: `Add graph node` entry using before/after graph snapshots
- `src/app/console/ConsoleDock.test.tsx`
  - reference behavior already exists for Console-created missing Sketch nodes
  - this path should remain regression proof, not the first implementation target
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - first implementation target
  - replace the direct `applyGraphCommand(addNodeCommand(...))` call in `handleAddNodeFromMenu(...)`
  - preserve `nodeAddMenu.stageX`, `nodeAddMenu.stageY`, `newNodeSpawnMode`, selection update, selected-edge clearing, UI message, and menu close behavior
- `src/app/panels/SpaghettiPanel.tsx`
  - second implementation target if the panel remains a live add surface
  - replace the direct `applyGraphCommand(addNodeCommand(...))` call in `handleAddPartNode(...)`
  - preserve selected/focused node updates and UI message behavior

Implementation is cleared for the narrow history-seam replacement only. If either surface has changed since prep, re-read the local callback and preserve the current visible behavior before swapping the mutation seam.

### Phase 6 Implementation Spec

#### Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - replace the direct node-add menu `applyGraphCommand(addNodeCommand(...))` call with `addGraphNodeWithHistory(...)`
  - preserve position, spawn mode, selection, selected-edge clearing, message text, and menu close behavior
- `src/app/panels/SpaghettiPanel.tsx`
  - replace the direct add-part `applyGraphCommand(addNodeCommand(...))` call with `addGraphNodeWithHistory(...)`
  - preserve selected/focused node behavior and message text
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - keep as store seam regression proof for `addGraphNodeWithHistory(...)`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` or another focused canvas test
  - prove menu-created Sketch and Extrude nodes create one canonical `Add graph node` entry and undo removes the created node
- `src/app/panels/SpaghettiPanel.test.tsx`
  - prove panel-created part nodes create one canonical `Add graph node` entry if the panel path remains live and practical to cover
- `src/app/console/ConsoleDock.test.tsx`
  - run existing console-created missing Sketch proof as regression if touched
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

#### Exact Implementation Boundary

Implement canonical history for successful user-facing graph node creation from:

- the canvas node-add menu
- `SpaghettiPanel` add-node controls

The history entry should use the existing `Add graph node` label, graph-structure source metadata, before/after graph snapshots, and undo/redo behavior from `addGraphNodeWithHistory(...)`.

Undo/redo should restore authored graph document state only. It should not restore selection, hover, menu-open state, canvas pointer state, camera/view, command transcript, command recall, build outputs, preview geometry, runtime caches, history UI state, or workspace shell state.

#### First Code Cut

1. In `SpaghettiCanvas.tsx`, subscribe to `addGraphNodeWithHistory` from `useSpaghettiStore`.
2. In `handleAddNodeFromMenu(...)`, replace the direct `applyGraphCommand(addNodeCommand(...))` call with `addGraphNodeWithHistory({ node, position, nodeMode: newNodeSpawnMode })`.
3. Keep the existing post-create behavior: select the created node, clear selected edge, show the add message, and close the node-add menu.
4. In `SpaghettiPanel.tsx`, subscribe to `addGraphNodeWithHistory` and replace the direct add-part `applyGraphCommand(addNodeCommand(...))` call.
5. Keep the existing post-create behavior: selected node, focus node, and UI message.
6. Add focused verification that Sketch and Extrude creation through the menu path commit exactly one canonical entry, and undo/redo removes/restores the node.
7. Add or run panel-path proof if the panel is still a live user-facing add surface.

#### No-Widening Rule

Do not change graph import, graph load, hydration, OutputPreview singleton normalization, graph repair, test fixture setup, or runtime-created system nodes to create edit-history entries.

Do not add a broad every-graph-command history wrapper. This phase is limited to live user-facing node creation surfaces that currently bypass the accepted `addGraphNodeWithHistory(...)` seam.

Do not change node type registry behavior, add/remove available node types, alter node labels, or redesign node palette/menu UX.

#### Implementation Risks

- `SpaghettiCanvas` currently uses the direct graph command path for menu creation, so the replacement must preserve `nodeMode` and exact stage coordinates.
- `SpaghettiPanel` may be an older or secondary surface; if its tests are expensive or brittle, store/canvas proof plus a focused panel smoke test may be enough.
- Some internal paths intentionally call `applyGraphCommand(...)` without history for setup, hydration, or normalization. Do not make those paths canonical history entries.
- If undo does not clear current selection, that may be consistent with graph-history snapshot rules; do not widen into selection restore unless a current test proves the selected deleted node creates a broken visible state.

#### Checklist

- [x] Confirm all live user-facing node creation paths.
- [x] Route canvas node-add menu creation through `addGraphNodeWithHistory(...)`.
- [x] Route `SpaghettiPanel` add-node creation through `addGraphNodeWithHistory(...)` if the panel remains live.
- [x] Preserve node placement, spawn mode, selected node, selected edge clearing, and user feedback behavior.
- [x] Prove Sketch node creation creates one canonical `Add graph node` entry.
- [x] Prove Extrude node creation creates one canonical `Add graph node` entry.
- [x] Prove undo/redo removes and restores created nodes.
- [x] Prove internal/system graph setup paths remain history-free where appropriate.
- [x] Run focused graph-history and creation-surface tests.
- [x] Run production build.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx -t "node"`
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx -t "Add"`
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "Created sketch"`

Build gate:

- `npm.cmd run build`

#### Phase 6 Closeout

Implemented in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`, `src/app/panels/SpaghettiPanel.tsx`, `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`, and `src/app/panels/SpaghettiPanel.test.tsx`.

Verification:
- `npm.cmd test -- --run src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` passed 3 tests
- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx` passed 23 tests
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed 16 tests
- `npm.cmd run build` passed with the known Vite browser-externalization and chunk-size warnings

`Edit-History-3-CLG-18` is ready for Manager acceptance because canvas menu-created Sketch and Extrude nodes now create canonical `Add graph node` entries through `addGraphNodeWithHistory(...)`, undo/redo removes and restores those authored graph nodes, the `SpaghettiPanel` part-node add path uses the same history seam while preserving selection feedback, and internal/system graph setup paths remain outside this user-authored creation history lane.

#### Tracking Docs

Prep changes update only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Do not update the family index during implementation unless Manager explicitly asks to reconcile broader Edit History status.

#### Stop Condition

Stop and report instead of widening if creation history requires changing graph load/hydration semantics, OutputPreview singleton repair, node registry availability, graph command contracts, workspace selection ownership, or a broad every-command history wrapper.

Stop and report if undo/redo would need to capture selection, hover, camera/view, node palette/menu state, command transcript, command recall, workspace shell state, runtime/cache/provider state, accepted build outputs, preview geometry, worker progress, history UI state, persistence, or async entries.

#### Done Shape

Phase 6 is done when current user-facing canvas/menu and panel node creation surfaces use canonical `Add graph node` history entries, Sketch and Extrude creation each produce one undoable/redoable snapshot, undo/redo restores authored graph document state through the existing graph-history owner, excluded UI/runtime/session state remains outside the snapshot, focused verification and build pass, and tracking docs are updated. `Edit-History-3-CLG-18` can be ready for Manager acceptance at that point.

## [x] `Edit-History-3 / Phase 7` - `Node Deletion Surface History Parity`

Route every current user-facing graph node deletion surface through the canonical graph-node remove snapshot seam.

### Phase 7 Summary

#### Purpose

Follow Phase 6's node creation parity by making user-authored graph node deletion consistently undoable.

The store already exposes `removeGraphNodeWithHistory(...)`, and Console `node.delete` already uses that canonical seam when deleting a selected graph node. This phase should make any remaining live user-facing deletion paths use the same `Remove graph node` entry so deleting Sketch, Extrude, part, or other user-deletable nodes can be undone and redone through the graph-history owner.

#### Owns

- canonical `Remove graph node` history entries for successful user-facing graph node deletion
- parity between Console node deletion and any canvas, keyboard, toolbar, panel, or context-menu node deletion surfaces that are live at implementation time
- undo/redo restoration of the deleted node and its authored graph connections through the existing graph document snapshot owner
- no-entry behavior for missing node, protected/system node, no selected node, canceled delete, or unchanged graph attempts
- preservation of current visible deletion behavior, including selection clearing, graph-scope return behavior, user feedback, and console prompt handoff where those behaviors already exist
- proof that selection, hover, camera/view, menu state, command transcript, command recall, build/runtime, preview/cache/provider state, and workspace shell state are not captured as authored snapshot payloads

#### Does Not Own

- edge deletion parity; wire removal has its own graph-structure history lane
- feature-stack remove/delete history; `Edit-History-CLG-12` remains the owning open gap for feature-stack remove
- geometry sketch session delete behavior such as draft/session component deletion
- creating a new node delete surface just to close this phase
- changing protected system-node rules, OutputPreview singleton normalization, graph load/hydration, graph repair, node registry availability, or graph command semantics generally
- node creation, node movement, wire creation, wire removal, node parameter commits, feature-stack commits, Sketch Draw local history, Viewer Transform, Browser/project history, Build Path, history UI, checkpoints, branching, persistence, collaboration, or command transcript/recall undo

#### Current Live Read

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `removeGraphNodeWithHistory(nodeId)` already owns canonical graph-node remove snapshots
  - the accepted entry label is `Remove graph node`
  - the helper delegates to `removeNodeCommand(nodeId)` through the graph-structure history command owner
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - already proves `removeGraphNodeWithHistory(...)` undo/redo behavior at the store seam and missing-node no-entry behavior
- `src/app/console/useConsoleInteraction.ts`
  - Console `node.delete` already calls `removeGraphNodeWithHistory(...)`
  - this path also owns returning to graph scope, clearing focused node context, and appending deleted-node feedback
- `src/app/console/ConsoleDock.test.tsx`
  - already contains selected sketch-node delete coverage for the Console path
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - current keyboard delete handling is visibly wired for selected edges only
  - implementation should re-read this file to confirm whether selected-node keyboard, toolbar, or context-menu deletion exists before deciding the exact parity gap

#### First Pass Decisions

- Treat user-deleted graph nodes as graph-structure history, not node-CAD parameter history.
- Reuse `removeGraphNodeWithHistory(...)` instead of adding a second snapshot owner.
- Keep Console deletion as the reference behavior and regression proof.
- Add the missing canvas selected-node Delete/Backspace path as the first parity cut because the canvas already has selected-node state and selected-edge Delete/Backspace behavior.
- Preserve selected-edge delete precedence: if an edge is selected, Delete/Backspace should keep deleting the edge and should not also delete the selected node.
- Do not add a new toolbar button, context menu item, or panel affordance unless Manager explicitly widens the phase.

#### Prep Read

Phase 7 is ready for implementation against the current live seams:

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - accepted owner seam: `removeGraphNodeWithHistory(nodeId)`
  - accepted helper behavior: creates one canonical `Remove graph node` entry through graph-structure before/after snapshots
  - accepted command behavior: `removeNodeCommand(nodeId)` removes the node and related graph edges
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - reference store proof already covers node removal, related-edge restoration, undo, redo, and missing-node no-entry behavior
- `src/app/console/useConsoleInteraction.ts`
  - Console `node.delete` already calls `removeGraphNodeWithHistory(...)`
  - this path should remain reference proof unless implementation finds an unrelated Console regression
- `src/app/console/ConsoleDock.test.tsx`
  - selected sketch-node delete already proves Console creates a `Remove graph node` history entry, returns to graph scope, clears selected graph-node state, and undo/redo restores/removes the node
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - first implementation target
  - currently subscribes to selected node and selected edge state
  - currently handles Delete/Backspace for `selectedEdgeId !== null` only
  - currently has node selection paths that clear selected edge/waypoint when a node is clicked
  - implementation should subscribe to `removeGraphNodeWithHistory`, add a selected-node delete callback, and extend the root `onKeyDown` so Delete/Backspace deletes the selected node only when no selected edge is active
- `src/app/panels/SpaghettiPanel.tsx`
  - no live selected-node delete control was found during prep
  - implementation should not add a panel delete surface unless a live surface appears during the final read

### Phase 7 Implementation Spec

#### Likely Files

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - subscribe to `removeGraphNodeWithHistory(...)`
  - add a selected-node delete callback near `handleDeleteSelectedEdge(...)`
  - route Delete/Backspace on the canvas root through selected-edge deletion first, then selected-node deletion when `selectedNodeId !== null`
  - preserve current selected-edge, selected-waypoint, selected-node, hover, focus, menu, and user-feedback behavior
- `src/app/panels/SpaghettiPanel.tsx`
  - no expected implementation change unless a live panel delete surface is found during the final read
- `src/app/console/useConsoleInteraction.ts`
  - keep as accepted reference seam; touch only if implementation finds a Console parity bug
- `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - keep as store seam regression proof for `removeGraphNodeWithHistory(...)`
- `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` or another focused canvas test
  - prove any canvas-facing node deletion creates one canonical `Remove graph node` entry and undo restores the deleted node
- `src/app/console/ConsoleDock.test.tsx`
  - run existing selected sketch-node delete proof as regression if touched
- this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout

#### Exact Implementation Boundary

Implement canonical history for successful canvas selected-node graph deletion and preserve existing Console node-delete history.

The history entry should use the existing `Remove graph node` label, graph-structure source metadata, before/after graph snapshots, and undo/redo behavior from `removeGraphNodeWithHistory(...)`.

Undo/redo should restore authored graph document state only. It should not restore selection, hover, menu-open state, canvas pointer state, camera/view, command transcript, command recall, build outputs, preview geometry, runtime caches, history UI state, or workspace shell state.

#### First Code Cut

1. In `SpaghettiCanvas.tsx`, subscribe to `removeGraphNodeWithHistory` from `useSpaghettiStore`.
2. Add `handleDeleteSelectedNode(...)` near `handleDeleteSelectedEdge(...)`.
3. If `selectedNodeId` is `null`, return without committing history.
4. Call `removeGraphNodeWithHistory(selectedNodeId)` and stop if it returns `false`.
5. Clear the selected node, selected edge, hovered edge, and selected waypoint after a successful node delete.
6. Show a concise success message such as `Node deleted.` after a successful node delete.
7. In the root `onKeyDown`, keep the existing Delete/Backspace selected-edge branch first.
8. Add a second Delete/Backspace branch for `selectedNodeId !== null` only when there is no selected edge.
9. Add focused canvas proof that selected Sketch and Extrude nodes can be deleted with Delete/Backspace, each creates one `Remove graph node` entry, and undo/redo restores/removes the node.
10. Keep Console delete behavior as a regression path, not the first implementation target.

#### No-Widening Rule

Do not implement feature-stack remove/delete, sketch-session delete history, edge deletion changes, graph load/hydration history, OutputPreview singleton repair history, or a broad every-graph-command history wrapper.

Do not add a new toolbar button, panel button, context-menu item, confirmation dialog, protected-node policy, or node registry rule unless Manager explicitly widens the phase.

#### Implementation Risks

- Console deletion already uses the canonical seam, so the real implementation may be mostly canvas/panel parity or a proof-only phase if no other node delete surface exists.
- Deleting a node also removes connected edges through the graph command. Undo/redo should restore the authored graph snapshot rather than manually reconstructing node and edge pieces.
- Protected or system-created nodes may have special availability rules. Do not make those nodes deletable just to prove history.
- If undo does not restore node selection, that may be consistent with graph-history snapshot rules; do not widen into selection restore unless a current visible broken state requires it.

#### Checklist

- [x] Confirm all live user-facing graph node deletion paths for prep.
- [x] Preserve Console `node.delete` history behavior as the accepted reference seam.
- [x] Route canvas selected-node Delete/Backspace deletion through `removeGraphNodeWithHistory(...)`.
- [x] Preserve selected-edge Delete/Backspace precedence over selected-node deletion.
- [x] Preserve selected-node, selected-edge, hovered-edge, selected-waypoint, user feedback, and prompt/menu behavior after successful deletion.
- [x] Prove Sketch node deletion creates one canonical `Remove graph node` entry from the canvas keyboard surface.
- [x] Prove Extrude node deletion creates one canonical `Remove graph node` entry from the canvas keyboard surface.
- [x] Prove undo/redo restores the deleted node and authored connected graph state.
- [x] Prove missing-node store deletion and no-selection canvas keyboard deletion attempts create no entries; protected/canceled delete paths are not live in this phase.
- [x] Prove internal/system graph setup and normalization paths remain history-free where appropriate.
- [x] Run focused graph-history and deletion-surface tests.
- [x] Run production build.
- [x] Update this phase doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` during implementation closeout.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx -t "delete"`
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "deletes a selected sketch node"`

If panel deletion is touched, also run:

- `npm.cmd test -- --run src/app/panels/SpaghettiPanel.test.tsx -t "delete"`

Build gate:

- `npm.cmd run build`

#### Phase 7 Closeout

Implemented in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` and `src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx`.

Verification:
- `npm.cmd test -- --run src/app/spaghetti/canvas/SpaghettiCanvas.render.test.tsx` passed 4 tests
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed 16 tests
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "deletes a selected sketch node"` passed 1 focused test with 259 skipped
- `npm.cmd run build` passed with the known Vite browser-externalization and chunk-size warnings

`Edit-History-3-CLG-19` is ready for Manager acceptance because canvas selected-node Delete/Backspace deletion now creates canonical `Remove graph node` entries through `removeGraphNodeWithHistory(...)`, Sketch and Extrude node deletion are undoable/redoable from the canvas keyboard surface, related authored graph edges restore through the graph snapshot owner, selected-edge Delete/Backspace keeps precedence over selected-node deletion, no-selection canvas Delete creates no entry, and Console `node.delete` remains the accepted reference seam.

#### Tracking Docs

Prep changes update only:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/Doc-Log.md`

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

Do not update the family index during implementation unless Manager explicitly asks to reconcile broader Edit History status.

#### Stop Condition

Stop and report instead of widening if deletion history requires changing graph load/hydration semantics, OutputPreview singleton repair, node registry availability, graph command contracts, workspace selection ownership, protected system-node rules, or a broad every-command history wrapper.

Stop and report if undo/redo would need to capture selection, hover, camera/view, node palette/menu state, command transcript, command recall, workspace shell state, runtime/cache/provider state, accepted build outputs, preview geometry, worker progress, history UI state, persistence, or async entries.

#### Done Shape

Phase 7 is done when every live user-facing graph node deletion surface uses canonical `Remove graph node` history entries, Sketch and Extrude deletion each produce one undoable/redoable snapshot where those deletions are live, undo/redo restores authored graph document state through the existing graph-history owner, excluded UI/runtime/session state remains outside the snapshot, focused verification and build pass, and tracking docs are updated. `Edit-History-3-CLG-19` can be ready for Manager acceptance at that point.

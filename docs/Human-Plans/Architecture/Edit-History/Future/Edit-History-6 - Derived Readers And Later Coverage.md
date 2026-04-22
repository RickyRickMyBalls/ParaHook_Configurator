# Edit History 6 - Derived Readers And Later Coverage

## Doc Header

### Doc History
13. 2026-04-22 04:10:03: Manager accepted `Edit-History-6 / Phase 3 - Later Coverage Routing`, marked `Edit-History-CLG-30` complete as a routing-only closeout, and closed the current Gen 1 derived-reader/Build Path coverage by treating the absent live Build Path playhead as a future Gen 3 follow-up if that surface is introduced later.
12. 2026-04-22 04:07:31: Implemented the docs-only `Edit-History-6 / Phase 3 - Later Coverage Routing` closeout by recording Gen 2 durable setting/content routes, Gen 3 advanced history UX/checkpoint/branch/comparison routes, conditional collaboration handling, `Edit-History-CLG-28` deferral, and a no-runtime-implementation closeout recommendation for `Edit-History-CLG-30`.
11. 2026-04-22 04:06:57: Manager approved the prepped `Edit-History-6 / Phase 3 - Later Coverage Routing` spec after confirming it keeps the phase docs-only, separates Gen 2 durable single-user undo candidates from Gen 3 advanced history UX/checkpoint/branch/comparison candidates, preserves collaboration/multiplayer as conditional, keeps `Edit-History-CLG-28` deferred for a future live Build Path playhead surface, and blocks all runtime undo implementation from this closeout pass.
10. 2026-04-22 04:05:49: Tightened `Edit-History-6 / Phase 3 - Later Coverage Routing` into a Worker-ready docs-only routing spec for `Edit-History-CLG-30`, separating Gen 2 durable single-user setting/content undo candidates from Gen 3 advanced history UX/checkpoints/branching and conditional collaboration while keeping all runtime undo implementation out of this phase.
9. 2026-04-22 04:04:53: Manager accepted `Edit-History-6 / Phase 2 - History Labels And Reader Contract` after reviewing the proof-only reader-contract implementation and rerunning focused reader-contract, owner, graph, Browser/project, Import/Catalog, Viewer Transform, and production build verification; `Edit-History-CLG-29` is accepted complete while history UI, persistence, Build Path UI, Gen 2 durable setting implementation, runtime/cache/provider history, and command transcript/recall undo remain out of scope.
8. 2026-04-22 04:01:40: Implemented `Edit-History-6 / Phase 2 - History Labels And Reader Contract` as a proof-only slice with focused reader-contract coverage for `getUndoEntries()` / `getRedoEntries()` metadata, accepted Gen 1 adapter labels/sources/targets across graph, feature, sketch, Browser/project, Import/Catalog, and Viewer Transform entries, same-seam UI/console graph metadata, and prior no-op/redo exclusion boundaries; focused verification and production build passed with only known Vite warnings.
7. 2026-04-22 03:56:52: Manager approved the prepped `Edit-History-6 / Phase 2 - History Labels And Reader Contract` spec after confirming the typed `editHistoryStore` entry contract exposes reader-facing label/source/target/transaction/coalesce metadata and accepted Gen 1 adapters already emit stable source and label shapes; implementation should stay proof-first with only tiny metadata fixes if a real gap appears.
6. 2026-04-22 03:55:43: Tightened `Edit-History-6 / Phase 2 - History Labels And Reader Contract` into a Worker-ready proof-first spec grounded in the typed `editHistoryStore` contract and accepted graph, feature, sketch, Browser/project, Import/Catalog, and Viewer Transform adapter metadata shapes.
5. 2026-04-22 03:54:31: Manager accepted `Edit-History-6 / Phase 1.1 - Current Derived Build Reader Proof` after reviewing the focused proof and rerunning derived-sync, build/viewport selector, viewport result selector, transform-history, and production build verification; `Edit-History-CLG-27` is accepted complete for the current live derived build/viewport reader seams, while `Edit-History-CLG-28` and `Phase 1.2` remain open/deferred until a live Build Path playhead surface exists.
4. 2026-04-22 03:51:59: Implemented `Edit-History-6 / Phase 1.1 - Current Derived Build Reader Proof` with focused proof that existing derived build/viewport readers recompute from canonical authored undo/redo state, build runtime/progress state remains outside canonical history, and current transform scrub-like navigation does not create entries or invalidate redo.
3. 2026-04-22 03:50:03: Manager approved the prepped `Edit-History-6 / Phase 1.1 - Current Derived Build Reader Proof` spec after confirming no live Build Path component/store/playhead seam exists in `src/app`, current Build Path-adjacent seams are derived build/viewport readers plus runtime build status, and `Phase 1.2` should remain deferred until a real Build Path surface exists.
2. 2026-04-22 03:48:48: Tightened `Edit-History-6 / Phase 1 - Build Path Derived Sync` into a Worker-ready split between immediate proof-only derived build/viewport reader coverage and a later live `Build Path` surface/playhead implementation slice after source research found no current `Build Path` component or store seam.
1. 2026-04-22 00:11:26: Created this `Edit History` future plan for `Build Path` synchronization, derived history readers, history UI labels, and routing later durable scene, productivity, workspace, and sampler undo candidates into follow-on generations.

### Purpose

This plan makes derived readers respond to canonical edit history and records the later undoable-surface holding pen.

## Doc Body

### Scope

In scope:
- `Build Path` responding to canonical authored undo/redo
- derived timeline/history readers rebuilding from canonical entries
- labels and metadata that make history understandable
- follow-on routing for durable scene presentation, productivity, workspace layout, and sampler settings

Out of scope:
- making `Build Path` a second undo owner
- treating timeline playhead movement as authored undo
- collaboration or multiplayer branching
- implementing every later durable setting in this phase

### Acceptance Read

This phase is complete when derived readers can react to canonical undo/redo without owning their own competing authored undo stack, and later undo candidates have clear generation routing instead of silently becoming scope creep.

## Vision

Once core authored surfaces are undoable, ParaHook can make history visible.

That visibility should be derived. `Build Path`, labels, timelines, and audit views can tell the story of authored history, but they should not secretly become new sources of undo truth.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-HLG-5` - Keep durable scene presentation, productivity state, workspace layout, and optional sampler settings visible as later undo candidates without starting there.
- [x] `Edit-History-HLG-7` - Keep `Build Path`, history UI, and other timeline readers derived from canonical edit history instead of letting them become independent undo owners.

### `Edit-History-6`

- [x] `Edit-History-CLG-27` - Make `Build Path` refresh when canonical authored undo/redo changes the current authored state.
- [x] `Edit-History-CLG-28` - Keep `Build Path` playhead movement as navigation unless an explicit authored commit action is introduced.
- [x] `Edit-History-CLG-29` - Add enough entry labels and metadata for future history UI to read canonical entries.
- [x] `Edit-History-CLG-30` - Route durable scene presentation, productivity, workspace layout, and sampler settings into later generation docs instead of hiding them inside Gen 1 implementation.

## [ ] `Edit-History-6 / Phase 1` - `Build Path Derived Sync`

Make current derived build/viewport readers respond to canonical authored undo/redo, and reserve the live `Build Path` workspace/playhead proof for the first phase that has an actual `Build Path` surface to test.

### Phase 1 Summary

Purpose:
- keep `Build Path` and adjacent derived build/viewport readers downstream from canonical authored state
- prove canonical undo/redo changes are visible through derived readers without giving those readers their own authored undo stack
- keep playhead/scrub/navigation state out of canonical edit history unless a later phase introduces an explicit authored commit action

Owns:
- `Edit-History-CLG-27` for the current live derived build/viewport reader seams only
- a first exclusion proof for `Edit-History-CLG-28` where current live navigation/scrub-like seams exist outside `Build Path`
- implementation guidance for the later live `Build Path` workspace surface

Does not own:
- building the `Build Path` workspace UI, command rows, branch view, or playhead
- making `Build Path` a second canonical undo owner
- history panel UI or advanced label work owned by `Edit-History-6 / Phase 2`
- persistence, collaboration, Gen 2 durable setting coverage, scene/material/productivity/workspace/sampler undo implementation, command transcript/recall, runtime/cache/provider history, or unrelated Catalog/Pubwheel work

Current live seams:
- Source research did not find a live `BuildPath`, `Build Path`, or `buildPath` workspace component/store in `src/app`; the only `buildPath` source match is an SVG helper inside `src/app/components/ReferenceTimelineGraph.tsx`.
- `src/app/components/buildViewportResultSelectorOptions.ts` builds the current viewport result selector options from current app/spaghetti state, graph documents, Browser build policy, accepted/committed geometry results, preview preparation, and interaction placeholders.
- `src/app/spaghetti/selectors/selectViewportResultState.ts` is the current derived viewport result reader; its test file already carries broad draft/final/live/release/manual result projection coverage.
- `src/app/components/ViewerHost.tsx` and `src/app/components/ViewportOverlay.tsx` consume `buildViewportResultSelectorOptions(...)` plus `selectViewportResultState(...)` as current derived reader wiring.
- `src/app/store/buildStatsStore.ts`, `src/app/bootstrapBuildWiring.ts`, and `src/app/buildDispatcher.ts` own build progress/runtime dispatch state and should remain excluded from canonical edit-history ownership.
- Existing scrub/playhead-like live seams are not `Build Path`: Viewer Transform history scrub/index state, audio sampler playhead state, and reference timeline graph rendering are local navigation/projection state and should stay no-entry unless a later durable owner is approved.

First-pass decisions:
- Split Phase 1 into `Phase 1.1` and `Phase 1.2`.
- `Phase 1.1` is proof-only against the current derived build/viewport reader seams because no live `Build Path` surface exists yet.
- `Phase 1.2` is a later implementation/proof slice for the actual `Build Path` workspace, command-row reader, and playhead once that surface exists.
- Do not close all of `Edit-History-CLG-27` or `Edit-History-CLG-28` from `Phase 1.1` unless Manager accepts that current derived build/viewport readers are the only live Build Path-adjacent surface available today.

### Phase 1 Implementation Spec

Likely files:
- `src/app/components/buildViewportResultSelectorOptions.ts`
- `src/app/components/buildViewportResultSelectorOptions.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- a new focused proof file only if the existing selector tests cannot express canonical undo/redo refresh cleanly, for example `src/app/store/buildPathDerivedSync.test.ts`
- regression proof inputs from the accepted canonical history seams, such as `src/app/spaghetti/store/graphEditHistoryStore.test.ts`, `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`, `src/app/store/browserOrganizationEditHistoryStore.test.ts`, or `src/app/store/viewerTransformEditHistoryStore.test.ts`, only when directly needed
- docs closeout in this future doc, `docs/CHANGELOG.md` for implementation/proof changes, and `docs/Doc-Log.md` for docs maintenance

Exact boundary:
- Add focused tests proving current derived build/viewport readers recompute from current authored state after a canonical undo/redo changes graph/CAD/project/transform authored state.
- Add focused tests proving build runtime/progress stores and current scrub/playhead-like navigation controls do not create canonical edit-history entries and do not invalidate redo.
- Do not add a `Build Path` store, command row model, playhead, or UI in this phase.
- Do not subscribe derived readers directly to `editHistoryStore`; readers should consume current authored app/spaghetti state.

No-widening rule:
- No scrub acceptance UX, no Build Path UI, no history panel UI, no persistence, no collaboration, no Gen 2 durable settings, no scene/material/productivity/workspace/sampler undo implementation, no command transcript/recall routing, no runtime/cache/provider history, and no unrelated Catalog/Pubwheel cleanup.

Implementation risks:
- The `Build Path` family doc describes a future workspace, but the current source tree does not expose that workspace; trying to implement `Build Path` now would create a new surface rather than prove derived-reader behavior.
- Build/runtime state is intentionally downstream and noisy; tests must avoid treating worker progress, preview readiness, or cache/provider state as authored history.
- Selector tests may need small fixtures to model current authored graph changes without pulling in broad app shell behavior.
- If proof requires app-shell wiring or new UI, stop and report instead of widening.

Checklist:
- [x] Confirm there is still no live `Build Path` component/store before implementation starts.
- [x] Prove the current derived viewport/build result reader changes when canonical authored undo/redo changes the authored source state it reads.
- [x] Prove derived readers do not store duplicate canonical history entries.
- [x] Prove build progress/runtime stores remain outside canonical edit history.
- [x] Prove current scrub/playhead-like local navigation seams remain no-entry/no-redo-invalidation.
- [x] Keep `Edit-History-CLG-28` marked open unless a live `Build Path` playhead seam exists or Manager explicitly accepts the current no-live-surface exclusion proof.

Focused verification:
- `npm.cmd test -- --run src/app/components/buildViewportResultSelectorOptions.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `npm.cmd test -- --run <new focused derived-sync proof test>` if a new proof file is added
- `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts` only if transform-history scrub/no-entry proof is used

Build gate:
- `npm.cmd run build`

Tracking docs:
- update `docs/CHANGELOG.md` for implementation/proof test behavior
- update this future doc with verification notes and checklist status
- update `docs/Doc-Log.md` for doc maintenance
- do not update the family index; Manager owns CLG status after acceptance

Stop condition:
- Stop and report if implementation requires creating a `Build Path` workspace/store, changing build worker/provider/cache ownership, or making navigation/playhead state durable authored history.

Done shape:
- Phase 1.1 may be marked complete when focused proof shows existing derived build/viewport readers refresh from current authored state after canonical undo/redo, while build/runtime/progress and local navigation states remain outside canonical history.
- `Edit-History-CLG-27` is only fully closeable if Manager accepts the current derived-reader proof as the complete live Build Path-adjacent surface.
- `Edit-History-CLG-28` should remain open for `Phase 1.2` unless a real `Build Path` playhead exists and is proven navigation-only.

## [x] `Edit-History-6 / Phase 1.1` - `Current Derived Build Reader Proof`

Proof-only implementation slice for the current source tree.

Implementation direction:
- use the existing derived build/viewport selectors as the live stand-in for Build Path-adjacent derived readers
- prove canonical authored undo/redo changes the current state those selectors read
- prove build runtime/progress and current navigation/scrub-like state do not create canonical history entries

Acceptance:
- [x] current derived build/viewport reader tests pass after canonical authored undo/redo proof is added
- [x] build runtime/progress and navigation/scrub-like operations remain no-entry/no-redo-invalidation
- [x] no `Build Path` workspace/store is introduced

Verification:
- `npm.cmd test -- --run src/app/store/buildPathDerivedSync.test.ts` passed with 3 tests.
- `npm.cmd test -- --run src/app/components/buildViewportResultSelectorOptions.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/spaghetti/selectors/selectViewportResultState.test.ts` passed with 54 tests.
- `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts` passed with 12 tests.
- `npm.cmd run build` passed with only the known Vite warnings.

Closeout notes:
- `Phase 1.1` advances `Edit-History-CLG-27` for current live derived build/viewport reader seams.
- `Edit-History-CLG-28` remains open for `Phase 1.2` because no live `Build Path` playhead surface exists yet.

## [ ] `Edit-History-6 / Phase 1.2` - `Live Build Path Surface Sync And Playhead Exclusion`

Later implementation/proof slice for the first actual `Build Path` workspace surface.

Implementation direction:
- wire the live `Build Path` reader to derive from current authored graph/CAD/project/transform state and accepted build/result data
- prove canonical undo/redo refreshes command rows or equivalent build-step descriptors
- prove `Build Path` playhead movement is navigation-only and creates no canonical entries

Acceptance:
- undo/redo of graph/CAD/project/transform authored changes visibly affects the live `Build Path` surface where it reads those authored changes
- moving the `Build Path` playhead does not create canonical entries or invalidate redo
- `Build Path` stores projection/navigation state only, not a competing authored undo stack

## [x] `Edit-History-6 / Phase 2` - `History Labels And Reader Contract`

Define reader-facing labels and metadata.

### Phase 2 Summary

Purpose:
- tighten `Edit-History-CLG-29` so future history readers can read canonical entries from stable labels and source/target metadata
- prove the current Gen 1 accepted adapters emit enough common metadata without making future readers inspect every subsystem's private payload
- keep labels and metadata reader-facing only; undo/redo ownership remains in `editHistoryStore` and each adapter's synchronous operation callbacks

Owns:
- the typed reader-facing contract around `EditHistoryEntry.label`, `source.surface`, `source.sourceId`, `source.sourceLabel`, `targetId`, `targetLabel`, optional `transactionId`, and optional `coalesceKey`
- representative proof across accepted Gen 1 entry producers:
  - graph structure, graph node movement, and graph parameter commits
  - feature stack, feature parameter, and sketch component commits
  - Browser/project rename, move, create, and delete commits
  - accepted Import and Catalog Add To Project commits
  - Viewer Transform reference/content-object commits
  - console parity as a shared graph-history producer, not a separate label vocabulary

Does not own:
- a large history panel UI
- persistence, collaboration, branching, checkpoints, or entry serialization
- Build Path UI, command rows, playhead, or scrub acceptance UX
- Gen 2 durable scene/material/productivity/workspace/sampler undo implementation
- changing command transcript/recall, runtime/cache/provider state, or unrelated Catalog/Pubwheel work

Current live seams:
- `src/app/store/editHistoryStore.ts` already defines a common entry contract with stable `entryId`, human `label`, required `source.surface`, optional `sourceId/sourceLabel`, optional target metadata, optional transaction/coalesce metadata, and synchronous undo/redo callbacks.
- `src/app/store/editHistoryStore.test.ts` already proves the owner preserves labels, source metadata, target metadata, transaction ids, and coalesce keys in stack reads.
- `src/app/spaghetti/store/useSpaghettiStore.ts` emits graph-family sources:
  - `spaghetti-graph / graph-structure / Graph Structure`
  - `spaghetti-graph / graph-node-position / Graph Node Position`
  - `spaghetti-graph / graph-node-parameter / Graph Node Parameter`
  - `spaghetti-graph / graph-feature-stack / Graph Feature Stack`
  - `spaghetti-graph / graph-feature-parameter / Graph Feature Parameter`
  - `spaghetti-graph / graph-sketch-feature / Graph Sketch Feature`
- Graph-family labels currently include `Add graph node`, `Remove graph node`, `Connect graph wire`, `Remove graph wire`, `Move graph node`, `Change graph parameter`, `Add feature`, `Reorder feature`, `Change feature parameter`, `Add sketch component`, `Change sketch component`, `Reorder sketch component`, and `Remove sketch component`.
- `src/app/store/useAppStore.ts` emits Browser/project and reference-family sources:
  - `browser / browser-project-organization / Browser Project Organization`
  - `browser / browser-accepted-import / Browser Accepted Import`
  - `catalog / catalog-add-to-project / Catalog Add To Project`
  - `viewer-transform / viewer-transform / Viewer Transform`
- App-store labels currently include `Rename Browser item`, `Move Browser item`, `Create Browser item`, `Delete Browser item`, `Accept Import`, `Add Catalog item to project`, and `Change Viewer transform`.
- Existing focused tests already assert metadata for many adapters, but coverage is spread out and not yet shaped as one future-reader contract proof.

First-pass decisions:
- Make Phase 2 proof-first in tests. Current runtime types and adapter metadata appear sufficient for the next reader contract.
- Do not split into Phase 2.1/2.2 yet; label contract and adapter proof can fit in one focused implementation slice.
- Prefer a compact new proof test over widening production code. A good shape is `src/app/store/editHistoryReaderContract.test.ts` or a similarly named focused test that creates representative entries through accepted store seams and asserts only the reader-facing metadata contract.
- If the proof finds a real adapter gap, allow only tiny metadata fixes to existing entry construction. Do not build a history UI or introduce serialized entry schemas in this phase.

### Phase 2 Implementation Spec

Likely files:
- `src/app/store/editHistoryStore.ts` only if a tiny type/reader helper is required
- `src/app/store/editHistoryStore.test.ts`
- new focused proof test such as `src/app/store/editHistoryReaderContract.test.ts`
- existing focused adapter tests only if a gap is easier to prove locally:
  - `src/app/spaghetti/store/graphEditHistoryStore.test.ts`
  - `src/app/spaghetti/store/featureStackEditHistoryStore.test.ts`
  - `src/app/spaghetti/store/featureParameterEditHistoryStore.test.ts`
  - `src/app/spaghetti/store/sketchEditHistoryStore.test.ts`
  - `src/app/store/browserOrganizationEditHistoryStore.test.ts`
  - `src/app/store/importCatalogEditHistoryStore.test.ts`
  - `src/app/store/viewerTransformEditHistoryStore.test.ts`
- docs closeout in this future doc, `docs/CHANGELOG.md` for implementation/proof changes, and `docs/Doc-Log.md` for docs maintenance

Exact boundary:
- Add focused proof that canonical `getUndoEntries()` / `getRedoEntries()` expose enough metadata for a future reader to group entries by surface/source and show a useful target label without accessing private snapshot payloads.
- Prove representative accepted adapters emit:
  - a stable human label
  - source surface
  - source id
  - source label
  - target id when a concrete authored target exists
  - target label when the target has a readable name/category
- Prove console and UI graph mutations over the same accepted graph seams read as the same canonical change type instead of introducing console-only labels.
- Preserve undo/redo behavior, no-op behavior, redo invalidation behavior, and exclusion boundaries from prior phases.
- Do not change the entry payload into a persistent/serialized schema in this phase.

No-widening rule:
- No large history panel UI, no persistence, no collaboration/branching/checkpoints, no Build Path UI/store/playhead, no Gen 2 durable setting implementation, no runtime/cache/provider history, no command transcript/recall undo, and no unrelated Catalog/Pubwheel cleanup.

Implementation risks:
- Existing metadata coverage is decentralized; a single proof test may need small fixtures for many stores. Keep it representative instead of exhaustively re-testing every undo behavior.
- Some targets use ids as labels when no better user-facing name exists, such as graph edge ids or feature ids. That is acceptable only when the spec records it and the reader can still render a deterministic fallback.
- If a future UI needs icons, grouping categories, timestamps, or surface ordering, those are Phase 2-adjacent but should not be added unless Manager explicitly widens the scope.

Checklist:
- [x] Confirm `EditHistoryEntry` exposes stable label, source, target, transaction, and coalesce metadata through read APIs.
- [x] Prove graph structure, movement, parameter, feature, sketch, Browser/project, Import/Catalog, and Viewer Transform entries expose reader-facing metadata.
- [x] Prove UI and console graph mutations over the same seam share canonical graph labels/source metadata.
- [x] Identify any accepted adapter whose label/source/target metadata is missing or too vague for a future reader.
- [x] Add only minimal metadata fixes if a real gap is found.
- [x] Keep history UI, persistence, Build Path UI, and later durable settings out of scope.

Focused verification:
- `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts` if a new proof file is added
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts`
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` if graph/console parity metadata proof touches graph seams
- `npm.cmd test -- --run src/app/store/browserOrganizationEditHistoryStore.test.ts` if Browser metadata proof is added locally
- `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts` if Import/Catalog metadata proof is added locally
- `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts` if Viewer Transform metadata proof is added locally

Build gate:
- `npm.cmd run build`

Tracking docs:
- update `docs/CHANGELOG.md` for shipped implementation/proof behavior
- update this future doc with checklist, verification, and closeout notes
- update `docs/Doc-Log.md` for doc maintenance
- do not update the family index; Manager owns CLG status after acceptance

Stop condition:
- Stop and report if closing `Edit-History-CLG-29` requires a history panel, entry persistence/serialization, a broad adapter label rewrite, timestamps, icon taxonomies, or Build Path UI work.

Done shape:
- Phase 2 is complete when a focused proof shows current canonical entries from accepted Gen 1 adapters expose stable reader-facing labels and source/target metadata, with any tiny metadata gaps fixed and verified.
- `Edit-History-CLG-29` can be recommended for Manager acceptance when future readers no longer need subsystem-private snapshot payloads to list, group, and identify canonical entries.

Verification:
- `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` passed with 18 tests.
- `npm.cmd test -- --run src/app/spaghetti/store/graphEditHistoryStore.test.ts` passed with 16 tests.
- `npm.cmd test -- --run src/app/store/browserOrganizationEditHistoryStore.test.ts` passed with 13 tests.
- `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts` passed with 5 tests.
- `npm.cmd test -- --run src/app/store/viewerTransformEditHistoryStore.test.ts` passed with 12 tests.
- `npm.cmd run build` passed with only the known Vite externalized-module and chunk-size warnings.

Closeout notes:
- Phase 2 is complete as a proof-only slice; no production metadata changes were required.
- `Edit-History-CLG-29` is recommended for Manager acceptance because future readers can list, group, and identify accepted Gen 1 canonical entries from public entry metadata without inspecting private undo/redo payloads.
- History UI, persistence, Build Path UI, Gen 2 durable settings, runtime/cache/provider history, command transcript/recall undo, and unrelated Catalog/Pubwheel work remained out of scope.

## [x] `Edit-History-6 / Phase 3` - `Later Coverage Routing`

Route later undoable candidates into follow-on generation docs.

### Phase 3 Summary

Purpose:
- close `Edit-History-CLG-30` by routing later undo candidates into explicit follow-on planning instead of letting them creep into Gen 1 implementation
- separate durable single-user authored settings/content that belong in Gen 2 from advanced history reader/UX, checkpoint, branch, comparison, and conditional collaboration work that belongs in Gen 3 or later
- keep this phase docs-only; it prepares routing/index/future-plan language and does not start runtime undo implementation

Owns:
- later-coverage routing for:
  - durable scene/material/environment presentation settings
  - notepad/dashboard content and board organization
  - workspace layout/preferences once ownership and storage are clear
  - sampler/import settings that affect durable authored output
  - advanced history UX/readers, inspectable history, labels beyond the Phase 2 contract, and history presentation affordances
  - checkpoints/snapshots, optional branching, and advanced `Build Path` comparison/read views
- generation placement language:
  - Gen 2: durable single-user authored/project/user settings and content candidates after they have clear ownership, storage, and commit boundaries
  - Gen 3: advanced history visualization, checkpoint/snapshot workflows, optional branching, advanced comparison surfaces, and collaboration/multiplayer only if promoted by the user
- acceptance language for `Edit-History-CLG-30`

Does not own:
- runtime undo entries for scene/material/environment, productivity, workspace layout, sampler/import settings, or any later candidate
- creating Gen 2 or Gen 3 runtime implementation docs in this prep pass
- history panel UI, persistence, collaboration, multiplayer branching, checkpoint storage, or `Build Path` comparison implementation
- changing source code, tests, schemas, storage, keyboard dispatch, command transcript/recall, runtime/cache/provider state, or unrelated Catalog/Pubwheel work
- revisiting accepted Gen 1 implementation beyond describing what stays closed or deferred

Current known docs/seams to inspect:
- `docs/Vision.md` and `docs/Human-Plans/roadmap/Vision-roadmap.md` for the rule that graph-authored truth and explicit project/content ownership stay ahead of viewer/runtime convenience
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Index.md` for the family holding pen and current CLG status
- `docs/Human-Plans/Architecture/Edit-History/Edit-History-Vision.md` for long-range undoable-surface goals and generation routing
- completed Gen 1 future docs:
  - `Edit-History-1 - Canonical Transaction Foundation.md`
  - `Edit-History-2 - Graph And Parameter Undo Coverage.md`
  - `Edit-History-3 - Node CAD And Sketch Undo Coverage.md`
  - `Edit-History-4 - Browser Project Content And Accepted Import Undo Coverage.md`
  - `Edit-History-5 - Viewer Transform Commit Undo Integration.md`
  - this `Edit-History-6 - Derived Readers And Later Coverage.md`
- adjacent planning homes to reference, not modify in this phase, where later candidates may land:
  - `docs/Human-Plans/Architecture/Workspace-Modes/`
  - Browser/project/content architecture docs when project-owned settings become durable
  - Viewer/transform or presentation docs when scene/material/environment settings become authored rather than runtime/view state
  - Import/Catalog docs only for durable accepted import/sampler settings, not source browsing/cache/provider state

First-pass decisions:
- Keep Phase 3 as a docs-only routing/index prep and closeout slice.
- Do not split Phase 3 unless Manager wants separate implementation documents for Gen 2 and Gen 3 routing. The current work can fit in one prep/implementation pass because it changes planning truth only.
- Treat Gen 2 as the next single-user durable undo expansion after Gen 1: scene/material/environment authored settings, productivity content, workspace layout/preferences, and committed sampler/import settings after each has a clear owner and storage boundary.
- Treat Gen 3 as advanced history productization: visible history UI, inspectable/auditable readers, checkpoints/snapshots, optional branching, advanced `Build Path` comparison, and collaboration/multiplayer only if the user explicitly promotes it.
- Keep `Edit-History-CLG-28` open unless a live `Build Path` playhead surface exists; Phase 3 may route advanced Build Path comparison but should not pretend current Gen 1 has built that surface.

### Phase 3 Implementation Spec

Exact doc outputs expected if approved:
- Update this Phase 3 section with final closeout notes, verification, and `Edit-History-CLG-30` recommendation after the docs-only implementation pass.
- Update `docs/Human-Plans/Architecture/Edit-History/Edit-History-Index.md` only if Manager approves implementation, to record the Gen 2 / Gen 3 routing decision and mark `Edit-History-CLG-30` ready or complete according to Manager status.
- Update `docs/Human-Plans/Architecture/Edit-History/Edit-History-Vision.md` only if the later-generation language needs alignment with the index.
- Update `docs/Doc-Log.md` for document maintenance.
- Do not update `docs/CHANGELOG.md` unless runtime code changes, which this phase should not do.
- Do not create Gen 2 or Gen 3 future docs in the first approved implementation pass unless Manager explicitly widens the output; this phase can list exact future-doc candidates without opening them yet.

Likely docs to create/update later, after this routing phase:
- Gen 2 future doc candidate: durable scene/material/environment presentation setting undo once those settings are authored/project/user state with clear storage.
- Gen 2 future doc candidate: notepad/dashboard content and durable board organization undo once productivity content ownership is explicit.
- Gen 2 future doc candidate: workspace layout/preferences undo once layout state is durable and not merely session/window navigation.
- Gen 2 future doc candidate: sampler/import settings undo only for committed settings that affect durable authored output, not previews, providers, source browsing, cache, or upload/session status.
- Gen 3 future doc candidate: advanced history UI/readers, timeline presentation, filtering, and inspectable labels beyond the Phase 2 public metadata contract.
- Gen 3 future doc candidate: checkpoints/snapshots and optional branching after persistence and single-user semantics are specified.
- Gen 3 future doc candidate: advanced `Build Path` comparison and branch/variant comparison after a live Build Path surface exists.
- Conditional later doc candidate: collaboration/multiplayer history only if the user promotes collaboration as an explicit product direction; do not route it as automatic Gen 2 work.

No-widening rule:
- This phase prepares routing/index/future-plan docs only.
- No runtime source code, no tests, no new undo adapters, no schema/storage changes, no history panel UI, no persistence/checkpoint implementation, no collaboration implementation, no Build Path UI/comparison implementation, no scene/material/environment setting implementation, no productivity workspace implementation, no sampler/import setting implementation, no command transcript/recall undo, no runtime/cache/provider history, and no unrelated Catalog/Pubwheel edits.

Implementation risks:
- Later candidates are tempting because Phase 2 made entries readable. Keep readable history separate from implementing new undoable owners.
- Scene/material/environment and workspace layout can look like viewer settings today; they should not become canonical undo until they are modeled as durable authored/project/user state.
- Sampler/import settings may sit near preview/cache/provider flows. Only committed durable settings that affect authored output belong in later undo coverage.
- Advanced history UI, checkpoints, and branching can imply persistence and serialization; those are Gen 3 or later and should not be smuggled into this routing phase.
- Collaboration/multiplayer history changes the semantics of undo, ownership, and conflict resolution; keep it conditional unless the user promotes it.

Checklist:
- [x] Confirm current family index and EH6 doc still list `Edit-History-CLG-30` as the remaining later-coverage routing item.
- [x] Record Gen 2 durable-setting/content candidates without starting their runtime implementation.
- [x] Record Gen 3 advanced-reader/checkpoint/branch/comparison candidates without creating storage, history UI, or collaboration behavior.
- [x] Keep collaboration/multiplayer conditional on explicit user promotion.
- [x] Preserve `Edit-History-CLG-28` as deferred until a live `Build Path` playhead surface exists.
- [x] Keep docs output scoped to active EH6/index/vision/tracking docs only, with no source/test changes.

Focused verification for docs-only work:
- Read back this Phase 3 section and confirm it contains `Phase 3 Summary`, `Phase 3 Implementation Spec`, Gen 2 / Gen 3 routing, no-widening rules, stop condition, done shape, and explicit `Edit-History-CLG-30` acceptance language.
- Optionally run `git diff -- docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-6 - Derived Readers And Later Coverage.md docs/Doc-Log.md` to verify the write set.
- No `npm.cmd test` or `npm.cmd run build` is required for prep-only docs work.

Tracking-doc requirements:
- Prep pass: update this EH6 future doc and `docs/Doc-Log.md` only.
- Approved docs-only implementation pass: update this EH6 future doc, `docs/Doc-Log.md`, and family routing docs only if Manager approves those exact outputs.
- No `docs/CHANGELOG.md` entry unless runtime behavior changes.
- Manager owns family-index CLG status after review unless the approved implementation explicitly requests index changes.

Stop condition:
- Stop and report if closing `Edit-History-CLG-30` would require source code, tests, runtime undo adapters, new storage/persistence/checkpoint semantics, a history UI, a new Build Path surface, or creating Gen 2 / Gen 3 future docs before Manager approves that output.

Done shape:
- Phase 3 is prep-ready when the routing spec names the later candidates, assigns them to Gen 2 or Gen 3, preserves collaboration/multiplayer as conditional, and clearly states that Gen 1 remains closed around authored CAD/project/transform/derived-reader foundations.
- An approved implementation pass can mark Phase 3 complete when the family docs explicitly route later durable scene/material/environment settings, productivity content, workspace layout/preferences, sampler/import settings, advanced history UX/readers, checkpoints/snapshots, optional branching, and advanced Build Path comparison into later generation planning without starting runtime undo implementation.
- `Edit-History-CLG-30` can be recommended for Manager acceptance when later durable scene presentation, productivity, workspace layout, and sampler setting candidates are visible in follow-on routing and cannot be mistaken for hidden Gen 1 implementation scope.

Verification:
- Read back this Phase 3 section and confirmed it contains Gen 2 / Gen 3 routing, no-widening rules, stop condition, done shape, `Edit-History-CLG-30` recommendation language, and `Edit-History-CLG-28` deferral.
- Read back `Edit-History-Index.md` and `Edit-History-Vision.md` updates to confirm later-generation routing is visible at the family level.
- No `npm.cmd test` or `npm.cmd run build` was run because this implementation changed documentation only.

Closeout notes:
- Phase 3 is complete as a docs-only routing closeout; no runtime source, tests, schemas, storage, keyboard dispatch, or undo adapters were changed.
- Gen 2 is routed to durable single-user undo candidates: scene/material/environment presentation settings, productivity content, workspace layout/preferences, and committed sampler/import settings after each has explicit ownership, storage, and commit boundaries.
- Gen 3 is routed to advanced history productization: history UI/readers, checkpoints/snapshots, optional branching, advanced `Build Path` comparison, and collaboration/multiplayer only if the user promotes it.
- `Edit-History-CLG-28` is complete for the current app surface because no live `Build Path` playhead exists and current scrub/playhead-like navigation stays no-entry/no-redo-invalidation; a future live Build Path playhead must reopen coverage in Gen 3 or a new follow-up.
- `Edit-History-CLG-30` is accepted complete because later coverage is now visible in generation routing without hiding runtime undo implementation inside Gen 1.

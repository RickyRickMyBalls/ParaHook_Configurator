# Edit History 1 - Canonical Transaction Foundation

## Doc Header

### Doc History
13. 2026-04-22 00:44:08: Manager accepted `Edit-History-1 / Phase 4` after rerunning the focused input-routing and edit-history owner tests locally, closing `Edit-History-CLG-5` and the full `Edit-History-1` foundation while leaving real graph adapters to `Edit-History-2`.
12. 2026-04-22 00:42:59: Completed `Edit-History-1 / Phase 4 - Foundation Exclusion Proof` after adding focused negative routing and owner tests proving canonical edit history only changes on explicit committed entries or changed transactions, canceled/no-change/runtime-like probes do not create entries or invalidate redo, and camera/navigation, command recall, command transcript, focus/menu/Escape, sketch, reference, and console-local behavior are not claimed by edit-history routing.
11. 2026-04-22 00:40:46: Added `Edit-History-1 / Phase 4 - Foundation Exclusion Proof` as a Worker-ready docs-only prep spec to close the remaining `Edit-History-CLG-5` pure view/runtime exclusion proof with focused owner and routing tests before graph adapter work begins, keeping camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, command recall, and similar runtime/view state out of canonical edit history.
10. 2026-04-22 00:39:46: Manager accepted `Edit-History-1 / Phase 3` after rerunning the focused input-routing test locally, confirming the shared dispatch boundary and marking only `Edit-History-CLG-4` complete while keeping the remaining pure view/runtime exclusion proof open as a foundation follow-up before graph adapter work.
9. 2026-04-22 00:38:27: Completed `Edit-History-1 / Phase 3 - Shared Dispatch Boundary` after adding the pure edit-history undo/redo shortcut route decision, canonical owner dispatch helper, focused input-routing coverage for available/unavailable undo/redo and native editable deferral, and the narrow `useConsoleInteraction` capture-listener integration that calls `editHistoryStore.undo()` / `redo()` only when the canonical owner can perform the operation.
8. 2026-04-22 00:34:18: Tightened `Edit-History-1 / Phase 3 - Shared Dispatch Boundary` into a Worker-ready implementation spec grounded in `src/app/inputRouting.ts`, `src/app/inputRouting.test.ts`, `src/app/console/ConsoleBar.tsx`, and the accepted `editHistoryStore` owner APIs, scoping the next pass to a pure undo/redo shortcut route decision plus one narrow dispatch integration while preserving native text editing, console recall, modal/menu Escape handling, viewer camera/fly shortcuts, reference transform shortcuts, and all real surface adapters.
7. 2026-04-22 00:33:14: Manager accepted `Edit-History-1 / Phase 2` after rerunning the focused owner test locally, confirming the transaction lifecycle implementation and marking only `Edit-History-CLG-3` complete while keeping shared keyboard dispatch, pure view/runtime exclusion proof, and real surface adapters open for later phases.
6. 2026-04-22 00:31:49: Completed `Edit-History-1 / Phase 2 - Transaction Lifecycle` after extending the central `editHistoryStore` owner with typed begin/update/commit/cancel transaction APIs, active transaction reads, single-active-draft protection, changed-transaction commit collapse, cancel/no-change no-entry behavior, focused transaction lifecycle tests, and production build verification while leaving keyboard dispatch, surface adapters, UI, persistence, async entries, and real store wiring deferred.
5. 2026-04-22 00:27:47: Tightened `Edit-History-1 / Phase 2 - Transaction Lifecycle` into a Worker-ready implementation spec grounded in the accepted Phase 1 `editHistoryStore` owner and focused tests, scoping the next pass to begin/update/commit/cancel transaction semantics, transaction-collapse tests, no-change and cancel no-entry behavior, focused verification, and production build while keeping adapters, keyboard dispatch, UI, persistence, async entries, and real store wiring deferred.
4. 2026-04-22 00:26:39: Manager accepted `Edit-History-1 / Phase 1` after rerunning the focused owner test locally, marking only `Edit-History-CLG-1` and `Edit-History-CLG-2` complete while leaving transaction lifecycle, shared dispatch, and broader proof open for the next phases.
3. 2026-04-22 00:25:12: Completed `Edit-History-1 / Phase 1 - Canonical Owner And Entry Contract` after adding the central `editHistoryStore` owner contract, focused owner tests for ordering, undo, redo, redo invalidation, no-op ignore, clear/read state, metadata reads, and thrown-operation stack safety, and passing the focused edit-history test gate plus production build.
2. 2026-04-22 00:20:44: Tightened `Edit-History-1 / Phase 1 - Canonical Owner And Entry Contract` into a Worker-ready implementation spec with summary, live seam read, first code cut, likely files, no-widening rules, focused verification, and done shape for the first canonical edit-history owner pass.
1. 2026-04-22 00:11:26: Created this first implementation-ready `Edit History` plan for the canonical transaction owner, undo/redo entry contract, shared keyboard dispatch boundary, and first adapter seam before broad surface coverage starts.

### Purpose

This plan defines the foundation phase for canonical authored undo/redo.

This phase should create the shared owner and contracts that later graph, CAD, Browser, project, import, catalog, transform, console, and derived-reader work can plug into.

## Doc Body

### Scope

In scope:
- create the canonical edit-history owner or store
- define undoable entry shape and redo invalidation rules
- define transaction lifecycle for live interactions
- define adapter contract for authored subsystem mutations
- wire shared `Ctrl+Z` / `Ctrl+Y` dispatch to the canonical owner where safe
- add focused unit tests for owner semantics

Out of scope:
- complete graph coverage
- complete parameter coverage
- complete Browser/project coverage
- complete transform integration
- `Build Path` timeline UI
- history branching, snapshots, collaboration, or multiplayer semantics

### Acceptance Read

This phase is complete when ParaHook has a tested canonical edit-history owner that can accept authored entries, undo them, redo them, clear redo after a new commit, and treat live interaction transactions as one committed entry.

## Vision

`Edit History 1` should make future undo work easy to add without making each surface invent a local undo truth.

The user-visible result can be small at first. The architectural result should be large: one place owns authored undo/redo and one contract explains how surfaces join it.

## Wishlist Organization

### High Level Goals

- [ ] `Edit-History-HLG-1` - Make graph structure and graph parameter commits undoable first.
- [ ] `Edit-History-HLG-6` - Exclude camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, and command recall from first-generation canonical undo.
- [ ] `Edit-History-HLG-7` - Keep `Build Path`, history UI, and other timeline readers derived from canonical edit history instead of letting them become independent undo owners.

### `Edit-History-1`

- [x] `Edit-History-CLG-1` - Create one canonical authored edit-history owner with undo, redo, commit, clear, and redo-invalidation behavior.
- [x] `Edit-History-CLG-2` - Define the first undoable entry contract, including label, surface/source metadata, undo payload, redo payload, and optional coalescing or transaction identity.
- [x] `Edit-History-CLG-3` - Define transaction begin/update/commit/cancel semantics so live sliders, drags, drops, and typed edits can commit one meaningful entry.
- [x] `Edit-History-CLG-4` - Add first shared dispatch rules for `Ctrl+Z` and `Ctrl+Y` without stealing focus from text editing or modal contexts that must keep local behavior.
- [x] `Edit-History-CLG-5` - Add tests proving owner ordering, redo invalidation, no-op protection, transaction collapse, and exclusion of pure view/runtime state.

## [x] `Edit-History-1 / Phase 1` - `Canonical Owner And Entry Contract`

### Phase 1 Summary

#### Purpose

Create the smallest useful canonical edit-history owner and entry contract so later authored mutation surfaces can join one undo/redo truth instead of inventing local stacks.

This phase is a foundation slice. It should prove owner semantics in isolation first, with a contract that can later wrap graph commands, parameter commits, Browser/project commits, reference transforms, and import handoffs without making any of those surfaces canonical in Phase 1.

#### Owns

- one app-level edit-history owner module near the central app state layer
- the first typed undoable entry shape
- commit, undo, redo, clear, can-undo, can-redo, and redo-invalidation behavior
- no-op rejection or no-op ignore behavior
- entry ordering and stack movement semantics
- pure/focused tests for the owner contract
- stable labels and source metadata that are good enough for later derived history UI

#### Does Not Own

- wiring graph commands into the owner
- wiring `Ctrl+Z` / `Ctrl+Y`
- adding transaction begin/update/commit/cancel behavior
- adding history UI, `Build Path` timeline UI, or derived readers
- making graph parameters, Browser actions, project actions, import actions, transforms, camera, preview, build/runtime progress, console command recall, or text editing undoable
- changing source runtime behavior outside the owner module and its direct tests
- skipping `docs/CHANGELOG.md` once the implementation Worker ships owner behavior

#### Current Live Read

The likely central seam is the app state area under `src/app/store/`, especially `src/app/store/useAppStore.ts` for broad project/app authored state and `src/app/store/useAppStore.test.ts` for app-store behavior tests.

Graph authoring currently has a separate graph store seam in `src/app/spaghetti/store/useSpaghettiStore.ts`. That store exposes graph-level mutation APIs such as `setGraph` and `applyGraphCommand`, while graph command shape is currently a pure `(graph) => graph` function in `src/app/spaghetti/graphCommands/types.ts`.

Graph command tests in `src/app/spaghetti/graphCommands/graphCommands.test.ts` are useful read context because they already prove deterministic command behavior and no-op-style identity preservation. They are not Phase 1 implementation targets unless the first owner tests need read-only examples for entry payload naming.

Existing reference transform history types and helpers in `src/app/store/useAppStore.ts` and `src/viewer/ReferenceTransformHistoryHelper.ts` show local history concepts already exist. Phase 1 should not migrate or delete those local histories; it should establish the canonical owner contract they may adapt to later.

Keyboard dispatch appears to be app-shell/input-routing territory and should remain read-only in this phase. Shared dispatch belongs to Phase 3.

#### First Pass Decisions

- Put the first owner near central app state, not inside `spaghetti`, Browser, Catalog, viewer, or a panel component.
- Prefer a pure owner factory/helper plus a small store-facing API over coupling the first contract directly to React components.
- Store authored edit entries, not DOM events, key events, pointer events, or UI affordance events.
- Make each entry responsible for enough undo/redo execution or payload restoration to replay the authored mutation later.
- Keep `label` and source metadata required or strongly normalized so later history readers have stable display text without parsing payloads.
- Treat no-op entries as not committed. A rejected or ignored result is acceptable, but tests must lock the chosen behavior.
- Keep entry operations synchronous for Phase 1 unless implementation proves the existing app store cannot express the first owner safely without async support.

### Phase 1 Implementation Spec

#### Exact First Code Cut

Add a new edit-history owner module near the central app state layer, with a minimal typed contract similar to:

- `EditHistoryEntry`
  - stable `entryId`
  - stable `label`
  - `source` or `surface` metadata for authored origin
  - undo operation or undo payload restorer
  - redo operation or redo payload restorer
  - optional `coalesceKey` or transaction identity field reserved for later phases, with no live coalescing required in Phase 1
- owner state
  - committed undo stack
  - redo stack
  - optional max-depth constant only if the existing app-store pattern requires bounded state
- owner actions
  - `commit(entry)`
  - `undo()`
  - `redo()`
  - `clear()`
  - `canUndo()`
  - `canRedo()`
  - read entries for tests or future derived readers

The first implementation should be isolated enough that tests can commit fake authored entries whose undo/redo callbacks write to a small local test value or call injected test functions. Do not wire real graph commands, real app-store mutations, or keyboard shortcuts in this first cut.

#### Likely Files

- `src/app/store/editHistoryStore.ts` or `src/app/store/editHistory.ts`
  - preferred new central owner module location if the existing store folder remains the app-level state home
- `src/app/store/editHistoryStore.test.ts` or `src/app/store/editHistory.test.ts`
  - focused owner semantics tests
- `src/app/store/useAppStore.ts`
  - read context only for app-state ownership and future adapter integration; avoid touching unless the owner must be exported through the central store in Phase 1
- `src/app/store/useAppStore.test.ts`
  - read context only; avoid broad app-store regression edits in Phase 1
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - read context only for future graph adapter seams
- `src/app/spaghetti/graphCommands/types.ts`
  - read context only for future graph-entry payload shape
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`
  - read context only for deterministic graph command/no-op expectations

If implementation discovers an existing central state barrel or store-export convention, follow that convention instead of forcing the exact filename above.

#### No-Widening Rule

Do not connect any existing authored surface to the canonical owner in Phase 1.

Do not change graph command behavior, graph store behavior, Browser behavior, Catalog behavior, project persistence, import handoff, reference transform history, console command recall, text input handling, camera/navigation state, build/runtime progress state, preview/cache/provider state, focus/menu state, or any UI.

Do not add global keyboard listeners or dispatch routing in this phase.

Do not convert local histories or remove compatibility paths. Any migration belongs to a later adapter or retirement phase after the canonical owner contract is proven.

#### Implementation Risks

- Owner placement could drift into `spaghetti` if the first examples are graph-heavy; keep the module app-level.
- Callback-based entries can become hard to persist; keep metadata and payload/restorer shape explicit enough that a later snapshot/restoration adapter can replace callbacks if needed.
- No-op detection can become surface-specific too early; Phase 1 should support a generic `isNoop` or equivalent commit guard without graph-specific rules.
- Redo invalidation must be tested before any surface integration, because later adapters will inherit this behavior.
- Future transaction support should not be faked by coalescing in Phase 1; reserve identity fields without implementing lifecycle semantics.

#### Checklist

- [x] Add the central edit-history owner module near `src/app/store/`.
- [x] Define the first typed entry contract with label, source metadata, undo behavior, redo behavior, and reserved transaction/coalescing identity if useful.
- [x] Implement commit ordering with no-op protection.
- [x] Implement undo moving one committed entry onto redo.
- [x] Implement redo moving one redo entry back onto undo.
- [x] Implement redo invalidation when a new entry commits after undo.
- [x] Implement clear and can-undo/can-redo reads.
- [x] Add focused owner tests using fake authored entries.
- [x] Keep graph command/store seams as read context only.
- [x] Update `docs/CHANGELOG.md` only when an implementation Worker actually ships this owner.

#### Verification Shape

Focused tests should cover:

- commits preserve entry order
- undo walks backward and calls the expected undo behavior once per entry
- redo walks forward and calls the expected redo behavior once per entry
- committing after undo clears redo
- no-op entries are rejected or ignored according to the chosen contract
- clear empties both stacks
- metadata/labels remain readable for future derived history readers

Suggested implementation gates:

- `npm test -- --run src/app/store/editHistory*.test.ts`
- `npm run build`

If the exact test filename differs, run the focused edit-history owner test file directly and record the real command in the implementation closeout.

#### Done Shape

Phase 1 is done when the repo has one tested canonical edit-history owner contract that can accept fake authored entries, undo them, redo them, invalidate redo after new commits, reject or ignore no-ops, clear history, and expose enough read state for later derived readers.

The closeout should leave Phase 2 as the next implementation owner for transaction lifecycle and Phase 3 as the next implementation owner for shared keyboard dispatch.

### Phase 1 Closeout

Completed in this pass:
- added `src/app/store/editHistoryStore.ts` as the central Phase 1 owner module with typed `EditHistoryEntry`, source metadata, optional target and transaction fields, synchronous undo/redo operations, no-op ignore behavior, redo invalidation, clear, can-undo/can-redo, and stack read APIs
- added `src/app/store/editHistoryStore.test.ts` with focused tests for entry order, metadata reads, undo, redo, redo invalidation, no-op ignore, clear/read state, empty undo/redo safety, and thrown undo/redo stack safety

Verification:
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` passed with 8 tests
- `npm.cmd run build` passed with existing Vite warnings about `occt-import-js` browser externalization and large chunks

Still deferred:
- transaction lifecycle remains Phase 2
- shared keyboard dispatch remains Phase 3
- real graph, Browser/project, transform, Build Path, UI, persistence, async entry, and app-store wiring adapters remain later phases

## [x] `Edit-History-1 / Phase 2` - `Transaction Lifecycle`

Add a transaction layer for continuous interaction.

### Phase 2 Summary

#### Purpose

Define the central transaction lifecycle on top of the accepted Phase 1 edit-history owner so continuous authored interactions can collapse many live updates into one meaningful committed history entry.

This phase should prove the lifecycle in isolation with fake authored values. It should not make any real slider, drag, graph command, Browser action, transform, or project mutation undoable yet.

#### Owns

- extending the central `src/app/store/editHistoryStore.ts` owner contract with transaction begin, update, commit, and cancel APIs
- defining the first typed transaction draft shape that can carry stable entry metadata, initial authored state, latest authored state, undo/redo restoration builders, and optional transaction identity
- committing one `EditHistoryEntry` when a transaction has a real authored change
- ignoring canceled transactions and no-change commits without creating entries
- preserving existing Phase 1 owner semantics for direct commits, undo, redo, redo invalidation, no-op ignore, clear, read APIs, and thrown-operation stack safety
- focused owner tests in `src/app/store/editHistoryStore.test.ts` proving transaction collapse and lifecycle behavior

#### Does Not Own

- graph command adapters or graph parameter wiring
- slider, drag, drop, typed edit, Browser/project, import, transform, or Catalog surface wiring
- keyboard dispatch or `Ctrl+Z` / `Ctrl+Y`
- Build Path sync, history panel UI, derived readers, or timeline UI
- app-store integration beyond the owner module itself
- persistence, snapshots, async entries, collaboration, branching, or bounded history
- changing existing local histories or compatibility paths
- updating `docs/CHANGELOG.md`, because this prep pass does not ship runtime behavior

#### Current Live Read

Phase 1 created `src/app/store/editHistoryStore.ts` as a pure central owner factory plus singleton. The current `EditHistoryOwner` exposes `commitEntry`, `undo`, `redo`, `clear`, `canUndo`, `canRedo`, `getUndoEntries`, and `getRedoEntries`.

The current `EditHistoryEntry` already includes stable `entryId`, required `label`, required `source.surface`, optional `sourceId` / `sourceLabel`, optional `targetId` / `targetLabel`, optional `transactionId`, optional `coalesceKey`, explicit `isNoop`, and synchronous `undo` / `redo` callbacks.

The current `src/app/store/editHistoryStore.test.ts` uses fake authored entries and event arrays to prove direct commit ordering, metadata reads, undo/redo order, redo invalidation, no-op ignore without redo invalidation, clear/read state, empty undo/redo safety, and thrown undo/redo stack safety.

No existing authored surface is wired to `editHistoryStore` yet. That is intentional and should stay true in Phase 2.

#### First Pass Decisions

- Add transaction APIs to the same central owner contract instead of creating a second transaction owner.
- Keep transaction execution synchronous, matching the Phase 1 entry operation contract.
- Model transactions as one active draft at a time unless implementation finds a strong reason to support nested or parallel drafts; nested/parallel support should be deferred by default.
- Let tests build fake snapshot restorers from simple local values rather than importing graph, app-store, viewer, or UI code.
- Treat cancel and no-change commit as no committed entry and no redo invalidation.
- Treat a real transaction commit like `commitEntry`: append one entry, clear redo, and return a deterministic success result.
- Preserve the existing explicit no-op entry behavior for direct commits.

Implementation direction:
- support begin/update/commit/cancel where update can refresh draft UI without committing many entries
- store enough initial and final authored state to undo and redo one final committed change
- leave per-surface adapters to later phases, but define how they should provide initial and final values

Acceptance:
- a drag-like or slider-like test can update several times and commit one undoable entry
- canceling a transaction leaves no committed history entry
- committing with no authored change leaves no history entry

### Phase 2 Implementation Spec

#### Exact First Code Cut

Extend `src/app/store/editHistoryStore.ts` with the smallest useful transaction contract, likely including:

- `EditHistoryTransactionDraft<TValue>` or equivalent typed draft input
  - stable `transactionId`
  - stable `entryId`
  - stable `label`
  - required source metadata using the existing `EditHistorySourceMetadata`
  - optional target metadata using the existing `targetId` / `targetLabel` fields
  - initial value or initial snapshot
  - current/latest value after updates
  - equality or no-change predicate, if simple strict equality is not enough for test payloads
  - builder/restorer callbacks that produce the final synchronous `undo` and `redo` operations
- owner transaction APIs
  - `beginTransaction(...)`
  - `updateTransaction(...)`
  - `commitTransaction(...)`
  - `cancelTransaction(...)`
  - optional `getActiveTransaction()` or `hasActiveTransaction()` read if tests need it

The implementation should commit exactly one normal `EditHistoryEntry` on a changed transaction commit. That entry should reuse the Phase 1 `commitEntry` path or the same internal append behavior so redo invalidation, ordering, metadata reads, and stack movement stay consistent.

The implementation should not call `undo` or `redo` during `beginTransaction`, `updateTransaction`, `cancelTransaction`, or no-change `commitTransaction`. The fake live value in tests can be updated outside the owner to simulate draft UI movement; the owner only records the initial and final authored values needed to build the one committed undoable entry.

If an active transaction already exists, choose one deterministic behavior and test it. Preferred first behavior: reject the second `beginTransaction` by returning `false` or throwing a clear error without changing the active transaction.

#### Likely Files

- `src/app/store/editHistoryStore.ts`
  - implementation target for transaction types and owner APIs
- `src/app/store/editHistoryStore.test.ts`
  - focused tests for transaction collapse, cancel, no-change commit, active transaction reads, and preservation of Phase 1 semantics
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-1 - Canonical Transaction Foundation.md`
  - implementation closeout only after verification passes
- `docs/CHANGELOG.md`
  - required only when the implementation Worker ships the Phase 2 runtime behavior
- `docs/Doc-Log.md`
  - required for the implementation closeout doc update

Read-only context only:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/graphCommands/types.ts`
- `src/app/spaghetti/graphCommands/graphCommands.test.ts`

#### No-Widening Rule

Do not wire any existing authored surface to transactions in Phase 2.

Do not change graph command behavior, graph store behavior, Browser behavior, project behavior, Catalog behavior, import handoff, reference transform history, console command recall, text input behavior, camera/navigation state, build/runtime progress state, preview/cache/provider state, focus/menu state, or UI.

Do not add keyboard listeners, dispatch routing, history panel affordances, Build Path timeline reads, persistence, async operation support, app-store wiring, or surface adapters.

Do not convert local histories or retire compatibility paths. Transaction lifecycle proof belongs in the central owner only; adapter migration belongs to later phases.

#### Implementation Risks

- A transaction API can accidentally become a surface adapter if it accepts graph- or UI-specific fields; keep the contract generic and metadata-driven.
- Updating transactions can be confused with applying draft UI state. Phase 2 should record the latest authored value for history, not mutate app state.
- No-change detection can become too clever too early. Prefer an explicit equality/no-change callback or simple comparator hook that tests can prove without importing real domain state.
- Redo invalidation on changed transaction commit must match direct `commitEntry`, while cancel and no-change commit must not clear redo.
- Nested or parallel transactions can add complexity before a real surface needs them. Prefer deterministic single-active-transaction behavior and document the later widening point.
- Callback-based transaction entries inherit Phase 1 persistence limits. Keep metadata explicit enough that later payload restorers can replace callbacks.

#### Checklist

- [x] Extend the central edit-history owner contract with transaction begin/update/commit/cancel APIs.
- [x] Define the first typed transaction draft/input contract using existing entry metadata fields where possible.
- [x] Preserve direct `commitEntry`, undo, redo, clear, can-undo/can-redo, read-state, no-op, redo-invalidation, and thrown-operation behavior.
- [x] Implement changed transaction commit as one committed `EditHistoryEntry`.
- [x] Implement multiple transaction updates collapsing into the final committed entry.
- [x] Implement cancel leaving no committed entry.
- [x] Implement no-change commit leaving no committed entry.
- [x] Keep cancel and no-change commit from invalidating redo.
- [x] Add focused owner tests using fake authored values and synchronous restorers.
- [x] Keep graph command/store seams as read context only.
- [x] Update `docs/CHANGELOG.md` only when an implementation Worker actually ships Phase 2 behavior.

#### Verification Shape

Focused tests should cover:

- a transaction with several updates commits exactly one undo entry
- undo after the committed transaction restores the initial fake authored value
- redo after that undo restores the final fake authored value
- transaction metadata, including `transactionId`, remains readable from the committed entry
- canceling a transaction leaves undo and redo stacks unchanged
- committing a transaction with no authored change leaves undo and redo stacks unchanged
- cancel and no-change commit do not invalidate an existing redo stack
- beginning a second transaction while one is active follows the chosen deterministic behavior
- direct Phase 1 commit/undo/redo tests still pass

Suggested implementation gates:

- `npm test -- --run src/app/store/editHistoryStore.test.ts`
- `npm run build`

If the exact test command differs on the implementation machine, run the focused edit-history owner test file directly and record the real command in the implementation closeout.

#### Done Shape

Phase 2 is done when the central owner can begin, update, commit, and cancel one transaction; changed transactions collapse multiple updates into one undoable entry; undo/redo restore fake initial/final values through the committed entry; cancel and no-change commit create no entry; redo invalidation remains correct; and the focused owner tests plus production build pass.

The closeout should mark `Edit-History-CLG-3` complete and advance only the transaction-collapse portion of `Edit-History-CLG-5`. Shared keyboard dispatch remains Phase 3, and real surface adapters remain later phases.

### Phase 2 Closeout

Completed in this pass:
- extended `src/app/store/editHistoryStore.ts` with typed transaction input/value contracts, active transaction reads, `beginTransaction`, `updateTransaction`, `commitTransaction`, and `cancelTransaction`
- kept one active transaction at a time, rejected second begin attempts, ignored mismatched update/commit attempts without replacing the active draft, and cleared active drafts through cancel or clear
- committed changed transactions as one normal `EditHistoryEntry`, preserving Phase 1 stack behavior and redo invalidation
- left canceled transactions and no-change transaction commits out of undo history without invalidating redo
- extended `src/app/store/editHistoryStore.test.ts` to 16 focused tests covering Phase 1 behavior plus transaction collapse, cancel/no-change no-entry behavior, redo preservation, changed-transaction redo invalidation, active draft reads, mismatched update/commit protection, custom equality, and second-begin rejection

Verification:
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` passed with 16 tests
- Manager reran `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` locally and confirmed 16 tests passed
- `npm.cmd run build` passed with existing Vite warnings about `occt-import-js` browser externalization and large chunks

Still deferred:
- shared keyboard dispatch remains Phase 3
- graph adapters, Browser/project undo, transform undo, Build Path sync, UI, persistence, async entries, cache/provider/runtime state, and real store wiring remain later phases

## [x] `Edit-History-1 / Phase 3` - `Shared Dispatch Boundary`

Wire the first shared keyboard dispatch boundary.

### Phase 3 Summary

#### Purpose

Add the first shared undo/redo shortcut dispatch boundary so normal authored contexts can call the canonical edit-history owner while local/native keyboard owners keep their existing behavior.

This phase should be a routing and dispatch boundary only. It should not make graph commands, parameters, Browser/project actions, transforms, or any other surface produce canonical edit-history entries.

#### Owns

- one small undo/redo shortcut route decision near the existing keyboard routing seam
- one narrow integration point that calls `editHistoryStore.undo()` or `editHistoryStore.redo()` only when the route allows canonical authored undo/redo
- focused tests proving text editing, console recall, viewer fly/camera shortcuts, reference transform shortcuts, and non-undo keys keep their existing owners
- focused tests proving canonical owner calls happen only for allowed `Ctrl`/`Meta` undo/redo shortcuts and only when `canUndo()` / `canRedo()` allow the operation
- preventing canonical undo/redo from claiming contexts that should stay native, local, modal, or shortcut-owned

#### Does Not Own

- graph command adapters, graph parameter undo, Browser/project undo, import undo, transform undo, or Catalog undo
- durable presentation/productivity undo beyond the central owner call
- history panel UI, Build Path sync, timeline readers, or any visible undo/redo controls
- persistence, async entries, snapshots, branch history, bounded history, or collaboration
- broad keyboard refactors, broad window-level Escape/menu cleanup, or viewer shortcut rewrites
- changing console command recall or command history behavior
- changing text input native undo/redo behavior
- updating `docs/CHANGELOG.md`, because this prep pass does not ship runtime behavior

#### Current Live Seams

`src/app/inputRouting.ts` is the likely pure routing seam. It currently returns owners including `text-field`, `viewer-fly`, `viewer-camera-shortcuts`, `sketch-plane`, `sketch-draw`, `reference-selection`, `reference-transform`, `staged-console`, `flat-console`, and `none`, with decisions `handle`, `defer-native`, or `ignore`.

`src/app/inputRouting.test.ts` already covers text-field native deferral, viewer fly priority, camera shortcuts, staged console capture and recall arrows, sketch routing, reference selection, and reference transform routing. Phase 3 should extend these tests rather than create an unrelated keyboard ownership model.

`src/app/console/ConsoleBar.tsx` owns console-local command recall with `ArrowUp` and `ArrowDown` through `recallPreviousHistory()` and `recallNextHistory()`. Phase 3 must preserve that local behavior and avoid treating command recall as canonical authored undo.

The accepted canonical owner lives in `src/app/store/editHistoryStore.ts` and exposes direct owner APIs plus transaction APIs, including `undo`, `redo`, `canUndo`, and `canRedo`. Phase 3 should call those APIs only through a narrow dispatch point after routing says canonical edit-history owns the shortcut.

There are many existing window-level Escape/menu handlers and viewer/transform shortcuts. Phase 3 should avoid a broad keyboard refactor and should not move unrelated Escape/menu behavior.

#### First Pass Decisions

- Prefer adding or extending a pure route decision for edit-history undo/redo shortcut ownership before adding any integration call.
- Treat editable targets as native owners for `Ctrl+Z`, `Ctrl+Y`, `Ctrl+Shift+Z`, `Meta+Z`, and `Meta+Shift+Z`.
- Treat console command recall and console text editing as local behavior, not canonical edit history.
- Treat viewer fly movement, viewer camera shortcuts, reference transform shortcuts, sketch routing, modal/menu Escape behavior, and staged console routing as higher priority than canonical edit-history shortcuts when the existing route already handles them.
- Use the canonical owner only for normal authored contexts where the route returns an explicit edit-history owner or allow result.
- Keep Windows/Linux `Ctrl+Z` / `Ctrl+Y` and macOS-style `Meta+Z` / `Meta+Shift+Z` in scope if the routing helper can express them cleanly.
- Keep `Ctrl+Shift+Z` redo support optional only if it can be added without ambiguity; otherwise document it as a follow-up and support the existing requested `Ctrl+Y` path first.

Implementation direction:
- route global undo/redo through the canonical owner only when the active context allows authored undo
- preserve text-input-local undo where the browser/editor already owns text editing
- preserve command recall as console-local behavior, not canonical authored undo

Acceptance:
- `Ctrl+Z` and `Ctrl+Y` can call the canonical owner in normal authored contexts
- text editing and modal contexts are not broken
- tests or focused manual verification cover dispatch priority

### Phase 3 Implementation Spec

#### Likely Files

- `src/app/inputRouting.ts`
  - preferred pure routing home for edit-history undo/redo shortcut ownership decisions
- `src/app/inputRouting.test.ts`
  - focused routing tests for native/local deferral and canonical edit-history allow cases
- one narrow app-shell/window-keydown integration file if existing global keyboard dispatch already lives there
  - call `editHistoryStore.undo()` / `editHistoryStore.redo()` only after the pure route allows canonical edit-history ownership
  - do not create a broad keyboard manager unless implementation proves no existing integration seam exists
- `src/app/store/editHistoryStore.ts`
  - read-only owner API context; avoid changing it unless implementation discovers a missing read needed for the narrow dispatch
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-1 - Canonical Transaction Foundation.md`
  - implementation closeout only after focused verification and build pass
- `docs/CHANGELOG.md`
  - required only when implementation ships the runtime dispatch behavior
- `docs/Doc-Log.md`
  - required for implementation closeout doc maintenance

#### No-Widening Rule

Do not make any real authored surface commit canonical edit-history entries in Phase 3.

Do not implement graph adapters, graph parameter undo, Browser/project undo, transform undo, Build Path sync, history UI, persistence, async entries, durable presentation/productivity undo, or derived reader UI.

Do not rewrite console command recall, text input handling, modal/menu Escape handlers, viewer camera/fly shortcuts, reference transform shortcuts, sketch shortcuts, or broad window keyboard handling. Touch only the minimum integration seam needed to dispatch canonical undo/redo after a pure route decision.

Do not route camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, or command recall into canonical edit history.

#### Implementation Risks

- `Ctrl+Z` inside inputs or contenteditable targets could steal native text undo if editable-target deferral is not first.
- `Meta+Z` / `Meta+Shift+Z` support can be accidentally skipped if tests only cover `Ctrl` shortcuts.
- Console command recall is local and arrow-key based; broad shortcut routing must not move recall or command-history behavior into canonical edit history.
- Viewer fly mode intentionally uses modified movement keys such as `Ctrl` plus movement; the edit-history route must not claim those existing viewer shortcuts.
- Existing Escape/menu handlers are numerous; trying to centralize them in this phase would widen beyond the shared undo/redo boundary.
- Calling `undo` / `redo` when `canUndo` / `canRedo` is false could cause preventDefault with no useful action; the dispatch should leave a deterministic no-op/defer behavior and tests should pin it down.
- Without real surface adapters, the canonical owner may usually be empty in the live app; tests should use fake owner functions or preloaded owner state rather than wiring real surfaces.

#### Checklist

- [x] Add a pure edit-history undo/redo shortcut route decision near `src/app/inputRouting.ts`.
- [x] Recognize the intended undo shortcuts, including `Ctrl+Z` and `Meta+Z`.
- [x] Recognize the intended redo shortcuts, including `Ctrl+Y` and preferably `Ctrl+Shift+Z` / `Meta+Shift+Z` if unambiguous.
- [x] Preserve native text-field/contenteditable undo and redo by deferring editable targets before canonical edit-history handling.
- [x] Preserve staged/flat console capture and command recall behavior.
- [x] Preserve viewer fly, viewer camera shortcut, sketch, reference selection, and reference transform routing behavior.
- [x] Add one narrow integration that calls `editHistoryStore.undo()` or `editHistoryStore.redo()` only when the route allows it and `canUndo()` / `canRedo()` is true.
- [x] Keep canonical dispatch from preventing default when the canonical owner cannot perform the requested operation, unless implementation documents and tests a stronger no-op policy.
- [x] Add focused routing tests in `src/app/inputRouting.test.ts`.
- [x] Add a narrow integration test only if the dispatch integration cannot be proven through pure route tests alone.
- [x] Leave all real surface adapters and history UI deferred.
- [x] Update `docs/CHANGELOG.md` only when an implementation Worker actually ships Phase 3 behavior.

#### Focused Verification

Focused tests should prove:

- editable `input`, `textarea`, `select`, and contenteditable targets defer native undo/redo for `Ctrl`/`Meta` shortcuts
- normal non-editable authored contexts route `Ctrl+Z` / `Meta+Z` to canonical edit-history undo
- normal non-editable authored contexts route `Ctrl+Y` and, if implemented, shifted redo shortcuts to canonical edit-history redo
- canonical dispatch calls `undo` only when `canUndo()` is true
- canonical dispatch calls `redo` only when `canRedo()` is true
- canonical dispatch does not claim or prevent useful native/local behavior when the owner cannot undo/redo
- staged console `ArrowUp` / `ArrowDown` command recall routing stays staged-console owned
- viewer fly mode and viewer camera shortcuts keep their existing route priority
- reference transform shortcuts keep their existing route priority
- Escape routing for sketch/reference/staged-console contexts stays unchanged

Suggested focused commands:

- `npm.cmd test -- --run src/app/inputRouting.test.ts`
- plus the narrow integration test command if implementation adds or touches an integration test file

#### Build Gate

Run:

- `npm.cmd run build`

Record any existing Vite warnings separately from Phase 3 failures.

#### Tracking Docs

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-1 - Canonical Transaction Foundation.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

This prep pass updates only the active phase doc and `docs/Doc-Log.md`.

#### Stop Condition

Stop and report instead of widening if the only apparent integration path requires a broad app-shell keyboard refactor, console rewrite, viewer shortcut rewrite, modal/menu Escape rewrite, or real surface adapter wiring.

Stop and report if the existing routing seam cannot distinguish native text editing from canonical edit-history handling without changing text input behavior.

#### Done Shape

Phase 3 is done when ParaHook has a tested first shared undo/redo dispatch boundary that can route allowed `Ctrl`/`Meta` undo/redo shortcuts to the canonical owner, call `undo` / `redo` only when the owner can perform them, preserve native text editing and console recall behavior, leave existing viewer/sketch/reference shortcut priority intact, and pass focused routing/integration tests plus production build.

The closeout should mark `Edit-History-CLG-4` complete only after the dispatch boundary ships. `Edit-History-CLG-5` should remain open unless the implementation also proves the remaining pure view/runtime exclusion coverage without widening into real adapters.

### Phase 3 Closeout

Completed in this pass:
- added `edit-history` as a shared routing owner in `src/app/inputRouting.ts`
- added typed undo/redo route actions for `Ctrl+Z`, `Meta+Z`, `Ctrl+Y`, `Ctrl+Shift+Z`, and `Meta+Shift+Z`
- kept unavailable canonical undo/redo unclaimed so default behavior is not prevented when `canUndo()` / `canRedo()` is false
- added `dispatchEditHistoryShortcut` and used it from the existing `src/app/console/useConsoleInteraction.ts` capture listeners for docked and popout console windows
- preserved editable target native deferral, console capture/recall routes, viewer fly/camera shortcut routes, sketch routes, reference selection routes, reference transform routes, and Escape handling boundaries
- extended `src/app/inputRouting.test.ts` to 26 tests covering available/unavailable canonical undo/redo, native editable deferral, dispatch call/no-call behavior, and existing route priority coverage

Verification:
- `npm.cmd test -- --run src/app/inputRouting.test.ts` passed with 26 tests
- Manager reran `npm.cmd test -- --run src/app/inputRouting.test.ts` locally and confirmed 26 tests passed
- `npm.cmd run build` passed with existing Vite warnings about `occt-import-js` browser externalization and large chunks

Still deferred:
- graph adapters, parameter undo, Browser/project undo, transform undo, history UI, Build Path sync, persistence, async entries, durable presentation/productivity undo, cache/provider/runtime state, real surface entry commits, and remaining pure view/runtime exclusion proof

## [x] `Edit-History-1 / Phase 4` - `Foundation Exclusion Proof`

Prove the foundation does not accidentally claim pure view/runtime state before graph adapter work starts.

### Phase 4 Summary

#### Purpose

Close the remaining `Edit-History-CLG-5` proof by showing the foundation owner and shared dispatch boundary only act on explicit canonical edit-history entries and available canonical undo/redo routes.

This phase should be small and test-focused. It should prove excluded runtime/view domains are not accidentally committed, routed, or dispatched through canonical edit history.

#### Owns

- focused exclusion tests for camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, command recall, and similar runtime/view state
- proof that canonical edit history only changes when explicit entries or transactions are committed to the owner
- proof that canonical undo/redo dispatch only claims available edit-history undo/redo shortcuts, not local/native/runtime shortcuts
- closure of the remaining pure view/runtime exclusion portion of `Edit-History-CLG-5`
- docs closeout for `Edit-History-1` foundation readiness before `Edit-History-2` graph adapters

#### Does Not Own

- graph command adapters or graph parameter undo
- Browser/project undo, import undo, transform undo, Catalog undo, or any real authored surface adapter
- adding canonical entries for camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, command recall, or text editing
- changing runtime/view behavior
- history UI, Build Path sync, persistence, async entries, snapshots, branch history, durable presentation/productivity undo, or derived readers
- broad app-shell, console, viewer, routing, or store refactors
- updating `docs/CHANGELOG.md`, because this prep pass does not ship runtime behavior

#### Current Live Seams

`src/app/store/editHistoryStore.test.ts` already proves owner ordering, undo/redo stack movement, redo invalidation, no-op ignore, clear/read state, thrown-operation stack safety, transaction collapse, cancel/no-change no-entry behavior, active draft protection, and redo preservation.

`src/app/inputRouting.test.ts` already proves native editable deferral, available/unavailable canonical undo/redo routing, canonical dispatch call/no-call behavior, staged console arrow routing, viewer fly priority, viewer camera shortcuts, sketch routing, reference selection, reference transform routing, and Escape priority.

The remaining foundation proof is not a new runtime integration. It should add focused negative assertions that excluded runtime/view concepts do not become canonical entries or canonical dispatch owners.

#### First Pass Decisions

- Prefer extending `src/app/inputRouting.test.ts` and `src/app/store/editHistoryStore.test.ts` rather than adding broad app-shell tests.
- Prove exclusions through explicit negative contracts: no committed entry without `commitEntry` / changed `commitTransaction`, and no canonical dispatch unless routing has `owner: 'edit-history'` with an available action.
- Use fake runtime/view labels or metadata in owner tests only to prove the owner does not infer entries from reads, clears, unavailable dispatch, canceled transactions, no-change transactions, or runtime-like events.
- Use existing routing options to prove camera/navigation and local shortcut owners stay outside canonical edit-history routing.
- Treat command transcript and command recall as console-local: staged console arrow routes remain staged-console owned and must not become edit-history dispatch.
- Do not import broad app-store, viewer, provider/cache, build/runtime, or console transcript state unless a focused existing helper already exposes the seam cleanly.

### Phase 4 Implementation Spec

#### Likely Files

- `src/app/inputRouting.test.ts`
  - add focused negative routing proofs for viewer camera/fly navigation, staged console recall arrows, editable/native shortcuts, unavailable canonical undo/redo, Escape/menu-like local ownership, and reference/sketch shortcuts staying outside edit-history ownership
- `src/app/store/editHistoryStore.test.ts`
  - add focused owner proofs that runtime/view-like reads, no-change transactions, canceled transactions, unavailable dispatch helpers, and clear/read APIs do not create entries
- `src/app/inputRouting.ts`
  - read context only unless a tiny exported test helper is absolutely needed; prefer no production code changes
- `src/app/store/editHistoryStore.ts`
  - read context only unless a tiny exported test helper is absolutely needed; prefer no production code changes
- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-1 - Canonical Transaction Foundation.md`
  - implementation closeout only after focused verification and build pass
- `docs/CHANGELOG.md`
  - required only if implementation changes source/test behavior in a way this repo tracks as shipped runtime/test behavior
- `docs/Doc-Log.md`
  - required for implementation closeout doc maintenance

#### No-Widening Rule

Do not add canonical entries for excluded domains.

Do not wire graph adapters, parameter undo, Browser/project undo, transform undo, history UI, Build Path sync, persistence, async entries, durable presentation/productivity undo, cache/provider/runtime state, or real surface entry commits.

Do not change viewer camera/fly behavior, console command recall/history behavior, command transcript behavior, build/runtime progress behavior, provider/cache behavior, focus/menu state, text editing, modal/menu Escape handling, or existing routing ownership.

Do not add app-shell integration tests unless the focused owner/routing tests cannot prove the exclusion boundary.

#### Implementation Risks

- Tests can become too broad if they instantiate app-shell or real viewer state to prove a negative; prefer pure owner/routing tests.
- Runtime/view exclusions can be overstated if tests only check route names but not canonical dispatch availability; include owner availability and dispatch no-call assertions where useful.
- Fake runtime labels in owner tests could accidentally imply future support for runtime undo; keep naming explicit that these are excluded-state probes, not supported entry payloads.
- Closing `Edit-History-CLG-5` should not imply graph adapter coverage exists. It only closes foundation owner/transaction/dispatch/exclusion proof.
- Adding production code for this proof would be a smell unless a tiny helper is required for testability.

#### Checklist

- [x] Add focused routing assertions that viewer fly/camera navigation shortcuts are not edit-history-owned.
- [x] Add focused routing assertions that staged console `ArrowUp` / `ArrowDown` command recall stays staged-console owned.
- [x] Add focused routing assertions that editable/native undo/redo and unavailable canonical undo/redo remain unclaimed by canonical dispatch.
- [x] Add focused routing assertions that sketch/reference/Escape local owners stay outside edit-history ownership.
- [x] Add focused owner assertions that no entries appear without explicit direct commit or changed transaction commit.
- [x] Add focused owner assertions that canceled/no-change/runtime-like probes do not invalidate redo or create entries.
- [x] Avoid source changes unless a very small helper is required to express the proof.
- [x] Keep all real surface adapters deferred.
- [x] Update `docs/CHANGELOG.md` only during implementation if source/test behavior changes require a shipped-work entry.

#### Focused Verification

Suggested focused commands:

- `npm.cmd test -- --run src/app/inputRouting.test.ts`
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts`
- any additional focused command only if the implementation touches another approved focused test file

The implementation closeout should report the exact commands and test counts.

#### Build Gate

Run:

- `npm.cmd run build`

Record existing Vite warnings separately from Phase 4 failures.

#### Tracking Docs

Implementation closeout should update:

- `docs/Human-Plans/Architecture/Edit-History/Future/Edit-History-1 - Canonical Transaction Foundation.md`
- `docs/Doc-Log.md`
- `docs/CHANGELOG.md` only if runtime/test behavior changes ship in the implementation pass

This prep pass updates only the active phase doc and `docs/Doc-Log.md`.

#### Stop Condition

Stop and report instead of widening if proving an exclusion requires broad app-shell mounting, viewer runtime construction, provider/cache initialization, build/runtime services, command transcript rewrites, or real surface adapter wiring.

Stop and report if the proof reveals canonical edit history is already claiming excluded state in a way that requires runtime behavior changes outside the approved Phase 4 scope.

#### Done Shape

Phase 4 is done when focused tests prove the foundation owner and dispatch boundary do not claim pure view/runtime state, including camera/navigation, build/runtime progress, preview/cache/provider state, focus/menu state, command transcript, command recall, and similar non-authored domains.

The closeout should mark `Edit-History-CLG-5` complete only if the owner ordering, redo invalidation, no-op protection, transaction collapse, shared dispatch, and pure view/runtime exclusion proof are all covered by focused tests. It should leave real graph adapters to `Edit-History-2`.

### Phase 4 Closeout

Completed in this pass:
- extended `src/app/inputRouting.test.ts` to 30 tests with negative routing proofs for unavailable canonical undo/redo, camera navigation shortcuts, viewer fly movement, staged console command recall arrows, command transcript/console-local printable capture, focus/menu/Escape-style local ownership, sketch ownership, and reference transform ownership
- extended `src/app/store/editHistoryStore.test.ts` to 18 tests with owner proofs that runtime/view-like reads do not create entries, and canceled/no-change runtime-like transaction probes do not create entries or invalidate redo
- kept production source unchanged for Phase 4 because the existing owner and routing seams were sufficient for the exclusion proof

Verification:
- `npm.cmd test -- --run src/app/inputRouting.test.ts` passed with 30 tests
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` passed with 18 tests
- Manager reran `npm.cmd test -- --run src/app/inputRouting.test.ts src/app/store/editHistoryStore.test.ts` locally and confirmed 48 tests passed across both focused suites
- `npm.cmd run build` passed with existing Vite warnings about `occt-import-js` browser externalization and large chunks

Foundation result:
- `Edit-History-CLG-5` is now complete across Phase 1 owner ordering/redo/no-op proof, Phase 2 transaction-collapse proof, Phase 3 shared dispatch proof, and Phase 4 pure view/runtime exclusion proof
- real graph adapters remain deferred to `Edit-History-2`

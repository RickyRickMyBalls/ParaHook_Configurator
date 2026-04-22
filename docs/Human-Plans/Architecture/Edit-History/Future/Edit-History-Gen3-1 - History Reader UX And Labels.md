# Edit History Gen3-1 - History Reader UX And Labels

## Doc Header

### Doc History
10. 2026-04-22 10:30:54: Manager accepted `Edit-History-Gen3-1 / Phase 2.1 - Reader Grouping And Filtering Polish` after reviewing the source-filtering implementation, rerunning focused reader UI verification and production build, confirming changelog entry `[1692]`, marking `Edit-History-Gen3-CLG-5` complete, and closing `Edit-History-Gen3-HLG-1` for the current visible read-only history reader scope.
9. 2026-04-22 10:29:08: Implemented `Edit-History-Gen3-1 / Phase 2.1 - Reader Grouping And Filtering Polish` with local source-surface filtering in `EditHistoryReaderSurface` over public reader entry metadata only; grouped headings were deferred to avoid nested list/layout churn, focused reader UI verification passed, and production build verification passed with known Vite warnings.
8. 2026-04-22 10:25:33: Prepped `Edit-History-Gen3-1 / Phase 2.1 - Reader Grouping And Filtering Polish` as a tiny public-metadata-only reader polish phase over the existing `EditHistoryReaderSurface` and `editHistoryReaderViewModel`, scoped to local source-surface filtering and optional grouped headings with no saved reader state, persistence, private payload access, or second undo owner.
7. 2026-04-22 10:23:19: Manager accepted `Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI` after focused reader surface, edit-history store, reader-contract, ViewportFrame, workspace surface catalog, registry, Home Page, and production build verification passed; marked the runtime reader goal complete while keeping `Edit-History-Gen3-HLG-1` open for a small grouping/filtering polish follow-up.
6. 2026-04-22 10:18:18: Repaired `Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI` before Manager acceptance by adding `Edit History` to the default `ViewportFrame` type picker, normalizing new reader CSS letter-spacing declarations to `0`, and notifying edit-history subscribers when a changed transaction clears into an explicit no-op entry while keeping plain no-op entry commits silent.
5. 2026-04-22 10:13:19: Implemented `Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI` as a dedicated optional `Edit History` workspace surface backed by canonical edit-history store snapshots/subscriptions; the reader lists Undo/Redo stacks, inspects public metadata only, optionally calls the existing owner undo/redo APIs, and keeps persisted history, checkpoints, branching, Build Path comparison, command transcript/recall, adapter rewrites, and unrelated Catalog/Pubwheel work out of scope.
4. 2026-04-22 10:04:21: Prepped `Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI` as a narrow runtime UI implementation spec after researching current workspace surface registration, viewport surface rendering, app-shell host patterns, and canonical `editHistoryStore` public read APIs; kept the phase scoped to read-only stack display/filter/inspect over public metadata with no persistence, checkpoint, branch, Build Path, or new undo owner work.
3. 2026-04-22 10:03:18: Manager accepted `Edit-History-Gen3-1 / Phase 1 - Reader Contract And UX Shape Proof` after rerunning focused reader-contract, central edit-history store, and production build verification; marked `Edit-History-Gen3-CLG-1` complete for metadata/readiness while keeping `Edit-History-Gen3-HLG-1` open for a narrow runtime read-only history reader UI.
2. 2026-04-22 10:00:19: Implemented proof/design `Edit-History-Gen3-1 / Phase 1`, adding central public entry timestamps plus focused reader-contract coverage for listing, grouping, filtering, and inspecting representative Gen 1 and Gen 2 canonical entries through public metadata without private payload reads; recorded focused reader-contract, edit-history store, and production build verification.
1. 2026-04-22 09:52:07: Created this Gen 3 future planning surface for history reader UX, labels, filtering, grouping, and inspectable canonical entry summaries after Gen 1 metadata proof and Gen 2 closeout.

### Purpose

This doc plans visible history reader UX over canonical edit-history entries.

## Doc Body

### Owns

- reader UX and panel/surface planning for canonical undo/redo stacks
- readable entry labels, grouping, filtering, and inspectable summaries based on public entry metadata
- proof that future history readers can list entries without inspecting private undo/redo payloads
- accessibility and empty/error/loading reader states for future implementation

### Does Not Own

- a new undo owner or alternate stack
- changing canonical edit-history adapter behavior unless a tiny reader metadata gap is proven
- persistence, checkpoints, branching, collaboration, multiplayer, or serialized entry storage
- Build Path comparison or variant comparison
- command transcript/recall undo, runtime/cache/provider state, Browser/project content implementation, Gen 2 runtime settings, or unrelated Catalog/Pubwheel work

### Acceptance Read

This candidate is implementation-ready only when the reader contract names the exact entry metadata the UI needs, proves accepted adapters expose it, and defines a small first UI/proof slice that cannot become a competing undo owner.

### No-Widening Rule

Do not implement checkpoints, persistence, branching, Build Path comparison, collaboration, or a second history owner from this reader UX phase. The reader may call current `getUndoEntries()` / `getRedoEntries()` style APIs, but it must not own undo truth.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen3-HLG-1` - Make canonical history visible and understandable through reader UI, labels, filtering, grouping, and inspectable entry summaries without making readers into undo owners.

### Codex Level Goals

- [x] `Edit-History-Gen3-CLG-1` - Define history reader UX, labels, filters, grouping, and inspectable metadata over canonical entries without private payload dependence.
- [x] `Edit-History-Gen3-CLG-4` - Add a narrow read-only history reader UI that lists canonical undo/redo entries through public metadata without becoming a new undo owner.
- [x] `Edit-History-Gen3-CLG-5` - Add small reader grouping/filtering polish over public metadata so the current visible-history goal can close without persistence or payload inspection.

## [x] Edit-History-Gen3-1 / Phase 1 - Reader Contract And UX Shape Proof

### Phase 1 Summary

Purpose:
- define the smallest reader UX that can present canonical history entries without changing canonical ownership
- confirm current labels/source/target metadata are enough for a future panel to list, group, filter, and inspect entries
- decide whether the next implementation should be proof-only or a narrow runtime reader UI

Owns:
- reader-facing UX inventory for undo stack, redo stack, labels, sources, targets, grouping, filtering, and inspection
- proof plan for current public entry APIs and accepted Gen 1/Gen 2 adapter metadata
- a first-pass UI shape for a future history panel or reader surface

Does not own:
- checkpoint/snapshot/branching behavior
- entry persistence or serialized history schema
- Build Path comparison
- collaboration/multiplayer history
- changing undo/redo dispatch, command transcript/recall, adapter payloads, or unrelated runtime surfaces

Current live seams:
- `src/app/store/editHistoryStore.ts` exposes canonical entries through `getUndoEntries()` and `getRedoEntries()`.
- `src/app/store/editHistoryReaderContract.test.ts` already proves representative Gen 1 adapters expose readable label/source/target metadata without private payload inspection.
- Accepted Gen 2 adapters add runtime entries for durable presentation, productivity content, and workspace preference/layout seams where approved.
- No visible history panel is currently owned by this family.

First-pass decisions:
- Phase 1 should be proof/design-first by default.
- A runtime UI slice can be approved next only if Manager accepts a tiny read-only panel/surface that consumes public entry metadata and cannot mutate history except through existing undo/redo commands.
- Do not add persistence, branching, or checkpoint semantics in Phase 1.
- Implementation note: Phase 1 added a central public `timestamp` field at commit time because reader inspection needs stable time metadata and the existing surface adapters did not expose it. This stayed in the canonical store boundary and did not require adapter rewrites.

### Phase 1 Implementation Spec

Exact first code cut:
- Prefer a focused reader-contract proof update or a small new proof file if metadata coverage changed after Gen 2.
- If Manager approves runtime UI later, implement only a read-only reader surface/panel that lists undo/redo entries by label, source, and target, with basic filtering/grouping using public metadata.
- Do not inspect private undo/redo snapshot payloads.

Likely files:
- `src/app/store/editHistoryReaderContract.test.ts`
- `src/app/store/editHistoryStore.test.ts`
- future reader UI file only if Manager approves runtime implementation
- this phase doc, `docs/CHANGELOG.md` for runtime/proof implementation, and `docs/Doc-Log.md`

Focused verification guidance:
- `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts`
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts`
- focused reader UI tests if a runtime panel is approved
- `npm.cmd run build`

Build gate:
- Required for runtime/proof implementation. Not required for docs-only setup.

Tracking docs:
- Runtime/proof implementation must update `docs/CHANGELOG.md`.
- Any docs closeout must update this doc and `docs/Doc-Log.md`.
- Manager handles Gen3 index and run-state acceptance/status.

Stop conditions:
- Stop if reader UX needs private payload inspection, entry persistence, checkpoint storage, branch semantics, or a second undo owner.
- Stop if labels/source/target metadata are too weak and require a broad adapter rewrite.

Done shape:
- The first phase is done when the reader contract and UX shape are proven or a tiny read-only reader UI is implemented without changing canonical ownership.
- `Edit-History-Gen3-CLG-1` can be recommended complete only after Manager accepts that future reader UI can list/group/filter/inspect entries through public metadata.

Acceptance mapping:
- Advances `Edit-History-Gen3-HLG-1`.
- Does not advance checkpoint, branching, Build Path comparison, or collaboration goals.

Recommended next Manager action:
- Approve Phase 1 as proof/design-first; approve runtime UI only after reviewing the exact first reader surface.

Implementation closeout:
- [x] Public canonical entries now receive a central `timestamp` during `editHistoryStore` commit/transaction commit.
- [x] Focused reader-contract proof covers public `label`, `source`, `target`, `timestamp`, `transactionId`, and `coalesceKey` metadata without reading undo/redo payload internals.
- [x] Representative accepted Gen 1 metadata remains covered for graph, feature, sketch, Browser/project, Import/Catalog, Viewer Transform, and same-seam UI/console graph entries.
- [x] Representative accepted Gen 2 metadata is covered for environment, material, ground, Notepad/productivity content, Dashboard board, Home Page preferences, and workspace layout entries.
- [x] No runtime history reader UI, alternate stack, persisted history, checkpoints, branching, Build Path comparison, collaboration, keyboard dispatch, command transcript/recall, runtime/cache/provider ownership, or unrelated Catalog/Pubwheel work was added.

Verification notes:
- `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts` passed with 7 tests.
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` passed with 18 tests.
- `npm.cmd run build` passed; Vite reported the existing browser-externalized `path`/`crypto` and large chunk warnings.

Closeout recommendation:
- Manager accepted `Edit-History-Gen3-CLG-1` complete for proof/design readiness.
- Keep `Edit-History-Gen3-HLG-1` open for a future runtime read-only history reader UI/panel.

## [x] Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI

### Phase 2 Summary

Purpose:
- add the first visible, read-only history reader for canonical undo/redo entries
- prove the runtime UI can list, group, filter, and inspect public entry metadata without reading private undo/redo payloads
- advance `Edit-History-Gen3-HLG-1` after Phase 1 proved the public reader contract and central timestamps

Owns:
- a narrow runtime UI surface/panel over `editHistoryStore.getUndoEntries()` and `editHistoryStore.getRedoEntries()`
- display of entry `label`, `source.surface`, `sourceId`, `sourceLabel`, `targetId`, `targetLabel`, `timestamp`, `transactionId`, and `coalesceKey`
- simple stack selection between Undo and Redo, surface grouping/filtering, and one-entry inspection if these stay small
- optional buttons for existing canonical `undo()` / `redo()` only if Manager explicitly includes them and focused tests prove they call the existing owner APIs

Does not own:
- a new undo owner, alternate stack, serialized history, or persisted entry schema
- checkpoints, snapshots, branching, Build Path comparison, collaboration, or multiplayer history
- command transcript/recall, keyboard dispatch changes, native text-input undo changes, runtime/cache/provider ownership, or adapter payload inspection
- broad workspace architecture, surface persistence migration, app-shell refactors, Catalog/Pubwheel work, or unrelated family updates

Current live seams:
- `src/app/store/editHistoryStore.ts` exposes `getUndoEntries()`, `getRedoEntries()`, `undo()`, `redo()`, `canUndo()`, and `canRedo()`.
- `src/app/store/editHistoryReaderContract.test.ts` proves representative Gen 1 and Gen 2 public metadata, including `timestamp`, `transactionId`, and `coalesceKey`.
- `src/app/workspace/workspaceSurfaceCatalog.ts` registers optional workspace surfaces such as `dashboard`, `notepad`, and `homePage`; adding a dedicated history surface would require a new `WorkspaceSurfaceKind` and catalog entry.
- `src/app/workspace/ViewportSurfaceRegistry.tsx` routes workspace surface kinds to concrete surface components and is the likely host if the reader becomes an optional workspace surface.
- `src/app/AppShell.tsx`, `src/app/hosts/SimpleFloatingSurfaceHost.tsx`, `src/app/workspace/ViewportWorkspaceHost.tsx`, and existing surface tests show the current app-shell and hosted-surface patterns.
- No runtime history reader UI currently exists.

First-pass decisions:
- Prefer a small dedicated read-only workspace surface if Manager wants the reader to live beside Notepad/Dashboard/Home Page and participate in normal workspace hosting.
- If adding a new `history`/`editHistory` workspace surface kind causes broad shell/persistence fallout, stop and switch to a smaller non-persistent overlay/panel proof instead of widening.
- Keep Phase 2 runtime UI read-only by default. Existing undo/redo action buttons are optional, must call only the canonical owner, and must not add keyboard dispatch or local stack state.
- Do not implement persistence for reader panel state, saved filters, selected entry, grouping preference, or panel placement in this phase.

### Phase 2 Implementation Spec

Exact first code cut:
- Add a small pure view-model helper for reader entries, likely near `src/app/store/editHistoryReaderViewModel.ts` or the future component file, that maps `EditHistoryEntry` to a public inspection shape excluding `undo` and `redo` functions.
- Add a narrow `EditHistoryReaderSurface`/`EditHistoryReaderPanel` component that:
  - reads current Undo and Redo stacks from `editHistoryStore.getUndoEntries()` / `getRedoEntries()`;
  - lists entries with label, source label/surface, target label/id, and formatted timestamp;
  - supports a simple Undo/Redo stack toggle;
  - supports small surface grouping/filtering if it stays local and public-metadata-only;
  - shows one selected entry's public metadata in an inspector region.
- If using workspace hosting, add a new optional workspace surface entry and route it through `ViewportSurfaceRegistry`; otherwise keep the first cut as a local panel/overlay and document why surface registration split is deferred.
- Do not inspect, stringify, or expose private undo/redo payloads.
- Do not persist reader UI state.

Likely files:
- `src/app/store/editHistoryStore.ts` only if a tiny subscription or read API gap is proven; otherwise read-only.
- `src/app/store/editHistoryReaderContract.test.ts` for metadata contract regression.
- new focused UI/model files such as `src/app/store/editHistoryReaderViewModel.ts`, `src/app/components/EditHistoryReaderPanel.tsx`, or `src/app/workspace/EditHistoryReaderSurface.tsx`.
- `src/app/workspace/workspaceSurfaceCatalog.ts` and `src/app/workspace/ViewportSurfaceRegistry.tsx` only if Manager approves a dedicated workspace surface.
- focused tests such as `src/app/components/EditHistoryReaderPanel.test.tsx` or `src/app/workspace/EditHistoryReaderSurface.test.tsx`.
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` for implementation closeout.

No-widening rule:
- Do not add a second history owner, local history stack, entry persistence, checkpoints, snapshots, branches, Build Path comparison, collaboration, command transcript/recall integration, keyboard dispatch, payload inspection, or adapter rewrites.
- Do not widen into Catalog/Pubwheel, Browser/project content, Gen 2 runtime settings, workspace layout persistence, or app-shell refactors beyond the minimum host registration needed for the chosen UI surface.
- Do not make reader grouping/filtering saved user preferences in this phase.

No-op / redo rules:
- Rendering, selecting, filtering, grouping, expanding, or inspecting entries must not create canonical entries and must not invalidate redo.
- If optional Undo/Redo buttons are included, they must call only `editHistoryStore.undo()` / `editHistoryStore.redo()` and then refresh from the canonical store; they must not duplicate stack mutation logic.
- Empty Undo/Redo stacks should render stable empty states without throwing.

Focused verification:
- Add focused UI/component tests proving:
  - Undo and Redo stacks render from public metadata.
  - Entries show label/source/target/timestamp without exposing function bodies or payload details.
  - grouping/filtering/inspection, if included, is read-only and does not mutate canonical history or invalidate redo.
  - optional undo/redo action buttons, if included, call the existing owner and update the rendered stacks.
- Rerun `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts`.
- Run `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` only if central store APIs are touched.
- Run focused workspace/shell tests if a new workspace surface kind is added.

Build gate:
- `npm.cmd run build` is required for implementation.

Tracking docs:
- Runtime implementation must add a permanent numbered `docs/CHANGELOG.md` body entry.
- Implementation closeout must update this phase doc and `docs/Doc-Log.md`.
- Manager handles Gen3 index and Dispatch run-state acceptance/status.

Stop conditions:
- Stop if the UI requires private undo/redo payload reads, serialized history, checkpoint storage, branch semantics, a second stack owner, or broad adapter metadata rewrites.
- Stop if workspace surface registration requires broad persistence/app-shell migrations; recommend a smaller overlay/panel split instead.
- Stop if keeping the reader live requires changing keyboard dispatch or text-input undo behavior.

Done shape:
- A read-only history reader UI exists and shows canonical Undo/Redo entries through public metadata.
- Reader grouping/filtering/inspection works without private payload access and without mutating history.
- Focused UI, reader-contract, and build verification pass.
- `Edit-History-Gen3-CLG-4` can be recommended complete after Manager accepts the runtime reader.
- `Edit-History-Gen3-HLG-1` can be recommended complete only if Manager agrees this first read-only UI satisfies the visible-history goal for current scope.

Acceptance mapping:
- Advances `Edit-History-Gen3-HLG-1`.
- Covers `Edit-History-Gen3-CLG-4`.
- Does not advance checkpoint, branching, Build Path comparison, or collaboration goals.

Recommended next Manager action:
- Review the implemented dedicated optional workspace surface and mark `Edit-History-Gen3-CLG-4` complete if the reader UI meets the approved public-metadata-only scope.
- Decide whether `Edit-History-Gen3-HLG-1` should close with this first visible reader or stay open for future grouping/filtering polish.

Implementation closeout:
- [x] Added a cached `editHistoryStore.getSnapshot()` and `editHistoryStore.subscribe(...)` read seam for React readers; the canonical owner still owns all undo/redo mutation.
- [x] Added a public reader view model that maps entries to label/source/target/timestamp/transaction metadata without exposing `undo` or `redo` payload functions.
- [x] Added a dedicated optional `Edit History` workspace surface with Undo/Redo stack tabs, empty states, one-entry public metadata inspection, and optional Undo/Redo buttons that call only `editHistoryStore.undo()` / `editHistoryStore.redo()`.
- [x] Registered the surface through the existing workspace surface catalog and viewport registry path, including explicit `edit-history-<slot>` instance ids and existing Home Page launch/type-picker visibility.
- [x] Kept reader selection/filter state unpersisted. No checkpoints, snapshots, branching, Build Path comparison, collaboration, command transcript/recall, keyboard dispatch, private payload inspection, adapter rewrites, or unrelated Catalog/Pubwheel work was added.
- [x] Grouping/filtering was intentionally skipped in this first runtime slice because the approved small UI shape is stack toggle plus one-entry inspection; future HLG polish can add grouping/filtering if Manager keeps that goal open.
- [x] Acceptance repair added `editHistory` to the default `ViewportFrame` viewport type choices, set the new reader CSS letter-spacing declarations to `0`, and notified subscribers when an active changed transaction collapses into an explicit no-op entry.

Verification notes:
- `npm.cmd test -- --run src/app/workspace/EditHistoryReaderSurface.test.tsx` passed with 4 tests.
- `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts` passed with 7 tests.
- `npm.cmd test -- --run src/app/store/editHistoryStore.test.ts` passed with 20 tests after the subscriber repair.
- `npm.cmd test -- --run src/app/workspace/ViewportFrame.test.tsx` passed with 22 tests after the default picker repair.
- `npm.cmd test -- --run src/app/workspace/workspaceSurfaceCatalog.test.ts src/app/workspace/ViewportSurfaceRegistry.test.tsx src/app/workspace/HomePageSurface.test.tsx` passed with 22 tests.
- Initial registry verification exposed an unrelated stale Catalog assertion expecting older `Catalog Cards` copy; the focused registry assertion now checks the current `Catalog Results` surface heading.
- `npm.cmd test -- --run src/app/workspace/EditHistoryReaderSurface.test.tsx` was rerun and passed with 4 tests after the repair.
- `npm.cmd run build` passed; Vite reported the existing browser-externalized `path`/`crypto` and large chunk warnings.

Closeout recommendation:
- Manager accepted `Edit-History-Gen3-CLG-4` complete after review.
- Keep `Edit-History-Gen3-HLG-1` open for a small `Edit-History-Gen3-CLG-5` grouping/filtering polish slice.

## [x] Edit-History-Gen3-1 / Phase 2.1 - Reader Grouping And Filtering Polish

### Phase 2.1 Summary

Purpose:
- finish the remaining visible-history reader wording by adding small source-surface filtering and, if still tiny, grouped headings over canonical entry public metadata
- keep the accepted Phase 2 reader as a read-only workspace surface with local UI state only
- close `Edit-History-Gen3-CLG-5` and likely `Edit-History-Gen3-HLG-1` after Manager accepts the polished reader scope

Owns:
- local source-surface filter controls derived from the active Undo or Redo stack entries
- optional grouped headings by `sourceSurface` or source label if this stays inside the existing reader component/view-model shape
- focused tests proving filtering/grouping uses public `editHistoryReaderViewModel` metadata and does not mutate canonical history or invalidate redo
- unsaved local reader UI state only

Does not own:
- saved reader filters, saved grouping preferences, reader selection persistence, or entry history persistence
- a new undo owner, alternate stack, local stack mutation logic, private payload inspection, checkpoint/snapshot/branching behavior, or Build Path comparison
- adapter metadata rewrites unless a tiny public metadata gap is proven and Manager approves a separate repair
- command transcript/recall, keyboard dispatch, native text-input undo, Browser/project content, Gen 2 runtime settings, Catalog/Pubwheel, collaboration, or unrelated workspace/app-shell refactors

Current live seams:
- `src/app/workspace/EditHistoryReaderSurface.tsx` owns the current local reader UI state: active Undo/Redo stack and selected entry id.
- `src/app/store/editHistoryReaderViewModel.ts` maps canonical entries into public `EditHistoryReaderEntryModel` records, including `sourceSurface`, `sourceId`, `sourceLabel`, `targetId`, `targetLabel`, `timestamp`, `transactionId`, and `coalesceKey`.
- `src/app/workspace/EditHistoryReaderSurface.test.tsx` covers empty states, public metadata inspection, canonical Undo/Redo stack switching, and optional canonical undo/redo buttons.
- Phase 2 intentionally skipped grouping/filtering, leaving this phase as the small closeout polish.

First-pass decisions:
- Implement source filtering before grouped headings. A compact segmented control or button row with `All` plus unique source surfaces from the active stack is the smallest useful cut.
- Keep filter state local to `EditHistoryReaderSurface`. Reset the selected entry when the active stack or filter changes so inspection cannot point at a hidden entry.
- Use only `EditHistoryReaderEntryModel.sourceSurface` and readable source labels already exposed by the view model. Do not read `undo`, `redo`, or private payloads.
- Add grouped headings only if they do not require nested selection complexity or CSS churn. If grouping threatens the slice, implement filtering only and document grouping as future polish.

### Phase 2.1 Implementation Spec

Exact first code cut:
- Extend `EditHistoryReaderSurface` with a local `activeSourceFilter` state such as `'all' | string`.
- Derive available filter choices from `model[activeStack].entries` by unique `sourceSurface`, with button labels preferring a representative `sourceLabel` when it is stable and falling back to the surface id.
- Filter the rendered entry list before selection resolution and empty-state text.
- Reset `activeSourceFilter` to `all` or to a valid available source when the active stack changes or the selected filter disappears after canonical store updates.
- Keep the inspector read-only and based on the selected filtered entry. Do not persist filter or selection.
- Optional, only if tiny: render grouped headings by `sourceSurface` inside the filtered list, preserving one button per entry and the existing selection behavior.

Likely files:
- `src/app/workspace/EditHistoryReaderSurface.tsx`
- `src/app/workspace/EditHistoryReaderSurface.test.tsx`
- `src/app/store/editHistoryReaderViewModel.ts` only if a tiny derived label helper belongs there; otherwise read-only
- `src/app/store/editHistoryReaderContract.test.ts` only if metadata assumptions change
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` for implementation closeout

No-widening rule:
- Do not add persisted reader settings, serialized history, checkpoint/snapshot/branch storage, Build Path comparison, collaboration, command transcript/recall integration, keyboard dispatch, payload inspection, adapter rewrites, or a second history owner.
- Do not add new workspace surface registration or app-shell behavior; Phase 2 already owns the surface.
- Do not make filter changes create canonical entries or invalidate redo.

No-op / redo rules:
- Switching filters, grouping view, selecting entries, and inspecting entries must create no canonical entries and must preserve redo.
- Empty filtered results should render a stable empty state without changing the underlying Undo/Redo stacks.
- Optional Undo/Redo buttons must keep their Phase 2 behavior and continue calling only `editHistoryStore.undo()` / `editHistoryStore.redo()`.

Focused verification:
- Add focused `EditHistoryReaderSurface.test.tsx` coverage proving:
  - source filter controls are derived from public entry metadata in the active stack;
  - filtering hides non-matching entries and preserves public metadata inspection for matching entries;
  - switching filters and selecting entries does not mutate canonical history or invalidate redo;
  - empty filtered results render a stable empty state;
  - optional grouped headings, if implemented, group by public source metadata.
- Rerun `npm.cmd test -- --run src/app/workspace/EditHistoryReaderSurface.test.tsx`.
- Rerun `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts` only if public metadata assumptions or view-model shape changes.
- Run `npm.cmd run build`.

Build gate:
- `npm.cmd run build` is required for implementation.

Tracking docs:
- Runtime implementation must add a permanent numbered `docs/CHANGELOG.md` body entry.
- Implementation closeout must update this phase doc and `docs/Doc-Log.md`.
- Manager handles Gen3 index and Dispatch run-state acceptance/status.

Stop conditions:
- Stop if filtering/grouping needs private payload reads, adapter rewrites, persisted reader settings, keyboard dispatch changes, or broad CSS/layout restructuring.
- Stop if grouped headings make entry selection/inspection ambiguous; ship source filtering only and document grouping as deferred polish.
- Stop if filter labels need more metadata than the public reader view model exposes; request a tiny metadata repair instead of inferring from private payloads.

Done shape:
- The reader exposes a small source-surface filter over Undo/Redo stack entries using public metadata only.
- Optional grouping is included only if it stays local and public-metadata-only.
- Reader filtering/grouping/inspection remains read-only, unsaved, and redo-preserving.
- Focused reader UI tests and build verification pass.
- `Edit-History-Gen3-CLG-5` can be recommended complete after Manager accepts the polish.
- `Edit-History-Gen3-HLG-1` can be recommended complete if Manager agrees the visible reader now satisfies current labels, filtering, grouping/inspection goals without persistence or payload inspection.

Acceptance mapping:
- Advances and likely closes `Edit-History-Gen3-HLG-1` for current visible read-only history UX scope.
- Covers `Edit-History-Gen3-CLG-5`.
- Does not advance checkpoint, branching, Build Path comparison, or collaboration goals.

Recommended next Manager action:
- Approve Phase 2.1 as a tiny runtime polish implementation focused on local source filtering first, with grouped headings only if the diff remains small and testable.

Implementation closeout:
- [x] Added local source-surface filter controls to `EditHistoryReaderSurface` using public `EditHistoryReaderEntryModel.sourceSurface` and `sourceLabel` metadata.
- [x] Filter state remains unsaved and local to the reader surface; switching stacks or filters resets the selected entry so the inspector cannot target a hidden row.
- [x] Filtering hides non-matching rows while preserving public metadata inspection for matching rows.
- [x] Filter interactions do not create canonical entries, mutate stacks, or invalidate redo.
- [x] Grouped headings were intentionally deferred because source filtering satisfies the required CLG-5 closeout and grouping would add nested list/layout churn beyond the tiny polish slice.
- [x] No saved reader filters, persisted selection, private payload inspection, adapter rewrites, second undo owner, checkpoints, branching, Build Path comparison, keyboard dispatch, command transcript/recall, or unrelated Catalog/Pubwheel work was added.

Verification notes:
- `npm.cmd test -- --run src/app/workspace/EditHistoryReaderSurface.test.tsx` passed with 5 tests.
- `npm.cmd run build` passed; Vite reported the existing browser-externalized `path`/`crypto` and large chunk warnings.
- `npm.cmd test -- --run src/app/store/editHistoryReaderContract.test.ts` was not rerun because Phase 2.1 did not change reader-contract metadata assumptions or the view-model shape.
- Manager reran `npm.cmd test -- --run src/app/workspace/EditHistoryReaderSurface.test.tsx`; it passed with 5 tests.
- Manager reran `npm.cmd run build`; it passed with the existing browser-externalized `path`/`crypto` and large chunk warnings.

Closeout recommendation:
- Manager accepted `Edit-History-Gen3-CLG-5` complete.
- Manager closed `Edit-History-Gen3-HLG-1` for current visible read-only history reader scope.

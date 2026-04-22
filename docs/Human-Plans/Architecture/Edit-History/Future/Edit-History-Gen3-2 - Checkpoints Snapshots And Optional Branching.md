# Edit History Gen3-2 - Checkpoints Snapshots And Optional Branching

## Doc Header

### Doc History
4. 2026-04-22 10:41:17: Manager accepted proof-only `Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof` after reviewing the checkpoint ownership readiness test, rerunning focused checkpoint proof verification and production build, confirming changelog entry `[1693]`, marking `Edit-History-Gen3-CLG-2` complete, and closing `Edit-History-Gen3-HLG-2` for current checkpoint planning scope while keeping runtime checkpoint MVP work deferred.
3. 2026-04-22 10:37:44: Implemented proof-only `Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof` with a focused typed checkpoint ownership readiness test covering current candidate classifications, restore boundaries, private undo/redo serialization exclusion, runtime/cache/provider/session exclusions, and unresolved restore semantics; no checkpoint runtime, storage schema, branch graph, or restore command was added.
2. 2026-04-22 10:34:00: Tightened `Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof` into a proof-first, implementation-ready spec for inventorying authored durable stores, restore boundaries, persistence owners, accepted Gen 1/Gen 2 undo scopes, runtime/cache/provider/session exclusions, and the unresolved semantic choice between checkpoint restore as canonical entry versus separate restore command.
1. 2026-04-22 09:52:07: Created this Gen 3 future planning surface for checkpoints, snapshots, optional branching, and persistence-aware restore semantics after canonical history and Gen 2 durable candidate closeout.

### Purpose

This doc plans checkpoint/snapshot workflows and optional branching over canonical authored history.

## Doc Body

### Owns

- checkpoint and snapshot ownership research
- restore boundary planning for project/user authored state
- persistence and storage questions needed before checkpoint implementation
- optional branching semantics for single-user history after checkpoint behavior is explicit
- conditional collaboration/multiplayer routing if the user later promotes it

### Does Not Own

- runtime checkpoint implementation in setup
- entry persistence or snapshot storage schema before proof
- replacing the canonical edit-history owner
- collaboration/multiplayer by default
- history reader UI owned by Gen3-1
- Build Path comparison owned by Gen3-3
- Browser/project, Gen 2 setting/content runtime undo, Catalog/Pubwheel, command transcript/recall, runtime/cache/provider state, or broad persistence architecture changes

### Acceptance Read

This candidate is implementation-ready only when checkpoint ownership, restore scope, persistence model, branch semantics, and single-user conflict rules are explicit enough that undo/redo and checkpoint restore cannot rewind unrelated runtime/session/cache state.

### No-Widening Rule

Do not implement checkpoint storage, branch graphs, collaboration, multiplayer, broad persistence architecture, or canonical owner replacement during setup. Checkpoints must be planned as a layer over authored state and canonical entries, not as a hidden second source of project truth.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen3-HLG-2` - Plan checkpoints, snapshots, and optional branching only after persistence and single-user restore semantics are explicit.

### Codex Level Goals

- [x] `Edit-History-Gen3-CLG-2` - Define checkpoint/snapshot ownership, restore boundaries, persistence requirements, and optional branching constraints before implementation.

## [x] Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof

### Phase 1 Summary

Purpose:
- prove which current authored durable stores could be included in a future checkpoint/snapshot without turning runtime, cache, provider, or session state into checkpoint truth
- define restore boundaries before any checkpoint button, storage schema, branch graph, or restore runtime exists
- identify the semantic choice Manager must approve later: checkpoint restore as a canonical-history-producing command, as a separate restore command, or as a future persistence-level recovery flow
- keep optional branching and collaboration conditional until single-user checkpoint ownership and restore behavior are explicit

Owns:
- proof inventory for authored durable state owners that may belong in snapshots
- restore-boundary mapping for current graph/project/reference, durable presentation, productivity content, workspace preference/layout, and accepted setting owners
- persistence-owner research needed before any snapshot storage or checkpoint restore MVP
- explicit exclusion proof for runtime/cache/provider/session/navigation state
- branching and collaboration deferral criteria

Does not own:
- runtime checkpoint buttons or snapshot storage
- entry serialization schema
- checkpoint persistence schema, migration, import/export, browser storage quota handling, or cleanup policy
- broad persistence architecture
- branch graph runtime, branch merge behavior, or checkpoint diff UI
- collaboration/multiplayer history unless explicitly promoted
- reader UI/panel work, Build Path comparison, or Gen 2 runtime setting/content undo
- replacing the canonical edit-history owner, serializing private undo/redo payloads, or making checkpoints into a hidden second project owner

Current known seams to inventory:
- `src/app/store/editHistoryStore.ts` owns in-memory canonical undo/redo entries and public reader metadata, but not persisted history or checkpoints.
- Graph/CAD authored state lives behind accepted graph and feature/sketch history seams such as `src/app/spaghetti/store/useSpaghettiStore.ts` and related Gen 1/Gen 2 proof suites.
- Browser/project/import/reference authored content lives in `src/app/store/useAppStore.ts`, accepted Browser organization/import history suites, and staged Import accept seams; transient staged drafts and failed/unaccepted sessions stay excluded.
- Viewer Transform authored state has accepted canonical history proof, while camera/navigation/viewer runtime state stays excluded.
- Durable presentation/preferences are split across `useUiPrefsStore`, environment/material/ground helpers, and workspace/UI preference helpers; runtime viewer/cache/provider state stays excluded.
- Productivity content uses Notepad/Dashboard stores and persistence helpers for durable notes, lanes, and layouts, while focus, selection, camera, preview, menus, and session state stay excluded.
- Workspace layout/preference seams have accepted proof and runtime wrappers for selected explicit preferences/layout commands, while child-window lifecycle, menus, resize frames, viewport-local/session state, and persistence bridge hydration/writeback stay excluded.
- Sampler/import setting proof currently routes sampler runtime and staged drafts outside Gen 2 undo, with accepted staged import output handled by the Gen 1 accept seam.
- No single checkpoint-wide persistence owner, storage format, restore transaction owner, or branch graph exists.

First-pass decisions:
- Phase 1 should be proof-first. It may add focused readiness tests after Manager approval, but it must not add runtime checkpoint UI, storage schema, or restore behavior.
- The next implementation, if approved, should inventory authored durable stores and restore boundaries only. Runtime checkpoint MVP work requires a later Manager-approved phase.
- Checkpoint restore semantics are not settled. The proof must present evidence for whether restore should create a canonical entry, clear redo, become a separate command outside undo/redo, or stay deferred until persistence design exists.
- Optional branching should stay deferred unless a later checkpoint MVP proves a safe single-user snapshot identity model and branch-switch/merge rules.
- Collaboration/multiplayer is conditional and not a blocker for Phase 1.

### Phase 1 Implementation Spec

Exact first proof cut:
- Add a focused proof/readiness inventory, not runtime behavior, that lists every current checkpoint candidate by owner and classifies it as:
  - authored durable project state;
  - durable user/project preference state;
  - derived read/projection state;
  - runtime/cache/provider/preview state;
  - session/navigation/focus/menu state.
- For each included durable owner, document the narrow restore boundary and whether restore must be merge-targeted rather than whole-store replacement.
- For each excluded owner, record the existing proof or local reason it must not be checkpointed.
- Compare accepted Gen 1/Gen 2 undo scopes against checkpoint candidates so checkpoints cannot silently recapture excluded draft/runtime state.
- Produce a restore-semantics decision record for Manager:
  - checkpoint restore as a canonical history entry;
  - checkpoint restore as a separate restore command that may clear or preserve redo by explicit rule;
  - checkpoint restore deferred until a storage owner and persistence architecture are approved.
- Stop after proof. Do not add runtime checkpoint buttons, snapshot storage, checkpoint ids, serialized checkpoint payloads, branch graphs, or restore commands in Phase 1.

Candidate ownership table for the first proof:

| Candidate | Likely owner/seams | First-pass classification | Phase 1 proof decision |
| --- | --- | --- | --- |
| Graph/CAD authored document state | `useSpaghettiStore`, graph/feature/sketch history suites | Authored durable | Inventory restore boundary; exclude canvas/session/runtime helpers. |
| Browser/project/import accepted content | `useAppStore`, Browser organization/import history suites | Authored durable | Inventory accepted project/reference content only; exclude staged drafts and source browsing. |
| Viewer Transform authored rows | Viewer Transform history proof/store selectors | Authored durable where accepted | Inventory accepted authored transform rows; exclude local scrub/navigation/runtime viewer state. |
| Presentation environment/material/ground | `useUiPrefsStore`, Gen2-1 helpers/readiness tests | Durable presentation preference/content | Inventory accepted durable slices only; exclude camera, preview, provider, captured-compare/session state. |
| Productivity Notepad/Dashboard content | Notepad/Dashboard stores and Gen2-2 helpers/readiness tests | Durable productivity content | Inventory accepted notes/lanes/layouts; exclude focus, selection, camera, menus, preview, drag/resize session state. |
| Workspace layout/preference | Workspace/UI preference stores and Gen2-3 readiness/helper tests | Mixed durable preference/layout and session | Inventory accepted durable fields; exclude child-window lifecycle, menus, local resize frames, transient navigation. |
| Sampler/import settings | Gen2-4 readiness proof, staged Import accept seam | Mostly runtime/staged; accepted output through Gen 1 | Keep individual sampler/import draft settings excluded unless accepted output owner is proven durable. |
| Canonical undo/redo entries | `editHistoryStore` | Runtime in-memory owner | Do not snapshot private entry payloads in Phase 1; decide separately whether persisted history is ever owned. |

Likely files:
- this phase doc and `docs/Doc-Log.md` for prep
- later proof may add a focused readiness test such as `src/app/store/checkpointOwnershipReadiness.test.ts`
- later proof may read/import existing readiness suites for accepted owners:
  - `src/app/store/editHistoryReaderContract.test.ts`
  - `src/app/store/scenePresentationEditHistoryReadiness.test.ts`
  - `src/app/store/productivityContentEditHistoryReadiness.test.ts`
  - `src/app/store/workspaceLayoutPreferenceEditHistoryReadiness.test.ts`
  - `src/app/store/samplerImportSettingEditHistoryReadiness.test.ts`
  - graph, Browser/project, Import/Catalog, Viewer Transform, Notepad, Dashboard, material/environment/ground, and workspace helper suites as needed
- future runtime checkpoint work may require a new checkpoint module/store only after Manager approves storage and restore semantics

Focused verification guidance:
- proof implementation should run the new focused checkpoint ownership/readiness test if added
- rerun targeted existing readiness suites only for owners imported or directly relied on
- prove no canonical entries are created by proof-only inventory/read operations
- prove runtime/cache/provider/session exclusions are classified and not captured by any proposed proof payload
- do not run checkpoint helper tests until Manager approves a runtime checkpoint helper
- `npm.cmd run build`

Build gate:
- Required for runtime/proof implementation. Not required for docs-only setup.

Tracking docs:
- Runtime/proof implementation must update `docs/CHANGELOG.md` with a permanent body entry.
- Any docs closeout must update this doc and `docs/Doc-Log.md`.
- Manager handles Gen3 index and run-state acceptance/status.

No-widening rule:
- Do not add runtime checkpoint buttons, checkpoint storage schema, branch graphs, collaboration/multiplayer behavior, canonical owner replacement, broad persistence architecture, private entry serialization, or whole-app snapshots in Phase 1.
- Do not recapture runtime/cache/provider/session/navigation/focus/menu state that earlier Gen 1/Gen 2 phases explicitly excluded.
- Do not treat checkpoints as a second source of project truth; they must remain planned over explicit authored owners and accepted durable preference/content boundaries.

Implementation risks:
- Whole-store checkpoint payloads could rewind unrelated runtime/session state or user preferences changed after the checkpoint.
- Persisting canonical entries would require private payload serialization and callback replay rules that do not exist.
- Restore-as-entry and restore-as-command have different redo/branch semantics; picking one too early could destabilize the canonical owner.
- Optional branching can quickly require identity, merge, conflict, and persistence semantics beyond the current single-user undo stack.

Stop conditions:
- Stop if checkpoint proof requires broad persistence architecture, storage schema migration, collaboration conflict semantics, or whole-app snapshots that would restore runtime/session/cache/provider state.
- Stop if optional branching requires changing canonical undo/redo semantics before single-user checkpoint restore is designed.
- Stop if any candidate owner cannot be separated from runtime/cache/provider/session state without production refactors; route that owner to a later proof instead of forcing it into the first checkpoint inventory.
- Stop if Manager has not approved whether restore should be canonical-entry-producing or a separate restore command before runtime work begins.

Done shape:
- The phase is done when checkpoint-owned state, restore exclusions, persistence requirements, accepted Gen 1/Gen 2 boundary reuse, runtime/session exclusions, and branch deferrals are explicit enough for Manager to approve or reject a narrow runtime checkpoint MVP.
- A later runtime MVP may be proposed only after Manager approves storage ownership, restore payload shape, restore redo semantics, and whether restore writes a canonical entry.
- `Edit-History-Gen3-CLG-2` can be recommended complete only after ownership/restore/storage/branch constraints are proven.

Acceptance mapping:
- Advances `Edit-History-Gen3-HLG-2`.
- Does not advance history reader UI or Build Path comparison goals.

Recommended next Manager action:
- Approve Phase 1 as proof-first inventory/readiness work only.
- Before any runtime checkpoint MVP, Manager should review evidence for authored durable stores, persistence owners, accepted Gen 1/Gen 2 restore boundaries, runtime/cache/provider/session exclusions, and the restore-as-entry versus restore-as-command decision.

Implementation closeout:
- [x] Added `src/app/store/checkpointOwnershipReadiness.test.ts` as a typed inventory/readiness proof, not a runtime checkpoint helper.
- [x] Classified current checkpoint candidates across authored durable state, durable preference/content state, derived/runtime/cache/provider state, session/navigation/focus/menu exclusions, and the runtime-only canonical edit-history owner.
- [x] Covered graph/CAD, Browser/project/import accepted content, Viewer Transform rows, presentation settings, Notepad/Dashboard content, workspace layout/preferences, sampler/import settings, and canonical undo/redo entries.
- [x] Encoded that Phase 1 must not serialize private `undo`/`redo` callbacks, adapter restore payloads, or private entry payloads.
- [x] Recorded restore semantics as unresolved Manager decisions: restore as canonical entry, restore as separate command, or defer until storage/persistence design.
- [x] Proved reading the proof inventory does not create canonical entries and preserves seeded redo.
- [x] No runtime checkpoint buttons, checkpoint store/helper, snapshot ids/payload schema, storage migration, branch graph, collaboration/multiplayer behavior, canonical owner replacement, broad persistence architecture, or restore command was added.

Verification notes:
- `npm.cmd test -- --run src/app/store/checkpointOwnershipReadiness.test.ts` passed with 4 tests.
- `npm.cmd run build` passed; Vite reported the existing browser-externalized `path`/`crypto` and large chunk warnings.
- No adjacent readiness suites were rerun because the proof imports only the central edit-history store type/runtime for redo-preservation proof and does not touch existing owners.
- Manager reran `npm.cmd test -- --run src/app/store/checkpointOwnershipReadiness.test.ts`; it passed with 4 tests.
- Manager reran `npm.cmd run build`; it passed with the existing browser-externalized `path`/`crypto` and large chunk warnings.

Closeout recommendation:
- Manager accepted `Edit-History-Gen3-CLG-2` complete for current checkpoint ownership/restore-boundary proof.
- Manager closed `Edit-History-Gen3-HLG-2` for current planning scope; unresolved restore semantics remain the required checkpoint gate before runtime MVP work.
- Do not approve a runtime checkpoint MVP until Manager separately approves storage ownership, checkpoint payload shape, restore redo behavior, and restore-as-entry versus restore-as-command semantics.

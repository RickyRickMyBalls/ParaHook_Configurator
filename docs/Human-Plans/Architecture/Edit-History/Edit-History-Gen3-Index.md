# Edit History Gen3 Index

## Doc Header

### Doc History
10. 2026-04-22 10:44:55: Manager accepted `Edit-History-Gen3-3 / Phase 1 - Live Build Path Surface And Comparison Readiness Proof` as a deferred no-current-scope closeout after Worker and Manager source scans found no live Build Path product surface/store/playhead/comparison UI, marked `Edit-History-Gen3-CLG-3` complete, closed `Edit-History-Gen3-HLG-3` and current Gen3, and selected final all-generations verification.
9. 2026-04-22 10:41:17: Manager accepted proof-only `Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof` after focused checkpoint proof and production build verification passed, confirmed changelog entry `[1693]`, marked `Edit-History-Gen3-CLG-2` complete, closed `Edit-History-Gen3-HLG-2` and `Edit-History-Gen3-2`, and selected `Edit-History-Gen3-3 / Phase 1 - Live Build Path Surface And Comparison Readiness Proof` as the next retained-Worker prep target.
8. 2026-04-22 10:35:30: Manager approved the prepped `Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof` proof spec after reviewing the tightened checkpoint candidate table and live persistence/store seams, selecting a proof-only inventory/readiness implementation with no runtime checkpoint UI, storage schema, branch graph, broad persistence architecture, collaboration, private entry serialization, or canonical owner replacement.
7. 2026-04-22 10:30:54: Manager accepted `Edit-History-Gen3-1 / Phase 2.1 - Reader Grouping And Filtering Polish` after focused reader UI and production build verification passed, confirmed changelog entry `[1692]`, marked `Edit-History-Gen3-CLG-5` complete, closed `Edit-History-Gen3-HLG-1`, and selected `Edit-History-Gen3-2 / Phase 1 - Checkpoint Ownership And Restore Boundary Proof` as the next retained-Worker prep target.
6. 2026-04-22 10:26:32: Manager approved the prepped `Edit-History-Gen3-1 / Phase 2.1 - Reader Grouping And Filtering Polish` implementation spec after reviewing the live reader surface and public view-model seams; selected local source-surface filtering first, with optional grouped headings only if tiny, and kept saved reader preferences, persistence, private payload inspection, checkpoints, branching, Build Path comparison, and any second undo owner out of scope.
5. 2026-04-22 10:23:19: Manager accepted `Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI` after focused reader, store, reader-contract, ViewportFrame, workspace registration, Home Page, and production build verification passed; marked `Edit-History-Gen3-CLG-4` complete while keeping `Edit-History-Gen3-HLG-1` open for a small grouping/filtering polish follow-up.
4. 2026-04-22 10:05:24: Manager approved the prepped `Edit-History-Gen3-1 / Phase 2 - Read-Only History Reader UI` implementation spec, selecting the dedicated optional workspace surface path with only a tiny canonical store subscription/snapshot seam allowed for live React rendering and no persistence, checkpoints, branching, Build Path comparison, collaboration, payload inspection, or second undo owner.
3. 2026-04-22 10:03:18: Manager accepted `Edit-History-Gen3-1 / Phase 1 - Reader Contract And UX Shape Proof` after focused reader-contract, central edit-history store, and production build verification passed; marked `Edit-History-Gen3-CLG-1` complete while keeping `Edit-History-Gen3-HLG-1` open for a narrow runtime read-only history reader UI.
2. 2026-04-22 09:56:09: Manager accepted the Gen3 docs-only planning setup after reviewing the Gen3 index, history reader UX, checkpoints/snapshots/optional branching, advanced Build Path comparison future docs, family index, Doc-Index, and Doc-Log discoverability; selected `Edit-History-Gen3-1 / Phase 1 - Reader Contract And UX Shape Proof` as the next retained-Worker proof/design target.
1. 2026-04-22 09:52:07: Created the Generation 3 planning index for advanced history reader UX, checkpoints/snapshots, optional branching, and advanced Build Path comparison after Gen 1 metadata proof and Gen 2 durable single-user candidate closeout.

### Purpose

This doc is the Generation 3 planning index for `Edit History`.

Use it to decide:
- which advanced history product surfaces should be planned after the canonical owner and Gen 2 durable candidates
- which work belongs to history reader UX, checkpoints/snapshots/branching, or Build Path comparison
- which items remain conditional, especially collaboration/multiplayer history
- what should not disturb the current canonical edit-history owner

## Doc Body

### Generation Goal

Generation 3 should productize canonical edit history without replacing it.

The generation should make canonical entries easier to read, inspect, checkpoint, compare, and eventually branch from, while preserving the Gen 1/Gen 2 rule that only explicit authored state changes belong in canonical undo.

Generation 3 must not create a second undo owner. It should build reader, checkpoint, and comparison workflows over the existing canonical owner only after the required persistence and restore semantics are explicit.

### Current Routing

- `Future/Edit-History-Gen3-1 - History Reader UX And Labels.md`
  - visible history reader UI, entry labels, grouping/filtering, and inspectable entry summaries over canonical entries
- `Future/Edit-History-Gen3-2 - Checkpoints Snapshots And Optional Branching.md`
  - checkpoint/snapshot planning and optional branching after persistence and single-user restore semantics are designed
- `Future/Edit-History-Gen3-3 - Advanced Build Path Comparison.md`
  - advanced Build Path, branch, or variant comparison after a live Build Path surface exists

### No-Widening Rule

Gen 3 setup does not implement runtime behavior. It must not add source code, tests, schemas, storage, keyboard dispatch, history panel UI, persistence, collaboration, Build Path comparison, new undo adapters, or new canonical history owners. It only creates routing and future planning surfaces.

### Acceptance Read

Gen 3 planning setup is acceptable when the family has:
- one scan index for advanced history productization
- one concise future doc for history reader UX and labels
- one concise future doc for checkpoints/snapshots and optional branching
- one concise future doc for advanced Build Path comparison
- explicit no-widening rules that preserve the current canonical edit-history owner
- discoverability from the family index and docs index

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen3-HLG-1` - Make canonical history visible and understandable through reader UI, labels, filtering, grouping, and inspectable entry summaries without making readers into undo owners.
- [x] `Edit-History-Gen3-HLG-2` - Plan checkpoints, snapshots, and optional branching only after persistence and single-user restore semantics are explicit.
- [x] `Edit-History-Gen3-HLG-3` - Plan advanced Build Path comparison and variant comparison only after a live Build Path surface exists and stays derived from canonical authored truth.

### Codex Level Goals

- [x] `Edit-History-Gen3-CLG-1` - Define history reader UX, labels, filters, grouping, and inspectable metadata over canonical entries without private payload dependence.
- [x] `Edit-History-Gen3-CLG-2` - Define checkpoint/snapshot ownership, restore boundaries, persistence requirements, and optional branching constraints before implementation.
- [x] `Edit-History-Gen3-CLG-3` - Define advanced Build Path comparison ownership, live-surface prerequisites, variant comparison semantics, and playhead/navigation exclusions before implementation.
- [x] `Edit-History-Gen3-CLG-4` - Add a narrow read-only history reader UI that lists canonical undo/redo entries through public metadata without becoming a new undo owner.
- [x] `Edit-History-Gen3-CLG-5` - Add small reader grouping/filtering polish over public metadata so the current visible-history goal can close without persistence or payload inspection.

## [x] `Edit-History-Gen3-1` - `History Reader UX And Labels`

Planning doc:
- `Future/Edit-History-Gen3-1 - History Reader UX And Labels.md`

Status:
- Phase 1 proof/design accepted after central public timestamps and reader-contract coverage proved future listing, grouping, filtering, and inspection through public metadata.
- Phase 2 first visible read-only workspace reader accepted after focused UI/store/registration/build verification.
- Phase 2.1 source-filtering polish accepted after focused reader UI and production build verification; current visible read-only history reader scope is closed.
- depends on Gen 1 reader metadata proof and accepted Gen 2 candidate closeout

## [x] `Edit-History-Gen3-2` - `Checkpoints Snapshots And Optional Branching`

Planning doc:
- `Future/Edit-History-Gen3-2 - Checkpoints Snapshots And Optional Branching.md`

Status:
- setup-only planning surface created
- Phase 1 proof spec approved for checkpoint ownership/readiness inventory because checkpoint persistence, restore ownership, storage shape, and branch semantics are not yet designed
- Phase 1 proof accepted after focused readiness and production build verification; runtime checkpoint MVP remains deferred until storage ownership, payload shape, redo behavior, and restore-as-entry versus restore-as-command semantics are approved.
- collaboration/multiplayer remains conditional unless explicitly promoted by the user

## [x] `Edit-History-Gen3-3` - `Advanced Build Path Comparison`

Planning doc:
- `Future/Edit-History-Gen3-3 - Advanced Build Path Comparison.md`

Status:
- setup-only planning surface created
- Phase 1 accepted as deferred no-current-scope closeout because no live Build Path product surface/store/playhead/comparison UI exists.
- Build Path comparison must remain a derived reader over canonical authored state, not a second undo stack, if a future family creates the live surface.

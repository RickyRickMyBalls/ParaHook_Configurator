# Cleanup Phase Cleanup-3 - Shared Boundary And Worker Contract Repair

## Doc Header

### Doc History
10. 2026-04-12 21:44:03: Marked the parent `Cleanup 3 - Shared Boundary And Worker Contract Repair` phase complete and moved this finished phase record from `Cleanup/Future/` to `Cleanup/Shipped/` now that `Phase 1` through `Phase 4` are all complete and the family can cite this file as the shipped boundary-repair record
9. 2026-04-12 21:41:15: Completed `Phase 4 - Repoint Worker And App Imports` as a focused code-and-verification pass by repointing worker runtime imports away from the old app-side `geometryRequest` shim and `featureTypes` re-export surface to the real shared owners in `src/shared/geometryRequest.ts` and `src/shared/sketchTypes.ts`, while intentionally leaving the app-owned `runtimeTessellation.ts` seam and broader worker test-harness cleanup outside this pass
8. 2026-04-12 21:29:47: Tightened `Phase 4 - Repoint Worker And App Imports` into an implementation-ready code-and-verification pass grounded in the post-`Phase 3` live seam where worker runtime files still import the old app-side `geometryRequest` shim and `featureTypes` re-export surface, narrowing the next work to repointing those runtime imports to `src/shared/geometryRequest.ts` and `src/shared/sketchTypes.ts` while explicitly leaving the app-owned `runtimeTessellation.ts` seam and broader test harness imports outside this pass
7. 2026-04-12 21:14:04: Completed `Phase 3 - Move The Shared Contract Truth` as a focused code-and-verification pass by moving the geometry-request contract into new `src/shared/geometryRequest.ts`, extracting the narrow shared sketch primitives into `src/shared/sketchTypes.ts`, reducing `src/app/spaghetti/contracts/geometryRequest.ts` to a forwarding shim, and updating `src/shared/sketchPlaneFrame.ts` plus `featureTypes.ts` to read from the shared seam without pulling `runtimeTessellation.ts` or the rest of `featureTypes.ts` into the boundary
6. 2026-04-12 21:04:16: Tightened `Phase 3 - Move The Shared Contract Truth` into an implementation-ready code-and-verification pass grounded in the completed drift inventory and the existing focused `src/shared/` file pattern, narrowing the next work to extracting the true worker-facing contract pieces into small shared files while explicitly avoiding a broad move of `featureTypes.ts` or compiler helpers into the shared boundary
5. 2026-04-12 21:02:26: Completed `Phase 2 - Audit Current Contract Drift` as a docs-and-verification pass by recording one explicit drift inventory against the locked `src/shared/` boundary home, classifying `geometryRequest.ts` as `move to shared`, `featureTypes.ts` as `bridge temporarily`, and `runtimeTessellation.ts` as `leave app-owned` while naming the current worker consumer files that prove the drift is still live
4. 2026-04-12 20:49:56: Tightened `Phase 2 - Audit Current Contract Drift` into an implementation-ready docs-and-verification pass grounded in the newly locked `src/shared/` boundary-home answer plus the live worker reach-ins into app spaghetti implementation files, narrowing the next work to one explicit drift inventory with `move now`, `bridge temporarily`, and `leave app-owned` buckets before any contract moves begin
3. 2026-04-12 20:43:44: Completed `Phase 1 - Lock The Shared Boundary Home` as a docs-and-verification pass by locking `src/shared/` as the canonical worker-facing shared contract home, rejecting `src/app/protocol.ts` as a non-live alternative, and recording the current worker reach-ins into `src/app/spaghetti/contracts/geometryRequest.ts` plus related app internals as the proof that later boundary-repair phases are still needed
2. 2026-04-12 20:43:44: Tightened `Phase 1 - Lock The Shared Boundary Home` into an implementation-ready docs-and-verification pass grounded in the live repo seam where `src/shared/` already acts as the main shared surface, `src/app/protocol.ts` does not currently exist, and worker authoritative/runtime files still reach into `src/app/spaghetti/contracts/geometryRequest.ts`, narrowing the next work to locking the real boundary home before broader drift auditing begins
1. 2026-04-12 13:42: Created this standalone `Cleanup 3` future phase doc to give the worker/app shared-boundary repair lane one explicit planning surface under the Cleanup family

### Purpose

This doc defines the third cleanup phase for the `Cleanup` family.

Use it to answer:
- what the shared-boundary problem currently is
- how worker-facing contract truth should be repaired
- what the likely sequencing is for making the boundary real

Do not use it for:
- speculative protocol redesign beyond the cleanup need
- implementation detail for unrelated worker features
- replacing `Worker/` feature planning docs

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - boundary-repair lane framing

- `../Canonical-Ownership-Targets.md`
  - worker-facing contracts ownership target

- `../../Worker/Worker-Vision.md`
  - worker scheduling and runtime direction

## Doc Body

## [x] Cleanup 3 - Shared Boundary And Worker Contract Repair

### Header

Purpose:
- create one honest shared boundary for worker-facing contracts so worker code stops depending on app implementation folders as if they were shared protocol

Owns:
- the shared worker/app protocol boundary decision
- moving worker-facing contract truth into an explicit shared surface
- reducing direct worker imports from app internals

Does not own:
- worker runtime scheduling redesign
- graph/runtime ownership decisions beyond the boundary itself
- broad reorganization of every app type

### Why This Phase Exists

The cleanup docs already show one repeated problem:
- lint and docs imply a cleaner worker boundary than the code currently has

That means the architecture direction is already visible.
The implementation is simply behind it.

This phase exists to make the shared boundary real enough that:
- worker files stop reaching inward
- app internals stop masquerading as shared protocol
- later cleanup phases can rely on a stable contract seam

### Scope

This phase covers:
- worker/app shared contract placement
- rerouting imports to the chosen shared surface
- clarifying boundary ownership for types both worker and app use

This phase does not cover:
- every worker behavior detail
- final protocol ergonomics for future features
- broad source-folder cleanup outside the boundary seam

### Current Read

Current problem shape:
- worker-facing types are still partly spread across shared types, app spaghetti contracts, and worker-local imports
- the codebase already wants a cleaner shared seam, but not all files honor it yet

### Locked Direction

- if app and worker both need the type, it should live in an explicit shared boundary
- worker files should not import arbitrary app implementation internals
- shared boundary repair should be narrower than a giant worker rewrite

### Phase Ladder

## [x] Phase 1 - Lock The Shared Boundary Home

### Header

#### Purpose:
- decide the real home for worker-facing shared contracts so later cleanup can move and reroute types against one explicit boundary instead of re-arguing the boundary name on every pass

#### Current read:
- the repo already has a real shared surface under `src/shared/`
- app and worker already both depend on that surface for types such as `buildTypes`, `geometryResult`, `exportTypes`, `partsTypes`, `productSchema`, `sketchPlaneFrame`, and `viewSettingsTypes`
- `src/app/protocol.ts` does not currently exist as a live boundary file
- worker authoritative/runtime files still reach into `src/app/spaghetti/contracts/geometryRequest.ts`, which means the current shared story is only partial
- the real `Phase 1` job is therefore to lock whether the canonical worker-facing contract home is:
  - the existing `src/shared/` surface
  - or a narrower explicitly named boundary file/folder only if the repo scan proves that shape is both real and meaningfully better

#### Read:
- `Phase 1` should stay a docs-and-verification pass
- the right job here is to lock the shared boundary home before `Phase 2` audits all remaining drift
- this phase should stay focused on the boundary-home decision itself, not on moving contracts yet

#### Locked Phase 1 in-scope:
- re-read the Cleanup worker-boundary direction in the owner docs
- inspect the live repo to confirm which shared surfaces already exist and which worker-facing imports still reach into app internals
- lock one explicit boundary-home answer for later cleanup phases to follow
- record why any non-chosen candidate is being rejected or deferred

#### Locked Phase 1 out-of-scope:
- moving files
- rerouting imports
- auditing every drifted contract in detail
- redesigning future worker protocol ergonomics
- broad `src/shared/` reorganization outside what is needed to lock the boundary-home decision

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`

#### Strongest live repo seams for this pass:
- `src/shared/`
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/authoritative/`
- `src/worker/cad/`
- `src/worker/pipeline/`

#### Preferred Phase 1 implementation shape:
- keep this as a docs-and-verification pass
- use the live repo scan to answer whether `src/shared/` is the canonical boundary home now
- treat `src/app/protocol.ts` as a fallback candidate only if the scan or docs show an active boundary surface there
- stop once later cleanup phases can cite one explicit home for worker-facing shared contracts

### Implementation spec:
1. Re-read the worker shared-boundary direction in `Canonical-Ownership-Targets.md` and `Canonical-Owner-Decisions.md`.
2. Scan the live repo for:
   - existing shared-boundary files under `src/shared/`
   - any live `src/app/protocol.ts`-style boundary file
   - worker imports that still reach into app implementation folders such as `src/app/spaghetti/contracts/`
3. Write one explicit boundary-home baseline inside this phase doc that answers:
   - the chosen canonical shared-boundary home
   - why that home wins against the current alternatives
   - which currently live worker-facing imports prove that the repair is still needed
4. If the live repo scan still agrees, treat `src/shared/` as the leading candidate and treat `src/app/protocol.ts` only as a rejected-or-deferred alternative unless a real file or stronger boundary reason appears.
5. Stop once `Phase 2` can audit contract drift against one named home rather than against multiple abstract candidates.

#### Implementation stop rule:
- `Phase 1` is ready to implement once the next pass can lock one explicit boundary-home answer from the current docs plus repo scan
- do not widen this into moving contracts, rerouting imports, or inventing a future protocol redesign just to make the phase feel larger

#### Checklist:
- [x] re-read the shared-boundary direction in the cleanup owner docs
- [x] scan the live repo for existing shared surfaces and current worker reach-ins
- [x] write the explicit boundary-home baseline
- [x] record why the non-chosen candidate is rejected or deferred
- [x] stop before file moves or import rewiring

#### Target decision:
- canonical home for worker-facing shared contracts

#### Likely live candidates:
- `src/shared/`
- a dedicated boundary file only if a real and stable `src/app/protocol.ts`-style surface actually exists

#### Done shape:
- later cleanup phases can cite one explicit shared-boundary home
- the family stops treating the boundary name itself as still-open every time worker cleanup starts
- `Phase 2` can audit drift against one honest target instead of two blurry candidates

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
- optionally tighten one companion cleanup owner doc only if the repo scan finds a direct contradiction that would make the boundary-home baseline misleading

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- manually confirm in the repo that:
  - `src/shared/` exists and is already used by both app and worker
  - `src/app/protocol.ts` does not currently exist unless the scan proves otherwise
  - at least one worker-facing path still reaches into app implementation folders such as `src/app/spaghetti/contracts/geometryRequest.ts`
- confirm the resulting boundary-home baseline matches both the docs and the live repo seam rather than inventing a future-only structure

#### Shared Boundary Home Baseline

This is the locked boundary-home answer later cleanup phases should cite directly when deciding where worker-facing shared contracts belong.

##### Chosen canonical home

- `src/shared/`

##### Why this home wins

- it already exists as a real repo surface instead of a future-only placeholder
- both app and worker already depend on it for genuinely shared contract and payload types such as:
  - `buildTypes`
  - `geometryResult`
  - `exportTypes`
  - `partsTypes`
  - `productSchema`
  - `sketchPlaneFrame`
  - `viewSettingsTypes`
- it matches the cleanup-family direction that shared app-worker truth should live in an explicit shared boundary rather than in app implementation folders
- it gives `Phase 2` and later migration passes one honest target that is already visible in the folder layout

##### Rejected or deferred alternative

- `src/app/protocol.ts`
  - rejected for now as the canonical answer because no live boundary file currently exists there
  - may only become relevant later if the repo grows a truly boundary-shaped dedicated file and that structure proves clearer than the existing `src/shared/` surface

##### Current live proof that repair is still needed

- worker authoritative/runtime paths still reach into app implementation folders, including:
  - `src/worker/authoritative/ocSketchWire.ts`
    - imports `GeometryRequestSketchProfile` from `src/app/spaghetti/contracts/geometryRequest.ts`
    - imports `Segment2` from `src/app/spaghetti/features/featureTypes.ts`
  - `src/worker/authoritative/buildAuthoritativeGeometry.ts`
    - imports geometry-request types from `src/app/spaghetti/contracts/geometryRequest.ts`
  - `src/worker/cad/featureStackRuntime.ts`
    - imports geometry-request types from `src/app/spaghetti/contracts/geometryRequest.ts`
    - imports feature and tessellation helpers from app spaghetti implementation folders
  - `src/worker/cad/cadKernelAdapter.ts`
    - imports `SketchPlaneTransform` from `src/app/spaghetti/features/featureTypes.ts`

##### Boundary rule going forward

- if a type is needed by both app and worker as contract truth, its home is `src/shared/`
- app implementation folders may still temporarily contain worker-used types during migration, but those are drift to be audited and repaired rather than acceptable permanent protocol homes
- later cleanup phases should audit and move toward `src/shared/` rather than reopening the boundary-home decision itself

## [x] Phase 2 - Audit Current Contract Drift

### Header

#### Purpose:
- list the current worker-facing contract drift against the locked `src/shared/` boundary home so later migration passes can move the right things without re-auditing the whole worker seam

#### Current read:
- `Phase 1` now locks `src/shared/` as the canonical shared boundary home
- the next missing piece is a clean inventory of what is still drift versus what is already in the right place
- the live repo scan already shows worker reach-ins into app spaghetti implementation surfaces such as:
  - `src/app/spaghetti/contracts/geometryRequest.ts`
  - `src/app/spaghetti/features/featureTypes.ts`
  - `src/app/spaghetti/compiler/runtimeTessellation.ts`
- not every worker import from app folders is automatically a shared-boundary move candidate, so the audit needs explicit buckets instead of one blanket "move everything" rule

#### Read:
- `Phase 2` should stay a docs-and-verification pass
- the right job here is to build one explicit drift inventory against the locked `src/shared/` target
- this phase should distinguish:
  - shared contract types that should move
  - app-owned helpers that may need bridges instead of direct moves
  - app-owned imports that should stay app-side and be consumed through another seam later

#### Locked Phase 2 in-scope:
- re-read the newly locked `Phase 1` boundary-home baseline
- inspect current worker imports from app implementation folders
- build one explicit drift inventory section inside this phase doc
- classify the main drifted items into clear action buckets for later phases

#### Locked Phase 2 out-of-scope:
- moving any files
- rerouting imports
- designing the final bridge API in detail
- broad worker or spaghetti cleanup beyond what is needed to classify the drift

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`

#### Strongest live repo seams for this pass:
- `src/shared/`
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/compiler/runtimeTessellation.ts`
- `src/worker/authoritative/`
- `src/worker/cad/`

#### Preferred Phase 2 implementation shape:
- keep this as a docs-and-verification pass
- audit the live worker reach-ins against the locked `src/shared/` home
- classify each main drift seam as:
  - move to shared
  - bridge temporarily
  - leave app-owned
- stop once later phases have one explicit inventory to execute against

### Implementation spec:
1. Re-read the `Phase 1` shared-boundary home baseline together with the worker-boundary direction in the cleanup owner docs.
2. Scan current worker imports that still reach into app implementation folders.
3. Build one explicit contract-drift inventory inside this phase doc that records, at minimum:
   - current app-internal import path
   - worker consumer files
   - likely classification:
     - `move to shared`
     - `bridge temporarily`
     - `leave app-owned`
4. If the live repo scan still agrees, treat the following as the initial audit anchors:
   - `geometryRequest.ts`
   - `featureTypes.ts`
   - `runtimeTessellation.ts`
5. Stop once `Phase 3` can move shared contract truth against one explicit drift inventory instead of another broad repo reread.

#### Implementation stop rule:
- `Phase 2` is ready to implement once the next pass can write one explicit drift inventory against `src/shared/`
- do not widen this into actual contract moves, bridge design, or import rewiring just to make the phase feel larger

#### Checklist:
- [x] re-read the `Phase 1` boundary-home baseline and companion owner docs
- [x] scan live worker imports that still reach into app implementation folders
- [x] write the explicit contract-drift inventory
- [x] classify the main drift seams into `move to shared`, `bridge temporarily`, or `leave app-owned`
- [x] stop before file moves or import rewiring

#### Target output:
- one explicit contract-drift inventory for later cleanup phases

#### Initial live drift anchors:
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/app/spaghetti/compiler/runtimeTessellation.ts`

#### Done shape:
- later cleanup phases can point at one drift inventory instead of rescanning the worker seam
- the family has a clearer distinction between true shared contracts and app-owned helpers
- `Phase 3` can move contract truth with less discovery overhead and less risk of dragging app implementation detail into `src/shared/`

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
- optionally tighten one companion cleanup owner doc only if the audit finds a direct contradiction that would make the drift inventory misleading

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- manually confirm in the repo that worker code still imports from the listed app spaghetti implementation paths
- confirm the resulting drift inventory stays aligned with the locked `src/shared/` home rather than reopening the boundary-home decision

#### Contract-Drift Inventory

This is the live drift inventory later cleanup phases should execute against while keeping the locked boundary-home answer fixed at `src/shared/`.

##### 1. `src/app/spaghetti/contracts/geometryRequest.ts`

Current worker consumers:
- `src/worker/authoritative/ocSketchWire.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/cad/featureStackRuntime.ts`

Classification:
- `move to shared`

Why:
- this file defines worker-facing request payload and validation shapes that act like real app-worker contract truth
- its current placement under app spaghetti contracts makes worker code depend on an app implementation folder for a boundary type
- moving the geometry-request contract into `src/shared/` matches the locked boundary rule without dragging unrelated editor/store behavior into the shared layer

Migration note:
- the move likely requires extracting or replacing the current dependencies on `ProfileLoop` and `SketchPlaneTransform` so the shared request contract does not keep reaching back into app feature files

##### 2. `src/app/spaghetti/features/featureTypes.ts`

Current worker consumers:
- `src/worker/authoritative/ocSketchWire.ts`
  - `Segment2`
- `src/worker/cad/cadKernelAdapter.ts`
  - `SketchPlaneTransform`
- `src/worker/cad/featureStackRuntime.ts`
  - `createDefaultSketchPlaneTransform`
  - `SketchPlaneTransform`

Classification:
- `bridge temporarily`

Why:
- this file is not one clean shared contract surface; it mixes app-authored feature model, UI-adjacent feature data, and a smaller set of geometry primitives currently reused by worker code
- the worker only appears to need a narrow subset such as `Segment2`, `ProfileLoop`, and `SketchPlaneTransform`, not the whole feature-authoring model
- the right later move is to extract the truly shared primitives into `src/shared/` or another narrow seam, then bridge worker usage through those extracted types instead of promoting the whole file into shared

Migration note:
- treat the current direct imports as temporary drift
- do not move all of `featureTypes.ts` into `src/shared/`

##### 3. `src/app/spaghetti/compiler/runtimeTessellation.ts`

Current worker consumers:
- `src/worker/cad/featureStackRuntime.ts`

Classification:
- `leave app-owned`

Why:
- this file is a deterministic compiler/runtime helper, not contract truth
- moving it into `src/shared/` would blur the boundary between shared protocol types and app implementation helpers
- the worker should stop depending on the app compiler copy through a later replacement seam rather than by treating this helper as part of the shared contract layer

Migration note:
- later follow-through may replace this import with a worker-local helper or a narrower extracted geometry utility, but this phase should not treat the whole file as shared-contract truth

#### Supporting Audit Notes

- test-only imports from app spaghetti schema, registry, and compiler files still exist in worker tests such as `src/worker/cad/featureStackRuntime.test.ts`
- this first audit pass stays centered on runtime/shared-boundary drift rather than widening immediately into all test harness dependencies

## [x] Phase 3 - Move The Shared Contract Truth

### Header

#### Purpose:
- move the true worker-facing contract truth into `src/shared/` using the completed drift inventory so later import rewiring can point at a real shared contract surface instead of app spaghetti implementation folders

#### Current read:
- `Phase 1` locks `src/shared/` as the canonical boundary home
- `Phase 2` classifies the main drift seams into:
  - `geometryRequest.ts` -> `move to shared`
  - `featureTypes.ts` -> `bridge temporarily`
  - `runtimeTessellation.ts` -> `leave app-owned`
- `src/shared/` already follows a focused file-per-contract pattern such as `buildTypes.ts`, `geometryResult.ts`, `exportTypes.ts`, and `sketchPlaneFrame.ts`
- the right move shape is therefore a small shared extraction, not a broad relocation of whole app spaghetti files

#### Read:
- `Phase 3` should be a code-and-verification pass
- the right job here is to create the smallest honest shared contract files needed for the worker-facing types currently trapped in app spaghetti folders
- this phase should preserve the drift-inventory classifications instead of collapsing back into "move everything shared-looking"

#### Locked Phase 3 in-scope:
- create or extend focused files under `src/shared/` for the true worker-facing contract types
- move `geometryRequest` contract truth into the shared boundary
- extract the narrow shared primitives needed from `featureTypes.ts` where required by that move
- update app-side exports or imports only as needed to keep runtime behavior and existing callers working during the transition
- keep the shared surface small and explicit

#### Locked Phase 3 out-of-scope:
- broad `featureTypes.ts` relocation
- moving `runtimeTessellation.ts` into `src/shared/`
- full worker import repointing across every caller
- worker behavior redesign
- app spaghetti architecture cleanup beyond what the contract move requires

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`

#### Strongest live repo seams for this pass:
- `src/shared/`
- `src/app/spaghetti/contracts/geometryRequest.ts`
- `src/app/spaghetti/features/featureTypes.ts`
- `src/worker/authoritative/`
- `src/worker/cad/`

#### Preferred Phase 3 implementation shape:
- add one or more small shared files instead of one large catch-all contract file
- move the geometry-request contract types first because that seam is already classified as `move to shared`
- extract only the narrow shared primitives needed from `featureTypes.ts`
- keep compatibility or forwarding seams minimal and temporary where needed so `Phase 4` can finish the repoint cleanly

### Implementation spec:
1. Re-read the `Phase 1` boundary-home baseline and the `Phase 2` contract-drift inventory.
2. Create or extend focused shared files under `src/shared/` for the contract truth that currently lives in `src/app/spaghetti/contracts/geometryRequest.ts`.
3. If the move still requires app-spaghetti feature primitives such as `ProfileLoop`, `Segment2`, or `SketchPlaneTransform`, extract only those narrow shared primitives into an explicit shared file instead of moving all of `featureTypes.ts`.
4. Update the app-side geometry-request surface only as needed so existing app callers can continue to compile while the shared contract becomes the real owner.
5. Stop once:
   - the true moved contract types live in `src/shared/`
   - the old app-side location is no longer the canonical truth
   - `Phase 4` can repoint worker and app imports against the new shared owner

#### Implementation stop rule:
- `Phase 3` is ready to implement once the next pass can move the real contract truth into small shared files without widening into a full spaghetti-type reorganization
- do not move `runtimeTessellation.ts` into shared
- do not move all of `featureTypes.ts` into shared just because a subset is currently reused by worker code

#### Checklist:
- [x] re-read the `Phase 1` boundary-home baseline and `Phase 2` drift inventory
- [x] create or extend focused `src/shared/` files for the true moved contract types
- [x] move `geometryRequest` contract truth into the shared boundary
- [x] extract only the narrow shared primitives required from `featureTypes.ts`
- [x] keep compatibility seams minimal and temporary where needed
- [x] stop before broad import rewiring or unrelated app cleanup

#### Target move set:
- worker-facing geometry-request contract types
- any narrow shared geometry primitives those contracts require

#### Explicit non-targets:
- whole-file move of `src/app/spaghetti/features/featureTypes.ts`
- move of `src/app/spaghetti/compiler/runtimeTessellation.ts` into `src/shared/`

#### Done shape:
- the true worker-facing contract types now live in `src/shared/`
- the shared boundary remains small and file-scoped like the rest of `src/shared/`
- `Phase 4` can repoint imports against a real shared owner instead of a planned one

#### Recommended file changes:
- add or edit focused files under `src/shared/`
- edit `src/app/spaghetti/contracts/geometryRequest.ts`
- edit `src/app/spaghetti/features/featureTypes.ts` only if a narrow shared-primitive extraction is required
- optionally touch a small number of app-side callers only where needed to preserve compilation during the move

#### Verification:
- run a targeted repo check confirming the moved contract truth now lives under `src/shared/`
- confirm the app-side geometry-request surface is no longer the canonical owner
- confirm no broad whole-file move of `featureTypes.ts` occurred
- confirm `runtimeTessellation.ts` remains app-owned

#### Shared Contract Truth Move Baseline

This is the moved-contract state later cleanup phases should treat as the new baseline before import rewiring starts.

##### Moved into `src/shared/`

- `src/shared/geometryRequest.ts`
  - now owns the geometry-request contract types and payload guards
- `src/shared/sketchTypes.ts`
  - now owns the narrow shared sketch primitives needed by that contract move:
    - `SketchPlane`
    - `Vec3Literal`
    - `SketchPlaneTransform`
    - `createDefaultSketchPlaneTransform`
    - `Segment2`
    - `ProfileLoop`

##### Compatibility seams kept intentionally

- `src/app/spaghetti/contracts/geometryRequest.ts`
  - now acts as a forwarding shim to `src/shared/geometryRequest.ts`
- `src/app/spaghetti/features/featureTypes.ts`
  - now re-exports the extracted shared sketch primitives while keeping the broader feature-authoring model app-owned

##### Shared seam cleanup completed in this pass

- `src/shared/sketchPlaneFrame.ts`
  - now reads from `src/shared/sketchTypes.ts` instead of reaching into app spaghetti feature types

##### Explicit non-moves honored

- `src/app/spaghetti/compiler/runtimeTessellation.ts`
  - remains app-owned
- broad whole-file move of `src/app/spaghetti/features/featureTypes.ts`
  - intentionally not done

##### Follow-on handoff

- `Phase 4` should now repoint worker and app imports to the real shared owners
- this phase intentionally stopped short of broad import rewiring once the canonical shared contract truth was moved and the temporary forwarding seams were in place

## [x] Phase 4 - Repoint Worker And App Imports

### Header

#### Purpose:
- repoint worker-facing runtime imports to the real shared owners created in `Phase 3` so the old app-side shim and re-export surfaces stop acting like the de facto protocol paths

#### Current read:
- `Phase 3` moved the true contract truth into:
  - `src/shared/geometryRequest.ts`
  - `src/shared/sketchTypes.ts`
- worker runtime files still import the old app-side paths, including:
  - `src/worker/authoritative/buildAuthoritativeGeometry.ts`
    - `../../app/spaghetti/contracts/geometryRequest`
  - `src/worker/authoritative/ocSketchWire.ts`
    - `../../app/spaghetti/contracts/geometryRequest`
    - `../../app/spaghetti/features/featureTypes`
  - `src/worker/cad/cadKernelAdapter.ts`
    - `../../app/spaghetti/features/featureTypes`
  - `src/worker/cad/featureStackRuntime.ts`
    - `../../app/spaghetti/contracts/geometryRequest`
    - `../../app/spaghetti/features/featureTypes`
- the app-owned `runtimeTessellation.ts` seam still exists, but it was explicitly left out of the shared-contract move and should not be silently folded into this repoint pass

#### Read:
- `Phase 4` should be a code-and-verification pass
- the right job here is to repoint the moved runtime contract imports first
- this phase should finish the shared-contract adoption for worker runtime files without widening into broader app-helper replacement or test harness cleanup

#### Locked Phase 4 in-scope:
- repoint worker runtime imports from the old app-side geometry-request shim to `src/shared/geometryRequest.ts`
- repoint worker runtime imports from the `featureTypes.ts` re-export surface to `src/shared/sketchTypes.ts` where the imported symbol now truly lives
- keep runtime behavior unchanged while making the import story match the locked boundary
- make only the minimal app-side import updates needed if a moved symbol now has a better direct shared home

#### Locked Phase 4 out-of-scope:
- moving additional contract truth
- replacing the app-owned `runtimeTessellation.ts` seam
- broad test-only import cleanup in worker tests
- non-worker app import normalization just for style
- worker behavior redesign

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Shipped/Cleanup_Phase Cleanup-3 - Shared Boundary And Worker Contract Repair.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`

#### Strongest live repo seams for this pass:
- `src/shared/geometryRequest.ts`
- `src/shared/sketchTypes.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/authoritative/ocSketchWire.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`

#### Preferred Phase 4 implementation shape:
- repoint the worker runtime imports first
- leave the forwarding shim in place for any remaining non-worker callers until a later cleanup chooses to remove it
- stop once worker runtime files no longer depend on old app-side paths for the moved shared contract symbols

### Implementation spec:
1. Re-read the `Phase 3` shared-contract move baseline.
2. Repoint worker runtime imports from:
   - `src/app/spaghetti/contracts/geometryRequest.ts` -> `src/shared/geometryRequest.ts`
   - `src/app/spaghetti/features/featureTypes.ts` -> `src/shared/sketchTypes.ts` for symbols now owned there
3. Keep the pass focused on runtime/shared-boundary imports in:
   - `src/worker/authoritative/`
   - `src/worker/cad/`
4. Do not widen into replacing the `runtimeTessellation.ts` helper seam in this pass unless a trivial compile fix forces a tiny local adjustment.
5. Stop once worker runtime imports tell the same shared-boundary story as the moved contract truth from `Phase 3`.

#### Implementation stop rule:
- `Phase 4` is ready to implement once the next pass can repoint the moved contract imports to their real shared owners without widening into helper replacement or broad test cleanup
- do not treat the app-owned `runtimeTessellation.ts` seam as part of the shared-contract import repoint unless a later dedicated follow-on says so

#### Checklist:
- [x] re-read the `Phase 3` moved-contract baseline
- [x] repoint worker runtime imports from the app-side geometry-request shim to `src/shared/geometryRequest.ts`
- [x] repoint worker runtime imports from `featureTypes.ts` to `src/shared/sketchTypes.ts` where appropriate
- [x] keep the `runtimeTessellation.ts` seam out of scope unless a tiny local compile fix is required
- [x] stop before broad test or helper cleanup

#### Target repoints:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/authoritative/ocSketchWire.ts`
- `src/worker/cad/cadKernelAdapter.ts`
- `src/worker/cad/featureStackRuntime.ts`

#### Explicit non-targets:
- broad worker test import cleanup
- removal of the app-side forwarding shim in the same pass
- replacement or move of `src/app/spaghetti/compiler/runtimeTessellation.ts`

#### Done shape:
- worker runtime files import moved contract symbols from the real shared owners
- the worker/app shared-boundary story is now honest at both the file-home and import-path levels for the moved runtime contract seam
- later cleanup can treat the remaining app-owned helper seams as separate work instead of boundary confusion

#### Recommended file changes:
- edit worker runtime files under `src/worker/authoritative/` and `src/worker/cad/`
- optionally touch a very small number of related app-side imports only if the compile graph requires it

#### Verification:
- run a targeted repo search confirming worker runtime files no longer import:
  - `src/app/spaghetti/contracts/geometryRequest.ts`
  - `src/app/spaghetti/features/featureTypes.ts`
    for symbols that now live in `src/shared/geometryRequest.ts` or `src/shared/sketchTypes.ts`
- confirm the `runtimeTessellation.ts` import remains explicitly app-owned after the pass unless a tiny documented local adjustment was required
- run build verification

#### Import Repoint Baseline

This is the completed runtime-import baseline later cleanup passes should cite directly when checking whether worker files are reading the moved shared contract truth from the right homes.

##### Worker runtime imports now point at the real shared owners

- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - now imports geometry-request contract types from `src/shared/geometryRequest.ts`
- `src/worker/authoritative/ocSketchWire.ts`
  - now imports `GeometryRequestSketchProfile` from `src/shared/geometryRequest.ts`
  - now imports `Segment2` from `src/shared/sketchTypes.ts`
- `src/worker/cad/cadKernelAdapter.ts`
  - now imports `SketchPlaneTransform` from `src/shared/sketchTypes.ts`
- `src/worker/cad/featureStackRuntime.ts`
  - now imports geometry-request contract types from `src/shared/geometryRequest.ts`
  - now imports `createDefaultSketchPlaneTransform` and `SketchPlaneTransform` from `src/shared/sketchTypes.ts`

##### Explicit non-moves that stayed honest in this pass

- `src/app/spaghetti/compiler/runtimeTessellation.ts`
  - remains app-owned and still stays outside the shared-contract boundary
- `src/worker/cad/featureStackRuntime.test.ts`
  - still contains one test-only import from `src/app/spaghetti/features/featureTypes.ts`
  - intentionally left out of this pass because `Phase 4` only owned runtime import repointing, not broad worker test cleanup
- `src/app/spaghetti/contracts/geometryRequest.ts`
  - remains available as the temporary forwarding shim created in `Phase 3`
  - intentionally not removed in the same pass as the runtime repoint

##### Resulting boundary state

- the moved shared contract truth now matches the main worker runtime import paths instead of only the file-home story
- worker runtime files no longer rely on the old app-side geometry-request shim or `featureTypes.ts` re-export surface for the moved shared contract symbols
- the remaining app-owned helper and test seams are now clearer follow-on work instead of boundary ambiguity

### Acceptance Checks

- worker-facing contracts have one explicit home
- worker files no longer depend on arbitrary app internals for shared protocol
- boundary rules in docs and code stop contradicting each other

### Likely Related Files

- `src/shared/`
- `src/app/protocol.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/contracts/`
- `src/worker/`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`

### Success Read

This phase succeeds when:
- the worker/app contract seam is obvious from the folder layout
- docs, lint, and code tell the same story about what is shared
- later worker or graph cleanup no longer has to fight boundary ambiguity first

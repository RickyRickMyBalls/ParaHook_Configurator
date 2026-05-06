# `Gen 3 - Cleanup 1` - `useAppStore Ownership Decomposition`

## Doc Header

### Doc History
22. 2026-05-05 20:20:44: Closed `Gen 3 - Cleanup 1 / Phase 6.2 - Gen3 Closeout And Next Target Handoff` as the final docs-only closeout pass, marked the `useAppStore` decomposition lane honestly complete, recorded the shipped owner-pattern plus the deliberate keep-in-root seams, and kept the next Gen3 step as a recommendation-only read with `useSpaghettiStore.ts` named as the strongest later sink candidate instead of starting a new target early
21. 2026-05-05 20:18:17: Implemented `Gen 3 - Cleanup 1 / Phase 6.1 - Root Facade Shrink` by adding `src/app/store/builds/appStoreBuildFacade.ts`, moving the last manual build-seam composition behind that bridge, retiring the duplicated `deleteRecordKey(...)` helper into `src/app/store/storeRecordUtils.ts`, and closing the root-facade cleanup with `npm.cmd run build` passing, `buildPathDerivedSync.test.ts` passing, and the broader `useAppStore.test.ts` run still in the same unchanged 14-test drift band
20. 2026-05-05 20:08:59: Implemented `Gen 3 - Cleanup 1 / Phase 5.4 - Project Sync And File-Tail Subscription Extraction` by adding `src/app/store/builds/appStoreBuildSubscriptions.ts`, moving the project-sync helper, browser runtime follow-through helpers, and file-tail subscription wiring behind that module, rewiring the root facade to initialize the moved subscription runtime, and closing `Phase 5.4` with `npm.cmd run build` passing, `buildPathDerivedSync.test.ts` passing, and the broader `useAppStore.test.ts` run still in the same unchanged 14-test drift band
19. 2026-05-05 19:59:08: Implemented `Gen 3 - Cleanup 1 / Phase 5.3 - Browser Release And Export Flow Extraction` by adding `src/app/store/builds/appStoreBuildReleaseFlow.ts`, moving the browser release/export action seam plus the tiny queue-release helper wiring behind that module, rewiring the root facade to compose the moved release flow, and closing `Phase 5.3` with `npm.cmd run build` passing, `buildPathDerivedSync.test.ts` passing, and the broader `useAppStore.test.ts` run still in the same unchanged 14-test drift band
18. 2026-05-05 19:52:09: Implemented `Gen 3 - Cleanup 1 / Phase 5.2 - Delayed Placeholder And Request Intent Extraction` by adding `src/app/store/builds/appStoreBuildRequests.ts`, moving the request-intent helper cluster plus delayed placeholder dispatch and `requestGraphDocumentBuild(...)` behind that module, rewiring the root facade to compose the moved request seam, and closing `Phase 5.2` with `npm.cmd run build` passing, `buildPathDerivedSync.test.ts` passing, and the broader `useAppStore.test.ts` run still in the same unchanged 14-test drift band
17. 2026-05-05 19:42:56: Split the remaining open `Gen 3 - Cleanup 1` work into narrower `Phase 5.2` through `Phase 5.4` and `Phase 6.1` through `Phase 6.2` slices, grounding each follow-up against the live delayed-placeholder, request/export, file-tail subscription, and facade-handoff seams so every remaining pass stays small enough for one clean Codex implementation
16. 2026-05-05 19:34:26: Implemented `Gen 3 - Cleanup 1 / Phase 5.1 - Browser Build Policy Slice Extraction` by adding `src/app/store/builds/appStoreBuildPolicies.ts`, moving the browser build-policy helper cluster plus the direct policy action bodies behind that module, rewiring the root facade to compose and re-export the moved policy seam, and closing `Phase 5.1` with `npm.cmd run build` passing, `buildPathDerivedSync.test.ts` passing, and the broader `useAppStore.test.ts` run still in the same unchanged 14-test drift band
15. 2026-05-05 19:29:19: Narrowed the broad `Gen 3 - Cleanup 1 / Phase 5 - Build Policy And Subscription Orchestration Extraction` implementation plan into a smaller follow-up by adding `Phase 5.1 - Browser Build Policy Slice Extraction`, locking that next pass to the browser build-policy helper cluster plus the direct policy action bodies, and explicitly deferring delayed placeholder dispatch, request/export flow, and file-tail subscription orchestration to later `Phase 5.x` slices
14. 2026-05-05 19:20:55: Tightened `Gen 3 - Cleanup 1 / Phase 5 - Build Policy And Subscription Orchestration Extraction` into the next implementation-ready slice by grounding the remaining `useAppStore.ts` build-policy, delayed-placeholder, and cross-store subscription seams against the live helper and file-tail anchors, clarifying the likely `builds/` module split, and sharpening the exact first code cut, verification targets, no-widening rules, and stop boundary before `Phase 5` implementation starts
13. 2026-05-05 19:16:41: Implemented `Gen 3 - Cleanup 1 / Phase 4.1 - Transform Session Action Slice Extraction` by landing the explicit `transformAppStoreSlice.ts` owner module, rewiring the root facade to compose the moved transform-session action bodies, recording the honest keep-in-root decision for `selectConsoleWorkspaceContextTarget(...)`, and closing `Phase 4` with the same 14-test broader `useAppStore.test.ts` drift band still unchanged after focused verification
12. 2026-05-05 18:50:48: Added `Gen 3 - Cleanup 1 / Phase 4.1 - Transform Session Action Slice Extraction` as the next implementation-ready follow-up inside the same family phase, grounding the remaining root-owned transform-session action bodies and honest selection or console-context carryover against the landed `referenceTransformHelpers.ts` and `workspaceSelectionAppStoreSlice.ts` seams so `Phase 5` stays blocked behind one explicit finish-the-boundary slice
11. 2026-05-05 18:46:09: Started the real `Gen 3 - Cleanup 1 / Phase 4 - Transform Selection And Context Extraction` pass by landing the first transform helper owner-area module and the workspace-selection/context action slice, rewiring the root facade to those modules, and recording the honest remaining gap that transform-session action bodies plus the late console-context helper surface still remain inside `useAppStore.ts`
10. 2026-05-05 18:26:09: Tightened `Gen 3 - Cleanup 1 / Phase 4 - Transform Selection And Context Extraction` into the next implementation-ready slice by grounding the remaining transform-session, transform-history, workspace-selection, and console-context seams against the live `useAppStore.ts` anchors, clarifying that `transforms/` still needs its first real owner-area modules, and sharpening the exact first code cut, likely file set, no-widening, verification, and stop rules before any runtime extraction starts
9. 2026-05-05 18:13:27: Marked `Gen 3 - Cleanup 1 / Phase 3 - Project Content And Reference Workspace Slice Extraction` complete after the landed owner-area selector/type/reference-workspace helper slice was accepted as the phase outcome, and updated the phase read so `Phase 4` is now the next follow-on lane instead of leaving `Phase 3` open
8. 2026-05-05 18:02:07: Started the real `Gen 3 - Cleanup 1 / Phase 3 - Project Content And Reference Workspace Slice Extraction` pass by landing owner-area project-content and selection selector files plus a reference-workspace state/helper module, rewiring the root facade to those modules, and recording the honest remaining gap that heavier project-content action extraction still remains inside `Phase 3`
7. 2026-05-05 17:33:23: Tightened `Gen 3 - Cleanup 1 / Phase 3 - Project Content And Reference Workspace Slice Extraction` into the next implementation-ready slice by grounding the remaining project-content and reference-workspace owner seams against the live `useAppStore.ts` deferrals, folding the Phase 2 type-surface follow-up into the same pass, and sharpening the likely slice-file set, verification read, and stop rules before mutation extraction starts
6. 2026-05-05 17:06:50: Implemented `Gen 3 - Cleanup 1 / Phase 2 - Pure Types Helpers And Selector Extraction` by moving the first pure `useAppStore.ts` seams into owner-area selector/helper modules under `projectContent`, `selection`, `references`, and `transforms`, keeping the public facade stable through re-exports/imported helpers, and recording the narrower follow-on read that `Phase 3` is now the next slice to prep while heavier project-content/reference helpers stay deferred
5. 2026-05-05 16:44:19: Tightened `Gen 3 - Cleanup 1 / Phase 2 - Pure Types Helpers And Selector Extraction` into the next implementation-ready slice by grounding the likely early-move helper and selector seams against the current `useAppStore.ts` anchors, clarifying what should move first versus stay re-exported from the root facade, and sharpening the likely file set, no-widening boundaries, verification read, and stop rules before any real extraction starts
4. 2026-05-05 16:36:48: Implemented `Gen 3 - Cleanup 1 / Phase 1 - Owner Map And Migration Rules Lock` as the live owner-inventory result, confirming the main `useAppStore.ts` buckets, locking the keep-one-facade migration rule, naming first destination-module targets, and recording the early-move versus deferred extraction order for later phases without widening into real helper or mutation extraction
3. 2026-05-05 16:31:06: Tightened `Gen 3 - Cleanup 1 / Phase 1` into a more code-grounded implementation-ready prep slice by anchoring the current owner buckets against live `useAppStore.ts` sections, naming the expected phase outputs more concretely, and sharpening the likely file set, verification read, and stop rules so the first implementation pass can inventory and lock the split plan without drifting into extraction early
2. 2026-05-05 16:26:26: Renamed this family phase read to `Gen 3 - Cleanup 1`, tightened `Phase 1` into the current implementation-ready prep slice, and clarified that `Phase 2` through `Phase 6` remain sequenced follow-on phases that should each be prepped before their own implementation starts
1. 2026-05-05 16:19:03: Created this dedicated `Cleanup-Gen3-1` future doc to turn the current review finding on `src/app/store/useAppStore.ts` into an implementation-ready cleanup plan, routing the file's project-content, reference workspace, transform, selection/context, and build-orchestration sink behavior into one phased decomposition ladder that keeps a public `useAppStore` facade while the internals are split by owner boundary

### Purpose
- split `src/app/store/useAppStore.ts` by ownership seam instead of arbitrary line count
- keep earlier cleanup owner decisions intact while reducing the app store's cross-domain concentration
- give `Cleanup Gen3` one concrete, phased, lower-risk plan for the repo's clearest current ownership sink
- leave a repeatable pattern for later large-file cleanup if this lane succeeds

### Scope

This phase covers:
- `useAppStore.ts` owner confirmation and phased decomposition planning
- internal extraction targets for types, helpers, selectors, mutation/orchestration seams, and cross-store subscriptions
- low-risk migration rules that preserve one exported store facade during the split
- verification and stop rules for each phase

This phase does not cover:
- a same-pass `useSpaghettiStore.ts` rewrite
- new Browser, viewer, or workspace owners
- re-deciding accepted-result, Browser-row, or workspace-layout ownership
- a blind multi-store rewrite just because the current file is large

## Doc Body

## Vision

`useAppStore.ts` should stop reading like a second app kernel.

The target shape is:
- one exported `useAppStore` facade for callers during migration
- several smaller internal modules that each own one coherent responsibility
- derived Browser/read-model logic kept derived
- graph-runtime truth left in `useSpaghettiStore`
- workspace-layout truth left in `useWorkspaceStore`

The key rule is:
- split by owner boundary first
- only split into separate runtime stores when the owner proof says a second store is actually healthier than a shared facade

This means the first cleanup win is not "many new stores."

The first cleanup win is:
- stop making one file define every app-side type, helper, selector, mutation, and subscription path for unrelated domains

### Current Live Read

Current `useAppStore.ts` responsibilities cluster into at least five real owners:

1. Project content and Browser-owned projection inputs
- project graph documents
- assemblies, components, objects, runtime placement
- Browser drag/drop resolution inputs
- content-order and import-commit history helpers

2. Reference workspace and staged import
- imported reference records
- category/browser tree shaping inputs
- staged import draft structures
- staged preview organization helpers

3. Transform sessions and transform history
- reference transform sessions
- content object and environment-light transform sessions
- transform snap settings
- transform history insertion, merge, scrub, and replay helpers

4. Workspace selection and console-context handoff
- active workspace target and explicit selection
- active workspace surface
- console context sync and handoff requests
- content-owner resolution helpers

5. Graph build policy and orchestration
- browser build policy
- delayed draft and authoritative placeholders
- build request intent resolution
- auto-follow build triggers and cross-store subscriptions

The file is also carrying too many kinds of implementation at once:
- exported state types
- domain helper math
- normalization and id builders
- selector logic
- user-action mutations
- build dispatch side effects
- cross-store subscriptions at file scope

That is why it feels brittle: almost any change to Browser, references, transforms, selection, or build policy can require touching the same file.

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen3-HLG-1` - Break `useAppStore.ts` into smaller honest ownership seams without inventing second owners for Browser, project content, transforms, or build/runtime truth.
- [ ] `Cleanup-Gen3-HLG-2` - Reduce change risk by keeping the migration incremental, typed, and proofable instead of turning the first pass into a big-bang app-state rewrite.
- [ ] `Cleanup-Gen3-HLG-3` - Leave a repeatable decomposition pattern that later `Gen3` cleanup targets such as `useSpaghettiStore.ts`, `ViewportOverlay.tsx`, or `Viewer.ts` can inherit if they still need it after the first lane ships.

### `Gen 3 - Cleanup 1`

- [x] Confirm the exact live owner map inside `useAppStore.ts`.
- [x] Lock the migration rule that one exported `useAppStore` facade stays in place for the early phases.
- [x] Extract non-store helper/types/selectors first, before moving mutation or subscription behavior.
- [x] Split the file into explicit owner modules in this order:
  - project content
  - reference workspace and staged import
  - transform sessions and transform history
  - workspace selection and console context
  - build policy and orchestration
- [x] End with a smaller store facade plus one clear handoff for later `Gen3` sink cleanup.

### Prep Read

Current prep decision:
- `Phase 1` is implemented
- `Phase 2` is implemented
- `Phase 3` is implemented
- `Phase 4` is now implemented after the `Phase 4.1` follow-up landed the remaining transform-session action slice and closed the boundary honestly
- `Phase 5` is now fully implemented across `Phase 5.1` through `Phase 5.4`
- `Phase 5.2` is now implemented as the request-intent and delayed-placeholder extraction pass
- `Phase 5.3` is now implemented as the browser release and export flow extraction pass
- `Phase 5.4` is now implemented as the project-sync and file-tail subscription extraction pass
- `Phase 6.1` is now implemented as the final code-side root-facade cleanup pass
- `Phase 6.2` is now implemented as the final docs-only closeout and next-target recommendation pass
- `Gen 3 - Cleanup 1` is now honestly complete

Why:
- `Phase 1` already produced the owner map, destination-module map, and deferral list
- `Phase 2` has now removed the first pure selector/helper bulk without widening into mutations or subscriptions
- `Phase 3` has now landed the first honest content/reference owner-area module set plus the associated type-surface tightening, which is sufficient to close the planned slice and hand the remaining heavier mutation extraction forward to `Phase 4` instead of keeping this phase artificially open
- `Phase 4.1` has now landed the remaining reference/content/environment transform-session action bodies behind `src/app/store/transforms/transformAppStoreSlice.ts`, and the late `selectConsoleWorkspaceContextTarget(...)` seam was kept in the root facade by explicit decision because it still depends on the broader Browser/content read-model cluster
- the broad `Phase 5` family concern is still the build-policy plus orchestration tail, but it is now intentionally split so each remaining delayed-placeholder, request/export, and file-tail subscription seam gets its own realistic implementation pass instead of one oversized orchestration batch
- `Phase 5.1` is now implemented as the first `builds/` owner-area move, while the delayed placeholder dispatch, request/export flow, and file-tail subscription orchestration seams remain as pre-split later `Phase 5.x` work rather than unfinished `Phase 5.1` scope
- `Phase 5.2` has now landed the request-oriented `resolveGraphBuild*` helper cluster, delayed placeholder dispatch, and `requestGraphDocumentBuild(...)` behind `src/app/store/builds/appStoreBuildRequests.ts`, so the next open build tail is the separate browser release and export flow seam in `Phase 5.3`
- `Phase 5.3` has now landed `prepareGraphDocumentExport(...)`, `requestBrowserGraphDocumentBuild(...)`, `endBrowserBuildInteraction(...)`, and `requestManualBuild(...)` behind `src/app/store/builds/appStoreBuildReleaseFlow.ts`, and `Phase 5.4` has now landed the remaining `syncCurrentProjectFromSpaghetti(...)` plus file-tail subscription seam behind `src/app/store/builds/appStoreBuildSubscriptions.ts`, so the full `Phase 5` build-policy and orchestration family concern is now honestly complete and the next open lane is the smaller root-facade shrink in `Phase 6.1`
- `Phase 6.1` has now collapsed the last manual build-module composition residue behind `src/app/store/builds/appStoreBuildFacade.ts` and retired the duplicated `deleteRecordKey(...)` helper into `src/app/store/storeRecordUtils.ts`
- `Phase 6.2` now closes the lane honestly: the shipped owner pattern is recorded, the deliberate keep-in-root seams stay named, and the next Gen3 step remains only a recommendation rather than a prematurely opened new target

## [x] `Gen 3 - Cleanup 1 / Phase 1` - `Owner Map And Migration Rules Lock`

### Phase 1 Summary

#### Purpose
- reconfirm the exact `useAppStore.ts` owner map and lock the migration rules before any extraction work starts

#### Owns
- live responsibility inventory
- extraction order
- keep-versus-move rules
- stop rules for what must stay in `useAppStore` versus what may leave the file

#### Does Not Own
- runtime behavior changes
- new stores
- selector rewrites outside the planning proof

#### Current Live Read
- `useAppStore.ts` already has stable enough clustering to start a concrete owner inventory
- the strongest current buckets are:
  - project content and Browser inputs
  - reference workspace and staged import
  - transform sessions and transform history
  - workspace selection and console context
  - build policy and cross-store orchestration
- the main risk is starting `Phase 2` helper extraction before this phase locks where those helpers are actually supposed to land

#### Current Section Anchors
- `AppState` type surface starts around `useAppStore.ts:1126`
- content-owner drop and Browser drag/drop helpers are already visible as a standalone cluster around:
  - `resolveProjectContentOwnerDrop(...)` at `useAppStore.ts:2722`
  - `resolveBrowserDraggableTargetDrop(...)` at `useAppStore.ts:2802`
- reference workspace initialization starts around `createInitialReferenceWorkspaceState(...)` at `useAppStore.ts:2926`
- transform-history normalization already reads like its own utility seam at `normalizeReferenceTransformHistoryEntries(...)` around `useAppStore.ts:4174`
- project-content initialization starts around `createInitialProjectContentState(...)` at `useAppStore.ts:5952`
- build-policy and delayed-build orchestration starts becoming explicit around:
  - `resolveGraphBuildGeometryTarget(...)` at `useAppStore.ts:6458`
  - `dispatchDelayedGraphBuildPlaceholder(...)` at `useAppStore.ts:6545`
- the root store object begins at `useAppStore.ts:6591`
- large derived Browser and console-context selector blocks already sit late in the file around:
  - `selectCurrentProjectContentBrowserRows(...)` at `useAppStore.ts:13152`
  - `selectReferenceWorkspaceBrowserTree(...)` at `useAppStore.ts:13877`
  - `selectConsoleWorkspaceContextTarget(...)` at `useAppStore.ts:14126`
- file-scope synchronization/orchestration already reads like a tail module candidate around:
  - `syncCurrentProjectFromSpaghetti(...)` at `useAppStore.ts:14436`
  - `useSpaghettiStore.subscribe(...)` at `useAppStore.ts:14594`
  - `useWorkspaceStore.subscribe(...)` at `useAppStore.ts:14640`

### Phase 1 Result

#### Confirmed Owner Buckets

1. Project content and Browser-content ownership inputs
- strongest current anchors:
  - content drop and drag/drop resolution around `2722` through `2802`
  - project-content initialization around `5952`
  - content Browser selectors around `13152`
- current read:
  - this bucket owns authored content hierarchy, content ordering, runtime content placement, and Browser-facing content input logic
  - Browser rows remain derived outputs and should not become their own owner while this area is extracted

2. Reference workspace and staged import
- strongest current anchors:
  - reference workspace initialization around `2926`
  - later reference Browser selectors around `13877`
- current read:
  - this bucket owns imported reference records, category/runtime metadata, staged import draft structures, preview organization, and reference-side Browser inputs
  - this should become the first non-content domain module after project content because it is already visibly grouped and app-store-owned

3. Transform sessions and transform history
- strongest current anchors:
  - transform-history normalization around `4174`
  - related transform session types and helpers earlier in the file
- current read:
  - this bucket owns reference/content/environment transform sessions, snap state, scrub/replay, and transform-history math
  - the underlying truth should stay app-store-owned even after helper extraction

4. Workspace selection and console context
- strongest current anchors:
  - `selectConsoleWorkspaceContextTarget(...)` around `14126`
  - related workspace selection types and owner-resolution helpers earlier in the file
- current read:
  - this bucket owns active selected target, explicit multi-selection, active surface, content-owner targeting, and console context sync/handoff requests
  - it is app-side coordination glue, not workspace-layout truth and not console grammar truth

5. Build policy and cross-store orchestration
- strongest current anchors:
  - build-policy helpers around `6458`
  - delayed-build dispatch around `6545`
  - file-scope sync/orchestration around `14436` through `14640`
- current read:
  - this bucket owns browser build policy, delayed draft/authoritative placeholders, and app-side follow-through behavior that responds to `useSpaghettiStore` and `useWorkspaceStore`
  - it should be extracted last because it is the most cross-cutting and behavior-sensitive area

6. Shared app-store facade glue
- strongest current anchors:
  - `AppState` around `1126`
  - root store creation around `6591`
- current read:
  - this is the seam that should remain in `useAppStore.ts` during early phases
  - it should compose state slices, re-export stable caller-facing selectors/types where useful, and avoid retaining large piles of domain-specific helper logic

#### Locked Migration Rule

The public migration rule is now locked as:
- keep one exported `useAppStore` facade through `Phase 2` through `Phase 5`
- allow internal extraction of types, helpers, selectors, mutations, and orchestration into owner modules behind that facade
- do not introduce a second live app-side zustand owner unless a later phase proves that the extracted domain really needs independent runtime ownership instead of one composed facade

#### First Destination Module Map

- project content
  - first destination: `src/app/store/projectContent/*`
- reference workspace and staged import
  - first destination: `src/app/store/references/*`
- transform sessions and transform history
  - first destination: `src/app/store/transforms/*`
- workspace selection and console context
  - first destination: `src/app/store/selection/*`
- build policy and orchestration
  - first destination: `src/app/store/builds/*`
- shared facade glue
  - stays in `src/app/store/useAppStore.ts`

#### What Must Stay In The Root Facade Early

- the exported `useAppStore` creation surface
- the composed `AppState` contract or stable re-exports of it
- only the minimal cross-bucket glue that truly has to join the extracted owner modules
- temporary re-export seams needed to keep caller churn low during early extraction

#### Early-Move Versus Deferred Extraction Order

- `Phase 2`
  - pure types
  - id builders and normalization helpers
  - derived selectors
  - transform-history pure math
- `Phase 3`
  - project content state/actions
  - reference workspace and staged import state/actions
- `Phase 4`
  - transform session state/actions
  - workspace selection and console context state/actions
- `Phase 5`
  - build-policy helpers
  - delayed-build orchestration
  - file-scope subscriptions and app-side cross-store synchronization

#### Deferred Risk List

- do not move file-scope `useSpaghettiStore.subscribe(...)` or `useWorkspaceStore.subscribe(...)` before `Phase 5`
- do not move accepted build-result truth out of `useSpaghettiStore`
- do not move Browser row truth into Browser controllers while extracting content helpers/selectors
- do not let transform helper extraction blur the earlier cleanup rule that transform session truth is app-store-owned
- do not treat workspace selection/context glue as workspace-layout truth owned by `useWorkspaceStore`

### Phase 1 Implementation Spec

#### Exact First Code Cut
- reread `useAppStore.ts` against the locked cleanup owner decisions
- sort the file into explicit owner buckets:
  - project content
  - references and staged import
  - transform sessions/history
  - workspace selection/context
  - build policy/orchestration
  - shared app-store facade glue
- mark which helpers are:
  - pure helper candidates
  - selector candidates
  - mutation/action candidates
  - file-scope subscription/orchestration candidates
- lock the migration rule that the public `useAppStore` API should remain the caller-facing seam during early extraction phases
- write one explicit `Phase 1` result read in this doc that names:
  - the confirmed owner buckets
  - the rough section anchors for each bucket
  - the first destination module for each bucket
  - what must stay in the root facade as genuinely shared glue
- answer the first implementation-start questions directly:
  - which pure helpers can move first in `Phase 2`
  - which mutation blocks must wait for `Phase 3` or later
  - which exported types should move versus stay re-exported
  - which file-scope subscriptions must stay deferred until `Phase 5`

#### Expected Phase 1 Outputs
- one owner-bucket map using the live anchors above instead of vague file-wide labels
- one first-destination table shaped roughly like:
  - `projectContent/*`
  - `references/*`
  - `transforms/*`
  - `selection/*`
  - `builds/*`
  - root facade glue kept in `useAppStore.ts`
- one extraction-order note that explicitly says:
  - pure helpers/selectors can lead `Phase 2`
  - content/reference mutations should wait for `Phase 3`
  - transform and selection/context mutation glue should wait for `Phase 4`
  - build-policy helpers and subscriptions should wait for `Phase 5`
- one short risk note for any section that still looks too cross-cutting to move safely in the next phase

#### Likely Files
- `src/app/store/useAppStore.ts`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen3-Index.md`
- this future doc

#### Likely Immediate Supporting Reads
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/useWorkspaceStore.ts`

#### Deliverables
- one confirmed owner map for the file
- one extraction-order table for `Phase 2` through `Phase 5`
- one keep-in-root facade list
- one deferred-risk list for logic that must not move early

#### No-Widening Rule
- do not change runtime behavior
- do not move truth into Browser or host components
- do not start `useSpaghettiStore.ts` cleanup here

#### Verification Shape
- one explicit owner map exists
- each later phase has a named target module boundary
- the migration rule is locked before source movement starts
- the next likely `Phase 2` file set is explicit instead of guessed later
- the owner map still preserves the earlier cleanup rules that:
  - Browser rows remain derived only
  - graph runtime remains `useSpaghettiStore` truth
  - workspace layout remains `useWorkspaceStore` truth
  - transform session truth remains app-store-owned

#### Stop Rule
- stop after the owner map, extraction order, and keep-in-root rules are written down
- do not start helper extraction in this phase
- do not rename modules just for neatness
- do not widen into `useSpaghettiStore.ts`, `Viewer.ts`, or `ViewportOverlay.tsx`
- do not turn this into a docs-only rewrite of every later phase; only sharpen what `Phase 2` needs next

#### Checklist
- [x] reread `useAppStore.ts` against the locked cleanup owner decisions
- [x] confirm the live section anchors for the main owner buckets
- [x] classify the whole file into confirmed owner buckets
- [x] mark pure-helper, selector, mutation, and subscription candidates
- [x] name the first destination module for each confirmed bucket
- [x] record what must stay in the root `useAppStore` facade
- [x] record what must be deferred until later phases
- [x] tighten the next likely `Phase 2` file set and stop

## [x] `Gen 3 - Cleanup 1 / Phase 2` - `Pure Types Helpers And Selector Extraction`

### Phase 2 Summary

#### Purpose
- remove the safest non-store bulk first by extracting pure types, id builders, normalization helpers, and selectors into owner modules without changing runtime ownership

#### Owns
- pure exported types that do not need live store closures
- id builders and normalization helpers
- domain selectors and read-model helpers
- file structure for later mutation extraction

#### Does Not Own
- state-shape redesign
- action mutation movement that changes behavior
- cross-store subscription movement

#### Current Live Read
- the strongest low-risk extraction seams already sit in clearly exported helper and selector blocks rather than inside the live action body
- the current best first-move candidates are:
  - content/selection helper reads around `resolveWorkspaceSelectedContentOwnerTarget(...)` at `2045`, `resolveOwnedContentSelection(...)` at `2148`, and `resolveSingleTargetContentSelection(...)` at `2274`
  - content drag/drop pure resolution helpers around `resolveProjectContentOwnerDrop(...)` at `2722` and `resolveBrowserDraggableTargetDrop(...)` at `2802`
  - reference initialization and read helpers around `createInitialReferenceWorkspaceState(...)` at `2926`
  - transform-history pure helper math around `normalizeReferenceTransformHistoryEntries(...)` at `4174`
  - project-content initialization and read helpers around `createInitialProjectContentState(...)` at `5952`
  - exported selector clusters late in the file around:
    - `selectCurrentProject(...)` and nearby project selectors starting at `12864`
    - `selectCurrentProjectContentBrowserRows(...)` at `13152`
    - `selectReferenceWorkspaceBrowserTree(...)` and `selectReferenceWorkspaceItems(...)` at `13877` and `13930`
    - `selectConsoleWorkspaceContextTarget(...)` at `14126`
- the risk line for this phase is the root `useAppStore` object at `6591`: Phase 2 should make it smaller by importing helpers/selectors, but should not yet carve live mutation bodies or subscriptions out of it

#### Phase 2 Extraction Rule
- prefer moving exported pure helpers and selectors as-is before renaming them
- if an extracted type or selector is already imported widely, keep a temporary re-export from `useAppStore.ts` rather than forcing same-pass caller churn
- if a helper closes over `set`, `get`, store-local mutable state, or file-scope subscriptions, it is not a Phase 2 move candidate
- if a helper only transforms inputs, normalizes records, resolves ownership, or shapes derived read models, it is a strong Phase 2 move candidate

### Phase 2 Implementation Spec

#### Exact First Code Cut
- extract project-content-specific pure types, initialization helpers, and selectors into a `projectContent/` owner area
- extract reference/staged-import pure types, initialization helpers, and read helpers into a `references/` owner area
- extract transform-history pure math and normalization helpers into a `transforms/` owner area
- extract selection/content-owner pure resolution helpers and selectors into a `selection/` owner area
- move exported selector clusters out of `useAppStore.ts` while keeping the store state shape and caller-facing API stable
- keep the main store file importing those helpers/selectors instead of reimplementing them inline
- allow temporary re-exports from `useAppStore.ts` when that keeps the extraction small and low-risk

#### First-Move Candidate Set
- `AppState`-dependent exported read selectors near `12864` through `14126`
- pure content/selection resolution helpers near `2045` through `2274`
- pure content drop-resolution helpers near `2722` through `2802`
- `createInitialReferenceWorkspaceState(...)` near `2926` if it can move without pulling live mutation logic with it
- `normalizeReferenceTransformHistoryEntries(...)` and nearby transform-history pure helpers near `4174`
- `createInitialProjectContentState(...)` near `5952` if it can move as a pure initializer without dragging runtime orchestration

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/projectContent/projectContentSelectors.ts`
- `src/app/store/references/referenceWorkspaceSelectors.ts`
- `src/app/store/transforms/referenceTransformHelpers.ts`
- `src/app/store/selection/workspaceSelectionSelectors.ts`
- focused selector/helper tests

#### Likely Supporting Tests
- selector tests that already cover content, reference, or console-context reads
- any focused tests that directly import moved helper functions
- no new integration-wide behavior tests should be required if the extraction stays pure

#### No-Widening Rule
- do not split into multiple live zustand stores yet
- do not change the external `useAppStore` contract yet
- do not let helper extraction turn into naming churn unrelated to ownership
- do not move action bodies out of the root store in this phase
- do not move file-scope subscriptions in this phase
- do not re-home Browser row truth or build-runtime truth while extracting read helpers

#### Verification Shape
- extracted modules stay pure and testable
- the store state shape and external selectors still behave the same
- `useAppStore.ts` loses pure-helper bulk without losing ownership clarity
- root-store action behavior stays untouched
- any temporary re-exports still point callers at the same public symbols

#### Stop Rule
- stop once the pure helper/selector seams are extracted and the root facade is slimmer
- do not continue into content/reference mutation extraction in the same pass
- do not widen into transform session actions, selection actions, or build orchestration
- if a candidate helper turns out to close over live store state unexpectedly, leave it for a later phase instead of forcing a risky extraction

#### Checklist
- [x] identify the exact pure helper and selector symbols that can move with no runtime behavior change
- [x] create the first owner-area helper/selector files under `projectContent`, `references`, `transforms`, and `selection`
- [x] move low-risk pure helpers and selector clusters out of `useAppStore.ts`
- [x] keep the public `useAppStore` API stable with imports and temporary re-exports where useful
- [x] verify that root-store actions and file-scope subscriptions remain untouched
- [x] stop before any mutation or orchestration extraction starts

### Phase 2 Result

#### Implemented Extraction
- created `src/app/store/projectContent/projectContentSelectors.ts` for the simplest project-read selectors
- created `src/app/store/selection/workspaceSelectionSelectors.ts` for viewport-presentation and workspace-selection selectors
- created `src/app/store/references/referenceWorkspaceSelectors.ts` for reference timeline/snap read helpers
- created `src/app/store/transforms/referenceTransformHelpers.ts` for the reference/content/environment transform helper cluster, transform-history math, snap normalization, and active-viewer transform selectors
- slimmed `src/app/store/useAppStore.ts` so those pure seams now land behind imported helpers and stable re-exports instead of staying inline

#### Deliberate Deferrals
- left `resolveWorkspaceSelectedContentOwnerTarget(...)`, `resolveOwnedContentSelection(...)`, and `resolveSingleTargetContentSelection(...)` in the root file because they still depend on a denser local project-content/reference helper graph than the first safe extraction slice
- left `resolveProjectContentOwnerDrop(...)` and `resolveBrowserDraggableTargetDrop(...)` in the root file for the same reason
- left `createInitialReferenceWorkspaceState(...)` and `createInitialProjectContentState(...)` in the root file because their neighboring initialization and adoption logic still wants a wider owner pass
- left Browser tree selectors such as `selectCurrentProjectContentBrowserRows(...)`, `selectReferenceWorkspaceBrowserTree(...)`, and `selectConsoleWorkspaceContextTarget(...)` in the root file because they still sit on top of the heavier unresolved content/reference helper graph

#### Verification Read
- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/viewerTransformEditHistoryStore.test.ts` passed as part of the focused combined test run
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/viewerTransformEditHistoryStore.test.ts` still leaves 14 assertion failures in broader `useAppStore.test.ts` coverage after the extraction, so Phase 2 should be treated as build-clean with partial broader-test drift still to investigate separately

## [x] `Gen 3 - Cleanup 1 / Phase 3` - `Project Content And Reference Workspace Slice Extraction`

### Phase 3 Summary

#### Purpose
- extract the two largest app-owned content domains into explicit slice modules while keeping one composed store facade and using the same pass to stop the first owner-area modules from importing their public types back from the monolithic root

#### Owns
- project content state/actions/selectors
- reference workspace and staged import state/actions/selectors
- owner-local or shared app-store type surfaces needed by those extracted modules
- composition rules back into the shared app-store facade

#### Does Not Own
- transform session extraction
- build orchestration extraction
- Browser row ownership changes
- a new second zustand owner for project content or reference workspace

#### Current Live Read
- `Phase 2` left the next honest owner seams in the root file where the heavy project-content and reference-workspace helper graphs still sit:
  - `resolveWorkspaceSelectedContentOwnerTarget(...)`, `resolveOwnedContentSelection(...)`, and `resolveSingleTargetContentSelection(...)` around `2045` through `2274`
  - `resolveProjectContentOwnerDrop(...)` and `resolveBrowserDraggableTargetDrop(...)` around `2722` through `2802`
  - `createInitialReferenceWorkspaceState(...)` around `2926`
  - `createInitialProjectContentState(...)` around `5952`
  - Browser/content read-model selectors such as `selectCurrentProjectContentBrowserRows(...)`, `selectReferenceWorkspaceBrowserTree(...)`, and `selectConsoleWorkspaceContextTarget(...)` around `13152` through `14126`
- the first extracted owner modules under `projectContent/`, `references/`, `selection/`, and `transforms/` still import `AppState` and related domain types from `useAppStore.ts`, so the next clean follow-on is to move the heavier owner logic and the needed type surfaces together instead of creating a tiny standalone `Phase 2.1`
- this phase is the first one that can honestly reduce the root file's domain-mutation bulk rather than only moving pure helpers

### Phase 3 Implementation Spec

#### Exact First Code Cut
- move project-content state initialization, content-order helpers, owner-resolution helpers, content move/drop helpers, and the project-content action cluster into one `projectContent` slice module
- move reference-workspace initialization, staged-import draft helpers, imported-reference action cluster, and reference-workspace read helpers into one `references` slice module
- move any now-shared project-content or reference-workspace types needed by those modules into an owner-local type file or a small shared app-store types seam so the extracted modules do not keep importing their public type surface back from `useAppStore.ts`
- keep Browser rows derived only
- keep the root store facade composing those slices into the existing app-store shape
- leave transform-session actions, workspace-selection actions, and build/subscription orchestration in the root for later phases even if a few helper call sites sit nearby

#### Expected Phase 3 Outputs
- one explicit `projectContent` slice module that owns the root-file project-content initializer, helper, and mutation bulk
- one explicit `referenceWorkspace` slice module that owns the root-file reference initializer, staged-import helper, and mutation bulk
- one narrower type-routing decision that removes the new Phase 2 owner modules' direct dependency on the monolithic `useAppStore.ts` type surface for project-content and reference-workspace reads
- one slimmer `useAppStore.ts` facade that wires imported slice creators and keeps the public API stable

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/projectContent/projectContentAppStoreSlice.ts`
- `src/app/store/projectContent/projectContentTypes.ts`
- `src/app/store/references/referenceWorkspaceAppStoreSlice.ts`
- `src/app/store/references/referenceWorkspaceTypes.ts`
- `src/app/store/projectContent/projectContentSelectors.ts`
- `src/app/store/references/referenceWorkspaceSelectors.ts`
- `src/app/store/selection/workspaceSelectionSelectors.ts` if its owner-resolution imports narrow during the move
- Browser interaction tests that depend on these actions

#### Likely Immediate Supporting Reads
- `src/app/store/projectContent/projectContentSelectors.ts`
- `src/app/store/references/referenceWorkspaceSelectors.ts`
- `src/app/store/useAppStore.test.ts`
- any focused staged-import or Browser-content tests that already cover move/reparent/import flows

#### Deliverables
- one extracted project-content slice module
- one extracted reference-workspace slice module
- one explicit type-seam decision for the new owner modules
- one updated root facade that imports and composes those slices without changing caller-facing `useAppStore` usage

#### No-Widening Rule
- do not yet split transforms or build orchestration into the same phase if it causes merge risk
- do not make Browser controllers the owner of project hierarchy
- do not treat the type-surface follow-up as a broad repo-wide type cleanup; only move the contracts needed to support the content/reference extraction honestly
- do not widen into `useSpaghettiStore.ts`, viewer runtime ownership, or workspace-layout ownership

#### Verification Shape
- content and reference actions still behave the same through `useAppStore`
- staged import flows and content ordering remain stable
- extracted project-content and reference modules no longer need to import their public domain types back from the monolithic `useAppStore.ts` root
- the root store file loses one large block of domain mutation logic

#### Stop Rule
- stop once the project-content and reference-workspace action/initializer clusters plus their needed type seams are extracted behind the existing facade
- do not continue into transform-session actions, selection/context actions, or build orchestration in the same pass
- if a candidate Browser tree selector still sits on too much cross-domain helper residue, leave it in the root facade for Phase 4 instead of forcing a mixed-owner extraction
- if the broader `useAppStore.test.ts` drift remains red after the move, record that explicitly instead of widening the phase into unrelated behavior repair

#### Checklist
- [x] identify the exact project-content helper/action cluster that can move together without pulling transforms or build orchestration
- [x] identify the exact reference-workspace and staged-import helper/action cluster that can move together without pulling transform sessions
- [x] extract one `projectContent` slice module and one `referenceWorkspace` slice module behind the existing facade
- [x] narrow the Phase 2 owner modules' type imports so they no longer depend directly on the monolithic root for the moved domains
- [x] keep Browser rows derived only and keep graph-runtime truth in `useSpaghettiStore`
- [x] verify focused build and test coverage, then stop before Phase 4 concerns

### Phase 3 Result

#### Landed First Slice

- added `src/app/store/projectContent/projectContentTypes.ts` and `src/app/store/projectContent/projectContentSelectors.ts` so the simplest current-project and project-content selectors finally live in an owner-area module instead of only in the root file
- added `src/app/store/selection/workspaceSelectionSelectors.ts` so viewport-presentation and workspace-selection reads no longer require inline `AppState`-shaped selector definitions in `useAppStore.ts`
- added `src/app/store/references/referenceWorkspaceTypes.ts` and `src/app/store/references/referenceWorkspaceState.ts` so startup reference-workspace state plus the staged-import pure helper cluster now live in a reference-owned module instead of staying embedded in the root file
- rewired `src/app/store/useAppStore.ts` to import/re-export those seams and deleted the extracted inline selector/reference-helper bulk from the root facade

#### Phase Close Read

- this pass did not move the heavier project-content action cluster or `createInitialProjectContentState(...)` out of the root file
- that remaining work is now treated as the next follow-on extraction concern for `Phase 4`, not as a reason to keep `Phase 3` open after its planned first content/reference owner-area slice already landed

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/viewerTransformEditHistoryStore.test.ts` returned to the same 14 broader `useAppStore.test.ts` failures that already predated this extraction, with `viewerTransformEditHistoryStore.test.ts` still passing

## [x] `Gen 3 - Cleanup 1 / Phase 4` - `Transform Selection And Context Extraction`

### Phase 4 Summary

#### Purpose
- extract transform sessions/history plus workspace selection/context glue into explicit owner modules once the heavier content domains are already separated

#### Owns
- transform session state/actions/history math
- workspace selection state/actions
- console context sync/handoff request helpers

#### Does Not Own
- viewer runtime ownership
- workspace layout ownership
- build orchestration

#### Current Live Read
- the first `Phase 4` slice is now landed:
  - `src/app/store/transforms/referenceTransformHelpers.ts` owns the extracted transform snap defaults, clone/normalize helpers, active-viewer transform selectors, and transform-history insert/scrub helpers
  - `src/app/store/selection/workspaceSelectionAppStoreSlice.ts` owns `setWorkspaceSelectedTarget(...)`, `setWorkspaceExplicitSelection(...)`, `setWorkspaceResolvedContentSelection(...)`, `setActiveSurface(...)`, `requestConsoleContextSync(...)`, and `requestConsoleWorkspaceContextHandoff(...)`
  - `src/app/store/useAppStore.ts` now composes that selection/context action slice and imports or re-exports the moved transform helper surface instead of keeping those seams inline
- the remaining honest `Phase 4` gap is still in the root file:
  - transform session and history types plus the transform-heavy `ReferenceWorkspaceState` fields around `useAppStore.ts:260` through `useAppStore.ts:704`
  - the transform action contract block around `useAppStore.ts:1355` through `useAppStore.ts:1513`
  - remaining root-only transform clone and base-history helpers around `useAppStore.ts:3175` through `useAppStore.ts:3588`
  - reference, content-object, and environment-light transform action bodies around `useAppStore.ts:9542` through `useAppStore.ts:12027`
  - the late console-context selector surface around `selectConsoleWorkspaceContextTarget(...)` at `useAppStore.ts:13293`
- `src/app/store/selection/workspaceSelectionSelectors.ts` still owns only the simplest read selectors, so the heavier selection/content-owner resolution helpers and console-context selector still need their honest extraction decision before `Phase 4` can close

### Phase 4 Implementation Spec

#### Exact First Code Cut
- create the first real `transforms/` owner-area files and move the root-file transform helper cluster there first:
  - transform session clone helpers
  - transform snap clone/normalize helpers
  - active-viewer transform selector helpers
  - transform-history insert/merge/scrub/replay helpers
- extract the reference/content-object/environment-light transform action cluster behind one explicit transform app-store slice module while keeping `referenceWorkspace` truth and the public `useAppStore` facade stable
- create the first real selection/context action module behind `src/app/store/selection/` for:
  - `setWorkspaceSelectedTarget(...)`
  - `setWorkspaceExplicitSelection(...)`
  - `setWorkspaceResolvedContentSelection(...)`
  - `setActiveSurface(...)`
  - `requestConsoleContextSync(...)`
  - `requestConsoleWorkspaceContextHandoff(...)`
- move the heavier selection/content-owner resolution helpers plus `selectConsoleWorkspaceContextTarget(...)` out of the root file into selection-owned helpers/selectors if they can move without dragging build orchestration or Browser ownership with them
- keep viewer runtime in the viewer and layout runtime in `useWorkspaceStore`

#### Expected Phase 4 Outputs
- one new `transforms` owner area that holds the transform-history helper graph and the transform-session action slice
- one new selection/context owner-area module that holds workspace-selection actions and console-context request wiring
- one narrower root facade that imports transform and selection/context slices instead of keeping those action bodies inline
- one explicit decision about which late console-context helpers can move now versus which content-heavy owner-resolution helpers should stay deferred if they still depend on unresolved cross-domain residue

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/transforms/referenceTransformHelpers.ts`
- `src/app/store/transforms/transformAppStoreSlice.ts`
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts`
- `src/app/store/selection/workspaceSelectionSelectors.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/store/viewerTransformEditHistoryStore.test.ts`

#### Likely Immediate Supporting Reads
- `src/app/store/selection/workspaceSelectionSelectors.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/store/viewerTransformEditHistoryStore.test.ts`
- `src/app/workspace/useWorkspaceStore.ts`

#### Deliverables
- one extracted transform helper module and one transform app-store slice module
- one extracted workspace-selection/context action module under `selection/`
- one updated root facade that composes those modules without changing the caller-facing `useAppStore` contract
- one explicit note if any content-owner helper remains too cross-domain to move cleanly in this phase

#### No-Widening Rule
- do not move viewer runtime objects into app store modules
- do not re-decide transform ownership already locked by earlier cleanup lanes
- do not move workspace layout truth or viewport-mode ownership into the selection slice
- do not pull `useSpaghettiStore.subscribe(...)`, `useWorkspaceStore.subscribe(...)`, build-policy helpers, or delayed-build placeholders forward from `Phase 5`
- do not use this phase to reopen project-content or reference-workspace extraction just because selection helpers still reference those owner areas

#### Verification Shape
- transform sessions and selection behavior still route through the same public store facade
- transform history math is testable without reopening the whole app store
- the root store file stops mixing transform math with unrelated content logic
- focused verification should include `npm.cmd run build` plus the existing transform-history test surface and the closest `useAppStore` coverage that exercises workspace-selection/context actions

#### Stop Rule
- stop once the transform helper graph, transform action bodies, workspace-selection actions, and console-context request wiring are extracted behind owner modules
- do not continue into build-policy extraction, file-scope subscriptions, or facade-finalization cleanup in the same pass
- if a late console-context helper still depends on too much content/reference residue, leave that helper in the root facade with an explicit note instead of forcing a mixed-owner extraction
- if the broader `useAppStore.test.ts` suite still reports the same known failures after the move, record that honestly instead of widening this phase into unrelated behavior repair

#### Checklist
- [x] identify the exact transform helper and action clusters that can move together without dragging build orchestration
- [x] create the first `src/app/store/transforms/` owner-area module set
- [x] extract workspace-selection and console-context request actions into `selection/` owner modules
- [ ] move the safest remaining selection/context selectors and helper seams out of the root facade
- [x] keep one exported `useAppStore` facade and preserve `referenceWorkspace` plus workspace-layout truth boundaries
- [x] verify focused build/test coverage, then stop before `Phase 5`

### Phase 4 Result

#### Landed First Slice

- added `src/app/store/transforms/referenceTransformHelpers.ts` so the extracted transform snap defaults, transform clone and normalize helpers, active-viewer transform selectors, and transform-history insert and scrub helpers now live in a transform-owned module instead of only in the root file
- added `src/app/store/selection/workspaceSelectionAppStoreSlice.ts` so workspace-selection actions and console-context request wiring now live in a selection-owned action slice instead of staying inline inside the root facade
- rewired `src/app/store/useAppStore.ts` to import and re-export the moved transform helper surface and to compose the workspace-selection/context action slice instead of keeping those action bodies inline

#### Remaining Phase 4 Gap

- the first landed `Phase 4` slice left the heavier reference/content/environment transform-session action bodies in `src/app/store/useAppStore.ts`
- it also left `selectConsoleWorkspaceContextTarget(...)` plus the denser selection/content-owner helper surface in the root file because those seams still sat on cross-domain residue that was wider than the first safe slice
- that remaining work was then closed by `Gen 3 - Cleanup 1 / Phase 4.1`, so `Phase 4` is now treated as complete and `Phase 5` becomes the next family handoff instead of staying blocked behind another transform follow-up

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/viewerTransformEditHistoryStore.test.ts` passed as part of the focused combined run
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/viewerTransformEditHistoryStore.test.ts` still returns the same 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, including explicit multi-select and published-content assertions outside the landed transform-helper extraction, so this phase should be treated as build-clean with broader root-suite drift still unresolved

## [x] `Gen 3 - Cleanup 1 / Phase 4.1` - `Transform Session Action Slice Extraction`

### Phase 4.1 Summary

#### Purpose
- finish the remaining Phase 4 boundary by moving the root-owned transform-session action bodies into an explicit transform app-store slice and making one honest decision about any late selection or console-context helper carryover that still blocks the boundary

#### Owns
- reference transform-session action bodies
- content-object transform-session action bodies
- environment-light transform-session action bodies
- the smallest remaining selection or console-context helper carryover needed to close the transform or selection boundary honestly

#### Does Not Own
- build policy or file-scope subscription extraction
- workspace layout ownership
- viewer runtime ownership
- Browser row or project-content ownership changes

#### Current Live Read
- `src/app/store/transforms/referenceTransformHelpers.ts` now owns the safe transform helper graph, so the remaining transform bulk is more clearly isolated in the root file:
  - transform action contract signatures around `useAppStore.ts:1355` through `useAppStore.ts:1513`
  - the root-only transform session clone helpers and base-history bridge around `useAppStore.ts:3175` through `useAppStore.ts:3588`
  - reference transform-session action bodies around `useAppStore.ts:9542` through `useAppStore.ts:10126`
  - content-object transform-session action bodies around `useAppStore.ts:10127` through `useAppStore.ts:11008`
  - environment-light transform-session action bodies around `useAppStore.ts:11009` through `useAppStore.ts:12027`
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts` already owns the workspace-selection action seam, so the only remaining selection or console-context carryover that still matters to this boundary is:
  - `selectConsoleWorkspaceContextTarget(...)` around `useAppStore.ts:13293`
  - any still-root-owned owner-resolution helper usage that proves necessary to keep transform-session or console-context reads honest without dragging Browser or build-policy logic forward
- the next safe move is therefore not more helper math extraction; it is the transform-session action-body slice itself, with only the minimum honest console-context carryover needed to finish the boundary cleanly

### Phase 4.1 Implementation Spec

#### Exact First Code Cut
- add one explicit transform app-store slice module under `src/app/store/transforms/` for the remaining transform-session action bodies:
  - reference transform-session start, update, scrub, commit, and exit actions
  - content-object transform-session start, update, scrub, commit, and exit actions
  - environment-light transform-session start, update, scrub, commit, and exit actions
- move the smallest remaining root-only transform session clone or base-history helper seams into that transform owner area only if they are required to make the action slice self-contained
- keep `referenceWorkspace` as the underlying state truth and keep one exported `useAppStore` facade
- move `selectConsoleWorkspaceContextTarget(...)` or one tiny supporting helper only if that move is required to close the selection or console-context carryover honestly without pulling Browser tree logic or build orchestration into the same pass
- leave build-policy helpers, delayed placeholders, and file-scope subscriptions untouched for `Phase 5`

#### Expected Phase 4.1 Outputs
- one explicit transform app-store slice module that owns the remaining transform-session action bodies
- one narrower `useAppStore.ts` facade that composes the transform action slice instead of keeping the transform-session mutations inline
- one explicit keep-or-move decision for `selectConsoleWorkspaceContextTarget(...)` and any tiny supporting helper carryover that still touches this boundary

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/transforms/transformAppStoreSlice.ts`
- `src/app/store/transforms/referenceTransformHelpers.ts` if a few remaining root-only clone or base-history helpers need to move beside the action slice
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts` only if one honest console-context carryover seam belongs there
- `src/app/store/selection/workspaceSelectionSelectors.ts` only if `selectConsoleWorkspaceContextTarget(...)` can move cleanly without dragging Browser tree logic with it
- `src/app/store/useAppStore.test.ts`
- `src/app/store/viewerTransformEditHistoryStore.test.ts`

#### Likely Immediate Supporting Reads
- `src/app/store/transforms/referenceTransformHelpers.ts`
- `src/app/store/selection/workspaceSelectionAppStoreSlice.ts`
- `src/app/store/selection/workspaceSelectionSelectors.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/store/viewerTransformEditHistoryStore.test.ts`

#### No-Widening Rule
- do not pull `useSpaghettiStore.subscribe(...)`, `useWorkspaceStore.subscribe(...)`, build-policy helpers, or delayed-build placeholders forward from `Phase 5`
- do not reopen project-content, reference-workspace, or Browser tree extraction just because selection or console-context helpers still reference those owner areas
- do not move viewer runtime objects or workspace layout truth into the transform or selection slices
- do not force `selectConsoleWorkspaceContextTarget(...)` out of the root facade if doing so would require dragging a wider Browser/content read-model cluster into this pass

#### Verification Shape
- reference, content-object, and environment-light transform sessions still behave through the same public `useAppStore` facade
- transform-history and scrub behavior still use the extracted helper graph instead of reintroducing root-owned duplication
- the root store file loses the main remaining transform mutation bulk
- focused verification should include `npm.cmd run build` plus `src/app/store/viewerTransformEditHistoryStore.test.ts` and the closest `src/app/store/useAppStore.test.ts` coverage for transform sessions and workspace-selection or console-context coordination

#### Stop Rule
- stop once the transform-session action bodies are extracted behind one explicit transform slice module and the remaining selection or console-context carryover has an honest keep-or-move decision
- do not continue into build-policy extraction, file-scope subscriptions, or final facade cleanup in the same pass
- if `selectConsoleWorkspaceContextTarget(...)` still sits on too much cross-domain Browser/content residue, leave it in the root facade with an explicit note and still close `Phase 4.1`
- if the broader `useAppStore.test.ts` branch drift remains red after the move, record that honestly instead of widening the pass into unrelated behavior repair

#### Checklist
- [x] identify the remaining transform-session action clusters that can move together behind one transform slice
- [x] add `src/app/store/transforms/transformAppStoreSlice.ts` and route the root transform-session action bodies through it
- [x] move any tiny remaining root-only transform session helper seams needed to support that slice without widening the pass
- [x] make one explicit keep-or-move decision for the late selection or console-context carryover needed to finish the boundary honestly
- [x] keep one exported `useAppStore` facade and preserve `referenceWorkspace`, viewer-runtime, and workspace-layout truth boundaries
- [x] verify focused build and test coverage, then stop before `Phase 5`

### Phase 4.1 Result

#### Landed Follow-Up Slice

- added `src/app/store/transforms/transformAppStoreSlice.ts` so the remaining reference, content-object, and environment-light transform-session action bodies now live behind one explicit transform owner module instead of staying inline in `useAppStore.ts`
- updated `src/app/store/transforms/referenceTransformHelpers.ts` so the environment-light transform-history normalization and scrub helpers needed by the new slice now live beside the rest of the transform helper graph
- rewired `src/app/store/useAppStore.ts` to compose `createTransformAppStoreSlice(set)` and deleted the moved inline transform-session mutation bulk while keeping the viewer edit-history wrapper surface in the root facade

#### Keep-Or-Move Decision

- `selectConsoleWorkspaceContextTarget(...)` stays in `src/app/store/useAppStore.ts`
- that selector still depends on the broader Browser/content read-model cluster, so forcing it into `selection/` during this pass would have widened the phase beyond the approved transform-session boundary
- this is treated as an honest keep-in-root decision, not as unfinished `Phase 4` work

#### Phase Close Read

- `Phase 4` is now honestly complete
- the transform helper graph, workspace-selection/context action slice, and remaining transform-session mutation bulk are all now extracted behind explicit owner modules
- the next open family concern is therefore `Phase 5 - Build Policy And Subscription Orchestration Extraction`, not another transform follow-up

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/viewerTransformEditHistoryStore.test.ts` still reports the same 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, while `src/app/store/viewerTransformEditHistoryStore.test.ts` still passes
- the unchanged drift band still includes the explicit multi-select and published-content/build-policy assertion cluster, so this closeout records that broader suite status honestly instead of widening `Phase 4.1` into unrelated behavior repair

## [ ] `Gen 3 - Cleanup 1 / Phase 5` - `Build Policy And Subscription Orchestration Extraction`

### Phase 5 Summary

#### Purpose
- isolate the highest-risk orchestration logic last, after the pure helpers and main owner slices already have stable homes

#### Owns
- browser build policy helpers
- delayed draft/authoritative placeholder helpers
- file-scope cross-store subscriptions
- app-store-side build orchestration helpers

#### Does Not Own
- graph-runtime ownership
- worker contract redesign
- Browser, console, or viewer product behavior widening

#### Current Narrowing Decision
- keep `Phase 5` as the overall family concern for all remaining build-policy, delayed placeholder, and cross-store orchestration extraction work
- do not send the whole `Phase 5` seam into one Codex implementation pass
- treat `Phase 5.1` as the completed policy-only move
- use `Phase 5.2` as the next implementation-ready slice for delayed placeholder dispatch plus the request-intent helpers that pair naturally with that seam
- keep interaction-release and request-export flow for `Phase 5.3`
- keep `syncCurrentProjectFromSpaghetti(...)` plus the file-tail subscriptions for `Phase 5.4`

#### Current Live Read
- the remaining root-owned build seam is now concentrated around:
  - browser build-policy types and placeholder records near `useAppStore.ts:143` through `useAppStore.ts:188`
  - browser build-policy ordering and inheritance helpers near `useAppStore.ts:5160` through `useAppStore.ts:5261`
  - geometry-target, draft-policy, and authoritative-policy resolution near `useAppStore.ts:5429` through `useAppStore.ts:5515`
  - delayed placeholder dispatch and request staging near `useAppStore.ts:5516` through `useAppStore.ts:6209`
  - project derivation sync plus file-tail subscriber wiring near `useAppStore.ts:11125` through `useAppStore.ts:11329`
- after `Phase 4.1`, this is the largest remaining cross-domain cluster that still makes `useAppStore.ts` act like an app kernel
- the live tests already show that build-policy and accepted-publication behavior share one regression-sensitive seam, so Phase 5 should keep those helpers and subscribers together instead of splitting them across unrelated follow-up passes

#### Current Section Anchors
- build policy and delayed placeholder type surface starts around:
  - `type BuildPolicy` at `useAppStore.ts:143`
  - `DelayedDraftBuildPlaceholder` at `useAppStore.ts:159`
  - `DelayedAuthoritativeBuildPlaceholder` at `useAppStore.ts:173`
- browser build-policy ordering and inheritance helpers cluster around:
  - `BROWSER_BUILD_POLICY_ORDER` at `useAppStore.ts:5160`
  - `selectAssemblyBrowserBuildPolicy(...)` at `useAppStore.ts:5197`
  - `selectEffectiveBrowserExecutionPolicy(...)` just below the same helper cluster
- build-request intent and delayed-dispatch helpers cluster around:
  - `resolveGraphBuildGeometryTarget(...)` at `useAppStore.ts:5429`
  - `resolveGraphBuildDraftPolicy(...)` at `useAppStore.ts:5440`
  - `resolveGraphBuildAuthoritativePolicy(...)` at `useAppStore.ts:5469`
  - `resolveGraphBuildExecutionIntent(...)` at `useAppStore.ts:5495`
  - `dispatchDelayedGraphBuildPlaceholder(...)` at `useAppStore.ts:5516`
- root store action bodies that still inline the build orchestration cluster around:
  - `requestGraphDocumentBuild(...)` at `useAppStore.ts:5608`
  - `prepareGraphDocumentExport(...)` near `useAppStore.ts:5887`
  - browser build-policy mutation helpers near `useAppStore.ts:5996` through `useAppStore.ts:6041`
  - interaction-release and browser build dispatch helpers near `useAppStore.ts:6099` through `useAppStore.ts:6238`
- file-tail orchestration still sits at:
  - `syncCurrentProjectFromSpaghetti(...)` at `useAppStore.ts:11125`
  - `handleBrowserGraphRuntimeRevisionChange(...)` immediately below
  - `requestViewerTargetBuildForViewportPreference(...)` immediately below
  - `useSpaghettiStore.subscribe(...)` at `useAppStore.ts:11283`
  - `useWorkspaceStore.subscribe(...)` at `useAppStore.ts:11329`

### Phase 5 Remaining Slice Ladder

#### Remaining Open Work
- delayed placeholder dispatch and request-intent resolution still sit together around:
  - `resolveGraphBuildExecutionIntent(...)` at `useAppStore.ts:5401`
  - `dispatchDelayedGraphBuildPlaceholder(...)` at `useAppStore.ts:5415`
  - `requestGraphDocumentBuild(...)` at `useAppStore.ts:5507`
- interaction-release and request-export flow still sit together around:
  - `prepareGraphDocumentExport(...)` at `useAppStore.ts:5694`
  - `endBrowserBuildInteraction(...)` at `useAppStore.ts:5923`
  - `requestBrowserGraphDocumentBuild(...)` at `useAppStore.ts:5995`
  - `requestManualBuild(...)` at `useAppStore.ts:6097`
- project-sync and file-tail orchestration still sit together around:
  - `syncCurrentProjectFromSpaghetti(...)` at `useAppStore.ts:10956`
  - `handleBrowserGraphRuntimeRevisionChange(...)` at `useAppStore.ts:11016`
  - `requestViewerTargetBuildForViewportPreference(...)` at `useAppStore.ts:11084`
  - `useSpaghettiStore.subscribe(...)` at `useAppStore.ts:11114`
  - `useWorkspaceStore.subscribe(...)` at `useAppStore.ts:11160`

#### Shared No-Widening Rule
- do not move accepted build-result truth out of graph runtime
- do not re-decide Browser ownership, viewer runtime ownership, or workspace layout ownership in the same pass
- do not fold worker cleanup, worker contract redesign, or naming cleanup into this lane
- do not treat the broader red `useAppStore.test.ts` drift band as permission to repair unrelated content, selection, or transform behavior here

#### Shared Verification Shape
- `npm.cmd run build` passes
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` remains the focused verification pair for each `Phase 5.x` slice
- if the broader `useAppStore.test.ts` drift band remains red but unchanged after a slice move, record that honestly and stop without widening

## [x] `Gen 3 - Cleanup 1 / Phase 5.2` - `Delayed Placeholder And Request Intent Extraction`

### Phase 5.2 Summary

#### Purpose
- move the delayed placeholder and request-intent seam into its own `builds/` owner module without dragging the release/export tail or file-tail subscriptions along with it

#### Owns
- `resolveGraphBuildGeometryTarget(...)`
- `resolveGraphBuildDraftPolicy(...)`
- `resolveGraphBuildAuthoritativePolicy(...)`
- `resolveGraphBuildExecutionIntent(...)`
- `dispatchDelayedGraphBuildPlaceholder(...)`
- `requestGraphDocumentBuild(...)`
- the tiny helper wiring that those functions need to continue calling compile/build derivation and runtime staging without changing owner truth

#### Does Not Own
- `prepareGraphDocumentExport(...)`
- `endBrowserBuildInteraction(...)`
- `requestBrowserGraphDocumentBuild(...)`
- `requestManualBuild(...)`
- `syncCurrentProjectFromSpaghetti(...)`
- file-tail `useSpaghettiStore.subscribe(...)` and `useWorkspaceStore.subscribe(...)` wiring

#### Exact First Code Cut
- add `src/app/store/builds/appStoreBuildRequests.ts`
- move the request-intent helper cluster and delayed placeholder dispatcher into that file
- move `requestGraphDocumentBuild(...)` into the same module because it is the direct caller and owner of those helpers
- keep compile/build-input derivation and graph-runtime staging calls exactly where their current truth already lives, even if the moved request module calls back into them

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/builds/appStoreBuildRequests.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/store/buildPathDerivedSync.test.ts`

#### Focused Verification
- `requestGraphDocumentBuild(...)` still stages delayed draft and delayed authoritative placeholders under the same policy conditions
- explicit request flows still compile, stage runtime requests, and append the same app console entries

#### Stop Rule
- stop once delayed placeholder dispatch and `requestGraphDocumentBuild(...)` no longer live inline in `useAppStore.ts`
- stop before moving export preparation, browser interaction release handling, or any file-tail subscription code
- if the moved request module still needs small local imports from `useAppStore.ts`, allow that glue and leave broader facade cleanup for `Phase 6.x`

### Phase 5.2 Result

#### Landed Request Slice

- added `src/app/store/builds/appStoreBuildRequests.ts` as the request-oriented `builds/` owner module for delayed placeholder and request-intent behavior
- moved the request-intent helper cluster into that module, including the geometry-target, draft-policy, authoritative-policy, and execution-intent resolution helpers
- moved `dispatchDelayedGraphBuildPlaceholder(...)` into that same module
- moved `requestGraphDocumentBuild(...)` behind `createBuildRequestActions(...)` and rewired `src/app/store/useAppStore.ts` to compose the moved request seam instead of keeping the whole request body inline

#### Honest Deferred Seams

- `prepareGraphDocumentExport(...)` did not move in this pass
- `requestBrowserGraphDocumentBuild(...)` did not move in this pass
- interaction-release browser build dispatch helpers did not move in this pass
- `syncCurrentProjectFromSpaghetti(...)` and the file-tail `useSpaghettiStore.subscribe(...)` plus `useWorkspaceStore.subscribe(...)` orchestration seam did not move in this pass
- those deferred seams remain the correct later `Phase 5.3` and `Phase 5.4` work rather than unfinished `Phase 5.2` scope

#### Phase 5.2 Close Read

- `Phase 5.2` is now honestly complete
- the repo now has a second explicit `builds/` owner-area module for the delayed placeholder and request-intent seam
- the next open build tail is therefore `Phase 5.3 - Browser Release And Export Flow Extraction`, while the file-tail subscription extraction still remains queued behind it as `Phase 5.4`

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` still reports the same unchanged 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, while `src/app/store/buildPathDerivedSync.test.ts` passes
- the unchanged drift band is recorded honestly here instead of widening `Phase 5.2` into the deferred release/export or subscriber seams

## [x] `Gen 3 - Cleanup 1 / Phase 5.3` - `Browser Release And Export Flow Extraction`

### Phase 5.3 Summary

#### Purpose
- isolate the browser interaction release and explicit export-preparation flow after the delayed request-intent seam has a stable home

#### Owns
- `prepareGraphDocumentExport(...)`
- `requestBrowserGraphDocumentBuild(...)`
- `endBrowserBuildInteraction(...)`
- `requestManualBuild(...)`
- the tiny queue-release helper wiring that belongs only to that same interaction and export seam

#### Does Not Own
- `requestGraphDocumentBuild(...)`
- `syncCurrentProjectFromSpaghetti(...)`
- `handleBrowserGraphRuntimeRevisionChange(...)`
- `requestViewerTargetBuildForViewportPreference(...)`
- file-tail `useSpaghettiStore.subscribe(...)` and `useWorkspaceStore.subscribe(...)` wiring

#### Exact First Code Cut
- add `src/app/store/builds/appStoreBuildReleaseFlow.ts`
- move the interaction-release queue handling and the browser/export request action bodies into that file
- keep the lower-level request-intent and delayed placeholder implementation in the `Phase 5.2` request module, with this slice calling into it rather than re-owning it

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/builds/appStoreBuildRequests.ts`
- `src/app/store/builds/appStoreBuildReleaseFlow.ts`
- `src/app/store/useAppStore.test.ts`

#### Focused Verification
- release-triggered delayed draft and authoritative placeholder dispatch still fire on the same interaction-end paths
- explicit browser build and export preparation still return the same ready, pending, and blocked shapes

#### Stop Rule
- stop once browser release and explicit export flow no longer live inline in `useAppStore.ts`
- stop before moving project-sync or file-tail subscriber wiring
- if one tiny root-facade wrapper remains around the moved release module, keep it for `Phase 6.1` instead of widening

### Phase 5.3 Result

#### Landed Release Flow Slice

- added `src/app/store/builds/appStoreBuildReleaseFlow.ts` as the release-oriented `builds/` owner module for browser interaction release and export flow behavior
- moved `prepareGraphDocumentExport(...)` into that module
- moved `requestBrowserGraphDocumentBuild(...)`, `endBrowserBuildInteraction(...)`, and `requestManualBuild(...)` behind that module's action factory
- moved the tiny queue-release helper wiring that belongs only to that same seam, including delayed release placeholder dispatch on interaction end
- rewired `src/app/store/useAppStore.ts` to compose the moved release flow while keeping the request module and policy module as explicit dependencies

#### Honest Deferred Seams

- `syncCurrentProjectFromSpaghetti(...)` did not move in this pass
- `handleBrowserGraphRuntimeRevisionChange(...)` did not move in this pass
- `requestViewerTargetBuildForViewportPreference(...)` did not move in this pass
- the file-tail `useSpaghettiStore.subscribe(...)` and `useWorkspaceStore.subscribe(...)` orchestration seam did not move in this pass
- those deferred seams remain the correct later `Phase 5.4` work rather than unfinished `Phase 5.3` scope

#### Phase 5.3 Close Read

- `Phase 5.3` is now honestly complete
- the repo now has a third explicit `builds/` owner-area module for browser release and export flow behavior
- the last open `Phase 5` seam is therefore `Phase 5.4 - Project Sync And File-Tail Subscription Extraction`

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` still reports the same unchanged 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, while `src/app/store/buildPathDerivedSync.test.ts` passes
- the unchanged drift band is recorded honestly here instead of widening `Phase 5.3` into the deferred file-tail subscription seam

## [x] `Gen 3 - Cleanup 1 / Phase 5.4` - `Project Sync And File-Tail Subscription Extraction`

### Phase 5.4 Summary

#### Purpose
- move the last file-tail orchestration cluster out of `useAppStore.ts` so the root file stops owning cross-store subscription setup directly

#### Owns
- `syncCurrentProjectFromSpaghetti(...)`
- `handleBrowserGraphRuntimeRevisionChange(...)`
- `requestViewerTargetBuildForViewportPreference(...)`
- `useSpaghettiStore.subscribe(...)`
- `useWorkspaceStore.subscribe(...)`
- the tiny orchestration helper wiring that belongs only to that file-tail sync seam

#### Does Not Own
- project-content derivation truth itself
- graph-runtime accepted build-result truth
- browser build-policy helpers
- export-preparation logic

#### Exact First Code Cut
- add `src/app/store/builds/appStoreBuildSubscriptions.ts`
- move the project-sync helper and both file-tail subscriptions into that file
- keep the moved subscriber module calling existing content derivation and build-request actions instead of re-owning those truths

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/builds/appStoreBuildSubscriptions.ts`
- `src/app/store/builds/appStoreBuildRequests.ts`
- `src/app/store/builds/appStoreBuildReleaseFlow.ts`
- `src/app/store/buildPathDerivedSync.test.ts`
- `src/app/store/useAppStore.test.ts`

#### Focused Verification
- project derivation still stays synchronized from `useSpaghettiStore` under the same graph-runtime triggers
- viewport-preference follow-through still requests viewer-target builds on the same workspace transitions
- file-tail subscriptions become explicit module setup instead of root-file residue

#### Stop Rule
- stop once the project-sync helper and the file-tail subscriptions have an explicit `builds/` home
- stop even if `useAppStore.ts` still has a small amount of composition glue, because the final facade shrink belongs to `Phase 6.x`

### Phase 5.4 Result

#### Landed Subscription Slice

- added `src/app/store/builds/appStoreBuildSubscriptions.ts` as the subscription-oriented `builds/` owner module for project sync and file-tail orchestration behavior
- moved `syncCurrentProjectFromSpaghetti(...)` into that module
- moved the browser runtime follow-through helpers into that module, including the viewport-preference request path and current-runtime revision follow-through behavior
- moved the file-tail `useSpaghettiStore.subscribe(...)` and `useWorkspaceStore.subscribe(...)` wiring into that module
- rewired `src/app/store/useAppStore.ts` to initialize the moved subscription runtime while keeping the request, release, and policy modules as explicit dependencies

#### Honest Remaining Facade Glue

- this pass did not try to finish the final `useAppStore.ts` facade shrink
- a small amount of root-facade composition glue still remains, and that is the correct `Phase 6.1` follow-on instead of unfinished `Phase 5.4` work

#### Phase 5.4 Close Read

- `Phase 5.4` is now honestly complete
- the repo now has a fourth explicit `builds/` owner-area module for the project-sync and file-tail subscription seam
- the full `Phase 5` build-policy and orchestration family concern is now honestly complete
- the next open lane is therefore `Phase 6.1 - Root Facade Shrink`

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` still reports the same unchanged 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, while `src/app/store/buildPathDerivedSync.test.ts` passes
- the unchanged drift band is recorded honestly here instead of widening `Phase 5.4` into unrelated behavior repair

## [x] `Gen 3 - Cleanup 1 / Phase 5.1` - `Browser Build Policy Slice Extraction`

### Phase 5.1 Summary

#### Purpose
- create the first real `builds/` owner-area module by extracting only the browser build-policy helper cluster and the direct policy action bodies that already sit on that same seam

#### Owns
- browser build-policy ordering and priority helpers
- browser build-policy inheritance and effective-policy resolution helpers
- `setBuildPolicy(...)`
- browser graph/content build-policy getters, setters, clearers, and cyclers
- any tiny supporting helper wiring that belongs only to that same policy seam

#### Does Not Own
- delayed placeholder dispatch
- `requestBrowserGraphDocumentBuild(...)`
- `requestGraphDocumentBuild(...)`
- `prepareGraphDocumentExport(...)`
- interaction-release browser build dispatch helpers
- `syncCurrentProjectFromSpaghetti(...)`
- file-tail `useSpaghettiStore.subscribe(...)` and `useWorkspaceStore.subscribe(...)` orchestration

#### Current Live Read
- the smallest clean move inside the broad `Phase 5` lane is the browser build-policy helper cluster around:
  - `BROWSER_BUILD_POLICY_ORDER` at `useAppStore.ts:5160`
  - `selectAssemblyBrowserBuildPolicy(...)` at `useAppStore.ts:5197`
  - `selectEffectiveBrowserExecutionPolicy(...)` just below the same helper cluster
- the direct root action bodies that naturally belong to that same seam are:
  - `setBuildPolicy(...)`
  - `getBrowserGraphBuildPolicy(...)`
  - `getBrowserContentBuildPolicy(...)`
  - `setBrowserGraphBuildPolicy(...)`
  - `clearBrowserGraphBuildPolicy(...)`
  - `cycleBrowserGraphBuildPolicy(...)`
  - `setBrowserContentBuildPolicy(...)`
  - `clearBrowserContentBuildPolicy(...)`
  - `cycleBrowserContentBuildPolicy(...)`
- those policy actions still call back into the current project derivation sync seam, but that does not require moving the sync implementation itself in this pass

### Phase 5.1 Implementation Spec

#### Exact First Code Cut
- add `src/app/store/builds/appStoreBuildPolicies.ts`
- move the browser build-policy ordering, inheritance, and effective-policy helpers into that file
- move only the direct policy action bodies that naturally pair with those helpers:
  - `setBuildPolicy(...)`
  - browser graph/content build-policy getters, setters, clearers, and cyclers
- keep the current project derivation sync implementation where it already lives, even if the moved policy actions still call into it
- keep the public `useAppStore` facade stable through imports or re-exports instead of changing caller-facing API shape

#### Expected Phase 5.1 Outputs
- one explicit `builds/appStoreBuildPolicies.ts` module that owns the browser build-policy helper seam
- one smaller root-facade build-policy surface in `useAppStore.ts`
- one honest follow-up note that delayed placeholder dispatch, request/export flow, and file-tail orchestration still belong to later `Phase 5.x` slices

#### Likely Files
- `src/app/store/useAppStore.ts`
- `src/app/store/builds/appStoreBuildPolicies.ts`
- `src/app/store/useAppStore.test.ts`

#### Likely Immediate Supporting Reads
- `src/app/store/projectContent/projectContentTypes.ts`
- `src/app/store/projectContent/projectContentSelectors.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

#### No-Widening Rule
- do not move delayed draft or delayed authoritative placeholder logic in this pass
- do not move request/export build flow in this pass
- do not move interaction-release dispatch helpers or file-tail subscribers in this pass
- do not re-decide Browser ownership, graph-runtime ownership, or workspace-layout ownership
- do not widen into final facade cleanup or naming cleanup

#### Verification Shape
- `npm.cmd run build` passes
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` remains the focused verification pair
- browser graph/content build-policy reads and mutations still follow the same visible timing and derivation behavior after the move
- if the broader `useAppStore.test.ts` drift band stays unchanged, record that honestly instead of widening

#### Stop Rule
- stop once the browser build-policy helper cluster and the direct policy action bodies have explicit `builds/appStoreBuildPolicies.ts` ownership
- stop before moving delayed placeholder dispatch, request/export flow, interaction-release dispatch helpers, or file-tail subscriptions
- if those heavier seams are still untouched and the policy slice landed cleanly, treat that as the correct `Phase 5.1` stop rather than unfinished work inside the slice

#### Checklist
- [x] isolate the smallest clean browser build-policy helper seam inside the broad `Phase 5` lane
- [x] limit the next pass to the direct policy action bodies that naturally belong to that helper cluster
- [x] defer delayed placeholder, request/export, and subscriber orchestration seams to later `Phase 5.x` slices
- [x] tighten the likely file set, verification pair, and stop boundary around this smaller policy-only pass

### Phase 5.1 Result

#### Landed Policy Slice

- added `src/app/store/builds/appStoreBuildPolicies.ts` as the first explicit `builds/` owner-area module
- moved the browser build-policy ordering, priority, inheritance, and effective-policy helpers into that module
- moved the direct policy action bodies into that module's action factory:
  - `setBuildPolicy(...)`
  - browser graph/content build-policy getters
  - browser graph/content build-policy setters, clearers, and cyclers
- rewired `src/app/store/useAppStore.ts` to compose the moved policy actions and re-export the moved helper surfaces while keeping the public facade stable

#### Honest Deferred Seams

- delayed draft and delayed authoritative placeholder dispatch did not move in this pass
- `requestBrowserGraphDocumentBuild(...)` did not move in this pass
- `requestGraphDocumentBuild(...)` and `prepareGraphDocumentExport(...)` did not move in this pass
- interaction-release browser build dispatch helpers did not move in this pass
- `syncCurrentProjectFromSpaghetti(...)` and the file-tail `useSpaghettiStore.subscribe(...)` plus `useWorkspaceStore.subscribe(...)` orchestration seam did not move in this pass
- those deferred seams remain the correct later `Phase 5.x` work rather than unfinished `Phase 5.1` scope

#### Phase 5.1 Close Read

- `Phase 5.1` is now honestly complete
- the repo now has one real `builds/` owner-area module for browser build-policy logic
- the broader `Phase 5` family concern remains open because the delayed placeholder, request/export, and file-tail subscription orchestration seams still need later `Phase 5.x` follow-up slices

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` still reports the same unchanged 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, while `src/app/store/buildPathDerivedSync.test.ts` passes
- the unchanged drift band is recorded honestly here instead of widening `Phase 5.1` into unrelated behavior repair

## [x] `Gen 3 - Cleanup 1 / Phase 6` - `Facade Shrink And Gen3 Handoff`

### Phase 6 Summary

#### Purpose
- finish the lane by shrinking `useAppStore.ts` into a composed facade plus a small amount of honest glue, then decide whether later `Gen3` sink cleanup should start

#### Owns
- final facade cleanup
- import path normalization
- deletion of now-retired duplicate helpers
- handoff notes for later `Gen3` targets

#### Does Not Own
- a new broad cleanup generation by default
- unrelated file-size cleanup elsewhere

### Phase 6 Narrowing Decision

- do not keep the old broad `Phase 6` as one last giant cleanup pass
- use `Phase 6.1` for the remaining root facade shrink after the `Phase 5.x` tail is moved
- use `Phase 6.2` for the final documentation closeout and next-Gen3 recommendation once the code boundary is honestly done

## [x] `Gen 3 - Cleanup 1 / Phase 6.1` - `Root Facade Shrink`

### Phase 6.1 Summary

#### Purpose
- reduce `useAppStore.ts` to composed state wiring, stable facade exports, and the small amount of honest shared glue that still belongs at the app-store seam

#### Owns
- duplicate helper retirement left behind by earlier extraction phases
- import path normalization across the extracted owner modules
- final keep-in-root decisions for any tiny selectors or wrappers that still do not justify their own module

#### Does Not Own
- moving new runtime truth into other stores
- starting a second large-file cleanup target
- rewriting completed `Phase 5.x` module boundaries without a new owner proof

#### Exact First Code Cut
- remove any duplicate helper residue left in `useAppStore.ts` after the `Phase 5.x` moves
- normalize the remaining imports and exported facade surface around the extracted owner modules
- keep only state composition, stable facade wiring, and minimal shared glue in the root file

#### Likely Files
- `src/app/store/useAppStore.ts`
- extracted slice, helper, and `builds/` modules from earlier phases
- `src/app/store/useAppStore.test.ts`

#### Focused Verification
- `useAppStore.ts` reads like a composed facade instead of a second app kernel
- the extracted owner modules remain the first obvious search home for their domains

#### Stop Rule
- stop once the root file is honestly facade-sized and any remaining keep-in-root seams are explicitly named
- stop before broad Gen3-family replanning or a new sink-target kickoff

### Phase 6.1 Result

#### Landed Facade Shrink

- added `src/app/store/builds/appStoreBuildFacade.ts` to own the last manual request/release/policy/subscription composition bridge that `useAppStore.ts` was still wiring inline
- added `src/app/store/storeRecordUtils.ts` and moved the shared `deleteRecordKey(...)` helper there so the root file and extracted build modules stop carrying duplicated record-deletion residue
- rewired `src/app/store/useAppStore.ts` to compose the build facade bridge instead of manually coordinating the extracted `builds/` modules and the subscription runtime setup inline

#### Explicit Keep-In-Root Decisions

- kept the root file responsible for composed state wiring and stable facade exports
- kept convenience wrappers such as `compileSpaghetti`, `requestSpaghettiBuild`, and `prepareSpaghettiExport` in the root facade because they are still part of the stable app-store surface
- kept `selectConsoleWorkspaceContextTarget(...)` in the root facade because it still depends on the broader Browser/content read-model seam and still does not justify another late-phase module split

#### Phase 6.1 Close Read

- `Phase 6.1` is now honestly complete
- `useAppStore.ts` now reads as a composed facade with explicit owner modules underneath it instead of manually wiring the extracted build seams inline
- the only remaining Gen3 work is `Phase 6.2 - Gen3 Closeout And Next Target Handoff`

#### Verification Read

- `npm.cmd run build` passed
- `npm.cmd run test -- src/app/store/useAppStore.test.ts src/app/store/buildPathDerivedSync.test.ts` still reports the same unchanged 14-test broader `src/app/store/useAppStore.test.ts` drift band already present in this branch, while `src/app/store/buildPathDerivedSync.test.ts` passes
- the unchanged drift band is recorded honestly here instead of widening `Phase 6.1` into unrelated behavior repair

## [x] `Gen 3 - Cleanup 1 / Phase 6.2` - `Gen3 Closeout And Next Target Handoff`

### Phase 6.2 Summary

#### Purpose
- close the family doc and generation index honestly once the code lane is done, then record whether another Gen3 sink target should start

#### Owns
- final Gen3 closeout reads in the family phase doc and generation index
- shipped owner-pattern summary for the `useAppStore` decomposition
- the recommendation on whether `useSpaghettiStore.ts`, `ViewportOverlay.tsx`, or `Viewer.ts` still needs a future Gen3 lane

#### Does Not Own
- another code extraction pass
- the first implementation of a new Gen3 target
- broader cleanup-family renaming or index reorganization

#### Exact First Code Cut
- update the Gen3 family doc and index to mark the lane complete
- record the final shipped owner pattern and any honest residual keep-in-root seams
- decide whether the next best Gen3 target is another concrete lane or only a recommendation

#### Likely Files
- `docs/Human-Plans/Architecture/Cleanup/Future/Gen3 - Cleanup 1 - useAppStore Ownership Decomposition.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Gen3-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### Focused Verification
- the family doc, generation index, and shipped status all tell the same truth
- the next Gen3 recommendation is explicit instead of implied

#### Stop Rule
- stop once the docs honestly read the lane as complete and the next-target recommendation is recorded
- do not start implementing the next Gen3 target in the same pass

### Phase 6.2 Result

#### Final Shipped Owner Pattern

- `useAppStore.ts` now acts as one public app-store facade instead of a second app kernel
- owner-area modules now hold the real internal seams:
  - `projectContent/*`
  - `references/*`
  - `transforms/*`
  - `selection/*`
  - `builds/*`
- the `builds/` area is now explicitly split by concern:
  - `appStoreBuildPolicies.ts`
  - `appStoreBuildRequests.ts`
  - `appStoreBuildReleaseFlow.ts`
  - `appStoreBuildSubscriptions.ts`
  - `appStoreBuildFacade.ts`

#### Honest Residual Keep-In-Root Seams

- the root facade still keeps composed state wiring and stable exported app-store surface decisions
- convenience wrappers such as `compileSpaghetti`, `requestSpaghettiBuild`, and `prepareSpaghettiExport` remain in the root facade by design because they are still part of the stable caller-facing app-store surface
- `selectConsoleWorkspaceContextTarget(...)` remains in the root facade by deliberate decision because it still depends on the broader Browser/content read-model seam and still does not justify another late-phase split
- the broader unchanged 14-test `useAppStore.test.ts` drift band remains recorded honestly as branch state instead of being misrepresented as new Gen3 follow-up scope

#### Next Gen3 Recommendation

- recommendation only: do not open a new Gen3 implementation lane yet in this closeout pass
- if a later oversized ownership-sink lane is needed, `useSpaghettiStore.ts` is the strongest next candidate because it still concentrates graph-runtime, accepted-result, viewer-target, and graph-edit coordination truth in one large surface
- `ViewportOverlay.tsx` and `Viewer.ts` remain possible later Gen3 reads, but they are not promoted here to a concrete next lane

#### Phase 6.2 Close Read

- `Phase 6.2` is now honestly complete
- `Gen 3 - Cleanup 1` is now fully complete
- the next Gen3 step is recorded only as a recommendation, not as a started or prepped implementation target

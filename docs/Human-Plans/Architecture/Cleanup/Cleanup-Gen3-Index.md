# Cleanup Gen3 Index

## Doc Header

### Doc History
44. 2026-05-09 13:57:53: Implemented `Gen 3 - Cleanup 2 / Phase 5.1.1 - Graph Document And Runtime Selector Extraction`, added `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`, and advanced the generation read so the first selector-owner module is now landed while `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` becomes the next explicit implementation target.
43. 2026-05-09 08:11:01: Prepared `Gen 3 - Cleanup 2 / Phase 5.1 - Active Graph Runtime Selector Extraction` in the family doc by promoting the selector ladder into dedicated phase sections, keeping `Phase 5.1.1 - Graph Document And Runtime Selector Extraction` as the next explicit implementation target, and leaving the broader output-surface plus workspace read-model follow-ons separately owned.
42. 2026-05-07 07:14:07: Tightened `Gen 3 - Cleanup 2 / Phase 5.1.1 - Graph Document And Runtime Selector Extraction` against the live `useSpaghettiStore.ts` selector anchors, locked the likely `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts` destination module plus focused test target, and advanced the generation read so the next implementation handoff is now explicit enough for one clean Codex pass
41. 2026-05-06 09:09:09: Narrowed the remaining `Gen 3 - Cleanup 2 / Phase 5.1` selector lane into smaller Codex-sized follow-up passes by splitting it into `Phase 5.1.1 - Graph Document And Runtime Selector Extraction` and `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` before more implementation starts
40. 2026-05-06 09:09:09: Implemented `Gen 3 - Cleanup 2 / Phase 4.7 - Geometry Sketch Component Edit Action Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchComponentEditActions.ts`, and advanced the generation read so the full sketch-session action lane is now landed while `Phase 5.1 - Active Graph Runtime Selector Extraction` becomes the next explicit implementation target
39. 2026-05-06 09:04:34: Implemented `Gen 3 - Cleanup 2 / Phase 4.6 - Geometry Sketch Selection Action Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchSelectionActions.ts`, and advanced the generation read so the geometry-sketch selection and delete seam is now landed while `Phase 4.7 - Geometry Sketch Component Edit Action Extraction` becomes the next explicit implementation target
38. 2026-05-06 09:00:58: Implemented `Gen 3 - Cleanup 2 / Phase 4.5.2 - Draw Draft Commit And Undo Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchDrawDraftActions.ts`, and advanced the generation read so the geometry-sketch draw draft commit and undo seam is now landed while `Phase 4.6 - Geometry Sketch Selection Action Extraction` becomes the next explicit implementation target
37. 2026-05-05 22:26:55: Implemented `Gen 3 - Cleanup 2 / Phase 4.5.1 - Draw Session Control Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchDrawSessionControl.ts`, and advanced the generation read so the geometry-sketch draw session control seam is now landed while `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` becomes the next explicit implementation target
36. 2026-05-05 22:26:55: Narrowed the remaining `Gen 3 - Cleanup 2 / Phase 4.5` draw-session lane into smaller Codex-sized follow-up passes by splitting it into `Phase 4.5.1 - Draw Session Control Extraction` and `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` before more implementation starts
35. 2026-05-05 22:26:55: Implemented `Gen 3 - Cleanup 2 / Phase 4.4 - Geometry Sketch Session Lifecycle Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchSessionLifecycle.ts`, and advanced the generation read so the geometry-sketch session lifecycle and history-scrub seam is now landed while `Phase 4.5 - Geometry Sketch Draw Draft Action Extraction` becomes the next explicit implementation target
34. 2026-05-05 22:14:48: Implemented `Gen 3 - Cleanup 2 / Phase 4.3 - Geometry Sketch Plane Graph Write Extraction`, added `src/app/spaghetti/store/sketch/geometrySketchPlaneGraphWrite.ts`, and advanced the generation read so the direct geometry-sketch plane graph-write seam is now landed while `Phase 4.4 - Geometry Sketch Session Lifecycle Extraction` becomes the next explicit implementation target
33. 2026-05-05 21:42:49: Implemented `Gen 3 - Cleanup 2 / Phase 4.2 - Sketch Plane Pick Draft Transform Extraction`, added `src/app/spaghetti/store/sketch/sketchPlanePickDraftTransform.ts`, and advanced the generation read so the sketch-plane draft-transform setter seam is now landed while `Phase 4.3 - Geometry Sketch Plane Graph Write Extraction` becomes the next explicit implementation target
32. 2026-05-05 21:33:34: Implemented `Gen 3 - Cleanup 2 / Phase 4.1 - Sketch Plane Pick Command Session Extraction`, added `src/app/spaghetti/store/sketch/sketchPlaneCommandSession.ts`, and advanced the generation read so the first sketch-plane command-routing seam is now landed while `Phase 4.2 - Sketch Plane Pick Draft Transform Extraction` becomes the next explicit implementation target
31. 2026-05-05 21:14:30: Implemented `Gen 3 - Cleanup 2 / Phase 3.4 - Graph Node History Adapter Extraction`, added `src/app/spaghetti/store/history/graphNodeHistoryCommitAdapter.ts`, and advanced the generation read so the history lane is now fully closed while the broad `Phase 4` sketch-session concern is further narrowed into `Phase 4.1` through `Phase 4.7` before more implementation starts
30. 2026-05-05 21:14:30: Implemented `Gen 3 - Cleanup 2 / Phase 3.3 - Part Feature History Adapter Extraction`, added `src/app/spaghetti/store/history/partFeatureHistoryCommitAdapter.ts`, and advanced the generation read so the part-feature-specific history adapter seam is now landed while `Phase 3.4 - Graph Node History Adapter Extraction` becomes the next explicit implementation target
29. 2026-05-05 21:07:16: Narrowed the remaining `Gen 3 - Cleanup 2` ladder into smaller Codex-sized slices by splitting the old `Phase 3.3` history seam into separate part-feature and graph-node adapter passes, then pre-splitting the later sketch-session, selector, and closeout work into `Phase 4.1` through `Phase 6.2` before more implementation starts
28. 2026-05-05 21:02:02: Implemented `Gen 3 - Cleanup 2 / Phase 3.2 - Geometry Sketch Commit Adapter Extraction`, added `src/app/spaghetti/store/history/geometrySketchHistoryCommitAdapter.ts`, and advanced the generation read so the geometry-sketch-specific history adapter seam is now landed while `Phase 3.3 - Remaining Graph-History Commit Adapter Extraction` becomes the next explicit implementation target
27. 2026-05-05 20:54:51: Narrowed the remaining `Gen 3 - Cleanup 2 / Phase 3.2` handoff by naming `Phase 3.2 - Geometry Sketch Commit Adapter Extraction` as the next explicit implementation target, keeping the broader graph-history adapter concern intact while deferring the part-feature and graph-node adapter seam to later `Phase 3.x` follow-up work
26. 2026-05-05 20:54:51: Implemented `Gen 3 - Cleanup 2 / Phase 3.1 - Geometry Sketch History Helper Extraction`, added `src/app/spaghetti/store/history/geometrySketchHistory.ts`, and advanced the generation read so the pure sketch-history owner-area seam is now landed while `Phase 3.2 - Graph-History Commit Adapter Extraction` becomes the next explicit implementation target
25. 2026-05-05 20:43:59: Narrowed the broad `Gen 3 - Cleanup 2 / Phase 3` history lane by adding `Phase 3.1 - Geometry Sketch History Helper Extraction` as the next explicit implementation target, keeping the overall history concern intact while deferring the live graph-history commit adapters to later `Phase 3.x` follow-up work
24. 2026-05-05 20:43:59: Implemented `Gen 3 - Cleanup 2 / Phase 2 - Pure Types And Accepted Runtime Helper Extraction`, added `src/app/spaghetti/store/graphRuntime/acceptedRuntime.ts`, and advanced the generation read so the accepted-runtime owner-area seam is now landed while `Phase 3 - Graph Edit And History Helper Extraction` becomes the next explicit implementation target
23. 2026-05-05 20:30:15: Tightened `Gen 3 - Cleanup 2 / Phase 1 - Owner Map And Migration Rules Lock` against the live `useSpaghettiStore.ts` seam anchors, confirmed the first graph-runtime, history, sketch, and selector module targets, and advanced the generation read so `Phase 1` is now complete while `Phase 2 - Pure Types And Accepted Runtime Helper Extraction` becomes the next explicit implementation target
22. 2026-05-05 20:30:15: Added `Future/Gen3 - Cleanup 2 - useSpaghettiStore Ownership Decomposition.md`, `Future/Gen3 - Cleanup 3 - ViewportOverlay Runtime Surface Decomposition.md`, and `Future/Gen3 - Cleanup 4 - Viewer Runtime Boundary Decomposition.md`, then refreshed this generation index so the post-`useAppStore` Gen3 ladder now has three explicit small-phase family docs with `useSpaghettiStore.ts` promoted from recommendation-only to the next concrete lane
21. 2026-05-05 20:20:44: Closed `Gen 3 - Cleanup 1 / Phase 6.2 - Gen3 Closeout And Next Target Handoff`, marked the `useAppStore` decomposition lane honestly complete, recorded the final shipped owner-pattern plus the deliberate keep-in-root seams, and left the next Gen3 step as a recommendation-only read with `useSpaghettiStore.ts` named as the strongest later sink candidate instead of opening a new lane early
20. 2026-05-05 20:18:17: Implemented `Gen 3 - Cleanup 1 / Phase 6.1 - Root Facade Shrink`, added `src/app/store/builds/appStoreBuildFacade.ts` plus `src/app/store/storeRecordUtils.ts`, and advanced the generation read so the root facade is now honestly shrunk while `Phase 6.2 - Gen3 Closeout And Next Target Handoff` becomes the next explicit prepped implementation target
19. 2026-05-05 20:08:59: Implemented `Gen 3 - Cleanup 1 / Phase 5.4 - Project Sync And File-Tail Subscription Extraction`, added `src/app/store/builds/appStoreBuildSubscriptions.ts` as the fourth `builds/` owner-area module, and advanced the generation read so the full `Phase 5` build-policy and orchestration lane is now complete while `Phase 6.1 - Root Facade Shrink` becomes the next explicit prepped implementation target
18. 2026-05-05 19:59:08: Implemented `Gen 3 - Cleanup 1 / Phase 5.3 - Browser Release And Export Flow Extraction`, added `src/app/store/builds/appStoreBuildReleaseFlow.ts` as the third `builds/` owner-area module, and advanced the generation read so the browser release/export slice is now complete while `Phase 5.4 - Project Sync And File-Tail Subscription Extraction` becomes the next explicit prepped implementation target
17. 2026-05-05 19:52:09: Implemented `Gen 3 - Cleanup 1 / Phase 5.2 - Delayed Placeholder And Request Intent Extraction`, added `src/app/store/builds/appStoreBuildRequests.ts` as the second `builds/` owner-area module, and advanced the generation read so the request-intent slice is now complete while `Phase 5.3 - Browser Release And Export Flow Extraction` becomes the next explicit prepped implementation target
16. 2026-05-05 19:42:56: Split the remaining open `Gen 3 - Cleanup 1` work into narrower `Phase 5.2` through `Phase 5.4` and `Phase 6.1` through `Phase 6.2` follow-up slices, grounded each new pass against the live delayed-placeholder, request/export, file-tail subscription, and facade-handoff seams, and advanced the generation read so `Phase 5.2 - Delayed Placeholder And Request Intent Extraction` is now the next explicit prepped implementation target
15. 2026-05-05 19:34:26: Implemented `Gen 3 - Cleanup 1 / Phase 5.1 - Browser Build Policy Slice Extraction`, added the first `builds/appStoreBuildPolicies.ts` owner-area module, and advanced the generation read so the narrowed policy slice is now complete while the broader delayed-placeholder and file-tail orchestration seams remain later `Phase 5.x` follow-up work inside the same family lane
14. 2026-05-05 19:29:19: Narrowed the broad `Gen 3 - Cleanup 1 / Phase 5` implementation handoff by adding `Phase 5.1 - Browser Build Policy Slice Extraction` as the next prepped Codex-sized lane, keeping the overall `Phase 5` build-policy and orchestration concern intact while explicitly deferring delayed placeholder, request/export, and file-tail subscription seams to later `Phase 5.x` follow-up slices
13. 2026-05-05 19:20:55: Tightened `Gen 3 - Cleanup 1 / Phase 5 - Build Policy And Subscription Orchestration Extraction` into the next implementation-ready slice, grounding the remaining browser build-policy, delayed-placeholder, and file-tail cross-store subscription seams against the live `useAppStore.ts` anchors so `Phase 5` is now the next prepped lane while `Phase 6` stays deferred
12. 2026-05-05 19:16:41: Implemented `Gen 3 - Cleanup 1 / Phase 4.1 - Transform Session Action Slice Extraction`, recorded the landed transform app-store slice plus the keep-in-root decision for `selectConsoleWorkspaceContextTarget(...)`, and advanced the generation read so `Phase 4` is now complete while `Phase 5` becomes the next follow-on lane instead of staying blocked behind another transform slice
11. 2026-05-05 18:50:48: Added `Gen 3 - Cleanup 1 / Phase 4.1 - Transform Session Action Slice Extraction` as the next implementation-ready follow-up inside the same family lane, grounding the remaining root-owned transform-session action bodies and honest selection or console-context carryover against the landed `referenceTransformHelpers.ts` and `workspaceSelectionAppStoreSlice.ts` seams so `Phase 5` stays blocked behind one explicit finish-the-boundary slice
10. 2026-05-05 18:46:09: Started the real `Gen 3 - Cleanup 1 / Phase 4` implementation by landing the first transform-helper owner-area module and workspace-selection/context action slice, then advanced the generation read so `Phase 4` is now in progress with the remaining transform-session action bodies and late console-context helper surface still blocking `Phase 5`
9. 2026-05-05 18:26:09: Tightened `Gen 3 - Cleanup 1 / Phase 4 - Transform Selection And Context Extraction` into the next implementation-ready slice, grounding the remaining transform-session, transform-history, workspace-selection, and console-context seams against the live `useAppStore.ts` anchors, and advanced the generation read so `Phase 4` is now prepped next while `Phase 5` and `Phase 6` stay deferred
8. 2026-05-05 18:13:27: Marked `Gen 3 - Cleanup 1 / Phase 3 - Project Content And Reference Workspace Slice Extraction` complete after accepting the landed owner-area selector/type/reference-workspace helper slice as the phase outcome, and advanced the family read so `Phase 4` is now the next follow-on lane
7. 2026-05-05 18:02:07: Started the real `Gen 3 - Cleanup 1 / Phase 3` implementation by landing owner-area project-content and selection selector files plus a reference-workspace state/helper module, then advanced the family read so `Phase 3` is now in progress with broader project-content action extraction still remaining
6. 2026-05-05 17:33:23: Tightened `Gen 3 - Cleanup 1 / Phase 3 - Project Content And Reference Workspace Slice Extraction` into the next implementation-ready slice, grounding the remaining `useAppStore.ts` content/reference deferrals and the small type-surface follow-up against live owner seams, and advancing the generation read so `Phase 3` is now prepped for implementation
5. 2026-05-05 17:06:50: Implemented `Gen 3 - Cleanup 1 / Phase 2 - Pure Types Helpers And Selector Extraction`, recording the first shipped owner-area selector/helper modules under `projectContent`, `selection`, `references`, and `transforms`, then advancing the family read so `Phase 3 - Project Content And Reference Workspace Slice Extraction` is now the next phase to prep
4. 2026-05-05 16:44:19: Tightened `Gen 3 - Cleanup 1 / Phase 2 - Pure Types Helpers And Selector Extraction` into the next implementation-ready slice, grounding the first-move helper and selector candidates against live `useAppStore.ts` anchors and clarifying that `Phase 2` should now be the next runtime extraction step while later mutation and orchestration phases remain unprepped
3. 2026-05-05 16:36:48: Implemented `Gen 3 - Cleanup 1 / Phase 1 - Owner Map And Migration Rules Lock` as the first live `Gen3` result, confirming the current `useAppStore.ts` owner buckets, destination-module routing, and early deferral rules, then advanced the family read so `Phase 2 - Pure Types Helpers And Selector Extraction` is now the next phase that should be prepped before runtime extraction starts
2. 2026-05-05 16:26:26: Renamed the first `Gen3` family phase read to `Gen 3 - Cleanup 1`, repointed the future-doc reference to `Future/Gen3 - Cleanup 1 - useAppStore Ownership Decomposition.md`, and tightened the handoff so only `Phase 1` is currently prepped for implementation while `Phase 2` through `Phase 6` remain sequenced follow-on prep targets
1. 2026-05-05 16:19:03: Created this `Cleanup Gen3` index as the next cleanup-generation planning surface after the earlier worker-and-legacy `Gen2` read, grounding it in the current code-review finding that `src/app/store/useAppStore.ts` has become the clearest oversized cross-domain ownership sink and should be decomposed through one explicit phased plan instead of ad hoc future extraction

### Purpose

This doc is the Generation 3 planning index for `Cleanup`.

Use it to decide:
- which oversized ownership sinks should be planned after the earlier cleanup family and `Gen2` worker cleanup
- why `useAppStore.ts` is the first `Gen3` target
- how this generation should reduce cross-domain ownership concentration without forcing a risky big-bang rewrite
- which future docs own the real phased decomposition plans

Do not use it for:
- pretending `Gen3` is already implementation-ready everywhere
- replacing the broader `Cleanup` family index or vision
- forcing an immediate multi-store rewrite with no owner-proof or safety plan

## Doc Body

### Generation Goal

Generation 3 should break up oversized ownership sinks by real owner boundary instead of line count.

The first `Gen3` target is `src/app/store/useAppStore.ts` because the current repo read shows that file owning too many unrelated truths at once:
- project content and Browser-facing hierarchy truth
- reference workspace state and staged import structures
- reference/content/environment transform sessions and history math
- workspace selection and console context handoff glue
- Browser drag/drop resolution helpers
- graph build policy and delayed build orchestration
- cross-store synchronization side effects

The goal is not to immediately delete `useAppStore`.

The goal is to:
- keep one honest public app-store surface while the internals are decomposed
- extract domain helpers, selectors, and mutation/orchestration seams into real modules
- leave each later runtime slice with a smaller owner boundary and fewer unrelated reasons to change

### Current Routing

- `Future/Gen3 - Cleanup 1 - useAppStore Ownership Decomposition.md`
  - phased plan for splitting `useAppStore.ts` by owner boundary while preserving one public facade during the migration
- `Future/Gen3 - Cleanup 2 - useSpaghettiStore Ownership Decomposition.md`
  - phased plan for splitting `useSpaghettiStore.ts` by owner boundary while preserving one public facade during the migration
- `Future/Gen3 - Cleanup 3 - ViewportOverlay Runtime Surface Decomposition.md`
  - phased plan for shrinking `ViewportOverlay.tsx` into smaller overlay helper, panel, and shell seams after the store-side cleanup is smaller
- `Future/Gen3 - Cleanup 4 - Viewer Runtime Boundary Decomposition.md`
  - phased plan for shrinking `Viewer.ts` into clearer runtime subsystems after the store and overlay seams are better isolated

### No-Widening Rule

Gen 3 setup does not implement runtime behavior.

It must not:
- add new stores just because the current one is large
- rewrite Browser, viewer, or graph-runtime ownership decisions already locked by earlier cleanup lanes
- silently move truth from `useAppStore` into UI controllers
- mix `useAppStore` decomposition with `useSpaghettiStore`, `Viewer.ts`, or `ViewportOverlay.tsx` refactors in the same first lane

### Acceptance Read

Gen 3 planning setup is acceptable when the Cleanup family has:
- one scan index for oversized ownership-sink cleanup
- one concrete future doc for `useAppStore.ts`
- one concrete next-lane future doc for `useSpaghettiStore.ts`
- queued later-lane future docs for `ViewportOverlay.tsx` and `Viewer.ts`
- an explicit rule that decomposition follows owner seams before line count
- a plan that keeps migration risk low by preserving one public facade until the new modules are proven
- visible implementation ladders where each phase is small enough for one Codex pass

## Wishlist Organization

### High Level Goals

- [ ] `Cleanup-Gen3-HLG-1` - Break `useAppStore.ts` into smaller honest ownership seams without inventing second owners for Browser, project content, transforms, or build/runtime truth.
- [ ] `Cleanup-Gen3-HLG-2` - Reduce change risk by keeping the migration incremental, typed, and proofable instead of turning the first pass into a big-bang app-state rewrite.
- [ ] `Cleanup-Gen3-HLG-3` - Leave a repeatable decomposition pattern that later `Gen3` cleanup targets such as `useSpaghettiStore.ts`, `ViewportOverlay.tsx`, or `Viewer.ts` can inherit if they still need it after the first lane ships.

### Codex Level Goals

- [ ] `Cleanup-Gen3-CLG-1` - Reconfirm the exact `useAppStore.ts` owner map and lock the decomposition boundary before source changes.
- [ ] `Cleanup-Gen3-CLG-2` - Define a phased internal-module extraction plan that preserves one exported `useAppStore` facade during migration.
- [ ] `Cleanup-Gen3-CLG-3` - Sequence `useAppStore.ts` extraction into small owner slices such as project content, reference workspace, transform sessions, selection/context, and build orchestration.
- [ ] `Cleanup-Gen3-CLG-4` - Define the proof, verification, and handoff rules that decide when later `Gen3` sink targets should start.

## [x] `Gen 3 - Cleanup 1` - `useAppStore Ownership Decomposition`

Planning doc:
- `Future/Gen3 - Cleanup 1 - useAppStore Ownership Decomposition.md`

Status:
- `Phase 1` implemented as the owner-map and migration-rule lock
- `Phase 2 - Pure Types Helpers And Selector Extraction` implemented as the first real pure helper/selector extraction pass
- `Phase 3 - Project Content And Reference Workspace Slice Extraction` implemented as the first content/reference owner-area slice plus type-surface tightening pass
- `Phase 4 - Transform Selection And Context Extraction` is now complete after the landed `Phase 4.1` transform-session action slice closed the remaining boundary honestly
- `Phase 5` remains the overall build-policy and orchestration family concern
- `Phase 5.1 - Browser Build Policy Slice Extraction` is now complete as the first `builds/` owner-area slice
- `Phase 5.2 - Delayed Placeholder And Request Intent Extraction` is now complete as the second `builds/` owner-area slice
- `Phase 5.3 - Browser Release And Export Flow Extraction` is now complete as the third `builds/` owner-area slice
- `Phase 5.4 - Project Sync And File-Tail Subscription Extraction` is now complete as the fourth `builds/` owner-area slice
- `Phase 6.1 - Root Facade Shrink` is now complete as the final code-side facade cleanup pass
- `Phase 6.2 - Gen3 Closeout And Next Target Handoff` is now complete as the final docs-only closeout pass
- `Gen 3 - Cleanup 1` is now honestly complete
- should preserve one exported `useAppStore` facade until the domain module seams are proven

## [ ] `Gen 3 - Cleanup 2` - `useSpaghettiStore Ownership Decomposition`

Planning doc:
- `Future/Gen3 - Cleanup 2 - useSpaghettiStore Ownership Decomposition.md`

Status:
- `Phase 1 - Owner Map And Migration Rules Lock` is now complete
- `Phase 2 - Pure Types And Accepted Runtime Helper Extraction` is now complete
- the broad `Phase 3` history concern is now intentionally narrowed
- `Phase 3.1 - Geometry Sketch History Helper Extraction` is now complete
- `Phase 3.2 - Geometry Sketch Commit Adapter Extraction` is now complete
- `Phase 3.3 - Part Feature History Adapter Extraction` is now complete
- `Phase 3.4 - Graph Node History Adapter Extraction` is now complete
- the full `Phase 3` history lane is now honestly closed
- `Phase 4.1 - Sketch Plane Pick Command Session Extraction` is now complete
- `Phase 4.2 - Sketch Plane Pick Draft Transform Extraction` is now complete
- `Phase 4.3 - Geometry Sketch Plane Graph Write Extraction` is now complete
- `Phase 4.4 - Geometry Sketch Session Lifecycle Extraction` is now complete
- the broad `Phase 4.5` draw-session concern is now intentionally narrowed
- `Phase 4.5.1 - Draw Session Control Extraction` is now complete
- `Phase 4.5.2 - Draw Draft Commit And Undo Extraction` is now complete
- `Phase 4.6 - Geometry Sketch Selection Action Extraction` is now complete
- `Phase 4.7 - Geometry Sketch Component Edit Action Extraction` is now complete
- the full sketch-session action lane is now honestly closed
- the broad `Phase 5.1` selector concern is now intentionally narrowed
- `Phase 5.1 - Active Graph Runtime Selector Extraction` is now prepared as a dedicated parent selector lane with its own `##` section in the family doc
- `Phase 5.1.1 - Graph Document And Runtime Selector Extraction` is now complete
- `Phase 5.1.2 - Graph Output And Viewer Target Selector Extraction` is now the next implementation target
- the first selector handoff is now landed in `src/app/spaghetti/selectors/selectGraphDocumentRuntime.ts`, while the broader viewer-target, output-surface, and preview-preparation projections remain in `useSpaghettiStore.ts` for the next follow-up slice
- `Phase 5.1` through `Phase 5.3` now own the selector lane one cluster at a time
- `Phase 6.1` through `Phase 6.2` now own the final facade shrink and closeout handoff

## [ ] `Gen 3 - Cleanup 3` - `ViewportOverlay Runtime Surface Decomposition`

Planning doc:
- `Future/Gen3 - Cleanup 3 - ViewportOverlay Runtime Surface Decomposition.md`

Status:
- queued after `Gen 3 - Cleanup 2`
- phases are pre-split into helper, sketch-plane, sketch-session, result/HUD, and shell-shrink slices so the lane does not start as one giant overlay rewrite

## [ ] `Gen 3 - Cleanup 4` - `Viewer Runtime Boundary Decomposition`

Planning doc:
- `Future/Gen3 - Cleanup 4 - Viewer Runtime Boundary Decomposition.md`

Status:
- queued after the store-side and overlay-side Gen3 cleanup
- phases are pre-split into camera/lifecycle, transform runtime, sketch runtime, workspace-selection, and final facade-shrink slices

### Current Read

- `Gen 3 - Cleanup 1` is now fully complete and leaves behind the shipped pattern of one public facade over explicit owner-area modules
- earlier cleanup lanes already locked important owner rules this plan must preserve:
  - project content hierarchy remains app-store truth
  - Browser rows stay derived only
  - transform sessions remain app-store truth
  - graph runtime and accepted build results remain `useSpaghettiStore` truth
  - workspace layout remains `useWorkspaceStore` truth
- the next concrete sink is now `useSpaghettiStore.ts`, which still concentrates graph-runtime truth, accepted build/result shaping, graph-edit history helpers, sketch sessions, selectors, and workspace-facing read-model seams in one file
- the first approved extraction inside that sink is now the accepted-runtime type and helper seam under a new `graphRuntime/*` owner area, while history, sketch-session, and selector moves remain deliberately deferred to later phases
- `ViewportOverlay.tsx` remains the strongest queued UI-side sink after the store lane because it still mixes helper bulk, sketch VMs, store wiring, and multiple panel surfaces in one component
- `Viewer.ts` remains the strongest queued viewer-runtime sink after the overlay lane because it still mixes camera, transform, sketch, workspace-selection, and lifecycle subsystems inline
- the generation now has three visible post-`useAppStore` family docs whose phases are intentionally small enough for one Codex pass each instead of one vague later cleanup blob

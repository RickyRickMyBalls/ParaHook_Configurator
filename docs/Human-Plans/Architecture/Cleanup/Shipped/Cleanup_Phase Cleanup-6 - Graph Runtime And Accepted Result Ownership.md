# Cleanup Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership

## Doc Header

### Doc History
12. 2026-04-13 07:07:53: Closed out `Cleanup 6 - Graph Runtime And Accepted Result Ownership` as a shipped cleanup lane by marking the parent record complete after all five internal phases landed, preparing this standalone record for move into `Cleanup/Shipped/`, and repointing the cleanup family index plus the recent live changelog links so the accepted-result ownership lane now reads as finished history instead of an in-progress future path
11. 2026-04-13 07:03:55: Completed `Phase 5 - Prove One Accepted-Result Owner Remains` as a focused proof-and-verification pass by tightening the shared `buildViewportResultSelectorOptions.test.ts` seam so it now proves browser policy can suppress viewer-facing preview without re-owning graph-runtime accepted draft truth, then verifying the central selector contract, the shared helper seam, the main host-visible viewport layer surface in `ViewerHost.test.tsx`, and the runtime-inspector derived-read dock surface in `PrimaryViewportLeftDock.test.tsx` alongside `cmd /c npm.cmd run build`
10. 2026-04-13 06:56:47: Tightened `Phase 5 - Prove One Accepted-Result Owner Remains` into an implementation-ready proof pass by grounding the final work in the live `selectViewportResultState.test.ts` selector contract, the new `buildViewportResultSelectorOptions.test.ts` shared helper seam, the focused visible-layer cases already present in `ViewerHost.test.tsx`, the current overlay read-through seams in `ViewportOverlay.test.tsx`, and the runtime-inspector dock proof in `PrimaryViewportLeftDock.test.tsx` so the lane can verify one accepted-result owner remains without reopening broad store or viewer refactors
9. 2026-04-13 00:14:46: Completed `Phase 4 - Reduce Viewport Result Interpretation Fan-Out` as a focused code-and-verification pass by extracting the duplicated host-side `selectViewportResultState(...)` option assembly into a new shared `buildViewportResultSelectorOptions(...)` seam, repointing both `ViewerHost.tsx` and `ViewportOverlay.tsx` to compose over that shared preparation path while preserving `selectViewportResultState.ts` as the central accepted-result interpretation contract, and verifying with targeted viewport-result tests plus `cmd /c npm.cmd run build`
8. 2026-04-13 00:07:48: Tightened `Phase 4 - Reduce Viewport Result Interpretation Fan-Out` into an implementation-ready code-and-verification pass by grounding the next work in the live duplicated `selectViewportResultState(...)` input assembly across `ViewerHost.tsx` and `ViewportOverlay.tsx`, preserving `selectViewportResultState.ts` as the central accepted-result selector contract, and narrowing the intended change to extracting one honest shared viewport-result input seam without widening into viewer-engine or graph-runtime ownership cleanup
7. 2026-04-13 00:04:00: Completed `Phase 3 - Reduce App And Project Result Surfaces To Honest Derivation` as a focused code-and-verification pass by extracting explicit accepted-publication preparation ahead of app/project rebuilding in `useAppStore.ts`, repointing `buildProjectContentDerivation(...)` so it consumes a narrower accepted-publication input plus carry-forward placement state instead of recomputing graph-runtime publication and suppression policy inline, and verifying with `cmd /c npm.cmd run build` while intentionally preserving `buildGraphPublishedContentSurface(...)` as the honest publication helper and keeping `selectRenderedProjectPartSet(...)` as the adjacent downstream consumer seam for later cleanup
6. 2026-04-12 23:55:59: Tightened `Phase 3 - Reduce App And Project Result Surfaces To Honest Derivation` into an implementation-ready code-and-verification pass by narrowing the next work to the locked `useAppStore.ts` app/project drift seam where `syncCurrentProjectFromSpaghetti(...)` and `buildProjectContentDerivation(...)` currently combine graph-runtime-owned accepted publication with browser suppression policy, prior placement compatibility, and project-content rebuilding, while explicitly keeping `buildGraphPublishedContentSurface(...)` as the honest accepted-publication helper and carrying `selectRenderedProjectPartSet(...)` as the adjacent downstream seam to keep in view without widening the pass into viewport cleanup
5. 2026-04-12 23:53:24: Completed `Phase 2 - Trace Accepted-Result Projection Drift` as a docs-and-verification pass by classifying the live app/project accepted-publication seam in `syncCurrentProjectFromSpaghetti(...)` plus `buildProjectContentDerivation(...)`, the downstream rendered-part seam in `selectRenderedProjectPartSet(...)`, the accepted publication helper in `buildGraphPublishedContentSurface(...)`, the central viewport selector contract in `selectViewportResultState.ts`, the repeated selector-input fan-out in `ViewerHost.tsx` and `ViewportOverlay.tsx`, and the derived inspector seam in `runtimeInspectorVm.ts` into explicit honest-projection, acceptable-policy, compatibility-residue, and owner-like-drift buckets so later cleanup can target the real app/project and viewport-result seams without reopening the accepted-result owner baseline
4. 2026-04-12 23:53:24: Tightened `Phase 2 - Trace Accepted-Result Projection Drift` into an implementation-ready docs-and-verification pass by grounding the hotspot inventory in the live app/project accepted-publication seams in `useAppStore.ts` and `outputSurface.ts`, the viewport accepted-result interpretation seam in `selectViewportResultState.ts`, the repeated selector-input fan-out in `ViewerHost.tsx` and `ViewportOverlay.tsx`, and the honest derived inspector seam in `runtimeInspectorVm.ts` so the next pass can classify real downstream drift and lock the highest-leverage app/project and viewport cleanup targets without widening into code changes yet
3. 2026-04-12 23:52:10: Completed `Phase 1 - Reconfirm Graph Runtime As The Accepted-Result Owner` as a docs-and-verification pass by re-reading the cleanup and repo-vision owner rules against the live `GraphRuntimeState`, accepted-result mutation and promotion paths in `useSpaghettiStore.ts`, the accepted publication seam in `outputSurface.ts`, and the downstream app/project/viewer consumers in `useAppStore.ts`, `selectViewportResultState.ts`, `ViewerHost.tsx`, `ViewportOverlay.tsx`, and `runtimeInspectorVm.ts`, then locking one explicit baseline where graph runtime state remains the canonical accepted-result owner while project, viewport, Browser, and inspector surfaces stay derived
2. 2026-04-12 23:46:42: Tightened this standalone `Cleanup 6` phase doc into an implementation-ready cleanup lane by aligning it to `Cleanup-Index.md`, `Cleanup-Vision.md`, `Canonical-Ownership-Targets.md`, `Canonical-Owner-Decisions.md`, `docs/Vision.md`, and `docs/Human-Plans/roadmap/Vision-roadmap.md`, grounding it in the live `useSpaghettiStore.ts`, `useAppStore.ts`, `outputSurface.ts`, `selectViewportResultState.ts`, `ViewerHost.tsx`, `ViewportOverlay.tsx`, and `runtimeInspectorVm.ts` seams while splitting the middle work into separate app/project-derivation and viewport-result-derivation phases so the accepted-result ownership cleanup can be implemented in narrower honest passes
1. 2026-04-12 13:42: Created this standalone `Cleanup 6` future phase doc to hold the graph-runtime accepted-result ownership lane under the Cleanup family

### Purpose

This doc defines the sixth cleanup phase for the `Cleanup` family.

Use it to answer:
- where accepted graph/build result truth should live
- what should remain derived from graph runtime acceptance
- how this cleanup lane should be sequenced before implementation starts

Do not use it for:
- full Spaghetti store split planning
- worker scheduling redesign outside accepted-result ownership
- Browser hierarchy cleanup except where it depends on derived accepted-result presentation

### Relationship To Other Docs

- `../Cleanup-Index.md`
- `../Cleanup-Vision.md`
- `../Canonical-Ownership-Targets.md`
- `../Canonical-Owner-Decisions.md`

## Doc Body

## [x] Cleanup 6 - Graph Runtime And Accepted Result Ownership

### Header

Purpose:
- keep graph document truth and accepted build-result truth clearly canonical in graph runtime state inside `useSpaghettiStore` while reducing app/project/Browser/viewer presentation to derived consumers

Owns:
- accepted-result ownership clarity
- graph runtime versus app presentation boundary
- one-owner direction for graph-local result acceptance

Does not own:
- full store decomposition for every graph concern
- worker request lifecycle ownership beyond the accepted-result boundary
- viewer engine-runtime ownership

### Why This Phase Exists

The cleanup family already says one of the clearest spread-truth hotspots is:
- accepted build output versus app/project presentation

The live repo mostly agrees on the intended owner:
- graph runtime state inside `useSpaghettiStore`

But several downstream surfaces still touch the same story:
- app-side project-content derivation
- rendered project-part derivation
- viewport result selection and fallback rules
- runtime inspector summaries

This phase exists so we can:
1. lock the owner baseline,
2. classify which downstream seams are honest projection versus drift,
3. then narrow the app/project and viewport-result seams separately instead of doing one broad refactor.

### Scope

This phase covers:
- graph runtime acceptance ownership
- accepted draft and authoritative result ownership
- accepted build bundle and publication ownership
- derived app/project/Browser/viewer presentation over accepted graph truth

This phase does not cover:
- every graph-editing concern
- viewer engine-state cleanup
- worker scheduling semantics that belong to `buildDispatcher`

### Current Read

The live repo already has the intended accepted-result owner, but the downstream presentation story is spread across a few large seams.

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already defines the accepted-result owner surface in `GraphRuntimeState`
  - already owns accepted bundle, accepted preview bundle, accepted authoritative and draft geometry, accepted outputs, accepted impact, staged authoritative preview state, and `outputSurface`
  - already localizes acceptance and promotion through:
    - `acceptGraphBuildResult(...)`
    - `stageAuthoritativePreviewGraphBuildResult(...)`
    - `promoteStagedAuthoritativePreviewResult(...)`
- `src/app/spaghetti/outputSurface.ts`
  - already reads as a graph-runtime-owned publication seam
  - `buildGraphOutputSurface(...)` derives accepted publication from accepted bundle/output truth
  - `buildGraphPublishedContentSurface(...)` derives project-facing published rows from graph plus accepted output surface
- `src/app/store/useAppStore.ts`
  - already derives `currentProject` and `projectContent` from Spaghetti state through `syncCurrentProjectFromSpaghetti(...)`
  - already derives rendered project parts through `selectRenderedProjectPartSet(...)`
  - but app-side projection, browser build policy, runtime placement overlays, and rendered-part shaping all meet there
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - is already the main selector contract for visible accepted-versus-preview result behavior
  - this is good, but `ViewerHost.tsx` and `ViewportOverlay.tsx` still assemble a wide accepted-result option bag around it
- `src/app/store/runtimeInspectorVm.ts`
  - currently reads as an honest presentation seam over `acceptedBuildImpact`

### Locked Direction

- graph documents and graph runtime truth live in `useSpaghettiStore`
- accepted draft and accepted authoritative result truth live in graph runtime state
- accepted build bundles, outputs, impact, and `outputSurface` stay graph-runtime-owned
- app-level project content, Browser-facing result/status surfaces, rendered project-part sets, and viewport result presentation derive from graph runtime acceptance
- viewport result mode and browser execution policy may influence what is requested or shown
  - they do not become accepted-result owners
- `Graph Documents` and `Content` stay distinct
- accepted-result ownership should not be split across several presentation layers that each reinterpret accepted truth independently

### Phase Ladder

## [x] Phase 1 - Reconfirm Graph Runtime As The Accepted-Result Owner

Purpose:
- lock one explicit current owner baseline for accepted-result truth before later cleanup starts

Current read:
- `GraphRuntimeState` plus `acceptGraphBuildResult(...)`, `stageAuthoritativePreviewGraphBuildResult(...)`, `promoteStagedAuthoritativePreviewResult(...)`, and `buildGraphOutputSurface(...)` already show the owner answer in code

Read:
- `Phase 1` should stay a docs-and-verification pass

Locked in-scope:
- restate the canonical owner for:
  - accepted build bundle
  - accepted preview bundle
  - accepted authoritative and draft geometry
  - accepted outputs and preview outputs
  - accepted build impact
  - accepted graph revisions
  - staged authoritative preview state
  - accepted publication surface
- make explicit that app/project/viewer/Browser result surfaces are derived consumers
- name the main `Phase 2` hotspot candidates

Locked out-of-scope:
- changing runtime code
- changing project-content derivation
- changing viewport result behavior

Strongest live repo seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/store/runtimeInspectorVm.ts`

Initial owner-baseline anchors:
- canonical owner type:
  - `GraphRuntimeState`
- canonical mutation/promotion commands:
  - `acceptGraphBuildResult(...)`
  - `stageAuthoritativePreviewGraphBuildResult(...)`
  - `promoteStagedAuthoritativePreviewResult(...)`
- canonical publication seam:
  - `buildGraphOutputSurface(...)`
- main downstream seams to inventory next:
  - `syncCurrentProjectFromSpaghetti(...)`
  - `buildProjectContentDerivation(...)`
  - `selectRenderedProjectPartSet(...)`
  - `selectViewportResultState.ts`
  - `ViewerHost.tsx`
  - `ViewportOverlay.tsx`
  - `runtimeInspectorVm.ts`

Implementation spec:
1. Re-read the cleanup family direction and owner-decision docs.
2. Re-read the repo vision guidance that canonical truth should stay in one owner and presentation should stay derived.
3. Re-scan the live accepted-result owner seams in the files above.
4. Write one explicit baseline that answers:
   - which accepted-result fields are canonical in graph runtime state
   - which downstream surfaces are derived only
   - which policy seams affect request/display behavior without becoming owners
   - which nearby seams should be treated as the main `Phase 2` hotspot candidates
5. Stop once `Phase 2` can inventory drift against that locked baseline.

Stop rule:
- do not widen this into runtime cleanup or selector redesign

Checklist:
- [x] re-read cleanup family direction and owner-decision docs
- [x] re-read repo vision rules for one canonical owner and derived presentation
- [x] scan live accepted-result owner and projection seams
- [x] write one explicit accepted-result owner baseline
- [x] make app/project/viewer/Browser derivation explicit
- [x] identify the main `Phase 2` hotspot seams without fixing them yet
- [x] stop before code edits

Verification:
- manually confirm in source that `GraphRuntimeState` still owns accepted bundle, geometry, outputs, impact, and `outputSurface`
- manually confirm accepted-result updates still localize to `useSpaghettiStore.ts`
- confirm `outputSurface.ts`, `useAppStore.ts`, `selectViewportResultState.ts`, `ViewerHost.tsx`, `ViewportOverlay.tsx`, and `runtimeInspectorVm.ts` read as downstream consumers rather than owners

Accepted-result owner baseline:
- canonical owner:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- canonical truth:
  - accepted bundle and preview bundle
  - accepted authoritative and draft geometry
  - accepted outputs and preview outputs
  - accepted build impact
  - accepted authoritative and draft graph revisions
  - staged authoritative preview state
  - `outputSurface`
- canonical mutation path:
  - acceptance and promotion stay at the graph runtime boundary
- accepted publication:
  - `buildGraphOutputSurface(...)` is a graph-runtime-owned publication seam
  - `buildGraphPublishedContentSurface(...)` is downstream projection
- downstream derived consumers:
  - `useAppStore.ts`
  - `selectRenderedProjectPartSet(...)`
  - `selectViewportResultState.ts`
  - `ViewerHost.tsx`
  - `ViewportOverlay.tsx`
  - `runtimeInspectorVm.ts`
- policy versus ownership:
  - viewport result mode, browser execution policy, browser interaction state, and delayed build placeholders stay policy or scheduling state, not accepted-result ownership

Implementation result:
- `GraphRuntimeState` remains the canonical accepted-result owner surface.
- accepted-result mutation still localizes to `acceptGraphBuildResult(...)`, `stageAuthoritativePreviewGraphBuildResult(...)`, and `promoteStagedAuthoritativePreviewResult(...)` inside `useSpaghettiStore.ts`.
- `buildGraphOutputSurface(...)` remains the graph-runtime-owned accepted publication seam rather than an app-owned competing result store.
- `useAppStore.ts` still reads as the downstream project and rendered-part derivation seam, not a second accepted-result owner.
- `selectViewportResultState.ts` remains the main visible accepted-versus-preview selector contract, while `ViewerHost.tsx` and `ViewportOverlay.tsx` remain the largest downstream fan-out seams to classify next.
- `runtimeInspectorVm.ts` remains an honest derived presentation seam over `acceptedBuildImpact`.
- the main `Phase 2` hotspots are now locked as:
  - app/project derivation:
    - `syncCurrentProjectFromSpaghetti(...)`
    - `buildProjectContentDerivation(...)`
    - `buildGraphPublishedContentSurface(...)`
    - `selectRenderedProjectPartSet(...)`
  - viewport/result interpretation:
    - `selectViewportResultState.ts`
  - selector-input fan-out:
    - `ViewerHost.tsx`
    - `ViewportOverlay.tsx`

## [x] Phase 2 - Trace Accepted-Result Projection Drift

Purpose:
- classify the main downstream accepted-result seams so later cleanup can target real drift instead of treating every reader as equally suspect

Current read:
- `Phase 1` already locked graph runtime state as the accepted-result owner and named the main downstream reader bands
- the strongest current app/project projection seam is still:
  - `syncCurrentProjectFromSpaghetti(...)`
  - `buildProjectContentDerivation(...)`
  - `buildGraphPublishedContentSurface(...)`
  - `selectRenderedProjectPartSet(...)`
- the strongest current viewport/result interpretation seam is still:
  - `selectViewportResultState.ts`
- the strongest repeated fan-out seam is still:
  - `ViewerHost.tsx`
  - `ViewportOverlay.tsx`
- `runtimeInspectorVm.ts` still reads as the clearest honest derived presentation seam over graph-runtime-owned `acceptedBuildImpact`

Read:
- `Phase 2` should stay a docs-and-verification pass
- the job here is not to fix the seams yet
- the job is to classify them honestly and lock one named implementation target for `Phase 3` and one named implementation target for `Phase 4`

Locked in-scope:
- inventory the live downstream accepted-result seams named by `Phase 1`
- classify each seam into:
  - honest projection
  - acceptable policy/presentation state
  - compatibility residue
  - owner-like drift
- distinguish app/project derivation drift from viewport/result interpretation drift
- identify the highest-leverage app/project cleanup target for `Phase 3`
- identify the highest-leverage viewport/result cleanup target for `Phase 4`
- explicitly preserve any seam that already reads as honest derived presentation

Locked out-of-scope:
- changing runtime code
- changing selector contracts yet
- changing `useSpaghettiStore.ts`
- rewriting viewer hosts
- changing worker lifecycle or build-dispatch semantics

Strongest live repo seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/store/runtimeInspectorVm.ts`

Initial hotspot anchors:
- app/project accepted-publication derivation:
  - `syncCurrentProjectFromSpaghetti(...)`
  - `buildProjectContentDerivation(...)`
  - `buildGraphPublishedContentSurface(...)`
  - `selectRenderedProjectPartSet(...)`
- viewport accepted-result interpretation:
  - `selectViewportResultState.ts`
- selector-input fan-out around the viewport selector contract:
  - `ViewerHost.tsx`
  - `ViewportOverlay.tsx`
- honest derived presentation seam to preserve:
  - `runtimeInspectorVm.ts`

Preferred implementation shape:
- keep this as a docs-and-verification pass
- write one explicit hotspot inventory inside this doc
- classify the seams without trying to solve them in the same pass
- stop once later phases can target named live seams instead of a broad "presentation drift" story

Implementation spec:
1. Re-read the locked `Phase 1` accepted-result owner baseline in this doc.
2. Re-scan the live downstream seams in `useAppStore.ts`, `outputSurface.ts`, `selectViewportResultState.ts`, `ViewerHost.tsx`, `ViewportOverlay.tsx`, and `runtimeInspectorVm.ts`.
3. Classify each seam into:
   - honest projection
   - acceptable policy/presentation state
   - compatibility residue
   - owner-like drift
4. Record which seam should become the main implementation target for:
   - `Phase 3 - Reduce App And Project Result Surfaces To Honest Derivation`
   - `Phase 4 - Reduce Viewport Result Interpretation Fan-Out`
5. Record which seam should be explicitly preserved as honest derived presentation so later phases do not "clean up" the wrong thing.
6. Stop once the lane has one explicit hotspot inventory and two named follow-on targets.

Stop rule:
- `Phase 2` is ready to implement once the repo has one explicit hotspot inventory for downstream accepted-result projection drift
- do not widen this into code cleanup or test work yet

Checklist:
- [x] re-read the locked `Phase 1` baseline
- [x] scan the main downstream accepted-result seams
- [x] classify each seam into honest projection, acceptable presentation, compatibility residue, or owner-like drift
- [x] identify the highest-leverage app/project derivation target
- [x] identify the highest-leverage viewport/result target
- [x] identify the honest derived seam that should be preserved explicitly
- [x] stop before code edits

Target output:
- one explicit hotspot inventory for downstream accepted-result projection drift

Done shape:
- later cleanup can target the real app/project and viewport/result drift seams instead of treating all accepted-result readers as equally problematic
- `Phase 3` and `Phase 4` each have one named implementation target
- the lane keeps an explicit honest-derived presentation seam in view so later cleanup stays disciplined

Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`

Verification:
- manually re-read the locked `Phase 1` baseline in this doc
- manually confirm in source that the hotspot inventory points at the real current seams:
  - app/project accepted-publication derivation in `useAppStore.ts` and `outputSurface.ts`
  - viewport interpretation in `selectViewportResultState.ts`
  - selector-input fan-out in `ViewerHost.tsx` and `ViewportOverlay.tsx`
  - honest derived impact presentation in `runtimeInspectorVm.ts`
- confirm the resulting inventory keeps graph runtime as the accepted-result owner while naming narrower downstream drift candidates

Hotspot inventory:
- honest projection:
  - `buildGraphPublishedContentSurface(...)` in `src/app/spaghetti/outputSurface.ts`
    - derives project-facing published rows from graph plus graph-runtime-owned `outputSurface`
    - reads as the correct downstream publication helper rather than as a competing accepted-result owner
  - `selectViewportResultState.ts`
    - remains the central selector contract for visible accepted-versus-preview result meaning
    - this is the right home for viewport-level accepted-result interpretation
  - `runtimeInspectorVm.ts`
    - reads accepted impact directly from graph runtime state and formats it for presentation
    - this should be preserved as an honest derived seam rather than "cleaned up" into another owner move
- acceptable policy and presentation state:
  - `selectShouldSuppressBrowserGraphRuntimeOutput(...)`
  - viewport result mode
  - browser execution policy
  - browser interaction state and delayed build placeholders
    - these influence request or visibility policy
    - they should remain explicit policy inputs rather than being treated as accepted-result ownership
- compatibility residue:
  - the app/project derivation seam still carries previous placement overlay, previous row ordering, and runtime-output suppression compatibility concerns through `buildProjectContentDerivation(...)`
  - those concerns are not themselves accepted-result ownership, but they widen the app-side derivation seam and make it easier for accepted-result meaning to feel re-decided there
- owner-like drift:
  - `syncCurrentProjectFromSpaghetti(...)` plus `buildProjectContentDerivation(...)` in `src/app/store/useAppStore.ts`
    - this is the main app/project drift seam because graph-runtime-owned accepted publication, browser policy, previous placement overlay, and project-content rebuilding all converge in one broad pass
  - `selectRenderedProjectPartSet(...)`
    - this is the main downstream rendered-part drift seam because it re-reads accepted build bundle and accepted build outputs under suppression policy while also shaping viewer-ready project render data
  - `ViewerHost.tsx` and `ViewportOverlay.tsx`
    - these are the main viewport fan-out seams because both hosts rebuild a large accepted-result option bag around the same `selectViewportResultState(...)` contract

Implementation result:
- the highest-leverage `Phase 3` app/project target is now locked as:
  - `syncCurrentProjectFromSpaghetti(...)` plus `buildProjectContentDerivation(...)`
    - with `selectRenderedProjectPartSet(...)` carried as the adjacent downstream seam to keep in view during that pass
- the highest-leverage `Phase 4` viewport/result target is now locked as:
  - the repeated selector-input fan-out in `ViewerHost.tsx` and `ViewportOverlay.tsx`
    - while preserving `selectViewportResultState.ts` as the central selector contract rather than treating it as the thing to dismantle
- the seam that should be explicitly preserved as honest derived presentation is:
  - `runtimeInspectorVm.ts`
- the accepted-result owner baseline from `Phase 1` remains unchanged:
  - graph runtime state stays the owner
  - downstream app/project/viewer surfaces are now classified against that owner instead of re-litigating it

## [x] Phase 3 - Reduce App And Project Result Surfaces To Honest Derivation

Purpose:
- narrow the strongest app/project-side accepted-result drift seams so project content and rendered project surfaces read more clearly as derivation over graph-runtime-owned publication

Current read:
- `Phase 2` already locked the highest-leverage app/project target as:
  - `syncCurrentProjectFromSpaghetti(...)`
  - `buildProjectContentDerivation(...)`
- the live seam is broad for one main reason:
  - graph-runtime-owned accepted publication
  - browser suppression policy
  - previous placement compatibility
  - project-content rebuilding
  - runtime placement overlay rebuilding
  all currently converge in the same derivation pass
- two nearby seams need to be handled carefully:
  - `buildGraphPublishedContentSurface(...)`
    - currently reads as honest projection and should be preserved as the publication helper
  - `selectRenderedProjectPartSet(...)`
    - currently reads as the adjacent downstream rendered-part consumer and should stay in view so the app/project cleanup does not just push the same broad interpretation farther downstream

Read:
- `Phase 3` should be a focused code-and-verification pass
- it should target the broad app/project derivation seam in `useAppStore.ts`
- it should not widen into viewport selector cleanup, viewer host cleanup, or a broad rework of every published-content helper

Locked in-scope:
- narrow the main app/project drift seam in:
  - `syncCurrentProjectFromSpaghetti(...)`
  - `buildProjectContentDerivation(...)`
- make the accepted-publication input to app/project derivation read more explicitly as graph-runtime-owned upstream truth
- reduce any unnecessary accepted-result interpretation that currently lives in the broad app-store derivation pass
- keep project content ownership in `useAppStore.ts`
- keep `buildGraphPublishedContentSurface(...)` as the honest publication helper unless a very small helper-shape repoint is needed
- keep `selectRenderedProjectPartSet(...)` in view as the adjacent downstream seam so the cleanup can verify it still reads from an honest app/project result surface after the narrowing

Locked out-of-scope:
- viewport result-mode cleanup
- `ViewerHost.tsx` or `ViewportOverlay.tsx` fan-out cleanup
- broad viewer rendering refactors
- worker lifecycle cleanup
- changing graph runtime as the accepted-result owner
- turning `Phase 3` into a full `useAppStore.ts` decomposition

Strongest live repo seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/outputSurface.ts`

Initial target anchors:
- broad app/project derivation seam:
  - `syncCurrentProjectFromSpaghetti(...)`
  - `buildProjectContentDerivation(...)`
- honest accepted-publication helper to preserve:
  - `buildGraphPublishedContentSurface(...)`
- adjacent downstream seam to keep in view:
  - `selectRenderedProjectPartSet(...)`

Preferred implementation shape:
- keep this as a narrow code-and-verification pass
- prefer smaller honest repoints inside the app/project derivation seam over introducing a large new abstraction layer
- make the accepted-publication handoff easier to read without re-owning accepted-result truth in app state
- stop once the broadest app/project derivation seam is narrower and easier to describe, even if `selectRenderedProjectPartSet(...)` remains a later follow-on

Implementation spec:
1. Re-read the locked `Phase 1` owner baseline and `Phase 2` hotspot inventory in this doc.
2. Reconfirm in source that the main app/project drift seam is `syncCurrentProjectFromSpaghetti(...)` plus `buildProjectContentDerivation(...)`, not `buildGraphPublishedContentSurface(...)`.
3. Narrow the app/project derivation path so graph-runtime-owned accepted publication is handed into project-content rebuilding more explicitly and the broad derivation pass carries less mixed accepted-result interpretation.
4. Preserve project content ownership in `useAppStore.ts`.
5. Keep `buildGraphPublishedContentSurface(...)` honest as a downstream publication helper rather than moving accepted-result ownership into app state.
6. Re-scan `selectRenderedProjectPartSet(...)` after the narrowing so the pass confirms it still reads as an adjacent downstream consumer instead of inheriting the same broad drift.
7. Verify that project content derivation, published object/component placement, and Browser-facing project presentation still behave correctly after the narrowing.

Stop rule:
- `Phase 3` is ready to implement once the broad app/project derivation seam in `useAppStore.ts` reads more clearly as derivation over graph-runtime-owned accepted publication
- do not widen this into viewport-result cleanup or a general store split

Checklist:
- [x] re-read the locked `Phase 1` and `Phase 2` baselines
- [x] confirm the main app/project drift seam in source
- [x] preserve `buildGraphPublishedContentSurface(...)` as the honest publication helper
- [x] narrow the app/project accepted-result derivation seam in `useAppStore.ts`
- [x] keep project content ownership in `useAppStore.ts`
- [x] re-scan `selectRenderedProjectPartSet(...)` as the adjacent downstream seam
- [x] verify project-facing accepted-result presentation still behaves correctly
- [x] verify with `cmd /c npm.cmd run build`

Target output:
- one narrower app/project derivation path where accepted publication is read more explicitly from graph-runtime-owned upstream truth instead of being broadly mixed into one large app-store derivation seam

Done shape:
- `syncCurrentProjectFromSpaghetti(...)` and `buildProjectContentDerivation(...)` are easier to describe as app/project derivation over accepted publication
- `buildGraphPublishedContentSurface(...)` remains the honest publication helper
- `selectRenderedProjectPartSet(...)` still reads as an adjacent downstream consumer rather than inheriting the main owner-like drift
- later cleanup can move to viewport-result fan-out without re-fighting the main app/project seam

Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`
- edit `src/app/store/useAppStore.ts`
- edit `src/app/spaghetti/outputSurface.ts` only if a small helper-shape repoint is needed to support the narrowing more honestly

Verification:
- manually re-read the locked `Phase 1` and `Phase 2` sections in this doc
- manually confirm in source that:
  - `syncCurrentProjectFromSpaghetti(...)` and `buildProjectContentDerivation(...)` are the main app/project target seam
  - `buildGraphPublishedContentSurface(...)` remains an honest publication helper
  - `selectRenderedProjectPartSet(...)` still reads as a downstream rendered-part consumer after the narrowing
- run:
  - `cmd /c npm.cmd run build`
- manually confirm project-facing behavior still holds for:
  - published object and component derivation
  - runtime placement carry-forward behavior
  - Browser-facing project content presentation

Implementation result:
- `useAppStore.ts`
  - now prepares accepted publication explicitly through `buildProjectAcceptedPublicationRecords(...)` before the project-content rebuild path runs
  - now passes that accepted-publication input plus a narrower carry-forward placement state into `buildProjectContentDerivation(...)`
- `buildProjectContentDerivation(...)`
  - no longer recomputes graph-runtime publication and browser suppression policy inline while also handling carry-forward placement logic
  - now reads more clearly as project-content rebuilding over already-prepared accepted publication
- `buildGraphPublishedContentSurface(...)`
  - remains the honest accepted-publication helper and was intentionally preserved as the upstream publication seam
- `selectRenderedProjectPartSet(...)`
  - remained unchanged in this pass and still reads as the adjacent downstream rendered-part consumer rather than inheriting the main app/project derivation drift
- build verification passed through `cmd /c npm.cmd run build`

## [x] Phase 4 - Reduce Viewport Result Interpretation Fan-Out

Purpose:
- tighten the main viewport/result interpretation seam so accepted-result display logic is centralized more clearly and `ViewerHost.tsx` plus `ViewportOverlay.tsx` stop feeling like parallel interpreters

Current read:
- `Phase 2` already locked the highest-leverage viewport/result target as:
  - the repeated selector-input fan-out in `ViewerHost.tsx` and `ViewportOverlay.tsx`
  - while preserving `selectViewportResultState.ts` as the main selector contract
- after `Phase 3`, the app/project derivation seam is narrower, which makes the next cleanup target easier to see:
  - both viewport hosts still compute the same broad accepted-result selector option bag
  - both hosts still derive:
    - `activeDraftProjectViewerParts`
    - `currentProjectGraphDocumentIds`
    - browser suppression policy for the current graph document
    - browser execution policy for the current graph document
    - delayed draft and authoritative placeholder flags
  - both hosts then pass that near-duplicate bag into `selectViewportResultState(...)`
- `selectViewportResultState.ts` still reads as the honest centralized accepted-result interpretation seam:
  - requested mode versus mode behavior
  - accepted versus committed geometry inputs
  - artifact-preview and preview-preparation interpretation
  - visible-result fallback and overlay state
  - retained-base and pending-final state

Read:
- `Phase 4` should be a focused code-and-verification pass
- it should target the duplicated selector-input assembly around `selectViewportResultState(...)`
- it should not widen into viewer engine changes, graph runtime ownership changes, or a redesign of the selector's accepted-result rules unless a very small contract cleanup is needed to support the fan-out reduction

Locked in-scope:
- reduce repeated `selectViewportResultState(...)` input assembly across:
  - `src/app/components/ViewerHost.tsx`
  - `src/app/components/ViewportOverlay.tsx`
- preserve `src/app/spaghetti/selectors/selectViewportResultState.ts` as the main accepted-result interpretation contract
- make the shared viewport-result input preparation easier to read and reuse
- keep viewport mode, browser execution policy, interaction state, delayed placeholder state, and artifact-preview suppression as explicit policy inputs
- keep the resulting visible-result, fallback, retained-base, and overlay behavior unchanged

Locked out-of-scope:
- changing graph runtime as the accepted-result owner
- changing app/project accepted-publication derivation
- redesigning `selectViewportResultState.ts` into a different ownership model
- broad `ViewerHost.tsx` or `ViewportOverlay.tsx` decomposition unrelated to viewport-result input preparation
- viewer engine or render-pipeline cleanup
- worker lifecycle cleanup

Strongest live repo seams:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/store/useAppStore.ts`

Initial target anchors:
- central selector contract to preserve:
  - `selectViewportResultState(...)`
- duplicated host-side selector-input assembly:
  - `ViewerHost.tsx`
  - `ViewportOverlay.tsx`
- repeated policy-input helpers that currently get recomposed in both hosts:
  - `selectShouldSuppressBrowserGraphRuntimeOutput(...)`
  - `selectEffectiveBrowserExecutionPolicy(...)`
- adjacent upstream derivation that should remain upstream:
  - `selectRenderedProjectPartSet(...)`

Preferred implementation shape:
- keep this as a narrow code-and-verification pass
- extract or centralize the repeated viewport-result selector-input preparation so both hosts read from one honest seam instead of rebuilding a parallel option bag
- keep `selectViewportResultState.ts` responsible for accepted-result interpretation
- keep browser policy and viewport policy visible as inputs, not hidden ownership transfers
- stop once the duplicated assembly is clearly reduced and the remaining host code reads as composition over the shared viewport-result seam

Implementation spec:
1. Re-read the locked `Phase 1` baseline and `Phase 2` hotspot inventory.
2. Reconfirm in source that the main viewport/result drift seam is the repeated selector-input assembly in `ViewerHost.tsx` and `ViewportOverlay.tsx`, not the selector contract inside `selectViewportResultState.ts`.
3. Introduce one narrower shared preparation seam for the viewport-result selector inputs.
4. Repoint `ViewerHost.tsx` and `ViewportOverlay.tsx` so they use that shared preparation seam instead of rebuilding near-duplicate selector options inline.
5. Preserve `selectViewportResultState.ts` as the contract that interprets accepted-versus-preview result meaning, fallback behavior, retained-base state, and overlay state.
6. Verify that viewport visible-result behavior, artifact-preview suppression behavior, project-draft-preview behavior, delayed-placeholder behavior, and overlay behavior still read correctly after the narrowing.

Stop rule:
- `Phase 4` is ready to implement once the duplicated viewport selector-input fan-out is reduced to one honest shared preparation seam and the hosts no longer read like parallel accepted-result interpreters
- do not widen this into graph-runtime cleanup, viewer-engine cleanup, or a broad selector rewrite

Checklist:
- [x] re-read the locked `Phase 1` and `Phase 2` baselines
- [x] confirm the main viewport/result drift seam in source
- [x] preserve `selectViewportResultState.ts` as the central selector contract
- [x] introduce one narrower shared viewport-result input-preparation seam
- [x] repoint `ViewerHost.tsx` and `ViewportOverlay.tsx` to the shared seam
- [x] keep viewport and browser policy inputs explicit without making them owners
- [x] verify viewport visible-result, fallback, and overlay behavior stays correct
- [x] verify artifact-preview suppression and project-draft-preview behavior stays correct
- [x] verify with targeted tests plus `cmd /c npm.cmd run build`

Target output:
- one shared viewport-result selector-input preparation seam that both viewport hosts use before calling `selectViewportResultState(...)`

Done shape:
- `selectViewportResultState.ts` remains the one obvious accepted-result interpretation contract for viewport display behavior
- `ViewerHost.tsx` and `ViewportOverlay.tsx` stop rebuilding near-duplicate accepted-result selector option bags inline
- viewport mode, browser execution policy, interaction state, delayed-placeholder state, and artifact-preview suppression stay explicit policy inputs rather than hidden ownership seams
- later proof work can test one shared viewport-result preparation path instead of treating the two hosts as separate interpreters

Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`
- edit `src/app/components/ViewerHost.tsx`
- edit `src/app/components/ViewportOverlay.tsx`
- add or edit one shared helper or selector-adjacent file only if needed to hold the shared viewport-result input-preparation seam
- edit `src/app/spaghetti/selectors/selectViewportResultState.ts` only if a very small contract-shape repoint is needed to support the narrowing

Verification:
- manually re-read the locked `Phase 1`, `Phase 2`, and `Phase 3` sections in this doc
- manually confirm in source that:
  - `selectViewportResultState.ts` remains the central viewport-result interpretation contract
  - `ViewerHost.tsx` and `ViewportOverlay.tsx` currently duplicate the selector-input assembly enough to justify one shared seam
  - the shared seam does not move accepted-result ownership away from graph runtime state
- run targeted tests covering viewport-result selection behavior if the existing suite already has those seams
- run:
  - `cmd /c npm.cmd test -- src/app/components/buildViewportResultSelectorOptions.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `cmd /c npm.cmd run build`

Implementation result:
- `src/app/components/buildViewportResultSelectorOptions.ts`
  - now holds one shared pure preparation seam for `selectViewportResultState(...)` inputs
  - centralizes host-side assembly for:
    - active draft project viewer parts
    - project-draft-preview enablement
    - browser execution policy
    - artifact-preview suppression
    - interaction and delayed-placeholder flags
- `src/app/components/ViewerHost.tsx`
  - now composes `selectViewportResultState(...)` over `buildViewportResultSelectorOptions(...)` instead of rebuilding the accepted-result option bag inline
- `src/app/components/ViewportOverlay.tsx`
  - now composes `selectViewportResultState(...)` over the same shared preparation seam instead of maintaining a second near-duplicate inline assembly path
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - remained the central accepted-result interpretation contract and was intentionally preserved rather than broadened into host-policy assembly
- `src/app/components/buildViewportResultSelectorOptions.test.ts`
  - now gives focused proof that the shared preparation seam preserves the expected graph-target policy, suppression, placeholder, and draft-preview inputs before the selector runs
- verification passed through:
  - `cmd /c npm.cmd test -- src/app/components/buildViewportResultSelectorOptions.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `cmd /c npm.cmd run build`

## [x] Phase 5 - Prove One Accepted-Result Owner Remains

Purpose:
- prove that accepted-result changes can now be localized to graph runtime state without reopening app/project/viewer presentation layers as competing owners

Current read:
- `Phase 1` locked the owner baseline:
  - graph runtime state in `useSpaghettiStore.ts` owns accepted result truth
- `Phase 3` narrowed app/project derivation so accepted publication now enters app rebuilding through an explicit handoff instead of broad mixed recomputation
- `Phase 4` narrowed viewport fan-out so both hosts now compose `selectViewportResultState(...)` over one shared `buildViewportResultSelectorOptions(...)` seam
- the strongest current proof surfaces are now:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
    - already proves the central accepted-result selector contract across artifact-preview, fallback, pending-final, retained-base, and overlay cases
  - `src/app/components/buildViewportResultSelectorOptions.test.ts`
    - now proves the shared host-side input-preparation seam around browser policy, suppression, placeholder, and draft-preview inputs
  - `src/app/components/ViewerHost.test.tsx`
    - already has visible-layer proof cases around preview-mesh, artifact-preview, and retained/overlay rendering
  - `src/app/components/ViewportOverlay.test.tsx`
    - currently acts as the main overlay read-through surface and should stay honest about not becoming a second result interpreter
  - `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
    - currently proves the runtime-inspector dock read-through over derived inspector state rather than accepted-result ownership
- the broad store suites:
  - `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - `src/app/store/useAppStore.test.ts`
  should only be touched if the targeted proof sweep exposes a real gap that cannot be covered more honestly in the narrower selector/host/read-through surfaces

Read:
- `Phase 5` should be a focused proof-and-verification pass
- runtime changes should be minimal or zero unless proof exposes an actual regression
- the goal is to prove the final ownership story, not reopen architecture work

Locked in-scope:
- tighten or add focused proof around:
  - the central accepted-result selector contract in `selectViewportResultState.test.ts`
  - the shared host-side preparation seam in `buildViewportResultSelectorOptions.test.ts`
  - at least one visible-layer host rendering surface in `ViewerHost.test.tsx`
  - the overlay read-through surface in `ViewportOverlay.test.tsx` if the shared seam needs explicit downstream proof there
  - the runtime-inspector dock read-through in `PrimaryViewportLeftDock.test.tsx` or the adjacent runtime-inspector proof surface if needed
- prove that accepted-result ownership still localizes to graph runtime state while app/project/viewer surfaces remain derived
- keep the proof targeted to the post-`Phase 3` and post-`Phase 4` seams instead of broad legacy coverage

Locked out-of-scope:
- reopening graph runtime ownership design
- broad `useSpaghettiStore.ts` or `useAppStore.ts` refactors
- broad viewer-engine or overlay feature work
- large new test scaffolding when focused assertions in existing seams are enough
- unrelated Browser cleanup

Strongest live proof surfaces:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/buildViewportResultSelectorOptions.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`

Initial target anchors:
- selector contract proof to preserve and extend if needed:
  - `selectViewportResultState.test.ts`
- shared viewport-result input-preparation proof to preserve and extend if needed:
  - `buildViewportResultSelectorOptions.test.ts`
- host-visible behavior proof:
  - `ViewerHost.test.tsx`
- overlay read-through proof:
  - `ViewportOverlay.test.tsx`
- runtime-inspector derived-read proof:
  - `PrimaryViewportLeftDock.test.tsx`

Preferred implementation shape:
- keep this as a narrow proof pass
- prefer extending the existing selector, helper, and host tests over adding new heavyweight harnesses
- only touch store-level tests if a real ownership-proof gap cannot be closed at the selector or host/read-through layer
- stop once the repo directly proves:
  - graph runtime still owns accepted-result truth
  - app/project/viewer surfaces stay derived
  - browser and viewport policy remain explicit inputs instead of second owners

Implementation spec:
1. Re-read the locked `Phase 1` baseline plus the `Phase 3` and `Phase 4` implementation results.
2. Re-scan the strongest current proof surfaces in:
   - `selectViewportResultState.test.ts`
   - `buildViewportResultSelectorOptions.test.ts`
   - `ViewerHost.test.tsx`
   - `ViewportOverlay.test.tsx`
   - `PrimaryViewportLeftDock.test.tsx`
3. Identify the smallest missing proof cases after the `Phase 3` and `Phase 4` narrowing:
   - owner remains graph runtime
   - app/project/viewer layers are downstream
   - shared helper and selector stay aligned
   - runtime inspector remains derived read-through
4. Tighten or add focused tests in the narrowest existing proof surfaces rather than spreading the same assertion across several suites.
5. Only touch `useSpaghettiStore.test.ts` or `useAppStore.test.ts` if a real owner-proof gap cannot be expressed more honestly in the selector, helper, host, overlay, or dock proof seams.
6. Verify with targeted tests and a full build.

Stop rule:
- `Phase 5` is ready to implement once the repo has direct proof that accepted-result ownership remains localized to graph runtime state and the downstream app/project/viewer surfaces read as derived consumers after the earlier narrowing phases
- do not widen this into another cleanup/refactor pass unless proof exposes a concrete regression

Checklist:
- [x] re-read the locked `Phase 1` baseline plus later implementation results
- [x] scan the strongest current proof surfaces
- [x] identify the smallest missing ownership-proof cases after `Phase 3` and `Phase 4`
- [x] tighten or add focused selector/helper/host/read-through proof coverage
- [x] avoid broad store-suite changes unless a real gap requires them
- [x] keep runtime changes minimal unless proof exposes a real regression
- [x] verify with targeted tests
- [x] verify with `cmd /c npm.cmd run build`

Target output:
- one targeted proof band that directly demonstrates graph runtime remains the accepted-result owner while the post-cleanup app/project/viewer surfaces stay derived

Done shape:
- the central selector contract still has direct proof for accepted-result fallback and visibility semantics
- the shared viewport-result input-preparation seam has direct proof for browser-policy and placeholder inputs
- at least one host-visible rendering seam proves the selector/helper path still surfaces the correct viewport layers
- the runtime-inspector/dock seam still reads as derived presentation rather than a second accepted-result owner
- later cleanup can treat accepted-result ownership as settled because the repo proves the boundary explicitly

Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-6 - Graph Runtime And Accepted Result Ownership.md`
- edit `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- edit `src/app/components/buildViewportResultSelectorOptions.test.ts`
- edit `src/app/components/ViewerHost.test.tsx` if a focused host-visible proof gap remains
- edit `src/app/components/ViewportOverlay.test.tsx` only if the overlay read-through seam needs explicit proof after the shared-helper move
- edit `src/app/workspace/PrimaryViewportLeftDock.test.tsx` only if the runtime-inspector derived-read seam needs explicit confirmation
- edit `src/app/spaghetti/store/useSpaghettiStore.test.ts` or `src/app/store/useAppStore.test.ts` only as a last resort

Verification:
- manually re-read the locked `Phase 1`, `Phase 3`, and `Phase 4` sections in this doc
- manually confirm in source that:
  - graph runtime still owns accepted result truth
  - `selectViewportResultState.ts` remains the central visible-result contract
  - `buildViewportResultSelectorOptions.ts` remains a shared host-side preparation seam rather than an owner move
  - `ViewerHost.tsx`, `ViewportOverlay.tsx`, and the runtime-inspector dock still read as downstream consumers
- run the targeted tests chosen by the implementation pass
- run:
  - `cmd /c npm.cmd test -- src/app/components/buildViewportResultSelectorOptions.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/components/ViewerHost.test.tsx src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - `cmd /c npm.cmd run build`

Implementation result:
- `src/app/components/buildViewportResultSelectorOptions.test.ts`
  - now proves the shared host-side preparation seam can feed browser-policy suppression into the central selector contract without turning browser policy into a second accepted-result owner
  - specifically proves graph-runtime-owned accepted draft geometry remains present in selector state even when viewer-facing preview is suppressed by browser execution policy
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - remained the central accepted-result contract proof surface and passed unchanged, preserving direct proof for fallback, artifact-preview, retained-base, pending-final, and overlay semantics
- `src/app/components/ViewerHost.test.tsx`
  - remained the main host-visible proof surface and passed against the post-`Phase 4` shared helper path, confirming the narrowed selector/helper composition still drives visible viewport layers correctly
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - remained the runtime-inspector derived-read proof surface and passed unchanged, confirming the dock still reads accepted impact as downstream presentation rather than as a second owner
- no runtime code changes were needed in this phase
- verification passed through:
  - `cmd /c npm.cmd test -- src/app/components/buildViewportResultSelectorOptions.test.ts src/app/spaghetti/selectors/selectViewportResultState.test.ts src/app/components/ViewerHost.test.tsx src/app/workspace/PrimaryViewportLeftDock.test.tsx`
  - `cmd /c npm.cmd run build`

### Acceptance Checks

- accepted build-result truth has one obvious canonical owner
- app/project/viewer/Browser result surfaces read as derived consumers
- request and display policy stay explicit without becoming accepted-result ownership
- graph-runtime acceptance is easier to reason about and change safely

### Likely Related Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/store/runtimeInspectorVm.ts`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`

### Success Read

This phase succeeds when:
- accepted-result behavior has one obvious home
- app/project/viewer presentation no longer competes with graph runtime as the owner
- later graph, Browser, and viewport cleanup can treat accepted-result ownership as settled

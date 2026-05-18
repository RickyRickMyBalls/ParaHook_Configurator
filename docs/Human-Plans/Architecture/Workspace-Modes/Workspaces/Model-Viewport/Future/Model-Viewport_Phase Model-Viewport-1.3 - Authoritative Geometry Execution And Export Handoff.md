# `Model-Viewport-1.3` - `Authoritative Geometry Execution And Export Handoff`

## Doc Header

### Doc History
28. 2026-05-17 22:59:05: Marked `Model-Viewport 1.3 Phase 10 - STEP Writer Adapter And Worker Export Operation` shipped after the worker export service started writing real STEP data from retained authoritative OpenCascade `shape_set` resources, added worker export request/result routing, handled OpenCascade MEMFS filename mangling inside the adapter, and proved missing handles, writer failures, multi-shape compound export, and no-draft export behavior with focused tests plus production build verification.
27. 2026-05-17 22:46:30: Prepped `Model-Viewport 1.3 Phase 10 - STEP Writer Adapter And Worker Export Operation` for implementation by grounding the next cut in the live placeholder export service, worker-local authoritative `shape_set` store, OpenCascade STEP writer bindings, worker message routing gap, fake plus real OC verification expectations, and no-draft-mesh export rule.
26. 2026-04-07 16:26: Marked `Model-Viewport 1.3 Phase 9 - Export Gating And On-Demand Authoritative Preparation` shipped after the app store gained the first explicit export-preparation outcome contract, export preparation started reusing accepted authoritative geometry or requesting one forced authoritative build honestly through the existing build path, graph runtime started retaining the in-flight build execution intent so export can recognize authoritative preparation already in progress, and focused app-store tests proved ready versus pending versus blocked export-preparation states without falling back to draft geometry truth
25. 2026-04-07 16:14: Marked `Model-Viewport 1.3 Phase 8 - Export Input Contract From Authoritative Results` shipped after the repo published the first shared `AuthoritativeExportInput` contract plus authoritative-retained-result derivation helper in `src/shared/exportTypes.ts`, aligned the worker export stub in `src/worker/pipeline/exportService.ts` to consume that contract, and added focused export-contract verification, then tightened `Phase 9 - Export Gating And On-Demand Authoritative Preparation` into the next implementation-ready slice by grounding the remaining export-preparation gap in the live accepted-authoritative store selectors, existing authoritative build-request path, and still-missing export request/result routing seam
24. 2026-04-07 09:10: Marked `Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview` shipped after the viewport result selector split authoritative-derived render ownership from the draft artifact bridge, `ViewerHost.tsx` started rendering from selector-owned final-vs-draft truth, and focused selector/viewer tests proved `Final` no longer displays draft geometry under a final label, then tightened `Phase 8 - Export Input Contract From Authoritative Results` into an implementation-ready next slice by grounding the export-input gap in the live `src/shared/exportTypes.ts` placeholder request, `src/worker/pipeline/exportService.ts` build-request-id stub, the retained authoritative-handle seam in `src/shared/geometryResult.ts`, and the still-placeholder export routing room in `src/worker/worker.ts` plus `src/app/buildDispatcher.ts`
23. 2026-04-07 08:43: Tightened `Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview` into an implementation-ready next slice by grounding the remaining viewport-honesty gap in the live `selectViewportResultState.ts` selector, the current `ViewerHost.tsx` `viewer.setParts(...)` artifact-preview bridge, the existing selector-owned status seam, and the first non-null authoritative `meshPreview` now emitted by the `6B / 6C` worker path, while locking `Final` to authoritative-derived render data only and keeping export shaping out of scope
22. 2026-04-07 08:30: Marked `Model-Viewport 1.3 Phase 6C - Backend Failure Honesty And Focused Verification` shipped after the authoritative worker seam started downgrading OC boot/build failures to honest `null` authoritative results, released minted `shape_set` handles on rejected bundle assembly, added focused backend-failure verification, corrected the lingering stale `Phase 6B` summary status, and refreshed the handoff so `Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview` is now next
21. 2026-04-07 08:05: Added the first authoritative-node whitelist to `Model-Viewport 1.3` so the OC-backed path now explicitly starts with `Geometry/Sketch` as authoritative input plus closed-profile `Geometry/Extrude` `Body` outputs and `Part/Cube` only when it lowers into that same sketch-plus-extrude path, then tightened `Phase 6C - Backend Failure Honesty And Focused Verification` into an implementation-ready hardening slice around that whitelist, null-fallback honesty, and stale-handle safety
20. 2026-04-07 08:00: Marked `Model-Viewport 1.3 Phase 6B - First Authoritative Retained Result And Shape-Set Registration` shipped after the repo bound the authoritative worker seam to the real OC boot helper, resolved handle-versus-bundle circularity through worker-owned `shape_set` resource registration, emitted the first non-null authoritative retained results for a supported OC-backed body-extrude subset, and refreshed the handoff so `Phase 6C - Backend Failure Honesty And Focused Verification` is now next
19. 2026-04-07 07:37: Tightened `Model-Viewport 1.3 Phase 6B - First Authoritative Retained Result And Shape-Set Registration` into an implementation-ready next slice by grounding it in the live `buildAuthoritativeGeometry.ts` null seam, the new worker-local OC boot helper, the current authoritative-handle store, and the shared authoritative bundle contract, while locking the first OC-backed result around one store-owned `shape_set` registration path and explicitly resolving the current handle-versus-bundle circularity
18. 2026-04-07 07:33: Marked `Model-Viewport 1.3 Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding` shipped after the repo added the real stable `opencascade.js` worker dependency, replaced the placeholder `ocInit.ts` seam with a typed memoized worker-local OC boot helper, and added focused OC boot tests while keeping retained-result generation and authoritative handle registration deferred to `Phase 6B`
17. 2026-04-07 07:21: Tightened `Model-Viewport 1.3 Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding` into an implementation-ready next slice by grounding the work in the live placeholder `ocInit.ts`, current `package.json` dependency list, missing OC boot tests, and upstream `opencascade.js` init shape, while locking `6A` to package-plus-worker-boot ownership only and keeping retained-result generation for `6B`
16. 2026-04-07 07:21: Re-split the old oversized `Model-Viewport 1.3 Phase 6 - First Concrete Authoritative Backend Binding` into `Phase 6A / 6B / 6C` so the first real OC backend work now lands as three smaller implementation-sized slices covering worker-side OC boot, first authoritative retained-result binding, and backend-failure honesty plus focused verification
15. 2026-04-07 07:18: Tightened `Model-Viewport 1.3 Phase 6 - First Concrete Authoritative Backend Binding` into an implementation-ready next slice by grounding the first real backend binding in the live `buildAuthoritativeGeometry.ts`, placeholder `ocInit.ts`, existing `authoritativeGeometryStore.ts`, and current OC-adjacent import seams, locking package/init/handle ownership while keeping final-viewport honesty and export handoff out of this phase
14. 2026-04-07 07:13: Marked `Model-Viewport 1.3 Phase 5 - Worker-Owned Authoritative Adapter Contract` shipped after extracting a dedicated worker-owned authoritative builder seam beside `buildModel.ts`, routing authoritative requests through that new adapter while keeping draft/foothook bridging separate, and refreshing the family handoff so `Phase 6 - First Concrete Authoritative Backend Binding` is now next
13. 2026-04-07 06:46: Tightened `Model-Viewport 1.3 Phase 5 - Worker-Owned Authoritative Adapter Contract` into an implementation-ready next slice by grounding the new authoritative seam in the real `buildModel.ts`, `foothookCompatibilityAdapter.ts`, `authoritativeGeometryStore.ts`, and placeholder `ocInit.ts` worker seams, locking `buildModel.ts` to stay an orchestrator instead of the authoritative builder, and keeping Phase 5 on ParaHook-owned adapter extraction without widening into Phase 6 backend binding
12. 2026-04-07 06:17: Marked `Model-Viewport 1.3 Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy` shipped after `useAppStore.ts` started resolving explicit build execution intent from active-viewer viewport mode plus browser build-policy context, letting visible `Draft` flows request `draft_preview` honestly while keeping background graphs on the safe auto-authoritative fallback, and refreshed the family handoff so `Phase 5 - Worker-Owned Authoritative Adapter Contract` is now next
11. 2026-04-07 06:06: Tightened `Model-Viewport 1.3 Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy` into an implementation-ready next slice by grounding the missing `geometryTarget` routing in the real `useAppStore.ts`, browser execution-policy, and workspace viewport-mode seams, locking the first deterministic graph-to-viewport scheduling rule, and preserving `Build Path` ownership of authoritative timing while keeping `buildDispatcher.ts` forwarding-only
10. 2026-04-07 06:00: Marked `Model-Viewport 1.3 Phase 3 - Honest Authoritative Boundary Cleanup` shipped after removing the current draft-clone authoritative promotion from `buildModel.ts`, making store-level stale authoritative-handle release unconditional on rejection paths, and keeping `Final` honesty on the existing explicit `final-unavailable` selector path while handing live `geometryTarget` scheduling forward to `Phase 4`
9. 2026-04-07 05:51: Locked `Model-Viewport 1.3 Phase 5 / Phase 6` to a ParaHook-owned authoritative adapter followed by `OpenCascade.js / OCCT` as the first browser/WASM authoritative backend, while keeping any `Replicad` usage explicitly temporary and adapter-local instead of making it the long-term geometry truth
8. 2026-04-07 05:46: Tightened `Model-Viewport 1.3 Phase 3 - Honest Authoritative Boundary Cleanup` into an implementation-ready next slice by locking the narrower cleanup choice to remove the current draft-clone authoritative promotion entirely until a distinct backend exists, requiring store-level stale authoritative-handle release even when acceptance fails, and grounding final-mode honesty in the real `buildModel.ts`, `useSpaghettiStore.ts`, and `selectViewportResultState.ts` seams while explicitly deferring live `geometryTarget` scheduling to `Phase 4`
7. 2026-04-07 05:40: Re-reviewed the full `Model-Viewport 1.3` ladder after the broad shipped `Phase 2` landing, locked the current code-backed read around the pseudo-authoritative clone path, stale-handle leak risk, missing live `draft_preview` scheduling, and still-transitional final viewport bridge, then re-split the remaining work from one oversized old `Phase 3 - Export Handoff From Authoritative Geometry` into `Phase 3` through `Phase 11` so the next honest follow-ons now separate review cleanup, policy routing, backend binding, final-viewport honesty, and export handoff into implementation-sized Codex chunks
6. 2026-04-07 05:29: Marked `Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption` shipped after the repo added explicit shared `geometryTarget` build intent, produced live side-by-side draft and authoritative retained geometry through the worker/build path, moved accepted runtime geometry onto class-owned draft-versus-authoritative slots, and wired first authoritative-handle replacement/release behavior plus selector adoption without widening into export yet
5. 2026-04-07 05:06: Tightened `Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption` again by locking authoritative execution to a new explicit shared build-intent target instead of overloading existing `full/final` wording, requiring graph-runtime retained geometry to move from preview-versus-accepted naming into class-owned draft-versus-authoritative slots, defining first authoritative-handle replacement and release rules, and cleaning stale Phase 1 summary/status text now that the authoritative-capable retained-result contract is already shipped
4. 2026-04-07 04:49: Tightened `Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption` into a sharper implementation-ready slice by locking the first authoritative producer as a worker branch beside the current draft path, requiring draft and authoritative retained results to coexist side by side, keeping execution intent explicit in the shared build path, and explicitly placing any Replicad-versus-OC backend evaluation between this contract foundation and the live producer work instead of inside Phase 1
3. 2026-04-07 04:45: Marked `Model-Viewport 1.3 Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary` shipped after the repo widened the shared retained-result contract to support `draft | authoritative`, added the first minimal worker-owned `shape_set` authoritative handle envelope plus validation/helper coverage, and kept the live worker/build path honestly draft-only while threading the widened contract through shared build/result seams
2. 2026-04-07 04:39: Tightened `Model-Viewport 1.3 Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary` into a sharper implementation-ready slice by locking the first handle envelope to a minimal worker-owned `shape_set` resource identity, keeping `status` honest to the still-live `ok`-only producer baseline, and naming the exact shared validation/helper seams plus focused test targets the next implementation should touch
1. 2026-04-07 04:34: Created the dedicated `Model-Viewport 1.3` child doc, split the authoritative follow-on into `Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary`, `Phase 2 - Authoritative Execution Path And Retained Result Adoption`, and `Phase 3 - Export Handoff From Authoritative Geometry`, and tightened `Phase 1` into an implementation-ready next slice grounded in the repo's current draft-only retained-result contract plus the still-placeholder OC and export seams

### Purpose

Use this doc as the dedicated planning and execution surface for the `Model-Viewport-1 / Task 3` authoritative-geometry ladder.

The goal here is:
- define what the first honest `authoritative` geometry result class should mean
- keep that result class downstream from the shared request/result contracts already established in `1.1`
- move the worker/build path from draft-only retained geometry toward a real authoritative path without pretending the engine is already finished
- define the later export handoff so clean `.step` output stays downstream from authoritative geometry truth rather than preview meshes
- keep user-facing export toolbar concerns separate from worker-side authoritative geometry ownership

### Scope

This phase family covers:
- authoritative result-class contract growth beyond the current draft-only retained bundle
- the first worker/build-path seam for a real authoritative execution path
- retained authoritative-result adoption by the live build/store path
- the authoritative-to-export handoff boundary for later clean `.step` export

This phase family does not cover:
- redoing the shared request contract from `1.1`
- redoing the viewport `Auto / Draft / Final` swap rules from `1.2`
- the full user-facing `Export` toolbar surface
- every later CAD-kernel or file-writer implementation detail in one step

## Doc Body

### Summary

`Model-Viewport-1.3` should be the dedicated authoritative-geometry child under the broader `Model-Viewport-1` geometry-overhaul ladder.

Current baseline:
- `Model-Viewport-1.1` is now fully closed through its final close-out pass
- `Model-Viewport-1.2` is now fully closed through the viewport-local `A / D / F` mode control and selector-owned honesty status
- the repo now has one shared retained geometry-result contract at:
  - `src/shared/geometryResult.ts`
- that contract now supports:
  - `resultClass = draft | authoritative`
  - `status = ok`
  - `authoritativeHandle = null | shape_set handle`
- the live worker/build path still routes through:
  - `src/worker/buildModel.ts`
  - `src/worker/pipeline/buildPipeline.ts`
  - the foothook compatibility adapter
- the shared build request/result path now names authoritative execution explicitly through:
  - `geometryTarget = draft_preview | authoritative`
  - `src/shared/buildTypes.ts`
- the app runtime now stores retained geometry under class-owned draft-versus-authoritative naming:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.ts`
- the worker-side OC seam now lives behind the real memoized boot helper at:
  - `src/worker/oc/ocInit.ts`
- the `Export` family already defines the user-facing export surface, but explicitly says worker-side file logic should stay outside the toolbar UI

What `1.3` still needs to close:
- the worker-side `.step` writer operation
- app-facing export handoff status, verification, and closeout

Current internal status:
- `Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary`
  - shipped
- `Phase 2 - Authoritative Execution Path And Retained Result Adoption`
  - shipped
- `Phase 3 - Honest Authoritative Boundary Cleanup`
  - shipped
- `Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy`
  - shipped
- `Phase 5 - Worker-Owned Authoritative Adapter Contract`
  - shipped
- `Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding`
  - shipped
- `Phase 6B - First Authoritative Retained Result And Shape-Set Registration`
  - shipped
- `Phase 6C - Backend Failure Honesty And Focused Verification`
  - shipped
- `Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`
  - shipped
- `Phase 8 - Export Input Contract From Authoritative Results`
  - shipped
- `Phase 9 - Export Gating And On-Demand Authoritative Preparation`
  - shipped
- `Phase 10 - STEP Writer Adapter And Worker Export Operation`
  - shipped
- `Phase 11 - Export Handoff Status, Verification, And 1.3 Closeout`
  - open

Locked recommendation:
- treat the shipped `Phase 2` as a broad first cut, not as proof that the whole remaining `1.3` lane is now one export-sized step
- re-split the remaining `1.3` work into `Phase 3` through `Phase 11` so each follow-on is small enough for one honest Codex implementation pass
- use `Phase 1` to make the shared contract authoritative-capable without falsely claiming live authoritative runtime support yet
- use `Phase 2` as the first contract-threading and runtime-adoption cut
- use `Phase 3` to clean up the review-found honesty and leak issues before later phases build on them
- use `Phase 4` through `Phase 7` to make scheduling, backend ownership, backend hardening, and final viewport truth explicit
- use `Phase 8` through `Phase 11` to stage export input, gating, writing, and closeout instead of treating export handoff as one oversized final chunk
- use `Phase 5` to define ParaHook's own authoritative adapter seam as the permanent kernel-facing contract
- use `Phase 6A` through `Phase 6C` to bind that seam to `OpenCascade.js / OCCT` as the first browser/WASM authoritative backend without forcing package boot, retained-result adoption, and hardening into one oversized implementation pass
- do not make `Replicad` the long-term authoritative geometry truth for `1.3`
- if `Replicad` is touched at all, keep it as a short-lived spike or convenience layer behind the `Phase 5` adapter so it stays removable

Why this order is healthier:
- `1.1` already gave the repo a neutral request/result contract family
- `1.2` already gave the viewport a clean result-mode and swap-policy surface
- the next risk is no longer viewport confusion
- the next risks are:
  - letting the shipped broad `Phase 2` over-claim authoritative truth before a distinct backend exists
  - leaving build-policy routing implicit even though `geometryTarget` now exists
  - treating the whole export story as one final chunk before the worker/export input contract is explicit

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/shared/geometryResult.ts`
  - now owns the canonical retained geometry-result contract
  - now allows:
    - `draft | authoritative`
    - `ok`
    - worker-owned `shape_set` authoritative handles
  - is the exact seam `Phase 2` must start producing for real instead of only representing
- `src/shared/buildTypes.ts`
  - now exposes `BuildExecutionIntent` through:
    - `buildMode`
    - `quality`
    - `updatePolicy`
    - `geometryTarget`
    - `outputIntent`
  - still exposes `BuildResultClass` as:
    - `transient | draft | final`
  - now keeps authoritative execution explicit without overloading existing `full` or `final` wording
- `src/worker/buildModel.ts`
  - now returns sibling `draftGeometryResult` and `authoritativeGeometryResult` bundles plus downstream `parts`
  - is now the live worker-side orchestration seam where draft and authoritative branches meet without making `buildModel.ts` the permanent authoritative builder surface
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - now owns the dedicated worker-local authoritative builder seam
  - currently returns `authoritativeGeometryResult | null`
  - is the new boundary `Phase 6A` through `Phase 6C` should bind to `OpenCascade.js / OCCT`
- `src/worker/pipeline/buildPipeline.ts`
  - now threads both retained geometry classes into the emitted `BuildResult`
  - is the strongest live proof that retained geometry now survives into the app-facing result flow without becoming an export-only sidecar
- `src/worker/oc/ocInit.ts`
  - already reserves one OC warm-up seam
  - is still only a placeholder today, which is the clearest proof that `1.3` must stay honest about runtime readiness
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - now stores retained geometry as:
    - `acceptedAuthoritativeGeometryResult`
    - `acceptedDraftGeometryResult`
  - now owns the first authoritative-handle replacement and release rules for stale, superseded, and torn-down runtime slots
  - review read:
    - the store-level rejection paths queue stale authoritative handles for release, but the current release call is still gated behind accepted results only
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - now derives final versus draft truth from class-owned retained geometry slots
  - now owns the explicit split between selector-owned authoritative render truth and the remaining draft/artifact preview bridge
- `src/app/store/useAppStore.ts`
  - now resolves one explicit build execution intent before dispatching graph builds
  - now lets active-viewer-visible graphs honor viewport result mode for `geometryTarget`
  - now keeps background graphs on the current safe auto-authoritative fallback instead of inventing a hidden graph-to-viewport ownership seam early
  - now keeps browser/runtime policy ownership on the existing dispatch-timing surfaces while `buildDispatcher.ts` stays forwarding-only
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Export/Export-Index.md`
  - already says the visible `Export` surface should not become the hidden owner of worker-side file logic
  - is the cross-doc boundary that keeps `1.3` focused on geometry and handoff rather than toolbar chrome
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - already require preview meshes and clean export outputs to derive from one executed geometry truth rather than separate geometry owners

### Phase Breakdown

1. `Model-Viewport 1.3 Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary`
Reason:
- before the repo adds a real authoritative engine path, the shared retained-result contract needs to be able to represent authoritative geometry honestly
- this is the phase that should expand the contract while still clearly saying the live producer truth is draft-only today
Current status:
- shipped in this doc

2. `Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption`
Reason:
- once the contract can represent authoritative geometry, the worker/build path needs a real second execution family that can produce and retain it
- this is the phase that should move authoritative geometry from placeholder boundary to live result path
Current status:
- shipped in this doc

3. `Model-Viewport 1.3 Phase 3 - Honest Authoritative Boundary Cleanup`
Reason:
- the shipped `Phase 2` landed too broad and review found it still over-claims authoritative truth in a few critical seams
- this is the phase that should restore honesty before later backend or export work builds on top of that first cut
Current status:
- shipped in this doc

4. `Model-Viewport 1.3 Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy`
Reason:
- once the shared build path has `geometryTarget`, the live app/runtime path needs to request draft versus authoritative work explicitly instead of silently defaulting everything to authoritative
Current status:
- shipped in this doc

5. `Model-Viewport 1.3 Phase 5 - Worker-Owned Authoritative Adapter Contract`
Reason:
- before wiring a real backend, ParaHook needs one explicit worker-owned authoritative builder seam so `buildModel.ts` stops manufacturing authoritative bundles directly from draft output
Current status:
- shipped in this doc

6. `Model-Viewport 1.3 Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding`
Reason:
- once the authoritative adapter seam exists, the first backend step is installing and booting the real `OpenCascade.js / OCCT` worker dependency behind one memoized worker-local seam
Current status:
- shipped in this doc

7. `Model-Viewport 1.3 Phase 6B - First Authoritative Retained Result And Shape-Set Registration`
Reason:
- once worker-side OC boot exists, the next honest step is binding the authoritative adapter to that backend so authoritative requests can produce the first non-null retained result through the existing worker-owned `shape_set` path
Current status:
- shipped in this doc

8. `Model-Viewport 1.3 Phase 6C - Backend Failure Honesty And Focused Verification`
Reason:
- once the first OC-backed retained result exists, the worker needs one narrow hardening pass that keeps `null` fallback, stale-handle cleanup, and draft-path bypass behavior honest under failure and unavailable cases
Current status:
- shipped in this doc

9. `Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview`
Reason:
- once authoritative geometry can be produced distinctly, the viewport needs one honest rule for when `Final` is actually renderable and what should stay visible while that result is pending or unavailable
Current status:
- shipped in this doc

10. `Model-Viewport 1.3 Phase 8 - Export Input Contract From Authoritative Results`
Reason:
- before file writing begins, export needs one explicit worker-side input contract downstream from authoritative retained results
Current status:
- shipped in this doc

11. `Model-Viewport 1.3 Phase 9 - Export Gating And On-Demand Authoritative Preparation`
Reason:
- once export has an input contract, the app/build path needs one honest rule for what happens when export is requested but authoritative geometry is missing, stale, or still building
Current status:
- shipped in this doc

12. `Model-Viewport 1.3 Phase 10 - STEP Writer Adapter And Worker Export Operation`
Reason:
- once authoritative export input is explicit and gated correctly, the worker can add one real `.step` writer operation without making the toolbar the hidden owner of geometry semantics
Current status:
- open in this doc

13. `Model-Viewport 1.3 Phase 11 - Export Handoff Status, Verification, And 1.3 Closeout`
Reason:
- after the worker export path exists, ParaHook still needs one close-out pass for app-facing export status honesty, verification, and retirement of any temporary `1.3` bridges
Current status:
- open in this doc

## [x] Model-Viewport 1.3 Phase 1 - Authoritative Result-Class Contract And Honest Placeholder Boundary

### Summary

#### Purpose:
- make the retained geometry-result contract authoritative-capable before a real authoritative producer exists

#### Current strongest read:
- the shared retained-result contract is now stable, live, and authoritative-capable, but the live producer path still only emits draft geometry
- the worker/build path can already carry retained geometry through accepted results
- the app has no honest way to distinguish:
  - draft-only retained geometry
  - authoritative-capable retained geometry
- if the repo skips this contract phase, the first authoritative execution work will likely widen ad hoc inside worker code or export wiring

#### Locked direction:
- expand the shared retained-result contract so it can represent:
  - `draft`
  - `authoritative`
- keep the first contract honest by not pretending a live authoritative producer already exists
- add one neutral authoritative-handle boundary that does not force the final kernel choice too early
- keep export and viewport consumers downstream from this same contract family

#### Locked recommendation:
- add the authoritative result-class and handle shape now
- keep current live producers emitting only draft bundles until `Phase 2`
- make the contract itself express the difference between:
  - `draft geometry that is directly renderable today`
  - `authoritative geometry that later owns export truth`
- keep the first authoritative handle envelope neutral and worker-owned rather than export-owned
- keep `status` honest to the current runtime truth in this phase:
  - still `ok` only
  - do not widen into `failed / cancelled / stale` here just because authoritative support is being added

#### Important honesty rule:
- `Phase 1` should not fake authoritative runtime support
- it should only make the contract capable of representing that future result cleanly
- no selector, status surface, or export seam should claim authoritative availability until a real producer lands later

### Questions / Decisions

#### [x] Question 1 - How should authoritative geometry enter the shared retained-result contract before the real engine path exists?

##### Locked answer
- the shared retained-result contract should widen now to include:
  - `resultClass = draft | authoritative`
- the contract should also gain a non-null authoritative-handle envelope for authoritative bundles
- current live producers should remain draft-only until `Phase 2`
- the widened contract should explicitly preserve the current truthful producer baseline instead of silently upgrading draft bundles into pseudo-authoritative ones

##### Why
- this keeps the first authoritative engine work from inventing a second result family later
- it gives the app, worker, and export seams one place to agree on authoritative geometry identity
- it avoids the opposite mistake of over-claiming authoritative runtime support before there is a real producer

##### Locked rules
- `draft` and `authoritative` are result classes, not viewport modes
- draft bundles may keep `authoritativeHandle = null`
- authoritative bundles must carry a non-null authoritative handle
- no current draft producer should change result class as part of this phase

#### [x] Question 2 - What should the first authoritative handle boundary look like?

##### Locked answer
- the first authoritative handle should be a neutral worker-owned envelope, not an export-toolbar object and not a direct viewport-owned object
- the first handle should identify:
  - that the worker owns an authoritative shape-set-like resource
  - the retained handle id needed to refer to it later
- the first shape should stay engine-neutral enough that `Phase 1` does not lock ParaHook to a final library choice by accident
- recommended first envelope:
  - `resourceType = shape_set`
  - `handleId = string`

##### Why
- `1.3` still needs room to choose or evolve the real authoritative execution backend
- export should later consume authoritative geometry through a worker/build seam, not become the owner of raw geometry handles
- a neutral worker-owned handle keeps the contract stable even if the first backend changes later

##### Locked rules
- the handle belongs to the retained geometry-result contract
- the handle must be downstream from worker execution
- the handle must not depend on toolbar/export UI state
- `Phase 1` may define the envelope shape without yet defining full handle lifetime management
- `Phase 1` should not add backend-choice tags or library-specific object shapes yet

#### [x] Question 3 - Should `Phase 1` widen retained-result status at the same time?

##### Locked answer
- no
- `Phase 1` should keep retained-result `status` honest to the current live producer truth:
  - `ok`
- broader status families should wait until later phases actually produce and route those states

##### Why
- widening result class and widening status are different jobs
- the repo does not yet have a live authoritative producer, cancellation flow, or failure reporting path worth standardizing here
- keeping `status` narrow prevents the contract from over-claiming runtime readiness during this placeholder-boundary phase

##### Locked rules
- `Phase 1` may add authoritative-capable result-class support
- `Phase 1` should not add fake authoritative-failure semantics
- any future status expansion should come with a real producer/dispatcher/store path that can emit and consume it honestly

### Implementation Spec

Likely files:
- `src/shared/geometryResult.ts`
- `src/shared/buildTypes.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- nearby shared retained-result tests/helpers as needed
- nearby retained-result validation/helpers as needed

Implementation-ready recommendation:
1. Expand `src/shared/geometryResult.ts` so the shared retained-result family can represent both:
   - `draft`
   - `authoritative`
2. Add one neutral `authoritativeHandle` envelope type for authoritative bundles.
   - Keep it worker-owned and engine-neutral.
   - Do not tie it to export UI or the current foothook adapter.
   - Recommended first minimal fields:
     - `resourceType: 'shape_set'`
     - `handleId: string`
3. Add validation and creation rules that keep the contract honest:
   - draft bundles may keep `authoritativeHandle = null`
   - authoritative bundles must provide a non-null authoritative handle
   - retained-result `status` remains `ok` only in this phase
4. Thread the widened retained-result contract through shared build-result types and worker/build-pipeline packaging without yet adding a live authoritative producer.
5. Keep the current live build path draft-only in this phase.
   - Do not widen into real authoritative execution yet.
   - Do not widen into export writer behavior yet.
6. Keep the current worker/build callers behaviorally unchanged unless they need light typing/validation updates to accept the wider contract family.
7. Leave any Replicad or broader OC backend installation/evaluation out of this phase.
   - that decision belongs after this contract boundary is in place

Focused verification target:
- the shared retained-result contract accepts both draft and authoritative variants
- current draft producers still emit valid draft bundles without behavior regression
- authoritative bundles are representable and validated even if no live producer emits them yet
- the worker/build shared types do not require export UI ownership to talk about authoritative geometry
- the tests prove `authoritative` requires a non-null handle while current draft bundles remain valid unchanged

Definition of done:
- the repo has one authoritative-capable retained-result contract
- that contract remains honest about the current draft-only producer reality
- `Phase 2` can add a real authoritative execution path without inventing a second result family

## [x] Model-Viewport 1.3 Phase 2 - Authoritative Execution Path And Retained Result Adoption

### Summary

#### Purpose:
- add the first real authoritative execution path downstream from the shared geometry request contract

#### Current read:
- the worker/build path can already retain and route geometry results
- but the only live retained producer still comes from the draft/foothook path
- the shared build contract still has no explicit authoritative execution target, so `quality = full` and `resultClass = final` would be easy to misuse as fake authoritative shorthand
- the graph-runtime store and viewport selector still use preview-versus-accepted retained-geometry naming instead of class-owned draft-versus-authoritative naming
- the OC seam exists only as a placeholder
- `Phase 1` already made authoritative bundles representable without changing live producer truth
- this phase should now be the first point where authoritative geometry becomes a live retained result instead of only a contract possibility

#### Locked direction:
- add one authoritative producer path in the worker/build flow
- retain that result through the same accepted geometry-result family the viewport already consumes
- keep draft and authoritative results explicit instead of collapsing them together

#### Locked recommendation:
- make the first authoritative producer a worker branch beside the current draft path in:
  - `src/worker/buildModel.ts`
- keep the first implementation on one live authoritative retained result path, not the whole final CAD engine
- keep draft and authoritative retained results side by side in the accepted graph-runtime state
- route authoritative work through the existing shared build/request path instead of inventing a hidden special-case execution seam
- add one explicit authoritative execution target to the shared build-intent family instead of overloading existing `quality = full` or `BuildResultClass = final` language
- move retained geometry adoption onto class-owned runtime slots instead of leaving it under preview-versus-accepted naming
- keep Replicad or broader OC backend evaluation as a decision input to this phase, not as the whole implementation of this phase

#### Important boundary rule:
- `Phase 2` should add one real authoritative producer
- it should not yet solve:
  - final export writer behavior
  - the full backend/library decision surface in docs and code at once
  - broader failure/cancellation taxonomy beyond what the live path can actually emit
- the bar here is:
  - one live authoritative retained result
  - one honest coexistence rule beside draft
  - one explicit worker/build-path execution branch

### Questions / Decisions

#### [x] Question 1 - Where should the first authoritative execution branch live?

##### Locked answer
- the first authoritative execution branch should live beside the current draft path inside `buildModel.ts`
- authoritative execution should remain worker-owned all the way through retained-result creation
- the first cut may package draft and authoritative retained results separately as long as both travel through the same shared build/request/result family

##### Why
- `buildModel.ts` is already the worker choke point where draft retained geometry and downstream artifacts are assembled
- adding the authoritative branch there keeps ParaHook's geometry execution ownership explicit instead of pushing the new path into export or app-side store code
- keeping draft and authoritative results sibling branches avoids making one silently overwrite the meaning of the other

##### Locked rules
- no export-owned authoritative producer
- no viewport-owned authoritative producer
- the first authoritative branch should sit beside, not replace, the current draft path

#### [x] Question 2 - How should accepted retained authoritative geometry coexist with current draft consumption?

##### Locked answer
- draft and authoritative retained results should be stored side by side under class-owned runtime slots
- recommended first runtime naming:
  - `acceptedDraftGeometryResult`
  - `acceptedAuthoritativeGeometryResult`
- the current preview-versus-accepted retained-geometry naming should be retired for geometry bundles during this phase
- artifact-preview build outputs may remain on their existing preview-oriented names temporarily if that reduces churn in the mesh-preview bridge
- when authoritative finishes after draft, accepted authoritative geometry should replace only the authoritative slot, not erase draft retained geometry
- if authoritative execution fails or is unavailable, draft remains the last usable retained result and no fake final result is emitted

##### Why
- the viewport already has explicit `Auto / Draft / Final` semantics, so the app needs both result classes available instead of one overwriting the other
- keeping both retained results side by side lets the live runtime stay honest during long builds and backend gaps
- this avoids a brittle one-slot model where the app loses the fast fallback as soon as authoritative work begins
- it also avoids keeping the old misleading idea that retained geometry slots are primarily about preview-versus-accepted timing instead of result class ownership

##### Locked rules
- accepted draft retained geometry and accepted authoritative retained geometry are distinct runtime values
- authoritative completion updates authoritative state only
- authoritative unavailability must remain explicit rather than silently pretending draft is final
- selectors should read retained geometry from class-owned slots even if artifact-preview meshes still travel through a temporary bridge

#### [x] Question 3 - How should authoritative execution be requested through the build path?

##### Locked answer
- authoritative execution should be requested through the existing shared build path by extending `BuildExecutionIntent` with one explicit geometry target
- recommended first field:
  - `geometryTarget = draft_preview | authoritative`
- the first implementation should extend:
  - `src/shared/buildTypes.ts`
  - `src/app/buildDispatcher.ts`
  - `src/worker/pipeline/buildPipeline.ts`
- but it should not introduce a hidden special-case authoritative trigger outside the current build request flow
- it should also not overload:
  - `quality = full`
  - `BuildResultClass = final`
  as shorthand for authoritative geometry

##### Why
- ParaHook already has a shared worker/build request path
- using that same path keeps build timing and result acceptance aligned with the Build Path ownership rules already locked elsewhere
- this avoids creating a second invisible scheduling system just for authoritative geometry
- adding an explicit geometry target keeps accepted-build bundle timing and retained-geometry class semantics from collapsing into one overloaded `final` label

##### Locked rules
- authoritative execution must remain visible in shared build intent/request ownership
- no ad hoc app-side direct call around the build pipeline
- build-path timing still stays a separate concern from viewport result mode
- `BuildResultClass = final` may continue to describe accepted build-bundle timing/output state
- authoritative geometry must get its own execution-target meaning instead of being inferred from existing `full/final` words

#### [x] Question 4 - Where should Replicad evaluation sit relative to this phase?

##### Locked answer
- Replicad-versus-OC evaluation should happen between the shipped `Phase 1` contract foundation and the live `Phase 2` producer implementation
- that evaluation may inform `Phase 2`
- but it should not replace `Phase 2` with a dependency-install-first approach

##### Why
- `Phase 1` already locked the authoritative result boundary in an engine-neutral way
- evaluating Replicad after that contract exists keeps ParaHook semantics from bending around a library too early
- `Phase 2` still needs to ship one live authoritative retained result, not only a dependency choice

##### Locked rules
- do not install or wire a backend in this prep doc by accident
- do not let dependency choice become the hidden owner of authoritative-result semantics
- backend choice should feed the implementation of `Phase 2`, not replace it

#### [x] Question 5 - How should first authoritative-handle replacement and release work?

##### Locked answer
- authoritative handles remain worker-owned resources even after the app retains their identity in a geometry-result bundle
- when a new authoritative result is accepted for the same graph/runtime slot, the previously accepted authoritative handle should be released after the replacement succeeds
- when an authoritative result arrives stale and is rejected, any newly created worker handle for that stale result should be released instead of being retained invisibly
- when graph-runtime state is torn down or reset, the currently retained authoritative handle for that runtime slot should be released
- draft-result acceptance should not mutate authoritative-handle ownership by itself

##### Why
- `Phase 1` intentionally defined the first handle envelope without pretending lifetime rules already existed
- `Phase 2` is the first point where live authoritative handles can accumulate, leak, or silently point export at stale geometry if replacement is not explicit
- locking the first release rules now keeps worker ownership honest without forcing the full later export contract into this phase

##### Locked rules
- handle lifetime stays worker-owned, not viewport-owned and not export-toolbar-owned
- stale rejected authoritative results must not leave retained orphan handles behind
- successful authoritative replacement releases the superseded authoritative handle for the same graph/runtime slot
- broader persistence, serialization, or cross-session handle resurrection is out of scope for this phase

### Implementation Spec

Likely files:
- `src/worker/buildModel.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/shared/buildTypes.test.ts`
- `src/worker/buildModel.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- nearby worker authoritative-geometry seams as needed

Implementation-ready recommendation:
1. Add one real authoritative execution branch beside the current draft path in `src/worker/buildModel.ts`.
2. Keep the first producer shape narrow:
   - one authoritative retained result
   - no export writer behavior yet
   - no forced removal of the draft path
3. Extend the shared build request / execution-intent seam with one explicit authoritative geometry target.
   - Recommended first field:
     - `geometryTarget = draft_preview | authoritative`
   - Do not overload:
     - `quality = full`
     - `BuildResultClass = final`
4. Thread that geometry target through `BuildDispatcher` and `buildPipeline` so authoritative execution remains explicit inside the current build path.
5. Update graph-runtime retained geometry state so accepted draft and accepted authoritative results coexist in class-owned slots instead of preview-versus-accepted geometry slots.
   - Recommended first naming:
     - `acceptedDraftGeometryResult`
     - `acceptedAuthoritativeGeometryResult`
6. Keep artifact-preview build outputs on their current bridge only as long as needed for viewport draft rendering.
   - Do not let that bridge remain the owner of retained-geometry class semantics.
7. Add the first authoritative-handle replacement/release behavior in the worker/runtime adoption path.
   - Rejected stale authoritative results release their new handles.
   - Successful authoritative replacement releases the superseded authoritative handle for the same graph/runtime slot.
   - Runtime teardown/reset releases the currently retained authoritative handle.
8. Update selectors and acceptance logic so authoritative/final viewport reads come only from the authoritative retained slot, while draft fallback continues to read from the draft retained slot and/or temporary artifact-preview bridge.
9. Keep failure honesty strict:
   - if authoritative execution is unavailable or fails, do not emit a fake authoritative result
   - preserve the last usable draft retained result
10. Leave any backend/library spike as an input to implementation, not as the only output of this phase.

Scope honored:
- keep this phase on the first live authoritative retained-result path
- do not widen into final export handoff
- do not widen into a full backend comparison doc rewrite
- do not widen into broader viewport-mode or Build Path policy changes

Focused verification target:
- the shared build request/result path can request authoritative execution explicitly without inferring it from existing `full/final` wording
- the repo can produce one live authoritative retained result through the worker/build path
- draft and authoritative retained results can coexist in accepted runtime state under class-owned geometry slots
- authoritative-handle replacement/rejection paths release worker-owned handles honestly for the first live producer cut
- current draft behavior remains usable when authoritative work is missing or fails
- the viewport selector reads authoritative/final truth only from the authoritative retained slot
- no export-facing code is required yet for the first authoritative producer to exist

Definition of done:
- the repo has one live authoritative execution path
- retained authoritative geometry flows through the same accepted result family as draft without overloading old preview-versus-accepted geometry slot names
- the app no longer treats authoritative geometry as only a future placeholder

## [x] Model-Viewport 1.3 Phase 3 - Honest Authoritative Boundary Cleanup

### Summary

#### Purpose:
- repair the broad shipped `Phase 2` landing so later authoritative and export work can build on an honest baseline

#### Current read:
- `Phase 3` is now shipped on the narrow review-cleanup target:
  - `src/worker/buildModel.ts` no longer relabels draft retained output as authoritative before a distinct backend exists
  - `src/app/spaghetti/store/useSpaghettiStore.ts` now releases queued authoritative handles on rejection paths even when the result is not accepted
  - `Final` mode already stays on the explicit `final-unavailable` fallback when no accepted authoritative retained result exists
- live `geometryTarget` scheduling is still intentionally deferred to `Phase 4`

#### Locked direction:
- keep `Phase 3` narrow and review-driven
- restore honesty around what currently counts as authoritative geometry
- make stale authoritative-handle release unconditional on rejection paths
- remove pseudo-authoritative promotion now instead of introducing the later authoritative adapter early
- keep later backend binding and export handoff out of this phase
- keep live `geometryTarget` scheduling out of this phase and hand that forward to `Phase 4`

### Questions / Decisions

#### [x] Question 1 - Should the current draft-clone path count as a real authoritative result?

##### Locked answer
- no
- if the worker has not executed a distinct authoritative backend path yet, the app should not relabel a draft retained bundle as authoritative just because a `shape_set` handle was attached to it
- `Phase 3` should remove that relabeling and return no authoritative result until a distinct backend exists
- the later explicit authoritative adapter belongs to `Phase 5`, not this cleanup pass

##### Why
- the long-range vision depends on authoritative geometry being meaningfully downstream from graph-authored truth and distinct from preview meshes
- if ParaHook treats a cloned draft bundle as authoritative, later export work will inherit a false source of truth
- fixing that honesty boundary now is smaller and safer than debugging it after export wiring exists

##### Locked rules
- no draft bundle should silently promote itself to authoritative by label alone
- if no distinct authoritative producer ran, the authoritative retained slot should remain empty
- this phase should not yet choose or install the final backend by itself
- this phase should not introduce the later authoritative adapter abstraction early just to avoid deleting the fake path

#### [x] Question 2 - When should stale rejected authoritative handles be released?

##### Locked answer
- stale rejected authoritative handles should release on every rejection path, not only when a result is accepted
- dispatcher-level stale results and store-level stale/runtime-mismatch rejections both need explicit release behavior
- because `Phase 3` removes the fake authoritative producer, this release fix mainly protects the repo against any still-in-flight or later partial authoritative results rather than preserving the current broad `Phase 2` behavior

##### Why
- worker-owned handles are only useful while one accepted runtime slot or later export path can still reach them
- if stale rejections do not release immediately, later phases inherit a leak-prone store and a misleading authoritative inventory

##### Locked rules
- stale authoritative handles must not survive because acceptance failed
- release ownership stays worker-side
- this phase does not widen into persistence or cross-session handle resurrection

#### [x] Question 3 - What should `Final` mode say while a distinct authoritative producer is still absent?

##### Locked answer
- `Final` mode should stay honest:
  - pending only when a real authoritative request is in flight
  - unavailable when no authoritative result exists
- it should not claim final truth while only draft-derived preview rendering is available

##### Why
- the viewport is the user-facing honesty surface for result class
- Phase 2 intentionally allowed a temporary render bridge, but review showed the semantic status must now become stricter before export work starts

##### Locked rules
- final labels/status must remain downstream from actual authoritative result availability
- draft artifact bridges may remain temporarily for rendering, but not as hidden proof of final truth
- full authoritative render replacement belongs later, not inside this cleanup phase

### Implementation Spec

Likely files:
- `src/worker/buildModel.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/worker/buildModel.test.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Implementation-ready recommendation:
1. Remove the current draft-clone authoritative promotion path in `src/worker/buildModel.ts`.
   - when the request asks for `geometryTarget = authoritative` but no distinct authoritative backend exists yet:
     - keep `draftGeometryResult` on its current truthful path
     - return `authoritativeGeometryResult = null`
   - do not create a worker-owned authoritative handle for that fake path
2. Keep `src/app/buildDispatcher.ts` honest around stale authoritative release.
   - preserve dispatcher-level stale-result handle release for any real authoritative result objects that may still arrive
   - do not add fallback relabeling or synthetic authoritative bundles in the dispatcher
3. Fix store-level stale-handle release in `src/app/spaghetti/store/useSpaghettiStore.ts`.
   - queued authoritative handles from rejected runtime/store paths must release even when `accepted === false`
   - successful replacement must still release superseded authoritative handles as before
4. Tighten `src/app/spaghetti/selectors/selectViewportResultState.ts`.
   - `Final` must report `final-unavailable` when no accepted authoritative retained result exists
   - draft artifact-preview rendering may remain temporarily visible only under the existing draft/auto fallback semantics, not as hidden proof of final truth
5. Update focused tests so they prove:
   - authoritative requests produce `null` authoritative retained results until a real backend exists
   - stale rejected authoritative handles release on store rejection paths
   - `Final` no longer claims authoritative truth when only draft-derived preview exists
6. Keep this phase out of:
   - live `geometryTarget` policy routing from viewport/build mode
   - new authoritative adapter extraction
   - backend installation or binding
   - export request wiring or file writing

Scope honored:
- keep this phase on review cleanup and honesty repair only
- do not widen into build-policy routing yet
- do not widen into backend choice or export writer work yet
- do not widen into the later `Phase 5` authoritative adapter extraction

Focused verification target:
- `buildModel.ts` no longer emits pseudo-authoritative retained results when no distinct authoritative producer exists
- no worker-owned authoritative handle is created for the removed fake path
- store-level rejection paths release queued authoritative handles even when the result is not accepted
- `Final` mode now reads as unavailable rather than authoritative when only draft-derived preview rendering exists
- current truthful draft behavior remains usable in `Auto` and `Draft`

Definition of done:
- the repo no longer labels a pure draft clone as authoritative geometry
- stale rejected authoritative handles release on all rejection paths
- the viewport no longer over-claims final truth before a distinct authoritative producer exists

## [x] Model-Viewport 1.3 Phase 4 - Explicit Draft/Authoritative Scheduling From Viewport And Build Policy

### Summary

#### Purpose:
- make `geometryTarget` a real runtime decision surface instead of a shared field that defaults to authoritative on every build

#### Current code-backed read:
- `BuildExecutionIntent.geometryTarget` now exists
- `src/app/store/useAppStore.ts`
  - `requestGraphDocumentBuild(...)` now resolves one explicit `executionIntent` before `buildDispatcher.requestGraphBuild(...)`
  - `requestBrowserGraphDocumentBuild(...)` and `handleBrowserGraphRuntimeRevisionChange(...)` still own when browser/runtime-triggered builds dispatch through `selectEffectiveBrowserExecutionPolicy(...)`
  - `requestBrowserGraphDocumentBuild(...)` now threads browser policy context into that app-owned intent resolver instead of leaving runtime builds on the default shared intent
- `src/app/workspace/workspaceViewportResultMode.ts`
  - `resolveWorkspaceViewportResultModeBehavior(...)` already defines the first runtime-facing `Auto / Draft / Final` behavior surface
- `src/app/workspace/useWorkspaceStore.ts`
  - `selectViewportResultModeBehaviorById(...)` now acts as the active-viewer mode read that the app-side resolver uses for visible graph scheduling
- the shipped first cut now lets visible active-viewer graphs request `draft_preview` honestly while leaving non-visible/background graphs on the safe auto-authoritative fallback until a later phase defines a richer graph-to-viewport ownership seam

#### Locked direction:
- derive geometry execution intent from the existing viewport/build-policy surfaces
- keep build-trigger timing owned by Build Path rules
- keep viewport result mode separate from export concerns
- keep `buildDispatcher.ts` as a forwarding seam, not the owner of viewport/build-policy semantics

#### Locked scope cut:
- keep this phase on app-side intent routing only
- do not add new worker geometry behavior here
- do not widen into export routing or authoritative backend binding here
- do not introduce cross-viewport voting or composition-owned scheduling in this phase

### Implementation Spec

Likely files:
- `src/app/store/useAppStore.ts`
- `src/app/workspace/workspaceViewportResultMode.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/buildDispatcher.ts`
- nearby build-policy / viewport-mode selectors and tests
- focused coverage in `src/app/store/useAppStore.test.ts`

Shipped implementation:
1. Added one app-store-owned `executionIntent` resolver in `src/app/store/useAppStore.ts` so graph builds no longer rely on the default shared `geometryTarget`.
2. Kept the first scheduling cut narrow and honest.
   - if the requested graph is visible in the active viewer target or shared composition, the active viewer viewport mode now owns the `geometryTarget` choice
   - if the graph is not visible in the active viewer, the build falls back to the current safe auto-authoritative path instead of inventing a hidden graph-to-viewport binding model
3. Kept build-trigger timing where it already lives.
   - `selectEffectiveBrowserExecutionPolicy(...)`
   - `requestBrowserGraphDocumentBuild(...)`
   - `handleBrowserGraphRuntimeRevisionChange(...)`
   Those seams still decide whether a build runs.
   The new resolver now decides which `geometryTarget` that dispatched build requests.
4. Locked the shipped first mapping rules to:
   - active-viewer `Draft` -> `draft_preview`
   - active-viewer `Auto` -> `authoritative`
   - active-viewer `Final` -> `authoritative`
   - non-visible/background graphs -> auto-authoritative fallback
5. Threaded browser execution-policy context into that same resolver so explicit/manual browser builds now carry a truthful `updatePolicy` hint without moving policy ownership into `buildDispatcher.ts`.
6. Added focused tests proving:
   - visible `Draft` flows request `draft_preview`
   - conflicting model-viewer modes respect the active viewer viewport
   - background graph builds stay on authoritative fallback
   - explicit browser/manual requests preserve `manual` policy context while still honoring viewport-driven geometry target selection

Definition of done:
- ParaHook can request `draft_preview` and `authoritative` in real runtime flows
- `geometryTarget` is no longer only a defaulted shared type field
- the app has one explicit owner for viewport/build-policy-to-intent routing
- Build Path still owns build timing, and `buildDispatcher.ts` still does not

## [x] Model-Viewport 1.3 Phase 5 - Worker-Owned Authoritative Adapter Contract

### Summary

#### Purpose:
- extract authoritative production into one explicit worker-owned seam before binding a real backend

#### Current code-backed read:
- `src/worker/buildModel.ts`
  - now builds the truthful draft retained result plus foothook-compatible artifact bridge
  - now routes authoritative requests through a dedicated worker-owned builder seam
  - stays the orchestrator for draft versus authoritative branches instead of becoming the permanent authoritative engine surface
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - now owns the extracted worker-local authoritative builder contract
  - currently returns `authoritativeGeometryResult | null`, keeping backend-unavailable truth explicit without leaking backend-specific shapes upward
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
  - is the current draft/mesh-bridge runtime and artifact adapter
  - should remain the draft-side bridge instead of becoming the hidden authoritative contract
- `src/worker/authoritativeGeometryStore.ts`
  - already owns worker-side authoritative handle registration and release storage
  - is the natural downstream ownership seam the later authoritative adapter should use when a real backend exists
- `src/worker/oc/ocInit.ts`
  - is still only a placeholder warm-up seam
  - proves this phase should define the ParaHook-owned adapter boundary before `OpenCascade.js / OCCT` binding widens into `Phase 6`
- the repo now has one explicit worker-owned authoritative builder boundary, but that boundary still returns `null` until `Phase 6` binds a real backend behind it

#### Locked direction:
- introduce one worker-owned authoritative builder seam
- shape that seam around ParaHook-owned authoritative build inputs, worker-owned handles, and retained-result outputs rather than a third-party modeling DSL surface
- keep `OpenCascade.js / OCCT` and any optional `Replicad` spike downstream from that seam instead of letting either library become the app contract
- let that seam return:
  - one authoritative retained result
  - or `null` when the backend is unavailable
- keep export, viewport, and app code downstream from that seam

### Implementation Spec

Likely files:
- `src/worker/buildModel.ts`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/authoritativeGeometryStore.ts`
- `src/worker/products/foothook/foothookCompatibilityAdapter.ts`
- focused worker tests

Shipped implementation:
1. Extracted one ParaHook-owned authoritative builder module in `src/worker/authoritative/buildAuthoritativeGeometry.ts`.
   - it defines a worker-local authoritative build input/output seam
   - it currently returns only `authoritativeGeometryResult | null`
   - it does not leak raw OC object shapes or a `Replicad` DSL surface into the wider worker/app contract
2. Kept `buildModel.ts` as the orchestration seam.
   - draft retained-result creation and foothook-compatible artifact adaptation stay on the existing draft path
   - authoritative requests now delegate to the new authoritative builder module instead of growing more inline logic in `buildModel.ts`
3. Kept draft and authoritative ownership explicitly separate.
   - `foothookCompatibilityAdapter.ts` remains the draft/mesh bridge
   - the new authoritative adapter does not route back upward through foothook-specific artifact semantics to manufacture authoritative truth
4. Kept unavailable authoritative execution explicit in the extracted seam.
   - the dedicated authoritative builder currently returns `null`
   - that `null` now comes from the dedicated authoritative builder module rather than from inline placeholder branching in `buildModel.ts`
5. Added focused worker tests proving:
   - `buildModel.ts` delegates authoritative work to the new adapter seam
   - draft-preview requests do not route through that authoritative adapter
   - the worker pipeline still propagates authoritative retained geometry correctly when the adapter later emits one
6. Kept backend binding out of this phase.
   - `ocInit.ts` remains a placeholder warm-up seam
   - `OpenCascade.js / OCCT` binding stays deferred to `Phase 6`
   - no temporary backend layer widened into the shared worker/app contract here

Definition of done:
- the worker has one explicit ParaHook-owned authoritative adapter boundary
- `buildModel.ts` now orchestrates around that boundary instead of containing authoritative-builder ownership itself
- unavailable authoritative execution now comes from the dedicated authoritative adapter seam rather than inline placeholder branching
- `Phase 6` can bind `OpenCascade.js / OCCT` without changing app/store/export semantics

## [x] Model-Viewport 1.3 Phase 6A - Worker-Side OpenCascade Boot And Dependency Binding

### Summary

#### Purpose:
- add the first real worker-side `OpenCascade.js / OCCT` dependency and boot seam behind ParaHook's authoritative adapter boundary

#### Current code-backed read:
- `src/worker/oc/ocInit.ts`
  - now owns the worker-local `opencascade.js` initialization path
  - now returns a typed initialized OC surface through the memoized `warmOc()` seam and matching `getOc()` getter
  - keeps package/init ownership local instead of widening backend boot logic into `buildModel.ts` or app/store layers
- `package.json`
  - now carries stable `opencascade.js` alongside existing `occt-import-js` import-side support
  - keeps the first authoritative backend dependency explicit without changing retained-result behavior yet
- `src/types/opencascadejs.d.ts`
  - now provides the local ambient package contract so the worker seam can expose a typed initialized OC surface
- `src/viewer/stepReferenceLoader.ts`
  - already uses `occt-import-js` for STEP import/tessellation support
  - remains separate from `6A`; import-side STEP reading is still not the authoritative worker boot seam
- `src/worker/oc/ocInit.test.ts`
  - now gives the worker seam focused proof that package init is memoized, called once, and reused through both exported getters

#### Locked direction:
- choose `OpenCascade.js / OCCT` as the first backend
- keep backend boot, init, and module ownership worker-local behind `src/worker/oc/ocInit.ts` or a nearby OC binding module
- use the upstream `opencascade.js` package/init shape as the first concrete dependency target for this phase
- do not widen package/bootstrap details into `buildModel.ts`, app/store code, or export layers
- do not make `Replicad` the permanent authoritative geometry truth for `1.3`
- if `Replicad` is used at all, keep it as a short-lived removable adapter-local spike that does not change the retained-result contract
- keep retained-result generation, authoritative handle registration, and failure hardening out of `6A`; those belong to `6B` and `6C`

### Implementation Spec

Likely files:
- `package.json`
- `src/worker/oc/ocInit.ts` and nearby `OpenCascade.js / OCCT` binding seams
- `src/worker/oc/ocInit.test.ts` or nearby focused worker OC boot tests
- worker-local OC binding helpers and types as needed

Shipped implementation:
1. Added the first concrete worker-side `OpenCascade.js / OCCT` dependency.
   - installed stable `opencascade.js` in `package.json`
   - kept existing `occt-import-js` import-side support separate so `6A` stays about authoritative worker boot only
2. Replaced the placeholder OC warm-up seam with a typed worker boot helper.
   - `src/worker/oc/ocInit.ts` now owns the package import and initialization path
   - `warmOc()` now memoizes a typed initialized OC surface instead of returning `Promise<void>`
   - `getOc()` now mirrors that same worker-local boot seam for later phases
3. Kept package details local to the worker OC seam.
   - later phases can consume the worker-local getters without importing `opencascade.js` directly
   - shared worker/app contracts still do not know about package-level wasm/bootstrap details
4. Added focused verification around the boot seam.
   - `src/worker/oc/ocInit.test.ts` proves package initialization is requested once even when the seam is called multiple times
   - the same test file proves `getOc()` and `warmOc()` reuse the same memoized promise/module
5. Kept `6A` scoped correctly.
   - no retained authoritative result generation landed here
   - no `shape_set` registration landed here
   - no final viewport or export behavior changed here

Definition of done:
- the repo depends on the real worker-side `opencascade.js` backend package
- `ocInit.ts` or a nearby helper owns worker-local backend initialization and returns a typed initialized OC surface
- the worker has focused proof that OC boot is memoized and isolated behind one seam
- later phases can consume that boot seam without widening package details into shared contracts
- no retained authoritative result, `shape_set` registration, or final viewport/export behavior changes land in `6A`

## [x] Model-Viewport 1.3 Phase 6B - First Authoritative Retained Result And Shape-Set Registration

### Summary

#### Purpose:
- bind the authoritative adapter to the worker-side OC backend so authoritative requests can produce the first non-null retained result through ParaHook's existing `shape_set` handle path

#### Current code-backed read:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - remains the one explicit worker-local authoritative builder seam created in `Phase 5`
  - now binds authoritative requests to the real OC boot seam and emits the first non-null retained authoritative bundle for a supported rectangular `Body`-extrude subset
  - still keeps authoritative failure honest by returning `null` for unsupported authoritative requests instead of cloning the draft path
- `src/worker/oc/ocInit.ts`
  - now exposes the memoized worker-local OC boot seam from `Phase 6A`
  - now consumes a Vite-safe worker-local `OpenCascade.js` wrapper so the authoritative worker seam can build cleanly without leaking package bootstrap details upward
- `src/worker/authoritativeGeometryStore.ts`
  - now owns worker-side `shape_set` handle registration from retained OC resources rather than from a pre-existing authoritative bundle
  - now disposes retained worker-owned backend resources when authoritative handles are released
  - is still the correct downstream identity seam for authoritative results instead of inventing a second OC-specific handle format
- `src/worker/buildModel.ts`
  - still orchestrates draft-versus-authoritative routing instead of owning backend objects directly
  - now awaits the authoritative adapter path while keeping the legacy artifact-only wrapper on a draft-preview-first default
- `src/shared/geometryResult.ts`
  - already requires authoritative bundles to carry a valid `shape_set` handle
  - `6B` now satisfies that contract through one consistent worker-owned handle-plus-bundle path instead of constructing them independently
- app/store consumers already read authoritative handle ids through the shared contract
  - `buildDispatcher.ts` and `useSpaghettiStore.ts` already consume authoritative handle ids through `getGeometryResultAuthoritativeHandleId`
  - `6B` preserved that existing `shape_set` handle envelope without widening the app/store contract

#### Locked direction:
- make `src/worker/authoritative/buildAuthoritativeGeometry.ts` the only place where backend choice becomes visible
- mint the first real authoritative `shape_set` handles through `src/worker/authoritativeGeometryStore.ts`
- resolve the current handle-versus-bundle circularity inside worker-local seams rather than changing the shared authoritative bundle contract
- keep shared request/result contracts, app/store code, and later export layers free of raw OC object leakage
- keep `src/worker/products/foothook/foothookCompatibilityAdapter.ts` as the draft/mesh bridge instead of the authoritative path
- treat `Geometry/Sketch` as authoritative input, not a standalone retained solid
- treat `Geometry/Extrude` as authoritative only when it lowers to a closed-profile `Body` output
- allow `Part/Cube` only because it lowers into that same sketch-plus-extrude authoritative path rather than because it deserves a permanent kernel special case
- keep `Walls`, taper, offset, and mesh-only outputs outside the initial authoritative whitelist for `1.3`
- allow the first authoritative retained result to keep `meshPreview` honest and minimal
  - `6B` should not force a renderable authoritative preview if the first OC-backed path cannot provide one honestly yet

### Implementation Spec

Likely files:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- `src/worker/authoritativeGeometryStore.ts`
- `src/worker/buildModel.ts`
- `src/shared/geometryResult.ts` only if a worker-local helper needs a small contract-aligned constructor adjustment without changing the shared result shape
- `src/worker/buildModel.test.ts`
- `src/worker/pipeline/buildPipeline.test.ts`
- worker-local OC binding helpers as needed

Shipped implementation:
1. Bound the authoritative adapter to the real OC boot seam from `Phase 6A`.
   - `src/worker/authoritative/buildAuthoritativeGeometry.ts` is still the only worker seam that initializes the authoritative backend
   - authoritative requests now translate ParaHook-owned compiled inputs plus request identity into the first OC-backed retained authoritative bundle for the supported subset
2. Resolved the authoritative handle registration circularity without widening the shared contract.
   - `src/worker/authoritativeGeometryStore.ts` now registers retained OC resources directly and mints the existing worker-owned `shape_set` handle before the authoritative bundle is assembled
   - authoritative handle release now disposes those retained worker-owned backend resources
3. Shipped the first non-null authoritative retained result through the adapter seam.
   - the first OC-backed authoritative result stays narrow and honest around supported rectangular `Body` extrudes
   - this now defines the first explicit authoritative whitelist for `1.3`:
     - `Geometry/Sketch` supplies authoritative input only
     - `Geometry/Extrude` earns authoritative retained geometry only for closed-profile `Body` output
     - `Part/Cube` is allowed only when it lowers into that same sketch-plus-extrude authoritative path
   - unsupported authoritative requests still return `null` instead of pretending success through the draft bridge
   - the authoritative bundle keeps result-class, request identity, diagnostics, trace, and handle semantics aligned with `src/shared/geometryResult.ts`
4. Kept `src/worker/buildModel.ts` as the orchestration seam only.
   - authoritative requests still delegate through `buildAuthoritativeGeometry.ts`
   - draft retained-result creation plus foothook-compatible artifact bridging remain on the current draft path
5. Added focused worker verification around the first retained authoritative result.
   - `src/worker/authoritative/buildAuthoritativeGeometry.test.ts` proves authoritative requests can now produce a non-null authoritative bundle with a valid `shape_set` handle and that releasing that handle disposes the retained resource
   - `src/worker/pipeline/buildPipeline.test.ts` still proves the worker pipeline passes the authoritative retained result through unchanged
   - `src/worker/buildModel.test.ts` and `src/worker/cad/featureStackRuntime.test.ts` keep draft-preview and artifact-only caller behavior honest on the draft path
6. Kept render and export follow-ons out of this slice.
   - `Phase 6B` still does not widen into backend failure hardening, final viewport-source honesty, or export shaping
   - authoritative preview/render improvements stay deferred to `Phase 7`

Definition of done:
- authoritative requests can now produce a non-null retained result from distinct backend work
- authoritative results use the existing worker-owned `shape_set` handle path rather than a new backend-leaking identity scheme
- the worker-local handle registration path no longer depends on constructing an authoritative bundle before a handle exists
- `buildModel.ts` remains an orchestrator instead of a direct OC integration surface

## [x] Model-Viewport 1.3 Phase 6C - Backend Failure Honesty And Focused Verification

### Summary

#### Purpose:
- harden the first OC-backed authoritative path so unavailable/failure cases stay honest and the repo has focused proof for boot reuse, draft bypass, and stale-handle safety

#### Current code-backed read:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - now has the first non-null OC-backed authoritative result path for the supported retained-result subset
  - still needs a narrow hardening pass so backend init failures and unsupported authoritative work stay predictably honest without leaking worker-owned handles
  - is now also the correct seam for enforcing the first authoritative-node whitelist instead of letting backend eligibility drift across app/store/viewer layers
- `src/worker/authoritativeGeometryStore.ts`
  - now owns retained-resource registration and release for worker-owned `shape_set` handles
  - is the seam where stale or failed authoritative work must not leak worker-owned handles or retained OC objects
- `src/worker/buildModel.ts`
  - already keeps draft-preview requests separate from authoritative requests
  - is the seam where tests should keep proving draft work does not accidentally trigger the OC backend path
- `src/app/spaghetti/contracts/geometryRequest.ts` plus compiled graph-native IR
  - already preserve the information needed to distinguish the first authoritative whitelist from later unsupported variants
  - means `6C` can now harden explicit eligibility around `Sketch` input, `Extrude Body` output, and `Cube`-via-lowering without widening the shared contract

#### Locked direction:
- preserve the current honest `null` fallback when OC initialization or authoritative generation is unavailable
- preserve one explicit authoritative whitelist for the remaining `1.3` ladder:
  - `Geometry/Sketch` is authoritative input only
  - `Geometry/Extrude` is authoritative only for closed-profile `Body` output
  - `Part/Cube` is allowed only through that same lowering path
  - `Walls`, taper, offset, and mesh-only outputs stay outside the authoritative whitelist for now
- prove draft-preview requests still avoid the authoritative backend path
- prove unsupported-but-valid graph-native requests return `null` honestly instead of leaking partial authoritative state
- prove failure/unavailable cases do not leak stale authoritative handles
- keep final viewport honesty cleanup and export shaping deferred to later phases

### Implementation Spec

Likely files:
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
- focused worker/backend tests

Shipped implementation:
1. Hardened the first OC-backed authoritative path around honest `null` fallback behavior.
   - `src/worker/authoritative/buildAuthoritativeGeometry.ts` now returns `authoritativeGeometryResult: null` when worker-local OC initialization or authoritative shape generation fails instead of escalating those backend failures into a worker-wide build error
   - unsupported-but-valid graph-native requests still return `null` honestly without widening app/store contracts
2. Preserved stale-handle safety inside worker-local authoritative seams.
   - if authoritative bundle assembly fails after a `shape_set` handle has been minted, the worker now releases that handle and returns `null` instead of leaving the retained worker-owned resource registered
   - partial OC-owned shape resources allocated before a rejected authoritative build still get released before the result falls back to `null`
3. Added focused verification around backend-failure honesty.
   - `src/worker/authoritative/buildAuthoritativeGeometry.test.ts` now proves unsupported body kinds still stay on the honest `null` path without booting OC, rejected OC boot returns `null` instead of throwing, partial OC build failures release retained resources before returning `null`, and post-registration bundle-assembly failure releases the minted `shape_set` handle before returning `null`
   - `src/worker/oc/ocInit.test.ts` still proves OC warm/init remains memoized at the worker seam
   - `src/worker/buildModel.test.ts` and `src/worker/pipeline/buildPipeline.test.ts` still prove draft-preview routing stays off the authoritative seam unless authoritative execution is explicitly requested
4. Kept later follow-ons out of this slice.
   - `Phase 6C` did not widen into final viewport-source honesty cleanup
   - `Phase 6C` did not widen into export-input shaping or `.step` writing

Definition of done:
- backend-unavailable and backend-failure cases on the first OC-backed authoritative path now return `null` honestly instead of failing the whole build
- minted `shape_set` handles do not leak across rejected authoritative bundle assembly
- focused worker verification now covers whitelist honesty, OC boot reuse, draft bypass, backend failure fallback, and stale-handle safety
 

## [x] Model-Viewport 1.3 Phase 7 - Final Viewport Source Honesty And Renderable Authoritative Preview

### Summary

#### Purpose:
- make `Final` mode visually and semantically honest once a distinct authoritative backend exists

### Implementation Spec

Likely files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultStatus.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`

Shipped implementation:
1. Split authoritative render ownership from the draft artifact bridge.
   - `src/app/spaghetti/selectors/selectViewportResultState.ts` now exposes one selector-owned `renderVm` for what the viewer actually draws, while `previewRenderVm` stays the draft/artifact preview lane
   - `retained-final` is now emitted only when the accepted authoritative result is actually renderable instead of reusing the draft preview VM under a final label
2. Added the first explicit authoritative render bridge local to the viewport-result family.
   - the first final render lane now derives from accepted authoritative retained geometry only
   - `Phase 7` uses the current authoritative `meshPreview` as the first truthful final render source without making artifact outputs, export seams, or toolbar state the owner of final geometry truth
3. Aligned viewer render behavior with selector-owned viewport truth.
   - `src/app/components/ViewerHost.tsx` now feeds `viewer.setParts(...)` and highlight filtering from the selector-owned render VM
   - `Final` no longer silently renders draft/artifact-preview viewer parts under a final label
   - `Auto` and `Draft` keep the draft bridge while `Final` stays authoritative-only
4. Added focused verification around the viewport honesty gap.
   - `src/app/spaghetti/selectors/selectViewportResultState.test.ts` now proves non-renderable authoritative results do not masquerade as final and renderable authoritative results derive final viewer parts from authoritative mesh preview
   - `src/app/components/ViewerHost.test.tsx` now proves explicit `Final` mode still renders no draft parts when authoritative is missing and uses authoritative mesh preview instead of artifact-preview viewer parts when authoritative is renderable
   - `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts` plus `src/app/components/ViewportOverlay.test.tsx` still prove selector-owned HUD reads stay aligned with the visible result state

Definition of done:
- `Final` mode never silently displays draft/artifact-preview geometry as final
- the viewport has one explicit rule for when authoritative retained geometry is renderable
- selector-owned viewport status and viewer render source now agree about whether the user is seeing draft, final, or an honest unavailable/pending state

## [x] Model-Viewport 1.3 Phase 8 - Export Input Contract From Authoritative Results

### Summary

#### Purpose:
- define the first explicit worker-side export-input layer downstream from authoritative retained results

### Implementation Spec

Likely files:
- `src/shared/exportTypes.ts`
- `src/shared/exportTypes.test.ts`
- `src/worker/pipeline/exportService.ts`
- `src/worker/pipeline/exportService.test.ts`

Shipped implementation:
1. Published one explicit authoritative export-input contract downstream from retained geometry.
   - `src/shared/exportTypes.ts` now defines `AuthoritativeExportInput`
   - that contract carries retained request identity plus the worker-owned `shape_set` handle needed by later export writers
   - `ExportRequest` now consumes that contract through `input` instead of treating `buildRequestId` alone as the export geometry identity
2. Added one shared derivation/helper seam for export input honesty.
   - `src/shared/exportTypes.ts` now exports `isAuthoritativeExportInput(...)`, `createAuthoritativeExportInput(...)`, and `deriveAuthoritativeExportInput(...)`
   - export input derives from retained authoritative geometry only
   - draft retained results return `null` instead of masquerading as export-ready geometry
3. Kept the worker export stub aligned without widening into routing or file writing.
   - `src/worker/pipeline/exportService.ts` now consumes the published export-input contract
   - the descriptor stub now includes retained graph/build identity plus authoritative-handle identity instead of pretending `buildRequestId` alone is the worker-side export contract
4. Added focused verification around export-input truth.
   - `src/shared/exportTypes.test.ts` now proves authoritative retained results derive export input, draft results do not, and export input does not depend on viewport-only preview presence
   - `src/worker/pipeline/exportService.test.ts` proves the export stub consumes the published contract rather than raw draft/viewer data

Definition of done:
- ParaHook has one explicit export-input contract downstream from authoritative results
- that contract carries the identity later export writing needs without making the raw retained bundle the permanent writer API
- draft mesh-only state cannot masquerade as authoritative export input

## [x] Model-Viewport 1.3 Phase 9 - Export Gating And On-Demand Authoritative Preparation

### Summary

#### Purpose:
- define what happens when export is requested but authoritative geometry is missing, stale, or still building

### Implementation Spec

Likely files:
- `src/app/store/useAppStore.ts`
- `src/shared/exportTypes.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/useAppStore.test.ts`

Shipped implementation:
1. Added one explicit export-preparation outcome contract.
   - `src/shared/exportTypes.ts` now defines the first `ExportPreparationResult` family with `ready`, `pending`, and `blocked` outcomes
   - export preparation now has one typed answer instead of relying on viewport state or implicit rebuild assumptions
2. Reused accepted authoritative retained geometry when it already exists.
   - `src/app/store/useAppStore.ts` now exposes `prepareGraphDocumentExport(...)` and `prepareSpaghettiExport(...)`
   - those methods return `ready` immediately when `deriveAuthoritativeExportInput(...)` succeeds for the accepted authoritative retained result
3. Requested authoritative preparation explicitly when export input is missing.
   - `requestGraphDocumentBuild(...)` now accepts an explicit `geometryTargetOverride`
   - export preparation uses that override to force one authoritative build request even when the visible viewport is in `Draft`
   - export no longer depends on viewport mode to decide whether authoritative preparation is allowed
4. Taught graph runtime to recognize authoritative preparation already in flight.
   - `src/app/spaghetti/store/useSpaghettiStore.ts` now records `inFlightExecutionIntent`
   - export preparation can now return `pending` honestly when an authoritative build is already underway instead of issuing duplicate blind rebuilds
5. Blocked export honestly after authoritative preparation fails to yield retained authoritative geometry.
   - when the current graph revision has already completed an authoritative build and still has no reusable authoritative export input, export preparation now returns `blocked`
   - `.step` export preparation still never silently falls back to draft mesh, artifact-preview, or viewport render state
6. Added focused verification around ready versus pending versus blocked export preparation.
   - `src/app/store/useAppStore.test.ts` now proves export preparation reuses accepted authoritative geometry, requests one authoritative build and stays pending while it is in flight, and blocks honestly after an authoritative build completes without retained authoritative geometry

Definition of done:
- export requests have one explicit authoritative-preparation rule
- the app/runtime can distinguish ready, pending-authoritative-preparation, and honestly blocked export states
- `.step` export never silently uses draft mesh-only data

## [x] Model-Viewport 1.3 Phase 10 - STEP Writer Adapter And Worker Export Operation

### Summary

#### Purpose:
- add the first real worker-side `.step` export operation downstream from the authoritative export-input contract

#### Current read:
- `src/shared/exportTypes.ts` already limits export input to retained authoritative results with a worker-owned `shape_set` handle.
- `src/app/store/builds/appStoreBuildReleaseFlow.ts` already gates export preparation around ready, pending, and blocked states without falling back to draft mesh.
- `src/worker/pipeline/exportService.ts` is still a placeholder that base64-encodes request identity and the `shape_set` handle instead of writing STEP geometry.
- `src/worker/authoritativeGeometryStore.ts` owns the in-memory authoritative shape resources, but it currently exposes registration and release only; Phase 10 needs a read-only lookup/export seam.
- `src/worker/worker.ts` currently accepts build requests and authoritative-handle release requests only; there is no worker message route for an export request/result yet.
- `opencascade.js` includes `STEPControl_Writer`, `BRep_Builder`, `TopoDS_Compound`, `TopoDS_Shape`, and Emscripten `FS`, so the likely path is available but still needs a real binding probe before implementation locks exact overload names.

#### Locked direction:
- keep `.step` writing behind a worker adapter
- keep toolbar/export UI downstream from that worker operation
- keep format-specific logic out of viewport/result selectors
- make STEP export consume only authoritative `shape_set` resources, never `meshPreview`, draft retained geometry, artifact-preview data, or Three.js viewer state
- preserve `stl` as a later mesh-export format; Phase 10 is about true B-rep `.step` only

### Implementation Spec

#### Exact First Code Cut

Replace the export descriptor stub with a worker-owned STEP writer adapter that:

1. Validates `ExportRequest.format === 'step'`.
2. Looks up the authoritative `shape_set` by `request.input.authoritativeHandle.handleId`.
3. Converts the retained shape set into one exportable OC shape:
   - one retained shape can be transferred directly
   - multiple retained shapes should be assembled into a `TopoDS_Compound` with `BRep_Builder`
4. Runs `STEPControl_Writer.Transfer(...)` and `STEPControl_Writer.Write(...)` against an Emscripten in-memory file.
5. Reads the generated STEP bytes/text from `oc.FS`.
6. Returns `ExportResult` with:
   - `format: 'step'`
   - `filename: parahook-<buildRequestId>.step`
   - `dataBase64` containing the actual STEP file contents
7. Returns or throws an honest worker/export failure when:
   - the handle is missing or already released
   - the shape set is empty
   - the STEP writer transfer/write status fails
   - the OC filesystem read fails

#### Likely Files

- `src/worker/pipeline/exportService.ts`
- `src/worker/pipeline/exportService.test.ts`
- `src/worker/authoritativeGeometryStore.ts`
- `src/worker/authoritativeGeometryStore.test.ts` if lookup/release behavior needs focused coverage
- `src/worker/worker.ts`
- `src/app/buildDispatcher.ts`
- `src/app/buildDispatcher.test.ts`
- `src/shared/buildTypes.ts` if the existing worker message family remains the home for export worker messages
- `src/shared/exportTypes.ts` only if export result/error validation needs a small contract addition
- optional new worker-local helper such as `src/worker/pipeline/stepExportWriter.ts`

#### Binding Probe

Before replacing the stub, run one narrow local probe against the installed `opencascade.js` build to confirm the exact JavaScript binding names and return values for:

- `new oc.STEPControl_Writer()`
- `writer.Transfer(shape, ...)`
- `writer.Write(filename)`
- `oc.FS.readFile(filename, { encoding: 'binary' | 'utf8' })`
- `new oc.TopoDS_Compound()`
- `new oc.BRep_Builder()`
- `builder.MakeCompound(compound)`
- `builder.Add(compound, shape)`

Keep the probe temporary and remove it before finalizing the implementation.

#### No-Widening Rule

Do not use Phase 10 to:

- add a full Export workspace UI
- solve Browser target collection
- implement `.stl`, `.obj`, or `.glb`
- export imported STEP/reference B-rep
- widen node-family B-rep support
- use draft `meshPreview` as STEP input
- make viewport selectors or Three.js objects part of export truth

#### Implementation Risks

- `opencascade.js` overload names may need the same reflective candidate lookup style already used by the authoritative builder.
- The current `AuthoritativeShapeSetResource` stores generic owned resources, so the implementation may need a narrow shape-resource type or lookup helper without leaking raw OC objects to app/shared contracts.
- Multi-body exports need a compound shape so a multi-profile authoritative result writes as one STEP file.
- Worker export routing should avoid disturbing build supersession and authoritative handle release behavior already proven for build requests.

#### Verification Shape

Focused tests should prove:

- `exportService(...)` no longer returns the old descriptor string for `step`.
- a registered authoritative shape set can be exported to STEP through a fake writer/FS runtime.
- missing or released handles fail honestly instead of producing a fake file.
- multi-shape resources are added to a compound before transfer.
- draft-only export input cannot reach the writer because the shared export input helper still returns `null`.
- worker routing can accept an export request and post an export result or export worker error without corrupting build routing.

Run:

- `npm.cmd test -- --run src/worker/pipeline/exportService.test.ts src/shared/exportTypes.test.ts`
- any new focused worker routing/store tests added in the implementation
- `npm.cmd run build`

#### Shipped Implementation

1. Replaced the placeholder export descriptor with real STEP writer output.
   - `src/worker/pipeline/exportService.ts` now looks up the authoritative `shape_set`, rejects missing handles, boots the OpenCascade worker instance, and returns base64 STEP text.
   - `src/worker/pipeline/exportService.test.ts` proves the old descriptor path is gone and missing handles fail honestly.
2. Added a worker-local STEP writer adapter.
   - `src/worker/pipeline/stepExportWriter.ts` transfers one retained shape directly or combines multiple retained shapes into a `TopoDS_Compound` with `BRep_Builder`.
   - The adapter runs `STEPControl_Writer.Transfer(shape, 0, true)` and `STEPControl_Writer.Write(...)`, then reads the generated STEP file from OpenCascade MEMFS.
   - The adapter hides the current OpenCascade.js filename-binding quirk by detecting and reading the newly created MEMFS file when `Write(...)` mangles the requested filename.
3. Added the read-only authoritative shape-set lookup needed by export.
   - `src/worker/authoritativeGeometryStore.ts` now exposes `getAuthoritativeShapeSet(...)` without exposing that worker-local resource through app/shared contracts.
4. Added worker export routing.
   - `src/shared/exportTypes.ts` now validates `ExportWorkerRequest`.
   - `src/worker/worker.ts` accepts `type: 'export'` messages and posts either `export_result` or export-scoped `worker_error`.
   - `src/worker/worker.test.ts` proves export requests route through the export service and failures post export worker errors.
5. Kept Phase 10 scoped to true B-rep `.step`.
   - No Export workspace UI, Browser target collection, imported STEP export, `.stl`, `.obj`, `.glb`, or node-family B-rep widening shipped in this phase.
   - Draft meshes, artifact previews, `meshPreview`, viewport selectors, and Three.js state remain outside STEP export truth.
6. Verified the implementation.
   - The installed `opencascade.js` binding probe confirmed `STEPControl_Writer_1`, `Transfer(shape, 0, true)`, `Write(...)`, `BRep_Builder.MakeCompound(...)`, and `BRep_Builder.Add(...)` are available.
   - Focused tests and production build passed.

Definition of done:
- the worker can emit a real `.step` result from authoritative export input
- the exported data comes from retained OpenCascade B-rep shape resources, not draft mesh or viewer state
- missing, stale, or unsupported authoritative handles fail honestly
- file-writing logic stays outside viewport and toolbar ownership

## [ ] Model-Viewport 1.3 Phase 11 - Export Handoff Status, Verification, And 1.3 Closeout

### Summary

#### Purpose:
- close the `1.3` ladder by making export handoff status honest at the app boundary and verifying the remaining transitional bridges

#### Current read:
- after worker-side export exists, ParaHook still needs one final pass for:
  - pending/failure/success status honesty
  - focused end-to-end verification
  - retirement or explicit parking of any temporary `1.3` bridges

#### Locked direction:
- keep this close-out narrow
- verify the end-to-end authoritative-to-export handoff
- update family docs so `1.3` closes from real proof instead of assumption

### Implementation Spec

Likely files:
- app/export handoff surfaces
- focused verification tests
- `1.3` family docs close-out updates

Definition of done:
- `.step` export is end-to-end downstream from authoritative geometry truth
- the temporary transitional bridges left by earlier `1.3` phases are either removed or explicitly documented
- `Model-Viewport-1.3` is honestly closable

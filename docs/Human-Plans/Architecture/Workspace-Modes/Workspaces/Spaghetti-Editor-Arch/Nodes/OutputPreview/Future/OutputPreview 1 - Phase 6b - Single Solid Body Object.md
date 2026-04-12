# `OutputPreview-1 Phase 6b` - `Single Solid Body Object`

## Doc Header

### Doc History
21. 2026-04-12 12:47:01: Marked `OutputPreview-1 Phase 6b.5 - Proof Matrix And Family Handoff` complete after the final focused proof matrix stayed green across singular-member rendering, same-row singular-only and mixed aggregation parity, split published child Browser/viewer identity, and viewport pick round-trip, leaving no narrower `6c` owner to reopen
20. 2026-04-12 12:41:11: Tightened `OutputPreview-1 Phase 6b.5 - Proof Matrix And Family Handoff` into an implementation-ready closeout pass after live proof confirmed `6b.3f`, `6b.3g`, and `6b.4` are now healthy, so the remaining work is the final Browser-plus-viewport verification matrix and the go/no-go decision on whether the `6b` family can close without reopening already-fixed seams
19. 2026-04-12 12:38:00: Marked `OutputPreview-1 Phase 6b.3f - Same-Row Singular Aggregation Resolution`, `OutputPreview-1 Phase 6b.3g - Aggregation Matrix And Mixed Contributor Parity`, and `OutputPreview-1 Phase 6b.4 - Split Object Selection And Browser Alignment` complete after the live authored repro confirmed singular-only and mixed same-row `SolidBodies` aggregation now resolve correctly and split published child selection/highlight parity is clean
18. 2026-04-12 11:50:01: Added the next pre-`6b.4` follow-up ladder after the new authored repro matrix proved the remaining failure is narrower than generic subset resolution: whole `SolidBodies` rows already work, separate singular `SolidBody` rows already work, and mixed `SolidBody + SolidBodies` same-row aggregation at least enters `Building Final...`, while only singular-only same-row `SolidBody + SolidBody -> one SolidBodies row` still stalls at `Waiting For Geometry`
17. 2026-04-12 11:38:34: Marked `OutputPreview-1 Phase 6b.3e - Subset Collection Final Re-Proof` complete after the now-isolated authored explicit-subset waiting seam was narrowed to the viewer-target artifact-preview admission rule, then repaired so accepted subset bundle artifacts can still render when project draft preview is enabled but currently contributes no live viewer parts
16. 2026-04-12 11:33:48: Tightened `OutputPreview-1 Phase 6b.3e - Subset Collection Final Re-Proof` into an implementation-ready pass after live proof showed the viewport is now honest but the authored explicit-subset case still never resolves out of `Waiting For Geometry`, narrowing the next owner to the subset build/output-entry/bundle resolution path instead of any more viewport fallback or retained-geometry masking
15. 2026-04-12 11:22:03: Marked `OutputPreview-1 Phase 6b.3d - Retained Geometry Subset Guard` complete after the next live authored-subset repro proved that even with `6b.3c` landed the viewport could still keep stale whole-extrude geometry alive through retained committed draft/final fallback on coarse part-key continuation alone, then shifted the end-to-end subset proof to `6b.3e`
14. 2026-04-12 11:06:22: Marked `OutputPreview-1 Phase 6b.3c - Draft Geometry Mesh Subset Guard` complete after the remaining post-`6b.3a-b` authored subset over-render was traced to the whole-node draft geometry mesh lane, then repaired by suppressing that draft mesh whenever `OutputPreview` is publishing explicit `SolidBody:*` members that the whole upstream extrude mesh cannot truthfully represent
13. 2026-04-12 11:00:58: Tightened `OutputPreview-1 Phase 6b.3c - Draft Geometry Mesh Subset Guard` into an implementation-ready pass, grounding the next work in the live `Waiting For Geometry` repro where the viewport still over-renders the whole upstream extrude through the draft geometry mesh lane even after `6b.3a-b` repaired output-entry preservation and artifact-preview fallback
12. 2026-04-12 10:58:18: Added a new `OutputPreview-1 Phase 6b.3c - Draft Geometry Mesh Subset Guard` follow-up after the latest live repro proved that even with `6b.3a-b` landed the viewport can still over-render the whole upstream extrude through the draft-geometry `Waiting For Geometry` lane, then shifted the authored subset re-proof step down to `6b.3d`
11. 2026-04-12 10:49:54: Marked `OutputPreview-1 Phase 6b.3b - Explicit Contributor Fallback Guard` complete after the shared preview-preparation renderable fallback was tightened so explicit `SolidBody:*` contributors no longer silently reuse the coarse parent extrude artifact when their contributor-specific artifact is missing, keeping draft, viewport-result, and shared composition honest about unresolved subset members
10. 2026-04-12 10:45:34: Tightened `OutputPreview-1 Phase 6b.3b - Explicit Contributor Fallback Guard` into an implementation-ready pass after the live post-`6b.3a` repro proved that same-slot explicit contributors can now stay distinct yet draft `OutputPreview` still falls back to the whole upstream `solidBodies` collection, so the next owner is now the coarse-parent renderable fallback lane rather than output-entry preservation
9. 2026-04-12 10:38:24: Marked `OutputPreview-1 Phase 6b.3a - Same-Slot Explicit Contributor Resolution` complete after the same-slot duplicate contributor seam was narrowed to an order-sensitive output-entry identity rule, then repaired by making every colliding explicit contributor use a stable port-qualified output id so build-input shaping, accepted bundle lookup, and preview render preparation all resolve both body-specific entries consistently
8. 2026-04-12 10:30:41: Tightened `OutputPreview-1 Phase 6b.3a - Same-Slot Explicit Contributor Resolution` into an implementation-ready pass, grounding the next work in the live debug proof that one `SolidBodies` slot with two explicit `SolidBody` contributors from the same upstream extrude currently resolves only one body-specific artifact while the sibling contributor disappears somewhere between output-entry identity, accepted bundle hydration, and preview-preparation lookup
7. 2026-04-12 10:25:32: Added the `6b.3a-c` follow-up ladder before `OutputPreview-1 Phase 6b.4 - Split Object Selection And Browser Alignment`, capturing the newly proven same-slot explicit-contributor seam where one `SolidBody` contributor resolves to a body-specific artifact while its sibling contributor from the same upstream extrude still remains unresolved and can fall back too coarsely
6. 2026-04-12 10:00:03: Marked `OutputPreview-1 Phase 6b.3 - Singular SolidBody Membership Filtering` complete after the geometry-owner pass landed with explicit extrude body ids, per-output-entry body artifacts, accepted preview bundle routing into preview/viewer selectors, and focused proof that singular-member preview rendering now prefers the correct body-specific artifact instead of the old coarse parent owner
5. 2026-04-12 09:39:09: Tightened `OutputPreview-1 Phase 6b.3 - Singular SolidBody Membership Filtering` into an implementation-ready geometry-ownership pass after `6b.2`, grounding the next work in the live repro that Browser/object identity now resolves honestly while singular-member rendering and split-child over-highlight still collapse through one coarse rendered body owner
4. 2026-04-12 09:36:43: Marked `OutputPreview-1 Phase 6b.2 - Published Object Identity Contract Lock` complete after the canonical `graphDocumentId + outputEntryId` published-object viewer identity landed in the preview/viewer and project-content seams, then recorded the narrower follow-up pass that rebinds Browser child-object highlight keys back to accepted bundle output entries while leaving singular-member and shared-geometry sibling collapse for `Phase 6b.3`
3. 2026-04-12 08:52:53: Tightened `OutputPreview-1 Phase 6b.2 - Published Object Identity Contract Lock` into an implementation-ready follow-on by grounding it in the completed `6b.1` runtime trace, locking `graphDocumentId + outputEntryId` as the recommended canonical published-object viewer identity, and narrowing the next pass to identity-threading only before later rendering and selection repairs
2. 2026-04-12 08:38:23: Completed `OutputPreview-1 Phase 6b.1 - Research And Runtime Trace` in this dedicated `Phase 6b` doc, proving that singular-member rendering currently collapses first in preview-preparation/render-vm artifact reuse while split child-object selection currently collapses first in project-content rendered-part identity because rendered viewer keys still rehydrate by `graphDocumentId + slotId` instead of one canonical published-object key
1. 2026-04-12 08:28:59: Created this dedicated `OutputPreview-1 Phase 6b` future plan doc after a new live repro showed that `OutputPreview` still collapses viewport ownership back to slot-level or node-level body rendering, so split `SolidBodies` children cannot yet select independently and one dragged `SolidBody` member can still render the whole upstream collection

### Purpose

- define the dedicated follow-on plan for `OutputPreview` viewport identity and singular-member rendering after shipped `Phase 6`
- separate the new viewer/runtime ownership problems from the already-shipped backend default-split publication cleanup
- split the remaining work into research-first chunks so we can prove whether the fix belongs in preview preparation, viewer identity, artifact shaping, or a narrower bridge between them

### Scope

This phase covers:
- split `SolidBodies` publication cases where Browser rows already represent multiple objects but viewport selection still collapses to one shared target
- singular `SolidBody` publication cases where dragging one member output into `OutputPreview` still renders the full upstream body collection in the viewport
- the contract between `outputEntryId`, `sourcePortId`, `memberIndex`, `viewerKey`, and rendered viewer parts for published output objects
- focused Browser-to-viewport proof for per-object selection, highlight, and visibility alignment

This phase does not cover:
- reopening the shipped `Phase 6` default publication-mode behavior for fresh versus legacy `OutputPreview` slots
- broader `Extrude` authored `Combine` versus `New Objects` semantics beyond reading the already-authored output ports honestly
- general viewer-selection architecture outside the published-object path
- worker/export redesign unless the research proves the current part-artifact contract is too coarse to support per-member output truth

## Doc Body

## [ ] `OutputPreview-1 Phase 6b` - `Single Solid Body Object`

Purpose:
- make `OutputPreview` viewport ownership as honest as the Browser/output surface when one published slot fans out into multiple objects or when one singular `SolidBody` member is published on its own

Owns:
- proving where published-object identity currently collapses between `outputSurface`, preview preparation, viewer render keys, and workspace selection
- deciding the canonical viewer-facing identity for one published object
- fixing the singular-member case so one dragged `SolidBody` member renders only that member in the viewport
- fixing the split-selection case so one published child object no longer highlights or selects every sibling from the same upstream collection
- focused proof across Browser rows, viewer highlighting, viewer picks, and published-object transforms

Does not own:
- changing the default `grouped` versus `split` publication policy from shipped `Phase 6`
- adding new `OutputPreview` row-template or color-polish work
- broader Browser hierarchy changes outside the already-published component/object structure
- non-published geometry preview paths such as authoritative preview or draft preview layering unless they must mirror the same published-object identity contract

Current seam read:
- `src/app/spaghetti/outputSurface.ts` already gives published objects per-entry identity through `outputEntryId`, optional `memberIndex`, and object ids such as `output-object:s001:member-001`, so the Browser/content layer can already tell split child objects apart
- `src/app/spaghetti/previewPreparation.ts` still maps preview entries back to `sourcePartKeyStr` from `computeFeatureStackIrParts(graph).nodeIdToPartKey`, which stays node-scoped rather than published-object-scoped even when `sourcePortId` or `memberIndex` distinguishes one singular member from the rest of the collection
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts` already creates split member viewer keys like `slot:member-001`, but each viewer part still wraps the same whole-node `PartArtifact`, so unique viewer keys do not yet guarantee unique rendered body ownership
- `src/app/store/useAppStore.ts` still rebuilds project rendered parts through `buildGraphViewerPartKey(graphDocumentId, slotId)`, which is slot-scoped and ignores `sourceOutputEntryId`, `sourcePortId`, and split member keys when the Browser later resolves object visibility and selection
- that means the live symptoms can plausibly share one root cause family:
  - split Browser objects still collapse to one slot-level viewer target, so selecting one highlights all siblings
  - singular `SolidBody` member wires still resolve to the whole upstream extrude artifact, so the viewport renders every body even though the Browser shows only one object row

Locked direction:
- treat this as a new follow-on after shipped `Phase 6`, not as a hidden `6.6` retro-edit inside the default-publication cleanup doc
- start with a research pass that traces the exact identity handoff from `outputEntryId` through viewer pick/highlight resolution before choosing the narrowest fix
- prefer one canonical published-object identity that Browser rows, rendered viewer keys, and viewport picks can all agree on
- keep authored `Extrude` output semantics unchanged; the published-object/viewer bridge should read singular member outputs honestly instead of flattening them back into the parent collection

Likely files:
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- possibly `src/shared/buildTypes.ts` if the current `PartArtifact` / `ViewerRenderablePart` contract proves too coarse for singular-member rendering
- focused tests in:
  - `src/app/spaghetti/outputSurface.test.ts`
  - `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/store/useAppStore.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`

Suggested implementation order:
1. Prove the exact identity collapse from published output entry to viewer pick/highlight.
2. Lock one canonical per-object viewer identity contract.
3. Repair the singular `SolidBody` member rendering path so one member does not render the whole collection.
4. Repair split-object selection/highlight so sibling objects no longer collapse together.
5. Re-run one focused Browser-plus-viewport proof matrix before handing the family forward.

Acceptance checks:
- dragging one `solidBody` member output into `OutputPreview` yields one Browser object and one viewport-rendered object, not the whole upstream `solidBodies` collection
- dragging one `solidBodies` aggregate output in split mode still yields many Browser objects, and each published child object has a stable independent viewport target
- selecting one published child object in the viewport no longer selects every sibling from that same split source row
- Browser selection, viewport pick resolution, and published-object visibility all agree on the same per-object identity instead of mixing slot-level and object-level ownership

## [x] `OutputPreview-1 Phase 6b.1` - `Research And Runtime Trace`

Purpose:
- prove exactly where the published-object identity collapses before any fix work begins

Owns:
- tracing the live handoff from `outputEntryId` and `sourcePortId` into preview-preparation entries, viewer render vm items, rendered project parts, and viewer pick/highlight routing
- determining whether the two reported symptoms share one root cause family or split into separate owners
- naming the narrowest seam that should become the canonical owner for published-object viewer identity

Does not own:
- changing runtime behavior yet
- expanding the worker/build artifact contract unless the trace proves the current artifact shape is the blocker

Current questions to answer:
- when one singular extrude member port is wired to `OutputPreview`, which layer first forgets that the source was one member instead of the whole collection?
- when one split Browser child object is selected, which layer still routes that pick back through slot-level `viewerKey` or slot-level rendered-part grouping?
- can the current `PartArtifact` shape already support the required per-member truth if viewer mapping changes, or does the artifact/result contract need more explicit member ownership?

Expected output:
- one explicit runtime trace for:
  - split `SolidBodies` -> many Browser objects -> one viewport pick should select only one object
  - singular `SolidBody` member -> one Browser object -> viewport should render only that member
- one classification of the likely owners:
  - preview preparation / render-vm identity
  - project-content rendered-part identity
  - viewer pick/highlight routing
  - artifact shaping contract
- one implementation-ready handoff for `Phase 6b.2`

Researched result:
- `src/app/spaghetti/outputSurface.ts` already preserves published-object identity at the output-surface layer through deterministic `outputEntryId` generation, including `sourcePortId` and `memberIndex` when needed, so Browser/content truth can already distinguish split children and singular member outputs.
- `src/app/spaghetti/previewPreparation.ts` keeps `sourcePortId` and optional `memberIndex` on each preview entry, but it still resolves `sourcePartKeyStr` only from `computeFeatureStackIrParts(graph).nodeIdToPartKey`, so every member from the same upstream node still points at one node-scoped part key.
- `src/app/spaghetti/previewPreparation.ts` then builds renderable preview entries only by `sourcePartKeyStr`, which means a singular `SolidBody` member entry and every split member entry still reuse the same full-node `PartArtifact` whenever the artifact list only contains that node-scoped part key.
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts` creates distinct member viewer keys such as `slot:member-001`, but those keys still wrap the same reused `PartArtifact`, so unique viewer keys do not yet imply unique rendered geometry ownership.
- `src/app/spaghetti/selectors/selectViewportResultState.ts` still reasons about current output continuation and retained geometry through `previewPreparation.previewCandidatePartKeys`, which are node-part-key based rather than published-object based, so the viewport-result path still lacks one canonical per-object identity.
- `src/app/store/useAppStore.ts` stores each published object with its own `sourceOutputEntryId`, but `selectRenderedProjectPartSet(...)` still rehydrates rendered viewer parts through `buildGraphViewerPartKey(graphDocumentId, slotId)`, so many published child objects from one slot still collapse back onto one shared rendered viewer key.
- `src/app/components/ViewerHost.tsx` then indexes content objects by that shared viewer key, so when many published objects reuse the same key the pick-routing map can only remember one object row for that key at a time.

Runtime trace:

1. Split `SolidBodies` child-object selection trace
- `outputSurface.ts` generates distinct split child output ids such as `output-entry:s001:node-extrude-1:member-001`, and `buildGraphPublishedContentSurface(...)` turns them into distinct Browser object ids such as `output-object:s001:member-001`.
- `useAppStore.ts` keeps that distinction in `projectContent.objectsById[*].sourceOutputEntryId`, so project-content truth still knows which published child object is which.
- the first render-identity collapse happens in `selectRenderedProjectPartSet(...)`, because each resolved published object still looks up its viewer part only through `buildGraphViewerPartKey(objectRow.ownerGraphDocumentId, objectRow.slotId)`.
- that means many published child objects from one split slot can all attach to the same rendered viewer part and the same visible `viewerKey`, even though their `sourceOutputEntryId` values differ.
- `ViewerHost.tsx` then builds `contentObjectRowByViewerPartKey` from that collapsed viewer key, so one later object can overwrite earlier siblings in the lookup map and viewport picks can only round-trip through one surviving object row for that shared key.
- classification: the primary owner for the split-selection collapse is `project-content rendered-part identity`, with `viewer pick/highlight routing` acting as the secondary downstream seam that exposes the collapse.

2. Singular `SolidBody` member rendering trace
- `outputSurface.ts` can already represent the singular member wire as its own `outputEntryId`, because `buildGraphOutputEntryId(...)` includes `sourcePortId` when the slot entry needs that extra disambiguation.
- `previewPreparation.ts` carries that member metadata forward only as `sourcePortId` plus optional `memberIndex`, but the actual renderable lookup still goes back to the node-scoped `sourcePartKeyStr`.
- `buildPreviewPreparationEntries(...)` therefore maps the singular member entry to the same full-node artifact that would also be used for the whole upstream extrude collection, because the artifact list is keyed by part key rather than by published-object identity.
- `selectPreviewRenderVm.ts` then gives the entry a unique viewer key while still wrapping that same shared artifact, so the viewport can render one unique viewer row that still shows the whole upstream collection.
- `selectViewportResultState.ts` continues to compare output continuity by node-part-key sets, which confirms that the viewport-result path still reads one node-level geometry identity rather than one published-object identity.
- classification: the primary owner for the singular-member render collapse is `preview preparation / render-vm identity`; the `artifact shaping contract` is not yet proven as the first blocker, but it may still need a minimal extension later if `Phase 6b.3` proves the current shared artifact cannot be filtered down to one member.

Owner classification:
- `preview preparation / render-vm identity`: primary owner for the singular-member case because member metadata survives only as labels/keys while geometry lookup still reuses one node-scoped artifact.
- `project-content rendered-part identity`: primary owner for the split-object selection case because distinct published objects still rehydrate to one shared `graphDocumentId + slotId` viewer key.
- `viewer pick/highlight routing`: secondary owner that currently cannot recover per-object truth after many objects have already collapsed onto one shared viewer key.
- `artifact shaping contract`: not yet proven as the first fix owner because build bundles already preserve `outputEntryId`, but later work may still need a minimal per-member artifact addressability extension if geometry filtering cannot happen downstream of the current artifact shape.

Implementation-ready handoff for `Phase 6b.2`:
- lock one canonical viewer-facing published-object identity that can be derived from published-object truth already carried by Browser/project-content reads; `slotId` alone is no longer sufficient because it collapses split siblings.
- thread that canonical identity through:
  - preview-preparation entry identity
  - preview/viewer `viewerKey`
  - project-content rendered-part lookup
  - viewport pick/highlight routing
- keep the first contract pass narrow:
  - do not change authored `Extrude` output semantics
  - do not widen the worker/build contract unless the later singular-member filtering pass proves the current artifact shape cannot isolate one member
- the next doc/code question for `Phase 6b.2` is therefore:
  - should the canonical viewer identity anchor directly on `outputEntryId`, or on a stable derived key that preserves the same per-object truth without falling back to `slotId`

## [x] `OutputPreview-1 Phase 6b.2` - `Published Object Identity Contract Lock`

Purpose:
- choose and adopt the canonical identity that one published object should carry across Browser, viewer, and workspace reads

Completed result:
- `6b.2` now locks `graphDocumentId + outputEntryId` as the canonical published-object viewer/runtime identity.
- identity layers now stay intentionally distinct:
  - `objectId` = Browser/project content row identity
  - `graphDocumentId + outputEntryId` = published-object viewer/runtime identity
  - `artifact.partKeyStr` = geometry/artifact identity
- the app-side identity pass landed across the main published-object seams:
  - `src/app/spaghetti/outputSurface.ts`
  - `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/components/ViewerHost.tsx`
  - `src/app/panels/selectBrowserGraphRows.ts`
- the follow-up pass then tightened the same contract where the first live repro still showed drift:
  - `src/app/store/useAppStore.ts` now hydrates rendered project parts from accepted bundle output entries keyed by the same qualified published-object identity when flattened accepted artifacts are stale or missing
  - `src/app/panels/browserInteractions.ts` now keeps forwarding Browser object `highlightViewerKey` back into viewer selection even during shared viewer composition
- focused proof landed with targeted tests in:
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/panels/selectBrowserGraphRows.test.ts`
  - `src/app/panels/browserInteractions.test.ts`
  - `src/app/store/useAppStore.test.ts`

What this phase accomplished:
- the code now names one stable per-object identity instead of mixing slot-level and object-level ownership ad hoc
- `slotId` is no longer treated as sufficient published-object viewer identity on the main `6b.2` path
- Browser/object rows, rendered project parts, and viewer highlight routing now have one honest per-object key they can agree on

What this phase did not claim to finish:
- singular `SolidBody` geometry filtering is still not repaired here
- the live `Extrude -> New Objects` repro can still over-highlight sibling child objects when many children ultimately share one coarse rendered geometry owner
- that remaining seam now looks like member-level geometry ownership/filtering rather than another missing identity-contract lock

Verification notes:
- focused tests for the new identity and Browser highlight rebinding passed
- broader `useAppStore` proof still has unrelated or later-phase expectation drift, so `6b.2` is considered complete as the identity-contract pass, not as the final geometry-behavior closeout

Handoff to `6b.3`:
- keep `graphDocumentId + outputEntryId` as the canonical published-object identity source
- use `6b.3` to repair singular-member and shared-geometry body ownership so one published member can render and highlight independently without reusing the whole parent collection

## [x] `OutputPreview-1 Phase 6b.3` - `Singular SolidBody Membership Filtering`

Purpose:
- make one singular `SolidBody` publication render only one body in the viewport, and remove the remaining shared-geometry ownership collapse that still makes split children over-highlight together after `6b.2`

Completed result:
- `6b.3` now treats singular-member and split-member published geometry as a body-addressability problem instead of another viewer-key problem.
- the implementation took the minimal typed-extension route that the prep doc allowed:
  - `CompiledBuildDataOutputEntry` now carries optional `bodyId`
  - `Geometry/Extrude` in `NewObjects` mode now compiles to one runtime extrude op per resolved profile with deterministic body ids such as `node-extrude-1:body:001`
  - artifact emission now prefers a body-specific mesh artifact for each output entry when `bodyId` and geometry bodies are available
  - preview-preparation and preview/viewer selectors now prefer accepted bundle entry artifacts keyed by `outputEntryId` instead of falling back blindly to the old coarse node part key
- one small compat repair also landed inside `computeFeatureStackIrParts(...)` so single `SketchProfile` contributors still preserve sketch-op context when callers provide resolved inputs without resolved outputs.

What this phase accomplished:
- singular published `SolidBody` members can now bind to one body-specific artifact instead of reusing the whole parent extrude collection artifact
- `Extrude -> New Objects` runtime IR now exposes one explicit body owner per profile, which gives downstream preview and artifact code an honest member-level geometry address
- shared preview composition and viewport-result artifact-preview lanes now both honor accepted bundle entry artifacts for singular/split member rendering
- the remaining open follow-on is narrower than the original `6b.4` handoff:
  - `6b.3a-c` now own the same-slot explicit-contributor subset seam where one `SolidBodies` slot can be assembled from many `SolidBody:*` member wires from the same upstream extrude
  - only after that subset-resolution path is honest again should `6b.4` resume the later split-object routing/highlight parity lane

Main files changed:
- `src/shared/buildTypes.ts`
- `src/app/spaghetti/features/extrudeBodyIdentity.ts`
- `src/app/spaghetti/registry/nodeRegistry.ts`
- `src/app/spaghetti/compiler/compileGraph.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/store/useAppStore.ts`

Focused proof that landed:
- `src/app/spaghetti/compiler/compileGraph.test.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/worker/pipeline/artifactEmitter.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Verification notes:
- focused `6b.3` proof passed for compiler/body-id emission, compiled output-entry body ownership, body-specific artifact emission, preview render-vm bundle preference, shared preview composition bundle preference, and viewport-result singular-member artifact preference
- later live debug proof showed one narrower pre-`6b.4` seam still remains:
  - dragging the whole `solidBodies` array into `OutputPreview` works and yields independently selectable published child objects
  - wiring two explicit `SolidBody` member rows into one `SolidBodies` collection slot does not yet fully resolve as a final subset collection
  - the debug inspector currently shows one same-slot contributor resolving to `artifactPartKeyStr ... body:001` while the sibling contributor from that same slot/source node remains `unresolved`
  - because that explicit-contributor subset seam is still unresolved, `6b.4` should remain focused on split-object selection parity only after the narrower `6b.3a-c` cleanup below lands

## [x] `OutputPreview-1 Phase 6b.3a` - `Same-Slot Explicit Contributor Resolution`

Purpose:
- make one `SolidBodies` publication slot assembled from many explicit `SolidBody:*` wires resolve each contributor independently when they all originate from the same upstream geometry node

Completed result:
- `6b.3a` narrowed the live same-slot contributor loss to one order-sensitive output-entry identity rule instead of a deeper worker or geometry-owner failure.
- the fix now gives every colliding explicit contributor from the same `slotId + sourceNodeId + memberIndex` family its own stable port-qualified `outputEntryId`, rather than leaving the first contributor implicit and only qualifying later duplicates.
- because the build-input path, output-surface path, and preview-render path all reuse that shared helper, same-slot explicit contributors now stay aligned across:
  - build-unit / output-entry shaping
  - accepted bundle lookup
  - preview render preparation

What this phase accomplished:
- same-slot explicit `SolidBody:*` contributors from the same source node now preserve distinct published output ids even when their base identity would otherwise collide
- accepted bundle entries keyed by those explicit ids now resolve both contributors back to the correct body-specific artifacts during output-surface and preview-render reads
- the fix stayed narrowly scoped to output-entry preservation and did not widen the worker geometry schema, artifact schema, or viewer selection contract again

Main files changed:
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`

Focused proof that landed:
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`

Verification notes:
- focused proof passed for the exact same-slot explicit-contributor case, including accepted bundle resolution and preview render-vm lookup
- this phase intentionally stops short of proving the later coarse-parent fallback behavior on unresolved contributors
- if the authored subset case can still over-render the whole upstream collection after both contributors now resolve honestly, that remaining work belongs in `6b.3b`, not back in `6b.3a`

Acceptance checks:
- one `SolidBodies` slot with two explicit `SolidBody:*` contributors from the same extrude resolves two distinct published entries, not one resolved row plus one unresolved sibling
- both contributors keep distinct artifact addresses all the way into the accepted bundle / preview-preparation bridge
- final subset rendering no longer waits forever because one requested contributor silently vanished upstream

## [x] `OutputPreview-1 Phase 6b.3b` - `Explicit Contributor Fallback Guard`

Purpose:
- prevent unresolved explicit member contributors from falling back to the coarse parent extrude owner and making subset publication appear as the whole collection

Owns:
- tightening the rendering and viewport-result fallback rules for explicit `SolidBody:*` contributors so unresolved rows stay visibly unresolved instead of silently reusing aggregate part identity
- ensuring the preview/final bridge prefers `no renderable for this contributor yet` over `render the whole extrude collection anyway`
- making the debug and runtime surface honest enough that later `6b.4` selection work is not polluted by aggregate fallback masquerading as a selection bug

Completed result:
- `6b.3b` confirmed that the first bad coarse-parent reuse lived in the shared preview-preparation renderable selection seam, not in later viewer-only composition.
- explicit extrude member ports such as `SolidBody:001` and `SolidBody:002` now opt out of parent-part fallback when no contributor-specific bundle artifact is available.
- because preview render-vm, viewport-result state, and shared preview composition all read through that shared helper, the same truthful `no contributor artifact, no contributor renderable` rule now applies across the main published subset lanes.

What this phase accomplished:
- same-slot explicit contributor subset publication no longer silently renders phantom sibling bodies from the parent `solidBodies` collection when a requested contributor is unresolved
- grouped or aggregate publication can still use the old parent-artifact fallback where that behavior is still valid, so this pass stayed narrow to explicit member contributors
- the remaining open follow-on is now narrower than the old proof-only handoff:
  - `6b.3c` now owns the whole-node draft-geometry mesh lane that can still over-render the full upstream extrude while viewport status says `Waiting For Geometry`
  - the authored end-to-end proof matrix now shifts down to `6b.3e`

Main files changed:
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/previewPreparation.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`

Focused proof that landed:
- `src/app/spaghetti/previewPreparation.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`

Verification notes:
- focused tests passed for explicit contributor subset rows where only one contributor-specific artifact is available and the sibling must remain unresolved/null instead of reviving the whole parent artifact
- this phase intentionally does not claim the full authored user repro is closed because the latest live check still shows one further seam:
  - even after `6b.3a-b`, the viewport can still show all upstream bodies through the draft geometry mesh lane while status says `Waiting For Geometry`
  - that remaining over-render now belongs in `6b.3c`, not in the artifact fallback path repaired here
- if the authored subset graph now renders only the requested members, the next remaining follow-on should be selection/highlight parity in `6b.4`

Acceptance checks:
- if one explicit contributor is unresolved, the viewport does not fall back to the whole upstream `solidBodies` collection for that contributor
- subset publication can no longer show phantom sibling bodies that were never requested in the slot
- Browser/debug truth and viewport truth agree on which explicit contributors are currently renderable versus unresolved

## [x] `OutputPreview-1 Phase 6b.3c` - `Draft Geometry Mesh Subset Guard`

Completed result:
- `6b.3c` confirmed that the remaining visible lie after `6b.3a-b` lived in the whole-node draft geometry mesh lane in `selectViewportResultState.ts`, not in output-entry preservation or accepted bundle artifact fallback.
- the selector now asks one explicit helper in `previewPreparation.ts` whether `OutputPreview` is publishing explicit `SolidBody:*` members, then suppresses whole-node draft mesh candidates when that publication shape is present.
- artifact-backed subset preview remains available, so this pass only blocks the dishonest whole-extrude draft mesh path and otherwise leaves truthful contributor-specific preview lanes intact.

What this phase accomplished:
- explicit subset publication no longer gets to display the whole upstream extrude mesh merely because draft geometry is the freshest node-level result
- while viewport status remains `Waiting For Geometry`, the user now sees either:
  - contributor-correct subset geometry from accepted/artifact-backed preview
  - or no geometry yet
  - but never the unpublished sibling bodies from the full upstream collection
- the next follow-on was later narrowed one step further by live proof:
  - `6b.3d` owns the retained committed geometry subset guard for cases where coarse part-key continuation can still keep the old whole extrude visible
  - `6b.3e` now owns the authored end-to-end subset collection re-proof across draft and final
  - `6b.4` remains the later Browser/viewport selection and highlight parity pass

Main files changed:
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/previewPreparation.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Focused proof that landed:
- `src/app/spaghetti/previewPreparation.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Verification notes:
- focused tests passed for the explicit subset waiting-state repro where whole-node draft mesh previously surfaced while accepted geometry was still unavailable
- this phase intentionally does not claim the full authored user repro is closed in final mode, because the remaining work is now to re-prove the authored subset case end-to-end after the draft-mesh guard
- if later manual proof finds geometry truth is correct but Browser/viewer selection still drifts, that remaining work still belongs in `6b.4`

Purpose:
- stop the viewport from showing the whole upstream extrude through the draft-geometry mesh lane when `OutputPreview` only publishes an explicit subset of `SolidBody:*` contributors

Owns:
- tracing the remaining over-render through the draft-geometry / retained-draft / waiting-for-geometry lane after `6b.3a-b`
- deciding when a published explicit-contributor subset should suppress whole-node draft mesh preview because that mesh does not yet represent the published subset truth
- keeping the viewport honest while final is unavailable or draft is waiting, so the user sees either:
  - only subset-correct contributor-specific artifact-backed geometry
  - or no geometry yet
  - but never the whole upstream collection masquerading as the published subset

Does not own:
- re-fixing artifact-preview fallback already closed in `6b.3b`
- Browser/viewer pick parity that belongs in `6b.4`
- the final authored proof matrix, which now belongs in `6b.3e`

Current seam read:
- the latest live repro shows:
  - final = unavailable
  - draft status = `Waiting For Geometry`
  - viewport still starts showing all upstream extrude bodies even though only two explicit `SolidBody` wires are connected to the `OutputPreview` `SolidBodies` slot
- that means the visible over-render is no longer coming from accepted bundle artifact fallback
- the stronger current owner is the draft geometry preview lane in `selectViewportResultState.ts`, likely through `currentDraftGeometryRenderVm`, retained draft base, or another whole-node mesh path that does not know this published output is only a subset

Locked direction:
- treat this as a draft-geometry visibility gate, not as another output-entry or artifact lookup pass
- when `OutputPreview` is publishing an explicit subset of `SolidBody:*` contributors from one upstream extrude, whole-node draft mesh preview is not honest enough to display as that published subset
- prefer:
  - subset-correct contributor-specific artifact-backed preview
  - or no visible geometry yet while status remains `Waiting For Geometry`
- do not let the whole-node draft mesh lane claim visibility merely because it is the freshest geometry result for the source node
- keep this pass narrow:
  - no new worker contract unless there is no way to detect subset publication versus whole-collection publication in current app-side truth
  - no attempt to solve final unavailability itself if the main visible lie is still the draft mesh lane

Historical implementation-prep notes:
- which selector decision first allows the whole-node draft mesh lane to win for explicit subset publication:
  - `currentDraftGeometryRenderVm`
  - retained draft base
  - overlay candidate
  - visible result candidate selection
- what is the smallest truthful predicate for "whole-node draft mesh preview is incompatible with this published subset"?
- should that predicate live:
  - in `previewPreparation` as one explicit helper
  - or directly in `selectViewportResultState.ts` where draft mesh candidates are admitted
- once whole-node draft mesh is suppressed for explicit subset publication, does status remain correctly `Waiting For Geometry` without further status-layer repair?

Implementation target files were:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- possibly `src/app/spaghetti/previewPreparation.ts` if the selector needs one explicit helper that marks subset publication as incompatible with whole-node draft mesh preview
- `src/app/components/ViewerHost.tsx` or `src/app/components/ViewportOverlay.tsx` only if the live draft lane is being sourced there rather than in selector state
- focused tests in:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultStatus.test.ts` if status/fallback semantics need explicit proof

Implementation order that landed:
1. Add one failing selector regression for the exact live case:
   - explicit subset `SolidBody:*` contributors
   - final unavailable
   - draft `Waiting For Geometry`
   - current draft mesh exists for the whole source extrude
   - expected: viewport does not show that whole-node draft mesh
2. Trace which candidate lane currently surfaces that mesh as visible.
3. Add the smallest truth test that marks explicit published subset rows as incompatible with whole-node draft mesh preview.
4. Gate only the offending draft lane with that predicate.
5. Re-run the subset waiting-state repro and verify the status still reads honestly.

Completion stop rule:
- this phase is complete once explicit subset publication no longer shows whole-node draft mesh while the viewport is in the `Waiting For Geometry` state
- if draft and final now both stay subset-honest, stop and hand the full authored re-proof to `6b.3e`
- if geometry truth is now correct but later Browser/viewport selection still drifts, stop and hand that remaining work to `6b.4`

Acceptance checks:
- when `OutputPreview` publishes an explicit subset of `SolidBody:*` contributors from one extrude and draft/final are still waiting, the viewport does not show the whole upstream extrude mesh
- the user sees either subset-correct geometry or no geometry yet, but not phantom sibling bodies from the unpublished members
- the `Waiting For Geometry` state stays honest instead of displaying whole-node draft mesh that contradicts the published subset

## [x] `OutputPreview-1 Phase 6b.3d` - `Retained Geometry Subset Guard`

Purpose:
- stop retained committed draft/final geometry from surviving explicit `SolidBody:*` subset publication on coarse upstream part-key matching alone

Owns:
- the retained-base / last-loaded continuation gate in `selectViewportResultState.ts`
- deciding when a previously accepted or committed geometry result is too coarse to remain visible for the current explicit subset publication
- keeping `Waiting For Geometry` honest by clearing stale whole-extrude retained geometry when the current authored output is only a member subset

Completed result:
- `6b.3d` confirmed that after `6b.3c` suppressed the whole-node draft mesh lane, one more whole-parent seam still survived through retained committed geometry.
- the retained-base continuation test was still using `partKeys` only, which let explicit subset publication continue to qualify an old whole-extrude geometry result as if it were still the same published output.
- the selector now treats explicit `SolidBody:*` subset publication as incompatible with retained committed geometry continuation on coarse part-key equality alone, so stale whole-extrude retained draft/final bases clear instead of staying visible behind `Waiting For Geometry`.

What this phase accomplished:
- explicit subset publication no longer keeps stale retained committed final geometry alive just because the old result came from the same upstream extrude part key
- explicit subset publication no longer keeps stale retained committed draft geometry alive for the same coarse continuation reason
- the next follow-on now shifts cleanly to proof:
  - `6b.3e` owns the authored end-to-end subset collection re-proof across draft and final
  - `6b.4` remains the later Browser/viewport selection and highlight parity pass

Main files changed:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Focused proof that landed:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Verification notes:
- focused selector tests passed for explicit subset publication where retained committed geometry previously stayed visible under `Waiting For Geometry`
- this phase intentionally does not claim the full authored user repro is closed end-to-end, because the remaining work is now to re-prove that the authored subset eventually resolves truthfully in both draft and final
- if later manual proof finds the subset geometry becomes correct but Browser/viewer selection still drifts, that remaining work still belongs in `6b.4`

Acceptance checks:
- when `OutputPreview` publishes an explicit subset of `SolidBody:*` contributors, retained committed geometry does not survive on coarse upstream `partKeys` equality alone
- the viewport no longer shows stale whole-extrude retained geometry behind `Waiting For Geometry` for an explicit subset publication
- if there is no current truthful subset geometry yet, the selector clears retained base geometry instead of pretending the old whole-node result is still the same output

## [x] `OutputPreview-1 Phase 6b.3e` - `Subset Collection Final Re-Proof`

Completed result:
- `6b.3e` confirmed that after `6b.3a-d` cleaned up the visible lies, one more waiting seam still survived in the viewer-target artifact-preview admission rule.
- when `useProjectDraftPreview` was enabled, the selector always preferred shared project draft composition even if that lane currently had zero live viewer parts, which let the authored explicit subset stay empty even when accepted subset bundle artifacts already existed for the viewer target graph.
- the selector now falls back to those viewer-target accepted subset artifacts whenever project draft preview is enabled but currently empty, so authored subset publication can leave the artificial empty/waiting state without reviving coarse parent geometry.

What this phase accomplished:
- explicit `SolidBody:* -> SolidBodies` subset publication no longer stays empty solely because shared project draft composition has not rehydrated the subset objects yet
- viewer-target accepted subset artifacts now remain eligible to render in draft mode when they are the only truthful available geometry for the authored subset
- the next intended follow-on is now back to manual authored proof:
  - if the real graph now resolves and renders the requested subset members, the remaining planned work is `6b.4`
  - if the real graph still stays stuck, the next seam will need a new narrower follow-up before `6b.4`

Main files changed:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Focused proof that landed:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/spaghetti/previewPreparation.test.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.test.ts`
- `src/app/spaghetti/selectors/selectSharedPreviewRenderVm.test.ts`

Verification notes:
- focused tests passed for the case where project draft preview is enabled but has no live viewer parts, and the viewer-target accepted subset artifacts must remain renderable
- this phase intentionally does not claim the real authored user repro is closed until the same two-wire subset graph is re-tested in the app
- if manual proof shows geometry truth is now correct but Browser/viewer selection still drifts, that remaining work still belongs in `6b.4`
- the newer authored repro matrix narrowed the remaining waiting seam further than this phase originally assumed:
  - whole `SolidBodies -> one SolidBodies row` works
  - two separate singular `SolidBody` rows into two separate `OutputPreview` rows works
  - mixed `SolidBody + SolidBodies` contributors in one row enters `Building Final...`
  - only singular-only same-row `SolidBody + SolidBody -> one SolidBodies row` still stalls at `Waiting For Geometry`
- that narrower same-row singular-only aggregation seam now belongs in `6b.3f`, and the follow-on parity/proof matrix for mixed versus singular-only row aggregation now belongs in `6b.3g`

Purpose:
- re-prove the exact authored case that now sits between shipped `6b.3` and the later split-selection work in `6b.4`

Owns:
- the now-isolated end-to-end subset resolution seam for one `SolidBodies` slot assembled from many explicit `SolidBody:*` rows from the same upstream extrude
- proving whether those explicit contributors survive all the way through output-entry shaping, accepted bundle hydration, accepted build outputs, and final/preview geometry availability
- landing the smallest truthful fix so the authored subset resolves out of `Waiting For Geometry` instead of stalling after `6b.3a-d` already made the viewport honest

Does not own:
- more draft-mesh or retained-base hiding work already closed in `6b.3c-d`
- Browser/viewer selection parity that still belongs in `6b.4`
- reopening grouped/full-collection publication behavior that is already working

Current seam read:
- the latest live authored repro now behaves truthfully in one important way:
  - with two explicit `SolidBody` wires into one `OutputPreview` `SolidBodies` slot, the viewport clears instead of showing stale whole-extrude geometry
  - status still remains `Waiting For Geometry`
- that means the visible masking problems are now narrowed enough that the remaining bug is the real one:
  - the explicit subset publication never resolves into accepted geometry
  - the authored subset is getting stuck somewhere between source contributor truth and the accepted result surfaces that `OutputPreview` needs in order to leave the waiting state
- the strongest next owner is therefore the subset build/output-resolution chain, not the viewport composition layer

Locked direction:
- treat this as an end-to-end subset resolution pass, not a viewer presentation pass
- trace the authored subset through the full publication/build chain:
  - `outputEntryId` shaping
  - build input shaping
  - accepted bundle entry hydration
  - accepted build output artifact emission
  - accepted preview/final geometry availability
- prefer the smallest truthful repair that makes the authored explicit subset resolve as a real published subset collection
- do not reintroduce coarse parent fallback just to make the waiting state disappear

Questions this phase must answer:
- do both explicit `SolidBody:*` contributors make it into the active build request as distinct subset members for the same `SolidBodies` slot?
- does the accepted bundle contain the expected output entries for that subset collection, and if so are they carrying the right body-specific artifacts?
- if artifacts exist, which downstream selector/store seam still treats the authored subset as unresolved?
- if artifacts do not exist, where are the explicit contributors collapsing before accepted bundle or output emission?
- does final authoritative geometry need one small subset-collection carry-through field, or is the missing truth already available in current bundle/output-entry contracts?

Likely files:
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- focused tests in:
  - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
  - `src/worker/pipeline/artifactEmitter.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Suggested implementation order:
1. Add one failing regression for the authored case:
   - one `Extrude`
   - many produced `SolidBody` members
   - one `OutputPreview` `SolidBodies` slot
   - two explicit `SolidBody:*` contributors from that same extrude
   - expected: the subset eventually resolves and leaves `Waiting For Geometry`
2. Inspect the emitted output-entry ids and build inputs for that exact case.
3. Confirm whether accepted bundle entries and accepted build outputs are emitted for the subset collection.
4. Patch the first seam where explicit subset contributor truth disappears.
5. Re-run the authored repro in `Draft` and `Final` and verify it now resolves truthfully.

Implementation stop rule:
- this phase is complete once the authored explicit-subset case leaves `Waiting For Geometry` and resolves as the requested subset without reviving whole-parent fallback
- if draft/final geometry is now correct and any remaining symptom is only Browser/viewer selection drift, stop and hand that work to `6b.4`

Acceptance checks:
- one authored `Extrude` that produces `solidBodies (3)` can feed one `OutputPreview` `SolidBodies` slot with exactly two explicit `SolidBody` contributors and render exactly those two bodies
- final authoritative load completes for that subset collection instead of remaining stuck while preview truth drifts
- if all geometry truth is now correct, any remaining symptom is limited to the later split-object Browser/viewer alignment lane

## [x] `OutputPreview-1 Phase 6b.3f` - `Same-Row Singular Aggregation Resolution`

Purpose:
- make one `OutputPreview` `SolidBodies` row resolve when it is assembled from many singular `SolidBody:*` contributors and no native `SolidBodies` contributor is present

Owns:
- the singular-only same-row aggregation seam revealed by the authored repro matrix
- proving why `SolidBody + SolidBody -> one SolidBodies row` still stalls at `Waiting For Geometry` while:
  - whole `SolidBodies -> one row` already works
  - separate singular rows already work
  - mixed `SolidBody + SolidBodies` same-row aggregation at least progresses into `Building Final...`
- landing the smallest truthful repair so a row-owned collection assembled purely from singular members can enter the same accepted build path as the healthier aggregation variants

Does not own:
- Browser/viewer selection parity that still belongs in `6b.4`
- reopening whole-collection publication behavior that already works
- final family closeout or broader proof-matrix work beyond the narrow same-row singular-only aggregation seam

Current seam read:
- the current authored matrix is:
  - `SolidBodies array -> one SolidBodies row` = works and produces separate objects
  - `SolidBody row A -> row 1` and `SolidBody row B -> row 2` = works and produces separate objects
  - `SolidBody + SolidBodies -> one SolidBodies row` = enters `Building Final...`
  - `SolidBody + SolidBody -> one SolidBodies row` = stalls at `Waiting For Geometry`
- that means the remaining bug is not generic `SolidBody` publishing and not generic `SolidBodies` collection publishing
- the strongest current owner is the row-owned collection aggregation path for singular-only contributors inside one shared `SolidBodies` slot

Locked direction:
- treat this as a same-row singular-only aggregation pass, not as a viewer fallback pass
- compare the emitted contracts for three authored shapes:
  - whole-collection contributor
  - mixed `SolidBody + SolidBodies` same-row contributor set
  - singular-only `SolidBody + SolidBody` same-row contributor set
- find the first seam where the singular-only same-row case fails to produce the same kind of row-owned collection build target as the healthier cases
- prefer the smallest truthful carry-through that keeps one row-owned `SolidBodies` collection honest regardless of whether its contributors arrived as singular members or as one native collection

Questions this phase must answer:
- does one same-row singular-only `SolidBodies` slot emit the same target build units as the working mixed or whole-collection variants?
- is singular-only same-row aggregation collapsing too early into many independent contributor entries instead of one row-owned collection target?
- is there a missing row-owned aggregation marker or collection-membership field when no native `SolidBodies` contributor is present?
- why does mixed same-row aggregation reach `Building Final...` while singular-only same-row aggregation remains at `Waiting For Geometry`?

Likely files:
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/pipeline/artifactEmitter.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- focused tests in:
  - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
  - `src/worker/pipeline/artifactEmitter.test.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Suggested implementation order:
1. Add one failing regression for the exact singular-only same-row authored case:
   - one `Extrude`
   - many `SolidBody` members
   - one `OutputPreview` `SolidBodies` row
   - two explicit `SolidBody:*` contributors into that same row
   - expected: the row progresses out of `Waiting For Geometry`
2. Build a matching control regression for the working mixed same-row case:
   - one `SolidBody:*`
   - one `SolidBodies`
   - same `OutputPreview` row
   - expected: enters the accepted build path
3. Diff output-entry ids, build inputs, accepted bundle entries, and accepted build outputs between those two cases.
4. Patch the first seam where singular-only same-row aggregation stops behaving like a row-owned collection.
5. Re-run the authored matrix and verify the singular-only same-row case now resolves.

Implementation stop rule:
- this phase is complete once singular-only same-row `SolidBody + SolidBody -> one SolidBodies row` leaves `Waiting For Geometry` without reviving coarse whole-parent fallback
- if the singular-only same-row case becomes healthy but mixed-versus-singular row behavior still differs in non-obvious ways, stop and hand that parity work to `6b.3g`
- if geometry truth is now healthy and only selection/highlight still drifts, stop and hand that work to `6b.4`

Acceptance checks:
- one `OutputPreview` `SolidBodies` row assembled from two singular `SolidBody:*` contributors resolves out of `Waiting For Geometry`
- that row renders the requested subset members instead of nothing and instead of the whole parent collection
- the working whole-collection and separate-row cases remain healthy

## [x] `OutputPreview-1 Phase 6b.3g` - `Aggregation Matrix And Mixed Contributor Parity`

Purpose:
- normalize and re-prove row-owned `SolidBodies` aggregation across whole-collection, mixed, and singular-only contributor shapes before moving on to split-object selection work

Owns:
- the final aggregation parity matrix for one `OutputPreview` `SolidBodies` row across:
  - one native `SolidBodies` contributor
  - many singular `SolidBody:*` contributors
  - mixed `SolidBody:* + SolidBodies` contributors
- confirming that those row-owned collection shapes now share one consistent accepted-build and published-object outcome
- deciding whether any remaining symptom after aggregation parity is truly in `6b.4`

Does not own:
- reopening per-object selection/highlight behavior that still belongs in `6b.4`
- unrelated project-content or Browser build-policy behavior

Acceptance checks:
- one native `SolidBodies` contributor into one row still works
- many singular `SolidBody:*` contributors into one row now works too
- mixed `SolidBody:* + SolidBodies` contributors into one row no longer has a special status/progression path that differs in confusing ways from the other healthy cases
- if all three row-aggregation shapes are geometry-correct, any remaining issue is limited to later split-object Browser/viewer alignment

## [x] `OutputPreview-1 Phase 6b.4` - `Split Object Selection And Browser Alignment`

Purpose:
- make split published child objects independently selectable and highlightable in the viewport

Owns:
- per-object viewer-key or rendered-part grouping alignment for split `SolidBodies` publication
- Browser-to-viewport highlight parity for published child objects
- viewer pick routing back into workspace selection so one child object no longer resolves as the whole split slot

Does not own:
- unrelated selection behavior for references, sketches, or non-published geometry

Acceptance checks:
- selecting one split published child object no longer selects all siblings
- Browser highlight, viewer highlight, and viewport pick round-trip through the same per-object identity
- object visibility and transform-group reads do not collapse back to the slot-level key for split objects

## [x] `OutputPreview-1 Phase 6b.5` - `Proof Matrix And Family Handoff`

Purpose:
- close the published-object identity repair with one focused proof matrix and a clean family handoff

Owns:
- the final Browser-plus-viewport proof across singular-member rendering, same-row aggregation parity, split-object selection, Browser row identity, viewer picks, and visibility/highlight reads
- confirmation that shipped `Phase 6` still remains correct while `6b` closes the newer viewport-specific follow-on seam
- deciding whether the family can close again or whether one narrower `6c` seam truly remains after the now-shipped `6b.3f`, `6b.3g`, and `6b.4` repairs

Does not own:
- reopening the already-fixed geometry-owner seams from `6b.3`, `6b.3a-e`, or `6b.3f-g` unless the final proof matrix exposes one real regression
- reopening split-object selection work already proven healthy in `6b.4` unless the final Browser-plus-viewport round-trip fails
- introducing new architecture beyond the minimum proof, closeout wording, and any narrowly required follow-on handoff

Current closeout read:
- the latest live checks now say the formerly open `6b` follow-on seams are healthy:
  - situation `3` is fixed
  - situation `4` is fixed
  - selection and highlight are clean
- that means `6b.5` is no longer a bug-hunting phase first; it is now a proof and closeout phase first
- the remaining job is to re-run one compact matrix that proves the family coheres across:
  - one singular `SolidBody` member wire
  - one same-row `SolidBodies` publication built from many singular `SolidBody:*` contributors
  - one mixed same-row `SolidBody:* + SolidBodies` publication
  - one split published `SolidBodies` result with independent Browser and viewport selection/highlight
- only if that final matrix exposes a new mismatch should the family reopen into a narrower follow-up seam

Locked direction:
- treat this as a closeout proof pass, not as an excuse to reopen earlier implementation phases speculatively
- verify the final behavior through the user-visible authored matrix first, then tighten any missing focused tests or closeout wording from that proof
- prefer one clear final answer about family state:
  - `6b` closes cleanly, or
  - one smaller `6c` seam remains with a clearly named owner
- preserve the vision rule that published/project identity and viewer presentation stay downstream from graph-authored truth instead of drifting back into slot-level or viewer-only ownership shortcuts

Questions this phase must answer:
- does the final live matrix still show honest singular-member rendering without whole-parent fallback?
- do same-row singular-only and mixed contributor `SolidBodies` publications now resolve through the same practical status/build path without confusing parity drift?
- do Browser selection, viewer highlight, and viewport picks all resolve through one clear per-published-object identity?
- can the family now describe one stable owner chain from authored graph output entry to published object to viewer/render identity?
- if something still fails, is it truly one new narrow seam that deserves `6c`, or only missing proof/cleanup inside `6b`?

Likely files:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/OutputPreview/Future/OutputPreview 1 - Phase 6b - Single Solid Body Object.md`
- if the final proof exposes a real residue seam, likely implementation touch points are still limited to:
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/outputSurface.ts`
  - `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - focused tests in:
    - `src/app/spaghetti/integration/buildInputsToRequest.test.ts`
    - `src/app/spaghetti/previewPreparation.test.ts`
    - `src/app/spaghetti/outputSurface.test.ts`
    - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

Suggested implementation order:
1. Re-run one compact live authored proof matrix that covers:
   - one singular `SolidBody` member wire
   - one singular-only same-row `SolidBody + SolidBody -> one SolidBodies row`
   - one mixed same-row `SolidBody + SolidBodies -> one SolidBodies row`
   - one split published child-object selection/highlight round-trip
2. Confirm that each case is healthy in the right way:
   - the requested geometry renders
   - status leaves `Waiting For Geometry` when appropriate
   - Browser selection, viewport picks, and highlight stay aligned per child object
3. Add or tighten only the smallest missing proof tests needed to preserve the now-confirmed behavior.
4. If the matrix stays clean, mark `6b.5` complete and record the family handoff/closeout result.
5. If the matrix exposes one new narrow seam, stop and write that seam down explicitly as the next follow-up instead of reopening broad `6b` ownership.

Implementation stop rule:
- this phase is complete once the final proof matrix is recorded cleanly enough to close `6b` without ambiguity
- if the final proof exposes one real remaining mismatch, stop after naming the narrow owner and do not fold that new work into the closeout wording as if the family were fully done

Acceptance checks:
- the proof explicitly covers:
  - one singular `SolidBody` member wire
  - one singular-only same-row `SolidBody + SolidBody -> one SolidBodies row`
  - one mixed same-row `SolidBody + SolidBodies -> one SolidBodies row`
  - one split `SolidBodies` slot with many published child objects
  - Browser-selected object -> viewer highlight
  - viewport-picked object -> Browser/workspace selection
- the family can explain one clear owner for published-object identity instead of mixing `slotId`, `memberIndex`, and `sourceOutputEntryId` ad hoc
- the final closeout can say either:
  - `Phase 6b` is complete and the family can hand off cleanly, or
  - one narrower `6c` seam remains with an explicit owner and stop-rule boundary

Verification notes:
- the focused proof matrix stayed green across:
  - singular-member rendering already covered in `selectViewportResultState`
  - singular-only same-row and mixed same-row aggregation already covered in `buildInputsToRequest`
  - split published child Browser/viewer identity now covered directly in `useAppStore`
  - viewport-picked object -> Browser/workspace selection already covered in `ViewerHost`
- no narrower `6c` seam was exposed by that final matrix, so the `6b` family can close cleanly

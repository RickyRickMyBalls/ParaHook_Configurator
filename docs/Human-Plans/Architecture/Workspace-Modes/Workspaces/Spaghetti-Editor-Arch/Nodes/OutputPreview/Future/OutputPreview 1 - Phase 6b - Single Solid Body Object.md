# `OutputPreview-1 Phase 6b` - `Single Solid Body Object`

## Doc Header

### Doc History
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

## [ ] `OutputPreview-1 Phase 6b.3b` - `Explicit Contributor Fallback Guard`

Purpose:
- prevent unresolved explicit member contributors from falling back to the coarse parent extrude owner and making subset publication appear as the whole collection

Owns:
- tightening the rendering and viewport-result fallback rules for explicit `SolidBody:*` contributors so unresolved rows stay visibly unresolved instead of silently reusing aggregate part identity
- ensuring the preview/final bridge prefers `no renderable for this contributor yet` over `render the whole extrude collection anyway`
- making the debug and runtime surface honest enough that later `6b.4` selection work is not polluted by aggregate fallback masquerading as a selection bug

Does not own:
- fixing why a contributor was unresolved in the first place when that belongs to `6b.3a`
- later Browser-to-viewport selection parity once the geometry source itself is honest

Acceptance checks:
- if one explicit contributor is unresolved, the viewport does not fall back to the whole upstream `solidBodies` collection for that contributor
- subset publication can no longer show phantom sibling bodies that were never requested in the slot
- Browser/debug truth and viewport truth agree on which explicit contributors are currently renderable versus unresolved

## [ ] `OutputPreview-1 Phase 6b.3c` - `Subset Collection Final Re-Proof`

Purpose:
- re-prove the exact authored case that now sits between shipped `6b.3` and the later split-selection work in `6b.4`

Owns:
- focused proof for one `SolidBodies` slot assembled from many explicit `SolidBody:*` rows from the same upstream extrude
- confirming that draft and final both render only the requested subset members after `6b.3a-b`
- deciding whether any remaining issue is truly selection/highlight parity and therefore belongs in `6b.4`

Acceptance checks:
- one authored `Extrude` that produces `solidBodies (3)` can feed one `OutputPreview` `SolidBodies` slot with exactly two explicit `SolidBody` contributors and render exactly those two bodies
- final authoritative load completes for that subset collection instead of remaining stuck while preview truth drifts
- if all geometry truth is now correct, any remaining symptom is limited to the later split-object Browser/viewer alignment lane

## [ ] `OutputPreview-1 Phase 6b.4` - `Split Object Selection And Browser Alignment`

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

## [ ] `OutputPreview-1 Phase 6b.5` - `Proof Matrix And Family Handoff`

Purpose:
- close the published-object identity repair with one focused proof matrix and a clean family handoff

Owns:
- the final proof across singular-member rendering, split-object selection, Browser row identity, viewer picks, and visibility/highlight reads
- confirmation that shipped `Phase 6` still remains correct while `6b` closes the newer viewport-specific follow-on seam
- deciding whether the family can close again or whether one narrower `6c` seam truly remains

Acceptance checks:
- the proof explicitly covers:
  - one singular `SolidBody` member wire
  - one split `SolidBodies` slot with many published child objects
  - Browser-selected object -> viewer highlight
  - viewport-picked object -> Browser/workspace selection
- the family can explain one clear owner for published-object identity instead of mixing `slotId`, `memberIndex`, and `sourceOutputEntryId` ad hoc

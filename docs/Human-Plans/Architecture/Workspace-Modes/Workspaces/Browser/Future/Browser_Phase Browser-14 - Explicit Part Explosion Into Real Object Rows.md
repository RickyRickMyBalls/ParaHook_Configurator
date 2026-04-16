# Browser Phase Browser-14 - Explicit Part Explosion Into Real Object Rows

## Doc Header

### Doc History
6. 2026-04-16 01:03:03: Implemented `Browser-14 / Phase 1 - Stable Part Identity And Explode Contract` by widening the truthful reference-part contract with `sourceMeshIndex`, preserving that field through the viewer-to-store handoff, adding the first read-only `canReferenceItemExplode(...)` eligibility seam, and marking the phase plus its Phase-1 wishlist items shipped with focused viewer and store proof
5. 2026-04-16 00:56:46: Prepped `Browser-14 / Phase 1 - Stable Part Identity And Explode Contract` for implementation by adding a dedicated `Implementation Spec` subsection that grounds the first cut in the live viewer plus store seams, locks the exact first contract widening around stable part identity, and adds phase-specific decisions, risks, checklist items, and verification shape
4. 2026-04-16 00:48:38: Revised `Browser-14` around the stronger real-explode vision so the phase now locks `Explode` as conversion of one eligible imported wrapper object into many independently owned imported-reference-backed objects, adds the missing part-identity plus runtime-loading foundation, and rewrites the internal phase ladder around real delete or hide or move behavior instead of Browser-only row promotion
3. 2026-04-16 00:39:27: Added a `## Wishlist Tracking` section above the Browser-14 internal phases so the explicit part-explode wishlist now maps cleanly onto the new `Phase 1` through `Phase 5` ladder, mirroring the stronger phase-mapping pattern used in workspace docs such as `Catalog-Index.md`
2. 2026-04-16 00:35:02: Broke `Browser-14` into five smaller internal `Phase 1` through `Phase 5` sections so the explicit part-explosion lane can now land one Codex-sized slice at a time across store explode state, Browser tree derivation, Browser command entry, exploded-row parity, and focused cleanup plus regression proof
1. 2026-04-16 00:25:02: Created this standalone future Browser phase so the next parts-focused Browser follow-on has a dedicated planning home, locking that explicit `Explode` on an eligible reference-backed object should promote truthful child parts into sibling real object rows instead of leaving those parts permanently trapped under one imported wrapper row

### Purpose

This phase makes the next Browser parts direction explicit after truthful part-row exposure and row-surface cleanup already landed.

Use it to answer:
- when Browser should let a user explicitly explode one reference-backed object that already contains real child parts
- how exploded parts should become independently owned imported-reference-backed objects instead of staying Browser-local `Part` leaves
- how to stage that work in Codex-sized slices instead of one large Browser-plus-store-plus-viewer rewrite
- what should stay out of scope so this remains a narrow Browser explode phase instead of a full part-target architecture rewrite

## Doc Body

## [ ] Browser-14 - Explicit Part Explosion Into Real Object Rows

### Summary

The Browser already has two important pieces of part groundwork:
- `Browser-9.3`
  - exposed truthful child `Part` rows under imported objects when the loaded source already contains real internal part structure
- `Browser-12`
  - cleaned up the Browser surface so those `Part` rows read more clearly without pretending they were already promoted owners

That leaves one clear next gap:
- an eligible reference-backed `Object` can show truthful child `Part` rows
- but those parts still remain Browser-local leaves trapped under one wrapper object row
- users do not yet have an explicit Browser action that turns those truthful parts into separately organizable real `Object` rows when they want that structure

This phase locks the next step:
- add one explicit Browser `Explode` action for eligible reference-backed object rows
- use the already-truthful child part structure as the source for a real split result
- replace the old wrapper object with sibling independently owned imported-reference-backed `Object` rows under the same parent owner
- split that work into smaller internal phases so the ladder can land one narrow seam at a time

### Implementation-Prep Read

- `referencePartDescriptors.ts`
  - already extracts truthful part rows from loaded reference content
  - today that descriptor is still lightweight and label-first, which is enough for Browser rows but not yet strong enough for a real per-part ownership split
- `Viewer.ts`
  - already captures and exposes those descriptors per loaded reference
  - is the likely runtime seam that must later learn how to load or isolate one source part for one exploded child object
- `useAppStore.ts`
  - already stores `referenceWorkspace.partRowsByReferenceId`
  - already owns imported-reference records, visibility, removal, and transform history for real reference-backed project content
  - does not yet own an explode mutation that converts one wrapper reference into many independently owned per-part reference records
- `selectBrowserTreeRows.ts`
  - already expands eligible reference-backed object rows into child `part` rows when stored part rows exist
  - is currently the strongest proof that Browser already has truthful source-part structure before any explode work starts
- `browserContextMenu.ts`
  - already owns Browser right-click action exposure for imported-reference object rows
  - remains the most natural first Browser-owned `Explode` entry surface once the real split foundation exists
- `useBrowserPanelController.ts`
  - already wires Browser context-menu behavior and imported-reference object actions
  - is the likely first UI-to-store handoff seam for an explode action
- `browserInteractions.ts`
  - already shows the gap between full object targets and current `part` rows
  - is the seam that will prove whether exploded results truly behave like ordinary objects instead of second-class Browser rows

### Owns

- stable per-part source identity strong enough to support a real explode result
- store or runtime conversion of one eligible wrapper reference into many independently owned imported-reference-backed objects
- explicit Browser `Explode` command availability for eligible reference-backed object rows
- promotion of truthful child parts into sibling real `Object` rows under the same parent owner
- replacement rules between the old wrapper object and the exploded object set
- baseline delete, hide, and move viability through ordinary object ownership instead of Browser-only row promotion
- narrow Browser/store/viewer verification that the part source truth and resulting Browser hierarchy stay coherent

### Does Not Own

- synthetic part or object creation for flat imports
- automatic explode on load
- generated-object part promotion
- full part-target transform or selection convergence
- multi-select explode
- Console, keyboard, or viewer-first explode parity
- broader reference catalog or import-workflow redesign

### Locked Direction

- keep explode explicit:
  - part promotion should happen only when the user chooses `Explode`
- keep explode truthful:
  - only explode objects that already expose real child `Part` rows from the loaded source structure
- keep explode real:
  - each exploded result should become its own independently owned imported-reference-backed object instead of a Browser-only promoted row
- replace the wrapper with real project content:
  - the exploded result should be sibling real `Object` rows under the same parent owner, not a nested object-under-object tree or a second fake Browser hierarchy
- keep the first cut Browser-owned:
  - start with Browser entry and Browser hierarchy result before widening into more command surfaces
- stay narrower than full part-target architecture:
  - do not use this phase to solve every later part-selection, transform, or cross-surface parity question

### Current Gap

The Browser part story is currently honest but incomplete:
- if a loaded reference contains real source parts, Browser can already show them
- those parts already carry truthful labels and part-key-backed visibility
- but they still behave only as subordinate leaves under one wrapper imported object

That means users can inspect the source structure, but they cannot yet use that structure as real project object organization when they want to delete, hide, or move those parts independently in Browser.

The next missing behavior is therefore not "show parts."

The next missing behavior is:
- let the user explicitly choose to convert those already-visible parts into real independently owned object structure
- do it without inventing fake explode results for flat imports
- do it without pretending the wrapper-plus-parts view and the exploded-object view should both remain the live truth at the same time
- do it without stopping at a Browser-only visual remap that would still leave delete or hide or move behavior second-class

### Current Live Browser-14 Seams

- `src/viewer/referencePartDescriptors.ts`
  - currently defines the lightweight truthful part descriptor extracted from loaded reference content
- `src/viewer/Viewer.ts`
  - already captures and stores truthful part descriptors per loaded reference
  - is the likely runtime seam for later per-part load or isolation behavior
- `src/app/store/useAppStore.ts`
  - already persists `referenceWorkspace.partRowsByReferenceId`
  - already exposes those part rows back into Browser row derivation
  - already owns the real imported-reference lifecycle that delete or hide or move behavior should continue to use after explode
- `src/app/panels/selectBrowserTreeRows.ts`
  - currently turns those stored rows into visible child `part` rows under a reference-backed object row
  - is therefore the place where the live Browser still chooses `wrapper object -> child parts` instead of `exploded sibling objects`
- `src/app/panels/browserContextMenu.ts`
  - already exposes imported-reference object actions and is the likely first `Explode` command owner
- `src/app/panels/useBrowserPanelController.ts`
  - already connects Browser context-menu intent to Browser/store behavior for imported-reference object actions
- `src/app/panels/browserInteractions.ts`
  - currently treats `part` targets as second-class compared with ordinary object targets
  - is the likely proof seam that exploded results now behave like ordinary objects
- `src/app/panels/BrowserPanel.test.tsx`
  - already contains Browser-level proof around imported-reference object rows and part-row rendering
- `src/app/components/ViewerHost.test.tsx`
  - already proves that loaded references populate truthful part-row descriptors into workspace state
- `src/app/store/useAppStore.test.ts`
  - should become the strongest proof target once the new wrapper-replacement and per-part object-creation mutation exists

## Wishlist Tracking

Use the Browser-14 internal phases to organize the explicit part-explode wishlist like this:

### `Phase 1`
  - [x] `1. Explicit Explode Eligibility`
  - [x] `2. Stable Per-Part Source Identity`
  - foundation target:
    - lock one authoritative explode contract
    - keep explode limited to eligible imported-reference objects with truthful child part rows

### `Phase 2`
  - [ ] `3. Create One Real Object Per Truthful Source Part`
  - [ ] `4. Preserve Truthful Part Order`
  - implementation target:
    - replace the wrapper reference with sibling independently owned objects
    - keep source order as the baseline structural truth

### `Phase 3`
  - [ ] `5. Runtime Single-Part Load`
  - [ ] `6. Preserve Source Provenance`
  - implementation target:
    - make the new exploded object records render truthful isolated content
    - keep one clear link back to the original wrapper source truth

### `Phase 4`
  - [ ] `7. Browser Context Menu Explode Entry`
  - [ ] `8. No Explode For Flat Imports`
  - implementation target:
    - expose one explicit Browser-owned `Explode` action
    - keep entry narrow and visible only for eligible rows

### `Phase 5`
  - [ ] `9. Exploded Rows Behave Like Normal Object Rows`
  - [ ] `10. Keep Browser-Local Parity Before Wider Surface Parity`
  - implementation target:
    - make exploded rows usable through the normal first-pass Browser object-row seams
    - defer Console, keyboard, and deeper transform convergence

### `Phase 6`
  - [ ] `11. Deterministic Exploded Naming`
  - [ ] `12. Focused Regression Proof`
  - implementation target:
    - tighten naming and cleanup around the new explode path
    - leave one stable regression set covering the full Browser-14 ladder

## [x] Browser-14 - Phase 1 - Stable Part Identity And Explode Contract

- first Browser-14 foundation slice
- locked direction:
  - define one store-owned single-object explode contract for eligible imported-reference object rows
  - eligibility must stay narrow:
    imported-reference object plus truthful child part rows already present from the loaded source
  - strengthen the existing truthful part descriptor so explode has stable source identity, not just a row label
  - keep the phase Browser-feature-owned but UI-light:
    no visible Browser command entry yet
- why this phase exists:
  - the current Browser already knows which reference-backed objects have truthful child part rows
  - the current part rows are honest enough to show in Browser, but not yet strong enough to produce independently owned child objects that can reload their own source part truth
  - the missing foundation is one authoritative explode contract that can verify eligibility and carry stable per-part source identity forward
- likely file targets:
  - `src/viewer/referencePartDescriptors.ts`
  - `src/viewer/Viewer.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/store/useAppStore.test.ts`
- done shape:
  - the explode contract can validate one eligible imported-reference object against already-loaded truthful child parts
  - each truthful part now carries stable source identity strong enough to support later independent object creation
  - the explode contract reuses the existing truthful part descriptors as the source order and baseline label truth
  - ineligible objects cannot enter the explode state

- shipped result:
  - `ReferencePartDescriptor` and stored `ReferenceWorkspacePartVm` rows now both preserve `sourceMeshIndex`
  - the viewer-to-store `setReferenceItemPartRows(...)` handoff keeps the widened part payload intact instead of collapsing it to label-only row data
  - `canReferenceItemExplode(...)` now gives later phases one read-only eligibility seam grounded in imported-reference presence, loaded state, and valid stored source locators
  - focused viewer extraction plus store-runtime proof now cover the widened contract end to end

### Implementation Spec

#### Code-Backed Read

The current Phase 1 seam is already narrow, but it is still too lightweight for a real explode contract:

- `src/viewer/referencePartDescriptors.ts`
  - `ReferencePartDescriptor` now exposes:
    - `partKey`
    - `label`
    - `sourceMeshIndex`
  - `extractReferencePartDescriptors(...)` now derives both `partKey` and `sourceMeshIndex` from the same leaf-mesh traversal order
- `src/viewer/Viewer.ts`
  - stores per-reference descriptors in `referencePartDescriptorsByReferenceId`
  - exposes them through `getReferencePartDescriptors(referenceId)`
  - already makes the viewer the natural owner of source-part extraction truth
- `src/app/components/ViewerHost.tsx`
  - already forwards the viewer descriptors directly into store state through `setReferenceItemPartRows(referenceId, viewer.getReferencePartDescriptors(referenceId))`
  - does not currently transform or enrich that payload on the way into the store
- `src/app/store/useAppStore.ts`
  - `ReferenceWorkspacePartVm` now exposes:
    - `rowId`
    - `partKey`
    - `label`
    - `sourceMeshIndex`
  - `setReferenceItemPartRows(...)` now preserves the widened payload instead of stripping it down to Browser row data only
  - `canReferenceItemExplode(...)` now provides one narrow read-only eligibility seam for later Browser and store phases

Main implication:
- `Phase 1` stayed out of exploded object creation
- it left later phases one canonical viewer-to-store payload plus one canonical eligibility seam instead of a second detector or identity scheme

#### First Pass Decisions

- keep `partKey` as the Browser-facing row identity in this phase so existing part-row rendering does not need to be rewritten yet
- add one explicit source-locator field to the part contract in this phase:
  - use the leaf-mesh traversal index as the first concrete source locator because that truth already exists where descriptors are extracted
- keep the first locator contract narrow and deterministic:
  - one descriptor per leaf mesh
  - one stable `sourceMeshIndex` integer per descriptor
- widen both the viewer descriptor and the stored part-row VM in the same phase so later store-owned explode eligibility can read one canonical shape
- stop before:
  - exploded object creation
  - Browser context-menu entry
  - runtime isolated part loading

#### Exact First Code Cut

The implementation-ready first cut is:

1. Extend `ReferencePartDescriptor` in `src/viewer/referencePartDescriptors.ts` with:
   - `sourceMeshIndex: number`
2. Update `extractReferencePartDescriptors(...)` so every emitted descriptor includes:
   - the existing `partKey`
   - the existing `label`
   - the explicit `sourceMeshIndex` matching the leaf-mesh traversal order already used during extraction
3. Extend the store-side `ReferenceWorkspacePartVm` type in `src/app/store/useAppStore.ts` with:
   - `sourceMeshIndex: number`
4. Update `setReferenceItemPartRows(...)` so it preserves `sourceMeshIndex` instead of collapsing the viewer payload down to row-only label data
5. Add one small eligibility helper or equivalent narrow store seam that answers:
   - does this imported reference currently have truthful part rows with valid `sourceMeshIndex` values?
6. Keep the helper read-only in this phase:
   - do not add explode mutation state
   - do not add exploded object records
7. Update focused tests so the widened descriptor shape is proven end-to-end from viewer extraction through stored part rows

#### Likely Files

- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`

#### Implementation Risks

The most likely risks in this phase are:

- widening the descriptor only in the viewer and forgetting to preserve the new field when it is written into store state
- choosing a source-identity shape that secretly requires later Browser or runtime work in the same phase
- treating `partKey` as enough long-term source truth and skipping the explicit locator field entirely
- widening this phase into exploded-object creation instead of stopping at the contract seam

Healthy constraint:
- if a stronger future locator than `sourceMeshIndex` is later needed, add it in a later phase without undoing the Phase 1 rule that one canonical explicit source-locator field must already exist

#### Checklist

- [x] Add `sourceMeshIndex` to `ReferencePartDescriptor`
- [x] Emit `sourceMeshIndex` from `extractReferencePartDescriptors(...)`
- [x] Add `sourceMeshIndex` to `ReferenceWorkspacePartVm`
- [x] Preserve `sourceMeshIndex` inside `setReferenceItemPartRows(...)`
- [x] Add one narrow read-only explode-eligibility helper based on truthful stored part rows
- [x] Keep explode mutation, Browser command entry, and runtime isolated-part loading deferred to later phases

#### Verification Shape

Minimum verification for this phase should cover:

- viewer-side part extraction emits `sourceMeshIndex` for every truthful part descriptor
- `ViewerHost` still forwards part descriptors into store state without dropping the widened contract
- `setReferenceItemPartRows(...)` preserves `sourceMeshIndex` in stored part rows
- the store-side eligibility seam returns `true` only when a reference-backed object has truthful child part rows with valid source locators
- existing Browser part-row rendering continues to work with the widened stored shape

#### Done Shape

`Phase 1` is done when:

- the viewer and store share one canonical widened part descriptor shape
- truthful stored part rows carry explicit source-locator data instead of only Browser row labels
- later phases can decide explode eligibility from one canonical store seam
- later phases can create real per-part objects without inventing a second source-identity system

## [ ] Browser-14 - Phase 2 - Explode Mutation Creates Real Per-Part Object Records

- second Browser-14 slice after the store contract exists
- locked direction:
  - when one eligible imported wrapper object is exploded, the store should create one independently owned imported-reference-backed object record per truthful source part under the same parent owner
  - do not stop at a Browser-only tree remap
  - do not keep both the live wrapper record and the exploded object set at once
- why this phase exists:
  - the core structural value of `Explode` is not the button itself
  - the real value is durable object ownership that reuses the app's normal delete or hide or move seams
- likely file targets:
  - `src/app/store/useAppStore.ts`
  - `src/app/store/useAppStore.test.ts`
- done shape:
  - exploding one eligible wrapper creates one real imported-reference-backed object record per truthful source part
  - the new per-part object records preserve truthful source order and baseline labels
  - the original wrapper record no longer remains as a second live owner after explode succeeds

## [ ] Browser-14 - Phase 3 - Runtime Single-Part Load And Provenance

- third Browser-14 slice after the store can create the new object records
- locked direction:
  - each exploded child object must render truthful isolated part content from the original source instead of sharing one visual wrapper with Browser-only filtering
  - keep one explicit provenance link back to the original imported source and part identity
  - stay narrow:
    no synthetic reconstruction for flat imports and no broader generated-object part architecture in the same cut
- why this phase exists:
  - real per-part object records are only useful if the runtime can actually load or isolate the correct source part for each child
  - provenance matters because the exploded children should stay explainable and debuggable as truthful descendants of one earlier wrapper import
- likely file targets:
  - `src/viewer/Viewer.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/components/ViewerHost.tsx`
  - `src/app/components/ViewerHost.test.tsx`
- done shape:
  - each exploded child object can render truthful isolated part content
  - the new object records retain clear source provenance back to the original import plus part identity
  - flat imports still do not produce exploded child objects

## [ ] Browser-14 - Phase 4 - Browser Explode Entry And Wrapper Replacement

- fourth Browser-14 slice and the first explicit user entry point
- locked direction:
  - expose `Explode` through the Browser context menu for eligible imported-reference object rows
  - after explode succeeds, Browser tree derivation should replace the wrapper-plus-parts view with sibling real `Object` rows under the same parent owner
  - keep the command single-object and Browser-only in this first cut
- why this phase exists:
  - once the real split foundation exists, Browser needs one explicit user-owned command to trigger it
  - Browser must also stop showing both the old wrapper branch and the new exploded object set at the same time
- likely file targets:
  - `src/app/panels/browserContextMenu.ts`
  - `src/app/panels/useBrowserPanelController.ts`
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/browserContextMenu.test.ts`
- done shape:
  - eligible imported-reference object rows show `Explode`
  - ineligible or already-flat imports do not show `Explode`
  - choosing `Explode` routes through the real per-part object-creation seam and the Browser tree updates into the exploded object set without leaving the old wrapper branch visible

## [ ] Browser-14 - Phase 5 - Independent Object Behavior Parity

- fifth Browser-14 slice after exploded rows exist visibly in Browser
- locked direction:
  - exploded object rows should behave like ordinary Browser object rows for the supported first-pass behaviors they already participate in:
    selection, hide/show, delete, move, reveal/frame behavior, and ordinary row presentation
  - keep this narrower than full part-target transform or deeper cross-surface ownership convergence
- why this phase exists:
  - once exploded rows appear, they cannot feel like second-class placeholders
  - the main user promise of Browser-14 is that the exploded results are real independent objects, not just rows that look separate
- likely file targets:
  - `src/app/panels/browserInteractions.ts`
  - `src/app/store/useAppStore.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/store/useAppStore.test.ts`
- done shape:
  - exploded rows select, hide/show, delete, move, and reveal/frame through the ordinary supported object-row seams
  - Browser does not regress non-exploded imported objects while parity is added
  - deeper transform-target convergence remains deferred

## [ ] Browser-14 - Phase 6 - Naming Cleanup And Focused Regression Proof

- sixth Browser-14 cleanup and stabilization slice
- locked direction:
  - tighten deterministic naming, remove stale wrapper-only assumptions left behind by the new explode path, and leave one focused regression set around the full Browser-14 ladder
  - keep this phase as cleanup and proof, not another feature widening pass
- why this phase exists:
  - the first five phases add a new real ownership conversion path, and the last pass should leave it easier to trust and maintain
  - deterministic labels and focused proof matter here because the feature rewrites Browser hierarchy for one object family and one reference-loading path
- likely file targets:
  - `src/app/store/useAppStore.ts`
  - `src/app/panels/selectBrowserTreeRows.ts`
  - `src/app/panels/browserContextMenu.test.ts`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/store/useAppStore.test.ts`
- done shape:
  - exploded object labels stay deterministic and source-ordered
  - obsolete wrapper-only or part-only branches created by the old non-exploded assumption are cleaned up where safe
  - focused regression proof covers eligibility, explode conversion, per-part object creation, runtime single-part load, wrapper replacement, and ordinary exploded-row behavior

### Questions / Decisions

#### [ ] q1 - Should part promotion happen only through an explicit `Explode` command instead of automatically when parts are detected?

Question:
- when a reference-backed object already contains real child parts, should Browser keep the current wrapper object plus part-row presentation until the user explicitly chooses `Explode`?

Suggestion:
- yes
- keep the structural promotion user-driven and avoid surprising automatic hierarchy rewrites on load

#### [ ] q2 - Should `Explode` only appear for objects that already expose real child part rows from the loaded source?

Question:
- should Browser limit `Explode` to reference-backed object rows whose loaded source already exposes truthful child `Part` rows, instead of inventing synthetic explode results for flat or opaque imports?

Suggestion:
- yes
- keep explode grounded in truthful source structure only

#### [ ] q3 - Should exploding replace the wrapper object with sibling real object rows under the same parent owner?

Question:
- when the user explodes one eligible reference-backed object, should the system replace that wrapper row with sibling real imported-reference-backed `Object` rows under the same parent owner instead of keeping a nested object-under-object structure or a Browser-only fake row promotion?

Suggestion:
- yes
- the result should read like real project content with real ownership, not a second wrapper hierarchy or a simulated Browser split

#### [ ] q4 - Should the first cut stay single-object and Browser-owned instead of widening immediately into multi-select or cross-surface parity?

Question:
- should `Browser-14` land first as one Browser-owned single-object explode action layered on top of real per-part object ownership, leaving multi-select explode plus Console or keyboard parity to later follow-ons if we still want them?

Suggestion:
- yes
- keep the first delivery narrow and prove the real ownership conversion cleanly first

#### [ ] q5 - Should the exploded rows use the truthful source part labels as their baseline object labels?

Question:
- when Browser promotes the child parts into real object rows, should the first cut use the existing truthful part labels as the default object-row labels instead of inventing a second naming scheme?

Suggestion:
- yes
- reusing the current truthful source labels keeps the first explode result deterministic and legible

### Concrete Implementation Targets

Primary expected targets across the Browser-14 ladder:
- `src/viewer/referencePartDescriptors.ts`
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/browserContextMenu.ts`
- `src/app/panels/useBrowserPanelController.ts`

Supporting targets if needed:
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserContextMenu.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Tests

- eligible imported object rows that already expose truthful child part rows surface an explicit Browser `Explode` action
- flat or otherwise non-parted imports do not expose `Explode`
- exploding one eligible object creates one independently owned imported-reference-backed object per truthful source part
- the exploded object rows preserve source order and use the truthful part labels as the baseline row labels
- each exploded child object renders the correct isolated source part content instead of one shared wrapper view
- the old wrapper object's child `Part` branch no longer renders after explode succeeds
- Browser selection, visibility, delete, and move behavior do not regress for non-exploded rows
- exploded rows can use ordinary supported object-row delete, hide/show, reveal/frame, and move seams
- truthful part-row capture from the viewer remains the source for explode eligibility instead of a duplicated second structure detector

### Assumptions

- truthful source-part rows are already strong enough to act as the input contract once stable per-part source identity is added
- explicit `Explode` is safer than automatic hierarchy rewrite because it keeps the current wrapper view stable until the user asks for the promoted structure
- the best first version of this feature solves the real Browser-owned ownership conversion cleanly before widening into every later part-target follow-on

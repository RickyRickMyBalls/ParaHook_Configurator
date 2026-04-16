# Browser Phase Browser-14 - Explicit Part Explosion Into Real Object Rows

## Doc Header

### Doc History
23. 2026-04-16 07:34:41: Split the planned `Browser-14 / Phase 9 - High-Part Explode Performance Optimization` follow-on into its own standalone future planning doc so the large-explode optimization lane now has a dedicated implementation-prep home while this Browser-14 umbrella keeps the shorter family-level summary and link
22. 2026-04-16 07:32:12: Added a new planned `Browser-14 / Phase 9 - High-Part Explode Performance Optimization` follow-on so the now-shipped live explode handoff can grow one narrow optimization pass for large part-count objects, documenting that very wide explodes should preserve the real ownership model while reducing the up-front fan-out cost and perceived pause for cases such as `50+` parts
21. 2026-04-16 03:25:41: Implemented `Browser-14 / Phase 8 - Preserve Loaded Runtime After Explode` by adding one viewer-owned live explode handoff seam, teaching `ViewerHost` to convert a just-removed loaded wrapper into already-loaded exploded children before the wrapper is removed from the viewer, preserving the truthful isolated child-load path as the fallback, and marking the Phase-8 wishlist items shipped with focused viewer plus host proof
20. 2026-04-16 03:17:21: Prepped `Browser-14 / Phase 8 - Preserve Loaded Runtime After Explode` for implementation by tightening the new continuity follow-on around the exact live explode and reference-load seams, grounding the work in `explodeImportedReference(...)`, `referenceItemVisibilityById`, `referenceItemLoadStateById`, `Viewer.ensureReferenceLoaded(...)`, and the `ViewerHost` reference-load handoff so the next pass can target immediate loaded-state preservation without widening into a broad cache redesign
19. 2026-04-16 03:14:37: Added a new planned `Browser-14 / Phase 8 - Preserve Loaded Runtime After Explode` follow-on so the shipped explode flow can address the current UX gap where exploded children start hidden and unloaded and later pay a fresh isolated reload cost, documenting a narrow next step around immediate visible handoff from the already-loaded wrapper runtime instead of broad new import or caching architecture
18. 2026-04-16 03:04:22: Implemented `Browser-14 / Phase 7 - Console Explode Entry` by projecting `canExplode` through the shared Console selected-target seam, exposing `Explode` in the selected imported-reference object session only when the shipped store eligibility helper says it qualifies, routing the Console action through `explodeImportedReference(...)`, and marking the final Browser-14 Console wishlist items shipped with focused store plus staged-navigation plus Console proof
17. 2026-04-16 02:49:57: Prepped `Browser-14 / Phase 7 - Console Explode Entry` for implementation by adding a dedicated `Implementation Spec` subsection that grounds the follow-on in the live Console selection-context seam plus the shipped explode eligibility and mutation helpers, locking one narrow selected-object `Explode` action for Console without widening into multi-select or broader command-language parsing
16. 2026-04-16 02:43:48: Extended the Browser-14 ladder with a new planned `Phase 7 - Console Explode Entry` so the now-shipped Browser explode feature can grow one narrow Console follow-on, documenting that Console should expose the same single-object `Explode` action for an eligible selected imported reference object with truthful parts while still deferring broader command-language and multi-select widening
15. 2026-04-16 02:37:31: Implemented `Browser-14 / Phase 6 - Naming Cleanup And Focused Regression Proof` by proving that duplicate and fallback truthful part labels already stay deterministic through the explode path, expanding the focused Browser-14 regression set across viewer, store, Browser menu, and Browser interaction seams, and marking the final Browser-14 wishlist items shipped without widening the feature
14. 2026-04-16 02:34:51: Prepped `Browser-14 / Phase 6 - Naming Cleanup And Focused Regression Proof` for implementation by adding a dedicated `Implementation Spec` subsection that grounds the final pass in the live explode mutation, Browser row derivation, and focused regression seams, locking deterministic exploded-child naming plus final proof consolidation without widening Browser-14 into new command surfaces
13. 2026-04-16 02:31:24: Implemented `Browser-14 / Phase 5 - Independent Object Behavior Parity` by proving through focused Browser-level regression coverage that exploded imported children already inherit the ordinary object-row selection, frame, hide, remove, and drag behavior seams without needing a second exploded-row runtime path, and marking the Phase-5 wishlist items shipped
12. 2026-04-16 02:25:58: Prepped `Browser-14 / Phase 5 - Independent Object Behavior Parity` for implementation by adding a dedicated `Implementation Spec` subsection that grounds the parity pass in the live Browser object-row selection, visibility, move, and frame seams, locks the first cleanup around exploded imported children behaving like ordinary object rows, and records the key decisions, risks, checklist items, and verification shape before code changes
11. 2026-04-16 02:20:22: Implemented `Browser-14 / Phase 4 - Browser Explode Entry And Wrapper Replacement` by exposing `Explode` on the imported parent object right-click menu only when the real store eligibility seam says the row is explodable, routing that Browser action through the shipped `explodeImportedReference(...)` mutation, and marking the Phase-4 wishlist items shipped with focused context-menu plus Browser-panel proof
10. 2026-04-16 02:11:12: Implemented `Browser-14 / Phase 3 - Runtime Single-Part Load And Provenance` by widening the viewer load contract with exploded-child provenance, teaching `Viewer.ensureReferenceLoaded(...)` to isolate one truthful source mesh for exploded imported children, suppressing nested part-row republishing for those terminal child objects, and marking the Phase-3 wishlist items shipped with focused viewer plus host proof
9. 2026-04-16 01:50:53: Prepped `Browser-14 / Phase 3 - Runtime Single-Part Load And Provenance` for implementation by adding a dedicated `Implementation Spec` subsection that grounds the work in the live `Viewer.ensureReferenceLoaded(...)` plus `ViewerHost` reference-load handoff, locks the first isolated-part runtime branch around exploded imported-reference provenance, and records the key decisions, risks, checklist items, and verification shape needed before code changes
8. 2026-04-16 01:36:51: Implemented `Browser-14 / Phase 2 - Explode Mutation Creates Real Per-Part Object Records` by adding per-part provenance fields to imported references, shipping the store-owned `explodeImportedReference(...)` wrapper-replacement mutation, hardening imported asset-path revoke behavior for shared exploded children, and marking the Phase-2 wishlist items shipped with focused store proof
7. 2026-04-16 01:26:34: Prepped `Browser-14 / Phase 2 - Explode Mutation Creates Real Per-Part Object Records` for implementation by adding a dedicated `Implementation Spec` subsection that grounds the mutation in the live imported-reference add or remove or ordering seams, locks one explicit `explodeImportedReference(...)` store action plus per-part provenance fields, and adds phase-specific decisions, risks, checklist items, and verification shape
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

## [x] Browser-14 - Explicit Part Explosion Into Real Object Rows

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
  - [x] `3. Create One Real Object Per Truthful Source Part`
  - [x] `4. Preserve Truthful Part Order`
  - implementation target:
    - replace the wrapper reference with sibling independently owned objects
    - keep source order as the baseline structural truth

### `Phase 3`
  - [x] `5. Runtime Single-Part Load`
  - [x] `6. Preserve Source Provenance`
  - implementation target:
    - make the new exploded object records render truthful isolated content
    - keep one clear link back to the original wrapper source truth

### `Phase 4`
  - [x] `7. Browser Context Menu Explode Entry`
  - [x] `8. No Explode For Flat Imports`
  - implementation target:
    - expose one explicit Browser-owned `Explode` action
    - keep entry narrow and visible only for eligible rows

### `Phase 5`
  - [x] `9. Exploded Rows Behave Like Normal Object Rows`
  - [x] `10. Keep Browser-Local Parity Before Wider Surface Parity`
  - implementation target:
    - make exploded rows usable through the normal first-pass Browser object-row seams
    - defer Console, keyboard, and deeper transform convergence

### `Phase 6`
  - [x] `11. Deterministic Exploded Naming`
  - [x] `12. Focused Regression Proof`
  - implementation target:
    - tighten naming and cleanup around the new explode path
    - leave one stable regression set covering the full Browser-14 ladder

### `Phase 7`
  - [x] `13. Console Explode Entry`
  - [x] `14. Selection-Driven Console Eligibility`
  - implementation target:
    - expose one narrow Console-owned `Explode` action for the currently selected eligible imported reference object
    - reuse the shipped Browser-14 eligibility and explode seams instead of creating a second explode path

### `Phase 8`
  - [x] `15. Preserve Loaded Runtime After Explode`
  - [x] `16. Avoid Immediate Full Reload Friction`
  - implementation target:
    - keep the exploded result visibly alive right after `Explode` instead of replacing one loaded wrapper with many hidden unloaded children
    - reuse the already-loaded wrapper runtime as the first handoff source where possible so exploded children do not immediately feel like cold unloaded references

### `Phase 9`
  - [ ] `17. Reduce High-Part Explode Fan-Out Cost`
  - [ ] `18. Keep Large Explodes Responsive`
  - implementation target:
    - optimize the live explode path for high part-count wrappers so wide explodes do not pause excessively while still producing real independent child objects
    - keep the first optimization pass narrow around large explode responsiveness instead of redesigning the broader reference runtime or ownership model

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

## [x] Browser-14 - Phase 2 - Explode Mutation Creates Real Per-Part Object Records

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

- shipped result:
  - `ImportedReferenceRecord` now carries per-part provenance through `explodedFromReferenceId`, `sourcePartKey`, and `sourceMeshIndex`
  - `explodeImportedReference(...)` now converts one eligible wrapper reference into many child imported-reference-backed records in truthful part order under the same parent owner
  - the wrapper row is removed from `importedReferenceOrder`, parent `contentOrderByParentKey`, runtime state, and stored part rows in the same mutation
  - imported asset-path revoke behavior now stays safe for exploded imported children by waiting until the last sibling using the shared `assetPath` is removed

### Implementation Spec

#### Code-Backed Read

The current Phase 2 seam already has most of the lifecycle pieces this mutation wants to reuse:

- `src/app/store/useAppStore.ts`
  - `ImportedReferenceRecord` already owns:
    - `referenceId`
    - `sourceKind`
    - `categoryId`
    - `label`
    - `fileType`
    - `assetPath`
    - `parentAssemblyId`
    - `parentComponentId`
  - that means imported references already have one real store-owned identity and placement contract
- `addImportedReference(...)`
  - already creates one imported-reference record
  - already appends that record to `importedReferenceOrder`
  - already seeds `partRowsByReferenceId[referenceId]`
  - already writes one row id into `contentOrderByParentKey` when the item belongs under an authored assembly or component
- `removeImportedReference(...)`
  - already removes one imported imported-reference record and cleans associated runtime state
  - already clears visibility, load state, errors, transform state, history, selection, and stored part rows
  - already strips the removed row id out of `contentOrderByParentKey`
- `buildImportedReferenceRowId(referenceId)`
  - already gives imported references the same durable Browser object-row id shape that later Browser phases should continue to use
- `canReferenceItemExplode(...)`
  - already gives this phase a narrow eligibility seam for loaded imported references with truthful stored part rows and valid source locators

Main implication:
- `Phase 2` should not invent a second object family
- it should reuse the existing imported-reference record family and ordering contracts by converting one eligible wrapper reference into many imported-reference records in one store mutation

#### First Pass Decisions

- implement one explicit store action:
  - `explodeImportedReference(referenceId: string): boolean`
- keep the exploded children in the imported-reference family:
  - do not create a new `explodedObject` record type
- extend `ImportedReferenceRecord` with the minimum provenance fields needed for later phases:
  - `explodedFromReferenceId: string | null`
  - `sourcePartKey: string | null`
  - `sourceMeshIndex: number | null`
- reuse the wrapper record's existing ownership and source metadata for each child:
  - same `sourceKind`
  - same `categoryId`
  - same `fileType`
  - same `assetPath`
  - same `parentAssemblyId`
  - same `parentComponentId`
- use truthful stored part rows as the only child source:
  - preserve source order exactly as stored in `partRowsByReferenceId[referenceId]`
  - use each part `label` as the default child record `label`
- keep this phase store-only:
  - do not make the viewer load isolated child parts yet
  - do not expose Browser `Explode` UI yet
  - do not change Browser tree derivation yet
- remove the wrapper record in the same mutation once all children are created:
  - do not leave wrapper plus children alive together in store state

#### Exact First Code Cut

The implementation-ready first cut is:

1. Extend `ImportedReferenceRecord` in `src/app/store/useAppStore.ts` with:
   - `explodedFromReferenceId: string | null`
   - `sourcePartKey: string | null`
   - `sourceMeshIndex: number | null`
2. Update the initial imported-reference creation path so ordinary non-exploded references default those fields to `null`.
3. Add one new store action signature:
   - `explodeImportedReference: (referenceId: string) => boolean`
4. Implement `explodeImportedReference(...)` so it:
   - exits early when `canReferenceItemExplode(...)` is `false`
   - reads the wrapper record from `importedReferencesById`
   - reads truthful stored part rows from `partRowsByReferenceId[referenceId]`
   - creates one new imported-reference record per part row
   - copies the wrapper record source metadata and parent ownership onto every child
   - writes `explodedFromReferenceId`, `sourcePartKey`, and `sourceMeshIndex` onto each child record
   - preserves source order in both `importedReferenceOrder` and any parent `contentOrderByParentKey` row list
   - removes the wrapper record and wrapper row id from store state after the child set is inserted
5. Keep wrapper asset lifetime honest in this phase:
   - do not revoke the shared imported asset URL when exploding, because the new child records still point at the same `assetPath`
6. Remove or clear wrapper-only runtime state during the mutation:
   - visibility
   - load state
   - errors
   - transform override and history
   - stored part rows
   - active selection when it directly targets the removed wrapper
7. Add focused store tests that prove:
   - ineligible references do not explode
   - eligible references create one child record per truthful part
   - wrapper placement is replaced by child placement in the same order
   - wrapper runtime state is removed without revoking the shared child source path

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

#### Implementation Risks

The most likely risks in this phase are:

- accidentally revoking an imported wrapper `assetPath` while the new child records still need to reuse it
- preserving child records in `importedReferencesById` but forgetting to replace the wrapper row in `importedReferenceOrder`
- updating `importedReferenceOrder` but forgetting the parallel `contentOrderByParentKey` owner order for authored parents
- leaving wrapper runtime state, selection, or stored part rows alive after the wrapper record is gone
- widening this phase into Browser tree derivation or viewer isolated-part loading before the mutation is stable

Healthy constraint:
- if later phases need richer provenance or a stronger source locator, add it on top of this mutation without changing the Phase 2 rule that the first explode result must already be real imported-reference-backed child records

#### Checklist

- [x] Add per-part provenance fields to `ImportedReferenceRecord`
- [x] Default non-exploded imported references to `null` provenance fields
- [x] Add `explodeImportedReference(referenceId)` as a store action
- [x] Create one imported-reference child record per truthful stored part row
- [x] Preserve wrapper parent ownership and truthful part order in child placement
- [x] Replace the wrapper record instead of keeping wrapper plus children alive together
- [x] Keep shared imported asset-path lifetime valid for the new child records
- [x] Keep Browser UI entry, Browser tree replacement, and runtime isolated-part loading deferred to later phases

#### Verification Shape

Minimum verification for this phase should cover:

- `explodeImportedReference(referenceId)` returns `false` and leaves store state unchanged when `canReferenceItemExplode(...)` is `false`
- exploding one eligible imported wrapper creates one child imported-reference record per truthful stored part row
- each child record preserves:
  - the wrapper parent owner
  - the wrapper source metadata
  - the truthful part `label`
  - the truthful `sourcePartKey`
  - the truthful `sourceMeshIndex`
- `importedReferenceOrder` replaces the wrapper position with the new child reference ids in truthful source order
- `contentOrderByParentKey` replaces the wrapper row id with the new child row ids in truthful source order when the wrapper had an authored parent
- wrapper runtime state and wrapper stored part rows are removed after explode succeeds
- the wrapper imported asset URL is not revoked during explode when the new child records still reuse the same `assetPath`

#### Done Shape

`Phase 2` is done when:

- one eligible wrapper imported reference can be converted into many imported-reference-backed child records through one store mutation
- the new child records preserve truthful part order, labels, ownership, and per-part provenance
- the wrapper record and its runtime residue are removed in the same mutation
- later Browser and viewer phases can build on real child object records instead of a Browser-only simulated split

## [x] Browser-14 - Phase 3 - Runtime Single-Part Load And Provenance

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

- shipped result:
  - `ReferenceLoadableItem` and projected Browser reference items now carry `explodedFromReferenceId`, `sourcePartKey`, and `sourceMeshIndex` so exploded imported children reach the viewer through one explicit provenance contract
  - `Viewer.ensureReferenceLoaded(...)` now branches for exploded imported children, loading the shared source asset once per child and isolating the truthful target mesh by `sourceMeshIndex` instead of rendering the full wrapper object again
  - `ViewerHost` now keeps exploded imported children terminal by writing `[]` back into `partRowsByReferenceId` after load instead of republishing a second nested child-part layer under the exploded object
  - focused viewer plus host proof now covers the isolated runtime branch, the honest failure path for invalid `sourceMeshIndex`, and the provenance handoff from store-backed child records into the viewer load seam

### Implementation Spec

#### Code-Backed Read

The current Phase 3 seam is now clear because `Phase 2` already creates real child records, but the runtime still treats every reference as a full-wrapper load:

- `src/app/store/useAppStore.ts`
  - `explodeImportedReference(...)` now creates imported-reference children with:
    - `explodedFromReferenceId`
    - `sourcePartKey`
    - `sourceMeshIndex`
  - those children start as ordinary reference records with:
    - shared `assetPath`
    - shared `fileType`
    - `loadState: 'unloaded'`
    - empty `partRowsByReferenceId[childReferenceId]`
- `src/viewer/Viewer.ts`
  - `ensureReferenceLoaded(reference)` currently always calls `loadReferenceObject(reference)`
  - after load, it always stores:
    - the whole reference object in `referenceObjects`
    - all extracted descriptors in `referencePartDescriptorsByReferenceId`
  - there is no current branch for:
    - exploded imported children
    - isolated per-part runtime loading
- `src/app/components/ViewerHost.tsx`
  - currently treats every loaded reference the same way:
    - `await viewer.ensureReferenceLoaded(item)`
    - `setReferenceItemPartRows(item.referenceId, viewer.getReferencePartDescriptors(item.referenceId))`
  - that means exploded children would currently republish a second Browser-facing part-row layer unless this phase adds a narrow distinction
- `src/app/references/referenceManifest.ts`
  - `ReferenceLoadableItem` currently carries only:
    - `referenceId`
    - `assetPath`
    - `fileType`
    - `displayTransform`
    - `transformOverride`
  - it does not yet carry exploded-child provenance into the viewer load path

Main implication:
- `Phase 2` gave the store truthful child ownership
- `Phase 3` must now teach the runtime how to interpret that ownership as one isolated source-part load instead of another full-wrapper load

#### First Pass Decisions

- use the `Phase 2` provenance fields as the first runtime contract:
  - `explodedFromReferenceId`
  - `sourcePartKey`
  - `sourceMeshIndex`
- keep `sourceMeshIndex` as the first isolated-load selector:
  - the viewer already derives it from the same truthful leaf-mesh traversal used for part descriptors
- branch only for exploded imported-reference children:
  - ordinary imported references must keep the current full-object load path unchanged
- keep the first isolated-load approach runtime-local:
  - load the shared source asset normally
  - then isolate one mesh subtree matching `sourceMeshIndex`
  - do not invent a new asset export or on-disk split format in this phase
- keep Browser-facing child-part rows suppressed for exploded children:
  - an exploded child object should not immediately expose a second single-part row under itself
  - later Browser phases should read the exploded child as an ordinary object row, not an object that still looks explodable again
- preserve explicit provenance on the store record instead of duplicating it into a second viewer-owned registry
- stop before:
  - Browser context-menu entry
  - Browser tree replacement
  - broader non-imported reference explode support

#### Exact First Code Cut

The implementation-ready first cut is:

1. Extend the viewer load input contract so `ensureReferenceLoaded(...)` can see exploded-child provenance:
   - add optional exploded-load fields to `ReferenceLoadableItem` or an equivalent viewer-local load shape
   - include at minimum:
     - `explodedFromReferenceId: string | null`
     - `sourcePartKey: string | null`
     - `sourceMeshIndex: number | null`
2. Update the `ViewerHost` reference item projection so exploded imported-reference children pass those provenance fields into `viewer.ensureReferenceLoaded(...)`.
3. Add one narrow viewer helper in `src/viewer/Viewer.ts` that can:
   - load the shared source asset through the existing file-type loaders
   - isolate the single truthful mesh subtree matching `sourceMeshIndex`
   - wrap that isolated content through the existing `createReferencePivot(...)` path
4. Branch inside `ensureReferenceLoaded(reference)` so:
   - ordinary references still use the current full-object load path
   - exploded children with valid provenance use the new isolated-part load path
5. Keep the first isolated-part selector deterministic:
   - fail the load when `sourceMeshIndex` does not resolve to one truthful mesh candidate
   - surface that failure through the normal reference load-state error path instead of silently falling back to the full wrapper object
6. Keep provenance explainable in runtime state:
   - do not strip or overwrite the store-side `explodedFromReferenceId`, `sourcePartKey`, or `sourceMeshIndex` fields during load
7. Prevent exploded children from publishing a second Browser-facing part-row layer:
   - either return `[]` from `getReferencePartDescriptors(referenceId)` for exploded-child loads
   - or suppress `setReferenceItemPartRows(...)` for exploded imported children in `ViewerHost`
   - keep the rule explicit that exploded child references are terminal object rows in this first pass
8. Add focused proof that an exploded child loads the isolated part content while an ordinary wrapper reference still loads the full object content.

#### Likely Files

- `src/app/references/referenceManifest.ts`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/viewer/referencePartDescriptors.test.ts`

#### Implementation Risks

The most likely risks in this phase are:

- loading the shared source asset correctly but forgetting to isolate the child down to the one truthful mesh identified by `sourceMeshIndex`
- silently falling back to the full wrapper object when the isolated child lookup fails, which would make exploded children look real while still rendering the wrong geometry
- preserving isolated runtime geometry but still writing a single child part row back into store state, which would make the exploded child appear explodable again
- widening the viewer contract too aggressively instead of keeping one small exploded-child branch on top of the existing load path
- accidentally making full-wrapper imported references depend on exploded provenance fields they do not own

Healthy constraint:
- if later phases need a stronger locator than `sourceMeshIndex`, add it without changing the Phase 3 rule that the first runtime proof must already render one truthful isolated part per exploded child record

#### Checklist

- [x] Extend the viewer load contract with exploded-child provenance fields
- [x] Pass exploded-child provenance from `ViewerHost` into `viewer.ensureReferenceLoaded(...)`
- [x] Add one isolated single-part load branch in `Viewer`
- [x] Fail isolated loads honestly when the target source mesh cannot be resolved
- [x] Keep ordinary full-wrapper reference loads unchanged
- [x] Keep exploded-child Browser-facing part rows suppressed
- [x] Add focused viewer or host proof for isolated part load plus provenance preservation

#### Verification Shape

Minimum verification for this phase should cover:

- an ordinary non-exploded imported reference still loads through the full-wrapper runtime path
- an exploded imported-reference child with valid provenance loads only the truthful mesh identified by `sourceMeshIndex`
- the exploded child remains tied to:
  - the original shared `assetPath`
  - `explodedFromReferenceId`
  - `sourcePartKey`
  - `sourceMeshIndex`
- an exploded child whose `sourceMeshIndex` cannot be resolved fails through the normal reference load-state error path instead of silently loading the full wrapper
- exploded imported children do not write a second Browser-facing child-part row set back into `partRowsByReferenceId`

#### Done Shape

`Phase 3` is done when:

- the runtime can load one truthful isolated source part for each exploded imported-reference child
- ordinary imported references still use the unchanged full-wrapper load path
- exploded-child provenance remains explicit and inspectable on the child record
- later Browser phases can surface the exploded children as ordinary object rows without still depending on wrapper-only part-row rendering

## [x] Browser-14 - Phase 4 - Browser Explode Entry And Wrapper Replacement

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

- shipped result:
  - `browserContextMenu.ts` now adds `Explode` on imported parent object rows only when `canReferenceItemExplode(...)` says the backing imported reference is truly eligible, keeping flat or unloaded or errored imports out of the Browser command surface
  - `useBrowserPanelController.ts` now routes that right-click `Explode` action through the real store-owned `explodeImportedReference(...)` seam, clears stale wrapper-row selection when the wrapper is replaced, and records the action through the existing Browser console-entry flow
  - focused context-menu plus Browser-panel proof now covers both the narrow Browser eligibility gate and the user-visible right-click path on the parent imported `.glb` object row

## [x] Browser-14 - Phase 5 - Independent Object Behavior Parity

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

- shipped result:
  - no additional exploded-row runtime branch was needed in Browser interaction code because exploded imported children already project as ordinary imported-reference object rows through the shared object-row seams
  - focused `BrowserPanel` regression proof now covers exploded-child selection, double-click frame, multi-select hide, row-menu remove, and drag or reparent behavior under authored parents
  - Browser-14 now has explicit Browser-owned explode plus first-pass object-row parity before any later Console or keyboard widening

### Implementation Spec

#### Code-Backed Read

The current Phase 5 seam is now narrow because the first four phases already made exploded children real imported-reference-backed object rows:

- `src/app/store/useAppStore.ts`
  - `explodeImportedReference(...)` already creates real imported-reference child records under the same parent owner
  - those children already project through the same Browser content-row family as other imported reference objects
- `src/app/panels/selectBrowserTreeRows.ts`
  - `appendObjectRow(...)` already treats exploded imported children as ordinary `object` rows
  - exploded children are terminal in the Browser tree because `partRows` stays empty after the runtime isolated-part load path
  - that means the Browser surface no longer needs a special exploded-row presenter
- `src/app/panels/browserInteractions.ts`
  - already resolves selection, visibility, explicit-selection grouping, and double-click frame behavior through generic `object`-row seams
  - still contains a few imported-reference and reference-item branches that need honest parity checks now that exploded children are real Browser object rows
- `src/app/panels/useBrowserPanelController.ts`
  - already maps imported-reference object rows into drag or move owner targets as `{ kind: 'imported-reference', referenceId }`
  - already routes grouped imported-reference delete and visibility behavior through the object-row menu seams
  - is the clearest place to verify that exploded children inherit the same first-pass Browser ownership behavior as other imported references
- `src/app/panels/BrowserPanel.test.tsx`
  - already covers imported-reference object rows for context-menu behavior, grouped selection, visibility, and move flows
  - is the strongest Browser-level proof target for this parity pass

Main implication:
- `Phase 5` should mostly be a behavior-proof and light cleanup phase
- if exploded children still feel second-class, the fix should come from tightening existing imported-object Browser seams rather than adding a separate exploded-row subsystem

#### First Pass Decisions

- treat exploded children as ordinary imported-reference object rows everywhere Browser already has an imported-object seam
- prioritize the user-visible promises that motivated Browser-14:
  - selection
  - hide/show
  - delete
  - move or reparent
  - reveal/frame
- keep the first parity pass Browser-owned:
  - do not widen into Console `Explode`
  - do not widen into keyboard parity
  - do not widen into deeper transform-session convergence unless a concrete exploded-row regression forces it
- prefer removing or tightening old wrapper-only assumptions over adding new exploded-specific branches
- keep parity focused on imported exploded children only:
  - do not use this phase to redesign source-reference object behavior
  - do not use this phase to reopen flat-import explode eligibility

#### Exact First Code Cut

The implementation-ready first cut is:

1. Audit Browser object-row selection and double-click behavior in `src/app/panels/browserInteractions.ts` against exploded imported children:
   - single click should still select the exploded child as an object row
   - double click should still frame or reveal the isolated child through the existing object-row path
2. Audit Browser object-row visibility behavior for exploded imported children:
   - row eye toggles
   - grouped hide or show flows
   - context-menu visibility actions where applicable
   - keep this routed through imported-reference visibility ids, not part-row visibility
3. Audit Browser remove behavior for exploded imported children:
   - context-menu `Remove`
   - grouped imported-reference delete where multi-select already applies
   - confirm cleanup still uses the ordinary imported-reference lifecycle
4. Audit Browser move behavior for exploded imported children in `useBrowserPanelController.ts` and related drag logic:
   - exploded children should still map into `{ kind: 'imported-reference', referenceId }`
   - into-drop and reorder behavior should continue to work under authored parents
5. Add only the smallest code cleanup needed where an old wrapper assumption blocks parity:
   - prefer widening an existing imported-object condition
   - avoid creating `isExplodedChild` UI branching unless there is no cleaner shared seam
6. Add focused Browser-panel proof that exploded children behave like ordinary imported object rows across the supported first-pass actions.

#### Likely Files

- `src/app/panels/browserInteractions.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/store/useAppStore.test.ts`

#### Implementation Risks

The most likely risks in this phase are:

- assuming exploded children already have full parity because they render as object rows, while one or two Browser flows still key off old wrapper-only conditions
- accidentally widening parity fixes into source-reference or flat-import behavior that Browser-14 does not own
- fixing selection or visibility with exploded-specific branches instead of tightening the ordinary imported-object seam
- forgetting grouped multi-select cases and only proving single-row context-menu behavior
- widening into transform-session convergence even though this phase only needs normal first-pass Browser object behavior

Healthy constraint:
- if a parity problem can be fixed by making imported-reference object rows more uniformly object-like, prefer that over adding a dedicated exploded-object special case

#### Checklist

- [x] Verify exploded imported children select through the ordinary object-row seam
- [x] Verify exploded imported children frame or reveal through the ordinary object-row double-click path
- [x] Verify exploded imported children hide and show through imported-reference visibility seams
- [x] Verify exploded imported children remove through the ordinary imported-reference delete seam
- [x] Verify exploded imported children move or reorder through the ordinary imported-reference owner-target seam
- [x] Tighten any wrapper-only Browser assumptions that block exploded-row parity
- [x] Add focused Browser-level regression proof for the supported parity behaviors

#### Verification Shape

Minimum verification for this phase should cover:

- an exploded imported child can be selected as an ordinary Browser object row
- double-clicking an exploded imported child still frames or reveals the isolated child correctly
- visibility toggles on exploded imported children still route through reference visibility and do not regress into part-row-only behavior
- deleting one exploded child uses the ordinary imported-reference removal seam without affecting sibling exploded children incorrectly
- dragging or reordering exploded imported children still uses the imported-reference owner-target path under authored parents
- non-exploded imported objects still retain the same Browser behavior after the parity cleanup

#### Done Shape

`Phase 5` is done when:

- exploded imported children feel like ordinary imported object rows across the supported first-pass Browser behaviors
- the Browser no longer depends on wrapper-only assumptions for the exploded case
- focused Browser proof covers the parity claims without widening into broader cross-surface convergence

## [x] Browser-14 - Phase 6 - Naming Cleanup And Focused Regression Proof

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

- shipped result:
  - no additional runtime naming branch was needed because truthful duplicate-label disambiguation and fallback `Part N` generation were already deterministic upstream in `referencePartDescriptors.ts`, and the explode mutation already preserved those labels in truthful source order
  - focused Browser-14 regression proof now spans upstream descriptor naming, store explode conversion, isolated viewer load, Browser context-menu `Explode`, and exploded-child Browser parity
  - Browser-14 now closes with one compact, trustworthy proof set instead of widening into new command surfaces or alternate naming systems

### Implementation Spec

#### Code-Backed Read

The current Phase 6 seam is now cleanly bounded because the main Browser-14 feature work is already shipped:

- `src/app/store/useAppStore.ts`
  - `explodeImportedReference(...)` already creates one child imported-reference record per truthful part row
  - the child labels currently come straight from stored part labels in truthful source order
  - this is the primary place to tighten any remaining deterministic naming behavior if duplicates or fallback labels still feel unstable
- `src/viewer/referencePartDescriptors.ts`
  - already normalizes fallback part labels and disambiguates duplicate labels during descriptor extraction
  - is therefore the upstream source of most exploded-child naming truth
- `src/app/panels/selectBrowserTreeRows.ts`
  - already projects exploded imported children through the ordinary object-row surface
  - is the likely place to remove any final wrapper-era assumptions if a last cleanup is still needed
- `src/app/panels/browserContextMenu.test.ts`
  - already covers the Browser-owned `Explode` entry and the imported-object menu seams
- `src/app/panels/BrowserPanel.test.tsx`
  - now covers the visible Browser journey from right-click explode through first-pass exploded-child parity
- `src/app/store/useAppStore.test.ts`
  - already contains the strongest store-owned explode conversion proof and is the best place to consolidate deterministic naming expectations

Main implication:
- `Phase 6` should not introduce new feature behavior
- it should tighten the last naming guarantees, remove safe residue from wrapper-era assumptions, and leave one smaller but trustworthy Browser-14 regression set

#### First Pass Decisions

- keep exploded-child labels sourced from truthful part labels:
  - do not invent a new post-explode naming scheme unless a deterministic bug requires one
- if cleanup is needed, prefer tightening one existing source-of-truth seam:
  - upstream label normalization in `referencePartDescriptors.ts`
  - or child-label write rules in `explodeImportedReference(...)`
- avoid broad test sprawl:
  - consolidate toward one focused Browser-14 regression cluster that proves the whole ladder
  - do not preserve redundant tests whose only difference is pre-Phase-4 wrapper behavior
- keep this phase cleanup-only:
  - no new UI entry points
  - no Console parity
  - no multi-select explode
  - no new runtime loading modes

#### Exact First Code Cut

The implementation-ready first cut is:

1. Audit exploded-child naming in `explodeImportedReference(...)`:
   - verify child labels remain deterministic and source-ordered when part labels are duplicated or fallback-generated
   - only adjust naming logic if a real instability or redundant suffixing is still present
2. Audit upstream part-label generation in `referencePartDescriptors.ts`:
   - confirm fallback names such as `Part 1`, `Part 2`, and duplicate-label disambiguation remain stable enough for explode output
3. Remove any safe wrapper-only cleanup residue still left in Browser-14 seams:
   - especially where comments, conditions, or tests still speak as if wrapper-plus-parts were the only live imported-object shape
4. Consolidate the final focused Browser-14 regression proof across:
   - explode eligibility
   - explode conversion
   - isolated runtime single-part load
   - Browser context-menu `Explode`
   - exploded-child Browser parity
5. Keep the final proof set intentional and compact:
   - prefer one store-focused proof file plus one Browser-focused proof file where possible
   - avoid re-testing the same behavior through multiple nearly identical scenarios

#### Likely Files

- `src/viewer/referencePartDescriptors.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/browserContextMenu.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`

#### Implementation Risks

The most likely risks in this phase are:

- over-correcting naming and accidentally drifting away from the truthful part labels that already drive the feature
- adding new cleanup abstractions that make the final pass larger instead of simpler
- keeping too many overlapping regression tests and leaving Browser-14 harder to maintain than it needs to be
- turning this cleanup phase into a stealth feature-widening pass

Healthy constraint:
- if a candidate cleanup does not make naming more deterministic or proof more trustworthy, it probably does not belong in Phase 6

#### Checklist

- [x] Verify exploded-child labels stay deterministic and source-ordered
- [x] Tighten naming only if a real instability remains
- [x] Remove safe wrapper-only residue left behind by the old assumption set
- [x] Consolidate one focused Browser-14 regression set across store and Browser seams
- [x] Keep the final pass cleanup-only without widening Browser-14 scope

#### Verification Shape

Minimum verification for this phase should cover:

- duplicate truthful part labels still produce deterministic exploded-child object labels
- fallback-generated part labels still produce deterministic exploded-child object labels
- explode conversion remains source-ordered after any naming cleanup
- the Browser still shows `Explode` only for eligible imported parent objects
- exploded imported children still pass the first-pass Browser parity proofs from Phase 5

#### Done Shape

`Phase 6` is done when:

- exploded-child naming is deterministic enough to trust across reload and regression proof
- safe wrapper-era residue has been removed where it no longer reflects the live Browser-14 behavior
- one focused Browser-14 regression set covers the shipped feature without unnecessary overlap

## [x] Browser-14 - Phase 7 - Console Explode Entry

- seventh Browser-14 follow-on after the Browser explode lane is fully shipped
- locked direction:
  - expose `Explode` through Console when the current selected target is one eligible imported reference object that already has truthful explodable part rows
  - reuse the shipped `canReferenceItemExplode(...)` and `explodeImportedReference(...)` seams
  - keep the first cut selection-driven and narrow:
    no multi-select explode and no broad freeform command-language parsing in the same pass
- why this phase exists:
  - Browser right-click explode is now shipped, but users who work from Console still cannot trigger the same action from the selected object context
  - this follow-on should close that direct parity gap without reopening the whole Browser-14 feature family
- likely file targets:
  - `src/app/store/useAppStore.ts`
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/console/stagedNavigation.ts`
  - `src/app/console/useConsoleInteraction.ts`
  - `src/app/console/radioCommandIdentity.ts`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/console/stagedNavigation.test.ts`
  - `src/app/store/useAppStore.test.ts`
- done shape:
  - Console exposes `Explode` for one eligible selected imported reference object
  - ineligible selected objects do not show the Console explode action
  - selecting the Console explode action reuses the existing explode mutation and leaves Browser plus viewer state coherent

- shipped result:
  - `selectConsoleWorkspaceContextTarget(...)` now projects `canExplode` for selected imported-reference object targets by reusing `canReferenceItemExplode(...)` instead of duplicating a Console-only detector
  - Console staged navigation now exposes `Explode` in the selected reference-object session only when that selected target is truly eligible
  - `useConsoleInteraction.ts` now routes the Console `Explode` action through `explodeImportedReference(...)` and keeps Console context coherent through the existing sync seam
  - `radioCommandIdentity.ts` now recognizes the new staged `reference.explode` action so Console execution stays aligned with the existing command identity model
  - focused proof now covers the selector affordance, staged `Explode` action routing, and one end-to-end selected-reference Console explode flow

### Implementation Spec

#### Code-Backed Read

The live Phase-7 seams already exist:
- `canReferenceItemExplode(...)` in `src/app/store/useAppStore.ts` is the canonical explode-eligibility read and should stay the only truth for whether one selected imported reference object can surface `Explode`
- `explodeImportedReference(...)` in `src/app/store/useAppStore.ts` is the canonical mutation seam and should stay the only action path for the first Console cut
- `selectConsoleWorkspaceContextTarget(...)` in `src/app/store/useAppStore.ts` already owns the selected-target Console affordance shape and is the right place to project one narrow `canExplode` read for selected object targets
- `src/app/console/stagedNavigation.ts` already owns the selected reference-object choice set and is the right place to expose one narrow `Explode` choice in the selected session
- `src/app/console/useConsoleInteraction.ts` already routes selected reference-object actions such as `Delete` and `Hide` through the store seams and is the right first owner for the Console `Explode` execution path
- `src/app/console/ConsoleDock.tsx` already builds the staged-navigation context from the live app state and is the right owner for reusing the shared explode seam when a user reaches a reference through the Console flow itself

#### First Pass Decisions

- keep Console explode selection-driven instead of inventing typed command parsing in the same pass
- only one selected imported reference object can expose `Explode` in this first cut
- reuse the shipped store seams instead of duplicating Browser-specific explode checks inside Console rendering
- do not widen into multi-select explode, part-target explode, or freeform Console language routing here

#### Exact First Code Cut

1. Widen the Console selected-target context for `kind: 'object'` so it can project `canExplode: boolean` only when the resolved selected object maps to one explodable imported reference.
2. Compute that `canExplode` value inside `selectConsoleWorkspaceContextTarget(...)` by reusing `canReferenceItemExplode(state, referenceId)` and the existing selected-object reference resolution path.
3. In `src/app/console/stagedNavigation.ts`, render one Console `Explode` action only when the selected target is that one eligible object and `canExplode === true`.
4. Route the Console `Explode` action directly through `explodeImportedReference(referenceId)` from `src/app/console/useConsoleInteraction.ts` and reuse the existing post-mutation selection plus workspace refresh behavior instead of inventing a Console-only explode state layer.
5. Keep the first pass silent for ineligible selections, multi-select, references-root targets, and part rows.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/store/useAppStore.test.ts`

#### Implementation Risks

- surfacing Console `Explode` for non-imported or non-explodable object selections because the Console context target widened too broadly
- duplicating explode eligibility rules in AppShell instead of reusing the store selector result
- accidentally exposing Console `Explode` for multi-select or part-target context when only one selected imported object is meant to qualify
- widening the phase into broad command-language parsing instead of one explicit selected-object action

#### Checklist

- [x] widen the selected Console object-target shape with one narrow `canExplode` affordance
- [x] compute `canExplode` through `canReferenceItemExplode(...)` with no duplicate eligibility detector
- [x] render Console `Explode` only for one eligible selected imported reference object
- [x] route the Console action through `explodeImportedReference(...)`
- [x] keep multi-select and ineligible targets out of scope for this pass
- [x] add focused Console plus store regression proof

#### Verification Shape

Minimum verification for this phase should cover:

- one eligible selected imported reference object surfaces Console `Explode`
- one ineligible selected object does not surface Console `Explode`
- multi-select does not surface Console `Explode`
- invoking Console `Explode` reuses `explodeImportedReference(...)` and leaves the selected workspace context coherent after the wrapper is replaced

#### Done Shape

`Phase 7` is done when:

- Console exposes one explicit `Explode` action for the currently selected eligible imported reference object
- Console does not show `Explode` for ineligible, multi-select, root, category, or part-target selections
- the Console action reuses the shipped explode mutation and keeps Browser plus viewer state coherent without a second Console-only explode path

## [x] Browser-14 - Phase 8 - Preserve Loaded Runtime After Explode

- eighth Browser-14 follow-on after the Browser and Console explode surfaces are shipped
- locked direction:
  - preserve the user-visible loaded result when one eligible reference object is exploded instead of seeding every new child as hidden plus unloaded
  - prefer a narrow handoff from the already-loaded wrapper runtime into the exploded children before falling back to later isolated reload behavior
  - keep this phase focused on immediate post-explode continuity:
    do not widen it into broad asset caching, import dedup redesign, or a second explode architecture
- why this phase exists:
  - the current explode flow is functionally correct but creates a UX cliff:
    the wrapper disappears, the child objects arrive turned off, and loading them back in feels slow because each child later reloads the source asset and isolates its target mesh
  - from the user point of view, explode should feel like "split what I am already looking at" rather than "replace one loaded object with many unloaded placeholders"
- likely file targets:
  - `src/app/store/useAppStore.ts`
  - `src/app/components/ViewerHost.tsx`
  - `src/app/viewerBridge.ts`
  - `src/viewer/Viewer.ts`
  - `src/viewer/Viewer.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
  - `src/app/store/useAppStore.test.ts`
- done shape:
  - exploding one currently loaded eligible wrapper keeps the resulting child objects visually alive right away
  - the first post-explode state no longer reads as all children being turned off
  - the phase preserves the real independent child-object ownership model from Browser-14 without regressing later isolated single-part loads

- shipped result:
  - `Viewer` now exposes one narrow `handoffExplodedReferenceChildren(...)` seam that clones the already-loaded wrapper runtime, isolates one truthful source mesh per exploded child, and keeps those child references loaded without re-fetching the source asset
  - `ViewerHost` now detects the wrapper-to-children swap during explode and upgrades successfully handed-off exploded children to loaded state immediately, preserving wrapper visibility when the live handoff succeeds
  - the older exploded-child isolated reload path remains intact as the fallback for restore, reload, and any explode that does not have live wrapper runtime available

### Implementation Spec

#### Code-Backed Read

The current UX gap comes from two already-shipped seams working exactly as written:

- `src/app/store/useAppStore.ts`
  - `explodeImportedReference(...)` currently replaces the wrapper with real child imported-reference records
  - that mutation also writes the first post-explode runtime state through `referenceWorkspace.visibilityById` and `referenceWorkspace.loadStateById`
  - those new child records are then seeded hidden and `unloaded`, which is why the Browser immediately shows them as off instead of live
- `src/viewer/Viewer.ts`
  - `ensureReferenceLoaded(...)` already owns the exploded-child isolated-part runtime branch by using stored provenance such as `sourceMeshIndex`
  - that path is truthful, but when a child is later loaded it still pays the cost of reloading the source asset and then isolating the target mesh
- `src/app/components/ViewerHost.tsx`
  - already coordinates the viewer-to-store handoff during reference loads through the same `ensureReferenceLoaded(...)` lifecycle and is the best first place to preserve continuity between the pre-explode wrapper runtime and the new child objects
- `src/app/viewerBridge.ts`
  - already carries exploded-child provenance fields such as `sourceMeshIndex`
  - is the likely seam for introducing one narrow "explode from live loaded wrapper" handoff without leaking raw viewer internals directly into Browser code

Main implication:
- this phase should not change what `Explode` means
- it should change the first post-explode runtime experience so the feature feels like an immediate split of live content rather than a cold unload and reload cycle

#### First Pass Decisions

- preserve the shipped real explode model:
  - one wrapper still becomes many independent child reference objects
- optimize only the immediate handoff:
  - do not redesign later child loads beyond what is needed for continuity right after explode
- prefer reusing live wrapper runtime data when the wrapper is already loaded:
  - if that live runtime is unavailable, the existing truthful isolated reload path can remain the fallback
- keep visibility honest:
  - do not mark exploded children as visible unless the viewer can actually hand them live content

#### Exact First Code Cut

1. Audit the current explode mutation and identify the minimum state that must survive the wrapper-to-children swap so the immediate post-explode view stays alive.
2. Add one narrow exploded-reference handoff seam between app state and viewer runtime, most likely through `viewerBridge.ts` plus the existing `ViewerHost` load/update path, so a loaded wrapper can transfer or clone its already-loaded isolated part content into the new child references.
3. Change `explodeImportedReference(...)` so child references created from a currently loaded wrapper do not all start hidden and unloaded by default when that live handoff succeeds, while keeping the current `visibilityById` and `loadStateById` writes as the fallback shape when it does not.
4. Preserve the existing isolated child-load path as the fallback for:
   - reload
   - app restore
   - any explode where the wrapper was not currently loaded
5. Keep `Viewer.ensureReferenceLoaded(...)` as the long-term truthful isolated-load owner for exploded children so later restore or manual load behavior does not fork into a second runtime model.
6. Prove that immediate explode continuity works without regressing:
   - real child ownership
   - isolated part truth
   - later independent hide or remove or reload behavior

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`

#### Implementation Risks

- accidentally faking continuity by marking children visible without real live viewer content behind them
- coupling the store too tightly to viewer runtime details instead of adding one narrow bridge seam
- breaking the already-shipped fallback isolated-load path that exploded children still need on later reloads
- widening the phase into a full asset-cache redesign when the actual need is the immediate post-explode handoff

#### Checklist

- [x] keep the immediate post-explode result visually alive when the wrapper was already loaded
- [x] avoid seeding every exploded child as hidden and unloaded on the successful live-handoff path
- [x] preserve the shipped isolated child-load fallback for later reload and restore flows
- [x] keep real independent exploded-child ownership intact
- [x] add focused viewer plus host plus store regression proof for the continuity path

#### Verification Shape

Minimum verification for this phase should cover:

- exploding one currently loaded eligible wrapper leaves the child result visibly alive without a manual reload step
- exploding one not-currently-loaded eligible wrapper still falls back to the existing isolated child-load behavior safely
- exploded children created through the live handoff still behave like independent reference objects for hide and remove and later reload
- the viewer still isolates the truthful target mesh for each exploded child and does not republish nested part rows under those terminal children

#### Done Shape

`Phase 8` is done when:

- exploding one loaded eligible wrapper feels like an immediate split of live visible content
- the first post-explode Browser state no longer reads as all child objects being off by default
- later reload and restore flows still use the truthful exploded-child isolated-load path when live handoff is unavailable

## [ ] Browser-14 - Phase 9 - High-Part Explode Performance Optimization

- ninth Browser-14 follow-on after the live continuity pass shipped
- locked direction:
  - keep the real Browser-14 explode ownership result intact for high part-count objects
  - reduce the up-front performance cost and perceived freeze when one explode produces many child objects at once
  - stay narrower than a general-purpose reference runtime rewrite:
    this phase is about large explode responsiveness, not a whole new loading architecture
- why this phase exists:
  - Phase 8 fixed the UX cliff where exploded children all arrived off and unloaded
  - but large explodes can still be expensive because the app now has to fan one loaded wrapper into many real child objects in one burst
  - objects with dozens of parts should still feel usable when the user explicitly chooses `Explode`
 - standalone phase doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Future/Browser_Phase Browser-14 - Phase 9 - High-Part Explode Performance Optimization.md`

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
- should `Browser-14` land first as one Browser-owned single-object explode action layered on top of real per-part object ownership, leaving multi-select explode plus keyboard or broader command-surface parity to later follow-ons if we still want them?

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

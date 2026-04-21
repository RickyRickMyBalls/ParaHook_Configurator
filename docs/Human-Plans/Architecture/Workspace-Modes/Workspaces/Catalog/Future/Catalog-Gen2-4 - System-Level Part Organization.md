# Catalog-Gen2-4 - System-Level Part Organization

## Doc Header

### Doc History
7. 2026-04-20 15:00:43: Closed `Catalog-Gen2-4 / Phase 3` and `Catalog-Gen2-4` as a docs/test audit after focused verification and `npm.cmd run build` passed, confirming the current `Rim Saver` wheel-owned guardrail, no `partGroups` widening, no fake motor/tire records, and no Power/Fasteners runtime expansion; recorded that no Phase 3.1 is needed and next Gen2 work should proceed to `Catalog-Gen2-5 / Phase 1`.
6. 2026-04-20 14:58:42: Prepared `Catalog-Gen2-4 / Phase 3` as a docs/test audit closeout after the accepted Phase 1 implementation and focused tests already prove `Rim Saver` maps to wheel-owned `systemKey: 'Wheel'` and `partType: 'Rim Saver'` without a misleading part group; recommended closing `Catalog-Gen2-4` after Phase 3 if verification passes, while marking only current Platform/Wheel organizer items complete and keeping later Power/Fasteners growth deferred.
5. 2026-04-20 14:57:12: Closed `Catalog-Gen2-4 / Phase 2` as a docs/test audit after focused verification and `npm.cmd run build` passed, confirming the Phase 1 platform-owned `Footpad Attachment` and `Controller Box` mappings, raw `Part Type` metadata preservation, existing system/type/group filter reads, and the mixed-label note without adding runtime conflict-state behavior.
4. 2026-04-20 14:55:37: Prepared `Catalog-Gen2-4 / Phase 2` as a docs/test audit closeout after the accepted Phase 1 implementation already applied platform-owned `Footpad Attachment` and `Controller Box` source-type mappings, preserved raw `Part Type` metadata, and proved the existing system/type/group filter path; recorded that the current first-recognized-label behavior is acceptable for the current tiny samples but should become a conflict-safety follow-up only if real mixed-system source records appear.
3. 2026-04-20 14:51:41: Implemented and closed `Catalog-Gen2-4 / Phase 1` after external PubParts `typeOfPart` source labels gained a conservative `catalogSource.ts` classification helper that maps only `Footpad Attachment`, `Controller Box`, and `Rim Saver` into existing `systemKey`, `partType`, and safe `partGroups` fields while preserving raw `Part Type` metadata, keeping platform compatibility separate from system ownership, and leaving Phase 2 as the next Worker prep target.
2. 2026-04-20 14:48:12: Prepared `Catalog-Gen2-4 / Phase 1` for implementation by choosing a `catalogSource.ts` external type classification helper that uses existing `systemKey`, `partType`, and `partGroups` fields; mapped only the current exact cached PubParts labels `Footpad Attachment`, `Gasket, Controller Box`, and `Rim Saver`, preserved raw source `Part Type` metadata, kept `Rim Saver` wheel-owned without forcing a bad part group, and left Power/Fasteners expansion, compatibility verdicts, archive/import behavior, fake motor/tire records, and starting assemblies out of scope.
1. 2026-04-20 14:46:42: Created this `Catalog-Gen2-4` Family Phase Doc after `Catalog-Gen2-3` completed platform and fitment normalization, routing PubParts `typeOfPart` source labels into ParaHook-owned system, part-group, and metadata mapping phases without inventing fake motor/tire assets, widening the canonical system contract prematurely, or shipping compatibility verdicts.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-4`.

Use it to answer:
- how PubParts `typeOfPart` labels should map into ParaHook-owned Catalog systems
- which external part types can safely gain `systemKey`, `partGroups`, and `partType`
- where source part-type labels remain visible as attribution metadata
- how to keep Platform, Wheel, and later Hardware/Power/Fastener lanes separate
- which Worker prep target comes next

### Scope

This doc covers:
- metadata-first mapping from PubParts `typeOfPart` to existing ParaHook Catalog fields
- first-pass external `systemKey` mapping for `Platform`, `Wheel`, and `Hardware`
- first-pass external `partGroups` mapping only when the local Catalog group is already a truthful fit
- safe treatment of unknown or too-narrow source labels
- tests proving external system/part-group mapping does not flatten everything into platform ownership

This doc does not cover:
- live PubParts fetch or broad source mirroring
- repo-backed motor/tire asset creation
- final Power or Fasteners system expansion
- PubWheel starting assemblies
- archive download, extraction, import, or user-choice behavior
- compatibility verdicts, Ricky Checker, builder slot validation, or dimensional proof

## Doc Body

### Family Phase Goal

`Catalog-Gen2-4` should make external PubParts records participate in ParaHook's system organization without letting PubParts become the runtime taxonomy.

The first source samples are small, so this family phase should map only the labels that are safe to classify and preserve the rest as source metadata. A `Rim Saver` should not be treated as a board-platform-owned part just because the source also lists broad platform compatibility. A `Controller Box` record can be grouped with platform-owned boxes, while narrow or unknown labels should remain searchable source evidence until ParaHook owns a better local category.

### Boundary Rules

- PubParts `typeOfPart` labels remain source evidence.
- ParaHook `CatalogItemRecord` fields remain runtime truth.
- Do not add a new canonical system unless the current phase proves the app needs it now.
- The current contract already has `Platform`, `Wheel`, and `Hardware`; use those before widening.
- Assign `partGroups` only when an existing group is a truthful match.
- Preserve raw source `typeOfPart` metadata even when a normalized system or part group is added.
- Do not fabricate local repo-backed motor or tire entries.
- Do not ship compatibility verdicts, fit proof, or builder-slot validation.

### Current Live Read

Accepted source and platform inputs from earlier Gen2 work:
- external Catalog records now use `sourceKind: 'external'`
- PubParts normalized source items preserve `sourceMetadata.typeOfPart`
- external PubParts part records already carry source metadata rows such as `Type Of Part`
- external PubParts platform compatibility now maps into ParaHook-owned `platformCompatibility`
- current Catalog filters already read `systemKey`, `partType`, and `partGroups`

Current exact cached PubParts part source labels include:
- `Footpad Attachment`
- `Gasket, Controller Box`
- `Rim Saver`

Current local Catalog fields include:
- systems: `Platform`, `Wheel`, `Hardware`
- part groups: `Footpads`, `Bumpers`, `Rails`, `Motors`, `Tires`, `Boxes`, `Axle Blocks`, `FootHolds`, `Shoes`, and `Screw & Nuts`

### Acceptance Read

This family phase is complete when:
- external PubParts type labels can map into ParaHook-owned system and part-group fields where the mapping is truthful
- source type labels remain visible and searchable as metadata
- wheel-owned external records do not collapse into fake platform-only ownership
- unknown or too-specific labels do not crash and do not silently disappear
- current browse/filter/search helpers can read the normalized system fields without a second filter system
- Power/Fasteners growth remains planned without premature contract widening

## Vision

`Catalog-Gen2-4` should make Catalog feel less like one flat list of board-platform things.

Platform compatibility says which board families a record may relate to. System ownership says what kind of physical system the part belongs to. Those are different truths. Gen2 should start preserving that difference for external records, especially for wheel-side parts and future hardware/power lanes.

This is still curation metadata, not compatibility approval. The app should not imply a part fits a build unless a later checker generation proves that.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-3. Map PubParts platform and part-type language into ParaHook-owned platform families, systems, part groups, and item metadata.
- [ ] Catalog-Gen2-CLG-6. Organize external parts by real system ownership such as Platform, Wheel, and later Power or Fasteners.

### `Catalog-Gen2-4 / Phase 1`

- [x] Phase 1 prep chooses the exact helper owner, output shape, known source label mappings, and no-widening boundary.
- [x] Create the external `typeOfPart` normalization helper and mapping baseline.
- [x] Preserve raw PubParts type labels as metadata.
- [x] Map only current exact source labels that have a safe ParaHook-owned interpretation.
- [x] Keep unknown or too-specific labels safe and visible.
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] Catalog-Gen2-CLG-3.
- [x] Catalog-Gen2-CLG-6.

### `Catalog-Gen2-4 / Phase 2`

- [x] Phase 2 prep decides this phase should close as a docs/test audit unless verification exposes a regression.
- [x] Apply platform-owned part mappings for safe labels such as footpad attachments and controller boxes.
- [x] Prove platform-owned mappings use existing `systemKey`, `partType`, and `partGroups` fields.
- [x] Keep source labels visible after normalization.
- [x] `Catalog-Gen2-HLG-3`
- [x] Catalog-Gen2-CLG-3.
- [x] Catalog-Gen2-CLG-6.

### `Catalog-Gen2-4 / Phase 3`

- [x] Phase 3 prep decides this phase should close as a docs/test audit unless verification exposes a regression.
- [x] Apply wheel-owned guardrails for current wheel-side labels such as rim savers.
- [x] Prove wheel-owned records do not collapse into fake platform-only ownership.
- [x] Record Power/Fasteners as later growth lanes without widening the contract in this phase unless required.
- [x] Decide whether this family phase is complete or needs a follow-up `Phase 3.1`.
- [x] `Catalog-Gen2-HLG-2`
- [x] `Catalog-Gen2-HLG-3`
- [x] Catalog-Gen2-CLG-3.
- [x] Catalog-Gen2-CLG-6.

## [x] `Catalog-Gen2-4 / Phase 1` - `External Type System Mapping Baseline`

### Phase 1 Summary

#### Purpose

Add the first source-type normalization baseline for external PubParts part records so `typeOfPart` source labels can become ParaHook-owned Catalog metadata without replacing source evidence.

#### Owns

- a pure helper for reading PubParts `typeOfPart` labels
- a conservative mapping result for `systemKey`, `partType`, and `partGroups`
- preservation of raw source type metadata
- tests for exact current cached source labels and unknown values

#### Does Not Own

- broad type taxonomy for all PubParts records
- final Power/Fasteners system contract expansion
- repo-backed motor/tire source records
- compatibility verdicts
- archive/import behavior
- starting assemblies

### Phase 1 Implementation Spec

#### Current Code And Data Read

Relevant current seams:
- `src/app/catalog/catalogItemContract.ts` already exposes the fields this phase needs:
  - `systemKey?: CatalogItemSystem`, with current values `Platform`, `Wheel`, and `Hardware`
  - `partType?: string`
  - `partGroups?: CatalogItemPartGroup[]`, with current values including `Footpads` and `Boxes` but no truthful rim-saver group
- `src/app/catalog/pubPartsSource.ts` normalizes raw PubParts `typeOfPart` arrays into comma-joined `sourceMetadata.typeOfPart` strings.
- `src/app/catalog/catalogSource.ts` builds external PubParts `CatalogItemRecord`s in `buildCatalogExternalPubPartsItem(...)`, currently preserving source type labels in metadata as `{ label: 'Part Type', value: sourceItem.sourceMetadata.typeOfPart }`.
- `src/app/catalog/ui/catalogShellShared.ts` already reads `systemKey`, `partType`, and `partGroups` for existing filters and search reads metadata labels/values.
- cached current PubParts part examples are:
  - `3d Printed Gripples` with `typeOfPart: ['Footpad Attachment']`
  - `Celeste: Stock Controller Box Gasket` with `typeOfPart: ['Gasket', 'Controller Box']`
  - `FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs` with `typeOfPart: ['Rim Saver']`

#### Decision

Implement Phase 1 as the full exact-label baseline and application for the current tiny cached PubParts source set.

Use existing `CatalogItemRecord` fields only. Do not add a new contract field or new system value.

Add a small exported helper in `src/app/catalog/catalogSource.ts`, likely:

```ts
export type CatalogExternalTypeClassification = {
  systemKey?: CatalogItemSystem
  partType?: string
  partGroups?: CatalogItemPartGroup[]
}

export function buildCatalogExternalTypeClassification(
  sourceTypeOfPart: string | readonly string[] | null | undefined,
): CatalogExternalTypeClassification
```

The helper should:
- accept scalar strings, raw string arrays, and current comma-joined normalized source metadata strings
- split strings by comma
- trim labels
- drop blanks
- match exact source labels case-insensitively
- de-duplicate any output arrays
- return `{}` for blank, `null`, `undefined`, unknown labels, unsupported labels, and resource records

Exact mappings for Phase 1:
- `Footpad Attachment`
  - `systemKey: 'Platform'`
  - `partType: 'Footpad Attachment'`
  - `partGroups: ['Footpads']`
- `Gasket, Controller Box` source shape, represented by normalized labels `Gasket` and `Controller Box`
  - only classify when `Controller Box` is present
  - `systemKey: 'Platform'`
  - `partType: 'Controller Box'`
  - `partGroups: ['Boxes']`
  - preserve the raw source metadata row as `Gasket, Controller Box`; do not erase `Gasket`
- `Rim Saver`
  - `systemKey: 'Wheel'`
  - `partType: 'Rim Saver'`
  - no `partGroups`, because the current `CatalogItemPartGroup` union has no truthful rim-saver group and mapping it to `Motors`, `Tires`, or platform-owned groups would be misleading

When multiple recognized labels appear, choose the first recognized classification in source-label order and keep the helper conservative. The current cached samples do not require merging multiple different system classifications into one item; a future phase can widen if live data proves that need.

Apply the helper in `buildCatalogExternalPubPartsItem(...)`:
- compute classification from `sourceItem.sourceMetadata.typeOfPart`
- spread `systemKey`, `partType`, and `partGroups` into the external `CatalogItemRecord` only when present
- keep existing raw source metadata rows unchanged, especially `{ label: 'Part Type', value: ... }`
- keep `platformCompatibility` separate from system ownership

#### No-Widening Rules

- no fake motor or tire records
- no `Power` or `Fasteners` contract expansion
- no new `CatalogItemSystem` value
- no new `CatalogItemPartGroup` value
- no compatibility verdicts, Ricky Checker, builder slots, dimensional proof, or fit approval language
- no archive download, extraction, import, user-choice behavior, or source-page behavior changes
- no starting assemblies
- no filter semantics rewrite
- no PubParts live fetch, broad mirror, or cached sample expansion

#### Focused Tests

Implementation should update focused tests:

- `src/app/catalog/catalogSource.test.ts`
  - import/test `buildCatalogExternalTypeClassification(...)`
  - assert scalar, array, and comma-joined input support
  - assert `Footpad Attachment` maps to `Platform`, `Footpad Attachment`, and `['Footpads']`
  - assert `Gasket, Controller Box` maps through `Controller Box` to `Platform`, `Controller Box`, and `['Boxes']`
  - assert `Rim Saver` maps to `Wheel` and `Rim Saver` without `partGroups`
  - assert blank, `null`, `undefined`, unknown, and unsupported labels return `{}`
  - assert `3d Printed Gripples` gains the platform-owned footpad attachment fields while preserving raw `Part Type: Footpad Attachment`
  - assert `Celeste: Stock Controller Box Gasket` gains platform-owned box fields while preserving raw `Part Type: Gasket, Controller Box`
  - assert `FloatNLC: Rimmy OneWheel Rim Protection...` gains wheel-owned `systemKey: 'Wheel'` and `partType: 'Rim Saver'` while preserving raw `Part Type: Rim Saver` and gaining no `partGroups`
  - assert `ADV 3d Printed List` resource remains without `systemKey`, `partType`, or `partGroups`
- `src/app/catalog/ui/catalogShellShared.test.ts`
  - prove the existing System/Part Type/Part Group filter path can read the newly populated external fields when cached PubParts items are explicitly composed
  - prove `Rim Saver` appears under `Wheel`/`Rim Saver` but does not appear under a bad platform-owned part group
  - prove raw source type text remains searchable through metadata
- `src/app/workspace/CatalogSurface.test.tsx`
  - update only if live external item assertions need to acknowledge the new source fields; no new UI behavior should be required

Verification commands:
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

#### Phase 2 And Phase 3 Read

Phase 1 applied the exact safe current labels end-to-end, so later phases may become smaller verification/closeout slices:
- Phase 2 can audit platform-owned `Footpad Attachment` and `Controller Box` behavior rather than adding new mappings, unless Manager wants extra platform-owned labels from newer source samples.
- Phase 3 can audit wheel-owned `Rim Saver` guardrails and family closeout rather than adding a new group, unless Manager decides a new wheel-side group is needed after more real data.

Do not close those later phases during Phase 1. Manager should decide after Phase 1 verification whether they remain implementation phases or become docs/test audits.

Next Worker prep target:
- `Catalog-Gen2-4 / Phase 2 - Platform-Owned Part Type Mapping`

## [x] `Catalog-Gen2-4 / Phase 2` - `Platform-Owned Part Type Mapping`

### Phase 2 Summary

#### Purpose

Apply the safe platform-owned source-type mappings to external PubParts items and prove they participate in existing Catalog organization without changing filter semantics.

#### Owns

- platform-owned mappings for safe current labels
- item-level `systemKey`, `partType`, and `partGroups` population where truthful
- focused tests for existing filter/search helpers

#### Does Not Own

- wheel-owned guardrails beyond not breaking them
- adding new systems
- compatibility verdicts

### Phase 2 Implementation Spec

#### Current Code And Test Read

Accepted Phase 1 already implemented the platform-owned runtime behavior Phase 2 was originally created to own:
- `buildCatalogExternalTypeClassification(...)` in `src/app/catalog/catalogSource.ts` maps `Footpad Attachment` to `systemKey: 'Platform'`, `partType: 'Footpad Attachment'`, and `partGroups: ['Footpads']`.
- the same helper maps any source label set containing `Controller Box` to `systemKey: 'Platform'`, `partType: 'Controller Box'`, and `partGroups: ['Boxes']`.
- `buildCatalogExternalPubPartsItem(...)` applies the helper result to external PubParts `CatalogItemRecord`s.
- `buildExternalMetadataRows(...)` still preserves the raw PubParts `Part Type` metadata row, including `Gasket, Controller Box`.
- `src/app/catalog/catalogSource.test.ts` already asserts the helper mappings, cached Gripples platform-owned footpad fields, cached Celeste platform-owned box fields, raw `Part Type` metadata preservation, resource safety, and preview-only external action behavior.
- `src/app/catalog/ui/catalogShellShared.test.ts` already proves the existing System, Part Type, and Part Groups filter paths read the newly populated external fields without rewriting filter semantics.

#### Decision

Implement Phase 2 as a docs/test audit closeout, not new runtime code, unless verification exposes a concrete regression.

The accepted Phase 1 implementation already satisfies the platform-owned mapping objective for the current cached source records. Phase 2 should verify and close that fact rather than re-implementing the same seam.

#### Mixed Known Label Audit

The current helper returns the first recognized mapping in source-label order. That behavior is acceptable for Phase 2 because:
- current cached platform-owned samples are unambiguous:
  - `Footpad Attachment`
  - `Gasket, Controller Box`, where `Gasket` remains source metadata and `Controller Box` is the safe ParaHook-owned classification signal
- no current cached sample mixes platform-owned and wheel-owned labels in one real record
- the raw source `Part Type` metadata remains visible, so source nuance is not erased
- adding a conflict/error classification shape now would widen the helper without live data proving the need

Do not add a conflict-state contract in Phase 2. If a future real source sample contains conflicting system labels such as `Controller Box` plus `Rim Saver` on one item, Manager should route a narrow follow-up to make the helper return no classification or an explicit conflict-safe result before widening the runtime taxonomy.

#### Closeout Scope

Phase 2 implementation should:
- rerun the focused source and shell verification already covering platform-owned mappings
- mark Phase 2 checklist items complete if verification passes
- mark the Phase 2 top-level heading complete if the local doc pattern supports it
- update this family doc Doc History
- update `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md` so the next Worker prep target becomes `Catalog-Gen2-4 / Phase 3 - Wheel-Owned Part Guardrails And Closeout`
- update `docs/Doc-Log.md`
- skip `docs/CHANGELOG.md` unless runtime code changes, because the approved Phase 2 cut is docs/test audit only

#### Acceptance Checks

- `3d Printed Gripples` remains `systemKey: 'Platform'`, `partType: 'Footpad Attachment'`, and `partGroups: ['Footpads']`.
- `Celeste: Stock Controller Box Gasket` remains `systemKey: 'Platform'`, `partType: 'Controller Box'`, and `partGroups: ['Boxes']`.
- `Celeste: Stock Controller Box Gasket` still preserves raw metadata as `Part Type: Gasket, Controller Box`.
- resource records without part source type remain without `systemKey`, `partType`, or `partGroups`.
- existing System, Part Type, and Part Groups filters can read the platform-owned external fields when cached PubParts items are explicitly composed.
- mixed known-label helper behavior remains documented as first-recognized-label for current samples, with no conflict-state widening in this phase.
- no filter rewrite, new system, new part group, fake motor/tire record, Power/Fasteners widening, compatibility verdict, archive/import behavior, or starting assembly behavior ships.

Verification commands:
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

#### Implementation Closeout

Phase 2 closed as a docs/test audit with no runtime changes. Focused verification passed and confirmed:
- `3d Printed Gripples` keeps the Phase 1 platform-owned `Footpad Attachment` classification.
- `Celeste: Stock Controller Box Gasket` keeps the Phase 1 platform-owned `Controller Box` / `Boxes` classification.
- raw `Part Type: Gasket, Controller Box` source metadata remains visible.
- resource records stay unclassified for `systemKey`, `partType`, and `partGroups`.
- existing System, Part Type, and Part Groups filters can read the external platform-owned fields without a filter rewrite.

The mixed known-label note remains a future trigger only. Phase 2 did not add conflict-state runtime behavior because no current real cached sample mixes platform-owned and wheel-owned labels on one item.

Next Worker prep target:
- `Catalog-Gen2-4 / Phase 3 - Wheel-Owned Part Guardrails And Closeout`

## [x] `Catalog-Gen2-4 / Phase 3` - `Wheel-Owned Part Guardrails And Closeout`

### Phase 3 Summary

#### Purpose

Ensure wheel-side external parts remain organized under wheel ownership where current source truth supports it, then close or follow up the family honestly.

#### Owns

- wheel-owned mapping guardrails for current source labels
- tests proving wheel-side records do not collapse into platform-only ownership
- final `Catalog-Gen2-4` completion audit

#### Does Not Own

- fake motor or tire assets
- full wheel compatibility proof
- Power/Fasteners expansion unless a follow-up phase is explicitly created
- builder runtime

### Phase 3 Implementation Spec

#### Current Code And Test Read

Accepted Phase 1 already implemented the wheel-owned runtime behavior Phase 3 was created to guard:
- `buildCatalogExternalTypeClassification(...)` in `src/app/catalog/catalogSource.ts` maps `Rim Saver` to `systemKey: 'Wheel'` and `partType: 'Rim Saver'`.
- the helper intentionally does not assign `partGroups` for `Rim Saver`, because the current `CatalogItemPartGroup` union has no truthful rim-saver group.
- `buildCatalogExternalPubPartsItem(...)` applies that classification to the cached FloatNLC PubParts record.
- `src/app/catalog/catalogSource.test.ts` already asserts the FloatNLC record keeps `platformCompatibility` separate from system ownership, gains `systemKey: 'Wheel'`, gains `partType: 'Rim Saver'`, preserves raw `Part Type: Rim Saver`, and has no `partGroups`.
- `src/app/catalog/ui/catalogShellShared.test.ts` already proves the existing filter path can find FloatNLC through `systemKey: ['Wheel']` and `partType: ['Rim Saver']`, while proving FloatNLC does not appear under the platform-owned `Boxes` part-group filter.
- resource and unknown/blank source-type records stay unclassified by the Phase 1 helper.

#### Decision

Implement Phase 3 as a docs/test audit closeout, not new runtime code, unless verification exposes a concrete regression.

No new `CatalogItemPartGroup` should be added for rim savers in Phase 3. The honest current representation is `systemKey: 'Wheel'`, `partType: 'Rim Saver'`, and no `partGroups`.

No `Phase 3.1` is needed if verification passes. `Catalog-Gen2-4` can close as the current-sample system-level part organization family because:
- Platform-owned examples are implemented and verified by Phase 1/2.
- The current wheel-owned example is implemented and verified by Phase 1/3.
- Power and Fasteners are intentionally deferred future growth lanes, not missing work inside this current family closeout.
- Fake motor/tire records remain out of scope because the repo still has no real motor/tire assets or source samples that require them.

#### Gen2 Index Truth For Closeout

Implementation closeout should update the Gen2 index conservatively:
- mark `G2-22. Platform Versus Wheel Organizer` complete because current external part records now distinguish Platform and Wheel system ownership.
- mark `G2-23. Platform-Owned Part Types` complete for current safe samples, because `Footpad Attachment` and `Controller Box` map into Platform-owned fields.
- mark `G2-24. Wheel-Owned Part Types` complete for current safe samples, because `Rim Saver` maps to Wheel without a misleading group.
- leave `G2-25. Later Power Organizer` open/deferred.
- leave `G2-26. Later Fasteners Organizer` open/deferred.
- mark the current-sample organizer statements complete only where they describe Platform/Wheel truth already shipped.
- keep broader Gen2 HLG that depend on later families open if they still require pre-built assemblies, builder metadata, or compatibility work.
- do not claim Power/Fasteners runtime support, fake motor/tire asset support, compatibility verdicts, or builder behavior.

The index has stale current-planning wording that should be cleaned during implementation closeout:
- the global next Worker target currently points at `Catalog-Gen2-4 / Phase 3`; after Phase 3 closes, it should point at the next family target selected by the index, likely `Catalog-Gen2-5 / Phase 1` if Manager agrees the Gen2 sequence should continue to pre-built PubWheel starting assemblies.
- the `Catalog-Gen2-4` family phase section should mark the family complete if Phase 3 verification passes, while preserving Power/Fasteners as deferred open wishlist lanes rather than pretending they shipped.

#### Closeout Scope

Phase 3 implementation should:
- rerun the focused source and shell verification already covering wheel-owned guardrails
- mark Phase 3 checklist items complete if verification passes
- mark the Phase 3 top-level heading complete if the local doc pattern supports it
- mark the `Catalog-Gen2-4` family doc heading/closeout complete if verification passes
- update this family doc Doc History
- update `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen2-Index.md` with truthful wishlist completion/deferment and next target routing
- update `docs/Doc-Log.md`
- skip `docs/CHANGELOG.md` unless runtime code changes, because the approved Phase 3 cut is docs/test audit only

#### Acceptance Checks

- `FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs` remains `systemKey: 'Wheel'`.
- FloatNLC remains `partType: 'Rim Saver'`.
- FloatNLC still has no `partGroups`.
- FloatNLC does not appear under platform-owned `Boxes`.
- FloatNLC keeps broad platform compatibility separate from system ownership.
- raw `Part Type: Rim Saver` source metadata remains visible.
- resource records and unknown/blank source types remain safe and unclassified.
- no fake motor/tire records, new systems, new part groups, Power/Fasteners widening, compatibility verdicts, archive/import behavior, or starting assembly behavior ships.

Verification commands:
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

#### Implementation Closeout

Phase 3 closed as a docs/test audit with no runtime code changes. Focused verification passed with `42` tests across `catalogSource.test.ts`, `catalogShellShared.test.ts`, and `CatalogSurface.test.tsx`, followed by a passing `npm.cmd run build` with only the existing Vite/OCCT warnings.

The current `FloatNLC`/`Rim Saver` sample remains classified as `systemKey: 'Wheel'` and `partType: 'Rim Saver'` with no `partGroups`, so it does not collapse into platform-only ownership or appear under the platform-owned `Boxes` group. Platform compatibility remains separate from system ownership, and raw PubParts `Part Type` metadata remains visible as source truth.

No `Phase 3.1` is needed for the current samples. `Catalog-Gen2-4` is complete for current Platform/Wheel external type organization, while Power and Fasteners organizer growth stays deferred because no runtime Power/Fasteners system expansion shipped in this family phase.

Next Worker prep target:
- `Catalog-Gen2-5 / Phase 1`

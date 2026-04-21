# Catalog-Gen2-3 - Platform And Fitment Normalization

## Doc Header

### Doc History
7. 2026-04-20 14:45:20: Closed `Catalog-Gen2-3 / Phase 3` and the `Catalog-Gen2-3` family as a docs/test closeout audit after focused source/shared/surface verification and `npm.cmd run build` passed without runtime changes; confirmed external platform filtering reads canonical `platformCompatibility`, raw source platform metadata and GT-S source fitment notes remain metadata/search truth, resources without platform source stay unclassified, repo/import behavior stays stable, and later `typeOfPart` system mapping plus compatibility verdict work remain deferred.
6. 2026-04-20 14:43:31: Prepared `Catalog-Gen2-3 / Phase 3` as a docs/test closeout audit instead of a new runtime implementation after reviewing the accepted Phase 1 and Phase 2 code/tests; recorded that canonical external platform filtering and source-metadata search are already covered by `catalogSource.test.ts` and `catalogShellShared.test.ts`, with implementation expected to verify those commands, update tracking docs, and avoid filter/search/runtime widening.
5. 2026-04-20 14:40:00: Closed `Catalog-Gen2-3 / Phase 2` after external PubParts platform source labels gained a helper-derived `Source Fitment Note` metadata row for `GT/GT-S`, `GT-S`, and `GTS`, while broad `GT` platform compatibility stayed unchanged and no tags, new item fields, canonical platform values, filters, compatibility verdicts, archive/import behavior, fake motor/tire records, or `typeOfPart` system mapping were added; set Phase 3 as the next prep target and confirmed it should likely be a docs/test closeout audit.
4. 2026-04-20 14:37:54: Prepared `Catalog-Gen2-3 / Phase 2` for implementation by choosing helper-derived source metadata rows as the narrowest durable way to preserve `GT-S`/`GTS` source fitment truth while keeping `platformCompatibility` broad, leaving tags, new contract fields, filters, compatibility verdicts, and system mapping untouched; recorded that Phase 3 likely becomes a docs/test closeout audit because Phase 1 already made external platform compatibility participate in the existing filter path.
3. 2026-04-20 14:34:12: Closed `Catalog-Gen2-3 / Phase 1` after the canonical external platform mapping helper shipped in `catalogSource.ts`, external PubParts part records began carrying ParaHook-owned `platformCompatibility` values, raw source platform metadata stayed inspectable, focused tests passed, and `npm.cmd run build` passed without sub-platform, system mapping, filter rewrite, archive/import, or compatibility-verdict widening.
2. 2026-04-20 14:30:42: Prepared `Catalog-Gen2-3 / Phase 1` for implementation by recording the live PubParts source, cached source, external item mapping, platform filter, and focused-test seams; chose the `catalogSource.ts` external item mapping boundary for canonical PubParts platform normalization into `CatalogItemPlatformFamily[]` while preserving raw platform metadata and deferring sub-platform notes, system mapping, and compatibility verdicts.
1. 2026-04-20 14:29:03: Created this `Catalog-Gen2-3` Family Phase Doc after `Catalog-7 / Phase 4` completed the Gen1 wheel-fitment gate, routing canonical external platform mapping, sub-platform fitment notes, and normalized external filter/search metadata into small implementation phases without compatibility verdicts or PubParts source re-ingestion.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-3`.

Use it to answer:
- how PubParts source platform text should map into ParaHook-owned platform families
- how `Floatwheel`, `GT/GT-S`, `Pint/X/S`, `XR/Funwheel`, and `XR Classic` should normalize without becoming runtime truth by themselves
- where sub-platform tags and narrower fitment notes belong
- how external platform compatibility should become searchable/filterable through ParaHook fields
- which Worker prep target comes next

### Scope

This doc covers:
- canonical platform-family mapping for external source records
- `Floatwheel` to `ADV` mapping
- `GT` as the broad family with `GTS` or `GT-S` style sub-platform notes
- `Pint`, `XR`, `XR Classic`, and `Other` normalization
- cross-platform compatibility metadata for external Catalog entries
- normalized metadata needed by current Catalog browse, filter, and search helpers

This doc does not cover:
- live PubParts browser fetch or broad sync
- linked archive download, extraction, import, or external add-to-project
- system-level part organization by PubParts `typeOfPart`
- pre-built PubWheel starting assemblies
- compatibility verdicts, builder slot validation, Ricky Checker, or dimensional proof
- adding fake repo-backed motor/tire assets

## Doc Body

### Family Phase Goal

`Catalog-Gen2-3` should make external source records speak ParaHook's platform language.

PubParts platform strings are useful source evidence, but they should not become the app's canonical runtime vocabulary. This family phase maps known PubParts platform labels into the existing `CatalogItemPlatformFamily` values and adds just enough sub-platform metadata to preserve narrower source truth without shipping compatibility decisions.

### Boundary Rules

- PubParts source fields remain attribution/source metadata.
- ParaHook `CatalogItemRecord` fields remain runtime truth.
- `platformCompatibility` must use the existing canonical families: `ADV`, `XR`, `GT`, `Pint`, `XR Classic`, and `Other`.
- `Floatwheel` source labels map to canonical `ADV`.
- `GT/GT-S` should keep broad `GT` compatibility while preserving a narrower `GTS` or `GT-S` note/tag.
- Cross-platform PubParts records may map to more than one canonical family.
- Unknown or miscellaneous source platform values should remain visible as safe metadata and map to `Other` only when needed.
- Gen1 wheel-fitment fields are available as a local target, but this phase must not invent motor/tire verdicts.

### Current Live Read

Accepted source-intake inputs from earlier Gen2 work:
- External Catalog records now use `sourceKind: 'external'`.
- PubParts normalized source items preserve raw platform labels in `sourceMetadata.platform`.
- Live external PubParts Catalog items currently keep `platformCompatibility` unset and display source platform labels only as metadata.
- Current Catalog filters already read `platformCompatibility`, but external entries cannot participate in platform filters until normalization fills ParaHook-owned fields.
- Current search reads labels, tags, notes, and metadata, so source platform strings are searchable as metadata, but not yet normalized platform truth.
- `Catalog-7 / Phase 4` added optional `wheelFitment` fields as the Gen1 target seam for later motor/tire fitment metadata without adding fake live motor/tire assets.

### Acceptance Read

This family phase is complete when:
- external PubParts platform labels normalize into ParaHook canonical platform families
- source platform labels remain preserved as attribution/source metadata
- sub-platform notes/tags can preserve narrower source truth such as `GT-S` or `GTS`
- external records can participate in platform browse/filter/search through normalized ParaHook fields
- unknown platform values do not crash and do not silently erase source text
- compatibility verdicts, builder validation, dimensional proof, and archive/import behavior remain deferred

## Vision

`Catalog-Gen2-3` should make the first external source lane feel like it belongs in ParaHook's catalog model.

The user should be able to filter external PubParts entries by familiar ParaHook platform families without losing the original PubParts wording. A source record that says `Floatwheel` should be findable under `ADV`; a source record that says `GT/GT-S` should be findable under `GT` while keeping the narrower source truth visible; and a broad multi-platform source record should map into multiple canonical families instead of one flat label.

This is still metadata normalization, not fit approval. The app should not say a part definitely fits a build unless a later compatibility/checker generation proves that.

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-3. Map PubParts platform and part-type language into ParaHook-owned platform families, systems, part groups, and item metadata.
- [ ] Catalog-Gen2-CLG-5. Normalize platform and fitment truth for external records while keeping Gen3 compatibility verdicts deferred.

### `Catalog-Gen2-3 / Phase 1`

- [x] Add the canonical external platform mapping helper.
- [x] Map `Floatwheel` to `ADV`.
- [x] Map known source platform labels into `ADV`, `GT`, `Pint`, `XR`, `XR Classic`, and `Other`.
- [x] Preserve source platform labels as source metadata.
- [x] Keep unknown values safe and visible.
- [ ] `Catalog-Gen2-HLG-2`
- [ ] `Catalog-Gen2-HLG-3`
- [ ] Catalog-Gen2-CLG-3.
- [ ] Catalog-Gen2-CLG-5.

### `Catalog-Gen2-3 / Phase 2`

- [x] Phase 2 prep chooses helper-derived metadata rows for narrower source truth such as `GT-S` or `GTS`.
- [x] Add sub-platform or fitment-note metadata for narrower source truth such as `GT-S` or `GTS`.
- [x] Keep broad `GT` compatibility while preserving narrower notes.
- [x] Avoid compatibility verdict language.
- [ ] `Catalog-Gen2-HLG-3`
- [ ] Catalog-Gen2-CLG-5.

### `Catalog-Gen2-3 / Phase 3`

- [x] Phase 3 prep audits current Phase 1 and Phase 2 test coverage before deciding runtime scope.
- [x] Update external Catalog item mapping so normalized platform compatibility feeds current browse/filter/search helpers.
- [x] Prove external platform filters read ParaHook-owned normalized fields, not raw PubParts strings.
- [x] Keep source attribution and raw platform metadata visible.
- [ ] `Catalog-Gen2-HLG-2`
- [ ] `Catalog-Gen2-HLG-3`
- [ ] Catalog-Gen2-CLG-3.
- [ ] Catalog-Gen2-CLG-5.

## [x] `Catalog-Gen2-3 / Phase 1` - `Canonical External Platform Mapping`

### Phase 1 Summary

#### Purpose

Add the first canonical platform mapping helper for external PubParts source records so raw platform labels can become ParaHook-owned `platformCompatibility` values without replacing source metadata.

#### Owns

- a small pure mapping helper for PubParts source platform labels
- canonical family output using existing `CatalogItemPlatformFamily` values
- preservation of source platform labels for attribution and display
- safe fallback handling for unknown, miscellaneous, blank, or array-shaped platform values
- focused tests for the known PubParts sample shapes

#### Does Not Own

- sub-platform tags and narrower fitment notes beyond preserving source text
- system-level part organization from `typeOfPart`
- runtime filter UI changes beyond data becoming available where helpers already read it
- compatibility verdicts
- PubParts live fetch or new cached samples
- archive/import behavior

#### Current Live Read

Known current PubParts sample platform values include:
- `Miscellaneous Items`
- `GT/GT-S`
- arrays or joined values containing `Floatwheel`, `GT/GT-S`, `Pint/X/S`, `XR Classic`, and `XR/Funwheel`

Current `CatalogItemPlatformFamily` values already include:
- `ADV`
- `XR`
- `GT`
- `Pint`
- `XR Classic`
- `Other`

Live seam findings from prep:
- `src/app/catalog/catalogItemContract.ts` owns the canonical `CatalogItemPlatformFamily` union: `ADV`, `XR`, `GT`, `Pint`, `XR Classic`, and `Other`.
- `src/app/catalog/pubPartsSource.ts` accepts raw PubParts scalar strings and string arrays through `PubPartsStringValue`, then normalizes array metadata into stable comma-joined strings such as `Floatwheel, GT/GT-S, Pint/X/S, XR Classic, XR/Funwheel`.
- `src/app/catalog/pubPartsCachedSource.ts` routes the tiny cached source records through `normalizePubPartsPartSourceItem(...)` and `normalizePubPartsResourceSourceItem(...)`; no live fetch or broad mirror is involved.
- `src/app/catalog/pubpartsSourceData/parts.ts` already includes `3d Printed Gripples` with platform `['Miscellaneous Items']`.
- `src/app/catalog/pubpartsSourceData/partsGt.ts` already includes `Celeste: Stock Controller Box Gasket` with platform `['GT/GT-S']` and `FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs` with platforms `['Floatwheel', 'GT/GT-S', 'Pint/X/S', 'XR Classic', 'XR/Funwheel']`.
- `src/app/catalog/pubpartsSourceData/resources.ts` has no part platform field and should not gain platform compatibility in Phase 1.
- `src/app/catalog/catalogSource.ts` creates external PubParts `CatalogItemRecord`s in `buildCatalogExternalPubPartsItem(...)`, currently leaving `platformCompatibility` unset while preserving source platform text in metadata rows.
- `src/app/catalog/ui/catalogShellShared.ts` already reads `item.platformCompatibility` for Platform browse sections and the `Platform Compatibility` filter group, while search still reads raw metadata labels and values.
- focused tests already cover PubParts normalization, cached source composition, external item metadata, source labels, platform filters for repo items, and live `CatalogSurface` external item rendering.

#### First Pass Decisions

- normalize from PubParts source metadata into ParaHook fields during external Catalog item creation in `src/app/catalog/catalogSource.ts`
- add an exported pure helper in `catalogSource.ts` named `normalizeCatalogExternalPlatformCompatibility(...)`
- have the helper return `CatalogItemPlatformFamily[]`
- have the helper accept `string | readonly string[] | null | undefined` so tests can cover raw scalar values, raw array values, and the current normalized comma-joined string shape without forcing `pubPartsSource.ts` to stop preserving source metadata as stable strings
- split string input on comma boundaries because `PubPartsNormalizedSourceItem.sourceMetadata.platform` is currently a comma-joined source string
- trim values, drop blanks, de-duplicate canonical families, and keep output order stable by first source occurrence
- map `Floatwheel` to `ADV`
- map `GT/GT-S` to `GT` for broad family compatibility
- map `Pint/X/S` to `Pint`
- map `XR Classic` to `XR Classic`
- map `XR/Funwheel` to `XR`
- map `Miscellaneous Items`, blank, and unknown values safely without throwing
- return `[]` for blank input and resource records with no platform source field
- return `['Other']` for non-blank unknown or miscellaneous source labels, preserving source text in metadata rows so the fallback does not erase evidence
- populate `platformCompatibility` only in `buildCatalogExternalPubPartsItem(...)` for external PubParts part records when the helper returns at least one canonical family; leave it unset for resource records and blank source input
- keep raw platform labels in metadata so source wording remains inspectable

### Phase 1 Implementation Spec

#### Exact First Code Cut

Implement this phase as one narrow source-mapping cut:

1. In `src/app/catalog/catalogSource.ts`, import `CatalogItemPlatformFamily` and add:
   - `export function normalizeCatalogExternalPlatformCompatibility(sourcePlatform: string | readonly string[] | null | undefined): CatalogItemPlatformFamily[]`
2. Implement the helper as pure metadata normalization:
   - accept raw scalar strings, raw string arrays, and the current normalized comma-joined `sourceMetadata.platform` string
   - split string input by comma, trim each label, drop blanks, and de-duplicate output
   - preserve first-source-label order after canonical mapping
   - map `Floatwheel` to `ADV`
   - map `GT/GT-S` to `GT`
   - map `Pint/X/S` to `Pint`
   - map `XR Classic` to `XR Classic`
   - map `XR/Funwheel` to `XR`
   - map `Miscellaneous Items` and any non-blank unknown source label to `Other`
   - return `[]` for blank, `null`, or `undefined`
3. In `buildCatalogExternalPubPartsItem(...)`, compute platform families from `sourceItem.sourceMetadata.platform`.
4. Populate `platformCompatibility` on the returned external `CatalogItemRecord` only when the helper returns a non-empty array.
5. Keep raw PubParts platform source text unchanged in existing metadata rows, especially the `{ label: 'Platform', value: ... }` row from `buildExternalMetadataRows(...)`.
6. Do not add new cached source data; current tiny samples already cover `Miscellaneous Items`, `GT/GT-S`, and the multi-platform `Floatwheel`, `GT/GT-S`, `Pint/X/S`, `XR Classic`, `XR/Funwheel` shape.
7. Do not add sub-platform notes, `GTS` fitment notes, `typeOfPart` to system/part-group mapping, filters, search rewrites, or UI label changes in Phase 1.

#### Likely Files

- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogSource.test.ts`
- `src/app/catalog/pubPartsSource.test.ts`
- `src/app/catalog/ui/catalogShellShared.test.ts`
- `src/app/workspace/CatalogSurface.test.tsx`
- `docs/CHANGELOG.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- do not add compatibility verdicts
- do not add builder slots or dimensional fit proof
- do not add live PubParts fetch
- do not add archive download/import
- do not create fake repo-backed motor/tire records
- do not make raw PubParts platform strings the runtime platform vocabulary
- do not add system-level part organization from `typeOfPart`; that belongs to `Catalog-Gen2-4`

#### Implementation Risks

- treating `Floatwheel` as a new platform instead of canonical `ADV`
- dropping `GT-S` source truth when mapping to broad `GT`
- losing multi-platform compatibility on array or comma-separated values
- mapping unknown/miscellaneous labels in a way that hides source evidence
- accidentally claiming compatibility proof instead of metadata normalization

#### Checklist

- [x] Phase 1 prep names the exact helper owner and tests.
- [x] canonical platform mapping is implemented as ParaHook-owned metadata.
- [x] `Floatwheel` maps to `ADV`.
- [x] multi-platform source values map to multiple canonical platform families.
- [x] unknown values are safe and visible.
- [x] source platform metadata remains inspectable.
- [x] focused tests and `npm.cmd run build` pass.

#### Verification Shape

Minimum implementation verification should cover:
- `catalogSource.test.ts` covers `normalizeCatalogExternalPlatformCompatibility(...)` for scalar input, raw array input, current comma-joined normalized input, blank input, `null`/`undefined`, `Miscellaneous Items`, and unknown labels.
- `catalogSource.test.ts` asserts exact mappings:
  - `Floatwheel -> ADV`
  - `GT/GT-S -> GT`
  - `Pint/X/S -> Pint`
  - `XR Classic -> XR Classic`
  - `XR/Funwheel -> XR`
  - `Miscellaneous Items -> Other`
- `catalogSource.test.ts` updates the cached PubParts external snapshot proof:
  - `3d Printed Gripples` exposes `platformCompatibility: ['Other']` while its metadata still contains `{ label: 'Platform', value: 'Miscellaneous Items' }`
  - `Celeste: Stock Controller Box Gasket` exposes `platformCompatibility: ['GT']` while its metadata still contains `GT/GT-S`
  - `FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs` exposes `platformCompatibility: ['ADV', 'GT', 'Pint', 'XR Classic', 'XR']` while its metadata still contains the original multi-platform source string
  - `ADV 3d Printed List` resource remains without `platformCompatibility`
- `pubPartsSource.test.ts` remains focused on preserving scalar/array source metadata; update only if helper placement changes.
- `catalogShellShared.test.ts` may assert that normalized external platform families now appear in `Platform Compatibility` filter options when a snapshot is explicitly composed with cached PubParts source items, while raw platform strings remain searchable via metadata.
- `CatalogSurface.test.tsx` may update the live external-item proof only if existing assertions need to acknowledge normalized platform metadata; avoid adding new UI behavior beyond current filter/search reads.
- No action, archive, builder, source-page, add-to-project, compatibility verdict, sub-platform, system mapping, fake repo motor/tire, or filter semantics behavior changes.
- Run focused tests first, then `npm.cmd run build` during implementation.

#### Done Shape

`Catalog-Gen2-3 / Phase 1` is done when the external PubParts source lane can produce canonical ParaHook platform-family metadata from known source platform labels while preserving raw source wording and avoiding compatibility verdicts.

Phase 1 is complete as a narrow source-mapping implementation. `normalizeCatalogExternalPlatformCompatibility(...)` now maps PubParts source platform strings and arrays into ParaHook-owned `CatalogItemPlatformFamily[]`, `buildCatalogExternalPubPartsItem(...)` applies those values to external PubParts part records when present, and raw source platform rows remain visible in metadata. This closeout did not add sub-platform tags, `GTS` notes, `typeOfPart` system mapping, live PubParts fetch, cached sample expansion, filter rewrites, archive/import behavior, or compatibility verdicts.

Next Worker prep target:
- `Catalog-Gen2-3 / Phase 2 - Sub-Platform Tags And Narrow Fitment Notes`

## [x] `Catalog-Gen2-3 / Phase 2` - `Sub-Platform Tags And Narrow Fitment Notes`

### Phase 2 Summary

#### Purpose

Preserve narrower source fitment truth such as `GT-S` or `GTS` without replacing the broad canonical platform family used for browse and filtering.

#### Owns

- sub-platform tags or fitment-note metadata for external items
- display/source visibility for narrower source labels
- tests proving broad family mapping and narrower notes can coexist

#### Does Not Own

- new canonical platform families
- compatibility verdicts
- builder slot validation
- dimensional proof
- system-level part organization

### Phase 2 Implementation Spec

Phase 2 should implement the smallest possible source-truth visibility seam: helper-derived Catalog metadata rows on external PubParts items.

#### Current Phase 1 Truth

- `src/app/catalog/catalogSource.ts` owns broad external platform normalization through `normalizeCatalogExternalPlatformCompatibility(...)`.
- `GT/GT-S` now maps to broad canonical `platformCompatibility: ['GT']`.
- current external PubParts item metadata still contains the raw `{ label: 'Platform', value: 'GT/GT-S' }` row.
- `src/app/catalog/ui/catalogShellShared.ts` already reads `platformCompatibility` for Platform browse sections and the `Platform Compatibility` filter group.
- `catalogShellShared.test.ts` already proves explicitly composed external PubParts items can participate in the existing platform filter path after Phase 1.

#### Decision

Use helper-derived `metadata` rows, not tags, notes, a new optional item field, or a new canonical platform family.

Reasoning:
- `metadata` is already the source-details shape for external PubParts source truth.
- `metadata` rows are visible and searchable through existing helpers without filter semantics changes.
- tags would make `GT-S` feel like broader runtime categorization instead of source evidence.
- notes risk reading as editorial fitment guidance rather than source-truth preservation.
- a new optional item field would create migration pressure before the app has enough distinct sub-platform behavior to justify it.
- a new canonical platform value such as `GT-S` or `GTS` would violate the existing family contract and undercut Phase 1's broad `GT` mapping.

#### Exact Implementation Cut

Implement this as a narrow helper and external item metadata append:

1. In `src/app/catalog/catalogSource.ts`, import `CatalogItemMetadataEntry` as a type if needed.
2. Add an exported pure helper near `normalizeCatalogExternalPlatformCompatibility(...)`, likely:
   - `buildCatalogExternalPlatformFitmentMetadataRows(sourcePlatform: string | readonly string[] | null | undefined): CatalogItemMetadataEntry[]`
3. Reuse or share the same source-label reading rules as Phase 1:
   - accept scalar strings, raw string arrays, and comma-joined normalized metadata strings
   - split strings by comma
   - trim labels
   - drop blanks
   - match labels case-insensitively
4. Detect these source labels:
   - current live sample label: `GT/GT-S`
   - future-safe exact labels: `GT-S`, `GTS`
5. Return one stable metadata row when a detected label exists:
   - `{ label: 'Source Fitment Note', value: 'GT-S source label preserved; canonical platform family remains GT' }`
6. De-dupe so `GT/GT-S, GT-S, GTS` still produces only one row.
7. Return `[]` for blank, `null`, `undefined`, `Miscellaneous Items`, unknown labels, and non-GT-S platform labels.
8. Append these rows to the existing external item metadata in `buildCatalogExternalPubPartsItem(...)` after `buildExternalMetadataRows(sourceItem)`.
9. Keep `platformCompatibility` unchanged:
   - `GT/GT-S` continues to map to `['GT']`
   - no `GT-S`, `GTS`, or other new canonical family appears
10. Do not add item tags, new filters, new browse modes, item-page special rendering, compatibility verdicts, builder slots, dimensional proof, archive/import behavior, fake repo motor/tire records, or `typeOfPart` system mapping.

#### Focused Tests

Implementation should update focused tests only where the seam lives:

- `src/app/catalog/catalogSource.test.ts`
  - import and test `buildCatalogExternalPlatformFitmentMetadataRows(...)`
  - assert `GT/GT-S` returns exactly the `Source Fitment Note` row
  - assert `GT-S` and `GTS` also return the same row
  - assert comma-joined and array-shaped values de-dupe to one row
  - assert `Floatwheel`, `Pint/X/S`, `XR/Funwheel`, `XR Classic`, `Miscellaneous Items`, unknown, blank, `null`, and `undefined` return `[]`
  - assert `Celeste: Stock Controller Box Gasket` and `FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs` keep broad `platformCompatibility` values while gaining the `Source Fitment Note` metadata row
  - assert `3d Printed Gripples` and `ADV 3d Printed List` do not gain the row
- `src/app/catalog/ui/catalogShellShared.test.ts`
  - add or extend one focused proof only if useful: searching `GT-S` or `GTS` against an explicitly composed external snapshot finds the GT source records through metadata while platform filtering still uses broad `GT`
- `src/app/workspace/CatalogSurface.test.tsx`
  - update only if existing live external assertions need to account for the new metadata row; no new UI behavior is required

Implementation verification:
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

#### Phase 3 Read

Phase 3 probably should become a docs/test closeout audit rather than a new runtime implementation phase.

Why:
- Phase 1 already populated `platformCompatibility` for external PubParts items.
- The existing platform browse/filter helpers already read `platformCompatibility`.
- Focused Phase 1 tests already proved external PubParts items can appear in the existing `Platform Compatibility` filter path when the snapshot is explicitly composed.
- Phase 2 should add source fitment visibility through metadata, which the existing search helper already reads.

Phase 3 should therefore prep as an audit/closeout unless Phase 2 implementation exposes a real gap. Its likely closeout scope should be:
- prove broad external platform filtering remains driven by canonical `platformCompatibility`
- prove raw platform source labels and the new source fitment note remain searchable/visible as metadata
- record that no filter rewrite, new browse mode, or compatibility verdict is needed in Gen2-3
- keep Gen2-4 as the owner for `typeOfPart` to system/part-group mapping

#### Implementation Closeout

Phase 2 is complete as a source-metadata implementation. `buildCatalogExternalPlatformFitmentMetadataRows(...)` now adds one stable `Source Fitment Note` row when external source platform labels contain `GT/GT-S`, `GT-S`, or `GTS`, and external PubParts item metadata appends that row after the existing source rows. Broad `platformCompatibility` remains unchanged, so `GT/GT-S` continues to map to canonical `GT` only. The implementation did not add tags, notes, a new optional item field, new canonical platform values, filters, browse modes, item-page special rendering, compatibility verdicts, builder slots, dimensional proof, archive/import behavior, fake repo motor/tire records, or `typeOfPart` system mapping.

Focused tests and `npm.cmd run build` passed. Phase 3 should prep as a docs/test closeout audit unless Manager identifies a remaining runtime gap.

Next Worker prep target:
- `Catalog-Gen2-3 / Phase 3 - External Platform Filter And Search Read`

## [x] `Catalog-Gen2-3 / Phase 3` - `External Platform Filter And Search Read`

### Phase 3 Summary

#### Purpose

Make normalized external platform metadata participate in the existing Catalog browse/filter/search helpers without building a second filter system.

#### Owns

- external platform compatibility appearing in existing platform browse/filter reads
- focused UI/helper tests for normalized external metadata
- keeping raw source platform text searchable and visible

#### Does Not Own

- filter semantics rewrites
- new browse modes
- system-level part organization
- compatibility verdicts

### Phase 3 Implementation Spec

Phase 3 should implement as a docs/test closeout audit, not as new runtime code.

#### Current Code/Test Read

Phase 1 and Phase 2 already satisfy the runtime objective this phase originally named:

- `src/app/catalog/catalogSource.ts` now populates `platformCompatibility` on external PubParts part records through `normalizeCatalogExternalPlatformCompatibility(...)`.
- `GT/GT-S` maps to broad canonical `GT`; multi-platform records map to `ADV`, `GT`, `Pint`, `XR Classic`, and `XR` in source-label order.
- `buildCatalogExternalPlatformFitmentMetadataRows(...)` appends a `Source Fitment Note` metadata row for `GT/GT-S`, `GT-S`, and `GTS` source labels without adding a new platform family or compatibility verdict.
- `src/app/catalog/ui/catalogShellShared.ts` already reads `item.platformCompatibility` for Platform browse sections and the `Platform Compatibility` filter group.
- the existing search helper already reads metadata labels and values, so raw platform source labels and the `Source Fitment Note` are searchable without a new search path.
- `src/app/catalog/catalogSource.test.ts` proves external PubParts items carry canonical `platformCompatibility`, keep raw `Platform` metadata, preserve the GT-S source note, and keep resources without platform compatibility.
- `src/app/catalog/ui/catalogShellShared.test.ts` proves explicitly composed external PubParts items appear in the existing platform compatibility filter path and can be found by `GT/GT-S` and `GT-S` metadata search.
- `src/app/workspace/CatalogSurface.test.tsx` remains the live surface guard for existing external Catalog behavior.

#### Decision

Do not add runtime code in Phase 3 unless the implementation verification reveals a real regression.

Phase 3 should close by:
- documenting that the existing `platformCompatibility` browse/filter path is already the correct owner for external canonical platform filtering
- documenting that raw PubParts platform source labels and the Phase 2 `Source Fitment Note` remain source metadata, not filter semantics or compatibility verdicts
- rerunning the focused Catalog source/shared/surface tests and `npm.cmd run build`
- updating this family doc, `Catalog-Gen2-Index.md`, and `docs/Doc-Log.md`
- skipping `docs/CHANGELOG.md` if no runtime/source code changes are made during the closeout

#### Acceptance Checks

Implementation closeout should confirm:
- external PubParts items explicitly composed into a snapshot expose `platformCompatibility` for `ADV`, `GT`, `Pint`, `XR Classic`, `XR`, and `Other` where current tiny cached samples support those families
- `FloatNLC: Rimmy OneWheel Rim Protection for 6" and 6.5" hubs` remains filterable through broad canonical platform families, including `ADV`
- `Celeste: Stock Controller Box Gasket` remains broad `GT`, not a new `GT-S` canonical platform
- searches for raw `GT/GT-S` source metadata and `GT-S` source fitment metadata find the expected explicitly composed external PubParts records
- raw PubParts source platform text stays visible in existing metadata rows
- external resources without source platform labels still do not gain `platformCompatibility`
- repo/import behavior stays stable
- no filter semantics rewrite, new browse mode, action-kind change, archive/import behavior, compatibility verdict, `typeOfPart` system mapping, fake motor/tire record, or new canonical platform value appears

#### Verification Commands

Implementation should run:

- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

#### Closeout Read

If the verification passes without runtime changes, Phase 3 can be marked complete as the audit/verification closeout for `Catalog-Gen2-3`.

For the generation index, do not over-close broader wishlist items that still require later ownership. The truthful closeout should mark only the Phase 3 filter/search read complete and preserve remaining Gen2 platform/system work for later Manager routing, especially `typeOfPart` to system/part-group mapping under `Catalog-Gen2-4` and any broader compatibility/checker work outside Gen2-3.

#### Implementation Closeout

Phase 3 is complete as a docs/test audit with no runtime code changes.

Verification confirmed:
- external PubParts items explicitly composed into a snapshot expose canonical `platformCompatibility` for the platform families covered by the current tiny cached samples
- external platform filtering uses ParaHook-owned `platformCompatibility`, not raw PubParts strings
- raw source platform metadata stays visible/searchable through existing metadata rows
- the Phase 2 `Source Fitment Note` keeps `GT-S` source truth searchable as metadata, not as a canonical platform family
- PubParts resource records without platform source metadata still do not gain `platformCompatibility`
- repo/import behavior remains stable through the existing focused `CatalogSurface` and source tests

Verification run:
- `npm.cmd test -- src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/workspace/CatalogSurface.test.tsx`
- `npm.cmd run build`

No follow-up `Phase 3.1` is needed. `Catalog-Gen2-3` is complete as the platform/focus normalization family phase. Remaining Gen2 work should move to `Catalog-Gen2-4 / Phase 1`, where `typeOfPart` to system/part-group mapping belongs. Compatibility verdicts/checker work remains deferred outside this family phase.

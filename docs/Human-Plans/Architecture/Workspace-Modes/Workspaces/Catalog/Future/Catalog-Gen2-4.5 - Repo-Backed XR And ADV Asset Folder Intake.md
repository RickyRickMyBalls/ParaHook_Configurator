# Catalog-Gen2-4.5 - Repo-Backed XR And ADV Asset Folder Intake

## Doc Header

### Doc History
7. 2026-04-20 16:08:29: Closed `Catalog-Gen2-4.5 / Phase 3 - Asset Folder Convention Closeout And Starting Assembly Handoff` and the family phase as a docs/test audit after focused Catalog tests and `npm.cmd run build` passed, confirming the current copied Catalog asset set is only the XR PubWheel STEP/GLB pair, staging files remain out of the Catalog lane, and the next handoff returns to `Catalog-Gen2-5 / Phase 3`.
6. 2026-04-20 16:06:43: Prepped `Catalog-Gen2-4.5 / Phase 3 - Asset Folder Convention Closeout And Starting Assembly Handoff` as a docs/test closeout audit after verifying the only current repo-backed XR/ADV Catalog assembly files are the handled XR PubWheel STEP/GLB pair, the original staging files remain in `C:\Users\Rubbe\Desktop\ParaHookConfig\20\3d models\`, and no additional loose XR/ADV Catalog asset classification is needed before handing back to `Catalog-Gen2-5 / Phase 3`.
5. 2026-04-20 16:02:39: Closed `Catalog-Gen2-4.5 / Phase 2 - XR PubWheel 1 Asset Set Migration` after the live XR planned seed gained `sourceAssetSet` with `pubwheel_1` / `v1` STEP preferred-source and GLB companion-mesh variants while preserving bridge fields, one-card identity, disabled planned behavior, and ADV bridge-only source truth.
4. 2026-04-20 15:59:53: Prepped `Catalog-Gen2-4.5 / Phase 2 - XR PubWheel 1 Asset Set Migration` with an implementation-ready live XR seed migration spec that adds `sourceAssetSet` beside the existing planned-source bridge fields, keeps `pubwheel_1` as one Catalog card with STEP preferred-source and GLB companion-mesh variants, leaves ADV bridge-only for this phase, and preserves non-previewable planned-source behavior.
3. 2026-04-20 15:55:39: Closed `Catalog-Gen2-4.5 / Phase 1 - Versioned Multi-File Asset Set Contract` after planned source records gained optional asset-set contract/read support and focused tests proved `pubwheel_1` / `v1` STEP and GLB variants through fixtures without live seed migration, preview/load behavior, Import-5 widening, or platform placeholders.
2. 2026-04-20 15:51:40: Prepped `Catalog-Gen2-4.5 / Phase 1 - Versioned Multi-File Asset Set Contract` with an implementation-ready planned-source asset-set contract for one logical item carrying STEP and GLB variants under source version `pubwheel_1` / `v1`, keeping live XR seed migration in Phase 2, planned entries non-previewable, and Import-5, preview fallback, and builder load behavior out of scope.
1. 2026-04-20 15:45:58: Created this family phase doc after the supplied XR PubWheel 1 STEP/GLB files were copied into `public/Catalog/assemblies/xr/`, routing the next work through a versioned multi-file asset-set contract before more starting-assembly handoff behavior is built.

### Purpose

This file is the Family Phase Doc for `Catalog-Gen2-4.5`.

Use it to answer:
- how repo-backed XR and ADV assets should be placed and classified before Catalog consumes them
- how one logical Catalog item can own more than one 3D file
- how same-item source versions should preserve history when a part or assembly updates later
- where `Catalog-Gen2-5` can safely consume complete starting assemblies

Do not use it for:
- STEP loader fidelity or unit detection
- deriving GLB previews or mesh fallbacks
- builder load runtime
- compatibility verdicts
- treating loose parts as complete starting assemblies

## Doc Body

### Family Phase Goal

`Catalog-Gen2-4.5` should make repo-backed XR and ADV file intake explicit enough that Catalog can consume supplied assets without guessing from paths or duplicating items by file type.

The first concrete handoff is `pubwheel_1`, an XR full assembly supplied as two 3D files:
- `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step`, `73126597` bytes
- `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb`, `79230220` bytes

Those files came from the same original staging pair:
- `C:\Users\Rubbe\Desktop\ParaHookConfig\20\3d models\Assembly_XR_Pubwheel_1.step`
- `C:\Users\Rubbe\Desktop\ParaHookConfig\20\3d models\Assembly_XR_Pubwheel_1.glb`

They are the same Catalog item and the same source version. The STEP is the preferred CAD/source variant. The GLB is a companion runtime mesh, preview, or fallback variant for later owners. They should not become two item cards.

### Boundary Rules

- Keep item identity separate from file variants.
- Keep source versions separate from file formats.
- Treat `pubwheel_1` version 1 as one source-version set with multiple file variants.
- Preserve older source versions when a later update arrives.
- Do not use the folder path as the only source of truth for platform, system, part type, part group, item role, or source version.
- Do not enable heavy STEP preview or starting-configuration load in this family phase.
- Do not make GLB preview/fallback behavior available until a later owner wires it intentionally.
- Keep Import-5 responsible for STEP units, tessellation, B-Rep/mesh truth, large-file progress, parse reuse, and loader fidelity.

### Current Live Read

Current Catalog source shape has a useful planned source bridge:
- `sourceKind: 'planned'`
- `sourceAssetPath`
- `sourceAssetFormat`
- `sourceFileSizeBytes`
- `sourceStatus: 'known-heavy-source'`

Current XR starting assembly seed uses the transitional planned source bridge:
- primary `sourceAssetPath`: `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step`
- source format: `step-or-stp`
- source file size: `73126597`
- source status: `known-heavy-source`

After Phase 2, the same live seed also carries the accepted `sourceAssetSet`:
- item id: `starting-assembly:xr-pubwheel-1-planned`
- source identity: `pubwheel_1`
- source version: `v1`
- source version status: current
- file variants:
  - source CAD: STEP, `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step`, `73126597` bytes
  - companion mesh: GLB, `Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb`, `79230220` bytes
- later updates: `v2`, `v3`, and so on, without deleting the old version read

The existing companion mesh metadata rows remain as compatibility read copy, but the source-version/file-variant truth now lives in `sourceAssetSet`.

### Acceptance Read

This family phase is complete when:
- repo-backed XR/ADV file intake has a clear folder and metadata convention
- one logical Catalog item can reference multiple 3D file variants
- same-item source versions can record history instead of overwriting old files silently
- the existing XR PubWheel 1 planned starting assembly no longer depends on ad hoc companion metadata for its GLB file
- `Catalog-Gen2-5` can consume complete assembly-ready items without losing item/version/file-variant truth

## Wishlist Organization

### High Level Goals

- [ ] `Catalog-Gen2-HLG-2. grow toward structured source metadata and external catalog integration without weakening the Generation 1 ownership split`
- [ ] `Catalog-Gen2-HLG-3. map PubParts source data into the Generation 1 Catalog systems, platforms, part groups, and metadata instead of letting PubParts define ParaHook runtime truth`
- [x] `Catalog-Gen2-HLG-5. let repo-backed XR and ADV asset batches enter Catalog through a clear folder and metadata intake plan before they are used as loose parts or starting assemblies`
- [x] `Catalog-Gen2-HLG-6. let one logical Catalog item keep multiple 3D file variants and source versions together so STEP, GLB, preview, and later updated files do not become duplicate items or overwrite history`

### Codex Level Goals

- [ ] Catalog-Gen2-CLG-3. Map PubParts platform and part-type language into ParaHook-owned platform families, systems, part groups, and item metadata.
- [ ] Catalog-Gen2-CLG-6. Organize external parts by real system ownership such as Platform, Wheel, and later Power or Fasteners.
- [x] Catalog-Gen2-CLG-9. Define the repo-backed XR/ADV asset folder convention, asset classification intake, and seed-metadata handoff before loose parts or full assemblies are added to live Catalog entries.
- [x] Catalog-Gen2-CLG-10. Define versioned multi-file source asset sets so one Catalog item can associate STEP, GLB, preview, fallback, and future update files without becoming duplicate cards or losing older source history.

### `Catalog-Gen2-4.5 / Phase 1`

- [x] Prep the exact source-version and file-variant contract inside this doc.
- [x] Decide whether the contract belongs on planned source records only first, or on a reusable source asset set that repo/external/planned records can grow toward later.
- [x] Preserve `sourceKind: 'planned'` as non-previewable source truth.
- [x] Require at least one preferred source file variant when a starting assembly claims known source truth.
- [x] Require same-item source version metadata for `pubwheel_1`.
- [x] Keep GLB as a companion variant, not a duplicate item.
- [x] Keep heavy preview/load, Import-5 loader fidelity, and builder load behavior out of scope.
- [x] `Catalog-Gen2-HLG-6`
- [x] Catalog-Gen2-CLG-10.

### `Catalog-Gen2-4.5 / Phase 2`

- [x] Migrate `XR PubWheel Assembly 1` from one-off companion metadata into the accepted versioned multi-file source set.
- [x] Preserve the existing copied STEP and GLB repo paths.
- [x] Preserve the disabled/planned no-preview behavior.
- [x] Add tests proving `pubwheel_1` is one item with two file variants, not two cards.
- [x] Keep `ADV Full Assembly` valid under the new contract with its single known STEP source variant.
- [x] `Catalog-Gen2-HLG-5`
- [x] `Catalog-Gen2-HLG-6`
- [x] Catalog-Gen2-CLG-9.
- [x] Catalog-Gen2-CLG-10.

### `Catalog-Gen2-4.5 / Phase 3`

- [x] Close the repo-backed XR/ADV folder-convention read for current supplied assets.
- [x] Decide whether more loose XR/ADV file intake phases are needed before Gen2 completion.
- [x] Hand the accepted source-version model back to `Catalog-Gen2-5` before starting-configuration handoff work resumes.
- [x] `Catalog-Gen2-HLG-5`
- [x] `Catalog-Gen2-HLG-6`
- [x] Catalog-Gen2-CLG-9.
- [x] Catalog-Gen2-CLG-10.

## [x] `Catalog-Gen2-4.5 / Phase 1` - `Versioned Multi-File Asset Set Contract`

### Phase 1 Summary

#### Purpose

Define the smallest implementation-ready contract for one Catalog item to reference multiple 3D file variants under one source version.

#### Owns

- source-version identity for supplied repo-backed assets
- file-variant metadata for STEP, GLB, preview, fallback, or later generated files
- the rule that file variants do not create duplicate Catalog cards
- a migration path from the current `sourceAssetPath` plus companion metadata bridge

#### Does Not Own

- moving more files
- generating preview assets
- heavy STEP preview or GLB fallback runtime
- load-as-starting-configuration
- Import-5 loader behavior
- compatibility validation

### Phase 1 Implementation Spec

Implement the first contract/read seam for versioned multi-file source assets.

The implementation should add a reusable source asset-set shape to `src/app/catalog/catalogItemContract.ts`, but attach it only to the planned source branch in this phase. That gives the current `planned` lane enough structure for the supplied XR handoff without weakening `repo.assetPath`, imports reuse, or external PubParts source truth. Repo and external sources can grow toward the same asset-set model later only after a narrower phase owns that migration.

Recommended contract names and fields:

```ts
export type CatalogSourceAssetVariantRole =
  | 'preferred-source'
  | 'companion-mesh'
  | 'preview-candidate'
  | 'fallback'

export type CatalogSourceAssetVariantFormat = 'step' | 'stp' | 'glb' | 'obj' | 'stl'

export type CatalogSourceAssetVariant = {
  variantId: string
  role: CatalogSourceAssetVariantRole
  format: CatalogSourceAssetVariantFormat
  sourcePath: string
  fileSizeBytes?: number | null
  label?: string
}

export type CatalogSourceVersionStatus = 'current' | 'archived'

export type CatalogSourceVersion = {
  versionId: string
  versionLabel: string
  status: CatalogSourceVersionStatus
  variants: CatalogSourceAssetVariant[]
  notes?: string[]
}

export type CatalogSourceAssetSet = {
  sourceId: string
  currentVersionId: string
  versions: CatalogSourceVersion[]
}
```

Add `sourceAssetSet?: CatalogSourceAssetSet` to `CatalogPlannedItemSource`. Do not add seed pass-through or live seed data in Phase 1. Keep the existing planned fields (`sourceAssetPath`, `sourceAssetFormat`, `sourceFileSizeBytes`, `sourceStatus`) as the transitional single-source bridge so the accepted ADV and XR planned sources do not break and so old planned-source UI rows remain stable while the asset-set read rolls out.

Phase 1 should define the structured source asset-set shape and prove it with a test fixture that represents the current XR handoff. The live `starting-assembly:xr-pubwheel-1-planned` seed should keep using the legacy bridge fields until `Catalog-Gen2-4.5 / Phase 2` migrates the seed into the accepted contract.

The required `pubwheel_1` fixture shape is:
- source item represented by fixture: `starting-assembly:xr-pubwheel-1-planned`
- source identity: `pubwheel_1`
- current version: `v1`
- version label: `Version 1`
- version status: `current`
- preferred source variant:
  - `variantId: 'pubwheel_1:v1:step-source'`
  - `role: 'preferred-source'`
  - `format: 'step'`
  - `sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step'`
  - `fileSizeBytes: 73126597`
- companion mesh variant:
  - `variantId: 'pubwheel_1:v1:glb-companion'`
  - `role: 'companion-mesh'`
  - `format: 'glb'`
  - `sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb'`
  - `fileSizeBytes: 79230220`

Do not add a live `sourceAssetSet` to the existing ADV planned seed in Phase 1 unless Manager revises the phase. Keep ADV on the accepted single-source planned bridge until Phase 2 or a later migration/audit phase owns live seed conversion. Phase 1 is allowed to add only the optional contract field and pure helper/read behavior needed for implementation tests.

Implementation owners:
- `src/app/catalog/catalogItemContract.ts` owns the exported asset-set types and optional planned-source field.
- `src/app/catalog/catalogSeedItems.ts` remains untouched in Phase 1; live XR `pubwheel_1` seed data migration remains Phase 2.
- `src/app/catalog/catalogSource.ts` remains behavior-stable in Phase 1 unless a fixture-only test seam proves otherwise.
- `src/app/catalog/ui/catalogShellShared.ts` owns any source-detail helper rows for asset sets.
- `src/app/catalog/ui/CatalogShellItemPage.tsx` should only change if helper rows need explicit rendering beyond the existing source-details area.

UI/read rules:
- planned source remains non-previewable; `resolveCatalogRepoReferencePreviewSource(...)` must still return `null` for planned items.
- no heavy STEP preview, GLB preview/fallback runtime, Import-5 loader fidelity, or builder load behavior ships.
- source details may show metadata-only rows such as `Source Identity`, `Current Source Version`, `Preferred Source Variant`, and `Companion Mesh Variant`.
- those rows must not be links, buttons, preview actions, or repo asset paths.
- GLB stays a companion mesh / later preview or fallback candidate, not a separate Catalog card and not an enabled preview source.

Focused tests should prove:
- `CatalogPlannedItemSource` can carry `sourceAssetSet` while still forbidding a local `assetPath`.
- a planned-source fixture can carry `sourceAssetSet.sourceId === 'pubwheel_1'` and `currentVersionId === 'v1'`.
- `pubwheel_1` version `v1` carries exactly the STEP preferred-source variant and GLB companion-mesh variant listed above.
- the existing live `getCatalogPlannedStartingAssemblyItems()` read still returns one `XR PubWheel Assembly 1` item and does not create one item per file before Phase 2 migration.
- the existing live `sourceAssetPath` remains the STEP source bridge during the transition.
- planned entries still do not resolve repo preview sources and still receive disabled/planned action behavior.
- source-detail helpers render asset-set rows without `Repo Asset Path`, download, import, or preview wording.
- a test fixture can represent a later version such as `v2` without overwriting the `v1` shape, even if no live `v2` file exists yet.
- no GT, Pint, or XR Classic placeholders are introduced.
- external PubParts entries do not become starting assemblies and do not gain source asset sets in this phase.

Verification should include:

```powershell
npm.cmd test -- src/app/catalog/catalogItemContract.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/workspace/CatalogSurface.test.tsx
```

Then:

```powershell
npm.cmd run build
```

Tracking requirements:
- update `docs/CHANGELOG.md` for implementation changes
- update this family phase doc, `Catalog-Gen2-Index.md`, `Catalog-Gen2-5` if the bridge wording changes, and `docs/Doc-Log.md`

### Phase 1 Implementation Closeout

Phase 1 is complete.

Completed:
- `CatalogPlannedItemSource` now accepts optional `sourceAssetSet?: CatalogSourceAssetSet` while preserving `assetPath?: never`.
- Catalog now exports source asset variant, source version, and source asset set contract types.
- `catalogShellShared` now has metadata-only source asset-set detail rows for planned source fixtures.
- focused tests prove `pubwheel_1` / `v1` can carry the STEP preferred-source variant and GLB companion-mesh variant without becoming two cards.
- focused tests prove the live XR planned seed remains on the existing `sourceAssetPath` bridge until Phase 2 migrates it.
- planned source entries remain non-previewable and keep disabled/planned action behavior.

Not completed here:
- live `XR PubWheel Assembly 1` seed migration to `sourceAssetSet`; that remains `Catalog-Gen2-4.5 / Phase 2`.
- repo/external source asset-set support.
- heavy STEP preview, GLB preview/fallback runtime, Import-5 loader fidelity, builder load, compatibility verdicts, or platform placeholders.

Next Worker prep target:
- `Catalog-Gen2-4.5 / Phase 2 - XR PubWheel 1 Asset Set Migration`

## [x] `Catalog-Gen2-4.5 / Phase 2` - `XR PubWheel 1 Asset Set Migration`

### Phase 2 Summary

#### Purpose

Apply the accepted Phase 1 contract to the already-copied XR PubWheel 1 STEP/GLB files.

#### Owns

- `pubwheel_1` same-item identity
- source version `v1`
- STEP source variant
- GLB companion mesh variant
- focused tests that the XR entry remains one Catalog item

#### Does Not Own

- preview generation
- loader fidelity
- builder runtime
- new platform placeholder assemblies

### Phase 2 Implementation Spec

Implement Phase 2 as a narrow live-seed migration for `XR PubWheel Assembly 1`.

Decision:
- add `sourceAssetSet` to the existing planned XR seed and pass it through to the planned `CatalogItemRecord`
- preserve the existing bridge fields for compatibility:
  - `sourceAssetPath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step'`
  - `sourceAssetFormat: 'step-or-stp'`
  - `sourceFileSizeBytes: 73126597`
  - `sourceStatus: 'known-heavy-source'`
- keep the existing companion mesh metadata rows for this phase so current source details remain stable while `sourceAssetSet` becomes the structured source truth
- leave `ADV Full Assembly` bridge-only in Phase 2; it has one known heavy STEP source and does not need the XR multi-file migration to stay valid

Implementation owner files:
- `src/app/catalog/catalogSeedItems.ts`
  - import/use `CatalogSourceAssetSet` as a type
  - add optional `sourceAssetSet?: CatalogSourceAssetSet` to `CatalogPlannedStartingAssemblySeedItem`
  - add `sourceAssetSet` only to `XR PubWheel Assembly 1`
- `src/app/catalog/catalogSource.ts`
  - pass `seedItem.sourceAssetSet` through to the planned source branch only when present
  - do not add `sourceAssetSet: undefined` to ADV or other planned source objects if existing object-shape tests depend on absence
- `src/app/catalog/ui/catalogShellShared.ts`
  - no new helper expected; existing Phase 1 source-asset-set detail rows should read the migrated XR seed after pass-through
- focused tests in `catalogSource.test.ts`, `catalogShellShared.test.ts`, and existing contract/action/surface tests as needed

Required `sourceAssetSet` shape for `XR PubWheel Assembly 1`:

```ts
sourceAssetSet: {
  sourceId: 'pubwheel_1',
  currentVersionId: 'v1',
  versions: [
    {
      versionId: 'v1',
      versionLabel: 'Version 1',
      status: 'current',
      variants: [
        {
          variantId: 'pubwheel_1:v1:step-source',
          role: 'preferred-source',
          format: 'step',
          sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step',
          fileSizeBytes: 73126597,
        },
        {
          variantId: 'pubwheel_1:v1:glb-companion',
          role: 'companion-mesh',
          format: 'glb',
          sourcePath: 'Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb',
          fileSizeBytes: 79230220,
        },
      ],
    },
  ],
}
```

Acceptance checks:
- `getCatalogPlannedStartingAssemblyItems()` still returns exactly one XR planned item for `XR PubWheel Assembly 1`, not one item per file variant.
- the XR planned item includes `source.sourceAssetSet.sourceId === 'pubwheel_1'` and `currentVersionId === 'v1'`.
- the XR `v1` source version includes exactly two variants: the STEP preferred-source variant and the GLB companion-mesh variant listed above.
- the XR bridge fields remain present for compatibility.
- the XR source-detail rows include the asset-set read and still do not show `Repo Asset Path`, download, import, preview, or builder-load language.
- planned XR remains non-previewable: `resolveCatalogRepoReferencePreviewSource(plannedXrItem) === null`.
- planned XR action behavior remains disabled/planned, with no temporary preview, add-to-project, import, or builder handoff.
- ADV remains bridge-only and valid as a planned heavy STEP source in this phase.
- no GT, Pint, or XR Classic placeholders are introduced.
- external PubParts entries do not become starting assemblies and do not gain source asset sets.

Verification should include:

```powershell
npm.cmd test -- src/app/catalog/catalogItemContract.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/workspace/CatalogSurface.test.tsx
```

Then:

```powershell
npm.cmd run build
```

Tracking requirements:
- update `docs/CHANGELOG.md` because implementation changes live Catalog source/runtime behavior
- update this family phase doc, `Catalog-Gen2-Index.md`, and `docs/Doc-Log.md`

Boundaries:
- no heavy STEP preview
- no GLB preview/fallback runtime
- no Import-5 STEP loader fidelity, tessellation, unit, progress, parse reuse, or large-file behavior
- no builder load or starting-configuration runtime
- no compatibility verdicts
- no file moves/copies
- no repo-backed preview `assetPath` for planned source items
- no new platform placeholder assemblies

### Phase 2 Implementation Closeout

Phase 2 is complete.

Completed:
- `CatalogPlannedStartingAssemblySeedItem` now accepts optional `sourceAssetSet?: CatalogSourceAssetSet`.
- the live `XR PubWheel Assembly 1` planned seed now carries `sourceAssetSet.sourceId === 'pubwheel_1'` and `currentVersionId === 'v1'`.
- `pubwheel_1` version `v1` carries exactly one STEP preferred-source variant and one GLB companion-mesh variant.
- the existing XR bridge fields (`sourceAssetPath`, `sourceAssetFormat`, `sourceFileSizeBytes`, and `sourceStatus`) remain present for compatibility.
- the live source snapshot still exposes one XR planned Catalog item, not one card per file variant.
- `ADV Full Assembly` remains bridge-only and does not emit `sourceAssetSet: undefined`.
- planned starting assemblies remain non-previewable and keep disabled/planned action behavior.

Verified:
- `npm.cmd test -- src/app/catalog/catalogItemContract.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/workspace/CatalogSurface.test.tsx` passed with 65 tests.
- `npm.cmd run build` passed with the existing Vite/OCCT externalization and chunk-size warnings.

Not completed here:
- closing the broader XR/ADV folder-convention read.
- deciding whether more loose XR/ADV intake phases are needed.
- handing the accepted source-version model back to `Catalog-Gen2-5`.
- heavy STEP preview, GLB preview/fallback runtime, Import-5 loader fidelity, builder load, compatibility verdicts, or platform placeholders.

Next Worker prep target:
- `Catalog-Gen2-4.5 / Phase 3 - Asset Folder Convention Closeout And Starting Assembly Handoff`

## [x] `Catalog-Gen2-4.5 / Phase 3` - `Asset Folder Convention Closeout And Starting Assembly Handoff`

### Phase 3 Summary

#### Purpose

Close the current XR/ADV repo-backed asset intake read and hand the source-version model back to `Catalog-Gen2-5`.

#### Owns

- folder-convention closeout for the current supplied files
- deciding whether more loose XR/ADV asset intake phases are required
- setting the next starting assembly phase target

#### Does Not Own

- builder load runtime
- compatibility validation
- import loader fidelity

### Phase 3 Implementation Spec

Implement Phase 3 as a docs/test closeout audit unless verification exposes a concrete source or tracking regression.

Phase 3 should not add runtime code by default. Phase 1 and Phase 2 already implemented the required current-file runtime shape:
- `CatalogSourceAssetSet` exists for planned source records.
- `XR PubWheel Assembly 1` now carries `sourceAssetSet.sourceId === 'pubwheel_1'`.
- `pubwheel_1` current version `v1` carries the STEP preferred-source variant and GLB companion-mesh variant.
- the XR planned seed remains one Catalog item/card.
- planned XR and ADV entries remain non-previewable and disabled/planned.

Closeout audit findings to record during implementation:
- current repo-backed Catalog assembly files under `public/Catalog/assemblies/` are exactly:
  - `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step`, `73126597` bytes
  - `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb`, `79230220` bytes
- no current `public/Catalog/parts/xr/`, `public/Catalog/parts/adv/`, or `public/Catalog/assemblies/adv/` source files are present to classify in this phase.
- original staging files remain outside the repo Catalog lane in `C:\Users\Rubbe\Desktop\ParaHookConfig\20\3d models\`, including the XR pair, ADV STEP/GLB candidates, `hub.step`, `pubwheel v6.obj`/`.mtl`, and shoe files.
- because those staging files are not currently placed under the Catalog folder convention, Phase 3 should not move them, seed them, classify them as loose Catalog parts, or convert them into starting assemblies.
- the ADV planned Catalog entry remains a verified heavy STEP source candidate on the planned bridge, not a completed asset-set migration.
- no more loose XR/ADV asset classification is needed before handing the current accepted source-version model back to `Catalog-Gen2-5`.

Recommended implementation work:
- run the focused Catalog verification command below.
- if verification passes, mark Phase 3 checklist items complete.
- mark `Catalog-Gen2-HLG-5` complete for the current supplied repo-backed asset batch only if the closeout wording stays scoped to current supplied files and folder-convention truth.
- keep broader `Catalog-Gen2-HLG-2`, `Catalog-Gen2-HLG-3`, `Catalog-Gen2-CLG-3`, and `Catalog-Gen2-CLG-6` open because they are broader external/source organization goals already owned by other Gen2 family phases.
- mark `Catalog-Gen2-CLG-9` complete if the index wording records that the current XR/ADV folder convention, asset classification read, and seed-metadata handoff are complete for current supplied files, not for arbitrary future user asset batches.
- leave no `Phase 3.1` unless verification finds unhandled Catalog-folder assets or stale source-truth docs that need a separate repair.
- update `Catalog-Gen2-Index.md` to close `Catalog-Gen2-4.5` honestly and set the next Worker prep target to `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State`.
- update `docs/Doc-Log.md`.
- do not update `docs/CHANGELOG.md` unless runtime/source code changes.

Verification should include:

```powershell
npm.cmd test -- src/app/catalog/catalogItemContract.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/workspace/CatalogSurface.test.tsx
```

Then:

```powershell
npm.cmd run build
```

Acceptance checks:
- focused tests still prove XR is one planned Catalog item with `pubwheel_1` / `v1`, STEP preferred-source, and GLB companion-mesh variants.
- focused tests still prove planned ADV remains bridge-only and non-previewable.
- focused tests still prove planned entries do not resolve repo preview sources and remain disabled/planned.
- build passes with no new runtime implementation.
- docs/index closeout states that `Catalog-Gen2-4.5` is complete for current supplied files only.
- next target is `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State`.

Boundaries:
- no source/runtime implementation unless verification exposes a real regression
- no file moves/copies
- no heavy STEP preview
- no GLB preview/fallback runtime
- no Import-5 STEP loader fidelity, units, tessellation, progress, parse reuse, or loader params
- no builder load or starting-configuration runtime
- no compatibility verdicts
- no new planned placeholders
- no loose-part classification for staging files that are not under the Catalog folder convention

### Phase 3 Implementation Closeout

Phase 3 is complete as a docs/test closeout audit.

Completed:
- confirmed the current copied Catalog XR/ADV assembly intake consists only of:
  - `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.step`, `73126597` bytes
  - `public/Catalog/assemblies/xr/Assembly_XR_Pubwheel_1.glb`, `79230220` bytes
- confirmed original staging files remain outside the repo Catalog lane at `C:\Users\Rubbe\Desktop\ParaHookConfig\20\3d models\`.
- confirmed no additional loose XR/ADV Catalog asset classification is required for the current copied files.
- left `ADV3.glb`, `ADV3.step`, `ADV_Full Assembly_parts.step`, `hub.step`, `pubwheel v6.obj`/`.mtl`, and shoe files unmodified and unclassified because they are not in the Catalog folder convention.
- confirmed Phase 1 and Phase 2 already provide the current source-version/file-variant handoff for `pubwheel_1`.
- closed `Catalog-Gen2-4.5` for current supplied files only.

Verified:
- `npm.cmd test -- src/app/catalog/catalogItemContract.test.ts src/app/catalog/catalogSource.test.ts src/app/catalog/ui/catalogShellShared.test.ts src/app/catalog/catalogActionPlan.test.ts src/app/workspace/CatalogSurface.test.tsx` passed with 65 tests.
- `npm.cmd run build` passed with the existing Vite/OCCT externalization and chunk-size warnings.

Not completed here:
- moving or classifying staging-folder files outside the Catalog lane.
- additional loose XR/ADV part intake.
- ADV asset-set migration.
- heavy STEP preview, GLB preview/fallback runtime, Import-5 loader fidelity, builder load, compatibility verdicts, or platform placeholders.

Next Worker prep target:
- `Catalog-Gen2-5 / Phase 3 - Starting Configuration Handoff State`

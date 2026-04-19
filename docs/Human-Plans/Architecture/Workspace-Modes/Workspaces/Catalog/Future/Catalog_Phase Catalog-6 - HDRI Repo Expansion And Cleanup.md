# [x] `Catalog-6` - `HDRI Repo Expansion And Cleanup`

## Doc Header

### Doc History
4. 2026-04-18 23:05:00: Closed the `Catalog-6` implementation loop after wiring repo HDRI/EXR Catalog entries, local browse/apply, viewer-owned HDRI state, applied background/intensity controls, thumbnail cards, and lightweight environment preview boxes
3. 2026-04-18 22:30:00: Reworked `Catalog-6` into the same family-phase doc shape as the stronger Catalog future plans, adding `Doc Body`, `Wishlist Organization`, and dedicated `Catalog-6.1` through `Catalog-6.6` phase sections so the HDRI lane can run as a clean Codex-sized loop instead of reading like a compact mini index
2. 2026-04-18 21:58:00: Expanded `Catalog-6` into the current child-cut ladder from the Catalog index, replacing the older three broad internal phases with `Catalog-6.1` through `Catalog-6.6` for repo HDRI inventory, real HDRI/EXR apply identity, local browse/apply, applied controls, thumbnails, and simple applied preview boxes
1. 2026-04-18 14:58:04: Added this standalone `Catalog-6` future doc as one Generation 1 cleanup follow-on so the Catalog family can onboard the full live repo HDRI inventory into the app, clean up the earlier single-HDRI baseline, and keep the HDRI family honest before the Catalog family moves on to later Generation 2 widening

### Purpose

This doc defines the `Catalog-6` HDRI repo-expansion and cleanup lane for `Generation 1`.

Use it to answer:
- how every current repo HDRI under `public/HDRI` becomes an honest Catalog environment item
- how Catalog keeps `.hdr` and `.exr` identity visible instead of treating HDRI choices like preset-only labels
- how local HDRI/EXR browse and apply should land without becoming Browser/project geometry
- how the first basic applied-environment controls fit into the Catalog HDRI lane
- how HDRI thumbnails and preview boxes should read differently from reference preview boxes

### Why This Phase Exists

`Catalog-3` proved the first explicit HDRI/environment apply path, but that was still too close to a single baseline item.

The app now needs the full repo HDRI family to read like real Catalog content:
- repo-backed environment files should appear as Catalog cards
- `.hdr` and `.exr` should be treated as real environment assets
- applying an HDRI should remain viewer/environment state
- the user should also be able to browse for a local HDRI or EXR file and apply it to the scene
- HDRI cards should become visually scannable through thumbnails and simple applied-environment previews

This doc exists so the HDRI cleanup can run through one explicit family lane instead of leaking into the earlier reference-family, Browser, or generic environment plans.

### Scope

This doc covers:
- the current repo HDRI inventory under `public/HDRI`
- app-facing Catalog environment item records for repo HDRIs and EXRs
- local user-selected `.hdr` and `.exr` browse/apply behavior
- basic applied HDRI/EXR controls
- HDRI thumbnails and simple applied preview boxes
- the family cleanup needed to stop reading HDRI as a single placeholder baseline

This doc does not cover:
- reference-family `Add To Project` behavior
- Browser collection creation for references
- PubParts or external marketplace source intake
- full lighting-preset authoring
- tone mapping, render-pipeline redesign, or advanced environment editing
- final project recall or rebind semantics for catalog-loaded assets

## Doc Body

### Goal

Turn the HDRI Catalog lane from a single baseline environment proof into a real repo-backed HDRI family where users can browse current repo HDRIs, apply real `.hdr` or `.exr` files, browse for local HDRI/EXR files, adjust basic applied environment state, and scan HDRI cards through honest visual previews.

### Boundaries

This phase should:
- list every current `.hdr` and `.exr` file under `public/HDRI`
- keep HDRI and EXR entries under Catalog environment ownership
- make `Apply Environment` carry real asset identity
- add a local `Browse` path for user-selected `.hdr` and `.exr` files
- keep applied HDRI/EXR state separate from Browser/project geometry
- expose only the first basic controls: background visibility and intensity
- make thumbnails and preview boxes browse aids, not the environment source of truth

This phase should not:
- create Browser collections or project geometry when applying an HDRI/EXR
- reopen reference-family commit behavior
- widen into PubParts or external catalog integration
- redesign the full environment/render pipeline
- make thumbnail generation a blocker for honest HDRI item listing
- pretend HDRI preview boxes are geometry/reference previews

### Architecture Direction

The healthy ownership read for `Catalog-6` is:
- `Catalog` owns browse, card identity, family grouping, and explicit environment action routing
- viewer/environment state owns the currently applied HDRI or EXR
- Browser/project content owns reference geometry, not HDRI environment state
- local browsed HDRI/EXR files should be applied as environment state without becoming reference items

The healthy product read is:
- the user can see all repo HDRIs as Catalog cards
- the user can distinguish repo-backed HDRI/EXR cards from locally browsed files
- the user can press `Apply Environment` and get the chosen real HDRI/EXR in the scene
- the user can press `Browse` and choose a local `.hdr` or `.exr`
- the user can turn the applied background on/off and adjust intensity
- the user can visually scan HDRI choices through thumbnails and simple preview boxes

### Current Live Read

The current live repo HDRI inventory is:
- `citrus_orchard_road_puresky_2k.exr`
- `docklands_02_2k.hdr`
- `rogland_clear_night_2k.hdr`
- `studio_small_09_2k.exr`
- `studio_small_09_2k.hdr`

Likely nearby owners:

- `public/HDRI/`
  - owns the repo-backed HDRI/EXR source files this phase must list honestly
- `src/app/catalog/catalogSeedItems.ts`
  - likely owns the first authored Catalog item records for repo-backed HDRI entries
- `src/app/catalog/catalogItemContract.ts`
  - likely owns asset kind, action kind, preview metadata, and source identity shape
- `src/app/catalog/catalogEnvironmentApply.ts`
  - already provides the narrow Catalog-to-viewer environment apply seam from earlier foundation work
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - likely owns card-level HDRI thumbnail and preview-box presentation
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - likely owns the larger HDRI detail and action surface
- `src/app/stores/useUiPrefsStore.ts`
  - likely owns applied viewer environment state
- `src/app/workspace/CatalogSurface.test.tsx`
  - likely owns the user-facing Catalog proof for apply and browse behavior

### Acceptance Read

`Catalog-6` is healthy when:
- every current repo HDRI/EXR is represented as an honest Catalog environment item
- `Apply Environment` uses the chosen item identity instead of falling back to a vague preset read
- local `Browse` can select an HDRI/EXR and apply it to the scene without creating Browser/project geometry
- background visibility and intensity are available for applied HDRI/EXR state
- HDRI cards have honest thumbnail or missing-thumbnail states
- HDRI preview boxes read as simple applied-environment previews

## Wishlist Organization

### High Level Goals

- [x] `HLG 1. Surface The Full Current Repo HDRI Inventory In The App`
- [x] `HLG 2. Keep HDRI And EXR Apply Behavior Tied To Real Environment Asset Identity`
- [x] `HLG 3. Let Users Browse For A Local HDRI Or EXR And Apply It To The Scene`
- [x] `HLG 4. Give Users Basic Controls Over Applied HDRI Or EXR State`
- [x] `HLG 5. Make HDRI Cards Visually Scannable With Thumbnails And Simple Applied Preview Boxes`
- [x] `HLG 6. Keep The Catalog HDRI Family Honest After The Repo Expansion`

### `Catalog-6.1`

- [x] `1. Every Repo HDRI And EXR File Has An App-Facing Catalog Environment Record`
- [x] `2. Repo HDRI Labels, Slugs, And Source Paths Are Stable Enough For Later Apply And Preview Work`
- [x] `3. HDRI Records Leave Room For Thumbnail And Preview-box Metadata Without Requiring It Yet`
- [x] `HLG 1. Surface The Full Current Repo HDRI Inventory In The App`
- [x] `HLG 6. Keep The Catalog HDRI Family Honest After The Repo Expansion`

### `Catalog-6.2`

- [x] `4. Apply Environment Carries Real HDRI Or EXR Asset Identity`
- [x] `5. Repo HDRI Apply Stays Viewer/environment-owned Instead Of Browser/project-owned`
- [x] `6. The Earlier Environment Apply Proof Widens From Preset-like Entries To Real Files`
- [x] `HLG 2. Keep HDRI And EXR Apply Behavior Tied To Real Environment Asset Identity`
- [x] `HLG 6. Keep The Catalog HDRI Family Honest After The Repo Expansion`

### `Catalog-6.3`

- [x] `7. The Catalog HDRI Surface Includes A Local HDRI Or EXR Browse Action`
- [x] `8. A User-selected HDRI Or EXR Applies To The Scene Through Viewer/environment Ownership`
- [x] `9. Browsed HDRI Or EXR Files Do Not Create Browser/project Geometry`
- [x] `HLG 3. Let Users Browse For A Local HDRI Or EXR And Apply It To The Scene`

### `Catalog-6.4`

- [x] `10. Applied HDRI Or EXR State Has A Background Visibility Control`
- [x] `11. Applied HDRI Or EXR State Has An Intensity Control`
- [x] `12. The Controls Stay Attached To Viewer/environment State Instead Of Catalog Card State`
- [x] `HLG 4. Give Users Basic Controls Over Applied HDRI Or EXR State`

### `Catalog-6.5`

- [x] `13. HDRI And EXR Cards Show Image Thumbnails When Thumbnail Media Exists Or Can Be Generated`
- [x] `14. Missing Thumbnail States Stay Honest And Stable`
- [x] `15. Thumbnail Media Stays A Browse Aid Instead Of The Environment Source Of Truth`
- [x] `HLG 5. Make HDRI Cards Visually Scannable With Thumbnails And Simple Applied Preview Boxes`

### `Catalog-6.6`

- [x] `16. HDRI Preview Boxes Render As Simple Applied-environment Previews`
- [x] `17. Preview Boxes Do Not Change The Live Scene Environment`
- [x] `18. HDRI Preview Boxes Do Not Reuse Geometry/reference Preview Meaning`
- [x] `HLG 5. Make HDRI Cards Visually Scannable With Thumbnails And Simple Applied Preview Boxes`
- [x] `HLG 6. Keep The Catalog HDRI Family Honest After The Repo Expansion`

## [x] `Catalog-6.1` - `Repo HDRI Inventory And Catalog Item Records`

### Phase 6.1 Summary
#### Purpose

Turn the live repo HDRI folder into explicit Catalog environment item records.

#### Owns

- confirming the live `public/HDRI` inventory
- adding one app-facing Catalog record per current `.hdr` or `.exr`
- stable item labels, ids/slugs, source paths, and environment family metadata
- keeping the item record shape ready for later apply, thumbnail, and preview-box phases

#### Does Not Own

- runtime apply behavior
- local file browsing
- background or intensity controls
- thumbnail generation
- rendered HDRI preview boxes

#### Current Live Read

Current repo inventory:
- `citrus_orchard_road_puresky_2k.exr`
- `docklands_02_2k.hdr`
- `rogland_clear_night_2k.hdr`
- `studio_small_09_2k.exr`
- `studio_small_09_2k.hdr`

The first cut should make these visible as Catalog environment items without pretending the later runtime work has already landed.

#### First Pass Decisions

- keep `.hdr` and `.exr` extension identity visible in the item source metadata
- use honest display labels that are readable without losing file traceability
- keep these entries under the HDRI/environment family
- preserve `Apply Environment` as the intended action kind, even if deeper real-file apply behavior lands in `Catalog-6.2`

### Phase 6.1 Implementation Spec
#### Exact First Code Cut

1. Confirm the current `public/HDRI` file list.
2. Add app-facing Catalog item records for each current HDRI/EXR.
3. Mark them as environment/HDRI family entries.
4. Store enough source identity for later real-file apply, thumbnail, and preview work.
5. Add focused source/catalog proof that all current repo files appear as Catalog records.

#### Likely Files

- `public/HDRI/`
- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogItemContract.ts`
- `src/app/catalog/catalogSource.test.ts`
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not implement local browse in this phase
- do not implement intensity/background controls in this phase
- do not require thumbnail generation in this phase
- do not change Browser/project reference ownership

#### Implementation Risks

- adding only labels without preserving real file identity
- treating `.hdr` and `.exr` as different product families instead of one HDRI/environment family with file-type metadata
- making this phase depend on thumbnail or preview-box work before records exist

#### Checklist

- [x] every current `public/HDRI` file has one Catalog item record
- [x] each record has stable source identity
- [x] each record is classified as environment/HDRI content
- [x] later apply, thumbnail, and preview phases have enough metadata to build on

#### Verification Shape

Minimum verification for this phase should cover:
- all current repo HDRI/EXR filenames appear in Catalog source output or UI proof
- HDRI/EXR records use environment action semantics
- no Browser/project reference content is created by listing these records

#### Done Shape

`Catalog-6.1` is done when every current repo HDRI/EXR is represented as an honest app-facing Catalog environment item record.

## [x] `Catalog-6.2` - `Real HDRI Or EXR Apply Contract`

### Phase 6.2 Summary
#### Purpose

Make `Apply Environment` carry the selected HDRI/EXR file identity through the viewer/environment owner instead of behaving like a vague preset selector.

#### Owns

- real-file environment apply request shape
- repo-backed HDRI/EXR apply identity
- handoff from Catalog item action to viewer/environment state
- proof that applying HDRI/EXR does not create Browser/project geometry

#### Does Not Own

- local file browse UI
- thumbnails
- preview boxes
- advanced lighting controls beyond the identity handoff

#### Current Live Read

The earlier `Catalog-1` environment apply proof established the ownership split. This phase widens that proof so the applied environment points at the real `.hdr` or `.exr` selected from the Catalog entry.

#### First Pass Decisions

- reuse the existing Catalog-to-viewer environment apply seam where possible
- preserve the `Apply Environment` action language
- keep applied state viewer/environment-owned
- make missing/unsupported file states explicit rather than silently falling back to a generic preset

### Phase 6.2 Implementation Spec
#### Exact First Code Cut

1. Resolve the selected Catalog HDRI/EXR item to a real environment asset request.
2. Route that request through the existing viewer/environment apply seam.
3. Store enough applied identity for the UI to show what is active.
4. Prove Browser/project geometry does not change when an HDRI/EXR is applied.

#### Likely Files

- `src/app/catalog/catalogEnvironmentApply.ts`
- `src/app/catalog/catalogActionPlan.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/stores/useUiPrefsStore.ts`
- `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not add local browse here
- do not add background/intensity controls here unless one tiny stored field is required for compatibility
- do not redesign the renderer
- do not route HDRI apply through reference commit helpers

#### Implementation Risks

- losing the selected file identity during handoff
- accidentally treating HDRI apply like `Add To Project`
- making repo-backed HDRI entries depend on local file selection behavior

#### Checklist

- [x] repo HDRI/EXR apply carries real file identity
- [x] viewer/environment state owns the applied environment
- [x] Browser/project geometry is untouched
- [x] the UI can identify the applied HDRI/EXR

#### Verification Shape

Minimum verification for this phase should cover:
- applying each supported repo HDRI/EXR updates viewer/environment state
- no imported reference or project geometry is created
- the applied state keeps selected asset identity

#### Done Shape

`Catalog-6.2` is done when repo-backed HDRI/EXR Catalog entries apply through viewer/environment ownership with real asset identity.

## [x] `Catalog-6.3` - `Local HDRI Or EXR Browse And Apply`

### Phase 6.3 Summary
#### Purpose

Let the user press `Browse`, choose a local `.hdr` or `.exr`, and apply it to the scene as environment state.

#### Owns

- local HDRI/EXR file selection entry point
- validating the selected file extension enough for the first user path
- applying the selected local file through viewer/environment ownership
- keeping browsed environment files out of Browser/project geometry

#### Does Not Own

- external catalog/provider integration
- persisting browsed files as reusable repo-backed Catalog records
- thumbnail generation for local files
- advanced import management

#### Current Live Read

This is a local user-selected environment path, not a PubParts or external catalog integration path. It should behave more like choosing an environment file than importing a reference model.

#### First Pass Decisions

- put `Browse` in the HDRI/environment Catalog surface, not the reference add path
- accept `.hdr` and `.exr` for the first pass
- apply through the same environment owner as repo-backed HDRIs
- keep any local-file display state clearly distinct from repo-backed Catalog inventory

### Phase 6.3 Implementation Spec
#### Exact First Code Cut

1. Add a visible `Browse` action for HDRI/EXR environment files.
2. Let the user select a local `.hdr` or `.exr`.
3. Convert the selected file into an environment apply request.
4. Apply it through viewer/environment state.
5. Prove no Browser/project geometry or reference collection is created.

#### Likely Files

- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/catalogEnvironmentApply.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/stores/useUiPrefsStore.ts`
- focused Catalog surface tests

#### No-Widening Rule

- do not build a general asset import pipeline here
- do not make local HDRI files into committed Browser references
- do not add external provider browsing
- do not require thumbnail generation before local apply works

#### Implementation Risks

- confusing local HDRI browse with reference import
- losing local file identity after apply
- creating persistent Catalog records for one-off local files too early

#### Checklist

- [x] user can browse for a local `.hdr`
- [x] user can browse for a local `.exr`
- [x] selected local file applies to viewer/environment state
- [x] no Browser/project geometry is created

#### Verification Shape

Minimum verification for this phase should cover:
- local `.hdr` apply path
- local `.exr` apply path
- rejected or ignored non-HDRI/EXR path if the UI allows selecting one
- no reference collection creation after local HDRI/EXR apply

#### Done Shape

`Catalog-6.3` is done when a user-selected local HDRI/EXR can be applied to the scene without becoming project geometry.

## [x] `Catalog-6.4` - `Applied HDRI Controls`

### Phase 6.4 Summary
#### Purpose

Expose first-pass controls for the currently applied HDRI/EXR state.

#### Owns

- background visibility on/off
- environment intensity
- tying controls to viewer/environment state
- showing the current applied HDRI/EXR control surface clearly

#### Does Not Own

- full lighting preset authoring
- tone mapping redesign
- per-card preview controls
- renderer overhaul

#### Current Live Read

Once HDRI/EXR apply is real, users need the first practical controls over the applied environment. The first useful set is intentionally small: background visibility and intensity.

#### First Pass Decisions

- control the active environment, not individual Catalog cards
- keep background visibility independent from whether the HDRI is still lighting the scene if the viewer supports that split
- use simple intensity control semantics first
- leave advanced exposure, rotation, and tone mapping to later environment work

### Phase 6.4 Implementation Spec
#### Exact First Code Cut

1. Add an applied HDRI/EXR control surface near the Catalog environment action or existing environment UI.
2. Add background visibility on/off for the current HDRI/EXR.
3. Add intensity control for the current HDRI/EXR.
4. Store and apply those values through viewer/environment state.
5. Prove controls affect environment state, not Browser/project geometry.

#### Likely Files

- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/stores/useUiPrefsStore.ts`
- `src/app/viewer/`
- focused UI and store tests

#### No-Widening Rule

- do not add a full lighting editor
- do not add HDRI rotation or advanced render controls here
- do not make controls per-card authored state
- do not reopen reference commit behavior

#### Implementation Risks

- storing controls in Catalog card state instead of applied environment state
- coupling background visibility to unrelated viewer background settings too broadly
- exposing controls before an applied environment exists without a clear empty state

#### Checklist

- [x] applied HDRI/EXR has background visibility control
- [x] applied HDRI/EXR has intensity control
- [x] controls update viewer/environment state
- [x] controls do not affect Browser/project geometry

#### Verification Shape

Minimum verification for this phase should cover:
- toggling background visibility
- changing intensity
- controls read the currently applied HDRI/EXR state
- controls have a stable no-applied-HDRI state

#### Done Shape

`Catalog-6.4` is done when users can turn the applied HDRI/EXR background on/off and adjust intensity through viewer/environment state.

## [x] `Catalog-6.5` - `HDRI Thumbnail Images`

### Phase 6.5 Summary
#### Purpose

Make HDRI/EXR cards visually scannable through thumbnail images or honest missing-thumbnail states.

#### Owns

- thumbnail field expectations for HDRI/EXR entries
- showing thumbnail media on Catalog cards
- stable missing-thumbnail states
- keeping thumbnails as browse aids

#### Does Not Own

- live environment apply
- rendered preview boxes
- guaranteed thumbnail generation for every possible local file
- using thumbnails as the environment source of truth

#### Current Live Read

HDRI entries are difficult to scan by filename alone. Thumbnails should help the user recognize the lighting/environment mood, but the real `.hdr` or `.exr` file remains the source asset.

#### First Pass Decisions

- support thumbnail media where it exists or can be generated
- show a clear placeholder when thumbnail media is missing
- keep thumbnail paths separate from HDRI source paths
- do not block item listing or apply behavior on thumbnail availability

### Phase 6.5 Implementation Spec
#### Exact First Code Cut

1. Add thumbnail metadata expectations to HDRI/EXR Catalog records.
2. Render thumbnail media on HDRI/EXR cards when present.
3. Render an honest missing-thumbnail state when not present.
4. Prove HDRI cards remain usable without thumbnail media.

#### Likely Files

- `src/app/catalog/catalogItemContract.ts`
- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/theme/surfaces/catalog.css`
- focused Catalog surface tests

#### No-Widening Rule

- do not require generated thumbnails before `Catalog-6.1` and `Catalog-6.2` can work
- do not use thumbnails as the environment asset source
- do not implement rendered HDRI preview boxes in this phase

#### Implementation Risks

- making thumbnail absence look broken
- mixing thumbnail source and HDRI source identity
- assuming every `.hdr` or `.exr` has a browser-displayable image already

#### Checklist

- [x] HDRI/EXR cards show thumbnails when available
- [x] missing-thumbnail states are clear and stable
- [x] thumbnail metadata is separate from source asset identity
- [x] listing and apply remain usable without thumbnails

#### Verification Shape

Minimum verification for this phase should cover:
- card with thumbnail
- card without thumbnail
- thumbnail does not replace HDRI/EXR source identity

#### Done Shape

`Catalog-6.5` is done when HDRI/EXR cards are visually scannable through thumbnails or honest missing-thumbnail states.

## [x] `Catalog-6.6` - `Simple Applied HDRI Preview Box`

### Phase 6.6 Summary
#### Purpose

Render HDRI card preview boxes as simple applied-environment previews instead of geometry/reference placeholders.

#### Owns

- lightweight HDRI preview-box scene
- applying the card HDRI to the preview box only
- keeping preview-box state separate from live scene environment state
- making the HDRI card read visually as environment content

#### Does Not Own

- changing the live scene environment
- geometry/reference preview behavior
- advanced preview renderer controls
- full lighting editor behavior

#### Current Live Read

Reference cards can preview geometry. HDRI cards need a different visual language: a simple box or small scene with the HDRI applied so the user can understand the environment mood without applying it to the live scene.

#### First Pass Decisions

- use a simple box or lightweight scene
- apply the HDRI to that preview only
- do not mutate the live viewer environment just because the card preview renders
- keep this separate from thumbnails: thumbnails are static browse aids, preview boxes are lightweight environment previews

### Phase 6.6 Implementation Spec
#### Exact First Code Cut

1. Add a card preview-box path for HDRI/EXR entries.
2. Render a simple object/scene with the card environment applied.
3. Keep preview-box environment isolated from the live scene environment.
4. Prove viewing the card preview does not apply the HDRI to the scene.

#### Likely Files

- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/ui/CatalogCardPreviewViewport.tsx` or a focused HDRI preview component
- `src/app/catalog/catalogItemContract.ts`
- `src/app/theme/surfaces/catalog.css`
- focused Catalog surface or preview tests

#### No-Widening Rule

- do not apply the HDRI to live scene state from preview rendering
- do not reuse geometry/reference preview assumptions blindly
- do not add advanced environment editing controls here
- do not make preview boxes depend on local browse support

#### Implementation Risks

- preview rendering accidentally mutates viewer environment state
- card preview becomes too heavy for grid browsing
- HDRI preview boxes look like failed geometry previews instead of intentional environment previews

#### Checklist

- [x] HDRI/EXR card preview boxes render as simple environment previews
- [x] preview boxes do not change live scene environment
- [x] preview boxes are visually distinct from reference geometry previews
- [x] the grid remains usable with multiple HDRI cards

#### Verification Shape

Minimum verification for this phase should cover:
- HDRI preview box renders a simple environment scene
- live applied environment state does not change when the preview box renders
- HDRI preview cards remain separate from reference preview cards

#### Done Shape

`Catalog-6.6` is done when HDRI/EXR cards have a lightweight applied-environment preview box that helps the user inspect the environment without changing the live scene.

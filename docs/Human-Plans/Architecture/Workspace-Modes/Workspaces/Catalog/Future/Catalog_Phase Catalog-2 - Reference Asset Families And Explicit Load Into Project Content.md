# [x] `Catalog-2` - `Reference Asset Families And Explicit Load Into Project Content`

## Doc Header

### Doc History
15. 2026-04-18 07:50:56: Implemented `Catalog-2 / Phase 5.1 - Item Page Interactive Preview Viewport`, widening the already-shipped repo-backed card viewport seam into the larger item-page preview surface so loaded repo-backed item pages now render the same interactive viewport and reuse already-loaded preview-session state from the grid, while imports reuse and environment entries keep their existing simpler item-page paths
14. 2026-04-18 07:43:44: Prepped `Catalog-2 / Phase 5.1 - Item Page Interactive Preview Viewport` for implementation, grounding the next cut in the live shared preview-session handoff across `CatalogShell.tsx`, the still-static item-page preview render in `CatalogShellItemPage.tsx`, the already-shipped `CatalogCardPreviewViewport.tsx` seam, and the repo-backed preview-source helper in `catalogItemContract.ts` so the item page can reuse already-loaded preview state and render the same interactive viewport without reopening commit, imports, environment, or later `pubparts` behavior
13. 2026-04-18 07:33:27: Added `Catalog-2 / Phase 5.1 - Item Page Interactive Preview Viewport`, widening the `Catalog-2` follow-through with one narrow preview-surface follow-up so repo-backed item pages can stop using static image or video preview media and instead render the same interactive preview viewport pattern at the larger item-page scale, while keeping commit routing, imports reuse, environment apply, and later `pubparts` source onboarding outside this immediate cut
12. 2026-04-18 00:22:39: Implemented `Catalog-2 / Phase 5 - Repo-backed Interactive Card Preview Viewports`, widening the Catalog grid preview box from static loaded media into a lightweight repo-backed interactive viewport path through a new Catalog-local card preview component, shared repo-reference preview-source resolution, and focused Catalog surface proof that users can now rotate repo-backed reference cards before commit while imports reuse and environment entries keep their existing simpler preview or apply paths
11. 2026-04-18 00:17:43: Prepped `Catalog-2 / Phase 5 - Repo-backed Interactive Card Preview Viewports` for implementation, grounding the next cut in the live `CatalogShellGridMode.tsx` static image-or-video preview box, the still-lightweight `catalogItemContract.ts` preview-media seam, the `catalogPreviewSession.ts` loaded-item owner that currently tracks only temporary loaded IDs, and the existing `CatalogSurface.test.tsx` preview proof surface so the first interactive card viewport pass stays one narrow repo-backed preview-box upgrade instead of widening into full model-viewer ownership, commit routing, or imports or environment runtime
10. 2026-04-18 00:15:33: Added `Catalog-2 / Phase 5 - Repo-backed Interactive Card Preview Viewports`, widening the `Catalog-2` plan with one narrow follow-up for repo-backed reference items so the card preview box can stop being a static loaded media tile and become a lightweight rotatable preview viewport, while keeping the work inside the preview surface lane without reopening commit ownership, imports reuse, or environment apply behavior
9. 2026-04-18 00:08:14: Implemented `Catalog-2 / Phase 4 - Reference Family Commit Follow-Through`, keeping the shipped `browser-project` handoff seam unchanged while widening the focused commit proof across the real `foothooks`, `shoes`, and `footpads` family onboarding so those first curated reference families now explicitly demonstrate the same downstream Browser/project owner path and keep temporary Catalog preview state separate after commit
8. 2026-04-18 00:05:53: Prepped `Catalog-2 / Phase 4 - Reference Family Commit Follow-Through` for implementation, grounding the final `Catalog-2` cut in the already-shipped `browser-project` downstream-owner read across `catalogActionPlan.ts`, `catalogReferenceCommit.ts`, and `CatalogSurface.tsx`, where the generic repo-backed commit handoff already exists but the widened `foothooks`, `shoes`, and `footpads` family onboarding still needs one narrow proof pass that those families keep riding the same explicit Browser/project path without turning Catalog into a hidden runtime owner
7. 2026-04-18 00:01:27: Implemented `Catalog-2 / Phase 3 - Reference Family Item Page Read`, widening `CatalogShellItemPage.tsx` plus small shared helpers so the first onboarded reference families now read through family-specific item-page labels, summary copy, and preview-versus-commit guidance instead of raw family-key metadata and generic foundation text, with focused Catalog surface proof that the item page now feels like the main decision surface for those families without reopening browse-shell, source, or commit seams
6. 2026-04-17 23:53:16: Prepped `Catalog-2 / Phase 3 - Reference Family Item Page Read` for implementation, grounding the next cut in the live `CatalogShellItemPage.tsx` decision surface plus the shared item-page helpers in `catalogShellShared.ts`, where the item page still shows raw family-key metadata and mostly generic preview/description copy, so the phase now stays one item-page-only family-readability pass without widening back into the browse shell, source seam, or commit routing
5. 2026-04-17 23:51:35: Implemented `Catalog-2 / Phase 2 - Reference Family Browse Read`, widening the shared Catalog browse shell so the rail and grid now read the first explicit `foothooks`, `shoes`, and `footpads` family baseline more clearly through family-specific browse copy and card metadata, while keeping the work shell-only and adding focused Catalog surface proof that those optional curated reference families are now legible without reopening source, item-page, or commit seams
4. 2026-04-17 23:48:36: Prepped `Catalog-2 / Phase 2 - Reference Family Browse Read` for implementation, grounding the next cut in the now-shipped explicit `foothooks`, `shoes`, and `footpads` source baseline plus the live browse owners in `CatalogShellGridMode.tsx`, `CatalogShellBrowseRail.tsx`, `catalogShellShared.ts`, and `catalog.css`, where the shell still mostly reads through generic section labels and preview-count copy instead of clearly surfacing the first reference families as optional curated browse lanes
3. 2026-04-17 23:45:14: Implemented `Catalog-2 / Phase 1 - Reference Family Source Baseline`, tightening the repo-backed reference source entries so `footpads`, `shoes`, and `foothooks` now read as explicit optional curated families instead of flattening back into generic `references`, normalizing the hook family naming drift in `catalogSeedItems.ts`, and adding focused source plus Catalog surface proof that later shell phases can now read the first three reference families directly from the Catalog-owned source seam
2. 2026-04-17 23:43:05: Prepped `Catalog-2 / Phase 1 - Reference Family Source Baseline` for implementation, grounding the first cut in the live `catalogSeedItems.ts` plus `catalogSource.ts` source seam, the current flattening where all reference families still share `familyKey: 'references'`, and the remaining hook-section naming drift so the next pass stays one small source-owned family-baseline cleanup instead of widening into shell polish, item-page metadata, or commit-path changes
1. 2026-04-17 23:36:00: Added this standalone `Catalog-2` future doc by compressing the existing `Catalog-Index.md` `Catalog-2` lane plus the broader `Catalog-Vision.md` `Generation 1` reference-family direction into one implementation-ready plan surface, locking that the next catalog family should onboard `foothooks`, `shoes`, and `footpads` as real optional reference families with explicit metadata, browse sections, and downstream Browser/project commit behavior without widening into HDRI or later scale-up lanes

### Purpose

This doc defines the first real reference-family onboarding lane for `Catalog` after the `Catalog-1` workspace foundation.

Use it to answer:
- how `foothooks`, `shoes`, and `footpads` should become real optional curated catalog families
- what still needs to widen beyond the shipped `Catalog-1` fixture baseline
- how reference-family metadata, browse sections, preview behavior, and commit behavior should land without blurring into `HDRI` or later search-scale work
- how `Catalog` should stay browse-owned while committed reference results become Browser/project truth

### Why This Phase Exists

`Catalog-1` now gives ParaHook the first honest workspace foundation:
- a real `Catalog` surface
- a source-backed shell
- temporary preview-session behavior
- reference commit handoff proof
- environment apply ownership proof

But the current shipped surface still reads as a foundation seam, not the full first reference-family onboarding promised by the family index and vision.

The next lane needs to make the early reference families read like real optional curated catalog content:
- `foothooks`
- `shoes`
- `footpads`

This doc exists so that widening can happen through one explicit family plan instead of smuggling true family onboarding into the earlier foundation doc.

### Scope

This doc covers:
- the first real curated reference-family onboarding after `Catalog-1`
- family-level metadata and browse organization for `foothooks`, `shoes`, and `footpads`
- explicit preview-plus-commit behavior for those reference families
- downstream Browser/project-content handoff for committed reference results

This doc does not cover:
- `HDRI` or environment-family onboarding
- broader search and metadata scale-up beyond what the first reference families need
- final identity, recall, or rebind rules after commit

## Doc Body

### Goal

Turn the early placeholder-style reference entries into the first honest optional catalog families so `Catalog` can onboard real `foothooks`, `shoes`, and `footpads` as curated reference content with explicit metadata, explicit temporary preview behavior, and explicit Browser/project commit handoff.

### Boundaries

This phase should:
- start only after the `Catalog-Gen0` cleanup has removed the old Browser-resident preload baseline
- treat `foothooks`, `shoes`, and `footpads` as optional catalog families instead of implied default content
- keep `Load Preview` temporary and `Add To Project` explicit
- let committed reference results become visible through downstream Browser/project content systems
- keep the item-page and grid browse surfaces honest for real reference-family usage

This phase should not:
- reopen the `Catalog-1` workspace-foundation seams unless a narrow follow-on is truly needed
- widen into `HDRI` or environment apply behavior
- widen into large search, tag, or metadata scale-up work that belongs to `Catalog-4`
- decide final recall, remembered-catalog, or identity-follow-through policy that belongs to `Catalog-5`

### Architecture Direction

The healthy read for `Catalog-2` is:
- `Catalog` owns curated browse, family grouping, and temporary preview choice
- `Catalog` may expose the first honest metadata for real reference families
- committed reference results still hand off to Browser/project truth through explicit downstream seams
- the first real family onboarding should feel optional and intentional, not like restoring the old preload behavior under a new label

The healthy product read is:
- the user can browse real `foothooks`, `shoes`, and `footpads` as distinct optional families
- cards and item pages read with honest family-specific labels and metadata
- the user can temporarily preview those items without committing them
- `Add To Project` still becomes explicit Browser/project truth instead of leaving loaded references catalog-local

### Current Live Read

The current foundation already gives `Catalog-2` a good starting point:

- `src/app/catalog/catalogSeedItems.ts`
  - already exposes seed entries for `shoes`, `footpads`, and hook-style references
  - currently reads more like fixture-backed family proof than a real curated-family onboarding home
- `src/app/catalog/catalogSource.ts`
  - already owns the repo-backed and imports-backed source seam
  - is the likely place where richer reference-family source reads will widen first
- `src/app/catalog/catalogItemContract.ts`
  - already owns the baseline shared item shape
  - still reads intentionally light for the first foundation pass
- `src/app/catalog/catalogReferenceCommit.ts`
  - already proves reference-style commit handoff into Browser/project ownership
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - already renders the browse-first grid
  - is the strongest nearby browse owner for making the first real reference families read clearly in the shell
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - already owns the larger decision surface
  - is the strongest nearby owner for family-specific description and metadata tightening
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the baseline shell, preview-session, and commit handoff behavior
  - is the strongest nearby end-to-end proof owner for real reference-family onboarding follow-through

So `Catalog-2` should not re-solve the foundation question.

It should widen the now-stable foundation into the first honest reference-family read.

### Acceptance Read

`Catalog-2` is healthy when:
- `foothooks`, `shoes`, and `footpads` read as real optional curated families instead of fixture-like placeholders
- the shell exposes those families clearly through the shared browse and item-page surfaces
- the first family-specific metadata is strong enough that the user can tell what each reference entry is and why it belongs in that family
- preview remains temporary
- committed reference results still hand off to Browser/project truth through the explicit downstream owner path

## Wishlist Organization

### High Level Goals

- [x] `HLG 1. Move The Current Preloaded References Into Catalog`
- [x] `HLG 2. Separate Sections For Reference Families`
- [x] `HLG 3. Explicit Preview Surfaces`
- [x] `HLG 4. Explicit Add-To-Project Commit`
- [x] `HLG 5. Preview-Friendly Metadata`
- [x] `HLG 6. Item Page As The Main Decision Surface`
- [x] `HLG 7. Interactive Repo-backed Card Preview Viewports`
- [x] `HLG 8. Interactive Repo-backed Item Page Preview Viewports`

### `Catalog-2 Phase 1`

- [x] `1. Reference Family Source Entries Stop Reading Like Foundation Fixtures`
- [x] `2. The First Curated Family Read Names Foothooks, Shoes, And Footpads Explicitly`
- [x] `3. The Source Seam Stays Catalog-Owned Instead Of Falling Back To Browser-era Preload Truth`
- [x] `HLG 1. Move The Current Preloaded References Into Catalog`
- [x] `HLG 2. Separate Sections For Reference Families`

### `Catalog-2 Phase 2`

- [x] `4. The Shared Browse Shell Reads The First Reference Families Clearly`
- [x] `5. Cards Surface Honest Family Labels And First Family-friendly Metadata`
- [x] `6. The First Family Sections Feel Optional And Curated Instead Of Preloaded`
- [x] `HLG 2. Separate Sections For Reference Families`
- [x] `HLG 5. Preview-Friendly Metadata`

### `Catalog-2 Phase 3`

- [x] `7. Real Reference-family Item Pages Become The Main Decision Surface`
- [x] `8. The Item Page Tightens Description And Metadata For The First Reference Families`
- [x] `9. Temporary Preview Behavior Stays Honest For Those Families`
- [x] `HLG 3. Explicit Preview Surfaces`
- [x] `HLG 5. Preview-Friendly Metadata`
- [x] `HLG 6. Item Page As The Main Decision Surface`

### `Catalog-2 Phase 4`

- [x] `10. Add To Project Stays The Explicit Commit Step For The First Reference Families`
- [x] `11. Committed Reference Results Stay On The Downstream Browser Or Project-content Path`
- [x] `12. Catalog Does Not Become The Hidden Runtime Owner After Real Family Onboarding`
- [x] `HLG 4. Explicit Add-To-Project Commit`

### `Catalog-2 Phase 5`

- [x] `13. Repo-backed Card Preview Boxes Become Lightweight Interactive Viewports`
- [x] `14. Users Can Rotate Repo-backed Reference Items Inside The Card Preview Box`
- [x] `15. Interactive Card Preview Viewports Stay Temporary And Separate From Commit`
- [x] `HLG 3. Explicit Preview Surfaces`
- [x] `HLG 7. Interactive Repo-backed Card Preview Viewports`

### `Catalog-2 Phase 5.1`

- [x] `16. Repo-backed Item Pages Use The Interactive Preview Viewport Instead Of Static Media`
- [x] `17. The Larger Item Page Preview Surface Supports Rotate Or Inspect Interaction`
- [x] `18. The Item Page Preview Viewport Reuses The Same Honest Temporary Preview Meaning`
- [x] `HLG 3. Explicit Preview Surfaces`
- [x] `HLG 6. Item Page As The Main Decision Surface`
- [x] `HLG 8. Interactive Repo-backed Item Page Preview Viewports`

## [x] `Catalog-2` - `Phase 1 - Reference Family Source Baseline`

### Phase 1 Summary
#### Purpose

Turn the current foundation-era reference seeds into the first honest curated-family source baseline for `foothooks`, `shoes`, and `footpads`.

#### Owns

- the first real source read for the initial reference families
- replacing fixture-like family wording where needed
- making the source seam explicit that these families are now intentional optional add-ins

#### Does Not Own

- shell-scale browse polish
- item-page metadata tightening
- commit-path widening beyond what the source baseline needs

#### Current Live Read

The closest current owners are:

- `src/app/catalog/catalogSeedItems.ts`
  - already seeds the first baseline entries for `footpads`, `shoes`, and hook-style references
  - still flattens those entries under `familyKey: 'references'`
  - still uses the drifted hook section label `premade-foothooks` instead of the cleaner family wording the index now points at
- `src/app/catalog/catalogSource.ts`
  - already owns the repo-backed source seam that turns seed data into `CatalogItemRecord`
  - is the right place to keep the first family-source widening inside `src/app/catalog/`
- `src/app/catalog/catalogItemContract.ts`
  - already owns the baseline item shape
  - currently stays intentionally light, so any metadata widening in this phase should be minimal and justified by immediate shell needs
- `src/app/catalog/catalogSource.test.ts`
  - is the strongest nearby proof owner for the first source-baseline widening

So the next cut should stay source-first:
- tighten the three reference-family source entries
- decide the first honest family and section naming
- only widen the shared contract if one small field is truly needed immediately

#### First Pass Decisions

- keep the first family source curated and explicit
- treat this phase as naming-and-source truth first, not shell presentation first
- prefer small honest metadata additions over one broad schema jump
- keep `familyKey` and `sectionKey` truthful enough that later shell phases do not have to infer family identity from labels or tags
- keep imports and environment families out of this cut

### Phase 1 Implementation Spec
#### Exact First Code Cut

1. Tighten the repo-backed reference family source entries in `catalogSeedItems.ts` so `foothooks`, `shoes`, and `footpads` read as the first true optional curated families instead of generic `references`.
2. Normalize the first honest family and section naming for those entries so later shell work can read them directly without UI-local translation drift.
3. Add only the family-specific metadata fields that the browse shell immediately needs, and only if the current contract truly cannot express the first family baseline cleanly.
4. Keep the source truth inside `src/app/catalog/` instead of reviving Browser-era preload ownership.

#### Likely Files

- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogItemContract.ts` only if one narrow metadata widening is truly needed
- focused source proof:
  - `src/app/catalog/catalogSource.test.ts`
  - `src/app/catalog/catalogItemContract.test.ts` only if the contract widens

#### No-Widening Rule

- do not start shell polish here
- do not start HDRI onboarding here
- do not widen into later filter-system scale-up yet
- do not reopen preview-session or commit-path logic here

#### Implementation Risks

- keeping the family source too placeholder-like and forcing later phases to rediscover intent
- changing family naming in UI files first and leaving the source seam inconsistent underneath
- widening the contract too far before the shell actually needs the added fields

#### Checklist

- [x] reference family source entries read as true optional curated families
- [x] the source seam names `foothooks`, `shoes`, and `footpads` explicitly
- [x] the first family and section naming stops depending on foundation-era drift such as generic `references` flattening
- [x] the family source stays Catalog-owned

#### Verification Shape

Minimum verification for this phase should cover:

- the source seam emits the first real reference families explicitly
- the first family and section naming is explicit enough that later shell phases do not need to infer it from labels
- the early family entries no longer read like foundation-only placeholders

#### Done Shape

`Phase 1` is done when:

- the first real reference-family source baseline exists
- later shell phases no longer have to guess what the first families are

## [x] `Catalog-2` - `Phase 2 - Reference Family Browse Read`

### Phase 2 Summary
#### Purpose

Make the shared Catalog browse shell read the first reference families clearly and intentionally.

#### Owns

- browse-shell clarity for the first reference families
- honest family labels in the card grid
- enough first-pass metadata that the user can distinguish these families at a glance

#### Does Not Own

- item-page deepening
- commit-path widening
- broad search or tag systems

#### Current Live Read

The closest current owners are:

- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - already renders the shared card-grid browse surface over the now-explicit `foothooks`, `shoes`, and `footpads` source baseline
  - still mainly surfaces the section label plus generic preview-count copy instead of a stronger family read
- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
  - already renders the browse rail and section buttons
  - still reads as a generic section list rather than a more intentional first family browse organizer
- `src/app/catalog/ui/catalogShellShared.ts`
  - already turns section keys into display labels and builds the rail options
  - is the narrowest nearby place to tighten how the first reference families are named in browse mode
- `src/app/theme/surfaces/catalog.css`
  - already owns the browse-shell presentation language
  - is the likely local owner for any small card or rail treatment needed to make the first families feel more intentional
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the shared Catalog shell end to end
  - is the strongest nearby proof owner for the first family-legibility follow-through

These already own the browse shell, but they still read more like a generic foundation shell than a clearly onboarded first family browse surface.

So the next cut should stay shell-only:
- use the newly explicit source naming that `Phase 1` landed
- make the rail and grid read the first reference families more clearly
- keep item-page, source, and commit seams untouched unless one tiny shell-supporting helper is unavoidable

#### First Pass Decisions

- keep the shell browse-first and lightweight
- treat this phase as family legibility first, not metadata density first
- favor family clarity over dense metadata
- preserve the earlier no-auto-preview and preview-session rules

### Phase 2 Implementation Spec
#### Exact First Code Cut

1. Widen the browse shell so the first reference families read clearly through the shared rail and grid, using the now-explicit source baseline from `Phase 1`.
2. Add only the family labels and first browse metadata needed to distinguish `foothooks`, `shoes`, and `footpads` in grid mode.
3. Tighten the rail or card presentation only as much as needed to make those families feel intentional and optional instead of preloaded or generic.
4. Keep the shell store-like and lightweight instead of turning the grid into a dense Browser-style list.

#### Likely Files

- `src/app/catalog/ui/CatalogShellBrowseRail.tsx`
- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- `src/app/catalog/ui/catalogShellShared.ts`
- likely styling follow-through:
  - `src/app/theme/surfaces/catalog.css`
- focused shell proof:
  - `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not reopen workspace-foundation seams
- do not reopen source-family naming from `Phase 1` unless one tiny shell-supporting correction is unavoidable
- do not turn this into search-scale work
- do not add environment-family behavior
- do not widen into item-page metadata yet

#### Implementation Risks

- making the first family onboarding too subtle so the shell still reads like generic seed data
- over-correcting and adding too much browse metadata before the item page has its own phase
- overfilling the cards with metadata and losing the lightweight store-page read

#### Checklist

- [x] the browse shell reads the first reference families clearly
- [x] cards surface honest family labels and first family-friendly metadata
- [x] the first families feel optional and curated instead of preloaded

#### Verification Shape

Minimum verification for this phase should cover:

- the browse shell makes the first reference families legible
- the rail and grid now clearly reflect the first family source baseline
- the grid still stays lightweight and browse-first

#### Done Shape

`Phase 2` is done when:

- the shared browse shell communicates the first real reference families clearly
- the user can tell they are browsing optional curated reference content instead of generic placeholders

## [x] `Catalog-2` - `Phase 3 - Reference Family Item Page Read`

### Phase 3 Summary
#### Purpose

Tighten the item page so it becomes the first real decision surface for the onboarded reference families.

#### Owns

- family-specific item-page description and metadata tightening
- honest preview messaging for real reference families
- keeping the item page as the main decision surface once the user leaves the grid

#### Does Not Own

- broad browse-shell polish
- final commit identity or recall policy
- environment-family behavior

#### Current Live Read

The closest current owner is:

- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - already owns the larger decision surface
  - already shows the larger preview surface, description, tags, and action area
  - still uses raw `familyKey` display and mostly generic preview or description copy instead of a stronger family-specific item-page read
- `src/app/catalog/ui/catalogShellShared.ts`
  - already owns the shared family-label and browse-copy helpers
  - is the narrowest nearby place to add any small shared family-label or item-page-support helper that `CatalogShellItemPage.tsx` truly needs
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the shared Catalog shell through grid-to-item-page flows
  - is the strongest nearby proof owner for the first family-specific item-page readability follow-through

So the next cut should stay item-page-only:
- use the explicit family naming and browse read that `Phase 1` and `Phase 2` already landed
- make the item page read those families more clearly once the user leaves the grid
- keep preview ownership and commit routing untouched unless one tiny supporting helper is unavoidable

#### First Pass Decisions

- keep the item page focused on preview, description, metadata, and explicit action
- treat this phase as family-specific item-page readability first, not metadata scale-up first
- do not turn the item page into a second Browser inspector
- preserve the earlier preview-versus-commit contract

### Phase 3 Implementation Spec
#### Exact First Code Cut

1. Tighten the item-page read for the first reference families using the now-explicit `foothooks`, `shoes`, and `footpads` source naming plus the clearer browse-shell read from `Phase 2`.
2. Add only the first real family-specific description and metadata surfaces needed to make the item page feel like the main decision surface for those families.
3. Replace raw family-key or generic item-page copy where needed so the page reads intentional instead of foundation-generic.
4. Keep temporary preview messaging explicit and separate from commit.

#### Likely Files

- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- shared helpers only if needed:
  - `src/app/catalog/ui/catalogShellShared.ts`
- focused shell proof:
  - `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not widen into search-scale metadata here
- do not reopen browse-shell wording or styling unless one tiny shared helper must move
- do not reopen reference commit routing here
- do not add HDRI behavior here

#### Implementation Risks

- adding too little family-specific information and keeping the item page generic
- over-correcting and stuffing the item page with browse-style metadata that belongs in later scale-up work
- adding too much inspector detail and losing the store-page decision-surface read

#### Checklist

- [x] real reference-family item pages become the main decision surface
- [x] the item page tightens description and metadata for the first families
- [x] temporary preview behavior stays honest

#### Verification Shape

Minimum verification for this phase should cover:

- a first reference-family item page reads clearly
- the item page now reflects the explicit family baseline instead of raw family-key or generic copy
- preview messaging still stays temporary and non-committing

#### Done Shape

`Phase 3` is done when:

- the item page reads like the first real decision surface for the onboarded reference families
- the user can inspect those families without leaving the preview-versus-commit boundary ambiguous

## [x] `Catalog-2` - `Phase 4 - Reference Family Commit Follow-Through`

### Phase 4 Summary
#### Purpose

Prove that the first onboarded reference families still commit through the explicit downstream Browser/project-content path after the family widening lands.

#### Owns

- commit follow-through proof for the first real reference families
- keeping `Add To Project` explicit after family onboarding
- proving Catalog still does not become the hidden runtime owner after those families feel real

#### Does Not Own

- broader identity and recall rules
- environment-family handoff
- search and scale-up work

#### Current Live Read

The closest current owners are:

- `src/app/catalog/catalogActionPlan.ts`
  - already keeps repo-backed reference families on the `browser-project` downstream-owner read
  - already makes `Add To Project` the explicit available commit step for real reference items instead of a generic load path
- `src/app/catalog/catalogReferenceCommit.ts`
  - already resolves the repo-backed reference commit request from a real `CatalogItemRecord`
  - already narrows the commit handoff to supported reference asset paths instead of making Catalog the long-term runtime owner
- `src/app/workspace/CatalogSurface.tsx`
  - already hands valid repo-backed reference commits into the existing `addImportedReference(...)` Browser/project owner
  - already keeps preview-session state and environment apply separate from that commit handoff
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the generic repo-backed `Add To Project` handoff and the preview-session boundary
  - is now the strongest nearby proof owner for showing that the widened `foothooks`, `shoes`, and `footpads` family read still commits through that same honest downstream path after `Phase 2` and `Phase 3`

The basic commit path is already shipped.

This phase exists to prove that the first real family onboarding still rides that same honest downstream owner seam after the family-specific browse and item-page widening has landed.

#### First Pass Decisions

- treat this as family-specific follow-through proof first, not a second commit-feature build
- prove the widened real family onboarding against the existing downstream owner path
- prefer focused end-to-end proof in `CatalogSurface.test.tsx` over widening the commit helper unless one narrow family-specific adapter correction is truly required
- keep `CatalogSurface.tsx` as the handoff host, not a new commit owner

### Phase 4 Implementation Spec
#### Exact First Code Cut

1. Add focused proof that the first onboarded reference families still commit through the existing Browser/project-content seam.
2. Widen that proof so it reads through the real `foothooks`, `shoes`, and `footpads` family onboarding rather than only through an earlier generic repo-backed reference read.
3. Tighten any narrow family-specific adapter details only if the widened family onboarding truly needs them.
4. Keep Catalog preview ownership separate from committed reference ownership after the family widening lands.

#### Likely Files

- `src/app/catalog/catalogActionPlan.ts` only if one tiny family-specific availability or downstream-owner correction is truly needed
- `src/app/catalog/catalogReferenceCommit.ts` only if a narrow family-specific widening is required
- `src/app/workspace/CatalogSurface.tsx`
- focused proof:
  - `src/app/workspace/CatalogSurface.test.tsx`
  - `src/app/catalog/catalogReferenceCommit.test.ts`

#### No-Widening Rule

- do not reopen source-family naming or item-page copy from `Phase 1` through `Phase 3` unless one tiny commit-supporting correction is unavoidable
- do not widen into recall or identity policy
- do not reopen environment or HDRI ownership here
- do not turn this into broad shell polish

#### Implementation Risks

- assuming the generic commit proof from `Catalog-1` and `Catalog-1 / Phase 11.1` is enough without checking the widened real family onboarding
- widening the commit path unnecessarily instead of proving the existing one still holds
- letting the new family-specific browse or item-page read imply Catalog-local ownership after commit

#### Checklist

- [x] `Add To Project` stays the explicit commit step for the first reference families
- [x] committed reference results stay on the downstream Browser/project-content path
- [x] Catalog does not become the hidden runtime owner after real family onboarding

#### Verification Shape

Minimum verification for this phase should cover:

- a real onboarded reference-family item commits through the downstream Browser/project path
- the family-specific onboarding from `Phase 2` and `Phase 3` does not alter the downstream owner read
- Catalog temporary preview state stays separate after commit

#### Done Shape

`Phase 4` is done when:

- the first real reference-family onboarding rides the existing explicit downstream owner path
- later Catalog family growth no longer has to reopen the basic reference-family commit question

## [x] `Catalog-2` - `Phase 5 - Repo-backed Interactive Card Preview Viewports`

### Phase 5 Summary
#### Purpose

Turn the static loaded card preview box for repo-backed reference items into a lightweight interactive preview viewport so the user can rotate the item directly from the grid.

#### Owns

- interactive in-card preview viewport behavior for repo-backed reference items
- lightweight rotate or inspect interaction inside the card preview box
- keeping the card preview box temporary and preview-only while making it more useful

#### Does Not Own

- commit-path changes
- imports reuse becoming a full interactive viewport path
- environment-family preview behavior
- larger item-page viewer replacement work

#### Current Live Read

The closest current owners are:

- `src/app/catalog/ui/CatalogShellGridMode.tsx`
  - already owns the card preview box render and click-to-load preview interaction
  - currently renders loaded preview state as static image or video media instead of a lightweight inspect surface
- `src/app/catalog/catalogPreviewSession.ts`
  - already owns which preview items are temporarily loaded
  - currently tracks only temporary loaded item IDs and should stay ownership-only instead of absorbing viewport interaction state
- `src/app/catalog/catalogItemContract.ts`
  - already owns the current preview-media contract and base-path preview-media resolution
  - still reads as a static media seam rather than a card-scoped interactive viewport seam
- `src/app/workspace/CatalogSurface.tsx`
  - already hosts the Catalog preview session and shell wiring
  - should remain the surface host instead of becoming the card-viewport interaction owner
- `src/app/theme/surfaces/catalog.css`
  - already owns the card preview box presentation
  - is the likely local owner for any small visual affordance that says the box can now be rotated or inspected
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves preview loading and the temporary preview-session boundary
  - is the strongest nearby proof owner for the first interactive card-preview follow-through

The preview box already exists and loads honestly.

What is still missing is one Catalog-owned way to inspect repo-backed geometry inside the card itself.

This phase exists to make that repo-backed preview surface more useful without changing what preview means.

#### First Pass Decisions

- keep the first interactive preview box lightweight and card-scoped
- scope the first interactive behavior to repo-backed reference items only
- prefer one tiny Catalog-local card viewport seam over reaching into the main model-viewer runtime directly
- treat rotation or inspect interaction as preview-only, not as selection, transform, or authored state
- keep the larger item page as the deeper decision surface even after the card preview box becomes interactive

### Phase 5 Implementation Spec
#### Exact First Code Cut

1. Replace the static loaded media read for repo-backed reference cards with a lightweight interactive preview viewport.
2. Let the user rotate the repo-backed previewed item directly inside the card preview box after preview is loaded.
3. Add only the smallest local interaction state needed for that card viewport and keep it separate from the preview-session owner.
4. Keep imports reuse entries and environment entries on their current simpler preview or apply paths unless one tiny affordance change is unavoidable.
5. Keep the interactive card preview box temporary and separate from `Add To Project`.

#### Likely Files

- `src/app/catalog/ui/CatalogShellGridMode.tsx`
- small shared preview helpers only if truly needed:
  - `src/app/catalog/catalogItemContract.ts`
  - `src/app/catalog/catalogPreviewSession.ts`
- one new Catalog-local preview viewport helper or component if the grid needs extraction:
  - `src/app/catalog/ui/`
- likely local styling follow-through:
  - `src/app/theme/surfaces/catalog.css`
- focused shell proof:
  - `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not reopen reference commit routing
- do not turn the card preview box into a second item-page viewer
- do not reach into global model-viewer authored or project state just to get card rotation working
- do not widen imports reuse into a full runtime viewport owner here
- do not reopen environment apply ownership or HDRI preview behavior
- do not introduce authored transform or project-content state through preview rotation

#### Implementation Risks

- making the card preview viewport too heavy and losing the lightweight store-grid read
- letting card interaction blur selection, preview, and commit meaning
- over-coupling the card preview to the main model-viewport runtime and quietly importing the wrong owner
- quietly introducing a new hidden runtime owner for part-viewer state instead of keeping it a local preview surface

#### Checklist

- [x] repo-backed card preview boxes become lightweight interactive viewports
- [x] users can rotate repo-backed reference items inside the card preview box
- [x] interactive card preview viewports stay temporary and separate from commit

#### Verification Shape

Minimum verification for this phase should cover:

- a repo-backed reference card can load into an interactive preview box
- the user can rotate the previewed item inside that card box
- the new card interaction state stays local to the preview box instead of changing project or authored state
- interactive card preview state does not become commit state
- imports reuse and environment entries keep their existing simpler paths

#### Done Shape

`Phase 5` is done when:

- the repo-backed card preview box feels like a small inspect viewport instead of a static tile
- the user can rotate the previewed item before committing it
- preview remains temporary and honest

## [x] `Catalog-2` - `Phase 5.1 - Item Page Interactive Preview Viewport`

### Phase 5.1 Summary
#### Purpose

Upgrade the larger item-page preview surface for repo-backed reference items so it uses an interactive preview viewport instead of static image or video media.

#### Owns

- interactive item-page preview viewport behavior for repo-backed reference items
- reusing the honest temporary preview meaning at the larger item-page scale
- keeping the item page as the deeper inspect surface once the grid card viewport already exists

#### Does Not Own

- commit-path changes
- imports reuse becoming a full item-page viewport path
- environment-family preview behavior
- future `pubparts` source onboarding itself

#### Current Live Read

The closest current owners are:

- `src/app/catalog/ui/CatalogShell.tsx`
  - already owns the shared preview-loaded item-id handoff between the grid and the item page
  - already passes `isPreviewLoaded` into `CatalogShellItemPage.tsx`, so opening an item page after loading preview from the grid should stay one shared Catalog preview-session read instead of a second load path
- `src/app/catalog/ui/CatalogShellItemPage.tsx`
  - already owns the larger preview surface and action area
  - already reads the shared preview-loaded state for the selected item
  - still renders repo-backed preview state as static image or video media instead of the newer interactive viewport seam
- `src/app/catalog/ui/CatalogCardPreviewViewport.tsx`
  - already proves the first Catalog-local interactive viewport pattern for repo-backed card boxes
  - is the strongest nearby reuse seam for a larger item-page viewport surface
- `src/app/catalog/catalogItemContract.ts`
  - already resolves repo-backed preview sources for the new card viewport path
  - is the right nearby seam if the item page needs the same source-aware read
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the item-page flow plus the newer interactive card viewport path
  - is the strongest nearby proof owner for the item-page viewport follow-through

The card box now has the honest interactive preview seam.

This phase exists so the larger item page can stop lagging behind that newer preview surface.

#### First Pass Decisions

- reuse the same Catalog-local interactive preview viewport seam if possible instead of creating a second item-page-only runtime
- preserve the current shared preview-session read so a repo-backed item already preview-loaded from the grid opens on the item page already loaded
- keep the larger item page as the deeper inspect surface through size and layout, not through a different preview meaning
- scope the first item-page interactive viewport behavior to repo-backed reference items only
- keep the future `pubparts` read as a later extension of the same preview seam, not something this phase must implement now

### Phase 5.1 Implementation Spec
#### Exact First Code Cut

1. Replace the static loaded image or video read on repo-backed reference item pages with the interactive Catalog preview viewport.
2. Reuse the current shared preview-loaded item-state from `CatalogShell.tsx` so a grid-loaded preview is already loaded when the user opens that same item page.
3. Reuse the current repo-backed preview-source seam and the new card viewport pattern wherever the fit is honest.
4. Keep imports reuse entries and environment entries on their current simpler item-page preview or apply paths unless one tiny guard or fallback change is unavoidable.
5. Keep the larger item-page preview viewport temporary and separate from `Add To Project`.

#### Likely Files

- `src/app/catalog/ui/CatalogShellItemPage.tsx`
- `src/app/catalog/ui/CatalogCardPreviewViewport.tsx` if it needs a small shared widening to support both card and item-page layouts
- small shared preview helpers only if truly needed:
  - `src/app/catalog/catalogItemContract.ts`
- likely local styling follow-through:
  - `src/app/theme/surfaces/catalog.css`
- focused shell proof:
  - `src/app/workspace/CatalogSurface.test.tsx`

#### No-Widening Rule

- do not reopen reference commit routing
- do not widen imports reuse into a full interactive item-page viewport path here
- do not reopen environment apply ownership or HDRI preview behavior
- do not treat this phase as the `pubparts` source-onboarding phase
- do not introduce authored transform or project-content state through item-page preview rotation

#### Implementation Risks

- duplicating the card viewport runtime instead of reusing the same honest seam
- making the item page feel like a second full model viewer instead of a deeper catalog inspect surface
- accidentally widening the preview seam to unsupported source families before those source lanes are ready

#### Checklist

- [x] repo-backed item pages use the interactive preview viewport instead of static media
- [x] the larger item-page preview surface supports rotate or inspect interaction
- [x] the item-page preview viewport reuses the same honest temporary preview meaning

#### Verification Shape

Minimum verification for this phase should cover:

- a repo-backed item page can load into the interactive preview viewport
- a repo-backed preview loaded from the grid is already loaded when the user opens that same item page
- the user can rotate the previewed item from the item page
- the item-page preview viewport stays temporary and separate from commit
- imports reuse and environment entries keep their existing simpler item-page paths

#### Done Shape

`Phase 5.1` is done when:

- repo-backed item pages no longer fall back to static preview media
- the larger item page uses the same honest interactive preview seam as the card box
- preview meaning stays temporary and explicit

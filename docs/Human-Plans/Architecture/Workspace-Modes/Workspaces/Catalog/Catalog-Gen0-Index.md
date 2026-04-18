# Catalog Gen0 Index

## Doc Header

### Doc History
7. 2026-04-18 11:19:18: Prepped `Catalog-Gen0 - Phase 2 - Ownership Boundary Cleanup` for implementation, grounding the next `Generation 0` cut in the still-live Browser-side manifest preload seeding plus Browser tree consumer seams, the Catalog repo-seed and imports snapshot split, the Catalog preview-session, repo-backed commit, and viewer-environment apply seams, and the already-shipped workspace-surface hosts so the boundary-cleanup pass can stay one explicit owner-read correction instead of widening into asset migration or new runtime behavior
6. 2026-04-18 11:12:54: Completed `Catalog-Gen0 - Phase 1 - Existing Catalog-Like Drift Inventory` as a docs-and-research pass, inventorying the live Browser-side manifest preload owner in `useAppStore.ts`, the shared Browser tree consumer in `useBrowserPanelController.ts`, the Catalog repo-seed plus imports snapshot seams in `catalogSeedItems.ts` and `catalogSource.ts`, the shipped Catalog surface host plus proof in `CatalogSurface.tsx` and `CatalogSurface.test.tsx`, the viewer-environment apply path through `catalogEnvironmentApply.ts` plus `envPreset`, and the current public asset split where geometry still lives under `ReferenceModels`, previews live under `CatalogPreviews`, and the newer `Catalog` folder is only partially in use
5. 2026-04-18 11:10:07: Prepped `Catalog-Gen0 - Phase 1 - Existing Catalog-Like Drift Inventory` for implementation, grounding the first `Generation 0` cut in the live repo-backed reference manifest, Catalog seed-item seam, shared Catalog surface host, Catalog surface proof, and surviving `ReferenceModels` asset-path plus environment-action reads so the opening prep pass can stay one explicit current-state inventory instead of drifting into early boundary cleanup or runtime rewiring
4. 2026-04-18 11:08:04: Reformatted the `Catalog-Gen0` index phase naming so the tracked prep lanes and matching read sections now use the clearer `Catalog-Gen0 - Phase N - ...` pattern instead of the older compact `Catalog-Gen0-N` labels, keeping the `Generation 0` wishlist surface aligned with the stronger family-phase naming used elsewhere in the Catalog planning area
3. 2026-04-18 11:03:38: Expanded this `Catalog-Gen0` index into a more explicit wishlist-tracking surface, reframing the prep lanes as one cleaner `Generation 0` tracking map with lane targets, stronger answers for what prep wishes are worth tracking before `Catalog-1`, and a newly explicit repo-backed asset-home cleanup item so the old `ReferenceModels` path drift can be treated as Catalog prep instead of getting rediscovered later
2. 2026-04-16 17:10:00: Tightened `Generation 0` so the prep lane now explicitly includes moving the current preloaded reference models out of `Browser`, clarifying that `foothooks`, `shoes`, and `footpads` should stop reading as default Browser-resident content during cleanup and instead become later optional add-ins the user can choose intentionally
1. 2026-04-16 16:55:23: Added this dedicated `Catalog-Gen0-Index.md` planning surface so the `Catalog` family can stay honest that it has not started yet, defining `Generation 0` as the cleanup-and-prep band before `Catalog-1` and splitting that prep into explicit cleanup phases for drift inventory, ownership-boundary cleanup, curated asset or metadata prep, and the `Generation 1` start-boundary lock

### Purpose

This file is the focused planning index for `Catalog Generation 0`.

Use it to answer:
- what `Generation 0` means for the `Catalog` family
- which cleanup or prep work should happen before `Catalog-1`
- how to keep pre-start cleanup separate from the first real catalog implementation phase
- which `Generation 0` wishlist items are currently worth tracking
- how those prep wishes cluster into coherent `Generation 0` lanes
- what the first `Generation 0` cleanup phases should be

### Scope

This doc covers:
- current catalog-like behavior inventory
- ownership-boundary cleanup before the family starts
- first curated asset and metadata prep
- wishlist tracking for those `Generation 0` prep lanes
- start-boundary cleanup between `Generation 0`, `Generation 1`, and `Generation 2`

This doc does not cover:
- the first real `Catalog` workspace implementation
- the `Catalog-1` runtime shell
- reference-family or `HDRI` loading behavior
- curated external-source widening that belongs to `Generation 2`

## Doc Body

### Short Version

`Catalog Generation 0` is the current planning state because the `Catalog` family has not started yet.

This generation is cleanup and prep only.

The goal is to make sure `Catalog-1` can begin as the first real family phase instead of spending its opening work rediscovering drift, ownership confusion, or missing baseline asset prep.

The most important current cleanup read is:
- move the preloaded reference models out of `Browser`
- stop treating `foothooks`, `shoes`, and `footpads` as default Browser-resident content
- move repo-backed reference asset paths toward Catalog-owned homes instead of leaving them under older Browser-era path assumptions
- leave those families as later optional add-ins the user can choose intentionally

Important rule:
- `Generation 0` is not a partial `Generation 1`
- if work starts adding a real `Catalog` surface, manifest runtime, or preview or load behavior, that work belongs to `Catalog-1` or later instead

This doc exists mainly to track those prep wishes cleanly before they turn into narrower implementation-ready phase docs.

### Why This Doc Exists

The `Catalog` family already has a strong `Generation 1` and `Generation 2` planning shape.

That is useful, but it becomes misleading if the family is described as already being in `Generation 1` before the family has actually started.

This doc exists so the current state can stay honest:
- `Generation 0`
  - prep and cleanup before the family start
- `Generation 1`
  - the first real repo-backed catalog implementation lane
- `Generation 2`
  - later widening such as curated external sources and stronger part-system normalization

It also exists so `Generation 0` can act as a working prep map instead of only a short summary.

The family already has stronger later tracking surfaces such as `Catalog-Index.md` and `Catalog-Gen2-Index.md`.

Without a matching `Generation 0` wishlist area, the prep lane stays too easy to hand-wave even when it still owns real cleanup such as:
- Browser-era preload retirement
- Catalog-versus-Browser boundary cleanup
- repo-backed asset-home cleanup
- manifest and preview-media prep for the first real catalog families

### Generation 0 Summary

`Generation 0` should:
- inventory where catalog-like behavior already exists today
- clean up owner and boundary reads before a real `Catalog` workspace lands
- move the current preloaded reference models out of the `Browser` baseline
- move repo-backed reference assets toward Catalog-owned pathing instead of leaving the old asset-home drift unowned
- prepare the first curated asset and metadata baseline
- lock what should count as the actual `Generation 1` start

Important rule:
- `Generation 0` should reduce ambiguity
- it should not quietly start the real `Catalog` runtime under cleanup language

## Wishlist Tracking

Use the `Generation 0` lanes to organize the current wishlist like this:

### `Catalog-Gen0 - Phase 1 - Existing Catalog-Like Drift Inventory`
  - [x] `G0-1. Preloaded Reference Models In Browser Inventory`
  - [x] `G0-2. HDRI Entry And Consumer Inventory`
  - [x] `G0-3. Catalog-Like UI Touchpoint Inventory`
  - [x] `G0-4. Current Asset Owner And Consumer Map`
  #### - lane target:
    - identify where catalog-like behavior already leaks through preload, Browser, viewer, or shell seams
    - create one honest current-state inventory before the family starts

### `Catalog-Gen0 - Phase 2 - Ownership Boundary Cleanup`
  - [ ] `G0-5. Browser Versus Catalog Boundary Cleanup`
  - [ ] `G0-6. Remove Preloaded Reference Models From Browser Baseline`
  - [ ] `G0-7. Import Versus Catalog Reuse Boundary Cleanup`
  - [ ] `G0-8. Preview Versus Commit Ownership Cleanup`
  - [ ] `G0-9. Workspace-Surface Boundary Cleanup`
  #### - lane target:
    - restate and tighten the owner split between `Catalog`, `Browser`, import, viewer state, and shared workspace hosting
    - make the user stop starting with browser-resident `foothooks`, `shoes`, and `footpads` as implied default project content
    - prevent `Catalog-1` from reopening the same boundary questions during its first runtime cut

### `Catalog-Gen0 - Phase 3 - Curated Asset And Metadata Prep`
  - [ ] `G0-10. Later Optional Reference Family Inventory`
  - [ ] `G0-11. Preview Media Gap Inventory`
  - [ ] `G0-12. Catalog-Owned Repo Asset Home Cleanup`
  - [ ] `G0-13. Stable Item Id And Slug Prep`
  - [ ] `G0-14. Manifest-Field Prep For First Families`
  - [ ] `G0-15. Imports Area Readiness Notes`
  #### - lane target:
    - prepare `foothooks`, `shoes`, and `footpads` as later optional add-in families instead of default Browser preload
    - prepare repo-backed reference assets to live under clearer Catalog-owned homes instead of older preload-era folder assumptions
    - prepare the first `HDRIs` and `Imports` reads so the later item contract can start from explicit prep instead of scattered filenames and assumptions

### `Catalog-Gen0 - Phase 4 - Generation 1 Start Boundary Cleanup`
  - [ ] `G0-16. First Real Family Start Definition`
  - [ ] `G0-17. Catalog-1 Entry Checklist`
  - [ ] `G0-18. Keep Generation 2 Widening Out Of Generation 1 Start`
  - [ ] `G0-19. First Standalone Doc Routing`
  #### - lane target:
    - lock what should count as "the `Catalog` family has started"
    - lock that later optional reference add-ins are not the same thing as old Browser preload
    - keep `Generation 0` prep, `Generation 1` baseline work, and `Generation 2` widening from blurring together

## Lane Reads

## [x] Catalog-Gen0 - Phase 1 - Existing Catalog-Like Drift Inventory

### Phase 1 Summary
#### Purpose

Inventory the current catalog-like behavior already scattered across preload, Browser, viewer, or shell seams so the family starts from one explicit current-state read.

#### Owns

- current preloaded reference entry inventory
- where those reference models still read as `Browser`-resident defaults today
- current `HDRI` entry and consumer inventory
- current catalog-like UI touchpoint inventory
- the first owner and consumer map for reusable assets already implied by the repo

#### Does Not Own

- the real `Catalog` workspace onboarding
- the first manifest runtime
- preview or commit behavior implementation

#### Current Live Read

The strongest current seams already show that the catalog-like baseline is spread across both older reference infrastructure and newer Catalog-owned surfaces:

- `src/app/references/referenceManifest.ts`
  - already owns the repo-backed manifest categories plus reference entries for `footpads`, `shoes`, and `premade-foothooks`
  - still points those entries at the older `ReferenceModels/...` asset-home path
  - is therefore one primary owner for the current preloaded-reference inventory and old asset-home drift
- `src/app/catalog/catalogSeedItems.ts`
  - already seeds the first curated Catalog-facing entries for `footpads`, `shoes`, `foothooks`, and the first `environment` item
  - still points its repo-backed reference assets at the same older `ReferenceModels/...` paths while preview media lives under `CatalogPreviews/...`
  - is therefore one primary owner for the current Catalog-facing asset-home split
- `src/app/workspace/CatalogSurface.tsx`
  - already hosts the shared Catalog source snapshot, preview-session ownership, add-to-project handoff, and environment-apply handoff
  - is the strongest nearby runtime host for inventorying where Catalog behavior has already become real instead of staying hypothetical
- `src/app/workspace/CatalogSurface.test.tsx`
  - already proves the browse shell, temporary preview session, downstream repo-backed commit handoff, imports reuse path, and environment apply path
  - is the strongest nearby proof surface for inventorying which behaviors are already shipped versus still only planned
- live asset layout
  - repo-backed geometry still lives under `public/ReferenceModels/...`
  - Catalog preview media already lives under `public/CatalogPreviews/...`
  - `public/Catalog/...` has started to exist for newer Catalog-owned content, but the reference-family runtime does not yet read from it

So the first honest implementation read is:
- `Phase 1` should stay inventory-first
- it should classify current owners, paths, and touchpoints explicitly
- it should stop before trying to fix the drift it discovers

The live inventory is now:

- Browser-side preload owner
  - `src/app/store/useAppStore.ts` still seeds the initial `referenceWorkspace` from `REFERENCE_MANIFEST_ITEMS` through `buildInitialReferenceRecords(...)`
  - those seeded records keep `sourceKind: 'manifest'`, preserve the manifest category ids, and resolve their URLs through `resolveReferenceAssetPath(...)`
- Browser-side consumer surface
  - `selectReferenceWorkspaceBrowserTree(...)` in `src/app/store/useAppStore.ts` still projects those manifest-backed records into the Browser `References` root with explicit `footpads`, `shoes`, and `premade-foothooks` categories
  - `src/app/panels/useBrowserPanelController.ts` still consumes that Browser tree directly, so the old manifest-backed preload remains a real Browser-facing surface rather than only dormant data
- Catalog repo-backed source seam
  - `src/app/catalog/catalogSeedItems.ts` already carries the first curated repo-backed Catalog entries for `footpads`, `shoes`, `foothooks`, and one `environment`
  - `src/app/catalog/catalogSource.ts` turns those repo seeds plus imported references from `referenceWorkspace` into the shared Catalog snapshot, so Catalog already has one real browse-owned source seam instead of only a future plan
- Catalog runtime host and shipped touchpoints
  - `src/app/workspace/CatalogSurface.tsx` already hosts the real Catalog runtime through the shared source snapshot, preview-session state, repo-backed add-to-project handoff, and environment-apply handoff
  - `src/app/workspace/CatalogSurface.test.tsx` already proves the shipped browse shell, temporary preview session, imports reuse, repo-backed commit path, and viewer-environment apply path, so these are live Catalog touchpoints rather than only design intent
- Environment entry and consumer path
  - `src/app/catalog/catalogSeedItems.ts` already exposes `environment:studio` as the first Catalog environment item
  - `src/app/catalog/catalogActionPlan.ts` and `src/app/catalog/catalogEnvironmentApply.ts` already classify that entry onto the `viewer-environment` downstream owner path
  - `src/app/workspace/CatalogSurface.tsx` applies that handoff through `setViewKey('envPreset', ...)`, while `src/app/components/ViewToolbar.tsx` still exposes the shared environment preset owner on the broader viewer side
- Public asset-home split
  - `public/ReferenceModels/` still holds the live repo-backed geometry assets for `footpads`, `hooks`, and `shoes`
  - `public/CatalogPreviews/` already holds the current Catalog-facing preview media for `footpads`, `hooks`, `shoes`, and `environments`
  - `public/Catalog/` now exists, but the current reference-family runtime does not yet read those repo-backed reference assets from that folder, so the asset-home migration remains prep work rather than shipped truth

So the current owner-and-consumer map reads like this:

- repo-backed reference manifest truth
  - owner:
    - `src/app/references/referenceManifest.ts`
  - current consumers:
    - `src/app/store/useAppStore.ts`
    - Browser reference tree selectors and controllers
    - Catalog reference commit and preview-source helpers through resolved asset paths
- Catalog browse and preview choice
  - owner:
    - `src/app/catalog/catalogSeedItems.ts`
    - `src/app/catalog/catalogSource.ts`
    - `src/app/catalog/catalogPreviewSession.ts`
    - `src/app/workspace/CatalogSurface.tsx`
  - current consumers:
    - `CatalogShell`
    - `CatalogSurface.test.tsx`
- downstream repo-backed commit
  - owner:
    - `src/app/catalog/catalogReferenceCommit.ts`
    - `src/app/workspace/CatalogSurface.tsx`
  - current consumers:
    - `referenceWorkspace` imported-reference path in `useAppStore`
    - Browser imported reference tree after Catalog commit
- viewer environment apply
  - owner:
    - `src/app/catalog/catalogEnvironmentApply.ts`
    - shared `envPreset` view setting
  - current consumers:
    - `src/app/workspace/CatalogSurface.tsx`
    - `src/app/components/ViewToolbar.tsx`

#### First Pass Decisions

- treat this phase as a current-state inventory pass, not as the first cleanup implementation
- inventory reference-style assets, environment entries, and Catalog shell/runtime touchpoints together so later `Phase 2` and `Phase 3` can work from one shared map
- explicitly record where older Browser-era preload assumptions still survive through pathing, naming, or runtime seams
- keep the output focused on owner classification and drift inventory instead of jumping ahead into migration or redesign

### Phase 1 Implementation Spec
#### Exact First Code Cut

1. Inventory the current repo-backed reference families that already exist across `referenceManifest.ts`, `catalogSeedItems.ts`, and the public asset folders.
2. Inventory the current environment entry and consumer path so the `HDRI` or environment lane is included in the same current-state read instead of being rediscovered later.
3. Inventory the current Catalog UI and runtime touchpoints that already ship through `CatalogSurface.tsx`, related Catalog source seams, and `CatalogSurface.test.tsx`.
4. Record one explicit owner-and-consumer map that distinguishes:
   - Browser-era preload or reference seams
   - Catalog-owned browse or preview seams
   - downstream Browser-project commit seams
   - viewer-environment apply seams
5. Stop after the inventory is explicit enough that `Phase 2` and `Phase 3` can reuse it directly.

#### Likely Files

- `src/app/references/referenceManifest.ts`
- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/CatalogSurface.test.tsx`
- `public/ReferenceModels/`
- `public/CatalogPreviews/`
- `public/Catalog/`
- this `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen0-Index.md`

#### No-Widening Rule

- do not start moving assets or changing runtime paths in this phase
- do not reopen Browser-versus-Catalog boundary decisions that belong to `Phase 2`
- do not start manifest-field redesign or item-contract widening that belongs to `Phase 3`
- do not treat the inventory pass as the first real `Catalog-1` runtime cut

#### Implementation Risks

- mixing inventory with cleanup and losing the honest current-state read
- under-inventorying the already-shipped environment or imports-adjacent seams because the phase focuses only on shoes, hooks, and footpads
- listing files without classifying the real owner and consumer relationship, which would force later phases to redo the discovery work

#### Checklist

- [x] the current preloaded reference families are inventoried across manifest, seed, and public asset seams
- [x] the current environment entry and consumer path are inventoried alongside the reference lanes
- [x] the current Catalog UI and runtime touchpoints are inventoried from the shipped surface host and proof seams
- [x] one explicit owner-and-consumer map exists for later `Phase 2` and `Phase 3`

#### Verification Shape

Minimum verification for this phase should cover:

- the inventory names the live repo-backed reference owners and asset-home paths
- the inventory names the current Catalog-facing source, preview, and commit owners
- the inventory names the current viewer-environment apply owner
- the resulting read is explicit enough that the next cleanup phases do not need to rediscover where the drift currently lives

#### Done Shape

`Phase 1` is done when:

- the repo has one explicit current-state inventory of catalog-like drift
- later `Generation 0` cleanup phases can point at concrete owners instead of broad guesses
- the family can move into boundary cleanup and asset-home prep without reopening the basic "what already exists today?" question

`Phase 1` is now complete on that inventory basis.

## [ ] Catalog-Gen0 - Phase 2 - Ownership Boundary Cleanup

### Phase 2 Summary
#### Purpose

Clean up the owner split before the family starts so `Catalog-1` can build on explicit boundaries instead of re-litigating them during the first runtime slice.

#### Owns

- `Browser` versus `Catalog` boundary cleanup
- removing preloaded reference models from the default `Browser` baseline
- import versus catalog-reuse boundary cleanup
- preview-versus-commit ownership cleanup
- workspace-surface boundary cleanup

#### Does Not Own

- the first actual workspace registration or slot-switching proof
- asset-family loading behavior
- the later `Generation 2` widening lanes

#### Current Live Read

The `Phase 1` inventory now makes the surviving boundary drift fairly concrete:

- Browser-side manifest preload still survives as real runtime truth
  - `src/app/store/useAppStore.ts` still seeds `referenceWorkspace` directly from `REFERENCE_MANIFEST_ITEMS`
  - `selectReferenceWorkspaceBrowserTree(...)` still turns those manifest-backed records into the Browser `References` root
  - `src/app/panels/useBrowserPanelController.ts` still consumes that Browser tree directly
  - that means `foothooks`, `shoes`, and `footpads` still read as live Browser-resident default references instead of only later optional Catalog add-ins
- Catalog already exists as a real hosted surface
  - `src/app/workspace/ViewportSurfaceRegistry.tsx` already routes the `catalog` render family to `CatalogSurface`
  - `src/app/AppShell.tsx` already hosts detached floating Catalog surfaces
  - so the workspace-surface question is not whether Catalog exists; it is whether the remaining owner reads still blur Catalog with older Browser preload behavior
- Catalog source boundaries are already partly explicit, but still mixed
  - `src/app/catalog/catalogSeedItems.ts` owns repo-backed curated Catalog entries
  - `src/app/catalog/catalogSource.ts` keeps imports reuse separate by only projecting `sourceKind: 'imported'` records from `referenceWorkspace` into the Catalog `Imports` area
  - that means the imports-versus-curated split already exists, but `Phase 2` still needs to lock that this is reuse-only and not a second import owner
- Preview and commit seams are already distinct in code
  - `src/app/catalog/catalogPreviewSession.ts` owns temporary preview-loaded item state
  - `src/app/catalog/catalogReferenceCommit.ts` only resolves repo-backed reference items onto the downstream `browser-project` handoff
  - `src/app/workspace/CatalogSurface.tsx` then hands that request to `addImportedReference(...)`
  - so the code already contains the right split, but the prep lane still needs to lock that split as the boundary truth the family should preserve
- Environment apply is also already separate from reference commit
  - `src/app/catalog/catalogEnvironmentApply.ts` resolves only `environment` items onto the `viewer-environment` downstream owner
  - `src/app/workspace/CatalogSurface.tsx` applies that through `setViewKey('envPreset', ...)`
  - so the environment lane already has a separate owner path and should stay out of Browser-project reference truth

So the next honest implementation read is:
- `Phase 2` should not invent the owner split from scratch
- it should tighten and document the surviving boundary drift where the runtime still contradicts the intended Catalog-vs-Browser read
- it should stop before changing the asset home or widening metadata work that belongs later

#### First Pass Decisions

- treat this phase as an owner-read cleanup contract first, not as a broad asset migration
- explicitly lock that repo-backed reference preload should stop reading as Browser baseline truth and should instead belong to later optional Catalog browsing
- explicitly lock that Catalog `Imports` is reuse-only, not the import intake owner
- explicitly lock that temporary preview state, downstream repo-backed commit, and viewer-environment apply are separate systems that should not collapse back into one generic “load” meaning
- keep the phase grounded in the already-shipped workspace surface instead of reopening whether Catalog is a real workspace mode

### Phase 2 Implementation Spec
#### Exact First Code Cut

1. Re-read the live Browser-side manifest preload seams in `useAppStore.ts` and `useBrowserPanelController.ts`, then document exactly which owner assumptions must be retired so `foothooks`, `shoes`, and `footpads` stop reading as default Browser-resident content.
2. Re-read the Catalog source split in `catalogSeedItems.ts` plus `catalogSource.ts`, then lock the boundary that repo-backed curated entries belong to Catalog browse while imported entries only reappear there as reuse surfaces after intake.
3. Re-read the preview, commit, and environment seams in `catalogPreviewSession.ts`, `catalogReferenceCommit.ts`, `catalogEnvironmentApply.ts`, and `CatalogSurface.tsx`, then record one explicit boundary read that keeps:
   - preview temporary and Catalog-owned
   - repo-backed commit downstream to Browser-project truth
   - environment apply downstream to viewer-environment truth
4. Record one explicit workspace-surface boundary read that says Catalog is already a real hosted surface and should not be treated as a Browser subsection just because Browser preload drift still survives elsewhere.
5. Stop once the owner cleanup rules are explicit enough that later `Phase 3` asset-home and metadata prep can execute against stable boundaries instead of re-arguing them.

#### Likely Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/catalog/catalogSeedItems.ts`
- `src/app/catalog/catalogSource.ts`
- `src/app/catalog/catalogPreviewSession.ts`
- `src/app/catalog/catalogReferenceCommit.ts`
- `src/app/catalog/catalogEnvironmentApply.ts`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/AppShell.tsx`
- this `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen0-Index.md`

#### No-Widening Rule

- do not start the repo asset-home migration in this phase; that belongs to `Phase 3`
- do not widen into the first full Catalog runtime or family onboarding behavior; that belongs to `Catalog-1` and later
- do not reopen the basic inventory work from `Phase 1` unless one boundary note truly cannot be expressed without a tiny inventory correction
- do not turn this phase into external-source, builder, or compatibility planning

#### Implementation Risks

- solving the boundary drift by jumping straight into file moves or runtime deletions before the owner rules are explicit
- treating imports reuse as if it were the same thing as repo-backed curated Catalog content
- blurring temporary preview state back into commit semantics because both already exist in the Catalog runtime
- overstating the workspace-hosting problem even though Catalog is already a real hosted surface

#### Checklist

- [ ] the Browser-versus-Catalog boundary is explicit enough to retire the old Browser preload read later without confusion
- [ ] the imports-versus-Catalog-reuse boundary is explicit enough that Catalog stays a reuse surface instead of becoming the import owner
- [ ] the preview-versus-commit-versus-environment owner split is explicit enough that later runtime work can preserve it without guesswork
- [ ] the workspace-surface boundary is explicit enough that Catalog is treated as a real hosted surface, not a Browser subsection

#### Verification Shape

Minimum verification for this phase should cover:

- the phase names the surviving Browser preload owner that later cleanup must retire
- the phase names the current Catalog source and imports reuse owners separately
- the phase names the current preview, Browser-project commit, and viewer-environment apply owners separately
- the resulting boundary read is explicit enough that later cleanup or migration work can proceed without reopening the same owner questions

#### Done Shape

`Phase 2` is done when:

- the repo has one explicit owner-boundary cleanup read for Browser, Catalog, imports reuse, preview, commit, and environment apply
- later `Generation 0` work can retire the old Browser preload and asset-home drift against that shared boundary contract
- `Catalog-1` no longer needs to start by rediscovering what each early catalog-adjacent seam is actually allowed to own

## [ ] Catalog-Gen0 - Phase 3 - Curated Asset And Metadata Prep

### Purpose

Prepare the first curated asset baseline and manifest-adjacent metadata reads so `Catalog-1` can lock a real item contract without starting from scattered ad hoc asset assumptions.

### Owns

- later optional reference-family inventory for `foothooks`, `shoes`, and `footpads`
- the first `HDRI` inventory
- preview-media gap inventory
- repo-backed asset-home cleanup for the first catalog-owned reference families
- stable id or slug prep
- first manifest-field prep
- `Imports` area readiness notes

### Does Not Own

- the final item contract itself
- manifest runtime loading
- the first visible catalog shell

## [ ] Catalog-Gen0 - Phase 4 - Generation 1 Start Boundary Cleanup

### Purpose

Lock the handoff from prep into the first real family phase so the repo can say clearly when `Catalog` has actually moved from cleanup into implementation.

### Owns

- the definition of the first real `Catalog` family start
- the `Catalog-1` entry checklist
- the rule that the old Browser preload behavior is gone before later optional add-ins arrive
- the rule that `Generation 2` widening should stay out of the `Generation 1` baseline start
- first standalone doc routing for the family start

### Does Not Own

- executing `Catalog-1`
- executing `Catalog-Gen2`
- later builder or compatibility work

### Summary

The `Generation 0` cleanup direction is now:
- stay honest that the `Catalog` family has not started yet
- inventory the current catalog-like drift before new runtime work begins
- move the preloaded reference models out of `Browser` so `foothooks`, `shoes`, and `footpads` stop reading as default Browser-resident content
- clean up owner boundaries between `Catalog`, `Browser`, import, viewer state, and shared workspace hosting
- prepare `foothooks`, `shoes`, and `footpads` as later optional add-ins, alongside the first `HDRI` and `Imports` baseline prep
- give repo-backed reference assets one clearer Catalog-owned home instead of letting older `ReferenceModels` path drift quietly survive into later family phases
- lock a clean handoff so `Catalog-1` can start as the first real family phase and `Catalog-Gen2` can stay a later widening lane

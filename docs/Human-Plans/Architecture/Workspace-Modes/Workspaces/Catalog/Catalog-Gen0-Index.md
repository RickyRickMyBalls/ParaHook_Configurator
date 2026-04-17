# Catalog Gen0 Index

## Doc Header

### Doc History
2. 2026-04-16 17:10:00: Tightened `Generation 0` so the prep lane now explicitly includes moving the current preloaded reference models out of `Browser`, clarifying that `foothooks`, `shoes`, and `footpads` should stop reading as default Browser-resident content during cleanup and instead become later optional add-ins the user can choose intentionally
1. 2026-04-16 16:55:23: Added this dedicated `Catalog-Gen0-Index.md` planning surface so the `Catalog` family can stay honest that it has not started yet, defining `Generation 0` as the cleanup-and-prep band before `Catalog-1` and splitting that prep into explicit cleanup phases for drift inventory, ownership-boundary cleanup, curated asset or metadata prep, and the `Generation 1` start-boundary lock

### Purpose

This file is the focused planning index for `Catalog Generation 0`.

Use it to answer:
- what `Generation 0` means for the `Catalog` family
- which cleanup or prep work should happen before `Catalog-1`
- how to keep pre-start cleanup separate from the first real catalog implementation phase
- what the first `Generation 0` cleanup phases should be

### Scope

This doc covers:
- current catalog-like behavior inventory
- ownership-boundary cleanup before the family starts
- first curated asset and metadata prep
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
- leave those families as later optional add-ins the user can choose intentionally

Important rule:
- `Generation 0` is not a partial `Generation 1`
- if work starts adding a real `Catalog` surface, manifest runtime, or preview or load behavior, that work belongs to `Catalog-1` or later instead

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

### Generation 0 Summary

`Generation 0` should:
- inventory where catalog-like behavior already exists today
- clean up owner and boundary reads before a real `Catalog` workspace lands
- move the current preloaded reference models out of the `Browser` baseline
- prepare the first curated asset and metadata baseline
- lock what should count as the actual `Generation 1` start

Important rule:
- `Generation 0` should reduce ambiguity
- it should not quietly start the real `Catalog` runtime under cleanup language

## Cleanup Phase Tracking

Use the `Generation 0` cleanup phases to organize the current prep like this:

### `Catalog-Gen0-1` - Existing Catalog-Like Drift Inventory
  - [ ] `G0-1. Preloaded Reference Models In Browser Inventory`
  - [ ] `G0-2. HDRI Entry And Consumer Inventory`
  - [ ] `G0-3. Catalog-Like UI Touchpoint Inventory`
  - [ ] `G0-4. Current Asset Owner And Consumer Map`
  #### - phase target:
    - identify where catalog-like behavior already leaks through preload, Browser, viewer, or shell seams
    - create one honest current-state inventory before the family starts

### `Catalog-Gen0-2` - Ownership Boundary Cleanup
  - [ ] `G0-5. Browser Versus Catalog Boundary Cleanup`
  - [ ] `G0-6. Remove Preloaded Reference Models From Browser Baseline`
  - [ ] `G0-7. Import Versus Catalog Reuse Boundary Cleanup`
  - [ ] `G0-8. Preview Versus Commit Ownership Cleanup`
  - [ ] `G0-9. Workspace-Surface Boundary Cleanup`
  #### - phase target:
    - restate and tighten the owner split between `Catalog`, `Browser`, import, viewer state, and shared workspace hosting
    - make the user stop starting with browser-resident `foothooks`, `shoes`, and `footpads` as implied default project content
    - prevent `Catalog-1` from reopening the same boundary questions during its first runtime cut

### `Catalog-Gen0-3` - Curated Asset And Metadata Prep
  - [ ] `G0-10. Later Optional Reference Family Inventory`
  - [ ] `G0-11. Preview Media Gap Inventory`
  - [ ] `G0-12. Stable Item Id And Slug Prep`
  - [ ] `G0-13. Manifest-Field Prep For First Families`
  - [ ] `G0-14. Imports Area Readiness Notes`
  #### - phase target:
    - prepare `foothooks`, `shoes`, and `footpads` as later optional add-in families instead of default Browser preload
    - prepare the first `HDRIs` and `Imports` reads so the later item contract can start from explicit prep instead of scattered filenames and assumptions

### `Catalog-Gen0-4` - Generation 1 Start Boundary Cleanup
  - [ ] `G0-15. First Real Family Start Definition`
  - [ ] `G0-16. Catalog-1 Entry Checklist`
  - [ ] `G0-17. Keep Generation 2 Widening Out Of Generation 1 Start`
  - [ ] `G0-18. First Standalone Doc Routing`
  #### - phase target:
    - lock what should count as "the `Catalog` family has started"
    - lock that later optional reference add-ins are not the same thing as old Browser preload
    - keep `Generation 0` prep, `Generation 1` baseline work, and `Generation 2` widening from blurring together

## Cleanup Phase Reads

## [ ] Catalog-Gen0-1 - Existing Catalog-Like Drift Inventory

### Purpose

Inventory the current catalog-like behavior already scattered across preload, Browser, viewer, or shell seams so the family starts from one explicit current-state read.

### Owns

- current preloaded reference entry inventory
- where those reference models still read as `Browser`-resident defaults today
- current `HDRI` entry and consumer inventory
- current catalog-like UI touchpoint inventory
- the first owner and consumer map for reusable assets already implied by the repo

### Does Not Own

- the real `Catalog` workspace onboarding
- the first manifest runtime
- preview or commit behavior implementation

## [ ] Catalog-Gen0-2 - Ownership Boundary Cleanup

### Purpose

Clean up the owner split before the family starts so `Catalog-1` can build on explicit boundaries instead of re-litigating them during the first runtime slice.

### Owns

- `Browser` versus `Catalog` boundary cleanup
- removing preloaded reference models from the default `Browser` baseline
- import versus catalog-reuse boundary cleanup
- preview-versus-commit ownership cleanup
- workspace-surface boundary cleanup

### Does Not Own

- the first actual workspace registration or slot-switching proof
- asset-family loading behavior
- the later `Generation 2` widening lanes

## [ ] Catalog-Gen0-3 - Curated Asset And Metadata Prep

### Purpose

Prepare the first curated asset baseline and manifest-adjacent metadata reads so `Catalog-1` can lock a real item contract without starting from scattered ad hoc asset assumptions.

### Owns

- later optional reference-family inventory for `foothooks`, `shoes`, and `footpads`
- the first `HDRI` inventory
- preview-media gap inventory
- stable id or slug prep
- first manifest-field prep
- `Imports` area readiness notes

### Does Not Own

- the final item contract itself
- manifest runtime loading
- the first visible catalog shell

## [ ] Catalog-Gen0-4 - Generation 1 Start Boundary Cleanup

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
- lock a clean handoff so `Catalog-1` can start as the first real family phase and `Catalog-Gen2` can stay a later widening lane

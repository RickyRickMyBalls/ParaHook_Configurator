# Catalog Phase Catalog-3 - HDRI Catalog And Explicit Environment Apply Path

## Summary

This standalone `Catalog-3` family doc owns the `Generation 1` HDRI lane.

The family phase is now complete. `Catalog-3` closed by keeping HDRIs on their own explicit viewer-apply path while making the Catalog surface honest about that split:
- the grid now shows static HDRI preview media instead of a fake "load preview" placeholder
- HDRI cards now expose a direct `Apply Environment` action
- the item page now shows static HDRI preview media while preserving the explicit shared viewer-owner handoff

## Purpose

Add `HDRIs` as a dedicated Catalog family without forcing them through the geometry/reference preview-and-commit path.

## Owns

- HDRI onboarding through the existing Catalog shell
- HDRI preview honesty in the grid and item page
- explicit `Apply Environment` actions that stay separate from `Add To Project`
- the rule that HDRIs remain viewer/environment state rather than Browser project content

## Does Not Own

- the earlier geometry/reference-family `Add To Project` path
- the broader search/metadata scale-up lane
- later project/session identity follow-through for repo-backed reference items

## Family HLG

- [x] `Catalog-3-HLG-1. Keep HDRI Ownership Honest Against The Earlier Reference Flow`
- [x] `Catalog-3-HLG-2. Make HDRI Cards And Item Pages Read Like Environment Presets Instead Of Unloadable Geometry`

## CLG

- [x] `Catalog-3-CLG-1. Surface Static HDRI Preview Media Without Reusing The Temporary Reference Preview Session`
- [x] `Catalog-3-CLG-2. Expose A Direct Grid-And-Item-Page Apply Path`
- [x] `Catalog-3-CLG-3. Close The Umbrella Index Against The Finished HDRI Lane`

## Internal Phases

### [x] Phase 1 - HDRI Preview Surface Honesty

- confirmed the environment apply seam already existed in `CatalogSurface.tsx`
- replaced the unloaded HDRI preview placeholder in the grid with static preview media
- replaced the unloaded HDRI preview placeholder on the item page with static preview media

### [x] Phase 2 - Direct HDRI Apply Actions

- kept HDRIs off the temporary preview-session contract
- added a direct grid-card `Apply Environment` action for eligible HDRI entries
- preserved the existing item-page `Apply Environment` action

### [x] Phase 3 - Family Closeout

- created this standalone future doc
- updated `Catalog-Index.md` so `Catalog-3` reads complete
- recorded the family-phase completion in `docs/CHANGELOG.md` and `docs/Doc-Log.md`

## Done Shape

`Catalog-3` is done when:
- HDRIs show honest static preview media in the Catalog shell
- HDRIs apply through the shared viewer-owner seam instead of pretending to be reference preview items
- the umbrella `Catalog-Index.md` reads `Catalog-3` as complete with this future doc as its source record

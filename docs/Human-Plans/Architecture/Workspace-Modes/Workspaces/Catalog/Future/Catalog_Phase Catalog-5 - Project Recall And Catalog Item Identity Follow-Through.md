# Catalog Phase Catalog-5 - Project Recall And Catalog Item Identity Follow-Through

## Summary

This standalone `Catalog-5` family doc owns the `Generation 1` identity-and-recall lane.

The family phase is now complete. `Catalog-5` keeps enough catalog-item identity after `Add To Project` so the Catalog surface can remember what curated repo-backed asset was chosen without becoming the hidden runtime owner:
- the Catalog reference-commit handoff now carries the source Catalog item id and family key
- imported references in `useAppStore.ts` now preserve that Catalog identity
- exploded imported references keep the same remembered Catalog identity
- the Catalog imports snapshot and item shaping now rebuild remembered metadata, notes, and project-usage counts from the original curated item when possible

## Purpose

Preserve enough item identity follow-through that the Catalog can remember which curated item became project content, while still leaving project truth owned by downstream Browser/content systems.

## Owns

- Catalog item identity on the `Add To Project` handoff
- remembered Catalog identity on downstream imported references
- rebuilding imports reuse cards from remembered curated Catalog items when possible
- project-usage readback that tells the user whether a curated item is already in project content

## Does Not Own

- the original reference commit/add path itself
- the earlier search or metadata scale-up lane
- turning the Catalog into the long-term owner of imported project content

## Family HLG

- [x] `Catalog-5-HLG-1. Preserve Enough Catalog Identity After Commit To Support Honest Recall`
- [x] `Catalog-5-HLG-2. Keep Browser Project Content As The Runtime Owner Even While Catalog Remembers The Curated Source`

## CLG

- [x] `Catalog-5-CLG-1. Carry Catalog Identity Through The Repo Commit Handoff`
- [x] `Catalog-5-CLG-2. Persist That Identity On Imported References And Exploded Children`
- [x] `Catalog-5-CLG-3. Rebuild Imports Reuse Cards From Remembered Catalog Metadata Where Available`
- [x] `Catalog-5-CLG-4. Surface Project-Usage Counts Back On Curated Repo Items`
- [x] `Catalog-5-CLG-5. Close The Umbrella Index And Catalog-6 Decision Honestly`

## Internal Phases

### [x] Phase 1 - Commit Handoff Identity

- widened `CatalogReferenceCommitRequest` with `catalogItemId` and `catalogFamilyKey`
- passed that identity through `CatalogSurface.tsx` when a repo-backed item is added to the project

### [x] Phase 2 - Store Identity Persistence

- widened `ImportedReferenceRecord` and the `addImportedReference(...)` seam with optional Catalog identity fields
- preserved the remembered Catalog identity when wrapper references explode into child imported references

### [x] Phase 3 - Imports Recall Rebuild

- widened the Catalog imports snapshot to preserve remembered Catalog item ids
- rebuilt imports reuse cards from the original curated item when the remembered source still exists
- surfaced project-usage counts on repo-backed items so the Catalog can say when a curated entry is already represented in project content

### [x] Phase 4 - Family Closeout And Catalog-6 Decision

- created this standalone future doc
- updated `Catalog-Index.md` so `Catalog-5` reads complete
- recorded that `Catalog-6` is not needed because the remaining `Generation 1` wishlist now fits honestly inside completed `Catalog-3`, `Catalog-4`, and `Catalog-5`
- recorded the family-phase completion in `docs/CHANGELOG.md` and `docs/Doc-Log.md`

## Done Shape

`Catalog-5` is done when:
- `Add To Project` preserves enough Catalog identity to remember the original curated source
- imports reuse cards rebuild from that remembered Catalog source when possible
- curated repo-backed cards can report remembered project usage
- the umbrella `Catalog-Index.md` reads `Catalog-5` as complete and records that `Catalog-6` is not needed for `Generation 1`

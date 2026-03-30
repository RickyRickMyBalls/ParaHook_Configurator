# Browser-11.5 - Cross-Parent First-Drop Ordering Parity

## Doc Header

### Doc History
1. 2026-03-29 10:06: Marked `Browser-11.5 - Cross-Parent First-Drop Ordering Parity` shipped after Browser child-slot hover can now commit a first cross-parent move directly beside the visible anchor row, the controller aligns that preview with a narrow ordered follow-up move, and owner-row `into` behavior stays intact where no specific child slot is being targeted

## Doc Body

## Summary

Polish Browser cross-parent drag so the first legal drop into a target owner can land directly at the intended child slot.

Shipped outcome:
- hovering a concrete child slot inside `Assembly 1` or another legal owner can now commit that first cross-parent move directly at the intended landing position
- the user no longer has to do `drop into owner first, then reorder` when the Browser is already showing a concrete child-slot target
- plain owner-row `into` behavior still stays intact for cases where the user is targeting the owner itself rather than a specific child slot

## What Landed

- widened `browserContentDrag` so hovering a child row can synthesize a legal cross-parent landing lane that still commits through the shared owner move seam
- added a narrow controller-side follow-up reorder remap so a first cross-parent child-slot drop now resolves as:
  - move into the target owner
  - then immediately order beside the visible anchor row
- kept owner-row hover behavior honest as plain `into`, so this phase improves child-slot first-drop ordering without giving owner-row hover a second meaning
- refreshed BrowserPanel regressions so the suite now proves both:
  - owner-row cross-parent hover still commits as `into`
  - child-row cross-parent hover lands directly beside the intended visible anchor on the first move

## Scope / Constraints Honored

- kept the change narrowly focused on preview-versus-commit alignment for first cross-parent ordering instead of redesigning the shared store move contract
- preserved same-parent reorder behavior and empty/collapsed-owner `into` behavior
- avoided changing the Browser tree, owner model, or runtime/reference compatibility seams in the same pass

## Follow-On Notes

- Browser-11 now has a landed first-pass follow-on for the “drop onto owner first, then reorder” friction that remained after `11.4`
- the current narrow remap intentionally only upgrades cross-parent child-slot targeting; it does not redefine plain owner-row hover as an ordered-slot move
- deeper drag-contract unification remains separate from this shipped Browser polish cut

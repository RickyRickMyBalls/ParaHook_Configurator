# Execute `4_CodexContext.md` With Stepwise Checkbox Updates

## Summary

Carry out the remaining family phase-plan normalization work in the exact queue already tracked in [4_CodexContext.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Archive/CodexContext/4_CodexContext.md), and update that tracker after each major step:

1. create file
2. set up template
3. complete information pass

Do not wait until a whole family file is fully finished before updating the tracker. Check off `1`, then `2`, then `3` as each major step is actually completed. Use the `3A-3H` items as the completion standard for step `3`, but do not require a visible tracker update after every sub-step.

## Implementation Changes

- Process the remaining family files in the existing queue order:
  - `07_AS - Phase-Plans.md`
  - `08_VR - Phase-Plans.md`
  - `09_DBG - Phase-Plans.md`
  - `10_JK - Phase-Plans.md`
  - `11_SP - Phase-Plans.md`
  - `12_EX - Phase-Plans.md`
  - `13_ADV - Phase-Plans.md`

- For each file, use this exact execution pattern:
  - complete step `1`: create the file with the canonical name
  - immediately update that file’s `1.` checkbox in [4_CodexContext.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Archive/CodexContext/4_CodexContext.md)
  - complete step `2`: apply the settled family template from [00_Phase-Setup.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Phase-Plans/00_Phase-Setup.md)
  - immediately update that file’s `2.` checkbox
  - complete step `3`: perform the full changelog information pass
  - only when `3A-3H` are all done, check off `3.` and its sub-items together

- Treat step `3` as complete only when all of these are done for the current family:
  - `3A` collect all matching family entries from [CHANGELOG.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/CHANGELOG.md)
  - `3B` classify phases as completed, reconstructed, or future placeholders
  - `3C` write `Human Summary` lines for completed phases
  - `3D` write or strengthen `Phase Summary` blocks
  - `3E` build grouped detailed checklist content from changelog detail
  - `3F` add `Files Changed` or equivalent file-footprint sections where the changelog supports it
  - `3G` apply `- Reconstructed` to titles where the evidence supports it
  - `3H` add cautious `[L]` or `[R]` markers only where the changelog or current app state clearly justifies them

- Keep the visible tracker update granularity at major-step level:
  - yes: update after `1`, `2`, and `3`
  - no: do not update after every `3A-3H` micro-step unless a file is being paused mid-information-pass and the partial sub-step visibility is needed for handoff

- After each family file reaches completed step `3`, perform the normal follow-through:
  - update the corresponding progress state in [14_DOC - Phase-Plans.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Phase-Plans/14_DOC%20-%20Phase-Plans.md) under `Phase 14F`
  - add one active-batch entry in [Chill-Log.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Chill-Log.md) summarizing that family-file pass

- Apply consistent content rules across all families:
  - use the settled family-file folding/header format exactly as documented in `00_Phase-Setup.md`
  - use `Files Changed` as the default file-footprint heading unless a specific family later needs a stronger alternative
  - keep future phases as lightweight placeholders if the changelog does not contain enough evidence
  - avoid inventing detail for missing phases; prefer placeholder summaries and unchecked future checklist items

- Special handling:
  - `SP` is the most likely candidate for a dense or multi-entry information pass; still treat it as one family file, but allow the step `3` work to be internally chunked before the final `3.` checkbox is marked
  - if a family has no completed phases evidenced in the changelog, still complete `1` and `2`, then leave `3` incomplete with future placeholders only

## Test Plan

- For one family file, verify the tracker updates happen in this order:
  - file created -> `1` checked
  - template applied -> `2` checked
  - changelog information pass finished -> `3` and `3A-3H` checked
- Verify each finished family file contains:
  - proper header/template structure
  - correct phase titles and future placeholders
  - `Human Summary`
  - `Phase Summary`
  - grouped checklist content
  - `Files Changed`
  - reconstructed labels where appropriate
- Verify [14_DOC - Phase-Plans.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Phase-Plans/14_DOC%20-%20Phase-Plans.md) stays aligned with the completed family files after each full step-`3` pass.
- Verify [Chill-Log.md](/c:/Users/Rubbe/Desktop/ParaHookConfig/20/parahook/docs/Chill-Log.md) gets one batch entry per completed family-file pass, not one entry per checkbox tick.

## Assumptions

- `4_CodexContext.md` is the temporary operational tracker and can be updated continuously during the batch.
- The intended visible completion granularity is major-step level (`1`, `2`, `3`), not every `3A-3H` sub-step.
- `CHANGELOG.md` remains the primary evidence source for the information pass.
- The current file queue in `4_CodexContext.md` is the correct execution order unless the user later reprioritizes a family.

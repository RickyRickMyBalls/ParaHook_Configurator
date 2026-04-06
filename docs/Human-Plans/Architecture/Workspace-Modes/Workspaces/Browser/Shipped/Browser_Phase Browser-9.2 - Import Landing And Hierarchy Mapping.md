# Browser-9.2 - Import Landing And Hierarchy Mapping

## Summary

Define how imported content should land inside the converged Browser hierarchy after `Browser-9.1` removes the old special reference tree species.

Locked outcome:
- default imported single objects land as normal `Object` rows
- imports land inside the user's working hierarchy by default
- Browser only maps imports upward into `Component` or `Subassembly` when the source file clearly contains richer structure
- imports do not create unnecessary wrapper `Assembly` rows for plain single-object files
- Browser keeps current imported-object transform compatibility intact while the landing model changes

## Scope

This phase covers:
- default Browser landing rules for imported content
- parent-choice rules for where imports land in the working hierarchy
- when richer imported structure should map upward above `Object`
- how Browser should keep imported objects visually/object-semantically aligned with the converged hierarchy after import

This phase does not cover:
- part-row exposure under imported objects
- deeper import-catalog UX
- synthetic wrapper assemblies for simple single-object imports
- full shared object-transform backend convergence between imported and generated objects

## Locked Direction

- default single-object import should stay object-first
- import should normally land in the current working hierarchy:
  - the selected valid owner when possible
  - otherwise the broader working assembly
- only widen above `Object` when the source file clearly contains richer internal hierarchy
- do not introduce a dedicated permanent isolated reference-only landing area
- do not force a same-pass transform migration while changing landing rules

## Shipped Result

- imported references now record a Browser landing parent at import time
- Browser keeps imported rows on their existing `referenceId` seam for current reference/viewer transform compatibility
- landed imported rows no longer need the old visible `User References` branch in Browser
- imported rows now render inside the content tree under the resolved assembly/component parent while keeping their darker imported-object row treatment
- the first-pass landing order now follows:
  1. selected valid owner
  2. broader working assembly
  3. fallback top-level assembly when nothing more specific is available

## Verification

- `cmd /c npx vitest run src/app/panels/selectBrowserTreeRows.test.ts src/app/panels/BrowserPanel.test.tsx src/app/store/useAppStore.test.ts`
- `cmd /c npx tsc --noEmit`

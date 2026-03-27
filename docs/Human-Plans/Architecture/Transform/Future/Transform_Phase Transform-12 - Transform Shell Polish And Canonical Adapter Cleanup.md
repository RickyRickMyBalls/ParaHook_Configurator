# Transform Phase Transform-12 - Transform Shell Polish And Canonical Adapter Cleanup

## Doc Header

### Doc History
1. 2026-03-27 14:45: Created this standalone implementation-ready `Transform 12` future phase doc as the next Transform follow-on after the shipped `Transform 11` Console snap parity cleanup, narrowing the work to transform-shell adapter honesty, canonical breadcrumb/status cleanup, root shortcut polish, and small toolbar-density cleanup without widening transform state or viewer execution again

### Purpose

This phase cleans up transform-shell polish after the heavier `Transform 7` through `Transform 11` behavior work landed.

Use it to answer:
- which transform-root shortcuts should exist as honest adapters into the shared owner paths
- how adapter jumps should print canonical breadcrumbs and `Choose next [...]` summaries
- how toolbar and Console wording should stay aligned after the recent snap and space work
- what small toolbar-density cleanup should land without turning this into a new transform-state phase

## Doc Body

## [ ] Transform 12 - Transform Shell Polish And Canonical Adapter Cleanup

### Summary

`Transform 12` starts after:
- `Transform 11`
  - Console snap parity cleanup shipped

By this point, the transform shell is broad and functional:
- `Move / Rotate / Scale`
- history scrub
- `Local / World`
- shared snap settings
- root aliases like `SE` and `SN`

The remaining work is mostly polish and adapter honesty. A few shortcuts exist, but the shell still needs a cleaner final pass so:
- root shortcuts read intentional instead of incremental
- adapter jumps always print the canonical owner path
- toolbar and Console wording stay aligned
- toolbar chrome reads tighter and less bulky without inventing new semantics

Phase outcome:
- transform-root shortcuts are cleaned up as explicit adapters instead of ad hoc affordances
- adapter jumps print the honest canonical path in Console summaries and transcript output
- space and snap wording stay aligned between Console and toolbar
- the transform toolbar gets a small density/chrome cleanup without changing transform state ownership

### Owns

- root transform-shell shortcut cleanup
- canonical breadcrumb and `Choose next [...]` summary cleanup for transform adapters
- Console/toolbar wording parity for transform settings state
- small transform-toolbar density and chrome cleanup

### Does Not Own

- new transform history semantics
- new snap state semantics
- new viewer or gizmo behavior
- target-ownership widening beyond the shipped reference-first transform shell

### Locked Outcome

- Keep one honest owner path for shared transform settings:
  - `Transform > Settings > Space`
  - `Transform > Settings > Snap`
- Keep root shortcuts as adapters, not second owners:
  - `SE` remains the root adapter for `Settings`
  - `SN` remains the root adapter for `Settings > Snap`
  - add `SP` as a root adapter for `Settings > Space`
- Root adapter jumps should print the canonical owner path in Console:
  - `Transform > SN` should narrate `Transform > Settings > Snap > Choose next [...]`
  - `Transform > SP` should narrate `Transform > Settings > Space > Choose next [...]`
  - `Transform > W` and `Transform > L` should continue to resolve through `Settings > Space`
- Toolbar and Console wording should stay aligned:
  - toolbar uses `On / Off` and `Locked / Unlocked`
  - Console continues to use `snap:On / snap:Off` and `snapXYZ:Lock / snapXYZ:Unlock`
  - resulting status text stays `On / Off` and `Locked / Unlocked`
- Transform root should stay intentionally ordered:
  - with no committed rows:
    - `Move`
    - `Rotate`
    - `Scale`
    - `Snap`
    - `Settings`
    - `Back`
  - with committed rows:
    - `CommitTransform`
    - `DeleteLatest`
    - `Move`
    - `Rotate`
    - `Scale`
    - `Snap`
    - `Settings`
- Toolbar density cleanup stays cosmetic:
  - tighten button chrome and spacing where the current shell still feels too bubbly
  - do not create new toolbar-only behavior in this phase

### Implementation Direction

Primary targets:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ReferenceTransformToolbar.test.tsx`

Recommended changes:
- add `SP` as a root transform alias that advances directly into the existing `referenceTransformSpaceRoot`
- review transform-root choices and aliases so the root feels intentionally curated instead of historically accumulated
- tighten staged summary and transcript text so direct adapters always narrate the canonical owner path
- keep `radioCommandIdentity` aligned with the cleaned adapter wording so root shortcuts and canonical paths still map to one stable identity family
- reduce remaining over-rounded toolbar chrome and spacing only through shared transform-toolbar classes, not one-off button overrides

### Test Plan

Verification should cover:
- `stagedNavigation`
  - `Transform` root exposes `Snap`
  - `SE`, `SN`, and `SP` all route into their canonical settings paths
  - direct adapter breadcrumbs print the canonical owner path
- `ConsoleDock`
  - `Transform > SP` lands in `referenceTransformSpaceRoot`
  - `Transform > SN` lands in `referenceTransformSnapRoot`
  - transcript and summary text show `Transform > Settings > ...` for both shortcuts
- `ReferenceTransformToolbar`
  - toolbar label/state wording still matches the shipped transform-shell wording after the chrome cleanup
- visual polish
  - transform-toolbar button sizes and section spacing tighten without breaking existing interaction tests

### Assumptions

- this stays reference-transform-first
- this is a polish phase, not a new transform-state phase
- all root shortcuts remain adapters into shared owner paths rather than creating second ownership seams

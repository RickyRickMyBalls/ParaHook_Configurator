# Transform Phase Transform-14 - Viewer Transform Rename And Shared Surface Alignment

## Doc Header

### Doc History
3. 2026-03-27 23:45: Marked this phase shipped after the user-facing `Viewer Transform` rename landed across the toolbar and Console shell while keeping the typed `Transform` token and current transform behavior unchanged
2. 2026-03-27 21:02: Tightened this `Transform 14` rename/alignment doc into a more implementation-ready phase by locking the exact rename scope to user-facing toolbar/shell wording, clarifying what must not be renamed yet, and adding concrete implementation targets plus a verification checklist
1. 2026-03-27 19:04: Rebuilt `Transform 14` as a narrower implementation-ready rename/alignment pass so the shared transform surface can become `Viewer Transform` without waiting on the later generated-object target-widening work

### Purpose

This phase renames the current transform surface to `Viewer Transform`.

Use it to answer:
- how the current reference-first transform naming should change
- what shared shell/header wording should be aligned under the new name
- how much of the phase should stay pure surface cleanup instead of widening target behavior
- what concrete files and user-facing labels should be updated in the first pass

## Doc Body

## [x] Transform 14 - Viewer Transform Rename And Shared Surface Alignment

### Summary

`Transform 14` starts after:
- the current reference-first transform shell is already real
- the existing transform surface name now reads narrower than the actual viewer-owned direction

This phase shipped as an intentionally narrow pass:
- rename the active transform surface to `Viewer Transform`
- align the shared shell/header wording to that name
- do not widen target behavior yet

Phase outcome:
- the active user-facing transform surface reads `Viewer Transform`
- toolbar and shell wording stop implying the tool is reference-only forever
- current transform behavior remains unchanged
- generated-object widening still belongs to later `Transform 15`

### Owns

- the rename from the older reference-first transform wording to `Viewer Transform`
- shared surface/header/shell wording alignment under that name
- toolbar, shell, and related transform-label cleanup needed to keep the rename honest

### Does Not Own

- internal store/type renames that are not user-visible
- generated-object transform behavior
- target-widening beyond the current reference path
- durable generated-object transform truth
- Replicad or graph-state transform writeback changes

### Locked Outcome

- the active transform toolbar/shell should be renamed `Viewer Transform`
- the old reference-first wording should stop reading like the feature is permanently reference-only
- the phase should stay a rename/alignment pass
- generated-object behavior should move to later `Transform 15`
- the first pass should prefer user-facing label cleanup over risky broad internal symbol churn

### Public Surface Direction

- rename the current transform toolbar/header to `Viewer Transform`
- align related shell wording to the same name
- keep one shared shell shape:
  - `Viewer Transform > Move`
  - `Viewer Transform > Rotate`
  - `Viewer Transform > Scale`
- keep current reference behavior otherwise unchanged in this phase

### Locked Rename Scope

Rename in this phase:
- transform toolbar/header wording
- transform-shell labels and adjacent user-facing wording
- docs that describe the active surface as if it is still only the older narrower transform name

Do not rename in this phase:
- underlying store/state ownership names unless needed for user-facing clarity
- durable history semantics
- target contracts
- generated-object behavior

### Implementation Targets

Primary user-facing targets:
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/radioCommandIdentity.ts`

Supporting docs targets:
- `docs/Human-Plans/Architecture/Transform/transform-index.md`
- `docs/CHANGELOG.md` or `docs/Doc-Log.md` as appropriate for the final change type

Secondary cleanup targets only if needed:
- any shared label/constants files that directly feed the active toolbar/shell wording

### Implementation Notes

- keep the current transform ownership and runtime behavior intact
- prefer renaming user-facing labels first instead of broad internal refactors
- do not rename internal types like `ReferenceTransform*` just for symmetry unless the implementation proves a direct user-facing mismatch
- if a surface still needs reference-specific wording for a truly reference-only subfeature, keep that wording precise rather than over-flattening everything to `Viewer Transform`

### Implementation Direction

- update user-facing transform labels so the active surface reads `Viewer Transform`
- keep the underlying current transform ownership intact
- avoid mixing target-widening behavior into this pass
- make sure docs, toolbar wording, and shell wording stay aligned

### Tests

- toolbar/header and related transform-shell labels read `Viewer Transform`
- Console breadcrumbs/prompts and transform-entry wording stay aligned with that rename
- existing reference transform behavior remains unchanged
- no generated-object transform behavior is introduced in this phase
- no transform navigation paths or snap/history behavior regress because of the rename

### Assumptions

- `Transform 14` is intentionally small and should land before the wider generated-object follow-on
- generated-object viewer motion belongs to later `Transform 15`
- the safest first pass is user-facing wording cleanup, not a sweeping internal symbol rename

# Transform Phase Transform-14 - Viewer Transform Rename And Shared Surface Alignment

## Doc Header

### Doc History
1. 2026-03-27 19:04: Rebuilt `Transform 14` as a narrower implementation-ready rename/alignment pass so the shared transform surface can become `Viewer Transform` without waiting on the later generated-object target-widening work

### Purpose

This phase renames the current transform surface to `Viewer Transform`.

Use it to answer:
- how the current reference-first transform naming should change
- what shared shell/header wording should be aligned under the new name
- how much of the phase should stay pure surface cleanup instead of widening target behavior

## Doc Body

## [ ] Transform 14 - Viewer Transform Rename And Shared Surface Alignment

### Summary

`Transform 14` starts after:
- the current reference-first transform shell is already real
- the existing transform surface name now reads narrower than the actual viewer-owned direction

This phase stays intentionally narrow:
- rename the active transform surface to `Viewer Transform`
- align the shared shell/header wording to that name
- do not widen target behavior yet

### Owns

- the rename from the older reference-first transform wording to `Viewer Transform`
- shared surface/header/shell wording alignment under that name
- toolbar, shell, and related transform-label cleanup needed to keep the rename honest

### Does Not Own

- generated-object transform behavior
- target-widening beyond the current reference path
- durable generated-object transform truth
- Replicad or graph-state transform writeback changes

### Locked Outcome

- the active transform toolbar/shell should be renamed `Viewer Transform`
- the old reference-first wording should stop reading like the feature is permanently reference-only
- the phase should stay a rename/alignment pass
- generated-object behavior should move to later `Transform 15`

### Public Surface Direction

- rename the current transform toolbar/header to `Viewer Transform`
- align related shell wording to the same name
- keep one shared shell shape:
  - `Viewer Transform > Move`
  - `Viewer Transform > Rotate`
  - `Viewer Transform > Scale`
- keep current reference behavior otherwise unchanged in this phase

### Implementation Direction

- update user-facing transform labels so the active surface reads `Viewer Transform`
- keep the underlying current transform ownership intact
- avoid mixing target-widening behavior into this pass
- make sure docs, toolbar wording, and shell wording stay aligned

### Tests

- toolbar/header and related transform-shell labels read `Viewer Transform`
- existing reference transform behavior remains unchanged
- no generated-object transform behavior is introduced in this phase

### Assumptions

- `Transform 14` is intentionally small and should land before the wider generated-object follow-on
- generated-object viewer motion belongs to later `Transform 15`

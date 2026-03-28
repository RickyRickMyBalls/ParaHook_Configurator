# Transform Phase Transform-15 - Generated Object Viewer Motion Under Viewer Transform

## Doc Header

### Doc History
1. 2026-03-27 19:04: Created this standalone implementation-ready `Transform 15` feature phase so generated objects can enter the renamed `Viewer Transform` shell while keeping that first target-widening pass explicitly viewer-only and not durable Replicad truth

### Purpose

This phase widens `Viewer Transform` to generated objects.

Use it to answer:
- whether generated objects can use the same `Viewer Transform` shell as references
- what generated-object transform is allowed to own before durable Replicad truth exists
- how generated-object viewer motion should stay honest in the first pass

## Doc Body

## [ ] Transform 15 - Generated Object Viewer Motion Under Viewer Transform

### Summary

`Transform 15` starts after:
- `Transform 14`
  - the shared transform surface has already been renamed to `Viewer Transform`

This phase widens that renamed shell to generated objects:
- generated objects can enter `Viewer Transform`
- generated objects can move / rotate / scale in the viewport
- those edits stay viewer/session-owned in the first pass

### Owns

- generated-object entry into the shared `Viewer Transform` shell
- generated-object move / rotate / scale in the viewport
- viewer/session-owned generated-object transform state
- honest first-pass generated-object commit/truth rules

### Does Not Own

- durable generated-object transform truth in Replicad or graph state
- rewriting generated geometry inputs to preserve those transforms
- assembly or mate-aware transform truth
- a separate generated-object transform UI

### Locked Outcome

- generated objects should be allowed to use the same `Viewer Transform` shell
- generated-object transforms stay viewer-only in the first pass
- generated-object transforms must not write back into Replicad generation truth, graph truth, or durable CAD state
- the feature should not fork a separate generated-object transform UI
- references and generated objects should adapt into the same shared shell, with target-specific truth rules below it

### Public Surface Direction

- allow generated objects to enter:
  - `Viewer Transform > Move`
  - `Viewer Transform > Rotate`
  - `Viewer Transform > Scale`
- keep the shell visually shared with the existing reference path
- keep any wording around generated-object commit/truth honest to viewer-only behavior

### Implementation Direction

- widen the current transform target contract so generated viewer objects can attach to the same shell
- keep actual transform execution viewer-owned
- introduce generated-object transform draft/state in viewer/app session state only
- keep commit behavior honest:
  - commit updates viewer/session transform state
  - commit does not claim to rewrite Replicad model truth

### UX Direction

- generated objects should not look artificially blocked from transform just because durable truth is a later problem
- the shell should still feel like one shared `Viewer Transform` tool
- no wording should imply saved CAD truth for generated-object transforms in the first pass

### Tests

- generated objects can enter the shared `Viewer Transform` shell
- generated objects can move / rotate / scale in the viewport
- generated-object transform state persists for the current viewer/session as intended
- generated-object commit does not write into Replicad or graph truth
- existing reference transform behavior remains unchanged

### Assumptions

- `Transform 15` stays viewer-first, not Replicad-truth-first
- durable generated-object transform ownership is a later follow-on
- one shared `Viewer Transform` shell is preferable to separate reference and generated-object tools

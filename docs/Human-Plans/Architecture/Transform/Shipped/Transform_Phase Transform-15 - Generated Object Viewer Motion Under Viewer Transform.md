# Transform Phase Transform-15 - Generated Object Viewer Motion Under Viewer Transform

## Doc Header

### Doc History
1. 2026-03-27 19:04: Created this standalone implementation-ready `Transform 15` feature phase so generated objects can enter the renamed `Viewer Transform` shell while keeping that first target-widening pass explicitly viewer-only and not durable Replicad truth
2. 2026-03-27 23:58: Tightened `Transform 15` into a more implementation-ready target-widening phase by locking first-pass generated-object eligibility, shared session-contract direction, viewer-only commit/cancel/history rules, concrete store/viewer/Console targets, and a sharper verification matrix
3. 2026-03-28 00:09: Marked `Transform 15` shipped after published generated objects gained the shared viewer-owned transform session path, viewer-only draft/commit/cancel behavior, and object-side Console/runtime handoff without Replicad or graph writeback

### Purpose

This phase widens `Viewer Transform` to generated objects.

Use it to answer:
- whether generated objects can use the same `Viewer Transform` shell as references
- what generated-object transform is allowed to own before durable Replicad truth exists
- how generated-object viewer motion should stay honest in the first pass

## Doc Body

## [x] Transform 15 - Generated Object Viewer Motion Under Viewer Transform

### Summary

`Transform 15` starts after:
- `Transform 14`
  - the shared transform surface has already been renamed to `Viewer Transform`

This phase widens that renamed shell to generated objects:
- generated objects can enter `Viewer Transform`
- generated objects can move / rotate / scale in the viewport
- those edits stay viewer/session-owned in the first pass
- the shared shell stays one tool, but generated-object truth rules stay explicitly viewer-only

### Owns

- generated-object entry into the shared `Viewer Transform` shell
- generated-object move / rotate / scale in the viewport
- one widened viewer-transform target/session contract that can point at generated objects
- viewer/session-owned generated-object transform draft and committed state
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
- first-pass generated-object eligibility is limited to `published-object`
- `receive-link` stays out of scope in this phase

### Target Eligibility

- include:
  - generated content objects with `objectSourceKind: 'published-object'`
- exclude:
  - `receive-link`
  - assemblies
  - multi-select
  - any durable graph-owned transform path

### Shared Session Contract Direction

- do not keep this phase reference-only under the hood
- widen the active transform contract from a reference-specific session to one viewer-transform session that can target either:
  - a reference
  - a generated content object
- the widened session should carry:
  - `targetKind: 'reference' | 'content-object'`
  - one stable target id:
    - `referenceId` for references
    - `objectRowId` for generated objects
  - `mode`
  - `space`
  - `entryOrigin`
  - `draftTransform`
  - the existing shell/entry/history-scrub metadata
- internal reference-heavy symbol names do not need a full repo-wide rename in this phase, but the runtime contract must stop assuming reference-only ownership

### Generated-Object Draft And Commit Rules

- generated-object transform draft lives in app/store session state and is rendered by the viewer
- generated-object commit writes only to viewer/session-owned transform state
- generated-object commit must not rewrite:
  - Replicad generation inputs
  - graph nodes
  - durable CAD truth
- generated-object cancel should revert the active draft to the last committed viewer-only generated-object transform
- generated-object committed viewer transform should survive:
  - shell exit
  - reselection inside the current app session
- generated-object committed viewer transform does not need to survive:
  - full app refresh
  - future durable model rebuild semantics not yet owned by this phase

### Generated-Object History Direction

- generated objects should use the same shared `Viewer Transform History` surface
- generated-object history remains target-local
- generated-object history entries are viewer-only history, not durable CAD truth
- history wording must stay honest to that viewer-only status where needed

### Public Surface Direction

- allow generated objects to enter:
  - `Viewer Transform > Move`
  - `Viewer Transform > Rotate`
  - `Viewer Transform > Scale`
- keep the shell visually shared with the existing reference path
- keep any wording around generated-object commit/truth honest to viewer-only behavior
- Browser and Console entry should stay shared with the current object path
- do not add a separate generated-object transform launcher or toolbar

### Implementation Direction

- widen the current transform target contract so generated viewer objects can attach to the same shell
- replace the reference-only viewer seam with a shared viewer-transform session seam
- keep actual transform execution viewer-owned
- introduce generated-object transform draft/state in viewer/app session state only
- keep commit behavior honest:
  - commit updates viewer/session transform state
  - commit appends generated-object viewer-only transform history
  - commit does not claim to rewrite Replicad model truth

### Concrete Implementation Targets

Primary runtime/store targets:
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Primary surface/adapter targets:
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleBar.tsx`

Supporting selection/content targets:
- `src/app/panels/selectBrowserTreeRows.ts`
- object-side browser/controller helpers that currently expose `Viewer Transform` but still assume no live object transform runtime underneath

### UX Direction

- generated objects should not look artificially blocked from transform just because durable truth is a later problem
- the shell should still feel like one shared `Viewer Transform` tool
- no wording should imply saved CAD truth for generated-object transforms in the first pass
- object-side move / rotate / scale should feel as real as reference-side viewer transform, even though the truth owner is different underneath

### Tests

- generated `published-object` rows can enter the shared `Viewer Transform` shell
- generated objects can move / rotate / scale in the viewport
- generated-object transform draft updates while the active viewer transform session is open
- generated-object commit persists viewer-only transform state for the current app session
- generated-object cancel restores the last committed viewer-only transform state
- generated-object history entries appear in the shared transform history surface
- generated-object commit does not write into Replicad or graph truth
- `receive-link` remains excluded in this phase
- existing reference transform behavior remains unchanged

### Assumptions

- `Transform 15` stays viewer-first, not Replicad-truth-first
- durable generated-object transform ownership is a later follow-on
- one shared `Viewer Transform` shell is preferable to separate reference and generated-object tools
- this phase is the target-contract widening pass, not yet the multi-select pass

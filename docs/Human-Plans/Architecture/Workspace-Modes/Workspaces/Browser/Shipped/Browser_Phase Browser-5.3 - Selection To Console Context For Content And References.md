# Browser Phase Browser-5.3 - Selection To Console Context For Content And References

## Doc Header

### Doc History
2. 2026-03-25 15:56: Marked Browser-5.3 shipped after the shared selection-to-console routing work landed, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered content/reference `Select > ...` scopes, reference root/category/item console depth, shared Browser/viewer parity, and selection-driven fallback back to broader scope
1. 2026-03-25 10:59: Created this standalone future Browser follow-up doc and made it implementation-ready, locking the first content/reference selection-to-console routing rules around immediate honest context sync, one rooted parent-owned `Select` scope for grouped content selection, lightweight reference scopes without auto-transform ownership, and deselect-driven fallback back to the nearest broader valid scope

### Purpose

This phase connects Browser content and reference selection to real Console context after the Browser-5 shared selection groundwork, Browser-5.1 reference cleanup, and Browser-5.2 grouped parent-selection pass landed.

Use it to answer:
- when Browser selection should move the Console into a new scope
- how rooted grouped content selection should map into one Console command root
- how lightweight reference selection should relate to future reference command scopes
- what should happen to selection-driven Console context when the user deselects

## Doc Body

## [x] Browser-5.3 - Selection To Console Context For Content And References

### Summary

This phase makes Browser content and reference selection move the Console into the nearest honest command scope instead of leaving content/reference selection mostly disconnected from the Console.

Phase outcome:
- selecting an `Assembly`, `Component`, or `Object` can move the Console into the nearest valid content command scope
- rooted grouped parent content selection keeps one parent/root as the Console command owner
- selecting a `Reference` can move the Console into a lightweight reference scope without auto-starting transform ownership
- empty-space deselect clears selection-driven local Console context back to the nearest broader valid scope

This phase does not yet ship explicit additive multi-select.

### Shipped Result

The first shipped Browser-5.3 cut landed the shared content/reference selection-to-console routing layer:
- selecting an `Assembly`, `Component`, or `Object` now moves the Console into the matching `Select > ...` content scope without auto-starting transform
- rooted grouped parent content selection keeps the parent/root as the Console command owner while grouped descendants remain the execution set behind that root
- selecting a reference root, category, or item now moves the Console into the matching lightweight reference scope with honest `Load All` or `Load Model` entry actions
- Browser row selection and viewer-picked selection now resolve through the same shared workspace-to-console seam for the same selected target
- empty-space deselect now clears lightweight selection-driven content/reference scope back to the nearest broader valid scope instead of leaving stale local Browser-driven context behind

### Owns

- Browser content-selection to Console-context routing
- Browser reference-selection to Console-context routing
- rooted grouped parent-selection mapping into one Console command root
- deselect fallback for lightweight selection-driven Console scope

### Does Not Own

- explicit additive multi-select
- `Ctrl+click` add/remove selection
- `Shift+click` anchor-to-range selection
- final content-command richness
- final reference transform tool design
- BrowserPanel structural cleanup

### Public Interfaces And State

This phase should continue treating `workspaceSelection.selectedTarget` as the primary selected target truth.

This phase should continue reading the Browser-5.2 grouped content-selection seam:
- one primary selected root target
- one resolved grouped descendant content-selection set

Console routing in this phase should resolve from shared workspace truth:
- `selectedTarget`
- grouped content-selection root plus resolved descendants where present
- current staged/session state where needed

Important rule:
- do not derive the real Console scope from Browser-local assumptions in `BrowserPanel`
- the same selected target should produce the same Console scope no matter which surface produced it

### Locked Behavior

#### 1. Immediate honest context sync

Meaningful content and reference selection should immediately push the Console into the nearest honest command scope.

Locked rule:
- meaningful content/reference selection updates Console context immediately
- the first cut may use intentionally small command sets
- do not fabricate noisy fake context for row families that still lack a real target or plausible command surface

First intended families:
- `assembly`
- `component`
- `object`
- `reference-item`

#### 2. Rooted grouped parent command ownership

Grouped parent content selection keeps one parent/root as the Console command owner.

Locked rule:
- keep the parent/root as the Console command root
- keep resolved grouped descendants as the execution set behind that root
- rooted grouped parent selection stays under `Select`, not `Multi Select`

Selection-path direction:
- single object selection should read like:
  - `> Select > Object 1`
- rooted parent selection should read like:
  - `> Select > Assembly 1`
  - with child/resolved-descendant membership shown only as supporting context
- only the later explicit mixed-selection case should become:
  - `> Multi Select > [...]`

#### 3. Lightweight reference scope

Reference selection may move the Console into a lightweight reference scope before stronger transform ownership begins.

Locked rule:
- ordinary reference selection may enter a lightweight reference scope once that scope exists
- ordinary selection does not auto-start `Move`
- ordinary selection does not auto-start `Rotate`
- lightweight reference scope remains distinct from explicit transform ownership

#### 4. Deselect fallback

Empty-space deselect should clear lightweight selection-driven Console context back to the nearest broader valid scope.

Locked rule:
- if selection was the reason the Console moved into a local content/reference scope, empty-space deselect returns the Console to the nearest broader valid scope
- do not leave stale Browser-driven selection scopes lingering after selection is gone
- keep this as lightweight context fallback, not as a fake command cancel path

### Initial Direction

The safest first cut is:
- keep Browser selection as the producer of shared selection truth
- keep Console scope as a consumer of that shared truth
- keep rooted grouped parent selection under one parent-owned `Select` scope
- keep reference selection lightweight even when the Console enters a reference scope

That keeps ownership honest:
- `Browser` does not become the owner of command behavior
- `Console` does not become the owner of selection truth
- shared workspace truth remains the handoff seam between them

### Required File Targets

Expected implementation seam owners:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/panels/BrowserPanel.tsx`

Possible related verification seams:
- `src/app/console/useConsoleStore.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/useAppStore.test.ts`

### Test Plan

Required Browser-5.3 verification:

- Browser `Object` row single-click:
  - keeps the object as the primary selected target
  - moves the Console into the nearest valid object/content command scope
  - does not auto-start transform ownership

- Browser `Assembly` or `Component` row single-click:
  - keeps the parent/root as the primary selected target
  - preserves the grouped descendant execution set behind that root
  - moves the Console into the parent/root content scope rather than a child-only or synthetic multi-select scope

- Browser `Reference` row single-click:
  - keeps selection lightweight
  - moves the Console into the nearest lightweight reference scope once that scope exists
  - does not auto-start `Move`

- Deselect and replacement:
  - empty Browser click clears Browser row selection
  - empty viewport click clears lightweight content/reference selection
  - when selection was the only reason for the local Console scope, deselect returns the Console to the nearest broader valid scope

- Regression:
  - Browser-5 Viewer-to-Browser follow still produces the same Console scope for the same selected target
  - Browser-5.1 reference cleanup behavior remains lightweight
  - Browser-5.2 grouped parent selection remains rooted in one parent command owner
  - no explicit additive `Ctrl+click` or range `Shift+click` behavior is introduced yet

### Assumptions

- Browser-5 shared target truth remains the base selection seam.
- Browser-5.1 reference-selection cleanup remains shipped and unchanged by this phase.
- Browser-5.2 grouped parent-selection truth remains the basis for rooted content command ownership.
- Later explicit additive multi-select remains separate under Browser-5.4.

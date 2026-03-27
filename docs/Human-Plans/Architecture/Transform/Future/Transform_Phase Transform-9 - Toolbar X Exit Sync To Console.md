# Transform Phase Transform-9 - Toolbar X Exit Sync To Console

## Doc Header

### Doc History
2. 2026-03-27 12:23: Locked the `Transform 9` question set so the toolbar `X` now explicitly means the same shell exit as Console `CommitTransform`, both surfaces are documented as adapters over one shared transform-shell exit seam, and the synced exit cleanup now explicitly includes hiding the toolbar, clearing shell-local UI state, and returning Console to the same post-transform scope
1. 2026-03-27 09:26: Created this standalone `Transform 9` future phase doc under the Transform family, splitting the next follow-on around toolbar `X` exit sync so the transform toolbar close action can route through the same shell-exit truth as Console instead of behaving like a separate hidden policy

### Purpose

This phase makes the transform-toolbar `X` button obey the same shell-exit contract as Console.

Use it to answer:
- what the transform-toolbar `X` should mean
- which seam should own transform-shell exit
- how toolbar exit should synchronize with Console state
- which transform-shell cleanup should happen on shared exit

## Doc Body

## [ ] Transform 9 - Toolbar X Exit Sync To Console

### Summary

`Transform 9` starts after:
- `Transform 8`
  - shared transform snap controls

By this point, transform shell state should already be shared across Console, toolbar, viewer, space, snap, and history scrub. The toolbar `X` should stop being a separate surface-local close path.

This phase should:
- make toolbar `X` mean the same thing as Console shell exit
- route toolbar close through the same shared owner seam as `CommitTransform`
- keep shell cleanup consistent across toolbar and Console

Phase outcome:
- toolbar `X` and Console `CommitTransform` share one exit path
- toolbar close no longer behaves like a second hidden cancel policy
- Console, toolbar, and transform-shell state stay in sync after exit

### Owns

- shared transform-shell exit behavior for toolbar `X` and Console
- toolbar-to-Console exit sync
- transform-shell cleanup that should happen on shared exit
- removal of duplicated close logic between toolbar and Console

### Does Not Own

- transform entry cancel or `Esc` semantics
- transform space or snap controls
- committed transform-history traversal
- unrelated toolbar close buttons outside transform

### Questions / Decisions

#### [x] q1 - What should the transform-toolbar `X` mean?

##### Suggestion
- make the toolbar `X` mean the same thing as `CommitTransform` at the transform-shell level
- do not let toolbar close become a second hidden cancel policy
- keep `Esc` and entry-cancel behavior separate from shell exit

Decision:
- make the toolbar `X` mean the same thing as `CommitTransform` at the transform-shell level
- do not let toolbar close become a second hidden cancel policy
- keep `Esc` and entry-cancel behavior separate from shell exit

#### [x] q2 - Which seam should own toolbar `X` exit behavior?

##### Suggestion
- route toolbar `X` and Console `CommitTransform` through the same shared transform-shell exit action
- keep toolbar and Console as adapters into that owner seam
- avoid duplicate cleanup logic between the two surfaces

Decision:
- route toolbar `X` and Console `CommitTransform` through the same shared transform-shell exit action
- keep toolbar and Console as adapters into that owner seam
- avoid duplicate cleanup logic between the two surfaces

#### [x] q3 - What state should sync when the toolbar `X` exits the shell?

##### Suggestion
- hide the toolbar
- clear active handle and other shell-local transform UI state
- return Console to the same post-transform scope it would reach after `CommitTransform`
- preserve already-committed history and other shipped transform semantics

Decision:
- hide the toolbar
- clear active handle and other shell-local transform UI state
- return Console to the same post-transform scope it would reach after `CommitTransform`
- preserve already-committed history and other shipped transform semantics

### Implementation Direction

Primary targets:
- `src/app/store/useAppStore.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewerHost.tsx`

Expected shape:
- extract one shared transform-shell exit action if the code still has more than one close path
- make toolbar `X` call that owner seam
- make Console `CommitTransform` call that same owner seam

### Test Plan

Required verification:
- clicking toolbar `X` exits the transform shell
- toolbar `X` and Console `CommitTransform` leave the same Console scope behind
- toolbar `X` clears the same active-handle and shell-local state as Console exit
- toolbar `X` does not mutate already-committed transform history beyond normal shell exit semantics

### Assumptions

- toolbar `X` should be shell exit, not entry cancel
- Console remains the visible command surface, but not the owner of transform-shell exit semantics
- this pass stays reference-transform-first

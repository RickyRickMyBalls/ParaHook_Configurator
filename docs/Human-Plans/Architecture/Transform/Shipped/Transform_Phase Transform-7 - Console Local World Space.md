# Transform Phase Transform-7 - Console Local World Space

## Doc Header

### Doc History
6. 2026-03-27 11:36: Marked this phase shipped after the shared reference transform `Local / World` shell work landed in code, moved the standalone phase record into `Shipped/`, and aligned the record with the delivered `Settings > Space` path, broad `L` / `W` shortcuts, default-local shell entry, toolbar sync, viewer sync, and already-applied no-op behavior
5. 2026-03-27 09:44: Tightened this `Transform 7` future phase doc so the honest navigation now reads as `Transform > Settings > Space > Choose next [Local, World]`, while `L` and `W` are documented as broad transform-shell shortcuts that resolve into that same shared setting from almost anywhere inside `Transform`
4. 2026-03-27 09:39: Tightened this `Transform 7` future phase doc so transform space now reads as `space:Local` / `space:World`, defaults to `Local` on transform-shell entry, and only surfaces the opposite mode as the available command instead of listing both at once
3. 2026-03-27 09:36: Tightened this `Transform 7` future phase doc again so the `Local / World` Console command now explicitly has to stay synced with the reference-transform `Local / World` button, making both surfaces adapters over the same shared transform-shell space state
2. 2026-03-27 09:34: Tightened this `Transform 7` future phase doc so `Local / World` now reads as a transform-shell command the user can call from almost anywhere inside `Transform`, more like `Move` / `Rotate` / `Scale`, instead of as a root-only `Space` submenu
1. 2026-03-27 09:26: Created this standalone `Transform 7` future phase doc under the Transform family, splitting the next follow-on around shared `Local / World` transform-space access so Console, toolbar, and viewer can stop treating transform space as an implicit or surface-local detail

### Purpose

This phase record captures the shipped shared transform-space pass for reference transform.

Use it to answer:
- where `Local / World` transform space should live
- how Console should expose that space choice
- how viewer, the reference-transform `Local / World` button, and Console should stay synced when transform space changes
- how space changes should interact with a live transform shell without appending history

## Doc Body

## [x] Transform 7 - Console Local World Space

### Summary

`Transform 7` started after:
- `Transform 6`
  - shipped history scrub and traversal

By this point, the transform shell was already durable across Console, toolbar, viewer, and history scrub, but transform space was still not a first-class shell control in Console.

This phase added one honest shared space mode:
- `Local`
- `World`

Delivered outcome:
- the active transform shell owns one shared transform-space state
- Console can inspect and change that state directly
- the honest hierarchy reads as `Transform > Settings > Space > Choose next [Local, World]`
- `L` and `W` behave as broad transform-shell shortcuts into that same shared setting
- the shell loads into `Local` by default
- viewer gizmo orientation and the reference-transform `Local / World` button stay synced with the same space mode
- changing space does not append transform history or fork surface behavior

### Shipped Result

The shipped `Transform 7` cut landed the intended first shared transform-space pass:
- `activeReferenceTransformSession.space` is now the single shell-owned source of truth for `Local / World`
- entering `Transform` defaults the shell to `Local`
- the canonical Console path is now `Transform > Settings > Space > Choose next [Local, World]`
- `L` and `W` work as broad transform-shell shortcuts from `Transform`, mode roots, and deeper prompts
- if the requested mode is already active, Console reprints that the setting is already applied instead of mutating state
- changing space from deep prompts collapses the prompt back to the owning mode root
- the reference-transform toolbar button and viewer gizmo space now stay synced with that same shared shell state

Implementation result:
- Console `Esc` now works correctly through `Transform > Settings > Space`, stepping back to `Settings` and then `Transform`
- the Console status tree now prints the full `Transform > Settings > Space` breadcrumb instead of dropping that staged path
- the toolbar button remains a single adapter surface over the same shared shell state instead of becoming a second owner path

### Owns

- shared `Local / World` transform-space state for the active transform shell
- Console access to that space state
- viewer / reference-transform toolbar button / Console sync around active transform space
- space-change behavior while the transform shell is active

### Does Not Own

- transform snap controls
- toolbar `X` exit semantics
- transform-history traversal already handled by `Transform 6`
- widening this pass beyond the reference-transform family

### Locked Direction

- active transform space lives in the shared transform-shell state rather than in Console, toolbar, or viewer-local adapters
- Console exposes the honest path `Transform > Settings > Space > Choose next [Local, World]`
- `L` and `W` remain broad transform-shell shortcuts into that same shared setting path
- changing space updates viewer and toolbar state immediately without appending transform history
- the Console command and reference-transform toolbar button stay as two adapters over the same shared shell state
- the shell defaults to `Local` on entry

### Implementation Direction

Primary targets:
- `src/app/store/useAppStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

Delivered shape:
- one shared transform-space field in the active transform shell
- Console space commands routed into that shared field
- the honest path exposed as `Transform > Settings > Space > Choose next [Local, World]`
- `L` and `W` added as broad shell shortcuts into that same setting path
- shell entry defaults to `Local`
- viewer and the reference-transform `Local / World` button read the same field instead of inferring space locally

### Test Plan

Shipped verification targets:
- entering `Transform` defaults the shared shell space to `Local`
- the canonical `Transform > Settings > Space` path exposes `Local` and `World`
- `L` and `W` can be called from multiple transform-shell contexts, not only the shell root
- `Transform > W` switches the shell to `World`
- `Transform > L` switches the shell to `Local`
- `Transform > Move > L` still switches the shell to `Local`
- calling `L` while already in `Local`, or `W` while already in `World`, reprints that the setting is already applied without mutating history
- the reference-transform `Local / World` button and viewer reflect the same active transform space after Console changes it
- clicking the reference-transform `Local / World` button updates the same shared transform-shell state Console reads
- changing space does not append a transform-history row

### Assumptions

- the first pass stays reference-transform-first
- `Local / World` is shell state, not committed transform history
- Console remains an adapter into shared transform ownership rather than becoming the owner of space state

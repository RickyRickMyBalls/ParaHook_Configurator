# Transform Phase Transform-9 - Toolbar X Exit Sync To Console

## Doc Header

### Doc History
3. 2026-03-27 13:20: Moved this phase record into `Shipped/` after implementation and tightened it into a shipped summary so the Transform-family docs now read honestly with toolbar `X` and Console `CommitTransform` sharing one shell-exit owner seam
2. 2026-03-27 12:23: Locked the `Transform 9` question set so the toolbar `X` now explicitly means the same shell exit as Console `CommitTransform`, both surfaces are documented as adapters over one shared transform-shell exit seam, and the synced exit cleanup now explicitly includes hiding the toolbar, clearing shell-local UI state, and returning Console to the same post-transform scope
1. 2026-03-27 09:26: Created this standalone `Transform 9` future phase doc under the Transform family, splitting the next follow-on around toolbar `X` exit sync so the transform toolbar close action can route through the same shell-exit truth as Console instead of behaving like a separate hidden policy

### Purpose

This phase made the transform-toolbar `X` button obey the same shell-exit contract as Console.

Use it to record:
- what the transform-toolbar `X` means
- which seam owns transform-shell exit
- how toolbar exit synchronizes with Console state
- which transform-shell cleanup happens on shared exit

## Doc Body

## [x] Transform 9 - Toolbar X Exit Sync To Console

### Summary

`Transform 9` started after:
- `Transform 8`
  - shared transform snap controls

By this point, transform shell state was already shared across Console, toolbar, viewer, space, snap, and history scrub. The toolbar `X` needed to stop behaving like a separate surface-local close path.

This phase shipped:
- one shared transform-shell exit seam for toolbar `X` and Console `CommitTransform`
- synchronized post-exit Console scope restoration
- synchronized shell cleanup for the viewer handle and other shell-local transform state

Phase outcome:
- toolbar `X` and Console `CommitTransform` share one exit path
- toolbar close no longer behaves like a second hidden cancel policy
- Console, toolbar, and transform-shell state stay in sync after exit

### Owned

- shared transform-shell exit behavior for toolbar `X` and Console
- toolbar-to-Console exit sync
- transform-shell cleanup that should happen on shared exit
- removal of duplicated close logic between toolbar and Console

### Did Not Own

- transform entry cancel or `Esc` semantics
- transform space or snap controls
- committed transform-history traversal
- unrelated toolbar close buttons outside transform

### Shipped Decisions

- The toolbar `X` means the same thing as `CommitTransform` at the transform-shell level.
- Toolbar close does not act as a second hidden cancel policy.
- Toolbar `X` and Console `CommitTransform` route through the same shared transform-shell exit action.
- Shared exit cleanup hides the toolbar, clears the active handle and related shell-local transform UI state, and returns Console to the same post-transform reference scope.
- Already-committed transform history remains intact through normal shell exit.

### Implementation Direction

Primary targets:
- `src/app/store/useAppStore.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/console/ConsoleDock.tsx`

Implemented shape:
- added a store-owned shell-exit request seam so toolbar close and Console shell-exit requests route through the same owner path
- rewired the toolbar `X` button to request that shared exit instead of cancelling and exiting locally
- updated `ConsoleDock` to consume the shared request, clear the viewer handle, cancel any active drag, exit the shell, and restore the same post-transform Console scope

### Test Plan

Verification used:
- `cmd /c npx vitest run src/app/components/ReferenceTransformToolbar.test.tsx src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc --noEmit`

### Assumptions

- toolbar `X` is shell exit, not entry cancel
- Console remains a visible command surface, but not the owner of transform-shell exit semantics
- this pass stayed reference-transform-first

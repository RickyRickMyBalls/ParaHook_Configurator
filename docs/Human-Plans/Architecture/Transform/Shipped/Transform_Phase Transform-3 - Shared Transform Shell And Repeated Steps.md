# Transform Phase Transform-3 - Shared Transform Shell And Repeated Steps

## Doc Header

### Doc History
3. 2026-03-26 23:55: Marked this phase shipped after the durable target-local transform shell landed in code, moved the standalone phase record into `Shipped/`, and aligned the record with the delivered shell-entry, repeated-step, and `CommitTransform`-exit behavior
2. 2026-03-26 19:50: Locked the remaining shell-entry question by deciding that entering `Transform` should create or activate the shared target-local transform session and make the toolbar appear, while `CommitTransform` should hide the toolbar by exiting the shell; also updated the later phase references so Console cleanup now belongs to `Transform 4` and viewport-history plus traversal work moves to `Transform 5`
1. 2026-03-26 19:23: Created this standalone `Transform 3` future phase doc under the Transform family, translating the locked shared-shell and repeated-step direction into an implementation-ready plan while leaving the one remaining `Transform`-entry shell-spawn question explicit

### Purpose

This phase turns transform from a one-entry-at-a-time action path into a durable target-local shell.

Use it to answer:
- what should happen after one `Move`, `Rotate`, or `Scale` entry is committed
- when the user should remain inside `Transform` versus return to the broader selected-target scope
- how `CommitTransform` should behave once the transform shell is durable
- which seam should own the shared shell state across Console and toolbar surfaces

## Doc Body

## [x] Transform 3 - Shared Transform Shell And Repeated Steps

### Summary

`Transform 3` is the phase where `Transform` becomes a real target-local session shell instead of only a path prefix before one immediate transform entry.

This phase should make the transform shell durable:
- user enters `Transform`
- user performs one or more committed `Move`, `Rotate`, or `Scale` entries
- each committed entry appends history and returns to `... > Transform > Choose next`
- history remains visible while repeated entries continue
- only `CommitTransform` exits the shell and returns to the broader selected-target scope

Phase outcome:
- one committed transform entry no longer throws the user back out to the selected target
- `CommitTransform` moves up to the `Transform` level instead of living inside `Move`, `Rotate`, or `Scale`
- Console and toolbar stay aligned as two surfaces over one shared target-local transform shell
- repeated transform work feels like one local session instead of repeated re-entry into separate one-shot commands

### Shipped Result

The first shipped `Transform 3` cut landed the intended durable shell behavior:
- entering `Transform` creates or activates the target-local shared shell immediately
- committed `Move`, `Rotate`, and `Scale` entries return to `... > Transform > Choose next` instead of exiting the shell
- transform history stays visible while repeated entries continue inside that shell
- `CommitTransform` lives at the `Transform` root and is the only command that exits back to the broader selected-target scope

### Owns

- shared target-local transform shell lifetime
- post-entry-commit return behavior
- `CommitTransform` exit behavior
- repeated transform entry behavior inside one durable shell
- keeping transform history visible while the shell remains active
- the owner seam for shared transform-shell state across Console and toolbar

### Does Not Own

- the canonical `Transform > Move/Rotate/Scale` hierarchy already covered by `Transform 2`
- the first reference-only session/history foundation already covered by `Transform 1`
- viewport move/scale/rotate history visuals and traversal/restore behavior covered by `Transform 5`
- later history playback or scrub semantics beyond keeping the shell alive between commits

### Locked Direction

#### 1. Entry commits stay inside `Transform`

Locked rule:
- after a committed `Move`, `Rotate`, or `Scale` entry, return to the same target-local `Transform > Choose next` scope
- keep the transform shell alive after each committed transform entry
- do not return to the broader selected-target scope yet

Examples:
- `Select > Object > Hook 1 > Transform > Move > X > 10`
- commit the move entry
- return to:
  - `Select > Object > Hook 1 > Transform > Choose next`

This same rule should apply to reference, object, folder, and later assembly targets once they participate in the shared shell.

#### 2. `CommitTransform` exits the shell

Locked rule:
- `CommitTransform` is no longer a per-entry command inside `Move`, `Rotate`, or `Scale`
- `CommitTransform` belongs to the `Transform` shell level
- `Move`, `Rotate`, and `Scale` commit individual transform entries
- `CommitTransform` closes the overall transform shell

Exit behavior:
- while inside the durable transform shell, choosing `CommitTransform`:
  - finalizes the current overall transform session
  - clears the active target-local transform shell
  - returns the user to the broader selected-target scope

Examples:
- `Select > Object > Hook 1 > Transform > Choose next`
- user chooses `CommitTransform`
- Console returns to:
  - `Select > Object > Hook 1`

#### 3. History stays visible while repeated steps continue

Locked rule:
- yes
- the transform toolbar/history shell should stay visible between committed steps
- repeated transforms should append into the same visible target-local history session

Result:
- the user can commit a move entry
- see the new history row immediately
- continue with another `Move`, `Rotate`, or `Scale` entry without re-opening transform

#### 4. Lock and merge semantics stay shared across target kinds

Locked rule:
- yes
- preserve one shared append-on-commit, lock, and merge model across reference and later non-reference target families where the behaviors match

Important rule:
- do not fork lock/merge semantics by surface
- Console, toolbar, and viewport history read from the same underlying target-local history state

#### 5. Shared shell state stays app/store-owned

Locked rule:
- keep the shared transform shell app/store-owned
- Console and toolbar should stay aligned adapter surfaces over that same session state
- viewer continues to own live transform execution, not the overall shell truth

This aligns with the owner-first architecture direction:
- one underlying transform shell state
- multiple surfaces adapting into that state

#### 6. Entering `Transform` spawns the shared shell

Locked rule:
- yes
- entering `Transform` should create or activate the target-local shared transform session
- the toolbar should appear because that session exists, not because Console directly tells a toolbar to open
- Console and toolbar should both adapt into the same underlying session

Exit rule:
- `CommitTransform` from the `Transform` root exits the shell
- exiting the shell hides the toolbar because the shared session no longer exists

### Public Interfaces And State

Expected app/store growth:

- `src/app/store/useAppStore.ts`
  - add shared target-local transform shell state
  - track:
    - active transform shell target kind
    - active transform shell target id
    - whether the target-local shell is active
    - current transform mode if one is armed
    - target-local history visibility state as needed by the toolbar shell

Expected staged-navigation growth:

- `src/app/console/stagedNavigation.ts`
  - `Transform` remains the canonical branch
  - after one committed entry, Console should resolve back to `... > Transform > Choose next`
  - `CommitTransform` should exist at the `Transform` scope, not inside per-entry subpaths

Expected Console wiring:

- `src/app/console/ConsoleDock.tsx`
  - route entry commits back into the shared transform shell instead of back to the broader selected-target scope
  - route `CommitTransform` to shell exit behavior
  - keep breadcrumbs honest to the durable shell

Expected toolbar / overlay wiring:

- `src/app/components/ViewportOverlay.tsx`
  - render transform toolbar surfaces when the shared target-local transform shell is active
- target-specific toolbar components
  - read the same active shell state instead of owning independent open/close state

Expected viewer / bridge behavior:

- `src/app/viewerBridge.ts`
  - keep viewer execution and commit/cancel callbacks aligned with the durable shell
- `src/viewer/Viewer.ts`
  - continue to own live transform execution only
  - do not become the owner of whether the transform shell exists

### Required File Targets

Primary implementation seams:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- target-specific transform toolbar components
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Expected verification seams:
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- target-specific transform toolbar tests
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Test Plan

Required verification:

- shell entry:
  - entering `Transform` creates or activates the target-local transform shell
  - the toolbar appears because the shell is active

- repeated entry commits:
  - after a committed `Move` entry, Console returns to `... > Transform > Choose next`
  - after a committed `Rotate` entry, Console returns to `... > Transform > Choose next`
  - after a committed `Scale` entry, Console returns to `... > Transform > Choose next`
  - repeated committed entries append into the same target-local history list

- shell exit:
  - `CommitTransform` is available at the `Transform` level
  - `CommitTransform` returns the user to the broader selected-target scope
  - `CommitTransform` clears the active transform shell state

- shared ownership:
  - Console and toolbar remain aligned on the same active shell target
  - viewer execution remains viewer-owned
  - shell truth remains app/store-owned

- regression:
  - `Transform 1` history behavior remains intact
  - `Transform 2` canonical hierarchy and shortcut behavior remain intact

### Assumptions

- `Transform 1` remains the history/session foundation
- `Transform 2` remains the canonical hierarchy and target-ownership phase
- `Transform 3` is the first phase where `Transform` becomes a durable shell rather than only a one-entry branch
- `CommitTransform` is a shell-exit command, not a per-entry command
- later Console cleanup belongs to `Transform 4`
- later viewport history visuals and traversal belong to `Transform 5`

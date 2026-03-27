# Transform Phase Transform-4.3 - Grouped Session History

## Doc Header

### Doc History
3. 2026-03-26 23:55: Marked this phase shipped after grouped transform-shell session history landed in code, moved the standalone phase record into `Shipped/`, and aligned the doc with the delivered session metadata, grouped toolbar rendering, and empty-shell behavior
2. 2026-03-26 20:49: Tightened this `Transform 4.3` spec into an implementation-ready grouped-history plan by locking the storage shape to per-entry `sessionId` plus persistent `sessionOrdinal`, making shell entry/exit the canonical session boundaries, forbidding empty parent session rows, defaulting the newest session expanded and older ones collapsed, keeping parent rows expand/collapse-only, and removing the remaining “or” wording that left implementation choices open
1. 2026-03-26 20:43: Created this standalone `Transform 4.3` future phase doc under the Transform family to capture the grouped transform-session history follow-on, separating the toolbar/history reshape from the already-landed `Transform 4.2` draft/session cleanup so committed history can be re-presented as expandable shell-session rows without re-opening the runtime sync refactor

### Purpose

This phase reshapes committed transform history from one flat list into grouped transform-shell sessions.

Use it to answer:
- how committed transform entries should be grouped under `Transform 1`, `Transform 2`, and later shell-session rows
- how grouped history should render in the transform toolbar without changing the underlying committed entry model
- how lock, merge, collapse, and expand behavior should work once history is grouped by shell session
- how grouped history should stay aligned with the later viewport-history visual phases

## Doc Body

## [x] Transform 4.3 - Grouped Session History

### Summary

`Transform 4.3` is the transform-history presentation follow-on after `Transform 4.2`.

`Transform 4.2` cleaned up the live runtime shape:
- one shared active reference transform draft session
- viewer gizmo writes into that draft
- Console and toolbar read the same draft
- commit and cancel operate from one session origin

`Transform 4.3` leaves that runtime model alone and only reshapes how committed history is presented.

The main change is:
- keep all committed history entries
- group them by completed transform shell session
- render those groups as expandable parent rows like `Transform 1`, `Transform 2`, and later sessions
- keep the child rows as the committed `Move`, `Rotate`, and `Scale` entries already captured today

### Shipped Result

The shipped `Transform 4.3` cut landed the intended grouped-history presentation:
- committed child entries remain the base truth, with `sessionId` and persistent `sessionOrdinal` metadata stamped onto each committed entry
- the transform toolbar now derives grouped parent rows like `Transform 1`, `Transform 2`, and later sessions from that child-entry metadata
- the newest grouped session defaults expanded, older sessions default collapsed, and parent rows stay expand/collapse-only
- empty shell sessions still create no history row because only committed child entries produce grouped parents

### Owns

- grouped transform-session history for the transform toolbar
- session-parent history rows like `Transform 1`, `Transform 2`, and later sessions
- expand/collapse behavior for those grouped history rows
- alignment between shell lifetime and grouped committed history
- preserving the existing committed entry list while adding a grouped presentation layer

### Does Not Own

- the live draft/session sync already landed in `Transform 4.2`
- widening the grouped history model to object, folder, or assembly in the same first pass unless that is explicitly restated later
- new viewport history visuals
- traversal / scrub / restore behavior
- changing the canonical `Transform > Move / Rotate / Scale` hierarchy

### Problem Read

Today, committed reference transform history is kept as a flat per-target list.

That is enough for:
- append-on-commit
- lock / unlock
- merge history
- rendering one row per committed transform entry

But it does not match the shell model the user is now working in.

The user no longer thinks only in isolated entries. They now work in transform shells:
- enter `Transform`
- commit several `Move`, `Rotate`, and `Scale` steps
- exit with `CommitTransform`

That means the history surface should start reflecting shell sessions instead of only one flat stream.

### Locked Direction

#### 1. Keep all committed history

Recommendation:
- keep all committed history entries
- do not auto-prune old entries
- do not flatten history only because the toolbar now groups it differently

Direction:
- grouped history is a presentation reshape first
- the underlying committed entry model remains the same committed child-entry list, with only the minimum added session metadata needed to group it

#### 2. Group committed entries by transform shell session

Recommendation:
- each completed transform shell becomes one grouped parent row
- parent labels should read like:
  - `Transform 1`
  - `Transform 2`
  - `Transform 3`

Direction:
- each shell session starts when the user enters `Transform`
- each shell session closes when the user uses `CommitTransform`
- all committed child entries produced between those moments belong under that parent session row
- if the user exits the shell without committing any child entries, no parent session row is created

#### 3. Child rows remain the committed transform entries

Recommendation:
- keep the child rows as the committed `Move`, `Rotate`, and `Scale` entries already used today
- preserve existing delta-label behavior at the child-row level

Direction:
- parent rows represent shell sessions
- child rows represent the committed transform entries inside that shell

Example:
- `Transform 1`
  - `Move Vec(...)`
  - `Rotate Vec(...)`
  - `Scale Vec(...)`
- `Transform 2`
  - `Move Vec(...)`
  - `Move Vec(...)`

#### 4. Group rows should be expandable and collapsible

Recommendation:
- grouped history rows should be collapsible in the toolbar
- newest transform session expanded
- older sessions collapsed
- expand/collapse should stay as local toolbar presentation state in this phase

Direction:
- the parent row is the shell-session summary
- expanding shows the child committed entries
- collapsing hides the child committed entries without deleting them

#### 5. Lock and merge should still operate on committed entries first

Recommendation:
- keep lock/unlock attached to the committed child entries in the first grouped-history pass
- keep merge semantics operating on the underlying committed entries, not on whole shell-session groups

Direction:
- preserve existing lock/merge semantics from the flat-list model
- do not invent a second merge system for whole parent session rows in the same first pass
- parent session rows should only support expand/collapse in this phase
- do not add parent-level lock, merge, or delete actions here

This keeps `Transform 4.3` focused on grouping/presentation rather than re-defining merge behavior.

#### 6. Grouped history should stay compatible with later viewport visuals and traversal

Recommendation:
- session groups should become the history structure that later phases can target for:
  - viewport-history emphasis
  - traversal / preview / restore

Direction:
- later viewport and traversal work should be able to select:
  - a whole transform session
  - or an individual child entry within that session

### Implementation Direction

#### Store

Primary target:
- `src/app/store/useAppStore.ts`

Expected additions:
- add `sessionId` and `sessionOrdinal` onto each committed reference transform history entry
- keep the existing committed entry model as the base truth
- derive grouped parent rows from that entry metadata instead of storing a parallel grouped-history tree

Locked shape:
- each committed child entry stores:
  - `sessionId`
  - `sessionOrdinal`
- the toolbar groups child entries by `sessionId`
- the parent row label uses `sessionOrdinal`

#### Toolbar

Primary target:
- `src/app/components/ReferenceTransformToolbar.tsx`

Expected changes:
- replace the flat `Transform History` list with grouped session rows
- render one expandable parent row per completed shell session
- render existing committed entry rows as child rows under the expanded parent
- keep `Origin` visible in a way that still makes sense beside grouped sessions
- keep parent rows expand/collapse-only
- keep lock/unlock and merge behavior on child committed entries

#### Console / Shell Coupling

Primary targets:
- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`

Expected changes:
- when `Transform` shell begins, allocate the next session id and persistent session ordinal for that target
- while the shell stays open, child committed entries appended during the shell should inherit that active session metadata
- when `CommitTransform` exits the shell, finalize that active session
- if the shell exits with no committed child entries, drop the empty pending session and create no parent row

#### Browser / Viewport Follow-on Compatibility

This phase should structure grouped history so later phases can layer on:
- active session emphasis
- selected child-entry emphasis
- viewport visual mapping per grouped session

### Public Interfaces / Types

Expected additions:
- `sessionId` and `sessionOrdinal` on committed reference transform history entries
- toolbar-facing grouped history selector(s) derived from committed entries

Expected constraints:
- do not redesign viewer callbacks for this phase
- do not require grouped viewport visuals in this phase

### Test Plan

Required verification:

- session grouping:
  - entering and exiting transform shells creates separate grouped history parents like `Transform 1` and `Transform 2`
  - empty shell sessions create no grouped parent row

- child entries:
  - committed `Move`, `Rotate`, and `Scale` entries appear under the correct shell-session parent

- collapse / expand:
  - newest grouped session starts expanded
  - older grouped sessions start collapsed
  - grouped session rows can be collapsed and expanded without losing entries

- lock / merge:
  - existing lock/unlock still works on child entries
  - existing merge semantics still operate correctly on the underlying committed entries
  - parent session rows expose no lock or merge actions in this phase

- regression:
  - `Transform 4.2` live draft/session sync remains unchanged
  - `Transform 3` shell lifetime rules remain unchanged
  - committed history is preserved through the grouping migration

Suggested verification targets:
- `src/app/store/useAppStore.test.ts`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `tsc --noEmit`

### Assumptions And Defaults

- `Transform 4.3` is the grouped-history follow-on after `Transform 4.2`
- committed history remains persistent by default
- grouped history is a presentation plus session-structure phase, not a viewer-runtime refactor
- grouped session-history is reference-first unless later widened explicitly
- traversal / preview / restore remains out of scope for this phase
- grouped parent rows are derived from child-entry `sessionId` / `sessionOrdinal` metadata, not from a second parallel grouped-history store

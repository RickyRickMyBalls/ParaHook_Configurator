### [x] `4.1J3` Session Migration

#### Questions / Decisions

##### [x] `q1` Decide what `4.1J3` is actually migrating.

##### Suggestion
- locked direction:
- `4.1J3` should migrate active sessions onto the shared routing seam from `4.1J2`
- it should not invent a second routing model
- it should not reopen the owner-priority decisions from `4.1J1`

##### [x] `q2` Decide which sessions should migrate first.

##### Suggestion
- locked direction:
- first migration targets should be:
  - sketch-plane pick
  - geometry sketch draw / review
  - reference transform
  - staged console navigation
- do not start with Browser
- Browser is more about reflecting shared state than urgent key-ownership cleanup

##### [x] `q3` Decide whether sessions should be migrated one by one or all at once.

##### Suggestion
- locked direction:
- migrate one session family at a time
- keep each migration narrow enough to verify before moving to the next
- do not try to replace every listener in one combined sweep
- local listeners may still exist temporarily during migration
- but for routed keys they should become:
  - dumb delegates into the shared seam
  - or no-ops when they are not the winning owner
- they should not remain independent precedence systems

##### [x] `q4` Decide what each migrated session should keep owning.

##### Suggestion
- locked direction:
- each migrated session should still own its real behavior
- examples:
  - sketch-plane pick still owns plane cancel / confirm / gizmo-mode behavior
  - sketch draw still owns draft cancel / finish behavior
  - reference transform still owns transform cancel / commit / mode-switch behavior
  - staged console still owns staged cancel / token submit behavior
- only key ownership moves to the shared routing seam

##### [x] `q5` Decide how command tokens and single-letter aliases should behave during migration.

##### Suggestion
- locked direction:
- token and alias meaning should remain scope-relative during migration
- do not turn `m / r / s / x / b` into global app meanings
- keep compact space-free command tokens where practical so `Space` and `Enter` can both submit in command contexts

##### [x] `q6` Decide what counts as success for a migrated session.

##### Suggestion
- locked direction:
- a migrated session counts as complete when:
  - its key handling now goes through the shared routing seam
  - lower-priority owners no longer steal its keys
  - its domain/session behavior still works unchanged from the user perspective
  - existing tests or new regression tests prove the precedence

##### [x] `q7` Decide what `4.1J3` must leave for `4.1J4`.

##### Suggestion
- locked direction:
- `4.1J3` should leave:
  - the main conflicting sessions migrated
  - old overlapping listeners reduced where safe
  - targeted precedence regressions covered by tests
- `4.1J4` should then handle the remaining cleanup and hardening pass

### Implementation Spec

Purpose:
- move the main active sessions onto the shared routing model

#### Summary

`4.1J3` is the phase where the new routing seam becomes the real path for the main conflicting sessions.

`4.1J2` created the traffic cop.
`4.1J3` moves the busiest intersections under that traffic cop.

Main rule:
- migrate sessions onto the seam
- do not migrate ownership rules back out into local component precedence hacks

Important sequencing note:
- `4.1J2` created the routing seam
- `4.1J3` migrates the busiest conflicting sessions onto that seam
- migrated sessions must trust the seam first, not keep solving precedence locally

First migration targets:
- sketch-plane pick
- geometry sketch draw/review
- reference transform
- staged console navigation

Important token rule:
- command/session tokens should avoid spaces where practical
- display labels may still contain spaces
- command input should prefer compact space-free tokens such as:
  - `g`
  - `sd`
  - `sp`
  - `back`

Important rule:
- migrate the highest-conflict sessions first

#### Main Decision

The main decision in `4.1J3` is:

- do key conflicts keep being solved locally inside each feature
- or do the real feature sessions now trust the shared routing seam to decide ownership first

Locked answer:
- trust the shared routing seam first
- let each feature session keep owning only its real behavior

#### Locked Outcome

`4.1J3` should deliver:
- sketch-plane pick routed through the shared seam
- sketch draw routed through the shared seam
- reference transform routed through the shared seam
- staged console routed through the shared seam
- fewer overlapping ad hoc keydown listeners still making first-claim decisions on their own

Important boundary:
- `4.1J3` is still about input ownership migration
- it is not the phase for:
  - Browser/editor selection ownership
  - richer active-surface highlighting
  - workspace-state reflection across Browser / Console / Spaghetti

Important Browser note:
- keep Browser out of the first migration wave
- Browser is not the urgent key-conflict surface in `4.1J3`
- Browser should not become the canonical owner of active graph/editor/tool state inside this phase

#### Migration Contract

Each migrated session should follow the same contract:

1. the routing seam decides whether that session owns the key
2. if the session wins, the existing session seam performs the behavior
3. if the session loses, it does not try to reclaim the key locally

Important rule:
- feature code should not reintroduce hidden precedence logic after routing has already decided ownership

A session is only truly migrated when:
- it consults the shared seam first
- it trusts the seam's `owner + decision`
- lower-priority owners no longer steal its keys
- it stops using local first-claim precedence for routed keys
- existing behavior still works from the user perspective

#### First Migration Order

`4.1J3` should likely migrate in this order:

1. sketch-plane pick
2. geometry sketch draw / review
3. reference transform
4. staged console navigation

Reason:
- these are the most active overlapping owners today
- Browser can wait because it is not the urgent key-conflict surface

Important note:
- within the sketch session family, `draw` is the higher-risk subcase
- `review` should stay attached to the same family, but `draw` is where key conflicts are most likely to regress first

#### Key Migration Order

Within those sessions, keep the routed key order narrow:

1. `Esc`
2. `Enter`
3. token-scoped `Space`
4. `m / r / s`
5. `x`
6. `b / back`

Important rule:
- do not jump to lower-value alias cleanup before `Esc` / `Enter` are stable

Important token/capture note:
- staged console must not reclaim printable token input while higher-priority feature sessions are active
- this is one of the easiest migration regressions
- staged/flat console capture should only run when the shared routing seam says console owns the key

#### Likely Integration Seams

Primary seams:

- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/viewer/Viewer.ts`
- session/domain seams already present in:
  - `useSpaghettiStore`
  - `useAppStore`

Likely responsibilities:

- shared routing seam:
  - decide active owner
  - return `owner + decision`
- migrated session surface:
  - call the shared routing seam first
  - stop making first-claim decisions locally
  - degrade into a delegate or no-op for routed keys when it is not the winning owner
- domain/session seam:
  - continue performing the real behavior once selected

#### First Implementation Steps

`4.1J3` should likely be completed in this order:

1. migrate the remaining sketch-plane and sketch-draw entry points so they always consult the shared seam first
2. migrate reference-transform key handling to rely on routed ownership rather than local precedence
3. migrate staged-console lifecycle/token handling onto the same routed ownership contract
4. remove or simplify local first-claim checks that the shared seam now replaces
5. add regression tests proving that higher-priority sessions beat lower-priority console capture

If implementation pressure forces tradeoffs:
- preserve the routing contract first
- preserve feature-owned behavior second
- defer broader cleanup to `4.1J4`

#### Scope Boundary

Keep `4.1J3` focused.

Owned here:
- session migration onto the shared routing seam
- removing local first-claim decisions where the seam now owns them
- precedence regressions for migrated sessions

Not owned here:
- broad listener cleanup across the whole app
- Browser/state reflection work
- transcript redesign
- command taxonomy redesign
- richer surface highlighting

#### Locked Deferrals

Keep these out of `4.1J3`:
- global workspace-selection coordination
- Browser as canonical owner of active graph/editor/tool state
- full UI/status reflection across Console / Browser / Spaghetti
- final dead-listener purge beyond what is needed for migrated sessions

#### Acceptance Shape

Acceptance shape:
- these sessions no longer rely on ambiguous overlapping key handling
- `Esc` / `Enter` / single-letter keys resolve according to the locked priority model
- token-based command flows can use either `Space` or `Enter` to advance without needing multi-word command entry
- the migrated sessions trust the shared routing seam instead of local accidental precedence



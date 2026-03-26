### [x] `4.1J4` Cleanup And Hardening

#### Questions / Decisions

##### [x] `q1` Decide what `4.1J4` is actually cleaning up.

##### Suggestion
- locked direction:
- `4.1J4` should clean up leftover drift after `4.1J1-J3`
- it should focus on:
  - redundant routed-key listeners
  - edge-case key precedence regressions
  - cancel/exit/focus inconsistencies
  - command-scoped `Space` safety
- it should not become a general UI polish bucket

##### [x] `q2` Decide how aggressive listener cleanup should be.

##### Suggestion
- locked direction:
- remove or simplify redundant listeners where safe
- do not force every listener out of existence just to make the phase look â€œcleanâ€
- if a local listener still serves a valid non-routed responsibility, it may remain
- the real requirement is:
  - routed keys no longer depend on overlapping accidental precedence

##### [x] `q3` Decide what to normalize around transcript and status behavior.

##### Suggestion
- locked direction:
- normalize transcript/status behavior only where routed ownership currently feels inconsistent
- examples:
  - duplicate cancel/result messages
  - missing feedback after routed session exit
  - inconsistent wording between similar routed outcomes
- do not redesign the whole console transcript system in `4.1J4`

##### [x] `q4` Decide which edge cases matter most.

##### Suggestion
- locked direction:
- highest-priority edge cases should be:
  - focus changes while a routed session is active
  - cancel/exit behavior after partial interaction
  - staged console resuming correctly after higher-priority sessions end
  - token-scoped `Space` never leaking into normal parameter/text editing
- do not widen this into a broad workspace-state coordination phase

##### [x] `q5` Decide what test coverage `4.1J4` must leave behind.

##### Suggestion
- locked direction:
- `4.1J4` should leave:
  - regression tests for priority conflicts
  - regression tests for routed session exit/cancel behavior
  - regression tests proving `Space` stays scoped
- the goal is to make the routing model hard to accidentally regress later

##### [x] `q6` Decide what stays out of `4.1J4`.

##### Suggestion
- locked direction:
- keep these out:
  - Browser/editor selection ownership
  - shared workspace-selection coordination
  - active-surface highlight/reflection systems
  - command taxonomy redesign
  - major transcript redesign
- `4.1J4` is the hardening pass for the input-routing cleanup only

### Implementation Spec

Purpose:
- remove leftover drift once the routing model is working

#### Summary

`4.1J4` is the cleanup and hardening pass for the routing work that landed in `4.1J1-J3`.

By this point:
- ownership rules are locked
- the shared seam exists
- the main sessions have been migrated

So `4.1J4` should do the follow-through work:
- reduce leftover drift
- harden edge cases
- tighten regressions

Main rule:
- stabilize the routing system
- do not reopen the architecture

In scope:
- remove redundant listeners where appropriate
- normalize transcript/status behavior
- add regression tests for priority conflicts
- tighten edge cases around session exit/cancel/focus
- verify that token-based `Space` submit does not leak into normal parameter/text editing

#### Main Decisions

The main decisions in `4.1J4` are:

1. Which leftover listeners are actually redundant now?
- remove or simplify only the ones the shared seam truly replaced

2. Which remaining inconsistencies are real routing problems versus unrelated UX polish?
- fix routing-related inconsistencies
- defer broader UX redesign

3. What regressions must be locked down with tests before the routing work can be considered stable?
- priority conflicts
- routed session cancel/exit
- scoped `Space`

#### Locked Outcome

`4.1J4` should deliver:
- fewer redundant routed-key listeners
- more consistent cancel/exit behavior across the migrated sessions
- regression coverage for the highest-risk routing conflicts
- proof that `Space` submit stays scoped to token-based command contexts

Important boundary:
- `4.1J4` is still about cleanup and hardening of input ownership
- it is not the phase for:
  - shared workspace-selection cleanup
  - Browser/editor active-state reflection
  - larger command-language redesign

#### Hardening Targets

The cleanup pass should focus on:

1. Redundant listener cleanup
- remove or simplify routed-key listeners that the shared seam now fully replaces

2. Cancel / exit consistency
- make sure routed `Esc` behavior feels coherent across migrated sessions

3. Focus consistency
- make sure real text-entry fields still keep first claim on typing
- make sure console capture resumes correctly after higher-priority sessions end

4. Scoped `Space`
- confirm token-scoped `Space` submit never leaks into normal text or parameter editing

5. Regression safety
- lock the highest-risk conflicts into tests so future command growth does not quietly undo the routing work

#### Extra Hardening Rule

For routed keys, no lower-priority surface should still be able to win because of:
- mount order
- bubbling order
- duplicate window listeners
- local accidental precedence

Important rule:
- if a routed key still works only because one listener happens to fire first, `4.1J4` is not complete yet

#### Leftover Listener Rule

If a local listener still handles a routed key after migration, it must do one of these:

- delegate into the shared routing seam
- remain strictly local for a non-routed responsibility

It must not keep making hidden first-claim ownership decisions for routed keys.

#### Resume / Recovery Target

After a higher-priority routed session ends:
- staged console should resume predictably if it was previously active
- flat console capture should resume predictably if it was previously active
- pending command/token state should not be lost silently unless explicit cancel semantics require it

#### Focus-Loss Rule

If focus moves into a real text-editing field while a routed session still exists:
- the text field keeps native typing ownership
- the routed session must behave predictably:
  - either pause
  - or remain active but passive
- do not leave this as accidental behavior

#### Minimal Diagnostics Rule

Routing hardening should leave behind enough diagnostics/debug visibility that:
- impossible owner conflicts
- unexpected routed-key fallthrough
- duplicate cancel/submit handling

can be detected in tests or debug output instead of failing silently.

#### Likely Integration Seams

Primary seams:

- `src/app/inputRouting.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/viewer/Viewer.ts`

Likely responsibilities:

- routing seam:
  - remain the single source of precedence truth
- migrated surfaces:
  - shed leftover local first-claim logic where safe
  - keep only local responsibilities that are still truly local
- tests:
  - prove that later changes do not reintroduce accidental precedence

#### First Implementation Steps

`4.1J4` should likely be completed in this order:

1. identify routed-key listeners that are now redundant after `4.1J3`
2. remove or simplify those listeners one small group at a time
3. tighten routed cancel/exit behavior where it is still inconsistent
4. add or expand precedence regression tests
5. verify that command-scoped `Space` still never leaks into normal editing
6. verify routed-session resume and focus-loss behavior explicitly
7. stop when the routing system feels stable, not when every file is cosmetically minimal

#### Scope Boundary

Keep `4.1J4` focused.

Owned here:
- redundant-listener cleanup for routed keys
- routed cancel/exit/focus hardening
- regression test coverage for routing conflicts
- command-scoped `Space` safety verification

Not owned here:
- Browser/state coordination
- active-surface reflection systems
- command taxonomy redesign
- full transcript redesign
- broader workspace cleanup

#### Locked Deferrals

Keep these out of `4.1J4`:
- Browser as canonical owner of app activity
- shared selection/workspace-state architecture
- graph/editor/node/sketch coordination redesign
- large console UX restyling

#### Acceptance Shape

- coordination remains stable under normal editing churn
- the app no longer depends on scattered accidental key precedence for routed keys
- cancel/exit/focus behavior feels consistent across the migrated sessions
- `Space` submit remains scoped and safe
- later command growth has regression coverage guarding the routing contract
- routed keys no longer depend on mount-order or bubbling-order accidents
- leftover local listeners for routed keys either delegate to the seam or no longer make first-claim decisions
- staged/flat console resumes predictably after higher-priority sessions end
- real text-entry fields still feel native and never lose ordinary typing to command routing

### Immediate Recommendation

The first implementation target inside `4.1J` should be:
- `Esc`

Reason:
- it is the clearest cross-system pressure point
- it already touches staged console, sketch plane pick, sketch draw, viewer, and transform behavior



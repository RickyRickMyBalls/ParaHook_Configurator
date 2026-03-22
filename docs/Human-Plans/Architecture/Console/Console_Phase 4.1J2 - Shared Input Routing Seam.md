### [x] `4.1J2` Shared Input Routing Seam

#### Questions / Decisions

##### [x] `q1` Decide whether ParaHook should add one shared input-routing seam.

##### Suggestion
- locked direction:
- `4.1J2` should add one shared routing seam
- that seam should decide which active owner gets first claim on a key
- do not keep growing independent keydown ownership in each surface

##### [x] `q2` Decide where the shared routing seam should live.

##### Suggestion
- locked direction:
- the routing seam should live in a shared app-level coordination layer
- it should not live inside `ConsoleDock` alone
- it should not live inside `Viewer` alone
- `AppShell` may host or mount the seam, but the seam should remain a routing utility rather than shell-owned feature logic

##### [x] `q3` Decide what the routing seam should own versus what feature systems should still own.

##### Suggestion
- locked direction:
- the routing seam should own:
  - owner detection
  - priority comparison
  - first-claim routing
  - common prevent-default / stop-propagation decisions
- the routing seam should not own:
  - sketch-plane behavior
  - sketch-draw behavior
  - reference-transform behavior
  - transcript wording
- the routing seam should not silently expand into:
  - Browser/editor selection ownership
  - active graph / active node / active sketch coordination
  - workspace-selection reflection across surfaces
- once an owner is selected, the existing domain/session seam should still perform the real action

##### [x] `q4` Decide what inputs the routing seam should inspect first.

##### Suggestion
- locked direction:
- the routing seam should inspect:
  - whether a real text-editing field owns focus
  - whether sketch-plane pick is active
  - whether geometry sketch draw/review is active
  - whether reference transform is active
  - whether staged console is active
  - whether flat console capture should run
- these checks should follow the priority order locked in `4.1J1`

##### [x] `q5` Decide what the routing seam should return.

##### Suggestion
- locked direction:
- the routing seam should return an explicit structured result with at least:
  - `owner`
  - `decision`
- recommended shape:
  - `owner: text-field | sketch-plane | sketch-draw | reference-transform | staged-console | flat-console | none`
  - `decision: handle | defer-native | ignore`
- the exact type names do not matter
- the important thing is that routing becomes inspectable and testable instead of implicit

##### [x] `q6` Decide how `Space` and `Enter` should be treated by the routing seam.

##### Suggestion
- locked direction:
- `Enter` should route to the highest-priority active owner
- `Space` should only route as submit in token-based command contexts
- the routing seam should not globally convert `Space` into submit
- real text-entry surfaces must retain normal `Space`

##### [x] `q7` Decide what the first implementation target inside the seam should be.

##### Suggestion
- locked direction:
- `Esc` should be the first key routed through the shared seam
- after that:
  - `Enter`
  - `Space`
  - `m / r / s`
  - `x`
  - `b / back`
- do not try to migrate every key in the same first cut

##### [x] `q8` Decide what `4.1J2` must leave behind for `4.1J3`.

##### Suggestion
- locked direction:
- `4.1J2` should leave behind:
  - one shared routing utility/seam
  - one explicit owner-detection order
  - one first working path for routed keys
  - tests proving higher-priority owners beat lower-priority ones
- this should be enough for `4.1J3` to migrate sessions onto the seam without redesigning it

### Implementation Spec

Purpose:
- add one shared routing seam that decides who owns a key before feature logic runs

#### Summary

`4.1J2` should turn the ownership contract from `4.1J1` into one real routing seam.

This is not the phase where every feature is rewritten.

This is the phase where the app gets:
- one explicit owner-selection pass
- one consistent place to resolve key precedence
- one seam that later feature migrations can call into or register with

Important boundary:
- `4.1J2` is about input ownership only
- it is not the phase for:
  - shared workspace selection
  - Browser/editor active-state reflection
  - canonical graph/node/sketch selection ownership

In scope:
- one routing layer for high-priority key ownership
- route by active session/state, not by UI surface guessing
- preserve existing domain actions once routing selects an owner
- support token-based command submission where `Space` and `Enter` can both submit the current command token in command contexts

#### Locked Outcome

`4.1J2` should deliver:
- one shared routing seam outside individual feature surfaces
- one explicit owner-detection order matching `4.1J1`
- one first routed-key path that proves ownership precedence
- one explicit routing result shape with `owner + decision`
- tests that show a higher-priority active owner wins over lower-priority console capture

Important rule:
- do not solve this by making `ConsoleDock` more powerful
- do not solve this by teaching each surface about every other surface

#### First Routing Contract

The shared seam should conceptually do this:

1. inspect the incoming key event
2. classify the current active owner context
3. choose the highest-priority owner
4. either:
  - route the key to that owner
  - defer to native text editing
  - ignore the key

Recommended result shape:

- `owner`
  - `text-field`
  - `sketch-plane`
  - `sketch-draw`
  - `reference-transform`
  - `staged-console`
  - `flat-console`
  - `none`
- `decision`
  - `handle`
  - `defer-native`
  - `ignore`

The exact type names do not matter yet.
The contract shape does.

#### First Owner Checks

The first owner-detection pass should check, in order:

1. focused real text-editing field
2. sketch-plane pick session
3. geometry sketch draw/review session
4. reference transform session
5. staged console session
6. flat console capture
7. passive/global shortcut fallback

Important rule:
- this order should exist in one readable place
- do not duplicate it in multiple listeners
- route by active session/owner category, not by component file name or event origin surface

#### First Routed Key Set

`4.1J2` should focus on the keys already audited in `4.1J1`:

- `Esc`
- `Enter`
- `Space`
- `m`
- `r`
- `s`
- `x`
- `b`
- `back`

But the first implementation target should still be narrow:
- prove the seam first with `Esc`
- then extend to `Enter`
- then extend to token-aware `Space`
- only after that extend to:
  - `m / r / s`
  - `x`
  - `b / back`

Important printable-key rule:
- printable keys must not fall into flat or staged console capture if a higher-priority active feature session owns them
- console capture should run only when no higher-priority owner is active, unless that owner explicitly delegates

#### Likely Integration Seams

Primary seams:

- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/viewer/Viewer.ts`
- shared store/session selectors already present in:
  - `useSpaghettiStore`
  - `useAppStore`

Likely responsibilities:

- shared routing seam:
  - detect active owner
  - apply priority order
  - return `owner + decision`
- existing feature/session owners:
  - execute the actual cancel / confirm / mode-switch behavior
- console layer:
  - continue to own command text and staged-session state once selected as the active owner

Important Browser note:
- Browser should not become the canonical owner of active graph/editor/tool selection inside `4.1J2`
- Browser may later reflect shared selection/workspace state, but that is a neighboring seam, not this routing phase

#### First Implementation Steps

`4.1J2` should likely be implemented in this order:

1. create the shared routing utility/seam
2. encode the owner-priority order from `4.1J1`
3. wire `Esc` through that seam first
4. prove that the routed owner wins over lower-priority listeners
5. extend the seam to `Enter`
6. extend the seam to command-scoped `Space`
7. leave the broader session migrations for `4.1J3`

Recommended migration order after the first seam proof:
- `Esc`
- `Enter`
- token-scoped `Space`
- `m / r / s`
- `x`
- `b / back`

#### Scope Boundary

Keep `4.1J2` focused.

Owned here:
- shared routing seam
- owner-selection logic
- first routed key paths
- precedence tests

Not owned here:
- full session migration
- transcript redesign
- toolbar UI cleanup
- broad command-language expansion
- multi-word freeform command grammar
- shared workspace-selection coordination
- Browser/editor/console active-state reflection

#### Locked Deferrals

Keep these out of `4.1J2`:
- rewriting every existing feature listener in one pass
- making browser/editor/console focus indicators visually richer
- inspector/status reflection across all surfaces
- command taxonomy cleanup beyond the routed-key contract
- making Browser the owner of graph/editor/tool activity

#### Acceptance Shape

- there is one explicit shared routing seam
- the owner-detection order matches the locked `4.1J1` priority contract
- `Esc` no longer depends on scattered accidental precedence
- `Enter` and command-scoped `Space` can be routed consistently without breaking real text-entry surfaces
- `4.1J3` can migrate active sessions onto the seam without redesigning ownership rules



## [x] [3.2B-S6] - `SketchPlane Move Axis Numeric Entry`

This follow-on deepens `SketchPlane > Move` into real child value-entry levels instead of leaving axis-specific motion as a shallow action with no explicit console depth.

Phase state:
- locked
- implementation-ready
- shipped

Locked target read:

```text
Graph
└─ Sketch node selected
   └─ SketchPlane
      └─ Adjust
         └─ Move
            ├─ Vec3
            ├─ X
            ├─ Y
            └─ Z
```

Important rule:
- selecting `X`, `Y`, or `Z` should enter a real child level in the sketch console/session hierarchy
- the user-facing read should become:
  - `Graph > Sketch > SketchPlane > Move > X`
  - `Graph > Sketch > SketchPlane > Move > Y`
  - `Graph > Sketch > SketchPlane > Move > Z`
- once inside one of those axis leaves, the console should only be looking for one float value
- while inside one of those axis leaves, mouse dragging for that active axis should remain live instead of freezing the transform session
- if move snap is enabled, mouse dragging inside `Move > X / Y / Z` should still land on that snap interval
- if the user starts typing while in that same leaf, the assisted/current value should clear and be replaced so manual numeric entry behaves like the normal console overwrite flow
- if the user types a value that does not land on the active move snap interval, the console should require one extra confirm step before applying that off-snap number
- accepted numeric submit should apply that axis movement and then return the user to `Graph > Sketch > SketchPlane > Move`
- after that return, the user should be able to choose `Vec3`, `X`, `Y`, or `Z` again without leaving `Move`

Example:
- user path:
  - `G > S > SP > M > X`
- user types:
  - `10`
- user presses:
  - `Enter`
- result:
  - `Move X = 10`
  - console/session returns to:
    - `G > S > SP > M`

Current code-to-target mapping:
- current selected-sketch parent scope already exists:
  - `graphSketchSelected`
- current sketch-plane placement session already exists:
  - `sketchPlanePickSession`
- current `SketchPlane` adjust/read depth already exists from the shipped cleanup work:
  - `Plane Selection`
  - `Adjust`
- current shared sketch command seam already exists from `[3.2B-S5]`
  - toolbar and console overlap should continue to route through shared sketch command ownership instead of branching twice
- current console assisted-prefill overwrite rule already exists from `[4.1P]`
  - that means any axis-value prefill can be replaced immediately by the first printable typed key
- current gap:
  - `Move X / Y / Z` do not yet read as explicit child levels with their own float-only entry state and return behavior

Phase boundary:
- `[3.2B-S6]` should only deepen `SketchPlane > Move`
- this phase should add:
  - explicit `Move > X / Y / Z` child levels
  - float-only input expectation at those leaves
  - commit return to `Move`
  - cancel/back return to `Move` without commit
- this phase should stay inside the existing sketch-plane session family
- this phase should not widen into:
  - `Rotate`
  - broader transform grammar redesign
  - whole-app numeric command parsing
  - geometry-driven source setup

### Questions / Decisions

#### [x] `q1` Decide whether `Move X / Y / Z` should become real sketch hierarchy levels.

##### Suggestion
- locked direction:
- yes
- `Move X / Y / Z` should become explicit child levels under `SketchPlane > Move`

#### [x] `q2` Decide what the console should accept inside `Move > X / Y / Z`.

##### Suggestion
- locked direction:
- one float value
- first printable typing should replace any assisted prefill
- `Enter` should commit that float to the active axis

#### [x] `q3` Decide where the session should return after axis commit.

##### Suggestion
- locked direction:
- return to `SketchPlane > Move`
- do not stay trapped inside the same axis leaf after commit

#### [x] `q4` Decide what `Back` / `Esc` should do inside the axis leaf.

##### Suggestion
- locked direction:
- return one level to `SketchPlane > Move`
- do not commit on cancel

#### [x] `q5` Decide whether this phase should replace the broader `Vec3` move path.

##### Suggestion
- locked direction:
- no
- keep the broader `Vec3` move path available
- this phase only adds honest axis-specific child depth and value-entry behavior

#### [x] `q6` Decide whether axis-leaf entry should still allow live mouse dragging.

##### Suggestion
- locked direction:
- yes
- entering `Move > X / Y / Z` should still leave the active axis drag path live
- typed input should still clear/replace the assisted current value immediately so the user can switch from dragging to direct numeric entry without extra delete steps

#### [x] `q7` Decide the first accepted float grammar for axis-leaf numeric entry.

##### Suggestion
- locked direction:
- accept these signed and shorthand float forms:
  - `-1`
  - `-.1`
  - `-0.1`
  - `1`
  - `.1`
  - `+1`
  - `+0.1`
- treat those as valid first-pass axis-entry literals for `Move > X / Y / Z`

#### [x] `q8` Decide how move snap should behave inside `Move > X / Y / Z`.

##### Suggestion
- locked direction:
- if move snap is enabled, axis-leaf mouse dragging should still resolve to the active snap interval
- do not disable snap just because the user entered a narrower `Move > X / Y / Z` leaf

#### [x] `q9` Decide what should happen when typed axis input does not line up to the active move snap.

##### Suggestion
- locked direction:
- allow the user to use the off-snap number
- but require one extra console confirmation message before applying it
- first submit:
  - detects the value is off-snap
  - shows one extra confirm prompt/message
- second confirm:
  - applies that exact typed number instead of forcing snap rounding

#### [x] `q10` Decide the first exact off-snap confirm prompt shape.

##### Suggestion
- locked direction:
- use a constrained confirm prompt instead of a sentence-only warning
- first-pass read:
  - `confirm 0.3 off snap`
- choices:
  - `confirm`
  - `deny`
- assisted prefill should default to:
  - `confirm`
- that lets the user press `Enter` immediately if they want to allow the exact off-snap value

### Implementation Spec

Purpose:
- make `SketchPlane > Move` read like a real command subtree instead of a flat set of transform buttons
- let the console and toolbar both expose axis-specific numeric entry honestly
- keep the user in the move command family after each axis commit so repeated adjustment stays fast

#### Current Code-To-Target Mapping

- current sketch session ownership still belongs in the sketch store/session layer
- current sketch command mapping seam from `[3.2B-S5]` should remain the surface-facing entry point
- current console input replacement behavior from `[4.1P]` should be reused rather than inventing a second numeric-input exception
- likely runtime ownership remains near the existing sketch-plane command/session code in:
  - `src/app/store/useSpaghettiStore.ts`
  - `src/app/components/ViewportOverlay.tsx`
  - `src/app/console/ConsoleDock.tsx`
- current code truth:
  - `ConsoleDock` already exposes `Move X`, `Move Y`, and `Move Z` as move-scope choices
  - `useSpaghettiStore` already maps those commands to `activeTransformAxis = x / y / z`
  - `ViewportOverlay` already has live axis drag controls plus move-snap prefs
  - the missing piece is not basic axis ownership
  - the missing piece is honest axis-leaf console/session depth, float-only parsing at that leaf, and the off-snap confirm path
- target:
  - one explicit `Move` subtree with child axis value-entry leaves
  - one shared way for toolbar clicks and console commands to enter those leaves
  - one shared commit/cancel rule for axis value entry

#### Scope

Owned here:
- `SketchPlane > Move > X`
- `SketchPlane > Move > Y`
- `SketchPlane > Move > Z`
- float-only input expectation at those leaves
- live active-axis mouse dragging while inside those leaves
- move snap participation inside those axis leaves
- one extra confirm step for typed off-snap values while move snap is enabled
- commit-to-axis then return-to-`Move` behavior
- visible prompt/state read that makes the active axis leaf obvious

Not owned here:
- `Rotate` child-depth design
- replacing the current `Vec3` move path
- geometry-derived plane setup
- generic numeric-input infrastructure for every feature in the app
- final transform UI styling

#### Target Hierarchy Read

Parent scope:
- `Graph > Sketch`

Existing child scope:
- `Graph > Sketch > SketchPlane`

Existing adjust subtree:
- `Graph > Sketch > SketchPlane > Move`
  - choices:
    - `Vec3`
    - `X`
    - `Y`
    - `Z`
    - `Back`
    - `X` exit if the wider sketch-plane surface already exposes it

New axis leaves:
- `Graph > Sketch > SketchPlane > Move > X`
- `Graph > Sketch > SketchPlane > Move > Y`
- `Graph > Sketch > SketchPlane > Move > Z`

First implementation rule:
- model those axis leaves as real sketch-plane adjust sub-states, not as a display-only breadcrumb trick
- runtime should know the difference between:
  - `Move` parent scope
  - `Move > X`
  - `Move > Y`
  - `Move > Z`

Important rule:
- once the user enters one of those axis leaves, the active expected payload is no longer a command token family
- it is one signed float value for that axis
- but the wider sketch-plane transform session remains live, so the user can still drag the active axis in the viewport while that axis leaf is selected
- if move snap is enabled, that same live axis drag should still follow the active move snap interval

#### Prompt / Input Read

Suggested console read:
- `Sketch Plane > Move > X > Enter float`
- `Sketch Plane > Move > Y > Enter float`
- `Sketch Plane > Move > Z > Enter float`

Input rules:
- accepted value shape:
  - one signed float
- examples:
  - `10`
  - `-2.5`
  - `0`
  - `-1`
  - `-.1`
  - `-0.1`
  - `1`
  - `.1`
  - `+1`
  - `+0.1`
- default read may still show the current axis value as assisted/current session state
- the first printable typed key should replace any assisted prefill instead of appending
- typed entry should not require the user to delete the current dragged value first
- `Enter` commits the parsed float to the active axis
- if move snap is enabled and the typed float is off-snap:
  - do not silently round it
  - do not silently reject it
  - show one extra confirmation message/prompt
  - use a constrained confirm/deny choice prompt instead of a freeform warning line
  - allow the exact typed value after that extra confirm
- invalid non-float input should not silently apply
- this phase may keep validation simple:
  - reject
  - keep user in the same axis leaf
  - show the value is invalid

First accepted grammar notes:
- allow optional leading `+` or `-`
- allow either:
  - integer form like `1`
  - decimal form like `0.1`
  - shorthand decimal form like `.1` or `-.1`
- do not require a leading zero before the decimal point

#### First Recommended Data Shape

- keep the wider `sketchPlanePickSession`
- add one narrow leaf-state layer for move-axis entry
- first-pass shape can stay simple:
  - `adjustScope: 'move-axis'`
  - `activeTransformAxis: 'x' | 'y' | 'z'`
  - `pendingAxisLiteral: string | null`
  - `pendingOffSnapConfirmation: { value: number; axis: 'x' | 'y' | 'z' } | null`
- important:
  - do not create a second detached move session
  - keep this inside the same sketch-plane session the viewport gizmo already uses

#### Shared Entry Rule

- console choice `Move X / Y / Z` and toolbar click `Move X / Y / Z` must enter the exact same runtime state
- do not let toolbar and console maintain parallel axis-entry logic
- both should end in:
  - same breadcrumb
  - same active axis
  - same snap behavior
  - same off-snap confirm behavior

#### Mouse / Typing Interop

- entering `Move > X` should still arm the X-axis transform handle for live viewport dragging
- entering `Move > Y` should still arm the Y-axis transform handle for live viewport dragging
- entering `Move > Z` should still arm the Z-axis transform handle for live viewport dragging
- dragging while inside that leaf should continue to update the current axis value live
- if move snap is enabled, that live drag should step to the snap interval instead of drifting freely
- if the user switches from dragging to typing:
  - the first printable typed key should clear/replace the current assisted value
  - subsequent keys continue normal manual numeric entry
- this keeps both interaction styles valid inside the same axis leaf:
  - drag to explore the value
  - type to lock an exact number

#### Snap / Confirm Behavior

- axis leaves should inherit the active move-snap setting from the wider `SketchPlane > Move` session
- if snap is enabled:
  - mouse drag follows snap
  - typed on-snap values commit normally
  - typed off-snap values trigger one extra confirmation message before apply
- that extra confirmation should preserve user intent:
  - it exists to warn/confirm
  - not to force rounding
  - not to kick the user out of the axis leaf early
- the first confirm prompt should read:
  - `confirm <value> off snap`
- the first confirm prompt should expose:
  - `[confirm, deny]`
- the confirm prompt should prefill:
  - `confirm`
- so pressing `Enter` immediately is enough to accept the exact off-snap value

Suggested first-pass read:
- user enters `Move > X`
- snap is enabled at `1.0`
- user types `0.3`
- first `Enter`:
  - console shows:
    - `confirm 0.3 off snap`
  - choices become:
    - `confirm`
    - `deny`
  - assisted prefill becomes:
    - `confirm`
- second `Enter`:
  - apply `Move X = 0.3`
  - return to `SketchPlane > Move`

#### Concrete Implementation Steps

1. Deepen sketch-plane move state in `useSpaghettiStore`.
   - introduce a real move-axis leaf state instead of only `adjustScope = 'move' + activeTransformAxis`
   - keep viewport drag live while that leaf is active

2. Update move-axis command entry in `useSpaghettiStore`.
   - `move-x`, `move-y`, `move-z` should enter the new axis leaf directly
   - parent `move` should remain the reusable return target after commit/cancel

3. Update assisted descriptor building in `ConsoleDock`.
   - when the store is in the move-axis leaf, render:
     - `Graph > Sketch > Sketch Plane > Move > X`
     - `Graph > Sketch > Sketch Plane > Move > Y`
     - `Graph > Sketch > Sketch Plane > Move > Z`
   - make the leaf prefill show the current axis value
   - make the off-snap confirm read:
     - `confirm <value> off snap`
     - `[confirm, deny]`
     - prefill `confirm`

4. Add float parsing and confirm handling in `ConsoleDock`.
   - parse the accepted first-pass float grammar
   - if snap is off, commit directly
   - if snap is on and value is on-snap, commit directly
   - if snap is on and value is off-snap:
     - enter confirm prompt
     - apply only on `confirm`
     - return to `Move` on `deny`

5. Keep viewport overlay aligned in `ViewportOverlay`.
   - axis highlighting and drag affordances should keep reading the same active axis leaf
   - drag updates should continue to flow into the same draft transform value the console shows

6. Add targeted tests.
   - descriptor/breadcrumb tests in `ConsoleDock.test.tsx`
   - state/command tests in `useSpaghettiStore.test.ts`
   - if needed, overlay interaction coverage in `ViewportOverlay.test.tsx`

#### Verification Matrix

- `Move > X` enters breadcrumb `Graph > Sketch > Sketch Plane > Move > X`
- `Move > X` still allows live X drag in the viewport
- snap enabled + drag on X follows the snap interval
- type `10` in `Move > X` then `Enter` applies `X = 10` and returns to `Move`
- type `.1` in `Move > X` parses successfully
- type `+0.1` in `Move > X` parses successfully
- snap enabled at `1.0` + type `0.3`:
  - first `Enter` shows `confirm 0.3 off snap`
  - choices become `[confirm, deny]`
  - prefill becomes `confirm`
  - second `Enter` applies `0.3`
- snap enabled at `1.0` + type `0.3` + choose `deny` returns to `Move > X` or `Move` without applying, using the implementation's chosen return rule consistently
- `Esc` from `Move > X / Y / Z` returns to `Move` without commit
- after `Move > X > 10 > Enter`, user can immediately choose `Y` and continue

#### Commit / Return Behavior

- entering `Move > X` arms X-axis numeric entry
- entering `Move > X` also keeps X-axis drag editing live
- accepted float submit applies:
  - `Move X = <value>`
- after successful commit:
  - return to `SketchPlane > Move`
- entering `Move > Y` or `Move > Z` behaves the same way for those axes, including live drag plus typed overwrite
- this return is important because the user may want a sequence like:
  - `Move > X > 10 > Enter`
  - `Move > Y > 2 > Enter`
  - `Move > Z > -4 > Enter`

#### Cancel / Back Behavior

- `Back`
  - return to `SketchPlane > Move`
- `Esc`
  - return to `SketchPlane > Move`
- cancel from the axis leaf should not apply any value
- once back at `Move`, the user may:
  - choose another axis
  - choose `Vec3`
  - return higher through the already-shipped sketch back-step rules

#### Hard Rules

- do not overload the axis leaf with mixed command grammar plus freeform transform scripting
- do not force the user to stay in `Move > X / Y / Z` after a successful submit
- do not widen this phase into `Rotate` hierarchy design
- do not bypass the shared sketch command ownership added in `[3.2B-S5]`
- do not fight the shared assisted-prefill replacement rule from `[4.1P]`
- do not silently round typed off-snap values to the current snap interval
- do not silently ignore move snap for live axis dragging
- do not implement the breadcrumb only in the console while leaving the store unaware of the axis leaf

#### Acceptance Shape

- [x] `Move X / Y / Z` exist as explicit child levels under `SketchPlane > Move`
- [x] the console path can honestly read `Graph > Sketch > SketchPlane > Move > X / Y / Z`
- [x] while in an axis leaf, the console expects one float value instead of sibling command tokens
- [x] while in an axis leaf, the active axis can still be dragged live in the viewport
- [x] while move snap is enabled, axis-leaf dragging still follows the active snap interval
- [x] first typed input from that leaf clears/replaces the current assisted value instead of forcing manual deletion
- [x] typed off-snap values show one extra confirm message instead of being silently rounded or blocked
- [x] after that extra confirm, the exact typed off-snap value can still be applied
- [x] valid numeric submit applies the active axis move and returns to `SketchPlane > Move`
- [x] `Back` / `Esc` from the axis leaf return to `SketchPlane > Move` without commit
- [x] the user can immediately repeat axis-by-axis movement without re-entering the full sketch-plane surface

### Shipped Summary

- `Move X / Y / Z` now enter a real `move-axis` sketch-plane adjust scope instead of staying as shallow aliases under the parent move surface
- the console now renders honest `Sketch Plane > Move > X / Y / Z` breadcrumbs with float-only entry at those leaves
- axis leaves preserve live active-axis dragging, keep replace-on-type manual entry, and return to `Move` after a successful numeric submit
- move snap now continues to apply while using axis-leaf dragging, and typed off-snap values now transition into a constrained `confirm / deny` prompt instead of being silently rounded
- starting drag or value edit on the `Move X / Y / Z` overlay sliders now routes through the same move-axis leaf state as the console commands

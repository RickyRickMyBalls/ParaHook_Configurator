## [x] `4.1I2` Console Session Integration

#### Questions / Decisions

##### [x] `q1` Decide what should start the staged session at the console layer.

##### Suggestion
- locked direction:
- `graph` + `Enter` or `g` + `Enter` should start the staged session from the normal console input
- the console should call the staged grammar seam instead of resolving `graph` through the old flat-command switch
- do not add multiple staged root commands in `4.1I2`

##### [x] `q2` Decide what the console should show after each accepted staged token.

##### Suggestion
- locked direction:
- after each accepted staged token, the console should emit:
  - the submitted token
  - the resolved breadcrumb
  - the next prompt or valid-next-choice summary
- the transcript should guide the next step explicitly

##### [x] `q3` Decide how flat commands and staged navigation should coexist at the console layer.

##### Suggestion
- locked direction:
- outside an active staged session, existing flat commands keep their current behavior
- once a staged session is active, submitted tokens should resolve against staged scope first
- do not silently fall back to unrelated flat commands while a staged session is active

##### [x] `q4` Decide how the console should handle invalid staged tokens.

##### Suggestion
- locked direction:
- the console should keep the staged session alive on invalid tokens
- it should emit:
  - the submitted token
  - the current breadcrumb
  - a scoped invalid-token message
  - the valid next choices for the current scope
- invalid input must not dump the user out of the session

##### [x] `q5` Decide how the staged session should be cancelled at the console layer.

##### Suggestion
- locked direction:
- `Esc` should cancel/reset the staged session when one is active
- the console should return to ordinary flat-command mode after reset
- the reset should be visible in transcript/status feedback

##### [x] `q6` Decide how much visual UI `4.1I2` should own.

##### Suggestion
- locked direction:
- `4.1I2` should own transcript and current-session display behavior
- it should not introduce a large new console chrome redesign
- keep the first integration modest:
  - breadcrumb/status text
  - next-choice prompt text
  - scoped error text

##### [x] `q7` Decide whether the console should auto-advance when a staged scope has only one valid entity choice.

##### Suggestion
- locked direction:
- yes, but only for single concrete entity-selection scopes
- if a staged scope resolves to exactly one real entity choice, the console may auto-advance into it
- example:
  - entering `Graph` when there is only one graph
- do not auto-advance action choices
- do not auto-advance synthetic utility options such as `List`
- transcript should visibly show that the auto-selection happened

### Implementation Spec

#### Summary

`4.1I2` should connect the staged grammar seam from `4.1I1` to the live console input path.

This is the phase where the console starts behaving like a staged navigation session instead of only a flat command line.

The first live session should be narrow:
- user types `graph` or `g`
- presses `Enter`
- console enters staged navigation mode
- later tokens are resolved one at a time through the active staged scope

#### Locked Outcome

`4.1I2` should deliver:
- live staged-session state at the console layer
- transcript output for staged token submission
- breadcrumb display via transcript/status text
- next-choice prompts after successful scope advances
- scoped invalid-token handling
- explicit staged-session reset back to flat-command mode

Important rule:
- `4.1I2` consumes the grammar seam from `4.1I1`
- it does not reimplement grammar logic inside `ConsoleDock`

#### First Console Routing Rule

The console submission path should work like this:

1. if a staged session is active:
- submit the current token to the staged grammar seam first

2. if no staged session is active:
- try staged root entry tokens such as:
  - `graph`
  - `g`

3. otherwise:
- keep the existing flat command path

Important rule:
- do not create ambiguity by partially mixing flat and staged resolution for the same submitted token

#### Transcript Rule

For staged navigation, the transcript should show a three-part pattern after each accepted token:

1. submitted token
- example:
  - `[Commands] > g`

2. resolved breadcrumb
- example:
  - `[Commands] Select > Graph`

3. next-step prompt
- example:
  - `[Commands] Choose graph [1, 2, 3, List]`

That same pattern should continue for deeper staged steps.

If a scope auto-advances because there is only one real entity choice, the transcript should also show that explicit step.

Example shape:

- `[Commands] > g`
- `[Commands] Select > Graph`
- `[Commands] Auto-selected graph_[1]`
- `[Commands] Select > Graph > graph_[1]`
- `[Commands] Choose next [Sketch, References, Open, Build]`

#### Invalid Token Rule

If the staged grammar seam returns `invalid`, the console should emit:

1. the submitted token
2. the current breadcrumb
3. a scoped invalid-token message
4. the valid next choices

Example shape:
- `[Commands] > q`
- `[Commands] Select > Graph > graph_[1]`
- `[Diagnostics] Invalid token for current scope: q`
- `[Commands] Choose next action [Sketch, References, Open, Build]`

Important rule:
- keep the session alive after invalid input

#### Cancel Rule

When a staged session is active:

- `Esc` should cancel/reset it

The console should:
- clear staged-session ownership
- return to ordinary flat-command behavior
- emit a visible reset note such as:
  - `Staged navigation cancelled`

#### State Ownership Rule

`4.1I2` should add console-layer ownership for:

- whether a staged session is active
- current staged session object from the grammar seam
- transcript emission for staged events

It should not move grammar rules into console UI code.

#### First Integration Seams

Primary seams:

- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.ts`
- `src/app/console/stagedNavigation.ts`

Likely responsibilities:

- `ConsoleDock.tsx`
  - route submissions and key lifecycle events
- `useConsoleStore.ts`
  - store current staged session state if needed at store level
- `stagedNavigation.ts`
  - continue to own token resolution and session transitions

#### Locked Deferrals

Keep these out of `4.1I2`:

- real `Sketch Draw` execution
- large multi-branch staged coverage
- autocomplete UI
- fancy breadcrumb widgets
- command palette style visuals

#### Acceptance Shape

`4.1I2` should read as complete when:

- typing `graph` + `Enter` or `g` + `Enter` starts a live staged session in the console
- the transcript shows the submitted token, the resolved breadcrumb, and the next-choice prompt
- subsequent tokens are resolved through the active staged session rather than the flat command path
- invalid staged tokens produce scoped feedback without resetting the session
- `Esc` cancels the staged session and returns the console to ordinary flat-command behavior
- if a staged entity-selection scope has exactly one real choice, the console can auto-advance and show that auto-selection explicitly



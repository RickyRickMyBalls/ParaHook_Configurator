## [x] [4.1P] - `Assisted Prefill Replace-On-Type Across Levels`

The assisted console model now correctly exposes prefill at constrained levels, but it still needs one explicit manual-typing rule.

Current friction:
- when a constrained assisted level prefills a value such as `Vec3`
- the first user-typed printable key can still append onto that suggestion instead of replacing it
- that forces the user to backspace before normal typing

Locked follow-on:
- the first printable typed key should replace the current assisted prefill
- this should hold at every constrained assisted level produced by:
  - staged navigation
  - feature-session prompt descriptors

Examples that should read the same:
- `Graph > Sketch > SketchPlane > Move`
- `Sketch Plane`
- `Sketch Draw`
- any future constrained prompt level that enters with assisted prefill active

### Purpose

- remove forced backspacing before manual override
- keep assisted prefill fast while making manual typing feel immediate
- make the override rule consistent across every assisted level instead of leaving it feature-dependent

### Intended Behavior

When the console enters a constrained assisted level:
- the input may still prefill from the assisted suggestion
- `ArrowUp` / `ArrowDown` may still cycle valid assisted choices while the input is following that suggestion
- the first printable typed key should replace the assisted prefill with that typed character
- the first paste action should also replace the assisted prefill with the pasted text
- subsequent printable keys should continue normal manual typing
- if the assisted level refreshes, or the user explicitly re-enters assisted cycling, the console may enter assisted-follow mode again

Example:
- prompt:
  - `Graph > Sketch > SketchPlane > Move`
- assisted prefill:
  - `Vec3`
- user types:
  - `x`
- resulting input:
  - `x`
  - not `Vec3x`

### Important Rule

- do not broaden this into full autocomplete or search UX
- do not rewrite `[4.1M]` or `[4.1N]`; this is a new follow-on that refines user override semantics on top of the shipped prefill and descriptor model
- do not alter unconstrained flat command entry

### Replace Trigger Definition

For `[4.1P]`, "replace-on-type" should mean:
- the first printable character input while assisted-follow is active replaces the full assisted prefill
- the first paste action while assisted-follow is active replaces the full assisted prefill
- punctuation and space should follow the same rule when they are accepted as real input by the current constrained field

First-pass boundary:
- keep IME/composition handling explicit and conservative
- do not special-case complex composition flows in this phase unless the shared console input already exposes that seam cleanly
- the minimum guaranteed behavior for this phase is standard printable keyboard input plus paste replacement

### Questions / Decisions

#### [x] `q1` Decide whether replace-on-type should be feature-specific or one shared assisted-input rule.

##### Suggestion
- locked direction:
- make it one shared console rule
- do not let staged navigation and feature-session descriptors drift into different append-vs-replace behavior

#### [x] `q2` Decide when assisted-follow mode should end.

##### Suggestion
- locked direction:
- the first printable typed key while assisted-follow is active ends assisted-follow mode
- that key replaces the full assisted prefill and starts manual override mode

#### [x] `q3` Decide when assisted-follow mode may resume.

##### Suggestion
- locked direction:
- only on a real assisted-state refresh such as:
  - entry into a new constrained assisted level
  - explicit assisted choice cycling
  - a prompt/session refresh that republishes assisted input state
- do not silently snap back during normal manual typing

### Scope Boundary

Owned here:
- one shared replace-on-first-type rule while assisted prefill is active
- consistent behavior across staged and feature-session assisted levels
- the state transition from assisted-follow mode to manual-override mode
- explicit reset points when a new assisted level or explicit re-cycle should restore assisted-follow mode

Not owned here:
- global autocomplete or suggestion ranking
- new command grammar breadth
- transcript redesign
- feature-specific validation logic
- rewriting the historical `[4.1M]` / `[4.1N]` docs

### Implementation Spec

Purpose:
- make assisted prefill feel helpful instead of sticky by ensuring the first manual printable key replaces the current assisted suggestion at any constrained assisted level

#### Current Code-To-Target Mapping

- current assisted-choice foundation already exists in:
  - `useConsoleStore`
  - `stagedNavigationSession`
  - `cycleStagedChoice(...)`
  - `seedInputText(...)`
- current feature-session assisted descriptors already exist through the shared prompt-descriptor direction from `[4.1N]`
- current gap:
  - the console can seed assisted input
  - the console can cycle assisted choices
  - but the transition from assisted prefill to manual printable typing is not yet locked as one shared seam

#### Current Gap

- `[4.1M]` ships staged-choice prefill and choice cycling
- `[4.1N]` extends the shared prompt descriptor seam into feature sessions
- remaining gap:
  - the transition from assisted prefill to manual typing is not locked as one shared rule
  - some constrained levels can still append onto the prefilled suggestion instead of replacing it

#### State Transition Read

Use one simple assisted-input state read:

| Current state | Event | Next state | Expected result |
| --- | --- | --- | --- |
| `assisted-follow` | first printable key | `manual-override` | replace assisted value with typed character |
| `assisted-follow` | paste | `manual-override` | replace assisted value with pasted text |
| `assisted-follow` | `ArrowUp` / `ArrowDown` | `assisted-follow` | keep following assisted choice and update input |
| `manual-override` | printable key | `manual-override` | continue normal typing |
| `manual-override` | explicit `ArrowUp` / `ArrowDown` cycle in a constrained assisted session | `assisted-follow` | restore assisted choice following |
| `manual-override` | new constrained assisted prompt published | `assisted-follow` | seed from new assisted prompt |

#### Main Decision

The main decision in `[4.1P]` is:
- when assisted prefill is active and the user begins typing manually, should the first printable key append to the suggested token or replace it?

Locked answer:
- replace it
- if the input is still in assisted-follow mode, the first printable key clears the assisted text and starts manual input with that key
- once manual override begins, normal insertion rules resume until the assisted state is explicitly re-entered or refreshed

#### Recommended First Data Shape

The first implementation should stay narrow.

Recommended shared console-side shape:
- `isAssistedFollowActive`
  - whether the current input is still following assisted prefill/cycling behavior
- `assistedSource`
  - where the current assisted state came from:
    - staged navigation
    - feature-session descriptor
- `assistedValue`
  - the current assisted token/value shown in the input before manual override
- `manualOverrideStarted`
  - whether the user has already replaced assisted input with manual typing in the current assisted session

Important rule:
- keep this as a small console-input seam
- do not invent a second feature-local state model for the same behavior

#### Caret / Selection Read

The implementation should behave like full-value replacement, not like append-after-caret editing.

Recommended first read:
- treat assisted-follow input as logically selected in full, even if the UI does not show native text selection styling
- the first replace-trigger event should replace the entire assisted value
- once manual override begins, normal caret placement and editing rules resume

Important rule:
- do not depend on fragile DOM selection visuals as the only source of truth
- the console input seam should know whether the current value is still in assisted-follow mode

#### First Implementation Cut

- keep existing prefill entry behavior from `[4.1M]` / `[4.1N]`
- add one shared console-side `assisted-follow` vs `manual-override` distinction
- on constrained assisted entry:
  - seed input from the descriptor or staged choice
  - mark assisted-follow as active
- on first printable key while assisted-follow is active:
  - replace the full prefilled value with the typed key
  - mark manual override active
- on explicit choice cycle or arrival at a new constrained assisted level:
  - restore assisted-follow mode
  - update input from the new assisted suggestion

#### First Implementation Steps

`[4.1P]` should likely be completed in this order:

1. identify the shared console seam that currently seeds assisted input for staged and feature-session prompts
2. add one explicit `assisted-follow` vs `manual-override` state distinction in that seam
3. route first printable-key handling through that distinction before normal input append behavior runs
4. replace the full assisted value with the typed key when assisted-follow is still active
5. keep later printable keys on the normal manual input path after override begins
6. restore assisted-follow only on real assisted refresh points such as new constrained levels or explicit cycling
7. verify the same rule holds for:
   - staged navigation
   - `Sketch Plane`
   - idle `Sketch Draw`
   - `Graph > Sketch > SketchPlane > Move`

#### Ownership Rule

- keep this rule owned by the shared console prompt/input seam
- do not let each feature decide append-vs-replace independently
- staged navigation and feature-session descriptors should both feed the same replace-on-type contract

#### Edge Rules

- backspace and delete should behave like normal manual editing once manual override is active
- unconstrained flat command entry should not change
- arrow cycling should remain the explicit way to reselect assisted choices
- if the user manually diverges from the suggestion, the console should not silently snap back until a real assisted-state refresh or explicit cycle occurs
- paste should act like first-key replacement when assisted-follow is still active
- once manual override begins, paste should behave like normal text insertion/replacement for the live caret selection

#### Hard Rules

- do not patch staged navigation and feature sessions separately with duplicate append-vs-replace logic
- do not make transcript prompt text the source of truth for whether assisted-follow is active
- do not re-enter assisted-follow mode on every render or keystroke
- do not change unconstrained flat command typing in the same pass unless a direct shared-input conflict forces it
- do not widen this into global autocomplete, fuzzy match, or search UX

#### Acceptance Shape

- `Graph > Sketch > SketchPlane > Move` can prefill `Vec3`
- typing `x` produces `x`, not `Vec3x`
- pasting `1,2,3` over assisted `Vec3` produces `1,2,3`, not `Vec31,2,3`
- the same replace-on-first-type read holds for staged navigation and feature-session descriptors
- arrow cycling and prefill still work before manual override begins
- unconstrained console typing stays unchanged
- the refinement lands as one shared console behavior, not separate feature-local patches

#### Verification Matrix

Minimum verification reads:

| Scenario | Start | Action | Expected result |
| --- | --- | --- | --- |
| staged assisted replace | `Vec3` | type `x` | input becomes `x` |
| staged assisted paste replace | `Vec3` | paste `1,2,3` | input becomes `1,2,3` |
| assisted cycle before override | `XY` | `ArrowDown` | input becomes next assisted choice |
| manual override after cycle | `XZ` | type `y` | input becomes `y` |
| explicit re-entry to assisted follow | manual `y` in constrained assisted session | `ArrowUp` | input returns to assisted choice tracking |
| unconstrained flat command typing | freeform input | type printable key | unchanged normal typing behavior |

## [x] [4.1M] - `Staged Choice Prefill And Arrow Cycling`

The staged console should become easier to advance when the user is already inside a constrained choice list.

Recommended refinement:
- when the console presents staged choices
- the first valid choice should automatically appear in the input field
- `Enter` or command-scoped `Space` should accept the currently shown choice immediately

This should make staged navigation feel less like repeated blank-field typing and more like guided progression.

### Suggestion

- locked direction:
- treat the staged choice list as a lightweight chooser layered on top of normal command entry
- prefill the first valid choice in the input row whenever the console enters a staged choice state
- highlight the currently targeted choice in the bottom-left single-row summary/status area
- allow `ArrowUp` and `ArrowDown` to cycle the targeted choice without removing free typing

### Purpose

- reduce friction when the next valid command is already known
- make `Enter` and command-scoped `Space` useful shortcuts for drilling deeper into staged command trees
- help the user see which choice is currently targeted before submitting it

### Intended Behavior

When the console enters a staged choice state such as:
- `Root > Choose next [Graph]`
- `Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]`

It should:
- place the first valid choice into the input field automatically
- visually distinguish the currently targeted choice in the bottom-left summary area
- let `ArrowUp` and `ArrowDown` move that target across sibling choices
- let `Enter` or command-scoped `Space` submit the currently targeted choice directly

### Example Shape

Example:
- staged scope shows:
  - `Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]`
- input field initially contains:
  - `Sketch Plane`
- highlighted bottom-left choice:
  - `Sketch Plane`
- user presses `ArrowDown`
  - input field changes to `Sketch Draw`
  - highlighted bottom-left choice changes to `Sketch Draw`
- user presses `Enter`
  - `Sketch Draw` submits
  - the console advances to the deeper staged result

### Important Rule

- arrow cycling should assist staged choices
- it should not replace normal free typing

That means:
- the user must still be able to overwrite the prefilled choice by typing
- direct typed tokens should still work even if they do not match the currently highlighted suggestion
- this should remain a helper for constrained staged scopes, not a global command palette behavior

### Scope Boundary

Owned by this vision:
- staged choice prefill in the input row
- visible targeted-choice highlight in the single-row summary area
- `ArrowUp` and `ArrowDown` cycling for staged sibling choices
- `Enter` / command-scoped `Space` submission of the currently targeted staged choice

Not owned here:
- broad command-history redesign
- replacing freeform command entry
- full autocomplete/search behavior
- non-staged global suggestion systems

### Suggested UI Read

The bottom-left single-row console summary area should do more than repeat the raw prompt.

Recommended read:
- keep the staged scope text visible
- render the available choices with one clearly highlighted current target
- update that highlight when the user cycles up/down

Plain-English read:
- the summary should feel like a compact staged-choice strip
- not just passive status text

### Likely Value

- the user can advance through common staged flows with less typing
- the current choice becomes more visually obvious before submission
- staged console navigation starts to feel closer to a real guided command surface instead of a plain prompt log

### Hard Rule

- do not let prefill/cycling become the reason staged navigation works
- the underlying staged command model must still remain valid when the user types manually

This should be a visible usability refinement on top of the existing staged-command contract, not a replacement for it.

### Implementation Spec

Purpose:
- make staged console navigation faster and easier to read by prefilling the current best next choice, exposing that choice visibly in the single-row console summary, and letting the user cycle sibling choices with arrow keys before submitting

#### Scope

Owned here:
- first valid staged-choice prefill in the input row
- one current targeted-choice model for staged choice sets
- bottom-left single-row summary rendering that highlights the currently targeted choice
- `ArrowUp` and `ArrowDown` cycling across sibling staged choices
- `Enter` and command-scoped `Space` submission of the current targeted choice

Not owned here:
- broad autocomplete or global suggestion systems
- replacing freeform command typing
- larger transcript-history redesign
- command-language redesign
- non-staged search/palette behavior

#### Main Decision

The main decision in `[4.1M]` is:
- should staged choices remain only passive text in the prompt, or should the console actively surface and cycle a current targeted choice while preserving manual typing?

Locked answer:
- keep staged choices as a real typed command flow
- add one lightweight targeted-choice assist layer on top:
  - prefill the first valid choice
  - highlight the current targeted choice in the summary area
  - cycle sibling choices with `ArrowUp` and `ArrowDown`
- do not replace manual command entry with chooser-only behavior

#### First Implementation Cut

The first implementation cut should stay narrow:
- only affect staged choice states that already expose a finite list of valid next tokens
- do not change how non-staged freeform command entry behaves

First behavior to make real:
- when a staged session exposes valid choices, prefill the input with the first valid choice label/token
- mark that first choice as the current targeted choice in the bottom-left summary strip
- allow `ArrowDown` to move to the next sibling choice
- allow `ArrowUp` to move to the previous sibling choice
- let `Enter` or command-scoped `Space` submit the currently targeted choice if the input is still aligned to that suggestion path

Important rule:
- if the user begins typing a manual override, the console should respect that typed input instead of forcing the cycled suggestion back into the field on every keypress

#### Input And Override Rule

The input field should support two clearly different states during staged choice assist:
- assisted staged choice state
  - input is prefilled from the current targeted choice
  - up/down cycling updates the input text to the targeted sibling
- manual override state
  - user has typed away from the prefilled suggestion
  - free typing takes priority until the user returns to a recognized staged choice or the staged state refreshes explicitly

Important rule:
- the system may prefill on staged-state entry
- it should not continuously fight the user after they begin manual typing

#### Summary-Area Read

The bottom-left single-row summary area should become a compact staged-choice strip when staged choices exist.

Recommended first read:
- keep the current staged scope text visible
- render the available choices inline
- visually highlight the current targeted choice
- update that highlight immediately when up/down cycling changes the target

Important rule:
- the summary strip should show which choice is targeted now
- not just list choices as flat passive text

#### Likely First Data Shape

The first implementation will likely need one narrow staged-choice targeting seam such as:
- current staged choice index
- current staged choice token/label
- whether the input is still following the assisted suggestion or has entered manual override

Important rule:
- keep this state attached to staged navigation or console input state
- do not invent a second parallel command model for the same staged scope

#### Example Outcome Shape

Example:
- staged session:
  - `Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]`
- first render:
  - input = `Sketch Plane`
  - summary highlights `Sketch Plane`
- user presses `ArrowDown`
  - input = `Sketch Draw`
  - summary highlights `Sketch Draw`
- user presses `Enter`
  - `Sketch Draw` is submitted
  - staged navigation advances

Manual override example:
- prefilled input = `Sketch Plane`
- user types `Back`
- console should submit `Back` if valid
- the assist layer should not force the input back to `Sketch Plane`

#### First Implementation Steps

`[4.1M]` should likely be completed in this order:

1. identify the staged-navigation seam that already exposes valid choices
2. add one targeted-choice state for the current staged sibling choice
3. prefill the input field with the first valid choice on staged-state entry
4. update the bottom-left summary area to render and highlight the targeted choice
5. add `ArrowUp` / `ArrowDown` cycling across sibling choices
6. submit the targeted choice through existing staged command submission on `Enter` / command-scoped `Space`
7. verify manual typing still overrides the assist behavior cleanly

#### Hard Rules

- do not make up/down cycling the only way to select a staged choice
- do not prevent the user from typing a different valid token manually
- do not widen this into broad autocomplete/search UX
- do not let the assist layer become the source of truth for staged navigation validity
- do not alter non-staged command entry behavior in the same pass unless a direct conflict forces it

#### Acceptance Shape

- entering a staged choice state prefills the input with the first valid choice
- the bottom-left single-row summary area clearly highlights the current targeted choice
- `ArrowUp` and `ArrowDown` cycle sibling staged choices visibly
- `Enter` and command-scoped `Space` can submit the currently targeted staged choice
- manual typing still works as an override without the assist layer fighting the user
- the change lands as one narrow staged-navigation usability refinement rather than a broad command-entry redesign



## [ ] 4.1h
### Questions / Decisions

#### [x] `q1` Decide whether printable typing should auto-enter the console when no real text field owns focus.

##### Suggestion
- locked direction:
- locked direction:
- yes
- do not require `/` as the only honest way to start typing
- if the user types a printable key while no normal text-editing field owns focus, the console should capture that text automatically

#### [x] `q2` Decide what fields must remain protected from console auto-capture.

##### Suggestion
- locked direction:
- never steal typing from:
  - `input`
  - `textarea`
  - `select`
  - contenteditable surfaces
- parameter fields are the most important first protected case

#### [x] `q3` Decide whether shortcut aliases should stay visually separate from typed commands or flow through one shared command seam.

##### Suggestion
- locked direction:
- use one shared command seam
- if the user types `m` then `Enter`, the console should visibly show `m` as typed input
- alias resolution should happen after submission, not through a hidden parallel shortcut-only path

#### [x] `q4` Decide what keys should remain immediate instead of typed-first.

##### Suggestion
- locked direction:
- keep the reserved immediate set narrow
- `Esc` should remain immediate for cancel/clear behavior
- `Enter` should remain immediate when the console is already capturing or a live session expects acceptance
- ordinary printable letters such as `m`, `r`, and `s` should be typed-first in `4.1H`
- avoid reserving ordinary printable letters unless a specific session absolutely requires it

#### [x] `q5` Decide how keyboard routing priority should work in the hybrid model.

##### Suggestion
- locked direction:
- route keys in this order:
  - real text field ownership
  - active modal/session hard ownership
  - console capture ownership
  - reserved immediate keys
  - printable-key auto-capture
- keep that order explicit so the console does not fight parameter editing or session-lifecycle keys

#### [x] `q6` Decide how transcript/history should describe hybrid command entry.

##### Suggestion
- locked direction:
- transcript/history should show the actual typed token the user entered
- keep invocation metadata such as:
  - `typed`
  - `autoCapture`
  - `shortcutAlias`
- but do not fork execution logic based on those sources

### Implementation Spec

#### Summary

`4.1H` should evolve the console from the older explicit `/`-first entry model into one hybrid command-input seam.

The user should be able to begin typing command text directly when the app is not already inside a real text-editing field. That typing should appear in the console immediately, and typed aliases should resolve through the same dispatcher as longer command names.

This phase is about command entry and routing correctness, not autocomplete, not rebinding UI, and not a second sketch-only console system.

#### Locked Outcome

`4.1H` should deliver:
- printable-key auto-capture into the console when no protected text field owns focus
- visible typed command buffering without requiring `/`
- `/` remains available as an optional explicit focus/open affordance
- one shared dispatcher for:
  - explicit typed commands
  - auto-captured command text
  - shortcut aliases
- a narrow reserved immediate-key set
- clear text-field guards so parameter editing and other real text input remain safe

#### Keyboard Ownership Model

The hybrid keyboard model should treat input as four ownership cases:

1. real text field ownership
- `input`, `textarea`, `select`, and contenteditable surfaces keep the keyboard
- the console must not capture printable keys from those targets

2. active session hard ownership
- if a live session/tool/modal truly owns a key for lifecycle reasons, that owner runs first
- keep this case narrow and explicit

3. console capture ownership
- when the console is already capturing, printable keys extend the command buffer
- `Enter` submits
- `Esc` clears/cancels according to console/session rules

4. default app surface ownership
- if no earlier owner applies and the key is printable, the console auto-captures it

#### Auto-Capture Behavior

When the user presses a printable key and:
- no protected text field owns focus
- no higher-priority session hard-owns the key
- the console is not intentionally blocked

Then the console should:
- enter capture mode
- focus the command input
- seed the input buffer with the typed character
- show that character immediately in the console row

Example:
- user presses `m`
- console buffer becomes `m`
- user presses `Enter`
- command dispatcher resolves `m` as an alias if appropriate

Equivalent example:
- user presses `/`
- console opens/focuses explicitly
- user may then type as usual
- `/` is still valid, but no longer required to begin command entry

#### Command And Alias Rule

Typed commands and shortcut aliases must share one dispatcher.

That means:
- `move`
- `m`
- later `line`
- later `pline`

should all resolve through the same command-routing layer rather than separate execution paths.

Important rule:
- do not keep one hidden shortcut engine and one typed-command engine
- keep one command system with multiple entry styles

#### Reserved Immediate Keys

Keep the immediate-key set intentionally small.

First locked set:
- `Esc`
- `Enter` when capture/session state expects acceptance

Possible later reserved keys may exist, but only when they are clearly stronger than typed-first command entry.

Important rule:
- normal printable letters should default toward visible command text capture, not silent action firing
- in `4.1H`, `m / r / s` are no longer treated as silent immediate hotkeys on the normal app surface

#### Transcript And History Rules

The transcript/history surface should reflect the real user-entered token.

Examples:
- `[Commands] > m`
- `[Commands] Move`
- `[Commands] > line`
- `[Commands] Draw Sketch tool: Line`

The console may store source metadata such as:
- `typed`
- `autoCapture`
- `shortcutAlias`

But that metadata should support explanation/filtering only. It should not create different command behavior.

#### First Integration Targets

This phase should extend the current console implementation rather than replacing it.

Primary integration seams:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.ts`
- app-level keyboard routing
- existing feature areas that already emit command-like shortcut behavior

First candidate migration targets:
- current console typed commands
- command-history capture
- transform aliases like `m`, `r`, `s`
- early sketch-draw command aliases such as `line` and `pline`

#### Locked Deferrals

Keep these out of `4.1H`:
- autocomplete
- fuzzy parsing
- full command-language expansion
- hotkey rebinding UI
- transcript persistence/export
- feature-specific parallel console systems

#### Acceptance Shape

`4.1H` should read as complete when:
- typing a printable key on the normal app surface opens/seeds the console without `/`
- typing inside parameter fields and other real text editors does not leak into the console
- `m` then `Enter` visibly submits `m` through the console and resolves through the shared dispatcher
- `r` and `s` follow that same typed-first path in the phase contract
- `/` still opens/focuses the console, but the user no longer needs it to begin typing
- transcript/history show the real entered token instead of only hidden shortcut-side effects
- `Esc` and other reserved immediate lifecycle keys still behave predictably



## [x] [4.1L] - `Command Transcript Sublayers`

The `Commands` layer may need one more level of meaning inside the same transcript system.

Recommended refinement:
- keep `Commands` as the top-level family
- split the visible line meaning into:
  - `Commands.User`
  - `Commands.System`

Purpose:
- let the user scan what they typed separately from what the console returned
- make staged command flows easier to read without turning the console into separate logging products

Suggested read:
- `Commands.User`
  - exact typed command text
  - accepted token path
  - staged choice text the user explicitly committed
- `Commands.System`
  - accepted command summary
  - follow-up prompt
  - validation result
  - completion text
  - error text that belongs to command execution rather than broader diagnostics

Important rule:
- this should remain one transcript system
- do not turn command input and command response into detached consoles
- layer filtering should still treat both as part of the `Commands` family

Example shape:
- `Commands.User`
  - `g box`
- `Commands.System`
  - `Selected graph: box`
- `Commands.User`
  - `m`
- `Commands.System`
  - `Move: specify axis`

Why this likely helps:
- users can see the command conversation as a clearer back-and-forth
- typed aliases such as `m / r / s` remain visible as user actions instead of disappearing into system-only result lines
- staged command chains become easier to audit when debugging whether the user entered the wrong thing or the console resolved the right thing poorly

Boundary:
- this is a transcript/detail refinement
- it should not require a second command model
- it should not replace the broader existing layers such as `Shortcuts`, `Worker`, `App`, `Params`, or `Diagnostics`

### Implementation spec

Purpose:
- make command back-and-forth easier to scan by separating user-entered command lines from system-returned command lines inside the existing `Commands` family

#### Scope

Owned here:
- one implementation-ready split of command transcript entries into:
  - `Commands.User`
  - `Commands.System`
- transcript rendering changes needed to show that distinction
- filtering/grouping behavior that keeps both meanings inside the existing `Commands` family
- first-pass emission rules for which command events land in each subtype

Not owned here:
- broader transcript redesign
- new top-level layer families
- result-history grouping or collapse trees
- changes to `Shortcuts`, `Worker`, `App`, `Params`, or `Diagnostics`
- command-language redesign

#### Main Decision

The main decision in this refinement is:
- should command input and command return text become separate top-level layers or remain one command family with finer subtype meaning?

Locked answer:
- keep one top-level `Commands` family
- implement two first subtypes inside it:
  - `Commands.User`
  - `Commands.System`
- do not split them into detached consoles or unrelated layer products

#### First Implementation Cut

The first implementation cut should stay narrow:
- keep current command behavior
- change only transcript semantics and line labeling
- make typed-versus-returned command lines visibly distinguishable

First command events to classify:
- `Commands.User`
  - exact typed command submission
  - accepted staged token text the user explicitly committed
  - typed aliases such as `m`, `r`, or `s` when submitted through the command path
- `Commands.System`
  - accepted command summary
  - follow-up prompt
  - validation message
  - completion message
  - command-scoped error text

Important rule:
- only classify text as `Commands.User` when it represents explicit user-submitted command input
- do not move unrelated app events or shortcut telemetry into `Commands.User`

#### Rendering And Filtering Rule

The transcript should still behave as one layered console system.

Rules:
- `Commands.User` and `Commands.System` both remain part of the `Commands` family
- filtering `Commands` on should show both
- future fine-grain filtering may allow showing one subtype without the other, but that is optional in the first pass
- if the collapsed console only shows one latest command-family line, it may still display whichever subtype produced the latest visible command entry

Important rule:
- the user should be able to understand that these are two meanings inside one command transcript flow, not two separate consoles

#### Ownership Rule

Ownership should stay with the existing console transcript model.

Recommended read:
- the console transcript/event model should own the subtype field
- command dispatch/command submission paths should emit the correct subtype
- transcript rendering should read subtype meaning instead of inferring typed-versus-returned text from ad hoc string patterns

Avoid:
- duplicating one command exchange into multiple transcript entries just to fake subtype meaning
- pushing transcript classification logic down into unrelated feature panels

#### Likely First Data Shape

The first implementation should likely extend the current command transcript entry shape with one narrow field such as:
- `commandLineKind`
  - `user`
  - `system`

Or an equivalent field under the existing layer/event model.

Important rule:
- keep the added field narrow and transcript-focused
- do not redesign the whole console event schema unless the current type shape truly blocks the change

#### Example Outcome Shape

Example:
- `Commands.User`
  - `g box`
- `Commands.System`
  - `Selected graph: box`
- `Commands.User`
  - `m`
- `Commands.System`
  - `Move: specify axis`
- `Commands.User`
  - `x`
- `Commands.System`
  - `Unknown axis`

This should make it easy to see:
- what the user asked for
- what the console returned

#### First Implementation Steps

This refinement should likely be completed in this order:

1. identify the existing transcript entry shape for command lines
2. add one narrow subtype field for user-versus-system command meaning
3. update command submission paths to emit `Commands.User`
4. update command result/prompt/error paths to emit `Commands.System`
5. update transcript rendering so the distinction is visible
6. verify `Commands` family filtering still works as one command family
7. stop before broadening into richer history UX or larger transcript redesign

#### Hard Rules

- do not create a second command transcript product
- do not move shortcut-only telemetry into `Commands.User` unless it truly flowed through command submission
- do not redefine `Diagnostics` errors as `Commands.System` unless they are specifically command-scoped
- do not turn this refinement into a full message-threading or grouped-history feature
- do not require command-scope redesign before landing the subtype distinction

#### Acceptance Shape

- the transcript can visibly distinguish command input from command return text
- user-submitted command lines read as `Commands.User`
- command prompts/results/validation/completion lines read as `Commands.System`
- the `Commands` family still behaves as one console layer family
- the change lands as one narrow transcript refinement rather than a broad console redesign



# Console Phase Console-13 - Root Alias Shortcut Contract

## Doc Header

### Doc History
3. 2026-05-24 15:28:07: Implemented and closed `Console 13 / Phases 1-4` by adding a staged root alias read model, promoting `S` as the canonical Sketch alias, moving Camera to `CA`, routing Shortcut First plain aliases and Console First shifted aliases through staged navigation, preserving delayed `C` Console focus, adding focused tests, and passing the production build.
2. 2026-05-24 15:12:38: Prepped `Console 13 / Phase 1 - Root Alias Read Model And Display Contract` for implementation by grounding the slice in staged root choices, `ConsoleBar` alias highlighting, existing root display tests, and the live `Sketch` alias gap while deferring global alias key routing to later phases.
1. 2026-05-24 12:08:57: Created this future Console phase to make root Console aliases the shared keyboard shortcut contract, with Shortcut First using plain alias keys and Console First using shifted alias keys while execution still flows through staged navigation and existing command owners.

### Purpose

This phase defines the implementation path for making root Console aliases work as real keyboard shortcuts.

Use it to answer:
- how visible root alias hints should map to executable shortcuts
- how Shortcut First and Console First should differ
- where multi-letter alias buffering should live
- how shortcut execution should flow back through staged navigation
- which conflicts must be resolved before highlighted aliases can be trusted

Do not use it for:
- replacing staged navigation with a separate global command registry
- making Console own Sketch, Graph, Viewer, Workspace, or Reference runtime behavior
- changing graph, sketch, extrude, camera, or workspace command outcomes
- adding user-customizable key bindings beyond the existing Console input priority modes

## Doc Body

## [x] `Console 13` - `Root Alias Shortcut Contract`

### Summary

`Console 13` should make the root Console aliases into the app's root command shortcut language.

When `ConsoleInput` is Off / Shortcut First is active, the user should be able to press the root alias directly from the viewport or other non-text context:
- `S` starts Sketch
- `E` starts Extrude
- `N` then `S` starts New Sketch
- `N` then `G` creates New Graph
- `W` then `M` opens Workspace Modes

When `ConsoleInput` is On / Console First is active, the same aliases should still be available, but shifted:
- `Shift+S` starts Sketch
- `Shift+E` starts Extrude
- `Shift+N`, then `Shift+S` starts New Sketch
- `Shift+N`, then `Shift+G` creates New Graph

The visible yellow alias letters in the Console summary should become a truthful contract. If the Console highlights alias letters, the keyboard router should either honor those letters in the active input-priority mode or the display should not present them as shortcut hints.

### Why This Phase Exists

`Console 12` added `New Graph` and made `NG` a typed root alias. The Console summary now highlights aliases such as `NS` and `NG`, but the global keyboard router only has special cases for a few root commands such as Sketch and Extrude.

That leaves the user-facing promise split:
- the Console grammar accepts aliases when typed and submitted
- the summary visually advertises alias letters
- the viewport/global keyboard layer does not yet honor most of those aliases

This phase closes that gap by making root alias display, typed root command resolution, and global root shortcut routing read from one command contract.

### Locked Direction

Root alias shortcuts should execute through staged navigation.

Implementation should:
- read aliases from the same root choice source used by `createConsoleRootSession()`
- use the same effective alias data that `ConsoleBar` uses for highlighted labels where possible
- collect single-letter and multi-letter alias input through a small root alias buffer
- submit the resolved alias through `submitConsoleStagedNavigationToken(...)`
- let the existing staged execute handlers perform the actual command

Implementation should not:
- directly call `startRootSketchCommand(...)`, `createGraphDocument()`, or Workspace Modes actions from the new alias buffer
- create a parallel root command registry
- fork command behavior between typed Console aliases and viewport shortcut aliases

### Input Priority Rule

Shortcut First / `ConsoleInput Off`:
- unshifted alias letters are valid root shortcuts when no higher-priority owner owns input
- multi-letter aliases are typed as a sequence of unshifted letters
- shifted letters should not be required for root aliases in this mode

Console First / `ConsoleInput On`:
- unshifted printable letters remain available for Console text capture
- shifted alias letters are valid root shortcuts when no higher-priority owner owns input
- multi-letter aliases are typed as a sequence of shifted letters

Shared rules:
- editable targets keep native text behavior
- active command sessions, feature assist prompts, sketch draw, reference transform, and other modal owners keep their current ownership priority
- alias shortcuts are root-entry shortcuts only unless a later phase deliberately adds scoped alias shortcuts

### Alias Buffer Rule

The shortcut layer should support multi-letter aliases such as `NS`, `NG`, `WM`, `CI`, `UH`, and `UA`.

Expected behavior:
- the first valid alias key opens a short-lived alias draft
- if the draft exactly matches a single-letter alias with no longer preferred alias ambiguity, it may execute immediately
- if the draft is a prefix for multiple aliases, it should wait briefly for the next key
- if the next key completes one valid alias, submit that alias
- if the draft cannot complete any alias, clear it without executing
- buffer timeout should be short enough that failed starts do not make the app feel stuck

Implementation should prefer deterministic behavior over clever guessing.

### Conflict Rule

`C` is the main known conflict.

Final policy:
- keep `C` as the Shortcut First Console focus/entry shortcut
- keep `/` as the reliable always-available Console focus shortcut
- use `CA` as the root Camera alias
- keep `CI` as the ConsoleInput settings alias

Reason:
- existing `C` muscle memory should keep focusing Console
- Camera still gets a visible executable alias
- `CA` and `CI` can share the first `C` key through the root alias buffer
- if no second alias key completes after `C`, the buffer falls back to Console focus

### Implementation Boundaries

Owns:
- a root alias shortcut read model sourced from staged root choices
- single-letter root alias shortcut routing
- multi-letter root alias buffering
- input-priority gating for plain aliases versus shifted aliases
- dispatching resolved aliases through staged navigation
- display/shortcut parity proof for highlighted root aliases
- focused tests for Shortcut First and Console First alias routing

Does not own:
- scoped submenu alias shortcuts
- custom user key binding UI
- command filtering or hiding
- changing command runtime owners
- redesigning camera shortcut presets
- redesigning the full input routing priority stack
- making Console own graph, sketch, extrude, viewer, reference, or workspace runtime state

### Expected Code Targets

Likely staged-navigation targets:
- `src/app/console/stagedNavigation.ts`
  - expose a root alias shortcut read model or helper derived from root choices
  - include labels, canonical tokens, effective aliases, and command kind enough for routing
  - keep typed root alias matching and shortcut alias matching aligned

Likely routing targets:
- `src/app/inputRouting.ts`
  - replace Sketch/Extrude-only viewport command shortcut checks with a root alias shortcut route
  - return a root alias action or submitted alias instead of only `sketch` / `extrude`
  - preserve higher-priority owners and editable-target behavior

Likely runtime target:
- `src/app/console/useConsoleInteraction.ts`
  - own the alias buffer state or delegate to a small helper
  - submit resolved aliases through the existing root staged-navigation path
  - keep radio identity and transcript behavior consistent with typed Console execution

Likely display target:
- `src/app/console/ConsoleBar.tsx`
  - ensure highlighted alias letters only advertise executable root aliases
  - avoid hard-coded root-only alias exceptions where the staged root choices can provide the same truth

Likely tests:
- `src/app/inputRouting.test.ts`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleBar.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`

### Acceptance Read

This phase is done when:
- [x] visible root alias highlights and executable root aliases share one source of truth
- [x] Shortcut First accepts unshifted root aliases from non-text contexts
- [x] Console First accepts shifted root aliases from non-text contexts
- [x] `NS` starts New Sketch through staged navigation
- [x] `NG` creates and activates New Graph through staged navigation
- [x] `S` and `E` still start Sketch and Extrude through the same command path
- [x] root aliases do not fire while editable targets or active command-session owners own input
- [x] the `C` conflict is resolved and Console focus remains reachable
- [x] focused routing, Console runtime, and summary-display tests pass
- [x] implementation work updates `docs/CHANGELOG.md`
- [x] doc changes update `docs/Doc-Log.md`

### Completion Notes

`Console 13` is implemented and closed.

Shipped behavior:
- root alias metadata now comes from staged root choices
- root `Sketch` exposes `S` as a canonical alias
- root `Camera` uses `CA`, leaving `C` for Console focus
- `ConsoleBar` root alias highlights read the staged alias contract instead of a local hard-coded root switch
- Shortcut First accepts plain root alias sequences such as `NG`
- Console First accepts shifted root alias sequences such as `Shift+N`, `Shift+S`
- resolved alias shortcuts submit through the staged Console path and suppress fake typed transcript entries
- `C` waits briefly for `CA` or `CI`, then focuses Console if no alias completes

Verification:
- `npm.cmd test -- --run src/app/console/stagedNavigation.test.ts`
- `npm.cmd test -- --run src/app/console/ConsoleBar.test.tsx`
- `npm.cmd test -- --run src/app/inputRouting.test.ts`
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "NG root alias|shifted NS root alias|CA opens|C without seeding|viewport plain E shortcut|viewport Shift\+E shortcut|creates and activates a new graph|New Sketch"`
- `npm.cmd run build`

Note:
- Full `src/app/console/ConsoleDock.test.tsx` was attempted after the focused Console 13 proof and still has unrelated older failures in workspace-mode, graph, reference/transform, and sketch-plane expectations outside the root alias shortcut contract.

## Subphases

## [x] `Phase 1` - `Root Alias Read Model And Display Contract`

### Phase 1 Summary

Create the shared root alias read that both display and shortcut routing can trust.

Phase 1 is a contract-prep implementation slice. It should make the root alias data explicit and testable, and it may fix root staged aliases that are already implied by shipped behavior. It should not yet implement global alias key buffering or Shortcut First / Console First routing.

### Phase 1 Current Live Read

Live files:
- `src/app/console/stagedNavigation.ts`
  - `buildRootChoices()` owns canonical root command order and labels.
  - `createConsoleRootSession()` exposes those choices to the staged root prompt.
  - `getConsoleRootChoiceLabels()` already exports root display labels for the no-filter root display contract.
  - `resolveEffectiveChoiceAliases(...)` already centralizes special effective aliases for Workspace Modes scopes.
- `src/app/console/ConsoleBar.tsx`
  - `selectPreferredAliasHint(...)` chooses the alias letters highlighted in active staged summaries.
  - `selectPromptSummaryAliasHint(...)` still hard-codes fallback root summary alias hints for only some root labels.
  - root staged summaries already use `resolveEffectiveChoiceAliases(...)` while parsed fallback summaries use the local hard-coded root hint switch.
- `src/app/console/stagedNavigation.test.ts`
  - already proves the full root command surface and typed alias resolution for `NG`.
- `src/app/console/ConsoleBar.test.tsx`
  - already proves preferred alias highlighting for guided choices and fallback parsed summaries.

Known live gap:
- root `Sketch` has no staged alias even though the viewport already treats `S` as the Sketch shortcut in Shortcut First mode.
- Phase 1 should promote `S` into the canonical root staged alias data instead of preserving `S` as a separate hard-coded shortcut-only truth.

### Phase 1 Implementation Spec

Implementation should:
- derive root alias metadata from staged root choices
- include full labels, canonical tokens, and aliases
- preserve the current root order
- identify which aliases are eligible for root keyboard shortcuts
- update summary alias highlighting to use this root alias truth where needed
- add `S` as the canonical root staged alias for `Sketch`
- export a focused helper such as `getConsoleRootAliasShortcutChoices()` from `stagedNavigation.ts`
- keep `getConsoleRootChoiceLabels()` as the display-label-only helper used by the root prompt
- prefer a small typed return shape over exposing mutable root choice objects directly

Verification should include:
- focused proof that `NS`, `NG`, `WM`, `CI`, and single-letter root aliases are visible in the root alias read
- focused proof that `Sketch` now exposes `S` through the root alias read
- display proof that highlighted letters match the preferred executable alias
- proof that full root labels remain visible and unchanged
- typed root proof that `S` resolves to the root Sketch command without changing Sketch runtime behavior

### Phase 1 Exact First Code Cut

Implement only the root alias read and display contract:
- update `ROOT_SKETCH_CHOICE` so `aliases` includes `S`
- add a root alias read model in `stagedNavigation.ts` derived from `buildRootChoices()`
- include normalized aliases in that read model, with preferred alias first
- include enough metadata for later routing, likely `canonicalToken`, `label`, `kind`, `aliases`, and `preferredAlias`
- update `ConsoleBar.tsx` fallback root alias hinting so it can use the staged root alias truth instead of the local hard-coded root switch where practical
- add focused tests in `stagedNavigation.test.ts` for the exported alias read and `S` root Sketch resolution
- add or tighten focused `ConsoleBar.test.tsx` coverage proving root alias highlights for `Sketch`, `New Sketch`, `New Graph`, `Workspace Modes`, and `ConsoleInput`

Do not implement in Phase 1:
- alias key buffering
- global `NS` / `NG` shortcut execution
- `inputRouting.ts` owner changes
- Console First shifted alias behavior
- the `C` conflict policy
- runtime command execution changes

## [x] `Phase 2` - `Shortcut First Plain Alias Routing`

### Phase 2 Summary

Make root aliases work as plain keyboard shortcuts when Shortcut First is active.

### Phase 2 Implementation Spec

Implementation should:
- route unshifted root aliases when `consoleInputPriorityMode` is `shortcuts-first`
- support single-letter aliases such as `S`, `E`, `G`, `R`, `Z`, `P`, and `O`
- support multi-letter aliases such as `NS`, `NG`, `WM`, `CI`, `UH`, and `UA`
- submit resolved aliases through staged navigation
- keep higher-priority input owners unchanged

Verification should include:
- `S` starts Sketch from the viewport
- `E` starts Extrude from the viewport
- `NS` starts New Sketch from the viewport
- `NG` creates and activates a new graph from the viewport
- aliases do not fire inside editable targets or modal command sessions

## [x] `Phase 3` - `Console First Shifted Alias Routing`

### Phase 3 Summary

Make the same root aliases work in Console First mode when the user holds Shift for each alias letter.

### Phase 3 Implementation Spec

Implementation should:
- keep plain printable letters available for Console text capture in Console First mode
- route shifted root aliases when `consoleInputPriorityMode` is `console-first`
- support shifted multi-letter alias sequences
- preserve existing shifted camera and display shortcut behavior unless a focused conflict is explicitly resolved

Verification should include:
- `Shift+S` starts Sketch in Console First mode
- `Shift+E` starts Extrude in Console First mode
- `Shift+N`, `Shift+S` starts New Sketch in Console First mode
- `Shift+N`, `Shift+G` creates and activates a new graph in Console First mode
- plain `s`, `e`, `n`, and `g` still capture as Console input in Console First mode

## [x] `Phase 4` - `Conflict Cleanup And Regression Proof`

### Phase 4 Summary

Resolve the known alias conflicts and lock the final root alias shortcut contract with focused regression coverage.

### Phase 4 Implementation Spec

Implementation should:
- resolve the `C` conflict by keeping `C` as Console entry/focus and moving Camera to `CA`
- keep `/` as a dependable Console focus shortcut
- keep `CI` as the ConsoleInput settings alias
- document any intentionally non-executable visible alias
- add regression coverage around root display, shortcut routing, typed alias submission, and command runtime parity

Verification should include:
- `C` focuses Console after the alias buffer timeout
- `CA` opens the Camera root alias
- `/` still focuses Console input
- `CI` remains reachable through the root alias system
- camera, zoom, pan, orbit, sketch, extrude, new sketch, and new graph aliases do not regress
- production build passes when implementation ships

# Console Phase Console-12 - Root New Graph Command

## Doc Header

### Doc History
2. 2026-05-24 11:42:27: Implemented and closed `Console 12 / Phases 1-2` by adding root staged-navigation `New Graph`, wiring `graph.new` to existing Spaghetti graph document creation and shared workspace activation, adding focused staged-navigation, radio identity, and Console runtime proof, and passing the production build.
1. 2026-05-24 11:10:17: Created this future Console phase to add a root-level `New Graph` command through staged navigation while keeping graph creation owned by Spaghetti graph documents and workspace activation owned by shared workspace intents.

### Purpose

This phase defines the implementation path for adding `New Graph` to the root of the app Console.

Use it to answer:
- where the root command should be registered
- which owner should create the graph document
- how the command should activate the new graph in the workspace
- which tests should prove root display, command execution, and transcript behavior

## Doc Body

## [x] `Console 12` - `Root New Graph Command`

### Summary

`Console 12` should add `New Graph` as a first-class root Console command.

The command should let the user type `new graph` from the canonical root prompt and get the same graph-document creation outcome as the Browser and Spaghetti editor graph-creation surfaces.

Important rule:
- Console should expose the command
- Spaghetti should still own graph document creation
- workspace intents should still own open, focus, select, and activation behavior

### Why This Phase Exists

The root Console already exposes graph-adjacent commands such as `Graph`, `Sketch`, `New Sketch`, and `Extrude`.

`New Graph` is the next small command-family expansion because graph creation is already a user-facing Browser and Spaghetti editor action, but it is not yet directly reachable from the root Console.

This should be a small owner-first command addition, not a new command system.

### Locked Direction

The command should land in the staged root command tree:
- add a root staged choice named `New Graph`
- keep visible root labels derived from the same canonical root choice source
- route `new graph` and compact label matching through existing staged-navigation matching
- optionally add a short alias such as `NG`

The command should not be added as a flat parser-only command first.

Reason:
- `consoleCommandParser.ts` is the older flat fallback path for one-shot commands such as `zoom`, `pan`, `status`, and `echo`
- root command display and multi-word root labels are now owned by staged navigation
- adding `New Graph` only to the flat parser would bypass the canonical root prompt and no-filter root visibility guardrails

### Implementation Boundaries

Owns:
- `New Graph` as a canonical root staged-navigation choice
- a new staged execute action such as `graph.new`
- command execution that calls the existing graph document creation owner
- activation of the newly created graph through the shared graph/workspace intent seam
- focused tests for root prompt display, staged navigation execution, and Console runtime behavior
- changelog and doc-log updates when implementation ships

Does not own:
- changing graph document schema
- changing graph naming rules beyond the existing `createGraphDocument(...)` behavior
- redesigning graph selection, graph list navigation, or graph load-from-file behavior
- adding a global command registry
- making Console the owner of graph document lifecycle
- changing Browser or Spaghetti editor button behavior except where shared tests require parity

### Expected Code Targets

Likely staged navigation targets:
- `src/app/console/stagedNavigation.ts`
  - add `ROOT_NEW_GRAPH_CHOICE`
  - include it in `buildRootChoices()`
  - add `graph.new` to staged execute action ids
  - return `graph.new` from both root-entry paths in `submitConsoleStagedNavigationToken(...)`

Likely runtime target:
- `src/app/console/useConsoleInteraction.ts`
  - handle `graph.new`
  - call `useSpaghettiStore.getState().createGraphDocument()`
  - activate the new graph through the existing graph target or document intent path
  - append clear `Commands` and `App` transcript entries
  - return the Console to the appropriate root or graph-selected context after creation

Likely parity reference:
- `src/app/panels/useBrowserPanelController.ts`
  - existing Browser `Create new graph` behavior already calls `createGraphDocument()` and activates the graph through workspace intents

### Acceptance Read

This phase is done when:
- [x] `Root > Choose next [...]` includes `New Graph`
- [x] typing `new graph` from no active staged session creates a new graph document
- [x] typing `new graph` from the explicit root session creates a new graph document
- [x] the new graph becomes the active graph document and is opened or focused through the shared workspace intent path
- [x] Console transcript records the accepted command and a clear app result
- [x] existing `Graph`, `Sketch`, `New Sketch`, and `Extrude` root commands still work
- [x] focused staged-navigation and Console runtime tests pass
- [x] implementation work updates `docs/CHANGELOG.md`
- [x] doc changes update `docs/Doc-Log.md`

### Completion Notes

`Console 12` is implemented and closed.

Shipped behavior:
- root Console now exposes `New Graph`
- `new graph` and `ng` resolve through staged navigation as `graph.new`
- Console runtime calls the existing Spaghetti graph document creation owner
- the new graph is activated through the existing graph/workspace intent seam
- transcript output records `New Graph`, `Created Graph 2`, and the graph-selected prompt

Verification:
- `npm.cmd test -- --run src/app/console/stagedNavigation.test.ts -t "New Graph|root staged session"`
- `npm.cmd test -- --run src/app/console/radioCommandIdentity.test.ts -t "graph commands"`
- `npm.cmd test -- --run src/app/console/ConsoleDock.test.tsx -t "creates and activates a new graph"`
- `npm.cmd run build`

## Subphases

## [x] `Phase 1` - `Root Choice And Staged Action Contract`

### Phase 1 Summary

Add the canonical staged-navigation contract for `New Graph` without yet broadening graph lifecycle behavior.

### Phase 1 Implementation Spec

Implementation should:
- add `New Graph` to root staged choices
- add `graph.new` as the staged execute action
- prove root display and root callability stay aligned
- avoid touching flat command parsing unless implementation proves a specific compatibility need

Verification should include:
- focused `stagedNavigation` root-choice coverage
- focused `stagedNavigation` execution coverage for `new graph`
- root prompt display parity coverage if existing tests do not already catch the new label

## [x] `Phase 2` - `Graph Creation Runtime And Activation`

### Phase 2 Summary

Wire the staged action to the existing graph document creation and workspace activation owners.

### Phase 2 Implementation Spec

Implementation should:
- handle `graph.new` in Console runtime execution
- call the existing `createGraphDocument()` store action
- activate the newly created graph through shared graph/workspace intents
- append deterministic transcript entries
- keep graph lifecycle cards, Build Path intake, and graph document naming under their existing owners

Verification should include:
- focused `ConsoleDock` or interaction-level proof that `new graph` creates and activates a graph
- proof that existing graph root navigation still works after adding `New Graph`
- focused regression around root prompt visibility after command execution

# Console

## Doc Header

### Doc History
47. 2026-05-24 15:28:07: Marked `Console 13 - Root Alias Shortcut Contract` complete after root staged aliases became the display and shortcut source, `S` became the Sketch alias, Camera moved to `CA`, plain and shifted alias routing landed, `C` remained delayed Console focus, focused tests passed, and the production build passed.
46. 2026-05-24 15:12:38: Prepped `Console 13 / Phase 1 - Root Alias Read Model And Display Contract` for implementation by narrowing it to staged root alias metadata, `Sketch` alias promotion, ConsoleBar root hint parity, and focused tests while leaving global shortcut routing for later phases.
45. 2026-05-24 12:08:57: Added `Console 13 - Root Alias Shortcut Contract` as the next Console shortcut-alias planning phase, routing Shortcut First plain aliases and Console First shifted aliases through staged navigation while preserving existing command owners.
44. 2026-05-24 11:42:27: Marked `Console 12 - Root New Graph Command` complete after root staged-navigation `New Graph`, `graph.new` runtime graph creation, shared workspace activation, focused tests, and production build verification landed.
43. 2026-05-24 11:10:17: Added `Console 12 - Root New Graph Command` as the next focused Console future phase, routing root-level `New Graph` through staged navigation while keeping graph creation owned by Spaghetti graph documents and workspace activation owned by shared intents.
42. 2026-04-19 21:29:35: Added the newer Console vision/generation planning route, pointing broad Console Workspace Modes surface-parity work at `Console-Vision.md`, `Console-Gen1-Index.md`, and the first `Console-1` catalog-driven workspace action phase instead of treating it as a single direct implementation patch.
41. 2026-04-03 17:24: Completed `Console 11 / Phase 5.1` by moving the submit coordinator and remaining interaction callback band into `src/app/console/useConsoleInteraction.ts`, rewiring `src/app/console/ConsoleDock.tsx` down to helper seams plus shell composition ownership, and verifying the slice with the targeted console Vitest pass plus a full production build while keeping `Phase 5` open for any final shell-thinning follow-on
40. 2026-04-03 17:04: Prepared `Console 11 / Phase 5.1` for implementation by tightening the still-open shell-thinning remainder around the live post-first-cut controller seam, locking the next code pass to moving `handleSubmitCommand(...)`, `handleEscCancelCommand(...)`, transform tab-cycle helpers, staged back or cancel helpers, `routeConsoleGlobalKey(...)`, and the rest of the still-inline interaction callback band into `src/app/console/useConsoleInteraction.ts`
39. 2026-04-03 17:04: Added a new explicit `Console 11 / Phase 5.1` follow-on after the first controller-hook cut, recording that the next shell-thinning slice is now specifically about moving `handleSubmitCommand(...)` and the remaining interaction/controller callback band into `src/app/console/useConsoleInteraction.ts` rather than leaving the rest of `Phase 5` as a vague open remainder
38. 2026-04-03 16:59: Landed the first `Console 11 / Phase 5` controller-hook cut by extracting guided-root rehydration, radio-choice coordination, duplicated main or pop-out keyboard routing, and prompt or feature or sketch sync effects into `src/app/console/useConsoleInteraction.ts`, rewiring `src/app/console/ConsoleDock.tsx` to consume that hook, and verifying the slice with the targeted console Vitest pass plus a full production build while keeping `Phase 5` open because the submit coordinator and remaining controller callbacks still live in `ConsoleDock.tsx`
37. 2026-04-03 16:42: Prepared `Console 11 / Phase 5` as an implementation-ready shell-thinning slice by tightening the future `Console 11` phase doc around the live post-`Phase 4.2` `ConsoleDock.tsx` shape, locking the next cut to a `useConsoleInteraction`-style controller hook for submit, escape/back, keyboard routing, and prompt/feature sync while keeping final render composition and windowing local
36. 2026-04-03 16:39: Completed `Console 11 / Phase 4.2` by removing the leftover inline `referenceTransformRoot` delete-latest fallback from `ConsoleDock.tsx`, adding direct focused tests for the remaining extracted reference-transform helper paths in `src/app/console/consoleReferenceContentCommands.test.ts`, and verifying the cleanup with the targeted console Vitest pass plus a full production build
35. 2026-04-03 16:34: Updated the open `Console 11` planning record after a second post-`Phase 4.1` code review showed the large duplicate runtime seam is gone but one leftover `referenceTransformRoot` delete-latest fallback and the remaining extracted active reference-transform helper coverage gap still justify one tiny follow-on, adding `Phase 4.2` to the future phase doc and widening the checklist so that cleanup is tracked explicitly before `Phase 5`
34. 2026-04-03 16:21: Completed `Console 11 / Phase 4.1` by removing the stale inline reference/content prompt and staged-execute ownership left behind in `ConsoleDock.tsx`, expanding `src/app/console/consoleReferenceContentCommands.test.ts` into direct runtime coverage for the extracted family seam, and verifying the cleanup with the targeted console Vitest pass plus a full production build
33. 2026-04-03 16:04: Updated the open `Console 11` planning record after a post-implementation review showed the first `Phase 4` runtime-family seam still leaves stale inline reference/content ownership in `ConsoleDock.tsx`, adding a new `Phase 4.1` completion slice to the future phase doc so that cleanup is tracked explicitly before `Phase 5` shell-thinning
32. 2026-04-03 15:46: Completed `Console 11 / Phase 4` by extracting the first reference-transform, content-transform, and content-owner rename runtime-family seam into `src/app/console/consoleReferenceContentCommands.ts`, routing the matching `ConsoleDock.tsx` submit paths through that module, adding focused runtime-family tests, and verifying the slice with the targeted `ConsoleDock` Vitest pass plus a full production build
31. 2026-04-03 15:21: Prepared `Console 11 / Phase 4` as an implementation-ready runtime-family slice by tightening the future `Console 11` phase doc around the live post-`Phase 3` submit seam, locking the first extraction cut to the shared reference-transform, content-transform, and content-owner rename family boundary, and making the exclusions explicit so sketch, radio, workspace, and flat-root command cleanup do not get accidentally absorbed into the same code pass
30. 2026-04-03 15:03: Completed `Console 11 / Phase 3` by extracting the floating, pop-out, drag, resize, split-preview, and host-render data mechanics out of `ConsoleDock.tsx` into `src/app/console/useConsoleWindowing.ts`, keeping the final floating/pop-out/split JSX visibly owned by `ConsoleDock.tsx`, and verifying the window-host extraction with the targeted `ConsoleDock` Vitest pass plus a full production build
29. 2026-04-03 14:41: Prepared `Console 11 / Phase 3` as an implementation-ready host-mechanics slice by tightening the future `Console 11` phase doc around the live post-`Phase 2` windowing seam, locking the `useConsoleWindowing`-style boundary, explicit inputs and outputs, exclusions, sequencing, and verification while leaving the overall `ConsoleDock` decomposition phase open
28. 2026-04-03 14:31: Completed `Console 11 / Phase 2` by extracting the locked first-cut parser, prompt-text, and literal helpers out of `ConsoleDock.tsx` into dedicated console helper modules with focused helper tests and full console plus build verification, while keeping the larger `ConsoleDock` decomposition phase open for the later window-host and runtime-family cuts
27. 2026-04-03 14:24: Prepared `Console 11 / Phase 2` as an implementation-ready first extraction slice by tightening the future `Console 11` phase doc around the exact pure-helper first cut, locked file targets, exclusions, sequencing, and test plan while leaving the overall `ConsoleDock` decomposition phase open
26. 2026-04-03 12:10: Completed `Console 11 / Phase 1` as a read-first responsibility audit, adding concrete findings and a locked extraction handoff to the future `Console 11` plan doc and marking only the first checklist step complete while keeping the overall plan open
25. 2026-04-03 11:55: Renamed the open `ConsoleDock` organization plan into the new future-doc style `Console 11`, removed the legacy `5.1H` lane name from that plan record, moved the standalone file into `Console/Future/`, and renamed its implementation ladder to plain `Phase 1` through `Phase 5`
24. 2026-04-03 11:20: Added a new open console architecture phase `[5.1H] ConsoleDock Organization And Decomposition Plan`, created a standalone root-level phase doc for it, and broke the `ConsoleDock.tsx` cleanup into explicit planned subphases so future console refactor work can land in smaller, reviewable slices
23. 2026-03-26 07:08: Moved the standalone shipped console phase docs into `Console/Shipped/`, left the still-open `[4.1I]` parent record at the root because `4.1I5` is not done yet, and updated the phase index plus phase-doc guidance so shipped links now resolve through the shipped folder instead of the mixed old root layout
22. 2026-03-25 21:49: Marked `[5.1G] Surface-Agnostic Command Ownership And Adapter Expansion` complete after shipping the first owner-first command migration cut, moving its standalone phase record into `Console/Shipped/`, and updating the phase index so shared workspace-selection outcomes and shared view commands are now landed console-family history rather than an open future follow-on
21. 2026-03-24 14:19: Created the standalone future phase doc `Future/Console_Phase 5.1G - Surface-Agnostic Command Ownership And Adapter Expansion.md`, updated the phase-doc guidance to reflect the folderized `Console/Future/` layout, and linked the new `5.1G` follow-on out of the bottom phase index
20. 2026-03-24 14:15: Added a bottom moving-forward summary plus new open `[5.1G] Surface-Agnostic Command Ownership And Adapter Expansion`, locking the rule that `Console`, `Browser`, `Model Viewport`, and `View Toolbar` should stay as surface adapters over shared workspace, graph, and view owners instead of becoming separate command owners
19. 2026-03-23 00:50: Added the first explicit projection-switch example under the existing toolbar-alignment rule, locking the recommendation that visible `Camera > Projection > Orthographic / Perspective` choices in the view toolbar should map to the same console path with local `O` / `P` aliases instead of inventing a toolbar-only behavior seam
18. 2026-03-21 11:33: Marked `[4.1P] Assisted Prefill Replace-On-Type Across Levels` complete after landing one shared assisted-follow override rule in the console input seam, so staged navigation and feature-session descriptors now replace assisted prefill on first printable typing, preserve manual override until explicit assisted re-entry, and support focused-input paste replacement without rewriting the already-shipped `[4.1M]` and `[4.1N]` records
17. 2026-03-21 11:20: Added a new open follow-on `[4.1P] Assisted Prefill Replace-On-Type Across Levels`, so the intended rule that the first printable typed key should replace assisted prefill at any constrained level now has its own future console phase instead of overwriting the already-shipped `[4.1M]` and `[4.1N]` records
16. 2026-03-21 11:08: Collapsed the old duplicated bottom-of-file phase/spec dump into a compact phase index, so `Console.md` now keeps the main architecture body plus short per-phase summary/goals/docs/checklist entries while the detailed implementation specs remain in the standalone `Console_Phase ...` docs
15. 2026-03-21 10:49: Reverted the mistaken assisted-prefill overwrite edits back out of the already-shipped `[4.1M]` and `[4.1N]` sections so those phase records remain historically accurate; the later idea that first typed input should replace assisted prefill is still valid, but it now needs its own future follow-on instead of retroactively changing shipped phase docs
14. 2026-03-21 10:44: Tightened the assisted-choice console direction so staged and feature-session prompt assist now explicitly require the first user-typed printable key to replace the current assisted prefill at any constrained level instead of appending onto the suggested token, matching the intended `Graph > Sketch > SketchPlane > Move` style overwrite flow
13. 2026-03-21 10:34: Split the real console phase and subphase sections into standalone phase-doc copies in this same folder using the `Console_Phase <phase id> - <title>.md` naming pattern, so `Console.md` can stay the architecture/index surface while the executable console phases now each have their own dedicated planning file like the newer sketch split
12. 2026-03-19 23:48: Updated the active `[4.1M]` console guidance from left/right cycling to up/down cycling, so staged choice assist now preserves normal caret movement while the app-wide staged-console keyboard path can still cycle sibling choices even before the input is focused
11. 2026-03-19 23:34: Expanded `[4.1M]` staged-choice prefill and arrow cycling into an implementation-ready console spec, locking the first-pass input-prefill rules, bottom-row highlighted-choice read, left/right cycling behavior, free-typing override boundaries, and acceptance shape as one narrow staged-navigation refinement task
10. 2026-03-19 23:26: Added a new bottom-of-file vision note for staged-choice prefill and left/right option cycling, so the console can expose the first valid choice directly in the input row, let `Enter` or `Space` advance faster, and visibly highlight/cycle the current choice set in the single-row summary area without replacing free typing
9. 2026-03-19 23:12: Expanded the new `Command Transcript Sublayers` vision note into an implementation-ready spec, locking the first-pass `Commands.User` versus `Commands.System` entry model, ownership boundaries, filtering behavior, and acceptance shape as one narrow transcript refinement task
8. 2026-03-19 23:08: Added a new bottom-of-file vision idea for splitting the `Commands` transcript layer into `Commands.User` and `Commands.System`, so future console scans can distinguish typed command input from returned prompts/results without inventing a separate logging product
7. 2026-03-19 23:03: Added an explicit toolbar-to-console alignment rule, locking the direction that toolbar sections and their parent/child boxes should map to the same underlying command scopes, groups, and actions used by the console rather than becoming a second separate interaction model
6. 2026-03-19 11:24: Locked the new `4.1H` hybrid command-capture phase so the console architecture now explicitly treats printable-key auto-capture as the follow-on direction after `4.1C`, keeps `/` as an optional focus affordance, makes `m / r / s` typed-first instead of silent immediate hotkeys in that phase, and tightens the routing/protected-field/transcript rules into a decision-complete implementation spec
5. 2026-03-19 11:05: Added a concrete hybrid-input plan for the console, locking the direction that users should not need `/` to begin typing commands and describing how printable-key auto-capture, immediate shortcuts, and one shared command dispatcher should fit together without stealing focus from real text fields
4. 2026-03-18 21:19: Expanded the console architecture with a larger long-term command-language vision, describing how the app-wide console could eventually support hierarchical navigation/action flows such as selecting graphs, entering node scope, finding or adding nodes, and later driving sketch-specific operations entirely from console input
3. 2026-03-17 10:35: Added a console layer color rule and a suggested first color palette so each internal layer is both filterable and visually distinct in the transcript
2. 2026-03-17 10:31: Renamed this architecture surface from `Command Line` to `Console` and rewrote it around one unified console with collapsed/expanded modes plus internal layers for commands, shortcuts, worker/app notes, params, and diagnostics
1. 2026-03-17 10:15: Created this architecture doc to define an app-wide `Command Line` / `Command Console` direction for ParaHook, including the bottom-row command surface, keyboard-routing ownership, and its relationship to the existing read-only debug inspector

### Purpose

This doc defines the architecture direction for the ParaHook `Console`.

Use it to answer:
- what the `Console` is supposed to be
- how the collapsed row and expanded panel relate
- how debug/event output fits inside it
- where it should live in the shell
- how internal layers should work
- who should own keyboard routing
- what the first honest implementation should and should not do

### Why This Doc Exists

ParaHook already has several local keyboard-driven surfaces, but it does not yet have one app-wide place that:
- shows what command or tool the user is currently in
- records short command/status/debug text
- accepts typed command input
- centralizes shortcut routing

The current result is useful but fragmented:
- the Spaghetti editor has a read-only `Debug Inspector`
- the viewer has its own keyboard path
- the reference transform toolbar has its own keyboard path
- Browser/context-menu surfaces own their own close/escape listeners

This doc exists to define one clean future seam before more shortcut behavior gets added ad hoc.

### Scope

This doc covers:
- the one-row collapsed `Console`
- the expanded resizable `Console`
- the relationship between command input, command history, debug/event messaging, and internal layers
- the ownership split between shell placement, command state, command routing, and feature execution
- the first honest implementation boundary

This doc does not cover:
- final visual styling details
- every future command ParaHook may ever support
- scripting or macro systems
- worker-side command execution
- replacing the existing read-only debug inspector in the first pass

## Doc Body

### Short Version

ParaHook should gain one app-wide `Console`.

That `Console` should have two modes:
- a collapsed one-row bottom bar
- an expanded resizable black console window/panel

Both modes should belong to the same system and share the same transcript, routing, and state.

It should not be just a debug widget and not just a command line.

It should be the app's command-and-feedback seam.

### Core Naming Decision

Use these terms:

- `Console`
  - the full system
- `Collapsed Console`
  - the one-row bottom version
- `Expanded Console`
  - the resizable taller version
- `Layers`
  - the filterable message groups inside the console
- `Debug Inspector`
  - the existing read-only structured inspection surface inside Spaghetti

Important rule:
- `Console` is the umbrella
- `Debug Inspector` stays inspection-first
- `Console` handles both input and feedback
- the collapsed row and expanded panel are two modes of the same thing, not two separate products

### Problem Statement

Right now the app has command-like behavior, but no command architecture.

Current symptoms:
- keyboard routing is spread across multiple local listeners
- shortcut ownership is context-sensitive but not centrally expressed
- the user does not have one obvious place to look for:
  - current command state
  - accepted shortcut text
  - worker/app notes
  - param-change notes
  - errors
  - follow-up prompts
- the existing debug drawer is useful, but it is:
  - Spaghetti-local
  - read-only
  - structured for inspection, not for command entry

Plain-English problem:
- ParaHook can react to commands
- but it cannot yet clearly speak command language back to the user

### Main UX Shape

#### 1. Collapsed `Console`

The first visible surface should be one thin row at the bottom of the app shell.

It should:
- always remain visible during normal app use
- show the current prompt or last accepted line
- show short status text like:
  - `Ready`
  - `Build complete`
  - `Select reference to move`
  - `Move: specify axis`
  - `width = 24`
  - `Worker: build started`
  - `Unknown command`
- allow direct keyboard entry when command capture is active

This is the CAD-like seam:
- a small persistent row
- not a floating modal
- not a detached terminal

#### 2. Expanded `Console`

The console should be expandable into a taller black panel/window with customizable height.

This expanded console should share the same transcript as the collapsed row, but show more of it at once.

It should support:
- recent command history
- accepted command/result lines
- worker/app/debug notes
- param-change notes
- warnings/errors
- layer toggles
- height resize by drag

Important rule:
- the expanded console is not a second product
- it is the same console with more visible depth

#### 3. Existing `Debug Inspector`

The current `Debug Inspector` should remain as a structured read-only inspection tool.

It should not be renamed into the console.

Reason:
- the inspector answers:
  - what did the pipeline state become?
- the console answers:
  - what is the user doing?
  - what command is active?
  - what input is expected next?
  - what just happened in the app?

Later relationship:
- the expanded console may surface compact debug events or links into the inspector
- the inspector should remain the deeper structured truth surface

### Placement Rule

The `Console` should be app-global, not Spaghetti-local.

Preferred placement:
- owned by `AppShell`
- visually attached to the bottom edge of the main shell / viewport region

Why:
- command routing already affects more than one local tool surface
- the user should not lose the console when the Spaghetti panel is closed, collapsed, or not focused
- reference editing, viewer actions, Browser actions, and later graph actions should all be able to publish command text to the same row

Important rule:
- do not hide the console inside `SpaghettiPanel`
- do not make it a left-dock-only widget

### Console Model

The console should treat interaction as a real state machine.

Minimum states:
- `idle`
  - no active command, row shows `Ready` or the latest result
- `capturing`
  - user is typing into the console input
- `runningCommand`
  - a named command was accepted and is now active
- `awaitingFollowUp`
  - the command needs the next piece of user input
- `completed`
  - command finished successfully and emits a completion line
- `error`
  - command failed validation or could not be resolved

Examples:
- `build`
  - `capturing -> runningCommand -> completed`
- `move`
  - `capturing -> runningCommand -> awaitingFollowUp`
- unknown text
  - `capturing -> error`

### Layers

The console should support internal `Layers`.

These are not separate windows.

They are filterable message streams inside the same console.

Suggested first layers:
- `Commands`
  - typed commands and command results
- `Shortcuts`
  - single-key command activations and follow-up key actions
- `Worker`
  - build/assemble/export progress notes
- `App`
  - app-level status notes and mode transitions
- `Params`
  - parameter value changes and authored value updates
- `Diagnostics`
  - warnings, errors, and notable validation messages

Important rule:
- layers are visibility filters over one transcript system
- they should not become six separate logging products

### Layer Color Rule

Each console layer should also have its own text color.

Reason:
- the expanded console will be easier to scan if the user can identify message type by color before reading the label
- the collapsed console row can still reuse the same color language for the currently visible line

Important rule:
- color should reinforce the layer label, not replace it
- the console should still render the layer name in text
- do not rely on color alone for meaning

Suggested first palette:
- `Commands`
  - bright white
- `Shortcuts`
  - cyan
- `Worker`
  - green
- `App`
  - blue
- `Params`
  - yellow or warm amber
- `Diagnostics`
  - red for errors, orange for warnings

Practical rule:
- keep the background black or near-black
- keep text bright enough to read clearly
- avoid overly saturated neon if it hurts long-session readability
- keep the color mapping stable once users start learning it

### Transcript Rule

The console should own one shared transcript/history stream.

Each line should be able to carry:
- timestamp or sequence
- layer
- short text
- optional source context
  - graph id
  - node id
  - reference id
  - command id

Example lines:
- `[Commands] > build`
  - rendered in command-text white
- `[Worker] Build started`
  - rendered in worker-text green
- `[Params] Baseplate.Width = 24`
  - rendered in params-text amber
- `[Shortcuts] Move -> X axis`
  - rendered in shortcut-text cyan
- `[Diagnostics] Unknown command: bluid`
  - rendered in diagnostics-text red/orange depending on severity

### Keyboard Routing Rule

The `Console` should become the central keyboard-routing seam for command-like behavior.

That does not mean every key event must literally originate from the command bar UI.

It means:
- one app-level command router decides whether a key means:
  - text entry
  - shortcut activation
  - command follow-up input
  - ignore because a real text field owns focus

Important focus rule:
- if the user is actively inside a normal text-editing field, that field keeps the keyboard
- the command router must not steal typing from:
  - `input`
  - `textarea`
  - `select`
  - content-editable surfaces

When no text-editing field owns focus, the command router should be able to:
- accept printable typing into the console
- accept single-key shortcuts
- show follow-up prompt text in the console

### Shortcut Strategy

The console should support two shortcut classes.

#### Immediate shortcuts

These execute immediately with no text capture.

Examples:
- `Esc`
  - cancel active command, close command capture, or dismiss the current temporary command mode
- `Enter`
  - accept the current typed command
- later possible app-wide shortcuts like:
  - `frame all`
  - `toggle expanded console`

#### Command shortcuts

These are short aliases for real named commands and should still flow through command-state feedback.

Examples:
- `m`
  - enters `Move`
- `r`
  - enters `Rotate`
- `s`
  - enters `Scale`
- `x / y / z`
  - act as follow-up inputs when a transform command is already awaiting axis choice

Important rule:
- even when a single key triggers a command, the console should still show what happened
- the point is not just activation
- the point is visible command state

### First Honest Scope

The first real implementation should be intentionally narrow.

It should include:
- one app-shell bottom collapsed console row
- one shared transcript/history buffer
- one console store
- one app-level command router with text-input guards
- one expanded resizable console shell
- first-pass layer filtering
- a very small first command set
- command/result text for shortcut-triggered actions

Suggested first command set:
- `help`
- `build`
- `save`
- `console`
  - focus or toggle expanded console
- `frame`
  - at least `frame all`, and maybe `frame selected` if the active target seam is already clear

Suggested first shortcut migration target:
- the reference-transform `m / r / s / x / y / z` flow

Why:
- it already behaves like a real command-follow-up system
- it is the clearest current proof that ParaHook wants command-state feedback, not only raw shortcuts

### First-Pass Non-Goals

Do not let the first implementation absorb:
- a real shell terminal
- arbitrary scripting
- a macro recorder
- full autocomplete
- fuzzy command search
- a complete migration of every existing shortcut in one pass
- replacement of the Spaghetti debug inspector tables

Plain-English rule:
- prove the command architecture first
- avoid turning v1 into an IDE console

### Ownership Split

#### Shell placement

Owned by:
- `src/app/AppShell.tsx`

Responsibilities:
- render the bottom row
- host the expanded resizable console shell
- keep the console visually app-global

#### Canonical console state

Should be owned by:
- a new app-level console store

Responsibilities:
- current command/session state
- current prompt
- current typed text
- transcript/history lines
- expanded/collapsed console state
- visible layers
- expanded height

#### Keyboard routing

Should be owned by:
- a new command router layer above local tools

Responsibilities:
- normalize key handling
- honor text-input guards
- dispatch commands or follow-up input
- provide one place to reason about shortcut precedence

#### Feature execution

Should stay owned by:
- the relevant feature modules

Examples:
- viewer framing remains viewer-owned
- reference transform remains reference-transform-owned
- Browser actions remain Browser-owned

Important rule:
- the console system should route commands
- it should not swallow the real feature ownership underneath

### Suggested Code Shape

Suggested new area:
- `src/app/console/`

Likely contents:
- `consoleTypes.ts`
- `consoleRegistry.ts`
- `consoleRouter.ts`
- `useConsoleStore.ts`
- `selectConsoleVm.ts`
- `ConsoleBar.tsx`
- `ConsolePanel.tsx`

Likely current integration seams:
- `src/app/AppShell.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/viewer/Viewer.ts`
- `src/app/spaghetti/ui/DebugInspectorDrawer.tsx`

### Migration Rule

Do not try to delete every local key listener immediately.

Safer migration direction:
1. add the console store, shell bar, and router
2. wire a very small first command set
3. add first-pass transcript layers
4. migrate the most command-like existing shortcut flow first
5. leave purely local close/escape behaviors in place until the central routing precedence is proven

This keeps the console work from turning into an uncontrolled input-system rewrite.

### Relationship To Current Architecture

This fits the current architecture cleanly:
- `AppShell` owns placement
- app/store state owns canonical console truth
- selectors can derive a display VM for the row/panel
- existing tool systems still execute the real behavior

This also matches the current pain point:
- command routing is currently spread across UI surfaces instead of having a canonical app seam

### Example User Flows

#### Flow A. Typed command

- user presses `/` or clicks the console
- row enters capture
- user types `build`
- row shows `build`
- user presses `Enter`
- command executes
- row transcript logs:
  - `[Commands] > build`
  - `[Worker] Build started`
  - `[Worker] Build complete`

#### Flow B. Shortcut-driven command

- user presses `m`
- command router resolves `Move`
- console shows:
  - `Move`
  - `Specify axis or drag gizmo`
- user presses `x`
- console shows:
  - `[Shortcuts] Move: X axis`

Important rule:
- shortcut-driven use should still produce readable transcript lines

### Hybrid Input Plan

The console should move toward a hybrid input model.

Plain-English goal:
- the user should not need `/` just to start typing a command
- if the user begins typing while no normal text field owns focus, that typing should flow into the console automatically
- true immediate shortcuts should still exist for the small set of keys that must act instantly

This keeps one command system while removing the awkward "enter console first" friction.

#### Hybrid Rule

Treat command entry as one shared intake system with three input paths:
- `auto-captured text`
  - printable keys begin console text capture automatically
- `explicit console focus`
  - click the console or use a later dedicated focus key if desired
- `immediate shortcuts`
  - a very small reserved set of keys still execute immediately

Important rule:
- these are three ways of entering the same command system
- they must not become three different command products

#### Auto-Capture Rule

When no editable control owns focus and no higher-priority modal/tool input blocks typing:
- the first printable key should:
  - focus/open the console input
  - seed the command buffer with that typed character
  - switch the console into `capturing`

Examples:
- user presses `b`
  - console opens with `b`
- user then types `uild`
  - buffer becomes `build`
- user presses `Enter`
  - console submits `build`

Important guard:
- never auto-capture typing away from:
  - `input`
  - `textarea`
  - `select`
  - content-editable surfaces

#### Immediate Shortcut Rule

Keep immediate shortcuts narrow and explicit.

Recommended first reserved keys:
- `Esc`
  - cancel active command/session or clear capture
- `Enter`
  - submit the current command buffer when capturing
- feature-owned urgent lifecycle keys that truly must remain immediate

Practical rule:
- printable letters should prefer console capture by default
- only keep letter-based immediate shortcuts when they are intentionally reserved and conflict-checked

This means the app should stop assuming all free single-letter keys belong to local shortcut systems forever.

#### One Dispatcher Rule

All command-like actions should pass through one shared dispatcher.

That dispatcher should accept:
- typed command submissions
- auto-captured text submissions
- shortcut-triggered command aliases

The difference should be recorded as metadata, not as separate execution logic.

Suggested invocation metadata:
- `source: 'typed' | 'autoCapture' | 'shortcut'`

Important rule:
- `line` typed in the console and a shortcut alias that resolves to `line` must hit the same underlying command/session action

#### Toolbar Alignment Rule

Toolbar surfaces should not become a second separate command product.

If a feature has a visible toolbar made of parent/child boxes, sections, rows, or grouped controls, that visible hierarchy should map onto the same underlying command hierarchy the console uses.

Recommended mapping:
- toolbar surface
  - command scope
- toolbar section/group
  - command group
- toolbar button/row/action
  - command or follow-up token

Examples:
- `Sketch Plane`
  - scope
- `Plane Selection`
  - group
- `XY / XZ / YZ`
  - commands or valid follow-up tokens inside that scope
- `Sketch Draw`
  - scope
- `Tool Selection`
  - group
- `Line / PLine`
  - commands
- `Camera`
  - scope
- `Projection`
  - group
- `Orthographic / Perspective`
  - commands

First explicit view-toolbar projection example:
- visible toolbar group:
  - `Camera > Projection > Orthographic / Perspective`
- matching console path:
  - `Camera > Projection > Orthographic`
  - `Camera > Projection > Perspective`
- local aliases allowed at that choice step:
  - `O`
  - `P`

Important rules:
- toolbar clicks and console typing should dispatch to the same underlying session verbs
- do not let toolbar widgets own bespoke behavior that the console cannot also reach
- do not let console commands own bespoke behavior that the toolbar cannot also reflect
- the toolbar is the visible structured control surface
- the console is the typed command-and-feedback surface
- both should sit on one shared command/session model

#### Suggested Routing Order

When a keydown arrives, the router should decide in this order:
1. if a real editable field owns focus:
   - do nothing
2. if a modal/session explicitly owns that key:
   - let that owner handle it
3. if the console is already capturing:
   - route printable keys into the console buffer
   - route `Enter` / `Esc` through console capture behavior
4. if the key is one of the globally reserved immediate shortcuts:
   - execute it immediately
5. if the key is printable:
   - auto-open/focus the console and seed the buffer
6. otherwise:
   - ignore or let the local surface handle it

This order keeps text capture honest without breaking real text fields or hard session-lifecycle keys.

#### Sketch Draw Implication

For the current `Sketch Draw` direction, this hybrid model should mean:
- canonical commands still exist:
  - `line`
  - `pline`
  - `status`
  - `help`
- the user can begin typing those commands directly without `/`
- `Enter` and `Esc` can remain immediate lifecycle/session keys when appropriate
- optional one-letter aliases like `l` or `p` should resolve through the same command dispatcher if added later

Important rule:
- do not turn `Sketch Draw` into a separate sketch-only console system
- plug its local command branch into the same console-routing model

#### Implementation Plan

1. Keep the current console bar and transcript store, but remove the assumption that `/` is the only honest way to begin capture.
2. Add a small app-level keyboard router that can detect printable-key auto-capture when no editable target owns focus.
3. Add a console-store action that starts capture with an initial seeded character instead of only focusing an empty buffer.
4. Move typed-command submission and shortcut-command submission behind one shared dispatcher/helper.
5. Shrink the reserved immediate-key list to the keys that truly must remain instant.
6. Update transcript entries so the command layer can distinguish `typed`, `autoCapture`, and `shortcut` invocation sources without splitting execution logic.
7. Migrate feature-local command-like flows, including early `Sketch Draw`, onto that shared dispatcher instead of adding more ad hoc local parsers.
8. Keep `/` as an optional explicit focus affordance only if it still adds value, not as a required gateway to command entry.

### Longer-Term Command Language Vision

Long term, the `Console` should be capable of driving much more than a few global commands or transform shortcuts.

It should eventually support a real command-navigation grammar that lets the user move through app/workspace domains and act on them entirely from console input.

This system should be named clearly.

Recommended naming:
- product/user-facing name:
  - the ParaHook `Console` command language
- architecture name:
  - a hierarchical command grammar
- implementation name:
  - a command router plus command state machine

Why this name fits:
- the user is not only issuing one flat command like `save`
- the console can accept staged follow-up input that moves deeper into a domain/action path
- short aliases can stand in for larger command words as long as the console makes the current state visible

AutoCAD-style mental model:
- the user can type a short mnemonic, press `Enter`, and then answer the next prompt with another short token
- each accepted token moves the session deeper into the active command path
- the console should always show what scope/action is now active and what input is expected next

Example shape:
- `s` `Enter`
  - `select`
- `g` `Enter`
  - while inside `select`, resolve to `graph`
- `1` `Enter`
  - while inside `select > graph`, resolve to graph `1`

This is not just a shortcut list.

It is a stateful, hierarchical command system with mnemonic aliases and visible follow-up prompts.

This means the console should be able to express workflows such as:
- selecting a workspace/domain
- entering graph scope
- selecting a specific graph
- entering node scope
- finding a node
- adding a node
- later drilling into node-specific subcommands such as sketch actions

Example future shape:
- `s`
  - select
- `g`
  - graph
- `1`
  - graph `1`
- `n`
  - nodes
- `f`
  - find
- `a`
  - add
- `sketch`
  - target the `Sketch` node type

Plain-English read:
- the console should eventually let the user navigate:
  - app
  - workspace
  - graph
  - node
  - node-specific sub-surfaces

This is bigger than a shortcut bar.

It is a future command language for ParaHook.

Important rule:
- this should still remain one command system
- not one separate mini-language per feature

That means:
- `Console.md` should own the command-language architecture
- workspace/feature docs should define their command domains and actions
- graph and node docs should plug into the console grammar rather than inventing separate command systems

Recommended long-term command-domain stack:
- app commands
- workspace commands
- graph commands
- node commands
- feature/node-specific commands

Examples:
- app
  - `save`
  - `build`
  - `console`
- graph
  - select graph
  - list graphs
  - add node
  - find node
- node
  - select node
  - open node
  - rename node
- sketch
  - enter source-pick
  - confirm source
  - cancel source
  - inspect sketch-plane status

#### Example Hierarchical Menus

The command language should eventually be describable as one shared command tree.

The cleanest way to think about menus is:
- each menu is one visible slice of that tree
- the console shows only the current slice plus the current path
- entering a token either:
  - executes an action
  - or moves deeper into the next menu/context

Recommended shared control tokens:
- `?`
  - show the current menu/help
- `b`
  - go back one level
- `x`
  - cancel the current command/session
- `Enter`
  - accept the current token

#### Level 1

The first visible menu from `Ready` should stay small, general, and easy to memorize.

Recommended `level 1` options:
- `s`
  - select
- `o`
  - open
- `a`
  - add
- `f`
  - find
- `build`
  - build current target
- `save`
  - save current project/workspace
- `?`
  - show root help/menu
- `x`
  - cancel/clear current command state

Why these belong at `level 1`:
- they are app-wide actions, not feature-specific actions
- they give the user a clean first fork into navigation, editing, creation, or app execution
- they avoid overloading the first menu with sketch-only or deep graph-only commands too early

Example first-load console read:
- `Ready`
- `Level 1: [s] Select  [o] Open  [a] Add  [f] Find  [build] Build  [save] Save  [?] Help  [x] Cancel`

Recommended first menu shape:

- root
  - `s`
    - select
  - `o`
    - open
  - `a`
    - add
  - `f`
    - find
  - `r`
    - rename
  - `build`
    - build current target
  - `save`
    - save current project/workspace
  - `console`
    - focus/toggle the console

- `select`
  - `g`
    - graph
  - `n`
    - node
  - `r`
    - reference
  - `v`
    - viewport

- `select > graph`
  - `1`
    - graph `1`
  - `2`
    - graph `2`
  - `3`
    - graph `3`
  - `l`
    - list graphs

- `graph`
  - `s`
    - select graph
  - `o`
    - open graph
  - `r`
    - rename graph
  - `n`
    - graph nodes
  - `build`
    - build graph

- `graph > nodes`
  - `s`
    - select node
  - `o`
    - open node
  - `a`
    - add node
  - `f`
    - find node

- `node`
  - `o`
    - open node
  - `r`
    - rename node
  - `d`
    - delete node
  - `sketch`
    - enter sketch-specific commands when relevant

- `sketch`
  - `p`
    - source pick
  - `c`
    - confirm
  - `x`
    - cancel
  - `status`
    - inspect sketch status

Example flows:
- `s` `Enter`
  - open `select`
- `g` `Enter`
  - inside `select`, open `select > graph`
- `1` `Enter`
  - select graph `1`
- `n` `Enter`
  - inside `graph`, open `graph > nodes`
- `a` `Enter`
  - inside `graph > nodes`, start `add node`

Console rendering should stay clean and hierarchical:
- show the current path such as `Select > Graph`
- show the current prompt such as `Choose graph`
- show the currently valid tokens for this level
- keep back/cancel/help commands visible and consistent across menus

Important rule:
- these are not separate feature-specific menus with separate syntax
- they are different visible states of one shared command language
- feature docs can define their branch of the tree, but the console owns the overall grammar and navigation rules

#### Future AutoCAD Command Carry-Over

Long term, the console should leave room for partial AutoCAD command carry-over.

This does not mean ParaHook should become an AutoCAD clone or inherit AutoCAD command behavior blindly.

The real goal is:
- reduce friction for users who already think in AutoCAD command language
- let familiar aliases and habits carry over where the ParaHook action is truly equivalent
- make mismatches explicit where ParaHook has no honest equivalent yet

Possible future compatibility layers:
- built-in support for a small set of common AutoCAD-style aliases that map cleanly onto real ParaHook commands
- optional user-defined alias mapping so one user can prefer `s` while another prefers a different token
- later import support for an AutoCAD command/alias file as a starting point for review, not as an automatic blind migration

Example starter carry-over set from real AutoCAD usage:

- sketch / drawing
  - `pl`
    - `polyline`
  - `l`
    - `line`
  - `rec`
    - `rectangle`
  - `cc`
    - `circle`
  - `tr`
    - `trim`
  - `f`
    - `fillet`

- geometry/edit
  - `c`
    - `copy`
  - `r`
    - `rotate`
  - `e`
    - `extend`
  - `t`
    - `trim`
  - `ch`
    - `chamfer`
  - `ll`
    - `xline`
  - `cc`
    - `circle`

- dimensions
  - `d`
    - `dimlinear`
  - `da`
    - `dimaligned`
  - `das`
    - `dimangular`

- layers
  - `lc`
    - `laymcur`
  - `ltl`
    - `laylck`
  - `ul`
    - `layulk`
  - `ff`
    - `layfrz`
  - `fdf`
    - `layiso`
  - `as`
    - `layuniso`
  - `aa`
    - `laythw`

Sketch should likely become the first serious home for many of the drawing-style carry-over commands.

Examples:
- `pl`, `l`, `rec`, `cc`, `tr`, and `f` are more likely to map honestly inside a future sketch/domain-specific command branch than as app-global commands
- the console grammar should still treat them as part of the same overall command language, even when their execution only makes sense while a sketch session or sketch node is active

These should be treated as candidate carry-over aliases, not assumed one-to-one mappings.

Some may eventually map cleanly onto ParaHook behavior.

Others may need:
- a renamed ParaHook command
- a narrower scoped action
- a multi-step menu path instead of one flat alias
- or an explicit `unsupported / no equivalent yet` result

Possible future import flow:
- user uploads an AutoCAD command/alias file
- ParaHook opens a separate review window/dialog
- the review surface shows:
  - aliases that map cleanly to an existing ParaHook command
  - aliases that are ambiguous and need user choice
  - aliases that cannot carry over because ParaHook has no matching command/domain yet
- the user can sort/filter that list and choose which aliases to keep, rename, or ignore
- accepted aliases become user-level console preferences, not hard-coded global product defaults

Important rules:
- imported aliases should plug into the same command registry and command router as native ParaHook commands
- aliases should never create a second execution path with different behavior
- the import/review experience is long-range work and should stay out of the first honest console implementation
- the core command language should stand on its own even if AutoCAD import never ships

Design consequence:
- the command registry should eventually separate canonical command identity from user-facing aliases
- the console should be able to explain both:
  - the canonical ParaHook command
  - the currently active alias that invoked it

Architectural consequence:
- the command router should eventually support hierarchical follow-up state, not just one-shot commands
- the command registry should support domain/context transitions
- object addressing needs to be stable enough that the console can talk about:
  - graph ids
  - node ids
  - reference ids
  - later sketch ids or sketch sub-surfaces

Important rule:
- this is not required for the first honest console implementation
- but the first implementation should avoid painting the console into a corner that only supports flat one-shot commands

Practical implication for early work:
- the first console should prove:
  - transcript
  - routing
  - follow-up state
  - small command vocabulary
- later phases can expand that into graph/node/sketch command navigation

Relationship to future sketch work:
- sketch-specific console actions should eventually live inside this larger grammar
- the sketch-plane viewport-pick commands in `Sketch.md` should be treated as one future node-domain slice of the app-wide console, not as a separate console product

#### Flow C. Param feedback

- user changes `Width`
- console logs:
  - `[Params] Width = 24`
- if the worker rebuild starts:
  - `[Worker] Build started`

### Open Questions

These are still real design questions, but they should be answered inside this architecture rather than before it exists.

- should the collapsed row span the full app width, or the main viewport width only?
- should the expanded console dock upward from the bottom bar, or collapse into a side/bottom drawer depending on shell mode?
- how much history should remain visible in the collapsed row?
- should layer visibility be global app prefs, or session-local state?

Current recommendation:
- keep the row app-global
- let printable typing auto-enter the console when no real text field owns focus
- keep `/` as an optional focus affordance, not a required gateway
- keep the immediate-key set narrow and explicit

### Current Planning Ladder

The older `Console-Index.md` remains the Console family architecture and phase-history surface.

New broad Console work should now use the newer architecture planning ladder when it needs preserved HLG and generation routing:

- [Console Vision](./Console-Vision.md)
  - broad Console direction and generation-level HLG
- [Console Generation 1 Index](./Console-Gen1-Index.md)
  - `Console Generation 1 - Workspace Control Surface Parity`
  - CLG and family-phase routing for Console Workspace Modes surface parity
- [Console-1](./Future/Console-1%20-%20Workspace%20Modes%20Catalog-Driven%20Surface%20Actions.md)
  - first catalog-driven workspace-mode action family phase
  - prepares one Worker-ready first implementation slice around shared action eligibility

This newer ladder should be used for broad user intent that would otherwise get flattened into one implementation phase too early.

### Console Generation 1 Routing

`Console Generation 1` currently owns the broad goal that Console Workspace Modes should become a proper control surface for all workspace modes.

Generation 1 preserves these user-level promises:
- users can control workspace surfaces from Console through the same action model exposed by shared slot UI
- Console reads canonical workspace surface catalog/support data instead of maintaining action allowlists
- primary and non-primary rules stay explicit and tested
- slotted, floating, detached, and popout host states stay one workspace model
- unsupported actions are hidden by shared eligibility or report clear diagnostics

The first routed family phase is:

- [Console-1 - Workspace Modes Catalog-Driven Surface Actions](./Future/Console-1%20-%20Workspace%20Modes%20Catalog-Driven%20Surface%20Actions.md)


### Phase Docs

`Console.md` is now the canonical current-truth architecture doc for Console.

Detailed implementation slices and historical shipped snapshots live in the standalone phase docs across this family folder:
- root-level active or partially complete records such as:
  - `Console_Phase <phase id> - <title>.md`
- folderized future or shipped records such as:
  - `Future/Console_Phase <phase id> - <title>.md`
  - `Shipped/Console_Phase <phase id> - <title>.md`

Rules for using them:
- use `Console.md` for the live architecture, phase ordering, and current decisions
- use root-level standalone phase docs for still-active or not-fully-shipped records
- use `Shipped/` standalone phase docs for historical implemented scope and acceptance shape
- if shipped behavior changes, add a new follow-on phase instead of rewriting old implemented phase docs

History note:
- `[4.1I5]` still exists only as an inline follow-on and does not have its own standalone phase file yet


# Phase Index

## [x] `Console 1` - `[4.1H]` `Hybrid Command Capture And Shortcut Unification`

Summary:
- unified typed-first console capture, optional `/` focus, and shortcut routing into one safer intake model

Goals:
- direct typing should reach the console when no real text field owns focus
- `/` should remain an optional explicit affordance
- typed aliases and shortcut-like entry should converge on the same command path

Docs:
- [4.1H](./Shipped/Console_Phase%204.1H%20-%20Hybrid%20Command%20Capture%20And%20Shortcut%20Unification.md)

Checklist:
- [x] auto-capture printable typing when appropriate
- [x] keep `/` optional instead of mandatory
- [x] protect real text fields from console capture
- [x] route typed command entry through visible shared dispatch

## [~] `Console 2` - `[4.1I]` `Hierarchical Path Grammar`

Summary:
- introduced the staged command tree for graph and sketch flows, with one remaining hardening follow-on still open

Goals:
- keep staged command navigation hierarchical instead of flat
- allow recoverable path progression, backtracking, and scoped prompts
- keep the first grammar narrow enough to stay legible

Docs:
- [4.1I](./Console_Phase%204.1I%20-%20Hierarchical%20Path%20Grammar.md)
- [4.1I1](./Shipped/Console_Phase%204.1I1%20-%20Staged%20Grammar%20Core.md)
- [4.1I2](./Shipped/Console_Phase%204.1I2%20-%20Console%20Session%20Integration.md)
- [4.1I3](./Shipped/Console_Phase%204.1I3%20-%20First%20Executable%20Vertical%20Slice.md)
- [4.1I4](./Shipped/Console_Phase%204.1I4%20-%20Missing-Branch%20Recovery%20And%20Node%20Creation.md)

Checklist:
- [x] `4.1I1` staged grammar core
- [x] `4.1I2` console session integration
- [x] `4.1I3` first executable vertical slice
- [x] `4.1I4` missing-branch recovery and node creation
- [ ] `4.1I5` robustness and prompt quality

## [x] `Console 3` - `[4.1J]` `Input Ownership And Coordination Cleanup`

Summary:
- made keyboard ownership explicit across console, viewer, and active sessions so command intake stops drifting

Goals:
- define one real input-priority model
- standardize ownership for `Esc`, `Enter`, and printable keys
- route session-aware decisions through one shared seam

Docs:
- [4.1J](./Shipped/Console_Phase%204.1J%20-%20Input%20Ownership%20And%20Coordination%20Cleanup.md)
- [4.1J1](./Shipped/Console_Phase%204.1J1%20-%20Input%20Ownership%20Audit.md)
- [4.1J2](./Shipped/Console_Phase%204.1J2%20-%20Shared%20Input%20Routing%20Seam.md)
- [4.1J3](./Shipped/Console_Phase%204.1J3%20-%20Session%20Migration.md)
- [4.1J4](./Shipped/Console_Phase%204.1J4%20-%20Cleanup%20And%20Hardening.md)

Checklist:
- [x] `4.1J1` audit current ownership and conflicts
- [x] `4.1J2` add shared routing seam
- [x] `4.1J3` migrate active sessions onto shared routing
- [x] `4.1J4` harden precedence and clean up leftovers

## [x] `Console 4` - `[4.1K]` `Surface-Driven Console Context Sync`

Summary:
- made console context follow the active graph, sketch, and surface state instead of drifting into panel-local mode

Goals:
- keep console scope aligned with the active surface
- narrow prompts when real context is already known
- avoid stale hidden context after surface changes

Docs:
- [4.1K](./Shipped/Console_Phase%204.1K%20-%20Surface-Driven%20Console%20Context%20Sync.md)

Checklist:
- [x] reflect active surface context into console state
- [x] scope prompts from real surface activity
- [x] clear stale context when sessions or surfaces exit

## [x] `Console 5` - `[4.1L]` `Command Transcript Sublayers`

Summary:
- split the console transcript into clearer layers so command flow, system notes, params, and diagnostics can coexist

Goals:
- keep the console command-first while still reflecting app state
- support both collapsed and expanded console views
- avoid turning the transcript into flat noisy debug output

Docs:
- [4.1L](./Shipped/Console_Phase%204.1L%20-%20Command%20Transcript%20Sublayers.md)

Checklist:
- [x] define transcript categories or sublayers
- [x] separate command flow from worker or app notes
- [x] keep collapsed mode readable

## [x] `Console 6` - `[4.1M]` `Staged Choice Prefill And Arrow Cycling`

Summary:
- added constrained-choice prefill and quick cycling so staged steps stop feeling blank and friction-heavy

Goals:
- show a usable default in finite staged-choice prompts
- keep choice cycling fast and local to assisted states
- preserve legibility of the current candidate before commit

Docs:
- [4.1M](./Shipped/Console_Phase%204.1M%20-%20Staged%20Choice%20Prefill%20And%20Arrow%20Cycling.md)

Checklist:
- [x] prefill the first valid constrained option
- [x] support `ArrowUp` and `ArrowDown` cycling
- [x] keep assisted-choice behavior scoped to constrained staged states

## [x] `Console 7` - `[4.1N]` `Feature Session Prompt Descriptors`

Summary:
- extended the shared prompt/choice seam so active feature sessions can publish their next-input expectations cleanly

Goals:
- make feature-session prompts more descriptive than bare path breadcrumbs
- expose what session is active and what input is expected next
- keep prompt descriptors shared instead of feature-local

Docs:
- [4.1N](./Shipped/Console_Phase%204.1N%20-%20Feature%20Session%20Prompt%20Descriptor%20Follow-On.md)

Checklist:
- [x] publish session-aware prompt descriptors
- [x] expose expected next input more clearly
- [x] keep prompt descriptors compatible with collapsed console use

## [x] `Console 8` - `[4.1P]` `Assisted Prefill Replace-On-Type Across Levels`

Summary:
- adds one shared overwrite rule so the first printable user key replaces assisted prefill instead of appending onto it

Goals:
- make manual typing override immediate at every constrained assisted level
- apply the same replace-on-type behavior across staged navigation and feature-session descriptors
- keep prefill and cycling intact until the user actually starts typing

Docs:
- [4.1P](./Shipped/Console_Phase%204.1P%20-%20Assisted%20Prefill%20Replace-On-Type%20Across%20Levels.md)

Checklist:
- [x] replace assisted prefill on the first printable typed key
- [x] apply the rule at every constrained assisted level
- [x] preserve normal manual typing after override begins
- [x] keep unconstrained flat command entry unchanged

## [~] `Console 9` - `[5.1F]` `Workspace Selection, Surface Activation, And Canonical Intents`

Summary:
- moved console-driven workspace and surface activation toward one canonical intent layer instead of per-surface command handling

Goals:
- let the console select the right workspace and target surface
- express user intent once and route it through canonical intent objects
- keep surface reflection flowing back into the console

Docs:
- [5.1F](./Shipped/Console_Phase%205.1F%20-%20Workspace%20Selection,%20Surface%20Activation,%20And%20Canonical%20Intents.md)
- [5.1F1](./Shipped/Console_Phase%205.1F1%20-%20Workspace-Selection%20Seam.md)
- [5.1F2](./Shipped/Console_Phase%205.1F2%20-%20Canonical%20Intent%20Layer.md)
- [5.1F3](./Shipped/Console_Phase%205.1F3%20-%20Surface%20Migration%20And%20Reflection.md)
- [5.1F4](./Shipped/Console_Phase%205.1F4%20-%20Hardening%20And%20Expansion.md)

Checklist:
- [x] workspace-selection seam
- [x] canonical intent layer
- [x] surface migration and reflection
- [x] hardening and expansion

## Moving Forward Summary

The current direction is:
- keep command behavior surface-agnostic
- keep placement and hosting separate from command ownership
- keep `Console`, `Browser`, `Model Viewport`, and `View Toolbar` as entry surfaces over shared command seams, not as separate command owners

Ownership moving forward should stay split like this:
- workspace/shell owns placement and hosting
  - `Windowed`
  - `Tiled`
  - active pane/surface
  - split/floating/pop-out behavior
- workspace intents own shared cross-surface outcomes
  - open/focus/select/activate outcomes that more than one surface can trigger
- graph/spaghetti owns graph and CAD authoring truth
  - sketch
  - node authoring
  - graph mutations
  - future CAD commands that change authored graph state
- viewer/view-state owns camera and view truth
  - projection
  - framing
  - orbit/pan/zoom family
  - visible view settings

Practical rule:
- define a new CAD command at its real owner first
- then expose it through whichever surfaces need it:
  - `Console`
  - `Browser`
  - `Model Viewport`
  - `View Toolbar`

This means:
- do not add a command as `console-only` first and then try to copy it outward later
- do not let toolbar buttons or viewport overlays become the only place a command truly exists
- do not let workspace placement mode change how a command is owned or executed

Existing docs already cover most of the setup around this:
- `[5.1F]` already established canonical workspace-selection and intent seams
- `Workspace Modes` and `05.1C` already cover shell placement and surface hosting
- `Browser-5` already covers Browser selection/focus sync
- `[5.0I-1]` already proves the toolbar-plus-console shared command seam for projection

What is still missing is the repeatable expansion rule for new CAD commands:
- every new graph/view/workspace command should plug into one owned seam first
- every surface should adapt into that same seam instead of inventing a local execution path

## [~] `Console 10` - `[5.1G]` `Surface-Agnostic Command Ownership And Adapter Expansion`

Summary:
- shipped the first owner-first command migration cut so `Console`, `Browser`, `Model Viewport`, and `View Toolbar` now share canonical workspace-selection outcome seams plus shared view-command owners instead of continuing to grow separate local glue

Goals:
- keep command behavior independent of placement and surface entry
- make new CAD commands land once in the real owner and then fan out cleanly to multiple surfaces
- reduce command drift between console grammar, browser actions, viewport controls, and toolbar controls

Docs:
- [5.1G](./Shipped/Console_Phase%205.1G%20-%20Surface-Agnostic%20Command%20Ownership%20And%20Adapter%20Expansion.md)

Checklist:
- [x] inventory the shared command families that need owner-first routing:
  - graph/CAD authoring
  - workspace selection/focus/open
  - camera/view commands
- [x] assign each command family to its canonical owner seam instead of a surface-local handler
- [x] migrate Browser, model viewport, and view-toolbar entry points onto those shared seams where they still call local behavior directly
- [x] add regression coverage proving the same command can be triggered from more than one surface without different behavior

## [ ] `Console 11` - `ConsoleDock Organization And Decomposition Plan`

Summary:
- adds a dedicated planning phase for shrinking `ConsoleDock.tsx` out of its current "UI host plus command runtime plus domain glue" shape into smaller, owned console modules without changing the shipped console behavior all at once

Goals:
- separate render/window-host responsibilities from command-execution responsibilities
- move parser, prompt-text, and domain command logic behind clearer console seams
- stage the refactor into subphases small enough to verify without losing console behavior

Docs:
- [Console 11](./Future/Console_Phase%20Console-11%20-%20ConsoleDock%20Organization%20And%20Decomposition%20Plan.md)

Checklist:
- [x] `Phase 1` inventory and freeze current `ConsoleDock` responsibilities
- [x] `Phase 2` extract pure parsing, prompt-text, and formatting helpers
- [x] `Phase 3` isolate windowing, floating, pop-out, and split-dock host behavior
- [x] `Phase 4` land the first reference/content runtime-family seam
- [x] `Phase 4.1` complete the first reference/content extraction by removing stale inline ownership and tightening direct coverage
- [x] `Phase 4.2` finish the remaining reference-transform root shortcut cleanup and direct helper coverage
- [ ] `Phase 5` reduce `ConsoleDock` to a thin composition shell with focused hooks/modules
- [x] `Phase 5.1` move `handleSubmitCommand(...)` and the remaining controller callback band into `src/app/console/useConsoleInteraction.ts`

Status:
- `useConsoleInteraction.ts` now owns both the first-cut keyboard or sync band and the `Phase 5.1` submit or cancel or tab-cycle controller remainder
- `ConsoleDock.tsx` is materially thinner and now reads primarily as subscriptions, helper seams, windowing consumption, refs, and JSX composition
- `Phase 5` remains open only for any final shell-thinning follow-on that still proves worthwhile after the `Phase 5.1` controller move

## [x] `Console 12` - `Root New Graph Command`

Summary:
- adds `New Graph` as a canonical root Console command that creates a graph document through existing Spaghetti ownership and opens or focuses it through shared workspace intents

Goals:
- keep root display and root command callability aligned
- route the command through staged navigation instead of the flat fallback parser
- reuse existing graph document creation and graph activation seams
- prove the command does not fork Browser or Spaghetti graph-create behavior

Docs:
- [Console 12](./Future/Console_Phase%20Console-12%20-%20Root%20New%20Graph%20Command.md)

Checklist:
- [x] `Phase 1` root choice and staged action contract
- [x] `Phase 2` graph creation runtime and activation

Status:
- complete; root Console now creates and activates a new graph through staged navigation and existing graph/workspace owners

## [x] `Console 13` - `Root Alias Shortcut Contract`

Summary:
- makes root Console aliases the shared keyboard shortcut contract so Shortcut First can use plain aliases and Console First can use shifted aliases without bypassing staged navigation

Goals:
- make highlighted root alias letters executable and trustworthy
- route single-letter and multi-letter aliases through the same staged command path as typed Console input
- preserve Console First text capture by requiring shifted alias keys in that mode
- resolve the `C` conflict between Camera and Console entry without losing reliable Console focus

Docs:
- [Console 13](./Future/Console_Phase%20Console-13%20-%20Root%20Alias%20Shortcut%20Contract.md)

Checklist:
- [x] `Phase 1` root alias read model and display contract
- [x] `Phase 2` Shortcut First plain alias routing
- [x] `Phase 3` Console First shifted alias routing
- [x] `Phase 4` conflict cleanup and regression proof

Status:
- complete; root alias highlights, typed root aliases, and global root alias shortcuts now share staged root alias truth, with `C` preserved for Console and `CA` assigned to Camera

## [ ] `Console-Gen1 / Console-1` - `Workspace Modes Catalog-Driven Surface Actions`

Summary:
- starts the newer vision/generation planning lane for making Console Workspace Modes control all workspace modes through canonical workspace surface catalog/support data and shared shell action eligibility

Goals:
- preserve Console Workspace Modes surface-parity HLG at the generation level before implementation
- keep Console as an adapter over shared workspace/shell owners
- replace hard-coded Console action allowlists with shared eligibility and owner-backed diagnostics
- keep primary/non-primary and slotted/floating/detached/popout behavior consistent with the shared workspace model

Docs:
- [Console Vision](./Console-Vision.md)
- [Console Gen1 Index](./Console-Gen1-Index.md)
- [Console-1](./Future/Console-1%20-%20Workspace%20Modes%20Catalog-Driven%20Surface%20Actions.md)

Checklist:
- [x] preserve the new Console Workspace Modes HLG in a vision/generation ladder
- [x] derive CLG and route them into `Console-1`
- [ ] `Console-1 / Phase 1` shared workspace action eligibility read model
- [ ] `Console-1 / Phase 2` catalog-driven Workspace Modes menus
- [ ] `Console-1 / Phase 3` owner-backed runtime action execution and diagnostics
- [ ] `Console-1 / Phase 4` unified surface identity across host states
- [ ] `Console-1 / Phase 5` catalog expansion proof and generation closeout

Status:
- `Console-1 / Phase 1` is the next Worker-ready implementation phase

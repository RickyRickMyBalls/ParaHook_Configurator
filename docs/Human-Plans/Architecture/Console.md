# Console

## Doc Header

### Doc History
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

### Short Version

The right mental model is:
- ParaHook needs one app-wide place that says what command is active, what input is expected next, and what just happened
- that place should be the `Console`
- it should have a collapsed 1-row mode and an expanded resizable mode
- it should support internal layers for commands, shortcuts, worker/app notes, params, and diagnostics
- it should centralize command routing without stealing real feature ownership
- it should coexist with the current read-only `Debug Inspector`, not replace it


# ParaHook Console Commands:

This section should reflect the real shipped command surface, not only the long-term aspirational tree.

# [x] `help`
# [x] `console`
# [x] `clear`
# [x] `history`
# [x] `frame` - alias: `f`
# [x] `zoom` - alias: `z`
# [x] `move` - alias: `m`
# [x] `rotate` - alias: `r`
# [x] `scale` - alias: `s`
# [x] `snap`
# [x] `echo`
# [x] `status`

# [x] `graph` - alias: `g`
## [x] > `Choose graph [1, 2, 3, ..., List]`
## [x] `1, 2, 3, ...`
### [x] > `Choose next [Sketch, Collapsed, Essentials, Expanded, References, Open, Build, Back]`
### [x] `sketch` - alias: `s
#### [x] > `Choose sketch [1, 2, 3, ..., Back]`
#### [x] `1, 2, 3, ...`
##### [x] > `Choose next [Sketch Plane, Sketch Draw, Back]`
##### [x] `sketch plane` - alias: `sp`
##### [x] `sketch draw` - alias: `sd`
##### [x] `back` - alias: `b`
#### [x] if no sketch exists:
##### [x] create a real `Geometry/Sketch` node
##### [x] auto-continue into `sketch_[1]`
### [x] `collapsed` - alias: `-`
### [x] `essentials` - alias: `e`
### [x] `expanded` - alias: `+`
### [x] `references` - alias: `r`
### [x] `open` - alias: `o`
### [x] `build`
### [x] `back` - alias: `b`
## [x] `list`

# [x] `line` - alias: `l` - sketch-local
## [x] active during `Sketch Draw`
## [x] prompt: `LINE Specify start point:`
# [x] `pline` - alias: `pl` - sketch-local
## [x] active during `Sketch Draw`
## [x] prompt: `PLINE Specify start point:`
# [x] `enter` - sketch-local
## [x] active during `Sketch Draw`
## [x] finish current draw command when allowed
# [x] `esc` - sketch-local
## [x] active during `Sketch Draw`
## [x] first `esc`: clear active draft
## [x] second `esc`: exit `Sketch Draw`
# [x] `x` - sketch-local
## [x] active during `Sketch Draw` and temporary cancel flows



## Input Ownership And Coordination

ParaHook now has enough overlapping command/session behavior that input ownership must be made explicit.

Without that, keyboard handling will keep drifting across:
- `ConsoleDock`
- `ViewportOverlay`
- `Viewer`
- `ReferenceTransformToolbar`
- local browser/editor UI affordances

This section defines who should own what and how key-routing should be resolved.

### Current Reality

Right now the app is partially coordinated, but still uneven:

- `AppShell` owns shell placement, docking, floating windows, and major surface composition.
- `ConsoleDock` owns command capture, transcript/history, staged navigation, and command dispatch.
- `useSpaghettiStore` owns much of the real editor/domain session state:
  - graph documents
  - editor viewports
  - sketch-plane pick
  - geometry sketch draw/review
- `useAppStore` owns app-wide state outside Spaghetti-specific editing.
- `ViewerHost` mostly acts as bridge/glue between store state and the viewer runtime.
- `ViewportOverlay`, `BrowserPanel`, `SpaghettiPanel`, and toolbars mostly render and mutate state, but some still own direct keyboard listeners.

The main weak point is:
- key ownership is still spread across several surfaces without one explicit priority model

That is why questions like these keep appearing:
- why did `Esc` go there?
- why did the console capture this key?
- why did viewer/tool/session keep the key instead of the staged console?

### Ownership Split

The intended long-term split should be:

#### 1. `AppShell` Owns Shell And Placement

`AppShell` should own:
- shell composition
- surface placement
- docked vs floating vs split layout
- which major surfaces are visible

`AppShell` should not own:
- graph command logic
- sketch command logic
- browser command logic
- command parsing

#### 2. `ConsoleDock` Owns Command Intake

`ConsoleDock` should own:
- command capture
- transcript/history
- typed-command parsing
- staged navigation state
- command-to-intent dispatch

`ConsoleDock` should not own:
- graph mutation rules
- sketch-draw logic
- sketch-plane logic
- viewer behavior

It should dispatch into existing domain/store seams rather than reimplement them.

#### 3. Domain Stores Own Real State Machines

`useSpaghettiStore` should own:
- graph documents
- graph/editor selection
- viewport presentation state
- sketch-plane pick session
- geometry sketch draw/review session
- node creation / graph mutation

`useAppStore` should own:
- app-wide build coordination
- reference workspace state
- broader non-Spaghetti app/session state

Important rule:
- real interaction state machines should live in domain stores
- not inside panels, overlays, or the console transcript layer

#### 4. Surfaces Should Stay Thin

Panels, overlays, and toolbars should mainly:
- read selectors
- render current state
- dispatch actions/intents

They should not coordinate each other directly.

That means:
- `ConsoleDock` should not reach into toolbar-local logic
- toolbars should not reach into console-local logic
- browser UI should not encode sketch-session rules

Coordination should happen through shared state and intents.

### Input Priority Model

ParaHook should use one explicit input priority order.

Suggested priority:

1. focused real text-editing surface
- `input`
- `textarea`
- `select`
- contenteditable

2. active modal or tool-specific session that explicitly owns the key
- sketch-plane pick
- active reference transform
- other future modal tool sessions

3. active feature session
- geometry sketch draw/review
- other future in-progress editing sessions

4. active staged console navigation
- scoped staged tokens
- `back`
- staged `Esc` cancel

5. global console capture
- printable-key auto-capture
- flat command entry

6. passive global shortcuts
- only when no higher-priority owner claims the key

Important rule:
- lower-priority systems should not “guess” if a higher-priority session owns the key
- key ownership should be decided before feature logic runs

### Key Semantics

The most important cross-system keys should be standardized:

#### `Esc`

Target meaning:
- cancel or exit the highest-priority active session

Examples:
- text field:
  - stays with the field if the field owns it
- sketch-plane pick:
  - cancel sketch-plane pick
- sketch draw:
  - first `Esc` clears draft
  - second `Esc` exits draw
- staged console session:
  - cancel the staged session
- idle console:
  - no special effect unless a future global rule is added

#### `Enter`

Target meaning:
- confirm/submit for the highest-priority active session

Examples:
- text field:
  - submit/edit behavior for that field
- sketch-plane pick:
  - confirm plane when in the correct stage
- sketch draw:
  - finish draft when applicable
- staged console:
  - submit current staged token
- flat console:
  - submit command input

#### `Space`

Target meaning:
- never global command submit
- only session-scoped when explicitly allowed

Current best use:
- staged token progression where the input model is single-token and controlled

Avoid:
- making `Space` a universal submit key across the whole console

#### Single-Letter Command Keys

Single-letter keys like:
- `m`
- `r`
- `s`
- `b`
- `x`

must be interpreted relative to the active owner.

Examples:
- in staged graph scope:
  - `b` may mean `Back`
- `build` remains available as the full graph action token
- in flat console:
  - `m` may mean `move`
- in sketch draw:
  - typed `l` may mean `line`

Important rule:
- these keys should not be globally hard-coded to one meaning
- scope/session decides meaning

### Coordination Rule

The coordination pattern should be:

- one layer decides who owns the key
- the owning feature/session decides what the key means

In other words:
- input ownership routing is centralized
- behavior execution remains domain-local

That keeps the architecture from collapsing into:
- a god `ConsoleDock`
- a god `AppShell`
- or dozens of unrelated `window.addEventListener('keydown', ...)` handlers

### Next Fixes

The next architecture-cleanup steps should be:

1. document the current real key owners for:
- `Esc`
- `Enter`
- `Space`
- `m / r / s`
- `x`
- `b / back`

2. decide and lock the target key-owner priority order

3. move toward one shared input-routing seam that:
- decides ownership first
- forwards to the correct session/feature

4. keep feature semantics in domain stores/components
- routing decides who gets the key
- the feature/store decides what that key does

### Immediate Recommendation

Before adding many more command families or toolbar-local shortcuts:
- keep building features
- but tighten the input ownership seam first

The highest-signal next target is:
- standardizing and centralizing `Esc`

Because `Esc` is currently the clearest cross-system coordination pressure point.


# Phases

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

## [ ] 4.1i
### Hierarchical Path Grammar

#### Summary

`4.1I` should extend the console beyond flat command submission and let the user move through scoped app actions one token at a time.

Important clarification:

- the user should not type literal `>` characters
- the earlier `G>1>S>1>SD` notation is only shorthand for staged `Enter` submissions

So the real interaction should be:

1. type `G`, press `Enter`
2. type `1`, press `Enter`
3. type `S`, press `Enter`
4. type `1`, press `Enter`
5. type `SD`, press `Enter`

and the console should progressively resolve that sequence as:

- `Graph`
- `Graph > graph_[1]`
- `Graph > graph_[1] > Sketch`
- `Graph > graph_[1] > Sketch > sketch_[1]`
- `Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`

This should be treated as one deeper form of the same console command language, not as a second command system.

#### Why This Phase Exists

The console doc already points toward a future command-navigation grammar.

What is still missing is a dedicated phase that locks:
- the staged token-submission model
- alias resolution rules
- scope-sensitive navigation
- breadcrumb behavior
- next-choice prompting
- transcript behavior
- how staged navigation relates to flat commands like `move`, `line`, or `status`

This phase should provide that bridge.

#### Core Rule

The console should support two submission shapes inside one dispatcher:

1. flat command submission
- examples:
  - `move`
  - `m`
  - `line`
  - `status`

2. staged scoped navigation
- examples:
  - `G` then `Enter`
  - `1` then `Enter`
  - `S` then `Enter`
  - `1` then `Enter`
  - `SD` then `Enter`

Important rule:
- staged navigation and flat commands must still resolve through the same overall command-routing seam
- do not build a separate navigation-console product beside the existing command dispatcher

#### Staged Navigation Model

The console should maintain an active navigation session.

Each submitted token is resolved relative to the current scope, and each accepted token moves the session deeper.

Example:

- `G`
  - means `Graph` only at the root level
- `S`
  - may mean `Sketch` when the current scope is `Graph > [n]`
  - should not be treated as a global always-on alias independent of scope
- `SD`
  - may mean `Sketch Draw` when the current scope is `Graph > [n] > Sketch > [n]`

Important rule:
- alias meaning must be scope-aware
- tokens should not be resolved globally when that would create ambiguity
- the same short token may mean different things in different scopes

#### First Example Tree

The first honest grammar can begin with a narrow tree like:

- root
  - `G` / `GRAPH`
- `GRAPH`
  - `1`
  - `2`
  - `3`
  - `LIST`
- `GRAPH > [n]`
  - `S` / `SKETCH`
  - `R` / `REFERENCES`
  - `O` / `OPEN`
  - `B` / `BUILD`
- `GRAPH > [n] > SKETCH`
  - `1`
  - `2`
  - `3`
  - `LIST`
- `GRAPH > [n] > SKETCH > [n]`
  - `SD` / `SKETCHDRAW`
  - `SP` / `SKETCHPLANE`
  - `PR` / `PROFILES`
  - `IN` / `INSPECT`

This example tree is intentionally small.

The phase should lock the mechanism first, not an exhaustive app-wide command tree.

#### Submission Rule

Each `Enter` should submit the current buffer as one token against the active scope.

Suggested first resolution order:

1. read the current console buffer
2. trim whitespace
3. normalize the token to a comparison form such as uppercase
4. resolve the token against aliases valid only in the current scope
5. if the token points to another scope, advance the breadcrumb and show the next valid choices
6. if the token points to an action node, dispatch that action
7. if the token is invalid for the current scope, keep the session in place and show a scoped error

Important rule:
- staged navigation should be deterministic
- do not use fuzzy matching in this phase

#### Breadcrumb Rule

The console should visibly track the active staged path.

Example progression:

- `Select`
- `Select > Graph`
- `Select > Graph > graph_[1]`
- `Select > Graph > graph_[1] > Sketch`
- `Select > Graph > graph_[1] > Sketch > sketch_[1]`

Important rule:
- the breadcrumb is session state, not just transcript text
- the console should know what scope it is currently inside before the next token is entered

#### Prompt Rule

After each accepted non-terminal token, the console should show the next valid choices for the new scope.

Example:

- user submits `G`
- console shows:
  - `Select > Graph`
  - `Choose graph [1, 2, 3, List]`

- user submits `1`
- console shows:
  - `Select > Graph > graph_[1]`
  - `Choose next action [Sketch, References, Open, Build]`

Important rule:
- the console should guide the next step after each token
- do not force the user to remember the full tree blindly

#### Transcript Rule

The transcript should preserve both:

- the actual token the user entered
- the current resolved breadcrumb
- the next prompt or executed action result

Example:

- `[Commands] > G`
- `[Commands] Select > Graph`
- `[Commands] Choose graph [1, 2, 3, List]`
- `[Commands] > 1`
- `[Commands] Select > Graph > graph_[1]`
- `[Commands] Choose next action [Sketch, References, Open, Build]`

Reason:
- the user should see what token they typed
- the user should also see how the system interpreted that token in the active scope

#### Error Rule

Invalid staged tokens should fail with scoped feedback.

Example:

- current scope is `Select > Graph > graph_[1] > Sketch > sketch_[1]`
- user submits `B`

Good error shape:
- echo the submitted token
- identify the bad token
- show the current scope
- list the valid next choices for that scope

Important rule:
- avoid vague `Unknown command` errors when the console already knows the active path scope

#### Relationship To Flat Aliases

This phase must not break the existing flat typed-first aliases introduced earlier.

Examples:
- `s`
  - may still resolve as the flat `scale` alias in normal flat-command mode
- `G`
  - may resolve as `Graph` when the console is in a staged navigation session
- `SD`
  - may resolve as `Sketch Draw` only when the current scope allows it

Locked direction:
- do not use literal `>` detection
- staged navigation should begin only when the console is inside a navigation session
- outside that session, keep the existing flat-command path
- inside that session, resolve submitted tokens relative to the active staged scope

This prevents staged aliases from colliding with older flat one-token aliases.

#### Sketch Implication

For sketch specifically, this phase should let the console move toward:

- `G` + `Enter`
- `1` + `Enter`
- `S` + `Enter`
- `1` + `Enter`
- `SD` + `Enter`

instead of forcing sketch to stay a pile of top-level ad hoc commands forever.

This fits the larger architecture direction already described elsewhere in this doc:
- sketch should plug into the app-wide console grammar
- sketch should not become a separate console product

# Subphases

## [x] `4.1I1` Staged Grammar Core

#### Questions / Decisions

##### [x] `q1` Decide what the first staged level-1 root should be.

##### Suggestion
- locked direction:
- the first level-1 staged root should be `Graph`
- the user should be able to enter it as:
  - `graph` + `Enter`
  - `g` + `Enter`
- do not try to ship multiple root domains in `4.1I1`

##### [x] `q2` Decide whether staged navigation begins implicitly or through an explicit root command.

##### Suggestion
- locked direction:
- staged navigation begins through an explicit root token
- first root token:
  - `Graph`
  - alias `G`
- outside a staged session, ordinary flat commands should keep their current behavior

##### [x] `q3` Decide what `4.1I1` should return from the grammar seam.

##### Suggestion
- locked direction:
- the pure resolver should return one of:
  - `advance`
  - `execute`
  - `invalid`
  - `cancelled`
- `advance` means:
  - token accepted
  - breadcrumb advanced
  - next scope/prompt available
- `execute` means:
  - token resolved to an action node
  - execution metadata is ready for the caller
- `invalid` means:
  - token rejected for current scope
  - current scope remains unchanged
- `cancelled` means:
  - staged session closed or reset

##### [x] `q4` Decide how numeric tokens should resolve.

##### Suggestion
- locked direction:
- numeric tokens such as `1`, `2`, `3` should resolve against deterministic visible order
- the grammar seam should not guess hidden ids
- the session result should carry the resolved underlying ids after numeric selection succeeds

##### [x] `q5` Decide what state the grammar core owns versus what later console wiring owns.

##### Suggestion
- locked direction:
- `4.1I1` owns:
  - grammar node model
  - alias resolution
  - staged session state
  - breadcrumb labels
  - valid-next-choice metadata
  - deterministic token resolution
- `4.1I1` does not own:
  - transcript rendering
  - console layout
  - final action dispatch side effects

##### [x] `q6` Decide how staged sessions reset.

##### Suggestion
- locked direction:
- the grammar core must support explicit reset/cancel
- successful execution may end the session by default for the first implementation
- invalid tokens must not silently reset the session
- later console wiring can map `Esc` and other lifecycle inputs onto this reset seam

### Implementation Spec

#### Summary

`4.1I1` should create the pure staged grammar engine that later console work can call.

This is not the UI phase.
This is the data model and resolver phase.

The first implementation target is narrow:
- one staged root:
  - `Graph`
- one root alias:
  - `G`

That means `4.1I1` should be able to represent and resolve the first steps of:
- `Graph`
- `Graph > graph_[n]`
- later descendants under that branch

without yet owning transcript formatting or visual console behavior.

#### Locked Outcome

`4.1I1` should deliver:
- a dedicated staged-grammar module
- a grammar node model
- a staged session model
- scoped alias resolution
- deterministic numeric-choice resolution
- structured results for `advance / execute / invalid / cancelled`

Important rule:
- do not hardcode this inside `ConsoleDock`

#### First Grammar Contract

The staged grammar seam should expose a pure API shape along these lines:

- begin a staged session from a valid root token
- submit one token against the current session scope
- inspect current breadcrumb
- inspect current valid next choices
- reset the session

The exact type names do not matter yet.
The contract shape does.

#### First Root Scope

The first staged root should be:

- canonical label:
  - `Graph`
- accepted tokens:
  - `GRAPH`
  - `G`

Submitting `Graph` or `G` from flat mode should create a staged navigation session whose first breadcrumb becomes:

- `Select > Graph`

and whose valid next choices are graph-number selections.

#### Graph Choice Rule

After entering the `Graph` root, the next valid tokens should be graph selections such as:

- `1`
- `2`
- `3`
- `LIST`

For `4.1I1`, the grammar engine should not render those choices.
It only needs to expose them as structured metadata.

#### Numeric Resolution Rule

Numeric choices must resolve against deterministic visible order.

That means:
- `1` means the first visible graph choice in the current staged scope
- `2` means the second visible graph choice

Important rule:
- do not encode numeric tokens as direct graph ids
- resolve them through the scope's current ordered option list

#### Session State Model

The staged session should minimally track:

- whether a staged session is active
- current breadcrumb
- current grammar scope
- resolved backing targets so far
  - for example selected graph document id
- valid next choices for the current scope

Important rule:
- breadcrumb labels and backing ids are not the same thing
- keep both

#### Result Model

Submitting a token should return structured results.

Minimum result meanings:

- `advance`
  - token accepted
  - scope changed
  - breadcrumb changed
  - valid-next-choice metadata available

- `execute`
  - token accepted
  - action node reached
  - caller receives execution metadata

- `invalid`
  - token rejected for current scope
  - caller receives current scope and valid choices

- `cancelled`
  - session reset/closed

Important rule:
- avoid returning only plain strings
- later console UX needs structured state, not ad hoc text parsing

#### First Tree Owned By `4.1I1`

`4.1I1` does not need the full app tree.

It should own enough grammar structure to prove:

- root
  - `GRAPH`
- `GRAPH`
  - graph choices by visible index
- `GRAPH > graph_[n]`
  - next-choice aliases such as:
    - `SKETCH`
    - `REFERENCES`
    - `OPEN`
    - `BUILD`

It is acceptable if some of those deeper nodes are only represented as grammar placeholders in `4.1I1`.

Reason:
- `4.1I1` is about the resolver contract
- real execution comes later

#### Code Ownership Rule

Primary seam:

- a new dedicated grammar/resolver module under the console area

Candidate responsibilities:
- grammar definitions
- alias normalization
- session transitions
- deterministic option ordering
- result objects

Not owned here:
- React component concerns
- transcript rendering
- DOM keyboard handling

#### Locked Deferrals

Keep these out of `4.1I1`:

- transcript rendering details
- breadcrumb UI
- command prompt copy polish
- actual `Sketch Draw` execution
- multi-root staged navigation
- fuzzy matching
- autocomplete

###### Acceptance Shape

`4.1I1` should read as complete when:

- there is a dedicated staged grammar seam outside the UI component
- `graph` and `g` can both begin the same staged session at the grammar level
- the grammar seam can resolve numeric graph choices deterministically from visible ordered options
- the grammar seam returns structured `advance / execute / invalid / cancelled` results
- invalid tokens do not destroy session state
- later console wiring has enough structured data to render:
  - current breadcrumb
  - valid next choices
  - scoped errors

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

## [x] `4.1I3` First Executable Vertical Slice

#### Questions / Decisions

##### [x] `q1` Decide what the first real executable staged path should be.

##### Suggestion
- locked direction:
- the first real executable staged path should be:
  - `Graph > graph_[n] > Sketch > sketch_[n] > Sketch Draw`
- do not split the first executable slice across multiple unrelated branches

##### [x] `q2` Decide whether `4.1I3` should invent a new sketch-draw execution path.

##### Suggestion
- locked direction:
- no
- `4.1I3` should call the same underlying `Sketch Draw` action that the current UI already uses
- staged navigation should only become a new entry seam, not a second implementation

##### [x] `q3` Decide how far the grammar should expand in this phase.

##### Suggestion
- locked direction:
- expand only as far as needed to execute the first real slice
- required path:
  - `Graph`
  - graph selection
  - `Sketch`
  - sketch selection
  - `Sketch Draw`
- leave sibling branches like `SketchPlane`, `Profiles`, `Inspect`, `Open`, and `Build` for later phases unless already needed for the path contract

##### [x] `q4` Decide how sketch selection should resolve.

##### Suggestion
- locked direction:
- sketch selection should resolve from deterministic visible order within the selected graph scope
- numeric sketch tokens such as `1`, `2`, `3` should behave the same way graph-number selections already behave
- do not require the user to know internal node ids

##### [x] `q5` Decide what should happen to the staged session after `Sketch Draw` executes.

##### Suggestion
- locked direction:
- the staged session should end after the action executes successfully
- the console should return to ordinary flat-command mode
- the transcript should show both:
  - the resolved path
  - the executed action/result note

##### [x] `q6` Decide what the console should show at the final execution step.

##### Suggestion
- locked direction:
- after the final staged token is accepted, the console should show:
  - the submitted token
  - the resolved breadcrumb
  - an action-result line such as:
  - `Sketch Draw > [Line, PLine, X]`
- do not immediately hide execution behind silent state changes

##### [x] `q7` Decide how single-choice auto-advance should behave inside the first executable slice.

##### Suggestion
- locked direction:
- keep the single-choice auto-advance rule active for real entity-selection scopes in `4.1I3`
- that means:
  - if there is only one graph, `g` may auto-advance to `graph_[1]`
  - if there is only one sketch in that graph, `s` may auto-advance to `sketch_[1]`
- the transcript must still show the auto-selection explicitly
- do not auto-execute `Sketch Draw` itself; the user must still submit `sd`

### Implementation Spec

#### Summary

`4.1I3` should take the staged grammar and live console session from `4.1I1` and `4.1I2` and drive one real app action end to end.

That first vertical slice should be:

- `graph` / `g`
- graph number
- `sketch` / `s`
- sketch number
- `sketch draw` / `sd`

This is the first point where staged navigation should stop being only a guided transcript system and start performing a real user action.

Important practical consequence:
- if the workspace has only one graph and that graph has only one sketch, the user may be able to reach the target scope as:
  - `g` + `Enter`
  - `s` + `Enter`
  - `sd` + `Enter`

That is acceptable and desirable, as long as the console shows the auto-advance steps honestly.

#### Locked Outcome

`4.1I3` should deliver:
- real staged navigation into a selected graph
- real staged navigation into a selected sketch
- a staged `Sketch Draw` action node
- execution of the existing sketch-draw session start behavior
- transcript confirmation that the action actually started

Important rule:
- the action must reuse existing app/store behavior
- do not create a second sketch session model just for the console path

#### First Executable Path

The first full staged path should read like:

- `Select > Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`

Token-by-token interaction:

1. `g` + `Enter`
2. `1` + `Enter`
3. `s` + `Enter`
4. `1` + `Enter`
5. `sd` + `Enter`

The final token should execute the real sketch-draw action for the selected sketch.

#### Grammar Expansion Required For `4.1I3`

To support the first executable slice, the staged grammar should gain:

- a real `Graph > graph_[n] > Sketch` scope
- deterministic sketch choices under that scope
- a `Sketch Draw` action node

Suggested staged aliases:

- `Sketch`
  - `S`
- `Sketch Draw`
  - `SD`

Important rule:
- alias meaning remains scope-sensitive
- `s` in flat-command mode may still mean `scale`
- `s` inside the active staged graph scope may mean `Sketch`

#### Sketch Resolution Rule

Sketch choices should be generated from the currently selected graph.

Those choices should:
- use deterministic visible ordering
- carry the backing node id with the session state after selection
- expose user-facing labels such as:
  - `sketch_[1]`
  - `sketch_[2]`

Important rule:
- visible labels and backing node ids should both be tracked
- the grammar should not collapse those into one value

#### Execution Rule

When the user reaches `Sketch Draw`:

- the staged grammar/result should identify an executable action node
- the console layer should dispatch the existing sketch-draw entry action

That dispatch should reuse the existing app behavior for opening/starting sketch draw on the targeted sketch node.

Current concrete seam:

- `startGeometrySketchSession(nodeId, 'draw')`

Important rule:
- staged execution must call into the same store/UI seam already used by the normal app workflow
- do not add a console-only sketch-session start function

#### Transcript Rule

At the final execution step, the transcript should show:

1. submitted token
- `[Commands] > sd`

2. resolved breadcrumb
- `[Commands] Select > Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`

3. action result
- `[App] Sketch Draw > [Line, PLine, X]`

This should make the staged path feel real and inspectable rather than invisible.

#### Session Completion Rule

After successful `Sketch Draw` execution:

- the staged session should end
- staged-session state should clear
- the console should return to ordinary flat-command behavior

Reason:
- the user is now inside the live sketch-draw workflow
- staged navigation has completed its job

#### First Integration Seams

Primary seams:

- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- graph and sketch lookup helpers already present in app state

Likely responsibilities:

- `stagedNavigation.ts`
  - expose the deeper graph/sketch/action nodes
- `ConsoleDock.tsx`
  - route the final staged execution result into the existing action
- `useSpaghettiStore.ts`
  - continue to own the real sketch-draw session entry via:
    - `startGeometrySketchSession(nodeId, 'draw')`

#### First Implementation Steps

`4.1I3` should likely be implemented in this order:

1. expand the staged grammar from `Graph > graph_[n]` into a real `Sketch` scope
2. resolve visible ordered sketch choices from the selected graph
3. store the selected sketch node id in staged session state
4. add a `Sketch Draw` action node under the selected sketch scope
5. route that action result from `ConsoleDock` into:
   - `startGeometrySketchSession(nodeId, 'draw')`
6. emit the final transcript/result lines
7. clear the staged session after successful execution

Important rule:
- do not mix branch expansion and execution wiring randomly
- prove the real slice in this exact order

#### Locked Deferrals

Keep these out of `4.1I3`:

- `SketchPlane`
- `Profiles`
- `Inspect`
- multi-action sketch authoring from the staged tree
- broader graph-management actions
- multiple root domains

#### Acceptance Shape

`4.1I3` should read as complete when:

- the staged grammar can navigate from `Graph` into a real sketch selection scope
- the user can select a sketch by visible number
- if there is exactly one graph and one sketch, the staged flow can honestly auto-advance through those scopes while still showing the auto-selection steps
- the user can submit `sd` at the sketch scope to start real `Sketch Draw`
- the action reuses the existing sketch-draw entry seam rather than a separate implementation
- the transcript shows token, breadcrumb, and action-result feedback
- the staged session clears after successful execution

## [x] `4.1I4` Missing-Branch Recovery And Node Creation

#### Questions / Decisions

##### [x] `q1` Decide what should happen when the user enters `Graph > Sketch` and the selected graph has no sketch nodes.

##### Suggestion
- locked direction:
- if the selected graph has zero sketch nodes, the staged flow should create one real `Geometry/Sketch` node instead of leaving the user in a dead-end empty scope
- this should happen inside the same staged `Graph > Sketch` branch
- do not require a separate rescue command for the first implementation

##### [x] `q2` Decide whether the new sketch should be a real graph node or a staged-session placeholder.

##### Suggestion
- locked direction:
- the new sketch must be a real `Geometry/Sketch` node committed into the graph
- use the normal graph mutation seam
- do not invent a temporary staged-only sketch object

##### [x] `q3` Decide which graph should receive the new sketch.

##### Suggestion
- locked direction:
- the new sketch should be created in the graph currently selected by the staged session
- that means:
  - `G > 1 > S` creates the sketch in `graph_[1]`
- do not redirect creation to some global fallback graph once the user has already selected a graph scope

##### [x] `q4` Decide how the new sketch should be placed in the canvas.

##### Suggestion
- locked direction:
- `4.1I4` should use one deterministic default placement rule
- shipped first-pass rule:
  - if the graph has no positioned nodes yet:
    - place the sketch at roughly `{ x: 160, y: 140 }`
  - otherwise:
    - place it to the right of the current rightmost node at the current top row
- the important thing is that the node appears in the real graph canvas and can be selected/focused reliably
- do not block `4.1I4` on a full node-placement strategy

##### [x] `q5` Decide what should happen immediately after the new sketch node is created.

##### Suggestion
- locked direction:
- after creation, the staged flow should rebuild its context, auto-select the new sketch, and continue into the normal sketch scope
- the node should also be selected and fitted in the active editor viewport
- the user should then see the same sketch-level prompt as an existing sketch:
  - `Sketch Plane`
  - `Sketch Draw`
- do not leave the user at an empty `Sketch` list after creation

##### [x] `q6` Decide whether `4.1I4` should auto-start `Sketch Plane` immediately after sketch creation.

##### Suggestion
- locked direction:
- no automatic `Sketch Plane` execution in `4.1I4`
- stop at the normal sketch scope after the new node is created
- let the user explicitly choose `SP` or `SD`
- this keeps node creation separate from sketch-tool execution

### Implementation Spec

#### Summary

`4.1I4` should make the staged `Graph > Sketch` branch recover gracefully when no sketch nodes exist yet.

The first implementation target is narrow:
- selected graph exists
- user enters `Sketch`
- graph has zero sketch nodes
- console creates one real `Geometry/Sketch` node
- staged session continues into that new sketch

This is the first staged phase that owns real node creation.

#### Locked Outcome

`4.1I4` should deliver:
- missing-sketch detection inside the staged `Graph > Sketch` branch
- real `Geometry/Sketch` node creation through the normal graph mutation seam
- deterministic default node placement
- staged-context rebuild after creation
- automatic entry into the new sketch scope
- node selection and viewport fit after creation

Important rule:
- do not implement this as a console-only fake branch

#### Creation Rule

When the user submits `S` from:
- `Select > Graph > graph_[n]`

and the selected graph has zero sketch nodes, the system should:
- create one real `Geometry/Sketch` node in that graph
- place it in the graph canvas
- update the active graph document state
- select and fit the new node in the active editor viewport
- rebuild the staged context from the updated graph
- continue the staged session into:
  - `Select > Graph > graph_[n] > Sketch > sketch_[1]`

If the graph already has one or more sketches, `4.1I4` should not change the existing behavior.

#### Node Creation Seam

`4.1I4` should reuse existing graph/node infrastructure:
- normal graph command or graph patch seam
- normal `Geometry/Sketch` default params
- normal node id generation rules

Candidate ownership:
- graph mutation in the store layer
- staged-session recovery in the console layer

Important rule:
- the console should orchestrate the flow
- it should not own the raw sketch-node object shape inline if a reusable creation seam can be factored cleanly

#### Placement Rule

For the first implementation:
- use one deterministic default canvas position
- keep the rule simple and stable

Examples of acceptable first-pass rules:
- graph origin area when no positioned nodes exist
- otherwise a fixed offset to the right of the current graph contents

Important rule:
- the node must appear on the canvas in a predictable place

#### Transcript Rule

The transcript should make the recovery visible.

Minimum visible steps:
- submitted token:
  - `> s`
- current breadcrumb:
  - `Select > Graph > graph_[1] > Sketch`
- creation feedback:
  - `Created sketch_[1]`
- post-create breadcrumb:
  - `Select > Graph > graph_[1] > Sketch > sketch_[1]`
- next prompt:
  - `Choose next [Sketch Plane, Sketch Draw, Back]`

Important rule:
- do not make auto-creation silent

#### Scope Boundary

Keep `4.1I4` focused on missing-sketch recovery only.

Owned here:
- sketch creation when the branch is empty
- staged continuation into the created sketch

Not owned here:
- top-level high-level `Sketch` command
- automatic `Sketch Plane` execution after creation
- profile creation
- non-sketch branch expansion

#### First Implementation Steps

`4.1I4` should likely be implemented in this order:

1. detect the zero-sketch case at the staged `Graph > Sketch` transition
2. create one real `Geometry/Sketch` node in the selected graph
3. rebuild the staged context from updated store state
4. continue the staged flow into the created sketch
5. show transcript feedback for creation and resumed scope

#### Acceptance Shape

`4.1I4` should read as complete when:

- if a selected graph has no sketches, submitting `S` creates one real sketch node
- the created sketch appears in the graph canvas with deterministic placement
- the created sketch is selected and fitted in the active editor viewport
- the staged session continues into that created sketch instead of failing or stopping at an empty list
- the next staged prompt becomes:
  - `Choose next [Sketch Plane, Sketch Draw, Back]`
- the transcript clearly shows that creation happened
- existing behavior for graphs that already contain sketches remains unchanged

##### [ ] `4.1I5` Robustness And Prompt Quality

Purpose:
- improve clarity, recovery, and consistency once the core system works

In scope:
- better scoped error copy
- better next-choice prompts
- clearer breadcrumb labels
- handling disappearing graphs or sketches during an active session

Acceptance shape:
- staged navigation remains understandable and recoverable under normal editing churn

#### Locked Deferrals

Keep these out of `4.1I`:

- literal `>` path string parsing
- fuzzy matching
- autocomplete UI
- freeform natural-language console interpretation
- custom user-authored aliases
- macro recording
- full app-wide grammar coverage on day one

#### Acceptance Shape

`4.1I` should read as complete when:

- the console can maintain a staged navigation session across multiple `Enter` submissions
- a staged sequence like `G`, `1`, `S`, `1`, `SD` resolves to `Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`
- alias tokens are resolved relative to scope, not globally
- flat commands like `move`, `m`, `line`, and `status` still work unchanged outside staged navigation
- the transcript shows the submitted token, the resolved breadcrumb, and the next prompt or action result
- invalid staged tokens produce scoped, specific errors instead of generic unknown-command output

## [ ] `4.1J` Input Ownership And Coordination Cleanup

#### Summary

`4.1J` should clean up the coordination seam between:
- the `Console`
- the `Browser`
- the `Spaghetti Editor`
- `ViewportOverlay`
- `Viewer`
- active toolbars and tool sessions

The goal is not to centralize all behavior in one file.

The goal is:
- centralize input ownership decisions
- keep feature/session behavior in domain seams
- remove ambiguous key ownership

#### Target Outcome

`4.1J` should establish:
- one explicit input-priority model
- one shared routing seam that decides who owns a key
- domain-owned session behavior after ownership is resolved
- fewer ad hoc `keydown` listeners with overlapping authority

Important rule:
- do not turn `ConsoleDock` into a god object
- do not turn `AppShell` into a god object

## Subphases

### [x] `4.1J1` Input Ownership Audit

#### Questions / Decisions

##### [x] `q1` Decide which keys `4.1J1` must audit first.

##### Suggestion
- locked direction:
- `4.1J1` should audit these keys first:
  - `Esc`
  - `Enter`
  - `Space`
  - `m / r / s`
  - `x`
  - `b / back`
- do not widen the audit until these keys are understood and locked

##### [x] `q2` Decide which active input-owner categories ParaHook should recognize.

##### Suggestion
- locked direction:
- the first ownership categories should be:
  - focused real text-editing field
  - sketch-plane pick session
  - geometry sketch draw/review session
  - reference transform session
  - staged console session
  - flat console capture
  - idle/passive app state
- use these categories consistently in both audit and later routing work

##### [x] `q3` Decide the intended priority order between active input owners.

##### Suggestion
- locked direction:
- the target priority should be:
  1. focused real text-editing field
  2. active modal/tool-specific session
  3. active feature session
  4. active staged console session
  5. flat/global console capture
  6. passive/global shortcuts
- lower-priority systems should not claim keys if a higher-priority owner is active

##### [x] `q4` Decide what `Esc` should mean for each owner category.

##### Suggestion
- locked direction:
- `Esc` should mean `cancel or exit the highest-priority active session`
- first target semantics:
  - text field:
    - stays with the field if the field owns it
  - sketch-plane pick:
    - cancel sketch-plane pick
  - sketch draw:
    - first `Esc` clears draft
    - second `Esc` exits draw
  - staged console:
    - cancel staged session
  - reference transform:
    - cancel active transform session
- do not use `Esc` as a one-level staged back key

##### [x] `q5` Decide what `Enter` should mean for each owner category.

##### Suggestion
- locked direction:
- `Enter` should mean `confirm/submit for the highest-priority active owner`
- first target semantics:
  - text field:
    - submit/commit field-local editing
  - sketch-plane pick:
    - confirm plane when stage allows it
  - sketch draw:
    - finish current draft when allowed
  - staged console:
    - submit current token
  - flat console:
    - submit current command text

##### [x] `q6` Decide whether `Space` should be global or command-scoped.

##### Suggestion
- locked direction:
- `Space` should not become a global submit key
- it should act like `Enter` only in token-based command contexts
- command tokens should stay space-free where practical so `Space` and `Enter` can both submit the current token
- real text-editing fields must retain normal `Space` behavior

##### [x] `q7` Decide whether single-letter command keys should be global or scope-relative.

##### Suggestion
- locked direction:
- single-letter keys should be scope-relative
- examples:
  - `b` may mean `Back` in staged navigation
  - `m` may mean `move` in flat console but something else in a feature session
- do not freeze single-letter keys into one global meaning

##### [x] `q8` Decide what the audit should produce as concrete output.

##### Suggestion
- locked direction:
- `4.1J1` should produce:
  - one current-owner table
  - one target-owner table
  - one key-priority list
  - one locked token-input rule for `Space`
- this should be enough to start `4.1J2` without another discovery pass

### Implementation Spec

Purpose:
- document the real current owners for the highest-risk keys and session overlaps

In scope:
- audit current ownership for:
  - `Esc`
  - `Enter`
  - `Space`
  - `m / r / s`
  - `x`
  - `b / back`
- list current listeners and the contexts where they take effect
- lock the intended priority order
- lock whether command tokens should stay space-free so `Space` and `Enter` can both act as submit keys in command contexts

#### Audit Method

`4.1J1` should be a documentation-first audit, not a code-rewrite phase.

It should:
- inspect current key listeners and command-entry seams
- map them to active session categories
- record both current and intended ownership
- identify known conflicts and ambiguities

It should not:
- refactor routing yet
- move listeners yet
- silently change feature behavior

#### Locked Audit Artifacts

`4.1J1` should leave behind these concrete artifacts in this doc:

1. Current owner audit table
- key
- current owner(s)
- live context(s)
- current behavior
- ambiguity/conflict

2. Target owner table
- key
- target owner
- target behavior
- fallback or exception

3. Input priority list
- ordered owner categories
- one short explanation per level

4. Token rule note
- command tokens should stay space-free where practical
- `Space` and `Enter` may both submit in token-based command contexts
- real text-entry surfaces keep normal `Space`

#### Required Output Tables

`4.1J1` should leave behind these explicit artifacts in the doc:

1. key-owner audit table
- key
- current owner(s)
- current contexts
- observed ambiguity or conflict

2. target ownership table
- key
- target owner
- target behavior
- notes/exceptions

3. input-priority list
- ordered owner categories
- short explanation for each step

#### Audit Coverage Notes

The audit should answer these concrete questions for each key:
- who owns the key today
- when that owner wins
- what other system is currently competing for it
- what the target winning owner should be
- whether the key is token-based, session-local, or global

Important rule:
- do not leave live conflicts described only as prose
- each conflict should be visible in either the current-owner table or the target-owner table

#### Required Keys

The audit must explicitly cover:
- `Esc`
- `Enter`
- `Space`
- `m`
- `r`
- `s`
- `x`
- `b`
- `back`

Important rule:
- do not leave any of these keys at “TBD” if they are already in live use

#### Required Current Owners

The audit should inspect at least these current seams:
- `ConsoleDock`
- `ConsoleBar`
- `ViewportOverlay`
- `Viewer`
- `ReferenceTransformToolbar`
- any relevant store/session seam that gives those handlers meaning

#### Scope Boundary

Keep `4.1J1` focused.

Owned here:
- current-vs-target ownership mapping
- token-input rule for `Space`
- key-priority contract

Not owned here:
- routing implementation
- listener removal
- feature-session rewrites

#### First Implementation Steps

`4.1J1` should likely be completed in this order:

1. enumerate active key listeners and the sessions they serve
2. group current behavior under one shared owner-category model
3. write the current-owner table
4. write the target-owner table
5. lock the priority order
6. lock the `Space` token rule
7. record known conflicts that `4.1J2` must resolve

#### Locked Deferrals

Keep these out of `4.1J1`:
- code-level routing changes
- listener deletion
- toolbar rewrites
- full transcript redesign
- command taxonomy expansion beyond current live keys

#### Acceptance Shape

- there is one explicit current-vs-target ownership table in the doc
- the target key-priority order is locked
- the token-input rule for `Space` is locked
- the highest-risk live conflicts are named explicitly enough to start `4.1J2`

#### Current Owner Audit Table

| Key | Current owner(s) | Live context(s) | Current behavior | Ambiguity / conflict |
| --- | --- | --- | --- | --- |
| `Esc` | focused text field, `ConsoleBar`, `ConsoleDock`, `ViewportOverlay`, `Viewer`, `ReferenceTransformToolbar` | text editing, staged console, sketch-plane pick, sketch draw, reference transform | clears console input, cancels staged navigation, cancels sketch-plane pick, clears or exits sketch draw, cancels pending reference transform | multiple window listeners exist; ownership is not decided in one seam |
| `Enter` | focused text field, `ConsoleBar`, `ViewportOverlay`, `Viewer`, `ReferenceTransformToolbar` | text editing, flat console, staged console, sketch-plane adjust, sketch draw, reference transform | submits command text, confirms sketch plane, finishes sketch draft, commits pending transform | same key is valid in several active sessions with no central owner selection |
| `Space` | focused text field, `ConsoleBar` | text editing, staged console token input | normal space in fields; submit current token when `treatSpaceAsSubmit` is enabled | behavior is currently safe but owned only by console-local wiring, not a shared rule |
| `m` | `ViewportOverlay`, `ReferenceTransformToolbar`, `ConsoleDock` | sketch-plane adjust, reference transform, flat/staged console token input | switch sketch-plane gizmo to move, start move transform, or become a console token / `move` command | current console auto-capture can compete with active reference-transform keyboard shortcuts |
| `r` | `ViewportOverlay`, `ReferenceTransformToolbar`, `ConsoleDock`, `Viewer` | sketch-plane adjust, reference transform, flat/staged console token input, viewer gizmo mode | switch sketch-plane gizmo to rotate, start rotate transform, become a console token / `rotate` command, or switch viewer gizmo to scale | current ownership is spread across console, toolbar, and viewer seams |
| `s` | `ReferenceTransformToolbar`, `ConsoleDock` | reference transform, flat/staged console token input | start scale transform or become a console token / `scale` or scoped staged command | active reference-transform shortcuts are not yet protected by the same defer rule used for sketch-plane `m/r` |
| `x` | `ReferenceTransformToolbar`, `ConsoleDock` | reference transform axis selection, sketch-plane console command, sketch-draw console command | choose X axis during transform, cancel sketch-plane pick as `x`, or exit sketch draw as `x` | scope-sensitive today, but still split between live keyboard session and typed command session |
| `b` | staged navigation grammar, `ConsoleDock` | staged navigation scopes with a parent | `b` means `Back` and moves one staged level up | `Build` no longer claims the short `b` alias |
| `back` | staged navigation grammar, `ConsoleDock` | staged navigation only | always moves staged navigation one level up when a parent scope exists | low conflict today, but it should stay staged-only rather than becoming a global key |

#### Target Ownership Table

| Key | Target owner | Target behavior | Notes / exceptions |
| --- | --- | --- | --- |
| `Esc` | highest-priority active owner | cancel or exit the active session | text fields keep native ownership; staged console uses `Esc` to cancel the whole staged session, not go back one level |
| `Enter` | highest-priority active owner | confirm or submit the active session | text fields commit local editing; staged and flat console submit tokens / commands |
| `Space` | token-based command owner only | submit current token in command contexts | never global; real text-entry surfaces keep normal `Space` |
| `m` | sketch-plane adjust, else reference transform, else command input | move mode in active session, otherwise command token | this is scope-relative, not a global one-letter law |
| `r` | sketch-plane adjust, else reference transform, else command input | rotate mode in active session, otherwise command token | viewer-only `r` behavior should not outrank an active higher-priority session |
| `s` | reference transform, else command input | scale mode in active session, otherwise command token | staged graph / sketch aliases may still reuse `s` inside their own scope |
| `x` | reference transform axis-selection, else command/session-local token owner | X axis in transform mode; otherwise session-local command meaning | do not make `x` global; keep it owned by the active session scope |
| `b` | staged navigation scope | staged back token | `b` always means `Back` in staged navigation |
| `back` | staged navigation scope | always go up one staged level | staged-only command token, not a passive global shortcut |

#### Locked Input Priority List

1. Focused real text-editing field
- native typing wins first
- command capture and global shortcuts must not steal keys from real text editing

2. Active modal / tool-specific session
- examples:
  - sketch-plane pick
  - pending reference-transform keyboard edit
- if one of these is active, it wins over console capture

3. Active feature session
- examples:
  - geometry sketch draw / review
  - reference transform session more broadly
- feature-local keys win before staged or flat console routing

4. Active staged console session
- staged navigation owns token submission and staged lifecycle keys once no higher-priority feature session is active

5. Flat / global console capture
- printable keys auto-capture into the console only when no higher-priority owner is active

6. Passive / global shortcuts
- lowest-priority shortcuts should run only when nothing more specific owns the key

#### Locked Token Rule For `Space`

- command tokens should stay space-free where practical
- display labels may still contain spaces:
  - `Sketch Draw`
  - `Sketch Plane`
- command tokens should prefer compact forms such as:
  - `g`
  - `sd`
  - `sp`
  - `back`
- in token-based command contexts, `Space` and `Enter` may both submit the current token
- outside those contexts, `Space` remains ordinary text input

#### Known Live Conflicts To Resolve In `4.1J2`

- `Esc` is currently meaningful in console input, staged console, sketch-plane pick, sketch draw, viewer, and reference transform, but ownership is still distributed across several listeners.
- `Enter` is currently meaningful in flat console, staged console, sketch-plane adjust, sketch draw, and reference transform, but there is no single routing seam deciding who wins.
- `m / r / s` are split between console token capture and active feature sessions.
- `m / r` already defer correctly for sketch-plane adjust, but `m / r / s` do not yet follow one shared rule for reference transform.
- `x` is already scope-sensitive in a healthy way, but it still depends on separate listeners rather than one explicit priority contract.

#### Phase Result

`4.1J1` is complete when read as a planning artifact:
- the current owners are explicit
- the target owners are explicit
- the key-priority contract is explicit
- the token rule for `Space` is explicit
- `4.1J2` can now implement a routing seam without another discovery pass

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

### [x] `4.1J3` Session Migration

#### Questions / Decisions

##### [x] `q1` Decide what `4.1J3` is actually migrating.

##### Suggestion
- locked direction:
- `4.1J3` should migrate active sessions onto the shared routing seam from `4.1J2`
- it should not invent a second routing model
- it should not reopen the owner-priority decisions from `4.1J1`

##### [x] `q2` Decide which sessions should migrate first.

##### Suggestion
- locked direction:
- first migration targets should be:
  - sketch-plane pick
  - geometry sketch draw / review
  - reference transform
  - staged console navigation
- do not start with Browser
- Browser is more about reflecting shared state than urgent key-ownership cleanup

##### [x] `q3` Decide whether sessions should be migrated one by one or all at once.

##### Suggestion
- locked direction:
- migrate one session family at a time
- keep each migration narrow enough to verify before moving to the next
- do not try to replace every listener in one combined sweep
- local listeners may still exist temporarily during migration
- but for routed keys they should become:
  - dumb delegates into the shared seam
  - or no-ops when they are not the winning owner
- they should not remain independent precedence systems

##### [x] `q4` Decide what each migrated session should keep owning.

##### Suggestion
- locked direction:
- each migrated session should still own its real behavior
- examples:
  - sketch-plane pick still owns plane cancel / confirm / gizmo-mode behavior
  - sketch draw still owns draft cancel / finish behavior
  - reference transform still owns transform cancel / commit / mode-switch behavior
  - staged console still owns staged cancel / token submit behavior
- only key ownership moves to the shared routing seam

##### [x] `q5` Decide how command tokens and single-letter aliases should behave during migration.

##### Suggestion
- locked direction:
- token and alias meaning should remain scope-relative during migration
- do not turn `m / r / s / x / b` into global app meanings
- keep compact space-free command tokens where practical so `Space` and `Enter` can both submit in command contexts

##### [x] `q6` Decide what counts as success for a migrated session.

##### Suggestion
- locked direction:
- a migrated session counts as complete when:
  - its key handling now goes through the shared routing seam
  - lower-priority owners no longer steal its keys
  - its domain/session behavior still works unchanged from the user perspective
  - existing tests or new regression tests prove the precedence

##### [x] `q7` Decide what `4.1J3` must leave for `4.1J4`.

##### Suggestion
- locked direction:
- `4.1J3` should leave:
  - the main conflicting sessions migrated
  - old overlapping listeners reduced where safe
  - targeted precedence regressions covered by tests
- `4.1J4` should then handle the remaining cleanup and hardening pass

### Implementation Spec

Purpose:
- move the main active sessions onto the shared routing model

#### Summary

`4.1J3` is the phase where the new routing seam becomes the real path for the main conflicting sessions.

`4.1J2` created the traffic cop.
`4.1J3` moves the busiest intersections under that traffic cop.

Main rule:
- migrate sessions onto the seam
- do not migrate ownership rules back out into local component precedence hacks

Important sequencing note:
- `4.1J2` created the routing seam
- `4.1J3` migrates the busiest conflicting sessions onto that seam
- migrated sessions must trust the seam first, not keep solving precedence locally

First migration targets:
- sketch-plane pick
- geometry sketch draw/review
- reference transform
- staged console navigation

Important token rule:
- command/session tokens should avoid spaces where practical
- display labels may still contain spaces
- command input should prefer compact space-free tokens such as:
  - `g`
  - `sd`
  - `sp`
  - `back`

Important rule:
- migrate the highest-conflict sessions first

#### Main Decision

The main decision in `4.1J3` is:

- do key conflicts keep being solved locally inside each feature
- or do the real feature sessions now trust the shared routing seam to decide ownership first

Locked answer:
- trust the shared routing seam first
- let each feature session keep owning only its real behavior

#### Locked Outcome

`4.1J3` should deliver:
- sketch-plane pick routed through the shared seam
- sketch draw routed through the shared seam
- reference transform routed through the shared seam
- staged console routed through the shared seam
- fewer overlapping ad hoc keydown listeners still making first-claim decisions on their own

Important boundary:
- `4.1J3` is still about input ownership migration
- it is not the phase for:
  - Browser/editor selection ownership
  - richer active-surface highlighting
  - workspace-state reflection across Browser / Console / Spaghetti

Important Browser note:
- keep Browser out of the first migration wave
- Browser is not the urgent key-conflict surface in `4.1J3`
- Browser should not become the canonical owner of active graph/editor/tool state inside this phase

#### Migration Contract

Each migrated session should follow the same contract:

1. the routing seam decides whether that session owns the key
2. if the session wins, the existing session seam performs the behavior
3. if the session loses, it does not try to reclaim the key locally

Important rule:
- feature code should not reintroduce hidden precedence logic after routing has already decided ownership

A session is only truly migrated when:
- it consults the shared seam first
- it trusts the seam's `owner + decision`
- lower-priority owners no longer steal its keys
- it stops using local first-claim precedence for routed keys
- existing behavior still works from the user perspective

#### First Migration Order

`4.1J3` should likely migrate in this order:

1. sketch-plane pick
2. geometry sketch draw / review
3. reference transform
4. staged console navigation

Reason:
- these are the most active overlapping owners today
- Browser can wait because it is not the urgent key-conflict surface

Important note:
- within the sketch session family, `draw` is the higher-risk subcase
- `review` should stay attached to the same family, but `draw` is where key conflicts are most likely to regress first

#### Key Migration Order

Within those sessions, keep the routed key order narrow:

1. `Esc`
2. `Enter`
3. token-scoped `Space`
4. `m / r / s`
5. `x`
6. `b / back`

Important rule:
- do not jump to lower-value alias cleanup before `Esc` / `Enter` are stable

Important token/capture note:
- staged console must not reclaim printable token input while higher-priority feature sessions are active
- this is one of the easiest migration regressions
- staged/flat console capture should only run when the shared routing seam says console owns the key

#### Likely Integration Seams

Primary seams:

- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/viewer/Viewer.ts`
- session/domain seams already present in:
  - `useSpaghettiStore`
  - `useAppStore`

Likely responsibilities:

- shared routing seam:
  - decide active owner
  - return `owner + decision`
- migrated session surface:
  - call the shared routing seam first
  - stop making first-claim decisions locally
  - degrade into a delegate or no-op for routed keys when it is not the winning owner
- domain/session seam:
  - continue performing the real behavior once selected

#### First Implementation Steps

`4.1J3` should likely be completed in this order:

1. migrate the remaining sketch-plane and sketch-draw entry points so they always consult the shared seam first
2. migrate reference-transform key handling to rely on routed ownership rather than local precedence
3. migrate staged-console lifecycle/token handling onto the same routed ownership contract
4. remove or simplify local first-claim checks that the shared seam now replaces
5. add regression tests proving that higher-priority sessions beat lower-priority console capture

If implementation pressure forces tradeoffs:
- preserve the routing contract first
- preserve feature-owned behavior second
- defer broader cleanup to `4.1J4`

#### Scope Boundary

Keep `4.1J3` focused.

Owned here:
- session migration onto the shared routing seam
- removing local first-claim decisions where the seam now owns them
- precedence regressions for migrated sessions

Not owned here:
- broad listener cleanup across the whole app
- Browser/state reflection work
- transcript redesign
- command taxonomy redesign
- richer surface highlighting

#### Locked Deferrals

Keep these out of `4.1J3`:
- global workspace-selection coordination
- Browser as canonical owner of active graph/editor/tool state
- full UI/status reflection across Console / Browser / Spaghetti
- final dead-listener purge beyond what is needed for migrated sessions

#### Acceptance Shape

Acceptance shape:
- these sessions no longer rely on ambiguous overlapping key handling
- `Esc` / `Enter` / single-letter keys resolve according to the locked priority model
- token-based command flows can use either `Space` or `Enter` to advance without needing multi-word command entry
- the migrated sessions trust the shared routing seam instead of local accidental precedence

### [x] `4.1J4` Cleanup And Hardening

#### Questions / Decisions

##### [x] `q1` Decide what `4.1J4` is actually cleaning up.

##### Suggestion
- locked direction:
- `4.1J4` should clean up leftover drift after `4.1J1-J3`
- it should focus on:
  - redundant routed-key listeners
  - edge-case key precedence regressions
  - cancel/exit/focus inconsistencies
  - command-scoped `Space` safety
- it should not become a general UI polish bucket

##### [x] `q2` Decide how aggressive listener cleanup should be.

##### Suggestion
- locked direction:
- remove or simplify redundant listeners where safe
- do not force every listener out of existence just to make the phase look “clean”
- if a local listener still serves a valid non-routed responsibility, it may remain
- the real requirement is:
  - routed keys no longer depend on overlapping accidental precedence

##### [x] `q3` Decide what to normalize around transcript and status behavior.

##### Suggestion
- locked direction:
- normalize transcript/status behavior only where routed ownership currently feels inconsistent
- examples:
  - duplicate cancel/result messages
  - missing feedback after routed session exit
  - inconsistent wording between similar routed outcomes
- do not redesign the whole console transcript system in `4.1J4`

##### [x] `q4` Decide which edge cases matter most.

##### Suggestion
- locked direction:
- highest-priority edge cases should be:
  - focus changes while a routed session is active
  - cancel/exit behavior after partial interaction
  - staged console resuming correctly after higher-priority sessions end
  - token-scoped `Space` never leaking into normal parameter/text editing
- do not widen this into a broad workspace-state coordination phase

##### [x] `q5` Decide what test coverage `4.1J4` must leave behind.

##### Suggestion
- locked direction:
- `4.1J4` should leave:
  - regression tests for priority conflicts
  - regression tests for routed session exit/cancel behavior
  - regression tests proving `Space` stays scoped
- the goal is to make the routing model hard to accidentally regress later

##### [x] `q6` Decide what stays out of `4.1J4`.

##### Suggestion
- locked direction:
- keep these out:
  - Browser/editor selection ownership
  - shared workspace-selection coordination
  - active-surface highlight/reflection systems
  - command taxonomy redesign
  - major transcript redesign
- `4.1J4` is the hardening pass for the input-routing cleanup only

### Implementation Spec

Purpose:
- remove leftover drift once the routing model is working

#### Summary

`4.1J4` is the cleanup and hardening pass for the routing work that landed in `4.1J1-J3`.

By this point:
- ownership rules are locked
- the shared seam exists
- the main sessions have been migrated

So `4.1J4` should do the follow-through work:
- reduce leftover drift
- harden edge cases
- tighten regressions

Main rule:
- stabilize the routing system
- do not reopen the architecture

In scope:
- remove redundant listeners where appropriate
- normalize transcript/status behavior
- add regression tests for priority conflicts
- tighten edge cases around session exit/cancel/focus
- verify that token-based `Space` submit does not leak into normal parameter/text editing

#### Main Decisions

The main decisions in `4.1J4` are:

1. Which leftover listeners are actually redundant now?
- remove or simplify only the ones the shared seam truly replaced

2. Which remaining inconsistencies are real routing problems versus unrelated UX polish?
- fix routing-related inconsistencies
- defer broader UX redesign

3. What regressions must be locked down with tests before the routing work can be considered stable?
- priority conflicts
- routed session cancel/exit
- scoped `Space`

#### Locked Outcome

`4.1J4` should deliver:
- fewer redundant routed-key listeners
- more consistent cancel/exit behavior across the migrated sessions
- regression coverage for the highest-risk routing conflicts
- proof that `Space` submit stays scoped to token-based command contexts

Important boundary:
- `4.1J4` is still about cleanup and hardening of input ownership
- it is not the phase for:
  - shared workspace-selection cleanup
  - Browser/editor active-state reflection
  - larger command-language redesign

#### Hardening Targets

The cleanup pass should focus on:

1. Redundant listener cleanup
- remove or simplify routed-key listeners that the shared seam now fully replaces

2. Cancel / exit consistency
- make sure routed `Esc` behavior feels coherent across migrated sessions

3. Focus consistency
- make sure real text-entry fields still keep first claim on typing
- make sure console capture resumes correctly after higher-priority sessions end

4. Scoped `Space`
- confirm token-scoped `Space` submit never leaks into normal text or parameter editing

5. Regression safety
- lock the highest-risk conflicts into tests so future command growth does not quietly undo the routing work

#### Extra Hardening Rule

For routed keys, no lower-priority surface should still be able to win because of:
- mount order
- bubbling order
- duplicate window listeners
- local accidental precedence

Important rule:
- if a routed key still works only because one listener happens to fire first, `4.1J4` is not complete yet

#### Leftover Listener Rule

If a local listener still handles a routed key after migration, it must do one of these:

- delegate into the shared routing seam
- remain strictly local for a non-routed responsibility

It must not keep making hidden first-claim ownership decisions for routed keys.

#### Resume / Recovery Target

After a higher-priority routed session ends:
- staged console should resume predictably if it was previously active
- flat console capture should resume predictably if it was previously active
- pending command/token state should not be lost silently unless explicit cancel semantics require it

#### Focus-Loss Rule

If focus moves into a real text-editing field while a routed session still exists:
- the text field keeps native typing ownership
- the routed session must behave predictably:
  - either pause
  - or remain active but passive
- do not leave this as accidental behavior

#### Minimal Diagnostics Rule

Routing hardening should leave behind enough diagnostics/debug visibility that:
- impossible owner conflicts
- unexpected routed-key fallthrough
- duplicate cancel/submit handling

can be detected in tests or debug output instead of failing silently.

#### Likely Integration Seams

Primary seams:

- `src/app/inputRouting.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/viewer/Viewer.ts`

Likely responsibilities:

- routing seam:
  - remain the single source of precedence truth
- migrated surfaces:
  - shed leftover local first-claim logic where safe
  - keep only local responsibilities that are still truly local
- tests:
  - prove that later changes do not reintroduce accidental precedence

#### First Implementation Steps

`4.1J4` should likely be completed in this order:

1. identify routed-key listeners that are now redundant after `4.1J3`
2. remove or simplify those listeners one small group at a time
3. tighten routed cancel/exit behavior where it is still inconsistent
4. add or expand precedence regression tests
5. verify that command-scoped `Space` still never leaks into normal editing
6. verify routed-session resume and focus-loss behavior explicitly
7. stop when the routing system feels stable, not when every file is cosmetically minimal

#### Scope Boundary

Keep `4.1J4` focused.

Owned here:
- redundant-listener cleanup for routed keys
- routed cancel/exit/focus hardening
- regression test coverage for routing conflicts
- command-scoped `Space` safety verification

Not owned here:
- Browser/state coordination
- active-surface reflection systems
- command taxonomy redesign
- full transcript redesign
- broader workspace cleanup

#### Locked Deferrals

Keep these out of `4.1J4`:
- Browser as canonical owner of app activity
- shared selection/workspace-state architecture
- graph/editor/node/sketch coordination redesign
- large console UX restyling

#### Acceptance Shape

- coordination remains stable under normal editing churn
- the app no longer depends on scattered accidental key precedence for routed keys
- cancel/exit/focus behavior feels consistent across the migrated sessions
- `Space` submit remains scoped and safe
- later command growth has regression coverage guarding the routing contract
- routed keys no longer depend on mount-order or bubbling-order accidents
- leftover local listeners for routed keys either delegate to the seam or no longer make first-claim decisions
- staged/flat console resumes predictably after higher-priority sessions end
- real text-entry fields still feel native and never lose ordinary typing to command routing

### Immediate Recommendation

The first implementation target inside `4.1J` should be:
- `Esc`

Reason:
- it is the clearest cross-system pressure point
- it already touches staged console, sketch plane pick, sketch draw, viewer, and transform behavior

### [x] `4.1K` Surface-Driven Console Context Sync

#### Questions / Decisions

##### [x] `q1` Decide whether UI interaction should move the console into the matching staged scope.

##### Suggestion
- locked direction:
- yes
- clicking a surface or selected target should move the console into the nearest matching staged scope
- this should be treated as context sync, not as a special shortcut hack
- important rule:
  - the handoff updates context
  - the handoff does not auto-run the next deeper command

##### [x] `q2` Decide which shared seams should drive console context handoff.

##### Suggestion
- locked direction:
- console handoff should resolve from shared workspace truth:
  - `activeSurface`
  - `selectedTarget`
  - current staged session state
- do not derive console scope from panel-local assumptions in:
  - `BrowserPanel`
  - `SpaghettiPanel`
  - `ConsoleDock`
- important rule:
  - the same selected target should resolve to the same console scope no matter which surface produced it

##### [x] `q3` Decide what a plain `Spaghetti` surface click should do.

##### Suggestion
- locked direction:
- clicking into `Spaghetti Editor` should move the console into the nearest stable graph-family scope
- first target behavior:
  - if an active graph document exists:
    - enter `Graph > graph_[n]`
  - if a graph-family node target is already selected:
    - enter the matching node-family scope
- do not leave the console at root if the workspace already has enough truth to enter a stable graph scope

##### [x] `q4` Decide what a node click should do from either `Browser` or `Spaghetti`.

##### Suggestion
- locked direction:
- clicking the same node target from either surface should produce the same console scope
- examples:
  - click `Sketch` node in `Spaghetti`
    - console enters sketch scope
  - click the same `Sketch` node in `Browser`
    - console enters the same sketch scope
- important rule:
  - surface choice may affect `Selection` reporting
  - surface choice should not create different staged command scopes for the same selected target

##### [x] `q5` Decide what should happen when the user clicks away from the active authoring surface.

##### Suggestion
- locked direction:
- clicking away should return the console to the nearest valid parent scope
- first target behavior:
  - leaving a node-family target returns to graph scope
  - leaving graph-family authoring returns to root-ready scope if no active graph-family target remains
- important rule:
  - this should feel like backing out of context
  - not like losing command state randomly

##### [x] `q6` Decide whether surface-driven handoff is allowed to overwrite partially typed command text.

##### Suggestion
- locked direction:
- do not silently discard partially typed command text
- prefer:
  - preserve the draft text when possible
  - update staged scope, breadcrumb, and visible choices around it
- if a handoff must clear draft text for correctness, it should be explicit and visibly reported

##### [x] `q7` Decide what the console should report when UI-driven handoff occurs.

##### Suggestion
- locked direction:
- the console should visibly report:
  - active surface changes
  - selected target changes
  - resulting staged scope handoff
- the transcript should make the state transition understandable, for example:
  - `[Selection] Active surface: Spaghetti Editor`
  - `[Selection] Selected target: Sketch`
  - `[Commands] Graph > Sketch`
- do not leave the user to infer the new command scope from prompt changes alone

##### [x] `q8` Decide what the first implementation cut should prove.

##### Suggestion
- locked direction:
- the first cut should prove:
  - clicking `Spaghetti` with an active graph moves the console into graph scope
  - clicking a `Sketch` node in `Spaghetti` moves the console into sketch scope
  - clicking the same `Sketch` node in `Browser` moves the console into the same sketch scope
  - clicking away backs the console out to the nearest valid parent/root
- do not widen to every node family in the first cut

### Implementation Spec

Purpose:
- keep the staged console visibly synchronized with workspace interaction

#### Summary

`4.1K` should make the `Console` follow workspace context instead of acting like a separate navigation universe.

By this point:
- `4.1J` already cleaned up input ownership
- `5.1F` already established:
  - shared `activeSurface`
  - shared `selectedTarget`
  - canonical workspace intents

So `4.1K` should consume those seams and turn them into visible staged-console context handoff.

This phase is working when:
- clicking a surface reports what became active
- clicking a target reports what became selected
- the console enters the matching staged scope automatically
- the next valid commands for that scope are immediately visible

Important rule:
- UI interaction should update command context
- UI interaction should not auto-run the next deeper command

#### Main Decision

The main decision in `4.1K` is:

- should the console remain mostly typed-only, or should it become context-aware and follow shared workspace state?

Locked direction:
- make the console context-aware
- keep explicit command submission for the actual action

#### First Implementation Cut

The first cut should stay narrow:

1. `Spaghetti` surface click
- if an active graph exists:
  - console enters `Graph > graph_[n]`

2. `Sketch` node click in `Spaghetti`
- console enters the matching sketch scope

3. `Sketch` node click in `Browser`
- console enters the same sketch scope

4. click away / leave authoring context
- console returns to the nearest valid parent/root scope

Do not widen the first cut to every node family yet.

#### Likely Integration Seams

Primary seams:

- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/AppShell.tsx`
- staged grammar / staged session utilities already in:
  - `src/app/console/stagedNavigation.ts`

Likely responsibilities:

- shared workspace seams:
  - remain the source of truth for:
    - `activeSurface`
    - `selectedTarget`
- console handoff seam:
  - maps shared workspace truth to nearest valid staged scope
  - updates visible command choices
  - reports the handoff in transcript/status output
- surfaces:
  - continue to publish surface activation and target selection through shared seams
  - do not invent private console-only handoff logic

#### First Implementation Steps

`4.1K` should likely be completed in this order:

1. add one console-context handoff seam above local console parsing
2. map shared graph-first targets to the nearest staged scopes
3. wire `Spaghetti` activation into graph-scope handoff
4. wire `Browser` and `Spaghetti` node selection into the same node-family handoff
5. add parent/root fallback when the user clicks away from the authoring surface
6. add transcript/status reporting so the handoff is visible and understandable
7. lock regressions proving that the same selected target produces the same console scope from both surfaces

#### Hard Rules

- do not auto-run child commands during handoff
- do not create different console scopes for the same `selectedTarget`
- do not let panel-local state become the real source of console context truth
- do not silently erase partially typed command text unless explicit cancel semantics require it
- keep the first cut graph-first and node-family narrow

#### Scope Boundary

Keep `4.1K` focused.

Owned here:
- UI-driven staged-console context sync
- surface/target-to-scope mapping
- visible console reporting of handoff
- parent/root fallback when context is left

Not owned here:
- deeper command-language redesign
- full transcript redesign
- new workspace-selection seams
- every node family in one pass
- auto-running authoring actions from clicks

#### Acceptance Shape

- clicking `Spaghetti` with an active graph moves the console into graph scope
- clicking the same graph-family node in `Browser` or `Spaghetti` produces the same console scope
- clicking away returns the console to the nearest valid parent/root scope
- the transcript makes the handoff understandable to the user
- the console still requires explicit user submission for deeper authoring commands


# [5.1F] Workspace Selection, Surface Activation, And Canonical Intents

## Canonical Workspace Unification
### Fold hack 3
#### Summary

The next major step after `4.1J` is not more key-routing cleanup.

It is full workspace unification between:
- the `Console`
- the `Browser`
- the `Spaghetti Editor`
- the `Viewer`
- active tool/session overlays

The goal is:
- one canonical workspace-selection model
- one canonical session/tool model
- one canonical intent layer

The goal is not:
- making `ConsoleDock` own the app
- making `Browser` own the app
- making `Spaghetti Editor` the only real source of truth

These surfaces should become different views over the same shared workspace state.

#### What Canonical Should Mean

The canonical workspace system should answer:
- which graph is active
- which editor viewport is active
- which node is selected
- which sketch is selected
- which surface is active
- which session/tool is active
- who owns input right now

If those answers are not shared, the surfaces are still only loosely bridged.

#### Surface Roles

`Console`
- captures command input
- issues intents
- shows transcript and command-state feedback
- should not become the owner of graph/editor selection truth

`Browser`
- renders shared workspace selection and hierarchy state
- can issue the same intents as console and editor
- should not become the canonical owner of editor/tool state

`Spaghetti Editor`
- renders and mutates shared graph/editor/session state
- is the main authoring surface
- should not hide “real” active state inside local-only UI assumptions

`Viewer`
- renders spatial result and tool overlays
- participates in the same session/tool state
- should not create parallel selection truth

#### Canonical Seams

The unified system likely needs three explicit seams:

1. Canonical workspace-selection state
- active graph document
- active editor viewport
- selected target
- active surface

2. Canonical session/tool state
- sketch-plane pick
- sketch draw / review
- reference transform
- staged console session
- future feature-local tool sessions

3. Canonical intent layer
- open graph
- focus viewport
- select target
- start sketch plane
- start sketch draw
- activate surface

Important rule:
- clicks and typed commands should issue the same intents
- no surface should need a private side-channel to make the app do the “real” thing

#### How To Achieve This

The clean path is:

1. define one shared workspace-selection model
- start by naming the minimum canonical state
- do not widen it to every possible UI detail

2. define one intent vocabulary
- console, browser, and editor should all dispatch the same actions
- avoid separate “browser-only” or “console-only” execution paths for the same outcome

3. route surface behavior through that shared state
- console command resolves target, then dispatches canonical intent
- browser click resolves target, then dispatches canonical intent
- editor click resolves target, then dispatches canonical intent

4. let surfaces render from shared state
- browser highlights active graph/node from shared state
- spaghetti floating window highlight reflects shared active-surface state
- console staged navigation resolves against shared workspace state

5. keep local UI state local
- tray open/closed
- menu visibility
- hover affordances
- window appearance tuning

Important rule:
- canonical state should own workspace truth
- local component state should own presentation-only details

#### Questions / Decisions

##### [x] `q1` Decide what the minimum canonical workspace-selection state should include.

##### Suggestion
- locked direction:
- the minimum canonical workspace-selection state should include:
  - `activeGraphDocumentId`
  - `activeEditorViewportId`
  - `selectedTarget`
  - `activeSurface`
- `selectedTarget` should be one shared selection model that can cover:
  - graph node
  - reference
  - object
  - part
- selecting a graph should be enough to drive:
  - browser selection
  - spaghetti window visibility/open state
  - spaghetti active highlight
- do not start with every possible browser row or UI toggle

##### [x] `q2` Decide whether selection should be specialized per domain or unified as one shared selected-target model.

##### Suggestion
- locked direction:
- use one shared `selectedTarget` model first
- do not create a separate canonical `selectedSketchNodeId`
- treat `Sketch` as one node family inside graph scope
- deeper branches should belong to node-family command systems, not to separate selection types
- if later workflows truly require more domain-specific selection detail, add that on top of the shared target model instead of replacing it

##### [x] `q3` Decide what `active surface` means.

##### Suggestion
- locked direction:
- `activeSurface` should mean the surface currently foregrounded for the user
- first valid surface ids may be:
  - `console`
  - `browser`
  - `spaghetti`
  - `viewer`
- this should drive:
  - floating-window active highlight
  - visible foreground emphasis
  - light coordination with input ownership
- it should not replace selection truth
- important distinction:
  - `activeSurface` = which surface is foregrounded
  - `selectedTarget` = what thing is selected

##### [x] `q4` Decide where the canonical workspace-selection state should live.

##### Suggestion
- locked direction:
- the canonical workspace-selection seam should live above the current surfaces and adjacent to the existing stores
- first implementation home:
  - add a dedicated `workspaceSelection` slice in `useAppStore.ts`
- it should not live:
  - in `ConsoleDock.tsx`
  - in `BrowserPanel.tsx`
  - in `SpaghettiPanel.tsx`
- reason from the current code:
  - graph/editor mechanics already live in `useSpaghettiStore.ts`
    - `activeGraphDocumentId`
    - `activeEditorViewportId`
    - `selectedNodeId`
  - cross-surface state already lives in `useAppStore.ts`
    - reference workspace
    - selected part
    - floating shell activation request
  - `BrowserPanel.tsx` already has to read both stores, which is a sign that the canonical coordination seam should sit above the panels, not inside one of them
- recommended implementation shape:
  - keep graph/editor mechanics in `useSpaghettiStore`
  - add a shared `workspaceSelection` slice in `useAppStore`
  - let that slice own cross-surface active-target truth such as:
    - `selectedTarget`
    - `activeSurface`
    - later other workspace-selection state as needed
  - expose selectors/intents that coordinate with `useSpaghettiStore` instead of duplicating local selection logic in console/browser/editor
- important rules:
  - do not immediately copy all Spaghetti state into `useAppStore`
  - do not let `useAppStore` become a mirror of `useSpaghettiStore`
  - the workspace-selection seam owns coordination truth
  - the domain stores still own their real mechanics
  - migrate additional state only when a real cross-surface coordination need proves it

##### [x] `q5` Decide what counts as a canonical intent.

##### Suggestion
- locked direction:
- canonical intents are the shared outcome-level actions that every surface should call when they want the same result
- the first canonical intents should include:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `startSketchPlane`
  - `startSketchDraw`
  - `activateSurface`
- if `Console`, `Browser`, and `Spaghetti Editor` can produce the same user outcome, they should call the same canonical intent
- do not create separate:
  - console-only execution paths
  - browser-only execution paths
  - editor-only execution paths
- important rule:
  - canonical intents should stay small and outcome-based at first
  - do not widen them into every possible local UI action

##### [x] `q6` Decide which current behaviors are only bridges and should later become canonical.

##### Suggestion
- locked direction:
- this question should distinguish between:
  - real canonical domain-entry behavior
  - temporary cross-surface glue
- examples of real canonical domain-entry behavior:
  - `Graph`
  - `Reference`
  - `Assembly`
- these are legitimate root workspace domains, not suspect bridges
- if a root command enters one of those domains, it is correct for that command to:
  - make the right surface visible
  - activate the right surface
  - sync browser/editor selection state
- examples of behavior that may still be temporary glue today:
  - local floating-window activation requests
  - panel-local selection sync that exists only because the canonical workspace-selection seam is not complete yet
  - surface-specific fallback logic that manually pokes another surface instead of dispatching a shared canonical intent
- important rule:
  - do not label high-level domain entry as “just a bridge”
  - only treat a behavior as temporary glue if it exists because the canonical shared selection/intent system is still incomplete

##### [x] `q7` Decide what should remain local component state.

##### Suggestion
- locked direction:
- keep these local unless there is a proven need to share them:
  - menu open/closed
  - hover state
  - popover visibility
  - cosmetic tray expansion
  - appearance tuning values that do not affect cross-surface coordination
- only promote state when multiple surfaces truly need to agree on it
- important rule:
  - presentation-only behavior stays local
  - workspace-selection and cross-surface coordination truth become canonical

##### [x] `q8` Decide what success looks like.

##### Suggestion
- success is not “all state lives in one mega-store”
- success is:
  - console, browser, and editor agree on active graph/node/surface
  - identical user outcomes go through identical intents
  - browser and editor highlights reflect shared truth
  - console navigation resolves against the same shared workspace truth

#### Likely Future Phase Shape

This likely deserves its own follow-on family after `4.1J`, for example:
- workspace-selection audit
- canonical intent layer
- surface migration
- browser/editor/console reflection hardening

It should not be silently folded into more console-only cleanup.




## [5.1F]
### Summary
#### Summary
##### Summary
`5.1F` should unify the shared workspace truth across:
- `Console`
- `Browser`
- `Spaghetti Editor`
- `Viewer`

This phase is not about keyboard routing.
`4.1J` already handled input ownership.

This phase is about:
- one canonical workspace-selection seam
- one canonical active-surface model
- one canonical intent layer for shared cross-surface outcomes

Important rule:
- do not turn `ConsoleDock` into the owner of workspace truth
- do not turn `BrowserPanel` into the owner of workspace truth
- do not mirror all domain state into one mega-store

#### Target Outcome

`5.1F` should establish:
- one shared workspace-selection seam above the current surfaces
- one shared `selectedTarget` model
- one shared `activeSurface` model
- one shared canonical intent layer for common outcomes
- surfaces rendering from shared truth instead of syncing each other through one-off glue

In practical terms:
- selecting a graph should consistently drive:
  - browser selection
  - spaghetti editor visibility/open state when appropriate
  - spaghetti active-window highlight
- selecting a target should consistently drive:
  - browser selection state
  - editor selection state
  - viewer highlight state where relevant
- typed commands and clicks should be able to produce the same outcome through the same intent

#### Canonical Seams

`5.1F` should tighten three seams:

1. Workspace-selection seam
- `activeGraphDocumentId`
- `activeEditorViewportId`
- `selectedTarget`
- `activeSurface`

2. Session/tool seam
- existing feature sessions stay in their domain stores
- sketch-plane pick
- sketch draw / review
- reference transform
- future tool sessions

3. Canonical intent seam
- `openGraphDocument`
- `focusEditorViewport`
- `selectTarget`
- `startSketchPlane`
- `startSketchDraw`
- `activateSurface`

Important rule:
- the workspace-selection seam owns coordination truth
- the domain seams still own their real mechanics

### Questions / Decisions

#### [x] `q1` Decide what the minimum canonical workspace-selection state should include.

#### Suggestion
- locked direction:
- the minimum canonical workspace-selection state should include:
  - `activeGraphDocumentId`
  - `activeEditorViewportId`
  - `selectedTarget`
  - `activeSurface`
- `selectedTarget` should be one shared selection model that can cover:
  - graph node
  - reference
  - object
  - part
- selecting a graph should be enough to drive:
  - browser selection
  - spaghetti window visibility/open state
  - spaghetti active highlight

#### [x] `q2` Decide whether selection should be specialized per domain or unified as one shared selected-target model.

#### Suggestion
- locked direction:
- use one shared `selectedTarget` model first
- do not create a separate canonical `selectedSketchNodeId`
- treat `Sketch` as one node family inside graph scope
- deeper branches should belong to node-family command systems, not to separate selection types

#### [x] `q3` Decide what `activeSurface` means.

#### Suggestion
- locked direction:
- `activeSurface` should mean the surface currently foregrounded for the user
- first valid surface ids may be:
  - `console`
  - `browser`
  - `spaghetti`
  - `viewer`
- `activeSurface` should drive:
  - floating-window active highlight
  - visible foreground emphasis
  - light coordination with input ownership
- important distinction:
  - `activeSurface` = which surface is foregrounded
  - `selectedTarget` = what thing is selected

#### [x] `q4` Decide where the canonical workspace-selection state should live.

#### Suggestion
- locked direction:
- the canonical workspace-selection seam should live above the current surfaces and adjacent to the existing stores
- first implementation home:
  - add a dedicated `workspaceSelection` slice in `useAppStore.ts`
- keep graph/editor mechanics in `useSpaghettiStore.ts`
- do not let `useAppStore` become a mirror of `useSpaghettiStore`

#### [x] `q5` Decide what counts as a canonical intent.

#### Suggestion
- locked direction:
- canonical intents are the shared outcome-level actions that every surface should call when they want the same result
- the first canonical intents should include:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `startSketchPlane`
  - `startSketchDraw`
  - `activateSurface`
- if `Console`, `Browser`, and `Spaghetti Editor` can produce the same user outcome, they should call the same canonical intent

#### [x] `q6` Decide which current behaviors are only bridges and should later become canonical.

#### Suggestion
- locked direction:
- distinguish between:
  - real canonical domain-entry behavior
  - temporary cross-surface glue
- examples of real canonical domain-entry behavior:
  - `Graph`
  - `Reference`
  - `Assembly`
- only treat a behavior as temporary glue if it exists because the canonical shared selection/intent system is still incomplete

#### [x] `q7` Decide what should remain local component state.

#### Suggestion
- locked direction:
- keep presentation-only state local unless there is a proven need to share it
- examples:
  - menu open/closed
  - hover state
  - popover visibility
  - cosmetic tray expansion
  - appearance tuning values that do not affect cross-surface coordination

#### [x] `q8` Decide what success looks like.

#### Suggestion
- locked direction:
- success is not “all state lives in one mega-store”
- success is:
  - console, browser, and editor agree on active graph/node/surface
  - identical user outcomes go through identical intents
  - browser and editor highlights reflect shared truth
  - console navigation resolves against the same shared workspace truth

### Implementation Spec

Purpose:
- create one canonical cross-surface workspace-selection and intent layer for the main workspace domains

#### Scope

Owned here:
- one shared `workspaceSelection` seam in app-level state
- one shared `selectedTarget` model
- one shared `activeSurface` model
- one first canonical intent layer for common graph/reference/editor outcomes
- surface migration onto those shared intents and selectors

Not owned here:
- input-routing precedence
- full session/tool-state redesign
- full browser hierarchy redesign
- large transcript redesign
- every local UI state migration

#### First Implementation Cut

`5.1F` should likely start narrow:

1. create the `workspaceSelection` seam
- likely in `useAppStore.ts`
- first fields:
  - `selectedTarget`
  - `activeSurface`

2. define canonical selectors and intents
- read shared selection truth
- dispatch shared outcome-level actions

3. migrate the highest-value graph path first
- graph selection from console
- graph selection from browser
- graph/editor highlight reflection

4. prove shared target reflection
- selecting the same thing from different surfaces should yield the same browser/editor/viewer result

5. then extend to more domains
- `Reference`
- `Assembly`
- later node families and deeper authoring branches

#### Likely Integration Seams

Primary seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- viewer selection/highlight seams

Likely responsibilities:
- `useAppStore`
  - workspace-selection coordination truth
  - canonical surface activation
  - cross-surface selection model
- `useSpaghettiStore`
  - graph/editor mechanics
  - node/session mechanics
  - graph-domain execution details
- surfaces
  - render from shared truth
  - dispatch shared intents
  - stop inventing panel-local coordination truth

#### First Implementation Steps

`5.1F` should likely be completed in this order:

1. add the app-level `workspaceSelection` seam
2. define the initial `selectedTarget` shape
3. define the first canonical intents
4. route graph-domain entry through those intents
5. make browser/editor/highlight reflection read shared truth
6. add regressions proving identical outcomes from console and browser entry paths
7. extend to additional domains only after graph flow is honest

#### Hard Rules

- do not copy all spaghetti/editor state into `useAppStore`
- do not let panels own canonical workspace truth
- do not make canonical intents so broad that they become UI-script buckets
- do not confuse `activeSurface` with actual selection truth
- do not widen the first cut beyond the highest-value shared outcomes

#### Acceptance Shape

- there is one explicit workspace-selection seam above the current surfaces
- `selectedTarget` and `activeSurface` are shared cross-surface truth
- graph selection can produce the same result from console and browser entry
- browser selection, editor visibility/highlight, and viewer highlight no longer depend on panel-local sync glue for the migrated paths
- the canonical layer coordinates surfaces without becoming a mega-store that owns every feature detail

## [x] `5.1F1` Workspace-Selection Seam

### Summary
#### Summary

`5.1F1` should create the first canonical workspace-selection seam above the current surfaces.

This cut should stay narrow:
- define the first shared workspace-selection state
- place it in the right store seam
- prove one shared source of truth exists for the graph-first flow

### Questions / Decisions

#### [x] `q1` Decide what the first canonical workspace-selection fields should be.

#### Suggestion
- locked direction:
- the first shared fields should be:
  - `selectedTarget`
  - `activeSurface`
- `activeGraphDocumentId` and `activeEditorViewportId` should remain graph/editor mechanics in `useSpaghettiStore` until a real cross-surface coordination need proves they should move

#### [x] `q2` Decide where the first seam should live.

#### Suggestion
- locked direction:
- the first `workspaceSelection` seam should live in `useAppStore.ts`
- do not place it in:
  - `ConsoleDock`
  - `BrowserPanel`
  - `SpaghettiPanel`

#### [x] `q3` Decide what should explicitly stay out of the first seam.

#### Suggestion
- locked direction:
- keep these out of the first seam:
  - local menu state
  - hover state
  - popover visibility
  - local panel presentation toggles
  - full domain/session mechanics

#### [x] `q4` Decide what first proof should count as success.

#### Suggestion
- locked direction:
- the first proof should be:
  - one shared `selectedTarget`
  - one shared `activeSurface`
  - enough selectors to let graph-first flows read the same truth from more than one surface
- do not require every domain in the first cut

### Implementation Spec

Purpose:
- add the app-level `workspaceSelection` seam without turning `useAppStore` into a mirror of `useSpaghettiStore`

Owned here:
- first `workspaceSelection` slice in `useAppStore.ts`
- initial shared fields:
  - `selectedTarget`
  - `activeSurface`
- coordination selectors that can read current graph/editor context honestly

Not owned here:
- broad surface migration
- canonical intent rewiring
- full viewer/browser reflection cleanup

Acceptance shape:
- there is one explicit `workspaceSelection` seam
- `selectedTarget` and `activeSurface` have one shared home
- graph/editor mechanics still stay in `useSpaghettiStore`

## [x] `5.1F2` Canonical Intent Layer

### Summary
#### Summary

`5.1F2` should define the first shared outcome-level intents that multiple surfaces can call to produce the same result.

This is the seam that should stop console/browser/editor from each inventing their own execution path for the same user outcome.

This phase should stay narrow:
- prove the graph-first path first
- define one shared outcome-level intent seam
- make that seam callable from more than one surface
- do not try to migrate every domain or every panel in the same cut

### Questions / Decisions

#### [x] `q1` Decide what should count as a canonical intent in the first pass.

#### Suggestion
- locked direction:
- canonical intents should be outcome-level actions shared by more than one surface
- the first set should include:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `activateSurface`
- keep `startSketchPlane` and `startSketchDraw` in the vocabulary, but graph-first outcomes should be the first implementation proof

#### [x] `q2` Decide how broad canonical intents should be.

#### Suggestion
- locked direction:
- canonical intents should stay small and outcome-based
- do not turn them into UI-script buckets that encode panel-specific sequencing

#### [x] `q3` Decide who should call the canonical intents.

#### Suggestion
- locked direction:
- `Console`, `Browser`, and `Spaghetti Editor` should all call the same shared intents when they want the same outcome
- do not keep separate console-only or browser-only execution paths for migrated outcomes

#### [x] `q4` Decide what should stay outside the first intent layer.

#### Suggestion
- locked direction:
- keep these out of the first intent layer:
  - panel-local UI actions
  - transcript wording
  - deep browser hierarchy behavior
  - unrelated tool-session mechanics

#### [x] `q5` Decide what the first implementation proof should be.

#### Suggestion
- locked direction:
- the first implementation proof should be the graph-first outcome set:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `activateSurface`
- this should be enough to prove that:
  - `Console`
  - `Browser`
  - later `Spaghetti Editor`
  can produce the same workspace result through the same shared intents
- keep:
  - `startSketchPlane`
  - `startSketchDraw`
  in the vocabulary
- but do not require them to be the first migrated proof inside `5.1F2`

#### [x] `q6` Decide where the canonical intent layer should live.

#### Suggestion
- locked direction:
- the canonical intent layer should live above the surfaces and adjacent to the current stores
- the first practical home should be:
  - a shared workspace-intents seam in `src/app/store`
- it should coordinate:
  - `useAppStore`
  - `useSpaghettiStore`
- it should not live:
  - inside `ConsoleDock`
  - inside `BrowserPanel`
  - inside `SpaghettiPanel`

#### [x] `q7` Decide what each canonical intent should return.

#### Suggestion
- locked direction:
- canonical intents should return small inspectable results where useful
- examples:
  - opened graph id
  - focused viewport id
  - selected target
  - activated surface
- do not make the intent layer fire-and-forget when the caller needs to continue deterministic flow
- especially for console-driven staged paths, the caller should be able to continue with clear outcome data

#### [x] `q8` Decide what should count as success for `5.1F2`.

#### Suggestion
- locked direction:
- `5.1F2` is complete when:
  - there is one explicit canonical intent seam
  - graph-first workspace outcomes no longer require separate console-only and browser-only execution logic
  - the first migrated callers can use the same shared outcome-level intents
  - the intent layer remains small and outcome-based rather than turning into a UI-script bucket

### Implementation Spec

Purpose:
- define one canonical intent vocabulary and one first shared dispatch seam for common workspace outcomes

#### Main Decision

The main decision in `5.1F2` is:
- where should shared workspace outcomes be executed so multiple surfaces can call the same behavior?

Locked answer:
- execute those outcomes through one canonical intent seam above the surfaces
- let domain stores still own their real mechanics underneath

#### First Implementation Cut

The first implementation cut should be intentionally narrow:
- graph-first selection/open/focus/activation only

First intents to make real:
- `openGraphDocument`
- `focusEditorViewport`
- `selectTarget`
- `activateSurface`

First outcomes to prove:
- console `g` / staged graph selection
- browser graph-row selection
- spaghetti/window activation for the selected graph path

Important rule:
- do not try to solve:
  - all node families
  - every browser click path
  - every viewer reflection path
  in the same cut

Owned here:
- first canonical intents such as:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `startSketchPlane`
  - `startSketchDraw`
  - `activateSurface`
- shared dispatch helpers/selectors that coordinate `useAppStore` and `useSpaghettiStore`

Likely first real seam:
- a shared workspace-intents utility/module in `src/app/store`
- or a neighboring seam with a similarly narrow home

Likely responsibilities:
- canonical intent layer:
  - accept simple outcome-level calls
  - coordinate `useAppStore` and `useSpaghettiStore`
  - return enough outcome data for deterministic callers
- domain stores:
  - still perform the actual graph/editor/session mechanics
- surfaces:
  - dispatch canonical intents instead of open-coding their own equivalent execution path

#### First Intent Contract

The first canonical intents should conceptually behave like:

1. `openGraphDocument(graphDocumentId)`
- ensure the graph is open in a usable editor viewport
- return the resolved viewport id when available

2. `focusEditorViewport(editorViewportId)`
- make the target viewport the active viewport
- return the resolved active viewport id

3. `selectTarget(target)`
- write the canonical workspace target into shared selection state
- return the selected target

4. `activateSurface(surface)`
- write the canonical active surface
- return the active surface

Important rule:
- these should remain outcome-level and composable
- do not collapse them immediately into one mega-intent that scripts every UI detail

#### Likely Integration Seams

Primary seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/panels/BrowserPanel.tsx`

Secondary follow-on callers:
- `AppShell`
- later `Spaghetti Editor` interactions

#### First Implementation Steps

`5.1F2` should likely be completed in this order:

1. create the shared canonical intent seam
2. define the first graph-first intent vocabulary
3. wire those intents to `useAppStore` + `useSpaghettiStore`
4. migrate the existing console graph-first path to call that seam
5. migrate the matching browser graph-row path to call that same seam
6. verify that both surfaces produce the same workspace outcome
7. stop before broadening into deeper node-family or tool-session work

#### Hard Rules

- do not let `ConsoleDock` remain a private owner of graph-first open/select/focus behavior
- do not let `BrowserPanel` retain a parallel custom execution path for the same migrated outcome
- do not make the canonical intent layer so broad that it becomes a panel-script engine
- keep the first migrated intent set narrow enough to verify directly

Not owned here:
- migrating every surface in one pass
- broad browser hierarchy redesign
- local UI state cleanup
- staged-console choice assist
- full viewer reflection cleanup
- large command-taxonomy expansion

Acceptance shape:
- common outcomes have one shared intent path
- console, browser, and spaghetti can call the same outcome-level intents
- canonical intents remain small and outcome-based
- graph-first workspace outcomes are no longer relying on separate console-only and browser-only execution logic
- `5.1F3` can migrate visible reflection paths without redesigning the intent seam

## [x] `5.1F3` Surface Migration And Reflection

### Summary

`5.1F3` should migrate the highest-value surfaces onto the canonical workspace-selection seam and canonical intents.

This is where shared truth should start visibly driving browser selection, spaghetti activation/highlight, and related viewer/editor reflection.

This cut should stay narrow:
- migrate the graph-first path first
- prove visible reflection from shared truth
- remove only the panel-local glue that the migrated path truly replaces
- do not widen into full workspace unification in the same pass

### Questions / Decisions

#### [x] `q1` Decide which migrated path should go first.

#### Suggestion
- locked direction:
- the first migrated path should be the graph-first flow:
  - graph selection from `Console`
  - graph selection from `Browser`
  - spaghetti visibility/open reflection
  - spaghetti active highlight

#### [x] `q2` Decide what reflection should be considered in scope first.

#### Suggestion
- locked direction:
- first reflection targets should be:
  - browser selection
  - spaghetti visibility/open state for migrated graph paths
  - spaghetti active-window highlight
  - viewer/editor target reflection where it already has a real backing seam

#### [x] `q3` Decide what should not be required in the first migration wave.

#### Suggestion
- locked direction:
- do not require:
  - every root domain
  - every node family
  - full browser redesign
  - broad transcript changes

#### [x] `q4` Decide what counts as truly migrated.

#### Suggestion
- locked direction:
- a path is only truly migrated when:
  - different surfaces can produce the same outcome through the same canonical intent
  - reflection reads shared truth
  - panel-local sync glue is no longer the reason the path works

#### [x] `q5` Decide when staged-console choice assist should land.

#### Suggestion
- locked direction:
- do not block `5.1F2` on staged-console choice assist
- finish the canonical intent layer first
- treat staged-console choice assist as a `5.1F3`-adjacent surface refinement that can land once the graph-first path is already migrating through shared truth
- this keeps:
  - `5.1F2` focused on canonical intent definition
  - `5.1F3` focused on visible surface behavior and reflection
- the assist should improve staged-node selection without becoming the reason the underlying path works

#### [x] `q6` Decide what the first migrated proof should visibly show.

#### Suggestion
- locked direction:
- the first migrated proof should visibly show:
  - browser graph selection reflecting the shared target
  - spaghetti opening/highlighting from the same shared graph-first outcome
  - graph-node selection reflecting in browser + spaghetti from the same shared target
- the user should be able to see that the surfaces are synced because of shared truth, not because each panel is manually poking the others

#### [x] `q7` Decide which local glue is allowed to remain temporarily.

#### Suggestion
- locked direction:
- local glue may remain temporarily only when:
  - it is outside the migrated graph-first path
  - or it serves a purely local presentation responsibility
- migrated graph-first reflection should not keep separate panel-local sync code once the shared truth is already available

#### [x] `q8` Decide what should count as success for `5.1F3`.

#### Suggestion
- locked direction:
- `5.1F3` is complete when:
  - the graph-first path visibly reflects shared workspace truth across browser and spaghetti
  - shared graph/node selection no longer depends on panel-local sync glue for the migrated paths
  - spaghetti open/highlight behavior is driven through the shared outcome path
  - the intent seam from `5.1F2` did not need redesign during migration

### Implementation Spec

Purpose:
- make the first real surfaces render from shared workspace truth instead of panel-local sync glue

#### Main Decision

The main decision in `5.1F3` is:
- which visible surface paths should now trust the shared workspace-selection seam and canonical intents instead of local synchronization?

Locked answer:
- start with the graph-first path
- migrate only enough visible reflection to prove the shared model is real

#### First Implementation Cut

The first implementation cut should be:
- graph selection from console and browser
- graph-node selection where the current shared target already exists
- spaghetti visibility/highlight reflection for those migrated paths

First visible outcomes to prove:
- selecting a graph from console highlights/opens spaghetti and selects the same graph in browser
- selecting a graph from browser produces the same spaghetti/open/highlight outcome
- selecting a graph node through the migrated graph-first flow reflects the same selected node in browser and spaghetti

Important rule:
- do not broaden the first cut into:
  - every browser row type
  - every node family
  - every viewer highlight mode
  - every detached/floating surface case
  unless the migrated graph-first path truly needs it

Owned here:
- graph selection from `Console`
- graph selection from `Browser`
- spaghetti visibility/open-state reflection for migrated paths
- spaghetti active-window highlight from shared `activeSurface`
- first shared selected-target reflection in browser/editor/viewer where relevant

Likely first migrated surfaces:
- `ConsoleDock`
- `BrowserPanel`
- `AppShell`
- existing browser/spaghetti selection/highlight read paths

Likely responsibilities:
- canonical seams from `5.1F1-F2`:
  - stay the source of shared truth and shared outcomes
- migrated surfaces:
  - read shared target/active-surface truth
  - stop re-implementing migrated graph-first sync behavior locally
- remaining local UI:
  - keep presentation-only details that do not compete with shared truth

#### First Migration Steps

`5.1F3` should likely be completed in this order:

1. identify the graph-first browser/spaghetti reflection paths already using shared truth only partially
2. migrate browser graph selection to read/write the shared target cleanly
3. migrate spaghetti open/highlight reflection to read shared graph-first outcomes cleanly
4. migrate graph-node reflection for the same narrow path
5. remove only the local sync glue that the migrated path truly replaced
6. verify the same visible result from:
  - console path
  - browser path
7. stop before expanding into broader workspace reflection work

#### Hard Rules

- do not reopen the canonical intent design from `5.1F2`
- do not migrate every browser/content/reference row type in the same cut
- do not turn `5.1F3` into a transcript redesign or command-language phase
- do not keep migrated graph-first reflection working through duplicated panel-local state once the shared target already exists

Not owned here:
- every domain family
- full workspace-wide UI unification
- transcript redesign
- full viewer reflection redesign
- browser hierarchy redesign beyond the migrated graph-first path

Planned console-surface refinement after the first migrated graph path is stable:
- staged choice assist in the console input
- prefill the current input with the first valid staged choice where appropriate
- allow `ArrowUp` / `ArrowDown` to cycle sibling staged choices
- visually highlight the currently targeted staged choice in the console prompt/summary area
- keep free typing available:
  - arrow cycling should help selection
  - it should not replace normal token entry

Acceptance shape:
- the same graph selection outcome works from console and browser
- migrated surface reflection reads shared truth
- panel-local selection glue is reduced for the migrated graph-first paths
- graph-node reflection for the first migrated path reads the shared target instead of duplicated local sync state
- `5.1F4` can harden and widen the model without redesigning the migrated graph-first contract

## [x] `5.1F4` Hardening And Expansion

### Summary

`5.1F4` should harden the canonical workspace-selection model after the first migrated paths are working, then extend it to more root domains and deeper authoring branches.

This is the phase that should turn the graph-first proof into a reusable pattern.

It should:
- lock regression coverage around the seams introduced in `5.1F1-F3`
- remove leftover migrated-path glue where the shared seam already covers the outcome
- widen the model to the next root domains without redesigning the underlying selection/intent contract

It should not:
- reopen the canonical seam design
- fold back into input-routing work from `4.1J`
- turn into broad shell placement or visual polish work

#### Questions / Decisions

##### [x] `q1` Decide what hardening should focus on first.

##### Suggestion
- locked direction:
- hardening should focus on:
  - regression coverage for shared selection truth
  - regression coverage for canonical-intent behavior
  - removal of leftover migrated-path bridge glue where safe

##### [x] `q2` Decide which domains should expand next.

##### Suggestion
- locked direction:
- after the graph-first proof, the next root domains should be:
  - `Reference`
  - `Assembly`
- later node-family expansion should follow only after those root-domain paths are honest

##### [x] `q3` Decide what should stay out of expansion.

##### Suggestion
- locked direction:
- keep these out:
  - unrelated shell placement work
  - input-routing ownership work already handled by `4.1J`
  - broad app-wide UI restyling

##### [x] `q4` Decide what the stop condition should be.

##### Suggestion
- locked direction:
- stop when:
  - migrated paths no longer depend on one-off cross-surface glue
  - the canonical seam can absorb the next root domain without redesign
  - regression coverage protects the shared selection and intent contract

### Implementation Spec

Purpose:
- stabilize the canonical seam and expand it beyond the first graph-first proof

#### Main Decision

The main decision in `5.1F4` is:
- how far should the team widen the canonical workspace-selection model before stopping and hardening it?

Locked answer:
- harden the graph-first contract first
- then widen the same contract to the next root domains:
  - `Reference`
  - `Assembly`
- stop before widening into every node family or every viewer/browser behavior

#### First Hardening Cut

The first hardening cut should be:
- graph-first regression coverage
- removal of leftover graph-first bridge glue where the canonical seam already owns the outcome
- reference and assembly planning hooks only where the same seam can absorb them without redesign

First concrete outcomes to prove:
- graph selection stays consistent across console, browser, and spaghetti under continued edits
- graph-node reflection keeps reading shared target truth
- spaghetti/browser active-state reflection stays driven by shared `activeSurface`
- the next root-domain path can plug into the same seam shape instead of creating a second coordination model

Important rule:
- do not widen expansion faster than hardening
- if a new root-domain path requires seam redesign, stop and fix the seam before expanding further

Owned here:
- regression coverage for shared workspace-selection and intent behavior
- cleanup of leftover bridge logic in migrated paths
- extension to additional root domains:
- `Reference`
- `Assembly`
- later extension to more node-family branches as needed

Likely first hardening/expansion surfaces:
- `ConsoleDock`
- `BrowserPanel`
- `AppShell`
- shared workspace seams in:
  - `useAppStore`
  - `workspaceIntents`

Likely responsibilities:
- canonical seams:
  - remain the source of selection truth and shared outcomes
- migrated surfaces:
  - shed leftover one-off graph-first glue where safe
  - adopt the same canonical verbs for the next root domains
- tests:
  - lock the current contract before expansion continues

#### First Implementation Steps

`5.1F4` should likely be completed in this order:

1. identify leftover migrated graph-first glue still surviving outside the canonical seam
2. remove or reduce that glue one narrow path at a time
3. add regression coverage around:
  - shared `selectedTarget`
  - shared `activeSurface`
  - canonical graph-first intents
4. prove the same seam shape can absorb `Reference`
5. prove the same seam shape can absorb `Assembly`
6. stop before widening into deeper node-family branches unless the root-domain expansion is already honest

#### Hard Rules

- do not redesign `workspaceSelection` unless a real contradiction appears
- do not create root-domain-specific intent systems that bypass the canonical seam
- do not widen into every node family in the same pass
- do not turn `5.1F4` into a browser redesign, transcript redesign, or shell-mode redesign
- do not keep migrated graph-first behavior alive through duplicate fallback glue once tests prove the seam already owns it

Not owned here:
- unrelated shell placement work already covered by other `5.1` phases
- input-routing ownership, already covered by `4.1J`
- broad browser hierarchy redesign
- full viewer-highlight redesign
- unrelated command-language polish

Acceptance shape:
- migrated paths no longer depend on one-off cross-surface glue
- canonical workspace truth remains stable under continued feature growth
- additional root domains can adopt the same seam without redesigning it
- graph-first regressions are covered tightly enough that later expansion cannot quietly fork the model
- `Reference` and `Assembly` have a clear path onto the canonical seam without inventing parallel coordination systems

## Surface-Driven Console Context Handoff
### Summary

Yes, this makes sense.

The cleaner long-term model is:
- surface interaction should be able to hand the `Console` into the nearest valid staged scope
- but a click should not silently execute deeper commands
- the console should become context-aware, not auto-authoring

Example:
- user clicks the `Spaghetti Editor`
- active graph is `graph_[1]`
- console should be forwarded into:
  - `Graph > graph_[1]`
- then the next graph-scope commands should be ready immediately

This same pattern should later work for other root domains:
- `Reference`
- `Assembly`

Important rule:
- clicking a surface should move the console to the nearest stable command scope
- it should not auto-run a child command unless the user explicitly submits that next command

### Vision

The full vision is:
- `Console` is not only a place where commands start
- it is also the place where the current workspace context becomes command-ready

That means:
- command entry can begin from typing
- or it can begin from workspace focus/selection

If the user clicks into a surface and the app already knows:
- active surface
- active graph
- selected target

then the console should be able to say:
- "you are here now"
- "these are the next valid commands"

That should make the command system feel less separate from the workspace.

### Handoff Shape

The clean handoff order should be:

1. determine active root domain
- `Graph`
- `Reference`
- `Assembly`

2. determine nearest stable staged scope
- active graph document
- selected node/object/reference if that target already maps cleanly to a known command scope

3. move the console into that staged scope
- update breadcrumb/session
- show next valid commands
- do not auto-run one of them

4. preserve explicit user intent for deeper steps
- user still chooses:
  - `Sketch`
  - `Extrude`
  - `Output Preview`
  - etc.

### First Intended Behavior

First good version:

- click floating or split `Spaghetti Editor`
  - if active graph is known:
    - console enters `Graph > graph_[n]`

- click browser graph row
  - console enters `Graph > graph_[n]`

- click browser graph node row
  - if that node maps to a known graph-scope family:
    - console enters the corresponding staged node scope
  - otherwise:
    - console stops at graph scope with the node selected

Important rule:
- start with graph-first handoff
- do not try to hand every possible browser row into a console scope in the first cut

### Questions / Decisions

#### [ ] `q1` Decide whether surface clicks should automatically move the console into a staged scope.

#### Suggestion
- locked direction:
- yes, when the clicked/focused surface maps cleanly to a known command domain
- this should feel like context handoff, not implicit command execution

#### [ ] `q2` Decide what the nearest stable scope should be for a `Spaghetti Editor` click.

#### Suggestion
- locked direction:
- clicking the `Spaghetti Editor` should first hand off to:
  - `Graph > graph_[n]`
- not deeper by default
- deeper node-family scopes should require either:
  - an already selected target with a clean mapping
  - or an explicit next command from the user

#### [ ] `q3` Decide whether selecting a graph node should enter a node-family scope automatically.

#### Suggestion
- locked direction:
- only when that node clearly belongs to a known command family
- examples:
  - `Sketch`
  - later `Extrude`
  - later `Output Preview`
- if the mapping is unclear, stay at graph scope and keep the node selected

#### [ ] `q4` Decide whether surface-driven handoff may overwrite current console input.

#### Suggestion
- locked direction:
- no, not when the user is actively typing
- if the console has draft input, preserve it
- surface-driven handoff should update staged context/prompt only when:
  - console is idle
  - or the current session can be safely retargeted

#### [ ] `q5` Decide how the console should report the handoff.

#### Suggestion
- locked direction:
- publish a short `Selection` or `App` line such as:
  - `Context: Graph > graph_[1]`
- do not spam repeated messages when the same scope is already active

#### [ ] `q6` Decide how this should relate to `activeSurface` and `selectedTarget`.

#### Suggestion
- locked direction:
- `activeSurface` chooses the foreground domain
- `selectedTarget` chooses the nearest specific scope inside that domain
- console handoff should resolve from those shared seams instead of panel-local guesses

### Implementation Shape

This should likely become:
- one console-context handoff seam above `ConsoleDock`
- driven by:
  - shared `activeSurface`
  - shared `selectedTarget`
  - current staged session state

Likely first implementation cut:
- graph-only
- spaghetti click -> `Graph > graph_[n]`
- browser graph click -> `Graph > graph_[n]`
- browser graph-node click -> graph scope or mapped node-family scope

Important rule:
- this is not a replacement for typed commands
- it is a shortcut into the correct staged context

### Success Shape

This vision is working when:
- clicking into `Spaghetti Editor` with `graph_[1]` active makes graph commands immediately available
- browser and spaghetti can both move the console into the same graph scope
- the console feels like it is attached to the workspace state
- but deeper authoring actions still require explicit user submission

## UI / Console Sync Vision
### Summary

The UI workspace and the `Console` command line should stay visibly synchronized.

This means:
- if the user clicks into a surface, the console should say so
- if the user selects a target, the console should say so
- the console should then move into the matching staged command scope
- the next valid commands for that scope should become visible immediately

This should work the same way from:
- `Spaghetti Editor`
- `Browser`

Important rule:
- UI interaction should update command context
- UI interaction should not silently execute the next deeper command

### Core Behavior

The intended behavior is:

- click `Spaghetti Editor`
  - console reports that `Spaghetti` is active
  - console enters the active graph scope
  - example:
    - `Graph > graph_[1]`

- click off `Spaghetti Editor`
  - console reports that the editor is no longer active
  - console returns to the nearest parent/root scope

- click `Sketch` node in `Spaghetti`
  - console reports the sketch selection
  - console enters the sketch node scope
  - sketch-local next commands become visible

- click `Sketch` node in `Browser`
  - same console result
  - same staged scope
  - same next commands

This should not depend on which surface the user used.

### Shared-State Rule

This sync should resolve from shared workspace truth:

- `activeSurface`
  - which domain is foregrounded
- `selectedTarget`
  - which specific target is selected

The console should derive its staged scope from those seams instead of from panel-local assumptions.

Important rule:
- `Browser` and `Spaghetti` should not create different command states for the same selected target

### Example Outcomes

Examples:

- user clicks `Spaghetti`
  - console:
    - reports `Spaghetti` active
    - shows graph-scope choices

- user clicks `Sketch`
  - console:
    - reports sketch selected
    - shows sketch-scope choices such as:
      - `Sketch Plane`
      - `Sketch Draw`
      - `Back`

- user clicks away to no active authoring surface
  - console:
    - reports context change
    - returns to root-ready state

### Main Rule

The best mental model is:

- the workspace chooses context
- the console reflects context
- the user still explicitly chooses the next command

So:
- clicking `Sketch` should enter `Sketch`
- but it should not auto-run `Sketch Plane` or `Sketch Draw`

That keeps the system synchronized without making clicks feel like hidden command execution.

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

### [4.1N] [x] - Feature Session Prompt Descriptor Follow-On

The same prefill behavior should not remain staged-navigation-only forever.

Active feature sessions that expose a small finite command set should be able to publish one shared prompt descriptor so the console can:
- render the prompt text from one source
- prefill the input from the first suggested choice
- highlight the current assisted choice
- avoid per-feature manual input seeding

Recommended first prompt descriptor shape:
- `label`
  - the active command surface name such as `Sketch Plane` or `Sketch Draw`
- `choices`
  - the currently valid command choices for that surface
- `prefill`
  - the first suggested choice token when assisted input should begin aligned to a choice

First intended sketch examples:
- `Sketch Plane`
  - `choices: [XY, XZ, YZ]`
  - `prefill: XY`
- `Sketch Draw`
  - `choices: [Line, PLine, X]`
  - `prefill: Line`

Important rule:
- do not keep hardcoding prompt text and input seeding separately in each feature path
- feature sessions and staged navigation should eventually feed the same console-assisted prompt model

This should be implemented as one shared console seam:
- staged navigation may continue to produce prompt/choice/prefill state
- active feature sessions may also produce prompt/choice/prefill state
- the console should consume that shared shape instead of remembering feature-specific prefill logic

### Questions / Decisions

#### [x] `q1` Decide whether feature-session prompt assist should reuse the staged-choice model or invent a second assist system.

##### Suggestion
- locked direction:
- reuse one shared console-assisted prompt shape
- do not invent a second per-feature assist system beside staged navigation

#### [x] `q2` Decide the first feature-session consumers.

##### Suggestion
- locked direction:
- first consumers should be:
  - `Sketch Plane`
  - `Sketch Draw`
- they already expose small finite command sets and are the current feature paths most likely to drift into hand-seeded prompt logic

#### [x] `q3` Decide whether this phase should redesign non-staged freeform command entry.

##### Suggestion
- locked direction:
- no
- keep this phase focused on shared prompt/choice/prefill state for constrained active sessions

### Implementation Spec

Purpose:
- extend the existing console-assisted choice model beyond staged navigation so active feature sessions can publish prompt, choice, and prefill state through one shared seam

#### Current Code-To-Target Mapping

- current staged-choice assist seam already exists in:
  - `useConsoleStore`
  - `stagedNavigationSession`
  - `cycleStagedChoice(...)`
  - `seedInputText(...)`
- current feature-session prompt seam is still fragmented:
  - `Sketch Plane`
    - prompt text is currently pushed as hardcoded transcript lines such as:
      - `Sketch Plane > [XY, XZ, YZ]`
  - `Sketch Draw`
    - prompt text is currently built in the sketch store and pushed as transcript text such as:
      - `Sketch Draw > [Line, PLine, X]`
- current gap:
  - feature sessions can show prompt text
  - but they do not yet publish a shared assisted prompt descriptor that the console can use for:
    - input prefill
    - targeted choice highlight
    - future arrow cycling

#### Scope

Owned here:
- one shared console prompt-descriptor seam for constrained active sessions
- a shared descriptor shape that can be produced by:
  - staged navigation
  - feature sessions
- console-side consumption of that shape for:
  - prompt rendering
  - input prefill
  - assisted current-choice tracking
- first feature-session adoption for:
  - `Sketch Plane`
  - `Sketch Draw`

Not owned here:
- broad autocomplete or search behavior
- freeform command redesign
- full toolbar / console command unification
- larger transcript-history redesign
- whole-app session modeling outside the console prompt seam

#### Recommended First Data Shape

The first prompt descriptor should stay narrow.

Recommended shape:
- `label`
  - active prompt surface name
- `choices`
  - current finite valid choices
- `prefill`
  - first suggested token for assisted input alignment

Example first reads:
- `Sketch Plane`
  - `choices: [XY, XZ, YZ]`
  - `prefill: XY`
- `Sketch Draw`
  - `choices: [Line, PLine, X]`
  - `prefill: Line`

Important rule:
- keep this as a console prompt-assist descriptor
- do not broaden it into a second feature-command state model

#### First Implementation Cut

The first implementation cut should stay narrow:
- staged navigation keeps its current behavior
- add one shared prompt-descriptor seam the console can read from either:
  - staged navigation
  - active feature sessions
- migrate only the first two active feature-session families:
  - `Sketch Plane`
  - `Sketch Draw`

First behavior to make real:
- when a constrained active feature session starts, the console should be able to:
  - render the prompt from the descriptor
  - prefill the input from the descriptor
  - treat the first choice as the initial assisted target
- feature sessions should no longer need to remember both:
  - prompt transcript copy
  - manual input seeding

#### Ownership Rule

Ownership should stay with the console seam, not feature-local glue.

Recommended read:
- active feature sessions publish descriptor state
- console store owns:
  - current assisted input text
  - targeted choice tracking
  - manual-override behavior
- console UI renders from that state

Avoid:
- each feature calling ad hoc input seeding directly
- each feature inventing its own choice-cycling logic
- transcript-only prompt copy being treated as the source of truth for assisted choice state

#### Hard Rules

- do not create one assist model for staged navigation and a separate assist model for feature sessions
- do not require feature sessions to remember to seed input manually
- do not widen this phase into global autocomplete/search UX
- do not make feature-session assist the reason command validity works
- do not alter unconstrained flat command behavior in the same pass unless required by the shared prompt seam

#### Acceptance Shape

- a reader can point to one shared console prompt-descriptor seam in code
- staged navigation and active feature sessions can both publish prompt/choice/prefill state through that seam
- `Sketch Plane` and `Sketch Draw` no longer rely on separate manual input seeding to get assisted first-choice behavior
- the console can render prompt text and prefill input from the same source for constrained sessions
- manual typing still overrides the assisted suggestion cleanly
- the change lands as one shared console-prompt refinement rather than a second feature-local assist system

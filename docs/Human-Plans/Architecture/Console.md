# Console

## Doc Header

### Doc History
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
### [x] `sketch` - alias: `s`
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
  - `Sketch Draw started`
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
- `[App] Sketch Draw started`

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

## Canonical Workspace Unification

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

##### [ ] `q4` Decide where the canonical workspace-selection state should live.

##### Suggestion
- it should live in a shared app/workspace seam
- not inside `ConsoleDock`
- not inside `BrowserPanel`
- not inside `SpaghettiPanel`
- likely in a shared store seam adjacent to existing app/spaghetti state

##### [ ] `q5` Decide what counts as a canonical intent.

##### Suggestion
- first canonical intents should include:
  - open graph document
  - focus editor viewport
  - select node
  - start sketch plane
  - start sketch draw
  - activate surface
- if two surfaces can produce the same outcome, they should call the same intent

##### [ ] `q6` Decide which current behaviors are only bridges and should later become canonical.

##### Suggestion
- examples:
  - `g` opening/focusing spaghetti editor
  - browser row clicks focusing editor viewport
  - console selecting graph/sketch scope
  - floating window highlight changes
- these are useful today, but they should eventually become shared-state effects rather than one-off bridges

##### [ ] `q7` Decide what should remain local component state.

##### Suggestion
- keep these local unless there is a proven need to share them:
  - menu open/closed
  - hover state
  - popover visibility
  - cosmetic tray expansion
  - appearance tuning values that do not affect cross-surface coordination

##### [ ] `q8` Decide what success looks like.

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

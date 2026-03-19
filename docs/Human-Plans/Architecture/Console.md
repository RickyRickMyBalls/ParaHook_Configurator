# Console

## Doc Header

### Doc History
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

- should plain printable keys always open command capture, or should that require an explicit activator like `/`?
- should the collapsed row span the full app width, or the main viewport width only?
- should the expanded console dock upward from the bottom bar, or collapse into a side/bottom drawer depending on shell mode?
- how much history should remain visible in the collapsed row?
- should layer visibility be global app prefs, or session-local state?

Current recommendation:
- keep the row app-global
- allow explicit activation for free-form typing
- keep single-key shortcuts working when no real text field owns focus

### Short Version

The right mental model is:
- ParaHook needs one app-wide place that says what command is active, what input is expected next, and what just happened
- that place should be the `Console`
- it should have a collapsed 1-row mode and an expanded resizable mode
- it should support internal layers for commands, shortcuts, worker/app notes, params, and diagnostics
- it should centralize command routing without stealing real feature ownership
- it should coexist with the current read-only `Debug Inspector`, not replace it


# ParaHook Console Commands:

# `s` > [Select]
## `SELECT` Choose target [Graph, Node, Reference, Viewport]:
## `SELECT > GRAPH` Choose graph [1, 2, 3, List]:
### `SELECT > GRAPH > graph_[1]` Choose next action [Nodes, References, Open, Build]:
#### `SELECT > GRAPH > graph_[1] > NODES` Choose node type [Sketches]:
##### `SELECT > GRAPH > graph_[1] > NODES > SKETCHES` Choose sketch [1, 2, 3, List]:
###### `SELECT > GRAPH > graph_[1] > NODES > SKETCHES > sketch_[1]` Choose item [SketchPlane, SketchProfiles, Open, Inspect]:
####### `SELECT > GRAPH > graph_[1] > NODES > SKETCHES > sketch_[1] > SKETCHPLANE` Choose item [Origin, Plane, Rotation]:
######## `SELECT > GRAPH > graph_[1] > NODES > SKETCHES > sketch_[1] > SKETCHPLANE > ORIGIN` Current [x, y, z] Options [Change]:
######## `SELECT > GRAPH > graph_[1] > NODES > SKETCHES > sketch_[1] > SKETCHPLANE > PLANE` Current [XY] Options [Change]:
######### `SELECT > GRAPH > graph_[1] > NODES > SKETCHES > sketch_[1] > SKETCHPLANE > PLANE > CHANGE` Choose plane [XY, XZ, YZ]:
######## `SELECT > GRAPH > graph_[1] > NODES > SKETCHES > sketch_[1] > SKETCHPLANE > ROTATION` Current [x, y, z] Options [Change]:
## `SELECT > NODE` Choose node [1, 2, 3, List]:
## `SELECT > REFERENCE` Choose reference [1, 2, 3, List]:
## `SELECT > VIEWPORT` Choose viewport [1, 2, Active]:

# `o` > [Open]
## `OPEN` Choose target [Graph, Node, Reference, Viewport]:
## `OPEN > GRAPH` Choose graph [1, 2, Recent]:
## `OPEN > NODE` Choose node [1, 2, Selected]:
## `OPEN > REFERENCE` Choose reference [1, 2, Selected]:
## `OPEN > VIEWPORT` Choose viewport [1, 2, Active]:

# `a` > [Add]
## `ADD` Choose target [Graph, Node, Reference, Sketch]:
## `ADD > GRAPH` Choose option [New, Import]:
## `ADD > NODE` Choose node type [Sketch, Part, Ref]:
## `ADD > REFERENCE` Choose option [New, Link]:
## `ADD > SKETCH` Choose item [Line, Polyline, Rectangle, Circle]:

# `f` > [Find]
## `FIND` Choose target [Graph, Node, Reference, Sketch]:
## `FIND > GRAPH` Find graph by [Name, Id, Tag]:
## `FIND > NODE` Find node by [Name, Id, Type]:
## `FIND > REFERENCE` Find reference by [Name, Id]:
## `FIND > SKETCH` Find sketch item [Line, Circle, Profile]:

# `build` > [Build]
## `BUILD` Choose target [Graph, All]:
## `BUILD > GRAPH` Choose graph [Selected, Active]:
## `BUILD > ALL` Choose option [Now]:

# `save` > [Save]
## `SAVE` Choose target [Project, Workspace]:
## `SAVE > PROJECT` Choose option [Current]:
## `SAVE > WORKSPACE` Choose option [Current]:

# `?` > [Help]
## `HELP` Show the current prompt and valid options

# `x` > [Cancel]
## `CANCEL` Cancel the current command or picker

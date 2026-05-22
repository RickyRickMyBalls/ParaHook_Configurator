# Build Path Vision

## Doc Header

### Doc History
2. 2026-05-22 18:45:37: Added the Build Path presentation direction so the default surface is a clean Model Viewport icon timeline with no content label, while split/tiled workspace mode keeps normal Console-like titlebar chrome.
1. 2026-05-22 17:51:51: Added this dedicated `Build Path` workspace vision doc so graph-authored CAD/build history, master scrub, branch-local scrub lanes, and the boundary against canonical Edit History undo/redo have one stable planning home.

### Purpose

This doc captures the long-range vision for the `Build Path` workspace in ParaHook.

Use it to answer:
- what `Build Path` is supposed to be
- how it differs from `Edit History`
- why it records accepted graph/node CAD build events across all graphs
- how master linear scrub and parallel branch scrub should relate
- why Build Path is a derived reader over authored graph truth instead of a second graph owner

Do not use it for:
- one implementation checklist
- final worker checkpoint schema
- replacing `Edit History` as the canonical Ctrl+Z owner
- making Build Path own Spaghetti graph params, wires, nodes, or geometry truth
- pretending restore, branch, and comparison actions are part of the first scrub surface

### Relationship To Other Docs

- `Build-Path-Gen1-Index.md`
  - active Generation 1 planning index
  - routes this vision into first family phases

- `Future/Build-Path-1 - Accepted Graph Event Timeline Foundation.md`
  - first implementation-planning surface
  - starts with accepted graph command events and a master derived timeline

- `../Spaghetti-Editor-Arch/Future/Spaghetti-Editor 8 - Viewport Command Authoring And Build Path Bridge.md`
  - current bridge from viewport/console/tool commands into accepted Spaghetti graph command summaries

- `../../Edit-History/Edit-History-Vision.md`
  - workspace reader vision for canonical undo/redo visibility

- `../../../Edit-History/Edit-History-Vision.md`
  - broader architecture family for canonical app history, checkpoints, restore, and later comparison boundaries

## Doc Body

### Why This Doc Exists

`Build Path` needs its own workspace-family home because it is not just a Spaghetti Editor feature and it is not the same thing as Edit History.

The user-facing idea is:
- ParaHook records accepted CAD/build events made through graph-authored commands
- those events form a readable construction timeline
- the user can scrub backward and forward through construction states
- the timeline understands what is linear, what is parallel, and where work merges
- branch-heavy graphs can expose multiple local scrub lanes without losing one master story

This is a graph/build history reader, not the global undo stack.

### Short Version

`Build Path` is the timeline of accepted graph-authored CAD/build events.

It should show:
- one `Master Timeline` containing every accepted build event in linear accepted order
- one `Master Scrub` that moves through the global construction story
- derived `Branch Timelines` for parallel graph lanes
- branch-local scrub controls for independent parallel construction lanes
- checkpoints where master and branch timelines meet accepted restorable build states

The key feeling is:
- "I can scrub the model's build story without invoking Ctrl+Z."

### Workspace Presentation Direction

Build Path is a real workspace surface, but its first useful presentation should be compact and quiet.

Default presentation:
- lives in the `Model Viewport` as a viewport-attached strip
- can dock to the top or bottom of the viewport
- when docked bottom, sits above `Console`
- does not show a visible `Build Path` content label
- in linear mode, reads as a string of CAD/build icons representing accepted nodes/events
- uses text only for hover, selected detail, expanded/inspector states, accessibility labels, and split/tiled chrome

Windowed or split/tiled presentation:
- can open as a normal workspace window
- uses shared workspace chrome and a titlebar like `Console`
- may show `Build Path` in the titlebar because that is pane chrome, not timeline content
- keeps the timeline body icon-first and label-light

The important distinction:
- the compact timeline body should not become a labeled panel
- the workspace shell can still identify itself when the surface is split, tiled, windowed, docked, or managed alongside other panes

### Relationship To Edit History

`Edit History` owns canonical app undo/redo.

That means:
- Ctrl+Z and Redo are Edit History behavior
- Edit History accounts for the whole app, not only build events
- Edit History can include workspace actions, settings changes, object transforms, authored graph changes, and other undoable app mutations

`Build Path` is different.

Build Path should:
- read accepted graph-authored CAD/build events
- expose construction playback and inspection
- keep scrub movement as navigation state by default
- avoid creating undo entries just because the user scrubs
- avoid mutating the authored graph head just because the user views an older build point

Hard rule:
- viewing an old Build Path point is not the same action as undoing to that point.

### Relationship To Spaghetti

`Spaghetti Editor` owns explicit graph authoring.

Build Path should not replace it.

Healthy relationship:
- Spaghetti owns graph truth:
  - nodes
  - wires
  - params
  - graph documents
  - graph-native command sessions
- Build Path owns derived build-history reading:
  - accepted build events
  - master timeline projection
  - branch timeline projection
  - scrub navigation
  - row/card explanation
  - later restore, branch, and compare actions

Build Path can highlight related Spaghetti nodes and can hand the user back into Spaghetti for deeper editing, but it should not become a shadow graph editor.

### Master Timeline

The `Master Timeline` is the linear accepted order of build events.

It should record everything relevant to the model's graph-authored construction story, even when the underlying graph has parallel branches.

Examples:
- Sketch created
- Sketch profile accepted
- Extrude accepted
- OutputPreview publication accepted
- later CAD commands such as Loft, Fillet, Chamfer, Pattern, Mirror, or Boolean accepted

The master timeline is the simplest scrub story:
- start of model
- accepted event 1
- accepted event 2
- accepted event 3
- present authored build head

### Branch Timelines

The graph can be parallel even when accepted events are recorded in a linear sequence.

Build Path should derive branch timelines from graph dependency structure:
- independent sketches can form separate branches
- multiple extrudes can belong to separate lanes
- merge operations can join lanes
- output publication can act as a visible convergence point

Branch timelines should remain projections over the same accepted event model.

Important rule:
- branch mode must not create a second history source.

### Master Scrub And Branch Scrub

The `Master Scrub` is the main global playhead.

It moves through the master timeline and asks:
- what accepted build state should the viewport show at this global step?
- which build events are active, future, suppressed, or checkpointed?
- which branch lanes are visible at this point?

Branch scrub controls are local playheads over derived branch timelines.

They should let the user inspect parallel work without losing the master story.

Suggested first model:
- master scrub owns the global construction position
- branch scrubs are local inspection controls inside the active master range
- branch scrub positions are anchored to master checkpoints or merge points
- branch scrub movement remains view-only unless the user later chooses an explicit restore/branch action

### Checkpoints

A checkpoint is a stable accepted build-state boundary.

Plain-language meaning:
- the system can show or restore that accepted build point without pretending it is just a vague visual guess

Checkpoints may eventually link to:
- accepted build result ids
- worker/cache handles
- graph event ids
- branch merge points
- master timeline positions

For Generation 1, checkpoints can begin as model/read markers before the full worker cache strategy exists.

### Human Level Goals

Keep these as the explicit human-level wishlist items for `Build Path`:

- [ ] `Build-Path-Gen1-HLG-1. Build Path should have its own dedicated workspace-family folder with a vision, generation index, and future implementation plan.`
- [ ] `Build-Path-Gen1-HLG-2. Build Path should record accepted CAD/build events made by nodes across all graphs.`
- [ ] `Build-Path-Gen1-HLG-3. Build Path should let the user scrub backward and forward through build time without acting like Ctrl+Z.`
- [ ] `Build-Path-Gen1-HLG-4. Build Path should keep one master linear timeline even when the graph contains parallel construction work.`
- [ ] `Build-Path-Gen1-HLG-5. Build Path should understand which build events are linear, parallel, branch-local, or merge/checkpoint events.`
- [ ] `Build-Path-Gen1-HLG-6. Build Path should support a parallel mode where branch-local timelines can be scrubbed independently while still belonging to the same master build story.`
- [ ] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [ ] `Build-Path-Gen1-HLG-8. Build Path should eventually support explicit restore, branch-from-here, compare, or pin actions only after view-only scrub is trustworthy.`
- [ ] `Build-Path-Gen1-HLG-9. Build Path should default to a clean Model Viewport icon-strip presentation with no content label, while split/tiled/windowed mode keeps normal titlebar chrome like Console.`

### Build Path Generations

The first useful generation is `Generation 1`.

Generation index routing:
- `Generation 1` routes into `Build-Path-Gen1-Index.md`.
- later generations should get new generation indexes only when Build Path grows beyond the first event timeline and scrub foundation.

## [ ] Generation 1 - Graph Build Timeline And Scrub Foundation

### Generation 1 Summary

`Generation 1` creates the Build Path foundation:
- accepted graph build event model
- master linear timeline
- view-only master scrub
- branch detection
- branch-local scrub mode
- later explicit restore/branch action boundaries

The first generation should prove that Build Path can read graph-authored CAD/build history without becoming Edit History or Spaghetti.

### Generation 1 Vision Rails

The final `Generation 1` read is:
- every accepted graph-authored CAD/build command can become a Build Path event
- cancelled and transient sessions do not become Build Path history
- one master timeline can show accepted build order
- branch structure can be derived from dependencies
- the user can scrub the master timeline as inspection state
- branch mode can expose local timelines for parallel work
- explicit restore/branch actions remain separate from scrub navigation

### Owns

- Build Path workspace-family planning home
- accepted graph build event language
- master timeline direction
- branch timeline direction
- master scrub and branch scrub behavior rules
- view-only inspection boundary
- viewport-docked icon-strip presentation direction
- split/tiled titlebar chrome boundary
- first future implementation ladder

### Does Not Own

- canonical Ctrl+Z / Redo ownership
- Spaghetti graph authoring truth
- worker checkpoint/cache implementation details before their phase
- direct graph restructuring
- automatic restore or branch behavior during scrub
- final comparison UI before a live Build Path surface exists

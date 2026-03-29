# Master Spaghetti Index

## Doc Header

### Doc History
4. 2026-03-28: Corrected the umbrella source-doc pointers after a repo audit by treating this file as the live `Spaghetti-Editor-Arch` entry point, moving the older `Spaghetti-Editor-Explained.md` reference into archived-background context, and replacing the dead local `01.2 - Browser Workspace.md` pointer with the live `Browser` family index
3. 2026-03-25: Added the standalone future phase doc for `Master Spaghetti-1` under `Spaghetti-Editor-Arch/Future/`, turning the first smart-wiring umbrella phase into an implementation-ready planning surface grounded on the real current `SketchProfile -> Geometry/Extrude -> OutputPreview in:solid:<slotId>` path
2. 2026-03-25: Added the first explicit `Master Spaghetti` phase section, seeding a new umbrella `Smart Wiring` proving slice so cross-node canvas QoL behavior like sketch-wire-to-output auto-extrude insertion has one narrow workspace-level planning home without turning the whole doc into a mixed execution backlog
1. 2026-03-25: Created this umbrella index for `Spaghetti-Editor-Arch` so the folder has one clear entry-point doc that explains what `Master Spaghetti` owns, which subfamilies already have real phase ladders, and where deeper execution planning should live

### Purpose

This file is the umbrella index for the `Spaghetti-Editor-Arch` folder.

Use it to answer:
- what `Master Spaghetti` is supposed to be
- which docs under this folder are current source-of-truth docs
- which parts of the Spaghetti architecture already have real phase ladders
- which work should stay in umbrella docs versus move into subfamily docs

### Scope Note

This doc is intentionally an index and architecture map.

It is the right place for:
- folder-level orientation
- ownership boundaries between the main Spaghetti surfaces
- source-doc links
- current family status

It is not the right place for:
- detailed execution specs for sketch growth
- detailed execution specs for extrude growth
- node-family command backlogs
- browser-specific implementation phases

Those should stay in their dedicated family docs.

## Doc Body

### Short Version

`Master Spaghetti` is the umbrella architecture map for the Spaghetti workspace.

It should explain how the major pieces fit together, but it should not become the execution home for every concrete feature.

The real phase ladders now mostly live in subfamilies, especially:
- `Nodes`
- `Nodes/Sketch`
- `Nodes/Extrude`

### Current Role Of `Master Spaghetti`

Right now `Master Spaghetti` should be treated as:
- the folder entry point
- the current high-level architecture map
- the place that explains how graph documents, editor viewports, canvas, Browser, runtime, and viewer fit together

Right now it should not be treated as:
- the main execution backlog for node behavior
- the main execution backlog for sketch tooling
- the main execution backlog for extrude authoring

Important rule:
- if the work is about a specific node family, it should usually land in that node-family doc
- if the work is about how the whole Spaghetti workspace is structured, it can live here

### Main Architecture Layers

The current Spaghetti workspace is bigger than one floating node editor.

The main layers are:
- graph documents
- editor viewports
- graph canvas
- node registry and node families
- part-internal feature stack editing
- graph-local runtime state
- graph-owned published output state
- Browser workspace coordination
- shared viewer targeting and composition

### Current Source Docs For This Area

#### `Master Spaghetti`

Current role:
- umbrella architecture map
- current workspace-level mental model

Primary docs:
- this file
- `docs/Archive/Spaghetti-Editor-Explained.md`
  - archived background explainer, not the live family index

#### `Browser Workspace`

Current role:
- browser structure and browser-to-editor coordination inside the Spaghetti architecture area

Current source doc:
- `docs/Human-Plans/Architecture/Browser/Browser-Index.md`

#### `Nodes`

Current role:
- node-family planning umbrella
- node inventory
- shared `EWR` direction

Primary docs:
- `Nodes/Nodes-Index.md`
- `Nodes/Sketch/Sketch.md`
- `Nodes/Extrude/extrude-index.md`

### Current Family Status

#### [~] `Master Spaghetti`

Current read:
- this family is still mainly an umbrella architecture map
- it now has one first proving-slice phase for cross-node smart-wiring behavior
- it still does not have a deep standalone ladder like `Sketch`
- deeper feature planning should keep moving into subfamilies instead of bloating the umbrella doc

#### [~] `Nodes`

Current read:
- this is the deepest real planning tree under `Spaghetti-Editor-Arch`
- shared node structure and concrete geometry-node growth already live there

Current main tracks:
- shared `EWR` foundation
- `Sketch`
- `Extrude`

#### [~] `Sketch`

Current read:
- `Sketch` already has the most mature phase ladder in this folder
- most concrete sketch authoring, console, snap, and modify growth belongs there

#### [ ] `Extrude`

Current read:
- `Extrude` now has a real family doc
- it is still early and only at the first open phase
- concrete sketch-to-extrude authored behavior should land there instead of in `Master Spaghetti`

### Current Ownership Boundaries

#### Workspace-Level Ownership

`Master Spaghetti` should own:
- graph-document mental model
- editor viewport mental model
- canvas versus Browser versus viewer relationship
- graph-owned versus Browser-local versus project-owned truth boundaries

#### Node-Family Ownership

`Nodes` should own:
- node-family structure
- node inventory
- row-tree and wire contract direction

`Sketch` should own:
- sketch plane setup
- sketch draw authoring
- sketch command growth
- sketch browser/content follow-ons

`Extrude` should own:
- profile-to-body consumption rules
- extrude preview/runtime alignment
- extrude authoring follow-ons
- sketch-to-extrude authored workflow rules

### Placement Rule For New Work

Use this rule before creating or extending a phase:

- if the feature changes the whole Spaghetti workspace mental model, start here
- if the feature changes a specific node family's behavior, put it in that node family
- if the feature is mainly about Browser coordination, put it in the Browser family
- if the feature is mainly about canvas wiring behavior for a specific node family, prefer that node-family doc first unless the behavior is clearly generic across many node families

### Current Gap

The main current gap is not a missing node-family phase ladder.

The main gap is that `Master Spaghetti` still reads more like a useful explanation doc with one first proving slice than a mature family index with a deep shipped/open ladder.

That is acceptable for now as long as:
- the subfamilies keep carrying the real execution detail
- this doc stays clean and does not turn into a mixed backlog dump

### Suggested Maintenance Direction

The next useful cleanup direction for this folder is:
- keep `Master Spaghetti` as the clean umbrella entry point
- keep any `Master Spaghetti` phases limited to clearly cross-node workspace/canvas behavior
- keep `Nodes` as the main node-planning umbrella
- keep pushing concrete `Sketch` and `Extrude` execution work into their own family docs
- only give `Master Spaghetti` its own phase ladder later if truly workspace-level Spaghetti work starts accumulating again


## Phases

### [ ] Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass

Standalone phase doc:
- `Future/Master_Spaghetti_Phase Master Spaghetti-1 - Smart Wiring And Intent-Aware Auto-Insert First Pass.md`

#### Purpose

Add the first honest cross-node QoL wiring behavior to the Spaghetti canvas.

This phase should prove that the canvas can understand a clear authored intent, insert the missing intermediate node automatically, and complete the expected wiring path instead of forcing the user to spawn and place every bridge node manually.

#### Owns

- the first workspace-level `smart wiring` behavior in the graph canvas
- interpreting one narrow drag/drop intent at wire-connect time
- automatic insertion of one intermediate geometry node when the source and target imply a missing feature step
- automatic wiring of the inserted node so the final graph matches the intended authored flow
- first user-facing rules for when smart insertion should happen versus when the drag should just fail or stay manual

#### Does Not Own

- transform-aware extrude runtime or preview alignment
- the deeper `Extrude` profile contract
- generic node recommendation systems
- broad AI-style graph authoring
- every later QoL auto-fix in the same phase

#### First Proving Slice

The first proving slice is the feature discussed here:

- when the user drags a sketch wire to an output node
- and that output path expects a body/solid result instead of a sketch profile
- the canvas should automatically:
  - create one `Geometry/Extrude` node
  - wire the sketch output into the new extrude input
  - wire the new extrude output into the target output node

The intended authored result is:

- `SketchProfile`
  - into `Geometry/Extrude`
- `Geometry/Extrude`
  - into the output-facing target slot

Important rule:
- this first phase is not "auto-build any missing chain"
- it is one narrow, deterministic authored shortcut for the most obvious sketch-to-solid bridge

#### Why This Lives Here

This phase belongs in `Master Spaghetti` because it is not only an `Extrude` feature.

It is the first umbrella rule for:
- canvas drag intent
- graph mutation at drop time
- automatic intermediate-node insertion

`Extrude` still owns the deeper body/profile contract, but `Master Spaghetti` owns the first workspace rule that the canvas may insert a missing node when the user's wiring intent is obvious.

#### Hard Rules

- only trigger auto-insert when the source/target pairing clearly implies one missing `Sketch -> Extrude -> Output` bridge
- do not silently rewrite existing unrelated graph structure
- do not trigger when the direct connection is already valid and honest
- do not spawn more than one intermediate node in this first pass
- keep the inserted node type deterministic:
  - `Geometry/Extrude`
- place the new node in a predictable canvas location between source and target
- leave later smart-wiring families for later phases once this first intent path proves stable

#### Questions / Decisions

##### [ ] `q1` Should the first smart-wiring pass trigger only on sketch-profile to output-facing body targets?

##### Suggestion

Yes.

Keep the first pass narrow:
- sketch-profile source
- output-facing solid/body target
- one inserted `Geometry/Extrude`

Do not broaden into other inferred chains until this one feels honest.

##### [ ] `q2` Should the first inserted extrude use default params rather than opening a new configuration wizard?

##### Suggestion

Yes.

Spawn the extrude with normal default params and wire it immediately.

The value of the feature is:
- fewer clicks
- preserved graph flow

Not:
- interrupting the drop with another setup mode.

##### [ ] `q3` Should the first smart-wiring pass prefer one stable graph mutation path shared by mouse-drop and any future command/toolbar trigger?

##### Suggestion

Yes.

The first implementation should aim for one canonical graph-mutation seam so future QoL entry points can reuse the same insertion behavior instead of cloning drag-specific graph-edit logic.

#### Acceptance Shape

- dragging from a sketch output toward an output-facing body target can succeed even when a direct profile-to-output connection is not the right final graph
- the canvas inserts one `Geometry/Extrude` node automatically
- the inserted node lands between the source and target in a predictable location
- the sketch output is wired into the new extrude input
- the new extrude output is wired into the target output slot
- the resulting graph is readable and editable like a normal manually-authored graph
- the behavior stays narrow and deterministic instead of trying to infer many different missing chains

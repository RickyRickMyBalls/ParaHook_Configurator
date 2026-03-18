# Workspace Modes

## Doc Header

### Doc History
17. 2026-03-17 18:31: Added the single-owner browser-pop-out rule so when a viewport/tool surface is popped out into a new browser window its in-app pane collapses in the main app instead of remaining duplicated, aligning the later workspace-family behavior with the already-shipped `Console` pop-out ownership model
16. 2026-03-17 18:28: Broadened the later pop-out read so the workspace-family follow-through is no longer only about `Spaghetti Editor` detachment, but about any supported viewport/tool surface being able to `Pop-Out` into a new browser window on top of the same shared surface-instance model, with the shipped `Console` pop-out treated as the first real proof
15. 2026-03-17 14:45: Extended the `5.1` workspace-family read so later multi-window `Spaghetti Editor` surfaces and detached/browser pop-out now have an explicit planned home as `[5.1E]` inside the same shared workspace model, instead of floating only as a separate `SP - Phase 13` family placeholder
14. 2026-03-17 14:21: Tightened the workspace architecture around multi-editor growth by clarifying that current shipped shell truth is still one visible active `Spaghetti Editor`, the next honest upgrade is multiple in-app floating editor windows, and real detached/new-browser pop-out remains a later placement mode that should reuse the same surface-instance model instead of becoming a separate editor concept
13. 2026-03-17 12:53: Added the Browser preservation rule to the umbrella workspace architecture so dragging `Browser` into the model viewport is still expected to keep the current floating-in-viewport behavior, clarifying that the hybrid system must preserve that existing shell interaction instead of treating Browser as tiled-only once workspace modes arrive
12. 2026-03-17 12:48: Reworked this file back into the umbrella architecture surface after splitting the implementation detail into the dedicated `05.1A` through `05.1D` future task-doc family, updated the roadmap read from the older `[5.3]` placeholder to the re-homed `[5.1] VR / SP - Workspace Modes` lane, and removed the long execution-spec tail so this doc now points at the subphase docs instead of trying to hold every lock itself
11. 2026-03-17 12:25: Generalized the split-entry rule so all standalone floating tool surfaces can right-click their title bars to `Split Horizontal` or `Split Vertical`, with the split created against the current model viewport; deeper subdivisions should then come from divider-line actions rather than more one-off panel rules
10. 2026-03-17 12:21: Added the matching `Spaghetti Editor` title-bar split interaction so right-clicking the editor title bar can open `Split Horizontal` or `Split Vertical` and move that editor into a newly created split pane
9. 2026-03-17 12:18: Added the reverse tiled-console action so a split `Console` can right-click its title bar and choose `Combine Back To Model Viewport`, which removes that split pane and restores the console to its docked floating form over the main model viewport
8. 2026-03-17 12:12: Tightened the startup tiled-layout rule so the default entry into tiled behavior is the current clean left-dock-only split, and added the first concrete `Console` titlebar right-click rule so users can open a menu there to `Split Horizontal` or `Split Vertical`
7. 2026-03-17 12:06: Added a concrete migration rule that the existing `[]` left-dock split toggle should become the first reusable entry button into the broader tiled workspace system, since it already docks the current left-dock stack into a separate viewport-like region
6. 2026-03-17 11:55: Added a `Still Needed Decisions` section with suggested answers covering eligible tiled surfaces, singleton versus duplicate behavior, tile-tree structure, active-pane ownership, divider behavior, tile priority, minimum pane sizes, persistence, and migration from the current Spaghetti-only hybrid proof
5. 2026-03-17 11:48: Updated the architecture read so it now explicitly recognizes the shipped Spaghetti editor shell as a narrow proof of the hybrid workspace idea, clarifying that ParaHook already has one surface that can move between floating, split, and docked/minimized presentations and that the broader feature is mainly a generalization of that existing pattern
4. 2026-03-17 11:40: Reworked the doc away from a strict all-or-nothing global mode split so the current recommendation is now one hybrid workspace system where `Windowed` and `Tiled` are per-surface presentation styles that can coexist, allowing some tools to stay floating while others live in the tiled layout
3. 2026-03-17 11:36: Added the first concrete tiled-divider interaction rule so right-clicking a horizontal or vertical split line can open layout actions like `Split Horizontal` and `Split Vertical`, making divider lines themselves part of the tile-authoring UI instead of leaving all split creation to pane headers
2. 2026-03-17 11:32: Renamed the two workspace modes from `Normal Float Mode` and `Split Mode` to `Windowed Mode` and `Tiled Mode`, and renamed this file from `Workspace-Split-Modes.md` to `Workspace-Modes.md` so the architecture surface uses the cleaner final pair instead of the earlier draft wording
1. 2026-03-17 11:25: Created this architecture doc to define a workspace-wide `Normal Float Mode` versus `Split Mode` direction, expanding the current Spaghetti-only split experiment into a broader pane-based shell where supported tool surfaces can live inside resizable Blender-like splits

### Purpose

This doc defines the architecture direction for ParaHook workspace modes.

Use it to answer:
- what `Windowed` and `Tiled` mean inside the workspace system
- how the current Spaghetti-only split should evolve into a workspace-wide layout system
- what kind of tool surfaces should be eligible for split panes
- how floating and tiled surfaces should coexist in one hybrid workspace
- how later multiple-surface and browser-pop-out growth should fit the same shell model
- how pane switching should work when the user wants one pane to become another tool surface
- where shell ownership should live versus feature ownership

### Why This Doc Exists

ParaHook already has the start of a split-layout idea:
- the `Spaghetti Editor` can enter a non-overlay split state
- the `Browser` and other surfaces already behave like movable shell tools
- the app is gaining more tool surfaces that want screen space without always floating on top of the model

ParaHook also already has the start of a hybrid presentation model:
- the same `Spaghetti Editor` surface can already move between floating, split, and docked/minimized-style presentations
- the current shell already proves that one tool surface can exist in more than one placement style without becoming a separate feature

But the current split idea is still too narrow because it is mostly:
- one editor-specific layout
- one hard-coded top/bottom relationship
- one-off shell behavior inside `AppShell`

This doc exists to define the broader direction before more panel behavior grows ad hoc.

### Scope

This doc covers:
- the hybrid workspace layout model
- the two main presentation styles inside that model
- the pane/split model for tiled surfaces
- how supported tool surfaces should move or swap between panes
- the recommended ownership split between shell layout state and feature state
- the relationship to the current `Spaghetti Editor` split implementation

This doc does not cover:
- detailed task sequencing
- detached OS-native window behavior
- final styling
- geometry-authoring logic
- every future panel ParaHook may ever add

## Doc Body

### Short Version

ParaHook should use one hybrid workspace system.

Inside that system, a tool surface can be:
- `Windowed`
- `Tiled`

`Windowed` keeps the current floating or shell-window behavior.

`Tiled` places the surface inside the pane layout.

Important rule:
- these should not have to be globally exclusive
- the user should be able to tile some surfaces while leaving others floating

Example:
- tile the `Console`
- tile the `Gizmo/View` surface
- keep the `Browser` floating

The user should be able to change any split pane to another supported tool surface without that becoming a second hidden copy of the same feature.

### Core Naming Decision

Use these terms:

- `Workspace Layout System`
  - the full shell arrangement that can mix tiled and floating surfaces
- `Windowed`
  - a floating-window-style or non-tiled surface presentation
- `Tiled`
  - a pane-hosted surface presentation inside the tile layout
- `Hybrid Workspace`
  - one workspace where windowed and tiled surfaces can coexist
- `Split Pane`
  - one resizable area inside the tiled layout
- `Tool Surface`
  - a hostable app surface such as `Browser`, `Spaghetti Editor`, `Console`, or another panel

Important rule:
- do not use `viewport` as the main term for these split hosts
- ParaHook already uses viewport language for the model viewer and editor viewport/session records
- the safer architecture term here is `Split Pane`

### Problem Statement

Current pain:
- the app has more useful tool surfaces than one floating stack can present cleanly
- the current split concept only solves one `Spaghetti Editor` case
- the shell still treats Browser, editor, console, and other panels as mostly separate presentation systems
- users cannot yet compose a custom working layout where one area becomes `Browser`, another becomes `Spaghetti`, another becomes `Console`, and so on

Plain-English problem:
- ParaHook has enough real tools now that it needs a workspace layout system, not only isolated floating panels

### The Two Presentation Styles

#### 1. `Windowed`

This is the current floating-style presentation.

It should mean:
- floating tool surfaces remain valid
- the current overlay/floating editor behavior remains available
- the current dock/floating shell experiments remain part of the live workspace system

This presentation style is useful because:
- it is fast
- it matches the app's current behavior
- it stays good for lighter sessions where the user does not want to build a full pane layout

#### 2. `Tiled`

This is the pane-based presentation style.

It should mean:
- the workspace is divided into resizable split panes
- each pane hosts one supported tool surface
- panes can be split again horizontally or vertically
- panes can be resized by dragging dividers
- the user can change one pane from one tool surface to another

This presentation style should feel like:
- a real workspace layout system
- not just one special hard-coded `Spaghetti below viewer` state

### Hybrid Workspace Rule

The strongest current recommendation is:
- do not force the whole workspace into `Windowed` or `Tiled` at once
- allow the user to mix them

That means the user should be able to do layouts like:
- tiled `Console` plus tiled `Gizmo/View`
- floating `Browser`
- tiled `Model Viewer`
- tiled `Spaghetti Editor`

Plain-English rule:
- `Tiled` and `Windowed` should be surface placement styles inside one workspace system
- not a rigid app-wide binary switch

### Tool Surface Model

The split system should host `Tool Surfaces`, not just literal toolbar strips.

Likely supported surfaces over time:
- `Model Viewer`
- `Spaghetti Editor`
- `Browser`
- `Console`
- `Parts List`
- later other panel/inspector surfaces that already exist as app-level tools

Important rule:
- a tool surface keeps its own internal feature state
- the split system only decides where that surface is shown

Example:
- `BrowserPanel` still owns Browser UI behavior whether it is floating or tiled
- `SpaghettiPanel` still owns editor behavior whether it is floating or tiled
- `Console` still owns transcript/input behavior whether it is floating or tiled
- the workspace layout system only decides where the surface is shown

### Surface Instance Rule

The workspace should separate:
- tool-surface kind
- tool-surface instance
- placement style

Important rule:
- do not hard-lock the architecture to singleton-only surfaces just because the current shell is still narrow

Practical read:
- `Browser`, `Console`, and `Gizmo/View` can still behave as move-existing/swap-first surfaces in the first shared workspace pass
- `Spaghetti Editor` is the strongest early candidate for multiple instances because editor viewport/session records already exist in store even though the shell still mostly shows one visible active editor surface at a time

Plain-English rule:
- first-pass workspace UX can stay simple
- the underlying surface model should still stay honest enough for later multi-editor growth

### Later Browser Pop-Out Rule

Later in the same workspace family, any supported viewport/tool surface should be able to `Pop-Out` into a new browser window.

Important rule:
- this should not become a second shell system just because `Console` got there first
- browser pop-out should be another placement/host mode of the same shared surface-instance model
- browser pop-out should use single-owner behavior:
  - when the surface pops out into a new browser window
  - the in-app pane/view should collapse in the main app instead of staying duplicated there

Current proof:
- `Console` already proves browser pop-out behavior in the app

Target direction:
- `Model Viewer`
- `Browser`
- `Meatball Editor`
- `Spaghetti Editor`
- `Gizmo/View`
- later other supported tool surfaces

Plain-English rule:
- a pane should be able to move from tiled or windowed in-app presentation to browser-pop-out presentation without becoming a different feature concept
- the pop-out window becomes the active owner of that surface while it is detached

### Split Pane Rules

Each split pane should be able to:
- host one supported tool surface
- split horizontally
- split vertically
- resize against its sibling pane
- switch its hosted surface
- close/merge back into the remaining sibling when appropriate

Recommended mental model:
- the tiled portion of the workspace is a tree of pane nodes
- branch nodes describe split direction and ratio
- leaf nodes host one `Tool Surface`

This is a better long-range fit than:
- hard-coding more special top/bottom layouts in `AppShell`
- adding one unique split rule per tool

### Divider Interaction Rule

The split lines themselves should act like layout controls.

Recommended rule:
- right-clicking a horizontal divider line opens a layout menu
- right-clicking a vertical divider line opens a layout menu

That menu should include:
- `Split Horizontal`
- `Split Vertical`

Good likely nearby actions later:
- `Close Split`
- `Merge With Neighbor`
- row/column priority controls

Why this is a strong interaction seam:
- the divider already represents layout structure
- users can discover split authoring directly from the tiled lines
- it avoids forcing every layout action through pane headers only

Important rule:
- pane headers can still expose layout actions
- but divider right-click should also be a first-class tiled-layout entry path

### Floating-Surface Split Entry Rule

Standalone floating tool surfaces should be able to enter the tiled layout directly from their own title bars.

Recommended rule:
- if a standalone tool surface is currently `Windowed`, right-clicking its title bar can open:
  - `Split Horizontal`
  - `Split Vertical`
- that action should split against the current `Model Viewer` region because that is the workspace area the floating surface is currently sitting over
- choosing the action should:
  - create the requested split direction
  - move that surface into the new tiled pane

Important follow-up rule:
- once that first split exists, deeper workspace subdivision should happen from divider-line interactions
- do not keep inventing special per-surface secondary split rules when the divider already represents the layout structure

Plain-English read:
- floating standalone tools split off the model viewport first
- after that, the user grows the tiled workspace from the bars

### Surface Switching Rule

The user should be able to switch the current pane to any supported tool surface.

Recommended first-pass rule:
- keep the first-pass user interaction simple
- for `Browser`, `Console`, and similar app-level tools, prefer move-existing or swap behavior before clone-heavy UX
- do not require the first shared workspace pass to support multiple visible copies of every tool surface
- do not design the underlying host model as permanently singleton-only either
- if the user switches a pane to a surface that is already visible elsewhere, swap or move it by default unless that surface explicitly supports multi-instance hosting

Why this is the safest first read:
- it keeps the first workspace rollout simpler
- it avoids fake duplicate `Browser` or `Console` instances before instance policy is mature
- it still leaves room for later multi-instance `Spaghetti Editor` growth
- it still gives the user the practical freedom to say:
  - "make this pane the Browser"
  - "move the Console here"
  - "put Spaghetti in this pane instead"

Important follow-up rule:
- later multi-window `Spaghetti Editor` work should grow by adding real editor-surface instances to this same host model
- it should not require inventing a second editor-shell concept outside the workspace system

### Relationship To The Current Split Experiment

The current `Spaghetti Editor` split mode should be treated as:
- the first proof that non-overlay split presentation is useful
- not the final architecture for workspace splits

Important rule:
- do not keep growing the existing editor-only split path as if it is the permanent final shape
- the broader direction should absorb that work into one workspace-wide split system

Plain-English read:
- today's split editor is the prototype
- `Workspace Modes` is the actual long-range shell model

### Current Proof In Shipped Code

The app already has one narrow but important proof of this architecture.

Current shipped read:
- the `Spaghetti Editor` can already be:
  - floating
  - split into the main workspace
  - docked/minimized into `meatball editor view`
- those are different presentation states of the same tool surface
- that is already a small hybrid workspace behavior, even though it is currently hard-coded around one feature

What that proves:
- ParaHook does not need a completely new mental model for mixed presentation styles
- the app already knows how to treat one surface as movable between multiple shell placements
- the larger workspace feature is mostly about generalizing that pattern to more tool surfaces and replacing the one-off split renderer with a reusable layout system

Related current shell proof:
- the existing `[]` left-dock split toggle already moves the current left-dock stack into its own constrained workspace region
- that makes it the strongest current candidate for the first reusable `enter tiled layout` button instead of inventing a second unrelated entry control

Important rule:
- do not describe this feature as if ParaHook currently has no hybrid behavior at all
- the honest read is:
  - hybrid behavior already exists
  - but only in a narrow Spaghetti-specific form
  - and the new architecture is the broader shared version of that idea

### Current Multi-Editor Truth And Growth Path

Current honest shell read:
- the store can already track multiple editor viewport/session records
- the visible app shell still mostly renders one active `Spaghetti Editor` surface at a time

Important rule:
- do not describe the current shell as if literal multiple visible spaghetti windows already ship

Recommended growth order:
- first:
  - keep the current single-visible-editor truth explicit
- next:
  - allow multiple visible in-app floating `Spaghetti Editor` windows
- later:
  - allow true detached or `Pop-Out` editor placement in a new browser/window

Important architecture rule:
- detached or pop-out editor windows should be another placement/host mode of the same editor-surface instance model
- they should not become a separate editor concept with separate Browser tracking or separate graph-editor semantics

Plain-English read:
- first make multiple in-app editor windows real
- then let later browser-pop-out reuse that same surface truth instead of skipping straight to a disconnected detached-window path

### Relationship To The Current Left Dock

Current shell reality:
- ParaHook still has a meaningful left-dock and floating-panel model
- that is fine inside the hybrid system

Recommended tiled-layout rule:
- when a surface is tiled, it should behave as part of the pane system rather than as a separate permanent left-dock item
- the left dock should not remain the primary organizer for tiled surfaces
- supported surfaces should move into split panes as first-class pane content
- the existing `[]` split toggle near the left dock should be reused as the first visible entrypoint into tiled layout behavior because it already performs the first left-dock docking/splitting action

This keeps the architecture clear:
- `Windowed`
  - floating and docked shell surfaces
- `Tiled`
  - pane-hosted tool surfaces
- `Hybrid Workspace`
  - a layout where both can exist at once

### Ownership Split

#### Shell layout ownership

Should be owned by:
- `AppShell`
- plus a new app-level workspace-layout state surface

This layer should own:
- tiled pane tree
- the split-pane tree
- split ratios
- which tool surface lives in which pane
- which supported surfaces are currently tiled versus windowed
- active pane identity
- layout persistence across both tiled and floating surfaces

#### Feature ownership

Should stay where it already belongs:
- `BrowserPanel`
- `SpaghettiPanel`
- `Console`
- other feature modules/stores

Important rule:
- split mode changes placement
- it does not replace feature ownership

#### State-location recommendation

Recommended new seam:
- a dedicated workspace-layout store near app-shell state

Possible home:
- `src/app/workspace/`
- or an app-store-adjacent store if the team wants it near `uiPrefsStore`

Avoid:
- burying the whole split-tree model inside one feature store like `useSpaghettiStore`
- making pane layout an accidental side effect of only editor viewport state

### First Honest Scope

The first real implementation of this architecture should stay narrow.

It should include:
- one app-global hybrid workspace layout system
- existing floating behavior preserved for windowed surfaces
- one real tiled pane system
- pane split and resize behavior
- pane surface switching
- the ability for some supported surfaces to remain floating while others are tiled
- a small first supported surface set

Recommended first supported surface set:
- `Model Viewer`
- `Spaghetti Editor`
- `Browser`
- `Console`
- `Gizmo/View`

Good likely next additions:
- `Parts List`
- other existing shell panels once the pane model feels stable

### First-Pass Non-Goals

Do not let the first pass absorb:
- detached OS-native docking systems
- true browser-pop-out / detached editor-window behavior
- multiple independent copies of every tool surface as a mandatory day-one requirement
- saved layout libraries and presets
- full arbitrary panel/plugin ecosystems
- one-off feature-specific split rules that bypass the shared pane system

Plain-English rule:
- prove one shared split workspace model first
- do not turn v1 into a full window manager

Important nuance:
- first-pass non-goal does not mean the model should be singleton-only forever
- it means the first rollout should not require finishing multi-instance hosting and detached-window placement before the shared workspace architecture is honest

### Default Layout Direction

The hybrid workspace should not start as a blank workspace.

Recommended first default:
- one sensible starting layout that reflects current ParaHook priorities
- and still allow some supported surfaces to stay windowed by default if that feels cleaner

Example shape:
- main large `Model Viewer` pane
- one tiled `Browser`
- one tiled `Console`
- one tiled `Gizmo/View` surface
- `Spaghetti Editor` can be docked/tiled by the user after startup

Important rule:
- default layout should help the user start working immediately
- but any pane should still be swappable afterward
- the cleanest first tiled entry should be the current left-dock-only split:
  - split out the existing left dock
  - leave the main model viewport intact
  - then let the user grow the tiled workspace from there

### Persistence Direction

Recommended first persistence rule:
- remember one hybrid workspace layout state

That means:
- remember the current tiled split tree
- remember the current floating/windowed surface placements
- remember which supported surfaces are tiled versus windowed

Good later follow-up:
- saved named layouts
- per-task workspace presets

### Relationship To The Roadmap

This architecture sits closest to:
- the current shipped `2.1D` editor split proof
- the current `2.1E` dock/floating shell work
- the later broader `[5.1] VR / SP - Workspace Modes` direction
- the later `[5.1E]` workspace-family follow-through for multi-window editor surfaces and detached/browser pop-out

Practical read:
- `2.1D` proved split presentation is useful
- shipped code also proved that one surface can move between floating, split, and docked/minimized shell states
- this doc defines the larger shell model that should now be implemented through the dedicated `[5.1A]` through `[5.1D]` task-doc family, with later multi-window editor follow-through planned as `[5.1E]`
- later `SP - Phase 13` should use that shared surface model for real multiple visible spaghetti-editor windows and later detached/new-browser editor placement instead of bypassing the workspace architecture with a second shell system

### Execution Doc Family

Use the dedicated future task docs for implementation detail:

- `docs/Phase-Plans/Tasks/Future/05.1A - VR-SP - Workspace Layout Foundation And Left-Dock Entry.md`
  - shared layout owner
  - tile-tree model
  - main viewer anchor
  - left-dock `[]` entry behavior

- `docs/Phase-Plans/Tasks/Future/05.1B - VR-SP - Split Pane Authoring And Divider Controls.md`
  - first split entry
  - divider authoring
  - resize rules
  - row/column priority
  - close/merge behavior

- `docs/Phase-Plans/Tasks/Future/05.1C - VR-SP - Hybrid Tool Surface Hosting And Floating-Tiled Transitions.md`
  - first hosted-surface set
  - pane header responsibilities
  - clone-capable hosting
  - tiled/windowed transitions
  - default hybrid arrangement

- `docs/Phase-Plans/Tasks/Future/05.1D - VR-SP - Workspace Persistence, Saved Modes, And Migration.md`
  - persisted layout shape
  - later saved modes
  - migration from the old Spaghetti-only split path
  - deprecation path for the special-case renderer

Later planned extension inside the same roadmap family:

- `[5.1E] [ ] - Multi-Window Surfaces And Detached Browser Pop-Out`
  - multiple visible in-app surface instances where needed
  - later browser `Pop-Out` support for any supported viewport/tool surface on top of the same shared surface-instance model
  - use shipped `Console` pop-out as the first proof that browser-window hosting can stay attached to shared shell ownership
  - keep this as workspace-family follow-through rather than a separate detached-window shell system

### Architecture Boundary

Keep this file focused on:
- the shell-level model
- naming
- ownership boundaries
- the relationship between current shipped proof and long-range direction

Push detailed implementation locks into the `05.1A` through `05.1D` task docs, then later `05.1E` once that broader browser-pop-out follow-through gets its own execution doc.

Important rule:
- `Workspace-Modes.md` is the umbrella architecture doc
- the `05.1A-D` files are the current execution-planning docs
- later multi-window follow-through should extend that same family as `05.1E`, not start a disconnected shell track

### Suggested Code Shape

Likely new area:
- `src/app/workspace/`

Likely responsibilities:
- split-tree types
- layout reducer/store
- pane host rendering
- pane header controls
- tiled/windowed assignment rules
- floating-window placement memory

Likely current integration seams:
- `src/app/AppShell.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/uiPrefsStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

### Short Version

The right mental model is:
- ParaHook should use one hybrid workspace system
- `Windowed` keeps today's floating tool-surface behavior
- `Tiled` turns part of the workspace into resizable panes
- some surfaces should be allowed to stay floating while others are tiled
- panes host supported tool surfaces such as `Browser`, `Spaghetti Editor`, `Console`, and the `Model Viewer`
- if the user drags `Browser` into the model viewport, it should still keep the current floating-in-viewport Browser behavior
- the current shell still mostly shows one visible `Spaghetti Editor` at a time, so later multi-editor and pop-out work should grow from one shared surface-instance model instead of inventing a separate detached editor concept
- the split system owns placement and layout, while each tool surface keeps its own feature ownership
- the detailed implementation now lives in the `05.1A` through `05.1D` task-doc family, with later multi-window editor growth planned as `[5.1E]`

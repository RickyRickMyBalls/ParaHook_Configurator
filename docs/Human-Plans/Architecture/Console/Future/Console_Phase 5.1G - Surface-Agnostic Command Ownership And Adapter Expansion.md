# Console Phase 5.1G - Surface-Agnostic Command Ownership And Adapter Expansion

## Doc Header

### Doc History
1. 2026-03-24 14:19: Created this standalone future console phase doc so the new owner-first command expansion rule now has its own planning home under `Console/Future/` instead of living only as an inline follow-on in `Console.md`

### Purpose

This phase turns the current ownership decision into a repeatable implementation rule for future CAD command growth.

Use it to answer:
- where a new CAD command should actually be owned
- how `Console`, `Browser`, `Model Viewport`, and `View Toolbar` should expose the same command without forking behavior
- which current seams should be treated as owners versus surface adapters
- what the first migration order should be as more graph and view commands are added

## Doc Body

## [ ] `[5.1G]` `Surface-Agnostic Command Ownership And Adapter Expansion`

### Summary

`5.1G` should make future command growth owner-first instead of surface-first.

This phase is about one command model that can be reached from:
- `Console`
- `Browser`
- `Model Viewport`
- `View Toolbar`

Important rule:
- those surfaces should stay as adapters into shared owner seams
- they should not each become their own command owner

### Why This Phase Exists

The current architecture already locked several important pieces:
- `[5.1F]` created the canonical workspace-selection and intent seam
- `Workspace Modes` plus `05.1C` separated shell placement from feature ownership
- `Browser-5` defined Browser selection/focus sync as shared workspace behavior
- `[5.0I-1]` proved that toolbar and console can drive the same projection command seam

What is still missing is the reusable rule for future CAD command growth.

Current risk:
- a command gets added to `ConsoleDock`
- then copied into `BrowserPanel`
- then copied into viewport controls
- then copied into `ViewToolbar`
- and each surface starts drifting in naming, scope, or execution path

`5.1G` exists to stop that drift before the graph and CAD command set gets much larger.

### Locked Direction

The locked direction for `5.1G` is:
- define command behavior once at the real owner seam
- expose it through multiple surfaces only as adapters
- keep command behavior independent of:
  - which surface launched it
  - whether the surface is floating or tiled
  - whether the command came from text, click, or toolbar interaction

### Ownership Split

Command ownership should stay split like this:

- workspace/shell ownership
  - placement and hosting only
  - `Windowed`
  - `Tiled`
  - active pane
  - floating versus split versus pop-out

- workspace-intent ownership
  - shared cross-surface outcomes
  - open
  - focus
  - select
  - activate surface
  - command outcomes that multiple surfaces can request identically

- graph/spaghetti ownership
  - graph authoring truth
  - sketch authoring truth
  - node creation and mutation
  - future CAD commands that change authored graph state

- viewer/view ownership
  - camera and view truth
  - projection
  - framing
  - orbit/pan/zoom family
  - other explicit view settings

Important rule:
- if removing one surface would not remove the command's meaning, that surface does not own the command

### Surface Adapter Rule

The following surfaces should be treated as adapters:

- `Console`
  - parses text
  - runs staged grammar
  - publishes transcript and prompts
  - should not become the permanent owner of graph or view behavior

- `Browser`
  - exposes row actions
  - exposes selection/focus/open behavior
  - should not become the hidden owner of graph mutation or view semantics

- `Model Viewport`
  - exposes direct visual interaction
  - exposes overlays, buttons, and camera affordances
  - should not become the only place a command can execute

- `View Toolbar`
  - exposes visible view controls
  - should map to the same view command seams the console can reach
  - should not invent toolbar-only execution paths

### First Command Families To Standardize

`5.1G` should start with the command families most likely to be triggered from several surfaces.

#### 1. Graph / CAD Authoring Commands

Examples:
- start sketch plane pick
- start sketch draw
- create node
- delete node
- future sketch modify commands
- future extrude or graph-authoring actions

Owner:
- graph/spaghetti seam

Likely current owner seams:
- `useSpaghettiStore`
- graph-specific helpers/selectors nearby

#### 2. Workspace Coordination Commands

Examples:
- open graph
- focus graph/editor
- select target
- activate surface
- move console context to the nearest valid root scope

Owner:
- shared workspace-selection and intent seam

Likely current owner seams:
- `useAppStore`
- `workspaceIntents`

#### 3. Camera / View Commands

Examples:
- projection
- fit/frame
- view jump
- orbit/pan/zoom command families
- future grid and visible view settings

Owner:
- viewer/view-state seam

Likely current owner seams:
- `useUiPrefsStore.view`
- `viewerBridge`
- viewer-side command APIs where needed

### What This Phase Owns

- command-family ownership cleanup for shared multi-surface commands
- the owner-versus-adapter rule for new CAD commands
- migration of existing Browser / viewport / toolbar entry points where they still bypass shared owner seams
- shared verification proving the same command behaves the same from more than one surface

### What This Phase Does Not Own

- shell placement redesign
- tile-tree or pop-out behavior
- raw keyboard precedence already handled by `[4.1J]`
- broad Browser row redesign outside command ownership
- broad viewer gesture redesign outside explicit command seams
- every future CAD command itself

Important rule:
- `5.1G` is not the phase where every command must ship
- it is the phase where the command expansion pattern must become honest

### First Implementation Cut

The safest first cut should be:

1. inventory the command families already crossing multiple surfaces
2. mark the real owner seam for each family
3. migrate the most drift-prone surface paths first
4. add regression coverage proving shared execution

Recommended first priority order:

1. graph commands currently reachable from console plus browser
2. view commands currently reachable from console plus toolbar
3. viewport commands or overlays that still bypass the same owner seam

### Likely Current Integration Seams

Primary owner seams:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/uiPrefsStore.ts`

Primary adapter surfaces:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewerHost.tsx`

Important read:
- adapters may still need local parsing or UI presentation logic
- but the final action should resolve into one canonical owner seam

### Main Decisions

#### [x] `q1` Should new CAD commands be defined at the surface that first exposes them?

##### Suggestion
- locked direction:
- no
- define them at the real owner seam first
- surfaces then adapt into that seam

#### [x] `q2` Should workspace placement affect command ownership?

##### Suggestion
- locked direction:
- no
- `Windowed`, `Tiled`, and later pop-out are hosting concerns only
- they must not create different command owners

#### [x] `q3` What should count as success for this phase?

##### Suggestion
- locked direction:
- success is:
  - the same command can be triggered from more than one surface
  - the same owner seam executes it
  - the same workspace/view/graph truth updates afterward
  - tests protect that shared path from drifting again

### First Implementation Steps

`[5.1G]` should likely be completed in this order:

1. audit current command entry points across:
   - `Console`
   - `Browser`
   - `Model Viewport`
   - `View Toolbar`
2. group those entry points by command family instead of by component
3. assign each family to one canonical owner seam
4. migrate the highest-value duplicated paths onto that owner seam
5. remove leftover surface-local execution glue where safe
6. add regressions proving two or more surfaces hit the same underlying behavior

### Verification Shape

Minimum verification for a migrated command family should prove:
- the command can be started from at least two different surfaces
- both entry points resolve to the same owner seam
- shared state changes are identical afterward
- transcript/context reflection still stays correct for console-visible commands

Good first verification targets:
- one graph-authoring command from `Console` and `Browser`
- one view command from `Console` and `View Toolbar`
- one viewport-exposed command from `Console` and `Model Viewport`

### Hard Rules

- do not make `ConsoleDock` the permanent owner of graph or view command behavior
- do not let `BrowserPanel` keep adding local command execution paths for outcomes already covered by canonical intents or graph owners
- do not let `ViewToolbar` or viewport overlays invent toolbar-only or viewport-only command behavior for actions that should be shared
- do not redesign the whole shell just because surface adapters are being cleaned up
- do not fork command behavior by placement mode

### Acceptance Shape

`5.1G` is done when:
- the owner-versus-adapter rule is explicit in code-facing planning
- new CAD command growth has a clear owner-first implementation order
- the main shared command families have canonical owner seams
- `Console`, `Browser`, `Model Viewport`, and `View Toolbar` can trigger shared commands without forking execution behavior
- regression coverage exists for at least the first migrated multi-surface command families

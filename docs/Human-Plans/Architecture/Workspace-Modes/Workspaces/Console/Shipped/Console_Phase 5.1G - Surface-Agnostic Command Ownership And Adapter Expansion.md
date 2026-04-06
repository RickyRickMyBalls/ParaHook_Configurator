# Console Phase 5.1G - Surface-Agnostic Command Ownership And Adapter Expansion

## Doc Header

### Doc History
3. 2026-03-25 21:49: Marked `[5.1G]` shipped after landing the first owner-first command expansion cut in code, moving this standalone phase record from `Console/Future/` into `Console/Shipped/`, and proving shared workspace-selection outcomes plus shared view commands across `Console`, `Browser`, `Model Viewport`, and `View Toolbar`
2. 2026-03-25 21:28: Tightened this future console phase against the live `workspaceIntents`, Browser interaction, console grammar, viewer bridge, viewport overlay, and toolbar seams so `5.1G` now reads as an implementation-ready owner-first command migration spec with concrete command families, migration order, code targets, and verification requirements instead of a higher-level direction memo
1. 2026-03-24 14:19: Created this standalone future console phase doc so the new owner-first command expansion rule now has its own planning home under `Console/Future/` instead of living only as an inline follow-on in `Console.md`

### Purpose

This phase turns the current ownership decision into a repeatable implementation rule for future CAD command growth.

Use it to answer:
- where a new CAD command should actually be owned
- how `Console`, `Browser`, `Model Viewport`, and `View Toolbar` should expose the same command without forking behavior
- which current seams should be treated as owners versus surface adapters
- what the first migration order should be as more graph and view commands are added

## Doc Body

## [x] `[5.1G]` `Surface-Agnostic Command Ownership And Adapter Expansion`

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

Implementation default:
- `5.1G` is not "ship every future command"
- `5.1G` is the phase where shared command families stop being surface-local glue and start landing once in canonical owner seams
- the first shipped cut should migrate the command families that already visibly cross more than one surface today

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

Current live reality:
- the repo already has real shared seams worth preserving
- the doc was directionally right, but some of its seam naming was still too abstract
- `5.1G` now needs to be treated as a concrete migration phase grounded in the existing code rather than a future principle note

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
  - current canonical seam:
    - `src/app/store/workspaceIntents.ts`
    - plus `useAppStore` workspace-selection and console-context sync state

- graph/spaghetti ownership
  - graph authoring truth
  - sketch authoring truth
  - node creation and mutation
  - future CAD commands that change authored graph state
  - current canonical seam:
    - `src/app/spaghetti/store/useSpaghettiStore.ts`

- viewer/view ownership
  - camera and view truth
  - projection
  - framing
  - orbit/pan/zoom family
  - other explicit view settings
  - current canonical seam:
    - `src/app/viewerBridge.ts`
    - `src/viewer/Viewer.ts`
    - `src/app/store/uiPrefsStore.ts`

Important rule:
- if removing one surface would not remove the command's meaning, that surface does not own the command

### Surface Adapter Rule

The following surfaces should be treated as adapters:

- `Console`
  - parses text
  - runs staged grammar
  - publishes transcript and prompts
  - should not become the permanent owner of graph or view behavior
  - live adapter files:
    - `src/app/console/ConsoleDock.tsx`
    - `src/app/console/stagedNavigation.ts`

- `Browser`
  - exposes row actions
  - exposes selection/focus/open behavior
  - should not become the hidden owner of graph mutation or view semantics
  - live adapter files:
    - `src/app/panels/BrowserPanel.tsx`
    - `src/app/panels/browserInteractions.ts`
    - `src/app/panels/browserRowActions.ts`

- `Model Viewport`
  - exposes direct visual interaction
  - exposes overlays, buttons, and camera affordances
  - should not become the only place a command can execute
  - live adapter files:
    - `src/app/components/ViewerHost.tsx`
    - `src/app/components/ViewportOverlay.tsx`

- `View Toolbar`
  - exposes visible view controls
  - should map to the same view command seams the console can reach
  - should not invent toolbar-only execution paths
  - live adapter file:
    - `src/app/components/ViewToolbar.tsx`

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

Locked live owner seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- graph-specific helpers/selectors nearby

Current command examples already proving this seam:
- `runSketchPlaneCommand(...)`
- `runGeometrySketchDrawCommand(...)`

Important rule:
- `ConsoleDock`, `ViewportOverlay`, and later Browser entry points may adapt into these verbs
- they should not re-implement sketch-session state machines locally

#### 2. Workspace Coordination Commands

Examples:
- open graph
- focus graph/editor
- select target
- activate surface
- move console context to the nearest valid root scope

Owner:
- shared workspace-selection and intent seam

Locked live owner seams:
- `src/app/store/workspaceIntents.ts`
- `src/app/store/useAppStore.ts`
- Browser-side adapter helper:
  - `src/app/panels/browserInteractions.ts`

Important rule:
- selection/focus/open/activate outcomes should converge here even when initiated by `Console`, `Browser`, or viewport selection gestures
- Browser-family click grammar may remain local, but the resulting workspace outcome should still resolve through the shared selection/intent seam

#### 3. Camera / View Commands

Examples:
- projection
- fit/frame
- view jump
- orbit/pan/zoom command families
- future grid and visible view settings

Owner:
- viewer/view-state seam

Locked live owner seams:
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`
- `src/app/store/uiPrefsStore.ts`

Current command examples already proving this seam:
- `viewer.setProjectionMode(...)`
- `viewer.frameAll()`
- `viewer.frameSelected(...)`

### What This Phase Owns

- command-family ownership cleanup for shared multi-surface commands
- the owner-versus-adapter rule for new CAD commands
- migration of existing Browser / viewport / toolbar entry points where they still bypass shared owner seams
- shared verification proving the same command behaves the same from more than one surface
- cleanup of stale surface-local execution glue where a canonical owner seam already exists

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

### Locked Migration Strategy

`[5.1G]` should be implemented in a fixed owner-first order:

1. audit current command entry points across:
   - `Console`
   - `Browser`
   - `Model Viewport`
   - `View Toolbar`
2. group those entry points by command family instead of by component
3. lock the canonical owner seam for each family in code-facing implementation notes
4. migrate the most duplicated and drift-prone surface paths first
5. remove leftover surface-local execution glue where safe
6. add regressions proving two or more surfaces hit the same underlying owner seam

Important rule:
- do not start by inventing a giant global command registry for every possible action
- start from the shared seams that already exist and migrate the visible duplicated paths onto them

Recommended first priority order:

1. graph commands currently reachable from console plus browser
2. view commands currently reachable from console plus toolbar
3. viewport commands or overlays that still bypass the same owner seam

### First Implementation Cut

The first honest `5.1G` cut should standardize these concrete families:

#### 1. Workspace target and surface activation

Current surfaces:
- `Console`
- `Browser`
- `ViewerHost`
- `SpaghettiPanel`

Canonical owner:
- `workspaceIntents`
- `useAppStore` workspace-selection state

Migration target:
- stop adding new direct `setWorkspaceSelectedTarget(...)` plus `requestConsoleContextSync(...)` sequences in surface components when the behavior can be expressed as one shared intent/helper path
- keep `browserInteractions.ts` as an adapter/helper seam, not a second owner

#### 2. Sketch-plane and sketch-draw command verbs

Current surfaces:
- `ConsoleDock`
- `ViewportOverlay`
- later Browser/context surfaces where relevant

Canonical owner:
- `useSpaghettiStore`

Migration target:
- keep command execution in `runSketchPlaneCommand(...)` and `runGeometrySketchDrawCommand(...)`
- move any remaining console-only or overlay-only meaning into those shared verbs instead of forking prompt or session behavior

#### 3. View commands

Current surfaces:
- `ConsoleDock`
- `ViewToolbar`
- viewport UI affordances

Canonical owner:
- `viewerBridge`
- viewer API
- view prefs where persistent state is needed

Migration target:
- projection, frame-all, and frame-selected should keep one view command meaning regardless of whether the user clicked a toolbar button or typed a console alias

### Live Code Alignment

The current repo already exposes most of the seams `5.1G` should formalize.

Primary owner seams:
- `src/app/store/workspaceIntents.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/viewerBridge.ts`
- `src/app/store/uiPrefsStore.ts`

Primary adapter/helper seams:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewToolbar.tsx`

Current concrete smells this phase should reduce:
- direct surface-local workspace selection plus console-context sync sequences scattered across multiple components
- console-local command branching that knows too much about downstream feature execution
- toolbar or viewport affordances that invoke view behavior without going through the same underlying command meaning the console can reach

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

### Concrete File Targets

The expected first implementation cut should touch some subset of:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserRowActions.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/workspaceIntents.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/viewerBridge.ts`

Important rule:
- adding a new command family should default to one of those owner seams first
- if a new command cannot clearly fit one of those owners, that is an architecture decision to resolve before surface work expands

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

Concrete test files `5.1G` should expect to update:
- `src/app/store/workspaceIntents.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/panels/browserInteractions.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserRowActions.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/components/ViewerHost.test.tsx`

If view-command coverage still lacks one direct toolbar-surface test, add:
- `src/app/components/ViewToolbar.test.tsx`

Recommended first verification scenarios:
- the same workspace target activation can be reached from `Console` and `Browser` without diverging selected-target or console-context truth
- the same sketch-plane or sketch-draw verb can be reached from `Console` and `ViewportOverlay` without forking session state
- the same projection or framing action can be reached from `Console` and `View Toolbar` through the same underlying view seam

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

Implementation-ready completion bar:
- the doc names the live owner seams and adapter files actually present in the repo
- the first migration families are concrete enough to code without re-deciding ownership from scratch
- the expected file targets and test targets are explicit
- `5.1G` can now be picked up as an execution phase instead of needing another doc-cleanup pass first

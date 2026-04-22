# Edit History 0 - Undoable Surface Audit And First Coverage Recommendation

## Doc Header

### Doc History
1. 2026-04-22 00:00:54: Created this `Edit History 0` audit doc to inventory the live app surfaces that could become undoable, separate authored edits from navigation and runtime state, and recommend the first undoable coverage order before `Edit History 1` implements the canonical transaction foundation

### Purpose

This doc is the `Edit History` Phase 0 audit.

Use it to answer:
- what current ParaHook actions could eventually become undoable
- which actions should become undoable first
- which actions should stay out of canonical `Ctrl+Z` / `Ctrl+Y` for now
- which live code seams already look closest to undoable command boundaries
- how `Edit History 1` should narrow the first canonical transaction foundation

### Why This Phase Exists

The `Edit History` family already says ParaHook needs one canonical authored-change history.

Before building that layer, the app needs a grounded inventory of the current mutation surfaces so the first implementation does not accidentally:
- make local view/navigation state part of authored undo
- treat build/runtime events as user-authored edits
- skip high-value graph and project mutations
- harden another one-off history owner beside canonical edit history

This audit is intentionally broad.

It includes surfaces that should become undoable soon, surfaces that may become undoable later, and surfaces that should not enter canonical edit history unless their ownership becomes explicitly authored.

### Scope

This phase covers:
- a live source audit of likely undoable mutation seams
- a recommended coverage order
- first-pass transaction boundary guidance
- explicit exclusions from canonical edit history

This phase does not cover:
- implementing undo/redo
- choosing final storage internals
- adding keyboard shortcuts
- designing a full history UI
- Build Path scrub/restore behavior

## Doc Body

### Audit Source

This audit is grounded in the current store and command seams:
- `src/app/spaghetti/graphCommands/`
  - already contains command-shaped graph mutation helpers for add/remove nodes, add/remove/replace edges, node params, and node positions
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns graph documents, graph mutations, sketch sessions, feature-stack edits, graph receive references, output/runtime build state, and editor viewport state
- `src/app/store/useAppStore.ts`
  - owns project content, Browser/content actions, references/import, visibility, viewer transform sessions/history, view-presentation settings, and workspace selection
- `src/app/workspace/useWorkspaceStore.ts`
  - owns workspace shell layout, floating/split/popout/redock, viewport slots, and surface placement
- `src/app/panels/useBrowserPanelController.ts`
  - wires Browser rows to project/reference/import/content actions
- `src/app/console/`
  - adapts console commands into the same mutation seams used by visible surfaces
- `src/app/notepad/useNotepadStore.ts`
  - owns user-authored notes
- `src/app/dashboard/useDashboardStore.ts`
  - owns dashboard lanes and sticky-note layout
- `src/app/store/uiPrefsStore.ts`
  - owns view, environment, material, light, and tool setting changes
- `src/app/store/audioSamplerStore.ts`
  - owns optional radio/sampler state and sampler edit controls

### Canonical Rule From The Audit

The first `Edit History` owner should record authored state changes, not surface-local activity.

Use this split:
- undoable authored edits
  - graph structure, graph parameters, sketch entities, feature stack, project content organization, committed transforms, imports accepted into project state, user notes, durable material/environment edits
- not first-pass authored edits
  - selection, hover, command recall, camera movement, active panel focus, drag previews, build progress, runtime request ids, loading statuses, and pure workspace navigation

### Transaction Boundary Rules

The audit reinforces the existing family decisions:
- one pointer drag should normally become one undo step on release
- one slider drag should normally become one undo step on release
- one text/numeric edit should become one undo step on `Enter`, blur, or explicit commit
- one drag-reparent/drop should become one undo step on drop
- one console command that mutates authored state should reuse the same transaction as the visible UI path
- build/runtime side effects should refresh from the restored authored state instead of becoming separate undo entries

## Vision

`Edit History 0` should leave the family with a clear first map:
- many things in ParaHook could eventually be undoable
- the first real canonical undo layer should start with graph-authored CAD truth
- project/content organization and committed transforms should follow soon after
- shell layout, view preferences, runtime state, and optional side systems should wait until the authored-history foundation is stable

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-HLG-0. Audit everything in the current app that could reasonably become undoable`
- [x] `Edit-History-HLG-1. Produce a practical list of what should become undoable first`
- [x] `Edit-History-HLG-2. Keep canonical undo focused on authored edits instead of navigation, runtime, or view-state noise`

### Codex Level Goals

- [x] CLG 1. Inventory mutation seams across graph, Browser/project content, transform, import/reference, workspace shell, view/environment, dashboard/notepad, and optional runtime systems.
- [x] CLG 2. Rank likely undoable actions into first-wave, second-wave, later, and not-canonical-first-pass buckets.
- [x] CLG 3. Identify live code seams that should guide `Edit History 1` transaction adapter design.

### `Edit History 0 / Phase 1`

- [x] `HLG 0. Audit everything in the current app that could reasonably become undoable`
- [x] `HLG 1. Produce a practical list of what should become undoable first`
- [x] `HLG 2. Keep canonical undo focused on authored edits instead of navigation, runtime, or view-state noise`
- [x] scan the live graph command and store mutation seams
- [x] classify possible undoable actions by priority and ownership risk
- [x] write the recommendation into this standalone audit doc

## [x] `Edit History 0 / Phase 1` - `Undoable Surface Audit`

### Phase 1 Summary

#### Purpose

Create the first whole-app undoability audit before `Edit History 1` implements canonical transaction storage.

#### Owns

- identifying everything that could become undoable
- recommending what should become undoable first
- keeping non-authored state out of the first undo/redo promise
- naming likely owner seams for later implementation

#### Does Not Own

- adding undo/redo code
- changing stores
- changing keyboard behavior
- adding history UI
- deciding Build Path replay/checkpoint semantics

### Undoable Surface Audit

#### 1. Graph Documents And Spaghetti Graph Structure

Could be undoable:
- create graph document
- duplicate graph document
- load graph document into a new graph document
- bind or swap an editor viewport to a graph document, if treated as authored workspace/document state
- add graph node
- remove graph node
- connect wire
- remove wire
- replace wire through auto-replace
- move node
- change node row mode if row mode remains graph UI state
- change node params
- add/remove graph receive reference
- change graph output/publish-facing declarations as those surfaces widen

Strong live seams:
- `src/app/spaghetti/graphCommands/addNode.ts`
- `src/app/spaghetti/graphCommands/removeNode.ts`
- `src/app/spaghetti/graphCommands/addEdge.ts`
- `src/app/spaghetti/graphCommands/removeEdge.ts`
- `src/app/spaghetti/graphCommands/replaceEdge.ts`
- `src/app/spaghetti/graphCommands/setNodeParams.ts`
- `src/app/spaghetti/graphCommands/setNodePosition.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Recommendation:
- make graph node, wire, node position, and node parameter commits the first real undoable surface
- defer graph document create/duplicate/load until the base graph transaction model is stable
- treat selection, hover, fit-to-node, and console preview node state as non-undoable view/navigation state

#### 2. Feature Stack And Node-Owned CAD Authoring

Could be undoable:
- add sketch feature
- add close-profile feature
- add extrude feature
- move feature up/down
- enable/disable feature
- collapse/expand feature only if collapse is treated as authored editor state
- add/remove sketch component in a feature stack
- move sketch component up/down
- edit sketch component points
- set rectangle dimensions
- set close-profile source
- set extrude depth, taper, offset, and profile reference

Strong live seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/ui/features/`
- `src/app/spaghetti/features/`

Recommendation:
- include feature-stack and node-owned CAD parameter commits in the first graph-focused coverage wave after base graph commands
- treat feature collapse/expand as lower priority unless it becomes explicitly authored editor state

#### 3. Sketch Plane And Sketch Draw

Could be undoable:
- set sketch plane source, offset, translation axes, rotation axes, and in-plane rotation
- accept sketch plane transform command
- merge, lock, delete, or edit sketch-plane transform history entries
- append sketch draw component
- update sketch draw component point
- name sketch components and draw groups
- move sketch components up/down
- remove sketch components
- delete selected sketch components
- finish a draw draft into committed sketch geometry
- selected profile changes if they become authored output intent

Should not be canonical first-pass undo:
- hover point
- snap target preview
- selection-window draft
- selected sketch components as pure temporary selection
- undoing one draft point inside an unfinished draw draft, unless it stays a sketch-local draft action separate from app-wide undo

Strong live seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/sketchCommands/drawCommands.ts`
- `src/app/components/ViewportOverlay.tsx`

Recommendation:
- make committed sketch entity changes undoable early because they are authored geometry
- keep live draft edits local until commit boundaries are crisp
- do not let sketch-local draft undo pretend to be the same thing as app-wide authored undo until the transaction model supports nested/draft scopes

#### 4. Browser And Project Content Organization

Could be undoable:
- create project assembly
- create project component
- rename assembly/component
- move/reorder/reparent project content owners
- batch move content owners
- delete assembly/component
- add imported reference to project content
- remove imported reference
- explode imported reference
- commit staged import draft into project content
- staged import preview owner create/remove/move
- staged import file mode, up-axis, scale alignment, and scale multiplier edits
- staged import draft file add/remove

Possibly undoable later:
- visibility toggles for references, categories, parts, sketches, and content rows
- build policy changes for graph or content rows
- part selection or explicit Browser selection only if selection becomes authored, which it currently is not

Strong live seams:
- `src/app/store/useAppStore.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserContentDrag.ts`

Recommendation:
- make rename, create, delete, move/reparent, and import commit undoable in the second coverage wave
- include Browser and Console parity by routing console content commands through the same store mutations
- keep visibility and selection out of first-pass canonical undo unless the product chooses to treat view/presentation edits as authored content state

#### 5. Viewer Transform And Transform History

Could be undoable:
- committed viewer transform entry for references
- committed viewer transform entry for generated content objects
- committed environment light transform entry if environment lights remain authored scene content
- reset transform
- edit transform history entry delta
- delete transform history entry
- toggle transform history lock
- merge transform history
- transform snap setting changes

Should not be first-pass canonical undo:
- live transform draft frames
- active handle changes
- transform shell enter/exit
- history scrub index as navigation/read state

Strong live seams:
- `src/app/store/useAppStore.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/console/referenceTransformConsole.ts`

Recommendation:
- make committed viewer transform entries undoable after graph and Browser foundation
- keep live drags responsive and commit one undo entry on release/commit
- treat transform history scrub as a derived reader/navigation state, not as authored undo

#### 6. Workspace Shell, Surface Placement, And Layout

Could be undoable someday:
- split viewport slot
- remove viewport slot
- change viewport surface kind
- float, popout, redock, or detach a surface
- set viewport layout split ratio
- browser floating position/size
- browser presentation mode
- editor viewport window mode, position, size, split ratio, split direction, dock side, and split priority
- left dock width and split state
- workspace persisted layout hydration if used as explicit restore state

Strong live seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/hosts/useAppShellWorkspaceMenus.tsx`
- `src/app/workspace/WorkspaceViewportTree.tsx`

Recommendation:
- do not include workspace shell layout in the first canonical CAD edit-history promise
- consider a later layout undo stack or optional app-wide undo integration once authored CAD undo is stable
- never let surface focus, active viewport, hover menus, or transient split previews become authored undo entries

#### 7. View, Environment, Materials, And Presentation Settings

Could be undoable:
- apply environment preset
- apply HDRI environment
- set HDRI visibility, intensity, background intensity, and rotation
- set environment grade
- add, delete, update, and select environment lights where selection is only local
- update material preset
- add/delete material preset
- assign/clear part material
- set per-part material map
- set viewport presentation opacity/color if those are treated as authored view presets
- grid/background/projection/lens/view settings as the View Toolbar family matures

Should not be first-pass canonical undo:
- temporary environment comparison toggle
- capture/recall preview state unless explicitly promoted to authored environment look
- camera orbit/pan/zoom navigation
- camera shortcut transition timing

Strong live seams:
- `src/app/store/uiPrefsStore.ts`
- `src/app/components/ViewToolbar.tsx`

Recommendation:
- make durable environment/material edits undoable later, after CAD graph/content undo exists
- keep camera/navigation and pure preference toggles outside canonical edit history until the app defines a separate view-preset authoring model

#### 8. Catalog, Source Options, And Import Intake

Could be undoable:
- add catalog item/reference to project
- commit a staged Catalog or Import result into project content
- staged source option choices that become accepted project/import state
- local source-library metadata edits if future UI allows user-authored edits

Should not be canonical undo:
- load preview
- source metadata refresh
- cached source fetch/update status
- archive inspection
- ZIP preview/list expansion
- provider fallback state
- local mirror write status

Strong live seams:
- `src/app/catalog/`
- `src/app/workspace/CatalogSurface.tsx`
- `src/app/panels/useBrowserPanelController.ts`

Recommendation:
- route accepted catalog/import commits through project-content undo later
- keep network, cache, provider, preview, and inspection state out of canonical undo

#### 9. Notepad And Dashboard

Could be undoable:
- create note
- rename note
- edit note body
- delete note
- pin/unpin note
- change note color
- create, rename, remove dashboard lane
- resize adjacent dashboard lanes
- move sticky note position
- move sticky note between lanes
- resize sticky note
- attach/detach sticky note parent
- remove sticky note layout

Strong live seams:
- `src/app/notepad/useNotepadStore.ts`
- `src/app/dashboard/useDashboardStore.ts`

Recommendation:
- make these undoable later, probably behind their own surface adapters
- note body edits need text-editor-style coalescing, not one history entry per keystroke
- dashboard drags/resizes should commit one undo entry on release

#### 10. Radio And Sampler

Could be undoable:
- radio URL
- sample burst time
- randomized sample times if treated as an authored sampler edit
- sampler step count
- sampler BPM
- sampler step cue ratio
- sampler step playback shape
- reroll step/all steps
- enable/disable or lock/unlock sampler step
- note repeat settings

Should not be canonical undo:
- play/stop transport
- current playhead
- waveform/runtime load state
- seek requests
- handled request ids
- burst preview requests
- toolbar expanded/collapsed chrome

Strong live seams:
- `src/app/store/audioSamplerStore.ts`

Recommendation:
- optional later adapter only
- keep radio/sampler runtime transport separate from authored edit history

### What Should Become Undoable First

Recommended first coverage order:

1. Graph structure and graph parameters
   - node add/remove
   - wire connect/remove/replace
   - node move, coalesced on drag release
   - node parameter commits, coalesced for sliders and typed fields

2. Node-owned CAD authoring
   - feature add/remove where supported
   - feature move up/down
   - feature enable/disable
   - sketch component add/update/move/remove/name
   - sketch plane committed source/transform edits
   - extrude depth/taper/offset/profile-ref commits

3. Browser/project content organization
   - create assembly/component
   - rename assembly/component
   - move/reparent/reorder
   - delete assembly/component
   - import/catalog commit into project content

4. Committed viewer transform
   - committed move/rotate/scale entries
   - reset transform
   - edit/delete/merge/lock history rows only after entry-level undo semantics are clear

5. Durable scene presentation edits
   - materials
   - environment lights
   - authored view preset/settings, only after the product decides which view changes are authored content

6. Surface-local productivity systems
   - notepad
   - dashboard
   - optional sampler settings
   - workspace layout undo if needed

### What Should Not Become Canonical Undo First

Do not include these in the first canonical `Edit History` implementation:
- camera orbit, pan, zoom, fly, or view navigation
- hover state
- selection-only state
- focus/active-surface state
- open/close menus
- command recall
- console transcript entries
- build request ids, progress, accepted result arrival, cache handles, or runtime load statuses
- live drag frames
- live slider ticks before release
- sketch draw draft points before a committed sketch entity is created
- transform history scrub index
- Build Path playhead navigation
- catalog source refresh, provider status, archive inspection, ZIP preview, or local mirror write status
- radio play/stop, seek, waveform, runtime state, or preview burst requests

### Edit History 1 Recommendation

`Edit History 1` should implement one canonical transaction foundation without trying to cover every audited surface.

Recommended first implementation target:
- one shared edit-history owner
- one entry shape that can hold:
  - entry id
  - source surface
  - target identity
  - human-readable label
  - timestamp
  - apply/undo payload or before/after snapshots
  - transaction grouping metadata
- one transaction lifecycle:
  - begin
  - update draft
  - commit
  - cancel
- one adapter for graph commands first
- one keyboard dispatch path for `Ctrl+Z` / `Ctrl+Y`
- tests proving graph command undo/redo for add node, remove node, add edge, remove edge, set params, and set position

No-widening rule:
- do not start with Browser, transform, workspace layout, or Build Path until graph commands prove the canonical owner model

### Acceptance Read

This audit is complete when:
- the Edit History family has a visible Phase 0 before implementation
- the possible undoable surfaces are listed across the app
- the recommended first undoable coverage is explicit
- non-authored state is clearly excluded from the first canonical undo promise
- `Edit History 1` has a narrow enough first target to implement next
